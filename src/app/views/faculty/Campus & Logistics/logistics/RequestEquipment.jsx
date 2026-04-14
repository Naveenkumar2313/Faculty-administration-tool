import React, { useState } from 'react';
import {
    Box, Card, Grid, Typography, Button, TextField, MenuItem,
    Table, TableBody, TableCell, TableHead, TableRow,
    Dialog, DialogTitle, DialogContent, DialogActions,
    Snackbar, Alert as MuiAlert, IconButton
} from "@mui/material";
import {
    Add, Close, Send, Inventory, Assessment, Warning
} from '@mui/icons-material';

/* ── Design Tokens ── */
const T = {
    bg: "#F5F7FA",
    surface: "#FFFFFF",
    border: "#E4E8EF",
    accent: "#6366F1",
    accentLight: "#EEF2FF",
    success: "#10B981",
    successLight: "#ECFDF5",
    warning: "#F59E0B",
    warningLight: "#FFFBEB",
    danger: "#EF4444",
    dangerLight: "#FEF2F2",
    text: "#111827",
    textSub: "#4B5563",
    textMute: "#9CA3AF",
};

const fHead = "Sora, Roboto, Helvetica, Arial, sans-serif";
const fBody = "Nunito, Roboto, Helvetica, Arial, sans-serif";
const fMono = "JetBrains Mono, monospace";

