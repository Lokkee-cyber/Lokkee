import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
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
  ListItemText,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material';
import { CloseRounded, ExpandMoreRounded, MenuRounded, SearchRounded } from '@mui/icons-material';
import { navItems, aiNavItems } from '../data/siteData';
import { fictionGenres } from '../data/fictionGenres';
import useNewNewsCount from '../utils/useNewNewsCount';

export default function Header() {
  const newNewsCount = useNewNewsCount();
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
              backgroundImage: 'radial-gradient(500px circle at 100% 0%, rgba(91,76,245,0.12), transparent 60%)',
              borderLeft: '1px solid',
              borderColor: 'divider',
            },
          },
        }}
      >
        <Box sx={{ p: { xs: 2.5, sm: 3 } }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
            <Stack direction="row" spacing={1.25} alignItems="center">
              <Box component="img" src="/lokkeeverse-mark.svg" alt="" sx={{ width: 40, height: 40, objectFit: 'contain' }} />
              <Box>
                <Typography sx={{ fontWeight: 900, fontSize: '1.15rem', letterSpacing: '-0.03em', lineHeight: 1.2 }}>LokkeeVerse</Typography>
                <Typography variant="caption" color="text.secondary">Explore more. Create smarter.</Typography>
              </Box>
            </Stack>
            <IconButton aria-label="Close menu" onClick={closeMobile} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
              <CloseRounded fontSize="small" />
            </IconButton>
          </Stack>

          <Typography sx={{ fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'text.secondary', mb: 1 }}>
            Explore
          </Typography>
          <List disablePadding sx={{ mb: 2.5 }}>
            {navItems.map((item) => item.label === 'AI Content' ? (
              <Box key={item.path}>
                <ListItem disablePadding>
                  <ListItemButton
                    onClick={() => setAiGroupOpen((open) => !open)}
                    sx={{
                      borderRadius: 2,
                      py: 1.25,
                      mb: 0.5,
                      '& .MuiListItemText-primary': { fontWeight: 700 },
                    }}
                  >
                    <ListItemText primary={item.label} />
                    <ExpandMoreRounded
                      sx={{
                        transform: aiGroupOpen ? 'rotate(180deg)' : 'none',
                        transition: 'transform 160ms ease',
                        color: 'text.secondary',
                      }}
                    />
                  </ListItemButton>
                </ListItem>
                <Collapse in={aiGroupOpen} timeout="auto" unmountOnExit>
                  <List disablePadding sx={{ pl: 1.5, py: 0.5 }}>
                    {aiNavItems.map((aiItem) => (
                      <ListItem key={aiItem.path} disablePadding>
                        <ListItemButton
                          component={Link}
                          to={aiItem.path}
                          onClick={closeMobile}
                          sx={{
                            borderRadius: 2,
                            py: 1,
                            '& .MuiListItemText-primary': {
                              variant: 'body2',
                              color: 'text.secondary',
                              fontWeight: 500,
                            },
                          }}
                        >
                          <ListItemText primary={aiItem.label} />
                        </ListItemButton>
                      </ListItem>
                    ))}
                  </List>
                </Collapse>
              </Box>
            ) : (
              <ListItem key={item.path} disablePadding>
                <ListItemButton
                  component={Link}
                  to={item.path}
                  onClick={closeMobile}
                  sx={{
                    borderRadius: 2,
                    py: 1.25,
                    mb: 0.5,
                    '& .MuiListItemText-primary': { fontWeight: 700 },
                  }}
                >
                  <ListItemText primary={item.label} />
                  {item.label === 'News Feed' && newNewsCount > 0 && (
                    <Box
                      component="span"
                      sx={{
                        minWidth: 22,
                        height: 22,
                        px: 0.75,
                        borderRadius: 11,
                        bgcolor: '#ef4444',
                        color: '#fff',
                        fontSize: '0.75rem',
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

          <Typography sx={{ fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'text.secondary', mb: 1 }}>
            Fiction Genres
          </Typography>
          <Stack direction="row" flexWrap="wrap" useFlexGap sx={{ gap: 0.75, mb: 2.5 }}>
            {fictionGenres.slice(0, 6).map((genre) => (
              <Box
                key={genre.slug}
                component={Link}
                to={`/fiction?genre=${genre.slug}`}
                onClick={closeMobile}
                sx={{
                  px: 1.5,
                  py: 0.5,
                  borderRadius: 99,
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  color: 'fiction.accent',
                  bgcolor: 'rgba(199,167,255,0.08)',
                  border: '1px solid rgba(199,167,255,0.25)',
                  textDecoration: 'none',
                  '&:hover': { bgcolor: 'rgba(199,167,255,0.18)' },
                }}
              >
                {genre.label}
              </Box>
            ))}
          </Stack>

          <Box sx={{ pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
            <Box
              component={Link}
              to="/search"
              onClick={closeMobile}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                px: 2,
                py: 1.5,
                borderRadius: 2,
                bgcolor: 'background.paper',
                border: '1px solid',
                borderColor: 'divider',
                color: 'text.secondary',
                fontSize: '0.9rem',
                textDecoration: 'none',
                '&:hover': { color: 'primary.light', borderColor: 'primary.main' },
              }}
            >
              <SearchRounded fontSize="small" />
              Search LokkeeVerse
            </Box>
          </Box>
        </Box>
      </Drawer>
    </AppBar>
  );
}
