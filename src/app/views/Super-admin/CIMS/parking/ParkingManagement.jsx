import React, { useState } from "react";
import {
    Box, Card, Grid, Typography, Button, TextField, Table, TableBody, TableCell, TableHead, TableRow,
    IconButton, InputAdornment, Dialog, DialogTitle, DialogContent, DialogActions, Select, MenuItem, LinearProgress
} from "@mui/material";
import {
    Search, FilterList, Add, CarCrash, LocalParking, VerifiedUser, Edit, DeleteOutline, Place, Warning
} from "@mui/icons-material";

/* ── Design Tokens ── */
const T = {
    bg: "#F5F7FA", surface: "#FFFFFF", border: "#E4E8EF", text: "#111827", textSub: "#4B5563", textMute: "#9CA3AF",
    accent: "#6366F1", accentLight: "#EEF2FF", success: "#10B981", successLight: "#ECFDF5",
    warning: "#F59E0B", warningLight: "#FFFBEB", orange: "#F97316", orangeLight: "#FFEDD5", danger: "#EF4444", dangerLight: "#FEF2F2",
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

const StatCard = ({ label, value, color, bgLight, icon: Icon, unit }) => (
    <Card className="fade-up" sx={{ p: 2.5, borderRadius: "14px", border: `1px solid ${T.border}`, background: T.surface, boxShadow: "0 1px 4px rgba(0,0,0,0.04)", height: "100%" }}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
            <Box>
                <Typography sx={{ fontFamily: fontBody, fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: T.textMute, mb: 0.5 }}>{label}</Typography>
                <Typography sx={{ fontFamily: fontMono, fontWeight: 700, fontSize: "1.8rem", color: color || T.text, lineHeight: 1.1 }}>
                    {value} {unit && <span style={{ fontSize: "0.85rem", color: T.textMute, fontFamily: fontBody }}>{unit}</span>}
                </Typography>
            </Box>
            <Box sx={{ p: 1.2, borderRadius: "10px", bgcolor: bgLight, color: color }}><Icon sx={{ fontSize: 22 }} /></Box>
        </Box>
    </Card>
);

const initialZones = [
    { id: "pz-1", name: "North Block Parking", location: "Near Gate 1", type: "Staff", vehicleType: "4-Wheeler", totalSpots: 50, occupiedSpots: 42, status: "Active" },
    { id: "pz-2", name: "Student Parking A", location: "Near Engineering Block", type: "Student", vehicleType: "2-Wheeler", totalSpots: 200, occupiedSpots: 185, status: "Active" },
    { id: "pz-3", name: "Visitor Parking", location: "Main Entrance", type: "Visitor", vehicleType: "Both", totalSpots: 30, occupiedSpots: 12, status: "Active" },
    { id: "pz-4", name: "Underground Parking", location: "Admin Block", type: "Staff", vehicleType: "4-Wheeler", totalSpots: 100, occupiedSpots: 98, status: "Active" }
];

export default function ParkingManagement() {
    const [searchTerm, setSearchTerm] = useState("");
    const [zones, setZones] = useState(initialZones);
    const [modal, setModal] = useState({ open: false, mode: "create", data: {} });

    const openModal = (zone = null) => {
        if (zone) {
            setModal({ open: true, mode: "edit", data: { ...zone, totalSpots: String(zone.totalSpots) } });
        } else {
            setModal({ open: true, mode: "create", data: { type: "Mixed", vehicleType: "Both", totalSpots: "", status: "Active" } });
        }
    };

    const handleSave = () => {
        if (modal.mode === "create") {
            const newZone = {
                id: `pz-${Date.now()}`,
                ...modal.data,
                totalSpots: parseInt(modal.data.totalSpots) || 0,
                occupiedSpots: 0
            };
            setZones([...zones, newZone]);
        } else {
            setZones(zones.map(z => z.id === modal.data.id ? { ...z, ...modal.data, totalSpots: parseInt(modal.data.totalSpots) || 0 } : z));
        }
        setModal({ ...modal, open: false });
    };

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this parking zone?")) {
            setZones(zones.filter(z => z.id !== id));
        }
    };

    const filteredZones = zones.filter(z =>
        z.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        z.location.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalCapacity = zones.reduce((acc, z) => acc + z.totalSpots, 0);
    const totalOccupied = zones.reduce((acc, z) => acc + z.occupiedSpots, 0);
    const occupancyRate = totalCapacity > 0 ? Math.round((totalOccupied / totalCapacity) * 100) : 0;

    return (
        <Box sx={{ p: 3, background: T.bg, minHeight: "100vh", fontFamily: fontBody }}>
            <Fonts />
            <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3} className="fade-up">
                <Box>
                    <Typography sx={{ fontFamily: fontBody, fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: T.textMute, mb: 0.3 }}>Campus Logistics</Typography>
                    <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1.5rem", color: T.text, lineHeight: 1.1 }}>Parking Management</Typography>
                    <Typography sx={{ fontFamily: fontBody, fontSize: "0.82rem", color: T.textSub, mt: 0.4 }}>Manage campus parking zones, capacity, and availability.</Typography>
                </Box>
                <Button variant="contained" startIcon={<Add sx={{ fontSize: 16 }} />} onClick={() => openModal()} sx={{ fontFamily: fontBody, fontWeight: 700, fontSize: "0.8rem", textTransform: "none", borderRadius: "8px", bgcolor: T.accent, boxShadow: "none" }}>Add Parking Zone</Button>
            </Box>

            <Grid container spacing={3} mb={3}>
                <Grid item xs={12} sm={4}><StatCard label="Total Capacity" value={totalCapacity} unit="spots" color={T.accent} bgLight={T.accentLight} icon={LocalParking} /></Grid>
                <Grid item xs={12} sm={4}><StatCard label="Currently Occupied" value={totalOccupied} unit="vehicles" color={T.info} bgLight={T.infoLight} icon={VerifiedUser} /></Grid>
                <Grid item xs={12} sm={4}><StatCard label="Overall Occupancy Rate" value={`${occupancyRate}%`} color={occupancyRate > 90 ? T.danger : T.success} bgLight={occupancyRate > 90 ? T.dangerLight : T.successLight} icon={Warning} /></Grid>
            </Grid>

            <Card sx={{ borderRadius: "14px", border: `1px solid ${T.border}`, boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }} className="fade-up">
                <Box sx={{ p: 2.5, borderBottom: `1px solid ${T.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
                    <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1.1rem" }}>Parking Zones</Typography>
                    <Box display="flex" gap={1.5}>
                        <TextField size="small" placeholder="Search zones..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} InputProps={{ startAdornment: <InputAdornment position="start"><Search sx={{ fontSize: 16, color: T.textMute }} /></InputAdornment> }} sx={{ width: 260, "& .MuiOutlinedInput-root": { borderRadius: "8px", fontFamily: fontBody, fontSize: "0.8rem" } }} />
                    </Box>
                </Box>
                <Box sx={{ pb: 3 }}>
                    <Grid container spacing={3} sx={{ p: 2.5 }}>
                        {filteredZones.map(zone => {
                            const zoneOccupancy = Math.round((zone.occupiedSpots / zone.totalSpots) * 100);
                            const isFull = zoneOccupancy >= 100;
                            const isAlmostFull = zoneOccupancy >= 90 && !isFull;
                            const progressColor = isFull ? T.danger : isAlmostFull ? T.orange : T.success;

                            return (
                                <Grid item xs={12} md={6} lg={4} key={zone.id}>
                                    <Box sx={{ border: `1px solid ${T.border}`, borderRadius: "12px", p: 2, background: T.surface, transition: "all 0.2s", "&:hover": { boxShadow: "0 4px 12px rgba(0,0,0,0.05)" } }}>
                                        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1.5}>
                                            <Typography sx={{ fontFamily: fontBody, fontWeight: 700, fontSize: "1rem", color: T.text }} noWrap>{zone.name}</Typography>
                                            <Box sx={{ px: 1, py: 0.3, borderRadius: "4px", fontSize: "0.7rem", fontWeight: 700, bgcolor: zone.status === 'Active' ? T.successLight : (zone.status === 'Maintenance' ? T.warningLight : T.dangerLight), color: zone.status === 'Active' ? T.success : (zone.status === 'Maintenance' ? T.warning : T.danger) }}>
                                                {zone.status}
                                            </Box>
                                        </Box>

                                        <Box display="flex" flexDirection="column" gap={0.8} mb={2}>
                                            <Box display="flex" alignItems="center" gap={1}><Place sx={{ fontSize: 16, color: T.textMute }} /><Typography sx={{ fontFamily: fontBody, fontSize: "0.8rem", color: T.textSub }}>{zone.location}</Typography></Box>
                                            <Box display="flex" alignItems="center" gap={1}><CarCrash sx={{ fontSize: 16, color: T.textMute }} /><Typography sx={{ fontFamily: fontBody, fontSize: "0.8rem", color: T.textSub }}>{zone.type} • {zone.vehicleType}</Typography></Box>
                                        </Box>

                                        <Box sx={{ pt: 2, borderTop: `1px solid ${T.border}` }}>
                                            <Box display="flex" justifyContent="space-between" mb={1}>
                                                <Typography sx={{ fontFamily: fontBody, fontSize: "0.75rem", fontWeight: 600, color: T.textSub }}>Availability</Typography>
                                                <Typography sx={{ fontFamily: fontBody, fontSize: "0.75rem", fontWeight: 700, color: progressColor }}>
                                                    {zone.totalSpots - zone.occupiedSpots} spots left
                                                </Typography>
                                            </Box>
                                            <LinearProgress variant="determinate" value={Math.min(zoneOccupancy, 100)} sx={{ height: 8, borderRadius: "4px", bgcolor: "#E4E8EF", "& .MuiLinearProgress-bar": { borderRadius: "4px", bgcolor: progressColor } }} />
                                            <Box display="flex" justifyContent="flex-end" mt={0.5}>
                                                <Typography sx={{ fontFamily: fontMono, fontSize: "0.68rem", color: T.textMute }}>{zone.occupiedSpots} / {zone.totalSpots} ({zoneOccupancy}%)</Typography>
                                            </Box>
                                        </Box>

                                        <Box display="flex" justifyContent="flex-end" gap={1} mt={2} pt={1.5} sx={{ borderTop: `1px dashed ${T.border}` }}>
                                            <Button size="small" onClick={() => openModal(zone)} startIcon={<Edit sx={{ fontSize: 14 }} />} sx={{ fontFamily: fontBody, fontSize: "0.7rem", fontWeight: 700, color: T.textSub, textTransform: "none" }}>Edit</Button>
                                            <Button size="small" onClick={() => handleDelete(zone.id)} startIcon={<DeleteOutline sx={{ fontSize: 14 }} />} sx={{ fontFamily: fontBody, fontSize: "0.7rem", fontWeight: 700, color: T.danger, textTransform: "none" }}>Delete</Button>
                                        </Box>
                                    </Box>
                                </Grid>
                            );
                        })}
                    </Grid>
                </Box>
            </Card>

            <Dialog open={modal.open} onClose={() => setModal({ ...modal, open: false })} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: "16px", p: 1 } }}>
                <DialogTitle sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1.2rem", pb: 1 }}>{modal.mode === "create" ? "Add Parking Zone" : "Edit Parking Zone"}</DialogTitle>
                <DialogContent sx={{ pb: 1, mt: 1 }}>
                    <DInput label="Zone Name" placeholder="e.g. North Block Parking" value={modal.data.name || ""} onChange={(e) => setModal({ ...modal, data: { ...modal.data, name: e.target.value } })} />
                    <DInput label="Location" placeholder="e.g. Near Gate 1" value={modal.data.location || ""} onChange={(e) => setModal({ ...modal, data: { ...modal.data, location: e.target.value } })} />
                    <Box display="flex" gap={2}>
                        <Box flex={1}><DInput label="User Type" options={["Student", "Staff", "Visitor", "Mixed"]} value={modal.data.type || "Mixed"} onChange={(e) => setModal({ ...modal, data: { ...modal.data, type: e.target.value } })} /></Box>
                        <Box flex={1}><DInput label="Vehicle Type" options={["2-Wheeler", "4-Wheeler", "Both"]} value={modal.data.vehicleType || "Both"} onChange={(e) => setModal({ ...modal, data: { ...modal.data, vehicleType: e.target.value } })} /></Box>
                    </Box>
                    <Box display="flex" gap={2}>
                        <Box flex={1}><DInput label="Total Capacity" type="number" placeholder="e.g. 100" value={modal.data.totalSpots || ""} onChange={(e) => setModal({ ...modal, data: { ...modal.data, totalSpots: e.target.value } })} /></Box>
                        <Box flex={1}><DInput label="Status" options={["Active", "Maintenance", "Closed"]} value={modal.data.status || "Active"} onChange={(e) => setModal({ ...modal, data: { ...modal.data, status: e.target.value } })} /></Box>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 3 }}>
                    <Button onClick={() => setModal({ ...modal, open: false })} sx={{ fontFamily: fontBody, fontWeight: 600, color: T.textSub, textTransform: "none" }}>Cancel</Button>
                    <Button onClick={handleSave} variant="contained" sx={{ fontFamily: fontBody, fontWeight: 600, bgcolor: T.accent, textTransform: "none", borderRadius: "8px", boxShadow: "none" }}>{modal.mode === "create" ? "Save Zone" : "Save Changes"}</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
