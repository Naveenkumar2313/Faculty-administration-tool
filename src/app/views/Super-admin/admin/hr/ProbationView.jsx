import React, { useState, useMemo } from "react";
import {
  Box, Grid, Typography, Button, Table, TableBody, TableCell,
  TableHead, TableRow, IconButton, Tooltip, Dialog, DialogTitle,
  DialogContent, DialogActions, Checkbox, TextField,
  Stack, Snackbar, Alert, Divider, Avatar, InputAdornment
} from "@mui/material";
import {
  Timer, CheckCircle, AssignmentInd, School,
  VerifiedUser, HourglassEmpty, ReportProblem, Print,
  Close, Search, FilterList, Download, Refresh,
  Warning, Block, ArrowForward, CalendarMonth,
  Person, Feedback, Science, Shield, Edit,
  TrendingUp, InfoOutlined, CheckBox
} from "@mui/icons-material";

/* ─────────────────────────────────────────
   DESIGN TOKENS
───────────────────────────────────────── */
const T = {
  bg:           "#F5F7FA",
  surface:      "#FFFFFF",
  border:       "#E4E8EF",
  accent:       "#6366F1",
  accentLight:  "#EEF2FF",
  success:      "#10B981",
  successLight: "#ECFDF5",
  warning:      "#F59E0B",
  warningLight: "#FFFBEB",
  danger:       "#EF4444",
  dangerLight:  "#FEF2F2",
  purple:       "#7C3AED",
  purpleLight:  "#F5F3FF",
  info:         "#0EA5E9",
  infoLight:    "#F0F9FF",
  text:         "#111827",
  textSub:      "#4B5563",
  textMute:     "#9CA3AF",
};

const fHead = "Roboto, Helvetica, Arial, sans-serif";
const fBody = "Roboto, Helvetica, Arial, sans-serif";
const fMono = "Roboto, Helvetica, Arial, sans-serif";

