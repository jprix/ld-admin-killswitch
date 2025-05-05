import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#4f46e5', // LaunchDarkly blue
    },
    secondary: {
      main: '#06b6d4', // Teal accent
    },
    background: {
      default: '#f9fafb', // Light background
    },
  },
  typography: {
    fontFamily: 'Inter, sans-serif',
  },
  shape: {
    borderRadius: 8,
  },
});

export default theme;
