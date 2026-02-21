import React, { useState } from "react";
import {
  Box, Card, Grid, Typography, Button, TextField, MenuItem,
  Tabs, Tab, Table, TableBody, TableCell, TableHead, TableRow,
  Chip, IconButton, Tooltip, Avatar, Badge, Dialog, DialogTitle,
  DialogContent, DialogActions, InputAdornment, Divider, Paper,
  LinearProgress, Select, FormControl, InputLabel, Stack, Alert,
  Collapse, ToggleButtonGroup, ToggleButton
} from "@mui/material";
import {
  CheckCircle, Cancel, HelpOutline, DateRange,
  Edit, EventBusy, History, Search, FilterList,
  Download, Refresh, Info, Warning, Person,
  CalendarMonth, BarChart, TrendingUp, AccessTime,
  ChevronLeft, ChevronRight, ExpandMore, ExpandLess,
  ArrowDropDown, Visibility, Send, CheckCircleOutline,
  RadioButtonUnchecked, Circle, NotificationsNone, MoreVert,
  KeyboardArrowDown
} from "@mui/icons-material";

/* ── Design Tokens ── */
const T = {
  bg:        "#F5F7FA",
  surface:   "#FFFFFF",
  border:    "#E4E8EF",
  borderFocus:"#6366F1",
  text:      "#111827",
  textSub:   "#4B5563",
  textMute:  "#9CA3AF",
  accent:    "#6366F1",
  accentLight:"#EEF2FF",
  success:   "#10B981",
  successLight:"#ECFDF5",
  warning:   "#F59E0B",
  warningLight:"#FFFBEB",
  danger:    "#EF4444",
  dangerLight:"#FEF2F2",
  info:      "#3B82F6",
  infoLight: "#EFF6FF",
  purple:    "#8B5CF6",
  purpleLight:"#F5F3FF",
};

const fontHead = "Roboto, Helvetica, Arial, sans-serif";
const fontBody = "Roboto, Helvetica, Arial, sans-serif";
const fontMono = "Roboto, Helvetica, Arial, sans-serif";

