import React, { useState } from 'react';
import {
  Box, Card, Grid, Typography, Button, Tabs, Tab, Table, TableBody,
  TableCell, TableHead, TableRow, Chip, Stack, TextField, MenuItem,
  IconButton, Alert, Dialog, DialogTitle, DialogContent, DialogActions,
  LinearProgress, Switch, FormControlLabel, Divider, Tooltip,
  Snackbar, Alert as MuiAlert, Collapse, InputAdornment, Avatar, Badge
} from "@mui/material";
import {
  Devices, Chair, Science, DirectionsCar, VpnKey, Inventory,
  Build, SwapHoriz, CheckCircle, Warning, ContentCopy, Add,
  Close, Download, Search, VerifiedUser, History, AttachFile,
  CheckCircleOutline, RadioButtonUnchecked, ExpandMore, ExpandLess,
  AccessTime, ErrorOutline, Info, Refresh, Send, QrCode2
} from '@mui/icons-material';

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
const ASSETS_INIT = [
  { id:"AST-0041", name:"Dell Latitude 5540 Laptop",     type:"IT",        serial:"DL5540-BLR-2023-41", purchaseDate:"Mar 2023", warranty:"Mar 2026",  status:"Assigned", condition:"Good",    location:"Faculty Cabin 3B", value:85000 },
  { id:"AST-0042", name:"HP LaserJet Pro M404dn Printer",type:"IT",        serial:"HLP-2022-009",       purchaseDate:"Jul 2022", warranty:"Expired",   status:"Assigned", condition:"Fair",    location:"Faculty Cabin 3B", value:22000 },
  { id:"AST-0087", name:"Ergonomic Office Chair",         type:"Furniture", serial:"FRN-CHAIR-087",      purchaseDate:"Jan 2021", warranty:"N/A",       status:"Assigned", condition:"Good",    location:"Faculty Cabin 3B", value:8500  },
  { id:"AST-0102", name:"Oscilloscope (Tektronix TBS1052B)", type:"Lab Equipment", serial:"TEK-TBS-102",purchaseDate:"Sep 2020", warranty:"Sep 2023",  status:"Assigned", condition:"Needs Service", location:"ECE Lab 2", value:45000 },
  { id:"AST-0115", name:"Standing Desk (Height Adjustable)", type:"Furniture", serial:"FRN-DESK-115",   purchaseDate:"Aug 2023", warranty:"N/A",       status:"Assigned", condition:"Excellent",location:"Faculty Cabin 3B", value:15000 },
  { id:"AST-0133", name:"NVIDIA Jetson Nano Dev Kit",    type:"IT",        serial:"NVD-JNANO-133",      purchaseDate:"Jun 2024", warranty:"Jun 2026",  status:"Assigned", condition:"Good",    location:"AI Research Lab",  value:18000 },
];

const SOFTWARE_INIT = [
  { id:1, name:"MATLAB R2024b",       version:"R2024b", key:"MLAB-XXXX-YYYY-ZZZZ-2024", expiry:"Dec 2026", seats:"Institutional (Named User)", category:"Simulation" },
  { id:2, name:"Microsoft Office 365",version:"2024",   key:"O365-ABCD-EFGH-IJKL-MNOP", expiry:"Jun 2026", seats:"Single Named User",          category:"Productivity" },
  { id:3, name:"Adobe Acrobat Pro",   version:"DC 2024",key:"ADBE-1234-5678-9012-3456", expiry:"Mar 2026", seats:"Single Named User",          category:"Document" },
  { id:4, name:"ANSYS Academic",      version:"2024 R1",key:"ANSYS-ACAD-WXYZ-9999-2024",expiry:"Aug 2025", seats:"Dept. Pool (5 seats)",        category:"Simulation" },
];

const MAINTENANCE_INIT = [
  { id:1, assetId:"AST-0042", assetName:"HP LaserJet Printer", type:"Repair",    desc:"Paper feed roller replaced",       date:"2025-11-10", cost:1800, status:"Completed", vendor:"HP Authorised Centre" },
  { id:2, assetId:"AST-0102", assetName:"Oscilloscope",        type:"AMC",       desc:"Annual preventive maintenance",    date:"2025-09-05", cost:4500, status:"Completed", vendor:"Tektronix India" },
  { id:3, assetId:"AST-0041", assetName:"Dell Laptop",         type:"Issue",     desc:"Keyboard unresponsive — sent in",  date:"2026-01-22", cost:0,    status:"In Progress",vendor:"Dell Service Centre" },
  { id:4, assetId:"AST-0102", assetName:"Oscilloscope",        type:"Issue",     desc:"Probe calibration drift noticed",  date:"2026-02-10", cost:0,    status:"Pending",    vendor:"—" },
];

const STOCK_INIT = [
  { id:1, item:"A4 Paper Reams (500 sheets)", issued:10, remaining:3, unit:"reams",   date:"2026-01-05", category:"Stationery" },
  { id:2, item:"Whiteboard Markers (Set)",    issued:5,  remaining:1, unit:"sets",    date:"2026-01-10", category:"Stationery" },
  { id:3, item:"Printer Toner Cartridge",     issued:2,  remaining:0, unit:"units",   date:"2025-12-20", category:"IT Consumable" },
  { id:4, item:"Dusting Cloth / Wipes",       issued:20, remaining:8, unit:"pcs",     date:"2026-01-18", category:"Housekeeping" },
  { id:5, item:"Ethernet Patch Cables (1m)",  issued:6,  remaining:4, unit:"cables",  date:"2025-11-30", category:"IT Consumable" },
];

