import React, { useState } from "react";
import {
    Box, Card, Grid, Typography, Button, TextField, MenuItem, Table, TableBody, TableCell, TableHead, TableRow,
    IconButton, InputAdornment, Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, Alert, Chip, Tabs, Tab
} from "@mui/material";
import {
    Search, FilterList, SyncAlt, Edit, DeleteOutline, Close, AccessTime, Flag, QrCodeScanner, History, Assessment, Male, Female, People
} from "@mui/icons-material";

/* ── Design Tokens ── */
const T = {
    bg: "#F5F7FA", surface: "#FFFFFF", border: "#E4E8EF", text: "#111827", textSub: "#4B5563", textMute: "#9CA3AF",
    accent: "#6366F1", accentLight: "#EEF2FF", success: "#10B981", successLight: "#ECFDF5",
    warning: "#F59E0B", warningLight: "#FFFBEB", danger: "#EF4444", dangerLight: "#FEF2F2",
    info: "#3B82F6", infoLight: "#EFF6FF", purple: "#8B5CF6", purpleLight: "#F5F3FF",
    orange: "#F97316", orangeLight: "#FFEDD5", pink: "#EC4899", pinkLight: "#FDF2F8"
};
const fontHead = "Sora, Roboto, Helvetica, Arial, sans-serif";
const fontBody = "Nunito, Roboto, Helvetica, Arial, sans-serif";
const fontMono = "JetBrains Mono, monospace";

