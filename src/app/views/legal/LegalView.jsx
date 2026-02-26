import React, { useState } from 'react';
import {
  Box, Grid, Typography, Button, Table, TableBody, TableCell,
  TableHead, TableRow, Stack, TextField, Divider, IconButton,
  InputAdornment, Dialog, DialogTitle, DialogContent, DialogActions,
  Tabs, Tab, Snackbar, Alert
} from "@mui/material";
import {
  Gavel, Description, BusinessCenter, Security, HealthAndSafety,
  Download, Calculate, Edit, Save, Close, Warning, CheckCircle,
  Add, FileDownload, Shield, Article, Group
} from '@mui/icons-material';

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
    .row-h:hover { background:#F9FAFB !important; transition:background .13s; }
    .card-h { transition:box-shadow .16s,transform .16s; }
    .card-h:hover { box-shadow:0 4px 20px rgba(99,102,241,.11); transform:translateY(-2px); }
  `}</style>
);

/* ─────────────────────────────────────────
   MOCK DATA
───────────────────────────────────────── */
const CONTRACTS = [
  { id:1, title:"Appointment Order — Associate Professor",  type:"Appointment",   date:"01 Jun 2019", size:"420 KB" },
  { id:2, title:"Employment Agreement — Revised Terms",     type:"Agreement",     date:"15 Mar 2021", size:"380 KB" },
  { id:3, title:"Annual Increment Letter FY 2023-24",       type:"Increment",     date:"01 Apr 2023", size:"210 KB" },
  { id:4, title:"Probation Completion Certificate",         type:"Certificate",   date:"01 Dec 2019", size:"180 KB" },
  { id:5, title:"Designation Change — Associate to Senior", type:"Modification",  date:"10 Jan 2022", size:"290 KB" },
];

const BONDS = [
  {
    id:"BOND-PHD-001", title:"PhD Sponsorship Bond",
    status:"Active", totalValue:800000, remainingMonths:18,
    totalMonths:36, startDate:"01 Jun 2022", endDate:"01 Jun 2025",
    description:"Sponsored PhD programme at IIT Bombay — service obligation to institution.",
    penaltyRate:0.5,
  },
  {
    id:"BOND-TRN-002", title:"Training & Development Bond",
    status:"Active", totalValue:150000, remainingMonths:6,
    totalMonths:12, startDate:"01 Jan 2024", endDate:"01 Jan 2025",
    description:"NPTEL Faculty Development Programme — six-month obligation.",
    penaltyRate:0.3,
  },
];

const NDAS = [
  { id:1, title:"Research Data Confidentiality",     party:"Dept. of CS & Institution",    date:"15 Aug 2020", status:"Active",  scope:"All research data generated during employment." },
  { id:2, title:"Industry Collaboration NDA",        party:"TechCorp Solutions Pvt. Ltd.",  date:"10 Mar 2022", status:"Active",  scope:"Joint AI research project — 3 years from signing." },
  { id:3, title:"Examination Confidentiality Deed",  party:"University Examination Board",  date:"01 Jun 2019", status:"Active",  scope:"Question papers, mark sheets, evaluation data." },
  { id:4, title:"Student Data Protection Agreement", party:"Institution & Faculty",         date:"01 Aug 2023", status:"Active",  scope:"Perpetual — as per University Policy 2023." },
];

const CONSULTANCY = [
  { id:1, project:"AI-Driven ERP System",        client:"Infosys Ltd.",       revenueShare:"60% Faculty / 40% Inst.", ipRights:"Shared",       approvalDate:"15 Jan 2023" },
  { id:2, project:"Smart City Traffic Optimizer", client:"RITES Ltd.",         revenueShare:"70% Faculty / 30% Inst.", ipRights:"Faculty",      approvalDate:"10 Apr 2023" },
  { id:3, project:"ML Audit Framework",           client:"KPMG India",         revenueShare:"55% Faculty / 45% Inst.", ipRights:"Institution",  approvalDate:"20 Sep 2022" },
];

const INSURANCE_INIT = {
  policyNo:   "GMP-2024-CS-00412",
  provider:   "National Insurance Co. Ltd.",
  validTill:  "31 Mar 2025",
  sumInsured: 500000,
  nominees: [
    { name:"Ananya Smith",  relation:"Spouse",    share:60 },
    { name:"Rohan Smith",   relation:"Son",       share:25 },
    { name:"Meena Kumar",   relation:"Mother",    share:15 },
  ],
};

const CONTRACT_TYPE_META = {
  "Appointment":  { color:T.accent,  bg:T.accentLight  },
  "Agreement":    { color:T.success, bg:T.successLight },
  "Increment":    { color:T.gold,    bg:T.goldLight    },
  "Certificate":  { color:T.purple,  bg:T.purpleLight  },
  "Modification": { color:T.info,    bg:T.infoLight    },
};

const fmt = (n) => Number(n).toLocaleString("en-IN");

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

const InfoRow = ({ label, value, mono=false }) => (
  <Box display="flex" justifyContent="space-between" alignItems="center"
    sx={{ py:1.4, borderBottom:`1px solid ${T.border}` }}>
    <Typography sx={{ fontFamily:fBody, fontSize:"0.79rem", color:T.textMute }}>{label}</Typography>
    <Typography sx={{ fontFamily: mono ? fMono : fBody, fontWeight:700,
      fontSize:"0.82rem", color:T.text }}>{value}</Typography>
  </Box>
);

const TypePill = ({ type }) => {
  const m = CONTRACT_TYPE_META[type] || { color:T.textMute, bg:"#F1F5F9" };
  return (
    <Box sx={{ px:1.2, py:0.32, borderRadius:"99px", bgcolor:m.bg, display:"inline-block" }}>
      <Typography sx={{ fontFamily:fBody, fontSize:"0.69rem", fontWeight:700, color:m.color }}>
        {type}
      </Typography>
    </Box>
  );
};

const StatusPill = ({ status, color, bg }) => (
  <Box display="flex" alignItems="center" gap={0.6}
    sx={{ px:1.2, py:0.38, borderRadius:"99px", bgcolor:bg, width:"fit-content" }}>
    <Box sx={{ width:6, height:6, borderRadius:"50%", bgcolor:color }} />
    <Typography sx={{ fontFamily:fBody, fontSize:"0.71rem", fontWeight:700, color }}>{status}</Typography>
  </Box>
);

const ProgBar = ({ value, max, color=T.accent }) => {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <Box sx={{ height:7, borderRadius:99, bgcolor:T.border, overflow:"hidden" }}>
      <Box sx={{ height:"100%", width:`${pct}%`, borderRadius:99, bgcolor:color,
        transition:"width 1.2s ease" }} />
    </Box>
  );
};

/* ═════════════════════════════════════════════
   MAIN COMPONENT
═════════════════════════════════════════════ */
const LegalView = () => {
  const [tabIndex,    setTabIndex]    = useState(0);
  const [salary,      setSalary]      = useState(142000);
  const [calcBondId,  setCalcBondId]  = useState("BOND-PHD-001");
  const [damageResult,setDamageResult]= useState(null);
  const [insurance,   setInsurance]   = useState(INSURANCE_INIT);
  const [nomineeDialog, setNomineeDialog] = useState(false);
  const [newNominee,  setNewNominee]  = useState({ name:"", relation:"", share:"" });
  const [clauseId,    setClauseId]    = useState(null);
  const [snack,       setSnack]       = useState({ open:false, msg:"", severity:"success" });

  const toast = (msg, severity="success") => setSnack({ open:true, msg, severity });

  /* ── Damage calculator ── */
  const handleCalculate = () => {
    const bond = BONDS.find(b => b.id === calcBondId);
    if (!bond || !salary) return;
    const s    = parseFloat(salary) || 0;
    const mos  = bond.remainingMonths;
    const rate = bond.penaltyRate;
    setDamageResult(Math.round(s * mos * rate));
  };

  /* ── Add nominee ── */
  const handleAddNominee = () => {
    if (!newNominee.name || !newNominee.relation) {
      toast("Name and relation are required.", "error"); return;
    }
    const share = parseInt(newNominee.share) || 0;
    const totalShares = insurance.nominees.reduce((s,n) => s + n.share, 0) + share;
    if (totalShares > 100) {
      toast("Total nominee share cannot exceed 100%.", "error"); return;
    }
    setInsurance(p => ({ ...p, nominees:[...p.nominees, { name:newNominee.name, relation:newNominee.relation, share }] }));
    setNewNominee({ name:"", relation:"", share:"" });
    setNomineeDialog(false);
    toast("Nominee added successfully.");
  };

  const clauseNda = NDAS.find(n => n.id === clauseId);

  /* ─────────────────────────────────────────
     TABS CONFIG
  ───────────────────────────────────────── */
  const TABS = [
    { label:"Employment Contracts",  Icon:Description      },
    { label:"Service Bonds",         Icon:Gavel            },
    { label:"Confidentiality (NDA)", Icon:Security         },
    { label:"Consultancy Agreements",Icon:BusinessCenter   },
    { label:"Insurance & Benefits",  Icon:HealthAndSafety  },
  ];

  return (
    <Box sx={{ p:3, bgcolor:T.bg, minHeight:"100vh", fontFamily:fBody }}>
      <Fonts />

      {/* ── Header ── */}
      <Box display="flex" justifyContent="space-between" alignItems="flex-start"
        mb={3} flexWrap="wrap" gap={2} className="fu">
        <Box>
          <Typography sx={{ fontFamily:fBody, fontSize:"0.72rem", fontWeight:700,
            letterSpacing:"0.1em", textTransform:"uppercase", color:T.textMute, mb:0.3 }}>
            Faculty Portal · Legal
          </Typography>
          <Typography sx={{ fontFamily:fHead, fontWeight:700, fontSize:"1.5rem", color:T.text }}>
            Legal &amp; Contracts Repository
          </Typography>
          <Typography sx={{ fontFamily:fBody, fontSize:"0.82rem", color:T.textSub, mt:0.3 }}>
            Dr. Sarah Smith &nbsp;·&nbsp; Department of Computer Science
          </Typography>
        </Box>
        <Button size="small" variant="outlined"
          startIcon={<FileDownload sx={{ fontSize:15 }} />}
          onClick={() => toast("Full repository exported as ZIP.")}
          sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.76rem", textTransform:"none",
            borderRadius:"8px", borderColor:T.border, color:T.textSub, mt:0.5,
            "&:hover":{ borderColor:T.accent, color:T.accent } }}>
          Download All (ZIP)
        </Button>
      </Box>

      {/* ── Main Card ── */}
      <SCard sx={{ overflow:"hidden" }} className="fu1">

        {/* ── Tab bar ── */}
        <Box sx={{ borderBottom:`1px solid ${T.border}`, bgcolor:"#FAFBFD", overflowX:"auto" }}>
          <Tabs value={tabIndex} onChange={(_, v) => setTabIndex(v)} variant="scrollable"
            scrollButtons="auto" sx={{
              px:1,
              "& .MuiTabs-indicator":{ bgcolor:T.accent, height:"2.5px",
                borderRadius:"2px 2px 0 0" },
              "& .MuiTab-root":{ fontFamily:fBody, fontWeight:600, fontSize:"0.76rem",
                textTransform:"none", color:T.textMute, minHeight:52,
                "&.Mui-selected":{ color:T.accent } }
            }}>
            {TABS.map((t, i) => (
              <Tab key={i} icon={<t.Icon sx={{ fontSize:15 }} />}
                iconPosition="start" label={t.label} />
            ))}
          </Tabs>
        </Box>

        <Box sx={{ p:3 }}>

          {/* ══════════════════════════════════════
              TAB 0 — EMPLOYMENT CONTRACTS
          ══════════════════════════════════════ */}
          {tabIndex === 0 && (
            <Box>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2.5}>
                <Box>
                  <Typography sx={{ fontFamily:fHead, fontWeight:700,
                    fontSize:"0.96rem", color:T.text }}>My Employment Documents</Typography>
                  <Typography sx={{ fontFamily:fBody, fontSize:"0.76rem",
                    color:T.textMute, mt:0.2 }}>
                    {CONTRACTS.length} documents &nbsp;·&nbsp; All versions archived
                  </Typography>
                </Box>
                <Button size="small" variant="contained"
                  startIcon={<FileDownload sx={{ fontSize:14 }} />}
                  onClick={() => toast("All contracts exported as ZIP.")}
                  sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.76rem",
                    textTransform:"none", borderRadius:"8px",
                    bgcolor:T.accent, boxShadow:"none",
                    "&:hover":{ bgcolor:"#4F46E5", boxShadow:"none" } }}>
                  Download All (ZIP)
                </Button>
              </Box>

              <Table>
                <TableHead>
                  <TableRow>
                    <TH>Document Title</TH>
                    <TH>Type</TH>
                    <TH>Issue Date</TH>
                    <TH>File Size</TH>
                    <TH align="right">Action</TH>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {CONTRACTS.map(doc => (
                    <TableRow key={doc.id} className="row-h">
                      <TD sx={{ minWidth:240 }}>
                        <Box display="flex" alignItems="center" gap={1.2}>
                          <Box sx={{ p:0.7, borderRadius:"7px",
                            bgcolor:T.accentLight, color:T.accent, flexShrink:0 }}>
                            <Article sx={{ fontSize:14 }} />
                          </Box>
                          <Typography sx={{ fontFamily:fBody, fontWeight:700,
                            fontSize:"0.81rem", color:T.text }}>{doc.title}</Typography>
                        </Box>
                      </TD>
                      <TD><TypePill type={doc.type} /></TD>
                      <TD>
                        <Typography sx={{ fontFamily:fMono, fontSize:"0.78rem",
                          color:T.textSub }}>{doc.date}</Typography>
                      </TD>
                      <TD>
                        <Typography sx={{ fontFamily:fMono, fontSize:"0.75rem",
                          color:T.textMute }}>{doc.size}</Typography>
                      </TD>
                      <TD align="right">
                        <Button size="small" variant="outlined"
                          startIcon={<Download sx={{ fontSize:13 }} />}
                          onClick={() => toast(`Downloading: ${doc.title}`)}
                          sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.7rem",
                            textTransform:"none", borderRadius:"7px",
                            borderColor:T.border, color:T.textSub,
                            "&:hover":{ borderColor:T.accent, color:T.accent } }}>
                          PDF
                        </Button>
                      </TD>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          )}

          {/* ══════════════════════════════════════
              TAB 1 — SERVICE BONDS
          ══════════════════════════════════════ */}
          {tabIndex === 1 && (
            <Grid container spacing={3}>
              {/* Bond cards */}
              <Grid item xs={12} md={7}>
                <Typography sx={{ fontFamily:fHead, fontWeight:700,
                  fontSize:"0.96rem", color:T.text, mb:2 }}>Active Service Bonds</Typography>

                <Stack spacing={2.5}>
                  {BONDS.map(bond => {
                    const elapsed = bond.totalMonths - bond.remainingMonths;
                    const pct     = Math.round((elapsed / bond.totalMonths) * 100);
                    return (
                      <SCard key={bond.id} sx={{ p:2.8,
                        borderLeft:`4px solid ${T.warning}` }}>
                        <Box display="flex" justifyContent="space-between"
                          alignItems="flex-start" mb={1.5}>
                          <Box>
                            <Typography sx={{ fontFamily:fHead, fontWeight:700,
                              fontSize:"0.9rem", color:T.text }}>{bond.title}</Typography>
                            <Typography sx={{ fontFamily:fBody, fontSize:"0.73rem",
                              color:T.textMute, mt:0.3 }}>{bond.description}</Typography>
                          </Box>
                          <StatusPill status={bond.status}
                            color={T.warning} bg={T.warningLight} />
                        </Box>

                        <Grid container spacing={1.5} mb={2}>
                          {[
                            { label:"Bond Value",          value:`₹${fmt(bond.totalValue)}`, mono:true  },
                            { label:"Remaining",           value:`${bond.remainingMonths} months`,  mono:true  },
                            { label:"Start Date",          value:bond.startDate,                    mono:true  },
                            { label:"End Date",            value:bond.endDate,                      mono:true  },
                          ].map(s => (
                            <Grid item xs={6} key={s.label}>
                              <Box sx={{ p:1.2, borderRadius:"8px",
                                bgcolor:"#F9FAFB", border:`1px solid ${T.border}` }}>
                                <SLabel sx={{ mb:0.2 }}>{s.label}</SLabel>
                                <Typography sx={{ fontFamily: s.mono ? fMono : fBody,
                                  fontWeight:700, fontSize:"0.82rem",
                                  color:T.text }}>{s.value}</Typography>
                              </Box>
                            </Grid>
                          ))}
                        </Grid>

                        {/* Progress bar */}
                        <Box sx={{ mb:1.5 }}>
                          <Box display="flex" justifyContent="space-between" mb={0.7}>
                            <Typography sx={{ fontFamily:fBody, fontSize:"0.72rem",
                              color:T.textMute }}>Obligation served: {pct}%</Typography>
                            <Typography sx={{ fontFamily:fMono, fontSize:"0.72rem",
                              color:T.warning, fontWeight:700 }}>
                              {bond.remainingMonths}mo remaining
                            </Typography>
                          </Box>
                          <ProgBar value={elapsed} max={bond.totalMonths} color={T.warning} />
                        </Box>

                        <Box display="flex" gap={1} mt={2}>
                          <Button size="small" variant="outlined"
                            onClick={() => toast("Bond release request submitted.")}
                            sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.72rem",
                              textTransform:"none", borderRadius:"7px",
                              borderColor:T.warning, color:T.warning,
                              "&:hover":{ bgcolor:T.warningLight } }}>
                            Bond Release Request
                          </Button>
                          <Button size="small" variant="outlined"
                            onClick={() => toast("NOC application submitted.")}
                            sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.72rem",
                              textTransform:"none", borderRadius:"7px",
                              borderColor:T.border, color:T.textSub,
                              "&:hover":{ borderColor:T.accent, color:T.accent } }}>
                            Apply for NOC
                          </Button>
                        </Box>
                      </SCard>
                    );
                  })}
                </Stack>
              </Grid>

              {/* Calculator */}
              <Grid item xs={12} md={5}>
                <SCard sx={{ p:2.8, bgcolor:"#FAFBFD", position:"sticky", top:16 }}>
                  <Box display="flex" alignItems="center" gap={1.2} mb={0.5}>
                    <Box sx={{ p:0.8, borderRadius:"8px",
                      bgcolor:T.dangerLight, color:T.danger }}>
                      <Calculate sx={{ fontSize:16 }} />
                    </Box>
                    <Typography sx={{ fontFamily:fHead, fontWeight:700,
                      fontSize:"0.9rem", color:T.text }}>Liquidated Damages Calculator</Typography>
                  </Box>
                  <Typography sx={{ fontFamily:fBody, fontSize:"0.75rem",
                    color:T.textMute, mb:2.5 }}>
                    Estimate the penalty if you break an active bond today.
                  </Typography>

                  {/* Bond selector */}
                  <Box mb={2}>
                    <SLabel sx={{ mb:0.7 }}>Select Bond</SLabel>
                    <DInput select value={calcBondId}
                      onChange={e => { setCalcBondId(e.target.value); setDamageResult(null); }}>
                      {BONDS.map(b => (
                        <option key={b.id} value={b.id}
                          style={{ fontFamily:fBody, fontSize:"0.82rem" }}>
                          {b.title}
                        </option>
                      ))}
                    </DInput>
                  </Box>

                  {/* Salary input */}
                  <Box mb={2.5}>
                    <SLabel sx={{ mb:0.7 }}>Current Monthly Gross Salary</SLabel>
                    <DInput type="number" value={salary}
                      onChange={e => { setSalary(e.target.value); setDamageResult(null); }}
                      InputProps={{ startAdornment:
                        <InputAdornment position="start">
                          <Typography sx={{ fontFamily:fMono, fontWeight:700,
                            fontSize:"0.82rem", color:T.textSub }}>₹</Typography>
                        </InputAdornment>
                      }}
                    />
                  </Box>

                  <Button fullWidth variant="contained" onClick={handleCalculate}
                    startIcon={<Calculate sx={{ fontSize:15 }} />}
                    sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.82rem",
                      textTransform:"none", borderRadius:"9px",
                      bgcolor:T.danger, boxShadow:"none",
                      "&:hover":{ bgcolor:"#DC2626", boxShadow:"none" } }}>
                    Calculate Penalty
                  </Button>

                  {damageResult !== null && (
                    <Box sx={{ mt:2.5, p:2.2, borderRadius:"10px",
                      bgcolor:T.dangerLight, border:`1.5px solid ${T.danger}20`,
                      textAlign:"center" }}>
                      <SLabel sx={{ color:T.danger, mb:0.5 }}>Estimated Penalty</SLabel>
                      <Typography sx={{ fontFamily:fMono, fontWeight:700,
                        fontSize:"1.9rem", color:T.danger, lineHeight:1 }}>
                        ₹{fmt(damageResult)}
                      </Typography>
                      <Typography sx={{ fontFamily:fBody, fontSize:"0.7rem",
                        color:T.textSub, mt:0.8 }}>
                        Based on {BONDS.find(b=>b.id===calcBondId)?.remainingMonths} months
                        remaining × penalty rate. Consult HR before proceeding.
                      </Typography>
                    </Box>
                  )}

                  {/* Info note */}
                  <Box sx={{ mt:2, p:1.5, borderRadius:"8px",
                    bgcolor:T.warningLight, border:`1px solid ${T.warning}20`,
                    display:"flex", gap:0.8, alignItems:"flex-start" }}>
                    <Warning sx={{ fontSize:13, color:T.warning, flexShrink:0, mt:0.1 }} />
                    <Typography sx={{ fontFamily:fBody, fontSize:"0.7rem",
                      color:T.textSub, lineHeight:1.6 }}>
                      This is an indicative estimate only. Actual damages are
                      computed by HR/Legal at the time of separation.
                    </Typography>
                  </Box>
                </SCard>
              </Grid>
            </Grid>
          )}

          {/* ══════════════════════════════════════
              TAB 2 — NDA
          ══════════════════════════════════════ */}
          {tabIndex === 2 && (
            <Box>
              <Box mb={2.5}>
                <Typography sx={{ fontFamily:fHead, fontWeight:700,
                  fontSize:"0.96rem", color:T.text }}>Non-Disclosure Agreements</Typography>
                <Typography sx={{ fontFamily:fBody, fontSize:"0.76rem",
                  color:T.textMute, mt:0.2 }}>
                  {NDAS.length} active NDAs &nbsp;·&nbsp; Click "View Clause" to read the scope.
                </Typography>
              </Box>

              <Grid container spacing={2} mb={3}>
                {NDAS.map(nda => (
                  <Grid item xs={12} md={6} key={nda.id}>
                    <SCard sx={{ p:2.5, height:"100%",
                      borderLeft:`3.5px solid ${T.success}` }}>
                      <Box display="flex" justifyContent="space-between"
                        alignItems="flex-start" mb={1}>
                        <Box flex={1} mr={1}>
                          <Typography sx={{ fontFamily:fHead, fontWeight:700,
                            fontSize:"0.85rem", color:T.text,
                            mb:0.3 }}>{nda.title}</Typography>
                          <Typography sx={{ fontFamily:fBody, fontSize:"0.73rem",
                            color:T.textMute }}>Party: {nda.party}</Typography>
                        </Box>
                        <StatusPill status="Active"
                          color={T.success} bg={T.successLight} />
                      </Box>

                      <Box sx={{ p:1.2, borderRadius:"7px",
                        bgcolor:"#F9FAFB", border:`1px solid ${T.border}`, mb:1.5 }}>
                        <SLabel sx={{ mb:0.2 }}>Scope</SLabel>
                        <Typography sx={{ fontFamily:fBody, fontSize:"0.75rem",
                          color:T.textSub, lineHeight:1.6 }}>{nda.scope}</Typography>
                      </Box>

                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography sx={{ fontFamily:fMono, fontSize:"0.7rem",
                          color:T.textMute }}>Signed: {nda.date}</Typography>
                        <Button size="small" variant="outlined"
                          onClick={() => setClauseId(nda.id)}
                          sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.7rem",
                            textTransform:"none", borderRadius:"7px",
                            borderColor:T.border, color:T.textSub,
                            "&:hover":{ borderColor:T.accent, color:T.accent } }}>
                          View Clause
                        </Button>
                      </Box>
                    </SCard>
                  </Grid>
                ))}
              </Grid>

              {/* Policy note */}
              <Box sx={{ p:2, borderRadius:"10px",
                bgcolor:T.infoLight, border:`1px solid ${T.info}20`,
                display:"flex", gap:1, alignItems:"flex-start" }}>
                <Shield sx={{ fontSize:15, color:T.info, flexShrink:0, mt:0.1 }} />
                <Typography sx={{ fontFamily:fBody, fontSize:"0.76rem",
                  color:T.textSub, lineHeight:1.65 }}>
                  <Box component="span" sx={{ fontWeight:700, color:T.info }}>Note: </Box>
                  Student data confidentiality is perpetual as per University Policy 2023.
                  Violations are subject to disciplinary action and legal proceedings.
                </Typography>
              </Box>
            </Box>
          )}

          {/* ══════════════════════════════════════
              TAB 3 — CONSULTANCY AGREEMENTS
          ══════════════════════════════════════ */}
          {tabIndex === 3 && (
            <Box>
              <Box mb={2.5}>
                <Typography sx={{ fontFamily:fHead, fontWeight:700,
                  fontSize:"0.96rem", color:T.text }}>Consultancy &amp; Revenue Sharing</Typography>
                <Typography sx={{ fontFamily:fBody, fontSize:"0.76rem",
                  color:T.textMute, mt:0.2 }}>
                  Approved consultancy projects with revenue-sharing and IP rights details.
                </Typography>
              </Box>

              <Table>
                <TableHead>
                  <TableRow>
                    <TH>Project</TH>
                    <TH>Client</TH>
                    <TH>Revenue Share</TH>
                    <TH>IP Rights</TH>
                    <TH>Approval Date</TH>
                    <TH align="center">Action</TH>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {CONSULTANCY.map(row => (
                    <TableRow key={row.id} className="row-h">
                      <TD sx={{ minWidth:180 }}>
                        <Box display="flex" alignItems="center" gap={1}>
                          <Box sx={{ p:0.6, borderRadius:"6px",
                            bgcolor:T.purpleLight, color:T.purple, flexShrink:0 }}>
                            <BusinessCenter sx={{ fontSize:13 }} />
                          </Box>
                          <Typography sx={{ fontFamily:fBody, fontWeight:700,
                            fontSize:"0.81rem", color:T.text }}>{row.project}</Typography>
                        </Box>
                      </TD>
                      <TD>
                        <Typography sx={{ fontFamily:fBody, fontSize:"0.8rem",
                          color:T.textSub }}>{row.client}</Typography>
                      </TD>
                      <TD>
                        <Box sx={{ px:1.1, py:0.3, borderRadius:"99px",
                          bgcolor:T.accentLight, display:"inline-block" }}>
                          <Typography sx={{ fontFamily:fBody, fontSize:"0.7rem",
                            fontWeight:700, color:T.accent }}>
                            {row.revenueShare}
                          </Typography>
                        </Box>
                      </TD>
                      <TD>
                        <Box sx={{ px:1.1, py:0.3, borderRadius:"99px",
                          bgcolor: row.ipRights==="Shared" ? T.infoLight
                                 : row.ipRights==="Faculty" ? T.successLight
                                 : T.warningLight,
                          display:"inline-block" }}>
                          <Typography sx={{ fontFamily:fBody, fontSize:"0.7rem",
                            fontWeight:700,
                            color: row.ipRights==="Shared" ? T.info
                                 : row.ipRights==="Faculty" ? T.success
                                 : T.warning }}>
                            {row.ipRights}
                          </Typography>
                        </Box>
                      </TD>
                      <TD>
                        <Typography sx={{ fontFamily:fMono, fontSize:"0.78rem",
                          color:T.textSub }}>{row.approvalDate}</Typography>
                      </TD>
                      <TD align="center">
                        <Button size="small" variant="outlined"
                          startIcon={<Download sx={{ fontSize:12 }} />}
                          onClick={() => toast(`Downloading agreement: ${row.project}`)}
                          sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.68rem",
                            textTransform:"none", borderRadius:"7px",
                            borderColor:T.border, color:T.textSub,
                            "&:hover":{ borderColor:T.accent, color:T.accent } }}>
                          Agreement
                        </Button>
                      </TD>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          )}

          {/* ══════════════════════════════════════
              TAB 4 — INSURANCE & BENEFITS
          ══════════════════════════════════════ */}
          {tabIndex === 4 && (
            <Grid container spacing={3}>
              {/* Policy card */}
              <Grid item xs={12} md={6}>
                <SCard sx={{ p:2.8, height:"100%" }}>
                  <Box display="flex" alignItems="center" gap={1.2} mb={2.5}>
                    <Box sx={{ p:0.8, borderRadius:"8px",
                      bgcolor:T.successLight, color:T.success }}>
                      <HealthAndSafety sx={{ fontSize:16 }} />
                    </Box>
                    <Typography sx={{ fontFamily:fHead, fontWeight:700,
                      fontSize:"0.9rem", color:T.text }}>Group Medical Insurance Policy</Typography>
                  </Box>

                  <Box>
                    <InfoRow label="Policy Number"  value={insurance.policyNo}   mono />
                    <InfoRow label="Provider"       value={insurance.provider}         />
                    <InfoRow label="Valid Till"     value={insurance.validTill}   mono />
                    <Box display="flex" justifyContent="space-between" alignItems="center"
                      sx={{ pt:1.4 }}>
                      <Typography sx={{ fontFamily:fBody, fontSize:"0.79rem",
                        color:T.textMute }}>Sum Insured</Typography>
                      <Typography sx={{ fontFamily:fMono, fontWeight:700,
                        fontSize:"1rem", color:T.success }}>
                        ₹{fmt(insurance.sumInsured)}
                      </Typography>
                    </Box>
                  </Box>

                  <Button fullWidth variant="contained"
                    startIcon={<Download sx={{ fontSize:14 }} />}
                    onClick={() => toast("Insurance E-Card downloaded.")}
                    sx={{ mt:3, fontFamily:fBody, fontWeight:700, fontSize:"0.82rem",
                      textTransform:"none", borderRadius:"9px",
                      bgcolor:T.success, boxShadow:"none",
                      "&:hover":{ bgcolor:"#059669", boxShadow:"none" } }}>
                    Download E-Card
                  </Button>
                </SCard>
              </Grid>

              {/* Nominee table */}
              <Grid item xs={12} md={6}>
                <SCard sx={{ p:2.8, height:"100%" }}>
                  <Box display="flex" justifyContent="space-between"
                    alignItems="center" mb={2.5}>
                    <Box display="flex" alignItems="center" gap={1.2}>
                      <Box sx={{ p:0.8, borderRadius:"8px",
                        bgcolor:T.accentLight, color:T.accent }}>
                        <Group sx={{ fontSize:16 }} />
                      </Box>
                      <Typography sx={{ fontFamily:fHead, fontWeight:700,
                        fontSize:"0.9rem", color:T.text }}>Nominee Details</Typography>
                    </Box>
                    <Button size="small" variant="outlined"
                      startIcon={<Add sx={{ fontSize:13 }} />}
                      onClick={() => setNomineeDialog(true)}
                      sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.72rem",
                        textTransform:"none", borderRadius:"7px",
                        borderColor:T.accent, color:T.accent,
                        "&:hover":{ bgcolor:T.accentLight } }}>
                      Add Nominee
                    </Button>
                  </Box>

                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TH>Name</TH>
                        <TH>Relation</TH>
                        <TH align="right">Share %</TH>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {insurance.nominees.map((nom, i) => (
                        <TableRow key={i} className="row-h">
                          <TD>
                            <Typography sx={{ fontFamily:fBody, fontWeight:700,
                              fontSize:"0.8rem", color:T.text }}>{nom.name}</Typography>
                          </TD>
                          <TD>
                            <Typography sx={{ fontFamily:fBody, fontSize:"0.78rem",
                              color:T.textSub }}>{nom.relation}</Typography>
                          </TD>
                          <TD align="right">
                            <Box sx={{ px:1, py:0.28, borderRadius:"99px",
                              bgcolor:T.accentLight, display:"inline-block" }}>
                              <Typography sx={{ fontFamily:fMono, fontWeight:700,
                                fontSize:"0.76rem", color:T.accent }}>{nom.share}%</Typography>
                            </Box>
                          </TD>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  {/* Total share bar */}
                  <Box sx={{ mt:2, pt:2, borderTop:`1px solid ${T.border}` }}>
                    <Box display="flex" justifyContent="space-between" mb={0.7}>
                      <Typography sx={{ fontFamily:fBody, fontSize:"0.72rem",
                        color:T.textMute }}>Total Allocation</Typography>
                      <Typography sx={{ fontFamily:fMono, fontWeight:700,
                        fontSize:"0.78rem",
                        color: insurance.nominees.reduce((s,n)=>s+n.share,0) === 100
                          ? T.success : T.warning }}>
                        {insurance.nominees.reduce((s,n)=>s+n.share,0)}%
                      </Typography>
                    </Box>
                    <ProgBar
                      value={insurance.nominees.reduce((s,n)=>s+n.share,0)}
                      max={100}
                      color={insurance.nominees.reduce((s,n)=>s+n.share,0) === 100
                        ? T.success : T.warning}
                    />
                  </Box>
                </SCard>
              </Grid>
            </Grid>
          )}
        </Box>
      </SCard>

      {/* ── NDA Clause Dialog ── */}
      <Dialog open={!!clauseId} onClose={() => setClauseId(null)}
        maxWidth="sm" fullWidth
        PaperProps={{ sx:{ borderRadius:"16px", border:`1px solid ${T.border}` } }}>
        {clauseNda && (
          <>
            <DialogTitle sx={{ borderBottom:`1px solid ${T.border}`, bgcolor:"#FAFBFD", pb:2 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box display="flex" alignItems="center" gap={1.5}>
                  <Box sx={{ width:4, height:28, borderRadius:2, bgcolor:T.success }} />
                  <Box>
                    <Typography sx={{ fontFamily:fHead, fontWeight:700,
                      fontSize:"0.96rem", color:T.text }}>{clauseNda.title}</Typography>
                    <Typography sx={{ fontFamily:fBody, fontSize:"0.72rem",
                      color:T.textMute }}>Signed: {clauseNda.date}</Typography>
                  </Box>
                </Box>
                <Box onClick={() => setClauseId(null)}
                  sx={{ p:0.7, borderRadius:"8px", bgcolor:"#F1F5F9", cursor:"pointer",
                    "&:hover":{ bgcolor:T.dangerLight } }}>
                  <Close sx={{ fontSize:16, color:T.textMute }} />
                </Box>
              </Box>
            </DialogTitle>
            <DialogContent sx={{ px:3, pt:3, pb:2 }}>
              <Grid container spacing={1.5} mb={2.5}>
                {[
                  { label:"Party",   value:clauseNda.party  },
                  { label:"Status",  value:clauseNda.status },
                  { label:"Signed",  value:clauseNda.date   },
                  { label:"Type",    value:"Non-Disclosure Agreement" },
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
              <Box sx={{ p:2, borderRadius:"9px",
                bgcolor:"#F9FAFB", border:`1px solid ${T.border}` }}>
                <SLabel sx={{ mb:0.5 }}>Scope of Confidentiality</SLabel>
                <Typography sx={{ fontFamily:fBody, fontSize:"0.82rem",
                  color:T.textSub, lineHeight:1.75 }}>{clauseNda.scope}</Typography>
              </Box>
              <Box sx={{ mt:2, p:1.5, borderRadius:"8px",
                bgcolor:T.infoLight, border:`1px solid ${T.info}20`,
                display:"flex", gap:0.8, alignItems:"flex-start" }}>
                <Shield sx={{ fontSize:13, color:T.info, flexShrink:0, mt:0.1 }} />
                <Typography sx={{ fontFamily:fBody, fontSize:"0.71rem",
                  color:T.textSub, lineHeight:1.6 }}>
                  This NDA is legally binding. Unauthorised disclosure may result in
                  disciplinary action and civil liability. Contact Legal at
                  legal@institution.edu for full clause text.
                </Typography>
              </Box>
            </DialogContent>
            <DialogActions sx={{ px:3, pb:3, pt:2,
              borderTop:`1px solid ${T.border}`, bgcolor:"#FAFBFD", gap:1 }}>
              <Button size="small" variant="outlined"
                onClick={() => setClauseId(null)}
                sx={{ fontFamily:fBody, fontWeight:600, fontSize:"0.78rem",
                  textTransform:"none", borderRadius:"8px",
                  borderColor:T.border, color:T.textSub }}>
                Close
              </Button>
              <Button size="small" variant="contained"
                startIcon={<Download sx={{ fontSize:13 }} />}
                onClick={() => { setClauseId(null); toast(`NDA downloaded: ${clauseNda.title}`); }}
                sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.78rem",
                  textTransform:"none", borderRadius:"8px",
                  bgcolor:T.accent, boxShadow:"none",
                  "&:hover":{ bgcolor:"#4F46E5", boxShadow:"none" } }}>
                Download NDA
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* ── Add Nominee Dialog ── */}
      <Dialog open={nomineeDialog} onClose={() => setNomineeDialog(false)}
        maxWidth="xs" fullWidth
        PaperProps={{ sx:{ borderRadius:"16px", border:`1px solid ${T.border}` } }}>
        <DialogTitle sx={{ borderBottom:`1px solid ${T.border}`, bgcolor:"#FAFBFD", pb:2 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box display="flex" alignItems="center" gap={1.5}>
              <Box sx={{ width:4, height:28, borderRadius:2, bgcolor:T.accent }} />
              <Box>
                <Typography sx={{ fontFamily:fHead, fontWeight:700,
                  fontSize:"0.96rem", color:T.text }}>Add Nominee</Typography>
                <Typography sx={{ fontFamily:fBody, fontSize:"0.72rem", color:T.textMute }}>
                  Nominee details for insurance policy.
                </Typography>
              </Box>
            </Box>
            <Box onClick={() => setNomineeDialog(false)}
              sx={{ p:0.7, borderRadius:"8px", bgcolor:"#F1F5F9", cursor:"pointer",
                "&:hover":{ bgcolor:T.dangerLight } }}>
              <Close sx={{ fontSize:16, color:T.textMute }} />
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ px:3, pt:3, pb:2 }}>
          <Stack spacing={2}>
            <Box>
              <SLabel sx={{ mb:0.7 }}>Full Name *</SLabel>
              <DInput value={newNominee.name}
                onChange={e => setNewNominee(p => ({ ...p, name:e.target.value }))}
                placeholder="e.g. Priya Kumar" />
            </Box>
            <Box>
              <SLabel sx={{ mb:0.7 }}>Relationship *</SLabel>
              <DInput value={newNominee.relation}
                onChange={e => setNewNominee(p => ({ ...p, relation:e.target.value }))}
                placeholder="e.g. Spouse, Son, Mother" />
            </Box>
            <Box>
              <SLabel sx={{ mb:0.7 }}>Share % (optional)</SLabel>
              <DInput type="number" value={newNominee.share}
                onChange={e => setNewNominee(p => ({ ...p, share:e.target.value }))}
                placeholder="0 – 100"
                InputProps={{ endAdornment:
                  <InputAdornment position="end">
                    <Typography sx={{ fontFamily:fMono, fontSize:"0.8rem",
                      color:T.textMute }}>%</Typography>
                  </InputAdornment>
                }}
              />
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px:3, pb:3, pt:2,
          borderTop:`1px solid ${T.border}`, bgcolor:"#FAFBFD",
          display:"flex", justifyContent:"space-between" }}>
          <Button size="small" variant="outlined"
            onClick={() => setNomineeDialog(false)}
            sx={{ fontFamily:fBody, fontWeight:600, fontSize:"0.78rem",
              textTransform:"none", borderRadius:"8px",
              borderColor:T.border, color:T.textSub }}>
            Cancel
          </Button>
          <Button size="small" variant="contained"
            startIcon={<Save sx={{ fontSize:13 }} />}
            onClick={handleAddNominee}
            sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.78rem",
              textTransform:"none", borderRadius:"8px",
              bgcolor:T.accent, boxShadow:"none",
              "&:hover":{ bgcolor:"#4F46E5", boxShadow:"none" } }}>
            Save Nominee
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

export default LegalView;