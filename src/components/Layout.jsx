import { Box } from '@mui/material';
import { Outlet, useLocation } from 'react-router-dom';
import { useLayoutEffect } from 'react';
import Header from './Header';
import Footer from './Footer';

export default function Layout({ mode, onToggleMode }) {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <>
      <Header mode={mode} onToggleMode={onToggleMode} />
      <Box component="main" sx={{ minHeight: '70vh', minWidth: 0 }}>
        <Outlet />
      </Box>
      <Footer />
    </>
  );
}
