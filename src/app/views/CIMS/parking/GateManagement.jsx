import React, { useState } from "react";
import {
    Box, Card, Grid, Typography, Button, TextField, Table, TableBody, TableCell, TableHead, TableRow,
    IconButton, InputAdornment, Dialog, DialogTitle, DialogContent, DialogActions, Select, MenuItem, Badge
} from "@mui/material";
import {
    Search, FilterList, Add, ErrorOutline, LogIn, LogOut, Shield, CarCrash, Place, Edit, DeleteOutline, Alarm, SwapHoriz, Person, LocalShipping
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

const DInput = ({ label, type = "text", placeholder, options, value, onChange }) => (
    <Box mb={2}>
        <Typography sx={{ fontFamily: fontBody, fontSize: "0.78rem", fontWeight: 600, color: T.textSub, mb: 0.8 }}>{label}</Typography>
        {options ? (
            <Select fullWidth size="small" value={value} onChange={onChange} sx={{ fontFamily: fontBody, fontSize: "0.85rem", borderRadius: "8px" }}>
                {options.map(o => <MenuItem key={o} value={o} sx={{ fontFamily: fontBody, fontSize: "0.85rem" }}>{o}</MenuItem>)}
            </Select>
        ) : (
            <TextField fullWidth type={type} size="small" placeholder={placeholder} value={value} onChange={onChange} InputProps={{ sx: { fontFamily: fontBody, fontSize: "0.85rem", borderRadius: "8px" } }} />
        )}
    </Box>
);

const StatusPill = ({ status }) => {
    let bg, color;
    if (status === "Allowed") { bg = T.successLight; color = T.success; }
    else if (status === "Denied") { bg = T.dangerLight; color = T.danger; }
    else { bg = T.bg; color = T.textSub; }

    return (
        <Box sx={{ display: "inline-flex", alignItems: "center", px: 1.2, py: 0.4, borderRadius: "6px", bgcolor: bg, color: color, fontFamily: fontBody, fontSize: "0.75rem", fontWeight: 700 }}>
            {status}
        </Box>
    );
};

const StatCard = ({ label, value, color, bgLight, icon: Icon }) => (
    <Card className="fade-up" sx={{ p: 2.5, borderRadius: "14px", border: `1px solid ${T.border}`, background: T.surface, boxShadow: "0 1px 4px rgba(0,0,0,0.04)", height: "100%" }}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
            <Box>
                <Typography sx={{ fontFamily: fontBody, fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: T.textMute, mb: 0.5 }}>{label}</Typography>
                <Typography sx={{ fontFamily: fontMono, fontWeight: 700, fontSize: "1.8rem", color: color || T.text, lineHeight: 1.1 }}>{value}</Typography>
            </Box>
            <Box sx={{ p: 1.2, borderRadius: "10px", bgcolor: bgLight, color: color }}><Icon sx={{ fontSize: 22 }} /></Box>
        </Box>
    </Card>
);

const gateStats = [
    { name: "Main Gate 1", status: "Online", alert: null },
    { name: "Main Gate 2", status: "Online", alert: "Camera feed unstable" },
    { name: "South Gate", status: "Online", alert: null },
    { name: "North Gate", status: "Maintenance", alert: "Scheduled maintenance" },
];

const initialLogs = [
    { id: "log-1", timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), type: "Entry", entityType: "Vehicle", identifier: "KA-01-AB-1234", name: "Dr. Alan Grant", userType: "Staff", gateNumber: "Main Gate 1", status: "Allowed" },
    { id: "log-2", timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(), type: "Exit", entityType: "Pedestrian", identifier: "STU-2024-001", name: "John Doe", userType: "Student", gateNumber: "South Gate", status: "Allowed" },
    { id: "log-3", timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(), type: "Entry", entityType: "Vehicle", identifier: "MH-12-PQ-5555", name: "Jane Smith", userType: "Student", gateNumber: "Main Gate 2", status: "Denied", reason: "Expired Pass" },
    { id: "log-4", timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(), type: "Entry", entityType: "Vehicle", identifier: "DL-04-CC-1111", name: "Guest - Robert", userType: "Visitor", gateNumber: "Main Gate 1", status: "Allowed" },
    { id: "log-5", timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(), type: "Exit", entityType: "Vehicle", identifier: "KA-05-XY-9876", name: "Sarah Connor", userType: "Staff", gateNumber: "Main Gate 1", status: "Allowed" }
];

