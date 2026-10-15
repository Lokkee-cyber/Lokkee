import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import {
  AppBar,
  Box,
  Button,
  Collapse,
  Container,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material';
import { ExpandMoreRounded, MenuRounded, SearchRounded } from '@mui/icons-material';
import ThemeToggle from './ThemeToggle';
import { comparisons, navItems } from '../data/siteData';
import { publishedArticles } from '../data/articles';

export default function Header({ mode, onToggleMode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileComparisonsOpen, setMobileComparisonsOpen] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const comparisonsOpen = Boolean(menuAnchor);

  const comparisonLinks = Array.from(new Map([
    ...comparisons.map((comparison) => [
      `/compare/${comparison.slug}`,
      { title: comparison.title, path: `/compare/${comparison.slug}` },
    ]),
    ...publishedArticles
      .filter((article) => article.comparison)
      .map((article) => [`/articles/${article.slug}`, { title: article.title, path: `/articles/${article.slug}` }]),
  ]).values());

  const closeMenu = () => setMenuAnchor(null);
  const closeMobile = () => setMobileOpen(false);

  return (
    <AppBar position="sticky" elevation={0}>
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ minHeight: { xs: 66, md: 76 }, gap: { xs: 1, md: 2 } }}>
          <Box component={Link} to="/" aria-label="LokkeeVerse home" sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit', flexShrink: 0 }}>
            <Box component="img" src="/lokkeeverse-mark.svg" alt="" sx={{ width: { xs: 34, sm: 38 }, height: { xs: 34, sm: 38 }, objectFit: 'contain', mr: 1.25 }} />
            <Typography variant="h6" sx={{ fontWeight: 900, fontSize: { xs: '1rem', sm: '1.2rem' }, letterSpacing: '-0.04em', color: '#0f2c8d', whiteSpace: 'nowrap' }}>
              LokkeeVerse
            </Typography>
          </Box>

          <Box component="nav" aria-label="Main navigation" sx={{ display: { xs: 'none', lg: 'flex' }, gap: 0.75, flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}>
            {navItems.map((item) => item.label === 'Comparisons' ? (
              <Button
                key={item.path}
                aria-haspopup="menu"
                aria-expanded={comparisonsOpen ? 'true' : undefined}
                endIcon={<ExpandMoreRounded />}
                onClick={(event) => setMenuAnchor(event.currentTarget)}
                sx={{ color: comparisonsOpen ? 'primary.main' : 'text.primary', fontWeight: 750, borderRadius: 99, px: 2, py: 1, bgcolor: comparisonsOpen ? 'action.hover' : 'transparent' }}
              >
                {item.label}
              </Button>
            ) : (
              <Button
                key={item.path}
                component={NavLink}
                to={item.path}
                sx={{ color: 'text.primary', fontWeight: 750, borderRadius: 99, px: 2, py: 1, '&.active': { bgcolor: 'action.hover', color: 'primary.main' } }}
              >
                {item.label}
              </Button>
            ))}
          </Box>

          <Stack direction="row" spacing={{ xs: 0, sm: 0.75 }} alignItems="center" sx={{ ml: { xs: 'auto', lg: 0 }, flexShrink: 0 }}>
            <IconButton component={Link} to="/search" aria-label="Search LokkeeVerse" color="primary">
              <SearchRounded />
            </IconButton>
            <ThemeToggle mode={mode} onToggle={onToggleMode} />
            <IconButton aria-label="Open navigation menu" sx={{ display: { xs: 'inline-flex', lg: 'none' } }} onClick={() => setMobileOpen(true)}>
              <MenuRounded />
            </IconButton>
          </Stack>
        </Toolbar>
      </Container>

      <Menu
        anchorEl={menuAnchor}
        open={comparisonsOpen}
        onClose={closeMenu}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        transformOrigin={{ vertical: 'top', horizontal: 'center' }}
        slotProps={{ paper: { sx: { mt: 1, p: 1, minWidth: 320, maxWidth: 480, maxHeight: '70vh', borderRadius: 3, boxShadow: '0 18px 50px rgba(15, 23, 42, 0.16)' } } }}
      >
        {comparisonLinks.length ? comparisonLinks.map((item) => (
          <MenuItem key={item.path} component={Link} to={item.path} onClick={closeMenu} sx={{ borderRadius: 1.5, py: 1.25, whiteSpace: 'normal' }}>
            {item.title}
          </MenuItem>
        )) : <MenuItem disabled>No comparisons published yet</MenuItem>}
      </Menu>

      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={closeMobile}
        slotProps={{ paper: { sx: { width: 'min(88vw, 360px)', borderRadius: 0 } } }}
      >
        <Box sx={{ p: 2.5 }}>
          <Stack direction="row" spacing={1.25} alignItems="center" sx={{ mb: 2 }}>
            <Box component="img" src="/lokkeeverse-mark.svg" alt="" sx={{ width: 38, height: 38, objectFit: 'contain' }} />
            <Box>
              <Typography variant="h6" fontWeight={900} lineHeight={1.2}>LokkeeVerse</Typography>
              <Typography variant="caption" color="text.secondary">Explore AI with confidence</Typography>
            </Box>
          </Stack>
          <Divider sx={{ mb: 1.5 }} />
          <List disablePadding>
            {navItems.map((item) => item.label === 'Comparisons' ? (
              <Box key={item.path}>
                <ListItem disablePadding>
                  <ListItemButton onClick={() => setMobileComparisonsOpen((open) => !open)} sx={{ borderRadius: 2, py: 1.25 }}>
                    <ListItemText primary={item.label} primaryTypographyProps={{ fontWeight: 700 }} />
                    <ExpandMoreRounded sx={{ transform: mobileComparisonsOpen ? 'rotate(180deg)' : 'none', transition: 'transform 160ms ease' }} />
                  </ListItemButton>
                </ListItem>
                <Collapse in={mobileComparisonsOpen} timeout="auto" unmountOnExit>
                  <List disablePadding sx={{ pl: 1.5, py: 0.5 }}>
                    {comparisonLinks.length ? comparisonLinks.map((comparison) => (
                      <ListItem key={comparison.path} disablePadding>
                        <ListItemButton component={Link} to={comparison.path} onClick={closeMobile} sx={{ borderRadius: 2, py: 1 }}>
                          <ListItemText primary={comparison.title} primaryTypographyProps={{ variant: 'body2' }} />
                        </ListItemButton>
                      </ListItem>
                    )) : <ListItemText primary="No comparisons published yet" sx={{ px: 2, py: 1 }} />}
                  </List>
                </Collapse>
              </Box>
            ) : (
              <ListItem key={item.path} disablePadding>
                <ListItemButton component={Link} to={item.path} onClick={closeMobile} sx={{ borderRadius: 2, py: 1.25 }}>
                  <ListItemText primary={item.label} primaryTypographyProps={{ fontWeight: 700 }} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </AppBar>
  );
}