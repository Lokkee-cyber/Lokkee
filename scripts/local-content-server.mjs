import dotenv from 'dotenv';
import { execFile } from 'node:child_process';
import { randomBytes, timingSafeEqual } from 'node:crypto';
import { createServer } from 'node:http';
import {
  access,
  mkdir,
  readFile,
  readdir,
  rename,
  unlink,
  writeFile,
} from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

dotenv.config({ path: resolve(root, '.env') });

const contentDirectory = resolve(root, 'content', 'articles');
const host = '127.0.0.1';
const port = Number(process.env.LOCAL_CONTENT_PORT || 4179);

const allowedOrigins = new Set([
  'http://127.0.0.1:5173',
  'http://localhost:5173',
]);

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const maxRequestBytes = 1_000_000;

const execFileAsync = promisify(execFile);
let publicationQueue = Promise.resolve();

const { articlePreviews: legacyArticles, categories } = await import(
  '../src/data/siteData.js'
);

const {
  getLegacyArticleContent,
  legacyArticleContentToMarkdown,
} = await import('../src/data/legacyArticleContent.js');

const { comparisonDataForArticle } = await import(
  '../src/data/comparisonData.js'
);

const {
  automationArticleCategoryNames,
  automationCategoryNames,
} = await import('../src/data/automationCategories.js');

const { fictionGenres } = await import('../src/data/fictionGenres.js');
const { aiSubcategoryTitles } = await import('../src/data/contentCategories.js');

const automationApi = await import('./content-automation.mjs');

const legacySlugs = new Set(
  legacyArticles.map((article) => article.slug)
);

const categoryNames = new Set([
  ...categories.map((category) => category.title),
  'AI Tools', 'AI Video', 'AI Image', 'AI Writing', 'AI Voice & Audio', 'AI Coding', 'AI for Creators', 'AI for Business', 'AI for Students', 'AI Comparisons',
  ...automationArticleCategoryNames,
  ...fictionGenres.map((genre) => genre.label),
  ...aiSubcategoryTitles,
]);

const sessions = new Map();
const requestBuckets = new Map();
const loginBuckets = new Map();

const adminPassword = process.env.LOCAL_CONTENT_ADMIN_PASSWORD || '';

function cookieValue(request, name) {
  const cookieHeader = request.headers.cookie || '';
  const match = cookieHeader.match(
    new RegExp(`(?:^|;\\s*)${name}=([^;]+)`)
  );

  return match?.[1] || '';
}

function isAuthenticated(request) {
  const token = cookieValue(request, 'toolpilot_admin');
  const expiresAt = token ? sessions.get(token) : 0;

  if (expiresAt && expiresAt > Date.now()) {
    return true;
  }

  if (token) {
    sessions.delete(token);
  }

  return false;
}

function consumeRateLimit(buckets, key, { windowMs, max }) {
  const now = Date.now();
  const previous = buckets.get(key);

  const bucket =
    !previous || now - previous.startedAt >= windowMs
      ? { startedAt: now, count: 0 }
      : previous;

  bucket.count += 1;
  buckets.set(key, bucket);

  if (buckets.size > 1000) {
    for (const [bucketKey, value] of buckets) {
      if (now - value.startedAt > windowMs) {
        buckets.delete(bucketKey);
      }
    }
  }

  return bucket.count <= max;
}

function constantTimeEqual(first, second) {
  const a = Buffer.from(first);
  const b = Buffer.from(second);

  if (a.length !== b.length) {
    timingSafeEqual(a, a);
    return false;
  }

  return timingSafeEqual(a, b);
}

function sendJson(response, statusCode, payload, extraHeaders = {}) {
  response.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
    ...extraHeaders,
  });

  response.end(JSON.stringify(payload));
}

