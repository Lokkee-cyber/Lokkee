import { Link } from 'react-router-dom';
import { Button, Card, CardContent, CardMedia, Chip, Stack, Typography } from '@mui/material';


export default function ArticleCard({ article }) {
  return (
    <Card
      sx={{
        height: '100%',
        minWidth: 0,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        borderRadius: 3,
        transition: 'transform 180ms ease, box-shadow 180ms ease',
        '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 18px 38px rgba(37, 50, 82, 0.14)' },
      }}
    >
      <CardMedia component="img" image={article.image} alt={article.title} sx={{ width: '100%', aspectRatio: '16 / 9', objectFit: 'cover', flex: '0 0 auto' }} />
      <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, flex: 1, minWidth: 0, p: { xs: 2, sm: 2.5 }, '&:last-child': { pb: { xs: 2, sm: 2.5 } } }}>
        <Chip label={article.category} color="primary" size="small" sx={{ alignSelf: 'flex-start', maxWidth: '100%' }} />
        <Typography
          variant="h6"
          fontWeight={800}
          sx={{ lineHeight: 1.35, minHeight: '2.7em', display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 2, overflow: 'hidden', overflowWrap: 'anywhere' }}
        >
          {article.title}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ lineHeight: 1.6, minHeight: '4.8em', display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 3, overflow: 'hidden', overflowWrap: 'anywhere' }}
        >
          {article.excerpt}
        </Typography>
        <Stack direction="row" justifyContent="space-between" flexWrap="wrap" columnGap={1} rowGap={0.5} color="text.secondary" sx={{ mt: 'auto', fontSize: 12, minWidth: 0, '& > *': { overflowWrap: 'anywhere' } }}>
          <span>{article.date || article.publishedAt?.slice(0, 10)} </span>
          <span> ({article.readTime})</span>
        </Stack>
        <Button component={Link} to={`/articles/${article.slug}`} variant="contained" disableElevation sx={{ mt: 0.5, whiteSpace: 'normal', justifyContent: 'center' }}>
          View
        </Button>
      </CardContent>
    </Card>
  );
}