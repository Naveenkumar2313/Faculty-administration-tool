import React, { useState, useMemo } from "react";
import {
  Box, Grid, Typography, Button, Table, TableBody, TableCell,
  TableHead, TableRow, IconButton, Tooltip, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, MenuItem, Stack,
  Snackbar, Alert, Divider, Avatar, InputAdornment, Tabs, Tab, 
} from "@mui/material";
import {
  VerifiedUser, Build, NotificationsActive, ReportProblem,
  AssignmentInd, CheckCircle, History, Close, Search,
  Refresh, FileDownload, Warning, Add, Timer,
  Engineering, Receipt, CalendarMonth, Shield,
  TrendingUp, Person, LocationOn, ErrorOutline,
  FiberManualRecord, HourglassEmpty, Info, ReceiptLong, 
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
    @keyframes scanBar { 0%{width:0} 100%{width:var(--pct)} }
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
const MISSING_ASSETS_INIT = [
  { id:"AST-005", name:"Epson Projector EB",  location:"Seminar Hall",  lastSeen:"2025-12-10", dept:"Block A",   status:"Unaccounted" },
  { id:"AST-022", name:"Lab Microscope (Bio)",location:"Bio Lab 1",     lastSeen:"2025-11-05", dept:"Science",   status:"Unaccounted" },
  { id:"AST-038", name:"Dell Monitor 24\"",   location:"Admin Office",  lastSeen:"2025-10-20", dept:"Admin",     status:"Reported Lost"},
  { id:"AST-061", name:"Portable PA System",  location:"Auditorium",    lastSeen:"2025-09-15", dept:"Events",    status:"Unaccounted" },
];

const TICKETS_INIT = [
  { id:"TKT-501", asset:"AST-001",  assetName:"Dell Latitude 5420",  issue:"Screen Flicker",  reportedBy:"Dr. Sarah Smith",   dept:"CSE",   date:"2026-02-01", status:"Open",        tech:"Unassigned",              priority:"High"   },
  { id:"TKT-502", asset:"AST-010",  assetName:"AC Unit Block B",     issue:"Not Cooling",     reportedBy:"Admin Office",      dept:"Admin", date:"2026-01-28", status:"In Progress", tech:"Vendor: CoolTech",        priority:"High"   },
  { id:"TKT-503", asset:"AST-055",  assetName:"HP LaserJet Pro",     issue:"Paper Jam",       reportedBy:"Exam Cell",         dept:"Admin", date:"2026-02-03", status:"Resolved",    tech:"Mr. Ram (Internal IT)",   priority:"Low"    },
  { id:"TKT-504", asset:"AST-031",  assetName:"Lab Centrifuge",      issue:"Noise & Vibration",reportedBy:"Dr. K. Reddy",     dept:"Science",date:"2026-02-08",status:"Open",        tech:"Unassigned",              priority:"Medium" },
  { id:"TKT-505", asset:"AST-018",  assetName:"Interactive Display", issue:"Touch Unresponsive",reportedBy:"Prof. Rajan Kumar",dept:"Mech", date:"2026-02-10", status:"In Progress", tech:"Vendor: Dell Support",    priority:"Medium" },
];

const AMC_INIT = [
  { id:1, vendor:"Dell India Pvt. Ltd",   assets:"Laptops — 50 Units",       expiry:"2026-03-15", value:"₹2,40,000", status:"Expiring Soon" },
  { id:2, vendor:"Voltas Ltd.",            assets:"ACs — All Blocks (24 nos)", expiry:"2026-06-30", value:"₹85,000",  status:"Active"        },
  { id:3, vendor:"Epson India",            assets:"Projectors — 12 Units",    expiry:"2026-09-01", value:"₹60,000",  status:"Active"        },
  { id:4, vendor:"HP India",               assets:"Printers — 8 Units",       expiry:"2026-04-10", value:"₹35,000",  status:"Expiring Soon" },
];

const TECHNICIANS = [
  "Mr. Ram (Internal IT)",
  "Mr. Shyam (Electrician)",
  "Ms. Anjali (IT Support)",
  "Vendor: CoolTech Services",
  "Vendor: Dell Support",
  "Vendor: Epson Service",
];

const TICKET_STATUS_META = {
  Open:        { color:T.danger,  bg:T.dangerLight  },
  "In Progress":{ color:T.warning, bg:T.warningLight },
  Resolved:    { color:T.success, bg:T.successLight  },
};

const PRIORITY_META = {
  High:   { color:T.danger,  bg:T.dangerLight  },
  Medium: { color:T.warning, bg:T.warningLight },
  Low:    { color:T.success, bg:T.successLight },
};

const MISSING_META = {
  Unaccounted:   { color:T.warning, bg:T.warningLight },
  "Reported Lost":{ color:T.danger, bg:T.dangerLight  },
};

const AMC_META = {
  "Expiring Soon":{ color:T.danger,  bg:T.dangerLight  },
  Active:         { color:T.success, bg:T.successLight },
};

const AVATAR_COLORS = [
  { bg:"#EEF2FF", color:"#6366F1" },
  { bg:"#ECFDF5", color:"#10B981" },
  { bg:"#F5F3FF", color:"#7C3AED" },
  { bg:"#FFFBEB", color:"#F59E0B" },
  { bg:"#F0F9FF", color:"#0EA5E9" },
  { bg:"#FEF2F2", color:"#EF4444" },
];
const aColor  = (s) => AVATAR_COLORS[(s||"A").charCodeAt(0) % AVATAR_COLORS.length];
const initials= (s) => (s||"?").split(" ").filter(Boolean).slice(0,2).map(w=>w[0]).join("").toUpperCase();

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
  const s = (meta||{})[status] || { color:T.textMute, bg:"#F1F5F9" };
  const pulse = status === "In Progress" || status === "Active";
  return (
    <Box display="flex" alignItems="center" gap={0.6}
      sx={{ px:1.2, py:0.38, borderRadius:"99px", bgcolor:s.bg, width:"fit-content" }}>
      <Box sx={{ width:6, height:6, borderRadius:"50%", bgcolor:s.color,
        ...(pulse ? { animation:"pulse 2s infinite" } : {}) }} />
      <Typography sx={{ fontFamily:fBody, fontSize:"0.71rem", fontWeight:700, color:s.color }}>
        {status}
      </Typography>
    </Box>
  );
};

