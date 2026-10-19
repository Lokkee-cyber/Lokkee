import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Alert,
  Box,
  Container,
  FormControl,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  Pagination,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { SearchRounded } from '@mui/icons-material';
import { categories } from '../data/siteData.js';
import { publishedArticles } from '../data/articles.js';
import SEO from '../components/SEO.jsx';
import ArticleCard from '../components/ArticleCard.jsx';
import CategoryCard from '../components/CategoryCard.jsx';
import { scrollToElement } from '../utils/scrollToElement.js';

const categoryIcons = {
  'AI Tools': () => 'A',
  'AI Video': () => 'V',
  'AI Image': () => 'I',
  'AI Writing': () => 'W',
};

const searchItems = [
  ...categories.map((item) => ({ type: 'Category', ...item })),
  ...publishedArticles.map((article) => ({ type: 'Article', ...article })),
];

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [page, setPage] = useState(1);
  const resultsRef = useRef(null);
  const previousPageRef = useRef(page);

  const searchTerm = (searchParams.get('q') || '').toLowerCase();

  useEffect(() => {
    setPage(1);
  }, [searchTerm, categoryFilter, typeFilter]);

  useLayoutEffect(() => {
    if (previousPageRef.current !== page) {
      scrollToElement(resultsRef.current);
      previousPageRef.current = page;
    }
  }, [page]);

  const results = useMemo(() => {
    const items = searchItems.filter((item) => {
      const matchesText = !searchTerm || [item.title, item.name, item.label, item.slug, item.description, item.excerpt].filter(Boolean).join(' ').toLowerCase().includes(searchTerm);
      const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter || item.title === categoryFilter;
      const matchesType = typeFilter === 'all' || item.type === typeFilter;
      // Without a query or filters, only the categories are listed rather than every article.
      const browsingDefault = !searchTerm && categoryFilter === 'all' && typeFilter === 'all';
      return matchesText && matchesCategory && matchesType && (!browsingDefault || item.type === 'Category');
    });
    return items;
  }, [searchTerm, categoryFilter, typeFilter]);

  const pageSize = 8;
  const paginated = results.slice((page - 1) * pageSize, page * pageSize);

  return (
    <>
      <SEO title="Search | LokkeeVerse" description="Search articles, AI tools, and categories from LokkeeVerse." canonical="/search" noindex />
      <Container maxWidth="xl" sx={{ py: { xs: 3, sm: 4, md: 6 }, px: { xs: 2, sm: 3 } }}>
      <Box sx={{ mb: { xs: 3, md: 4 }, maxWidth: 760 }}>
        <Typography variant="overline" color="primary.main" fontWeight={800} letterSpacing="0.1em">Explore the directory</Typography>
        <Typography variant="h1" sx={{ mb: 1 }}>Search</Typography>
        <Typography color="text.secondary">Find articles, AI tools, and topics for the work you want to do.</Typography>
      </Box>
      <TextField
        fullWidth
        value={searchTerm}
        onChange={(event) => setSearchParams({ q: event.target.value })}
        placeholder="Search AI tools, articles, categories..."
        sx={{ mb: 3 }}
        InputProps={{
          startAdornment: <InputAdornment position="start"><SearchRounded color="action" /></InputAdornment>,
        }}
      />
             
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mb: 4 }}>
        <FormControl fullWidth>
          <InputLabel>Category</InputLabel>
          <Select label="Category" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
            <MenuItem value="all">All</MenuItem>
            {categories.map((category) => (
              <MenuItem key={category.slug} value={category.title}>{category.title}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel>Content type</InputLabel>
          <Select label="Content type" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="Article">Articles</MenuItem>
            <MenuItem value="Category">Categories</MenuItem>
          </Select>
        </FormControl>
      </Stack>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {results.length} {results.length === 1 ? 'result' : 'results'}
      </Typography>
      {results.length === 0 ? (
        <Alert severity="info">No results found. Try a different keyword or remove one of the filters.</Alert>
      ) : (
        <>
          <Grid container ref={resultsRef} spacing={{ xs: 2, md: 3 }} sx={{ scrollMarginTop: { xs: 72, sm: 86 } }}>
            {paginated.map((item) => (
              <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={`${item.type}-${item.slug || item.title}`}>
                {item.type === 'Article' ? <ArticleCard article={item} /> : <CategoryCard category={{ ...item, articleCount: 12 }} icon={categoryIcons[item.title] || (() => item.title.slice(0, 1))} />}
              </Grid>
            ))}
          </Grid>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Pagination
              count={Math.ceil(results.length / pageSize)}
              page={page}
              onChange={(event, value) => setPage(value)}
              color="primary"
            />
          </Box>
        </>
      )}
    </Container>
    </>
  );
}
