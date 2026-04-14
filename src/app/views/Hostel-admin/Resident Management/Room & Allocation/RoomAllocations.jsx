import React, { useState } from "react";
import {
    Box, Card, Grid, Typography, Button, TextField, MenuItem, Table, TableBody, TableCell, TableHead, TableRow,
    IconButton, InputAdornment, Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, Alert, Chip, Tabs, Tab
} from "@mui/material";
import {
    Search, FilterList, PersonAdd, SwapHoriz, MeetingRoom, Edit, DeleteOutline, Close, Male, Female
} from "@mui/icons-material";

/* ── Design Tokens ── */
const T = {
    bg: "#F5F7FA", surface: "#FFFFFF", border: "#E4E8EF", text: "#111827", textSub: "#4B5563", textMute: "#9CA3AF",
    accent: "#6366F1", accentLight: "#EEF2FF", success: "#10B981", successLight: "#ECFDF5",
    warning: "#F59E0B", warningLight: "#FFFBEB", danger: "#EF4444", dangerLight: "#FEF2F2",
    info: "#3B82F6", infoLight: "#EFF6FF", pink: "#EC4899", pinkLight: "#FDF2F8"
};
const fontHead = "Sora, Roboto, Helvetica, Arial, sans-serif";
const fontBody = "Nunito, Roboto, Helvetica, Arial, sans-serif";
const fontMono = "JetBrains Mono, monospace";

