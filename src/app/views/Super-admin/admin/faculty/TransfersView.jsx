import React, { useState } from "react";
import {
  Box, Grid, Typography, Button, TextField, MenuItem,
  Tabs, Tab, Table, TableBody, TableCell, TableHead, TableRow,
  FormControlLabel, Checkbox, Divider, Chip, Avatar,
  InputAdornment, LinearProgress, Tooltip, Stack, Snackbar,
  Alert, Dialog, DialogTitle, DialogContent, DialogActions,
  IconButton, Collapse
} from "@mui/material";
import {
  SwapHoriz, ExitToApp, Calculate, Print, CheckCircle,
  Cancel, Description, AssignmentReturned, ArrowForward,
  AccountBalance, Info, ArrowBack, Close, Download,
  Send, Add, History, TrendingUp, Person, Warning,
  FactCheck, Edit, AccessTime, Lock
} from "@mui/icons-material";

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
const FACULTY_LIST = [
  { id:1, name:"Dr. Sarah Smith",    avatar:"SS", dept:"Computer Science", designation:"Associate Professor", manager:"Prof. K. Rao",  joinDate:"2015-06-01", empId:"FAC-0041" },
  { id:2, name:"Prof. Rajan Kumar",  avatar:"RK", dept:"Mechanical",       designation:"Professor",           manager:"Dr. A. Singh",  joinDate:"2010-08-15", empId:"FAC-0012" },
  { id:3, name:"Dr. Emily Davis",    avatar:"ED", dept:"Civil Engg",       designation:"Assistant Professor", manager:"Prof. M. Ali",  joinDate:"2018-01-20", empId:"FAC-0087" },
  { id:4, name:"Ms. Kavya Sharma",   avatar:"KS", dept:"Electrical",       designation:"Assistant Professor", manager:"Dr. R. Kumar",  joinDate:"2020-07-01", empId:"FAC-0115" },
];

const DEPARTMENTS   = ["Computer Science","Mechanical","Civil Engg","Electrical","Physics","Mathematics","Admin Office"];
const HOD_OPTIONS   = ["Dr. S. Nair — CSE","Dr. A. Singh — Mech","Prof. M. Ali — Civil","Dr. P. Sharma — ECE","Prof. R. Verma — Physics"];
const CAMPUS_OPTIONS= ["Main Campus","City Campus","North Extension Campus","Online/Remote"];

const EXIT_REQUESTS_INIT = [
  { id:2, name:"Prof. Rajan Kumar", avatar:"RK", dept:"Mechanical", designation:"Professor",           type:"Retirement",  date:"2026-05-31", status:"Processing", progress:60, basicPay:142000, years:15, leaves:45 },
  { id:4, name:"Mr. John Doe",      avatar:"JD", dept:"Admin Office",designation:"Administrative Asst.",type:"Resignation", date:"2026-03-15", status:"Pending",    progress:20, basicPay:55000,  years:6,  leaves:18 },
];

const TRANSFER_HISTORY = [
  { name:"Dr. A. Verma",  from:"Civil Engg",    to:"Admin Office",    date:"Jan 10, 2026", type:"Interdept." },
  { name:"Ms. P. Nair",   from:"Computer Sci.", to:"Electrical",      date:"Dec 22, 2025", type:"Interdept." },
  { name:"Prof. S. Khan", from:"Mechanical",    to:"Civil Engg",      date:"Dec 01, 2025", type:"Campus"     },
  { name:"Dr. K. Menon",  from:"Mathematics",   to:"Computer Science",date:"Nov 14, 2025", type:"Interdept." },
];

const CLEARANCE_ITEMS = [
  { key:"library",   label:"Library Books Returned"             },
  { key:"laptop",    label:"IT Assets (Laptop / Devices)"       },
  { key:"finance",   label:"Finance (Loans / Advances) Cleared" },
  { key:"idCard",    label:"Admin ID Card & Lab Keys Returned"  },
  { key:"email",     label:"Institutional Email Deactivated"    },
  { key:"hod",       label:"HOD Exit Sign-off Received"         },
];

const HANDOVER_ITEMS = [
  { key:"laptop",   label:"Laptop / Devices"    },
  { key:"labKeys",  label:"Lab & Cabin Keys"    },
  { key:"library",  label:"Library Books"       },
  { key:"idCard",   label:"ID Card Re-issue"    },
  { key:"files",    label:"Department Files"    },
  { key:"software", label:"Software Licenses"   },
];

/* ── Helpers ── */
const SCard = ({ children, sx={}, ...p }) => (
  <Box sx={{ background:T.surface, border:`1px solid ${T.border}`, borderRadius:"14px", ...sx }} {...p}>{children}</Box>
);

