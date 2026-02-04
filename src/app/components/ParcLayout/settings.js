import { themes } from "../parcTheme/initThemes";
import layout1Settings from "./Layout1/Layout1Settings";

export const ParcLayoutSettings = {
  activeLayout: "layout1",
  activeTheme: "blue", // Default theme
  perfectScrollbar: false,
  
  themes: themes, // <--- MUST BE PRESENT
  layout1Settings, 

  secondarySidebar: {
    show: true,
    open: false,
    theme: "slateDark1"
  },
  footer: {
    show: true,
    fixed: false,
    theme: "slateDark1"
  }
};