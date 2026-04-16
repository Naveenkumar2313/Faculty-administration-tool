import React, { useState } from "react";
import {
    Box, Card, Grid, Typography, Button, Table, TableBody, TableCell,
    TableHead, TableRow, Chip, FormControl, Select, MenuItem, Avatar,
    LinearProgress, Rating
} from "@mui/material";
import {
    Star, People, TrendingUp, Warning, FileDownload, Speed,
    CheckCircle, Schedule
} from "@mui/icons-material";
import { T, fontHead, fontBody, fontMono, Fonts, drivers, incidents } from "./transportAdminShared";

const SLabel = ({ children, sx = {} }) => (
    <Typography sx={{ fontFamily: fontBody, fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: T.textMute, mb: 0.5, ...sx }}>{children}</Typography>
);
const StatCard = ({ label, value, sub, color, icon: Icon, bgLight }) => (
    <Card className="fade-up" sx={{ p: 2.5, borderRadius: "14px", border: `1px solid ${T.border}`, background: T.surface, boxShadow: "0 1px 4px rgba(0,0,0,0.04)", height: "100%", transition: "all 0.25s ease", "&:hover": { transform: "translateY(-2px)", boxShadow: "0 4px 20px rgba(99,102,241,0.08)" } }}>
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

export default function DriverPerformance() {
    const [periodFilter, setPeriodFilter] = useState("This Month");

    // Generate performance data per driver
    const driverPerformance = drivers.map((d, i) => {
        const driverIncidents = incidents.filter(inc => inc.driverId === d.id);
        const punctuality = Math.floor(Math.random() * 15 + 80);
        const safetyScore = Math.max(50, 100 - driverIncidents.length * 15 - d.violations * 10);
        const feedbackScore = parseFloat(d.rating);
        const tripsCompleted = d.tripsToday * 25;
        const avgTripTime = Math.floor(Math.random() * 10 + 30);
        const fuelEfficiency = (Math.random() * 1.5 + 3).toFixed(1);
        const overall = Math.round(punctuality * 0.3 + safetyScore * 0.3 + (feedbackScore / 5 * 100) * 0.2 + (parseFloat(fuelEfficiency) / 5 * 100) * 0.2);
        return {
            ...d,
            punctuality,
            safetyScore,
            feedbackScore,
            tripsCompleted,
            avgTripTime: `${avgTripTime} min`,
            fuelEfficiency: `${fuelEfficiency} km/l`,
            incidentCount: driverIncidents.length,
            overall,
            rank: 0,
        };
    }).sort((a, b) => b.overall - a.overall).map((d, i) => ({ ...d, rank: i + 1 }));

    const avgRating = (drivers.reduce((a, d) => a + parseFloat(d.rating), 0) / drivers.length).toFixed(1);
    const avgPunctuality = Math.round(driverPerformance.reduce((a, d) => a + d.punctuality, 0) / driverPerformance.length);
    const avgSafety = Math.round(driverPerformance.reduce((a, d) => a + d.safetyScore, 0) / driverPerformance.length);
    const totalTrips = driverPerformance.reduce((a, d) => a + d.tripsCompleted, 0);

    return (
        <Box sx={{ p: 3, background: T.bg, minHeight: "100vh", fontFamily: fontBody }}>
            <style>{Fonts()}</style>

            <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3} className="fade-up">
                <Box>
                    <Typography sx={{ fontFamily: fontBody, fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: T.textMute, mb: 0.3 }}>Reports & Analytics</Typography>
                    <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1.5rem", color: T.text, lineHeight: 1.1 }}>Driver Performance</Typography>
                    <Typography sx={{ fontFamily: fontBody, fontSize: "0.82rem", color: T.textSub, mt: 0.4 }}>Rating, punctuality, safety score, trip stats, and incident breakdown.</Typography>
                </Box>
                <Box display="flex" gap={1.5}>
                    <FormControl size="small" sx={{ minWidth: 140 }}>
                        <Select value={periodFilter} onChange={e => setPeriodFilter(e.target.value)} sx={{ borderRadius: "8px", fontFamily: fontBody, fontSize: "0.8rem" }}>
                            <MenuItem value="This Week">This Week</MenuItem>
                            <MenuItem value="This Month">This Month</MenuItem>
                            <MenuItem value="This Quarter">This Quarter</MenuItem>
                        </Select>
                    </FormControl>
                    <Button variant="outlined" startIcon={<FileDownload sx={{ fontSize: 16 }} />} sx={{ fontFamily: fontBody, fontWeight: 600, fontSize: "0.8rem", textTransform: "none", borderRadius: "8px", borderColor: T.border, color: T.textSub }}>Export</Button>
                </Box>
            </Box>

            <Grid container spacing={2.5} mb={3}>
                <Grid item xs={6} sm={3}><StatCard label="Avg. Rating" value={avgRating} sub="Based on feedback" color={T.warning} bgLight={T.warningLight} icon={Star} /></Grid>
                <Grid item xs={6} sm={3}><StatCard label="Avg. Punctuality" value={`${avgPunctuality}%`} sub="On-time arrivals" color={T.success} bgLight={T.successLight} icon={Schedule} /></Grid>
                <Grid item xs={6} sm={3}><StatCard label="Avg. Safety Score" value={avgSafety} sub="Out of 100" color={T.info} bgLight={T.infoLight} icon={CheckCircle} /></Grid>
                <Grid item xs={6} sm={3}><StatCard label="Total Trips" value={totalTrips} sub={`${periodFilter}`} color={T.accent} bgLight={T.accentLight} icon={TrendingUp} /></Grid>
            </Grid>

            {/* Top Performers */}
            <Card className="fade-up" sx={{ borderRadius: "14px", border: `1px solid ${T.border}`, boxShadow: "0 1px 4px rgba(0,0,0,0.04)", mb: 3 }}>
                <Box sx={{ p: 2.5, borderBottom: `1px solid ${T.border}` }}>
                    <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1rem" }}>Driver Scorecards</Typography>
                    <Typography sx={{ fontFamily: fontBody, fontSize: "0.78rem", color: T.textMute }}>Ranked by overall performance score</Typography>
                </Box>
                <Grid container spacing={2.5} sx={{ p: 2.5 }}>
                    {driverPerformance.map(driver => (
                        <Grid item xs={12} sm={6} md={4} key={driver.id}>
                            <Card sx={{ p: 2, borderRadius: "12px", border: `1px solid ${driver.rank <= 3 ? T.accent + "40" : T.border}`, bgcolor: driver.rank <= 3 ? T.accentLight : T.surface, transition: "all 0.2s", "&:hover": { transform: "translateY(-2px)", boxShadow: "0 4px 12px rgba(0,0,0,0.06)" } }}>
                                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1.5}>
                                    <Box display="flex" alignItems="center" gap={1.5}>
                                        <Box sx={{ position: "relative" }}>
                                            <Avatar sx={{ width: 40, height: 40, bgcolor: driver.rank <= 3 ? T.accent : T.bg, color: driver.rank <= 3 ? "#fff" : T.textSub, fontFamily: fontBody, fontWeight: 700, fontSize: "0.8rem" }}>
                                                {driver.name.split(" ").map(n => n[0]).join("")}
                                            </Avatar>
                                            {driver.rank <= 3 && (
                                                <Box sx={{ position: "absolute", top: -4, right: -4, width: 16, height: 16, borderRadius: "50%", bgcolor: driver.rank === 1 ? "#FFD700" : driver.rank === 2 ? "#C0C0C0" : "#CD7F32", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                    <Typography sx={{ fontFamily: fontMono, fontSize: "0.5rem", fontWeight: 700, color: "#fff" }}>#{driver.rank}</Typography>
                                                </Box>
                                            )}
                                        </Box>
                                        <Box>
                                            <Typography sx={{ fontFamily: fontBody, fontWeight: 600, fontSize: "0.85rem", color: T.text }}>{driver.name}</Typography>
                                            <Typography sx={{ fontFamily: fontMono, fontSize: "0.68rem", color: T.textMute }}>{driver.id}</Typography>
                                        </Box>
                                    </Box>
                                    <Box sx={{ width: 44, height: 44, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", border: `3px solid ${driver.overall >= 80 ? T.success : driver.overall >= 60 ? T.warning : T.danger}`, bgcolor: driver.overall >= 80 ? T.successLight : driver.overall >= 60 ? T.warningLight : T.dangerLight }}>
                                        <Typography sx={{ fontFamily: fontMono, fontWeight: 700, fontSize: "0.78rem", color: driver.overall >= 80 ? T.success : driver.overall >= 60 ? T.warning : T.danger }}>{driver.overall}</Typography>
                                    </Box>
                                </Box>

                                <Box display="flex" alignItems="center" gap={0.5} mb={1.5}>
                                    <Rating value={driver.feedbackScore} precision={0.1} readOnly size="small" />
                                    <Typography sx={{ fontFamily: fontMono, fontSize: "0.72rem", color: T.textMute }}>{driver.feedbackScore}</Typography>
                                </Box>

                                {[
                                    { label: "Punctuality", value: driver.punctuality, color: driver.punctuality >= 85 ? T.success : T.warning },
                                    { label: "Safety Score", value: driver.safetyScore, color: driver.safetyScore >= 80 ? T.success : driver.safetyScore >= 60 ? T.warning : T.danger },
                                ].map(metric => (
                                    <Box key={metric.label} sx={{ mb: 1 }}>
                                        <Box display="flex" justifyContent="space-between" mb={0.3}>
                                            <Typography sx={{ fontFamily: fontBody, fontSize: "0.68rem", color: T.textMute }}>{metric.label}</Typography>
                                            <Typography sx={{ fontFamily: fontMono, fontSize: "0.68rem", fontWeight: 600, color: metric.color }}>{metric.value}%</Typography>
                                        </Box>
                                        <LinearProgress variant="determinate" value={metric.value}
                                            sx={{ height: 4, borderRadius: 2, bgcolor: T.border, "& .MuiLinearProgress-bar": { bgcolor: metric.color, borderRadius: 2 } }} />
                                    </Box>
                                ))}

                                <Box display="flex" justifyContent="space-between" mt={1.5}>
                                    <Typography sx={{ fontFamily: fontMono, fontSize: "0.65rem", color: T.textMute }}>{driver.tripsCompleted} trips</Typography>
                                    <Typography sx={{ fontFamily: fontMono, fontSize: "0.65rem", color: T.textMute }}>{driver.fuelEfficiency}</Typography>
                                    <Typography sx={{ fontFamily: fontMono, fontSize: "0.65rem", color: driver.incidentCount > 0 ? T.danger : T.success }}>
                                        {driver.incidentCount > 0 ? `${driver.incidentCount} incidents` : "No incidents"}
                                    </Typography>
                                </Box>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Card>

            {/* Detailed Table */}
            <Card className="fade-up" sx={{ borderRadius: "14px", border: `1px solid ${T.border}`, boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                <Box sx={{ p: 2.5, borderBottom: `1px solid ${T.border}` }}>
                    <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1rem" }}>Detailed Performance Metrics</Typography>
                </Box>
                <Box sx={{ overflowX: "auto" }}>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ bgcolor: "#F9FAFB" }}>
                                {["Rank", "Driver", "Rating", "Punctuality", "Safety", "Trips", "Avg. Trip", "Fuel Eff.", "Incidents", "Overall"].map(h => (
                                    <TableCell key={h} sx={{ fontFamily: fontBody, fontWeight: 700, fontSize: "0.72rem", color: T.textMute, textTransform: "uppercase", py: 1.5, whiteSpace: "nowrap" }}>{h}</TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {driverPerformance.map(driver => (
                                <TableRow key={driver.id} className="row-hover" sx={{ bgcolor: driver.rank <= 3 ? `${T.accentLight}50` : "transparent" }}>
                                    <TableCell>
                                        <Chip label={`#${driver.rank}`} size="small" sx={{ fontFamily: fontMono, fontSize: "0.72rem", fontWeight: 700, bgcolor: driver.rank <= 3 ? T.accentLight : T.bg, color: driver.rank <= 3 ? T.accent : T.textSub, height: 24 }} />
                                    </TableCell>
                                    <TableCell>
                                        <Box display="flex" alignItems="center" gap={1}>
                                            <Avatar sx={{ width: 28, height: 28, bgcolor: T.accentLight, color: T.accent, fontFamily: fontBody, fontWeight: 700, fontSize: "0.6rem" }}>
                                                {driver.name.split(" ").map(n => n[0]).join("")}
                                            </Avatar>
                                            <Box>
                                                <Typography sx={{ fontFamily: fontBody, fontWeight: 600, fontSize: "0.82rem", color: T.text }}>{driver.name}</Typography>
                                                <Typography sx={{ fontFamily: fontMono, fontSize: "0.65rem", color: T.textMute }}>{driver.id}</Typography>
                                            </Box>
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Box display="flex" alignItems="center" gap={0.3}>
                                            <Star sx={{ fontSize: 14, color: T.warning }} />
                                            <Typography sx={{ fontFamily: fontMono, fontSize: "0.82rem", fontWeight: 600, color: T.text }}>{driver.rating}</Typography>
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Chip label={`${driver.punctuality}%`} size="small" sx={{ fontFamily: fontMono, fontSize: "0.7rem", fontWeight: 700, bgcolor: driver.punctuality >= 85 ? T.successLight : T.warningLight, color: driver.punctuality >= 85 ? T.success : T.warning, height: 24 }} />
                                    </TableCell>
                                    <TableCell>
                                        <Chip label={driver.safetyScore} size="small" sx={{ fontFamily: fontMono, fontSize: "0.7rem", fontWeight: 700, bgcolor: driver.safetyScore >= 80 ? T.successLight : driver.safetyScore >= 60 ? T.warningLight : T.dangerLight, color: driver.safetyScore >= 80 ? T.success : driver.safetyScore >= 60 ? T.warning : T.danger, height: 24 }} />
                                    </TableCell>
                                    <TableCell sx={{ fontFamily: fontMono, fontSize: "0.82rem", color: T.text, fontWeight: 600 }}>{driver.tripsCompleted}</TableCell>
                                    <TableCell sx={{ fontFamily: fontMono, fontSize: "0.82rem", color: T.textSub }}>{driver.avgTripTime}</TableCell>
                                    <TableCell sx={{ fontFamily: fontMono, fontSize: "0.82rem", color: T.textSub }}>{driver.fuelEfficiency}</TableCell>
                                    <TableCell>
                                        <Chip label={driver.incidentCount} size="small" sx={{ fontFamily: fontMono, fontSize: "0.7rem", fontWeight: 700, bgcolor: driver.incidentCount > 0 ? T.dangerLight : T.successLight, color: driver.incidentCount > 0 ? T.danger : T.success, height: 24 }} />
                                    </TableCell>
                                    <TableCell>
                                        <Chip label={driver.overall} size="small" sx={{ fontFamily: fontMono, fontSize: "0.72rem", fontWeight: 700, bgcolor: driver.overall >= 80 ? T.successLight : driver.overall >= 60 ? T.warningLight : T.dangerLight, color: driver.overall >= 80 ? T.success : driver.overall >= 60 ? T.warning : T.danger, height: 26, minWidth: 40 }} />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Box>
            </Card>
        </Box>
    );
}
