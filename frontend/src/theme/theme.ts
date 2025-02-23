import { createTheme } from '@mui/material';

export const getTheme = (mode: 'light' | 'dark') => createTheme({
  palette: {
    mode,
    primary: {
      main: '#00ff9f',
      light: '#33ffb2',
      dark: '#00b26f',
    },
    secondary: {
      main: '#ff4081',
      light: '#ff669a',
      dark: '#b22c5a',
    },
    background: {
      default: mode === 'dark' ? '#0a0b0d' : '#f5f5f5',
      paper: mode === 'dark' ? '#1a1b1f' : '#ffffff',
    },
    text: {
      primary: mode === 'dark' ? '#ffffff' : '#0a0b0d',
      secondary: mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          background: mode === 'dark' ? 'rgba(26, 27, 31, 0.8)' : 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(10px)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: mode === 'dark' ? 'rgba(10, 11, 13, 0.8)' : 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(10px)',
        },
      },
    },
  },
});