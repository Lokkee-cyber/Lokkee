import { alpha, createTheme } from '@mui/material/styles';

// Dark-only theme. The site no longer supports a light variant.
export const getDesignTokens = () => createTheme({
  palette: {
    mode: 'dark',
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
      default: '#0a0a0d',
      paper: '#141419',
    },
    surface: {
      main: '#1c1c22',
    },
    charcoal: {
      main: '#1e1e24',
      light: '#26262d',
    },
    fiction: {
      surface: '#161223',
      card: '#221c33',
      accent: '#c7a7ff',
    },
    text: {
      primary: '#f5f5f7',
      secondary: '#a3a3ad',
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
      main: '#2b2b33',
    },
    divider: 'rgba(255,255,255,0.08)',
  },
  shape: {
    borderRadius: 8,
  },
  typography: {
    fontFamily: 'Inter, "Segoe UI", sans-serif',
    h1: { fontSize: 'clamp(2.35rem, 5vw, 4.5rem)', fontWeight: 800, letterSpacing: '-0.055em', lineHeight: 1.03 },
    h2: { fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontWeight: 800, letterSpacing: '-0.045em', lineHeight: 1.08 },
    h3: { fontSize: 'clamp(1.7rem, 3vw, 2.6rem)', fontWeight: 800, letterSpacing: '-0.035em', lineHeight: 1.12 },
    h4: { fontSize: 'clamp(1.4rem, 2.2vw, 2rem)', fontWeight: 750, letterSpacing: '-0.025em', lineHeight: 1.2 },
    h5: { fontSize: 'clamp(1.2rem, 1.8vw, 1.5rem)', fontWeight: 750, letterSpacing: '-0.02em', lineHeight: 1.3 },
    h6: { fontWeight: 750, lineHeight: 1.35 },
    body1: { lineHeight: 1.7 },
    body2: { lineHeight: 1.65 },
    button: { textTransform: 'none', fontWeight: 700 },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          minWidth: 320,
          minHeight: '100vh',
          backgroundColor: '#0a0a0d',
          backgroundImage: 'radial-gradient(900px circle at 4% 0%, rgba(91,76,245,0.10), transparent 55%), linear-gradient(180deg, #0a0a0d 0%, #0d0d12 58%, #0a0a0d 100%)',
          backgroundRepeat: 'no-repeat',
          color: '#f5f5f7',
        },
        html: {
          minWidth: 320,
          scrollBehavior: 'smooth',
        },
        '#root': {
          minHeight: '100vh',
          overflowX: 'clip',
        },
        'img, video, svg': {
          maxWidth: '100%',
        },
        a: {
          color: 'inherit',
          textDecoration: 'none',
        },
        '*': {
          boxSizing: 'border-box',
        },
        '@media (prefers-reduced-motion: reduce)': {
          '*, *::before, *::after': {
            scrollBehavior: 'auto !important',
            animationDuration: '0.01ms !important',
            animationIterationCount: '1 !important',
            transitionDuration: '0.01ms !important',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: alpha('#0d0d12', 0.9),
          backdropFilter: 'blur(18px)',
          borderBottom: `1px solid ${alpha('#ffffff', 0.08)}`,
          color: '#f5f5f7',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 18,
          backgroundImage: 'none',
          boxShadow: '0 12px 32px rgba(0,0,0,0.32)',
          border: `1px solid ${alpha('#ffffff', 0.08)}`,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 11,
          minHeight: 44,
          padding: '10px 18px',
          fontWeight: 700,
          whiteSpace: 'normal',
          lineHeight: 1.25,
          '&:focus-visible': {
            outline: `3px solid ${alpha('#9b91ff', 0.45)}`,
            outlineOffset: 2,
          },
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
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          minWidth: 0,
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderWidth: 2,
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          '&:focus-visible': {
            outline: `3px solid ${alpha('#9b91ff', 0.45)}`,
            outlineOffset: 2,
          },
        },
      },
    },
    MuiTableContainer: {
      styleOverrides: {
        root: {
          maxWidth: '100%',
        },
      },
    },
  },
});
