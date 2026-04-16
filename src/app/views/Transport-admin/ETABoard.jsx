import React, { useState, useEffect } from "react";
import {
    Box, Card, Grid, Typography, Chip, Table, TableBody, TableCell,
    TableHead, TableRow, IconButton, Tooltip, FormControl, Select, MenuItem,
    LinearProgress
} from "@mui/material";
import {
    AccessTime, FiberManualRecord, Speed, People, DirectionsBus,
    Refresh, CheckCircle, Warning
} from "@mui/icons-material";
import { T, fontHead, fontBody, fontMono, Fonts, liveTracking, routes, statusColors } from "./transportAdminShared";

const SLabel = ({ children, sx = {} }) => (
    <Typography sx={{ fontFamily: fontBody, fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: T.textMute, mb: 0.5, ...sx }}>{children}</Typography>
);
const StatusPill = ({ status }) => {
    const s = statusColors[status] || { bg: T.bg, color: T.textSub };
    return (
        <Box sx={{ px: 1.2, py: 0.4, borderRadius: "6px", bgcolor: s.bg, width: "fit-content", display: "inline-flex", alignItems: "center", gap: 0.5 }}>
            <Box sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: s.color }} />
            <Typography sx={{ fontFamily: fontBody, fontSize: "0.7rem", fontWeight: 700, color: s.color }}>{status}</Typography>
        </Box>
    );
};
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

