import React, { useState } from 'react';
import {
  Box, Tabs, Tab, Card, Typography, Button, Grid, Chip,
  Table, TableBody, TableCell, TableHead, TableRow,
  Stack, Avatar, LinearProgress, Divider, IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, MenuItem, Tooltip, Badge, Snackbar, Alert,
  InputAdornment, Collapse
} from "@mui/material";
import {
  Work, School, Gavel, Handshake, Mic, Description,
  Newspaper, AssignmentInd, Add, OpenInNew, Close,
  TrendingUp, AttachMoney, Groups, EmojiEvents,
  Download, Search, FilterList, MoreVert, Edit,
  ArrowUpward, Star, CheckCircle, AccessTime,
  CalendarToday, Business, Language, KeyboardArrowRight,
  BarChart, Visibility
} from '@mui/icons-material';

/* ─── Design Tokens ─── */
const T = {
  bg:          "#F5F7FA",
  surface:     "#FFFFFF",
  border:      "#E4E8EF",
  accent:      "#6366F1",       // indigo — matches platform primary
  accentLight: "#EEF2FF",
  teal:        "#6366F1",       // unified to accent (was teal)
  tealLight:   "#EEF2FF",
  success:     "#10B981",
  successLight:"#ECFDF5",
  warning:     "#F59E0B",
  warningLight:"#FFFBEB",
  danger:      "#EF4444",
  dangerLight: "#FEF2F2",
  purple:      "#6366F1",       // unified to accent (was purple)
  purpleLight: "#EEF2FF",
  amber:       "#F59E0B",       // unified to warning (was orange)
  amberLight:  "#FFFBEB",
  text:        "#111827",
  textSub:     "#4B5563",
  textMute:    "#9CA3AF",
};

const fHead = "Roboto, Helvetica, Arial, sans-serif";
const fBody = "Roboto, Helvetica, Arial, sans-serif";
const fMono = "Roboto, Helvetica, Arial, sans-serif";

