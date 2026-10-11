import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import test from 'node:test';
import middleware from '../middleware.js';
import { publicRoutePaths } from '../src/data/generatedPublicRoutes.js';

const contentDirectory = new URL('../content/articles/', import.meta.url);
const requestFor = (path) => new Request(`https://www.toolpillot.com${path}`);

test('continues for currently published frontend routes', async () => {
  for (const path of [
    '/',
    '/tools/chatgpt',
    '/articles/best-ai-tools-in-2026',
    '/compare/chatgpt-vs-gemini',
  ]) {
    const response = middleware(requestFor(path));
    assert.equal(response.status, 200, `${path} should continue to the SPA`);
    assert.equal(response.headers.get('x-middleware-next'), '1', `${path} should reach the SPA rewrite`);
    assert.ok(publicRoutePaths.includes(path), `${path} should be in the generated route manifest`);
  }
});

test('returns an unindexable HTTP 404 for unknown routes and dynamic slugs', () => {
  for (const path of [
    '/this-page-should-not-exist-92841',
    '/tools/not-a-real-tool',
    '/articles/not-a-published-article',
    '/compare/not-a-real-comparison',
  ]) {
    const response = middleware(requestFor(path));
    assert.equal(response.status, 404, `${path} should return HTTP 404`);
    assert.equal(response.headers.get('x-robots-tag'), 'noindex, nofollow');
    assert.match(response.headers.get('content-type'), /^text\/html/);
  }
});

test('redirects trailing slashes to the canonical path and keeps the query', () => {
  const response = middleware(requestFor('/tools/chatgpt/?source=test'));
  assert.equal(response.status, 308);
  assert.equal(response.headers.get('location'), 'https://www.toolpillot.com/tools/chatgpt?source=test');
});

test('does not expose draft or deleted articles as valid routes', async () => {
  const filenames = await readdir(contentDirectory);
  const excludedSlugs = new Set([
    ...filenames.filter((name) => name.endsWith('.draft')).map((name) => name.replace(/\.draft$/, '')),
    ...filenames.filter((name) => name.endsWith('.deleted')).map((name) => name.replace(/\.deleted$/, '')),
  ]);

  for (const filename of filenames.filter((name) => name.endsWith('.json'))) {
    const article = JSON.parse(await readFile(new URL(filename, contentDirectory), 'utf8'));
    if (article.status !== 'published') excludedSlugs.add(article.slug);
  }

  for (const slug of excludedSlugs) {
    assert.equal(publicRoutePaths.includes(`/articles/${slug}`), false, `${slug} must not be routable`);
  }
});