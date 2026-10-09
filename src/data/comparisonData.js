import { comparisons } from './siteData';

export function comparisonDataForArticle(slug) {
  const comparison = comparisons.find((item) => slug === item.slug || slug.startsWith(`${item.slug}-`));
  if (!comparison) return null;

  return {
    objects: [comparison.left, comparison.right],
    features: comparison.fields.map((field) => ({
      name: field.label,
      values: [field.left, field.right],
    })),
  };
}
