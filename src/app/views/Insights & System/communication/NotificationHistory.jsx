import React, { useState, useMemo } from "react";
import {
    Box, Grid, Typography, Button, TextField, MenuItem, IconButton,
    Table, TableBody, TableCell, TableHead, TableRow,
    Tooltip, Snackbar, Alert, Chip, InputAdornment,
    Dialog, DialogTitle, DialogContent, DialogActions,
    FormControl, InputLabel, Select, Divider, Switch
} from "@mui/material";
import {
    Search, FilterAlt, Download, Refresh, Visibility, Delete,
    NotificationsActive, Campaign, Email, Sms, PhoneIphone,
    WhatsApp, DoneAll, Warning, ErrorOutline, Schedule,
    CheckCircle, Cancel, TrendingUp, MarkEmailRead,
    Info, Send, Close, ExpandMore, ExpandLess,
    AccessTime, Person, Group, Business
} from "@mui/icons-material";

/* ═════════════ DESIGN TOKENS ═════════════ */
const T = {
    bg: "#F5F7FA", surface: "#FFFFFF", border: "#E4E8EF",
    accent: "#6366F1", accentLight: "#EEF2FF",
    success: "#10B981", successLight: "#ECFDF5",
    warning: "#F59E0B", warningLight: "#FFFBEB",
    danger: "#EF4444", dangerLight: "#FEF2F2",
    purple: "#7C3AED", purpleLight: "#F5F3FF",
    teal: "#14B8A6", tealLight: "#F0FDFA",
    cyan: "#0891B2", cyanLight: "#ECFEFF",
    green: "#059669", greenLight: "#D1FAE5",
    text: "#111827", textSub: "#4B5563", textMute: "#9CA3AF",
};
const fH = "Roboto, Helvetica, Arial, sans-serif";
const fB = "Roboto, Helvetica, Arial, sans-serif";
const fM = "Roboto, Helvetica, Arial, sans-serif";

/* ═════════════ NOTIFICATION LOG DATA ═════════════ */
const NOTIFICATION_LOG = [
    { id: 1, title: "PBAS Submission Deadline Extended", type: "Campaign", channel: "Email", target: "All Faculty", sender: "Admin", date: "2026-04-12 09:30", status: "Delivered", recipients: 142, delivered: 140, read: 112, failed: 2, priority: "High", category: "Academic" },
    { id: 2, title: "Server Maintenance — April 15", type: "System Alert", channel: "App", target: "All Users", sender: "System", date: "2026-04-12 08:00", status: "Delivered", recipients: 450, delivered: 448, read: 320, failed: 2, priority: "Critical", category: "IT" },
    { id: 3, title: "Salary Slip — March 2026", type: "Auto-Alert", channel: "Email", target: "Individual Faculty", sender: "Payroll Bot", date: "2026-04-10 14:15", status: "Delivered", recipients: 142, delivered: 142, read: 138, failed: 0, priority: "Normal", category: "Finance" },
    { id: 4, title: "Weekly Faculty Meeting Reminder", type: "Recurring", channel: "Email", target: "HODs", sender: "Admin", date: "2026-04-10 07:00", status: "Delivered", recipients: 8, delivered: 8, read: 8, failed: 0, priority: "Normal", category: "Administrative" },
    { id: 5, title: "Hostel Curfew Time Change Notice", type: "Campaign", channel: "SMS", target: "All Students", sender: "Hostel Warden", date: "2026-04-09 18:30", status: "Delivered", recipients: 920, delivered: 915, read: 0, failed: 5, priority: "High", category: "CIMS" },
    { id: 6, title: "Parking Pass Renewal Reminder", type: "Auto-Alert", channel: "App", target: "Pass Holders", sender: "Parking Bot", date: "2026-04-09 10:00", status: "Delivered", recipients: 340, delivered: 338, read: 210, failed: 2, priority: "Normal", category: "CIMS" },
    { id: 7, title: "Bus Route 3 — Delay Alert", type: "System Alert", channel: "SMS", target: "Route 3 Students", sender: "Transport Bot", date: "2026-04-08 07:45", status: "Delivered", recipients: 45, delivered: 44, read: 0, failed: 1, priority: "High", category: "CIMS" },
    { id: 8, title: "Grant Application Deadline", type: "Campaign", channel: "Email", target: "Research Faculty", sender: "Admin", date: "2026-04-07 11:00", status: "Delivered", recipients: 58, delivered: 57, read: 42, failed: 1, priority: "Normal", category: "Academic" },
    { id: 9, title: "Fire Drill — Building A", type: "System Alert", channel: "WhatsApp", target: "Building A Staff", sender: "Safety Bot", date: "2026-04-07 09:00", status: "Delivered", recipients: 85, delivered: 83, read: 80, failed: 2, priority: "Critical", category: "Safety" },
    { id: 10, title: "Probation Period Ending — 3 Faculty", type: "Auto-Alert", channel: "Email", target: "HR Head + Faculty", sender: "HR Bot", date: "2026-04-06 16:00", status: "Delivered", recipients: 4, delivered: 4, read: 4, failed: 0, priority: "High", category: "HR" },
    { id: 11, title: "Leave Balance Warning", type: "Auto-Alert", channel: "App", target: "12 Faculty Members", sender: "Leave Bot", date: "2026-04-05 08:30", status: "Delivered", recipients: 12, delivered: 12, read: 10, failed: 0, priority: "Normal", category: "HR" },
    { id: 12, title: "Committee Formation — NAAC Visit", type: "Campaign", channel: "Email", target: "Selected Faculty", sender: "Admin", date: "2026-04-04 13:00", status: "Delivered", recipients: 25, delivered: 25, read: 22, failed: 0, priority: "High", category: "Academic" },
    { id: 13, title: "Maintenance Work — Lab Block B", type: "System Alert", channel: "App", target: "Lab Block B Users", sender: "Maint. Bot", date: "2026-04-03 06:30", status: "Delivered", recipients: 60, delivered: 59, read: 45, failed: 1, priority: "Normal", category: "CIMS" },
    { id: 14, title: "Asset Verification Cycle Starting", type: "Auto-Alert", channel: "Email", target: "All Faculty", sender: "Asset Bot", date: "2026-04-02 09:00", status: "Delivered", recipients: 142, delivered: 140, read: 95, failed: 2, priority: "Normal", category: "Administrative" },
    { id: 15, title: "Exam Invigilation Schedule Published", type: "Campaign", channel: "Email", target: "CSE & ECE Faculty", sender: "Admin", date: "2026-04-01 10:30", status: "Delivered", recipients: 83, delivered: 82, read: 75, failed: 1, priority: "High", category: "Academic" },
    { id: 16, title: "Emergency: Water Supply Disruption", type: "System Alert", channel: "SMS", target: "All Campus", sender: "System", date: "2026-03-30 15:00", status: "Delivered", recipients: 1200, delivered: 1190, read: 0, failed: 10, priority: "Critical", category: "Safety" },
    { id: 17, title: "Faculty FDP Registration Open", type: "Campaign", channel: "WhatsApp", target: "All Faculty", sender: "Admin", date: "2026-03-28 12:00", status: "Failed", recipients: 142, delivered: 0, read: 0, failed: 142, priority: "Normal", category: "Academic" },
    { id: 18, title: "Mess Menu Updated — April", type: "Auto-Alert", channel: "App", target: "Hostel Students", sender: "Mess Bot", date: "2026-03-28 08:00", status: "Delivered", recipients: 920, delivered: 918, read: 650, failed: 2, priority: "Normal", category: "CIMS" },
    { id: 19, title: "Scheduled: Semester Results Notice", type: "Campaign", channel: "Email", target: "All Faculty", sender: "Admin", date: "2026-04-15 10:00", status: "Scheduled", recipients: 142, delivered: 0, read: 0, failed: 0, priority: "High", category: "Academic" },
    { id: 20, title: "Bus Pass Expiry Warning", type: "Auto-Alert", channel: "App", target: "28 Students", sender: "Transport Bot", date: "2026-03-25 09:00", status: "Delivered", recipients: 28, delivered: 28, read: 22, failed: 0, priority: "Normal", category: "CIMS" },
];

