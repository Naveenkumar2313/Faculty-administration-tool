import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box, Grid, Card, Typography, Button, IconButton,
  List, ListItem, ListItemIcon, ListItemText, Divider,
  Avatar, Chip, LinearProgress, Badge
} from "@mui/material";
import {
  Group, AssignmentTurnedIn, AttachMoney, Warning,
  Gavel, TrendingUp, NotificationsActive,
  DateRange, Description, AssignmentLate, School,
  ArrowForward, MoreVert, CheckCircle, Circle,
  KeyboardArrowUp, KeyboardArrowDown
} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import ReactEcharts from "echarts-for-react";

/* ============================================================
   DESIGN SYSTEM — Modern "Soft Indigo" premium admin theme
   Light, airy palette with vibrant accent colors
   ============================================================ */

const COLORS = {
  bg: "#f6f7fb",
  surface: "#ffffff",
  surfaceHover: "#fafbff",
  border: "#e8eaf0",
  borderHover: "rgba(99,102,241,0.3)",
  accent: "#6366F1",
  accentSoft: "rgba(99,102,241,0.10)",
  accentGlow: "rgba(99,102,241,0.25)",
  success: "#10B981",
  successSoft: "rgba(16,185,129,0.10)",
  warning: "#F59E0B",
  warningSoft: "rgba(245,158,11,0.10)",
  danger: "#EF4444",
  dangerSoft: "rgba(239,68,68,0.10)",
  pink: "#EC4899",
  pinkSoft: "rgba(236,72,153,0.10)",
  purple: "#8B5CF6",
  purpleSoft: "rgba(139,92,246,0.10)",
  teal: "#14B8A6",
  tealSoft: "rgba(20,184,166,0.10)",
  textPrimary: "#1e1b4b",
  textSecondary: "#6b7094",
  textMuted: "#9ca0bf",
};

const fontMono = "'JetBrains Mono', 'Roboto Mono', monospace";
const fontSans = "'DM Sans', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif";

