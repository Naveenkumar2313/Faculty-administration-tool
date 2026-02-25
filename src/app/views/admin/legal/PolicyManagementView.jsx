import React, { useState, useMemo } from "react";
import {
  Box, Grid, Typography, Button, Table, TableBody, TableCell,
  TableHead, TableRow, IconButton, Tooltip, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, MenuItem, Switch,
  InputAdornment, Divider, Stack, Snackbar, Alert, Avatar,
  Accordion, AccordionSummary, AccordionDetails, Tabs, Tab
} from "@mui/material";
import {
  Add, Edit, CloudUpload, OndemandVideo, Quiz,
  NotificationsActive, History, ExpandMore, Difference,
  CheckCircle, Close, Search, FileDownload, Refresh,
  Description, Security, Science, People, Gavel,
  Article, Warning, Delete, ArrowForward,
  RadioButtonChecked, RadioButtonUnchecked, Info
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
    @keyframes fadeUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:none} }
    @keyframes pulse  { 0%,100%{opacity:1} 50%{opacity:.4} }
    @keyframes shimmer{ 0%{background-position:200%} 100%{background-position:-200%} }
    .fu  { animation: fadeUp 0.32s ease both; }
    .fu1 { animation: fadeUp 0.32s .06s ease both; }
    .fu2 { animation: fadeUp 0.32s .12s ease both; }
    .fu3 { animation: fadeUp 0.32s .18s ease both; }
    .row-h:hover { background:#F9FAFB !important; transition:background .15s; }
    .card-h { transition:box-shadow .18s,transform .18s; cursor:pointer; }
    .card-h:hover { box-shadow:0 6px 24px rgba(99,102,241,.12); transform:translateY(-2px); }
    .blink { animation: pulse 2s infinite; }
  `}</style>
);

/* ─────────────────────────────────────────
   MOCK DATA
───────────────────────────────────────── */
const POLICIES_INIT = [
  {
    id:1, title:"Code of Ethics", category:"Ethics",
    version:"1.2", date:"2025-01-10", compliance:94,
    status:"Active", quiz:true, video:false, deadline:30,
    videoUrl:"", description:"Defines expected ethical conduct for all faculty members.",
    history:[
      { version:"1.2", date:"2025-01-10", note:"Updated conflict of interest section." },
      { version:"1.1", date:"2024-07-01", note:"Minor clarifications added." },
      { version:"1.0", date:"2023-06-15", note:"Initial publication." },
    ],
  },
  {
    id:2, title:"IT Security Guidelines", category:"IT",
    version:"2.0", date:"2026-02-01", compliance:45,
    status:"Pending", quiz:true, video:true, deadline:14,
    videoUrl:"https://youtu.be/example1", description:"Mandatory cybersecurity awareness for all staff.",
    history:[
      { version:"2.0", date:"2026-02-01", note:"Major revision — added AI usage policy." },
      { version:"1.0", date:"2024-09-15", note:"Initial release." },
    ],
  },
  {
    id:3, title:"Research Integrity Policy", category:"Research",
    version:"1.0", date:"2024-11-20", compliance:100,
    status:"Active", quiz:false, video:true, deadline:45,
    videoUrl:"https://youtu.be/example2", description:"Guidelines for ethical research and publication practices.",
    history:[
      { version:"1.0", date:"2024-11-20", note:"Initial publication." },
    ],
  },
  {
    id:4, title:"Anti-Harassment Policy", category:"HR",
    version:"3.1", date:"2025-06-01", compliance:78,
    status:"Active", quiz:true, video:false, deadline:21,
    videoUrl:"", description:"Zero-tolerance policy on workplace harassment and discrimination.",
    history:[
      { version:"3.1", date:"2025-06-01", note:"Updated in line with UGC directives." },
      { version:"3.0", date:"2024-01-01", note:"Expanded definitions." },
    ],
  },
  {
    id:5, title:"Leave & Attendance Rules", category:"HR",
    version:"2.2", date:"2025-03-15", compliance:62,
    status:"Active", quiz:false, video:false, deadline:60,
    videoUrl:"", description:"Complete leave entitlement and attendance rules for teaching staff.",
    history:[
      { version:"2.2", date:"2025-03-15", note:"EL carry-forward rules revised." },
    ],
  },
];

const CATEGORIES = ["Ethics","IT","Research","HR","Legal","Finance"];

const CAT_META = {
  Ethics:   { color:T.purple,  bg:T.purpleLight,  Icon:Gavel        },
  IT:       { color:T.accent,  bg:T.accentLight,  Icon:Security     },
  Research: { color:T.success, bg:T.successLight, Icon:Science      },
  HR:       { color:T.warning, bg:T.warningLight, Icon:People       },
  Legal:    { color:T.danger,  bg:T.dangerLight,  Icon:Article      },
  Finance:  { color:T.gold,    bg:T.goldLight,    Icon:Description  },
};

const STATUS_META = {
  Active:   { color:T.success, bg:T.successLight },
  Pending:  { color:T.warning, bg:T.warningLight },
  Archived: { color:T.textMute, bg:"#F1F5F9"    },
};

const BLANK_POLICY = {
  title:"", category:"", version:"1.0", deadline:30,
  hasQuiz:false, hasVideo:false, videoUrl:"",
  description:"", file:null,
};

const BLANK_QUIZ_Q = { q:"", options:["",""], correct:0 };

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
    "& .MuiOutlinedInput-root":{ borderRadius:"9px", fontFamily:fBody, fontSize:"0.83rem",
      bgcolor:T.surface,
      "& fieldset":{ borderColor:T.border },
      "&.Mui-focused fieldset":{ borderColor:T.accent } },
    "& .MuiInputLabel-root.Mui-focused":{ color:T.accent },
    ...sx
  }} />
);

const StatusPill = ({ status }) => {
  const s = STATUS_META[status] || { color:T.textMute, bg:"#F1F5F9" };
  return (
    <Box display="flex" alignItems="center" gap={0.6}
      sx={{ px:1.2, py:0.38, borderRadius:"99px", bgcolor:s.bg, width:"fit-content" }}>
      <Box sx={{ width:6, height:6, borderRadius:"50%", bgcolor:s.color,
        ...(status==="Active" ? { animation:"pulse 2s infinite" } : {}) }} />
      <Typography sx={{ fontFamily:fBody, fontSize:"0.71rem", fontWeight:700, color:s.color }}>
        {status}
      </Typography>
    </Box>
  );
};

const ComplianceBar = ({ pct }) => {
  const color = pct >= 90 ? T.success : pct >= 60 ? T.warning : T.danger;
  return (
    <Box>
      <Box display="flex" justifyContent="space-between" mb={0.4}>
        <Typography sx={{ fontFamily:fMono, fontWeight:700, fontSize:"0.74rem", color }}>
          {pct}%
          {pct === 100 && <CheckCircle sx={{ fontSize:11, ml:0.4, verticalAlign:"middle", color:T.success }} />}
        </Typography>
      </Box>
      <Box sx={{ height:5, borderRadius:99, bgcolor:T.border, width:80, overflow:"hidden" }}>
        <Box sx={{ height:"100%", width:`${pct}%`, borderRadius:99,
          bgcolor:color, transition:"width 1.2s ease" }} />
      </Box>
    </Box>
  );
};

/* ═════════════════════════════════════════════
   MAIN COMPONENT
═════════════════════════════════════════════ */
const PolicyManagementView = () => {
  const [policies,      setPolicies]      = useState(POLICIES_INIT);
  const [openDialog,    setOpenDialog]    = useState(false);
  const [isUpdateMode,  setIsUpdateMode]  = useState(false);
  const [historyOpen,   setHistoryOpen]   = useState(false);
  const [historyPolicy, setHistoryPolicy] = useState(null);
  const [current,       setCurrent]       = useState(BLANK_POLICY);
  const [quizQs,        setQuizQs]        = useState([]);
  const [dialogTab,     setDialogTab]     = useState(0);
  const [uploadedFile,  setUploadedFile]  = useState(null);
  const [search,        setSearch]        = useState("");
  const [filterCat,     setFilterCat]     = useState("All");
  const [filterStatus,  setFilterStatus]  = useState("All");
  const [snack,         setSnack]         = useState({ open:false, msg:"", severity:"success" });

  const toast = (msg, severity="success") => setSnack({ open:true, msg, severity });
  const setField = (k, v) => setCurrent(p => ({ ...p, [k]:v }));

  /* ── Open Add ── */
  const handleOpenAdd = () => {
    setIsUpdateMode(false);
    setCurrent(BLANK_POLICY);
    setQuizQs([{ ...BLANK_QUIZ_Q }]);
    setUploadedFile(null);
    setDialogTab(0);
    setOpenDialog(true);
  };

  /* ── Open Update ── */
  const handleOpenUpdate = (policy) => {
    setIsUpdateMode(true);
    const nv = (parseFloat(policy.version) + 0.1).toFixed(1);
    setCurrent({ ...policy, version:nv, file:null });
    setQuizQs([{ ...BLANK_QUIZ_Q }]);
    setUploadedFile(null);
    setDialogTab(0);
    setOpenDialog(true);
  };

  /* ── Save ── */
  const handleSave = () => {
    if (!current.title.trim() || !current.category) {
      toast("Policy title and category are required.", "error"); return;
    }
    const today = new Date().toISOString().split("T")[0];
    if (isUpdateMode) {
      const histEntry = { version:current.version, date:today, note:"Updated by admin." };
      setPolicies(p => p.map(pol =>
        pol.id === current.id
          ? { ...current, status:"Pending", compliance:0, date:today,
              history:[histEntry, ...(pol.history || [])] }
          : pol
      ));
      toast(`Policy "${current.title}" updated to v${current.version}. Notifications sent.`);
    } else {
      const newPol = {
        id:Date.now(), ...current, status:"Pending",
        compliance:0, date:today, quiz:current.hasQuiz,
        video:current.hasVideo, version:current.version,
        history:[{ version:current.version, date:today, note:"Initial publication." }],
      };
      setPolicies(p => [newPol, ...p]);
      toast(`Policy "${current.title}" created and published.`);
    }
    setOpenDialog(false);
  };

  /* ── Quiz question helpers ── */
  const addQuestion = () =>
    setQuizQs(p => [...p, { q:"", options:["",""], correct:0 }]);
  const removeQuestion = (i) =>
    setQuizQs(p => p.filter((_,idx) => idx !== i));
  const updateQ = (i, key, val) =>
    setQuizQs(p => p.map((q,idx) => idx===i ? { ...q, [key]:val } : q));
  const updateOption = (qi, oi, val) =>
    setQuizQs(p => p.map((q,idx) => idx===qi
      ? { ...q, options:q.options.map((o,oidx) => oidx===oi ? val : o) }
      : q
    ));
  const addOption = (qi) =>
    setQuizQs(p => p.map((q,idx) => idx===qi
      ? { ...q, options:[...q.options, ""] } : q));

  /* ── Filtered list ── */
  const filtered = useMemo(() => policies.filter(p => {
    const q = search.toLowerCase();
    if (q && !p.title.toLowerCase().includes(q) && !p.category.toLowerCase().includes(q)) return false;
    if (filterCat    !== "All" && p.category !== filterCat)    return false;
    if (filterStatus !== "All" && p.status   !== filterStatus) return false;
    return true;
  }), [policies, search, filterCat, filterStatus]);

  const hasFilter = search || filterCat !== "All" || filterStatus !== "All";

  /* ── Stats ── */
  const totalActive  = policies.filter(p => p.status === "Active").length;
  const avgCompliance = Math.round(policies.reduce((s,p) => s+p.compliance,0) / policies.length);
  const pendingCount = policies.filter(p => p.status === "Pending").length;
  const fullComp     = policies.filter(p => p.compliance === 100).length;

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
            Policy Management
          </Typography>
          <Typography sx={{ fontFamily:fBody, fontSize:"0.82rem", color:T.textSub, mt:0.3 }}>
            Create, publish, revise and track institutional policy compliance.
          </Typography>
        </Box>
        <Box display="flex" gap={1.5} pt={0.5} flexWrap="wrap">
          <Button size="small" variant="outlined"
            startIcon={<FileDownload sx={{fontSize:15}} />}
            onClick={() => toast("Policy compliance report exported.")}
            sx={{ fontFamily:fBody, fontWeight:600, fontSize:"0.76rem", textTransform:"none",
              borderRadius:"8px", borderColor:T.border, color:T.textSub,
              "&:hover":{ borderColor:T.accent, color:T.accent } }}>
            Export Report
          </Button>
          <Button size="small" variant="contained"
            startIcon={<Add sx={{fontSize:15}} />}
            onClick={handleOpenAdd}
            sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.76rem", textTransform:"none",
              borderRadius:"8px", bgcolor:T.accent, boxShadow:"none",
              "&:hover":{ bgcolor:"#4F46E5", boxShadow:"none" } }}>
            Add New Policy
          </Button>
        </Box>
      </Box>

      {/* ── Stat Strip ── */}
      <Grid container spacing={2} mb={3}>
        {[
          { label:"Total Policies",       value:policies.length,  sub:"Across all categories",   color:T.accent,  Icon:Article       },
          { label:"Active Policies",      value:totalActive,      sub:"Currently enforced",       color:T.success, Icon:CheckCircle   },
          { label:"Avg. Compliance",      value:`${avgCompliance}%`, sub:"Faculty acknowledgement",color:T.purple,  Icon:People        },
          { label:"Pending Acknowledgement", value:pendingCount,  sub:"Awaiting faculty action",  color:T.warning, Icon:Warning       },
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
          bgcolor:"#FAFBFD", display:"flex", gap:1.5, flexWrap:"wrap", alignItems:"center" }}>
          <TextField size="small" placeholder="Search policies…"
            value={search} onChange={e => setSearch(e.target.value)}
            InputProps={{ startAdornment:
              <InputAdornment position="start">
                <Search sx={{ fontSize:16, color:T.textMute }} />
              </InputAdornment>
            }}
            sx={{ flex:"1 1 200px",
              "& .MuiOutlinedInput-root":{ borderRadius:"8px",
                fontFamily:fBody, fontSize:"0.8rem", bgcolor:T.surface,
                "& fieldset":{ borderColor:T.border },
                "&.Mui-focused fieldset":{ borderColor:T.accent } }}}
          />

          {/* Category pills */}
          <Box display="flex" gap={0.7} flexWrap="wrap">
            {["All","Ethics","IT","Research","HR","Legal"].map(c => {
              const meta = CAT_META[c];
              const active = filterCat === c;
              return (
                <Box key={c} onClick={() => setFilterCat(c)}
                  sx={{ px:1.3, py:0.4, borderRadius:"99px", cursor:"pointer",
                    fontFamily:fBody, fontSize:"0.71rem", fontWeight:700,
                    border:`1.5px solid ${active ? (meta?.color||T.accent) : T.border}`,
                    bgcolor: active ? (meta?.bg||T.accentLight) : "transparent",
                    color:   active ? (meta?.color||T.accent) : T.textMute,
                    transition:"all .13s" }}>
                  {c}
                </Box>
              );
            })}
          </Box>

          {/* Status filter */}
          <Box display="flex" gap={0.7}>
            {["All","Active","Pending","Archived"].map(s => (
              <Box key={s} onClick={() => setFilterStatus(s)}
                sx={{ px:1.3, py:0.4, borderRadius:"99px", cursor:"pointer",
                  fontFamily:fBody, fontSize:"0.71rem", fontWeight:700,
                  border:`1.5px solid ${filterStatus===s ? T.accent : T.border}`,
                  bgcolor: filterStatus===s ? T.accentLight : "transparent",
                  color:   filterStatus===s ? T.accent      : T.textMute,
                  transition:"all .13s" }}>
                {s}
              </Box>
            ))}
          </Box>

          {hasFilter && (
            <Tooltip title="Reset filters">
              <IconButton size="small"
                onClick={() => { setSearch(""); setFilterCat("All"); setFilterStatus("All"); }}
                sx={{ borderRadius:"8px", border:`1px solid ${T.border}`,
                  "&:hover":{ bgcolor:T.dangerLight, color:T.danger } }}>
                <Refresh sx={{ fontSize:16 }} />
              </IconButton>
            </Tooltip>
          )}
        </Box>

        {/* Table */}
        <Box sx={{ overflowX:"auto" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TH>Policy</TH>
                <TH>Category</TH>
                <TH>Version</TH>
                <TH>Last Updated</TH>
                <TH>Requirements</TH>
                <TH>Compliance</TH>
                <TH>Deadline</TH>
                <TH>Status</TH>
                <TH align="center">Actions</TH>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map(row => {
                const cat = CAT_META[row.category] || { color:T.textMute, bg:"#F1F5F9", Icon:Article };
                return (
                  <TableRow key={row.id} className="row-h">

                    {/* Policy name */}
                    <TD sx={{ minWidth:200 }}>
                      <Box display="flex" alignItems="center" gap={1.3}>
                        <Box sx={{ p:0.8, borderRadius:"8px",
                          bgcolor:cat.bg, color:cat.color, flexShrink:0 }}>
                          <cat.Icon sx={{ fontSize:15 }} />
                        </Box>
                        <Box>
                          <Typography sx={{ fontFamily:fBody, fontWeight:700,
                            fontSize:"0.83rem", color:T.text }}>{row.title}</Typography>
                          <Typography sx={{ fontFamily:fBody, fontSize:"0.68rem",
                            color:T.textMute, mt:0.1,
                            overflow:"hidden", textOverflow:"ellipsis",
                            whiteSpace:"nowrap", maxWidth:180 }}>
                            {row.description}
                          </Typography>
                        </Box>
                      </Box>
                    </TD>

                    {/* Category */}
                    <TD>
                      <Box sx={{ px:1, py:0.28, borderRadius:"6px",
                        bgcolor:cat.bg, display:"inline-block" }}>
                        <Typography sx={{ fontFamily:fBody, fontSize:"0.69rem",
                          fontWeight:700, color:cat.color }}>{row.category}</Typography>
                      </Box>
                    </TD>

                    {/* Version */}
                    <TD>
                      <Box sx={{ px:0.9, py:0.22, borderRadius:"6px",
                        bgcolor:T.accentLight, display:"inline-block" }}>
                        <Typography sx={{ fontFamily:fMono, fontSize:"0.72rem",
                          fontWeight:700, color:T.accent }}>v{row.version}</Typography>
                      </Box>
                    </TD>

                    {/* Date */}
                    <TD>
                      <Typography sx={{ fontFamily:fMono, fontSize:"0.74rem" }}>
                        {row.date}
                      </Typography>
                    </TD>

                    {/* Requirements */}
                    <TD>
                      <Box display="flex" gap={0.8} flexWrap="wrap">
                        {row.quiz && (
                          <Box display="flex" alignItems="center" gap={0.4}
                            sx={{ px:0.9, py:0.22, borderRadius:"6px",
                              bgcolor:T.purpleLight }}>
                            <Quiz sx={{ fontSize:11, color:T.purple }} />
                            <Typography sx={{ fontFamily:fBody, fontSize:"0.65rem",
                              fontWeight:700, color:T.purple }}>Quiz</Typography>
                          </Box>
                        )}
                        {row.video && (
                          <Box display="flex" alignItems="center" gap={0.4}
                            sx={{ px:0.9, py:0.22, borderRadius:"6px",
                              bgcolor:T.accentLight }}>
                            <OndemandVideo sx={{ fontSize:11, color:T.accent }} />
                            <Typography sx={{ fontFamily:fBody, fontSize:"0.65rem",
                              fontWeight:700, color:T.accent }}>Video</Typography>
                          </Box>
                        )}
                        {!row.quiz && !row.video && (
                          <Typography sx={{ fontFamily:fBody, fontSize:"0.69rem",
                            color:T.textMute }}>Read Only</Typography>
                        )}
                      </Box>
                    </TD>

                    {/* Compliance */}
                    <TD><ComplianceBar pct={row.compliance} /></TD>

                    {/* Deadline */}
                    <TD>
                      <Typography sx={{ fontFamily:fMono, fontSize:"0.74rem", color:T.textSub }}>
                        {row.deadline}d
                      </Typography>
                    </TD>

                    {/* Status */}
                    <TD><StatusPill status={row.status} /></TD>

                    {/* Actions */}
                    <TD align="center">
                      <Box display="flex" gap={0.5} justifyContent="center">
                        <Tooltip title="Update / Revise">
                          <IconButton size="small"
                            onClick={() => handleOpenUpdate(row)}
                            sx={{ borderRadius:"7px", bgcolor:T.accentLight,
                              color:T.accent, width:28, height:28,
                              "&:hover":{ bgcolor:T.accent, color:"#fff" } }}>
                            <Edit sx={{ fontSize:14 }} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Version History">
                          <IconButton size="small"
                            onClick={() => { setHistoryPolicy(row); setHistoryOpen(true); }}
                            sx={{ borderRadius:"7px", bgcolor:"#F1F5F9",
                              color:T.textSub, width:28, height:28,
                              "&:hover":{ bgcolor:T.purpleLight, color:T.purple } }}>
                            <History sx={{ fontSize:14 }} />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TD>
                  </TableRow>
                );
              })}

              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} sx={{ textAlign:"center", py:7 }}>
                    <Article sx={{ fontSize:40, color:T.border, display:"block", mx:"auto", mb:1.5 }} />
                    <Typography sx={{ fontFamily:fBody, color:T.textMute }}>
                      No policies match your filters.
                    </Typography>
                    {hasFilter && (
                      <Button size="small" onClick={() => { setSearch(""); setFilterCat("All"); setFilterStatus("All"); }}
                        sx={{ mt:1.5, fontFamily:fBody, fontSize:"0.76rem",
                          textTransform:"none", color:T.accent }}>
                        Clear all filters
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Box>

        {/* Footer */}
        <Box sx={{ px:2.5, py:1.8, borderTop:`1px solid ${T.border}`,
          bgcolor:"#FAFBFD", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <Typography sx={{ fontFamily:fBody, fontSize:"0.74rem", color:T.textMute }}>
            Showing <Box component="span" sx={{ fontFamily:fMono, fontWeight:700,
              color:T.accent }}>{filtered.length}</Box> of {policies.length} policies
          </Typography>
          <Box display="flex" alignItems="center" gap={1}>
            <Box sx={{ width:8, height:8, borderRadius:"50%", bgcolor:T.success }} className="blink" />
            <Typography sx={{ fontFamily:fBody, fontSize:"0.72rem", color:T.textMute }}>
              {fullComp} polic{fullComp===1?"y":"ies"} at 100% compliance
            </Typography>
          </Box>
        </Box>
      </SCard>

      {/* ══════════════════════════════════════
          ADD / UPDATE DIALOG
      ══════════════════════════════════════ */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}
        maxWidth="md" fullWidth
        PaperProps={{ sx:{ borderRadius:"16px", border:`1px solid ${T.border}`, maxHeight:"92vh" } }}>

        <DialogTitle sx={{ borderBottom:`1px solid ${T.border}`, bgcolor:"#FAFBFD", pb:0 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" pb={1.5}>
            <Box display="flex" alignItems="center" gap={1.5}>
              <Box sx={{ width:4, height:28, borderRadius:2, bgcolor:T.accent }} />
              <Box>
                <Typography sx={{ fontFamily:fHead, fontWeight:700,
                  fontSize:"1rem", color:T.text }}>
                  {isUpdateMode ? `Revise Policy — ${current.title}` : "Create New Policy"}
                </Typography>
                <Typography sx={{ fontFamily:fBody, fontSize:"0.72rem", color:T.textMute }}>
                  {isUpdateMode
                    ? `Auto-incremented to v${current.version}`
                    : "Fill in all required fields to publish."}
                </Typography>
              </Box>
            </Box>
            <IconButton size="small" onClick={() => setOpenDialog(false)}
              sx={{ bgcolor:"#F1F5F9", borderRadius:"8px" }}>
              <Close fontSize="small" />
            </IconButton>
          </Box>

          {/* Dialog tab bar */}
          <Tabs value={dialogTab} onChange={(_,v) => setDialogTab(v)} sx={{
            "& .MuiTabs-indicator":{ bgcolor:T.accent, height:"2px" },
            "& .MuiTab-root":{ fontFamily:fBody, fontWeight:600, fontSize:"0.75rem",
              textTransform:"none", color:T.textMute, minHeight:42, py:0,
              "&.Mui-selected":{ color:T.accent } }
          }}>
            <Tab label="1. Basic Information" />
            <Tab label="2. Compliance Settings" />
            <Tab label={`3. Quiz Builder${current.hasQuiz ? ` (${quizQs.length}Q)` : ""}`} disabled={!current.hasQuiz} />
          </Tabs>
        </DialogTitle>

        <DialogContent sx={{ px:3, pt:3, pb:2 }}>

          {/* ─────────────────────────────────────
              DIALOG TAB 0 — BASIC INFO
          ───────────────────────────────────── */}
          {dialogTab === 0 && (
            <Grid container spacing={2.5}>
              <Grid item xs={12}>
                <SLabel sx={{ mb:0.7 }}>Policy Title *</SLabel>
                <DInput value={current.title}
                  onChange={e => setField("title", e.target.value)}
                  placeholder="e.g. Code of Ethics Policy 2026"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <SLabel sx={{ mb:0.7 }}>Category *</SLabel>
                <DInput select value={current.category}
                  onChange={e => setField("category", e.target.value)}>
                  <MenuItem value="" sx={{ fontFamily:fBody, fontSize:"0.82rem", color:T.textMute }}>
                    — Select category —
                  </MenuItem>
                  {CATEGORIES.map(c => (
                    <MenuItem key={c} value={c} sx={{ fontFamily:fBody, fontSize:"0.82rem" }}>{c}</MenuItem>
                  ))}
                </DInput>
              </Grid>

              <Grid item xs={12} sm={6}>
                <SLabel sx={{ mb:0.7 }}>Version</SLabel>
                <DInput value={current.version} disabled
                  sx={{ "& .MuiOutlinedInput-root":{ bgcolor:"#F9FAFB" } }}
                />
              </Grid>

              <Grid item xs={12}>
                <SLabel sx={{ mb:0.7 }}>Description</SLabel>
                <DInput multiline rows={2} value={current.description}
                  onChange={e => setField("description", e.target.value)}
                  placeholder="Brief summary of what this policy covers…"
                />
              </Grid>

              {/* Upload zone */}
              <Grid item xs={12}>
                <SLabel sx={{ mb:0.7 }}>Policy Document (PDF) *</SLabel>
                <Box sx={{ p:2.5, borderRadius:"10px", textAlign:"center",
                  border:`2px dashed ${uploadedFile ? T.success : T.border}`,
                  bgcolor: uploadedFile ? T.successLight : "#FAFBFD",
                  transition:"all .15s", cursor:"pointer" }}
                  onClick={() => document.getElementById("pol-upload").click()}>
                  <input id="pol-upload" type="file" accept="application/pdf"
                    style={{ display:"none" }}
                    onChange={e => {
                      if (e.target.files[0]) {
                        setUploadedFile(e.target.files[0].name);
                        toast("Document uploaded.");
                      }
                    }} />
                  {uploadedFile ? (
                    <Box display="flex" justifyContent="center" alignItems="center" gap={1}>
                      <CheckCircle sx={{ fontSize:20, color:T.success }} />
                      <Typography sx={{ fontFamily:fBody, fontWeight:700,
                        fontSize:"0.82rem", color:T.success }}>{uploadedFile}</Typography>
                    </Box>
                  ) : (
                    <Box>
                      <CloudUpload sx={{ fontSize:28, color:T.textMute, mb:0.5 }} />
                      <Typography sx={{ fontFamily:fBody, fontSize:"0.78rem", color:T.textMute }}>
                        Click to upload signed PDF document
                      </Typography>
                    </Box>
                  )}
                </Box>

                {isUpdateMode && (
                  <Button size="small" startIcon={<Difference sx={{fontSize:13}} />}
                    onClick={() => toast("Diff view opened — comparing with previous version.")}
                    sx={{ mt:1, fontFamily:fBody, fontWeight:600, fontSize:"0.73rem",
                      textTransform:"none", color:T.purple,
                      "&:hover":{ bgcolor:T.purpleLight } }}>
                    Compare with Previous Version
                  </Button>
                )}
              </Grid>
            </Grid>
          )}

          {/* ─────────────────────────────────────
              DIALOG TAB 1 — COMPLIANCE SETTINGS
          ───────────────────────────────────── */}
          {dialogTab === 1 && (
            <Grid container spacing={2.5}>
              <Grid item xs={12} sm={6}>
                <SLabel sx={{ mb:0.7 }}>Compliance Deadline (Days) *</SLabel>
                <DInput type="number" value={current.deadline}
                  onChange={e => setField("deadline", +e.target.value)}
                  InputProps={{ inputProps:{ min:1, max:365 },
                    endAdornment:
                      <InputAdornment position="end">
                        <Typography sx={{ fontFamily:fBody, fontSize:"0.76rem", color:T.textMute }}>
                          days
                        </Typography>
                      </InputAdornment>
                  }}
                />
                <Typography sx={{ fontFamily:fBody, fontSize:"0.69rem", color:T.textMute, mt:0.5 }}>
                  Faculty must acknowledge within {current.deadline} day{current.deadline!==1?"s":""} of publication.
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Divider sx={{ borderColor:T.border, mb:2 }} />
              </Grid>

              {/* Video toggle */}
              <Grid item xs={12}>
                <Box sx={{ p:2, borderRadius:"10px",
                  border:`1.5px solid ${current.hasVideo ? T.accent : T.border}`,
                  bgcolor: current.hasVideo ? T.accentLight : "#FAFBFD",
                  transition:"all .15s" }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Box display="flex" alignItems="center" gap={1}>
                      <Box sx={{ p:0.7, borderRadius:"7px",
                        bgcolor: current.hasVideo ? T.accent : T.border,
                        color:"#fff" }}>
                        <OndemandVideo sx={{ fontSize:15 }} />
                      </Box>
                      <Box>
                        <Typography sx={{ fontFamily:fBody, fontWeight:700,
                          fontSize:"0.82rem", color:T.text }}>Require Training Video</Typography>
                        <Typography sx={{ fontFamily:fBody, fontSize:"0.7rem", color:T.textMute }}>
                          Faculty must watch a video before acknowledging.
                        </Typography>
                      </Box>
                    </Box>
                    <Switch checked={current.hasVideo}
                      onChange={e => setField("hasVideo", e.target.checked)}
                      sx={{ "& .MuiSwitch-switchBase.Mui-checked":{ color:T.accent },
                        "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":{ bgcolor:T.accent } }} />
                  </Box>
                  {current.hasVideo && (
                    <Box mt={1.5}>
                      <DInput placeholder="Paste YouTube / Vimeo URL…"
                        value={current.videoUrl}
                        onChange={e => setField("videoUrl", e.target.value)}
                        InputProps={{ startAdornment:
                          <InputAdornment position="start">
                            <OndemandVideo sx={{ fontSize:15, color:T.accent }} />
                          </InputAdornment>
                        }}
                      />
                    </Box>
                  )}
                </Box>
              </Grid>

              {/* Quiz toggle */}
              <Grid item xs={12}>
                <Box sx={{ p:2, borderRadius:"10px",
                  border:`1.5px solid ${current.hasQuiz ? T.purple : T.border}`,
                  bgcolor: current.hasQuiz ? T.purpleLight : "#FAFBFD",
                  transition:"all .15s" }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Box display="flex" alignItems="center" gap={1}>
                      <Box sx={{ p:0.7, borderRadius:"7px",
                        bgcolor: current.hasQuiz ? T.purple : T.border,
                        color:"#fff" }}>
                        <Quiz sx={{ fontSize:15 }} />
                      </Box>
                      <Box>
                        <Typography sx={{ fontFamily:fBody, fontWeight:700,
                          fontSize:"0.82rem", color:T.text }}>Require Assessment Quiz</Typography>
                        <Typography sx={{ fontFamily:fBody, fontSize:"0.7rem", color:T.textMute }}>
                          Faculty must pass a quiz to complete acknowledgement.
                        </Typography>
                      </Box>
                    </Box>
                    <Switch checked={current.hasQuiz}
                      onChange={e => {
                        setField("hasQuiz", e.target.checked);
                        if (e.target.checked) setDialogTab(2);
                      }}
                      sx={{ "& .MuiSwitch-switchBase.Mui-checked":{ color:T.purple },
                        "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":{ bgcolor:T.purple } }} />
                  </Box>
                  {current.hasQuiz && (
                    <Button size="small" onClick={() => setDialogTab(2)}
                      endIcon={<ArrowForward sx={{fontSize:12}} />}
                      sx={{ mt:1.2, fontFamily:fBody, fontWeight:700, fontSize:"0.73rem",
                        textTransform:"none", color:T.purple,
                        "&:hover":{ bgcolor:`${T.purple}15` } }}>
                      Go to Quiz Builder ({quizQs.length} question{quizQs.length!==1?"s":""})
                    </Button>
                  )}
                </Box>
              </Grid>

              {/* Update warning */}
              {isUpdateMode && (
                <Grid item xs={12}>
                  <Box sx={{ p:2, borderRadius:"10px",
                    bgcolor:T.warningLight, border:`1.5px solid ${T.warning}35`,
                    display:"flex", gap:1.2, alignItems:"flex-start" }}>
                    <Box sx={{ p:0.65, borderRadius:"7px",
                      bgcolor:`${T.warning}20`, color:T.warning, flexShrink:0 }}>
                      <NotificationsActive sx={{ fontSize:16 }} />
                    </Box>
                    <Box>
                      <Typography sx={{ fontFamily:fBody, fontWeight:700,
                        fontSize:"0.82rem", color:T.warning, mb:0.3 }}>
                        Compliance Will Reset on Publish
                      </Typography>
                      <Typography sx={{ fontFamily:fBody, fontSize:"0.76rem",
                        color:T.textSub, lineHeight:1.65 }}>
                        Publishing this revision will reset the compliance status for all faculty to
                        <Box component="span" sx={{ fontWeight:700, color:T.warning }}> 0%</Box>.
                        An automated email notification will be sent to all faculty immediately.
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              )}
            </Grid>
          )}

          {/* ─────────────────────────────────────
              DIALOG TAB 2 — QUIZ BUILDER
          ───────────────────────────────────── */}
          {dialogTab === 2 && (
            <Box>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Box display="flex" alignItems="center" gap={1}>
                  <Box sx={{ p:0.75, borderRadius:"8px",
                    bgcolor:T.purpleLight, color:T.purple }}>
                    <Quiz sx={{ fontSize:15 }} />
                  </Box>
                  <Box>
                    <Typography sx={{ fontFamily:fHead, fontWeight:700,
                      fontSize:"0.88rem", color:T.text }}>Quiz Builder</Typography>
                    <Typography sx={{ fontFamily:fBody, fontSize:"0.7rem", color:T.textMute }}>
                      {quizQs.length} question{quizQs.length!==1?"s":""} · Faculty must pass to acknowledge
                    </Typography>
                  </Box>
                </Box>
                <Button size="small" variant="outlined"
                  startIcon={<Add sx={{fontSize:14}} />}
                  onClick={addQuestion}
                  sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.74rem",
                    textTransform:"none", borderRadius:"8px",
                    borderColor:T.purple, color:T.purple,
                    "&:hover":{ bgcolor:T.purpleLight } }}>
                  Add Question
                </Button>
              </Box>

              <Stack spacing={2.5}>
                {quizQs.map((q, qi) => (
                  <Box key={qi} sx={{ p:2.2, borderRadius:"12px",
                    border:`1.5px solid ${T.border}`,
                    bgcolor:"#FAFBFD" }}>
                    {/* Question header */}
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={1.5}>
                      <Box sx={{ px:1, py:0.3, borderRadius:"7px", bgcolor:T.purpleLight }}>
                        <Typography sx={{ fontFamily:fMono, fontSize:"0.7rem",
                          fontWeight:700, color:T.purple }}>
                          Q{qi+1}
                        </Typography>
                      </Box>
                      {quizQs.length > 1 && (
                        <IconButton size="small" onClick={() => removeQuestion(qi)}
                          sx={{ borderRadius:"7px", "&:hover":{ bgcolor:T.dangerLight,
                            color:T.danger } }}>
                          <Delete sx={{ fontSize:14, color:T.textMute }} />
                        </IconButton>
                      )}
                    </Box>

                    {/* Question text */}
                    <DInput multiline rows={2} value={q.q}
                      onChange={e => updateQ(qi, "q", e.target.value)}
                      placeholder={`Enter question ${qi+1}…`}
                      sx={{ mb:1.5 }}
                    />

                    {/* Options */}
                    <SLabel sx={{ mb:1 }}>Answer Options
                      <Box component="span" sx={{ ml:1, fontWeight:400,
                        color:T.success, fontSize:"0.65rem" }}>
                        (click radio to mark correct answer)
                      </Box>
                    </SLabel>
                    <Stack spacing={1}>
                      {q.options.map((opt, oi) => (
                        <Box key={oi} display="flex" alignItems="center" gap={1}>
                          <Box onClick={() => updateQ(qi, "correct", oi)}
                            sx={{ cursor:"pointer", color: q.correct===oi ? T.success : T.textMute,
                              flexShrink:0, "&:hover":{ color:T.success } }}>
                            {q.correct === oi
                              ? <RadioButtonChecked sx={{ fontSize:18 }} />
                              : <RadioButtonUnchecked sx={{ fontSize:18 }} />}
                          </Box>
                          <DInput value={opt}
                            onChange={e => updateOption(qi, oi, e.target.value)}
                            placeholder={`Option ${String.fromCharCode(65+oi)}`}
                            sx={{
                              "& .MuiOutlinedInput-root":{
                                bgcolor: q.correct===oi ? T.successLight : T.surface,
                                "& fieldset":{ borderColor: q.correct===oi ? T.success : T.border } }
                            }}
                          />
                          {q.options.length > 2 && (
                            <IconButton size="small"
                              onClick={() => setQuizQs(p => p.map((qx,idx) =>
                                idx===qi ? { ...qx, options:qx.options.filter((_,oidx)=>oidx!==oi) } : qx
                              ))}
                              sx={{ borderRadius:"7px", flexShrink:0,
                                "&:hover":{ bgcolor:T.dangerLight, color:T.danger } }}>
                              <Close sx={{ fontSize:13, color:T.textMute }} />
                            </IconButton>
                          )}
                        </Box>
                      ))}
                    </Stack>

                    <Button size="small" onClick={() => addOption(qi)}
                      startIcon={<Add sx={{fontSize:12}} />}
                      sx={{ mt:1, fontFamily:fBody, fontWeight:600, fontSize:"0.71rem",
                        textTransform:"none", color:T.purple,
                        "&:hover":{ bgcolor:T.purpleLight } }}>
                      Add Option
                    </Button>
                  </Box>
                ))}
              </Stack>
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ px:3, pb:3, pt:2,
          borderTop:`1px solid ${T.border}`, bgcolor:"#FAFBFD",
          display:"flex", justifyContent:"space-between", gap:1 }}>
          <Box display="flex" gap={1}>
            {dialogTab > 0 && (
              <Button size="small" variant="outlined"
                onClick={() => setDialogTab(t => t-1)}
                sx={{ fontFamily:fBody, fontWeight:600, fontSize:"0.78rem",
                  textTransform:"none", borderRadius:"8px",
                  borderColor:T.border, color:T.textSub }}>
                ← Back
              </Button>
            )}
          </Box>
          <Box display="flex" gap={1}>
            <Button onClick={() => setOpenDialog(false)} size="small" variant="outlined"
              sx={{ fontFamily:fBody, fontWeight:600, fontSize:"0.78rem",
                textTransform:"none", borderRadius:"8px",
                borderColor:T.border, color:T.textSub }}>
              Cancel
            </Button>
            {dialogTab < (current.hasQuiz ? 2 : 1) ? (
              <Button size="small" variant="contained"
                onClick={() => setDialogTab(t => t+1)}
                sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.78rem",
                  textTransform:"none", borderRadius:"8px",
                  bgcolor:T.accent, boxShadow:"none",
                  "&:hover":{ bgcolor:"#4F46E5", boxShadow:"none" } }}>
                Next →
              </Button>
            ) : (
              <Button size="small" variant="contained"
                startIcon={isUpdateMode
                  ? <NotificationsActive sx={{fontSize:14}} />
                  : <CheckCircle sx={{fontSize:14}} />}
                onClick={handleSave}
                sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.78rem",
                  textTransform:"none", borderRadius:"8px",
                  bgcolor: isUpdateMode ? T.warning : T.accent,
                  boxShadow:"none",
                  "&:hover":{ bgcolor: isUpdateMode ? T.gold : "#4F46E5", boxShadow:"none" } }}>
                {isUpdateMode ? "Publish Update & Notify" : "Create Policy"}
              </Button>
            )}
          </Box>
        </DialogActions>
      </Dialog>

      {/* ── Version History Dialog ── */}
      <Dialog open={historyOpen} onClose={() => setHistoryOpen(false)}
        maxWidth="xs" fullWidth
        PaperProps={{ sx:{ borderRadius:"16px", border:`1px solid ${T.border}` } }}>
        {historyPolicy && (
          <>
            <DialogTitle sx={{ borderBottom:`1px solid ${T.border}`, bgcolor:"#FAFBFD", pb:2 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box display="flex" alignItems="center" gap={1.5}>
                  <Box sx={{ width:4, height:26, borderRadius:2, bgcolor:T.purple }} />
                  <Box>
                    <Typography sx={{ fontFamily:fHead, fontWeight:700,
                      fontSize:"0.95rem", color:T.text }}>Version History</Typography>
                    <Typography sx={{ fontFamily:fBody, fontSize:"0.72rem", color:T.textMute }}>
                      {historyPolicy.title}
                    </Typography>
                  </Box>
                </Box>
                <IconButton size="small" onClick={() => setHistoryOpen(false)}
                  sx={{ bgcolor:"#F1F5F9", borderRadius:"8px" }}>
                  <Close fontSize="small" />
                </IconButton>
              </Box>
            </DialogTitle>
            <DialogContent sx={{ px:3, pt:3, pb:2 }}>
              <Stack spacing={0}>
                {(historyPolicy.history || []).map((h, i) => (
                  <Box key={i} display="flex" gap={1.8} sx={{ position:"relative", pb:2 }}>
                    {i < (historyPolicy.history.length-1) && (
                      <Box sx={{ position:"absolute", left:16, top:26,
                        width:2, height:"calc(100% - 14px)", bgcolor:T.border }} />
                    )}
                    <Box sx={{ width:32, height:32, borderRadius:"50%", flexShrink:0,
                      bgcolor: i===0 ? T.accent : "#F1F5F9",
                      color:   i===0 ? "#fff"   : T.textMute,
                      display:"flex", alignItems:"center", justifyContent:"center",
                      zIndex:1 }}>
                      <Typography sx={{ fontFamily:fMono, fontSize:"0.62rem",
                        fontWeight:700 }}>
                        v{h.version}
                      </Typography>
                    </Box>
                    <Box flex={1} sx={{ p:1.5, borderRadius:"9px",
                      bgcolor: i===0 ? T.accentLight : "#F9FAFB",
                      border:`1px solid ${i===0 ? T.accent+"30" : T.border}` }}>
                      <Box display="flex" justifyContent="space-between" mb={0.4}>
                        <Typography sx={{ fontFamily:fMono, fontWeight:700,
                          fontSize:"0.75rem", color: i===0 ? T.accent : T.text }}>
                          v{h.version}
                          {i===0 && (
                            <Box component="span" sx={{ ml:0.8, fontFamily:fBody,
                              fontSize:"0.62rem", color:T.accent }}>(Latest)</Box>
                          )}
                        </Typography>
                        <Typography sx={{ fontFamily:fMono, fontSize:"0.67rem",
                          color:T.textMute }}>{h.date}</Typography>
                      </Box>
                      <Typography sx={{ fontFamily:fBody, fontSize:"0.75rem",
                        color:T.textSub }}>{h.note}</Typography>
                      <Box display="flex" gap={0.7} mt={0.8}>
                        <Button size="small"
                          startIcon={<Download sx={{fontSize:11}} />}
                          onClick={() => { setHistoryOpen(false); toast(`v${h.version} PDF downloading…`); }}
                          sx={{ fontFamily:fBody, fontWeight:600, fontSize:"0.66rem",
                            textTransform:"none", color:T.accent, py:0.2,
                            "&:hover":{ bgcolor:T.accentLight } }}>
                          Download PDF
                        </Button>
                      </Box>
                    </Box>
                  </Box>
                ))}
              </Stack>
            </DialogContent>
            <DialogActions sx={{ px:3, pb:3, pt:1.5,
              borderTop:`1px solid ${T.border}`, bgcolor:"#FAFBFD" }}>
              <Button onClick={() => setHistoryOpen(false)} variant="outlined" size="small"
                sx={{ fontFamily:fBody, fontWeight:600, fontSize:"0.78rem",
                  textTransform:"none", borderRadius:"8px",
                  borderColor:T.border, color:T.textSub }}>
                Close
              </Button>
              <Button variant="outlined" size="small"
                startIcon={<Edit sx={{fontSize:13}} />}
                onClick={() => { setHistoryOpen(false); handleOpenUpdate(historyPolicy); }}
                sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.78rem",
                  textTransform:"none", borderRadius:"8px",
                  borderColor:T.accent, color:T.accent,
                  "&:hover":{ bgcolor:T.accentLight } }}>
                Update Policy
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

export default PolicyManagementView;