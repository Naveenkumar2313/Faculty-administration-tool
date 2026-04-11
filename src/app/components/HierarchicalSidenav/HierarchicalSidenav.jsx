import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Box,
  Icon,
  Tooltip,
  styled,
  alpha,
  useTheme,
  keyframes
} from "@mui/material";
import Scrollbar from "react-perfect-scrollbar";

import useSettings from "app/hooks/useSettings";
import { useAuth } from "app/contexts/AuthContext";
import { getNavigationsByRole } from "app/navigations/navigationResolver";
import { topBarHeight } from "app/utils/constant";

// ─── DIMENSIONS ──────────────────────────────────────────────────────────────
export const RAIL_W = 75;
export const PANEL_EXPANDED = 236;
export const PANEL_COLLAPSED = 44;

// ─── DESIGN TOKENS ───────────────────────────────────────────────────────────
const SIDEBAR_COLORS = {
  railBg: "linear-gradient(180deg, #3b3f8f 0%, #4a4fad 40%, #5c5fbf 100%)",
  panelBg: "linear-gradient(180deg, #eef0f8 0%, #f4f5fb 50%, #f8f9ff 100%)",
  panelBorder: "rgba(130, 140, 200, 0.18)",
  railActive: "rgba(255,255,255,0.18)",
  railHover: "rgba(255,255,255,0.12)",
  railText: "rgba(255,255,255,0.55)",
  railTextActive: "#fff",
  accentPrimary: "#6366f1",
  accentGlow: "rgba(99,102,241,0.5)",
  panelText: "#3b3f6f",
  panelTextSecondary: "#7a7eb0",
  panelTextMuted: "#a3a7c9",
  panelHover: "rgba(99,102,241,0.06)",
  panelActiveBg: "rgba(99,102,241,0.10)",
  panelActiveText: "#4f46e5",
  panelSearchBg: "rgba(99,102,241,0.05)",
  panelSearchBorder: "rgba(99,102,241,0.12)",
  panelDivider: "rgba(130,140,200,0.10)",
  moduleIconBg: "rgba(99,102,241,0.08)",
  badgeNewBg: "rgba(16,185,129,0.12)",
  badgeNewText: "#059669",
  badgeBetaBg: "rgba(245,158,11,0.12)",
  badgeBetaText: "#d97706",
  shadowRail: "3px 0 20px rgba(80,70,180,0.12), 1px 0 4px rgba(80,70,180,0.08)",
  shadowPanel: "4px 0 24px rgba(80,70,180,0.08)",
  shadowPanelPeek: "8px 0 40px rgba(80,70,180,0.18)",
};

// ─── KEYFRAMES ───────────────────────────────────────────────────────────────
const fadeSlideIn = keyframes`
  from { opacity: 0; transform: translateX(-8px); }
  to   { opacity: 1; transform: translateX(0); }
`;

const pulseGlow = keyframes`
  0%   { box-shadow: 0 0 0 0 rgba(99,102,241,0.4); }
  70%  { box-shadow: 0 0 0 6px rgba(99,102,241,0); }
  100% { box-shadow: 0 0 0 0 rgba(99,102,241,0); }
`;

const railItemEntrance = keyframes`
  from { opacity: 0; transform: translateY(8px) scale(0.9); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
`;

// ─── RAIL STYLED ─────────────────────────────────────────────────────────────
const RailRoot = styled("div")(() => ({
  position: "fixed",
  top: topBarHeight,
  left: 0,
  width: RAIL_W,
  height: `calc(100vh - ${topBarHeight}px)`,
  background: SIDEBAR_COLORS.railBg,
  borderRight: "none",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  zIndex: 1200,
  overflowX: "hidden",
  boxShadow: SIDEBAR_COLORS.shadowRail,
}));

const RailScroll = styled("div")({
  flex: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  overflowY: "auto",
  overflowX: "hidden",
  width: "100%",
  paddingTop: 12,
  paddingBottom: 12,
  "&::-webkit-scrollbar": { display: "none" },
});

