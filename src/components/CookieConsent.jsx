import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button, Paper, Stack, Typography } from '@mui/material';
import { setConsent, useConsent } from '../utils/consent';

export default function CookieConsent() {
  const { adsAllowed, showBanner } = useConsent();
  const { pathname } = useLocation();
  const onArticle = /^\/articles\/[^/]+/.test(pathname);

  useEffect(() => {
    if (!adsAllowed || !onArticle) return undefined;
    const before = new Set(document.body.children);
    const script = document.createElement('script');
    script.setAttribute('data-cfasync', 'false');
    script.src = 'https://bauval.org/14/4c9f2d1f4f7527ed9052c310b71bde79';
    document.body.appendChild(script);
    return () => {
      script.remove();
      Array.from(document.body.children).forEach((node) => {
        if (!before.has(node) && node.id !== 'root') node.remove();
      });
    };
  }, [adsAllowed, onArticle]);

  if (!showBanner) return null;

  return (
    <Paper
      role="dialog"
      aria-label="Cookie consent"
      elevation={8}
      sx={{ position: 'fixed', left: { xs: 8, sm: 24 }, right: { xs: 8, sm: 24 }, bottom: { xs: 8, sm: 24 }, zIndex: 1400, p: 2.5, maxWidth: 720, mx: 'auto', borderRadius: 3 }}
    >
      <Typography variant="subtitle1" fontWeight={800}>Cookies and ads</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
        We use a third-party ad network and Google Analytics, which may set cookies to show and measure ads and understand site usage. Accept to enable both, or decline to browse without them.{' '}
        <Link to="/privacy-policy">Read our Privacy Policy</Link>.
      </Typography>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ mt: 2 }} justifyContent="flex-end">
        <Button variant="outlined" onClick={() => setConsent('declined')}>Decline</Button>
        <Button variant="contained" onClick={() => setConsent('accepted')}>Accept</Button>
      </Stack>
    </Paper>
  );
}
