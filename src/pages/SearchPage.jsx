import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Alert,
  Box,
  Container,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Pagination,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { categories, tools } from '../data/siteData.js';
import { publishedArticles } from '../data/articles.js';
import SEO from '../components/SEO.jsx';
import ArticleCard from '../components/ArticleCard.jsx';
import ToolCard from '../components/ToolCard.jsx';
import CategoryCard from '../components/CategoryCard.jsx';

const categoryIcons = {
  'AI Tools': () => 'A',
  'AI Video': () => 'V',
  'AI Image': () => 'I',
  'AI Writing': () => 'W',
};

const searchItems = [
  ...categories.map((item) => ({ type: 'Category', ...item })),
  ...tools.map((tool) => ({ type: 'Tool', ...tool })),
  ...publishedArticles.map((article) => ({ type: 'Article', ...article })),
];

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [page, setPage] = useState(1);

  const searchTerm = (searchParams.get('q') || '').toLowerCase();

  const results = useMemo(() => {
    const items = searchItems.filter((item) => {
      const matchesText = !searchTerm || [item.title, item.name, item.label, item.slug, item.description, item.excerpt].filter(Boolean).join(' ').toLowerCase().includes(searchTerm);
      const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter || item.title === categoryFilter;
      const matchesType = typeFilter === 'all' || item.type === typeFilter;
      return matchesText && matchesCategory && matchesType;
    });
    return items;
  }, [searchTerm, categoryFilter, typeFilter]);

  const pageSize = 8;
  const paginated = results.slice((page - 1) * pageSize, page * pageSize);

  return (
    <>
      <SEO title="Search | ToolPilot AI" description="Search articles, AI tools and categories from ToolPilot AI." canonical="/search" />
      <Container maxWidth="xl" sx={{ py: { xs: 4, md: 6 } }}>
      <Typography variant="h3" fontWeight={800} sx={{ mb: 3 }}>Search</Typography>
      <TextField
        fullWidth
        value={searchTerm}
        onChange={(event) => setSearchParams({ q: event.target.value })}
        placeholder="Search AI tools, articles, categories..."
        sx={{ mb: 3 }}
      />

      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mb: 4 }}>
        <FormControl fullWidth>
          <InputLabel>Category</InputLabel>
          <Select label="Category" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="AI Tools">AI Tools</MenuItem>
            <MenuItem value="AI Video">AI Video</MenuItem>
            <MenuItem value="AI Writing">AI Writing</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel>Content type</InputLabel>
          <Select label="Content type" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="Article">Articles</MenuItem>
            <MenuItem value="Tool">AI tools</MenuItem>
            <MenuItem value="Category">Categories</MenuItem>
          </Select>
        </FormControl>
      </Stack>

      {results.length === 0 ? (
        <Alert severity="info">No results found. Try a different keyword or remove one of the filters.</Alert>
      ) : (
        <>
          <Grid container spacing={3}>
            {paginated.map((item) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={`${item.type}-${item.slug || item.title}`}>
                {item.type === 'Article' ? <ArticleCard article={item} /> : item.type === 'Tool' ? <ToolCard tool={item} /> : <CategoryCard category={{ ...item, articleCount: 12 }} icon={categoryIcons[item.title] || (() => item.title.slice(0, 1))} />}
              </Grid>
            ))}
          </Grid>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Pagination count={Math.ceil(results.length / pageSize)} page={page - 1} onChange={(e, value) => setPage(value)} color="primary" />
          </Box>
        </>
      )}
    </Container>
    </>
  );
}
