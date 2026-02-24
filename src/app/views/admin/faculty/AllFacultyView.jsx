import React, { useState, useMemo } from "react";
import {
  Box, Grid, Typography, Button, TextField, MenuItem,
  Table, TableBody, TableCell, TableHead, TableRow, TablePagination,
  IconButton, Avatar, InputAdornment, Menu, Tooltip, Stack,
  Snackbar, Alert, Divider, Dialog, DialogTitle, DialogContent,
  DialogActions
} from "@mui/material";
import {
  Add, Search, FilterList, MoreVert, FileDownload,
  Edit, Delete, Visibility, Email, Phone, Close,
  Person, School, Work, CalendarToday, Badge,
  CheckCircle, Block, HourglassEmpty, BeachAccess,
  FilterAlt, Refresh
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
    @keyframes pulse  { 0%,100%{opacity:1} 50%{opacity:.4} }
    .fu  { animation: fadeUp 0.3s ease both; }
    .fu1 { animation: fadeUp 0.3s .06s ease both; }
    .fu2 { animation: fadeUp 0.3s .12s ease both; }
    .fu3 { animation: fadeUp 0.3s .18s ease both; }
    .row-h:hover { background:#F9FAFB !important; transition:background .15s; }
    .blink { animation: pulse 2s infinite; }
  `}</style>
);

/* ─────────────────────────────────────────
   MOCK DATA — 12 faculty members
───────────────────────────────────────── */
const FACULTY_INIT = [
  { id:"FAC-2023-001", name:"Dr. Sarah Smith",    email:"sarah.smith@college.edu",   phone:"+91 98765 43210", dept:"Computer Science", desg:"Professor",           joinDate:"2018-06-01", status:"Active",     gender:"F" },
  { id:"FAC-2024-045", name:"Mr. Arjun Singh",    email:"arjun.singh@college.edu",   phone:"+91 98765 12345", dept:"Mechanical",       desg:"Asst. Professor",     joinDate:"2024-01-15", status:"Probation",  gender:"M" },
  { id:"FAC-2020-112", name:"Dr. Emily Davis",    email:"emily.d@college.edu",       phone:"+91 98765 67890", dept:"Civil Engg",       desg:"Associate Professor", joinDate:"2020-08-20", status:"On Leave",   gender:"F" },
  { id:"FAC-2015-089", name:"Prof. Rajan Kumar",  email:"rajan.k@college.edu",       phone:"+91 91234 56789", dept:"Electrical",       desg:"HOD",                 joinDate:"2015-03-10", status:"Active",     gender:"M" },
  { id:"FAC-2025-003", name:"Ms. Priya Roy",      email:"priya.roy@college.edu",     phone:"+91 88888 99999", dept:"Computer Science", desg:"Lecturer",            joinDate:"2025-02-01", status:"Active",     gender:"F" },
  { id:"FAC-2017-034", name:"Dr. Vikram Nair",    email:"vikram.n@college.edu",      phone:"+91 99001 23456", dept:"Mechanical",       desg:"Professor",           joinDate:"2017-07-14", status:"Active",     gender:"M" },
  { id:"FAC-2022-078", name:"Ms. Kavya Sharma",   email:"kavya.s@college.edu",       phone:"+91 77890 34567", dept:"Electrical",       desg:"Asst. Professor",     joinDate:"2022-11-01", status:"Active",     gender:"F" },
  { id:"FAC-2019-055", name:"Dr. Arun Mathew",    email:"arun.m@college.edu",        phone:"+91 99876 54321", dept:"Civil Engg",       desg:"Professor",           joinDate:"2019-04-20", status:"Active",     gender:"M" },
  { id:"FAC-2021-091", name:"Prof. Leena George", email:"leena.g@college.edu",       phone:"+91 88776 65432", dept:"Computer Science", desg:"Associate Professor", joinDate:"2021-06-15", status:"Active",     gender:"F" },
  { id:"FAC-2023-067", name:"Mr. Deepak Rao",     email:"deepak.r@college.edu",      phone:"+91 77665 76543", dept:"Science",          desg:"Asst. Professor",     joinDate:"2023-08-01", status:"Probation",  gender:"M" },
  { id:"FAC-2016-021", name:"Dr. Sunita Pillai",  email:"sunita.p@college.edu",      phone:"+91 99554 87654", dept:"Science",          desg:"HOD",                 joinDate:"2016-02-28", status:"Active",     gender:"F" },
  { id:"FAC-2024-102", name:"Mr. Rahul Bose",     email:"rahul.b@college.edu",       phone:"+91 88443 98765", dept:"Mechanical",       desg:"Lecturer",            joinDate:"2024-09-01", status:"Inactive",   gender:"M" },
];

const DEPTS = ["Computer Science","Mechanical","Civil Engg","Electrical","Science"];
const STATUSES = ["Active","Probation","On Leave","Inactive"];
const DESIGNATIONS = ["Professor","Associate Professor","Asst. Professor","Lecturer","HOD"];

/* ─────────────────────────────────────────
   STATUS META
───────────────────────────────────────── */
const STATUS_META = {
  Active:    { color:T.success, bg:T.successLight, Icon:CheckCircle    },
  Probation: { color:T.warning, bg:T.warningLight, Icon:HourglassEmpty },
  "On Leave":{ color:T.info,    bg:T.infoLight,    Icon:BeachAccess    },
  Inactive:  { color:T.textMute,bg:"#F1F5F9",      Icon:Block          },
};

/* Avatar background palette */
const AVATAR_COLORS = [
  { bg:"#EEF2FF", color:"#6366F1" },
  { bg:"#ECFDF5", color:"#10B981" },
  { bg:"#F5F3FF", color:"#7C3AED" },
  { bg:"#FFF7ED", color:"#F59E0B" },
  { bg:"#F0F9FF", color:"#0EA5E9" },
];
const avatarColor = (name) => AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];

/* Initials from name */
const initials = (name) => name.split(" ").filter(Boolean).slice(0,2).map(w=>w[0]).join("").toUpperCase();

/* Years of service */
const yearsService = (joinDate) => {
  const diff = new Date() - new Date(joinDate);
  return Math.floor(diff / (1000*60*60*24*365.25));
};

/* ─────────────────────────────────────────
   PRIMITIVE COMPONENTS
───────────────────────────────────────── */
const SCard = ({ children, sx={}, ...p }) => (
  <Box sx={{ background:T.surface, border:`1px solid ${T.border}`, borderRadius:"14px", ...sx }} {...p}>
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
    borderBottom:`1px solid ${T.border}`, py:1.6, ...sx }}>
    {children}
  </TableCell>
);

const StatusPill = ({ status }) => {
  const s = STATUS_META[status] || { color:T.textMute, bg:"#F1F5F9", Icon:Block };
  return (
    <Box display="flex" alignItems="center" gap={0.6}
      sx={{ px:1.2, py:0.38, borderRadius:"99px", bgcolor:s.bg, width:"fit-content" }}>
      <Box sx={{ width:6, height:6, borderRadius:"50%", bgcolor:s.color,
        ...(status==="Active" ? { animation:"pulse 2s infinite" } : {}) }} />
      <Typography sx={{ fontFamily:fBody, fontSize:"0.71rem", fontWeight:700, color:s.color }}>
        {status}
      </Typography>
    </Box>
  );
};

const DInput = ({ sx={}, ...props }) => (
  <TextField size="small" fullWidth {...props} sx={{
    "& .MuiOutlinedInput-root":{ borderRadius:"8px", fontFamily:fBody, fontSize:"0.82rem",
      bgcolor:T.surface,
      "& fieldset":{ borderColor:T.border },
      "&.Mui-focused fieldset":{ borderColor:T.accent } },
    "& .MuiInputLabel-root.Mui-focused":{ color:T.accent },
    ...sx
  }} />
);

/* ═════════════════════════════════════════════
   MAIN COMPONENT
═════════════════════════════════════════════ */
const AllFacultyView = () => {
  const [facultyList, setFacultyList]   = useState(FACULTY_INIT);
  const [page,        setPage]           = useState(0);
  const [rowsPerPage, setRowsPerPage]    = useState(10);
  const [searchQuery, setSearchQuery]    = useState("");
  const [filterDept,  setFilterDept]     = useState("All");
  const [filterStatus,setFilterStatus]   = useState("All");
  const [filterDesgn, setFilterDesgn]    = useState("All");
  const [anchorEl,    setAnchorEl]       = useState(null);
  const [selectedRow, setSelectedRow]    = useState(null);
  const [profileOpen, setProfileOpen]    = useState(false);
  const [snack,       setSnack]          = useState({ open:false, msg:"", severity:"success" });

  const toast = (msg, severity="success") => setSnack({ open:true, msg, severity });

  /* Derived stats */
  const totalActive   = facultyList.filter(f => f.status === "Active").length;
  const totalProb     = facultyList.filter(f => f.status === "Probation").length;
  const totalLeave    = facultyList.filter(f => f.status === "On Leave").length;

  /* Filter logic */
  const filtered = useMemo(() => facultyList.filter(f => {
    const q = searchQuery.toLowerCase();
    if (q && !f.name.toLowerCase().includes(q) &&
             !f.id.toLowerCase().includes(q) &&
             !f.email.toLowerCase().includes(q)) return false;
    if (filterDept   !== "All" && f.dept   !== filterDept)   return false;
    if (filterStatus !== "All" && f.status !== filterStatus) return false;
    if (filterDesgn  !== "All" && f.desg   !== filterDesgn)  return false;
    return true;
  }), [facultyList, searchQuery, filterDept, filterStatus, filterDesgn]);

  const paginated = filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const hasFilters = searchQuery || filterDept !== "All" || filterStatus !== "All" || filterDesgn !== "All";

  const resetFilters = () => {
    setSearchQuery(""); setFilterDept("All");
    setFilterStatus("All"); setFilterDesgn("All"); setPage(0);
  };

  /* Menu */
  const openMenu  = (e, row) => { setAnchorEl(e.currentTarget); setSelectedRow(row); };
  const closeMenu = () => { setAnchorEl(null); };

  const handleView = () => {
    setProfileOpen(true);
    closeMenu();
  };

  const handleEdit = () => {
    toast(`Edit profile for ${selectedRow?.name} opened.`);
    closeMenu();
  };

  const handleDeactivate = () => {
    const name = selectedRow?.name;
    setFacultyList(p => p.map(f =>
      f.id === selectedRow?.id ? { ...f, status:"Inactive" } : f
    ));
    toast(`${name} has been deactivated.`, "warning");
    closeMenu();
  };

  const handleExport = () => toast("Faculty directory exported as CSV.");

  const STAT_ITEMS = [
    { label:"Total Faculty",   value:facultyList.length, sub:"Across all departments", color:T.accent,  Icon:Person     },
    { label:"Active",          value:totalActive,        sub:"Currently working",      color:T.success, Icon:CheckCircle },
    { label:"On Probation",    value:totalProb,          sub:"Under review period",    color:T.warning, Icon:HourglassEmpty },
    { label:"On Leave",        value:totalLeave,         sub:"Approved leave",         color:T.info,    Icon:BeachAccess },
  ];

  /* ─────────────────────────────────────────
     RENDER
  ───────────────────────────────────────── */
  return (
    <Box sx={{ p:3, bgcolor:T.bg, minHeight:"100vh", fontFamily:fBody }}>
      <Fonts />

      {/* ── Header ── */}
      <Box display="flex" justifyContent="space-between" alignItems="flex-start"
        mb={3} flexWrap="wrap" gap={2}>
        <Box>
          <Typography sx={{ fontFamily:fBody, fontSize:"0.72rem", fontWeight:700,
            letterSpacing:"0.1em", textTransform:"uppercase", color:T.textMute, mb:0.3 }}>
            Human Resources · Faculty Management
          </Typography>
          <Typography sx={{ fontFamily:fHead, fontWeight:700, fontSize:"1.5rem", color:T.text }}>
            Faculty Directory
          </Typography>
          <Typography sx={{ fontFamily:fBody, fontSize:"0.82rem", color:T.textSub, mt:0.3 }}>
            Manage all teaching and non-teaching staff records, profiles and status.
          </Typography>
        </Box>
        <Box display="flex" gap={1.5} pt={0.5} flexWrap="wrap">
          <Button size="small" variant="outlined"
            startIcon={<FileDownload sx={{fontSize:15}} />}
            onClick={handleExport}
            sx={{ fontFamily:fBody, fontWeight:600, fontSize:"0.76rem", textTransform:"none",
              borderRadius:"8px", borderColor:T.border, color:T.textSub,
              "&:hover":{ borderColor:T.accent, color:T.accent } }}>
            Export CSV
          </Button>
          <Button size="small" variant="contained"
            startIcon={<Add sx={{fontSize:15}} />}
            onClick={() => toast("Onboarding form opened.")}
            sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.76rem", textTransform:"none",
              borderRadius:"8px", bgcolor:T.accent, boxShadow:"none",
              "&:hover":{ bgcolor:"#4F46E5", boxShadow:"none" } }}>
            Add New Faculty
          </Button>
        </Box>
      </Box>

      {/* ── Stat Strip ── */}
      <Grid container spacing={2} mb={3}>
        {STAT_ITEMS.map((s,i) => (
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

      {/* ── Main Table Card ── */}
      <SCard sx={{ overflow:"hidden" }} className="fu1">

        {/* Filter bar */}
        <Box sx={{ px:2.5, py:2, borderBottom:`1px solid ${T.border}`, bgcolor:"#FAFBFD" }}>
          <Grid container spacing={1.5} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField fullWidth placeholder="Search by name, ID, or email…"
                size="small" value={searchQuery}
                onChange={e => { setSearchQuery(e.target.value); setPage(0); }}
                InputProps={{ startAdornment:
                  <InputAdornment position="start">
                    <Search sx={{ fontSize:16, color:T.textMute }} />
                  </InputAdornment>
                }}
                sx={{ "& .MuiOutlinedInput-root":{ borderRadius:"8px",
                  fontFamily:fBody, fontSize:"0.8rem", bgcolor:T.surface,
                  "& fieldset":{ borderColor:T.border },
                  "&.Mui-focused fieldset":{ borderColor:T.accent } }}}
              />
            </Grid>
            <Grid item xs={6} md={2.5}>
              <DInput select label="Department" value={filterDept}
                onChange={e => { setFilterDept(e.target.value); setPage(0); }}>
                <MenuItem value="All" sx={{fontFamily:fBody,fontSize:"0.82rem"}}>All Departments</MenuItem>
                {DEPTS.map(d => (
                  <MenuItem key={d} value={d} sx={{fontFamily:fBody,fontSize:"0.82rem"}}>{d}</MenuItem>
                ))}
              </DInput>
            </Grid>
            <Grid item xs={6} md={2}>
              <DInput select label="Status" value={filterStatus}
                onChange={e => { setFilterStatus(e.target.value); setPage(0); }}>
                <MenuItem value="All" sx={{fontFamily:fBody,fontSize:"0.82rem"}}>All Statuses</MenuItem>
                {STATUSES.map(s => (
                  <MenuItem key={s} value={s} sx={{fontFamily:fBody,fontSize:"0.82rem"}}>{s}</MenuItem>
                ))}
              </DInput>
            </Grid>
            <Grid item xs={6} md={2.5}>
              <DInput select label="Designation" value={filterDesgn}
                onChange={e => { setFilterDesgn(e.target.value); setPage(0); }}>
                <MenuItem value="All" sx={{fontFamily:fBody,fontSize:"0.82rem"}}>All Designations</MenuItem>
                {DESIGNATIONS.map(d => (
                  <MenuItem key={d} value={d} sx={{fontFamily:fBody,fontSize:"0.82rem"}}>{d}</MenuItem>
                ))}
              </DInput>
            </Grid>
            <Grid item xs={6} md={1}>
              <Tooltip title="Reset filters">
                <Box component="span">
                  <IconButton size="small" disabled={!hasFilters} onClick={resetFilters}
                    sx={{ borderRadius:"8px", border:`1px solid ${T.border}`,
                      bgcolor: hasFilters ? T.dangerLight : "transparent",
                      color:   hasFilters ? T.danger      : T.textMute,
                      "&:hover":{ bgcolor:T.dangerLight } }}>
                    <Refresh sx={{ fontSize:17 }} />
                  </IconButton>
                </Box>
              </Tooltip>
            </Grid>
          </Grid>

          {/* Active filter chips */}
          {hasFilters && (
            <Box display="flex" gap={1} flexWrap="wrap" mt={1.5}>
              {searchQuery && (
                <Box sx={{ display:"flex", alignItems:"center", gap:0.5,
                  px:1.2, py:0.3, borderRadius:"99px",
                  bgcolor:T.accentLight, border:`1px solid ${T.accent}25` }}>
                  <Typography sx={{ fontFamily:fBody, fontSize:"0.7rem",
                    fontWeight:700, color:T.accent }}>
                    Search: "{searchQuery}"
                  </Typography>
                  <Close sx={{ fontSize:11, color:T.accent, cursor:"pointer" }}
                    onClick={() => setSearchQuery("")} />
                </Box>
              )}
              {filterDept !== "All" && (
                <Box sx={{ display:"flex", alignItems:"center", gap:0.5,
                  px:1.2, py:0.3, borderRadius:"99px",
                  bgcolor:T.purpleLight, border:`1px solid ${T.purple}25` }}>
                  <Typography sx={{ fontFamily:fBody, fontSize:"0.7rem",
                    fontWeight:700, color:T.purple }}>{filterDept}</Typography>
                  <Close sx={{ fontSize:11, color:T.purple, cursor:"pointer" }}
                    onClick={() => setFilterDept("All")} />
                </Box>
              )}
              {filterStatus !== "All" && (() => {
                const s = STATUS_META[filterStatus] || { color:T.textMute, bg:"#F1F5F9" };
                return (
                  <Box sx={{ display:"flex", alignItems:"center", gap:0.5,
                    px:1.2, py:0.3, borderRadius:"99px",
                    bgcolor:s.bg, border:`1px solid ${s.color}25` }}>
                    <Typography sx={{ fontFamily:fBody, fontSize:"0.7rem",
                      fontWeight:700, color:s.color }}>{filterStatus}</Typography>
                    <Close sx={{ fontSize:11, color:s.color, cursor:"pointer" }}
                      onClick={() => setFilterStatus("All")} />
                  </Box>
                );
              })()}
              {filterDesgn !== "All" && (
                <Box sx={{ display:"flex", alignItems:"center", gap:0.5,
                  px:1.2, py:0.3, borderRadius:"99px",
                  bgcolor:"#F1F5F9", border:`1px solid ${T.border}` }}>
                  <Typography sx={{ fontFamily:fBody, fontSize:"0.7rem",
                    fontWeight:700, color:T.textSub }}>{filterDesgn}</Typography>
                  <Close sx={{ fontSize:11, color:T.textMute, cursor:"pointer" }}
                    onClick={() => setFilterDesgn("All")} />
                </Box>
              )}
              <Typography sx={{ fontFamily:fBody, fontSize:"0.72rem",
                color:T.textMute, alignSelf:"center", ml:0.5 }}>
                {filtered.length} result{filtered.length!==1?"s":""}
              </Typography>
            </Box>
          )}
        </Box>

        {/* Table */}
        <Box sx={{ overflowX:"auto" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TH>Faculty Profile</TH>
                <TH>Employee ID</TH>
                <TH>Department &amp; Role</TH>
                <TH>Contact</TH>
                <TH>Service</TH>
                <TH>Status</TH>
                <TH align="center">Actions</TH>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginated.map(row => {
                const av = avatarColor(row.name);
                const yrs = yearsService(row.joinDate);
                return (
                  <TableRow key={row.id} className="row-h">
                    {/* Profile */}
                    <TD sx={{ minWidth:200 }}>
                      <Box display="flex" alignItems="center" gap={1.5}>
                        <Avatar sx={{ width:38, height:38, bgcolor:av.bg,
                          color:av.color, fontFamily:fHead,
                          fontSize:"0.75rem", fontWeight:700 }}>
                          {initials(row.name)}
                        </Avatar>
                        <Box>
                          <Typography sx={{ fontFamily:fBody, fontWeight:700,
                            fontSize:"0.83rem", color:T.text }}>{row.name}</Typography>
                          <Typography sx={{ fontFamily:fBody, fontSize:"0.69rem",
                            color:T.textMute }}>
                            Joined {row.joinDate}
                          </Typography>
                        </Box>
                      </Box>
                    </TD>

                    {/* ID */}
                    <TD sx={{ minWidth:130 }}>
                      <Box sx={{ px:1, py:0.35, borderRadius:"6px",
                        bgcolor:T.accentLight, display:"inline-block" }}>
                        <Typography sx={{ fontFamily:fMono, fontSize:"0.7rem",
                          fontWeight:700, color:T.accent }}>{row.id}</Typography>
                      </Box>
                    </TD>

                    {/* Dept & Role */}
                    <TD sx={{ minWidth:160 }}>
                      <Typography sx={{ fontFamily:fBody, fontWeight:600,
                        fontSize:"0.81rem", color:T.text }}>{row.dept}</Typography>
                      <Typography sx={{ fontFamily:fBody, fontSize:"0.7rem",
                        color:T.textMute }}>{row.desg}</Typography>
                    </TD>

                    {/* Contact */}
                    <TD sx={{ minWidth:100 }}>
                      <Box display="flex" gap={0.8}>
                        <Tooltip title={row.email}>
                          <Box sx={{ p:0.65, borderRadius:"7px",
                            bgcolor:T.accentLight, color:T.accent,
                            cursor:"pointer", display:"flex", alignItems:"center" }}>
                            <Email sx={{ fontSize:13 }} />
                          </Box>
                        </Tooltip>
                        <Tooltip title={row.phone}>
                          <Box sx={{ p:0.65, borderRadius:"7px",
                            bgcolor:T.successLight, color:T.success,
                            cursor:"pointer", display:"flex", alignItems:"center" }}>
                            <Phone sx={{ fontSize:13 }} />
                          </Box>
                        </Tooltip>
                      </Box>
                    </TD>

                    {/* Service */}
                    <TD>
                      <Typography sx={{ fontFamily:fMono, fontWeight:700,
                        fontSize:"0.82rem", color: yrs >= 5 ? T.success : T.warning }}>
                        {yrs} yr{yrs!==1?"s":""}
                      </Typography>
                    </TD>

                    {/* Status */}
                    <TD><StatusPill status={row.status} /></TD>

                    {/* Actions */}
                    <TD align="center">
                      <IconButton size="small"
                        onClick={e => openMenu(e, row)}
                        sx={{ borderRadius:"7px", "&:hover":{ bgcolor:T.accentLight } }}>
                        <MoreVert sx={{ fontSize:18, color:T.textMute }} />
                      </IconButton>
                    </TD>
                  </TableRow>
                );
              })}

              {paginated.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} sx={{ textAlign:"center", py:7 }}>
                    <FilterAlt sx={{ fontSize:40, color:T.border, mb:1.5, display:"block", mx:"auto" }} />
                    <Typography sx={{ fontFamily:fBody, color:T.textMute, fontSize:"0.88rem" }}>
                      No faculty members match your filters.
                    </Typography>
                    {hasFilters && (
                      <Button size="small" onClick={resetFilters}
                        sx={{ mt:1.5, fontFamily:fBody, fontSize:"0.76rem",
                          textTransform:"none", color:T.accent }}>
                        Clear all filters
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Box>

        {/* Pagination */}
        <Box sx={{ borderTop:`1px solid ${T.border}` }}>
          <TablePagination
            rowsPerPageOptions={[5,10,25]}
            component="div"
            count={filtered.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(_,p) => setPage(p)}
            onRowsPerPageChange={e => { setRowsPerPage(+e.target.value); setPage(0); }}
            sx={{ fontFamily:fBody, fontSize:"0.8rem",
              "& .MuiTablePagination-selectLabel,.MuiTablePagination-displayedRows":
                { fontFamily:fBody } }}
          />
        </Box>
      </SCard>

      {/* ── 3-dot Action Menu ── */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={closeMenu}
        transformOrigin={{ horizontal:"right", vertical:"top" }}
        anchorOrigin={{ horizontal:"right", vertical:"bottom" }}
        PaperProps={{ sx:{ borderRadius:"12px", border:`1px solid ${T.border}`,
          boxShadow:"0 8px 32px rgba(0,0,0,.10)", minWidth:170, p:0.5 } }}>
        <MenuItem onClick={handleView}
          sx={{ fontFamily:fBody, fontSize:"0.82rem", borderRadius:"8px",
            gap:1.2, py:1, color:T.text }}>
          <Visibility sx={{ fontSize:15, color:T.accent }} />
          View Profile
        </MenuItem>
        <MenuItem onClick={handleEdit}
          sx={{ fontFamily:fBody, fontSize:"0.82rem", borderRadius:"8px",
            gap:1.2, py:1, color:T.text }}>
          <Edit sx={{ fontSize:15, color:T.purple }} />
          Edit Details
        </MenuItem>
        <Divider sx={{ borderColor:T.border, my:0.5 }} />
        <MenuItem onClick={handleDeactivate}
          disabled={selectedRow?.status === "Inactive"}
          sx={{ fontFamily:fBody, fontSize:"0.82rem", borderRadius:"8px",
            gap:1.2, py:1, color:T.danger,
            "&:hover":{ bgcolor:T.dangerLight },
            "&.Mui-disabled":{ color:T.textMute } }}>
          <Block sx={{ fontSize:15 }} />
          Deactivate User
        </MenuItem>
      </Menu>

      {/* ── Profile View Dialog ── */}
      <Dialog open={profileOpen} onClose={() => setProfileOpen(false)}
        maxWidth="sm" fullWidth
        PaperProps={{ sx:{ borderRadius:"16px", border:`1px solid ${T.border}` } }}>
        {selectedRow && (
          <>
            <DialogTitle sx={{ fontFamily:fHead, fontWeight:700, fontSize:"1rem",
              color:T.text, borderBottom:`1px solid ${T.border}`,
              bgcolor:"#FAFBFD", pb:2 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box display="flex" alignItems="center" gap={1.5}>
                  <Box sx={{ width:4, height:24, borderRadius:2, bgcolor:T.accent }} />
                  <Typography sx={{ fontFamily:fHead, fontWeight:700,
                    fontSize:"1rem", color:T.text }}>Faculty Profile</Typography>
                </Box>
                <IconButton size="small" onClick={() => setProfileOpen(false)}
                  sx={{ bgcolor:"#F1F5F9", borderRadius:"8px" }}>
                  <Close fontSize="small" />
                </IconButton>
              </Box>
            </DialogTitle>

            <DialogContent sx={{ px:3, pt:3, pb:2 }}>
              {/* Profile header */}
              {(() => {
                const av = avatarColor(selectedRow.name);
                const yrs = yearsService(selectedRow.joinDate);
                return (
                  <Box display="flex" alignItems="center" gap={2} mb={3}>
                    <Avatar sx={{ width:60, height:60, bgcolor:av.bg, color:av.color,
                      fontFamily:fHead, fontSize:"1.2rem", fontWeight:700 }}>
                      {initials(selectedRow.name)}
                    </Avatar>
                    <Box>
                      <Typography sx={{ fontFamily:fHead, fontWeight:700,
                        fontSize:"1.05rem", color:T.text }}>{selectedRow.name}</Typography>
                      <Typography sx={{ fontFamily:fBody, fontSize:"0.78rem",
                        color:T.textSub }}>{selectedRow.desg} · {selectedRow.dept}</Typography>
                      <Box mt={0.6}>
                        <StatusPill status={selectedRow.status} />
                      </Box>
                    </Box>
                  </Box>
                );
              })()}

              <Grid container spacing={2}>
                {[
                  { label:"Employee ID",   value:selectedRow.id,       mono:true  },
                  { label:"Department",    value:selectedRow.dept,     mono:false },
                  { label:"Designation",   value:selectedRow.desg,     mono:false },
                  { label:"Join Date",     value:selectedRow.joinDate, mono:true  },
                  { label:"Service",       value:`${yearsService(selectedRow.joinDate)} years`, mono:true },
                  { label:"Status",        value:selectedRow.status,   mono:false },
                  { label:"Email",         value:selectedRow.email,    mono:false },
                  { label:"Phone",         value:selectedRow.phone,    mono:true  },
                ].map(c => (
                  <Grid item xs={6} key={c.label}>
                    <Box sx={{ p:1.5, borderRadius:"8px", bgcolor:"#F9FAFB",
                      border:`1px solid ${T.border}` }}>
                      <SLabel sx={{ mb:0.3 }}>{c.label}</SLabel>
                      <Typography sx={{ fontFamily: c.mono ? fMono : fBody,
                        fontWeight:600, fontSize:"0.79rem", color:T.text,
                        wordBreak:"break-all" }}>
                        {c.value}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </DialogContent>

            <DialogActions sx={{ px:3, pb:3, pt:2, bgcolor:"#FAFBFD",
              borderTop:`1px solid ${T.border}`, gap:1 }}>
              <Button onClick={() => setProfileOpen(false)} variant="outlined"
                sx={{ fontFamily:fBody, fontWeight:600, fontSize:"0.8rem",
                  textTransform:"none", borderRadius:"8px",
                  borderColor:T.border, color:T.textSub }}>
                Close
              </Button>
              <Button variant="contained"
                startIcon={<Edit sx={{fontSize:15}} />}
                onClick={() => { setProfileOpen(false); toast(`Edit profile for ${selectedRow.name} opened.`); }}
                sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.8rem",
                  textTransform:"none", borderRadius:"8px",
                  bgcolor:T.accent, boxShadow:"none",
                  "&:hover":{ bgcolor:"#4F46E5", boxShadow:"none" } }}>
                Edit Profile
              </Button>
            </DialogActions>
          </>
        )}
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

export default AllFacultyView;