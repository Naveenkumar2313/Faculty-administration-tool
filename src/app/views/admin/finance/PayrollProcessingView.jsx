import React, { useState } from "react";
import {
  Box, Grid, Typography, Button, TextField, MenuItem,
  Tabs, Tab, Table, TableBody, TableCell, TableHead, TableRow,
  IconButton, Chip, InputAdornment, Tooltip, Stack, Divider,
  Dialog, DialogTitle, DialogContent, DialogActions, Alert,
  Snackbar, Collapse, LinearProgress, Avatar
} from "@mui/material";
import {
  CloudUpload, Calculate, Print, Save, ReceiptLong,
  AttachMoney, RemoveCircle, AddCircle, Lock, Close,
  Download, CheckCircle, Send, InfoOutlined, Visibility,
  TrendingUp, TrendingDown, EditNote, Warning, Edit
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";

const HiddenInput = styled("input")({ display: "none" });

/* ── Design Tokens ── */
const T = {
  bg:          "#F5F7FA",
  surface:     "#FFFFFF",
  border:      "#E4E8EF",
  accent:      "#6366F1",
  accentLight: "#EEF2FF",
  success:     "#10B981",
  successLight:"#ECFDF5",
  warning:     "#F59E0B",
  warningLight:"#FFFBEB",
  danger:      "#EF4444",
  dangerLight: "#FEF2F2",
  text:        "#111827",
  textSub:     "#4B5563",
  textMute:    "#9CA3AF",
};

const fHead = "Roboto, Helvetica, Arial, sans-serif";
const fBody = "Roboto, Helvetica, Arial, sans-serif";
const fMono = "Roboto, Helvetica, Arial, sans-serif";

const Fonts = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Sora:wght@600;700&family=Nunito:wght@400;500;600;700&family=JetBrains+Mono:wght@500;600&display=swap');
    * { box-sizing:border-box; }
    @keyframes fadeUp { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:none} }
    .fu { animation: fadeUp 0.3s ease both; }
    .row-h:hover { background:#F9FAFB !important; transition:background 0.15s; }
  `}</style>
);

/* ── Mock Data ── */
const EMPLOYEES_INIT = [
  { id:1, name:"Dr. Sarah Smith",    avatar:"SS", dept:"CSE",   designation:"Associate Professor", basic:85000,  loan:5000,  adjustments:0,      attendance:28, totalDays:28, pan:"AAAPS1234B", status:"Draft"      },
  { id:2, name:"Prof. Rajan Kumar",  avatar:"RK", dept:"Mech",  designation:"Professor",           basic:142000, loan:0,     adjustments:15000,  attendance:28, totalDays:28, pan:"AAPRK5678C", status:"Draft"      },
  { id:3, name:"Dr. Emily Davis",    avatar:"ED", dept:"Civil", designation:"Assistant Professor", basic:92000,  loan:0,     adjustments:-2000,  attendance:26, totalDays:28, pan:"AAAED9012D", status:"Draft"      },
  { id:4, name:"Ms. Kavya Sharma",   avatar:"KS", dept:"ECE",   designation:"Assistant Professor", basic:78000,  loan:3000,  adjustments:5000,   attendance:27, totalDays:28, pan:"AAAKS3456E", status:"Draft"      },
];

const ADJ_HISTORY_INIT = [
  { id:1, faculty:"Prof. Rajan Kumar", dept:"Mech", type:"Earning", label:"Arrears",     reason:"DA Correction (Jan–Feb)",   amount:15000 },
  { id:2, faculty:"Dr. Emily Davis",   dept:"Civil",type:"Deduction",label:"Penalty",    reason:"Bond Breakage Fine",         amount:-2000 },
  { id:3, faculty:"Ms. Kavya Sharma",  dept:"ECE",  type:"Earning", label:"Exam Duty",   reason:"Paper setting & evaluation", amount:5000  },
];

const MONTHS = ["January 2026","February 2026","March 2026","April 2026","May 2026","June 2026",
  "July 2025","August 2025","September 2025","October 2025","November 2025","December 2025"];

const FY_OPTIONS = ["FY 2025-26","FY 2024-25","FY 2023-24"];

/* ── Salary Calculator ── */
const calcSalary = (emp) => {
  const perDay    = emp.basic / emp.totalDays;
  const earned    = perDay * emp.attendance;
  const da        = earned  * 0.45;
  const hra       = earned  * 0.20;
  const special   = 5000;
  const gross     = earned + da + hra + special + emp.adjustments;

  const pf        = Math.min(emp.basic * 0.12, 1800);
  const esi       = gross < 21000 ? gross * 0.0075 : 0;
  const tds       = gross > 100000 ? gross * 0.10 : 0;
  const deductions= pf + tds + esi + emp.loan;

  return {
    earned:      Math.round(earned),
    da:          Math.round(da),
    hra:         Math.round(hra),
    special,
    gross:       Math.round(gross),
    pf:          Math.round(pf),
    esi:         Math.round(esi),
    tds:         Math.round(tds),
    loanDeduct:  emp.loan,
    deductions:  Math.round(deductions),
    net:         Math.round(gross - deductions),
    lopDays:     emp.totalDays - emp.attendance,
  };
};

/* ── Helpers ── */
const SCard = ({ children, sx={}, ...p }) => (
  <Box sx={{ background:T.surface, border:`1px solid ${T.border}`, borderRadius:"14px", ...sx }} {...p}>{children}</Box>
);

const SLabel = ({ children, sx={} }) => (
  <Typography sx={{ fontFamily:fBody, fontSize:"0.67rem", fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase", color:T.textMute, mb:0.5, ...sx }}>{children}</Typography>
);

const TH = ({ children, sx={} }) => (
  <TableCell sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.68rem", letterSpacing:"0.06em", textTransform:"uppercase", color:T.textMute, borderBottom:`1px solid ${T.border}`, py:1.5, bgcolor:"#F9FAFB", whiteSpace:"nowrap", ...sx }}>{children}</TableCell>
);
const TD = ({ children, sx={} }) => (
  <TableCell sx={{ fontFamily:fBody, fontSize:"0.81rem", color:T.textSub, borderBottom:`1px solid ${T.border}`, py:1.7, ...sx }}>{children}</TableCell>
);

const MonoAmt = ({ value, positive, sx={} }) => (
  <Typography sx={{ fontFamily:fMono, fontWeight:700, fontSize:"0.85rem", color: positive === true ? T.success : positive === false ? T.danger : T.text, ...sx }}>
    {positive === false ? "-" : ""}₹{Math.abs(value).toLocaleString()}
  </Typography>
);

const DField = ({ label, children }) => (
  <Box>
    <SLabel sx={{ mb:0.7 }}>{label}</SLabel>
    {children}
  </Box>
);

const DInput = (props) => (
  <TextField size="small" fullWidth {...props}
    sx={{ "& .MuiOutlinedInput-root":{ borderRadius:"8px", fontFamily:fBody, fontSize:"0.82rem", bgcolor:T.surface, "& fieldset":{borderColor:T.border}, "&.Mui-focused fieldset":{borderColor:T.accent} }, "& .MuiInputLabel-root.Mui-focused":{color:T.accent}, ...props.sx }} />
);

/* ════════════════════════════════
   MAIN COMPONENT
════════════════════════════════ */
const PayrollProcessingView = () => {
  const [tabIndex, setTabIndex]     = useState(0);
  const [month, setMonth]           = useState("February 2026");
  const [employees, setEmployees]   = useState(EMPLOYEES_INIT);
  const [adjHistory, setAdjHistory] = useState(ADJ_HISTORY_INIT);
  const [payslipDialog, setPayslipDialog] = useState(null);
  const [finalizeDialog, setFinalizeDialog] = useState(false);
  const [finalized, setFinalized]   = useState(false);
  const [fy, setFy]                 = useState("FY 2025-26");
  const [tdsFile, setTdsFile]       = useState(null);
  const [attFile, setAttFile]       = useState(null);
  const [snack, setSnack]           = useState({ open:false, msg:"", severity:"success" });

  /* Adjustment form */
  const [adjFaculty, setAdjFaculty] = useState("");
  const [adjType, setAdjType]       = useState("Bonus");
  const [adjAmount, setAdjAmount]   = useState("");
  const [adjReason, setAdjReason]   = useState("");

  const toast = (msg, severity="success") => setSnack({ open:true, msg, severity });

  /* Summary totals */
  const totals = employees.reduce((acc, emp) => {
    const s = calcSalary(emp);
    acc.gross       += s.gross;
    acc.deductions  += s.deductions;
    acc.net         += s.net;
    return acc;
  }, { gross:0, deductions:0, net:0 });

  /* Finalize payroll */
  const handleFinalize = () => {
    setEmployees(prev => prev.map(e => ({ ...e, status:"Processed" })));
    setFinalized(true);
    setFinalizeDialog(false);
    toast("Payroll finalized. Pay slips queued for email dispatch.");
  };

  /* Save adjustment */
  const handleSaveAdj = () => {
    if (!adjFaculty || !adjAmount || !adjReason.trim()) {
      toast("Please fill all fields.", "error"); return;
    }
    const emp = employees.find(e => e.id === parseInt(adjFaculty));
    const amt = adjType === "Deduction" ? -Math.abs(parseInt(adjAmount)) : Math.abs(parseInt(adjAmount));
    setEmployees(prev => prev.map(e => e.id === emp.id ? { ...e, adjustments: e.adjustments + amt } : e));
    setAdjHistory(prev => [{
      id: Date.now(), faculty: emp.name, dept: emp.dept,
      type: adjType === "Deduction" ? "Deduction" : "Earning",
      label: adjType, reason: adjReason, amount: amt,
    }, ...prev]);
    setAdjFaculty(""); setAdjAmount(""); setAdjReason(""); setAdjType("Bonus");
    toast(`Adjustment of ₹${Math.abs(amt).toLocaleString()} saved for ${emp.name}.`);
  };

  const tabs = [
    { label:"Monthly Runner",        icon:Calculate,   },
    { label:"Arrears & Adjustments", icon:AttachMoney, count:adjHistory.length },
    { label:"Pay Slip Viewer",       icon:ReceiptLong, },
    { label:"Form 16 Generator",     icon:Lock,        },
  ];

  return (
    <Box sx={{ p:3, bgcolor:T.bg, minHeight:"100vh", fontFamily:fBody }}>
      <Fonts />

      {/* ── Header ── */}
      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3}>
        <Box>
          <Typography sx={{ fontFamily:fHead, fontWeight:700, fontSize:"1.5rem", color:T.text }}>Salary & Payroll Processing</Typography>
          <Typography sx={{ fontFamily:fBody, fontSize:"0.82rem", color:T.textSub, mt:0.4 }}>
            Admin View &nbsp;·&nbsp; {month} &nbsp;·&nbsp;
            <Typography component="span" sx={{ fontFamily:fMono, fontSize:"0.82rem", color: finalized ? T.success : T.warning, fontWeight:700 }}>
              {finalized ? "● Finalized" : "● Draft"}
            </Typography>
          </Typography>
        </Box>
        <Box display="flex" gap={1.5}>
          <Button size="small" variant="outlined" startIcon={<Download sx={{fontSize:15}} />}
            onClick={() => toast("Payroll summary exported.")}
            sx={{ fontFamily:fBody, fontWeight:600, fontSize:"0.76rem", textTransform:"none", borderRadius:"8px", borderColor:T.border, color:T.textSub, "&:hover":{borderColor:T.accent,color:T.accent} }}>
            Export Summary
          </Button>
          {!finalized && (
            <Button size="small" variant="contained" startIcon={<CheckCircle sx={{fontSize:15}} />}
              onClick={() => setFinalizeDialog(true)}
              sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.76rem", textTransform:"none", borderRadius:"8px", bgcolor:T.success, boxShadow:"none", "&:hover":{bgcolor:"#059669",boxShadow:"none"} }}>
              Finalize Payroll
            </Button>
          )}
        </Box>
      </Box>

      {/* ── Stat Strip ── */}
      <Grid container spacing={2} mb={3}>
        {[
          { label:"Total Gross Payable",   value:`₹${(totals.gross/100000).toFixed(2)}L`,       sub:`${employees.length} employees`, color:T.accent,  icon:AttachMoney  },
          { label:"Total Deductions",      value:`₹${(totals.deductions/100000).toFixed(2)}L`,  sub:"PF + TDS + ESI + Loans",        color:T.danger,  icon:RemoveCircle },
          { label:"Net Disbursement",      value:`₹${(totals.net/100000).toFixed(2)}L`,         sub:"Bank transfer total",           color:T.success, icon:TrendingUp   },
          { label:"Adjustments Applied",   value:adjHistory.length,                              sub:"This payroll cycle",            color:T.warning, icon:EditNote      },
        ].map((s,i) => (
          <Grid item xs={6} md={3} key={i}>
            <SCard sx={{ p:2.5 }} className="fu">
              <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                <Box>
                  <SLabel>{s.label}</SLabel>
                  <Typography sx={{ fontFamily:fMono, fontWeight:700, fontSize:"1.55rem", color:s.color, lineHeight:1.1 }}>{s.value}</Typography>
                  <Typography sx={{ fontFamily:fBody, fontSize:"0.7rem", color:T.textMute, mt:0.4 }}>{s.sub}</Typography>
                </Box>
                <Box sx={{ p:1.1, borderRadius:"10px", bgcolor:`${s.color}15`, color:s.color }}>
                  <s.icon sx={{ fontSize:20 }} />
                </Box>
              </Box>
            </SCard>
          </Grid>
        ))}
      </Grid>

      {/* ── Main Card ── */}
      <SCard sx={{ overflow:"hidden" }}>
        <Box sx={{ borderBottom:`1px solid ${T.border}`, bgcolor:"#FAFBFD" }}>
          <Tabs value={tabIndex} onChange={(_,v) => setTabIndex(v)}
            sx={{ "& .MuiTabs-indicator":{ bgcolor:T.accent, height:2.5, borderRadius:"2px 2px 0 0" },
                  "& .MuiTab-root":{ fontFamily:fBody, fontWeight:600, fontSize:"0.8rem", textTransform:"none", color:T.textMute, minHeight:50, "&.Mui-selected":{color:T.accent} } }}>
            {tabs.map((t,i) => (
              <Tab key={i} icon={<t.icon sx={{fontSize:16}} />} iconPosition="start"
                label={
                  <Box display="flex" alignItems="center" gap={0.8}>
                    {t.label}
                    {t.count > 0 && (
                      <Box sx={{ px:0.7, py:0.1, borderRadius:"99px", bgcolor: tabIndex===i ? T.accentLight : "#F1F5F9" }}>
                        <Typography sx={{ fontFamily:fMono, fontSize:"0.62rem", fontWeight:700, color: tabIndex===i ? T.accent : T.textMute }}>{t.count}</Typography>
                      </Box>
                    )}
                  </Box>
                }
              />
            ))}
          </Tabs>
        </Box>

        <Box p={3}>

          {/* ════ TAB 0: MONTHLY RUNNER ════ */}
          {tabIndex === 0 && (
            <Box className="fu">
              {/* Controls row */}
              <Box display="flex" gap={2} mb={3} flexWrap="wrap" alignItems="center">
                <DInput select value={month} onChange={e=>setMonth(e.target.value)} sx={{ width:200 }}>
                  {MONTHS.map(m=><MenuItem key={m} value={m} sx={{fontFamily:fBody,fontSize:"0.82rem"}}>{m}</MenuItem>)}
                </DInput>
                <Button variant="outlined" component="label" startIcon={<CloudUpload sx={{fontSize:15}} />}
                  sx={{ fontFamily:fBody, fontWeight:600, fontSize:"0.78rem", textTransform:"none", borderRadius:"8px", borderColor:T.border, color:T.textSub, "&:hover":{borderColor:T.accent,color:T.accent} }}>
                  {attFile ? attFile.name : "Upload Attendance CSV"}
                  <HiddenInput type="file" accept=".csv" onChange={e => { setAttFile(e.target.files[0]); toast("Attendance CSV loaded. Attendance data updated."); }} />
                </Button>
                {attFile && <Box sx={{ px:1.2, py:0.4, borderRadius:"7px", bgcolor:T.successLight }}>
                  <Typography sx={{ fontFamily:fBody, fontSize:"0.72rem", fontWeight:700, color:T.success }}>✓ Attendance Loaded</Typography>
                </Box>}

                {finalized && (
                  <Box sx={{ ml:"auto", px:1.5, py:0.5, borderRadius:"8px", bgcolor:T.successLight, border:`1px solid ${T.success}40` }}>
                    <Typography sx={{ fontFamily:fMono, fontSize:"0.72rem", fontWeight:700, color:T.success }}>✓ Payroll Finalized — {month}</Typography>
                  </Box>
                )}
              </Box>

              {/* Payroll table */}
              <Box sx={{ borderRadius:"10px", border:`1px solid ${T.border}`, overflow:"hidden" }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TH>Faculty</TH>
                      <TH>Attendance</TH>
                      <TH>Basic (Earned)</TH>
                      <TH>Allowances</TH>
                      <TH>Adj.</TH>
                      <TH>Gross</TH>
                      <TH>Deductions</TH>
                      <TH>Net Payable</TH>
                      <TH>Status</TH>
                      <TH>Action</TH>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {employees.map(row => {
                      const s = calcSalary(row);
                      return (
                        <TableRow key={row.id} className="row-h">
                          <TD sx={{ minWidth:160 }}>
                            <Box display="flex" alignItems="center" gap={1.2}>
                              <Avatar sx={{ width:30, height:30, fontSize:"0.68rem", fontWeight:700, bgcolor:T.accentLight, color:T.accent }}>{row.avatar}</Avatar>
                              <Box>
                                <Typography sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.82rem", color:T.text }}>{row.name}</Typography>
                                <Typography sx={{ fontFamily:fBody, fontSize:"0.68rem", color:T.textMute }}>{row.dept} · {row.designation}</Typography>
                              </Box>
                            </Box>
                          </TD>
                          <TD>
                            <Box>
                              <Typography sx={{ fontFamily:fMono, fontSize:"0.78rem", fontWeight:600, color:T.text }}>{row.attendance}/{row.totalDays}</Typography>
                              {s.lopDays > 0 && (
                                <Box sx={{ px:0.8, py:0.15, borderRadius:"4px", bgcolor:T.dangerLight, display:"inline-block", mt:0.3 }}>
                                  <Typography sx={{ fontFamily:fBody, fontSize:"0.62rem", fontWeight:700, color:T.danger }}>LOP: {s.lopDays}d</Typography>
                                </Box>
                              )}
                            </Box>
                          </TD>
                          <TD>
                            <Typography sx={{ fontFamily:fMono, fontSize:"0.8rem" }}>₹{s.earned.toLocaleString()}</Typography>
                            <Typography sx={{ fontFamily:fBody, fontSize:"0.67rem", color:T.textMute }}>DA+HRA: ₹{(s.da+s.hra).toLocaleString()}</Typography>
                          </TD>
                          <TD>
                            <Typography sx={{ fontFamily:fMono, fontSize:"0.78rem", color:T.textSub }}>₹{(s.da+s.hra+s.special).toLocaleString()}</Typography>
                          </TD>
                          <TD>
                            {row.adjustments !== 0 ? (
                              <Box sx={{ px:1, py:0.25, borderRadius:"6px", bgcolor: row.adjustments>0 ? T.successLight : T.dangerLight, display:"inline-block" }}>
                                <Typography sx={{ fontFamily:fMono, fontSize:"0.71rem", fontWeight:700, color: row.adjustments>0 ? T.success : T.danger }}>
                                  {row.adjustments>0 ? "+" : ""}₹{row.adjustments.toLocaleString()}
                                </Typography>
                              </Box>
                            ) : <Typography sx={{ fontFamily:fMono, fontSize:"0.75rem", color:T.textMute }}>—</Typography>}
                          </TD>
                          <TD>
                            <MonoAmt value={s.gross} />
                          </TD>
                          <TD>
                            <MonoAmt value={s.deductions} positive={false} />
                            <Typography sx={{ fontFamily:fBody, fontSize:"0.65rem", color:T.textMute, mt:0.2 }}>
                              PF:{s.pf.toLocaleString()} TDS:{s.tds.toLocaleString()}
                              {s.loanDeduct > 0 ? ` Loan:${s.loanDeduct.toLocaleString()}` : ""}
                            </Typography>
                          </TD>
                          <TD>
                            <MonoAmt value={s.net} positive={true} />
                          </TD>
                          <TD>
                            <Box sx={{ px:1.2, py:0.35, borderRadius:"99px", bgcolor: finalized ? T.successLight : T.warningLight, width:"fit-content" }}>
                              <Typography sx={{ fontFamily:fBody, fontSize:"0.7rem", fontWeight:700, color: finalized ? T.success : T.warning }}>
                                {finalized ? "Processed" : "Draft"}
                              </Typography>
                            </Box>
                          </TD>
                          <TD>
                            <Tooltip title="Preview Pay Slip">
                              <IconButton size="small"
                                sx={{ bgcolor:T.accentLight, color:T.accent, borderRadius:"7px", "&:hover":{bgcolor:"#DBEAFE"} }}
                                onClick={() => setPayslipDialog(row)}>
                                <Visibility sx={{ fontSize:15 }} />
                              </IconButton>
                            </Tooltip>
                          </TD>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </Box>

              {/* Totals footer */}
              <SCard sx={{ mt:2, p:2, bgcolor:"#F9FAFB" }}>
                <Grid container spacing={2}>
                  {[
                    { label:"Total Gross",  value:totals.gross,      color:T.text    },
                    { label:"Total Deductions", value:totals.deductions, color:T.danger  },
                    { label:"Total Net Payable",value:totals.net,     color:T.success },
                  ].map(t => (
                    <Grid item xs={4} key={t.label} sx={{ textAlign:"center" }}>
                      <SLabel sx={{ mb:0.4 }}>{t.label}</SLabel>
                      <Typography sx={{ fontFamily:fMono, fontWeight:700, fontSize:"1.1rem", color:t.color }}>
                        ₹{t.value.toLocaleString()}
                      </Typography>
                    </Grid>
                  ))}
                </Grid>
              </SCard>
            </Box>
          )}

          {/* ════ TAB 1: ARREARS & ADJUSTMENTS ════ */}
          {tabIndex === 1 && (
            <Box className="fu">
              <Grid container spacing={3}>
                {/* Form */}
                <Grid item xs={12} md={5}>
                  <Typography sx={{ fontFamily:fHead, fontWeight:700, fontSize:"0.95rem", color:T.text, mb:2 }}>Add Adjustment</Typography>
                  <SCard sx={{ p:2.5 }}>
                    <Stack spacing={2.2}>
                      <DField label="Select Faculty *">
                        <DInput select value={adjFaculty} onChange={e=>setAdjFaculty(e.target.value)}>
                          {employees.map(e=><MenuItem key={e.id} value={e.id} sx={{fontFamily:fBody,fontSize:"0.82rem"}}>{e.name} — {e.dept}</MenuItem>)}
                        </DInput>
                      </DField>
                      <DField label="Adjustment Type *">
                        <DInput select value={adjType} onChange={e=>setAdjType(e.target.value)}>
                          {["Bonus","Arrears","Exam Duty","Other Earning","Deduction","Fine","Penalty"].map(t=>(
                            <MenuItem key={t} value={t} sx={{fontFamily:fBody,fontSize:"0.82rem"}}>
                              <Box display="flex" alignItems="center" gap={1}>
                                {["Deduction","Fine","Penalty"].includes(t)
                                  ? <RemoveCircle sx={{ fontSize:14, color:T.danger }} />
                                  : <AddCircle   sx={{ fontSize:14, color:T.success }} />}
                                {t}
                              </Box>
                            </MenuItem>
                          ))}
                        </DInput>
                      </DField>
                      <DField label="Amount (₹) *">
                        <DInput type="number" value={adjAmount} onChange={e=>setAdjAmount(e.target.value)}
                          InputProps={{ startAdornment:<InputAdornment position="start"><Typography sx={{fontFamily:fMono,fontSize:"0.82rem",color:T.textMute}}>₹</Typography></InputAdornment> }} />
                      </DField>
                      <DField label="Reason / Remarks *">
                        <DInput multiline rows={2} value={adjReason} onChange={e=>setAdjReason(e.target.value)}
                          placeholder="e.g. Exam duty payment for Nov-25 paper setting..." />
                      </DField>

                      {adjFaculty && adjAmount && (
                        <Box sx={{ p:1.5, borderRadius:"8px", bgcolor: ["Deduction","Fine","Penalty"].includes(adjType) ? T.dangerLight : T.successLight, border:`1px solid ${["Deduction","Fine","Penalty"].includes(adjType) ? T.danger+"30" : T.success+"30"}` }}>
                          <Typography sx={{ fontFamily:fBody, fontSize:"0.74rem", fontWeight:600, color: ["Deduction","Fine","Penalty"].includes(adjType) ? T.danger : T.success }}>
                            {["Deduction","Fine","Penalty"].includes(adjType) ? "⬇ Deduction" : "⬆ Earning"} of ₹{parseInt(adjAmount||0).toLocaleString()} will be added to {employees.find(e=>e.id===parseInt(adjFaculty))?.name || "—"}'s {month} payroll.
                          </Typography>
                        </Box>
                      )}

                      <Button variant="contained" fullWidth startIcon={<Save sx={{fontSize:15}} />} onClick={handleSaveAdj}
                        sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.8rem", textTransform:"none", borderRadius:"8px", bgcolor:T.accent, boxShadow:"none", "&:hover":{bgcolor:"#4F46E5",boxShadow:"none"} }}>
                        Save to Payroll
                      </Button>
                    </Stack>
                  </SCard>
                </Grid>

                {/* History */}
                <Grid item xs={12} md={7}>
                  <Typography sx={{ fontFamily:fHead, fontWeight:700, fontSize:"0.95rem", color:T.text, mb:2 }}>
                    Adjustment History — {month}
                  </Typography>
                  <Box sx={{ borderRadius:"10px", border:`1px solid ${T.border}`, overflow:"hidden" }}>
                    <Table>
                      <TableHead><TableRow>
                        <TH>Faculty</TH><TH>Type</TH><TH>Reason</TH><TH sx={{ textAlign:"right" }}>Amount</TH>
                      </TableRow></TableHead>
                      <TableBody>
                        {adjHistory.map(a => (
                          <TableRow key={a.id} className="row-h">
                            <TD sx={{ fontWeight:600, color:T.text }}>
                              {a.faculty}
                              <Typography sx={{ fontFamily:fBody, fontSize:"0.68rem", color:T.textMute }}>{a.dept}</Typography>
                            </TD>
                            <TD>
                              <Box display="flex" alignItems="center" gap={0.5}
                                sx={{ px:1, py:0.25, borderRadius:"6px", bgcolor: a.type==="Earning" ? T.successLight : T.dangerLight, width:"fit-content" }}>
                                {a.type==="Earning"
                                  ? <AddCircle sx={{ fontSize:12, color:T.success }} />
                                  : <RemoveCircle sx={{ fontSize:12, color:T.danger }} />}
                                <Typography sx={{ fontFamily:fBody, fontSize:"0.7rem", fontWeight:700, color: a.type==="Earning" ? T.success : T.danger }}>{a.label}</Typography>
                              </Box>
                            </TD>
                            <TD sx={{ maxWidth:200 }}>
                              <Typography sx={{ fontFamily:fBody, fontSize:"0.78rem", color:T.textMute }}>{a.reason}</Typography>
                            </TD>
                            <TD sx={{ textAlign:"right" }}>
                              <Typography sx={{ fontFamily:fMono, fontWeight:700, fontSize:"0.85rem", color: a.amount>0 ? T.success : T.danger }}>
                                {a.amount>0 ? "+" : ""}₹{a.amount.toLocaleString()}
                              </Typography>
                            </TD>
                          </TableRow>
                        ))}
                        {adjHistory.length === 0 && (
                          <TableRow><TableCell colSpan={4} sx={{ textAlign:"center", py:5, fontFamily:fBody, color:T.textMute }}>No adjustments for this month.</TableCell></TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          )}

          {/* ════ TAB 2: PAY SLIP VIEWER ════ */}
          {tabIndex === 2 && (
            <Box className="fu">
              <Typography sx={{ fontFamily:fHead, fontWeight:700, fontSize:"0.95rem", color:T.text, mb:2 }}>
                Pay Slip Preview & Download
              </Typography>
              <Grid container spacing={2}>
                {employees.map(emp => {
                  const s = calcSalary(emp);
                  return (
                    <Grid item xs={12} md={6} key={emp.id}>
                      <SCard sx={{ p:2.5, "&:hover":{boxShadow:"0 4px 16px rgba(0,0,0,0.07)"}, transition:"box-shadow 0.2s" }}>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1.5}>
                          <Box display="flex" alignItems="center" gap={1.2}>
                            <Avatar sx={{ width:34, height:34, fontSize:"0.72rem", fontWeight:700, bgcolor:T.accentLight, color:T.accent }}>{emp.avatar}</Avatar>
                            <Box>
                              <Typography sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.88rem", color:T.text }}>{emp.name}</Typography>
                              <Typography sx={{ fontFamily:fBody, fontSize:"0.7rem", color:T.textMute }}>{emp.dept} · {emp.designation}</Typography>
                            </Box>
                          </Box>
                          <Box sx={{ px:1.2, py:0.35, borderRadius:"7px", bgcolor: finalized ? T.successLight : T.warningLight }}>
                            <Typography sx={{ fontFamily:fMono, fontSize:"0.68rem", fontWeight:700, color: finalized ? T.success : T.warning }}>
                              {finalized ? "Processed" : "Draft"}
                            </Typography>
                          </Box>
                        </Box>

                        <Divider sx={{ borderColor:T.border, mb:1.5 }} />

                        <Grid container spacing={1.5} mb={1.5}>
                          {[
                            { label:"Basic Earned",    value:s.earned,          color:T.text    },
                            { label:"DA + HRA",        value:s.da + s.hra,      color:T.text    },
                            { label:"Special Allow.",  value:s.special,         color:T.text    },
                            { label:"Adjustments",     value:emp.adjustments,   color: emp.adjustments>=0 ? T.success : T.danger, signed:true },
                          ].map(c => (
                            <Grid item xs={6} key={c.label}>
                              <SLabel sx={{ mb:0.2 }}>{c.label}</SLabel>
                              <Typography sx={{ fontFamily:fMono, fontSize:"0.78rem", fontWeight:600, color:c.color }}>
                                {c.signed && c.value>0 ? "+" : ""}₹{Math.abs(c.value).toLocaleString()}
                              </Typography>
                            </Grid>
                          ))}
                        </Grid>

                        <Box sx={{ p:1.5, borderRadius:"8px", bgcolor:"#F9FAFB", border:`1px solid ${T.border}`, mb:1.5 }}>
                          <Box display="flex" justifyContent="space-between" sx={{ mb:0.5 }}>
                            <Typography sx={{ fontFamily:fBody, fontSize:"0.76rem", color:T.textSub }}>Gross</Typography>
                            <Typography sx={{ fontFamily:fMono, fontWeight:700, fontSize:"0.82rem" }}>₹{s.gross.toLocaleString()}</Typography>
                          </Box>
                          <Box display="flex" justifyContent="space-between" sx={{ mb:0.5 }}>
                            <Typography sx={{ fontFamily:fBody, fontSize:"0.76rem", color:T.danger }}>Total Deductions</Typography>
                            <Typography sx={{ fontFamily:fMono, fontWeight:700, fontSize:"0.82rem", color:T.danger }}>-₹{s.deductions.toLocaleString()}</Typography>
                          </Box>
                          <Divider sx={{ my:0.8, borderColor:T.border }} />
                          <Box display="flex" justifyContent="space-between">
                            <Typography sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.82rem", color:T.text }}>Net Payable</Typography>
                            <Typography sx={{ fontFamily:fMono, fontWeight:700, fontSize:"1rem", color:T.success }}>₹{s.net.toLocaleString()}</Typography>
                          </Box>
                        </Box>

                        <Box display="flex" gap={1}>
                          <Button size="small" fullWidth variant="outlined" startIcon={<Visibility sx={{fontSize:13}} />}
                            onClick={() => setPayslipDialog(emp)}
                            sx={{ fontFamily:fBody, fontWeight:600, fontSize:"0.73rem", textTransform:"none", borderRadius:"8px", borderColor:T.border, color:T.textSub, "&:hover":{borderColor:T.accent,color:T.accent} }}>
                            Full View
                          </Button>
                          <Button size="small" fullWidth variant="contained" startIcon={<Download sx={{fontSize:13}} />}
                            onClick={() => toast(`Pay slip for ${emp.name} downloaded.`)}
                            sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.73rem", textTransform:"none", borderRadius:"8px", bgcolor:T.accent, boxShadow:"none", "&:hover":{bgcolor:"#4F46E5",boxShadow:"none"} }}>
                            Download PDF
                          </Button>
                        </Box>
                      </SCard>
                    </Grid>
                  );
                })}
              </Grid>
            </Box>
          )}

          {/* ════ TAB 3: FORM 16 GENERATOR ════ */}
          {tabIndex === 3 && (
            <Box className="fu">
              <Grid container spacing={3}>
                <Grid item xs={12} md={7}>
                  <Box sx={{ p:4, borderRadius:"14px", border:`2px dashed ${T.border}`, textAlign:"center", bgcolor:"#FAFBFD" }}>
                    <ReceiptLong sx={{ fontSize:52, color:T.textMute, mb:1.5 }} />
                    <Typography sx={{ fontFamily:fHead, fontWeight:700, fontSize:"1.1rem", color:T.text, mb:0.5 }}>Year-End Tax Certificates</Typography>
                    <Typography sx={{ fontFamily:fBody, fontSize:"0.78rem", color:T.textMute, mb:3, maxWidth:400, mx:"auto" }}>
                      Generate Part A (TDS details) and Part B (salary breakdown) for all employees. Files are password-protected with PAN + DOB.
                    </Typography>

                    <Box display="flex" justifyContent="center" gap={2} mb={3} flexWrap="wrap">
                      <DInput select value={fy} onChange={e=>setFy(e.target.value)} sx={{ width:160 }}>
                        {FY_OPTIONS.map(f=><MenuItem key={f} value={f} sx={{fontFamily:fBody,fontSize:"0.82rem"}}>{f}</MenuItem>)}
                      </DInput>
                      <Button variant="outlined" component="label" startIcon={<CloudUpload sx={{fontSize:15}} />}
                        sx={{ fontFamily:fBody, fontWeight:600, fontSize:"0.78rem", textTransform:"none", borderRadius:"8px", borderColor: tdsFile ? T.success : T.border, color: tdsFile ? T.success : T.textSub }}>
                        {tdsFile ? tdsFile.name : "Import TDS Data (Excel)"}
                        <HiddenInput type="file" accept=".xlsx,.xls" onChange={e => { setTdsFile(e.target.files[0]); toast("TDS data imported successfully."); }} />
                      </Button>
                    </Box>

                    {tdsFile && (
                      <Alert severity="success" sx={{ mb:2.5, borderRadius:"8px", fontFamily:fBody, fontSize:"0.76rem" }}>
                        TDS file loaded: {tdsFile.name} — reconciliation complete for {employees.length} employees.
                      </Alert>
                    )}

                    <Button variant="contained" size="large" startIcon={<Lock sx={{fontSize:18}} />}
                      onClick={() => toast(`Form 16 certificates generated for ${employees.length} employees. Emails dispatched.`)}
                      sx={{ fontFamily:fBody, fontWeight:700, textTransform:"none", borderRadius:"10px", bgcolor:T.accent, boxShadow:"none", py:1.3, px:4, "&:hover":{bgcolor:"#4F46E5",boxShadow:"none"} }}>
                      Generate & Email Certificates
                    </Button>
                  </Box>
                </Grid>

                <Grid item xs={12} md={5}>
                  <Typography sx={{ fontFamily:fHead, fontWeight:700, fontSize:"0.9rem", color:T.text, mb:2 }}>Employee TDS Summary — {fy}</Typography>
                  <Box sx={{ borderRadius:"10px", border:`1px solid ${T.border}`, overflow:"hidden" }}>
                    <Table size="small">
                      <TableHead><TableRow>
                        <TH>Faculty</TH><TH>PAN</TH><TH>TDS</TH><TH>Form 16</TH>
                      </TableRow></TableHead>
                      <TableBody>
                        {employees.map(emp => {
                          const s = calcSalary(emp);
                          return (
                            <TableRow key={emp.id} className="row-h">
                              <TD sx={{ fontWeight:600, color:T.text, fontSize:"0.78rem" }}>
                                {emp.name.split(" ").slice(0,2).join(" ")}
                              </TD>
                              <TD><Typography sx={{ fontFamily:fMono, fontSize:"0.7rem", color:T.textMute }}>{emp.pan}</Typography></TD>
                              <TD><Typography sx={{ fontFamily:fMono, fontSize:"0.75rem", fontWeight:700, color: s.tds>0 ? T.danger : T.textMute }}>
                                {s.tds>0 ? `₹${s.tds.toLocaleString()}` : "Nil"}
                              </Typography></TD>
                              <TD>
                                <Button size="small" startIcon={<Download sx={{fontSize:12}} />}
                                  onClick={() => toast(`Form 16 for ${emp.name} downloaded.`)}
                                  sx={{ fontFamily:fBody, fontWeight:600, fontSize:"0.68rem", textTransform:"none", color:T.accent, p:0, "&:hover":{bgcolor:"transparent",textDecoration:"underline"} }}>
                                  Download
                                </Button>
                              </TD>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          )}

        </Box>
      </SCard>

      {/* ══════════════════════════════════════
          PAY SLIP DIALOG
      ══════════════════════════════════════ */}
      <Dialog open={!!payslipDialog} onClose={() => setPayslipDialog(null)} maxWidth="sm" fullWidth
        PaperProps={{ sx:{ borderRadius:"16px", border:`1px solid ${T.border}` } }}>
        {payslipDialog && (() => {
          const emp = payslipDialog;
          const s   = calcSalary(emp);
          return (
            <>
              <DialogTitle sx={{ fontFamily:fHead, fontWeight:700, fontSize:"1rem", color:T.text, borderBottom:`1px solid ${T.border}`, bgcolor:"#FAFBFD", pb:2 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Box display="flex" alignItems="center" gap={1.2}>
                    <Box sx={{ width:4, height:22, borderRadius:2, bgcolor:T.accent }} />
                    Pay Slip — {month}
                  </Box>
                  <IconButton size="small" onClick={() => setPayslipDialog(null)} sx={{ bgcolor:"#F1F5F9", borderRadius:"8px" }}><Close fontSize="small" /></IconButton>
                </Box>
              </DialogTitle>
              <DialogContent sx={{ px:3, pt:3, pb:2 }}>
                {/* Faculty header */}
                <Box sx={{ p:2, borderRadius:"10px", bgcolor:T.accentLight, border:`1px solid ${T.accent}30`, mb:2.5 }}>
                  <Box display="flex" justifyContent="space-between" flexWrap="wrap" gap={1}>
                    <Box>
                      <Typography sx={{ fontFamily:fHead, fontWeight:700, fontSize:"0.95rem", color:T.text }}>{emp.name}</Typography>
                      <Typography sx={{ fontFamily:fBody, fontSize:"0.74rem", color:T.textSub }}>{emp.designation} · {emp.dept}</Typography>
                    </Box>
                    <Box textAlign="right">
                      <Typography sx={{ fontFamily:fMono, fontSize:"0.72rem", color:T.textMute }}>PAN: {emp.pan}</Typography>
                      <Typography sx={{ fontFamily:fMono, fontSize:"0.72rem", color:T.textMute }}>Days: {emp.attendance}/{emp.totalDays}</Typography>
                    </Box>
                  </Box>
                </Box>

                {/* Earnings */}
                <SLabel sx={{ mb:1 }}>Earnings</SLabel>
                <Box sx={{ borderRadius:"8px", border:`1px solid ${T.border}`, overflow:"hidden", mb:2 }}>
                  {[
                    { label:"Basic Pay (Earned)",       value:s.earned    },
                    { label:"Dearness Allowance (45%)", value:s.da        },
                    { label:"HRA (20%)",                value:s.hra       },
                    { label:"Special Allowance",        value:s.special   },
                    ...(emp.adjustments!==0 ? [{ label:"Adjustments", value:emp.adjustments }] : []),
                  ].map((row,i) => (
                    <Box key={i} display="flex" justifyContent="space-between" sx={{ px:2, py:1, borderBottom:`1px solid ${T.border}`, "&:last-child":{borderBottom:"none"}, bgcolor: i%2===0 ? "transparent" : "#FAFBFD" }}>
                      <Typography sx={{ fontFamily:fBody, fontSize:"0.79rem", color:T.textSub }}>{row.label}</Typography>
                      <Typography sx={{ fontFamily:fMono, fontSize:"0.79rem", fontWeight:700, color: row.value<0 ? T.danger : T.text }}>
                        {row.value<0 ? "-" : "+"}₹{Math.abs(Math.round(row.value)).toLocaleString()}
                      </Typography>
                    </Box>
                  ))}
                  <Box display="flex" justifyContent="space-between" sx={{ px:2, py:1.2, bgcolor:T.accentLight, borderTop:`2px solid ${T.accent}20` }}>
                    <Typography sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.82rem", color:T.accent }}>Gross Pay</Typography>
                    <Typography sx={{ fontFamily:fMono, fontWeight:700, fontSize:"0.9rem", color:T.accent }}>₹{s.gross.toLocaleString()}</Typography>
                  </Box>
                </Box>

                {/* Deductions */}
                <SLabel sx={{ mb:1 }}>Deductions</SLabel>
                <Box sx={{ borderRadius:"8px", border:`1px solid ${T.border}`, overflow:"hidden" }}>
                  {[
                    { label:"Provident Fund (12%)", value:s.pf         },
                    ...(s.esi > 0 ? [{ label:"ESI (0.75%)",  value:s.esi }] : []),
                    ...(s.tds > 0 ? [{ label:"TDS (10%)",    value:s.tds }] : []),
                    ...(s.loanDeduct > 0 ? [{ label:"Loan Recovery", value:s.loanDeduct }] : []),
                  ].map((row,i) => (
                    <Box key={i} display="flex" justifyContent="space-between" sx={{ px:2, py:1, borderBottom:`1px solid ${T.border}`, "&:last-child":{borderBottom:"none"} }}>
                      <Typography sx={{ fontFamily:fBody, fontSize:"0.79rem", color:T.textSub }}>{row.label}</Typography>
                      <Typography sx={{ fontFamily:fMono, fontSize:"0.79rem", fontWeight:700, color:T.danger }}>-₹{Math.round(row.value).toLocaleString()}</Typography>
                    </Box>
                  ))}
                  <Box display="flex" justifyContent="space-between" sx={{ px:2, py:1.2, bgcolor:T.dangerLight, borderTop:`2px solid ${T.danger}20` }}>
                    <Typography sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.82rem", color:T.danger }}>Total Deductions</Typography>
                    <Typography sx={{ fontFamily:fMono, fontWeight:700, fontSize:"0.9rem", color:T.danger }}>-₹{s.deductions.toLocaleString()}</Typography>
                  </Box>
                </Box>

                <Box display="flex" justifyContent="space-between" sx={{ mt:2, p:2, borderRadius:"10px", bgcolor:T.successLight, border:`2px solid ${T.success}30` }}>
                  <Typography sx={{ fontFamily:fHead, fontWeight:700, fontSize:"1rem", color:T.success }}>Net Pay</Typography>
                  <Typography sx={{ fontFamily:fMono, fontWeight:700, fontSize:"1.2rem", color:T.success }}>₹{s.net.toLocaleString()}</Typography>
                </Box>
              </DialogContent>
              <DialogActions sx={{ px:3, pb:3, borderTop:`1px solid ${T.border}`, pt:2, bgcolor:"#FAFBFD", gap:1 }}>
                <Button onClick={() => setPayslipDialog(null)} variant="outlined"
                  sx={{ fontFamily:fBody, fontWeight:600, fontSize:"0.8rem", textTransform:"none", borderRadius:"8px", borderColor:T.border, color:T.textSub }}>
                  Close
                </Button>
                <Button variant="contained" startIcon={<Download sx={{fontSize:15}} />}
                  onClick={() => { toast(`Pay slip for ${emp.name} downloaded.`); setPayslipDialog(null); }}
                  sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.8rem", textTransform:"none", borderRadius:"8px", bgcolor:T.accent, boxShadow:"none", "&:hover":{bgcolor:"#4F46E5",boxShadow:"none"} }}>
                  Download PDF
                </Button>
              </DialogActions>
            </>
          );
        })()}
      </Dialog>

      {/* ══════════════════════════════════════
          FINALIZE CONFIRMATION DIALOG
      ══════════════════════════════════════ */}
      <Dialog open={finalizeDialog} onClose={() => setFinalizeDialog(false)} maxWidth="xs" fullWidth
        PaperProps={{ sx:{ borderRadius:"16px", border:`1px solid ${T.border}` } }}>
        <DialogTitle sx={{ fontFamily:fHead, fontWeight:700, fontSize:"1rem", color:T.text, borderBottom:`1px solid ${T.border}`, bgcolor:"#FAFBFD", pb:2 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            Confirm Payroll Finalization
            <IconButton size="small" onClick={() => setFinalizeDialog(false)} sx={{ bgcolor:"#F1F5F9", borderRadius:"8px" }}><Close fontSize="small" /></IconButton>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ px:3, pt:3, pb:2 }}>
          <Stack spacing={2}>
            <Box sx={{ p:2, borderRadius:"10px", bgcolor:T.successLight, border:`1px solid ${T.success}30`, textAlign:"center" }}>
              <Typography sx={{ fontFamily:fMono, fontWeight:700, fontSize:"1.3rem", color:T.success }}>₹{totals.net.toLocaleString()}</Typography>
              <Typography sx={{ fontFamily:fBody, fontSize:"0.75rem", color:T.textSub }}>Total Net Disbursement</Typography>
            </Box>
            <Alert severity="warning" sx={{ borderRadius:"8px", fontFamily:fBody, fontSize:"0.76rem" }}>
              Once finalized, pay slips will be emailed to all <strong>{employees.length} employees</strong> and the payroll will be locked for {month}.
            </Alert>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px:3, pb:3, borderTop:`1px solid ${T.border}`, pt:2, bgcolor:"#FAFBFD", gap:1 }}>
          <Button onClick={() => setFinalizeDialog(false)} variant="outlined"
            sx={{ fontFamily:fBody, fontWeight:600, fontSize:"0.8rem", textTransform:"none", borderRadius:"8px", borderColor:T.border, color:T.textSub }}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleFinalize} startIcon={<Send sx={{fontSize:15}} />}
            sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.8rem", textTransform:"none", borderRadius:"8px", bgcolor:T.success, boxShadow:"none", "&:hover":{bgcolor:"#059669",boxShadow:"none"} }}>
            Finalize & Dispatch
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar open={snack.open} autoHideDuration={3500} onClose={()=>setSnack(s=>({...s,open:false}))} anchorOrigin={{ vertical:"bottom", horizontal:"center" }}>
        <Alert severity={snack.severity} sx={{ borderRadius:"10px", fontFamily:fBody, fontWeight:600 }} onClose={()=>setSnack(s=>({...s,open:false}))}>
          {snack.msg}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default PayrollProcessingView;