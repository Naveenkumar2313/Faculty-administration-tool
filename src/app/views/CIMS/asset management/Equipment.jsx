import React, { useState } from "react";
import {
    Box, Card, Grid, Typography, Button, TextField, Table, TableBody, TableCell, TableHead, TableRow,
    IconButton, InputAdornment, Dialog, DialogTitle, DialogContent, DialogActions, Select, MenuItem
} from "@mui/material";
import {
    Search, FilterList, Add, Computer, CheckCircle, Build, Warning, Edit, DeleteOutline, Place, DateRange, Sell
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
    if (status === "Active") { bg = T.successLight; color = T.success; }
    else if (status === "Maintenance") { bg = T.warningLight; color = T.warning; }
    else if (status === "In Storage") { bg = T.infoLight; color = T.info; }
    else if (status === "Retired") { bg = T.dangerLight; color = T.danger; }
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

const initialEquipment = [
    { id: "EQ-001", name: "Dell OptiPlex 7090", category: "Computers", location: "Computer Lab 1", status: "Active", purchaseDate: "2022-08-15", lastMaintenance: "2023-09-10", value: 1200 },
    { id: "EQ-002", name: "Epson Projector X400", category: "AV Equipment", location: "Auditorium", status: "Maintenance", purchaseDate: "2021-05-20", lastMaintenance: "2023-10-22", value: 850 },
    { id: "EQ-003", name: "Cisco Catalyst 9300", category: "Networking", location: "Server Room", status: "Active", purchaseDate: "2023-01-10", lastMaintenance: "2023-10-01", value: 3500 },
    { id: "EQ-004", name: "HP LaserJet Pro", category: "Printers", location: "Staff Room A", status: "In Storage", purchaseDate: "2020-11-05", lastMaintenance: "2023-06-15", value: 400 },
    { id: "EQ-005", name: "Smart Board 800", category: "AV Equipment", location: "CR-101", status: "Active", purchaseDate: "2022-02-28", lastMaintenance: "2023-08-20", value: 2100 }
];

export default function Equipment() {
    const [searchTerm, setSearchTerm] = useState("");
    const [equipment, setEquipment] = useState(initialEquipment);
    const [modal, setModal] = useState({ open: false, mode: "create", data: {} });

    const handleSave = () => {
        if (modal.mode === "create") {
            const newItem = {
                id: `EQ-${(equipment.length + 1).toString().padStart(3, '0')}`,
                name: modal.data.name || "Unnamed Equipment",
                category: modal.data.category || "Computers",
                location: modal.data.location || "Unknown",
                status: modal.data.status || "Active",
                purchaseDate: modal.data.purchaseDate || new Date().toISOString().split('T')[0],
                lastMaintenance: modal.data.lastMaintenance || new Date().toISOString().split('T')[0],
                value: Number(modal.data.value) || 0
            };
            setEquipment([...equipment, newItem]);
        } else {
            setEquipment(equipment.map(e => e.id === modal.data.id ? { ...e, ...modal.data, value: Number(modal.data.value) } : e));
        }
        setModal({ ...modal, open: false });
    };

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this equipment?")) {
            setEquipment(equipment.filter(e => e.id !== id));
        }
    };

    const filteredEquipment = equipment.filter(e =>
        e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.location.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Box sx={{ p: 3, background: T.bg, minHeight: "100vh", fontFamily: fontBody }}>
            <Fonts />
            <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3} className="fade-up">
                <Box>
                    <Typography sx={{ fontFamily: fontBody, fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: T.textMute, mb: 0.3 }}>Asset Management</Typography>
                    <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1.5rem", color: T.text, lineHeight: 1.1 }}>Equipment Assets</Typography>
                    <Typography sx={{ fontFamily: fontBody, fontSize: "0.82rem", color: T.textSub, mt: 0.4 }}>Manage electronic and technical equipment across the campus.</Typography>
                </Box>
                <Button variant="contained" startIcon={<Add sx={{ fontSize: 16 }} />} onClick={() => setModal({ open: true, mode: "create", data: { status: "Active", category: "Computers", value: 0 } })} sx={{ fontFamily: fontBody, fontWeight: 700, fontSize: "0.8rem", textTransform: "none", borderRadius: "8px", bgcolor: T.accent, boxShadow: "none" }}>Add Equipment</Button>
            </Box>

            <Grid container spacing={3} mb={3}>
                <Grid item xs={12} sm={6} md={3}><StatCard label="Total Equipment" value={equipment.length} color={T.accent} bgLight={T.accentLight} icon={Computer} /></Grid>
                <Grid item xs={12} sm={6} md={3}><StatCard label="Active" value={equipment.filter(e => e.status === 'Active').length} color={T.success} bgLight={T.successLight} icon={CheckCircle} /></Grid>
                <Grid item xs={12} sm={6} md={3}><StatCard label="In Maintenance" value={equipment.filter(e => e.status === 'Maintenance').length} color={T.warning} bgLight={T.warningLight} icon={Build} /></Grid>
                <Grid item xs={12} sm={6} md={3}><StatCard label="Total Value" value={`₹${equipment.reduce((acc, e) => acc + e.value, 0).toLocaleString()}`} color={T.info} bgLight={T.infoLight} icon={Sell} /></Grid>
            </Grid>

            <Card sx={{ borderRadius: "14px", border: `1px solid ${T.border}`, boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }} className="fade-up">
                <Box sx={{ p: 2.5, borderBottom: `1px solid ${T.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
                    <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1.1rem" }}>Equipment Directory</Typography>
                    <Box display="flex" gap={1.5}>
                        <TextField size="small" placeholder="Search equipment..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} InputProps={{ startAdornment: <InputAdornment position="start"><Search sx={{ fontSize: 16, color: T.textMute }} /></InputAdornment> }} sx={{ width: 260, "& .MuiOutlinedInput-root": { borderRadius: "8px", fontFamily: fontBody, fontSize: "0.8rem" } }} />
                        <Button variant="outlined" sx={{ minWidth: 0, p: 1, borderRadius: "8px", borderColor: T.border, color: T.textSub }}><FilterList sx={{ fontSize: 18 }} /></Button>
                    </Box>
                </Box>
                <Box sx={{ overflowX: "auto" }}>
                    <Table>
                        <TableHead><TableRow sx={{ bgcolor: "#F9FAFB" }}>
                            {["Asset Info", "Category", "Location", "Purchase Date", "Last Maint.", "Value", "Status", "Actions"].map(h => <TableCell key={h} sx={{ fontFamily: fontBody, fontWeight: 700, fontSize: "0.72rem", color: T.textMute, textTransform: "uppercase", py: 1.5, ...(h === "Actions" ? { textAlign: "right" } : {}) }}>{h}</TableCell>)}
                        </TableRow></TableHead>
                        <TableBody>
                            {filteredEquipment.map(row => (
                                <TableRow key={row.id} className="row-hover">
                                    <TableCell>
                                        <Typography sx={{ fontFamily: fontBody, fontWeight: 700, fontSize: "0.9rem", color: T.text }}>{row.name}</Typography>
                                        <Typography sx={{ fontFamily: fontMono, fontSize: "0.75rem", color: T.textSub }}>{row.id}</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Box sx={{ display: "inline-block", px: 1, py: 0.3, borderRadius: "4px", border: `1px solid ${T.border}`, fontFamily: fontBody, fontSize: "0.75rem", fontWeight: 600, color: T.textSub }}>{row.category}</Box>
                                    </TableCell>
                                    <TableCell>
                                        <Box display="flex" alignItems="center" gap={1}><Place sx={{ fontSize: 16, color: T.textMute }} /><Typography sx={{ fontFamily: fontBody, fontSize: "0.8rem", color: T.textSub }}>{row.location}</Typography></Box>
                                    </TableCell>
                                    <TableCell><Typography sx={{ fontFamily: fontMono, fontSize: "0.8rem", color: T.textSub }}>{row.purchaseDate}</Typography></TableCell>
                                    <TableCell><Typography sx={{ fontFamily: fontMono, fontSize: "0.8rem", color: T.textSub }}>{row.lastMaintenance}</Typography></TableCell>
                                    <TableCell><Typography sx={{ fontFamily: fontMono, fontWeight: 700, fontSize: "0.9rem", color: T.text }}>₹{row.value.toLocaleString()}</Typography></TableCell>
                                    <TableCell><StatusPill status={row.status} /></TableCell>
                                    <TableCell sx={{ textAlign: "right", py: 1 }}>
                                        <IconButton size="small" onClick={() => setModal({ open: true, mode: "edit", data: row })} sx={{ color: T.textMute }}><Edit sx={{ fontSize: 16 }} /></IconButton>
                                        <IconButton size="small" onClick={() => handleDelete(row.id)} sx={{ color: T.danger }}><DeleteOutline sx={{ fontSize: 16 }} /></IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Box>
            </Card>

            <Dialog open={modal.open} onClose={() => setModal({ ...modal, open: false })} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: "16px", p: 1 } }}>
                <DialogTitle sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1.2rem", pb: 1 }}>{modal.mode === "create" ? "Add Equipment" : "Edit Equipment"}</DialogTitle>
                <DialogContent sx={{ pb: 1, mt: 1 }}>
                    <Box display="flex" gap={2}>
                        <Box flex={1}><DInput label="Equipment Name" placeholder="e.g. Dell OptiPlex 7090" value={modal.data.name || ""} onChange={(e) => setModal({ ...modal, data: { ...modal.data, name: e.target.value } })} /></Box>
                        <Box flex={1}><DInput label="Category" options={["Computers", "AV Equipment", "Networking", "Printers", "Lab Equipment", "Other"]} value={modal.data.category || "Computers"} onChange={(e) => setModal({ ...modal, data: { ...modal.data, category: e.target.value } })} /></Box>
                    </Box>
                    <DInput label="Location" placeholder="e.g. Computer Lab 1" value={modal.data.location || ""} onChange={(e) => setModal({ ...modal, data: { ...modal.data, location: e.target.value } })} />
                    <Box display="flex" gap={2}>
                        <Box flex={1}><DInput label="Purchase Date" type="date" value={modal.data.purchaseDate || ""} onChange={(e) => setModal({ ...modal, data: { ...modal.data, purchaseDate: e.target.value } })} /></Box>
                        <Box flex={1}><DInput label="Last Maintenance" type="date" value={modal.data.lastMaintenance || ""} onChange={(e) => setModal({ ...modal, data: { ...modal.data, lastMaintenance: e.target.value } })} /></Box>
                    </Box>
                    <Box display="flex" gap={2}>
                        <Box flex={1}><DInput label="Value (₹)" type="number" value={modal.data.value || 0} onChange={(e) => setModal({ ...modal, data: { ...modal.data, value: e.target.value } })} /></Box>
                        <Box flex={1}><DInput label="Status" options={["Active", "Maintenance", "In Storage", "Retired"]} value={modal.data.status || "Active"} onChange={(e) => setModal({ ...modal, data: { ...modal.data, status: e.target.value } })} /></Box>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 3 }}>
                    <Button onClick={() => setModal({ ...modal, open: false })} sx={{ fontFamily: fontBody, fontWeight: 600, color: T.textSub, textTransform: "none" }}>Cancel</Button>
                    <Button onClick={handleSave} variant="contained" sx={{ fontFamily: fontBody, fontWeight: 600, bgcolor: T.accent, textTransform: "none", borderRadius: "8px", boxShadow: "none" }}>{modal.mode === "create" ? "Add Equipment" : "Save Changes"}</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
