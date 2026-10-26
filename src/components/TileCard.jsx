import { useState } from 'react';
import { Box, Chip, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { alpha } from '@mui/material/styles';
import { ArticleRounded } from '@mui/icons-material';

/**
 * Landscape tile card used for news and AI article shelves.
 * Cover image on top (16:9), title below the image.
 */
export default function TileCard({ article }) {
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <Box
      component={Link}
      to={`/articles/${article.slug}`}
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
      {article.image && !imageFailed ? (
        <Box
          component="img"
          src={article.image}
          alt={article.title ? `Cover of ${article.title}` : 'Article cover'}
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
            background: 'linear-gradient(145deg, rgba(91,76,245,0.18), rgba(20,20,25,0.9))',
            flexShrink: 0,
          }}
        >
          <ArticleRounded sx={{ fontSize: 40, color: 'primary.light' }} />
        </Box>
      )}

      <Box sx={{ p: 1.5, pt: 1.25, display: 'flex', flexDirection: 'column', gap: 0.5, flexGrow: 1 }}>
        <Chip
          label={article.category}
          size="small"
          sx={{
            alignSelf: 'flex-start',
            maxWidth: '100%',
            height: 22,
            fontSize: '0.68rem',
            fontWeight: 700,
            bgcolor: (theme) => alpha(theme.palette.primary.main, 0.2),
            color: 'rgba(199,167,255,0.95)',
            '& .MuiChip-label': { px: 0.75, overflowWrap: 'anywhere' },
          }}
        />

        <Typography
          sx={{
            fontWeight: 800,
            fontSize: { xs: '0.92rem', md: '1rem' },
            lineHeight: 1.4,
            color: 'text.primary',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            overflowWrap: 'anywhere',
          }}
          title={article.title}
        >
          {article.title}
        </Typography>

        {article.date && (
          <Typography
            sx={{
              mt: 'auto',
              pt: 0.5,
              fontSize: '0.72rem',
              color: 'text.secondary',
              overflowWrap: 'anywhere',
            }}
          >
            {article.date}
          </Typography>
        )}
      </Box>
    </Box>
  );
}
