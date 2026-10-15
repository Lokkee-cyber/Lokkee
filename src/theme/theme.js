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
        default: isDark ? '#0b1020' : '#f6f8fd',
        paper: isDark ? '#111a2b' : '#ffffff',
      },
      surface: {
        main: isDark ? '#16243c' : '#eef3ff',
      },
      text: {
        primary: isDark ? '#eff4ff' : '#17233b',
        secondary: isDark ? '#a9b8d0' : '#626f84',
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
            backgroundColor: isDark ? '#0b1020' : '#f6f8fd',
            backgroundImage: isDark
              ? 'radial-gradient(900px circle at 4% 0%, rgba(91,76,245,0.20), transparent 55%), radial-gradient(760px circle at 100% 8%, rgba(19,184,166,0.10), transparent 54%), linear-gradient(180deg, #0b1020 0%, #0e1728 58%, #101827 100%)'
              : 'radial-gradient(900px circle at 4% 0%, rgba(91,76,245,0.13), transparent 55%), radial-gradient(760px circle at 100% 8%, rgba(19,184,166,0.09), transparent 54%), linear-gradient(180deg, #f8f9ff 0%, #f3f6fc 58%, #f8faff 100%)',
            backgroundRepeat: 'no-repeat',
            color: isDark ? '#eff4ff' : '#17233b',
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
            background: alpha(isDark ? '#0e1728' : '#ffffff', 0.88),
            backdropFilter: 'blur(18px)',
            borderBottom: `1px solid ${alpha(isDark ? '#ffffff' : '#17233b', 0.08)}`,
            color: isDark ? '#eff4ff' : '#17233b',
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 18,
            backgroundImage: 'none',
            boxShadow: isDark ? '0 12px 32px rgba(0,0,0,0.24)' : '0 12px 32px rgba(30,45,80,0.075)',
            border: `1px solid ${alpha(isDark ? '#ffffff' : '#17233b', 0.07)}`,
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
              outline: `3px solid ${alpha(isDark ? '#9b91ff' : '#5b4cf5', 0.45)}`,
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
              outline: `3px solid ${alpha(isDark ? '#9b91ff' : '#5b4cf5', 0.45)}`,
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
};
