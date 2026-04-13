import React, { useState, useEffect } from "react";
import {
  Box, Card, Grid, Typography, Button, Table, TableBody, TableCell,
  TableHead, TableRow, Chip, IconButton, Tooltip, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, MenuItem, Tabs, Tab,
  LinearProgress, Switch, FormControlLabel, Avatar, Stack, Divider,
  Alert, Snackbar, Collapse, InputAdornment, Badge
} from "@mui/material";
import {
  AccessTime, Fingerprint, LocationOn, SwapHoriz, Assessment,
  SettingsSuggest, Warning, CheckCircle, Cancel, Edit,
  NotificationsActive, CloudSync, Map, Schedule, Search,
  Download, Refresh, Circle, Person, WifiOff, Wifi,
  TrendingUp, TrendingDown, MoreVert, Close, Add,
  CheckCircleOutline, ErrorOutline, Info, Send
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
    @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }
    .fu { animation: fadeUp 0.3s ease both; }
    .pulse { animation: pulse 2s infinite; }
    .row-h:hover { background:#F9FAFB !important; transition:background 0.15s; }
  `}</style>
);

/* ── Mock Data ── */
const LOGS_INIT = [
  { id:1, name:"Dr. Sarah Smith",    avatar:"SS", dept:"CSE",   timeIn:"09:05 AM", timeOut:"--",      status:"Present", device:"Bio-Gate-1", location:"Main Block",  late:true  },
  { id:2, name:"Prof. Rajan Kumar",  avatar:"RK", dept:"Mech",  timeIn:"08:55 AM", timeOut:"05:00 PM",status:"Present", device:"Bio-Gate-2", location:"Mech Block",  late:false },
  { id:3, name:"Ms. Priya Roy",      avatar:"PR", dept:"Civil", timeIn:"--",       timeOut:"--",      status:"Absent",  device:"--",         location:"--",          late:false },
  { id:4, name:"Dr. K. Nair",        avatar:"KN", dept:"ECE",   timeIn:"09:30 AM", timeOut:"--",      status:"Present", device:"Bio-Gate-1", location:"Main Block",  late:true  },
  { id:5, name:"Prof. A. Sharma",    avatar:"AS", dept:"ECE",   timeIn:"08:48 AM", timeOut:"04:55 PM",status:"Present", device:"Bio-Gate-3", location:"ECE Block",   late:false },
  { id:6, name:"Dr. Emily Davis",    avatar:"ED", dept:"CSE",   timeIn:"--",       timeOut:"--",      status:"On Leave", device:"--",        location:"--",          late:false },
];

const DEVICES_INIT = [
  { id:"DEV-001", name:"Main Gate Biometric",    ip:"192.168.1.10", status:"Online",  lastSync:"Just now",    type:"Fingerprint" },
  { id:"DEV-002", name:"Admin Block Face Rec.",  ip:"192.168.1.12", status:"Online",  lastSync:"2 min ago",   type:"Face Recognition" },
  { id:"DEV-003", name:"Library RFID Reader",    ip:"192.168.1.15", status:"Offline", lastSync:"2 hrs ago",   type:"RFID" },
  { id:"DEV-004", name:"ECE Block Biometric",    ip:"192.168.1.18", status:"Online",  lastSync:"Just now",    type:"Fingerprint" },
];

const SHIFTS_INIT = [
  { id:"S1", name:"General Shift",  time:"09:00 AM – 05:00 PM", grace:"10 min", type:"Fixed",       faculty:98 },
  { id:"S2", name:"Morning Shift",  time:"07:00 AM – 02:00 PM", grace:"5 min",  type:"Rotational",  faculty:12 },
  { id:"S3", name:"Night Shift",    time:"08:00 PM – 04:00 AM", grace:"15 min", type:"Allowance Eligible", faculty:4 },
];

const SWAPS_INIT = [
  { id:101, requestor:"Mr. Arjun Singh",  dept:"CSE",  current:"Night Shift",   requested:"General Shift",  date:"2026-02-15", reason:"Health Issue",         status:"Pending" },
  { id:102, requestor:"Ms. K. Reddy",     dept:"ECE",  current:"Morning Shift", requested:"General Shift",  date:"2026-02-18", reason:"Child care obligation", status:"Pending" },
];

const GEO_LOGS_INIT = [
  { id:1, name:"Dr. A. Verma",    dept:"CSE",  type:"Field Visit",   location:"IIT Delhi Campus",     time:"10:30 AM", status:"Verified (GPS)",    coords:"28.5459° N, 77.1927° E" },
  { id:2, name:"Ms. Neha Gupta",  dept:"ECE",  type:"Remote Work",   location:"Home (Approved IP)",   time:"09:00 AM", status:"Verified",           coords:"12.9716° N, 77.5946° E" },
  { id:3, name:"Prof. S. Menon",  dept:"Mech", type:"Conference",    location:"Bangalore Int. Centre",time:"08:30 AM", status:"Pending Approval",   coords:"12.9698° N, 77.7499° E" },
];

const DEPT_STATS = [
  { dept:"CSE",        pct:94, present:42, total:45, late:2  },
  { dept:"ECE",        pct:88, present:31, total:35, late:4  },
  { dept:"Mechanical", pct:85, present:22, total:26, late:3  },
  { dept:"Civil",      pct:79, present:19, total:24, late:5  },
  { dept:"Science",    pct:91, present:20, total:22, late:1  },
];

/* ── Shared UI ── */
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
  <TableCell sx={{ fontFamily:fBody, fontSize:"0.81rem", color:T.textSub, borderBottom:`1px solid ${T.border}`, py:1.6, ...sx }}>{children}</TableCell>
);

const StatusPill = ({ status }) => {
  const map = {
    Present:           { color:T.success, bg:T.successLight },
    Absent:            { color:T.danger,  bg:T.dangerLight  },
    "On Leave":        { color:T.warning, bg:T.warningLight },
    Online:            { color:T.success, bg:T.successLight },
    Offline:           { color:T.danger,  bg:T.dangerLight  },
    Pending:           { color:T.warning, bg:T.warningLight },
    Approved:          { color:T.success, bg:T.successLight },
    Rejected:          { color:T.danger,  bg:T.dangerLight  },
    "Verified (GPS)":  { color:T.success, bg:T.successLight },
    Verified:          { color:T.success, bg:T.successLight },
    "Pending Approval":{ color:T.warning, bg:T.warningLight },
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

const RuleRow = ({ label, desc, checked, onChange }) => (
  <Box sx={{ p:2, borderRadius:"10px", border:`1px solid ${T.border}`, bgcolor: checked ? T.accentLight : "#F9FAFB", transition:"background 0.2s", mb:0 }}>
    <Box display="flex" justifyContent="space-between" alignItems="flex-start">
      <Box flex={1} mr={2}>
        <Typography sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.83rem", color: checked ? T.accent : T.text }}>{label}</Typography>
        <Typography sx={{ fontFamily:fBody, fontSize:"0.73rem", color:T.textMute, mt:0.3, lineHeight:1.5 }}>{desc}</Typography>
      </Box>
      <Switch checked={checked} onChange={onChange}
        sx={{ "& .MuiSwitch-switchBase.Mui-checked":{ color:T.accent }, "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":{ bgcolor:T.accent } }} />
    </Box>
  </Box>
);

/* ════════════════════════════════
   MAIN COMPONENT
════════════════════════════════ */
const AttendanceMonitorView = () => {
  const [tabIndex, setTabIndex]     = useState(0);
  const [logs, setLogs]             = useState(LOGS_INIT);
  const [devices]                   = useState(DEVICES_INIT);
  const [shifts]                    = useState(SHIFTS_INIT);
  const [swaps, setSwaps]           = useState(SWAPS_INIT);
  const [geoLogs, setGeoLogs]       = useState(GEO_LOGS_INIT);
  const [rules, setRules]           = useState({ autoDeduct:true, lateWarning:true, escalation:false, monthlyReport:true, gpsRestriction:true, remoteWork:true });

  /* Dialogs */
  const [corrDialog, setCorrDialog] = useState(null);
  const [corrIn, setCorrIn]         = useState("");
  const [corrOut, setCorrOut]       = useState("");
  const [corrReason, setCorrReason] = useState("");
  const [searchQ, setSearchQ]       = useState("");
  const [deptFilter, setDeptFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [liveTime, setLiveTime]     = useState(new Date());
  const [snack, setSnack]           = useState({ open:false, msg:"", severity:"success" });

  const toast = (msg, severity="success") => setSnack({ open:true, msg, severity });

  useEffect(() => {
    const t = setInterval(() => setLiveTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  /* Handlers */
  const handleCorrection = () => {
    if (!corrReason.trim()) { toast("Please provide a reason.", "error"); return; }
    setLogs(prev => prev.map(l => l.id === corrDialog.id ? {
      ...l,
      timeIn:  corrIn  || l.timeIn,
      timeOut: corrOut || l.timeOut,
      late: false,
    } : l));
    setCorrDialog(null); setCorrIn(""); setCorrOut(""); setCorrReason("");
    toast("Attendance correction submitted and applied.");
  };

  const handleSwap = (id, action) => {
    setSwaps(prev => prev.map(s => s.id === id ? { ...s, status: action === "approve" ? "Approved" : "Rejected" } : s));
    toast(action === "approve" ? "Shift swap approved. Faculty notified." : "Swap request rejected.");
  };

  const handleGeoApprove = (id) => {
    setGeoLogs(prev => prev.map(l => l.id === id ? { ...l, status:"Verified (GPS)" } : l));
    toast("Remote attendance verified and approved.");
  };

  const filteredLogs = logs.filter(l => {
    if (deptFilter !== "All" && l.dept !== deptFilter) return false;
    if (statusFilter !== "All" && l.status !== statusFilter) return false;
    if (searchQ && !l.name.toLowerCase().includes(searchQ.toLowerCase())) return false;
    return true;
  });

  const presentCount  = logs.filter(l => l.status === "Present").length;
  const absentCount   = logs.filter(l => l.status === "Absent").length;
  const lateCount     = logs.filter(l => l.late).length;
  const onLeaveCount  = logs.filter(l => l.status === "On Leave").length;
  const onlineDevices = devices.filter(d => d.status === "Online").length;

  const tabs = [
    { label:"Live Monitor",      icon:Fingerprint,    count:0            },
    { label:"Shift Management",  icon:Schedule,       count:swaps.filter(s=>s.status==="Pending").length },
    { label:"Geo-fencing",       icon:LocationOn,     count:geoLogs.filter(g=>g.status==="Pending Approval").length },
    { label:"Analytics",         icon:Assessment,     count:0            },
    { label:"Automation Rules",  icon:SettingsSuggest,count:0            },
  ];

  return (
    <Box sx={{ p:3, bgcolor:T.bg, minHeight:"100vh", fontFamily:fBody }}>
      <Fonts />

      {/* ── Header ── */}
      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3}>
        <Box>
          <Typography sx={{ fontFamily:fHead, fontWeight:700, fontSize:"1.5rem", color:T.text }}>Smart Attendance Monitor</Typography>
          <Typography sx={{ fontFamily:fBody, fontSize:"0.82rem", color:T.textSub, mt:0.4 }}>
            Admin View &nbsp;·&nbsp; {liveTime.toLocaleDateString("en-IN",{ weekday:"long", day:"2-digit", month:"long", year:"numeric" })} &nbsp;·&nbsp;
            <Typography component="span" sx={{ fontFamily:fMono, fontSize:"0.82rem", color:T.accent }}>{liveTime.toLocaleTimeString()}</Typography>
          </Typography>
        </Box>
        <Box display="flex" gap={1.5}>
          <Button size="small" variant="outlined" startIcon={<Download sx={{fontSize:15}} />}
            onClick={() => toast("Attendance report exported.")}
            sx={{ fontFamily:fBody, fontWeight:600, fontSize:"0.76rem", textTransform:"none", borderRadius:"8px", borderColor:T.border, color:T.textSub, "&:hover":{borderColor:T.accent,color:T.accent} }}>
            Export Report
          </Button>
          <Button size="small" variant="contained" startIcon={<Refresh sx={{fontSize:15}} />}
            onClick={() => toast("Synced with all biometric devices.")}
            sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.76rem", textTransform:"none", borderRadius:"8px", bgcolor:T.accent, boxShadow:"none", "&:hover":{bgcolor:"#4F46E5",boxShadow:"none"} }}>
            Force Sync
          </Button>
        </Box>
      </Box>

      {/* ── Stat Strip ── */}
      <Grid container spacing={2} mb={3}>
        {[
          { label:"Present Today",    value:presentCount,  sub:`of ${logs.length} faculty`, color:T.success, icon:CheckCircle   },
          { label:"Absent",           value:absentCount,   sub:"No info received",          color:T.danger,  icon:Cancel        },
          { label:"Late Arrivals",    value:lateCount,     sub:"After grace period",         color:T.warning, icon:AccessTime    },
          { label:"On Leave",         value:onLeaveCount,  sub:"Approved leaves",            color:T.accent,  icon:Schedule      },
          { label:"Devices Online",   value:`${onlineDevices}/${devices.length}`, sub:"Biometric devices", color:onlineDevices===devices.length ? T.success : T.warning, icon:Wifi },
        ].map((s,i) => (
          <Grid item xs={6} md={2.4} key={i}>
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
          <Tabs value={tabIndex} onChange={(_,v) => setTabIndex(v)} variant="scrollable" scrollButtons="auto"
            sx={{ "& .MuiTabs-indicator":{ bgcolor:T.accent, height:2.5, borderRadius:"2px 2px 0 0" },
                  "& .MuiTab-root":{ fontFamily:fBody, fontWeight:600, fontSize:"0.78rem", textTransform:"none", color:T.textMute, minHeight:50, "&.Mui-selected":{color:T.accent} } }}>
            {tabs.map((t,i) => (
              <Tab key={i} icon={<t.icon sx={{fontSize:16}} />} iconPosition="start"
                label={
                  <Box display="flex" alignItems="center" gap={0.8}>
                    {t.label}
                    {t.count > 0 && (
                      <Box sx={{ px:0.7, py:0.1, borderRadius:"99px", bgcolor: tabIndex===i ? T.accentLight : T.dangerLight }}>
                        <Typography sx={{ fontFamily:fMono, fontSize:"0.62rem", fontWeight:700, color: tabIndex===i ? T.accent : T.danger }}>{t.count}</Typography>
                      </Box>
                    )}
                  </Box>
                }
              />
            ))}
          </Tabs>
        </Box>

        <Box p={3}>

          {/* ════ TAB 0: LIVE MONITOR ════ */}
          {tabIndex === 0 && (
            <Box className="fu">
              <Grid container spacing={3}>
                {/* Main table */}
                <Grid item xs={12} md={8}>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Box display="flex" gap={1} alignItems="center">
                      <Box sx={{ width:8, height:8, borderRadius:"50%", bgcolor:T.success }} className="pulse" />
                      <Typography sx={{ fontFamily:fHead, fontWeight:700, fontSize:"0.9rem", color:T.text }}>Real-time Attendance Log</Typography>
                    </Box>
                    <Box sx={{ px:1.5, py:0.5, borderRadius:"8px", bgcolor:T.successLight, border:`1px solid ${T.success}30` }}>
                      <Typography sx={{ fontFamily:fMono, fontSize:"0.7rem", fontWeight:700, color:T.success }}>● Live Sync Active</Typography>
                    </Box>
                  </Box>

                  {/* Filters */}
                  <Box display="flex" gap={1.5} mb={2} flexWrap="wrap">
                    <TextField size="small" placeholder="Search faculty..." value={searchQ} onChange={e=>setSearchQ(e.target.value)}
                      InputProps={{ startAdornment:<InputAdornment position="start"><Search sx={{fontSize:15,color:T.textMute}} /></InputAdornment> }}
                      sx={{ width:200, "& .MuiOutlinedInput-root":{ borderRadius:"8px", fontFamily:fBody, fontSize:"0.8rem", "& fieldset":{borderColor:T.border}, "&.Mui-focused fieldset":{borderColor:T.accent} } }} />
                    {[
                      { label:"Dept", val:deptFilter, set:setDeptFilter, opts:["All","CSE","ECE","Mech","Civil"] },
                      { label:"Status", val:statusFilter, set:setStatusFilter, opts:["All","Present","Absent","On Leave"] },
                    ].map(f => (
                      <TextField key={f.label} select size="small" value={f.val} onChange={e=>f.set(e.target.value)} label={f.label}
                        sx={{ width:130, "& .MuiOutlinedInput-root":{ borderRadius:"8px", fontFamily:fBody, fontSize:"0.8rem", "& fieldset":{borderColor:T.border}, "&.Mui-focused fieldset":{borderColor:T.accent} }, "& .MuiInputLabel-root.Mui-focused":{color:T.accent} }}>
                        {f.opts.map(o=><MenuItem key={o} value={o} sx={{fontFamily:fBody,fontSize:"0.8rem"}}>{o}</MenuItem>)}
                      </TextField>
                    ))}
                    <Typography sx={{ fontFamily:fBody, fontSize:"0.76rem", color:T.textMute, ml:"auto", alignSelf:"center" }}>
                      {filteredLogs.length} records
                    </Typography>
                  </Box>

                  <Box sx={{ borderRadius:"10px", border:`1px solid ${T.border}`, overflow:"hidden" }}>
                    <Table>
                      <TableHead><TableRow>
                        <TH>Faculty</TH><TH>In Time</TH><TH>Out Time</TH><TH>Device</TH><TH>Status</TH><TH>Action</TH>
                      </TableRow></TableHead>
                      <TableBody>
                        {filteredLogs.map(row => (
                          <TableRow key={row.id} className="row-h">
                            <TD>
                              <Box display="flex" alignItems="center" gap={1.2}>
                                <Avatar sx={{ width:30, height:30, fontSize:"0.7rem", fontWeight:700, bgcolor: row.status==="Present" ? T.accentLight : T.dangerLight, color: row.status==="Present" ? T.accent : T.danger }}>
                                  {row.avatar}
                                </Avatar>
                                <Box>
                                  <Typography sx={{ fontFamily:fBody, fontWeight:600, fontSize:"0.82rem", color:T.text }}>{row.name}</Typography>
                                  <Typography sx={{ fontFamily:fBody, fontSize:"0.68rem", color:T.textMute }}>{row.dept}</Typography>
                                </Box>
                              </Box>
                            </TD>
                            <TD>
                              <Box>
                                <Typography sx={{ fontFamily:fMono, fontSize:"0.8rem", color: row.late ? T.danger : T.text, fontWeight: row.late ? 700 : 500 }}>
                                  {row.timeIn}
                                </Typography>
                                {row.late && (
                                  <Box sx={{ px:0.8, py:0.1, borderRadius:"4px", bgcolor:T.dangerLight, display:"inline-block", mt:0.3 }}>
                                    <Typography sx={{ fontFamily:fBody, fontSize:"0.62rem", fontWeight:700, color:T.danger }}>Late Entry</Typography>
                                  </Box>
                                )}
                              </Box>
                            </TD>
                            <TD>
                              <Typography sx={{ fontFamily:fMono, fontSize:"0.8rem", color: row.timeOut==="--" ? T.textMute : T.text }}>
                                {row.timeOut}
                              </Typography>
                            </TD>
                            <TD>
                              <Typography sx={{ fontFamily:fBody, fontSize:"0.76rem", color:T.textMute }}>{row.device}</Typography>
                              <Typography sx={{ fontFamily:fBody, fontSize:"0.68rem", color:T.textMute }}>{row.location}</Typography>
                            </TD>
                            <TD><StatusPill status={row.status} /></TD>
                            <TD>
                              <Tooltip title="Attendance Correction">
                                <IconButton size="small"
                                  sx={{ bgcolor:"#F1F5F9", borderRadius:"7px", "&:hover":{bgcolor:T.accentLight,color:T.accent} }}
                                  onClick={() => { setCorrDialog(row); setCorrIn(row.timeIn==="--" ? "" : row.timeIn); setCorrOut(row.timeOut==="--" ? "" : row.timeOut); }}>
                                  <Edit sx={{ fontSize:15 }} />
                                </IconButton>
                              </Tooltip>
                            </TD>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Box>
                </Grid>

                {/* Device Health */}
                <Grid item xs={12} md={4}>
                  <Typography sx={{ fontFamily:fHead, fontWeight:700, fontSize:"0.9rem", color:T.text, mb:2 }}>Device Health</Typography>
                  <Stack spacing={1.5}>
                    {devices.map(dev => (
                      <SCard key={dev.id} sx={{ p:2 }}>
                        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={0.8}>
                          <Box flex={1} mr={1}>
                            <Typography sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.8rem", color:T.text }}>{dev.name}</Typography>
                            <Typography sx={{ fontFamily:fMono, fontSize:"0.68rem", color:T.textMute }}>{dev.ip} &nbsp;·&nbsp; {dev.type}</Typography>
                          </Box>
                          <StatusPill status={dev.status} />
                        </Box>
                        <Box display="flex" alignItems="center" gap={0.6}>
                          <AccessTime sx={{ fontSize:12, color:T.textMute }} />
                          <Typography sx={{ fontFamily:fBody, fontSize:"0.7rem", color:T.textMute }}>Last sync: {dev.lastSync}</Typography>
                        </Box>
                        {dev.status === "Offline" && (
                          <Alert severity="error" icon={<WifiOff sx={{fontSize:14}} />}
                            sx={{ mt:1, py:0.3, borderRadius:"7px", fontFamily:fBody, fontSize:"0.72rem" }}>
                            Device unreachable — check network connection
                          </Alert>
                        )}
                      </SCard>
                    ))}
                  </Stack>
                  <Button fullWidth variant="outlined" size="small" sx={{ mt:1.5, fontFamily:fBody, fontWeight:600, fontSize:"0.74rem", textTransform:"none", borderRadius:"8px", borderColor:T.border, color:T.textSub, "&:hover":{borderColor:T.accent,color:T.accent} }}>
                    Manage Devices
                  </Button>
                </Grid>
              </Grid>
            </Box>
          )}

          {/* ════ TAB 1: SHIFT MANAGEMENT ════ */}
          {tabIndex === 1 && (
            <Box className="fu">
              <Grid container spacing={3}>
                {/* Shifts table */}
                <Grid item xs={12} md={6}>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography sx={{ fontFamily:fHead, fontWeight:700, fontSize:"0.9rem", color:T.text }}>Defined Shifts</Typography>
                    <Button size="small" startIcon={<Add sx={{fontSize:14}} />} onClick={() => toast("Edit roster dialog would open.")}
                      sx={{ fontFamily:fBody, fontWeight:600, fontSize:"0.74rem", textTransform:"none", borderRadius:"8px", color:T.accent }}>
                      Edit Roster
                    </Button>
                  </Box>
                  <Stack spacing={1.5}>
                    {shifts.map(s => (
                      <SCard key={s.id} sx={{ p:2.2 }}>
                        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                          <Box>
                            <Typography sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.86rem", color:T.text }}>{s.name}</Typography>
                            <Typography sx={{ fontFamily:fMono, fontSize:"0.74rem", color:T.accent, mt:0.3 }}>{s.time}</Typography>
                            <Typography sx={{ fontFamily:fBody, fontSize:"0.7rem", color:T.textMute, mt:0.3 }}>Grace: {s.grace}</Typography>
                          </Box>
                          <Box textAlign="right">
                            <Box sx={{ px:1, py:0.25, borderRadius:"6px", bgcolor:T.accentLight, mb:0.6 }}>
                              <Typography sx={{ fontFamily:fBody, fontSize:"0.68rem", fontWeight:700, color:T.accent }}>{s.type}</Typography>
                            </Box>
                            <Typography sx={{ fontFamily:fMono, fontSize:"0.7rem", color:T.textMute }}>{s.faculty} faculty</Typography>
                          </Box>
                        </Box>
                      </SCard>
                    ))}
                  </Stack>
                </Grid>

                {/* Swap Requests */}
                <Grid item xs={12} md={6}>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography sx={{ fontFamily:fHead, fontWeight:700, fontSize:"0.9rem", color:T.text }}>Shift Swap Requests</Typography>
                    <Box sx={{ px:1.2, py:0.35, borderRadius:"99px", bgcolor:T.warningLight }}>
                      <Typography sx={{ fontFamily:fMono, fontSize:"0.68rem", fontWeight:700, color:T.warning }}>
                        {swaps.filter(s=>s.status==="Pending").length} pending
                      </Typography>
                    </Box>
                  </Box>
                  <Stack spacing={1.5}>
                    {swaps.map(req => (
                      <SCard key={req.id} sx={{ p:2.2, borderLeft:`4px solid ${req.status==="Pending" ? T.warning : req.status==="Approved" ? T.success : T.danger}` }}>
                        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1.2}>
                          <Box>
                            <Typography sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.86rem", color:T.text }}>{req.requestor}</Typography>
                            <Typography sx={{ fontFamily:fBody, fontSize:"0.72rem", color:T.textMute }}>{req.dept} &nbsp;·&nbsp; {req.date}</Typography>
                          </Box>
                          <StatusPill status={req.status} />
                        </Box>

                        <Box display="flex" alignItems="center" gap={1.5} mb={1.2}>
                          <Box sx={{ px:1.2, py:0.4, borderRadius:"7px", bgcolor:"#F1F5F9" }}>
                            <Typography sx={{ fontFamily:fBody, fontSize:"0.74rem", fontWeight:600, color:T.textSub }}>{req.current}</Typography>
                          </Box>
                          <SwapHoriz sx={{ fontSize:18, color:T.textMute }} />
                          <Box sx={{ px:1.2, py:0.4, borderRadius:"7px", bgcolor:T.accentLight }}>
                            <Typography sx={{ fontFamily:fBody, fontSize:"0.74rem", fontWeight:700, color:T.accent }}>{req.requested}</Typography>
                          </Box>
                        </Box>

                        <Typography sx={{ fontFamily:fBody, fontSize:"0.74rem", color:T.textMute, mb: req.status==="Pending" ? 1.5 : 0 }}>
                          Reason: {req.reason}
                        </Typography>

                        {req.status === "Pending" && (
                          <Box display="flex" gap={1}>
                            <Button size="small" variant="outlined" fullWidth onClick={() => handleSwap(req.id,"reject")}
                              sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.73rem", textTransform:"none", borderRadius:"8px", color:T.danger, borderColor:`${T.danger}50`, "&:hover":{borderColor:T.danger,bgcolor:T.dangerLight} }}>
                              Reject
                            </Button>
                            <Button size="small" variant="contained" fullWidth onClick={() => handleSwap(req.id,"approve")}
                              sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.73rem", textTransform:"none", borderRadius:"8px", bgcolor:T.success, boxShadow:"none", "&:hover":{bgcolor:"#059669",boxShadow:"none"} }}>
                              Approve
                            </Button>
                          </Box>
                        )}
                      </SCard>
                    ))}
                  </Stack>
                </Grid>
              </Grid>
            </Box>
          )}

          {/* ════ TAB 2: GEO-FENCING ════ */}
          {tabIndex === 2 && (
            <Box className="fu">
              <Grid container spacing={3}>
                {/* Remote logs */}
                <Grid item xs={12} md={7}>
                  <Typography sx={{ fontFamily:fHead, fontWeight:700, fontSize:"0.9rem", color:T.text, mb:2 }}>
                    Mobile & Remote Attendance Logs
                  </Typography>
                  <Box sx={{ borderRadius:"10px", border:`1px solid ${T.border}`, overflow:"hidden" }}>
                    <Table>
                      <TableHead><TableRow>
                        <TH>Faculty</TH><TH>Mode</TH><TH>Location</TH><TH>Time</TH><TH>Status</TH><TH>Action</TH>
                      </TableRow></TableHead>
                      <TableBody>
                        {geoLogs.map(log => (
                          <TableRow key={log.id} className="row-h">
                            <TD sx={{ fontWeight:600, color:T.text }}>{log.name}
                              <Typography sx={{ fontFamily:fBody, fontSize:"0.68rem", color:T.textMute }}>{log.dept}</Typography>
                            </TD>
                            <TD>
                              <Box sx={{ px:0.9, py:0.2, borderRadius:"5px", bgcolor:T.accentLight, display:"inline-block" }}>
                                <Typography sx={{ fontFamily:fMono, fontSize:"0.65rem", fontWeight:700, color:T.accent }}>{log.type}</Typography>
                              </Box>
                            </TD>
                            <TD>
                              <Typography sx={{ fontFamily:fBody, fontSize:"0.78rem", color:T.textSub }}>{log.location}</Typography>
                              <Typography sx={{ fontFamily:fMono, fontSize:"0.65rem", color:T.textMute }}>{log.coords}</Typography>
                            </TD>
                            <TD><Typography sx={{ fontFamily:fMono, fontSize:"0.76rem" }}>{log.time}</Typography></TD>
                            <TD><StatusPill status={log.status} /></TD>
                            <TD>
                              {log.status === "Pending Approval" && (
                                <Button size="small" variant="contained" onClick={() => handleGeoApprove(log.id)}
                                  sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.7rem", textTransform:"none", borderRadius:"7px", bgcolor:T.success, boxShadow:"none", "&:hover":{bgcolor:"#059669",boxShadow:"none"} }}>
                                  Verify
                                </Button>
                              )}
                            </TD>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Box>
                </Grid>

                {/* Geo config */}
                <Grid item xs={12} md={5}>
                  <Typography sx={{ fontFamily:fHead, fontWeight:700, fontSize:"0.9rem", color:T.text, mb:2 }}>Geo-fencing Configuration</Typography>
                  <SCard sx={{ p:2.5 }}>
                    {/* Map placeholder */}
                    <Box sx={{ height:160, borderRadius:"10px", bgcolor:"#F1F5F9", border:`1px dashed ${T.border}`, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", mb:2.5 }}>
                      <Map sx={{ fontSize:36, color:T.textMute, mb:1 }} />
                      <Typography sx={{ fontFamily:fBody, fontSize:"0.78rem", color:T.textMute, fontWeight:600 }}>Campus Geo-fence Map</Typography>
                      <Typography sx={{ fontFamily:fBody, fontSize:"0.7rem", color:T.textMute }}>Allowed Radius: 500m from Campus Centre</Typography>
                    </Box>

                    <Stack spacing={2}>
                      {[
                        { key:"gpsRestriction", label:"Enable GPS Restriction", desc:"Only allow attendance within the geo-fence boundary." },
                        { key:"remoteWork",      label:"Allow Remote Work Requests", desc:"Faculty can request WFH approval via the portal." },
                      ].map(r => (
                        <RuleRow key={r.key} label={r.label} desc={r.desc}
                          checked={rules[r.key]} onChange={() => setRules(p=>({...p,[r.key]:!p[r.key]}))} />
                      ))}
                    </Stack>

                    <Box mt={2} sx={{ p:1.5, borderRadius:"8px", bgcolor:T.accentLight, border:`1px solid ${T.accent}30` }}>
                      <Typography sx={{ fontFamily:fBody, fontSize:"0.73rem", color:T.accent, fontWeight:600 }}>
                        Campus Centre: 12.9716° N, 77.5946° E &nbsp;·&nbsp; Radius: 500m
                      </Typography>
                    </Box>
                  </SCard>
                </Grid>
              </Grid>
            </Box>
          )}

          {/* ════ TAB 3: ANALYTICS ════ */}
          {tabIndex === 3 && (
            <Box className="fu">
              {/* KPI cards */}
              <Grid container spacing={2} mb={3}>
                {[
                  { label:"Avg. Punctuality",       value:"92%",  delta:"+2.1%", up:true,  color:T.success, sub:"vs last month" },
                  { label:"Early Departures",        value:"15",   delta:"+3",    up:false, color:T.danger,  sub:"This month"    },
                  { label:"Best Dept (Attendance)",  value:"CSE",  delta:"94%",   up:true,  color:T.accent,  sub:"Average"       },
                  { label:"Avg. Working Hours",      value:"7.8h", delta:"-0.2h", up:false, color:T.warning, sub:"Per day/faculty"},
                ].map((k,i) => (
                  <Grid item xs={6} md={3} key={i}>
                    <SCard sx={{ p:2.5 }}>
                      <SLabel>{k.label}</SLabel>
                      <Typography sx={{ fontFamily:fMono, fontWeight:700, fontSize:"1.7rem", color:k.color, lineHeight:1.1 }}>{k.value}</Typography>
                      <Box display="flex" alignItems="center" gap={0.5} mt={0.4}>
                        {k.up ? <TrendingUp sx={{ fontSize:13, color:T.success }} /> : <TrendingDown sx={{ fontSize:13, color:T.danger }} />}
                        <Typography sx={{ fontFamily:fMono, fontSize:"0.68rem", color: k.up ? T.success : T.danger, fontWeight:700 }}>{k.delta}</Typography>
                        <Typography sx={{ fontFamily:fBody, fontSize:"0.68rem", color:T.textMute }}>{k.sub}</Typography>
                      </Box>
                    </SCard>
                  </Grid>
                ))}
              </Grid>

              {/* Dept stats */}
              <SCard sx={{ p:2.5 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2.5}>
                  <Typography sx={{ fontFamily:fHead, fontWeight:700, fontSize:"0.9rem", color:T.text, mb:2 }}>Department-wise Attendance Statistics</Typography>
                  <Button size="small" startIcon={<Download sx={{fontSize:14}} />} onClick={() => toast("Report downloaded.")}
                    sx={{ fontFamily:fBody, fontWeight:600, fontSize:"0.74rem", textTransform:"none", borderRadius:"8px", color:T.textSub }}>
                    Export
                  </Button>
                </Box>
                <Stack spacing={2}>
                  {DEPT_STATS.map((d,i) => (
                    <Box key={d.dept}>
                      <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.8}>
                        <Box display="flex" alignItems="center" gap={2}>
                          <Typography sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.82rem", color:T.text, minWidth:90 }}>{d.dept}</Typography>
                          <Box display="flex" gap={1.5}>
                            <Typography sx={{ fontFamily:fBody, fontSize:"0.71rem", color:T.textMute }}>
                              <span style={{fontWeight:700, color:T.success}}>{d.present}</span>/{d.total} present
                            </Typography>
                            {d.late > 0 && (
                              <Typography sx={{ fontFamily:fBody, fontSize:"0.71rem", color:T.warning }}>
                                <span style={{fontWeight:700}}>{d.late}</span> late
                              </Typography>
                            )}
                          </Box>
                        </Box>
                        <Typography sx={{ fontFamily:fMono, fontSize:"0.78rem", fontWeight:700, color: d.pct>=90 ? T.success : d.pct>=80 ? T.warning : T.danger }}>
                          {d.pct}%
                        </Typography>
                      </Box>
                      <Box sx={{ height:7, borderRadius:99, bgcolor:T.border, overflow:"hidden" }}>
                        <Box sx={{ height:"100%", width:`${d.pct}%`, borderRadius:99, bgcolor: d.pct>=90 ? T.success : d.pct>=80 ? T.warning : T.danger, transition:"width 1s ease" }} />
                      </Box>
                    </Box>
                  ))}
                </Stack>
              </SCard>
            </Box>
          )}

          {/* ════ TAB 4: AUTOMATION RULES ════ */}
          {tabIndex === 4 && (
            <Box className="fu">
              <Box mb={2.5}>
                <Typography sx={{ fontFamily:fHead, fontWeight:700, fontSize:"0.9rem", color:T.text }}>Automated Attendance Policies</Typography>
                <Typography sx={{ fontFamily:fBody, fontSize:"0.77rem", color:T.textMute, mt:0.3 }}>
                  Configure system-level rules that trigger automatically based on attendance data.
                </Typography>
              </Box>

              <Grid container spacing={2}>
                {[
                  { key:"autoDeduct",    label:"Auto-deduct Leave for Absent Days",           desc:"Automatically converts 'Absent' status to 'Casual Leave' if the faculty has a leave balance. Runs nightly at midnight." },
                  { key:"lateWarning",   label:"Auto-send Warning for 3+ Late Arrivals",      desc:"Triggers an automated email warning to the faculty and a report to the HOD after 3 late marks in a rolling month." },
                  { key:"escalation",    label:"Escalate Frequent Absenteeism to HOD",        desc:"Notifies the HOD and admin if a faculty member is absent for more than 3 consecutive days without prior information." },
                  { key:"monthlyReport", label:"Email Monthly Attendance Report",              desc:"Sends a formatted PDF summary to all faculty and HODs on the 1st of each month at 8:00 AM." },
                  { key:"gpsRestriction",label:"Enforce Geo-fence for Mobile Attendance",     desc:"Allows mobile/OTP attendance only if the faculty device is within the 500m campus geo-fence boundary." },
                  { key:"remoteWork",    label:"Allow Faculty to Request Remote Work",         desc:"Enables the 'Work From Home' request button in the faculty portal. Requests are routed to HOD for approval." },
                ].map(r => (
                  <Grid item xs={12} md={6} key={r.key}>
                    <RuleRow label={r.label} desc={r.desc}
                      checked={rules[r.key]} onChange={() => setRules(p => ({ ...p, [r.key]:!p[r.key] }))} />
                  </Grid>
                ))}
              </Grid>

              <Box mt={3} sx={{ p:2, borderRadius:"10px", border:`1px solid ${T.warning}40`, bgcolor:T.warningLight }}>
                <Typography sx={{ fontFamily:fBody, fontSize:"0.77rem", color:"#92400E", fontWeight:600, mb:0.4 }}>
                  ⚠ Policy Activation Notice
                </Typography>
                <Typography sx={{ fontFamily:fBody, fontSize:"0.74rem", color:"#92400E", lineHeight:1.6 }}>
                  Changes to automation rules take effect from the next working day. Ensure HR and department heads are informed before enabling escalation or auto-deduction policies.
                </Typography>
              </Box>
            </Box>
          )}

        </Box>
      </SCard>

      {/* ══════════════════════════════════════
          CORRECTION DIALOG
      ══════════════════════════════════════ */}
      <Dialog open={!!corrDialog} onClose={() => setCorrDialog(null)} maxWidth="sm" fullWidth
        PaperProps={{ sx:{ borderRadius:"16px", border:`1px solid ${T.border}` } }}>
        <DialogTitle sx={{ fontFamily:fHead, fontWeight:700, fontSize:"1rem", color:T.text, borderBottom:`1px solid ${T.border}`, bgcolor:"#FAFBFD", pb:2 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box display="flex" alignItems="center" gap={1.2}>
              <Box sx={{ width:4, height:22, borderRadius:2, bgcolor:T.accent }} />
              Attendance Correction Request
            </Box>
            <IconButton size="small" onClick={() => setCorrDialog(null)} sx={{ bgcolor:"#F1F5F9", borderRadius:"8px" }}><Close fontSize="small" /></IconButton>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ px:3, pt:3, pb:2 }}>
          {corrDialog && (
            <Stack spacing={2.2}>
              <Box sx={{ p:2, borderRadius:"10px", bgcolor:"#F9FAFB", border:`1px solid ${T.border}` }}>
                <Typography sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.88rem", color:T.text }}>{corrDialog.name}</Typography>
                <Box display="flex" gap={1.5} mt={0.5}>
                  <Typography sx={{ fontFamily:fBody, fontSize:"0.76rem", color:T.textMute }}>Current In: <strong style={{fontFamily:fMono,color:T.text}}>{corrDialog.timeIn}</strong></Typography>
                  <Typography sx={{ fontFamily:fBody, fontSize:"0.76rem", color:T.textMute }}>Current Out: <strong style={{fontFamily:fMono,color:T.text}}>{corrDialog.timeOut}</strong></Typography>
                </Box>
                {corrDialog.late && <StatusPill status="Present" />}
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <DField label="Corrected In-Time">
                    <DInput type="time" value={corrIn} onChange={e=>setCorrIn(e.target.value)} InputLabelProps={{shrink:true}} />
                  </DField>
                </Grid>
                <Grid item xs={6}>
                  <DField label="Corrected Out-Time">
                    <DInput type="time" value={corrOut} onChange={e=>setCorrOut(e.target.value)} InputLabelProps={{shrink:true}} />
                  </DField>
                </Grid>
              </Grid>
              <DField label="Reason for Correction *">
                <DInput multiline rows={2} value={corrReason} onChange={e=>setCorrReason(e.target.value)}
                  placeholder="e.g. Biometric device malfunction at Gate 1, manual register checked..." />
              </DField>
              <Alert severity="info" sx={{ borderRadius:"8px", fontFamily:fBody, fontSize:"0.76rem" }}>
                Correction will be logged with your admin credentials and reflected immediately in the live monitor.
              </Alert>
            </Stack>
          )}
        </DialogContent>
        <DialogActions sx={{ px:3, pb:3, borderTop:`1px solid ${T.border}`, pt:2, bgcolor:"#FAFBFD", gap:1 }}>
          <Button onClick={() => setCorrDialog(null)} variant="outlined"
            sx={{ fontFamily:fBody, fontWeight:600, fontSize:"0.8rem", textTransform:"none", borderRadius:"8px", borderColor:T.border, color:T.textSub }}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleCorrection} startIcon={<Send sx={{fontSize:15}} />}
            sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.8rem", textTransform:"none", borderRadius:"8px", bgcolor:T.accent, boxShadow:"none", "&:hover":{bgcolor:"#4F46E5",boxShadow:"none"} }}>
            Apply Correction
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

export default AttendanceMonitorView;