import React, { useState } from "react";
import {
  Box, Grid, Typography, Button, Table, TableBody, TableCell,
  TableHead, TableRow, IconButton, Tooltip, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, MenuItem, Divider,
  Stack, Avatar, Snackbar, Alert, InputAdornment, Tabs, Tab,
  Checkbox, FormControlLabel, FormGroup, Switch
} from "@mui/material";
import {
  EventAvailable, MeetingRoom, Analytics, CheckCircle, Cancel,
  Add, Edit, Build, Block, Videocam, AcUnit, Wifi, Close,
  Download, Search, Warning, InfoOutlined, ReceiptLong, Send,
  Person, Schedule, RoomPreferences, TrendingUp, Bolt,
  BarChart, Star, Layers, SensorDoor, SmartDisplay,
  CorporateFare, Notifications, Refresh
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
    @keyframes pulse  { 0%,100%{opacity:1} 50%{opacity:.4} }
    .fu  { animation: fadeUp 0.3s ease both; }
    .fu1 { animation: fadeUp 0.3s .06s ease both; }
    .fu2 { animation: fadeUp 0.3s .12s ease both; }
    .fu3 { animation: fadeUp 0.3s .18s ease both; }
    .row-h:hover { background:#F9FAFB !important; transition:background .15s; }
    .card-h { transition: box-shadow 0.2s, transform 0.2s; }
    .card-h:hover { box-shadow:0 6px 24px rgba(99,102,241,.10); transform:translateY(-2px); }
    .blink { animation: pulse 1.8s infinite; }
  `}</style>
);

/* ── Mock Data ── */
const REQUESTS_INIT = [
  {
    id:101, room:"Conference Hall A", faculty:"Dr. Sarah Smith",   avatar:"SS", dept:"CSE",
    date:"2026-02-15", time:"10:00 AM – 12:00 PM", purpose:"Dept. Meeting",       status:"Pending",  adminComment:"",
    attendees:12, recurring:false,
  },
  {
    id:102, room:"Seminar Hall",      faculty:"Prof. Rajan Kumar", avatar:"RK", dept:"Mech",
    date:"2026-02-18", time:"02:00 PM – 04:00 PM", purpose:"Guest Lecture",        status:"Pending",  adminComment:"",
    attendees:180, recurring:false,
  },
  {
    id:103, room:"Lab 3 (Computer)",  faculty:"Ms. Priya Roy",     avatar:"PR", dept:"IT",
    date:"2026-02-15", time:"10:00 AM – 12:00 PM", purpose:"Workshop",             status:"Conflict", adminComment:"",
    attendees:35, recurring:false,
  },
  {
    id:104, room:"Meeting Room B",    faculty:"Dr. Emily Davis",   avatar:"ED", dept:"Civil",
    date:"2026-02-20", time:"09:00 AM – 10:00 AM", purpose:"Research Discussion",  status:"Approved", adminComment:"Approved as per request.",
    attendees:6, recurring:false,
  },
];

const ROOMS_INIT = [
  {
    id:1, name:"Conference Hall A", capacity:50,  floor:"Ground Floor",
    features:["Projector","AC","Wi-Fi","Whiteboard"],
    status:"Active",  bookingsThisMonth:18,
  },
  {
    id:2, name:"Seminar Hall",      capacity:200, floor:"1st Floor",
    features:["Projector","Sound System","AC","Stage"],
    status:"Active",  bookingsThisMonth:9,
  },
  {
    id:3, name:"Lab 3 (Computer)",  capacity:40,  floor:"2nd Floor",
    features:["Computers","AC","Projector"],
    status:"Under Maintenance", bookingsThisMonth:22,
  },
  {
    id:4, name:"Meeting Room B",    capacity:12,  floor:"Ground Floor",
    features:["Smart Board","Wi-Fi","Video Conf."],
    status:"Active",  bookingsThisMonth:5,
  },
];

const UTILIZATION = [
  { name:"Conference Hall A", percent:85, peak:"Mon–Fri 10–12" },
  { name:"Seminar Hall",      percent:45, peak:"Tue, Thu 2–4"  },
  { name:"Lab 3 (Computer)",  percent:92, peak:"Daily 9–5"     },
  { name:"Meeting Room B",    percent:20, peak:"Wed 11–1"      },
];

const FEATURE_ICONS = {
  "Projector":      { Icon:Videocam,       label:"Projector"        },
  "AC":             { Icon:AcUnit,         label:"Air Conditioning" },
  "Wi-Fi":          { Icon:Wifi,           label:"Wi-Fi"            },
  "Sound System":   { Icon:Bolt,           label:"Sound System"     },
  "Smart Board":    { Icon:SmartDisplay,   label:"Smart Board"      },
  "Video Conf.":    { Icon:Videocam,       label:"Video Conf."      },
  "Computers":      { Icon:Layers,         label:"Computers"        },
  "Whiteboard":     { Icon:Edit,           label:"Whiteboard"       },
  "Stage":          { Icon:CorporateFare,  label:"Stage"            },
};

const ALL_FEATURES = ["Projector","AC","Wi-Fi","Sound System","Smart Board","Video Conf.","Computers","Whiteboard","Stage"];

const FLOORS = ["Ground Floor","1st Floor","2nd Floor","3rd Floor","Block B"];

const STATUS_REQ_MAP = {
  Pending:  { color:T.warning, bg:T.warningLight },
  Approved: { color:T.success, bg:T.successLight },
  Rejected: { color:T.danger,  bg:T.dangerLight  },
  Conflict: { color:T.danger,  bg:T.dangerLight  },
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

const TH = ({ children, align, sx={} }) => (
  <TableCell align={align} sx={{
    fontFamily:fBody, fontWeight:700, fontSize:"0.68rem",
    letterSpacing:"0.06em", textTransform:"uppercase",
    color:T.textMute, borderBottom:`1px solid ${T.border}`,
    py:1.5, bgcolor:"#F9FAFB", whiteSpace:"nowrap", ...sx
  }}>{children}</TableCell>
);

const TD = ({ children, sx={}, align }) => (
  <TableCell align={align} sx={{
    fontFamily:fBody, fontSize:"0.81rem", color:T.textSub,
    borderBottom:`1px solid ${T.border}`, py:1.8, ...sx
  }}>{children}</TableCell>
);

const StatusPill = ({ status }) => {
  const s = STATUS_REQ_MAP[status] || { color:T.textMute, bg:"#F1F5F9" };
  return (
    <Box display="flex" alignItems="center" gap={0.6}
      sx={{ px:1.2, py:0.36, borderRadius:"99px", bgcolor:s.bg, width:"fit-content" }}>
      <Box sx={{
        width:6, height:6, borderRadius:"50%", bgcolor:s.color,
        ...(status === "Conflict" ? { animation:"pulse 1.5s infinite" } : {})
      }} />
      <Typography sx={{ fontFamily:fBody, fontSize:"0.71rem", fontWeight:700, color:s.color }}>
        {status}
      </Typography>
    </Box>
  );
};

const RoomStatusBadge = ({ status }) => {
  const isActive = status === "Active";
  return (
    <Box sx={{
      px:1, py:0.3, borderRadius:"99px", display:"inline-flex", alignItems:"center", gap:0.5,
      bgcolor: isActive ? T.successLight : T.dangerLight
    }}>
      <Box sx={{ width:6, height:6, borderRadius:"50%",
        bgcolor: isActive ? T.success : T.danger,
        ...(isActive ? {} : { animation:"pulse 1.8s infinite" })
      }} />
      <Typography sx={{ fontFamily:fBody, fontSize:"0.69rem", fontWeight:700,
        color: isActive ? T.success : T.danger }}>
        {status}
      </Typography>
    </Box>
  );
};

const FeatureChip = ({ feature }) => {
  const info = FEATURE_ICONS[feature] || { Icon:Star, label:feature };
  return (
    <Tooltip title={info.label}>
      <Box sx={{
        display:"inline-flex", alignItems:"center", gap:0.5,
        px:0.9, py:0.3, borderRadius:"6px", bgcolor:T.accentLight, mr:0.5, mb:0.5
      }}>
        <info.Icon sx={{ fontSize:12, color:T.accent }} />
        <Typography sx={{ fontFamily:fBody, fontSize:"0.62rem", fontWeight:700, color:T.accent }}>
          {feature}
        </Typography>
      </Box>
    </Tooltip>
  );
};

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

/* ════════════════════════════════
   MAIN COMPONENT
════════════════════════════════ */
const RoomBookingAdminView = () => {
  const [tabIndex, setTabIndex]     = useState(0);
  const [requests, setRequests]     = useState(REQUESTS_INIT);
  const [rooms, setRooms]           = useState(ROOMS_INIT);
  const [searchQ, setSearchQ]       = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  /* Booking review dialog */
  const [reviewDialog, setReviewDialog]     = useState(null);
  const [adminComment, setAdminComment]     = useState("");

  /* Room add/edit dialog */
  const [roomDialog, setRoomDialog]         = useState(false);
  const [editRoom, setEditRoom]             = useState(null);
  const [roomForm, setRoomForm]             = useState({
    name:"", capacity:"", floor:"", features:[], status:"Active"
  });

  const [snack, setSnack] = useState({ open:false, msg:"", severity:"success" });
  const toast = (msg, severity="success") => setSnack({ open:true, msg, severity });

  /* Derived */
  const pending    = requests.filter(r => r.status === "Pending"  || r.status === "Conflict");
  const activeRooms= rooms.filter(r => r.status === "Active").length;
  const avgUtil    = Math.round(UTILIZATION.reduce((a,u) => a+u.percent, 0) / UTILIZATION.length);

  const filteredReqs = requests.filter(r => {
    if (statusFilter !== "All" && r.status !== statusFilter) return false;
    if (searchQ && !r.room.toLowerCase().includes(searchQ.toLowerCase()) &&
        !r.faculty.toLowerCase().includes(searchQ.toLowerCase())) return false;
    return true;
  });

  /* ── Handlers ── */
  const openReview = (req) => { setReviewDialog(req); setAdminComment(req.adminComment || ""); };

  const handleRequestAction = (status) => {
    setRequests(prev => prev.map(r =>
      r.id === reviewDialog.id ? { ...r, status, adminComment } : r
    ));
    toast(status === "Approved"
      ? `Booking for ${reviewDialog.room} approved.`
      : `Booking rejected. ${reviewDialog.faculty} notified.`,
      status === "Approved" ? "success" : "warning"
    );
    setReviewDialog(null);
  };

  const toggleMaintenance = (id) => {
    setRooms(prev => prev.map(r =>
      r.id === id ? { ...r, status: r.status === "Active" ? "Under Maintenance" : "Active" } : r
    ));
    const room = rooms.find(r => r.id === id);
    toast(room.status === "Active"
      ? `${room.name} marked as Under Maintenance.`
      : `${room.name} re-activated.`
    );
  };

  const openAddRoom = () => {
    setEditRoom(null);
    setRoomForm({ name:"", capacity:"", floor:"", features:[], status:"Active" });
    setRoomDialog(true);
  };

  const openEditRoom = (room) => {
    setEditRoom(room);
    setRoomForm({ name:room.name, capacity:room.capacity, floor:room.floor,
      features:[...room.features], status:room.status });
    setRoomDialog(true);
  };

  const toggleFeature = (f) => {
    setRoomForm(prev => ({
      ...prev,
      features: prev.features.includes(f)
        ? prev.features.filter(x => x !== f)
        : [...prev.features, f]
    }));
  };

  const handleSaveRoom = () => {
    if (!roomForm.name.trim()) { toast("Room name is required.", "error"); return; }
    if (!roomForm.floor)       { toast("Floor/location is required.", "error"); return; }
    if (editRoom) {
      setRooms(prev => prev.map(r =>
        r.id === editRoom.id ? { ...r, ...roomForm } : r
      ));
      toast(`${roomForm.name} updated successfully.`);
    } else {
      setRooms(prev => [...prev, { id:Date.now(), bookingsThisMonth:0, ...roomForm }]);
      toast(`${roomForm.name} added to room directory.`);
    }
    setRoomDialog(false);
  };

  const TABS = [
    { label:"Booking Approvals",    Icon:EventAvailable,  count:pending.length },
    { label:"Room Master Data",     Icon:MeetingRoom,     count:0              },
    { label:"Utilisation Analytics",Icon:Analytics,       count:0              },
  ];

  return (
    <Box sx={{ p:3, bgcolor:T.bg, minHeight:"100vh", fontFamily:fBody }}>
      <Fonts />

      {/* ── Header ── */}
      <Box display="flex" justifyContent="space-between" alignItems="flex-start"
        mb={3} flexWrap="wrap" gap={2}>
        <Box>
          <Typography sx={{ fontFamily:fBody, fontSize:"0.72rem", fontWeight:700,
            letterSpacing:"0.1em", textTransform:"uppercase", color:T.textMute, mb:0.3 }}>
            Logistics &amp; Infrastructure
          </Typography>
          <Typography sx={{ fontFamily:fHead, fontWeight:700, fontSize:"1.5rem", color:T.text }}>
            Room Booking Administration
          </Typography>
          <Typography sx={{ fontFamily:fBody, fontSize:"0.82rem", color:T.textSub, mt:0.3 }}>
            Approve booking requests, manage room inventory, and track space utilisation.
          </Typography>
        </Box>
        <Box display="flex" gap={1.5} pt={0.5} flexWrap="wrap">
          <Button size="small" variant="outlined" startIcon={<Add sx={{fontSize:15}} />}
            onClick={openAddRoom}
            sx={{ fontFamily:fBody, fontWeight:600, fontSize:"0.76rem", textTransform:"none",
              borderRadius:"8px", borderColor:T.border, color:T.textSub,
              "&:hover":{ borderColor:T.accent, color:T.accent } }}>
            Add Room
          </Button>
          <Button size="small" variant="outlined" startIcon={<Download sx={{fontSize:15}} />}
            onClick={() => toast("Booking report exported.")}
            sx={{ fontFamily:fBody, fontWeight:600, fontSize:"0.76rem", textTransform:"none",
              borderRadius:"8px", borderColor:T.border, color:T.textSub,
              "&:hover":{ borderColor:T.accent, color:T.accent } }}>
            Export Report
          </Button>
        </Box>
      </Box>

      {/* ── Stat Strip ── */}
      <Grid container spacing={2} mb={3}>
        {[
          { label:"Total Rooms",        value:rooms.length,    sub:"In room directory",         color:T.accent,  Icon:MeetingRoom   },
          { label:"Active Rooms",       value:activeRooms,     sub:"Currently bookable",        color:T.success, Icon:SensorDoor    },
          { label:"Pending Approvals",  value:pending.length,  sub:"Requests awaiting review",  color:T.warning, Icon:EventAvailable },
          { label:"Avg. Utilisation",   value:`${avgUtil}%`,   sub:"Across all rooms",          color:T.purple,  Icon:BarChart       },
        ].map((s,i) => (
          <Grid item xs={6} md={3} key={i}>
            <SCard sx={{ p:2.5 }} className={`fu${i}`}>
              <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                <Box>
                  <SLabel>{s.label}</SLabel>
                  <Typography sx={{ fontFamily:fMono, fontWeight:700, fontSize:"1.75rem",
                    color:s.color, lineHeight:1.1 }}>{s.value}</Typography>
                  <Typography sx={{ fontFamily:fBody, fontSize:"0.7rem",
                    color:T.textMute, mt:0.4 }}>{s.sub}</Typography>
                </Box>
                <Box sx={{ p:1.1, borderRadius:"10px", bgcolor:`${s.color}15`, color:s.color }}>
                  <s.Icon sx={{ fontSize:20 }} />
                </Box>
              </Box>
            </SCard>
          </Grid>
        ))}
      </Grid>

      {/* ── Main Card ── */}
      <SCard sx={{ overflow:"hidden" }} className="fu1">

        {/* Tab bar */}
        <Box sx={{ borderBottom:`1px solid ${T.border}`, bgcolor:"#FAFBFD" }}>
          <Tabs value={tabIndex} onChange={(_,v) => setTabIndex(v)} sx={{
            px:2,
            "& .MuiTabs-indicator":{ bgcolor:T.accent, height:"2.5px", borderRadius:"2px 2px 0 0" },
            "& .MuiTab-root":{
              fontFamily:fBody, fontWeight:600, fontSize:"0.8rem",
              textTransform:"none", color:T.textMute, minHeight:50,
              "&.Mui-selected":{ color:T.accent }
            }
          }}>
            {TABS.map((t,i) => (
              <Tab key={i} icon={<t.Icon sx={{fontSize:16}} />} iconPosition="start"
                label={
                  <Box display="flex" alignItems="center" gap={0.8}>
                    {t.label}
                    {t.count > 0 && (
                      <Box sx={{ px:0.7, py:0.1, borderRadius:"99px",
                        bgcolor: tabIndex===i ? T.accentLight : T.warningLight }}>
                        <Typography sx={{ fontFamily:fMono, fontSize:"0.62rem", fontWeight:700,
                          color: tabIndex===i ? T.accent : T.warning }}>{t.count}</Typography>
                      </Box>
                    )}
                  </Box>
                }
              />
            ))}
          </Tabs>
        </Box>

        <Box p={3}>

          {/* ════ TAB 0: BOOKING APPROVALS ════ */}
          {tabIndex === 0 && (
            <Box className="fu">
              {/* Toolbar */}
              <Box display="flex" gap={1.5} mb={2.5} flexWrap="wrap" alignItems="center">
                <TextField size="small" placeholder="Search room or faculty…"
                  value={searchQ} onChange={e => setSearchQ(e.target.value)}
                  InputProps={{ startAdornment:
                    <InputAdornment position="start">
                      <Search sx={{ fontSize:15, color:T.textMute }} />
                    </InputAdornment> }}
                  sx={{ width:220, "& .MuiOutlinedInput-root":{
                    borderRadius:"8px", fontFamily:fBody, fontSize:"0.78rem",
                    "& fieldset":{ borderColor:T.border },
                    "&.Mui-focused fieldset":{ borderColor:T.accent } }}} />
                <TextField select size="small" value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value)}
                  sx={{ width:150, "& .MuiOutlinedInput-root":{
                    borderRadius:"8px", fontFamily:fBody, fontSize:"0.8rem",
                    "& fieldset":{ borderColor:T.border },
                    "&.Mui-focused fieldset":{ borderColor:T.accent } }}}>
                  {["All","Pending","Conflict","Approved","Rejected"].map(s => (
                    <MenuItem key={s} value={s} sx={{fontFamily:fBody,fontSize:"0.8rem"}}>{s}</MenuItem>
                  ))}
                </TextField>
                <Typography sx={{ fontFamily:fBody, fontSize:"0.76rem", color:T.textMute, ml:"auto" }}>
                  {filteredReqs.length} booking{filteredReqs.length!==1?"s":""}
                </Typography>
              </Box>

              <Box sx={{ borderRadius:"10px", border:`1px solid ${T.border}`, overflow:"hidden" }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TH>Room</TH>
                      <TH>Requested By</TH>
                      <TH>Date &amp; Time</TH>
                      <TH>Purpose</TH>
                      <TH>Attendees</TH>
                      <TH>Status</TH>
                      <TH align="center">Action</TH>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredReqs.map(row => (
                      <TableRow key={row.id} className="row-h"
                        sx={{ bgcolor: row.status === "Conflict" ? `${T.danger}06` : "transparent" }}>
                        <TD sx={{ minWidth:155 }}>
                          <Box display="flex" alignItems="center" gap={1}>
                            <Box sx={{ p:0.65, borderRadius:"7px",
                              bgcolor: row.status === "Conflict" ? T.dangerLight : T.accentLight,
                              color:   row.status === "Conflict" ? T.danger       : T.accent }}>
                              <MeetingRoom sx={{ fontSize:14 }} />
                            </Box>
                            <Typography sx={{ fontFamily:fBody, fontWeight:700,
                              fontSize:"0.82rem", color:T.text }}>{row.room}</Typography>
                          </Box>
                        </TD>
                        <TD>
                          <Box display="flex" alignItems="center" gap={1}>
                            <Avatar sx={{ width:26, height:26, bgcolor:T.accentLight,
                              color:T.accent, fontSize:"0.6rem", fontWeight:700 }}>
                              {row.avatar}
                            </Avatar>
                            <Box>
                              <Typography sx={{ fontFamily:fBody, fontWeight:600,
                                fontSize:"0.8rem", color:T.text }}>{row.faculty}</Typography>
                              <Typography sx={{ fontFamily:fBody, fontSize:"0.68rem",
                                color:T.textMute }}>{row.dept}</Typography>
                            </Box>
                          </Box>
                        </TD>
                        <TD sx={{ minWidth:150 }}>
                          <Typography sx={{ fontFamily:fMono, fontSize:"0.75rem",
                            fontWeight:600, color:T.text }}>{row.date}</Typography>
                          <Typography sx={{ fontFamily:fBody, fontSize:"0.7rem",
                            color:T.textMute }}>{row.time}</Typography>
                        </TD>
                        <TD>
                          <Typography sx={{ fontFamily:fBody, fontSize:"0.79rem" }}>
                            {row.purpose}
                          </Typography>
                        </TD>
                        <TD>
                          <Box display="flex" alignItems="center" gap={0.6}>
                            <Person sx={{ fontSize:13, color:T.textMute }} />
                            <Typography sx={{ fontFamily:fMono, fontSize:"0.78rem",
                              fontWeight:600 }}>{row.attendees}</Typography>
                          </Box>
                        </TD>
                        <TD>
                          <Stack spacing={0.6}>
                            <StatusPill status={row.status} />
                            {row.status === "Conflict" && (
                              <Typography sx={{ fontFamily:fBody, fontSize:"0.64rem",
                                color:T.danger, fontWeight:700 }}>
                                ⚠ Slot overlap detected
                              </Typography>
                            )}
                          </Stack>
                        </TD>
                        <TD align="center">
                          {(row.status === "Pending" || row.status === "Conflict") ? (
                            <Button size="small" variant="contained"
                              startIcon={<EventAvailable sx={{fontSize:14}} />}
                              onClick={() => openReview(row)}
                              sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.73rem",
                                textTransform:"none", borderRadius:"8px",
                                bgcolor: row.status === "Conflict" ? T.danger : T.accent,
                                boxShadow:"none",
                                "&:hover":{ bgcolor: row.status === "Conflict" ? "#DC2626" : "#4F46E5",
                                  boxShadow:"none" } }}>
                              Review
                            </Button>
                          ) : (
                            <Typography sx={{ fontFamily:fBody, fontSize:"0.72rem",
                              color:T.textMute, fontStyle:"italic" }}>
                              {row.status === "Approved" ? "✓ Done" : "✗ Rejected"}
                            </Typography>
                          )}
                        </TD>
                      </TableRow>
                    ))}
                    {filteredReqs.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={7} sx={{ textAlign:"center",
                          py:6, fontFamily:fBody, color:T.textMute }}>
                          No booking requests match your filter.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </Box>
            </Box>
          )}

          {/* ════ TAB 1: ROOM MASTER DATA ════ */}
          {tabIndex === 1 && (
            <Box className="fu">
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2.5}>
                <Typography sx={{ fontFamily:fHead, fontWeight:700,
                  fontSize:"0.92rem", color:T.text }}>
                  Manage Rooms &amp; Facilities
                </Typography>
                <Button size="small" variant="contained" startIcon={<Add sx={{fontSize:15}} />}
                  onClick={openAddRoom}
                  sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.76rem", textTransform:"none",
                    borderRadius:"8px", bgcolor:T.accent, boxShadow:"none",
                    "&:hover":{ bgcolor:"#4F46E5", boxShadow:"none" } }}>
                  Add New Room
                </Button>
              </Box>

              <Grid container spacing={2.5}>
                {rooms.map((room,i) => (
                  <Grid item xs={12} md={6} key={room.id}>
                    <SCard sx={{ p:2.5 }} className={`fu${Math.min(i,3)} card-h`}>
                      {/* Room card header */}
                      <Box display="flex" justifyContent="space-between"
                        alignItems="flex-start" mb={1.8}>
                        <Box display="flex" alignItems="center" gap={1.2}>
                          <Box sx={{ p:0.85, borderRadius:"9px",
                            bgcolor: room.status === "Active" ? T.accentLight : T.dangerLight,
                            color:   room.status === "Active" ? T.accent       : T.danger }}>
                            <SensorDoor sx={{ fontSize:18 }} />
                          </Box>
                          <Box>
                            <Typography sx={{ fontFamily:fBody, fontWeight:700,
                              fontSize:"0.88rem", color:T.text }}>{room.name}</Typography>
                            <Typography sx={{ fontFamily:fBody, fontSize:"0.69rem",
                              color:T.textMute }}>{room.floor}</Typography>
                          </Box>
                        </Box>
                        <RoomStatusBadge status={room.status} />
                      </Box>

                      {/* Stats row */}
                      <Box display="flex" gap={2} mb={1.8}>
                        {[
                          { label:"Capacity",     value:`${room.capacity} seats`, mono:true  },
                          { label:"Bookings/Mo",  value:`${room.bookingsThisMonth} bookings`, mono:true },
                        ].map(s => (
                          <Box key={s.label} sx={{ flex:1, p:1.3, borderRadius:"8px",
                            bgcolor:"#F9FAFB", border:`1px solid ${T.border}` }}>
                            <SLabel sx={{ mb:0.3 }}>{s.label}</SLabel>
                            <Typography sx={{ fontFamily: s.mono ? fMono : fBody,
                              fontWeight:700, fontSize:"0.82rem", color:T.text }}>
                              {s.value}
                            </Typography>
                          </Box>
                        ))}
                      </Box>

                      {/* Features */}
                      <Box mb={1.8}>
                        <SLabel sx={{ mb:0.7 }}>Facilities</SLabel>
                        <Box display="flex" flexWrap="wrap">
                          {room.features.map(f => <FeatureChip key={f} feature={f} />)}
                        </Box>
                      </Box>

                      <Divider sx={{ borderColor:T.border, mb:1.8 }} />

                      {/* Actions */}
                      <Box display="flex" justifyContent="flex-end" gap={1}>
                        <Button size="small" variant="outlined"
                          startIcon={<Edit sx={{fontSize:14}} />}
                          onClick={() => openEditRoom(room)}
                          sx={{ fontFamily:fBody, fontWeight:600, fontSize:"0.73rem",
                            textTransform:"none", borderRadius:"8px",
                            borderColor:T.border, color:T.textSub,
                            "&:hover":{ borderColor:T.accent, color:T.accent } }}>
                          Edit
                        </Button>
                        <Button size="small" variant="outlined"
                          startIcon={room.status === "Active"
                            ? <Build sx={{fontSize:14}} />
                            : <CheckCircle sx={{fontSize:14}} />}
                          onClick={() => toggleMaintenance(room.id)}
                          sx={{ fontFamily:fBody, fontWeight:600, fontSize:"0.73rem",
                            textTransform:"none", borderRadius:"8px",
                            borderColor: room.status === "Active"
                              ? `${T.warning}60` : `${T.success}60`,
                            color: room.status === "Active" ? T.warning : T.success,
                            "&:hover":{
                              bgcolor: room.status === "Active" ? T.warningLight : T.successLight
                            } }}>
                          {room.status === "Active" ? "Maintenance" : "Activate"}
                        </Button>
                      </Box>
                    </SCard>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}

          {/* ════ TAB 2: UTILISATION ANALYTICS ════ */}
          {tabIndex === 2 && (
            <Box className="fu">
              {/* KPI strip */}
              <Grid container spacing={2} mb={3}>
                {[
                  { label:"Peak Usage Time",  value:"10 AM – 2 PM", sub:"Highest demand window",   color:T.accent,  Icon:Schedule      },
                  { label:"Most Booked Room", value:"Conf. Hall A", sub:"18 bookings this month",  color:T.purple,  Icon:Star          },
                  { label:"Avg. Utilisation", value:`${avgUtil}%`,  sub:"Across all active rooms", color:T.success, Icon:TrendingUp    },
                  { label:"Under Maintenance",value:rooms.filter(r=>r.status!=="Active").length, sub:"Rooms unavailable", color:T.danger, Icon:Build },
                ].map((s,i) => (
                  <Grid item xs={6} md={3} key={i}>
                    <SCard sx={{ p:2, textAlign:"center" }}>
                      <Box sx={{ p:1, borderRadius:"10px", bgcolor:`${s.color}15`,
                        color:s.color, width:36, height:36, mx:"auto", mb:1,
                        display:"flex", alignItems:"center", justifyContent:"center" }}>
                        <s.Icon sx={{ fontSize:18 }} />
                      </Box>
                      <SLabel sx={{ mb:0.4 }}>{s.label}</SLabel>
                      <Typography sx={{ fontFamily:fMono, fontWeight:700,
                        fontSize:"1.05rem", color:s.color }}>{s.value}</Typography>
                      <Typography sx={{ fontFamily:fBody, fontSize:"0.67rem",
                        color:T.textMute, mt:0.3 }}>{s.sub}</Typography>
                    </SCard>
                  </Grid>
                ))}
              </Grid>

              {/* Utilisation table */}
              <Typography sx={{ fontFamily:fHead, fontWeight:700,
                fontSize:"0.92rem", color:T.text, mb:1.8 }}>
                Room Utilisation Breakdown
              </Typography>
              <SCard sx={{ overflow:"hidden" }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TH>Room</TH>
                      <TH>Utilisation</TH>
                      <TH>Rate</TH>
                      <TH>Peak Slot</TH>
                      <TH>Demand Level</TH>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {UTILIZATION.map((row, i) => {
                      const isHigh = row.percent > 80;
                      const isMed  = row.percent > 40;
                      const col    = isHigh ? T.danger : isMed ? T.accent : T.warning;
                      const label  = isHigh ? "High Demand" : isMed ? "Moderate" : "Under-used";
                      const bg     = isHigh ? T.dangerLight : isMed ? T.accentLight : T.warningLight;
                      return (
                        <TableRow key={i} className="row-h">
                          <TD sx={{ fontWeight:600, color:T.text, minWidth:170 }}>
                            <Box display="flex" alignItems="center" gap={1}>
                              <MeetingRoom sx={{ fontSize:15, color:T.textMute }} />
                              {row.name}
                            </Box>
                          </TD>
                          <TD sx={{ width:"35%" }}>
                            <Box>
                              <Box sx={{ height:8, borderRadius:99, bgcolor:T.border, overflow:"hidden", mb:0.5 }}>
                                <Box sx={{
                                  height:"100%", borderRadius:99, bgcolor:col,
                                  width:`${row.percent}%`, transition:"width 1.2s ease"
                                }} />
                              </Box>
                            </Box>
                          </TD>
                          <TD>
                            <Typography sx={{ fontFamily:fMono, fontWeight:700,
                              fontSize:"0.88rem", color:col }}>{row.percent}%</Typography>
                          </TD>
                          <TD>
                            <Typography sx={{ fontFamily:fBody, fontSize:"0.75rem",
                              color:T.textSub }}>{row.peak}</Typography>
                          </TD>
                          <TD>
                            <Box sx={{ px:1.1, py:0.3, borderRadius:"6px",
                              bgcolor:bg, display:"inline-block" }}>
                              <Typography sx={{ fontFamily:fBody, fontSize:"0.7rem",
                                fontWeight:700, color:col }}>{label}</Typography>
                            </Box>
                          </TD>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>

                {/* Insights footer */}
                <Box sx={{ px:2.5, py:2, borderTop:`1px solid ${T.border}`, bgcolor:"#FAFBFD" }}>
                  <SLabel sx={{ mb:1 }}>Insights</SLabel>
                  <Box display="flex" gap={2} flexWrap="wrap">
                    {[
                      { text:"Lab 3 is at 92% utilisation — consider scheduling upgrades during weekends.", color:T.danger  },
                      { text:"Meeting Room B is under-used at 20% — consider promotional allocation.", color:T.warning },
                      { text:"Seminar Hall at 45% — optimal capacity for mid-semester.",                  color:T.success },
                    ].map((ins,i) => (
                      <Box key={i} sx={{ display:"flex", alignItems:"flex-start", gap:0.7 }}>
                        <Box sx={{ width:6, height:6, borderRadius:"50%", bgcolor:ins.color,
                          flexShrink:0, mt:0.6 }} />
                        <Typography sx={{ fontFamily:fBody, fontSize:"0.75rem", color:T.textSub }}>
                          {ins.text}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
              </SCard>
            </Box>
          )}
        </Box>
      </SCard>

      {/* ════════════════════════════════════════
          BOOKING REVIEW DIALOG
      ════════════════════════════════════════ */}
      <Dialog open={!!reviewDialog} onClose={() => setReviewDialog(null)}
        maxWidth="sm" fullWidth
        PaperProps={{ sx:{ borderRadius:"16px", border:`1px solid ${T.border}` } }}>
        {reviewDialog && (
          <>
            <DialogTitle sx={{ fontFamily:fHead, fontWeight:700, fontSize:"1rem",
              color:T.text, borderBottom:`1px solid ${T.border}`,
              bgcolor:"#FAFBFD", pb:2 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box display="flex" alignItems="center" gap={1.5}>
                  <Box sx={{ width:4, height:24, borderRadius:2, bgcolor:T.accent }} />
                  <Box>
                    <Typography sx={{ fontFamily:fHead, fontWeight:700,
                      fontSize:"1rem", color:T.text }}>Review Booking Request</Typography>
                    <Typography sx={{ fontFamily:fBody, fontSize:"0.73rem", color:T.textMute }}>
                      ID #{reviewDialog.id} &nbsp;·&nbsp; {reviewDialog.room}
                    </Typography>
                  </Box>
                </Box>
                <Box display="flex" alignItems="center" gap={1}>
                  <StatusPill status={reviewDialog.status} />
                  <IconButton size="small" onClick={() => setReviewDialog(null)}
                    sx={{ bgcolor:"#F1F5F9", borderRadius:"8px" }}>
                    <Close fontSize="small" />
                  </IconButton>
                </Box>
              </Box>
            </DialogTitle>

            <DialogContent sx={{ px:3, pt:3, pb:2 }}>
              <Stack spacing={2.5}>
                {/* Conflict alert */}
                {reviewDialog.status === "Conflict" && (
                  <Box sx={{ display:"flex", alignItems:"flex-start", gap:1.2,
                    p:1.8, borderRadius:"10px",
                    bgcolor:T.dangerLight, border:`1px solid ${T.danger}30` }}>
                    <Block sx={{ fontSize:16, color:T.danger, flexShrink:0, mt:0.1 }} />
                    <Box>
                      <Typography sx={{ fontFamily:fBody, fontWeight:700,
                        fontSize:"0.78rem", color:T.danger, mb:0.2 }}>
                        Time Slot Conflict Detected
                      </Typography>
                      <Typography sx={{ fontFamily:fBody, fontSize:"0.74rem", color:T.danger }}>
                        This request overlaps with an existing approved booking for the same room.
                        Approving will override the conflicting slot — review carefully.
                      </Typography>
                    </Box>
                  </Box>
                )}

                {/* Detail grid */}
                <Grid container spacing={2}>
                  {[
                    { label:"Room",         value:reviewDialog.room,    mono:false },
                    { label:"Requested By", value:reviewDialog.faculty,  mono:false },
                    { label:"Date",         value:reviewDialog.date,     mono:true  },
                    { label:"Time Slot",    value:reviewDialog.time,     mono:true  },
                    { label:"Purpose",      value:reviewDialog.purpose,  mono:false },
                    { label:"Attendees",    value:`${reviewDialog.attendees} people`, mono:true },
                  ].map(c => (
                    <Grid item xs={6} key={c.label}>
                      <Box sx={{ p:1.5, borderRadius:"8px", bgcolor:"#F9FAFB",
                        border:`1px solid ${T.border}` }}>
                        <SLabel sx={{ mb:0.4 }}>{c.label}</SLabel>
                        <Typography sx={{
                          fontFamily: c.mono ? fMono : fBody,
                          fontWeight:600, fontSize:"0.8rem", color:T.text
                        }}>{c.value}</Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>

                {/* Room capacity check */}
                {(() => {
                  const room = rooms.find(r => r.name === reviewDialog.room);
                  const over = room && reviewDialog.attendees > room.capacity;
                  if (!room) return null;
                  return (
                    <Box sx={{ p:1.8, borderRadius:"9px",
                      bgcolor: over ? T.dangerLight : T.successLight,
                      border:`1px solid ${over ? T.danger : T.success}30` }}>
                      <Box display="flex" alignItems="center" gap={0.8}>
                        {over
                          ? <Warning sx={{ fontSize:15, color:T.danger }} />
                          : <CheckCircle sx={{ fontSize:15, color:T.success }} />}
                        <Typography sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.77rem",
                          color: over ? T.danger : T.success }}>
                          {over
                            ? `Capacity exceeded — room fits ${room.capacity} but ${reviewDialog.attendees} requested`
                            : `Room capacity OK — ${reviewDialog.attendees} of ${room.capacity} seats`}
                        </Typography>
                      </Box>
                    </Box>
                  );
                })()}

                {/* Admin comment */}
                <Box>
                  <SLabel sx={{ mb:0.7 }}>Admin Comment</SLabel>
                  <TextField
                    size="small" fullWidth multiline rows={2}
                    value={adminComment}
                    onChange={e => setAdminComment(e.target.value)}
                    placeholder="Optional note — visible to the requestor upon approval or rejection…"
                    sx={{ "& .MuiOutlinedInput-root":{
                      borderRadius:"8px", fontFamily:fBody, fontSize:"0.82rem",
                      "& fieldset":{ borderColor:T.border },
                      "&.Mui-focused fieldset":{ borderColor:T.accent } }}}
                  />
                </Box>
              </Stack>
            </DialogContent>

            <DialogActions sx={{ px:3, pb:3, pt:2, bgcolor:"#FAFBFD",
              borderTop:`1px solid ${T.border}`, gap:1 }}>
              <Button onClick={() => setReviewDialog(null)} variant="outlined"
                sx={{ fontFamily:fBody, fontWeight:600, fontSize:"0.8rem",
                  textTransform:"none", borderRadius:"8px",
                  borderColor:T.border, color:T.textSub }}>
                Cancel
              </Button>
              <Button onClick={() => handleRequestAction("Rejected")} variant="outlined"
                startIcon={<Cancel sx={{fontSize:15}} />}
                sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.8rem",
                  textTransform:"none", borderRadius:"8px",
                  color:T.danger, borderColor:`${T.danger}50`,
                  "&:hover":{ borderColor:T.danger, bgcolor:T.dangerLight } }}>
                Reject
              </Button>
              <Button onClick={() => handleRequestAction("Approved")} variant="contained"
                startIcon={<CheckCircle sx={{fontSize:15}} />}
                sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.8rem",
                  textTransform:"none", borderRadius:"8px",
                  bgcolor:T.success, boxShadow:"none",
                  "&:hover":{ bgcolor:"#059669", boxShadow:"none" } }}>
                Approve Booking
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* ════════════════════════════════════════
          ADD / EDIT ROOM DIALOG
      ════════════════════════════════════════ */}
      <Dialog open={roomDialog} onClose={() => setRoomDialog(false)}
        maxWidth="sm" fullWidth
        PaperProps={{ sx:{ borderRadius:"16px", border:`1px solid ${T.border}` } }}>
        <DialogTitle sx={{ fontFamily:fHead, fontWeight:700, fontSize:"1rem",
          color:T.text, borderBottom:`1px solid ${T.border}`,
          bgcolor:"#FAFBFD", pb:2 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box display="flex" alignItems="center" gap={1.5}>
              <Box sx={{ width:4, height:24, borderRadius:2, bgcolor:T.accent }} />
              <Typography sx={{ fontFamily:fHead, fontWeight:700,
                fontSize:"1rem", color:T.text }}>
                {editRoom ? "Edit Room" : "Add New Room"}
              </Typography>
            </Box>
            <IconButton size="small" onClick={() => setRoomDialog(false)}
              sx={{ bgcolor:"#F1F5F9", borderRadius:"8px" }}>
              <Close fontSize="small" />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ px:3, pt:3, pb:2 }}>
          <Stack spacing={2.2}>
            <Grid container spacing={2}>
              <Grid item xs={8}>
                <Box>
                  <SLabel sx={{ mb:0.7 }}>Room Name / Number *</SLabel>
                  <DInput value={roomForm.name}
                    onChange={e => setRoomForm(p => ({ ...p, name:e.target.value }))}
                    placeholder="e.g. Conference Hall A" />
                </Box>
              </Grid>
              <Grid item xs={4}>
                <Box>
                  <SLabel sx={{ mb:0.7 }}>Capacity *</SLabel>
                  <DInput type="number" value={roomForm.capacity}
                    onChange={e => setRoomForm(p => ({ ...p, capacity:parseInt(e.target.value)||"" }))}
                    placeholder="50" />
                </Box>
              </Grid>
            </Grid>

            <Box>
              <SLabel sx={{ mb:0.7 }}>Floor / Location *</SLabel>
              <DInput select value={roomForm.floor}
                onChange={e => setRoomForm(p => ({ ...p, floor:e.target.value }))}>
                {FLOORS.map(f => (
                  <MenuItem key={f} value={f} sx={{fontFamily:fBody,fontSize:"0.82rem"}}>{f}</MenuItem>
                ))}
              </DInput>
            </Box>

            <Box>
              <SLabel sx={{ mb:1 }}>Available Facilities</SLabel>
              <Grid container spacing={0}>
                {ALL_FEATURES.map(f => {
                  const info = FEATURE_ICONS[f] || { Icon:Star };
                  const checked = roomForm.features.includes(f);
                  return (
                    <Grid item xs={6} key={f}>
                      <Box
                        onClick={() => toggleFeature(f)}
                        sx={{
                          display:"flex", alignItems:"center", gap:1, cursor:"pointer",
                          px:1.2, py:0.9, borderRadius:"8px", mb:0.5, mr:0.5,
                          border:`1px solid ${checked ? T.accent : T.border}`,
                          bgcolor: checked ? T.accentLight : "transparent",
                          transition:"all 0.15s",
                          "&:hover":{ borderColor:T.accent, bgcolor:T.accentLight }
                        }}>
                        <info.Icon sx={{ fontSize:14, color: checked ? T.accent : T.textMute }} />
                        <Typography sx={{ fontFamily:fBody, fontSize:"0.76rem",
                          fontWeight: checked ? 700 : 400,
                          color: checked ? T.accent : T.textSub }}>
                          {f}
                        </Typography>
                        {checked && <CheckCircle sx={{ fontSize:12, color:T.accent, ml:"auto" }} />}
                      </Box>
                    </Grid>
                  );
                })}
              </Grid>
            </Box>

            {editRoom && (
              <Box>
                <SLabel sx={{ mb:0.7 }}>Status</SLabel>
                <DInput select value={roomForm.status}
                  onChange={e => setRoomForm(p => ({ ...p, status:e.target.value }))}>
                  {["Active","Under Maintenance"].map(s => (
                    <MenuItem key={s} value={s} sx={{fontFamily:fBody,fontSize:"0.82rem"}}>{s}</MenuItem>
                  ))}
                </DInput>
              </Box>
            )}
          </Stack>
        </DialogContent>

        <DialogActions sx={{ px:3, pb:3, pt:2, bgcolor:"#FAFBFD",
          borderTop:`1px solid ${T.border}`, gap:1 }}>
          <Button onClick={() => setRoomDialog(false)} variant="outlined"
            sx={{ fontFamily:fBody, fontWeight:600, fontSize:"0.8rem",
              textTransform:"none", borderRadius:"8px",
              borderColor:T.border, color:T.textSub }}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleSaveRoom}
            startIcon={<CheckCircle sx={{fontSize:15}} />}
            sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.8rem",
              textTransform:"none", borderRadius:"8px",
              bgcolor:T.accent, boxShadow:"none",
              "&:hover":{ bgcolor:"#4F46E5", boxShadow:"none" } }}>
            {editRoom ? "Save Changes" : "Add Room"}
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

export default RoomBookingAdminView;