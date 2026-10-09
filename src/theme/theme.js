import { alpha, createTheme } from '@mui/material/styles';

export const getDesignTokens = (mode) => {
  const isDark = mode === 'dark';

  return createTheme({
    palette: {
      mode,
      primary: {
        main: '#5b4cf5',
        light: '#7d72ff',
        dark: '#3d34c7',
        contrastText: '#ffffff',
      },
      secondary: {
        main: '#13b8a6',
        light: '#5ce0d3',
        dark: '#0d8679',
        contrastText: '#ffffff',
      },
      background: {
        default: isDark ? '#08111f' : '#f5f7ff',
        paper: isDark ? '#101b2d' : '#ffffff',
      },
      surface: {
        main: isDark ? '#16243c' : '#eef3ff',
      },
      text: {
        primary: isDark ? '#edf5ff' : '#14213d',
        secondary: isDark ? '#b6c5d9' : '#5a6478',
      },
      success: {
        main: '#1dbf73',
      },
      warning: {
        main: '#f59e0b',
      },
      error: {
        main: '#ef4444',
      },
      border: {
        main: isDark ? '#20304d' : '#dfe7f5',
      },
      divider: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(17,24,39,0.08)',
    },
    shape: {
      borderRadius: 18,
    },
    typography: {
      fontFamily: 'Inter, "Segoe UI", sans-serif',
      h1: { fontWeight: 800, letterSpacing: '-0.06em' },
      h2: { fontWeight: 700, letterSpacing: '-0.05em' },
      h3: { fontWeight: 700, letterSpacing: '-0.04em' },
      h4: { fontWeight: 700, letterSpacing: '-0.03em' },
      h5: { fontWeight: 700, letterSpacing: '-0.02em' },
      h6: { fontWeight: 700 },
      button: { textTransform: 'none', fontWeight: 700 },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            background: isDark ? '#08111f' : '#f5f7ff',
            color: isDark ? '#edf5ff' : '#14213d',
          },
          a: {
            color: 'inherit',
            textDecoration: 'none',
          },
          '*': {
            boxSizing: 'border-box',
          },
          '@media (max-width: 600px)': {
            '.MuiPaper-root.MuiPaper-root, .MuiCard-root.MuiCard-root, .MuiButton-root.MuiButton-root, .MuiOutlinedInput-root.MuiOutlinedInput-root, .MuiChip-root.MuiChip-root': {
              borderRadius: '12px',
            },
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            background: alpha(isDark ? '#0e1a2b' : '#ffffff', 0.8),
            backdropFilter: 'blur(14px)',
            borderBottom: `1px solid ${alpha(isDark ? '#ffffff' : '#0f172a', 0.08)}`,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 20,
            boxShadow: isDark ? '0 8px 28px rgba(0,0,0,0.28)' : '0 8px 24px rgba(148,163,184,0.18)',
            border: `1px solid ${alpha(isDark ? '#ffffff' : '#111827', 0.06)}`,
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            padding: '10px 18px',
            fontWeight: 700,
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 999,
            fontWeight: 600,
          },
        },
      },
    },
  });
};
