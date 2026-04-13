import React, { useState } from "react";
import {
    Box, Card, Grid, Typography, Button, TextField, Table, TableBody, TableCell,
    TableHead, TableRow, IconButton, InputAdornment, Chip, Avatar, Dialog,
    DialogTitle, DialogContent, DialogActions, MenuItem, Select, FormControl,
    InputLabel, LinearProgress, Tooltip
} from "@mui/material";
import {
    Search, FilterList, MoreHoriz, DirectionsBus, Add, Edit, Delete,
    LocalGasStation, Speed, CalendarMonth, Build, Close, Visibility,
    KeyboardArrowUp, KeyboardArrowDown, Map
} from "@mui/icons-material";
import { T, fontHead, fontBody, fontMono, Fonts, buses, routes, drivers, statusColors } from "./transportShared";

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

const StatCard = ({ label, value, sub, color, icon: Icon, bgLight, trend }) => (
    <Card className="fade-up" sx={{ p: 2.5, borderRadius: "14px", border: `1px solid ${T.border}`, background: T.surface, boxShadow: "0 1px 4px rgba(0,0,0,0.04)", height: "100%", transition: "all 0.25s ease", "&:hover": { transform: "translateY(-2px)", boxShadow: "0 4px 20px rgba(99,102,241,0.08)", borderColor: "rgba(99,102,241,0.2)" } }}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
            <Box>
                <SLabel>{label}</SLabel>
                <Typography sx={{ fontFamily: fontMono, fontWeight: 700, fontSize: "1.8rem", color: color || T.text, lineHeight: 1.1 }}>{value}</Typography>
                {sub && <Typography sx={{ fontFamily: fontBody, fontSize: "0.72rem", color: T.textMute, mt: 0.4 }}>{sub}</Typography>}
                {trend && (
                    <Box display="flex" alignItems="center" gap={0.3} mt={0.5}>
                        {trend.up ? <KeyboardArrowUp sx={{ fontSize: 14, color: T.success }} /> : <KeyboardArrowDown sx={{ fontSize: 14, color: T.danger }} />}
                        <Typography sx={{ fontFamily: fontMono, fontSize: "0.65rem", fontWeight: 600, color: trend.up ? T.success : T.danger }}>{trend.value}</Typography>
                    </Box>
                )}
            </Box>
            {Icon && <Box sx={{ p: 1.2, borderRadius: "10px", bgcolor: bgLight || `${color}15`, color: color }}><Icon sx={{ fontSize: 22 }} /></Box>}
        </Box>
    </Card>
);

