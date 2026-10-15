import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Button,
  Box,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Stack,
  Typography,
} from '@mui/material';

export default function ArticleCard({ article }) {
  const [imageFailed, setImageFailed] = useState(false);
  const image = imageFailed ? '' : article.image;

  return (
    <Card sx={{ height: '100%', minWidth: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {image ? (
        <CardMedia component="img" image={image} alt="" loading="lazy" referrerPolicy="no-referrer" onError={() => setImageFailed(true)} sx={{ objectFit: 'cover', width: '100%', height: { xs: 170, sm: 190 }, flexShrink: 0 }} />
      ) : (
        <Box aria-hidden="true" sx={{ height: { xs: 150, sm: 180 }, display: 'grid', placeItems: 'center', color: 'rgba(255,255,255,0.94)', background: 'linear-gradient(135deg, #27236f 0%, #5b4cf5 58%, #159d96 100%)' }}>
          <Typography variant="overline" fontWeight={800} letterSpacing="0.14em">LokkeeVerse</Typography>
        </Box>
      )}
      <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, flex: 1, minWidth: 0, p: { xs: 2, sm: 3 }, '&:last-child': { pb: { xs: 2, sm: 3 } } }}>
        <Chip label={article.category} color="primary" size="small" sx={{ alignSelf: 'flex-start', maxWidth: '100%' }} />
        <Typography variant="h6" fontWeight={700} sx={{ fontSize: { xs: '1.05rem', sm: '1.25rem' }, lineHeight: 1.35, overflowWrap: 'anywhere' }}>{article.title}</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>{article.excerpt}</Typography>
        <Stack direction="row" justifyContent="space-between" flexWrap="wrap" columnGap={1} rowGap={0.5} color="text.secondary" sx={{ fontSize: 12, minWidth: 0, '& > *': { overflowWrap: 'anywhere' } }}>
          <span>{article.automation?.generated && article.sourceReferences?.[0]?.publisher
            ? `Source: ${article.sourceReferences[0].publisher}`
            : article.author}</span>
          <span>{article.date}</span>
          <span>{article.readTime}</span>
        </Stack>
        <Button component={Link} to={`/articles/${article.slug}`} variant="contained" sx={{ mt: 'auto', whiteSpace: 'normal' }}>
          Read article
        </Button>
      </CardContent>
    </Card>
  );
}
