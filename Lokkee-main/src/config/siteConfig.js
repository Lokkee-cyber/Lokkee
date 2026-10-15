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
  description: 'Discover verified AI tools, practical comparisons, and smarter workflows for creators, students, businesses, and developers.',
  domain: siteUrl,
  siteUrl,
  contactEmail: 'toolpillot.support@gmail.com',
  gaMeasurementId: import.meta.env.VITE_GA_MEASUREMENT_ID || '',
  adsenseClient: import.meta.env.VITE_ADSENSE_CLIENT || '',
  adsEnabled: import.meta.env.VITE_ADS_ENABLED === 'true',
  contactEndpoint: import.meta.env.VITE_CONTACT_ENDPOINT || '',
  newsletterEndpoint: import.meta.env.VITE_NEWSLETTER_ENDPOINT || '',
  author: {
    name: 'LokkeeVerse Editorial',
    slug: 'lokkeeverse-editorial',
    bio: 'LokkeeVerse Editorial creates source-aware, practical guidance for evaluating AI tools and improving everyday digital workflows.',
    areas: ['AI tools', 'workflow guidance', 'product research', 'editorial quality'],
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