const Fonts = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700&family=Nunito:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600&display=swap');
    * { box-sizing: border-box; }
    @keyframes fadeUp { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:none; } }
    @keyframes slideIn { from { opacity:0; transform:translateX(-6px); } to { opacity:1; transform:none; } }
    .fade-up { animation: fadeUp 0.35s ease both; }
    .slide-in { animation: slideIn 0.25s ease both; }
    .row-hover:hover { background: #F9FAFB !important; transition: background 0.15s; }
    .action-btn { opacity: 0; transition: opacity 0.15s; }
    .row-hover:hover .action-btn { opacity: 1; }
  `}</style>
);

/* ── Reusable small components ── */
const SLabel = ({ children, sx = {} }) => (
  <Typography sx={{ fontFamily: fontBody, fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: T.textMute, mb: 0.5, ...sx }}>
    {children}
  </Typography>
);

const StatusPill = ({ status }) => {
  const map = {
    Pending:   { bg: T.warningLight, color: T.warning,  dot: T.warning  },
    Approved:  { bg: T.successLight, color: T.success,  dot: T.success  },
    Rejected:  { bg: T.dangerLight,  color: T.danger,   dot: T.danger   },
    Clarify:   { bg: T.infoLight,    color: T.info,     dot: T.info     },
    Critical:  { bg: T.dangerLight,  color: T.danger,   dot: T.danger   },
    Normal:    { bg: T.successLight, color: T.success,  dot: T.success  },
  };
  const s = map[status] || map.Pending;
  return (
    <Box display="flex" alignItems="center" gap={0.6}
      sx={{ px: 1.2, py: 0.4, borderRadius: "99px", bgcolor: s.bg, width: "fit-content" }}>
      <Box sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: s.dot }} />
      <Typography sx={{ fontFamily: fontBody, fontSize: "0.72rem", fontWeight: 700, color: s.color }}>
        {status}
      </Typography>
    </Box>
  );
};

const LeaveBadge = ({ type }) => {
  const map = { CL: T.accent, EL: T.purple, ML: T.success, CO: T.info, SL: T.warning };
  return (
    <Box sx={{ px: 1.2, py: 0.35, borderRadius: "6px", bgcolor: `${map[type] || T.accent}18`, border: `1px solid ${map[type] || T.accent}30`, display: "inline-block" }}>
      <Typography sx={{ fontFamily: fontMono, fontSize: "0.7rem", fontWeight: 600, color: map[type] || T.accent }}>
        {type}
      </Typography>
    </Box>
  );
};

const StatCard = ({ label, value, sub, color, icon: Icon, sx = {} }) => (
  <Box className="fade-up" sx={{
    flex: 1, p: 2.5, borderRadius: "14px", border: `1px solid ${T.border}`,
    background: T.surface, minWidth: 0, ...sx
  }}>
    <Box display="flex" justifyContent="space-between" alignItems="flex-start">
      <Box>
        <SLabel>{label}</SLabel>
        <Typography sx={{ fontFamily: fontMono, fontWeight: 700, fontSize: "1.8rem", color: color || T.text, lineHeight: 1.1 }}>
          {value}
        </Typography>
        {sub && <Typography sx={{ fontFamily: fontBody, fontSize: "0.72rem", color: T.textMute, mt: 0.4 }}>{sub}</Typography>}
      </Box>
      {Icon && (
        <Box sx={{ p: 1.2, borderRadius: "10px", bgcolor: `${color || T.accent}12`, color: color || T.accent }}>
          <Icon sx={{ fontSize: 20 }} />
        </Box>
      )}
    </Box>
  </Box>
);

/* ── Mock Data ── */
const REQUESTS = [
  { id: 1, faculty: "Dr. Sarah Smith",   avatar: "SS", dept: "CSE",  type: "CL", from: "2026-02-10", to: "2026-02-11", days: 2,  reason: "Personal Work",     substitute: "Dr. A. Verma", status: "Pending",  applied: "2026-02-05", conflict: true,  clBalance: 8,  elBalance: 12 },
  { id: 2, faculty: "Prof. Rajan Kumar", avatar: "RK", dept: "Mech", type: "EL", from: "2026-02-12", to: "2026-02-20", days: 8,  reason: "Family Trip",       substitute: "Prof. K. Singh", status: "Pending", applied: "2026-02-06", conflict: false, clBalance: 2,  elBalance: 28 },
  { id: 3, faculty: "Ms. Priya Roy",     avatar: "PR", dept: "CSE",  type: "CL", from: "2026-02-10", to: "2026-02-10", days: 1,  reason: "Sick Leave",        substitute: "None",          status: "Pending",  applied: "2026-02-07", conflict: true,  clBalance: 5,  elBalance: 10 },
  { id: 4, faculty: "Dr. Emily Davis",   avatar: "ED", dept: "CSE",  type: "CL", from: "2026-02-10", to: "2026-02-10", days: 1,  reason: "Emergency",         substitute: "None",          status: "Pending",  applied: "2026-02-08", conflict: true,  clBalance: 3,  elBalance: 15 },
  { id: 5, faculty: "Prof. A. Sharma",   avatar: "AS", dept: "ECE",  type: "ML", from: "2026-02-15", to: "2026-02-25", days: 10, reason: "Medical Treatment", substitute: "Dr. B. Mehta", status: "Approved", applied: "2026-02-03", conflict: false, clBalance: 10, elBalance: 22 },
  { id: 6, faculty: "Dr. K. Nair",       avatar: "KN", dept: "Civil","type": "CO", from: "2026-02-18", to: "2026-02-18", days: 1, reason: "Compensatory Off",  substitute: "Self",          status: "Rejected", applied: "2026-02-09", conflict: false, clBalance: 7, elBalance: 18 },
];

const BALANCES = [
  { id: 1, name: "Dr. Sarah Smith",   dept: "CSE",  cl: 8,  el: 12, ml: 10, co: 2,  ytdTaken: 4  },
  { id: 2, name: "Prof. Rajan Kumar", dept: "Mech", cl: 2,  el: 28, ml: 15, co: 0,  ytdTaken: 12 },
  { id: 3, name: "Ms. Priya Roy",     dept: "CSE",  cl: 5,  el: 10, ml: 10, co: 1,  ytdTaken: 7  },
  { id: 4, name: "Dr. Emily Davis",   dept: "CSE",  cl: 3,  el: 15, ml: 10, co: 0,  ytdTaken: 9  },
  { id: 5, name: "Prof. A. Sharma",   dept: "ECE",  cl: 10, el: 22, ml: 5,  co: 3,  ytdTaken: 15 },
];

const CALENDAR = [
  { date: "10 Feb", day: "Tue", leaves: 3, depts: ["CSE (3)"], status: "Critical",  requests: ["Dr. Sarah Smith", "Ms. Priya Roy", "Dr. Emily Davis"] },
  { date: "11 Feb", day: "Wed", leaves: 1, depts: ["CSE (1)"], status: "Normal",    requests: ["Dr. Sarah Smith"] },
  { date: "12 Feb", day: "Thu", leaves: 1, depts: ["Mech (1)"],status: "Normal",    requests: ["Prof. Rajan Kumar"] },
  { date: "13 Feb", day: "Fri", leaves: 0, depts: [],           status: "Normal",    requests: [] },
  { date: "14 Feb", day: "Sat", leaves: 0, depts: [],           status: "Holiday",   requests: [] },
  { date: "17 Feb", day: "Tue", leaves: 2, depts: ["ECE (1)", "Mech (1)"], status: "Normal", requests: ["Prof. A. Sharma", "Prof. Rajan Kumar"] },
  { date: "18 Feb", day: "Wed", leaves: 1, depts: ["Civil (1)"],status: "Normal",    requests: ["Dr. K. Nair"] },
];

const AUDIT_LOG = [
  { time: "09:14 AM", user: "Admin", action: "Approved CL for Prof. A. Sharma", type: "approve" },
  { time: "Yesterday", user: "Admin", action: "Rejected CO for Dr. K. Nair — 'Insufficient notice period'", type: "reject" },
  { time: "2 days ago", user: "System", action: "Auto-reminder sent to 3 pending approvals", type: "info" },
  { time: "3 days ago", user: "Admin", action: "Balance adjustment: +2 CL for Dr. Sarah Smith (Election Duty)", type: "edit" },
];

/* ════════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════════ */
const LeaveApprovalView = () => {
  const [tabIndex, setTabIndex]   = useState(0);
  const [deptFilter, setDeptFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchQ, setSearchQ]     = useState("");
  const [selected, setSelected]   = useState([]);
  const [expandRow, setExpandRow] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogData, setDialogData] = useState(null);
  const [adjustFaculty, setAdjustFaculty] = useState("");
  const [adjustType, setAdjustType] = useState("CL");
  const [adjustDays, setAdjustDays] = useState("");
  const [adjustRemark, setAdjustRemark] = useState("");

  const filtered = REQUESTS.filter(r => {
    if (deptFilter !== "All" && r.dept !== deptFilter) return false;
    if (typeFilter !== "All" && r.type !== typeFilter) return false;
    if (statusFilter !== "All" && r.status !== statusFilter) return false;
    if (searchQ && !r.faculty.toLowerCase().includes(searchQ.toLowerCase())) return false;
    return true;
  });

  const pendingCount  = REQUESTS.filter(r => r.status === "Pending").length;
  const approvedCount = REQUESTS.filter(r => r.status === "Approved").length;
  const conflictCount = REQUESTS.filter(r => r.conflict && r.status === "Pending").length;

  const openDialog = (row, action) => { setDialogData({ row, action }); setDialogOpen(true); };

  const TabLabel = ({ label, count }) => (
    <Box display="flex" alignItems="center" gap={1}>
      {label}
      {count > 0 && (
        <Box sx={{ px: 0.9, py: 0.15, borderRadius: "99px", bgcolor: T.accentLight, color: T.accent }}>
          <Typography sx={{ fontFamily: fontMono, fontSize: "0.65rem", fontWeight: 700 }}>{count}</Typography>
        </Box>
      )}
    </Box>
  );

  return (
    <Box sx={{ p: 3, background: T.bg, minHeight: "100vh", fontFamily: fontBody }}>
      <Fonts />

      {/* ── Page Header ── */}
      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3} className="fade-up">
        <Box>
          <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1.5rem", color: T.text, lineHeight: 1.1 }}>
            Leave Approval
          </Typography>
          <Typography sx={{ fontFamily: fontBody, fontSize: "0.82rem", color: T.textSub, mt: 0.4 }}>
            Academic Year 2025–26 &nbsp;·&nbsp; Manage requests, monitor conflicts, and adjust balances
          </Typography>
        </Box>
        <Box display="flex" gap={1.5}>
          <Button variant="outlined" size="small" startIcon={<Download />}
            sx={{ fontFamily: fontBody, fontWeight: 600, fontSize: "0.78rem", borderColor: T.border, color: T.textSub, borderRadius: "8px", textTransform: "none", "&:hover": { borderColor: T.accent, color: T.accent } }}>
            Export
          </Button>
          <Button variant="contained" size="small" startIcon={<Refresh />}
            sx={{ fontFamily: fontBody, fontWeight: 600, fontSize: "0.78rem", background: T.accent, borderRadius: "8px", textTransform: "none", boxShadow: "none", "&:hover": { background: "#4F46E5", boxShadow: "none" } }}>
            Sync
          </Button>
        </Box>
      </Box>

      {/* ── Summary Strip ── */}
      <Box display="flex" gap={2} mb={3} sx={{ overflowX: "auto", pb: 0.5 }}>
        <StatCard label="Pending Approval" value={pendingCount} sub="Requires action" color={T.warning} icon={AccessTime} />
        <StatCard label="Approved This Month" value={approvedCount} sub="Processed successfully" color={T.success} icon={CheckCircle} />
        <StatCard label="Conflict Alerts" value={conflictCount} sub="Same dept, same day" color={T.danger} icon={Warning} />
        <StatCard label="Departments Impacted" value="4" sub="Across all pending" color={T.accent} icon={BarChart} />
      </Box>

      {/* ── Tab Container ── */}
      <Card sx={{ borderRadius: "16px", border: `1px solid ${T.border}`, boxShadow: "0 1px 4px rgba(0,0,0,0.06)", overflow: "hidden" }}>
        <Box sx={{ borderBottom: `1px solid ${T.border}`, px: 3, background: T.surface }}>
          <Tabs
            value={tabIndex}
            onChange={(_, v) => setTabIndex(v)}
            sx={{
              "& .MuiTabs-indicator": { background: T.accent, height: 2.5, borderRadius: "2px 2px 0 0" },
              "& .MuiTab-root": { fontFamily: fontBody, fontWeight: 600, fontSize: "0.82rem", textTransform: "none", color: T.textMute, minHeight: 50, "&.Mui-selected": { color: T.accent } },
            }}
          >
            <Tab label={<TabLabel label="Pending Requests" count={pendingCount} />} />
            <Tab label="Leave Calendar" />
            <Tab label="Balance & Adjustment" />
            <Tab label="Audit Log" />
          </Tabs>
        </Box>

        <Box sx={{ p: 3, background: T.surface }}>

          {/* ════ TAB 1: PENDING REQUESTS ════ */}
          {tabIndex === 0 && (
            <Box className="slide-in">
              {/* Filters Row */}
              <Box display="flex" gap={1.5} alignItems="center" mb={2.5} flexWrap="wrap">
                <TextField
                  size="small" placeholder="Search faculty..." value={searchQ}
                  onChange={e => setSearchQ(e.target.value)}
                  InputProps={{ startAdornment: <InputAdornment position="start"><Search sx={{ fontSize: 16, color: T.textMute }} /></InputAdornment> }}
                  sx={{ width: 220, "& .MuiOutlinedInput-root": { borderRadius: "8px", fontFamily: fontBody, fontSize: "0.82rem", "& fieldset": { borderColor: T.border }, "&:hover fieldset": { borderColor: T.accent }, "&.Mui-focused fieldset": { borderColor: T.accent } } }}
                />
                {[
                  { label: "Department", value: deptFilter, set: setDeptFilter, options: ["All", "CSE", "Mech", "ECE", "Civil"] },
                  { label: "Type", value: typeFilter, set: setTypeFilter, options: ["All", "CL", "EL", "ML", "CO", "SL"] },
                  { label: "Status", value: statusFilter, set: setStatusFilter, options: ["All", "Pending", "Approved", "Rejected"] },
                ].map(f => (
                  <TextField key={f.label} select size="small" label={f.label} value={f.value} onChange={e => f.set(e.target.value)}
                    sx={{ width: 150, "& .MuiOutlinedInput-root": { borderRadius: "8px", fontFamily: fontBody, fontSize: "0.82rem", "& fieldset": { borderColor: T.border }, "&.Mui-focused fieldset": { borderColor: T.accent } }, "& .MuiInputLabel-root": { fontFamily: fontBody, fontSize: "0.82rem", "&.Mui-focused": { color: T.accent } } }}>
                    {f.options.map(o => <MenuItem key={o} value={o} sx={{ fontFamily: fontBody, fontSize: "0.82rem" }}>{o === "All" ? `All ${f.label}s` : o}</MenuItem>)}
                  </TextField>
                ))}
                <Box ml="auto" display="flex" gap={1}>
                  {selected.length > 0 && (
                    <Box display="flex" gap={1}>
                      <Button size="small" variant="outlined" startIcon={<CheckCircle />}
                        sx={{ fontFamily: fontBody, fontWeight: 600, fontSize: "0.76rem", textTransform: "none", borderRadius: "8px", color: T.success, borderColor: `${T.success}40`, "&:hover": { borderColor: T.success, bgcolor: T.successLight } }}>
                        Approve ({selected.length})
                      </Button>
                      <Button size="small" variant="outlined" startIcon={<Cancel />}
                        sx={{ fontFamily: fontBody, fontWeight: 600, fontSize: "0.76rem", textTransform: "none", borderRadius: "8px", color: T.danger, borderColor: `${T.danger}40`, "&:hover": { borderColor: T.danger, bgcolor: T.dangerLight } }}>
                        Reject ({selected.length})
                      </Button>
                    </Box>
                  )}
                </Box>
              </Box>

              {/* Conflict Alert Banner */}
              {conflictCount > 0 && (
                <Alert severity="warning" icon={<Warning sx={{ fontSize: 18 }} />}
                  sx={{ mb: 2, borderRadius: "10px", fontFamily: fontBody, fontSize: "0.8rem", border: `1px solid ${T.warning}40`, bgcolor: T.warningLight }}>
                  <strong>{conflictCount} conflict detected:</strong> Multiple faculty from CSE are on leave on 10 Feb. Review before approving.
                </Alert>
              )}

              {/* Table */}
              <Box sx={{ overflowX: "auto", borderRadius: "10px", border: `1px solid ${T.border}` }}>
                <Table size="medium">
                  <TableHead>
                    <TableRow sx={{ bgcolor: "#F9FAFB" }}>
                      {["Faculty & Dept", "Leave Type", "Duration", "Reason", "Substitute", "Balance", "Status", "Actions"].map(h => (
                        <TableCell key={h} sx={{ fontFamily: fontBody, fontWeight: 700, fontSize: "0.72rem", letterSpacing: "0.05em", textTransform: "uppercase", color: T.textMute, borderBottom: `1px solid ${T.border}`, py: 1.5, whiteSpace: "nowrap" }}>
                          {h}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filtered.map((row) => (
                      <React.Fragment key={row.id}>
                        <TableRow className="row-hover" sx={{ borderBottom: expandRow === row.id ? "none" : `1px solid ${T.border}` }}>
                          {/* Faculty */}
                          <TableCell sx={{ py: 1.8 }}>
                            <Box display="flex" alignItems="center" gap={1.5}>
                              <Avatar sx={{ width: 34, height: 34, fontFamily: fontHead, fontWeight: 700, fontSize: "0.8rem", bgcolor: T.accentLight, color: T.accent }}>
                                {row.avatar}
                              </Avatar>
                              <Box>
                                <Typography sx={{ fontFamily: fontBody, fontWeight: 600, fontSize: "0.83rem", color: T.text, lineHeight: 1.2 }}>
                                  {row.faculty}
                                </Typography>
                                <Box display="flex" alignItems="center" gap={0.6} mt={0.2}>
                                  <Typography sx={{ fontFamily: fontBody, fontSize: "0.7rem", color: T.textMute }}>{row.dept}</Typography>
                                  {row.conflict && row.status === "Pending" && (
                                    <Tooltip title="Conflict: Multiple leaves from same dept on same day">
                                      <Box sx={{ px: 0.8, py: 0.15, borderRadius: "4px", bgcolor: T.dangerLight, border: `1px solid ${T.danger}30` }}>
                                        <Typography sx={{ fontFamily: fontMono, fontSize: "0.6rem", color: T.danger, fontWeight: 700 }}>CONFLICT</Typography>
                                      </Box>
                                    </Tooltip>
                                  )}
                                </Box>
                              </Box>
                            </Box>
                          </TableCell>
                          {/* Type */}
                          <TableCell><LeaveBadge type={row.type} /></TableCell>
                          {/* Duration */}
                          <TableCell>
                            <Typography sx={{ fontFamily: fontBody, fontSize: "0.8rem", color: T.text, fontWeight: 500 }}>
                              {row.from === row.to ? row.from : `${row.from} – ${row.to}`}
                            </Typography>
                            <Typography sx={{ fontFamily: fontMono, fontSize: "0.7rem", color: T.textMute }}>{row.days} day{row.days > 1 ? "s" : ""}</Typography>
                          </TableCell>
                          {/* Reason */}
                          <TableCell>
                            <Typography sx={{ fontFamily: fontBody, fontSize: "0.8rem", color: T.textSub, maxWidth: 140, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{row.reason}</Typography>
                          </TableCell>
                          {/* Substitute */}
                          <TableCell>
                            <Typography sx={{ fontFamily: fontBody, fontSize: "0.8rem", color: row.substitute === "None" ? T.danger : T.textSub }}>
                              {row.substitute}
                            </Typography>
                          </TableCell>
                          {/* Balance */}
                          <TableCell>
                            <Box>
                              <Typography sx={{ fontFamily: fontMono, fontSize: "0.72rem", color: row.clBalance <= 3 ? T.danger : T.success }}>
                                CL: {row.clBalance}
                              </Typography>
                              <Typography sx={{ fontFamily: fontMono, fontSize: "0.72rem", color: T.textMute }}>
                                EL: {row.elBalance}
                              </Typography>
                            </Box>
                          </TableCell>
                          {/* Status */}
                          <TableCell><StatusPill status={row.status} /></TableCell>
                          {/* Actions */}
                          <TableCell>
                            <Box display="flex" alignItems="center" gap={0.5}>
                              {row.status === "Pending" ? (
                                <>
                                  <Tooltip title="Approve">
                                    <IconButton size="small" onClick={() => openDialog(row, "approve")}
                                      sx={{ bgcolor: T.successLight, color: T.success, borderRadius: "8px", "&:hover": { bgcolor: "#D1FAE5" } }}>
                                      <CheckCircle sx={{ fontSize: 16 }} />
                                    </IconButton>
                                  </Tooltip>
                                  <Tooltip title="Reject">
                                    <IconButton size="small" onClick={() => openDialog(row, "reject")}
                                      sx={{ bgcolor: T.dangerLight, color: T.danger, borderRadius: "8px", "&:hover": { bgcolor: "#FEE2E2" } }}>
                                      <Cancel sx={{ fontSize: 16 }} />
                                    </IconButton>
                                  </Tooltip>
                                  <Tooltip title="Request Clarification">
                                    <IconButton size="small" onClick={() => openDialog(row, "clarify")}
                                      sx={{ bgcolor: T.infoLight, color: T.info, borderRadius: "8px", "&:hover": { bgcolor: "#DBEAFE" } }}>
                                      <HelpOutline sx={{ fontSize: 16 }} />
                                    </IconButton>
                                  </Tooltip>
                                </>
                              ) : (
                                <Tooltip title="View Details">
                                  <IconButton size="small" sx={{ borderRadius: "8px", color: T.textMute, "&:hover": { bgcolor: T.bg } }}>
                                    <Visibility sx={{ fontSize: 16 }} />
                                  </IconButton>
                                </Tooltip>
                              )}
                              <Tooltip title={expandRow === row.id ? "Collapse" : "Expand"}>
                                <IconButton size="small" onClick={() => setExpandRow(expandRow === row.id ? null : row.id)}
                                  sx={{ borderRadius: "8px", color: T.textMute, "&:hover": { bgcolor: T.bg } }}>
                                  {expandRow === row.id ? <ExpandLess sx={{ fontSize: 16 }} /> : <ExpandMore sx={{ fontSize: 16 }} />}
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </TableCell>
                        </TableRow>

                        {/* ── Expanded Detail Row ── */}
                        <TableRow>
                          <TableCell colSpan={8} sx={{ p: 0, border: "none" }}>
                            <Collapse in={expandRow === row.id} timeout="auto" unmountOnExit>
                              <Box sx={{ px: 3, py: 2.5, bgcolor: "#FAFBFD", borderBottom: `1px solid ${T.border}`, borderTop: `1px dashed ${T.border}` }}>
                                <Grid container spacing={3}>
                                  <Grid item xs={12} md={4}>
                                    <SLabel>Application Details</SLabel>
                                    <Box display="flex" flexDirection="column" gap={1} mt={1}>
                                      {[
                                        { k: "Applied On",    v: row.applied },
                                        { k: "Leave Period",  v: `${row.from} to ${row.to} (${row.days} days)` },
                                        { k: "Leave Type",    v: row.type },
                                        { k: "Substitute",    v: row.substitute },
                                      ].map(item => (
                                        <Box key={item.k} display="flex" gap={1}>
                                          <Typography sx={{ fontFamily: fontBody, fontSize: "0.76rem", color: T.textMute, minWidth: 90 }}>{item.k}</Typography>
                                          <Typography sx={{ fontFamily: fontBody, fontSize: "0.76rem", color: T.text, fontWeight: 500 }}>{item.v}</Typography>
                                        </Box>
                                      ))}
                                    </Box>
                                  </Grid>
                                  <Grid item xs={12} md={4}>
                                    <SLabel>Leave Balance Overview</SLabel>
                                    <Box mt={1} display="flex" flexDirection="column" gap={1.2}>
                                      {[
                                        { label: "CL", used: 12 - row.clBalance, total: 12, color: T.accent },
                                        { label: "EL", used: 30 - row.elBalance, total: 30, color: T.purple },
                                      ].map(b => (
                                        <Box key={b.label}>
                                          <Box display="flex" justifyContent="space-between" mb={0.4}>
                                            <Typography sx={{ fontFamily: fontBody, fontSize: "0.72rem", color: T.textSub, fontWeight: 600 }}>{b.label}</Typography>
                                            <Typography sx={{ fontFamily: fontMono, fontSize: "0.7rem", color: T.textMute }}>{b.total - b.used} left</Typography>
                                          </Box>
                                          <Box sx={{ height: 5, borderRadius: 99, bgcolor: T.border, overflow: "hidden" }}>
                                            <Box sx={{ height: "100%", width: `${(b.used / b.total) * 100}%`, bgcolor: b.color, borderRadius: 99 }} />
                                          </Box>
                                        </Box>
                                      ))}
                                    </Box>
                                  </Grid>
                                  <Grid item xs={12} md={4}>
                                    <SLabel>Reason / Notes</SLabel>
                                    <Box mt={1} p={1.5} sx={{ bgcolor: T.surface, borderRadius: "8px", border: `1px solid ${T.border}` }}>
                                      <Typography sx={{ fontFamily: fontBody, fontSize: "0.78rem", color: T.textSub }}>{row.reason}</Typography>
                                    </Box>
                                    {row.conflict && (
                                      <Box mt={1.5} p={1.5} sx={{ bgcolor: T.dangerLight, borderRadius: "8px", border: `1px solid ${T.danger}30` }}>
                                        <Typography sx={{ fontFamily: fontBody, fontSize: "0.75rem", color: T.danger, fontWeight: 600 }}>
                                          ⚠ Conflict: 3+ CSE faculty on leave on {row.from}. Approval may affect class operations.
                                        </Typography>
                                      </Box>
                                    )}
                                  </Grid>
                                </Grid>
                              </Box>
                            </Collapse>
                          </TableCell>
                        </TableRow>
                      </React.Fragment>
                    ))}
                  </TableBody>
                </Table>
              </Box>

              <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
                <Typography sx={{ fontFamily: fontBody, fontSize: "0.76rem", color: T.textMute }}>
                  Showing {filtered.length} of {REQUESTS.length} records
                </Typography>
                <Box display="flex" gap={1}>
                  <IconButton size="small" sx={{ border: `1px solid ${T.border}`, borderRadius: "8px" }}><ChevronLeft sx={{ fontSize: 16 }} /></IconButton>
                  <IconButton size="small" sx={{ border: `1px solid ${T.border}`, borderRadius: "8px" }}><ChevronRight sx={{ fontSize: 16 }} /></IconButton>
                </Box>
              </Box>
            </Box>
          )}

          {/* ════ TAB 2: LEAVE CALENDAR ════ */}
          {tabIndex === 1 && (
            <Box className="slide-in">
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Box>
                  <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1.05rem", color: T.text }}>February 2026</Typography>
                  <Typography sx={{ fontFamily: fontBody, fontSize: "0.78rem", color: T.textMute, mt: 0.3 }}>
                    Conflict rule: &gt;2 faculty on leave from same dept on same day
                  </Typography>
                </Box>
                <Box display="flex" gap={1} alignItems="center">
                  <Box display="flex" alignItems="center" gap={0.5}>
                    <Box sx={{ width: 10, height: 10, borderRadius: "3px", bgcolor: T.successLight, border: `1.5px solid ${T.success}` }} />
                    <Typography sx={{ fontFamily: fontBody, fontSize: "0.72rem", color: T.textMute }}>Normal</Typography>
                  </Box>
                  <Box display="flex" alignItems="center" gap={0.5}>
                    <Box sx={{ width: 10, height: 10, borderRadius: "3px", bgcolor: T.dangerLight, border: `1.5px solid ${T.danger}` }} />
                    <Typography sx={{ fontFamily: fontBody, fontSize: "0.72rem", color: T.textMute }}>Conflict</Typography>
                  </Box>
                  <Box display="flex" alignItems="center" gap={0.5}>
                    <Box sx={{ width: 10, height: 10, borderRadius: "3px", bgcolor: "#F3F4F6", border: `1.5px solid ${T.border}` }} />
                    <Typography sx={{ fontFamily: fontBody, fontSize: "0.72rem", color: T.textMute }}>Holiday</Typography>
                  </Box>
                </Box>
              </Box>

              <Grid container spacing={2}>
                {CALENDAR.map((day, i) => (
                  <Grid item xs={12} sm={6} md={3} key={i}>
                    <Box sx={{
                      p: 2.5, borderRadius: "12px",
                      border: `1.5px solid ${day.status === "Critical" ? T.danger : day.status === "Holiday" ? T.border : T.border}`,
                      background: day.status === "Critical" ? T.dangerLight : day.status === "Holiday" ? "#F9FAFB" : T.surface,
                      transition: "box-shadow 0.2s",
                      "&:hover": { boxShadow: "0 4px 16px rgba(0,0,0,0.08)" }
                    }}>
                      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1.5}>
                        <Box>
                          <Typography sx={{ fontFamily: fontMono, fontWeight: 700, fontSize: "1rem", color: T.text }}>{day.date}</Typography>
                          <Typography sx={{ fontFamily: fontBody, fontSize: "0.7rem", color: T.textMute }}>{day.day}</Typography>
                        </Box>
                        {day.status === "Holiday" ? (
                          <Chip label="Holiday" size="small" sx={{ fontFamily: fontBody, fontWeight: 600, fontSize: "0.65rem", bgcolor: "#F3F4F6", color: T.textMute, height: 20 }} />
                        ) : (
                          <Box sx={{ px: 1.2, py: 0.3, borderRadius: "8px", bgcolor: day.status === "Critical" ? T.danger : day.leaves === 0 ? T.border : T.accentLight }}>
                            <Typography sx={{ fontFamily: fontMono, fontWeight: 700, fontSize: "0.75rem", color: day.status === "Critical" ? "#fff" : day.leaves === 0 ? T.textMute : T.accent }}>
                              {day.leaves} away
                            </Typography>
                          </Box>
                        )}
                      </Box>

                      {day.requests.length > 0 && (
                        <Box mb={1.5}>
                          {day.requests.map((name, j) => (
                            <Box key={j} display="flex" alignItems="center" gap={0.8} mb={0.6}>
                              <Avatar sx={{ width: 20, height: 20, fontSize: "0.55rem", fontWeight: 700, bgcolor: T.accentLight, color: T.accent }}>
                                {name.split(" ").pop()[0]}
                              </Avatar>
                              <Typography sx={{ fontFamily: fontBody, fontSize: "0.72rem", color: T.textSub }}>{name}</Typography>
                            </Box>
                          ))}
                        </Box>
                      )}

                      {day.depts.length > 0 && (
                        <Box display="flex" flexWrap="wrap" gap={0.5} mb={day.status === "Critical" ? 1.5 : 0}>
                          {day.depts.map((d, j) => (
                            <Box key={j} sx={{ px: 0.9, py: 0.2, borderRadius: "5px", bgcolor: day.status === "Critical" ? "rgba(239,68,68,0.15)" : T.accentLight }}>
                              <Typography sx={{ fontFamily: fontMono, fontSize: "0.65rem", fontWeight: 600, color: day.status === "Critical" ? T.danger : T.accent }}>{d}</Typography>
                            </Box>
                          ))}
                        </Box>
                      )}

                      {day.status === "Critical" && (
                        <Button size="small" fullWidth variant="outlined"
                          sx={{ fontFamily: fontBody, fontWeight: 700, fontSize: "0.72rem", textTransform: "none", color: T.danger, borderColor: `${T.danger}60`, borderRadius: "8px", "&:hover": { bgcolor: "rgba(239,68,68,0.1)", borderColor: T.danger } }}>
                          Resolve Conflict
                        </Button>
                      )}
                      {day.leaves === 0 && day.status !== "Holiday" && (
                        <Typography sx={{ fontFamily: fontBody, fontSize: "0.72rem", color: T.textMute, textAlign: "center" }}>No leaves</Typography>
                      )}
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}

          {/* ════ TAB 3: BALANCE & ADJUSTMENT ════ */}
          {tabIndex === 2 && (
            <Box className="slide-in">
              <Grid container spacing={3}>
                {/* Adjustment Form */}
                <Grid item xs={12} md={4}>
                  <Box sx={{ p: 3, borderRadius: "14px", border: `1px solid ${T.border}`, background: "#FAFBFD" }}>
                    <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "0.95rem", color: T.text, mb: 0.5 }}>Manual Adjustment</Typography>
                    <Typography sx={{ fontFamily: fontBody, fontSize: "0.75rem", color: T.textMute, mb: 2.5 }}>
                      Credit or debit leave days with an audit trail
                    </Typography>

                    <Box display="flex" flexDirection="column" gap={2}>
                      {[
                        { label: "Select Faculty", component: (
                          <TextField select fullWidth size="small" value={adjustFaculty} onChange={e => setAdjustFaculty(e.target.value)}
                            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px", fontFamily: fontBody, bgcolor: T.surface, "& fieldset": { borderColor: T.border }, "&.Mui-focused fieldset": { borderColor: T.accent } } }}>
                            {BALANCES.map(b => <MenuItem key={b.id} value={b.id} sx={{ fontFamily: fontBody, fontSize: "0.82rem" }}>{b.name}</MenuItem>)}
                          </TextField>
                        )},
                        { label: "Leave Type", component: (
                          <TextField select fullWidth size="small" value={adjustType} onChange={e => setAdjustType(e.target.value)}
                            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px", fontFamily: fontBody, bgcolor: T.surface, "& fieldset": { borderColor: T.border }, "&.Mui-focused fieldset": { borderColor: T.accent } } }}>
                            {["CL", "EL", "ML", "CO", "SL"].map(t => <MenuItem key={t} value={t} sx={{ fontFamily: fontBody, fontSize: "0.82rem" }}>{t}</MenuItem>)}
                          </TextField>
                        )},
                        { label: "Days (+credit / −debit)", component: (
                          <TextField fullWidth size="small" type="number" placeholder="e.g. +2 or -1" value={adjustDays} onChange={e => setAdjustDays(e.target.value)}
                            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px", fontFamily: fontMono, bgcolor: T.surface, "& fieldset": { borderColor: T.border }, "&.Mui-focused fieldset": { borderColor: T.accent } } }} />
                        )},
                        { label: "Reason / Remark", component: (
                          <TextField fullWidth size="small" multiline rows={2} placeholder="e.g. Election Duty, Govt. Holiday compensation..." value={adjustRemark} onChange={e => setAdjustRemark(e.target.value)}
                            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px", fontFamily: fontBody, bgcolor: T.surface, "& fieldset": { borderColor: T.border }, "&.Mui-focused fieldset": { borderColor: T.accent } } }} />
                        )},
                      ].map(f => (
                        <Box key={f.label}>
                          <SLabel sx={{ mb: 0.8 }}>{f.label}</SLabel>
                          {f.component}
                        </Box>
                      ))}

                      <Divider sx={{ borderColor: T.border }} />
                      <Button variant="contained" fullWidth startIcon={<Edit />}
                        sx={{ fontFamily: fontBody, fontWeight: 700, fontSize: "0.82rem", textTransform: "none", background: T.accent, borderRadius: "8px", py: 1.2, boxShadow: "none", "&:hover": { background: "#4F46E5", boxShadow: "none" } }}>
                        Update Balance
                      </Button>
                    </Box>
                  </Box>

                  <Box mt={2} p={2} sx={{ borderRadius: "10px", border: `1px solid ${T.warning}40`, bgcolor: T.warningLight }}>
                    <Typography sx={{ fontFamily: fontBody, fontSize: "0.75rem", color: "#92400E", fontWeight: 600, mb: 0.5 }}>Leave Rules Reminder</Typography>
                    <Typography sx={{ fontFamily: fontBody, fontSize: "0.72rem", color: "#92400E", lineHeight: 1.6 }}>
                      • CL: Max 12/year, lapses at year-end<br />
                      • EL: Carries forward up to 30 days<br />
                      • ML: 10 days/year with medical certificate<br />
                      • CO: Must be availed within 30 days
                    </Typography>
                  </Box>
                </Grid>

                {/* Balance Table */}
                <Grid item xs={12} md={8}>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "0.95rem", color: T.text }}>Current Leave Balances</Typography>
                    <Button size="small" startIcon={<History />} variant="outlined"
                      sx={{ fontFamily: fontBody, fontWeight: 600, fontSize: "0.75rem", textTransform: "none", borderRadius: "8px", borderColor: T.border, color: T.textSub, "&:hover": { borderColor: T.accent, color: T.accent } }}>
                      Annual Reset Rules
                    </Button>
                  </Box>

                  <Box sx={{ borderRadius: "12px", border: `1px solid ${T.border}`, overflow: "hidden" }}>
                    <Table size="small">
                      <TableHead>
                        <TableRow sx={{ bgcolor: "#F9FAFB" }}>
                          {["Faculty", "Dept", "CL / 12", "EL / 30", "ML / 10", "CO", "YTD Taken", ""].map(h => (
                            <TableCell key={h} sx={{ fontFamily: fontBody, fontWeight: 700, fontSize: "0.68rem", letterSpacing: "0.06em", textTransform: "uppercase", color: T.textMute, borderBottom: `1px solid ${T.border}`, py: 1.4 }}>{h}</TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {BALANCES.map((row) => (
                          <TableRow key={row.id} className="row-hover" sx={{ borderBottom: `1px solid ${T.border}` }}>
                            <TableCell>
                              <Typography sx={{ fontFamily: fontBody, fontWeight: 600, fontSize: "0.82rem", color: T.text }}>{row.name}</Typography>
                            </TableCell>
                            <TableCell>
                              <Box sx={{ px: 0.8, py: 0.2, borderRadius: "5px", bgcolor: T.accentLight, display: "inline-block" }}>
                                <Typography sx={{ fontFamily: fontMono, fontSize: "0.68rem", color: T.accent, fontWeight: 700 }}>{row.dept}</Typography>
                              </Box>
                            </TableCell>
                            {[
                              { val: row.cl, max: 12, warn: 3 },
                              { val: row.el, max: 30, warn: 5, capWarn: row.el > 30 },
                              { val: row.ml, max: 10, warn: 2 },
                            ].map((b, bi) => (
                              <TableCell key={bi}>
                                <Box display="flex" alignItems="center" gap={1}>
                                  <Typography sx={{ fontFamily: fontMono, fontWeight: 600, fontSize: "0.8rem", color: b.val <= b.warn ? T.danger : T.text }}>
                                    {b.val}
                                  </Typography>
                                  <Box sx={{ width: 36, height: 4, borderRadius: 99, bgcolor: T.border, overflow: "hidden" }}>
                                    <Box sx={{ height: "100%", width: `${Math.min((b.val / b.max) * 100, 100)}%`, bgcolor: b.val <= b.warn ? T.danger : T.success, borderRadius: 99 }} />
                                  </Box>
                                  {b.capWarn && <Chip label="Cap" size="small" sx={{ height: 15, fontSize: "0.58rem", fontFamily: fontMono, bgcolor: T.warningLight, color: T.warning }} />}
                                </Box>
                              </TableCell>
                            ))}
                            <TableCell>
                              <Typography sx={{ fontFamily: fontMono, fontSize: "0.8rem", color: T.textSub }}>{row.co}</Typography>
                            </TableCell>
                            <TableCell>
                              <Typography sx={{ fontFamily: fontMono, fontSize: "0.8rem", color: row.ytdTaken > 10 ? T.danger : T.textSub, fontWeight: 600 }}>
                                {row.ytdTaken}d
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Button size="small" variant="text"
                                sx={{ fontFamily: fontBody, fontSize: "0.72rem", fontWeight: 600, color: T.accent, textTransform: "none", p: 0, minWidth: 0, "&:hover": { bgcolor: "transparent", textDecoration: "underline" } }}>
                                Log
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          )}

          {/* ════ TAB 4: AUDIT LOG ════ */}
          {tabIndex === 3 && (
            <Box className="slide-in">
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Box>
                  <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "0.95rem", color: T.text }}>Action History</Typography>
                  <Typography sx={{ fontFamily: fontBody, fontSize: "0.75rem", color: T.textMute, mt: 0.3 }}>All approval decisions and balance changes are logged below</Typography>
                </Box>
                <Button size="small" startIcon={<Download />} variant="outlined"
                  sx={{ fontFamily: fontBody, fontWeight: 600, fontSize: "0.75rem", textTransform: "none", borderRadius: "8px", borderColor: T.border, color: T.textSub }}>
                  Export Log
                </Button>
              </Box>

              <Box display="flex" flexDirection="column" gap={0}>
                {AUDIT_LOG.map((log, i) => {
                  const iconMap = { approve: { icon: CheckCircle, color: T.success, bg: T.successLight }, reject: { icon: Cancel, color: T.danger, bg: T.dangerLight }, info: { icon: NotificationsNone, color: T.info, bg: T.infoLight }, edit: { icon: Edit, color: T.warning, bg: T.warningLight } };
                  const s = iconMap[log.type];
                  const Icon = s.icon;
                  return (
                    <Box key={i} display="flex" gap={2} sx={{ pb: 2.5, borderBottom: i < AUDIT_LOG.length - 1 ? `1px dashed ${T.border}` : "none", mb: 2.5 }}>
                      <Box sx={{ p: 1, borderRadius: "10px", bgcolor: s.bg, color: s.color, height: "fit-content", flexShrink: 0 }}>
                        <Icon sx={{ fontSize: 18 }} />
                      </Box>
                      <Box flexGrow={1}>
                        <Typography sx={{ fontFamily: fontBody, fontSize: "0.82rem", color: T.text, fontWeight: 500, lineHeight: 1.5 }}>{log.action}</Typography>
                        <Box display="flex" gap={1.5} mt={0.5}>
                          <Typography sx={{ fontFamily: fontBody, fontSize: "0.7rem", color: T.textMute }}>by <strong>{log.user}</strong></Typography>
                          <Typography sx={{ fontFamily: fontBody, fontSize: "0.7rem", color: T.textMute }}>·</Typography>
                          <Typography sx={{ fontFamily: fontMono, fontSize: "0.7rem", color: T.textMute }}>{log.time}</Typography>
                        </Box>
                      </Box>
                    </Box>
                  );
                })}
              </Box>
            </Box>
          )}

        </Box>
      </Card>

      {/* ── Action Dialog ── */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} PaperProps={{ sx: { borderRadius: "16px", width: 460, border: `1px solid ${T.border}`, boxShadow: "0 20px 60px rgba(0,0,0,0.12)" } }}>
        <DialogTitle sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1rem", color: T.text, pb: 1, pt: 3, px: 3 }}>
          {dialogData?.action === "approve" ? "Approve Leave Request" : dialogData?.action === "reject" ? "Reject Leave Request" : "Request Clarification"}
        </DialogTitle>
        <DialogContent sx={{ px: 3, pb: 1 }}>
          {dialogData && (
            <Box>
              <Box sx={{ p: 2, borderRadius: "10px", bgcolor: T.bg, border: `1px solid ${T.border}`, mb: 2 }}>
                <Typography sx={{ fontFamily: fontBody, fontWeight: 600, fontSize: "0.85rem", color: T.text }}>{dialogData.row.faculty}</Typography>
                <Typography sx={{ fontFamily: fontBody, fontSize: "0.75rem", color: T.textMute, mt: 0.3 }}>
                  {dialogData.row.type} · {dialogData.row.from} – {dialogData.row.to} · {dialogData.row.days} day(s)
                </Typography>
              </Box>
              {dialogData.action === "approve" && dialogData.row.conflict && (
                <Alert severity="warning" sx={{ mb: 2, borderRadius: "10px", fontFamily: fontBody, fontSize: "0.78rem" }}>
                  Approving this creates a dept conflict on {dialogData.row.from}.
                </Alert>
              )}
              <SLabel sx={{ mb: 0.8 }}>{dialogData.action === "clarify" ? "Clarification Message" : "Remarks (optional)"}</SLabel>
              <TextField fullWidth multiline rows={3} size="small" placeholder={dialogData.action === "clarify" ? "Specify what information is needed..." : "Add remarks for the record..."}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px", fontFamily: fontBody, "& fieldset": { borderColor: T.border }, "&.Mui-focused fieldset": { borderColor: T.accent } } }} />
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          <Button onClick={() => setDialogOpen(false)} variant="outlined"
            sx={{ fontFamily: fontBody, fontWeight: 600, fontSize: "0.8rem", textTransform: "none", borderRadius: "8px", borderColor: T.border, color: T.textSub }}>
            Cancel
          </Button>
          <Button variant="contained"
            sx={{ fontFamily: fontBody, fontWeight: 700, fontSize: "0.8rem", textTransform: "none", borderRadius: "8px", boxShadow: "none",
              background: dialogData?.action === "approve" ? T.success : dialogData?.action === "reject" ? T.danger : T.info,
              "&:hover": { boxShadow: "none", filter: "brightness(0.9)" }
            }}
            startIcon={dialogData?.action === "approve" ? <CheckCircle /> : dialogData?.action === "reject" ? <Cancel /> : <Send />}>
            {dialogData?.action === "approve" ? "Confirm Approve" : dialogData?.action === "reject" ? "Confirm Reject" : "Send Request"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default LeaveApprovalView;