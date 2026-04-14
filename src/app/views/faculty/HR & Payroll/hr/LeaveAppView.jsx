import React, { useState, useMemo } from "react";
import {
  Box, Grid, Typography, Button, TextField, MenuItem,
  Table, TableBody, TableCell, TableHead, TableRow,
  IconButton, Stack, Avatar, Divider, Tooltip,
  Dialog, DialogTitle, DialogContent, DialogActions,
  Snackbar, Alert, Tabs, Tab
} from "@mui/material";
import {
  Add, Cancel, EventAvailable, History,
  BeachAccess, MedicalServices, Work, Badge as BadgeIcon,
  Close, ChevronLeft, ChevronRight, CheckCircle, HourglassEmpty,
  Warning, FileDownload
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
  gold:         "#D97706",
  goldLight:    "#FEF3C7",
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
    @keyframes fadeUp { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:none} }
    @keyframes pulse  { 0%,100%{opacity:1} 50%{opacity:.35} }
    .fu  { animation: fadeUp 0.28s ease both; }
    .fu1 { animation: fadeUp 0.28s .07s ease both; }
    .fu2 { animation: fadeUp 0.28s .14s ease both; }
    .row-h:hover { background:#F9FAFB !important; transition:background .13s; }
    .card-h { transition:box-shadow .16s,transform .16s; }
    .card-h:hover { box-shadow:0 4px 20px rgba(99,102,241,.11); transform:translateY(-2px); }
    .cal-day { cursor:pointer; transition:background .12s; border-radius:8px; }
    .cal-day:hover { background:${T.accentLight}; }
  `}</style>
);

/* ─────────────────────────────────────────
   MOCK DATA
───────────────────────────────────────── */
const BALANCE_INIT = {
  "Casual Leave":   8,
  "Medical Leave":  6,
  "Earned Leave":   12,
  "On-Duty":        5,
};

const LEAVES_INIT = [
  { id:1,  type:"Casual Leave",  from:"2024-10-14", to:"2024-10-15", days:2, status:"Approved", reason:"Family function" },
  { id:2,  type:"Medical Leave", from:"2024-11-05", to:"2024-11-06", days:2, status:"Pending",  reason:"Doctor's appointment" },
  { id:3,  type:"Earned Leave",  from:"2024-09-20", to:"2024-09-22", days:3, status:"Approved", reason:"Personal travel" },
  { id:4,  type:"On-Duty",       from:"2024-08-12", to:"2024-08-12", days:1, status:"Approved", reason:"Conference at IIT Delhi" },
];

const DEPT_LEAVES = [
  { id:1, name:"Prof. Rajan Kumar",  date:"2024-11-04", type:"Casual Leave",  status:"Approved" },
  { id:2, name:"Dr. Emily Davis",    date:"2024-11-05", type:"Medical Leave", status:"Approved" },
  { id:3, name:"Ms. Priya Roy",      date:"2024-11-08", type:"Earned Leave",  status:"Pending"  },
  { id:4, name:"Dr. Vikram Nair",    date:"2024-11-12", type:"On-Duty",       status:"Pending"  },
];

const LEAVE_TYPES = [
  { value:"Casual Leave",  label:"Casual Leave (CL)",  Icon:BeachAccess,    color:T.accent  },
  { value:"Medical Leave", label:"Medical Leave (ML)", Icon:MedicalServices,color:T.danger  },
  { value:"Earned Leave",  label:"Earned Leave (EL)",  Icon:Work,           color:T.success },
  { value:"On-Duty",       label:"On Duty (OD)",       Icon:BadgeIcon,      color:T.gold    },
];

const LEAVE_TYPE_META = {
  "Casual Leave":  { color:T.accent,  bg:T.accentLight  },
  "Medical Leave": { color:T.danger,  bg:T.dangerLight  },
  "Earned Leave":  { color:T.success, bg:T.successLight },
  "On-Duty":       { color:T.gold,    bg:T.goldLight    },
};

const AVATAR_COLORS = [
  { bg:"#EEF2FF", color:"#6366F1" },
  { bg:"#ECFDF5", color:"#10B981" },
  { bg:"#F5F3FF", color:"#7C3AED" },
  { bg:"#FFFBEB", color:"#F59E0B" },
  { bg:"#F0F9FF", color:"#0EA5E9" },
];
const aColor  = (s) => AVATAR_COLORS[(s||"A").charCodeAt(0) % AVATAR_COLORS.length];
const initials= (s) => (s||"?").split(" ").filter(Boolean).slice(0,2).map(w=>w[0]).join("").toUpperCase();

const DAYS   = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
const MONTHS = ["January","February","March","April","May","June",
                "July","August","September","October","November","December"];

/* ─────────────────────────────────────────
   PRIMITIVES
───────────────────────────────────────── */
const SCard = ({ children, sx={}, hover=false, ...p }) => (
  <Box className={hover?"card-h":""}
    sx={{ background:T.surface, border:`1px solid ${T.border}`, borderRadius:"14px", ...sx }}
    {...p}>
    {children}
  </Box>
);

const SLabel = ({ children, sx={} }) => (
  <Typography sx={{ fontFamily:fBody, fontSize:"0.67rem", fontWeight:700,
    letterSpacing:"0.08em", textTransform:"uppercase", color:T.textMute, mb:0.5, ...sx }}>
    {children}
  </Typography>
);

const TH = ({ children, align }) => (
  <TableCell align={align} sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.68rem",
    letterSpacing:"0.06em", textTransform:"uppercase", color:T.textMute,
    borderBottom:`1px solid ${T.border}`, py:1.5, bgcolor:"#F9FAFB", whiteSpace:"nowrap" }}>
    {children}
  </TableCell>
);

const TD = ({ children, sx={}, align }) => (
  <TableCell align={align} sx={{ fontFamily:fBody, fontSize:"0.81rem", color:T.textSub,
    borderBottom:`1px solid ${T.border}`, py:1.8, ...sx }}>
    {children}
  </TableCell>
);

const DInput = ({ sx={}, ...props }) => (
  <TextField size="small" fullWidth {...props} sx={{
    "& .MuiOutlinedInput-root":{ borderRadius:"9px", fontFamily:fBody, fontSize:"0.83rem",
      bgcolor:T.surface,
      "& fieldset":{ borderColor:T.border },
      "&.Mui-focused fieldset":{ borderColor:T.accent } },
    "& .MuiInputLabel-root.Mui-focused":{ color:T.accent },
    ...sx
  }} />
);

const StatusPill = ({ status }) => {
  const m = status === "Approved"
    ? { color:T.success, bg:T.successLight }
    : status === "Pending"
    ? { color:T.warning, bg:T.warningLight }
    : { color:T.danger,  bg:T.dangerLight  };
  return (
    <Box display="flex" alignItems="center" gap={0.6}
      sx={{ px:1.2, py:0.38, borderRadius:"99px", bgcolor:m.bg, width:"fit-content" }}>
      <Box sx={{ width:6, height:6, borderRadius:"50%", bgcolor:m.color }} />
      <Typography sx={{ fontFamily:fBody, fontSize:"0.71rem", fontWeight:700, color:m.color }}>
        {status}
      </Typography>
    </Box>
  );
};

/* ─────────────────────────────────────────
   MINI CALENDAR  (self-contained, no deps)
───────────────────────────────────────── */
const LeaveCalendar = ({ leaves }) => {
  const today = new Date();
  const [viewYear,  setViewYear]  = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  const firstDay  = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMon = new Date(viewYear, viewMonth + 1, 0).getDate();

  // Build date → status map from leaves
  const leaveMap = useMemo(() => {
    const m = {};
    leaves.forEach(l => {
      const from = new Date(l.from);
      const to   = new Date(l.to);
      for (let d = new Date(from); d <= to; d.setDate(d.getDate() + 1)) {
        const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
        m[key] = l.status;
      }
    });
    return m;
  }, [leaves]);

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMon; d++) cells.push(d);

  return (
    <Box>
      {/* Month nav */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={1.5}>
        <IconButton size="small" onClick={prevMonth}
          sx={{ borderRadius:"8px", border:`1px solid ${T.border}`, width:28, height:28,
            "&:hover":{ bgcolor:T.accentLight, color:T.accent } }}>
          <ChevronLeft sx={{ fontSize:16 }} />
        </IconButton>
        <Typography sx={{ fontFamily:fHead, fontWeight:700, fontSize:"0.88rem", color:T.text }}>
          {MONTHS[viewMonth]} {viewYear}
        </Typography>
        <IconButton size="small" onClick={nextMonth}
          sx={{ borderRadius:"8px", border:`1px solid ${T.border}`, width:28, height:28,
            "&:hover":{ bgcolor:T.accentLight, color:T.accent } }}>
          <ChevronRight sx={{ fontSize:16 }} />
        </IconButton>
      </Box>

      {/* Day headers */}
      <Box display="grid" sx={{ gridTemplateColumns:"repeat(7,1fr)", mb:0.5 }}>
        {DAYS.map(d => (
          <Box key={d} sx={{ textAlign:"center", py:0.4 }}>
            <Typography sx={{ fontFamily:fBody, fontSize:"0.64rem", fontWeight:700,
              color:T.textMute }}>{d}</Typography>
          </Box>
        ))}
      </Box>

      {/* Day cells */}
      <Box display="grid" sx={{ gridTemplateColumns:"repeat(7,1fr)", gap:"2px" }}>
        {cells.map((day, idx) => {
          if (!day) return <Box key={`e${idx}`} />;
          const key     = `${viewYear}-${viewMonth}-${day}`;
          const status  = leaveMap[key];
          const isToday = day === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear();
          const dotColor = status === "Approved" ? T.success : status === "Pending" ? T.warning : null;
          return (
            <Box key={day} sx={{ textAlign:"center", py:0.5, borderRadius:"7px", position:"relative",
              bgcolor: isToday ? T.accentLight : "transparent",
              border: isToday ? `1.5px solid ${T.accent}` : "1.5px solid transparent" }}>
              <Typography sx={{ fontFamily:fMono, fontSize:"0.75rem", fontWeight: isToday ? 700 : 400,
                color: isToday ? T.accent : T.text }}>{day}</Typography>
              {dotColor && (
                <Box sx={{ width:5, height:5, borderRadius:"50%", bgcolor:dotColor,
                  mx:"auto", mt:0.1 }} />
              )}
            </Box>
          );
        })}
      </Box>

      {/* Legend */}
      <Box display="flex" justifyContent="center" gap={2} mt={1.5}>
        {[
          { label:"Approved", color:T.success, bg:T.successLight },
          { label:"Pending",  color:T.warning, bg:T.warningLight },
        ].map(l => (
          <Box key={l.label} display="flex" alignItems="center" gap={0.5}>
            <Box sx={{ width:7, height:7, borderRadius:"50%", bgcolor:l.color }} />
            <Typography sx={{ fontFamily:fBody, fontSize:"0.68rem", color:T.textMute }}>{l.label}</Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

/* ═════════════════════════════════════════════
   MAIN COMPONENT
═════════════════════════════════════════════ */
const LeaveAppView = () => {
  const [tabIndex,   setTabIndex]   = useState(0);
  const [leaves,     setLeaves]     = useState(LEAVES_INIT);
  const [balance,    setBalance]    = useState(BALANCE_INIT);
  const [form,       setForm]       = useState({ type:"", from:"", to:"", reason:"" });
  const [errors,     setErrors]     = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [cancelId,   setCancelId]   = useState(null);
  const [snack,      setSnack]      = useState({ open:false, msg:"", severity:"success" });

  const toast = (msg, severity="success") => setSnack({ open:true, msg, severity });
  const setF   = (k, v) => { setForm(p => ({ ...p, [k]:v })); setErrors(p => ({ ...p, [k]:null })); };

  /* Validate */
  const validate = () => {
    const e = {};
    if (!form.type)   e.type   = "Leave type is required.";
    if (!form.from)   e.from   = "Start date is required.";
    if (!form.to)     e.to     = "End date is required.";
    if (!form.reason.trim()) e.reason = "Reason is required.";
    if (form.from && form.to && form.to < form.from)
      e.to = "End date must be after start date.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  /* Submit */
  const handleSubmit = () => {
    if (!validate()) return;
    setSubmitting(true);
    setTimeout(() => {
      const from  = new Date(form.from);
      const to    = new Date(form.to);
      const days  = Math.round((to - from) / (1000 * 60 * 60 * 24)) + 1;
      const newId = Math.max(...leaves.map(l => l.id), 0) + 1;
      setLeaves(p => [{ id:newId, type:form.type, from:form.from, to:form.to,
        days, status:"Pending", reason:form.reason }, ...p]);
      setBalance(p => ({ ...p, [form.type]: Math.max(0, (p[form.type]||0) - days) }));
      setForm({ type:"", from:"", to:"", reason:"" });
      setErrors({});
      setSubmitting(false);
      toast(`Leave request submitted for ${days} day(s).`);
    }, 900);
  };

  /* Cancel */
  const handleCancel = (id) => {
    const leave = leaves.find(l => l.id === id);
    if (leave) {
      setLeaves(p => p.filter(l => l.id !== id));
      setBalance(p => ({ ...p, [leave.type]: (p[leave.type]||0) + leave.days }));
      toast(`Leave request cancelled. ${leave.days} day(s) restored.`, "warning");
    }
    setCancelId(null);
  };

  /* Balance display order + icon */
  const BALANCE_META = {
    "Casual Leave":  { color:T.accent,  bg:T.accentLight,  Icon:BeachAccess     },
    "Medical Leave": { color:T.danger,  bg:T.dangerLight,  Icon:MedicalServices },
    "Earned Leave":  { color:T.success, bg:T.successLight, Icon:Work            },
    "On-Duty":       { color:T.gold,    bg:T.goldLight,    Icon:BadgeIcon       },
  };

  const pendingCount = leaves.filter(l => l.status === "Pending").length;

  /* ─── Render ─── */
  return (
    <Box sx={{ p:3, bgcolor:T.bg, minHeight:"100vh", fontFamily:fBody }}>
      <Fonts />

      {/* ── Header ── */}
      <Box display="flex" justifyContent="space-between" alignItems="flex-start"
        mb={3} flexWrap="wrap" gap={2} className="fu">
        <Box>
          <Typography sx={{ fontFamily:fBody, fontSize:"0.72rem", fontWeight:700,
            letterSpacing:"0.1em", textTransform:"uppercase", color:T.textMute, mb:0.3 }}>
            Faculty Portal · Leave Management
          </Typography>
          <Typography sx={{ fontFamily:fHead, fontWeight:700, fontSize:"1.5rem", color:T.text }}>
            Leave Application
          </Typography>
          <Typography sx={{ fontFamily:fBody, fontSize:"0.82rem", color:T.textSub, mt:0.3 }}>
            Dr. Sarah Smith &nbsp;·&nbsp; Department of Computer Science
          </Typography>
        </Box>
        <Button size="small" variant="outlined"
          startIcon={<FileDownload sx={{ fontSize:15 }} />}
          onClick={() => toast("Leave history exported.")}
          sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.76rem", textTransform:"none",
            borderRadius:"8px", borderColor:T.border, color:T.textSub, mt:0.5,
            "&:hover":{ borderColor:T.accent, color:T.accent } }}>
          Export History
        </Button>
      </Box>

      {/* ── Balance Cards ── */}
      <Grid container spacing={2} mb={3} className="fu1">
        {Object.entries(BALANCE_META).map(([key, meta], i) => (
          <Grid item xs={6} md={3} key={key}>
            <SCard hover sx={{ p:2.5 }}>
              <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                <Box>
                  <SLabel>{key}</SLabel>
                  <Typography sx={{ fontFamily:fMono, fontWeight:700, fontSize:"1.8rem",
                    color:meta.color, lineHeight:1.1 }}>
                    {balance[key] ?? 0}
                  </Typography>
                  <Typography sx={{ fontFamily:fBody, fontSize:"0.7rem",
                    color:T.textMute, mt:0.3 }}>Available days</Typography>
                </Box>
                <Box sx={{ p:1.1, borderRadius:"10px", bgcolor:meta.bg, color:meta.color }}>
                  <meta.Icon sx={{ fontSize:20 }} />
                </Box>
              </Box>
            </SCard>
          </Grid>
        ))}
      </Grid>

      {/* ── Main 2-col layout ── */}
      <Grid container spacing={2.5} className="fu2">

        {/* ── LEFT: Tabs ── */}
        <Grid item xs={12} md={8}>
          <SCard sx={{ overflow:"hidden" }}>

            {/* Tab bar */}
            <Box sx={{ borderBottom:`1px solid ${T.border}`, bgcolor:"#FAFBFD" }}>
              <Tabs value={tabIndex} onChange={(_, v) => setTabIndex(v)} sx={{
                px:2,
                "& .MuiTabs-indicator":{ bgcolor:T.accent, height:"2.5px", borderRadius:"2px 2px 0 0" },
                "& .MuiTab-root":{ fontFamily:fBody, fontWeight:600, fontSize:"0.78rem",
                  textTransform:"none", color:T.textMute, minHeight:50,
                  "&.Mui-selected":{ color:T.accent } }
              }}>
                <Tab icon={<EventAvailable sx={{ fontSize:16 }} />} iconPosition="start"
                  label="Calendar &amp; Apply" />
                <Tab icon={<History sx={{ fontSize:16 }} />} iconPosition="start"
                  label={`My History${pendingCount ? ` (${pendingCount} pending)` : ""}`} />
              </Tabs>
            </Box>

            {/* ═══════════════════════════════
                TAB 0 — CALENDAR & APPLY
            ═══════════════════════════════ */}
            {tabIndex === 0 && (
              <Grid container sx={{ minHeight:480 }}>

                {/* Calendar side */}
                <Grid item xs={12} md={6} sx={{
                  p:2.5, borderRight:{ md:`1px solid ${T.border}` },
                  borderBottom:{ xs:`1px solid ${T.border}`, md:"none" }
                }}>
                  <SLabel sx={{ mb:1 }}>My Leave Schedule</SLabel>
                  <LeaveCalendar leaves={leaves} />
                </Grid>

                {/* Application form */}
                <Grid item xs={12} md={6} sx={{ p:2.5 }}>
                  <SLabel sx={{ mb:1.2 }}>Request New Leave</SLabel>

                  {/* Leave type */}
                  <Box mb={2}>
                    <SLabel sx={{ mb:0.7 }}>Leave Type *</SLabel>
                    <DInput select value={form.type} onChange={e => setF("type", e.target.value)}
                      error={!!errors.type}
                      helperText={errors.type}>
                      <MenuItem value="" sx={{ fontFamily:fBody, fontSize:"0.82rem", color:T.textMute }}>
                        — Select type —
                      </MenuItem>
                      {LEAVE_TYPES.map(lt => (
                        <MenuItem key={lt.value} value={lt.value}
                          sx={{ fontFamily:fBody, fontSize:"0.82rem" }}>
                          <Box display="flex" alignItems="center" gap={1}>
                            <Box sx={{ p:0.4, borderRadius:"5px",
                              bgcolor:LEAVE_TYPE_META[lt.value]?.bg,
                              color:LEAVE_TYPE_META[lt.value]?.color }}>
                              <lt.Icon sx={{ fontSize:14 }} />
                            </Box>
                            {lt.label}
                          </Box>
                        </MenuItem>
                      ))}
                    </DInput>
                  </Box>

                  {/* Date range */}
                  <Grid container spacing={1.5} mb={2}>
                    <Grid item xs={6}>
                      <SLabel sx={{ mb:0.7 }}>From *</SLabel>
                      <DInput type="date" value={form.from}
                        onChange={e => setF("from", e.target.value)}
                        InputLabelProps={{ shrink:true }}
                        error={!!errors.from}
                        helperText={errors.from}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <SLabel sx={{ mb:0.7 }}>To *</SLabel>
                      <DInput type="date" value={form.to}
                        onChange={e => setF("to", e.target.value)}
                        InputLabelProps={{ shrink:true }}
                        error={!!errors.to}
                        helperText={errors.to}
                      />
                    </Grid>
                  </Grid>

                  {/* Duration preview */}
                  {form.from && form.to && form.to >= form.from && (
                    <Box sx={{ mb:2, px:1.5, py:0.9, borderRadius:"8px",
                      bgcolor:T.accentLight, border:`1px solid ${T.accent}20`,
                      display:"flex", alignItems:"center", gap:1 }}>
                      <EventAvailable sx={{ fontSize:14, color:T.accent }} />
                      <Typography sx={{ fontFamily:fBody, fontWeight:700,
                        fontSize:"0.76rem", color:T.accent }}>
                        {Math.round((new Date(form.to) - new Date(form.from)) / (1000*60*60*24)) + 1} day(s) selected
                      </Typography>
                    </Box>
                  )}

                  {/* Reason */}
                  <Box mb={2.5}>
                    <SLabel sx={{ mb:0.7 }}>Reason *</SLabel>
                    <DInput multiline rows={3} value={form.reason}
                      onChange={e => setF("reason", e.target.value)}
                      placeholder="Briefly describe the reason for your leave request…"
                      error={!!errors.reason}
                      helperText={errors.reason}
                    />
                  </Box>

                  {/* Submit */}
                  <Button fullWidth variant="contained"
                    disabled={submitting}
                    onClick={handleSubmit}
                    startIcon={submitting ? null : <Add sx={{ fontSize:15 }} />}
                    sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.82rem",
                      textTransform:"none", borderRadius:"9px",
                      py:1.1, bgcolor:T.accent, boxShadow:"none",
                      "&:hover":{ bgcolor:"#4F46E5", boxShadow:"none" },
                      "&.Mui-disabled":{ bgcolor:T.border, color:T.textMute } }}>
                    {submitting ? "Submitting…" : "Submit Leave Request"}
                  </Button>
                </Grid>
              </Grid>
            )}

            {/* ═══════════════════════════════
                TAB 1 — HISTORY
            ═══════════════════════════════ */}
            {tabIndex === 1 && (
              <Box>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TH>Type</TH>
                      <TH>Dates</TH>
                      <TH>Duration</TH>
                      <TH>Reason</TH>
                      <TH>Status</TH>
                      <TH align="center">Action</TH>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {leaves.map(row => {
                      const meta = LEAVE_TYPE_META[row.type] || { color:T.textMute, bg:"#F1F5F9" };
                      return (
                        <TableRow key={row.id} className="row-h">

                          <TD sx={{ minWidth:140 }}>
                            <Box display="flex" alignItems="center" gap={1}>
                              <Box sx={{ p:0.55, borderRadius:"6px",
                                bgcolor:meta.bg, color:meta.color, flexShrink:0 }}>
                                {(() => {
                                  const lt = LEAVE_TYPES.find(l => l.value === row.type);
                                  return lt ? <lt.Icon sx={{ fontSize:13 }} /> : null;
                                })()}
                              </Box>
                              <Typography sx={{ fontFamily:fBody, fontWeight:700,
                                fontSize:"0.8rem", color:T.text }}>{row.type}</Typography>
                            </Box>
                          </TD>

                          <TD sx={{ minWidth:170 }}>
                            <Typography sx={{ fontFamily:fMono, fontSize:"0.76rem", color:T.text }}>
                              {row.from}
                            </Typography>
                            <Typography sx={{ fontFamily:fMono, fontSize:"0.76rem",
                              color:T.textMute }}>
                              → {row.to}
                            </Typography>
                          </TD>

                          <TD>
                            <Box sx={{ px:0.9, py:0.2, borderRadius:"6px",
                              bgcolor:"#F1F5F9", display:"inline-block" }}>
                              <Typography sx={{ fontFamily:fMono, fontWeight:700,
                                fontSize:"0.74rem", color:T.textSub }}>{row.days}d</Typography>
                            </Box>
                          </TD>

                          <TD sx={{ maxWidth:160 }}>
                            <Typography sx={{ fontFamily:fBody, fontSize:"0.77rem",
                              color:T.textSub, overflow:"hidden", textOverflow:"ellipsis",
                              whiteSpace:"nowrap", maxWidth:150 }}>
                              {row.reason}
                            </Typography>
                          </TD>

                          <TD>
                            <StatusPill status={row.status} />
                          </TD>

                          <TD align="center">
                            {row.status === "Pending" ? (
                              <Tooltip title="Cancel Request">
                                <IconButton size="small"
                                  onClick={() => setCancelId(row.id)}
                                  sx={{ borderRadius:"7px", bgcolor:T.dangerLight,
                                    color:T.danger, width:28, height:28,
                                    "&:hover":{ bgcolor:T.danger, color:"#fff" } }}>
                                  <Cancel sx={{ fontSize:14 }} />
                                </IconButton>
                              </Tooltip>
                            ) : (
                              <Box sx={{ px:1, py:0.3, borderRadius:"7px",
                                bgcolor:T.successLight, display:"inline-flex",
                                alignItems:"center", gap:0.4 }}>
                                <CheckCircle sx={{ fontSize:11, color:T.success }} />
                                <Typography sx={{ fontFamily:fBody, fontSize:"0.66rem",
                                  fontWeight:700, color:T.success }}>Approved</Typography>
                              </Box>
                            )}
                          </TD>
                        </TableRow>
                      );
                    })}

                    {leaves.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} sx={{ textAlign:"center", py:6 }}>
                          <History sx={{ fontSize:36, color:T.border,
                            display:"block", mx:"auto", mb:1.5 }} />
                          <Typography sx={{ fontFamily:fBody, color:T.textMute }}>
                            No leave history found.
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </Box>
            )}
          </SCard>
        </Grid>

        {/* ── RIGHT: Department Status ── */}
        <Grid item xs={12} md={4}>
          <SCard sx={{ p:2.8, height:"100%" }}>

            <Box display="flex" alignItems="center" gap={1} mb={0.5}>
              <Box sx={{ p:0.75, borderRadius:"8px", bgcolor:T.purpleLight, color:T.purple }}>
                <BadgeIcon sx={{ fontSize:15 }} />
              </Box>
              <Typography sx={{ fontFamily:fHead, fontWeight:700,
                fontSize:"0.9rem", color:T.text }}>Dept. Leave Status</Typography>
            </Box>
            <Typography sx={{ fontFamily:fBody, fontSize:"0.76rem",
              color:T.textMute, mb:2.5 }}>
              Colleagues on leave this month
            </Typography>

            <Stack spacing={2}>
              {DEPT_LEAVES.map(item => {
                const ac = aColor(item.name);
                const isAway = item.status === "Approved";
                return (
                  <Box key={item.id} display="flex" alignItems="center"
                    justifyContent="space-between" gap={1.5}>
                    <Box display="flex" alignItems="center" gap={1.2}>
                      <Avatar sx={{ width:32, height:32, bgcolor:ac.bg, color:ac.color,
                        fontFamily:fHead, fontSize:"0.62rem", fontWeight:700 }}>
                        {initials(item.name)}
                      </Avatar>
                      <Box>
                        <Typography sx={{ fontFamily:fBody, fontWeight:700,
                          fontSize:"0.8rem", color:T.text }}>{item.name}</Typography>
                        <Typography sx={{ fontFamily:fBody, fontSize:"0.69rem",
                          color:T.textMute }}>
                          {item.date} · {item.type}
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ px:1, py:0.28, borderRadius:"99px", flexShrink:0,
                      bgcolor: isAway ? T.dangerLight  : T.warningLight,
                      border:`1px solid ${isAway ? T.danger : T.warning}20` }}>
                      <Typography sx={{ fontFamily:fBody, fontWeight:700,
                        fontSize:"0.66rem",
                        color: isAway ? T.danger : T.warning }}>
                        {isAway ? "Away" : "Planned"}
                      </Typography>
                    </Box>
                  </Box>
                );
              })}
            </Stack>

            <Divider sx={{ borderColor:T.border, my:2.5 }} />

            {/* Policy note */}
            <Box sx={{ p:1.8, borderRadius:"9px",
              bgcolor:T.infoLight, border:`1px solid ${T.info}20` }}>
              <Box display="flex" alignItems="center" gap={0.7} mb={0.5}>
                <Warning sx={{ fontSize:13, color:T.info }} />
                <Typography sx={{ fontFamily:fBody, fontWeight:700,
                  fontSize:"0.69rem", color:T.info }}>Department Policy</Typography>
              </Box>
              <Typography sx={{ fontFamily:fBody, fontSize:"0.73rem",
                color:T.textSub, lineHeight:1.65 }}>
                Only <Box component="span" sx={{ fontWeight:700 }}>2 faculty members</Box> from
                the department can be on Casual Leave simultaneously. Please plan accordingly.
              </Typography>
            </Box>

            <Divider sx={{ borderColor:T.border, my:2.5 }} />

            {/* My leave summary */}
            <SLabel sx={{ mb:1.2 }}>My Leave Summary</SLabel>
            <Stack spacing={1}>
              {Object.entries(BALANCE_META).map(([key, meta]) => (
                <Box key={key} display="flex" justifyContent="space-between" alignItems="center">
                  <Box display="flex" alignItems="center" gap={0.8}>
                    <Box sx={{ p:0.45, borderRadius:"5px",
                      bgcolor:meta.bg, color:meta.color }}>
                      <meta.Icon sx={{ fontSize:12 }} />
                    </Box>
                    <Typography sx={{ fontFamily:fBody, fontSize:"0.75rem",
                      color:T.textSub }}>{key}</Typography>
                  </Box>
                  <Typography sx={{ fontFamily:fMono, fontWeight:700,
                    fontSize:"0.78rem", color:meta.color }}>
                    {balance[key] ?? 0} left
                  </Typography>
                </Box>
              ))}
            </Stack>
          </SCard>
        </Grid>
      </Grid>

      {/* ── Cancel Confirm Dialog ── */}
      <Dialog open={!!cancelId} onClose={() => setCancelId(null)}
        maxWidth="xs" fullWidth
        PaperProps={{ sx:{ borderRadius:"16px", border:`1px solid ${T.border}` } }}>
        <DialogTitle sx={{ borderBottom:`1px solid ${T.border}`, bgcolor:"#FAFBFD", pb:2 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box display="flex" alignItems="center" gap={1.5}>
              <Box sx={{ width:4, height:28, borderRadius:2, bgcolor:T.danger }} />
              <Box>
                <Typography sx={{ fontFamily:fHead, fontWeight:700,
                  fontSize:"0.94rem", color:T.text }}>Cancel Leave Request</Typography>
                <Typography sx={{ fontFamily:fBody, fontSize:"0.71rem", color:T.textMute }}>
                  This action cannot be undone.
                </Typography>
              </Box>
            </Box>
            <Box onClick={() => setCancelId(null)}
              sx={{ p:0.7, borderRadius:"8px", bgcolor:"#F1F5F9", cursor:"pointer",
                "&:hover":{ bgcolor:T.dangerLight } }}>
              <Close sx={{ fontSize:16, color:T.textMute }} />
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ px:3, pt:3, pb:2 }}>
          <Box sx={{ p:1.8, borderRadius:"9px",
            bgcolor:T.dangerLight, border:`1px solid ${T.danger}20`,
            display:"flex", gap:1, alignItems:"flex-start" }}>
            <Warning sx={{ fontSize:15, color:T.danger, flexShrink:0, mt:0.1 }} />
            <Typography sx={{ fontFamily:fBody, fontSize:"0.78rem",
              color:T.textSub, lineHeight:1.65 }}>
              Are you sure you want to cancel this leave request? The reserved days
              will be restored to your leave balance.
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px:3, pb:3, pt:2,
          borderTop:`1px solid ${T.border}`, bgcolor:"#FAFBFD",
          display:"flex", justifyContent:"space-between" }}>
          <Button size="small" variant="outlined"
            onClick={() => setCancelId(null)}
            sx={{ fontFamily:fBody, fontWeight:600, fontSize:"0.78rem",
              textTransform:"none", borderRadius:"8px",
              borderColor:T.border, color:T.textSub }}>
            Keep Request
          </Button>
          <Button size="small" variant="contained"
            onClick={() => handleCancel(cancelId)}
            sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.78rem",
              textTransform:"none", borderRadius:"8px",
              bgcolor:T.danger, boxShadow:"none",
              "&:hover":{ bgcolor:"#DC2626", boxShadow:"none" } }}>
            Yes, Cancel It
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar open={snack.open} autoHideDuration={3500}
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

export default LeaveAppView;