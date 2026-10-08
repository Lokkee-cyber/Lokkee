import { Box, Container, Divider, Grid, IconButton, Link as MuiLink, Stack, Typography } from '@mui/material';
import { FacebookRounded, LinkedIn, X, YouTube } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { footerSections } from '../data/siteData';

const socialLinks = [
  { label: 'X', icon: <X /> },
  { label: 'LinkedIn', icon: <LinkedIn /> },
  { label: 'YouTube', icon: <YouTube /> },
  { label: 'Facebook', icon: <FacebookRounded /> },
];

export default function Footer() {
  return (
    <Box component="footer" sx={{ backgroundColor: 'background.paper', borderTop: '1px solid', borderColor: 'divider', mt: 8 }}>
      <Container maxWidth="xl" sx={{ py: 6 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" fontWeight={800} mb={1}>ToolPilot AI</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 330 }}>
              Discover the right AI tools. Create more. Work smarter.
            </Typography>
            <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
              {socialLinks.map((link) => (
                <IconButton key={link.label} aria-label={link.label} size="small" color="primary">
                  {link.icon}
                </IconButton>
              ))}
            </Stack>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="subtitle1" fontWeight={700} mb={1}>Explore</Typography>
            <Stack spacing={1}>
              {footerSections.explore.map((item) => (
                <MuiLink component={Link} key={item} to="/" underline="hover" color="text.secondary">
                  {item}
                </MuiLink>
              ))}
            </Stack>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="subtitle1" fontWeight={700} mb={1}>Resources</Typography>
            <Stack spacing={1}>
              {footerSections.resources.map((item) => (
                <MuiLink component={Link} key={item} to="/" underline="hover" color="text.secondary">
                  {item}
                </MuiLink>
              ))}
            </Stack>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="subtitle1" fontWeight={700} mb={1}>Company</Typography>
            <Stack spacing={1}>
              {footerSections.company.map((item) => (
                <MuiLink component={Link} key={item} to="/" underline="hover" color="text.secondary">
                  {item}
                </MuiLink>
              ))}
            </Stack>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="subtitle1" fontWeight={700} mb={1}>Legal</Typography>
            <Stack spacing={1}>
              {footerSections.legal.map((item) => (
                <MuiLink component={Link} key={item} to="/" underline="hover" color="text.secondary">
                  {item}
                </MuiLink>
              ))}
            </Stack>
          </Grid>
        </Grid>
        <Divider sx={{ my: 3 }} />
        <Typography variant="body2" color="text.secondary" textAlign="center">
          © 2026 ToolPilot AI. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
}