function validateArticle(value, routeSlug) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return 'Expected an article object.';
  }

  const requiredStrings = [
    'title',
    'slug',
    'excerpt',
    'category',
    'content',
  ];

  for (const field of requiredStrings) {
    if (typeof value[field] !== 'string' || !value[field].trim()) {
      return `${field} is required.`;
    }
  }

  if (!slugPattern.test(value.slug) || value.slug !== routeSlug) {
    return 'Slug must be lowercase letters, numbers, and hyphens, and match the article URL.';
  }

  if (!['draft', 'published'].includes(value.status)) {
    return 'Status must be draft or published.';
  }

  if (value.automation?.generated && value.status === 'published') {
    return 'Automation drafts must be approved through Content Automation before publication.';
  }

  if (
    value.automation?.generated &&
    (
      !Array.isArray(value.sourceReferences) ||
      !value.sourceReferences.length ||
      value.sourceReferences.some((source) => {
        try {
          return new URL(source.url).protocol !== 'https:';
        } catch {
          return true;
        }
      })
    )
  ) {
    return 'Automation drafts must retain a valid HTTPS source reference.';
  }

  if (
    value.title.length > 160 ||
    value.excerpt.length > 500 ||
    value.content.length > 100_000
  ) {
    return 'Title, excerpt, or article content exceeds the allowed length.';
  }

  if (!categoryNames.has(value.category)) {
    return 'Choose one of the configured article categories.';
  }

  if (
    value.author !== undefined &&
    (
      typeof value.author !== 'string' ||
      value.author.length > 120
    )
  ) {
    return 'Author must be a string no longer than 120 characters.';
  }

  if (
    value.image !== undefined &&
    typeof value.image !== 'string'
  ) {
    return 'Image must be a string.';
  }

  if (value.image) {
    const isSitePath =
      value.image.startsWith('/') &&
      !value.image.startsWith('//');

    let isHttpsUrl = false;

    try {
      isHttpsUrl = new URL(value.image).protocol === 'https:';
    } catch {
      isHttpsUrl = false;
    }

    if (
      value.image.length > 2048 ||
      (!isSitePath && !isHttpsUrl)
    ) {
      return 'Image must be a secure https URL or a site-relative path.';
    }
  }

  if (
    value.seoTitle &&
    (
      typeof value.seoTitle !== 'string' ||
      value.seoTitle.length > 160
    )
  ) {
    return 'SEO title must be a string no longer than 160 characters.';
  }

  if (
    value.metaDescription &&
    (
      typeof value.metaDescription !== 'string' ||
      value.metaDescription.length > 320
    )
  ) {
    return 'Meta description must be a string no longer than 320 characters.';
  }

  for (const field of ['publishedAt', 'updatedAt']) {
    if (
      value[field] !== undefined &&
      typeof value[field] !== 'string'
    ) {
      return `${field} must be a date string.`;
    }
  }

  if (value.comparison !== undefined && value.comparison !== null) {
    const { objects, features } = value.comparison;

    if (
      !Array.isArray(objects) ||
      objects.length < 2 ||
      objects.length > 4
    ) {
      return 'Comparison articles must have between two and four compared objects.';
    }

    if (
      objects.some(
        (name) =>
          typeof name !== 'string' ||
          !name.trim() ||
          name.length > 80
      ) ||
      new Set(
        objects.map((name) => name.trim().toLowerCase())
      ).size !== objects.length
    ) {
      return 'Compared object names must be unique, non-empty strings no longer than 80 characters.';
    }

    if (!Array.isArray(features) || features.length < 1) {
      return 'Comparison articles must have at least one feature.';
    }

    if (
      features.some(
        (feature) =>
          !feature ||
          typeof feature.name !== 'string' ||
          !feature.name.trim() ||
          feature.name.length > 100 ||
          !Array.isArray(feature.values) ||
          feature.values.length !== objects.length ||
          feature.values.some(
            (item) =>
              typeof item !== 'string' ||
              !item.trim() ||
              item.length > 500
          )
      )
    ) {
      return 'Each comparison feature needs a name and a value for every compared object.';
    }

    if (!['AI Content', 'AI Comparisons'].includes(value.category)) {
      return 'Comparison articles must use the AI Content category.';
    }
  } else if (value.category === 'AI Comparisons') {
    return 'Choose comparison article and complete its comparison table.';
  }

  return null;
}

async function readRequestBody(request) {
  let body = '';
  let bytes = 0;

  for await (const chunk of request) {
    bytes += chunk.length;

    if (bytes > maxRequestBytes) {
      throw new Error('Request body is too large.');
    }

    body += chunk.toString('utf8');
  }

  try {
    return JSON.parse(body);
  } catch {
    throw new Error('Request body must be valid JSON.');
  }
}

