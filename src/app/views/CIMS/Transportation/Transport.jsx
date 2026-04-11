import React, { useState } from "react";
import {
    Box, Card, Grid, Typography, Button, TextField, Table, TableBody, TableCell, TableHead, TableRow,
    IconButton, InputAdornment, Tabs, Tab
} from "@mui/material";
import {
    Search, FilterList, MoreHoriz, DirectionsBus, Map, Badge as IdCard, ConfirmationNumber, Add
} from "@mui/icons-material";
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

/* ── Design Tokens ── */
const T = {
    bg: "#F5F7FA", surface: "#FFFFFF", border: "#E4E8EF", text: "#111827", textSub: "#4B5563", textMute: "#9CA3AF",
    accent: "#6366F1", accentLight: "#EEF2FF", success: "#10B981", successLight: "#ECFDF5",
    warning: "#F59E0B", warningLight: "#FFFBEB", danger: "#EF4444", dangerLight: "#FEF2F2",
    info: "#3B82F6", infoLight: "#EFF6FF", purple: "#8B5CF6", purpleLight: "#F5F3FF",
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
    .row-hover:hover { background: #F9FAFB !important; transition: background 0.15s; }
    .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
    .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: #E4E8EF; border-radius: 4px; }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #CBD5E1; }
  `}</style>
);

const SLabel = ({ children, sx = {} }) => <Typography sx={{ fontFamily: fontBody, fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: T.textMute, mb: 0.5, ...sx }}>{children}</Typography>;

const StatusPill = ({ status, variant }) => {
    const map = {
        "On Route": { bg: T.successLight, color: T.success },
        "Maintenance": { bg: T.dangerLight, color: T.danger },
        "Idle": { bg: T.bg, color: T.textSub },
        "Active": { bg: T.successLight, color: T.success },
        "Off-Duty": { bg: T.bg, color: T.textSub },
        "Pending": { bg: T.warningLight, color: T.warning },
        "Expired": { bg: T.dangerLight, color: T.danger },
        "On Time": { bg: T.successLight, color: T.success },
        "Delayed": { bg: T.dangerLight, color: T.danger },
    };
    const outlineMap = {
        outline: { bg: "transparent", color: T.textSub, border: `1px solid ${T.border}` }
    };
    const s = variant === "outline" ? outlineMap.outline : (map[status] || map["Idle"]);

    return (
        <Box sx={{ px: 1.2, py: 0.4, borderRadius: "6px", bgcolor: s.bg, border: s.border, width: "fit-content", display: "inline-block" }}>
            <Typography sx={{ fontFamily: fontBody, fontSize: "0.7rem", fontWeight: 700, color: s.color }}>{status}</Typography>
        </Box>
    );
};

const StatCard = ({ label, value, sub, color, icon: Icon, bgLight }) => (
    <Card className="fade-up" sx={{ p: 2.5, borderRadius: "14px", border: `1px solid ${T.border}`, background: T.surface, boxShadow: "0 1px 4px rgba(0,0,0,0.04)", height: "100%" }}>
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

// Mock Data
const drivers = Array.from({ length: 10 }, (_, i) => ({
    id: `D-${(i + 1).toString().padStart(2, '0')}`,
    name: ["John Doe", "Jane Smith", "Mike Johnson", "Sarah Williams", "Robert Brown", "Emily Davis", "Michael Wilson", "Lisa Taylor", "David Anderson", "Jennifer Thomas"][i],
    license: `DL-${Math.floor(Math.random() * 90000) + 10000}`,
    phone: `+1 555-01${(i + 1).toString().padStart(2, '0')}`,
    busAssigned: `B-${(i + 1).toString().padStart(2, '0')}`,
    status: i < 8 ? "Active" : "Off-Duty"
}));

const routes = Array.from({ length: 10 }, (_, i) => ({
    id: `R-${(i + 1).toString().padStart(2, '0')}`,
    name: `Route ${i + 1} - ${["City Center", "North Campus", "South Campus", "East Wing", "West End", "Downtown", "Suburbs", "Tech Park", "Station", "Airport"][i]}`,
    stops: Math.floor(Math.random() * 10) + 5,
    distance: `${Math.floor(Math.random() * 20) + 5} km`,
    busAssigned: `B-${(i + 1).toString().padStart(2, '0')}`
}));

const buses = Array.from({ length: 10 }, (_, i) => ({
    id: `B-${(i + 1).toString().padStart(2, '0')}`,
    number: `KA-01-AB-${1234 + i}`,
    route: routes[i].name,
    driver: drivers[i].name,
    capacity: 50,
    status: i < 8 ? "On Route" : i === 8 ? "Idle" : "Maintenance"
}));

const firstNames = ["Liam", "Emma", "Noah", "Olivia", "William", "Ava", "James", "Isabella", "Oliver", "Sophia"];
const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez"];
const students = Array.from({ length: 50 }, (_, i) => ({
    id: `STU-${2023000 + i}`,
    name: `${firstNames[i % 10]} ${lastNames[Math.floor(i / 5) % 10]}`,
    route: routes[i % 10].name,
    passStatus: i % 10 === 0 ? "Expired" : i % 15 === 0 ? "Pending" : "Active",
    expiryDate: i % 10 === 0 ? "Oct 01, 2023" : "Dec 31, 2023"
}));

const liveTracking = Array.from({ length: 10 }, (_, i) => ({
    id: `B-${(i + 1).toString().padStart(2, '0')}`,
    currentStop: `Stop ${Math.floor(Math.random() * 5) + 1}`,
    nextStop: `Stop ${Math.floor(Math.random() * 5) + 6}`,
    speed: `${Math.floor(Math.random() * 30) + 20} km/h`,
    status: i % 4 === 0 ? "Delayed" : "On Time",
    lat: 12.9716 + (Math.random() - 0.5) * 0.08,
    lng: 77.5946 + (Math.random() - 0.5) * 0.08
}));

const createCustomIcon = (id, status) => {
    const color = status === "Delayed" ? "#ef4444" : "#10b981";
    return L.divIcon({
        className: 'custom-bus-marker',
        html: `
      <div style="display: flex; flex-direction: column; align-items: center; transform: translateY(-100%);">
        <div style="background-color: ${color}; color: white; font-family: ${fontBody}; font-size: 10px; font-weight: 700; padding: 2px 6px; border-radius: 4px; box-shadow: 0 2px 4px rgba(0,0,0,0.2); margin-bottom: 4px; white-space: nowrap;">
          ${id}
        </div>
        <div style="height: 16px; width: 16px; background-color: ${color}; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.2);"></div>
      </div>
    `,
        iconSize: [0, 0],
        iconAnchor: [0, 0],
    });
};

const TabPanel = ({ value, id, children }) => (value === id ? <Box className="fade-up" mt={3}>{children}</Box> : null);

export default function Transport() {
    const [activeTab, setActiveTab] = useState("fleet");
    const [searchTerm, setSearchTerm] = useState("");

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
        setSearchTerm("");
    };

    return (
        <Box sx={{ p: 3, background: T.bg, minHeight: "100vh", fontFamily: fontBody }}>
            <Fonts />

            {/* ── Header ── */}
            <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3} className="fade-up">
                <Box>
                    <Typography sx={{ fontFamily: fontBody, fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: T.textMute, mb: 0.3 }}>Campus Management</Typography>
                    <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1.5rem", color: T.text, lineHeight: 1.1 }}>Transportation</Typography>
                    <Typography sx={{ fontFamily: fontBody, fontSize: "0.82rem", color: T.textSub, mt: 0.4 }}>Manage bus fleet, routes, drivers, passes, and track live locations.</Typography>
                </Box>
                <Button variant="contained" startIcon={<Add sx={{ fontSize: 16 }} />} sx={{ fontFamily: fontBody, fontWeight: 700, fontSize: "0.8rem", textTransform: "none", borderRadius: "8px", bgcolor: T.accent, boxShadow: "none" }}>Add New</Button>
            </Box>

            {/* ── Stat Cards ── */}
            <Grid container spacing={3} mb={3}>
                <Grid item xs={12} sm={6} md={3}><StatCard label="Total Buses" value={buses.length} sub={`${buses.filter(b => b.status === "On Route").length} Active, ${buses.filter(b => b.status === "Maintenance").length} Maintenance`} color={T.accent} bgLight={T.accentLight} icon={DirectionsBus} /></Grid>
                <Grid item xs={12} sm={6} md={3}><StatCard label="Active Routes" value={routes.length} sub={`Covering ${routes.reduce((acc, r) => acc + r.stops, 0)} stops`} color={T.success} bgLight={T.successLight} icon={Map} /></Grid>
                <Grid item xs={12} sm={6} md={3}><StatCard label="Drivers" value={drivers.length} sub={`${drivers.filter(d => d.status === "Active").length} On Duty, ${drivers.filter(d => d.status === "Off-Duty").length} Off Duty`} color={T.warning} bgLight={T.warningLight} icon={IdCard} /></Grid>
                <Grid item xs={12} sm={6} md={3}><StatCard label="Students Using Bus" value={students.length} sub={`${students.filter(s => s.passStatus === "Active").length} Active Passes`} color={T.info} bgLight={T.infoLight} icon={ConfirmationNumber} /></Grid>
            </Grid>

            {/* ── Tabs ── */}
            <Box sx={{ borderBottom: 1, borderColor: T.border }} className="fade-up">
                <Tabs value={activeTab} onChange={handleTabChange} TabIndicatorProps={{ sx: { bgcolor: T.accent, height: 3, borderRadius: "3px 3px 0 0" } }} sx={{ "& .MuiTab-root": { fontFamily: fontBody, fontWeight: 600, fontSize: "0.82rem", textTransform: "none", color: T.textSub, minWidth: 120 }, "& .Mui-selected": { color: `${T.accent} !important` } }}>
                    <Tab label="Bus Fleet" value="fleet" />
                    <Tab label="Routes" value="routes" />
                    <Tab label="Drivers" value="drivers" />
                    <Tab label="Student Passes" value="passes" />
                    <Tab label="Live Tracking" value="tracking" />
                </Tabs>
            </Box>

            {/* ── Tab Content: Fleet ── */}
            <TabPanel value={activeTab} id="fleet">
                <Card sx={{ borderRadius: "14px", border: `1px solid ${T.border}`, boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                    <Box sx={{ p: 2.5, borderBottom: `1px solid ${T.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
                        <Box>
                            <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1.1rem" }}>Bus Fleet</Typography>
                            <Typography sx={{ fontFamily: fontBody, fontSize: "0.78rem", color: T.textMute }}>Manage all buses and their current status.</Typography>
                        </Box>
                        <Box display="flex" gap={1.5}>
                            <TextField size="small" placeholder="Search buses..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} InputProps={{ startAdornment: <InputAdornment position="start"><Search sx={{ fontSize: 16, color: T.textMute }} /></InputAdornment> }} sx={{ width: 260, "& .MuiOutlinedInput-root": { borderRadius: "8px", fontFamily: fontBody, fontSize: "0.8rem" } }} />
                            <Button variant="outlined" sx={{ minWidth: 0, p: 1, borderRadius: "8px", borderColor: T.border, color: T.textSub }}><FilterList sx={{ fontSize: 18 }} /></Button>
                        </Box>
                    </Box>
                    <Table>
                        <TableHead><TableRow sx={{ bgcolor: "#F9FAFB" }}>
                            {["Bus Number", "Driver", "Capacity", "Route", "Status", "Actions"].map(h => <TableCell key={h} sx={{ fontFamily: fontBody, fontWeight: 700, fontSize: "0.72rem", color: T.textMute, textTransform: "uppercase", py: 1.5, ...(h === "Actions" ? { textAlign: "right" } : {}) }}>{h}</TableCell>)}
                        </TableRow></TableHead>
                        <TableBody>
                            {buses.filter(b => b.number.toLowerCase().includes(searchTerm.toLowerCase()) || b.id.toLowerCase().includes(searchTerm.toLowerCase())).map(row => (
                                <TableRow key={row.id} className="row-hover">
                                    <TableCell>
                                        <Typography sx={{ fontFamily: fontBody, fontWeight: 600, fontSize: "0.85rem", color: T.text }}>{row.number}</Typography>
                                        <Typography sx={{ fontFamily: fontMono, fontSize: "0.75rem", color: T.textSub }}>{row.id}</Typography>
                                    </TableCell>
                                    <TableCell sx={{ fontFamily: fontBody, fontSize: "0.82rem", color: T.textSub }}>{row.driver}</TableCell>
                                    <TableCell sx={{ fontFamily: fontBody, fontSize: "0.82rem", color: T.textSub }}>{row.capacity} Seats</TableCell>
                                    <TableCell sx={{ fontFamily: fontBody, fontSize: "0.82rem", color: T.textSub }}>{row.route}</TableCell>
                                    <TableCell><StatusPill status={row.status} /></TableCell>
                                    <TableCell sx={{ textAlign: "right", py: 1 }}>
                                        <IconButton size="small" sx={{ color: T.textMute }}><MoreHoriz sx={{ fontSize: 16 }} /></IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Card>
            </TabPanel>

            {/* ── Tab Content: Routes ── */}
            <TabPanel value={activeTab} id="routes">
                <Card sx={{ borderRadius: "14px", border: `1px solid ${T.border}`, boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                    <Box sx={{ p: 2.5, borderBottom: `1px solid ${T.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
                        <Box>
                            <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1.1rem" }}>Routes</Typography>
                            <Typography sx={{ fontFamily: fontBody, fontSize: "0.78rem", color: T.textMute }}>Manage bus routes, stops, and distances.</Typography>
                        </Box>
                        <TextField size="small" placeholder="Search routes..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} InputProps={{ startAdornment: <InputAdornment position="start"><Search sx={{ fontSize: 16, color: T.textMute }} /></InputAdornment> }} sx={{ width: 260, "& .MuiOutlinedInput-root": { borderRadius: "8px", fontFamily: fontBody, fontSize: "0.8rem" } }} />
                    </Box>
                    <Table>
                        <TableHead><TableRow sx={{ bgcolor: "#F9FAFB" }}>
                            {["Route Name", "Stops", "Distance", "Bus Assigned", "Actions"].map(h => <TableCell key={h} sx={{ fontFamily: fontBody, fontWeight: 700, fontSize: "0.72rem", color: T.textMute, textTransform: "uppercase", py: 1.5, ...(h === "Actions" ? { textAlign: "right" } : {}) }}>{h}</TableCell>)}
                        </TableRow></TableHead>
                        <TableBody>
                            {routes.filter(r => r.name.toLowerCase().includes(searchTerm.toLowerCase())).map(row => (
                                <TableRow key={row.id} className="row-hover">
                                    <TableCell sx={{ fontFamily: fontBody, fontWeight: 600, fontSize: "0.85rem", color: T.text }}>{row.name}</TableCell>
                                    <TableCell sx={{ fontFamily: fontBody, fontSize: "0.82rem", color: T.textSub }}>{row.stops} Stops</TableCell>
                                    <TableCell sx={{ fontFamily: fontBody, fontSize: "0.82rem", color: T.textSub }}>{row.distance}</TableCell>
                                    <TableCell><StatusPill status={row.busAssigned} variant="outline" /></TableCell>
                                    <TableCell sx={{ textAlign: "right", py: 1 }}>
                                        <IconButton size="small" sx={{ color: T.textMute }}><MoreHoriz sx={{ fontSize: 16 }} /></IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Card>
            </TabPanel>

            {/* ── Tab Content: Drivers ── */}
            <TabPanel value={activeTab} id="drivers">
                <Card sx={{ borderRadius: "14px", border: `1px solid ${T.border}`, boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                    <Box sx={{ p: 2.5, borderBottom: `1px solid ${T.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
                        <Box>
                            <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1.1rem" }}>Drivers</Typography>
                            <Typography sx={{ fontFamily: fontBody, fontSize: "0.78rem", color: T.textMute }}>Manage driver profiles and assignments.</Typography>
                        </Box>
                        <TextField size="small" placeholder="Search drivers..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} InputProps={{ startAdornment: <InputAdornment position="start"><Search sx={{ fontSize: 16, color: T.textMute }} /></InputAdornment> }} sx={{ width: 260, "& .MuiOutlinedInput-root": { borderRadius: "8px", fontFamily: fontBody, fontSize: "0.8rem" } }} />
                    </Box>
                    <Table>
                        <TableHead><TableRow sx={{ bgcolor: "#F9FAFB" }}>
                            {["Driver ID", "Name", "License No", "Phone", "Bus Assigned", "Status", "Actions"].map(h => <TableCell key={h} sx={{ fontFamily: fontBody, fontWeight: 700, fontSize: "0.72rem", color: T.textMute, textTransform: "uppercase", py: 1.5, ...(h === "Actions" ? { textAlign: "right" } : {}) }}>{h}</TableCell>)}
                        </TableRow></TableHead>
                        <TableBody>
                            {drivers.filter(d => d.name.toLowerCase().includes(searchTerm.toLowerCase()) || d.id.toLowerCase().includes(searchTerm.toLowerCase())).map(row => (
                                <TableRow key={row.id} className="row-hover">
                                    <TableCell sx={{ fontFamily: fontMono, fontWeight: 600, fontSize: "0.75rem", color: T.text }}>{row.id}</TableCell>
                                    <TableCell sx={{ fontFamily: fontBody, fontSize: "0.82rem", color: T.textSub }}>{row.name}</TableCell>
                                    <TableCell sx={{ fontFamily: fontMono, fontSize: "0.75rem", color: T.textSub }}>{row.license}</TableCell>
                                    <TableCell sx={{ fontFamily: fontMono, fontSize: "0.8rem", color: T.textSub }}>{row.phone}</TableCell>
                                    <TableCell><StatusPill status={row.busAssigned} variant="outline" /></TableCell>
                                    <TableCell><StatusPill status={row.status} /></TableCell>
                                    <TableCell sx={{ textAlign: "right", py: 1 }}>
                                        <IconButton size="small" sx={{ color: T.textMute }}><MoreHoriz sx={{ fontSize: 16 }} /></IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Card>
            </TabPanel>

            {/* ── Tab Content: Student Passes ── */}
            <TabPanel value={activeTab} id="passes">
                <Card sx={{ borderRadius: "14px", border: `1px solid ${T.border}`, boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                    <Box sx={{ p: 2.5, borderBottom: `1px solid ${T.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
                        <Box>
                            <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1.1rem" }}>Student Bus Passes</Typography>
                            <Typography sx={{ fontFamily: fontBody, fontSize: "0.78rem", color: T.textMute }}>Manage student transport registrations and pass validity.</Typography>
                        </Box>
                        <TextField size="small" placeholder="Search students..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} InputProps={{ startAdornment: <InputAdornment position="start"><Search sx={{ fontSize: 16, color: T.textMute }} /></InputAdornment> }} sx={{ width: 260, "& .MuiOutlinedInput-root": { borderRadius: "8px", fontFamily: fontBody, fontSize: "0.8rem" } }} />
                    </Box>
                    <Table>
                        <TableHead><TableRow sx={{ bgcolor: "#F9FAFB" }}>
                            {["Student ID", "Name", "Route", "Expiry Date", "Status", "Actions"].map(h => <TableCell key={h} sx={{ fontFamily: fontBody, fontWeight: 700, fontSize: "0.72rem", color: T.textMute, textTransform: "uppercase", py: 1.5, ...(h === "Actions" ? { textAlign: "right" } : {}) }}>{h}</TableCell>)}
                        </TableRow></TableHead>
                        <TableBody>
                            {students.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.id.toLowerCase().includes(searchTerm.toLowerCase())).map(row => (
                                <TableRow key={row.id} className="row-hover">
                                    <TableCell sx={{ fontFamily: fontMono, fontWeight: 600, fontSize: "0.75rem", color: T.text }}>{row.id}</TableCell>
                                    <TableCell sx={{ fontFamily: fontBody, fontSize: "0.82rem", color: T.textSub }}>{row.name}</TableCell>
                                    <TableCell sx={{ fontFamily: fontBody, fontSize: "0.82rem", color: T.textSub }}>{row.route}</TableCell>
                                    <TableCell sx={{ fontFamily: fontBody, fontSize: "0.82rem", color: T.textSub }}>{row.expiryDate}</TableCell>
                                    <TableCell><StatusPill status={row.passStatus} /></TableCell>
                                    <TableCell sx={{ textAlign: "right", py: 1 }}>
                                        <IconButton size="small" sx={{ color: T.textMute }}><MoreHoriz sx={{ fontSize: 16 }} /></IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Card>
            </TabPanel>

            {/* ── Tab Content: Live Tracking ── */}
            <TabPanel value={activeTab} id="tracking">
                <Grid container spacing={3}>
                    {/* Map Area */}
                    <Grid item xs={12} lg={8}>
                        <Card sx={{ borderRadius: "14px", border: `1px solid ${T.border}`, boxShadow: "0 1px 4px rgba(0,0,0,0.04)", overflow: "hidden", position: "relative", height: 500 }}>
                            <MapContainer center={[12.9716, 77.5946]} zoom={12} style={{ height: '100%', width: '100%', zIndex: 0 }}>
                                <TileLayer
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                    url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                                />
                                {liveTracking.map(bus => (
                                    <Marker key={bus.id} position={[bus.lat, bus.lng]} icon={createCustomIcon(bus.id, bus.status)}>
                                        <Popup>
                                            <Box sx={{ fontFamily: fontBody }}>
                                                <Typography sx={{ fontWeight: 700, fontSize: "0.85rem", color: T.text }}>{bus.id}</Typography>
                                                <Typography sx={{ fontSize: "0.75rem", color: T.textMute, mt: 0.5 }}>Speed: {bus.speed}</Typography>
                                                <Typography sx={{ fontSize: "0.75rem", color: T.textMute }}>Next Stop: {bus.nextStop}</Typography>
                                            </Box>
                                        </Popup>
                                    </Marker>
                                ))}
                            </MapContainer>
                            {/* Map Legend */}
                            <Box sx={{ position: "absolute", bottom: 16, left: 16, bgcolor: "rgba(255,255,255,0.9)", backdropFilter: "blur(4px)", p: 2, borderRadius: "8px", border: `1px solid ${T.border}`, boxShadow: "0 2px 8px rgba(0,0,0,0.05)", zIndex: 1000, fontFamily: fontBody }}>
                                <Box display="flex" alignItems="center" gap={1} mb={1}>
                                    <Box sx={{ width: 12, height: 12, borderRadius: "50%", bgcolor: T.success }} />
                                    <Typography sx={{ fontSize: "0.8rem", color: T.textSub, fontWeight: 600 }}>On Time ({liveTracking.filter(b => b.status === "On Time").length})</Typography>
                                </Box>
                                <Box display="flex" alignItems="center" gap={1} mb={1}>
                                    <Box sx={{ width: 12, height: 12, borderRadius: "50%", bgcolor: T.danger }} />
                                    <Typography sx={{ fontSize: "0.8rem", color: T.textSub, fontWeight: 600 }}>Delayed ({liveTracking.filter(b => b.status === "Delayed").length})</Typography>
                                </Box>
                                <Typography sx={{ fontSize: "0.7rem", color: T.textMute, mt: 1 }}>Map updates every 10 seconds</Typography>
                            </Box>
                        </Card>
                    </Grid>

                    {/* Tracking List Side Panel */}
                    <Grid item xs={12} lg={4}>
                        <Box sx={{ display: "flex", flexDirection: "column", height: 500 }}>
                            <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1.05rem", color: T.text, mb: 2 }}>Active Vehicles</Typography>
                            <Box sx={{ overflowY: "auto", display: "flex", flexDirection: "column", gap: 2, pr: 1 }} className="custom-scrollbar">
                                {liveTracking.map(bus => (
                                    <Card key={bus.id} sx={{ p: 2, borderRadius: "12px", border: `1px solid ${T.border}`, boxShadow: "none" }}>
                                        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                                            <Box display="flex" gap={1.5}>
                                                <Box sx={{ p: 1, borderRadius: "8px", bgcolor: `${T.accent}15`, color: T.accent, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                    <DirectionsBus sx={{ fontSize: 18 }} />
                                                </Box>
                                                <Box>
                                                    <Typography sx={{ fontFamily: fontMono, fontWeight: 700, fontSize: "0.9rem", color: T.text, lineHeight: 1.2 }}>{bus.id}</Typography>
                                                    <Typography sx={{ fontFamily: fontBody, fontSize: "0.75rem", color: T.textMute, mt: 0.2 }}>Speed: {bus.speed}</Typography>
                                                </Box>
                                            </Box>
                                            <StatusPill status={bus.status} />
                                        </Box>
                                        {/* Timeline */}
                                        <Box sx={{ position: "relative", pl: 1.5, ml: 1, borderLeft: `2px dashed ${T.border}` }}>
                                            <Box sx={{ position: "relative", mb: 2 }}>
                                                <Box sx={{ position: "absolute", left: -18, top: 2, width: 10, height: 10, borderRadius: "50%", border: `2px solid ${T.accent}`, bgcolor: T.surface, zIndex: 1 }} />
                                                <Typography sx={{ fontFamily: fontBody, fontSize: "0.7rem", color: T.textMute, fontWeight: 600 }}>Current Stop</Typography>
                                                <Typography sx={{ fontFamily: fontBody, fontSize: "0.85rem", color: T.text, fontWeight: 600 }}>{bus.currentStop}</Typography>
                                            </Box>
                                            <Box sx={{ position: "relative" }}>
                                                <Box sx={{ position: "absolute", left: -18, top: 2, width: 10, height: 10, borderRadius: "50%", border: `2px solid ${T.textMute}`, bgcolor: T.surface, zIndex: 1 }} />
                                                <Typography sx={{ fontFamily: fontBody, fontSize: "0.7rem", color: T.textMute, fontWeight: 600 }}>Next Stop</Typography>
                                                <Typography sx={{ fontFamily: fontBody, fontSize: "0.85rem", color: T.textMute, fontWeight: 600 }}>{bus.nextStop}</Typography>
                                            </Box>
                                        </Box>
                                    </Card>
                                ))}
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </TabPanel>
        </Box>
    );
}