const Fonts = () => (
    <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700&family=Nunito:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600&display=swap');
    * { box-sizing: border-box; }
    @keyframes fadeUp { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:none; } }
    .fade-up { animation: fadeUp 0.3s ease both; }
    .row-hover:hover { background: #F9FAFB !important; transition: background 0.15s; }
  `}</style>
);

const DInput = ({ label, sx = {}, ...props }) => (
    <Box mb={2}>
        {label && <Typography sx={{ fontFamily: fontBody, fontSize: "0.78rem", fontWeight: 600, color: T.textSub, mb: 0.8 }}>{label}</Typography>}
        <TextField size="small" fullWidth {...props} sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px", fontFamily: fontBody, fontSize: "0.82rem", bgcolor: T.surface, "& fieldset": { borderColor: T.border }, "&.Mui-focused fieldset": { borderColor: T.accent } }, "& .MuiInputLabel-root.Mui-focused": { color: T.accent }, ...sx }} />
    </Box>
);

export default function RoomAllocations() {
    const [searchTerm, setSearchTerm] = useState("");
    const [hostelType, setHostelType] = useState("Boys");
    const [allocModal, setAllocModal] = useState({ open: false, mode: "assign", data: {} });
    const [snack, setSnack] = useState({ open: false, msg: "" });

    const [allocations, setAllocations] = useState([
        { id: 1, studentId: "STU-2101", name: "Rahul Sharma", type: "Boys", block: "Block A", roomNumber: "A-101", checkInDate: "2024-08-15", status: "Allocated" },
        { id: 2, studentId: "STU-2102", name: "Priya Singh", type: "Girls", block: "Block B", roomNumber: "B-205", checkInDate: "2024-08-16", status: "Allocated" },
        { id: 3, studentId: "STU-2105", name: "Vikram Kumar", type: "Boys", block: "Block C", roomNumber: "C-302", checkInDate: "2024-09-01", status: "Pending" },
        { id: 4, studentId: "STU-2108", name: "Neha Gupta", type: "Girls", block: "Block A", roomNumber: "A-304", checkInDate: "2024-09-05", status: "Allocated" },
        { id: 5, studentId: "STU-2110", name: "Arjun Reddy", type: "Boys", block: "Block B", roomNumber: "B-112", checkInDate: "2024-08-20", status: "Allocated" }
    ]);

    const openModal = (mode, data = {}) => {
        setAllocModal({ open: true, mode, data: mode === "assign" ? { status: "Allocated", type: hostelType } : { ...data } });
    };

    const handleSave = () => {
        if (allocModal.mode === "assign") {
            setAllocations([...allocations, { id: Date.now(), ...allocModal.data, status: allocModal.data.status || "Allocated" }]);
        } else {
            setAllocations(allocations.map(a => a.id === allocModal.data.id ? allocModal.data : a));
        }
        setSnack({ open: true, msg: allocModal.mode === "swap" ? "Room swap initiated." : "Allocation saved successfully." });
        setAllocModal({ open: false, data: {} });
    };

    const filtered = allocations.filter(a => a.type === hostelType && (a.name.toLowerCase().includes(searchTerm.toLowerCase()) || a.roomNumber.toLowerCase().includes(searchTerm.toLowerCase()) || a.studentId.toLowerCase().includes(searchTerm.toLowerCase())));

    return (
        <Box sx={{ p: 3, background: T.bg, minHeight: "100vh", fontFamily: fontBody }}>
            <Fonts />
            <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3} className="fade-up">
                <Box>
                    <Typography sx={{ fontFamily: fontBody, fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: T.textMute, mb: 0.3 }}>Resident Management</Typography>
                    <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1.5rem", color: T.text, lineHeight: 1.1 }}>Room Allocations</Typography>
                    <Typography sx={{ fontFamily: fontBody, fontSize: "0.82rem", color: T.textSub, mt: 0.4 }}>Assign, swap, and manage room assignments for residents.</Typography>
                </Box>
                <Box display="flex" gap={1.5}>
                    <Button variant="outlined" startIcon={<SwapHoriz sx={{ fontSize: 16 }} />} onClick={() => openModal("swap")} sx={{ fontFamily: fontBody, fontWeight: 700, fontSize: "0.75rem", textTransform: "none", borderRadius: "8px", borderColor: T.border, color: T.textSub }}>Swap Rooms</Button>
                    <Button variant="contained" startIcon={<PersonAdd sx={{ fontSize: 16 }} />} onClick={() => openModal("assign")} sx={{ fontFamily: fontBody, fontWeight: 700, fontSize: "0.75rem", textTransform: "none", borderRadius: "8px", bgcolor: T.accent, boxShadow: "none" }}>Assign Room</Button>
                </Box>
            </Box>

            <Box sx={{ borderBottom: 1, borderColor: T.border, mb: 3 }} className="fade-up">
                <Tabs value={hostelType} onChange={(e, v) => setHostelType(v)} TabIndicatorProps={{ sx: { bgcolor: hostelType === "Girls" ? T.pink : T.info, height: 3, borderRadius: "3px 3px 0 0" } }} sx={{ "& .MuiTab-root": { fontFamily: fontBody, fontWeight: 600, fontSize: "0.9rem", textTransform: "none", color: T.textSub, minWidth: 140, minHeight: 48 }, "& .Mui-selected": { color: `${hostelType === "Girls" ? T.pink : T.info} !important` } }}>
                    <Tab label={<Box display="flex" alignItems="center" gap={1}><Male fontSize="small" /> Boys Hostel</Box>} value="Boys" />
                    <Tab label={<Box display="flex" alignItems="center" gap={1}><Female fontSize="small" /> Girls Hostel</Box>} value="Girls" />
                </Tabs>
            </Box>

            <Card className="fade-up" sx={{ borderRadius: "14px", border: `1px solid ${T.border}`, boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                <Box sx={{ p: 2.5, borderBottom: `1px solid ${T.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
                    <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1.1rem" }}>{hostelType} Hostel Allocations</Typography>
                    <TextField size="small" placeholder={`Search ${hostelType.toLowerCase()} by name, ID, room...`} value={searchTerm} onChange={e => setSearchTerm(e.target.value)} InputProps={{ startAdornment: <InputAdornment position="start"><Search sx={{ fontSize: 16, color: T.textMute }} /></InputAdornment> }} sx={{ width: 300, "& .MuiOutlinedInput-root": { borderRadius: "8px", fontFamily: fontBody, fontSize: "0.8rem" } }} />
                </Box>
                <Table>
                    <TableHead><TableRow sx={{ bgcolor: "#F9FAFB" }}>
                        {["Resident Detail", "Block", "Room Number", "Check-in Date", "Status", "Actions"].map(h => <TableCell key={h} sx={{ fontFamily: fontBody, fontWeight: 700, fontSize: "0.72rem", color: T.textMute, textTransform: "uppercase", py: 1.5, ...(h === "Actions" ? { textAlign: "right" } : {}) }}>{h}</TableCell>)}
                    </TableRow></TableHead>
                    <TableBody>
                        {filtered.length > 0 ? filtered.map(row => (
                            <TableRow key={row.id} className="row-hover">
                                <TableCell>
                                    <Typography sx={{ fontFamily: fontBody, fontWeight: 700, fontSize: "0.9rem", color: T.text }}>{row.name}</Typography>
                                    <Typography sx={{ fontFamily: fontMono, fontSize: "0.75rem", color: T.textSub }}>{row.studentId}</Typography>
                                </TableCell>
                                <TableCell sx={{ fontFamily: fontBody, fontSize: "0.85rem", color: T.textSub }}>{row.block}</TableCell>
                                <TableCell>
                                    <Box display="flex" alignItems="center" gap={0.8}><MeetingRoom sx={{ fontSize: 16, color: hostelType === "Girls" ? T.pink : T.info }} /><Typography sx={{ fontFamily: fontMono, fontWeight: 600, fontSize: "0.85rem", color: hostelType === "Girls" ? T.pink : T.info }}>{row.roomNumber}</Typography></Box>
                                </TableCell>
                                <TableCell sx={{ fontFamily: fontMono, fontSize: "0.8rem", color: T.textSub }}>{row.checkInDate}</TableCell>
                                <TableCell>
                                    <Chip label={row.status} size="small" sx={{ fontFamily: fontBody, fontWeight: 700, fontSize: "0.7rem", bgcolor: row.status === "Allocated" ? T.successLight : T.warningLight, color: row.status === "Allocated" ? T.success : T.warning, height: 24 }} />
                                </TableCell>
                                <TableCell sx={{ textAlign: "right", py: 1 }}>
                                    <IconButton size="small" onClick={() => openModal("edit", row)} sx={{ color: T.textMute }}><Edit sx={{ fontSize: 16 }} /></IconButton>
                                    <IconButton size="small" sx={{ color: T.danger }}><DeleteOutline sx={{ fontSize: 16 }} /></IconButton>
                                </TableCell>
                            </TableRow>
                        )) : (
                            <TableRow><TableCell colSpan={6} sx={{ textAlign: "center", py: 4, color: T.textMute, fontFamily: fontBody }}>No allocations found for {hostelType} Hostel.</TableCell></TableRow>
                        )}
                    </TableBody>
                </Table>
            </Card>

            <Dialog open={allocModal.open} onClose={() => setAllocModal({ open: false, data: {} })} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: "16px", p: 1 } }}>
                <DialogTitle sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1.2rem", pb: 1 }}>
                    {allocModal.mode === "assign" ? `Assign ${hostelType} Room` : allocModal.mode === "swap" ? "Swap Rooms" : "Edit Allocation"}
                </DialogTitle>
                <DialogContent sx={{ pb: 1, mt: 1 }}>
                    {allocModal.mode === "swap" ? (
                        <>
                            <Grid container spacing={2}>
                                <Grid item xs={6}><DInput label="Student 1 ID / Name" /></Grid>
                                <Grid item xs={6}><DInput label="Student 2 ID / Name" /></Grid>
                                <Grid item xs={12}><Alert severity="info" sx={{ fontFamily: fontBody, borderRadius: "8px" }}>This will interchange the currently assigned rooms for both students.</Alert></Grid>
                            </Grid>
                        </>
                    ) : (
                        <Grid container spacing={2}>
                            <Grid item xs={6}><DInput label="Student ID" value={allocModal.data?.studentId || ""} onChange={e => setAllocModal({ ...allocModal, data: { ...allocModal.data, studentId: e.target.value } })} /></Grid>
                            <Grid item xs={6}><DInput label="Student Name" value={allocModal.data?.name || ""} onChange={e => setAllocModal({ ...allocModal, data: { ...allocModal.data, name: e.target.value } })} /></Grid>
                            <Grid item xs={6}>
                                <DInput label="Hostel Division" select value={allocModal.data?.type || hostelType} onChange={e => setAllocModal({ ...allocModal, data: { ...allocModal.data, type: e.target.value } })}>
                                    {["Boys", "Girls"].map(s => <MenuItem key={s} value={s} sx={{ fontFamily: fontBody, fontSize: "0.85rem" }}>{s} Hostel</MenuItem>)}
                                </DInput>
                            </Grid>
                            <Grid item xs={6}>
                                <DInput label="Hostel Block" select value={allocModal.data?.block || ""} onChange={e => setAllocModal({ ...allocModal, data: { ...allocModal.data, block: e.target.value } })}>
                                    {["Block A", "Block B", "Block C", "Block D"].map(s => <MenuItem key={s} value={s} sx={{ fontFamily: fontBody, fontSize: "0.85rem" }}>{s}</MenuItem>)}
                                </DInput>
                            </Grid>
                            <Grid item xs={4}><DInput label="Room Number" value={allocModal.data?.roomNumber || ""} onChange={e => setAllocModal({ ...allocModal, data: { ...allocModal.data, roomNumber: e.target.value } })} /></Grid>
                            <Grid item xs={4}><DInput label="Check-in Date" type="date" value={allocModal.data?.checkInDate || ""} onChange={e => setAllocModal({ ...allocModal, data: { ...allocModal.data, checkInDate: e.target.value } })} InputLabelProps={{ shrink: true }} /></Grid>
                            <Grid item xs={4}>
                                <DInput label="Status" select value={allocModal.data?.status || "Allocated"} onChange={e => setAllocModal({ ...allocModal, data: { ...allocModal.data, status: e.target.value } })}>
                                    {["Allocated", "Pending"].map(s => <MenuItem key={s} value={s} sx={{ fontFamily: fontBody, fontSize: "0.85rem" }}>{s}</MenuItem>)}
                                </DInput>
                            </Grid>
                        </Grid>
                    )}
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={() => setAllocModal({ open: false, data: {} })} sx={{ fontFamily: fontBody, fontWeight: 600, color: T.textSub, textTransform: "none" }}>Cancel</Button>
                    <Button onClick={handleSave} variant="contained" sx={{ fontFamily: fontBody, fontWeight: 600, bgcolor: hostelType === "Girls" ? T.pink : T.info, textTransform: "none", borderRadius: "8px", boxShadow: "none" }}>Confirm</Button>
                </DialogActions>
            </Dialog>
            <Snackbar open={snack.open} autoHideDuration={3000} onClose={() => setSnack({ open: false, msg: "" })} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}><Alert severity="success" sx={{ borderRadius: "10px", fontFamily: fontBody, fontWeight: 600 }}>{snack.msg}</Alert></Snackbar>
        </Box>
    );
}
