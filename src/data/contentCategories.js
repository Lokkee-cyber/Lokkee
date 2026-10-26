// Public taxonomy. Legacy article labels stay in their source files so historical
// records and URLs remain reversible; this layer gives every public item one home.
export const mainCategories = [
  { slug: 'fiction', title: 'Serial Fiction / Novels', path: '/fiction', description: 'Immersive serial stories, one episode at a time.' },
  { slug: 'news', title: 'News Feed', path: '/news', description: 'News, culture, sport and current affairs.' },
  { slug: 'ai-content', title: 'AI Content', path: '/ai-content', description: 'Practical AI tools, guides, prompts and comparisons.' },
];

const AI_LABELS = new Set([
  'AI Tools', 'AI Video', 'AI Image', 'AI Writing', 'AI Voice & Audio', 'AI Coding',
  'AI for Creators', 'AI for Business', 'AI for Students', 'AI Comparisons',
]);

export function mainCategoryFor(article) {
  if (article.contentType === 'fiction' || article.category === 'Serial Fiction / Novels') return 'Serial Fiction / Novels';
  if (article.category === 'News Feed' || article.automation?.generated || !AI_LABELS.has(article.category)) return 'News Feed';
  return 'AI Content';
}

export function isAiArticle(article) { return mainCategoryFor(article) === 'AI Content'; }
export function isNewsArticle(article) { return mainCategoryFor(article) === 'News Feed'; }
