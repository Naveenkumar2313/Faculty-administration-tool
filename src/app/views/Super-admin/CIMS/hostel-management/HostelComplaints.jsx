import React, { useState } from "react";
import {
    Box, Card, Grid, Typography, Button, TextField, MenuItem, Table, TableBody, TableCell, TableHead, TableRow,
    IconButton, InputAdornment, Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, Alert
} from "@mui/material";
import {
    Search, FilterList, ReportProblem, ErrorOutline, Build, CheckCircleOutline, Edit, DeleteOutline, Close
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

const SLabel = ({ children, sx = {} }) => <Typography sx={{ fontFamily: fontBody, fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: T.textMute, mb: 0.5, ...sx }}>{children}</Typography>;
const DInput = ({ sx = {}, ...props }) => <TextField size="small" fullWidth {...props} sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px", fontFamily: fontBody, fontSize: "0.82rem", bgcolor: T.surface, "& fieldset": { borderColor: T.border }, "&.Mui-focused fieldset": { borderColor: T.accent } }, "& .MuiInputLabel-root.Mui-focused": { color: T.accent }, ...sx }} />;

const StatusPill = ({ status }) => {
    const map = {
        Open: { bg: T.dangerLight, color: T.danger },
        "In Progress": { bg: T.warningLight, color: T.warning },
        Resolved: { bg: T.successLight, color: T.success },
        High: { bg: T.dangerLight, color: T.danger },
        Medium: { bg: T.warningLight, color: T.warning },
        Low: { bg: T.infoLight, color: T.info },
    };
    const s = map[status] || { bg: T.bg, color: T.textSub };
    return (
        <Box sx={{ px: 1.2, py: 0.4, borderRadius: "6px", bgcolor: s.bg, width: "fit-content", display: "inline-block" }}>
            <Typography sx={{ fontFamily: fontBody, fontSize: "0.7rem", fontWeight: 700, color: s.color }}>{status}</Typography>
        </Box>
    );
};

const StatCard = ({ label, value, sub, color, icon: Icon, bgLight }) => (
    <Card className="fade-up" sx={{ p: 2.5, borderRadius: "14px", border: `1px solid ${T.border}`, background: T.surface, boxShadow: "0 1px 4px rgba(0,0,0,0.04)", height: "100%" }}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
            <Box>
                <SLabel>{label}</SLabel>
                <Typography sx={{ fontFamily: fontMono, fontWeight: 700, fontSize: "1.8rem", color: color || T.text, lineHeight: 1.1 }}>{value}</Typography>
                {sub && <Typography sx={{ fontFamily: fontBody, fontSize: "0.72rem", color: T.textMute, mt: 0.4 }}>{sub}</Typography>}
            </Box>
            {Icon && <Box sx={{ p: 1.2, borderRadius: "10px", bgcolor: bgLight || `${color}15`, color: color }}><Icon sx={{ fontSize: 22 }} /></Box>}
        </Box>
    </Card>
);

const initialComplaints = [
    { id: "C-101", student: "Rahul Sharma", room: "A-101", category: "Electrical", title: "Fan not working", description: "Ceiling fan makes noise and stops.", date: "2023-10-20", status: "Open", priority: "High" },
    { id: "C-102", student: "Priya Patel", room: "G-205", category: "Plumbing", title: "Leaking tap", description: "Bathroom tap is leaking continuously.", date: "2023-10-18", status: "Resolved", priority: "Medium" },
    { id: "C-103", student: "Amit Kumar", room: "B-302", category: "Mess", title: "Food quality issue", description: "Rice was undercooked today.", date: "2023-10-25", status: "In Progress", priority: "High" },
    { id: "C-104", student: "Neha Singh", room: "G-110", category: "Carpentry", title: "Broken chair", description: "Study chair leg is broken.", date: "2023-10-22", status: "Open", priority: "Low" },
    { id: "C-105", student: "Vikram Singh", room: "A-105", category: "Internet", title: "Wi-Fi not connecting", description: "Unable to connect to hostel Wi-Fi.", date: "2023-10-26", status: "Open", priority: "High" },
];

export default function HostelComplaints() {
    const [searchTerm, setSearchTerm] = useState("");
    const [activeTab, setActiveTab] = useState("all");
    const [complaints, setComplaints] = useState(initialComplaints);
    const [modal, setModal] = useState({ open: false, data: null });
    const [snack, setSnack] = useState({ open: false, msg: "" });

    const filteredComplaints = complaints.filter(c => {
        const matchesSearch = c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.student.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.room.toLowerCase().includes(searchTerm.toLowerCase());
        if (activeTab === "all") return matchesSearch;
        if (activeTab === "open") return matchesSearch && c.status === "Open";
        if (activeTab === "resolved") return matchesSearch && c.status === "Resolved";
        return matchesSearch;
    });

    const handleSave = () => {
        setSnack({ open: true, msg: "Complaint saved successfully." });
        setModal({ open: false, data: null });
    };

    return (
        <Box sx={{ p: 3, background: T.bg, minHeight: "100vh", fontFamily: fontBody }}>
            <Fonts />

            {/* ── Header ── */}
            <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3} className="fade-up">
                <Box>
                    <Typography sx={{ fontFamily: fontBody, fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: T.textMute, mb: 0.3 }}>Hostel Management</Typography>
                    <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1.5rem", color: T.text, lineHeight: 1.1 }}>Hostel Complaints</Typography>
                    <Typography sx={{ fontFamily: fontBody, fontSize: "0.82rem", color: T.textSub, mt: 0.4 }}>Manage and resolve student issues related to facilities, mess, and infrastructure.</Typography>
                </Box>
                <Button variant="contained" startIcon={<ReportProblem sx={{ fontSize: 16 }} />} onClick={() => setModal({ open: true, data: { category: "Electrical", priority: "Medium", status: "Open" } })} sx={{ fontFamily: fontBody, fontWeight: 700, fontSize: "0.8rem", textTransform: "none", borderRadius: "8px", bgcolor: T.accent, boxShadow: "none" }}>Raise Complaint</Button>
            </Box>

            {/* ── Stat Cards ── */}
            <Grid container spacing={3} mb={3}>
                <Grid item xs={12} sm={6} md={3}><StatCard label="Total Complaints" value={complaints.length} sub="This month" color={T.textSub} bgLight={T.border} icon={ReportProblem} /></Grid>
                <Grid item xs={12} sm={6} md={3}><StatCard label="Open Issues" value={complaints.filter(c => c.status === "Open").length} sub="Require immediate action" color={T.danger} bgLight={T.dangerLight} icon={ErrorOutline} /></Grid>
                <Grid item xs={12} sm={6} md={3}><StatCard label="In Progress" value={complaints.filter(c => c.status === "In Progress").length} sub="Currently being fixed" color={T.warning} bgLight={T.warningLight} icon={Build} /></Grid>
                <Grid item xs={12} sm={6} md={3}><StatCard label="Resolved" value={complaints.filter(c => c.status === "Resolved").length} sub="Successfully closed" color={T.success} bgLight={T.successLight} icon={CheckCircleOutline} /></Grid>
            </Grid>

            {/* ── Table Container ── */}
            <Card className="fade-up" sx={{ borderRadius: "14px", border: `1px solid ${T.border}`, boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                <Box sx={{ p: 2.5, borderBottom: `1px solid ${T.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
                    <Box>
                        <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1.1rem" }}>Complaint Log</Typography>
                        <Typography sx={{ fontFamily: fontBody, fontSize: "0.78rem", color: T.textMute }}>Track the status of all reported issues.</Typography>
                    </Box>
                    <Box display="flex" gap={1.5}>
                        <TextField size="small" placeholder="Search complaints..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} InputProps={{ startAdornment: <InputAdornment position="start"><Search sx={{ fontSize: 16, color: T.textMute }} /></InputAdornment> }} sx={{ width: 260, "& .MuiOutlinedInput-root": { borderRadius: "8px", fontFamily: fontBody, fontSize: "0.8rem" } }} />
                        <Button variant="outlined" sx={{ minWidth: 0, p: 1, borderRadius: "8px", borderColor: T.border, color: T.textSub }}><FilterList sx={{ fontSize: 18 }} /></Button>
                    </Box>
                </Box>
                <Box sx={{ p: 2, borderBottom: `1px solid ${T.border}`, display: "flex", gap: 1 }}>
                    {[
                        { id: "all", label: "All" },
                        { id: "open", label: "Open" },
                        { id: "resolved", label: "Resolved" }
                    ].map(tab => (
                        <Button key={tab.id} size="small" variant={activeTab === tab.id ? "contained" : "outlined"} onClick={() => setActiveTab(tab.id)}
                            sx={{ fontFamily: fontBody, fontWeight: 600, fontSize: "0.75rem", textTransform: "none", borderRadius: "6px", boxShadow: "none", ...(activeTab === tab.id ? { bgcolor: "#4d7fd0ff", color: "#fff" } : { borderColor: T.border, color: "#000000ff" }) }}>
                            {tab.label}
                        </Button>
                    ))}
                </Box>
                <Table>
                    <TableHead><TableRow sx={{ bgcolor: "#F9FAFB" }}>
                        {["ID", "Student / Room", "Category", "Issue", "Date", "Priority", "Status", "Actions"].map(h => <TableCell key={h} sx={{ fontFamily: fontBody, fontWeight: 700, fontSize: "0.72rem", color: T.textMute, textTransform: "uppercase", py: 1.5, ...(h === "Actions" ? { textAlign: "right" } : {}) }}>{h}</TableCell>)}
                    </TableRow></TableHead>
                    <TableBody>
                        {filteredComplaints.map(row => (
                            <TableRow key={row.id} className="row-hover">
                                <TableCell sx={{ fontFamily: fontMono, fontSize: "0.75rem", color: T.textSub }}>{row.id}</TableCell>
                                <TableCell>
                                    <Typography sx={{ fontFamily: fontBody, fontWeight: 600, fontSize: "0.85rem", color: T.text }}>{row.student}</Typography>
                                    <Typography sx={{ fontFamily: fontMono, fontSize: "0.75rem", color: T.textMute }}>{row.room}</Typography>
                                </TableCell>
                                <TableCell sx={{ fontFamily: fontBody, fontSize: "0.82rem", color: T.textSub }}>{row.category}</TableCell>
                                <TableCell>
                                    <Typography sx={{ fontFamily: fontBody, fontWeight: 600, fontSize: "0.85rem", color: T.text, maxWidth: 200, WebkitLineClamp: 1, WebkitBoxOrient: "vertical", overflow: "hidden", display: "-webkit-box" }}>{row.title}</Typography>
                                    <Typography sx={{ fontFamily: fontBody, fontSize: "0.75rem", color: T.textMute, maxWidth: 200, WebkitLineClamp: 1, WebkitBoxOrient: "vertical", overflow: "hidden", display: "-webkit-box" }}>{row.description}</Typography>
                                </TableCell>
                                <TableCell sx={{ fontFamily: fontMono, fontSize: "0.75rem", color: T.textSub }}>{row.date}</TableCell>
                                <TableCell><StatusPill status={row.priority} /></TableCell>
                                <TableCell><StatusPill status={row.status} /></TableCell>
                                <TableCell sx={{ textAlign: "right", py: 1 }}>
                                    <IconButton size="small" onClick={() => setModal({ open: true, data: row })} sx={{ color: T.textMute }}><Edit sx={{ fontSize: 16 }} /></IconButton>
                                    <IconButton size="small" sx={{ color: T.danger }}><DeleteOutline sx={{ fontSize: 16 }} /></IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Card>

            {/* ── Modal ── */}
            <Dialog open={modal.open} onClose={() => setModal({ open: false, data: null })} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: "16px", border: `1px solid ${T.border}` } }}>
                <DialogTitle sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1rem", color: T.text, borderBottom: `1px solid ${T.border}`, bgcolor: "#FAFBFD", pb: 2 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Box>{modal.data?.id ? "Edit Complaint" : "Raise Complaint"}</Box>
                        <IconButton size="small" onClick={() => setModal({ open: false, data: null })}><Close fontSize="small" /></IconButton>
                    </Box>
                </DialogTitle>
                <DialogContent sx={{ px: 3, pt: 3, pb: 2 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={6}><SLabel>Student Name</SLabel><DInput value={modal.data?.student || ""} /></Grid>
                        <Grid item xs={6}><SLabel>Room</SLabel><DInput value={modal.data?.room || ""} /></Grid>
                        <Grid item xs={6}><SLabel>Category</SLabel>
                            <DInput select value={modal.data?.category || "Electrical"}>
                                {["Electrical", "Plumbing", "Carpentry", "Mess", "Internet", "Other"].map(s => <MenuItem key={s} value={s} sx={{ fontFamily: fontBody, fontSize: "0.82rem" }}>{s}</MenuItem>)}
                            </DInput>
                        </Grid>
                        <Grid item xs={6}><SLabel>Priority</SLabel>
                            <DInput select value={modal.data?.priority || "Medium"}>
                                {["Low", "Medium", "High"].map(s => <MenuItem key={s} value={s} sx={{ fontFamily: fontBody, fontSize: "0.82rem" }}>{s}</MenuItem>)}
                            </DInput>
                        </Grid>
                        <Grid item xs={12}><SLabel>Title</SLabel><DInput value={modal.data?.title || ""} /></Grid>
                        <Grid item xs={12}><SLabel>Description</SLabel><DInput multiline rows={3} value={modal.data?.description || ""} /></Grid>
                        <Grid item xs={12}><SLabel>Status</SLabel>
                            <DInput select value={modal.data?.status || "Open"}>
                                {["Open", "In Progress", "Resolved"].map(s => <MenuItem key={s} value={s} sx={{ fontFamily: fontBody, fontSize: "0.82rem" }}>{s}</MenuItem>)}
                            </DInput>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 3, borderTop: `1px solid ${T.border}`, pt: 2, bgcolor: "#FAFBFD" }}>
                    <Button onClick={() => setModal({ open: false, data: null })} variant="outlined" sx={{ fontFamily: fontBody, fontWeight: 600, fontSize: "0.8rem", textTransform: "none", borderRadius: "8px", borderColor: T.border, color: T.textSub }}>Cancel</Button>
                    <Button variant="contained" onClick={handleSave} sx={{ fontFamily: fontBody, fontWeight: 700, fontSize: "0.8rem", textTransform: "none", borderRadius: "8px", bgcolor: T.accent, boxShadow: "none" }}>Save</Button>
                </DialogActions>
            </Dialog>

            <Snackbar open={snack.open} autoHideDuration={3000} onClose={() => setSnack({ open: false, msg: "" })} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
                <Alert severity="success" sx={{ borderRadius: "10px", fontFamily: fontBody, fontWeight: 600 }}>{snack.msg}</Alert>
            </Snackbar>
        </Box>
    );
}
