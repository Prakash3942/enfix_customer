import { createTheme } from "@mui/material/styles";
import { red } from "@mui/material/colors";
import {colors} from "./colors";

// Create a theme instance.
const theme = createTheme({
  palette: {
    primary: {
      main: colors.primary,
    },
    secondary: {
      main:  colors.secondary,
    },
    error: {
      main: red.A400,
    },
    background: {
      paper: '#F6F7F9'
    }
  },
  typography: {
    fontFamily: "'IBM Plex Sans', sans-serif;",
    fontWeightLight: 300,
    fontWeightRegular: 300,
    fontWeightMedium: 500,
    fontWeightBold: 600,
    h1: {
      fontWeight: 600,
      fontSize: "64px",
      letterSpacing: "-0.24px",
    },
    h2: {
      fontWeight: 600,
      fontSize: 29,
      letterSpacing: "-0.24px",
    },
    h3: {
      fontWeight: 600,
      fontSize: 24,
      letterSpacing: "-0.06px",
    },
    h4: {
      fontWeight: 600,
      fontSize: 20,
      letterSpacing: "-0.06px",
    },
    h5: {
      fontWeight: 500,
      fontSize: 16,
      letterSpacing: "-0.05px",
    },
    h6: {
      fontWeight: 500,
      fontSize: 14,
      letterSpacing: "-0.05px",
    },
    overline: {
      fontWeight: 400,
    },
    subtitle1: {
      fontWeight: 400,
      fontSize: "16px",
      lineHeight: "20px",
      letterSpacing: "0.5px",
    },
    subtitle2: {
      fontWeight: 300,
      fontSize: "12px",
      lineHeight: "14.71px",
      letterSpacing: "0.4px",
    },
    body1: {
      fontWeight: 400,
      fontSize: "1rem",
      lineHeight: 1.5,
      letterSpacing: "0.00938em",
    },
    body2: {
      fontWeight: 400,
      fontSize: "0.875rem",
      lineHeight: 1.43,
      letterSpacing: "0.01071em",
    },
    button: {
      fontWeight: 400,
      textTransform: "capitalize",
    },
  },
});

export default theme;
