import { Box, Container, Divider, Grid, IconButton, Link as MuiLink, Stack, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { FacebookRounded, LinkedIn, X, YouTube } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { reopenConsent } from '../utils/consent';

const footerLinks = {
  Explore: [
    { label: 'AI Tools', to: '/ai-tools' },
    { label: 'AI Video', to: '/ai-video' },
    { label: 'AI Image', to: '/ai-image' },
    { label: 'AI Writing', to: '/ai-writing' },
    { label: 'AI Coding', to: '/ai-coding' },
  ],
  Resources: [
    { label: 'News', to: '/news' },
    { label: 'Articles', to: '/articles' },
    { label: 'Comparisons', to: '/comparisons' },
    { label: 'AI Creators', to: '/ai-creators' },
    { label: 'AI Business', to: '/ai-business' },
    { label: 'AI Students', to: '/ai-students' },
  ],
  Company: [
    { label: 'About', to: '/about' },
    { label: 'Contact', to: '/contact' },
    { label: 'Editorial Policy', to: '/editorial-policy' },
    { label: 'Author', to: '/authors/lokkeeverse-editorial' },
  ],
  Legal: [
    { label: 'Privacy Policy', to: '/privacy-policy' },
    { label: 'Terms', to: '/terms' },
    { label: 'Disclaimer', to: '/disclaimer' },
    { label: 'Affiliate Disclosure', to: '/affiliate-disclosure' },
  ],
};

const socialLinks = [
  { label: 'X', icon: <X />, href: 'https://x.com/' },
  { label: 'LinkedIn', icon: <LinkedIn />, href: 'https://www.linkedin.com/' },
  { label: 'YouTube', icon: <YouTube />, href: 'https://www.youtube.com/' },
  { label: 'Facebook', icon: <FacebookRounded />, href: 'https://www.facebook.com/' },
];

export default function Footer() {
  return (
    <Box component="footer" sx={{ backgroundColor: (theme) => alpha(theme.palette.background.paper, 0.82), backdropFilter: 'blur(16px)', borderTop: '1px solid', borderColor: 'divider', mt: { xs: 6, md: 8 } }}>
      <Container maxWidth="xl" sx={{ py: { xs: 4, md: 6 }, px: { xs: 2, sm: 3 } }}>
        <Grid container spacing={{ xs: 3, md: 4 }}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Box component={Link} to="/" sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, color: 'inherit', textDecoration: 'none', mb: 1 }}>
              <Box component="img" src="/lokkeeverse-mark.svg" alt="" sx={{ width: 32, height: 32, objectFit: 'contain' }} />
              <Typography variant="h6" fontWeight={800}>LokkeeVerse</Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 330 }}>
              Discover verified AI tools, practical comparisons, and smart workflows for creators, students, developers, and businesses.
            </Typography>
            <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
              {socialLinks.map((link) => (
                <IconButton key={link.label} component="a" href={link.href} target="_blank" rel="noopener noreferrer" aria-label={link.label} size="small" color="primary">
                  {link.icon}
                </IconButton>
              ))}
            </Stack>
          </Grid>
          {Object.entries(footerLinks).map(([heading, links]) => (
            <Grid size={{ xs: 6, sm: 6, md: 2 }} key={heading}>
              <Typography variant="subtitle1" fontWeight={700} mb={1}>{heading}</Typography>
              <Stack spacing={1}>
                {links.map((item) => (
                  <MuiLink component={Link} key={item.to} to={item.to} underline="hover" color="text.secondary">{item.label}</MuiLink>
                ))}
                {heading === 'Legal' && (
                  <MuiLink component="button" type="button" onClick={reopenConsent} underline="hover" color="text.secondary" sx={{ textAlign: 'left', font: 'inherit' }}>Cookie Settings</MuiLink>
                )}
              </Stack>
            </Grid>
          ))}
        </Grid>
        <Divider sx={{ my: 3 }} />
        <Typography variant="body2" color="text.secondary" textAlign="center">
          © {new Date().getFullYear()} LokkeeVerse. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
}
