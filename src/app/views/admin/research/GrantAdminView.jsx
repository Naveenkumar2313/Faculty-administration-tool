import React, { useState } from "react";
import {
  Box, Grid, Typography, Button, Table, TableBody, TableCell,
  TableHead, TableRow, IconButton, Tooltip, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, MenuItem, Divider,
  Stack, Avatar, Snackbar, Alert, InputAdornment, Tabs, Tab,
  Chip, LinearProgress
} from "@mui/material";
import {
  TrendingUp, Assignment, AttachMoney, CheckCircle, Cancel,
  Visibility, NotificationsActive, Description, Close, Download,
  Search, Add, Warning, InfoOutlined, ReceiptLong, Send,
  AccountBalance, Science, MonetizationOn, FolderOpen,
  ErrorOutline, ArrowForward, BarChart, Edit
} from "@mui/icons-material";

/* ── Design Tokens ── */
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

const Fonts = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Sora:wght@600;700&family=Nunito:wght@400;500;600;700&family=JetBrains+Mono:wght@500;600&display=swap');
    * { box-sizing:border-box; }
    @keyframes fadeUp  { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:none} }
    @keyframes pulse   { 0%,100%{opacity:1} 50%{opacity:.4} }
    .fu  { animation: fadeUp 0.3s ease both; }
    .fu1 { animation: fadeUp 0.3s .06s ease both; }
    .fu2 { animation: fadeUp 0.3s .12s ease both; }
    .fu3 { animation: fadeUp 0.3s .18s ease both; }
    .row-h:hover { background:#F9FAFB !important; transition:background .15s; }
    .blink { animation: pulse 2s infinite; }
    .card-h { transition: box-shadow 0.2s, transform 0.2s; }
    .card-h:hover { box-shadow: 0 6px 24px rgba(99,102,241,0.10); transform: translateY(-2px); }
  `}</style>
);

/* ── Mock Data ── */
const PROJECTS_INIT = [
  {
    id:"PRJ-2024-01", pi:"Dr. Sarah Smith",   piAvatar:"SS", dept:"CSE",
    agency:"DST-SERB",     budget:2500000, used:1800000, duration:"2024–2027",
    status:"On Track",  reportStatus:"UC Pending",
    objectives:"Development of energy-efficient deep learning models for edge devices.",
    milestones:[
      { label:"Phase 1 — Literature Survey", done:true  },
      { label:"Phase 2 — Prototype Build",   done:true  },
      { label:"Phase 3 — Testing & Eval",    done:false },
      { label:"Phase 4 — Final Report",      done:false },
    ],
    transactions:[
      { date:"2024-08-10", head:"Equipment",  amount:800000,  status:"Cleared" },
      { date:"2025-01-15", head:"Travel",     amount:120000,  status:"Cleared" },
      { date:"2025-06-20", head:"Manpower",   amount:880000,  status:"Cleared" },
    ],
  },
  {
    id:"PRJ-2025-05", pi:"Prof. Rajan Kumar", piAvatar:"RK", dept:"Mech",
    agency:"AICTE-RPS",    budget:1500000, used:200000,  duration:"2025–2026",
    status:"Active",    reportStatus:"All Clear",
    objectives:"Smart manufacturing integration using Industry 4.0 principles.",
    milestones:[
      { label:"Phase 1 — Requirement Analysis", done:true  },
      { label:"Phase 2 — Implementation",       done:false },
      { label:"Phase 3 — Evaluation",           done:false },
    ],
    transactions:[
      { date:"2025-03-05", head:"Equipment",  amount:200000,  status:"Cleared" },
    ],
  },
  {
    id:"PRJ-2023-12", pi:"Dr. Emily Davis",   piAvatar:"ED", dept:"Civil",
    agency:"UGC-STRIDE",   budget:5000000, used:4800000, duration:"2023–2026",
    status:"Critical",  reportStatus:"Final Report Due",
    objectives:"Structural health monitoring of bridges using IoT sensors and ML analytics.",
    milestones:[
      { label:"Phase 1 — Data Collection",      done:true  },
      { label:"Phase 2 — Model Training",       done:true  },
      { label:"Phase 3 — Field Deployment",     done:true  },
      { label:"Phase 4 — Final Report",         done:false },
    ],
    transactions:[
      { date:"2023-09-10", head:"Equipment",  amount:2000000, status:"Cleared" },
      { date:"2024-02-20", head:"Manpower",   amount:1500000, status:"Cleared" },
      { date:"2024-10-05", head:"Materials",  amount:1000000, status:"Cleared" },
      { date:"2025-01-18", head:"Overhead",   amount:300000,  status:"Pending" },
    ],
  },
];

const APPROVALS_INIT = [
  {
    id:101, project:"PRJ-2024-01", pi:"Dr. Sarah Smith",   piAvatar:"SS",
    type:"Utilization Certificate (UC)", amount:1800000,
    date:"2026-02-01", status:"Pending Review",
    agency:"DST-SERB",  doc:"UC_DST_2025_Batch1.pdf",
  },
  {
    id:102, project:"PRJ-2025-05", pi:"Prof. Rajan Kumar", piAvatar:"RK",
    type:"Fund Release Request",          amount:500000,
    date:"2026-01-28", status:"Pending Review",
    agency:"AICTE-RPS", doc:"FundRelease_AICTE_Feb2026.pdf",
  },
];

const AGENCY_COLOR = {
  "DST-SERB":    { color:T.accent,   bg:T.accentLight   },
  "AICTE-RPS":   { color:T.purple,   bg:T.purpleLight   },
  "UGC-STRIDE":  { color:T.success,  bg:T.successLight  },
  "ICMR":        { color:T.warning,  bg:T.warningLight  },
};

const STATUS_COLOR = {
  "Active":      { color:T.success,  bg:T.successLight  },
  "On Track":    { color:T.accent,   bg:T.accentLight   },
  "Critical":    { color:T.danger,   bg:T.dangerLight   },
  "Completed":   { color:T.textMute, bg:"#F1F5F9"       },
};

const REPORT_COLOR = {
  "All Clear":       { color:T.success,  bg:T.successLight },
  "UC Pending":      { color:T.warning,  bg:T.warningLight },
  "Final Report Due":{ color:T.danger,   bg:T.dangerLight  },
};

/* ── Helpers ── */
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

const StatusPill = ({ status, map }) => {
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

const AgencyBadge = ({ agency }) => {
  const s = AGENCY_COLOR[agency] || { color:T.textMute, bg:"#F1F5F9" };
  return (
    <Box sx={{ px:1, py:0.3, borderRadius:"6px", bgcolor:s.bg, display:"inline-block" }}>
      <Typography sx={{ fontFamily:fMono, fontSize:"0.68rem", fontWeight:700, color:s.color }}>
        {agency}
      </Typography>
    </Box>
  );
};

const DInput = (props) => (
  <TextField size="small" fullWidth {...props} sx={{
    "& .MuiOutlinedInput-root":{
      borderRadius:"8px", fontFamily:fBody, fontSize:"0.82rem", bgcolor:T.surface,
      "& fieldset":{ borderColor:T.border },
      "&.Mui-focused fieldset":{ borderColor:T.accent },
    },
    "& .MuiInputLabel-root.Mui-focused":{ color:T.accent },
    ...props.sx
  }} />
);

const BudgetBar = ({ used, budget, compact=false }) => {
  const pct     = Math.min(Math.round((used / budget) * 100), 100);
  const isWarn  = pct > 80;
  const isDanger= pct > 95;
  const color   = isDanger ? T.danger : isWarn ? T.warning : T.accent;
  return (
    <Box>
      {!compact && (
        <Box display="flex" justifyContent="space-between" mb={0.7}>
          <Typography sx={{ fontFamily:fMono, fontSize:"0.72rem", color:T.textMute }}>
            ₹{(used/100000).toFixed(1)}L used
          </Typography>
          <Typography sx={{ fontFamily:fMono, fontSize:"0.72rem", fontWeight:700, color }}>
            {pct}%
          </Typography>
        </Box>
      )}
      <Box sx={{ height: compact ? 5 : 7, borderRadius:99, bgcolor:T.border, overflow:"hidden" }}>
        <Box sx={{
          height:"100%", width:`${pct}%`, borderRadius:99, bgcolor:color,
          transition:"width 1.2s cubic-bezier(.4,0,.2,1)"
        }} />
      </Box>
      {!compact && (
        <Box display="flex" justifyContent="space-between" mt={0.5}>
          <Typography sx={{ fontFamily:fBody, fontSize:"0.66rem", color:T.textMute }}>
            Total: ₹{(budget/100000).toFixed(1)}L
          </Typography>
          <Typography sx={{ fontFamily:fBody, fontSize:"0.66rem", fontWeight:700,
            color: budget - used < 0 ? T.danger : T.textMute }}>
            ₹{((budget - used)/100000).toFixed(1)}L remaining
          </Typography>
        </Box>
      )}
    </Box>
  );
};

/* ════════════════════════════════
   MAIN COMPONENT
════════════════════════════════ */
const GrantAdminView = () => {
  const [tabIndex, setTabIndex]         = useState(0);
  const [projects, setProjects]         = useState(PROJECTS_INIT);
  const [approvals, setApprovals]       = useState(APPROVALS_INIT);
  const [searchQ, setSearchQ]           = useState("");
  const [detailDialog, setDetailDialog] = useState(null);
  const [approvalDialog, setApprovalDialog] = useState(null);
  const [adminRemark, setAdminRemark]   = useState("");
  const [snack, setSnack]               = useState({ open:false, msg:"", severity:"success" });

  const toast = (msg, severity="success") => setSnack({ open:true, msg, severity });

  const criticalProjects = projects.filter(p => p.status === "Critical").length;
  const pendingApprovals = approvals.filter(a => a.status === "Pending Review").length;
  const totalBudget      = projects.reduce((a,p) => a + p.budget, 0);
  const totalUsed        = projects.reduce((a,p) => a + p.used, 0);

  const filteredProjects = projects.filter(p =>
    !searchQ ||
    p.id.toLowerCase().includes(searchQ.toLowerCase()) ||
    p.pi.toLowerCase().includes(searchQ.toLowerCase()) ||
    p.agency.toLowerCase().includes(searchQ.toLowerCase())
  );

  const handleApprove = () => {
    setApprovals(prev => prev.map(a =>
      a.id === approvalDialog.id ? { ...a, status:"Approved" } : a
    ));
    toast(`${approvalDialog.type} approved for ${approvalDialog.project}.`);
    setApprovalDialog(null);
  };

  const handleReject = () => {
    if (!adminRemark.trim()) { toast("Please add a remark before rejecting.", "error"); return; }
    setApprovals(prev => prev.map(a =>
      a.id === approvalDialog.id ? { ...a, status:"Rejected" } : a
    ));
    toast(`Request rejected. PI will be notified with your remark.`, "warning");
    setApprovalDialog(null);
  };

  const openApproval = (row) => {
    setApprovalDialog(row);
    setAdminRemark("");
  };

  const APPROVAL_STATUS_MAP = {
    "Pending Review": { color:T.warning, bg:T.warningLight },
    Approved:         { color:T.success, bg:T.successLight },
    Rejected:         { color:T.danger,  bg:T.dangerLight  },
  };

  const tabs = [
    { label:"Grant Monitoring",        Icon:TrendingUp,   count:0                },
    { label:"Report & Fund Approvals", Icon:Assignment,   count:pendingApprovals },
  ];

  return (
    <Box sx={{ p:3, bgcolor:T.bg, minHeight:"100vh", fontFamily:fBody }}>
      <Fonts />

      {/* ── Header ── */}
      <Box display="flex" justifyContent="space-between" alignItems="flex-start"
        mb={3} flexWrap="wrap" gap={2}>
        <Box>
          <Typography sx={{ fontFamily:fBody, fontSize:"0.72rem", fontWeight:700,
            letterSpacing:"0.1em", textTransform:"uppercase", color:T.textMute, mb:0.3 }}>
            Research &amp; Innovation · Finance Office
          </Typography>
          <Typography sx={{ fontFamily:fHead, fontWeight:700, fontSize:"1.5rem", color:T.text }}>
            Grant &amp; Project Oversight
          </Typography>
          <Typography sx={{ fontFamily:fBody, fontSize:"0.82rem", color:T.textSub, mt:0.3 }}>
            Monitor active research grants, utilisation status, and approve UC/fund release requests.
          </Typography>
        </Box>
        <Box display="flex" gap={1.5} pt={0.5} flexWrap="wrap">
          <Button size="small" variant="outlined" startIcon={<Add sx={{fontSize:15}} />}
            onClick={() => toast("Grant registration form opened.")}
            sx={{ fontFamily:fBody, fontWeight:600, fontSize:"0.76rem", textTransform:"none",
              borderRadius:"8px", borderColor:T.border, color:T.textSub,
              "&:hover":{ borderColor:T.accent, color:T.accent } }}>
            Register Grant
          </Button>
          <Button size="small" variant="outlined" startIcon={<Download sx={{fontSize:15}} />}
            onClick={() => toast("Grant portfolio report exported.")}
            sx={{ fontFamily:fBody, fontWeight:600, fontSize:"0.76rem", textTransform:"none",
              borderRadius:"8px", borderColor:T.border, color:T.textSub,
              "&:hover":{ borderColor:T.accent, color:T.accent } }}>
            Export Report
          </Button>
        </Box>
      </Box>

      {/* ── Stat Strip ── */}
      <Grid container spacing={2} mb={3}>
        {[
          { label:"Active Projects",     value:projects.length,                           sub:"Across all departments",      color:T.accent,   Icon:Science         },
          { label:"Total Grant Corpus",  value:`₹${(totalBudget/10000000).toFixed(2)}Cr`, sub:"Sanctioned this portfolio",   color:T.purple,   Icon:AccountBalance  },
          { label:"Funds Utilised",      value:`₹${(totalUsed/10000000).toFixed(2)}Cr`,  sub:`${Math.round((totalUsed/totalBudget)*100)}% of corpus`, color:T.success, Icon:MonetizationOn },
          { label:"Pending Approvals",   value:pendingApprovals,                          sub:"UCs / fund requests",         color:T.warning,  Icon:Assignment      },
        ].map((s,i) => (
          <Grid item xs={6} md={3} key={i}>
            <SCard sx={{ p:2.5 }} className={`fu${i}`}>
              <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                <Box>
                  <SLabel>{s.label}</SLabel>
                  <Typography sx={{ fontFamily:fMono, fontWeight:700, fontSize:"1.6rem",
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

      {/* Critical alert */}
      {criticalProjects > 0 && (
        <Box sx={{ display:"flex", alignItems:"center", gap:1.2, px:2.5, py:1.5, mb:3,
          borderRadius:"10px", bgcolor:T.dangerLight, border:`1px solid ${T.danger}30` }}
          className="fu">
          <Warning sx={{ fontSize:16, color:T.danger }} />
          <Typography sx={{ fontFamily:fBody, fontSize:"0.78rem", color:T.danger, fontWeight:700 }}>
            {criticalProjects} project{criticalProjects>1?"s":""} in Critical status —
            <Typography component="span" sx={{ fontFamily:fBody, fontSize:"0.78rem",
              color:T.danger, fontWeight:400, ml:0.5 }}>
              budget near exhaustion or pending mandatory reports. Immediate action required.
            </Typography>
          </Typography>
        </Box>
      )}

      {/* ── Main Card ── */}
      <SCard sx={{ overflow:"hidden" }} className="fu1">

        {/* Tab bar */}
        <Box sx={{ borderBottom:`1px solid ${T.border}`, bgcolor:"#FAFBFD" }}>
          <Tabs value={tabIndex} onChange={(_,v) => setTabIndex(v)} sx={{
            px:2,
            "& .MuiTabs-indicator":{ bgcolor:T.accent, height:"2.5px", borderRadius:"2px 2px 0 0" },
            "& .MuiTab-root":{
              fontFamily:fBody, fontWeight:600, fontSize:"0.8rem",
              textTransform:"none", color:T.textMute, minHeight:50,
              "&.Mui-selected":{ color:T.accent }
            }
          }}>
            {tabs.map((t,i) => (
              <Tab key={i} icon={<t.Icon sx={{fontSize:16}} />} iconPosition="start"
                label={
                  <Box display="flex" alignItems="center" gap={0.8}>
                    {t.label}
                    {t.count > 0 && (
                      <Box sx={{ px:0.7, py:0.1, borderRadius:"99px",
                        bgcolor: tabIndex===i ? T.accentLight : T.warningLight }}>
                        <Typography sx={{ fontFamily:fMono, fontSize:"0.62rem", fontWeight:700,
                          color: tabIndex===i ? T.accent : T.warning }}>{t.count}</Typography>
                      </Box>
                    )}
                  </Box>
                }
              />
            ))}
          </Tabs>
        </Box>

        <Box p={3}>

          {/* ════ TAB 0: GRANT MONITORING ════ */}
          {tabIndex === 0 && (
            <Box className="fu">
              {/* Toolbar */}
              <Box display="flex" justifyContent="space-between" alignItems="center"
                mb={2.5} flexWrap="wrap" gap={1.5}>
                <Typography sx={{ fontFamily:fHead, fontWeight:700,
                  fontSize:"0.92rem", color:T.text }}>
                  Active Grant Portfolio
                </Typography>
                <TextField size="small" placeholder="Search project, PI, or agency…"
                  value={searchQ} onChange={e => setSearchQ(e.target.value)}
                  InputProps={{ startAdornment:
                    <InputAdornment position="start">
                      <Search sx={{ fontSize:15, color:T.textMute }} />
                    </InputAdornment> }}
                  sx={{ width:230, "& .MuiOutlinedInput-root":{
                    borderRadius:"8px", fontFamily:fBody, fontSize:"0.78rem",
                    "& fieldset":{ borderColor:T.border },
                    "&.Mui-focused fieldset":{ borderColor:T.accent } }}} />
              </Box>

              {/* Project cards */}
              <Grid container spacing={2.5}>
                {filteredProjects.map((p,i) => {
                  const pct       = Math.round((p.used / p.budget) * 100);
                  const statusS   = STATUS_COLOR[p.status]  || { color:T.textMute, bg:"#F1F5F9" };
                  const reportS   = REPORT_COLOR[p.reportStatus] || { color:T.textMute, bg:"#F1F5F9" };
                  const milesDone = p.milestones.filter(m=>m.done).length;
                  return (
                    <Grid item xs={12} md={4} key={p.id}>
                      <SCard sx={{ p:2.5, height:"100%" }} className={`fu${Math.min(i,3)} card-h`}>

                        {/* Card header */}
                        <Box display="flex" justifyContent="space-between"
                          alignItems="flex-start" mb={1.8}>
                          <AgencyBadge agency={p.agency} />
                          <Box sx={{ px:1, py:0.3, borderRadius:"99px",
                            bgcolor:statusS.bg, display:"flex", alignItems:"center", gap:0.5 }}>
                            <Box sx={{ width:6, height:6, borderRadius:"50%", bgcolor:statusS.color,
                              ...(p.status==="Critical"?{ animation:"pulse 1.5s infinite" }:{}) }} />
                            <Typography sx={{ fontFamily:fBody, fontSize:"0.69rem",
                              fontWeight:700, color:statusS.color }}>{p.status}</Typography>
                          </Box>
                        </Box>

                        {/* Project ID & PI */}
                        <Typography sx={{ fontFamily:fMono, fontWeight:700,
                          fontSize:"0.88rem", color:T.accent, mb:0.4 }}>{p.id}</Typography>
                        <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                          <Avatar sx={{ width:22, height:22, bgcolor:T.accentLight,
                            color:T.accent, fontSize:"0.58rem", fontWeight:700 }}>
                            {p.piAvatar}
                          </Avatar>
                          <Typography sx={{ fontFamily:fBody, fontSize:"0.78rem",
                            fontWeight:600, color:T.text }}>{p.pi}</Typography>
                        </Box>
                        <Typography sx={{ fontFamily:fBody, fontSize:"0.7rem",
                          color:T.textMute, mb:1.8 }}>
                          {p.dept} &nbsp;·&nbsp; {p.duration}
                        </Typography>

                        {/* Budget bar */}
                        <BudgetBar used={p.used} budget={p.budget} />

                        {/* Milestone mini-bar */}
                        <Box sx={{ mt:1.8, mb:1.8 }}>
                          <Box display="flex" justifyContent="space-between" mb={0.6}>
                            <Typography sx={{ fontFamily:fBody, fontSize:"0.7rem", color:T.textMute }}>
                              Milestones
                            </Typography>
                            <Typography sx={{ fontFamily:fMono, fontSize:"0.7rem",
                              fontWeight:700, color:T.textSub }}>
                              {milesDone}/{p.milestones.length}
                            </Typography>
                          </Box>
                          <Box display="flex" gap={0.5}>
                            {p.milestones.map((m,j) => (
                              <Box key={j} flex={1} sx={{ height:4, borderRadius:99,
                                bgcolor: m.done ? T.success : T.border }} />
                            ))}
                          </Box>
                        </Box>

                        <Divider sx={{ borderColor:T.border, mb:1.5 }} />

                        {/* Report status + actions */}
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                          <Box sx={{ px:1, py:0.3, borderRadius:"6px",
                            bgcolor:reportS.bg, display:"inline-flex",
                            alignItems:"center", gap:0.5 }}>
                            <ReceiptLong sx={{ fontSize:12, color:reportS.color }} />
                            <Typography sx={{ fontFamily:fBody, fontSize:"0.69rem",
                              fontWeight:700, color:reportS.color }}>
                              {p.reportStatus}
                            </Typography>
                          </Box>
                          <Box display="flex" gap={0.5}>
                            {p.reportStatus !== "All Clear" && (
                              <Tooltip title="Send reminder to PI">
                                <IconButton size="small"
                                  onClick={() => toast(`Reminder sent to ${p.pi}.`)}
                                  sx={{ bgcolor:T.warningLight, color:T.warning,
                                    borderRadius:"7px", width:28, height:28 }}>
                                  <NotificationsActive sx={{ fontSize:14 }} />
                                </IconButton>
                              </Tooltip>
                            )}
                            <Tooltip title="View project details">
                              <IconButton size="small"
                                onClick={() => setDetailDialog(p)}
                                sx={{ bgcolor:T.accentLight, color:T.accent,
                                  borderRadius:"7px", width:28, height:28 }}>
                                <Visibility sx={{ fontSize:14 }} />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </Box>
                      </SCard>
                    </Grid>
                  );
                })}

                {filteredProjects.length === 0 && (
                  <Grid item xs={12}>
                    <Box textAlign="center" py={6}>
                      <FolderOpen sx={{ fontSize:48, color:T.border, mb:1.5 }} />
                      <Typography sx={{ fontFamily:fBody, color:T.textMute }}>
                        No projects match your search.
                      </Typography>
                    </Box>
                  </Grid>
                )}
              </Grid>

              {/* Portfolio summary bar */}
              <SCard sx={{ p:2.5, mt:3 }}>
                <SLabel sx={{ mb:1.5 }}>Portfolio Budget Summary</SLabel>
                <Box>
                  <Box display="flex" justifyContent="space-between" mb={0.8}>
                    <Typography sx={{ fontFamily:fBody, fontSize:"0.78rem", color:T.textSub }}>
                      Total Utilisation Across All Projects
                    </Typography>
                    <Typography sx={{ fontFamily:fMono, fontSize:"0.78rem", fontWeight:700,
                      color: Math.round((totalUsed/totalBudget)*100) > 80 ? T.danger : T.accent }}>
                      {Math.round((totalUsed/totalBudget)*100)}% — ₹{(totalUsed/10000000).toFixed(2)}Cr of ₹{(totalBudget/10000000).toFixed(2)}Cr
                    </Typography>
                  </Box>
                  <Box sx={{ height:10, borderRadius:99, bgcolor:T.border, overflow:"hidden" }}>
                    <Box sx={{
                      height:"100%", borderRadius:99,
                      width:`${Math.round((totalUsed/totalBudget)*100)}%`,
                      bgcolor:T.accent, transition:"width 1.5s ease"
                    }} />
                  </Box>
                </Box>
              </SCard>
            </Box>
          )}

          {/* ════ TAB 1: APPROVALS ════ */}
          {tabIndex === 1 && (
            <Box className="fu">
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2.5}>
                <Typography sx={{ fontFamily:fHead, fontWeight:700,
                  fontSize:"0.92rem", color:T.text }}>
                  Pending Approvals Queue
                </Typography>
                <Box sx={{ px:1.5, py:0.5, borderRadius:"8px",
                  bgcolor: pendingApprovals > 0 ? T.warningLight : T.successLight,
                  border:`1px solid ${pendingApprovals > 0 ? T.warning+"30" : T.success+"30"}` }}>
                  <Typography sx={{ fontFamily:fMono, fontSize:"0.72rem", fontWeight:700,
                    color: pendingApprovals > 0 ? T.warning : T.success }}>
                    {pendingApprovals} pending
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ borderRadius:"10px", border:`1px solid ${T.border}`, overflow:"hidden" }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TH>Project / PI</TH>
                      <TH>Request Type</TH>
                      <TH>Agency</TH>
                      <TH>Amount</TH>
                      <TH>Submitted</TH>
                      <TH>Status</TH>
                      <TH align="center">Action</TH>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {approvals.map(row => (
                      <TableRow key={row.id} className="row-h">
                        <TD sx={{ minWidth:175 }}>
                          <Box display="flex" alignItems="center" gap={1.2}>
                            <Avatar sx={{ width:30, height:30, bgcolor:T.accentLight,
                              color:T.accent, fontSize:"0.65rem", fontWeight:700 }}>
                              {row.piAvatar}
                            </Avatar>
                            <Box>
                              <Typography sx={{ fontFamily:fMono, fontWeight:700,
                                fontSize:"0.79rem", color:T.accent }}>{row.project}</Typography>
                              <Typography sx={{ fontFamily:fBody, fontSize:"0.69rem",
                                color:T.textMute }}>{row.pi}</Typography>
                            </Box>
                          </Box>
                        </TD>
                        <TD>
                          <Typography sx={{ fontFamily:fBody, fontSize:"0.79rem",
                            fontWeight:600, color:T.text }}>{row.type}</Typography>
                        </TD>
                        <TD><AgencyBadge agency={row.agency} /></TD>
                        <TD>
                          <Typography sx={{ fontFamily:fMono, fontWeight:700,
                            fontSize:"0.88rem", color:T.text }}>
                            ₹{row.amount.toLocaleString()}
                          </Typography>
                        </TD>
                        <TD>
                          <Typography sx={{ fontFamily:fMono, fontSize:"0.74rem" }}>
                            {row.date}
                          </Typography>
                        </TD>
                        <TD>
                          <StatusPill status={row.status} map={APPROVAL_STATUS_MAP} />
                        </TD>
                        <TD align="center">
                          {row.status === "Pending Review" ? (
                            <Button size="small" variant="contained"
                              startIcon={<Visibility sx={{fontSize:14}} />}
                              onClick={() => openApproval(row)}
                              sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.73rem",
                                textTransform:"none", borderRadius:"8px",
                                bgcolor:T.accent, boxShadow:"none",
                                "&:hover":{ bgcolor:"#4F46E5", boxShadow:"none" } }}>
                              Verify
                            </Button>
                          ) : (
                            <Typography sx={{ fontFamily:fBody, fontSize:"0.72rem",
                              color:T.textMute, fontStyle:"italic" }}>
                              {row.status === "Approved" ? "✓ Done" : "✗ Rejected"}
                            </Typography>
                          )}
                        </TD>
                      </TableRow>
                    ))}
                    {approvals.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={7} sx={{ textAlign:"center",
                          py:5, fontFamily:fBody, color:T.textMute }}>
                          No approval requests at this time.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </Box>
            </Box>
          )}
        </Box>
      </SCard>

      {/* ════════════════════════════════════════
          PROJECT DETAIL DIALOG
      ════════════════════════════════════════ */}
      <Dialog open={!!detailDialog} onClose={() => setDetailDialog(null)}
        maxWidth="md" fullWidth
        PaperProps={{ sx:{ borderRadius:"16px", border:`1px solid ${T.border}` } }}>
        {detailDialog && (
          <>
            <DialogTitle sx={{ fontFamily:fHead, fontWeight:700, fontSize:"1rem",
              color:T.text, borderBottom:`1px solid ${T.border}`,
              bgcolor:"#FAFBFD", pb:2 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box display="flex" alignItems="center" gap={1.5}>
                  <Box sx={{ width:4, height:24, borderRadius:2, bgcolor:T.accent }} />
                  <Box>
                    <Typography sx={{ fontFamily:fHead, fontWeight:700,
                      fontSize:"1rem", color:T.text }}>
                      Project Details
                    </Typography>
                    <Typography sx={{ fontFamily:fMono, fontSize:"0.73rem", color:T.accent }}>
                      {detailDialog.id} &nbsp;·&nbsp; {detailDialog.agency}
                    </Typography>
                  </Box>
                </Box>
                <IconButton size="small" onClick={() => setDetailDialog(null)}
                  sx={{ bgcolor:"#F1F5F9", borderRadius:"8px" }}>
                  <Close fontSize="small" />
                </IconButton>
              </Box>
            </DialogTitle>

            <DialogContent sx={{ px:3, pt:3, pb:2 }}>
              <Stack spacing={3}>
                {/* Summary row */}
                <Grid container spacing={2}>
                  {[
                    { label:"Principal Investigator", value:detailDialog.pi,       mono:false },
                    { label:"Department",             value:detailDialog.dept,     mono:false },
                    { label:"Duration",               value:detailDialog.duration, mono:true  },
                    { label:"Agency",                 value:<AgencyBadge agency={detailDialog.agency} /> },
                  ].map(c => (
                    <Grid item xs={6} md={3} key={c.label}>
                      <Box sx={{ p:1.8, borderRadius:"10px", bgcolor:"#F9FAFB",
                        border:`1px solid ${T.border}` }}>
                        <SLabel sx={{ mb:0.5 }}>{c.label}</SLabel>
                        {typeof c.value === "string"
                          ? <Typography sx={{ fontFamily: c.mono ? fMono : fBody,
                              fontWeight:700, fontSize:"0.82rem", color:T.text }}>
                              {c.value}
                            </Typography>
                          : c.value}
                      </Box>
                    </Grid>
                  ))}
                </Grid>

                {/* Objectives */}
                <Box sx={{ p:2, borderRadius:"10px", bgcolor:T.accentLight,
                  border:`1px solid ${T.accent}25` }}>
                  <SLabel sx={{ mb:0.5 }}>Project Objectives</SLabel>
                  <Typography sx={{ fontFamily:fBody, fontSize:"0.82rem",
                    color:T.textSub, lineHeight:1.7 }}>
                    {detailDialog.objectives}
                  </Typography>
                </Box>

                <Grid container spacing={2.5}>
                  {/* LEFT: Budget breakdown */}
                  <Grid item xs={12} md={6}>
                    <Typography sx={{ fontFamily:fHead, fontWeight:700,
                      fontSize:"0.88rem", color:T.text, mb:1.5 }}>
                      Budget Utilisation
                    </Typography>
                    <SCard sx={{ p:2.5 }}>
                      <Box display="flex" justifyContent="space-between" mb={0.5}>
                        <SLabel>Utilised</SLabel>
                        <SLabel>Sanctioned</SLabel>
                      </Box>
                      <Box display="flex" justifyContent="space-between" mb={1.5}>
                        <Typography sx={{ fontFamily:fMono, fontWeight:700,
                          fontSize:"1.2rem", color:T.success }}>
                          ₹{(detailDialog.used/100000).toFixed(1)}L
                        </Typography>
                        <Typography sx={{ fontFamily:fMono, fontWeight:700,
                          fontSize:"1.2rem", color:T.text }}>
                          ₹{(detailDialog.budget/100000).toFixed(1)}L
                        </Typography>
                      </Box>
                      <BudgetBar used={detailDialog.used} budget={detailDialog.budget} />

                      <Divider sx={{ borderColor:T.border, my:2 }} />
                      <SLabel sx={{ mb:1 }}>Expenditure Heads</SLabel>
                      <Stack spacing={0}>
                        {detailDialog.transactions.map((tx,i) => (
                          <Box key={i} display="flex" justifyContent="space-between"
                            alignItems="center" sx={{
                              py:1.1, borderBottom:`1px solid ${T.border}`,
                              "&:last-child":{ borderBottom:"none" }
                            }}>
                            <Box>
                              <Typography sx={{ fontFamily:fBody, fontWeight:600,
                                fontSize:"0.79rem", color:T.text }}>{tx.head}</Typography>
                              <Typography sx={{ fontFamily:fMono, fontSize:"0.67rem",
                                color:T.textMute }}>{tx.date}</Typography>
                            </Box>
                            <Box display="flex" alignItems="center" gap={1}>
                              <Typography sx={{ fontFamily:fMono, fontWeight:700,
                                fontSize:"0.82rem" }}>₹{tx.amount.toLocaleString()}</Typography>
                              <Box sx={{ px:0.8, py:0.2, borderRadius:"5px",
                                bgcolor: tx.status === "Cleared" ? T.successLight : T.warningLight }}>
                                <Typography sx={{ fontFamily:fBody, fontSize:"0.62rem",
                                  fontWeight:700,
                                  color: tx.status === "Cleared" ? T.success : T.warning }}>
                                  {tx.status}
                                </Typography>
                              </Box>
                            </Box>
                          </Box>
                        ))}
                      </Stack>
                    </SCard>
                  </Grid>

                  {/* RIGHT: Milestones */}
                  <Grid item xs={12} md={6}>
                    <Typography sx={{ fontFamily:fHead, fontWeight:700,
                      fontSize:"0.88rem", color:T.text, mb:1.5 }}>
                      Project Milestones
                    </Typography>
                    <Stack spacing={0}>
                      {detailDialog.milestones.map((m,i) => (
                        <Box key={i} sx={{
                          display:"flex", gap:1.5,
                          px:2, py:1.6,
                          borderRadius: i===0?"9px 9px 0 0" : i===detailDialog.milestones.length-1?"0 0 9px 9px":"0",
                          border:`1px solid ${T.border}`,
                          borderTop: i>0?"none":`1px solid ${T.border}`,
                          bgcolor: m.done ? T.successLight : "transparent",
                        }}>
                          {m.done
                            ? <CheckCircle sx={{ fontSize:16, color:T.success, flexShrink:0, mt:0.15 }} />
                            : <Box sx={{ width:16, height:16, borderRadius:"50%",
                                border:`2px solid ${T.border}`, flexShrink:0, mt:0.2 }} />}
                          <Typography sx={{ fontFamily:fBody, fontSize:"0.8rem",
                            color: m.done ? T.success : T.textSub,
                            fontWeight: m.done ? 700 : 400 }}>
                            {m.label}
                          </Typography>
                        </Box>
                      ))}
                    </Stack>

                    {/* Report status */}
                    <Box sx={{ mt:2, p:2, borderRadius:"10px",
                      bgcolor: REPORT_COLOR[detailDialog.reportStatus]?.bg || "#F1F5F9",
                      border:`1px solid ${REPORT_COLOR[detailDialog.reportStatus]?.color || T.border}30`
                    }}>
                      <SLabel sx={{ mb:0.5 }}>Report Status</SLabel>
                      <Box display="flex" alignItems="center" gap={1}>
                        <ReceiptLong sx={{ fontSize:15,
                          color: REPORT_COLOR[detailDialog.reportStatus]?.color || T.textMute }} />
                        <Typography sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.82rem",
                          color: REPORT_COLOR[detailDialog.reportStatus]?.color || T.textMute }}>
                          {detailDialog.reportStatus}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </Stack>
            </DialogContent>

            <DialogActions sx={{ px:3, pb:3, pt:2, bgcolor:"#FAFBFD",
              borderTop:`1px solid ${T.border}`, gap:1 }}>
              {detailDialog.reportStatus !== "All Clear" && (
                <Button startIcon={<NotificationsActive sx={{fontSize:15}} />}
                  onClick={() => { toast(`Reminder sent to ${detailDialog.pi}.`); setDetailDialog(null); }}
                  variant="outlined"
                  sx={{ fontFamily:fBody, fontWeight:600, fontSize:"0.8rem",
                    textTransform:"none", borderRadius:"8px",
                    borderColor:`${T.warning}50`, color:T.warning,
                    "&:hover":{ borderColor:T.warning, bgcolor:T.warningLight } }}>
                  Send Reminder to PI
                </Button>
              )}
              <Button onClick={() => setDetailDialog(null)} variant="outlined"
                sx={{ fontFamily:fBody, fontWeight:600, fontSize:"0.8rem",
                  textTransform:"none", borderRadius:"8px",
                  borderColor:T.border, color:T.textSub, ml:"auto" }}>
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* ════════════════════════════════════════
          APPROVAL DIALOG
      ════════════════════════════════════════ */}
      <Dialog open={!!approvalDialog} onClose={() => setApprovalDialog(null)}
        maxWidth="sm" fullWidth
        PaperProps={{ sx:{ borderRadius:"16px", border:`1px solid ${T.border}` } }}>
        {approvalDialog && (
          <>
            <DialogTitle sx={{ fontFamily:fHead, fontWeight:700, fontSize:"1rem",
              color:T.text, borderBottom:`1px solid ${T.border}`,
              bgcolor:"#FAFBFD", pb:2 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box display="flex" alignItems="center" gap={1.5}>
                  <Box sx={{ width:4, height:24, borderRadius:2, bgcolor:T.accent }} />
                  <Box>
                    <Typography sx={{ fontFamily:fHead, fontWeight:700,
                      fontSize:"1rem", color:T.text }}>Verify Request</Typography>
                    <Typography sx={{ fontFamily:fMono, fontSize:"0.73rem", color:T.accent }}>
                      {approvalDialog.project}
                    </Typography>
                  </Box>
                </Box>
                <IconButton size="small" onClick={() => setApprovalDialog(null)}
                  sx={{ bgcolor:"#F1F5F9", borderRadius:"8px" }}>
                  <Close fontSize="small" />
                </IconButton>
              </Box>
            </DialogTitle>

            <DialogContent sx={{ px:3, pt:3, pb:2 }}>
              <Stack spacing={2.5}>
                {/* Summary */}
                <Grid container spacing={2}>
                  {[
                    { label:"Request Type",  value:approvalDialog.type   },
                    { label:"Agency",        value:<AgencyBadge agency={approvalDialog.agency} /> },
                    { label:"PI",            value:approvalDialog.pi     },
                    { label:"Date Submitted",value:approvalDialog.date, mono:true },
                  ].map(c => (
                    <Grid item xs={6} key={c.label}>
                      <Box sx={{ p:1.5, borderRadius:"8px", bgcolor:"#F9FAFB",
                        border:`1px solid ${T.border}` }}>
                        <SLabel sx={{ mb:0.4 }}>{c.label}</SLabel>
                        {typeof c.value === "string"
                          ? <Typography sx={{ fontFamily: c.mono ? fMono : fBody,
                              fontWeight:600, fontSize:"0.79rem", color:T.text }}>
                              {c.value}
                            </Typography>
                          : c.value}
                      </Box>
                    </Grid>
                  ))}
                </Grid>

                {/* Amount highlight */}
                <Box sx={{ p:2.5, borderRadius:"10px", textAlign:"center",
                  bgcolor:T.successLight, border:`1px solid ${T.success}30` }}>
                  <SLabel sx={{ mb:0.4 }}>Claim Amount</SLabel>
                  <Typography sx={{ fontFamily:fMono, fontWeight:700,
                    fontSize:"1.6rem", color:T.success }}>
                    ₹{approvalDialog.amount.toLocaleString()}
                  </Typography>
                </Box>

                {/* Document placeholder */}
                <Box sx={{ p:2.5, borderRadius:"10px", bgcolor:"#F9FAFB",
                  border:`1px dashed ${T.border}`,
                  display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <Box display="flex" alignItems="center" gap={1.5}>
                    <Box sx={{ p:0.8, borderRadius:"8px",
                      bgcolor:T.accentLight, color:T.accent }}>
                      <ReceiptLong sx={{ fontSize:16 }} />
                    </Box>
                    <Box>
                      <Typography sx={{ fontFamily:fBody, fontWeight:600,
                        fontSize:"0.8rem", color:T.text }}>{approvalDialog.doc}</Typography>
                      <Typography sx={{ fontFamily:fBody, fontSize:"0.69rem",
                        color:T.textMute }}>UC / Supporting Document</Typography>
                    </Box>
                  </Box>
                  <Button size="small" startIcon={<Visibility sx={{fontSize:13}} />}
                    onClick={() => toast(`Viewing ${approvalDialog.doc}`)}
                    sx={{ fontFamily:fBody, fontWeight:600, fontSize:"0.73rem",
                      textTransform:"none", color:T.accent, borderRadius:"8px",
                      "&:hover":{ bgcolor:T.accentLight } }}>
                    View
                  </Button>
                </Box>

                {/* Remarks */}
                <Box>
                  <SLabel sx={{ mb:0.7 }}>Admin Remarks</SLabel>
                  <TextField
                    size="small" fullWidth multiline rows={3}
                    value={adminRemark}
                    onChange={e => setAdminRemark(e.target.value)}
                    placeholder="e.g. Expenditure verified against budget head. All invoices in order…"
                    sx={{ "& .MuiOutlinedInput-root":{
                      borderRadius:"8px", fontFamily:fBody, fontSize:"0.82rem",
                      "& fieldset":{ borderColor:T.border },
                      "&.Mui-focused fieldset":{ borderColor:T.accent } }}}
                  />
                  <Typography sx={{ fontFamily:fBody, fontSize:"0.67rem",
                    color:T.textMute, mt:0.5 }}>
                    Remark is mandatory for rejection.
                  </Typography>
                </Box>
              </Stack>
            </DialogContent>

            <DialogActions sx={{ px:3, pb:3, pt:2, bgcolor:"#FAFBFD",
              borderTop:`1px solid ${T.border}`, gap:1 }}>
              <Button onClick={() => setApprovalDialog(null)} variant="outlined"
                sx={{ fontFamily:fBody, fontWeight:600, fontSize:"0.8rem",
                  textTransform:"none", borderRadius:"8px",
                  borderColor:T.border, color:T.textSub }}>
                Cancel
              </Button>
              <Button onClick={handleReject} variant="outlined"
                startIcon={<Cancel sx={{fontSize:15}} />}
                sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.8rem",
                  textTransform:"none", borderRadius:"8px",
                  color:T.danger, borderColor:`${T.danger}50`,
                  "&:hover":{ borderColor:T.danger, bgcolor:T.dangerLight } }}>
                Reject
              </Button>
              <Button onClick={handleApprove} variant="contained"
                startIcon={<CheckCircle sx={{fontSize:15}} />}
                sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.8rem",
                  textTransform:"none", borderRadius:"8px",
                  bgcolor:T.success, boxShadow:"none",
                  "&:hover":{ bgcolor:"#059669", boxShadow:"none" } }}>
                Approve &amp; Process
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

export default GrantAdminView;