import {
  Box,
  Button,
  Chip,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material';

export default function ToolReview({ tool }) {
  return (
    <Box sx={{ width: '100%' }}>
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={{ xs: 2, md: 3 }}
        alignItems={{ xs: 'flex-start', md: 'center' }}
      >
        <Box
          sx={{
            width: { xs: 72, sm: 90 },
            height: { xs: 72, sm: 90 },
            borderRadius: 4,
            background: 'linear-gradient(135deg, #5b4cf5 0%, #13b8a6 100%)',
            display: 'grid',
            placeItems: 'center',
            color: '#fff',
            fontSize: { xs: 24, md: 28 },
            fontWeight: 800,
            flexShrink: 0,
          }}
          aria-hidden="true"
        >
          {tool.name.slice(0, 1)}
        </Box>
        <Box sx={{ width: '100%' }}>
          <Typography variant="overline" color="primary.main" fontWeight={700}>{tool.category}</Typography>
          <Typography variant="h1" fontWeight={800} sx={{ fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }, lineHeight: 1.1 }}>
            {tool.name}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1, fontSize: { xs: '0.96rem', md: '1rem' } }}>
            {tool.description}
          </Typography>
          <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap" sx={{ mt: 2 }}>
            <Chip label={tool.price} color="secondary" size="small" />
            <Typography variant="caption" color="text.secondary">Editorial overview · last reviewed {tool.lastReviewed || 'when available'}</Typography>
          </Stack>
        </Box>
      </Stack>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ my: { xs: 2, md: 3 }, width: '100%' }}>
        {tool.website && (
          <Button component="a" href={tool.website} target="_blank" rel="noopener noreferrer" variant="contained" fullWidth sx={{ width: { xs: '100%', sm: 'auto' } }}>
            Visit official site
          </Button>
        )}
        <Button component="a" href="/comparisons" variant="outlined" fullWidth sx={{ width: { xs: '100%', sm: 'auto' } }}>
          See comparisons
        </Button>
      </Stack>

      <Grid container spacing={{ xs: 2, md: 3 }}>
        <Grid item xs={12} md={6}>
          <Typography variant="h5" fontWeight={700} sx={{ fontSize: { xs: '1.35rem', md: '1.5rem' } }}>Overview</Typography>
          <Typography color="text.secondary" sx={{ mt: 1 }}>{tool.overview}</Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h5" fontWeight={700} sx={{ fontSize: { xs: '1.35rem', md: '1.5rem' } }}>Pricing</Typography>
          <List sx={{ '& .MuiListItemText-primary, & .MuiListItemText-secondary': { whiteSpace: 'normal', wordBreak: 'break-word' } }}>
            {tool.pricing.map((item) => (
              <ListItem key={item.label} disablePadding>
                <ListItemText primary={item.label} secondary={item.value} />
              </ListItem>
            ))}
          </List>
        </Grid>
      </Grid>

      <Divider sx={{ my: 3 }} />

      <Grid container spacing={{ xs: 2, md: 3 }}>
        <Grid item xs={12} md={4}>
          <Typography variant="h6" fontWeight={700} sx={{ fontSize: { xs: '1.1rem', md: '1.25rem' } }}>Features</Typography>
          <List sx={{ '& .MuiListItemText-primary': { whiteSpace: 'normal', wordBreak: 'break-word' } }}>
            {tool.features.map((feature) => <ListItem key={feature} disablePadding><ListItemText primary={feature} /></ListItem>)}
          </List>
        </Grid>
        <Grid item xs={12} md={4}>
          <Typography variant="h6" fontWeight={700} sx={{ fontSize: { xs: '1.1rem', md: '1.25rem' } }}>Pros</Typography>
          <List sx={{ '& .MuiListItemText-primary': { whiteSpace: 'normal', wordBreak: 'break-word' } }}>
            {tool.pros.map((item) => <ListItem key={item} disablePadding><ListItemText primary={item} /></ListItem>)}
          </List>
        </Grid>
        <Grid item xs={12} md={4}>
          <Typography variant="h6" fontWeight={700} sx={{ fontSize: { xs: '1.1rem', md: '1.25rem' } }}>Cons</Typography>
          <List sx={{ '& .MuiListItemText-primary': { whiteSpace: 'normal', wordBreak: 'break-word' } }}>
            {tool.cons.map((item) => <ListItem key={item} disablePadding><ListItemText primary={item} /></ListItem>)}
          </List>
        </Grid>
      </Grid>

      <Divider sx={{ my: 3 }} />

      <Typography variant="h5" fontWeight={700} sx={{ fontSize: { xs: '1.35rem', md: '1.5rem' } }}>Who it’s best for</Typography>
      <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mt: 2, '& .MuiChip-root': { mb: 1 } }}>
        {tool.whoFor.map((item) => <Chip key={item} label={item} />)}
      </Stack>

      <Typography variant="h5" fontWeight={700} sx={{ mt: { xs: 3, md: 4 }, fontSize: { xs: '1.35rem', md: '1.5rem' } }}>Our verdict</Typography>
      <Typography color="text.secondary" sx={{ mt: 1 }}>{tool.verdict}</Typography>
    </Box>
  );
}