const DEPT_OPTIONS = ["Dept. Library", "Research Lab 2", "Admin Office", "ECE Lab 2", "AI Research Lab", "Central Store"];

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

const StatusDot = ({ status }) => {
  const map = {
    Assigned:       { color:T.success, bg:T.successLight  },
    Available:      { color:T.accent,  bg:T.accentLight   },
    "In Transfer":  { color:T.warning, bg:T.warningLight  },
    Completed:      { color:T.success, bg:T.successLight  },
    "In Progress":  { color:T.accent,  bg:T.accentLight   },
    Pending:        { color:T.warning, bg:T.warningLight  },
    Expired:        { color:T.danger,  bg:T.dangerLight   },
  };
  const s = map[status] || { color:T.textMute, bg:"#F1F5F9" };
  return (
    <Box display="flex" alignItems="center" gap={0.6} sx={{ px:1.2, py:0.35, borderRadius:"99px", bgcolor:s.bg, width:"fit-content" }}>
      <Box sx={{ width:6, height:6, borderRadius:"50%", bgcolor:s.color }} />
      <Typography sx={{ fontFamily:fBody, fontSize:"0.71rem", fontWeight:700, color:s.color }}>{status}</Typography>
    </Box>
  );
};

const ConditionBadge = ({ cond }) => {
  const map = { Excellent:T.success, Good:T.success, Fair:T.warning, "Needs Service":T.danger };
  const color = map[cond] || T.textMute;
  return (
    <Box sx={{ px:0.9, py:0.2, borderRadius:"5px", bgcolor:`${color}18`, border:`1px solid ${color}30`, display:"inline-block" }}>
      <Typography sx={{ fontFamily:fMono, fontSize:"0.64rem", fontWeight:700, color }}>{cond}</Typography>
    </Box>
  );
};

const typeIcon = (type) => {
  const map = { IT:<Devices sx={{fontSize:20}} />, Furniture:<Chair sx={{fontSize:20}} />, "Lab Equipment":<Science sx={{fontSize:20}} />, Vehicle:<DirectionsCar sx={{fontSize:20}} /> };
  return map[type] || <Inventory sx={{fontSize:20}} />;
};

