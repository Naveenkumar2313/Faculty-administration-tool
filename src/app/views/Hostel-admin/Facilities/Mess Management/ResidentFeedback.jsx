import React, { useState } from "react";
import {
    Box, Card, Grid, Typography, Button, TextField, Table, TableBody, TableCell, TableHead, TableRow,
    InputAdornment, IconButton, Chip, Snackbar, Alert, Rating
} from "@mui/material";
import {
    Search, StarRate, Comment, DoneAll
} from "@mui/icons-material";

/* ── Design Tokens ── */
const T = {
    bg: "#F5F7FA", surface: "#FFFFFF", border: "#E4E8EF", text: "#111827", textSub: "#4B5563", textMute: "#9CA3AF",
    accent: "#6366F1", accentLight: "#EEF2FF", success: "#10B981", successLight: "#ECFDF5",
    warning: "#F59E0B", warningLight: "#FFFBEB", danger: "#EF4444", dangerLight: "#FEF2F2"
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

const MOCK_FEEDBACK = [
    { id: "FB-01", date: "2024-04-14", mealType: "Dinner", student: "Rahul Sharma", rating: 4, comment: "Paneer was great, but the rice was a bit undercooked.", status: "Pending Action" },
    { id: "FB-02", date: "2024-04-14", mealType: "Lunch", student: "Priya Patel", rating: 2, comment: "Too much salt in the Dal.", status: "Pending Action" },
    { id: "FB-03", date: "2024-04-13", mealType: "Breakfast", student: "Vikram Kumar", rating: 5, comment: "Dosa was excellent!", status: "Reviewed" },
    { id: "FB-04", date: "2024-04-12", mealType: "Snacks", student: "Neha Singh", rating: 3, comment: "Samosas were cold today.", status: "Reviewed" }
];

export default function ResidentFeedback() {
    const [searchTerm, setSearchTerm] = useState("");
    const [feedbacks, setFeedbacks] = useState(MOCK_FEEDBACK);
    const [snack, setSnack] = useState({ open: false, msg: "" });

    const markReviewed = (id) => {
        setFeedbacks(feedbacks.map(f => f.id === id ? { ...f, status: "Reviewed" } : f));
        setSnack({ open: true, msg: "Feedback marked as reviewed." });
    };

    const filtered = feedbacks.filter(r => r.student.toLowerCase().includes(searchTerm.toLowerCase()) || r.comment.toLowerCase().includes(searchTerm.toLowerCase()));

    const avgRating = (feedbacks.reduce((acc, curr) => acc + curr.rating, 0) / feedbacks.length).toFixed(1);

    return (
        <Box sx={{ p: 3, background: T.bg, minHeight: "100vh", fontFamily: fontBody }}>
            <Fonts />
            <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3} className="fade-up">
                <Box>
                    <Typography sx={{ fontFamily: fontBody, fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: T.textMute, mb: 0.3 }}>Mess Management</Typography>
                    <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1.5rem", color: T.text, lineHeight: 1.1 }}>Resident Feedback</Typography>
                    <Typography sx={{ fontFamily: fontBody, fontSize: "0.82rem", color: T.textSub, mt: 0.4 }}>View and act on mess quality feedback from students.</Typography>
                </Box>
            </Box>

            <Grid container spacing={3} mb={3}>
                <Grid item xs={12} sm={4}>
                    <Card className="fade-up" sx={{ p: 2.5, borderRadius: "14px", border: `1px solid ${T.border}`, background: T.surface, boxShadow: "0 1px 4px rgba(0,0,0,0.04)", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                        <Typography sx={{ fontFamily: fontBody, fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", color: T.textMute, mb: 1 }}>Average Rating</Typography>
                        <Typography sx={{ fontFamily: fontMono, fontWeight: 700, fontSize: "2.5rem", color: T.warning, lineHeight: 1 }}>{avgRating}</Typography>
                        <Rating value={parseFloat(avgRating)} readOnly precision={0.1} sx={{ mt: 1 }} />
                    </Card>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Card className="fade-up" sx={{ p: 2.5, borderRadius: "14px", border: `1px solid ${T.border}`, background: T.surface, boxShadow: "0 1px 4px rgba(0,0,0,0.04)", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                        <Comment sx={{ fontSize: 32, color: T.accent, mb: 1 }} />
                        <Typography sx={{ fontFamily: fontMono, fontWeight: 700, fontSize: "1.8rem", color: T.text, lineHeight: 1 }}>{feedbacks.length}</Typography>
                        <Typography sx={{ fontFamily: fontBody, fontSize: "0.75rem", color: T.textMute, mt: 0.5 }}>Total Responses</Typography>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Card className="fade-up" sx={{ p: 2.5, borderRadius: "14px", border: `1px solid ${T.border}`, background: T.surface, boxShadow: "0 1px 4px rgba(0,0,0,0.04)", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                        <DoneAll sx={{ fontSize: 32, color: T.success, mb: 1 }} />
                        <Typography sx={{ fontFamily: fontMono, fontWeight: 700, fontSize: "1.8rem", color: T.text, lineHeight: 1 }}>{feedbacks.filter(f => f.status === "Pending Action").length}</Typography>
                        <Typography sx={{ fontFamily: fontBody, fontSize: "0.75rem", color: T.danger, mt: 0.5, fontWeight: 600 }}>Action Required</Typography>
                    </Card>
                </Grid>
            </Grid>

            <Card className="fade-up" sx={{ borderRadius: "14px", border: `1px solid ${T.border}`, boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                <Box sx={{ p: 2.5, borderBottom: `1px solid ${T.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1.1rem" }}>Feedback Logs</Typography>
                    <TextField size="small" placeholder="Search comments..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} InputProps={{ startAdornment: <InputAdornment position="start"><Search sx={{ fontSize: 16, color: T.textMute }} /></InputAdornment> }} sx={{ width: 260, "& .MuiOutlinedInput-root": { borderRadius: "8px", fontFamily: fontBody, fontSize: "0.8rem", bgcolor: T.bg } }} />
                </Box>
                <Table>
                    <TableHead><TableRow sx={{ bgcolor: "#F9FAFB" }}>
                        {["Date & Meal", "Resident", "Rating", "Comments", "Status", "Actions"].map(h => <TableCell key={h} sx={{ fontFamily: fontBody, fontWeight: 700, fontSize: "0.72rem", color: T.textMute, textTransform: "uppercase", py: 1.5, ...(h === "Actions" ? { textAlign: "right" } : {}) }}>{h}</TableCell>)}
                    </TableRow></TableHead>
                    <TableBody>
                        {filtered.length > 0 ? filtered.map(row => (
                            <TableRow key={row.id} className="row-hover">
                                <TableCell>
                                    <Typography sx={{ fontFamily: fontMono, fontSize: "0.75rem", color: T.textSub }}>{row.date}</Typography>
                                    <Typography sx={{ fontFamily: fontBody, fontWeight: 600, fontSize: "0.85rem", color: T.text }}>{row.mealType}</Typography>
                                </TableCell>
                                <TableCell sx={{ fontFamily: fontBody, fontSize: "0.85rem", color: T.textSub }}>{row.student}</TableCell>
                                <TableCell>
                                    <Rating value={row.rating} readOnly size="small" />
                                </TableCell>
                                <TableCell sx={{ fontFamily: fontBody, fontSize: "0.82rem", color: T.textSub, maxWidth: 350 }}>{row.comment}</TableCell>
                                <TableCell>
                                    <Chip label={row.status} size="small" sx={{ fontFamily: fontBody, fontWeight: 700, fontSize: "0.7rem", bgcolor: row.status === "Reviewed" ? T.successLight : T.warningLight, color: row.status === "Reviewed" ? T.success : T.warning, height: 24, borderRadius: "6px" }} />
                                </TableCell>
                                <TableCell sx={{ textAlign: "right", py: 1 }}>
                                    {row.status !== "Reviewed" && (
                                        <Button size="small" variant="contained" onClick={() => markReviewed(row.id)} sx={{ fontFamily: fontBody, fontWeight: 700, fontSize: "0.7rem", textTransform: "none", borderRadius: "6px", bgcolor: T.success, boxShadow: "none" }}>Acknowledge</Button>
                                    )}
                                </TableCell>
                            </TableRow>
                        )) : (
                            <TableRow><TableCell colSpan={6} sx={{ textAlign: "center", py: 5, color: T.textMute, fontFamily: fontBody }}>No feedback matching criteria.</TableCell></TableRow>
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
