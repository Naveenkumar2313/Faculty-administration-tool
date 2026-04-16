import React, { useState } from "react";
import {
    Box, Card, Grid, Typography, Button, TextField, Table, TableBody, TableCell,
    TableHead, TableRow, IconButton, InputAdornment, Chip, Dialog,
    DialogTitle, DialogContent, DialogActions, Tooltip
} from "@mui/material";
import {
    Search, Add, Route, LocationOn, People, Map, Close, Visibility,
    Edit, AccessTime
} from "@mui/icons-material";
import { T, fontHead, fontBody, fontMono, Fonts, routes, statusColors } from "./transportAdminShared";

const SLabel = ({ children, sx = {} }) => (
    <Typography sx={{ fontFamily: fontBody, fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: T.textMute, mb: 0.5, ...sx }}>{children}</Typography>
);
const StatusPill = ({ status, variant }) => {
    const s = variant === "outline" ? { bg: "transparent", color: T.textSub, border: `1px solid ${T.border}` } : (statusColors[status] || { bg: T.bg, color: T.textSub });
    return (
        <Box sx={{ px: 1.2, py: 0.4, borderRadius: "6px", bgcolor: s.bg, border: s.border, width: "fit-content", display: "inline-block" }}>
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

const generateStops = (routeId, count) => Array.from({ length: count }, (_, i) => ({
    name: `Stop ${i + 1} - ${["Main Gate", "Library Junction", "Engineering Block", "Science Center", "Admin Building", "Sports Complex", "Hostel A", "Hostel B", "Medical Center", "Bus Terminal"][i % 10]}`,
    time: `${6 + Math.floor(i * 0.5)}:${i % 2 === 0 ? "30" : "00"} AM`,
    distance: `${(i * 1.2 + 0.5).toFixed(1)} km`,
    students: Math.floor(Math.random() * 15) + 3,
}));

export default function RouteManagement() {
    const [searchTerm, setSearchTerm] = useState("");
    const [detailRoute, setDetailRoute] = useState(null);

    const filtered = routes.filter(r => r.name.toLowerCase().includes(searchTerm.toLowerCase()) || r.id.toLowerCase().includes(searchTerm.toLowerCase()));
    const totalStops = routes.reduce((a, r) => a + r.stops, 0);
    const totalStudents = routes.reduce((a, r) => a + r.studentsOnRoute, 0);
    const totalDistKm = routes.reduce((a, r) => a + parseInt(r.distance), 0);

    return (
        <Box sx={{ p: 3, background: T.bg, minHeight: "100vh", fontFamily: fontBody }}>
            <style>{Fonts()}</style>

            <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3} className="fade-up">
                <Box>
                    <Typography sx={{ fontFamily: fontBody, fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: T.textMute, mb: 0.3 }}>Fleet & Routes · Routes & Schedules</Typography>
                    <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1.5rem", color: T.text, lineHeight: 1.1 }}>Route Management</Typography>
                    <Typography sx={{ fontFamily: fontBody, fontSize: "0.82rem", color: T.textSub, mt: 0.4 }}>Create and edit bus routes with stops, timings, and assigned buses.</Typography>
                </Box>
                <Button variant="contained" startIcon={<Add sx={{ fontSize: 16 }} />} sx={{ fontFamily: fontBody, fontWeight: 700, fontSize: "0.8rem", textTransform: "none", borderRadius: "8px", bgcolor: T.accent, boxShadow: "none", "&:hover": { bgcolor: "#5558e6" } }}>Create Route</Button>
            </Box>

            <Grid container spacing={2.5} mb={3}>
                <Grid item xs={6} sm={3}><StatCard label="Total Routes" value={routes.length} sub={`${routes.filter(r => r.status === "Active").length} active`} color={T.accent} bgLight={T.accentLight} icon={Route} /></Grid>
                <Grid item xs={6} sm={3}><StatCard label="Total Stops" value={totalStops} sub="Across all routes" color={T.success} bgLight={T.successLight} icon={LocationOn} /></Grid>
                <Grid item xs={6} sm={3}><StatCard label="Students Covered" value={totalStudents} sub="Using bus transport" color={T.info} bgLight={T.infoLight} icon={People} /></Grid>
                <Grid item xs={6} sm={3}><StatCard label="Total Coverage" value={`${totalDistKm} km`} sub="Combined route length" color={T.warning} bgLight={T.warningLight} icon={Map} /></Grid>
            </Grid>

            <Card className="fade-up" sx={{ borderRadius: "14px", border: `1px solid ${T.border}`, boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                <Box sx={{ p: 2.5, borderBottom: `1px solid ${T.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
                    <Box>
                        <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1.1rem" }}>All Routes</Typography>
                        <Typography sx={{ fontFamily: fontBody, fontSize: "0.78rem", color: T.textMute }}>{filtered.length} routes configured</Typography>
                    </Box>
                    <TextField size="small" placeholder="Search routes..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                        InputProps={{ startAdornment: <InputAdornment position="start"><Search sx={{ fontSize: 16, color: T.textMute }} /></InputAdornment> }}
                        sx={{ width: 260, "& .MuiOutlinedInput-root": { borderRadius: "8px", fontFamily: fontBody, fontSize: "0.8rem" } }} />
                </Box>
                <Box sx={{ overflowX: "auto" }}>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ bgcolor: "#F9FAFB" }}>
                                {["Route", "Stops", "Distance", "Duration", "Students", "Frequency", "Bus", "Status", "Actions"].map(h => (
                                    <TableCell key={h} sx={{ fontFamily: fontBody, fontWeight: 700, fontSize: "0.72rem", color: T.textMute, textTransform: "uppercase", py: 1.5, whiteSpace: "nowrap", ...(h === "Actions" ? { textAlign: "right" } : {}) }}>{h}</TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filtered.map(row => (
                                <TableRow key={row.id} className="row-hover" sx={{ cursor: "pointer" }} onClick={() => setDetailRoute(row)}>
                                    <TableCell>
                                        <Typography sx={{ fontFamily: fontBody, fontWeight: 600, fontSize: "0.85rem", color: T.text }}>{row.name}</Typography>
                                        <Typography sx={{ fontFamily: fontMono, fontSize: "0.7rem", color: T.textMute }}>{row.id}</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Chip icon={<LocationOn sx={{ fontSize: 12 }} />} label={`${row.stops} stops`} size="small"
                                            sx={{ fontFamily: fontBody, fontSize: "0.72rem", bgcolor: T.accentLight, color: T.accent, border: "none", height: 24 }} />
                                    </TableCell>
                                    <TableCell sx={{ fontFamily: fontMono, fontSize: "0.82rem", color: T.textSub }}>{row.distance}</TableCell>
                                    <TableCell>
                                        <Box display="flex" alignItems="center" gap={0.5}>
                                            <AccessTime sx={{ fontSize: 14, color: T.textMute }} />
                                            <Typography sx={{ fontFamily: fontBody, fontSize: "0.82rem", color: T.textSub }}>{row.duration}</Typography>
                                        </Box>
                                    </TableCell>
                                    <TableCell sx={{ fontFamily: fontMono, fontSize: "0.82rem", color: T.text, fontWeight: 600 }}>{row.studentsOnRoute}</TableCell>
                                    <TableCell sx={{ fontFamily: fontBody, fontSize: "0.78rem", color: T.textMute }}>{row.frequency}</TableCell>
                                    <TableCell><StatusPill status={row.busAssigned} variant="outline" /></TableCell>
                                    <TableCell><StatusPill status={row.status} /></TableCell>
                                    <TableCell sx={{ textAlign: "right", py: 1 }}>
                                        <Tooltip title="View"><IconButton size="small" sx={{ color: T.accent }}><Visibility sx={{ fontSize: 16 }} /></IconButton></Tooltip>
                                        <Tooltip title="Edit"><IconButton size="small" sx={{ color: T.textMute }}><Edit sx={{ fontSize: 16 }} /></IconButton></Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Box>
            </Card>

            <Dialog open={!!detailRoute} onClose={() => setDetailRoute(null)} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: "16px" } }}>
                {detailRoute && (<>
                    <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontFamily: fontHead, fontWeight: 700 }}>
                        {detailRoute.name}
                        <IconButton onClick={() => setDetailRoute(null)}><Close /></IconButton>
                    </DialogTitle>
                    <DialogContent dividers>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={5}>
                                <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "0.95rem", mb: 2 }}>Route Information</Typography>
                                <Grid container spacing={1.5}>
                                    {[
                                        { label: "Route ID", value: detailRoute.id },
                                        { label: "Distance", value: detailRoute.distance },
                                        { label: "Duration", value: detailRoute.duration },
                                        { label: "Stops", value: detailRoute.stops },
                                        { label: "Students", value: detailRoute.studentsOnRoute },
                                        { label: "Frequency", value: detailRoute.frequency },
                                        { label: "First Trip", value: detailRoute.firstTrip },
                                        { label: "Last Trip", value: detailRoute.lastTrip },
                                        { label: "Bus", value: detailRoute.busAssigned },
                                    ].map(item => (
                                        <Grid item xs={6} key={item.label}>
                                            <SLabel>{item.label}</SLabel>
                                            <Typography sx={{ fontFamily: fontBody, fontSize: "0.85rem", color: T.text, fontWeight: 600 }}>{item.value}</Typography>
                                        </Grid>
                                    ))}
                                </Grid>
                            </Grid>
                            <Grid item xs={12} md={7}>
                                <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "0.95rem", mb: 2 }}>Stop Timeline</Typography>
                                <Box sx={{ pl: 2, borderLeft: `2px solid ${T.border}`, position: "relative" }}>
                                    {generateStops(detailRoute.id, detailRoute.stops).map((stop, i) => (
                                        <Box key={i} sx={{ position: "relative", mb: 2.5, pl: 2 }}>
                                            <Box sx={{ position: "absolute", left: -26, top: 4, width: 12, height: 12, borderRadius: "50%", border: `2px solid ${i === 0 ? T.success : T.accent}`, bgcolor: i === 0 ? T.success : T.surface, zIndex: 1 }} />
                                            <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                                                <Box>
                                                    <Typography sx={{ fontFamily: fontBody, fontSize: "0.85rem", fontWeight: 600, color: T.text }}>{stop.name}</Typography>
                                                    <Box display="flex" gap={1.5} mt={0.3}>
                                                        <Typography sx={{ fontFamily: fontMono, fontSize: "0.7rem", color: T.textMute }}>{stop.time}</Typography>
                                                        <Typography sx={{ fontFamily: fontMono, fontSize: "0.7rem", color: T.textMute }}>{stop.distance}</Typography>
                                                    </Box>
                                                </Box>
                                                <Chip label={`${stop.students} students`} size="small" sx={{ fontFamily: fontBody, fontSize: "0.65rem", bgcolor: T.accentLight, color: T.accent, height: 20 }} />
                                            </Box>
                                        </Box>
                                    ))}
                                </Box>
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions sx={{ p: 2 }}>
                        <Button onClick={() => setDetailRoute(null)} sx={{ fontFamily: fontBody, textTransform: "none" }}>Close</Button>
                        <Button variant="contained" sx={{ fontFamily: fontBody, textTransform: "none", bgcolor: T.accent, borderRadius: "8px" }}>Edit Route</Button>
                    </DialogActions>
                </>)}
            </Dialog>
        </Box>
    );
}
