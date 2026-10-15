import { Link } from 'react-router-dom';
import { Button, Card, CardContent, Chip, Stack, Typography } from '@mui/material';
import ToolLogo from './ToolLogo.jsx';

export default function ToolCard({ tool }) {
  return (
    <Card sx={{ height: '100%', minWidth: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden', borderRadius: 3, transition: 'transform 180ms ease, box-shadow 180ms ease', '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 18px 38px rgba(37, 50, 82, 0.14)' } }}>
      <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1, minWidth: 0, p: { xs: 2, sm: 2.5 }, '&:last-child': { pb: { xs: 2, sm: 2.5 } } }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1.5} sx={{ minWidth: 0 }}>
          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ minWidth: 0 }}>
            <ToolLogo tool={tool} />
            <Typography variant="h6" fontWeight={800} sx={{ minWidth: 0, overflowWrap: 'anywhere' }}>{tool.name}</Typography>
          </Stack>
          <Chip label={tool.category} size="small" color="primary" variant="outlined" sx={{ maxWidth: '44%', '& .MuiChip-label': { overflowWrap: 'anywhere' } }} />
        </Stack>
        <Typography variant="body2" color="text.secondary" sx={{ minHeight: '4.8em', lineHeight: 1.6, display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 3, overflow: 'hidden', overflowWrap: 'anywhere' }}>
          {tool.description}
        </Typography>
        <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
          <Chip label={tool.price} color="secondary" size="small" />
          <Typography variant="caption" color="text.secondary">Overview guide</Typography>
        </Stack>
        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, minHeight: '2.8em', lineHeight: 1.4, display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 2, overflow: 'hidden', overflowWrap: 'anywhere' }}>
          Best for: {tool.bestFor}
        </Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ mt: 'auto', minWidth: 0 }}>
          <Button component={Link} to={`/tools/${tool.slug}`} variant="contained" size="small" disableElevation sx={{ flex: 1, minWidth: 0, whiteSpace: 'normal' }}>
            Read overview
          </Button>
          {tool.website && <Button component="a" href={tool.website} target="_blank" rel="noopener noreferrer" variant="outlined" size="small" sx={{ minWidth: 0, whiteSpace: 'normal' }}>Official site</Button>}
        </Stack>
      </CardContent>
    </Card>
  );
}