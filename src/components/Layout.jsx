import { Box } from '@mui/material';
import { Outlet, useLocation } from 'react-router-dom';
import { useLayoutEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import CookieConsent from './CookieConsent';

export default function Layout() {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <>
      <Header />
      <Box component="main" sx={{ minHeight: '70vh', minWidth: 0 }}>
        <Outlet />
      </Box>
      <Footer />
      <CookieConsent />
    </>
  );
}