async function listArticles() {
  await mkdir(contentDirectory, { recursive: true });

  const filenames = await readdir(contentDirectory);

  const deletedSlugs = new Set(
    filenames
      .filter((name) => name.endsWith('.deleted'))
      .map((name) => name.slice(0, -'.deleted'.length))
  );

  const articles = new Map(
    legacyArticles
      .filter((article) => !deletedSlugs.has(article.slug))
      .map((article) => {
        const content = getLegacyArticleContent(article.slug);

        return [
          article.slug,
          {
            ...article,
            content: legacyArticleContentToMarkdown(content),
            publishedAt: article.date,
            updatedAt: article.updated,
            seoTitle: '',
            metaDescription: '',
            status: 'published',
            comparison: comparisonDataForArticle(article.slug),
            source: 'code',
          },
        ];
      })
  );

  for (
    const filename of filenames.filter(
      (name) => name.endsWith('.json') || name.endsWith('.draft')
    )
  ) {
    const article = JSON.parse(
      await readFile(join(contentDirectory, filename), 'utf8')
    );

    articles.set(article.slug, {
      ...articles.get(article.slug),
      ...article,
      source: legacySlugs.has(article.slug) ? 'override' : 'local',
    });
  }

  return [...articles.values()].sort(
    (first, second) => first.title.localeCompare(second.title)
  );
}

async function removeIfPresent(filename) {
  try {
    await unlink(filename);
  } catch (error) {
    if (error.code !== 'ENOENT') {
      throw error;
    }
  }
}

/*
 * Checks whether an article file exists.
 */
async function fileExists(filename) {
  try {
    await access(filename);
    return true;
  } catch (error) {
    if (error.code === 'ENOENT') {
      return false;
    }

    throw error;
  }
}

/*
 * Pushes fiction series/episode files to GitHub.
 */
async function pushFictionToGitHub(seriesSlug, slug, isEpisode) {
  const relativePath = isEpisode
    ? `content/fiction/episodes/${slug}.json`
    : `content/fiction/series/${slug}.json`;

  const runGit = (args) =>
    execFileAsync('git', args, {
      cwd: root,
      windowsHide: true,
      timeout: 60_000,
      maxBuffer: 1024 * 1024,
    });

  await runGit(['add', '-A', '--', relativePath]);

  const { stdout } = await runGit([
    'status',
    '--porcelain',
    '--',
    relativePath,
  ]);

  const identity = [
    '-c',
    'user.name=LokkeeVerse Publisher',
    '-c',
    'user.email=lokkeeverse-publisher@users.noreply.github.com',
  ];

  if (stdout.trim()) {
    await runGit([
      ...identity,
      'commit',
      '--only',
      '-m',
      `Publish fiction: ${seriesSlug}${isEpisode ? ` episode ${slug}` : ''}`,
      '--',
      relativePath,
    ]);
  } else {
    await runGit([
      ...identity,
      'commit',
      '--allow-empty',
      '-m',
      `Trigger LokkeeVerse deployment: ${relativePath}`,
    ]);
  }

  await runGit(['push', 'origin', 'HEAD:main']);

  return true;
}

function queueFictionPush(seriesSlug, slug, isEpisode) {
  const operation = publicationQueue.then(
    () => pushFictionToGitHub(seriesSlug, slug, isEpisode)
  );

  publicationQueue = operation.catch(() => {});

  return operation;
}

/*
 * Pushes only the specified article's files to GitHub.
 * A successful push triggers the connected Vercel deployment.
 */
async function pushArticleToGitHub(slug) {
  const pathspec = `:(glob)content/articles/${slug}.*`;

  const runGit = (args) =>
    execFileAsync('git', args, {
      cwd: root,
      windowsHide: true,
      timeout: 60_000,
      maxBuffer: 1024 * 1024,
    });

  await runGit(['add', '-A', '--', pathspec]);

  const { stdout } = await runGit([
    'status',
    '--porcelain',
    '--',
    pathspec,
  ]);

  const identity = [
    '-c',
    'user.name=ToolPillot Publisher',
    '-c',
    'user.email=toolpillot-publisher@users.noreply.github.com',
  ];

  if (stdout.trim()) {
    await runGit([
      ...identity,
      'commit',
      '--only',
      '-m',
      `Publish article: ${slug}`,
      '--',
      pathspec,
    ]);
  } else {
    await runGit([
      ...identity,
      'commit',
      '--allow-empty',
      '-m',
      `Trigger ToolPillot deployment: ${slug}`,
    ]);
  }

  await runGit(['push', 'origin', 'HEAD:main']);

  return true;
}

