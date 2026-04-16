import React, { useState, useEffect, useRef } from "react";
import {
    Box, Card, Grid, Typography, Chip, IconButton, Tooltip, Table, TableBody,
    TableCell, TableHead, TableRow
} from "@mui/material";
import {
    DirectionsBus, Map, People, Warning, CheckCircle, Speed,
    FiberManualRecord, Refresh, LocalGasStation, Build, Schedule,
    TrendingUp, Notifications
} from "@mui/icons-material";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
    T, fontHead, fontBody, fontMono, Fonts, buses, routes, drivers, students,
    liveTracking, statusColors, createCustomIcon, maintenanceRecords, deviationAlerts
} from "./transportAdminShared";

/* ── Reusable Components ── */
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
    <Card className="fade-up" sx={{ p: 2.5, borderRadius: "14px", border: `1px solid ${T.border}`, background: T.surface, boxShadow: "0 1px 4px rgba(0,0,0,0.04)", height: "100%", transition: "all 0.25s ease", "&:hover": { transform: "translateY(-2px)", boxShadow: "0 4px 20px rgba(99,102,241,0.08)", borderColor: "rgba(99,102,241,0.2)" } }}>
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

/* ── Mini Leaflet Map ── */
const DashboardMap = ({ busData }) => {
    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);

    useEffect(() => {
        if (!mapRef.current || mapInstanceRef.current) return;
        const map = L.map(mapRef.current, { zoomControl: false }).setView([12.9716, 77.5946], 12);
        L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        }).addTo(map);
        mapInstanceRef.current = map;
        return () => { map.remove(); mapInstanceRef.current = null; };
    }, []);

    useEffect(() => {
        const map = mapInstanceRef.current;
        if (!map) return;
        map.eachLayer(layer => { if (layer instanceof L.Marker) map.removeLayer(layer); });
        busData.forEach(bus => {
            const marker = L.marker([bus.lat, bus.lng], { icon: createCustomIcon(bus.id, bus.status) }).addTo(map);
            marker.bindPopup(`<div style="font-family:${fontBody}"><strong>${bus.id}</strong><br/>${bus.route}<br/>Speed: ${bus.speed}</div>`);
        });
    }, [busData]);

    return <div ref={mapRef} style={{ height: "100%", width: "100%", zIndex: 0 }} />;
};

