import { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import SEO from '../components/SEO';
import { categories } from '../data/siteData';

const apiPath = '/__local-content/articles';
const defaultImage = 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?auto=format&fit=crop&w=1200&q=80';

function emptyArticle() {
  return {
    title: '',
    slug: '',
    excerpt: '',
    category: categories[0].title,
    author: 'ToolPilot AI Editorial',
    image: defaultImage,
    content: '',
    seoTitle: '',
    metaDescription: '',
    status: 'draft',
    publishedAt: '',
    updatedAt: '',
  };
}

function toSlug(value) {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export default function AdminPage() {
  const [articles, setArticles] = useState([]);
  const [article, setArticle] = useState(emptyArticle);
  const [slugWasEdited, setSlugWasEdited] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const loadArticles = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(apiPath);
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Could not load local articles.');
      }
      setArticles(result.articles);
    } catch (loadError) {
      setError(`${loadError.message} Start the local editor API with npm run dev:admin-api.`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadArticles();
  }, [loadArticles]);

  const startNewArticle = () => {
    setArticle(emptyArticle());
    setSlugWasEdited(false);
    setError('');
    setNotice('');
  };

  const editArticle = (selected) => {
    setArticle({ ...emptyArticle(), ...selected });
    setSlugWasEdited(true);
    setError('');
    setNotice('');
  };

  const updateField = (field) => (event) => {
    const value = event.target.value;
    setArticle((current) => {
      const next = { ...current, [field]: value };
      if (field === 'title' && !slugWasEdited) {
        next.slug = toSlug(value);
      }
      return next;
    });
    if (field === 'slug') {
      setSlugWasEdited(true);
    }
  };

  const saveArticle = async (event) => {
    event.preventDefault();
    const status = event.nativeEvent.submitter?.value;
    if (!['draft', 'published'].includes(status)) {
      setError('Choose Save draft or Publish article.');
      return;
    }

    setSaving(true);
    setError('');
    setNotice('');
    const now = new Date().toISOString();
    const payload = {
      ...article,
      status,
      publishedAt: status === 'published' ? article.publishedAt || now : article.publishedAt || '',
      updatedAt: now,
    };

    try {
      const response = await fetch(`${apiPath}/${encodeURIComponent(article.slug)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Could not save this article.');
      }

      setArticle(result.article);
      setSlugWasEdited(true);
      setNotice(status === 'published'
        ? `Published locally. The page will be included in the next production build at /articles/${result.article.slug}.`
        : 'Draft saved locally. Drafts are excluded from the public site and sitemap.');
      await loadArticles();
    } catch (saveError) {
      setError(saveError.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 4, md: 8 } }}>
      <SEO
        title="Local Article Editor | ToolPilot AI"
        description="Local-only editor for preparing ToolPilot AI articles."
        canonical="/admin"
        noindex
      />
      <Typography variant="h2" fontWeight={800}>Local article editor</Typography>
      <Alert severity="warning" sx={{ my: 3 }}>
        This editor writes JSON files into this checkout. Publishing here does not deploy the website; build, review, commit, push, and deploy the resulting content.
      </Alert>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {notice && <Alert severity="success" sx={{ mb: 2 }}>{notice}</Alert>}

      <Grid container spacing={3}>
        <Grid item xs={12} lg={4}>
          <Card>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                <Typography variant="h5" fontWeight={800}>Local articles</Typography>
                <Button onClick={startNewArticle}>New</Button>
              </Stack>
              {loading ? (
                <Typography color="text.secondary">Loading article files…</Typography>
              ) : articles.length === 0 ? (
                <Typography color="text.secondary">No locally authored article files yet.</Typography>
              ) : (
                <Stack spacing={1}>
                  {articles.map((item) => (
                    <Button
                      key={item.slug}
                      variant={article.slug === item.slug ? 'contained' : 'outlined'}
                      onClick={() => editArticle(item)}
                      sx={{ justifyContent: 'flex-start', textAlign: 'left', display: 'block' }}
                    >
                      {item.title}
                      <Typography component="span" variant="caption" sx={{ display: 'block' }}>
                        {item.status} · {item.slug}
                      </Typography>
                    </Button>
                  ))}
                </Stack>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} lg={8}>
          <Card>
            <CardContent>
              <Typography variant="h4" fontWeight={800} sx={{ mb: 3 }}>
                {article.slug ? 'Edit article' : 'Create article'}
              </Typography>
              <Box component="form" onSubmit={saveArticle}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={8}>
                    <TextField fullWidth required label="Title" value={article.title} onChange={updateField('title')} />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      required
                      label="URL slug"
                      value={article.slug}
                      onChange={updateField('slug')}
                      helperText="Lowercase words separated by hyphens."
                      inputProps={{ pattern: '[a-z0-9]+(-[a-z0-9]+)*' }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField fullWidth required label="Excerpt" value={article.excerpt} onChange={updateField('excerpt')} inputProps={{ maxLength: 500 }} />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <InputLabel id="article-category-label">Category</InputLabel>
                      <Select
                        labelId="article-category-label"
                        label="Category"
                        value={article.category}
                        onChange={updateField('category')}
                      >
                        {categories.filter((category) => category.slug !== 'comparisons').map((category) => (
                          <MenuItem key={category.slug} value={category.title}>{category.title}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField fullWidth label="Author" value={article.author} onChange={updateField('author')} />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField fullWidth label="Featured image URL (HTTPS or site-relative path)" value={article.image} onChange={updateField('image')} />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      required
                      multiline
                      minRows={16}
                      label="Article body (Markdown)"
                      value={article.content}
                      onChange={updateField('content')}
                      helperText="Use ## headings, ### subheadings, paragraphs, and lines beginning with - for lists. Review claims and sources before publishing."
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField fullWidth label="SEO title (optional)" value={article.seoTitle} onChange={updateField('seoTitle')} inputProps={{ maxLength: 160 }} />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Meta description (optional)"
                      value={article.metaDescription}
                      onChange={updateField('metaDescription')}
                      inputProps={{ maxLength: 320 }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                      <Button type="submit" value="published" variant="contained" disabled={saving}>
                        {saving ? 'Saving…' : 'Publish locally'}
                      </Button>
                      <Button type="submit" value="draft" variant="outlined" disabled={saving}>
                        Save draft
                      </Button>
                      <Button type="button" onClick={startNewArticle} disabled={saving}>Discard form</Button>
                    </Stack>
                  </Grid>
                </Grid>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}