/*
 * Keeps publishing operations in sequence so simultaneous saves
 * do not run Git operations against each other at the same time.
 */
function queueArticlePush(slug) {
  const operation = publicationQueue.then(
    () => pushArticleToGitHub(slug)
  );

  publicationQueue = operation.catch(() => {});

  return operation;
}

function gitErrorMessage(error) {
  const detail = String(
    error.stderr || error.message || 'Unknown Git error'
  ).trim();

  return detail.slice(-500);
}

async function handleSessionRequest(request, response, requestUrl) {
  if (
    requestUrl.pathname === '/__local-content/session' &&
    request.method === 'GET'
  ) {
    sendJson(response, 200, {
      authenticated: isAuthenticated(request),
      passwordConfigured: adminPassword.length >= 16,
    });

    return true;
  }

  if (
    requestUrl.pathname === '/__local-content/session' &&
    request.method === 'POST'
  ) {
    const address = request.socket.remoteAddress || 'local';

    if (
      !consumeRateLimit(loginBuckets, address, {
        windowMs: 15 * 60 * 1000,
        max: 8,
      })
    ) {
      sendJson(response, 429, {
        error: 'Too many sign-in attempts. Wait 15 minutes before trying again.',
      });

      return true;
    }

    if (adminPassword.length < 16) {
      sendJson(response, 503, {
        error: 'LOCAL_CONTENT_ADMIN_PASSWORD must be at least 16 characters. Set it in .env and restart the editor API.',
      });

      return true;
    }

    try {
      const body = await readRequestBody(request);

      if (
        !body ||
        typeof body.password !== 'string' ||
        body.password.length > 256 ||
        !constantTimeEqual(body.password, adminPassword)
      ) {
        sendJson(response, 401, {
          error: 'The password is incorrect.',
        });

        return true;
      }

      const token = randomBytes(32).toString('hex');

      sessions.set(
        token,
        Date.now() + 8 * 60 * 60 * 1000
      );

      sendJson(
        response,
        200,
        { authenticated: true },
        {
          'Set-Cookie': `toolpilot_admin=${token}; HttpOnly; SameSite=Strict; Path=/__local-content; Max-Age=28800`,
        }
      );
    } catch (error) {
      sendJson(
        response,
        error.message === 'Request body is too large.' ? 413 : 400,
        { error: error.message }
      );
    }

    return true;
  }

  if (
    requestUrl.pathname === '/__local-content/session/logout' &&
    request.method === 'POST'
  ) {
    const token = cookieValue(request, 'toolpilot_admin');

    sessions.delete(token);

    sendJson(
      response,
      200,
      { authenticated: false },
      {
        'Set-Cookie': 'toolpilot_admin=; HttpOnly; SameSite=Strict; Path=/__local-content; Max-Age=0',
      }
    );

    return true;
  }

  return false;
}

