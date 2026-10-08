import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import {
  AppBar,
  Box,
  Button,
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
import { MenuRounded, SearchRounded } from '@mui/icons-material';
import ThemeToggle from './ThemeToggle';
import { navItems } from '../data/siteData';

export default function Header({ mode, onToggleMode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <AppBar position="sticky" elevation={0}>
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ minHeight: 78, gap: 2 }}>
          <Box component={Link} to="/" sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit' }}>
            <Box
              sx={{
                width: 38,
                height: 38,
                borderRadius: 12,
                background: 'linear-gradient(135deg, #5b4cf5 0%, #13b8a6 100%)',
                display: 'grid',
                placeItems: 'center',
                color: '#fff',
                fontWeight: 800,
                mr: 1.5,
              }}
            >
              T
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: '-0.04em', color: '#0f2c8d' }}>
              ToolPilot AI
            </Typography>
          </Box>

          <Box sx={{ display: { xs: 'none', lg: 'flex' }, gap: 0.2, flexGrow: 1, justifyContent: 'center', flexWrap: 'wrap' }}>
            {navItems.map((item) => (
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

          <Stack direction="row" spacing={1} alignItems="center" sx={{ ml: 'auto' }}>
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
            {navItems.map((item) => (
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
