import { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { MenuBookRounded } from '@mui/icons-material';

/**
 * Large, borderless portrait novel card for the "New & Updated Novels" shelf.
 * Shows a badge in the top-right corner with either the number of new episodes
 * added or a "NEW" marker for newly released series.
 */
export default function NovelUpdateCard({ series, badge }) {
  const image = series.image || series.coverImage;
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <Box
      component={Link}
      to={`/fiction/${series.slug}`}
      sx={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        textDecoration: 'none',
        bgcolor: 'transparent',
        borderRadius: 3,
        overflow: 'visible',
        transition: 'transform 180ms ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          '& img': { opacity: 0.92 },
        },
        '&:focus-visible': {
          outline: '2px solid',
          outlineColor: 'fiction.accent',
          outlineOffset: 3,
        },
      }}
    >
      {badge && (
        <Box
          sx={{
            position: 'absolute',
            top: 10,
            right: 10,
            zIndex: 2,
            px: 1.1,
            py: 0.35,
            borderRadius: 99,
            bgcolor: '#7C5CFF',
            color: '#fff',
            fontSize: '0.68rem',
            fontWeight: 900,
            letterSpacing: '0.02em',
            boxShadow: '0 4px 14px rgba(124,92,255,0.45)',
            whiteSpace: 'nowrap',
          }}
        >
          {badge}
        </Box>
      )}

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
            transition: 'opacity 180ms ease',
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
          <MenuBookRounded sx={{ fontSize: 54, color: 'fiction.accent' }} />
        </Box>
      )}

      <Box sx={{ pt: 1.25, px: 0.25 }}>
        <Typography
          component="h3"
          sx={{
            fontWeight: 800,
            fontSize: { xs: '1rem', md: '1.1rem' },
            lineHeight: 1.3,
            color: '#FFFFFF',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
          title={series.title}
        >
          {series.title}
        </Typography>

        {series.genre && (
          <Typography
            variant="caption"
            sx={{
              display: 'block',
              mt: 0.25,
              fontSize: '0.72rem',
              fontWeight: 700,
              color: 'rgba(213,197,245,0.7)',
            }}
          >
            {series.genre}
          </Typography>
        )}
      </Box>
    </Box>
  );
}
