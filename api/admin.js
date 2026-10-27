import { createHash, createHmac, timingSafeEqual } from 'node:crypto';
import { access, mkdir, readFile, readdir, unlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { validateArticle } from '../scripts/article-validation.mjs';
import { dispatchWorkflow, loadArticles, syncSlug } from '../scripts/github-content.mjs';
import { loadFiction, syncFictionFile } from '../scripts/fiction-content.mjs';
import { expireStaleJobs, openStateStore } from '../scripts/remote-state.mjs';

// The automation module reads these directories at import time, so they must be set first.
const workDirectory = join(tmpdir(), 'lokkee-admin');
const articleDirectory = join(workDirectory, 'articles');
const automationDirectory = join(workDirectory, 'automation');
const fictionSeriesDirectory = join(workDirectory, 'fiction', 'series');
const fictionEpisodesDirectory = join(workDirectory, 'fiction', 'episodes');
process.env.CONTENT_ARTICLES_DIR = articleDirectory;
process.env.CONTENT_AUTOMATION_DATA_DIR = automationDirectory;

const cookieName = 'lokkee_admin';
const sessionSeconds = 8 * 60 * 60;
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const uuidPattern = /^[a-f\d-]{36}$/i;
const maxBodyBytes = 1_000_000;
const loginWindowMs = 15 * 60 * 1000;
const maxLoginAttempts = 8;

let modulesPromise;
function loadModules() {
  modulesPromise ||= (async () => {
    const [automation, siteData, legacyContent, comparison, categories, fictionGenres, contentCategories] = await Promise.all([
      import('../scripts/content-automation.mjs'),
      import('../src/data/siteData.js'),
      import('../src/data/legacyArticleContent.js'),
      import('../src/data/comparisonData.js'),
      import('../src/data/automationCategories.js'),
      import('../src/data/fictionGenres.js'),
      import('../src/data/contentCategories.js'),
    ]);
    automation.setWorkerDispatcher(dispatchWorkflow);
    return {
      automation,
      legacyArticles: siteData.articlePreviews,
      categoryNames: new Set([
        ...siteData.categories.map((category) => category.title),
        ...categories.automationArticleCategoryNames,
        ...fictionGenres.fictionGenres.map((genre) => genre.label),
        ...contentCategories.aiSubcategoryTitles,
      ]),
      automationCategoryNames: categories.automationCategoryNames,
      getLegacyArticleContent: legacyContent.getLegacyArticleContent,
      legacyArticleContentToMarkdown: legacyContent.legacyArticleContentToMarkdown,
      comparisonDataForArticle: comparison.comparisonDataForArticle,
    };
  })();
  return modulesPromise;
}

// Each request works on one shared scratch directory, so requests in one instance run one at a time.
let queue = Promise.resolve();
function exclusive(task) {
  const run = queue.then(task, task);
  queue = run.catch(() => {});
  return run;
}

class HttpError extends Error {
  constructor(status, message) { super(message); this.status = status; }
}

async function withState(articleMode, task, { saveOnError = false } = {}) {
  return exclusive(async () => {
    const modules = await loadModules();
    const store = await openStateStore();
    try {
      await store.load(automationDirectory);
      await expireStaleJobs(automationDirectory);
      await mkdir(articleDirectory, { recursive: true });
      const remote = articleMode ? await loadArticles(articleDirectory, articleMode === 'all' ? {} : { only: articleMode.only }) : null;
      let result;
      try {
        result = await task({ ...modules, store, remote });
      } catch (error) {
        if (saveOnError) await store.save(automationDirectory).catch(() => {});
        throw error;
      }
      await store.save(automationDirectory);
      return result;
    } finally {
      await store.close();
    }
  });
}

const digest = (value) => createHash('sha256').update(String(value)).digest();
const safeEqual = (first, second) => timingSafeEqual(digest(first), digest(second));
const sessionSecret = () => process.env.ADMIN_SESSION_SECRET || '';
const adminPassword = () => process.env.ADMIN_PASSWORD || '';
const configured = () => adminPassword().length >= 16 && sessionSecret().length >= 32;
const sign = (value) => createHmac('sha256', sessionSecret()).update(value).digest('hex');

function cookieValue(req, name) {
  return (req.headers.cookie || '').match(new RegExp(`(?:^|;\\s*)${name}=([^;]+)`))?.[1] || '';
}

function isAuthenticated(req) {
  if (!configured()) return false;
  const [expires, signature] = cookieValue(req, cookieName).split('.');
  if (!expires || !signature || !/^\d+$/.test(expires) || Number(expires) < Date.now()) return false;
  return safeEqual(signature, sign(expires));
}

function sessionCookie(value, maxAge) {
  return `${cookieName}=${value}; HttpOnly; Secure; SameSite=Strict; Path=/__local-content; Max-Age=${maxAge}`;
}

function clientAddress(req) {
  return String(req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'unknown';
}

const memoryAttempts = new Map();

function memoryLoginAttempt(req) {
  const id = clientAddress(req);
  const now = Date.now();
  const current = memoryAttempts.get(id);
  const fresh = !current || now - current.startedAt >= loginWindowMs;
  const next = { startedAt: fresh ? now : current.startedAt, count: (fresh ? 0 : current.count) + 1 };
  memoryAttempts.set(id, next);
  return { allowed: next.count <= maxLoginAttempts, reset: async () => { memoryAttempts.delete(id); } };
}

// The shared limiter lives in MongoDB; if it is unreachable, fall back to a per-instance limiter
// so a database outage never opens sign-in without any limit.
async function consumeLoginAttempt(req) {
  let store;
  try {
    store = await openStateStore();
    const attempts = store.client.db('toolpilot').collection('lokkee_admin_attempts');
    const id = createHash('sha256').update(clientAddress(req)).digest('hex');
    const now = Date.now();
    const current = await attempts.findOne({ _id: id });
    const fresh = !current || now - current.startedAt >= loginWindowMs;
    const next = { startedAt: fresh ? now : current.startedAt, count: (fresh ? 0 : current.count) + 1 };
    await attempts.replaceOne({ _id: id }, { _id: id, ...next }, { upsert: true });
    return { allowed: next.count <= maxLoginAttempts, reset: () => attempts.deleteOne({ _id: id }) };
  } catch (error) {
    console.error('Login rate limit store unavailable:', error.name, String(error.message).slice(0, 200));
    return memoryLoginAttempt(req);
  } finally {
    await store?.close();
  }
}

function readBody(req) {
  const body = req.body;
  if (body && typeof body === 'object') {
    if (JSON.stringify(body).length > maxBodyBytes) throw new HttpError(413, 'Request body is too large.');
    return body;
  }
  if (typeof body === 'string' && body) {
    if (body.length > maxBodyBytes) throw new HttpError(413, 'Request body is too large.');
    try { return JSON.parse(body); } catch { throw new HttpError(400, 'Request body must be valid JSON.'); }
  }
  return {};
}

function send(res, status, payload, headers = {}) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  for (const [key, value] of Object.entries(headers)) res.setHeader(key, value);
  res.status(status).json(payload);
}

async function exists(file) {
  try { await access(file); return true; } catch { return false; }
}

async function removeIfPresent(file) {
  await unlink(file).catch((error) => { if (error.code !== 'ENOENT') throw error; });
}

async function listArticles(modules) {
  const { legacyArticles, getLegacyArticleContent, legacyArticleContentToMarkdown, comparisonDataForArticle } = modules;
  const { readdir } = await import('node:fs/promises');
  const filenames = await readdir(articleDirectory);
  const deleted = new Set(filenames.filter((name) => name.endsWith('.deleted')).map((name) => name.slice(0, -'.deleted'.length)));
  const legacySlugs = new Set(legacyArticles.map((article) => article.slug));
  const articles = new Map(legacyArticles.filter((article) => !deleted.has(article.slug)).map((article) => [article.slug, {
    ...article,
    content: legacyArticleContentToMarkdown(getLegacyArticleContent(article.slug)),
    publishedAt: article.date, updatedAt: article.updated, seoTitle: '', metaDescription: '',
    status: 'published', comparison: comparisonDataForArticle(article.slug), source: 'code',
  }]));
  for (const filename of filenames.filter((name) => name.endsWith('.json') || name.endsWith('.draft'))) {
    const article = JSON.parse(await readFile(join(articleDirectory, filename), 'utf8'));
    articles.set(article.slug, { ...articles.get(article.slug), ...article, source: legacySlugs.has(article.slug) ? 'override' : 'local' });
  }
  return [...articles.values()].sort((first, second) => first.title.localeCompare(second.title));
}

async function saveArticle(slug, article, modules, remote) {
  const published = join(articleDirectory, `${slug}.json`);
  const draft = join(articleDirectory, `${slug}.draft`);
  const wasPublished = await exists(published);
  const words = article.content.trim().split(/\s+/).filter(Boolean).length;
  const articleToSave = { ...article, readTime: `${Math.max(1, Math.ceil(words / 200))} min read` };
  await writeFile(article.status === 'published' ? published : draft, `${JSON.stringify(articleToSave, null, 2)}\n`);
  await removeIfPresent(article.status === 'published' ? draft : published);
  await removeIfPresent(join(articleDirectory, `${slug}.deleted`));
  const changed = await syncSlug(articleDirectory, slug, remote, `Admin: update article ${slug}`);
  const legacy = modules.legacyArticles.some((item) => item.slug === slug);
  return {
    article: { ...articleToSave, source: legacy ? 'override' : 'local' },
    deploymentTriggered: changed && (article.status === 'published' || wasPublished),
  };
}

async function deleteArticle(slug, modules, remote) {
  const legacy = modules.legacyArticles.some((item) => item.slug === slug);
  const wasPublished = await exists(join(articleDirectory, `${slug}.json`));
  await removeIfPresent(join(articleDirectory, `${slug}.json`));
  await removeIfPresent(join(articleDirectory, `${slug}.draft`));
  if (legacy) await writeFile(join(articleDirectory, `${slug}.deleted`), 'deleted\n');
  const changed = await syncSlug(articleDirectory, slug, remote, `Admin: delete article ${slug}`);
  return { deleted: slug, deploymentTriggered: changed && (wasPublished || legacy) };
}

function safeDecode(value) {
  try { return decodeURIComponent(value); } catch { return value; }
}

async function handleSession(req, res, route) {
  if (route === 'session' && req.method === 'GET') {
    return send(res, 200, { authenticated: isAuthenticated(req), passwordConfigured: configured() });
  }
  if (route === 'session' && req.method === 'POST') {
    if (!configured()) {
      return send(res, 503, { error: 'ADMIN_PASSWORD (16+ characters) and ADMIN_SESSION_SECRET (32+ characters) must be set on the server.' });
    }
    const attempt = await consumeLoginAttempt(req);
    if (!attempt.allowed) return send(res, 429, { error: 'Too many sign-in attempts. Wait 15 minutes before trying again.' });
    const body = readBody(req);
    if (typeof body.password !== 'string' || body.password.length > 256 || !safeEqual(body.password, adminPassword())) {
      return send(res, 401, { error: 'The password is incorrect.' });
    }
    await attempt.reset().catch(() => {});
    const expires = String(Date.now() + sessionSeconds * 1000);
    return send(res, 200, { authenticated: true }, { 'Set-Cookie': sessionCookie(`${expires}.${sign(expires)}`, sessionSeconds) });
  }
  if (route === 'session/logout' && req.method === 'POST') {
    return send(res, 200, { authenticated: false }, { 'Set-Cookie': sessionCookie('', 0) });
  }
  return false;
}

async function handleArticles(req, res, route) {
  if (route === 'articles' && req.method === 'GET') {
    const articles = await withState('all', ({ ...modules }) => listArticles(modules));
    return send(res, 200, { articles });
  }
  const match = route.match(/^articles\/([a-z0-9-]+)$/);
  if (!match) return false;
  const slug = match[1];
  if (!slugPattern.test(slug)) return send(res, 400, { error: 'Invalid article slug.' });
  if (req.method === 'PUT') {
    const article = readBody(req);
    const result = await withState({ only: slug }, async (modules) => {
      const problem = validateArticle(article, slug, modules.categoryNames);
      if (problem) throw new HttpError(400, problem);
      return saveArticle(slug, article, modules, modules.remote);
    });
    return send(res, 200, result);
  }
  if (req.method === 'DELETE') {
    return send(res, 200, await withState({ only: slug }, (modules) => deleteArticle(slug, modules, modules.remote)));
  }
  return false;
}

async function handleFiction(req, res, route) {
  if (route === 'fiction' && req.method === 'GET') {
    const result = await exclusive(async () => {
      await mkdir(fictionSeriesDirectory, { recursive: true });
      await mkdir(fictionEpisodesDirectory, { recursive: true });
      return loadFiction(fictionSeriesDirectory, fictionEpisodesDirectory);
    });
    const readAll = async (directory) => {
      const { readdir, readFile } = await import('node:fs/promises');
      return Promise.all((await readdir(directory)).filter((name) => name.endsWith('.json'))
        .map(async (name) => JSON.parse(await readFile(join(directory, name), 'utf8'))));
    };
    const series = (await readAll(fictionSeriesDirectory)).sort((first, second) => first.title.localeCompare(second.title));
    const episodes = (await readAll(fictionEpisodesDirectory)).sort((first, second) => first.number - second.number);
    return send(res, 200, { series, episodes, remote: result });
  }

  const match = route.match(/^fiction\/(series|episodes)\/([a-z0-9-]+)(?:\/([a-z0-9-]+))?$/);
  if (!match || req.method !== 'PUT') return false;
  const [, kind, seriesSlug, episodeSlug] = match;
  const isEpisode = kind === 'episodes';
  const slug = isEpisode ? episodeSlug : seriesSlug;
  if (!slugPattern.test(seriesSlug) || (isEpisode && !slugPattern.test(slug))) {
    return send(res, 400, { error: 'Invalid fiction slug.' });
  }
  const item = readBody(req);
  const required = isEpisode
    ? ['slug', 'seriesSlug', 'number', 'title', 'excerpt', 'content']
    : ['slug', 'title', 'genre', 'synopsis'];
  for (const field of required) {
    const value = item[field];
    if (value === undefined || value === null || String(value).trim() === '') {
      return send(res, 400, { error: `${field} is required.` });
    }
  }
  if (item.slug !== slug || (isEpisode && item.seriesSlug !== seriesSlug)) {
    return send(res, 400, { error: 'Slug must match the request URL.' });
  }
  if (!['draft', 'published'].includes(item.status)) {
    return send(res, 400, { error: 'Status must be draft or published.' });
  }
  if (isEpisode && (!Number.isInteger(item.number) || item.number < 1)) {
    return send(res, 400, { error: 'Episode number must be a positive whole number.' });
  }
  const directory = isEpisode ? fictionEpisodesDirectory : fictionSeriesDirectory;
  const folderPath = isEpisode ? 'content/fiction/episodes' : 'content/fiction/series';
  const filename = `${slug}.json`;
  const outcome = await exclusive(async () => {
    await mkdir(directory, { recursive: true });
    const remote = await loadFiction(fictionSeriesDirectory, fictionEpisodesDirectory);
    await writeFile(join(directory, filename), `${JSON.stringify(item, null, 2)}\n`);
    const remoteMap = isEpisode ? remote.episodes : remote.series;
    await syncFictionFile(directory, filename, folderPath, remoteMap, `Admin: save ${isEpisode ? 'episode' : 'series'} ${slug}`);
    return { item, deploymentTriggered: true };
  });
  return send(res, 200, outcome);
}

async function handleAutomation(req, res, route) {
  if (route === 'automation' && req.method === 'GET') {
    const dashboard = await withState('all', async ({ automation, store }) => {
      const data = await automation.getDashboard();
      const meta = await store.getMeta();
      return meta.providerStatus ? { ...data, providerStatus: meta.providerStatus } : data;
    });
    return send(res, 200, dashboard);
  }
  if (route === 'automation/settings' && req.method === 'PUT') {
    const body = readBody(req);
    return send(res, 200, { settings: await withState(null, ({ automation }) => automation.updateSettings(body)) });
  }
  if (route === 'automation/sources' && req.method === 'POST') {
    const body = readBody(req);
    return send(res, 201, { source: await withState(null, ({ automation }) => automation.saveSource(body)) });
  }
  const sourceMatch = route.match(/^automation\/sources\/([a-f\d-]{36})$/i);
  if (sourceMatch && req.method === 'DELETE') {
    return send(res, 200, { deleted: await withState(null, ({ automation }) => automation.deleteSource(sourceMatch[1])) });
  }
  if (route === 'automation/jobs' && req.method === 'POST') {
    const body = readBody(req);
    const job = await withState(null, ({ automation, automationCategoryNames }) => {
      if (body.categories !== undefined
        && (!Array.isArray(body.categories) || body.categories.some((category) => !automationCategoryNames.includes(category)))) {
        throw new HttpError(400, 'Choose valid categories for this update.');
      }
      return automation.startContentJob({ trigger: 'manual', categoryFilter: body.categories });
    }, { saveOnError: true });
    return send(res, 202, { job });
  }
  const jobMatch = route.match(/^automation\/jobs\/([a-f\d-]{36})(?:\/(retry))?$/i);
  if (jobMatch && req.method === 'GET' && !jobMatch[2]) {
    const job = await withState(null, ({ automation }) => automation.getJob(jobMatch[1]));
    return send(res, job ? 200 : 404, job ? { job } : { error: 'Processing job not found.' });
  }
  if (jobMatch && req.method === 'POST' && jobMatch[2] === 'retry') {
    const job = await withState(null, ({ automation }) => automation.retryJob(jobMatch[1]), { saveOnError: true });
    return send(res, 202, { job });
  }
  const storyMatch = route.match(/^automation\/stories\/(.+?)\/retry$/);
  if (storyMatch && req.method === 'POST') {
    const job = await withState(null, async ({ automation }) => {
      const raw = storyMatch[1];
      const storyId = (await automation.getStory(raw)) ? raw : safeDecode(raw);
      return automation.retryStory(storyId);
    }, { saveOnError: true });
    return send(res, 202, { job });
  }
  const draftMatch = route.match(/^automation\/drafts\/([a-z0-9-]+)\/(publish|reject|retry)$/);
  if (draftMatch && req.method === 'POST') {
    const [, slug, action] = draftMatch;
    const body = readBody(req);
    const result = await withState({ only: slug }, async ({ automation, remote }) => {
      if (action === 'retry') {
        const draft = JSON.parse(await readFile(join(articleDirectory, `${slug}.draft`), 'utf8').catch(() => {
          throw new HttpError(404, 'Draft not found.');
        }));
        return { job: await automation.retryStory(draft.automation?.storyId) };
      }
      const outcome = action === 'publish'
        ? await automation.publishDraft(slug, { highImpactReviewed: body.highImpactReviewed === true })
        : await automation.rejectDraft(slug);
      await syncSlug(articleDirectory, slug, remote, `Admin: ${action} automated draft ${slug}`);
      return outcome;
    }, { saveOnError: true });
    return send(res, action === 'retry' ? 202 : 200, result);
  }
  return false;
}

export default async function handler(req, res) {
  const route = String(req.query?.route || '').replace(/^\/+|\/+$/g, '');
  try {
    if (!['GET', 'POST', 'PUT', 'DELETE'].includes(req.method)) return send(res, 405, { error: 'Method not allowed.' });
    if (req.method !== 'GET') {
      const origin = req.headers.origin;
      if (!origin || new URL(origin).host !== req.headers.host) return send(res, 403, { error: 'Requests must come from the admin page.' });
    }
    if (await handleSession(req, res, route) !== false) return;
    if (!isAuthenticated(req)) return send(res, 401, { error: 'Sign in to use the admin editor.' });
    if (await handleArticles(req, res, route) !== false) return;
    if (await handleFiction(req, res, route) !== false) return;
    if (await handleAutomation(req, res, route) !== false) return;
    return send(res, 404, { error: 'Admin endpoint not found.' });
  } catch (error) {
    if (error instanceof HttpError) return send(res, error.status, { error: error.message });
    const message = String(error?.message || 'Request failed.').slice(0, 300);
    console.error('Admin request failed:', error?.name, error?.code, message);
    const status = /not found/i.test(message) ? 404 : /already running|just submitted/i.test(message) ? 409 : error.code ? 500 : 400;
    const databaseDown = /Mongo|ECONN|ENOTFOUND|ETIMEDOUT|Server selection|bad auth|Authentication failed/i.test(`${error?.name} ${message}`);
    return send(res, status, {
      error: databaseDown
        ? 'The database is unreachable. Check MONGODB_URI and the MongoDB Atlas network access list (allow 0.0.0.0/0 for Vercel).'
        : error.code ? 'Admin data could not be accessed.' : message,
    });
  }
}