const Fonts = () => (
    <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Sora:wght@600;700&family=Nunito:wght@400;500;600;700&family=JetBrains+Mono:wght@500;600&display=swap');
    * { box-sizing:border-box; }
    @keyframes fadeUp { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:none} }
    .fu { animation: fadeUp 0.3s ease both; }
    .row-h:hover { background:#F9FAFB !important; transition:background 0.15s; }
  `}</style>
);

const MOCK_REQUESTS = [
    { id: "REQ-001", date: "2026-03-12", type: "New Equipment", item: "Dell Ultrasharp Monitor", category: "Computers", qty: 2, urgency: "Medium", status: "Pending" },
    { id: "REQ-002", date: "2026-02-28", type: "Replacement", item: "Wireless Mouse (Logitech)", category: "Accessories", qty: 1, urgency: "Low", status: "Approved" },
    { id: "REQ-003", date: "2026-01-15", type: "Upgrade", item: "RAM 16GB Module", category: "Computers", qty: 1, urgency: "High", status: "Rejected" },
];

const SCard = ({ children, sx = {}, ...p }) => (
    <Card sx={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: "14px", boxShadow: "0 1px 4px rgba(0,0,0,0.04)", ...sx }} {...p}>{children}</Card>
);

const SLabel = ({ children, sx = {} }) => (
    <Typography sx={{ fontFamily: fBody, fontSize: "0.67rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: T.textMute, mb: 0.5, ...sx }}>{children}</Typography>
);

const DInput = (props) => (
    <TextField size="small" fullWidth {...props}
        sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px", fontFamily: fBody, fontSize: "0.82rem", bgcolor: T.surface, "& fieldset": { borderColor: T.border }, "&.Mui-focused fieldset": { borderColor: T.accent } }, "& .MuiInputLabel-root.Mui-focused": { color: T.accent }, ...props.sx }} />
);

const StatusPill = ({ status }) => {
    const map = {
        Pending: { color: T.warning, bg: T.warningLight },
        Approved: { color: T.success, bg: T.successLight },
        Rejected: { color: T.danger, bg: T.dangerLight },
    };
    const s = map[status] || { color: T.textMute, bg: "#F1F5F9" };
    return (
        <Box sx={{ px: 1.2, py: 0.35, borderRadius: "99px", bgcolor: s.bg, width: "fit-content", display: "inline-block" }}>
            <Typography sx={{ fontFamily: fBody, fontSize: "0.71rem", fontWeight: 700, color: s.color }}>{status}</Typography>
        </Box>
    );
};

export default function RequestEquipment() {
    const [requests, setRequests] = useState(MOCK_REQUESTS);
    const [open, setOpen] = useState(false);
    const [snack, setSnack] = useState({ open: false, msg: "" });

    const [formData, setFormData] = useState({
        type: "New Equipment",
        category: "Computers",
        item: "",
        qty: 1,
        urgency: "Medium",
        justification: ""
    });

    const toast = (msg) => setSnack({ open: true, msg });

    const handleSubmit = () => {
        if (!formData.item.trim() || !formData.justification.trim()) {
            toast("Please fill in all required fields.");
            return;
        }

        const newReq = {
            id: `REQ-00${requests.length + 1}`,
            date: new Date().toISOString().split("T")[0],
            type: formData.type,
            item: formData.item,
            category: formData.category,
            qty: formData.qty,
            urgency: formData.urgency,
            status: "Pending"
        };

        setRequests([newReq, ...requests]);
        setOpen(false);
        toast("Equipment request submitted successfully!");
        setFormData({ type: "New Equipment", category: "Computers", item: "", qty: 1, urgency: "Medium", justification: "" });
    };

    return (
        <Box sx={{ p: 3, bgcolor: T.bg, minHeight: "100vh", fontFamily: fBody }}>
            <Fonts />
            <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3} className="fu">
                <Box>
                    <Typography sx={{ fontFamily: fBody, fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: T.textMute, mb: 0.3 }}>Asset Management</Typography>
                    <Typography sx={{ fontFamily: fHead, fontWeight: 700, fontSize: "1.5rem", color: T.text, lineHeight: 1.1 }}>Request Equipment</Typography>
                    <Typography sx={{ fontFamily: fBody, fontSize: "0.82rem", color: T.textSub, mt: 0.4 }}>Submit and track requests for new equipment, upgrades, or replacements.</Typography>
                </Box>
                <Button variant="contained" startIcon={<Add sx={{ fontSize: 16 }} />} onClick={() => setOpen(true)}
                    sx={{ fontFamily: fBody, fontWeight: 700, fontSize: "0.8rem", textTransform: "none", borderRadius: "8px", bgcolor: T.accent, boxShadow: "none", "&:hover": { bgcolor: "#4F46E5", boxShadow: "none" } }}>
                    New Request
                </Button>
            </Box>

            <Grid container spacing={3} mb={3} className="fu">
                <Grid item xs={12} sm={4}>
                    <SCard sx={{ p: 2.5, height: "100%" }}>
                        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                            <Box>
                                <SLabel>Total Requests</SLabel>
                                <Typography sx={{ fontFamily: fMono, fontWeight: 700, fontSize: "1.8rem", color: T.accent, lineHeight: 1.1 }}>{requests.length}</Typography>
                            </Box>
                            <Box sx={{ p: 1.2, borderRadius: "10px", bgcolor: T.accentLight, color: T.accent }}><Assessment sx={{ fontSize: 22 }} /></Box>
                        </Box>
                    </SCard>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <SCard sx={{ p: 2.5, height: "100%" }}>
                        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                            <Box>
                                <SLabel>Pending Approval</SLabel>
                                <Typography sx={{ fontFamily: fMono, fontWeight: 700, fontSize: "1.8rem", color: T.warning, lineHeight: 1.1 }}>
                                    {requests.filter(r => r.status === "Pending").length}
                                </Typography>
                            </Box>
                            <Box sx={{ p: 1.2, borderRadius: "10px", bgcolor: T.warningLight, color: T.warning }}><Warning sx={{ fontSize: 22 }} /></Box>
                        </Box>
                    </SCard>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <SCard sx={{ p: 2.5, height: "100%" }}>
                        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                            <Box>
                                <SLabel>Approved</SLabel>
                                <Typography sx={{ fontFamily: fMono, fontWeight: 700, fontSize: "1.8rem", color: T.success, lineHeight: 1.1 }}>
                                    {requests.filter(r => r.status === "Approved").length}
                                </Typography>
                            </Box>
                            <Box sx={{ p: 1.2, borderRadius: "10px", bgcolor: T.successLight, color: T.success }}><Inventory sx={{ fontSize: 22 }} /></Box>
                        </Box>
                    </SCard>
                </Grid>
            </Grid>

            <SCard className="fu">
                <Box sx={{ p: 2.5, borderBottom: `1px solid ${T.border}` }}>
                    <Typography sx={{ fontFamily: fHead, fontWeight: 700, fontSize: "1.1rem" }}>Request History</Typography>
                </Box>
                <Box sx={{ overflowX: "auto" }}>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ bgcolor: "#F9FAFB" }}>
                                <TableCell sx={{ fontFamily: fBody, fontWeight: 700, fontSize: "0.72rem", color: T.textMute, textTransform: "uppercase", py: 1.5 }}>Request ID</TableCell>
                                <TableCell sx={{ fontFamily: fBody, fontWeight: 700, fontSize: "0.72rem", color: T.textMute, textTransform: "uppercase", py: 1.5 }}>Date</TableCell>
                                <TableCell sx={{ fontFamily: fBody, fontWeight: 700, fontSize: "0.72rem", color: T.textMute, textTransform: "uppercase", py: 1.5 }}>Type & Item</TableCell>
                                <TableCell sx={{ fontFamily: fBody, fontWeight: 700, fontSize: "0.72rem", color: T.textMute, textTransform: "uppercase", py: 1.5 }}>Qty / Urgency</TableCell>
                                <TableCell sx={{ fontFamily: fBody, fontWeight: 700, fontSize: "0.72rem", color: T.textMute, textTransform: "uppercase", py: 1.5 }}>Status</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {requests.map(req => (
                                <TableRow key={req.id} className="row-h">
                                    <TableCell>
                                        <Typography sx={{ fontFamily: fMono, fontSize: "0.8rem", fontWeight: 600, color: T.text }}>{req.id}</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography sx={{ fontFamily: fMono, fontSize: "0.8rem", color: T.textSub }}>{req.date}</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography sx={{ fontFamily: fBody, fontWeight: 700, fontSize: "0.88rem", color: T.text }}>{req.item}</Typography>
                                        <Typography sx={{ fontFamily: fBody, fontSize: "0.75rem", color: T.textMute }}>{req.type} • {req.category}</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography sx={{ fontFamily: fMono, fontSize: "0.8rem", color: T.textSub }}>{req.qty} Unit(s)</Typography>
                                        <Typography sx={{ fontFamily: fBody, fontSize: "0.75rem", color: req.urgency === "High" ? T.danger : req.urgency === "Medium" ? T.warning : T.success }}>
                                            {req.urgency} Priority
                                        </Typography>
                                    </TableCell>
                                    <TableCell><StatusPill status={req.status} /></TableCell>
                                </TableRow>
                            ))}
                            {requests.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                                        <Typography sx={{ fontFamily: fBody, color: T.textMute }}>No equipment requests found.</Typography>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </Box>
            </SCard>

            <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: "16px", border: `1px solid ${T.border}` } }}>
                <DialogTitle sx={{ fontFamily: fHead, fontWeight: 700, fontSize: "1rem", color: T.text, borderBottom: `1px solid ${T.border}`, bgcolor: "#FAFBFD", pb: 2 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Box display="flex" alignItems="center" gap={1.2}>
                            <Box sx={{ width: 4, height: 22, borderRadius: 2, bgcolor: T.accent }} />
                            Request New Equipment / Replacement
                        </Box>
                        <IconButton size="small" onClick={() => setOpen(false)} sx={{ bgcolor: "#F1F5F9", borderRadius: "8px" }}><Close fontSize="small" /></IconButton>
                    </Box>
                </DialogTitle>
                <DialogContent sx={{ px: 3, pt: 3, pb: 2, display: "flex", flexDirection: "column", gap: 2 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <Box>
                                <SLabel>Request Type</SLabel>
                                <DInput select value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })}>
                                    {["New Equipment", "Replacement", "Upgrade"].map(t => <MenuItem key={t} value={t} sx={{ fontFamily: fBody, fontSize: "0.82rem" }}>{t}</MenuItem>)}
                                </DInput>
                            </Box>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Box>
                                <SLabel>Category</SLabel>
                                <DInput select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}>
                                    {["Computers", "AV Equipment", "Networking", "Printers", "Lab Equipment", "Furniture", "Other", "Accessories"].map(c => <MenuItem key={c} value={c} sx={{ fontFamily: fBody, fontSize: "0.82rem" }}>{c}</MenuItem>)}
                                </DInput>
                            </Box>
                        </Grid>
                        <Grid item xs={12}>
                            <Box>
                                <SLabel>Specific Item / Model *</SLabel>
                                <DInput placeholder="e.g. Dell Ultrasharp 27 Monitor" value={formData.item} onChange={e => setFormData({ ...formData, item: e.target.value })} />
                            </Box>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Box>
                                <SLabel>Quantity</SLabel>
                                <DInput type="number" inputProps={{ min: 1 }} value={formData.qty} onChange={e => setFormData({ ...formData, qty: e.target.value })} />
                            </Box>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Box>
                                <SLabel>Urgency Level</SLabel>
                                <DInput select value={formData.urgency} onChange={e => setFormData({ ...formData, urgency: e.target.value })}>
                                    {["Low", "Medium", "High"].map(u => <MenuItem key={u} value={u} sx={{ fontFamily: fBody, fontSize: "0.82rem" }}>{u}</MenuItem>)}
                                </DInput>
                            </Box>
                        </Grid>
                        <Grid item xs={12}>
                            <Box>
                                <SLabel>Justification / Reason *</SLabel>
                                <DInput multiline rows={3} placeholder="Please explain why this equipment is needed..." value={formData.justification} onChange={e => setFormData({ ...formData, justification: e.target.value })} />
                            </Box>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 3, borderTop: `1px solid ${T.border}`, pt: 2, bgcolor: "#FAFBFD", gap: 1 }}>
                    <Button onClick={() => setOpen(false)} variant="outlined" sx={{ fontFamily: fBody, fontWeight: 600, fontSize: "0.8rem", textTransform: "none", borderRadius: "8px", borderColor: T.border, color: T.textSub }}>Cancel</Button>
                    <Button variant="contained" onClick={handleSubmit} startIcon={<Send sx={{ fontSize: 15 }} />} sx={{ fontFamily: fBody, fontWeight: 700, fontSize: "0.8rem", textTransform: "none", borderRadius: "8px", bgcolor: T.accent, boxShadow: "none", "&:hover": { bgcolor: "#4F46E5", boxShadow: "none" } }}>Submit Request</Button>
                </DialogActions>
            </Dialog>
            <Snackbar open={snack.open} autoHideDuration={3000} onClose={() => setSnack({ open: false, msg: "" })} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
                <MuiAlert severity="success" sx={{ borderRadius: "10px", fontFamily: fBody, fontWeight: 600 }} onClose={() => setSnack({ open: false, msg: "" })}>{snack.msg}</MuiAlert>
            </Snackbar>
        </Box>
    );
}
