import { Roboto } from '@next/font/google';
import { createTheme } from '@mui/material/styles';
import shadows, { Shadows } from '@mui/material/styles/shadows';
import { red } from '@mui/material/colors';

export const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
  fallback: ['Helvetica', 'Arial', 'sans-serif'],
});

// Create a theme instance.
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#263238'
    },
    background: {
      default: '#37474f'
    }
  },
  typography: {
    fontFamily: roboto.style.fontFamily,
  },
  shadows: shadows.map(() => 'none'),
});

export default theme;
