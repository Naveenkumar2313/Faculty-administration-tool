import React, { useState } from "react";
import {
  Box, Grid, Typography, Button, Table, TableBody, TableCell,
  TableHead, TableRow, Checkbox, IconButton, Chip,
  Tooltip, TextField, Dialog, DialogTitle, DialogContent, DialogActions,
  Tabs, Tab, LinearProgress, List, ListItem, ListItemText, ListItemIcon,
  Avatar, Divider, Alert, Stack, InputAdornment, Collapse, Snackbar,
  MenuItem
} from "@mui/material";
import {
  CheckCircle, Cancel, Description, DoneAll,
  AssignmentTurnedIn, Warning, History, UploadFile,
  Analytics, AutoAwesome, Visibility, Person, FactCheck,
  Search, Download, Close, Send, TrendingUp, TrendingDown,
  ErrorOutline, InfoOutlined, FilterList, CheckCircleOutline,
  RadioButtonUnchecked, AccessTime, HourglassEmpty, Schedule
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
    .fu  { animation: fadeUp 0.3s ease both; }
    .row-h:hover { background:#F9FAFB !important; transition:background 0.15s; }
    .row-sel { background:#EEF2FF !important; }
  `}</style>
);

/* ── Mock Data ── */
const REQUESTS_INIT = [
  { id:1, name:"Dr. Sarah Smith",   avatar:"SS", dept:"CSE",   date:"2026-02-01", reason:"Forgot ID Card",        doc:"email_approval.pdf",    hodStatus:"Approved", adminStatus:"Pending", leaveBalance:12, isHoliday:false, isDuplicate:false, ocrData:"Date: 01-Feb-2026 | ID: 998877 | Verified by: HOD Office" },
  { id:2, name:"Prof. Rajan Kumar", avatar:"RK", dept:"Mech",  date:"2026-02-02", reason:"Biometric Failure",     doc:"log_screenshot.png",    hodStatus:"Pending",  adminStatus:"Pending", leaveBalance:5,  isHoliday:false, isDuplicate:true,  ocrData:"Error Code: BIO-FAIL-01 | Device: Bio-Gate-2" },
  { id:3, name:"Dr. Emily Davis",   avatar:"ED", dept:"Civil", date:"2026-01-26", reason:"On Duty (Conference)",  doc:"conference_invite.pdf", hodStatus:"Approved", adminStatus:"Pending", leaveBalance:8,  isHoliday:true,  isDuplicate:false, ocrData:"Conf Date: 26-Jan-2026 | Venue: IITM Chennai" },
  { id:4, name:"Ms. Kavya Sharma",  avatar:"KS", dept:"ECE",   date:"2026-02-05", reason:"Medical Emergency",     doc:"hospital_receipt.pdf",  hodStatus:"Approved", adminStatus:"Pending", leaveBalance:0,  isHoliday:false, isDuplicate:false, ocrData:"Hospital: Apollo, Bangalore | Date: 05-Feb-2026" },
];

const HISTORY_INIT = [
  { id:101, name:"Mr. John Doe",   dept:"CSE",  date:"2026-01-15", reason:"Sick Leave",         status:"Approved", actionBy:"Admin",   note:"Document verified" },
  { id:102, name:"Ms. Priya Roy",  dept:"ECE",  date:"2026-01-10", reason:"Traffic Delay",       status:"Rejected", actionBy:"HOD",     note:"Insufficient proof — traffic not acceptable reason" },
  { id:103, name:"Dr. N. Sharma",  dept:"Mech", date:"2026-01-08", reason:"On Duty (Workshop)",  status:"Approved", actionBy:"Admin",   note:"OD letter verified" },
];

const DEPT_STATS = [
  { dept:"CSE",   requests:12, approved:9,  rejected:2, pending:1 },
  { dept:"ECE",   requests:8,  approved:6,  rejected:1, pending:1 },
  { dept:"Mech",  requests:7,  approved:4,  rejected:2, pending:1 },
  { dept:"Civil", requests:5,  approved:3,  rejected:2, pending:0 },
];

const REJECTION_REASONS = [
  { label:"Insufficient Proof",  pct:45 },
  { label:"Duplicate Request",   pct:30 },
  { label:"Invalid Reason",      pct:15 },
  { label:"Holiday Mismatch",    pct:10 },
];

const FREQUENT_REQUESTORS = [
  { name:"Prof. Rajan Kumar", dept:"Mech", count:5 },
  { name:"Dr. Emily Davis",   dept:"Civil",count:4 },
  { name:"Ms. Kavya Sharma",  dept:"ECE",  count:3 },
];

/* ── Helpers ── */
const SCard = ({ children, sx={}, ...p }) => (
  <Box sx={{ background:T.surface, border:`1px solid ${T.border}`, borderRadius:"14px", ...sx }} {...p}>{children}</Box>
);

const SLabel = ({ children, sx={} }) => (
  <Typography sx={{ fontFamily:fBody, fontSize:"0.67rem", fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase", color:T.textMute, mb:0.5, ...sx }}>{children}</Typography>
);

const TH = ({ children, padding }) => (
  <TableCell padding={padding} sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.68rem", letterSpacing:"0.06em", textTransform:"uppercase", color:T.textMute, borderBottom:`1px solid ${T.border}`, py:1.5, bgcolor:"#F9FAFB", whiteSpace:"nowrap" }}>{children}</TableCell>
);
const TD = ({ children, sx={}, padding }) => (
  <TableCell padding={padding} sx={{ fontFamily:fBody, fontSize:"0.81rem", color:T.textSub, borderBottom:`1px solid ${T.border}`, py:1.6, ...sx }}>{children}</TableCell>
);

const StatusPill = ({ status }) => {
  const map = {
    Approved:            { color:T.success, bg:T.successLight },
    "Auto-Approved (OD)":{ color:T.success, bg:T.successLight },
    Rejected:            { color:T.danger,  bg:T.dangerLight  },
    Pending:             { color:T.warning, bg:T.warningLight },
    "HOD Approved":      { color:T.success, bg:T.successLight },
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

const getWarnings = (req) => {
  const w = [];
  if (req.isHoliday)    w.push({ label:"Date is a Public Holiday", color:T.danger  });
  if (req.isDuplicate)  w.push({ label:"Duplicate Request",         color:T.danger  });
  if (req.leaveBalance < 1) w.push({ label:"Zero Leave Balance",   color:T.warning });
  return w;
};

/* ════════════════════════════════
   MAIN COMPONENT
════════════════════════════════ */
const RegularizationView = () => {
  const [tabIndex, setTabIndex]     = useState(0);
  const [requests, setRequests]     = useState(REQUESTS_INIT);
  const [history, setHistory]       = useState(HISTORY_INIT);
  const [selectedIds, setSelectedIds] = useState([]);

  /* Dialogs */
  const [rejectDialog, setRejectDialog]   = useState(null);
  const [rejectReason, setRejectReason]   = useState("");
  const [docDialog, setDocDialog]         = useState(null);
  const [bulkFile, setBulkFile]           = useState(null);
  const [histSearch, setHistSearch]       = useState("");
  const [histStatus, setHistStatus]       = useState("All");

  const [snack, setSnack] = useState({ open:false, msg:"", severity:"success" });
  const toast = (msg, severity="success") => setSnack({ open:true, msg, severity });

  /* Derived */
  const pending  = requests.filter(r => r.adminStatus === "Pending");
  const done     = requests.filter(r => r.adminStatus !== "Pending");
  const allPendingIds = pending.map(r => r.id);

  const addHistory = (req, status, note="") => {
    setHistory(prev => [{ id:Date.now(), name:req.name, dept:req.dept, date:req.date, reason:req.reason, status, actionBy:"Admin", note }, ...prev]);
  };

  /* Handlers */
  const handleSelectAll = (e) => setSelectedIds(e.target.checked ? allPendingIds : []);
  const handleSelectOne = (id) => setSelectedIds(prev => prev.includes(id) ? prev.filter(x=>x!==id) : [...prev, id]);

  const approve = (id) => {
    const req = requests.find(r => r.id === id);
    setRequests(prev => prev.map(r => r.id === id ? { ...r, adminStatus:"Approved", status:"Approved" } : r));
    addHistory(req, "Approved");
    setDocDialog(null);
    toast(`Request by ${req.name} approved.`);
  };

  const bulkApprove = () => {
    selectedIds.forEach(id => {
      const req = requests.find(r => r.id === id);
      addHistory(req, "Approved", "Bulk approved");
    });
    setRequests(prev => prev.map(r => selectedIds.includes(r.id) ? { ...r, adminStatus:"Approved", status:"Approved" } : r));
    toast(`${selectedIds.length} request${selectedIds.length > 1 ? "s" : ""} approved.`);
    setSelectedIds([]);
  };

  const autoApproveOD = () => {
    let count = 0;
    setRequests(prev => prev.map(r => {
      if (r.reason.toLowerCase().includes("on duty") && r.adminStatus === "Pending") {
        count++;
        addHistory(r, "Auto-Approved (OD)", "OD auto-approved by rule");
        return { ...r, adminStatus:"Approved", status:"Auto-Approved (OD)" };
      }
      return r;
    }));
    toast(`${count} OD request${count !== 1 ? "s" : ""} auto-approved.`);
  };

  const confirmReject = () => {
    if (!rejectReason.trim()) { toast("Please enter a rejection reason.", "error"); return; }
    const req = requests.find(r => r.id === rejectDialog.id);
    setRequests(prev => prev.map(r => r.id === rejectDialog.id ? { ...r, adminStatus:"Rejected", status:"Rejected" } : r));
    addHistory(req, "Rejected", rejectReason);
    setRejectDialog(null); setRejectReason("");
    toast("Request rejected. Faculty will be notified.");
  };

  const filteredHistory = history.filter(h => {
    if (histStatus !== "All" && h.status !== histStatus) return false;
    if (histSearch && !h.name.toLowerCase().includes(histSearch.toLowerCase()) && !h.reason.toLowerCase().includes(histSearch.toLowerCase())) return false;
    return true;
  });

  const tabs = [
    { label:"Pending Requests",   icon:AssignmentTurnedIn, count:pending.length },
    { label:"Request History",    icon:History,            count:0              },
    { label:"Bulk Upload",        icon:UploadFile,         count:0              },
    { label:"Analytics",          icon:Analytics,          count:0              },
  ];

  return (
    <Box sx={{ p:3, bgcolor:T.bg, minHeight:"100vh", fontFamily:fBody }}>
      <Fonts />

      {/* ── Header ── */}
      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3}>
        <Box>
          <Typography sx={{ fontFamily:fHead, fontWeight:700, fontSize:"1.5rem", color:T.text }}>Attendance Regularization</Typography>
          <Typography sx={{ fontFamily:fBody, fontSize:"0.82rem", color:T.textSub, mt:0.4 }}>
            Admin View &nbsp;·&nbsp; Review, verify, and process faculty attendance correction requests
          </Typography>
        </Box>
        <Button size="small" variant="outlined" startIcon={<Download sx={{fontSize:15}} />}
          onClick={() => toast("Regularization report exported.")}
          sx={{ fontFamily:fBody, fontWeight:600, fontSize:"0.76rem", textTransform:"none", borderRadius:"8px", borderColor:T.border, color:T.textSub, "&:hover":{borderColor:T.accent,color:T.accent} }}>
          Export Report
        </Button>
      </Box>

      {/* ── Stat Strip ── */}
      <Grid container spacing={2} mb={3}>
        {[
          { label:"Pending Review",     value:pending.length,                                   sub:"Awaiting admin action",  color:T.warning, icon:HourglassEmpty     },
          { label:"Approved This Month",value:history.filter(h=>h.status==="Approved").length,  sub:"Regularized successfully",color:T.success,icon:CheckCircle       },
          { label:"Rejected",           value:history.filter(h=>h.status==="Rejected").length,  sub:"This month",             color:T.danger,  icon:Cancel             },
          { label:"Auto-Approved OD",   value:requests.filter(r=>r.status?.includes("Auto")).length, sub:"Via OD rule",      color:T.accent,  icon:AutoAwesome        },
        ].map((s,i) => (
          <Grid item xs={6} md={3} key={i}>
            <SCard sx={{ p:2.5 }} className="fu">
              <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                <Box>
                  <SLabel>{s.label}</SLabel>
                  <Typography sx={{ fontFamily:fMono, fontWeight:700, fontSize:"1.7rem", color:s.color, lineHeight:1.1 }}>{s.value}</Typography>
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

          {/* ════ TAB 0: PENDING REQUESTS ════ */}
          {tabIndex === 0 && (
            <Box className="fu">
              {/* Toolbar */}
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2.5} flexWrap="wrap" gap={1.5}>
                <Box display="flex" gap={1.5} flexWrap="wrap">
                  <Button variant="contained" size="small" startIcon={<DoneAll sx={{fontSize:15}} />}
                    disabled={selectedIds.length === 0} onClick={bulkApprove}
                    sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.76rem", textTransform:"none", borderRadius:"8px", bgcolor:T.success, boxShadow:"none", "&:hover":{bgcolor:"#059669",boxShadow:"none"}, "&.Mui-disabled":{opacity:0.45} }}>
                    Approve Selected {selectedIds.length > 0 && `(${selectedIds.length})`}
                  </Button>
                  <Button variant="outlined" size="small" startIcon={<AutoAwesome sx={{fontSize:15}} />}
                    onClick={autoApproveOD}
                    sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.76rem", textTransform:"none", borderRadius:"8px", color:T.accent, borderColor:`${T.accent}60`, "&:hover":{borderColor:T.accent,bgcolor:T.accentLight} }}>
                    Auto-Approve OD Cases
                  </Button>
                </Box>
                <Box sx={{ px:1.5, py:0.5, borderRadius:"8px", bgcolor:T.warningLight, border:`1px solid ${T.warning}40` }}>
                  <Typography sx={{ fontFamily:fMono, fontSize:"0.72rem", fontWeight:700, color:T.warning }}>{pending.length} pending</Typography>
                </Box>
              </Box>

              {pending.length === 0 ? (
                <Box textAlign="center" py={6}>
                  <CheckCircle sx={{ fontSize:56, color:T.border, mb:2 }} />
                  <Typography sx={{ fontFamily:fBody, fontSize:"0.9rem", color:T.textMute, fontWeight:600 }}>All requests processed!</Typography>
                  <Typography sx={{ fontFamily:fBody, fontSize:"0.78rem", color:T.textMute }}>No pending regularizations at this time.</Typography>
                </Box>
              ) : (
                <Box sx={{ borderRadius:"10px", border:`1px solid ${T.border}`, overflow:"hidden" }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TH padding="checkbox">
                          <Checkbox size="small"
                            checked={selectedIds.length === pending.length && pending.length > 0}
                            indeterminate={selectedIds.length > 0 && selectedIds.length < pending.length}
                            onChange={handleSelectAll}
                            sx={{ "& .MuiSvgIcon-root":{ fontSize:18 }, "&.Mui-checked":{ color:T.accent }, "&.MuiCheckbox-indeterminate":{ color:T.accent } }} />
                        </TH>
                        <TH>Faculty</TH>
                        <TH>Request Details</TH>
                        <TH>Smart Validation</TH>
                        <TH>Workflow</TH>
                        <TH>Document</TH>
                        <TH>Actions</TH>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {pending.map(row => {
                        const warnings = getWarnings(row);
                        const isSelected = selectedIds.includes(row.id);
                        return (
                          <TableRow key={row.id} className={isSelected ? "row-sel" : "row-h"}>
                            <TD padding="checkbox">
                              <Checkbox size="small" checked={isSelected} onChange={() => handleSelectOne(row.id)}
                                sx={{ "& .MuiSvgIcon-root":{ fontSize:18 }, "&.Mui-checked":{ color:T.accent } }} />
                            </TD>
                            <TD sx={{ minWidth:160 }}>
                              <Box display="flex" alignItems="center" gap={1.2}>
                                <Avatar sx={{ width:30, height:30, fontSize:"0.68rem", fontWeight:700, bgcolor:T.accentLight, color:T.accent }}>{row.avatar}</Avatar>
                                <Box>
                                  <Typography sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.82rem", color:T.text }}>{row.name}</Typography>
                                  <Typography sx={{ fontFamily:fBody, fontSize:"0.68rem", color:T.textMute }}>{row.dept} &nbsp;·&nbsp; <span style={{fontFamily:fMono}}>{row.leaveBalance}d balance</span></Typography>
                                </Box>
                              </Box>
                            </TD>
                            <TD sx={{ minWidth:150 }}>
                              <Typography sx={{ fontFamily:fMono, fontSize:"0.74rem", color:T.accent, fontWeight:600 }}>{row.date}</Typography>
                              <Typography sx={{ fontFamily:fBody, fontSize:"0.76rem", color:T.textSub, mt:0.3 }}>{row.reason}</Typography>
                            </TD>
                            <TD sx={{ minWidth:180 }}>
                              {warnings.length === 0 ? (
                                <Box display="flex" alignItems="center" gap={0.6} sx={{ px:1.2, py:0.35, borderRadius:"99px", bgcolor:T.successLight, width:"fit-content" }}>
                                  <CheckCircle sx={{ fontSize:12, color:T.success }} />
                                  <Typography sx={{ fontFamily:fBody, fontSize:"0.71rem", fontWeight:700, color:T.success }}>All Clear</Typography>
                                </Box>
                              ) : (
                                <Stack spacing={0.5}>
                                  {warnings.map((w,i) => (
                                    <Box key={i} display="flex" alignItems="center" gap={0.6} sx={{ px:1, py:0.3, borderRadius:"6px", bgcolor:`${w.color}15`, border:`1px solid ${w.color}30`, width:"fit-content" }}>
                                      <Warning sx={{ fontSize:11, color:w.color }} />
                                      <Typography sx={{ fontFamily:fBody, fontSize:"0.68rem", fontWeight:700, color:w.color }}>{w.label}</Typography>
                                    </Box>
                                  ))}
                                </Stack>
                              )}
                            </TD>
                            <TD sx={{ minWidth:140 }}>
                              <Stack spacing={0.6}>
                                {[
                                  { label:`HOD: ${row.hodStatus}`, status:row.hodStatus },
                                  { label:"Admin: Pending",        status:"Pending"     },
                                ].map((step,i) => (
                                  <StatusPill key={i} status={step.status === "Approved" ? "HOD Approved" : step.status} />
                                ))}
                              </Stack>
                            </TD>
                            <TD>
                              <Button size="small" startIcon={<Visibility sx={{fontSize:13}} />}
                                onClick={() => setDocDialog(row)}
                                sx={{ fontFamily:fBody, fontWeight:600, fontSize:"0.72rem", textTransform:"none", borderRadius:"7px", color:T.accent, border:`1px solid ${T.accent}40`, px:1.2, py:0.5, "&:hover":{bgcolor:T.accentLight} }}>
                                Preview
                              </Button>
                              <Typography sx={{ fontFamily:fBody, fontSize:"0.65rem", color:T.textMute, mt:0.4 }}>{row.doc}</Typography>
                            </TD>
                            <TD>
                              <Box display="flex" gap={0.5}>
                                <Tooltip title="Approve">
                                  <IconButton size="small"
                                    sx={{ bgcolor:T.successLight, color:T.success, borderRadius:"8px", "&:hover":{bgcolor:"#D1FAE5"} }}
                                    onClick={() => approve(row.id)}>
                                    <CheckCircle sx={{ fontSize:17 }} />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Reject">
                                  <IconButton size="small"
                                    sx={{ bgcolor:T.dangerLight, color:T.danger, borderRadius:"8px", "&:hover":{bgcolor:"#FEE2E2"} }}
                                    onClick={() => setRejectDialog(row)}>
                                    <Cancel sx={{ fontSize:17 }} />
                                  </IconButton>
                                </Tooltip>
                              </Box>
                            </TD>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </Box>
              )}

              {/* Processed this session */}
              {done.length > 0 && (
                <Box mt={3}>
                  <SLabel sx={{ mb:1.5 }}>Processed in This Session</SLabel>
                  <Box sx={{ borderRadius:"10px", border:`1px solid ${T.border}`, overflow:"hidden" }}>
                    <Table size="small">
                      <TableHead><TableRow><TH>Faculty</TH><TH>Date</TH><TH>Reason</TH><TH>Final Status</TH></TableRow></TableHead>
                      <TableBody>
                        {done.map(r => (
                          <TableRow key={r.id} className="row-h" sx={{ opacity:0.7 }}>
                            <TD sx={{ fontWeight:600, color:T.text }}>{r.name}</TD>
                            <TD><Typography sx={{ fontFamily:fMono, fontSize:"0.74rem" }}>{r.date}</Typography></TD>
                            <TD>{r.reason}</TD>
                            <TD><StatusPill status={r.status} /></TD>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Box>
                </Box>
              )}
            </Box>
          )}

          {/* ════ TAB 1: HISTORY ════ */}
          {tabIndex === 1 && (
            <Box className="fu">
              <Box display="flex" gap={1.5} mb={2.5} flexWrap="wrap">
                <TextField size="small" placeholder="Search by name or reason..." value={histSearch} onChange={e=>setHistSearch(e.target.value)}
                  InputProps={{ startAdornment:<InputAdornment position="start"><Search sx={{fontSize:15,color:T.textMute}} /></InputAdornment> }}
                  sx={{ width:240, "& .MuiOutlinedInput-root":{ borderRadius:"8px", fontFamily:fBody, fontSize:"0.8rem", "& fieldset":{borderColor:T.border}, "&.Mui-focused fieldset":{borderColor:T.accent} } }} />
                <DInput select value={histStatus} onChange={e=>setHistStatus(e.target.value)} sx={{ width:140 }}>
                  {["All","Approved","Rejected","Auto-Approved (OD)"].map(s=><MenuItem key={s} value={s} sx={{fontFamily:fBody,fontSize:"0.8rem"}}>{s}</MenuItem>)}
                </DInput>
                <Typography sx={{ fontFamily:fBody, fontSize:"0.76rem", color:T.textMute, ml:"auto", alignSelf:"center" }}>
                  {filteredHistory.length} records
                </Typography>
              </Box>

              <Box sx={{ borderRadius:"10px", border:`1px solid ${T.border}`, overflow:"hidden" }}>
                <Table>
                  <TableHead><TableRow>
                    <TH>Faculty</TH><TH>Date</TH><TH>Reason</TH><TH>Status</TH><TH>Action By</TH><TH>Notes</TH>
                  </TableRow></TableHead>
                  <TableBody>
                    {filteredHistory.map(row => (
                      <TableRow key={row.id} className="row-h">
                        <TD sx={{ minWidth:140 }}>
                          <Typography sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.82rem", color:T.text }}>{row.name}</Typography>
                          <Typography sx={{ fontFamily:fBody, fontSize:"0.68rem", color:T.textMute }}>{row.dept}</Typography>
                        </TD>
                        <TD><Typography sx={{ fontFamily:fMono, fontSize:"0.76rem" }}>{row.date}</Typography></TD>
                        <TD>{row.reason}</TD>
                        <TD><StatusPill status={row.status} /></TD>
                        <TD>
                          <Box sx={{ px:0.9, py:0.2, borderRadius:"5px", bgcolor:T.accentLight, display:"inline-block" }}>
                            <Typography sx={{ fontFamily:fMono, fontSize:"0.64rem", fontWeight:700, color:T.accent }}>{row.actionBy}</Typography>
                          </Box>
                        </TD>
                        <TD sx={{ maxWidth:180 }}>
                          <Typography sx={{ fontFamily:fBody, fontSize:"0.74rem", color:T.textMute }}>{row.note || "—"}</Typography>
                        </TD>
                      </TableRow>
                    ))}
                    {filteredHistory.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} sx={{ textAlign:"center", py:5, fontFamily:fBody, color:T.textMute }}>No records match your search.</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </Box>
            </Box>
          )}

          {/* ════ TAB 2: BULK UPLOAD ════ */}
          {tabIndex === 2 && (
            <Box className="fu">
              <Grid container spacing={3} justifyContent="center">
                <Grid item xs={12} md={7}>
                  <Box sx={{ border:`2px dashed ${bulkFile ? T.success : T.border}`, borderRadius:"14px", p:5, textAlign:"center", bgcolor: bulkFile ? T.successLight : "#FAFBFD", transition:"all 0.2s" }}>
                    {bulkFile ? (
                      <>
                        <CheckCircle sx={{ fontSize:52, color:T.success, mb:1.5 }} />
                        <Typography sx={{ fontFamily:fHead, fontWeight:700, fontSize:"1rem", color:T.text, mb:0.5 }}>File Ready</Typography>
                        <Typography sx={{ fontFamily:fMono, fontSize:"0.78rem", color:T.textSub, mb:2.5 }}>{bulkFile.name}</Typography>
                        <Box display="flex" gap={1.5} justifyContent="center">
                          <Button variant="contained" startIcon={<Send sx={{fontSize:15}} />}
                            onClick={() => { toast(`Bulk file "${bulkFile.name}" processed. ${Math.ceil(Math.random()*10)+2} entries queued.`); setBulkFile(null); }}
                            sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.8rem", textTransform:"none", borderRadius:"8px", bgcolor:T.success, boxShadow:"none", "&:hover":{bgcolor:"#059669",boxShadow:"none"} }}>
                            Process File
                          </Button>
                          <Button variant="outlined" onClick={() => setBulkFile(null)}
                            sx={{ fontFamily:fBody, fontWeight:600, fontSize:"0.8rem", textTransform:"none", borderRadius:"8px", borderColor:T.border, color:T.textSub }}>
                            Remove
                          </Button>
                        </Box>
                      </>
                    ) : (
                      <>
                        <UploadFile sx={{ fontSize:52, color:T.textMute, mb:1.5 }} />
                        <Typography sx={{ fontFamily:fHead, fontWeight:700, fontSize:"1rem", color:T.text, mb:0.5 }}>Bulk Regularization Upload</Typography>
                        <Typography sx={{ fontFamily:fBody, fontSize:"0.78rem", color:T.textMute, mb:3 }}>
                          Upload a CSV or Excel file with Faculty ID, Date, and Reason columns.<br/>Maximum 500 rows per upload.
                        </Typography>
                        <Button variant="contained" component="label"
                          sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.8rem", textTransform:"none", borderRadius:"8px", bgcolor:T.accent, boxShadow:"none", "&:hover":{bgcolor:"#4F46E5",boxShadow:"none"} }}>
                          Select File
                          <HiddenInput type="file" accept=".csv,.xlsx,.xls" onChange={e => setBulkFile(e.target.files[0])} />
                        </Button>
                      </>
                    )}
                  </Box>

                  <Box mt={3} sx={{ p:2.5, borderRadius:"10px", border:`1px solid ${T.border}`, bgcolor:T.surface }}>
                    <SLabel sx={{ mb:1.5 }}>Required CSV Columns</SLabel>
                    {[
                      { col:"faculty_id",   desc:"Official Faculty ID (e.g., FAC-0041)"           },
                      { col:"date",         desc:"Date of absence (format: YYYY-MM-DD)"            },
                      { col:"reason",       desc:"Reason code (FORGOT_ID / OD / BIOMETRIC / OTHER)"},
                      { col:"doc_filename", desc:"Supporting document filename (optional)"         },
                    ].map(c => (
                      <Box key={c.col} display="flex" gap={2} mb={1} alignItems="flex-start">
                        <Box sx={{ px:1, py:0.2, borderRadius:"5px", bgcolor:T.accentLight, flexShrink:0 }}>
                          <Typography sx={{ fontFamily:fMono, fontSize:"0.68rem", fontWeight:700, color:T.accent }}>{c.col}</Typography>
                        </Box>
                        <Typography sx={{ fontFamily:fBody, fontSize:"0.74rem", color:T.textMute }}>{c.desc}</Typography>
                      </Box>
                    ))}
                    <Button size="small" startIcon={<Download sx={{fontSize:13}} />}
                      onClick={() => toast("Template CSV downloaded.")}
                      sx={{ mt:1, fontFamily:fBody, fontWeight:600, fontSize:"0.74rem", textTransform:"none", color:T.accent, p:0, "&:hover":{bgcolor:"transparent",textDecoration:"underline"} }}>
                      Download Template CSV
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          )}

          {/* ════ TAB 3: ANALYTICS ════ */}
          {tabIndex === 3 && (
            <Box className="fu">
              <Grid container spacing={2.5}>
                {/* Frequent requestors */}
                <Grid item xs={12} md={4}>
                  <SCard sx={{ p:2.5, height:"100%" }}>
                    <SLabel sx={{ mb:1.5 }}>Frequent Requestors</SLabel>
                    <Stack spacing={1.5}>
                      {FREQUENT_REQUESTORS.map((f,i) => (
                        <Box key={i} display="flex" alignItems="center" gap={1.5}>
                          <Box sx={{ width:26, height:26, borderRadius:"50%", bgcolor:T.accentLight, color:T.accent, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                            <Typography sx={{ fontFamily:fMono, fontSize:"0.68rem", fontWeight:700 }}>{i+1}</Typography>
                          </Box>
                          <Box flex={1}>
                            <Typography sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.82rem", color:T.text }}>{f.name}</Typography>
                            <Typography sx={{ fontFamily:fBody, fontSize:"0.7rem", color:T.textMute }}>{f.dept}</Typography>
                          </Box>
                          <Box sx={{ px:1, py:0.2, borderRadius:"6px", bgcolor:T.warningLight }}>
                            <Typography sx={{ fontFamily:fMono, fontSize:"0.68rem", fontWeight:700, color:T.warning }}>{f.count} req</Typography>
                          </Box>
                        </Box>
                      ))}
                    </Stack>
                  </SCard>
                </Grid>

                {/* Rejection breakdown */}
                <Grid item xs={12} md={4}>
                  <SCard sx={{ p:2.5, height:"100%" }}>
                    <SLabel sx={{ mb:1.5 }}>Top Rejection Reasons</SLabel>
                    <Stack spacing={1.8}>
                      {REJECTION_REASONS.map((r,i) => (
                        <Box key={i}>
                          <Box display="flex" justifyContent="space-between" mb={0.6}>
                            <Typography sx={{ fontFamily:fBody, fontSize:"0.78rem", color:T.textSub, fontWeight:500 }}>{r.label}</Typography>
                            <Typography sx={{ fontFamily:fMono, fontSize:"0.74rem", fontWeight:700, color:T.danger }}>{r.pct}%</Typography>
                          </Box>
                          <Box sx={{ height:5, borderRadius:99, bgcolor:T.border }}>
                            <Box sx={{ height:"100%", width:`${r.pct}%`, borderRadius:99, bgcolor:T.danger, transition:"width 1s ease" }} />
                          </Box>
                        </Box>
                      ))}
                    </Stack>
                  </SCard>
                </Grid>

                {/* Dept stats */}
                <Grid item xs={12} md={4}>
                  <SCard sx={{ p:2.5, height:"100%" }}>
                    <SLabel sx={{ mb:1.5 }}>Department-wise Requests</SLabel>
                    <Stack spacing={1.5}>
                      {DEPT_STATS.map((d,i) => (
                        <Box key={i}>
                          <Box display="flex" justifyContent="space-between" mb={0.5}>
                            <Typography sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.78rem", color:T.text }}>{d.dept}</Typography>
                            <Typography sx={{ fontFamily:fMono, fontSize:"0.7rem", color:T.textMute }}>{d.requests} total</Typography>
                          </Box>
                          <Box sx={{ height:5, borderRadius:99, bgcolor:T.border, overflow:"hidden" }}>
                            <Box sx={{ height:"100%", display:"flex" }}>
                              <Box sx={{ width:`${(d.approved/d.requests)*100}%`, bgcolor:T.success }} />
                              <Box sx={{ width:`${(d.rejected/d.requests)*100}%`, bgcolor:T.danger }} />
                              <Box sx={{ width:`${(d.pending/d.requests)*100}%`, bgcolor:T.warning }} />
                            </Box>
                          </Box>
                          <Box display="flex" gap={1.5} mt={0.5}>
                            {[{l:"Approved",v:d.approved,c:T.success},{l:"Rejected",v:d.rejected,c:T.danger},{l:"Pending",v:d.pending,c:T.warning}].map(s=>(
                              <Typography key={s.l} sx={{ fontFamily:fBody, fontSize:"0.64rem", color:s.c, fontWeight:600 }}>{s.v} {s.l}</Typography>
                            ))}
                          </Box>
                        </Box>
                      ))}
                    </Stack>
                  </SCard>
                </Grid>

                {/* Summary alert */}
                <Grid item xs={12}>
                  <Alert severity="info" icon={<InfoOutlined sx={{fontSize:18}} />}
                    sx={{ borderRadius:"10px", fontFamily:fBody, fontSize:"0.78rem", border:`1px solid ${T.accent}30` }}>
                    <strong>Insight:</strong> Biometric failures account for 38% of all regularization requests this month. Consider scheduling a maintenance check for aging devices (Bio-Gate-3 last serviced 11 months ago).
                  </Alert>
                </Grid>
              </Grid>
            </Box>
          )}

        </Box>
      </SCard>

      {/* ══════════════════════════════════════
          DOCUMENT PREVIEW DIALOG
      ══════════════════════════════════════ */}
      <Dialog open={!!docDialog} onClose={() => setDocDialog(null)} maxWidth="sm" fullWidth
        PaperProps={{ sx:{ borderRadius:"16px", border:`1px solid ${T.border}` } }}>
        <DialogTitle sx={{ fontFamily:fHead, fontWeight:700, fontSize:"1rem", color:T.text, borderBottom:`1px solid ${T.border}`, bgcolor:"#FAFBFD", pb:2 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box display="flex" alignItems="center" gap={1.2}>
              <Box sx={{ width:4, height:22, borderRadius:2, bgcolor:T.accent }} />
              Document Verification — {docDialog?.name}
            </Box>
            <IconButton size="small" onClick={() => setDocDialog(null)} sx={{ bgcolor:"#F1F5F9", borderRadius:"8px" }}><Close fontSize="small" /></IconButton>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ px:3, pt:3, pb:2 }}>
          {docDialog && (
            <Stack spacing={2.5}>
              {/* Doc preview area */}
              <Box sx={{ height:160, borderRadius:"10px", bgcolor:"#F1F5F9", border:`1px dashed ${T.border}`, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}>
                <Description sx={{ fontSize:40, color:T.textMute, mb:1 }} />
                <Typography sx={{ fontFamily:fBody, fontSize:"0.78rem", color:T.textMute, fontWeight:600 }}>{docDialog.doc}</Typography>
                <Typography sx={{ fontFamily:fBody, fontSize:"0.7rem", color:T.textMute }}>Document preview placeholder</Typography>
              </Box>

              {/* OCR data */}
              <Alert severity="info" icon={<AutoAwesome sx={{fontSize:16}} />}
                sx={{ borderRadius:"8px", fontFamily:fBody, fontSize:"0.77rem", border:`1px solid ${T.accent}30` }}>
                <strong>OCR Extracted Data:</strong> {docDialog.ocrData}
              </Alert>

              {/* Validation warnings */}
              {getWarnings(docDialog).length > 0 && (
                <Box sx={{ p:2, borderRadius:"8px", bgcolor:T.dangerLight, border:`1px solid ${T.danger}30` }}>
                  <Typography sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.78rem", color:T.danger, mb:1 }}>⚠ Validation Alerts</Typography>
                  {getWarnings(docDialog).map((w,i) => (
                    <Typography key={i} sx={{ fontFamily:fBody, fontSize:"0.74rem", color:T.danger }}>{w.label}</Typography>
                  ))}
                </Box>
              )}

              {/* Checklist */}
              <Box>
                <SLabel sx={{ mb:1 }}>Verification Checklist</SLabel>
                <Stack spacing={0.8}>
                  {[
                    { label:"Date matches the regularization request",    ok:true  },
                    { label:"Reason is consistent with document content", ok:true  },
                    { label:"Document is from a recognisable authority",  ok:!docDialog.isDuplicate },
                    { label:"No duplicate request for this date",        ok:!docDialog.isDuplicate },
                  ].map((item,i) => (
                    <Box key={i} display="flex" alignItems="center" gap={1}>
                      {item.ok
                        ? <CheckCircle sx={{ fontSize:16, color:T.success }} />
                        : <ErrorOutline sx={{ fontSize:16, color:T.danger }} />
                      }
                      <Typography sx={{ fontFamily:fBody, fontSize:"0.78rem", color: item.ok ? T.textSub : T.danger }}>{item.label}</Typography>
                    </Box>
                  ))}
                </Stack>
              </Box>
            </Stack>
          )}
        </DialogContent>
        <DialogActions sx={{ px:3, pb:3, borderTop:`1px solid ${T.border}`, pt:2, bgcolor:"#FAFBFD", gap:1 }}>
          <Button onClick={() => setDocDialog(null)} variant="outlined"
            sx={{ fontFamily:fBody, fontWeight:600, fontSize:"0.8rem", textTransform:"none", borderRadius:"8px", borderColor:T.border, color:T.textSub }}>
            Close
          </Button>
          <Button variant="outlined" onClick={() => { setRejectDialog(docDialog); setDocDialog(null); }}
            sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.8rem", textTransform:"none", borderRadius:"8px", color:T.danger, borderColor:`${T.danger}50`, "&:hover":{borderColor:T.danger,bgcolor:T.dangerLight} }}>
            Reject
          </Button>
          <Button variant="contained" onClick={() => approve(docDialog.id)}
            sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.8rem", textTransform:"none", borderRadius:"8px", bgcolor:T.success, boxShadow:"none", "&:hover":{bgcolor:"#059669",boxShadow:"none"} }}>
            Verify & Approve
          </Button>
        </DialogActions>
      </Dialog>

      {/* ══════════════════════════════════════
          REJECTION DIALOG
      ══════════════════════════════════════ */}
      <Dialog open={!!rejectDialog} onClose={() => setRejectDialog(null)} maxWidth="sm" fullWidth
        PaperProps={{ sx:{ borderRadius:"16px", border:`1px solid ${T.border}` } }}>
        <DialogTitle sx={{ fontFamily:fHead, fontWeight:700, fontSize:"1rem", color:T.text, borderBottom:`1px solid ${T.border}`, bgcolor:"#FAFBFD", pb:2 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box display="flex" alignItems="center" gap={1.2}>
              <Box sx={{ width:4, height:22, borderRadius:2, bgcolor:T.danger }} />
              Reject Regularization Request
            </Box>
            <IconButton size="small" onClick={() => setRejectDialog(null)} sx={{ bgcolor:"#F1F5F9", borderRadius:"8px" }}><Close fontSize="small" /></IconButton>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ px:3, pt:3, pb:2 }}>
          <Stack spacing={2.2}>
            {rejectDialog && (
              <Box sx={{ p:2, borderRadius:"10px", bgcolor:"#F9FAFB", border:`1px solid ${T.border}` }}>
                <Typography sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.86rem", color:T.text }}>{rejectDialog.name}</Typography>
                <Typography sx={{ fontFamily:fBody, fontSize:"0.76rem", color:T.textMute }}>{rejectDialog.date} &nbsp;·&nbsp; {rejectDialog.reason}</Typography>
              </Box>
            )}
            <Alert severity="warning" sx={{ borderRadius:"8px", fontFamily:fBody, fontSize:"0.76rem" }}>
              Rejection will be logged and the faculty will receive an automated notification with your reason.
            </Alert>
            <DField label="Rejection Reason *">
              <DInput multiline rows={3} value={rejectReason} onChange={e=>setRejectReason(e.target.value)}
                placeholder="e.g. Submitted proof does not match the date of absence. Traffic delay is not a valid reason per HR policy section 4.2..." />
            </DField>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px:3, pb:3, borderTop:`1px solid ${T.border}`, pt:2, bgcolor:"#FAFBFD", gap:1 }}>
          <Button onClick={() => setRejectDialog(null)} variant="outlined"
            sx={{ fontFamily:fBody, fontWeight:600, fontSize:"0.8rem", textTransform:"none", borderRadius:"8px", borderColor:T.border, color:T.textSub }}>
            Cancel
          </Button>
          <Button variant="contained" onClick={confirmReject} startIcon={<Cancel sx={{fontSize:15}} />}
            sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.8rem", textTransform:"none", borderRadius:"8px", bgcolor:T.danger, boxShadow:"none", "&:hover":{bgcolor:"#DC2626",boxShadow:"none"} }}>
            Confirm Rejection
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

export default RegularizationView;