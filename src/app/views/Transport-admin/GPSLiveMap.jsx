import React, { useState, useEffect, useRef } from "react";
import {
    Box, Card, Grid, Typography, Chip, IconButton, Tooltip, Table, TableBody,
    TableCell, TableHead, TableRow, FormControl, Select, MenuItem
} from "@mui/material";
import {
    Refresh, FiberManualRecord, Speed, People, GpsFixed,
    DirectionsBus, AccessTime
} from "@mui/icons-material";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
    T, fontHead, fontBody, fontMono, Fonts, liveTracking, statusColors, createCustomIcon
} from "./transportAdminShared";

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

export default function GPSLiveMap() {
    const [lastRefresh, setLastRefresh] = useState(new Date());
    const [selectedBus, setSelectedBus] = useState(null);
    const [statusFilter, setStatusFilter] = useState("All");
    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);

    useEffect(() => {
        const interval = setInterval(() => setLastRefresh(new Date()), 10000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (!mapRef.current || mapInstanceRef.current) return;
        const map = L.map(mapRef.current, { zoomControl: true }).setView([12.9716, 77.5946], 12);
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
        const filteredBuses = statusFilter === "All" ? liveTracking : liveTracking.filter(b => b.status === statusFilter);
        filteredBuses.forEach(bus => {
            const marker = L.marker([bus.lat, bus.lng], { icon: createCustomIcon(bus.id, bus.status) }).addTo(map);
            marker.bindPopup(`
                <div style="font-family:${fontBody};min-width:160px;">
                    <div style="font-weight:700;font-size:13px;margin-bottom:4px;">${bus.id} — ${bus.route}</div>
                    <div style="font-size:11px;color:#6b7280;">Driver: ${bus.driver}</div>
                    <div style="font-size:11px;color:#6b7280;">Speed: ${bus.speed} · ${bus.passengers} passengers</div>
                    <div style="font-size:11px;color:#6b7280;">ETA to next: ${bus.eta}</div>
                    <div style="font-size:11px;margin-top:4px;color:${bus.status === 'Delayed' ? T.danger : T.success};font-weight:600;">${bus.status}</div>
                </div>
            `);
            marker.on("click", () => setSelectedBus(bus));
        });
    }, [statusFilter, lastRefresh]);

    const onTimeCount = liveTracking.filter(b => b.status === "On Time").length;
    const delayedCount = liveTracking.filter(b => b.status === "Delayed").length;
    const totalPassengers = liveTracking.reduce((a, b) => a + b.passengers, 0);
    const avgSpeed = Math.round(liveTracking.reduce((a, b) => a + parseInt(b.speed), 0) / liveTracking.length);

    return (
        <Box sx={{ p: 3, background: T.bg, minHeight: "100vh", fontFamily: fontBody }}>
            <style>{Fonts()}</style>

            <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3} className="fade-up">
                <Box>
                    <Typography sx={{ fontFamily: fontBody, fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: T.textMute, mb: 0.3 }}>Tracking · GPS Live Tracking</Typography>
                    <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1.5rem", color: T.text, lineHeight: 1.1 }}>GPS Live Map</Typography>
                    <Typography sx={{ fontFamily: fontBody, fontSize: "0.82rem", color: T.textSub, mt: 0.4 }}>Real-time bus positions on an interactive map.</Typography>
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
                <Grid item xs={6} sm={3}><StatCard label="Buses Tracked" value={liveTracking.length} sub="Currently on map" color={T.accent} bgLight={T.accentLight} icon={GpsFixed} /></Grid>
                <Grid item xs={6} sm={3}><StatCard label="On Time" value={onTimeCount} sub={`${delayedCount} delayed`} color={T.success} bgLight={T.successLight} icon={AccessTime} /></Grid>
                <Grid item xs={6} sm={3}><StatCard label="Total Passengers" value={totalPassengers} sub="Currently on buses" color={T.info} bgLight={T.infoLight} icon={People} /></Grid>
                <Grid item xs={6} sm={3}><StatCard label="Avg. Speed" value={`${avgSpeed} km/h`} sub="Fleet average" color={T.warning} bgLight={T.warningLight} icon={Speed} /></Grid>
            </Grid>

            <Grid container spacing={3}>
                {/* Map */}
                <Grid item xs={12} lg={8}>
                    <Card sx={{ borderRadius: "14px", border: `1px solid ${T.border}`, boxShadow: "0 1px 4px rgba(0,0,0,0.04)", overflow: "hidden", position: "relative", height: 560 }}>
                        <div ref={mapRef} style={{ height: "100%", width: "100%", zIndex: 0 }} />
                        <Box sx={{ position: "absolute", top: 12, left: 12, bgcolor: "rgba(255,255,255,0.92)", backdropFilter: "blur(8px)", px: 2, py: 1.5, borderRadius: "10px", border: `1px solid ${T.border}`, zIndex: 1000, display: "flex", alignItems: "center", gap: 2 }}>
                            <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "0.85rem", color: T.text }}>Filter:</Typography>
                            <FormControl size="small" sx={{ minWidth: 110 }}>
                                <Select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} sx={{ borderRadius: "8px", fontFamily: fontBody, fontSize: "0.78rem", bgcolor: "transparent" }}>
                                    <MenuItem value="All">All</MenuItem>
                                    <MenuItem value="On Time">On Time</MenuItem>
                                    <MenuItem value="Delayed">Delayed</MenuItem>
                                </Select>
                            </FormControl>
                            <Box display="flex" gap={1.5}>
                                <Box display="flex" alignItems="center" gap={0.5}>
                                    <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: T.success }} />
                                    <Typography sx={{ fontSize: "0.68rem", color: T.textSub }}>{onTimeCount} On Time</Typography>
                                </Box>
                                <Box display="flex" alignItems="center" gap={0.5}>
                                    <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: T.danger }} />
                                    <Typography sx={{ fontSize: "0.68rem", color: T.textSub }}>{delayedCount} Delayed</Typography>
                                </Box>
                            </Box>
                        </Box>
                    </Card>
                </Grid>

                {/* Bus List */}
                <Grid item xs={12} lg={4}>
                    <Card className="fade-up" sx={{ borderRadius: "14px", border: `1px solid ${T.border}`, boxShadow: "0 1px 4px rgba(0,0,0,0.04)", height: 560, display: "flex", flexDirection: "column" }}>
                        <Box sx={{ p: 2.5, borderBottom: `1px solid ${T.border}` }}>
                            <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1rem" }}>Bus Details</Typography>
                            <Typography sx={{ fontFamily: fontBody, fontSize: "0.72rem", color: T.textMute }}>{selectedBus ? `Selected: ${selectedBus.id}` : "Click a marker to select"}</Typography>
                        </Box>

                        {selectedBus ? (
                            <Box sx={{ p: 2.5, overflowY: "auto", flex: 1 }} className="custom-scrollbar">
                                <Grid container spacing={1.5}>
                                    {[
                                        { label: "Bus ID", value: selectedBus.id },
                                        { label: "Route", value: selectedBus.route },
                                        { label: "Driver", value: selectedBus.driver },
                                        { label: "Current Stop", value: selectedBus.currentStop },
                                        { label: "Next Stop", value: selectedBus.nextStop },
                                        { label: "Speed", value: selectedBus.speed },
                                        { label: "ETA", value: selectedBus.eta },
                                        { label: "Passengers", value: selectedBus.passengers },
                                        { label: "Status", value: selectedBus.status },
                                        { label: "Latitude", value: selectedBus.lat.toFixed(4) },
                                        { label: "Longitude", value: selectedBus.lng.toFixed(4) },
                                    ].map(item => (
                                        <Grid item xs={6} key={item.label}>
                                            <SLabel>{item.label}</SLabel>
                                            <Typography sx={{ fontFamily: fontBody, fontSize: "0.88rem", color: T.text, fontWeight: 600 }}>{item.value}</Typography>
                                        </Grid>
                                    ))}
                                </Grid>
                            </Box>
                        ) : (
                            <Box sx={{ overflowY: "auto", flex: 1 }} className="custom-scrollbar">
                                {liveTracking.map(bus => (
                                    <Box key={bus.id} onClick={() => setSelectedBus(bus)}
                                        sx={{ p: 2, mx: 1.5, my: 1, borderRadius: "10px", border: `1px solid ${T.border}`, cursor: "pointer", transition: "all 0.2s", "&:hover": { borderColor: T.accent, transform: "translateX(2px)" } }}>
                                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.5}>
                                            <Typography sx={{ fontFamily: fontMono, fontWeight: 700, fontSize: "0.85rem", color: T.text }}>{bus.id}</Typography>
                                            <StatusPill status={bus.status} />
                                        </Box>
                                        <Typography sx={{ fontFamily: fontBody, fontSize: "0.75rem", color: T.textSub }}>{bus.route}</Typography>
                                        <Box display="flex" gap={2} mt={0.5}>
                                            <Typography sx={{ fontFamily: fontMono, fontSize: "0.68rem", color: T.textMute }}>{bus.speed}</Typography>
                                            <Typography sx={{ fontFamily: fontMono, fontSize: "0.68rem", color: T.textMute }}>{bus.passengers} pax</Typography>
                                            <Typography sx={{ fontFamily: fontMono, fontSize: "0.68rem", color: T.textMute }}>ETA: {bus.eta}</Typography>
                                        </Box>
                                    </Box>
                                ))}
                            </Box>
                        )}
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}
