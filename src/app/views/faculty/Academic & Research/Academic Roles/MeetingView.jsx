import React, { useState } from 'react';
import {
  Box, Card, Grid, Typography, Button, Tabs, Tab, Chip, Stack,
  IconButton, Divider, Dialog, DialogTitle, DialogContent, TextField,
  DialogActions, MenuItem, LinearProgress, Table, TableHead, TableRow,
  TableCell, TableBody, InputAdornment, Avatar, Tooltip, Snackbar,
  Alert, Collapse, Badge
} from "@mui/material";
import {
  Groups, CalendarMonth, AssignmentTurnedIn, Gavel, Add,
  CheckCircle, Cancel, Download, Search, CloudUpload, Edit,
  Close, Person, AccessTime, ExpandMore, ExpandLess,
  LocationOn, Videocam, NotificationsActive, HourglassEmpty,
  ArrowUpward, MoreVert, FiberManualRecord, AttachFile,
  CheckCircleOutline, RadioButtonUnchecked, Schedule, Info
} from '@mui/icons-material';

/* ── Design Tokens (platform-consistent) ── */
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
const COMMITTEES = [
  { id:1, name:"Internal Quality Assurance Cell (IQAC)",    role:"Chairperson", appointed:"Jun 2023", members:12, nextMeeting:"2026-02-25", activeTasks:3 },
  { id:2, name:"Anti-Ragging Committee",                    role:"Member",      appointed:"Aug 2024", members:8,  nextMeeting:"2026-03-05", activeTasks:1 },
  { id:3, name:"Curriculum Development Board — CSE",        role:"Convener",    appointed:"Jan 2024", members:10, nextMeeting:"2026-02-28", activeTasks:2 },
  { id:4, name:"Research & Development Committee",          role:"Member",      appointed:"Jul 2023", members:15, nextMeeting:"2026-03-10", activeTasks:0 },
];

const MEETINGS_INIT = [
  {
    id:1, title:"IQAC Quarterly Review — Q4 2025-26",
    committee:"Internal Quality Assurance Cell (IQAC)",
    date:"2026-02-25", time:"10:00 AM", venue:"Seminar Hall A",
    mode:"Offline", status:"Scheduled", agenda:"1. Review NAAC criteria progress\n2. Faculty feedback analysis\n3. Upcoming accreditation preparation",
    attendees:12, confirmed:8, myAttendance:"Pending",
    attachments:["Agenda_IQAC_Q4.pdf"],
  },
  {
    id:2, title:"Curriculum Revision — AI & ML Electives",
    committee:"Curriculum Development Board — CSE",
    date:"2026-02-28", time:"02:30 PM", venue:"Google Meet",
    mode:"Online", status:"Scheduled", agenda:"1. New elective proposals for 6th Semester\n2. Industry alignment review\n3. Approval of revised syllabus",
    attendees:10, confirmed:7, myAttendance:"Present",
    attachments:["Draft_Syllabus_AI_ML.pdf","Feedback_Summary.docx"],
  },
  {
    id:3, title:"IQAC Quarterly Review — Q3 2025-26",
    committee:"Internal Quality Assurance Cell (IQAC)",
    date:"2025-11-20", time:"10:00 AM", venue:"Seminar Hall A",
    mode:"Offline", status:"Completed", agenda:"Review of Q3 NAAC action points.",
    attendees:12, confirmed:12, myAttendance:"Present",
    attachments:["MoM_IQAC_Q3.pdf"],
    momUrl:"MoM_IQAC_Q3.pdf",
  },
  {
    id:4, title:"Anti-Ragging — Awareness Drive Planning",
    committee:"Anti-Ragging Committee",
    date:"2025-10-05", time:"11:00 AM", venue:"Principal's Boardroom",
    mode:"Offline", status:"Completed", agenda:"Plan student awareness campaign for odd semester.",
    attendees:8, confirmed:8, myAttendance:"Present",
    attachments:["MoM_AntiRagging_Oct25.pdf"],
    momUrl:"MoM_AntiRagging_Oct25.pdf",
  },
];

const ACTION_ITEMS_INIT = [
  { id:1, task:"Prepare NAAC criterion-wise self-appraisal data for 2025-26", meeting:"IQAC Q3 Review", deadline:"2026-02-20", status:"In Progress", priority:"High",    deliverable:null },
  { id:2, task:"Circulate revised AI & ML syllabus draft to all CSE faculty", meeting:"Curriculum Revision", deadline:"2026-02-27", status:"Pending",     priority:"High",    deliverable:null },
  { id:3, task:"Compile anti-ragging helpline poster for hostel notice boards", meeting:"Anti-Ragging Planning", deadline:"2026-02-15", status:"Completed",  priority:"Normal",  deliverable:"poster_final.pdf" },
  { id:4, task:"Submit R&D fund utilisation report to Finance",                 meeting:"R&D Committee",         deadline:"2026-03-01", status:"Pending",     priority:"Normal",  deliverable:null },
  { id:5, task:"Draft agenda for IQAC Q4 meeting and circulate 7 days prior",  meeting:"IQAC Q4 Prep",          deadline:"2026-02-18", status:"Completed",   priority:"Normal",  deliverable:"Agenda_IQAC_Q4.pdf" },
];

