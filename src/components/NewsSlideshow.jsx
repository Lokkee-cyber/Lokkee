import { useCallback, useEffect, useRef, useState } from 'react';
import { Box, Chip, Stack, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { alpha } from '@mui/material/styles';

const AUTOPLAY_MS = 15000;

function NewsSlide({ article }) {
  return (
    <Box
      sx={{
        position: 'relative',
        height: { xs: 450, sm: 380, md: 440 },
        borderRadius: { xs: 3, md: 4 },
        overflow: 'hidden',
        border: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
      }}
    >
      {article.image && (
        <Box
          component="img"
          src={article.image}
          alt={article.title}
          sx={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      )}

      {/* Legibility scrim */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(10,10,13,0) 30%, rgba(10,10,13,0.55) 62%, rgba(10,10,13,0.92) 100%)',
        }}
      />

      <Box
        sx={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          p: { xs: 2, sm: 3, md: 4 },
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
        }}
      >
        <Chip
          label={article.category}
          size="small"
          sx={{
            alignSelf: 'flex-start',
            fontWeight: 800,
            fontSize: '0.7rem',
            bgcolor: alpha('#5b4cf5', 0.85),
            color: '#fff',
            maxWidth: '100%',
          }}
        />
        <Typography
          component="h3"
          sx={{
            color: '#fff',
            fontWeight: 900,
            fontSize: { xs: '1.15rem', sm: '1.5rem', md: '1.9rem' },
            lineHeight: 1.25,
            letterSpacing: '-0.02em',
            textShadow: '0 2px 12px rgba(0,0,0,0.5)',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {article.title}
        </Typography>
        {article.excerpt && (
          <Typography
            sx={{
              color: 'rgba(255,255,255,0.82)',
              fontSize: { xs: '0.85rem', md: '0.95rem' },
              lineHeight: 1.55,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {article.excerpt}
          </Typography>
        )}
        <Stack direction="row" spacing={2} alignItems="center" sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.78rem' }}>
          {article.date && <span>{article.date}</span>}
          {article.readTime && <span>{article.readTime}</span>}
        </Stack>
      </Box>
    </Box>
  );
}

export default function NewsSlideshow({ articles }) {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const touchStartX = useRef(null);
  const count = articles.length;

  const go = useCallback(
    (next) => {
      if (!count) return;
      setIndex(((next % count) + count) % count);
    },
    [count],
  );

  useEffect(() => {
    if (!playing || count < 2) return undefined;
    const timer = setInterval(() => setIndex((i) => (i + 1) % count), AUTOPLAY_MS);
    return () => clearInterval(timer);
  }, [playing, count]);

  if (!count) {
    return (
      <Box
        component="section"
        aria-label="News Feed"
        sx={{
          mb: { xs: 4, md: 6 },
          p: 4,
          border: '1px dashed',
          borderColor: 'divider',
          borderRadius: 3,
        }}
      >
        <Typography fontWeight={700}>No published news stories yet.</Typography>
      </Box>
    );
  }

  return (
    <Box
      component="section"
      aria-label="News Feed"
      sx={{ mb: { xs: 4, md: 6 }, position: 'relative' }}
      onMouseEnter={() => setPlaying(false)}
      onMouseLeave={() => setPlaying(true)}
      onTouchStart={(e) => {
        touchStartX.current = e.touches[0].clientX;
      }}
      onTouchEnd={(e) => {
        if (touchStartX.current == null) return;
        const dx = e.changedTouches[0].clientX - touchStartX.current;
        if (Math.abs(dx) > 48) go(index + (dx < 0 ? 1 : -1));
        touchStartX.current = null;
      }}
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        spacing={1.5}
        sx={{ mb: 2 }}
      >
        <Typography
          component="h2"
          sx={{
            fontWeight: 900,
            letterSpacing: '-0.03em',
            fontSize: { xs: '1.45rem', sm: '1.8rem', md: '2.1rem' },
            color: 'text.primary',
          }}
        >
          News Feed
        </Typography>
      </Stack>

      <Box
        sx={{
          display: 'flex',
          transition: 'transform 500ms cubic-bezier(0.22, 1, 0.36, 1)',
          transform: `translateX(-${index * 100}%)`,
        }}
      >
        {articles.map((article, i) => (
          <Box
            key={article.slug}
            aria-hidden={i !== index}
            sx={{
              flex: '0 0 100%',
              minWidth: 0,
              px: { xs: 0, md: 0.25 },
              ...(i !== index && { visibility: 'hidden' }),
            }}
          >
            <Link
              to={`/articles/${article.slug}`}
              style={{ textDecoration: 'none', display: 'block' }}
              tabIndex={i === index ? 0 : -1}
              aria-label={`Read: ${article.title}`}
            >
              <NewsSlide article={article} />
            </Link>
          </Box>
        ))}
      </Box>

      {/* Dots centered under the slideshow */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          mt: 1.5,
          width: '100%',
          gap: 0.75,
        }}
      >
        {articles.map((article, i) => (
          <Box
            key={article.slug}
            component="button"
            aria-label={`Go to story ${i + 1}: ${article.title}`}
            onClick={() => go(i)}
            sx={{
              width: i === index ? 26 : 8,
              height: 8,
              borderRadius: 99,
              border: 'none',
              cursor: 'pointer',
              bgcolor: i === index ? 'primary.main' : alpha('#ffffff', 0.22),
              transition: 'width 250ms ease, background-color 250ms ease',
              p: 0,
            }}
          />
        ))}
      </Box>
    </Box>
  );
}
