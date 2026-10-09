import { createServer } from 'node:http';
import { mkdir, readFile, readdir, rename, unlink, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const contentDirectory = resolve(root, 'content', 'articles');
const host = '127.0.0.1';
const port = Number(process.env.LOCAL_CONTENT_PORT || 4179);
const allowedOrigins = new Set(['http://127.0.0.1:5173', 'http://localhost:5173']);
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const maxRequestBytes = 1_000_000;
const { articlePreviews: legacyArticles, categories } = await import('../src/data/siteData.js');
const { getLegacyArticleContent, legacyArticleContentToMarkdown } = await import('../src/data/legacyArticleContent.js');
const { comparisonDataForArticle } = await import('../src/data/comparisonData.js');
const legacySlugs = new Set(legacyArticles.map((article) => article.slug));
const categoryNames = new Set(categories.map((category) => category.title));

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
  });
  response.end(JSON.stringify(payload));
}

function validateArticle(value, routeSlug) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return 'Expected an article object.';
  }

  const requiredStrings = ['title', 'slug', 'excerpt', 'category', 'content'];
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

  if (value.title.length > 160 || value.excerpt.length > 500 || value.content.length > 100_000) {
    return 'Title, excerpt, or article content exceeds the allowed length.';
  }

  if (!categoryNames.has(value.category)) {
    return 'Choose one of the configured article categories.';
  }

  if (value.author !== undefined && (typeof value.author !== 'string' || value.author.length > 120)) {
    return 'Author must be a string no longer than 120 characters.';
  }

  if (value.image !== undefined && typeof value.image !== 'string') {
    return 'Image must be a string.';
  }

  if (value.image) {
    const isSitePath = value.image.startsWith('/') && !value.image.startsWith('//');
    let isHttpsUrl = false;
    try {
      isHttpsUrl = new URL(value.image).protocol === 'https:';
    } catch {
      isHttpsUrl = false;
    }
    if (value.image.length > 2048 || (!isSitePath && !isHttpsUrl)) {
      return 'Image must be a secure https URL or a site-relative path.';
    }
  }

  if (value.seoTitle && (typeof value.seoTitle !== 'string' || value.seoTitle.length > 160)) {
    return 'SEO title must be a string no longer than 160 characters.';
  }

  if (value.metaDescription && (typeof value.metaDescription !== 'string' || value.metaDescription.length > 320)) {
    return 'Meta description must be a string no longer than 320 characters.';
  }

  for (const field of ['publishedAt', 'updatedAt']) {
    if (value[field] !== undefined && typeof value[field] !== 'string') {
      return `${field} must be a date string.`;
    }
  }

  if (value.comparison !== undefined && value.comparison !== null) {
    const { objects, features } = value.comparison;
    if (!Array.isArray(objects) || objects.length < 2 || objects.length > 4) {
      return 'Comparison articles must have between two and four compared objects.';
    }
    if (objects.some((name) => typeof name !== 'string' || !name.trim() || name.length > 80)
      || new Set(objects.map((name) => name.trim().toLowerCase())).size !== objects.length) {
      return 'Compared object names must be unique, non-empty strings no longer than 80 characters.';
    }
    if (!Array.isArray(features) || features.length < 1) {
      return 'Comparison articles must have at least one feature.';
    }
    if (features.some((feature) => (
      !feature || typeof feature.name !== 'string' || !feature.name.trim() || feature.name.length > 100
      || !Array.isArray(feature.values) || feature.values.length !== objects.length
      || feature.values.some((item) => typeof item !== 'string' || !item.trim() || item.length > 500)
    ))) {
      return 'Each comparison feature needs a name and a value for every compared object.';
    }
    if (value.category !== 'AI Comparisons') {
      return 'Comparison articles must use the AI Comparisons category.';
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
  const deletedSlugs = new Set(filenames
    .filter((name) => name.endsWith('.deleted'))
    .map((name) => name.slice(0, -'.deleted'.length)));
  const articles = new Map(legacyArticles
    .filter((article) => !deletedSlugs.has(article.slug))
    .map((article) => {
      const content = getLegacyArticleContent(article.slug);
      return [article.slug, {
        ...article,
        content: legacyArticleContentToMarkdown(content),
        publishedAt: article.date,
        updatedAt: article.updated,
        seoTitle: '',
        metaDescription: '',
        status: 'published',
        comparison: comparisonDataForArticle(article.slug),
        source: 'code',
      }];
    }));

  for (const filename of filenames.filter((name) => name.endsWith('.json') || name.endsWith('.draft'))) {
    const article = JSON.parse(await readFile(join(contentDirectory, filename), 'utf8'));
    articles.set(article.slug, {
      ...articles.get(article.slug),
      ...article,
      source: legacySlugs.has(article.slug) ? 'override' : 'local',
    });
  }
  return [...articles.values()].sort((first, second) => first.title.localeCompare(second.title));
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

const server = createServer(async (request, response) => {
  const origin = request.headers.origin;
  if ((origin && !allowedOrigins.has(origin)) || (!origin && request.method !== 'GET')) {
    sendJson(response, 403, { error: 'Requests must come from the local admin page.' });
    return;
  }

  const requestUrl = new URL(request.url || '/', `http://${host}:${port}`);
  if (requestUrl.pathname === '/__local-content/articles' && request.method === 'GET') {
    try {
      sendJson(response, 200, { articles: await listArticles() });
    } catch (error) {
      console.error('Unable to read local articles:', error);
      sendJson(response, 500, { error: 'Unable to read local article files.' });
    }
    return;
  }

  const match = requestUrl.pathname.match(/^\/__local-content\/articles\/([a-z0-9-]+)$/);
  if (match && request.method === 'PUT') {
    const slug = match[1];
    if (!slugPattern.test(slug)) {
      sendJson(response, 400, { error: 'Invalid article slug.' });
      return;
    }

    try {
      const article = await readRequestBody(request);
      const validationError = validateArticle(article, slug);
      if (validationError) {
        sendJson(response, 400, { error: validationError });
        return;
      }

      const publishedFilename = resolve(contentDirectory, `${slug}.json`);
      const draftFilename = resolve(contentDirectory, `${slug}.draft`);
      const targetFilename = article.status === 'published' ? publishedFilename : draftFilename;
      await mkdir(contentDirectory, { recursive: true });
      const words = article.content.trim().split(/\s+/).filter(Boolean).length;
      const articleToSave = {
        ...article,
        readTime: `${Math.max(1, Math.ceil(words / 200))} min read`,
      };
      const tempFilename = `${targetFilename}.${process.pid}.tmp`;
      await writeFile(tempFilename, `${JSON.stringify(articleToSave, null, 2)}\n`, { flag: 'w' });
      await rename(tempFilename, targetFilename);
      await removeIfPresent(article.status === 'published' ? draftFilename : publishedFilename);
      await removeIfPresent(resolve(contentDirectory, `${slug}.deleted`));
      sendJson(response, 200, {
        article: {
          ...articleToSave,
          source: legacySlugs.has(slug) ? 'override' : 'local',
        },
      });
    } catch (error) {
      if (error.message === 'Request body is too large.' || error.message === 'Request body must be valid JSON.') {
        sendJson(response, error.message === 'Request body is too large.' ? 413 : 400, { error: error.message });
      } else {
        console.error('Unable to save local article:', error);
        sendJson(response, 500, { error: 'Unable to write the local article file.' });
      }
    }
    return;
  }

  if (match && request.method === 'DELETE') {
    const slug = match[1];
    if (!slugPattern.test(slug)) {
      sendJson(response, 400, { error: 'Invalid article slug.' });
      return;
    }
    try {
      await removeIfPresent(resolve(contentDirectory, `${slug}.json`));
      await removeIfPresent(resolve(contentDirectory, `${slug}.draft`));
      if (legacySlugs.has(slug)) {
        await mkdir(contentDirectory, { recursive: true });
        await writeFile(resolve(contentDirectory, `${slug}.deleted`), 'deleted\n');
      }
      sendJson(response, 200, { deleted: slug });
    } catch (error) {
      console.error('Unable to delete local article:', error);
      sendJson(response, 500, { error: 'Unable to delete the local article.' });
    }
    return;
  }

  sendJson(response, 404, { error: 'Local content endpoint not found.' });
});

server.listen(port, host, () => {
  console.log(`Local article editor API listening on http://${host}:${port}`);
});

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => {
    server.close(() => process.exit(0));
  });
}