export default function TransportDashboard() {
    const [lastRefresh, setLastRefresh] = useState(new Date());

    useEffect(() => {
        const interval = setInterval(() => setLastRefresh(new Date()), 10000);
        return () => clearInterval(interval);
    }, []);

    const onRoute = buses.filter(b => b.status === "On Route").length;
    const activeDrivers = drivers.filter(d => d.status === "Active").length;
    const onTimeCount = liveTracking.filter(b => b.status === "On Time").length;
    const delayedCount = liveTracking.filter(b => b.status === "Delayed").length;
    const activeStudentPasses = students.filter(s => s.passStatus === "Active").length;
    const pendingMaintenance = maintenanceRecords.filter(m => m.status === "Scheduled" || m.status === "Due Soon" || m.status === "Overdue").length;
    const openAlerts = deviationAlerts.filter(a => a.status === "Open").length;

    return (
        <Box sx={{ p: 3, background: T.bg, minHeight: "100vh", fontFamily: fontBody }}>
            <style>{Fonts()}</style>

            {/* ── Header ── */}
            <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3} className="fade-up">
                <Box>
                    <Typography sx={{ fontFamily: fontBody, fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: T.textMute, mb: 0.3 }}>Transport Admin</Typography>
                    <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1.5rem", color: T.text, lineHeight: 1.1 }}>Dashboard</Typography>
                    <Typography sx={{ fontFamily: fontBody, fontSize: "0.82rem", color: T.textSub, mt: 0.4 }}>Live bus positions, today's schedule status, alerts, and fleet health summary.</Typography>
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

            {/* ── Stat Cards ── */}
            <Grid container spacing={2.5} mb={3}>
                <Grid item xs={6} sm={4} md={2}><StatCard label="Total Buses" value={buses.length} sub={`${onRoute} on route`} color={T.accent} bgLight={T.accentLight} icon={DirectionsBus} /></Grid>
                <Grid item xs={6} sm={4} md={2}><StatCard label="Active Routes" value={routes.filter(r => r.status === "Active").length} sub={`${routes.reduce((a, r) => a + r.stops, 0)} stops total`} color={T.success} bgLight={T.successLight} icon={Map} /></Grid>
                <Grid item xs={6} sm={4} md={2}><StatCard label="Drivers On Duty" value={activeDrivers} sub={`${drivers.length - activeDrivers} off-duty`} color={T.warning} bgLight={T.warningLight} icon={People} /></Grid>
                <Grid item xs={6} sm={4} md={2}><StatCard label="On Time" value={onTimeCount} sub={`${delayedCount} delayed`} color={T.info} bgLight={T.infoLight} icon={CheckCircle} /></Grid>
                <Grid item xs={6} sm={4} md={2}><StatCard label="Student Passes" value={activeStudentPasses} sub={`${students.length} registered`} color={T.purple} bgLight={T.purpleLight} icon={Schedule} /></Grid>
                <Grid item xs={6} sm={4} md={2}><StatCard label="Open Alerts" value={openAlerts + pendingMaintenance} sub={`${openAlerts} deviations`} color={T.danger} bgLight={T.dangerLight} icon={Notifications} /></Grid>
            </Grid>

            {/* ── Map + Recent Activity ── */}
            <Grid container spacing={3} mb={3}>
                {/* Live Map */}
                <Grid item xs={12} lg={8}>
                    <Card sx={{ borderRadius: "14px", border: `1px solid ${T.border}`, boxShadow: "0 1px 4px rgba(0,0,0,0.04)", overflow: "hidden", position: "relative", height: 420 }}>
                        <DashboardMap busData={liveTracking} />
                        <Box sx={{ position: "absolute", top: 12, left: 12, bgcolor: "rgba(255,255,255,0.92)", backdropFilter: "blur(8px)", px: 2, py: 1, borderRadius: "8px", border: `1px solid ${T.border}`, zIndex: 1000 }}>
                            <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "0.85rem", color: T.text }}>Live Fleet Map</Typography>
                            <Box display="flex" gap={2} mt={0.5}>
                                <Box display="flex" alignItems="center" gap={0.5}>
                                    <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: T.success }} />
                                    <Typography sx={{ fontSize: "0.7rem", color: T.textSub }}>{onTimeCount} On Time</Typography>
                                </Box>
                                <Box display="flex" alignItems="center" gap={0.5}>
                                    <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: T.danger }} />
                                    <Typography sx={{ fontSize: "0.7rem", color: T.textSub }}>{delayedCount} Delayed</Typography>
                                </Box>
                            </Box>
                        </Box>
                    </Card>
                </Grid>

                {/* Recent Alerts */}
                <Grid item xs={12} lg={4}>
                    <Card className="fade-up" sx={{ borderRadius: "14px", border: `1px solid ${T.border}`, boxShadow: "0 1px 4px rgba(0,0,0,0.04)", height: 420, display: "flex", flexDirection: "column" }}>
                        <Box sx={{ p: 2.5, borderBottom: `1px solid ${T.border}` }}>
                            <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1rem" }}>Recent Alerts</Typography>
                            <Typography sx={{ fontFamily: fontBody, fontSize: "0.72rem", color: T.textMute }}>Deviations & maintenance overdue</Typography>
                        </Box>
                        <Box sx={{ overflowY: "auto", flex: 1, p: 1.5 }} className="custom-scrollbar">
                            {deviationAlerts.slice(0, 6).map(alert => (
                                <Box key={alert.id} sx={{ p: 1.5, mb: 1, borderRadius: "10px", border: `1px solid ${T.border}`, transition: "all 0.2s", "&:hover": { borderColor: T.accent, transform: "translateX(2px)" } }}>
                                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.5}>
                                        <Typography sx={{ fontFamily: fontMono, fontWeight: 700, fontSize: "0.78rem", color: T.text }}>{alert.busId}</Typography>
                                        <StatusPill status={alert.severity === "Critical" ? "Critical" : "Normal"} />
                                    </Box>
                                    <Typography sx={{ fontFamily: fontBody, fontSize: "0.75rem", color: T.textSub }}>{alert.reason}</Typography>
                                    <Typography sx={{ fontFamily: fontMono, fontSize: "0.65rem", color: T.textMute, mt: 0.3 }}>{alert.timestamp}</Typography>
                                </Box>
                            ))}
                        </Box>
                    </Card>
                </Grid>
            </Grid>

            {/* ── Today's Schedule & Fleet Health ── */}
            <Grid container spacing={3}>
                {/* Today's Schedule */}
                <Grid item xs={12} md={7}>
                    <Card className="fade-up" sx={{ borderRadius: "14px", border: `1px solid ${T.border}`, boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                        <Box sx={{ p: 2.5, borderBottom: `1px solid ${T.border}` }}>
                            <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1rem" }}>Today's Schedule</Typography>
                            <Typography sx={{ fontFamily: fontBody, fontSize: "0.72rem", color: T.textMute }}>{buses.length} buses scheduled across {routes.length} routes</Typography>
                        </Box>
                        <Box sx={{ overflowX: "auto" }}>
                            <Table>
                                <TableHead>
                                    <TableRow sx={{ bgcolor: "#F9FAFB" }}>
                                        {["Bus", "Route", "Driver", "Passengers", "Status"].map(h => (
                                            <TableCell key={h} sx={{ fontFamily: fontBody, fontWeight: 700, fontSize: "0.72rem", color: T.textMute, textTransform: "uppercase", py: 1.5 }}>{h}</TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {liveTracking.slice(0, 6).map(bus => (
                                        <TableRow key={bus.id} className="row-hover">
                                            <TableCell>
                                                <Typography sx={{ fontFamily: fontMono, fontWeight: 700, fontSize: "0.82rem", color: T.text }}>{bus.id}</Typography>
                                            </TableCell>
                                            <TableCell><Typography sx={{ fontFamily: fontBody, fontSize: "0.8rem", color: T.textSub, maxWidth: 180 }} noWrap>{bus.route}</Typography></TableCell>
                                            <TableCell sx={{ fontFamily: fontBody, fontSize: "0.82rem", color: T.textSub }}>{bus.driver}</TableCell>
                                            <TableCell sx={{ fontFamily: fontMono, fontSize: "0.82rem", color: T.text, fontWeight: 600 }}>{bus.passengers}</TableCell>
                                            <TableCell><StatusPill status={bus.status} /></TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Box>
                    </Card>
                </Grid>

                {/* Fleet Health */}
                <Grid item xs={12} md={5}>
                    <Card className="fade-up" sx={{ borderRadius: "14px", border: `1px solid ${T.border}`, boxShadow: "0 1px 4px rgba(0,0,0,0.04)", height: "100%" }}>
                        <Box sx={{ p: 2.5, borderBottom: `1px solid ${T.border}` }}>
                            <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1rem" }}>Fleet Health Summary</Typography>
                        </Box>
                        <Box sx={{ p: 2.5 }}>
                            {[
                                { label: "On Route", count: onRoute, total: buses.length, color: T.success },
                                { label: "Idle", count: buses.filter(b => b.status === "Idle").length, total: buses.length, color: T.textMute },
                                { label: "Maintenance", count: buses.filter(b => b.status === "Maintenance").length, total: buses.length, color: T.danger },
                            ].map(item => (
                                <Box key={item.label} sx={{ mb: 2.5 }}>
                                    <Box display="flex" justifyContent="space-between" mb={0.5}>
                                        <Typography sx={{ fontFamily: fontBody, fontSize: "0.82rem", fontWeight: 600, color: T.text }}>{item.label}</Typography>
                                        <Typography sx={{ fontFamily: fontMono, fontSize: "0.82rem", fontWeight: 700, color: item.color }}>{item.count}/{item.total}</Typography>
                                    </Box>
                                    <Box sx={{ height: 6, borderRadius: 3, bgcolor: T.border, overflow: "hidden" }}>
                                        <Box sx={{ height: "100%", width: `${(item.count / item.total) * 100}%`, bgcolor: item.color, borderRadius: 3, transition: "width 0.5s ease" }} />
                                    </Box>
                                </Box>
                            ))}

                            <Box sx={{ mt: 3, p: 2, borderRadius: "10px", bgcolor: T.warningLight, border: `1px solid ${T.warning}20` }}>
                                <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                                    <Build sx={{ fontSize: 16, color: T.warning }} />
                                    <Typography sx={{ fontFamily: fontBody, fontWeight: 700, fontSize: "0.82rem", color: T.warning }}>Upcoming Maintenance</Typography>
                                </Box>
                                {maintenanceRecords.filter(m => m.status === "Due Soon" || m.status === "Scheduled").slice(0, 3).map(m => (
                                    <Box key={m.id} display="flex" justifyContent="space-between" mt={1}>
                                        <Typography sx={{ fontFamily: fontBody, fontSize: "0.75rem", color: T.textSub }}>{m.busNumber} — {m.type}</Typography>
                                        <Typography sx={{ fontFamily: fontMono, fontSize: "0.68rem", color: T.textMute }}>{m.scheduledDate}</Typography>
                                    </Box>
                                ))}
                            </Box>

                            <Box sx={{ mt: 2, p: 2, borderRadius: "10px", bgcolor: T.accentLight, border: `1px solid ${T.accent}20` }}>
                                <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                                    <LocalGasStation sx={{ fontSize: 16, color: T.accent }} />
                                    <Typography sx={{ fontFamily: fontBody, fontWeight: 700, fontSize: "0.82rem", color: T.accent }}>Avg. Fleet Fuel</Typography>
                                </Box>
                                <Typography sx={{ fontFamily: fontMono, fontWeight: 700, fontSize: "1.3rem", color: T.accent }}>
                                    {Math.round(buses.reduce((a, b) => a + parseInt(b.fuelLevel), 0) / buses.length)}%
                                </Typography>
                                <Typography sx={{ fontFamily: fontBody, fontSize: "0.7rem", color: T.textMute }}>Average across {buses.length} buses</Typography>
                            </Box>
                        </Box>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}
