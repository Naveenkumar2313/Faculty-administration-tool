import React, { useState } from "react";
import {
    Box, Card, Grid, Typography, Button, TextField, Table, TableBody, TableCell, TableHead, TableRow,
    InputAdornment, IconButton, Chip, Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, Alert, Tabs, Tab
} from "@mui/material";
import {
    Search, AccountBalanceWallet, AddCard, Edit, Close, Male, Female, CreditCard
} from "@mui/icons-material";

/* ── Design Tokens ── */
const T = {
    bg: "#F5F7FA", surface: "#FFFFFF", border: "#E4E8EF", text: "#111827", textSub: "#4B5563", textMute: "#9CA3AF",
    accent: "#6366F1", accentLight: "#EEF2FF", success: "#10B981", successLight: "#ECFDF5",
    warning: "#F59E0B", warningLight: "#FFFBEB", danger: "#EF4444", dangerLight: "#FEF2F2",
    info: "#3B82F6", infoLight: "#EFF6FF", purple: "#8B5CF6", purpleLight: "#F5F3FF",
    pink: "#EC4899", pinkLight: "#FDF2F8"
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

const MOCK_PLANS = [
    { id: "PL-01", name: "Standard Basic", price: "₹4,500/mo", desc: "4 meals a day. Standard menu.", color: T.info },
    { id: "PL-02", name: "Premium Protein", price: "₹6,000/mo", desc: "Standard + Daily Eggs, Chicken/Paneer extras.", color: T.purple },
    { id: "PL-03", name: "Diet/Jain Menu", price: "₹4,800/mo", desc: "No Onion, No Garlic, Low Oil.", color: T.success }
];

const MOCK_SUBSCRIPTIONS = [
    { id: "STU-2101", name: "Rahul Sharma", type: "Boys", plan: "Standard Basic", status: "Active", expiry: "2024-05-15" },
    { id: "STU-2102", name: "Priya Patel", type: "Girls", plan: "Diet/Jain Menu", status: "Active", expiry: "2024-05-10" },
    { id: "STU-2105", name: "Vikram Kumar", type: "Boys", plan: "Premium Protein", status: "Expiring Soon", expiry: "2024-04-18" },
    { id: "STU-2108", name: "Neha Singh", type: "Girls", plan: "Standard Basic", status: "Expired", expiry: "2024-04-10" }
];

export default function MealPlans() {
    const [searchTerm, setSearchTerm] = useState("");
    const [hostelType, setHostelType] = useState("All");
    const [snack, setSnack] = useState({ open: false, msg: "" });

    const filtered = MOCK_SUBSCRIPTIONS.filter(r =>
        (hostelType === "All" || r.type === hostelType) &&
        (r.name.toLowerCase().includes(searchTerm.toLowerCase()) || r.id.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <Box sx={{ p: 3, background: T.bg, minHeight: "100vh", fontFamily: fontBody }}>
            <Fonts />
            <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3} className="fade-up">
                <Box>
                    <Typography sx={{ fontFamily: fontBody, fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: T.textMute, mb: 0.3 }}>Mess Management</Typography>
                    <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1.5rem", color: T.text, lineHeight: 1.1 }}>Meal Subscription Plans</Typography>
                    <Typography sx={{ fontFamily: fontBody, fontSize: "0.82rem", color: T.textSub, mt: 0.4 }}>Set and manage meal subscription tiers for residents.</Typography>
                </Box>
                <Button variant="contained" startIcon={<AddCard sx={{ fontSize: 16 }} />} sx={{ fontFamily: fontBody, fontWeight: 700, fontSize: "0.8rem", textTransform: "none", borderRadius: "8px", bgcolor: T.accent, boxShadow: "none" }}>Create New Plan</Button>
            </Box>

            <Grid container spacing={3} mb={3}>
                {MOCK_PLANS.map(plan => (
                    <Grid item xs={12} md={4} key={plan.id}>
                        <Card className="fade-up" sx={{ p: 3, borderRadius: "14px", border: `2px solid ${plan.color}20`, background: T.surface, boxShadow: "0 4px 12px rgba(0,0,0,0.02)", position: "relative", overflow: "hidden" }}>
                            <Box sx={{ position: "absolute", top: 0, right: 0, width: 60, height: 60, bgcolor: `${plan.color}10`, borderRadius: "0 0 0 100%" }} />
                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1.1rem", color: plan.color }}>{plan.name}</Typography>
                                <IconButton size="small"><Edit sx={{ fontSize: 16, color: T.textMute }} /></IconButton>
                            </Box>
                            <Typography sx={{ fontFamily: fontMono, fontWeight: 700, fontSize: "1.6rem", color: T.text, mb: 1 }}>{plan.price}</Typography>
                            <Typography sx={{ fontFamily: fontBody, fontSize: "0.85rem", color: T.textSub, minHeight: 40 }}>{plan.desc}</Typography>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Card className="fade-up" sx={{ borderRadius: "14px", border: `1px solid ${T.border}`, boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                <Box sx={{ borderBottom: `1px solid ${T.border}`, bgcolor: "#FAFBFD", px: 2 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2} pt={2}>
                        <Tabs value={hostelType} onChange={(e, v) => setHostelType(v)} sx={{ minHeight: 40, "& .MuiTabs-indicator": { bgcolor: T.text, height: 3, borderRadius: "3px 3px 0 0" }, "& .MuiTab-root": { fontFamily: fontBody, fontWeight: 600, fontSize: "0.85rem", textTransform: "none", color: T.textMute, minHeight: 40, py: 1, "&.Mui-selected": { color: T.text } } }}>
                            <Tab label="All Subscriptions" value="All" />
                            <Tab label="Boys Hostel" value="Boys" />
                            <Tab label="Girls Hostel" value="Girls" />
                        </Tabs>
                        <Box pb={1.5} flex={1} display="flex" justifyContent="flex-end">
                            <TextField size="small" placeholder="Search resident..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} InputProps={{ startAdornment: <InputAdornment position="start"><Search sx={{ fontSize: 16, color: T.textMute }} /></InputAdornment> }} sx={{ width: 260, "& .MuiOutlinedInput-root": { borderRadius: "8px", fontFamily: fontBody, fontSize: "0.8rem", bgcolor: T.surface } }} />
                        </Box>
                    </Box>
                </Box>
                <Table>
                    <TableHead><TableRow sx={{ bgcolor: "#F9FAFB" }}>
                        {["Resident", "Division", "Active Plan", "Expiry Date", "Status", "Actions"].map(h => <TableCell key={h} sx={{ fontFamily: fontBody, fontWeight: 700, fontSize: "0.72rem", color: T.textMute, textTransform: "uppercase", py: 1.5, ...(h === "Actions" ? { textAlign: "right" } : {}) }}>{h}</TableCell>)}
                    </TableRow></TableHead>
                    <TableBody>
                        {filtered.length > 0 ? filtered.map(row => (
                            <TableRow key={row.id} className="row-hover">
                                <TableCell>
                                    <Typography sx={{ fontFamily: fontBody, fontWeight: 700, fontSize: "0.85rem", color: T.text }}>{row.name}</Typography>
                                    <Typography sx={{ fontFamily: fontMono, fontSize: "0.75rem", color: T.textSub }}>{row.id}</Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography sx={{ fontFamily: fontBody, fontSize: "0.7rem", fontWeight: 700, color: row.type === "Girls" ? T.pink : T.info, bgcolor: row.type === "Girls" ? T.pinkLight : T.infoLight, px: 0.8, py: 0.2, borderRadius: "4px", display: "inline-block" }}>{row.type}</Typography>
                                </TableCell>
                                <TableCell sx={{ fontFamily: fontBody, fontWeight: 600, fontSize: "0.85rem", color: T.text }}>{row.plan}</TableCell>
                                <TableCell sx={{ fontFamily: fontMono, fontSize: "0.8rem", color: T.textSub }}>{new Date(row.expiry).toLocaleDateString()}</TableCell>
                                <TableCell>
                                    <Chip label={row.status} size="small" sx={{ fontFamily: fontBody, fontWeight: 700, fontSize: "0.7rem", bgcolor: row.status === "Active" ? T.successLight : (row.status === "Expired" ? T.dangerLight : T.warningLight), color: row.status === "Active" ? T.success : (row.status === "Expired" ? T.danger : T.warning), height: 24, borderRadius: "6px" }} />
                                </TableCell>
                                <TableCell sx={{ textAlign: "right", py: 1 }}>
                                    <Button size="small" variant="outlined" sx={{ fontFamily: fontBody, fontWeight: 700, fontSize: "0.7rem", textTransform: "none", borderRadius: "6px", borderColor: T.border, color: T.textSub }}>Renew / Update</Button>
                                </TableCell>
                            </TableRow>
                        )) : (
                            <TableRow><TableCell colSpan={6} sx={{ textAlign: "center", py: 4, color: T.textMute, fontFamily: fontBody }}>No subscriptions found.</TableCell></TableRow>
                        )}
                    </TableBody>
                </Table>
            </Card>
        </Box>
    );
}
