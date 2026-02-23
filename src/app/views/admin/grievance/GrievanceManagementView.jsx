import React, { useState } from "react";
import {
  Box, Grid, Typography, Button, Table, TableBody, TableCell,
  TableHead, TableRow, IconButton, Tooltip, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, MenuItem, Avatar,
  Stack, Divider, Snackbar, Alert, Chip, InputAdornment, Tabs, Tab,
  Collapse
} from "@mui/material";
import {
  Visibility, Gavel, PersonOff, Security, CloudUpload,
  CheckCircle, Send, Flag, Close, Warning, Search,
  Shield, History, TrendingUp, AssignmentLate, Lock,
  ErrorOutline, InfoOutlined, Timeline, Download,
  MarkEmailRead, Add, Verified
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";

const HiddenInput = styled("input")({ display:"none" });

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
    .fu2 { animation: fadeUp 0.32s 0.12s ease both; }
    .fu3 { animation: fadeUp 0.32s 0.18s ease both; }
    .row-h:hover { background:#F9FAFB !important; transition:background 0.15s; }
    @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.5} }
    .blink { animation: pulse 2s infinite; }
  `}</style>
);

/* ── Mock Data ── */
const TICKETS_INIT = [
  {
    id:"TKT-2026-001", category:"Harassment",  priority:"High",
    by:"Anonymous",          dept:"—",     date:"2026-02-01",
    status:"Under Review",   sla:2,         assignedTo:"Dr. S. Nair (ICC)",
    description:"Allegation of workplace harassment by a senior colleague. Specific incidents reported on 28-Jan and 30-Jan.",
    timeline:[
      { date:"2026-02-01", event:"Ticket raised (Anonymous)" },
      { date:"2026-02-02", event:"Assigned to Internal Complaints Committee" },
      { date:"2026-02-03", event:"Preliminary review initiated" },
    ],
    notes:""
  },
  {
    id:"TKT-2026-002", category:"Facilities",  priority:"Medium",
    by:"Dr. Sarah Smith",    dept:"CSE",    date:"2026-01-28",
    status:"Proposed Resolution", sla:5,   assignedTo:"Facilities Manager",
    description:"Lab infrastructure in Block-C is inadequate — broken air conditioning and insufficient seating causing productivity loss.",
    timeline:[
      { date:"2026-01-28", event:"Ticket raised by Dr. Sarah Smith" },
      { date:"2026-01-30", event:"Site inspection completed" },
      { date:"2026-02-02", event:"Resolution proposed: repair scheduled for 10-Feb" },
    ],
    notes:"Facility team confirmed repair slot on 10-Feb. Communicating to faculty."
  },
  {
    id:"TKT-2026-003", category:"Salary",      priority:"High",
    by:"Prof. Rajan Kumar",  dept:"Mech",   date:"2026-02-03",
    status:"Open",           sla:7,         assignedTo:"HR Head",
    description:"Salary arrears for Jan 2026 not credited despite payroll confirmation. Discrepancy of ₹14,000 observed.",
    timeline:[
      { date:"2026-02-03", event:"Ticket raised by Prof. Rajan Kumar" },
    ],
    notes:""
  },
  {
    id:"TKT-2026-004", category:"Discrimination", priority:"High",
    by:"Anonymous",          dept:"—",     date:"2026-01-20",
    status:"Closed",         sla:0,         assignedTo:"Ombudsperson",
    description:"Complaint of unfair evaluation practices in faculty review cycle.",
    timeline:[
      { date:"2026-01-20", event:"Ticket raised (Anonymous)" },
      { date:"2026-01-23", event:"Investigation initiated" },
      { date:"2026-01-28", event:"Findings presented to committee" },
      { date:"2026-02-01", event:"Resolved — no policy breach found" },
    ],
    notes:"Investigation complete. No policy breach found. Complainant notified via secure channel."
  },
];

const HISTORY_INIT = [
  { id:"TKT-2025-088", category:"Facilities",   by:"Mr. A. Kumar",  date:"2025-12-10", status:"Closed",  resolvedBy:"Facilities Manager", note:"AC repaired within 3 days."  },
  { id:"TKT-2025-077", category:"Salary",        by:"Ms. P. Roy",    date:"2025-11-22", status:"Closed",  resolvedBy:"Finance Admin",       note:"Arrears credited on 30-Nov." },
  { id:"TKT-2025-063", category:"Harassment",    by:"Anonymous",     date:"2025-10-05", status:"Closed",  resolvedBy:"ICC Committee",       note:"Warning issued to respondent."},
];

const COMMITTEE_MEMBERS = [
  "Dr. S. Nair (Internal Complaints Committee)",
  "HR Head — Mr. P. Varma",
  "Ombudsperson — Prof. L. Dixit",
  "Facilities Manager — Mr. R. Das",
  "Finance Admin — Ms. K. Mehta",
  "Academic Dean — Dr. T. Iyer",
];

const STATUS_OPTIONS = ["Open","Under Review","Proposed Resolution","Closed"];

const CATEGORY_STYLE = {
  Harassment:     { color:T.danger,   bg:T.dangerLight,  },
  Discrimination: { color:T.danger,   bg:T.dangerLight,  },
  Facilities:     { color:T.warning,  bg:T.warningLight, },
  Salary:         { color:"#7C3AED",  bg:"#F5F3FF",      },
  Academic:       { color:T.accent,   bg:T.accentLight,  },
};

const PRIORITY_STYLE = {
  High:   { color:T.danger,  bg:T.dangerLight  },
  Medium: { color:T.warning, bg:T.warningLight },
  Low:    { color:T.success, bg:T.successLight },
};

/* ── Helpers ── */
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

const CatBadge = ({ category }) => {
  const s = CATEGORY_STYLE[category] || { color:T.textMute, bg:"#F1F5F9" };
  return (
    <Box sx={{ px:1.1, py:0.32, borderRadius:"6px", bgcolor:s.bg, display:"inline-block" }}>
      <Typography sx={{ fontFamily:fBody, fontSize:"0.71rem", fontWeight:700, color:s.color }}>{category}</Typography>
    </Box>
  );
};

const PriorityDot = ({ priority }) => {
  const s = PRIORITY_STYLE[priority] || { color:T.textMute, bg:"#F1F5F9" };
  return (
    <Box display="flex" alignItems="center" gap={0.6}
      sx={{ px:1, py:0.28, borderRadius:"99px", bgcolor:s.bg, width:"fit-content" }}>
      <Box sx={{ width:6, height:6, borderRadius:"50%", bgcolor:s.color }} />
      <Typography sx={{ fontFamily:fBody, fontSize:"0.69rem", fontWeight:700, color:s.color }}>{priority}</Typography>
    </Box>
  );
};

const StatusPill = ({ status }) => {
  const map = {
    Open:                  { color:T.danger,  bg:T.dangerLight   },
    "Under Review":        { color:T.warning, bg:T.warningLight  },
    "Proposed Resolution": { color:T.accent,  bg:T.accentLight   },
    Closed:                { color:T.success, bg:T.successLight  },
  };
  const s = map[status] || { color:T.textMute, bg:"#F1F5F9" };
  return (
    <Box display="flex" alignItems="center" gap={0.6}
      sx={{ px:1.2, py:0.35, borderRadius:"99px", bgcolor:s.bg, width:"fit-content" }}>
      <Box sx={{ width:6, height:6, borderRadius:"50%", bgcolor:s.color }} className={status==="Open"?"blink":""} />
      <Typography sx={{ fontFamily:fBody, fontSize:"0.71rem", fontWeight:700, color:s.color }}>{status}</Typography>
    </Box>
  );
};

const SlaBar = ({ days }) => {
  const isUrgent = days < 3;
  const isMed    = days < 7;
  const color    = isUrgent ? T.danger : isMed ? T.warning : T.success;
  const pct      = Math.min((days / 10) * 100, 100);
  return (
    <Box>
      <Box display="flex" alignItems="center" gap={1} mb={0.4}>
        <Typography sx={{ fontFamily:fMono, fontSize:"0.78rem", fontWeight:700, color }}>
          {days}d
        </Typography>
        {isUrgent && <Warning sx={{ fontSize:13, color:T.danger }} />}
      </Box>
      <Box sx={{ width:60, height:5, borderRadius:99, bgcolor:T.border }}>
        <Box sx={{
          height:"100%", width:`${pct}%`, borderRadius:99, bgcolor:color,
          transition:"width 1s ease"
        }} />
      </Box>
    </Box>
  );
};

const AnonBadge = () => (
  <Box display="flex" alignItems="center" gap={0.7}
    sx={{ px:1.1, py:0.3, borderRadius:"7px", bgcolor:"#F1F5F9", width:"fit-content" }}>
    <PersonOff sx={{ fontSize:13, color:T.textMute }} />
    <Typography sx={{ fontFamily:fBody, fontSize:"0.72rem", fontWeight:700, color:T.textMute, fontStyle:"italic" }}>
      Anonymous
    </Typography>
    <Lock sx={{ fontSize:11, color:T.textMute }} />
  </Box>
);

const DInput = (props) => (
  <TextField size="small" fullWidth {...props} sx={{
    "& .MuiOutlinedInput-root":{
      borderRadius:"8px", fontFamily:fBody, fontSize:"0.82rem", bgcolor:T.surface,
      "& fieldset":{ borderColor:T.border },
      "&.Mui-focused fieldset":{ borderColor:T.accent }
    },
    "& .MuiInputLabel-root.Mui-focused":{ color:T.accent },
    ...props.sx
  }} />
);

/* ════════════════════════════════
   MAIN COMPONENT
════════════════════════════════ */
const GrievanceManagementView = () => {
  const [tickets, setTickets]   = useState(TICKETS_INIT);
  const [history]               = useState(HISTORY_INIT);
  const [tabIndex, setTabIndex] = useState(0);
  const [searchQ, setSearchQ]   = useState("");
  const [catFilter, setCatFilter] = useState("All");

  /* Dialog */
  const [dialog, setDialog]     = useState(null);
  const [assignTo, setAssignTo] = useState("");
  const [newStatus, setNewStatus] = useState("");
  const [noteText, setNoteText] = useState("");
  const [uploadFile, setUploadFile] = useState(null);
  const [snack, setSnack]       = useState({ open:false, msg:"", severity:"success" });

  const toast = (msg, severity="success") => setSnack({ open:true, msg, severity });

  const active   = tickets.filter(t => t.status !== "Closed");
  const closed   = tickets.filter(t => t.status === "Closed");
  const highPri  = active.filter(t => t.priority === "High").length;
  const expiring = active.filter(t => t.sla < 3).length;

  const filtered = active.filter(t => {
    if (catFilter !== "All" && t.category !== catFilter) return false;
    if (searchQ && !t.id.toLowerCase().includes(searchQ.toLowerCase()) &&
        !t.by.toLowerCase().includes(searchQ.toLowerCase()) &&
        !t.category.toLowerCase().includes(searchQ.toLowerCase())) return false;
    return true;
  });

  const openResolve = (ticket) => {
    setDialog(ticket);
    setAssignTo(ticket.assignedTo);
    setNewStatus(ticket.status);
    setNoteText(ticket.notes || "");
    setUploadFile(null);
  };

  const handleSave = () => {
    if (!newStatus) { toast("Please select a status.", "error"); return; }
    const updatedTimeline = [
      ...(dialog.timeline || []),
      { date:new Date().toISOString().split("T")[0], event:`Status updated to "${newStatus}" — ${assignTo}` },
      ...(noteText && noteText !== dialog.notes ? [{ date:new Date().toISOString().split("T")[0], event:`Resolution note added` }] : []),
    ];
    setTickets(prev => prev.map(t =>
      t.id === dialog.id
        ? { ...t, status:newStatus, assignedTo:assignTo, notes:noteText, timeline:updatedTimeline }
        : t
    ));
    toast(newStatus === "Closed"
      ? "Grievance closed. All parties notified."
      : "Resolution workflow updated. Notification queued.");
    setDialog(null);
  };

  return (
    <Box sx={{ p:3, bgcolor:T.bg, minHeight:"100vh", fontFamily:fBody }}>
      <Fonts />

      {/* ── Header ── */}
      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3} flexWrap="wrap" gap={2}>
        <Box>
          <Typography sx={{ fontFamily:fHead, fontWeight:700, fontSize:"1.5rem", color:T.text }}>
            Grievance &amp; Complaint Handling
          </Typography>
          <Typography sx={{ fontFamily:fBody, fontSize:"0.82rem", color:T.textSub, mt:0.4 }}>
            Admin &amp; Ombudsperson View &nbsp;·&nbsp; Secure, confidential complaint management
          </Typography>
        </Box>
        <Box display="flex" gap={1.5} flexWrap="wrap" alignItems="flex-start" pt={0.5}>
          {/* Ombudsman badge */}
          <Box display="flex" alignItems="center" gap={0.8}
            sx={{ px:1.5, py:0.7, borderRadius:"9px", bgcolor:T.warningLight, border:`1px solid ${T.warning}40` }}>
            <Shield sx={{ fontSize:15, color:T.warning }} />
            <Typography sx={{ fontFamily:fBody, fontSize:"0.74rem", fontWeight:700, color:T.warning }}>
              Ombudsman Mode Active
            </Typography>
            <Box sx={{ width:6, height:6, borderRadius:"50%", bgcolor:T.warning }} className="blink" />
          </Box>
          <Button size="small" variant="outlined" startIcon={<Download sx={{fontSize:15}} />}
            onClick={() => toast("Grievance report exported.")}
            sx={{
              fontFamily:fBody, fontWeight:600, fontSize:"0.76rem", textTransform:"none",
              borderRadius:"8px", borderColor:T.border, color:T.textSub,
              "&:hover":{ borderColor:T.accent, color:T.accent }
            }}>
            Export Report
          </Button>
        </Box>
      </Box>

      {/* ── Stat Strip ── */}
      <Grid container spacing={2} mb={3}>
        {[
          { label:"Active Grievances", value:active.length,  sub:"Pending resolution",     color:T.warning, Icon:AssignmentLate },
          { label:"High Priority",     value:highPri,         sub:"Requires urgent action", color:T.danger,  Icon:Flag           },
          { label:"SLA Expiring",      value:expiring,        sub:"Within 3 days",          color:T.danger,  Icon:ErrorOutline   },
          { label:"Closed This Month", value:closed.length,   sub:"Successfully resolved",  color:T.success, Icon:Verified       },
        ].map((s,i) => (
          <Grid item xs={6} md={3} key={i}>
            <SCard sx={{ p:2.5 }} className={`fu${i}`}>
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

      {/* Confidentiality notice */}
      <Box sx={{
        display:"flex", alignItems:"center", gap:1.2, px:2.5, py:1.5, mb:3,
        borderRadius:"10px", bgcolor:T.accentLight, border:`1px solid ${T.accent}30`
      }} className="fu">
        <Lock sx={{ fontSize:15, color:T.accent }} />
        <Typography sx={{ fontFamily:fBody, fontSize:"0.78rem", color:T.accent, fontWeight:600 }}>
          Confidentiality Notice:
          <Typography component="span" sx={{ fontFamily:fBody, fontSize:"0.78rem", color:T.textSub, fontWeight:400, ml:0.5 }}>
            Grievance details are visible only to authorised personnel. Anonymous submissions mask all identifying information.
            Strict ICC/POSH compliance enforced.
          </Typography>
        </Typography>
      </Box>

      {/* ── Main Card ── */}
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
              { label:"Active Queue",  count:active.length  },
              { label:"Closed Cases",  count:closed.length  },
              { label:"History",       count:history.length },
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

        {/* TAB 0: ACTIVE QUEUE */}
        {tabIndex === 0 && (
          <Box className="fu">
            {/* Toolbar */}
            <Box sx={{
              px:2.5, py:1.8, borderBottom:`1px solid ${T.border}`,
              display:"flex", gap:1.5, flexWrap:"wrap", alignItems:"center"
            }}>
              <TextField size="small" placeholder="Search ID, name, category…"
                value={searchQ} onChange={e => setSearchQ(e.target.value)}
                InputProps={{ startAdornment:<InputAdornment position="start"><Search sx={{fontSize:15,color:T.textMute}} /></InputAdornment> }}
                sx={{
                  width:220,
                  "& .MuiOutlinedInput-root":{
                    borderRadius:"8px", fontFamily:fBody, fontSize:"0.78rem",
                    "& fieldset":{ borderColor:T.border },
                    "&.Mui-focused fieldset":{ borderColor:T.accent }
                  }
                }} />
              <TextField select size="small" value={catFilter} onChange={e => setCatFilter(e.target.value)}
                sx={{
                  width:160,
                  "& .MuiOutlinedInput-root":{
                    borderRadius:"8px", fontFamily:fBody, fontSize:"0.8rem",
                    "& fieldset":{ borderColor:T.border },
                    "&.Mui-focused fieldset":{ borderColor:T.accent }
                  }
                }}>
                {["All","Harassment","Discrimination","Salary","Facilities","Academic"].map(c => (
                  <MenuItem key={c} value={c} sx={{ fontFamily:fBody, fontSize:"0.8rem" }}>{c}</MenuItem>
                ))}
              </TextField>
              <Typography sx={{ fontFamily:fBody, fontSize:"0.76rem", color:T.textMute, ml:"auto" }}>
                {filtered.length} active ticket{filtered.length !== 1 ? "s" : ""}
              </Typography>
            </Box>

            <Table>
              <TableHead>
                <TableRow>
                  <TH>Ticket ID</TH>
                  <TH>Category</TH>
                  <TH>Submitted By</TH>
                  <TH>Date</TH>
                  <TH>Priority</TH>
                  <TH>Status</TH>
                  <TH>SLA</TH>
                  <TH>Assigned To</TH>
                  <TH align="center">Action</TH>
                </TableRow>
              </TableHead>
              <TableBody>
                {filtered.map(row => (
                  <TableRow key={row.id} className="row-h">
                    <TD>
                      <Typography sx={{ fontFamily:fMono, fontSize:"0.78rem", fontWeight:700, color:T.accent }}>
                        {row.id}
                      </Typography>
                    </TD>
                    <TD><CatBadge category={row.category} /></TD>
                    <TD>
                      {row.by === "Anonymous"
                        ? <AnonBadge />
                        : (
                          <Box display="flex" alignItems="center" gap={1}>
                            <Avatar sx={{ width:26, height:26, bgcolor:T.accentLight, color:T.accent, fontSize:"0.6rem", fontWeight:700 }}>
                              {row.by.split(" ").map(n=>n[0]).join("").slice(0,2)}
                            </Avatar>
                            <Box>
                              <Typography sx={{ fontFamily:fBody, fontWeight:600, fontSize:"0.8rem", color:T.text }}>{row.by}</Typography>
                              <Typography sx={{ fontFamily:fBody, fontSize:"0.67rem", color:T.textMute }}>{row.dept}</Typography>
                            </Box>
                          </Box>
                        )
                      }
                    </TD>
                    <TD>
                      <Typography sx={{ fontFamily:fMono, fontSize:"0.74rem" }}>{row.date}</Typography>
                    </TD>
                    <TD><PriorityDot priority={row.priority} /></TD>
                    <TD><StatusPill status={row.status} /></TD>
                    <TD><SlaBar days={row.sla} /></TD>
                    <TD>
                      <Typography sx={{ fontFamily:fBody, fontSize:"0.75rem", color:T.textSub }}>{row.assignedTo}</Typography>
                    </TD>
                    <TD align="center">
                      <Button size="small" variant="contained"
                        startIcon={<Gavel sx={{fontSize:14}} />}
                        onClick={() => openResolve(row)}
                        sx={{
                          fontFamily:fBody, fontWeight:700, fontSize:"0.73rem",
                          textTransform:"none", borderRadius:"8px",
                          bgcolor:T.accent, boxShadow:"none",
                          "&:hover":{ bgcolor:"#4F46E5", boxShadow:"none" }
                        }}>
                        Resolve
                      </Button>
                    </TD>
                  </TableRow>
                ))}
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={9} sx={{ textAlign:"center", py:6, fontFamily:fBody, color:T.textMute }}>
                      {active.length === 0 ? "🎉 No active grievances at this time." : "No tickets match your search."}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Box>
        )}

        {/* TAB 1: CLOSED CASES */}
        {tabIndex === 1 && (
          <Box className="fu">
            <Table>
              <TableHead>
                <TableRow>
                  <TH>Ticket ID</TH>
                  <TH>Category</TH>
                  <TH>Submitted By</TH>
                  <TH>Date</TH>
                  <TH>Assigned To</TH>
                  <TH>Resolution Note</TH>
                  <TH align="center">Actions</TH>
                </TableRow>
              </TableHead>
              <TableBody>
                {closed.map(row => (
                  <TableRow key={row.id} className="row-h">
                    <TD>
                      <Typography sx={{ fontFamily:fMono, fontSize:"0.78rem", fontWeight:700, color:T.success }}>
                        {row.id}
                      </Typography>
                    </TD>
                    <TD><CatBadge category={row.category} /></TD>
                    <TD>
                      {row.by === "Anonymous"
                        ? <AnonBadge />
                        : <Typography sx={{ fontFamily:fBody, fontWeight:600, fontSize:"0.8rem" }}>{row.by}</Typography>}
                    </TD>
                    <TD><Typography sx={{ fontFamily:fMono, fontSize:"0.74rem" }}>{row.date}</Typography></TD>
                    <TD>
                      <Typography sx={{ fontFamily:fBody, fontSize:"0.75rem", color:T.textSub }}>{row.assignedTo}</Typography>
                    </TD>
                    <TD sx={{ maxWidth:240 }}>
                      <Typography sx={{ fontFamily:fBody, fontSize:"0.74rem", color:T.textMute, fontStyle:"italic" }}>
                        {row.notes || "—"}
                      </Typography>
                    </TD>
                    <TD align="center">
                      <Tooltip title="View full timeline">
                        <IconButton size="small"
                          sx={{ bgcolor:T.accentLight, color:T.accent, borderRadius:"7px" }}
                          onClick={() => openResolve(row)}>
                          <Visibility sx={{ fontSize:15 }} />
                        </IconButton>
                      </Tooltip>
                    </TD>
                  </TableRow>
                ))}
                {closed.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} sx={{ textAlign:"center", py:5, fontFamily:fBody, color:T.textMute }}>
                      No closed cases.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Box>
        )}

        {/* TAB 2: HISTORY */}
        {tabIndex === 2 && (
          <Box className="fu">
            <Table>
              <TableHead>
                <TableRow>
                  <TH>Ticket ID</TH>
                  <TH>Category</TH>
                  <TH>Submitted By</TH>
                  <TH>Date</TH>
                  <TH>Status</TH>
                  <TH>Resolved By</TH>
                  <TH>Note</TH>
                </TableRow>
              </TableHead>
              <TableBody>
                {history.map(h => (
                  <TableRow key={h.id} className="row-h">
                    <TD>
                      <Typography sx={{ fontFamily:fMono, fontSize:"0.78rem", fontWeight:700, color:T.textMute }}>{h.id}</Typography>
                    </TD>
                    <TD><CatBadge category={h.category} /></TD>
                    <TD>
                      {h.by === "Anonymous"
                        ? <AnonBadge />
                        : <Typography sx={{ fontFamily:fBody, fontWeight:600, fontSize:"0.8rem" }}>{h.by}</Typography>}
                    </TD>
                    <TD><Typography sx={{ fontFamily:fMono, fontSize:"0.74rem" }}>{h.date}</Typography></TD>
                    <TD><StatusPill status={h.status} /></TD>
                    <TD>
                      <Typography sx={{ fontFamily:fBody, fontSize:"0.75rem", color:T.textSub }}>{h.resolvedBy}</Typography>
                    </TD>
                    <TD sx={{ maxWidth:220 }}>
                      <Typography sx={{ fontFamily:fBody, fontSize:"0.73rem", color:T.textMute, fontStyle:"italic" }}>
                        {h.note || "—"}
                      </Typography>
                    </TD>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        )}
      </SCard>

      {/* ════════════════════════════════════════
          RESOLUTION DIALOG
      ════════════════════════════════════════ */}
      <Dialog
        open={!!dialog} onClose={() => setDialog(null)}
        maxWidth="md" fullWidth
        PaperProps={{ sx:{ borderRadius:"16px", border:`1px solid ${T.border}` } }}
      >
        {dialog && (
          <>
            <DialogTitle sx={{
              fontFamily:fHead, fontWeight:700, fontSize:"1rem", color:T.text,
              borderBottom:`1px solid ${T.border}`, bgcolor:"#FAFBFD", pb:2
            }}>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box display="flex" alignItems="center" gap={1.5}>
                  <Box sx={{ width:4, height:24, borderRadius:2, bgcolor:T.accent }} />
                  <Box>
                    <Typography sx={{ fontFamily:fHead, fontWeight:700, fontSize:"1rem", color:T.text }}>
                      Resolution Workflow
                    </Typography>
                    <Typography sx={{ fontFamily:fMono, fontSize:"0.73rem", color:T.accent, fontWeight:600 }}>
                      {dialog.id}
                    </Typography>
                  </Box>
                </Box>
                <Box display="flex" alignItems="center" gap={1}>
                  <StatusPill status={dialog.status} />
                  <IconButton size="small" onClick={() => setDialog(null)}
                    sx={{ bgcolor:"#F1F5F9", borderRadius:"8px" }}>
                    <Close fontSize="small" />
                  </IconButton>
                </Box>
              </Box>
            </DialogTitle>

            <DialogContent sx={{ px:3, pt:3, pb:2 }}>
              <Stack spacing={3}>

                {/* Summary row */}
                <Grid container spacing={2}>
                  {[
                    { label:"Category",    value:<CatBadge category={dialog.category} />   },
                    { label:"Priority",    value:<PriorityDot priority={dialog.priority} />},
                    { label:"Submitted",   value:<Typography sx={{ fontFamily:fMono, fontSize:"0.8rem", fontWeight:600 }}>{dialog.date}</Typography> },
                    { label:"Complainant", value: dialog.by === "Anonymous" ? <AnonBadge /> : <Typography sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.8rem", color:T.text }}>{dialog.by}</Typography> },
                  ].map(c => (
                    <Grid item xs={6} md={3} key={c.label}>
                      <Box sx={{ p:1.5, borderRadius:"8px", bgcolor:"#F9FAFB", border:`1px solid ${T.border}` }}>
                        <SLabel sx={{ mb:0.5 }}>{c.label}</SLabel>
                        {c.value}
                      </Box>
                    </Grid>
                  ))}
                </Grid>

                {/* Description */}
                <Box sx={{ p:2, borderRadius:"10px", bgcolor:T.accentLight, border:`1px solid ${T.accent}25` }}>
                  <SLabel sx={{ mb:0.5 }}>Complaint Description</SLabel>
                  <Typography sx={{ fontFamily:fBody, fontSize:"0.82rem", color:T.textSub, lineHeight:1.7 }}>
                    {dialog.description}
                  </Typography>
                </Box>

                {/* Sensitive warning */}
                {(dialog.category === "Harassment" || dialog.category === "Discrimination") && (
                  <Box sx={{
                    display:"flex", alignItems:"flex-start", gap:1.2,
                    p:1.8, borderRadius:"10px",
                    bgcolor:T.dangerLight, border:`1px solid ${T.danger}30`
                  }}>
                    <Shield sx={{ fontSize:16, color:T.danger, mt:0.2, flexShrink:0 }} />
                    <Box>
                      <Typography sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.78rem", color:T.danger, mb:0.3 }}>
                        Sensitive Complaint — POSH / ICC Protocol Applies
                      </Typography>
                      <Typography sx={{ fontFamily:fBody, fontSize:"0.74rem", color:T.danger }}>
                        This grievance falls under POSH Act / Anti-discrimination policy. Maintain strict confidentiality.
                        ICC committee must be notified within 7 days. Do not disclose complainant identity.
                      </Typography>
                    </Box>
                  </Box>
                )}

                <Grid container spacing={2.5}>
                  {/* LEFT: Resolution form */}
                  <Grid item xs={12} md={7}>
                    <Typography sx={{ fontFamily:fHead, fontWeight:700, fontSize:"0.88rem", color:T.text, mb:1.5 }}>
                      1 · Assign &amp; Update Status
                    </Typography>
                    <Stack spacing={2}>
                      <Box>
                        <SLabel sx={{ mb:0.7 }}>Assign To Committee Member</SLabel>
                        <DInput select value={assignTo} onChange={e => setAssignTo(e.target.value)}>
                          {COMMITTEE_MEMBERS.map(m => (
                            <MenuItem key={m} value={m} sx={{ fontFamily:fBody, fontSize:"0.8rem" }}>{m}</MenuItem>
                          ))}
                        </DInput>
                      </Box>

                      <Box>
                        <SLabel sx={{ mb:0.7 }}>Update Status</SLabel>
                        <DInput select value={newStatus} onChange={e => setNewStatus(e.target.value)}>
                          {STATUS_OPTIONS.map(s => (
                            <MenuItem key={s} value={s} sx={{ fontFamily:fBody, fontSize:"0.8rem" }}>
                              <Box display="flex" alignItems="center" gap={1}>
                                <StatusPill status={s} />
                              </Box>
                            </MenuItem>
                          ))}
                        </DInput>
                      </Box>

                      <Box>
                        <Typography sx={{ fontFamily:fHead, fontWeight:700, fontSize:"0.88rem", color:T.text, mb:1 }}>
                          2 · Resolution Notes
                        </Typography>
                        <TextField
                          size="small" fullWidth multiline rows={4}
                          value={noteText}
                          onChange={e => setNoteText(e.target.value)}
                          placeholder="Describe investigation findings, actions taken, and final decision..."
                          sx={{
                            "& .MuiOutlinedInput-root":{
                              borderRadius:"8px", fontFamily:fBody, fontSize:"0.82rem",
                              "& fieldset":{ borderColor:T.border },
                              "&.Mui-focused fieldset":{ borderColor:T.accent }
                            }
                          }}
                        />
                      </Box>

                      {/* Upload + auto-email notice */}
                      <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={1}>
                        <Button component="label" size="small"
                          startIcon={<CloudUpload sx={{fontSize:14}} />}
                          sx={{
                            fontFamily:fBody, fontWeight:600, fontSize:"0.75rem",
                            textTransform:"none", borderRadius:"8px",
                            borderColor: uploadFile ? T.success : T.border,
                            color: uploadFile ? T.success : T.textSub,
                            border:"1px solid",
                            "&:hover":{ borderColor:T.accent, color:T.accent, bgcolor:T.accentLight }
                          }}>
                          {uploadFile ? uploadFile.name : "Upload Investigation Report (PDF)"}
                          <HiddenInput type="file" accept="application/pdf"
                            onChange={e => setUploadFile(e.target.files[0])} />
                        </Button>
                        {newStatus === "Proposed Resolution" && (
                          <Box display="flex" alignItems="center" gap={0.7}
                            sx={{ px:1.2, py:0.5, borderRadius:"8px", bgcolor:T.accentLight, border:`1px solid ${T.accent}30` }}>
                            <MarkEmailRead sx={{ fontSize:14, color:T.accent }} />
                            <Typography sx={{ fontFamily:fBody, fontSize:"0.71rem", fontWeight:700, color:T.accent }}>
                              Auto-email will be sent to faculty
                            </Typography>
                          </Box>
                        )}
                        {newStatus === "Closed" && (
                          <Box display="flex" alignItems="center" gap={0.7}
                            sx={{ px:1.2, py:0.5, borderRadius:"8px", bgcolor:T.successLight, border:`1px solid ${T.success}30` }}>
                            <CheckCircle sx={{ fontSize:14, color:T.success }} />
                            <Typography sx={{ fontFamily:fBody, fontSize:"0.71rem", fontWeight:700, color:T.success }}>
                              Closure notification will be sent
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    </Stack>
                  </Grid>

                  {/* RIGHT: Timeline */}
                  <Grid item xs={12} md={5}>
                    <Typography sx={{ fontFamily:fHead, fontWeight:700, fontSize:"0.88rem", color:T.text, mb:1.5 }}>
                      3 · Activity Timeline
                    </Typography>
                    <Box sx={{ borderRadius:"10px", border:`1px solid ${T.border}`, overflow:"hidden" }}>
                      {dialog.timeline.map((evt, i) => (
                        <Box key={i} sx={{
                          display:"flex", gap:1.5, px:2, py:1.4,
                          borderBottom: i < dialog.timeline.length-1 ? `1px solid ${T.border}` : "none",
                          bgcolor: i === dialog.timeline.length-1 ? T.accentLight : "transparent"
                        }}>
                          <Box sx={{ flexShrink:0, mt:0.3 }}>
                            <Box sx={{
                              width:8, height:8, borderRadius:"50%",
                              bgcolor: i === dialog.timeline.length-1 ? T.accent : T.border,
                              mt:0.3
                            }} />
                          </Box>
                          <Box>
                            <Typography sx={{ fontFamily:fMono, fontSize:"0.68rem", color:T.textMute }}>{evt.date}</Typography>
                            <Typography sx={{ fontFamily:fBody, fontSize:"0.77rem", color: i === dialog.timeline.length-1 ? T.accent : T.textSub, fontWeight: i === dialog.timeline.length-1 ? 700 : 400 }}>
                              {evt.event}
                            </Typography>
                          </Box>
                        </Box>
                      ))}
                    </Box>

                    {/* SLA */}
                    {dialog.status !== "Closed" && (
                      <Box sx={{ mt:1.5, p:1.8, borderRadius:"10px", border:`1px solid ${T.border}`, bgcolor:"#F9FAFB" }}>
                        <SLabel sx={{ mb:1 }}>SLA Status</SLabel>
                        <Box display="flex" alignItems="center" gap={1.5}>
                          <SlaBar days={dialog.sla} />
                          <Typography sx={{ fontFamily:fBody, fontSize:"0.76rem", color: dialog.sla < 3 ? T.danger : T.textSub }}>
                            {dialog.sla < 3
                              ? "⚠ Urgent — SLA deadline approaching"
                              : `${dialog.sla} days remaining for resolution`}
                          </Typography>
                        </Box>
                      </Box>
                    )}
                  </Grid>
                </Grid>
              </Stack>
            </DialogContent>

            <DialogActions sx={{
              px:3, pb:3, pt:2, bgcolor:"#FAFBFD",
              borderTop:`1px solid ${T.border}`, gap:1
            }}>
              <Button onClick={() => setDialog(null)} variant="outlined" sx={{
                fontFamily:fBody, fontWeight:600, fontSize:"0.8rem",
                textTransform:"none", borderRadius:"8px",
                borderColor:T.border, color:T.textSub
              }}>
                Cancel
              </Button>
              <Button onClick={handleSave} variant="contained"
                startIcon={newStatus === "Closed"
                  ? <CheckCircle sx={{fontSize:15}} />
                  : <Send sx={{fontSize:15}} />}
                sx={{
                  fontFamily:fBody, fontWeight:700, fontSize:"0.8rem",
                  textTransform:"none", borderRadius:"8px",
                  bgcolor: newStatus === "Closed" ? T.success : T.accent,
                  boxShadow:"none",
                  "&:hover":{ bgcolor: newStatus === "Closed" ? "#059669" : "#4F46E5", boxShadow:"none" }
                }}>
                {newStatus === "Closed" ? "Close Grievance" : "Submit Resolution Update"}
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

export default GrievanceManagementView;