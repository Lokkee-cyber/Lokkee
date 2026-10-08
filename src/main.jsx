import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { HelmetProvider } from 'react-helmet-async';
import App from './App';
import { getDesignTokens } from './theme/theme';
import { siteConfig } from './config/siteConfig';
import Analytics from './components/Analytics';

const getInitialTheme = () => {
  const storedTheme = localStorage.getItem('toolpilot-theme');
  return storedTheme === 'dark' || storedTheme === 'light' ? storedTheme : 'light';
};

function Root() {
  const [mode, setMode] = React.useState(getInitialTheme());

  React.useEffect(() => {
    localStorage.setItem('toolpilot-theme', mode);
  }, [mode]);

  const theme = React.useMemo(() => getDesignTokens(mode), [mode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <HelmetProvider>
        <BrowserRouter>
          <Analytics measurementId={siteConfig.gaMeasurementId} />
          <App mode={mode} setMode={setMode} />
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
