import { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import {
  AppBar,
  Box,
  Button,
  Collapse,
  Container,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material';
import {
  ArticleRounded,
  AutoAwesomeRounded,
  CloseRounded,
  ExpandMoreRounded,
  HomeRounded,
  InfoRounded,
  MenuBookRounded,
  MenuRounded,
  NewspaperRounded,
  SearchRounded,
} from '@mui/icons-material';
import { navItems, aiNavItems } from '../data/siteData';
import { fictionGenres } from '../data/fictionGenres';
import useNewNewsCount from '../utils/useNewNewsCount';

const navIcons = {
  Home: HomeRounded,
  'Serial Fiction': MenuBookRounded,
  'News Feed': NewspaperRounded,
  Explore: ArticleRounded,
  About: InfoRounded,
};

export default function Header() {
  const newNewsCount = useNewNewsCount();
  const { pathname } = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [aiGroupOpen, setAiGroupOpen] = useState(false);

  const closeMobile = () => setMobileOpen(false);

  return (
    <AppBar position="sticky" elevation={0}>
      <Container maxWidth="xl" sx={{ px: { xs: 1.5, sm: 3 } }}>
        <Toolbar disableGutters sx={{ minHeight: { xs: 60, md: 72 }, gap: { xs: 0.5, md: 2 } }}>
          <Box component={Link} to="/" aria-label="LokkeeVerse home" sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit', flexShrink: 0 }}>
            <Box component="img" src="/lokkeeverse-mark.svg" alt="" sx={{ width: { xs: 28, sm: 38 }, height: { xs: 28, sm: 38 }, objectFit: 'contain', mr: { xs: 0.5, sm: 1.25 } }} />
            <Typography variant="h6" sx={{ fontWeight: 900, fontSize: { xs: '0.9rem', sm: '1.2rem' }, letterSpacing: '-0.04em', color: 'text.primary', whiteSpace: 'nowrap' }}>
              LokkeeVerse
            </Typography>
          </Box>

          <Box component="nav" aria-label="Main navigation" sx={{ display: { xs: 'none', lg: 'flex' }, gap: 0.75, flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}>
            {navItems.map((item) => (
              <Button
                key={item.path}
                component={NavLink}
                to={item.path}
                end={item.path === '/'}
                sx={{ color: 'text.primary', fontWeight: 750, borderRadius: 99, px: 2, py: 1, '&.active': { bgcolor: 'action.hover', color: 'primary.main' } }}
              >
                {item.label}
              </Button>
            ))}
          </Box>

          <Stack direction="row" spacing={{ xs: 0, sm: 0.75 }} alignItems="center" sx={{ ml: { xs: 'auto', lg: 0 }, flexShrink: 0 }}>
            <IconButton component={Link} to="/search" aria-label="Search LokkeeVerse" color="primary" sx={{ width: { xs: 40, sm: 48 }, height: { xs: 40, sm: 48 } }}>
              <SearchRounded />
            </IconButton>
            <IconButton aria-label="Open navigation menu" aria-expanded={mobileOpen} sx={{ display: { xs: 'inline-flex', lg: 'none' }, width: { xs: 40, sm: 48 }, height: { xs: 40, sm: 48 } }} onClick={() => setMobileOpen(true)}>
              <MenuRounded />
            </IconButton>
          </Stack>
        </Toolbar>
      </Container>

      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={closeMobile}
        slotProps={{
          paper: {
            sx: {
              width: 'min(92vw, 400px)',
              borderRadius: 0,
              bgcolor: 'background.default',
              backgroundImage: 'radial-gradient(480px circle at 110% -5%, rgba(91,76,245,0.16), transparent 55%), linear-gradient(180deg, #0d0d12 0%, #0a0a0d 100%)',
              borderLeft: '1px solid',
              borderColor: 'divider',
              display: 'flex',
              flexDirection: 'column',
            },
          },
        }}
      >
        {/* Drawer header */}
        <Box sx={{ px: 2.5, pt: 2.5, pb: 2, borderBottom: '1px solid', borderColor: 'divider', flexShrink: 0 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
           
            <IconButton aria-label="Close menu" onClick={closeMobile} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, justifyContent: 'right' }}>
              <CloseRounded fontSize="small" />
            </IconButton>
          </Stack>
        </Box>

        {/* Scrollable body */}
        <Box sx={{ flex: 1, overflowY: 'auto', px: 2, py: 2 }}>
          <Typography sx={{ fontSize: '0.68rem', fontWeight: 800, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'text.secondary', mb: 1, px: 1 }}>
            Explore
          </Typography>
          <List disablePadding>
            {navItems.map((item) => item.label === 'AI Content' ? (
              <Box key={item.path}>
                <ListItem disablePadding>
                  <ListItemButton
                    onClick={() => setAiGroupOpen((open) => !open)}
                    aria-expanded={aiGroupOpen}
                    sx={{
                      borderRadius: 2.5,
                      py: 1.25,
                      mb: 0.5,
                      bgcolor: 'background.paper',
                      border: '1px solid',
                      borderColor: 'divider',
                      '&:hover': { borderColor: 'rgba(91,76,245,0.45)' },
                      '& .MuiListItemText-primary': { fontWeight: 700, fontSize: '0.95rem' },
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 38, color: 'primary.light' }}>
                      <AutoAwesomeRounded sx={{ fontSize: 20 }} />
                    </ListItemIcon>
                    <ListItemText primary={item.label} />
                    <ExpandMoreRounded
                      sx={{
                        transform: aiGroupOpen ? 'rotate(180deg)' : 'none',
                        transition: 'transform 160ms ease',
                        color: 'text.secondary',
                        mr: 0.5,
                      }}
                    />
                  </ListItemButton>
                </ListItem>
                <Collapse in={aiGroupOpen} timeout="auto" unmountOnExit>
                  <List disablePadding sx={{ pl: 1.5, pt: 0.25, pb: 0.5 }}>
                    {aiNavItems.map((aiItem) => {
                      const aiActive = pathname === aiItem.path;
                      return (
                        <ListItem key={aiItem.path} disablePadding>
                          <ListItemButton
                            component={Link}
                            to={aiItem.path}
                            onClick={closeMobile}
                            sx={{
                              borderRadius: 2,
                              py: 0.9,
                              pl: 3,
                              bgcolor: aiActive ? 'rgba(91,76,245,0.12)' : 'transparent',
                              '& .MuiListItemText-primary': {
                                fontSize: '0.88rem',
                                color: aiActive ? 'primary.light' : 'text.secondary',
                                fontWeight: aiActive ? 700 : 500,
                              },
                            }}
                          >
                            <ListItemText primary={aiItem.label} />
                          </ListItemButton>
                        </ListItem>
                      );
                    })}
                  </List>
                </Collapse>
              </Box>
            ) : (
              <ListItem key={item.path} disablePadding>
                <ListItemButton
                  component={Link}
                  to={item.path}
                  end={item.path === '/'}
                  onClick={closeMobile}
                  selected={item.path === '/' ? pathname === '/' : pathname.startsWith(item.path)}
                  sx={{
                    borderRadius: 2.5,
                    py: 1.35,
                    mb: 0.5,
                    bgcolor: 'background.paper',
                    border: '1px solid',
                    borderColor: 'divider',
                    '&:hover': { borderColor: 'rgba(91,76,245,0.45)', bgcolor: 'background.paper' },
                    '&.Mui-selected': {
                      bgcolor: 'rgba(91,76,245,0.14)',
                      borderColor: 'rgba(91,76,245,0.5)',
                      '&:hover': { bgcolor: 'rgba(91,76,245,0.14)' },
                    },
                    '& .MuiListItemText-primary': { fontWeight: 700, fontSize: '0.95rem' },
                  }}
                >
                  {navIcons[item.label] && (
                    <ListItemIcon sx={{ minWidth: 38, color: (item.path === '/' ? pathname === '/' : pathname.startsWith(item.path)) ? 'primary.light' : 'text.secondary' }}>
                      {(() => {
                        const Icon = navIcons[item.label];
                        return Icon ? <Icon sx={{ fontSize: 20 }} /> : null;
                      })()}
                    </ListItemIcon>
                  )}
                  <ListItemText primary={item.label} />
                  {item.label === 'News Feed' && newNewsCount > 0 && (
                    <Box
                      component="span"
                      sx={{
                        px: 1,
                        height: 22,
                        borderRadius: 11,
                        bgcolor: '#ef4444',
                        color: '#fff',
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        lineHeight: '22px',
                        textAlign: 'center',
                      }}
                    >
                      {newNewsCount > 99 ? '99+' : newNewsCount} new
                    </Box>
                  )}
                </ListItemButton>
              </ListItem>
            ))}
          </List>

          <Typography sx={{ fontSize: '0.68rem', fontWeight: 800, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'text.secondary', mb: 1, mt: 2, px: 1 }}>
            Fiction Genres
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, px: 1, pb: 1 }}>
            {fictionGenres.map((genre) => (
              <Box
                key={genre.slug}
                component={Link}
                to={`/fiction?genre=${genre.slug}`}
                onClick={closeMobile}
                sx={{
                  px: 1.75,
                  py: 0.6,
                  borderRadius: 99,
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  color: 'fiction.accent',
                  bgcolor: 'rgba(199,167,255,0.08)',
                  border: '1px solid rgba(199,167,255,0.22)',
                  textDecoration: 'none',
                  transition: 'background-color 150ms ease, border-color 150ms ease',
                  '&:hover': { bgcolor: 'rgba(199,167,255,0.18)', borderColor: 'rgba(199,167,255,0.45)' },
                }}
              >
                {genre.label}
              </Box>
            ))}
          </Box>
        </Box>

        {/* Sticky footer action */}
        <Box sx={{ px: 2, py: 2, borderTop: '1px solid', borderColor: 'divider', flexShrink: 0 }}>
          <Box
            component={Link}
            to="/search"
            onClick={closeMobile}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.25,
              px: 2,
              py: 1.4,
              borderRadius: 2.5,
              bgcolor: 'background.paper',
              border: '1px solid',
              borderColor: 'divider',
              color: 'text.secondary',
              fontSize: '0.92rem',
              fontWeight: 600,
              textDecoration: 'none',
              '&:hover': { color: 'primary.light', borderColor: 'rgba(91,76,245,0.5)' },
            }}
          >
            <SearchRounded fontSize="small" />
            Search LokkeeVerse
          </Box>
        </Box>
      </Drawer>
    </AppBar>
  );
}
