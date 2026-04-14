import React, { useState } from "react";
import {
    Box, Card, Grid, Typography, Button, TextField, Table, TableBody, TableCell, TableHead, TableRow,
    InputAdornment, IconButton, Chip, Tabs, Tab, Snackbar, Alert
} from "@mui/material";
import {
    Search, AccessTime, CheckCircle, Cancel, Save, History, Domain, Hotel, Male, Female, People
} from "@mui/icons-material";

/* ── Design Tokens ── */
const T = {
    bg: "#F5F7FA", surface: "#FFFFFF", border: "#E4E8EF", text: "#111827", textSub: "#4B5563", textMute: "#9CA3AF",
    accent: "#6366F1", accentLight: "#EEF2FF", success: "#10B981", successLight: "#ECFDF5",
    warning: "#F59E0B", warningLight: "#FFFBEB", danger: "#EF4444", dangerLight: "#FEF2F2",
    info: "#3B82F6", infoLight: "#EFF6FF", purple: "#8B5CF6", purpleLight: "#F5F3FF",
    pink: "#EC4899", pinkLight: "#FDF2F8"
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

const MOCK_RESIDENTS = [
    { id: "STU-2101", name: "Rahul Sharma", type: "Boys", block: "Block A", room: "A-101", status: "Present", leaveApproved: false },
    { id: "STU-2102", name: "Priya Patel", type: "Girls", block: "Block B", room: "B-205", status: "Absent", leaveApproved: false },
    { id: "STU-2105", name: "Vikram Kumar", type: "Boys", block: "Block A", room: "A-105", status: "On Leave", leaveApproved: true },
    { id: "STU-2108", name: "Neha Singh", type: "Girls", block: "Block B", room: "B-304", status: "Present", leaveApproved: false },
    { id: "STU-2110", name: "Arjun Reddy", type: "Boys", block: "Block C", room: "C-112", status: "Unmarked", leaveApproved: false },
    { id: "STU-2115", name: "Riya Verma", type: "Girls", block: "Block C", room: "C-201", status: "Unmarked", leaveApproved: false }
];

const StatCard = ({ label, value, sub, color, icon: Icon, bgLight }) => (
    <Card className="fade-up" sx={{ p: 2.5, borderRadius: "14px", border: `1px solid ${T.border}`, background: T.surface, boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
            <Box>
                <Typography sx={{ fontFamily: fontBody, fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: T.textMute, mb: 0.5 }}>{label}</Typography>
                <Typography sx={{ fontFamily: fontMono, fontWeight: 700, fontSize: "1.8rem", color: color || T.text, lineHeight: 1.1 }}>{value}</Typography>
                {sub && <Typography sx={{ fontFamily: fontBody, fontSize: "0.72rem", color: T.textMute, mt: 0.4 }}>{sub}</Typography>}
            </Box>
            {Icon && <Box sx={{ p: 1.2, borderRadius: "10px", bgcolor: bgLight || `${color}15`, color: color }}><Icon sx={{ fontSize: 22 }} /></Box>}
        </Box>
    </Card>
);

const StatusChip = ({ status, isApproved }) => {
    const map = {
        "Present": { bg: T.successLight, color: T.success },
        "Absent": { bg: T.dangerLight, color: T.danger },
        "On Leave": { bg: T.purpleLight, color: T.purple },
        "Unmarked": { bg: T.bg, color: T.textSub },
    };
    const s = map[status];
    return (
        <Box display="flex" alignItems="center" gap={1}>
            <Chip label={status} size="small" sx={{ fontFamily: fontBody, fontWeight: 700, fontSize: "0.7rem", bgcolor: s.bg, color: s.color, height: 24, borderRadius: "6px", border: s.color !== T.textSub ? `1px solid ${s.color}30` : "none" }} />
            {isApproved && status === "On Leave" && <Chip label="Approved" size="small" sx={{ fontFamily: fontBody, fontWeight: 700, fontSize: "0.65rem", bgcolor: T.successLight, color: T.success, height: 20 }} />}
        </Box>
    );
};

export default function NightlyAttendance() {
    const [searchTerm, setSearchTerm] = useState("");
    const [activeBlock, setActiveBlock] = useState("All");
    const [hostelType, setHostelType] = useState("Boys");
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [attendance, setAttendance] = useState(MOCK_RESIDENTS);
    const [snack, setSnack] = useState({ open: false, msg: "" });

    const handleStatusChange = (id, newStatus) => {
        setAttendance(attendance.map(a => a.id === id ? { ...a, status: newStatus } : a));
    };

    const markAllPresent = () => {
        setAttendance(attendance.map(a => (a.status === "Unmarked" && a.type === hostelType) ? { ...a, status: "Present" } : a));
        setSnack({ open: true, msg: `All unmarked residents in ${hostelType} Hostel marked as Present.` });
    };

    const handleSaveRoll = () => {
        setSnack({ open: true, msg: "Nightly attendance roll saved successfully." });
    };

    const filtered = attendance.filter(r =>
        (r.type === hostelType) &&
        (activeBlock === "All" || r.block === activeBlock) &&
        (r.name.toLowerCase().includes(searchTerm.toLowerCase()) || r.room.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const stats = {
        total: attendance.filter(a => a.type === hostelType).length,
        present: attendance.filter(a => a.type === hostelType && a.status === "Present").length,
        absent: attendance.filter(a => a.type === hostelType && a.status === "Absent").length,
        leave: attendance.filter(a => a.type === hostelType && a.status === "On Leave").length,
        unmarked: attendance.filter(a => a.type === hostelType && a.status === "Unmarked").length
    };

    return (
        <Box sx={{ p: 3, background: T.bg, minHeight: "100vh", fontFamily: fontBody }}>
            <Fonts />
            <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3} className="fade-up">
                <Box>
                    <Typography sx={{ fontFamily: fontBody, fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: T.textMute, mb: 0.3 }}>Resident Management</Typography>
                    <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1.5rem", color: T.text, lineHeight: 1.1 }}>Nightly Attendance</Typography>
                    <Typography sx={{ fontFamily: fontBody, fontSize: "0.82rem", color: T.textSub, mt: 0.4 }}>Mark and review nightly attendance roll for all residents.</Typography>
                </Box>
                <Box display="flex" gap={1.5} alignItems="center">
                    <TextField type="date" size="small" value={date} onChange={e => setDate(e.target.value)} sx={{ width: 160, "& .MuiOutlinedInput-root": { borderRadius: "8px", fontFamily: fontMono, fontSize: "0.85rem", bgcolor: T.surface } }} />
                    <Button variant="contained" startIcon={<Save sx={{ fontSize: 16 }} />} onClick={handleSaveRoll} sx={{ fontFamily: fontBody, fontWeight: 700, fontSize: "0.8rem", textTransform: "none", borderRadius: "8px", bgcolor: T.accent, boxShadow: "none" }}>Save Roll</Button>
                </Box>
            </Box>

            <Box sx={{ borderBottom: 1, borderColor: T.border, mb: 3 }} className="fade-up">
                <Tabs value={hostelType} onChange={(e, v) => setHostelType(v)} TabIndicatorProps={{ sx: { bgcolor: hostelType === "Girls" ? T.pink : T.info, height: 3, borderRadius: "3px 3px 0 0" } }} sx={{ "& .MuiTab-root": { fontFamily: fontBody, fontWeight: 600, fontSize: "0.9rem", textTransform: "none", color: T.textSub, minWidth: 140, minHeight: 48 }, "& .Mui-selected": { color: `${hostelType === "Girls" ? T.pink : T.info} !important` } }}>
                    <Tab label={<Box display="flex" alignItems="center" gap={1}><Male fontSize="small" /> Boys Hostel</Box>} value="Boys" />
                    <Tab label={<Box display="flex" alignItems="center" gap={1}><Female fontSize="small" /> Girls Hostel</Box>} value="Girls" />
                </Tabs>
            </Box>

            <Grid container spacing={3} mb={3}>
                <Grid item xs={12} sm={6} md={2.4}><StatCard label="Total Residents" value={stats.total} color={T.text} bgLight="#E5E7EB" icon={Hotel} /></Grid>
                <Grid item xs={12} sm={6} md={2.4}><StatCard label="Present" value={stats.present} color={T.success} bgLight={T.successLight} icon={CheckCircle} /></Grid>
                <Grid item xs={12} sm={6} md={2.4}><StatCard label="Absent" value={stats.absent} color={T.danger} bgLight={T.dangerLight} icon={Cancel} /></Grid>
                <Grid item xs={12} sm={6} md={2.4}><StatCard label="On Leave" value={stats.leave} color={T.purple} bgLight={T.purpleLight} icon={History} /></Grid>
                <Grid item xs={12} sm={6} md={2.4}><StatCard label="Unmarked" value={stats.unmarked} color={T.warning} bgLight={T.warningLight} icon={AccessTime} /></Grid>
            </Grid>

            <Card className="fade-up" sx={{ borderRadius: "14px", border: `1px solid ${T.border}`, boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                <Box sx={{ borderBottom: `1px solid ${T.border}`, bgcolor: "#FAFBFD", px: 2 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2} pt={2}>
                        <Tabs value={activeBlock} onChange={(e, v) => setActiveBlock(v)} sx={{ minHeight: 40, "& .MuiTabs-indicator": { bgcolor: T.text, height: 3, borderRadius: "3px 3px 0 0" }, "& .MuiTab-root": { fontFamily: fontBody, fontWeight: 600, fontSize: "0.85rem", textTransform: "none", color: T.textMute, minHeight: 40, py: 1, "&.Mui-selected": { color: T.text } } }}>
                            <Tab icon={<Domain sx={{ fontSize: 18, mr: 0.5 }} />} iconPosition="start" label="All Blocks" value="All" />
                            <Tab label="Block A" value="Block A" />
                            <Tab label="Block B" value="Block B" />
                            <Tab label="Block C" value="Block C" />
                        </Tabs>
                        <Box pb={1.5} display="flex" gap={1.5}>
                            <Button onClick={markAllPresent} variant="outlined" sx={{ fontFamily: fontBody, fontWeight: 700, fontSize: "0.75rem", textTransform: "none", borderRadius: "8px", borderColor: T.success, color: T.success, "&:hover": { bgcolor: T.successLight } }}>Mark Remaining Present</Button>
                            <TextField size="small" placeholder="Search by name or room..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} InputProps={{ startAdornment: <InputAdornment position="start"><Search sx={{ fontSize: 16, color: T.textMute }} /></InputAdornment> }} sx={{ width: 240, "& .MuiOutlinedInput-root": { borderRadius: "8px", fontFamily: fontBody, fontSize: "0.8rem", bgcolor: T.surface } }} />
                        </Box>
                    </Box>
                </Box>
                <Table>
                    <TableHead><TableRow sx={{ bgcolor: "#F9FAFB" }}>
                        {["Resident Details", "Room & Block", "Division", "Current Status", "Mark Attendance"].map(h => <TableCell key={h} sx={{ fontFamily: fontBody, fontWeight: 700, fontSize: "0.72rem", color: T.textMute, textTransform: "uppercase", py: 1.5, ...(h === "Mark Attendance" ? { textAlign: "right" } : {}) }}>{h}</TableCell>)}
                    </TableRow></TableHead>
                    <TableBody>
                        {filtered.length > 0 ? filtered.map(row => (
                            <TableRow key={row.id} className="row-hover">
                                <TableCell>
                                    <Typography sx={{ fontFamily: fontBody, fontWeight: 700, fontSize: "0.85rem", color: T.text }}>{row.name}</Typography>
                                    <Typography sx={{ fontFamily: fontMono, fontSize: "0.75rem", color: T.textSub }}>{row.id}</Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography sx={{ fontFamily: fontMono, fontSize: "0.85rem", fontWeight: 700, color: T.text }}>{row.room}</Typography>
                                    <Typography sx={{ fontFamily: fontBody, fontSize: "0.75rem", color: T.textSub }}>{row.block}</Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography sx={{ fontFamily: fontBody, fontSize: "0.7rem", fontWeight: 700, color: row.type === "Girls" ? T.pink : T.info, bgcolor: row.type === "Girls" ? T.pinkLight : T.infoLight, px: 0.8, py: 0.2, borderRadius: "4px", display: "inline-block" }}>{row.type} Hostel</Typography>
                                </TableCell>
                                <TableCell>
                                    <StatusChip status={row.status} isApproved={row.leaveApproved} />
                                </TableCell>
                                <TableCell sx={{ textAlign: "right", py: 1 }}>
                                    <Box display="flex" justifyContent="flex-end" gap={0.5}>
                                        <Button size="small" onClick={() => handleStatusChange(row.id, "Present")} sx={{ fontFamily: fontBody, fontWeight: 700, fontSize: "0.7rem", minWidth: 0, px: 1.5, borderRadius: "6px", bgcolor: row.status === "Present" ? T.success : "transparent", color: row.status === "Present" ? T.surface : T.textSub, border: `1px solid`, borderColor: row.status === "Present" ? T.success : T.border, "&:hover": { bgcolor: row.status === "Present" ? T.success : T.successLight, color: row.status === "Present" ? T.surface : T.success } }}>Present</Button>
                                        <Button size="small" onClick={() => handleStatusChange(row.id, "Absent")} sx={{ fontFamily: fontBody, fontWeight: 700, fontSize: "0.7rem", minWidth: 0, px: 1.5, borderRadius: "6px", bgcolor: row.status === "Absent" ? T.danger : "transparent", color: row.status === "Absent" ? T.surface : T.textSub, border: `1px solid`, borderColor: row.status === "Absent" ? T.danger : T.border, "&:hover": { bgcolor: row.status === "Absent" ? T.danger : T.dangerLight, color: row.status === "Absent" ? T.surface : T.danger } }}>Absent</Button>
                                        <Button size="small" onClick={() => handleStatusChange(row.id, "On Leave")} sx={{ fontFamily: fontBody, fontWeight: 700, fontSize: "0.7rem", minWidth: 0, px: 1.5, borderRadius: "6px", bgcolor: row.status === "On Leave" ? T.purple : "transparent", color: row.status === "On Leave" ? T.surface : T.textSub, border: `1px solid`, borderColor: row.status === "On Leave" ? T.purple : T.border, "&:hover": { bgcolor: row.status === "On Leave" ? T.purple : T.purpleLight, color: row.status === "On Leave" ? T.surface : T.purple } }}>Leave</Button>
                                        <IconButton size="small" onClick={() => handleStatusChange(row.id, "Unmarked")} sx={{ color: T.textMute, ml: 1 }} title="Reset"><AccessTime sx={{ fontSize: 16 }} /></IconButton>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        )) : (
                            <TableRow><TableCell colSpan={5} sx={{ textAlign: "center", py: 4, color: T.textMute, fontFamily: fontBody }}>No residents found for the selected criteria.</TableCell></TableRow>
                        )}
                    </TableBody>
                </Table>
            </Card>

            <Snackbar open={snack.open} autoHideDuration={3000} onClose={() => setSnack({ open: false, msg: "" })} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
                <Alert severity="success" sx={{ borderRadius: "10px", fontFamily: fontBody, fontWeight: 600 }}>{snack.msg}</Alert>
            </Snackbar>
        </Box>
    );
}