async function handleAutomationRequest(request, response, requestUrl) {
  const pathname = requestUrl.pathname;

  try {
    if (
      pathname === '/__local-content/automation' &&
      request.method === 'GET'
    ) {
      sendJson(response, 200, await automationApi.getDashboard());
      return true;
    }

    if (
      pathname === '/__local-content/automation/settings' &&
      request.method === 'PUT'
    ) {
      const settings = await automationApi.updateSettings(
        await readRequestBody(request)
      );

      sendJson(response, 200, { settings });
      return true;
    }

    if (
      pathname === '/__local-content/automation/sources' &&
      request.method === 'POST'
    ) {
      const source = await automationApi.saveSource(
        await readRequestBody(request)
      );

      sendJson(response, 201, { source });
      return true;
    }

    const sourceMatch = pathname.match(
      /^\/__local-content\/automation\/sources\/([a-f\d-]{36})$/i
    );

    if (sourceMatch && request.method === 'DELETE') {
      sendJson(response, 200, {
        deleted: await automationApi.deleteSource(sourceMatch[1]),
      });

      return true;
    }

    if (
      pathname === '/__local-content/automation/jobs' &&
      request.method === 'POST'
    ) {
      const body = await readRequestBody(request);

      if (
        body.categories !== undefined &&
        (
          !Array.isArray(body.categories) ||
          body.categories.some(
            (category) => !automationCategoryNames.includes(category)
          )
        )
      ) {
        sendJson(response, 400, {
          error: 'Choose valid categories for this update.',
        });

        return true;
      }

      const job = await automationApi.startContentJob({
        trigger: 'manual',
        categoryFilter: body.categories,
      });

      sendJson(response, 202, { job });
      return true;
    }

    const jobMatch = pathname.match(
      /^\/__local-content\/automation\/jobs\/([a-f\d-]{36})(?:\/(retry))?$/i
    );

    if (
      jobMatch &&
      request.method === 'GET' &&
      !jobMatch[2]
    ) {
      const job = await automationApi.getJob(jobMatch[1]);

      sendJson(
        response,
        job ? 200 : 404,
        job
          ? { job }
          : { error: 'Processing job not found.' }
      );

      return true;
    }

    if (
      jobMatch &&
      request.method === 'POST' &&
      jobMatch[2] === 'retry'
    ) {
      sendJson(response, 202, {
        job: await automationApi.retryJob(jobMatch[1]),
      });

      return true;
    }

    const storyMatch = pathname.match(
      /^\/__local-content\/automation\/stories\/(.+?)(?:\/(retry))?$/
    );

    if (
      storyMatch &&
      request.method === 'POST' &&
      storyMatch[2] === 'retry'
    ) {
      let storyId;

      try {
        storyId = decodeURIComponent(storyMatch[1]);
      } catch {
        sendJson(response, 400, { error: 'Invalid story id.' });
        return true;
      }

      sendJson(response, 202, {
        job: await automationApi.retryStory(storyId),
      });

      return true;
    }

    const draftMatch = pathname.match(
      /^\/__local-content\/automation\/drafts\/([a-z0-9-]+)\/(publish|reject|retry)$/
    );

    if (draftMatch && request.method === 'POST') {
      if (draftMatch[2] === 'publish') {
        const body = await readRequestBody(request);

        sendJson(
          response,
          200,
          await automationApi.publishDraft(draftMatch[1], {
            highImpactReviewed: body.highImpactReviewed === true,
          })
        );
      } else if (draftMatch[2] === 'reject') {
        sendJson(
          response,
          200,
          await automationApi.rejectDraft(draftMatch[1])
        );
      } else {
        const draft = JSON.parse(
          await readFile(
            resolve(contentDirectory, `${draftMatch[1]}.draft`),
            'utf8'
          )
        );

        sendJson(response, 202, {
          job: await automationApi.retryStory(
            draft.automation?.storyId
          ),
        });
      }

      return true;
    }
  } catch (error) {
    const statusCode =
      error.message?.includes('not found')
        ? 404
        : error.message?.includes('already running') ||
            error.message?.includes('just submitted')
          ? 409
          : 400;

    sendJson(response, statusCode, {
      error: error.code
        ? 'Automation data could not be accessed.'
        : String(
            error.message || 'Automation request failed.'
          ).slice(0, 300),
    });

    return true;
  }

  return false;
}

