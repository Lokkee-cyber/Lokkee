import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Box, Container, Pagination, Stack, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import ArticleCard from '../components/ArticleCard.jsx';
import ToolCard from '../components/ToolCard.jsx';
import Newsletter from '../components/Newsletter.jsx';
import { categories, tools } from '../data/siteData.js';
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

export default function CategoryPage({ categorySlug }) {
  const category = categories.find((item) => item.slug === categorySlug) || categories[0];
  const [page, setPage] = useState(1);
  const latestArticlesRef = useRef(null);
  const previousPageRef = useRef(page);
  const pageSize = 4;

  const categoryArticles = useMemo(
    () => publishedArticles.filter((article) => article.category.toLowerCase().includes(category.title.toLowerCase().split(' ')[0]) || article.category === category.title),
    [category.title],
  );

  const relatedTools = useMemo(
    () => tools.filter((tool) => tool.category.toLowerCase().includes(category.title.toLowerCase().split(' ')[0]) || category.title === 'AI Tools'),
    [category.title],
  );

  const visibleArticles = categoryArticles.slice((page - 1) * pageSize, page * pageSize);

  useLayoutEffect(() => {
    if (previousPageRef.current !== page) {
      scrollToElement(latestArticlesRef.current);
      previousPageRef.current = page;
    }
  }, [page]);

  return (
    <>
      <SEO title={`${category.title} | ToolPilot AI`} description={categoryDescriptions[categorySlug] || category.description} canonical={category.path} />
      <Container maxWidth="xl" sx={{ py: { xs: 4, md: 6 } }}>
      <Typography variant="overline" color="primary.main" fontWeight={700}>{category.title}</Typography>
      <Typography variant="h2" sx={{ mt: 1, mb: 2, fontSize: { xs: '2.25rem', sm: '3rem', md: '3.75rem' } }}>{category.title}</Typography>
      <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 760 }}>
        {categoryDescriptions[categorySlug] || category.description}
      </Typography>

      <Stack spacing={4} sx={{ my: 5 }}>
        <Typography variant="h4" fontWeight={800}>Featured articles</Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'minmax(0, 1fr)', md: 'repeat(3, minmax(0, 1fr))' }, gap: 3, width: '100%', minWidth: 0 }}>
          {categoryArticles.slice(0, 3).map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </Box>
      </Stack>

      <Stack ref={latestArticlesRef} spacing={4} sx={{ my: 5 }}>
        <Typography variant="h4" fontWeight={800}>Latest articles</Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'minmax(0, 1fr)', sm: 'repeat(2, minmax(0, 1fr))', lg: 'repeat(4, minmax(0, 1fr))' }, gap: 3, width: '100%', minWidth: 0 }}>
          {visibleArticles.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </Box>
        <Stack alignItems="center">
          <Pagination
            count={Math.max(1, Math.ceil(categoryArticles.length / pageSize))}
            page={page}
            onChange={(event, value) => setPage(value)}
            color="primary"
          />
        </Stack>
      </Stack>

      <Stack spacing={3} sx={{ my: 5 }}>
        <Typography variant="h4" fontWeight={800}>Popular tools</Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'minmax(0, 1fr)', md: 'repeat(3, minmax(0, 1fr))' }, gap: 3, width: '100%', minWidth: 0 }}>
          {relatedTools.slice(0, 3).map((tool) => (
            <ToolCard key={tool.slug} tool={tool} />
          ))}
        </Box>
      </Stack>

      <Newsletter />
    </Container>
    </>
  );
}
