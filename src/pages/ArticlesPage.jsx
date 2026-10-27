import { useEffect, useMemo, useState } from 'react';
import { Alert, Box, Button, Container, InputAdornment, Pagination, Stack, TextField, Typography } from '@mui/material';
import { SearchRounded } from '@mui/icons-material';
import ArticleCard from '../components/ArticleCard.jsx';
import SEO from '../components/SEO.jsx';
import { publishedArticles } from '../data/articles.js';
import AdSlot from '../components/AdSlot.jsx';

const pageSize = 12;

export default function ArticlesPage() {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const normalizedQuery = query.trim().toLowerCase();
  const articles = useMemo(() => publishedArticles.filter((article) => (
    !normalizedQuery || [article.title, article.excerpt, article.category, article.author]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()
      .includes(normalizedQuery)
  )), [normalizedQuery]);

  useEffect(() => setPage(1), [normalizedQuery]);

  const visibleArticles = articles.slice((page - 1) * pageSize, page * pageSize);

  return (
    <>
      <SEO title="All articles | LokkeeVerse" description="Browse every LokkeeVerse guide, comparison, and practical AI workflow, newest first." canonical="/articles" />
      <Container maxWidth="xl" sx={{ py: { xs: 4, md: 6 } }}>
        <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'stretch', md: 'flex-end' }} spacing={3} sx={{ mb: 4 }}>
          <Box>
            <Typography variant="overline" color="primary.main" fontWeight={800} letterSpacing="0.12em">The LokkeeVerse library</Typography>
            <Typography variant="h1" sx={{ fontSize: { xs: '2.5rem', sm: '3.5rem' }, mt: 0.5 }}>All articles</Typography>
            <Typography color="text.secondary" sx={{ mt: 1, maxWidth: 650 }}>
              Browse practical AI guides and comparisons. The newest articles appear first.
            </Typography>
          </Box>
          <TextField
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search all articles"
            aria-label="Search all articles"
            sx={{ width: { xs: '100%', md: 380 } }}
            InputProps={{
              startAdornment: <InputAdornment position="start"><SearchRounded color="action" /></InputAdornment>,
            }}
          />
        </Stack>

        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            {articles.length} {articles.length === 1 ? 'article' : 'articles'} | newest first
          </Typography>
        </Stack>

        {visibleArticles.length ? (
          <>
            {/* Leaderboard above the article grid */}
            <AdSlot variant="leaderboard" sx={{ mb: 3 }} />
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'minmax(0, 1fr)', sm: 'repeat(2, minmax(0, 1fr))', lg: 'repeat(3, minmax(0, 1fr))' }, gap: { xs: 2, md: 3 }, alignItems: 'stretch' }}>
              {visibleArticles.map((article) => <ArticleCard key={article.slug} article={article} />)}
            </Box>
            <Stack alignItems="center" sx={{ mt: 4 }}>
              <Pagination
                count={Math.max(1, Math.ceil(articles.length / pageSize))}
                page={page}
                onChange={(event, value) => setPage(value)}
                color="primary"
                aria-label="Article pages"
              />
            </Stack>
            {/* Inline ad below pagination */}
            <AdSlot variant="inline" sx={{ mt: 4 }} />
          </> 
        ) : (
          <Alert severity="info">No articles match that search. Try a different title or topic.</Alert>
        )}
      </Container>
    </>
  );
}