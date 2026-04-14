import React, { useState } from "react";
import {
    Box, Card, Grid, Typography, TextField, Table, TableBody, TableCell, TableHead, TableRow,
    InputAdornment, Chip, Button, IconButton, Snackbar, Alert
} from "@mui/material";
import {
    Search, Summarize, FileDownload, Visibility, Send
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

const MOCK_RECEIPTS = [
    { id: "REC-2404-0125", date: "2024-04-10", studentId: "STU-2101", studentName: "Rahul Sharma", amount: 45000, method: "Bank Transfer", term: "Spring 2024", status: "Generated" },
    { id: "REC-2404-0126", date: "2024-04-11", studentId: "STU-2102", studentName: "Priya Patel", amount: 20000, method: "Credit Card", term: "Spring 2024", status: "Emailed" },
    { id: "REC-2404-0127", date: "2024-04-14", studentId: "STU-2108", studentName: "Neha Singh", amount: 45000, method: "UPI", term: "Spring 2024", status: "Generated" },
];

const StatCard = ({ label, value, sub, color, icon: Icon, bgLight }) => (
    <Card className="fade-up" sx={{ p: 2.5, borderRadius: "14px", border: `1px solid ${T.border}`, background: T.surface, boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
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

const formatCurrency = (val) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

export default function FeeReceipts() {
    const [searchTerm, setSearchTerm] = useState("");
    const [snack, setSnack] = useState({ open: false, msg: "" });

    const filtered = MOCK_RECEIPTS.filter(r => r.studentName.toLowerCase().includes(searchTerm.toLowerCase()) || r.id.toLowerCase().includes(searchTerm.toLowerCase()));

    const handleAction = (type) => {
        setSnack({ open: true, msg: type === 'download' ? "Receipt downloaded." : "Receipt emailed to student successfully." });
    };

    return (
        <Box sx={{ p: 3, background: T.bg, minHeight: "100vh", fontFamily: fontBody }}>
            <Fonts />
            <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3} className="fade-up">
                <Box>
                    <Typography sx={{ fontFamily: fontBody, fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: T.textMute, mb: 0.3 }}>Finance & Reports</Typography>
                    <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1.5rem", color: T.text, lineHeight: 1.1 }}>Fee Receipts Generator</Typography>
                    <Typography sx={{ fontFamily: fontBody, fontSize: "0.82rem", color: T.textSub, mt: 0.4 }}>Archive, generate and dispatch official payment receipts.</Typography>
                </Box>
                <Button variant="contained" startIcon={<Summarize sx={{ fontSize: 16 }} />} sx={{ fontFamily: fontBody, fontWeight: 700, fontSize: "0.8rem", textTransform: "none", borderRadius: "8px", bgcolor: T.accent, boxShadow: "none" }}>Generate Bulk Receipts</Button>
            </Box>

            <Grid container spacing={3} mb={3}>
                <Grid item xs={12} sm={4}><StatCard label="Total Receipts (Month)" value={MOCK_RECEIPTS.length} color={T.accent} bgLight={T.accentLight} icon={Summarize} /></Grid>
                <Grid item xs={12} sm={4}><StatCard label="Total Processed Sum" value={formatCurrency(MOCK_RECEIPTS.reduce((acc, c) => acc + c.amount, 0))} color={T.success} bgLight={T.successLight} icon={Summarize} /></Grid>
            </Grid>

            <Card className="fade-up" sx={{ borderRadius: "14px", border: `1px solid ${T.border}`, boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                <Box sx={{ p: 2.5, borderBottom: `1px solid ${T.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1.1rem" }}>Transaction Archive</Typography>
                    <TextField size="small" placeholder="Search by Receipt ID or Name..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} InputProps={{ startAdornment: <InputAdornment position="start"><Search sx={{ fontSize: 16, color: T.textMute }} /></InputAdornment> }} sx={{ width: 300, "& .MuiOutlinedInput-root": { borderRadius: "8px", fontFamily: fontBody, fontSize: "0.8rem", bgcolor: T.bg } }} />
                </Box>
                <Table>
                    <TableHead><TableRow sx={{ bgcolor: "#F9FAFB" }}>
                        {["Receipt Ref", "Resident", "Term", "Amount Paid", "Method", "Dispatch Status", "Actions"].map(h => <TableCell key={h} sx={{ fontFamily: fontBody, fontWeight: 700, fontSize: "0.72rem", color: T.textMute, textTransform: "uppercase", py: 1.5, ...(h === "Actions" ? { textAlign: "right", minWidth: 140 } : {}) }}>{h}</TableCell>)}
                    </TableRow></TableHead>
                    <TableBody>
                        {filtered.length > 0 ? filtered.map(row => (
                            <TableRow key={row.id} className="row-hover">
                                <TableCell>
                                    <Typography sx={{ fontFamily: fontMono, fontWeight: 700, fontSize: "0.85rem", color: T.accent }}>{row.id}</Typography>
                                    <Typography sx={{ fontFamily: fontMono, fontSize: "0.7rem", color: T.textSub }}>{row.date}</Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography sx={{ fontFamily: fontBody, fontWeight: 600, fontSize: "0.82rem", color: T.text }}>{row.studentName}</Typography>
                                    <Typography sx={{ fontFamily: fontMono, fontSize: "0.72rem", color: T.textSub }}>{row.studentId}</Typography>
                                </TableCell>
                                <TableCell sx={{ fontFamily: fontBody, fontSize: "0.82rem", color: T.textSub }}>{row.term}</TableCell>
                                <TableCell sx={{ fontFamily: fontMono, fontSize: "0.85rem", fontWeight: 700, color: T.success }}>{formatCurrency(row.amount)}</TableCell>
                                <TableCell sx={{ fontFamily: fontBody, fontSize: "0.82rem", color: T.textSub }}>{row.method}</TableCell>
                                <TableCell>
                                    <Chip label={row.status} size="small" sx={{ fontFamily: fontBody, fontWeight: 700, fontSize: "0.7rem", bgcolor: row.status === "Emailed" ? T.infoLight : T.bg, color: row.status === "Emailed" ? T.info : T.textSub, height: 24, borderRadius: "6px" }} />
                                </TableCell>
                                <TableCell sx={{ textAlign: "right", py: 1 }}>
                                    <IconButton size="small" onClick={() => handleAction('download')} sx={{ color: T.textSub, mr: 0.5 }} title="Download PDF"><FileDownload sx={{ fontSize: 18 }} /></IconButton>
                                    <IconButton size="small" onClick={() => handleAction('email')} sx={{ color: T.textSub }} title="Email to Resident"><Send sx={{ fontSize: 16 }} /></IconButton>
                                </TableCell>
                            </TableRow>
                        )) : (
                            <TableRow><TableCell colSpan={7} sx={{ textAlign: "center", py: 5, color: T.textMute, fontFamily: fontBody }}>No receipts found.</TableCell></TableRow>
                        )}
                    </TableBody>
                </Table>
            </Card>

            <Snackbar open={snack.open} autoHideDuration={3000} onClose={() => setSnack({ open: false, msg: "" })} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
                <Alert severity="success" sx={{ borderRadius: "10px", fontFamily: fontBody, fontWeight: 600 }}>{snack.msg}</Alert>
            </Snackbar>
        </Box>
    );
}