const RailItem = styled("div", {
  shouldForwardProp: (p) => p !== "active" && p !== "animDelay"
})(({ active, animDelay = 0 }) => ({
  position: "relative",
  width: 58,
  height: 58,
  borderRadius: 14,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  marginBottom: 4,
  flexShrink: 0,
  transition: "all 250ms cubic-bezier(0.4,0,0.2,1)",
  color: active ? SIDEBAR_COLORS.railTextActive : SIDEBAR_COLORS.railText,
  background: active ? SIDEBAR_COLORS.railActive : "transparent",
  backdropFilter: active ? "blur(8px)" : "none",
  animation: `${railItemEntrance} 0.4s cubic-bezier(0.16,1,0.3,1) both`,
  animationDelay: `${animDelay}ms`,
  "&:hover": {
    background: SIDEBAR_COLORS.railHover,
    color: "rgba(255,255,255,0.9)",
    transform: "scale(1.06)",
  },
  ...(active && {
    "&::before": {
      content: '""',
      position: "absolute",
      left: -9,
      top: 10,
      bottom: 10,
      width: 3.5,
      borderRadius: "0 4px 4px 0",
      background: "#a5b4fc",
      boxShadow: `0 0 12px ${SIDEBAR_COLORS.accentGlow}`,
      animation: `${pulseGlow} 2.5s ease-in-out infinite`,
    },
  }),
}));

const RailLabel = styled("span")({
  fontSize: 9.5,
  fontWeight: 600,
  letterSpacing: "0.4px",
  textAlign: "center",
  lineHeight: 1,
  textTransform: "uppercase",
  marginTop: 3,
  opacity: 0.85,
});

const RailDivider = styled("div")({
  width: 36,
  height: 1,
  background: "rgba(255,255,255,0.12)",
  margin: "8px 0",
  flexShrink: 0,
  borderRadius: 1,
});

// ─── PANEL STYLED ────────────────────────────────────────────────────────────
const PanelRoot = styled("div", {
  shouldForwardProp: (p) => p !== "isOpen" && p !== "peeking"
})(({ isOpen, peeking }) => ({
  position: "fixed",
  top: topBarHeight,
  left: RAIL_W,
  height: `calc(100vh - ${topBarHeight}px)`,
  width: isOpen ? PANEL_EXPANDED : PANEL_COLLAPSED,
  background: SIDEBAR_COLORS.panelBg,
  borderRight: `1px solid ${SIDEBAR_COLORS.panelBorder}`,
  display: "flex",
  flexDirection: "column",
  zIndex: 1199,
  overflow: "hidden",
  transition: "width 280ms cubic-bezier(0.4,0,0.2,1), box-shadow 280ms ease",
  boxShadow: peeking && !isOpen ? SIDEBAR_COLORS.shadowPanelPeek : SIDEBAR_COLORS.shadowPanel,
  backdropFilter: "blur(12px)",
}));

const PanelHeader = styled("div")(() => ({
  height: 54,
  display: "flex",
  alignItems: "center",
  padding: "0 12px",
  borderBottom: `1px solid ${SIDEBAR_COLORS.panelDivider}`,
  gap: 8,
  flexShrink: 0,
  minWidth: PANEL_EXPANDED,
}));

const PanelSectionName = styled("span")({
  fontSize: 13.5,
  fontWeight: 700,
  color: SIDEBAR_COLORS.panelText,
  flex: 1,
  whiteSpace: "nowrap",
  letterSpacing: "-0.2px",
});

const ToggleBtn = styled("div")(() => ({
  width: 24,
  height: 24,
  borderRadius: 7,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  flexShrink: 0,
  background: SIDEBAR_COLORS.panelSearchBg,
  border: `1px solid ${SIDEBAR_COLORS.panelSearchBorder}`,
  color: SIDEBAR_COLORS.panelTextSecondary,
  transition: "all 220ms cubic-bezier(0.4,0,0.2,1)",
  "&:hover": {
    background: "rgba(99,102,241,0.12)",
    color: SIDEBAR_COLORS.accentPrimary,
    borderColor: "rgba(99,102,241,0.3)",
    transform: "scale(1.1)",
  },
}));

const PanelSearch = styled("div")({
  padding: "10px 12px",
  borderBottom: `1px solid ${SIDEBAR_COLORS.panelDivider}`,
  flexShrink: 0,
  position: "relative",
  minWidth: PANEL_EXPANDED,
});

