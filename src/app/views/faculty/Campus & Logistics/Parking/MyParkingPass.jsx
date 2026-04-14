import React, { useState } from "react";
import {
    Box, Card, Grid, Typography, Button, TextField,
    Dialog, DialogTitle, DialogContent, DialogActions, Select, MenuItem
} from "@mui/material";
import {
    DirectionsCar, CalendarMonth, CheckCircleOutline, Badge as BadgeIcon, Warning, Update, Add
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

export default function MyParkingPass() {
    const [pass, setPass] = useState({
        id: "pass-2024-FAC-889",
        vehicleNumber: "MH-12-AB-3456",
        vehicleType: "4-Wheeler",
        validUntil: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
        status: "Active"
    });
    const [modal, setModal] = useState({ open: false, mode: "renew", data: {} });

    const openModal = (mode) => {
        if (mode === "renew") {
            setModal({ open: true, mode: "renew", data: { ...pass, validUntil: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0] } });
        } else {
            setModal({ open: true, mode: "apply", data: { vehicleType: "4-Wheeler", vehicleNumber: "", validUntil: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0] } });
        }
    };

    const handleSave = () => {
        setPass({
            ...pass,
            ...modal.data,
            id: modal.mode === "apply" ? `pass-new-${Date.now()}` : pass.id,
            status: "Active"
        });
        setModal({ ...modal, open: false });
    };

    return (
        <Box sx={{ p: 3, background: T.bg, minHeight: "100vh", fontFamily: fontBody }}>
            <Fonts />
            <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3} className="fade-up">
                <Box>
                    <Typography sx={{ fontFamily: fontBody, fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: T.textMute, mb: 0.3 }}>Campus Logistics</Typography>
                    <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1.5rem", color: T.text, lineHeight: 1.1 }}>My Parking Pass</Typography>
                    <Typography sx={{ fontFamily: fontBody, fontSize: "0.82rem", color: T.textSub, mt: 0.4 }}>View, apply for, or renew your campus parking permit.</Typography>
                </Box>
                {pass.status === "None" ? (
                    <Button variant="contained" startIcon={<Add sx={{ fontSize: 16 }} />} onClick={() => openModal("apply")} sx={{ fontFamily: fontBody, fontWeight: 700, fontSize: "0.8rem", textTransform: "none", borderRadius: "8px", bgcolor: T.accent, boxShadow: "none" }}>Apply for Pass</Button>
                ) : (
                    <Button variant="outlined" startIcon={<Update sx={{ fontSize: 16 }} />} onClick={() => openModal("renew")} sx={{ fontFamily: fontBody, fontWeight: 700, fontSize: "0.8rem", textTransform: "none", borderRadius: "8px", borderColor: T.border, color: T.textSub }}>Renew Pass</Button>
                )}
            </Box>

            <Grid container spacing={3} mb={3}>
                <Grid item xs={12} md={6} lg={5}>
                    <Card className="fade-up" sx={{ borderRadius: "14px", border: `1px solid ${T.border}`, boxShadow: "0 1px 4px rgba(0,0,0,0.04)", overflow: "hidden" }}>
                        <Box sx={{ p: 3, background: `linear-gradient(135deg, ${T.accent} 0%, #4F46E5 100%)`, color: T.surface, position: "relative" }}>
                            <Box sx={{ position: "absolute", right: -20, top: -20, opacity: 0.1 }}><DirectionsCar sx={{ fontSize: 150 }} /></Box>
                            <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={4}>
                                <Box>
                                    <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                                        <BadgeIcon />
                                        <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1.2rem" }}>Faculty Parking Permit</Typography>
                                    </Box>
                                    <Typography sx={{ fontFamily: fontMono, fontSize: "0.8rem", opacity: 0.8 }}>Campus Authority</Typography>
                                </Box>
                            </Box>
                            <Box mb={2}>
                                <Typography sx={{ fontFamily: fontBody, fontSize: "0.7rem", textTransform: "uppercase", opacity: 0.8, letterSpacing: "0.05em", mb: 0.2 }}>Vehicle Number</Typography>
                                <Typography sx={{ fontFamily: fontMono, fontWeight: 700, fontSize: "1.4rem", letterSpacing: "0.1em" }}>{pass.vehicleNumber || "N/A"}</Typography>
                            </Box>
                            <Box display="flex" gap={4}>
                                <Box>
                                    <Typography sx={{ fontFamily: fontBody, fontSize: "0.7rem", textTransform: "uppercase", opacity: 0.8, letterSpacing: "0.05em", mb: 0.2 }}>Vehicle Type</Typography>
                                    <Typography sx={{ fontFamily: fontBody, fontWeight: 600, fontSize: "1rem" }}>{pass.vehicleType || "N/A"}</Typography>
                                </Box>
                                <Box>
                                    <Typography sx={{ fontFamily: fontBody, fontSize: "0.7rem", textTransform: "uppercase", opacity: 0.8, letterSpacing: "0.05em", mb: 0.2 }}>Valid Until</Typography>
                                    <Typography sx={{ fontFamily: fontMono, fontWeight: 600, fontSize: "1rem" }}>{pass.validUntil ? new Date(pass.validUntil).toLocaleDateString() : "N/A"}</Typography>
                                </Box>
                            </Box>
                        </Box>
                        <Box sx={{ p: 2, bgcolor: T.surface, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <Typography sx={{ fontFamily: fontMono, fontSize: "0.75rem", color: T.textMute }}>Pass ID: {pass.id || "N/A"}</Typography>
                            <Box sx={{ px: 1.5, py: 0.4, borderRadius: "6px", bgcolor: pass.status === "Active" ? T.successLight : T.warningLight, color: pass.status === "Active" ? T.success : T.warning, display: "flex", alignItems: "center", gap: 0.5 }}>
                                {pass.status === "Active" ? <CheckCircleOutline sx={{ fontSize: 16 }} /> : <Warning sx={{ fontSize: 16 }} />}
                                <Typography sx={{ fontFamily: fontBody, fontWeight: 700, fontSize: "0.8rem" }}>{pass.status}</Typography>
                            </Box>
                        </Box>
                    </Card>
                </Grid>
                <Grid item xs={12} md={6} lg={7}>
                    <Card className="fade-up" sx={{ p: 3, borderRadius: "14px", border: `1px solid ${T.border}`, boxShadow: "0 1px 4px rgba(0,0,0,0.04)", height: "100%" }}>
                        <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1.1rem", mb: 2 }}>Parking Guidelines</Typography>
                        <Typography sx={{ fontFamily: fontBody, fontSize: "0.85rem", color: T.textSub, mb: 1 }}>• Faculty passes are valid in all Staff and Mixed zones across the campus.</Typography>
                        <Typography sx={{ fontFamily: fontBody, fontSize: "0.85rem", color: T.textSub, mb: 1 }}>• Passes must be renewed annually before the expiry date to avoid access denial.</Typography>
                        <Typography sx={{ fontFamily: fontBody, fontSize: "0.85rem", color: T.textSub, mb: 1 }}>• Registering a new vehicle automatically revokes your previous active pass.</Typography>
                        <Typography sx={{ fontFamily: fontBody, fontSize: "0.85rem", color: T.textSub, mb: 1 }}>• Temporary passes for rental vehicles or visitors can be requested from the administration.</Typography>
                    </Card>
                </Grid>
            </Grid>

            <Dialog open={modal.open} onClose={() => setModal({ ...modal, open: false })} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: "16px", p: 1 } }}>
                <DialogTitle sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1.2rem", pb: 1 }}>{modal.mode === "apply" ? "Apply for Parking Pass" : "Renew Parking Pass"}</DialogTitle>
                <DialogContent sx={{ pb: 1, mt: 1 }}>
                    <DInput label="Vehicle Type" options={["2-Wheeler", "4-Wheeler"]} value={modal.data.vehicleType || ""} onChange={(e) => setModal({ ...modal, data: { ...modal.data, vehicleType: e.target.value } })} />
                    <DInput label="Vehicle Number" placeholder="e.g. MH-12-AB-3456" value={modal.data.vehicleNumber || ""} onChange={(e) => setModal({ ...modal, data: { ...modal.data, vehicleNumber: e.target.value.toUpperCase() } })} />
                    <DInput label="Valid Until" type="date" value={modal.data.validUntil || ""} onChange={(e) => setModal({ ...modal, data: { ...modal.data, validUntil: e.target.value } })} />
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 3 }}>
                    <Button onClick={() => setModal({ ...modal, open: false })} sx={{ fontFamily: fontBody, fontWeight: 600, color: T.textSub, textTransform: "none" }}>Cancel</Button>
                    <Button onClick={handleSave} variant="contained" sx={{ fontFamily: fontBody, fontWeight: 600, bgcolor: T.accent, textTransform: "none", borderRadius: "8px", boxShadow: "none" }}>Submit</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
