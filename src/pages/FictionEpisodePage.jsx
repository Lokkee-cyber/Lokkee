import { Box, Button, Chip, Container, Divider, Stack, Typography } from '@mui/material';
import { Link, useParams } from 'react-router-dom';
import SEO from '../components/SEO.jsx';
import { episodesForSeries, findEpisode, findSeries } from '../data/fiction.js';
import NotFoundPage from './NotFoundPage.jsx';

export default function FictionEpisodePage() {
  const { seriesSlug, episodeSlug } = useParams();
  const series = findSeries(seriesSlug);
  const episode = findEpisode(seriesSlug, episodeSlug);
  if (!series || !episode) return <NotFoundPage />;

  const episodes = episodesForSeries(seriesSlug);
  const index = episodes.findIndex((item) => item.slug === episode.slug);
  const content = episode.content || '';
  const isDemo = Boolean(series.demo) || Boolean(episode.demo);

  return (
    <>
      <SEO title={`${episode.title} | ${series.title} | LokkeeVerse`} description={episode.excerpt || series.synopsis} canonical={`/fiction/${seriesSlug}/${episodeSlug}`} type="article" />

      <Box sx={{ bgcolor: '#161223', minHeight: '100vh', color: '#EDEBF5' }}>
        <Container maxWidth="md" sx={{ py: { xs: 3, md: 6 } }}>
          <Button component={Link} to={`/fiction/${seriesSlug}`} sx={{ color: '#C7A7FF', fontWeight: 700, mb: 4 }}>
            ← Back to {series.title}
          </Button>

          <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
            <Typography sx={{ color: '#C7A7FF', fontWeight: 800, textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '0.08em' }}>
              Episode {episode.number}
            </Typography>
            {isDemo && (
              <Chip
                label="Demo"
                size="small"
                variant="outlined"
                sx={{ color: '#C7A7FF', borderColor: 'rgba(199,167,255,0.4)', fontSize: '0.65rem', fontWeight: 800, height: 20 }}
              />
            )}
          </Stack>

          <Typography variant="h1" sx={{ mt: 1, fontSize: { xs: '2rem', sm: '2.8rem' } }}>{episode.title}</Typography>
          <Typography variant="body2" sx={{ mt: 1, color: 'rgba(255,255,255,.6)' }}>
            {episode.wordCount || content.trim().split(/\s+/).filter(Boolean).length} words
          </Typography>

          <Box
            sx={{
              fontFamily: 'Georgia, "Times New Roman", serif',
              fontSize: { xs: '1.08rem', md: '1.2rem' },
              lineHeight: 1.9,
              mt: 5,
              whiteSpace: 'pre-wrap',
              color: '#E8E5F0',
              '& p': { mb: 2 },
            }}
          >
            {content}
          </Box>

          <Divider sx={{ my: 6, borderColor: 'rgba(199,167,255,0.2)' }} />

          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            spacing={2}
            flexWrap="wrap"
            useFlexGap
          >
            {episodes[index - 1] ? (
              <Button
                component={Link}
                to={`/fiction/${seriesSlug}/${episodes[index - 1].slug}`}
                variant="outlined"
                sx={{ color: '#C7A7FF', borderColor: 'rgba(199,167,255,0.4)' }}
              >
                ← Previous
              </Button>
            ) : <span />}

            {episodes[index + 1] ? (
              <Button
                component={Link}
                to={`/fiction/${seriesSlug}/${episodes[index + 1].slug}`}
                variant="contained"
                sx={{ bgcolor: '#7C5CFF', '&:hover': { bgcolor: '#9477FF' }, fontWeight: 800 }}
              >
                Next →
              </Button>
            ) : (
              <Button
                component={Link}
                to={`/fiction/${seriesSlug}`}
                variant="outlined"
                sx={{ color: '#C7A7FF', borderColor: 'rgba(199,167,255,0.4)' }}
              >
                All episodes
              </Button>
            )}
          </Stack>
        </Container>
      </Box>
    </>
  );
}