const ProgBar = ({ value, color=T.accent, height=8 }) => (
  <Box sx={{ height, borderRadius:99, bgcolor:T.border, overflow:"hidden" }}>
    <Box sx={{ height:"100%", width:`${Math.min(100,value)}%`, borderRadius:99,
      bgcolor:color, transition:"width 1.4s ease" }} />
  </Box>
);

/* ═════════════════════════════════════════════
   MAIN COMPONENT
═════════════════════════════════════════════ */
const AssetMaintenanceView = () => {
  const [tabIndex, setTabIndex] = useState(0);

  /* ── Verification state ── */
  const [vStats,        setVStats]         = useState({
    total:1500, verified:850, missing:4, deadline:"2026-03-31", status:"In Progress", fy:"2025-26"
  });
  const [missingAssets, setMissingAssets]  = useState(MISSING_ASSETS_INIT);
  const [verifyDialog,  setVerifyDialog]   = useState(false);
  const [newDeadline,   setNewDeadline]    = useState("");
  const [missSearch,    setMissSearch]     = useState("");

  /* ── Maintenance state ── */
  const [tickets,       setTickets]        = useState(TICKETS_INIT);
  const [amcList,       setAmcList]        = useState(AMC_INIT);
  const [assignDialog,  setAssignDialog]   = useState(false);
  const [selectedTkt,   setSelectedTkt]    = useState(null);
  const [technician,    setTechnician]     = useState("");
  const [tktSearch,     setTktSearch]      = useState("");
  const [tktFilter,     setTktFilter]      = useState("All");
  const [addTktDialog,  setAddTktDialog]   = useState(false);
  const [newTkt,        setNewTkt]         = useState({ asset:"", issue:"", priority:"Medium", reportedBy:"", dept:"" });

  const [snack, setSnack] = useState({ open:false, msg:"", severity:"success" });
  const toast = (msg, severity="success") => setSnack({ open:true, msg, severity });

  /* ── Actions ── */
  const handleInitiateVerification = () => {
    if (!newDeadline) { toast("Please set a deadline.", "error"); return; }
    setVStats(p => ({ ...p, status:"In Progress", deadline:newDeadline, verified:0 }));
    setVerifyDialog(false);
    toast("Verification drive initiated. Notifications sent to all departments.");
  };

  const handleMarkLost = (id) => {
    setMissingAssets(p => p.map(a => a.id===id ? { ...a, status:"Reported Lost" } : a));
    toast(`Asset ${id} marked as Reported Lost.`, "warning");
  };

  const handleAssignTech = () => {
    if (!technician) { toast("Please select a technician.", "error"); return; }
    setTickets(p => p.map(t => t.id===selectedTkt.id
      ? { ...t, status:"In Progress", tech:technician } : t));
    setAssignDialog(false);
    toast(`Technician assigned to ${selectedTkt.id}.`);
  };

  const handleCloseTicket = (id) => {
    setTickets(p => p.map(t => t.id===id ? { ...t, status:"Resolved" } : t));
    toast(`Ticket ${id} closed.`);
  };

  const handleAddTicket = () => {
    if (!newTkt.asset || !newTkt.issue) { toast("Asset and Issue are required.", "error"); return; }
    const id = `TKT-${500 + tickets.length + 1}`;
    setTickets(p => [{ id, asset:"", assetName:newTkt.asset, issue:newTkt.issue,
      reportedBy:newTkt.reportedBy, dept:newTkt.dept, date:new Date().toISOString().split("T")[0],
      status:"Open", tech:"Unassigned", priority:newTkt.priority }, ...p]);
    setNewTkt({ asset:"", issue:"", priority:"Medium", reportedBy:"", dept:"" });
    setAddTktDialog(false);
    toast(`Maintenance ticket ${id} created.`);
  };

  const handleRenewAMC = (id) => {
    setAmcList(p => p.map(a => a.id===id ? { ...a, status:"Active" } : a));
    toast("AMC renewal initiated. Vendor notified.");
  };

  /* ── Derived ── */
  const vPct      = Math.round((vStats.verified / vStats.total) * 100);
  const vColor    = vPct >= 80 ? T.success : vPct >= 50 ? T.warning : T.danger;
  const remaining = vStats.total - vStats.verified;

  const filteredMissing = useMemo(() => missingAssets.filter(a => {
    const q = missSearch.toLowerCase();
    return !q || a.name.toLowerCase().includes(q) || a.id.toLowerCase().includes(q);
  }), [missingAssets, missSearch]);

  const filteredTickets = useMemo(() => tickets.filter(t => {
    const q = tktSearch.toLowerCase();
    if (q && !t.assetName.toLowerCase().includes(q) && !t.issue.toLowerCase().includes(q)
           && !t.id.toLowerCase().includes(q)) return false;
    if (tktFilter !== "All" && t.status !== tktFilter) return false;
    return true;
  }), [tickets, tktSearch, tktFilter]);

  const openCount    = tickets.filter(t => t.status==="Open").length;
  const inProgCount  = tickets.filter(t => t.status==="In Progress").length;
  const resolvedCount= tickets.filter(t => t.status==="Resolved").length;
  const expiringAMC  = amcList.filter(a => a.status==="Expiring Soon").length;

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
            Admin Dashboard · Logistics
          </Typography>
          <Typography sx={{ fontFamily:fHead, fontWeight:700, fontSize:"1.5rem", color:T.text }}>
            Maintenance &amp; Verification
          </Typography>
          <Typography sx={{ fontFamily:fBody, fontSize:"0.82rem", color:T.textSub, mt:0.3 }}>
            Annual asset verification drives, maintenance tickets, and AMC contract tracking.
          </Typography>
        </Box>
        <Button size="small" variant="outlined"
          startIcon={<FileDownload sx={{fontSize:15}} />}
          onClick={() => toast("Full maintenance report exported.")}
          sx={{ fontFamily:fBody, fontWeight:600, fontSize:"0.76rem", textTransform:"none",
            borderRadius:"8px", borderColor:T.border, color:T.textSub, mt:0.5,
            "&:hover":{ borderColor:T.accent, color:T.accent } }}>
          Export Report
        </Button>
      </Box>

      {/* ── Stat Strip ── */}
      <Grid container spacing={2} mb={3}>
        {[
          { label:"Verification Progress", value:`${vPct}%`,        sub:`${vStats.verified} of ${vStats.total} verified`, color:vColor,   Icon:VerifiedUser   },
          { label:"Missing Assets",         value:vStats.missing,   sub:"Unaccounted in current drive",                   color:T.danger,  Icon:ReportProblem  },
          { label:"Open Tickets",           value:openCount,        sub:"Require technician assignment",                  color:T.warning, Icon:Build          },
          { label:"Expiring AMCs",          value:expiringAMC,      sub:"Contracts due for renewal",                      color:T.gold,    Icon:Receipt        },
        ].map((s,i) => (
          <Grid item xs={6} md={3} key={i}>
            <SCard hover sx={{ p:2.5 }} className={`fu${i}`}>
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

      {/* ── Main Card ── */}
      <SCard sx={{ overflow:"hidden" }} className="fu1">

        {/* Tab bar */}
        <Box sx={{ borderBottom:`1px solid ${T.border}`, bgcolor:"#FAFBFD" }}>
          <Tabs value={tabIndex} onChange={(_,v) => setTabIndex(v)} sx={{
            px:2,
            "& .MuiTabs-indicator":{ bgcolor:T.accent, height:"2.5px",
              borderRadius:"2px 2px 0 0" },
            "& .MuiTab-root":{ fontFamily:fBody, fontWeight:600, fontSize:"0.78rem",
              textTransform:"none", color:T.textMute, minHeight:50,
              "&.Mui-selected":{ color:T.accent } }
          }}>
            {[
              { label:"Annual Verification Drive", Icon:VerifiedUser },
              { label:"Maintenance & AMC",         Icon:Build        },
            ].map((t,i) => (
              <Tab key={i} icon={<t.Icon sx={{fontSize:16}} />}
                iconPosition="start" label={t.label} />
            ))}
          </Tabs>
        </Box>

        <Box p={3}>

          {/* ════════════════════════════════
              TAB 0 — ANNUAL VERIFICATION
          ════════════════════════════════ */}
          {tabIndex === 0 && (
            <Box className="fu">
              <Grid container spacing={3} mb={3}>

                {/* Progress card */}
                <Grid item xs={12} md={8}>
                  <SCard sx={{ p:2.8, height:"100%" }}>
                    <Box display="flex" justifyContent="space-between"
                      alignItems="flex-start" mb={2.5}>
                      <Box>
                        <Box display="flex" alignItems="center" gap={1} mb={0.3}>
                          <Box sx={{ p:0.7, borderRadius:"8px",
                            bgcolor:T.accentLight, color:T.accent }}>
                            <VerifiedUser sx={{ fontSize:15 }} />
                          </Box>
                          <Typography sx={{ fontFamily:fHead, fontWeight:700,
                            fontSize:"0.9rem", color:T.text }}>
                            Verification Progress — FY {vStats.fy}
                          </Typography>
                        </Box>
                        <Typography sx={{ fontFamily:fBody, fontSize:"0.73rem",
                          color:T.textMute }}>
                          Deadline:&nbsp;
                          <Box component="span" sx={{ fontFamily:fMono, fontWeight:700,
                            color: new Date(vStats.deadline) < new Date() ? T.danger : T.accent }}>
                            {vStats.deadline}
                          </Box>
                          &nbsp;·&nbsp;
                          <StatusPill status={vStats.status}
                            meta={{ "In Progress":{ color:T.accent, bg:T.accentLight },
                                    Completed:    { color:T.success, bg:T.successLight },
                                    "Not Started":{ color:T.textMute, bg:"#F1F5F9" } }} />
                        </Typography>
                      </Box>
                      <Button size="small" variant="outlined"
                        onClick={() => { setNewDeadline(""); setVerifyDialog(true); }}
                        sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.74rem",
                          textTransform:"none", borderRadius:"8px",
                          borderColor:T.accent, color:T.accent, flexShrink:0,
                          "&:hover":{ bgcolor:T.accentLight } }}>
                        Initiate New Drive
                      </Button>
                    </Box>

                    {/* Big progress bar */}
                    <Box mb={0.8}>
                      <ProgBar value={vPct} color={vColor} height={12} />
                    </Box>
                    <Box display="flex" justifyContent="space-between" mb={2.5}>
                      <Typography sx={{ fontFamily:fMono, fontWeight:700,
                        fontSize:"0.8rem", color:vColor }}>{vPct}% complete</Typography>
                      <Typography sx={{ fontFamily:fBody, fontSize:"0.75rem",
                        color:T.textMute }}>
                        {vStats.verified.toLocaleString()} verified / {vStats.total.toLocaleString()} total
                      </Typography>
                    </Box>

                    {/* 3 mini stat boxes */}
                    <Grid container spacing={1.5} mb={2.5}>
                      {[
                        { label:"Verified",   value:vStats.verified,               color:T.success },
                        { label:"Remaining",  value:remaining,                     color:T.warning },
                        { label:"Missing",    value:vStats.missing,                color:T.danger  },
                      ].map(s => (
                        <Grid item xs={4} key={s.label}>
                          <Box sx={{ p:1.5, borderRadius:"9px",
                            bgcolor:"#F9FAFB", border:`1px solid ${T.border}`, textAlign:"center" }}>
                            <Typography sx={{ fontFamily:fMono, fontWeight:700,
                              fontSize:"1.3rem", color:s.color }}>{s.value}</Typography>
                            <Typography sx={{ fontFamily:fBody, fontSize:"0.68rem",
                              color:T.textMute }}>{s.label}</Typography>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>

                    {/* Action buttons */}
                    <Box display="flex" gap={1.5} flexWrap="wrap">
                      <Button size="small" variant="outlined"
                        startIcon={<NotificationsActive sx={{fontSize:14}} />}
                        onClick={() => toast("Reminders sent to all non-responding departments.", "warning")}
                        sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.74rem",
                          textTransform:"none", borderRadius:"8px",
                          borderColor:T.warning, color:T.warning,
                          "&:hover":{ bgcolor:T.warningLight } }}>
                        Send Reminders
                      </Button>
                      <Button size="small" variant="outlined"
                        startIcon={<ReportProblem sx={{fontSize:14}} />}
                        onClick={() => toast("Missing assets report downloaded.")}
                        sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.74rem",
                          textTransform:"none", borderRadius:"8px",
                          borderColor:T.danger, color:T.danger,
                          "&:hover":{ bgcolor:T.dangerLight } }}>
                        Download Missing Report
                      </Button>
                      <Button size="small" variant="outlined"
                        startIcon={<FileDownload sx={{fontSize:14}} />}
                        onClick={() => toast("Full verification report exported.")}
                        sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.74rem",
                          textTransform:"none", borderRadius:"8px",
                          borderColor:T.border, color:T.textSub,
                          "&:hover":{ borderColor:T.accent, color:T.accent } }}>
                        Export Report
                      </Button>
                    </Box>
                  </SCard>
                </Grid>

                {/* Missing count card */}
                <Grid item xs={12} md={4}>
                  <SCard sx={{ p:2.8, height:"100%",
                    background:`linear-gradient(135deg, ${T.dangerLight}, #FFE4E1)`,
                    border:`1.5px solid ${T.danger}25` }}>
                    <Box display="flex" alignItems="center" gap={1} mb={1.5}>
                      <Box sx={{ p:0.8, borderRadius:"8px",
                        bgcolor:`${T.danger}18`, color:T.danger }}>
                        <ReportProblem sx={{ fontSize:16 }} />
                      </Box>
                      <Typography sx={{ fontFamily:fBody, fontWeight:700,
                        fontSize:"0.82rem", color:T.danger }}>
                        Missing / Unaccounted
                      </Typography>
                    </Box>

                    <Typography sx={{ fontFamily:fMono, fontWeight:700,
                      fontSize:"3rem", color:T.danger, lineHeight:1 }}>
                      {vStats.missing}
                    </Typography>
                    <Typography sx={{ fontFamily:fBody, fontSize:"0.77rem",
                      color:T.textSub, mt:0.5, mb:2 }}>
                      Assets not found during verification drive
                    </Typography>

                    <Divider sx={{ borderColor:`${T.danger}20`, mb:2 }} />

                    <Box display="flex" justifyContent="space-between" mb={1.5}>
                      {[
                        { label:"Unaccounted",  value: missingAssets.filter(a=>a.status==="Unaccounted").length },
                        { label:"Reported Lost", value: missingAssets.filter(a=>a.status==="Reported Lost").length },
                      ].map(s => (
                        <Box key={s.label} textAlign="center">
                          <Typography sx={{ fontFamily:fMono, fontWeight:700,
                            fontSize:"1.2rem", color:T.danger }}>{s.value}</Typography>
                          <Typography sx={{ fontFamily:fBody, fontSize:"0.65rem",
                            color:T.textSub }}>{s.label}</Typography>
                        </Box>
                      ))}
                    </Box>
                  </SCard>
                </Grid>
              </Grid>

              {/* Missing assets table */}
              <Box display="flex" justifyContent="space-between"
                alignItems="center" mb={2} flexWrap="wrap" gap={1}>
                <Box display="flex" alignItems="center" gap={1}>
                  <Box sx={{ p:0.75, borderRadius:"8px",
                    bgcolor:T.dangerLight, color:T.danger }}>
                    <ErrorOutline sx={{ fontSize:15 }} />
                  </Box>
                  <Typography sx={{ fontFamily:fHead, fontWeight:700,
                    fontSize:"0.9rem", color:T.text }}>Missing Assets List</Typography>
                </Box>
                <TextField size="small" placeholder="Search by name or ID…"
                  value={missSearch} onChange={e => setMissSearch(e.target.value)}
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
              </Box>

              <Box sx={{ borderRadius:"10px", border:`1px solid ${T.border}`, overflow:"hidden" }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TH>Asset ID</TH>
                      <TH>Asset Name</TH>
                      <TH>Last Known Location</TH>
                      <TH>Department</TH>
                      <TH>Last Verified</TH>
                      <TH>Status</TH>
                      <TH align="center">Action</TH>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredMissing.map(row => (
                      <TableRow key={row.id} className="row-h">
                        <TD>
                          <Typography sx={{ fontFamily:fMono, fontWeight:700,
                            fontSize:"0.77rem", color:T.danger }}>{row.id}</Typography>
                        </TD>
                        <TD sx={{ minWidth:175 }}>
                          <Typography sx={{ fontFamily:fBody, fontWeight:700,
                            fontSize:"0.82rem", color:T.text }}>{row.name}</Typography>
                        </TD>
                        <TD>
                          <Box display="flex" alignItems="center" gap={0.5}>
                            <LocationOn sx={{ fontSize:12, color:T.textMute }} />
                            <Typography sx={{ fontFamily:fBody, fontSize:"0.78rem" }}>
                              {row.location}
                            </Typography>
                          </Box>
                        </TD>
                        <TD>
                          <Box sx={{ px:0.9, py:0.22, borderRadius:"6px",
                            bgcolor:"#F1F5F9", display:"inline-block" }}>
                            <Typography sx={{ fontFamily:fBody, fontSize:"0.68rem",
                              fontWeight:700, color:T.textSub }}>{row.dept}</Typography>
                          </Box>
                        </TD>
                        <TD>
                          <Typography sx={{ fontFamily:fMono, fontSize:"0.74rem" }}>
                            {row.lastSeen}
                          </Typography>
                        </TD>
                        <TD>
                          <StatusPill status={row.status} meta={MISSING_META} />
                        </TD>
                        <TD align="center">
                          {row.status !== "Reported Lost" ? (
                            <Button size="small" variant="outlined"
                              onClick={() => handleMarkLost(row.id)}
                              sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.71rem",
                                textTransform:"none", borderRadius:"7px",
                                borderColor:T.danger, color:T.danger,
                                "&:hover":{ bgcolor:T.dangerLight } }}>
                              Mark Lost
                            </Button>
                          ) : (
                            <Button size="small" variant="outlined"
                              onClick={() => toast(`FIR/write-off report for ${row.id} downloading…`)}
                              sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.71rem",
                                textTransform:"none", borderRadius:"7px",
                                borderColor:T.border, color:T.textSub,
                                "&:hover":{ bgcolor:"#F1F5F9" } }}>
                              Write-off
                            </Button>
                          )}
                        </TD>
                      </TableRow>
                    ))}
                    {filteredMissing.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={7} sx={{ textAlign:"center", py:5 }}>
                          <CheckCircle sx={{ fontSize:36, color:T.success,
                            display:"block", mx:"auto", mb:1.5 }} />
                          <Typography sx={{ fontFamily:fBody, color:T.textMute }}>
                            No missing assets match the search.
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </Box>
            </Box>
          )}

          {/* ════════════════════════════════
              TAB 1 — MAINTENANCE & AMC
          ════════════════════════════════ */}
          {tabIndex === 1 && (
            <Grid container spacing={3} className="fu">

              {/* Left: Tickets */}
              <Grid item xs={12} md={8}>
                {/* Ticket toolbar */}
                <Box display="flex" justifyContent="space-between"
                  alignItems="center" mb={2} flexWrap="wrap" gap={1}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Box sx={{ p:0.75, borderRadius:"8px",
                      bgcolor:T.warningLight, color:T.warning }}>
                      <Build sx={{ fontSize:15 }} />
                    </Box>
                    <Box>
                      <Typography sx={{ fontFamily:fHead, fontWeight:700,
                        fontSize:"0.9rem", color:T.text }}>Maintenance Tickets</Typography>
                      <Box display="flex" gap={1.5} mt={0.3}>
                        {[
                          { label:"Open",        value:openCount,     color:T.danger  },
                          { label:"In Progress", value:inProgCount,   color:T.warning },
                          { label:"Resolved",    value:resolvedCount, color:T.success },
                        ].map(s => (
                          <Box key={s.label} display="flex" alignItems="center" gap={0.4}>
                            <Box sx={{ width:5, height:5, borderRadius:"50%", bgcolor:s.color }} />
                            <Typography sx={{ fontFamily:fBody, fontSize:"0.67rem",
                              color:T.textMute }}>{s.label}:&nbsp;
                              <Box component="span" sx={{ fontFamily:fMono,
                                fontWeight:700, color:s.color }}>{s.value}</Box>
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  </Box>
                  <Box display="flex" gap={1} flexWrap="wrap" alignItems="center">
                    <TextField size="small" placeholder="Search tickets…"
                      value={tktSearch} onChange={e => setTktSearch(e.target.value)}
                      InputProps={{ startAdornment:
                        <InputAdornment position="start">
                          <Search sx={{ fontSize:14, color:T.textMute }} />
                        </InputAdornment>
                      }}
                      sx={{ width:175,
                        "& .MuiOutlinedInput-root":{ borderRadius:"8px",
                          fontFamily:fBody, fontSize:"0.78rem", bgcolor:T.surface,
                          "& fieldset":{ borderColor:T.border },
                          "&.Mui-focused fieldset":{ borderColor:T.accent } }}}
                    />
                    {["All","Open","In Progress","Resolved"].map(s => (
                      <Box key={s} onClick={() => setTktFilter(s)}
                        sx={{ px:1.1, py:0.32, borderRadius:"99px", cursor:"pointer",
                          fontFamily:fBody, fontSize:"0.69rem", fontWeight:700,
                          border:`1.5px solid ${tktFilter===s ? T.accent : T.border}`,
                          bgcolor: tktFilter===s ? T.accentLight : "transparent",
                          color:   tktFilter===s ? T.accent      : T.textMute,
                          transition:"all .13s" }}>
                        {s}
                      </Box>
                    ))}
                    <Button size="small" variant="contained"
                      startIcon={<Add sx={{fontSize:13}} />}
                      onClick={() => setAddTktDialog(true)}
                      sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.73rem",
                        textTransform:"none", borderRadius:"8px",
                        bgcolor:T.accent, boxShadow:"none",
                        "&:hover":{ bgcolor:"#4F46E5", boxShadow:"none" } }}>
                      New Ticket
                    </Button>
                  </Box>
                </Box>

                <Box sx={{ borderRadius:"10px", border:`1px solid ${T.border}`, overflow:"hidden" }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TH>Ticket</TH>
                        <TH>Asset &amp; Issue</TH>
                        <TH>Reported By</TH>
                        <TH>Priority</TH>
                        <TH>Technician</TH>
                        <TH>Status</TH>
                        <TH align="center">Action</TH>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredTickets.map(row => (
                        <TableRow key={row.id} className="row-h">
                          <TD sx={{ minWidth:95 }}>
                            <Typography sx={{ fontFamily:fMono, fontWeight:700,
                              fontSize:"0.72rem", color:T.accent }}>{row.id}</Typography>
                            <Typography sx={{ fontFamily:fMono, fontSize:"0.64rem",
                              color:T.textMute }}>{row.date}</Typography>
                          </TD>
                          <TD sx={{ minWidth:175 }}>
                            <Typography sx={{ fontFamily:fBody, fontWeight:700,
                              fontSize:"0.81rem", color:T.text }}>{row.assetName}</Typography>
                            <Typography sx={{ fontFamily:fBody, fontSize:"0.71rem",
                              color:T.danger }}>{row.issue}</Typography>
                          </TD>
                          <TD sx={{ minWidth:140 }}>
                            <Box display="flex" alignItems="center" gap={0.8}>
                              <Avatar sx={{ width:22, height:22, bgcolor:aColor(row.reportedBy).bg,
                                color:aColor(row.reportedBy).color,
                                fontFamily:fHead, fontSize:"0.52rem", fontWeight:700 }}>
                                {initials(row.reportedBy)}
                              </Avatar>
                              <Box>
                                <Typography sx={{ fontFamily:fBody, fontSize:"0.75rem",
                                  color:T.text, fontWeight:600 }}>{row.reportedBy}</Typography>
                                <Typography sx={{ fontFamily:fBody, fontSize:"0.63rem",
                                  color:T.textMute }}>{row.dept}</Typography>
                              </Box>
                            </Box>
                          </TD>
                          <TD>
                            <StatusPill status={row.priority} meta={PRIORITY_META} />
                          </TD>
                          <TD sx={{ minWidth:145 }}>
                            <Typography sx={{ fontFamily:fBody, fontSize:"0.76rem",
                              color: row.tech==="Unassigned" ? T.textMute : T.text,
                              fontStyle: row.tech==="Unassigned" ? "italic" : "normal" }}>
                              {row.tech}
                            </Typography>
                          </TD>
                          <TD>
                            <StatusPill status={row.status} meta={TICKET_STATUS_META} />
                          </TD>
                          <TD align="center">
                            <Box display="flex" gap={0.5} justifyContent="center">
                              {row.status === "Open" && (
                                <Tooltip title="Assign Technician">
                                  <IconButton size="small"
                                    onClick={() => { setSelectedTkt(row); setTechnician(""); setAssignDialog(true); }}
                                    sx={{ borderRadius:"7px", bgcolor:T.accentLight,
                                      color:T.accent, width:28, height:28,
                                      "&:hover":{ bgcolor:T.accent, color:"#fff" } }}>
                                    <AssignmentInd sx={{ fontSize:14 }} />
                                  </IconButton>
                                </Tooltip>
                              )}
                              {row.status === "In Progress" && (
                                <Tooltip title="Mark as Resolved">
                                  <IconButton size="small"
                                    onClick={() => handleCloseTicket(row.id)}
                                    sx={{ borderRadius:"7px", bgcolor:T.successLight,
                                      color:T.success, width:28, height:28,
                                      "&:hover":{ bgcolor:T.success, color:"#fff" } }}>
                                    <CheckCircle sx={{ fontSize:14 }} />
                                  </IconButton>
                                </Tooltip>
                              )}
                              {row.status === "Resolved" && (
                                <Box sx={{ px:0.9, py:0.3, borderRadius:"7px",
                                  bgcolor:T.successLight }}>
                                  <CheckCircle sx={{ fontSize:13, color:T.success }} />
                                </Box>
                              )}
                            </Box>
                          </TD>
                        </TableRow>
                      ))}
                      {filteredTickets.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={7} sx={{ textAlign:"center", py:5 }}>
                            <Build sx={{ fontSize:36, color:T.border,
                              display:"block", mx:"auto", mb:1.5 }} />
                            <Typography sx={{ fontFamily:fBody, color:T.textMute }}>
                              No tickets match the current filter.
                            </Typography>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </Box>
              </Grid>

              {/* Right: AMC */}
              <Grid item xs={12} md={4}>
                <Box display="flex" alignItems="center" gap={1} mb={2}>
                  <Box sx={{ p:0.75, borderRadius:"8px",
                    bgcolor:T.goldLight, color:T.gold }}>
                    <Receipt sx={{ fontSize:15 }} />
                  </Box>
                  <Typography sx={{ fontFamily:fHead, fontWeight:700,
                    fontSize:"0.9rem", color:T.text }}>AMC Contracts</Typography>
                </Box>

                <Stack spacing={1.8}>
                  {amcList.map(amc => {
                    const meta = AMC_META[amc.status] || { color:T.textMute, bg:"#F1F5F9" };
                    const isExpiring = amc.status === "Expiring Soon";
                    return (
                      <SCard key={amc.id} sx={{ p:2.2,
                        borderLeft:`4px solid ${meta.color}` }}>
                        <Box display="flex" justifyContent="space-between"
                          alignItems="flex-start" mb={1}>
                          <Typography sx={{ fontFamily:fBody, fontWeight:700,
                            fontSize:"0.82rem", color:T.text }}>{amc.vendor}</Typography>
                          <StatusPill status={amc.status} meta={AMC_META} />
                        </Box>

                        <Typography sx={{ fontFamily:fBody, fontSize:"0.74rem",
                          color:T.textSub, mb:1 }}>{amc.assets}</Typography>

                        <Box display="flex" justifyContent="space-between" mb={0.6}>
                          <Box display="flex" alignItems="center" gap={0.5}>
                            <CalendarMonth sx={{ fontSize:12, color:T.textMute }} />
                            <Typography sx={{ fontFamily:fMono, fontSize:"0.7rem",
                              color: isExpiring ? T.danger : T.textMute }}>
                              Expires {amc.expiry}
                            </Typography>
                          </Box>
                          <Typography sx={{ fontFamily:fMono, fontWeight:700,
                            fontSize:"0.73rem", color:T.accent }}>{amc.value}</Typography>
                        </Box>

                        {isExpiring && (
                          <Box sx={{ p:1, borderRadius:"7px", mb:1,
                            bgcolor:T.dangerLight, border:`1px solid ${T.danger}20` }}>
                            <Typography sx={{ fontFamily:fBody, fontSize:"0.69rem",
                              color:T.danger, fontWeight:700 }}>
                              ⚠ Contract expiring soon — initiate renewal.
                            </Typography>
                          </Box>
                        )}

                        <Button fullWidth size="small"
                          variant={isExpiring ? "contained" : "outlined"}
                          onClick={() => isExpiring
                            ? handleRenewAMC(amc.id)
                            : toast(`AMC details for ${amc.vendor} downloaded.`)}
                          sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.73rem",
                            textTransform:"none", borderRadius:"7px",
                            bgcolor: isExpiring ? T.danger : "transparent",
                            borderColor: isExpiring ? T.danger : T.border,
                            color: isExpiring ? "#fff"        : T.textSub,
                            boxShadow:"none",
                            "&:hover":{ bgcolor: isExpiring ? "#DC2626" : "#F1F5F9",
                              boxShadow:"none" } }}>
                          {isExpiring ? "Renew Contract" : "View Details"}
                        </Button>
                      </SCard>
                    );
                  })}
                </Stack>
              </Grid>
            </Grid>
          )}
        </Box>
      </SCard>

      {/* ── Verification Drive Dialog ── */}
      <Dialog open={verifyDialog} onClose={() => setVerifyDialog(false)}
        maxWidth="sm" fullWidth
        PaperProps={{ sx:{ borderRadius:"16px", border:`1px solid ${T.border}` } }}>
        <DialogTitle sx={{ borderBottom:`1px solid ${T.border}`, bgcolor:"#FAFBFD", pb:2 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box display="flex" alignItems="center" gap={1.5}>
              <Box sx={{ width:4, height:28, borderRadius:2, bgcolor:T.accent }} />
              <Box>
                <Typography sx={{ fontFamily:fHead, fontWeight:700,
                  fontSize:"0.96rem", color:T.text }}>Initiate Annual Verification</Typography>
                <Typography sx={{ fontFamily:fBody, fontSize:"0.72rem", color:T.textMute }}>
                  Triggers a system-wide asset scan request for all departments.
                </Typography>
              </Box>
            </Box>
            <IconButton size="small" onClick={() => setVerifyDialog(false)}
              sx={{ bgcolor:"#F1F5F9", borderRadius:"8px" }}>
              <Close fontSize="small" />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ px:3, pt:3, pb:2 }}>
          <Box sx={{ p:2, borderRadius:"9px", mb:2.5,
            bgcolor:T.warningLight, border:`1px solid ${T.warning}25`,
            display:"flex", gap:1, alignItems:"flex-start" }}>
            <Warning sx={{ fontSize:16, color:T.warning, flexShrink:0, mt:0.1 }} />
            <Typography sx={{ fontFamily:fBody, fontSize:"0.76rem",
              color:T.textSub, lineHeight:1.65 }}>
              This will send verification requests to <strong>all faculty and departments</strong>.
              Staff must scan / confirm all assigned assets before the deadline.
              Compliance status will be tracked automatically.
            </Typography>
          </Box>
          <SLabel sx={{ mb:0.7 }}>Completion Deadline *</SLabel>
          <DInput type="date" value={newDeadline}
            onChange={e => setNewDeadline(e.target.value)}
            InputLabelProps={{ shrink:true }}
          />
        </DialogContent>
        <DialogActions sx={{ px:3, pb:3, pt:2,
          borderTop:`1px solid ${T.border}`, bgcolor:"#FAFBFD", gap:1 }}>
          <Button onClick={() => setVerifyDialog(false)} variant="outlined" size="small"
            sx={{ fontFamily:fBody, fontWeight:600, fontSize:"0.78rem",
              textTransform:"none", borderRadius:"8px",
              borderColor:T.border, color:T.textSub }}>
            Cancel
          </Button>
          <Button variant="contained" size="small"
            startIcon={<VerifiedUser sx={{fontSize:14}} />}
            onClick={handleInitiateVerification}
            sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.78rem",
              textTransform:"none", borderRadius:"8px",
              bgcolor:T.accent, boxShadow:"none",
              "&:hover":{ bgcolor:"#4F46E5", boxShadow:"none" } }}>
            Start Drive &amp; Notify All
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── Assign Technician Dialog ── */}
      <Dialog open={assignDialog} onClose={() => setAssignDialog(false)}
        maxWidth="sm" fullWidth
        PaperProps={{ sx:{ borderRadius:"16px", border:`1px solid ${T.border}` } }}>
        {selectedTkt && (
          <>
            <DialogTitle sx={{ borderBottom:`1px solid ${T.border}`, bgcolor:"#FAFBFD", pb:2 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box display="flex" alignItems="center" gap={1.5}>
                  <Box sx={{ width:4, height:28, borderRadius:2, bgcolor:T.accent }} />
                  <Box>
                    <Typography sx={{ fontFamily:fHead, fontWeight:700,
                      fontSize:"0.96rem", color:T.text }}>Assign Technician</Typography>
                    <Typography sx={{ fontFamily:fBody, fontSize:"0.72rem", color:T.textMute }}>
                      {selectedTkt.id} · {selectedTkt.assetName}
                    </Typography>
                  </Box>
                </Box>
                <IconButton size="small" onClick={() => setAssignDialog(false)}
                  sx={{ bgcolor:"#F1F5F9", borderRadius:"8px" }}>
                  <Close fontSize="small" />
                </IconButton>
              </Box>
            </DialogTitle>
            <DialogContent sx={{ px:3, pt:3, pb:2 }}>
              <Grid container spacing={1.5} mb={2.5}>
                {[
                  { label:"Ticket ID",   value:selectedTkt.id          },
                  { label:"Asset",       value:selectedTkt.assetName   },
                  { label:"Issue",       value:selectedTkt.issue        },
                  { label:"Reported By", value:selectedTkt.reportedBy  },
                  { label:"Date Raised", value:selectedTkt.date        },
                  { label:"Priority",    value:selectedTkt.priority    },
                ].map(s => (
                  <Grid item xs={6} key={s.label}>
                    <Box sx={{ p:1.3, borderRadius:"8px",
                      bgcolor:"#F9FAFB", border:`1px solid ${T.border}` }}>
                      <SLabel sx={{ mb:0.2 }}>{s.label}</SLabel>
                      <Typography sx={{ fontFamily:fBody, fontWeight:600,
                        fontSize:"0.81rem", color:T.text }}>{s.value}</Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
              <SLabel sx={{ mb:0.7 }}>Select Technician / Vendor *</SLabel>
              <DInput select value={technician}
                onChange={e => setTechnician(e.target.value)}>
                <MenuItem value="" sx={{ fontFamily:fBody, fontSize:"0.82rem", color:T.textMute }}>
                  — Select —
                </MenuItem>
                {TECHNICIANS.map(t => (
                  <MenuItem key={t} value={t}
                    sx={{ fontFamily:fBody, fontSize:"0.82rem" }}>{t}</MenuItem>
                ))}
              </DInput>
            </DialogContent>
            <DialogActions sx={{ px:3, pb:3, pt:2,
              borderTop:`1px solid ${T.border}`, bgcolor:"#FAFBFD", gap:1 }}>
              <Button onClick={() => setAssignDialog(false)} variant="outlined" size="small"
                sx={{ fontFamily:fBody, fontWeight:600, fontSize:"0.78rem",
                  textTransform:"none", borderRadius:"8px",
                  borderColor:T.border, color:T.textSub }}>
                Cancel
              </Button>
              <Button variant="contained" size="small"
                startIcon={<AssignmentInd sx={{fontSize:14}} />}
                onClick={handleAssignTech}
                sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.78rem",
                  textTransform:"none", borderRadius:"8px",
                  bgcolor:T.accent, boxShadow:"none",
                  "&:hover":{ bgcolor:"#4F46E5", boxShadow:"none" } }}>
                Assign &amp; Notify
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* ── Add Ticket Dialog ── */}
      <Dialog open={addTktDialog} onClose={() => setAddTktDialog(false)}
        maxWidth="sm" fullWidth
        PaperProps={{ sx:{ borderRadius:"16px", border:`1px solid ${T.border}` } }}>
        <DialogTitle sx={{ borderBottom:`1px solid ${T.border}`, bgcolor:"#FAFBFD", pb:2 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box display="flex" alignItems="center" gap={1.5}>
              <Box sx={{ width:4, height:28, borderRadius:2, bgcolor:T.warning }} />
              <Box>
                <Typography sx={{ fontFamily:fHead, fontWeight:700,
                  fontSize:"0.96rem", color:T.text }}>Raise Maintenance Ticket</Typography>
                <Typography sx={{ fontFamily:fBody, fontSize:"0.72rem", color:T.textMute }}>
                  Report a new asset issue for technician assignment.
                </Typography>
              </Box>
            </Box>
            <IconButton size="small" onClick={() => setAddTktDialog(false)}
              sx={{ bgcolor:"#F1F5F9", borderRadius:"8px" }}>
              <Close fontSize="small" />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ px:3, pt:3, pb:2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <SLabel sx={{ mb:0.7 }}>Asset Name / ID *</SLabel>
              <DInput value={newTkt.asset}
                onChange={e => setNewTkt(p => ({ ...p, asset:e.target.value }))}
                placeholder="e.g. AST-031 — Lab Centrifuge"
              />
            </Grid>
            <Grid item xs={12}>
              <SLabel sx={{ mb:0.7 }}>Issue Description *</SLabel>
              <DInput multiline rows={2} value={newTkt.issue}
                onChange={e => setNewTkt(p => ({ ...p, issue:e.target.value }))}
                placeholder="Describe the fault or problem…"
              />
            </Grid>
            <Grid item xs={6}>
              <SLabel sx={{ mb:0.7 }}>Priority</SLabel>
              <DInput select value={newTkt.priority}
                onChange={e => setNewTkt(p => ({ ...p, priority:e.target.value }))}>
                {["High","Medium","Low"].map(v => (
                  <MenuItem key={v} value={v}
                    sx={{ fontFamily:fBody, fontSize:"0.82rem" }}>{v}</MenuItem>
                ))}
              </DInput>
            </Grid>
            <Grid item xs={6}>
              <SLabel sx={{ mb:0.7 }}>Department</SLabel>
              <DInput value={newTkt.dept}
                onChange={e => setNewTkt(p => ({ ...p, dept:e.target.value }))}
                placeholder="e.g. CSE, Admin"
              />
            </Grid>
            <Grid item xs={12}>
              <SLabel sx={{ mb:0.7 }}>Reported By</SLabel>
              <DInput value={newTkt.reportedBy}
                onChange={e => setNewTkt(p => ({ ...p, reportedBy:e.target.value }))}
                placeholder="Name of person reporting the issue"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px:3, pb:3, pt:2,
          borderTop:`1px solid ${T.border}`, bgcolor:"#FAFBFD", gap:1 }}>
          <Button onClick={() => setAddTktDialog(false)} variant="outlined" size="small"
            sx={{ fontFamily:fBody, fontWeight:600, fontSize:"0.78rem",
              textTransform:"none", borderRadius:"8px",
              borderColor:T.border, color:T.textSub }}>
            Cancel
          </Button>
          <Button variant="contained" size="small"
            startIcon={<Add sx={{fontSize:14}} />}
            onClick={handleAddTicket}
            sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.78rem",
              textTransform:"none", borderRadius:"8px",
              bgcolor:T.warning, boxShadow:"none",
              "&:hover":{ bgcolor:T.gold, boxShadow:"none" } }}>
            Create Ticket
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

export default AssetMaintenanceView;