const typeColor = (type) => {
  const map = { IT:T.accent, Furniture:T.warning, "Lab Equipment":T.success, Vehicle:T.danger };
  return map[type] || T.textMute;
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

/* ════════════════════════════════
   MAIN COMPONENT
════════════════════════════════ */
const AssetView = () => {
  const [tabIndex, setTabIndex]         = useState(0);
  const [assets, setAssets]             = useState(ASSETS_INIT);
  const [software]                      = useState(SOFTWARE_INIT);
  const [maintenance, setMaintenance]   = useState(MAINTENANCE_INIT);
  const [stock, setStock]               = useState(STOCK_INIT);

  /* Verification */
  const [verificationMode, setVerificationMode] = useState(false);
  const [verified, setVerified]                 = useState([]);

  /* Dialogs */
  const [transferDialog, setTransferDialog]   = useState(null); // asset object
  const [issueDialog, setIssueDialog]         = useState(null); // asset object
  const [stockDialog, setStockDialog]         = useState(false);
  const [expandAsset, setExpandAsset]         = useState(null);

  /* Form state */
  const [transferTarget, setTransferTarget]   = useState("");
  const [transferRemark, setTransferRemark]   = useState("");
  const [issueDesc, setIssueDesc]             = useState("");
  const [issueType, setIssueType]             = useState("Repair");
  const [stockItem, setStockItem]             = useState("");
  const [stockQty, setStockQty]               = useState("");
  const [stockReason, setStockReason]         = useState("");
  const [searchQ, setSearchQ]                 = useState("");

  const [snack, setSnack] = useState({ open:false, msg:"", severity:"success" });
  const toast = (msg, severity="success") => setSnack({ open:true, msg, severity });

  /* Handlers */
  const handleVerify = (id) => {
    if (!verified.includes(id)) setVerified(p => [...p, id]);
    toast("Asset physically verified and recorded!");
  };

  const handleTransfer = () => {
    if (!transferTarget) { toast("Please select a destination.", "error"); return; }
    setAssets(prev => prev.map(a => a.id === transferDialog.id ? { ...a, status:"In Transfer", location:transferTarget } : a));
    setMaintenance(prev => [{
      id: Date.now(), assetId: transferDialog.id, assetName: transferDialog.name,
      type:"Transfer", desc:`Transfer to ${transferTarget}. Remarks: ${transferRemark||"None"}`,
      date: new Date().toISOString().split("T")[0], cost:0, status:"In Progress", vendor:"Internal"
    }, ...prev]);
    setTransferDialog(null); setTransferTarget(""); setTransferRemark("");
    toast(`Transfer initiated to ${transferTarget}. HOD notification sent.`);
  };

  const handleReportIssue = () => {
    if (!issueDesc.trim()) { toast("Please describe the issue.", "error"); return; }
    setMaintenance(prev => [{
      id: Date.now(), assetId: issueDialog.id, assetName: issueDialog.name,
      type: issueType, desc: issueDesc,
      date: new Date().toISOString().split("T")[0], cost:0, status:"Pending", vendor:"—"
    }, ...prev]);
    setAssets(prev => prev.map(a => a.id === issueDialog.id ? { ...a, condition:"Needs Service" } : a));
    setIssueDialog(null); setIssueDesc(""); setIssueType("Repair");
    toast("Issue reported. Maintenance ticket raised and sent to admin.");
  };

  const handleStockRequest = () => {
    if (!stockItem.trim() || !stockQty) { toast("Please fill all fields.", "error"); return; }
    setStockDialog(false); setStockItem(""); setStockQty(""); setStockReason("");
    toast(`Stock request for "${stockItem}" (qty: ${stockQty}) submitted to stores.`);
  };

  const handleCopyKey = (key) => {
    navigator.clipboard.writeText(key).then(() => toast("License key copied to clipboard!"));
  };

  const filteredAssets = assets.filter(a =>
    !searchQ || a.name.toLowerCase().includes(searchQ.toLowerCase()) ||
    a.id.toLowerCase().includes(searchQ.toLowerCase()) || a.type.toLowerCase().includes(searchQ.toLowerCase())
  );

  const warrantyExpired = assets.filter(a => a.warranty === "Expired" || a.warranty === "N/A" ? false : new Date(a.warranty) < new Date());
  const needsService    = assets.filter(a => a.condition === "Needs Service").length;
  const pendingTasks    = maintenance.filter(m => m.status === "Pending" || m.status === "In Progress").length;

  const tabs = [
    { label:"Fixed Assets",        icon:Inventory, count:assets.length   },
    { label:"Software Licenses",   icon:VpnKey,    count:software.length  },
    { label:"Maintenance & AMC",   icon:Build,     count:pendingTasks     },
    { label:"Stock Register",      icon:SwapHoriz, count:stock.length     },
  ];

  return (
    <Box sx={{ p:3, bgcolor:T.bg, minHeight:"100vh", fontFamily:fBody }}>
      <Fonts />

      {/* ── Header ── */}
      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3} flexWrap="wrap" gap={2}>
        <Box>
          <Typography sx={{ fontFamily:fHead, fontWeight:700, fontSize:"1.5rem", color:T.text }}>Asset & Inventory Management</Typography>
          <Typography sx={{ fontFamily:fBody, fontSize:"0.82rem", color:T.textSub, mt:0.4 }}>
            Dr. Naveen Kumar &nbsp;·&nbsp; Faculty Cabin 3B &nbsp;·&nbsp; AY 2025–26
          </Typography>
        </Box>
        <Box display="flex" gap={2} alignItems="center">
          <FormControlLabel
            control={
              <Switch checked={verificationMode} onChange={e => setVerificationMode(e.target.checked)}
                sx={{ "& .MuiSwitch-switchBase.Mui-checked":{ color:T.accent }, "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":{ bgcolor:T.accent } }} />
            }
            label={
              <Typography sx={{ fontFamily:fBody, fontWeight:600, fontSize:"0.82rem", color: verificationMode ? T.accent : T.textMute }}>
                Annual Verification Mode
              </Typography>
            }
          />
          <Button size="small" variant="outlined" startIcon={<Download sx={{fontSize:15}} />}
            onClick={() => toast("Asset report exported as PDF.")}
            sx={{ fontFamily:fBody, fontWeight:600, fontSize:"0.76rem", textTransform:"none", borderRadius:"8px", borderColor:T.border, color:T.textSub, "&:hover":{borderColor:T.accent,color:T.accent} }}>
            Export Report
          </Button>
        </Box>
      </Box>

      {/* ── Verification Banner ── */}
      <Collapse in={verificationMode}>
        <Alert severity="warning" icon={<VerifiedUser />}
          action={
            <Button size="small" variant="outlined" color="warning" onClick={() => toast("Verification report submitted to admin!")}
              sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.74rem", textTransform:"none", borderRadius:"7px" }}>
              Submit Report
            </Button>
          }
          sx={{ mb:2.5, borderRadius:"10px", fontFamily:fBody, fontSize:"0.8rem", border:`1px solid ${T.warning}50` }}>
          <strong>Annual Verification Active:</strong> Physically confirm each asset assigned to you. &nbsp;
          <strong style={{color:T.warning}}>{verified.length} / {assets.length} verified</strong>
          <LinearProgress variant="determinate" value={(verified.length/assets.length)*100}
            sx={{ mt:1, height:4, borderRadius:99, bgcolor:"rgba(245,158,11,0.2)", "& .MuiLinearProgress-bar":{ bgcolor:T.warning } }} />
        </Alert>
      </Collapse>

      {/* ── Stat Strip ── */}
      <Grid container spacing={2} mb={3}>
        {[
          { label:"Total Assets",        value:assets.length,       sub:"Assigned to you",           color:T.accent,   icon:Inventory   },
          { label:"Needs Attention",     value:needsService,        sub:"Service or repair pending", color:T.danger,   icon:Build       },
          { label:"Open Maintenance",    value:pendingTasks,        sub:"Tickets in progress",       color:T.warning,  icon:AccessTime  },
          { label:"Software Licenses",   value:software.length,     sub:"Active allocations",        color:T.success,  icon:VpnKey      },
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

      {/* ── Tabs ── */}
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

          {/* ════ TAB 0: FIXED ASSETS ════ */}
          {tabIndex === 0 && (
            <Box className="fu">
              {/* Search + filter */}
              <Box display="flex" gap={1.5} mb={2.5} flexWrap="wrap">
                <TextField size="small" placeholder="Search by name, ID, or type..." value={searchQ} onChange={e=>setSearchQ(e.target.value)}
                  InputProps={{ startAdornment:<InputAdornment position="start"><Search sx={{fontSize:16,color:T.textMute}} /></InputAdornment> }}
                  sx={{ width:260, "& .MuiOutlinedInput-root":{ borderRadius:"8px", fontFamily:fBody, fontSize:"0.82rem", "& fieldset":{borderColor:T.border}, "&.Mui-focused fieldset":{borderColor:T.accent} } }} />
                <Box ml="auto" display="flex" alignItems="center">
                  <Typography sx={{ fontFamily:fBody, fontSize:"0.76rem", color:T.textMute }}>{filteredAssets.length} asset{filteredAssets.length!==1?"s":""}</Typography>
                </Box>
              </Box>

              <Grid container spacing={2}>
                {filteredAssets.map(asset => {
                  const isExpired   = asset.warranty !== "N/A" && asset.warranty !== "Expired" && new Date(asset.warranty) < new Date();
                  const isVerified  = verified.includes(asset.id);
                  const tc          = typeColor(asset.type);

                  return (
                    <Grid item xs={12} md={6} key={asset.id}>
                      <SCard sx={{ overflow:"hidden", borderLeft:`4px solid ${tc}`, "&:hover":{boxShadow:"0 4px 16px rgba(0,0,0,0.07)"}, transition:"box-shadow 0.2s" }}>
                        {/* Card top */}
                        <Box sx={{ p:2.5 }}>
                          <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1.5}>
                            <Box display="flex" gap={1.5} alignItems="flex-start">
                              <Box sx={{ p:1.1, borderRadius:"10px", bgcolor:`${tc}15`, color:tc, flexShrink:0 }}>
                                {typeIcon(asset.type)}
                              </Box>
                              <Box>
                                <Typography sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.88rem", color:T.text, lineHeight:1.3 }}>{asset.name}</Typography>
                                <Typography sx={{ fontFamily:fMono, fontSize:"0.68rem", color:T.textMute, mt:0.2 }}>{asset.id} &nbsp;·&nbsp; S/N: {asset.serial}</Typography>
                              </Box>
                            </Box>
                            {verificationMode
                              ? isVerified
                                ? <Box sx={{ px:1.2, py:0.4, borderRadius:"8px", bgcolor:T.successLight }}>
                                    <Typography sx={{ fontFamily:fMono, fontSize:"0.65rem", fontWeight:700, color:T.success }}>✓ Verified</Typography>
                                  </Box>
                                : <Box sx={{ px:1.2, py:0.4, borderRadius:"8px", bgcolor:T.warningLight }}>
                                    <Typography sx={{ fontFamily:fMono, fontSize:"0.65rem", fontWeight:700, color:T.warning }}>Unverified</Typography>
                                  </Box>
                              : <StatusDot status={asset.status} />
                            }
                          </Box>

                          {/* Detail grid */}
                          <Grid container spacing={1.5} mb={1.5}>
                            {[
                              { label:"Location",   value:asset.location },
                              { label:"Purchase",   value:asset.purchaseDate },
                              { label:"Warranty",   value:asset.warranty,      warn: isExpired || asset.warranty==="Expired" },
                              { label:"Condition",  value:null, custom:<ConditionBadge cond={asset.condition} /> },
                            ].map(d => (
                              <Grid item xs={6} key={d.label}>
                                <SLabel sx={{ mb:0.3 }}>{d.label}</SLabel>
                                {d.custom || (
                                  <Typography sx={{ fontFamily:fBody, fontSize:"0.78rem", color: d.warn ? T.danger : T.text, fontWeight: d.warn ? 700 : 500 }}>
                                    {d.value} {d.warn && "⚠"}
                                  </Typography>
                                )}
                              </Grid>
                            ))}
                          </Grid>

                          {/* Book value */}
                          <Box sx={{ px:1.5, py:1, borderRadius:"8px", bgcolor:"#F9FAFB", border:`1px solid ${T.border}`, mb:1.5 }}>
                            <Box display="flex" justifyContent="space-between">
                              <Typography sx={{ fontFamily:fBody, fontSize:"0.72rem", color:T.textMute }}>Book Value</Typography>
                              <Typography sx={{ fontFamily:fMono, fontSize:"0.78rem", fontWeight:700, color:T.text }}>₹{asset.value.toLocaleString()}</Typography>
                            </Box>
                          </Box>
                        </Box>

                        <Divider sx={{ borderColor:T.border }} />

                        {/* Action buttons */}
                        <Box sx={{ px:2.5, py:1.5, display:"flex", gap:1, justifyContent:"flex-end" }}>
                          {verificationMode ? (
                            isVerified
                              ? <Button size="small" startIcon={<CheckCircle sx={{fontSize:14}} />} disabled
                                  sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.74rem", textTransform:"none", borderRadius:"8px", color:T.success }}>
                                  Confirmed
                                </Button>
                              : <Button size="small" variant="contained" startIcon={<VerifiedUser sx={{fontSize:14}} />}
                                  onClick={() => handleVerify(asset.id)}
                                  sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.74rem", textTransform:"none", borderRadius:"8px", bgcolor:T.accent, boxShadow:"none", "&:hover":{bgcolor:"#4F46E5",boxShadow:"none"} }}>
                                  Confirm Possession
                                </Button>
                          ) : (
                            <>
                              <Button size="small" variant="outlined" startIcon={<Build sx={{fontSize:13}} />}
                                onClick={() => setIssueDialog(asset)}
                                sx={{ fontFamily:fBody, fontWeight:600, fontSize:"0.73rem", textTransform:"none", borderRadius:"8px", color:T.danger, borderColor:`${T.danger}50`, "&:hover":{borderColor:T.danger,bgcolor:T.dangerLight} }}>
                                Report Issue
                              </Button>
                              <Button size="small" variant="outlined" startIcon={<SwapHoriz sx={{fontSize:13}} />}
                                onClick={() => setTransferDialog(asset)}
                                sx={{ fontFamily:fBody, fontWeight:600, fontSize:"0.73rem", textTransform:"none", borderRadius:"8px", color:T.textSub, borderColor:T.border, "&:hover":{borderColor:T.accent,color:T.accent} }}>
                                Transfer
                              </Button>
                            </>
                          )}
                        </Box>
                      </SCard>
                    </Grid>
                  );
                })}
              </Grid>
            </Box>
          )}

          {/* ════ TAB 1: SOFTWARE LICENSES ════ */}
          {tabIndex === 1 && (
            <Box className="fu">
              <Grid container spacing={2}>
                {software.map(lic => {
                  const expiring = new Date(lic.expiry) < new Date(Date.now() + 90*24*60*60*1000);
                  const expired  = new Date(lic.expiry) < new Date();
                  return (
                    <Grid item xs={12} md={6} key={lic.id}>
                      <SCard sx={{ p:2.5, "&:hover":{boxShadow:"0 4px 16px rgba(0,0,0,0.07)"}, transition:"box-shadow 0.2s", borderTop:`3px solid ${expired ? T.danger : expiring ? T.warning : T.success}` }}>
                        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1.5}>
                          <Box>
                            <Typography sx={{ fontFamily:fHead, fontWeight:700, fontSize:"0.95rem", color:T.text }}>{lic.name}</Typography>
                            <Box sx={{ px:0.9, py:0.2, borderRadius:"5px", bgcolor:T.accentLight, display:"inline-block", mt:0.5 }}>
                              <Typography sx={{ fontFamily:fMono, fontSize:"0.65rem", fontWeight:700, color:T.accent }}>{lic.category}</Typography>
                            </Box>
                          </Box>
                          <Box sx={{ px:1.2, py:0.35, borderRadius:"7px", bgcolor: expired ? T.dangerLight : expiring ? T.warningLight : T.successLight }}>
                            <Typography sx={{ fontFamily:fMono, fontSize:"0.68rem", fontWeight:700, color: expired ? T.danger : expiring ? T.warning : T.success }}>
                              {expired ? "Expired" : expiring ? "Expiring Soon" : "Active"}
                            </Typography>
                          </Box>
                        </Box>

                        {/* Key display */}
                        <Box sx={{ p:1.5, borderRadius:"8px", bgcolor:"#F9FAFB", border:`1px dashed ${T.border}`, display:"flex", justifyContent:"space-between", alignItems:"center", mb:2 }}>
                          <Typography sx={{ fontFamily:fMono, fontSize:"0.75rem", color:T.textSub, letterSpacing:"0.05em" }}>{lic.key}</Typography>
                          <Tooltip title="Copy license key">
                            <IconButton size="small" onClick={() => handleCopyKey(lic.key)}
                              sx={{ bgcolor:T.accentLight, color:T.accent, borderRadius:"7px", "&:hover":{bgcolor:"#DBEAFE"} }}>
                              <ContentCopy sx={{ fontSize:14 }} />
                            </IconButton>
                          </Tooltip>
                        </Box>

                        <Grid container spacing={1.5}>
                          {[
                            { label:"Version",    value:lic.version },
                            { label:"Valid Till", value:lic.expiry, warn: expiring || expired },
                            { label:"Seat Type",  value:lic.seats  },
                          ].map(d => (
                            <Grid item xs={d.label==="Seat Type" ? 12 : 6} key={d.label}>
                              <SLabel sx={{ mb:0.3 }}>{d.label}</SLabel>
                              <Typography sx={{ fontFamily:fBody, fontSize:"0.78rem", color: d.warn ? (expired ? T.danger : T.warning) : T.text, fontWeight:500 }}>
                                {d.value} {d.warn && !expired && "⚠"}
                              </Typography>
                            </Grid>
                          ))}
                        </Grid>

                        {expiring && !expired && (
                          <Alert severity="warning" icon={<Warning sx={{fontSize:16}} />}
                            sx={{ mt:1.5, py:0.5, borderRadius:"8px", fontFamily:fBody, fontSize:"0.74rem" }}>
                            Renewal required before <strong>{lic.expiry}</strong>
                          </Alert>
                        )}
                      </SCard>
                    </Grid>
                  );
                })}
              </Grid>
            </Box>
          )}

          {/* ════ TAB 2: MAINTENANCE ════ */}
          {tabIndex === 2 && (
            <Box className="fu">
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2.5}>
                <Typography sx={{ fontFamily:fHead, fontWeight:700, fontSize:"0.95rem", color:T.text }}>
                  Service & Repair Log
                  <Typography component="span" sx={{ fontFamily:fBody, fontSize:"0.76rem", color:T.textMute, ml:1.5 }}>{maintenance.length} entries</Typography>
                </Typography>
                <Button size="small" variant="outlined" startIcon={<Add sx={{fontSize:14}} />}
                  onClick={() => { setIssueDialog({ id:"—", name:"Select asset above" }); }}
                  sx={{ fontFamily:fBody, fontWeight:600, fontSize:"0.75rem", textTransform:"none", borderRadius:"8px", borderColor:T.border, color:T.textSub, "&:hover":{borderColor:T.accent,color:T.accent} }}>
                  Log Issue
                </Button>
              </Box>

              {pendingTasks > 0 && (
                <Alert severity="info" icon={<Info sx={{fontSize:16}} />}
                  sx={{ mb:2, borderRadius:"8px", fontFamily:fBody, fontSize:"0.78rem", border:`1px solid ${T.accent}30` }}>
                  <strong>{pendingTasks} open ticket{pendingTasks>1?"s":""}</strong> require action or follow-up.
                </Alert>
              )}

              <Box sx={{ borderRadius:"10px", border:`1px solid ${T.border}`, overflow:"hidden" }}>
                <Table>
                  <TableHead>
                    <TableRow><TH>Asset</TH><TH>Type</TH><TH>Description</TH><TH>Date</TH><TH>Cost</TH><TH>Vendor</TH><TH>Status</TH></TableRow>
                  </TableHead>
                  <TableBody>
                    {maintenance.map(log => (
                      <TableRow key={log.id} className="row-h">
                        <TD>
                          <Typography sx={{ fontFamily:fBody, fontWeight:600, fontSize:"0.8rem", color:T.text }}>{log.assetName}</Typography>
                          <Typography sx={{ fontFamily:fMono, fontSize:"0.66rem", color:T.textMute }}>{log.assetId}</Typography>
                        </TD>
                        <TD>
                          <Box sx={{ px:0.9, py:0.2, borderRadius:"5px", bgcolor:
                            log.type==="Repair" ? T.dangerLight : log.type==="AMC" ? T.accentLight :
                            log.type==="Transfer" ? T.warningLight : T.successLight, display:"inline-block" }}>
                            <Typography sx={{ fontFamily:fMono, fontSize:"0.64rem", fontWeight:700, color:
                              log.type==="Repair" ? T.danger : log.type==="AMC" ? T.accent :
                              log.type==="Transfer" ? T.warning : T.success }}>
                              {log.type}
                            </Typography>
                          </Box>
                        </TD>
                        <TD sx={{ maxWidth:200 }}>
                          <Typography sx={{ fontFamily:fBody, fontSize:"0.78rem", color:T.textSub }}>{log.desc}</Typography>
                        </TD>
                        <TD><Typography sx={{ fontFamily:fMono, fontSize:"0.74rem", color:T.textMute }}>{log.date}</Typography></TD>
                        <TD>
                          <Typography sx={{ fontFamily:fMono, fontSize:"0.76rem", fontWeight:600, color: log.cost>0 ? T.text : T.textMute }}>
                            {log.cost > 0 ? `₹${log.cost.toLocaleString()}` : "—"}
                          </Typography>
                        </TD>
                        <TD><Typography sx={{ fontFamily:fBody, fontSize:"0.76rem", color:T.textMute }}>{log.vendor}</Typography></TD>
                        <TD><StatusDot status={log.status} /></TD>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            </Box>
          )}

          {/* ════ TAB 3: STOCK REGISTER ════ */}
          {tabIndex === 3 && (
            <Box className="fu">
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2.5}>
                <Typography sx={{ fontFamily:fHead, fontWeight:700, fontSize:"0.95rem", color:T.text }}>
                  Consumables Stock Register
                </Typography>
                <Button variant="contained" size="small" startIcon={<Add sx={{fontSize:14}} />}
                  onClick={() => setStockDialog(true)}
                  sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.75rem", textTransform:"none", borderRadius:"8px", bgcolor:T.accent, boxShadow:"none", "&:hover":{bgcolor:"#4F46E5",boxShadow:"none"} }}>
                  Request Stock
                </Button>
              </Box>

              {stock.filter(s=>s.remaining===0).length > 0 && (
                <Alert severity="error" icon={<ErrorOutline sx={{fontSize:16}} />}
                  sx={{ mb:2, borderRadius:"8px", fontFamily:fBody, fontSize:"0.78rem", border:`1px solid ${T.danger}30` }}>
                  <strong>{stock.filter(s=>s.remaining===0).length} item{stock.filter(s=>s.remaining===0).length>1?"s":""} out of stock.</strong> Request replenishment immediately.
                </Alert>
              )}

              <Box sx={{ borderRadius:"10px", border:`1px solid ${T.border}`, overflow:"hidden" }}>
                <Table>
                  <TableHead>
                    <TableRow><TH>Item</TH><TH>Category</TH><TH>Last Issued</TH><TH>Qty Issued</TH><TH>Est. Remaining</TH><TH>Stock Level</TH></TableRow>
                  </TableHead>
                  <TableBody>
                    {stock.map(item => {
                      const pct     = Math.round((item.remaining / item.issued) * 100);
                      const isEmpty = item.remaining === 0;
                      const isLow   = item.remaining <= Math.ceil(item.issued * 0.2) && !isEmpty;
                      return (
                        <TableRow key={item.id} className="row-h">
                          <TD sx={{ fontWeight:600, color:T.text }}>{item.item}</TD>
                          <TD>
                            <Box sx={{ px:0.9, py:0.2, borderRadius:"5px", bgcolor:T.accentLight, display:"inline-block" }}>
                              <Typography sx={{ fontFamily:fMono, fontSize:"0.64rem", fontWeight:700, color:T.accent }}>{item.category}</Typography>
                            </Box>
                          </TD>
                          <TD><Typography sx={{ fontFamily:fMono, fontSize:"0.74rem", color:T.textMute }}>{item.date}</Typography></TD>
                          <TD><Typography sx={{ fontFamily:fMono, fontSize:"0.8rem" }}>{item.issued} {item.unit}</Typography></TD>
                          <TD>
                            <Typography sx={{ fontFamily:fMono, fontSize:"0.8rem", fontWeight:700, color: isEmpty ? T.danger : isLow ? T.warning : T.text }}>
                              {item.remaining} {item.unit}
                              {isEmpty && <Typography component="span" sx={{ fontFamily:fBody, fontSize:"0.65rem", color:T.danger, ml:0.5 }}>Out of Stock</Typography>}
                              {isLow && !isEmpty && <Typography component="span" sx={{ fontFamily:fBody, fontSize:"0.65rem", color:T.warning, ml:0.5 }}>Low</Typography>}
                            </Typography>
                          </TD>
                          <TD sx={{ width:100 }}>
                            <Box>
                              <LinearProgress variant="determinate" value={isEmpty ? 0 : pct}
                                sx={{ height:5, borderRadius:99, bgcolor:T.border, "& .MuiLinearProgress-bar":{ bgcolor: isEmpty ? T.danger : isLow ? T.warning : T.success, borderRadius:99 } }} />
                              <Typography sx={{ fontFamily:fMono, fontSize:"0.62rem", color:T.textMute, mt:0.3 }}>{isEmpty ? 0 : pct}%</Typography>
                            </Box>
                          </TD>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </Box>
            </Box>
          )}

        </Box>
      </SCard>

      {/* ══════════════════════════════════════
          TRANSFER DIALOG
      ══════════════════════════════════════ */}
      <Dialog open={!!transferDialog} onClose={() => setTransferDialog(null)} maxWidth="sm" fullWidth
        PaperProps={{ sx:{ borderRadius:"16px", border:`1px solid ${T.border}` } }}>
        <DialogTitle sx={{ fontFamily:fHead, fontWeight:700, fontSize:"1rem", color:T.text, borderBottom:`1px solid ${T.border}`, bgcolor:"#FAFBFD", pb:2 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box display="flex" alignItems="center" gap={1.2}>
              <Box sx={{ width:4, height:22, borderRadius:2, bgcolor:T.warning }} />
              Initiate Asset Transfer
            </Box>
            <IconButton size="small" onClick={() => setTransferDialog(null)} sx={{ bgcolor:"#F1F5F9", borderRadius:"8px" }}><Close fontSize="small" /></IconButton>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ px:3, pt:3, pb:2 }}>
          {transferDialog && (
            <Stack spacing={2.2}>
              <Box sx={{ p:2, borderRadius:"10px", bgcolor:"#F9FAFB", border:`1px solid ${T.border}` }}>
                <SLabel>Asset Being Transferred</SLabel>
                <Typography sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.88rem", color:T.text }}>{transferDialog.name}</Typography>
                <Typography sx={{ fontFamily:fMono, fontSize:"0.7rem", color:T.textMute }}>{transferDialog.id} &nbsp;·&nbsp; {transferDialog.serial}</Typography>
              </Box>
              <DField label="Transfer To *">
                <DInput select value={transferTarget} onChange={e=>setTransferTarget(e.target.value)}>
                  {DEPT_OPTIONS.map(d=><MenuItem key={d} value={d} sx={{fontFamily:fBody,fontSize:"0.82rem"}}>{d}</MenuItem>)}
                </DInput>
              </DField>
              <DField label="Condition / Remarks">
                <DInput multiline rows={2} value={transferRemark} onChange={e=>setTransferRemark(e.target.value)}
                  placeholder="e.g. Working condition, all accessories included, charger missing..." />
              </DField>
              <Alert severity="info" sx={{ borderRadius:"8px", fontFamily:fBody, fontSize:"0.76rem" }}>
                Transfer request will be sent to your HOD for approval. Asset status will update to "In Transfer".
              </Alert>
            </Stack>
          )}
        </DialogContent>
        <DialogActions sx={{ px:3, pb:3, borderTop:`1px solid ${T.border}`, pt:2, bgcolor:"#FAFBFD", gap:1 }}>
          <Button onClick={() => setTransferDialog(null)} variant="outlined"
            sx={{ fontFamily:fBody, fontWeight:600, fontSize:"0.8rem", textTransform:"none", borderRadius:"8px", borderColor:T.border, color:T.textSub }}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleTransfer} startIcon={<Send sx={{fontSize:15}} />}
            sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.8rem", textTransform:"none", borderRadius:"8px", bgcolor:T.warning, boxShadow:"none", color:"#fff", "&:hover":{bgcolor:"#D97706",boxShadow:"none"} }}>
            Submit Transfer Request
          </Button>
        </DialogActions>
      </Dialog>

      {/* ══════════════════════════════════════
          REPORT ISSUE DIALOG
      ══════════════════════════════════════ */}
      <Dialog open={!!issueDialog} onClose={() => setIssueDialog(null)} maxWidth="sm" fullWidth
        PaperProps={{ sx:{ borderRadius:"16px", border:`1px solid ${T.border}` } }}>
        <DialogTitle sx={{ fontFamily:fHead, fontWeight:700, fontSize:"1rem", color:T.text, borderBottom:`1px solid ${T.border}`, bgcolor:"#FAFBFD", pb:2 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box display="flex" alignItems="center" gap={1.2}>
              <Box sx={{ width:4, height:22, borderRadius:2, bgcolor:T.danger }} />
              Report Asset Issue
            </Box>
            <IconButton size="small" onClick={() => setIssueDialog(null)} sx={{ bgcolor:"#F1F5F9", borderRadius:"8px" }}><Close fontSize="small" /></IconButton>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ px:3, pt:3, pb:2 }}>
          {issueDialog && (
            <Stack spacing={2.2}>
              <Box sx={{ p:2, borderRadius:"10px", bgcolor:T.dangerLight, border:`1px solid ${T.danger}30` }}>
                <SLabel>Asset</SLabel>
                <Typography sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.88rem", color:T.text }}>{issueDialog.name}</Typography>
                <Typography sx={{ fontFamily:fMono, fontSize:"0.7rem", color:T.textMute }}>{issueDialog.id}</Typography>
              </Box>
              <DField label="Issue Type">
                <DInput select value={issueType} onChange={e=>setIssueType(e.target.value)}>
                  {["Repair","Replacement","AMC","Other"].map(t=><MenuItem key={t} value={t} sx={{fontFamily:fBody,fontSize:"0.82rem"}}>{t}</MenuItem>)}
                </DInput>
              </DField>
              <DField label="Issue Description *">
                <DInput multiline rows={3} value={issueDesc} onChange={e=>setIssueDesc(e.target.value)}
                  placeholder="Describe the fault, when it occurred, and any immediate impact on your work..." />
              </DField>
              <Alert severity="warning" sx={{ borderRadius:"8px", fontFamily:fBody, fontSize:"0.76rem" }}>
                A maintenance ticket will be raised and sent to the admin office. Asset condition will be updated.
              </Alert>
            </Stack>
          )}
        </DialogContent>
        <DialogActions sx={{ px:3, pb:3, borderTop:`1px solid ${T.border}`, pt:2, bgcolor:"#FAFBFD", gap:1 }}>
          <Button onClick={() => setIssueDialog(null)} variant="outlined"
            sx={{ fontFamily:fBody, fontWeight:600, fontSize:"0.8rem", textTransform:"none", borderRadius:"8px", borderColor:T.border, color:T.textSub }}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleReportIssue} startIcon={<Build sx={{fontSize:15}} />}
            sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.8rem", textTransform:"none", borderRadius:"8px", bgcolor:T.danger, boxShadow:"none", "&:hover":{bgcolor:"#DC2626",boxShadow:"none"} }}>
            Submit Issue Report
          </Button>
        </DialogActions>
      </Dialog>

      {/* ══════════════════════════════════════
          STOCK REQUEST DIALOG
      ══════════════════════════════════════ */}
      <Dialog open={stockDialog} onClose={() => setStockDialog(false)} maxWidth="xs" fullWidth
        PaperProps={{ sx:{ borderRadius:"16px", border:`1px solid ${T.border}` } }}>
        <DialogTitle sx={{ fontFamily:fHead, fontWeight:700, fontSize:"1rem", color:T.text, borderBottom:`1px solid ${T.border}`, bgcolor:"#FAFBFD", pb:2 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box display="flex" alignItems="center" gap={1.2}>
              <Box sx={{ width:4, height:22, borderRadius:2, bgcolor:T.accent }} />
              Request Stock
            </Box>
            <IconButton size="small" onClick={() => setStockDialog(false)} sx={{ bgcolor:"#F1F5F9", borderRadius:"8px" }}><Close fontSize="small" /></IconButton>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ px:3, pt:3, pb:2 }}>
          <Stack spacing={2.2}>
            <DField label="Item Name *">
              <DInput value={stockItem} onChange={e=>setStockItem(e.target.value)} placeholder="e.g. A4 Paper Reams" />
            </DField>
            <DField label="Quantity Required *">
              <DInput type="number" value={stockQty} onChange={e=>setStockQty(e.target.value)} placeholder="e.g. 5" />
            </DField>
            <DField label="Reason / Justification">
              <DInput multiline rows={2} value={stockReason} onChange={e=>setStockReason(e.target.value)} placeholder="e.g. Stock depleted, needed for semester-end reporting..." />
            </DField>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px:3, pb:3, borderTop:`1px solid ${T.border}`, pt:2, bgcolor:"#FAFBFD", gap:1 }}>
          <Button onClick={() => setStockDialog(false)} variant="outlined"
            sx={{ fontFamily:fBody, fontWeight:600, fontSize:"0.8rem", textTransform:"none", borderRadius:"8px", borderColor:T.border, color:T.textSub }}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleStockRequest} startIcon={<Send sx={{fontSize:15}} />}
            sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.8rem", textTransform:"none", borderRadius:"8px", bgcolor:T.accent, boxShadow:"none", "&:hover":{bgcolor:"#4F46E5",boxShadow:"none"} }}>
            Submit Request
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar open={snack.open} autoHideDuration={3500} onClose={()=>setSnack(s=>({...s,open:false}))} anchorOrigin={{ vertical:"bottom", horizontal:"center" }}>
        <MuiAlert severity={snack.severity} sx={{ borderRadius:"10px", fontFamily:fBody, fontWeight:600 }} onClose={()=>setSnack(s=>({...s,open:false}))}>
          {snack.msg}
        </MuiAlert>
      </Snackbar>
    </Box>
  );
};

export default AssetView;