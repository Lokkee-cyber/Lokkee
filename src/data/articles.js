import { articlePreviews } from './siteData.js';
import { comparisonDataForArticle } from './comparisonData.js';
import { popularGuideSlugs } from './popularGuideSlugs.js';
import { sortArticlesByPublishedDate } from '../utils/sortArticles.js';

const fallbackImage = 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?auto=format&fit=crop&w=1200&q=80';
const localArticleModules = import.meta.glob('../../content/articles/*.json', {
  eager: true,
  import: 'default',
});
const automationArticleModules = import.meta.glob('../../Lokkee-main/content/articles/*.json', {
  eager: true,
  import: 'default',
});
const automationDraftModules = import.meta.glob('../../Lokkee-main/content/articles/*.draft', {
  eager: true,
  query: '?raw',
  import: 'default',
});
const automationDeletedModules = import.meta.glob('../../Lokkee-main/content/articles/*.deleted', {
  eager: true,
  query: '?raw',
  import: 'default',
});
const automationHiddenSlugs = new Set([
  ...Object.keys(automationDraftModules),
  ...Object.keys(automationDeletedModules),
].map((path) => path.split('/').at(-1).replace(/\.(draft|deleted)$/, '')));
const draftArticleModules = import.meta.glob('../../content/articles/*.draft', {
  eager: true,
  query: '?raw',
  import: 'default',
});
const localArticleValues = Object.values(localArticleModules);
const unpublishedSlugs = new Set([
  ...localArticleValues.filter((article) => article.status !== 'published').map((article) => article.slug),
  ...Object.keys(draftArticleModules).map((path) => path.split('/').at(-1).replace(/\.draft$/, '')),
]);

export const localArticles = localArticleValues
  .filter((article) => article.status === 'published')
  .map((article) => ({
    ...article,
    author: article.author || 'LokkeeVerse Editorial',
    authorSlug: article.authorSlug || 'lokkeeverse-editorial',
    image: article.image || fallbackImage,
    date: article.publishedAt?.slice(0, 10) || article.date,
    updated: article.updatedAt?.slice(0, 10) || article.updated,
    readTime: article.readTime || '1 min read',
    comparison: article.comparison,
  }));

const automationArticles = Object.values(automationArticleModules)
  .filter((article) => (
    article.status === 'published'
    && article.automation?.generated === true
    && !automationHiddenSlugs.has(article.slug)
  ))
  .map((article) => ({
    ...article,
    author: article.author || 'LokkeeVerse Editorial',
    authorSlug: article.authorSlug || 'lokkeeverse-editorial',
    image: article.image || fallbackImage,
    date: article.publishedAt?.slice(0, 10) || article.date,
    updated: article.updatedAt?.slice(0, 10) || article.updated,
    readTime: article.readTime || '1 min read',
  }));

const deletedArticleModules = import.meta.glob('../../content/articles/*.deleted', {
  eager: true,
  query: '?raw',
  import: 'default',
});
const deletedSlugs = new Set(
  Object.keys(deletedArticleModules)
    .map((path) => path.split('/').at(-1).replace(/\.deleted$/, '')),
);
const localArticlesBySlug = new Map(localArticles.map((article) => [article.slug, article]));
const legacySlugs = new Set(articlePreviews.map((article) => article.slug));

const siteArticles = [
  ...articlePreviews
    .filter((article) => !deletedSlugs.has(article.slug) && !unpublishedSlugs.has(article.slug))
    .map((article) => {
      const localArticle = localArticlesBySlug.get(article.slug);
      return localArticle || {
        ...article,
        comparison: article.comparison || comparisonDataForArticle(article.slug),
      };
    }),
  ...localArticles.filter((article) => !legacySlugs.has(article.slug) && !deletedSlugs.has(article.slug)),
];
const siteArticleSlugs = new Set(siteArticles.map((article) => article.slug));

export const publishedArticles = sortArticlesByPublishedDate([
  ...siteArticles,
  ...automationArticles.filter((article) => (
    !siteArticleSlugs.has(article.slug)
    && !deletedSlugs.has(article.slug)
    && !unpublishedSlugs.has(article.slug)
  )),
]);

export const popularGuides = popularGuideSlugs
  .map((slug) => publishedArticles.find((article) => article.slug === slug))
  .filter(Boolean);

export function findPublishedArticle(slug) {
  return publishedArticles.find((article) => article.slug === slug);
}
