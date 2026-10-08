import { Box, Typography } from '@mui/material';
import { siteConfig } from '../config/siteConfig';

export default function AdSlot({
  label = 'Advertisement',
  height = 220,
  placement = 'content',
}) {
  if (!siteConfig.adsEnabled || !siteConfig.adsenseClient) return null;

  return (
    <Box
      component="aside"
      aria-label={`${label} advertisement`}
      sx={{
        minHeight: height,
        border: '1px dashed',
        borderColor: 'divider',
        borderRadius: 3,
        backgroundColor: 'rgba(148, 163, 184, 0.05)',
        display: 'grid',
        placeItems: 'center',
        textAlign: 'center',
        p: 2,
        color: 'text.secondary',
      }}
    >
      <Typography variant="caption" sx={{ textTransform: 'uppercase', letterSpacing: 1.5, fontWeight: 700 }}>
        {label} · {placement}
      </Typography>
    </Box>
  );
}