const SLabel = ({ children, sx={} }) => (
  <Typography sx={{ fontFamily:fBody, fontSize:"0.67rem", fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase", color:T.textMute, mb:0.5, ...sx }}>{children}</Typography>
);

const TH = ({ children }) => (
  <TableCell sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.68rem", letterSpacing:"0.06em", textTransform:"uppercase", color:T.textMute, borderBottom:`1px solid ${T.border}`, py:1.5, bgcolor:"#F9FAFB", whiteSpace:"nowrap" }}>{children}</TableCell>
);
const TD = ({ children, sx={} }) => (
  <TableCell sx={{ fontFamily:fBody, fontSize:"0.81rem", color:T.textSub, borderBottom:`1px solid ${T.border}`, py:1.7, ...sx }}>{children}</TableCell>
);

const StatusPill = ({ status }) => {
  const map = {
    Processing: { color:T.accent,   bg:T.accentLight   },
    Pending:    { color:T.warning,  bg:T.warningLight  },
    Completed:  { color:T.success,  bg:T.successLight  },
    Closed:     { color:T.textMute, bg:"#F1F5F9"       },
  };
  const s = map[status] || { color:T.textMute, bg:"#F1F5F9" };
  return (
    <Box display="flex" alignItems="center" gap={0.6} sx={{ px:1.2, py:0.35, borderRadius:"99px", bgcolor:s.bg, width:"fit-content" }}>
      <Box sx={{ width:6, height:6, borderRadius:"50%", bgcolor:s.color }} />
      <Typography sx={{ fontFamily:fBody, fontSize:"0.71rem", fontWeight:700, color:s.color }}>{status}</Typography>
    </Box>
  );
};

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

const RowStat = ({ label, value, color }) => (
  <Box display="flex" justifyContent="space-between" alignItems="center"
    sx={{ py:1.1, borderBottom:`1px solid ${T.border}`, "&:last-child":{borderBottom:"none"} }}>
    <Typography sx={{ fontFamily:fBody, fontSize:"0.79rem", color:T.textSub }}>{label}</Typography>
    <Typography sx={{ fontFamily:fMono, fontSize:"0.82rem", fontWeight:700, color: color || T.text }}>{value}</Typography>
  </Box>
);

const calcGratuity    = (basic, years) => Math.round((15 * Number(basic) * Number(years)) / 26);
const calcEncashment  = (basic, days)  => Math.round((Number(basic) / 30) * Number(days));

/* ════════════════════════════════
   MAIN COMPONENT
════════════════════════════════ */
const TransfersView = () => {
  const [tabIndex, setTabIndex]         = useState(0);

  /* Transfer form */
  const [selectedFaculty, setSelectedFaculty] = useState("");
  const [newDept, setNewDept]           = useState("");
  const [newManager, setNewManager]     = useState("");
  const [newCampus, setNewCampus]       = useState("");
  const [effectiveDate, setEffectiveDate] = useState("");
  const [transferNote, setTransferNote] = useState("");
  const [handover, setHandover]         = useState(Object.fromEntries(HANDOVER_ITEMS.map(i => [i.key, false])));
  const [history, setHistory]           = useState(TRANSFER_HISTORY);
  const [transferDialog, setTransferDialog] = useState(false);

  /* Exit */
  const [exitRequests, setExitRequests] = useState(EXIT_REQUESTS_INIT);
  const [exitFaculty, setExitFaculty]   = useState(null);
  const [clearance, setClearance]       = useState(Object.fromEntries(CLEARANCE_ITEMS.map(i => [i.key, false])));
  const [basicPay, setBasicPay]         = useState("");
  const [yearsService, setYearsService] = useState("");
  const [leaveBalance, setLeaveBalance] = useState("");
  const [settlement, setSettlement]     = useState(null);
  const [finalizeDialog, setFinalizeDialog] = useState(false);

  const [snack, setSnack] = useState({ open:false, msg:"", severity:"success" });
  const toast = (msg, severity="success") => setSnack({ open:true, msg, severity });

  const selected = FACULTY_LIST.find(f => f.id === parseInt(selectedFaculty));
  const handoverCount = Object.values(handover).filter(Boolean).length;
  const clearanceCount = Object.values(clearance).filter(Boolean).length;

  const handleTransfer = () => {
    if (!selectedFaculty || !newDept || !effectiveDate) { toast("Please fill all required fields.", "error"); return; }
    setHistory(prev => [{
      name: selected.name,
      from: selected.dept,
      to:   newDept,
      date: new Date(effectiveDate).toLocaleDateString("en-IN", { day:"2-digit", month:"short", year:"numeric" }),
      type: "Interdept."
    }, ...prev]);
    setTransferDialog(false);
    setSelectedFaculty(""); setNewDept(""); setNewManager(""); setNewCampus(""); setEffectiveDate(""); setTransferNote("");
    setHandover(Object.fromEntries(HANDOVER_ITEMS.map(i => [i.key, false])));
    toast(`Transfer processed for ${selected.name}. Notifications dispatched.`);
  };

  const calculateSettlement = () => {
    if (!basicPay || !yearsService) { toast("Enter basic pay and years of service.", "error"); return; }
    const gratuity    = calcGratuity(basicPay, yearsService);
    const leaveEncash = calcEncashment(basicPay, leaveBalance || 0);
    setSettlement({ gratuity, leaveEncash, total: gratuity + leaveEncash });
  };

  const handleFinalizeExit = () => {
    setExitRequests(prev => prev.map(r => r.id === exitFaculty.id ? { ...r, status:"Completed", progress:100 } : r));
    setFinalizeDialog(false);
    setExitFaculty(null);
    setClearance(Object.fromEntries(CLEARANCE_ITEMS.map(i => [i.key, false])));
    setSettlement(null);
    toast("Exit process completed. Service certificate and settlement letter generated.");
  };

  const openExit = (row) => {
    setExitFaculty(row);
    setBasicPay(row.basicPay);
    setYearsService(row.years);
    setLeaveBalance(row.leaves);
    setSettlement(null);
    const preFill = Object.fromEntries(CLEARANCE_ITEMS.map((item, i) => [item.key, i < 2]));
    setClearance(preFill);
  };

  const tabs = [
    { label:"Internal Transfers",  icon:SwapHoriz, count:0             },
    { label:"Separation & Exits",  icon:ExitToApp, count:exitRequests.filter(r=>r.status!=="Completed").length },
  ];

  return (
    <Box sx={{ p:3, bgcolor:T.bg, minHeight:"100vh", fontFamily:fBody }}>
      <Fonts />

      {/* ── Header ── */}
      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3} flexWrap="wrap" gap={2}>
        <Box>
          <Typography sx={{ fontFamily:fBody, fontSize:"0.72rem", fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color:T.textMute, mb:0.3 }}>
            Human Resources · Administration
          </Typography>
          <Typography sx={{ fontFamily:fHead, fontWeight:700, fontSize:"1.5rem", color:T.text }}>Transfer & Separation Management</Typography>
          <Typography sx={{ fontFamily:fBody, fontSize:"0.82rem", color:T.textSub, mt:0.3 }}>
            Manage faculty internal transfers, exit workflows, and final settlement calculations.
          </Typography>
        </Box>
        <Box display="flex" gap={1.5} flexWrap="wrap" alignItems="flex-start" pt={0.5}>
          <Box sx={{ px:1.5, py:0.6, borderRadius:"8px", bgcolor:T.warningLight, border:`1px solid ${T.warning}40` }}>
            <Typography sx={{ fontFamily:fBody, fontSize:"0.74rem", fontWeight:700, color:T.warning }}>{exitRequests.filter(r=>r.status!=="Completed").length} Pending Exits</Typography>
          </Box>
          <Box sx={{ px:1.5, py:0.6, borderRadius:"8px", bgcolor:T.accentLight, border:`1px solid ${T.accent}40` }}>
            <Typography sx={{ fontFamily:fBody, fontSize:"0.74rem", fontWeight:700, color:T.accent }}>{history.length} Transfers This Month</Typography>
          </Box>
        </Box>
      </Box>

      {/* ── Stat Strip ── */}
      <Grid container spacing={2} mb={3}>
        {[
          { label:"Total Faculty",          value:147,              sub:"Across all departments",    color:T.accent,  icon:Person     },
          { label:"Transfers This Year",    value:12,               sub:"Processed successfully",    color:T.success, icon:SwapHoriz  },
          { label:"Pending Exits",          value:exitRequests.filter(r=>r.status!=="Completed").length, sub:"Awaiting closure", color:T.warning, icon:ExitToApp },
          { label:"Avg. Processing Time",   value:"3.2d",           sub:"Transfer turnaround",       color:T.textSub, icon:AccessTime  },
        ].map((s,i) => (
          <Grid item xs={6} md={3} key={i}>
            <SCard sx={{ p:2.5 }} className="fu">
              <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                <Box>
                  <SLabel>{s.label}</SLabel>
                  <Typography sx={{ fontFamily:fMono, fontWeight:700, fontSize:"1.7rem", color:s.color, lineHeight:1.1 }}>{s.value}</Typography>
                  <Typography sx={{ fontFamily:fBody, fontSize:"0.7rem", color:T.textMute, mt:0.3 }}>{s.sub}</Typography>
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
                      <Box sx={{ px:0.7, py:0.1, borderRadius:"99px", bgcolor: tabIndex===i ? T.accentLight : T.warningLight }}>
                        <Typography sx={{ fontFamily:fMono, fontSize:"0.62rem", fontWeight:700, color: tabIndex===i ? T.accent : T.warning }}>{t.count}</Typography>
                      </Box>
                    )}
                  </Box>
                }
              />
            ))}
          </Tabs>
        </Box>

        <Box p={3}>

          {/* ════ TAB 0: INTERNAL TRANSFERS ════ */}
          {tabIndex === 0 && (
            <Box className="fu">
              <Grid container spacing={3}>

                {/* LEFT: Form */}
                <Grid item xs={12} md={7}>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography sx={{ fontFamily:fHead, fontWeight:700, fontSize:"0.95rem", color:T.text }}>Initiate Faculty Transfer</Typography>
                    <Button variant="contained" size="small" startIcon={<Add sx={{fontSize:14}} />}
                      onClick={() => setTransferDialog(true)}
                      sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.76rem", textTransform:"none", borderRadius:"8px", bgcolor:T.accent, boxShadow:"none", "&:hover":{bgcolor:"#4F46E5",boxShadow:"none"} }}>
                      New Transfer
                    </Button>
                  </Box>

                  <SCard sx={{ p:3 }}>
                    <Grid container spacing={2.5}>
                      {/* Faculty selector */}
                      <Grid item xs={12}>
                        <DField label="Select Faculty Member *">
                          <DInput select value={selectedFaculty} onChange={e => setSelectedFaculty(e.target.value)}>
                            {FACULTY_LIST.map(f => (
                              <MenuItem key={f.id} value={f.id} sx={{ fontFamily:fBody, py:1 }}>
                                <Box display="flex" alignItems="center" gap={1.5}>
                                  <Avatar sx={{ width:28, height:28, bgcolor:T.accentLight, color:T.accent, fontSize:"0.68rem", fontWeight:700 }}>{f.avatar}</Avatar>
                                  <Box>
                                    <Typography sx={{ fontFamily:fBody, fontSize:"0.82rem", fontWeight:600 }}>{f.name}</Typography>
                                    <Typography sx={{ fontFamily:fBody, fontSize:"0.68rem", color:T.textMute }}>{f.dept} · {f.empId}</Typography>
                                  </Box>
                                </Box>
                              </MenuItem>
                            ))}
                          </DInput>
                        </DField>
                      </Grid>

                      {/* Faculty banner */}
                      {selected && (
                        <Grid item xs={12}>
                          <Box sx={{ display:"flex", alignItems:"center", gap:2, p:2, bgcolor:T.accentLight, border:`1px solid ${T.accent}30`, borderRadius:"10px" }}>
                            <Avatar sx={{ bgcolor:T.accent, fontWeight:700, width:42, height:42 }}>{selected.avatar}</Avatar>
                            <Box flex={1}>
                              <Typography sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.9rem", color:T.text }}>{selected.name}</Typography>
                              <Typography sx={{ fontFamily:fBody, fontSize:"0.73rem", color:T.textSub }}>
                                {selected.designation} &nbsp;·&nbsp; Joined {selected.joinDate} &nbsp;·&nbsp; {selected.empId}
                              </Typography>
                            </Box>
                          </Box>
                        </Grid>
                      )}

                      {/* Read-only current */}
                      <Grid item xs={12} sm={6}>
                        <DField label="Current Department">
                          <DInput value={selected ? selected.dept : "—"} disabled
                            sx={{ "& .MuiOutlinedInput-root":{ bgcolor:"#F9FAFB" } }} />
                        </DField>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <DField label="Current Reporting Manager">
                          <DInput value={selected ? selected.manager : "—"} disabled
                            sx={{ "& .MuiOutlinedInput-root":{ bgcolor:"#F9FAFB" } }} />
                        </DField>
                      </Grid>

                      <Grid item xs={12}>
                        <Box sx={{ display:"flex", alignItems:"center", gap:2, my:0.5 }}>
                          <Divider sx={{ flex:1, borderColor:T.border }} />
                          <Box sx={{ px:1.5, py:0.4, borderRadius:"99px", border:`1px solid ${T.border}`, bgcolor:"#F9FAFB" }}>
                            <Typography sx={{ fontFamily:fBody, fontSize:"0.72rem", fontWeight:700, color:T.textMute }}>Transfer Details</Typography>
                          </Box>
                          <Divider sx={{ flex:1, borderColor:T.border }} />
                        </Box>
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <DField label="New Department *">
                          <DInput select value={newDept} onChange={e => setNewDept(e.target.value)}>
                            {DEPARTMENTS.map(d => <MenuItem key={d} value={d} sx={{fontFamily:fBody,fontSize:"0.82rem"}}>{d}</MenuItem>)}
                          </DInput>
                        </DField>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <DField label="New Reporting Manager">
                          <DInput select value={newManager} onChange={e => setNewManager(e.target.value)}>
                            {HOD_OPTIONS.map(h => <MenuItem key={h} value={h} sx={{fontFamily:fBody,fontSize:"0.82rem"}}>{h}</MenuItem>)}
                          </DInput>
                        </DField>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <DField label="Effective Date *">
                          <DInput type="date" value={effectiveDate} onChange={e => setEffectiveDate(e.target.value)} InputLabelProps={{shrink:true}} />
                        </DField>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <DField label="New Campus Location">
                          <DInput select value={newCampus} onChange={e => setNewCampus(e.target.value)}>
                            {CAMPUS_OPTIONS.map(c => <MenuItem key={c} value={c} sx={{fontFamily:fBody,fontSize:"0.82rem"}}>{c}</MenuItem>)}
                          </DInput>
                        </DField>
                      </Grid>
                      <Grid item xs={12}>
                        <DField label="Remarks / Transfer Reason">
                          <DInput multiline rows={2} value={transferNote} onChange={e => setTransferNote(e.target.value)}
                            placeholder="e.g. Faculty requested interdepartmental move for research collaboration..." />
                        </DField>
                      </Grid>

                      {/* Handover checklist */}
                      <Grid item xs={12}>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1.2}>
                          <Typography sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.82rem", color:T.text }}>Asset Handover Checklist</Typography>
                          <Box sx={{ px:1.2, py:0.3, borderRadius:"99px", bgcolor: handoverCount === HANDOVER_ITEMS.length ? T.successLight : "#F1F5F9" }}>
                            <Typography sx={{ fontFamily:fMono, fontSize:"0.68rem", fontWeight:700, color: handoverCount === HANDOVER_ITEMS.length ? T.success : T.textMute }}>
                              {handoverCount}/{HANDOVER_ITEMS.length} confirmed
                            </Typography>
                          </Box>
                        </Box>
                        <Box sx={{ borderRadius:"10px", border:`1px solid ${T.border}`, overflow:"hidden" }}>
                          {HANDOVER_ITEMS.map((item, i) => (
                            <Box key={item.key} sx={{ px:2, py:1.1, borderBottom: i < HANDOVER_ITEMS.length-1 ? `1px solid ${T.border}` : "none", bgcolor: handover[item.key] ? T.successLight : "transparent", transition:"background 0.15s" }}>
                              <FormControlLabel
                                control={<Checkbox size="small" checked={handover[item.key]}
                                  onChange={() => setHandover(p => ({ ...p, [item.key]:!p[item.key] }))}
                                  sx={{ "& .MuiSvgIcon-root":{fontSize:17}, "&.Mui-checked":{color:T.success} }} />}
                                label={<Typography sx={{ fontFamily:fBody, fontSize:"0.8rem", color: handover[item.key] ? T.success : T.textSub, fontWeight: handover[item.key] ? 700 : 400 }}>{item.label}</Typography>}
                              />
                            </Box>
                          ))}
                        </Box>
                      </Grid>

                      <Grid item xs={12}>
                        <Button variant="contained" fullWidth startIcon={<SwapHoriz sx={{fontSize:16}} />}
                          onClick={handleTransfer}
                          sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.82rem", textTransform:"none", borderRadius:"8px", bgcolor:T.accent, boxShadow:"none", py:1.3, "&:hover":{bgcolor:"#4F46E5",boxShadow:"none"} }}>
                          Process Transfer & Notify Faculty
                        </Button>
                      </Grid>
                    </Grid>
                  </SCard>
                </Grid>

                {/* RIGHT: History + Stats */}
                <Grid item xs={12} md={5}>
                  <Typography sx={{ fontFamily:fHead, fontWeight:700, fontSize:"0.95rem", color:T.text, mb:2 }}>Recent Transfer History</Typography>
                  <Box sx={{ borderRadius:"10px", border:`1px solid ${T.border}`, overflow:"hidden", mb:2 }}>
                    <Table size="small">
                      <TableHead><TableRow><TH>Faculty</TH><TH>Movement</TH><TH>Date</TH></TableRow></TableHead>
                      <TableBody>
                        {history.map((r,i) => (
                          <TableRow key={i} className="row-h">
                            <TD sx={{ fontWeight:600, color:T.text }}>{r.name}
                              <Box sx={{ px:0.7, py:0.1, borderRadius:"5px", bgcolor:T.accentLight, display:"inline-block", ml:0.8 }}>
                                <Typography sx={{ fontFamily:fMono, fontSize:"0.6rem", fontWeight:700, color:T.accent }}>{r.type}</Typography>
                              </Box>
                            </TD>
                            <TD>
                              <Box display="flex" alignItems="center" gap={0.6}>
                                <Typography sx={{ fontFamily:fBody, fontSize:"0.73rem", color:T.textMute }}>{r.from}</Typography>
                                <ArrowForward sx={{ fontSize:11, color:T.accent }} />
                                <Typography sx={{ fontFamily:fBody, fontSize:"0.73rem", fontWeight:600, color:T.text }}>{r.to}</Typography>
                              </Box>
                            </TD>
                            <TD><Typography sx={{ fontFamily:fMono, fontSize:"0.7rem", color:T.textMute }}>{r.date}</Typography></TD>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Box>

                  <SCard sx={{ p:2.5 }}>
                    <SLabel sx={{ mb:1.5 }}>Module Summary</SLabel>
                    <RowStat label="Total Faculty"          value="147" />
                    <RowStat label="Transfers This Year"   value="12"  />
                    <RowStat label="Avg. Processing Time"  value="3.2 days" />
                    <RowStat label="Pending Approvals"     value="2" color={T.warning} />
                    <RowStat label="Inter-campus Transfers" value="4" />
                    <RowStat label="Retirements This Year" value="3" color={T.danger} />
                  </SCard>
                </Grid>
              </Grid>
            </Box>
          )}

          {/* ════ TAB 1: SEPARATION & EXITS ════ */}
          {tabIndex === 1 && (
            <Box className="fu">
              {!exitFaculty ? (
                /* Exit Queue */
                <Box>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={2.5}>
                    <Typography sx={{ fontFamily:fHead, fontWeight:700, fontSize:"0.95rem", color:T.text }}>
                      Resignation & Retirement Queue
                    </Typography>
                    <Box sx={{ px:1.5, py:0.5, borderRadius:"8px", bgcolor:T.dangerLight, border:`1px solid ${T.danger}30` }}>
                      <Typography sx={{ fontFamily:fMono, fontSize:"0.72rem", fontWeight:700, color:T.danger }}>
                        {exitRequests.filter(r=>r.status!=="Completed").length} active
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ borderRadius:"10px", border:`1px solid ${T.border}`, overflow:"hidden" }}>
                    <Table>
                      <TableHead><TableRow>
                        <TH>Faculty</TH><TH>Type</TH><TH>Last Working Day</TH><TH>Clearance</TH><TH>Status</TH><TH>Action</TH>
                      </TableRow></TableHead>
                      <TableBody>
                        {exitRequests.map(row => (
                          <TableRow key={row.id} className="row-h">
                            <TD sx={{ minWidth:180 }}>
                              <Box display="flex" alignItems="center" gap={1.2}>
                                <Avatar sx={{ width:32, height:32, bgcolor:T.accentLight, color:T.accent, fontSize:"0.68rem", fontWeight:700 }}>{row.avatar}</Avatar>
                                <Box>
                                  <Typography sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.82rem", color:T.text }}>{row.name}</Typography>
                                  <Typography sx={{ fontFamily:fBody, fontSize:"0.68rem", color:T.textMute }}>{row.dept} · {row.designation}</Typography>
                                </Box>
                              </Box>
                            </TD>
                            <TD>
                              <Box sx={{ px:1, py:0.3, borderRadius:"6px", bgcolor: row.type==="Retirement" ? T.accentLight : T.warningLight, display:"inline-block" }}>
                                <Typography sx={{ fontFamily:fBody, fontSize:"0.71rem", fontWeight:700, color: row.type==="Retirement" ? T.accent : T.warning }}>{row.type}</Typography>
                              </Box>
                            </TD>
                            <TD><Typography sx={{ fontFamily:fMono, fontSize:"0.76rem", color:T.text, fontWeight:600 }}>{row.date}</Typography></TD>
                            <TD sx={{ minWidth:150 }}>
                              <Box>
                                <Box sx={{ height:5, borderRadius:99, bgcolor:T.border, mb:0.5 }}>
                                  <Box sx={{ height:"100%", width:`${row.progress}%`, borderRadius:99, bgcolor: row.progress >= 80 ? T.success : row.progress >= 40 ? T.accent : T.warning, transition:"width 1s ease" }} />
                                </Box>
                                <Typography sx={{ fontFamily:fMono, fontSize:"0.67rem", color:T.textMute }}>{row.progress}% complete</Typography>
                              </Box>
                            </TD>
                            <TD><StatusPill status={row.status} /></TD>
                            <TD>
                              {row.status !== "Completed" ? (
                                <Button size="small" variant="contained" onClick={() => openExit(row)}
                                  sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.72rem", textTransform:"none", borderRadius:"7px", bgcolor:T.accent, boxShadow:"none", "&:hover":{bgcolor:"#4F46E5",boxShadow:"none"} }}>
                                  Process Exit
                                </Button>
                              ) : (
                                <Box sx={{ px:1.2, py:0.4, borderRadius:"7px", bgcolor:T.successLight }}>
                                  <Typography sx={{ fontFamily:fMono, fontSize:"0.68rem", fontWeight:700, color:T.success }}>✓ Closed</Typography>
                                </Box>
                              )}
                            </TD>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Box>
                </Box>
              ) : (
                /* Exit Detail */
                <Box>
                  <Button startIcon={<ArrowBack sx={{fontSize:16}} />} onClick={() => setExitFaculty(null)}
                    sx={{ fontFamily:fBody, fontWeight:600, fontSize:"0.8rem", textTransform:"none", color:T.textSub, mb:2, "&:hover":{bgcolor:T.accentLight,color:T.accent} }}>
                    Back to Queue
                  </Button>

                  {/* Faculty banner */}
                  <SCard sx={{ p:2.5, mb:3, borderLeft:`4px solid ${exitFaculty.type==="Retirement" ? T.accent : T.warning}` }}>
                    <Box display="flex" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={2}>
                      <Box display="flex" alignItems="center" gap={2}>
                        <Avatar sx={{ width:50, height:50, bgcolor:T.accentLight, color:T.accent, fontWeight:700, fontSize:"1rem" }}>{exitFaculty.avatar}</Avatar>
                        <Box>
                          <Typography sx={{ fontFamily:fHead, fontWeight:700, fontSize:"1.05rem", color:T.text }}>{exitFaculty.name}</Typography>
                          <Typography sx={{ fontFamily:fBody, fontSize:"0.76rem", color:T.textSub }}>
                            {exitFaculty.designation} · {exitFaculty.dept}
                          </Typography>
                          <Typography sx={{ fontFamily:fBody, fontSize:"0.74rem", color: exitFaculty.type==="Retirement" ? T.accent : T.warning, fontWeight:700, mt:0.3 }}>
                            {exitFaculty.type} · Last Working Day: {exitFaculty.date}
                          </Typography>
                        </Box>
                      </Box>
                      <Box textAlign="center" sx={{ p:1.5, borderRadius:"10px", bgcolor:"#F9FAFB", border:`1px solid ${T.border}`, minWidth:80 }}>
                        <Typography sx={{ fontFamily:fMono, fontWeight:700, fontSize:"1.5rem", color:T.accent, lineHeight:1 }}>{exitFaculty.progress}%</Typography>
                        <Typography sx={{ fontFamily:fBody, fontSize:"0.65rem", color:T.textMute }}>Complete</Typography>
                        <Box sx={{ mt:0.8, height:4, borderRadius:99, bgcolor:T.border }}>
                          <Box sx={{ height:"100%", width:`${exitFaculty.progress}%`, borderRadius:99, bgcolor:T.accent }} />
                        </Box>
                      </Box>
                    </Box>
                  </SCard>

                  <Grid container spacing={3}>
                    {/* LEFT: Clearance + Docs */}
                    <Grid item xs={12} md={6}>
                      <SCard sx={{ p:2.5 }}>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                          <Typography sx={{ fontFamily:fHead, fontWeight:700, fontSize:"0.9rem", color:T.text }}>
                            1 · No-Dues Clearance
                          </Typography>
                          <Box sx={{ px:1.2, py:0.3, borderRadius:"99px", bgcolor: clearanceCount === CLEARANCE_ITEMS.length ? T.successLight : "#F1F5F9" }}>
                            <Typography sx={{ fontFamily:fMono, fontSize:"0.68rem", fontWeight:700, color: clearanceCount === CLEARANCE_ITEMS.length ? T.success : T.textMute }}>
                              {clearanceCount}/{CLEARANCE_ITEMS.length}
                            </Typography>
                          </Box>
                        </Box>

                        <Stack spacing={0}>
                          {CLEARANCE_ITEMS.map((item, i) => (
                            <Box key={item.key} sx={{ px:1.5, py:1.1, borderRadius: i===0?"8px 8px 0 0" : i===CLEARANCE_ITEMS.length-1?"0 0 8px 8px":"0", border:`1px solid ${T.border}`, borderTop: i>0 ? "none" : `1px solid ${T.border}`, bgcolor: clearance[item.key] ? T.successLight : "transparent", transition:"background 0.15s" }}>
                              <FormControlLabel
                                control={<Checkbox size="small" checked={clearance[item.key]}
                                  onChange={() => setClearance(p => ({ ...p, [item.key]:!p[item.key] }))}
                                  sx={{ "& .MuiSvgIcon-root":{fontSize:17}, "&.Mui-checked":{color:T.success} }} />}
                                label={<Typography sx={{ fontFamily:fBody, fontSize:"0.8rem", color: clearance[item.key] ? T.success : T.textSub, fontWeight: clearance[item.key] ? 700 : 400 }}>{item.label}</Typography>}
                              />
                            </Box>
                          ))}
                        </Stack>

                        <Divider sx={{ borderColor:T.border, my:2 }} />

                        <Typography sx={{ fontFamily:fHead, fontWeight:700, fontSize:"0.88rem", color:T.text, mb:1.5 }}>2 · Documentation</Typography>
                        <Box display="flex" gap={1.5} flexWrap="wrap">
                          {[
                            { label:"Exit Interview",     icon:AssignmentReturned },
                            { label:"No-Dues Certificate",icon:FactCheck          },
                            { label:"Experience Letter",  icon:Description        },
                          ].map(doc => (
                            <Button key={doc.label} size="small" variant="outlined" startIcon={<doc.icon sx={{fontSize:14}} />}
                              onClick={() => toast(`${doc.label} generated.`)}
                              sx={{ fontFamily:fBody, fontWeight:600, fontSize:"0.72rem", textTransform:"none", borderRadius:"8px", borderColor:T.border, color:T.textSub, "&:hover":{borderColor:T.accent,color:T.accent} }}>
                              {doc.label}
                            </Button>
                          ))}
                        </Box>
                      </SCard>
                    </Grid>

                    {/* RIGHT: Settlement Calculator */}
                    <Grid item xs={12} md={6}>
                      <SCard sx={{ p:2.5 }}>
                        <Box display="flex" alignItems="center" gap={1} mb={2}>
                          <AccountBalance sx={{ fontSize:18, color:T.accent }} />
                          <Typography sx={{ fontFamily:fHead, fontWeight:700, fontSize:"0.9rem", color:T.text }}>3 · Final Settlement Calculator</Typography>
                        </Box>

                        <Grid container spacing={2}>
                          <Grid item xs={6}>
                            <DField label="Last Basic Pay (₹)">
                              <DInput type="number" value={basicPay} onChange={e => setBasicPay(e.target.value)}
                                InputProps={{ startAdornment:<InputAdornment position="start"><Typography sx={{fontFamily:fMono,fontSize:"0.8rem",color:T.textMute}}>₹</Typography></InputAdornment> }} />
                            </DField>
                          </Grid>
                          <Grid item xs={6}>
                            <DField label="Years of Service">
                              <DInput type="number" value={yearsService} onChange={e => setYearsService(e.target.value)} />
                            </DField>
                          </Grid>
                          <Grid item xs={12}>
                            <DField label="Earned Leave Balance (Days)">
                              <DInput type="number" value={leaveBalance} onChange={e => setLeaveBalance(e.target.value)} />
                            </DField>
                          </Grid>
                          <Grid item xs={12}>
                            <Button variant="contained" fullWidth startIcon={<Calculate sx={{fontSize:16}} />}
                              onClick={calculateSettlement}
                              sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.8rem", textTransform:"none", borderRadius:"8px", bgcolor:T.accent, boxShadow:"none", "&:hover":{bgcolor:"#4F46E5",boxShadow:"none"} }}>
                              Calculate Settlement
                            </Button>
                          </Grid>

                          {settlement && (
                            <Grid item xs={12}>
                              <Box sx={{ borderRadius:"10px", border:`1px solid ${T.border}`, overflow:"hidden" }}>
                                {[
                                  { label:"Gratuity", value:settlement.gratuity, tip:"(15 × Basic × Years) ÷ 26" },
                                  { label:"Leave Encashment", value:settlement.leaveEncash, tip:"(Basic ÷ 30) × Leave Days" },
                                ].map((row,i) => (
                                  <Box key={i} display="flex" justifyContent="space-between" alignItems="center"
                                    sx={{ px:2, py:1.3, borderBottom:`1px solid ${T.border}`, bgcolor: i%2===0 ? "transparent" : "#FAFBFD" }}>
                                    <Box display="flex" alignItems="center" gap={0.6}>
                                      <Typography sx={{ fontFamily:fBody, fontSize:"0.79rem", color:T.textSub }}>{row.label}</Typography>
                                      <Tooltip title={row.tip} arrow>
                                        <Info sx={{ fontSize:13, color:T.textMute, cursor:"help" }} />
                                      </Tooltip>
                                    </Box>
                                    <Typography sx={{ fontFamily:fMono, fontWeight:700, fontSize:"0.85rem", color:T.text }}>
                                      ₹{row.value.toLocaleString("en-IN")}
                                    </Typography>
                                  </Box>
                                ))}
                                <Box display="flex" justifyContent="space-between" alignItems="center"
                                  sx={{ px:2, py:1.5, bgcolor:T.successLight, borderTop:`2px solid ${T.success}20` }}>
                                  <Typography sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.88rem", color:T.success }}>Total Payable</Typography>
                                  <Typography sx={{ fontFamily:fMono, fontWeight:700, fontSize:"1.05rem", color:T.success }}>
                                    ₹{settlement.total.toLocaleString("en-IN")}
                                  </Typography>
                                </Box>
                              </Box>
                            </Grid>
                          )}
                        </Grid>
                      </SCard>

                      <Box display="flex" gap={1.5} mt={2} justifyContent="flex-end" flexWrap="wrap">
                        <Button variant="outlined" startIcon={<Download sx={{fontSize:14}} />}
                          onClick={() => toast("Service certificate downloaded.")}
                          sx={{ fontFamily:fBody, fontWeight:600, fontSize:"0.76rem", textTransform:"none", borderRadius:"8px", borderColor:T.border, color:T.textSub, "&:hover":{borderColor:T.accent,color:T.accent} }}>
                          Service Certificate
                        </Button>
                        <Button variant="contained" startIcon={<Lock sx={{fontSize:14}} />}
                          onClick={() => {
                            if (clearanceCount < CLEARANCE_ITEMS.length) { toast("Complete all clearance items before finalizing.", "error"); return; }
                            setFinalizeDialog(true);
                          }}
                          sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.76rem", textTransform:"none", borderRadius:"8px", bgcolor:T.success, boxShadow:"none", "&:hover":{bgcolor:"#059669",boxShadow:"none"} }}>
                          Finalize & Close Exit
                        </Button>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              )}
            </Box>
          )}

        </Box>
      </SCard>

      {/* ══════════════════════════════════════
          FINALIZE EXIT DIALOG
      ══════════════════════════════════════ */}
      <Dialog open={finalizeDialog} onClose={() => setFinalizeDialog(false)} maxWidth="xs" fullWidth
        PaperProps={{ sx:{ borderRadius:"16px", border:`1px solid ${T.border}` } }}>
        <DialogTitle sx={{ fontFamily:fHead, fontWeight:700, fontSize:"1rem", color:T.text, borderBottom:`1px solid ${T.border}`, bgcolor:"#FAFBFD", pb:2 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            Confirm Exit Closure
            <IconButton size="small" onClick={() => setFinalizeDialog(false)} sx={{ bgcolor:"#F1F5F9", borderRadius:"8px" }}><Close fontSize="small" /></IconButton>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ px:3, pt:3, pb:2 }}>
          <Stack spacing={2}>
            <Box sx={{ p:2, borderRadius:"10px", bgcolor:T.accentLight, border:`1px solid ${T.accent}30`, textAlign:"center" }}>
              <Typography sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.88rem", color:T.text }}>{exitFaculty?.name}</Typography>
              <Typography sx={{ fontFamily:fMono, fontSize:"0.72rem", color:T.textMute }}>{exitFaculty?.type} · Last Day: {exitFaculty?.date}</Typography>
            </Box>
            {settlement && (
              <Box sx={{ p:2, borderRadius:"10px", bgcolor:T.successLight, border:`1px solid ${T.success}30`, textAlign:"center" }}>
                <Typography sx={{ fontFamily:fBody, fontSize:"0.76rem", color:T.textSub }}>Final Settlement</Typography>
                <Typography sx={{ fontFamily:fMono, fontWeight:700, fontSize:"1.2rem", color:T.success }}>₹{settlement.total.toLocaleString("en-IN")}</Typography>
              </Box>
            )}
            <Alert severity="warning" sx={{ borderRadius:"8px", fontFamily:fBody, fontSize:"0.76rem" }}>
              This will close the exit record. Service certificate and settlement letter will be auto-generated and emailed.
            </Alert>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px:3, pb:3, borderTop:`1px solid ${T.border}`, pt:2, bgcolor:"#FAFBFD", gap:1 }}>
          <Button onClick={() => setFinalizeDialog(false)} variant="outlined"
            sx={{ fontFamily:fBody, fontWeight:600, fontSize:"0.8rem", textTransform:"none", borderRadius:"8px", borderColor:T.border, color:T.textSub }}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleFinalizeExit} startIcon={<CheckCircle sx={{fontSize:15}} />}
            sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.8rem", textTransform:"none", borderRadius:"8px", bgcolor:T.success, boxShadow:"none", "&:hover":{bgcolor:"#059669",boxShadow:"none"} }}>
            Confirm & Close
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

export default TransfersView;