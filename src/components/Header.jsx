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

const featuredArticleCount = 3;

export default function Header({ mode, onToggleMode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSections, setMobileSections] = useState({ explore: false, comparisons: false });
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [activeMenu, setActiveMenu] = useState('');
  const featuredArticles = publishedArticles.slice(0, featuredArticleCount);
  const latestArticles = publishedArticles.slice(featuredArticleCount);
  const comparisonLinks = [
    ...comparisons.map((comparison) => ({
      title: comparison.title,
      path: `/compare/${comparison.slug}`,
    })),
    ...publishedArticles
      .filter((article) => article.comparison)
      .map((article) => ({ title: article.title, path: `/articles/${article.slug}` })),
  ];

  const openMenu = (event, name) => {
    setMenuAnchor(event.currentTarget);
    setActiveMenu(name);
  };

  const closeMenu = () => {
    setMenuAnchor(null);
    setActiveMenu('');
  };

  const renderArticleLinks = (items) => items.map((article) => (
    <MenuItem key={article.slug} component={Link} to={`/articles/${article.slug}`} onClick={closeMenu}>
      {article.title}
    </MenuItem>
  ));

  return (
    <AppBar position="sticky" elevation={0}>
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ minHeight: { xs: 64, sm: 78 }, gap: { xs: 1, sm: 2 }, minWidth: 0 }}>
          <Box component={Link} to="/" sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit', minWidth: 0, flexShrink: 1 }}>
            <Box
              sx={{
                width: { xs: 34, sm: 38 },
                height: { xs: 34, sm: 38 },
                flexShrink: 0,
                borderRadius: 12,
                background: 'linear-gradient(135deg, #5041f8 0%, #13b8a6 100%)',
                display: 'grid',
                placeItems: 'center',
                color: '#fff',
                fontWeight: 800,
                mr: { xs: 1, sm: 1.5 },
              }}
            >
              T
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 800, fontSize: { xs: '1rem', sm: '1.25rem' }, letterSpacing: '-0.04em', color: '#0f2c8d', whiteSpace: 'nowrap' }}>
              ToolPilot AI
            </Typography>
          </Box>

          <Box sx={{ display: { xs: 'none', lg: 'flex' }, gap: 0.2, flexGrow: 1, justifyContent: 'center', flexWrap: 'wrap' }}>
            {navItems.map((item) => item.label === 'Explore' || item.label === 'Comparisons' ? (
              <Button
                key={item.path}
                aria-haspopup="menu"
                aria-expanded={activeMenu === item.label ? 'true' : undefined}
                endIcon={<ExpandMoreRounded />}
                onClick={(event) => openMenu(event, item.label)}
                sx={{
                  color: 'text.primary',
                  fontWeight: 700,
                  borderRadius: 999,
                  '&.active': { backgroundColor: 'rgba(91, 76, 245, 0.08)', color: 'primary.main' },
                }}
              >
                {item.label}
              </Button>
            ) : (
              <Button
                key={item.path}
                component={NavLink}
                to={item.path}
                sx={{
                  color: 'text.primary',
                  fontWeight: 700,
                  borderRadius: 999,
                  '&.active': { backgroundColor: 'rgba(91, 76, 245, 0.08)', color: 'primary.main' },
                }}
              >
                {item.label}
              </Button>
            ))}
          </Box>

          <Stack direction="row" spacing={{ xs: 0, sm: 1 }} alignItems="center" sx={{ ml: 'auto', flexShrink: 0 }}>
            <IconButton component={Link} to="/search?q=" aria-label="Open search" color="primary">
              <SearchRounded />
            </IconButton>
            <ThemeToggle mode={mode} onToggle={onToggleMode} />
            <IconButton
              aria-label="Open navigation menu"
              sx={{ display: { xs: 'inline-flex', lg: 'none' } }}
              onClick={() => setMobileOpen(true)}
            >
              <MenuRounded />
            </IconButton>
          </Stack>
        </Toolbar>
      </Container>

      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={closeMenu}
        PaperProps={{ sx: { maxHeight: '70vh', minWidth: 280, maxWidth: 420 } }}
      >
        {activeMenu === 'Explore' ? (
          <>
            <MenuItem disabled sx={{ opacity: '1 !important', fontWeight: 800 }}>Featured articles</MenuItem>
            {renderArticleLinks(featuredArticles)}
            <Divider />
            <MenuItem disabled sx={{ opacity: '1 !important', fontWeight: 800 }}>Latest articles</MenuItem>
            {renderArticleLinks(latestArticles)}
          </>
        ) : (
          comparisonLinks.length
            ? comparisonLinks.map((item) => (
              <MenuItem key={item.path} component={Link} to={item.path} onClick={closeMenu}>{item.title}</MenuItem>
            ))
            : <MenuItem disabled>No comparisons published yet</MenuItem>
        )}
      </Menu>

      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        PaperProps={{ sx: { width: 280 } }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" fontWeight={800} mb={1}>Menu</Typography>
          <Divider sx={{ mb: 1 }} />
          <List>
            {navItems.map((item) => item.label === 'Explore' || item.label === 'Comparisons' ? (
              <Box key={item.path}>
                <ListItem disablePadding>
                  <ListItemButton
                    onClick={() => setMobileSections((current) => ({
                      ...current,
                      [item.label === 'Explore' ? 'explore' : 'comparisons']: !current[item.label === 'Explore' ? 'explore' : 'comparisons'],
                    }))}
                  >
                    <ListItemText primary={item.label} />
                    <ExpandMoreRounded />
                  </ListItemButton>
                </ListItem>
                <Collapse in={mobileSections[item.label === 'Explore' ? 'explore' : 'comparisons']} timeout="auto" unmountOnExit>
                  <List disablePadding sx={{ pl: 2 }}>
                    {item.label === 'Explore' ? (
                      <>
                        <ListItemText primary="Featured articles" sx={{ px: 2, pt: 1, fontWeight: 800 }} />
                        {featuredArticles.map((article) => (
                          <ListItem key={article.slug} disablePadding>
                            <ListItemButton component={Link} to={`/articles/${article.slug}`} onClick={() => setMobileOpen(false)}>
                              <ListItemText primary={article.title} />
                            </ListItemButton>
                          </ListItem>
                        ))}
                        <ListItemText primary="Latest articles" sx={{ px: 2, pt: 1, fontWeight: 800 }} />
                        {latestArticles.map((article) => (
                          <ListItem key={article.slug} disablePadding>
                            <ListItemButton component={Link} to={`/articles/${article.slug}`} onClick={() => setMobileOpen(false)}>
                              <ListItemText primary={article.title} />
                            </ListItemButton>
                          </ListItem>
                        ))}
                      </>
                    ) : comparisonLinks.length ? comparisonLinks.map((comparison) => (
                      <ListItem key={comparison.path} disablePadding>
                        <ListItemButton component={Link} to={comparison.path} onClick={() => setMobileOpen(false)}>
                          <ListItemText primary={comparison.title} />
                        </ListItemButton>
                      </ListItem>
                    )) : (
                      <ListItemText primary="No comparisons published yet" sx={{ px: 2, py: 1 }} />
                    )}
                  </List>
                </Collapse>
              </Box>
            ) : (
              <ListItem key={item.path} disablePadding>
                <ListItemButton component={Link} to={item.path} onClick={() => setMobileOpen(false)}>
                  <ListItemText primary={item.label} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </AppBar>
  );
}
