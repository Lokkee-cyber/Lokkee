import { articlePreviews } from './siteData';

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
  }));

export const publishedArticles = [...localArticles, ...articlePreviews];

export function findPublishedArticle(slug) {
  return publishedArticles.find((article) => article.slug === slug);
}