export default function ETABoard() {
    const [lastRefresh, setLastRefresh] = useState(new Date());
    const [routeFilter, setRouteFilter] = useState("All");

    useEffect(() => {
        const interval = setInterval(() => setLastRefresh(new Date()), 10000);
        return () => clearInterval(interval);
    }, []);

    const filtered = routeFilter === "All" ? liveTracking : liveTracking.filter(b => b.route.includes(routeFilter));

    const onTimeCount = liveTracking.filter(b => b.status === "On Time").length;
    const delayedCount = liveTracking.filter(b => b.status === "Delayed").length;
    const avgEta = Math.round(liveTracking.reduce((a, b) => a + parseInt(b.eta), 0) / liveTracking.length);
    const totalPassengers = liveTracking.reduce((a, b) => a + b.passengers, 0);

    // Build per-bus summary with stop progress
    const busProgress = liveTracking.map(bus => {
        const routeObj = routes.find(r => r.name === bus.route);
        const totalStops = routeObj ? routeObj.stops : 8;
        const currentStopNum = parseInt(bus.currentStop.replace("Stop ", "")) || 1;
        return { ...bus, totalStops, currentStopNum, progress: Math.round((currentStopNum / totalStops) * 100) };
    });

    return (
        <Box sx={{ p: 3, background: T.bg, minHeight: "100vh", fontFamily: fontBody }}>
            <style>{Fonts()}</style>

            <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3} className="fade-up">
                <Box>
                    <Typography sx={{ fontFamily: fontBody, fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: T.textMute, mb: 0.3 }}>Tracking · ETA & Arrivals</Typography>
                    <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1.5rem", color: T.text, lineHeight: 1.1 }}>ETA Board</Typography>
                    <Typography sx={{ fontFamily: fontBody, fontSize: "0.82rem", color: T.textSub, mt: 0.4 }}>View estimated time of arrival per stop per bus.</Typography>
                </Box>
                <Box display="flex" alignItems="center" gap={1.5}>
                    <Chip
                        icon={<FiberManualRecord sx={{ fontSize: 8, color: T.success }} />}
                        label={`Live · ${lastRefresh.toLocaleTimeString()}`}
                        size="small"
                        sx={{ fontFamily: fontMono, fontSize: "0.72rem", bgcolor: T.successLight, color: T.success, fontWeight: 600, height: 28 }}
                    />
                    <Tooltip title="Refresh">
                        <IconButton onClick={() => setLastRefresh(new Date())} sx={{ border: `1px solid ${T.border}`, borderRadius: "8px", color: T.textSub }}>
                            <Refresh sx={{ fontSize: 18 }} />
                        </IconButton>
                    </Tooltip>
                </Box>
            </Box>

            <Grid container spacing={2.5} mb={3}>
                <Grid item xs={6} sm={3}><StatCard label="Avg. ETA" value={`${avgEta} min`} sub="To next stop" color={T.accent} bgLight={T.accentLight} icon={AccessTime} /></Grid>
                <Grid item xs={6} sm={3}><StatCard label="On Time" value={onTimeCount} sub={`${Math.round(onTimeCount / liveTracking.length * 100)}% fleet`} color={T.success} bgLight={T.successLight} icon={CheckCircle} /></Grid>
                <Grid item xs={6} sm={3}><StatCard label="Delayed" value={delayedCount} sub="Behind schedule" color={T.danger} bgLight={T.dangerLight} icon={Warning} /></Grid>
                <Grid item xs={6} sm={3}><StatCard label="Passengers" value={totalPassengers} sub="Currently en route" color={T.info} bgLight={T.infoLight} icon={People} /></Grid>
            </Grid>

            {/* ETA Cards Grid */}
            <Card className="fade-up" sx={{ borderRadius: "14px", border: `1px solid ${T.border}`, boxShadow: "0 1px 4px rgba(0,0,0,0.04)", mb: 3 }}>
                <Box sx={{ p: 2.5, borderBottom: `1px solid ${T.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
                    <Box>
                        <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1.1rem" }}>Real-Time ETA</Typography>
                        <Typography sx={{ fontFamily: fontBody, fontSize: "0.78rem", color: T.textMute }}>{filtered.length} buses being tracked</Typography>
                    </Box>
                    <FormControl size="small" sx={{ minWidth: 160 }}>
                        <Select value={routeFilter} onChange={e => setRouteFilter(e.target.value)} sx={{ borderRadius: "8px", fontFamily: fontBody, fontSize: "0.8rem" }}>
                            <MenuItem value="All">All Routes</MenuItem>
                            {routes.slice(0, 5).map(r => <MenuItem key={r.id} value={r.name.split(" - ")[1]}>{r.name}</MenuItem>)}
                        </Select>
                    </FormControl>
                </Box>

                <Grid container spacing={2.5} sx={{ p: 2.5 }}>
                    {busProgress.filter(b => routeFilter === "All" || b.route.includes(routeFilter)).map(bus => (
                        <Grid item xs={12} sm={6} md={4} key={bus.id}>
                            <Card sx={{ p: 2, borderRadius: "12px", border: `1px solid ${bus.status === "Delayed" ? T.danger + "40" : T.border}`, bgcolor: bus.status === "Delayed" ? T.dangerLight : T.surface, transition: "all 0.2s", "&:hover": { transform: "translateY(-2px)", boxShadow: "0 4px 12px rgba(0,0,0,0.06)" } }}>
                                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1.5}>
                                    <Box display="flex" alignItems="center" gap={1}>
                                        <DirectionsBus sx={{ fontSize: 18, color: bus.status === "Delayed" ? T.danger : T.accent }} />
                                        <Typography sx={{ fontFamily: fontMono, fontWeight: 700, fontSize: "0.95rem", color: T.text }}>{bus.id}</Typography>
                                    </Box>
                                    <StatusPill status={bus.status} />
                                </Box>

                                <Typography sx={{ fontFamily: fontBody, fontSize: "0.78rem", color: T.textSub, mb: 1 }} noWrap>{bus.route}</Typography>

                                <Grid container spacing={1} mb={1.5}>
                                    <Grid item xs={4}>
                                        <SLabel>Current</SLabel>
                                        <Typography sx={{ fontFamily: fontMono, fontSize: "0.78rem", fontWeight: 600, color: T.text }}>{bus.currentStop}</Typography>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <SLabel>Next</SLabel>
                                        <Typography sx={{ fontFamily: fontMono, fontSize: "0.78rem", fontWeight: 600, color: T.accent }}>{bus.nextStop}</Typography>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <SLabel>ETA</SLabel>
                                        <Typography sx={{ fontFamily: fontMono, fontSize: "0.95rem", fontWeight: 700, color: bus.status === "Delayed" ? T.danger : T.success }}>{bus.eta}</Typography>
                                    </Grid>
                                </Grid>

                                <Box mb={0.5}>
                                    <Box display="flex" justifyContent="space-between" mb={0.3}>
                                        <Typography sx={{ fontFamily: fontBody, fontSize: "0.68rem", color: T.textMute }}>Route Progress</Typography>
                                        <Typography sx={{ fontFamily: fontMono, fontSize: "0.68rem", color: T.textMute }}>{bus.currentStopNum}/{bus.totalStops} stops</Typography>
                                    </Box>
                                    <LinearProgress variant="determinate" value={bus.progress}
                                        sx={{ height: 5, borderRadius: 3, bgcolor: T.border, "& .MuiLinearProgress-bar": { bgcolor: bus.status === "Delayed" ? T.danger : T.success, borderRadius: 3 } }} />
                                </Box>

                                <Box display="flex" justifyContent="space-between" mt={1}>
                                    <Box display="flex" alignItems="center" gap={0.3}>
                                        <Speed sx={{ fontSize: 12, color: T.textMute }} />
                                        <Typography sx={{ fontFamily: fontMono, fontSize: "0.68rem", color: T.textMute }}>{bus.speed}</Typography>
                                    </Box>
                                    <Box display="flex" alignItems="center" gap={0.3}>
                                        <People sx={{ fontSize: 12, color: T.textMute }} />
                                        <Typography sx={{ fontFamily: fontMono, fontSize: "0.68rem", color: T.textMute }}>{bus.passengers} pax</Typography>
                                    </Box>
                                </Box>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Card>

            {/* Summary Table */}
            <Card className="fade-up" sx={{ borderRadius: "14px", border: `1px solid ${T.border}`, boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                <Box sx={{ p: 2.5, borderBottom: `1px solid ${T.border}` }}>
                    <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1rem" }}>ETA Summary</Typography>
                </Box>
                <Box sx={{ overflowX: "auto" }}>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ bgcolor: "#F9FAFB" }}>
                                {["Bus", "Route", "Driver", "Current Stop", "Next Stop", "ETA", "Speed", "Passengers", "Status"].map(h => (
                                    <TableCell key={h} sx={{ fontFamily: fontBody, fontWeight: 700, fontSize: "0.72rem", color: T.textMute, textTransform: "uppercase", py: 1.5, whiteSpace: "nowrap" }}>{h}</TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filtered.map(bus => (
                                <TableRow key={bus.id} className="row-hover">
                                    <TableCell sx={{ fontFamily: fontMono, fontWeight: 700, fontSize: "0.85rem", color: T.text }}>{bus.id}</TableCell>
                                    <TableCell><Typography sx={{ fontFamily: fontBody, fontSize: "0.8rem", color: T.textSub, maxWidth: 160 }} noWrap>{bus.route}</Typography></TableCell>
                                    <TableCell sx={{ fontFamily: fontBody, fontSize: "0.82rem", color: T.textSub }}>{bus.driver}</TableCell>
                                    <TableCell sx={{ fontFamily: fontMono, fontSize: "0.82rem", color: T.text }}>{bus.currentStop}</TableCell>
                                    <TableCell sx={{ fontFamily: fontMono, fontSize: "0.82rem", color: T.accent, fontWeight: 600 }}>{bus.nextStop}</TableCell>
                                    <TableCell sx={{ fontFamily: fontMono, fontSize: "0.88rem", color: bus.status === "Delayed" ? T.danger : T.success, fontWeight: 700 }}>{bus.eta}</TableCell>
                                    <TableCell sx={{ fontFamily: fontMono, fontSize: "0.82rem", color: T.textSub }}>{bus.speed}</TableCell>
                                    <TableCell sx={{ fontFamily: fontMono, fontSize: "0.82rem", color: T.text, fontWeight: 600 }}>{bus.passengers}</TableCell>
                                    <TableCell><StatusPill status={bus.status} /></TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Box>
            </Card>
        </Box>
    );
}
