import React, { useState } from "react";
import {
  Box, Grid, Typography, Button, TextField, MenuItem,
  Tabs, Tab, Table, TableBody, TableCell, TableHead, TableRow,
  IconButton, Tooltip, Dialog, DialogTitle, DialogContent,
  DialogActions, Divider, Avatar, Alert, Stack, Checkbox,
  Snackbar, InputAdornment, LinearProgress
} from "@mui/material";
import {
  Assessment, RateReview, Verified, CloudUpload,
  Visibility, CheckCircle, Cancel, NotificationsActive,
  School, AssignmentInd, History, FactCheck, Gavel,
  Description, Close, Download, TrendingUp, TrendingDown,
  EmojiEvents, Search, InfoOutlined, Send,
  RadioButtonUnchecked, Warning, Star, LockOpen, Lock
} from "@mui/icons-material";

/* ─────────────────────────────────────────
   DESIGN TOKENS  (platform-consistent)
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
  text:         "#111827",
  textSub:      "#4B5563",
  textMute:     "#9CA3AF",
};

const fHead = "Roboto, Helvetica, Arial, sans-serif";
const fBody = "Roboto, Helvetica, Arial, sans-serif";
const fMono = "Roboto, Helvetica, Arial, sans-serif";
/* ─────────────────────────────────────────
   GLOBAL STYLES
───────────────────────────────────────── */
const Fonts = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Sora:wght@600;700&family=Nunito:wght@400;500;600;700&family=JetBrains+Mono:wght@500;600&display=swap');
    * { box-sizing:border-box; }
    @keyframes fadeUp  { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:none} }
    @keyframes pulse   { 0%,100%{opacity:1} 50%{opacity:.4} }
    @keyframes barFill { from{width:0} to{width:var(--w)} }
    .fu  { animation: fadeUp 0.3s ease both; }
    .fu1 { animation: fadeUp 0.3s .06s ease both; }
    .fu2 { animation: fadeUp 0.3s .12s ease both; }
    .fu3 { animation: fadeUp 0.3s .18s ease both; }
    .row-h:hover { background:#F9FAFB !important; transition:background .15s; }
    .blink { animation: pulse 2s infinite; }
  `}</style>
);

/* ─────────────────────────────────────────
   MOCK DATA
───────────────────────────────────────── */
const SUBMISSIONS_INIT = [
  {
    id:1, faculty:"Dr. Sarah Smith",   avatar:"SS", dept:"CSE",   empId:"FAC-0041",
    designation:"Associate Professor", joining:"2018-06-01", stage:3,
    selfScore:320, hodScore:310, adminScore:null, adminRemarks:"",
    hodRemarks:"Strong research output. Minor deduction for pending resubmission.",
    status:"Pending Admin", date:"2026-01-15",
    documents:[
      { id:"d1", name:"Scopus_Publications.pdf",  category:"Research",   verified:false },
      { id:"d2", name:"Mentorship_Log.xlsx",       category:"Teaching",   verified:false },
      { id:"d3", name:"Workshop_Attendance.pdf",   category:"Extension",  verified:false },
    ],
  },
  {
    id:2, faculty:"Prof. Rajan Kumar", avatar:"RK", dept:"Mech",  empId:"FAC-0012",
    designation:"Professor",           joining:"2015-03-10", stage:5,
    selfScore:450, hodScore:450, adminScore:445, adminRemarks:"All claims independently verified. Excellent performance.",
    hodRemarks:"Exceptional year — filed 2 patents. Recommended for CAS Stage 6.",
    status:"Verified", date:"2026-01-12",
    documents:[
      { id:"d4", name:"Patent_Certificate.pdf",   category:"Research",   verified:true  },
      { id:"d5", name:"SCI_Journal_2025.pdf",     category:"Research",   verified:true  },
    ],
  },
  {
    id:3, faculty:"Dr. Emily Davis",   avatar:"ED", dept:"Civil", empId:"FAC-0087",
    designation:"Assistant Professor", joining:"2020-01-20", stage:2,
    selfScore:210, hodScore:195, adminScore:null, adminRemarks:"",
    hodRemarks:"Good teaching scores. Research output needs strengthening next cycle.",
    status:"Pending Admin", date:"2026-01-18",
    documents:[
      { id:"d6", name:"Teaching_Portfolio.pdf",   category:"Teaching",   verified:false },
    ],
  },
  {
    id:4, faculty:"Ms. Kavya Sharma",  avatar:"KS", dept:"ECE",   empId:"FAC-0115",
    designation:"Assistant Professor", joining:"2021-07-01", stage:1,
    selfScore:180, hodScore:175, adminScore:170, adminRemarks:"Good first-year review.",
    hodRemarks:"Consistent. Encouraged to submit to indexed journals next cycle.",
    status:"Verified", date:"2026-01-20",
    documents:[
      { id:"d7", name:"IEEE_Conf_Paper.pdf",      category:"Research",   verified:true  },
      { id:"d8", name:"Student_Feedback.pdf",     category:"Teaching",   verified:true  },
    ],
  },
];

const DEPT_PROGRESS = [
  { dept:"CSE",   submitted:12, total:18 },
  { dept:"Mech",  submitted:8,  total:12 },
  { dept:"Civil", submitted:5,  total:9  },
  { dept:"ECE",   submitted:10, total:15 },
];

const AY_OPTIONS = [
  { value:"2025-26", label:"2025–26 (Current)" },
  { value:"2024-25", label:"2024–25 (Audit)" },
  { value:"2023-24", label:"2023–24 (Archive)" },
];

const DOC_CAT_STYLE = {
  Research:  { color:T.accent,   bg:T.accentLight   },
  Teaching:  { color:T.success,  bg:T.successLight  },
  Extension: { color:T.warning,  bg:T.warningLight  },
};

/* ─────────────────────────────────────────
   ELIGIBILITY ENGINE
───────────────────────────────────────── */
const getEligibility = (sub) => {
  const score = sub.adminScore ?? sub.hodScore;
  const yrs   = new Date().getFullYear() - new Date(sub.joining).getFullYear();
  const scoreOk = score >= 300;
  const yrsOk   = yrs >= 5;
  return {
    eligible:  scoreOk && yrsOk,
    score, yrs, scoreOk, yrsOk,
    nextStage: `Stage ${sub.stage + 1}`,
    failReason: !scoreOk ? `API ${score} < 300 minimum` : `${yrs} yrs service < 5 yrs required`,
  };
};

/* ─────────────────────────────────────────
   REUSABLE PRIMITIVE COMPONENTS
───────────────────────────────────────── */
const SCard = ({ children, sx={}, ...p }) => (
  <Box sx={{ background:T.surface, border:`1px solid ${T.border}`, borderRadius:"14px", ...sx }} {...p}>
    {children}
  </Box>
);

const SLabel = ({ children, sx={} }) => (
  <Typography sx={{
    fontFamily:fBody, fontSize:"0.67rem", fontWeight:700,
    letterSpacing:"0.08em", textTransform:"uppercase",
    color:T.textMute, mb:0.5, ...sx
  }}>{children}</Typography>
);

const TH = ({ children, align, sx={} }) => (
  <TableCell align={align} sx={{
    fontFamily:fBody, fontWeight:700, fontSize:"0.68rem",
    letterSpacing:"0.06em", textTransform:"uppercase",
    color:T.textMute, borderBottom:`1px solid ${T.border}`,
    py:1.5, bgcolor:"#F9FAFB", whiteSpace:"nowrap", ...sx
  }}>{children}</TableCell>
);

const TD = ({ children, sx={}, align }) => (
  <TableCell align={align} sx={{
    fontFamily:fBody, fontSize:"0.81rem", color:T.textSub,
    borderBottom:`1px solid ${T.border}`, py:1.8, ...sx
  }}>{children}</TableCell>
);

const StatusPill = ({ status }) => {
  const map = {
    "Pending Admin": { color:T.warning, bg:T.warningLight },
    Verified:        { color:T.success, bg:T.successLight },
    Rejected:        { color:T.danger,  bg:T.dangerLight  },
  };
  const s = map[status] || { color:T.textMute, bg:"#F1F5F9" };
  return (
    <Box display="flex" alignItems="center" gap={0.6}
      sx={{ px:1.2, py:0.36, borderRadius:"99px", bgcolor:s.bg, width:"fit-content" }}>
      <Box sx={{ width:6, height:6, borderRadius:"50%", bgcolor:s.color }} />
      <Typography sx={{ fontFamily:fBody, fontSize:"0.71rem", fontWeight:700, color:s.color }}>
        {status}
      </Typography>
    </Box>
  );
};

const StageBadge = ({ stage }) => (
  <Box sx={{ px:1, py:0.28, borderRadius:"6px", bgcolor:T.accentLight, display:"inline-block" }}>
    <Typography sx={{ fontFamily:fMono, fontSize:"0.72rem", fontWeight:700, color:T.accent }}>
      Stage {stage}
    </Typography>
  </Box>
);

const ScoreDelta = ({ self, final }) => {
  if (final == null) return <Typography sx={{ fontFamily:fMono, fontSize:"0.71rem", color:T.textMute }}>—</Typography>;
  const d = final - self;
  const color = d > 0 ? T.success : d < 0 ? T.danger : T.textMute;
  return (
    <Box display="flex" alignItems="center" gap={0.4}>
      {d > 0 ? <TrendingUp sx={{ fontSize:13, color:T.success }} />
       : d < 0 ? <TrendingDown sx={{ fontSize:13, color:T.danger }} />
       : null}
      <Typography sx={{ fontFamily:fMono, fontSize:"0.72rem", fontWeight:700, color }}>
        {d === 0 ? "±0" : `${d > 0 ? "+" : ""}${d}`}
      </Typography>
    </Box>
  );
};

const DInput = (props) => (
  <TextField size="small" fullWidth {...props} sx={{
    "& .MuiOutlinedInput-root":{
      borderRadius:"8px", fontFamily:fBody, fontSize:"0.82rem",
      bgcolor:T.surface,
      "& fieldset":{ borderColor:T.border },
      "&.Mui-focused fieldset":{ borderColor:T.accent },
    },
    "& .MuiInputLabel-root.Mui-focused":{ color:T.accent },
    ...props.sx
  }} />
);

/* ═════════════════════════════════════════════
   MAIN COMPONENT
═════════════════════════════════════════════ */
const PbasAdminView = () => {
  const [tabIndex,      setTabIndex]      = useState(1);
  const [cycleActive,   setCycleActive]   = useState(false);
  const [cycleYear,     setCycleYear]     = useState("2025-26");
  const [cycleDeadline, setCycleDeadline] = useState("");
  const [submissions,   setSubmissions]   = useState(SUBMISSIONS_INIT);
  const [searchQ,       setSearchQ]       = useState("");
  const [casDialog,     setCasDialog]     = useState(null);

  /* Review dialog */
  const [dialog,        setDialog]        = useState(null);
  const [adminScore,    setAdminScore]    = useState("");
  const [adminRemarks,  setAdminRemarks]  = useState("");
  const [activeDocs,    setActiveDocs]    = useState([]);

  const [snack, setSnack] = useState({ open:false, msg:"", severity:"success" });
  const toast = (msg, severity="success") => setSnack({ open:true, msg, severity });

  /* Derived */
  const pending  = submissions.filter(s => s.status === "Pending Admin");
  const verified = submissions.filter(s => s.status === "Verified");
  const eligible = verified.filter(s => getEligibility(s).eligible);

  const filteredSubs = submissions.filter(s =>
    !searchQ ||
    s.faculty.toLowerCase().includes(searchQ.toLowerCase()) ||
    s.dept.toLowerCase().includes(searchQ.toLowerCase())
  );

  /* ── Handlers ── */
  const handleStartCycle = () => {
    if (!cycleDeadline) { toast("Please set a submission deadline first.", "error"); return; }
    setCycleActive(true);
    toast(`Appraisal cycle ${cycleYear} is now live — all faculty notified.`);
  };

  const openReview = (sub) => {
    setDialog(sub);
    setAdminScore(String(sub.adminScore ?? sub.hodScore));
    setAdminRemarks(sub.adminRemarks || "");
    setActiveDocs(sub.documents.map(d => ({ ...d })));
  };

  const toggleDoc = (id) =>
    setActiveDocs(prev => prev.map(d => d.id === id ? { ...d, verified: !d.verified } : d));

  const handleFinalize = () => {
    const unverified = activeDocs.filter(d => !d.verified).length;
    if (unverified > 0) {
      if (!window.confirm(`${unverified} document(s) still unverified. Proceed anyway?`)) return;
    }
    setSubmissions(prev => prev.map(s =>
      s.id === dialog.id
        ? { ...s, adminScore:parseInt(adminScore), status:"Verified", documents:activeDocs, adminRemarks }
        : s
    ));
    toast(`${dialog.faculty}'s PBAS verified. Score locked at ${adminScore}.`);
    setDialog(null);
  };

  const handleInitiateCas = () => {
    toast(`CAS promotion process initiated for ${casDialog.faculty}. Academic committee notified.`);
    setCasDialog(null);
  };

  /* ─────────────────────────────────────────
     TABS CONFIG
  ───────────────────────────────────────── */
  const TABS = [
    { label:"Cycle Setup",        Icon:AssignmentInd, count:0              },
    { label:"Verification Hub",   Icon:RateReview,    count:pending.length  },
    { label:"CAS Promotion Board",Icon:Gavel,         count:eligible.length },
  ];

  /* ─────────────────────────────────────────
     RENDER
  ───────────────────────────────────────── */
  return (
    <Box sx={{ p:3, bgcolor:T.bg, minHeight:"100vh", fontFamily:fBody }}>
      <Fonts />

      {/* ══════════ HEADER ══════════ */}
      <Box display="flex" justifyContent="space-between" alignItems="flex-start"
        mb={3} flexWrap="wrap" gap={2}>
        <Box>
          <Typography sx={{ fontFamily:fBody, fontSize:"0.72rem", fontWeight:700,
            letterSpacing:"0.1em", textTransform:"uppercase", color:T.textMute, mb:0.3 }}>
            Academic Affairs · Performance Management
          </Typography>
          <Typography sx={{ fontFamily:fHead, fontWeight:700, fontSize:"1.5rem", color:T.text }}>
            PBAS &amp; CAS Performance Management
          </Typography>
          <Typography sx={{ fontFamily:fBody, fontSize:"0.82rem", color:T.textSub, mt:0.3 }}>
            Performance Based Appraisal System &amp; Career Advancement Scheme — Admin Review
          </Typography>
        </Box>

        <Box display="flex" gap={1.5} alignItems="flex-start" pt={0.5} flexWrap="wrap">
          {cycleActive && (
            <Box display="flex" alignItems="center" gap={0.8}
              sx={{ px:1.5, py:0.7, borderRadius:"9px",
                bgcolor:T.successLight, border:`1px solid ${T.success}40` }}>
              <Box sx={{ width:7, height:7, borderRadius:"50%", bgcolor:T.success }} className="blink" />
              <Typography sx={{ fontFamily:fBody, fontSize:"0.74rem", fontWeight:700, color:T.success }}>
                Live — AY {cycleYear}
              </Typography>
            </Box>
          )}
          <Button size="small" variant="outlined" startIcon={<Download sx={{fontSize:15}} />}
            onClick={() => toast("PBAS summary exported to PDF.")}
            sx={{ fontFamily:fBody, fontWeight:600, fontSize:"0.76rem", textTransform:"none",
              borderRadius:"8px", borderColor:T.border, color:T.textSub,
              "&:hover":{ borderColor:T.accent, color:T.accent } }}>
            Export Report
          </Button>
        </Box>
      </Box>

      {/* ══════════ STAT STRIP ══════════ */}
      <Grid container spacing={2} mb={3}>
        {[
          { label:"Total Submissions",   value:submissions.length, sub:"This appraisal cycle",   color:T.accent,   Icon:Assessment  },
          { label:"Pending Verification",value:pending.length,     sub:"Awaiting admin review",  color:T.warning,  Icon:RateReview  },
          { label:"Verified",            value:verified.length,    sub:"Scores locked",          color:T.success,  Icon:Verified    },
          { label:"CAS Eligible",        value:eligible.length,    sub:"Ready for promotion",    color:T.purple,   Icon:EmojiEvents },
        ].map((s,i) => (
          <Grid item xs={6} md={3} key={i}>
            <SCard sx={{ p:2.5 }} className={`fu${i}`}>
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

      {/* ══════════ MAIN CARD ══════════ */}
      <SCard sx={{ overflow:"hidden" }} className="fu1">

        {/* Tab bar */}
        <Box sx={{ borderBottom:`1px solid ${T.border}`, bgcolor:"#FAFBFD" }}>
          <Tabs value={tabIndex} onChange={(_,v) => setTabIndex(v)} sx={{
            px:2,
            "& .MuiTabs-indicator":{ bgcolor:T.accent, height:"2.5px", borderRadius:"2px 2px 0 0" },
            "& .MuiTab-root":{
              fontFamily:fBody, fontWeight:600, fontSize:"0.8rem",
              textTransform:"none", color:T.textMute, minHeight:52,
              "&.Mui-selected":{ color:T.accent }
            }
          }}>
            {TABS.map((t,i) => (
              <Tab key={i}
                icon={<t.Icon sx={{ fontSize:16 }} />}
                iconPosition="start"
                label={
                  <Box display="flex" alignItems="center" gap={0.8}>
                    {t.label}
                    {t.count > 0 && (
                      <Box sx={{ px:0.7, py:0.1, borderRadius:"99px",
                        bgcolor: tabIndex===i ? T.accentLight : "#F1F5F9" }}>
                        <Typography sx={{ fontFamily:fMono, fontSize:"0.62rem", fontWeight:700,
                          color: tabIndex===i ? T.accent : T.textMute }}>{t.count}</Typography>
                      </Box>
                    )}
                  </Box>
                }
              />
            ))}
          </Tabs>
        </Box>

        <Box p={3}>

          {/* ════════════════════════════
              TAB 0 — CYCLE SETUP
          ════════════════════════════ */}
          {tabIndex === 0 && (
            <Box className="fu">
              <Grid container spacing={3} justifyContent="center">

                {/* Cycle control card */}
                <Grid item xs={12} md={5}>
                  <Box sx={{
                    p:3.5, borderRadius:"14px", textAlign:"center",
                    border:`2px dashed ${cycleActive ? T.success : T.border}`,
                    bgcolor: cycleActive ? T.successLight : "#FAFBFD",
                    transition:"all 0.35s ease"
                  }}>
                    {cycleActive
                      ? <CheckCircle sx={{ fontSize:54, color:T.success, mb:1.5 }} />
                      : <History sx={{ fontSize:54, color:T.textMute, mb:1.5 }} />}

                    <Typography sx={{ fontFamily:fHead, fontWeight:700,
                      fontSize:"1.05rem", color:T.text, mb:0.5 }}>
                      Appraisal Cycle Management
                    </Typography>
                    <Typography sx={{ fontFamily:fBody, fontSize:"0.78rem",
                      color:T.textMute, mb:3, lineHeight:1.6 }}>
                      {cycleActive
                        ? `Cycle AY ${cycleYear} is live. Faculty submissions are open until ${cycleDeadline || "—"}.`
                        : "Configure and deploy PBAS self-appraisal forms to all faculty."}
                    </Typography>

                    <Stack spacing={2.2} textAlign="left">
                      <Box>
                        <SLabel sx={{ mb:0.7 }}>Academic Year</SLabel>
                        <DInput select value={cycleYear}
                          onChange={e => setCycleYear(e.target.value)}
                          disabled={cycleActive}>
                          {AY_OPTIONS.map(o => (
                            <MenuItem key={o.value} value={o.value}
                              sx={{ fontFamily:fBody, fontSize:"0.82rem" }}>{o.label}</MenuItem>
                          ))}
                        </DInput>
                      </Box>

                      <Box>
                        <SLabel sx={{ mb:0.7 }}>Submission Deadline *</SLabel>
                        <DInput type="date" value={cycleDeadline}
                          onChange={e => setCycleDeadline(e.target.value)}
                          disabled={cycleActive}
                          InputLabelProps={{ shrink:true }} />
                      </Box>

                      <Button variant="contained" size="large" fullWidth
                        disabled={cycleActive}
                        onClick={handleStartCycle}
                        startIcon={cycleActive
                          ? <CheckCircle sx={{fontSize:17}} />
                          : <NotificationsActive sx={{fontSize:17}} />}
                        sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.86rem",
                          textTransform:"none", borderRadius:"9px", py:1.3,
                          bgcolor: cycleActive ? T.success : T.accent, boxShadow:"none",
                          "&:hover":{ bgcolor: cycleActive ? T.success : "#4F46E5", boxShadow:"none" },
                          "&.Mui-disabled":{ bgcolor:"#F1F5F9", color:T.textMute } }}>
                        {cycleActive ? `Cycle Live — AY ${cycleYear}` : "Initiate Global Submission"}
                      </Button>

                      {cycleActive && (
                        <Box sx={{ p:1.5, borderRadius:"9px",
                          bgcolor:T.warningLight, border:`1px solid ${T.warning}30` }}>
                          <Typography sx={{ fontFamily:fBody, fontSize:"0.74rem",
                            color:T.warning, fontWeight:600, textAlign:"center" }}>
                            To close the cycle, switch to the next academic year.
                          </Typography>
                        </Box>
                      )}
                    </Stack>
                  </Box>
                </Grid>

                {/* Dept progress tracker */}
                <Grid item xs={12} md={5}>
                  <Typography sx={{ fontFamily:fHead, fontWeight:700,
                    fontSize:"0.92rem", color:T.text, mb:1.8 }}>
                    Submission Progress by Department
                  </Typography>
                  <SCard sx={{ p:2.5 }}>
                    <Stack spacing={2.5}>
                      {DEPT_PROGRESS.map(d => {
                        const pct = Math.round((d.submitted / d.total) * 100);
                        const col = pct >= 80 ? T.success : pct >= 50 ? T.accent : T.warning;
                        return (
                          <Box key={d.dept}>
                            <Box display="flex" justifyContent="space-between"
                              alignItems="center" mb={0.7}>
                              <Typography sx={{ fontFamily:fBody, fontWeight:700,
                                fontSize:"0.82rem", color:T.text }}>{d.dept}</Typography>
                              <Box display="flex" alignItems="center" gap={1}>
                                <Typography sx={{ fontFamily:fMono, fontSize:"0.72rem",
                                  color:T.textMute }}>{d.submitted}/{d.total}</Typography>
                                <Typography sx={{ fontFamily:fMono, fontSize:"0.72rem",
                                  fontWeight:700, color:col }}>{pct}%</Typography>
                              </Box>
                            </Box>
                            <Box sx={{ height:7, borderRadius:99,
                              bgcolor:T.border, overflow:"hidden" }}>
                              <Box sx={{
                                height:"100%", width:`${pct}%`, borderRadius:99,
                                bgcolor:col, transition:"width 1.2s cubic-bezier(.4,0,.2,1)"
                              }} />
                            </Box>
                          </Box>
                        );
                      })}
                    </Stack>

                    <Divider sx={{ borderColor:T.border, my:2.5 }} />
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Typography sx={{ fontFamily:fBody, fontSize:"0.78rem", color:T.textSub }}>
                        Overall Completion
                      </Typography>
                      <Typography sx={{ fontFamily:fMono, fontWeight:700,
                        fontSize:"0.88rem", color:T.accent }}>
                        {Math.round((DEPT_PROGRESS.reduce((a,d)=>a+d.submitted,0) /
                          DEPT_PROGRESS.reduce((a,d)=>a+d.total,0))*100)}%
                      </Typography>
                    </Box>
                    <Box sx={{ mt:1, height:8, borderRadius:99, bgcolor:T.border, overflow:"hidden" }}>
                      <Box sx={{
                        height:"100%", borderRadius:99, bgcolor:T.accent,
                        width:`${Math.round((DEPT_PROGRESS.reduce((a,d)=>a+d.submitted,0) /
                          DEPT_PROGRESS.reduce((a,d)=>a+d.total,0))*100)}%`,
                        transition:"width 1.2s ease"
                      }} />
                    </Box>
                  </SCard>
                </Grid>
              </Grid>
            </Box>
          )}

          {/* ════════════════════════════
              TAB 1 — VERIFICATION HUB
          ════════════════════════════ */}
          {tabIndex === 1 && (
            <Box className="fu">
              {/* Toolbar */}
              <Box display="flex" justifyContent="space-between" alignItems="center"
                mb={2.5} flexWrap="wrap" gap={1.5}>
                <Alert severity="info" icon={<InfoOutlined sx={{fontSize:16}} />}
                  sx={{ borderRadius:"9px", fontFamily:fBody, fontSize:"0.77rem",
                    flex:1, border:`1px solid ${T.accent}30`, minWidth:0 }}>
                  Review HOD-recommended API scores and independently verify submitted evidence
                  for research, teaching, and extension activities.
                </Alert>
                <TextField size="small" placeholder="Search faculty or dept…"
                  value={searchQ} onChange={e => setSearchQ(e.target.value)}
                  InputProps={{ startAdornment:
                    <InputAdornment position="start">
                      <Search sx={{ fontSize:15, color:T.textMute }} />
                    </InputAdornment> }}
                  sx={{ width:210, "& .MuiOutlinedInput-root":{
                    borderRadius:"8px", fontFamily:fBody, fontSize:"0.78rem",
                    "& fieldset":{ borderColor:T.border },
                    "&.Mui-focused fieldset":{ borderColor:T.accent } }}} />
              </Box>

              {/* Table */}
              <Box sx={{ borderRadius:"10px", border:`1px solid ${T.border}`, overflow:"hidden" }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TH>Faculty</TH>
                      <TH>Stage</TH>
                      <TH>Self Score</TH>
                      <TH>HOD Score</TH>
                      <TH>Admin Score</TH>
                      <TH>Delta</TH>
                      <TH>Documents</TH>
                      <TH>Status</TH>
                      <TH align="center">Action</TH>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredSubs.map(row => {
                      const docsVfd = row.documents.filter(d => d.verified).length;
                      return (
                        <TableRow key={row.id} className="row-h">

                          {/* Faculty */}
                          <TD sx={{ minWidth:175 }}>
                            <Box display="flex" alignItems="center" gap={1.2}>
                              <Avatar sx={{ width:32, height:32, fontSize:"0.67rem",
                                fontWeight:700, bgcolor:T.accentLight, color:T.accent }}>
                                {row.avatar}
                              </Avatar>
                              <Box>
                                <Typography sx={{ fontFamily:fBody, fontWeight:700,
                                  fontSize:"0.82rem", color:T.text }}>{row.faculty}</Typography>
                                <Typography sx={{ fontFamily:fBody, fontSize:"0.68rem",
                                  color:T.textMute }}>{row.dept} · {row.designation}</Typography>
                              </Box>
                            </Box>
                          </TD>

                          {/* Stage */}
                          <TD><StageBadge stage={row.stage} /></TD>

                          {/* Scores */}
                          <TD>
                            <Typography sx={{ fontFamily:fMono, fontSize:"0.82rem",
                              color:T.textMute }}>{row.selfScore}</Typography>
                          </TD>
                          <TD>
                            <Typography sx={{ fontFamily:fMono, fontSize:"0.82rem",
                              fontWeight:600, color:T.accent }}>{row.hodScore}</Typography>
                          </TD>
                          <TD>
                            {row.adminScore != null
                              ? <Typography sx={{ fontFamily:fMono, fontSize:"0.82rem",
                                  fontWeight:700, color:T.success }}>{row.adminScore}</Typography>
                              : <Typography sx={{ fontFamily:fMono, fontSize:"0.74rem",
                                  color:T.textMute }}>—</Typography>}
                          </TD>

                          {/* Delta */}
                          <TD>
                            <ScoreDelta self={row.selfScore} final={row.adminScore} />
                          </TD>

                          {/* Docs */}
                          <TD>
                            <Box display="flex" alignItems="center" gap={0.8}>
                              <Box sx={{ px:0.9, py:0.22, borderRadius:"5px",
                                bgcolor:"#F1F5F9" }}>
                                <Typography sx={{ fontFamily:fMono, fontSize:"0.7rem",
                                  fontWeight:700, color:T.textMute }}>
                                  {row.documents.length}
                                </Typography>
                              </Box>
                              {row.documents.length > 0 && (
                                <Typography sx={{ fontFamily:fMono, fontSize:"0.68rem",
                                  color: docsVfd === row.documents.length ? T.success : T.warning,
                                  fontWeight:700 }}>
                                  {docsVfd}/{row.documents.length} ✓
                                </Typography>
                              )}
                            </Box>
                          </TD>

                          {/* Status */}
                          <TD><StatusPill status={row.status} /></TD>

                          {/* Action */}
                          <TD align="center">
                            <Button size="small"
                              variant={row.status === "Verified" ? "outlined" : "contained"}
                              startIcon={row.status === "Verified"
                                ? <Visibility sx={{fontSize:14}} />
                                : <FactCheck sx={{fontSize:14}} />}
                              onClick={() => openReview(row)}
                              sx={{
                                fontFamily:fBody, fontWeight:700, fontSize:"0.73rem",
                                textTransform:"none", borderRadius:"8px",
                                ...(row.status === "Verified"
                                  ? { borderColor:T.border, color:T.textSub }
                                  : { bgcolor:T.accent, boxShadow:"none", color:"#fff",
                                      "&:hover":{ bgcolor:"#4F46E5", boxShadow:"none" } })
                              }}>
                              {row.status === "Verified" ? "View" : "Verify"}
                            </Button>
                          </TD>
                        </TableRow>
                      );
                    })}

                    {filteredSubs.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={9} sx={{ textAlign:"center",
                          py:6, fontFamily:fBody, color:T.textMute }}>
                          No submissions match your search.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </Box>
            </Box>
          )}

          {/* ════════════════════════════
              TAB 2 — CAS PROMOTION BOARD
          ════════════════════════════ */}
          {tabIndex === 2 && (
            <Box className="fu">
              <Box display="flex" alignItems="center" gap={1.2} mb={2.5}>
                <Box sx={{ p:0.9, borderRadius:"9px",
                  bgcolor:T.purpleLight, color:T.purple }}>
                  <Gavel sx={{ fontSize:18 }} />
                </Box>
                <Box>
                  <Typography sx={{ fontFamily:fHead, fontWeight:700,
                    fontSize:"0.95rem", color:T.text }}>
                    Career Advancement Scheme (CAS) Registry
                  </Typography>
                  <Typography sx={{ fontFamily:fBody, fontSize:"0.76rem", color:T.textMute }}>
                    Verified faculty eligible for stage promotion based on API score ≥ 300 and service ≥ 5 years
                  </Typography>
                </Box>
              </Box>

              {verified.length === 0 ? (
                <Box textAlign="center" py={6}>
                  <Verified sx={{ fontSize:54, color:T.border, mb:1.5 }} />
                  <Typography sx={{ fontFamily:fBody, fontSize:"0.9rem", color:T.textMute }}>
                    No verified PBAS submissions yet — complete verification first.
                  </Typography>
                </Box>
              ) : (
                <Box sx={{ borderRadius:"10px", border:`1px solid ${T.border}`, overflow:"hidden" }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TH>Faculty</TH>
                        <TH>Designation</TH>
                        <TH>Current Stage</TH>
                        <TH>Service Yrs</TH>
                        <TH>Verified API</TH>
                        <TH>Criteria Check</TH>
                        <TH>Eligibility</TH>
                        <TH align="center">Action</TH>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {verified.map(row => {
                        const e = getEligibility(row);
                        return (
                          <TableRow key={row.id} className="row-h">

                            {/* Faculty */}
                            <TD sx={{ minWidth:170 }}>
                              <Box display="flex" alignItems="center" gap={1.2}>
                                <Avatar sx={{ width:30, height:30, fontSize:"0.65rem",
                                  fontWeight:700, bgcolor:T.accentLight, color:T.accent }}>
                                  {row.avatar}
                                </Avatar>
                                <Box>
                                  <Typography sx={{ fontFamily:fBody, fontWeight:700,
                                    fontSize:"0.82rem", color:T.text }}>{row.faculty}</Typography>
                                  <Typography sx={{ fontFamily:fBody, fontSize:"0.68rem",
                                    color:T.textMute }}>{row.dept}</Typography>
                                </Box>
                              </Box>
                            </TD>

                            <TD>
                              <Typography sx={{ fontFamily:fBody,
                                fontSize:"0.79rem" }}>{row.designation}</Typography>
                            </TD>

                            <TD><StageBadge stage={row.stage} /></TD>

                            <TD>
                              <Typography sx={{ fontFamily:fMono, fontSize:"0.82rem",
                                fontWeight:700, color: e.yrsOk ? T.success : T.danger }}>
                                {e.yrs} yrs
                              </Typography>
                            </TD>

                            <TD>
                              <Typography sx={{ fontFamily:fMono, fontWeight:700,
                                fontSize:"0.9rem", color: e.scoreOk ? T.success : T.danger }}>
                                {e.score}
                              </Typography>
                            </TD>

                            {/* Criteria checklist */}
                            <TD sx={{ minWidth:165 }}>
                              <Stack spacing={0.55}>
                                {[
                                  { ok:e.scoreOk, label:`API ≥ 300 (${e.score})` },
                                  { ok:e.yrsOk,   label:`Service ≥ 5 yrs (${e.yrs} yrs)` },
                                ].map((c,i) => (
                                  <Box key={i} display="flex" alignItems="center" gap={0.7}>
                                    {c.ok
                                      ? <CheckCircle sx={{ fontSize:13, color:T.success }} />
                                      : <Cancel sx={{ fontSize:13, color:T.danger }} />}
                                    <Typography sx={{ fontFamily:fBody, fontSize:"0.7rem",
                                      color: c.ok ? T.textSub : T.danger }}>{c.label}</Typography>
                                  </Box>
                                ))}
                              </Stack>
                            </TD>

                            {/* Eligibility badge */}
                            <TD>
                              {e.eligible ? (
                                <Box sx={{ px:1.2, py:0.4, borderRadius:"8px",
                                  bgcolor:T.successLight, border:`1px solid ${T.success}30`,
                                  display:"inline-block" }}>
                                  <Typography sx={{ fontFamily:fBody, fontSize:"0.72rem",
                                    fontWeight:700, color:T.success }}>
                                    Eligible → {e.nextStage}
                                  </Typography>
                                </Box>
                              ) : (
                                <Box sx={{ px:1.2, py:0.4, borderRadius:"8px",
                                  bgcolor:T.dangerLight, border:`1px solid ${T.danger}30`,
                                  display:"inline-block" }}>
                                  <Typography sx={{ fontFamily:fBody, fontSize:"0.7rem",
                                    fontWeight:600, color:T.danger }}>{e.failReason}</Typography>
                                </Box>
                              )}
                            </TD>

                            {/* Action */}
                            <TD align="center">
                              <Button size="small" variant="contained"
                                disabled={!e.eligible}
                                startIcon={<EmojiEvents sx={{fontSize:14}} />}
                                onClick={() => setCasDialog(row)}
                                sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.73rem",
                                  textTransform:"none", borderRadius:"8px",
                                  bgcolor:T.purple, boxShadow:"none",
                                  "&:hover":{ bgcolor:"#6D28D9", boxShadow:"none" },
                                  "&.Mui-disabled":{ opacity:0.35 } }}>
                                Initiate CAS
                              </Button>
                            </TD>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </Box>
              )}
            </Box>
          )}
        </Box>
      </SCard>

      {/* ══════════════════════════════════════════
          VERIFICATION DIALOG
      ══════════════════════════════════════════ */}
      <Dialog open={!!dialog} onClose={() => setDialog(null)}
        maxWidth="md" fullWidth
        PaperProps={{ sx:{ borderRadius:"16px", border:`1px solid ${T.border}` } }}>
        {dialog && (
          <>
            {/* Header */}
            <DialogTitle sx={{ fontFamily:fHead, fontWeight:700, fontSize:"1rem",
              color:T.text, borderBottom:`1px solid ${T.border}`, bgcolor:"#FAFBFD", pb:2 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box display="flex" alignItems="center" gap={1.5}>
                  <Box sx={{ width:4, height:24, borderRadius:2, bgcolor:T.accent }} />
                  <Box>
                    <Typography sx={{ fontFamily:fHead, fontWeight:700,
                      fontSize:"1rem", color:T.text }}>
                      Administrative Verification
                    </Typography>
                    <Typography sx={{ fontFamily:fBody, fontSize:"0.73rem", color:T.textMute }}>
                      {dialog.faculty} &nbsp;·&nbsp; {dialog.dept} &nbsp;·&nbsp;
                      <Typography component="span"
                        sx={{ fontFamily:fMono, fontSize:"0.73rem", color:T.accent }}>
                        Stage {dialog.stage}
                      </Typography>
                    </Typography>
                  </Box>
                </Box>
                <Box display="flex" alignItems="center" gap={1}>
                  <StatusPill status={dialog.status} />
                  <IconButton size="small" onClick={() => setDialog(null)}
                    sx={{ bgcolor:"#F1F5F9", borderRadius:"8px" }}>
                    <Close fontSize="small" />
                  </IconButton>
                </Box>
              </Box>
            </DialogTitle>

            <DialogContent sx={{ px:3, pt:3, pb:2 }}>
              <Stack spacing={3}>

                {/* Score summary strip */}
                <Grid container spacing={2}>
                  {[
                    { label:"Self Score",   value:dialog.selfScore,  color:T.textSub  },
                    { label:"HOD Score",    value:dialog.hodScore,   color:T.accent   },
                    { label:"Admin Score",  value:adminScore || "—", color:T.success  },
                    { label:"Service Yrs",  value:`${new Date().getFullYear() - new Date(dialog.joining).getFullYear()} yrs`, color:T.textSub },
                  ].map(c => (
                    <Grid item xs={6} md={3} key={c.label}>
                      <Box sx={{ p:1.8, borderRadius:"10px",
                        bgcolor:"#F9FAFB", border:`1px solid ${T.border}`,
                        textAlign:"center" }}>
                        <SLabel sx={{ mb:0.5 }}>{c.label}</SLabel>
                        <Typography sx={{ fontFamily:fMono, fontWeight:700,
                          fontSize:"1.3rem", color:c.color }}>{c.value}</Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>

                {/* HOD remarks */}
                <Box sx={{ p:2, borderRadius:"10px",
                  bgcolor:T.accentLight, border:`1px solid ${T.accent}25` }}>
                  <SLabel sx={{ mb:0.5 }}>HOD Remarks</SLabel>
                  <Typography sx={{ fontFamily:fBody, fontSize:"0.8rem",
                    color:T.textSub, fontStyle:"italic" }}>
                    "{dialog.hodRemarks}"
                  </Typography>
                </Box>

                <Grid container spacing={2.5}>

                  {/* LEFT — Document checklist */}
                  <Grid item xs={12} md={7}>
                    <Box display="flex" justifyContent="space-between"
                      alignItems="center" mb={1.5}>
                      <Typography sx={{ fontFamily:fHead, fontWeight:700,
                        fontSize:"0.88rem", color:T.text }}>
                        1 · Evidence Review
                      </Typography>
                      <Typography sx={{ fontFamily:fMono, fontSize:"0.72rem",
                        color: activeDocs.every(d=>d.verified) ? T.success : T.textMute }}>
                        {activeDocs.filter(d=>d.verified).length}/{activeDocs.length} verified
                      </Typography>
                    </Box>

                    {activeDocs.length === 0 ? (
                      <Box sx={{ p:3, borderRadius:"10px",
                        border:`1px dashed ${T.border}`, textAlign:"center" }}>
                        <Typography sx={{ fontFamily:fBody, fontSize:"0.78rem",
                          color:T.textMute }}>No documents submitted.</Typography>
                      </Box>
                    ) : (
                      <Stack spacing={0}>
                        {activeDocs.map((doc, i) => {
                          const cs = DOC_CAT_STYLE[doc.category] || { color:T.textMute, bg:"#F1F5F9" };
                          const isFirst = i === 0;
                          const isLast  = i === activeDocs.length - 1;
                          return (
                            <Box key={doc.id} sx={{
                              display:"flex", alignItems:"center",
                              justifyContent:"space-between",
                              px:2, py:1.5,
                              borderRadius: isFirst && isLast ? "9px"
                                : isFirst ? "9px 9px 0 0"
                                : isLast  ? "0 0 9px 9px" : "0",
                              border:`1px solid ${T.border}`,
                              borderTop: i > 0 ? "none" : `1px solid ${T.border}`,
                              bgcolor: doc.verified ? T.successLight : "transparent",
                              transition:"background 0.15s",
                            }}>
                              {/* Doc info */}
                              <Box display="flex" alignItems="center" gap={1.5}>
                                <Box sx={{ p:0.7, borderRadius:"7px",
                                  bgcolor:cs.bg, color:cs.color }}>
                                  <Description sx={{ fontSize:15 }} />
                                </Box>
                                <Box>
                                  <Typography sx={{ fontFamily:fBody, fontWeight:600,
                                    fontSize:"0.8rem",
                                    color: doc.verified ? T.success : T.text }}>
                                    {doc.name}
                                  </Typography>
                                  <Box sx={{ px:0.8, py:0.12, borderRadius:"4px",
                                    bgcolor:cs.bg, display:"inline-block", mt:0.3 }}>
                                    <Typography sx={{ fontFamily:fBody, fontSize:"0.62rem",
                                      fontWeight:700, color:cs.color }}>{doc.category}</Typography>
                                  </Box>
                                </Box>
                              </Box>

                              {/* Actions */}
                              <Box display="flex" alignItems="center">
                                <Tooltip title="View document">
                                  <IconButton size="small"
                                    sx={{ bgcolor:T.accentLight, color:T.accent,
                                      borderRadius:"7px", mr:0.5 }}
                                    onClick={() => toast(`Opening ${doc.name}…`)}>
                                    <Visibility sx={{ fontSize:14 }} />
                                  </IconButton>
                                </Tooltip>
                                <Checkbox
                                  checked={doc.verified}
                                  onChange={() => toggleDoc(doc.id)}
                                  icon={<RadioButtonUnchecked sx={{ fontSize:20, color:T.textMute }} />}
                                  checkedIcon={<CheckCircle sx={{ fontSize:20, color:T.success }} />}
                                />
                              </Box>
                            </Box>
                          );
                        })}
                      </Stack>
                    )}
                  </Grid>

                  {/* RIGHT — Score moderation */}
                  <Grid item xs={12} md={5}>
                    <Typography sx={{ fontFamily:fHead, fontWeight:700,
                      fontSize:"0.88rem", color:T.text, mb:1.5 }}>
                      2 · Score Moderation
                    </Typography>
                    <SCard sx={{ p:2.5 }}>
                      <Stack spacing={2.2}>

                        {/* Final score input */}
                        <Box>
                          <SLabel sx={{ mb:0.7 }}>Final API Score</SLabel>
                          <TextField
                            size="small" fullWidth type="number"
                            value={adminScore}
                            onChange={e => setAdminScore(e.target.value)}
                            helperText="Used directly in CAS promotion criteria."
                            FormHelperTextProps={{ sx:{ fontFamily:fBody,
                              fontSize:"0.67rem", color:T.textMute } }}
                            sx={{ "& .MuiOutlinedInput-root":{
                              borderRadius:"8px", fontFamily:fMono,
                              fontSize:"1.05rem", fontWeight:700,
                              "& fieldset":{ borderColor:`${T.accent}50` },
                              "&.Mui-focused fieldset":{ borderColor:T.accent } }}}
                          />
                        </Box>

                        {/* Mini bar comparison */}
                        {adminScore && (
                          <Box>
                            <SLabel sx={{ mb:0.8 }}>Score Comparison</SLabel>
                            {[
                              { label:"Self",  val:dialog.selfScore,    col:T.textMute },
                              { label:"HOD",   val:dialog.hodScore,     col:T.accent   },
                              { label:"Admin", val:parseInt(adminScore)||0, col:T.success },
                            ].map(b => (
                              <Box key={b.label} mb={1.1}>
                                <Box display="flex" justifyContent="space-between" mb={0.4}>
                                  <Typography sx={{ fontFamily:fBody,
                                    fontSize:"0.71rem", color:T.textMute }}>{b.label}</Typography>
                                  <Typography sx={{ fontFamily:fMono,
                                    fontSize:"0.71rem", fontWeight:700, color:b.col }}>{b.val}</Typography>
                                </Box>
                                <Box sx={{ height:5, borderRadius:99, bgcolor:T.border }}>
                                  <Box sx={{ height:"100%", borderRadius:99, bgcolor:b.col,
                                    width:`${Math.min((b.val/500)*100, 100)}%`,
                                    transition:"width .5s ease" }} />
                                </Box>
                              </Box>
                            ))}
                          </Box>
                        )}

                        <Divider sx={{ borderColor:T.border }} />

                        {/* Remarks */}
                        <Box>
                          <SLabel sx={{ mb:0.7 }}>Admin Remarks</SLabel>
                          <TextField
                            size="small" fullWidth multiline rows={3}
                            value={adminRemarks}
                            onChange={e => setAdminRemarks(e.target.value)}
                            placeholder="Reason for any score adjustment, observations…"
                            sx={{ "& .MuiOutlinedInput-root":{
                              borderRadius:"8px", fontFamily:fBody, fontSize:"0.82rem",
                              "& fieldset":{ borderColor:T.border },
                              "&.Mui-focused fieldset":{ borderColor:T.accent } }}}
                          />
                        </Box>
                      </Stack>
                    </SCard>
                  </Grid>
                </Grid>
              </Stack>
            </DialogContent>

            <DialogActions sx={{ px:3, pb:3, pt:2, bgcolor:"#FAFBFD",
              borderTop:`1px solid ${T.border}`, gap:1 }}>
              <Button onClick={() => setDialog(null)} variant="outlined"
                sx={{ fontFamily:fBody, fontWeight:600, fontSize:"0.8rem",
                  textTransform:"none", borderRadius:"8px",
                  borderColor:T.border, color:T.textSub }}>
                Cancel
              </Button>
              <Button variant="contained" onClick={handleFinalize}
                startIcon={<Verified sx={{fontSize:15}} />}
                sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.8rem",
                  textTransform:"none", borderRadius:"8px",
                  bgcolor:T.success, boxShadow:"none",
                  "&:hover":{ bgcolor:"#059669", boxShadow:"none" } }}>
                Finalise &amp; Verify
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* ══════════════════════════════════════════
          CAS INITIATION DIALOG
      ══════════════════════════════════════════ */}
      <Dialog open={!!casDialog} onClose={() => setCasDialog(null)}
        maxWidth="xs" fullWidth
        PaperProps={{ sx:{ borderRadius:"16px", border:`1px solid ${T.border}` } }}>
        {casDialog && (() => {
          const e = getEligibility(casDialog);
          return (
            <>
              <DialogTitle sx={{ fontFamily:fHead, fontWeight:700, fontSize:"1rem",
                color:T.text, borderBottom:`1px solid ${T.border}`,
                bgcolor:"#FAFBFD", pb:2 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography sx={{ fontFamily:fHead, fontWeight:700,
                    fontSize:"1rem", color:T.text }}>
                    Initiate CAS Promotion
                  </Typography>
                  <IconButton size="small" onClick={() => setCasDialog(null)}
                    sx={{ bgcolor:"#F1F5F9", borderRadius:"8px" }}>
                    <Close fontSize="small" />
                  </IconButton>
                </Box>
              </DialogTitle>

              <DialogContent sx={{ px:3, pt:3, pb:2 }}>
                <Stack spacing={2}>
                  {/* Faculty summary */}
                  <Box sx={{ p:2.5, borderRadius:"12px",
                    bgcolor:T.purpleLight, border:`1px solid ${T.purple}30`,
                    textAlign:"center" }}>
                    <Avatar sx={{ width:46, height:46, bgcolor:T.purple,
                      fontWeight:700, fontSize:"1rem", mx:"auto", mb:1 }}>
                      {casDialog.avatar}
                    </Avatar>
                    <Typography sx={{ fontFamily:fBody, fontWeight:700,
                      fontSize:"0.92rem", color:T.text }}>{casDialog.faculty}</Typography>
                    <Typography sx={{ fontFamily:fMono, fontSize:"0.73rem",
                      color:T.purple, mt:0.3 }}>
                      {casDialog.designation} → {e.nextStage}
                    </Typography>
                    <Typography sx={{ fontFamily:fMono, fontWeight:700,
                      fontSize:"1.3rem", color:T.success, mt:0.8 }}>
                      API Score: {e.score}
                    </Typography>
                  </Box>

                  {/* Criteria confirmed */}
                  <SCard sx={{ p:2 }}>
                    <SLabel sx={{ mb:1 }}>Promotion Criteria</SLabel>
                    {[
                      { ok:e.scoreOk, label:`API Score ≥ 300 — ${e.score} ✓` },
                      { ok:e.yrsOk,   label:`Service ≥ 5 years — ${e.yrs} yrs ✓` },
                      { ok:true,       label:"PBAS score independently verified"   },
                    ].map((c,i) => (
                      <Box key={i} display="flex" alignItems="center" gap={0.8}
                        sx={{ py:0.7, borderBottom:`1px solid ${T.border}`,
                          "&:last-child":{ borderBottom:"none" } }}>
                        <CheckCircle sx={{ fontSize:14, color:T.success }} />
                        <Typography sx={{ fontFamily:fBody, fontSize:"0.78rem",
                          color:T.textSub }}>{c.label}</Typography>
                      </Box>
                    ))}
                  </SCard>

                  <Alert severity="info"
                    sx={{ borderRadius:"9px", fontFamily:fBody, fontSize:"0.76rem" }}>
                    This will notify the Academic Promotion Committee and generate a formal CAS
                    dossier for review. The faculty member will receive a confirmation email.
                  </Alert>
                </Stack>
              </DialogContent>

              <DialogActions sx={{ px:3, pb:3, pt:2, bgcolor:"#FAFBFD",
                borderTop:`1px solid ${T.border}`, gap:1 }}>
                <Button onClick={() => setCasDialog(null)} variant="outlined"
                  sx={{ fontFamily:fBody, fontWeight:600, fontSize:"0.8rem",
                    textTransform:"none", borderRadius:"8px",
                    borderColor:T.border, color:T.textSub }}>
                  Cancel
                </Button>
                <Button variant="contained" onClick={handleInitiateCas}
                  startIcon={<Send sx={{fontSize:15}} />}
                  sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.8rem",
                    textTransform:"none", borderRadius:"8px",
                    bgcolor:T.purple, boxShadow:"none",
                    "&:hover":{ bgcolor:"#6D28D9", boxShadow:"none" } }}>
                  Initiate CAS Process
                </Button>
              </DialogActions>
            </>
          );
        })()}
      </Dialog>

      {/* ── Snackbar ── */}
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

export default PbasAdminView;