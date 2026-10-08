import { siteConfig } from './siteConfig';

export const defaultSeo = {
  title: `${siteConfig.name} — Discover the Best AI Tools`,
  description: siteConfig.description,
  path: '/',
  type: 'website',
  image: `${siteConfig.siteUrl}/og-cover.svg`,
};

export function buildCanonical(path) {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${siteConfig.siteUrl}${normalizedPath}`;
}

export function buildPageUrl(path) {
  return buildCanonical(path);
}
