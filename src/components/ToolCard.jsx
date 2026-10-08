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
    <Card sx={{ height: '100%', minWidth: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1, minWidth: 0, p: { xs: 2, sm: 3 }, '&:last-child': { pb: { xs: 2, sm: 3 } } }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={{ xs: 1, sm: 0 }} sx={{ minWidth: 0 }}>
          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ minWidth: 0, maxWidth: '100%' }}>
            <Avatar sx={{ bgcolor: 'primary.main', width: 42, height: 42, flexShrink: 0 }}>{tool.name.slice(0, 1)}</Avatar>
            <Typography variant="h6" fontWeight={700} sx={{ minWidth: 0, overflowWrap: 'anywhere' }}>{tool.name}</Typography>
          </Stack>
          <Chip label={tool.category} size="small" color="primary" variant="outlined" sx={{ maxWidth: '100%', '& .MuiChip-label': { overflowWrap: 'anywhere' } }} />
        </Stack>

        <Typography variant="body2" color="text.secondary" sx={{ minHeight: { sm: 60 }, overflowWrap: 'anywhere' }}>
          {tool.description}
        </Typography>

        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Chip label={tool.price} color="secondary" size="small" />
          <Typography variant="caption" color="text.secondary">Overview guide</Typography>
        </Stack>

        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, overflowWrap: 'anywhere' }}>
          Best for: {tool.bestFor}
        </Typography>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ mt: 'auto', minWidth: 0 }}>
          <Button component={Link} to={`/tools/${tool.slug}`} variant="contained" size="small" sx={{ minWidth: 0, whiteSpace: 'normal' }}>
            Read overview
          </Button>
          {tool.website && (
            <Button component="a" href={tool.website} target="_blank" rel="noopener noreferrer" variant="outlined" size="small" sx={{ minWidth: 0, whiteSpace: 'normal' }}>
              Official site
            </Button>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}
