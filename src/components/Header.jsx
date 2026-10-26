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
  Stack,
  Toolbar,
  Typography,
} from '@mui/material';
import { ExpandMoreRounded, MenuRounded, SearchRounded } from '@mui/icons-material';
import { navItems, aiNavItems } from '../data/siteData';
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
          <Box component={Link} to="/" aria-label="ToolPillot home" sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit', flexShrink: 0 }}>
            <Box component="img" src="/lokkeeverse-mark.svg" alt="" sx={{ width: { xs: 28, sm: 38 }, height: { xs: 28, sm: 38 }, objectFit: 'contain', mr: { xs: 0.5, sm: 1.25 } }} />
            <Typography variant="h6" sx={{ fontWeight: 900, fontSize: { xs: '0.9rem', sm: '1.2rem' }, letterSpacing: '-0.04em', color: 'text.primary', whiteSpace: 'nowrap' }}>
              ToolPillot
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
            <IconButton component={Link} to="/search" aria-label="Search ToolPillot" color="primary" sx={{ width: { xs: 40, sm: 48 }, height: { xs: 40, sm: 48 } }}>
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
        slotProps={{ paper: { sx: { width: 'min(90vw, 380px)', borderRadius: 0, bgcolor: 'background.paper' } } }}
      >
        <Box sx={{ p: { xs: 2, sm: 2.5 } }}>
          <Stack direction="row" spacing={1.25} alignItems="center" sx={{ mb: 2 }}>
            <Box component="img" src="/lokkeeverse-mark.svg" alt="" sx={{ width: 38, height: 38, objectFit: 'contain' }} />
            <Box>
              <Typography variant="h6" fontWeight={900} lineHeight={1.2}>ToolPillot</Typography>
              <Typography variant="caption" color="text.secondary">Serial fiction, news and AI</Typography>
            </Box>
          </Stack>
          <Divider sx={{ mb: 1.5 }} />
          <List disablePadding>
            {navItems.map((item) => item.label === 'AI Content' ? (
              <Box key={item.path}>
                <ListItem disablePadding>
                  <ListItemButton onClick={() => setAiGroupOpen((open) => !open)} sx={{ borderRadius: 2, py: 1.25 }}>
                    <ListItemText primary={item.label} primaryTypographyProps={{ fontWeight: 700 }} />
                    <ExpandMoreRounded sx={{ transform: aiGroupOpen ? 'rotate(180deg)' : 'none', transition: 'transform 160ms ease' }} />
                  </ListItemButton>
                </ListItem>
                <Collapse in={aiGroupOpen} timeout="auto" unmountOnExit>
                  <List disablePadding sx={{ pl: 1.5, py: 0.5 }}>
                    {aiNavItems.map((aiItem) => (
                      <ListItem key={aiItem.path} disablePadding>
                        <ListItemButton component={Link} to={aiItem.path} onClick={closeMobile} sx={{ borderRadius: 2, py: 1 }}>
                          <ListItemText primary={aiItem.label} primaryTypographyProps={{ variant: 'body2' }} />
                        </ListItemButton>
                      </ListItem>
                    ))}
                  </List>
                </Collapse>
              </Box>
            ) : (
              <ListItem key={item.path} disablePadding>
                <ListItemButton component={Link} to={item.path} onClick={closeMobile} sx={{ borderRadius: 2, py: 1.25 }}>
                  <ListItemText primary={item.label} primaryTypographyProps={{ fontWeight: 700 }} />
                  {item.label === 'News Feed' && newNewsCount > 0 && (
                    <Box component="span" sx={{ minWidth: 22, height: 22, px: 0.75, borderRadius: 11, bgcolor: '#ef4444', color: '#fff', fontSize: '0.75rem', fontWeight: 800, lineHeight: '22px', textAlign: 'center' }}>
                      {newNewsCount > 99 ? '99+' : newNewsCount} new
                    </Box>
                  )}
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </AppBar>
  );
}
