import React, { useState } from "react";
import {
    Box, Card, Grid, Typography, TextField, Table, TableBody, TableCell, TableHead, TableRow,
    InputAdornment, Chip, Button, Snackbar, Alert, Tabs, Tab
} from "@mui/material";
import {
    Search, Verified, FactCheck, AccessTime, DoneAll, Assessment
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

const MOCK_ARCHIVE = [
    { id: "CMP-001", student: "Arjun Reddy", block: "Boys B", type: "Boys", category: "Cleaning", resolvedDate: "2024-04-12", handledBy: "Warden", notes: "Room cleaned personally.", status: "Closed" },
    { id: "CMP-002", student: "Neha Singh", block: "Girls A", type: "Girls", category: "Electrical", resolvedDate: "2024-04-10", handledBy: "Maintenance", notes: "Tube light replaced in hallway.", status: "Resolved & Verified" },
    { id: "CMP-003", student: "Riya Verma", block: "Girls B", type: "Girls", category: "Appliance", resolvedDate: "2024-04-09", handledBy: "Maintenance", notes: "Washing machine motor repaired.", status: "Resolved & Verified" },
    { id: "CMP-005", student: "Vikram Kumar", block: "Boys A", type: "Boys", category: "Plumbing", resolvedDate: "2024-04-08", handledBy: "Maintenance", notes: "Clogged drain cleared.", status: "Closed" },
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

export default function ResolvedComplaints() {
    const [searchTerm, setSearchTerm] = useState("");
    const [division, setDivision] = useState("All");
    const [snack, setSnack] = useState({ open: false, msg: "" });

    const filtered = MOCK_ARCHIVE.filter(c =>
        (division === "All" || c.type === division) &&
        (c.id.toLowerCase().includes(searchTerm.toLowerCase()) || c.student.toLowerCase().includes(searchTerm.toLowerCase()) || c.notes.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <Box sx={{ p: 3, background: T.bg, minHeight: "100vh", fontFamily: fontBody }}>
            <Fonts />
            <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3} className="fade-up">
                <Box>
                    <Typography sx={{ fontFamily: fontBody, fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: T.textMute, mb: 0.3 }}>Facilities & Maintenance</Typography>
                    <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1.5rem", color: T.text, lineHeight: 1.1 }}>Resolved Complaints Archive</Typography>
                    <Typography sx={{ fontFamily: fontBody, fontSize: "0.82rem", color: T.textSub, mt: 0.4 }}>Review historical closed tickets and their resolution details.</Typography>
                </Box>
                <Button variant="outlined" startIcon={<Assessment sx={{ fontSize: 16 }} />} sx={{ fontFamily: fontBody, fontWeight: 700, fontSize: "0.8rem", textTransform: "none", borderRadius: "8px", borderColor: T.border, color: T.textSub }}>Export Report</Button>
            </Box>

            <Grid container spacing={3} mb={3}>
                <Grid item xs={12} sm={4}><StatCard label="Total Resolved (Month)" value="142" color={T.success} bgLight={T.successLight} icon={FactCheck} /></Grid>
                <Grid item xs={12} sm={4}><StatCard label="Avg Resolution Time" value="1.8 Days" color={T.info} bgLight={T.infoLight} icon={AccessTime} /></Grid>
                <Grid item xs={12} sm={4}><StatCard label="Verified by Student" value="89%" color={T.purple} bgLight={T.purpleLight} icon={Verified} sub="High satisfaction rate" /></Grid>
            </Grid>

            <Card className="fade-up" sx={{ borderRadius: "14px", border: `1px solid ${T.border}`, boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                <Box sx={{ borderBottom: `1px solid ${T.border}`, bgcolor: "#FAFBFD", px: 2 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2} pt={2}>
                        <Tabs value={division} onChange={(e, v) => setDivision(v)} sx={{ minHeight: 40, "& .MuiTabs-indicator": { bgcolor: T.text, height: 3, borderRadius: "3px 3px 0 0" }, "& .MuiTab-root": { fontFamily: fontBody, fontWeight: 600, fontSize: "0.85rem", textTransform: "none", color: T.textMute, minHeight: 40, py: 1, "&.Mui-selected": { color: T.text } } }}>
                            <Tab label="Institution Complete Archive" value="All" />
                            <Tab label="Boys Hostel" value="Boys" />
                            <Tab label="Girls Hostel" value="Girls" />
                        </Tabs>
                        <Box pb={1.5} display="flex" gap={1.5}>
                            <TextField size="small" placeholder="Search archive..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} InputProps={{ startAdornment: <InputAdornment position="start"><Search sx={{ fontSize: 16, color: T.textMute }} /></InputAdornment> }} sx={{ width: 260, "& .MuiOutlinedInput-root": { borderRadius: "8px", fontFamily: fontBody, fontSize: "0.8rem", bgcolor: T.surface } }} />
                        </Box>
                    </Box>
                </Box>
                <Table>
                    <TableHead><TableRow sx={{ bgcolor: "#F9FAFB" }}>
                        {["Ticket Reference", "Location", "Resolution Notes", "Closed Detail", "Status"].map(h => <TableCell key={h} sx={{ fontFamily: fontBody, fontWeight: 700, fontSize: "0.72rem", color: T.textMute, textTransform: "uppercase", py: 1.5 }}>{h}</TableCell>)}
                    </TableRow></TableHead>
                    <TableBody>
                        {filtered.length > 0 ? filtered.map(row => (
                            <TableRow key={row.id} className="row-hover">
                                <TableCell>
                                    <Typography sx={{ fontFamily: fontMono, fontWeight: 700, fontSize: "0.85rem", color: T.text }}>{row.id}</Typography>
                                    <Typography sx={{ fontFamily: fontBody, fontSize: "0.7rem", color: T.textSub }}>{row.category}</Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography sx={{ fontFamily: fontBody, fontWeight: 600, fontSize: "0.82rem", color: T.text }}>{row.block}</Typography>
                                    <Typography sx={{ fontFamily: fontBody, fontSize: "0.75rem", color: T.textSub }}>{row.student}</Typography>
                                </TableCell>
                                <TableCell sx={{ maxWidth: 350 }}>
                                    <Typography sx={{ fontFamily: fontBody, fontSize: "0.85rem", color: T.text }}>{row.notes}</Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography sx={{ fontFamily: fontMono, fontSize: "0.75rem", color: T.textSub }}>{row.resolvedDate}</Typography>
                                    <Typography sx={{ fontFamily: fontBody, fontSize: "0.7rem", color: T.textMute }}>by {row.handledBy}</Typography>
                                </TableCell>
                                <TableCell>
                                    <Chip label={row.status} size="small" icon={<DoneAll sx={{ fontSize: 13 }} />} sx={{ fontFamily: fontBody, fontWeight: 700, fontSize: "0.7rem", bgcolor: row.status === "Closed" ? T.bg : T.successLight, color: row.status === "Closed" ? T.textSub : T.success, height: 24, borderRadius: "6px" }} />
                                </TableCell>
                            </TableRow>
                        )) : (
                            <TableRow><TableCell colSpan={5} sx={{ textAlign: "center", py: 5, color: T.textMute, fontFamily: fontBody }}>No archived complaints found.</TableCell></TableRow>
                        )}
                    </TableBody>
                </Table>
            </Card>
        </Box>
    );
}
