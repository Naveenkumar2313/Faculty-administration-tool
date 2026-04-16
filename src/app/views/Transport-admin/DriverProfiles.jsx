import React, { useState } from "react";
import {
    Box, Card, Grid, Typography, Button, TextField, Table, TableBody, TableCell,
    TableHead, TableRow, IconButton, InputAdornment, Avatar, Dialog,
    DialogTitle, DialogContent, DialogActions, Tooltip, Rating, FormControl,
    Select, MenuItem
} from "@mui/material";
import {
    Search, Add, Badge as IdCard, Star, Close, Visibility, Edit,
    Warning, TrendingUp, Phone
} from "@mui/icons-material";
import { T, fontHead, fontBody, fontMono, Fonts, drivers, statusColors } from "./transportAdminShared";

const SLabel = ({ children, sx = {} }) => (
    <Typography sx={{ fontFamily: fontBody, fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: T.textMute, mb: 0.5, ...sx }}>{children}</Typography>
);
const StatusPill = ({ status, variant }) => {
    const s = variant === "outline" ? { bg: "transparent", color: T.textSub, border: `1px solid ${T.border}` } : (statusColors[status] || { bg: T.bg, color: T.textSub });
    return (
        <Box sx={{ px: 1.2, py: 0.4, borderRadius: "6px", bgcolor: s.bg, border: s.border, width: "fit-content", display: "inline-flex", alignItems: "center", gap: 0.5 }}>
            {!variant && <Box sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: s.color }} />}
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