const Fonts = () => (
    <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700&family=Nunito:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600&display=swap');
    * { box-sizing: border-box; }
    @keyframes fadeUp { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:none; } }
    .fade-up { animation: fadeUp 0.35s ease both; }
    .row-hover:hover { background: #F9FAFB !important; transition: background 0.15s; }
  `}</style>
);

const SLabel = ({ children, sx = {} }) => <Typography sx={{ fontFamily: fontBody, fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: T.textMute, mb: 0.5, ...sx }}>{children}</Typography>;
const DInput = ({ sx = {}, ...props }) => <TextField size="small" fullWidth {...props} sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px", fontFamily: fontBody, fontSize: "0.82rem", bgcolor: T.surface, "& fieldset": { borderColor: T.border }, "&.Mui-focused fieldset": { borderColor: T.accent } }, "& .MuiInputLabel-root.Mui-focused": { color: T.accent }, ...sx }} />;

const StatusPill = ({ status }) => {
    const map = {
        "In": { bg: T.successLight, color: T.success },
        "Out": { bg: T.bg, color: T.textSub },
        "Late Entry": { bg: T.dangerLight, color: T.danger },
        "Overstaying": { bg: T.warningLight, color: T.warning },
        "On Time": { bg: T.successLight, color: T.success },
        "Flagged": { bg: T.orangeLight, color: T.orange },
    };
    const s = map[status] || { bg: T.bg, color: T.textSub };
    return (
        <Box sx={{ px: 1.2, py: 0.4, borderRadius: "6px", bgcolor: s.bg, width: "fit-content", display: "inline-block", border: `1px solid ${s.color}30` }}>
            <Typography sx={{ fontFamily: fontBody, fontSize: "0.7rem", fontWeight: 700, color: s.color }}>{status}</Typography>
        </Box>
    );
};

const StatCard = ({ label, value, sub, color, icon: Icon, bgLight }) => (
    <Card className="fade-up" sx={{ p: 2.5, borderRadius: "14px", border: `1px solid ${T.border}`, background: T.surface, boxShadow: "0 1px 4px rgba(0,0,0,0.04)", height: "100%" }}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
            <Box>
                <SLabel>{label}</SLabel>
                <Typography sx={{ fontFamily: fontMono, fontWeight: 700, fontSize: "1.8rem", color: color || T.text, lineHeight: 1.1 }}>{value}</Typography>
                {sub && <Typography sx={{ fontFamily: fontBody, fontSize: "0.72rem", color: T.textMute, mt: 0.4 }}>{sub}</Typography>}
            </Box>
            {Icon && <Box sx={{ p: 1.2, borderRadius: "10px", bgcolor: bgLight || `${color}15`, color: color }}><Icon sx={{ fontSize: 22 }} /></Box>}
        </Box>
    </Card>
);

const initialLogs = [
    { id: 101, date: "2024-04-14", time: "10:15 AM", studentName: "Rahul Sharma", studentId: "STU-2101", hostel: "Boys Hostel A", type: "Boys", direction: "Out", passType: "Regular", status: "On Time", gate: "North Gate", comments: "" },
    { id: 102, date: "2024-04-14", time: "11:20 PM", studentName: "Priya Patel", studentId: "STU-2102", hostel: "Girls Hostel B", type: "Girls", direction: "In", passType: "Night Out", status: "Late Entry", gate: "Main Gate", comments: "Arrived past curfew." },
    { id: 103, date: "2024-04-14", time: "05:00 PM", studentName: "Vikram Kumar", studentId: "STU-2105", hostel: "Boys Hostel C", type: "Boys", direction: "Out", passType: "Home Visit", status: "On Time", gate: "South Gate", comments: "Approved by HOD." },
    { id: 104, date: "2024-04-14", time: "09:30 AM", studentName: "Neha Singh", studentId: "STU-2108", hostel: "Girls Hostel A", type: "Girls", direction: "In", passType: "Regular", status: "On Time", gate: "Main Gate", comments: "" },
    { id: 105, date: "2024-04-13", time: "08:15 PM", studentName: "Arjun Reddy", studentId: "STU-2110", hostel: "Boys Hostel B", type: "Boys", direction: "Out", passType: "Emergency", status: "Flagged", gate: "Main Gate", comments: "Medical emergency." },
];

export default function EntryExitLog() {
    const [searchTerm, setSearchTerm] = useState("");
    const [viewMode, setViewMode] = useState("Live");
    const [hostelType, setHostelType] = useState("All");
    const [logs, setLogs] = useState(initialLogs);
    const [modal, setModal] = useState({ open: false, data: null });
    const [snack, setSnack] = useState({ open: false, msg: "" });

    const handleSave = () => {
        if (!modal.data.id) {
            setLogs([{ id: Date.now(), ...modal.data, date: new Date().toISOString().split('T')[0] }, ...logs]);
        } else {
            setLogs(logs.map(l => l.id === modal.data.id ? modal.data : l));
        }
        setSnack({ open: true, msg: "Log entry saved successfully." });
        setModal({ open: false, data: null });
    };

    const displayLogs = logs.filter(r =>
        (hostelType === "All" || r.type === hostelType) &&
        (viewMode === "Live" ? r.date === "2024-04-14" : true) &&
        (r.studentName.toLowerCase().includes(searchTerm.toLowerCase()) || r.studentId.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <Box sx={{ p: 3, background: T.bg, minHeight: "100vh", fontFamily: fontBody }}>
            <Fonts />
            <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3} className="fade-up">
                <Box>
                    <Typography sx={{ fontFamily: fontBody, fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: T.textMute, mb: 0.3 }}>Resident Management</Typography>
                    <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1.5rem", color: T.text, lineHeight: 1.1 }}>Entry & Exit Log</Typography>
                    <Typography sx={{ fontFamily: fontBody, fontSize: "0.82rem", color: T.textSub, mt: 0.4 }}>Live and historical tracking of student movement, passes, and curfew compliance.</Typography>
                </Box>
                <Box display="flex" gap={1.5}>
                    <Button variant="outlined" startIcon={<QrCodeScanner sx={{ fontSize: 16 }} />} sx={{ fontFamily: fontBody, fontWeight: 700, fontSize: "0.8rem", textTransform: "none", borderRadius: "8px", borderColor: T.border, color: T.textSub }}>Simulate ID Scan</Button>
                    <Button variant="contained" startIcon={<SyncAlt sx={{ fontSize: 16 }} />} onClick={() => setModal({ open: true, data: { direction: "In", passType: "Regular", status: "On Time", type: hostelType === "All" ? "Boys" : hostelType, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) } })} sx={{ fontFamily: fontBody, fontWeight: 700, fontSize: "0.8rem", textTransform: "none", borderRadius: "8px", bgcolor: T.accent, boxShadow: "none" }}>Log Manual Entry</Button>
                </Box>
            </Box>

            <Box sx={{ borderBottom: 1, borderColor: T.border, mb: 3 }} className="fade-up">
                <Tabs value={hostelType} onChange={(e, v) => setHostelType(v)} TabIndicatorProps={{ sx: { bgcolor: hostelType === "Girls" ? T.pink : (hostelType === "Boys" ? T.info : T.accent), height: 3, borderRadius: "3px 3px 0 0" } }} sx={{ "& .MuiTab-root": { fontFamily: fontBody, fontWeight: 600, fontSize: "0.9rem", textTransform: "none", color: T.textSub, minWidth: 140, minHeight: 48 }, "& .Mui-selected": { color: `${hostelType === "Girls" ? T.pink : (hostelType === "Boys" ? T.info : T.accent)} !important` } }}>
                    <Tab label={<Box display="flex" alignItems="center" gap={1}><People fontSize="small" /> All Records</Box>} value="All" />
                    <Tab label={<Box display="flex" alignItems="center" gap={1}><Male fontSize="small" /> Boys Hostel</Box>} value="Boys" />
                    <Tab label={<Box display="flex" alignItems="center" gap={1}><Female fontSize="small" /> Girls Hostel</Box>} value="Girls" />
                </Tabs>
            </Box>

            <Grid container spacing={3} mb={3}>
                <Grid item xs={12} sm={6} md={3}><StatCard label="Outside Campus" value="128" sub="Based on active Out passes" color={T.accent} bgLight={T.accentLight} icon={SyncAlt} /></Grid>
                <Grid item xs={12} sm={6} md={3}><StatCard label="Curfew Violations" value="14" sub="Late entries this week" color={T.danger} bgLight={T.dangerLight} icon={AccessTime} /></Grid>
                <Grid item xs={12} sm={6} md={3}><StatCard label="Active Home Visits" value="32" sub="Approved multi-day passes" color={T.info} bgLight={T.infoLight} icon={Assessment} /></Grid>
                <Grid item xs={12} sm={6} md={3}><StatCard label="Emergency Exits" value="2" sub="Flagged this month" color={T.orange} bgLight={T.orangeLight} icon={Flag} /></Grid>
            </Grid>

            <Card className="fade-up" sx={{ borderRadius: "14px", border: `1px solid ${T.border}`, boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                <Box sx={{ borderBottom: `1px solid ${T.border}`, bgcolor: "#FAFBFD", px: 2 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2} pt={2}>
                        <Tabs value={viewMode} onChange={(e, v) => setViewMode(v)} sx={{ minHeight: 40, "& .MuiTabs-indicator": { bgcolor: T.text, height: 3, borderRadius: "3px 3px 0 0" }, "& .MuiTab-root": { fontFamily: fontBody, fontWeight: 600, fontSize: "0.85rem", textTransform: "none", color: T.textMute, minHeight: 40, py: 1, "&.Mui-selected": { color: T.text } } }}>
                            <Tab icon={<SyncAlt sx={{ fontSize: 18, mr: 0.5 }} />} iconPosition="start" label="Live Today" value="Live" />
                            <Tab icon={<History sx={{ fontSize: 18, mr: 0.5 }} />} iconPosition="start" label="Historical Record" value="Archive" />
                        </Tabs>
                        <Box pb={1.5} display="flex" gap={1.5}>
                            <TextField size="small" placeholder="Search by name or ID..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} InputProps={{ startAdornment: <InputAdornment position="start"><Search sx={{ fontSize: 16, color: T.textMute }} /></InputAdornment> }} sx={{ width: 260, "& .MuiOutlinedInput-root": { borderRadius: "8px", fontFamily: fontBody, fontSize: "0.8rem", bgcolor: T.surface } }} />
                            <Button variant="outlined" sx={{ minWidth: 0, p: 1, borderRadius: "8px", borderColor: T.border, color: T.textSub, bgcolor: T.surface }}><FilterList sx={{ fontSize: 18 }} /></Button>
                        </Box>
                    </Box>
                </Box>
                <Table>
                    <TableHead><TableRow sx={{ bgcolor: "#F9FAFB" }}>
                        {["Student Detail", "Date & Time", "Hostel", "Direction", "Pass Type", "Status Indicator", "Actions"].map(h => <TableCell key={h} sx={{ fontFamily: fontBody, fontWeight: 700, fontSize: "0.72rem", color: T.textMute, textTransform: "uppercase", py: 1.5, ...(h === "Actions" ? { textAlign: "right" } : {}) }}>{h}</TableCell>)}
                    </TableRow></TableHead>
                    <TableBody>
                        {displayLogs.length > 0 ? displayLogs.map(row => (
                            <TableRow key={row.id} className="row-hover">
                                <TableCell>
                                    <Typography sx={{ fontFamily: fontBody, fontWeight: 700, fontSize: "0.85rem", color: T.text }}>{row.studentName}</Typography>
                                    <Typography sx={{ fontFamily: fontMono, fontSize: "0.75rem", color: T.textSub }}>{row.studentId}</Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography sx={{ fontFamily: fontMono, fontSize: "0.8rem", color: T.textSub }}>{row.date}</Typography>
                                    <Typography sx={{ fontFamily: fontMono, fontSize: "0.85rem", fontWeight: 700, color: T.text }}>{row.time}</Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography sx={{ fontFamily: fontBody, fontSize: "0.82rem", color: T.textSub }}>{row.hostel}</Typography>
                                    <Typography sx={{ fontFamily: fontBody, fontSize: "0.7rem", fontWeight: 700, color: row.type === "Girls" ? T.pink : T.info, bgcolor: row.type === "Girls" ? T.pinkLight : T.infoLight, px: 0.8, py: 0.2, borderRadius: "4px", display: "inline-block", mt: 0.5 }}>{row.type}</Typography>
                                </TableCell>
                                <TableCell>
                                    <Chip label={row.direction} size="small" sx={{ fontFamily: fontBody, fontWeight: 700, fontSize: "0.7rem", bgcolor: row.direction === "In" ? T.successLight : T.bg, color: row.direction === "In" ? T.success : T.textSub, borderRadius: "6px" }} />
                                </TableCell>
                                <TableCell sx={{ fontFamily: fontBody, fontSize: "0.82rem", color: T.text }}>{row.passType}</TableCell>
                                <TableCell>
                                    <StatusPill status={row.status} />
                                    {row.comments && <Typography sx={{ fontFamily: fontBody, fontSize: "0.7rem", color: T.textMute, mt: 0.5, maxWidth: 200 }} className="line-clamp-1">{row.comments}</Typography>}
                                </TableCell>
                                <TableCell sx={{ textAlign: "right", py: 1 }}>
                                    <IconButton size="small" onClick={() => setModal({ open: true, data: row })} sx={{ color: T.textMute }}><Edit sx={{ fontSize: 16 }} /></IconButton>
                                </TableCell>
                            </TableRow>
                        )) : (
                            <TableRow><TableCell colSpan={7} sx={{ textAlign: "center", py: 4, color: T.textMute, fontFamily: fontBody }}>No movement logs found for the selected criteria.</TableCell></TableRow>
                        )}
                    </TableBody>
                </Table>
            </Card>

            <Dialog open={modal.open} onClose={() => setModal({ open: false, data: null })} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: "16px", border: `1px solid ${T.border}` } }}>
                <DialogTitle sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1.1rem", color: T.text, borderBottom: `1px solid ${T.border}`, bgcolor: "#FAFBFD", pb: 2 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Box>{modal.data?.id ? "Edit Log Entry" : "Manual Entry & Exit Log"}</Box>
                        <IconButton size="small" onClick={() => setModal({ open: false, data: null })}><Close fontSize="small" /></IconButton>
                    </Box>
                </DialogTitle>
                <DialogContent sx={{ px: 3, pt: 3, pb: 2 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={6}><SLabel>Student ID</SLabel><DInput value={modal.data?.studentId || ""} onChange={e => setModal({ ...modal, data: { ...modal.data, studentId: e.target.value } })} /></Grid>
                        <Grid item xs={6}><SLabel>Student Name</SLabel><DInput value={modal.data?.studentName || ""} onChange={e => setModal({ ...modal, data: { ...modal.data, studentName: e.target.value } })} /></Grid>
                        <Grid item xs={6}>
                            <SLabel>Hostel Division</SLabel>
                            <DInput select value={modal.data?.type || "Boys"} onChange={e => setModal({ ...modal, data: { ...modal.data, type: e.target.value } })}>
                                {["Boys", "Girls"].map(s => <MenuItem key={s} value={s} sx={{ fontFamily: fontBody, fontSize: "0.85rem" }}>{s} Hostel</MenuItem>)}
                            </DInput>
                        </Grid>
                        <Grid item xs={6}>
                            <SLabel>Hostel Block</SLabel>
                            <DInput select value={modal.data?.hostel || ""} onChange={e => setModal({ ...modal, data: { ...modal.data, hostel: e.target.value } })}>
                                {["Boys Hostel A", "Boys Hostel B", "Girls Hostel A", "Girls Hostel B"].map(s => <MenuItem key={s} value={s} sx={{ fontFamily: fontBody, fontSize: "0.85rem" }}>{s}</MenuItem>)}
                            </DInput>
                        </Grid>
                        <Grid item xs={6}>
                            <SLabel>Direction</SLabel>
                            <DInput select value={modal.data?.direction || "In"} onChange={e => setModal({ ...modal, data: { ...modal.data, direction: e.target.value } })}>
                                {["In", "Out"].map(s => <MenuItem key={s} value={s} sx={{ fontFamily: fontBody, fontSize: "0.85rem" }}>{s}</MenuItem>)}
                            </DInput>
                        </Grid>
                        <Grid item xs={6}>
                            <SLabel>Pass Category</SLabel>
                            <DInput select value={modal.data?.passType || "Regular"} onChange={e => setModal({ ...modal, data: { ...modal.data, passType: e.target.value } })}>
                                {["Regular", "Night Out", "Home Visit", "Emergency"].map(s => <MenuItem key={s} value={s} sx={{ fontFamily: fontBody, fontSize: "0.85rem" }}>{s}</MenuItem>)}
                            </DInput>
                        </Grid>
                        <Grid item xs={6}><SLabel>Time</SLabel><DInput type="time" value={modal.data?.time || ""} onChange={e => setModal({ ...modal, data: { ...modal.data, time: e.target.value } })} InputLabelProps={{ shrink: true }} /></Grid>
                        <Grid item xs={6}>
                            <SLabel>Status Evaluation</SLabel>
                            <DInput select value={modal.data?.status || "On Time"} onChange={e => setModal({ ...modal, data: { ...modal.data, status: e.target.value } })}>
                                {["On Time", "Late Entry", "Overstaying", "Flagged"].map(s => <MenuItem key={s} value={s} sx={{ fontFamily: fontBody, fontSize: "0.85rem" }}>{s}</MenuItem>)}
                            </DInput>
                        </Grid>
                        <Grid item xs={12}><SLabel>Log Comments (Optional)</SLabel><DInput value={modal.data?.comments || ""} onChange={e => setModal({ ...modal, data: { ...modal.data, comments: e.target.value } })} placeholder="Add reason for late entry or emergency..." /></Grid>
                    </Grid>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 3, borderTop: `1px solid ${T.border}`, pt: 2, bgcolor: "#FAFBFD" }}>
                    <Button onClick={() => setModal({ open: false, data: null })} variant="outlined" sx={{ fontFamily: fontBody, fontWeight: 600, fontSize: "0.8rem", textTransform: "none", borderRadius: "8px", borderColor: T.border, color: T.textSub }}>Cancel</Button>
                    <Button variant="contained" onClick={handleSave} sx={{ fontFamily: fontBody, fontWeight: 700, fontSize: "0.8rem", textTransform: "none", borderRadius: "8px", bgcolor: T.accent, boxShadow: "none" }}>Save Log Record</Button>
                </DialogActions>
            </Dialog>
            <Snackbar open={snack.open} autoHideDuration={3000} onClose={() => setSnack({ open: false, msg: "" })} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
                <Alert severity="success" sx={{ borderRadius: "10px", fontFamily: fontBody, fontWeight: 600 }}>{snack.msg}</Alert>
            </Snackbar>
        </Box>
    );
}
