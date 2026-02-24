import React, { useState } from 'react';
import {
  Box, Typography, Card, TextField, Button, Switch,
  FormControlLabel, Alert, Stepper, Step, StepLabel, Grid,
  MenuItem, Chip, Tabs, Tab, Rating, Divider, Stack,
  Dialog, DialogTitle, DialogContent, DialogActions,
  IconButton, Avatar, LinearProgress, Tooltip, Badge,
  Collapse, InputAdornment, Snackbar, Paper
} from "@mui/material";
import {
  ReportProblem, History, AccessTime, TrendingUp,
  ThumbUp, VisibilityOff, Send, AttachFile, Close,
  CheckCircle, Warning, Error, Info, Person,
  ArrowUpward, Gavel, SupervisorAccount, AccountBalance,
  Search, Download, FilterList, ExpandMore, ExpandLess,
  NotificationsActive, Schedule, Assignment, FiberManualRecord,
  KeyboardArrowRight, Lock, Refresh, Chat, MoreVert,
  CalendarToday, Flag, Shield, HourglassEmpty
} from '@mui/icons-material';

/* ── Design tokens (light, clean) ── */
const T = {
  bg: "#F5F7FA",
  surface: "#FFFFFF",
  border: "#E4E8EF",
  accent: "#6366F1",
  accentLight: "#EEF2FF",
  success: "#10B981",
  successLight: "#ECFDF5",
  warning: "#F59E0B",
  warningLight: "#FFFBEB",
  danger: "#EF4444",
  dangerLight: "#FEF2F2",
  info: "#3B82F6",
  infoLight: "#EFF6FF",
  text: "#111827",
  textSub: "#4B5563",
  textMute: "#9CA3AF",
  purple: "#8B5CF6",
  purpleLight: "#F5F3FF",
};
 
const fHead = "Roboto, Helvetica, Arial, sans-serif";
const fBody = "Roboto, Helvetica, Arial, sans-serif";
const fMono = "Roboto, Helvetica, Arial, sans-serif";

