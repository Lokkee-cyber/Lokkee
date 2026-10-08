import { readdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dataUrl = new URL('../src/data/siteData.js', import.meta.url);
const { categories, tools, articlePreviews, comparisons } = await import(dataUrl.href);
const siteUrl = (process.env.VITE_SITE_URL || 'https://toolpilot.ai').replace(/\/$/, '');
const contentDirectory = resolve(root, 'content', 'articles');

const routes = [
  '/', '/ai-tools', '/ai-video', '/ai-image', '/ai-writing', '/ai-audio',
  '/ai-coding', '/ai-creators', '/ai-business', '/ai-students',
  '/comparisons', '/search', '/about', '/contact', '/privacy-policy',
  '/terms', '/disclaimer', '/affiliate-disclosure', '/editorial-policy',
];

const urls = [
  ...routes,
  ...categories.map((category) => `/${category.slug}`),
  ...tools.map((tool) => `/tools/${tool.slug}`),
  ...articlePreviews.map((article) => `/articles/${article.slug}`),
  ...comparisons.map((comparison) => `/compare/${comparison.slug}`),
];

const contentFiles = (await readdir(contentDirectory)).filter((filename) => filename.endsWith('.json'));
for (const filename of contentFiles) {
  const article = JSON.parse(await readFile(resolve(contentDirectory, filename), 'utf8'));
  if (article.status === 'published' && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(article.slug || '')) {
    urls.push(`/articles/${article.slug}`);
  }
}

const uniqueUrls = [...new Set(urls)];
const escapeXml = (value) => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&apos;');
const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${uniqueUrls.map((path) => `  <url><loc>${escapeXml(`${siteUrl}${path}`)}</loc></url>`).join('\n')}\n</urlset>\n`;
const robots = `User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /private\nDisallow: /api/private\nSitemap: ${siteUrl}/sitemap.xml\n`;

await writeFile(resolve(root, 'public/sitemap.xml'), xml);
await writeFile(resolve(root, 'public/robots.txt'), robots);
console.log(`Generated sitemap with ${uniqueUrls.length} URLs and robots.txt for ${siteUrl}.`);
