import { Link, useLocation } from 'react-router-dom';
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
      <Typography variant="subtitle1" fontWeight={800}>Cookies and analytics</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
        We use Google Analytics, which may set cookies to measure site usage and understand how the site is used. Accept to enable it, or decline to browse without it.{' '}
        <Link to="/privacy-policy">Read our Privacy Policy</Link>.
      </Typography>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ mt: 2 }} justifyContent="flex-end">
        <Button variant="outlined" onClick={() => setConsent('declined')}>Decline</Button>
        <Button variant="contained" onClick={() => setConsent('accepted')}>Accept</Button>
      </Stack>
    </Paper>
  );
}
