import React, { useState, useMemo } from "react";
import {
  Box, Grid, Typography, Button, Table, TableBody, TableCell,
  TableHead, TableRow, IconButton, Tooltip, TextField, MenuItem,
  Tabs, Tab, Stack, Snackbar, Alert, Divider, Avatar,
  InputAdornment, Dialog, DialogTitle, DialogContent, DialogActions
} from "@mui/material";
import {
  Email, VerifiedUser, GppBad, Download, History,
  Fingerprint, Send, CheckCircle, Search, Refresh,
  Warning, Info, Shield, Close, People,
  Article, NotificationsActive, FilterAlt,
  EmojiEvents, TrendingUp, CalendarMonth, Lock
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
    @keyframes fadeUp  { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:none} }
    @keyframes pulse   { 0%,100%{opacity:1} 50%{opacity:.4} }
    @keyframes fillBar { from{width:0} to{width:var(--w)} }
    .fu  { animation: fadeUp 0.32s ease both; }
    .fu1 { animation: fadeUp 0.32s .06s ease both; }
    .fu2 { animation: fadeUp 0.32s .12s ease both; }
    .fu3 { animation: fadeUp 0.32s .18s ease both; }
    .row-h:hover { background:#F9FAFB !important; transition:background .15s; }
    .card-h { transition:box-shadow .18s,transform .18s; }
    .card-h:hover { box-shadow:0 6px 24px rgba(99,102,241,.12); transform:translateY(-2px); }
    .blink { animation: pulse 2s infinite; }
  `}</style>
);

/* ─────────────────────────────────────────
   MOCK DATA
───────────────────────────────────────── */
const POLICIES = [
  { id:1, title:"Code of Ethics",          version:"1.2", total:142, signed:134, deadline:"2025-02-28", category:"Ethics"   },
  { id:2, title:"IT Security Guidelines",  version:"2.0", total:142, signed:65,  deadline:"2026-03-15", category:"IT"       },
  { id:3, title:"Research Integrity",      version:"1.0", total:142, signed:142, deadline:"2024-12-31", category:"Research" },
  { id:4, title:"Anti-Harassment Policy",  version:"3.1", total:142, signed:111, deadline:"2025-08-01", category:"HR"       },
  { id:5, title:"Leave & Attendance Rules",version:"2.2", total:142, signed:88,  deadline:"2025-10-01", category:"HR"       },
];

const NON_COMPLIANT_INIT = [
  { id:101, name:"Dr. Emily Davis",   avatar:"ED", dept:"Civil",     policy:"IT Security Guidelines",  daysOverdue:2,  status:"Pending", reminded:false },
  { id:102, name:"Prof. Rajan Kumar", avatar:"RK", dept:"Mechanical",policy:"Code of Ethics",          daysOverdue:5,  status:"Pending", reminded:false },
  { id:103, name:"Ms. Priya Roy",     avatar:"PR", dept:"CSE",       policy:"IT Security Guidelines",  daysOverdue:0,  status:"Pending", reminded:false },
  { id:104, name:"Dr. Vikram Nair",   avatar:"VN", dept:"Mech",      policy:"Anti-Harassment Policy",  daysOverdue:8,  status:"Pending", reminded:true  },
  { id:105, name:"Ms. Kavya Sharma",  avatar:"KS", dept:"ECE",       policy:"Leave & Attendance Rules",daysOverdue:12, status:"Pending", reminded:true  },
  { id:106, name:"Dr. K. Reddy",      avatar:"KR", dept:"Civil",     policy:"IT Security Guidelines",  daysOverdue:3,  status:"Pending", reminded:false },
];

const SIG_LOGS = [
  { id:1, name:"Dr. Sarah Smith",   avatar:"SS", dept:"CSE",       policy:"Code of Ethics",          time:"2026-02-04 10:30 AM", ip:"192.168.1.45",  method:"Digital ID",     otp:"Verified" },
  { id:2, name:"Mr. Arjun Singh",   avatar:"AS", dept:"Mech",      policy:"IT Security Guidelines",  time:"2026-02-04 11:15 AM", ip:"192.168.1.12",  method:"Aadhaar eSign",  otp:"Verified" },
  { id:3, name:"Dr. Sunita Pillai", avatar:"SP", dept:"Science",   policy:"Research Integrity",      time:"2026-02-03 09:05 AM", ip:"192.168.1.78",  method:"Digital ID",     otp:"Verified" },
  { id:4, name:"Ms. Neha Gupta",    avatar:"NG", dept:"ECE",       policy:"Anti-Harassment Policy",  time:"2026-02-03 03:44 PM", ip:"192.168.1.99",  method:"OTP + Email",    otp:"Verified" },
  { id:5, name:"Prof. Leena George",avatar:"LG", dept:"CSE",       policy:"Code of Ethics",          time:"2026-02-02 02:10 PM", ip:"192.168.1.55",  method:"Digital ID",     otp:"Verified" },
  { id:6, name:"Dr. Arun Mathew",   avatar:"AM", dept:"Civil",     policy:"Leave & Attendance Rules",time:"2026-02-01 04:50 PM", ip:"192.168.1.33",  method:"Aadhaar eSign",  otp:"Verified" },
];

const AVATAR_COLORS = [
  { bg:"#EEF2FF", color:"#6366F1" },
  { bg:"#ECFDF5", color:"#10B981" },
  { bg:"#F5F3FF", color:"#7C3AED" },
  { bg:"#FFFBEB", color:"#F59E0B" },
  { bg:"#F0F9FF", color:"#0EA5E9" },
  { bg:"#FEF2F2", color:"#EF4444" },
];
const aColor = (name) => AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];

const CAT_META = {
  Ethics:   { color:T.purple,  bg:T.purpleLight  },
  IT:       { color:T.accent,  bg:T.accentLight  },
  Research: { color:T.success, bg:T.successLight },
  HR:       { color:T.warning, bg:T.warningLight },
};

/* ─────────────────────────────────────────
   HELPERS
───────────────────────────────────────── */
const pct = (signed, total) => Math.round((signed / total) * 100);
const barColor = (p) => p === 100 ? T.success : p >= 60 ? T.warning : T.danger;

/* ─────────────────────────────────────────
   PRIMITIVES
───────────────────────────────────────── */
const SCard = ({ children, sx={}, hover=false, ...p }) => (
  <Box className={hover?"card-h":""}
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

const DInput = ({ sx={}, ...props }) => (
  <TextField size="small" fullWidth {...props} sx={{
    "& .MuiOutlinedInput-root":{ borderRadius:"9px", fontFamily:fBody, fontSize:"0.82rem",
      bgcolor:T.surface,
      "& fieldset":{ borderColor:T.border },
      "&.Mui-focused fieldset":{ borderColor:T.accent } },
    "& .MuiInputLabel-root.Mui-focused":{ color:T.accent },
    ...sx
  }} />
);

const ProgBar = ({ signed, total, height=7 }) => {
  const p = pct(signed, total);
  const c = barColor(p);
  return (
    <Box>
      <Box display="flex" justifyContent="space-between" mb={0.5}>
        <Typography sx={{ fontFamily:fMono, fontWeight:700, fontSize:"0.73rem", color:c }}>
          {p}%
          {p === 100 && <CheckCircle sx={{ fontSize:10, ml:0.4, verticalAlign:"middle", color:T.success }} />}
        </Typography>
        <Typography sx={{ fontFamily:fBody, fontSize:"0.68rem", color:T.textMute }}>
          {signed}/{total}
        </Typography>
      </Box>
      <Box sx={{ height, borderRadius:99, bgcolor:T.border, overflow:"hidden" }}>
        <Box sx={{ height:"100%", width:`${p}%`, borderRadius:99,
          bgcolor:c, transition:"width 1.2s ease" }} />
      </Box>
    </Box>
  );
};

/* ═════════════════════════════════════════════
   MAIN COMPONENT
═════════════════════════════════════════════ */
const PolicyComplianceView = () => {
  const [tabIndex,      setTabIndex]      = useState(0);
  const [filterPolicy,  setFilterPolicy]  = useState("All");
  const [filterOverdue, setFilterOverdue] = useState("All");
  const [sigSearch,     setSigSearch]     = useState("");
  const [ncList,        setNcList]        = useState(NON_COMPLIANT_INIT);
  const [certDialog,    setCertDialog]    = useState(null);
  const [remindedPols,  setRemindedPols]  = useState(new Set());
  const [snack,         setSnack]         = useState({ open:false, msg:"", severity:"success" });

  const toast = (msg, severity="success") => setSnack({ open:true, msg, severity });

  /* ── Non-compliant filter ── */
  const ncFiltered = useMemo(() => ncList.filter(f => {
    if (filterPolicy !== "All" && f.policy !== filterPolicy) return false;
    if (filterOverdue === "Overdue"   && f.daysOverdue <= 0)  return false;
    if (filterOverdue === "Due Today" && f.daysOverdue !== 0) return false;
    return true;
  }), [ncList, filterPolicy, filterOverdue]);

  /* ── Signature log filter ── */
  const sigFiltered = useMemo(() => SIG_LOGS.filter(r => {
    const q = sigSearch.toLowerCase();
    return !q || r.name.toLowerCase().includes(q) || r.policy.toLowerCase().includes(q);
  }), [sigSearch]);

  /* ── Send reminder (individual) ── */
  const handleRemind = (id) => {
    setNcList(p => p.map(f => f.id === id ? { ...f, reminded:true } : f));
    const name = ncList.find(f => f.id === id)?.name;
    toast(`Reminder sent to ${name}.`);
  };

  /* ── Bulk reminder ── */
  const handleBulkRemind = () => {
    setNcList(p => p.map(f => ({ ...f, reminded:true })));
    toast(`Bulk reminders sent to ${ncList.length} faculty members.`, "warning");
  };

  /* ── Stats ── */
  const avgCompliance = Math.round(POLICIES.reduce((s,p) => s + pct(p.signed,p.total), 0) / POLICIES.length);
  const fullyCompliant = POLICIES.filter(p => p.signed === p.total).length;
  const totalNonCompliant = ncList.length;
  const totalSigLogs  = SIG_LOGS.length;

  const STAT_ITEMS = [
    { label:"Avg. Compliance",     value:`${avgCompliance}%`, sub:"Across all policies",     color:T.accent,  Icon:TrendingUp    },
    { label:"Fully Compliant",     value:fullyCompliant,       sub:"Policies at 100%",        color:T.success, Icon:EmojiEvents   },
    { label:"Non-Compliant Staff", value:totalNonCompliant,    sub:"Pending acknowledgement", color:T.danger,  Icon:GppBad        },
    { label:"Audit Log Entries",   value:totalSigLogs,         sub:"Verified signatures",     color:T.purple,  Icon:Fingerprint   },
  ];

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
            Admin Dashboard · Legal &amp; Compliance
          </Typography>
          <Typography sx={{ fontFamily:fHead, fontWeight:700, fontSize:"1.5rem", color:T.text }}>
            Policy Compliance &amp; Tracking
          </Typography>
          <Typography sx={{ fontFamily:fBody, fontSize:"0.82rem", color:T.textSub, mt:0.3 }}>
            Monitor acknowledgement rates, track non-compliant faculty, and verify digital signatures.
          </Typography>
        </Box>
        <Button size="small" variant="outlined"
          startIcon={<Download sx={{fontSize:15}} />}
          onClick={() => toast("Full compliance report exported.")}
          sx={{ fontFamily:fBody, fontWeight:600, fontSize:"0.76rem", textTransform:"none",
            borderRadius:"8px", borderColor:T.border, color:T.textSub, mt:0.5,
            "&:hover":{ borderColor:T.accent, color:T.accent } }}>
          Export Report
        </Button>
      </Box>

      {/* ── Stat Strip ── */}
      <Grid container spacing={2} mb={3}>
        {STAT_ITEMS.map((s,i) => (
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

      {/* ── Main Card ── */}
      <SCard sx={{ overflow:"hidden" }} className="fu1">

        {/* Tab bar */}
        <Box sx={{ borderBottom:`1px solid ${T.border}`, bgcolor:"#FAFBFD" }}>
          <Tabs value={tabIndex} onChange={(_,v) => setTabIndex(v)}
            variant="scrollable" scrollButtons="auto" sx={{
              px:2,
              "& .MuiTabs-indicator":{ bgcolor:T.accent, height:"2.5px",
                borderRadius:"2px 2px 0 0" },
              "& .MuiTab-root":{ fontFamily:fBody, fontWeight:600, fontSize:"0.78rem",
                textTransform:"none", color:T.textMute, minHeight:50,
                "&.Mui-selected":{ color:T.accent } }
            }}>
            {[
              { label:"Compliance Dashboard",    Icon:VerifiedUser  },
              { label:"Non-Compliant Tracker",   Icon:GppBad        },
              { label:"Signature Verification",  Icon:Fingerprint   },
            ].map((t,i) => (
              <Tab key={i} icon={<t.Icon sx={{fontSize:16}} />}
                iconPosition="start" label={t.label} />
            ))}
          </Tabs>
        </Box>

        <Box p={3}>

          {/* ════════════════════════════════════
              TAB 0 — COMPLIANCE DASHBOARD
          ════════════════════════════════════ */}
          {tabIndex === 0 && (
            <Box className="fu">

              {/* Policy cards */}
              <Grid container spacing={2} mb={3.5}>
                {POLICIES.map(p => {
                  const pc     = pct(p.signed, p.total);
                  const clr    = barColor(pc);
                  const cat    = CAT_META[p.category] || { color:T.accent, bg:T.accentLight };
                  const pending = p.total - p.signed;
                  const remindSent = remindedPols.has(p.id);

                  return (
                    <Grid item xs={12} md={4} key={p.id}>
                      <SCard hover sx={{ p:2.5, borderLeft:`4px solid ${clr}` }}>
                        {/* Header */}
                        <Box display="flex" justifyContent="space-between"
                          alignItems="flex-start" mb={0.5}>
                          <Box flex={1} mr={1}>
                            <Typography sx={{ fontFamily:fBody, fontWeight:700,
                              fontSize:"0.88rem", color:T.text,
                              overflow:"hidden", textOverflow:"ellipsis",
                              whiteSpace:"nowrap" }}>{p.title}</Typography>
                            <Typography sx={{ fontFamily:fBody, fontSize:"0.68rem",
                              color:T.textMute }}>
                              v{p.version} &nbsp;·&nbsp;
                              <Box component="span" sx={{
                                color: new Date(p.deadline) < new Date() ? T.danger : T.textMute
                              }}>
                                Due {p.deadline}
                              </Box>
                            </Typography>
                          </Box>
                          <Box sx={{ px:0.9, py:0.22, borderRadius:"6px",
                            bgcolor:cat.bg, flexShrink:0 }}>
                            <Typography sx={{ fontFamily:fBody, fontSize:"0.65rem",
                              fontWeight:700, color:cat.color }}>{p.category}</Typography>
                          </Box>
                        </Box>

                        {/* Progress */}
                        <Box mt={2} mb={1.5}>
                          <ProgBar signed={p.signed} total={p.total} height={8} />
                        </Box>

                        {/* Stats row */}
                        <Grid container sx={{ mb:1.5 }}>
                          {[
                            { label:"Signed",  value:p.signed,  color:T.success },
                            { label:"Pending", value:pending,   color: pending > 0 ? T.danger : T.success },
                            { label:"Total",   value:p.total,   color:T.accent  },
                          ].map(s => (
                            <Grid item xs={4} key={s.label} textAlign="center">
                              <Typography sx={{ fontFamily:fMono, fontWeight:700,
                                fontSize:"1rem", color:s.color }}>{s.value}</Typography>
                              <Typography sx={{ fontFamily:fBody, fontSize:"0.65rem",
                                color:T.textMute }}>{s.label}</Typography>
                            </Grid>
                          ))}
                        </Grid>

                        {/* Remind button */}
                        {pending > 0 ? (
                          <Button fullWidth size="small"
                            startIcon={<Send sx={{fontSize:13}} />}
                            onClick={() => { setRemindedPols(prev => new Set([...prev, p.id])); toast(`Reminders sent for "${p.title}".`, "warning"); }}
                            sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.74rem",
                              textTransform:"none", borderRadius:"8px",
                              bgcolor: remindSent ? T.successLight : T.dangerLight,
                              color:   remindSent ? T.success : T.danger,
                              border:`1px solid ${remindSent ? T.success : T.danger}30`,
                              "&:hover":{ bgcolor: remindSent ? T.successLight : `${T.danger}18` } }}>
                            {remindSent ? "Reminders Sent ✓" : `Remind ${pending} Pending`}
                          </Button>
                        ) : (
                          <Box display="flex" justifyContent="center" alignItems="center"
                            gap={0.6} sx={{ py:0.6, borderRadius:"8px", bgcolor:T.successLight }}>
                            <CheckCircle sx={{ fontSize:14, color:T.success }} />
                            <Typography sx={{ fontFamily:fBody, fontWeight:700,
                              fontSize:"0.75rem", color:T.success }}>Fully Compliant</Typography>
                          </Box>
                        )}
                      </SCard>
                    </Grid>
                  );
                })}
              </Grid>

              {/* Detailed report table */}
              <Box display="flex" alignItems="center" gap={1} mb={2}>
                <Box sx={{ p:0.75, borderRadius:"8px",
                  bgcolor:T.accentLight, color:T.accent }}>
                  <Article sx={{ fontSize:15 }} />
                </Box>
                <Typography sx={{ fontFamily:fHead, fontWeight:700,
                  fontSize:"0.9rem", color:T.text }}>
                  Detailed Compliance Report
                </Typography>
              </Box>

              <Box sx={{ borderRadius:"10px", border:`1px solid ${T.border}`, overflow:"hidden" }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TH>Policy Name</TH>
                      <TH>Category</TH>
                      <TH align="center">Total Faculty</TH>
                      <TH align="center">Signed</TH>
                      <TH align="center">Pending</TH>
                      <TH>Compliance</TH>
                      <TH>Deadline</TH>
                      <TH>Status</TH>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {POLICIES.map(row => {
                      const pc      = pct(row.signed, row.total);
                      const clr     = barColor(pc);
                      const pending = row.total - row.signed;
                      const cat     = CAT_META[row.category] || { color:T.textMute, bg:"#F1F5F9" };
                      const overdue = new Date(row.deadline) < new Date() && pending > 0;
                      return (
                        <TableRow key={row.id} className="row-h">
                          <TD sx={{ minWidth:180 }}>
                            <Typography sx={{ fontFamily:fBody, fontWeight:700,
                              fontSize:"0.83rem", color:T.text }}>{row.title}</Typography>
                            <Typography sx={{ fontFamily:fMono, fontSize:"0.68rem",
                              color:T.textMute }}>v{row.version}</Typography>
                          </TD>
                          <TD>
                            <Box sx={{ px:0.9, py:0.22, borderRadius:"6px",
                              bgcolor:cat.bg, display:"inline-block" }}>
                              <Typography sx={{ fontFamily:fBody, fontSize:"0.68rem",
                                fontWeight:700, color:cat.color }}>{row.category}</Typography>
                            </Box>
                          </TD>
                          <TD align="center">
                            <Typography sx={{ fontFamily:fMono, fontWeight:600,
                              fontSize:"0.82rem" }}>{row.total}</Typography>
                          </TD>
                          <TD align="center">
                            <Typography sx={{ fontFamily:fMono, fontWeight:700,
                              fontSize:"0.82rem", color:T.success }}>{row.signed}</Typography>
                          </TD>
                          <TD align="center">
                            <Typography sx={{ fontFamily:fMono, fontWeight:700,
                              fontSize:"0.82rem",
                              color: pending > 0 ? T.danger : T.success }}>
                              {pending}
                            </Typography>
                          </TD>
                          <TD sx={{ minWidth:130 }}>
                            <Box>
                              <Box sx={{ height:5, borderRadius:99, bgcolor:T.border, overflow:"hidden" }}>
                                <Box sx={{ height:"100%", width:`${pc}%`, borderRadius:99,
                                  bgcolor:clr }} />
                              </Box>
                              <Typography sx={{ fontFamily:fMono, fontSize:"0.68rem",
                                fontWeight:700, color:clr, mt:0.3 }}>{pc}%</Typography>
                            </Box>
                          </TD>
                          <TD>
                            <Typography sx={{ fontFamily:fMono, fontSize:"0.74rem",
                              color: overdue ? T.danger : T.textSub }}>
                              {row.deadline}
                              {overdue && (
                                <Box component="span" sx={{ ml:0.5, fontFamily:fBody,
                                  fontSize:"0.62rem", color:T.danger, fontWeight:700 }}>
                                  Overdue
                                </Box>
                              )}
                            </Typography>
                          </TD>
                          <TD>
                            <Box display="flex" alignItems="center" gap={0.6}
                              sx={{ px:1.1, py:0.35, borderRadius:"99px",
                                bgcolor: pending===0 ? T.successLight : T.warningLight,
                                width:"fit-content" }}>
                              <Box sx={{ width:6, height:6, borderRadius:"50%",
                                bgcolor: pending===0 ? T.success : T.warning,
                                ...(pending===0 ? { animation:"pulse 2s infinite" } : {}) }} />
                              <Typography sx={{ fontFamily:fBody, fontSize:"0.69rem",
                                fontWeight:700,
                                color: pending===0 ? T.success : T.warning }}>
                                {pending===0 ? "Fully Compliant" : "In Progress"}
                              </Typography>
                            </Box>
                          </TD>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </Box>
            </Box>
          )}

          {/* ════════════════════════════════════
              TAB 1 — NON-COMPLIANT TRACKER
          ════════════════════════════════════ */}
          {tabIndex === 1 && (
            <Box className="fu">

              {/* Toolbar */}
              <Box display="flex" justifyContent="space-between"
                alignItems="flex-start" mb={2.5} flexWrap="wrap" gap={1.5}>
                <Box display="flex" gap={1.5} flexWrap="wrap" alignItems="center">
                  {/* Policy filter */}
                  <DInput select label="Filter by Policy" value={filterPolicy}
                    onChange={e => setFilterPolicy(e.target.value)}
                    sx={{ width:240 }}>
                    <MenuItem value="All" sx={{ fontFamily:fBody, fontSize:"0.82rem" }}>
                      All Policies
                    </MenuItem>
                    {POLICIES.map(p => (
                      <MenuItem key={p.id} value={p.title}
                        sx={{ fontFamily:fBody, fontSize:"0.82rem" }}>
                        {p.title}
                      </MenuItem>
                    ))}
                  </DInput>

                  {/* Overdue filter pills */}
                  {["All","Overdue","Due Today"].map(s => (
                    <Box key={s} onClick={() => setFilterOverdue(s)}
                      sx={{ px:1.3, py:0.4, borderRadius:"99px", cursor:"pointer",
                        fontFamily:fBody, fontSize:"0.71rem", fontWeight:700,
                        border:`1.5px solid ${filterOverdue===s ? T.danger : T.border}`,
                        bgcolor: filterOverdue===s ? T.dangerLight : "transparent",
                        color:   filterOverdue===s ? T.danger      : T.textMute,
                        transition:"all .13s" }}>
                      {s}
                    </Box>
                  ))}

                  {(filterPolicy !== "All" || filterOverdue !== "All") && (
                    <Tooltip title="Reset filters">
                      <IconButton size="small"
                        onClick={() => { setFilterPolicy("All"); setFilterOverdue("All"); }}
                        sx={{ borderRadius:"8px", border:`1px solid ${T.border}`,
                          "&:hover":{ bgcolor:T.dangerLight, color:T.danger } }}>
                        <Refresh sx={{ fontSize:15 }} />
                      </IconButton>
                    </Tooltip>
                  )}
                </Box>

                <Box display="flex" gap={1}>
                  <Button size="small" variant="outlined"
                    startIcon={<Download sx={{fontSize:14}} />}
                    onClick={() => toast("Non-compliance list exported.")}
                    sx={{ fontFamily:fBody, fontWeight:600, fontSize:"0.75rem",
                      textTransform:"none", borderRadius:"8px",
                      borderColor:T.border, color:T.textSub,
                      "&:hover":{ borderColor:T.accent, color:T.accent } }}>
                    Export List
                  </Button>
                  <Button size="small" variant="contained"
                    startIcon={<Email sx={{fontSize:14}} />}
                    onClick={handleBulkRemind}
                    sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.76rem",
                      textTransform:"none", borderRadius:"8px",
                      bgcolor:T.warning, boxShadow:"none",
                      "&:hover":{ bgcolor:T.gold, boxShadow:"none" } }}>
                    Send Bulk Reminders
                  </Button>
                </Box>
              </Box>

              {/* Summary banner */}
              <Box sx={{ p:2, borderRadius:"10px", mb:2.5,
                bgcolor:T.dangerLight, border:`1px solid ${T.danger}25`,
                display:"flex", gap:2, flexWrap:"wrap", alignItems:"center" }}>
                <Box sx={{ p:0.7, borderRadius:"8px", bgcolor:`${T.danger}18`, color:T.danger }}>
                  <GppBad sx={{ fontSize:18 }} />
                </Box>
                <Typography sx={{ fontFamily:fBody, fontWeight:700,
                  fontSize:"0.82rem", color:T.danger }}>
                  {ncFiltered.length} faculty member{ncFiltered.length!==1?"s":""} pending acknowledgement
                </Typography>
                <Box sx={{ ml:"auto", display:"flex", gap:2 }}>
                  {[
                    { label:"Overdue",   value: ncFiltered.filter(f=>f.daysOverdue>0).length, color:T.danger  },
                    { label:"Due Today", value: ncFiltered.filter(f=>f.daysOverdue===0).length, color:T.warning },
                    { label:"Reminded",  value: ncFiltered.filter(f=>f.reminded).length, color:T.success       },
                  ].map(s => (
                    <Box key={s.label} textAlign="center">
                      <Typography sx={{ fontFamily:fMono, fontWeight:700,
                        fontSize:"1rem", color:s.color }}>{s.value}</Typography>
                      <Typography sx={{ fontFamily:fBody, fontSize:"0.65rem",
                        color:T.textMute }}>{s.label}</Typography>
                    </Box>
                  ))}
                </Box>
              </Box>

              {/* Non-compliant table */}
              <Box sx={{ borderRadius:"10px", border:`1px solid ${T.border}`, overflow:"hidden" }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TH>Faculty</TH>
                      <TH>Department</TH>
                      <TH>Pending Policy</TH>
                      <TH>Days Overdue</TH>
                      <TH>Reminder Status</TH>
                      <TH align="center">Action</TH>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {ncFiltered.map(row => (
                      <TableRow key={row.id} className="row-h">

                        <TD sx={{ minWidth:185 }}>
                          <Box display="flex" alignItems="center" gap={1.3}>
                            <Avatar sx={{ width:32, height:32, bgcolor:aColor(row.name).bg,
                              color:aColor(row.name).color,
                              fontFamily:fHead, fontSize:"0.65rem", fontWeight:700 }}>
                              {row.avatar}
                            </Avatar>
                            <Typography sx={{ fontFamily:fBody, fontWeight:700,
                              fontSize:"0.82rem", color:T.text }}>{row.name}</Typography>
                          </Box>
                        </TD>

                        <TD>
                          <Box sx={{ px:0.9, py:0.22, borderRadius:"6px",
                            bgcolor:"#F1F5F9", display:"inline-block" }}>
                            <Typography sx={{ fontFamily:fBody, fontSize:"0.7rem",
                              fontWeight:700, color:T.textSub }}>{row.dept}</Typography>
                          </Box>
                        </TD>

                        <TD sx={{ minWidth:185 }}>
                          <Typography sx={{ fontFamily:fBody, fontSize:"0.8rem",
                            color:T.text }}>{row.policy}</Typography>
                        </TD>

                        <TD>
                          <Box display="flex" alignItems="center" gap={0.6}
                            sx={{ px:1.1, py:0.35, borderRadius:"99px", width:"fit-content",
                              bgcolor: row.daysOverdue > 5 ? T.dangerLight
                                     : row.daysOverdue > 0 ? T.warningLight : T.infoLight }}>
                            {row.daysOverdue > 0 && (
                              <Warning sx={{ fontSize:11,
                                color: row.daysOverdue > 5 ? T.danger : T.warning }} />
                            )}
                            <Typography sx={{ fontFamily:fMono, fontWeight:700,
                              fontSize:"0.71rem",
                              color: row.daysOverdue > 5 ? T.danger
                                   : row.daysOverdue > 0 ? T.warning : T.info }}>
                              {row.daysOverdue === 0 ? "Due Today" : `${row.daysOverdue}d overdue`}
                            </Typography>
                          </Box>
                        </TD>

                        <TD>
                          <Box display="flex" alignItems="center" gap={0.5}
                            sx={{ px:1.1, py:0.32, borderRadius:"99px", width:"fit-content",
                              bgcolor: row.reminded ? T.successLight : "#F1F5F9" }}>
                            <Box sx={{ width:5, height:5, borderRadius:"50%",
                              bgcolor: row.reminded ? T.success : T.textMute }} />
                            <Typography sx={{ fontFamily:fBody, fontSize:"0.69rem",
                              fontWeight:700,
                              color: row.reminded ? T.success : T.textMute }}>
                              {row.reminded ? "Reminder Sent" : "Not Reminded"}
                            </Typography>
                          </Box>
                        </TD>

                        <TD align="center">
                          <Tooltip title={row.reminded ? "Send another reminder" : "Send reminder"}>
                            <Button size="small"
                              startIcon={<Send sx={{fontSize:13}} />}
                              onClick={() => handleRemind(row.id)}
                              variant={row.reminded ? "outlined" : "contained"}
                              sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.72rem",
                                textTransform:"none", borderRadius:"7px",
                                bgcolor: row.reminded ? "transparent" : T.accent,
                                borderColor: row.reminded ? T.accent : "transparent",
                                color: row.reminded ? T.accent : "#fff",
                                boxShadow:"none",
                                "&:hover":{ bgcolor: row.reminded ? T.accentLight : "#4F46E5",
                                  boxShadow:"none" } }}>
                              {row.reminded ? "Re-send" : "Remind"}
                            </Button>
                          </Tooltip>
                        </TD>
                      </TableRow>
                    ))}

                    {ncFiltered.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} sx={{ textAlign:"center", py:6 }}>
                          <CheckCircle sx={{ fontSize:40, color:T.success,
                            display:"block", mx:"auto", mb:1.5 }} />
                          <Typography sx={{ fontFamily:fBody, color:T.textMute }}>
                            All faculty are compliant for the selected filter.
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </Box>
            </Box>
          )}

          {/* ════════════════════════════════════
              TAB 2 — SIGNATURE VERIFICATION
          ════════════════════════════════════ */}
          {tabIndex === 2 && (
            <Box className="fu">

              {/* Toolbar */}
              <Box display="flex" justifyContent="space-between"
                alignItems="center" mb={2.5} flexWrap="wrap" gap={1.5}>
                <Box display="flex" alignItems="center" gap={1}>
                  <Box sx={{ p:0.75, borderRadius:"8px",
                    bgcolor:T.purpleLight, color:T.purple }}>
                    <History sx={{ fontSize:15 }} />
                  </Box>
                  <Box>
                    <Typography sx={{ fontFamily:fHead, fontWeight:700,
                      fontSize:"0.9rem", color:T.text }}>
                      Audit Logs &amp; Certificates
                    </Typography>
                    <Typography sx={{ fontFamily:fBody, fontSize:"0.72rem", color:T.textMute }}>
                      Tamper-evident digital signature trail for all policy acknowledgements.
                    </Typography>
                  </Box>
                </Box>

                <Box display="flex" gap={1} alignItems="center">
                  <TextField size="small" placeholder="Search by name or policy…"
                    value={sigSearch} onChange={e => setSigSearch(e.target.value)}
                    InputProps={{ startAdornment:
                      <InputAdornment position="start">
                        <Search sx={{ fontSize:15, color:T.textMute }} />
                      </InputAdornment>
                    }}
                    sx={{ width:230,
                      "& .MuiOutlinedInput-root":{ borderRadius:"8px",
                        fontFamily:fBody, fontSize:"0.8rem", bgcolor:T.surface,
                        "& fieldset":{ borderColor:T.border },
                        "&.Mui-focused fieldset":{ borderColor:T.accent } }}}
                  />
                  <Button size="small" variant="outlined"
                    startIcon={<Download sx={{fontSize:14}} />}
                    onClick={() => toast("Audit log exported.")}
                    sx={{ fontFamily:fBody, fontWeight:600, fontSize:"0.75rem",
                      textTransform:"none", borderRadius:"8px",
                      borderColor:T.border, color:T.textSub,
                      "&:hover":{ borderColor:T.accent, color:T.accent } }}>
                    Export Log
                  </Button>
                </Box>
              </Box>

              {/* Security notice */}
              <Box sx={{ p:2, borderRadius:"10px", mb:2.5,
                bgcolor:T.infoLight, border:`1px solid ${T.info}25`,
                display:"flex", gap:1.2, alignItems:"flex-start" }}>
                <Box sx={{ p:0.65, borderRadius:"7px",
                  bgcolor:`${T.info}18`, color:T.info, flexShrink:0 }}>
                  <Lock sx={{ fontSize:15 }} />
                </Box>
                <Typography sx={{ fontFamily:fBody, fontSize:"0.77rem",
                  color:T.textSub, lineHeight:1.65 }}>
                  All signatures are cryptographically verified and timestamped.
                  Each acknowledgement is logged with IP address, device method, and OTP verification
                  for legal and audit compliance.
                </Typography>
              </Box>

              {/* Signature log table */}
              <Box sx={{ borderRadius:"10px", border:`1px solid ${T.border}`, overflow:"hidden" }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TH>Signed By</TH>
                      <TH>Policy</TH>
                      <TH>Timestamp</TH>
                      <TH>IP Address</TH>
                      <TH>Method</TH>
                      <TH>OTP Status</TH>
                      <TH align="center">Certificate</TH>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {sigFiltered.map(row => (
                      <TableRow key={row.id} className="row-h">

                        <TD sx={{ minWidth:175 }}>
                          <Box display="flex" alignItems="center" gap={1.3}>
                            <Avatar sx={{ width:30, height:30, bgcolor:aColor(row.name).bg,
                              color:aColor(row.name).color,
                              fontFamily:fHead, fontSize:"0.62rem", fontWeight:700 }}>
                              {row.avatar}
                            </Avatar>
                            <Box>
                              <Typography sx={{ fontFamily:fBody, fontWeight:700,
                                fontSize:"0.81rem", color:T.text }}>{row.name}</Typography>
                              <Typography sx={{ fontFamily:fBody, fontSize:"0.67rem",
                                color:T.textMute }}>{row.dept}</Typography>
                            </Box>
                          </Box>
                        </TD>

                        <TD sx={{ minWidth:170 }}>
                          <Typography sx={{ fontFamily:fBody, fontSize:"0.79rem",
                            color:T.text }}>{row.policy}</Typography>
                        </TD>

                        <TD>
                          <Typography sx={{ fontFamily:fMono, fontSize:"0.74rem" }}>
                            {row.time}
                          </Typography>
                        </TD>

                        <TD>
                          <Typography sx={{ fontFamily:fMono, fontSize:"0.73rem",
                            color:T.textSub }}>{row.ip}</Typography>
                        </TD>

                        <TD>
                          <Box sx={{ px:1, py:0.28, borderRadius:"6px",
                            bgcolor: row.method.includes("Aadhaar")
                              ? T.purpleLight : T.accentLight,
                            display:"inline-block" }}>
                            <Typography sx={{ fontFamily:fBody, fontSize:"0.69rem",
                              fontWeight:700,
                              color: row.method.includes("Aadhaar") ? T.purple : T.accent }}>
                              {row.method}
                            </Typography>
                          </Box>
                        </TD>

                        <TD>
                          <Box display="flex" alignItems="center" gap={0.6}
                            sx={{ px:1.1, py:0.35, borderRadius:"99px",
                              bgcolor:T.successLight, width:"fit-content" }}>
                            <CheckCircle sx={{ fontSize:11, color:T.success }} />
                            <Typography sx={{ fontFamily:fBody, fontSize:"0.69rem",
                              fontWeight:700, color:T.success }}>{row.otp}</Typography>
                          </Box>
                        </TD>

                        <TD align="center">
                          <Button size="small" variant="outlined"
                            startIcon={<Download sx={{fontSize:13}} />}
                            onClick={() => { setCertDialog(row); }}
                            sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.72rem",
                              textTransform:"none", borderRadius:"7px",
                              borderColor:T.accent, color:T.accent,
                              "&:hover":{ bgcolor:T.accentLight } }}>
                            PDF
                          </Button>
                        </TD>
                      </TableRow>
                    ))}

                    {sigFiltered.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={7} sx={{ textAlign:"center", py:6 }}>
                          <Fingerprint sx={{ fontSize:40, color:T.border,
                            display:"block", mx:"auto", mb:1.5 }} />
                          <Typography sx={{ fontFamily:fBody, color:T.textMute }}>
                            No signature records match your search.
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </Box>

              {/* Footer note */}
              <Box sx={{ mt:2, display:"flex", alignItems:"center", gap:1 }}>
                <Info sx={{ fontSize:13, color:T.textMute }} />
                <Typography sx={{ fontFamily:fBody, fontSize:"0.72rem", color:T.textMute }}>
                  Showing {sigFiltered.length} of {SIG_LOGS.length} entries.
                  Logs are retained for 7 years as per institutional records policy.
                </Typography>
              </Box>
            </Box>
          )}

        </Box>
      </SCard>

      {/* ── Certificate Preview Dialog ── */}
      <Dialog open={Boolean(certDialog)} onClose={() => setCertDialog(null)}
        maxWidth="xs" fullWidth
        PaperProps={{ sx:{ borderRadius:"16px", border:`1px solid ${T.border}` } }}>
        {certDialog && (
          <>
            <DialogTitle sx={{ borderBottom:`1px solid ${T.border}`, bgcolor:"#FAFBFD", pb:2 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box display="flex" alignItems="center" gap={1.5}>
                  <Box sx={{ width:4, height:26, borderRadius:2, bgcolor:T.accent }} />
                  <Box>
                    <Typography sx={{ fontFamily:fHead, fontWeight:700,
                      fontSize:"0.95rem", color:T.text }}>Compliance Certificate</Typography>
                    <Typography sx={{ fontFamily:fBody, fontSize:"0.71rem", color:T.textMute }}>
                      {certDialog.name}
                    </Typography>
                  </Box>
                </Box>
                <IconButton size="small" onClick={() => setCertDialog(null)}
                  sx={{ bgcolor:"#F1F5F9", borderRadius:"8px" }}>
                  <Close fontSize="small" />
                </IconButton>
              </Box>
            </DialogTitle>
            <DialogContent sx={{ px:3, pt:3, pb:2 }}>
              <Grid container spacing={1.5}>
                {[
                  { label:"Signed By",   value:certDialog.name    },
                  { label:"Department",  value:certDialog.dept    },
                  { label:"Policy",      value:certDialog.policy  },
                  { label:"Timestamp",   value:certDialog.time    },
                  { label:"IP Address",  value:certDialog.ip      },
                  { label:"Method",      value:certDialog.method  },
                  { label:"OTP Status",  value:certDialog.otp     },
                ].map(s => (
                  <Grid item xs={6} key={s.label}>
                    <Box sx={{ p:1.3, borderRadius:"8px",
                      bgcolor:"#F9FAFB", border:`1px solid ${T.border}` }}>
                      <SLabel sx={{ mb:0.2 }}>{s.label}</SLabel>
                      <Typography sx={{ fontFamily:s.label.includes("IP")||s.label.includes("Time")
                        ? fMono : fBody,
                        fontWeight:600, fontSize:"0.77rem", color:T.text,
                        wordBreak:"break-all" }}>{s.value}</Typography>
                    </Box>
                  </Grid>
                ))}
                <Grid item xs={12}>
                  <Box sx={{ p:1.5, borderRadius:"8px",
                    bgcolor:T.successLight, border:`1px solid ${T.success}25`,
                    display:"flex", alignItems:"center", gap:1 }}>
                    <Shield sx={{ fontSize:16, color:T.success }} />
                    <Typography sx={{ fontFamily:fBody, fontWeight:700,
                      fontSize:"0.77rem", color:T.success }}>
                      Cryptographically verified — tamper-evident record
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions sx={{ px:3, pb:3, pt:1.5,
              borderTop:`1px solid ${T.border}`, bgcolor:"#FAFBFD", gap:1 }}>
              <Button onClick={() => setCertDialog(null)} variant="outlined" size="small"
                sx={{ fontFamily:fBody, fontWeight:600, fontSize:"0.78rem",
                  textTransform:"none", borderRadius:"8px",
                  borderColor:T.border, color:T.textSub }}>
                Close
              </Button>
              <Button variant="contained" size="small"
                startIcon={<Download sx={{fontSize:14}} />}
                onClick={() => { setCertDialog(null); toast(`Certificate for ${certDialog.name} downloading…`); }}
                sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.78rem",
                  textTransform:"none", borderRadius:"8px",
                  bgcolor:T.accent, boxShadow:"none",
                  "&:hover":{ bgcolor:"#4F46E5", boxShadow:"none" } }}>
                Download Certificate
              </Button>
            </DialogActions>
          </>
        )}
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

export default PolicyComplianceView;