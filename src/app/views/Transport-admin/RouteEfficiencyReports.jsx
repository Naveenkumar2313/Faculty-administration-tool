import React, { useState } from "react";
import {
    Box, Card, Grid, Typography, Button, Table, TableBody, TableCell,
    TableHead, TableRow, Chip, FormControl, Select, MenuItem, LinearProgress
} from "@mui/material";
import {
    Route, Speed, People, AccessTime, TrendingUp, FileDownload,
    CheckCircle, Warning
} from "@mui/icons-material";
import { T, fontHead, fontBody, fontMono, Fonts, routes, liveTracking } from "./transportAdminShared";

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

export default function RouteEfficiencyReports() {
    const [periodFilter, setPeriodFilter] = useState("This Month");

    // Generate efficiency data per route
    const routeEfficiency = routes.map((r, i) => {
        const onTimePct = Math.floor(Math.random() * 20 + 75);
        const avgSpeed = Math.floor(Math.random() * 15 + 25);
        const avgDuration = parseInt(r.duration);
        const utilisation = Math.floor(Math.random() * 30 + 55);
        const fuelEfficiency = (Math.random() * 2 + 3).toFixed(1);
        const dailyTrips = Math.floor(Math.random() * 6) + 4;
        const stopsPerTrip = r.stops;
        const busRelated = liveTracking.find(b => b.route === r.name);
        return {
            ...r,
            onTimePct,
            avgSpeed: `${avgSpeed} km/h`,
            avgDuration: `${avgDuration} min`,
            utilisation,
            fuelEfficiency: `${fuelEfficiency} km/l`,
            dailyTrips,
            score: Math.round(onTimePct * 0.4 + utilisation * 0.3 + (parseFloat(fuelEfficiency) / 5 * 100) * 0.3),
            avgPassengers: busRelated ? busRelated.passengers : Math.floor(Math.random() * 30) + 10,
        };
    });

    const avgOnTime = Math.round(routeEfficiency.reduce((a, r) => a + r.onTimePct, 0) / routeEfficiency.length);
    const avgUtilisation = Math.round(routeEfficiency.reduce((a, r) => a + r.utilisation, 0) / routeEfficiency.length);
    const topRoute = routeEfficiency.sort((a, b) => b.score - a.score)[0];
    const totalDailyTrips = routeEfficiency.reduce((a, r) => a + r.dailyTrips, 0);

    return (
        <Box sx={{ p: 3, background: T.bg, minHeight: "100vh", fontFamily: fontBody }}>
            <style>{Fonts()}</style>

            <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3} className="fade-up">
                <Box>
                    <Typography sx={{ fontFamily: fontBody, fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: T.textMute, mb: 0.3 }}>Reports & Analytics</Typography>
                    <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1.5rem", color: T.text, lineHeight: 1.1 }}>Route Efficiency Reports</Typography>
                    <Typography sx={{ fontFamily: fontBody, fontSize: "0.82rem", color: T.textSub, mt: 0.4 }}>Average trip time, on-time percentage, and passenger load per route.</Typography>
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
                <Grid item xs={6} sm={3}><StatCard label="Avg. On-Time" value={`${avgOnTime}%`} sub="Fleet punctuality" color={T.success} bgLight={T.successLight} icon={AccessTime} /></Grid>
                <Grid item xs={6} sm={3}><StatCard label="Avg. Utilisation" value={`${avgUtilisation}%`} sub="Seat occupancy" color={T.accent} bgLight={T.accentLight} icon={People} /></Grid>
                <Grid item xs={6} sm={3}><StatCard label="Top Route" value={topRoute.id} sub={`Score: ${topRoute.score}/100`} color={T.info} bgLight={T.infoLight} icon={Route} /></Grid>
                <Grid item xs={6} sm={3}><StatCard label="Total Daily Trips" value={totalDailyTrips} sub="Across all routes" color={T.warning} bgLight={T.warningLight} icon={TrendingUp} /></Grid>
            </Grid>

            {/* Efficiency Scorecards */}
            <Card className="fade-up" sx={{ borderRadius: "14px", border: `1px solid ${T.border}`, boxShadow: "0 1px 4px rgba(0,0,0,0.04)", mb: 3 }}>
                <Box sx={{ p: 2.5, borderBottom: `1px solid ${T.border}` }}>
                    <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1rem" }}>Route Efficiency Scores</Typography>
                    <Typography sx={{ fontFamily: fontBody, fontSize: "0.78rem", color: T.textMute }}>Combined score based on on-time%, utilisation%, and fuel efficiency</Typography>
                </Box>
                <Grid container spacing={2.5} sx={{ p: 2.5 }}>
                    {routeEfficiency.sort((a, b) => b.score - a.score).map(route => (
                        <Grid item xs={12} sm={6} md={4} key={route.id}>
                            <Card sx={{ p: 2, borderRadius: "12px", border: `1px solid ${T.border}`, transition: "all 0.2s", "&:hover": { transform: "translateY(-2px)", boxShadow: "0 4px 12px rgba(0,0,0,0.06)" } }}>
                                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1.5}>
                                    <Box>
                                        <Typography sx={{ fontFamily: fontMono, fontWeight: 700, fontSize: "0.82rem", color: T.text }}>{route.id}</Typography>
                                        <Typography sx={{ fontFamily: fontBody, fontSize: "0.72rem", color: T.textSub }} noWrap>{route.name}</Typography>
                                    </Box>
                                    <Box sx={{ width: 44, height: 44, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", border: `3px solid ${route.score >= 80 ? T.success : route.score >= 60 ? T.warning : T.danger}`, bgcolor: route.score >= 80 ? T.successLight : route.score >= 60 ? T.warningLight : T.dangerLight }}>
                                        <Typography sx={{ fontFamily: fontMono, fontWeight: 700, fontSize: "0.78rem", color: route.score >= 80 ? T.success : route.score >= 60 ? T.warning : T.danger }}>{route.score}</Typography>
                                    </Box>
                                </Box>
                                {[
                                    { label: "On-Time", value: route.onTimePct, color: route.onTimePct >= 85 ? T.success : T.warning },
                                    { label: "Utilisation", value: route.utilisation, color: route.utilisation >= 70 ? T.success : T.warning },
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
                                <Box display="flex" justifyContent="space-between" mt={1}>
                                    <Typography sx={{ fontFamily: fontMono, fontSize: "0.65rem", color: T.textMute }}>{route.fuelEfficiency}</Typography>
                                    <Typography sx={{ fontFamily: fontMono, fontSize: "0.65rem", color: T.textMute }}>{route.dailyTrips} trips/day</Typography>
                                    <Typography sx={{ fontFamily: fontMono, fontSize: "0.65rem", color: T.textMute }}>{route.avgPassengers} pax avg.</Typography>
                                </Box>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Card>

            {/* Detailed Table */}
            <Card className="fade-up" sx={{ borderRadius: "14px", border: `1px solid ${T.border}`, boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                <Box sx={{ p: 2.5, borderBottom: `1px solid ${T.border}` }}>
                    <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1rem" }}>Detailed Metrics</Typography>
                </Box>
                <Box sx={{ overflowX: "auto" }}>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ bgcolor: "#F9FAFB" }}>
                                {["Route", "Stops", "Distance", "Avg. Duration", "On-Time %", "Utilisation %", "Fuel Eff.", "Daily Trips", "Score"].map(h => (
                                    <TableCell key={h} sx={{ fontFamily: fontBody, fontWeight: 700, fontSize: "0.72rem", color: T.textMute, textTransform: "uppercase", py: 1.5, whiteSpace: "nowrap" }}>{h}</TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {routeEfficiency.sort((a, b) => b.score - a.score).map(route => (
                                <TableRow key={route.id} className="row-hover">
                                    <TableCell>
                                        <Typography sx={{ fontFamily: fontBody, fontWeight: 600, fontSize: "0.82rem", color: T.text }}>{route.name}</Typography>
                                        <Typography sx={{ fontFamily: fontMono, fontSize: "0.68rem", color: T.textMute }}>{route.id}</Typography>
                                    </TableCell>
                                    <TableCell sx={{ fontFamily: fontMono, fontSize: "0.82rem", color: T.text }}>{route.stops}</TableCell>
                                    <TableCell sx={{ fontFamily: fontMono, fontSize: "0.82rem", color: T.textSub }}>{route.distance}</TableCell>
                                    <TableCell sx={{ fontFamily: fontMono, fontSize: "0.82rem", color: T.textSub }}>{route.avgDuration}</TableCell>
                                    <TableCell>
                                        <Chip label={`${route.onTimePct}%`} size="small" sx={{ fontFamily: fontMono, fontSize: "0.72rem", fontWeight: 700, bgcolor: route.onTimePct >= 85 ? T.successLight : T.warningLight, color: route.onTimePct >= 85 ? T.success : T.warning, height: 24 }} />
                                    </TableCell>
                                    <TableCell>
                                        <Chip label={`${route.utilisation}%`} size="small" sx={{ fontFamily: fontMono, fontSize: "0.72rem", fontWeight: 700, bgcolor: route.utilisation >= 70 ? T.successLight : T.warningLight, color: route.utilisation >= 70 ? T.success : T.warning, height: 24 }} />
                                    </TableCell>
                                    <TableCell sx={{ fontFamily: fontMono, fontSize: "0.82rem", color: T.textSub }}>{route.fuelEfficiency}</TableCell>
                                    <TableCell sx={{ fontFamily: fontMono, fontSize: "0.82rem", color: T.text, fontWeight: 600 }}>{route.dailyTrips}</TableCell>
                                    <TableCell>
                                        <Chip label={route.score} size="small" sx={{ fontFamily: fontMono, fontSize: "0.72rem", fontWeight: 700, bgcolor: route.score >= 80 ? T.successLight : route.score >= 60 ? T.warningLight : T.dangerLight, color: route.score >= 80 ? T.success : route.score >= 60 ? T.warning : T.danger, height: 24 }} />
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