const SearchInput = styled("input")(() => ({
  width: "100%",
  background: SIDEBAR_COLORS.panelSearchBg,
  border: `1px solid ${SIDEBAR_COLORS.panelSearchBorder}`,
  borderRadius: 8,
  padding: "7px 10px 7px 30px",
  fontSize: 12,
  color: SIDEBAR_COLORS.panelText,
  fontFamily: "inherit",
  outline: "none",
  transition: "all 250ms cubic-bezier(0.4,0,0.2,1)",
  "&::placeholder": { color: SIDEBAR_COLORS.panelTextMuted },
  "&:focus": {
    borderColor: "rgba(99,102,241,0.4)",
    background: "rgba(99,102,241,0.06)",
    boxShadow: "0 0 0 3px rgba(99,102,241,0.08)",
  },
}));

const SearchIconEl = styled(Icon)({
  position: "absolute",
  left: 22,
  top: "50%",
  transform: "translateY(-50%)",
  fontSize: "14px !important",
  color: SIDEBAR_COLORS.panelTextMuted,
  pointerEvents: "none",
});

// ─── MODULE STYLED ───────────────────────────────────────────────────────────
const ModuleHeader = styled("div", {
  shouldForwardProp: (p) => p !== "open"
})(({ open }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "8px 12px",
  cursor: "pointer",
  gap: 8,
  userSelect: "none",
  minWidth: PANEL_EXPANDED,
  borderRadius: 8,
  margin: "2px 6px",
  transition: "all 220ms cubic-bezier(0.4,0,0.2,1)",
  background: open ? SIDEBAR_COLORS.panelHover : "transparent",
  "&:hover": {
    background: SIDEBAR_COLORS.panelHover,
    transform: "translateX(2px)",
  },
}));

const ModuleIconWrap = styled("div")({
  width: 26,
  height: 26,
  borderRadius: 7,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
  background: SIDEBAR_COLORS.moduleIconBg,
  transition: "all 220ms ease",
  "& .MuiIcon-root": {
    fontSize: "14px !important",
    color: SIDEBAR_COLORS.accentPrimary,
  },
});

const ModuleName = styled("span", {
  shouldForwardProp: (p) => p !== "open"
})(({ open }) => ({
  fontSize: 12.5,
  fontWeight: 600,
  color: open ? SIDEBAR_COLORS.panelText : SIDEBAR_COLORS.panelTextSecondary,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  flex: 1,
  transition: "color 220ms ease",
}));

const ModuleRight = styled("div")({
  display: "flex",
  alignItems: "center",
  gap: 5,
  flexShrink: 0,
});

const ModuleCount = styled("span", {
  shouldForwardProp: (p) => p !== "open"
})(({ open }) => ({
  fontSize: "9.5px",
  fontWeight: 600,
  color: open ? SIDEBAR_COLORS.accentPrimary : SIDEBAR_COLORS.panelTextMuted,
  background: open ? "rgba(99,102,241,0.10)" : "rgba(99,102,241,0.05)",
  padding: "2px 6px",
  borderRadius: 20,
  transition: "all 220ms ease",
}));

const ChevronIcon = styled(Icon, {
  shouldForwardProp: (p) => p !== "open"
})(({ open }) => ({
  fontSize: "14px !important",
  color: open ? SIDEBAR_COLORS.panelTextSecondary : SIDEBAR_COLORS.panelTextMuted,
  transition: "transform 280ms cubic-bezier(0.4,0,0.2,1), color 220ms ease",
  transform: open ? "rotate(90deg)" : "rotate(0deg)",
  flexShrink: 0,
}));

const PagesContainer = styled("div")({
  overflow: "hidden",
  transition: "max-height 320ms cubic-bezier(0.4,0,0.2,1)",
});

