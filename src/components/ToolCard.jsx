import { Link } from 'react-router-dom';
import {
  Avatar,
  Button,
  Card,
  CardContent,
  Chip,
  Rating,
  Stack,
  Typography,
} from '@mui/material';

export default function ToolCard({ tool }) {
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Avatar sx={{ bgcolor: 'primary.main', width: 42, height: 42 }}>{tool.name.slice(0, 1)}</Avatar>
            <Typography variant="h6" fontWeight={700}>{tool.name}</Typography>
          </Stack>
          <Chip label={tool.category} size="small" color="primary" variant="outlined" />
        </Stack>

        <Typography variant="body2" color="text.secondary" sx={{ minHeight: 60 }}>
          {tool.description}
        </Typography>

        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Chip label={tool.price} color="secondary" size="small" />
          <Stack direction="row" alignItems="center" spacing={0.5}>
            <Rating value={tool.rating} precision={0.1} readOnly size="small" />
            <Typography variant="body2" fontWeight={700}>{tool.rating}</Typography>
          </Stack>
        </Stack>

        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
          Best for: {tool.bestFor}
        </Typography>

        <Stack direction="row" spacing={1} sx={{ mt: 'auto' }}>
          <Button component={Link} to={`/tools/${tool.slug}`} variant="contained" size="small">
            Read Review
          </Button>
          <Button component={Link} to={`/compare/chatgpt-vs-gemini`} variant="outlined" size="small">
            Visit Tool
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}