export default function BusFleetView() {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [detailBus, setDetailBus] = useState(null);

    const filtered = buses.filter(b => {
        const matchSearch = b.number.toLowerCase().includes(searchTerm.toLowerCase()) || b.id.toLowerCase().includes(searchTerm.toLowerCase()) || b.driver.toLowerCase().includes(searchTerm.toLowerCase());
        const matchStatus = statusFilter === "All" || b.status === statusFilter;
        return matchSearch && matchStatus;
    });

    const onRoute = buses.filter(b => b.status === "On Route").length;
    const idle = buses.filter(b => b.status === "Idle").length;
    const maintenance = buses.filter(b => b.status === "Maintenance").length;
    const avgOccupancy = Math.round(buses.reduce((a, b) => a + b.occupancy, 0) / buses.length);

    return (
        <Box sx={{ p: 3, background: T.bg, minHeight: "100vh", fontFamily: fontBody }}>
            <style>{Fonts()}</style>

            {/* ── Header ── */}
            <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3} className="fade-up">
                <Box>
                    <Typography sx={{ fontFamily: fontBody, fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: T.textMute, mb: 0.3 }}>Transportation · Fleet</Typography>
                    <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1.5rem", color: T.text, lineHeight: 1.1 }}>Bus Fleet Management</Typography>
                    <Typography sx={{ fontFamily: fontBody, fontSize: "0.82rem", color: T.textSub, mt: 0.4 }}>Monitor and manage all campus buses, their assignments, maintenance, and utilization.</Typography>
                </Box>
                <Button variant="contained" startIcon={<Add sx={{ fontSize: 16 }} />} sx={{ fontFamily: fontBody, fontWeight: 700, fontSize: "0.8rem", textTransform: "none", borderRadius: "8px", bgcolor: T.accent, boxShadow: "none", "&:hover": { bgcolor: "#5558e6" } }}>Add Bus</Button>
            </Box>

            {/* ── Stats ── */}
            <Grid container spacing={2.5} mb={3}>
                <Grid item xs={6} sm={3}><StatCard label="Total Buses" value={buses.length} sub={`${onRoute} on route right now`} color={T.accent} bgLight={T.accentLight} icon={DirectionsBus} trend={{ up: true, value: "+2 this month" }} /></Grid>
                <Grid item xs={6} sm={3}><StatCard label="On Route" value={onRoute} sub="Currently in service" color={T.success} bgLight={T.successLight} icon={Map} /></Grid>
                <Grid item xs={6} sm={3}><StatCard label="Avg. Occupancy" value={`${avgOccupancy}%`} sub={`${avgOccupancy} of 50 seats avg.`} color={T.info} bgLight={T.infoLight} icon={Speed} /></Grid>
                <Grid item xs={6} sm={3}><StatCard label="In Maintenance" value={maintenance} sub={`${idle} idle`} color={T.danger} bgLight={T.dangerLight} icon={Build} trend={{ up: false, value: "1 overdue" }} /></Grid>
            </Grid>

            {/* ── Table ── */}
            <Card className="fade-up" sx={{ borderRadius: "14px", border: `1px solid ${T.border}`, boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                <Box sx={{ p: 2.5, borderBottom: `1px solid ${T.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
                    <Box>
                        <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1.1rem" }}>Bus Fleet</Typography>
                        <Typography sx={{ fontFamily: fontBody, fontSize: "0.78rem", color: T.textMute }}>{filtered.length} of {buses.length} buses</Typography>
                    </Box>
                    <Box display="flex" gap={1.5} alignItems="center">
                        <FormControl size="small" sx={{ minWidth: 130 }}>
                            <Select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} sx={{ borderRadius: "8px", fontFamily: fontBody, fontSize: "0.8rem" }}>
                                <MenuItem value="All">All Status</MenuItem>
                                <MenuItem value="On Route">On Route</MenuItem>
                                <MenuItem value="Idle">Idle</MenuItem>
                                <MenuItem value="Maintenance">Maintenance</MenuItem>
                            </Select>
                        </FormControl>
                        <TextField size="small" placeholder="Search buses..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                            InputProps={{ startAdornment: <InputAdornment position="start"><Search sx={{ fontSize: 16, color: T.textMute }} /></InputAdornment> }}
                            sx={{ width: 260, "& .MuiOutlinedInput-root": { borderRadius: "8px", fontFamily: fontBody, fontSize: "0.8rem" } }} />
                    </Box>
                </Box>

                <Box sx={{ overflowX: "auto" }}>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ bgcolor: "#F9FAFB" }}>
                                {["Bus ID / Number", "Make & Year", "Driver", "Route", "Capacity", "Fuel", "Status", "Actions"].map(h => (
                                    <TableCell key={h} sx={{ fontFamily: fontBody, fontWeight: 700, fontSize: "0.72rem", color: T.textMute, textTransform: "uppercase", py: 1.5, whiteSpace: "nowrap", ...(h === "Actions" ? { textAlign: "right" } : {}) }}>{h}</TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filtered.map(row => (
                                <TableRow key={row.id} className="row-hover" sx={{ cursor: "pointer" }} onClick={() => setDetailBus(row)}>
                                    <TableCell>
                                        <Typography sx={{ fontFamily: fontBody, fontWeight: 600, fontSize: "0.85rem", color: T.text }}>{row.number}</Typography>
                                        <Typography sx={{ fontFamily: fontMono, fontSize: "0.7rem", color: T.textMute }}>{row.id}</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography sx={{ fontFamily: fontBody, fontSize: "0.82rem", color: T.textSub }}>{row.make}</Typography>
                                        <Typography sx={{ fontFamily: fontMono, fontSize: "0.7rem", color: T.textMute }}>{row.year}</Typography>
                                    </TableCell>
                                    <TableCell sx={{ fontFamily: fontBody, fontSize: "0.82rem", color: T.textSub }}>{row.driver}</TableCell>
                                    <TableCell>
                                        <Typography sx={{ fontFamily: fontBody, fontSize: "0.8rem", color: T.textSub, maxWidth: 180 }} noWrap>{row.route}</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Box>
                                            <Typography sx={{ fontFamily: fontMono, fontSize: "0.78rem", color: T.text, fontWeight: 600 }}>{row.occupancy}/{row.capacity}</Typography>
                                            <LinearProgress
                                                variant="determinate"
                                                value={(row.occupancy / row.capacity) * 100}
                                                sx={{ mt: 0.5, height: 4, borderRadius: 2, bgcolor: T.border, "& .MuiLinearProgress-bar": { bgcolor: (row.occupancy / row.capacity) > 0.8 ? T.danger : T.success, borderRadius: 2 } }} />
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Chip icon={<LocalGasStation sx={{ fontSize: 12 }} />} label={row.fuelLevel} size="small"
                                            sx={{ fontFamily: fontMono, fontSize: "0.7rem", fontWeight: 600, bgcolor: parseInt(row.fuelLevel) < 50 ? T.warningLight : T.successLight, color: parseInt(row.fuelLevel) < 50 ? T.warning : T.success, border: "none", height: 24 }} />
                                    </TableCell>
                                    <TableCell><StatusPill status={row.status} /></TableCell>
                                    <TableCell sx={{ textAlign: "right", py: 1 }}>
                                        <Tooltip title="View Details"><IconButton size="small" sx={{ color: T.accent }}><Visibility sx={{ fontSize: 16 }} /></IconButton></Tooltip>
                                        <Tooltip title="Edit"><IconButton size="small" sx={{ color: T.textMute }}><Edit sx={{ fontSize: 16 }} /></IconButton></Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Box>
            </Card>

            {/* ── Detail Dialog ── */}
            <Dialog open={!!detailBus} onClose={() => setDetailBus(null)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: "16px" } }}>
                {detailBus && (<>
                    <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontFamily: fontHead, fontWeight: 700 }}>
                        Bus Details — {detailBus.number}
                        <IconButton onClick={() => setDetailBus(null)}><Close /></IconButton>
                    </DialogTitle>
                    <DialogContent dividers>
                        <Grid container spacing={2}>
                            {[
                                { label: "Bus ID", value: detailBus.id },
                                { label: "Registration", value: detailBus.number },
                                { label: "Make", value: detailBus.make },
                                { label: "Year", value: detailBus.year },
                                { label: "Driver", value: detailBus.driver },
                                { label: "Route", value: detailBus.route },
                                { label: "Capacity", value: `${detailBus.capacity} seats` },
                                { label: "Current Occupancy", value: `${detailBus.occupancy} passengers` },
                                { label: "Fuel Level", value: detailBus.fuelLevel },
                                { label: "Total Mileage", value: detailBus.mileage },
                                { label: "Last Service", value: detailBus.lastService },
                                { label: "Next Service", value: detailBus.nextService },
                                { label: "Insurance Expiry", value: detailBus.insuranceExpiry },
                                { label: "Status", value: detailBus.status },
                            ].map(item => (
                                <Grid item xs={6} key={item.label}>
                                    <SLabel>{item.label}</SLabel>
                                    <Typography sx={{ fontFamily: fontBody, fontSize: "0.88rem", color: T.text, fontWeight: 600 }}>{item.value}</Typography>
                                </Grid>
                            ))}
                        </Grid>
                    </DialogContent>
                    <DialogActions sx={{ p: 2 }}>
                        <Button onClick={() => setDetailBus(null)} sx={{ fontFamily: fontBody, textTransform: "none" }}>Close</Button>
                        <Button variant="contained" sx={{ fontFamily: fontBody, textTransform: "none", bgcolor: T.accent, borderRadius: "8px" }}>Edit Bus</Button>
                    </DialogActions>
                </>)}
            </Dialog>
        </Box>
    );
}
