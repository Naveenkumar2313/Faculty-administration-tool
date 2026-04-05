import { useEffect, useRef, memo } from "react";
import { Outlet } from "react-router-dom";
import Scrollbar from "react-perfect-scrollbar";
import Box from "@mui/material/Box";
import styled from "@mui/material/styles/styled";
import useTheme from "@mui/material/styles/useTheme";
import useMediaQuery from "@mui/material/useMediaQuery";
import ThemeProvider from "@mui/material/styles/ThemeProvider";

import Layout1Topbar from "./Layout1Topbar";
import Footer from "app/components/Footer";
import { ParcSuspense } from "app/components";
import useSettings from "app/hooks/useSettings";
import SidenavTheme from "app/components/ParcTheme/SidenavTheme/SidenavTheme";
import { topBarHeight } from "app/utils/constant";
import SettingsFab from "app/components/SettingsFab";
import {
  HierarchicalSidenav,
  RAIL_W,
  PANEL_EXPANDED,
  PANEL_COLLAPSED
} from "app/components/HierarchicalSidenav";

// ─── STYLED ──────────────────────────────────────────────────────────────────
const Layout1Root = styled("div")(({ theme }) => ({
  display: "flex",
  background: theme.palette.background.default
}));

const ContentBox = styled("div")(() => ({
  height: "100%",
  display: "flex",
  overflowY: "auto",
  overflowX: "hidden",
  flexDirection: "column",
  justifyContent: "space-between"
}));

const StyledScrollBar = styled(Scrollbar)(() => ({
  height: "100%",
  position: "relative",
  display: "flex",
  flexGrow: "1",
  flexDirection: "column"
}));

const LayoutContainer = styled("div", {
  shouldForwardProp: (prop) => prop !== "marginLeft"
})(({ marginLeft }) => ({
  height: "100vh",
  display: "flex",
  flexGrow: "1",
  flexDirection: "column",
  verticalAlign: "top",
  marginLeft: marginLeft,
  position: "relative",
  overflow: "hidden",
  // Smooth transition matches the panel animation duration
  transition: "margin-left 240ms cubic-bezier(0.4,0,0.2,1)",
  paddingTop: topBarHeight
}));

// ─── LAYOUT ──────────────────────────────────────────────────────────────────
const Layout1 = () => {
  const { settings, updateSettings } = useSettings();
  const { layout1Settings } = settings;
  const topbarTheme = settings.themes[layout1Settings.topbar.theme];
  const {
    leftSidebar: { mode: sidenavMode, show: showSidenav }
  } = layout1Settings;

  const theme = useTheme();
  const isMdScreen = useMediaQuery(theme.breakpoints.down("md"));
  const ref = useRef({ isMdScreen, settings });
  const layoutClasses = `theme-${theme.palette.type}`;

  // Content left margin: rail (always) + panel (expanded or collapsed width)
  const isPinned = sidenavMode === "full";
  const contentMargin =
    showSidenav && sidenavMode !== "close"
      ? `${RAIL_W + (isPinned ? PANEL_EXPANDED : PANEL_COLLAPSED)}px`
      : "0px";

  useEffect(() => {
    let { settings } = ref.current;
    let sidebarMode = settings.layout1Settings.leftSidebar.mode;
    if (settings.layout1Settings.leftSidebar.show) {
      let mode = isMdScreen ? "close" : sidebarMode;
      updateSettings({ layout1Settings: { leftSidebar: { mode } } });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMdScreen]);

  return (
    <Layout1Root className={layoutClasses}>
      {/* ── Two-panel hierarchical sidebar ── */}
      {showSidenav && sidenavMode !== "close" && (
        <SidenavTheme>
          <HierarchicalSidenav />
        </SidenavTheme>
      )}

      {/* Fixed topbar — rendered outside LayoutContainer for full-width */}
      {layout1Settings.topbar.show && layout1Settings.topbar.fixed && (
        <ThemeProvider theme={topbarTheme}>
          <Layout1Topbar fixed={true} className="elevation-z8" />
        </ThemeProvider>
      )}

      <LayoutContainer marginLeft={contentMargin}>

        {/* Scrollbar variant */}
        {settings.perfectScrollbar && (
          <StyledScrollBar>
            {layout1Settings.topbar.show && !layout1Settings.topbar.fixed && (
              <ThemeProvider theme={topbarTheme}>
                <Layout1Topbar />
              </ThemeProvider>
            )}
            <Box flexGrow={1} position="relative">
              <ParcSuspense>
                <Outlet />
              </ParcSuspense>
            </Box>
            {settings.footer.show && !settings.footer.fixed && <Footer />}
          </StyledScrollBar>
        )}

        {/* Default variant */}
        {!settings.perfectScrollbar && (
          <ContentBox>
            {layout1Settings.topbar.show && !layout1Settings.topbar.fixed && (
              <ThemeProvider theme={topbarTheme}>
                <Layout1Topbar />
              </ThemeProvider>
            )}
            <Box flexGrow={1} position="relative">
              <ParcSuspense>
                <Outlet />
              </ParcSuspense>
            </Box>
            {settings.footer.show && !settings.footer.fixed && <Footer />}
          </ContentBox>
        )}

        {settings.footer.show && settings.footer.fixed && <Footer />}
      </LayoutContainer>

      <SettingsFab />
    </Layout1Root>
  );
};

export default memo(Layout1);
