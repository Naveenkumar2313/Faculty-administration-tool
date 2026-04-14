import React from "react";
import {
    Box, Card, Grid, Typography, LinearProgress, Divider
} from "@mui/material";
import { Home, BuildCircle, Person } from "@mui/icons-material";

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
    .fade-up { animation: fadeUp 0.3s ease both; }
  `}</style>
);

const MOCK_DATA = [
    { name: "Boys Hostel A", total: 100, occupied: 85, maintenance: 5 },
    { name: "Girls Hostel B", total: 150, occupied: 140, maintenance: 2 },
    { name: "Boys Hostel C", total: 120, occupied: 60, maintenance: 10 },
];

export default function OccupancyStatus() {
    const totalCapacity = MOCK_DATA.reduce((acc, curr) => acc + curr.total, 0);
    const totalOccupied = MOCK_DATA.reduce((acc, curr) => acc + curr.occupied, 0);
    const totalMaintenance = MOCK_DATA.reduce((acc, curr) => acc + curr.maintenance, 0);
    const totalVacant = totalCapacity - totalOccupied - totalMaintenance;

    return (
        <Box sx={{ p: 3, background: T.bg, minHeight: "100vh", fontFamily: fontBody }}>
            <Fonts />
            <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3} className="fade-up">
                <Box>
                    <Typography sx={{ fontFamily: fontBody, fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: T.textMute, mb: 0.3 }}>Resident Management</Typography>
                    <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1.5rem", color: T.text, lineHeight: 1.1 }}>Occupancy Status</Typography>
                    <Typography sx={{ fontFamily: fontBody, fontSize: "0.82rem", color: T.textSub, mt: 0.4 }}>Real-time view of vacant, occupied, and maintenance-blocked rooms.</Typography>
                </Box>
            </Box>

            <Grid container spacing={3} mb={3} className="fade-up">
                <Grid item xs={12} md={3}>
                    <Card sx={{ p: 2.5, borderRadius: "14px", border: `1px solid ${T.border}`, boxShadow: "0 1px 4px rgba(0,0,0,0.04)", height: "100%" }}>
                        <Typography sx={{ fontFamily: fontBody, fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", color: T.textMute, mb: 1 }}>Overall Occupancy</Typography>
                        <Box display="flex" alignItems="flex-end" gap={1} mb={2}>
                            <Typography sx={{ fontFamily: fontMono, fontWeight: 700, fontSize: "2.5rem", color: T.text, lineHeight: 1 }}>{Math.round((totalOccupied / totalCapacity) * 100)}<span style={{ fontSize: "1.5rem", color: T.textMute }}>%</span></Typography>
                        </Box>
                        <LinearProgress variant="determinate" value={(totalOccupied / totalCapacity) * 100} sx={{ height: 6, borderRadius: 3, bgcolor: T.border, "& .MuiLinearProgress-bar": { bgcolor: T.accent, borderRadius: 3 } }} />
                    </Card>
                </Grid>
                <Grid item xs={12} md={9}>
                    <Card sx={{ p: 2.5, borderRadius: "14px", border: `1px solid ${T.border}`, boxShadow: "0 1px 4px rgba(0,0,0,0.04)", height: "100%" }}>
                        <Grid container spacing={2} sx={{ height: "100%", alignItems: "center" }}>
                            <Grid item xs={4}>
                                <Box display="flex" alignItems="center" gap={1.5}>
                                    <Box sx={{ p: 1.2, borderRadius: "10px", bgcolor: T.successLight, color: T.success }}><Person /></Box>
                                    <Box>
                                        <Typography sx={{ fontFamily: fontMono, fontWeight: 700, fontSize: "1.4rem", color: T.success, lineHeight: 1.2 }}>{totalOccupied}</Typography>
                                        <Typography sx={{ fontFamily: fontBody, fontSize: "0.75rem", color: T.textMute }}>Occupied Rooms</Typography>
                                    </Box>
                                </Box>
                            </Grid>
                            <Grid item xs={4}>
                                <Box display="flex" alignItems="center" gap={1.5}>
                                    <Box sx={{ p: 1.2, borderRadius: "10px", bgcolor: T.infoLight, color: T.info }}><Home /></Box>
                                    <Box>
                                        <Typography sx={{ fontFamily: fontMono, fontWeight: 700, fontSize: "1.4rem", color: T.info, lineHeight: 1.2 }}>{totalVacant}</Typography>
                                        <Typography sx={{ fontFamily: fontBody, fontSize: "0.75rem", color: T.textMute }}>Vacant Rooms</Typography>
                                    </Box>
                                </Box>
                            </Grid>
                            <Grid item xs={4}>
                                <Box display="flex" alignItems="center" gap={1.5}>
                                    <Box sx={{ p: 1.2, borderRadius: "10px", bgcolor: T.warningLight, color: T.warning }}><BuildCircle /></Box>
                                    <Box>
                                        <Typography sx={{ fontFamily: fontMono, fontWeight: 700, fontSize: "1.4rem", color: T.warning, lineHeight: 1.2 }}>{totalMaintenance}</Typography>
                                        <Typography sx={{ fontFamily: fontBody, fontSize: "0.75rem", color: T.textMute }}>Under Maintenance</Typography>
                                    </Box>
                                </Box>
                            </Grid>
                        </Grid>
                    </Card>
                </Grid>
            </Grid>

            <Grid container spacing={3} className="fade-up">
                {MOCK_DATA.map((data, idx) => {
                    const vacant = data.total - data.occupied - data.maintenance;
                    return (
                        <Grid item xs={12} md={4} key={idx}>
                            <Card sx={{ p: 2.5, borderRadius: "14px", border: `1px solid ${T.border}`, boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                                <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1.1rem", color: T.text, mb: 2 }}>{data.name}</Typography>

                                <Box mb={2}>
                                    <Box display="flex" justifyContent="space-between" mb={0.5}>
                                        <Typography sx={{ fontFamily: fontBody, fontSize: "0.78rem", color: T.textSub }}>Occupied ({Math.round(data.occupied / data.total * 100)}%)</Typography>
                                        <Typography sx={{ fontFamily: fontMono, fontSize: "0.8rem", fontWeight: 700 }}>{data.occupied}</Typography>
                                    </Box>
                                    <LinearProgress variant="determinate" value={(data.occupied / data.total) * 100} sx={{ height: 6, borderRadius: 3, bgcolor: T.border, "& .MuiLinearProgress-bar": { bgcolor: T.success, borderRadius: 3 } }} />
                                </Box>
                                <Box mb={2}>
                                    <Box display="flex" justifyContent="space-between" mb={0.5}>
                                        <Typography sx={{ fontFamily: fontBody, fontSize: "0.78rem", color: T.textSub }}>Vacant ({Math.round(vacant / data.total * 100)}%)</Typography>
                                        <Typography sx={{ fontFamily: fontMono, fontSize: "0.8rem", fontWeight: 700 }}>{vacant}</Typography>
                                    </Box>
                                    <LinearProgress variant="determinate" value={(vacant / data.total) * 100} sx={{ height: 6, borderRadius: 3, bgcolor: T.border, "& .MuiLinearProgress-bar": { bgcolor: T.info, borderRadius: 3 } }} />
                                </Box>
                                <Box>
                                    <Box display="flex" justifyContent="space-between" mb={0.5}>
                                        <Typography sx={{ fontFamily: fontBody, fontSize: "0.78rem", color: T.textSub }}>Maintenance ({Math.round(data.maintenance / data.total * 100)}%)</Typography>
                                        <Typography sx={{ fontFamily: fontMono, fontSize: "0.8rem", fontWeight: 700 }}>{data.maintenance}</Typography>
                                    </Box>
                                    <LinearProgress variant="determinate" value={(data.maintenance / data.total) * 100} sx={{ height: 6, borderRadius: 3, bgcolor: T.border, "& .MuiLinearProgress-bar": { bgcolor: T.warning, borderRadius: 3 } }} />
                                </Box>

                                <Divider sx={{ my: 2 }} />
                                <Box display="flex" justifyContent="space-between">
                                    <Typography sx={{ fontFamily: fontBody, fontSize: "0.8rem", fontWeight: 600, color: T.textMute }}>Total Capacity</Typography>
                                    <Typography sx={{ fontFamily: fontMono, fontSize: "0.9rem", fontWeight: 700, color: T.text }}>{data.total} Rooms</Typography>
                                </Box>
                            </Card>
                        </Grid>
                    );
                })}
            </Grid>
        </Box>
    );
}
