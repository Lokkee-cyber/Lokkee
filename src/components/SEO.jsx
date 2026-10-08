import { Helmet } from 'react-helmet-async';
import { buildCanonical, defaultSeo } from '../config/seoConfig';
import { siteConfig } from '../config/siteConfig';

export default function SEO({
  title,
  description,
  canonical = '/',
  type = 'website',
  image,
  structuredData,
  noindex = false,
}) {
  const url = buildCanonical(canonical);
  const pageTitle = title || defaultSeo.title;
  const pageDescription = description || defaultSeo.description;
  const ogImage = image || defaultSeo.image;

  return (
    <Helmet>
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      <link rel="canonical" href={url} />
      {noindex && <meta name="robots" content="noindex,nofollow" />}
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={ogImage} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="application-name" content={siteConfig.name} />
      {structuredData && <script type="application/ld+json">{JSON.stringify(structuredData)}</script>}
    </Helmet>
  );
}
