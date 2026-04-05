// leftSidebar.mode meanings:
//   "full"    → panel pinned expanded (PANEL_EXPANDED wide) — default
//   "compact" → panel collapsed to icon strip (PANEL_COLLAPSED wide),
//               hover over panel → auto-expands to full width (peek)
//   "close"   → entire sidebar hidden (used on mobile / md breakpoint)
const Layout1Settings = {
  leftSidebar: {
    show: true,
    mode: "full",
    theme: "slateDark1", // Sidenav theme key from themeColors.js
    bgImgURL: "/assets/images/sidebar/sidebar-bg-dark.jpg"
  },
  topbar: {
    show: true,
    fixed: true,
    theme: "whiteBlue"
  }
};

export default Layout1Settings;
