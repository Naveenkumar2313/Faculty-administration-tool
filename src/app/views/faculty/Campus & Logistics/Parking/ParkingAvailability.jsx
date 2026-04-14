import React from "react";
import {
    Box, Card, Grid, Typography, LinearProgress, IconButton, Tooltip
} from "@mui/material";
import {
    Place, CarCrash, Sync, LocalParking
} from "@mui/icons-material";

/* ── Design Tokens ── */
const T = {
    bg: "#F5F7FA", surface: "#FFFFFF", border: "#E4E8EF", text: "#111827", textSub: "#4B5563", textMute: "#9CA3AF",
    accent: "#6366F1", accentLight: "#EEF2FF", success: "#10B981", successLight: "#ECFDF5",
    warning: "#F59E0B", warningLight: "#FFFBEB", orange: "#F97316", danger: "#EF4444", dangerLight: "#FEF2F2",
    info: "#3B82F6", infoLight: "#EFF6FF"
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

const zones = [
    { id: "pz-1", name: "North Block Parking", location: "Near Gate 1", type: "Staff", vehicleType: "4-Wheeler", totalSpots: 50, occupiedSpots: 28, status: "Active" },
    { id: "pz-4", name: "Underground Parking", location: "Admin Block", type: "Staff", vehicleType: "4-Wheeler", totalSpots: 100, occupiedSpots: 95, status: "Active" },
    { id: "pz-5", name: "Faculty Zone East", location: "Near Library", type: "Faculty", vehicleType: "2-Wheeler", totalSpots: 40, occupiedSpots: 15, status: "Active" }
];

export default function ParkingAvailability() {
    return (
        <Box sx={{ p: 3, background: T.bg, minHeight: "100vh", fontFamily: fontBody }}>
            <Fonts />
            <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3} className="fade-up">
                <Box>
                    <Typography sx={{ fontFamily: fontBody, fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: T.textMute, mb: 0.3 }}>Campus Logistics</Typography>
                    <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1.5rem", color: T.text, lineHeight: 1.1 }}>Parking Availability</Typography>
                    <Typography sx={{ fontFamily: fontBody, fontSize: "0.82rem", color: T.textSub, mt: 0.4 }}>Live view of available spots in faculty-designated zones.</Typography>
                </Box>
                <Tooltip title="Refresh Data">
                    <IconButton sx={{ bgcolor: T.surface, border: `1px solid ${T.border}` }}><Sync sx={{ color: T.textSub }} /></IconButton>
                </Tooltip>
            </Box>

            <Grid container spacing={3} className="fade-up">
                {zones.map(zone => {
                    const zoneOccupancy = Math.round((zone.occupiedSpots / zone.totalSpots) * 100);
                    const isFull = zoneOccupancy >= 100;
                    const isAlmostFull = zoneOccupancy >= 85 && !isFull;
                    const progressColor = isFull ? T.danger : isAlmostFull ? T.orange : T.success;

                    return (
                        <Grid item xs={12} md={6} lg={4} key={zone.id}>
                            <Card sx={{ borderRadius: "14px", border: `1px solid ${T.border}`, boxShadow: "0 1px 4px rgba(0,0,0,0.04)", overflow: "hidden" }}>
                                <Box sx={{ p: 2.5 }}>
                                    <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                                        <Box display="flex" alignItems="center" gap={1.5}>
                                            <Box sx={{ p: 1.2, borderRadius: "10px", bgcolor: isFull ? T.dangerLight : (isAlmostFull ? T.warningLight : T.successLight), color: progressColor }}>
                                                <LocalParking sx={{ fontSize: 24 }} />
                                            </Box>
                                            <Box>
                                                <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1.1rem", color: T.text }}>{zone.name}</Typography>
                                                <Typography sx={{ px: 1, py: 0.2, mt: 0.5, borderRadius: "4px", fontSize: "0.65rem", fontWeight: 700, bgcolor: T.accentLight, color: T.accent, display: "inline-block" }}>
                                                    {zone.type}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Box>

                                    <Box display="flex" flexDirection="column" gap={1} mb={3}>
                                        <Box display="flex" alignItems="center" gap={1}><Place sx={{ fontSize: 16, color: T.textMute }} /><Typography sx={{ fontFamily: fontBody, fontSize: "0.85rem", color: T.textSub }}>{zone.location}</Typography></Box>
                                        <Box display="flex" alignItems="center" gap={1}><CarCrash sx={{ fontSize: 16, color: T.textMute }} /><Typography sx={{ fontFamily: fontBody, fontSize: "0.85rem", color: T.textSub }}>Vehicle: {zone.vehicleType}</Typography></Box>
                                    </Box>

                                    <Box sx={{ p: 2, bgcolor: T.bg, borderRadius: "10px", border: `1px solid ${T.border}` }}>
                                        <Box display="flex" justifyContent="space-between" mb={1}>
                                            <Typography sx={{ fontFamily: fontBody, fontSize: "0.8rem", fontWeight: 600, color: T.textSub }}>Available Spots</Typography>
                                            <Typography sx={{ fontFamily: fontMono, fontSize: "1.2rem", fontWeight: 700, color: progressColor }}>
                                                {zone.totalSpots - zone.occupiedSpots} <span style={{ fontSize: "0.8rem", color: T.textMute }}>/ {zone.totalSpots}</span>
                                            </Typography>
                                        </Box>
                                        <LinearProgress variant="determinate" value={Math.min(zoneOccupancy, 100)} sx={{ height: 10, borderRadius: "5px", bgcolor: "#E4E8EF", "& .MuiLinearProgress-bar": { borderRadius: "5px", bgcolor: progressColor } }} />
                                        <Box display="flex" justifyContent="space-between" mt={1}>
                                            <Typography sx={{ fontFamily: fontBody, fontSize: "0.75rem", color: T.textMute }}>{zoneOccupancy}% Occupied</Typography>
                                            {isFull && <Typography sx={{ fontFamily: fontBody, fontSize: "0.75rem", fontWeight: 700, color: T.danger }}>Full</Typography>}
                                            {isAlmostFull && <Typography sx={{ fontFamily: fontBody, fontSize: "0.75rem", fontWeight: 700, color: T.orange }}>Filling Fast</Typography>}
                                            {!isFull && !isAlmostFull && <Typography sx={{ fontFamily: fontBody, fontSize: "0.75rem", fontWeight: 700, color: T.success }}>Plenty Available</Typography>}
                                        </Box>
                                    </Box>
                                </Box>
                            </Card>
                        </Grid>
                    );
                })}
            </Grid>
        </Box>
    );
}
