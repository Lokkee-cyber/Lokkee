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
import { ExpandMoreRounded, MenuRounded, NewspaperRounded, SearchRounded } from '@mui/icons-material';
import ThemeToggle from './ThemeToggle';
import { comparisons, navItems } from '../data/siteData';
import { publishedArticles } from '../data/articles';

const featuredArticleSlugs = [
  'best-ai-tools-to-try-in-2026',
  'best-ai-video-generators-in-2026',
  'best-ai-writing-tools',
];
const latestArticleCount = 8;

export default function Header({ mode, onToggleMode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSections, setMobileSections] = useState({ explore: false, comparisons: false });
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [activeMenu, setActiveMenu] = useState('');
  const featuredArticles = featuredArticleSlugs
    .map((slug) => publishedArticles.find((article) => article.slug === slug))
    .filter(Boolean);
  const latestArticles = publishedArticles.slice(0, latestArticleCount);
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
        <Toolbar disableGutters sx={{ minHeight: { xs: 60, sm: 78 }, gap: { xs: 0.5, sm: 2 }, minWidth: 0 }}>
          <Box component={Link} to="/" sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit', minWidth: 0, flexShrink: 1 }}>
            <Box
              component="img"
              src="/lokkeeverse-mark.svg"
              alt=""
              sx={{
                width: { xs: 28, sm: 38 },
                height: { xs: 28, sm: 38 },
                flexShrink: 0,
                objectFit: 'contain',
                mr: { xs: 0.5, sm: 1.5 },
              }}
            />
            <Typography variant="h6" sx={{ fontWeight: 800, fontSize: { xs: '0.9rem', sm: '1.25rem' }, letterSpacing: '-0.04em', color: 'primary.main', whiteSpace: 'nowrap' }}>
              LokkeeVerse
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
            <Button
              component={NavLink}
              to="/news"
              aria-label="News"
              variant="contained"
              startIcon={<NewspaperRounded />}
              sx={{
                height: { xs: 36, sm: 40 },
                width: { xs: 36, sm: 'auto' },
                minWidth: { xs: 36, sm: 0 },
                px: { xs: 0, sm: 1.75 },
                borderRadius: 999,
                background: 'linear-gradient(135deg, #5b4cf5 0%, #8a4ff5 58%, #13a89b 100%)',
                boxShadow: '0 5px 14px rgba(91,76,245,0.24)',
                '&:hover': { background: 'linear-gradient(135deg, #4638de 0%, #7440db 58%, #0e8c81 100%)', boxShadow: '0 7px 18px rgba(91,76,245,0.3)' },
                '&.active': { boxShadow: '0 0 0 3px rgba(91,76,245,0.18)' },
                '& .MuiButton-startIcon': { mr: { xs: 0, sm: 0.75 }, ml: 0 },
                '& .MuiButton-startIcon svg': { fontSize: 20 },
              }}
            >
              <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>News</Box>
            </Button>
            <IconButton component={Link} to="/search?q=" aria-label="Open search" color="primary" sx={{ width: { xs: 36, sm: 48 }, height: { xs: 36, sm: 48 } }}>
              <SearchRounded />
            </IconButton>
            <ThemeToggle mode={mode} onToggle={onToggleMode} sx={{ width: { xs: 36, sm: 48 }, height: { xs: 36, sm: 48 } }} />
            <IconButton
              aria-label="Open navigation menu"
              sx={{ display: { xs: 'inline-flex', lg: 'none' }, width: { xs: 36, sm: 48 }, height: { xs: 36, sm: 48 } }}
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
        PaperProps={{ sx: { width: 'min(88vw, 360px)', maxWidth: '100vw' } }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" fontWeight={800} mb={1}>Menu</Typography>
          <Divider sx={{ mb: 1 }} />
          <List>
            <ListItem disablePadding>
              <ListItemButton component={Link} to="/news" onClick={() => setMobileOpen(false)}>
                <ListItemText primary="News" primaryTypographyProps={{ fontWeight: 800, color: 'primary.main' }} />
              </ListItemButton>
            </ListItem>
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