const STATUS_MAP = {
    Delivered: { color: T.success, bg: T.successLight, Icon: CheckCircle },
    Scheduled: { color: T.warning, bg: T.warningLight, Icon: Schedule },
    Failed: { color: T.danger, bg: T.dangerLight, Icon: ErrorOutline },
    Partial: { color: T.warning, bg: T.warningLight, Icon: Warning },
};

const TYPE_MAP = {
    "Campaign": { color: T.accent, bg: T.accentLight, Icon: Campaign },
    "System Alert": { color: T.danger, bg: T.dangerLight, Icon: Warning },
    "Auto-Alert": { color: T.teal, bg: T.tealLight, Icon: NotificationsActive },
    "Recurring": { color: T.purple, bg: T.purpleLight, Icon: Refresh },
};

const CHANNEL_MAP = {
    Email: { color: T.accent, bg: T.accentLight, Icon: Email },
    App: { color: T.purple, bg: T.purpleLight, Icon: PhoneIphone },
    SMS: { color: T.warning, bg: T.warningLight, Icon: Sms },
    WhatsApp: { color: T.green, bg: T.greenLight, Icon: WhatsApp },
};

const PRIORITY_MAP = {
    Normal: { color: T.textMute, bg: "#F1F5F9" },
    High: { color: T.warning, bg: T.warningLight },
    Critical: { color: T.danger, bg: T.dangerLight },
};

const CATEGORIES = ["All", "Academic", "CIMS", "HR", "Finance", "Administrative", "IT", "Safety"];
const TYPES = ["All", "Campaign", "System Alert", "Auto-Alert", "Recurring"];
const STATUSES = ["All", "Delivered", "Scheduled", "Failed"];
const CHANNELS = ["All", "Email", "App", "SMS", "WhatsApp"];

