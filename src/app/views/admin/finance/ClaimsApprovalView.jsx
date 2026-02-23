import React, { useState } from "react";
import {
  Box, Grid, Typography, Button, Table, TableBody, TableCell,
  TableHead, TableRow, IconButton, Tooltip, Stepper, Step, StepLabel,
  Dialog, DialogTitle, DialogContent, DialogActions,
  Stack, Divider, Avatar, TextField, MenuItem,
  Snackbar, Alert, InputAdornment, Tabs, Tab
} from "@mui/material";
import {
  CheckCircle, Cancel, Visibility, ReceiptLong,
  AttachMoney, Map, Warning, Close, Download,
  Search, MonetizationOn, LocalHospital,
  Flight, Science, ArrowForward, ErrorOutline,
  AssignmentTurnedIn, Verified
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
    @keyframes fadeUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:none} }
    .fu  { animation: fadeUp 0.32s ease both; }
    .fu1 { animation: fadeUp 0.32s 0.06s ease both; }
    .row-h:hover { background:#F9FAFB !important; transition:background 0.15s; }
    .MuiStepLabel-label {
      font-family:'Nunito',sans-serif !important;
      font-size:0.74rem !important; font-weight:600 !important;
    }
    .MuiStepLabel-label.Mui-active    { color:#6366F1 !important; font-weight:700 !important; }
    .MuiStepLabel-label.Mui-completed { color:#10B981 !important; }
    .MuiStepIcon-root.Mui-active      { color:#6366F1 !important; }
    .MuiStepIcon-root.Mui-completed   { color:#10B981 !important; }
    .MuiStepConnector-line            { border-color:#E4E8EF !important; }
  `}</style>
);

/* ── Mock Data ── */
const CLAIMS_INIT = [
  {
    id:1, faculty:"Dr. Sarah Smith",   avatar:"SS", dept:"CSE",   empId:"FAC-0041",
    type:"Conference",      amount:12000, date:"2026-02-01", stage:1, status:"Pending",
    proof:"conf_receipt.pdf",   distance:0,
    desc:"ICML 2026 — Registration fee + accommodation (3 nights), New Delhi",
    hodNote:"Approved — directly relevant to faculty's research publication pipeline",
    hodBy:"Prof. K. Rao", hodDate:"2026-01-30",
  },
  {
    id:2, faculty:"Prof. Rajan Kumar", avatar:"RK", dept:"Mech",  empId:"FAC-0012",
    type:"Medical",         amount:4500,  date:"2026-01-28", stage:2, status:"Pending",
    proof:"med_bills.pdf",      distance:0,
    desc:"Apollo Hospital — treatment on 27-Jan-2026 (post-surgery follow-up)",
    hodNote:"Approved — valid medical claim per HR policy section 6.2",
    hodBy:"Dr. A. Singh", hodDate:"2026-01-29",
  },
  {
    id:3, faculty:"Dr. Emily Davis",   avatar:"ED", dept:"Civil", empId:"FAC-0087",
    type:"Travel (TA/DA)",  amount:8500,  date:"2026-02-03", stage:0, status:"Pending",
    proof:"ticket.pdf",         distance:450,
    desc:"ASCE Workshop — Bangalore to Chennai and return (train + local taxi)",
    hodNote:"Awaiting HOD review",
    hodBy:"", hodDate:"",
  },
  {
    id:4, faculty:"Ms. Kavya Sharma",  avatar:"KS", dept:"ECE",   empId:"FAC-0115",
    type:"Research Grant",  amount:25000, date:"2026-01-30", stage:1, status:"Pending",
    proof:"grant_invoice.pdf",  distance:0,
    desc:"IoT Lab — Raspberry Pi units, sensors, and PCB fabrication for funded project",
    hodNote:"Approved — within DST grant scope. PO attached.",
    hodBy:"Dr. R. Kumar", hodDate:"2026-01-31",
  },
];

const HISTORY_INIT = [
  { id:101, faculty:"Dr. A. Verma",  dept:"Civil", type:"Conference",     amount:8500,  date:"2026-01-10", status:"Paid",     processedBy:"Finance Admin", note:"" },
  { id:102, faculty:"Ms. P. Nair",   dept:"ECE",   type:"Medical",        amount:2800,  date:"2026-01-08", status:"Rejected", processedBy:"HOD",           note:"Bills older than 90 days — ineligible" },
  { id:103, faculty:"Prof. S. Khan", dept:"Mech",  type:"Travel (TA/DA)", amount:5200,  date:"2025-12-22", status:"Paid",     processedBy:"Finance Admin", note:"" },
  { id:104, faculty:"Dr. N. Mishra", dept:"CSE",   type:"Research Grant", amount:15000, date:"2025-12-10", status:"Paid",     processedBy:"Finance Admin", note:"" },
];

const BUDGETS = [
  { category:"Conference",     Icon:Flight,        limit:50000,  used:38000, color:T.accent  },
  { category:"Medical",        Icon:LocalHospital, limit:15000,  used:11000, color:T.warning },
  { category:"Travel (TA/DA)", Icon:Map,           limit:25000,  used:5000,  color:T.success },
  { category:"Research Grant", Icon:Science,       limit:100000, used:92000, color:T.purple  },
];

const STEPS   = ["HOD Approval", "Finance Verification", "Accounts Payment"];
const TA_RATE = 15;

const TYPE_STYLE = {
  "Conference":      { color:T.accent,   bg:T.accentLight  },
  "Medical":         { color:T.success,  bg:T.successLight },
  "Travel (TA/DA)":  { color:T.warning,  bg:T.warningLight },
  "Research Grant":  { color:T.purple,   bg:T.purpleLight  },
};

/* ── Reusable primitives ── */
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

const TH = ({ children, align }) => (
  <TableCell align={align} sx={{
    fontFamily:fBody, fontWeight:700, fontSize:"0.68rem",
    letterSpacing:"0.06em", textTransform:"uppercase",
    color:T.textMute, borderBottom:`1px solid ${T.border}`,
    py:1.5, bgcolor:"#F9FAFB", whiteSpace:"nowrap"
  }}>{children}</TableCell>
);

const TD = ({ children, sx={}, align }) => (
  <TableCell align={align} sx={{
    fontFamily:fBody, fontSize:"0.81rem", color:T.textSub,
    borderBottom:`1px solid ${T.border}`, py:1.75, ...sx
  }}>{children}</TableCell>
);

const TypeBadge = ({ type }) => {
  const s = TYPE_STYLE[type] || { color:T.textMute, bg:"#F1F5F9" };
  return (
    <Box sx={{ px:1.1, py:0.32, borderRadius:"6px", bgcolor:s.bg, display:"inline-block" }}>
      <Typography sx={{ fontFamily:fBody, fontSize:"0.71rem", fontWeight:700, color:s.color }}>
        {type}
      </Typography>
    </Box>
  );
};

const StatusPill = ({ status }) => {
  const map = {
    Pending:  { color:T.warning, bg:T.warningLight },
    Paid:     { color:T.success, bg:T.successLight },
    Rejected: { color:T.danger,  bg:T.dangerLight  },
  };
  const s = map[status] || { color:T.textMute, bg:"#F1F5F9" };
  return (
    <Box display="flex" alignItems="center" gap={0.6}
      sx={{ px:1.2, py:0.35, borderRadius:"99px", bgcolor:s.bg, width:"fit-content" }}>
      <Box sx={{ width:6, height:6, borderRadius:"50%", bgcolor:s.color }} />
      <Typography sx={{ fontFamily:fBody, fontSize:"0.71rem", fontWeight:700, color:s.color }}>
        {status}
      </Typography>
    </Box>
  );
};

const StageMini = ({ stage }) => (
  <Box display="flex" alignItems="center" gap={0.4}>
    {STEPS.map((s, i) => (
      <React.Fragment key={s}>
        <Box sx={{
          px:0.8, py:0.22, borderRadius:"5px",
          bgcolor: i < stage ? T.successLight : i === stage ? T.accentLight : "#F1F5F9"
        }}>
          <Typography sx={{
            fontFamily:fBody, fontSize:"0.61rem", fontWeight:700,
            color: i < stage ? T.success : i === stage ? T.accent : T.textMute
          }}>
            {s.split(" ")[0]}
          </Typography>
        </Box>
        {i < 2 && <ArrowForward sx={{ fontSize:8, color:T.border }} />}
      </React.Fragment>
    ))}
  </Box>
);

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

const InfoRow = ({ label, value }) => (
  <Box sx={{
    display:"flex", justifyContent:"space-between", alignItems:"flex-start",
    py:1.1, borderBottom:`1px solid ${T.border}`, "&:last-child":{ borderBottom:"none" }
  }}>
    <Typography sx={{ fontFamily:fBody, fontSize:"0.77rem", color:T.textMute, flexShrink:0, mr:1 }}>
      {label}
    </Typography>
    <Box sx={{ textAlign:"right" }}>{value}</Box>
  </Box>
);

/* ════════════════════════════════
   MAIN COMPONENT
════════════════════════════════ */
const ClaimsApprovalView = () => {
  const [claims, setClaims]         = useState(CLAIMS_INIT);
  const [history, setHistory]       = useState(HISTORY_INIT);
  const [dialog, setDialog]         = useState(null);
  const [rejectMode, setRejectMode] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [tabIndex, setTabIndex]     = useState(0);
  const [searchQ, setSearchQ]       = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [histSearch, setHistSearch] = useState("");
  const [snack, setSnack]           = useState({ open:false, msg:"", severity:"success" });

  const toast = (msg, severity="success") => setSnack({ open:true, msg, severity });

  const pending  = claims.filter(c => c.status === "Pending");
  const resolved = claims.filter(c => c.status !== "Pending");

  const filteredPending = pending.filter(c => {
    if (typeFilter !== "All" && c.type !== typeFilter) return false;
    if (searchQ && !c.faculty.toLowerCase().includes(searchQ.toLowerCase()) &&
        !c.dept.toLowerCase().includes(searchQ.toLowerCase())) return false;
    return true;
  });

  const filteredHistory = history.filter(h =>
    !histSearch ||
    h.faculty.toLowerCase().includes(histSearch.toLowerCase()) ||
    h.type.toLowerCase().includes(histSearch.toLowerCase())
  );

  const totalPendingAmt = pending.reduce((a,c) => a + c.amount, 0);
  const totalPaidAmt    = history.filter(h => h.status === "Paid").reduce((a,h) => a + h.amount, 0);

  const openInspect = (claim) => {
    setDialog(claim);
    setRejectMode(false);
    setRejectReason("");
  };
  const closeDialog = () => {
    setDialog(null);
    setRejectMode(false);
    setRejectReason("");
  };

  const handleApprove = () => {
    const c = dialog;
    if (c.stage < 2) {
      setClaims(prev => prev.map(x => x.id === c.id ? { ...x, stage: x.stage + 1 } : x));
      toast(`Claim forwarded to "${STEPS[c.stage + 1]}".`);
    } else {
      setClaims(prev => prev.map(x => x.id === c.id ? { ...x, status:"Paid", stage:3 } : x));
      setHistory(prev => [{
        id:Date.now(), faculty:c.faculty, dept:c.dept, type:c.type,
        amount:c.amount, date:new Date().toISOString().split("T")[0],
        status:"Paid", processedBy:"Finance Admin", note:""
      }, ...prev]);
      toast(`Payment of ₹${c.amount.toLocaleString()} authorised for ${c.faculty}.`);
    }
    closeDialog();
  };

  const handleReject = () => {
    if (!rejectReason.trim()) { toast("Please enter a rejection reason.", "error"); return; }
    const c = dialog;
    setClaims(prev => prev.map(x => x.id === c.id ? { ...x, status:"Rejected" } : x));
    setHistory(prev => [{
      id:Date.now(), faculty:c.faculty, dept:c.dept, type:c.type,
      amount:c.amount, date:new Date().toISOString().split("T")[0],
      status:"Rejected", processedBy:"Finance Admin", note:rejectReason
    }, ...prev]);
    toast("Claim rejected. Faculty notified with reason.");
    closeDialog();
  };

  const getBudgetPct = (cat) => {
    const b = BUDGETS.find(x => x.category === cat);
    return b ? Math.round((b.used / b.limit) * 100) : 0;
  };

  /* Dialog-scope helpers */
  const taEst      = dialog ? dialog.distance * TA_RATE : 0;
  const taOver     = dialog?.type?.includes("Travel") && taEst > 0 && taEst < dialog?.amount;
  const budgetPct  = dialog ? getBudgetPct(dialog.type) : 0;
  const budgetWarn = budgetPct > 80;
  const nextLabel  = dialog
    ? (dialog.stage < 2 ? `Forward to ${STEPS[dialog.stage + 1]}` : "Authorise Payment")
    : "";

  /* ─────────────────────────────── */
  return (
    <Box sx={{ p:3, bgcolor:T.bg, minHeight:"100vh", fontFamily:fBody }}>
      <Fonts />

      {/* ── Header ── */}
      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3} flexWrap="wrap" gap={2}>
        <Box>
          <Typography sx={{ fontFamily:fHead, fontWeight:700, fontSize:"1.5rem", color:T.text }}>
            Reimbursement &amp; Claims Approval
          </Typography>
          <Typography sx={{ fontFamily:fBody, fontSize:"0.82rem", color:T.textSub, mt:0.4 }}>
            Finance Admin View &nbsp;·&nbsp; FY 2025–26 &nbsp;·&nbsp; Review and authorise faculty expense claims
          </Typography>
        </Box>
        <Button size="small" variant="outlined" startIcon={<Download sx={{fontSize:15}} />}
          onClick={() => toast("Claims summary exported.")}
          sx={{
            fontFamily:fBody, fontWeight:600, fontSize:"0.76rem", textTransform:"none",
            borderRadius:"8px", borderColor:T.border, color:T.textSub,
            "&:hover":{ borderColor:T.accent, color:T.accent }
          }}>
          Export Report
        </Button>
      </Box>

      {/* ── Stat Strip ── */}
      <Grid container spacing={2} mb={3}>
        {[
          { label:"Pending Claims",  value:pending.length,                            sub:"Awaiting action",        color:T.warning, Icon:AssignmentTurnedIn },
          { label:"Pending Amount",  value:`₹${(totalPendingAmt/1000).toFixed(1)}K`, sub:"Total in queue",         color:T.accent,  Icon:AttachMoney        },
          { label:"Paid This Month", value:`₹${(totalPaidAmt/1000).toFixed(1)}K`,    sub:"Processed successfully", color:T.success, Icon:MonetizationOn     },
          { label:"Rejected",        value:history.filter(h=>h.status==="Rejected").length, sub:"This month",      color:T.danger,  Icon:Cancel             },
        ].map((s,i) => (
          <Grid item xs={6} md={3} key={i}>
            <SCard sx={{ p:2.5 }} className="fu">
              <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                <Box>
                  <SLabel>{s.label}</SLabel>
                  <Typography sx={{ fontFamily:fMono, fontWeight:700, fontSize:"1.7rem", color:s.color, lineHeight:1.1 }}>
                    {s.value}
                  </Typography>
                  <Typography sx={{ fontFamily:fBody, fontSize:"0.7rem", color:T.textMute, mt:0.4 }}>{s.sub}</Typography>
                </Box>
                <Box sx={{ p:1.1, borderRadius:"10px", bgcolor:`${s.color}15`, color:s.color }}>
                  <s.Icon sx={{ fontSize:20 }} />
                </Box>
              </Box>
            </SCard>
          </Grid>
        ))}
      </Grid>

      {/* ── Main Layout ── */}
      <Grid container spacing={3}>

        {/* LEFT: Budget tracker */}
        <Grid item xs={12} md={4}>
          <SCard sx={{ p:2.5 }} className="fu">
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2.5}>
              <Typography sx={{ fontFamily:fHead, fontWeight:700, fontSize:"0.92rem", color:T.text }}>
                Budget Utilisation
              </Typography>
              <Box sx={{ px:1.2, py:0.35, borderRadius:"6px", bgcolor:T.accentLight }}>
                <Typography sx={{ fontFamily:fMono, fontSize:"0.64rem", fontWeight:700, color:T.accent }}>FY 2025–26</Typography>
              </Box>
            </Box>

            <Stack spacing={2.8}>
              {BUDGETS.map((b,i) => {
                const pct       = Math.round((b.used / b.limit) * 100);
                const isWarn    = pct > 80;
                const remaining = b.limit - b.used;
                return (
                  <Box key={i}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.8}>
                      <Box display="flex" alignItems="center" gap={0.8}>
                        <Box sx={{ p:0.65, borderRadius:"7px", bgcolor:`${b.color}18`, color:b.color }}>
                          <b.Icon sx={{ fontSize:14 }} />
                        </Box>
                        <Typography sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.79rem", color:T.text }}>
                          {b.category}
                        </Typography>
                      </Box>
                      <Typography sx={{
                        fontFamily:fMono, fontSize:"0.74rem", fontWeight:700,
                        color: isWarn ? T.danger : T.textMute
                      }}>{pct}%</Typography>
                    </Box>
                    <Box sx={{ height:7, borderRadius:99, bgcolor:T.border, overflow:"hidden" }}>
                      <Box sx={{
                        height:"100%", width:`${pct}%`, borderRadius:99,
                        bgcolor: isWarn ? T.danger : b.color,
                        transition:"width 1.2s cubic-bezier(.4,0,.2,1)"
                      }} />
                    </Box>
                    <Box display="flex" justifyContent="space-between" mt={0.6}>
                      <Typography sx={{ fontFamily:fMono, fontSize:"0.67rem", color:T.textMute }}>
                        ₹{b.used.toLocaleString()} used
                      </Typography>
                      <Typography sx={{
                        fontFamily:fMono, fontSize:"0.67rem",
                        color: isWarn ? T.danger : T.textMute,
                        fontWeight: isWarn ? 700 : 400
                      }}>
                        ₹{remaining.toLocaleString()} left
                      </Typography>
                    </Box>
                    {isWarn && (
                      <Box display="flex" alignItems="center" gap={0.5} mt={0.5}
                        sx={{ px:1, py:0.3, borderRadius:"6px", bgcolor:T.dangerLight, width:"fit-content" }}>
                        <Warning sx={{ fontSize:11, color:T.danger }} />
                        <Typography sx={{ fontFamily:fBody, fontSize:"0.65rem", fontWeight:700, color:T.danger }}>
                          Budget nearly exhausted
                        </Typography>
                      </Box>
                    )}
                  </Box>
                );
              })}
            </Stack>

            <Divider sx={{ borderColor:T.border, my:2 }} />
            <SLabel sx={{ mb:1 }}>Overall Disbursement</SLabel>
            <Box sx={{ p:1.8, borderRadius:"10px", bgcolor:"#F9FAFB", border:`1px solid ${T.border}` }}>
              {[
                { label:"Total Sanctioned", value:`₹${BUDGETS.reduce((a,b)=>a+b.limit,0).toLocaleString()}` },
                { label:"Total Utilised",   value:`₹${BUDGETS.reduce((a,b)=>a+b.used,0).toLocaleString()}`  },
                { label:"Total Available",  value:`₹${BUDGETS.reduce((a,b)=>a+(b.limit-b.used),0).toLocaleString()}`, color:T.success },
              ].map(r => (
                <Box key={r.label} display="flex" justifyContent="space-between"
                  sx={{ py:0.9, borderBottom:`1px solid ${T.border}`, "&:last-child":{ borderBottom:"none" } }}>
                  <Typography sx={{ fontFamily:fBody, fontSize:"0.75rem", color:T.textSub }}>{r.label}</Typography>
                  <Typography sx={{ fontFamily:fMono, fontSize:"0.78rem", fontWeight:700, color:r.color||T.text }}>
                    {r.value}
                  </Typography>
                </Box>
              ))}
            </Box>
          </SCard>
        </Grid>

        {/* RIGHT: Claims tabs */}
        <Grid item xs={12} md={8}>
          <SCard sx={{ overflow:"hidden" }} className="fu1">

            {/* Tab bar */}
            <Box sx={{ borderBottom:`1px solid ${T.border}`, bgcolor:"#FAFBFD" }}>
              <Tabs value={tabIndex} onChange={(_,v) => setTabIndex(v)} sx={{
                px:2,
                "& .MuiTabs-indicator":{ bgcolor:T.accent, height:2.5, borderRadius:"2px 2px 0 0" },
                "& .MuiTab-root":{
                  fontFamily:fBody, fontWeight:600, fontSize:"0.8rem",
                  textTransform:"none", color:T.textMute, minHeight:48,
                  "&.Mui-selected":{ color:T.accent }
                }
              }}>
                {[
                  { label:"Pending Queue", count:pending.length  },
                  { label:"History",       count:history.length  },
                ].map((t,i) => (
                  <Tab key={i} label={
                    <Box display="flex" alignItems="center" gap={0.8}>
                      {t.label}
                      <Box sx={{
                        px:0.7, py:0.1, borderRadius:"99px",
                        bgcolor: tabIndex===i ? T.accentLight : "#F1F5F9"
                      }}>
                        <Typography sx={{
                          fontFamily:fMono, fontSize:"0.62rem", fontWeight:700,
                          color: tabIndex===i ? T.accent : T.textMute
                        }}>{t.count}</Typography>
                      </Box>
                    </Box>
                  } />
                ))}
              </Tabs>
            </Box>

            {/* TAB 0: Pending */}
            {tabIndex === 0 && (
              <Box className="fu">
                {/* Toolbar */}
                <Box sx={{
                  px:2.5, py:1.8, borderBottom:`1px solid ${T.border}`,
                  display:"flex", gap:1.5, flexWrap:"wrap", alignItems:"center"
                }}>
                  <TextField size="small" placeholder="Search faculty or dept…"
                    value={searchQ} onChange={e => setSearchQ(e.target.value)}
                    InputProps={{ startAdornment:<InputAdornment position="start"><Search sx={{fontSize:15,color:T.textMute}} /></InputAdornment> }}
                    sx={{
                      width:200,
                      "& .MuiOutlinedInput-root":{
                        borderRadius:"8px", fontFamily:fBody, fontSize:"0.78rem",
                        "& fieldset":{ borderColor:T.border },
                        "&.Mui-focused fieldset":{ borderColor:T.accent }
                      }
                    }} />

                  <TextField select size="small" value={typeFilter} onChange={e => setTypeFilter(e.target.value)}
                    sx={{
                      width:165,
                      "& .MuiOutlinedInput-root":{
                        borderRadius:"8px", fontFamily:fBody, fontSize:"0.8rem",
                        "& fieldset":{ borderColor:T.border },
                        "&.Mui-focused fieldset":{ borderColor:T.accent }
                      }
                    }}>
                    {["All","Conference","Medical","Travel (TA/DA)","Research Grant"].map(t => (
                      <MenuItem key={t} value={t} sx={{ fontFamily:fBody, fontSize:"0.8rem" }}>{t}</MenuItem>
                    ))}
                  </TextField>

                  <Typography sx={{ fontFamily:fBody, fontSize:"0.76rem", color:T.textMute, ml:"auto" }}>
                    {filteredPending.length} result{filteredPending.length !== 1 ? "s" : ""}
                  </Typography>
                </Box>

                {/* Table */}
                <Table>
                  <TableHead>
                    <TableRow>
                      <TH>Faculty</TH>
                      <TH>Type</TH>
                      <TH>Amount</TH>
                      <TH>Workflow Stage</TH>
                      <TH align="center">Action</TH>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredPending.map(row => (
                      <TableRow key={row.id} className="row-h">
                        <TD sx={{ minWidth:170 }}>
                          <Box display="flex" alignItems="center" gap={1.2}>
                            <Avatar sx={{
                              width:32, height:32, fontSize:"0.68rem",
                              fontWeight:700, bgcolor:T.accentLight, color:T.accent
                            }}>{row.avatar}</Avatar>
                            <Box>
                              <Typography sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.82rem", color:T.text }}>
                                {row.faculty}
                              </Typography>
                              <Typography sx={{ fontFamily:fBody, fontSize:"0.68rem", color:T.textMute }}>
                                {row.dept}&nbsp;·&nbsp;
                                <Typography component="span" sx={{ fontFamily:fMono, fontSize:"0.68rem" }}>{row.date}</Typography>
                              </Typography>
                            </Box>
                          </Box>
                        </TD>
                        <TD><TypeBadge type={row.type} /></TD>
                        <TD>
                          <Typography sx={{ fontFamily:fMono, fontWeight:700, fontSize:"0.9rem", color:T.text }}>
                            ₹{row.amount.toLocaleString()}
                          </Typography>
                          {row.type.includes("Travel") && row.distance > 0 && (
                            <Typography sx={{ fontFamily:fBody, fontSize:"0.66rem", color:T.textMute }}>
                              {row.distance} km · est ₹{(row.distance*TA_RATE).toLocaleString()}
                            </Typography>
                          )}
                        </TD>
                        <TD sx={{ minWidth:205 }}>
                          <StageMini stage={row.stage} />
                          <Typography sx={{ fontFamily:fBody, fontSize:"0.67rem", color:T.accent, fontWeight:700, mt:0.5 }}>
                            ● {STEPS[row.stage]}
                          </Typography>
                        </TD>
                        <TD align="center">
                          <Tooltip title="Inspect &amp; Action">
                            <Button size="small" variant="contained"
                              startIcon={<Visibility sx={{fontSize:14}} />}
                              onClick={() => openInspect(row)}
                              sx={{
                                fontFamily:fBody, fontWeight:700, fontSize:"0.73rem",
                                textTransform:"none", borderRadius:"8px",
                                bgcolor:T.accent, boxShadow:"none",
                                "&:hover":{ bgcolor:"#4F46E5", boxShadow:"none" }
                              }}>
                              Inspect
                            </Button>
                          </Tooltip>
                        </TD>
                      </TableRow>
                    ))}
                    {filteredPending.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} sx={{ textAlign:"center", py:6, fontFamily:fBody, color:T.textMute }}>
                          {pending.length === 0 ? "🎉 All claims have been processed!" : "No claims match the current filter."}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>

                {/* Resolved strip */}
                {resolved.length > 0 && (
                  <Box sx={{ px:2.5, py:1.5, borderTop:`1px solid ${T.border}`, bgcolor:"#FAFBFD" }}>
                    <SLabel sx={{ mb:1 }}>Processed in this session</SLabel>
                    <Box display="flex" gap={1} flexWrap="wrap">
                      {resolved.map(c => (
                        <Box key={c.id} display="flex" alignItems="center" gap={0.6} sx={{
                          px:1.2, py:0.4, borderRadius:"8px",
                          bgcolor: c.status==="Paid" ? T.successLight : T.dangerLight,
                          border:`1px solid ${c.status==="Paid" ? T.success+"30" : T.danger+"30"}`
                        }}>
                          {c.status==="Paid"
                            ? <CheckCircle sx={{fontSize:12,color:T.success}} />
                            : <Cancel sx={{fontSize:12,color:T.danger}} />}
                          <Typography sx={{
                            fontFamily:fBody, fontSize:"0.7rem", fontWeight:700,
                            color: c.status==="Paid" ? T.success : T.danger
                          }}>
                            {c.faculty.split(" ").slice(0,2).join(" ")} · ₹{c.amount.toLocaleString()}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                )}
              </Box>
            )}

            {/* TAB 1: History */}
            {tabIndex === 1 && (
              <Box className="fu">
                <Box sx={{ px:2.5, py:1.8, borderBottom:`1px solid ${T.border}` }}>
                  <TextField size="small" placeholder="Search faculty or claim type…"
                    value={histSearch} onChange={e => setHistSearch(e.target.value)}
                    InputProps={{ startAdornment:<InputAdornment position="start"><Search sx={{fontSize:15,color:T.textMute}} /></InputAdornment> }}
                    sx={{
                      width:240,
                      "& .MuiOutlinedInput-root":{
                        borderRadius:"8px", fontFamily:fBody, fontSize:"0.78rem",
                        "& fieldset":{ borderColor:T.border },
                        "&.Mui-focused fieldset":{ borderColor:T.accent }
                      }
                    }} />
                </Box>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TH>Faculty</TH>
                      <TH>Type</TH>
                      <TH>Amount</TH>
                      <TH>Date</TH>
                      <TH>Status</TH>
                      <TH>Processed By</TH>
                      <TH>Note</TH>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredHistory.map(h => (
                      <TableRow key={h.id} className="row-h">
                        <TD sx={{ fontWeight:600, color:T.text }}>
                          {h.faculty}
                          <Typography sx={{ fontFamily:fBody, fontSize:"0.68rem", color:T.textMute }}>{h.dept}</Typography>
                        </TD>
                        <TD><TypeBadge type={h.type} /></TD>
                        <TD>
                          <Typography sx={{ fontFamily:fMono, fontWeight:700, fontSize:"0.84rem" }}>
                            ₹{h.amount.toLocaleString()}
                          </Typography>
                        </TD>
                        <TD>
                          <Typography sx={{ fontFamily:fMono, fontSize:"0.74rem" }}>{h.date}</Typography>
                        </TD>
                        <TD><StatusPill status={h.status} /></TD>
                        <TD>
                          <Typography sx={{ fontFamily:fBody, fontSize:"0.74rem", color:T.textMute }}>{h.processedBy}</Typography>
                        </TD>
                        <TD sx={{ maxWidth:180 }}>
                          <Typography sx={{ fontFamily:fBody, fontSize:"0.72rem", color:T.textMute, fontStyle:h.note?"italic":"normal" }}>
                            {h.note || "—"}
                          </Typography>
                        </TD>
                      </TableRow>
                    ))}
                    {filteredHistory.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={7} sx={{ textAlign:"center", py:5, fontFamily:fBody, color:T.textMute }}>
                          No records match your search.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </Box>
            )}
          </SCard>
        </Grid>
      </Grid>

      {/* ════════════════════════════════════════
          INSPECTION DIALOG
      ════════════════════════════════════════ */}
      <Dialog
        open={!!dialog} onClose={closeDialog}
        maxWidth="md" fullWidth
        PaperProps={{ sx:{ borderRadius:"16px", border:`1px solid ${T.border}` } }}
      >
        {dialog && (
          <>
            {/* Dialog header */}
            <DialogTitle sx={{
              fontFamily:fHead, fontWeight:700, fontSize:"1rem", color:T.text,
              borderBottom:`1px solid ${T.border}`, bgcolor:"#FAFBFD", pb:2
            }}>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box display="flex" alignItems="center" gap={1.5}>
                  <Box sx={{ width:4, height:24, borderRadius:2, bgcolor:T.accent }} />
                  <Box>
                    <Typography sx={{ fontFamily:fHead, fontWeight:700, fontSize:"1rem", color:T.text }}>
                      Claim Inspection
                    </Typography>
                    <Typography sx={{ fontFamily:fBody, fontSize:"0.73rem", color:T.textMute }}>
                      {dialog.faculty} &nbsp;·&nbsp; {dialog.dept} &nbsp;·&nbsp;
                      <Typography component="span" sx={{ fontFamily:fMono, fontSize:"0.73rem" }}>{dialog.empId}</Typography>
                    </Typography>
                  </Box>
                </Box>
                <IconButton size="small" onClick={closeDialog} sx={{ bgcolor:"#F1F5F9", borderRadius:"8px" }}>
                  <Close fontSize="small" />
                </IconButton>
              </Box>
            </DialogTitle>

            <DialogContent sx={{ px:3, pt:3, pb:2 }}>
              <Stack spacing={3}>

                {/* Workflow stepper */}
                <Box sx={{ px:1 }}>
                  <Stepper activeStep={dialog.stage} alternativeLabel>
                    {STEPS.map((label, i) => (
                      <Step key={label} completed={i < dialog.stage}>
                        <StepLabel StepIconProps={{ sx:{
                          "&.Mui-active":{ color:T.accent },
                          "&.Mui-completed":{ color:T.success }
                        }}}>
                          {label}
                        </StepLabel>
                      </Step>
                    ))}
                  </Stepper>
                </Box>

                <Grid container spacing={2.5}>
                  {/* LEFT */}
                  <Grid item xs={12} md={6}>
                    <SLabel sx={{ mb:1 }}>Claim Details</SLabel>
                    <SCard sx={{ p:2 }}>
                      <InfoRow label="Category"    value={<TypeBadge type={dialog.type} />} />
                      <InfoRow label="Date"        value={<Typography sx={{ fontFamily:fMono, fontSize:"0.8rem", fontWeight:600 }}>{dialog.date}</Typography>} />
                      <InfoRow label="Amount"      value={
                        <Typography sx={{ fontFamily:fMono, fontWeight:700, fontSize:"1.1rem", color:T.success }}>
                          ₹{dialog.amount.toLocaleString()}
                        </Typography>
                      } />
                      <InfoRow label="Description" value={
                        <Typography sx={{ fontFamily:fBody, fontSize:"0.77rem", color:T.textSub }}>{dialog.desc}</Typography>
                      } />
                    </SCard>

                    {/* Budget alert */}
                    {budgetWarn && (
                      <Box sx={{ mt:1.5, p:1.8, borderRadius:"8px", bgcolor:T.dangerLight, border:`1px solid ${T.danger}30` }}>
                        <Box display="flex" alignItems="center" gap={0.6} mb={0.4}>
                          <Warning sx={{ fontSize:14, color:T.danger }} />
                          <Typography sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.75rem", color:T.danger }}>
                            {dialog.type} budget is {budgetPct}% exhausted
                          </Typography>
                        </Box>
                        <Typography sx={{ fontFamily:fBody, fontSize:"0.72rem", color:T.danger }}>
                          Approval may exceed the annual allocation. Ensure finance head sign-off.
                        </Typography>
                      </Box>
                    )}

                    {/* TA/DA auto-check */}
                    {dialog.type.includes("Travel") && (
                      <Box sx={{
                        mt:1.5, p:1.8, borderRadius:"8px",
                        bgcolor: taOver ? T.dangerLight : T.warningLight,
                        border:`1px solid ${taOver ? T.danger : T.warning}40`
                      }}>
                        <Box display="flex" alignItems="center" gap={0.7} mb={1}>
                          <Map sx={{ fontSize:15, color: taOver ? T.danger : T.warning }} />
                          <Typography sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.76rem", color: taOver ? T.danger : T.warning }}>
                            TA/DA Auto-Verification
                          </Typography>
                        </Box>
                        <Grid container spacing={2}>
                          <Grid item xs={6}>
                            <SLabel sx={{ mb:0.3 }}>Distance</SLabel>
                            <Typography sx={{ fontFamily:fMono, fontSize:"0.8rem", fontWeight:700 }}>{dialog.distance} km</Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <SLabel sx={{ mb:0.3 }}>Est. Fare (₹{TA_RATE}/km)</SLabel>
                            <Typography sx={{ fontFamily:fMono, fontSize:"0.8rem", fontWeight:700 }}>₹{taEst.toLocaleString()}</Typography>
                          </Grid>
                        </Grid>
                        {taOver && (
                          <Box display="flex" alignItems="center" gap={0.5} mt={1.2}>
                            <ErrorOutline sx={{ fontSize:13, color:T.danger }} />
                            <Typography sx={{ fontFamily:fBody, fontSize:"0.72rem", fontWeight:700, color:T.danger }}>
                              Claim exceeds fare estimate by ₹{(dialog.amount - taEst).toLocaleString()} — requires justification
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    )}

                    {/* HOD note */}
                    <Box sx={{ mt:1.5, p:1.8, borderRadius:"8px", bgcolor:T.accentLight, border:`1px solid ${T.accent}25` }}>
                      <SLabel sx={{ mb:0.5 }}>HOD Recommendation</SLabel>
                      <Typography sx={{ fontFamily:fBody, fontSize:"0.76rem", color:T.accent, fontStyle:"italic" }}>
                        "{dialog.hodNote}"
                      </Typography>
                      {dialog.hodBy && (
                        <Typography sx={{ fontFamily:fMono, fontSize:"0.66rem", color:T.textMute, mt:0.5 }}>
                          — {dialog.hodBy}, {dialog.hodDate}
                        </Typography>
                      )}
                    </Box>
                  </Grid>

                  {/* RIGHT */}
                  <Grid item xs={12} md={6}>
                    <SLabel sx={{ mb:1 }}>Supporting Documents</SLabel>
                    <Box sx={{
                      height:155, borderRadius:"10px", bgcolor:"#F9FAFB",
                      border:`1px dashed ${T.border}`,
                      display:"flex", flexDirection:"column",
                      alignItems:"center", justifyContent:"center", mb:1.5
                    }}>
                      <ReceiptLong sx={{ fontSize:40, color:T.textMute, mb:0.8 }} />
                      <Typography sx={{ fontFamily:fBody, fontSize:"0.78rem", fontWeight:600, color:T.textSub }}>
                        {dialog.proof}
                      </Typography>
                      <Button size="small" startIcon={<Visibility sx={{fontSize:13}} />}
                        onClick={() => toast("Document viewer opened.")}
                        sx={{
                          mt:1, fontFamily:fBody, fontWeight:600, fontSize:"0.72rem",
                          textTransform:"none", color:T.accent,
                          "&:hover":{ bgcolor:T.accentLight }
                        }}>
                        View Document
                      </Button>
                    </Box>

                    {/* Verification checklist */}
                    <SCard sx={{ p:2 }}>
                      <SLabel sx={{ mb:1 }}>Quick Verification</SLabel>
                      <Stack spacing={0.9}>
                        {[
                          { label:"Document matches claimed date",     ok:true             },
                          { label:"Amount matches supporting receipt", ok:!taOver          },
                          { label:"HOD approval on record",            ok:dialog.stage >= 1},
                          { label:"No duplicate claim detected",       ok:true             },
                          { label:"Budget headroom available",         ok:!budgetWarn      },
                        ].map((item,i) => (
                          <Box key={i} display="flex" alignItems="center" gap={1}>
                            {item.ok
                              ? <CheckCircle sx={{ fontSize:14, color:T.success }} />
                              : <ErrorOutline sx={{ fontSize:14, color:T.danger }} />}
                            <Typography sx={{ fontFamily:fBody, fontSize:"0.77rem", color: item.ok ? T.textSub : T.danger }}>
                              {item.label}
                            </Typography>
                          </Box>
                        ))}
                      </Stack>
                    </SCard>
                  </Grid>
                </Grid>

                {/* Rejection form */}
                {rejectMode && (
                  <Box sx={{ p:2.5, borderRadius:"10px", bgcolor:T.dangerLight, border:`1px solid ${T.danger}30` }}>
                    <Typography sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.8rem", color:T.danger, mb:1.2 }}>
                      Rejection Reason *
                    </Typography>
                    <TextField
                      size="small" fullWidth multiline rows={3}
                      value={rejectReason}
                      onChange={e => setRejectReason(e.target.value)}
                      placeholder="e.g. Insufficient documentary proof. Bill date does not match the claimed date. Please resubmit with originals…"
                      sx={{
                        "& .MuiOutlinedInput-root":{
                          borderRadius:"8px", fontFamily:fBody, fontSize:"0.82rem", bgcolor:T.surface,
                          "& fieldset":{ borderColor:`${T.danger}50` },
                          "&.Mui-focused fieldset":{ borderColor:T.danger }
                        }
                      }}
                    />
                  </Box>
                )}
              </Stack>
            </DialogContent>

            <DialogActions sx={{
              px:3, pb:3, pt:2, bgcolor:"#FAFBFD",
              borderTop:`1px solid ${T.border}`, gap:1
            }}>
              <Button onClick={closeDialog} variant="outlined" sx={{
                fontFamily:fBody, fontWeight:600, fontSize:"0.8rem",
                textTransform:"none", borderRadius:"8px",
                borderColor:T.border, color:T.textSub
              }}>Close</Button>

              {!rejectMode ? (
                <Button onClick={() => setRejectMode(true)}
                  startIcon={<Cancel sx={{fontSize:15}} />} variant="outlined"
                  sx={{
                    fontFamily:fBody, fontWeight:700, fontSize:"0.8rem",
                    textTransform:"none", borderRadius:"8px",
                    color:T.danger, borderColor:`${T.danger}50`,
                    "&:hover":{ borderColor:T.danger, bgcolor:T.dangerLight }
                  }}>
                  Reject
                </Button>
              ) : (
                <Button onClick={handleReject}
                  startIcon={<Cancel sx={{fontSize:15}} />} variant="contained"
                  sx={{
                    fontFamily:fBody, fontWeight:700, fontSize:"0.8rem",
                    textTransform:"none", borderRadius:"8px",
                    bgcolor:T.danger, boxShadow:"none",
                    "&:hover":{ bgcolor:"#DC2626", boxShadow:"none" }
                  }}>
                  Confirm Rejection
                </Button>
              )}

              <Button onClick={handleApprove}
                startIcon={dialog.stage < 2
                  ? <ArrowForward sx={{fontSize:15}} />
                  : <Verified sx={{fontSize:15}} />}
                variant="contained"
                sx={{
                  fontFamily:fBody, fontWeight:700, fontSize:"0.8rem",
                  textTransform:"none", borderRadius:"8px",
                  bgcolor: dialog.stage < 2 ? T.accent : T.success,
                  boxShadow:"none",
                  "&:hover":{ bgcolor: dialog.stage < 2 ? "#4F46E5" : "#059669", boxShadow:"none" }
                }}>
                {nextLabel}
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snack.open} autoHideDuration={3500}
        onClose={() => setSnack(s => ({ ...s, open:false }))}
        anchorOrigin={{ vertical:"bottom", horizontal:"center" }}
      >
        <Alert severity={snack.severity}
          sx={{ borderRadius:"10px", fontFamily:fBody, fontWeight:600 }}
          onClose={() => setSnack(s => ({ ...s, open:false }))}>
          {snack.msg}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ClaimsApprovalView;