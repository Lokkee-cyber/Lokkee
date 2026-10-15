export const automationCategories = [
  { title: 'World News', query: 'world news' },
  { title: 'Nigeria News', query: 'Nigeria news' },
  { title: 'Politics and Government', query: 'politics government' },
  { title: 'Business and Entrepreneurship', query: 'business entrepreneurship' },
  { title: 'Personal Finance', query: 'personal finance' },
  { title: 'Cryptocurrency and Markets', query: 'cryptocurrency markets' },
  { title: 'Technology', query: 'technology' },
  { title: 'Artificial Intelligence', query: 'artificial intelligence' },
  { title: 'AI Tools and Tutorials', articleCategory: 'AI Tools', query: 'AI tools tutorial' },
  { title: 'Science and Research', query: 'science research' },
  { title: 'Education and Scholarships', query: 'education scholarships' },
  { title: 'Careers and Jobs', query: 'careers jobs' },
  { title: 'Entertainment', query: 'entertainment' },
  { title: 'Celebrity News', query: 'celebrity news' },
  { title: 'Music', query: 'music industry' },
  { title: 'Movies and Television', query: 'movies television' },
  { title: 'Nollywood', query: 'Nollywood' },
  { title: 'Hollywood', query: 'Hollywood' },
  { title: 'Sports', query: 'sports' },
  { title: 'Football and Transfers', query: 'football transfers' },
  { title: 'Basketball and Other Sports', query: 'basketball sports' },
  { title: 'Gaming and Esports', query: 'gaming esports' },
  { title: 'Smartphones and Gadgets', query: 'smartphones gadgets' },
  { title: 'Software and Apps', query: 'software apps' },
  { title: 'Cybersecurity', query: 'cybersecurity' },
  { title: 'Health and Wellness', query: 'health wellness' },
  { title: 'Lifestyle', query: 'lifestyle' },
  { title: 'Travel and Tourism', query: 'travel tourism' },
  { title: 'Food and Cooking', query: 'food cooking' },
  { title: 'Fashion and Beauty', query: 'fashion beauty' },
  { title: 'Relationships', query: 'relationships' },
  { title: 'Automotive', query: 'automotive' },
  { title: 'Real Estate', query: 'real estate' },
  { title: 'Environment and Climate', query: 'environment climate' },
  { title: 'Culture and Religion', query: 'culture religion' },
  { title: 'Product Reviews and Comparisons', query: 'product reviews comparisons' },
  { title: 'How-To Guides and Tutorials', query: 'how to tutorial' },
  { title: 'Internet Trends and Viral Stories', query: 'internet trends viral' },
];

export const automationCategoryNames = automationCategories.map(({ title }) => title);
export const automationArticleCategoryNames = automationCategories
  .filter(({ articleCategory }) => !articleCategory)
  .map(({ title }) => title);

export function articleCategoryForAutomationCategory(title) {
  return automationCategories.find((category) => category.title === title)?.articleCategory || title;
}
