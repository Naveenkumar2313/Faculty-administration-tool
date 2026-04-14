import React, { useState } from "react";
import {
    Box, Card, Grid, Typography, TextField, Table, TableBody, TableCell, TableHead, TableRow,
    InputAdornment, Chip, Button, Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, Alert, Tabs, Tab
} from "@mui/material";
import {
    Search, AccountBalanceWallet, WarningAmber, MonetizationOn, PointOfSale, CreditCard
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

const MOCK_DUES = [
    { id: "STU-2101", name: "Rahul Sharma", block: "Boys A", term: "Spring 2024", totalAmount: 45000, paidAmount: 45000, dueAmount: 0, status: "Paid" },
    { id: "STU-2102", name: "Priya Patel", block: "Girls B", term: "Spring 2024", totalAmount: 45000, paidAmount: 20000, dueAmount: 25000, status: "Partial" },
    { id: "STU-2105", name: "Vikram Kumar", block: "Boys C", term: "Spring 2024", totalAmount: 45000, paidAmount: 0, dueAmount: 45000, status: "Unpaid" },
    { id: "STU-2108", name: "Neha Singh", block: "Girls A", term: "Spring 2024", totalAmount: 45000, paidAmount: 45000, dueAmount: 0, status: "Paid" }
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

export default function FeeCollection() {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [dues, setDues] = useState(MOCK_DUES);
    const [modal, setModal] = useState({ open: false, data: null, payAmount: "" });
    const [snack, setSnack] = useState({ open: false, msg: "" });

    const filtered = dues.filter(d =>
        (statusFilter === "All" || d.status === statusFilter || (statusFilter === "Dues Pending" && d.dueAmount > 0)) &&
        (d.name.toLowerCase().includes(searchTerm.toLowerCase()) || d.id.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const metrics = {
        totalCollected: dues.reduce((acc, curr) => acc + curr.paidAmount, 0),
        totalDue: dues.reduce((acc, curr) => acc + curr.dueAmount, 0),
        defaulters: dues.filter(d => d.dueAmount > 0).length
    };

    const handleRecordPayment = () => {
        const amt = parseFloat(modal.payAmount) || 0;
        setDues(dues.map(d => {
            if (d.id === modal.data.id) {
                const newPaid = d.paidAmount + amt;
                const newDue = Math.max(d.totalAmount - newPaid, 0);
                const newStatus = newDue === 0 ? "Paid" : "Partial";
                return { ...d, paidAmount: newPaid, dueAmount: newDue, status: newStatus };
            }
            return d;
        }));
        setSnack({ open: true, msg: `Payment of ${formatCurrency(amt)} recorded successfully.` });
        setModal({ open: false, data: null, payAmount: "" });
    };

    return (
        <Box sx={{ p: 3, background: T.bg, minHeight: "100vh", fontFamily: fontBody }}>
            <Fonts />
            <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3} className="fade-up">
                <Box>
                    <Typography sx={{ fontFamily: fontBody, fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: T.textMute, mb: 0.3 }}>Finance & Reports</Typography>
                    <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1.5rem", color: T.text, lineHeight: 1.1 }}>Fee Collection Dashboard</Typography>
                    <Typography sx={{ fontFamily: fontBody, fontSize: "0.82rem", color: T.textSub, mt: 0.4 }}>Track hostel fee payments, outstanding balances, and send reminders.</Typography>
                </Box>
                <Button variant="outlined" startIcon={<WarningAmber sx={{ fontSize: 16 }} />} sx={{ fontFamily: fontBody, fontWeight: 700, fontSize: "0.8rem", textTransform: "none", borderRadius: "8px", borderColor: T.danger, color: T.danger, "&:hover": { bgcolor: T.dangerLight, borderColor: T.danger } }}>Send Mass Reminders</Button>
            </Box>

            <Grid container spacing={3} mb={3}>
                <Grid item xs={12} sm={4}><StatCard label="Total Fees Collected" value={formatCurrency(metrics.totalCollected)} color={T.success} bgLight={T.successLight} icon={AccountBalanceWallet} sub="Current Semester" /></Grid>
                <Grid item xs={12} sm={4}><StatCard label="Total Outstanding Dues" value={formatCurrency(metrics.totalDue)} color={T.warning} bgLight={T.warningLight} icon={MonetizationOn} sub="Current Semester" /></Grid>
                <Grid item xs={12} sm={4}><StatCard label="Pending Accounts" value={metrics.defaulters} color={T.danger} bgLight={T.dangerLight} icon={WarningAmber} sub="Accounts with non-zero dues" /></Grid>
            </Grid>

            <Card className="fade-up" sx={{ borderRadius: "14px", border: `1px solid ${T.border}`, boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                <Box sx={{ borderBottom: `1px solid ${T.border}`, bgcolor: "#FAFBFD", px: 2 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2} pt={2}>
                        <Tabs value={statusFilter} onChange={(e, v) => setStatusFilter(v)} sx={{ minHeight: 40, "& .MuiTabs-indicator": { bgcolor: T.text, height: 3, borderRadius: "3px 3px 0 0" }, "& .MuiTab-root": { fontFamily: fontBody, fontWeight: 600, fontSize: "0.85rem", textTransform: "none", color: T.textMute, minHeight: 40, py: 1, "&.Mui-selected": { color: T.text } } }}>
                            <Tab label="Institution Ledger" value="All" />
                            <Tab label="Dues Pending" value="Dues Pending" />
                            <Tab label="Fully Paid" value="Paid" />
                        </Tabs>
                        <Box pb={1.5} flex={1} display="flex" justifyContent="flex-end">
                            <TextField size="small" placeholder="Search ID or Name..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} InputProps={{ startAdornment: <InputAdornment position="start"><Search sx={{ fontSize: 16, color: T.textMute }} /></InputAdornment> }} sx={{ width: 260, "& .MuiOutlinedInput-root": { borderRadius: "8px", fontFamily: fontBody, fontSize: "0.8rem", bgcolor: T.surface } }} />
                        </Box>
                    </Box>
                </Box>
                <Table>
                    <TableHead><TableRow sx={{ bgcolor: "#F9FAFB" }}>
                        {["Student Profile", "Term & Block", "Total Amount", "Paid Amount", "Due Balance", "Status", "Actions"].map(h => <TableCell key={h} sx={{ fontFamily: fontBody, fontWeight: 700, fontSize: "0.72rem", color: T.textMute, textTransform: "uppercase", py: 1.5, ...(h === "Actions" ? { textAlign: "right", minWidth: 140 } : {}) }}>{h}</TableCell>)}
                    </TableRow></TableHead>
                    <TableBody>
                        {filtered.length > 0 ? filtered.map(row => (
                            <TableRow key={row.id} className="row-hover">
                                <TableCell>
                                    <Typography sx={{ fontFamily: fontBody, fontWeight: 700, fontSize: "0.85rem", color: T.text }}>{row.name}</Typography>
                                    <Typography sx={{ fontFamily: fontMono, fontSize: "0.75rem", color: T.textSub }}>{row.id}</Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography sx={{ fontFamily: fontBody, fontWeight: 600, fontSize: "0.82rem", color: T.text }}>{row.term}</Typography>
                                    <Typography sx={{ fontFamily: fontBody, fontSize: "0.72rem", color: T.textSub }}>{row.block}</Typography>
                                </TableCell>
                                <TableCell sx={{ fontFamily: fontMono, fontSize: "0.85rem", color: T.text }}>{formatCurrency(row.totalAmount)}</TableCell>
                                <TableCell sx={{ fontFamily: fontMono, fontSize: "0.85rem", color: T.success }}>{formatCurrency(row.paidAmount)}</TableCell>
                                <TableCell sx={{ fontFamily: fontMono, fontSize: "0.85rem", fontWeight: 700, color: row.dueAmount > 0 ? T.danger : T.textSub }}>{formatCurrency(row.dueAmount)}</TableCell>
                                <TableCell>
                                    <Chip label={row.status} size="small" sx={{ fontFamily: fontBody, fontWeight: 700, fontSize: "0.7rem", bgcolor: row.status === "Paid" ? T.successLight : (row.status === "Unpaid" ? T.dangerLight : T.warningLight), color: row.status === "Paid" ? T.success : (row.status === "Unpaid" ? T.danger : T.warning), height: 24, borderRadius: "6px" }} />
                                </TableCell>
                                <TableCell sx={{ textAlign: "right", py: 1 }}>
                                    {row.dueAmount > 0 ? (
                                        <Button size="small" variant="contained" endIcon={<PointOfSale sx={{ fontSize: 14 }} />} onClick={() => setModal({ open: true, data: row, payAmount: row.dueAmount })} sx={{ fontFamily: fontBody, fontWeight: 700, fontSize: "0.7rem", textTransform: "none", borderRadius: "8px", bgcolor: T.accent, boxShadow: "none" }}>Receive</Button>
                                    ) : (
                                        <Typography sx={{ fontFamily: fontMono, fontSize: "0.7rem", color: T.textMute, fontStyle: "italic", mr: 2 }}>Settled</Typography>
                                    )}
                                </TableCell>
                            </TableRow>
                        )) : (
                            <TableRow><TableCell colSpan={7} sx={{ textAlign: "center", py: 5, color: T.textMute, fontFamily: fontBody }}>No financial ledger records found.</TableCell></TableRow>
                        )}
                    </TableBody>
                </Table>
            </Card>

            <Dialog open={modal.open} onClose={() => setModal({ ...modal, open: false })} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: "16px", p: 1 } }}>
                <DialogTitle sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1.2rem", pb: 1 }}>Receive Payment</DialogTitle>
                <DialogContent sx={{ pb: 1, mt: 1 }}>
                    <Typography sx={{ fontFamily: fontBody, fontSize: "0.85rem", color: T.textSub, mb: 2 }}>
                        Process manual fee payment for <b>{modal.data?.name}</b> ({modal.data?.id}). Current outstanding due is <b style={{ color: T.danger }}>{formatCurrency(modal.data?.dueAmount)}</b>.
                    </Typography>
                    <Typography sx={{ fontFamily: fontBody, fontSize: "0.72rem", fontWeight: 700, color: T.textMute, textTransform: "uppercase", mb: 0.5 }}>Receiving Amount (INR)</Typography>
                    <TextField type="number" fullWidth value={modal.payAmount} onChange={e => setModal({ ...modal, payAmount: e.target.value })} InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment> }} sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px", fontFamily: fontMono, fontSize: "1rem", bgcolor: T.bg } }} />
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={() => setModal({ ...modal, open: false })} sx={{ fontFamily: fontBody, fontWeight: 600, color: T.textSub, textTransform: "none" }}>Cancel</Button>
                    <Button onClick={handleRecordPayment} variant="contained" endIcon={<CreditCard sx={{ fontSize: 16 }} />} sx={{ fontFamily: fontBody, fontWeight: 600, bgcolor: T.success, textTransform: "none", borderRadius: "8px", boxShadow: "none" }}>Process Receipt</Button>
                </DialogActions>
            </Dialog>

            <Snackbar open={snack.open} autoHideDuration={3000} onClose={() => setSnack({ open: false, msg: "" })} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
                <Alert severity="success" sx={{ borderRadius: "10px", fontFamily: fontBody, fontWeight: 600 }}>{snack.msg}</Alert>
            </Snackbar>
        </Box>
    );
}
