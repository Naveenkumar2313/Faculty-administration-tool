import React, { useState, useEffect, useMemo } from "react";
import {
  Box, Grid, Typography, Button, TextField, MenuItem,
  Tabs, Tab, Table, TableBody, TableCell, TableHead, TableRow,
  IconButton, Tooltip, Dialog, DialogTitle, DialogContent,
  DialogActions, InputAdornment, Stack, Snackbar, Alert,
  Divider, Avatar
} from "@mui/material";
import {
  Gavel, Description, CloudUpload, Add, CheckCircle,
  Cancel, Warning, Timer, Print, Close, Search,
  Refresh, Download, FileDownload, Shield, AttachMoney,
  HourglassEmpty, Article
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
    .blink { animation: pulse 2s infinite; }
  `}</style>
);

/* ─────────────────────────────────────────
   MOCK DATA
───────────────────────────────────────── */
const FACULTY_LIST = [
  { id:101, name:"Dr. Sarah Smith",    dept:"CSE"       },
  { id:102, name:"Prof. Rajan Kumar",  dept:"Mech"      },
  { id:103, name:"Ms. Priya Roy",      dept:"Civil"     },
  { id:104, name:"Dr. Emily Davis",    dept:"ECE"       },
  { id:105, name:"Dr. Vikram Nair",    dept:"Science"   },
];

const BONDS_INIT = [
  { id:1, faculty:"Dr. Sarah Smith",   dept:"CSE",    type:"Ph.D. Sponsorship", value:500000, start:"2023-06-01", end:"2026-05-31", status:"Active"         },
  { id:2, faculty:"Prof. Rajan Kumar", dept:"Mech",   type:"Study Leave Bond",  value:200000, start:"2024-01-01", end:"2025-12-31", status:"Active"         },
  { id:3, faculty:"Ms. Priya Roy",     dept:"Civil",  type:"Training Bond",     value:50000,  start:"2023-03-01", end:"2026-03-01", status:"Expiring Soon"  },
  { id:4, faculty:"Dr. Vikram Nair",   dept:"Science",type:"Ph.D. Sponsorship", value:350000, start:"2022-08-01", end:"2025-07-31", status:"Completed"      },
];

const NOC_INIT = [
  { id:1, faculty:"Dr. Emily Davis",   avatar:"ED", dept:"ECE",    purpose:"Part-time PhD Enrolment",   org:"IIT Delhi",   date:"2026-02-01", status:"Pending",  remarks:"" },
  { id:2, faculty:"Mr. Arjun Singh",   avatar:"AS", dept:"CSE",    purpose:"Consultancy Project",       org:"TechCorp Inc.",date:"2026-01-28", status:"Approved", remarks:"Approved subject to zero impact on teaching." },
  { id:3, faculty:"Ms. Kavya Sharma",  avatar:"KS", dept:"ECE",    purpose:"Foreign University Visit",  org:"MIT, USA",    date:"2026-02-10", status:"Pending",  remarks:"" },
  { id:4, faculty:"Dr. Sunita Pillai", avatar:"SP", dept:"Science",purpose:"Conference Presentation",   org:"IEEE Tokyo",  date:"2026-01-15", status:"Rejected", remarks:"Clash with semester exams." },
];

const BOND_TYPES = [
  "Ph.D. Sponsorship",
  "Study Leave Bond",
  "Training Bond",
  "Higher Education Bond",
  "Foreign Deputation Bond",
];

const AVATAR_COLORS = [
  { bg:"#EEF2FF", color:"#6366F1" },
  { bg:"#ECFDF5", color:"#10B981" },
  { bg:"#F5F3FF", color:"#7C3AED" },
  { bg:"#FFFBEB", color:"#F59E0B" },
  { bg:"#F0F9FF", color:"#0EA5E9" },
  { bg:"#FEF2F2", color:"#EF4444" },
];
const aColor = (name) => AVATAR_COLORS[(name || "A").charCodeAt(0) % AVATAR_COLORS.length];

const NOC_STATUS_META = {
  Pending:  { color:T.warning, bg:T.warningLight },
  Approved: { color:T.success, bg:T.successLight },
  Rejected: { color:T.danger,  bg:T.dangerLight  },
};

const BOND_STATUS_META = {
  Active:          { color:T.success, bg:T.successLight },
  "Expiring Soon": { color:T.danger,  bg:T.dangerLight  },
  Completed:       { color:T.textMute, bg:"#F1F5F9"     },
  Released:        { color:T.purple,  bg:T.purpleLight  },
};

/* ─────────────────────────────────────────
   HELPERS
───────────────────────────────────────── */
const fmt = (n) => `₹${Number(n).toLocaleString("en-IN")}`;

const getRemainingMonths = (endDate) => {
  const end = new Date(endDate), now = new Date();
  const m = (end.getFullYear() - now.getFullYear()) * 12 + (end.getMonth() - now.getMonth());
  return Math.max(0, m);
};

const getProgress = (start, end) => {
  const s = new Date(start), e = new Date(end), n = new Date();
  return Math.min(100, Math.max(0, Math.round(((n - s) / (e - s)) * 100)));
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
  const s = (meta || {})[status] || { color:T.textMute, bg:"#F1F5F9" };
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

/* ═════════════════════════════════════════════
   MAIN COMPONENT
═════════════════════════════════════════════ */
const BondManagementView = () => {
  const [tabIndex,     setTabIndex]     = useState(0);

  /* Bond form */
  const [bondForm,     setBondForm]     = useState({
    facultyId:"", type:"Ph.D. Sponsorship", value:"",
    startDate:"", duration:3, endDate:"",
  });
  const [uploadedBond, setUploadedBond] = useState(null);
  const [activeBonds,  setActiveBonds]  = useState(BONDS_INIT);
  const [bondFilter,   setBondFilter]   = useState("All");

  /* NOC state */
  const [nocRequests,  setNocRequests]  = useState(NOC_INIT);
  const [selectedNoc,  setSelectedNoc]  = useState(null);
  const [nocDialog,    setNocDialog]    = useState(false);
  const [nocRemarks,   setNocRemarks]   = useState("");
  const [nocSearch,    setNocSearch]    = useState("");
  const [nocFilter,    setNocFilter]    = useState("All");

  const [snack, setSnack] = useState({ open:false, msg:"", severity:"success" });
  const toast = (msg, severity="success") => setSnack({ open:true, msg, severity });
  const setField = (k, v) => setBondForm(p => ({ ...p, [k]:v }));

  /* Auto end-date */
  useEffect(() => {
    if (bondForm.startDate && bondForm.duration) {
      const d = new Date(bondForm.startDate);
      d.setFullYear(d.getFullYear() + parseInt(bondForm.duration));
      d.setDate(d.getDate() - 1);
      setField("endDate", d.toISOString().split("T")[0]);
    }
  }, [bondForm.startDate, bondForm.duration]);

  /* Create bond */
  const handleCreateBond = () => {
    if (!bondForm.facultyId || !bondForm.value || !bondForm.startDate) {
      toast("Please fill Faculty, Bond Value, and Start Date.", "error"); return;
    }
    const fac = FACULTY_LIST.find(f => f.id === bondForm.facultyId);
    setActiveBonds(p => [{
      id:Date.now(), faculty:fac.name, dept:fac.dept,
      type:bondForm.type, value:+bondForm.value,
      start:bondForm.startDate, end:bondForm.endDate, status:"Active",
    }, ...p]);
    setBondForm({ facultyId:"", type:"Ph.D. Sponsorship", value:"", startDate:"", duration:3, endDate:"" });
    setUploadedBond(null);
    toast(`Bond registered for ${fac.name}.`);
  };

  /* NOC action */
  const handleNocAction = (action) => {
    const status = action === "approve" ? "Approved" : "Rejected";
    setNocRequests(p => p.map(r =>
      r.id === selectedNoc.id ? { ...r, status, remarks:nocRemarks } : r
    ));
    setNocDialog(false);
    toast(`NOC ${status.toLowerCase()} for ${selectedNoc.faculty}.`,
      action === "approve" ? "success" : "error");
  };

  /* Release bond */
  const handleRelease = (id) => {
    setActiveBonds(p => p.map(b => b.id===id ? { ...b, status:"Released" } : b));
    toast("Bond release request submitted.");
  };

  /* Filtered lists */
  const filteredBonds = useMemo(() =>
    bondFilter === "All" ? activeBonds : activeBonds.filter(b => b.status === bondFilter),
  [activeBonds, bondFilter]);

  const filteredNoc = useMemo(() => nocRequests.filter(r => {
    const q = nocSearch.toLowerCase();
    if (q && !r.faculty.toLowerCase().includes(q) && !r.org.toLowerCase().includes(q)) return false;
    if (nocFilter !== "All" && r.status !== nocFilter) return false;
    return true;
  }), [nocRequests, nocSearch, nocFilter]);

  /* Stats */
  const activeBondCount  = activeBonds.filter(b => b.status==="Active").length;
  const expiringCount    = activeBonds.filter(b => b.status==="Expiring Soon").length;
  const totalBondValue   = activeBonds.filter(b=>["Active","Expiring Soon"].includes(b.status)).reduce((s,b)=>s+b.value,0);
  const pendingNocCount  = nocRequests.filter(r => r.status==="Pending").length;

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
            Contracts &amp; Bonds Administration
          </Typography>
          <Typography sx={{ fontFamily:fBody, fontSize:"0.82rem", color:T.textSub, mt:0.3 }}>
            Manage service bonds, study leave agreements, and faculty NOC requests.
          </Typography>
        </Box>
        <Button size="small" variant="outlined"
          startIcon={<FileDownload sx={{fontSize:15}} />}
          onClick={() => toast("Bond registry exported.")}
          sx={{ fontFamily:fBody, fontWeight:600, fontSize:"0.76rem", textTransform:"none",
            borderRadius:"8px", borderColor:T.border, color:T.textSub, mt:0.5,
            "&:hover":{ borderColor:T.accent, color:T.accent } }}>
          Export Registry
        </Button>
      </Box>

      {/* ── Stat Strip ── */}
      <Grid container spacing={2} mb={3}>
        {[
          { label:"Active Bonds",        value:activeBondCount,      sub:"Currently enforced",          color:T.success, Icon:Shield       },
          { label:"Expiring ≤ 3 Months", value:expiringCount,        sub:"Require renewal/action",      color:T.danger,  Icon:Timer        },
          { label:"Total Bond Value",    value:fmt(totalBondValue),  sub:"Active + expiring bonds",     color:T.accent,  Icon:AttachMoney  },
          { label:"Pending NOC",         value:pendingNocCount,      sub:"Awaiting admin review",       color:T.warning, Icon:HourglassEmpty},
        ].map((s,i) => (
          <Grid item xs={6} md={3} key={i}>
            <SCard hover sx={{ p:2.5 }} className={`fu${i}`}>
              <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                <Box>
                  <SLabel>{s.label}</SLabel>
                  <Typography sx={{ fontFamily:fMono, fontWeight:700, fontSize:"1.45rem",
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
              { label:"Service Bonds",   Icon:Gavel       },
              { label:"NOC & Clearance", Icon:Description },
            ].map((t,i) => (
              <Tab key={i} icon={<t.Icon sx={{fontSize:16}} />}
                iconPosition="start" label={t.label} />
            ))}
          </Tabs>
        </Box>

        <Box p={3}>

          {/* ════════════════════════════════
              TAB 0 — SERVICE BONDS
          ════════════════════════════════ */}
          {tabIndex === 0 && (
            <Grid container spacing={3} className="fu">

              {/* Left: Create Bond Form */}
              <Grid item xs={12} md={4}>
                <SCard sx={{ p:0, overflow:"hidden" }}>
                  <Box sx={{ px:2.5, py:2, borderBottom:`1px solid ${T.border}`,
                    bgcolor:"#FAFBFD", display:"flex", alignItems:"center", gap:1 }}>
                    <Box sx={{ p:0.75, borderRadius:"8px",
                      bgcolor:T.accentLight, color:T.accent }}>
                      <Add sx={{ fontSize:15 }} />
                    </Box>
                    <Typography sx={{ fontFamily:fHead, fontWeight:700,
                      fontSize:"0.88rem", color:T.text }}>Register Service Bond</Typography>
                  </Box>

                  <Box sx={{ p:2.5 }}>
                    <Stack spacing={2}>

                      <Box>
                        <SLabel sx={{ mb:0.7 }}>Faculty Member *</SLabel>
                        <DInput select value={bondForm.facultyId}
                          onChange={e => setField("facultyId", +e.target.value)}>
                          <MenuItem value="" sx={{ fontFamily:fBody, fontSize:"0.82rem", color:T.textMute }}>
                            — Select faculty —
                          </MenuItem>
                          {FACULTY_LIST.map(f => (
                            <MenuItem key={f.id} value={f.id}
                              sx={{ fontFamily:fBody, fontSize:"0.82rem" }}>
                              {f.name}
                              <Typography component="span" sx={{ ml:1,
                                fontFamily:fBody, fontSize:"0.72rem", color:T.textMute }}>
                                ({f.dept})
                              </Typography>
                            </MenuItem>
                          ))}
                        </DInput>
                      </Box>

                      <Box>
                        <SLabel sx={{ mb:0.7 }}>Bond Type *</SLabel>
                        <DInput select value={bondForm.type}
                          onChange={e => setField("type", e.target.value)}>
                          {BOND_TYPES.map(t => (
                            <MenuItem key={t} value={t}
                              sx={{ fontFamily:fBody, fontSize:"0.82rem" }}>{t}</MenuItem>
                          ))}
                        </DInput>
                      </Box>

                      <Grid container spacing={1.5}>
                        <Grid item xs={6}>
                          <SLabel sx={{ mb:0.7 }}>Bond Value (₹) *</SLabel>
                          <DInput type="number" value={bondForm.value}
                            onChange={e => setField("value", e.target.value)}
                            InputProps={{ startAdornment:
                              <InputAdornment position="start">
                                <Typography sx={{ fontFamily:fMono, fontSize:"0.78rem",
                                  color:T.textMute }}>₹</Typography>
                              </InputAdornment>
                            }}
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <SLabel sx={{ mb:0.7 }}>Duration (Years)</SLabel>
                          <DInput type="number" value={bondForm.duration}
                            onChange={e => setField("duration", e.target.value)}
                            InputProps={{ inputProps:{ min:1, max:10 },
                              endAdornment:
                                <InputAdornment position="end">
                                  <Typography sx={{ fontFamily:fBody, fontSize:"0.74rem",
                                    color:T.textMute }}>
                                    yr{bondForm.duration!=1?"s":""}
                                  </Typography>
                                </InputAdornment>
                            }}
                          />
                        </Grid>
                      </Grid>

                      <Grid container spacing={1.5}>
                        <Grid item xs={6}>
                          <SLabel sx={{ mb:0.7 }}>Start Date *</SLabel>
                          <DInput type="date" value={bondForm.startDate}
                            onChange={e => setField("startDate", e.target.value)}
                            InputLabelProps={{ shrink:true }}
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <SLabel sx={{ mb:0.7 }}>End Date (auto)</SLabel>
                          <DInput value={bondForm.endDate} disabled
                            sx={{ "& .MuiOutlinedInput-root":{ bgcolor:"#F9FAFB" } }}
                          />
                        </Grid>
                      </Grid>

                      {bondForm.endDate && (
                        <Box sx={{ px:1.3, py:0.8, borderRadius:"8px",
                          bgcolor:T.successLight, border:`1px solid ${T.success}25` }}>
                          <Typography sx={{ fontFamily:fBody, fontSize:"0.73rem",
                            fontWeight:600, color:T.success }}>
                            Bond ends&nbsp;
                            <Box component="span" sx={{ fontFamily:fMono, fontWeight:700 }}>
                              {bondForm.endDate}
                            </Box>
                            &nbsp;({bondForm.duration} year{bondForm.duration!=1?"s":""})
                          </Typography>
                        </Box>
                      )}

                      <Box>
                        <SLabel sx={{ mb:0.7 }}>Signed Bond Document (PDF)</SLabel>
                        <Box sx={{ p:2, borderRadius:"9px", textAlign:"center",
                          border:`2px dashed ${uploadedBond ? T.success : T.border}`,
                          bgcolor: uploadedBond ? T.successLight : "#FAFBFD",
                          cursor:"pointer", transition:"all .15s" }}
                          onClick={() => document.getElementById("bond-upload").click()}>
                          <input id="bond-upload" type="file" accept="application/pdf"
                            style={{ display:"none" }}
                            onChange={e => {
                              if (e.target.files[0]) {
                                setUploadedBond(e.target.files[0].name);
                                toast("Bond document uploaded.");
                              }
                            }} />
                          {uploadedBond ? (
                            <Box display="flex" justifyContent="center" alignItems="center" gap={1}>
                              <CheckCircle sx={{ fontSize:16, color:T.success }} />
                              <Typography sx={{ fontFamily:fBody, fontWeight:700,
                                fontSize:"0.75rem", color:T.success }}>{uploadedBond}</Typography>
                            </Box>
                          ) : (
                            <Box>
                              <CloudUpload sx={{ fontSize:22, color:T.textMute, mb:0.3 }} />
                              <Typography sx={{ fontFamily:fBody, fontSize:"0.74rem",
                                color:T.textMute }}>Click to upload PDF</Typography>
                            </Box>
                          )}
                        </Box>
                      </Box>

                      <Button variant="contained" fullWidth size="large"
                        startIcon={<Add sx={{fontSize:18}} />}
                        onClick={handleCreateBond}
                        sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.88rem",
                          textTransform:"none", borderRadius:"9px", py:1.2,
                          bgcolor:T.accent, boxShadow:"none",
                          "&:hover":{ bgcolor:"#4F46E5", boxShadow:"none" } }}>
                        Register Bond
                      </Button>
                    </Stack>
                  </Box>
                </SCard>
              </Grid>

              {/* Right: Bond Tracker */}
              <Grid item xs={12} md={8}>
                <Box display="flex" justifyContent="space-between"
                  alignItems="center" mb={2} flexWrap="wrap" gap={1}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Box sx={{ p:0.75, borderRadius:"8px",
                      bgcolor:T.accentLight, color:T.accent }}>
                      <Shield sx={{ fontSize:15 }} />
                    </Box>
                    <Typography sx={{ fontFamily:fHead, fontWeight:700,
                      fontSize:"0.9rem", color:T.text }}>Active Bond Tracker</Typography>
                  </Box>
                  <Box display="flex" gap={0.8} flexWrap="wrap">
                    {["All","Active","Expiring Soon","Completed","Released"].map(s => (
                      <Box key={s} onClick={() => setBondFilter(s)}
                        sx={{ px:1.2, py:0.35, borderRadius:"99px", cursor:"pointer",
                          fontFamily:fBody, fontSize:"0.7rem", fontWeight:700,
                          border:`1.5px solid ${bondFilter===s ? T.accent : T.border}`,
                          bgcolor: bondFilter===s ? T.accentLight : "transparent",
                          color:   bondFilter===s ? T.accent      : T.textMute,
                          transition:"all .13s" }}>
                        {s}
                      </Box>
                    ))}
                  </Box>
                </Box>

                <Box sx={{ borderRadius:"10px", border:`1px solid ${T.border}`, overflow:"hidden" }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TH>Faculty</TH>
                        <TH>Bond Type</TH>
                        <TH align="right">Value</TH>
                        <TH sx={{ minWidth:170 }}>Bond Timeline</TH>
                        <TH>Status</TH>
                        <TH align="center">Action</TH>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredBonds.map(row => {
                        const rem        = getRemainingMonths(row.end);
                        const prg        = getProgress(row.start, row.end);
                        const isExpiring = row.status === "Expiring Soon" || rem <= 3;
                        const isActive   = ["Active","Expiring Soon"].includes(row.status);
                        const barClr     = row.status==="Completed" ? T.textMute
                                         : isExpiring ? T.danger : T.accent;
                        const av         = aColor(row.faculty);

                        return (
                          <TableRow key={row.id} className="row-h">
                            <TD sx={{ minWidth:165 }}>
                              <Box display="flex" alignItems="center" gap={1.2}>
                                <Avatar sx={{ width:30, height:30, bgcolor:av.bg,
                                  color:av.color, fontFamily:fHead,
                                  fontSize:"0.62rem", fontWeight:700 }}>
                                  {row.faculty.split(" ").slice(-2).map(w=>w[0]).join("")}
                                </Avatar>
                                <Box>
                                  <Typography sx={{ fontFamily:fBody, fontWeight:700,
                                    fontSize:"0.81rem", color:T.text }}>{row.faculty}</Typography>
                                  <Typography sx={{ fontFamily:fBody, fontSize:"0.67rem",
                                    color:T.textMute }}>{row.dept}</Typography>
                                </Box>
                              </Box>
                            </TD>

                            <TD>
                              <Box sx={{ px:1, py:0.25, borderRadius:"6px",
                                bgcolor:T.purpleLight, display:"inline-block" }}>
                                <Typography sx={{ fontFamily:fBody, fontSize:"0.68rem",
                                  fontWeight:700, color:T.purple }}>{row.type}</Typography>
                              </Box>
                            </TD>

                            <TD align="right">
                              <Typography sx={{ fontFamily:fMono, fontWeight:700,
                                fontSize:"0.83rem", color:T.text }}>{fmt(row.value)}</Typography>
                            </TD>

                            <TD>
                              <Box display="flex" justifyContent="space-between" mb={0.5}>
                                <Typography sx={{ fontFamily:fBody, fontSize:"0.67rem",
                                  color:T.textMute }}>Ends {row.end}</Typography>
                                <Typography sx={{ fontFamily:fMono, fontSize:"0.67rem",
                                  fontWeight:700,
                                  color: row.status==="Completed" ? T.textMute
                                       : isExpiring ? T.danger : T.accent }}>
                                  {row.status==="Completed" ? "Done" : `${rem}mo left`}
                                </Typography>
                              </Box>
                              <Box sx={{ height:5, borderRadius:99, bgcolor:T.border, overflow:"hidden" }}>
                                <Box sx={{ height:"100%", width:`${prg}%`, borderRadius:99,
                                  bgcolor:barClr, transition:"width 1.2s ease" }} />
                              </Box>
                            </TD>

                            <TD>
                              <StatusPill status={row.status} meta={BOND_STATUS_META} />
                            </TD>

                            <TD align="center">
                              {["Completed","Released"].includes(row.status) ? (
                                <Tooltip title="Download bond certificate">
                                  <IconButton size="small"
                                    sx={{ borderRadius:"7px", bgcolor:"#F1F5F9",
                                      color:T.textSub, width:28, height:28,
                                      "&:hover":{ bgcolor:T.accentLight, color:T.accent } }}
                                    onClick={() => toast(`Bond document for ${row.faculty} downloading…`)}>
                                    <Download sx={{ fontSize:13 }} />
                                  </IconButton>
                                </Tooltip>
                              ) : isActive ? (
                                <Tooltip title={isExpiring
                                  ? "Submit release request"
                                  : "Download bond document"}>
                                  <Button size="small"
                                    variant={isExpiring ? "contained" : "outlined"}
                                    onClick={() => isExpiring
                                      ? handleRelease(row.id)
                                      : toast(`Bond document for ${row.faculty} downloading…`)}
                                    sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.7rem",
                                      textTransform:"none", borderRadius:"7px",
                                      bgcolor: isExpiring ? T.danger    : "transparent",
                                      borderColor: isExpiring ? T.danger : T.border,
                                      color: isExpiring ? "#fff"        : T.textSub,
                                      boxShadow:"none",
                                      "&:hover":{ bgcolor: isExpiring ? "#DC2626" : "#F1F5F9",
                                        boxShadow:"none" } }}>
                                    {isExpiring ? "Release" : "Document"}
                                  </Button>
                                </Tooltip>
                              ) : null}
                            </TD>
                          </TableRow>
                        );
                      })}

                      {filteredBonds.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={6} sx={{ textAlign:"center", py:6 }}>
                            <Shield sx={{ fontSize:36, color:T.border,
                              display:"block", mx:"auto", mb:1.5 }} />
                            <Typography sx={{ fontFamily:fBody, color:T.textMute }}>
                              No bonds match the selected filter.
                            </Typography>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </Box>
              </Grid>
            </Grid>
          )}

          {/* ════════════════════════════════
              TAB 1 — NOC & CLEARANCE
          ════════════════════════════════ */}
          {tabIndex === 1 && (
            <Box className="fu">

              {/* Toolbar */}
              <Box display="flex" justifyContent="space-between"
                alignItems="flex-start" mb={2.5} flexWrap="wrap" gap={1.5}>
                <Box display="flex" alignItems="center" gap={1}>
                  <Box sx={{ p:0.75, borderRadius:"8px",
                    bgcolor:T.purpleLight, color:T.purple }}>
                    <Description sx={{ fontSize:15 }} />
                  </Box>
                  <Box>
                    <Typography sx={{ fontFamily:fHead, fontWeight:700,
                      fontSize:"0.9rem", color:T.text }}>NOC Requests Queue</Typography>
                    <Typography sx={{ fontFamily:fBody, fontSize:"0.72rem", color:T.textMute }}>
                      {pendingNocCount} request{pendingNocCount!==1?"s":""} awaiting review
                    </Typography>
                  </Box>
                </Box>

                <Box display="flex" gap={1.2} flexWrap="wrap" alignItems="center">
                  <TextField size="small" placeholder="Search by faculty or org…"
                    value={nocSearch} onChange={e => setNocSearch(e.target.value)}
                    InputProps={{ startAdornment:
                      <InputAdornment position="start">
                        <Search sx={{ fontSize:15, color:T.textMute }} />
                      </InputAdornment>
                    }}
                    sx={{ width:220,
                      "& .MuiOutlinedInput-root":{ borderRadius:"8px",
                        fontFamily:fBody, fontSize:"0.8rem", bgcolor:T.surface,
                        "& fieldset":{ borderColor:T.border },
                        "&.Mui-focused fieldset":{ borderColor:T.accent } }}}
                  />

                  <Box display="flex" gap={0.7}>
                    {["All","Pending","Approved","Rejected"].map(s => (
                      <Box key={s} onClick={() => setNocFilter(s)}
                        sx={{ px:1.2, py:0.35, borderRadius:"99px", cursor:"pointer",
                          fontFamily:fBody, fontSize:"0.71rem", fontWeight:700,
                          border:`1.5px solid ${nocFilter===s ? T.accent : T.border}`,
                          bgcolor: nocFilter===s ? T.accentLight : "transparent",
                          color:   nocFilter===s ? T.accent      : T.textMute,
                          transition:"all .13s" }}>
                        {s}
                      </Box>
                    ))}
                  </Box>

                  {(nocSearch || nocFilter!=="All") && (
                    <Tooltip title="Reset filters">
                      <IconButton size="small"
                        onClick={() => { setNocSearch(""); setNocFilter("All"); }}
                        sx={{ borderRadius:"8px", border:`1px solid ${T.border}`,
                          "&:hover":{ bgcolor:T.dangerLight, color:T.danger } }}>
                        <Refresh sx={{ fontSize:15 }} />
                      </IconButton>
                    </Tooltip>
                  )}
                </Box>
              </Box>

              {/* NOC table */}
              <Box sx={{ borderRadius:"10px", border:`1px solid ${T.border}`, overflow:"hidden" }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TH>Faculty</TH>
                      <TH>Purpose</TH>
                      <TH>Organisation</TH>
                      <TH>Requested</TH>
                      <TH>Status</TH>
                      <TH align="center">Action</TH>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredNoc.map(row => (
                      <TableRow key={row.id} className="row-h">

                        <TD sx={{ minWidth:175 }}>
                          <Box display="flex" alignItems="center" gap={1.3}>
                            <Avatar sx={{ width:30, height:30, bgcolor:aColor(row.faculty).bg,
                              color:aColor(row.faculty).color,
                              fontFamily:fHead, fontSize:"0.62rem", fontWeight:700 }}>
                              {row.avatar}
                            </Avatar>
                            <Box>
                              <Typography sx={{ fontFamily:fBody, fontWeight:700,
                                fontSize:"0.81rem", color:T.text }}>{row.faculty}</Typography>
                              <Typography sx={{ fontFamily:fBody, fontSize:"0.67rem",
                                color:T.textMute }}>{row.dept}</Typography>
                            </Box>
                          </Box>
                        </TD>

                        <TD sx={{ minWidth:180 }}>
                          <Typography sx={{ fontFamily:fBody, fontSize:"0.8rem",
                            color:T.text }}>{row.purpose}</Typography>
                        </TD>

                        <TD>
                          <Typography sx={{ fontFamily:fBody, fontSize:"0.8rem" }}>
                            {row.org}
                          </Typography>
                        </TD>

                        <TD>
                          <Typography sx={{ fontFamily:fMono, fontSize:"0.74rem" }}>
                            {row.date}
                          </Typography>
                        </TD>

                        <TD>
                          <StatusPill status={row.status} meta={NOC_STATUS_META} />
                        </TD>

                        <TD align="center">
                          {row.status === "Pending" ? (
                            <Button size="small" variant="contained"
                              onClick={() => {
                                setSelectedNoc(row); setNocRemarks(""); setNocDialog(true);
                              }}
                              sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.72rem",
                                textTransform:"none", borderRadius:"7px",
                                bgcolor:T.accent, boxShadow:"none",
                                "&:hover":{ bgcolor:"#4F46E5", boxShadow:"none" } }}>
                              Review
                            </Button>
                          ) : (
                            <Button size="small" variant="outlined"
                              startIcon={<Print sx={{fontSize:13}} />}
                              onClick={() => toast(`NOC letter for ${row.faculty} downloading…`)}
                              sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.72rem",
                                textTransform:"none", borderRadius:"7px",
                                borderColor: row.status==="Approved" ? T.success : T.border,
                                color:       row.status==="Approved" ? T.success : T.textSub,
                                "&:hover":{ bgcolor: row.status==="Approved" ? T.successLight : "#F1F5F9" } }}>
                              Letter
                            </Button>
                          )}
                        </TD>
                      </TableRow>
                    ))}

                    {filteredNoc.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} sx={{ textAlign:"center", py:6 }}>
                          <CheckCircle sx={{ fontSize:36, color:T.success,
                            display:"block", mx:"auto", mb:1.5 }} />
                          <Typography sx={{ fontFamily:fBody, color:T.textMute }}>
                            No NOC requests match the current filter.
                          </Typography>
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

      {/* ── NOC Review Dialog ── */}
      <Dialog open={nocDialog} onClose={() => setNocDialog(false)}
        maxWidth="sm" fullWidth
        PaperProps={{ sx:{ borderRadius:"16px", border:`1px solid ${T.border}` } }}>
        {selectedNoc && (
          <>
            <DialogTitle sx={{ borderBottom:`1px solid ${T.border}`, bgcolor:"#FAFBFD", pb:2 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box display="flex" alignItems="center" gap={1.5}>
                  <Box sx={{ width:4, height:28, borderRadius:2, bgcolor:T.accent }} />
                  <Box>
                    <Typography sx={{ fontFamily:fHead, fontWeight:700,
                      fontSize:"0.96rem", color:T.text }}>Review NOC Request</Typography>
                    <Typography sx={{ fontFamily:fBody, fontSize:"0.72rem", color:T.textMute }}>
                      {selectedNoc.faculty} · {selectedNoc.dept}
                    </Typography>
                  </Box>
                </Box>
                <IconButton size="small" onClick={() => setNocDialog(false)}
                  sx={{ bgcolor:"#F1F5F9", borderRadius:"8px" }}>
                  <Close fontSize="small" />
                </IconButton>
              </Box>
            </DialogTitle>

            <DialogContent sx={{ px:3, pt:3, pb:2 }}>
              <Grid container spacing={1.5} mb={2.5}>
                {[
                  { label:"Applicant",    value:selectedNoc.faculty  },
                  { label:"Department",   value:selectedNoc.dept     },
                  { label:"Purpose",      value:selectedNoc.purpose  },
                  { label:"Organisation", value:selectedNoc.org      },
                  { label:"Date Filed",   value:selectedNoc.date     },
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

              <Divider sx={{ borderColor:T.border, mb:2 }} />

              {/* Active bond warning */}
              {activeBonds.some(b =>
                b.faculty === selectedNoc.faculty &&
                ["Active","Expiring Soon"].includes(b.status)
              ) && (
                <Box sx={{ p:1.8, borderRadius:"9px", mb:2,
                  bgcolor:T.warningLight, border:`1px solid ${T.warning}30`,
                  display:"flex", gap:1, alignItems:"flex-start" }}>
                  <Warning sx={{ fontSize:16, color:T.warning, flexShrink:0, mt:0.1 }} />
                  <Box>
                    <Typography sx={{ fontFamily:fBody, fontWeight:700,
                      fontSize:"0.8rem", color:T.warning }}>
                      Active Service Bond Detected
                    </Typography>
                    <Typography sx={{ fontFamily:fBody, fontSize:"0.74rem",
                      color:T.textSub, mt:0.2, lineHeight:1.6 }}>
                      This faculty member has an active service bond. Verify that the
                      NOC purpose does not conflict with bond obligations before approving.
                    </Typography>
                  </Box>
                </Box>
              )}

              <SLabel sx={{ mb:0.7 }}>Admin Remarks / Conditions</SLabel>
              <DInput multiline rows={3} value={nocRemarks}
                onChange={e => setNocRemarks(e.target.value)}
                placeholder="e.g. Approved subject to zero impact on teaching hours."
              />
            </DialogContent>

            <DialogActions sx={{ px:3, pb:3, pt:2,
              borderTop:`1px solid ${T.border}`, bgcolor:"#FAFBFD",
              display:"flex", justifyContent:"space-between" }}>
              <Button size="small" variant="outlined"
                startIcon={<Cancel sx={{fontSize:14}} />}
                onClick={() => handleNocAction("reject")}
                sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.77rem",
                  textTransform:"none", borderRadius:"8px",
                  borderColor:T.danger, color:T.danger,
                  "&:hover":{ bgcolor:T.dangerLight } }}>
                Reject
              </Button>
              <Box display="flex" gap={1}>
                <Button size="small" variant="outlined"
                  onClick={() => setNocDialog(false)}
                  sx={{ fontFamily:fBody, fontWeight:600, fontSize:"0.77rem",
                    textTransform:"none", borderRadius:"8px",
                    borderColor:T.border, color:T.textSub }}>
                  Cancel
                </Button>
                <Button size="small" variant="contained"
                  startIcon={<CheckCircle sx={{fontSize:14}} />}
                  onClick={() => handleNocAction("approve")}
                  sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.77rem",
                    textTransform:"none", borderRadius:"8px",
                    bgcolor:T.success, boxShadow:"none",
                    "&:hover":{ bgcolor:"#059669", boxShadow:"none" } }}>
                  Approve &amp; Generate Letter
                </Button>
              </Box>
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

export default BondManagementView;