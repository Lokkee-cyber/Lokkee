const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const isHttps = (value) => {
  try { return new URL(value).protocol === 'https:'; } catch { return false; }
};

// Mirrors the validation in scripts/local-content-server.mjs.
export function validateArticle(value, routeSlug, categoryNames) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return 'Expected an article object.';
  for (const field of ['title', 'slug', 'excerpt', 'category', 'content']) {
    if (typeof value[field] !== 'string' || !value[field].trim()) return `${field} is required.`;
  }
  if (!slugPattern.test(value.slug) || value.slug !== routeSlug) {
    return 'Slug must be lowercase letters, numbers, and hyphens, and match the article URL.';
  }
  if (!['draft', 'published'].includes(value.status)) return 'Status must be draft or published.';
  if (value.automation?.generated && value.status === 'published') {
    return 'Automation drafts must be approved through Content Automation before publication.';
  }
  if (value.automation?.generated
    && (!Array.isArray(value.sourceReferences) || !value.sourceReferences.length
      || value.sourceReferences.some((source) => !isHttps(source?.url)))) {
    return 'Automation drafts must retain a valid HTTPS source reference.';
  }
  if (value.title.length > 160 || value.excerpt.length > 500 || value.content.length > 100_000) {
    return 'Title, excerpt, or article content exceeds the allowed length.';
  }
  if (!categoryNames.has(value.category)) return 'Choose one of the configured article categories.';
  if (value.author !== undefined && (typeof value.author !== 'string' || value.author.length > 120)) {
    return 'Author must be a string no longer than 120 characters.';
  }
  if (value.image !== undefined && typeof value.image !== 'string') return 'Image must be a string.';
  if (value.image) {
    const isSitePath = value.image.startsWith('/') && !value.image.startsWith('//');
    if (value.image.length > 2048 || (!isSitePath && !isHttps(value.image))) {
      return 'Image must be a secure https URL or a site-relative path.';
    }
  }
  if (value.seoTitle && (typeof value.seoTitle !== 'string' || value.seoTitle.length > 160)) {
    return 'SEO title must be a string no longer than 160 characters.';
  }
  if (value.metaDescription && (typeof value.metaDescription !== 'string' || value.metaDescription.length > 320)) {
    return 'Meta description must be a string no longer than 320 characters.';
  }
  for (const field of ['publishedAt', 'updatedAt']) {
    if (value[field] !== undefined && typeof value[field] !== 'string') return `${field} must be a date string.`;
  }
  if (value.comparison !== undefined && value.comparison !== null) {
    const { objects, features } = value.comparison;
    if (!Array.isArray(objects) || objects.length < 2 || objects.length > 4) {
      return 'Comparison articles must have between two and four compared objects.';
    }
    if (objects.some((name) => typeof name !== 'string' || !name.trim() || name.length > 80)
      || new Set(objects.map((name) => name.trim().toLowerCase())).size !== objects.length) {
      return 'Compared object names must be unique, non-empty strings no longer than 80 characters.';
    }
    if (!Array.isArray(features) || features.length < 1) return 'Comparison articles must have at least one feature.';
    if (features.some((feature) => !feature || typeof feature.name !== 'string' || !feature.name.trim() || feature.name.length > 100
      || !Array.isArray(feature.values) || feature.values.length !== objects.length
      || feature.values.some((item) => typeof item !== 'string' || !item.trim() || item.length > 500))) {
      return 'Each comparison feature needs a name and a value for every compared object.';
    }
    if (!['AI Content', 'AI Comparisons'].includes(value.category)) return 'Comparison articles must use the AI Content category.';
  } else if (value.category === 'AI Comparisons') {
    return 'Choose comparison article and complete its comparison table.';
  }
  return null;
}