export default function DriverProfiles() {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [detailDriver, setDetailDriver] = useState(null);

    const filtered = drivers.filter(d => {
        const matchSearch = d.name.toLowerCase().includes(searchTerm.toLowerCase()) || d.id.toLowerCase().includes(searchTerm.toLowerCase()) || d.license.toLowerCase().includes(searchTerm.toLowerCase());
        const matchStatus = statusFilter === "All" || d.status === statusFilter;
        return matchSearch && matchStatus;
    });

    const activeDrivers = drivers.filter(d => d.status === "Active").length;
    const avgRating = (drivers.reduce((a, d) => a + parseFloat(d.rating), 0) / drivers.length).toFixed(1);
    const totalTrips = drivers.reduce((a, d) => a + d.tripsToday, 0);
    const violations = drivers.reduce((a, d) => a + d.violations, 0);

    return (
        <Box sx={{ p: 3, background: T.bg, minHeight: "100vh", fontFamily: fontBody }}>
            <style>{Fonts()}</style>

            <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3} className="fade-up">
                <Box>
                    <Typography sx={{ fontFamily: fontBody, fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: T.textMute, mb: 0.3 }}>Drivers & Passes · Driver Management</Typography>
                    <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1.5rem", color: T.text, lineHeight: 1.1 }}>Driver Profiles</Typography>
                    <Typography sx={{ fontFamily: fontBody, fontSize: "0.82rem", color: T.textSub, mt: 0.4 }}>Contact info, license validity, assigned routes, and shift schedules.</Typography>
                </Box>
                <Button variant="contained" startIcon={<Add sx={{ fontSize: 16 }} />} sx={{ fontFamily: fontBody, fontWeight: 700, fontSize: "0.8rem", textTransform: "none", borderRadius: "8px", bgcolor: T.accent, boxShadow: "none", "&:hover": { bgcolor: "#5558e6" } }}>Add Driver</Button>
            </Box>

            <Grid container spacing={2.5} mb={3}>
                <Grid item xs={6} sm={3}><StatCard label="Total Drivers" value={drivers.length} sub={`${activeDrivers} on duty`} color={T.accent} bgLight={T.accentLight} icon={IdCard} /></Grid>
                <Grid item xs={6} sm={3}><StatCard label="Avg. Rating" value={avgRating} sub="Based on feedback" color={T.warning} bgLight={T.warningLight} icon={Star} /></Grid>
                <Grid item xs={6} sm={3}><StatCard label="Trips Today" value={totalTrips} sub="Across all drivers" color={T.success} bgLight={T.successLight} icon={TrendingUp} /></Grid>
                <Grid item xs={6} sm={3}><StatCard label="Violations" value={violations} sub="Total recorded" color={T.danger} bgLight={T.dangerLight} icon={Warning} /></Grid>
            </Grid>

            <Card className="fade-up" sx={{ borderRadius: "14px", border: `1px solid ${T.border}`, boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                <Box sx={{ p: 2.5, borderBottom: `1px solid ${T.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
                    <Box>
                        <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1.1rem" }}>All Drivers</Typography>
                        <Typography sx={{ fontFamily: fontBody, fontSize: "0.78rem", color: T.textMute }}>{filtered.length} drivers registered</Typography>
                    </Box>
                    <Box display="flex" gap={1.5}>
                        <FormControl size="small" sx={{ minWidth: 120 }}>
                            <Select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} sx={{ borderRadius: "8px", fontFamily: fontBody, fontSize: "0.8rem" }}>
                                <MenuItem value="All">All Status</MenuItem>
                                <MenuItem value="Active">Active</MenuItem>
                                <MenuItem value="Off-Duty">Off-Duty</MenuItem>
                            </Select>
                        </FormControl>
                        <TextField size="small" placeholder="Search drivers..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                            InputProps={{ startAdornment: <InputAdornment position="start"><Search sx={{ fontSize: 16, color: T.textMute }} /></InputAdornment> }}
                            sx={{ width: 260, "& .MuiOutlinedInput-root": { borderRadius: "8px", fontFamily: fontBody, fontSize: "0.8rem" } }} />
                    </Box>
                </Box>
                <Box sx={{ overflowX: "auto" }}>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ bgcolor: "#F9FAFB" }}>
                                {["Driver", "License", "Phone", "Bus", "Shift", "Rating", "Experience", "Status", "Actions"].map(h => (
                                    <TableCell key={h} sx={{ fontFamily: fontBody, fontWeight: 700, fontSize: "0.72rem", color: T.textMute, textTransform: "uppercase", py: 1.5, whiteSpace: "nowrap", ...(h === "Actions" ? { textAlign: "right" } : {}) }}>{h}</TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filtered.map(row => (
                                <TableRow key={row.id} className="row-hover" sx={{ cursor: "pointer" }} onClick={() => setDetailDriver(row)}>
                                    <TableCell>
                                        <Box display="flex" alignItems="center" gap={1.5}>
                                            <Avatar sx={{ width: 34, height: 34, bgcolor: T.accentLight, color: T.accent, fontFamily: fontBody, fontWeight: 700, fontSize: "0.75rem" }}>
                                                {row.name.split(" ").map(n => n[0]).join("")}
                                            </Avatar>
                                            <Box>
                                                <Typography sx={{ fontFamily: fontBody, fontWeight: 600, fontSize: "0.85rem", color: T.text }}>{row.name}</Typography>
                                                <Typography sx={{ fontFamily: fontMono, fontSize: "0.7rem", color: T.textMute }}>{row.id}</Typography>
                                            </Box>
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Typography sx={{ fontFamily: fontMono, fontSize: "0.78rem", color: T.textSub }}>{row.license}</Typography>
                                        <Typography sx={{ fontFamily: fontBody, fontSize: "0.65rem", color: T.textMute }}>Exp: {row.licenseExpiry}</Typography>
                                    </TableCell>
                                    <TableCell sx={{ fontFamily: fontMono, fontSize: "0.8rem", color: T.textSub }}>{row.phone}</TableCell>
                                    <TableCell><StatusPill status={row.busAssigned} variant="outline" /></TableCell>
                                    <TableCell sx={{ fontFamily: fontBody, fontSize: "0.78rem", color: T.textSub }}>{row.shift}</TableCell>
                                    <TableCell>
                                        <Box display="flex" alignItems="center" gap={0.5}>
                                            <Star sx={{ fontSize: 14, color: T.warning }} />
                                            <Typography sx={{ fontFamily: fontMono, fontSize: "0.8rem", fontWeight: 600, color: T.text }}>{row.rating}</Typography>
                                        </Box>
                                    </TableCell>
                                    <TableCell sx={{ fontFamily: fontBody, fontSize: "0.82rem", color: T.textSub }}>{row.experience}</TableCell>
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

            <Dialog open={!!detailDriver} onClose={() => setDetailDriver(null)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: "16px" } }}>
                {detailDriver && (<>
                    <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontFamily: fontHead, fontWeight: 700 }}>
                        Driver Profile
                        <IconButton onClick={() => setDetailDriver(null)}><Close /></IconButton>
                    </DialogTitle>
                    <DialogContent dividers>
                        <Box display="flex" alignItems="center" gap={2} mb={3}>
                            <Avatar sx={{ width: 56, height: 56, bgcolor: T.accentLight, color: T.accent, fontFamily: fontBody, fontWeight: 700, fontSize: "1.1rem" }}>
                                {detailDriver.name.split(" ").map(n => n[0]).join("")}
                            </Avatar>
                            <Box>
                                <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1.15rem", color: T.text }}>{detailDriver.name}</Typography>
                                <Typography sx={{ fontFamily: fontMono, fontSize: "0.78rem", color: T.textMute }}>{detailDriver.id}</Typography>
                                <Box display="flex" alignItems="center" gap={0.5} mt={0.3}>
                                    <Rating value={parseFloat(detailDriver.rating)} precision={0.1} readOnly size="small" />
                                    <Typography sx={{ fontFamily: fontMono, fontSize: "0.75rem", color: T.textMute }}>{detailDriver.rating}</Typography>
                                </Box>
                            </Box>
                        </Box>
                        <Grid container spacing={2}>
                            {[
                                { label: "License No", value: detailDriver.license },
                                { label: "License Expiry", value: detailDriver.licenseExpiry },
                                { label: "Phone", value: detailDriver.phone },
                                { label: "Emergency Contact", value: detailDriver.emergencyContact },
                                { label: "Bus Assigned", value: detailDriver.busAssigned },
                                { label: "Shift", value: detailDriver.shift },
                                { label: "Experience", value: detailDriver.experience },
                                { label: "Join Date", value: detailDriver.joinDate },
                                { label: "Trips Today", value: detailDriver.tripsToday },
                                { label: "Last Trip", value: detailDriver.lastTrip },
                                { label: "Violations", value: `${detailDriver.violations} recorded` },
                                { label: "Address", value: detailDriver.address },
                                { label: "Status", value: detailDriver.status },
                            ].map(item => (
                                <Grid item xs={6} key={item.label}>
                                    <SLabel>{item.label}</SLabel>
                                    <Typography sx={{ fontFamily: fontBody, fontSize: "0.88rem", color: T.text, fontWeight: 600 }}>{item.value}</Typography>
                                </Grid>
                            ))}
                        </Grid>
                    </DialogContent>
                    <DialogActions sx={{ p: 2 }}>
                        <Button onClick={() => setDetailDriver(null)} sx={{ fontFamily: fontBody, textTransform: "none" }}>Close</Button>
                        <Button variant="contained" sx={{ fontFamily: fontBody, textTransform: "none", bgcolor: T.accent, borderRadius: "8px" }}>Edit Driver</Button>
                    </DialogActions>
                </>)}
            </Dialog>
        </Box>
    );
}