const Fonts = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Sora:wght@600;700&family=Nunito:wght@400;500;600;700&family=JetBrains+Mono:wght@500;600&display=swap');
    * { box-sizing:border-box; }
    @keyframes fadeUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:none} }
    @keyframes pulse  { 0%,100%{opacity:1} 50%{opacity:.4} }
    .fu  { animation: fadeUp 0.32s ease both; }
    .fu1 { animation: fadeUp 0.32s .06s ease both; }
    .fu2 { animation: fadeUp 0.32s .12s ease both; }
    .fu3 { animation: fadeUp 0.32s .18s ease both; }
    .row-h:hover { background:#F9FAFB !important; transition:background .15s; }
    .blink { animation: pulse 2s infinite; }
    .card-h { transition:box-shadow .18s,transform .18s; cursor:pointer; }
    .card-h:hover { box-shadow:0 6px 24px rgba(99,102,241,.12); transform:translateY(-2px); }
  `}</style>
);

/* ─────────────────────────────────────────
   MOCK DATA
───────────────────────────────────────── */
const FACULTY_INIT = [
  {
    id:1, name:"Mr. Arjun Singh",    avatar:"AS", dept:"CSE",       joinDate:"2025-06-01",
    probationEnd:"2026-06-01", attendance:92, feedback:4.5,
    research:"2 Scopus Papers", teaching:"Good", disciplinary:"None",
    status:"On Track",
  },
  {
    id:2, name:"Ms. Neha Gupta",     avatar:"NG", dept:"ECE",       joinDate:"2025-08-15",
    probationEnd:"2026-02-15", attendance:88, feedback:3.8,
    research:"In Progress", teaching:"Average", disciplinary:"None",
    status:"Due Soon",
  },
  {
    id:3, name:"Dr. K. Reddy",       avatar:"KR", dept:"Civil",     joinDate:"2025-01-10",
    probationEnd:"2026-01-10", attendance:75, feedback:4.2,
    research:"None", teaching:"Good", disciplinary:"1 Warning",
    status:"Overdue",
  },
  {
    id:4, name:"Ms. Priya Menon",    avatar:"PM", dept:"Electrical", joinDate:"2025-03-20",
    probationEnd:"2026-03-20", attendance:96, feedback:4.8,
    research:"1 Paper", teaching:"Excellent", disciplinary:"None",
    status:"On Track",
  },
  {
    id:5, name:"Mr. Rahul Bose",     avatar:"RB", dept:"Mech",      joinDate:"2024-11-01",
    probationEnd:"2025-11-01", attendance:80, feedback:3.5,
    research:"None", teaching:"Below Avg", disciplinary:"None",
    status:"Extended",
  },
  {
    id:6, name:"Dr. Sunita Pillai",  avatar:"SP", dept:"Science",   joinDate:"2024-06-01",
    probationEnd:"2025-06-01", attendance:97, feedback:4.9,
    research:"3 Papers", teaching:"Excellent", disciplinary:"None",
    status:"Confirmed",
  },
];

const AVATAR_COLORS = [
  { bg:"#EEF2FF", color:"#6366F1" },
  { bg:"#ECFDF5", color:"#10B981" },
  { bg:"#F5F3FF", color:"#7C3AED" },
  { bg:"#FFFBEB", color:"#F59E0B" },
  { bg:"#F0F9FF", color:"#0EA5E9" },
  { bg:"#FEF2F2", color:"#EF4444" },
];
const avatarColor = (name) => AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];

const STATUS_META = {
  "On Track":  { color:T.accent,   bg:T.accentLight,   label:"On Track"  },
  "Due Soon":  { color:T.warning,  bg:T.warningLight,  label:"Due Soon"  },
  "Overdue":   { color:T.danger,   bg:T.dangerLight,   label:"Overdue"   },
  "Extended":  { color:T.purple,   bg:T.purpleLight,   label:"Extended"  },
  "Confirmed": { color:T.success,  bg:T.successLight,  label:"Confirmed" },
  "Terminated":{ color:"#64748B",  bg:"#F1F5F9",       label:"Terminated"},
};

const getDaysRemaining = (endDate) => {
  const diff = new Date(endDate) - new Date();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

const getProgress = (joinDate, endDate) => {
  const total = new Date(endDate) - new Date(joinDate);
  const elapsed = new Date() - new Date(joinDate);
  return Math.min(100, Math.max(0, Math.round((elapsed / total) * 100)));
};

/* ─────────────────────────────────────────
   PRIMITIVES
───────────────────────────────────────── */
const SCard = ({ children, sx={}, hover=false, ...p }) => (
  <Box className={hover ? "card-h" : ""}
    sx={{ background:T.surface, border:`1px solid ${T.border}`,
      borderRadius:"14px", ...sx }} {...p}>
    {children}
  </Box>
);

const SLabel = ({ children, sx={} }) => (
  <Typography sx={{ fontFamily:fBody, fontSize:"0.67rem", fontWeight:700,
    letterSpacing:"0.08em", textTransform:"uppercase", color:T.textMute, mb:0.5, ...sx }}>
    {children}
  </Typography>
);

const TH = ({ children, align, sx={} }) => (
  <TableCell align={align} sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.68rem",
    letterSpacing:"0.06em", textTransform:"uppercase", color:T.textMute,
    borderBottom:`1px solid ${T.border}`, py:1.5, bgcolor:"#F9FAFB",
    whiteSpace:"nowrap", ...sx }}>
    {children}
  </TableCell>
);

const TD = ({ children, sx={}, align }) => (
  <TableCell align={align} sx={{ fontFamily:fBody, fontSize:"0.81rem", color:T.textSub,
    borderBottom:`1px solid ${T.border}`, py:1.8, ...sx }}>
    {children}
  </TableCell>
);

const StatusPill = ({ status }) => {
  const s = STATUS_META[status] || { color:T.textMute, bg:"#F1F5F9" };
  return (
    <Box display="flex" alignItems="center" gap={0.6}
      sx={{ px:1.2, py:0.38, borderRadius:"99px", bgcolor:s.bg, width:"fit-content" }}>
      <Box sx={{ width:6, height:6, borderRadius:"50%", bgcolor:s.color,
        ...(status === "On Track" ? { animation:"pulse 2s infinite" } : {}) }} />
      <Typography sx={{ fontFamily:fBody, fontSize:"0.71rem", fontWeight:700, color:s.color }}>
        {s.label}
      </Typography>
    </Box>
  );
};

const ProgBar = ({ pct, color=T.accent, height=6 }) => (
  <Box sx={{ height, borderRadius:99, bgcolor:T.border, overflow:"hidden" }}>
    <Box sx={{ height:"100%", width:`${Math.min(pct,100)}%`, borderRadius:99,
      bgcolor: pct >= 90 ? T.danger : pct >= 75 ? T.warning : color,
      transition:"width 1.2s ease" }} />
  </Box>
);

/* Metric chip */
const MetricBadge = ({ value, threshold, label, icon:Icon }) => {
  const ok = typeof threshold === "number" ? value >= threshold : value !== "None";
  return (
    <Box sx={{ px:1, py:0.5, borderRadius:"7px",
      bgcolor: ok ? T.successLight : T.dangerLight,
      border:`1px solid ${ok ? T.success : T.danger}20`,
      display:"flex", alignItems:"center", gap:0.5 }}>
      <Icon sx={{ fontSize:11, color: ok ? T.success : T.danger }} />
      <Typography sx={{ fontFamily:fMono, fontSize:"0.67rem", fontWeight:700,
        color: ok ? T.success : T.danger }}>
        {label || value}
      </Typography>
    </Box>
  );
};

/* Checklist item */
const CheckItem = ({ label, checked, onChange, hint }) => (
  <Box sx={{ py:1.2, px:1.5, borderRadius:"9px",
    border:`1.5px solid ${checked ? T.success+"50" : T.border}`,
    bgcolor: checked ? T.successLight : "#F9FAFB",
    display:"flex", alignItems:"flex-start", gap:1,
    transition:"all .15s", mb:1 }}>
    <Checkbox size="small" checked={checked} onChange={onChange}
      sx={{ p:0, mt:0.15, color:T.border,
        "&.Mui-checked":{ color:T.success } }} />
    <Box>
      <Typography sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.81rem",
        color: checked ? T.success : T.text }}>{label}</Typography>
      {hint && (
        <Typography sx={{ fontFamily:fBody, fontSize:"0.7rem", color:T.textMute, mt:0.15 }}>
          {hint}
        </Typography>
      )}
    </Box>
    {checked && <CheckCircle sx={{ fontSize:14, color:T.success, ml:"auto", mt:0.2, flexShrink:0 }} />}
  </Box>
);

/* ═════════════════════════════════════════════
   MAIN COMPONENT
═════════════════════════════════════════════ */
const ProbationView = () => {
  const [facultyList, setFacultyList] = useState(FACULTY_INIT);
  const [openReview,  setOpenReview]  = useState(false);
  const [selected,    setSelected]    = useState(null);
  const [checklist,   setChecklist]   = useState({});
  const [remarks,     setRemarks]     = useState("");
  const [search,      setSearch]      = useState("");
  const [filterSt,    setFilterSt]    = useState("All");
  const [snack,       setSnack]       = useState({ open:false, msg:"", severity:"success" });

  const toast = (msg, severity="success") => setSnack({ open:true, msg, severity });

  /* ── Derived stats ── */
  const active    = facultyList.filter(f => !["Confirmed","Terminated"].includes(f.status));
  const dueSoon   = facultyList.filter(f => {
    const d = getDaysRemaining(f.probationEnd);
    return d <= 30 && d >= 0 && !["Confirmed","Terminated"].includes(f.status);
  });
  const overdue   = facultyList.filter(f => getDaysRemaining(f.probationEnd) < 0 && f.status === "Overdue");
  const confirmed = facultyList.filter(f => f.status === "Confirmed");

  /* ── Filtered list ── */
  const filtered = useMemo(() => facultyList.filter(f => {
    const q = search.toLowerCase();
    if (q && !f.name.toLowerCase().includes(q) && !f.dept.toLowerCase().includes(q)) return false;
    if (filterSt !== "All" && f.status !== filterSt) return false;
    return true;
  }), [facultyList, search, filterSt]);

  /* ── Open review dialog ── */
  const handleOpenReview = (faculty) => {
    setSelected(faculty);
    setChecklist({
      attendance:   faculty.attendance >= 85,
      feedback:     faculty.feedback >= 4.0,
      research:     faculty.research !== "None",
      disciplinary: faculty.disciplinary === "None",
    });
    setRemarks("");
    setOpenReview(true);
  };

  /* ── Actions ── */
  const handleConfirm = () => {
    setFacultyList(p => p.map(f => f.id === selected.id ? { ...f, status:"Confirmed" } : f));
    setOpenReview(false);
    toast(`${selected.name} confirmed as regular employee. Appointment letter generated.`);
  };

  const handleExtend = () => {
    if (!remarks.trim()) { toast("Please add a reason for extension.", "error"); return; }
    setFacultyList(p => p.map(f => f.id === selected.id ? { ...f, status:"Extended" } : f));
    setOpenReview(false);
    toast(`Probation extended for ${selected.name}.`, "warning");
  };

  const handleTerminate = () => {
    if (!remarks.trim()) { toast("Please add termination remarks.", "error"); return; }
    setFacultyList(p => p.map(f => f.id === selected.id ? { ...f, status:"Terminated" } : f));
    setOpenReview(false);
    toast(`Probation terminated for ${selected.name}.`, "error");
  };

  const allChecked = checklist && Object.values(checklist).every(Boolean);

  const STATUS_OPTIONS = ["All","On Track","Due Soon","Overdue","Extended","Confirmed","Terminated"];

  /* ─────────────────────────────────────────
     RENDER
  ───────────────────────────────────────── */
  return (
    <Box sx={{ p:3, bgcolor:T.bg, minHeight:"100vh", fontFamily:fBody }}>
      <Fonts />

      {/* ── Header ── */}
      <Box display="flex" justifyContent="space-between" alignItems="flex-start"
        mb={3} flexWrap="wrap" gap={2}>
        <Box>
          <Typography sx={{ fontFamily:fBody, fontSize:"0.72rem", fontWeight:700,
            letterSpacing:"0.1em", textTransform:"uppercase", color:T.textMute, mb:0.3 }}>
            Admin Dashboard · Human Resources
          </Typography>
          <Typography sx={{ fontFamily:fHead, fontWeight:700, fontSize:"1.5rem", color:T.text }}>
            Probation Tracking &amp; Confirmation
          </Typography>
          <Typography sx={{ fontFamily:fBody, fontSize:"0.82rem", color:T.textSub, mt:0.3 }}>
            Monitor probationary faculty, conduct performance reviews, and issue confirmation orders.
          </Typography>
        </Box>
        <Button size="small" variant="outlined"
          startIcon={<Download sx={{fontSize:15}} />}
          onClick={() => toast("Probation status report exported.")}
          sx={{ fontFamily:fBody, fontWeight:600, fontSize:"0.76rem", textTransform:"none",
            borderRadius:"8px", borderColor:T.border, color:T.textSub, mt:0.5,
            "&:hover":{ borderColor:T.accent, color:T.accent } }}>
          Export Report
        </Button>
      </Box>

      {/* ── Stat Strip ── */}
      <Grid container spacing={2} mb={3}>
        {[
          { label:"Active Probations",    value:active.length,    sub:"Currently under review",  color:T.accent,  Icon:HourglassEmpty },
          { label:"Due ≤ 30 Days",        value:dueSoon.length,   sub:"Require immediate action", color:T.warning, Icon:Timer         },
          { label:"Overdue",              value:overdue.length,   sub:"Review pending/delayed",   color:T.danger,  Icon:ReportProblem },
          { label:"Confirmed This Year",  value:confirmed.length, sub:"Successfully regularised",  color:T.success, Icon:VerifiedUser  },
        ].map((s,i) => (
          <Grid item xs={6} md={3} key={i}>
            <SCard hover sx={{ p:2.5 }} className={`fu${i}`}>
              <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                <Box>
                  <SLabel>{s.label}</SLabel>
                  <Typography sx={{ fontFamily:fMono, fontWeight:700, fontSize:"1.75rem",
                    color:s.color, lineHeight:1.1 }}>{s.value}</Typography>
                  <Typography sx={{ fontFamily:fBody, fontSize:"0.7rem",
                    color:T.textMute, mt:0.4 }}>{s.sub}</Typography>
                </Box>
                <Box sx={{ p:1.1, borderRadius:"10px", bgcolor:`${s.color}15`, color:s.color }}>
                  <s.Icon sx={{ fontSize:20 }} />
                </Box>
              </Box>
            </SCard>
          </Grid>
        ))}
      </Grid>

      {/* ── Main Table Card ── */}
      <SCard sx={{ overflow:"hidden" }} className="fu1">

        {/* Filter bar */}
        <Box sx={{ px:2.5, py:2, borderBottom:`1px solid ${T.border}`,
          bgcolor:"#FAFBFD", display:"flex",
          gap:1.5, flexWrap:"wrap", alignItems:"center" }}>
          {/* Search */}
          <TextField size="small" placeholder="Search by name or department…"
            value={search} onChange={e => setSearch(e.target.value)}
            InputProps={{ startAdornment:
              <InputAdornment position="start">
                <Search sx={{ fontSize:16, color:T.textMute }} />
              </InputAdornment>
            }}
            sx={{ flex:"1 1 220px",
              "& .MuiOutlinedInput-root":{ borderRadius:"8px",
                fontFamily:fBody, fontSize:"0.8rem", bgcolor:T.surface,
                "& fieldset":{ borderColor:T.border },
                "&.Mui-focused fieldset":{ borderColor:T.accent } }}}
          />

          {/* Status filter pills */}
          <Box display="flex" gap={0.8} flexWrap="wrap">
            {STATUS_OPTIONS.map(s => (
              <Box key={s} onClick={() => setFilterSt(s)}
                sx={{ px:1.3, py:0.4, borderRadius:"99px", cursor:"pointer",
                  fontFamily:fBody, fontSize:"0.72rem", fontWeight:700,
                  border:`1.5px solid ${filterSt===s ? T.accent : T.border}`,
                  bgcolor: filterSt===s ? T.accentLight : "transparent",
                  color:   filterSt===s ? T.accent      : T.textMute,
                  transition:"all .13s",
                  "&:hover":{ borderColor:T.accent, color:T.accent } }}>
                {s}
              </Box>
            ))}
          </Box>

          <Tooltip title="Reset filters">
            <IconButton size="small" onClick={() => { setSearch(""); setFilterSt("All"); }}
              sx={{ borderRadius:"8px", border:`1px solid ${T.border}`,
                "&:hover":{ bgcolor:T.dangerLight, color:T.danger } }}>
              <Refresh sx={{ fontSize:16 }} />
            </IconButton>
          </Tooltip>
        </Box>

        {/* Table */}
        <Box sx={{ overflowX:"auto" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TH>Faculty</TH>
                <TH>Dept</TH>
                <TH>Join Date</TH>
                <TH>Probation End</TH>
                <TH sx={{ minWidth:160 }}>Timeline Progress</TH>
                <TH>Performance</TH>
                <TH>Status</TH>
                <TH align="center">Action</TH>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map(row => {
                const daysLeft = getDaysRemaining(row.probationEnd);
                const pct      = getProgress(row.joinDate, row.probationEnd);
                const av       = avatarColor(row.name);
                const overdue  = daysLeft < 0;
                const termOrConf = ["Confirmed","Terminated"].includes(row.status);

                return (
                  <TableRow key={row.id} className="row-h">

                    {/* Faculty */}
                    <TD sx={{ minWidth:190 }}>
                      <Box display="flex" alignItems="center" gap={1.5}>
                        <Avatar sx={{ width:34, height:34,
                          bgcolor:av.bg, color:av.color,
                          fontFamily:fHead, fontSize:"0.72rem", fontWeight:700 }}>
                          {row.avatar}
                        </Avatar>
                        <Box>
                          <Typography sx={{ fontFamily:fBody, fontWeight:700,
                            fontSize:"0.83rem", color:T.text }}>{row.name}</Typography>
                          <Typography sx={{ fontFamily:fBody, fontSize:"0.68rem",
                            color:T.textMute }}>Joined {row.joinDate}</Typography>
                        </Box>
                      </Box>
                    </TD>

                    {/* Dept */}
                    <TD>
                      <Box sx={{ px:0.9, py:0.25, borderRadius:"6px",
                        bgcolor:T.accentLight, display:"inline-block" }}>
                        <Typography sx={{ fontFamily:fBody, fontSize:"0.7rem",
                          fontWeight:700, color:T.accent }}>{row.dept}</Typography>
                      </Box>
                    </TD>

                    {/* Join date */}
                    <TD>
                      <Typography sx={{ fontFamily:fMono, fontSize:"0.76rem" }}>
                        {row.joinDate}
                      </Typography>
                    </TD>

                    {/* Probation end */}
                    <TD>
                      <Typography sx={{ fontFamily:fMono, fontSize:"0.76rem",
                        fontWeight:700,
                        color: overdue ? T.danger : daysLeft <= 30 ? T.warning : T.text }}>
                        {row.probationEnd}
                      </Typography>
                    </TD>

                    {/* Timeline progress */}
                    <TD sx={{ minWidth:175 }}>
                      <Box display="flex" justifyContent="space-between" mb={0.6}>
                        <Typography sx={{ fontFamily:fBody, fontSize:"0.69rem",
                          color:T.textMute }}>{pct}% elapsed</Typography>
                        <Typography sx={{ fontFamily:fMono, fontSize:"0.69rem",
                          fontWeight:700,
                          color: overdue ? T.danger : daysLeft <= 30 ? T.warning : T.accent }}>
                          {overdue
                            ? `${Math.abs(daysLeft)}d overdue`
                            : `${daysLeft}d left`}
                        </Typography>
                      </Box>
                      <Box sx={{ height:6, borderRadius:99, bgcolor:T.border, overflow:"hidden" }}>
                        <Box sx={{ height:"100%", borderRadius:99,
                          width:`${Math.min(pct, 100)}%`,
                          bgcolor: overdue ? T.danger : daysLeft <= 30 ? T.warning : T.accent,
                          transition:"width 1.2s ease" }} />
                      </Box>
                    </TD>

                    {/* Performance metrics */}
                    <TD sx={{ minWidth:180 }}>
                      <Box display="flex" gap={0.6} flexWrap="wrap">
                        <MetricBadge
                          value={row.attendance}
                          threshold={85}
                          label={`${row.attendance}%`}
                          icon={Person}
                        />
                        <MetricBadge
                          value={row.feedback}
                          threshold={4.0}
                          label={`${row.feedback}★`}
                          icon={Feedback}
                        />
                        <MetricBadge
                          value={row.research}
                          label={row.research === "None" ? "No Pub." : "Pub. ✓"}
                          icon={Science}
                        />
                      </Box>
                    </TD>

                    {/* Status */}
                    <TD><StatusPill status={row.status} /></TD>

                    {/* Action */}
                    <TD align="center">
                      {row.status === "Confirmed" || row.status === "Terminated" ? (
                        <Tooltip title={row.status === "Confirmed"
                          ? "Download appointment letter"
                          : "View termination order"}>
                          <Button size="small" variant="outlined"
                            startIcon={<Print sx={{fontSize:13}} />}
                            onClick={() => toast(`${row.status === "Confirmed" ? "Appointment letter" : "Termination order"} for ${row.name} downloading…`)}
                            sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.72rem",
                              textTransform:"none", borderRadius:"7px",
                              borderColor: row.status === "Confirmed" ? T.success : T.border,
                              color:       row.status === "Confirmed" ? T.success : T.textMute,
                              "&:hover":{ bgcolor: row.status === "Confirmed" ? T.successLight : "#F1F5F9" } }}>
                            {row.status === "Confirmed" ? "Letter" : "Order"}
                          </Button>
                        </Tooltip>
                      ) : (
                        <Tooltip title="Open performance review">
                          <Button size="small" variant="contained"
                            startIcon={<AssignmentInd sx={{fontSize:13}} />}
                            onClick={() => handleOpenReview(row)}
                            sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.72rem",
                              textTransform:"none", borderRadius:"7px",
                              bgcolor:T.accent, boxShadow:"none",
                              "&:hover":{ bgcolor:"#4F46E5", boxShadow:"none" } }}>
                            Review
                          </Button>
                        </Tooltip>
                      )}
                    </TD>
                  </TableRow>
                );
              })}

              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} sx={{ textAlign:"center", py:7 }}>
                    <HourglassEmpty sx={{ fontSize:40, color:T.border, display:"block", mx:"auto", mb:1.5 }} />
                    <Typography sx={{ fontFamily:fBody, color:T.textMute }}>
                      No probationary faculty match the current filters.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Box>

        {/* Footer */}
        <Box sx={{ px:2.5, py:2, borderTop:`1px solid ${T.border}`, bgcolor:"#FAFBFD",
          display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <Typography sx={{ fontFamily:fBody, fontSize:"0.74rem", color:T.textMute }}>
            Showing <Box component="span" sx={{ fontFamily:fMono, fontWeight:700,
              color:T.accent }}>{filtered.length}</Box> of {facultyList.length} records
          </Typography>
          <Box display="flex" alignItems="center" gap={1}>
            <InfoOutlined sx={{ fontSize:13, color:T.textMute }} />
            <Typography sx={{ fontFamily:fBody, fontSize:"0.72rem", color:T.textMute }}>
              Metrics: green = meets threshold · red = below threshold
            </Typography>
          </Box>
        </Box>
      </SCard>

      {/* ══════════════════════════════════════
          REVIEW DIALOG
      ══════════════════════════════════════ */}
      <Dialog open={openReview} onClose={() => setOpenReview(false)}
        maxWidth="sm" fullWidth
        PaperProps={{ sx:{ borderRadius:"16px", border:`1px solid ${T.border}`,
          maxHeight:"90vh" } }}>

        {selected && (
          <>
            <DialogTitle sx={{ borderBottom:`1px solid ${T.border}`,
              bgcolor:"#FAFBFD", pb:2 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box display="flex" alignItems="center" gap={1.5}>
                  <Box sx={{ width:4, height:28, borderRadius:2, bgcolor:T.accent }} />
                  <Box>
                    <Typography sx={{ fontFamily:fHead, fontWeight:700,
                      fontSize:"0.96rem", color:T.text }}>
                      Performance Review
                    </Typography>
                    <Typography sx={{ fontFamily:fBody, fontSize:"0.73rem",
                      color:T.textMute }}>{selected.name} · {selected.dept}</Typography>
                  </Box>
                </Box>
                <Box display="flex" alignItems="center" gap={1}>
                  <StatusPill status={selected.status} />
                  <IconButton size="small" onClick={() => setOpenReview(false)}
                    sx={{ bgcolor:"#F1F5F9", borderRadius:"8px" }}>
                    <Close fontSize="small" />
                  </IconButton>
                </Box>
              </Box>
            </DialogTitle>

            <DialogContent sx={{ px:3, pt:3, pb:2 }}>

              {/* Performance snapshot */}
              <Typography sx={{ fontFamily:fHead, fontWeight:700,
                fontSize:"0.82rem", color:T.text, mb:1.5 }}>
                Performance Snapshot
              </Typography>

              <Grid container spacing={1.5} mb={2.5}>
                {[
                  { label:"Attendance",          value:`${selected.attendance}%`, threshold:85,   Icon:Person,    ok: selected.attendance >= 85 },
                  { label:"Student Feedback",     value:`${selected.feedback}/5`,  threshold:4.0,  Icon:Feedback,  ok: selected.feedback >= 4.0  },
                  { label:"Research Output",      value:selected.research,         threshold:null, Icon:Science,   ok: selected.research !== "None" },
                  { label:"Teaching Quality",     value:selected.teaching,         threshold:null, Icon:School,    ok: !["Below Avg","Poor"].includes(selected.teaching) },
                  { label:"Disciplinary Record",  value:selected.disciplinary,     threshold:null, Icon:Shield,    ok: selected.disciplinary === "None" },
                ].map(m => (
                  <Grid item xs={6} key={m.label}>
                    <Box sx={{ p:1.5, borderRadius:"9px",
                      border:`1px solid ${m.ok ? T.success+"30" : T.danger+"30"}`,
                      bgcolor: m.ok ? T.successLight : T.dangerLight }}>
                      <Box display="flex" alignItems="center" gap={0.7} mb={0.4}>
                        <m.Icon sx={{ fontSize:13, color: m.ok ? T.success : T.danger }} />
                        <SLabel sx={{ mb:0, color: m.ok ? T.success : T.danger }}>
                          {m.label}
                        </SLabel>
                      </Box>
                      <Typography sx={{ fontFamily:fMono, fontWeight:700,
                        fontSize:"0.82rem",
                        color: m.ok ? T.success : T.danger }}>
                        {m.value}
                      </Typography>
                      {m.threshold && (
                        <Typography sx={{ fontFamily:fBody, fontSize:"0.65rem",
                          color: m.ok ? T.success : T.danger, mt:0.2 }}>
                          Threshold: {m.threshold}{typeof m.threshold === "number" && m.label.includes("Attendance") ? "%" : ""}
                        </Typography>
                      )}
                    </Box>
                  </Grid>
                ))}

                {/* Days status */}
                <Grid item xs={6}>
                  {(() => {
                    const d = getDaysRemaining(selected.probationEnd);
                    const overdue = d < 0;
                    return (
                      <Box sx={{ p:1.5, borderRadius:"9px",
                        border:`1px solid ${overdue ? T.danger+"30" : T.warning+"30"}`,
                        bgcolor: overdue ? T.dangerLight : T.warningLight }}>
                        <Box display="flex" alignItems="center" gap={0.7} mb={0.4}>
                          <Timer sx={{ fontSize:13, color: overdue ? T.danger : T.warning }} />
                          <SLabel sx={{ mb:0, color: overdue ? T.danger : T.warning }}>
                            Timeline
                          </SLabel>
                        </Box>
                        <Typography sx={{ fontFamily:fMono, fontWeight:700,
                          fontSize:"0.82rem",
                          color: overdue ? T.danger : T.warning }}>
                          {overdue ? `${Math.abs(d)}d overdue` : `${d}d remaining`}
                        </Typography>
                        <Typography sx={{ fontFamily:fBody, fontSize:"0.65rem",
                          color: overdue ? T.danger : T.warning, mt:0.2 }}>
                          End: {selected.probationEnd}
                        </Typography>
                      </Box>
                    );
                  })()}
                </Grid>
              </Grid>

              <Divider sx={{ borderColor:T.border, mb:2 }} />

              {/* Confirmation checklist */}
              <Typography sx={{ fontFamily:fHead, fontWeight:700,
                fontSize:"0.82rem", color:T.text, mb:1.5 }}>
                Confirmation Checklist
              </Typography>

              <Box>
                <CheckItem
                  label="Attendance Requirement Met"
                  hint="Minimum 85% required for confirmation"
                  checked={checklist.attendance}
                  onChange={e => setChecklist(p => ({ ...p, attendance:e.target.checked }))}
                />
                <CheckItem
                  label="Satisfactory Teaching Feedback"
                  hint="Student feedback score ≥ 4.0/5.0"
                  checked={checklist.feedback}
                  onChange={e => setChecklist(p => ({ ...p, feedback:e.target.checked }))}
                />
                <CheckItem
                  label="Research Output / Publications Verified"
                  hint="At least one publication or ongoing work"
                  checked={checklist.research}
                  onChange={e => setChecklist(p => ({ ...p, research:e.target.checked }))}
                />
                <CheckItem
                  label="No Disciplinary Actions Pending"
                  hint="No warnings, show-cause notices, or enquiries"
                  checked={checklist.disciplinary}
                  onChange={e => setChecklist(p => ({ ...p, disciplinary:e.target.checked }))}
                />
              </Box>

              {/* Checklist progress bar */}
              <Box sx={{ mb:2, mt:0.5 }}>
                {(() => {
                  const passed = Object.values(checklist).filter(Boolean).length;
                  const total  = Object.values(checklist).length;
                  const pct    = Math.round((passed / total) * 100);
                  return (
                    <Box sx={{ p:1.5, borderRadius:"9px", bgcolor:"#F9FAFB",
                      border:`1px solid ${T.border}` }}>
                      <Box display="flex" justifyContent="space-between" mb={0.6}>
                        <Typography sx={{ fontFamily:fBody, fontSize:"0.73rem",
                          fontWeight:700, color:T.textSub }}>
                          Criteria Satisfied
                        </Typography>
                        <Typography sx={{ fontFamily:fMono, fontSize:"0.73rem",
                          fontWeight:700,
                          color: pct === 100 ? T.success : T.warning }}>
                          {passed}/{total}
                        </Typography>
                      </Box>
                      <Box sx={{ height:6, borderRadius:99, bgcolor:T.border, overflow:"hidden" }}>
                        <Box sx={{ height:"100%", borderRadius:99,
                          width:`${pct}%`,
                          bgcolor: pct === 100 ? T.success : T.warning,
                          transition:"width .4s ease" }} />
                      </Box>
                    </Box>
                  );
                })()}
              </Box>

              {/* Remarks */}
              <TextField fullWidth multiline rows={3}
                label="Admin Remarks / Extension Reason"
                placeholder="Enter remarks, extension reason, or observations…"
                value={remarks}
                onChange={e => setRemarks(e.target.value)}
                sx={{ "& .MuiOutlinedInput-root":{ borderRadius:"9px",
                  fontFamily:fBody, fontSize:"0.82rem",
                  "& fieldset":{ borderColor:T.border },
                  "&.Mui-focused fieldset":{ borderColor:T.accent } },
                  "& .MuiInputLabel-root.Mui-focused":{ color:T.accent } }}
              />

              {/* Not all criteria met warning */}
              {!allChecked && (
                <Box sx={{ mt:1.5, p:1.5, borderRadius:"8px",
                  bgcolor:T.warningLight, border:`1px solid ${T.warning}25`,
                  display:"flex", gap:1, alignItems:"flex-start" }}>
                  <Warning sx={{ fontSize:15, color:T.warning, flexShrink:0, mt:0.1 }} />
                  <Typography sx={{ fontFamily:fBody, fontSize:"0.75rem",
                    color:T.warning, fontWeight:600 }}>
                    Not all criteria are met. Confirm Employment will be disabled until all checklist items are checked.
                    You may still extend or terminate the probation.
                  </Typography>
                </Box>
              )}
            </DialogContent>

            <DialogActions sx={{ px:3, pb:3, pt:2,
              borderTop:`1px solid ${T.border}`, bgcolor:"#FAFBFD",
              display:"flex", gap:1, justifyContent:"space-between" }}>
              {/* Left: destructive */}
              <Button variant="outlined" size="small"
                startIcon={<Block sx={{fontSize:14}} />}
                onClick={handleTerminate}
                sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.76rem",
                  textTransform:"none", borderRadius:"8px",
                  borderColor:T.danger, color:T.danger,
                  "&:hover":{ bgcolor:T.dangerLight } }}>
                Terminate
              </Button>

              {/* Right: extend + confirm */}
              <Box display="flex" gap={1}>
                <Button variant="outlined" size="small"
                  startIcon={<Timer sx={{fontSize:14}} />}
                  onClick={handleExtend}
                  sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.76rem",
                    textTransform:"none", borderRadius:"8px",
                    borderColor:T.warning, color:T.warning,
                    "&:hover":{ bgcolor:T.warningLight } }}>
                  Extend Probation
                </Button>
                <Button variant="contained" size="small"
                  startIcon={<CheckCircle sx={{fontSize:14}} />}
                  onClick={handleConfirm}
                  disabled={!allChecked}
                  sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.76rem",
                    textTransform:"none", borderRadius:"8px",
                    bgcolor: allChecked ? T.success : undefined,
                    boxShadow:"none",
                    "&:hover":{ bgcolor:"#059669", boxShadow:"none" },
                    "&.Mui-disabled":{ bgcolor:"#E5E7EB", color:T.textMute } }}>
                  Confirm &amp; Generate Letter
                </Button>
              </Box>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Snackbar */}
      <Snackbar open={snack.open} autoHideDuration={4000}
        onClose={() => setSnack(s => ({ ...s, open:false }))}
        anchorOrigin={{ vertical:"bottom", horizontal:"center" }}>
        <Alert severity={snack.severity}
          sx={{ borderRadius:"10px", fontFamily:fBody, fontWeight:600 }}
          onClose={() => setSnack(s => ({ ...s, open:false }))}>
          {snack.msg}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ProbationView;