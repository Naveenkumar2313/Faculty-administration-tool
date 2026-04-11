import React, { useState } from "react";
import {
    Box, Card, Typography, Button, TextField, MenuItem, Table, TableBody, TableCell, TableHead, TableRow,
    IconButton, Tooltip, Avatar, InputAdornment, Dialog, DialogTitle, DialogContent, DialogActions,
    Collapse, Grid, Alert, Chip, LinearProgress
} from "@mui/material";
import {
    CheckCircle, Cancel, HelpOutline, Search, Download, Refresh, AccessTime, Warning,
    BarChart, ChevronLeft, ChevronRight, ExpandMore, ExpandLess, Visibility, Send, Science
} from "@mui/icons-material";

/* ── Design Tokens ── */
const T = {
    bg: "#F5F7FA", surface: "#FFFFFF", border: "#E4E8EF", text: "#111827", textSub: "#4B5563", textMute: "#9CA3AF",
    accent: "#6366F1", accentLight: "#EEF2FF", success: "#10B981", successLight: "#ECFDF5",
    warning: "#F59E0B", warningLight: "#FFFBEB", danger: "#EF4444", dangerLight: "#FEF2F2",
    info: "#3B82F6", infoLight: "#EFF6FF", purple: "#8B5CF6", purpleLight: "#F5F3FF",
};
const fontHead = "Sora, Roboto, Helvetica, Arial, sans-serif";
const fontBody = "Nunito, Roboto, Helvetica, Arial, sans-serif";
const fontMono = "JetBrains Mono, monospace";

