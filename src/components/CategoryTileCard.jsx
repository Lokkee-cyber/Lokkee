import { useState } from 'react';
import { Box, Chip, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { alpha } from '@mui/material/styles';
import { ArticleRounded } from '@mui/icons-material';

/**
 * Landscape tile card linking to a news/AI listing page (e.g. category shelves).
 * Image on top (16:9), label below the image.
 */
export default function CategoryTileCard({ title, description, image, to, chip }) {
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <Box
      component={Link}
      to={to}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 3,
        overflow: 'hidden',
        bgcolor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider',
        textDecoration: 'none',
        transition: 'transform 180ms ease, border-color 180ms ease, box-shadow 180ms ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          borderColor: 'primary.main',
          boxShadow: '0 14px 30px rgba(37,50,82,0.14)',
        },
        '&:focus-visible': {
          outline: '2px solid',
          outlineColor: 'primary.main',
          outlineOffset: 3,
        },
      }}
    >
      {image && !imageFailed ? (
        <Box
          component="img"
          src={image}
          alt={`${title} cover`}
          loading="lazy"
          onError={() => setImageFailed(true)}
          sx={{
            aspectRatio: '16 / 9',
            width: '100%',
            objectFit: 'cover',
            bgcolor: 'action.hover',
            flexShrink: 0,
          }}
        />
      ) : (
        <Box
          sx={{
            aspectRatio: '16 / 9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: (theme) => alpha(theme.palette.primary.main, 0.14),
            flexShrink: 0,
          }}
        >
          <ArticleRounded sx={{ fontSize: 42, color: 'primary.main' }} />
        </Box>
      )}

      <Box sx={{ p: 1.5, pt: 1.25, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
        {chip && (
          <Chip
            label={chip}
            size="small"
            sx={{
              alignSelf: 'flex-start',
              height: 22,
              fontSize: '0.68rem',
              fontWeight: 700,
              bgcolor: (theme) => alpha(theme.palette.primary.main, 0.2),
              color: 'rgba(199,167,255,0.95)',
              '& .MuiChip-label': { px: 0.75, overflowWrap: 'anywhere' },
            }}
          />
        )}

        <Typography
          sx={{
            fontWeight: 800,
            fontSize: { xs: '0.92rem', md: '1rem' },
            lineHeight: 1.35,
            color: 'text.primary',
            overflowWrap: 'anywhere',
          }}
          title={title}
        >
          {title}
        </Typography>

        {description && (
          <Typography
            sx={{
              fontSize: '0.78rem',
              lineHeight: 1.5,
              color: 'text.secondary',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              overflowWrap: 'anywhere',
            }}
          >
            {description}
          </Typography>
        )}
      </Box>
    </Box>
  );
}
