import { Box, Container, Divider, IconButton, Link as MuiLink, Stack, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { FacebookRounded, LinkedIn, X, YouTube } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { reopenConsent } from '../utils/consent';
import { fictionGenres } from '../data/fictionGenres.js';

const pillars = [
  { label: 'Serial Fiction', to: '/fiction' },
  { label: 'News Feed', to: '/news' },
  { label: 'AI Content', to: '/ai-content' },
];

const discoverLinks = [
  { label: 'AI Tools', to: '/ai-tools' },
  { label: 'AI Writing', to: '/ai-writing' },
  { label: 'AI Video', to: '/ai-video' },
  { label: 'Comparisons', to: '/comparisons' },
  { label: 'All articles', to: '/articles' },
];

const popularGenres = fictionGenres.slice(0, 6).map((genre) => ({
  label: genre.label,
  to: `/fiction?genre=${genre.slug}`,
}));

const companyLinks = [
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
  { label: 'Editorial Policy', to: '/editorial-policy' },
  { label: 'Author', to: '/authors/lokkeeverse-editorial' },
];

const legalLinks = [
  { label: 'Privacy Policy', to: '/privacy-policy' },
  { label: 'Terms', to: '/terms' },
  { label: 'Disclaimer', to: '/disclaimer' },
  { label: 'Affiliate Disclosure', to: '/affiliate-disclosure' },
];

const socialLinks = [
  { label: 'X', icon: <X />, href: 'https://x.com/' },
  { label: 'LinkedIn', icon: <LinkedIn />, href: 'https://www.linkedin.com/' },
  { label: 'YouTube', icon: <YouTube />, href: 'https://www.youtube.com/' },
  { label: 'Facebook', icon: <FacebookRounded />, href: 'https://www.facebook.com/' },
];

function FooterGroup({ heading, links, extra }) {
  return (
    <Box>
      <Typography
        sx={{
          fontSize: '0.72rem',
          fontWeight: 800,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: 'text.secondary',
          mb: 1.5,
        }}
      >
        {heading}
      </Typography>
      <Stack spacing={1.25}>
        {links.map((item) => (
          <MuiLink
            key={item.to}
            component={Link}
            to={item.to}
            underline="none"
            sx={{
              color: 'text.secondary',
              fontSize: '0.9rem',
              width: 'fit-content',
              transition: 'color 150ms ease',
              '&:hover': { color: 'primary.light' },
              '&:focus-visible': { outline: '2px solid', outlineColor: 'primary.main', outlineOffset: 2, borderRadius: 1 },
            }}
          >
            {item.label}
          </MuiLink>
        ))}
        {extra}
      </Stack>
    </Box>
  );
}

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        mt: { xs: 6, md: 9 },
        borderTop: '1px solid',
        borderColor: 'divider',
        background: (theme) =>
          `linear-gradient(180deg, ${alpha(theme.palette.background.default, 0)} 0%, ${alpha(theme.palette.fiction.surface, 0.55)} 100%)`,
      }}
    >
      <Container maxWidth="xl" sx={{ py: { xs: 4, md: 6 }, px: { xs: 2.5, sm: 3 } }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: 'repeat(2, minmax(0, 1fr))',
              sm: 'repeat(3, minmax(0, 1fr))',
              md: '2.2fr repeat(4, minmax(0, 1fr))',
            },
            gap: { xs: 3.5, md: 4 },
          }}
        >
          {/* Brand column */}
          <Box sx={{ gridColumn: { xs: 'span 2', sm: 'span 3', md: 'auto' } }}>
            <Box
              component={Link}
              to="/"
              sx={{ display: 'inline-flex', alignItems: 'center', gap: 1.25, color: 'inherit', textDecoration: 'none', mb: 1.5 }}
            >
              <Box component="img" src="/lokkeeverse-mark.svg" alt="" sx={{ width: 34, height: 34, objectFit: 'contain' }} />
              <Typography sx={{ fontWeight: 900, fontSize: '1.25rem', letterSpacing: '-0.03em' }}>LokkeeVerse</Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 320, lineHeight: 1.7 }}>
              Serial fiction, timely news, and practical AI content for curious people.
            </Typography>
            <Stack direction="row" spacing={0.5} sx={{ mt: 2.25 }}>
              {socialLinks.map((link) => (
                <IconButton
                  key={link.label}
                  component="a"
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.label}
                  size="small"
                  sx={{
                    color: 'text.secondary',
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 2,
                    '&:hover': { color: 'primary.light', borderColor: alpha('#ffffff', 0.2) },
                  }}
                >
                  {link.icon}
                </IconButton>
              ))}
            </Stack>
          </Box>

          <FooterGroup heading="Pillars" links={pillars} />
          <FooterGroup heading="Discover" links={discoverLinks} />
          <FooterGroup heading="Fiction Genres" links={popularGenres} />
          <FooterGroup
            heading="Company & Legal"
            links={companyLinks}
            extra={
              <>
                {legalLinks.map((item) => (
                  <MuiLink
                    key={item.to}
                    component={Link}
                    to={item.to}
                    underline="none"
                    sx={{
                      color: 'text.secondary',
                      fontSize: '0.9rem',
                      width: 'fit-content',
                      transition: 'color 150ms ease',
                      '&:hover': { color: 'primary.light' },
                    }}
                  >
                    {item.label}
                  </MuiLink>
                ))}
                <MuiLink
                  component="button"
                  type="button"
                  onClick={reopenConsent}
                  underline="none"
                  sx={{
                    color: 'text.secondary',
                    fontSize: '0.9rem',
                    width: 'fit-content',
                    font: 'inherit',
                    textAlign: 'left',
                    transition: 'color 150ms ease',
                    '&:hover': { color: 'primary.light' },
                  }}
                >
                  Cookie Settings
                </MuiLink>
              </>
            }
          />
        </Box>

        <Divider sx={{ my: { xs: 3.5, md: 4 }, borderColor: alpha('#ffffff', 0.08) }} />

        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'center', sm: 'center' }}
          spacing={1.5}
        >
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.82rem' }}>
            © {new Date().getFullYear()} LokkeeVerse. All rights reserved.
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.82rem' }}>
            Explore more. Create smarter.
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
}
