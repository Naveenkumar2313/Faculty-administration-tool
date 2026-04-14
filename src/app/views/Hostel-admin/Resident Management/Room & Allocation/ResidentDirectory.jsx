import React, { useState } from "react";
import {
    Box, Card, Grid, Typography, Button, TextField, InputAdornment, Avatar, Chip, Tabs, Tab
} from "@mui/material";
import { Search, FilterList, Phone, Email, MeetingRoom, Badge as BadgeIcon, Male, Female, People } from "@mui/icons-material";

/* ── Design Tokens ── */
const T = {
    bg: "#F5F7FA", surface: "#FFFFFF", border: "#E4E8EF", text: "#111827", textSub: "#4B5563", textMute: "#9CA3AF",
    accent: "#6366F1", accentLight: "#EEF2FF", success: "#10B981", successLight: "#ECFDF5",
    info: "#3B82F6", infoLight: "#EFF6FF", pink: "#EC4899", pinkLight: "#FDF2F8"
};
const fontHead = "Sora, Roboto, Helvetica, Arial, sans-serif";
const fontBody = "Nunito, Roboto, Helvetica, Arial, sans-serif";
const fontMono = "JetBrains Mono, monospace";

const Fonts = () => (
    <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700&family=Nunito:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600&display=swap');
    * { box-sizing: border-box; }
    @keyframes fadeUp { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:none; } }
    .fade-up { animation: fadeUp 0.3s ease both; }
  `}</style>
);

const MOCK_RESIDENTS = [
    { id: "STU-2101", name: "Rahul Sharma", type: "Boys", course: "B.Tech CSE", contact: "+91 9876543210", email: "rahul.s@student.edu", block: "Block A", room: "A-101", status: "Active" },
    { id: "STU-2102", name: "Priya Singh", type: "Girls", course: "B.Arch", contact: "+91 9876543211", email: "priya.s@student.edu", block: "Block B", room: "B-205", status: "Active" },
    { id: "STU-2105", name: "Vikram Kumar", type: "Boys", course: "M.Tech Mech", contact: "+91 9876543212", email: "vikram.k@student.edu", block: "Block C", room: "C-302", status: "Active" },
    { id: "STU-2108", name: "Neha Gupta", type: "Girls", course: "B.Tech IT", contact: "+91 9876543215", email: "neha.g@student.edu", block: "Block A", room: "A-304", status: "Active" },
    { id: "STU-2110", name: "Arjun Reddy", type: "Boys", course: "MCA", contact: "+91 9876543220", email: "arjun.r@student.edu", block: "Block B", room: "B-112", status: "Away" },
    { id: "STU-2115", name: "Riya Verma", type: "Girls", course: "BBA", contact: "+91 9876543225", email: "riya.v@student.edu", block: "Block C", room: "C-201", status: "Active" }
];

export default function ResidentDirectory() {
    const [searchTerm, setSearchTerm] = useState("");
    const [hostelType, setHostelType] = useState("All");

    const filtered = MOCK_RESIDENTS.filter(r =>
        (hostelType === "All" || r.type === hostelType) &&
        (r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            r.room.toLowerCase().includes(searchTerm.toLowerCase()) ||
            r.id.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <Box sx={{ p: 3, background: T.bg, minHeight: "100vh", fontFamily: fontBody }}>
            <Fonts />
            <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3} className="fade-up">
                <Box>
                    <Typography sx={{ fontFamily: fontBody, fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: T.textMute, mb: 0.3 }}>Resident Management</Typography>
                    <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1.5rem", color: T.text, lineHeight: 1.1 }}>Resident Directory</Typography>
                    <Typography sx={{ fontFamily: fontBody, fontSize: "0.82rem", color: T.textSub, mt: 0.4 }}>Searchable list of all institutional residents separated by hostel division.</Typography>
                </Box>
            </Box>

            <Box sx={{ borderBottom: 1, borderColor: T.border, mb: 3 }} className="fade-up">
                <Tabs value={hostelType} onChange={(e, v) => setHostelType(v)} TabIndicatorProps={{ sx: { bgcolor: hostelType === "Girls" ? T.pink : (hostelType === "Boys" ? T.info : T.accent), height: 3, borderRadius: "3px 3px 0 0" } }} sx={{ "& .MuiTab-root": { fontFamily: fontBody, fontWeight: 600, fontSize: "0.9rem", textTransform: "none", color: T.textSub, minWidth: 140, minHeight: 48 }, "& .Mui-selected": { color: `${hostelType === "Girls" ? T.pink : (hostelType === "Boys" ? T.info : T.accent)} !important` } }}>
                    <Tab label={<Box display="flex" alignItems="center" gap={1}><People fontSize="small" /> All Residents</Box>} value="All" />
                    <Tab label={<Box display="flex" alignItems="center" gap={1}><Male fontSize="small" /> Boys Hostel</Box>} value="Boys" />
                    <Tab label={<Box display="flex" alignItems="center" gap={1}><Female fontSize="small" /> Girls Hostel</Box>} value="Girls" />
                </Tabs>
            </Box>

            <Box display="flex" gap={1.5} mb={3} className="fade-up">
                <TextField size="small" placeholder={`Search ${hostelType !== 'All' ? hostelType.toLowerCase() + ' ' : ''}residents...`} value={searchTerm} onChange={e => setSearchTerm(e.target.value)} InputProps={{ startAdornment: <InputAdornment position="start"><Search sx={{ fontSize: 16, color: T.textMute }} /></InputAdornment> }} sx={{ width: 320, "& .MuiOutlinedInput-root": { borderRadius: "8px", fontFamily: fontBody, fontSize: "0.85rem", bgcolor: T.surface } }} />
                <Button variant="outlined" startIcon={<FilterList sx={{ fontSize: 16 }} />} sx={{ fontFamily: fontBody, fontWeight: 700, fontSize: "0.8rem", textTransform: "none", borderRadius: "8px", borderColor: T.border, color: T.textSub, bgcolor: T.surface }}>Filter</Button>
            </Box>

            <Grid container spacing={3}>
                {filtered.map(res => {
                    const isBoy = res.type === "Boys";
                    const divisionColor = isBoy ? T.info : T.pink;
                    const divisionLight = isBoy ? T.infoLight : T.pinkLight;

                    return (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={res.id}>
                            <Card className="fade-up" sx={{ p: 2.5, borderRadius: "14px", border: `1px solid ${T.border}`, borderTop: `4px solid ${divisionColor}`, boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                                    <Avatar sx={{ width: 48, height: 48, bgcolor: divisionLight, color: divisionColor, fontWeight: 700, fontFamily: fontHead, fontSize: "1.2rem" }}>{res.name.charAt(0)}</Avatar>
                                    <Chip label={res.status} size="small" sx={{ fontFamily: fontBody, fontWeight: 700, fontSize: "0.65rem", bgcolor: res.status === "Active" ? T.successLight : "#F3F4F6", color: res.status === "Active" ? T.success : T.textSub, height: 22 }} />
                                </Box>
                                <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1.05rem", color: T.text }}>{res.name}</Typography>
                                <Box display="flex" alignItems="center" gap={0.5} mb={1.5}>
                                    <BadgeIcon sx={{ fontSize: 13, color: T.textMute }} />
                                    <Typography sx={{ fontFamily: fontMono, fontSize: "0.75rem", color: T.textSub }}>{res.id} • {res.course}</Typography>
                                </Box>
                                <Box sx={{ p: 1.5, bgcolor: "#FAFBFD", borderRadius: "8px", border: `1px solid ${T.border}`, mb: 1.5 }}>
                                    <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                                        <MeetingRoom sx={{ fontSize: 15, color: divisionColor }} />
                                        <Typography sx={{ fontFamily: fontMono, fontWeight: 700, fontSize: "0.85rem", color: T.text }}>{res.room}</Typography>
                                        <Typography sx={{ fontFamily: fontBody, fontSize: "0.7rem", fontWeight: 700, color: divisionColor, ml: "auto", bgcolor: divisionLight, px: 0.8, py: 0.2, borderRadius: "4px" }}>{res.type}</Typography>
                                    </Box>
                                    <Box display="flex" pl={3.2}>
                                        <Typography sx={{ fontFamily: fontBody, fontSize: "0.75rem", color: T.textSub }}>{res.block}</Typography>
                                    </Box>
                                </Box>
                                <Box display="flex" flexDirection="column" gap={0.8}>
                                    <Box display="flex" alignItems="center" gap={1}>
                                        <Phone sx={{ fontSize: 14, color: T.textMute }} />
                                        <Typography sx={{ fontFamily: fontMono, fontSize: "0.8rem", color: T.textSub }}>{res.contact}</Typography>
                                    </Box>
                                    <Box display="flex" alignItems="center" gap={1}>
                                        <Email sx={{ fontSize: 14, color: T.textMute }} />
                                        <Typography sx={{ fontFamily: fontBody, fontSize: "0.8rem", color: T.textSub }} className="line-clamp-1">{res.email}</Typography>
                                    </Box>
                                </Box>
                            </Card>
                        </Grid>
                    );
                })}
                {filtered.length === 0 && (
                    <Grid item xs={12}>
                        <Box sx={{ py: 6, textAlign: "center", color: T.textMute }}>
                            <People sx={{ fontSize: 40, opacity: 0.5, mb: 1 }} />
                            <Typography sx={{ fontFamily: fontBody, fontSize: "0.9rem" }}>No residents found for the selected view.</Typography>
                        </Box>
                    </Grid>
                )}
            </Grid>
        </Box>
    );
}