const RESOLUTIONS_INIT = [
  { id:1, text:"Resolved to adopt OBE-based curriculum framework for all UG programmes from AY 2026-27.", committee:"Curriculum Board", date:"2025-11-10", ref:"CBD/RES/2025/11" },
  { id:2, text:"Resolved to install CCTV cameras in all hostel corridors and submit compliance report to VTU by March 2026.", committee:"Anti-Ragging Committee", date:"2025-10-05", ref:"ARC/RES/2025/10" },
  { id:3, text:"Resolved to constitute a sub-committee for NAAC SSR data collection. Report due by 28 Feb 2026.", committee:"IQAC", date:"2025-11-20", ref:"IQAC/RES/2025/11" },
  { id:4, text:"Resolved to increase industry-institute interaction by mandating minimum 2 guest lectures per course per semester.", committee:"IQAC", date:"2025-08-14", ref:"IQAC/RES/2025/08" },
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

const StatusDot = ({ status }) => {
  const map = {
    Completed:   { color:T.success,  label:"Completed"   },
    "In Progress":{ color:T.accent,  label:"In Progress" },
    Pending:     { color:T.warning,  label:"Pending"     },
    Scheduled:   { color:T.accent,   label:"Scheduled"   },
    Present:     { color:T.success,  label:"Present"     },
    Apology:     { color:T.warning,  label:"Apology Sent"},
  };
  const s = map[status] || { color:T.textMute, label:status };
  return (
    <Box display="flex" alignItems="center" gap={0.6} sx={{ px:1.2, py:0.35, borderRadius:"99px", bgcolor:`${s.color}15`, width:"fit-content" }}>
      <Box sx={{ width:6, height:6, borderRadius:"50%", bgcolor:s.color }} />
      <Typography sx={{ fontFamily:fBody, fontSize:"0.71rem", fontWeight:700, color:s.color }}>{s.label}</Typography>
    </Box>
  );
};

const PriorityBadge = ({ priority }) => (
  <Box sx={{ px:0.9, py:0.2, borderRadius:"5px", bgcolor: priority==="High" ? T.dangerLight : "#F1F5F9", display:"inline-block" }}>
    <Typography sx={{ fontFamily:fMono, fontSize:"0.64rem", fontWeight:700, color: priority==="High" ? T.danger : T.textMute }}>{priority}</Typography>
  </Box>
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
const MeetingView = () => {
  const [tabIndex, setTabIndex]   = useState(0);
  const [meetings, setMeetings]   = useState(MEETINGS_INIT);
  const [actions, setActions]     = useState(ACTION_ITEMS_INIT);
  const [resolutions, setResolutions] = useState(RESOLUTIONS_INIT);

  /* Dialogs */
  const [schedulerOpen, setSchedulerOpen] = useState(false);
  const [uploadDialog, setUploadDialog]   = useState(null); // action item id
  const [expandMom, setExpandMom]         = useState(null);
  const [resSearch, setResSearch]         = useState("");
  const [newMeeting, setNewMeeting]       = useState({ committee:"", title:"", date:"", time:"", venue:"", mode:"Offline", agenda:"" });
  const [snack, setSnack] = useState({ open:false, msg:"", severity:"success" });

  const toast = (msg, severity="success") => setSnack({ open:true, msg, severity });

  /* Mark attendance */
  const markAttendance = (id, val) => {
    setMeetings(prev => prev.map(m => m.id===id ? { ...m, myAttendance:val, confirmed: val==="Present" ? m.confirmed+1 : m.confirmed } : m));
    toast(val==="Present" ? "Attendance confirmed!" : "Apology recorded and sent to Chairperson.");
  };

  /* Update task status */
  const markDone = (id) => {
    setActions(prev => prev.map(a => a.id===id ? { ...a, status:"Completed" } : a));
    toast("Task marked as completed!");
  };

  /* Schedule meeting */
  const handleScheduleSubmit = () => {
    if (!newMeeting.committee || !newMeeting.title || !newMeeting.date) {
      toast("Please fill all required fields.", "error"); return;
    }
    setMeetings(prev => [{
      id: Date.now(), ...newMeeting,
      status:"Scheduled", attendees:10, confirmed:0, myAttendance:"Pending", attachments:[]
    }, ...prev]);
    setSchedulerOpen(false);
    setNewMeeting({ committee:"", title:"", date:"", time:"", venue:"", mode:"Offline", agenda:"" });
    toast("Meeting scheduled and invitations sent to all members!");
  };

  const scheduled = meetings.filter(m => m.status==="Scheduled");
  const completed = meetings.filter(m => m.status==="Completed");
  const pendingTasks = actions.filter(a => a.status!=="Completed").length;
  const filteredRes = resolutions.filter(r =>
    !resSearch || r.text.toLowerCase().includes(resSearch.toLowerCase()) ||
    r.committee.toLowerCase().includes(resSearch.toLowerCase()) || r.ref.toLowerCase().includes(resSearch.toLowerCase())
  );

  const tabs = [
    { label:"My Committees",        icon:Groups,           count:COMMITTEES.length },
    { label:"Meetings",             icon:CalendarMonth,    count:scheduled.length  },
    { label:"Action Items",         icon:AssignmentTurnedIn,count:pendingTasks     },
    { label:"Minutes & Resolutions",icon:Gavel,            count:resolutions.length},
  ];

  return (
    <Box sx={{ p:3, bgcolor:T.bg, minHeight:"100vh", fontFamily:fBody }}>
      <Fonts />

      {/* ── Header ── */}
      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3}>
        <Box>
          <Typography sx={{ fontFamily:fHead, fontWeight:700, fontSize:"1.5rem", color:T.text }}>Committee & Meeting Management</Typography>
          <Typography sx={{ fontFamily:fBody, fontSize:"0.82rem", color:T.textSub, mt:0.4 }}>
            Dr. Naveen Kumar &nbsp;·&nbsp; Member of {COMMITTEES.length} committees &nbsp;·&nbsp; AY 2025–26
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<Add sx={{fontSize:16}} />} onClick={() => setSchedulerOpen(true)}
          sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.8rem", textTransform:"none", borderRadius:"8px", bgcolor:T.accent, boxShadow:"none", "&:hover":{bgcolor:"#4F46E5",boxShadow:"none"} }}>
          Schedule Meeting
        </Button>
      </Box>

      {/* ── Stat strip ── */}
      <Grid container spacing={2} mb={3}>
        {[
          { label:"Committees",        value:COMMITTEES.length, sub:"Active memberships",    color:T.accent,   icon:Groups           },
          { label:"Meetings This Month",value:scheduled.length,  sub:"Requiring your confirmation",color:T.warning,icon:CalendarMonth  },
          { label:"Pending Tasks",     value:pendingTasks,      sub:"Action items due",      color:T.danger,   icon:AssignmentTurnedIn },
          { label:"Resolutions Passed",value:resolutions.length, sub:"This academic year",   color:T.success,  icon:Gavel            },
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

      {/* ── Tab Card ── */}
      <SCard sx={{ overflow:"hidden" }}>
        <Box sx={{ borderBottom:`1px solid ${T.border}`, bgcolor:"#FAFBFD" }}>
          <Tabs value={tabIndex} onChange={(_,v)=>setTabIndex(v)}
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

          {/* ════ TAB 0: MY COMMITTEES ════ */}
          {tabIndex === 0 && (
            <Box className="fu">
              <Grid container spacing={2}>
                {COMMITTEES.map((c) => {
                  const isLead = c.role==="Chairperson" || c.role==="Convener";
                  return (
                    <Grid item xs={12} md={6} key={c.id}>
                      <SCard sx={{ p:2.5, borderLeft:`4px solid ${isLead ? T.accent : T.border}`, "&:hover":{boxShadow:"0 4px 16px rgba(0,0,0,0.07)"}, transition:"box-shadow 0.2s" }}>
                        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1.5}>
                          <Box flex={1} mr={2}>
                            <Typography sx={{ fontFamily:fHead, fontWeight:700, fontSize:"0.88rem", color:T.text, lineHeight:1.3, mb:0.6 }}>{c.name}</Typography>
                            <Box display="flex" gap={1} alignItems="center" flexWrap="wrap">
                              <Box sx={{ px:1.1, py:0.3, borderRadius:"6px", bgcolor: isLead ? T.accentLight : "#F1F5F9" }}>
                                <Typography sx={{ fontFamily:fBody, fontSize:"0.7rem", fontWeight:700, color: isLead ? T.accent : T.textMute }}>{c.role}</Typography>
                              </Box>
                              <Typography sx={{ fontFamily:fBody, fontSize:"0.7rem", color:T.textMute }}>Since {c.appointed}</Typography>
                            </Box>
                          </Box>
                          <Box sx={{ textAlign:"center", p:1.5, borderRadius:"10px", bgcolor:T.accentLight, minWidth:58, flexShrink:0 }}>
                            <Typography sx={{ fontFamily:fMono, fontWeight:700, fontSize:"1.4rem", color:T.accent, lineHeight:1 }}>{c.members}</Typography>
                            <Typography sx={{ fontFamily:fBody, fontSize:"0.62rem", color:T.textMute }}>Members</Typography>
                          </Box>
                        </Box>
                        <Divider sx={{ borderColor:T.border, mb:1.5 }} />
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                          <Box display="flex" alignItems="center" gap={0.6}>
                            <CalendarMonth sx={{ fontSize:13, color:T.textMute }} />
                            <Typography sx={{ fontFamily:fBody, fontSize:"0.72rem", color:T.textMute }}>Next: <strong style={{color:T.text}}>{c.nextMeeting}</strong></Typography>
                          </Box>
                          {c.activeTasks > 0 && (
                            <Box sx={{ px:1, py:0.25, borderRadius:"6px", bgcolor:T.warningLight }}>
                              <Typography sx={{ fontFamily:fMono, fontSize:"0.67rem", fontWeight:700, color:T.warning }}>{c.activeTasks} task{c.activeTasks>1?"s":""} pending</Typography>
                            </Box>
                          )}
                        </Box>
                      </SCard>
                    </Grid>
                  );
                })}
              </Grid>
            </Box>
          )}

          {/* ════ TAB 1: MEETINGS ════ */}
          {tabIndex === 1 && (
            <Box className="fu">
              {/* Scheduled */}
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography sx={{ fontFamily:fHead, fontWeight:700, fontSize:"0.95rem", color:T.text }}>
                  Upcoming Meetings
                  <Typography component="span" sx={{ fontFamily:fBody, fontSize:"0.76rem", color:T.textMute, ml:1.5 }}>{scheduled.length} scheduled</Typography>
                </Typography>
                <Button size="small" variant="outlined" startIcon={<Add sx={{fontSize:14}} />} onClick={() => setSchedulerOpen(true)}
                  sx={{ fontFamily:fBody, fontWeight:600, fontSize:"0.75rem", textTransform:"none", borderRadius:"8px", borderColor:T.border, color:T.textSub, "&:hover":{borderColor:T.accent,color:T.accent} }}>
                  New Meeting
                </Button>
              </Box>

              <Stack spacing={2} mb={4}>
                {scheduled.map(m => (
                  <SCard key={m.id} sx={{ overflow:"hidden", borderLeft:`4px solid ${T.accent}` }}>
                    {/* Card header */}
                    <Box sx={{ px:2.5, py:2, borderBottom:`1px solid ${T.border}`, bgcolor:"#FAFBFD" }}>
                      <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                        <Box>
                          <Typography sx={{ fontFamily:fHead, fontWeight:700, fontSize:"0.9rem", color:T.text }}>{m.title}</Typography>
                          <Typography sx={{ fontFamily:fBody, fontSize:"0.74rem", color:T.textMute, mt:0.2 }}>{m.committee}</Typography>
                        </Box>
                        <StatusDot status={m.status} />
                      </Box>
                    </Box>

                    <Box sx={{ p:2.5 }}>
                      <Grid container spacing={2} mb={2}>
                        {[
                          { label:"Date & Time", value:`${m.date} at ${m.time}`, icon:AccessTime   },
                          { label:"Venue",       value:m.venue,                   icon: m.mode==="Online" ? Videocam : LocationOn },
                          { label:"Mode",        value:m.mode,                    icon:Groups       },
                          { label:"RSVP Status", value:`${m.confirmed} / ${m.attendees} confirmed`, icon:Person },
                        ].map(d => (
                          <Grid item xs={6} md={3} key={d.label}>
                            <SLabel>{d.label}</SLabel>
                            <Box display="flex" alignItems="center" gap={0.6}>
                              <d.icon sx={{ fontSize:13, color:T.textMute }} />
                              <Typography sx={{ fontFamily:fBody, fontSize:"0.79rem", color:T.text, fontWeight:500 }}>{d.value}</Typography>
                            </Box>
                          </Grid>
                        ))}
                      </Grid>

                      {/* RSVP bar */}
                      <Box mb={2}>
                        <Box display="flex" justifyContent="space-between" mb={0.5}>
                          <SLabel sx={{ mb:0 }}>RSVP Confirmation</SLabel>
                          <Typography sx={{ fontFamily:fMono, fontSize:"0.68rem", color:T.textMute }}>{Math.round((m.confirmed/m.attendees)*100)}%</Typography>
                        </Box>
                        <LinearProgress variant="determinate" value={(m.confirmed/m.attendees)*100}
                          sx={{ height:5, borderRadius:99, bgcolor:T.border, "& .MuiLinearProgress-bar":{ bgcolor:T.success, borderRadius:99 } }} />
                      </Box>

                      {/* Agenda */}
                      <Box mb={2}>
                        <SLabel sx={{ mb:0.8 }}>Agenda</SLabel>
                        <Box sx={{ p:1.5, borderRadius:"8px", bgcolor:"#F9FAFB", border:`1px solid ${T.border}` }}>
                          {m.agenda.split("\n").map((line,i) => (
                            <Typography key={i} sx={{ fontFamily:fBody, fontSize:"0.78rem", color:T.textSub, lineHeight:1.8 }}>{line}</Typography>
                          ))}
                        </Box>
                      </Box>

                      {/* Attachments */}
                      {m.attachments.length > 0 && (
                        <Box mb={2}>
                          <SLabel sx={{ mb:0.8 }}>Attachments</SLabel>
                          <Box display="flex" gap={1} flexWrap="wrap">
                            {m.attachments.map((a,i) => (
                              <Box key={i} display="flex" alignItems="center" gap={0.6} sx={{ px:1.2, py:0.5, borderRadius:"7px", border:`1px solid ${T.border}`, bgcolor:"#F9FAFB", cursor:"pointer", "&:hover":{borderColor:T.accent} }}>
                                <AttachFile sx={{ fontSize:13, color:T.textMute }} />
                                <Typography sx={{ fontFamily:fBody, fontSize:"0.72rem", color:T.textSub }}>{a}</Typography>
                              </Box>
                            ))}
                          </Box>
                        </Box>
                      )}

                      <Divider sx={{ borderColor:T.border, mb:2 }} />

                      {/* Attendance CTA */}
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Box>
                          <SLabel sx={{ mb:0 }}>Your Attendance</SLabel>
                          {m.myAttendance !== "Pending" && <StatusDot status={m.myAttendance} />}
                        </Box>
                        {m.myAttendance === "Pending" ? (
                          <Stack direction="row" spacing={1}>
                            <Button size="small" variant="contained" startIcon={<CheckCircle sx={{fontSize:14}} />}
                              onClick={() => markAttendance(m.id,"Present")}
                              sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.75rem", textTransform:"none", borderRadius:"8px", bgcolor:T.success, boxShadow:"none", "&:hover":{bgcolor:"#059669",boxShadow:"none"} }}>
                              Confirm Attendance
                            </Button>
                            <Button size="small" variant="outlined" startIcon={<Cancel sx={{fontSize:14}} />}
                              onClick={() => markAttendance(m.id,"Apology")}
                              sx={{ fontFamily:fBody, fontWeight:600, fontSize:"0.75rem", textTransform:"none", borderRadius:"8px", color:T.warning, borderColor:`${T.warning}60`, "&:hover":{borderColor:T.warning,bgcolor:T.warningLight} }}>
                              Send Apology
                            </Button>
                          </Stack>
                        ) : (
                          <Typography sx={{ fontFamily:fBody, fontSize:"0.74rem", color:T.textMute }}>Response recorded</Typography>
                        )}
                      </Box>
                    </Box>
                  </SCard>
                ))}
              </Stack>

              {/* Past meetings strip */}
              <Typography sx={{ fontFamily:fHead, fontWeight:700, fontSize:"0.95rem", color:T.text, mb:1.5 }}>Past Meetings</Typography>
              <Box sx={{ borderRadius:"10px", border:`1px solid ${T.border}`, overflow:"hidden" }}>
                <Table size="small">
                  <TableHead><TableRow><TH>Meeting</TH><TH>Committee</TH><TH>Date</TH><TH>Attendance</TH><TH>MoM</TH></TableRow></TableHead>
                  <TableBody>
                    {completed.map(m => (
                      <TableRow key={m.id} className="row-h">
                        <TD sx={{ fontWeight:600, color:T.text }}>{m.title}</TD>
                        <TD>{m.committee}</TD>
                        <TD><Typography sx={{ fontFamily:fMono, fontSize:"0.75rem", color:T.textMute }}>{m.date}</Typography></TD>
                        <TD><StatusDot status={m.myAttendance} /></TD>
                        <TD>
                          <Button size="small" startIcon={<Download sx={{fontSize:13}} />}
                            sx={{ fontFamily:fBody, fontWeight:600, fontSize:"0.72rem", textTransform:"none", color:T.accent, p:0, "&:hover":{bgcolor:"transparent",textDecoration:"underline"} }}>
                            Download
                          </Button>
                        </TD>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            </Box>
          )}

          {/* ════ TAB 2: ACTION ITEMS ════ */}
          {tabIndex === 2 && (
            <Box className="fu">
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2.5}>
                <Typography sx={{ fontFamily:fHead, fontWeight:700, fontSize:"0.95rem", color:T.text }}>
                  My Assigned Action Items
                  <Typography component="span" sx={{ fontFamily:fBody, fontSize:"0.76rem", color:T.textMute, ml:1.5 }}>{pendingTasks} pending</Typography>
                </Typography>
              </Box>

              {/* Progress overview */}
              <SCard sx={{ p:2, mb:2.5, display:"flex", alignItems:"center", gap:3 }}>
                <Box flex={1}>
                  <Box display="flex" justifyContent="space-between" mb={0.6}>
                    <Typography sx={{ fontFamily:fBody, fontSize:"0.79rem", color:T.textSub, fontWeight:600 }}>Overall Completion</Typography>
                    <Typography sx={{ fontFamily:fMono, fontSize:"0.75rem", color:T.success, fontWeight:700 }}>
                      {actions.filter(a=>a.status==="Completed").length}/{actions.length} done
                    </Typography>
                  </Box>
                  <LinearProgress variant="determinate"
                    value={(actions.filter(a=>a.status==="Completed").length / actions.length)*100}
                    sx={{ height:6, borderRadius:99, bgcolor:T.border, "& .MuiLinearProgress-bar":{ bgcolor:T.success, borderRadius:99 } }} />
                </Box>
                <Box display="flex" gap={2}>
                  {[
                    { label:"Completed",   count:actions.filter(a=>a.status==="Completed").length,   color:T.success },
                    { label:"In Progress", count:actions.filter(a=>a.status==="In Progress").length, color:T.accent  },
                    { label:"Pending",     count:actions.filter(a=>a.status==="Pending").length,     color:T.warning },
                  ].map(s => (
                    <Box key={s.label} textAlign="center">
                      <Typography sx={{ fontFamily:fMono, fontWeight:700, fontSize:"1.1rem", color:s.color }}>{s.count}</Typography>
                      <Typography sx={{ fontFamily:fBody, fontSize:"0.65rem", color:T.textMute }}>{s.label}</Typography>
                    </Box>
                  ))}
                </Box>
              </SCard>

              <Box sx={{ borderRadius:"10px", border:`1px solid ${T.border}`, overflow:"hidden" }}>
                <Table>
                  <TableHead><TableRow>
                    <TH>Task</TH><TH>Source Meeting</TH><TH>Deadline</TH><TH>Priority</TH><TH>Status</TH><TH>Actions</TH>
                  </TableRow></TableHead>
                  <TableBody>
                    {actions.map(item => {
                      const isOverdue = item.status !== "Completed" && new Date(item.deadline) < new Date();
                      return (
                        <TableRow key={item.id} className="row-h" sx={{ opacity: item.status==="Completed" ? 0.6 : 1 }}>
                          <TD sx={{ maxWidth:280 }}>
                            <Box display="flex" alignItems="flex-start" gap={1}>
                              {item.status==="Completed"
                                ? <CheckCircleOutline sx={{ fontSize:16, color:T.success, mt:"2px", flexShrink:0 }} />
                                : <RadioButtonUnchecked sx={{ fontSize:16, color:T.textMute, mt:"2px", flexShrink:0 }} />
                              }
                              <Typography sx={{ fontFamily:fBody, fontSize:"0.81rem", color:T.text, fontWeight:500, lineHeight:1.4, textDecoration: item.status==="Completed" ? "line-through" : "none" }}>
                                {item.task}
                              </Typography>
                            </Box>
                            {item.deliverable && (
                              <Box display="flex" alignItems="center" gap={0.5} mt={0.8} ml={3}>
                                <AttachFile sx={{ fontSize:11, color:T.accent }} />
                                <Typography sx={{ fontFamily:fBody, fontSize:"0.68rem", color:T.accent }}>{item.deliverable}</Typography>
                              </Box>
                            )}
                          </TD>
                          <TD>
                            <Typography sx={{ fontFamily:fBody, fontSize:"0.77rem", color:T.textMute }}>{item.meeting}</Typography>
                          </TD>
                          <TD>
                            <Typography sx={{ fontFamily:fMono, fontSize:"0.75rem", fontWeight:600, color: isOverdue ? T.danger : T.textSub }}>
                              {item.deadline}
                              {isOverdue && <Typography component="span" sx={{ fontFamily:fBody, fontSize:"0.65rem", color:T.danger, ml:0.5 }}> ⚠ Overdue</Typography>}
                            </Typography>
                          </TD>
                          <TD><PriorityBadge priority={item.priority} /></TD>
                          <TD><StatusDot status={item.status} /></TD>
                          <TD>
                            {item.status !== "Completed" && (
                              <Box display="flex" gap={0.5}>
                                <Tooltip title="Upload Deliverable">
                                  <IconButton size="small"
                                    sx={{ bgcolor:"#F1F5F9", borderRadius:"7px", "&:hover":{bgcolor:T.accentLight,color:T.accent} }}
                                    onClick={() => toast("File upload dialog would open here.")}>
                                    <CloudUpload sx={{ fontSize:15 }} />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Mark as Completed">
                                  <IconButton size="small"
                                    sx={{ bgcolor:T.successLight, color:T.success, borderRadius:"7px", "&:hover":{bgcolor:"#D1FAE5"} }}
                                    onClick={() => markDone(item.id)}>
                                    <CheckCircle sx={{ fontSize:15 }} />
                                  </IconButton>
                                </Tooltip>
                              </Box>
                            )}
                          </TD>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </Box>
            </Box>
          )}

          {/* ════ TAB 3: MINUTES & RESOLUTIONS ════ */}
          {tabIndex === 3 && (
            <Box className="fu">
              <Grid container spacing={3}>
                {/* MoM list */}
                <Grid item xs={12} md={7}>
                  <Typography sx={{ fontFamily:fHead, fontWeight:700, fontSize:"0.95rem", color:T.text, mb:2 }}>Minutes of Meeting (MoM)</Typography>
                  <Stack spacing={1.5}>
                    {completed.map(m => (
                      <SCard key={m.id} sx={{ overflow:"hidden" }}>
                        <Box sx={{ p:2, cursor:"pointer", "&:hover":{bgcolor:"#FAFBFD"} }}
                          onClick={() => setExpandMom(expandMom===m.id ? null : m.id)}>
                          <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Box>
                              <Typography sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.86rem", color:T.text }}>{m.title}</Typography>
                              <Typography sx={{ fontFamily:fBody, fontSize:"0.72rem", color:T.textMute, mt:0.2 }}>
                                {m.committee} &nbsp;·&nbsp; Held {m.date}
                              </Typography>
                            </Box>
                            <Box display="flex" alignItems="center" gap={1}>
                              <StatusDot status={m.myAttendance} />
                              <IconButton size="small" sx={{ color:T.textMute }}>
                                {expandMom===m.id ? <ExpandLess sx={{fontSize:18}} /> : <ExpandMore sx={{fontSize:18}} />}
                              </IconButton>
                            </Box>
                          </Box>
                        </Box>
                        <Collapse in={expandMom===m.id}>
                          <Divider sx={{ borderColor:T.border }} />
                          <Box sx={{ p:2, bgcolor:"#FAFBFD" }}>
                            <SLabel sx={{ mb:1 }}>Agenda Covered</SLabel>
                            <Box sx={{ p:1.5, borderRadius:"8px", bgcolor:T.surface, border:`1px solid ${T.border}`, mb:2 }}>
                              <Typography sx={{ fontFamily:fBody, fontSize:"0.77rem", color:T.textSub }}>{m.agenda}</Typography>
                            </Box>
                            <Box display="flex" gap={1.5}>
                              <Button size="small" variant="contained" startIcon={<Download sx={{fontSize:14}} />}
                                onClick={() => toast(`Downloading ${m.momUrl || "MoM"}...`)}
                                sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.74rem", textTransform:"none", borderRadius:"8px", bgcolor:T.accent, boxShadow:"none", "&:hover":{bgcolor:"#4F46E5",boxShadow:"none"} }}>
                                Download MoM PDF
                              </Button>
                              <Button size="small" variant="outlined" startIcon={<AttachFile sx={{fontSize:14}} />}
                                sx={{ fontFamily:fBody, fontWeight:600, fontSize:"0.74rem", textTransform:"none", borderRadius:"8px", borderColor:T.border, color:T.textSub }}>
                                View Attachments
                              </Button>
                            </Box>
                          </Box>
                        </Collapse>
                      </SCard>
                    ))}
                  </Stack>
                </Grid>

                {/* Resolution Archive */}
                <Grid item xs={12} md={5}>
                  <Typography sx={{ fontFamily:fHead, fontWeight:700, fontSize:"0.95rem", color:T.text, mb:2 }}>Resolution Archive</Typography>
                  <TextField fullWidth size="small" placeholder="Search resolutions, committees, ref. nos..."
                    value={resSearch} onChange={e=>setResSearch(e.target.value)}
                    InputProps={{ startAdornment:<InputAdornment position="start"><Search sx={{fontSize:16,color:T.textMute}} /></InputAdornment> }}
                    sx={{ mb:2, "& .MuiOutlinedInput-root":{ borderRadius:"8px", fontFamily:fBody, fontSize:"0.82rem", bgcolor:T.surface, "& fieldset":{borderColor:T.border}, "&.Mui-focused fieldset":{borderColor:T.accent} } }} />

                  <Stack spacing={1.5}>
                    {filteredRes.map(res => (
                      <SCard key={res.id} sx={{ p:2, "&:hover":{boxShadow:"0 2px 12px rgba(0,0,0,0.07)"}, transition:"box-shadow 0.2s" }}>
                        <Box display="flex" gap={0.6} mb={1} alignItems="center">
                          <Gavel sx={{ fontSize:13, color:T.accent }} />
                          <Typography sx={{ fontFamily:fMono, fontSize:"0.65rem", fontWeight:700, color:T.accent }}>{res.ref}</Typography>
                        </Box>
                        <Typography sx={{ fontFamily:fBody, fontSize:"0.79rem", color:T.textSub, lineHeight:1.6, mb:1.2 }}>
                          "{res.text}"
                        </Typography>
                        <Box display="flex" justifyContent="space-between">
                          <Box sx={{ px:0.9, py:0.2, borderRadius:"5px", bgcolor:T.accentLight }}>
                            <Typography sx={{ fontFamily:fBody, fontSize:"0.67rem", fontWeight:700, color:T.accent }}>{res.committee}</Typography>
                          </Box>
                          <Typography sx={{ fontFamily:fMono, fontSize:"0.67rem", color:T.textMute }}>{res.date}</Typography>
                        </Box>
                      </SCard>
                    ))}
                    {filteredRes.length === 0 && (
                      <Box textAlign="center" py={4}>
                        <Typography sx={{ fontFamily:fBody, fontSize:"0.8rem", color:T.textMute }}>No resolutions match your search.</Typography>
                      </Box>
                    )}
                  </Stack>
                </Grid>
              </Grid>
            </Box>
          )}

        </Box>
      </SCard>

      {/* ════════════════════════════════
          SCHEDULE MEETING DIALOG
      ════════════════════════════════ */}
      <Dialog open={schedulerOpen} onClose={() => setSchedulerOpen(false)} maxWidth="sm" fullWidth
        PaperProps={{ sx:{ borderRadius:"16px", border:`1px solid ${T.border}` } }}>
        <DialogTitle sx={{ fontFamily:fHead, fontWeight:700, fontSize:"1rem", color:T.text, borderBottom:`1px solid ${T.border}`, bgcolor:"#FAFBFD", pb:2 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box display="flex" alignItems="center" gap={1.2}>
              <Box sx={{ width:4, height:22, borderRadius:2, bgcolor:T.accent }} />
              Schedule New Meeting
            </Box>
            <IconButton size="small" onClick={() => setSchedulerOpen(false)} sx={{ bgcolor:"#F1F5F9", borderRadius:"8px" }}><Close fontSize="small" /></IconButton>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ px:3, pt:3, pb:2 }}>
          <Stack spacing={2.2}>
            <DField label="Committee *">
              <DInput select value={newMeeting.committee} onChange={e=>setNewMeeting({...newMeeting,committee:e.target.value})}>
                {COMMITTEES.map(c=><MenuItem key={c.id} value={c.name} sx={{fontFamily:fBody,fontSize:"0.82rem"}}>{c.name}</MenuItem>)}
              </DInput>
            </DField>
            <DField label="Meeting Title *">
              <DInput value={newMeeting.title} onChange={e=>setNewMeeting({...newMeeting,title:e.target.value})} placeholder="e.g. IQAC Monthly Review — March 2026" />
            </DField>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <DField label="Date *">
                  <DInput type="date" value={newMeeting.date} onChange={e=>setNewMeeting({...newMeeting,date:e.target.value})} InputLabelProps={{shrink:true}} />
                </DField>
              </Grid>
              <Grid item xs={6}>
                <DField label="Time">
                  <DInput type="time" value={newMeeting.time} onChange={e=>setNewMeeting({...newMeeting,time:e.target.value})} InputLabelProps={{shrink:true}} />
                </DField>
              </Grid>
            </Grid>
            <DField label="Mode">
              <DInput select value={newMeeting.mode} onChange={e=>setNewMeeting({...newMeeting,mode:e.target.value})}>
                {["Offline","Online","Hybrid"].map(m=><MenuItem key={m} value={m} sx={{fontFamily:fBody,fontSize:"0.82rem"}}>{m}</MenuItem>)}
              </DInput>
            </DField>
            <DField label="Venue / Platform">
              <DInput value={newMeeting.venue} onChange={e=>setNewMeeting({...newMeeting,venue:e.target.value})} placeholder={newMeeting.mode==="Online" ? "e.g. Google Meet link" : "e.g. Seminar Hall A"} />
            </DField>
            <DField label="Agenda Items">
              <DInput multiline rows={3} value={newMeeting.agenda} onChange={e=>setNewMeeting({...newMeeting,agenda:e.target.value})} placeholder={"1. Item one\n2. Item two\n3. Any other matter"} />
            </DField>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px:3, pb:3, borderTop:`1px solid ${T.border}`, pt:2, bgcolor:"#FAFBFD", gap:1 }}>
          <Button onClick={() => setSchedulerOpen(false)} variant="outlined"
            sx={{ fontFamily:fBody, fontWeight:600, fontSize:"0.8rem", textTransform:"none", borderRadius:"8px", borderColor:T.border, color:T.textSub }}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleScheduleSubmit} startIcon={<NotificationsActive sx={{fontSize:15}} />}
            sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.8rem", textTransform:"none", borderRadius:"8px", bgcolor:T.accent, boxShadow:"none", "&:hover":{bgcolor:"#4F46E5",boxShadow:"none"} }}>
            Schedule & Send Invitations
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

export default MeetingView;