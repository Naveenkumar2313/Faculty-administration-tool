import React, { useState } from "react";
import {
    Box, Card, Grid, Typography, Button, TextField, IconButton, InputAdornment, Dialog, DialogTitle, DialogContent, DialogActions, Select, MenuItem, Badge
} from "@mui/material";
import {
    Search, Add, Edit, Delete, Badge as BadgeIcon, DirectionsCar, CalendarMonth, CheckCircleOutline, ErrorOutline
} from "@mui/icons-material";

/* ── Design Tokens ── */
const T = {
    bg: "#F5F7FA", surface: "#FFFFFF", border: "#E4E8EF", text: "#111827", textSub: "#4B5563", textMute: "#9CA3AF",
    accent: "#6366F1", accentLight: "#EEF2FF", success: "#10B981", successLight: "#ECFDF5",
    warning: "#F59E0B", warningLight: "#FFFBEB", danger: "#EF4444", dangerLight: "#FEF2F2",
    info: "#3B82F6", infoLight: "#EFF6FF"
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

const initialPasses = [
    { id: "pass-101", userId: "EMP-001", userName: "Dr. Alan Grant", userType: "Faculty", vehicleNumber: "KA-01-AB-1234", vehicleType: "4-Wheeler", validUntil: "2026-12-31", status: "Active" },
    { id: "pass-102", userId: "STU-2024-001", userName: "John Doe", userType: "Student", vehicleNumber: "KA-05-XY-9876", vehicleType: "2-Wheeler", validUntil: "2026-06-30", status: "Active" },
    { id: "pass-103", userId: "STU-2023-045", userName: "Jane Smith", userType: "Student", vehicleNumber: "MH-12-PQ-5555", vehicleType: "4-Wheeler", validUntil: "2025-12-31", status: "Expired" },
    { id: "pass-104", userId: "EMP-042", userName: "Robert Muldoon", userType: "Staff", vehicleNumber: "DL-04-CC-1111", vehicleType: "2-Wheeler", validUntil: "2026-12-31", status: "Revoked" }
];

export default function ParkingPasses() {
    const [searchTerm, setSearchTerm] = useState("");
    const [passes, setPasses] = useState(initialPasses);
    const [modal, setModal] = useState({ open: false, mode: "create", data: {} });

    const openModal = (pass = null) => {
        if (pass) {
            setModal({ open: true, mode: "edit", data: { ...pass } });
        } else {
            setModal({ open: true, mode: "create", data: { userType: "Student", vehicleType: "2-Wheeler", validUntil: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0], status: "Active" } });
        }
    };

    const handleSave = () => {
        if (modal.mode === "create") {
            const newPass = {
                id: `pass-${Date.now()}`,
                userId: modal.data.userId || "N/A",
                userName: modal.data.userName || "Unknown",
                userType: modal.data.userType || "Student",
                vehicleNumber: modal.data.vehicleNumber?.toUpperCase() || "N/A",
                vehicleType: modal.data.vehicleType || "2-Wheeler",
                validUntil: modal.data.validUntil || new Date().toISOString().split('T')[0],
                status: modal.data.status || "Active"
            };
            setPasses([...passes, newPass]);
        } else {
            setPasses(passes.map(p => p.id === modal.data.id ? { ...p, ...modal.data } : p));
        }
        setModal({ ...modal, open: false });
    };

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this parking pass?")) {
            setPasses(passes.filter(p => p.id !== id));
        }
    };

    const filteredPasses = passes.filter(p =>
        p.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.userId.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Box sx={{ p: 3, background: T.bg, minHeight: "100vh", fontFamily: fontBody }}>
            <Fonts />
            <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3} className="fade-up">
                <Box>
                    <Typography sx={{ fontFamily: fontBody, fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: T.textMute, mb: 0.3 }}>Campus Security</Typography>
                    <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1.5rem", color: T.text, lineHeight: 1.1 }}>Parking Passes</Typography>
                    <Typography sx={{ fontFamily: fontBody, fontSize: "0.82rem", color: T.textSub, mt: 0.4 }}>Issue and manage vehicle parking passes for students and staff.</Typography>
                </Box>
                <Button variant="contained" startIcon={<Add sx={{ fontSize: 16 }} />} onClick={() => openModal()} sx={{ fontFamily: fontBody, fontWeight: 700, fontSize: "0.8rem", textTransform: "none", borderRadius: "8px", bgcolor: T.accent, boxShadow: "none" }}>Issue New Pass</Button>
            </Box>

            <Card sx={{ borderRadius: "14px", border: `1px solid ${T.border}`, boxShadow: "0 1px 4px rgba(0,0,0,0.04)", minHeight: "60vh" }} className="fade-up">
                <Box sx={{ p: 2.5, borderBottom: `1px solid ${T.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
                    <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1.1rem" }}>Issued Passes</Typography>
                    <Box display="flex" gap={1.5}>
                        <TextField size="small" placeholder="Search name, ID or vehicle..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} InputProps={{ startAdornment: <InputAdornment position="start"><Search sx={{ fontSize: 16, color: T.textMute }} /></InputAdornment> }} sx={{ width: 280, "& .MuiOutlinedInput-root": { borderRadius: "8px", fontFamily: fontBody, fontSize: "0.8rem" } }} />
                    </Box>
                </Box>
                <Box sx={{ p: 2.5 }}>
                    <Grid container spacing={3}>
                        {filteredPasses.map(pass => (
                            <Grid item xs={12} md={6} lg={4} key={pass.id}>
                                <Card sx={{ borderRadius: "12px", border: `1px solid ${T.border}`, boxShadow: "0 2px 8px rgba(0,0,0,0.03)" }}>
                                    <Box sx={{ p: 2 }}>
                                        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                                            <Box display="flex" gap={1.5}>
                                                <Box sx={{ p: 1, borderRadius: "50%", bgcolor: pass.status === 'Active' ? T.successLight : (pass.status === 'Expired' ? T.warningLight : T.dangerLight), color: pass.status === 'Active' ? T.success : (pass.status === 'Expired' ? T.warning : T.danger), display: "flex", height: "fit-content" }}>
                                                    <BadgeIcon sx={{ fontSize: 20 }} />
                                                </Box>
                                                <Box>
                                                    <Typography sx={{ fontFamily: fontBody, fontWeight: 700, fontSize: "1.05rem", color: T.text }}>{pass.userName}</Typography>
                                                    <Typography sx={{ fontFamily: fontMono, fontSize: "0.75rem", color: T.textSub }}>{pass.userId} • {pass.userType}</Typography>
                                                </Box>
                                            </Box>
                                            <Typography sx={{ px: 1, py: 0.3, borderRadius: "4px", fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", bgcolor: pass.status === 'Active' ? T.success : (pass.status === 'Expired' ? T.bg : T.danger), color: pass.status === 'Active' ? T.surface : (pass.status === 'Expired' ? T.textSub : T.surface), border: pass.status === 'Expired' ? `1px solid ${T.border}` : "none" }}>
                                                {pass.status}
                                            </Typography>
                                        </Box>

                                        <Box sx={{ p: 1.5, bgcolor: T.bg, borderRadius: "8px", border: `1px solid ${T.border}` }}>
                                            <Box display="flex" justifyContent="space-between" mb={1}>
                                                <Box display="flex" alignItems="center" gap={1} color={T.textSub}><DirectionsCar sx={{ fontSize: 16 }} /><Typography sx={{ fontFamily: fontBody, fontSize: "0.8rem" }}>Vehicle No.</Typography></Box>
                                                <Typography sx={{ fontFamily: fontMono, fontWeight: 700, fontSize: "0.85rem", color: T.text }}>{pass.vehicleNumber}</Typography>
                                            </Box>
                                            <Box display="flex" justifyContent="space-between" mb={1}>
                                                <Box display="flex" alignItems="center" gap={1} color={T.textSub}><CheckCircleOutline sx={{ fontSize: 16 }} /><Typography sx={{ fontFamily: fontBody, fontSize: "0.8rem" }}>Type</Typography></Box>
                                                <Typography sx={{ fontFamily: fontBody, fontWeight: 600, fontSize: "0.85rem", color: T.text }}>{pass.vehicleType}</Typography>
                                            </Box>
                                            <Box display="flex" justifyContent="space-between">
                                                <Box display="flex" alignItems="center" gap={1} color={T.textSub}><CalendarMonth sx={{ fontSize: 16 }} /><Typography sx={{ fontFamily: fontBody, fontSize: "0.8rem" }}>Valid Until</Typography></Box>
                                                <Typography sx={{ fontFamily: fontMono, fontWeight: 700, fontSize: "0.85rem", color: new Date(pass.validUntil) < new Date() ? T.danger : T.text }}>{new Date(pass.validUntil).toLocaleDateString()}</Typography>
                                            </Box>
                                        </Box>
                                    </Box>
                                    <Box sx={{ px: 2, py: 1.5, bgcolor: "rgba(245, 247, 250, 0.5)", borderTop: `1px dashed ${T.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                        <Typography sx={{ fontFamily: fontMono, fontSize: "0.7rem", color: T.textMute }}>ID: {pass.id}</Typography>
                                        <Box display="flex" gap={1}>
                                            <IconButton size="small" onClick={() => openModal(pass)} sx={{ p: 0.5, color: T.textSub }}><Edit sx={{ fontSize: 16 }} /></IconButton>
                                            <IconButton size="small" onClick={() => handleDelete(pass.id)} sx={{ p: 0.5, color: T.danger }}><Delete sx={{ fontSize: 16 }} /></IconButton>
                                        </Box>
                                    </Box>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            </Card>

            <Dialog open={modal.open} onClose={() => setModal({ ...modal, open: false })} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: "16px", p: 1 } }}>
                <DialogTitle sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1.2rem", pb: 1 }}>{modal.mode === "create" ? "Issue New Pass" : "Edit Parking Pass"}</DialogTitle>
                <DialogContent sx={{ pb: 1, mt: 1 }}>
                    <Box display="flex" gap={2}>
                        <Box flex={1}><DInput label="User ID" placeholder="e.g. STU-2024-001" value={modal.data.userId || ""} onChange={(e) => setModal({ ...modal, data: { ...modal.data, userId: e.target.value } })} /></Box>
                        <Box flex={1}><DInput label="Full Name" placeholder="e.g. John Doe" value={modal.data.userName || ""} onChange={(e) => setModal({ ...modal, data: { ...modal.data, userName: e.target.value } })} /></Box>
                    </Box>
                    <Box display="flex" gap={2}>
                        <Box flex={1}><DInput label="User Type" options={["Student", "Staff", "Faculty"]} value={modal.data.userType || "Student"} onChange={(e) => setModal({ ...modal, data: { ...modal.data, userType: e.target.value } })} /></Box>
                        <Box flex={1}><DInput label="Vehicle Type" options={["2-Wheeler", "4-Wheeler"]} value={modal.data.vehicleType || "2-Wheeler"} onChange={(e) => setModal({ ...modal, data: { ...modal.data, vehicleType: e.target.value } })} /></Box>
                    </Box>
                    <DInput label="Vehicle Number" placeholder="e.g. KA-01-AB-1234" value={modal.data.vehicleNumber || ""} onChange={(e) => setModal({ ...modal, data: { ...modal.data, vehicleNumber: e.target.value.toUpperCase() } })} />
                    <Box display="flex" gap={2}>
                        <Box flex={1}><DInput label="Valid Until" type="date" value={modal.data.validUntil || ""} onChange={(e) => setModal({ ...modal, data: { ...modal.data, validUntil: e.target.value } })} /></Box>
                        <Box flex={1}><DInput label="Status" options={["Active", "Expired", "Revoked"]} value={modal.data.status || "Active"} onChange={(e) => setModal({ ...modal, data: { ...modal.data, status: e.target.value } })} /></Box>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 3 }}>
                    <Button onClick={() => setModal({ ...modal, open: false })} sx={{ fontFamily: fontBody, fontWeight: 600, color: T.textSub, textTransform: "none" }}>Cancel</Button>
                    <Button onClick={handleSave} variant="contained" sx={{ fontFamily: fontBody, fontWeight: 600, bgcolor: T.accent, textTransform: "none", borderRadius: "8px", boxShadow: "none" }}>{modal.mode === "create" ? "Issue Pass" : "Save Changes"}</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