const Fonts = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@600;700;800&family=DM+Sans:wght@400;500;600&family=JetBrains+Mono:wght@500;600&display=swap');
    * { box-sizing:border-box; }
    @keyframes fadeUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:none} }
    .fu  { animation: fadeUp 0.3s ease both; }
    .fu1 { animation-delay:.05s }
    .fu2 { animation-delay:.10s }
    .fu3 { animation-delay:.15s }
    .fu4 { animation-delay:.20s }
    .row-h:hover { background:#F8FAFC !important; transition:background 0.15s; }
  `}</style>
);

/* ─── Mock Data ─── */
const MOCK = {
  consultancy: [
    { id:1, title:"AI-based Predictive Maintenance System", client:"Infosys Ltd", role:"Principal Investigator", revenue:450000, status:"Ongoing",  start:"Jan 2026", end:"Dec 2026" },
    { id:2, title:"IoT Water Quality Monitoring",           client:"BWSSB",       role:"Co-Investigator",      revenue:180000, status:"Completed", start:"Mar 2025", end:"Nov 2025" },
    { id:3, title:"Blockchain Supply Chain Audit",          client:"TVS Motors",  role:"Consultant",           revenue:220000, status:"Ongoing",  start:"Feb 2026", end:"Aug 2026" },
  ],
  guestLectures: [
    { id:1, topic:"Machine Learning in Healthcare",        host:"RV College of Engineering",    date:"2026-01-18", audience:120, mode:"Offline", certificate:true },
    { id:2, topic:"Ethics of AI — A Critical Perspective", host:"IIT Bombay (Virtual Summit)",  date:"2025-12-05", audience:800, mode:"Online",  certificate:true },
    { id:3, topic:"Embedded Systems for IoT",              host:"PESIT, Bangalore",             date:"2025-10-22", audience:90,  mode:"Offline", certificate:false },
  ],
  examDuties: [
    { id:1, institution:"VTU",          role:"Paper Setter",  subject:"Data Structures",     date:"2026-01-10", status:"Completed", fee:3000 },
    { id:2, institution:"Anna University", role:"Chief Examiner", subject:"Machine Learning", date:"2026-02-20", status:"Upcoming",  fee:5000 },
    { id:3, institution:"Mangalore Uni", role:"Evaluator",    subject:"Computer Networks",   date:"2025-11-15", status:"Completed", fee:2500 },
  ],
  thesisEvaluation: [
    { id:1, student:"Mr. Arun Patel",    university:"IIT Delhi",    title:"Deep Learning for Medical Imaging", type:"PhD",     fee:8000, status:"Report Submitted" },
    { id:2, student:"Ms. Kavya Sharma",  university:"NIT Trichy",   title:"Federated Learning in Edge Devices", type:"PhD",    fee:8000, status:"Pending Review" },
    { id:3, student:"Mr. Rohan Das",     university:"BITS Pilani",  title:"Smart Grid Optimization using RL",   type:"Master's",fee:3000, status:"Evaluation Done" },
  ],
  expertTalks: [
    { id:1, type:"Keynote",     topic:"Future of Explainable AI",         event:"IEEE International Conference on AI 2026",        location:"Bangalore",  date:"2026-01-25" },
    { id:2, type:"Invited Talk",topic:"Quantum Computing: Myths & Reality",event:"National Science Day Lecture Series, DST",         location:"New Delhi",  date:"2025-11-14" },
    { id:3, type:"Panel Expert", topic:"Industry 4.0 & Academia",          event:"CII Annual Technology Summit",                    location:"Mumbai",     date:"2025-09-08" },
    { id:4, type:"Workshop",    topic:"Hands-on Deep Learning with PyTorch", event:"TEQIP Faculty Development Programme",           location:"Mysore (Online)", date:"2025-08-20" },
  ],
  collaborations: [
    { id:1, partner:"Microsoft Research India", scope:"Joint Research on Responsible AI",  type:"Research MoU",  validTill:"Dec 2027", status:"Active" },
    { id:2, partner:"Bosch India",              scope:"Embedded Systems Internship Program",type:"Industry MoU", validTill:"Jun 2026",  status:"Active" },
    { id:3, partner:"ISRO SAC",                 scope:"Remote Sensing Data Analysis",       type:"Research MoU", validTill:"Mar 2027",  status:"Active" },
    { id:4, partner:"NASSCOM Foundation",       scope:"Digital Literacy Outreach Program",  type:"CSR MoU",      validTill:"Jan 2026",  status:"Expired" },
  ],
  services: [
    { id:1, role:"Associate Editor",    organization:"IEEE Transactions on Neural Networks",      details:"Handling 15+ manuscripts/year",  year:"2024–Present" },
    { id:2, role:"Technical Reviewer",  organization:"ACM Computing Surveys",                    details:"Reviewed 8 papers in 2025",      year:"2023–Present" },
    { id:3, role:"TPC Member",          organization:"IEEE CVPR 2026",                           details:"Track: Explainable AI",          year:"2026"         },
    { id:4, role:"Conference Secretary",organization:"ICCSP 2025, NIT Trichy",                   details:"Organized 3-day event",          year:"2025"         },
  ],
  media: [
    { id:1, type:"Article",      title:"AI and the Future of Education in India",    outlet:"The Hindu – Education Plus", date:"2026-01-12", link:"#" },
    { id:2, type:"TV Interview", title:"Panel on National AI Policy",                outlet:"DD Science Channel",          date:"2025-11-30", link:"#" },
    { id:3, type:"Podcast",      title:"Decoding Deep Learning with Dr. Naveen",     outlet:"TechTalks India Podcast",     date:"2025-10-05", link:"#" },
    { id:4, type:"Blog / Op-Ed", title:"Why India Needs Ethical AI Frameworks Now",  outlet:"YourStory Tech",              date:"2025-09-20", link:"#" },
  ],
};

const STATS = {
  totalRevenue: 850000,
  talksCount:   7,
  collabCount:  3,
  papers:       4,
  citationsMonth: 12,
  goalPercent: 70,
};

/* ─── Reusable UI ─── */
const SCard = ({ children, sx={}, ...p }) => (
  <Box sx={{ background:T.surface, border:`1px solid ${T.border}`, borderRadius:"14px", ...sx }} {...p}>
    {children}
  </Box>
);

const SLabel = ({ children, sx={} }) => (
  <Typography sx={{ fontFamily:fBody, fontSize:"0.67rem", fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase", color:T.textMute, mb:0.5, ...sx }}>
    {children}
  </Typography>
);

const StatusChip = ({ label, color="default" }) => {
  const map = {
    Ongoing:          { bg:"#F0FDF4", color:T.success  },
    Completed:        { bg:"#F1F5F9", color:T.textMute },
    "Active":         { bg:"#F0FDF4", color:T.success  },
    "Expired":        { bg:"#FEF2F2", color:T.danger   },
    "Upcoming":       { bg:"#FFF7ED", color:T.amber    },
    "Pending Review": { bg:"#FFFBEB", color:T.warning  },
    "Report Submitted":{ bg:"#F0F9FF", color:T.accent  },
    "Evaluation Done":{ bg:"#F0FDF4", color:T.success  },
    default:          { bg:"#F1F5F9", color:T.textMute },
  };
  const s = map[label] || map.default;
  return (
    <Box sx={{ px:1.2, py:0.35, borderRadius:"99px", bgcolor:s.bg, display:"inline-flex", alignItems:"center", gap:0.5 }}>
      <Box sx={{ width:5, height:5, borderRadius:"50%", bgcolor:s.color }} />
      <Typography sx={{ fontFamily:fBody, fontSize:"0.71rem", fontWeight:700, color:s.color }}>{label}</Typography>
    </Box>
  );
};

const TypeBadge = ({ label, color=T.accent }) => (
  <Box sx={{ px:1, py:0.25, borderRadius:"5px", bgcolor:`${color}18`, border:`1px solid ${color}30`, display:"inline-block" }}>
    <Typography sx={{ fontFamily:fMono, fontSize:"0.65rem", fontWeight:700, color }}>{label}</Typography>
  </Box>
);

const TableHCell = ({ children }) => (
  <TableCell sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.68rem", letterSpacing:"0.06em", textTransform:"uppercase", color:T.textMute, borderBottom:`1px solid ${T.border}`, py:1.5, bgcolor:"#F8FAFC", whiteSpace:"nowrap" }}>
    {children}
  </TableCell>
);

const TableBCell = ({ children, sx={} }) => (
  <TableCell sx={{ fontFamily:fBody, fontSize:"0.81rem", color:T.textSub, borderBottom:`1px solid ${T.border}`, py:1.6, ...sx }}>
    {children}
  </TableCell>
);

/* ─── Field builder for Add Activity dialogs ─── */
const DField = ({ label, children }) => (
  <Box>
    <SLabel sx={{ mb:0.7 }}>{label}</SLabel>
    {children}
  </Box>
);

const DTextField = ({ ...p }) => (
  <TextField size="small" fullWidth {...p}
    sx={{ "& .MuiOutlinedInput-root":{ borderRadius:"8px", fontFamily:fBody, fontSize:"0.82rem", "& fieldset":{borderColor:T.border}, "&.Mui-focused fieldset":{borderColor:T.accent} }, "& .MuiInputLabel-root.Mui-focused":{color:T.accent}, ...p.sx }} />
);

/* ─── Generic Add Dialog ─── */
const AddDialog = ({ open, onClose, title, color, fields, onSubmit }) => {
  const [vals, setVals] = useState({});
  const set = (k, v) => setVals(p => ({ ...p, [k]: v }));

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx:{ borderRadius:"16px", border:`1px solid ${T.border}` } }}>
      <DialogTitle sx={{ fontFamily:fHead, fontWeight:700, fontSize:"1rem", color:T.text, borderBottom:`1px solid ${T.border}`, bgcolor:"#FAFBFD", pb:2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" alignItems="center" gap={1.2}>
            <Box sx={{ width:4, height:22, borderRadius:2, bgcolor: color || T.accent }} />
            {title}
          </Box>
          <IconButton size="small" onClick={onClose} sx={{ bgcolor:"#F1F5F9", borderRadius:"8px" }}><Close fontSize="small" /></IconButton>
        </Box>
      </DialogTitle>
      <DialogContent sx={{ px:3, pt:3, pb:2 }}>
        <Stack spacing={2.2}>
          {fields.map(f => (
            <DField key={f.key} label={f.label}>
              {f.type === "select" ? (
                <DTextField select value={vals[f.key]||""} onChange={e=>set(f.key,e.target.value)}>
                  {f.options.map(o=><MenuItem key={o} value={o} sx={{fontFamily:fBody,fontSize:"0.82rem"}}>{o}</MenuItem>)}
                </DTextField>
              ) : f.type === "multiline" ? (
                <DTextField multiline rows={3} value={vals[f.key]||""} onChange={e=>set(f.key,e.target.value)} placeholder={f.placeholder||""} />
              ) : (
                <DTextField type={f.type||"text"} value={vals[f.key]||""} onChange={e=>set(f.key,e.target.value)} placeholder={f.placeholder||""} InputProps={f.startAdornment ? { startAdornment:<InputAdornment position="start"><Typography sx={{fontFamily:fMono,fontSize:"0.82rem",color:T.textMute}}>{f.startAdornment}</Typography></InputAdornment> } : undefined} />
              )}
            </DField>
          ))}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px:3, pb:3, gap:1, borderTop:`1px solid ${T.border}`, pt:2, bgcolor:"#FAFBFD" }}>
        <Button onClick={onClose} variant="outlined" sx={{ fontFamily:fBody, fontWeight:600, fontSize:"0.8rem", textTransform:"none", borderRadius:"8px", borderColor:T.border, color:T.textSub }}>Cancel</Button>
        <Button variant="contained" onClick={() => { onSubmit(vals); setVals({}); onClose(); }}
          sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.8rem", textTransform:"none", borderRadius:"8px", bgcolor: color||T.accent, boxShadow:"none", "&:hover":{ filter:"brightness(0.9)", boxShadow:"none" } }}>
          Save Activity
        </Button>
      </DialogActions>
    </Dialog>
  );
};

/* ════════════════════════════════
   MAIN COMPONENT
════════════════════════════════ */
const EngagementView = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [data, setData] = useState(MOCK);
  const [dialog, setDialog] = useState(null); // which dialog is open
  const [snack, setSnack] = useState({ open:false, msg:"" });

  const toast = (msg) => setSnack({ open:true, msg });

  const append = (key, item) => {
    setData(prev => ({ ...prev, [key]: [{ id: Date.now(), ...item }, ...prev[key]] }));
    toast("Activity logged successfully!");
  };

  const tabs = [
    { label:"Consultancy",    icon:Work,       color:T.teal    },
    { label:"Guest Lectures", icon:School,     color:T.accent  },
    { label:"Exam Duties",    icon:AssignmentInd, color:T.purple },
    { label:"Thesis Examiner",icon:Gavel,      color:T.amber   },
    { label:"Expert Talks",   icon:Mic,        color:T.purple  },
    { label:"Industry Collab",icon:Handshake,  color:T.success },
    { label:"Prof. Services", icon:Description,color:T.accent  },
    { label:"Media",          icon:Newspaper,  color:T.danger  },
  ];

  /* ── Dialog field configs per tab ── */
  const dialogConfigs = {
    consultancy: {
      title:"Log Consultancy Project", color:T.teal,
      fields:[
        { key:"title",   label:"Project Title",  placeholder:"e.g. AI-based predictive system" },
        { key:"client",  label:"Client / Industry Partner" },
        { key:"role",    label:"Your Role",    type:"select", options:["Principal Investigator","Co-Investigator","Consultant","Advisor"] },
        { key:"revenue", label:"Revenue (₹)", type:"number", startAdornment:"₹" },
        { key:"start",   label:"Start Date",  type:"date" },
        { key:"end",     label:"End Date",    type:"date" },
        { key:"status",  label:"Status",      type:"select", options:["Ongoing","Completed"] },
      ],
      onSubmit: (v) => append("consultancy", { title:v.title||"Untitled Project", client:v.client||"—", role:v.role||"Consultant", revenue:parseInt(v.revenue)||0, start:v.start||"—", end:v.end||"—", status:v.status||"Ongoing" }),
    },
    guestLectures: {
      title:"Log Guest Lecture", color:T.accent,
      fields:[
        { key:"topic",    label:"Lecture Topic",       placeholder:"e.g. AI in Healthcare" },
        { key:"host",     label:"Host Institution" },
        { key:"date",     label:"Date",   type:"date"   },
        { key:"audience", label:"Audience Size (approx.)", type:"number" },
        { key:"mode",     label:"Mode",   type:"select", options:["Offline","Online","Hybrid"] },
      ],
      onSubmit: (v) => append("guestLectures", { topic:v.topic||"Untitled", host:v.host||"—", date:v.date||"—", audience:parseInt(v.audience)||0, mode:v.mode||"Offline", certificate:false }),
    },
    examDuties: {
      title:"Log Exam Duty", color:T.purple,
      fields:[
        { key:"institution", label:"University / Institution" },
        { key:"role",        label:"Role", type:"select", options:["Paper Setter","Chief Examiner","Evaluator","Observer","Invigilator"] },
        { key:"subject",     label:"Subject / Paper" },
        { key:"date",        label:"Date", type:"date" },
        { key:"fee",         label:"Duty Fee (₹)", type:"number", startAdornment:"₹" },
        { key:"status",      label:"Status", type:"select", options:["Upcoming","Completed"] },
      ],
      onSubmit: (v) => append("examDuties", { institution:v.institution||"—", role:v.role||"Evaluator", subject:v.subject||"—", date:v.date||"—", fee:parseInt(v.fee)||0, status:v.status||"Upcoming" }),
    },
    thesisEvaluation: {
      title:"Log Thesis Evaluation", color:T.amber,
      fields:[
        { key:"student",    label:"Scholar Name" },
        { key:"university", label:"University" },
        { key:"title",      label:"Thesis Title", placeholder:"Full thesis title" },
        { key:"type",       label:"Degree Type", type:"select", options:["PhD","Master's","MPhil"] },
        { key:"fee",        label:"Evaluation Fee (₹)", type:"number", startAdornment:"₹" },
        { key:"status",     label:"Status", type:"select", options:["Pending Review","Report Submitted","Evaluation Done"] },
      ],
      onSubmit: (v) => append("thesisEvaluation", { student:v.student||"—", university:v.university||"—", title:v.title||"—", type:v.type||"PhD", fee:parseInt(v.fee)||0, status:v.status||"Pending Review" }),
    },
    expertTalks: {
      title:"Log Expert Talk / Keynote", color:T.purple,
      fields:[
        { key:"type",     label:"Talk Type", type:"select", options:["Keynote","Invited Talk","Panel Expert","Workshop","Webinar"] },
        { key:"topic",    label:"Talk Title / Topic" },
        { key:"event",    label:"Conference / Event Name" },
        { key:"location", label:"Location / Platform" },
        { key:"date",     label:"Date", type:"date" },
      ],
      onSubmit: (v) => append("expertTalks", { type:v.type||"Invited Talk", topic:v.topic||"—", event:v.event||"—", location:v.location||"—", date:v.date||"—" }),
    },
    collaborations: {
      title:"Log Industry Collaboration / MoU", color:T.success,
      fields:[
        { key:"partner",   label:"Partner Organisation" },
        { key:"scope",     label:"Scope / Purpose" },
        { key:"type",      label:"MoU Type", type:"select", options:["Research MoU","Industry MoU","CSR MoU","Academic MoU"] },
        { key:"validTill", label:"Valid Until", type:"date" },
        { key:"status",    label:"Status", type:"select", options:["Active","Expired","Pending"] },
      ],
      onSubmit: (v) => append("collaborations", { partner:v.partner||"—", scope:v.scope||"—", type:v.type||"Industry MoU", validTill:v.validTill||"—", status:v.status||"Active" }),
    },
    services: {
      title:"Log Professional Service", color:T.accent,
      fields:[
        { key:"role",         label:"Role / Position", placeholder:"e.g. Reviewer, TPC Member" },
        { key:"organization", label:"Journal / Conference / Body" },
        { key:"details",      label:"Details", placeholder:"e.g. Reviewed 10 papers", type:"multiline" },
        { key:"year",         label:"Year / Duration", placeholder:"e.g. 2025 or 2024–Present" },
      ],
      onSubmit: (v) => append("services", { role:v.role||"—", organization:v.organization||"—", details:v.details||"—", year:v.year||"—" }),
    },
    media: {
      title:"Log Media Appearance / Article", color:T.danger,
      fields:[
        { key:"type",   label:"Type", type:"select", options:["Article","TV Interview","Podcast","Blog / Op-Ed","Radio","Social Media"] },
        { key:"title",  label:"Title / Headline" },
        { key:"outlet", label:"Publication / Channel" },
        { key:"date",   label:"Date", type:"date" },
        { key:"link",   label:"URL / Link", placeholder:"https://..." },
      ],
      onSubmit: (v) => append("media", { type:v.type||"Article", title:v.title||"—", outlet:v.outlet||"—", date:v.date||"—", link:v.link||"#" }),
    },
  };

  const tabKeys = ["consultancy","guestLectures","examDuties","thesisEvaluation","expertTalks","collaborations","services","media"];
  const currentKey = tabKeys[tabIndex];
  const cfg = dialogConfigs[currentKey];

  /* ── Computed stats ── */
  const totalRevenue = data.consultancy.reduce((s,r)=>s+(r.revenue||0),0) + data.examDuties.reduce((s,r)=>s+(r.fee||0),0) + data.thesisEvaluation.reduce((s,r)=>s+(r.fee||0),0);

  return (
    <Box sx={{ p:3, bgcolor:T.bg, minHeight:"100vh", fontFamily:fBody }}>
      <Fonts />

      {/* ── Header ── */}
      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3}>
        <Box>
          <Typography sx={{ fontFamily:fHead, fontWeight:800, fontSize:"1.5rem", color:T.text, lineHeight:1.1 }}>External Engagement</Typography>
          <Typography sx={{ fontFamily:fBody, fontSize:"0.82rem", color:T.textSub, mt:0.4 }}>
            Dr. Naveen Kumar &nbsp;·&nbsp; Academic Year 2025–26 &nbsp;·&nbsp; CSE Department
          </Typography>
        </Box>
        <Box display="flex" gap={1.5}>
          <Button variant="outlined" size="small" startIcon={<Download sx={{fontSize:16}} />}
            sx={{ fontFamily:fBody, fontWeight:600, fontSize:"0.76rem", textTransform:"none", borderRadius:"8px", borderColor:T.border, color:T.textSub, "&:hover":{borderColor:T.accent,color:T.accent} }}>
            Export Report
          </Button>
          <Button variant="contained" size="small" startIcon={<Add sx={{fontSize:16}} />}
            onClick={() => setDialog(currentKey)}
            sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.76rem", textTransform:"none", borderRadius:"8px", bgcolor:tabs[tabIndex].color, boxShadow:"none", "&:hover":{filter:"brightness(0.9)",boxShadow:"none"} }}>
            Log {tabs[tabIndex].label}
          </Button>
        </Box>
      </Box>

      {/* ── Impact Strip ── */}
      <Grid container spacing={2} mb={3}>
        {[
          { label:"Revenue Generated (YTD)", value:`₹${(totalRevenue/100000).toFixed(1)}L`, sub:"Consultancy + Duties + Thesis", color:T.teal,    icon:AttachMoney  },
          { label:"Expert Talks Delivered",   value:data.expertTalks.length,                sub:`Goal: 10  ·  ${Math.round((data.expertTalks.length/10)*100)}% achieved`, color:T.accent,  icon:Mic          },
          { label:"Active MoUs",              value:data.collaborations.filter(c=>c.status==="Active").length, sub:"Industry & Research partnerships", color:T.success, icon:Handshake },
          { label:"Media Citations (YTD)",    value:STATS.citationsMonth,                   sub:"Across all outlets this year",   color:T.purple,  icon:Newspaper    },
        ].map((s,i) => (
          <Grid item xs={6} md={3} key={i}>
            <SCard sx={{ p:2.5 }} className={`fu fu${i+1}`}>
              <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                <Box>
                  <SLabel>{s.label}</SLabel>
                  <Typography sx={{ fontFamily:fMono, fontWeight:700, fontSize:"1.7rem", color:s.color, lineHeight:1.1 }}>{s.value}</Typography>
                  <Typography sx={{ fontFamily:fBody, fontSize:"0.69rem", color:T.textMute, mt:0.4, lineHeight:1.4 }}>{s.sub}</Typography>
                </Box>
                <Box sx={{ p:1.1, borderRadius:"10px", bgcolor:`${s.color}15`, color:s.color }}>
                  <s.icon sx={{ fontSize:20 }} />
                </Box>
              </Box>
            </SCard>
          </Grid>
        ))}
      </Grid>

      {/* ── Outreach goal card ── */}
      <SCard sx={{ p:2.5, mb:3, display:"flex", alignItems:"center", gap:3, flexWrap:"wrap" }}>
        <Box flex={1} minWidth={200}>
          <Box display="flex" justifyContent="space-between" mb={0.8}>
            <Typography sx={{ fontFamily:fBody, fontWeight:600, fontSize:"0.83rem", color:T.text }}>Annual Outreach Goal Progress</Typography>
            <Typography sx={{ fontFamily:fMono, fontWeight:700, fontSize:"0.83rem", color:T.success }}>70%</Typography>
          </Box>
          <LinearProgress variant="determinate" value={70} sx={{ height:7, borderRadius:99, bgcolor:"#E2E8F0", "& .MuiLinearProgress-bar":{ bgcolor:T.success, borderRadius:99 } }} />
          <Typography sx={{ fontFamily:fBody, fontSize:"0.72rem", color:T.textMute, mt:0.8 }}>
            {data.expertTalks.length} of 10 expert talks &nbsp;·&nbsp; {data.guestLectures.length} guest lectures &nbsp;·&nbsp; {data.collaborations.filter(c=>c.status==="Active").length} active MoUs
          </Typography>
        </Box>
        <Box display="flex" gap={2} flexShrink={0}>
          {[
            { label:"Talks", val:data.expertTalks.length,    max:10, color:T.accent  },
            { label:"Lectures", val:data.guestLectures.length, max:6, color:T.purple },
            { label:"MoUs",  val:data.collaborations.filter(c=>c.status==="Active").length, max:5, color:T.success },
          ].map(g => (
            <Box key={g.label} sx={{ textAlign:"center", minWidth:56 }}>
              <Box sx={{ position:"relative", display:"inline-flex" }}>
                <Box sx={{ width:48, height:48, borderRadius:"50%", background:`conic-gradient(${g.color} ${(g.val/g.max)*360}deg, #E2E8F0 0deg)`, display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <Box sx={{ width:34, height:34, borderRadius:"50%", bgcolor:T.surface, display:"flex", alignItems:"center", justifyContent:"center" }}>
                    <Typography sx={{ fontFamily:fMono, fontSize:"0.7rem", fontWeight:700, color:g.color }}>{g.val}/{g.max}</Typography>
                  </Box>
                </Box>
              </Box>
              <Typography sx={{ fontFamily:fBody, fontSize:"0.67rem", color:T.textMute, mt:0.5 }}>{g.label}</Typography>
            </Box>
          ))}
        </Box>
      </SCard>

      {/* ── Main Tab Card ── */}
      <SCard sx={{ overflow:"hidden" }}>
        <Box sx={{ borderBottom:`1px solid ${T.border}`, bgcolor:"#FAFBFD" }}>
          <Tabs value={tabIndex} onChange={(_,v) => setTabIndex(v)} variant="scrollable" scrollButtons="auto"
            sx={{ "& .MuiTabs-indicator":{ bgcolor:tabs[tabIndex].color, height:2.5, borderRadius:"2px 2px 0 0" }, "& .MuiTab-root":{ fontFamily:fBody, fontWeight:600, fontSize:"0.78rem", textTransform:"none", color:T.textMute, minHeight:48, gap:0.6, "&.Mui-selected":{ color:tabs[tabIndex].color } }, "& .MuiTab-iconWrapper":{ marginBottom:"0 !important" } }}>
            {tabs.map((t,i) => (
              <Tab key={i}
                icon={<t.icon sx={{ fontSize:16 }} />}
                iconPosition="start"
                label={
                  <Box display="flex" alignItems="center" gap={0.8}>
                    {t.label}
                    <Box sx={{ px:0.7, py:0.1, borderRadius:"99px", bgcolor: tabIndex===i ? `${t.color}20` : "#F1F5F9" }}>
                      <Typography sx={{ fontFamily:fMono, fontSize:"0.62rem", fontWeight:700, color: tabIndex===i ? t.color : T.textMute }}>
                        {data[tabKeys[i]]?.length || 0}
                      </Typography>
                    </Box>
                  </Box>
                }
              />
            ))}
          </Tabs>
        </Box>

        <Box p={3}>
          {/* ── Tab-level action bar ── */}
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2.5}>
            <Typography sx={{ fontFamily:fHead, fontWeight:700, fontSize:"0.95rem", color:T.text }}>
              {tabs[tabIndex].label}
              <Typography component="span" sx={{ fontFamily:fBody, fontWeight:400, fontSize:"0.78rem", color:T.textMute, ml:1.5 }}>
                {data[currentKey]?.length} record{data[currentKey]?.length !== 1 ? "s" : ""}
              </Typography>
            </Typography>
            <Button variant="contained" size="small" startIcon={<Add sx={{fontSize:15}} />} onClick={() => setDialog(currentKey)}
              sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.75rem", textTransform:"none", borderRadius:"8px", bgcolor:tabs[tabIndex].color, boxShadow:"none", "&:hover":{filter:"brightness(0.9)",boxShadow:"none"} }}>
              Log {tabs[tabIndex].label}
            </Button>
          </Box>

          {/* ════ TAB 0: CONSULTANCY ════ */}
          {tabIndex === 0 && (
            <Box sx={{ borderRadius:"10px", border:`1px solid ${T.border}`, overflow:"hidden" }}>
              <Table>
                <TableHead><TableRow>
                  <TableHCell>Project</TableHCell>
                  <TableHCell>Client</TableHCell>
                  <TableHCell>Role</TableHCell>
                  <TableHCell>Period</TableHCell>
                  <TableHCell>Revenue</TableHCell>
                  <TableHCell>Status</TableHCell>
                </TableRow></TableHead>
                <TableBody>
                  {data.consultancy.map(r => (
                    <TableRow key={r.id} className="row-h">
                      <TableBCell sx={{ fontWeight:600, color:T.text, maxWidth:220 }}>
                        <Typography sx={{ fontFamily:fBody, fontWeight:600, fontSize:"0.82rem", color:T.text, lineHeight:1.3 }}>{r.title}</Typography>
                      </TableBCell>
                      <TableBCell>
                        <Box display="flex" alignItems="center" gap={1}>
                          <Avatar sx={{ width:26, height:26, bgcolor:T.tealLight, color:T.teal, fontSize:"0.65rem", fontWeight:700 }}>{r.client[0]}</Avatar>
                          <Typography sx={{ fontFamily:fBody, fontSize:"0.8rem", color:T.textSub }}>{r.client}</Typography>
                        </Box>
                      </TableBCell>
                      <TableBCell>
                        <TypeBadge label={r.role} color={T.teal} />
                      </TableBCell>
                      <TableBCell>
                        <Typography sx={{ fontFamily:fMono, fontSize:"0.72rem", color:T.textMute }}>{r.start} – {r.end}</Typography>
                      </TableBCell>
                      <TableBCell>
                        <Typography sx={{ fontFamily:fMono, fontWeight:700, fontSize:"0.82rem", color:T.teal }}>
                          ₹{(r.revenue/100000).toFixed(2)}L
                        </Typography>
                      </TableBCell>
                      <TableBCell><StatusChip label={r.status} /></TableBCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          )}

          {/* ════ TAB 1: GUEST LECTURES ════ */}
          {tabIndex === 1 && (
            <Stack spacing={2}>
              {data.guestLectures.map(gl => (
                <SCard key={gl.id} sx={{ p:2.5, "&:hover":{boxShadow:"0 4px 16px rgba(0,0,0,0.07)"}, transition:"box-shadow 0.2s" }}>
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start" flexWrap="wrap" gap={1}>
                    <Box flex={1}>
                      <Typography sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.9rem", color:T.text, mb:0.4 }}>{gl.topic}</Typography>
                      <Typography sx={{ fontFamily:fBody, fontSize:"0.78rem", color:T.textMute }}>
                        🏛 {gl.host}
                      </Typography>
                    </Box>
                    <Box display="flex" gap={1} alignItems="center" flexShrink={0}>
                      <TypeBadge label={gl.mode} color={gl.mode==="Online" ? T.accent : T.teal} />
                      {gl.certificate && <TypeBadge label="Certificate Received" color={T.success} />}
                      <Box sx={{ px:1.2, py:0.35, borderRadius:"8px", bgcolor:T.accentLight }}>
                        <Typography sx={{ fontFamily:fMono, fontSize:"0.72rem", fontWeight:600, color:T.accent }}>{gl.date}</Typography>
                      </Box>
                    </Box>
                  </Box>
                  <Box mt={1.5} display="flex" gap={2} alignItems="center">
                    <Box display="flex" alignItems="center" gap={0.5}>
                      <Groups sx={{ fontSize:14, color:T.textMute }} />
                      <Typography sx={{ fontFamily:fBody, fontSize:"0.72rem", color:T.textMute }}>{gl.audience} attendees</Typography>
                    </Box>
                  </Box>
                </SCard>
              ))}
            </Stack>
          )}

          {/* ════ TAB 2: EXAM DUTIES ════ */}
          {tabIndex === 2 && (
            <Box sx={{ borderRadius:"10px", border:`1px solid ${T.border}`, overflow:"hidden" }}>
              <Table>
                <TableHead><TableRow>
                  <TableHCell>Institution</TableHCell>
                  <TableHCell>Role</TableHCell>
                  <TableHCell>Subject</TableHCell>
                  <TableHCell>Date</TableHCell>
                  <TableHCell>Fee</TableHCell>
                  <TableHCell>Status</TableHCell>
                </TableRow></TableHead>
                <TableBody>
                  {data.examDuties.map(r => (
                    <TableRow key={r.id} className="row-h">
                      <TableBCell sx={{ fontWeight:600, color:T.text }}>{r.institution}</TableBCell>
                      <TableBCell><TypeBadge label={r.role} color={T.purple} /></TableBCell>
                      <TableBCell>{r.subject}</TableBCell>
                      <TableBCell><Typography sx={{ fontFamily:fMono, fontSize:"0.78rem", color:T.textMute }}>{r.date}</Typography></TableBCell>
                      <TableBCell><Typography sx={{ fontFamily:fMono, fontWeight:700, color:T.success }}>₹{r.fee?.toLocaleString()}</Typography></TableBCell>
                      <TableBCell><StatusChip label={r.status} /></TableBCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          )}

          {/* ════ TAB 3: THESIS EVALUATION ════ */}
          {tabIndex === 3 && (
            <Box sx={{ borderRadius:"10px", border:`1px solid ${T.border}`, overflow:"hidden" }}>
              <Table>
                <TableHead><TableRow>
                  <TableHCell>Scholar</TableHCell>
                  <TableHCell>University</TableHCell>
                  <TableHCell>Thesis Title</TableHCell>
                  <TableHCell>Type</TableHCell>
                  <TableHCell>Fee</TableHCell>
                  <TableHCell>Status</TableHCell>
                </TableRow></TableHead>
                <TableBody>
                  {data.thesisEvaluation.map(r => (
                    <TableRow key={r.id} className="row-h">
                      <TableBCell>
                        <Box display="flex" alignItems="center" gap={1}>
                          <Avatar sx={{ width:28, height:28, bgcolor:T.amberLight, color:T.amber, fontSize:"0.7rem", fontWeight:700 }}>{r.student.split(" ").pop()[0]}</Avatar>
                          <Typography sx={{ fontFamily:fBody, fontWeight:600, fontSize:"0.81rem", color:T.text }}>{r.student}</Typography>
                        </Box>
                      </TableBCell>
                      <TableBCell>{r.university}</TableBCell>
                      <TableBCell sx={{ maxWidth:200 }}>
                        <Tooltip title={r.title} placement="top">
                          <Typography sx={{ fontFamily:fBody, fontSize:"0.79rem", color:T.textSub, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis", maxWidth:190 }}>{r.title}</Typography>
                        </Tooltip>
                      </TableBCell>
                      <TableBCell><TypeBadge label={r.type} color={r.type==="PhD" ? T.amber : T.purple} /></TableBCell>
                      <TableBCell><Typography sx={{ fontFamily:fMono, fontWeight:700, color:T.success }}>₹{r.fee?.toLocaleString()}</Typography></TableBCell>
                      <TableBCell><StatusChip label={r.status} /></TableBCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          )}

          {/* ════ TAB 4: EXPERT TALKS ════ */}
          {tabIndex === 4 && (
            <Grid container spacing={2}>
              {data.expertTalks.map(talk => (
                <Grid item xs={12} md={6} key={talk.id}>
                  <SCard sx={{ p:2.5, borderLeft:`4px solid ${T.purple}`, height:"100%", "&:hover":{boxShadow:"0 4px 16px rgba(0,0,0,0.08)"}, transition:"box-shadow 0.2s" }}>
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1.2}>
                      <TypeBadge label={talk.type} color={talk.type==="Keynote" ? T.amber : talk.type==="Panel Expert" ? T.danger : T.purple} />
                      <Typography sx={{ fontFamily:fMono, fontSize:"0.7rem", color:T.textMute }}>{talk.date}</Typography>
                    </Box>
                    <Typography sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.88rem", color:T.text, mb:0.4, lineHeight:1.3 }}>{talk.topic}</Typography>
                    <Typography sx={{ fontFamily:fBody, fontSize:"0.77rem", color:T.textMute, mb:1.5 }}>{talk.event}</Typography>
                    <Divider sx={{ borderColor:T.border, mb:1.2 }} />
                    <Box display="flex" alignItems="center" gap={0.5}>
                      <Language sx={{ fontSize:13, color:T.textMute }} />
                      <Typography sx={{ fontFamily:fBody, fontSize:"0.72rem", color:T.textMute }}>{talk.location}</Typography>
                    </Box>
                  </SCard>
                </Grid>
              ))}
            </Grid>
          )}

          {/* ════ TAB 5: COLLABORATIONS ════ */}
          {tabIndex === 5 && (
            <Grid container spacing={2}>
              {data.collaborations.map(c => (
                <Grid item xs={12} md={6} key={c.id}>
                  <SCard sx={{ p:2.5, opacity: c.status==="Expired" ? 0.65 : 1, "&:hover":{boxShadow:"0 4px 16px rgba(0,0,0,0.07)"}, transition:"all 0.2s" }}>
                    <Box display="flex" gap={1.5} alignItems="flex-start">
                      <Box sx={{ p:1.2, borderRadius:"10px", bgcolor:T.successLight, flexShrink:0 }}>
                        <Handshake sx={{ fontSize:22, color:T.success }} />
                      </Box>
                      <Box flex={1}>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.4}>
                          <Typography sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.88rem", color:T.text }}>{c.partner}</Typography>
                          <StatusChip label={c.status} />
                        </Box>
                        <Typography sx={{ fontFamily:fBody, fontSize:"0.78rem", color:T.textSub, mb:0.6 }}>{c.scope}</Typography>
                        <Box display="flex" gap={1} alignItems="center">
                          <TypeBadge label={c.type} color={T.success} />
                          <Typography sx={{ fontFamily:fMono, fontSize:"0.68rem", color:T.textMute }}>Valid till {c.validTill}</Typography>
                        </Box>
                      </Box>
                    </Box>
                  </SCard>
                </Grid>
              ))}
            </Grid>
          )}

          {/* ════ TAB 6: PROFESSIONAL SERVICES ════ */}
          {tabIndex === 6 && (
            <Stack spacing={1.5}>
              {data.services.map(svc => (
                <SCard key={svc.id} sx={{ p:2.2, "&:hover":{boxShadow:"0 2px 12px rgba(0,0,0,0.07)"}, transition:"box-shadow 0.2s" }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Box display="flex" gap={2} alignItems="center" flex={1} mr={2}>
                      <Box sx={{ p:1, borderRadius:"8px", bgcolor:T.accentLight, flexShrink:0 }}>
                        <Description sx={{ fontSize:18, color:T.accent }} />
                      </Box>
                      <Box>
                        <Typography sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.86rem", color:T.text }}>{svc.role}</Typography>
                        <Typography sx={{ fontFamily:fBody, fontSize:"0.77rem", color:T.textSub }}>{svc.organization}</Typography>
                        <Typography sx={{ fontFamily:fBody, fontSize:"0.72rem", color:T.textMute, mt:0.2 }}>{svc.details}</Typography>
                      </Box>
                    </Box>
                    <Box sx={{ px:1.2, py:0.4, borderRadius:"8px", bgcolor:T.accentLight, flexShrink:0 }}>
                      <Typography sx={{ fontFamily:fMono, fontSize:"0.72rem", fontWeight:600, color:T.accent }}>{svc.year}</Typography>
                    </Box>
                  </Box>
                </SCard>
              ))}
            </Stack>
          )}

          {/* ════ TAB 7: MEDIA ════ */}
          {tabIndex === 7 && (
            <Grid container spacing={2}>
              {data.media.map(item => {
                const typeColor = { Article:T.accent, "TV Interview":T.danger, Podcast:T.purple, "Blog / Op-Ed":T.warning, Radio:T.teal, "Social Media":T.success };
                const c = typeColor[item.type] || T.accent;
                return (
                  <Grid item xs={12} sm={6} md={4} key={item.id}>
                    <SCard sx={{ p:2.5, height:"100%", borderTop:`3px solid ${c}`, "&:hover":{boxShadow:"0 4px 16px rgba(0,0,0,0.08)"}, transition:"box-shadow 0.2s" }}>
                      <Box display="flex" justifyContent="space-between" alignItems="center" mb={1.2}>
                        <TypeBadge label={item.type} color={c} />
                        <Typography sx={{ fontFamily:fMono, fontSize:"0.68rem", color:T.textMute }}>{item.date}</Typography>
                      </Box>
                      <Typography sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.85rem", color:T.text, mb:0.6, lineHeight:1.4 }}>{item.title}</Typography>
                      <Typography sx={{ fontFamily:fBody, fontSize:"0.76rem", color:T.textMute, mb:1.5 }}>{item.outlet}</Typography>
                      <Button size="small" startIcon={<OpenInNew sx={{fontSize:13}} />} href={item.link} target="_blank"
                        sx={{ fontFamily:fBody, fontWeight:600, fontSize:"0.72rem", textTransform:"none", color:c, p:0, "&:hover":{background:"transparent",textDecoration:"underline"} }}>
                        View
                      </Button>
                    </SCard>
                  </Grid>
                );
              })}
            </Grid>
          )}
        </Box>
      </SCard>

      {/* ── Add Activity Dialog ── */}
      {dialog && cfg && (
        <AddDialog
          open={!!dialog}
          onClose={() => setDialog(null)}
          title={cfg.title}
          color={cfg.color}
          fields={cfg.fields}
          onSubmit={(v) => { cfg.onSubmit(v); setDialog(null); }}
        />
      )}

      {/* ── Snackbar ── */}
      <Snackbar open={snack.open} autoHideDuration={3500} onClose={() => setSnack(s=>({...s,open:false}))} anchorOrigin={{ vertical:"bottom", horizontal:"center" }}>
        <Alert severity="success" sx={{ borderRadius:"10px", fontFamily:fBody, fontWeight:600 }} onClose={() => setSnack(s=>({...s,open:false}))}>
          {snack.msg}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default EngagementView;