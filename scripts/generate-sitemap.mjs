import { writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dataUrl = new URL('../src/data/siteData.js', import.meta.url);
const { categories, tools, articlePreviews, comparisons } = await import(dataUrl.href);
const siteUrl = process.env.VITE_SITE_URL || 'https://toolpilot.ai';
const routes = [
  '/', '/ai-tools', '/ai-video', '/ai-image', '/ai-writing', '/ai-audio',
  '/ai-coding', '/ai-creators', '/ai-business', '/ai-students',
  '/comparisons', '/search', '/about', '/contact', '/privacy-policy',
  '/terms', '/disclaimer', '/affiliate-disclosure', '/editorial-policy', '/404',
];
const urls = [
  ...routes,
  ...categories.map((category) => `/${category.slug}`),
  ...tools.map((tool) => `/tools/${tool.slug}`),
  ...articlePreviews.map((article) => `/articles/${article.slug}`),
  ...comparisons.map((comparison) => `/compare/${comparison.slug}`),
];
const uniqueUrls = [...new Set(urls)];
const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${uniqueUrls.map((path) => `  <url><loc>${siteUrl}${path}</loc></url>`).join('\n')}\n</urlset>\n`;
writeFileSync(resolve(root, 'public/sitemap.xml'), xml);
console.log(`Generated sitemap with ${uniqueUrls.length} URLs.`);
