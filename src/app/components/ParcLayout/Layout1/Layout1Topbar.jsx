import { memo } from "react";
import { Link } from "react-router-dom";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import styled from "@mui/material/styles/styled";
import useTheme from "@mui/material/styles/useTheme";
import useMediaQuery from "@mui/material/useMediaQuery";
import Home from "@mui/icons-material/Home";
import Menu from "@mui/icons-material/Menu";
import Person from "@mui/icons-material/Person";
import Settings from "@mui/icons-material/Settings";
import WebAsset from "@mui/icons-material/WebAsset";
import MailOutline from "@mui/icons-material/MailOutline";
import StarOutline from "@mui/icons-material/StarOutline";
import PowerSettingsNew from "@mui/icons-material/PowerSettingsNew";

import { useAuth } from "app/contexts/AuthContext";
import useSettings from "app/hooks/useSettings";
import { NotificationProvider } from "app/contexts/NotificationContext";
import { Span } from "app/components/Typography";
import { ParcMenu, ParcSearchBox } from "app/components";
import { NotificationBar } from "app/components/NotificationBar";
import { topBarHeight } from "app/utils/constant";


// ─── STYLED ──────────────────────────────────────────────────────────────────
const StyledIconButton = styled(IconButton)(({ theme }) => ({
  color: "#4a4f80",
  borderRadius: 10,
  transition: "all 220ms cubic-bezier(0.4,0,0.2,1)",
  "&:hover": {
    background: "rgba(99,102,241,0.08)",
    color: "#6366f1",
    transform: "scale(1.05)",
  },
}));

const TopbarRoot = styled("div")(() => ({
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  zIndex: 1201,
  height: topBarHeight,
  background: "rgba(255,255,255,0.85)",
  backdropFilter: "blur(16px) saturate(180%)",
  borderBottom: "1px solid rgba(130,140,200,0.12)",
  boxShadow: "0 1px 12px rgba(80,70,180,0.06)",
}));

const TopbarContainer = styled("div")(({ theme }) => ({
  padding: "8px",
  paddingLeft: 18,
  paddingRight: 20,
  height: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  [theme.breakpoints.down("sm")]: { paddingLeft: 16, paddingRight: 16 },
  [theme.breakpoints.down("xs")]: { paddingLeft: 14, paddingRight: 16 },
}));

const UserMenu = styled("div")({
  padding: 4,
  display: "flex",
  borderRadius: 24,
  cursor: "pointer",
  alignItems: "center",
  transition: "all 200ms ease",
  "& span": { margin: "0 8px", color: "#3b3f6f", fontWeight: 500 },
  "&:hover": {
    background: "rgba(99,102,241,0.06)",
  },
});

const StyledItem = styled(MenuItem)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  minWidth: 185,
  borderRadius: 8,
  margin: "2px 4px",
  transition: "all 180ms ease",
  "& a": {
    width: "100%",
    display: "flex",
    alignItems: "center",
    textDecoration: "none",
  },
  "& span": { marginRight: "10px", color: "#3b3f6f" },
  "&:hover": {
    background: "rgba(99,102,241,0.08)",
  },
}));

const IconBox = styled("div")(({ theme }) => ({
  display: "inherit",
  [theme.breakpoints.down("md")]: { display: "none !important" },
}));

// ─── COMPONENT ───────────────────────────────────────────────────────────────
const Layout1Topbar = () => {
  const theme = useTheme();
  const { settings, updateSettings } = useSettings();
  const { logout, user } = useAuth();
  const isMdScreen = useMediaQuery(theme.breakpoints.down("md"));

  const updateSidebarMode = (sidebarSettings) => {
    updateSettings({ layout1Settings: { leftSidebar: { ...sidebarSettings } } });
  };

  const handleSidebarToggle = () => {
    let { layout1Settings } = settings;
    let mode;
    if (isMdScreen) {
      mode = layout1Settings.leftSidebar.mode === "close" ? "full" : "close";
    } else {
      mode = layout1Settings.leftSidebar.mode === "full" ? "compact" : "full";
    }
    updateSidebarMode({ mode });
  };

  return (
    <TopbarRoot>
      <TopbarContainer>
        <Box display="flex" alignItems="center">
          <StyledIconButton onClick={handleSidebarToggle}>
            <Menu />
          </StyledIconButton>

          <IconBox>
            <StyledIconButton>
              <MailOutline />
            </StyledIconButton>

            <StyledIconButton>
              <WebAsset />
            </StyledIconButton>

            <StyledIconButton>
              <StarOutline />
            </StyledIconButton>
          </IconBox>
        </Box>

        <Box display="flex" alignItems="center">
          <ParcSearchBox />

          <NotificationProvider>
            <NotificationBar />
          </NotificationProvider>

          <ParcMenu
            menuButton={
              <UserMenu>
                <Span>
                  Hi <strong>{user?.name}</strong>
                </Span>
                <Avatar
                  src={user?.avatar}
                  sx={{
                    cursor: "pointer",
                    width: 34,
                    height: 34,
                    border: "2px solid rgba(99,102,241,0.2)",
                    transition: "all 200ms ease",
                    "&:hover": {
                      borderColor: "rgba(99,102,241,0.5)",
                      boxShadow: "0 0 0 3px rgba(99,102,241,0.1)",
                    },
                  }}
                />
              </UserMenu>
            }>
            <StyledItem>
              <Link to="/">
                <Home />
                <Span sx={{ marginInlineStart: 1 }}>Home</Span>
              </Link>
            </StyledItem>

            <StyledItem>
              <Link to="/hr/profile">
                <Person />
                <Span sx={{ marginInlineStart: 1 }}>Profile</Span>
              </Link>
            </StyledItem>

            <StyledItem>
              <Settings />
              <Span sx={{ marginInlineStart: 1 }}>Settings</Span>
            </StyledItem>

            <StyledItem onClick={logout}>
              <PowerSettingsNew />
              <Span sx={{ marginInlineStart: 1 }}>Logout</Span>
            </StyledItem>
          </ParcMenu>
        </Box>
      </TopbarContainer>
    </TopbarRoot>
  );
};

export default memo(Layout1Topbar);
