// Public taxonomy. Legacy article labels stay in their source files so historical
// records and URLs remain reversible; this layer gives every public item one home.
import { fictionGenres } from './fictionGenres.js';

export const fictionGenreLabels = fictionGenres.map((genre) => genre.label);

export const aiSubcategories = [
  { slug: 'ai-tools', title: 'AI Tools' },
  { slug: 'ai-video', title: 'AI Video' },
  { slug: 'ai-image', title: 'AI Image' },
  { slug: 'ai-writing', title: 'AI Writing' },
  { slug: 'ai-audio', title: 'AI Voice & Audio' },
  { slug: 'ai-coding', title: 'AI Coding' },
  { slug: 'ai-creators', title: 'AI for Creators' },
  { slug: 'ai-business', title: 'AI for Business' },
  { slug: 'ai-students', title: 'AI for Students' },
  { slug: 'comparisons', title: 'AI Comparisons' },
];

export const aiSubcategoryTitles = aiSubcategories.map(({ title }) => title);

export const mainCategories = [
  { slug: 'fiction', title: 'Serial Fiction / Novels', path: '/fiction', description: 'Immersive serial stories, one episode at a time.' },
  { slug: 'news', title: 'News Feed', path: '/news', description: 'News, culture, sport and current affairs.' },
  { slug: 'ai-content', title: 'AI Content', path: '/ai-content', description: 'Practical AI tools, guides, prompts and comparisons.' },
];

const AI_LABELS = new Set(aiSubcategoryTitles);
const FICTION_LABELS = new Set(fictionGenreLabels);

export function mainCategoryFor(article) {
  if (article.contentType === 'fiction' || article.category === 'Serial Fiction / Novels' || FICTION_LABELS.has(article.category)) return 'Serial Fiction / Novels';
  if (article.category === 'News Feed' || article.automation?.generated || !AI_LABELS.has(article.category)) return 'News Feed';
  return 'AI Content';
}

export function isAiArticle(article) { return mainCategoryFor(article) === 'AI Content'; }
export function isNewsArticle(article) { return mainCategoryFor(article) === 'News Feed'; }
