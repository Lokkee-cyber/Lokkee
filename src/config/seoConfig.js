import { siteConfig } from './siteConfig';

export const defaultSeo = {
  title: `${siteConfig.name} — Explore More. Create Smarter.`,
  description: siteConfig.description,
  path: '/',
  type: 'website',
  image: `${siteConfig.siteUrl}/og-cover.svg`,
};

export function buildCanonical(path) {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${siteConfig.siteUrl.replace(/\/$/, '')}${normalizedPath}`;
}

export function buildPageUrl(path) {
  return buildCanonical(path);
}
