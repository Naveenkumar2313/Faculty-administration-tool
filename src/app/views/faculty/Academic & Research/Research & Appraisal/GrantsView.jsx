import React, { useState } from 'react';
import {
  Box, Grid, Typography, Button, Tabs, Tab, Stack,
  Table, TableHead, TableBody, TableRow, TableCell,
  MenuItem, TextField, IconButton, Divider, Avatar
} from "@mui/material";
import {
  TrendingUp, AccountBalance, Timeline, Description,
  CheckCircle, Cancel, Download, Add, Assignment,
  Group, Warning, ArrowForward, AttachMoney,
  Science, BarChart, Notifications, FileDownload,
  HourglassEmpty, Edit, Close
} from '@mui/icons-material';
import { Snackbar, Alert } from "@mui/material";

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
    .fu  { animation: fadeUp 0.28s ease both; }
    .fu1 { animation: fadeUp 0.28s .07s ease both; }
    .fu2 { animation: fadeUp 0.28s .14s ease both; }
    .row-h:hover { background:#F9FAFB !important; transition:background .13s; }
    .card-h { transition:box-shadow .16s,transform .16s; }
    .card-h:hover { box-shadow:0 4px 20px rgba(99,102,241,.11); transform:translateY(-2px); }
  `}</style>
);

/* ─────────────────────────────────────────
   MOCK DATA
───────────────────────────────────────── */
const OPPORTUNITIES = [
  { id:1, agency:"DST-SERB",  scheme:"CRG — Core Research Grant",        grantAmount:"₹25–80L", deadline:"20 Dec 2024", match:"High",   area:"AI / ML"      },
  { id:2, agency:"ICMR",      scheme:"Extramural Research Programme",     grantAmount:"₹15–50L", deadline:"31 Jan 2025", match:"Medium", area:"Healthcare AI" },
  { id:3, agency:"CSIR",      scheme:"CSIR Research Grant (EMR)",         grantAmount:"₹20–60L", deadline:"15 Feb 2025", match:"High",   area:"Computer Sci." },
  { id:4, agency:"MeitY",     scheme:"TIDE 2.0 — Technology Innovation",  grantAmount:"₹50L",    deadline:"28 Feb 2025", match:"Medium", area:"IoT / Edge AI" },
];

const PROJECTS = [
  {
    id:"DST-2022-441",
    title:"Federated Learning for Healthcare Data Privacy",
    agency:"DST-SERB",
    sanctionedAmt:4200000,
    startDate:"01 Apr 2022",
    endDate:"31 Mar 2025",
    status:"Active",
    duration:"36 months",
  },
  {
    id:"CSIR-2023-119",
    title:"Graph Neural Networks for Supply Chain Optimisation",
    agency:"CSIR",
    sanctionedAmt:1500000,
    startDate:"01 Jul 2023",
    endDate:"30 Jun 2025",
    status:"Active",
    duration:"24 months",
  },
];

const BUDGET_HEADS = [
  { head:"Manpower",            allocated:1800000, used:1250000 },
  { head:"Equipment",           allocated:900000,  used:820000  },
  { head:"Travel & Conference", allocated:400000,  used:210000  },
  { head:"Consumables",         allocated:350000,  used:180000  },
  { head:"Contingency",         allocated:350000,  used:95000   },
  { head:"Overhead",            allocated:400000,  used:400000  },
];

const TEAM_MEMBERS = [
  { id:1, name:"Dr. Sarah Smith (PI)",    role:"Principal Investigator",  joinDate:"01 Apr 2022", status:"Active", color:T.accent  },
  { id:2, name:"Dr. Anjali Menon",        role:"Co-Investigator",         joinDate:"01 Apr 2022", status:"Active", color:T.success },
  { id:3, name:"Mr. Rohan Verma",         role:"Project Research Fellow", joinDate:"15 Jun 2022", status:"Active", color:T.purple  },
  { id:4, name:"Ms. Priya Sharma",        role:"Junior Research Fellow",  joinDate:"01 Jan 2023", status:"Active", color:T.gold    },
  { id:5, name:"Mr. Aditya Singh",        role:"Research Associate",      joinDate:"01 Mar 2024", status:"Active", color:T.info    },
];

const DELIVERABLES = [
  { id:1, title:"Federated Learning Framework (v1.0)",  type:"Software",       status:"Completed", due:"31 Mar 2023" },
  { id:2, title:"Privacy-Preserving ML Model",          type:"Research Output", status:"Completed", due:"30 Sep 2023" },
  { id:3, title:"Dataset — Healthcare (Synthetic)",     type:"Dataset",        status:"Completed", due:"31 Dec 2023" },
  { id:4, title:"Prototype Deployment on Edge Devices", type:"Prototype",      status:"In Progress",due:"31 Mar 2025" },
  { id:5, title:"Final Technical Report",               type:"Report",         status:"Pending",   due:"31 Mar 2025" },
  { id:6, title:"IP Filing — Federated Aggregation",    type:"Patent",         status:"In Progress",due:"28 Feb 2025" },
];

const REPORTS = [
  { id:1, title:"Half-Yearly Progress Report (Apr–Sep 2022)", due:"15 Oct 2022", status:"Submitted" },
  { id:2, title:"Annual Progress Report 2022-23",             due:"30 Apr 2023", status:"Submitted" },
  { id:3, title:"Half-Yearly Progress Report (Apr–Sep 2023)", due:"15 Oct 2023", status:"Submitted" },
  { id:4, title:"Annual Progress Report 2023-24",             due:"30 Apr 2024", status:"Submitted" },
  { id:5, title:"Utilisation Certificate (UC) — 2023-24",     due:"30 Jun 2024", status:"Pending"   },
  { id:6, title:"Half-Yearly Progress Report (Apr–Sep 2024)", due:"15 Oct 2024", status:"Pending"   },
];

const APPLICATIONS = [
  { id:1, title:"LLM-Based Clinical NLP for Indian Languages",  agency:"DBT",      submitted:"10 Sep 2024", status:"Under Review", feedback:null                              },
  { id:2, title:"Autonomous Drone Navigation via RL",            agency:"DRDO",     submitted:"22 Jul 2024", status:"Shortlisted",  feedback:null                              },
  { id:3, title:"Quantum ML for Optimisation Problems",          agency:"DST-SERB", submitted:"15 Apr 2024", status:"Rejected",     feedback:"Insufficient preliminary results. Reapply next cycle." },
  { id:4, title:"Smart Agriculture with Edge AI",               agency:"ICAR",     submitted:"01 Mar 2024", status:"Approved",     feedback:null                              },
];

const PENDING_ACTIONS = [
  { id:1, msg:"Submit UC for DST Project (DST-2022-441) by 30 Jun 2024",         severity:"warning" },
  { id:2, msg:"Review 3 JRF applications — deadline 20 Dec 2024",                severity:"info"    },
  { id:3, msg:"Half-Yearly report due 15 Oct 2024 — 12 days remaining",          severity:"warning" },
  { id:4, msg:"Equipment procurement sanction expires 31 Dec 2024",              severity:"warning" },
];

const APP_STATUS_META = {
  "Under Review": { color:T.accent,  bg:T.accentLight  },
  "Shortlisted":  { color:T.success, bg:T.successLight },
  "Rejected":     { color:T.danger,  bg:T.dangerLight  },
  "Approved":     { color:T.purple,  bg:T.purpleLight  },
};

const DELIVERABLE_STATUS_META = {
  "Completed":   { color:T.success, bg:T.successLight },
  "In Progress": { color:T.warning, bg:T.warningLight },
  "Pending":     { color:T.textMute,bg:"#F1F5F9"      },
};

const DELIVERABLE_TYPE_META = {
  "Software":       { color:T.accent  },
  "Research Output":{ color:T.purple  },
  "Dataset":        { color:T.info    },
  "Prototype":      { color:T.gold    },
  "Report":         { color:T.success },
  "Patent":         { color:T.danger  },
};

const fmt = (n) => Number(n||0).toLocaleString("en-IN");
const initials = (s) => (s||"?").split(" ").filter(Boolean).slice(0,2).map(w=>w[0]).join("").toUpperCase();

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

const StatusPill = ({ status, meta }) => {
  const m = meta?.[status] || { color:T.textMute, bg:"#F1F5F9" };
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

const ProgBar = ({ value, max, color=T.accent }) => {
  const pct = Math.min(100, (value / max) * 100);
  const c = pct >= 90 ? T.danger : pct >= 70 ? T.warning : color;
  return (
    <Box sx={{ height:7, borderRadius:99, bgcolor:T.border, overflow:"hidden" }}>
      <Box sx={{ height:"100%", width:`${pct}%`, borderRadius:99, bgcolor:c,
        transition:"width 1.2s ease" }} />
    </Box>
  );
};

/* ─────────────────────────────────────────
   BUDGET HORIZONTAL BAR CHART  (pure SVG)
───────────────────────────────────────── */
const BudgetChart = ({ heads }) => {
  const W = 500, ROW = 36, PAD = { l:130, r:70, t:12, b:8 };
  const H = PAD.t + heads.length * ROW + PAD.b;
  const maxVal = Math.max(...heads.map(b => b.allocated));
  const cW = W - PAD.l - PAD.r;

  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ display:"block", overflow:"visible" }}>
      {/* X grid lines */}
      {[0, 25, 50, 75, 100].map(pct => {
        const x = PAD.l + (pct / 100) * cW;
        return (
          <g key={pct}>
            <line x1={x} y1={PAD.t} x2={x} y2={H - PAD.b}
              stroke={T.border} strokeDasharray="3 3" strokeWidth={1} />
          </g>
        );
      })}

      {heads.map((b, i) => {
        const y     = PAD.t + i * ROW;
        const alloW = (b.allocated / maxVal) * cW;
        const usedW = (b.used      / maxVal) * cW;
        const pct   = Math.round((b.used / b.allocated) * 100);
        const c     = pct >= 90 ? T.danger : pct >= 70 ? T.warning : T.accent;

        return (
          <g key={b.head}>
            {/* Label */}
            <text x={PAD.l - 8} y={y + ROW/2 + 1} textAnchor="end"
              fontSize={11} fill={T.textSub} fontFamily={fBody}
              dominantBaseline="middle">{b.head}</text>

            {/* Allocated bar (background) */}
            <rect x={PAD.l} y={y + 8} width={alloW} height={ROW - 20}
              rx={4} fill={T.border} />

            {/* Used bar */}
            <rect x={PAD.l} y={y + 8} width={usedW} height={ROW - 20}
              rx={4} fill={c} opacity={0.85} />

            {/* % label */}
            <text x={PAD.l + alloW + 7} y={y + ROW/2 + 1}
              fontSize={10} fill={c} fontFamily={fBody}
              fontWeight="700" dominantBaseline="middle">{pct}%</text>
          </g>
        );
      })}
    </svg>
  );
};

/* ═════════════════════════════════════════════
   MAIN COMPONENT
═════════════════════════════════════════════ */
const GrantsView = () => {
  const [mainTab,          setMainTab]          = useState(0);
  const [selectedProject,  setSelectedProject]  = useState(PROJECTS[0].id);
  const [projectTab,       setProjectTab]       = useState(0);
  const [applications,     setApplications]     = useState(APPLICATIONS);
  const [reports,          setReports]          = useState(REPORTS);
  const [actions,          setActions]          = useState(PENDING_ACTIONS);
  const [addAppOpen,       setAddAppOpen]        = useState(false);
  const [newApp, setNewApp] = useState({ title:"", agency:"", submitted:"", status:"Under Review" });
  const [snack, setSnack] = useState({ open:false, msg:"", severity:"success" });

  const toast = (msg, severity="success") => setSnack({ open:true, msg, severity });

  const project = PROJECTS.find(p => p.id === selectedProject) || PROJECTS[0];
  const totalGranted = PROJECTS.reduce((s, p) => s + p.sanctionedAmt, 0);

  /* Add application */
  const handleAddApp = () => {
    if (!newApp.title || !newApp.agency) { toast("Title and agency required.", "error"); return; }
    const today = new Date().toLocaleDateString("en-IN",{ day:"2-digit", month:"short", year:"numeric" });
    const id = Math.max(...applications.map(a => a.id), 0) + 1;
    setApplications(p => [{ id, ...newApp, submitted:newApp.submitted||today, feedback:null }, ...p]);
    setNewApp({ title:"", agency:"", submitted:"", status:"Under Review" });
    setAddAppOpen(false);
    toast("Application added to tracker.");
  };

  /* Submit report */
  const handleSubmitReport = (id) => {
    setReports(p => p.map(r => r.id === id ? { ...r, status:"Submitted" } : r));
    toast("Report submitted successfully.");
  };

  /* Dismiss action */
  const dismissAction = (id) => setActions(p => p.filter(a => a.id !== id));

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
            Faculty Portal · Research
          </Typography>
          <Typography sx={{ fontFamily:fHead, fontWeight:700, fontSize:"1.5rem", color:T.text }}>
            Grants &amp; Research Projects
          </Typography>
          <Typography sx={{ fontFamily:fBody, fontSize:"0.82rem", color:T.textSub, mt:0.3 }}>
            Dr. Sarah Smith &nbsp;·&nbsp; Department of Computer Science
          </Typography>
        </Box>
        <Button size="small" variant="contained"
          startIcon={<Add sx={{ fontSize:15 }} />}
          onClick={() => { setAddAppOpen(true); setMainTab(2); }}
          sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.76rem", textTransform:"none",
            borderRadius:"8px", bgcolor:T.accent, boxShadow:"none", mt:0.5,
            "&:hover":{ bgcolor:"#4F46E5", boxShadow:"none" } }}>
          New Application
        </Button>
      </Box>

      {/* ── Stat strip ── */}
      <Grid container spacing={2} mb={3} className="fu1">
        {[
          { label:"Total Grants",    value:`₹${fmt(Math.round(totalGranted/100000))}L`, color:T.accent,  bg:T.accentLight,  Icon:AccountBalance  },
          { label:"Active Projects", value:PROJECTS.length,                              color:T.success, bg:T.successLight, Icon:Science         },
          { label:"Applications",    value:applications.length,                          color:T.purple,  bg:T.purpleLight,  Icon:Assignment      },
          { label:"Pending Actions", value:actions.length,                               color:T.warning, bg:T.warningLight, Icon:Notifications   },
        ].map((s, i) => (
          <Grid item xs={6} md={3} key={i}>
            <SCard hover sx={{ p:2.2 }}>
              <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                <Box>
                  <SLabel>{s.label}</SLabel>
                  <Typography sx={{ fontFamily:fMono, fontWeight:700,
                    fontSize:"1.5rem", color:s.color, lineHeight:1.1 }}>{s.value}</Typography>
                </Box>
                <Box sx={{ p:0.9, borderRadius:"9px", bgcolor:s.bg }}>
                  <s.Icon sx={{ fontSize:18, color:s.color }} />
                </Box>
              </Box>
            </SCard>
          </Grid>
        ))}
      </Grid>

      {/* ── Main Card ── */}
      <SCard sx={{ overflow:"hidden" }} className="fu2">

        {/* Main tab bar */}
        <Box sx={{ borderBottom:`1px solid ${T.border}`, bgcolor:"#FAFBFD" }}>
          <Tabs value={mainTab} onChange={(_, v) => setMainTab(v)} variant="scrollable"
            scrollButtons="auto" sx={{
              px:1,
              "& .MuiTabs-indicator":{ bgcolor:T.accent, height:"2.5px",
                borderRadius:"2px 2px 0 0" },
              "& .MuiTab-root":{ fontFamily:fBody, fontWeight:600, fontSize:"0.78rem",
                textTransform:"none", color:T.textMute, minHeight:52,
                "&.Mui-selected":{ color:T.accent } }
            }}>
            <Tab icon={<TrendingUp sx={{ fontSize:15 }} />}      iconPosition="start" label="Overview & Alerts" />
            <Tab icon={<AccountBalance sx={{ fontSize:15 }} />}  iconPosition="start" label="Active Projects" />
            <Tab icon={<Timeline sx={{ fontSize:15 }} />}        iconPosition="start" label="Application Tracker" />
          </Tabs>
        </Box>

        <Box sx={{ p:3 }}>

          {/* ══════════════════════════════════════
              TAB 0 — OVERVIEW & ALERTS
          ══════════════════════════════════════ */}
          {mainTab === 0 && (
            <Grid container spacing={3}>

              {/* Opportunities */}
              <Grid item xs={12} md={8}>
                <Box mb={2}>
                  <Typography sx={{ fontFamily:fHead, fontWeight:700,
                    fontSize:"0.96rem", color:T.text }}>Upcoming Funding Opportunities</Typography>
                  <Typography sx={{ fontFamily:fBody, fontSize:"0.76rem",
                    color:T.textMute, mt:0.2 }}>
                    Matching opportunities based on your research profile
                  </Typography>
                </Box>

                <Stack spacing={2}>
                  {OPPORTUNITIES.map(opp => (
                    <SCard key={opp.id} hover sx={{ p:2.5 }}>
                      <Box display="flex" justifyContent="space-between"
                        alignItems="flex-start" gap={2}>
                        <Box flex={1}>
                          <Box display="flex" alignItems="center" gap={1} mb={0.8}>
                            <Box sx={{ px:1, py:0.2, borderRadius:"5px",
                              bgcolor:T.accentLight }}>
                              <Typography sx={{ fontFamily:fBody, fontWeight:700,
                                fontSize:"0.66rem", color:T.accent }}>{opp.agency}</Typography>
                            </Box>
                            <Typography sx={{ fontFamily:fHead, fontWeight:700,
                              fontSize:"0.84rem", color:T.text }}>{opp.scheme}</Typography>
                          </Box>
                          <Box display="flex" gap={2.5}>
                            <Box>
                              <SLabel sx={{ mb:0 }}>Grant</SLabel>
                              <Typography sx={{ fontFamily:fMono, fontWeight:700,
                                fontSize:"0.8rem", color:T.success }}>{opp.grantAmount}</Typography>
                            </Box>
                            <Box>
                              <SLabel sx={{ mb:0 }}>Deadline</SLabel>
                              <Typography sx={{ fontFamily:fMono, fontWeight:700,
                                fontSize:"0.8rem", color:T.danger }}>{opp.deadline}</Typography>
                            </Box>
                            <Box>
                              <SLabel sx={{ mb:0 }}>Research Area</SLabel>
                              <Typography sx={{ fontFamily:fBody, fontSize:"0.78rem",
                                color:T.textSub }}>{opp.area}</Typography>
                            </Box>
                          </Box>
                        </Box>
                        <Box sx={{ textAlign:"right", flexShrink:0 }}>
                          <Box sx={{ px:1.1, py:0.3, borderRadius:"99px",
                            bgcolor: opp.match==="High" ? T.successLight : T.warningLight,
                            mb:1 }}>
                            <Typography sx={{ fontFamily:fBody, fontWeight:700,
                              fontSize:"0.69rem",
                              color: opp.match==="High" ? T.success : T.warning }}>
                              {opp.match} Match
                            </Typography>
                          </Box>
                          <Button size="small" variant="outlined"
                            endIcon={<ArrowForward sx={{ fontSize:12 }} />}
                            onClick={() => toast(`Opening call: ${opp.scheme}`)}
                            sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.7rem",
                              textTransform:"none", borderRadius:"7px",
                              borderColor:T.border, color:T.textSub,
                              "&:hover":{ borderColor:T.accent, color:T.accent } }}>
                            View Call
                          </Button>
                        </Box>
                      </Box>
                    </SCard>
                  ))}
                </Stack>
              </Grid>

              {/* Right sidebar */}
              <Grid item xs={12} md={4}>
                {/* Total grants card */}
                <SCard sx={{ p:2.8, mb:2,
                  background:`linear-gradient(135deg, ${T.accent} 0%, #4F46E5 100%)` }}>
                  <SLabel sx={{ color:"rgba(255,255,255,0.7)" }}>Total Active Grants</SLabel>
                  <Typography sx={{ fontFamily:fMono, fontWeight:700,
                    fontSize:"2.2rem", color:"#fff", lineHeight:1.1 }}>
                    ₹{fmt(Math.round(totalGranted/100000))}L
                  </Typography>
                  <Typography sx={{ fontFamily:fBody, fontSize:"0.75rem",
                    color:"rgba(255,255,255,0.75)", mt:0.5 }}>
                    Across {PROJECTS.length} active projects
                  </Typography>
                </SCard>

                {/* Pending actions */}
                <SCard sx={{ overflow:"hidden" }}>
                  <Box sx={{ px:2.2, py:1.8, borderBottom:`1px solid ${T.border}`,
                    bgcolor:"#FAFBFD", display:"flex", alignItems:"center", gap:1 }}>
                    <Box sx={{ p:0.6, borderRadius:"7px",
                      bgcolor:T.warningLight, color:T.warning }}>
                      <Notifications sx={{ fontSize:14 }} />
                    </Box>
                    <Typography sx={{ fontFamily:fHead, fontWeight:700,
                      fontSize:"0.82rem", color:T.text }}>Pending Actions</Typography>
                    <Box sx={{ ml:"auto", px:0.9, py:0.2, borderRadius:"99px",
                      bgcolor:T.warningLight }}>
                      <Typography sx={{ fontFamily:fMono, fontWeight:700,
                        fontSize:"0.68rem", color:T.warning }}>{actions.length}</Typography>
                    </Box>
                  </Box>
                  <Stack sx={{ p:1.5 }} spacing={1}>
                    {actions.length === 0 && (
                      <Typography sx={{ fontFamily:fBody, fontSize:"0.76rem",
                        color:T.textMute, p:1 }}>All clear — no pending actions.</Typography>
                    )}
                    {actions.map(a => (
                      <Box key={a.id} sx={{
                        p:1.3, borderRadius:"8px",
                        bgcolor: a.severity==="warning" ? T.warningLight : T.infoLight,
                        border:`1px solid ${a.severity==="warning" ? T.warning : T.info}20`,
                        display:"flex", gap:1, alignItems:"flex-start"
                      }}>
                        {a.severity === "warning"
                          ? <Warning sx={{ fontSize:13, color:T.warning, flexShrink:0, mt:0.1 }} />
                          : <Notifications sx={{ fontSize:13, color:T.info, flexShrink:0, mt:0.1 }} />
                        }
                        <Typography sx={{ fontFamily:fBody, fontSize:"0.73rem",
                          color:T.textSub, lineHeight:1.6, flex:1 }}>{a.msg}</Typography>
                        <Box onClick={() => dismissAction(a.id)}
                          sx={{ cursor:"pointer", color:T.textMute, flexShrink:0,
                            "&:hover":{ color:T.danger } }}>
                          <Close sx={{ fontSize:13 }} />
                        </Box>
                      </Box>
                    ))}
                  </Stack>
                </SCard>
              </Grid>
            </Grid>
          )}

          {/* ══════════════════════════════════════
              TAB 1 — ACTIVE PROJECTS
          ══════════════════════════════════════ */}
          {mainTab === 1 && (
            <Box>
              {/* Project selector */}
              <SCard sx={{ p:2, mb:2.5, bgcolor:"#FAFBFD",
                display:"flex", alignItems:"center", gap:2, flexWrap:"wrap" }}>
                <Typography sx={{ fontFamily:fBody, fontWeight:700,
                  fontSize:"0.8rem", color:T.textSub, whiteSpace:"nowrap" }}>
                  Project:
                </Typography>
                <Box sx={{ minWidth:320 }}>
                  <DInput select value={selectedProject}
                    onChange={e => setSelectedProject(e.target.value)}
                    sx={{ "& .MuiOutlinedInput-root":{ bgcolor:T.surface } }}>
                    {PROJECTS.map(p => (
                      <MenuItem key={p.id} value={p.id}
                        sx={{ fontFamily:fBody, fontSize:"0.82rem" }}>
                        {p.id} — {p.title}
                      </MenuItem>
                    ))}
                  </DInput>
                </Box>
                <Box display="flex" alignItems="center" gap={0.7}
                  sx={{ px:1.2, py:0.45, borderRadius:"99px",
                    bgcolor:T.successLight, border:`1px solid ${T.success}20` }}>
                  <Box sx={{ width:6, height:6, borderRadius:"50%", bgcolor:T.success }} />
                  <Typography sx={{ fontFamily:fBody, fontWeight:700,
                    fontSize:"0.71rem", color:T.success }}>Active</Typography>
                </Box>
                <Box sx={{ ml:"auto" }}>
                  <Typography sx={{ fontFamily:fMono, fontWeight:700,
                    fontSize:"0.82rem", color:T.accent }}>
                    ₹{fmt(Math.round(project.sanctionedAmt/100000))}L sanctioned
                  </Typography>
                  <Typography sx={{ fontFamily:fBody, fontSize:"0.69rem",
                    color:T.textMute }}>
                    {project.startDate} – {project.endDate} &nbsp;·&nbsp; {project.agency}
                  </Typography>
                </Box>
              </SCard>

              {/* Sub-tabs */}
              <Box sx={{ borderBottom:`1px solid ${T.border}`, mb:3 }}>
                <Tabs value={projectTab} onChange={(_, v) => setProjectTab(v)}
                  variant="fullWidth" sx={{
                    "& .MuiTabs-indicator":{ bgcolor:T.accent, height:"2px" },
                    "& .MuiTab-root":{ fontFamily:fBody, fontWeight:600, fontSize:"0.76rem",
                      textTransform:"none", color:T.textMute, minHeight:44,
                      "&.Mui-selected":{ color:T.accent } }
                  }}>
                  <Tab label="Financials"      />
                  <Tab label="Team"            />
                  <Tab label="Deliverables"    />
                  <Tab label="Reporting & UC"  />
                </Tabs>
              </Box>

              {/* ── Sub-tab 0: Financials ── */}
              {projectTab === 0 && (
                <Grid container spacing={3}>
                  <Grid item xs={12} md={7}>
                    <Box mb={1.5}>
                      <Typography sx={{ fontFamily:fHead, fontWeight:700,
                        fontSize:"0.88rem", color:T.text }}>Budget vs Actuals</Typography>
                      <Typography sx={{ fontFamily:fBody, fontSize:"0.74rem",
                        color:T.textMute, mt:0.2 }}>
                        Horizontal bars: grey = allocated, colour = spent
                      </Typography>
                    </Box>
                    <BudgetChart heads={BUDGET_HEADS} />
                  </Grid>

                  <Grid item xs={12} md={5}>
                    <Box display="flex" justifyContent="space-between"
                      alignItems="center" mb={2}>
                      <Typography sx={{ fontFamily:fHead, fontWeight:700,
                        fontSize:"0.88rem", color:T.text }}>Expenditure Summary</Typography>
                      <Button size="small" variant="outlined"
                        startIcon={<Add sx={{ fontSize:13 }} />}
                        onClick={() => toast("Expense logging form opened.")}
                        sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.72rem",
                          textTransform:"none", borderRadius:"7px",
                          borderColor:T.accent, color:T.accent,
                          "&:hover":{ bgcolor:T.accentLight } }}>
                        Log Expense
                      </Button>
                    </Box>
                    <Stack spacing={2}>
                      {BUDGET_HEADS.map((head, i) => {
                        const pct = Math.round((head.used / head.allocated) * 100);
                        return (
                          <Box key={i}>
                            <Box display="flex" justifyContent="space-between"
                              alignItems="center" mb={0.6}>
                              <Typography sx={{ fontFamily:fBody, fontWeight:700,
                                fontSize:"0.78rem", color:T.text }}>{head.head}</Typography>
                              <Box sx={{ px:0.9, py:0.2, borderRadius:"99px",
                                bgcolor: pct>=90 ? T.dangerLight : pct>=70 ? T.warningLight : T.successLight }}>
                                <Typography sx={{ fontFamily:fMono, fontWeight:700,
                                  fontSize:"0.64rem",
                                  color: pct>=90 ? T.danger : pct>=70 ? T.warning : T.success }}>
                                  {pct}%
                                </Typography>
                              </Box>
                            </Box>
                            <ProgBar value={head.used} max={head.allocated} color={T.accent} />
                            <Typography sx={{ fontFamily:fMono, fontSize:"0.69rem",
                              color:T.textMute, mt:0.4 }}>
                              ₹{fmt(head.used)} / ₹{fmt(head.allocated)}
                            </Typography>
                          </Box>
                        );
                      })}
                    </Stack>
                  </Grid>
                </Grid>
              )}

              {/* ── Sub-tab 1: Team ── */}
              {projectTab === 1 && (
                <Box>
                  <Box display="flex" justifyContent="space-between"
                    alignItems="center" mb={2.5}>
                    <Box>
                      <Typography sx={{ fontFamily:fHead, fontWeight:700,
                        fontSize:"0.88rem", color:T.text }}>Project Team</Typography>
                      <Typography sx={{ fontFamily:fBody, fontSize:"0.74rem",
                        color:T.textMute, mt:0.2 }}>
                        {TEAM_MEMBERS.length} members · {TEAM_MEMBERS.filter(m=>m.status==="Active").length} active
                      </Typography>
                    </Box>
                    <Button size="small" variant="outlined"
                      startIcon={<Add sx={{ fontSize:13 }} />}
                      onClick={() => toast("Team member addition request submitted.")}
                      sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.72rem",
                        textTransform:"none", borderRadius:"7px",
                        borderColor:T.accent, color:T.accent,
                        "&:hover":{ bgcolor:T.accentLight } }}>
                      Add Member
                    </Button>
                  </Box>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TH>Name</TH>
                        <TH>Role</TH>
                        <TH>Join Date</TH>
                        <TH>Status</TH>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {TEAM_MEMBERS.map(m => (
                        <TableRow key={m.id} className="row-h">
                          <TD sx={{ minWidth:200 }}>
                            <Box display="flex" alignItems="center" gap={1.3}>
                              <Avatar sx={{ width:32, height:32,
                                bgcolor:`${m.color}15`, color:m.color,
                                fontFamily:fHead, fontSize:"0.62rem", fontWeight:700,
                                border:`1.5px solid ${m.color}30` }}>
                                {initials(m.name)}
                              </Avatar>
                              <Typography sx={{ fontFamily:fBody, fontWeight:700,
                                fontSize:"0.81rem", color:T.text }}>{m.name}</Typography>
                            </Box>
                          </TD>
                          <TD>
                            <Typography sx={{ fontFamily:fBody, fontSize:"0.78rem",
                              color:T.textSub }}>{m.role}</Typography>
                          </TD>
                          <TD>
                            <Typography sx={{ fontFamily:fMono, fontSize:"0.76rem",
                              color:T.textMute }}>{m.joinDate}</Typography>
                          </TD>
                          <TD>
                            <Box display="flex" alignItems="center" gap={0.5}
                              sx={{ px:1.1, py:0.3, borderRadius:"99px",
                                bgcolor:T.successLight, width:"fit-content" }}>
                              <Box sx={{ width:5, height:5, borderRadius:"50%",
                                bgcolor:T.success }} />
                              <Typography sx={{ fontFamily:fBody, fontWeight:700,
                                fontSize:"0.69rem", color:T.success }}>{m.status}</Typography>
                            </Box>
                          </TD>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Box>
              )}

              {/* ── Sub-tab 2: Deliverables ── */}
              {projectTab === 2 && (
                <Box>
                  <Box mb={2.5}>
                    <Typography sx={{ fontFamily:fHead, fontWeight:700,
                      fontSize:"0.88rem", color:T.text }}>Project Deliverables</Typography>
                    <Typography sx={{ fontFamily:fBody, fontSize:"0.74rem",
                      color:T.textMute, mt:0.2 }}>
                      {DELIVERABLES.filter(d=>d.status==="Completed").length} completed ·
                      {" "}{DELIVERABLES.filter(d=>d.status==="In Progress").length} in progress ·
                      {" "}{DELIVERABLES.filter(d=>d.status==="Pending").length} pending
                    </Typography>
                  </Box>
                  <Grid container spacing={2}>
                    {DELIVERABLES.map(item => {
                      const sm = DELIVERABLE_STATUS_META[item.status] || { color:T.textMute, bg:"#F1F5F9" };
                      const tm = DELIVERABLE_TYPE_META[item.type]   || { color:T.textMute };
                      return (
                        <Grid item xs={12} md={6} key={item.id}>
                          <SCard sx={{ p:2.3,
                            borderLeft:`3.5px solid ${sm.color}` }}>
                            <Box display="flex" alignItems="flex-start" gap={1.5}>
                              <Box sx={{ p:0.65, borderRadius:"7px",
                                bgcolor:`${tm.color}15`, color:tm.color, flexShrink:0 }}>
                                <Description sx={{ fontSize:14 }} />
                              </Box>
                              <Box flex={1}>
                                <Typography sx={{ fontFamily:fBody, fontWeight:700,
                                  fontSize:"0.82rem", color:T.text,
                                  mb:0.4 }}>{item.title}</Typography>
                                <Box display="flex" gap={1} alignItems="center" flexWrap="wrap">
                                  <Box sx={{ px:0.9, py:0.18, borderRadius:"5px",
                                    bgcolor:`${tm.color}15` }}>
                                    <Typography sx={{ fontFamily:fBody, fontWeight:700,
                                      fontSize:"0.63rem", color:tm.color }}>{item.type}</Typography>
                                  </Box>
                                  <Typography sx={{ fontFamily:fMono, fontSize:"0.69rem",
                                    color:T.textMute }}>Due {item.due}</Typography>
                                </Box>
                              </Box>
                              <Box sx={{ px:1, py:0.3, borderRadius:"99px",
                                bgcolor:sm.bg, flexShrink:0 }}>
                                <Typography sx={{ fontFamily:fBody, fontWeight:700,
                                  fontSize:"0.66rem", color:sm.color }}>{item.status}</Typography>
                              </Box>
                            </Box>
                          </SCard>
                        </Grid>
                      );
                    })}
                  </Grid>
                </Box>
              )}

              {/* ── Sub-tab 3: Reporting & UC ── */}
              {projectTab === 3 && (
                <Box>
                  <Box mb={2.5}>
                    <Typography sx={{ fontFamily:fHead, fontWeight:700,
                      fontSize:"0.88rem", color:T.text }}>Reporting & Utilisation Certificates</Typography>
                    <Typography sx={{ fontFamily:fBody, fontSize:"0.74rem",
                      color:T.textMute, mt:0.2 }}>
                      {reports.filter(r=>r.status==="Submitted").length} submitted ·
                      {" "}{reports.filter(r=>r.status==="Pending").length} pending
                    </Typography>
                  </Box>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TH>Report Type</TH>
                        <TH>Due Date</TH>
                        <TH>Status</TH>
                        <TH align="right">Action</TH>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {reports.map(rpt => (
                        <TableRow key={rpt.id} className="row-h">
                          <TD sx={{ minWidth:260 }}>
                            <Box display="flex" alignItems="center" gap={1}>
                              <Box sx={{ p:0.55, borderRadius:"6px",
                                bgcolor: rpt.status==="Submitted" ? T.successLight : T.warningLight,
                                color: rpt.status==="Submitted" ? T.success : T.warning }}>
                                <Assignment sx={{ fontSize:13 }} />
                              </Box>
                              <Typography sx={{ fontFamily:fBody, fontWeight:700,
                                fontSize:"0.8rem", color:T.text }}>{rpt.title}</Typography>
                            </Box>
                          </TD>
                          <TD>
                            <Typography sx={{ fontFamily:fMono, fontSize:"0.77rem",
                              color: rpt.status==="Pending" ? T.danger : T.textMute }}>
                              {rpt.due}
                            </Typography>
                          </TD>
                          <TD>
                            <StatusPill
                              status={rpt.status}
                              meta={{ "Submitted":{ color:T.success, bg:T.successLight },
                                      "Pending":  { color:T.warning, bg:T.warningLight } }}
                            />
                          </TD>
                          <TD align="right">
                            {rpt.status === "Submitted" ? (
                              <Button size="small" variant="outlined"
                                startIcon={<FileDownload sx={{ fontSize:12 }} />}
                                onClick={() => toast(`Downloading: ${rpt.title}`)}
                                sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.7rem",
                                  textTransform:"none", borderRadius:"7px",
                                  borderColor:T.border, color:T.textSub,
                                  "&:hover":{ borderColor:T.accent, color:T.accent } }}>
                                Download
                              </Button>
                            ) : (
                              <Button size="small" variant="contained"
                                startIcon={<Assignment sx={{ fontSize:12 }} />}
                                onClick={() => handleSubmitReport(rpt.id)}
                                sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.7rem",
                                  textTransform:"none", borderRadius:"7px",
                                  bgcolor:T.accent, boxShadow:"none",
                                  "&:hover":{ bgcolor:"#4F46E5", boxShadow:"none" } }}>
                                Submit
                              </Button>
                            )}
                          </TD>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Box>
              )}
            </Box>
          )}

          {/* ══════════════════════════════════════
              TAB 2 — APPLICATION TRACKER
          ══════════════════════════════════════ */}
          {mainTab === 2 && (
            <Box>
              <Box display="flex" justifyContent="space-between"
                alignItems="center" mb={2.5}>
                <Box>
                  <Typography sx={{ fontFamily:fHead, fontWeight:700,
                    fontSize:"0.96rem", color:T.text }}>My Grant Applications</Typography>
                  <Typography sx={{ fontFamily:fBody, fontSize:"0.76rem",
                    color:T.textMute, mt:0.2 }}>
                    {applications.length} applications ·{" "}
                    {applications.filter(a=>a.status==="Approved"||a.status==="Shortlisted").length} active
                  </Typography>
                </Box>
                <Button size="small" variant="contained"
                  startIcon={<Add sx={{ fontSize:14 }} />}
                  onClick={() => setAddAppOpen(v => !v)}
                  sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.76rem",
                    textTransform:"none", borderRadius:"8px",
                    bgcolor:T.accent, boxShadow:"none",
                    "&:hover":{ bgcolor:"#4F46E5", boxShadow:"none" } }}>
                  New Application
                </Button>
              </Box>

              {/* Inline add form */}
              {addAppOpen && (
                <SCard sx={{ p:2.5, mb:2.5,
                  borderLeft:`4px solid ${T.accent}` }}>
                  <Typography sx={{ fontFamily:fHead, fontWeight:700,
                    fontSize:"0.86rem", color:T.text, mb:2 }}>New Application Entry</Typography>
                  <Grid container spacing={1.5}>
                    <Grid item xs={12} md={5}>
                      <SLabel sx={{ mb:0.6 }}>Project Title *</SLabel>
                      <DInput value={newApp.title}
                        onChange={e => setNewApp(p => ({ ...p, title:e.target.value }))}
                        placeholder="Full title of the proposed project" />
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <SLabel sx={{ mb:0.6 }}>Funding Agency *</SLabel>
                      <DInput value={newApp.agency}
                        onChange={e => setNewApp(p => ({ ...p, agency:e.target.value }))}
                        placeholder="e.g. DST-SERB, ICMR" />
                    </Grid>
                    <Grid item xs={12} md={2}>
                      <SLabel sx={{ mb:0.6 }}>Submitted On</SLabel>
                      <DInput type="date" value={newApp.submitted}
                        onChange={e => setNewApp(p => ({ ...p, submitted:e.target.value }))} />
                    </Grid>
                    <Grid item xs={12} md={2}>
                      <SLabel sx={{ mb:0.6 }}>Status</SLabel>
                      <DInput select value={newApp.status}
                        onChange={e => setNewApp(p => ({ ...p, status:e.target.value }))}>
                        {["Under Review","Shortlisted","Approved","Rejected"].map(s => (
                          <MenuItem key={s} value={s}
                            sx={{ fontFamily:fBody, fontSize:"0.82rem" }}>{s}</MenuItem>
                        ))}
                      </DInput>
                    </Grid>
                  </Grid>
                  <Box display="flex" gap={1} mt={2} justifyContent="flex-end">
                    <Button size="small" variant="outlined"
                      onClick={() => setAddAppOpen(false)}
                      sx={{ fontFamily:fBody, fontWeight:600, fontSize:"0.76rem",
                        textTransform:"none", borderRadius:"8px",
                        borderColor:T.border, color:T.textSub }}>
                      Cancel
                    </Button>
                    <Button size="small" variant="contained"
                      onClick={handleAddApp}
                      sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.76rem",
                        textTransform:"none", borderRadius:"8px",
                        bgcolor:T.accent, boxShadow:"none",
                        "&:hover":{ bgcolor:"#4F46E5", boxShadow:"none" } }}>
                      Add Application
                    </Button>
                  </Box>
                </SCard>
              )}

              <Table>
                <TableHead>
                  <TableRow>
                    <TH>Project Title</TH>
                    <TH>Agency</TH>
                    <TH>Submitted</TH>
                    <TH>Status</TH>
                    <TH>Feedback</TH>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {applications.map(app => (
                    <TableRow key={app.id} className="row-h">
                      <TD sx={{ minWidth:220 }}>
                        <Box display="flex" alignItems="center" gap={1.1}>
                          <Box sx={{ p:0.6, borderRadius:"6px",
                            bgcolor: APP_STATUS_META[app.status]?.bg || "#F1F5F9",
                            color:   APP_STATUS_META[app.status]?.color || T.textMute,
                            flexShrink:0 }}>
                            <Assignment sx={{ fontSize:13 }} />
                          </Box>
                          <Typography sx={{ fontFamily:fBody, fontWeight:700,
                            fontSize:"0.81rem", color:T.text }}>{app.title}</Typography>
                        </Box>
                      </TD>
                      <TD>
                        <Box sx={{ px:1, py:0.2, borderRadius:"5px",
                          bgcolor:T.accentLight, display:"inline-block" }}>
                          <Typography sx={{ fontFamily:fBody, fontWeight:700,
                            fontSize:"0.68rem", color:T.accent }}>{app.agency}</Typography>
                        </Box>
                      </TD>
                      <TD>
                        <Typography sx={{ fontFamily:fMono, fontSize:"0.77rem",
                          color:T.textMute }}>{app.submitted}</Typography>
                      </TD>
                      <TD>
                        <StatusPill status={app.status} meta={APP_STATUS_META} />
                      </TD>
                      <TD sx={{ maxWidth:220 }}>
                        {app.feedback ? (
                          <Box sx={{ display:"flex", gap:0.6, alignItems:"flex-start" }}>
                            <Warning sx={{ fontSize:12, color:T.danger, flexShrink:0, mt:0.15 }} />
                            <Typography sx={{ fontFamily:fBody, fontSize:"0.74rem",
                              color:T.danger, lineHeight:1.55 }}>
                              {app.feedback}
                            </Typography>
                          </Box>
                        ) : (
                          <Typography sx={{ fontFamily:fBody, fontSize:"0.74rem",
                            color:T.textMute }}>—</Typography>
                        )}
                      </TD>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          )}
        </Box>
      </SCard>

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

export default GrantsView;