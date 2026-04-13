import React, { useState } from "react";
import {
    Box, Card, Grid, Typography, Button, TextField, Table, TableBody, TableCell, TableHead, TableRow,
    IconButton, InputAdornment, Dialog, DialogTitle, DialogContent, DialogActions, Select, MenuItem
} from "@mui/material";
import {
    Search, FilterList, Add, Inventory, CheckCircle, Warning, ErrorOutline, Edit, DeleteOutline, Business
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

const getStatus = (quantity, reorderLevel) => {
    if (quantity === 0) return "Out of Stock";
    if (quantity <= reorderLevel) return "Low Stock";
    return "In Stock";
};

const StatusPill = ({ status }) => {
    let bg, color;
    if (status === "In Stock") { bg = T.successLight; color = T.success; }
    else if (status === "Low Stock") { bg = T.warningLight; color = T.warning; }
    else if (status === "Out of Stock") { bg = T.dangerLight; color = T.danger; }
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

const initialInventory = [
    { id: "INV-001", name: "A4 Printer Paper (Ream)", category: "Stationery", supplier: "Office Supplies Co.", quantity: 150, reorderLevel: 50, unitPrice: 5.50, lastRestocked: "2023-10-15" },
    { id: "INV-002", name: "Whiteboard Markers (Pack of 4)", category: "Stationery", supplier: "EduMart", quantity: 20, reorderLevel: 30, unitPrice: 8.00, lastRestocked: "2023-09-20" },
    { id: "INV-003", name: "Hand Sanitizer (5L)", category: "Cleaning", supplier: "Hygiene Plus", quantity: 5, reorderLevel: 10, unitPrice: 25.00, lastRestocked: "2023-08-10" },
    { id: "INV-004", name: "Projector Bulbs", category: "Electronics", supplier: "TechVision", quantity: 0, reorderLevel: 5, unitPrice: 120.00, lastRestocked: "2023-05-12" },
    { id: "INV-005", name: "Ethernet Cables (Cat6, 5m)", category: "Electronics", supplier: "NetGear", quantity: 45, reorderLevel: 20, unitPrice: 12.50, lastRestocked: "2023-10-01" }
];

export default function Inventory_() {
    const [searchTerm, setSearchTerm] = useState("");
    const [inventory, setInventory] = useState(initialInventory);
    const [modal, setModal] = useState({ open: false, mode: "create", data: {} });

    const handleSave = () => {
        if (modal.mode === "create") {
            const newItem = {
                id: `INV-${(inventory.length + 1).toString().padStart(3, '0')}`,
                name: modal.data.name || "Unnamed Item",
                category: modal.data.category || "Stationery",
                supplier: modal.data.supplier || "Unknown",
                quantity: Number(modal.data.quantity) || 0,
                reorderLevel: Number(modal.data.reorderLevel) || 10,
                unitPrice: Number(modal.data.unitPrice) || 0,
                lastRestocked: modal.data.lastRestocked || new Date().toISOString().split('T')[0]
            };
            setInventory([...inventory, newItem]);
        } else {
            setInventory(inventory.map(i => i.id === modal.data.id ? {
                ...i, ...modal.data, quantity: Number(modal.data.quantity), reorderLevel: Number(modal.data.reorderLevel), unitPrice: Number(modal.data.unitPrice)
            } : i));
        }
        setModal({ ...modal, open: false });
    };

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this inventory item?")) {
            setInventory(inventory.filter(i => i.id !== id));
        }
    };

    const filteredInventory = inventory.filter(i =>
        i.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        i.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        i.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Box sx={{ p: 3, background: T.bg, minHeight: "100vh", fontFamily: fontBody }}>
            <Fonts />
            <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3} className="fade-up">
                <Box>
                    <Typography sx={{ fontFamily: fontBody, fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: T.textMute, mb: 0.3 }}>Asset Management</Typography>
                    <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1.5rem", color: T.text, lineHeight: 1.1 }}>Consumable Inventory</Typography>
                    <Typography sx={{ fontFamily: fontBody, fontSize: "0.82rem", color: T.textSub, mt: 0.4 }}>Manage stationery, cleaning supplies, and other consumable items.</Typography>
                </Box>
                <Button variant="contained" startIcon={<Add sx={{ fontSize: 16 }} />} onClick={() => setModal({ open: true, mode: "create", data: { category: "Stationery", quantity: 0, reorderLevel: 10, unitPrice: 0 } })} sx={{ fontFamily: fontBody, fontWeight: 700, fontSize: "0.8rem", textTransform: "none", borderRadius: "8px", bgcolor: T.accent, boxShadow: "none" }}>Add Item</Button>
            </Box>

            <Grid container spacing={3} mb={3}>
                <Grid item xs={12} sm={6} md={3}><StatCard label="Total Items" value={inventory.length} color={T.accent} bgLight={T.accentLight} icon={Inventory} /></Grid>
                <Grid item xs={12} sm={6} md={3}><StatCard label="In Stock" value={inventory.filter(i => getStatus(i.quantity, i.reorderLevel) === 'In Stock').length} color={T.success} bgLight={T.successLight} icon={CheckCircle} /></Grid>
                <Grid item xs={12} sm={6} md={3}><StatCard label="Low Stock" value={inventory.filter(i => getStatus(i.quantity, i.reorderLevel) === 'Low Stock').length} color={T.warning} bgLight={T.warningLight} icon={Warning} /></Grid>
                <Grid item xs={12} sm={6} md={3}><StatCard label="Out of Stock" value={inventory.filter(i => getStatus(i.quantity, i.reorderLevel) === 'Out of Stock').length} color={T.danger} bgLight={T.dangerLight} icon={ErrorOutline} /></Grid>
            </Grid>

            <Card sx={{ borderRadius: "14px", border: `1px solid ${T.border}`, boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }} className="fade-up">
                <Box sx={{ p: 2.5, borderBottom: `1px solid ${T.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
                    <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1.1rem" }}>Inventory Directory</Typography>
                    <Box display="flex" gap={1.5}>
                        <TextField size="small" placeholder="Search inventory..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} InputProps={{ startAdornment: <InputAdornment position="start"><Search sx={{ fontSize: 16, color: T.textMute }} /></InputAdornment> }} sx={{ width: 260, "& .MuiOutlinedInput-root": { borderRadius: "8px", fontFamily: fontBody, fontSize: "0.8rem" } }} />
                        <Button variant="outlined" sx={{ minWidth: 0, p: 1, borderRadius: "8px", borderColor: T.border, color: T.textSub }}><FilterList sx={{ fontSize: 18 }} /></Button>
                    </Box>
                </Box>
                <Box sx={{ overflowX: "auto" }}>
                    <Table>
                        <TableHead><TableRow sx={{ bgcolor: "#F9FAFB" }}>
                            {["Item Info", "Category", "Supplier", "Quantity", "Total Value", "Status", "Actions"].map(h => <TableCell key={h} sx={{ fontFamily: fontBody, fontWeight: 700, fontSize: "0.72rem", color: T.textMute, textTransform: "uppercase", py: 1.5, ...(h === "Actions" ? { textAlign: "right" } : {}) }}>{h}</TableCell>)}
                        </TableRow></TableHead>
                        <TableBody>
                            {filteredInventory.map(row => (
                                <TableRow key={row.id} className="row-hover">
                                    <TableCell>
                                        <Typography sx={{ fontFamily: fontBody, fontWeight: 700, fontSize: "0.9rem", color: T.text }}>{row.name}</Typography>
                                        <Typography sx={{ fontFamily: fontMono, fontSize: "0.75rem", color: T.textSub }}>{row.id}</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Box sx={{ display: "inline-block", px: 1, py: 0.3, borderRadius: "4px", border: `1px solid ${T.border}`, fontFamily: fontBody, fontSize: "0.75rem", fontWeight: 600, color: T.textSub }}>{row.category}</Box>
                                    </TableCell>
                                    <TableCell>
                                        <Box display="flex" alignItems="center" gap={1}><Business sx={{ fontSize: 16, color: T.textMute }} /><Typography sx={{ fontFamily: fontBody, fontSize: "0.8rem", color: T.textSub }}>{row.supplier}</Typography></Box>
                                    </TableCell>
                                    <TableCell>
                                        <Typography sx={{ fontFamily: fontMono, fontSize: "0.85rem", color: T.text, fontWeight: 700 }}>{row.quantity}</Typography>
                                        <Typography sx={{ fontFamily: fontBody, fontSize: "0.7rem", color: T.textSub }}>Reorder: {row.reorderLevel}</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography sx={{ fontFamily: fontMono, fontWeight: 700, fontSize: "0.9rem", color: T.text }}>₹{(row.quantity * row.unitPrice).toLocaleString()}</Typography>
                                        <Typography sx={{ fontFamily: fontBody, fontSize: "0.7rem", color: T.textSub }}>₹{row.unitPrice} each</Typography>
                                    </TableCell>
                                    <TableCell><StatusPill status={getStatus(row.quantity, row.reorderLevel)} /></TableCell>
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
                <DialogTitle sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1.2rem", pb: 1 }}>{modal.mode === "create" ? "Add Inventory Item" : "Edit Inventory Item"}</DialogTitle>
                <DialogContent sx={{ pb: 1, mt: 1 }}>
                    <Box display="flex" gap={2}>
                        <Box flex={1}><DInput label="Item Name" placeholder="e.g. A4 Printer Paper" value={modal.data.name || ""} onChange={(e) => setModal({ ...modal, data: { ...modal.data, name: e.target.value } })} /></Box>
                        <Box flex={1}><DInput label="Category" options={["Stationery", "Cleaning", "Electronics", "Medical", "Other"]} value={modal.data.category || "Stationery"} onChange={(e) => setModal({ ...modal, data: { ...modal.data, category: e.target.value } })} /></Box>
                    </Box>
                    <DInput label="Supplier" placeholder="e.g. Office Supplies Co." value={modal.data.supplier || ""} onChange={(e) => setModal({ ...modal, data: { ...modal.data, supplier: e.target.value } })} />
                    <Box display="flex" gap={2}>
                        <Box flex={1}><DInput label="Current Quantity" type="number" value={modal.data.quantity || 0} onChange={(e) => setModal({ ...modal, data: { ...modal.data, quantity: e.target.value } })} /></Box>
                        <Box flex={1}><DInput label="Reorder Level" type="number" value={modal.data.reorderLevel || 0} onChange={(e) => setModal({ ...modal, data: { ...modal.data, reorderLevel: e.target.value } })} /></Box>
                    </Box>
                    <Box display="flex" gap={2}>
                        <Box flex={1}><DInput label="Unit Price (₹)" type="number" value={modal.data.unitPrice || 0} onChange={(e) => setModal({ ...modal, data: { ...modal.data, unitPrice: e.target.value } })} /></Box>
                        <Box flex={1}><DInput label="Last Restocked" type="date" value={modal.data.lastRestocked || ""} onChange={(e) => setModal({ ...modal, data: { ...modal.data, lastRestocked: e.target.value } })} /></Box>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 3 }}>
                    <Button onClick={() => setModal({ ...modal, open: false })} sx={{ fontFamily: fontBody, fontWeight: 600, color: T.textSub, textTransform: "none" }}>Cancel</Button>
                    <Button onClick={handleSave} variant="contained" sx={{ fontFamily: fontBody, fontWeight: 600, bgcolor: T.accent, textTransform: "none", borderRadius: "8px", boxShadow: "none" }}>{modal.mode === "create" ? "Add Item" : "Save Changes"}</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
