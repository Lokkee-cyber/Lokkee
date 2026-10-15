import { useEffect, useMemo, useState } from 'react';
import { Alert, Box, Button, Container, InputAdornment, Pagination, Paper, Stack, TextField, Typography } from '@mui/material';
import { NewspaperRounded, SearchRounded } from '@mui/icons-material';
import { publishedArticles } from '../data/articles.js';
import ArticleCard from '../components/ArticleCard.jsx';
import SEO from '../components/SEO.jsx';

const pageSize = 12;
const publishedNews = publishedArticles.filter((article) => (
  article.status === 'published' && article.automation?.generated === true
));

export default function NewsPage() {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const normalizedQuery = query.trim().toLowerCase();
  const matchingNews = useMemo(() => publishedNews.filter((article) => {
    const sourceNames = (article.sourceReferences || []).map((source) => source.publisher || source.attribution || '');
    return !normalizedQuery || [
      article.title,
      article.excerpt,
      article.category,
      ...(article.tags || []),
      ...sourceNames,
    ].filter(Boolean).join(' ').toLowerCase().includes(normalizedQuery);
  }), [normalizedQuery]);

  useEffect(() => setPage(1), [normalizedQuery]);

  const pageArticles = matchingNews.slice((page - 1) * pageSize, page * pageSize);

  return (
    <>
      <SEO
        title="News | LokkeeVerse"
        description="Browse the latest source-aware news stories published by LokkeeVerse."
        canonical="/news"
      />
      <Container maxWidth="xl" sx={{ py: { xs: 3, sm: 4, md: 6 }, px: { xs: 2, sm: 3 } }}>
        <Paper
          elevation={0}
          sx={{
            mb: { xs: 3, md: 5 },
            p: { xs: 2.5, sm: 4, md: 5 },
            border: 1,
            borderColor: 'divider',
            borderRadius: { xs: 3, md: 5 },
            background: (theme) => theme.palette.mode === 'dark'
              ? 'linear-gradient(125deg, rgba(91,76,245,0.24), rgba(19,184,166,0.16) 68%, rgba(16,27,45,0.94))'
              : 'linear-gradient(125deg, rgba(91,76,245,0.13), rgba(19,184,166,0.1) 68%, rgba(255,255,255,0.8))',
          }}
        >
          <Stack spacing={2.5} sx={{ maxWidth: 820 }}>
            <Stack direction="row" spacing={1} alignItems="center" color="primary.main">
              <NewspaperRounded fontSize="small" />
              <Typography variant="overline" fontWeight={800} letterSpacing="0.12em">LokkeeVerse News</Typography>
            </Stack>
            <Box>
              <Typography variant="h1" sx={{ fontSize: 'clamp(2.2rem, 6vw, 4rem)', lineHeight: 1.05 }}>
                News and updates
              </Typography>
              <Typography color="text.secondary" sx={{ mt: 1.5, maxWidth: 680 }}>
                Source-aware stories reviewed and published by the LokkeeVerse editorial team, newest first.
              </Typography>
            </Box>
            <TextField
              fullWidth
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search news by headline, topic, or source"
              inputProps={{ 'aria-label': 'Search published news' }}
              InputProps={{
                startAdornment: <InputAdornment position="start"><SearchRounded color="action" /></InputAdornment>,
              }}
              sx={{ maxWidth: 640, bgcolor: 'background.paper', borderRadius: 2 }}
            />
          </Stack>
        </Paper>

        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={1} sx={{ mb: 2.5 }}>
          <Typography variant="body2" color="text.secondary">
            {matchingNews.length} {matchingNews.length === 1 ? 'published story' : 'published stories'}
          </Typography>
          {query && <Button size="small" variant="text" onClick={() => setQuery('')}>Clear search</Button>}
        </Stack>

        {pageArticles.length ? (
          <>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'minmax(0, 1fr)', sm: 'repeat(2, minmax(0, 1fr))', lg: 'repeat(3, minmax(0, 1fr))' }, gap: { xs: 2, md: 3 }, alignItems: 'stretch' }}>
              {pageArticles.map((article) => <ArticleCard key={article.slug} article={article} />)}
            </Box>
            {matchingNews.length > pageSize && (
              <Stack alignItems="center" sx={{ mt: 4 }}>
                <Pagination
                  count={Math.ceil(matchingNews.length / pageSize)}
                  page={page}
                  onChange={(_event, value) => setPage(value)}
                  color="primary"
                  aria-label="News pages"
                />
              </Stack>
            )}
          </>
        ) : (
          <Alert severity="info">
            {normalizedQuery ? 'No published news matches that search. Try another headline, topic, or source.' : 'No generated news stories have been published yet. Approved stories will appear here.'}
          </Alert>
        )}
      </Container>
    </>
  );
}
