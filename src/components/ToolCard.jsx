import { Link } from 'react-router-dom';
import {
  Avatar,
  Button,
  Card,
  CardContent,
  Chip,
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
          <Typography variant="caption" color="text.secondary">Overview guide</Typography>
        </Stack>

        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
          Best for: {tool.bestFor}
        </Typography>

        <Stack direction="row" spacing={1} sx={{ mt: 'auto' }}>
          <Button component={Link} to={`/tools/${tool.slug}`} variant="contained" size="small">
            Read overview
          </Button>
          {tool.website && (
            <Button component="a" href={tool.website} target="_blank" rel="noopener noreferrer" variant="outlined" size="small">
              Official site
            </Button>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}
