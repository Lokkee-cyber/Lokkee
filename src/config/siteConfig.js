const productionSiteUrl = 'https://www.toolpillot.com';
const configuredSiteUrl = import.meta.env.VITE_SITE_URL || import.meta.env.SITE_URL;
let siteUrl = productionSiteUrl;
if (!import.meta.env.PROD && configuredSiteUrl) {
  try {
    const configuredUrl = new URL(configuredSiteUrl);
    siteUrl = configuredUrl.origin;
  } catch {
    siteUrl = productionSiteUrl;
  }
}

export const siteConfig = {
  name: 'LokkeeVerse',
  tagline: 'Explore More. Create Smarter.',
  description: 'Read serial fiction, follow the news, and explore practical AI content on LokkeeVerse.',
  domain: siteUrl,
  siteUrl,
  contactEmail: 'toolpillot.support@gmail.com',
  gaMeasurementId: import.meta.env.VITE_GA_MEASUREMENT_ID || '',
  contactEndpoint: import.meta.env.VITE_CONTACT_ENDPOINT || '',
  newsletterEndpoint: import.meta.env.VITE_NEWSLETTER_ENDPOINT || '',
  author: {
    name: 'LokkeeVerse',
    slug: 'lokkeeverse-editorial',
    bio: 'LokkeeVerse publishes serial fiction, source-aware news, and practical AI guidance.',
    areas: ['serial fiction', 'news', 'AI tools', 'editorial quality'],
  },
};

export const publicRoutes = [
  '/',
  '/ai-tools',
  '/ai-video',
  '/ai-image',
  '/ai-writing',
  '/ai-audio',
  '/ai-coding',
  '/ai-creators',
  '/ai-business',
  '/ai-students',
  '/comparisons',
  '/news',
  '/fiction',
  '/fiction/:seriesSlug',
  '/fiction/:seriesSlug/:episodeSlug',
  '/ai-content',
  '/search',
  '/about',
  '/contact',
  '/privacy-policy',
  '/terms',
  '/disclaimer',
  '/affiliate-disclosure',
  '/editorial-policy',
  '/404',
  '/articles/:slug',
  '/tools/:slug',
  '/compare/:slug',
  '/authors/:slug',
];
