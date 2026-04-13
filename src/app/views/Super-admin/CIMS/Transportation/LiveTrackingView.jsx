import React, { useState, useEffect, useRef } from "react";
import {
    Box, Card, Grid, Typography, IconButton, Chip, Tooltip, TextField,
    InputAdornment, FormControl, Select, MenuItem
} from "@mui/material";
import {
    DirectionsBus, Speed, People, Search, Refresh, FiberManualRecord,
    Schedule, Warning, CheckCircle
} from "@mui/icons-material";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { T, fontHead, fontBody, fontMono, Fonts, liveTracking, statusColors, createCustomIcon } from "./transportShared";

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

/* ── Plain Leaflet Map (avoids react-leaflet v5 / React 18 incompatibility) ── */
const LeafletMap = ({ buses }) => {
    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);

    useEffect(() => {
        if (!mapRef.current || mapInstanceRef.current) return;

        const map = L.map(mapRef.current, { zoomControl: true }).setView([12.9716, 77.5946], 12);
        L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(map);

        mapInstanceRef.current = map;

        return () => {
            map.remove();
            mapInstanceRef.current = null;
        };
    }, []);

    // Update markers whenever bus data changes
    useEffect(() => {
        const map = mapInstanceRef.current;
        if (!map) return;

        // Clear previous markers
        map.eachLayer(layer => {
            if (layer instanceof L.Marker) map.removeLayer(layer);
        });

        buses.forEach(bus => {
            const marker = L.marker([bus.lat, bus.lng], { icon: createCustomIcon(bus.id, bus.status) }).addTo(map);
            marker.bindPopup(`
        <div style="font-family: ${fontBody}; min-width: 160px;">
          <div style="font-weight: 700; font-size: 0.9rem; color: ${T.text};">${bus.id}</div>
          <div style="font-size: 0.75rem; color: ${T.textSub}; margin-top: 3px;">${bus.route}</div>
          <div style="margin-top: 8px; display: flex; flex-direction: column; gap: 3px;">
            <span style="font-size: 0.72rem; color: ${T.textMute};">Speed: <strong>${bus.speed}</strong></span>
            <span style="font-size: 0.72rem; color: ${T.textMute};">Passengers: <strong>${bus.passengers}</strong></span>
            <span style="font-size: 0.72rem; color: ${T.textMute};">Next Stop: <strong>${bus.nextStop}</strong></span>
            <span style="font-size: 0.72rem; color: ${T.textMute};">ETA: <strong>${bus.eta}</strong></span>
            <span style="font-size: 0.72rem; color: ${T.textMute};">Driver: <strong>${bus.driver}</strong></span>
          </div>
        </div>
      `);
        });
    }, [buses]);

    return <div ref={mapRef} style={{ height: "100%", width: "100%", zIndex: 0 }} />;
};

