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
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardMedia component="img" height="190" image={article.image} alt={article.title} sx={{ objectFit: 'cover' }} />
      <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, flex: 1 }}>
        <Chip label={article.category} color="primary" size="small" sx={{ alignSelf: 'flex-start' }} />
        <Typography variant="h6" fontWeight={700}>{article.title}</Typography>
        <Typography variant="body2" color="text.secondary">{article.excerpt}</Typography>
        <Stack direction="row" justifyContent="space-between" flexWrap="wrap" color="text.secondary" sx={{ fontSize: 12 }}>
          <span>{article.author}</span>
          <span>{article.date}</span>
          <span>{article.readTime}</span>
        </Stack>
        <Button component={Link} to={`/articles/${article.slug}`} variant="contained" sx={{ mt: 'auto' }}>
          Read article
        </Button>
      </CardContent>
    </Card>
  );
}
