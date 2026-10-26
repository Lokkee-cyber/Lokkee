import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { HelmetProvider } from 'react-helmet-async';
import App from './App';
import { getDesignTokens } from './theme/theme';
import { siteConfig } from './config/siteConfig';
import Analytics from './components/Analytics';

// The site ships a single dark theme; no light-mode variant exists.
const theme = getDesignTokens();

function Root() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <HelmetProvider>
        <BrowserRouter>
          <Analytics measurementId={siteConfig.gaMeasurementId} />
          <App />
        </BrowserRouter>
      </HelmetProvider>
    </ThemeProvider>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
);
