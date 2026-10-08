import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

export default function Layout({ mode, onToggleMode }) {
  return (
    <>
      <Header mode={mode} onToggleMode={onToggleMode} />
      <Box component="main" sx={{ minHeight: '70vh' }}>
        <Outlet />
      </Box>
      <Footer />
    </>
  );
}
