import React, { useState } from "react";
import {
  Box, Grid, Typography, Button, TextField, MenuItem,
  Tabs, Tab, Table, TableBody, TableCell, TableHead, TableRow,
  Checkbox, Switch, IconButton, Divider,
  Avatar, Tooltip, Stack, Snackbar, Alert, FormControlLabel
} from "@mui/material";
import {
  Campaign, NotificationsActive, Send, Schedule,
  AttachFile, Delete, Edit, WhatsApp, Sms,
  Poll, BarChart as BarChartIcon, Feedback,
  DoneAll, FormatBold, FormatItalic, FormatListBulleted,
  Image, Link as LinkIcon, Update, Warning, Close,
  EmailOutlined, PhoneIphone, CheckCircle, RadioButtonUnchecked,
  Add, MarkEmailRead, CampaignOutlined,
  ScheduleSend, Refresh, Reply, Download
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
  green:        "#059669",
  greenLight:   "#D1FAE5",
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
    .inbox-item { cursor:pointer; transition:background .12s; }
    .inbox-item:hover { background:#F9FAFB; }
  `}</style>
);

/* ─────────────────────────────────────────
   MOCK DATA
───────────────────────────────────────── */
const HISTORY_INIT = [
  { id:1, title:"PBAS Submission Deadline Extended",  target:"All Faculty", date:"2026-02-01", status:"Sent",      channels:["Email","App"],          stats:{ sent:150, delivered:148, read:120, clicked:45 }, recurring:"No"     },
  { id:2, title:"Urgent: Server Downtime Notice",     target:"CSE Dept",    date:"2026-02-10", status:"Scheduled", channels:["SMS","WhatsApp"],        stats:{ sent:0,   delivered:0,   read:0,   clicked:0  }, recurring:"No"     },
  { id:3, title:"Weekly Faculty Meet Reminder",       target:"HODs",        date:"Every Mon",  status:"Active",    channels:["Email","App"],           stats:{ sent:40,  delivered:40,  read:35,  clicked:10 }, recurring:"Weekly" },
];

const FEEDBACK_INIT = [
  { id:101, from:"Dr. Sarah Smith",   avatar:"SS", dept:"CSE",   subject:"Re: PBAS Deadline",          message:"Can we submit hard copies instead of uploading everything to the portal? The file size limits are quite restrictive for our annexures.", date:"2026-02-02", status:"Unread" },
  { id:102, from:"Prof. Rajan Kumar", avatar:"RK", dept:"Mech",  subject:"Poll Response — Seminar Slot",message:"Voted for Option B (Friday 3 PM). That works best for most of our department.",                                                       date:"2026-02-03", status:"Read"   },
  { id:103, from:"Dr. Emily Davis",   avatar:"ED", dept:"Civil", subject:"Query: Leave Balance",        message:"I noticed my leave balance is showing incorrectly after the system upgrade. Could you please verify and update?",                       date:"2026-02-05", status:"Unread" },
];

const ALERTS_INIT = [
  { id:1, name:"Probation Ending Alert",    trigger:"30 days before",        recipient:"HR Head + Faculty",  active:true,  Icon:Warning            },
  { id:2, name:"Low Leave Balance",         trigger:"< 3 CL remaining",       recipient:"Faculty",            active:true,  Icon:NotificationsActive },
  { id:3, name:"Asset Verification Cycle",  trigger:"Annual — March 1st",     recipient:"All Faculty",        active:true,  Icon:Schedule            },
  { id:4, name:"PBAS Submission Reminder",  trigger:"15 days before close",   recipient:"All Faculty",        active:false, Icon:Campaign            },
  { id:5, name:"Salary Slip Published",     trigger:"On payroll processing",  recipient:"Individual Faculty", active:true,  Icon:MarkEmailRead       },
];

const CHANNELS_DEF = [
  { key:"email",    label:"Email",    Icon:EmailOutlined, color:T.accent  },
  { key:"app",      label:"In-App",   Icon:PhoneIphone,   color:T.purple  },
  { key:"sms",      label:"SMS",      Icon:Sms,           color:T.warning },
  { key:"whatsapp", label:"WhatsApp", Icon:WhatsApp,      color:T.green   },
];

const TARGETS = [
  "All Faculty","Specific Department","HODs Only","Research Committee","Custom Filter (Advanced)",
];

const DEPTS = ["CSE","ECE","Mech","Civil","Electrical","Science"];

const STATUS_MAP = {
  Sent:      { color:T.success, bg:T.successLight },
  Scheduled: { color:T.warning, bg:T.warningLight },
  Active:    { color:T.accent,  bg:T.accentLight  },
  Draft:     { color:T.textMute,bg:"#F1F5F9"       },
};

const CHAN_COLOR = {
  Email:    { color:T.accent,  bg:T.accentLight  },
  App:      { color:T.purple,  bg:T.purpleLight  },
  SMS:      { color:T.warning, bg:T.warningLight },
  WhatsApp: { color:T.green,   bg:T.greenLight   },
  Calendar: { color:T.success, bg:T.successLight },
};

const REACH_MAP = {
  "All Faculty":142, "Specific Department":35, "HODs Only":8,
  "Research Committee":22, "Custom Filter (Advanced)":58,
};

/* ─────────────────────────────────────────
   PRIMITIVES
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
    borderBottom:`1px solid ${T.border}`, py:1.5, bgcolor:"#F9FAFB", whiteSpace:"nowrap", ...sx }}>
    {children}
  </TableCell>
);

const TD = ({ children, sx={}, align }) => (
  <TableCell align={align} sx={{ fontFamily:fBody, fontSize:"0.81rem", color:T.textSub,
    borderBottom:`1px solid ${T.border}`, py:1.8, ...sx }}>
    {children}
  </TableCell>
);

const StatusPill = ({ status }) => {
  const s = STATUS_MAP[status] || { color:T.textMute, bg:"#F1F5F9" };
  return (
    <Box display="flex" alignItems="center" gap={0.6}
      sx={{ px:1.2, py:0.36, borderRadius:"99px", bgcolor:s.bg, width:"fit-content" }}>
      <Box sx={{ width:6, height:6, borderRadius:"50%", bgcolor:s.color,
        ...(status==="Active" ? { animation:"pulse 1.8s infinite" } : {}) }} />
      <Typography sx={{ fontFamily:fBody, fontSize:"0.71rem", fontWeight:700, color:s.color }}>
        {status}
      </Typography>
    </Box>
  );
};

const ChanTag = ({ ch }) => {
  const s = CHAN_COLOR[ch] || { color:T.textMute, bg:"#F1F5F9" };
  return (
    <Box sx={{ px:0.85, py:0.2, borderRadius:"5px", bgcolor:s.bg,
      display:"inline-block", mr:0.4 }}>
      <Typography sx={{ fontFamily:fBody, fontSize:"0.64rem", fontWeight:700, color:s.color }}>
        {ch}
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

const EngagementBar = ({ delivered, read, clicked }) => {
  const readPct  = delivered > 0 ? Math.round((read    / delivered) * 100) : 0;
  const clickPct = delivered > 0 ? Math.round((clicked / delivered) * 100) : 0;
  return (
    <Box sx={{ minWidth:130 }}>
      {[
        { label:"Read",    pct:readPct,  color:T.accent  },
        { label:"Clicked", pct:clickPct, color:T.success },
      ].map(b => (
        <Box key={b.label} mb={0.5}>
          <Box display="flex" justifyContent="space-between" mb={0.25}>
            <Typography sx={{ fontFamily:fBody, fontSize:"0.62rem", color:T.textMute }}>
              {b.label}
            </Typography>
            <Typography sx={{ fontFamily:fMono, fontSize:"0.62rem", fontWeight:700, color:b.color }}>
              {b.pct}%
            </Typography>
          </Box>
          <Box sx={{ height:4, borderRadius:99, bgcolor:T.border, overflow:"hidden" }}>
            <Box sx={{ height:"100%", width:`${b.pct}%`, borderRadius:99,
              bgcolor:b.color, transition:"width 1s ease" }} />
          </Box>
        </Box>
      ))}
    </Box>
  );
};

/* ═════════════════════════════════════════════
   MAIN COMPONENT
═════════════════════════════════════════════ */
const CommunicationAdminView = () => {
  const [tabIndex, setTabIndex]   = useState(0);
  const [history,  setHistory]    = useState(HISTORY_INIT);
  const [feedback, setFeedback]   = useState(FEEDBACK_INIT);
  const [alerts,   setAlerts]     = useState(ALERTS_INIT);

  /* ── Composer state ── */
  const [ann, setAnn] = useState({
    title:"", message:"",
    targetType:"All Faculty", dept:"", grade:"", campus:"", joinedAfter:"",
    channels:{ email:true, app:true, sms:false, whatsapp:false },
    isScheduled:false, schedDate:"", isRecurring:false, frequency:"Weekly",
    hasPoll:false, pollQ:"", pollOpts:["",""],
  });

  /* ── Inbox state ── */
  const [selectedMsg, setSelectedMsg] = useState(FEEDBACK_INIT[0]);
  const [replyText,   setReplyText]   = useState("");

  const [snack, setSnack] = useState({ open:false, msg:"", severity:"success" });
  const toast = (msg, severity="success") => setSnack({ open:true, msg, severity });

  const toggleChan  = (key) => setAnn(p => ({ ...p, channels:{ ...p.channels, [key]:!p.channels[key] } }));
  const setField    = (k, v) => setAnn(p => ({ ...p, [k]:v }));
  const toggleAlert = (id)   => setAlerts(p => p.map(a => a.id===id ? { ...a, active:!a.active } : a));

  const unread    = feedback.filter(f => f.status === "Unread").length;
  const estimatedReach = REACH_MAP[ann.targetType] || 142;

  const handleLaunch = () => {
    if (!ann.title.trim())   { toast("Campaign title is required.", "error"); return; }
    if (!ann.message.trim()) { toast("Message body is required.", "error"); return; }
    const chans = Object.keys(ann.channels).filter(k => ann.channels[k]);
    if (chans.length === 0)  { toast("Select at least one channel.", "error"); return; }
    const entry = {
      id:Date.now(), title:ann.title, target:ann.targetType,
      date: ann.isScheduled && ann.schedDate ? ann.schedDate.split("T")[0] : new Date().toISOString().split("T")[0],
      status: ann.isScheduled ? "Scheduled" : "Sent",
      channels: chans.map(k => k==="app" ? "App" : k.charAt(0).toUpperCase()+k.slice(1)),
      stats:{ sent: ann.isScheduled ? 0 : estimatedReach,
              delivered: ann.isScheduled ? 0 : estimatedReach-2, read:0, clicked:0 },
      recurring: ann.isRecurring ? ann.frequency : "No",
    };
    setHistory(p => [entry, ...p]);
    toast(`Campaign "${ann.title}" ${ann.isScheduled ? "scheduled" : "launched"} successfully.`);
    setAnn(p => ({ ...p, title:"", message:"", hasPoll:false }));
  };

  const handleReply = () => {
    if (!replyText.trim()) { toast("Reply cannot be empty.", "error"); return; }
    setFeedback(p => p.map(f => f.id===selectedMsg.id ? { ...f, status:"Read" } : f));
    toast(`Reply sent to ${selectedMsg.from}.`);
    setReplyText("");
  };

  const TABS = [
    { label:"Smart Composer",      Icon:Campaign,           count:0      },
    { label:"Delivery Analytics",  Icon:BarChartIcon,       count:0      },
    { label:"Inbox & Feedback",    Icon:Feedback,           count:unread },
    { label:"Gateway & Credits",   Icon:WhatsApp,           count:0      },
    { label:"Auto-Alerts",         Icon:NotificationsActive,count:0      },
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
            Admin Dashboard · Communications
          </Typography>
          <Typography sx={{ fontFamily:fHead, fontWeight:700, fontSize:"1.5rem", color:T.text }}>
            Smart Communication Hub
          </Typography>
          <Typography sx={{ fontFamily:fBody, fontSize:"0.82rem", color:T.textSub, mt:0.3 }}>
            Compose campaigns, track delivery, manage inbox, and configure automated alerts.
          </Typography>
        </Box>
        <Button size="small" variant="outlined" startIcon={<Download sx={{fontSize:15}} />}
          onClick={() => toast("Communication report exported.")} sx={{
            fontFamily:fBody, fontWeight:600, fontSize:"0.76rem", textTransform:"none",
            borderRadius:"8px", borderColor:T.border, color:T.textSub, mt:0.5,
            "&:hover":{ borderColor:T.accent, color:T.accent }
          }}>
          Export
        </Button>
      </Box>

      {/* ── Stat Strip ── */}
      <Grid container spacing={2} mb={3}>
        {[
          { label:"Campaigns Sent",    value:history.filter(h=>h.status==="Sent").length, sub:"This month",          color:T.accent,  Icon:Send           },
          { label:"Avg. Delivery Rate",value:"98%",                                       sub:"Across all channels", color:T.success, Icon:DoneAll         },
          { label:"Avg. Open Rate",    value:"65%",                                       sub:"Email campaigns",     color:T.purple,  Icon:MarkEmailRead   },
          { label:"Unread Replies",    value:unread,                                      sub:"Awaiting response",   color:T.warning, Icon:Feedback        },
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
        <Box sx={{ borderBottom:`1px solid ${T.border}`, bgcolor:"#FAFBFD", overflowX:"auto" }}>
          <Tabs value={tabIndex} onChange={(_,v) => setTabIndex(v)}
            variant="scrollable" scrollButtons="auto" sx={{
              px:2,
              "& .MuiTabs-indicator":{ bgcolor:T.accent, height:"2.5px", borderRadius:"2px 2px 0 0" },
              "& .MuiTab-root":{ fontFamily:fBody, fontWeight:600, fontSize:"0.78rem",
                textTransform:"none", color:T.textMute, minHeight:50,
                "&.Mui-selected":{ color:T.accent } }
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

          {/* ════════════════════════════════
              TAB 0 — SMART COMPOSER
          ════════════════════════════════ */}
          {tabIndex === 0 && (
            <Grid container spacing={2.5} className="fu">

              {/* LEFT — Composer */}
              <Grid item xs={12} md={7}>
                <SCard sx={{ p:2.5 }}>
                  <Typography sx={{ fontFamily:fHead, fontWeight:700,
                    fontSize:"0.92rem", color:T.text, mb:2 }}>
                    Draft Campaign
                  </Typography>

                  {/* Channel tiles */}
                  <SLabel sx={{ mb:1 }}>Delivery Channels</SLabel>
                  <Box display="flex" gap={1} flexWrap="wrap" mb={2.5}>
                    {CHANNELS_DEF.map(c => {
                      const active = ann.channels[c.key];
                      return (
                        <Box key={c.key} onClick={() => toggleChan(c.key)} sx={{
                          display:"flex", alignItems:"center", gap:0.7,
                          px:1.3, py:0.65, borderRadius:"8px", cursor:"pointer",
                          border:`1.5px solid ${active ? c.color : T.border}`,
                          bgcolor: active ? `${c.color}12` : "transparent",
                          transition:"all .14s",
                          "&:hover":{ borderColor:c.color }
                        }}>
                          <c.Icon sx={{ fontSize:14, color: active ? c.color : T.textMute }} />
                          <Typography sx={{ fontFamily:fBody, fontSize:"0.76rem",
                            fontWeight: active ? 700 : 500,
                            color: active ? c.color : T.textSub }}>
                            {c.label}
                          </Typography>
                          {active && <CheckCircle sx={{ fontSize:12, color:c.color }} />}
                        </Box>
                      );
                    })}
                  </Box>

                  {/* Title */}
                  <Box mb={2}>
                    <SLabel sx={{ mb:0.7 }}>Campaign Title / Subject *</SLabel>
                    <DInput value={ann.title}
                      onChange={e => setField("title", e.target.value)}
                      placeholder="e.g. PBAS Submission Deadline Reminder" />
                  </Box>

                  {/* Rich text + body */}
                  <Box mb={2}>
                    <SLabel sx={{ mb:0.7 }}>Message Body *</SLabel>
                    <Box sx={{ border:`1px solid ${T.border}`, borderRadius:"9px", overflow:"hidden" }}>
                      {/* Toolbar */}
                      <Box sx={{ bgcolor:"#F9FAFB", px:1.5, py:0.7,
                        borderBottom:`1px solid ${T.border}`,
                        display:"flex", gap:0.3, alignItems:"center", flexWrap:"wrap" }}>
                        {[
                          { Icon:FormatBold,         tip:"Bold"        },
                          { Icon:FormatItalic,       tip:"Italic"      },
                          { Icon:FormatListBulleted, tip:"Bullet list" },
                        ].map(b => (
                          <Tooltip key={b.tip} title={b.tip}>
                            <IconButton size="small" sx={{ borderRadius:"6px",
                              "&:hover":{ bgcolor:T.accentLight, color:T.accent } }}>
                              <b.Icon sx={{ fontSize:16 }} />
                            </IconButton>
                          </Tooltip>
                        ))}
                        <Box sx={{ width:1, height:20, bgcolor:T.border, mx:0.5 }} />
                        {[
                          { Icon:Image,     tip:"Insert image" },
                          { Icon:LinkIcon,  tip:"Insert link"  },
                          { Icon:AttachFile,tip:"Attach file"  },
                        ].map(b => (
                          <Tooltip key={b.tip} title={b.tip}>
                            <IconButton size="small" sx={{ borderRadius:"6px",
                              "&:hover":{ bgcolor:T.accentLight, color:T.accent } }}>
                              <b.Icon sx={{ fontSize:16 }} />
                            </IconButton>
                          </Tooltip>
                        ))}
                        <Box sx={{ width:1, height:20, bgcolor:T.border, mx:0.5 }} />
                        <Button size="small" startIcon={<Poll sx={{fontSize:13}} />}
                          onClick={() => setField("hasPoll", !ann.hasPoll)}
                          sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.72rem",
                            textTransform:"none", borderRadius:"6px",
                            color: ann.hasPoll ? T.accent : T.textSub,
                            bgcolor: ann.hasPoll ? T.accentLight : "transparent",
                            "&:hover":{ bgcolor:T.accentLight, color:T.accent } }}>
                          {ann.hasPoll ? "Remove Poll" : "Add Poll"}
                        </Button>
                      </Box>

                      {/* Body textarea */}
                      <TextField fullWidth multiline rows={5}
                        value={ann.message}
                        onChange={e => setField("message", e.target.value)}
                        placeholder="Type your message here…"
                        variant="standard"
                        InputProps={{ disableUnderline:true,
                          sx:{ p:2, fontFamily:fBody, fontSize:"0.84rem" } }}
                      />

                      {/* Poll section */}
                      {ann.hasPoll && (
                        <Box sx={{ p:2, bgcolor:T.accentLight,
                          borderTop:`1px dashed ${T.accent}40` }}>
                          <SLabel sx={{ mb:0.8, color:T.accent }}>Poll Question</SLabel>
                          <DInput value={ann.pollQ}
                            onChange={e => setField("pollQ", e.target.value)}
                            placeholder="e.g. Which seminar slot works best?"
                            sx={{ mb:1.5 }} />
                          <SLabel sx={{ mb:0.7, color:T.accent }}>Options</SLabel>
                          <Stack spacing={1}>
                            {ann.pollOpts.map((opt,i) => (
                              <Box key={i} display="flex" gap={1} alignItems="center">
                                <Box sx={{ width:16, height:16, borderRadius:"50%",
                                  border:`2px solid ${T.accent}`, flexShrink:0 }} />
                                <TextField size="small" fullWidth value={opt}
                                  onChange={e => {
                                    const opts = [...ann.pollOpts];
                                    opts[i] = e.target.value;
                                    setField("pollOpts", opts);
                                  }}
                                  placeholder={`Option ${i+1}`}
                                  sx={{ "& .MuiOutlinedInput-root":{ borderRadius:"8px",
                                    fontFamily:fBody, fontSize:"0.8rem", bgcolor:T.surface,
                                    "& fieldset":{ borderColor:T.border },
                                    "&.Mui-focused fieldset":{ borderColor:T.accent } }}}
                                />
                                {i > 1 && (
                                  <IconButton size="small"
                                    onClick={() => setField("pollOpts", ann.pollOpts.filter((_,j)=>j!==i))}>
                                    <Close sx={{ fontSize:13 }} />
                                  </IconButton>
                                )}
                              </Box>
                            ))}
                            <Button size="small" startIcon={<Add sx={{fontSize:13}} />}
                              onClick={() => setField("pollOpts", [...ann.pollOpts, ""])}
                              sx={{ fontFamily:fBody, fontWeight:600, fontSize:"0.73rem",
                                textTransform:"none", color:T.accent, borderRadius:"7px",
                                "&:hover":{ bgcolor:T.accentLight } }}>
                              Add Option
                            </Button>
                          </Stack>
                        </Box>
                      )}
                    </Box>
                  </Box>

                  {/* Scheduling */}
                  <Box sx={{ p:2, borderRadius:"9px", mb:2.5,
                    border:`1px solid ${ann.isScheduled ? T.accent+"50" : T.border}`,
                    bgcolor: ann.isScheduled ? T.accentLight : "#F9FAFB",
                    transition:"all .2s" }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Box display="flex" alignItems="center" gap={1}>
                        <ScheduleSend sx={{ fontSize:16,
                          color: ann.isScheduled ? T.accent : T.textMute }} />
                        <Typography sx={{ fontFamily:fBody, fontWeight:700,
                          fontSize:"0.8rem",
                          color: ann.isScheduled ? T.accent : T.textSub }}>
                          Schedule / Recurring
                        </Typography>
                      </Box>
                      <Switch checked={ann.isScheduled}
                        onChange={e => setField("isScheduled", e.target.checked)}
                        sx={{ "& .MuiSwitch-switchBase.Mui-checked":{ color:T.accent },
                          "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":{ bgcolor:T.accent } }} />
                    </Box>

                    {ann.isScheduled && (
                      <Box mt={1.5}>
                        <Grid container spacing={1.5}>
                          <Grid item xs={12} sm={6}>
                            <SLabel sx={{ mb:0.5 }}>Send Date &amp; Time</SLabel>
                            <DInput type="datetime-local" value={ann.schedDate}
                              onChange={e => setField("schedDate", e.target.value)}
                              InputLabelProps={{ shrink:true }} />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                              <Checkbox size="small" checked={ann.isRecurring}
                                onChange={e => setField("isRecurring", e.target.checked)}
                                sx={{ p:0, "&.Mui-checked":{ color:T.accent } }} />
                              <SLabel sx={{ mb:0 }}>Make Recurring</SLabel>
                            </Box>
                            <DInput select value={ann.frequency}
                              onChange={e => setField("frequency", e.target.value)}
                              disabled={!ann.isRecurring}>
                              {["Daily","Weekly","Fortnightly","Monthly"].map(f => (
                                <MenuItem key={f} value={f}
                                  sx={{fontFamily:fBody,fontSize:"0.82rem"}}>{f}</MenuItem>
                              ))}
                            </DInput>
                          </Grid>
                        </Grid>
                      </Box>
                    )}
                  </Box>

                  <Button variant="contained" fullWidth size="large"
                    startIcon={ann.isScheduled
                      ? <ScheduleSend sx={{fontSize:18}} />
                      : <Send sx={{fontSize:18}} />}
                    onClick={handleLaunch}
                    sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.88rem",
                      textTransform:"none", borderRadius:"9px", py:1.3,
                      bgcolor:T.accent, boxShadow:"none",
                      "&:hover":{ bgcolor:"#4F46E5", boxShadow:"none" } }}>
                    {ann.isScheduled ? "Schedule Campaign" : "Launch Campaign Now"}
                  </Button>
                </SCard>
              </Grid>

              {/* RIGHT — Targeting */}
              <Grid item xs={12} md={5}>
                <SCard sx={{ p:2.5, height:"100%" }}>
                  <Typography sx={{ fontFamily:fHead, fontWeight:700,
                    fontSize:"0.92rem", color:T.text, mb:2 }}>
                    Target Audience
                  </Typography>

                  <Box mb={2}>
                    <SLabel sx={{ mb:0.7 }}>Primary Group</SLabel>
                    <DInput select value={ann.targetType}
                      onChange={e => setField("targetType", e.target.value)}>
                      {TARGETS.map(t => (
                        <MenuItem key={t} value={t}
                          sx={{fontFamily:fBody,fontSize:"0.82rem"}}>{t}</MenuItem>
                      ))}
                    </DInput>
                  </Box>

                  {ann.targetType === "Custom Filter (Advanced)" && (
                    <Box sx={{ p:2, borderRadius:"9px",
                      border:`1px solid ${T.border}`, bgcolor:"#FAFBFD", mb:2 }}>
                      <SLabel sx={{ mb:1 }}>Advanced Filters</SLabel>
                      <Grid container spacing={1.5}>
                        {[
                          { label:"Department", key:"dept",   opts:DEPTS },
                          { label:"Grade/Level",key:"grade",  opts:["Professor","Associate Professor","Assistant Professor"] },
                          { label:"Campus",     key:"campus", opts:["North Campus","South Campus","East Campus"] },
                        ].map(f => (
                          <Grid item xs={12} key={f.key}>
                            <DInput select label={f.label} value={ann[f.key]}
                              onChange={e => setField(f.key, e.target.value)}>
                              <MenuItem value="" sx={{fontFamily:fBody,fontSize:"0.8rem"}}>All</MenuItem>
                              {f.opts.map(o => (
                                <MenuItem key={o} value={o}
                                  sx={{fontFamily:fBody,fontSize:"0.8rem"}}>{o}</MenuItem>
                              ))}
                            </DInput>
                          </Grid>
                        ))}
                        <Grid item xs={12}>
                          <SLabel sx={{ mb:0.5 }}>Joined After</SLabel>
                          <DInput type="date" value={ann.joinedAfter}
                            onChange={e => setField("joinedAfter", e.target.value)}
                            InputLabelProps={{ shrink:true }} />
                        </Grid>
                      </Grid>
                    </Box>
                  )}

                  {ann.targetType === "Specific Department" && (
                    <Box mb={2}>
                      <SLabel sx={{ mb:0.7 }}>Select Department</SLabel>
                      <DInput select value={ann.dept}
                        onChange={e => setField("dept", e.target.value)}>
                        {DEPTS.map(d => (
                          <MenuItem key={d} value={d}
                            sx={{fontFamily:fBody,fontSize:"0.82rem"}}>{d}</MenuItem>
                        ))}
                      </DInput>
                    </Box>
                  )}

                  {/* Reach indicator */}
                  <Box sx={{ p:2.5, borderRadius:"12px",
                    bgcolor:T.accentLight, border:`1px solid ${T.accent}25`,
                    textAlign:"center", mb:2.5 }}>
                    <SLabel sx={{ mb:0.5, color:T.accent }}>Estimated Reach</SLabel>
                    <Typography sx={{ fontFamily:fMono, fontWeight:700,
                      fontSize:"2.2rem", color:T.accent, lineHeight:1 }}>
                      {estimatedReach}
                    </Typography>
                    <Typography sx={{ fontFamily:fBody, fontSize:"0.74rem",
                      color:T.textSub, mt:0.3 }}>Faculty Members</Typography>
                  </Box>

                  {/* Channel summary */}
                  <SLabel sx={{ mb:1 }}>Active Channels</SLabel>
                  <Stack spacing={0.7}>
                    {CHANNELS_DEF.map(c => {
                      const active = ann.channels[c.key];
                      return (
                        <Box key={c.key} display="flex" alignItems="center" gap={1.2}
                          sx={{ px:1.3, py:0.9, borderRadius:"8px",
                            bgcolor: active ? `${c.color}10` : "#F9FAFB",
                            border:`1px solid ${active ? c.color+"30" : T.border}`,
                            opacity: active ? 1 : 0.5 }}>
                          <c.Icon sx={{ fontSize:15, color: active ? c.color : T.textMute }} />
                          <Typography sx={{ fontFamily:fBody, fontSize:"0.78rem",
                            fontWeight: active ? 600 : 400,
                            color: active ? c.color : T.textMute, flex:1 }}>
                            {c.label}
                          </Typography>
                          {active
                            ? <CheckCircle sx={{ fontSize:13, color:c.color }} />
                            : <RadioButtonUnchecked sx={{ fontSize:13, color:T.textMute }} />}
                        </Box>
                      );
                    })}
                  </Stack>
                </SCard>
              </Grid>
            </Grid>
          )}

          {/* ════════════════════════════════
              TAB 1 — DELIVERY ANALYTICS
          ════════════════════════════════ */}
          {tabIndex === 1 && (
            <Box className="fu">
              <Grid container spacing={2} mb={3}>
                {[
                  { label:"Avg. Delivery Rate", value:"98%",          sub:"All channels",    color:T.success, Icon:DoneAll         },
                  { label:"Avg. Open Rate",     value:"65%",          sub:"Email campaigns", color:T.accent,  Icon:MarkEmailRead   },
                  { label:"Failed / Bounced",   value:"12",           sub:"This month",      color:T.danger,  Icon:Warning         },
                  { label:"Total Campaigns",    value:history.length, sub:"All time",        color:T.purple,  Icon:CampaignOutlined },
                ].map((s,i) => (
                  <Grid item xs={6} md={3} key={i}>
                    <SCard sx={{ p:2 }}>
                      <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                        <Box>
                          <SLabel>{s.label}</SLabel>
                          <Typography sx={{ fontFamily:fMono, fontWeight:700, fontSize:"1.5rem",
                            color:s.color, lineHeight:1.1 }}>{s.value}</Typography>
                          <Typography sx={{ fontFamily:fBody, fontSize:"0.7rem",
                            color:T.textMute, mt:0.3 }}>{s.sub}</Typography>
                        </Box>
                        <Box sx={{ p:1, borderRadius:"9px", bgcolor:`${s.color}15`, color:s.color }}>
                          <s.Icon sx={{ fontSize:18 }} />
                        </Box>
                      </Box>
                    </SCard>
                  </Grid>
                ))}
              </Grid>

              <Typography sx={{ fontFamily:fHead, fontWeight:700,
                fontSize:"0.92rem", color:T.text, mb:1.8 }}>
                Campaign Performance
              </Typography>

              <Box sx={{ borderRadius:"10px", border:`1px solid ${T.border}`, overflow:"hidden" }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TH>Campaign</TH>
                      <TH>Channels</TH>
                      <TH>Target</TH>
                      <TH>Sent</TH>
                      <TH>Engagement</TH>
                      <TH>Status</TH>
                      <TH align="center">Actions</TH>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {history.map(row => (
                      <TableRow key={row.id} className="row-h">
                        <TD sx={{ minWidth:190 }}>
                          <Typography sx={{ fontFamily:fBody, fontWeight:700,
                            fontSize:"0.82rem", color:T.text }}>{row.title}</Typography>
                          {row.recurring !== "No" && (
                            <Box sx={{ display:"inline-flex", alignItems:"center", gap:0.4,
                              px:0.8, py:0.15, borderRadius:"5px", bgcolor:T.accentLight, mt:0.3 }}>
                              <Refresh sx={{ fontSize:10, color:T.accent }} />
                              <Typography sx={{ fontFamily:fMono, fontSize:"0.61rem",
                                fontWeight:700, color:T.accent }}>{row.recurring}</Typography>
                            </Box>
                          )}
                        </TD>
                        <TD>
                          <Box display="flex" flexWrap="wrap" gap={0.3}>
                            {row.channels.map(c => <ChanTag key={c} ch={c} />)}
                          </Box>
                        </TD>
                        <TD>
                          <Typography sx={{ fontFamily:fBody, fontSize:"0.77rem" }}>{row.target}</Typography>
                        </TD>
                        <TD>
                          <Typography sx={{ fontFamily:fMono, fontWeight:700, fontSize:"0.82rem" }}>
                            {row.stats.sent}
                          </Typography>
                        </TD>
                        <TD sx={{ minWidth:140 }}>
                          {row.stats.delivered > 0
                            ? <EngagementBar {...row.stats} />
                            : <Typography sx={{ fontFamily:fBody, fontSize:"0.72rem",
                                color:T.textMute, fontStyle:"italic" }}>Pending</Typography>}
                        </TD>
                        <TD><StatusPill status={row.status} /></TD>
                        <TD align="center">
                          <Box display="flex" gap={0.5} justifyContent="center">
                            <Tooltip title="View analytics">
                              <IconButton size="small"
                                sx={{ bgcolor:T.accentLight, color:T.accent,
                                  borderRadius:"7px", width:28, height:28 }}
                                onClick={() => toast(`Detailed report for "${row.title}"`)}>
                                <BarChartIcon sx={{ fontSize:14 }} />
                              </IconButton>
                            </Tooltip>
                            {row.stats.sent === 0 && (
                              <Tooltip title="Retry send">
                                <IconButton size="small"
                                  sx={{ bgcolor:T.dangerLight, color:T.danger,
                                    borderRadius:"7px", width:28, height:28 }}
                                  onClick={() => toast("Retry triggered.", "warning")}>
                                  <Update sx={{ fontSize:14 }} />
                                </IconButton>
                              </Tooltip>
                            )}
                          </Box>
                        </TD>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            </Box>
          )}

          {/* ════════════════════════════════
              TAB 2 — INBOX & FEEDBACK
          ════════════════════════════════ */}
          {tabIndex === 2 && (
            <Grid container spacing={2} className="fu" sx={{ minHeight:460 }}>

              {/* Message list */}
              <Grid item xs={12} md={4}>
                <Box sx={{ borderRadius:"10px", border:`1px solid ${T.border}`, overflow:"hidden" }}>
                  <Box sx={{ px:2, py:1.5, borderBottom:`1px solid ${T.border}`,
                    bgcolor:"#FAFBFD", display:"flex",
                    justifyContent:"space-between", alignItems:"center" }}>
                    <Typography sx={{ fontFamily:fHead, fontWeight:700,
                      fontSize:"0.84rem", color:T.text }}>Inbox</Typography>
                    <Box sx={{ px:0.9, py:0.2, borderRadius:"6px",
                      bgcolor: unread > 0 ? T.warningLight : T.successLight }}>
                      <Typography sx={{ fontFamily:fMono, fontSize:"0.67rem", fontWeight:700,
                        color: unread > 0 ? T.warning : T.success }}>{unread} unread</Typography>
                    </Box>
                  </Box>
                  {feedback.map(item => (
                    <Box key={item.id}
                      className="inbox-item"
                      onClick={() => setSelectedMsg(item)}
                      sx={{ px:2, py:1.6, borderBottom:`1px solid ${T.border}`,
                        bgcolor: selectedMsg?.id===item.id ? T.accentLight : "transparent" }}>
                      <Box display="flex" alignItems="flex-start" gap={1.2}>
                        <Avatar sx={{ width:30, height:30, bgcolor:T.accentLight,
                          color:T.accent, fontSize:"0.6rem", fontWeight:700, flexShrink:0 }}>
                          {item.avatar}
                        </Avatar>
                        <Box flex={1} minWidth={0}>
                          <Box display="flex" justifyContent="space-between"
                            alignItems="center" mb={0.2}>
                            <Typography sx={{ fontFamily:fBody, fontWeight:700,
                              fontSize:"0.79rem", color:T.text }}>{item.from}</Typography>
                            {item.status === "Unread" && (
                              <Box sx={{ width:7, height:7, borderRadius:"50%",
                                bgcolor:T.accent, flexShrink:0 }} className="blink" />
                            )}
                          </Box>
                          <Typography sx={{ fontFamily:fBody, fontSize:"0.71rem",
                            fontWeight: item.status==="Unread" ? 700 : 400,
                            color: item.status==="Unread" ? T.text : T.textMute,
                            overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                            {item.subject}
                          </Typography>
                          <Typography sx={{ fontFamily:fBody, fontSize:"0.67rem",
                            color:T.textMute, mt:0.2 }}>{item.date}</Typography>
                        </Box>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Grid>

              {/* Viewer + reply */}
              <Grid item xs={12} md={8}>
                {selectedMsg ? (
                  <SCard sx={{ p:2.5, display:"flex", flexDirection:"column", height:"100%", minHeight:400 }}>
                    {/* Header */}
                    <Box display="flex" justifyContent="space-between"
                      alignItems="flex-start" mb={2}>
                      <Box>
                        <Typography sx={{ fontFamily:fHead, fontWeight:700,
                          fontSize:"1rem", color:T.text }}>{selectedMsg.subject}</Typography>
                        <Box display="flex" alignItems="center" gap={1} mt={0.5}>
                          <Avatar sx={{ width:22, height:22, bgcolor:T.accentLight,
                            color:T.accent, fontSize:"0.58rem", fontWeight:700 }}>
                            {selectedMsg.avatar}
                          </Avatar>
                          <Typography sx={{ fontFamily:fBody, fontSize:"0.73rem", color:T.textSub }}>
                            {selectedMsg.from} &nbsp;·&nbsp; {selectedMsg.dept} &nbsp;·&nbsp; {selectedMsg.date}
                          </Typography>
                        </Box>
                      </Box>
                      <Tooltip title="Delete">
                        <IconButton size="small"
                          sx={{ bgcolor:T.dangerLight, color:T.danger, borderRadius:"7px" }}
                          onClick={() => {
                            const rest = feedback.filter(f => f.id !== selectedMsg.id);
                            setFeedback(rest);
                            setSelectedMsg(rest[0] || null);
                            toast("Message deleted.", "warning");
                          }}>
                          <Delete sx={{ fontSize:15 }} />
                        </IconButton>
                      </Tooltip>
                    </Box>

                    {/* Body */}
                    <Box sx={{ p:2, borderRadius:"10px", bgcolor:"#F9FAFB",
                      border:`1px solid ${T.border}`, mb:2, flex:1 }}>
                      <Typography sx={{ fontFamily:fBody, fontSize:"0.84rem",
                        color:T.textSub, lineHeight:1.8 }}>
                        {selectedMsg.message}
                      </Typography>
                    </Box>

                    {/* Reply */}
                    <Box>
                      <SLabel sx={{ mb:0.7 }}>Reply to {selectedMsg.from}</SLabel>
                      <TextField fullWidth multiline rows={3} value={replyText}
                        onChange={e => setReplyText(e.target.value)}
                        placeholder="Type your response here…"
                        sx={{ mb:1.5,
                          "& .MuiOutlinedInput-root":{ borderRadius:"9px",
                            fontFamily:fBody, fontSize:"0.82rem",
                            "& fieldset":{ borderColor:T.border },
                            "&.Mui-focused fieldset":{ borderColor:T.accent } }}}
                      />
                      <Box display="flex" justifyContent="flex-end">
                        <Button variant="contained" endIcon={<Send sx={{fontSize:15}} />}
                          onClick={handleReply}
                          sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.8rem",
                            textTransform:"none", borderRadius:"8px",
                            bgcolor:T.accent, boxShadow:"none",
                            "&:hover":{ bgcolor:"#4F46E5", boxShadow:"none" } }}>
                          Send Reply
                        </Button>
                      </Box>
                    </Box>
                  </SCard>
                ) : (
                  <Box display="flex" alignItems="center" justifyContent="center"
                    height="100%" sx={{ color:T.textMute }}>
                    <Typography sx={{ fontFamily:fBody }}>
                      Select a message to view
                    </Typography>
                  </Box>
                )}
              </Grid>
            </Grid>
          )}

          {/* ════════════════════════════════
              TAB 3 — GATEWAY & CREDITS
          ════════════════════════════════ */}
          {tabIndex === 3 && (
            <Box className="fu">
              <Typography sx={{ fontFamily:fHead, fontWeight:700,
                fontSize:"0.92rem", color:T.text, mb:2 }}>
                SMS &amp; WhatsApp Gateway Status
              </Typography>

              <Grid container spacing={2.5} mb={3}>
                {[
                  { label:"SMS Credits",            value:4500,        sub:"Available balance",      color:T.purple, Icon:Sms,          pct:90, btnLabel:"Top Up Credits" },
                  { label:"WhatsApp Conversations", value:1200,        sub:"Free tier remaining",    color:T.green,  Icon:WhatsApp,     pct:60, btnLabel:"Manage API"     },
                  { label:"Email Quota",            value:"Unlimited", sub:"SMTP gateway active",    color:T.accent, Icon:EmailOutlined, pct:null,btnLabel:"View Settings" },
                ].map((c,i) => (
                  <Grid item xs={12} md={4} key={i}>
                    <SCard sx={{ p:2.5, borderLeft:`4px solid ${c.color}` }}>
                      <Box display="flex" justifyContent="space-between"
                        alignItems="flex-start" mb={1.5}>
                        <Box>
                          <SLabel sx={{ mb:0.4 }}>{c.label}</SLabel>
                          <Typography sx={{ fontFamily:fMono, fontWeight:700,
                            fontSize:"1.6rem", color:c.color, lineHeight:1.1 }}>
                            {c.value}
                          </Typography>
                          <Typography sx={{ fontFamily:fBody, fontSize:"0.7rem",
                            color:T.textMute, mt:0.3 }}>{c.sub}</Typography>
                        </Box>
                        <Box sx={{ p:1, borderRadius:"9px", bgcolor:`${c.color}15`, color:c.color }}>
                          <c.Icon sx={{ fontSize:20 }} />
                        </Box>
                      </Box>
                      {c.pct !== null && (
                        <Box mb={1.5}>
                          <Box display="flex" justifyContent="space-between" mb={0.4}>
                            <Typography sx={{ fontFamily:fBody, fontSize:"0.68rem", color:T.textMute }}>
                              Remaining
                            </Typography>
                            <Typography sx={{ fontFamily:fMono, fontSize:"0.68rem",
                              fontWeight:700, color: c.pct < 30 ? T.danger : c.color }}>
                              {c.pct}%
                            </Typography>
                          </Box>
                          <Box sx={{ height:5, borderRadius:99, bgcolor:T.border, overflow:"hidden" }}>
                            <Box sx={{ height:"100%", width:`${c.pct}%`, borderRadius:99,
                              bgcolor: c.pct < 30 ? T.danger : c.color,
                              transition:"width 1s ease" }} />
                          </Box>
                        </Box>
                      )}
                      <Button size="small" variant="outlined"
                        onClick={() => toast(`${c.btnLabel} opened.`)}
                        sx={{ fontFamily:fBody, fontWeight:600, fontSize:"0.72rem",
                          textTransform:"none", borderRadius:"7px",
                          borderColor:`${c.color}50`, color:c.color,
                          "&:hover":{ borderColor:c.color, bgcolor:`${c.color}10` } }}>
                        {c.btnLabel}
                      </Button>
                    </SCard>
                  </Grid>
                ))}
              </Grid>

              <Typography sx={{ fontFamily:fHead, fontWeight:700,
                fontSize:"0.88rem", color:T.text, mb:1.8 }}>
                Gateway Configuration
              </Typography>
              <SCard sx={{ p:2.5 }}>
                <Grid container spacing={2}>
                  {[
                    { label:"SMS Gateway Provider",       value:"Twilio"                    },
                    { label:"WhatsApp Business ID",       value:"WABA-99887766"             },
                    { label:"SMTP Provider",              value:"SendGrid (inst.smtp.edu.in)"},
                    { label:"Sender ID / DLT Registered", value:"INSTNOT"                  },
                  ].map(f => (
                    <Grid item xs={12} md={6} key={f.label}>
                      <SLabel sx={{ mb:0.7 }}>{f.label}</SLabel>
                      <DInput value={f.value} disabled />
                    </Grid>
                  ))}
                  <Grid item xs={12}>
                    <Divider sx={{ borderColor:T.border, my:0.5 }} />
                    <Box display="flex" alignItems="center" gap={2} mt={1.5}>
                      <Switch defaultChecked
                        sx={{ "& .MuiSwitch-switchBase.Mui-checked":{ color:T.accent },
                          "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":{ bgcolor:T.accent } }} />
                      <Box>
                        <Typography sx={{ fontFamily:fBody, fontWeight:700,
                          fontSize:"0.82rem", color:T.text }}>
                          Enable Auto-Failover
                        </Typography>
                        <Typography sx={{ fontFamily:fBody, fontSize:"0.72rem", color:T.textMute }}>
                          Automatically fall back to SMS if WhatsApp delivery fails
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </SCard>
            </Box>
          )}

          {/* ════════════════════════════════
              TAB 4 — AUTO-ALERTS
          ════════════════════════════════ */}
          {tabIndex === 4 && (
            <Box className="fu">
              <Box display="flex" justifyContent="space-between"
                alignItems="center" mb={2.5}>
                <Box>
                  <Typography sx={{ fontFamily:fHead, fontWeight:700,
                    fontSize:"0.92rem", color:T.text }}>
                    System-Triggered Alerts
                  </Typography>
                  <Typography sx={{ fontFamily:fBody, fontSize:"0.76rem",
                    color:T.textMute, mt:0.2 }}>
                    Configure automated notifications based on HR and system events.
                  </Typography>
                </Box>
                <Button size="small" variant="outlined"
                  startIcon={<Add sx={{fontSize:15}} />}
                  onClick={() => toast("Alert configuration panel opened.")}
                  sx={{ fontFamily:fBody, fontWeight:600, fontSize:"0.76rem",
                    textTransform:"none", borderRadius:"8px",
                    borderColor:T.border, color:T.textSub,
                    "&:hover":{ borderColor:T.accent, color:T.accent } }}>
                  Add Alert
                </Button>
              </Box>

              <Box sx={{ borderRadius:"10px", border:`1px solid ${T.border}`, overflow:"hidden" }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TH>Alert Name</TH>
                      <TH>Trigger Condition</TH>
                      <TH>Recipient</TH>
                      <TH>Status</TH>
                      <TH align="center">Actions</TH>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {alerts.map(row => {
                      const AlertIcon = row.Icon;
                      return (
                        <TableRow key={row.id} className="row-h"
                          sx={{ opacity: row.active ? 1 : 0.55 }}>
                          <TD sx={{ minWidth:190 }}>
                            <Box display="flex" alignItems="center" gap={1.2}>
                              <Box sx={{ p:0.7, borderRadius:"7px",
                                bgcolor: row.active ? T.accentLight : "#F1F5F9",
                                color:   row.active ? T.accent      : T.textMute }}>
                                <AlertIcon sx={{ fontSize:14 }} />
                              </Box>
                              <Typography sx={{ fontFamily:fBody, fontWeight:700,
                                fontSize:"0.82rem", color:T.text }}>{row.name}</Typography>
                            </Box>
                          </TD>
                          <TD>
                            <Box sx={{ px:1.1, py:0.3, borderRadius:"6px",
                              bgcolor:T.warningLight, display:"inline-block" }}>
                              <Typography sx={{ fontFamily:fBody, fontSize:"0.71rem",
                                fontWeight:600, color:T.warning }}>{row.trigger}</Typography>
                            </Box>
                          </TD>
                          <TD>
                            <Typography sx={{ fontFamily:fBody, fontSize:"0.79rem" }}>
                              {row.recipient}
                            </Typography>
                          </TD>
                          <TD>
                            <Box display="flex" alignItems="center" gap={1}>
                              <Switch checked={row.active} size="small"
                                onChange={() => toggleAlert(row.id)}
                                sx={{ "& .MuiSwitch-switchBase.Mui-checked":{ color:T.success },
                                  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":{ bgcolor:T.success } }} />
                              <Box sx={{ px:1, py:0.28, borderRadius:"99px",
                                bgcolor: row.active ? T.successLight : "#F1F5F9" }}>
                                <Typography sx={{ fontFamily:fBody, fontSize:"0.68rem",
                                  fontWeight:700,
                                  color: row.active ? T.success : T.textMute }}>
                                  {row.active ? "Active" : "Paused"}
                                </Typography>
                              </Box>
                            </Box>
                          </TD>
                          <TD align="center">
                            <Tooltip title="Edit alert">
                              <IconButton size="small"
                                sx={{ bgcolor:T.accentLight, color:T.accent,
                                  borderRadius:"7px", width:28, height:28 }}
                                onClick={() => toast(`Editing "${row.name}"…`)}>
                                <Edit sx={{ fontSize:14 }} />
                              </IconButton>
                            </Tooltip>
                          </TD>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>

                <Box sx={{ px:2.5, py:2, borderTop:`1px solid ${T.border}`, bgcolor:"#FAFBFD" }}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <NotificationsActive sx={{ fontSize:14, color:T.accent }} />
                    <Typography sx={{ fontFamily:fBody, fontSize:"0.75rem", color:T.textMute }}>
                      Alerts are sent via all active channels configured in Gateway &amp; Credits.
                      Toggle to pause any alert without deleting it.
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          )}

        </Box>
      </SCard>

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

export default CommunicationAdminView;