import { Helmet } from 'react-helmet-async';

export default function SEO({ title, description, canonical, type = 'website', article }) {
  const host = import.meta.env.VITE_SITE_URL || 'http://localhost:5173';
  const url = canonical ? `${host}${canonical}` : host;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {article && <script type="application/ld+json">{JSON.stringify(article)}</script>}
    </Helmet>
  );
}