const Fonts = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700&family=Nunito:wght@400;500;600;700&family=JetBrains+Mono:wght@500;600&display=swap');
    * { box-sizing: border-box; }
    @keyframes fadeUp { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:none} }
    @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.5} }
    .fade-up { animation: fadeUp 0.3s ease both; }
    .pulse { animation: pulse 2s infinite; }
  `}</style>
);

/* ── Escalation Matrix Config ── */
const ESCALATION_LEVELS = [
  {
    level: 1,
    title: "Department Head",
    role: "HOD",
    icon: Person,
    color: T.info,
    bg: T.infoLight,
    sla: 7,
    description: "Initial review and resolution attempt at department level.",
  },
  {
    level: 2,
    title: "Dean / Principal",
    role: "Dean",
    icon: SupervisorAccount,
    color: T.warning,
    bg: T.warningLight,
    sla: 10,
    description: "Escalated if HOD resolution is unsatisfactory or unresponsive.",
  },
  {
    level: 3,
    title: "Grievance Committee",
    role: "Committee",
    icon: Gavel,
    color: T.purple,
    bg: T.purpleLight,
    sla: 15,
    description: "Formal inquiry by the institutional grievance redressal committee.",
  },
  {
    level: 4,
    title: "Ombudsman / Governing Body",
    role: "Ombudsman",
    icon: AccountBalance,
    color: T.danger,
    bg: T.dangerLight,
    sla: 21,
    description: "Final authority. Used only when all prior levels fail to resolve.",
  },
];

const CATEGORIES = [
  "Pay & Compensation",
  "Workplace Harassment",
  "Workload & Scheduling",
  "Infrastructure & Facilities",
  "Promotion & Appraisal",
  "Leave Denial",
  "Contract & Bond Issues",
  "Discrimination",
  "Other",
];

const STATUS_MAP = {
  "Under Review":       { color: T.info,    bg: T.infoLight,    icon: HourglassEmpty },
  "Pending Escalation": { color: T.warning,  bg: T.warningLight, icon: TrendingUp     },
  "Escalated":          { color: T.purple,   bg: T.purpleLight,  icon: ArrowUpward    },
  "Resolved":           { color: T.success,  bg: T.successLight, icon: CheckCircle    },
  "Closed":             { color: T.textMute, bg: "#F3F4F6",      icon: CheckCircle    },
};

/* ── Mock Data ── */
const INITIAL_ACTIVE = {
  id: "GRV-2026-0041",
  subject: "Delay in salary increment post-appraisal cycle",
  category: "Pay & Compensation",
  date: "2026-02-01",
  slaDate: "2026-02-16",
  status: "Under Review",
  escalationLevel: 1,
  step: 1,
  isAnonymous: false,
  description: "Despite completing the appraisal cycle in December 2025, my increment letter has not been issued. I have already followed up with HR on 15-Jan and 28-Jan. No response.",
  timeline: [
    { date: "2026-02-01", event: "Grievance submitted", actor: "Faculty", type: "submit" },
    { date: "2026-02-02", event: "Assigned to Dept. Head (HOD - CSE)", actor: "System", type: "assign" },
    { date: "2026-02-05", event: "Acknowledged by HOD. Investigation started.", actor: "HOD", type: "update" },
  ],
  escalationHistory: [],
  attachments: [],
  comments: [
    { author: "HOD – Dr. P. Krishnan", text: "Forwarded to Finance department for pay revision details. Expecting response by Feb 12.", date: "2026-02-05", role: "HOD" },
  ],
};

const INITIAL_HISTORY = [
  {
    id: "GRV-2025-0018",
    subject: "Denial of Earned Leave during exam duty period",
    category: "Leave Denial",
    date: "2025-10-05",
    resolvedDate: "2025-10-22",
    status: "Resolved",
    isAnonymous: false,
    escalationLevel: 2,
    resolution: "Leave re-credited. HOD acknowledged procedural lapse. EL of 3 days added back to balance.",
    rating: 4,
    timeline: [
      { date: "2025-10-05", event: "Grievance submitted", actor: "Faculty", type: "submit" },
      { date: "2025-10-08", event: "HOD failed to respond within SLA", actor: "System", type: "escalate" },
      { date: "2025-10-09", event: "Escalated to Dean", actor: "Faculty", type: "escalate" },
      { date: "2025-10-14", event: "Dean reviewed and issued directive", actor: "Dean", type: "update" },
      { date: "2025-10-22", event: "Resolved — Leave re-credited", actor: "HR", type: "resolve" },
    ],
  },
  {
    id: "GRV-2025-0007",
    subject: "Workstation not allocated post-joining",
    category: "Infrastructure & Facilities",
    date: "2025-06-10",
    resolvedDate: "2025-06-20",
    status: "Resolved",
    isAnonymous: false,
    escalationLevel: 1,
    resolution: "IT department allocated a workstation and system within 5 working days per HOD directive.",
    rating: 5,
    timeline: [
      { date: "2025-06-10", event: "Grievance submitted", actor: "Faculty", type: "submit" },
      { date: "2025-06-11", event: "Assigned to HOD", actor: "System", type: "assign" },
      { date: "2025-06-20", event: "Resolved — Workstation allocated", actor: "IT Dept", type: "resolve" },
    ],
  },
];

/* ── Helper components ── */
const SLabel = ({ children, sx = {} }) => (
  <Typography sx={{ fontFamily: fBody, fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: T.textMute, mb: 0.6, ...sx }}>
    {children}
  </Typography>
);

const SCard = ({ children, sx = {}, ...p }) => (
  <Box sx={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: "14px", ...sx }} {...p}>
    {children}
  </Box>
);

const StatusBadge = ({ status }) => {
  const s = STATUS_MAP[status] || STATUS_MAP["Under Review"];
  const Icon = s.icon;
  return (
    <Box display="flex" alignItems="center" gap={0.6} sx={{ px: 1.2, py: 0.4, borderRadius: "99px", bgcolor: s.bg, width: "fit-content" }}>
      <Icon sx={{ fontSize: 12, color: s.color }} />
      <Typography sx={{ fontFamily: fBody, fontSize: "0.71rem", fontWeight: 700, color: s.color }}>{status}</Typography>
    </Box>
  );
};

const TimelineDot = ({ type }) => {
  const map = { submit: T.accent, assign: T.info, update: T.warning, escalate: T.danger, resolve: T.success };
  return <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: map[type] || T.textMute, flexShrink: 0, mt: "5px" }} />;
};

const EscalationBadge = ({ level }) => {
  const l = ESCALATION_LEVELS[level - 1];
  if (!l) return null;
  return (
    <Box display="flex" alignItems="center" gap={0.6} sx={{ px: 1, py: 0.3, borderRadius: "6px", bgcolor: l.bg, border: `1px solid ${l.color}30` }}>
      <Typography sx={{ fontFamily: fMono, fontSize: "0.65rem", fontWeight: 700, color: l.color }}>L{level}: {l.role}</Typography>
    </Box>
  );
};

/* ════════════════════════════
   MAIN COMPONENT
════════════════════════════ */
const GrievanceView = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [activeTicket, setActiveTicket] = useState(INITIAL_ACTIVE);
  const [history, setHistory] = useState(INITIAL_HISTORY);

  /* Form state */
  const [anonymous, setAnonymous] = useState(false);
  const [category, setCategory] = useState("");
  const [subject, setSubject] = useState("");
  const [desc, setDesc] = useState("");
  const [priority, setPriority] = useState("Normal");
  const [formError, setFormError] = useState("");

  /* UI state */
  const [escalateDialog, setEscalateDialog] = useState(false);
  const [escalateReason, setEscalateReason] = useState("");
  const [historyExpanded, setHistoryExpanded] = useState({});
  const [commentText, setCommentText] = useState("");
  const [searchQ, setSearchQ] = useState("");
  const [snack, setSnack] = useState({ open: false, msg: "", severity: "success" });
  const [successDialog, setSuccessDialog] = useState(false);
  const [newTicketId, setNewTicketId] = useState("");
  const [matrixOpen, setMatrixOpen] = useState(false);

  /* ── Submit new grievance ── */
  const handleSubmit = () => {
    if (!category || !subject || !desc) {
      setFormError("Please fill all required fields before submitting.");
      return;
    }
    setFormError("");
    const id = `GRV-2026-${String(Math.floor(Math.random() * 900) + 100)}`;
    setNewTicketId(id);
    setCategory(""); setSubject(""); setDesc(""); setAnonymous(false); setPriority("Normal");
    setSuccessDialog(true);
  };

  /* ── Escalate ── */
  const handleEscalate = () => {
    if (!escalateReason.trim()) {
      setSnack({ open: true, msg: "Please provide a reason for escalation.", severity: "error" });
      return;
    }
    const nextLevel = Math.min(activeTicket.escalationLevel + 1, 4);
    const nextLevelInfo = ESCALATION_LEVELS[nextLevel - 1];
    const now = new Date().toISOString().split("T")[0];
    const prevLevel = ESCALATION_LEVELS[activeTicket.escalationLevel - 1];

    setActiveTicket(prev => ({
      ...prev,
      escalationLevel: nextLevel,
      status: nextLevel === 4 ? "Escalated" : "Pending Escalation",
      step: Math.min(prev.step + 1, 3),
      timeline: [
        ...prev.timeline,
        {
          date: now,
          event: `Escalated from ${prevLevel.title} to ${nextLevelInfo.title}. Reason: "${escalateReason}"`,
          actor: "Faculty",
          type: "escalate"
        }
      ],
      escalationHistory: [
        ...prev.escalationHistory,
        { date: now, from: prevLevel.title, to: nextLevelInfo.title, reason: escalateReason }
      ]
    }));

    setEscalateReason("");
    setEscalateDialog(false);
    setSnack({ open: true, msg: `Escalated to ${nextLevelInfo.title}. SLA: ${nextLevelInfo.sla} days.`, severity: "warning" });
  };

  /* ── Add comment ── */
  const handleAddComment = () => {
    if (!commentText.trim()) return;
    setActiveTicket(prev => ({
      ...prev,
      comments: [...prev.comments, {
        author: "You (Faculty)",
        text: commentText,
        date: new Date().toISOString().split("T")[0],
        role: "Faculty"
      }]
    }));
    setCommentText("");
  };

  /* ── Rate history ── */
  const handleRate = (id, val) => {
    setHistory(prev => prev.map(h => h.id === id ? { ...h, rating: val } : h));
    setSnack({ open: true, msg: "Thank you for your feedback!", severity: "success" });
  };

  const currentLevelInfo = ESCALATION_LEVELS[activeTicket.escalationLevel - 1];
  const nextLevelInfo = ESCALATION_LEVELS[activeTicket.escalationLevel];
  const canEscalate = activeTicket.escalationLevel < 4 && activeTicket.status !== "Resolved" && activeTicket.status !== "Closed";
  const filteredHistory = history.filter(h => !searchQ || h.subject.toLowerCase().includes(searchQ.toLowerCase()) || h.category.toLowerCase().includes(searchQ.toLowerCase()));

  return (
    <Box sx={{ p: 3, bgcolor: T.bg, minHeight: "100vh", fontFamily: fBody }}>
      <Fonts />

      {/* ── Header ── */}
      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3}>
        <Box>
          <Typography sx={{ fontFamily: fHead, fontWeight: 700, fontSize: "1.5rem", color: T.text }}>
            Grievance Redressal Portal
          </Typography>
          <Typography sx={{ fontFamily: fBody, fontSize: "0.82rem", color: T.textSub, mt: 0.4 }}>
            Lodge complaints, track resolution, and escalate systematically through the institutional hierarchy.
          </Typography>
        </Box>
        <Box display="flex" gap={1.5}>
          <Button variant="outlined" size="small" onClick={() => setMatrixOpen(true)}
            startIcon={<Gavel sx={{ fontSize: 16 }} />}
            sx={{ fontFamily: fBody, fontWeight: 600, fontSize: "0.76rem", textTransform: "none", borderRadius: "8px", borderColor: T.border, color: T.textSub, "&:hover": { borderColor: T.accent, color: T.accent } }}>
            Escalation Matrix
          </Button>
          <Badge badgeContent={1} color="error">
            <IconButton size="small" sx={{ border: `1px solid ${T.border}`, borderRadius: "8px", bgcolor: T.surface }}>
              <NotificationsActive sx={{ fontSize: 18, color: T.textSub }} />
            </IconButton>
          </Badge>
        </Box>
      </Box>

      {/* ── Summary strip ── */}
      <Grid container spacing={2} mb={3}>
        {[
          { label: "Active Ticket",    value: "1",       sub: activeTicket.id,           color: T.accent,   icon: Assignment    },
          { label: "Escalation Level", value: `L${activeTicket.escalationLevel}`,  sub: currentLevelInfo.title, color: currentLevelInfo.color, icon: TrendingUp },
          { label: "Days Open",        value: "20",      sub: "SLA: 15 days policy",     color: T.danger,   icon: AccessTime    },
          { label: "Past Grievances",  value: history.length, sub: "All resolved",       color: T.success,  icon: CheckCircle   },
        ].map((s, i) => (
          <Grid item xs={6} md={3} key={i}>
            <SCard sx={{ p: 2.5 }} className="fade-up">
              <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                <Box>
                  <SLabel>{s.label}</SLabel>
                  <Typography sx={{ fontFamily: fMono, fontWeight: 700, fontSize: "1.6rem", color: s.color, lineHeight: 1.1 }}>{s.value}</Typography>
                  <Typography sx={{ fontFamily: fBody, fontSize: "0.7rem", color: T.textMute, mt: 0.3 }}>{s.sub}</Typography>
                </Box>
                <Box sx={{ p: 1, borderRadius: "10px", bgcolor: `${s.color}15`, color: s.color }}>
                  <s.icon sx={{ fontSize: 20 }} />
                </Box>
              </Box>
            </SCard>
          </Grid>
        ))}
      </Grid>

      {/* ── Tabs ── */}
      <SCard sx={{ overflow: "hidden" }}>
        <Box sx={{ borderBottom: `1px solid ${T.border}`, px: 3, bgcolor: "#FAFBFD" }}>
          <Tabs value={tabIndex} onChange={(_, v) => setTabIndex(v)}
            sx={{ "& .MuiTabs-indicator": { bgcolor: T.accent, height: 2.5, borderRadius: "2px 2px 0 0" }, "& .MuiTab-root": { fontFamily: fBody, fontWeight: 600, fontSize: "0.82rem", textTransform: "none", color: T.textMute, minHeight: 50, "&.Mui-selected": { color: T.accent } } }}>
            <Tab icon={<ReportProblem sx={{ fontSize: 16 }} />} iconPosition="start" label="Lodge & Track" />
            <Tab icon={<History sx={{ fontSize: 16 }} />} iconPosition="start" label={`My History (${history.length})`} />
          </Tabs>
        </Box>

        <Box p={3}>
          {/* ══════════════ TAB 0: LODGE & TRACK ══════════════ */}
          {tabIndex === 0 && (
            <Grid container spacing={3}>

              {/* LEFT: Form */}
              <Grid item xs={12} md={6}>
                <Typography sx={{ fontFamily: fHead, fontWeight: 700, fontSize: "1rem", color: T.text, mb: 0.5 }}>
                  Lodge New Complaint
                </Typography>
                <Typography sx={{ fontFamily: fBody, fontSize: "0.78rem", color: T.textMute, mb: 2.5 }}>
                  All submissions are strictly confidential and handled per institutional grievance policy.
                </Typography>

                {/* Anonymous toggle */}
                <Box sx={{ p: 2, borderRadius: "10px", bgcolor: anonymous ? "#F3F4F6" : T.surface, border: `1px solid ${anonymous ? T.border : T.border}`, mb: 2, transition: "background 0.25s" }}>
                  <FormControlLabel
                    control={<Switch checked={anonymous} onChange={e => setAnonymous(e.target.checked)} sx={{ "& .MuiSwitch-switchBase.Mui-checked": { color: T.accent }, "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { bgcolor: T.accent } }} />}
                    label={
                      <Box display="flex" alignItems="center" gap={1}>
                        <VisibilityOff sx={{ fontSize: 16, color: anonymous ? T.accent : T.textMute }} />
                        <Typography sx={{ fontFamily: fBody, fontWeight: 600, fontSize: "0.83rem", color: anonymous ? T.accent : T.text }}>Submit Anonymously</Typography>
                      </Box>
                    }
                  />
                  <Collapse in={anonymous}>
                    <Box mt={1} display="flex" alignItems="center" gap={1}>
                      <Lock sx={{ fontSize: 13, color: T.textMute }} />
                      <Typography sx={{ fontFamily: fBody, fontSize: "0.72rem", color: T.textMute }}>
                        Your Employee ID and Name will be hidden. Complaint routed directly to Ombudsman.
                      </Typography>
                    </Box>
                  </Collapse>
                </Box>

                {!anonymous && (
                  <TextField label="Faculty Name" defaultValue="Dr. Naveen Kumar" disabled variant="filled" fullWidth size="small"
                    sx={{ mb: 2, "& .MuiFilledInput-root": { borderRadius: "8px", fontFamily: fBody } }} />
                )}

                <Box display="flex" flexDirection="column" gap={2}>
                  <TextField select label="Grievance Category *" value={category} onChange={e => setCategory(e.target.value)} fullWidth size="small"
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px", fontFamily: fBody, "& fieldset": { borderColor: T.border }, "&.Mui-focused fieldset": { borderColor: T.accent } }, "& .MuiInputLabel-root.Mui-focused": { color: T.accent } }}>
                    {CATEGORIES.map(c => <MenuItem key={c} value={c} sx={{ fontFamily: fBody, fontSize: "0.82rem" }}>{c}</MenuItem>)}
                  </TextField>

                  <TextField select label="Priority" value={priority} onChange={e => setPriority(e.target.value)} fullWidth size="small"
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px", fontFamily: fBody, "& fieldset": { borderColor: T.border }, "&.Mui-focused fieldset": { borderColor: T.accent } }, "& .MuiInputLabel-root.Mui-focused": { color: T.accent } }}>
                    {["Normal", "High", "Urgent"].map(p => (
                      <MenuItem key={p} value={p} sx={{ fontFamily: fBody, fontSize: "0.82rem" }}>
                        <Box display="flex" alignItems="center" gap={1}>
                          <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: p === "Normal" ? T.success : p === "High" ? T.warning : T.danger }} />
                          {p}
                        </Box>
                      </MenuItem>
                    ))}
                  </TextField>

                  <TextField label="Subject *" value={subject} onChange={e => setSubject(e.target.value)} fullWidth size="small" placeholder="Brief one-line summary of the issue"
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px", fontFamily: fBody, "& fieldset": { borderColor: T.border }, "&.Mui-focused fieldset": { borderColor: T.accent } }, "& .MuiInputLabel-root.Mui-focused": { color: T.accent } }} />

                  <TextField label="Detailed Description *" multiline rows={4} value={desc} onChange={e => setDesc(e.target.value)} fullWidth size="small"
                    placeholder="Describe the incident clearly — include dates, people involved, prior attempts to resolve, and any supporting context."
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px", fontFamily: fBody, "& fieldset": { borderColor: T.border }, "&.Mui-focused fieldset": { borderColor: T.accent } }, "& .MuiInputLabel-root.Mui-focused": { color: T.accent } }} />

                  {formError && <Alert severity="error" sx={{ borderRadius: "8px", fontFamily: fBody, fontSize: "0.8rem" }}>{formError}</Alert>}

                  <Alert severity="info" icon={<Shield sx={{ fontSize: 16 }} />} sx={{ borderRadius: "8px", fontFamily: fBody, fontSize: "0.78rem", py: 0.5 }}>
                    Your submission is protected under the institutional grievance policy. Anonymous complaints bypass HOD and go directly to the Ombudsman.
                  </Alert>

                  <Button variant="contained" size="large" startIcon={<Send />} onClick={handleSubmit}
                    sx={{ fontFamily: fBody, fontWeight: 700, textTransform: "none", borderRadius: "10px", bgcolor: T.danger, boxShadow: "none", py: 1.3, "&:hover": { bgcolor: "#DC2626", boxShadow: "none" } }}>
                    Submit Grievance
                  </Button>
                </Box>
              </Grid>

              {/* RIGHT: Active Ticket Tracker */}
              <Grid item xs={12} md={6}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography sx={{ fontFamily: fHead, fontWeight: 700, fontSize: "1rem", color: T.text }}>Active Ticket Tracker</Typography>
                  <Box sx={{ px: 1.2, py: 0.4, borderRadius: "8px", bgcolor: T.accentLight }}>
                    <Typography sx={{ fontFamily: fMono, fontSize: "0.72rem", fontWeight: 700, color: T.accent }}>{activeTicket.id}</Typography>
                  </Box>
                </Box>

                {/* Status + category row */}
                <Box display="flex" gap={1} mb={2} flexWrap="wrap">
                  <StatusBadge status={activeTicket.status} />
                  <EscalationBadge level={activeTicket.escalationLevel} />
                  <Box sx={{ px: 1.2, py: 0.4, borderRadius: "99px", bgcolor: priority === "Urgent" ? T.dangerLight : priority === "High" ? T.warningLight : T.successLight }}>
                    <Typography sx={{ fontFamily: fBody, fontSize: "0.71rem", fontWeight: 700, color: priority === "Urgent" ? T.danger : priority === "High" ? T.warning : T.success }}>Normal Priority</Typography>
                  </Box>
                </Box>

                <Typography sx={{ fontFamily: fBody, fontWeight: 700, fontSize: "0.95rem", color: T.text, mb: 0.5 }}>{activeTicket.subject}</Typography>
                <Typography sx={{ fontFamily: fBody, fontSize: "0.77rem", color: T.textMute, mb: 2.5 }}>
                  <CalendarToday sx={{ fontSize: 12, mr: 0.4, verticalAlign: "middle" }} />
                  Submitted: {activeTicket.date} &nbsp;·&nbsp; SLA Deadline: <strong style={{ color: T.danger }}>{activeTicket.slaDate}</strong>
                </Typography>

                {/* Escalation path visual */}
                <SLabel sx={{ mb: 1.5 }}>Escalation Path</SLabel>
                <Box sx={{ p: 2, borderRadius: "10px", bgcolor: "#F9FAFB", border: `1px solid ${T.border}`, mb: 2.5 }}>
                  <Box display="flex" alignItems="center" gap={0}>
                    {ESCALATION_LEVELS.map((lv, i) => {
                      const isActive = lv.level === activeTicket.escalationLevel;
                      const isPast = lv.level < activeTicket.escalationLevel;
                      return (
                        <React.Fragment key={lv.level}>
                          <Tooltip title={lv.title} placement="top">
                            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1 }}>
                              <Box sx={{
                                width: 36, height: 36, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                                bgcolor: isPast ? T.success : isActive ? lv.color : T.border,
                                color: isPast || isActive ? "#fff" : T.textMute,
                                border: isActive ? `3px solid ${lv.color}` : "none",
                                boxShadow: isActive ? `0 0 0 4px ${lv.color}25` : "none",
                                transition: "all 0.2s",
                              }}>
                                {isPast ? <CheckCircle sx={{ fontSize: 18 }} /> : <lv.icon sx={{ fontSize: 17 }} />}
                              </Box>
                              <Typography sx={{ fontFamily: fBody, fontSize: "0.6rem", fontWeight: 600, color: isActive ? lv.color : T.textMute, mt: 0.5, textAlign: "center", lineHeight: 1.2 }}>
                                {lv.role}
                              </Typography>
                            </Box>
                          </Tooltip>
                          {i < ESCALATION_LEVELS.length - 1 && (
                            <Box sx={{ flex: 0.3, height: 2, bgcolor: isPast ? T.success : T.border, transition: "background 0.3s", mt: "-14px" }} />
                          )}
                        </React.Fragment>
                      );
                    })}
                  </Box>
                  <Typography sx={{ fontFamily: fBody, fontSize: "0.72rem", color: T.textMute, textAlign: "center", mt: 1.5 }}>
                    Currently with: <strong style={{ color: currentLevelInfo.color }}>{currentLevelInfo.title}</strong> · SLA: {currentLevelInfo.sla} days
                  </Typography>
                </Box>

                {/* Progress stepper */}
                <SLabel sx={{ mb: 1.5 }}>Resolution Progress</SLabel>
                <Stepper activeStep={activeTicket.step} orientation="vertical"
                  sx={{ mb: 2.5, "& .MuiStepIcon-root.Mui-active": { color: T.accent }, "& .MuiStepIcon-root.Mui-completed": { color: T.success } }}>
                  <Step><StepLabel sx={{ "& .MuiStepLabel-label": { fontFamily: fBody, fontSize: "0.8rem", fontWeight: 600 } }}>Submitted ({activeTicket.date})</StepLabel></Step>
                  <Step><StepLabel sx={{ "& .MuiStepLabel-label": { fontFamily: fBody, fontSize: "0.8rem", fontWeight: 600 } }}>Under Review — {currentLevelInfo.title}</StepLabel></Step>
                  <Step><StepLabel sx={{ "& .MuiStepLabel-label": { fontFamily: fBody, fontSize: "0.8rem", fontWeight: 600 } }}>Resolution Proposed</StepLabel></Step>
                  <Step><StepLabel sx={{ "& .MuiStepLabel-label": { fontFamily: fBody, fontSize: "0.8rem", fontWeight: 600 } }}>Closed</StepLabel></Step>
                </Stepper>

                {/* Timeline */}
                <SLabel sx={{ mb: 1.5 }}>Activity Timeline</SLabel>
                <Box sx={{ maxHeight: 160, overflowY: "auto", pr: 1, mb: 2.5 }}>
                  {[...activeTicket.timeline].reverse().map((t, i) => (
                    <Box key={i} display="flex" gap={1.5} mb={1.5}>
                      <TimelineDot type={t.type} />
                      <Box>
                        <Typography sx={{ fontFamily: fBody, fontSize: "0.76rem", color: T.text, lineHeight: 1.4 }}>{t.event}</Typography>
                        <Typography sx={{ fontFamily: fMono, fontSize: "0.66rem", color: T.textMute }}>{t.date} · {t.actor}</Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>

                {/* Comments */}
                <SLabel sx={{ mb: 1.5 }}>Communication Thread</SLabel>
                <Box sx={{ maxHeight: 140, overflowY: "auto", mb: 1.5 }}>
                  {activeTicket.comments.map((c, i) => (
                    <Box key={i} sx={{ p: 1.5, mb: 1, borderRadius: "8px", bgcolor: c.role === "Faculty" ? T.accentLight : "#F3F4F6", border: `1px solid ${c.role === "Faculty" ? T.accent + "30" : T.border}` }}>
                      <Box display="flex" justifyContent="space-between" mb={0.3}>
                        <Typography sx={{ fontFamily: fBody, fontSize: "0.71rem", fontWeight: 700, color: c.role === "Faculty" ? T.accent : T.textSub }}>{c.author}</Typography>
                        <Typography sx={{ fontFamily: fMono, fontSize: "0.65rem", color: T.textMute }}>{c.date}</Typography>
                      </Box>
                      <Typography sx={{ fontFamily: fBody, fontSize: "0.76rem", color: T.textSub }}>{c.text}</Typography>
                    </Box>
                  ))}
                </Box>
                <Box display="flex" gap={1}>
                  <TextField size="small" fullWidth placeholder="Add a comment or follow-up..." value={commentText} onChange={e => setCommentText(e.target.value)}
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px", fontFamily: fBody, fontSize: "0.8rem", "& fieldset": { borderColor: T.border }, "&.Mui-focused fieldset": { borderColor: T.accent } } }} />
                  <IconButton onClick={handleAddComment} sx={{ bgcolor: T.accent, color: "#fff", borderRadius: "8px", "&:hover": { bgcolor: "#4F46E5" }, flexShrink: 0 }}>
                    <Send sx={{ fontSize: 16 }} />
                  </IconButton>
                </Box>

                {/* Escalate CTA */}
                <Divider sx={{ my: 2.5, borderColor: T.border }} />
                <Box sx={{ p: 2, borderRadius: "10px", border: `1px solid ${canEscalate ? T.warning + "50" : T.border}`, bgcolor: canEscalate ? T.warningLight : "#F9FAFB" }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                    <Typography sx={{ fontFamily: fBody, fontWeight: 700, fontSize: "0.82rem", color: canEscalate ? T.warning : T.textMute }}>
                      <TrendingUp sx={{ fontSize: 14, mr: 0.5, verticalAlign: "middle" }} />
                      Escalation Controls
                    </Typography>
                    {canEscalate && nextLevelInfo && (
                      <Typography sx={{ fontFamily: fMono, fontSize: "0.68rem", color: T.textMute }}>→ {nextLevelInfo.title}</Typography>
                    )}
                  </Box>
                  {canEscalate ? (
                    <>
                      <Typography sx={{ fontFamily: fBody, fontSize: "0.74rem", color: T.textSub, mb: 1.5, lineHeight: 1.5 }}>
                        If the current authority ({currentLevelInfo.title}) has not responded within the SLA of <strong>{currentLevelInfo.sla} days</strong>, you may escalate to {nextLevelInfo?.title}.
                      </Typography>
                      <Button variant="contained" fullWidth startIcon={<ArrowUpward />} onClick={() => setEscalateDialog(true)}
                        sx={{ fontFamily: fBody, fontWeight: 700, fontSize: "0.8rem", textTransform: "none", borderRadius: "8px", bgcolor: T.warning, boxShadow: "none", color: "#fff", "&:hover": { bgcolor: "#D97706", boxShadow: "none" } }}>
                        Escalate to {nextLevelInfo?.title}
                      </Button>
                    </>
                  ) : (
                    <Typography sx={{ fontFamily: fBody, fontSize: "0.74rem", color: T.textMute }}>
                      {activeTicket.escalationLevel === 4
                        ? "This ticket is at the highest escalation level (Ombudsman)."
                        : "Ticket is resolved or closed. Escalation is not available."}
                    </Typography>
                  )}
                </Box>
              </Grid>
            </Grid>
          )}

          {/* ══════════════ TAB 1: HISTORY ══════════════ */}
          {tabIndex === 1 && (
            <Box className="fade-up">
              <Box display="flex" gap={2} mb={3} alignItems="center">
                <TextField size="small" placeholder="Search by subject or category..." value={searchQ} onChange={e => setSearchQ(e.target.value)}
                  InputProps={{ startAdornment: <InputAdornment position="start"><Search sx={{ fontSize: 16, color: T.textMute }} /></InputAdornment> }}
                  sx={{ width: 280, "& .MuiOutlinedInput-root": { borderRadius: "8px", fontFamily: fBody, fontSize: "0.82rem", "& fieldset": { borderColor: T.border }, "&.Mui-focused fieldset": { borderColor: T.accent } } }} />
                <Typography sx={{ fontFamily: fBody, fontSize: "0.78rem", color: T.textMute, ml: "auto" }}>
                  {filteredHistory.length} record{filteredHistory.length !== 1 ? "s" : ""}
                </Typography>
              </Box>

              {filteredHistory.length === 0 && (
                <Box textAlign="center" py={6}>
                  <ThumbUp sx={{ fontSize: 56, color: T.border, mb: 2 }} />
                  <Typography sx={{ fontFamily: fBody, color: T.textMute }}>No past grievances found.</Typography>
                </Box>
              )}

              <Stack spacing={2}>
                {filteredHistory.map((ticket) => (
                  <SCard key={ticket.id} sx={{ overflow: "hidden" }}>
                    {/* Card Header */}
                    <Box sx={{ p: 2.5, cursor: "pointer" }} onClick={() => setHistoryExpanded(prev => ({ ...prev, [ticket.id]: !prev[ticket.id] }))}>
                      <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                        <Box flex={1} mr={2}>
                          <Box display="flex" alignItems="center" gap={1.5} mb={1} flexWrap="wrap">
                            <Typography sx={{ fontFamily: fBody, fontWeight: 700, fontSize: "0.9rem", color: T.text }}>{ticket.subject}</Typography>
                            <StatusBadge status={ticket.status} />
                            {ticket.isAnonymous && (
                              <Box display="flex" alignItems="center" gap={0.4} sx={{ px: 1, py: 0.3, borderRadius: "6px", bgcolor: "#F3F4F6" }}>
                                <VisibilityOff sx={{ fontSize: 11, color: T.textMute }} />
                                <Typography sx={{ fontFamily: fBody, fontSize: "0.65rem", color: T.textMute, fontWeight: 600 }}>Anonymous</Typography>
                              </Box>
                            )}
                          </Box>
                          <Box display="flex" gap={2} flexWrap="wrap">
                            <Typography sx={{ fontFamily: fMono, fontSize: "0.7rem", color: T.textMute }}>{ticket.id}</Typography>
                            <Typography sx={{ fontFamily: fBody, fontSize: "0.72rem", color: T.textMute }}>Submitted: {ticket.date}</Typography>
                            <Typography sx={{ fontFamily: fBody, fontSize: "0.72rem", color: T.textMute }}>Resolved: {ticket.resolvedDate}</Typography>
                            <Typography sx={{ fontFamily: fBody, fontSize: "0.72rem", color: T.textMute }}>{ticket.category}</Typography>
                            <EscalationBadge level={ticket.escalationLevel} />
                          </Box>
                        </Box>
                        <IconButton size="small" sx={{ color: T.textMute }}>
                          {historyExpanded[ticket.id] ? <ExpandLess /> : <ExpandMore />}
                        </IconButton>
                      </Box>
                    </Box>

                    <Collapse in={historyExpanded[ticket.id]}>
                      <Divider sx={{ borderColor: T.border }} />
                      <Box sx={{ p: 2.5 }}>
                        <Grid container spacing={3}>
                          <Grid item xs={12} md={7}>
                            {/* Resolution */}
                            <SLabel sx={{ mb: 1 }}>Resolution Summary</SLabel>
                            <Box sx={{ p: 1.5, borderRadius: "8px", bgcolor: T.successLight, border: `1px solid ${T.success}30`, mb: 2.5 }}>
                              <Typography sx={{ fontFamily: fBody, fontSize: "0.8rem", color: "#065F46" }}>{ticket.resolution}</Typography>
                            </Box>

                            {/* Timeline */}
                            <SLabel sx={{ mb: 1 }}>Timeline</SLabel>
                            {ticket.timeline.map((t, i) => (
                              <Box key={i} display="flex" gap={1.5} mb={1.2}>
                                <TimelineDot type={t.type} />
                                <Box>
                                  <Typography sx={{ fontFamily: fBody, fontSize: "0.75rem", color: T.text }}>{t.event}</Typography>
                                  <Typography sx={{ fontFamily: fMono, fontSize: "0.65rem", color: T.textMute }}>{t.date} · {t.actor}</Typography>
                                </Box>
                              </Box>
                            ))}
                          </Grid>

                          <Grid item xs={12} md={5}>
                            {/* Rating */}
                            <SLabel sx={{ mb: 1 }}>Rate Resolution Quality</SLabel>
                            <Box sx={{ p: 2, borderRadius: "10px", border: `1px solid ${T.border}`, bgcolor: "#FAFBFD", textAlign: "center" }}>
                              <Rating value={ticket.rating} onChange={(_, v) => handleRate(ticket.id, v)} size="large"
                                sx={{ "& .MuiRating-iconFilled": { color: T.warning }, mb: 1 }} />
                              {ticket.rating > 0 && (
                                <Typography sx={{ fontFamily: fBody, fontSize: "0.75rem", color: T.success, fontWeight: 700 }}>
                                  ✓ Feedback recorded
                                </Typography>
                              )}
                              {!ticket.rating && (
                                <Typography sx={{ fontFamily: fBody, fontSize: "0.74rem", color: T.textMute }}>
                                  How satisfied are you with the resolution?
                                </Typography>
                              )}
                            </Box>

                            {/* Download */}
                            <Button fullWidth variant="outlined" startIcon={<Download />} size="small"
                              onClick={() => setSnack({ open: true, msg: `Downloading resolution report for ${ticket.id}...`, severity: "info" })}
                              sx={{ mt: 2, fontFamily: fBody, fontWeight: 600, fontSize: "0.76rem", textTransform: "none", borderRadius: "8px", borderColor: T.border, color: T.textSub, "&:hover": { borderColor: T.accent, color: T.accent } }}>
                              Download Resolution Report
                            </Button>
                          </Grid>
                        </Grid>
                      </Box>
                    </Collapse>
                  </SCard>
                ))}
              </Stack>
            </Box>
          )}
        </Box>
      </SCard>

      {/* ══════════════════════════════════════
          ESCALATION DIALOG
      ══════════════════════════════════════ */}
      <Dialog open={escalateDialog} onClose={() => setEscalateDialog(false)} maxWidth="sm" fullWidth
        PaperProps={{ sx: { borderRadius: "16px", border: `1px solid ${T.border}` } }}>
        <DialogTitle sx={{ fontFamily: fHead, fontWeight: 700, fontSize: "1rem", color: T.text, borderBottom: `1px solid ${T.border}`, pb: 2, bgcolor: "#FAFBFD" }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            Confirm Escalation
            <IconButton size="small" onClick={() => setEscalateDialog(false)} sx={{ bgcolor: "#F3F4F6", borderRadius: "8px" }}><Close fontSize="small" /></IconButton>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ pt: 3, px: 3 }}>
          {/* From → To visual */}
          <Box display="flex" alignItems="center" gap={2} mb={3}>
            <Box sx={{ flex: 1, p: 2, borderRadius: "10px", border: `2px solid ${currentLevelInfo.color}40`, bgcolor: currentLevelInfo.bg, textAlign: "center" }}>
              <currentLevelInfo.icon sx={{ fontSize: 28, color: currentLevelInfo.color, mb: 0.5 }} />
              <Typography sx={{ fontFamily: fBody, fontWeight: 700, fontSize: "0.78rem", color: currentLevelInfo.color }}>{currentLevelInfo.title}</Typography>
              <Typography sx={{ fontFamily: fBody, fontSize: "0.68rem", color: T.textMute }}>Current Handler</Typography>
            </Box>
            <ArrowUpward sx={{ color: T.warning, fontSize: 28, flexShrink: 0 }} />
            {nextLevelInfo && (
              <Box sx={{ flex: 1, p: 2, borderRadius: "10px", border: `2px solid ${nextLevelInfo.color}60`, bgcolor: nextLevelInfo.bg, textAlign: "center" }}>
                <nextLevelInfo.icon sx={{ fontSize: 28, color: nextLevelInfo.color, mb: 0.5 }} />
                <Typography sx={{ fontFamily: fBody, fontWeight: 700, fontSize: "0.78rem", color: nextLevelInfo.color }}>{nextLevelInfo.title}</Typography>
                <Typography sx={{ fontFamily: fBody, fontSize: "0.68rem", color: T.textMute }}>New Handler</Typography>
              </Box>
            )}
          </Box>

          <Alert severity="warning" sx={{ mb: 2.5, borderRadius: "8px", fontFamily: fBody, fontSize: "0.78rem" }}>
            Escalation is a formal step. Please escalate only if the current handler ({currentLevelInfo.title}) has exceeded the SLA of <strong>{currentLevelInfo.sla} days</strong> or provided an unsatisfactory response.
          </Alert>

          <SLabel sx={{ mb: 0.8 }}>Reason for Escalation *</SLabel>
          <TextField fullWidth multiline rows={3} size="small" value={escalateReason} onChange={e => setEscalateReason(e.target.value)}
            placeholder="State clearly why you are escalating — e.g., 'No response from HOD after 10 days despite 2 follow-ups on Feb 5 and Feb 10.'"
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px", fontFamily: fBody, "& fieldset": { borderColor: T.border }, "&.Mui-focused fieldset": { borderColor: T.warning } } }} />

          {nextLevelInfo && (
            <Box mt={2} sx={{ p: 1.5, borderRadius: "8px", bgcolor: "#F9FAFB", border: `1px solid ${T.border}` }}>
              <Typography sx={{ fontFamily: fBody, fontSize: "0.74rem", color: T.textSub }}>
                <strong>New SLA:</strong> {nextLevelInfo.sla} days &nbsp;·&nbsp; <strong>Handler:</strong> {nextLevelInfo.title} &nbsp;·&nbsp; <strong>Role:</strong> {nextLevelInfo.description}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, borderTop: `1px solid ${T.border}`, pt: 2, bgcolor: "#FAFBFD", gap: 1 }}>
          <Button onClick={() => setEscalateDialog(false)} variant="outlined"
            sx={{ fontFamily: fBody, fontWeight: 600, fontSize: "0.8rem", textTransform: "none", borderRadius: "8px", borderColor: T.border, color: T.textSub }}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleEscalate} startIcon={<ArrowUpward />}
            sx={{ fontFamily: fBody, fontWeight: 700, fontSize: "0.8rem", textTransform: "none", borderRadius: "8px", bgcolor: T.warning, boxShadow: "none", color: "#fff", "&:hover": { bgcolor: "#D97706", boxShadow: "none" } }}>
            Confirm Escalation
          </Button>
        </DialogActions>
      </Dialog>

      {/* ══════════════════════════════════════
          ESCALATION MATRIX INFO DIALOG
      ══════════════════════════════════════ */}
      <Dialog open={matrixOpen} onClose={() => setMatrixOpen(false)} maxWidth="sm" fullWidth
        PaperProps={{ sx: { borderRadius: "16px", border: `1px solid ${T.border}` } }}>
        <DialogTitle sx={{ fontFamily: fHead, fontWeight: 700, borderBottom: `1px solid ${T.border}`, bgcolor: "#FAFBFD", pb: 2 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            Institutional Escalation Matrix
            <IconButton size="small" onClick={() => setMatrixOpen(false)} sx={{ bgcolor: "#F3F4F6", borderRadius: "8px" }}><Close fontSize="small" /></IconButton>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ pt: 3, px: 3, pb: 3 }}>
          <Typography sx={{ fontFamily: fBody, fontSize: "0.78rem", color: T.textMute, mb: 3 }}>
            All grievances follow this structured escalation path. Each level has a defined SLA. Escalate only after the current level's SLA is exhausted or response is unsatisfactory.
          </Typography>
          <Stack spacing={2}>
            {ESCALATION_LEVELS.map((lv, i) => (
              <Box key={lv.level} sx={{ p: 2.5, borderRadius: "12px", border: `1.5px solid ${lv.color}40`, bgcolor: lv.bg }}>
                <Box display="flex" alignItems="center" gap={2}>
                  <Box sx={{ width: 40, height: 40, borderRadius: "10px", bgcolor: lv.color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <lv.icon sx={{ fontSize: 20, color: "#fff" }} />
                  </Box>
                  <Box flex={1}>
                    <Box display="flex" alignItems="center" gap={1} mb={0.3}>
                      <Box sx={{ px: 0.8, py: 0.2, borderRadius: "4px", bgcolor: lv.color, display: "inline-block" }}>
                        <Typography sx={{ fontFamily: fMono, fontSize: "0.62rem", fontWeight: 700, color: "#fff" }}>Level {lv.level}</Typography>
                      </Box>
                      <Typography sx={{ fontFamily: fBody, fontWeight: 700, fontSize: "0.88rem", color: T.text }}>{lv.title}</Typography>
                      <Box ml="auto" sx={{ px: 1, py: 0.3, borderRadius: "6px", bgcolor: T.surface, border: `1px solid ${T.border}` }}>
                        <Typography sx={{ fontFamily: fMono, fontSize: "0.68rem", fontWeight: 600, color: T.textSub }}>SLA: {lv.sla}d</Typography>
                      </Box>
                    </Box>
                    <Typography sx={{ fontFamily: fBody, fontSize: "0.74rem", color: T.textSub }}>{lv.description}</Typography>
                  </Box>
                </Box>
                {i < ESCALATION_LEVELS.length - 1 && (
                  <Box display="flex" alignItems="center" gap={1} mt={1.5} pl={6.5}>
                    <Box sx={{ width: 1, height: 16, bgcolor: `${lv.color}60`, ml: 0 }} />
                    <Typography sx={{ fontFamily: fBody, fontSize: "0.68rem", color: T.textMute }}>↓ escalate if unresolved</Typography>
                  </Box>
                )}
              </Box>
            ))}
          </Stack>
        </DialogContent>
      </Dialog>

      {/* ══════════════════════════════════════
          SUCCESS DIALOG (after submit)
      ══════════════════════════════════════ */}
      <Dialog open={successDialog} onClose={() => setSuccessDialog(false)} maxWidth="xs" fullWidth
        PaperProps={{ sx: { borderRadius: "16px", border: `1px solid ${T.border}` } }}>
        <DialogContent sx={{ textAlign: "center", py: 5, px: 4 }}>
          <Box sx={{ display: "inline-flex", p: 2, borderRadius: "50%", bgcolor: T.successLight, mb: 2 }}>
            <CheckCircle sx={{ fontSize: 48, color: T.success }} />
          </Box>
          <Typography sx={{ fontFamily: fHead, fontWeight: 700, fontSize: "1.1rem", color: T.text, mb: 1 }}>Grievance Submitted</Typography>
          <Typography sx={{ fontFamily: fBody, fontSize: "0.8rem", color: T.textMute, mb: 2.5 }}>
            Your grievance has been logged and assigned to the Department Head (Level 1).
          </Typography>
          <Box sx={{ p: 2, borderRadius: "10px", bgcolor: T.accentLight, mb: 3 }}>
            <Typography sx={{ fontFamily: fMono, fontWeight: 700, fontSize: "1.1rem", color: T.accent }}>{newTicketId}</Typography>
            <Typography sx={{ fontFamily: fBody, fontSize: "0.72rem", color: T.textMute, mt: 0.3 }}>Save this ID for tracking</Typography>
          </Box>
          <Button variant="contained" fullWidth onClick={() => setSuccessDialog(false)}
            sx={{ fontFamily: fBody, fontWeight: 700, textTransform: "none", borderRadius: "10px", bgcolor: T.success, boxShadow: "none", "&:hover": { bgcolor: "#059669", boxShadow: "none" } }}>
            Track My Ticket
          </Button>
        </DialogContent>
      </Dialog>

      {/* Snackbar */}
      <Snackbar open={snack.open} autoHideDuration={4000} onClose={() => setSnack(s => ({ ...s, open: false }))} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <Alert severity={snack.severity} sx={{ borderRadius: "10px", fontWeight: 600, fontFamily: fBody }} onClose={() => setSnack(s => ({ ...s, open: false }))}>
          {snack.msg}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default GrievanceView;