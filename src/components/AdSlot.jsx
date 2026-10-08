import { Box, Typography } from '@mui/material';

export default function AdSlot({ label = 'Ad placeholder', height = 220 }) {
  return (
    <Box
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
        {label}
      </Typography>
    </Box>
  );
}
