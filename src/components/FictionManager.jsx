import { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { fictionGenres } from '../data/fictionGenres.js';
import ImageUploadField from './ImageUploadField.jsx';

const apiPath = '/__local-content';
const defaultCover = 'https://images.unsplash.com/photo-1519751138087-5bf79df62d5b?auto=format&fit=crop&w=800&q=80';

function toSlug(value) {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function emptySeries() {
  return {
    slug: '',
    title: '',
    genre: fictionGenres[0]?.label || 'Romance',
    synopsis: '',
    author: 'LokkeeVerse',
    cover: defaultCover,
    status: 'published',
  };
}

function emptyEpisode(seriesSlug, nextNumber) {
  return {
    slug: '',
    seriesSlug: seriesSlug || '',
    number: nextNumber || 1,
    title: '',
    excerpt: '',
    content: '',
    status: 'published',
  };
}

export default function FictionManager() {
  const [seriesList, setSeriesList] = useState([]);
  const [episodes, setEpisodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [series, setSeries] = useState(emptySeries);
  const [episode, setEpisode] = useState(emptyEpisode('', 1));
  const [seriesSlugWasEdited, setSeriesSlugWasEdited] = useState(false);
  const [episodeSlugWasEdited, setEpisodeSlugWasEdited] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${apiPath}/fiction`);
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Could not load fiction.');
      setSeriesList(result.series);
      setEpisodes(result.episodes);
    } catch (loadError) {
      setError(import.meta.env.DEV ? `${loadError.message} Start the local admin API with npm run dev:admin-api.` : loadError.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const episodesForSeries = (seriesSlug) => episodes
    .filter((item) => item.seriesSlug === seriesSlug)
    .sort((first, second) => first.number - second.number);

  const startNewSeries = () => {
    setSeries(emptySeries());
    setSeriesSlugWasEdited(false);
    setError('');
    setNotice('');
  };

  const editSeries = (selected) => {
    setSeries({ ...emptySeries(), ...selected });
    setSeriesSlugWasEdited(true);
    setError('');
    setNotice('');
  };

  const editEpisode = (selected) => {
    setEpisode({ ...emptyEpisode(selected.seriesSlug, 1), ...selected });
    setEpisodeSlugWasEdited(true);
    setError('');
    setNotice('');
  };

  const startNewEpisode = (seriesSlug) => {
    const existing = episodesForSeries(seriesSlug);
    const nextNumber = existing.length ? Math.max(...existing.map((item) => item.number)) + 1 : 1;
    setEpisode(emptyEpisode(seriesSlug, nextNumber));
    setEpisodeSlugWasEdited(false);
    setError('');
    setNotice('');
  };

  const updateSeries = (field) => (event) => {
    const value = event.target.value;
    setSeries((current) => {
      const next = { ...current, [field]: value };
      if (field === 'title' && !seriesSlugWasEdited) next.slug = toSlug(value);
      return next;
    });
    if (field === 'slug') setSeriesSlugWasEdited(true);
  };

  const updateEpisode = (field) => (event) => {
    const value = event.target.value;
    setEpisode((current) => {
      const next = { ...current, [field]: field === 'number' ? Number(value) || 1 : value };
      if (field === 'title' && !episodeSlugWasEdited) {
        next.slug = `${current.seriesSlug}-${String(next.number).padStart(2, '0')}`;
      }
      return next;
    });
    if (field === 'slug') setEpisodeSlugWasEdited(true);
  };

  const saveSeries = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    setNotice('');
    try {
      const response = await fetch(`${apiPath}/fiction/series/${encodeURIComponent(series.slug)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(series),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Could not save this series.');
      setNotice(result.deploymentTriggered
        ? `Pushed to GitHub. The live page /fiction/${series.slug} will update after the deploy.`
        : `Series saved locally: ${series.slug}`);
      await load();
    } catch (saveError) {
      setError(saveError.message);
    } finally {
      setSaving(false);
    }
  };

  const saveEpisode = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    setNotice('');
    try {
      const response = await fetch(`${apiPath}/fiction/episodes/${encodeURIComponent(episode.seriesSlug)}/${encodeURIComponent(episode.slug)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(episode),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Could not save this episode.');
      setNotice(result.deploymentTriggered
        ? `Pushed to GitHub. Episode ${episode.number} of ${episode.seriesSlug} will appear on the live site after the deploy.`
        : `Episode saved locally: ${episode.slug}`);
      await load();
      startNewEpisode(episode.seriesSlug);
    } catch (saveError) {
      setError(saveError.message);
    } finally {
      setSaving(false);
    }
  };

  const nextEpisodeNumber = (seriesSlug) => {
    const existing = episodesForSeries(seriesSlug);
    return existing.length ? Math.max(...existing.map((item) => item.number)) + 1 : 1;
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {notice && <Alert severity="success" sx={{ mb: 2 }}>{notice}</Alert>}
      </Grid>

      <Grid item xs={12} lg={5}>
        <Card>
          <CardContent>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
              <Typography variant="h5" fontWeight={800}>Stories (series)</Typography>
              <Button onClick={startNewSeries}>New</Button>
            </Stack>
            {loading ? <CircularProgress size={24} /> : (
              <Stack spacing={1}>
                {seriesList.map((item) => (
                  <Box key={item.slug}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
                      <Button onClick={() => editSeries(item)} sx={{ justifyContent: 'flex-start', textTransform: 'none', fontWeight: 700 }}>
                        {item.title}
                      </Button>
                      <Button size="small" variant="outlined" onClick={() => startNewEpisode(item.slug)}>
                        + Episode {nextEpisodeNumber(item.slug)}
                      </Button>
                    </Stack>
                    <Typography variant="caption" color="text.secondary">
                      {item.genre} · {episodesForSeries(item.slug).length} episode(s)
                    </Typography>
                    <Divider sx={{ mt: 1 }} />
                  </Box>
                ))}
                {seriesList.length === 0 && <Typography color="text.secondary">No stories found.</Typography>}
              </Stack>
            )}
          </CardContent>
        </Card>

        <Card sx={{ mt: 3 }}>
          <CardContent>
            <Typography variant="h6" fontWeight={800} sx={{ mb: 2 }}>
              {series.slug ? `Edit story: ${series.title}` : 'Create a story'}
            </Typography>
            <Box component="form" onSubmit={saveSeries}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={8}>
                  <TextField fullWidth required label="Title" value={series.title} onChange={updateSeries('title')} />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    required
                    label="URL slug"
                    value={series.slug}
                    onChange={updateSeries('slug')}
                    helperText="Lowercase words separated by hyphens."
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel id="series-genre-label">Genre (subcategory)</InputLabel>
                    <Select labelId="series-genre-label" label="Genre (subcategory)" value={series.genre} onChange={updateSeries('genre')}>
                      {fictionGenres.map((genre) => (
                        <MenuItem key={genre.slug} value={genre.label}>{genre.label}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField fullWidth label="Author" value={series.author} onChange={updateSeries('author')} />
                </Grid>
                <Grid item xs={12}>
                  <TextField fullWidth required multiline minRows={3} label="Synopsis" value={series.synopsis} onChange={updateSeries('synopsis')} />
                </Grid>
                <Grid item xs={12}>
                  <ImageUploadField
                    label="Cover image (upload or URL)"
                    value={series.cover}
                    onChange={updateSeries('cover')}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Stack direction="row" spacing={2}>
                    <Button type="submit" variant="contained" disabled={saving}>{saving ? 'Saving…' : 'Save story'}</Button>
                    <Button type="button" onClick={startNewSeries} disabled={saving}>Discard form</Button>
                  </Stack>
                </Grid>
              </Grid>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} lg={7}>
        <Card>
          <CardContent>
            <Typography variant="h5" fontWeight={800} sx={{ mb: 2 }}>Episodes per story</Typography>
            {loading ? <CircularProgress size={24} /> : (
              <Stack spacing={2} sx={{ mb: 3 }}>
                {seriesList.map((item) => (
                  <Box key={item.slug}>
                    <Typography variant="subtitle1" fontWeight={700}>{item.title}</Typography>
                    <Stack direction="row" flexWrap="wrap" gap={1} sx={{ mt: 1 }}>
                      {episodesForSeries(item.slug).map((item2) => (
                        <Button key={item2.slug} size="small" variant="text" onClick={() => editEpisode(item2)}>
                          Ep {item2.number}: {item2.title}
                        </Button>
                      ))}
                      {episodesForSeries(item.slug).length === 0 && (
                        <Typography variant="body2" color="text.secondary">No episodes yet.</Typography>
                      )}
                    </Stack>
                  </Box>
                ))}
              </Stack>
            )}
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" fontWeight={800} sx={{ mb: 2 }}>
              {episode.seriesSlug && episode.slug
                ? `Edit episode ${episode.number} of ${episode.seriesSlug}`
                : 'Upload a new episode'}
            </Typography>
            <Box component="form" onSubmit={saveEpisode}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth required>
                    <InputLabel id="episode-series-label">Story</InputLabel>
                    <Select
                      labelId="episode-series-label"
                      label="Story"
                      value={episode.seriesSlug}
                      onChange={(event) => {
                        const seriesSlug = event.target.value;
                        setEpisode((current) => ({
                          ...current,
                          seriesSlug,
                          number: nextEpisodeNumber(seriesSlug),
                          slug: `${seriesSlug}-${String(nextEpisodeNumber(seriesSlug)).padStart(2, '0')}`,
                        }));
                        setEpisodeSlugWasEdited(false);
                      }}
                    >
                      {seriesList.map((item) => (
                        <MenuItem key={item.slug} value={item.slug}>{item.title}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField
                    fullWidth
                    required
                    type="number"
                    inputProps={{ min: 1 }}
                    label="Episode number"
                    value={episode.number}
                    onChange={updateEpisode('number')}
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField
                    fullWidth
                    required
                    label="Episode slug"
                    value={episode.slug}
                    onChange={updateEpisode('slug')}
                    helperText="Auto-built from story + number."
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField fullWidth required label="Episode title" value={episode.title} onChange={updateEpisode('title')} />
                </Grid>
                <Grid item xs={12}>
                  <TextField fullWidth required label="Episode excerpt" value={episode.excerpt} onChange={updateEpisode('excerpt')} inputProps={{ maxLength: 500 }} />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    required
                    multiline
                    minRows={12}
                    label="Episode body (Markdown)"
                    value={episode.content}
                    onChange={updateEpisode('content')}
                    helperText="Use ## headings, paragraphs, and lines beginning with - for lists."
                  />
                </Grid>
                <Grid item xs={12}>
                  <Stack direction="row" spacing={2}>
                    <Button type="submit" variant="contained" disabled={saving || !episode.seriesSlug}>
                      {saving ? 'Saving…' : 'Save episode'}
                    </Button>
                    <Button type="button" onClick={() => startNewEpisode(episode.seriesSlug)} disabled={saving}>Clear form</Button>
                  </Stack>
                </Grid>
              </Grid>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}
