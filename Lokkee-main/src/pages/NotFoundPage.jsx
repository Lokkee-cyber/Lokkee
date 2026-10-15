import { Button, Container, Stack, Typography } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import SEO from '../components/SEO';

export default function NotFoundPage() {
  const { pathname } = useLocation();

  return (
    <Container maxWidth="sm" sx={{ py: { xs: 8, md: 12 }, textAlign: 'center' }}>
      <SEO title="Page not found | LokkeeVerse" description="The page you’re looking for doesn’t exist on LokkeeVerse." canonical={pathname} noindex />
      <Typography variant="h1" fontWeight={900}>404</Typography>
      <Typography variant="h4" fontWeight={800} sx={{ mt: 2 }}>This page doesn’t exist</Typography>
      <Typography color="text.secondary" sx={{ mt: 2 }}>
        The link may be outdated, or the page may have moved. Explore the site to find current AI tools and articles.
      </Typography>
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="center" spacing={2} sx={{ mt: 4 }}>
        <Button component={Link} to="/" variant="contained">Back to homepage</Button>
        <Button component={Link} to="/search" variant="outlined">Search LokkeeVerse</Button>
      </Stack>
    </Container>
  );
}