/* ---- Google Fonts loader ---- */
const GoogleFonts = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;600&display=swap');
    * { box-sizing: border-box; }
    ::-webkit-scrollbar { width: 5px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: ${COLORS.border}; border-radius: 4px; }
    ::-webkit-scrollbar-thumb:hover { background: ${COLORS.textMuted}; }
    @keyframes pulseRing {
      0%   { box-shadow: 0 0 0 0 ${COLORS.dangerSoft}; }
      70%  { box-shadow: 0 0 0 8px transparent; }
      100% { box-shadow: 0 0 0 0 transparent; }
    }
    @keyframes fadeSlideUp {
      from { opacity: 0; transform: translateY(16px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes scaleIn {
      from { opacity: 0; transform: scale(0.95); }
      to   { opacity: 1; transform: scale(1); }
    }
    .stat-card { animation: fadeSlideUp 0.5s cubic-bezier(0.16,1,0.3,1) both; }
    .stat-card:nth-child(1) { animation-delay: 0.05s; }
    .stat-card:nth-child(2) { animation-delay: 0.10s; }
    .stat-card:nth-child(3) { animation-delay: 0.15s; }
    .stat-card:nth-child(4) { animation-delay: 0.20s; }
    .stat-card:nth-child(5) { animation-delay: 0.25s; }
    .stat-card:nth-child(6) { animation-delay: 0.30s; }
    .chart-card { animation: scaleIn 0.5s cubic-bezier(0.16,1,0.3,1) both; }
    .chart-card:nth-child(1) { animation-delay: 0.15s; }
    .chart-card:nth-child(2) { animation-delay: 0.22s; }
    .chart-card:nth-child(3) { animation-delay: 0.29s; }
  `}</style>
);

/* ---- Reusable Surface Card ---- */
const SCard = ({ children, sx = {}, className = "", ...props }) => (
  <Box
    className={className}
    sx={{
      background: COLORS.surface,
      border: `1px solid ${COLORS.border}`,
      borderRadius: "16px",
      transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
      boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)",
      "&:hover": {
        borderColor: COLORS.borderHover,
        boxShadow: `0 4px 20px rgba(99,102,241,0.08), 0 1px 4px rgba(0,0,0,0.04)`,
        transform: "translateY(-1px)",
      },
      ...sx,
    }}
    {...props}
  >
    {children}
  </Box>
);

/* ---- Section Header inside cards ---- */
const CardHeader = ({ title, subtitle, action }) => (
  <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2.5}>
    <Box>
      <Typography sx={{ fontFamily: fontSans, fontWeight: 600, fontSize: "0.92rem", color: COLORS.textPrimary, letterSpacing: "-0.01em" }}>
        {title}
      </Typography>
      {subtitle && (
        <Typography sx={{ fontFamily: fontSans, fontSize: "0.74rem", color: COLORS.textSecondary, mt: 0.3 }}>
          {subtitle}
        </Typography>
      )}
    </Box>
    {action || (
      <IconButton
        size="small"
        sx={{
          color: COLORS.textMuted,
          borderRadius: 2,
          transition: "all 200ms ease",
          "&:hover": { color: COLORS.accent, background: COLORS.accentSoft },
        }}
      >
        <MoreVert fontSize="small" />
      </IconButton>
    )}
  </Box>
);

/* ---- Delta badge (for stats) ---- */
const DeltaBadge = ({ delta, up }) => (
  <Box display="flex" alignItems="center" gap={0.3}
    sx={{
      px: 0.8, py: 0.3, borderRadius: "8px",
      bgcolor: up ? COLORS.successSoft : COLORS.dangerSoft,
      transition: "all 200ms ease",
    }}>
    {up ? <KeyboardArrowUp sx={{ fontSize: 14, color: COLORS.success }} /> : <KeyboardArrowDown sx={{ fontSize: 14, color: COLORS.danger }} />}
    <Typography sx={{ fontFamily: fontMono, fontSize: "0.68rem", fontWeight: 600, color: up ? COLORS.success : COLORS.danger }}>
      {delta}
    </Typography>
  </Box>
);

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  /* ---- Summary Stats ---- */
  const stats = [
    { label: "Active Faculty", value: "142", delta: "4.2%", up: true, icon: Group, accent: COLORS.accent, soft: COLORS.accentSoft },
    { label: "Pending Approvals", value: "28", delta: "2.1%", up: false, icon: AssignmentTurnedIn, accent: COLORS.warning, soft: COLORS.warningSoft },
    { label: "Leave Requests", value: "12", delta: "8.3%", up: false, icon: DateRange, accent: COLORS.pink, soft: COLORS.pinkSoft },
    { label: "Reimbursements", value: "8", delta: "12%", up: true, icon: AttachMoney, accent: COLORS.success, soft: COLORS.successSoft },
    { label: "Open Grievances", value: "3", delta: "1 new", up: false, icon: Warning, accent: COLORS.danger, soft: COLORS.dangerSoft },
    { label: "Policy Compliance", value: "94%", delta: "1.5%", up: true, icon: Gavel, accent: COLORS.purple, soft: COLORS.purpleSoft },
  ];

  /* ---- Charts ---- */
  const facultyDist = {
    backgroundColor: "transparent",
    color: [COLORS.accent, COLORS.pink, COLORS.purple, COLORS.success, COLORS.warning],
    tooltip: { trigger: "item", backgroundColor: COLORS.surface, borderColor: COLORS.border, textStyle: { color: COLORS.textPrimary, fontFamily: fontSans, fontSize: 12 }, borderRadius: 8 },
    legend: { bottom: 0, left: "center", textStyle: { color: COLORS.textSecondary, fontFamily: fontSans, fontSize: 11 } },
    series: [{
      name: "Faculty",
      type: "pie",
      radius: ["44%", "72%"],
      center: ["50%", "44%"],
      avoidLabelOverlap: false,
      itemStyle: { borderRadius: 10, borderColor: COLORS.surface, borderWidth: 3 },
      label: { show: false },
      emphasis: {
        scaleSize: 8,
      },
      data: [
        { value: 45, name: "CSE" }, { value: 35, name: "ECE" },
        { value: 25, name: "Mech" }, { value: 20, name: "Civil" }, { value: 17, name: "Science" }
      ]
    }]
  };

  const leaveTrends = {
    backgroundColor: "transparent",
    grid: { top: 10, bottom: 24, left: 8, right: 8, containLabel: true },
    tooltip: { trigger: "axis", backgroundColor: COLORS.surface, borderColor: COLORS.border, textStyle: { color: COLORS.textPrimary, fontFamily: fontSans, fontSize: 12 }, borderRadius: 8 },
    xAxis: { type: "category", data: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"], axisLabel: { color: COLORS.textSecondary, fontFamily: fontSans, fontSize: 11 }, axisLine: { lineStyle: { color: COLORS.border } }, axisTick: { show: false } },
    yAxis: { type: "value", splitLine: { lineStyle: { color: COLORS.border, type: "dashed" } }, axisLabel: { color: COLORS.textSecondary, fontFamily: fontSans, fontSize: 11 } },
    series: [{
      data: [12, 18, 15, 25, 10, 8],
      type: "bar",
      itemStyle: {
        color: {
          type: "linear", x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [{ offset: 0, color: COLORS.accent }, { offset: 1, color: "rgba(99,102,241,0.15)" }]
        },
        borderRadius: [6, 6, 0, 0]
      },
      barWidth: "45%",
      emphasis: {
        itemStyle: {
          color: {
            type: "linear", x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [{ offset: 0, color: "#818cf8" }, { offset: 1, color: "rgba(99,102,241,0.3)" }]
          },
        },
      },
    }]
  };

  const budgetOption = {
    backgroundColor: "transparent",
    grid: { top: 16, bottom: 36, left: 8, right: 8, containLabel: true },
    tooltip: { trigger: "axis", backgroundColor: COLORS.surface, borderColor: COLORS.border, textStyle: { color: COLORS.textPrimary, fontFamily: fontSans, fontSize: 12 }, borderRadius: 8 },
    legend: { bottom: 0, textStyle: { color: COLORS.textSecondary, fontFamily: fontSans, fontSize: 11 } },
    xAxis: { type: "category", data: ["Q1", "Q2", "Q3", "Q4"], axisLabel: { color: COLORS.textSecondary, fontFamily: fontSans, fontSize: 11 }, axisLine: { lineStyle: { color: COLORS.border } }, axisTick: { show: false } },
    yAxis: { type: "value", splitLine: { lineStyle: { color: COLORS.border, type: "dashed" } }, axisLabel: { color: COLORS.textSecondary, fontFamily: fontSans, fontSize: 11 } },
    series: [
      {
        name: "Allocated", type: "line", data: [50, 50, 50, 50],
        itemStyle: { color: COLORS.textMuted }, lineStyle: { color: COLORS.textMuted, type: "dashed", width: 1.5 },
        symbol: "none"
      },
      {
        name: "Utilized", type: "line", smooth: true, data: [12, 28, 35, 42],
        itemStyle: { color: COLORS.success },
        lineStyle: { color: COLORS.success, width: 2.5 },
        areaStyle: { color: { type: "linear", x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: "rgba(16,185,129,0.18)" }, { offset: 1, color: "rgba(16,185,129,0)" }] } },
        symbol: "circle", symbolSize: 7
      }
    ]
  };

  const researchOption = {
    backgroundColor: "transparent",
    grid: { top: 10, bottom: 10, left: 8, right: 16, containLabel: true },
    tooltip: { trigger: "axis", backgroundColor: COLORS.surface, borderColor: COLORS.border, textStyle: { color: COLORS.textPrimary, fontFamily: fontSans, fontSize: 12 }, borderRadius: 8 },
    xAxis: { type: "value", splitLine: { lineStyle: { color: COLORS.border, type: "dashed" } }, axisLabel: { color: COLORS.textSecondary, fontFamily: fontSans, fontSize: 11 } },
    yAxis: { type: "category", data: ["Civil", "Mech", "ECE", "AI&DS", "CSE"], axisLabel: { color: COLORS.textSecondary, fontFamily: fontSans, fontSize: 11 }, axisLine: { show: false }, axisTick: { show: false } },
    series: [{
      name: "Publications",
      type: "bar",
      data: [12, 19, 23, 28, 42],
      itemStyle: {
        color: (params) => {
          const palette = [COLORS.teal, COLORS.purple, COLORS.pink, COLORS.warning, COLORS.accent];
          return { type: "linear", x: 0, y: 0, x2: 1, y2: 0, colorStops: [{ offset: 0, color: "rgba(99,102,241,0.15)" }, { offset: 1, color: palette[params.dataIndex] }] };
        },
        borderRadius: [0, 6, 6, 0]
      },
      barWidth: "55%",
      label: { show: true, position: "right", color: COLORS.textSecondary, fontFamily: fontMono, fontSize: 11, fontWeight: 600 }
    }]
  };

  /* ---- Alerts ---- */
  const alerts = [
    { text: "3 faculty probation periods ending in 30 days", icon: AssignmentLate, color: COLORS.warning, tag: "HR" },
    { text: "Service bond expiring: Dr. A. Kumar (next week)", icon: Description, color: COLORS.danger, tag: "Legal" },
    { text: "IT Policy pending renewal approval", icon: Gavel, color: COLORS.accent, tag: "Policy" },
    { text: "PBAS submissions overdue — Civil Dept.", icon: AssignmentTurnedIn, color: COLORS.textSecondary, tag: "Academic" },
  ];

  /* ---- Quick Actions ---- */
  const actions = [
    { label: "Approve Leaves", icon: DateRange, color: COLORS.accent, path: "/admin/hr/leaves" },
    { label: "Process Claims", icon: AttachMoney, color: COLORS.success, path: "/admin/finance/claims" },
    { label: "Review Grievances", icon: Warning, color: COLORS.danger, path: "/admin/grievance/queue" },
    { label: "Generate Reports", icon: School, color: COLORS.purple, path: "/admin/reports" },
  ];

  /* ---- Compliance progress bars ---- */
  const compliance = [
    { label: "Leave Policy", value: 96, color: COLORS.success },
    { label: "PBAS Submissions", value: 78, color: COLORS.warning },
    { label: "Service Bonds", value: 91, color: COLORS.accent },
    { label: "IT Policy", value: 65, color: COLORS.danger },
  ];

  return (
    <Box sx={{
      minHeight: "100vh",
      background: COLORS.bg,
      fontFamily: fontSans,
      p: { xs: 2, md: 3 },
    }}>
      <GoogleFonts />

      {/* ── TOP BAR ── */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography sx={{
            fontFamily: fontSans, fontWeight: 700,
            fontSize: { xs: "1.3rem", md: "1.6rem" },
            color: COLORS.textPrimary,
            letterSpacing: "-0.02em",
            lineHeight: 1.1,
            background: "linear-gradient(135deg, #1e1b4b 0%, #6366f1 100%)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>
            Admin Dashboard
          </Typography>
          <Typography sx={{ fontFamily: fontSans, fontSize: "0.78rem", color: COLORS.textSecondary, mt: 0.5 }}>
            Academic Year 2025–26 &nbsp;·&nbsp; Last updated: {time.toLocaleTimeString()}
          </Typography>
        </Box>
        <Box display="flex" alignItems="center" gap={1.5}>
          <Box sx={{
            px: 2, py: 0.75, borderRadius: "10px",
            border: `1px solid ${COLORS.border}`,
            background: COLORS.surface,
            boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
          }}>
            <Typography sx={{ fontFamily: fontMono, fontSize: "0.72rem", color: COLORS.textSecondary }}>
              {time.toLocaleDateString("en-IN", { weekday: "short", day: "2-digit", month: "short", year: "numeric" })}
            </Typography>
          </Box>
          <Badge badgeContent={4} sx={{
            "& .MuiBadge-badge": {
              bgcolor: COLORS.danger,
              fontFamily: fontMono,
              fontSize: "0.65rem",
              boxShadow: `0 0 0 2px ${COLORS.bg}`,
            }
          }}>
            <IconButton sx={{
              background: COLORS.surface,
              border: `1px solid ${COLORS.border}`,
              color: COLORS.textSecondary,
              borderRadius: "10px",
              transition: "all 250ms cubic-bezier(0.4,0,0.2,1)",
              "&:hover": {
                borderColor: COLORS.accent,
                color: COLORS.accent,
                boxShadow: `0 0 0 3px ${COLORS.accentSoft}`,
              }
            }}>
              <NotificationsActive fontSize="small" />
            </IconButton>
          </Badge>
        </Box>
      </Box>

      {/* ── STAT CARDS ── */}
      <Grid container spacing={2} mb={3}>
        {stats.map((s, i) => (
          <Grid item xs={6} sm={4} md={2} key={i} className="stat-card">
            <SCard sx={{ p: 2.5, cursor: "default", position: "relative", overflow: "hidden" }}>
              {/* Subtle gradient accent overlay */}
              <Box sx={{
                position: "absolute",
                top: 0, right: 0,
                width: 80, height: 80,
                borderRadius: "0 16px 0 80px",
                background: `linear-gradient(135deg, transparent 30%, ${s.soft})`,
                pointerEvents: "none",
              }} />
              <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1.5} sx={{ position: "relative" }}>
                <Box sx={{
                  p: 1, borderRadius: "11px",
                  bgcolor: s.soft, color: s.accent,
                  display: "flex",
                  transition: "all 250ms ease",
                }}>
                  <s.icon sx={{ fontSize: 18 }} />
                </Box>
                <DeltaBadge delta={s.delta} up={s.up} />
              </Box>
              <Typography sx={{ fontFamily: fontMono, fontWeight: 600, fontSize: "1.65rem", color: COLORS.textPrimary, lineHeight: 1 }}>
                {s.value}
              </Typography>
              <Typography sx={{ fontFamily: fontSans, fontSize: "0.72rem", color: COLORS.textSecondary, mt: 0.6, fontWeight: 500 }}>
                {s.label}
              </Typography>
            </SCard>
          </Grid>
        ))}
      </Grid>

      {/* ── ROW 1: Charts ── */}
      <Grid container spacing={2} mb={2}>
        <Grid item xs={12} md={4} className="chart-card">
          <SCard sx={{ p: 2.5, height: "100%" }}>
            <CardHeader title="Faculty Distribution" subtitle="By department · Total 142" />
            <ReactEcharts option={facultyDist} style={{ height: "240px" }} />
          </SCard>
        </Grid>
        <Grid item xs={12} md={4} className="chart-card">
          <SCard sx={{ p: 2.5, height: "100%" }}>
            <CardHeader title="Monthly Leave Trends" subtitle="Jan – Jun 2025" />
            <ReactEcharts option={leaveTrends} style={{ height: "240px" }} />
          </SCard>
        </Grid>
        <Grid item xs={12} md={4} className="chart-card">
          <SCard sx={{ p: 2.5, height: "100%" }}>
            <CardHeader title="Budget Utilization" subtitle="In Lakhs ₹ · FY 2025-26" />
            <ReactEcharts option={budgetOption} style={{ height: "240px" }} />
          </SCard>
        </Grid>
      </Grid>

      {/* ── ROW 2: Research + Actions + Alerts + Compliance ── */}
      <Grid container spacing={2}>
        {/* Research Output */}
        <Grid item xs={12} md={4}>
          <SCard sx={{ p: 2.5, height: "100%" }}>
            <CardHeader title="Research Output" subtitle="Top departments by publications" />
            <ReactEcharts option={researchOption} style={{ height: "230px" }} />
          </SCard>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12} sm={6} md={2.5}>
          <SCard sx={{ p: 2.5, height: "100%" }}>
            <CardHeader title="Quick Actions" action={<Box />} />
            <Box display="flex" flexDirection="column" gap={1.2}>
              {actions.map((a, i) => (
                <Box
                  key={i}
                  onClick={() => navigate(a.path)}
                  sx={{
                    display: "flex", alignItems: "center", gap: 1.5, p: 1.4,
                    borderRadius: "10px", border: `1px solid ${COLORS.border}`,
                    cursor: "pointer",
                    transition: "all 0.25s cubic-bezier(0.4,0,0.2,1)",
                    "&:hover": {
                      background: `${a.color}08`,
                      borderColor: `${a.color}40`,
                      transform: "translateX(4px)",
                      boxShadow: `0 2px 8px ${a.color}15`,
                    }
                  }}
                >
                  <Box sx={{ p: 0.7, borderRadius: "8px", bgcolor: `${a.color}12`, color: a.color, display: "flex" }}>
                    <a.icon sx={{ fontSize: 16 }} />
                  </Box>
                  <Typography sx={{ fontFamily: fontSans, fontSize: "0.78rem", fontWeight: 500, color: COLORS.textPrimary }}>
                    {a.label}
                  </Typography>
                  <ArrowForward sx={{
                    fontSize: 14, color: COLORS.textMuted, ml: "auto",
                    transition: "all 200ms ease",
                  }} />
                </Box>
              ))}
            </Box>
          </SCard>
        </Grid>

        {/* Critical Alerts */}
        <Grid item xs={12} sm={6} md={3}>
          <SCard sx={{ height: "100%", overflow: "hidden" }}>
            <Box px={2.5} pt={2.5} pb={1.5} borderBottom={`1px solid ${COLORS.border}`}>
              <Box display="flex" alignItems="center" gap={1}>
                <Box sx={{
                  width: 8, height: 8, borderRadius: "50%",
                  bgcolor: COLORS.danger,
                  animation: "pulseRing 2s infinite",
                }} />
                <Typography sx={{ fontFamily: fontSans, fontWeight: 600, fontSize: "0.88rem", color: COLORS.textPrimary }}>
                  Critical Alerts
                </Typography>
                <Chip label={alerts.length} size="small" sx={{
                  ml: "auto", height: 20,
                  fontFamily: fontMono, fontSize: "0.65rem",
                  bgcolor: COLORS.dangerSoft, color: COLORS.danger,
                  fontWeight: 700,
                }} />
              </Box>
            </Box>
            <List sx={{ py: 0 }}>
              {alerts.map((a, i) => (
                <React.Fragment key={i}>
                  <ListItem sx={{
                    py: 1.4, px: 2.5, gap: 1.5,
                    transition: "all 200ms ease",
                    "&:hover": {
                      background: COLORS.surfaceHover,
                      cursor: "pointer",
                      transform: "translateX(2px)",
                    }
                  }}>
                    <Box sx={{
                      p: 0.6, borderRadius: "8px",
                      bgcolor: `${a.color}12`, color: a.color,
                      display: "flex", flexShrink: 0,
                    }}>
                      <a.icon sx={{ fontSize: 15 }} />
                    </Box>
                    <Box flexGrow={1} minWidth={0}>
                      <Typography sx={{ fontFamily: fontSans, fontSize: "0.76rem", color: COLORS.textSecondary, lineHeight: 1.4 }} noWrap>
                        {a.text}
                      </Typography>
                    </Box>
                    <Chip label={a.tag} size="small" sx={{
                      height: 18,
                      fontFamily: fontMono, fontSize: "0.6rem",
                      bgcolor: COLORS.surfaceHover, color: COLORS.textMuted,
                      flexShrink: 0,
                    }} />
                  </ListItem>
                  {i < alerts.length - 1 && <Divider sx={{ borderColor: COLORS.border }} />}
                </React.Fragment>
              ))}
            </List>
            <Box px={2.5} py={1.5} borderTop={`1px solid ${COLORS.border}`}>
              <Button size="small" endIcon={<ArrowForward sx={{ fontSize: 13 }} />}
                sx={{
                  fontFamily: fontSans, fontSize: "0.72rem",
                  color: COLORS.accent, textTransform: "none", p: 0,
                  transition: "all 200ms ease",
                  "&:hover": { background: "transparent", opacity: 0.8, transform: "translateX(2px)" }
                }}>
                View all notifications
              </Button>
            </Box>
          </SCard>
        </Grid>

        {/* Compliance Tracker */}
        <Grid item xs={12} md={2.5}>
          <SCard sx={{ p: 2.5, height: "100%" }}>
            <CardHeader title="Compliance Tracker" subtitle="Policy adherence %" action={<Box />} />
            <Box display="flex" flexDirection="column" gap={2.4}>
              {compliance.map((c, i) => (
                <Box key={i}>
                  <Box display="flex" justifyContent="space-between" mb={0.8}>
                    <Typography sx={{ fontFamily: fontSans, fontSize: "0.73rem", color: COLORS.textSecondary, fontWeight: 500 }}>
                      {c.label}
                    </Typography>
                    <Typography sx={{ fontFamily: fontMono, fontSize: "0.73rem", color: c.color, fontWeight: 600 }}>
                      {c.value}%
                    </Typography>
                  </Box>
                  <Box sx={{
                    height: 6, borderRadius: 99,
                    background: COLORS.border,
                    overflow: "hidden",
                  }}>
                    <Box sx={{
                      height: "100%", borderRadius: 99, width: `${c.value}%`,
                      background: `linear-gradient(90deg, ${c.color}60, ${c.color})`,
                      transition: "width 1.2s cubic-bezier(0.16,1,0.3,1)",
                    }} />
                  </Box>
                </Box>
              ))}

              <Box sx={{ mt: "auto", pt: 2, borderTop: `1px solid ${COLORS.border}` }}>
                <Typography sx={{ fontFamily: fontSans, fontSize: "0.7rem", color: COLORS.textMuted, mb: 0.5 }}>Overall</Typography>
                <Typography sx={{ fontFamily: fontMono, fontWeight: 700, fontSize: "1.8rem", color: COLORS.textPrimary, lineHeight: 1 }}>
                  94%
                  <Box component="span" sx={{ fontFamily: fontSans, fontSize: "0.72rem", color: COLORS.success, ml: 1, verticalAlign: "middle" }}>
                    ↑ 1.5%
                  </Box>
                </Typography>
              </Box>
            </Box>
          </SCard>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboard;