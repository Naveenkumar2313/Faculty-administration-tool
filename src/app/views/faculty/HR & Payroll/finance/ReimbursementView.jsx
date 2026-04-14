import React, { useState, useRef } from 'react';
import {
  Box, Grid, Typography, Button, Tabs, Tab, TextField,
  MenuItem, Stack, InputAdornment, Snackbar, Alert,
  Divider
} from "@mui/material";
import {
  FlightTakeoff, MedicalServices, Wifi, MenuBook,
  CardMembership, AccountBalance, CloudUpload,
  Calculate, CheckCircle, Cancel, Schedule,
  HourglassEmpty, MonetizationOn, ArrowForward,
  FileDownload, Add, Refresh, AttachFile
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
    .fu2 { animation: fadeUp 0.28s .14s ease both; }
    .row-h:hover { background:#F9FAFB !important; transition:background .13s; }
    .card-h { transition:box-shadow .16s,transform .16s; cursor:pointer; }
    .card-h:hover { box-shadow:0 4px 20px rgba(99,102,241,.13); transform:translateY(-2px); }
    .drop-zone { transition:border-color .16s,background .16s; }
    .drop-zone:hover { border-color:${T.accent} !important; background:${T.accentLight} !important; }
  `}</style>
);

/* ─────────────────────────────────────────
   MOCK DATA
───────────────────────────────────────── */
const BUDGETS_INIT = [
  { category:"Conference & Travel",  used:38500, limit:75000, color:T.accent  },
  { category:"Medical Reimbursement",used:22000, limit:50000, color:T.danger  },
  { category:"Internet / Mobile",    used:9600,  limit:12000, color:T.info    },
  { category:"Book & Journals",      used:6200,  limit:10000, color:T.success },
  { category:"Membership Fees",      used:4500,  limit:8000,  color:T.gold    },
];

const CLAIMS_INIT = [
  {
    id:"CLM-2024-041", type:"Conference Fee", amount:18500,
    date:"14 Oct 2024", status:"Paid", step:3,
    description:"International Conference on AI — IIT Bombay",
    rejectionReason:null,
  },
  {
    id:"CLM-2024-038", type:"Travel Allowance", amount:4200,
    date:"05 Oct 2024", status:"Finance Check", step:2,
    description:"Official trip to AICTE, New Delhi (350 km × ₹12/km)",
    rejectionReason:null,
  },
  {
    id:"CLM-2024-031", type:"Medical Claim", amount:8750,
    date:"20 Sep 2024", status:"Rejected", step:1,
    description:"Hospitalization — Apollo Hospital",
    rejectionReason:"Original bills not attached. Please resubmit with GST-compliant receipts.",
  },
  {
    id:"CLM-2024-029", type:"Book Purchase", amount:3200,
    date:"12 Sep 2024", status:"HOD Approval", step:1,
    description:"Deep Learning textbooks for lab use",
    rejectionReason:null,
  },
];

const CLAIM_TYPES = [
  { label:"Conference Fee",   Icon:AccountBalance, color:T.accent  },
  { label:"Travel Allowance", Icon:FlightTakeoff,  color:T.purple  },
  { label:"Medical Claim",    Icon:MedicalServices,color:T.danger  },
  { label:"Internet/Mobile",  Icon:Wifi,           color:T.info    },
  { label:"Book Purchase",    Icon:MenuBook,       color:T.success },
  { label:"Membership Fee",   Icon:CardMembership, color:T.gold    },
];

const TRAVEL_MODES = [
  { value:"Car",   label:"Car (₹12/km)",  rate:12 },
  { value:"Bike",  label:"Bike (₹6/km)", rate:6  },
  { value:"Train", label:"Train (₹4/km)", rate:4  },
];

const DA_RATES = { Metro:750, "Non-Metro":500 };

const APPROVER_STEPS = [
  { label:"You",            sub:"Submit & upload bills"       },
  { label:"Dr. Ramesh (HOD)", sub:"HOD reviews & approves"   },
  { label:"Finance Dept.",  sub:"Audit & disbursal check"    },
  { label:"Disbursed",      sub:"Credit to bank account"     },
];

const STATUS_META = {
  "Paid":         { color:T.success, bg:T.successLight, Icon:CheckCircle   },
  "Finance Check":{ color:T.accent,  bg:T.accentLight,  Icon:HourglassEmpty},
  "HOD Approval": { color:T.warning, bg:T.warningLight, Icon:Schedule      },
  "Rejected":     { color:T.danger,  bg:T.dangerLight,  Icon:Cancel        },
  "Submitted":    { color:T.info,    bg:T.infoLight,    Icon:HourglassEmpty},
};

const STEP_LABELS = ["Submitted","HOD Approval","Finance Check","Disbursed"];

const fmt = (n) => Number(n || 0).toLocaleString("en-IN");

let nextId = 42;

/* ─────────────────────────────────────────
   PRIMITIVES
───────────────────────────────────────── */
const SCard = ({ children, sx={}, hover=false, onClick, ...p }) => (
  <Box className={hover?"card-h":""}
    onClick={onClick}
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
  const m = STATUS_META[status] || { color:T.textMute, bg:"#F1F5F9", Icon:HourglassEmpty };
  return (
    <Box display="flex" alignItems="center" gap={0.6}
      sx={{ px:1.3, py:0.42, borderRadius:"99px", bgcolor:m.bg, width:"fit-content" }}>
      <m.Icon sx={{ fontSize:11, color:m.color }} />
      <Typography sx={{ fontFamily:fBody, fontSize:"0.71rem", fontWeight:700, color:m.color }}>
        {status}
      </Typography>
    </Box>
  );
};

const ProgBar = ({ value, max, color=T.accent }) => {
  const pct = Math.min(100, (value / max) * 100);
  const warn = pct >= 85;
  const c = warn ? T.danger : pct >= 60 ? T.warning : color;
  return (
    <Box sx={{ height:7, borderRadius:99, bgcolor:T.border, overflow:"hidden" }}>
      <Box sx={{ height:"100%", width:`${pct}%`, borderRadius:99, bgcolor:c,
        transition:"width 1.2s ease" }} />
    </Box>
  );
};

/* ─────────────────────────────────────────
   CLAIM TRACKER STEPPER  (pure CSS/MUI)
───────────────────────────────────────── */
const ClaimStepper = ({ step, status }) => {
  return (
    <Box display="flex" alignItems="center" gap={0}>
      {STEP_LABELS.map((label, i) => {
        const done    = i < step;
        const active  = i === step;
        const isError = status === "Rejected" && active;
        const dotColor = isError ? T.danger
                       : done   ? T.success
                       : active ? T.accent
                       :          T.border;
        const textColor = isError ? T.danger
                        : done    ? T.success
                        : active  ? T.accent
                        :           T.textMute;
        return (
          <Box key={label} display="flex" alignItems="center" flex={i < STEP_LABELS.length - 1 ? 1 : 0}>
            <Box sx={{ display:"flex", flexDirection:"column", alignItems:"center", minWidth:60 }}>
              <Box sx={{ width:28, height:28, borderRadius:"50%", border:`2.5px solid ${dotColor}`,
                bgcolor: done ? T.success : active ? T.accent : T.surface,
                display:"flex", alignItems:"center", justifyContent:"center" }}>
                {done ? (
                  <CheckCircle sx={{ fontSize:14, color:"#fff" }} />
                ) : isError ? (
                  <Cancel sx={{ fontSize:14, color:T.danger }} />
                ) : (
                  <Box sx={{ width:8, height:8, borderRadius:"50%",
                    bgcolor: active ? "#fff" : T.border }} />
                )}
              </Box>
              <Typography sx={{ fontFamily:fBody, fontSize:"0.61rem", fontWeight:active||done ? 700 : 400,
                color:textColor, mt:0.5, textAlign:"center", lineHeight:1.2 }}>{label}</Typography>
            </Box>
            {i < STEP_LABELS.length - 1 && (
              <Box sx={{ flex:1, height:2, bgcolor: done ? T.success : T.border,
                mx:0.3, mb:1.5, borderRadius:99 }} />
            )}
          </Box>
        );
      })}
    </Box>
  );
};

/* ═════════════════════════════════════════════
   MAIN COMPONENT
═════════════════════════════════════════════ */
const ReimbursementView = () => {
  const [tabIndex,     setTabIndex]     = useState(0);
  const [budgets,      setBudgets]      = useState(BUDGETS_INIT);
  const [claims,       setClaims]       = useState(CLAIMS_INIT);

  /* Form state */
  const [claimType,    setClaimType]    = useState("");
  const [amount,       setAmount]       = useState("");
  const [description,  setDescription]  = useState("");
  const [uploadedFile, setUploadedFile] = useState(null);
  const [submitting,   setSubmitting]   = useState(false);
  const [formErr,      setFormErr]      = useState({});
  const fileRef = useRef();

  /* TA/DA state */
  const [tripDistance, setTripDistance] = useState("");
  const [tripMode,     setTripMode]     = useState("Car");
  const [tripCity,     setTripCity]     = useState("Non-Metro");
  const [tadaResult,   setTadaResult]   = useState(null);

  const [snack, setSnack] = useState({ open:false, msg:"", severity:"success" });
  const toast = (msg, severity="success") => setSnack({ open:true, msg, severity });

  /* Quick claim → pre-fill form */
  const handleQuickClaim = (type) => { setClaimType(type); setTabIndex(2); };

  /* TA/DA calculator */
  const handleTADA = () => {
    const km = parseFloat(tripDistance) || 0;
    if (!km) { toast("Enter a valid distance in km.", "error"); return; }
    const mode = TRAVEL_MODES.find(m => m.value === tripMode);
    const travelCost = Math.round(km * (mode?.rate || 12));
    const da         = DA_RATES[tripCity] || 500;
    const total      = travelCost + da;
    setTadaResult({ travelCost, da, total, km, mode:tripMode, city:tripCity });
    setAmount(String(total));
    toast(`TA/DA calculated: ₹${fmt(total)}`);
  };

  /* Validate form */
  const validate = () => {
    const e = {};
    if (!claimType) e.claimType = "Please select an expense type.";
    if (!amount || isNaN(amount) || Number(amount) <= 0) e.amount = "Enter a valid amount.";
    if (!description.trim()) e.description = "Justification is required.";
    if (!uploadedFile) e.upload = "Please attach at least one bill.";
    setFormErr(e);
    return Object.keys(e).length === 0;
  };

  /* Submit claim */
  const handleSubmit = () => {
    if (!validate()) return;
    setSubmitting(true);
    setTimeout(() => {
      const id  = `CLM-2024-0${nextId++}`;
      const newClaim = {
        id, type:claimType, amount:parseFloat(amount),
        date:new Date().toLocaleDateString("en-IN", { day:"2-digit", month:"short", year:"numeric" }),
        status:"Submitted", step:0, description, rejectionReason:null,
      };
      setClaims(p => [newClaim, ...p]);
      /* Update budget utilisation */
      const match = claimType === "Travel Allowance" ? "Conference & Travel"
                  : claimType === "Conference Fee"   ? "Conference & Travel"
                  : claimType === "Medical Claim"    ? "Medical Reimbursement"
                  : claimType === "Internet/Mobile"  ? "Internet / Mobile"
                  : claimType === "Book Purchase"    ? "Book & Journals"
                  : claimType === "Membership Fee"   ? "Membership Fees"
                  : null;
      if (match) {
        setBudgets(p => p.map(b => b.category === match
          ? { ...b, used:Math.min(b.limit, b.used + parseFloat(amount)) }
          : b));
      }
      setClaimType(""); setAmount(""); setDescription("");
      setUploadedFile(null); setTadaResult(null); setFormErr({});
      setSubmitting(false);
      setTabIndex(1);
      toast(`Claim ${id} submitted successfully.`);
    }, 900);
  };

  /* Resubmit rejected claim */
  const handleResubmit = (claim) => {
    setClaims(p => p.map(c => c.id === claim.id ? { ...c, status:"Submitted", step:0, rejectionReason:null } : c));
    toast(`${claim.id} resubmitted for review.`);
  };

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
            Faculty Portal · Finance
          </Typography>
          <Typography sx={{ fontFamily:fHead, fontWeight:700, fontSize:"1.5rem", color:T.text }}>
            Claims &amp; Reimbursements
          </Typography>
          <Typography sx={{ fontFamily:fBody, fontSize:"0.82rem", color:T.textSub, mt:0.3 }}>
            Dr. Sarah Smith &nbsp;·&nbsp; Department of Computer Science
          </Typography>
        </Box>
        <Button size="small" variant="contained"
          startIcon={<Add sx={{ fontSize:15 }} />}
          onClick={() => setTabIndex(2)}
          sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.76rem", textTransform:"none",
            borderRadius:"8px", bgcolor:T.accent, boxShadow:"none", mt:0.5,
            "&:hover":{ bgcolor:"#4F46E5", boxShadow:"none" } }}>
          New Claim
        </Button>
      </Box>

      {/* ── Main Card ── */}
      <SCard sx={{ overflow:"hidden" }} className="fu1">

        {/* Tab bar */}
        <Box sx={{ borderBottom:`1px solid ${T.border}`, bgcolor:"#FAFBFD" }}>
          <Tabs value={tabIndex} onChange={(_, v) => setTabIndex(v)} sx={{
            px:1,
            "& .MuiTabs-indicator":{ bgcolor:T.accent, height:"2.5px",
              borderRadius:"2px 2px 0 0" },
            "& .MuiTab-root":{ fontFamily:fBody, fontWeight:600, fontSize:"0.78rem",
              textTransform:"none", color:T.textMute, minHeight:52,
              "&.Mui-selected":{ color:T.accent } }
          }}>
            <Tab label="Overview" />
            <Tab label={`My Claims Tracker${claims.some(c=>c.status==="Rejected") ? " ●" : ""}`} />
            <Tab label="New Claim Submission" />
          </Tabs>
        </Box>

        <Box sx={{ p:3 }}>

          {/* ══════════════════════════════════════
              TAB 0 — OVERVIEW
          ══════════════════════════════════════ */}
          {tabIndex === 0 && (
            <Grid container spacing={3}>

              {/* Budget utilisation */}
              <Grid item xs={12} md={7}>
                <Typography sx={{ fontFamily:fHead, fontWeight:700,
                  fontSize:"0.96rem", color:T.text, mb:0.4 }}>Annual Budget Utilisation</Typography>
                <Typography sx={{ fontFamily:fBody, fontSize:"0.76rem",
                  color:T.textMute, mb:2.5 }}>FY 2024-25 · Resets 1 April 2025</Typography>

                <Stack spacing={2.5}>
                  {budgets.map((b, i) => {
                    const pct = Math.round((b.used / b.limit) * 100);
                    const warn = pct >= 85;
                    return (
                      <Box key={i}>
                        <Box display="flex" justifyContent="space-between"
                          alignItems="center" mb={0.8}>
                          <Typography sx={{ fontFamily:fBody, fontWeight:700,
                            fontSize:"0.8rem", color:T.text }}>{b.category}</Typography>
                          <Box display="flex" alignItems="center" gap={1.2}>
                            <Typography sx={{ fontFamily:fMono, fontSize:"0.74rem",
                              color:T.textMute }}>
                              ₹{fmt(b.used)} / ₹{fmt(b.limit)}
                            </Typography>
                            <Box sx={{ px:0.9, py:0.18, borderRadius:"99px",
                              bgcolor: warn ? T.dangerLight : T.successLight }}>
                              <Typography sx={{ fontFamily:fMono, fontWeight:700,
                                fontSize:"0.64rem",
                                color: warn ? T.danger : T.success }}>
                                {pct}%
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                        <ProgBar value={b.used} max={b.limit} color={b.color} />
                        <Typography sx={{ fontFamily:fBody, fontSize:"0.68rem",
                          color:T.textMute, mt:0.5 }}>
                          ₹{fmt(b.limit - b.used)} remaining
                        </Typography>
                      </Box>
                    );
                  })}
                </Stack>
              </Grid>

              {/* Quick claim buttons */}
              <Grid item xs={12} md={5}>
                <Typography sx={{ fontFamily:fHead, fontWeight:700,
                  fontSize:"0.96rem", color:T.text, mb:0.4 }}>Quick Claim</Typography>
                <Typography sx={{ fontFamily:fBody, fontSize:"0.76rem",
                  color:T.textMute, mb:2.5 }}>Select a category to jump to the form</Typography>

                <Grid container spacing={1.5}>
                  {CLAIM_TYPES.map(ct => (
                    <Grid item xs={6} key={ct.label}>
                      <SCard hover sx={{ p:2, textAlign:"center" }}
                        onClick={() => handleQuickClaim(ct.label)}>
                        <Box sx={{ display:"inline-flex", p:1, borderRadius:"10px",
                          bgcolor:`${ct.color}15`, mb:1 }}>
                          <ct.Icon sx={{ fontSize:20, color:ct.color }} />
                        </Box>
                        <Typography sx={{ fontFamily:fBody, fontWeight:700,
                          fontSize:"0.75rem", color:T.text, lineHeight:1.3 }}>
                          {ct.label}
                        </Typography>
                      </SCard>
                    </Grid>
                  ))}
                </Grid>

                {/* Summary strip */}
                <SCard sx={{ mt:2, p:2, bgcolor:"#FAFBFD" }}>
                  <Box display="flex" justifyContent="space-between">
                    {[
                      { label:"Total Claims", value:claims.length,
                        color:T.accent },
                      { label:"Paid",
                        value:claims.filter(c=>c.status==="Paid").length,
                        color:T.success },
                      { label:"Pending",
                        value:claims.filter(c=>["HOD Approval","Finance Check","Submitted"].includes(c.status)).length,
                        color:T.warning },
                      { label:"Rejected",
                        value:claims.filter(c=>c.status==="Rejected").length,
                        color:T.danger },
                    ].map(s => (
                      <Box key={s.label} sx={{ textAlign:"center" }}>
                        <Typography sx={{ fontFamily:fMono, fontWeight:700,
                          fontSize:"1.2rem", color:s.color }}>{s.value}</Typography>
                        <Typography sx={{ fontFamily:fBody, fontSize:"0.66rem",
                          color:T.textMute }}>{s.label}</Typography>
                      </Box>
                    ))}
                  </Box>
                </SCard>
              </Grid>
            </Grid>
          )}

          {/* ══════════════════════════════════════
              TAB 1 — CLAIMS TRACKER
          ══════════════════════════════════════ */}
          {tabIndex === 1 && (
            <Stack spacing={2.5}>
              {claims.map(claim => {
                const sm = STATUS_META[claim.status] || STATUS_META["Submitted"];
                return (
                  <SCard key={claim.id} sx={{ p:2.8,
                    borderLeft:`4px solid ${sm.color}` }}>
                    <Grid container spacing={2.5} alignItems="flex-start">

                      {/* Left: claim info */}
                      <Grid item xs={12} md={4}>
                        <Box display="flex" alignItems="flex-start" gap={1.2} mb={1}>
                          {(() => {
                            const ct = CLAIM_TYPES.find(c => c.label === claim.type);
                            return ct ? (
                              <Box sx={{ p:0.7, borderRadius:"8px",
                                bgcolor:`${ct.color}15`, color:ct.color, flexShrink:0 }}>
                                <ct.Icon sx={{ fontSize:15 }} />
                              </Box>
                            ) : null;
                          })()}
                          <Box>
                            <Typography sx={{ fontFamily:fHead, fontWeight:700,
                              fontSize:"0.88rem", color:T.text }}>{claim.type}</Typography>
                            <Typography sx={{ fontFamily:fBody, fontSize:"0.72rem",
                              color:T.textMute }}>{claim.description}</Typography>
                          </Box>
                        </Box>

                        <Typography sx={{ fontFamily:fMono, fontWeight:700,
                          fontSize:"1.5rem", color:T.accent, lineHeight:1, mb:0.5 }}>
                          ₹{fmt(claim.amount)}
                        </Typography>

                        <Typography sx={{ fontFamily:fMono, fontSize:"0.69rem",
                          color:T.textMute }}>
                          {claim.id} &nbsp;·&nbsp; {claim.date}
                        </Typography>

                        <Box mt={1.5}>
                          <StatusPill status={claim.status} />
                        </Box>

                        {claim.status === "Rejected" && claim.rejectionReason && (
                          <Box sx={{ mt:1.5, p:1.5, borderRadius:"8px",
                            bgcolor:T.dangerLight, border:`1px solid ${T.danger}20` }}>
                            <SLabel sx={{ color:T.danger, mb:0.3 }}>Rejection Reason</SLabel>
                            <Typography sx={{ fontFamily:fBody, fontSize:"0.74rem",
                              color:T.textSub, lineHeight:1.6 }}>
                              {claim.rejectionReason}
                            </Typography>
                            <Button size="small" variant="outlined"
                              startIcon={<Refresh sx={{ fontSize:12 }} />}
                              onClick={() => handleResubmit(claim)}
                              sx={{ mt:1.2, fontFamily:fBody, fontWeight:700, fontSize:"0.69rem",
                                textTransform:"none", borderRadius:"7px",
                                borderColor:T.danger, color:T.danger,
                                "&:hover":{ bgcolor:T.dangerLight } }}>
                              Resubmit Claim
                            </Button>
                          </Box>
                        )}
                      </Grid>

                      {/* Right: stepper */}
                      <Grid item xs={12} md={8}>
                        <Box sx={{ pt:{ md:1 } }}>
                          <ClaimStepper step={claim.step} status={claim.status} />
                        </Box>
                      </Grid>
                    </Grid>
                  </SCard>
                );
              })}

              {claims.length === 0 && (
                <Box sx={{ textAlign:"center", py:8 }}>
                  <MonetizationOn sx={{ fontSize:44, color:T.border,
                    display:"block", mx:"auto", mb:1.5 }} />
                  <Typography sx={{ fontFamily:fBody, color:T.textMute }}>
                    No claims submitted yet.
                  </Typography>
                </Box>
              )}
            </Stack>
          )}

          {/* ══════════════════════════════════════
              TAB 2 — NEW CLAIM FORM
          ══════════════════════════════════════ */}
          {tabIndex === 2 && (
            <Grid container spacing={3}>

              {/* Main form */}
              <Grid item xs={12} md={8}>
                <Typography sx={{ fontFamily:fHead, fontWeight:700,
                  fontSize:"0.96rem", color:T.text, mb:2.5 }}>Claim Details</Typography>

                <Grid container spacing={2}>

                  {/* Type + Amount */}
                  <Grid item xs={12} md={6}>
                    <SLabel sx={{ mb:0.7 }}>Expense Type *</SLabel>
                    <DInput select value={claimType}
                      onChange={e => { setClaimType(e.target.value); setTadaResult(null); setFormErr(p => ({ ...p, claimType:null })); }}
                      error={!!formErr.claimType}
                      helperText={formErr.claimType}>
                      <MenuItem value="" sx={{ fontFamily:fBody, fontSize:"0.82rem", color:T.textMute }}>
                        — Select type —
                      </MenuItem>
                      {CLAIM_TYPES.map(ct => (
                        <MenuItem key={ct.label} value={ct.label}
                          sx={{ fontFamily:fBody, fontSize:"0.82rem" }}>
                          <Box display="flex" alignItems="center" gap={1}>
                            <Box sx={{ p:0.4, borderRadius:"5px",
                              bgcolor:`${ct.color}15`, color:ct.color }}>
                              <ct.Icon sx={{ fontSize:13 }} />
                            </Box>
                            {ct.label}
                          </Box>
                        </MenuItem>
                      ))}
                    </DInput>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <SLabel sx={{ mb:0.7 }}>Claim Amount *</SLabel>
                    <DInput type="number" value={amount}
                      onChange={e => { setAmount(e.target.value); setFormErr(p => ({ ...p, amount:null })); }}
                      error={!!formErr.amount}
                      helperText={formErr.amount}
                      InputProps={{ startAdornment:
                        <InputAdornment position="start">
                          <Typography sx={{ fontFamily:fMono, fontWeight:700,
                            fontSize:"0.82rem", color:T.textSub }}>₹</Typography>
                        </InputAdornment>
                      }}
                    />
                  </Grid>

                  {/* TA/DA calculator — only for Travel Allowance */}
                  {claimType === "Travel Allowance" && (
                    <Grid item xs={12}>
                      <SCard sx={{ p:2.5, bgcolor:"#FAFBFD",
                        borderLeft:`3.5px solid ${T.purple}` }}>
                        <Box display="flex" alignItems="center" gap={1.2} mb={1.8}>
                          <Box sx={{ p:0.7, borderRadius:"8px",
                            bgcolor:T.purpleLight, color:T.purple }}>
                            <Calculate sx={{ fontSize:15 }} />
                          </Box>
                          <Box>
                            <Typography sx={{ fontFamily:fHead, fontWeight:700,
                              fontSize:"0.85rem", color:T.text }}>TA/DA Auto-Calculator</Typography>
                            <Typography sx={{ fontFamily:fBody, fontSize:"0.72rem",
                              color:T.textMute }}>
                              Fills the amount field automatically.
                            </Typography>
                          </Box>
                        </Box>

                        <Grid container spacing={1.5}>
                          <Grid item xs={12} md={4}>
                            <SLabel sx={{ mb:0.6 }}>Distance (km)</SLabel>
                            <DInput type="number" value={tripDistance}
                              onChange={e => setTripDistance(e.target.value)}
                              placeholder="e.g. 350" />
                          </Grid>
                          <Grid item xs={12} md={4}>
                            <SLabel sx={{ mb:0.6 }}>Travel Mode</SLabel>
                            <DInput select value={tripMode}
                              onChange={e => setTripMode(e.target.value)}>
                              {TRAVEL_MODES.map(m => (
                                <MenuItem key={m.value} value={m.value}
                                  sx={{ fontFamily:fBody, fontSize:"0.82rem" }}>
                                  {m.label}
                                </MenuItem>
                              ))}
                            </DInput>
                          </Grid>
                          <Grid item xs={12} md={4}>
                            <SLabel sx={{ mb:0.6 }}>City Category</SLabel>
                            <DInput select value={tripCity}
                              onChange={e => setTripCity(e.target.value)}>
                              {["Metro","Non-Metro"].map(c => (
                                <MenuItem key={c} value={c}
                                  sx={{ fontFamily:fBody, fontSize:"0.82rem" }}>{c}</MenuItem>
                              ))}
                            </DInput>
                          </Grid>
                          <Grid item xs={12}>
                            <Button variant="outlined" size="small"
                              onClick={handleTADA}
                              startIcon={<Calculate sx={{ fontSize:14 }} />}
                              sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.76rem",
                                textTransform:"none", borderRadius:"8px",
                                borderColor:T.purple, color:T.purple,
                                "&:hover":{ bgcolor:T.purpleLight } }}>
                              Calculate &amp; Apply
                            </Button>

                            {tadaResult && (
                              <Box display="flex" alignItems="center" gap={1} mt={1.5}
                                sx={{ px:1.5, py:1, borderRadius:"8px",
                                  bgcolor:T.purpleLight, border:`1px solid ${T.purple}20` }}>
                                <Typography sx={{ fontFamily:fBody, fontSize:"0.75rem",
                                  color:T.purple }}>
                                  Travel: <Box component="span"
                                    sx={{ fontFamily:fMono, fontWeight:700 }}>
                                    ₹{fmt(tadaResult.travelCost)}</Box>
                                  &nbsp;+&nbsp; DA: <Box component="span"
                                    sx={{ fontFamily:fMono, fontWeight:700 }}>
                                    ₹{fmt(tadaResult.da)}</Box>
                                  &nbsp;=&nbsp; Total: <Box component="span"
                                    sx={{ fontFamily:fMono, fontWeight:700, color:T.text }}>
                                    ₹{fmt(tadaResult.total)}</Box>
                                </Typography>
                              </Box>
                            )}
                          </Grid>
                        </Grid>
                      </SCard>
                    </Grid>
                  )}

                  {/* Description */}
                  <Grid item xs={12}>
                    <SLabel sx={{ mb:0.7 }}>Justification / Description *</SLabel>
                    <DInput multiline rows={3} value={description}
                      onChange={e => { setDescription(e.target.value); setFormErr(p => ({ ...p, description:null })); }}
                      placeholder="Briefly describe the expense and its purpose…"
                      error={!!formErr.description}
                      helperText={formErr.description}
                    />
                  </Grid>

                  {/* Upload zone */}
                  <Grid item xs={12}>
                    <SLabel sx={{ mb:0.7 }}>Bill / Receipt Upload *</SLabel>
                    <input type="file" ref={fileRef} style={{ display:"none" }}
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={e => {
                        const f = e.target.files?.[0];
                        if (f) { setUploadedFile(f); setFormErr(p => ({ ...p, upload:null })); }
                      }}
                    />
                    <Box className="drop-zone"
                      onClick={() => fileRef.current?.click()}
                      sx={{ border:`2px dashed ${formErr.upload ? T.danger : T.border}`,
                        borderRadius:"12px", p:3, textAlign:"center", cursor:"pointer",
                        bgcolor: uploadedFile ? T.successLight : "transparent" }}>
                      {uploadedFile ? (
                        <Box display="flex" alignItems="center"
                          justifyContent="center" gap={1}>
                          <AttachFile sx={{ fontSize:18, color:T.success }} />
                          <Typography sx={{ fontFamily:fBody, fontWeight:700,
                            fontSize:"0.82rem", color:T.success }}>
                            {uploadedFile.name}
                          </Typography>
                          <Box onClick={e => { e.stopPropagation(); setUploadedFile(null); }}
                            sx={{ ml:0.5, cursor:"pointer", color:T.danger,
                              fontSize:14, lineHeight:1 }}>✕</Box>
                        </Box>
                      ) : (
                        <>
                          <CloudUpload sx={{ fontSize:28, color:T.textMute,
                            display:"block", mx:"auto", mb:0.8 }} />
                          <Typography sx={{ fontFamily:fBody, fontWeight:600,
                            fontSize:"0.8rem", color:T.textSub }}>
                            Drag &amp; drop bills here or click to upload
                          </Typography>
                          <Typography sx={{ fontFamily:fBody, fontSize:"0.7rem",
                            color:T.textMute, mt:0.4 }}>
                            PDF, JPG, PNG &nbsp;·&nbsp; Max 5 MB
                          </Typography>
                        </>
                      )}
                    </Box>
                    {formErr.upload && (
                      <Typography sx={{ fontFamily:fBody, fontSize:"0.72rem",
                        color:T.danger, mt:0.5 }}>{formErr.upload}</Typography>
                    )}
                  </Grid>

                  {/* Submit */}
                  <Grid item xs={12}>
                    <Button fullWidth variant="contained"
                      disabled={submitting}
                      onClick={handleSubmit}
                      startIcon={submitting ? null :
                        <CheckCircle sx={{ fontSize:15 }} />}
                      sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.84rem",
                        textTransform:"none", borderRadius:"9px", py:1.2,
                        bgcolor:T.accent, boxShadow:"none",
                        "&:hover":{ bgcolor:"#4F46E5", boxShadow:"none" },
                        "&.Mui-disabled":{ bgcolor:T.border, color:T.textMute } }}>
                      {submitting ? "Submitting Claim…" : "Submit Claim"}
                    </Button>
                  </Grid>
                </Grid>
              </Grid>

              {/* Sidebar */}
              <Grid item xs={12} md={4}>
                <Stack spacing={2}>

                  {/* Info note */}
                  <Box sx={{ p:2, borderRadius:"10px",
                    bgcolor:T.warningLight, border:`1px solid ${T.warning}20`,
                    display:"flex", gap:0.8, alignItems:"flex-start" }}>
                    <Box sx={{ width:4, height:"100%", minHeight:24, borderRadius:2,
                      bgcolor:T.warning, flexShrink:0 }} />
                    <Box>
                      <Typography sx={{ fontFamily:fBody, fontWeight:700,
                        fontSize:"0.75rem", color:T.warning, mb:0.3 }}>
                        Important
                      </Typography>
                      <Typography sx={{ fontFamily:fBody, fontSize:"0.74rem",
                        color:T.textSub, lineHeight:1.65 }}>
                        Upload original GST-compliant bills. Handwritten bills
                        require HOD countersign. Claims older than 60 days
                        will not be processed.
                      </Typography>
                    </Box>
                  </Box>

                  {/* Approver flow */}
                  <SCard sx={{ p:2.5, bgcolor:"#FAFBFD" }}>
                    <Typography sx={{ fontFamily:fHead, fontWeight:700,
                      fontSize:"0.86rem", color:T.text, mb:2 }}>Approval Flow</Typography>

                    <Stack spacing={0}>
                      {APPROVER_STEPS.map((s, i) => (
                        <Box key={i} display="flex" gap={1.5}>
                          <Box display="flex" flexDirection="column" alignItems="center">
                            <Box sx={{ width:26, height:26, borderRadius:"50%",
                              bgcolor: i === 0 ? T.accent : T.border,
                              border:`2.5px solid ${i === 0 ? T.accent : T.border}`,
                              display:"flex", alignItems:"center", justifyContent:"center",
                              flexShrink:0 }}>
                              {i === 0 ? (
                                <Box sx={{ width:8, height:8, borderRadius:"50%", bgcolor:"#fff" }} />
                              ) : (
                                <Typography sx={{ fontFamily:fMono, fontWeight:700,
                                  fontSize:"0.6rem", color:T.surface }}>{i+1}</Typography>
                              )}
                            </Box>
                            {i < APPROVER_STEPS.length - 1 && (
                              <Box sx={{ width:2, height:28, bgcolor:T.border, my:0.3 }} />
                            )}
                          </Box>
                          <Box sx={{ pb: i < APPROVER_STEPS.length - 1 ? 0 : 0 }}>
                            <Typography sx={{ fontFamily:fBody, fontWeight:700,
                              fontSize:"0.78rem", color: i === 0 ? T.accent : T.text,
                              mt:0.3 }}>{s.label}</Typography>
                            <Typography sx={{ fontFamily:fBody, fontSize:"0.7rem",
                              color:T.textMute, mb:0.8 }}>{s.sub}</Typography>
                          </Box>
                        </Box>
                      ))}
                    </Stack>
                  </SCard>

                  {/* Annual limits quick view */}
                  <SCard sx={{ p:2.5, bgcolor:"#FAFBFD" }}>
                    <Typography sx={{ fontFamily:fHead, fontWeight:700,
                      fontSize:"0.86rem", color:T.text, mb:1.5 }}>Budget Limits</Typography>
                    <Stack spacing={1}>
                      {budgets.map(b => {
                        const pct = Math.round((b.used / b.limit) * 100);
                        return (
                          <Box key={b.category} display="flex"
                            justifyContent="space-between" alignItems="center">
                            <Typography sx={{ fontFamily:fBody, fontSize:"0.74rem",
                              color:T.textSub, maxWidth:130,
                              overflow:"hidden", textOverflow:"ellipsis",
                              whiteSpace:"nowrap" }}>
                              {b.category}
                            </Typography>
                            <Box display="flex" alignItems="center" gap={0.7}>
                              <Box sx={{ width:48, height:4, borderRadius:99,
                                bgcolor:T.border, overflow:"hidden" }}>
                                <Box sx={{ height:"100%", width:`${pct}%`,
                                  bgcolor: pct >= 85 ? T.danger : b.color,
                                  borderRadius:99 }} />
                              </Box>
                              <Typography sx={{ fontFamily:fMono, fontWeight:700,
                                fontSize:"0.68rem",
                                color: pct >= 85 ? T.danger : T.textMute }}>
                                {pct}%
                              </Typography>
                            </Box>
                          </Box>
                        );
                      })}
                    </Stack>
                  </SCard>
                </Stack>
              </Grid>
            </Grid>
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

export default ReimbursementView;