// ─── PAGE ITEM ───────────────────────────────────────────────────────────────
const StyledPageLink = styled(NavLink)(() => ({
  display: "flex",
  alignItems: "center",
  gap: 8,
  padding: "6px 12px 6px 46px",
  cursor: "pointer",
  position: "relative",
  textDecoration: "none",
  minWidth: PANEL_EXPANDED,
  borderRadius: 6,
  margin: "1px 6px",
  transition: "all 220ms cubic-bezier(0.4,0,0.2,1)",
  color: SIDEBAR_COLORS.panelTextSecondary,
  "&::before": {
    content: '""',
    position: "absolute",
    left: 34,
    top: "50%",
    transform: "translateY(-50%)",
    width: 4,
    height: 4,
    borderRadius: "50%",
    background: SIDEBAR_COLORS.panelTextMuted,
    transition: "all 250ms cubic-bezier(0.4,0,0.2,1)",
  },
  "&:hover": {
    background: SIDEBAR_COLORS.panelHover,
    color: SIDEBAR_COLORS.panelText,
    transform: "translateX(3px)",
    "&::before": {
      background: SIDEBAR_COLORS.accentPrimary,
      transform: "translateY(-50%) scale(1.3)",
    },
  },
  "&.active": {
    background: SIDEBAR_COLORS.panelActiveBg,
    color: SIDEBAR_COLORS.panelActiveText,
    fontWeight: 600,
    "&::before": {
      background: SIDEBAR_COLORS.accentPrimary,
      width: 5,
      height: 5,
      boxShadow: `0 0 8px ${SIDEBAR_COLORS.accentGlow}`,
    },
    "&::after": {
      content: '""',
      position: "absolute",
      left: 0,
      top: 5,
      bottom: 5,
      width: 2.5,
      borderRadius: "0 3px 3px 0",
      background: SIDEBAR_COLORS.accentPrimary,
      boxShadow: `0 0 10px ${SIDEBAR_COLORS.accentGlow}`,
    },
  },
}));

const PageName = styled("span")({
  fontSize: 12,
  fontWeight: 500,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  flex: 1,
  lineHeight: 1,
});

const PageBadge = styled("span", {
  shouldForwardProp: (p) => p !== "variant"
})(({ variant }) => ({
  fontSize: "8.5px",
  fontWeight: 700,
  padding: "2px 6px",
  borderRadius: 20,
  letterSpacing: "0.4px",
  flexShrink: 0,
  ...(variant === "new" && {
    background: SIDEBAR_COLORS.badgeNewBg,
    color: SIDEBAR_COLORS.badgeNewText,
  }),
  ...(variant === "beta" && {
    background: SIDEBAR_COLORS.badgeBetaBg,
    color: SIDEBAR_COLORS.badgeBetaText,
  }),
}));

// Collapsed icon-only module row
const CollapsedModuleRow = styled("div", {
  shouldForwardProp: (p) => p !== "hasActive"
})(({ hasActive }) => ({
  width: PANEL_COLLAPSED,
  height: 40,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  flexShrink: 0,
  borderRadius: 6,
  margin: "1px 0",
  transition: "all 220ms cubic-bezier(0.4,0,0.2,1)",
  "&:hover": {
    background: SIDEBAR_COLORS.panelHover,
    transform: "scale(1.08)",
  },
  ...(hasActive && {
    "& .mod-icon-wrap": {
      outline: `2px solid ${SIDEBAR_COLORS.accentPrimary}`,
      outlineOffset: 2,
      boxShadow: `0 0 8px rgba(99,102,241,0.25)`,
    },
  }),
}));

