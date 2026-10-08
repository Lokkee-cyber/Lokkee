import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { HelmetProvider } from 'react-helmet-async';
import App from './App';
import { getDesignTokens } from './theme/theme';

const getInitialTheme = () => {
  const storedTheme = localStorage.getItem('toolpilot-theme');
  return storedTheme || 'light';
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
