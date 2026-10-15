import { readdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dataUrl = new URL('../src/data/siteData.js', import.meta.url);
const { categories, tools, articlePreviews, comparisons } = await import(dataUrl.href);
const productionSiteUrl = 'https://www.toolpillot.com';
const configuredSiteUrl = process.env.SITE_URL || process.env.VITE_SITE_URL;
let siteUrl = productionSiteUrl;
if (configuredSiteUrl) {
  try {
    const configuredUrl = new URL(configuredSiteUrl);
    if (configuredUrl.origin === productionSiteUrl) {
      siteUrl = configuredUrl.origin;
    }
  } catch {
    console.warn(`Ignoring invalid canonical site URL: ${configuredSiteUrl}`);
  }
}
const contentDirectory = resolve(root, 'content', 'articles');
const contentFilenames = await readdir(contentDirectory);
const deletedSlugs = new Set(contentFilenames
  .filter((filename) => filename.endsWith('.deleted'))
  .map((filename) => filename.slice(0, -'.deleted'.length)));
const draftSlugs = new Set(contentFilenames
  .filter((filename) => filename.endsWith('.draft'))
  .map((filename) => filename.slice(0, -'.draft'.length)));
const unpublishedSlugs = new Set(draftSlugs);
const contentArticles = [];
for (const filename of contentFilenames.filter((name) => name.endsWith('.json'))) {
  const article = JSON.parse(await readFile(resolve(contentDirectory, filename), 'utf8'));
  if (article.slug && article.status !== 'published') unpublishedSlugs.add(article.slug);
  if (article.status === 'published' && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(article.slug || '')) {
    contentArticles.push(article);
  }
}

const routes = [
  '/', '/ai-tools', '/ai-video', '/ai-image', '/ai-writing', '/ai-audio',
  '/ai-coding', '/ai-creators', '/ai-business', '/ai-students',
  '/comparisons', '/about', '/contact', '/privacy-policy',
  '/terms', '/disclaimer', '/affiliate-disclosure', '/editorial-policy',
  '/authors/lokkeeverse-editorial',
];

const urls = [
  ...routes,
  ...categories.map((category) => category.path),
  ...tools.map((tool) => `/tools/${tool.slug}`),
  ...articlePreviews
    .filter((article) => !deletedSlugs.has(article.slug) && !unpublishedSlugs.has(article.slug))
    .map((article) => `/articles/${article.slug}`),
  ...comparisons.map((comparison) => `/compare/${comparison.slug}`),
];

for (const article of contentArticles) {
  if (!deletedSlugs.has(article.slug)) urls.push(`/articles/${article.slug}`);
}

const uniqueUrls = [...new Set(urls)];
if (uniqueUrls.some((path) => !path.startsWith('/') || path.startsWith('/api/'))) {
  throw new Error('Sitemap contains a non-frontend route.');
}
const validPagePaths = [...new Set([...uniqueUrls, '/search'])];
const escapeXml = (value) => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&apos;');
const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${uniqueUrls.map((path) => `  <url><loc>${escapeXml(`${siteUrl}${path}`)}</loc></url>`).join('\n')}\n</urlset>\n`;
const robots = `User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /private\nDisallow: /api/\nDisallow: /api/private\nSitemap: ${siteUrl}/sitemap.xml\n`;
const routeManifest = `export const publicRoutePaths = ${JSON.stringify(validPagePaths, null, 2)};\n`;

await writeFile(resolve(root, 'public/sitemap.xml'), xml);
await writeFile(resolve(root, 'public/robots.txt'), robots);
await writeFile(resolve(root, 'src/data/generatedPublicRoutes.js'), routeManifest);
console.log(`Generated sitemap with ${uniqueUrls.length} URLs and robots.txt for ${siteUrl}.`);
