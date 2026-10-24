import { Link } from 'react-router-dom';
import { Button, Paper, Stack, Typography } from '@mui/material';
import { setConsent, useConsent } from '../utils/consent';

export default function CookieConsent() {
  const { showBanner } = useConsent();

  if (!showBanner) return null;

  return (
    <Paper
      role="dialog"
      aria-label="Cookie consent"
      elevation={8}
      sx={{ position: 'fixed', left: { xs: 8, sm: 24 }, right: { xs: 8, sm: 24 }, bottom: { xs: 8, sm: 24 }, zIndex: 1400, p: 2.5, maxWidth: 720, mx: 'auto', borderRadius: 3 }}
    >
      <Typography variant="subtitle1" fontWeight={800}>Cookie preferences</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
        We use Google Analytics to understand site usage. Accept to enable analytics, or decline to browse without it.{' '}
        <Link to="/privacy-policy">Read our Privacy Policy</Link>.
      </Typography>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ mt: 2 }} justifyContent="flex-end">
        <Button variant="outlined" onClick={() => setConsent('declined')}>Decline</Button>
        <Button variant="contained" onClick={() => setConsent('accepted')}>Accept</Button>
      </Stack>
    </Paper>
  );
}
