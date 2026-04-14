import React, { useState } from "react";
import {
    Box, Card, Grid, Typography, Button, TextField, Table, TableBody, TableCell, TableHead, TableRow,
    InputAdornment, IconButton, Chip, Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, Alert, LinearProgress
} from "@mui/material";
import {
    Search, Inventory, AddShoppingCart, Edit, Add
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

const MOCK_INVENTORY = [
    { id: "INV-01", name: "Basmati Rice", category: "Grains", currentStock: 450, totalReq: 500, unit: "kg" },
    { id: "INV-02", name: "Toor Dal", category: "Pulses", currentStock: 45, totalReq: 150, unit: "kg" },
    { id: "INV-03", name: "Sunflower Oil", category: "Oils", currentStock: 10, totalReq: 200, unit: "L" },
    { id: "INV-04", name: "Potatoes", category: "Vegetables", currentStock: 220, totalReq: 250, unit: "kg" },
    { id: "INV-05", name: "Wheat Flour", category: "Grains", currentStock: 80, totalReq: 300, unit: "kg" },
    { id: "INV-06", name: "Salt", category: "Spices", currentStock: 45, totalReq: 50, unit: "kg" }
];

const StatCard = ({ label, value, sub, color, bgLight, icon: Icon }) => (
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

export default function FoodInventory() {
    const [searchTerm, setSearchTerm] = useState("");
    const [snack, setSnack] = useState({ open: false, msg: "" });

    const getStatus = (current, total) => {
        const ratio = current / total;
        if (ratio > 0.5) return { label: "In Stock", color: "success", hex: T.success, hexLight: T.successLight };
        if (ratio > 0.15) return { label: "Low Stock", color: "warning", hex: T.warning, hexLight: T.warningLight };
        return { label: "Critical", color: "danger", hex: T.danger, hexLight: T.dangerLight };
    };

    const filtered = MOCK_INVENTORY.filter(r => r.name.toLowerCase().includes(searchTerm.toLowerCase()) || r.category.toLowerCase().includes(searchTerm.toLowerCase()));

    const criticalCount = MOCK_INVENTORY.filter(i => (i.currentStock / i.totalReq) <= 0.15).length;
    const lowCount = MOCK_INVENTORY.filter(i => { const r = i.currentStock / i.totalReq; return r > 0.15 && r <= 0.5; }).length;

    const handleReorder = () => setSnack({ open: true, msg: "Reorder request sent to procurement." });

    return (
        <Box sx={{ p: 3, background: T.bg, minHeight: "100vh", fontFamily: fontBody }}>
            <Fonts />
            <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3} className="fade-up">
                <Box>
                    <Typography sx={{ fontFamily: fontBody, fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: T.textMute, mb: 0.3 }}>Mess Management</Typography>
                    <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1.5rem", color: T.text, lineHeight: 1.1 }}>Food Inventory</Typography>
                    <Typography sx={{ fontFamily: fontBody, fontSize: "0.82rem", color: T.textSub, mt: 0.4 }}>Track ingredient stock levels and generate reorder sheets.</Typography>
                </Box>
                <Button variant="contained" startIcon={<Add sx={{ fontSize: 16 }} />} sx={{ fontFamily: fontBody, fontWeight: 700, fontSize: "0.8rem", textTransform: "none", borderRadius: "8px", bgcolor: T.accent, boxShadow: "none" }}>Add Item</Button>
            </Box>

            <Grid container spacing={3} mb={3}>
                <Grid item xs={12} sm={4}><StatCard label="Total Items Tracked" value={MOCK_INVENTORY.length} color={T.accent} bgLight={T.accentLight} icon={Inventory} /></Grid>
                <Grid item xs={12} sm={4}><StatCard label="Critical Stock Items" value={criticalCount} color={T.danger} bgLight={T.dangerLight} icon={AddShoppingCart} sub="Requires immediate reorder" /></Grid>
                <Grid item xs={12} sm={4}><StatCard label="Low Stock Items" value={lowCount} color={T.warning} bgLight={T.warningLight} icon={Inventory} sub="Running below 50% capacity" /></Grid>
            </Grid>

            <Card className="fade-up" sx={{ borderRadius: "14px", border: `1px solid ${T.border}`, boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                <Box sx={{ p: 2.5, borderBottom: `1px solid ${T.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1.1rem" }}>Current Stock</Typography>
                    <TextField size="small" placeholder="Search ingredients..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} InputProps={{ startAdornment: <InputAdornment position="start"><Search sx={{ fontSize: 16, color: T.textMute }} /></InputAdornment> }} sx={{ width: 260, "& .MuiOutlinedInput-root": { borderRadius: "8px", fontFamily: fontBody, fontSize: "0.8rem", bgcolor: T.bg } }} />
                </Box>
                <Table>
                    <TableHead><TableRow sx={{ bgcolor: "#F9FAFB" }}>
                        {["Item Details", "Category", "Stock Capacity", "Status", "Actions"].map(h => <TableCell key={h} sx={{ fontFamily: fontBody, fontWeight: 700, fontSize: "0.72rem", color: T.textMute, textTransform: "uppercase", py: 1.5, ...(h === "Actions" ? { textAlign: "right" } : {}) }}>{h}</TableCell>)}
                    </TableRow></TableHead>
                    <TableBody>
                        {filtered.length > 0 ? filtered.map(row => {
                            const status = getStatus(row.currentStock, row.totalReq);
                            return (
                                <TableRow key={row.id} className="row-hover">
                                    <TableCell>
                                        <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "0.9rem", color: T.text }}>{row.name}</Typography>
                                        <Typography sx={{ fontFamily: fontMono, fontSize: "0.75rem", color: T.textSub }}>{row.id}</Typography>
                                    </TableCell>
                                    <TableCell sx={{ fontFamily: fontBody, fontSize: "0.82rem", color: T.textSub }}>{row.category}</TableCell>
                                    <TableCell sx={{ minWidth: 200 }}>
                                        <Box display="flex" justifyContent="space-between" mb={0.5}>
                                            <Typography sx={{ fontFamily: fontMono, fontSize: "0.8rem", fontWeight: 700, color: T.text }}>{row.currentStock} {row.unit}</Typography>
                                            <Typography sx={{ fontFamily: fontMono, fontSize: "0.75rem", color: T.textMute }}>/ {row.totalReq} {row.unit}</Typography>
                                        </Box>
                                        <LinearProgress variant="determinate" value={(row.currentStock / row.totalReq) * 100} sx={{ height: 6, borderRadius: 3, bgcolor: T.bg, "& .MuiLinearProgress-bar": { bgcolor: status.hex } }} />
                                    </TableCell>
                                    <TableCell>
                                        <Chip label={status.label} size="small" sx={{ fontFamily: fontBody, fontWeight: 700, fontSize: "0.7rem", bgcolor: status.hexLight, color: status.hex, height: 24, borderRadius: "6px" }} />
                                    </TableCell>
                                    <TableCell sx={{ textAlign: "right", py: 1 }}>
                                        <Button size="small" variant="outlined" onClick={handleReorder} sx={{ fontFamily: fontBody, fontWeight: 700, fontSize: "0.7rem", textTransform: "none", borderRadius: "6px", borderColor: T.border, color: T.textSub, mr: 1 }}>Reorder</Button>
                                    </TableCell>
                                </TableRow>
                            );
                        }) : (
                            <TableRow><TableCell colSpan={5} sx={{ textAlign: "center", py: 5, color: T.textMute, fontFamily: fontBody }}>No ingredients found.</TableCell></TableRow>
                        )}
                    </TableBody>
                </Table>
            </Card>

            <Snackbar open={snack.open} autoHideDuration={3000} onClose={() => setSnack({ open: false, msg: "" })} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
                <Alert severity="info" sx={{ borderRadius: "10px", fontFamily: fontBody, fontWeight: 600 }}>{snack.msg}</Alert>
            </Snackbar>
        </Box>
    );
}