const server = createServer(async (request, response) => {
  const origin = request.headers.origin;

  if (
    (origin && !allowedOrigins.has(origin)) ||
    (!origin && request.method !== 'GET')
  ) {
    sendJson(response, 403, {
      error: 'Requests must come from the local admin page.',
    });

    return;
  }

  const requestUrl = new URL(
    request.url || '/',
    `http://${host}:${port}`
  );

  const address = request.socket.remoteAddress || 'local';

  if (
    !consumeRateLimit(requestBuckets, address, {
      windowMs: 60 * 1000,
      max: 120,
    })
  ) {
    sendJson(response, 429, {
      error: 'Too many local admin requests. Try again in a minute.',
    });

    return;
  }

  if (
    await handleSessionRequest(request, response, requestUrl)
  ) {
    return;
  }

  if (!isAuthenticated(request)) {
    sendJson(response, 401, {
      error: 'Sign in to use the local admin editor.',
    });

    return;
  }

  if (
    requestUrl.pathname === '/__local-content/fiction' &&
    request.method === 'GET'
  ) {
    try {
      const seriesDirectory = resolve(root, 'content', 'fiction', 'series');
      const episodesDirectory = resolve(root, 'content', 'fiction', 'episodes');
      await mkdir(seriesDirectory, { recursive: true });
      await mkdir(episodesDirectory, { recursive: true });
      const readAll = async (directory) => Promise.all(
        (await readdir(directory))
          .filter((name) => name.endsWith('.json'))
          .map(async (name) => JSON.parse(await readFile(join(directory, name), 'utf8')))
      );
      sendJson(response, 200, {
        series: (await readAll(seriesDirectory)).sort((first, second) => first.title.localeCompare(second.title)),
        episodes: (await readAll(episodesDirectory)).sort((first, second) => first.number - second.number),
      });
    } catch (error) {
      console.error('Unable to read fiction files:', error);
      sendJson(response, 500, { error: 'Unable to read fiction files.' });
    }
    return;
  }

  const fictionMatch = requestUrl.pathname.match(
    /^\/__local-content\/fiction\/(series|episodes)\/([a-z0-9-]+)(?:\/([a-z0-9-]+))?$/
  );

  if (fictionMatch && request.method === 'PUT') {
    const [, kind, firstSlug, secondSlug] = fictionMatch;
    const isEpisode = kind === 'episodes';
    const slug = isEpisode ? secondSlug : firstSlug;
    const seriesSlug = isEpisode ? firstSlug : firstSlug;

    if (!slugPattern.test(seriesSlug) || (isEpisode && !slugPattern.test(slug))) {
      sendJson(response, 400, { error: 'Invalid fiction slug.' });
      return;
    }

    try {
      const item = await readRequestBody(request);
      const required = isEpisode
        ? ['slug', 'seriesSlug', 'number', 'title', 'excerpt', 'content']
        : ['slug', 'title', 'genre', 'synopsis'];
      for (const field of required) {
        const value = item[field];
        if (value === undefined || value === null || String(value).trim() === '') {
          sendJson(response, 400, { error: `${field} is required.` });
          return;
        }
      }
      if (item.slug !== slug || (isEpisode && item.seriesSlug !== seriesSlug)) {
        sendJson(response, 400, { error: 'Slug must match the request URL.' });
        return;
      }
      if (!['draft', 'published'].includes(item.status)) {
        sendJson(response, 400, { error: 'Status must be draft or published.' });
        return;
      }

      const directory = resolve(root, 'content', 'fiction', isEpisode ? 'episodes' : 'series');
      await mkdir(directory, { recursive: true });
      const targetFilename = resolve(directory, `${slug}.json`);
      const tempFilename = `${targetFilename}.${process.pid}.tmp`;
      await writeFile(tempFilename, `${JSON.stringify(item, null, 2)}\n`, { flag: 'w' });
      await rename(tempFilename, targetFilename);

      let deploymentTriggered = false;
      try {
        deploymentTriggered = await queueFictionPush(seriesSlug, slug, isEpisode);
      } catch (error) {
        const details = gitErrorMessage(error);
        console.error('Fiction saved locally, but GitHub push failed:', details);
        sendJson(response, 502, {
          error: 'Fiction was saved locally, but the GitHub push failed. Push manually to publish it.',
          savedLocally: true,
          details,
        });
        return;
      }

      sendJson(response, 200, { item, deploymentTriggered });
    } catch (error) {
      console.error('Unable to save fiction file:', error);
      sendJson(response, 400, { error: String(error.message || 'Could not save fiction.') });
    }
    return;
  }

  if (
    await handleAutomationRequest(request, response, requestUrl)
  ) {
    return;
  }

  if (
    requestUrl.pathname === '/__local-content/articles' &&
    request.method === 'GET'
  ) {
    try {
      sendJson(response, 200, {
        articles: await listArticles(),
      });
    } catch (error) {
      console.error('Unable to read local articles:', error);

      sendJson(response, 500, {
        error: 'Unable to read local article files.',
      });
    }

    return;
  }

  const match = requestUrl.pathname.match(
    /^\/__local-content\/articles\/([a-z0-9-]+)$/
  );

  if (match && request.method === 'PUT') {
    const slug = match[1];

    if (!slugPattern.test(slug)) {
      sendJson(response, 400, {
        error: 'Invalid article slug.',
      });

      return;
    }

    try {
      const article = await readRequestBody(request);
      const validationError = validateArticle(article, slug);

      if (validationError) {
        sendJson(response, 400, {
          error: validationError,
        });

        return;
      }

      const publishedFilename = resolve(
        contentDirectory,
        `${slug}.json`
      );

      const draftFilename = resolve(
        contentDirectory,
        `${slug}.draft`
      );

      const wasPublished = await fileExists(publishedFilename);

      const targetFilename =
        article.status === 'published'
          ? publishedFilename
          : draftFilename;

      await mkdir(contentDirectory, { recursive: true });

      const words = article.content
        .trim()
        .split(/\s+/)
        .filter(Boolean).length;

      const articleToSave = {
        ...article,
        readTime: `${Math.max(1, Math.ceil(words / 200))} min read`,
      };

      const tempFilename = `${targetFilename}.${process.pid}.tmp`;

      await writeFile(
        tempFilename,
        `${JSON.stringify(articleToSave, null, 2)}\n`,
        { flag: 'w' }
      );

      await rename(tempFilename, targetFilename);

      await removeIfPresent(
        article.status === 'published'
          ? draftFilename
          : publishedFilename
      );

      await removeIfPresent(
        resolve(contentDirectory, `${slug}.deleted`)
      );

      /*
       * Automatically commit and push published articles.
       * Unpublishing an existing published article also pushes
       * the change so the next deployment reflects its new status.
       */
      let deploymentTriggered = false;

      if (article.status === 'published' || wasPublished) {
        try {
          deploymentTriggered = await queueArticlePush(slug);
        } catch (error) {
          const details = gitErrorMessage(error);

          console.error(
            'Article saved locally, but automatic GitHub publishing failed:',
            details
          );

          sendJson(response, 502, {
            error: 'Article was saved locally, but GitHub push failed. Check the terminal error and retry publishing.',
            savedLocally: true,
            details,
          });

          return;
        }
      }

      sendJson(response, 200, {
        article: {
          ...articleToSave,
          source: legacySlugs.has(slug)
            ? 'override'
            : 'local',
        },
        deploymentTriggered,
      });
    } catch (error) {
      if (
        error.message === 'Request body is too large.' ||
        error.message === 'Request body must be valid JSON.'
      ) {
        sendJson(
          response,
          error.message === 'Request body is too large.'
            ? 413
            : 400,
          { error: error.message }
        );
      } else {
        console.error('Unable to save local article:', error);

        sendJson(response, 500, {
          error: 'Unable to write the local article file.',
        });
      }
    }

    return;
  }

  if (match && request.method === 'DELETE') {
    const slug = match[1];

    if (!slugPattern.test(slug)) {
      sendJson(response, 400, {
        error: 'Invalid article slug.',
      });

      return;
    }

    try {
      const publishedFilename = resolve(
        contentDirectory,
        `${slug}.json`
      );

      const wasPublished = await fileExists(publishedFilename);

      await removeIfPresent(publishedFilename);

      await removeIfPresent(
        resolve(contentDirectory, `${slug}.draft`)
      );

      if (legacySlugs.has(slug)) {
        await mkdir(contentDirectory, { recursive: true });

        await writeFile(
          resolve(contentDirectory, `${slug}.deleted`),
          'deleted\n'
        );
      }

      let deploymentTriggered = false;

      if (wasPublished || legacySlugs.has(slug)) {
        try {
          deploymentTriggered = await queueArticlePush(slug);
        } catch (error) {
          const details = gitErrorMessage(error);

          console.error(
            'Article deleted locally, but automatic GitHub publishing failed:',
            details
          );

          sendJson(response, 502, {
            error: 'Article was deleted locally, but GitHub push failed. Check the terminal error and push the change before expecting the live site to update.',
            deletedLocally: true,
            details,
          });

          return;
        }
      }

      sendJson(response, 200, {
        deleted: slug,
        deploymentTriggered,
      });
    } catch (error) {
      console.error('Unable to delete local article:', error);

      sendJson(response, 500, {
        error: 'Unable to delete the local article.',
      });
    }

    return;
  }

  sendJson(response, 404, {
    error: 'Local content endpoint not found.',
  });
});

await automationApi.recoverInterruptedJobs();

server.listen(port, host, () => {
  console.log(
    `Local article editor API listening on http://${host}:${port}`
  );
});

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => {
    server.close(() => process.exit(0));
  });
}
