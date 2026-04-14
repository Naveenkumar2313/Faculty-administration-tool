import React, { useState } from "react";
import {
    Box, Card, Grid, Typography, Button, TextField, Table, TableBody, TableCell, TableHead, TableRow,
    InputAdornment, IconButton, Chip, Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, Alert, MenuItem
} from "@mui/material";
import {
    Search, Build, Send, ContentPasteGo, ElectricalServices, Plumbing, Construction
} from "@mui/icons-material";

/* ── Design Tokens ── */
const T = {
    bg: "#F5F7FA", surface: "#FFFFFF", border: "#E4E8EF", text: "#111827", textSub: "#4B5563", textMute: "#9CA3AF",
    accent: "#6366F1", accentLight: "#EEF2FF", success: "#10B981", successLight: "#ECFDF5",
    warning: "#F59E0B", warningLight: "#FFFBEB", danger: "#EF4444", dangerLight: "#FEF2F2",
    info: "#3B82F6", infoLight: "#EFF6FF", purple: "#8B5CF6", purpleLight: "#F5F3FF"
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

const MOCK_COMPLAINTS = [
    { id: "CMP-004", student: "Rahul Sharma", block: "Boys A, Rm 101", category: "Electrical", desc: "Ceiling fan regulator broken.", date: "2024-04-14", priority: "Low" },
    { id: "CMP-008", student: "Priya Patel", block: "Girls B, Rm 205", category: "Plumbing", desc: "Bathroom sink pipe leaking heavily.", date: "2024-04-13", priority: "High" },
    { id: "CMP-012", student: "Vikram Kumar", block: "Boys C, Rm 302", category: "Carpentry", desc: "Wardrobe door hinge loose.", date: "2024-04-12", priority: "Medium" }
];

const StatCard = ({ label, value, sub, color, icon: Icon, bgLight }) => (
    <Card className="fade-up" sx={{ p: 2.5, borderRadius: "14px", border: `1px solid ${T.border}`, background: T.surface, boxShadow: "0 1px 4px rgba(0,0,0,0.04)", height: "100%", display: "flex", flexDirection: "column" }}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
            <Box>
                <Typography sx={{ fontFamily: fontBody, fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: T.textMute, mb: 0.5 }}>{label}</Typography>
                <Typography sx={{ fontFamily: fontMono, fontWeight: 700, fontSize: "1.8rem", color: color || T.text, lineHeight: 1.1 }}>{value}</Typography>
                {sub && <Typography sx={{ fontFamily: fontBody, fontSize: "0.72rem", color: T.textMute, mt: 0.4 }}>{sub}</Typography>}
            </Box>
            {Icon && <Box sx={{ p: 1.2, borderRadius: "10px", bgcolor: bgLight || `${color}15`, color: color }}><Icon sx={{ fontSize: 22 }} /></Box>}
        </Box>
    </Card>
);

const getCategoryIcon = (cat) => {
    switch (cat) {
        case "Electrical": return <ElectricalServices sx={{ fontSize: 16, mr: 0.5, color: T.warning }} />;
        case "Plumbing": return <Plumbing sx={{ fontSize: 16, mr: 0.5, color: T.info }} />;
        case "Carpentry": return <Construction sx={{ fontSize: 16, mr: 0.5, color: T.textSub }} />;
        default: return <Build sx={{ fontSize: 16, mr: 0.5, color: T.textMute }} />;
    }
};

const PriorityChip = ({ level }) => {
    const maps = {
        "High": { bg: T.dangerLight, color: T.danger },
        "Medium": { bg: T.warningLight, color: T.warning },
        "Low": { bg: T.bg, color: T.textSub }
    };
    const s = maps[level] || maps["Low"];
    return <Chip label={level} size="small" sx={{ fontFamily: fontBody, fontWeight: 700, fontSize: "0.7rem", bgcolor: s.bg, color: s.color, height: 22, borderRadius: "4px", border: s.color !== T.textSub ? `1px solid ${s.color}40` : 'none' }} />;
};

export default function EscalateToMaintenance() {
    const [searchTerm, setSearchTerm] = useState("");
    const [complaints, setComplaints] = useState(MOCK_COMPLAINTS);
    const [modal, setModal] = useState({ open: false, data: null, department: "Campus Maintenance", priority: "Medium", notes: "" });
    const [snack, setSnack] = useState({ open: false, msg: "" });

    const filtered = complaints.filter(c => c.student.toLowerCase().includes(searchTerm.toLowerCase()) || c.id.toLowerCase().includes(searchTerm.toLowerCase()));

    const handleEscalate = () => {
        setComplaints(complaints.filter(c => c.id !== modal.data.id));
        setSnack({ open: true, msg: `Job ${modal.data.id} escalated to ${modal.department} successfully.` });
        setModal({ open: false, data: null, department: "Campus Maintenance", priority: "Medium", notes: "" });
    };

    return (
        <Box sx={{ p: 3, background: T.bg, minHeight: "100vh", fontFamily: fontBody }}>
            <Fonts />
            <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3} className="fade-up">
                <Box>
                    <Typography sx={{ fontFamily: fontBody, fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: T.textMute, mb: 0.3 }}>Facilities & Maintenance</Typography>
                    <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1.5rem", color: T.text, lineHeight: 1.1 }}>Escalate to Maintenance</Typography>
                    <Typography sx={{ fontFamily: fontBody, fontSize: "0.82rem", color: T.textSub, mt: 0.4 }}>Forward complex, unresolved complaints to internal campus maintenance teams.</Typography>
                </Box>
            </Box>

            <Grid container spacing={3} mb={3}>
                <Grid item xs={12} sm={4}><StatCard label="Pending Escalation" value={complaints.length} color={T.warning} bgLight={T.warningLight} icon={ContentPasteGo} /></Grid>
                <Grid item xs={12} sm={4}><StatCard label="High Priority" value={complaints.filter(c => c.priority === "High").length} color={T.danger} bgLight={T.dangerLight} icon={Build} /></Grid>
                <Grid item xs={12} sm={4}><StatCard label="Electrical Issues" value={complaints.filter(c => c.category === "Electrical").length} color={T.accent} bgLight={T.accentLight} icon={ElectricalServices} /></Grid>
            </Grid>

            <Card className="fade-up" sx={{ borderRadius: "14px", border: `1px solid ${T.border}`, boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                <Box sx={{ p: 2.5, borderBottom: `1px solid ${T.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1.05rem" }}>Complaints Requiring External Help</Typography>
                    <TextField size="small" placeholder="Search unhandled issues..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} InputProps={{ startAdornment: <InputAdornment position="start"><Search sx={{ fontSize: 16, color: T.textMute }} /></InputAdornment> }} sx={{ width: 260, "& .MuiOutlinedInput-root": { borderRadius: "8px", fontFamily: fontBody, fontSize: "0.8rem", bgcolor: T.surface } }} />
                </Box>
                <Table>
                    <TableHead><TableRow sx={{ bgcolor: "#F9FAFB" }}>
                        {["Issue ID", "Location & User", "Category", "Description", "Priority", "Actions"].map(h => <TableCell key={h} sx={{ fontFamily: fontBody, fontWeight: 700, fontSize: "0.72rem", color: T.textMute, textTransform: "uppercase", py: 1.5, ...(h === "Actions" ? { textAlign: "right" } : {}) }}>{h}</TableCell>)}
                    </TableRow></TableHead>
                    <TableBody>
                        {filtered.length > 0 ? filtered.map(row => (
                            <TableRow key={row.id} className="row-hover">
                                <TableCell>
                                    <Typography sx={{ fontFamily: fontMono, fontWeight: 700, fontSize: "0.85rem", color: T.text }}>{row.id}</Typography>
                                    <Typography sx={{ fontFamily: fontMono, fontSize: "0.7rem", color: T.textMute }}>{row.date}</Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography sx={{ fontFamily: fontBody, fontWeight: 700, fontSize: "0.85rem", color: T.text }}>{row.block}</Typography>
                                    <Typography sx={{ fontFamily: fontBody, fontSize: "0.75rem", color: T.textSub }}>{row.student}</Typography>
                                </TableCell>
                                <TableCell>
                                    <Box display="flex" alignItems="center">
                                        {getCategoryIcon(row.category)}
                                        <Typography sx={{ fontFamily: fontBody, fontSize: "0.82rem", color: T.textSub }}>{row.category}</Typography>
                                    </Box>
                                </TableCell>
                                <TableCell sx={{ fontFamily: fontBody, fontSize: "0.82rem", color: T.text, maxWidth: 350 }}>{row.desc}</TableCell>
                                <TableCell><PriorityChip level={row.priority} /></TableCell>
                                <TableCell sx={{ textAlign: "right", py: 1 }}>
                                    <Button size="small" variant="contained" endIcon={<Send sx={{ fontSize: 14 }} />} onClick={() => setModal({ open: true, data: row, department: row.category === "Electrical" ? "Electrical Dept" : "Campus Maintenance", priority: row.priority, notes: "" })} sx={{ fontFamily: fontBody, fontWeight: 700, fontSize: "0.7rem", textTransform: "none", borderRadius: "8px", bgcolor: T.accent, boxShadow: "none", "&:hover": { bgcolor: "#4f46e5" } }}>Escalate Ticket</Button>
                                </TableCell>
                            </TableRow>
                        )) : (
                            <TableRow><TableCell colSpan={6} sx={{ textAlign: "center", py: 5, color: T.textMute, fontFamily: fontBody }}>No pending escalations found.</TableCell></TableRow>
                        )}
                    </TableBody>
                </Table>
            </Card>

            <Dialog open={modal.open} onClose={() => setModal({ ...modal, open: false })} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: "16px", p: 1 } }}>
                <DialogTitle sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1.2rem", pb: 1 }}>Forward to Work Order</DialogTitle>
                <DialogContent sx={{ pb: 1, mt: 1 }}>
                    <Typography sx={{ fontFamily: fontBody, fontSize: "0.85rem", color: T.textSub, mb: 3 }}>
                        Convert ticket <b>{modal.data?.id}</b> into an official work order for the maintenance crew.
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <Typography sx={{ fontFamily: fontBody, fontSize: "0.72rem", fontWeight: 700, color: T.textMute, textTransform: "uppercase", mb: 0.5 }}>Assigned Group</Typography>
                            <TextField select size="small" fullWidth value={modal.department} onChange={e => setModal({ ...modal, department: e.target.value })} sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px", fontFamily: fontBody, fontSize: "0.85rem", bgcolor: T.bg } }}>
                                {["Campus Maintenance", "Electrical Dept", "Plumbing Dept", "External Contractor"].map(d => <MenuItem key={d} value={d} sx={{ fontFamily: fontBody, fontSize: "0.85rem" }}>{d}</MenuItem>)}
                            </TextField>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography sx={{ fontFamily: fontBody, fontSize: "0.72rem", fontWeight: 700, color: T.textMute, textTransform: "uppercase", mb: 0.5 }}>Priority Escalation</Typography>
                            <TextField select size="small" fullWidth value={modal.priority} onChange={e => setModal({ ...modal, priority: e.target.value })} sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px", fontFamily: fontBody, fontSize: "0.85rem", bgcolor: T.bg } }}>
                                {["Low", "Medium", "High", "Urgent / Emergency"].map(d => <MenuItem key={d} value={d} sx={{ fontFamily: fontBody, fontSize: "0.85rem" }}>{d}</MenuItem>)}
                            </TextField>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography sx={{ fontFamily: fontBody, fontSize: "0.72rem", fontWeight: 700, color: T.textMute, textTransform: "uppercase", mb: 0.5 }}>Warden Notes for Technicians</Typography>
                            <TextField multiline rows={3} fullWidth placeholder="Provide any access instructions or extra details..." value={modal.notes} onChange={e => setModal({ ...modal, notes: e.target.value })} sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px", fontFamily: fontBody, fontSize: "0.85rem", bgcolor: T.bg } }} />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={() => setModal({ ...modal, open: false })} sx={{ fontFamily: fontBody, fontWeight: 600, color: T.textSub, textTransform: "none" }}>Cancel</Button>
                    <Button onClick={handleEscalate} variant="contained" endIcon={<Send sx={{ fontSize: 16 }} />} sx={{ fontFamily: fontBody, fontWeight: 600, bgcolor: T.accent, textTransform: "none", borderRadius: "8px", boxShadow: "none" }}>Send Work Order</Button>
                </DialogActions>
            </Dialog>

            <Snackbar open={snack.open} autoHideDuration={3000} onClose={() => setSnack({ open: false, msg: "" })} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
                <Alert severity="success" sx={{ borderRadius: "10px", fontFamily: fontBody, fontWeight: 600 }}>{snack.msg}</Alert>
            </Snackbar>
        </Box>
    );
}
