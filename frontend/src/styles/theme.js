import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  direction: 'rtl',
  palette: {
    primary: {
      main: '#00A859', // أخضر سعودي
    },
    secondary: {
      main: '#FF6B35', // برتقالي
    },
    background: {
      default: '#F8F9FA',
    },
  },
  typography: {
    fontFamily: '"Cairo", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    body1: {
      fontSize: '1rem',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
  },
});

export default theme;