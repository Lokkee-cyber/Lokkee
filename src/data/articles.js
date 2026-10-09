import { articlePreviews } from './siteData';
import { comparisonDataForArticle } from './comparisonData';

const fallbackImage = 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?auto=format&fit=crop&w=1200&q=80';
const localArticleModules = import.meta.glob('../../content/articles/*.json', {
  eager: true,
  import: 'default',
});

export const localArticles = Object.values(localArticleModules)
  .filter((article) => article.status === 'published')
  .map((article) => ({
    ...article,
    author: article.author || 'ToolPilot AI Editorial',
    authorSlug: article.authorSlug || 'toolpilot-ai-editorial',
    image: article.image || fallbackImage,
    date: article.publishedAt?.slice(0, 10) || article.date,
    updated: article.updatedAt?.slice(0, 10) || article.updated,
    readTime: article.readTime || '1 min read',
    comparison: article.comparison,
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

export const publishedArticles = [
  ...articlePreviews
    .filter((article) => !deletedSlugs.has(article.slug))
    .map((article) => {
      const localArticle = localArticlesBySlug.get(article.slug);
      return localArticle || {
        ...article,
        comparison: article.comparison || comparisonDataForArticle(article.slug),
      };
    }),
  ...localArticles.filter((article) => !legacySlugs.has(article.slug) && !deletedSlugs.has(article.slug)),
];

export function findPublishedArticle(slug) {
  return publishedArticles.find((article) => article.slug === slug);
}
