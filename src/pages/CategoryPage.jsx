import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Alert, Box, Button, Container, Pagination, Stack, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import ArticleCard from '../components/ArticleCard.jsx';
import Newsletter from '../components/Newsletter.jsx';
import { categories } from '../data/siteData.js';
import { publishedArticles } from '../data/articles.js';
import SEO from '../components/SEO.jsx';
import { scrollToElement } from '../utils/scrollToElement.js';

const categoryDescriptions = {
  'ai-tools': 'Discover the best AI tools for productivity, writing, coding, research and daily work.',
  'ai-video': 'Discover AI-powered tools for video creation, editing, animation, avatars and more.',
  'ai-image': 'Explore AI image generators and photo editing tools for design, art and marketing workflows.',
  'ai-writing': 'Use AI for ideas, editing, research and clearer communication across content and business work.',
  'ai-audio': 'Create voiceovers, podcasts, transcription and natural-sounding audio with AI-powered tools.',
  'ai-coding': 'Accelerate your development work with tools for debugging, generating code and productivity.',
  'ai-creators': 'Build, publish and grow creative workflows across YouTube, socials and digital products.',
  'ai-business': 'Learn practical AI tools for marketing, automation, operations and customer experience.',
  'ai-students': 'Find helpful tools for study, research, making notes and understanding new topics.',
  comparisons: 'Compare the best AI tools and see what may fit your goals, workflow and budget.',
};

const pageSize = 12;

export default function CategoryPage({ categorySlug }) {
  const category = categories.find((item) => item.slug === categorySlug) || categories[0];
  const [page, setPage] = useState(1);
  const articlesRef = useRef(null);
  const previousPage = useRef(page);

  const categoryArticles = useMemo(
    () => publishedArticles.filter((article) => article.category === category.title),
    [category.title],
  );
  const visibleArticles = categoryArticles.slice((page - 1) * pageSize, page * pageSize);

  useLayoutEffect(() => {
    if (previousPage.current !== page) {
      scrollToElement(articlesRef.current);
      previousPage.current = page;
    }
  }, [page]);

  return (
    <>
      <SEO title={`${category.title} | LokkeeVerse`} description={categoryDescriptions[categorySlug] || category.description} canonical={category.path} />
      <Container maxWidth="xl" sx={{ py: { xs: 4, md: 6 } }}>
        <Typography variant="overline" color="primary.main" fontWeight={800}>{category.title}</Typography>
        <Typography variant="h1" sx={{ mt: 1, fontSize: { xs: '2.5rem', sm: '3.5rem' } }}>{category.title}</Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 1.5, maxWidth: 760 }}>
          {categoryDescriptions[categorySlug] || category.description}
        </Typography>

        <Stack ref={articlesRef} spacing={3} sx={{ my: { xs: 4, md: 6 }, scrollMarginTop: 90 }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'stretch', sm: 'flex-end' }} spacing={1}>
            <Box>
              <Typography variant="h3" fontWeight={800}>Latest articles</Typography>
              <Typography color="text.secondary" sx={{ mt: 0.5 }}>{categoryArticles.length} guides · newest first</Typography>
            </Box>
            <Button component={Link} to="/articles" variant="text" sx={{ alignSelf: { xs: 'flex-start', sm: 'auto' } }}>Browse all articles</Button>
          </Stack>
          {visibleArticles.length ? (
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'minmax(0, 1fr)', sm: 'repeat(2, minmax(0, 1fr))', lg: 'repeat(3, minmax(0, 1fr))' }, gap: { xs: 2, md: 3 }, alignItems: 'stretch' }}>
              {visibleArticles.map((article) => <ArticleCard key={article.slug} article={article} />)}
            </Box>
          ) : <Alert severity="info">There are no published articles in this topic yet.</Alert>}
          <Stack alignItems="center">
            <Pagination count={Math.max(1, Math.ceil(categoryArticles.length / pageSize))} page={page} onChange={(event, value) => setPage(value)} color="primary" />
          </Stack>
        </Stack>

        <Newsletter />
      </Container>
    </>
  );
}
