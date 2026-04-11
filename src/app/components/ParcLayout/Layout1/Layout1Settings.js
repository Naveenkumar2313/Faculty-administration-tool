// leftSidebar.mode meanings:
//   "full"    → panel pinned expanded (PANEL_EXPANDED wide) — default
//   "compact" → panel collapsed to icon strip (PANEL_COLLAPSED wide),
//               hover over panel → auto-expands to full width (peek)
//   "close"   → entire sidebar hidden (used on mobile / md breakpoint)
const Layout1Settings = {
  leftSidebar: {
    show: true,
    mode: "full",
    theme: "purple1", // Light indigo theme for modern sidebar
    bgImgURL: ""
  },
  topbar: {
    show: true,
    fixed: true,
    theme: "whitePurple"
  }
};

export default Layout1Settings;
