import React from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import useSettings from "app/hooks/useSettings";

const ParcTheme = ({ children }) => {
  const { settings } = useSettings();
  
  // 1. Try to get the selected theme
  let theme = settings.themes[settings.activeTheme];

  // 2. SAFETY FALLBACK: If theme is missing (undefined), pick the first available one
  if (!theme) {
    const availableKeys = Object.keys(settings.themes);
    if (availableKeys.length > 0) {
      theme = settings.themes[availableKeys[0]];
    }
  }

  // 3. Prevent rendering if no themes exist at all
  if (!theme) {
    console.error("ParcTheme: No themes found in settings.");
    return null; 
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};

export default ParcTheme;