/* ═════════════ PRIMITIVES ═════════════ */
const SCard = ({ children, sx = {} }) => (
    <Box sx={{ bgcolor: T.surface, border: `1px solid ${T.border}`, borderRadius: "14px", ...sx }}>{children}</Box>
);
const SLabel = ({ children, sx = {} }) => (
    <Typography sx={{ fontFamily: fB, fontSize: "0.67rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: T.textMute, mb: 0.5, ...sx }}>{children}</Typography>
);
const TH = ({ children, align, sx = {} }) => (
    <TableCell align={align} sx={{ fontFamily: fB, fontWeight: 700, fontSize: "0.66rem", letterSpacing: "0.06em", textTransform: "uppercase", color: T.textMute, borderBottom: `1px solid ${T.border}`, py: 1.3, bgcolor: "#F9FAFB", whiteSpace: "nowrap", ...sx }}>{children}</TableCell>
);
const TD = ({ children, sx = {}, align }) => (
    <TableCell align={align} sx={{ fontFamily: fB, fontSize: "0.8rem", color: T.textSub, borderBottom: `1px solid ${T.border}`, py: 1.5, ...sx }}>{children}</TableCell>
);

const EngagementMini = ({ delivered, read, failed, total }) => {
    const readPct = delivered > 0 ? Math.round((read / delivered) * 100) : 0;
    const failPct = total > 0 ? Math.round((failed / total) * 100) : 0;
    return (
        <Box sx={{ minWidth: 110 }}>
            <Box display="flex" justifyContent="space-between" mb={0.3}>
                <Typography sx={{ fontFamily: fB, fontSize: "0.6rem", color: T.textMute }}>Read</Typography>
                <Typography sx={{ fontFamily: fM, fontSize: "0.6rem", fontWeight: 700, color: T.accent }}>{readPct}%</Typography>
            </Box>
            <Box sx={{ height: 4, borderRadius: 99, bgcolor: T.border, overflow: "hidden", mb: 0.5 }}>
                <Box sx={{ height: "100%", width: `${readPct}%`, borderRadius: 99, bgcolor: T.accent, transition: "width 0.8s ease" }} />
            </Box>
            {failed > 0 && (
                <>
                    <Box display="flex" justifyContent="space-between" mb={0.2}>
                        <Typography sx={{ fontFamily: fB, fontSize: "0.6rem", color: T.textMute }}>Failed</Typography>
                        <Typography sx={{ fontFamily: fM, fontSize: "0.6rem", fontWeight: 700, color: T.danger }}>{failPct}%</Typography>
                    </Box>
                    <Box sx={{ height: 3, borderRadius: 99, bgcolor: T.border, overflow: "hidden" }}>
                        <Box sx={{ height: "100%", width: `${failPct}%`, borderRadius: 99, bgcolor: T.danger }} />
                    </Box>
                </>
            )}
        </Box>
    );
};

/* ═══════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════ */
const NotificationHistory = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [filterCategory, setFilterCategory] = useState("All");
    const [filterType, setFilterType] = useState("All");
    const [filterStatus, setFilterStatus] = useState("All");
    const [filterChannel, setFilterChannel] = useState("All");
    const [sortField, setSortField] = useState("date");
    const [sortDir, setSortDir] = useState("desc");
    const [selectedLog, setSelectedLog] = useState(null);
    const [detailOpen, setDetailOpen] = useState(false);
    const [snack, setSnack] = useState({ open: false, msg: "", severity: "success" });
    const [showFilters, setShowFilters] = useState(false);

    const toast = (msg, severity = "success") => setSnack({ open: true, msg, severity });

    /* ── Filtered & sorted data ── */
    const filtered = useMemo(() => {
        let data = [...NOTIFICATION_LOG];
        if (searchTerm) {
            const q = searchTerm.toLowerCase();
            data = data.filter(n => n.title.toLowerCase().includes(q) || n.target.toLowerCase().includes(q) || n.sender.toLowerCase().includes(q));
        }
        if (filterCategory !== "All") data = data.filter(n => n.category === filterCategory);
        if (filterType !== "All") data = data.filter(n => n.type === filterType);
        if (filterStatus !== "All") data = data.filter(n => n.status === filterStatus);
        if (filterChannel !== "All") data = data.filter(n => n.channel === filterChannel);

        data.sort((a, b) => {
            let cmp = 0;
            if (sortField === "date") cmp = new Date(a.date) - new Date(b.date);
            else if (sortField === "recipients") cmp = a.recipients - b.recipients;
            else if (sortField === "title") cmp = a.title.localeCompare(b.title);
            return sortDir === "desc" ? -cmp : cmp;
        });
        return data;
    }, [searchTerm, filterCategory, filterType, filterStatus, filterChannel, sortField, sortDir]);

    /* ── Stats ── */
    const totalSent = NOTIFICATION_LOG.filter(n => n.status === "Delivered").length;
    const totalFailed = NOTIFICATION_LOG.filter(n => n.status === "Failed").length;
    const totalScheduled = NOTIFICATION_LOG.filter(n => n.status === "Scheduled").length;
    const avgReadRate = (() => {
        const delivered = NOTIFICATION_LOG.filter(n => n.delivered > 0);
        if (delivered.length === 0) return 0;
        return Math.round(delivered.reduce((a, n) => a + (n.read / n.delivered) * 100, 0) / delivered.length);
    })();
    const totalRecipients = NOTIFICATION_LOG.reduce((a, n) => a + n.recipients, 0);

    const handleViewDetail = (log) => { setSelectedLog(log); setDetailOpen(true); };
    const handleResetFilters = () => { setSearchTerm(""); setFilterCategory("All"); setFilterType("All"); setFilterStatus("All"); setFilterChannel("All"); };

    const handleExportCSV = () => {
        const headers = "ID,Title,Type,Channel,Target,Sender,Date,Status,Recipients,Delivered,Read,Failed,Priority,Category";
        const rows = filtered.map(n => `${n.id},"${n.title}",${n.type},${n.channel},"${n.target}",${n.sender},${n.date},${n.status},${n.recipients},${n.delivered},${n.read},${n.failed},${n.priority},${n.category}`).join("\n");
        const blob = new Blob([headers + "\n" + rows], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a"); a.href = url; a.download = "notification_history.csv"; a.click();
        URL.revokeObjectURL(url);
        toast("Notification log exported as CSV!");
    };

    const toggleSort = (field) => {
        if (sortField === field) setSortDir(d => d === "asc" ? "desc" : "asc");
        else { setSortField(field); setSortDir("desc"); }
    };

    return (
        <Box sx={{ p: 3, bgcolor: T.bg, minHeight: "100vh", fontFamily: fB }}>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@600;700&family=Nunito:wght@400;500;600;700&family=JetBrains+Mono:wght@500;600&display=swap');
        * { box-sizing:border-box; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:none} }
        .fu  { animation: fadeUp 0.3s ease both; }
        .fu1 { animation: fadeUp 0.3s .06s ease both; }
        .fu2 { animation: fadeUp 0.3s .12s ease both; }
        .row-h { cursor:pointer; transition:background .12s; }
        .row-h:hover { background:#F9FAFB !important; }
      `}</style>

            {/* ── Header ── */}
            <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3} flexWrap="wrap" gap={2} className="fu">
                <Box>
                    <Typography sx={{ fontFamily: fB, fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: T.textMute, mb: 0.3 }}>Insights · Notifications</Typography>
                    <Typography sx={{ fontFamily: fH, fontWeight: 700, fontSize: "1.5rem", color: T.text }}>Notification History</Typography>
                    <Typography sx={{ fontFamily: fB, fontSize: "0.82rem", color: T.textSub, mt: 0.3 }}>Complete audit log of all sent alerts, campaigns, auto-alerts, and system notifications.</Typography>
                </Box>
                <Box display="flex" gap={1}>
                    <Button size="small" variant="outlined" startIcon={<Download sx={{ fontSize: 15 }} />} onClick={handleExportCSV}
                        sx={{ fontFamily: fB, fontWeight: 600, fontSize: "0.76rem", textTransform: "none", borderRadius: "8px", borderColor: T.border, color: T.textSub, "&:hover": { borderColor: T.accent, color: T.accent } }}>
                        Export CSV
                    </Button>
                    <Button size="small" variant="outlined" startIcon={<Refresh sx={{ fontSize: 15 }} />} onClick={() => toast("Log refreshed.")}
                        sx={{ fontFamily: fB, fontWeight: 600, fontSize: "0.76rem", textTransform: "none", borderRadius: "8px", borderColor: T.border, color: T.textSub, "&:hover": { borderColor: T.accent, color: T.accent } }}>
                        Refresh
                    </Button>
                </Box>
            </Box>

            {/* ── Stat Cards ── */}
            <Grid container spacing={2} mb={3}>
                {[
                    { label: "Total Notifications", value: NOTIFICATION_LOG.length, sub: "All time", color: T.accent, Icon: Campaign },
                    { label: "Successfully Delivered", value: totalSent, sub: "Notifications", color: T.success, Icon: DoneAll },
                    { label: "Avg. Read Rate", value: `${avgReadRate}%`, sub: "Across all channels", color: T.purple, Icon: MarkEmailRead },
                    { label: "Total Recipients Reached", value: totalRecipients.toLocaleString(), sub: "Cumulative", color: T.teal, Icon: Group },
                    { label: "Scheduled", value: totalScheduled, sub: "Pending delivery", color: T.warning, Icon: Schedule },
                    { label: "Failed", value: totalFailed, sub: "Needs attention", color: T.danger, Icon: ErrorOutline },
                ].map((s, i) => (
                    <Grid item xs={6} sm={4} md={2} key={i}>
                        <SCard sx={{ p: 2 }} className={`fu${Math.min(i, 2)}`}>
                            <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                                <Box>
                                    <SLabel>{s.label}</SLabel>
                                    <Typography sx={{ fontFamily: fM, fontWeight: 700, fontSize: "1.4rem", color: s.color, lineHeight: 1.1 }}>{s.value}</Typography>
                                    <Typography sx={{ fontFamily: fB, fontSize: "0.65rem", color: T.textMute, mt: 0.3 }}>{s.sub}</Typography>
                                </Box>
                                <Box sx={{ p: 0.8, borderRadius: "8px", bgcolor: `${s.color}15`, color: s.color }}>
                                    <s.Icon sx={{ fontSize: 17 }} />
                                </Box>
                            </Box>
                        </SCard>
                    </Grid>
                ))}
            </Grid>

            {/* ── Search & Filters ── */}
            <SCard sx={{ p: 2, mb: 2.5 }} className="fu1">
                <Box display="flex" gap={1.5} alignItems="center" flexWrap="wrap">
                    <TextField size="small" placeholder="Search notifications…" value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                        sx={{ flex: 1, minWidth: 200, "& .MuiOutlinedInput-root": { borderRadius: "8px", fontFamily: fB, fontSize: "0.82rem", "& fieldset": { borderColor: T.border } } }}
                        InputProps={{ startAdornment: <InputAdornment position="start"><Search sx={{ fontSize: 16, color: T.textMute }} /></InputAdornment> }}
                    />
                    <Button size="small" variant={showFilters ? "contained" : "outlined"} startIcon={<FilterAlt sx={{ fontSize: 14 }} />}
                        onClick={() => setShowFilters(!showFilters)}
                        sx={{
                            fontFamily: fB, fontWeight: 600, fontSize: "0.76rem", textTransform: "none", borderRadius: "8px",
                            ...(showFilters ? { bgcolor: T.accent, color: "#fff", "&:hover": { bgcolor: "#5558e6" } } : { borderColor: T.border, color: T.textSub }),
                        }}>
                        Filters {showFilters ? <ExpandLess sx={{ fontSize: 14, ml: 0.3 }} /> : <ExpandMore sx={{ fontSize: 14, ml: 0.3 }} />}
                    </Button>
                    {(filterCategory !== "All" || filterType !== "All" || filterStatus !== "All" || filterChannel !== "All") && (
                        <Button size="small" onClick={handleResetFilters} startIcon={<Close sx={{ fontSize: 13 }} />}
                            sx={{ fontFamily: fB, fontWeight: 600, fontSize: "0.72rem", textTransform: "none", color: T.danger, borderRadius: "7px" }}>
                            Clear All
                        </Button>
                    )}
                    <Typography sx={{ fontFamily: fM, fontSize: "0.72rem", color: T.textMute, ml: "auto" }}>{filtered.length} results</Typography>
                </Box>

                {showFilters && (
                    <Box mt={2} pt={2} sx={{ borderTop: `1px solid ${T.border}` }}>
                        <Grid container spacing={1.5}>
                            {[
                                { label: "Category", value: filterCategory, setter: setFilterCategory, options: CATEGORIES },
                                { label: "Type", value: filterType, setter: setFilterType, options: TYPES },
                                { label: "Status", value: filterStatus, setter: setFilterStatus, options: STATUSES },
                                { label: "Channel", value: filterChannel, setter: setFilterChannel, options: CHANNELS },
                            ].map(f => (
                                <Grid item xs={6} sm={3} key={f.label}>
                                    <FormControl size="small" fullWidth>
                                        <InputLabel sx={{ fontFamily: fB, fontSize: "0.8rem" }}>{f.label}</InputLabel>
                                        <Select value={f.value} label={f.label} onChange={e => f.setter(e.target.value)}
                                            sx={{ borderRadius: "8px", fontFamily: fB, fontSize: "0.8rem" }}>
                                            {f.options.map(o => <MenuItem key={o} value={o} sx={{ fontSize: "0.8rem" }}>{o}</MenuItem>)}
                                        </Select>
                                    </FormControl>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                )}
            </SCard>

            {/* ── Active Filter Chips ── */}
            {(filterCategory !== "All" || filterType !== "All" || filterStatus !== "All" || filterChannel !== "All") && (
                <Box display="flex" gap={0.8} flexWrap="wrap" mb={2}>
                    {[
                        filterCategory !== "All" && { label: `Category: ${filterCategory}`, onClear: () => setFilterCategory("All"), color: T.accent },
                        filterType !== "All" && { label: `Type: ${filterType}`, onClear: () => setFilterType("All"), color: T.purple },
                        filterStatus !== "All" && { label: `Status: ${filterStatus}`, onClear: () => setFilterStatus("All"), color: T.success },
                        filterChannel !== "All" && { label: `Channel: ${filterChannel}`, onClear: () => setFilterChannel("All"), color: T.warning },
                    ].filter(Boolean).map((c, i) => (
                        <Chip key={i} label={c.label} size="small" onDelete={c.onClear}
                            sx={{ fontFamily: fB, fontSize: "0.7rem", fontWeight: 600, bgcolor: `${c.color}12`, color: c.color, border: `1px solid ${c.color}25`, "& .MuiChip-deleteIcon": { color: c.color, fontSize: 15 } }} />
                    ))}
                </Box>
            )}

            {/* ── Notification Log Table ── */}
            <SCard sx={{ overflow: "hidden" }} className="fu2">
                <Box sx={{ overflowX: "auto" }}>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TH sx={{ cursor: "pointer" }} onClick={() => toggleSort("date")}>
                                    <Box display="flex" alignItems="center" gap={0.3}>Date/Time {sortField === "date" && (sortDir === "desc" ? "↓" : "↑")}</Box>
                                </TH>
                                <TH>Type</TH>
                                <TH sx={{ cursor: "pointer" }} onClick={() => toggleSort("title")}>
                                    <Box display="flex" alignItems="center" gap={0.3}>Notification {sortField === "title" && (sortDir === "desc" ? "↓" : "↑")}</Box>
                                </TH>
                                <TH>Channel</TH>
                                <TH>Target</TH>
                                <TH sx={{ cursor: "pointer" }} onClick={() => toggleSort("recipients")}>
                                    <Box display="flex" alignItems="center" gap={0.3}>Recipients {sortField === "recipients" && (sortDir === "desc" ? "↓" : "↑")}</Box>
                                </TH>
                                <TH>Engagement</TH>
                                <TH>Priority</TH>
                                <TH>Status</TH>
                                <TH align="center">Actions</TH>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filtered.map(log => {
                                const tm = TYPE_MAP[log.type] || TYPE_MAP["Campaign"];
                                const cm = CHANNEL_MAP[log.channel] || CHANNEL_MAP["Email"];
                                const sm = STATUS_MAP[log.status] || STATUS_MAP["Delivered"];
                                const pm = PRIORITY_MAP[log.priority] || PRIORITY_MAP["Normal"];
                                return (
                                    <TableRow key={log.id} className="row-h" onClick={() => handleViewDetail(log)}>
                                        <TD>
                                            <Typography sx={{ fontFamily: fM, fontSize: "0.72rem", color: T.textSub, whiteSpace: "nowrap" }}>{log.date}</Typography>
                                        </TD>
                                        <TD>
                                            <Box sx={{ display: "inline-flex", alignItems: "center", gap: 0.5, px: 0.8, py: 0.3, borderRadius: "6px", bgcolor: tm.bg }}>
                                                <tm.Icon sx={{ fontSize: 12, color: tm.color }} />
                                                <Typography sx={{ fontFamily: fB, fontSize: "0.66rem", fontWeight: 700, color: tm.color, whiteSpace: "nowrap" }}>{log.type}</Typography>
                                            </Box>
                                        </TD>
                                        <TD sx={{ maxWidth: 220 }}>
                                            <Typography sx={{ fontFamily: fB, fontWeight: 600, fontSize: "0.8rem", color: T.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{log.title}</Typography>
                                            <Typography sx={{ fontFamily: fB, fontSize: "0.62rem", color: T.textMute, mt: 0.2 }}>by {log.sender}</Typography>
                                        </TD>
                                        <TD>
                                            <Box sx={{ display: "inline-flex", alignItems: "center", gap: 0.5, px: 0.8, py: 0.3, borderRadius: "6px", bgcolor: cm.bg }}>
                                                <cm.Icon sx={{ fontSize: 12, color: cm.color }} />
                                                <Typography sx={{ fontFamily: fB, fontSize: "0.66rem", fontWeight: 700, color: cm.color }}>{log.channel}</Typography>
                                            </Box>
                                        </TD>
                                        <TD>
                                            <Typography sx={{ fontFamily: fB, fontSize: "0.75rem", color: T.textSub, whiteSpace: "nowrap" }}>{log.target}</Typography>
                                        </TD>
                                        <TD>
                                            <Typography sx={{ fontFamily: fM, fontWeight: 700, fontSize: "0.82rem", color: T.text }}>{log.recipients.toLocaleString()}</Typography>
                                        </TD>
                                        <TD sx={{ minWidth: 120 }}>
                                            {log.delivered > 0 ? (
                                                <EngagementMini delivered={log.delivered} read={log.read} failed={log.failed} total={log.recipients} />
                                            ) : (
                                                <Typography sx={{ fontFamily: fB, fontSize: "0.68rem", color: T.textMute, fontStyle: "italic" }}>
                                                    {log.status === "Scheduled" ? "Pending" : "N/A"}
                                                </Typography>
                                            )}
                                        </TD>
                                        <TD>
                                            <Box sx={{ px: 0.8, py: 0.25, borderRadius: "5px", bgcolor: pm.bg, width: "fit-content" }}>
                                                <Typography sx={{ fontFamily: fB, fontSize: "0.64rem", fontWeight: 700, color: pm.color }}>{log.priority}</Typography>
                                            </Box>
                                        </TD>
                                        <TD>
                                            <Box display="flex" alignItems="center" gap={0.5} sx={{ px: 0.8, py: 0.3, borderRadius: "99px", bgcolor: sm.bg, width: "fit-content" }}>
                                                <sm.Icon sx={{ fontSize: 11, color: sm.color }} />
                                                <Typography sx={{ fontFamily: fB, fontSize: "0.66rem", fontWeight: 700, color: sm.color }}>{log.status}</Typography>
                                            </Box>
                                        </TD>
                                        <TD align="center" onClick={e => e.stopPropagation()}>
                                            <Tooltip title="View Details">
                                                <IconButton size="small" onClick={() => handleViewDetail(log)} sx={{ bgcolor: T.accentLight, color: T.accent, borderRadius: "7px", width: 28, height: 28 }}>
                                                    <Visibility sx={{ fontSize: 14 }} />
                                                </IconButton>
                                            </Tooltip>
                                        </TD>
                                    </TableRow>
                                );
                            })}
                            {filtered.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={10} sx={{ textAlign: "center", py: 6, fontFamily: fB, color: T.textMute }}>
                                        <Box>
                                            <NotificationsActive sx={{ fontSize: 40, opacity: 0.3, mb: 1 }} />
                                            <Typography sx={{ fontFamily: fB, fontWeight: 600, fontSize: "0.85rem" }}>No notifications match your filters</Typography>
                                            <Typography sx={{ fontFamily: fB, fontSize: "0.75rem", mt: 0.3 }}>Try adjusting your search or filter criteria.</Typography>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </Box>

                {/* Table Footer */}
                <Box sx={{ px: 2.5, py: 1.5, borderTop: `1px solid ${T.border}`, bgcolor: "#FAFBFD", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 1 }}>
                    <Typography sx={{ fontFamily: fB, fontSize: "0.72rem", color: T.textMute }}>
                        Showing {filtered.length} of {NOTIFICATION_LOG.length} notifications
                    </Typography>
                    <Box display="flex" gap={2}>
                        {[
                            { label: "Campaigns", count: NOTIFICATION_LOG.filter(n => n.type === "Campaign").length, color: T.accent },
                            { label: "System Alerts", count: NOTIFICATION_LOG.filter(n => n.type === "System Alert").length, color: T.danger },
                            { label: "Auto-Alerts", count: NOTIFICATION_LOG.filter(n => n.type === "Auto-Alert").length, color: T.teal },
                            { label: "Recurring", count: NOTIFICATION_LOG.filter(n => n.type === "Recurring").length, color: T.purple },
                        ].map(s => (
                            <Box key={s.label} display="flex" alignItems="center" gap={0.5}>
                                <Box sx={{ width: 8, height: 8, borderRadius: "2px", bgcolor: s.color }} />
                                <Typography sx={{ fontFamily: fM, fontSize: "0.65rem", color: T.textSub }}>{s.label}: <strong>{s.count}</strong></Typography>
                            </Box>
                        ))}
                    </Box>
                </Box>
            </SCard>

            {/* ═══ Detail Dialog ═══ */}
            <Dialog open={detailOpen} onClose={() => setDetailOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: "16px" } }}>
                {selectedLog && (() => {
                    const tm = TYPE_MAP[selectedLog.type] || TYPE_MAP["Campaign"];
                    const cm = CHANNEL_MAP[selectedLog.channel] || CHANNEL_MAP["Email"];
                    const sm = STATUS_MAP[selectedLog.status] || STATUS_MAP["Delivered"];
                    const pm = PRIORITY_MAP[selectedLog.priority] || PRIORITY_MAP["Normal"];
                    const deliveryRate = selectedLog.recipients > 0 ? Math.round((selectedLog.delivered / selectedLog.recipients) * 100) : 0;
                    const readRate = selectedLog.delivered > 0 ? Math.round((selectedLog.read / selectedLog.delivered) * 100) : 0;
                    return (
                        <>
                            <DialogTitle sx={{ fontFamily: fH, fontWeight: 700, fontSize: "1.1rem", pb: 1, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                <Box sx={{ flex: 1, pr: 2 }}>
                                    {selectedLog.title}
                                    <Typography sx={{ fontFamily: fB, fontSize: "0.75rem", color: T.textMute, mt: 0.3 }}>{selectedLog.date} · {selectedLog.sender}</Typography>
                                </Box>
                                <IconButton size="small" onClick={() => setDetailOpen(false)}><Close sx={{ fontSize: 18 }} /></IconButton>
                            </DialogTitle>
                            <DialogContent>
                                {/* Type / Channel / Priority row */}
                                <Box display="flex" gap={1} flexWrap="wrap" mb={2.5}>
                                    <Box sx={{ display: "inline-flex", alignItems: "center", gap: 0.5, px: 1, py: 0.4, borderRadius: "7px", bgcolor: tm.bg }}>
                                        <tm.Icon sx={{ fontSize: 13, color: tm.color }} />
                                        <Typography sx={{ fontFamily: fB, fontSize: "0.72rem", fontWeight: 700, color: tm.color }}>{selectedLog.type}</Typography>
                                    </Box>
                                    <Box sx={{ display: "inline-flex", alignItems: "center", gap: 0.5, px: 1, py: 0.4, borderRadius: "7px", bgcolor: cm.bg }}>
                                        <cm.Icon sx={{ fontSize: 13, color: cm.color }} />
                                        <Typography sx={{ fontFamily: fB, fontSize: "0.72rem", fontWeight: 700, color: cm.color }}>{selectedLog.channel}</Typography>
                                    </Box>
                                    <Box sx={{ px: 1, py: 0.4, borderRadius: "7px", bgcolor: pm.bg }}>
                                        <Typography sx={{ fontFamily: fB, fontSize: "0.72rem", fontWeight: 700, color: pm.color }}>{selectedLog.priority} Priority</Typography>
                                    </Box>
                                    <Box sx={{ display: "inline-flex", alignItems: "center", gap: 0.4, px: 1, py: 0.4, borderRadius: "99px", bgcolor: sm.bg }}>
                                        <sm.Icon sx={{ fontSize: 12, color: sm.color }} />
                                        <Typography sx={{ fontFamily: fB, fontSize: "0.72rem", fontWeight: 700, color: sm.color }}>{selectedLog.status}</Typography>
                                    </Box>
                                </Box>

                                {/* Delivery Stats */}
                                <Typography sx={{ fontFamily: fH, fontWeight: 700, fontSize: "0.85rem", color: T.text, mb: 1.5 }}>Delivery Statistics</Typography>
                                <Grid container spacing={1.5} mb={2.5}>
                                    {[
                                        { label: "Recipients", value: selectedLog.recipients, color: T.accent, Icon: Group },
                                        { label: "Delivered", value: selectedLog.delivered, color: T.success, Icon: DoneAll },
                                        { label: "Read", value: selectedLog.read, color: T.purple, Icon: MarkEmailRead },
                                        { label: "Failed", value: selectedLog.failed, color: T.danger, Icon: ErrorOutline },
                                    ].map((s, i) => (
                                        <Grid item xs={6} sm={3} key={i}>
                                            <Box sx={{ p: 1.5, borderRadius: "10px", border: `1px solid ${T.border}`, textAlign: "center" }}>
                                                <s.Icon sx={{ fontSize: 18, color: s.color, mb: 0.3 }} />
                                                <Typography sx={{ fontFamily: fM, fontWeight: 700, fontSize: "1.2rem", color: s.color, lineHeight: 1.1 }}>{s.value}</Typography>
                                                <Typography sx={{ fontFamily: fB, fontSize: "0.62rem", color: T.textMute, mt: 0.2 }}>{s.label}</Typography>
                                            </Box>
                                        </Grid>
                                    ))}
                                </Grid>

                                {/* Rate Bars */}
                                <Box sx={{ p: 2, borderRadius: "10px", bgcolor: "#FAFBFD", border: `1px solid ${T.border}` }}>
                                    {[
                                        { label: "Delivery Rate", pct: deliveryRate, color: T.success },
                                        { label: "Read Rate", pct: readRate, color: T.accent },
                                    ].map(r => (
                                        <Box key={r.label} mb={1.5}>
                                            <Box display="flex" justifyContent="space-between" mb={0.3}>
                                                <Typography sx={{ fontFamily: fB, fontSize: "0.75rem", fontWeight: 600, color: T.textSub }}>{r.label}</Typography>
                                                <Typography sx={{ fontFamily: fM, fontSize: "0.75rem", fontWeight: 700, color: r.color }}>{r.pct}%</Typography>
                                            </Box>
                                            <Box sx={{ height: 8, borderRadius: 99, bgcolor: T.border, overflow: "hidden" }}>
                                                <Box sx={{ height: "100%", width: `${r.pct}%`, borderRadius: 99, bgcolor: r.color, transition: "width 1s ease" }} />
                                            </Box>
                                        </Box>
                                    ))}

                                    <Divider sx={{ borderColor: T.border, my: 1.5 }} />

                                    <Grid container spacing={2}>
                                        <Grid item xs={6}>
                                            <SLabel>Target Audience</SLabel>
                                            <Typography sx={{ fontFamily: fB, fontSize: "0.82rem", fontWeight: 600, color: T.text }}>{selectedLog.target}</Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <SLabel>Category</SLabel>
                                            <Typography sx={{ fontFamily: fB, fontSize: "0.82rem", fontWeight: 600, color: T.text }}>{selectedLog.category}</Typography>
                                        </Grid>
                                    </Grid>
                                </Box>
                            </DialogContent>
                            <DialogActions sx={{ p: 2, borderTop: `1px solid ${T.border}` }}>
                                <Button onClick={() => { toast(`Resending "${selectedLog.title}"…`); setDetailOpen(false); }} startIcon={<Send sx={{ fontSize: 14 }} />}
                                    sx={{ fontFamily: fB, fontWeight: 600, fontSize: "0.78rem", textTransform: "none", color: T.accent }}>Resend</Button>
                                <Button onClick={() => setDetailOpen(false)} variant="contained"
                                    sx={{ fontFamily: fB, fontWeight: 600, fontSize: "0.78rem", textTransform: "none", bgcolor: T.accent, borderRadius: "8px" }}>Close</Button>
                            </DialogActions>
                        </>
                    );
                })()}
            </Dialog>

            {/* Snackbar */}
            <Snackbar open={snack.open} autoHideDuration={3000} onClose={() => setSnack(s => ({ ...s, open: false }))} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
                <Alert severity={snack.severity} sx={{ borderRadius: "10px", fontFamily: fB, fontWeight: 600 }} onClose={() => setSnack(s => ({ ...s, open: false }))}>{snack.msg}</Alert>
            </Snackbar>
        </Box>
    );
};

export default NotificationHistory;
