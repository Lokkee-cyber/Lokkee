import { Box, Button, Chip, Container, Divider, Stack, Typography } from '@mui/material';
import { Link, useParams } from 'react-router-dom';
import SEO from '../components/SEO.jsx';
import { episodesForSeries, findSeries } from '../data/fiction.js';
import NotFoundPage from './NotFoundPage.jsx';

export default function FictionSeriesPage() {
  const { seriesSlug } = useParams();
  const series = findSeries(seriesSlug);
  if (!series) return <NotFoundPage />;
  const episodes = episodesForSeries(seriesSlug);
  const isDemo = Boolean(series.demo);

  return (
    <>
      <SEO title={`${series.title} | LokkeeVerse Fiction`} description={series.synopsis} canonical={`/fiction/${series.slug}`} image={series.image} type="article" />

      <Box sx={{ bgcolor: '#161223', color: '#fff', py: { xs: 4, md: 7 }, borderBottom: '1px solid rgba(199,167,255,0.14)' }}>
        <Container maxWidth="md">
          <Button component={Link} to="/fiction" sx={{ mb: 3, color: '#C7A7FF', fontWeight: 700 }}>
            ← All stories
          </Button>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={4}>
            <Box
              component="img"
              src={series.image}
              alt={`${series.title} cover`}
              sx={{
                width: { xs: '100%', sm: 220 },
                maxWidth: 280,
                aspectRatio: '2 / 3',
                objectFit: 'cover',
                borderRadius: 3,
                alignSelf: { xs: 'center', sm: 'flex-start' },
                border: '1px solid rgba(199,167,255,0.2)',
              }}
            />
            <Box sx={{ minWidth: 0 }}>
              <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
                <Typography sx={{ color: '#C7A7FF', fontWeight: 800, textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '0.08em' }}>
                  {series.genre || 'Serial fiction'}
                </Typography>
                {isDemo && (
                  <Chip
                    label="Demo"
                    size="small"
                    sx={{ color: '#C7A7FF', borderColor: 'rgba(199,167,255,0.4)', fontSize: '0.65rem', fontWeight: 800, height: 20 }}
                    variant="outlined"
                  />
                )}
              </Stack>
              <Typography variant="h1" sx={{ mt: 1, fontSize: { xs: '2.2rem', sm: '3rem' } }}>{series.title}</Typography>
              <Typography sx={{ mt: 2, color: 'rgba(255,255,255,.75)', lineHeight: 1.75 }}>{series.synopsis}</Typography>
              {series.author && (
                <Typography variant="body2" sx={{ mt: 2, color: 'rgba(255,255,255,.6)' }}>
                  By {series.author}
                  {episodes.length ? ` · ${episodes.length} episode${episodes.length === 1 ? '' : 's'}` : ''}
                </Typography>
              )}
              {episodes.length > 0 && (
                <Button
                  component={Link}
                  to={`/fiction/${series.slug}/${episodes[0].slug}`}
                  variant="contained"
                  sx={{ mt: 3, bgcolor: '#7C5CFF', '&:hover': { bgcolor: '#9477FF' }, fontWeight: 800 }}
                >
                  Start reading
                </Button>
              )}
            </Box>
          </Stack>
        </Container>
      </Box>

      <Container maxWidth="md" sx={{ py: 5 }}>
        <Typography variant="h4" fontWeight={800} color="text.primary">Episodes</Typography>
        {episodes.length ? (
          <Stack divider={<Divider flexItem />} sx={{ mt: 2 }}>
            {episodes.map((episode) => (
              <Stack key={episode.slug} direction="row" justifyContent="space-between" alignItems="center" spacing={2} sx={{ py: 2.5, flexWrap: { xs: 'wrap', sm: 'nowrap' } }}>
                <Box sx={{ minWidth: 0, flexGrow: 1 }}>
                  <Typography fontWeight={800} sx={{ overflowWrap: 'anywhere' }}>Episode {episode.number}: {episode.title}</Typography>
                  {episode.excerpt && (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>{episode.excerpt}</Typography>
                  )}
                </Box>
                <Button
                  component={Link}
                  to={`/fiction/${series.slug}/${episode.slug}`}
                  variant="outlined"
                  sx={{ color: '#C7A7FF', borderColor: 'rgba(199,167,255,0.4)', flexShrink: 0 }}
                >
                  Read
                </Button>
              </Stack>
            ))}
          </Stack>
        ) : (
          <Typography color="text.secondary" sx={{ mt: 2 }}>Episodes will be published here soon.</Typography>
        )}
      </Container>
    </>
  );
}
