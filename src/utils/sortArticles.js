export function sortArticlesByPublishedDate(articles) {
  return [...articles].sort((first, second) => {
    const firstPublished = Date.parse(first.publishedAt || first.date || first.updatedAt || first.updated || '') || 0;
    const secondPublished = Date.parse(second.publishedAt || second.date || second.updatedAt || second.updated || '') || 0;
    return secondPublished - firstPublished;
  });
}