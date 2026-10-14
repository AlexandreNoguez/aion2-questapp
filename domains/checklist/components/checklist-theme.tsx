"use client";

import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import type { PropsWithChildren } from "react";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#4bd6d0", contrastText: "#07121c" },
    secondary: { main: "#f5c45e" },
    background: { default: "#07121c", paper: "#0d1b27" },
    text: { primary: "#f4f8fb", secondary: "#96aebe" },
    divider: "rgba(149, 183, 203, 0.14)",
  },
  shape: { borderRadius: 16 },
  typography: { fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif", button: { textTransform: "none", fontWeight: 700 } },
  components: {
    MuiButtonBase: { defaultProps: { disableRipple: true } },
    MuiPaper: { styleOverrides: { root: { backgroundImage: "none" } } },
  },
});

export function ChecklistTheme({ children }: PropsWithChildren) {
  return <ThemeProvider theme={theme}><CssBaseline />{children}</ThemeProvider>;
}
