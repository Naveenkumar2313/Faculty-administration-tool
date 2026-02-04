// src/app/components/ParcLayout/settings.js

// FIX: Corrected casing in path below (parcTheme instead of ParcTheme)
import { themes } from "../parcTheme/initThemes"; 
import layout1Settings from "./Layout1/Layout1Settings";

export const ParcLayoutSettings = {
  activeLayout: "layout1",
  activeTheme: "blue", 
  perfectScrollbar: false,

  themes: themes, // This should now be defined
  layout1Settings, 

  footer: {
    show: true,
    fixed: false,
    theme: "slateDark1" 
  }
};