const Fonts = () => (
    <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700&family=Nunito:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600&display=swap');
    * { box-sizing: border-box; }
    @keyframes fadeUp { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:none; } }
    @keyframes slideIn { from { opacity:0; transform:translateX(-6px); } to { opacity:1; transform:none; } }
    .fade-up { animation: fadeUp 0.35s ease both; }
    .slide-in { animation: slideIn 0.25s ease both; }
    .row-hover:hover { background: #F9FAFB !important; transition: background 0.15s; }
  `}</style>
);

const SLabel = ({ children, sx = {} }) => (
    <Typography sx={{ fontFamily: fontBody, fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: T.textMute, mb: 0.5, ...sx }}>{children}</Typography>
);

const StatusPill = ({ status }) => {
    const map = { Pending: { bg: T.warningLight, color: T.warning, dot: T.warning }, Approved: { bg: T.successLight, color: T.success, dot: T.success }, Rejected: { bg: T.dangerLight, color: T.danger, dot: T.danger } };
    const s = map[status] || map.Pending;
    return (
        <Box display="flex" alignItems="center" gap={0.6} sx={{ px: 1.2, py: 0.4, borderRadius: "99px", bgcolor: s.bg, width: "fit-content" }}>
            <Box sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: s.dot }} />
            <Typography sx={{ fontFamily: fontBody, fontSize: "0.72rem", fontWeight: 700, color: s.color }}>{status}</Typography>
        </Box>
    );
};

const StatCard = ({ label, value, sub, color, icon: Icon }) => (
    <Box className="fade-up" sx={{ flex: 1, p: 2.5, borderRadius: "14px", border: `1px solid ${T.border}`, background: T.surface, minWidth: 0 }}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
            <Box>
                <SLabel>{label}</SLabel>
                <Typography sx={{ fontFamily: fontMono, fontWeight: 700, fontSize: "1.8rem", color: color || T.text, lineHeight: 1.1 }}>{value}</Typography>
                {sub && <Typography sx={{ fontFamily: fontBody, fontSize: "0.72rem", color: T.textMute, mt: 0.4 }}>{sub}</Typography>}
            </Box>
            {Icon && <Box sx={{ p: 1.2, borderRadius: "10px", bgcolor: `${color || T.accent}12`, color: color || T.accent }}><Icon sx={{ fontSize: 20 }} /></Box>}
        </Box>
    </Box>
);

/* ── Mock Requests ── */
const REQUESTS = [
    { id: 1, requester: "Dr. Sarah Smith", avatar: "SS", dept: "CSE", lab: "Computer Lab 1", experiment: "Data Structures Practical", date: "2026-04-10", time: "09:00 – 11:00", students: 30, software: ["VS Code", "Python"], status: "Pending", applied: "2026-04-05", conflict: true },
    { id: 2, requester: "Prof. Rajan Kumar", avatar: "RK", dept: "Mech", lab: "CAD Lab", experiment: "Machine Drawing Session", date: "2026-04-12", time: "14:00 – 16:00", students: 25, software: ["AutoCAD"], status: "Pending", applied: "2026-04-06", conflict: false },
    { id: 3, requester: "Ms. Priya Roy", avatar: "PR", dept: "CSE", lab: "Computer Lab 1", experiment: "DBMS Lab Session", date: "2026-04-10", time: "10:00 – 12:00", students: 28, software: ["MySQL", "VS Code"], status: "Pending", applied: "2026-04-07", conflict: true },
    { id: 4, requester: "Dr. Emily Davis", avatar: "ED", dept: "ECE", lab: "Electronics Lab A", experiment: "Digital Circuits", date: "2026-04-15", time: "09:00 – 12:00", students: 20, software: [], status: "Approved", applied: "2026-04-03", conflict: false },
    { id: 5, requester: "Prof. A. Sharma", avatar: "AS", dept: "Physics", lab: "Physics Lab 2", experiment: "Optics Experiment", date: "2026-04-18", time: "11:00 – 13:00", students: 22, software: [], status: "Rejected", applied: "2026-04-02", conflict: false },
];

/* ════════════════════════════════════════════ */
const LabBooking = () => {
    const [deptFilter, setDeptFilter] = useState("All");
    const [statusFilter, setStatusFilter] = useState("All");
    const [searchQ, setSearchQ] = useState("");
    const [expandRow, setExpandRow] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogData, setDialogData] = useState(null);

    const filtered = REQUESTS.filter(r => {
        if (deptFilter !== "All" && r.dept !== deptFilter) return false;
        if (statusFilter !== "All" && r.status !== statusFilter) return false;
        if (searchQ && !r.requester.toLowerCase().includes(searchQ.toLowerCase()) && !r.lab.toLowerCase().includes(searchQ.toLowerCase())) return false;
        return true;
    });

    const pendingCount = REQUESTS.filter(r => r.status === "Pending").length;
    const approvedCount = REQUESTS.filter(r => r.status === "Approved").length;
    const conflictCount = REQUESTS.filter(r => r.conflict && r.status === "Pending").length;
    const openDialog = (row, action) => { setDialogData({ row, action }); setDialogOpen(true); };

    return (
        <Box sx={{ p: 3, background: T.bg, minHeight: "100vh", fontFamily: fontBody }}>
            <Fonts />
            <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3} className="fade-up">
                <Box>
                    <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1.5rem", color: T.text, lineHeight: 1.1 }}>Lab Booking Requests</Typography>
                    <Typography sx={{ fontFamily: fontBody, fontSize: "0.82rem", color: T.textSub, mt: 0.4 }}>Review and process lab reservation requests from faculty &amp; students</Typography>
                </Box>
                <Box display="flex" gap={1.5}>
                    <Button variant="outlined" size="small" startIcon={<Download />} sx={{ fontFamily: fontBody, fontWeight: 600, fontSize: "0.78rem", borderColor: T.border, color: T.textSub, borderRadius: "8px", textTransform: "none", "&:hover": { borderColor: T.accent, color: T.accent } }}>Export</Button>
                    <Button variant="contained" size="small" startIcon={<Refresh />} sx={{ fontFamily: fontBody, fontWeight: 600, fontSize: "0.78rem", background: T.accent, borderRadius: "8px", textTransform: "none", boxShadow: "none", "&:hover": { background: "#4F46E5", boxShadow: "none" } }}>Sync</Button>
                </Box>
            </Box>

            <Box display="flex" gap={2} mb={3} sx={{ overflowX: "auto", pb: 0.5 }}>
                <StatCard label="Pending Approval" value={pendingCount} sub="Requires action" color={T.warning} icon={AccessTime} />
                <StatCard label="Approved" value={approvedCount} sub="Processed" color={T.success} icon={CheckCircle} />
                <StatCard label="Conflict Alerts" value={conflictCount} sub="Overlapping slots" color={T.danger} icon={Warning} />
                <StatCard label="Total Requests" value={REQUESTS.length} sub="All statuses" color={T.purple} icon={Science} />
            </Box>

            <Card sx={{ borderRadius: "16px", border: `1px solid ${T.border}`, boxShadow: "0 1px 4px rgba(0,0,0,0.06)", overflow: "hidden" }}>
                <Box sx={{ p: 2.5, borderBottom: `1px solid ${T.border}`, background: T.surface }}>
                    <Box display="flex" gap={1.5} alignItems="center" flexWrap="wrap">
                        <TextField size="small" placeholder="Search requester or lab..." value={searchQ} onChange={e => setSearchQ(e.target.value)}
                            InputProps={{ startAdornment: <InputAdornment position="start"><Search sx={{ fontSize: 16, color: T.textMute }} /></InputAdornment> }}
                            sx={{ width: 260, "& .MuiOutlinedInput-root": { borderRadius: "8px", fontFamily: fontBody, fontSize: "0.82rem", "& fieldset": { borderColor: T.border }, "&.Mui-focused fieldset": { borderColor: T.accent } } }} />
                        {[{ label: "Department", value: deptFilter, set: setDeptFilter, options: ["All", "CSE", "Mech", "ECE", "Physics"] }, { label: "Status", value: statusFilter, set: setStatusFilter, options: ["All", "Pending", "Approved", "Rejected"] }].map(f => (
                            <TextField key={f.label} select size="small" label={f.label} value={f.value} onChange={e => f.set(e.target.value)}
                                sx={{ width: 150, "& .MuiOutlinedInput-root": { borderRadius: "8px", fontFamily: fontBody, fontSize: "0.82rem", "& fieldset": { borderColor: T.border }, "&.Mui-focused fieldset": { borderColor: T.accent } }, "& .MuiInputLabel-root": { fontFamily: fontBody, fontSize: "0.82rem", "&.Mui-focused": { color: T.accent } } }}>
                                {f.options.map(o => <MenuItem key={o} value={o} sx={{ fontFamily: fontBody, fontSize: "0.82rem" }}>{o === "All" ? `All ${f.label}s` : o}</MenuItem>)}
                            </TextField>
                        ))}
                    </Box>
                    {conflictCount > 0 && (
                        <Alert severity="warning" icon={<Warning sx={{ fontSize: 18 }} />} sx={{ mt: 2, borderRadius: "10px", fontFamily: fontBody, fontSize: "0.8rem", border: `1px solid ${T.warning}40`, bgcolor: T.warningLight }}>
                            <strong>{conflictCount} conflict(s):</strong> Multiple requests overlap for the same lab on the same day.
                        </Alert>
                    )}
                </Box>

                <Box sx={{ overflowX: "auto" }}>
                    <Table size="medium">
                        <TableHead>
                            <TableRow sx={{ bgcolor: "#F9FAFB" }}>
                                {["Requester & Dept", "Lab", "Experiment / Session", "Date & Time", "Students", "Status", "Actions"].map(h => (
                                    <TableCell key={h} sx={{ fontFamily: fontBody, fontWeight: 700, fontSize: "0.72rem", letterSpacing: "0.05em", textTransform: "uppercase", color: T.textMute, borderBottom: `1px solid ${T.border}`, py: 1.5, whiteSpace: "nowrap" }}>{h}</TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filtered.map(row => (
                                <React.Fragment key={row.id}>
                                    <TableRow className="row-hover" sx={{ borderBottom: expandRow === row.id ? "none" : `1px solid ${T.border}` }}>
                                        <TableCell sx={{ py: 1.8 }}>
                                            <Box display="flex" alignItems="center" gap={1.5}>
                                                <Avatar sx={{ width: 34, height: 34, fontFamily: fontHead, fontWeight: 700, fontSize: "0.8rem", bgcolor: T.accentLight, color: T.accent }}>{row.avatar}</Avatar>
                                                <Box>
                                                    <Typography sx={{ fontFamily: fontBody, fontWeight: 600, fontSize: "0.83rem", color: T.text, lineHeight: 1.2 }}>{row.requester}</Typography>
                                                    <Box display="flex" alignItems="center" gap={0.6} mt={0.2}>
                                                        <Typography sx={{ fontFamily: fontBody, fontSize: "0.7rem", color: T.textMute }}>{row.dept}</Typography>
                                                        {row.conflict && row.status === "Pending" && (
                                                            <Tooltip title="Conflict: Overlapping lab booking on same day"><Box sx={{ px: 0.8, py: 0.15, borderRadius: "4px", bgcolor: T.dangerLight, border: `1px solid ${T.danger}30` }}><Typography sx={{ fontFamily: fontMono, fontSize: "0.6rem", color: T.danger, fontWeight: 700 }}>CONFLICT</Typography></Box></Tooltip>
                                                        )}
                                                    </Box>
                                                </Box>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Box sx={{ px: 1.2, py: 0.35, borderRadius: "6px", bgcolor: T.purpleLight, border: `1px solid ${T.purple}30`, display: "inline-block" }}>
                                                <Typography sx={{ fontFamily: fontMono, fontSize: "0.7rem", fontWeight: 600, color: T.purple }}>{row.lab}</Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell><Typography sx={{ fontFamily: fontBody, fontSize: "0.8rem", color: T.textSub, maxWidth: 160, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{row.experiment}</Typography></TableCell>
                                        <TableCell>
                                            <Typography sx={{ fontFamily: fontBody, fontSize: "0.8rem", color: T.text, fontWeight: 500 }}>{row.date}</Typography>
                                            <Typography sx={{ fontFamily: fontMono, fontSize: "0.7rem", color: T.textMute }}>{row.time}</Typography>
                                        </TableCell>
                                        <TableCell><Typography sx={{ fontFamily: fontMono, fontSize: "0.8rem", color: T.textSub }}>{row.students}</Typography></TableCell>
                                        <TableCell><StatusPill status={row.status} /></TableCell>
                                        <TableCell>
                                            <Box display="flex" alignItems="center" gap={0.5}>
                                                {row.status === "Pending" ? (
                                                    <>
                                                        <Tooltip title="Approve"><IconButton size="small" onClick={() => openDialog(row, "approve")} sx={{ bgcolor: T.successLight, color: T.success, borderRadius: "8px", "&:hover": { bgcolor: "#D1FAE5" } }}><CheckCircle sx={{ fontSize: 16 }} /></IconButton></Tooltip>
                                                        <Tooltip title="Reject"><IconButton size="small" onClick={() => openDialog(row, "reject")} sx={{ bgcolor: T.dangerLight, color: T.danger, borderRadius: "8px", "&:hover": { bgcolor: "#FEE2E2" } }}><Cancel sx={{ fontSize: 16 }} /></IconButton></Tooltip>
                                                        <Tooltip title="Request Clarification"><IconButton size="small" onClick={() => openDialog(row, "clarify")} sx={{ bgcolor: T.infoLight, color: T.info, borderRadius: "8px", "&:hover": { bgcolor: "#DBEAFE" } }}><HelpOutline sx={{ fontSize: 16 }} /></IconButton></Tooltip>
                                                    </>
                                                ) : (
                                                    <Tooltip title="View Details"><IconButton size="small" sx={{ borderRadius: "8px", color: T.textMute, "&:hover": { bgcolor: T.bg } }}><Visibility sx={{ fontSize: 16 }} /></IconButton></Tooltip>
                                                )}
                                                <Tooltip title={expandRow === row.id ? "Collapse" : "Expand"}>
                                                    <IconButton size="small" onClick={() => setExpandRow(expandRow === row.id ? null : row.id)} sx={{ borderRadius: "8px", color: T.textMute, "&:hover": { bgcolor: T.bg } }}>
                                                        {expandRow === row.id ? <ExpandLess sx={{ fontSize: 16 }} /> : <ExpandMore sx={{ fontSize: 16 }} />}
                                                    </IconButton>
                                                </Tooltip>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell colSpan={7} sx={{ p: 0, border: "none" }}>
                                            <Collapse in={expandRow === row.id} timeout="auto" unmountOnExit>
                                                <Box sx={{ px: 3, py: 2.5, bgcolor: "#FAFBFD", borderBottom: `1px solid ${T.border}`, borderTop: `1px dashed ${T.border}` }}>
                                                    <Grid container spacing={3}>
                                                        <Grid item xs={12} md={4}>
                                                            <SLabel>Request Details</SLabel>
                                                            <Box display="flex" flexDirection="column" gap={1} mt={1}>
                                                                {[{ k: "Applied On", v: row.applied }, { k: "Lab", v: row.lab }, { k: "Date", v: row.date }, { k: "Time Slot", v: row.time }, { k: "Students", v: `${row.students} students` }].map(item => (
                                                                    <Box key={item.k} display="flex" gap={1}><Typography sx={{ fontFamily: fontBody, fontSize: "0.76rem", color: T.textMute, minWidth: 90 }}>{item.k}</Typography><Typography sx={{ fontFamily: fontBody, fontSize: "0.76rem", color: T.text, fontWeight: 500 }}>{item.v}</Typography></Box>
                                                                ))}
                                                            </Box>
                                                        </Grid>
                                                        <Grid item xs={12} md={4}>
                                                            <SLabel>Software Requirements</SLabel>
                                                            <Box mt={1} display="flex" flexWrap="wrap" gap={1}>
                                                                {row.software.length > 0 ? row.software.map(s => <Chip key={s} label={s} size="small" sx={{ fontFamily: fontMono, fontWeight: 600, fontSize: "0.7rem", bgcolor: T.accentLight, color: T.accent }} />) : <Typography sx={{ fontFamily: fontBody, fontSize: "0.75rem", color: T.textMute }}>None specified</Typography>}
                                                            </Box>
                                                        </Grid>
                                                        <Grid item xs={12} md={4}>
                                                            {row.conflict && (
                                                                <Box p={1.5} sx={{ bgcolor: T.dangerLight, borderRadius: "8px", border: `1px solid ${T.danger}30` }}>
                                                                    <Typography sx={{ fontFamily: fontBody, fontSize: "0.75rem", color: T.danger, fontWeight: 600 }}>⚠ Conflict: Another lab booking overlaps on {row.date}. Approval may disrupt scheduled sessions.</Typography>
                                                                </Box>
                                                            )}
                                                        </Grid>
                                                    </Grid>
                                                </Box>
                                            </Collapse>
                                        </TableCell>
                                    </TableRow>
                                </React.Fragment>
                            ))}
                        </TableBody>
                    </Table>
                </Box>
                <Box display="flex" justifyContent="space-between" alignItems="center" px={2.5} py={2}>
                    <Typography sx={{ fontFamily: fontBody, fontSize: "0.76rem", color: T.textMute }}>Showing {filtered.length} of {REQUESTS.length} requests</Typography>
                    <Box display="flex" gap={1}><IconButton size="small" sx={{ border: `1px solid ${T.border}`, borderRadius: "8px" }}><ChevronLeft sx={{ fontSize: 16 }} /></IconButton><IconButton size="small" sx={{ border: `1px solid ${T.border}`, borderRadius: "8px" }}><ChevronRight sx={{ fontSize: 16 }} /></IconButton></Box>
                </Box>
            </Card>

            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} PaperProps={{ sx: { borderRadius: "16px", width: 460, border: `1px solid ${T.border}`, boxShadow: "0 20px 60px rgba(0,0,0,0.12)" } }}>
                <DialogTitle sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1rem", color: T.text, pb: 1, pt: 3, px: 3 }}>{dialogData?.action === "approve" ? "Approve Lab Request" : dialogData?.action === "reject" ? "Reject Lab Request" : "Request Clarification"}</DialogTitle>
                <DialogContent sx={{ px: 3, pb: 1 }}>
                    {dialogData && (
                        <Box>
                            <Box sx={{ p: 2, borderRadius: "10px", bgcolor: T.bg, border: `1px solid ${T.border}`, mb: 2 }}>
                                <Typography sx={{ fontFamily: fontBody, fontWeight: 600, fontSize: "0.85rem", color: T.text }}>{dialogData.row.requester}</Typography>
                                <Typography sx={{ fontFamily: fontBody, fontSize: "0.75rem", color: T.textMute, mt: 0.3 }}>{dialogData.row.lab} · {dialogData.row.date} · {dialogData.row.time}</Typography>
                            </Box>
                            {dialogData.action === "approve" && dialogData.row.conflict && <Alert severity="warning" sx={{ mb: 2, borderRadius: "10px", fontFamily: fontBody, fontSize: "0.78rem" }}>Approving this creates a scheduling conflict on {dialogData.row.date}.</Alert>}
                            <SLabel sx={{ mb: 0.8 }}>{dialogData.action === "clarify" ? "Clarification Message" : "Remarks (optional)"}</SLabel>
                            <TextField fullWidth multiline rows={3} size="small" placeholder={dialogData.action === "clarify" ? "Specify what information is needed..." : "Add remarks..."} sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px", fontFamily: fontBody, "& fieldset": { borderColor: T.border }, "&.Mui-focused fieldset": { borderColor: T.accent } } }} />
                        </Box>
                    )}
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
                    <Button onClick={() => setDialogOpen(false)} variant="outlined" sx={{ fontFamily: fontBody, fontWeight: 600, fontSize: "0.8rem", textTransform: "none", borderRadius: "8px", borderColor: T.border, color: T.textSub }}>Cancel</Button>
                    <Button variant="contained" sx={{ fontFamily: fontBody, fontWeight: 700, fontSize: "0.8rem", textTransform: "none", borderRadius: "8px", boxShadow: "none", background: dialogData?.action === "approve" ? T.success : dialogData?.action === "reject" ? T.danger : T.info, "&:hover": { boxShadow: "none", filter: "brightness(0.9)" } }}
                        startIcon={dialogData?.action === "approve" ? <CheckCircle /> : dialogData?.action === "reject" ? <Cancel /> : <Send />}>
                        {dialogData?.action === "approve" ? "Confirm Approve" : dialogData?.action === "reject" ? "Confirm Reject" : "Send Request"}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default LabBooking;
