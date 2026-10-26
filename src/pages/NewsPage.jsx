import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Alert, Box, Button, Chip, Container, InputAdornment, Pagination, Stack, TextField, Typography } from '@mui/material';
import { NewspaperRounded, SearchRounded } from '@mui/icons-material';
import { publishedArticles } from '../data/articles.js';
import ArticleCard from '../components/ArticleCard.jsx';
import SEO from '../components/SEO.jsx';
import { isNewsArticle } from '../data/contentCategories.js';

const pageSize = 12;
const publishedNews = publishedArticles.filter(isNewsArticle);

const NEWS_CATEGORIES = ['Nigeria News', 'World News'];

export default function NewsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const activeCategory = searchParams.get('category') || '';
  const normalizedQuery = query.trim().toLowerCase();

  const availableCategories = useMemo(
    () => [...new Set(publishedNews.map((article) => article.originalCategory || article.category).filter(Boolean))],
    [],
  );

  const matchingNews = useMemo(() => publishedNews.filter((article) => {
    const articleCategory = article.originalCategory || article.category;
    const matchesCategory = !activeCategory || articleCategory === activeCategory;
    const sourceNames = (article.sourceReferences || []).map((source) => source.publisher || source.attribution || '');
    return matchesCategory && (!normalizedQuery || [
      article.title,
      article.excerpt,
      article.category,
      ...(article.tags || []),
      ...sourceNames,
    ].filter(Boolean).join(' ').toLowerCase().includes(normalizedQuery));
  }), [activeCategory, normalizedQuery]);

  useEffect(() => setPage(1), [normalizedQuery, activeCategory]);

  const pageArticles = matchingNews.slice((page - 1) * pageSize, page * pageSize);

  const setCategory = (category) => {
    if (category) {
      setSearchParams({ category });
    } else {
      setSearchParams({});
    }
  };

  return (
    <>
      <SEO
        title="News | ToolPillot"
        description="Browse the latest source-aware news stories published by ToolPillot."
        canonical="/news"
      />
      <Container maxWidth="xl" sx={{ py: { xs: 3, sm: 4, md: 5 }, px: { xs: 2, sm: 3 } }}>
        <Box sx={{ mb: { xs: 3, md: 4 }, maxWidth: 820 }}>
          <Stack direction="row" spacing={1} alignItems="center" color="primary.main">
            <NewspaperRounded fontSize="small" />
            <Typography variant="overline" fontWeight={800} letterSpacing="0.12em">ToolPillot News</Typography>
          </Stack>
          <Typography variant="h1" sx={{ fontSize: { xs: '2.2rem', sm: '3rem', md: '3.5rem' }, lineHeight: 1.05 }}>
            News and updates
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 1.5, maxWidth: 680 }}>
            Reporting, culture, sport and current affairs from the ToolPillot editorial desk, newest first.
          </Typography>
        </Box>

        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={2}
          alignItems={{ xs: 'stretch', md: 'center' }}
          sx={{ mb: 3 }}
        >
          <TextField
            fullWidth
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search news by headline, topic, or source"
            inputProps={{ 'aria-label': 'Search published news' }}
            InputProps={{
              startAdornment: <InputAdornment position="start"><SearchRounded color="action" /></InputAdornment>,
            }}
            sx={{ maxWidth: { xs: '100%', md: 480 }, bgcolor: 'background.paper', borderRadius: 2 }}
          />

          <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', rowGap: 1 }} useFlexGap>
            {availableCategories.map((category) => (
              <Chip
                key={category}
                label={category}
                clickable
                color={activeCategory === category ? 'primary' : 'default'}
                variant={activeCategory === category ? 'filled' : 'outlined'}
                onClick={() => setCategory(activeCategory === category ? '' : category)}
                aria-pressed={activeCategory === category}
                sx={{ fontWeight: 700 }}
              />
            ))}
            {activeCategory && (
              <Button size="small" onClick={() => setCategory('')} sx={{ fontWeight: 700 }}>
                Clear
              </Button>
            )}
          </Stack>
        </Stack>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
          {matchingNews.length} {matchingNews.length === 1 ? 'published story' : 'published stories'}
          {activeCategory ? ` in ${activeCategory}` : ''}
        </Typography>

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
            {normalizedQuery || activeCategory
              ? 'No published news matches that filter. Try another headline, topic, or source.'
              : 'No published news stories yet. Approved stories will appear here.'}
          </Alert>
        )}
      </Container>
    </>
  );
}
