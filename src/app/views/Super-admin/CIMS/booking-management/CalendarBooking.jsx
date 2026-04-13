import React, { useState } from "react";
import {
    Box, Card, Typography, Button, IconButton, Grid, Paper, Tooltip, Divider, Chip, Avatar
} from "@mui/material";
import {
    ChevronLeft, ChevronRight, Event, Place, Person, Business, AccessTime
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
  `}</style>
);

const SLabel = ({ children, sx = {} }) => <Typography sx={{ fontFamily: fontBody, fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: T.textMute, mb: 0.5, ...sx }}>{children}</Typography>;

const mockBookings = [
    { id: "B-101", title: "CS101 Lecture", type: "Room", room: "Conference Room A", requester: "Dr. Alan Turing", dept: "CSE", date: 4, time: "09:00 AM – 11:00 AM", status: "Approved" },
    { id: "B-102", title: "AI Research Lab Session", type: "Lab", room: "Advanced Computing Lab", requester: "Prof. Ada Lovelace", dept: "CSE", date: 4, time: "02:00 PM – 05:00 PM", status: "Pending" },
    { id: "B-103", title: "Tech Symposium", type: "Auditorium", room: "Main Auditorium", requester: "Student Council", dept: "General", date: 12, time: "10:00 AM – 04:00 PM", status: "Approved" },
    { id: "B-104", title: "Faculty Meeting", type: "Room", room: "Board Room 1", requester: "Dean of Engineering", dept: "Admin", date: 15, time: "01:00 PM – 03:00 PM", status: "Pending" },
    { id: "B-105", title: "Physics Practical", type: "Lab", room: "Physics Lab 1", requester: "Dr. Marie Curie", dept: "Physics", date: 18, time: "10:00 AM – 01:00 PM", status: "Approved" },
    { id: "B-106", title: "Cultural Fest Prep", type: "Auditorium", room: "Main Auditorium", requester: "Cultural Committee", dept: "General", date: 22, time: "09:00 AM – 05:00 PM", status: "Pending" },
    { id: "B-107", title: "Project Review", type: "Room", room: "Meeting Room 102", requester: "Prof. Rajan Kumar", dept: "Mech", date: 7, time: "10:00 AM – 11:30 AM", status: "Approved" },
];

const getTypeTokens = (t) => {
    const map = { Room: { c: "#3B82F6", bg: "#EFF6FF" }, Lab: { c: "#10B981", bg: "#ECFDF5" }, Auditorium: { c: "#8B5CF6", bg: "#F5F3FF" } };
    return map[t] || { c: "#9CA3AF", bg: "#F3F4F6" };
};

const getStatusDot = (s) => {
    const map = { Approved: T.success, Pending: T.warning, Rejected: T.danger };
    return map[s] || T.textMute;
};

export default function CalendarBooking() {
    const [view, setView] = useState("Month");
    const [selectedDay, setSelectedDay] = useState(null);

    const daysInMonth = 30;
    const startingDay = 2; // April 2026 starts on Wednesday (index 2 for Mon-based would be Wed)
    const cells = Array.from({ length: 35 }, (_, i) => {
        const d = i - startingDay + 1;
        const isM = d > 0 && d <= daysInMonth;
        return { day: isM ? d : null, bookings: isM ? mockBookings.filter(b => b.date === d) : [] };
    });

    const selectedBookings = selectedDay ? mockBookings.filter(b => b.date === selectedDay) : [];
    const pendingCount = mockBookings.filter(b => b.status === "Pending").length;
    const approvedCount = mockBookings.filter(b => b.status === "Approved").length;

    return (
        <Box sx={{ p: 3, background: T.bg, minHeight: "100vh", fontFamily: fontBody, display: "flex", flexDirection: "column" }}>
            <Fonts />

            {/* ── Header ── */}
            <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3} className="fade-up">
                <Box>
                    <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1.5rem", color: T.text, lineHeight: 1.1 }}>Resource Calendar</Typography>
                    <Typography sx={{ fontFamily: fontBody, fontSize: "0.82rem", color: T.textSub, mt: 0.4 }}>
                        Centralized view of all booking requests across rooms, labs &amp; auditoriums
                    </Typography>
                </Box>
                <Box display="flex" gap={2} alignItems="center">
                    <Box display="flex" gap={1} alignItems="center">
                        <Box sx={{ px: 1.2, py: 0.4, borderRadius: "8px", bgcolor: T.warningLight }}>
                            <Typography sx={{ fontFamily: fontMono, fontWeight: 700, fontSize: "0.75rem", color: T.warning }}>{pendingCount} Pending</Typography>
                        </Box>
                        <Box sx={{ px: 1.2, py: 0.4, borderRadius: "8px", bgcolor: T.successLight }}>
                            <Typography sx={{ fontFamily: fontMono, fontWeight: 700, fontSize: "0.75rem", color: T.success }}>{approvedCount} Approved</Typography>
                        </Box>
                    </Box>
                </Box>
            </Box>

            <Box display="flex" gap={3} flex={1} overflow="hidden">
                {/* ── Calendar Card ── */}
                <Card sx={{ flex: 1, display: "flex", flexDirection: "column", borderRadius: "16px", border: `1px solid ${T.border}`, boxShadow: "0 1px 4px rgba(0,0,0,0.06)", overflow: "hidden" }} className="fade-up">
                    {/* Controls */}
                    <Box p={2.5} borderBottom={`1px solid ${T.border}`} bgcolor={T.surface}>
                        <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
                            <Box display="flex" alignItems="center" gap={2}>
                                <Box display="flex" gap={1}>
                                    <IconButton size="small" sx={{ border: `1px solid ${T.border}`, borderRadius: "8px" }}><ChevronLeft sx={{ fontSize: 18 }} /></IconButton>
                                    <IconButton size="small" sx={{ border: `1px solid ${T.border}`, borderRadius: "8px" }}><ChevronRight sx={{ fontSize: 18 }} /></IconButton>
                                </Box>
                                <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1.1rem" }}>April 2026</Typography>
                            </Box>
                            <Box display="flex" gap={1} bgcolor="#F3F4F6" p={0.6} borderRadius="10px">
                                {["Month", "Week", "Day"].map(v => (
                                    <Button key={v} onClick={() => setView(v)} sx={{ fontFamily: fontBody, fontWeight: 700, fontSize: "0.75rem", px: 2, py: 0.5, borderRadius: "6px", textTransform: "none", color: view === v ? T.text : T.textMute, bgcolor: view === v ? T.surface : "transparent", boxShadow: view === v ? "0 1px 2px rgba(0,0,0,0.05)" : "none", "&:hover": { bgcolor: view === v ? T.surface : "#E5E7EB" } }}>{v}</Button>
                                ))}
                            </Box>
                        </Box>
                        <Box display="flex" gap={3} mt={2.5}>
                            {["Room", "Lab", "Auditorium"].map(t => (
                                <Box key={t} display="flex" alignItems="center" gap={1}>
                                    <Box sx={{ width: 10, height: 10, borderRadius: "3px", bgcolor: getTypeTokens(t).c }} />
                                    <Typography sx={{ fontFamily: fontBody, fontSize: "0.75rem", color: T.textSub, fontWeight: 600 }}>{t}</Typography>
                                </Box>
                            ))}
                            <Box display="flex" alignItems="center" gap={1} ml={2}>
                                <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: T.warning }} />
                                <Typography sx={{ fontFamily: fontBody, fontSize: "0.72rem", color: T.textMute }}>Pending</Typography>
                            </Box>
                            <Box display="flex" alignItems="center" gap={1}>
                                <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: T.success }} />
                                <Typography sx={{ fontFamily: fontBody, fontSize: "0.72rem", color: T.textMute }}>Approved</Typography>
                            </Box>
                        </Box>
                    </Box>

                    {/* Calendar Grid */}
                    <Box sx={{ flex: 1, overflow: "auto", display: "flex", flexDirection: "column", bgcolor: T.surface }}>
                        <Box display="flex" bgcolor="#F9FAFB" borderBottom={`1px solid ${T.border}`}>
                            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => (
                                <Box key={d} flex={1} py={1.5} textAlign="center">
                                    <Typography sx={{ fontFamily: fontBody, fontWeight: 700, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em", color: T.textMute }}>{d}</Typography>
                                </Box>
                            ))}
                        </Box>
                        <Box display="grid" gridTemplateColumns="repeat(7, 1fr)" gridAutoRows="1fr" flex={1} sx={{ bgcolor: T.border, gap: "1px" }}>
                            {cells.map((c, i) => (
                                <Box key={i} onClick={() => c.day && setSelectedDay(c.day)} bgcolor={c.day ? (selectedDay === c.day ? T.accentLight : T.surface) : "#FAFAFA"} p={1.5} display="flex" flexDirection="column" gap={0.8}
                                    sx={{ minHeight: 110, cursor: c.day ? "pointer" : "default", transition: "background 0.15s", "&:hover": c.day ? { background: `${T.accentLight} !important` } : {} }}>
                                    {c.day && (
                                        <>
                                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                                <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "0.85rem", color: selectedDay === c.day ? T.accent : T.text }}>{c.day}</Typography>
                                                {c.bookings.length > 0 && (
                                                    <Box sx={{ px: 0.8, py: 0.15, borderRadius: "6px", bgcolor: c.bookings.some(b => b.status === "Pending") ? T.warningLight : T.successLight }}>
                                                        <Typography sx={{ fontFamily: fontMono, fontSize: "0.6rem", fontWeight: 700, color: c.bookings.some(b => b.status === "Pending") ? T.warning : T.success }}>{c.bookings.length}</Typography>
                                                    </Box>
                                                )}
                                            </Box>
                                            <Box sx={{ overflowY: "auto", flex: 1, display: "flex", flexDirection: "column", gap: 0.6 }}>
                                                {c.bookings.map(b => {
                                                    const tk = getTypeTokens(b.type);
                                                    return (
                                                        <Box key={b.id} sx={{ p: 0.8, borderRadius: "5px", borderLeft: `3px solid ${tk.c}`, bgcolor: tk.bg, position: "relative" }}>
                                                            <Box display="flex" alignItems="center" gap={0.5}>
                                                                <Box sx={{ width: 5, height: 5, borderRadius: "50%", bgcolor: getStatusDot(b.status), flexShrink: 0 }} />
                                                                <Typography sx={{ fontFamily: fontBody, fontWeight: 700, fontSize: "0.65rem", color: tk.c, lineHeight: 1.1 }} noWrap>{b.title}</Typography>
                                                            </Box>
                                                        </Box>
                                                    );
                                                })}
                                            </Box>
                                        </>
                                    )}
                                </Box>
                            ))}
                        </Box>
                    </Box>
                </Card>

                {/* ── Day Detail Sidebar ── */}
                <Card sx={{ width: 340, display: "flex", flexDirection: "column", borderRadius: "16px", border: `1px solid ${T.border}`, boxShadow: "0 1px 4px rgba(0,0,0,0.06)", flexShrink: 0 }} className="fade-up">
                    <Box p={2.5} borderBottom={`1px solid ${T.border}`} bgcolor={T.surface}>
                        <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1rem", color: T.text }}>
                            {selectedDay ? `April ${selectedDay}, 2026` : "Select a Day"}
                        </Typography>
                        <Typography sx={{ fontFamily: fontBody, fontSize: "0.78rem", color: T.textMute, mt: 0.3 }}>
                            {selectedDay ? `${selectedBookings.length} booking(s)` : "Click on a calendar day to view details"}
                        </Typography>
                    </Box>
                    <Box flex={1} overflow="auto" p={2} bgcolor="#F9FAFB">
                        {selectedDay ? (
                            selectedBookings.length > 0 ? (
                                <Box display="flex" flexDirection="column" gap={2}>
                                    {selectedBookings.map(b => {
                                        const tk = getTypeTokens(b.type);
                                        return (
                                            <Paper key={b.id} elevation={0} sx={{ p: 2, borderRadius: "12px", border: `1px solid ${T.border}`, borderLeft: `4px solid ${tk.c}`, bgcolor: T.surface }}>
                                                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1.5}>
                                                    <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "0.88rem", color: T.text, pr: 1 }}>{b.title}</Typography>
                                                    <Chip label={b.type} size="small" sx={{ bgcolor: tk.bg, color: tk.c, fontFamily: fontBody, fontWeight: 700, fontSize: "0.65rem", height: 20 }} />
                                                </Box>
                                                <Box display="flex" flexDirection="column" gap={1}>
                                                    <Box display="flex" alignItems="center" gap={1}><Place sx={{ fontSize: 14, color: T.textMute }} /><Typography sx={{ fontFamily: fontBody, fontSize: "0.78rem", color: T.textSub }}>{b.room}</Typography></Box>
                                                    <Box display="flex" alignItems="center" gap={1}><AccessTime sx={{ fontSize: 14, color: T.textMute }} /><Typography sx={{ fontFamily: fontMono, fontSize: "0.75rem", color: T.textSub }}>{b.time}</Typography></Box>
                                                    <Box display="flex" alignItems="center" gap={1}><Person sx={{ fontSize: 14, color: T.textMute }} /><Typography sx={{ fontFamily: fontBody, fontSize: "0.78rem", color: T.textSub }}>{b.requester}</Typography></Box>
                                                    <Box display="flex" alignItems="center" gap={1}><Business sx={{ fontSize: 14, color: T.textMute }} /><Typography sx={{ fontFamily: fontBody, fontSize: "0.78rem", color: T.textSub }}>{b.dept}</Typography></Box>
                                                </Box>
                                                <Box mt={1.5} pt={1.5} borderTop={`1px dashed ${T.border}`} display="flex" justifyContent="space-between" alignItems="center">
                                                    <Box display="flex" alignItems="center" gap={0.5}>
                                                        <Box sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: getStatusDot(b.status) }} />
                                                        <Typography sx={{ fontFamily: fontBody, fontSize: "0.72rem", fontWeight: 700, color: getStatusDot(b.status) }}>{b.status}</Typography>
                                                    </Box>
                                                    <Typography sx={{ fontFamily: fontMono, fontSize: "0.65rem", color: T.textMute }}>{b.id}</Typography>
                                                </Box>
                                            </Paper>
                                        );
                                    })}
                                </Box>
                            ) : (
                                <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100%">
                                    <Event sx={{ fontSize: 48, color: T.border, mb: 1 }} />
                                    <Typography sx={{ fontFamily: fontBody, fontSize: "0.85rem", color: T.textMute }}>No bookings on this day</Typography>
                                </Box>
                            )
                        ) : (
                            <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100%">
                                <Event sx={{ fontSize: 48, color: T.border, mb: 1 }} />
                                <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "0.9rem", color: T.textMute }}>Select a day</Typography>
                                <Typography sx={{ fontFamily: fontBody, fontSize: "0.78rem", color: T.textMute, mt: 0.5, textAlign: "center" }}>Click any date on the calendar to see booking details</Typography>
                            </Box>
                        )}
                    </Box>
                </Card>
            </Box>
        </Box>
    );
}
