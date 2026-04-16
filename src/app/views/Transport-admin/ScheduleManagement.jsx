import React, { useState } from "react";
import {
    Box, Card, Grid, Typography, Button, TextField, Table, TableBody, TableCell,
    TableHead, TableRow, IconButton, InputAdornment, Chip, Dialog,
    DialogTitle, DialogContent, DialogActions, MenuItem, Select, FormControl, Tooltip
} from "@mui/material";
import {
    Search, Add, Schedule, Close, Visibility, Edit, DirectionsBus,
    AccessTime, People, Route
} from "@mui/icons-material";
import { T, fontHead, fontBody, fontMono, Fonts, schedules, statusColors } from "./transportAdminShared";

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

export default function ScheduleManagement() {
    const [searchTerm, setSearchTerm] = useState("");
    const [typeFilter, setTypeFilter] = useState("All");
    const [detailSchedule, setDetailSchedule] = useState(null);

    const filtered = schedules.filter(s => {
        const matchSearch = s.routeName.toLowerCase().includes(searchTerm.toLowerCase()) || s.driverName.toLowerCase().includes(searchTerm.toLowerCase()) || s.id.toLowerCase().includes(searchTerm.toLowerCase());
        const matchType = typeFilter === "All" || s.tripType === typeFilter;
        return matchSearch && matchType;
    });

    const activeTrips = schedules.filter(s => s.status === "Active").length;
    const totalPassengers = schedules.reduce((a, s) => a + s.passengers, 0);
    const pickupTrips = schedules.filter(s => s.tripType === "Pickup").length;
    const returnTrips = schedules.filter(s => s.tripType === "Return").length;

    return (
        <Box sx={{ p: 3, background: T.bg, minHeight: "100vh", fontFamily: fontBody }}>
            <style>{Fonts()}</style>

            <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3} className="fade-up">
                <Box>
                    <Typography sx={{ fontFamily: fontBody, fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: T.textMute, mb: 0.3 }}>Fleet & Routes · Routes & Schedules</Typography>
                    <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1.5rem", color: T.text, lineHeight: 1.1 }}>Schedule Management</Typography>
                    <Typography sx={{ fontFamily: fontBody, fontSize: "0.82rem", color: T.textSub, mt: 0.4 }}>Define trip schedules — departure and arrival times per route.</Typography>
                </Box>
                <Button variant="contained" startIcon={<Add sx={{ fontSize: 16 }} />} sx={{ fontFamily: fontBody, fontWeight: 700, fontSize: "0.8rem", textTransform: "none", borderRadius: "8px", bgcolor: T.accent, boxShadow: "none", "&:hover": { bgcolor: "#5558e6" } }}>Add Schedule</Button>
            </Box>

            <Grid container spacing={2.5} mb={3}>
                <Grid item xs={6} sm={3}><StatCard label="Total Trips" value={schedules.length} sub={`${activeTrips} active`} color={T.accent} bgLight={T.accentLight} icon={Schedule} /></Grid>
                <Grid item xs={6} sm={3}><StatCard label="Pickup Trips" value={pickupTrips} sub="Morning routes" color={T.success} bgLight={T.successLight} icon={DirectionsBus} /></Grid>
                <Grid item xs={6} sm={3}><StatCard label="Return Trips" value={returnTrips} sub="Evening routes" color={T.info} bgLight={T.infoLight} icon={Route} /></Grid>
                <Grid item xs={6} sm={3}><StatCard label="Total Passengers" value={totalPassengers} sub="Across all trips" color={T.warning} bgLight={T.warningLight} icon={People} /></Grid>
            </Grid>

            <Card className="fade-up" sx={{ borderRadius: "14px", border: `1px solid ${T.border}`, boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                <Box sx={{ p: 2.5, borderBottom: `1px solid ${T.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
                    <Box>
                        <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1.1rem" }}>Trip Schedules</Typography>
                        <Typography sx={{ fontFamily: fontBody, fontSize: "0.78rem", color: T.textMute }}>{filtered.length} trips configured</Typography>
                    </Box>
                    <Box display="flex" gap={1.5}>
                        <FormControl size="small" sx={{ minWidth: 120 }}>
                            <Select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} sx={{ borderRadius: "8px", fontFamily: fontBody, fontSize: "0.8rem" }}>
                                <MenuItem value="All">All Types</MenuItem>
                                <MenuItem value="Pickup">Pickup</MenuItem>
                                <MenuItem value="Return">Return</MenuItem>
                            </Select>
                        </FormControl>
                        <TextField size="small" placeholder="Search..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                            InputProps={{ startAdornment: <InputAdornment position="start"><Search sx={{ fontSize: 16, color: T.textMute }} /></InputAdornment> }}
                            sx={{ width: 260, "& .MuiOutlinedInput-root": { borderRadius: "8px", fontFamily: fontBody, fontSize: "0.8rem" } }} />
                    </Box>
                </Box>
                <Box sx={{ overflowX: "auto" }}>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ bgcolor: "#F9FAFB" }}>
                                {["ID", "Route", "Bus", "Driver", "Departure", "Arrival", "Type", "Passengers", "Status", "Actions"].map(h => (
                                    <TableCell key={h} sx={{ fontFamily: fontBody, fontWeight: 700, fontSize: "0.72rem", color: T.textMute, textTransform: "uppercase", py: 1.5, whiteSpace: "nowrap", ...(h === "Actions" ? { textAlign: "right" } : {}) }}>{h}</TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filtered.map(row => (
                                <TableRow key={row.id} className="row-hover" sx={{ cursor: "pointer" }} onClick={() => setDetailSchedule(row)}>
                                    <TableCell sx={{ fontFamily: fontMono, fontWeight: 600, fontSize: "0.78rem", color: T.text }}>{row.id}</TableCell>
                                    <TableCell><Typography sx={{ fontFamily: fontBody, fontSize: "0.8rem", color: T.textSub, maxWidth: 180 }} noWrap>{row.routeName}</Typography></TableCell>
                                    <TableCell sx={{ fontFamily: fontMono, fontSize: "0.82rem", color: T.text, fontWeight: 600 }}>{row.busId}</TableCell>
                                    <TableCell sx={{ fontFamily: fontBody, fontSize: "0.82rem", color: T.textSub }}>{row.driverName}</TableCell>
                                    <TableCell>
                                        <Box display="flex" alignItems="center" gap={0.5}>
                                            <AccessTime sx={{ fontSize: 14, color: T.success }} />
                                            <Typography sx={{ fontFamily: fontMono, fontSize: "0.82rem", color: T.success, fontWeight: 600 }}>{row.departure}</Typography>
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Box display="flex" alignItems="center" gap={0.5}>
                                            <AccessTime sx={{ fontSize: 14, color: T.textMute }} />
                                            <Typography sx={{ fontFamily: fontMono, fontSize: "0.82rem", color: T.textSub }}>{row.arrival}</Typography>
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Chip label={row.tripType} size="small" sx={{ fontFamily: fontBody, fontSize: "0.7rem", bgcolor: row.tripType === "Pickup" ? T.successLight : T.infoLight, color: row.tripType === "Pickup" ? T.success : T.info, height: 22 }} />
                                    </TableCell>
                                    <TableCell sx={{ fontFamily: fontMono, fontSize: "0.82rem", color: T.text, fontWeight: 600 }}>{row.passengers}</TableCell>
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

            <Dialog open={!!detailSchedule} onClose={() => setDetailSchedule(null)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: "16px" } }}>
                {detailSchedule && (<>
                    <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontFamily: fontHead, fontWeight: 700 }}>
                        Schedule — {detailSchedule.id}
                        <IconButton onClick={() => setDetailSchedule(null)}><Close /></IconButton>
                    </DialogTitle>
                    <DialogContent dividers>
                        <Grid container spacing={2}>
                            {[
                                { label: "Schedule ID", value: detailSchedule.id },
                                { label: "Route", value: detailSchedule.routeName },
                                { label: "Route ID", value: detailSchedule.routeId },
                                { label: "Bus ID", value: detailSchedule.busId },
                                { label: "Driver", value: detailSchedule.driverName },
                                { label: "Departure", value: detailSchedule.departure },
                                { label: "Arrival", value: detailSchedule.arrival },
                                { label: "Trip Type", value: detailSchedule.tripType },
                                { label: "Passengers", value: detailSchedule.passengers },
                                { label: "Status", value: detailSchedule.status },
                            ].map(item => (
                                <Grid item xs={6} key={item.label}>
                                    <SLabel>{item.label}</SLabel>
                                    <Typography sx={{ fontFamily: fontBody, fontSize: "0.88rem", color: T.text, fontWeight: 600 }}>{item.value}</Typography>
                                </Grid>
                            ))}
                        </Grid>
                    </DialogContent>
                    <DialogActions sx={{ p: 2 }}>
                        <Button onClick={() => setDetailSchedule(null)} sx={{ fontFamily: fontBody, textTransform: "none" }}>Close</Button>
                        <Button variant="contained" sx={{ fontFamily: fontBody, textTransform: "none", bgcolor: T.accent, borderRadius: "8px" }}>Edit Schedule</Button>
                    </DialogActions>
                </>)}
            </Dialog>
        </Box>
    );
}
