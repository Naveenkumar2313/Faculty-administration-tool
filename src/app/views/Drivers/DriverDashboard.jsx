import React from "react";
import { Box, Card, Grid, Typography, Button, Avatar, LinearProgress, Chip } from "@mui/material";
import { DepartureBoard, AccessTime, Route, MinorCrash, DirectionsBus, Assignment, WarningAmber } from "@mui/icons-material";
import { T, fontHead, fontBody, fontMono, Fonts, currentUser, todaySchedule, reportedIncidents } from "./driverShared";

const SLabel = ({ children }) => (
    <Typography sx={{ fontFamily: fontBody, fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: T.textMute, mb: 0.5 }}>{children}</Typography>
);

const StatCard = ({ label, value, sub, color, icon: Icon }) => (
    <Card className="fade-up" sx={{ p: 2.5, borderRadius: "14px", border: `1px solid ${T.border}`, background: T.surface, boxShadow: "0 1px 4px rgba(0,0,0,0.04)", height: "100%" }}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
            <Box>
                <SLabel>{label}</SLabel>
                <Typography sx={{ fontFamily: fontMono, fontWeight: 700, fontSize: "1.8rem", color: color || T.text, lineHeight: 1.1 }}>{value}</Typography>
                {sub && <Typography sx={{ fontFamily: fontBody, fontSize: "0.72rem", color: T.textMute, mt: 0.4 }}>{sub}</Typography>}
            </Box>
            {Icon && <Box sx={{ p: 1.2, borderRadius: "10px", bgcolor: `${color}15`, color: color }}><Icon sx={{ fontSize: 22 }} /></Box>}
        </Box>
    </Card>
);

export default function DriverDashboard() {
    return (
        <Box sx={{ p: 3, background: T.bg, minHeight: "100vh", fontFamily: fontBody }}>
            <style>{Fonts()}</style>

            <Box display="flex" justifyContent="space-between" alignItems="flex-end" mb={4} className="fade-up">
                <Box display="flex" alignItems="center" gap={2}>
                    <Avatar sx={{ width: 64, height: 64, bgcolor: T.accentLight, color: T.accent, fontFamily: fontHead, fontWeight: 700, fontSize: "1.5rem" }}>
                        {currentUser.name.split(" ").map(n => n[0]).join("")}
                    </Avatar>
                    <Box>
                        <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1.8rem", color: T.text, lineHeight: 1.2 }}>Welcome, {currentUser.name}</Typography>
                        <Typography sx={{ fontFamily: fontMono, fontSize: "0.85rem", color: T.textSub, mt: 0.2 }}>{currentUser.id} • {currentUser.busAssigned}</Typography>
                    </Box>
                </Box>
                <Button variant="contained" sx={{ bgcolor: T.success, textTransform: "none", fontFamily: fontBody, fontWeight: 700, borderRadius: "8px", boxShadow: "none" }} startIcon={<Assignment />}>
                    Pre-Trip Inspection
                </Button>
            </Box>

            <Grid container spacing={2.5} mb={4}>
                <Grid item xs={6} md={3}><StatCard label="Today's Trips" value="2" sub="1 Completed" color={T.accent} icon={Route} /></Grid>
                <Grid item xs={6} md={3}><StatCard label="Next Trip" value="12:15 PM" sub="Campus Main Gate" color={T.info} icon={AccessTime} /></Grid>
                <Grid item xs={6} md={3}><StatCard label="My Rating" value={currentUser.rating} sub="Avg Feedback" color={T.warning} icon={StarIcon} /></Grid>
                <Grid item xs={6} md={3}><StatCard label="Fuel Efficiency" value="4.5" sub="km/litre" color={T.success} icon={DirectionsBus} /></Grid>
            </Grid>

            <Grid container spacing={3}>
                <Grid item xs={12} md={7}>
                    <Card className="fade-up" sx={{ p: 3, borderRadius: "14px", border: `1px solid ${T.border}`, boxShadow: "0 1px 4px rgba(0,0,0,0.04)", height: "100%" }}>
                        <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1.1rem", mb: 2 }}>Today's Schedule</Typography>
                        {todaySchedule.map(trip => (
                            <Box key={trip.tripId} sx={{ p: 2, mb: 1.5, border: `1px solid ${T.border}`, borderRadius: "10px", display: "flex", justifyContent: "space-between", alignItems: "center", bgcolor: trip.status === "Completed" ? T.bg : T.surface }}>
                                <Box display="flex" gap={2} alignItems="center">
                                    <Box sx={{ width: 48, height: 48, borderRadius: "10px", bgcolor: trip.type === 'Pickup' ? T.infoLight : T.purpleLight, color: trip.type === 'Pickup' ? T.info : T.purple, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        <DepartureBoard />
                                    </Box>
                                    <Box>
                                        <Typography sx={{ fontFamily: fontBody, fontWeight: 700, fontSize: "0.95rem", color: T.text }}>{trip.type} - {trip.time}</Typography>
                                        <Typography sx={{ fontFamily: fontBody, fontSize: "0.8rem", color: T.textSub }}>{trip.start} ➝ {trip.end}</Typography>
                                    </Box>
                                </Box>
                                <Chip label={trip.status} size="small" sx={{ fontFamily: fontMono, fontSize: "0.7rem", fontWeight: 700, bgcolor: trip.status === "Completed" ? T.successLight : T.warningLight, color: trip.status === "Completed" ? T.success : T.warning }} />
                            </Box>
                        ))}
                    </Card>
                </Grid>
                <Grid item xs={12} md={5}>
                    <Card className="fade-up" sx={{ p: 3, borderRadius: "14px", border: `1px solid ${T.border}`, boxShadow: "0 1px 4px rgba(0,0,0,0.04)", height: "100%", style: { animationDelay: '0.1s' } }}>
                        <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1.1rem", mb: 2 }}>Recent Alerts & Notifications</Typography>
                        <Box sx={{ mb: 2, p: 2, borderRadius: "10px", bgcolor: T.warningLight, border: `1px solid ${T.warning}30` }}>
                            <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                                <WarningAmber sx={{ fontSize: 18, color: T.warning }} />
                                <Typography sx={{ fontFamily: fontBody, fontWeight: 700, fontSize: "0.85rem", color: T.warning }}>Speeding Warning</Typography>
                            </Box>
                            <Typography sx={{ fontFamily: fontBody, fontSize: "0.8rem", color: T.textSub }}>You exceeded the speed limit on Agara junction yesterday at 07:15 AM. Please maintain speed limits.</Typography>
                        </Box>
                        <Box sx={{ p: 2, borderRadius: "10px", bgcolor: T.infoLight, border: `1px solid ${T.info}30` }}>
                            <Typography sx={{ fontFamily: fontBody, fontWeight: 700, fontSize: "0.85rem", color: T.info, mb: 0.5 }}>Route Deviation Alert</Typography>
                            <Typography sx={{ fontFamily: fontBody, fontSize: "0.8rem", color: T.textSub }}>Route 4 has a scheduled road block near HSR BDA complex. Follow alternate route via Sector 3.</Typography>
                        </Box>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}

function StarIcon(props) {
    return (
        <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
        </svg>
    )
}