export default function GateManagement() {
    const [searchTerm, setSearchTerm] = useState("");
    const [logs, setLogs] = useState(initialLogs);
    const [filterType, setFilterType] = useState("All");
    const [modal, setModal] = useState({ open: false, data: {} });

    const handleManualEntry = () => {
        const newLog = {
            id: `log-${Date.now()}`,
            timestamp: new Date().toISOString(),
            type: modal.data.type || "Entry",
            entityType: modal.data.entityType || "Vehicle",
            identifier: modal.data.identifier?.toUpperCase() || "",
            name: modal.data.name || "",
            userType: modal.data.userType || "Visitor",
            gateNumber: modal.data.gateNumber || "Main Gate 1",
            status: modal.data.status || "Allowed",
            reason: modal.data.status === "Denied" ? modal.data.reason : ""
        };
        setLogs([newLog, ...logs]);
        setModal({ open: false, data: {} });
    };

    const filteredLogs = logs.filter(log => {
        const matchesSearch = log.identifier.toLowerCase().includes(searchTerm.toLowerCase()) || log.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = filterType === "All" || log.type === filterType;
        return matchesSearch && matchesType;
    }).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    const entriesToday = logs.filter(l => l.type === "Entry" && new Date(l.timestamp).toDateString() === new Date().toDateString()).length;
    const exitsToday = logs.filter(l => l.type === "Exit" && new Date(l.timestamp).toDateString() === new Date().toDateString()).length;
    const deniedToday = logs.filter(l => l.status === "Denied" && new Date(l.timestamp).toDateString() === new Date().toDateString()).length;

    return (
        <Box sx={{ p: 3, background: T.bg, minHeight: "100vh", fontFamily: fontBody }}>
            <Fonts />
            <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3} className="fade-up">
                <Box>
                    <Typography sx={{ fontFamily: fontBody, fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: T.textMute, mb: 0.3 }}>Campus Security</Typography>
                    <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1.5rem", color: T.text, lineHeight: 1.1 }}>Gate Management</Typography>
                    <Typography sx={{ fontFamily: fontBody, fontSize: "0.82rem", color: T.textSub, mt: 0.4 }}>Monitor and log campus entry and exit points.</Typography>
                </Box>
                <Button variant="contained" startIcon={<SwapHoriz sx={{ fontSize: 16 }} />} onClick={() => setModal({ open: true, data: { type: "Entry", entityType: "Vehicle", userType: "Visitor", gateNumber: "Main Gate 1", status: "Allowed" } })} sx={{ fontFamily: fontBody, fontWeight: 700, fontSize: "0.8rem", textTransform: "none", borderRadius: "8px", bgcolor: T.accent, boxShadow: "none" }}>Manual Action</Button>
            </Box>

            <Grid container spacing={3} mb={3}>
                <Grid item xs={12} sm={4}><StatCard label="Entries Today" value={entriesToday} color={T.success} bgLight={T.successLight} icon={LogIn} /></Grid>
                <Grid item xs={12} sm={4}><StatCard label="Exits Today" value={exitsToday} color={T.info} bgLight={T.infoLight} icon={LogOut} /></Grid>
                <Grid item xs={12} sm={4}><StatCard label="Denied Access" value={deniedToday} color={T.danger} bgLight={T.dangerLight} icon={Shield} /></Grid>
            </Grid>

            {/* ── Real-Time Gate Status ── */}
            <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1.1rem", mb: 2 }} className="fade-up">Real-Time Gate Status</Typography>
            <Grid container spacing={2} mb={3} className="fade-up">
                {gateStats.map(gate => {
                    const gateEntries = logs.filter(l => l.gateNumber === gate.name && l.type === "Entry" && new Date(l.timestamp).toDateString() === new Date().toDateString()).length;
                    const gateExits = logs.filter(l => l.gateNumber === gate.name && l.type === "Exit" && new Date(l.timestamp).toDateString() === new Date().toDateString()).length;

                    return (
                        <Grid item xs={12} sm={6} md={3} key={gate.name}>
                            <Card sx={{ borderRadius: "14px", border: `1px solid ${T.border}`, borderLeft: `4px solid ${gate.status === 'Online' ? (gate.alert ? T.warning : T.success) : T.textMute}`, boxShadow: "0 1px 4px rgba(0,0,0,0.02)", height: "100%" }}>
                                <CardContent sx={{ p: 2 }}>
                                    <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1.5}>
                                        <Typography sx={{ fontFamily: fontBody, fontWeight: 700, fontSize: "0.95rem", color: T.text }}>{gate.name}</Typography>
                                        <Box sx={{
                                            px: 1, py: 0.2, borderRadius: "4px", fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase",
                                            bgcolor: gate.status === 'Online' ? (gate.alert ? T.warningLight : T.successLight) : T.bg,
                                            color: gate.status === 'Online' ? (gate.alert ? T.warning : T.success) : T.textSub
                                        }}>
                                            {gate.status}
                                        </Box>
                                    </Box>
                                    <Box display="flex" justifyContent="space-between" mb={1}>
                                        <Typography sx={{ fontFamily: fontBody, fontSize: "0.75rem", color: T.textSub }}>Entries: <strong style={{ color: T.text }}>{gateEntries}</strong></Typography>
                                        <Typography sx={{ fontFamily: fontBody, fontSize: "0.75rem", color: T.textSub }}>Exits: <strong style={{ color: T.text }}>{gateExits}</strong></Typography>
                                    </Box>
                                    {gate.alert && (
                                        <Box display="flex" alignItems="center" gap={0.5} mt={1} p={0.8} sx={{ bgcolor: T.warningLight, borderRadius: "6px" }}>
                                            <ErrorOutline sx={{ fontSize: 14, color: T.warning }} />
                                            <Typography sx={{ fontFamily: fontBody, fontSize: "0.7rem", color: T.warning, fontWeight: 600 }} noWrap>{gate.alert}</Typography>
                                        </Box>
                                    )}
                                </CardContent>
                            </Card>
                        </Grid>
                    )
                })}
            </Grid>

            {/* ── Log Table ── */}
            <Card sx={{ borderRadius: "14px", border: `1px solid ${T.border}`, boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }} className="fade-up">
                <Box sx={{ p: 2.5, borderBottom: `1px solid ${T.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
                    <Box display="flex" gap={1}>
                        {['All', 'Entry', 'Exit'].map(ft => (
                            <Button key={ft} variant={filterType === ft ? "contained" : "text"} onClick={() => setFilterType(ft)} sx={{ fontFamily: fontBody, fontWeight: 600, fontSize: "0.8rem", textTransform: "none", bgcolor: filterType === ft ? T.surface : "transparent", color: filterType === ft ? T.text : T.textSub, boxShadow: filterType === ft ? "0 1px 3px rgba(0,0,0,0.1)" : "none", borderRadius: "8px" }}>
                                {ft}
                            </Button>
                        ))}
                    </Box>
                    <Box display="flex" gap={1.5}>
                        <TextField size="small" placeholder="Search ID or Name..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} InputProps={{ startAdornment: <InputAdornment position="start"><Search sx={{ fontSize: 16, color: T.textMute }} /></InputAdornment> }} sx={{ width: 260, "& .MuiOutlinedInput-root": { borderRadius: "8px", fontFamily: fontBody, fontSize: "0.8rem" } }} />
                    </Box>
                </Box>
                <Box sx={{ overflowX: "auto" }}>
                    <Table>
                        <TableHead><TableRow sx={{ bgcolor: "#F9FAFB" }}>
                            {["Log Type", "Entity", "User Name", "Gate", "Time", "Status"].map(h => <TableCell key={h} sx={{ fontFamily: fontBody, fontWeight: 700, fontSize: "0.72rem", color: T.textMute, textTransform: "uppercase", py: 1.5, ...(h === "Status" ? { textAlign: "right" } : {}) }}>{h}</TableCell>)}
                        </TableRow></TableHead>
                        <TableBody>
                            {filteredLogs.map(log => (
                                <TableRow key={log.id} className="row-hover">
                                    <TableCell>
                                        <Box display="flex" alignItems="center" gap={1.5}>
                                            <Box sx={{ p: 1, borderRadius: "50%", bgcolor: log.type === 'Entry' ? T.successLight : T.infoLight, color: log.type === 'Entry' ? T.success : T.info, display: "flex" }}>
                                                {log.type === 'Entry' ? <LogIn sx={{ fontSize: 18 }} /> : <LogOut sx={{ fontSize: 18 }} />}
                                            </Box>
                                            <Typography sx={{ fontFamily: fontBody, fontWeight: 700, fontSize: "0.85rem", color: T.text }}>{log.type}</Typography>
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Typography sx={{ fontFamily: fontMono, fontWeight: 700, fontSize: "0.85rem", color: T.text }}>{log.identifier}</Typography>
                                        <Box display="flex" gap={0.5} mt={0.5}>
                                            <Box sx={{ display: "inline-flex", px: 0.8, py: 0.2, borderRadius: "4px", border: `1px solid ${T.border}`, fontSize: "0.65rem", fontFamily: fontBody, color: T.textSub }}>{log.entityType}</Box>
                                            <Box sx={{ display: "inline-flex", px: 0.8, py: 0.2, borderRadius: "4px", border: `1px solid ${T.border}`, fontSize: "0.65rem", fontFamily: fontBody, color: T.textSub }}>{log.userType}</Box>
                                        </Box>
                                    </TableCell>
                                    <TableCell><Typography sx={{ fontFamily: fontBody, fontSize: "0.85rem", color: T.textSub, fontWeight: 600 }}>{log.name}</Typography></TableCell>
                                    <TableCell><Typography sx={{ fontFamily: fontBody, fontSize: "0.85rem", color: T.textSub }}>{log.gateNumber}</Typography></TableCell>
                                    <TableCell>
                                        <Box display="flex" alignItems="center" gap={0.8}><Alarm sx={{ fontSize: 14, color: T.textMute }} /><Typography sx={{ fontFamily: fontMono, fontSize: "0.8rem", color: T.textSub }}>{new Date(log.timestamp).toLocaleTimeString()}</Typography></Box>
                                    </TableCell>
                                    <TableCell sx={{ textAlign: "right" }}>
                                        <StatusPill status={log.status} />
                                        {log.reason && (
                                            <Typography sx={{ fontFamily: fontBody, fontSize: "0.7rem", color: T.danger, mt: 0.5 }}>{log.reason}</Typography>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Box>
            </Card>

            <Dialog open={modal.open} onClose={() => setModal({ ...modal, open: false })} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: "16px", p: 1 } }}>
                <DialogTitle sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1.2rem", pb: 1 }}>Manual Gate Log Entry</DialogTitle>
                <DialogContent sx={{ pb: 1, mt: 1 }}>
                    <Box display="flex" gap={2}>
                        <Box flex={1}><DInput label="Event Type" options={["Entry", "Exit"]} value={modal.data.type || "Entry"} onChange={(e) => setModal({ ...modal, data: { ...modal.data, type: e.target.value } })} /></Box>
                        <Box flex={1}><DInput label="Entity Type" options={["Vehicle", "Pedestrian"]} value={modal.data.entityType || "Vehicle"} onChange={(e) => setModal({ ...modal, data: { ...modal.data, entityType: e.target.value } })} /></Box>
                    </Box>
                    <Box display="flex" gap={2}>
                        <Box flex={1}><DInput label="Identifier (Vehicle No / ID)" placeholder="e.g. KA-01-AB-1234" value={modal.data.identifier || ""} onChange={(e) => setModal({ ...modal, data: { ...modal.data, identifier: e.target.value } })} /></Box>
                        <Box flex={1}><DInput label="Name" placeholder="e.g. John Doe" value={modal.data.name || ""} onChange={(e) => setModal({ ...modal, data: { ...modal.data, name: e.target.value } })} /></Box>
                    </Box>
                    <Box display="flex" gap={2}>
                        <Box flex={1}><DInput label="User Type" options={["Student", "Staff", "Visitor"]} value={modal.data.userType || "Visitor"} onChange={(e) => setModal({ ...modal, data: { ...modal.data, userType: e.target.value } })} /></Box>
                        <Box flex={1}><DInput label="Gate Number" options={["Main Gate 1", "Main Gate 2", "South Gate", "North Gate"]} value={modal.data.gateNumber || "Main Gate 1"} onChange={(e) => setModal({ ...modal, data: { ...modal.data, gateNumber: e.target.value } })} /></Box>
                    </Box>
                    <Box display="flex" gap={2}>
                        <Box flex={1}><DInput label="Status" options={["Allowed", "Denied"]} value={modal.data.status || "Allowed"} onChange={(e) => setModal({ ...modal, data: { ...modal.data, status: e.target.value } })} /></Box>
                        {modal.data.status === "Denied" && (
                            <Box flex={1}><DInput label="Reason for Denial" placeholder="e.g. Expired Pass" value={modal.data.reason || ""} onChange={(e) => setModal({ ...modal, data: { ...modal.data, reason: e.target.value } })} /></Box>
                        )}
                    </Box>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 3 }}>
                    <Button onClick={() => setModal({ ...modal, open: false })} sx={{ fontFamily: fontBody, fontWeight: 600, color: T.textSub, textTransform: "none" }}>Cancel</Button>
                    <Button onClick={handleManualEntry} variant="contained" sx={{ fontFamily: fontBody, fontWeight: 600, bgcolor: T.accent, textTransform: "none", borderRadius: "8px", boxShadow: "none" }}>Save Log</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
