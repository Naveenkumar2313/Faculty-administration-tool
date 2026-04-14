import React, { useState } from "react";
import {
    Box, Card, Grid, Typography, Button, TextField, InputAdornment, Chip,
    Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Avatar, Tabs, Tab
} from "@mui/material";
import {
    Search, PushPin, Campaign, Assignment, EventNote, Warning, Close, FileDownload, ArrowForward, AccessTime
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
    .notice-card { transition: all 0.2s ease; border-left: 4px solid transparent; }
    .notice-card:hover { transform: translateY(-3px) scale(1.01); box-shadow: 0 8px 16px rgba(0,0,0,0.06); }
  `}</style>
);

const MOCK_NOTICES = [
    {
        id: "not-001",
        title: "Revised Academic Calendar for Even Semester 2026",
        date: "2026-04-10",
        department: "Dean of Academics",
        category: "Academic",
        isPinned: true,
        isUrgent: false,
        hasAttachment: true,
        excerpt: "Please find attached the revised academic calendar. Note the changes in mid-term examination dates.",
        content: "Dear Faculty, \n\nDue to the upcoming state elections, the academic calendar for the Even Semester 2026 has been revised. The mid-term examinations have been preponed by one week. All syllabus completions must align with the new dates. \n\nPlease review the attached PDF for exact dates and deadlines. Ensure students are informed promptly."
    },
    {
        id: "not-002",
        title: "URGENT: Server Maintenance Downtime",
        date: "2026-04-14",
        department: "IT Operations",
        category: "Alert",
        isPinned: true,
        isUrgent: true,
        hasAttachment: false,
        excerpt: "Campus ERP and Wi-Fi will be down for maintenance on April 15th from 02:00 AM to 06:00 AM.",
        content: "We are upgrading the core network switches in the main server room to improve campus-wide connectivity. Consequently, all university IT services including ERP, Email, and campus Wi-Fi will be completely unavailable during the maintenance window.\n\nTime: 02:00 AM to 06:00 AM (IST), April 15, 2026.\n\nPlease save all your work before the downtime."
    },
    {
        id: "not-003",
        title: "Call for Papers: 10th Annual Tech Symposium",
        date: "2026-04-05",
        department: "Research Wing",
        category: "Event",
        isPinned: false,
        isUrgent: false,
        hasAttachment: true,
        excerpt: "Submissions are open for the upcoming annual symposium. Deadline for abstract submission is May 10th.",
        content: "Welcome to the 10th Annual Tech Symposium. We invite faculty and research scholars to submit their original work. \n\nTopics include but are not limited to: \n- Artificial Intelligence \n- Renewable Energy \n- Sustainable Architecture\n\nRefer to the attached circular for submission guidelines and formatting requirements."
    },
    {
        id: "not-004",
        title: "New Faculty Welfare Policies Enacted",
        date: "2026-04-02",
        department: "Human Resources",
        category: "Administrative",
        isPinned: false,
        isUrgent: false,
        hasAttachment: true,
        excerpt: "Updates regarding health insurance claim caps and professional development allowances.",
        content: "The management committee has approved an increment in the professional development allowance for all full-time faculty members, raising it by 20%. Health insurance claim caps for dependents have also been adjusted to account for inflation.\n\nAll details are listed in the newly attached Employee Handout 2026."
    },
    {
        id: "not-005",
        title: "Library Book Requisition Deadline",
        date: "2026-03-28",
        department: "Central Library",
        category: "Academic",
        isPinned: false,
        isUrgent: false,
        hasAttachment: false,
        excerpt: "Submit your department's book requirements for the upcoming odd semester by April 20th.",
        content: "To assure timely procurement of reference books and textbooks for the upcoming semester, all HODs and faculty coordinators are requested to submit the final book requisition list through the library portal on or before April 20th. Requests received after the deadline will be processed in the next budget cycle."
    }
];

const getCategoryStyles = (category) => {
    switch (category) {
        case "Academic": return { color: T.info, bg: T.infoLight, icon: Assignment };
        case "Event": return { color: T.purple, bg: T.purpleLight, icon: EventNote };
        case "Alert": return { color: T.danger, bg: T.dangerLight, icon: Warning };
        case "Administrative": return { color: T.success, bg: T.successLight, icon: Campaign };
        default: return { color: T.textSub, bg: T.bg, icon: Assignment };
    }
};

export default function NoticeboardView() {
    const [searchTerm, setSearchTerm] = useState("");
    const [tabValue, setTabValue] = useState("All");
    const [selectedNotice, setSelectedNotice] = useState(null);

    const filteredNotices = MOCK_NOTICES.filter(notice => {
        const matchesSearch = notice.title.toLowerCase().includes(searchTerm.toLowerCase()) || notice.department.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesTab = tabValue === "All" || notice.category === tabValue;
        return matchesSearch && matchesTab;
    });

    const sortedNotices = [...filteredNotices].sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        return new Date(b.date) - new Date(a.date);
    });

    return (
        <Box sx={{ p: 3, background: T.bg, minHeight: "100vh", fontFamily: fontBody }}>
            <Fonts />
            <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3} className="fade-up">
                <Box>
                    <Typography sx={{ fontFamily: fontBody, fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: T.textMute, mb: 0.3 }}>Campus Info</Typography>
                    <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1.5rem", color: T.text, lineHeight: 1.1 }}>Noticeboard</Typography>
                    <Typography sx={{ fontFamily: fontBody, fontSize: "0.82rem", color: T.textSub, mt: 0.4 }}>View all institutional announcements, circulars, and alerts.</Typography>
                </Box>
            </Box>

            <Card sx={{ borderRadius: "14px", border: `1px solid ${T.border}`, boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }} className="fade-up">
                <Box sx={{ borderBottom: `1px solid ${T.border}`, bgcolor: "#FAFBFD", px: 2 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2} pt={2}>
                        <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} sx={{ minHeight: 40, "& .MuiTabs-indicator": { bgcolor: T.accent, height: 3, borderRadius: "3px 3px 0 0" }, "& .MuiTab-root": { fontFamily: fontBody, fontWeight: 600, fontSize: "0.85rem", textTransform: "none", color: T.textMute, minHeight: 40, py: 1, "&.Mui-selected": { color: T.accent } } }}>
                            {["All", "Academic", "Administrative", "Event", "Alert"].map(cat => <Tab key={cat} label={cat} value={cat} />)}
                        </Tabs>
                        <Box pb={1.5}>
                            <TextField size="small" placeholder="Search notices..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} InputProps={{ startAdornment: <InputAdornment position="start"><Search sx={{ fontSize: 16, color: T.textMute }} /></InputAdornment> }} sx={{ width: 240, "& .MuiOutlinedInput-root": { borderRadius: "8px", fontFamily: fontBody, fontSize: "0.8rem", bgcolor: T.surface } }} />
                        </Box>
                    </Box>
                </Box>

                <Box sx={{ p: 3 }}>
                    <Grid container spacing={3}>
                        {sortedNotices.map(notice => {
                            const catStyle = getCategoryStyles(notice.category);
                            return (
                                <Grid item xs={12} md={6} lg={6} key={notice.id}>
                                    <Card className="notice-card fade-up" sx={{ p: 2.5, borderRadius: "12px", border: `1px solid ${T.border}`, borderLeftColor: notice.isUrgent ? T.danger : notice.isPinned ? T.accent : "transparent", borderLeftWidth: notice.isUrgent || notice.isPinned ? "4px" : "1px", bgcolor: notice.isUrgent ? T.dangerLight : T.surface, cursor: "pointer", height: "100%", display: "flex", flexDirection: "column" }} onClick={() => setSelectedNotice(notice)}>
                                        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1.5}>
                                            <Box display="flex" gap={1.5}>
                                                <Avatar sx={{ bgcolor: catStyle.bg, color: catStyle.color, width: 38, height: 38 }}><catStyle.icon sx={{ fontSize: 20 }} /></Avatar>
                                                <Box>
                                                    <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1.05rem", color: notice.isUrgent ? T.danger : T.text, lineHeight: 1.3, mb: 0.3 }} className="line-clamp-2">{notice.title}</Typography>
                                                    <Typography sx={{ fontFamily: fontMono, fontSize: "0.75rem", color: T.textSub }}>{notice.department} • {new Date(notice.date).toLocaleDateString()}</Typography>
                                                </Box>
                                            </Box>
                                            <Box display="flex" gap={0.5}>
                                                {notice.isPinned && <Chip size="small" icon={<PushPin sx={{ fontSize: 12, color: T.accent }} />} label="Pinned" sx={{ bgcolor: T.accentLight, color: T.accent, fontFamily: fontBody, fontWeight: 700, fontSize: "0.65rem", height: 22, "& .MuiChip-icon": { ml: 0.8 } }} />}
                                                {notice.isUrgent && <Chip size="small" label="URGENT" sx={{ bgcolor: T.danger, color: T.surface, fontFamily: fontBody, fontWeight: 700, fontSize: "0.65rem", height: 22 }} />}
                                            </Box>
                                        </Box>
                                        <Typography sx={{ fontFamily: fontBody, fontSize: "0.85rem", color: T.textSub, mb: 2, flexGrow: 1 }}>{notice.excerpt}</Typography>
                                        <Box display="flex" justifyContent="space-between" alignItems="center" pt={1.5} borderTop={`1px dashed ${T.border}`}>
                                            <Chip size="small" label={notice.category} sx={{ bgcolor: catStyle.bg, color: catStyle.color, fontFamily: fontBody, fontWeight: 700, fontSize: "0.65rem", height: 22 }} />
                                            <Box display="flex" alignItems="center" gap={0.5} sx={{ color: T.textMute }}>
                                                {notice.hasAttachment && <FileDownload sx={{ fontSize: 16 }} />}
                                                <ArrowForward sx={{ fontSize: 16 }} />
                                            </Box>
                                        </Box>
                                    </Card>
                                </Grid>
                            );
                        })}
                        {sortedNotices.length === 0 && (
                            <Grid item xs={12}>
                                <Box sx={{ py: 6, textAlign: "center", color: T.textMute }}>
                                    <Assignment sx={{ fontSize: 40, opacity: 0.5, mb: 1 }} />
                                    <Typography sx={{ fontFamily: fontBody, fontSize: "0.9rem" }}>No notices found for the selected filter.</Typography>
                                </Box>
                            </Grid>
                        )}
                    </Grid>
                </Box>
            </Card>

            <Dialog open={!!selectedNotice} onClose={() => setSelectedNotice(null)} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: "16px", p: 0, overflow: "hidden" } }}>
                {selectedNotice && (() => {
                    const catStyle = getCategoryStyles(selectedNotice.category);
                    return (
                        <>
                            <Box sx={{ p: 3, bgcolor: selectedNotice.isUrgent ? T.dangerLight : "#FAFBFD", borderBottom: `1px solid ${T.border}` }}>
                                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                                    <Box display="flex" gap={1.5} alignItems="center">
                                        <Avatar sx={{ bgcolor: catStyle.bg, color: catStyle.color }}><catStyle.icon /></Avatar>
                                        <Box>
                                            <Typography sx={{ fontFamily: fontBody, fontSize: "0.75rem", fontWeight: 700, color: catStyle.color, textTransform: "uppercase", letterSpacing: "0.05em" }}>{selectedNotice.category} Notice</Typography>
                                        </Box>
                                    </Box>
                                    <IconButton size="small" onClick={() => setSelectedNotice(null)} sx={{ bgcolor: T.surface, border: `1px solid ${T.border}` }}><Close fontSize="small" /></IconButton>
                                </Box>
                                <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1.4rem", color: selectedNotice.isUrgent ? T.danger : T.text, mb: 1 }}>{selectedNotice.title}</Typography>
                                <Box display="flex" gap={2} sx={{ color: T.textSub, fontFamily: fontBody, fontSize: "0.85rem" }}>
                                    <Box display="flex" alignItems="center" gap={0.5}><Campaign sx={{ fontSize: 16 }} /> <b>From:</b> {selectedNotice.department}</Box>
                                    <Box display="flex" alignItems="center" gap={0.5}><AccessTime sx={{ fontSize: 16 }} /> <b>Date:</b> {new Date(selectedNotice.date).toLocaleDateString()}</Box>
                                </Box>
                            </Box>
                            <DialogContent sx={{ p: 4, fontFamily: fontBody, fontSize: "0.95rem", color: T.text, lineHeight: 1.6, whiteSpace: "pre-line" }}>
                                {selectedNotice.content}
                            </DialogContent>
                            <DialogActions sx={{ px: 3, pb: 3, pt: 2, borderTop: `1px solid ${T.border}`, bgcolor: "#FAFBFD", justifyContent: "space-between" }}>
                                <Box>
                                    {selectedNotice.hasAttachment && (
                                        <Button variant="outlined" startIcon={<FileDownload sx={{ fontSize: 18 }} />} sx={{ fontFamily: fontBody, fontWeight: 600, fontSize: "0.8rem", textTransform: "none", borderRadius: "8px", borderColor: T.border, color: T.accent, bgcolor: T.surface }}>Download Attachment</Button>
                                    )}
                                </Box>
                                <Button onClick={() => setSelectedNotice(null)} variant="contained" sx={{ fontFamily: fontBody, fontWeight: 600, bgcolor: T.text, textTransform: "none", borderRadius: "8px", boxShadow: "none" }}>Close Notice</Button>
                            </DialogActions>
                        </>
                    )
                })()}
            </Dialog>
        </Box>
    );
}
