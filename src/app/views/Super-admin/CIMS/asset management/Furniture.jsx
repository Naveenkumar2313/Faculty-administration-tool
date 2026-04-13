import React, { useState } from "react";
import {
    Box, Card, Grid, Typography, Button, TextField, Table, TableBody, TableCell, TableHead, TableRow,
    IconButton, InputAdornment, Dialog, DialogTitle, DialogContent, DialogActions, Select, MenuItem
} from "@mui/material";
import {
    Search, FilterList, Add, Weekend, CheckCircle, Build, Warning, Edit, DeleteOutline, Place, Sell
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
    if (status === "Good") { bg = T.successLight; color = T.success; }
    else if (status === "Needs Repair") { bg = T.warningLight; color = T.warning; }
    else if (status === "In Storage") { bg = T.infoLight; color = T.info; }
    else if (status === "Damaged") { bg = T.dangerLight; color = T.danger; }
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

const initialFurniture = [
    { id: "FN-001", name: "Student Desk (Wooden)", category: "Desks", location: "CR-101", status: "Good", quantity: 40, purchaseDate: "2021-08-15", valuePerItem: 120 },
    { id: "FN-002", name: "Swivel Chair", category: "Chairs", location: "Computer Lab 1", status: "Needs Repair", quantity: 5, purchaseDate: "2022-05-20", valuePerItem: 85 },
    { id: "FN-003", name: "Whiteboard (Large)", category: "Boards", location: "CR-102", status: "Good", quantity: 1, purchaseDate: "2020-01-10", valuePerItem: 250 },
    { id: "FN-004", name: "Filing Cabinet", category: "Storage", location: "Staff Room A", status: "In Storage", quantity: 3, purchaseDate: "2019-11-05", valuePerItem: 150 },
    { id: "FN-005", name: "Auditorium Seating", category: "Chairs", location: "Auditorium", status: "Good", quantity: 200, purchaseDate: "2018-02-28", valuePerItem: 200 }
];

export default function Furniture() {
    const [searchTerm, setSearchTerm] = useState("");
    const [furniture, setFurniture] = useState(initialFurniture);
    const [modal, setModal] = useState({ open: false, mode: "create", data: {} });

    const handleSave = () => {
        if (modal.mode === "create") {
            const newItem = {
                id: `FN-${(furniture.length + 1).toString().padStart(3, '0')}`,
                name: modal.data.name || "Unnamed Furniture",
                category: modal.data.category || "Desks",
                location: modal.data.location || "Unknown",
                status: modal.data.status || "Good",
                quantity: Number(modal.data.quantity) || 1,
                purchaseDate: modal.data.purchaseDate || new Date().toISOString().split('T')[0],
                valuePerItem: Number(modal.data.valuePerItem) || 0
            };
            setFurniture([...furniture, newItem]);
        } else {
            setFurniture(furniture.map(f => f.id === modal.data.id ? { ...f, ...modal.data, quantity: Number(modal.data.quantity), valuePerItem: Number(modal.data.valuePerItem) } : f));
        }
        setModal({ ...modal, open: false });
    };

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this furniture record?")) {
            setFurniture(furniture.filter(f => f.id !== id));
        }
    };

    const filteredFurniture = furniture.filter(f =>
        f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.location.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Box sx={{ p: 3, background: T.bg, minHeight: "100vh", fontFamily: fontBody }}>
            <Fonts />
            <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3} className="fade-up">
                <Box>
                    <Typography sx={{ fontFamily: fontBody, fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: T.textMute, mb: 0.3 }}>Asset Management</Typography>
                    <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1.5rem", color: T.text, lineHeight: 1.1 }}>Furniture Assets</Typography>
                    <Typography sx={{ fontFamily: fontBody, fontSize: "0.82rem", color: T.textSub, mt: 0.4 }}>Manage desks, chairs, storage, and other physical furniture across the campus.</Typography>
                </Box>
                <Button variant="contained" startIcon={<Add sx={{ fontSize: 16 }} />} onClick={() => setModal({ open: true, mode: "create", data: { status: "Good", category: "Desks", quantity: 1, valuePerItem: 0 } })} sx={{ fontFamily: fontBody, fontWeight: 700, fontSize: "0.8rem", textTransform: "none", borderRadius: "8px", bgcolor: T.accent, boxShadow: "none" }}>Add Furniture</Button>
            </Box>

            <Grid container spacing={3} mb={3}>
                <Grid item xs={12} sm={6} md={3}><StatCard label="Total Items" value={furniture.reduce((acc, f) => acc + f.quantity, 0)} color={T.accent} bgLight={T.accentLight} icon={Weekend} /></Grid>
                <Grid item xs={12} sm={6} md={3}><StatCard label="Good Condition" value={furniture.filter(f => f.status === 'Good').reduce((acc, f) => acc + f.quantity, 0)} color={T.success} bgLight={T.successLight} icon={CheckCircle} /></Grid>
                <Grid item xs={12} sm={6} md={3}><StatCard label="Needs Repair" value={furniture.filter(f => f.status === 'Needs Repair').reduce((acc, f) => acc + f.quantity, 0)} color={T.warning} bgLight={T.warningLight} icon={Build} /></Grid>
                <Grid item xs={12} sm={6} md={3}><StatCard label="Total Value" value={`₹${furniture.reduce((acc, f) => acc + (f.valuePerItem * f.quantity), 0).toLocaleString()}`} color={T.info} bgLight={T.infoLight} icon={Sell} /></Grid>
            </Grid>

            <Card sx={{ borderRadius: "14px", border: `1px solid ${T.border}`, boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }} className="fade-up">
                <Box sx={{ p: 2.5, borderBottom: `1px solid ${T.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
                    <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1.1rem" }}>Furniture Directory</Typography>
                    <Box display="flex" gap={1.5}>
                        <TextField size="small" placeholder="Search furniture..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} InputProps={{ startAdornment: <InputAdornment position="start"><Search sx={{ fontSize: 16, color: T.textMute }} /></InputAdornment> }} sx={{ width: 260, "& .MuiOutlinedInput-root": { borderRadius: "8px", fontFamily: fontBody, fontSize: "0.8rem" } }} />
                        <Button variant="outlined" sx={{ minWidth: 0, p: 1, borderRadius: "8px", borderColor: T.border, color: T.textSub }}><FilterList sx={{ fontSize: 18 }} /></Button>
                    </Box>
                </Box>
                <Box sx={{ overflowX: "auto" }}>
                    <Table>
                        <TableHead><TableRow sx={{ bgcolor: "#F9FAFB" }}>
                            {["Asset Info", "Category", "Location", "Quantity", "Total Value", "Status", "Actions"].map(h => <TableCell key={h} sx={{ fontFamily: fontBody, fontWeight: 700, fontSize: "0.72rem", color: T.textMute, textTransform: "uppercase", py: 1.5, ...(h === "Actions" ? { textAlign: "right" } : {}) }}>{h}</TableCell>)}
                        </TableRow></TableHead>
                        <TableBody>
                            {filteredFurniture.map(row => (
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
                                    <TableCell><Typography sx={{ fontFamily: fontMono, fontSize: "0.85rem", color: T.text, fontWeight: 700 }}>{row.quantity}</Typography></TableCell>
                                    <TableCell>
                                        <Typography sx={{ fontFamily: fontMono, fontWeight: 700, fontSize: "0.9rem", color: T.text }}>₹{(row.quantity * row.valuePerItem).toLocaleString()}</Typography>
                                        <Typography sx={{ fontFamily: fontBody, fontSize: "0.7rem", color: T.textSub }}>₹{row.valuePerItem} each</Typography>
                                    </TableCell>
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
                <DialogTitle sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1.2rem", pb: 1 }}>{modal.mode === "create" ? "Add Furniture" : "Edit Furniture"}</DialogTitle>
                <DialogContent sx={{ pb: 1, mt: 1 }}>
                    <Box display="flex" gap={2}>
                        <Box flex={1}><DInput label="Furniture Name" placeholder="e.g. Student Desk" value={modal.data.name || ""} onChange={(e) => setModal({ ...modal, data: { ...modal.data, name: e.target.value } })} /></Box>
                        <Box flex={1}><DInput label="Category" options={["Desks", "Chairs", "Tables", "Storage", "Boards", "Other"]} value={modal.data.category || "Desks"} onChange={(e) => setModal({ ...modal, data: { ...modal.data, category: e.target.value } })} /></Box>
                    </Box>
                    <DInput label="Location" placeholder="e.g. CR-101" value={modal.data.location || ""} onChange={(e) => setModal({ ...modal, data: { ...modal.data, location: e.target.value } })} />
                    <Box display="flex" gap={2}>
                        <Box flex={1}><DInput label="Quantity" type="number" value={modal.data.quantity || 1} onChange={(e) => setModal({ ...modal, data: { ...modal.data, quantity: e.target.value } })} /></Box>
                        <Box flex={1}><DInput label="Value Per Item (₹)" type="number" value={modal.data.valuePerItem || 0} onChange={(e) => setModal({ ...modal, data: { ...modal.data, valuePerItem: e.target.value } })} /></Box>
                    </Box>
                    <Box display="flex" gap={2}>
                        <Box flex={1}><DInput label="Purchase Date" type="date" value={modal.data.purchaseDate || ""} onChange={(e) => setModal({ ...modal, data: { ...modal.data, purchaseDate: e.target.value } })} /></Box>
                        <Box flex={1}><DInput label="Status" options={["Good", "Needs Repair", "In Storage", "Damaged"]} value={modal.data.status || "Good"} onChange={(e) => setModal({ ...modal, data: { ...modal.data, status: e.target.value } })} /></Box>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 3 }}>
                    <Button onClick={() => setModal({ ...modal, open: false })} sx={{ fontFamily: fontBody, fontWeight: 600, color: T.textSub, textTransform: "none" }}>Cancel</Button>
                    <Button onClick={handleSave} variant="contained" sx={{ fontFamily: fontBody, fontWeight: 600, bgcolor: T.accent, textTransform: "none", borderRadius: "8px", boxShadow: "none" }}>{modal.mode === "create" ? "Add Furniture" : "Save Changes"}</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
