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
      main: '#263238',
    },
    secondary: {
      main: '#4678e6'
    },
    background: {
      default: '#37474f'
    }
  },
  typography: {
    fontFamily: roboto.style.fontFamily,
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
  shadows: shadows.map(() => 'none'),
  components: {
    MuiSelect: {
      defaultProps: {
        color: 'secondary'
      }
    },
    MuiCardContent: {
      variants: [
        {
          props: { variant: 'nopad'},
          style: {
            padding: 0,
            "&:last-child": {
              paddingBottom: 0
            }
          }
        }
      ]
    },
    MuiTable: {
      variants: [
        {
          props: { variant: 'grid'},
          style: {
            "& .MuiTableCell-root": {
              border: "1px solid lightgray",
            }
          }
        }
      ]
    },
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarColor: "#6b6b6b #2b2b2b",
          "&::-webkit-scrollbar, & *::-webkit-scrollbar": {
            backgroundColor: "#2b2b2b",
          },
          "&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb": {
            borderRadius: 8,
            backgroundColor: "#6b6b6b",
            minHeight: 24,
            border: "3px solid #2b2b2b",
          },
          "&::-webkit-scrollbar-thumb:focus, & *::-webkit-scrollbar-thumb:focus": {
            backgroundColor: "#959595",
          },
          "&::-webkit-scrollbar-thumb:active, & *::-webkit-scrollbar-thumb:active": {
            backgroundColor: "#959595",
          },
          "&::-webkit-scrollbar-thumb:hover, & *::-webkit-scrollbar-thumb:hover": {
            backgroundColor: "#959595",
          },
          "&::-webkit-scrollbar-corner, & *::-webkit-scrollbar-corner": {
            backgroundColor: "#2b2b2b",
          },
        },
      },
    },
  },
});

export default theme;