export default function LiveTrackingView() {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [selectedBus, setSelectedBus] = useState(null);
    const [lastRefresh, setLastRefresh] = useState(new Date());

    useEffect(() => {
        const interval = setInterval(() => setLastRefresh(new Date()), 10000);
        return () => clearInterval(interval);
    }, []);

    const filtered = liveTracking.filter(b => {
        const matchSearch = b.id.toLowerCase().includes(searchTerm.toLowerCase()) || b.route.toLowerCase().includes(searchTerm.toLowerCase());
        const matchStatus = statusFilter === "All" || b.status === statusFilter;
        return matchSearch && matchStatus;
    });

    const onTimeCount = liveTracking.filter(b => b.status === "On Time").length;
    const delayedCount = liveTracking.filter(b => b.status === "Delayed").length;
    const totalPassengers = liveTracking.reduce((a, b) => a + b.passengers, 0);

    return (
        <Box sx={{ p: 3, background: T.bg, minHeight: "100vh", fontFamily: fontBody }}>
            <style>{Fonts()}</style>

            {/* ── Header ── */}
            <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3} className="fade-up">
                <Box>
                    <Typography sx={{ fontFamily: fontBody, fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: T.textMute, mb: 0.3 }}>Transportation · Tracking</Typography>
                    <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1.5rem", color: T.text, lineHeight: 1.1 }}>Live Bus Tracking</Typography>
                    <Typography sx={{ fontFamily: fontBody, fontSize: "0.82rem", color: T.textSub, mt: 0.4 }}>Real-time GPS location, speed, and status of all campus buses.</Typography>
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

            {/* ── Quick Stats Row ── */}
            <Grid container spacing={2} mb={3}>
                <Grid item xs={6} sm={3}>
                    <Card className="fade-up" sx={{ p: 2, borderRadius: "12px", border: `1px solid ${T.border}`, boxShadow: "none", display: "flex", alignItems: "center", gap: 1.5 }}>
                        <Box sx={{ p: 1, borderRadius: "8px", bgcolor: T.accentLight, color: T.accent }}><DirectionsBus sx={{ fontSize: 18 }} /></Box>
                        <Box>
                            <Typography component="div" sx={{ fontFamily: fontMono, fontWeight: 700, fontSize: "1.2rem", color: T.text, lineHeight: 1 }}>{liveTracking.length}</Typography>
                            <Typography component="div" sx={{ fontFamily: fontBody, fontSize: "0.68rem", color: T.textMute }}>Buses Active</Typography>
                        </Box>
                    </Card>
                </Grid>
                <Grid item xs={6} sm={3}>
                    <Card className="fade-up" sx={{ p: 2, borderRadius: "12px", border: `1px solid ${T.border}`, boxShadow: "none", display: "flex", alignItems: "center", gap: 1.5 }}>
                        <Box sx={{ p: 1, borderRadius: "8px", bgcolor: T.successLight, color: T.success }}><CheckCircle sx={{ fontSize: 18 }} /></Box>
                        <Box>
                            <Typography component="div" sx={{ fontFamily: fontMono, fontWeight: 700, fontSize: "1.2rem", color: T.success, lineHeight: 1 }}>{onTimeCount}</Typography>
                            <Typography component="div" sx={{ fontFamily: fontBody, fontSize: "0.68rem", color: T.textMute }}>On Time</Typography>
                        </Box>
                    </Card>
                </Grid>
                <Grid item xs={6} sm={3}>
                    <Card className="fade-up" sx={{ p: 2, borderRadius: "12px", border: `1px solid ${T.border}`, boxShadow: "none", display: "flex", alignItems: "center", gap: 1.5 }}>
                        <Box sx={{ p: 1, borderRadius: "8px", bgcolor: T.dangerLight, color: T.danger }}><Warning sx={{ fontSize: 18 }} /></Box>
                        <Box>
                            <Typography component="div" sx={{ fontFamily: fontMono, fontWeight: 700, fontSize: "1.2rem", color: T.danger, lineHeight: 1 }}>{delayedCount}</Typography>
                            <Typography component="div" sx={{ fontFamily: fontBody, fontSize: "0.68rem", color: T.textMute }}>Delayed</Typography>
                        </Box>
                    </Card>
                </Grid>
                <Grid item xs={6} sm={3}>
                    <Card className="fade-up" sx={{ p: 2, borderRadius: "12px", border: `1px solid ${T.border}`, boxShadow: "none", display: "flex", alignItems: "center", gap: 1.5 }}>
                        <Box sx={{ p: 1, borderRadius: "8px", bgcolor: T.infoLight, color: T.info }}><People sx={{ fontSize: 18 }} /></Box>
                        <Box>
                            <Typography component="div" sx={{ fontFamily: fontMono, fontWeight: 700, fontSize: "1.2rem", color: T.text, lineHeight: 1 }}>{totalPassengers}</Typography>
                            <Typography component="div" sx={{ fontFamily: fontBody, fontSize: "0.68rem", color: T.textMute }}>Passengers</Typography>
                        </Box>
                    </Card>
                </Grid>
            </Grid>

            {/* ── Map + Side Panel ── */}
            <Grid container spacing={3}>
                {/* Map */}
                <Grid item xs={12} lg={8}>
                    <Card sx={{ borderRadius: "14px", border: `1px solid ${T.border}`, boxShadow: "0 1px 4px rgba(0,0,0,0.04)", overflow: "hidden", position: "relative", height: 620 }}>
                        <LeafletMap buses={liveTracking} />

                        {/* Map Legend */}
                        <Box sx={{ position: "absolute", bottom: 16, left: 16, bgcolor: "rgba(255,255,255,0.92)", backdropFilter: "blur(8px)", p: 2, borderRadius: "10px", border: `1px solid ${T.border}`, boxShadow: "0 2px 12px rgba(0,0,0,0.06)", zIndex: 1000, fontFamily: fontBody }}>
                            <Typography component="div" sx={{ fontFamily: fontBody, fontSize: "0.72rem", fontWeight: 700, color: T.text, mb: 1 }}>Legend</Typography>
                            <Box display="flex" alignItems="center" gap={1} mb={0.8}>
                                <Box sx={{ width: 12, height: 12, borderRadius: "50%", bgcolor: T.success }} />
                                <Typography component="div" sx={{ fontSize: "0.78rem", color: T.textSub, fontWeight: 600 }}>On Time ({onTimeCount})</Typography>
                            </Box>
                            <Box display="flex" alignItems="center" gap={1} mb={0.8}>
                                <Box sx={{ width: 12, height: 12, borderRadius: "50%", bgcolor: T.danger }} />
                                <Typography component="div" sx={{ fontSize: "0.78rem", color: T.textSub, fontWeight: 600 }}>Delayed ({delayedCount})</Typography>
                            </Box>
                            <Typography component="div" sx={{ fontSize: "0.68rem", color: T.textMute, mt: 1 }}>Auto-refresh every 10s</Typography>
                        </Box>
                    </Card>
                </Grid>

                {/* Side Panel */}
                <Grid item xs={12} lg={4}>
                    <Box sx={{ display: "flex", flexDirection: "column", height: 620 }}>
                        {/* Filter Bar */}
                        <Box display="flex" gap={1} mb={2}>
                            <TextField size="small" placeholder="Search..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} fullWidth
                                InputProps={{ startAdornment: <InputAdornment position="start"><Search sx={{ fontSize: 14, color: T.textMute }} /></InputAdornment> }}
                                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px", fontFamily: fontBody, fontSize: "0.78rem" } }} />
                            <FormControl size="small" sx={{ minWidth: 100 }}>
                                <Select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} sx={{ borderRadius: "8px", fontFamily: fontBody, fontSize: "0.78rem" }}>
                                    <MenuItem value="All">All</MenuItem>
                                    <MenuItem value="On Time">On Time</MenuItem>
                                    <MenuItem value="Delayed">Delayed</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>

                        <Box display="flex" alignItems="center" gap={1} mb={1.5}>
                            <Typography component="div" sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1rem", color: T.text }}>
                                Active Vehicles
                            </Typography>
                            <Chip label={filtered.length} size="small" sx={{ fontFamily: fontMono, fontSize: "0.65rem", bgcolor: T.accentLight, color: T.accent, height: 20 }} />
                        </Box>

                        {/* Bus Cards */}
                        <Box sx={{ overflowY: "auto", display: "flex", flexDirection: "column", gap: 1.2, pr: 1, flex: 1, minHeight: 0 }} className="custom-scrollbar">
                            {filtered.map(bus => (
                                <Card
                                    key={bus.id}
                                    onClick={() => setSelectedBus(bus.id === selectedBus ? null : bus.id)}
                                    sx={{
                                        p: 1.5, borderRadius: "10px", flexShrink: 0,
                                        border: `1px solid ${selectedBus === bus.id ? T.accent : T.border}`,
                                        boxShadow: selectedBus === bus.id ? `0 0 0 2px ${T.accentLight}` : "none",
                                        cursor: "pointer",
                                        transition: "all 0.2s ease",
                                        "&:hover": { borderColor: T.accent, transform: "translateX(2px)" }
                                    }}
                                >
                                    <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
                                        <Box display="flex" gap={1.5}>
                                            <Box sx={{ p: 1, borderRadius: "8px", bgcolor: `${T.accent}12`, color: T.accent, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                <DirectionsBus sx={{ fontSize: 18 }} />
                                            </Box>
                                            <Box>
                                                <Typography component="div" sx={{ fontFamily: fontMono, fontWeight: 700, fontSize: "0.9rem", color: T.text, lineHeight: 1.2 }}>{bus.id}</Typography>
                                                <Typography component="div" sx={{ fontFamily: fontBody, fontSize: "0.72rem", color: T.textMute, mt: 0.2 }}>
                                                    {bus.speed} · {bus.passengers} passengers
                                                </Typography>
                                            </Box>
                                        </Box>
                                        <StatusPill status={bus.status} />
                                    </Box>

                                    {/* Route info */}
                                    <Typography component="div" sx={{ fontFamily: fontBody, fontSize: "0.7rem", color: T.textMute, mb: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{bus.route}</Typography>

                                    {/* Timeline */}
                                    <Box sx={{ position: "relative", pl: 1.5, ml: 1, borderLeft: `2px dashed ${T.border}` }}>
                                        <Box sx={{ position: "relative", mb: 1.2 }}>
                                            <Box sx={{ position: "absolute", left: -18, top: 2, width: 10, height: 10, borderRadius: "50%", border: `2px solid ${T.accent}`, bgcolor: T.surface, zIndex: 1 }} />
                                            <Box>
                                                <Typography component="div" sx={{ fontFamily: fontBody, fontSize: "0.68rem", color: T.textMute, fontWeight: 600 }}>Current</Typography>
                                                <Typography component="div" sx={{ fontFamily: fontBody, fontSize: "0.82rem", color: T.text, fontWeight: 600 }}>{bus.currentStop}</Typography>
                                            </Box>
                                        </Box>
                                        <Box sx={{ position: "relative" }}>
                                            <Box sx={{ position: "absolute", left: -18, top: 2, width: 10, height: 10, borderRadius: "50%", border: `2px solid ${T.textMute}`, bgcolor: T.surface, zIndex: 1 }} />
                                            <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                                                <Box>
                                                    <Typography component="div" sx={{ fontFamily: fontBody, fontSize: "0.68rem", color: T.textMute, fontWeight: 600 }}>Next Stop</Typography>
                                                    <Typography component="div" sx={{ fontFamily: fontBody, fontSize: "0.82rem", color: T.textMute, fontWeight: 600 }}>{bus.nextStop}</Typography>
                                                </Box>
                                                <Chip
                                                    icon={<Schedule sx={{ fontSize: 12 }} />}
                                                    label={`ETA ${bus.eta}`}
                                                    size="small"
                                                    sx={{ fontFamily: fontMono, fontSize: "0.65rem", bgcolor: T.infoLight, color: T.info, height: 22 }}
                                                />
                                            </Box>
                                        </Box>
                                    </Box>
                                </Card>
                            ))}
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
}
