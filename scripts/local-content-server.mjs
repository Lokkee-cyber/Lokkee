import { createServer } from 'node:http';
import { mkdir, readFile, readdir, rename, unlink, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const contentDirectory = resolve(root, 'content', 'articles');
const host = '127.0.0.1';
const port = Number(process.env.LOCAL_CONTENT_PORT || 4179);
const allowedOrigins = new Set(['http://127.0.0.1:5173']);
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const maxRequestBytes = 1_000_000;
const { articlePreviews: legacyArticles, categories } = await import('../src/data/siteData.js');
const legacySlugs = new Set(legacyArticles.map((article) => article.slug));
const categoryNames = new Set(categories.filter((category) => category.slug !== 'comparisons').map((category) => category.title));

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
  const filenames = (await readdir(contentDirectory))
    .filter((name) => name.endsWith('.json') || name.endsWith('.draft'));
  const articles = await Promise.all(
    filenames.map(async (filename) => JSON.parse(await readFile(join(contentDirectory, filename), 'utf8'))),
  );
  return articles.sort((first, second) => first.title.localeCompare(second.title));
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
      let hasLocalFile = true;
      try {
        await readFile(publishedFilename);
      } catch (error) {
        if (error.code !== 'ENOENT') {
          throw error;
        }
        try {
          await readFile(draftFilename);
        } catch (draftError) {
          if (draftError.code !== 'ENOENT') {
            throw draftError;
          }
          hasLocalFile = false;
        }
      }
      if (!hasLocalFile && legacySlugs.has(slug)) {
        sendJson(response, 409, { error: 'This slug belongs to an existing built-in article. Choose a different slug.' });
        return;
      }
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
      sendJson(response, 200, { article: articleToSave });
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
