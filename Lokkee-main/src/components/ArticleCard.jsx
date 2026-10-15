import { Link } from 'react-router-dom';
import {
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Stack,
  Typography,
} from '@mui/material';

export default function ArticleCard({ article }) {
  return (
    <Card sx={{ height: '100%', minWidth: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <CardMedia component="img" height="190" image={article.image} alt={article.title} sx={{ objectFit: 'cover', width: '100%' }} />
      <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, flex: 1, minWidth: 0, p: { xs: 2, sm: 3 }, '&:last-child': { pb: { xs: 2, sm: 3 } } }}>
        <Chip label={article.category} color="primary" size="small" sx={{ alignSelf: 'flex-start', maxWidth: '100%' }} />
        <Typography variant="h6" fontWeight={700} sx={{ overflowWrap: 'anywhere' }}>{article.title}</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ overflowWrap: 'anywhere' }}>{article.excerpt}</Typography>
        <Stack direction="row" justifyContent="space-between" flexWrap="wrap" columnGap={1} rowGap={0.5} color="text.secondary" sx={{ fontSize: 12, minWidth: 0, '& > *': { overflowWrap: 'anywhere' } }}>
          <span>{article.author}</span>
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
