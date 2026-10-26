import { useState } from 'react';
import { Box, Card, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { MenuBookRounded } from '@mui/icons-material';
import { episodesForSeries } from '../data/fiction.js';

/**
 * Portrait novel card for fiction shelves and the fiction library grid.
 * Cover art on top (2:3), title and episode count below the image.
 */
export default function FictionCard({ series }) {
  const image = series.image || series.coverImage;
  const [imageFailed, setImageFailed] = useState(false);
  const episodeCount = episodesForSeries(series.slug).length;

  return (
    <Card
      component={Link}
      to={`/fiction/${series.slug}`}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        textDecoration: 'none',
        bgcolor: 'fiction.card',
        color: '#FFFFFF',
        borderRadius: 3,
        overflow: 'hidden',
        border: '1px solid rgba(199,167,255,0.14)',
        transition: 'transform 180ms ease, border-color 180ms ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          borderColor: 'fiction.accent',
        },
        '&:focus-visible': {
          outline: '2px solid',
          outlineColor: 'fiction.accent',
          outlineOffset: 3,
        },
      }}
    >
      {image && !imageFailed ? (
        <Box
          component="img"
          src={image}
          alt={series.title ? `Cover of ${series.title}` : 'Novel cover'}
          loading="lazy"
          onError={() => setImageFailed(true)}
          sx={{
            aspectRatio: '2 / 3',
            width: '100%',
            objectFit: 'cover',
            bgcolor: '#302A40',
          }}
        />
      ) : (
        <Box
          sx={{
            aspectRatio: '2 / 3',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(145deg, #34264D, #171622 80%)',
          }}
        >
          <MenuBookRounded sx={{ fontSize: 48, color: 'fiction.accent' }} />
        </Box>
      )}

      <Box sx={{ p: 1.25, pt: 1.5 }}>
        <Typography
          component="h3"
          sx={{
            fontWeight: 800,
            fontSize: { xs: '0.92rem', md: '1rem' },
            lineHeight: 1.35,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
          title={series.title}
        >
          {series.title}
        </Typography>

        {episodeCount > 0 && (
          <Typography
            variant="caption"
            sx={{
              display: 'block',
              mt: 0.5,
              fontSize: '0.72rem',
              fontWeight: 700,
              color: 'rgba(213,197,245,0.75)',
            }}
          >
            {episodeCount} episode{episodeCount === 1 ? '' : 's'}
          </Typography>
        )}
      </Box>
    </Card>
  );
}
