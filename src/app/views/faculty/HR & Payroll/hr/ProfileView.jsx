import React, { useState } from "react";
import {
  Box, Grid, Typography, Button, Tabs, Tab, TextField,
  Table, TableBody, TableCell, TableHead, TableRow,
  Divider, Stack, IconButton, Avatar, Snackbar, Alert,
  Tooltip, Dialog, DialogTitle, DialogContent, DialogActions
} from "@mui/material";
import {
  Edit, Save, Download, WorkspacePremium, CardMembership,
  TrendingUp, TransferWithinAStation, School, VerifiedUser,
  Email, Phone, LocationOn, CalendarMonth, Badge, CameraAlt,
  Close, CheckCircle, ArrowForward, ArrowRightAlt,
  BusinessCenter, EmojiEvents, Groups, Timeline as TimelineIcon
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
  gold:         "#D97706",
  goldLight:    "#FEF3C7",
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
    @keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:none} }
    @keyframes pulse  { 0%,100%{opacity:1} 50%{opacity:.4} }
    @keyframes shimmer{ from{background-position:200% 0} to{background-position:-200% 0} }
    .fu  { animation: fadeUp 0.35s ease both; }
    .fu1 { animation: fadeUp 0.35s .06s ease both; }
    .fu2 { animation: fadeUp 0.35s .12s ease both; }
    .row-h:hover { background:#F9FAFB !important; transition:background .15s; }
    .card-h { transition:box-shadow .2s,transform .2s; }
    .card-h:hover { box-shadow:0 6px 24px rgba(99,102,241,.12); transform:translateY(-2px); }
    .blink { animation: pulse 2s infinite; }
  `}</style>
);

/* ─────────────────────────────────────────
   MOCK DATA
───────────────────────────────────────── */
const PROFILE = {
  name:        "Dr. Naveen Kumar",
  designation: "Associate Professor",
  dept:        "Computer Science & Engineering",
  grade:       "Grade 13A",
  empId:       "FAC-2012-047",
  joinDate:    "2012-06-01",
  dob:         "1980-04-15",
  gender:      "Male",
  category:    "General",
  phone:       "+91 98765 43210",
  email:       "naveen.kumar@univ.edu",
  address:     "12, Palm Grove Colony, Thiruvananthapuram, Kerala – 695004",
  emergency:   "Mrs. Rekha Kumar · +91 98765 11111",
  avatar:      null,
};

const SERVICE_HISTORY = [
  { year:"2021", title:"Promoted to Associate Professor", description:"Promoted based on CAS assessment and PBAS score. Effective August 2021.", color:T.accent  },
  { year:"2018", title:"Transferred — AI Dept to CSE Dept", description:"Internal transfer to CSE, Main Campus following departmental restructuring.", color:T.purple },
  { year:"2016", title:"Promoted to Assistant Professor Gr. I", description:"Increment-linked promotion after completing 5 years of regular service.", color:T.success },
  { year:"2012", title:"Joined as Lecturer", description:"Initial appointment as Lecturer on regular pay scale. Date of joining: 01 June 2012.", color:T.warning },
];

const TRANSFERS = [
  { date:"Aug 15, 2021", from:"AI Dept, South Campus",  to:"CSE Dept, Main Campus",  type:"Internal Transfer",      orderNo:"TRNS/21/044" },
  { date:"Jun 01, 2018", from:"IT Dept, City Campus",   to:"AI Dept, South Campus",  type:"Promotion & Transfer",   orderNo:"TRNS/18/019" },
];

const INCREMENTS = [
  { year:"2023", month:"July",  amount:"₹8,400",  newBasic:"₹1,42,000", orderNo:"INC/23/005", type:"Annual" },
  { year:"2022", month:"July",  amount:"₹7,800",  newBasic:"₹1,33,600", orderNo:"INC/22/112", type:"Annual" },
  { year:"2021", month:"Aug",   amount:"₹12,000", newBasic:"₹1,25,800", orderNo:"INC/21/099", type:"Promotion" },
  { year:"2020", month:"July",  amount:"₹7,200",  newBasic:"₹1,13,800", orderNo:"INC/20/081", type:"Annual" },
  { year:"2019", month:"July",  amount:"₹6,600",  newBasic:"₹1,06,600", orderNo:"INC/19/067", type:"Annual" },
];

const AWARDS = [
  { title:"Best Researcher Award",      year:"2022", authority:"University Research Council",  color:T.gold,    bg:T.goldLight,    Icon:WorkspacePremium },
  { title:"Excellence in Teaching",     year:"2020", authority:"Department of CSE",             color:T.accent,  bg:T.accentLight,  Icon:School            },
  { title:"Outstanding Mentor Award",   year:"2019", authority:"Internal Quality Cell (IQAC)",  color:T.success, bg:T.successLight, Icon:EmojiEvents       },
];

const MEMBERSHIPS = [
  { org:"IEEE Senior Member",  id:"90823122",  expiry:"Dec 2025", status:"Active",   color:T.accent  },
  { org:"ACM Professional",    id:"3321120",   expiry:"Nov 2023", status:"Expired",  color:T.danger  },
  { org:"ISTE Life Member",    id:"LM-8821",   expiry:"Lifetime", status:"Active",   color:T.success },
  { org:"CSI Member",          id:"CSI-44512", expiry:"Mar 2025", status:"Expiring", color:T.warning },
];

const STATUS_PILL_MAP = {
  Active:   { color:T.success, bg:T.successLight },
  Expired:  { color:T.danger,  bg:T.dangerLight  },
  Expiring: { color:T.warning, bg:T.warningLight },
};

/* ─────────────────────────────────────────
   HELPERS
───────────────────────────────────────── */
const yearsService = (joinDate) => {
  const diff = new Date() - new Date(joinDate);
  return Math.floor(diff / (1000*60*60*24*365.25));
};

const initials = (name) =>
  name.split(" ").filter(Boolean).slice(0,2).map(w=>w[0]).join("").toUpperCase();

/* ─────────────────────────────────────────
   PRIMITIVES
───────────────────────────────────────── */
const SCard = ({ children, sx={}, ...p }) => (
  <Box sx={{ background:T.surface, border:`1px solid ${T.border}`,
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

const TH = ({ children, sx={} }) => (
  <TableCell sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.68rem",
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

const StatusBadge = ({ status }) => {
  const s = STATUS_PILL_MAP[status] || { color:T.textMute, bg:"#F1F5F9" };
  return (
    <Box display="flex" alignItems="center" gap={0.6}
      sx={{ px:1.1, py:0.32, borderRadius:"99px", bgcolor:s.bg, width:"fit-content" }}>
      <Box sx={{ width:5, height:5, borderRadius:"50%", bgcolor:s.color }} />
      <Typography sx={{ fontFamily:fBody, fontSize:"0.67rem", fontWeight:700, color:s.color }}>
        {status}
      </Typography>
    </Box>
  );
};

const InfoRow = ({ Icon, label, value, editing, field, vals, onChange }) => (
  <Box display="flex" gap={1.5} alignItems="flex-start">
    <Box sx={{ p:0.75, borderRadius:"8px", bgcolor:T.accentLight,
      color:T.accent, flexShrink:0, mt:0.1 }}>
      <Icon sx={{ fontSize:15 }} />
    </Box>
    <Box flex={1} minWidth={0}>
      <SLabel sx={{ mb:0.2 }}>{label}</SLabel>
      {editing ? (
        <TextField size="small" fullWidth value={vals[field]}
          onChange={e => onChange(field, e.target.value)}
          multiline={field==="address"} maxRows={3}
          sx={{ "& .MuiOutlinedInput-root":{ borderRadius:"8px",
            fontFamily:fBody, fontSize:"0.82rem", bgcolor:T.surface,
            "& fieldset":{ borderColor:T.border },
            "&.Mui-focused fieldset":{ borderColor:T.accent } }}}
        />
      ) : (
        <Typography sx={{ fontFamily:fBody, fontWeight:600,
          fontSize:"0.81rem", color:T.text, wordBreak:"break-word" }}>
          {value}
        </Typography>
      )}
    </Box>
  </Box>
);

/* ═════════════════════════════════════════════
   MAIN COMPONENT
═════════════════════════════════════════════ */
const ServiceBookView = () => {
  const [tabIndex,   setTabIndex]   = useState(0);
  const [isEditing,  setIsEditing]  = useState(false);
  const [certDialog, setCertDialog] = useState(false);
  const [snack,      setSnack]      = useState({ open:false, msg:"", severity:"success" });

  const [editVals, setEditVals] = useState({
    phone:     PROFILE.phone,
    address:   PROFILE.address,
    emergency: PROFILE.emergency,
  });

  const toast = (msg, severity="success") => setSnack({ open:true, msg, severity });

  const handleSave = () => {
    setIsEditing(false);
    toast("Profile updated successfully.");
  };

  const setField = (k, v) => setEditVals(p => ({ ...p, [k]:v }));

  const yrs = yearsService(PROFILE.joinDate);

  const TABS = [
    { label:"Career Timeline",       Icon:TimelineIcon       },
    { label:"Salary & Increments",   Icon:TrendingUp         },
    { label:"Professional Portfolio",Icon:WorkspacePremium   },
  ];

  /* ─────────────────────────────────────────
     RENDER
  ───────────────────────────────────────── */
  return (
    <Box sx={{ p:3, bgcolor:T.bg, minHeight:"100vh", fontFamily:fBody }}>
      <Fonts />

      {/* ══════════════════════════════════════
          HERO HEADER
      ══════════════════════════════════════ */}
      <SCard sx={{ overflow:"hidden", mb:3 }} className="fu">
        {/* Cover banner */}
        <Box sx={{
          height:140, position:"relative",
          background:`linear-gradient(135deg, ${T.accent} 0%, ${T.purple} 60%, ${T.info} 100%)`,
          borderRadius:"14px 14px 0 0",
        }}>
          {/* Decorative circles */}
          <Box sx={{ position:"absolute", right:-40, top:-40,
            width:200, height:200, borderRadius:"50%",
            bgcolor:"rgba(255,255,255,.07)" }} />
          <Box sx={{ position:"absolute", right:60, top:30,
            width:100, height:100, borderRadius:"50%",
            bgcolor:"rgba(255,255,255,.05)" }} />

          <Tooltip title="Change cover photo">
            <IconButton size="small"
              sx={{ position:"absolute", right:16, bottom:12,
                bgcolor:"rgba(0,0,0,0.32)", color:"#fff", borderRadius:"8px",
                "&:hover":{ bgcolor:"rgba(0,0,0,0.5)" } }}>
              <CameraAlt sx={{ fontSize:16 }} />
            </IconButton>
          </Tooltip>
        </Box>

        {/* Profile info row */}
        <Box sx={{ px:{ xs:2, md:4 }, pb:3,
          pt:0, bgcolor:T.surface }}>
          <Box display="flex" alignItems="flex-end"
            justifyContent="space-between" flexWrap="wrap" gap={2}>

            {/* Avatar */}
            <Box sx={{ position:"relative", mt:"-50px", mr:2 }}>
              <Avatar sx={{
                width:100, height:100,
                bgcolor:T.accentLight, color:T.accent,
                fontFamily:fHead, fontSize:"1.6rem", fontWeight:700,
                border:`4px solid ${T.surface}`,
                boxShadow:"0 4px 16px rgba(99,102,241,.2)",
              }}>
                {initials(PROFILE.name)}
              </Avatar>
              <Tooltip title="Upload photo">
                <IconButton size="small"
                  sx={{ position:"absolute", bottom:2, right:2,
                    bgcolor:T.accent, color:"#fff", width:24, height:24,
                    borderRadius:"50%", border:`2px solid ${T.surface}`,
                    "&:hover":{ bgcolor:"#4F46E5" } }}>
                  <CameraAlt sx={{ fontSize:12 }} />
                </IconButton>
              </Tooltip>
            </Box>

            {/* Name / designation */}
            <Box flex={1} minWidth={200} pt={1}>
              <Typography sx={{ fontFamily:fHead, fontWeight:700,
                fontSize:"1.35rem", color:T.text, mb:0.3 }}>
                {PROFILE.name}
              </Typography>
              <Typography sx={{ fontFamily:fBody, fontSize:"0.85rem",
                color:T.textSub, mb:0.8 }}>
                {PROFILE.designation} &nbsp;·&nbsp; Dept. of {PROFILE.dept}
              </Typography>
              <Box display="flex" gap={1} flexWrap="wrap">
                {[
                  { label:"Regular Employee", color:T.success, bg:T.successLight, Icon:VerifiedUser },
                  { label:"Ph.D. Guide",       color:T.accent,  bg:T.accentLight,  Icon:School       },
                  { label:PROFILE.grade,       color:T.purple,  bg:T.purpleLight,  Icon:Badge         },
                ].map(b => (
                  <Box key={b.label} display="flex" alignItems="center" gap={0.5}
                    sx={{ px:1.1, py:0.3, borderRadius:"99px",
                      bgcolor:b.bg, border:`1px solid ${b.color}20` }}>
                    <b.Icon sx={{ fontSize:11, color:b.color }} />
                    <Typography sx={{ fontFamily:fBody, fontSize:"0.69rem",
                      fontWeight:700, color:b.color }}>{b.label}</Typography>
                  </Box>
                ))}
              </Box>
            </Box>

            {/* Action buttons */}
            <Box display="flex" gap={1.5} alignItems="center" pt={{ xs:0, md:1 }}>
              <Button size="small" variant="outlined"
                startIcon={<Download sx={{fontSize:15}} />}
                onClick={() => setCertDialog(true)}
                sx={{ fontFamily:fBody, fontWeight:600, fontSize:"0.76rem",
                  textTransform:"none", borderRadius:"8px",
                  borderColor:T.border, color:T.textSub,
                  "&:hover":{ borderColor:T.accent, color:T.accent } }}>
                Service Cert.
              </Button>
              <Button size="small" variant="contained"
                startIcon={isEditing
                  ? <Save sx={{fontSize:15}} />
                  : <Edit sx={{fontSize:15}} />}
                onClick={isEditing ? handleSave : () => setIsEditing(true)}
                sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.76rem",
                  textTransform:"none", borderRadius:"8px",
                  bgcolor: isEditing ? T.success : T.accent,
                  boxShadow:"none",
                  "&:hover":{ bgcolor: isEditing ? "#059669" : "#4F46E5",
                    boxShadow:"none" } }}>
                {isEditing ? "Save Changes" : "Edit Profile"}
              </Button>
            </Box>
          </Box>
        </Box>
      </SCard>

      <Grid container spacing={2.5} alignItems="flex-start">

        {/* ══════════════════════════════════════
            LEFT SIDEBAR
        ══════════════════════════════════════ */}
        <Grid item xs={12} md={3.5}>
          <Stack spacing={2.5}>

            {/* Personal Details card */}
            <SCard sx={{ p:2.5 }} className="fu1">
              <Typography sx={{ fontFamily:fHead, fontWeight:700,
                fontSize:"0.88rem", color:T.text, mb:2 }}>
                Personal Details
              </Typography>

              <Stack spacing={2}>
                <InfoRow Icon={Email}     label="Official Email"     value={PROFILE.email}
                  editing={false} field="email" vals={editVals} onChange={setField} />
                <InfoRow Icon={Phone}     label="Mobile"             value={editVals.phone}
                  editing={isEditing} field="phone" vals={editVals} onChange={setField} />
                <InfoRow Icon={LocationOn} label="Residence Address" value={editVals.address}
                  editing={isEditing} field="address" vals={editVals} onChange={setField} />
                <InfoRow Icon={Badge}     label="Emergency Contact"  value={editVals.emergency}
                  editing={isEditing} field="emergency" vals={editVals} onChange={setField} />
              </Stack>

              {isEditing && (
                <Box display="flex" gap={1} mt={2}>
                  <Button fullWidth size="small" variant="outlined"
                    onClick={() => setIsEditing(false)}
                    sx={{ fontFamily:fBody, fontWeight:600, fontSize:"0.74rem",
                      textTransform:"none", borderRadius:"7px",
                      borderColor:T.border, color:T.textSub }}>
                    Cancel
                  </Button>
                  <Button fullWidth size="small" variant="contained"
                    onClick={handleSave}
                    sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.74rem",
                      textTransform:"none", borderRadius:"7px",
                      bgcolor:T.success, boxShadow:"none",
                      "&:hover":{ bgcolor:"#059669", boxShadow:"none" } }}>
                    Save
                  </Button>
                </Box>
              )}
            </SCard>

            {/* Service Stats card */}
            <SCard sx={{
              p:2.5,
              background:`linear-gradient(135deg, ${T.accent} 0%, ${T.purple} 100%)`,
              color:"#fff"
            }} className="fu2">
              <SLabel sx={{ color:"rgba(255,255,255,0.65)", mb:1 }}>Total Service</SLabel>
              <Typography sx={{ fontFamily:fMono, fontWeight:700,
                fontSize:"2.4rem", color:"#fff", lineHeight:1 }}>
                {yrs}
              </Typography>
              <Typography sx={{ fontFamily:fBody, fontSize:"0.78rem",
                color:"rgba(255,255,255,0.7)", mb:2 }}>Years</Typography>

              <Divider sx={{ borderColor:"rgba(255,255,255,0.18)", mb:2 }} />

              <Grid container>
                {[
                  { label:"Promotions", value:"4" },
                  { label:"Transfers",  value:"2" },
                  { label:"Increments", value:INCREMENTS.length },
                  { label:"Awards",     value:AWARDS.length },
                ].map(s => (
                  <Grid item xs={6} key={s.label} sx={{ mb:1.5 }}>
                    <Typography sx={{ fontFamily:fMono, fontWeight:700,
                      fontSize:"1.5rem", color:"#fff" }}>{s.value}</Typography>
                    <Typography sx={{ fontFamily:fBody, fontSize:"0.7rem",
                      color:"rgba(255,255,255,0.65)" }}>{s.label}</Typography>
                  </Grid>
                ))}
              </Grid>
            </SCard>

            {/* Quick bio card */}
            <SCard sx={{ p:2.5 }} className="fu2">
              <Typography sx={{ fontFamily:fHead, fontWeight:700,
                fontSize:"0.88rem", color:T.text, mb:2 }}>
                Employment Details
              </Typography>
              <Stack spacing={1.5}>
                {[
                  { label:"Employee ID",   value:PROFILE.empId,    mono:true  },
                  { label:"Date of Birth", value:PROFILE.dob,      mono:true  },
                  { label:"Gender",        value:PROFILE.gender,   mono:false },
                  { label:"Category",      value:PROFILE.category, mono:false },
                  { label:"Date of Join",  value:PROFILE.joinDate, mono:true  },
                ].map(d => (
                  <Box key={d.label} sx={{ p:1.2, borderRadius:"8px",
                    bgcolor:"#F9FAFB", border:`1px solid ${T.border}` }}>
                    <SLabel sx={{ mb:0.2 }}>{d.label}</SLabel>
                    <Typography sx={{ fontFamily: d.mono ? fMono : fBody,
                      fontWeight:600, fontSize:"0.79rem", color:T.text }}>
                      {d.value}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </SCard>
          </Stack>
        </Grid>

        {/* ══════════════════════════════════════
            MAIN CONTENT — TABS
        ══════════════════════════════════════ */}
        <Grid item xs={12} md={8.5}>
          <SCard sx={{ overflow:"hidden" }} className="fu1">

            {/* Tab bar */}
            <Box sx={{ borderBottom:`1px solid ${T.border}`, bgcolor:"#FAFBFD" }}>
              <Tabs value={tabIndex} onChange={(_,v) => setTabIndex(v)}
                variant="scrollable" scrollButtons="auto" sx={{
                  px:2,
                  "& .MuiTabs-indicator":{ bgcolor:T.accent, height:"2.5px",
                    borderRadius:"2px 2px 0 0" },
                  "& .MuiTab-root":{ fontFamily:fBody, fontWeight:600, fontSize:"0.8rem",
                    textTransform:"none", color:T.textMute, minHeight:50,
                    "&.Mui-selected":{ color:T.accent } }
                }}>
                {TABS.map((t,i) => (
                  <Tab key={i} icon={<t.Icon sx={{fontSize:16}} />} iconPosition="start"
                    label={t.label} />
                ))}
              </Tabs>
            </Box>

            {/* ──────────────────────────────────
                TAB 0 — CAREER TIMELINE
            ────────────────────────────────── */}
            {tabIndex === 0 && (
              <Box p={3} className="fu">
                <Grid container spacing={3}>

                  {/* Promotion history */}
                  <Grid item xs={12} md={7}>
                    <Box display="flex" alignItems="center" gap={1} mb={2.5}>
                      <Box sx={{ p:0.75, borderRadius:"8px",
                        bgcolor:T.accentLight, color:T.accent }}>
                        <TrendingUp sx={{ fontSize:16 }} />
                      </Box>
                      <Typography sx={{ fontFamily:fHead, fontWeight:700,
                        fontSize:"0.9rem", color:T.text }}>
                        Promotion &amp; Role History
                      </Typography>
                    </Box>

                    <Stack spacing={0}>
                      {SERVICE_HISTORY.map((item, i) => (
                        <Box key={i} display="flex" gap={2} sx={{ position:"relative" }}>
                          {/* Timeline line */}
                          {i < SERVICE_HISTORY.length-1 && (
                            <Box sx={{ position:"absolute", left:17, top:36,
                              width:2, height:"calc(100% - 12px)",
                              bgcolor:T.border, zIndex:0 }} />
                          )}
                          {/* Dot */}
                          <Box sx={{ flexShrink:0, zIndex:1, mt:0.5 }}>
                            <Box sx={{ width:36, height:36, borderRadius:"50%",
                              bgcolor: i===0 ? item.color : "#F1F5F9",
                              border:`2px solid ${item.color}`,
                              display:"flex", alignItems:"center", justifyContent:"center" }}>
                              <Box sx={{ width:10, height:10, borderRadius:"50%",
                                bgcolor: i===0 ? "#fff" : item.color }} />
                            </Box>
                          </Box>
                          {/* Content */}
                          <Box sx={{ pb:3, flex:1 }}>
                            <Box sx={{ p:2, borderRadius:"10px",
                              border:`1px solid ${T.border}`,
                              bgcolor: i===0 ? `${item.color}08` : T.surface,
                              borderLeft:`3px solid ${item.color}` }}>
                              <Box display="flex" justifyContent="space-between"
                                alignItems="flex-start" flexWrap="wrap" gap={0.5} mb={0.5}>
                                <Typography sx={{ fontFamily:fBody, fontWeight:700,
                                  fontSize:"0.84rem", color:T.text }}>
                                  {item.title}
                                </Typography>
                                <Box sx={{ px:1, py:0.2, borderRadius:"6px",
                                  bgcolor:`${item.color}15` }}>
                                  <Typography sx={{ fontFamily:fMono, fontSize:"0.7rem",
                                    fontWeight:700, color:item.color }}>{item.year}</Typography>
                                </Box>
                              </Box>
                              <Typography sx={{ fontFamily:fBody, fontSize:"0.76rem",
                                color:T.textSub, lineHeight:1.6 }}>
                                {item.description}
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                      ))}
                    </Stack>
                  </Grid>

                  {/* Transfer log */}
                  <Grid item xs={12} md={5}>
                    <Box display="flex" alignItems="center" gap={1} mb={2.5}>
                      <Box sx={{ p:0.75, borderRadius:"8px",
                        bgcolor:T.purpleLight, color:T.purple }}>
                        <TransferWithinAStation sx={{ fontSize:16 }} />
                      </Box>
                      <Typography sx={{ fontFamily:fHead, fontWeight:700,
                        fontSize:"0.9rem", color:T.text }}>
                        Transfer Log
                      </Typography>
                    </Box>

                    <Stack spacing={2}>
                      {TRANSFERS.map((t,i) => (
                        <Box key={i} sx={{ p:2.2, borderRadius:"10px",
                          border:`1px solid ${T.border}`,
                          borderLeft:`3px solid ${T.purple}` }}>
                          <Box display="flex" justifyContent="space-between"
                            alignItems="flex-start" mb={1.2} flexWrap="wrap" gap={0.5}>
                            <Box sx={{ px:1, py:0.25, borderRadius:"6px",
                              bgcolor:T.purpleLight }}>
                              <Typography sx={{ fontFamily:fBody, fontSize:"0.69rem",
                                fontWeight:700, color:T.purple }}>{t.type}</Typography>
                            </Box>
                            <Box sx={{ px:1, py:0.25, borderRadius:"6px",
                              bgcolor:"#F1F5F9" }}>
                              <Typography sx={{ fontFamily:fMono, fontSize:"0.68rem",
                                fontWeight:600, color:T.textMute }}>{t.date}</Typography>
                            </Box>
                          </Box>
                          <Box display="flex" alignItems="center" gap={1} mb={0.7}>
                            <Box sx={{ flex:1, p:1.2, borderRadius:"7px", bgcolor:"#F9FAFB",
                              border:`1px solid ${T.border}` }}>
                              <SLabel sx={{ mb:0.2 }}>From</SLabel>
                              <Typography sx={{ fontFamily:fBody, fontSize:"0.77rem",
                                fontWeight:600, color:T.text }}>{t.from}</Typography>
                            </Box>
                            <ArrowForward sx={{ fontSize:16, color:T.purple, flexShrink:0 }} />
                            <Box sx={{ flex:1, p:1.2, borderRadius:"7px",
                              bgcolor:T.purpleLight, border:`1px solid ${T.purple}20` }}>
                              <SLabel sx={{ mb:0.2, color:T.purple }}>To</SLabel>
                              <Typography sx={{ fontFamily:fBody, fontSize:"0.77rem",
                                fontWeight:600, color:T.purple }}>{t.to}</Typography>
                            </Box>
                          </Box>
                          <Box display="flex" justifyContent="flex-end">
                            <Typography sx={{ fontFamily:fMono, fontSize:"0.68rem",
                              color:T.textMute }}>Order: {t.orderNo}</Typography>
                          </Box>
                        </Box>
                      ))}
                    </Stack>
                  </Grid>
                </Grid>
              </Box>
            )}

            {/* ──────────────────────────────────
                TAB 1 — SALARY & INCREMENTS
            ────────────────────────────────── */}
            {tabIndex === 1 && (
              <Box className="fu">
                {/* Current pay banner */}
                <Box sx={{
                  px:3, py:3,
                  background:`linear-gradient(135deg, ${T.successLight} 0%, #D1FAE5 100%)`,
                  borderBottom:`1px solid ${T.border}`,
                  display:"flex", justifyContent:"space-between",
                  alignItems:"center", flexWrap:"wrap", gap:2
                }}>
                  <Box>
                    <SLabel sx={{ color:T.success, mb:0.5 }}>Current Basic Pay</SLabel>
                    <Typography sx={{ fontFamily:fMono, fontWeight:700,
                      fontSize:"2.2rem", color:T.success, lineHeight:1.1 }}>
                      ₹1,42,000
                    </Typography>
                    <Typography sx={{ fontFamily:fBody, fontSize:"0.74rem",
                      color:T.success, mt:0.3 }}>
                      Effective July 2023 · Grade 13A
                    </Typography>
                  </Box>

                  <Box display="flex" gap={2} flexWrap="wrap">
                    {[
                      { label:"HRA",       value:"₹51,120" },
                      { label:"TA",        value:"₹3,600"  },
                      { label:"Gross Pay", value:"₹2,12,400" },
                    ].map(s => (
                      <Box key={s.label} sx={{ p:1.5, borderRadius:"10px",
                        bgcolor:T.surface, border:`1px solid ${T.border}`, minWidth:100 }}>
                        <SLabel sx={{ mb:0.2 }}>{s.label}</SLabel>
                        <Typography sx={{ fontFamily:fMono, fontWeight:700,
                          fontSize:"0.92rem", color:T.success }}>{s.value}</Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>

                {/* Increments table */}
                <Box p={3}>
                  <Box display="flex" alignItems="center" gap={1} mb={2}>
                    <Box sx={{ p:0.75, borderRadius:"8px",
                      bgcolor:T.successLight, color:T.success }}>
                      <CalendarMonth sx={{ fontSize:15 }} />
                    </Box>
                    <Typography sx={{ fontFamily:fHead, fontWeight:700,
                      fontSize:"0.9rem", color:T.text }}>
                      Increment History
                    </Typography>
                  </Box>

                  <Box sx={{ borderRadius:"10px", border:`1px solid ${T.border}`, overflow:"hidden" }}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TH>Effective Date</TH>
                          <TH>Order Number</TH>
                          <TH>Type</TH>
                          <TH>Increment Amount</TH>
                          <TH>New Basic Pay</TH>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {INCREMENTS.map((row, i) => (
                          <TableRow key={i} className="row-h">
                            <TD sx={{ fontWeight:700, color:T.text }}>
                              {row.month} {row.year}
                            </TD>
                            <TD>
                              <Typography sx={{ fontFamily:fMono, fontSize:"0.77rem",
                                color:T.textSub }}>{row.orderNo}</Typography>
                            </TD>
                            <TD>
                              <Box sx={{ px:1, py:0.28, borderRadius:"6px", display:"inline-block",
                                bgcolor: row.type==="Promotion" ? T.accentLight : T.successLight }}>
                                <Typography sx={{ fontFamily:fBody, fontSize:"0.69rem",
                                  fontWeight:700,
                                  color: row.type==="Promotion" ? T.accent : T.success }}>
                                  {row.type}
                                </Typography>
                              </Box>
                            </TD>
                            <TD>
                              <Typography sx={{ fontFamily:fMono, fontWeight:700,
                                fontSize:"0.85rem", color:T.success }}>
                                +{row.amount}
                              </Typography>
                            </TD>
                            <TD>
                              <Typography sx={{ fontFamily:fMono, fontWeight:600,
                                fontSize:"0.82rem" }}>{row.newBasic}</Typography>
                            </TD>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Box>
                </Box>
              </Box>
            )}

            {/* ──────────────────────────────────
                TAB 2 — PROFESSIONAL PORTFOLIO
            ────────────────────────────────── */}
            {tabIndex === 2 && (
              <Box p={3} className="fu">

                {/* Awards */}
                <Box display="flex" alignItems="center" gap={1} mb={2}>
                  <Box sx={{ p:0.75, borderRadius:"8px",
                    bgcolor:T.goldLight, color:T.gold }}>
                    <EmojiEvents sx={{ fontSize:15 }} />
                  </Box>
                  <Typography sx={{ fontFamily:fHead, fontWeight:700,
                    fontSize:"0.9rem", color:T.text }}>
                    Awards &amp; Honours
                  </Typography>
                </Box>

                <Grid container spacing={2} mb={3}>
                  {AWARDS.map((a,i) => (
                    <Grid item xs={12} sm={6} md={4} key={i}>
                      <Box className="card-h" sx={{
                        p:2.2, borderRadius:"12px",
                        border:`1px solid ${T.border}`,
                        borderTop:`3px solid ${a.color}`,
                        bgcolor:T.surface, height:"100%"
                      }}>
                        <Box sx={{ p:1.2, borderRadius:"9px",
                          bgcolor:a.bg, width:"fit-content", mb:1.5 }}>
                          <a.Icon sx={{ fontSize:22, color:a.color, display:"block" }} />
                        </Box>
                        <Typography sx={{ fontFamily:fBody, fontWeight:700,
                          fontSize:"0.84rem", color:T.text, mb:0.4 }}>
                          {a.title}
                        </Typography>
                        <Typography sx={{ fontFamily:fBody, fontSize:"0.72rem",
                          color:T.textMute }}>{a.authority}</Typography>
                        <Box sx={{ mt:1.5, px:0.9, py:0.25, borderRadius:"6px",
                          bgcolor:a.bg, display:"inline-block" }}>
                          <Typography sx={{ fontFamily:fMono, fontSize:"0.68rem",
                            fontWeight:700, color:a.color }}>{a.year}</Typography>
                        </Box>
                      </Box>
                    </Grid>
                  ))}
                </Grid>

                <Divider sx={{ borderColor:T.border, mb:3 }} />

                {/* Memberships */}
                <Box display="flex" alignItems="center" gap={1} mb={2}>
                  <Box sx={{ p:0.75, borderRadius:"8px",
                    bgcolor:T.accentLight, color:T.accent }}>
                    <CardMembership sx={{ fontSize:15 }} />
                  </Box>
                  <Typography sx={{ fontFamily:fHead, fontWeight:700,
                    fontSize:"0.9rem", color:T.text }}>
                    Professional Memberships
                  </Typography>
                </Box>

                <Grid container spacing={2}>
                  {MEMBERSHIPS.map((m,i) => (
                    <Grid item xs={12} sm={6} key={i}>
                      <Box className="card-h" sx={{
                        p:2.2, borderRadius:"12px",
                        border:`1px solid ${T.border}`,
                        borderLeft:`4px solid ${m.color}`,
                        bgcolor:T.surface, position:"relative"
                      }}>
                        <Box display="flex" justifyContent="space-between"
                          alignItems="flex-start" mb={1.2}>
                          <Box sx={{ p:0.8, borderRadius:"8px",
                            bgcolor:`${m.color}12`, color:m.color }}>
                            <CardMembership sx={{ fontSize:18 }} />
                          </Box>
                          <StatusBadge status={m.status} />
                        </Box>
                        <Typography sx={{ fontFamily:fBody, fontWeight:700,
                          fontSize:"0.84rem", color:T.text, mb:0.6 }}>
                          {m.org}
                        </Typography>
                        <Box display="flex" gap={3}>
                          <Box>
                            <SLabel sx={{ mb:0.1 }}>Member ID</SLabel>
                            <Typography sx={{ fontFamily:fMono, fontSize:"0.74rem",
                              fontWeight:600, color:T.textSub }}>{m.id}</Typography>
                          </Box>
                          <Box>
                            <SLabel sx={{ mb:0.1 }}>Valid Till</SLabel>
                            <Typography sx={{ fontFamily:fMono, fontSize:"0.74rem",
                              fontWeight:600,
                              color: m.status==="Expired" ? T.danger
                                   : m.status==="Expiring" ? T.warning : T.textSub }}>
                              {m.expiry}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}

          </SCard>
        </Grid>
      </Grid>

      {/* ── Certificate Download Dialog ── */}
      <Dialog open={certDialog} onClose={() => setCertDialog(false)}
        maxWidth="xs" fullWidth
        PaperProps={{ sx:{ borderRadius:"16px", border:`1px solid ${T.border}` } }}>
        <DialogTitle sx={{ borderBottom:`1px solid ${T.border}`, bgcolor:"#FAFBFD", pb:2 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box display="flex" alignItems="center" gap={1.5}>
              <Box sx={{ width:4, height:24, borderRadius:2, bgcolor:T.accent }} />
              <Typography sx={{ fontFamily:fHead, fontWeight:700,
                fontSize:"0.95rem", color:T.text }}>Download Certificate</Typography>
            </Box>
            <IconButton size="small" onClick={() => setCertDialog(false)}
              sx={{ bgcolor:"#F1F5F9", borderRadius:"8px" }}>
              <Close fontSize="small" />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ px:3, pt:3, pb:2 }}>
          <Stack spacing={1.5}>
            {[
              "Experience Certificate",
              "Service & Conduct Certificate",
              "Salary Certificate",
              "No Objection Certificate (NOC)",
            ].map(cert => (
              <Box key={cert} display="flex" justifyContent="space-between"
                alignItems="center"
                sx={{ p:1.6, borderRadius:"9px", border:`1px solid ${T.border}`,
                  bgcolor:"#F9FAFB", "&:hover":{ borderColor:T.accent, bgcolor:T.accentLight },
                  transition:"all .14s", cursor:"pointer" }}
                onClick={() => { setCertDialog(false); toast(`${cert} PDF downloading…`); }}>
                <Typography sx={{ fontFamily:fBody, fontSize:"0.82rem",
                  fontWeight:600, color:T.text }}>{cert}</Typography>
                <Download sx={{ fontSize:16, color:T.accent }} />
              </Box>
            ))}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px:3, pb:3, pt:1.5, borderTop:`1px solid ${T.border}` }}>
          <Button onClick={() => setCertDialog(false)} variant="outlined" size="small"
            sx={{ fontFamily:fBody, fontWeight:600, fontSize:"0.78rem",
              textTransform:"none", borderRadius:"8px",
              borderColor:T.border, color:T.textSub }}>
            Close
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

export default ServiceBookView;