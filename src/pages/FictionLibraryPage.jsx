import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Box, Button, Chip, Container, Stack, Typography } from '@mui/material';
import SEO from '../components/SEO.jsx';
import FictionCard from '../components/FictionCard.jsx';
import { fictionSeries } from '../data/fiction.js';
import { fictionGenres, genreLabelForSlug } from '../data/fictionGenres.js';

export default function FictionLibraryPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeGenre = searchParams.get('genre') || '';

  const filteredSeries = useMemo(() => {
    if (!activeGenre) return fictionSeries;
    const label = genreLabelForSlug(activeGenre);
    return fictionSeries.filter((series) => {
      const genres = [series.genre, ...(series.genres || [])].filter(Boolean);
      return genres.some((value) => value.toLowerCase() === label.toLowerCase());
    });
  }, [activeGenre]);

  const setGenre = (slug) => {
    if (slug) {
      setSearchParams({ genre: slug });
    } else {
      setSearchParams({});
    }
  };

  return (
    <>
      <SEO
        title={activeGenre ? `${genreLabelForSlug(activeGenre)} Fiction | LokkeeVerse` : 'Serial Fiction & Novels | LokkeeVerse'}
        description="Read original serial fiction on LokkeeVerse."
        canonical={activeGenre ? `/fiction?genre=${activeGenre}` : '/fiction'}
      />

      <Container maxWidth="xl" sx={{ py: { xs: 4, md: 6 } }}>
        <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', rowGap: 1, mb: 4 }} useFlexGap>
          <Chip
            label="All genres"
            clickable
            color={!activeGenre ? 'primary' : 'default'}
            variant={!activeGenre ? 'filled' : 'outlined'}
            onClick={() => setGenre('')}
            aria-pressed={!activeGenre}
            sx={{ fontWeight: 700 }}
          />
          {fictionGenres.map((genre) => (
            <Chip
              key={genre.slug}
              label={genre.label}
              clickable
              color={activeGenre === genre.slug ? 'primary' : 'default'}
              variant={activeGenre === genre.slug ? 'filled' : 'outlined'}
              onClick={() => setGenre(activeGenre === genre.slug ? '' : genre.slug)}
              aria-pressed={activeGenre === genre.slug}
              sx={{ fontWeight: 700 }}
            />
          ))}
        </Stack>

        {filteredSeries.length ? (
          <>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {filteredSeries.length} {filteredSeries.length === 1 ? 'series' : 'series'}
              {activeGenre ? ` in ${genreLabelForSlug(activeGenre)}` : ''}
            </Typography>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: 'repeat(2, minmax(0, 1fr))', sm: 'repeat(3, minmax(0, 1fr))', md: 'repeat(4, minmax(0, 1fr))', lg: 'repeat(5, minmax(0, 1fr))' },
                gap: 2.5,
              }}
            >
              {filteredSeries.map((series) => (
                <FictionCard key={series.slug} series={series} />
              ))}
            </Box>
          </>
        ) : (
          <Stack
            alignItems="flex-start"
            sx={{ p: 4, bgcolor: 'background.paper', borderRadius: 3, border: '1px solid', borderColor: 'divider' }}
          >
            <Typography variant="h5" fontWeight={800} color="text.primary">
              No {activeGenre ? genreLabelForSlug(activeGenre) : ''} series published yet.
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 1 }}>
              {activeGenre
                ? 'Try another genre — new stories are added as episodes are finished.'
                : 'Published series will appear here as soon as they are ready.'}
            </Typography>
            {activeGenre && (
              <Button onClick={() => setGenre('')} sx={{ mt: 2, fontWeight: 700 }}>
                View all genres
              </Button>
            )}
          </Stack>
        )}
    </Container>
    </>
  );
}
