import React, { useState, useMemo } from "react";
import {
  Box, Grid, Typography, Button, TextField, MenuItem,
  Tabs, Tab, Table, TableBody, TableCell, TableHead, TableRow,
  IconButton, InputAdornment, Stack, Snackbar, Alert,
  Divider, Dialog, DialogTitle, DialogContent, DialogActions,
  Tooltip, Avatar
} from "@mui/material";
import {
  CloudUpload, Save, Calculate, Print, CheckCircle,
  Warning, Assignment, FileDownload, Add, Close,
  TrendingUp, Edit, ArrowForward, VerifiedUser,
  School, Person, CalendarMonth, Download,
  HourglassEmpty, EmojiEvents, Search, Refresh
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
    .fu  { animation: fadeUp 0.32s ease both; }
    .fu1 { animation: fadeUp 0.32s .06s ease both; }
    .fu2 { animation: fadeUp 0.32s .12s ease both; }
    .fu3 { animation: fadeUp 0.32s .18s ease both; }
    .row-h:hover { background:#F9FAFB !important; transition:background .15s; }
    .card-h { transition:box-shadow .18s,transform .18s; }
    .card-h:hover { box-shadow:0 6px 24px rgba(99,102,241,.12); transform:translateY(-2px); }
  `}</style>
);

/* ─────────────────────────────────────────
   MOCK DATA
───────────────────────────────────────── */
const FACULTY_LIST = [
  { id:"FAC-101", name:"Dr. Sarah Smith",   dept:"CSE",       currentDesg:"Assistant Professor",  currentPay:85000,  level:10, pbas:120, service:5  },
  { id:"FAC-102", name:"Prof. Rajan Kumar", dept:"Electrical",currentDesg:"Associate Professor",   currentPay:142000, level:13, pbas:350, service:12 },
  { id:"FAC-103", name:"Dr. Emily Davis",   dept:"Civil",     currentDesg:"Assistant Professor",  currentPay:92000,  level:11, pbas:95,  service:3  },
  { id:"FAC-104", name:"Dr. Vikram Nair",   dept:"Mech",      currentDesg:"Associate Professor",   currentPay:128000, level:12, pbas:280, service:9  },
  { id:"FAC-105", name:"Ms. Kavya Sharma",  dept:"ECE",       currentDesg:"Assistant Professor",  currentPay:78000,  level:10, pbas:145, service:6  },
  { id:"FAC-106", name:"Dr. Sunita Pillai", dept:"Science",   currentDesg:"Professor",             currentPay:185000, level:14, pbas:520, service:18 },
];

const PROMOTION_HISTORY_INIT = [
  { id:1, name:"Dr. A. Verma",    dept:"CSE",  from:"Asst. Professor",  to:"Assoc. Professor",  date:"2026-01-01", orderNo:"PRO/26/001", status:"Active"    },
  { id:2, name:"Prof. K. Singh",  dept:"Mech", from:"Assoc. Professor", to:"HOD / Professor",   date:"2025-12-15", orderNo:"PRO/25/088", status:"Pending"   },
  { id:3, name:"Dr. L. George",   dept:"ECE",  from:"Lecturer",         to:"Asst. Professor",   date:"2025-11-01", orderNo:"PRO/25/071", status:"Active"    },
  { id:4, name:"Dr. M. Rao",      dept:"Civil",from:"Asst. Professor",  to:"Assoc. Professor",  date:"2025-08-15", orderNo:"PRO/25/044", status:"Cancelled" },
];

const NEW_DESIGNATIONS = [
  "Senior Assistant Professor",
  "Associate Professor",
  "Professor",
  "Professor & HOD",
  "Dean",
];

const HISTORY_STATUS_META = {
  Active:    { color:T.success, bg:T.successLight },
  Pending:   { color:T.warning, bg:T.warningLight },
  Cancelled: { color:T.danger,  bg:T.dangerLight  },
};

const AVATAR_COLORS = [
  { bg:"#EEF2FF", color:"#6366F1" },
  { bg:"#ECFDF5", color:"#10B981" },
  { bg:"#F5F3FF", color:"#7C3AED" },
  { bg:"#FFFBEB", color:"#F59E0B" },
  { bg:"#F0F9FF", color:"#0EA5E9" },
  { bg:"#FEF2F2", color:"#EF4444" },
];
const avatarColor = (name) => AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];
const initials    = (name) => name.split(" ").filter(Boolean).slice(0,2).map(w=>w[0]).join("").toUpperCase();

const fmt = (n) => `₹${Number(n).toLocaleString("en-IN")}`;

/* CAS eligibility */
const casEligible = (row) => row.service >= 4 && row.pbas >= 100;
const casLevel    = (row) => {
  if (row.level >= 14) return "Max Level";
  if (casEligible(row))  return `Level ${row.level} → ${row.level + 1}`;
  return "In Progress";
};

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

const StatusPill = ({ status, meta }) => {
  const s = meta[status] || { color:T.textMute, bg:"#F1F5F9" };
  return (
    <Box display="flex" alignItems="center" gap={0.6}
      sx={{ px:1.2, py:0.38, borderRadius:"99px", bgcolor:s.bg, width:"fit-content" }}>
      <Box sx={{ width:6, height:6, borderRadius:"50%", bgcolor:s.color }} />
      <Typography sx={{ fontFamily:fBody, fontSize:"0.71rem", fontWeight:700, color:s.color }}>
        {status}
      </Typography>
    </Box>
  );
};

const ProgBar = ({ pct, color=T.accent }) => (
  <Box sx={{ height:6, borderRadius:99, bgcolor:T.border, overflow:"hidden" }}>
    <Box sx={{ height:"100%", width:`${Math.min(pct,100)}%`, borderRadius:99,
      bgcolor:color, transition:"width 1.2s ease" }} />
  </Box>
);

/* ═════════════════════════════════════════════
   MAIN COMPONENT
═════════════════════════════════════════════ */
const PromotionsView = () => {
  const [tabIndex,      setTabIndex]      = useState(0);

  /* ── Tab 0: Promotion Orders ── */
  const [selFacultyId,  setSelFacultyId]  = useState("");
  const [newDesg,       setNewDesg]       = useState("");
  const [effDate,       setEffDate]       = useState("");
  const [currentPay,    setCurrentPay]    = useState("");
  const [newPay,        setNewPay]        = useState("");
  const [uploadedFile,  setUploadedFile]  = useState(null);
  const [promoHistory,  setPromoHistory]  = useState(PROMOTION_HISTORY_INIT);

  /* ── Tab 1: Increments ── */
  const [incYear,       setIncYear]       = useState("2026");
  const [incPct,        setIncPct]        = useState(3);
  const [committed,     setCommitted]     = useState(false);

  /* ── Tab 2: CAS ── */
  const [casDialog,     setCasDialog]     = useState(false);
  const [casSelected,   setCasSelected]   = useState(null);
  const [casSearch,     setCasSearch]     = useState("");

  const [snack,         setSnack]         = useState({ open:false, msg:"", severity:"success" });
  const toast = (msg, severity="success") => setSnack({ open:true, msg, severity });

  /* ── Derived ── */
  const selFaculty = FACULTY_LIST.find(f => f.id === selFacultyId);

  const handleFacultyChange = (id) => {
    setSelFacultyId(id);
    const f = FACULTY_LIST.find(x => x.id === id);
    if (f) { setCurrentPay(f.currentPay); setNewPay(""); }
  };

  const handleCalculate = () => {
    if (!currentPay) return;
    // Standard 7th Pay Commission fitment: 20% on promotion
    const inc = Math.round(Number(currentPay) * 0.20);
    setNewPay(Math.round(Number(currentPay) + inc));
  };

  const handleGenerateOrder = () => {
    if (!selFacultyId || !newDesg || !effDate) {
      toast("Please fill Faculty, New Designation, and Effective Date.", "error"); return;
    }
    const f = FACULTY_LIST.find(x => x.id === selFacultyId);
    const entry = {
      id: Date.now(), name:f.name, dept:f.dept,
      from:f.currentDesg, to:newDesg, date:effDate,
      orderNo:`PRO/${new Date().getFullYear()}/${String(promoHistory.length+1).padStart(3,"0")}`,
      status:"Pending",
    };
    setPromoHistory(p => [entry, ...p]);
    toast(`Promotion order generated for ${f.name}.`);
    setSelFacultyId(""); setNewDesg(""); setEffDate(""); setCurrentPay(""); setNewPay(""); setUploadedFile(null);
  };

  const handleCommitIncrements = () => {
    setCommitted(true);
    toast(`Annual increments for July ${incYear} committed successfully.`);
  };

  const handleInitiateCAS = (row) => { setCasSelected(row); setCasDialog(true); };

  const casFiltered = useMemo(() => FACULTY_LIST.filter(f => {
    const q = casSearch.toLowerCase();
    return !q || f.name.toLowerCase().includes(q) || f.dept.toLowerCase().includes(q);
  }), [casSearch]);

  const casEligibleCount  = FACULTY_LIST.filter(casEligible).length;
  const casInProgressCount = FACULTY_LIST.filter(f => !casEligible(f) && f.level < 14).length;

  const STAT_ITEMS = [
    { label:"Total Faculty",          value:FACULTY_LIST.length,                                     color:T.accent,  Icon:Person         },
    { label:"Promotions This Year",   value:promoHistory.filter(h=>h.status!=="Cancelled").length,   color:T.success, Icon:TrendingUp      },
    { label:"CAS Eligible",           value:casEligibleCount,                                        color:T.purple,  Icon:EmojiEvents    },
    { label:"Increment Due (Jul)",    value:FACULTY_LIST.length,                                     color:T.warning, Icon:CalendarMonth   },
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
            Admin Dashboard · Faculty Management
          </Typography>
          <Typography sx={{ fontFamily:fHead, fontWeight:700, fontSize:"1.5rem", color:T.text }}>
            Promotion &amp; Increment Management
          </Typography>
          <Typography sx={{ fontFamily:fBody, fontSize:"0.82rem", color:T.textSub, mt:0.3 }}>
            Issue promotion orders, process annual increments, and track CAS eligibility.
          </Typography>
        </Box>
        <Button size="small" variant="outlined"
          startIcon={<FileDownload sx={{fontSize:15}} />}
          onClick={() => toast("Promotions report exported.")}
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
              { label:"Promotion Orders",   Icon:VerifiedUser  },
              { label:"Annual Increments",  Icon:TrendingUp    },
              { label:"CAS Tracker",        Icon:EmojiEvents   },
            ].map((t,i) => (
              <Tab key={i} icon={<t.Icon sx={{fontSize:16}} />}
                iconPosition="start" label={t.label} />
            ))}
          </Tabs>
        </Box>

        <Box p={3}>

          {/* ════════════════════════════════
              TAB 0 — PROMOTION ORDERS
          ════════════════════════════════ */}
          {tabIndex === 0 && (
            <Grid container spacing={3} className="fu">

              {/* Left: Create order */}
              <Grid item xs={12} md={5.5}>
                <Box display="flex" alignItems="center" gap={1} mb={2}>
                  <Box sx={{ p:0.75, borderRadius:"8px",
                    bgcolor:T.accentLight, color:T.accent }}>
                    <Add sx={{ fontSize:16 }} />
                  </Box>
                  <Typography sx={{ fontFamily:fHead, fontWeight:700,
                    fontSize:"0.9rem", color:T.text }}>
                    Create New Promotion Order
                  </Typography>
                </Box>

                <Stack spacing={2}>
                  {/* Faculty selector */}
                  <Box>
                    <SLabel sx={{ mb:0.7 }}>Select Faculty *</SLabel>
                    <DInput select value={selFacultyId}
                      onChange={e => handleFacultyChange(e.target.value)}>
                      <MenuItem value="" sx={{ fontFamily:fBody, fontSize:"0.82rem",
                        color:T.textMute }}>
                        — Choose faculty member —
                      </MenuItem>
                      {FACULTY_LIST.map(f => (
                        <MenuItem key={f.id} value={f.id}
                          sx={{ fontFamily:fBody, fontSize:"0.82rem" }}>
                          {f.name}
                          <Typography component="span"
                            sx={{ ml:1, fontFamily:fBody, fontSize:"0.73rem",
                              color:T.textMute }}>
                            ({f.currentDesg} · {f.dept})
                          </Typography>
                        </MenuItem>
                      ))}
                    </DInput>
                  </Box>

                  {/* Selected faculty info */}
                  {selFaculty && (
                    <Box sx={{ p:1.8, borderRadius:"10px",
                      bgcolor:T.accentLight, border:`1px solid ${T.accent}25` }}>
                      <Box display="flex" alignItems="center" gap={1.5}>
                        {(() => { const av = avatarColor(selFaculty.name); return (
                          <Avatar sx={{ width:36, height:36, bgcolor:av.bg,
                            color:av.color, fontFamily:fHead,
                            fontSize:"0.72rem", fontWeight:700 }}>
                            {initials(selFaculty.name)}
                          </Avatar>
                        ); })()}
                        <Box>
                          <Typography sx={{ fontFamily:fBody, fontWeight:700,
                            fontSize:"0.83rem", color:T.text }}>{selFaculty.name}</Typography>
                          <Typography sx={{ fontFamily:fBody, fontSize:"0.71rem",
                            color:T.textSub }}>
                            {selFaculty.currentDesg} · Level {selFaculty.level} · {selFaculty.service} yrs service
                          </Typography>
                        </Box>
                        <Box sx={{ ml:"auto", px:0.9, py:0.25, borderRadius:"6px",
                          bgcolor:T.surface }}>
                          <Typography sx={{ fontFamily:fMono, fontSize:"0.68rem",
                            fontWeight:700, color:T.accent }}>{selFaculty.id}</Typography>
                        </Box>
                      </Box>
                    </Box>
                  )}

                  <Grid container spacing={1.5}>
                    <Grid item xs={12} sm={6}>
                      <SLabel sx={{ mb:0.7 }}>New Designation *</SLabel>
                      <DInput select value={newDesg}
                        onChange={e => setNewDesg(e.target.value)}>
                        <MenuItem value="" sx={{ fontFamily:fBody, fontSize:"0.82rem",
                          color:T.textMute }}>
                          — Select —
                        </MenuItem>
                        {NEW_DESIGNATIONS.map(d => (
                          <MenuItem key={d} value={d}
                            sx={{ fontFamily:fBody, fontSize:"0.82rem" }}>{d}</MenuItem>
                        ))}
                      </DInput>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <SLabel sx={{ mb:0.7 }}>Effective Date *</SLabel>
                      <DInput type="date" value={effDate}
                        onChange={e => setEffDate(e.target.value)}
                        InputLabelProps={{ shrink:true }} />
                    </Grid>
                  </Grid>

                  {/* Salary revision calculator */}
                  <Box sx={{ p:2, borderRadius:"10px",
                    bgcolor:"#F9FAFB", border:`1px solid ${T.border}` }}>
                    <Box display="flex" alignItems="center" gap={1} mb={1.5}>
                      <Box sx={{ p:0.6, borderRadius:"7px",
                        bgcolor:T.accentLight, color:T.accent }}>
                        <Calculate sx={{ fontSize:14 }} />
                      </Box>
                      <Typography sx={{ fontFamily:fBody, fontWeight:700,
                        fontSize:"0.8rem", color:T.text }}>
                        Salary Revision Calculator
                      </Typography>
                      <Typography sx={{ fontFamily:fBody, fontSize:"0.69rem",
                        color:T.textMute, ml:0.5 }}>(20% fitment on promotion)</Typography>
                    </Box>

                    <Grid container spacing={1.5} alignItems="center">
                      <Grid item xs={5}>
                        <SLabel sx={{ mb:0.5 }}>Current Basic</SLabel>
                        <TextField size="small" fullWidth value={currentPay}
                          onChange={e => { setCurrentPay(e.target.value); setNewPay(""); }}
                          InputProps={{ startAdornment:
                            <InputAdornment position="start">
                              <Typography sx={{ fontFamily:fMono, fontSize:"0.8rem",
                                color:T.textMute }}>₹</Typography>
                            </InputAdornment>
                          }}
                          sx={{ "& .MuiOutlinedInput-root":{ borderRadius:"8px",
                            fontFamily:fMono, fontSize:"0.83rem",
                            "& fieldset":{ borderColor:T.border },
                            "&.Mui-focused fieldset":{ borderColor:T.accent } }}}
                        />
                      </Grid>
                      <Grid item xs={2} textAlign="center">
                        <Tooltip title="Calculate new basic pay">
                          <IconButton onClick={handleCalculate}
                            sx={{ bgcolor:T.accentLight, color:T.accent,
                              borderRadius:"9px", "&:hover":{ bgcolor:T.accent, color:"#fff" } }}>
                            <ArrowForward sx={{ fontSize:18 }} />
                          </IconButton>
                        </Tooltip>
                      </Grid>
                      <Grid item xs={5}>
                        <SLabel sx={{ mb:0.5 }}>New Basic Pay</SLabel>
                        <TextField size="small" fullWidth value={newPay}
                          InputProps={{ readOnly:true, startAdornment:
                            <InputAdornment position="start">
                              <Typography sx={{ fontFamily:fMono, fontSize:"0.8rem",
                                color: newPay ? T.success : T.textMute }}>₹</Typography>
                            </InputAdornment>
                          }}
                          sx={{ "& .MuiOutlinedInput-root":{ borderRadius:"8px",
                            fontFamily:fMono, fontSize:"0.83rem",
                            bgcolor: newPay ? T.successLight : "transparent",
                            "& fieldset":{ borderColor: newPay ? T.success : T.border } }}}
                        />
                      </Grid>
                    </Grid>

                    {newPay && currentPay && (
                      <Box sx={{ mt:1.2, px:1.2, py:0.7, borderRadius:"7px",
                        bgcolor:T.successLight, border:`1px solid ${T.success}25`,
                        display:"flex", justifyContent:"space-between" }}>
                        <Typography sx={{ fontFamily:fBody, fontSize:"0.73rem",
                          color:T.success, fontWeight:600 }}>
                          Increment: {fmt(newPay - currentPay)}/month
                        </Typography>
                        <Typography sx={{ fontFamily:fBody, fontSize:"0.73rem",
                          color:T.success, fontWeight:600 }}>
                          Annual uplift: {fmt((newPay - currentPay) * 12)}
                        </Typography>
                      </Box>
                    )}
                  </Box>

                  {/* File upload */}
                  <Box>
                    <SLabel sx={{ mb:0.7 }}>Signed Promotion Order (PDF)</SLabel>
                    <Box sx={{ p:2, borderRadius:"9px", textAlign:"center",
                      border:`2px dashed ${uploadedFile ? T.success : T.border}`,
                      bgcolor: uploadedFile ? T.successLight : "#FAFBFD",
                      transition:"all .15s", cursor:"pointer" }}
                      onClick={() => document.getElementById("upload-promo").click()}>
                      <input id="upload-promo" type="file" accept="application/pdf"
                        style={{ display:"none" }}
                        onChange={e => {
                          if (e.target.files[0]) {
                            setUploadedFile(e.target.files[0].name);
                            toast("File uploaded successfully.");
                          }
                        }} />
                      {uploadedFile ? (
                        <Box>
                          <CheckCircle sx={{ fontSize:24, color:T.success, mb:0.5 }} />
                          <Typography sx={{ fontFamily:fBody, fontSize:"0.78rem",
                            fontWeight:700, color:T.success }}>{uploadedFile}</Typography>
                        </Box>
                      ) : (
                        <Box>
                          <CloudUpload sx={{ fontSize:26, color:T.textMute, mb:0.5 }} />
                          <Typography sx={{ fontFamily:fBody, fontSize:"0.78rem",
                            color:T.textMute }}>
                            Click to upload signed PDF
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </Box>

                  <Button variant="contained" fullWidth size="large"
                    startIcon={<Save sx={{fontSize:18}} />}
                    onClick={handleGenerateOrder}
                    sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.88rem",
                      textTransform:"none", borderRadius:"9px", py:1.3,
                      bgcolor:T.accent, boxShadow:"none",
                      "&:hover":{ bgcolor:"#4F46E5", boxShadow:"none" } }}>
                    Generate &amp; Save Order
                  </Button>
                </Stack>
              </Grid>

              {/* Divider */}
              <Grid item xs={12} md={0.5} display="flex" justifyContent="center">
                <Divider orientation="vertical" sx={{ borderColor:T.border, display:{ xs:"none", md:"block" } }} />
              </Grid>

              {/* Right: History */}
              <Grid item xs={12} md={6}>
                <Box display="flex" alignItems="center" gap={1} mb={2}>
                  <Box sx={{ p:0.75, borderRadius:"8px",
                    bgcolor:T.purpleLight, color:T.purple }}>
                    <VerifiedUser sx={{ fontSize:15 }} />
                  </Box>
                  <Typography sx={{ fontFamily:fHead, fontWeight:700,
                    fontSize:"0.9rem", color:T.text }}>
                    Recent Promotion History
                  </Typography>
                </Box>

                <Box sx={{ borderRadius:"10px", border:`1px solid ${T.border}`, overflow:"hidden" }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TH>Faculty</TH>
                        <TH>Promotion</TH>
                        <TH>Effective</TH>
                        <TH>Status</TH>
                        <TH align="center">Action</TH>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {promoHistory.map(row => (
                        <TableRow key={row.id} className="row-h">
                          <TD sx={{ minWidth:130 }}>
                            <Typography sx={{ fontFamily:fBody, fontWeight:700,
                              fontSize:"0.81rem", color:T.text }}>{row.name}</Typography>
                            <Typography sx={{ fontFamily:fBody, fontSize:"0.68rem",
                              color:T.textMute }}>{row.dept}</Typography>
                          </TD>
                          <TD sx={{ minWidth:160 }}>
                            <Box display="flex" alignItems="center" gap={0.6}>
                              <Typography sx={{ fontFamily:fBody, fontSize:"0.73rem",
                                color:T.textMute }}>{row.from}</Typography>
                              <ArrowForward sx={{ fontSize:11, color:T.accent }} />
                              <Typography sx={{ fontFamily:fBody, fontWeight:700,
                                fontSize:"0.73rem", color:T.accent }}>{row.to}</Typography>
                            </Box>
                            <Typography sx={{ fontFamily:fMono, fontSize:"0.66rem",
                              color:T.textMute, mt:0.3 }}>{row.orderNo}</Typography>
                          </TD>
                          <TD>
                            <Typography sx={{ fontFamily:fMono, fontSize:"0.74rem" }}>
                              {row.date}
                            </Typography>
                          </TD>
                          <TD>
                            <StatusPill status={row.status} meta={HISTORY_STATUS_META} />
                          </TD>
                          <TD align="center">
                            <Tooltip title="Download order">
                              <IconButton size="small"
                                sx={{ bgcolor:T.accentLight, color:T.accent,
                                  borderRadius:"7px", width:28, height:28 }}
                                onClick={() => toast(`Order ${row.orderNo} downloading…`)}>
                                <Download sx={{ fontSize:13 }} />
                              </IconButton>
                            </Tooltip>
                          </TD>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Box>
              </Grid>
            </Grid>
          )}

          {/* ════════════════════════════════
              TAB 1 — ANNUAL INCREMENTS
          ════════════════════════════════ */}
          {tabIndex === 1 && (
            <Box className="fu">
              {/* Toolbar */}
              <Box display="flex" justifyContent="space-between"
                alignItems="flex-start" mb={3} flexWrap="wrap" gap={2}>
                <Box>
                  <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                    <Box sx={{ p:0.75, borderRadius:"8px",
                      bgcolor:T.successLight, color:T.success }}>
                      <TrendingUp sx={{ fontSize:15 }} />
                    </Box>
                    <Typography sx={{ fontFamily:fHead, fontWeight:700,
                      fontSize:"0.9rem", color:T.text }}>
                      Annual Increment Processing
                    </Typography>
                  </Box>
                  <Typography sx={{ fontFamily:fBody, fontSize:"0.76rem", color:T.textMute }}>
                    Processing effective July {incYear} — {FACULTY_LIST.length} faculty members
                  </Typography>
                </Box>

                <Box display="flex" gap={1.5} flexWrap="wrap" alignItems="center">
                  {/* Increment % control */}
                  <Box sx={{ display:"flex", alignItems:"center", gap:1,
                    p:1, borderRadius:"9px", border:`1px solid ${T.border}`, bgcolor:"#F9FAFB" }}>
                    <SLabel sx={{ mb:0, mr:0.5 }}>Rate:</SLabel>
                    <TextField size="small" type="number" value={incPct}
                      onChange={e => { setIncPct(+e.target.value); setCommitted(false); }}
                      InputProps={{ endAdornment:
                        <InputAdornment position="end">
                          <Typography sx={{ fontFamily:fMono, fontSize:"0.78rem",
                            color:T.accent }}>%</Typography>
                        </InputAdornment>
                      }}
                      sx={{ width:90,
                        "& .MuiOutlinedInput-root":{ borderRadius:"7px",
                          fontFamily:fMono, fontSize:"0.83rem",
                          "& fieldset":{ borderColor:T.border },
                          "&.Mui-focused fieldset":{ borderColor:T.accent } }}}
                    />
                  </Box>

                  <Button size="small" variant="outlined"
                    startIcon={<Download sx={{fontSize:14}} />}
                    onClick={() => toast("Increment template CSV downloaded.")}
                    sx={{ fontFamily:fBody, fontWeight:600, fontSize:"0.75rem",
                      textTransform:"none", borderRadius:"8px",
                      borderColor:T.border, color:T.textSub,
                      "&:hover":{ borderColor:T.accent, color:T.accent } }}>
                    Template CSV
                  </Button>
                  <Button size="small" variant="outlined"
                    component="label"
                    startIcon={<CloudUpload sx={{fontSize:14}} />}
                    sx={{ fontFamily:fBody, fontWeight:600, fontSize:"0.75rem",
                      textTransform:"none", borderRadius:"8px",
                      borderColor:T.info, color:T.info,
                      "&:hover":{ bgcolor:T.infoLight } }}>
                    Upload CSV
                    <input type="file" accept=".csv" hidden
                      onChange={() => toast("Increment CSV uploaded and validated.")} />
                  </Button>
                </Box>
              </Box>

              {/* Summary banner */}
              <Box sx={{ p:2.2, borderRadius:"10px", mb:2.5,
                background:`linear-gradient(135deg, ${T.successLight}, #D1FAE5)`,
                border:`1px solid ${T.success}25`,
                display:"flex", gap:3, flexWrap:"wrap" }}>
                {[
                  { label:"Total Faculty",         value:FACULTY_LIST.length },
                  { label:"Increment Rate",         value:`${incPct}%` },
                  { label:"Avg. Increment/Month",  value:fmt(Math.round(FACULTY_LIST.reduce((s,f)=>s+f.currentPay*incPct/100,0)/FACULTY_LIST.length)) },
                  { label:"Total Monthly Outflow",  value:fmt(Math.round(FACULTY_LIST.reduce((s,f)=>s+f.currentPay*incPct/100,0))) },
                ].map(s => (
                  <Box key={s.label}>
                    <SLabel sx={{ mb:0.2, color:T.success }}>{s.label}</SLabel>
                    <Typography sx={{ fontFamily:fMono, fontWeight:700,
                      fontSize:"1rem", color:T.success }}>{s.value}</Typography>
                  </Box>
                ))}
                {committed && (
                  <Box sx={{ ml:"auto", display:"flex", alignItems:"center", gap:0.7 }}>
                    <CheckCircle sx={{ fontSize:16, color:T.success }} />
                    <Typography sx={{ fontFamily:fBody, fontWeight:700,
                      fontSize:"0.78rem", color:T.success }}>
                      Committed
                    </Typography>
                  </Box>
                )}
              </Box>

              {/* Increment table */}
              <Box sx={{ borderRadius:"10px", border:`1px solid ${T.border}`, overflow:"hidden", mb:3 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TH>Emp ID</TH>
                      <TH>Faculty Name</TH>
                      <TH>Dept</TH>
                      <TH align="right">Current Basic</TH>
                      <TH align="right">Increment ({incPct}%)</TH>
                      <TH align="right">New Basic</TH>
                      <TH>Status</TH>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {FACULTY_LIST.map(row => {
                      const inc    = Math.round(row.currentPay * incPct / 100);
                      const newB   = row.currentPay + inc;
                      const av     = avatarColor(row.name);
                      return (
                        <TableRow key={row.id} className="row-h">
                          <TD>
                            <Box sx={{ px:0.9, py:0.25, borderRadius:"6px",
                              bgcolor:T.accentLight, display:"inline-block" }}>
                              <Typography sx={{ fontFamily:fMono, fontSize:"0.69rem",
                                fontWeight:700, color:T.accent }}>{row.id}</Typography>
                            </Box>
                          </TD>
                          <TD sx={{ minWidth:160 }}>
                            <Box display="flex" alignItems="center" gap={1.2}>
                              <Avatar sx={{ width:28, height:28, bgcolor:av.bg,
                                color:av.color, fontFamily:fHead,
                                fontSize:"0.62rem", fontWeight:700 }}>
                                {initials(row.name)}
                              </Avatar>
                              <Box>
                                <Typography sx={{ fontFamily:fBody, fontWeight:700,
                                  fontSize:"0.81rem", color:T.text }}>{row.name}</Typography>
                                <Typography sx={{ fontFamily:fBody, fontSize:"0.68rem",
                                  color:T.textMute }}>{row.currentDesg}</Typography>
                              </Box>
                            </Box>
                          </TD>
                          <TD>
                            <Box sx={{ px:0.9, py:0.22, borderRadius:"5px",
                              bgcolor:"#F1F5F9", display:"inline-block" }}>
                              <Typography sx={{ fontFamily:fBody, fontSize:"0.69rem",
                                fontWeight:700, color:T.textSub }}>{row.dept}</Typography>
                            </Box>
                          </TD>
                          <TD align="right">
                            <Typography sx={{ fontFamily:fMono, fontSize:"0.81rem" }}>
                              {fmt(row.currentPay)}
                            </Typography>
                          </TD>
                          <TD align="right">
                            <Typography sx={{ fontFamily:fMono, fontWeight:700,
                              fontSize:"0.81rem", color:T.success }}>
                              +{fmt(inc)}
                            </Typography>
                          </TD>
                          <TD align="right">
                            <Typography sx={{ fontFamily:fMono, fontWeight:700,
                              fontSize:"0.88rem", color:T.accent }}>
                              {fmt(newB)}
                            </Typography>
                          </TD>
                          <TD>
                            <Box display="flex" alignItems="center" gap={0.6}
                              sx={{ px:1.1, py:0.32, borderRadius:"99px",
                                bgcolor: committed ? T.successLight : T.warningLight,
                                width:"fit-content" }}>
                              <Box sx={{ width:5, height:5, borderRadius:"50%",
                                bgcolor: committed ? T.success : T.warning }} />
                              <Typography sx={{ fontFamily:fBody, fontSize:"0.67rem",
                                fontWeight:700,
                                color: committed ? T.success : T.warning }}>
                                {committed ? "Committed" : "Pending"}
                              </Typography>
                            </Box>
                          </TD>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </Box>

              <Box display="flex" justifyContent="flex-end" gap={1.5}>
                <Button size="small" variant="outlined"
                  startIcon={<Print sx={{fontSize:14}} />}
                  onClick={() => toast("Preview letters generated.")}
                  sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.77rem",
                    textTransform:"none", borderRadius:"8px",
                    borderColor:T.purple, color:T.purple,
                    "&:hover":{ bgcolor:T.purpleLight } }}>
                  Preview Letters
                </Button>
                <Button size="small" variant="contained"
                  startIcon={<Save sx={{fontSize:14}} />}
                  disabled={committed}
                  onClick={handleCommitIncrements}
                  sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.77rem",
                    textTransform:"none", borderRadius:"8px",
                    bgcolor:T.success, boxShadow:"none",
                    "&:hover":{ bgcolor:"#059669", boxShadow:"none" },
                    "&.Mui-disabled":{ bgcolor:"#E5E7EB", color:T.textMute } }}>
                  {committed ? "Changes Committed" : "Commit Changes"}
                </Button>
              </Box>
            </Box>
          )}

          {/* ════════════════════════════════
              TAB 2 — CAS TRACKER
          ════════════════════════════════ */}
          {tabIndex === 2 && (
            <Box className="fu">
              {/* Header */}
              <Box display="flex" alignItems="center" gap={1} mb={2.5}>
                <Box sx={{ p:0.75, borderRadius:"8px",
                  bgcolor:T.goldLight, color:T.gold }}>
                  <EmojiEvents sx={{ fontSize:15 }} />
                </Box>
                <Box>
                  <Typography sx={{ fontFamily:fHead, fontWeight:700,
                    fontSize:"0.9rem", color:T.text }}>
                    CAS Eligibility Tracker
                  </Typography>
                  <Typography sx={{ fontFamily:fBody, fontSize:"0.73rem", color:T.textMute }}>
                    Career Advancement Scheme — Level 10 → 11 → 12 → 13 → 14
                  </Typography>
                </Box>
              </Box>

              {/* CAS stat cards */}
              <Grid container spacing={2} mb={3}>
                {[
                  { label:"Eligible for Upgrade",   value:casEligibleCount,           color:T.success, Icon:CheckCircle      },
                  { label:"In Progress",             value:casInProgressCount,         color:T.warning, Icon:HourglassEmpty   },
                  { label:"At Maximum Level",        value:FACULTY_LIST.filter(f=>f.level>=14).length, color:T.purple, Icon:EmojiEvents },
                ].map((s,i) => (
                  <Grid item xs={12} md={4} key={i}>
                    <SCard hover sx={{ p:2 }}>
                      <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                        <Box>
                          <SLabel>{s.label}</SLabel>
                          <Typography sx={{ fontFamily:fMono, fontWeight:700,
                            fontSize:"1.6rem", color:s.color }}>{s.value}</Typography>
                        </Box>
                        <Box sx={{ p:1, borderRadius:"9px", bgcolor:`${s.color}15`, color:s.color }}>
                          <s.Icon sx={{ fontSize:18 }} />
                        </Box>
                      </Box>
                    </SCard>
                  </Grid>
                ))}
              </Grid>

              {/* Search */}
              <Box mb={2}>
                <TextField size="small" placeholder="Search by name or department…"
                  value={casSearch} onChange={e => setCasSearch(e.target.value)}
                  InputProps={{ startAdornment:
                    <InputAdornment position="start">
                      <Search sx={{ fontSize:16, color:T.textMute }} />
                    </InputAdornment>
                  }}
                  sx={{ width:300,
                    "& .MuiOutlinedInput-root":{ borderRadius:"8px",
                      fontFamily:fBody, fontSize:"0.8rem", bgcolor:T.surface,
                      "& fieldset":{ borderColor:T.border },
                      "&.Mui-focused fieldset":{ borderColor:T.accent } }}}
                />
              </Box>

              {/* CAS table */}
              <Box sx={{ borderRadius:"10px", border:`1px solid ${T.border}`, overflow:"hidden" }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TH>Faculty</TH>
                      <TH>Current Level</TH>
                      <TH>Service</TH>
                      <TH>PBAS Score</TH>
                      <TH sx={{ minWidth:140 }}>CAS Progress</TH>
                      <TH>Eligibility</TH>
                      <TH align="center">Action</TH>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {casFiltered.map(row => {
                      const eligible = casEligible(row);
                      const maxLevel = row.level >= 14;
                      const av = avatarColor(row.name);
                      // Progress: service out of 4 years, PBAS out of 100
                      const svcPct  = Math.min(100, Math.round((row.service / 4) * 100));
                      const pbasPct = Math.min(100, Math.round((row.pbas    / 100) * 100));

                      return (
                        <TableRow key={row.id} className="row-h">
                          <TD sx={{ minWidth:180 }}>
                            <Box display="flex" alignItems="center" gap={1.3}>
                              <Avatar sx={{ width:32, height:32, bgcolor:av.bg,
                                color:av.color, fontFamily:fHead,
                                fontSize:"0.65rem", fontWeight:700 }}>
                                {initials(row.name)}
                              </Avatar>
                              <Box>
                                <Typography sx={{ fontFamily:fBody, fontWeight:700,
                                  fontSize:"0.81rem", color:T.text }}>{row.name}</Typography>
                                <Typography sx={{ fontFamily:fBody, fontSize:"0.68rem",
                                  color:T.textMute }}>{row.dept} · {row.currentDesg}</Typography>
                              </Box>
                            </Box>
                          </TD>

                          <TD>
                            <Box sx={{ px:1.2, py:0.35, borderRadius:"8px",
                              bgcolor:T.accentLight, display:"inline-block" }}>
                              <Typography sx={{ fontFamily:fMono, fontWeight:700,
                                fontSize:"0.79rem", color:T.accent }}>
                                Level {row.level}
                              </Typography>
                            </Box>
                          </TD>

                          <TD>
                            <Typography sx={{ fontFamily:fMono, fontWeight:700,
                              fontSize:"0.81rem",
                              color: row.service >= 4 ? T.success : T.warning }}>
                              {row.service} yrs
                            </Typography>
                            <Typography sx={{ fontFamily:fBody, fontSize:"0.67rem",
                              color:T.textMute }}>
                              {row.service >= 4 ? "✓ Met" : `${4-row.service}y to go`}
                            </Typography>
                          </TD>

                          <TD>
                            <Typography sx={{ fontFamily:fMono, fontWeight:700,
                              fontSize:"0.82rem",
                              color: row.pbas >= 100 ? T.success : T.warning }}>
                              {row.pbas}
                            </Typography>
                            <Typography sx={{ fontFamily:fBody, fontSize:"0.67rem",
                              color:T.textMute }}>
                              {row.pbas >= 100 ? "✓ ≥ 100" : `Need ${100-row.pbas} more`}
                            </Typography>
                          </TD>

                          <TD sx={{ minWidth:150 }}>
                            <Box mb={0.8}>
                              <Box display="flex" justifyContent="space-between" mb={0.3}>
                                <Typography sx={{ fontFamily:fBody, fontSize:"0.62rem",
                                  color:T.textMute }}>Service</Typography>
                                <Typography sx={{ fontFamily:fMono, fontSize:"0.62rem",
                                  fontWeight:700, color: svcPct>=100?T.success:T.warning }}>
                                  {svcPct}%
                                </Typography>
                              </Box>
                              <ProgBar pct={svcPct}
                                color={svcPct>=100?T.success:T.warning} />
                            </Box>
                            <Box>
                              <Box display="flex" justifyContent="space-between" mb={0.3}>
                                <Typography sx={{ fontFamily:fBody, fontSize:"0.62rem",
                                  color:T.textMute }}>PBAS</Typography>
                                <Typography sx={{ fontFamily:fMono, fontSize:"0.62rem",
                                  fontWeight:700, color: pbasPct>=100?T.success:T.accent }}>
                                  {pbasPct}%
                                </Typography>
                              </Box>
                              <ProgBar pct={pbasPct}
                                color={pbasPct>=100?T.success:T.accent} />
                            </Box>
                          </TD>

                          <TD>
                            {maxLevel ? (
                              <Box display="flex" alignItems="center" gap={0.6}
                                sx={{ px:1.1, py:0.35, borderRadius:"99px",
                                  bgcolor:T.purpleLight, width:"fit-content" }}>
                                <EmojiEvents sx={{ fontSize:11, color:T.purple }} />
                                <Typography sx={{ fontFamily:fBody, fontSize:"0.69rem",
                                  fontWeight:700, color:T.purple }}>Max Level</Typography>
                              </Box>
                            ) : eligible ? (
                              <Box display="flex" alignItems="center" gap={0.6}
                                sx={{ px:1.1, py:0.35, borderRadius:"99px",
                                  bgcolor:T.successLight, width:"fit-content" }}>
                                <Box sx={{ width:5, height:5, borderRadius:"50%",
                                  bgcolor:T.success }} />
                                <Typography sx={{ fontFamily:fBody, fontSize:"0.69rem",
                                  fontWeight:700, color:T.success }}>Eligible</Typography>
                              </Box>
                            ) : (
                              <Box display="flex" alignItems="center" gap={0.6}
                                sx={{ px:1.1, py:0.35, borderRadius:"99px",
                                  bgcolor:T.warningLight, width:"fit-content" }}>
                                <Box sx={{ width:5, height:5, borderRadius:"50%",
                                  bgcolor:T.warning }} />
                                <Typography sx={{ fontFamily:fBody, fontSize:"0.69rem",
                                  fontWeight:700, color:T.warning }}>In Progress</Typography>
                              </Box>
                            )}
                          </TD>

                          <TD align="center">
                            <Tooltip title={eligible
                              ? "Initiate CAS review"
                              : "Not yet eligible for CAS"}>
                              <Box component="span">
                                <Button size="small" variant={eligible?"contained":"outlined"}
                                  disabled={!eligible || maxLevel}
                                  startIcon={<Assignment sx={{fontSize:13}} />}
                                  onClick={() => handleInitiateCAS(row)}
                                  sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.72rem",
                                    textTransform:"none", borderRadius:"7px",
                                    bgcolor: eligible ? T.accent : undefined,
                                    boxShadow:"none",
                                    "&:hover":{ bgcolor:"#4F46E5", boxShadow:"none" },
                                    "&.Mui-disabled":{ bgcolor:"#F1F5F9", color:T.textMute, borderColor:T.border } }}>
                                  {maxLevel ? "Max Level" : "Initiate Review"}
                                </Button>
                              </Box>
                            </Tooltip>
                          </TD>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </Box>
            </Box>
          )}
        </Box>
      </SCard>

      {/* ── CAS Review Dialog ── */}
      <Dialog open={casDialog} onClose={() => setCasDialog(false)}
        maxWidth="xs" fullWidth
        PaperProps={{ sx:{ borderRadius:"16px", border:`1px solid ${T.border}` } }}>
        {casSelected && (
          <>
            <DialogTitle sx={{ borderBottom:`1px solid ${T.border}`, bgcolor:"#FAFBFD", pb:2 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box display="flex" alignItems="center" gap={1.5}>
                  <Box sx={{ width:4, height:26, borderRadius:2, bgcolor:T.accent }} />
                  <Box>
                    <Typography sx={{ fontFamily:fHead, fontWeight:700,
                      fontSize:"0.95rem", color:T.text }}>Initiate CAS Review</Typography>
                    <Typography sx={{ fontFamily:fBody, fontSize:"0.72rem", color:T.textMute }}>
                      {casSelected.name} · Level {casSelected.level} → {casSelected.level+1}
                    </Typography>
                  </Box>
                </Box>
                <IconButton size="small" onClick={() => setCasDialog(false)}
                  sx={{ bgcolor:"#F1F5F9", borderRadius:"8px" }}>
                  <Close fontSize="small" />
                </IconButton>
              </Box>
            </DialogTitle>
            <DialogContent sx={{ px:3, pt:3, pb:2 }}>
              <Grid container spacing={1.5} mb={2}>
                {[
                  { label:"Current Level",   value:`Level ${casSelected.level}`    },
                  { label:"Target Level",    value:`Level ${casSelected.level+1}`  },
                  { label:"Service Years",   value:`${casSelected.service} years`  },
                  { label:"PBAS Score",      value:casSelected.pbas                },
                ].map(s => (
                  <Grid item xs={6} key={s.label}>
                    <Box sx={{ p:1.3, borderRadius:"8px", bgcolor:"#F9FAFB",
                      border:`1px solid ${T.border}` }}>
                      <SLabel sx={{ mb:0.2 }}>{s.label}</SLabel>
                      <Typography sx={{ fontFamily:fMono, fontWeight:700,
                        fontSize:"0.85rem", color:T.accent }}>{s.value}</Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
              <DInput multiline rows={3}
                label="Reviewer Remarks"
                placeholder="Add any notes for the CAS screening committee…"
              />
            </DialogContent>
            <DialogActions sx={{ px:3, pb:3, pt:2,
              borderTop:`1px solid ${T.border}`, bgcolor:"#FAFBFD", gap:1 }}>
              <Button onClick={() => setCasDialog(false)} variant="outlined" size="small"
                sx={{ fontFamily:fBody, fontWeight:600, fontSize:"0.78rem",
                  textTransform:"none", borderRadius:"8px",
                  borderColor:T.border, color:T.textSub }}>
                Cancel
              </Button>
              <Button variant="contained" size="small"
                startIcon={<CheckCircle sx={{fontSize:14}} />}
                onClick={() => {
                  setCasDialog(false);
                  toast(`CAS review initiated for ${casSelected.name} (Level ${casSelected.level} → ${casSelected.level+1}).`);
                }}
                sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.78rem",
                  textTransform:"none", borderRadius:"8px",
                  bgcolor:T.accent, boxShadow:"none",
                  "&:hover":{ bgcolor:"#4F46E5", boxShadow:"none" } }}>
                Initiate &amp; Notify Committee
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

export default PromotionsView;