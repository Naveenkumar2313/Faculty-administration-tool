import React, { useState } from "react";
import {
    Box, Card, Grid, Typography, Button, TextField, MenuItem, Table, TableBody, TableCell, TableHead, TableRow,
    IconButton, InputAdornment, Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, Alert
} from "@mui/material";
import {
    Search, FilterList, SyncAlt, Edit, DeleteOutline, Close, AccessTime
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
    .fade-up { animation: fadeUp 0.35s ease both; }
    .row-hover:hover { background: #F9FAFB !important; transition: background 0.15s; }
  `}</style>
);

const SLabel = ({ children, sx = {} }) => <Typography sx={{ fontFamily: fontBody, fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: T.textMute, mb: 0.5, ...sx }}>{children}</Typography>;
const DInput = ({ sx = {}, ...props }) => <TextField size="small" fullWidth {...props} sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px", fontFamily: fontBody, fontSize: "0.82rem", bgcolor: T.surface, "& fieldset": { borderColor: T.border }, "&.Mui-focused fieldset": { borderColor: T.accent } }, "& .MuiInputLabel-root.Mui-focused": { color: T.accent }, ...sx }} />;

const StatusPill = ({ status }) => {
    const map = {
        In: { bg: T.successLight, color: T.success },
        Out: { bg: T.bg, color: T.textSub },
    };
    const s = map[status] || { bg: T.bg, color: T.textSub };
    return (
        <Box sx={{ px: 1.2, py: 0.4, borderRadius: "6px", bgcolor: s.bg, width: "fit-content", display: "inline-block" }}>
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
    { id: 1, studentName: "Rahul Sharma", rollNo: "CS21045", block: "Boys Hostel A", type: "Out", time: "10:15 AM", reason: "Classes", gate: "Main Gate" },
    { id: 2, studentName: "Priya Patel", rollNo: "EC21012", block: "Girls Hostel G1", type: "In", time: "10:05 AM", reason: "Return from market", gate: "Hostel Gate" },
    { id: 3, studentName: "Amit Kumar", rollNo: "ME21089", block: "Boys Hostel B", type: "Out", time: "09:45 AM", reason: "Medical", gate: "Main Gate" },
    { id: 4, studentName: "Neha Singh", rollNo: "CE21034", block: "Girls Hostel G1", type: "In", time: "09:30 AM", reason: "Classes", gate: "Hostel Gate" },
    { id: 5, studentName: "Vikram Singh", rollNo: "CS21056", block: "Boys Hostel A", type: "Out", time: "09:15 AM", reason: "Home Visit", gate: "Main Gate" },
];

export default function HostelEntryExit() {
    const [searchTerm, setSearchTerm] = useState("");
    const [logs, setLogs] = useState(initialLogs);
    const [modal, setModal] = useState({ open: false, data: null });
    const [snack, setSnack] = useState({ open: false, msg: "" });

    const handleSave = () => {
        setSnack({ open: true, msg: "Log entry saved successfully." });
        setModal({ open: false, data: null });
    };

    return (
        <Box sx={{ p: 3, background: T.bg, minHeight: "100vh", fontFamily: fontBody }}>
            <Fonts />

            {/* ── Header ── */}
            <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3} className="fade-up">
                <Box>
                    <Typography sx={{ fontFamily: fontBody, fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: T.textMute, mb: 0.3 }}>Hostel Management</Typography>
                    <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1.5rem", color: T.text, lineHeight: 1.1 }}>Entry & Exit Records</Typography>
                    <Typography sx={{ fontFamily: fontBody, fontSize: "0.82rem", color: T.textSub, mt: 0.4 }}>Monitor student movements in and out of the hostels.</Typography>
                </Box>
                <Button variant="contained" startIcon={<SyncAlt sx={{ fontSize: 16 }} />} onClick={() => setModal({ open: true, data: { type: "In", time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) } })} sx={{ fontFamily: fontBody, fontWeight: 700, fontSize: "0.8rem", textTransform: "none", borderRadius: "8px", bgcolor: T.accent, boxShadow: "none" }}>Log Manual Entry</Button>
            </Box>

            {/* ── Stat Cards ── */}
            <Grid container spacing={3} mb={3}>
                <Grid item xs={12} sm={6} md={4}><StatCard label="Students Outside" value="145" sub="Currently outside campus/hostel" color={T.accent} bgLight={T.accentLight} icon={SyncAlt} /></Grid>
                <Grid item xs={12} sm={6} md={4}><StatCard label="Late Entries (Today)" value="12" sub="After curfew time" color={T.danger} bgLight={T.dangerLight} icon={AccessTime} /></Grid>
                <Grid item xs={12} sm={6} md={4}><StatCard label="Night Outs Active" value="45" sub="Approved overnight leaves" color={T.info} bgLight={T.infoLight} icon={SyncAlt} /></Grid>
            </Grid>

            {/* ── Table Container ── */}
            <Card className="fade-up" sx={{ borderRadius: "14px", border: `1px solid ${T.border}`, boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                <Box sx={{ p: 2.5, borderBottom: `1px solid ${T.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
                    <Box>
                        <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1.1rem" }}>Movement Logs</Typography>
                        <Typography sx={{ fontFamily: fontBody, fontSize: "0.78rem", color: T.textMute }}>Recent entry and exit activities.</Typography>
                    </Box>
                    <Box display="flex" gap={1.5}>
                        <TextField size="small" placeholder="Search by name or roll no..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} InputProps={{ startAdornment: <InputAdornment position="start"><Search sx={{ fontSize: 16, color: T.textMute }} /></InputAdornment> }} sx={{ width: 260, "& .MuiOutlinedInput-root": { borderRadius: "8px", fontFamily: fontBody, fontSize: "0.8rem" } }} />
                        <Button variant="outlined" sx={{ minWidth: 0, p: 1, borderRadius: "8px", borderColor: T.border, color: T.textSub }}><FilterList sx={{ fontSize: 18 }} /></Button>
                    </Box>
                </Box>
                <Table>
                    <TableHead><TableRow sx={{ bgcolor: "#F9FAFB" }}>
                        {["Student Name", "Roll No", "Hostel Block", "Type", "Time", "Reason", "Gate", "Actions"].map(h => <TableCell key={h} sx={{ fontFamily: fontBody, fontWeight: 700, fontSize: "0.72rem", color: T.textMute, textTransform: "uppercase", py: 1.5, ...(h === "Actions" ? { textAlign: "right" } : {}) }}>{h}</TableCell>)}
                    </TableRow></TableHead>
                    <TableBody>
                        {logs.filter(r => r.studentName.toLowerCase().includes(searchTerm.toLowerCase()) || r.rollNo.toLowerCase().includes(searchTerm.toLowerCase())).map(row => (
                            <TableRow key={row.id} className="row-hover">
                                <TableCell sx={{ fontFamily: fontBody, fontWeight: 600, fontSize: "0.85rem", color: T.text }}>{row.studentName}</TableCell>
                                <TableCell sx={{ fontFamily: fontMono, fontSize: "0.75rem", color: T.textSub }}>{row.rollNo}</TableCell>
                                <TableCell sx={{ fontFamily: fontBody, fontSize: "0.82rem", color: T.textSub }}>{row.block}</TableCell>
                                <TableCell><StatusPill status={row.type} /></TableCell>
                                <TableCell sx={{ fontFamily: fontMono, fontSize: "0.75rem", color: T.textSub }}>{row.time}</TableCell>
                                <TableCell sx={{ fontFamily: fontBody, fontSize: "0.82rem", color: T.textSub }}>{row.reason}</TableCell>
                                <TableCell sx={{ fontFamily: fontBody, fontSize: "0.82rem", color: T.textSub }}>{row.gate}</TableCell>
                                <TableCell sx={{ textAlign: "right", py: 1 }}>
                                    <IconButton size="small" onClick={() => setModal({ open: true, data: row })} sx={{ color: T.textMute }}><Edit sx={{ fontSize: 16 }} /></IconButton>
                                    <IconButton size="small" sx={{ color: T.danger }}><DeleteOutline sx={{ fontSize: 16 }} /></IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Card>

            {/* ── Modal ── */}
            <Dialog open={modal.open} onClose={() => setModal({ open: false, data: null })} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: "16px", border: `1px solid ${T.border}` } }}>
                <DialogTitle sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1rem", color: T.text, borderBottom: `1px solid ${T.border}`, bgcolor: "#FAFBFD", pb: 2 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Box>{modal.data?.id ? "Edit Log" : "New Entry/Exit Log"}</Box>
                        <IconButton size="small" onClick={() => setModal({ open: false, data: null })}><Close fontSize="small" /></IconButton>
                    </Box>
                </DialogTitle>
                <DialogContent sx={{ px: 3, pt: 3, pb: 2 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}><SLabel>Student Name</SLabel><DInput value={modal.data?.studentName || ""} /></Grid>
                        <Grid item xs={6}><SLabel>Roll No</SLabel><DInput value={modal.data?.rollNo || ""} /></Grid>
                        <Grid item xs={6}><SLabel>Block</SLabel><DInput value={modal.data?.block || ""} /></Grid>
                        <Grid item xs={6}><SLabel>Type</SLabel>
                            <DInput select value={modal.data?.type || "In"}>
                                {["In", "Out"].map(s => <MenuItem key={s} value={s} sx={{ fontFamily: fontBody, fontSize: "0.82rem" }}>{s}</MenuItem>)}
                            </DInput>
                        </Grid>
                        <Grid item xs={6}><SLabel>Gate</SLabel><DInput value={modal.data?.gate || ""} /></Grid>
                        <Grid item xs={12}><SLabel>Time</SLabel><DInput value={modal.data?.time || ""} /></Grid>
                        <Grid item xs={12}><SLabel>Reason</SLabel><DInput value={modal.data?.reason || ""} /></Grid>
                    </Grid>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 3, borderTop: `1px solid ${T.border}`, pt: 2, bgcolor: "#FAFBFD" }}>
                    <Button onClick={() => setModal({ open: false, data: null })} variant="outlined" sx={{ fontFamily: fontBody, fontWeight: 600, fontSize: "0.8rem", textTransform: "none", borderRadius: "8px", borderColor: T.border, color: T.textSub }}>Cancel</Button>
                    <Button variant="contained" onClick={handleSave} sx={{ fontFamily: fontBody, fontWeight: 700, fontSize: "0.8rem", textTransform: "none", borderRadius: "8px", bgcolor: T.accent, boxShadow: "none" }}>Save</Button>
                </DialogActions>
            </Dialog>

            <Snackbar open={snack.open} autoHideDuration={3000} onClose={() => setSnack({ open: false, msg: "" })} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
                <Alert severity="success" sx={{ borderRadius: "10px", fontFamily: fontBody, fontWeight: 600 }}>{snack.msg}</Alert>
            </Snackbar>
        </Box>
    );
}