// ─── COMPONENT ───────────────────────────────────────────────────────────────
export default function HierarchicalSidenav() {
  const theme = useTheme();
  const location = useLocation();
  const { settings, updateSettings } = useSettings();
  const { user } = useAuth();

  // Role-based nav — resolver handles all 7 roles
  const allNavItems = getNavigationsByRole(user?.role);
  const sections = useMemo(
    () => allNavItems.filter(n => n.type === "section"),
    [allNavItems]
  );
  const directItems = useMemo(
    () => allNavItems.filter(n => n.type === "item"),
    [allNavItems]
  );

  // Panel pinned state from settings: "full" = pinned open, "compact" = collapsed
  const sidenavMode = settings.layout1Settings?.leftSidebar?.mode || "full";
  const isPinned = sidenavMode === "full";

  // Hover-to-peek state (only relevant when collapsed)
  const [peeking, setPeeking] = useState(false);
  const peekTimer = useRef(null);

  const isOpen = isPinned || peeking;

  // Track when user manually selects a section via clicking rail icons
  const manuallySelected = useRef(false);

  // Helper: detect which section is active from current path
  const detectSectionFromPath = useCallback((pathname) => {
    for (const sec of sections) {
      for (const mod of sec.modules || []) {
        for (const page of mod.pages || []) {
          if (pathname === page.path) return sec.id;
        }
      }
    }
    return null;
  }, [sections]);

  const [activeSectionId, setActiveSectionId] = useState(() => {
    return detectSectionFromPath(location.pathname) || sections[0]?.id || null;
  });
  const [openModules, setOpenModules] = useState(() => {
    const initId = detectSectionFromPath(location.pathname) || sections[0]?.id || null;
    const sec = sections.find(s => s.id === initId);
    return new Set(sec?.modules?.[0]?.id ? [sec.modules[0].id] : []);
  });
  const [searchQuery, setSearchQuery] = useState("");

  // Track previous pathname to only react to actual navigation
  const prevPathRef = useRef(location.pathname);

  // Update active section only when URL actually changes
  useEffect(() => {
    if (prevPathRef.current === location.pathname) return;
    prevPathRef.current = location.pathname;

    if (manuallySelected.current) {
      manuallySelected.current = false;
      return;
    }

    const detected = detectSectionFromPath(location.pathname);
    if (detected && detected !== activeSectionId) {
      setActiveSectionId(detected);
      const sec = sections.find(s => s.id === detected);
      if (sec?.modules?.length) {
        setOpenModules(new Set([sec.modules[0].id]));
      }
    }
  }, [location.pathname, detectSectionFromPath, activeSectionId, sections]);

  // Switch section from rail icon click
  const switchSection = (sectionId) => {
    if (sectionId === activeSectionId) return;
    manuallySelected.current = true;
    setActiveSectionId(sectionId);
    setSearchQuery("");
    const sec = sections.find(s => s.id === sectionId);
    if (sec?.modules?.length) {
      setOpenModules(new Set([sec.modules[0].id]));
    }
  };

  const toggleModule = (moduleId) => {
    setOpenModules(prev => {
      const next = new Set(prev);
      if (next.has(moduleId)) next.delete(moduleId);
      else next.add(moduleId);
      return next;
    });
  };

  const togglePin = () => {
    const newMode = isPinned ? "compact" : "full";
    updateSettings({ layout1Settings: { leftSidebar: { mode: newMode } } });
    setPeeking(false);
  };

  const handlePanelMouseEnter = () => {
    if (!isPinned) {
      clearTimeout(peekTimer.current);
      setPeeking(true);
    }
  };

  const handlePanelMouseLeave = () => {
    if (!isPinned) {
      peekTimer.current = setTimeout(() => setPeeking(false), 180);
    }
  };

  useEffect(() => () => clearTimeout(peekTimer.current), []);

  // Active section data
  const activeSection = sections.find(s => s.id === activeSectionId);
  const modules = activeSection?.modules || [];

  // Search filter
  const q = searchQuery.toLowerCase().trim();
  const filteredModules = q
    ? modules
      .map(mod => ({ ...mod, pages: mod.pages.filter(p => p.name.toLowerCase().includes(q)) }))
      .filter(mod => mod.pages.length > 0)
    : modules;

  // Calculate animation delay for rail items
  let railAnimIndex = 0;

  return (
    <>
      {/* ══ ICON RAIL ══ */}
      <RailRoot>
        <RailScroll>
          {/* Direct items (Dashboard, etc.) */}
          {directItems.map((item) => {
            const delay = railAnimIndex++ * 60;
            return (
              <Tooltip key={item.id} title={item.name} placement="right" arrow>
                <RailItem
                  active={location.pathname === item.path ? 1 : 0}
                  animDelay={delay}
                >
                  <NavLink
                    to={item.path}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      textDecoration: "none",
                      color: "inherit",
                      width: "100%",
                      height: "100%",
                      justifyContent: "center",
                    }}
                  >
                    <Icon sx={{ fontSize: "18px !important" }}>{item.icon}</Icon>
                    <RailLabel>{item.name}</RailLabel>
                  </NavLink>
                </RailItem>
              </Tooltip>
            );
          })}

          {directItems.length > 0 && <RailDivider />}

          {/* Section icons */}
          {sections.map((sec) => {
            const delay = railAnimIndex++ * 60;
            return (
              <Tooltip key={sec.id} title={sec.name} placement="right" arrow>
                <RailItem
                  active={activeSectionId === sec.id ? 1 : 0}
                  animDelay={delay}
                  onClick={() => switchSection(sec.id)}
                >
                  <Icon sx={{ fontSize: "18px !important" }}>{sec.icon}</Icon>
                  <RailLabel>{sec.name}</RailLabel>
                </RailItem>
              </Tooltip>
            );
          })}
        </RailScroll>
      </RailRoot>

      {/* ══ MODULE / PAGE PANEL ══ */}
      <PanelRoot
        isOpen={isOpen ? 1 : 0}
        peeking={peeking ? 1 : 0}
        onMouseEnter={handlePanelMouseEnter}
        onMouseLeave={handlePanelMouseLeave}
      >
        {/* Panel header */}
        <PanelHeader>
          <Icon sx={{
            fontSize: "16px !important",
            color: SIDEBAR_COLORS.accentPrimary,
            flexShrink: 0,
          }}>
            {activeSection?.icon || "folder"}
          </Icon>
          <PanelSectionName sx={{
            opacity: isOpen ? 1 : 0,
            transition: "opacity 250ms cubic-bezier(0.4,0,0.2,1)",
          }}>
            {activeSection?.name || ""}
          </PanelSectionName>

          <Tooltip title={isPinned ? "Collapse panel" : "Pin expanded"} placement="right" arrow>
            <ToggleBtn onClick={togglePin}>
              <Icon sx={{ fontSize: "12px !important" }}>
                {isPinned ? "chevron_left" : "chevron_right"}
              </Icon>
            </ToggleBtn>
          </Tooltip>
        </PanelHeader>

        {/* Search bar — only shown when panel is open */}
        {isOpen && (
          <PanelSearch>
            <SearchIconEl>search</SearchIconEl>
            <SearchInput
              type="text"
              placeholder="Search pages…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </PanelSearch>
        )}

        {/* Scrollable content */}
        <Scrollbar options={{ suppressScrollX: true }} style={{ flex: 1 }}>
          <Box pb={2} pt={1}>
            {isOpen
              ? /* ── EXPANDED: full module + pages list ── */
              filteredModules.map((mod, modIndex) => {
                const isModOpen = openModules.has(mod.id) || (q && mod.pages.length > 0);
                return (
                  <Box
                    key={mod.id}
                    sx={{
                      animation: `${fadeSlideIn} 0.3s cubic-bezier(0.16,1,0.3,1) both`,
                      animationDelay: `${modIndex * 50}ms`,
                    }}
                  >
                    <ModuleHeader open={isModOpen ? 1 : 0} onClick={() => toggleModule(mod.id)}>
                      <ModuleIconWrap className="mod-icon-wrap">
                        <Icon>{mod.icon}</Icon>
                      </ModuleIconWrap>
                      <ModuleName open={isModOpen ? 1 : 0}>{mod.name}</ModuleName>
                      <ModuleRight>
                        <ModuleCount open={isModOpen ? 1 : 0}>{mod.pages.length}</ModuleCount>
                        <ChevronIcon open={isModOpen ? 1 : 0}>chevron_right</ChevronIcon>
                      </ModuleRight>
                    </ModuleHeader>

                    <PagesContainer
                      style={{ maxHeight: isModOpen ? mod.pages.length * 34 + "px" : "0px" }}
                    >
                      {mod.pages.map((page, pageIndex) => (
                        <StyledPageLink
                          key={page.path}
                          to={page.path}
                          style={{
                            animationDelay: isModOpen ? `${pageIndex * 30}ms` : "0ms",
                          }}
                        >
                          <PageName>{page.name}</PageName>
                          {page.badge && (
                            <PageBadge variant={page.badge}>
                              {page.badge.toUpperCase()}
                            </PageBadge>
                          )}
                        </StyledPageLink>
                      ))}
                    </PagesContainer>
                  </Box>
                );
              })
              : /* ── COLLAPSED: icon-only module rows ── */
              modules.map((mod) => {
                const hasActive = mod.pages.some(p => location.pathname === p.path);
                return (
                  <Tooltip key={mod.id} title={mod.name} placement="right" arrow>
                    <CollapsedModuleRow
                      hasActive={hasActive ? 1 : 0}
                      onClick={() => {
                        toggleModule(mod.id);
                        if (!isPinned) setPeeking(true);
                      }}
                    >
                      <ModuleIconWrap className="mod-icon-wrap">
                        <Icon>{mod.icon}</Icon>
                      </ModuleIconWrap>
                    </CollapsedModuleRow>
                  </Tooltip>
                );
              })}
          </Box>
        </Scrollbar>
      </PanelRoot>
    </>
  );
}
