import React, { useState } from "react";
import {
    Box, Card, Grid, Typography, Button, TextField, Table, TableBody, TableCell, TableHead, TableRow,
    InputAdornment, IconButton, Chip, Tabs, Tab, Snackbar, Alert, Dialog, DialogTitle, DialogContent, DialogActions
} from "@mui/material";
import {
    Search, AccessTime, CheckCircle, Cancel, Verified, NightlightRound, Rule, Male, Female, People
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

const MOCK_REQUESTS = [
    { id: "REQ-001", studentId: "STU-2101", name: "Rahul Sharma", block: "Block A", type: "Boys", room: "A-101", date: "2024-04-15", requestedTime: "11:30 PM", reason: "Late night lab session for term project.", status: "Pending" },
    { id: "REQ-002", studentId: "STU-2108", name: "Neha Singh", block: "Girls Hostel A", type: "Girls", room: "A-304", date: "2024-04-15", requestedTime: "12:00 AM", reason: "Returning from outstation technical fest.", status: "Pending" },
    { id: "REQ-003", studentId: "STU-2110", name: "Arjun Reddy", block: "Block B", type: "Boys", room: "B-112", date: "2024-04-14", requestedTime: "11:00 PM", reason: "Family dinner in city.", status: "Approved" },
    { id: "REQ-004", studentId: "STU-2115", name: "Riya Verma", block: "Girls Hostel B", type: "Girls", room: "B-201", date: "2024-04-14", requestedTime: "01:00 AM", reason: "Movie night out.", status: "Rejected" },
    { id: "REQ-005", studentId: "STU-2105", name: "Vikram Kumar", block: "Block C", type: "Boys", room: "C-302", date: "2024-04-16", requestedTime: "11:45 PM", reason: "Train delayed, arriving late.", status: "Pending" }
];

const StatCard = ({ label, value, sub, color, icon: Icon, bgLight }) => (
    <Card className="fade-up" sx={{ p: 2.5, borderRadius: "14px", border: `1px solid ${T.border}`, background: T.surface, boxShadow: "0 1px 4px rgba(0,0,0,0.04)", height: "100%" }}>
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

const StatusChip = ({ status }) => {
    const map = {
        "Approved": { bg: T.successLight, color: T.success },
        "Rejected": { bg: T.dangerLight, color: T.danger },
        "Pending": { bg: T.warningLight, color: T.warning },
    };
    const s = map[status];
    return (
        <Chip label={status} size="small" sx={{ fontFamily: fontBody, fontWeight: 700, fontSize: "0.7rem", bgcolor: s.bg, color: s.color, height: 24, borderRadius: "6px", border: `1px solid ${s.color}30` }} />
    );
};

export default function LateEntryRequests() {
    const [searchTerm, setSearchTerm] = useState("");
    const [activeTab, setActiveTab] = useState("Pending");
    const [hostelType, setHostelType] = useState("All");
    const [requests, setRequests] = useState(MOCK_REQUESTS);
    const [snack, setSnack] = useState({ open: false, msg: "" });
    const [modal, setModal] = useState({ open: false, mode: "", data: null, reason: "" });

    const handleAction = (mode, req) => {
        setModal({ open: true, mode, data: req, reason: "" });
    };

    const confirmAction = () => {
        const newStatus = modal.mode === "approve" ? "Approved" : "Rejected";
        setRequests(requests.map(r => r.id === modal.data.id ? { ...r, status: newStatus, adminNote: modal.reason } : r));
        setSnack({ open: true, msg: `Request ${newStatus.toLowerCase()} successfully.` });
        setModal({ open: false, mode: "", data: null, reason: "" });
    };

    const filtered = requests.filter(r =>
        (hostelType === "All" || r.type === hostelType) &&
        (activeTab === "All" || r.status === activeTab) &&
        (r.name.toLowerCase().includes(searchTerm.toLowerCase()) || r.studentId.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const stats = {
        pending: requests.filter(a => (hostelType === "All" || a.type === hostelType) && a.status === "Pending").length,
        approved: requests.filter(a => (hostelType === "All" || a.type === hostelType) && a.status === "Approved").length,
        rejected: requests.filter(a => (hostelType === "All" || a.type === hostelType) && a.status === "Rejected").length,
    };

    return (
        <Box sx={{ p: 3, background: T.bg, minHeight: "100vh", fontFamily: fontBody }}>
            <Fonts />
            <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3} className="fade-up">
                <Box>
                    <Typography sx={{ fontFamily: fontBody, fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: T.textMute, mb: 0.3 }}>Resident Management</Typography>
                    <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1.5rem", color: T.text, lineHeight: 1.1 }}>Late Entry Requests</Typography>
                    <Typography sx={{ fontFamily: fontBody, fontSize: "0.82rem", color: T.textSub, mt: 0.4 }}>Review and approve requests for curfew relaxation.</Typography>
                </Box>
            </Box>

            <Box sx={{ borderBottom: 1, borderColor: T.border, mb: 3 }} className="fade-up">
                <Tabs value={hostelType} onChange={(e, v) => setHostelType(v)} TabIndicatorProps={{ sx: { bgcolor: hostelType === "Girls" ? T.pink : (hostelType === "Boys" ? T.info : T.accent), height: 3, borderRadius: "3px 3px 0 0" } }} sx={{ "& .MuiTab-root": { fontFamily: fontBody, fontWeight: 600, fontSize: "0.9rem", textTransform: "none", color: T.textSub, minWidth: 140, minHeight: 48 }, "& .Mui-selected": { color: `${hostelType === "Girls" ? T.pink : (hostelType === "Boys" ? T.info : T.accent)} !important` } }}>
                    <Tab label={<Box display="flex" alignItems="center" gap={1}><People fontSize="small" /> All Records</Box>} value="All" />
                    <Tab label={<Box display="flex" alignItems="center" gap={1}><Male fontSize="small" /> Boys Hostel</Box>} value="Boys" />
                    <Tab label={<Box display="flex" alignItems="center" gap={1}><Female fontSize="small" /> Girls Hostel</Box>} value="Girls" />
                </Tabs>
            </Box>

            <Grid container spacing={3} mb={3}>
                <Grid item xs={12} sm={4}><StatCard label="Pending Requests" value={stats.pending} sub="Requires immediate review" color={T.warning} bgLight={T.warningLight} icon={AccessTime} /></Grid>
                <Grid item xs={12} sm={4}><StatCard label="Approved Extensions" value={stats.approved} sub="Authorized late entries" color={T.success} bgLight={T.successLight} icon={CheckCircle} /></Grid>
                <Grid item xs={12} sm={4}><StatCard label="Rejected Requests" value={stats.rejected} sub="Denied curfew relaxations" color={T.danger} bgLight={T.dangerLight} icon={Cancel} /></Grid>
            </Grid>

            <Card className="fade-up" sx={{ borderRadius: "14px", border: `1px solid ${T.border}`, boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                <Box sx={{ borderBottom: `1px solid ${T.border}`, bgcolor: "#FAFBFD", px: 2 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2} pt={2}>
                        <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)} sx={{ minHeight: 40, "& .MuiTabs-indicator": { bgcolor: T.text, height: 3, borderRadius: "3px 3px 0 0" }, "& .MuiTab-root": { fontFamily: fontBody, fontWeight: 600, fontSize: "0.85rem", textTransform: "none", color: T.textMute, minHeight: 40, py: 1, "&.Mui-selected": { color: T.text } } }}>
                            <Tab icon={<AccessTime sx={{ fontSize: 18, mr: 0.5 }} />} iconPosition="start" label="Pending" value="Pending" />
                            <Tab icon={<Verified sx={{ fontSize: 18, mr: 0.5 }} />} iconPosition="start" label="Approved" value="Approved" />
                            <Tab icon={<Rule sx={{ fontSize: 18, mr: 0.5 }} />} iconPosition="start" label="Rejected" value="Rejected" />
                            <Tab label="All Status" value="All" />
                        </Tabs>
                        <Box pb={1.5} display="flex" gap={1.5}>
                            <TextField size="small" placeholder="Search by name or ID..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} InputProps={{ startAdornment: <InputAdornment position="start"><Search sx={{ fontSize: 16, color: T.textMute }} /></InputAdornment> }} sx={{ width: 240, "& .MuiOutlinedInput-root": { borderRadius: "8px", fontFamily: fontBody, fontSize: "0.8rem", bgcolor: T.surface } }} />
                        </Box>
                    </Box>
                </Box>
                <Table>
                    <TableHead><TableRow sx={{ bgcolor: "#F9FAFB" }}>
                        {["Request ID", "Resident Details", "Division", "Extension Date", "Requested Time", "Reason", "Status", "Actions"].map(h => <TableCell key={h} sx={{ fontFamily: fontBody, fontWeight: 700, fontSize: "0.72rem", color: T.textMute, textTransform: "uppercase", py: 1.5, ...(h === "Actions" ? { textAlign: "right" } : {}) }}>{h}</TableCell>)}
                    </TableRow></TableHead>
                    <TableBody>
                        {filtered.length > 0 ? filtered.map(row => (
                            <TableRow key={row.id} className="row-hover">
                                <TableCell sx={{ fontFamily: fontMono, fontSize: "0.75rem", color: T.textSub }}>{row.id}</TableCell>
                                <TableCell>
                                    <Typography sx={{ fontFamily: fontBody, fontWeight: 700, fontSize: "0.85rem", color: T.text }}>{row.name}</Typography>
                                    <Typography sx={{ fontFamily: fontMono, fontSize: "0.75rem", color: T.textSub }}>{row.studentId} • {row.block}</Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography sx={{ fontFamily: fontBody, fontSize: "0.7rem", fontWeight: 700, color: row.type === "Girls" ? T.pink : T.info, bgcolor: row.type === "Girls" ? T.pinkLight : T.infoLight, px: 0.8, py: 0.2, borderRadius: "4px", display: "inline-block" }}>{row.type} Hostel</Typography>
                                </TableCell>
                                <TableCell sx={{ fontFamily: fontBody, fontSize: "0.85rem", color: T.textSub }}>{new Date(row.date).toLocaleDateString()}</TableCell>
                                <TableCell>
                                    <Box display="flex" alignItems="center" gap={0.8}><NightlightRound sx={{ fontSize: 15, color: T.accent }} /><Typography sx={{ fontFamily: fontMono, fontWeight: 700, fontSize: "0.85rem", color: T.accent }}>{row.requestedTime}</Typography></Box>
                                </TableCell>
                                <TableCell sx={{ fontFamily: fontBody, fontSize: "0.82rem", color: T.textSub, maxWidth: 300 }}>{row.reason}</TableCell>
                                <TableCell>
                                    <StatusChip status={row.status} />
                                </TableCell>
                                <TableCell sx={{ textAlign: "right", py: 1 }}>
                                    {row.status === "Pending" ? (
                                        <Box display="flex" justifyContent="flex-end" gap={1}>
                                            <Button size="small" variant="contained" onClick={() => handleAction("approve", row)} sx={{ fontFamily: fontBody, fontWeight: 700, fontSize: "0.7rem", minWidth: 0, px: 1.5, borderRadius: "6px", bgcolor: T.success, boxShadow: "none", "&:hover": { bgcolor: "#0ea5e9" } }}>Approve</Button>
                                            <Button size="small" variant="outlined" onClick={() => handleAction("reject", row)} sx={{ fontFamily: fontBody, fontWeight: 700, fontSize: "0.7rem", minWidth: 0, px: 1.5, borderRadius: "6px", borderColor: T.danger, color: T.danger, "&:hover": { bgcolor: T.dangerLight, borderColor: T.danger } }}>Reject</Button>
                                        </Box>
                                    ) : (
                                        <Typography sx={{ fontFamily: fontMono, fontSize: "0.7rem", color: T.textMute, fontStyle: "italic", mr: 2 }}>Processed</Typography>
                                    )}
                                </TableCell>
                            </TableRow>
                        )) : (
                            <TableRow><TableCell colSpan={8} sx={{ textAlign: "center", py: 5, color: T.textMute, fontFamily: fontBody }}>No requests found for the selected scope.</TableCell></TableRow>
                        )}
                    </TableBody>
                </Table>
            </Card>

            <Dialog open={modal.open} onClose={() => setModal({ ...modal, open: false })} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: "16px", p: 1 } }}>
                <DialogTitle sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1.2rem", pb: 1, color: modal.mode === "approve" ? T.success : T.danger }}>
                    {modal.mode === "approve" ? "Approve Request" : "Reject Request"}
                </DialogTitle>
                <DialogContent sx={{ pb: 1, mt: 1 }}>
                    <Typography sx={{ fontFamily: fontBody, fontSize: "0.85rem", color: T.textSub, mb: 2 }}>
                        You are about to {modal.mode} the late entry request for <b style={{ color: T.text }}>{modal.data?.name}</b> at <b style={{ color: T.text }}>{modal.data?.requestedTime}</b>.
                    </Typography>
                    <Typography sx={{ fontFamily: fontBody, fontSize: "0.78rem", fontWeight: 600, color: T.textSub, mb: 0.8 }}>Admin Remarks (Optional)</Typography>
                    <TextField fullWidth multiline rows={3} placeholder={modal.mode === "approve" ? "Reason or conditions for approval..." : "Reason for rejection..."} value={modal.reason} onChange={e => setModal({ ...modal, reason: e.target.value })} sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px", fontFamily: fontBody, fontSize: "0.85rem", bgcolor: T.bg, "& fieldset": { borderColor: T.border } } }} />
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={() => setModal({ ...modal, open: false })} sx={{ fontFamily: fontBody, fontWeight: 600, color: T.textSub, textTransform: "none" }}>Cancel</Button>
                    <Button onClick={confirmAction} variant="contained" sx={{ fontFamily: fontBody, fontWeight: 600, bgcolor: modal.mode === "approve" ? T.success : T.danger, textTransform: "none", borderRadius: "8px", boxShadow: "none", "&:hover": { bgcolor: modal.mode === "approve" ? "#0ea5e9" : "#dc2626" } }}>Confirm Action</Button>
                </DialogActions>
            </Dialog>

            <Snackbar open={snack.open} autoHideDuration={3000} onClose={() => setSnack({ open: false, msg: "" })} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
                <Alert severity="success" sx={{ borderRadius: "10px", fontFamily: fontBody, fontWeight: 600 }}>{snack.msg}</Alert>
            </Snackbar>
        </Box>
    );
}
