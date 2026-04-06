import React, { useState } from "react";
import {
  Box, Grid, Typography, Button, Tabs, Tab, Table,
  TableBody, TableCell, TableHead, TableRow,
  Stack, TextField, Divider, IconButton, Tooltip,
  Snackbar, Alert, Dialog, DialogTitle, DialogContent, DialogActions
} from "@mui/material";
import {
  Download, AccountBalance, Description,
  Calculate, AccountBalanceWallet, ReceiptLong,
  Lock, TrendingUp, Close, CheckCircle,
  ArrowForward, Info, Shield, CreditCard,
  CalendarMonth, Savings
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
    @keyframes pulse  { 0%,100%{opacity:1} 50%{opacity:.45} }
    .fu  { animation: fadeUp 0.32s ease both; }
    .fu1 { animation: fadeUp 0.32s .06s ease both; }
    .fu2 { animation: fadeUp 0.32s .12s ease both; }
    .fu3 { animation: fadeUp 0.32s .18s ease both; }
    .row-h:hover { background:#F9FAFB !important; transition:background .15s; }
    .card-h { transition:box-shadow .2s,transform .2s; }
    .card-h:hover { box-shadow:0 6px 24px rgba(99,102,241,.11); transform:translateY(-2px); }
  `}</style>
);

/* ─────────────────────────────────────────
   MOCK DATA (replaces hook)
───────────────────────────────────────── */
const SALARY = {
  basic:      142000,
  da:          55380,   // 39% of basic
  hra:         51120,   // 36% of basic
  ta:           3600,
  special:      5000,
  gross:       257100,
  pf:          19680,   // 12% of basic+da
  tax:         18500,
  otherDeduct:  2200,
  net:         216720,
  month:       "October 2025",
  grade:       "Grade 13A",
};
SALARY.deductions = SALARY.pf + SALARY.tax + SALARY.otherDeduct;

const PF_DATA = {
  balance:       748500,
  uan:           "101234567890",
  employeeShare: 19680,
  employerShare: 19680,
  history: [
    { month:"Sep 2025", employee:19680, employer:19680 },
    { month:"Aug 2025", employee:19680, employer:19680 },
    { month:"Jul 2025", employee:19680, employer:19680 },
    { month:"Jun 2025", employee:19680, employer:19680 },
    { month:"May 2025", employee:17040, employer:17040 },
  ],
};

const NET_PAY_TREND = [
  { month:"May",   net:198400 },
  { month:"Jun",   net:198400 },
  { month:"Jul",   net:209600 },
  { month:"Aug",   net:216720 },
  { month:"Sep",   net:216720 },
  { month:"Oct",   net:216720 },
];

const LOANS = [
  { id:1, type:"Festival Advance",  total:30000,  paid:30000,  emi:0,    status:"Closed",   orderNo:"ADV/23/011" },
  { id:2, type:"Computer Advance",  total:50000,  paid:32000,  emi:2000, status:"Active",   orderNo:"ADV/24/034" },
  { id:3, type:"HBA (Home Loan)",    total:500000, paid:175000, emi:8500, status:"Active",   orderNo:"HBA/21/007" },
];

const ARREARS = [
  { id:1, title:"Pay Revision Arrear (2020 Scale)", date:"Aug 2025", amount:84600, status:"Paid"    },
  { id:2, title:"DA Arrear — Jan to Jun 2025",      date:"Jul 2025", amount:18240, status:"Paid"    },
  { id:3, title:"Increment Arrear",                 date:"Oct 2025", amount:8400,  status:"Pending" },
];

const FORM16S = [
  { year:"2024–25", generated:"Jun 15, 2025", size:"420 KB", locked:true  },
  { year:"2023–24", generated:"Jun 10, 2024", size:"395 KB", locked:true  },
  { year:"2022–23", generated:"Jun 08, 2023", size:"378 KB", locked:true  },
  { year:"2021–22", generated:"Jun 12, 2022", size:"362 KB", locked:true  },
];

const SALARY_STRUCTURE = [
  { label:"Basic Pay",                    amount:SALARY.basic,      type:"earning"   },
  { label:"Dearness Allowance (DA)",      amount:SALARY.da,         type:"earning"   },
  { label:"House Rent Allowance (HRA)",   amount:SALARY.hra,        type:"earning"   },
  { label:"Transport Allowance (TA)",     amount:SALARY.ta,         type:"earning"   },
  { label:"Special Allowance",            amount:SALARY.special,    type:"earning"   },
  { label:"Gross Salary",                 amount:SALARY.gross,      type:"total"     },
  { label:"EPF Contribution (12%)",       amount:SALARY.pf,         type:"deduction" },
  { label:"Income Tax (TDS)",             amount:SALARY.tax,        type:"deduction" },
  { label:"Professional Tax & Others",    amount:SALARY.otherDeduct,type:"deduction" },
  { label:"Total Deductions",             amount:SALARY.deductions, type:"subtotal"  },
  { label:"Net Pay",                      amount:SALARY.net,        type:"net"       },
];

/* ─────────────────────────────────────────
   HELPERS
───────────────────────────────────────── */
const fmt = (n) => `₹${Number(n).toLocaleString("en-IN")}`;

const calculateGratuity = (years, basicDa) =>
  Math.round((15 * basicDa * years) / 26);

/* ─────────────────────────────────────────
   PRIMITIVES
───────────────────────────────────────── */
const SCard = ({ children, sx={}, hover=false, ...p }) => (
  <Box className={hover ? "card-h" : ""}
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
    "& .MuiOutlinedInput-root":{ borderRadius:"9px", fontFamily:fBody, fontSize:"0.85rem",
      bgcolor:T.surface,
      "& fieldset":{ borderColor:T.border },
      "&.Mui-focused fieldset":{ borderColor:T.accent } },
    "& .MuiInputLabel-root.Mui-focused":{ color:T.accent },
    ...sx
  }} />
);

/* ── Progress Bar ── */
const ProgBar = ({ pct, color=T.accent, height=6 }) => (
  <Box sx={{ height, borderRadius:99, bgcolor:T.border, overflow:"hidden" }}>
    <Box sx={{ height:"100%", width:`${Math.min(pct,100)}%`, borderRadius:99,
      bgcolor:color, transition:"width 1.2s ease" }} />
  </Box>
);

/* ── Net Pay Trend SVG Chart ── */
const NetPayTrend = () => {
  const W=460, H=150;
  const PAD = { top:24, right:16, bottom:30, left:60 };
  const cW = W - PAD.left - PAD.right;
  const cH = H - PAD.top  - PAD.bottom;
  const vals = NET_PAY_TREND.map(d => d.net);
  const minV = Math.min(...vals) * 0.97;
  const maxV = Math.max(...vals) * 1.03;
  const step = cW / (NET_PAY_TREND.length - 1);

  const pts = NET_PAY_TREND.map((d,i) => {
    const x = PAD.left + i * step;
    const y = PAD.top  + cH - ((d.net - minV) / (maxV - minV)) * cH;
    return { x, y, ...d };
  });

  const linePts = pts.map(p => `${p.x},${p.y}`).join(" ");

  /* Area fill */
  const areaPath = `M${pts[0].x},${pts[0].y} ` +
    pts.slice(1).map(p => `L${p.x},${p.y}`).join(" ") +
    ` L${pts[pts.length-1].x},${PAD.top+cH} L${pts[0].x},${PAD.top+cH} Z`;

  return (
    <Box sx={{ width:"100%", overflowX:"auto" }}>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width:"100%", maxHeight:160, display:"block" }}>
        {/* Y grid */}
        {[0, 0.5, 1].map(f => {
          const y = PAD.top + cH * (1 - f);
          const v = minV + (maxV - minV) * f;
          return (
            <g key={f}>
              <line x1={PAD.left} y1={y} x2={W-PAD.right} y2={y}
                stroke={T.border} strokeWidth="1" strokeDasharray="4 3" />
              <text x={PAD.left-6} y={y+4} textAnchor="end"
                fontSize="7.5" fill={T.textMute} fontFamily={fMono}>
                {(v/1000).toFixed(0)}K
              </text>
            </g>
          );
        })}

        {/* Area */}
        <path d={areaPath} fill={`${T.accent}14`} />

        {/* Line */}
        <polyline points={linePts} fill="none"
          stroke={T.accent} strokeWidth="2.5" strokeLinejoin="round" />

        {/* Dots + labels */}
        {pts.map((p,i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r="4"
              fill={T.surface} stroke={T.accent} strokeWidth="2" />
            <text x={p.x} y={p.y - 8} textAnchor="middle"
              fontSize="7.5" fill={T.accent} fontFamily={fMono} fontWeight="700">
              {(p.net/1000).toFixed(0)}K
            </text>
            <text x={p.x} y={H - PAD.bottom + 13} textAnchor="middle"
              fontSize="8" fill={T.textMute} fontFamily={fBody}>{p.month}</text>
          </g>
        ))}

        {/* Axis */}
        <line x1={PAD.left} y1={PAD.top} x2={PAD.left} y2={PAD.top+cH}
          stroke={T.border} strokeWidth="1.5" />
        <line x1={PAD.left} y1={PAD.top+cH} x2={W-PAD.right} y2={PAD.top+cH}
          stroke={T.border} strokeWidth="1.5" />
      </svg>
    </Box>
  );
};

/* ═════════════════════════════════════════════
   MAIN COMPONENT
═════════════════════════════════════════════ */
const PayrollView = () => {
  const [tabIndex,   setTabIndex]   = useState(0);
  const [gratYears,  setGratYears]  = useState(12);
  const [gratBasic,  setGratBasic]  = useState(SALARY.basic + SALARY.da);
  const [gratResult, setGratResult] = useState(0);
  const [slipDialog, setSlipDialog] = useState(false);
  const [snack,      setSnack]      = useState({ open:false, msg:"", severity:"success" });

  const toast = (msg, severity="success") => setSnack({ open:true, msg, severity });

  const TABS = [
    { label:"Salary & PF",         Icon:ReceiptLong         },
    { label:"Loans & Arrears",      Icon:AccountBalance      },
    { label:"Tax — Form 16",        Icon:Description         },
    { label:"Gratuity Calculator",  Icon:Calculate           },
  ];

  /* ─────────────────────────────────────────
     RENDER
  ───────────────────────────────────────── */
  return (
    <Box sx={{ p:3, bgcolor:T.bg, minHeight:"100vh", fontFamily:fBody }}>
      <Fonts />

      {/* ── Header ── */}
      <Box display="flex" justifyContent="space-between"
        alignItems="flex-start" mb={3} flexWrap="wrap" gap={2}>
        <Box>
          <Typography sx={{ fontFamily:fBody, fontSize:"0.72rem", fontWeight:700,
            letterSpacing:"0.1em", textTransform:"uppercase", color:T.textMute, mb:0.3 }}>
            Faculty Portal · Finance
          </Typography>
          <Typography sx={{ fontFamily:fHead, fontWeight:700, fontSize:"1.5rem", color:T.text }}>
            Payroll &amp; Financials
          </Typography>
          <Typography sx={{ fontFamily:fBody, fontSize:"0.82rem", color:T.textSub, mt:0.3 }}>
            Salary structure, EPF passbook, loans, tax documents, and gratuity estimation.
          </Typography>
        </Box>
        <Button size="small" variant="outlined"
          startIcon={<Download sx={{fontSize:15}} />}
          onClick={() => setSlipDialog(true)}
          sx={{ fontFamily:fBody, fontWeight:600, fontSize:"0.76rem", textTransform:"none",
            borderRadius:"8px", borderColor:T.border, color:T.textSub, mt:0.5,
            "&:hover":{ borderColor:T.accent, color:T.accent } }}>
          Download Salary Slip
        </Button>
      </Box>

      {/* ── Top Summary Strip ── */}
      <Grid container spacing={2} mb={3}>

        {/* Net Pay card */}
        <Grid item xs={12} md={4}>
          <Box sx={{
            p:2.8, borderRadius:"14px", overflow:"hidden", position:"relative",
            background:`linear-gradient(135deg, #4338CA 0%, ${T.accent} 50%, ${T.purple} 100%)`,
            color:"#fff", minHeight:140,
          }} className="fu">
            {/* Decorative circles */}
            {[{ s:120, r:-30, t:-40, op:0.09 }, { s:70, r:60, t:-20, op:0.06 }].map((c,i)=>(
              <Box key={i} sx={{ position:"absolute", width:c.s, height:c.s,
                borderRadius:"50%", right:c.r, top:c.t,
                bgcolor:`rgba(255,255,255,${c.op})` }} />
            ))}
            <SLabel sx={{ color:"rgba(255,255,255,0.7)", mb:0.5 }}>
              Net Pay · {SALARY.month}
            </SLabel>
            <Typography sx={{ fontFamily:fMono, fontWeight:700, fontSize:"2rem",
              color:"#fff", lineHeight:1.1, mb:0.5 }}>
              {fmt(SALARY.net)}
            </Typography>
            <Typography sx={{ fontFamily:fBody, fontSize:"0.78rem",
              color:"rgba(255,255,255,0.75)", mb:2 }}>
              Gross: {fmt(SALARY.gross)} · Grade: {SALARY.grade}
            </Typography>
            <Box display="flex" gap={2}>
              <Box>
                <SLabel sx={{ color:"rgba(255,255,255,0.6)", mb:0.2 }}>Earnings</SLabel>
                <Typography sx={{ fontFamily:fMono, fontWeight:700,
                  fontSize:"0.88rem", color:"#86EFAC" }}>{fmt(SALARY.gross)}</Typography>
              </Box>
              <Box sx={{ width:"1px", bgcolor:"rgba(255,255,255,0.2)", mx:1 }} />
              <Box>
                <SLabel sx={{ color:"rgba(255,255,255,0.6)", mb:0.2 }}>Deductions</SLabel>
                <Typography sx={{ fontFamily:fMono, fontWeight:700,
                  fontSize:"0.88rem", color:"#FCA5A5" }}>−{fmt(SALARY.deductions)}</Typography>
              </Box>
            </Box>
          </Box>
        </Grid>

        {/* Net Pay Trend */}
        <Grid item xs={12} md={8}>
          <SCard sx={{ p:0, overflow:"hidden", height:"100%" }} className="fu1">
            <Box sx={{ px:2.5, py:1.8, borderBottom:`1px solid ${T.border}`,
              bgcolor:"#FAFBFD", display:"flex",
              justifyContent:"space-between", alignItems:"center" }}>
              <Box display="flex" alignItems="center" gap={1}>
                <Box sx={{ p:0.7, borderRadius:"7px",
                  bgcolor:T.accentLight, color:T.accent }}>
                  <TrendingUp sx={{ fontSize:15 }} />
                </Box>
                <Typography sx={{ fontFamily:fHead, fontWeight:700,
                  fontSize:"0.88rem", color:T.text }}>Net Pay Trend</Typography>
              </Box>
              <Box sx={{ px:1.2, py:0.3, borderRadius:"7px", bgcolor:T.accentLight }}>
                <Typography sx={{ fontFamily:fBody, fontSize:"0.7rem",
                  fontWeight:700, color:T.accent }}>Last 6 Months</Typography>
              </Box>
            </Box>
            <Box sx={{ px:2, pt:1, pb:1 }}>
              <NetPayTrend />
            </Box>
          </SCard>
        </Grid>

        {/* 3 mini stats */}
        {[
          { label:"EPF Balance",        value:fmt(PF_DATA.balance),  sub:"Total corpus",          color:T.success, Icon:Savings       },
          { label:"Active Loans",       value:LOANS.filter(l=>l.status==="Active").length,sub:"Ongoing advances", color:T.warning, Icon:CreditCard    },
          { label:"Tax Deducted (YTD)", value:fmt(SALARY.tax*6),     sub:"Apr–Oct 2025",          color:T.purple,  Icon:Shield        },
        ].map((s,i) => (
          <Grid item xs={12} md={4} key={i}>
            <SCard hover sx={{ p:2.5 }} className={`fu${i}`}>
              <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                <Box>
                  <SLabel>{s.label}</SLabel>
                  <Typography sx={{ fontFamily:fMono, fontWeight:700,
                    fontSize:"1.35rem", color:s.color, lineHeight:1.2 }}>{s.value}</Typography>
                  <Typography sx={{ fontFamily:fBody, fontSize:"0.7rem",
                    color:T.textMute, mt:0.3 }}>{s.sub}</Typography>
                </Box>
                <Box sx={{ p:1, borderRadius:"9px", bgcolor:`${s.color}15`, color:s.color }}>
                  <s.Icon sx={{ fontSize:18 }} />
                </Box>
              </Box>
            </SCard>
          </Grid>
        ))}
      </Grid>

      {/* ── Main Card + Tabs ── */}
      <SCard sx={{ overflow:"hidden" }} className="fu2">

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
            {TABS.map((t,i) => (
              <Tab key={i} icon={<t.Icon sx={{fontSize:16}} />}
                iconPosition="start" label={t.label} />
            ))}
          </Tabs>
        </Box>

        <Box p={3}>

          {/* ══════════════════════════
              TAB 0 — SALARY & PF
          ══════════════════════════ */}
          {tabIndex === 0 && (
            <Grid container spacing={3} className="fu">

              {/* Salary Structure */}
              <Grid item xs={12} md={6}>
                <Box display="flex" alignItems="center" gap={1} mb={2}>
                  <Box sx={{ p:0.75, borderRadius:"8px",
                    bgcolor:T.accentLight, color:T.accent }}>
                    <ReceiptLong sx={{ fontSize:15 }} />
                  </Box>
                  <Typography sx={{ fontFamily:fHead, fontWeight:700,
                    fontSize:"0.9rem", color:T.text }}>
                    Salary Structure — {SALARY.month}
                  </Typography>
                </Box>

                <Box sx={{ borderRadius:"10px", border:`1px solid ${T.border}`, overflow:"hidden" }}>
                  <Table>
                    <TableBody>
                      {SALARY_STRUCTURE.map((row, i) => {
                        const isTotal     = row.type === "total";
                        const isSubtotal  = row.type === "subtotal";
                        const isNet       = row.type === "net";
                        const isDeduction = row.type === "deduction";
                        return (
                          <TableRow key={i} className={isNet||isTotal||isSubtotal?"":"row-h"}
                            sx={{
                              bgcolor:
                                isNet      ? `${T.success}08` :
                                isTotal    ? `${T.accent}06`  :
                                isSubtotal ? `${T.danger}06`  : "transparent",
                              borderTop: (isTotal||isNet||isSubtotal) ? `2px solid ${T.border}` : "none",
                            }}>
                            <TableCell sx={{ fontFamily:fBody, fontSize:"0.81rem",
                              borderBottom:`1px solid ${T.border}`,
                              color: isDeduction ? T.danger : T.textSub,
                              fontWeight: (isTotal||isNet||isSubtotal) ? 700 : 400,
                              py:1.6 }}>
                              {isDeduction ? `− ${row.label}` : row.label}
                            </TableCell>
                            <TableCell align="right" sx={{
                              fontFamily:fMono, fontSize:"0.83rem", py:1.6,
                              borderBottom:`1px solid ${T.border}`,
                              fontWeight: (isTotal||isNet||isSubtotal) ? 700 : 500,
                              color:
                                isNet      ? T.success :
                                isDeduction || isSubtotal ? T.danger  :
                                isTotal    ? T.accent   : T.text,
                            }}>
                              {isDeduction ? `−${fmt(row.amount)}` : fmt(row.amount)}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </Box>
              </Grid>

              {/* EPF Passbook */}
              <Grid item xs={12} md={6}>
                <Box display="flex" alignItems="center" gap={1} mb={2}>
                  <Box sx={{ p:0.75, borderRadius:"8px",
                    bgcolor:T.successLight, color:T.success }}>
                    <Savings sx={{ fontSize:15 }} />
                  </Box>
                  <Typography sx={{ fontFamily:fHead, fontWeight:700,
                    fontSize:"0.9rem", color:T.text }}>EPF Passbook Summary</Typography>
                </Box>

                {/* Balance card */}
                <Box sx={{ p:2.5, borderRadius:"12px", mb:2,
                  background:`linear-gradient(135deg, ${T.successLight} 0%, #D1FAE5 100%)`,
                  border:`1px solid ${T.success}25` }}>
                  <Box display="flex" justifyContent="space-between"
                    alignItems="flex-start" mb={1.5}>
                    <Box>
                      <SLabel sx={{ color:T.success, mb:0.4 }}>Total EPF Balance</SLabel>
                      <Typography sx={{ fontFamily:fMono, fontWeight:700,
                        fontSize:"1.8rem", color:T.success, lineHeight:1.1 }}>
                        {fmt(PF_DATA.balance)}
                      </Typography>
                    </Box>
                    <Box sx={{ px:1.3, py:0.5, borderRadius:"8px",
                      bgcolor:T.surface, border:`1px solid ${T.border}` }}>
                      <SLabel sx={{ mb:0.2 }}>UAN</SLabel>
                      <Typography sx={{ fontFamily:fMono, fontSize:"0.78rem",
                        fontWeight:700, color:T.text }}>{PF_DATA.uan}</Typography>
                    </Box>
                  </Box>

                  <Divider sx={{ borderColor:`${T.success}25`, mb:1.8 }} />

                  <Grid container>
                    <Grid item xs={6}>
                      <SLabel sx={{ mb:0.3, color:T.success }}>Employee Share/mo</SLabel>
                      <Typography sx={{ fontFamily:fMono, fontWeight:700,
                        fontSize:"1rem", color:T.success }}>
                        {fmt(PF_DATA.employeeShare)}
                      </Typography>
                    </Grid>
                    <Grid item xs={6} textAlign="right">
                      <SLabel sx={{ mb:0.3, color:T.success }}>Employer Share/mo</SLabel>
                      <Typography sx={{ fontFamily:fMono, fontWeight:700,
                        fontSize:"1rem", color:T.success }}>
                        {fmt(PF_DATA.employerShare)}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>

                {/* Contribution history table */}
                <Typography sx={{ fontFamily:fBody, fontWeight:700,
                  fontSize:"0.78rem", color:T.textSub, mb:1 }}>
                  Recent Contributions
                </Typography>
                <Box sx={{ borderRadius:"10px", border:`1px solid ${T.border}`, overflow:"hidden" }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TH>Month</TH>
                        <TH align="right">Employee (₹)</TH>
                        <TH align="right">University (₹)</TH>
                        <TH align="right">Total (₹)</TH>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {PF_DATA.history.map((row,i) => (
                        <TableRow key={i} className="row-h">
                          <TD sx={{ fontWeight:600, color:T.text }}>{row.month}</TD>
                          <TD align="right">
                            <Typography sx={{ fontFamily:fMono, fontSize:"0.79rem" }}>
                              {row.employee.toLocaleString("en-IN")}
                            </Typography>
                          </TD>
                          <TD align="right">
                            <Typography sx={{ fontFamily:fMono, fontSize:"0.79rem" }}>
                              {row.employer.toLocaleString("en-IN")}
                            </Typography>
                          </TD>
                          <TD align="right">
                            <Typography sx={{ fontFamily:fMono, fontSize:"0.79rem",
                              fontWeight:700, color:T.success }}>
                              {(row.employee+row.employer).toLocaleString("en-IN")}
                            </Typography>
                          </TD>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Box>
              </Grid>
            </Grid>
          )}

          {/* ══════════════════════════
              TAB 1 — LOANS & ARREARS
          ══════════════════════════ */}
          {tabIndex === 1 && (
            <Grid container spacing={3} className="fu">

              {/* Loans */}
              <Grid item xs={12} md={6}>
                <Box display="flex" alignItems="center" gap={1} mb={2}>
                  <Box sx={{ p:0.75, borderRadius:"8px",
                    bgcolor:T.warningLight, color:T.warning }}>
                    <CreditCard sx={{ fontSize:15 }} />
                  </Box>
                  <Typography sx={{ fontFamily:fHead, fontWeight:700,
                    fontSize:"0.9rem", color:T.text }}>
                    Active Loans &amp; Advances
                  </Typography>
                </Box>

                <Stack spacing={2}>
                  {LOANS.map(loan => {
                    const pct     = Math.round((loan.paid / loan.total) * 100);
                    const active  = loan.status === "Active";
                    const barClr  = active ? T.accent : T.success;
                    return (
                      <SCard key={loan.id} sx={{ p:2.2 }}>
                        <Box display="flex" justifyContent="space-between"
                          alignItems="flex-start" mb={1.5}>
                          <Box>
                            <Typography sx={{ fontFamily:fBody, fontWeight:700,
                              fontSize:"0.85rem", color:T.text }}>{loan.type}</Typography>
                            <Typography sx={{ fontFamily:fMono, fontSize:"0.69rem",
                              color:T.textMute, mt:0.3 }}>Order: {loan.orderNo}</Typography>
                          </Box>
                          <Box sx={{ px:1.1, py:0.3, borderRadius:"99px",
                            bgcolor: active ? T.warningLight : T.successLight }}>
                            <Box display="flex" alignItems="center" gap={0.5}>
                              <Box sx={{ width:5, height:5, borderRadius:"50%",
                                bgcolor: active ? T.warning : T.success }} />
                              <Typography sx={{ fontFamily:fBody, fontSize:"0.67rem",
                                fontWeight:700,
                                color: active ? T.warning : T.success }}>
                                {loan.status}
                              </Typography>
                            </Box>
                          </Box>
                        </Box>

                        <ProgBar pct={pct} color={barClr} height={7} />

                        <Box display="flex" justifyContent="space-between" mt={1}>
                          <Typography sx={{ fontFamily:fBody, fontSize:"0.71rem",
                            color:T.textMute }}>
                            Paid: <Box component="span" sx={{ fontFamily:fMono,
                              fontWeight:700, color:barClr }}>
                              {fmt(loan.paid)}
                            </Box>
                          </Typography>
                          <Typography sx={{ fontFamily:fMono, fontSize:"0.71rem",
                            fontWeight:700, color:T.textMute }}>{pct}%</Typography>
                          <Typography sx={{ fontFamily:fBody, fontSize:"0.71rem",
                            color:T.textMute }}>
                            Total: <Box component="span" sx={{ fontFamily:fMono,
                              fontWeight:700, color:T.text }}>
                              {fmt(loan.total)}
                            </Box>
                          </Typography>
                        </Box>

                        {active && (
                          <Box sx={{ mt:1.2, px:1.2, py:0.6, borderRadius:"7px",
                            bgcolor:T.warningLight, border:`1px solid ${T.warning}20` }}>
                            <Typography sx={{ fontFamily:fBody, fontSize:"0.71rem",
                              color:T.warning, fontWeight:600 }}>
                              EMI: {fmt(loan.emi)}/month · Balance: {fmt(loan.total - loan.paid)}
                            </Typography>
                          </Box>
                        )}
                      </SCard>
                    );
                  })}
                </Stack>
              </Grid>

              {/* Arrears */}
              <Grid item xs={12} md={6}>
                <Box display="flex" alignItems="center" gap={1} mb={2}>
                  <Box sx={{ p:0.75, borderRadius:"8px",
                    bgcolor:T.purpleLight, color:T.purple }}>
                    <AccountBalance sx={{ fontSize:15 }} />
                  </Box>
                  <Typography sx={{ fontFamily:fHead, fontWeight:700,
                    fontSize:"0.9rem", color:T.text }}>
                    Arrears &amp; Increments
                  </Typography>
                </Box>

                <Box sx={{ borderRadius:"10px", border:`1px solid ${T.border}`, overflow:"hidden" }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TH>Description</TH>
                        <TH align="right">Amount</TH>
                        <TH>Status</TH>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {ARREARS.map(item => {
                        const paid = item.status === "Paid";
                        return (
                          <TableRow key={item.id} className="row-h">
                            <TD sx={{ minWidth:160 }}>
                              <Typography sx={{ fontFamily:fBody, fontWeight:700,
                                fontSize:"0.81rem", color:T.text }}>{item.title}</Typography>
                              <Typography sx={{ fontFamily:fMono, fontSize:"0.68rem",
                                color:T.textMute, mt:0.2 }}>{item.date}</Typography>
                            </TD>
                            <TD align="right">
                              <Typography sx={{ fontFamily:fMono, fontWeight:700,
                                fontSize:"0.85rem",
                                color: paid ? T.success : T.warning }}>
                                {fmt(item.amount)}
                              </Typography>
                            </TD>
                            <TD>
                              <Box sx={{ px:1.1, py:0.3, borderRadius:"99px",
                                bgcolor: paid ? T.successLight : T.warningLight,
                                width:"fit-content" }}>
                                <Box display="flex" alignItems="center" gap={0.5}>
                                  <Box sx={{ width:5, height:5, borderRadius:"50%",
                                    bgcolor: paid ? T.success : T.warning }} />
                                  <Typography sx={{ fontFamily:fBody, fontSize:"0.67rem",
                                    fontWeight:700,
                                    color: paid ? T.success : T.warning }}>
                                    {item.status}
                                  </Typography>
                                </Box>
                              </Box>
                            </TD>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </Box>

                {/* Total box */}
                <Box sx={{ mt:2, p:2, borderRadius:"10px",
                  bgcolor:"#F9FAFB", border:`1px solid ${T.border}` }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography sx={{ fontFamily:fBody, fontWeight:700,
                      fontSize:"0.82rem", color:T.textSub }}>Total Arrears Received</Typography>
                    <Typography sx={{ fontFamily:fMono, fontWeight:700,
                      fontSize:"1.05rem", color:T.success }}>
                      {fmt(ARREARS.filter(a=>a.status==="Paid").reduce((s,a)=>s+a.amount,0))}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          )}

          {/* ══════════════════════════
              TAB 2 — TAX / FORM 16
          ══════════════════════════ */}
          {tabIndex === 2 && (
            <Box className="fu" sx={{ maxWidth:680 }}>
              <Box display="flex" alignItems="center" gap={1} mb={2.5}>
                <Box sx={{ p:0.75, borderRadius:"8px",
                  bgcolor:T.purpleLight, color:T.purple }}>
                  <Description sx={{ fontSize:15 }} />
                </Box>
                <Typography sx={{ fontFamily:fHead, fontWeight:700,
                  fontSize:"0.9rem", color:T.text }}>Form 16 Repository</Typography>
              </Box>

              <Box sx={{ borderRadius:"10px", border:`1px solid ${T.border}`, overflow:"hidden", mb:3 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TH>Financial Year</TH>
                      <TH>Generated On</TH>
                      <TH>File Size</TH>
                      <TH align="center">Download</TH>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {FORM16S.map((form, i) => (
                      <TableRow key={i} className="row-h">
                        <TD sx={{ fontWeight:700, color:T.text }}>
                          <Typography sx={{ fontFamily:fMono, fontSize:"0.82rem",
                            fontWeight:700, color:T.text }}>{form.year}</Typography>
                        </TD>
                        <TD>
                          <Typography sx={{ fontFamily:fBody, fontSize:"0.8rem" }}>
                            {form.generated}
                          </Typography>
                        </TD>
                        <TD>
                          <Typography sx={{ fontFamily:fMono, fontSize:"0.76rem",
                            color:T.textMute }}>{form.size}</Typography>
                        </TD>
                        <TD align="center">
                          <Button size="small" variant="outlined"
                            startIcon={<Download sx={{fontSize:13}} />}
                            onClick={() => toast(`Form 16 for ${form.year} downloading…`)}
                            sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.72rem",
                              textTransform:"none", borderRadius:"7px",
                              borderColor:T.accent, color:T.accent,
                              "&:hover":{ bgcolor:T.accentLight } }}>
                            PDF
                          </Button>
                        </TD>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>

              {/* Password notice */}
              <Box sx={{ p:2.2, borderRadius:"10px",
                bgcolor:T.infoLight, border:`1px solid ${T.info}30`,
                display:"flex", gap:1.5, alignItems:"flex-start" }}>
                <Box sx={{ p:0.75, borderRadius:"7px",
                  bgcolor:`${T.info}20`, color:T.info, flexShrink:0 }}>
                  <Lock sx={{ fontSize:15 }} />
                </Box>
                <Box>
                  <Typography sx={{ fontFamily:fBody, fontWeight:700,
                    fontSize:"0.82rem", color:T.info, mb:0.4 }}>
                    Password-Protected Files
                  </Typography>
                  <Typography sx={{ fontFamily:fBody, fontSize:"0.78rem",
                    color:T.textSub, lineHeight:1.65 }}>
                    Your Form 16 PDFs are password protected. To open, use your&nbsp;
                    <Box component="span" sx={{ fontWeight:700, fontFamily:fMono,
                      color:T.info }}>PAN (uppercase)</Box>
                    &nbsp;followed by your&nbsp;
                    <Box component="span" sx={{ fontWeight:700, fontFamily:fMono,
                      color:T.info }}>Date of Birth (DDMM)</Box>
                    . Example: <Box component="span"
                      sx={{ fontFamily:fMono, color:T.text }}>ABCDE1234F1504</Box>
                  </Typography>
                </Box>
              </Box>
            </Box>
          )}

          {/* ══════════════════════════
              TAB 3 — GRATUITY CALC
          ══════════════════════════ */}
          {tabIndex === 3 && (
            <Grid container spacing={3} className="fu">

              {/* Input panel */}
              <Grid item xs={12} md={6}>
                <Box display="flex" alignItems="center" gap={1} mb={2}>
                  <Box sx={{ p:0.75, borderRadius:"8px",
                    bgcolor:T.goldLight || T.warningLight, color:T.gold || T.warning }}>
                    <Calculate sx={{ fontSize:15 }} />
                  </Box>
                  <Typography sx={{ fontFamily:fHead, fontWeight:700,
                    fontSize:"0.9rem", color:T.text }}>Estimate Your Gratuity</Typography>
                </Box>

                <Typography sx={{ fontFamily:fBody, fontSize:"0.82rem",
                  color:T.textSub, mb:2.5, lineHeight:1.7 }}>
                  Gratuity is a lump sum benefit paid by the employer on retirement or resignation after completing
                  <Box component="span" sx={{ fontWeight:700, color:T.accent }}>
                    &nbsp;5+ years&nbsp;
                  </Box>
                  of continuous service, under the Payment of Gratuity Act, 1972.
                </Typography>

                <Stack spacing={2.5}>
                  <Box>
                    <SLabel sx={{ mb:0.7 }}>Years of Service</SLabel>
                    <DInput
                      type="number"
                      value={gratYears}
                      onChange={e => setGratYears(+e.target.value)}
                      InputProps={{ inputProps:{ min:1, max:40 } }}
                    />
                    <Typography sx={{ fontFamily:fBody, fontSize:"0.69rem",
                      color:T.textMute, mt:0.5 }}>
                      Your current service: 12 years (as of 2025)
                    </Typography>
                  </Box>

                  <Box>
                    <SLabel sx={{ mb:0.7 }}>Last Drawn Salary (Basic + DA)</SLabel>
                    <DInput
                      type="number"
                      value={gratBasic}
                      onChange={e => setGratBasic(+e.target.value)}
                    />
                    <Typography sx={{ fontFamily:fBody, fontSize:"0.69rem",
                      color:T.textMute, mt:0.5 }}>
                      Current Basic + DA: {fmt(SALARY.basic + SALARY.da)}
                    </Typography>
                  </Box>

                  <Button variant="contained" size="large"
                    startIcon={<Calculate sx={{fontSize:18}} />}
                    onClick={() => setGratResult(calculateGratuity(gratYears, gratBasic))}
                    sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.88rem",
                      textTransform:"none", borderRadius:"9px", py:1.2,
                      bgcolor:T.accent, boxShadow:"none",
                      "&:hover":{ bgcolor:"#4F46E5", boxShadow:"none" } }}>
                    Calculate Gratuity
                  </Button>
                </Stack>

                {/* Formula note */}
                <Box sx={{ mt:3, p:2, borderRadius:"9px",
                  bgcolor:"#F9FAFB", border:`1px solid ${T.border}` }}>
                  <SLabel sx={{ mb:0.5 }}>Formula Used</SLabel>
                  <Typography sx={{ fontFamily:fMono, fontSize:"0.77rem", color:T.accent }}>
                    (15 × Last Drawn Salary × Years) ÷ 26
                  </Typography>
                  <Typography sx={{ fontFamily:fBody, fontSize:"0.71rem",
                    color:T.textMute, mt:0.5, lineHeight:1.6 }}>
                    This is the standard formula as per the Payment of Gratuity Act, 1972.
                    Maximum gratuity payable is ₹20,00,000 (post-2019 amendment).
                  </Typography>
                </Box>
              </Grid>

              {/* Result panel */}
              <Grid item xs={12} md={6} display="flex" alignItems="center">
                {gratResult > 0 ? (
                  <Box sx={{ width:"100%", p:3, borderRadius:"14px",
                    background:`linear-gradient(135deg, ${T.successLight}, #D1FAE5)`,
                    border:`1px solid ${T.success}30`, textAlign:"center" }}>
                    <Box sx={{ p:2, borderRadius:"50%",
                      bgcolor:T.surface, width:"fit-content", mx:"auto", mb:2,
                      boxShadow:`0 4px 20px ${T.success}25` }}>
                      <AccountBalanceWallet sx={{ fontSize:44, color:T.success }} />
                    </Box>
                    <SLabel sx={{ mb:0.5, color:T.success }}>Estimated Gratuity Amount</SLabel>
                    <Typography sx={{ fontFamily:fMono, fontWeight:700,
                      fontSize:"2.4rem", color:T.success, lineHeight:1.1, mb:0.5 }}>
                      {fmt(gratResult)}
                    </Typography>
                    <Typography sx={{ fontFamily:fBody, fontSize:"0.76rem",
                      color:T.success, mb:2.5 }}>
                      Based on {gratYears} years · Basic+DA {fmt(gratBasic)}
                    </Typography>

                    <Divider sx={{ borderColor:`${T.success}25`, mb:2 }} />

                    {/* Breakdown */}
                    <Grid container spacing={1.5}>
                      {[
                        { label:"Years of Service",    value:`${gratYears} yrs`       },
                        { label:"Basic + DA",          value:fmt(gratBasic)            },
                        { label:"Daily Wage (÷26)",    value:fmt(Math.round(gratBasic/26)) },
                        { label:"15-day equivalent",   value:fmt(Math.round(gratBasic/26*15)) },
                      ].map(s => (
                        <Grid item xs={6} key={s.label}>
                          <Box sx={{ p:1.2, borderRadius:"8px",
                            bgcolor:"rgba(255,255,255,0.65)" }}>
                            <SLabel sx={{ mb:0.2, color:T.success }}>{s.label}</SLabel>
                            <Typography sx={{ fontFamily:fMono, fontWeight:700,
                              fontSize:"0.82rem", color:T.success }}>{s.value}</Typography>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>

                    {gratResult > 2000000 && (
                      <Box sx={{ mt:2, p:1.5, borderRadius:"8px",
                        bgcolor:T.warningLight, border:`1px solid ${T.warning}30` }}>
                        <Typography sx={{ fontFamily:fBody, fontSize:"0.74rem",
                          fontWeight:700, color:T.warning }}>
                          ⚠ Estimated amount exceeds the ₹20,00,000 statutory ceiling.
                          Actual payout will be capped at ₹20,00,000.
                        </Typography>
                      </Box>
                    )}
                  </Box>
                ) : (
                  <Box sx={{ width:"100%", textAlign:"center", py:8, color:T.textMute }}>
                    <AccountBalanceWallet sx={{ fontSize:60, mb:2,
                      color:T.border, display:"block", mx:"auto" }} />
                    <Typography sx={{ fontFamily:fBody, fontSize:"0.88rem",
                      color:T.textMute, mb:0.5 }}>
                      Enter your details and click Calculate
                    </Typography>
                    <Typography sx={{ fontFamily:fBody, fontSize:"0.75rem", color:T.border }}>
                      Results will appear here
                    </Typography>
                  </Box>
                )}
              </Grid>
            </Grid>
          )}

        </Box>
      </SCard>

      {/* ── Salary Slip Dialog ── */}
      <Dialog open={slipDialog} onClose={() => setSlipDialog(false)}
        maxWidth="xs" fullWidth
        PaperProps={{ sx:{ borderRadius:"16px", border:`1px solid ${T.border}` } }}>
        <DialogTitle sx={{ borderBottom:`1px solid ${T.border}`, bgcolor:"#FAFBFD", pb:2 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box display="flex" alignItems="center" gap={1.5}>
              <Box sx={{ width:4, height:24, borderRadius:2, bgcolor:T.accent }} />
              <Typography sx={{ fontFamily:fHead, fontWeight:700,
                fontSize:"0.95rem", color:T.text }}>Download Salary Slip</Typography>
            </Box>
            <IconButton size="small" onClick={() => setSlipDialog(false)}
              sx={{ bgcolor:"#F1F5F9", borderRadius:"8px" }}>
              <Close fontSize="small" />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ px:3, pt:3, pb:2 }}>
          <Stack spacing={1.5}>
            {[
              "October 2025","September 2025","August 2025",
              "July 2025","June 2025","May 2025",
            ].map(m => (
              <Box key={m} display="flex" justifyContent="space-between"
                alignItems="center"
                sx={{ p:1.6, borderRadius:"9px", border:`1px solid ${T.border}`,
                  bgcolor:"#F9FAFB",
                  "&:hover":{ borderColor:T.accent, bgcolor:T.accentLight },
                  transition:"all .13s", cursor:"pointer" }}
                onClick={() => { setSlipDialog(false); toast(`Salary slip for ${m} downloading…`); }}>
                <Typography sx={{ fontFamily:fBody, fontSize:"0.82rem",
                  fontWeight:600, color:T.text }}>{m}</Typography>
                <Download sx={{ fontSize:16, color:T.accent }} />
              </Box>
            ))}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px:3, pb:3, pt:1.5,
          borderTop:`1px solid ${T.border}`, bgcolor:"#FAFBFD" }}>
          <Button onClick={() => setSlipDialog(false)} variant="outlined" size="small"
            sx={{ fontFamily:fBody, fontWeight:600, fontSize:"0.78rem",
              textTransform:"none", borderRadius:"8px",
              borderColor:T.border, color:T.textSub }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar open={snack.open} autoHideDuration={3200}
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

export default PayrollView;