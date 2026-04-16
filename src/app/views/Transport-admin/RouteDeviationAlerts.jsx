import React, { useState } from "react";
import {
    Box, Card, Grid, Typography, TextField, Table, TableBody, TableCell,
    TableHead, TableRow, IconButton, InputAdornment, Chip, Dialog,
    DialogTitle, DialogContent, DialogActions, MenuItem, Select, FormControl, Tooltip, Button
} from "@mui/material";
import {
    Search, Warning, Close, Visibility, NotificationsActive,
    GpsFixed, DirectionsBus, CheckCircle
} from "@mui/icons-material";
import { T, fontHead, fontBody, fontMono, Fonts, deviationAlerts, statusColors } from "./transportAdminShared";

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

export default function RouteDeviationAlerts() {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [detailAlert, setDetailAlert] = useState(null);

    const filtered = deviationAlerts.filter(a => {
        const matchSearch = a.busId.toLowerCase().includes(searchTerm.toLowerCase()) || a.routeName.toLowerCase().includes(searchTerm.toLowerCase()) || a.driverName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchStatus = statusFilter === "All" || a.status === statusFilter;
        return matchSearch && matchStatus;
    });

    const openAlerts = deviationAlerts.filter(a => a.status === "Open").length;
    const closedAlerts = deviationAlerts.filter(a => a.status === "Closed").length;
    const criticalAlerts = deviationAlerts.filter(a => a.severity === "Critical").length;

    return (
        <Box sx={{ p: 3, background: T.bg, minHeight: "100vh", fontFamily: fontBody }}>
            <style>{Fonts()}</style>

            <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3} className="fade-up">
                <Box>
                    <Typography sx={{ fontFamily: fontBody, fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: T.textMute, mb: 0.3 }}>Fleet & Routes · Routes & Schedules</Typography>
                    <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1.5rem", color: T.text, lineHeight: 1.1 }}>Route Deviation Alerts</Typography>
                    <Typography sx={{ fontFamily: fontBody, fontSize: "0.82rem", color: T.textSub, mt: 0.4 }}>Get notified when a bus deviates from its defined route.</Typography>
                </Box>
            </Box>

            <Grid container spacing={2.5} mb={3}>
                <Grid item xs={6} sm={3}><StatCard label="Total Alerts" value={deviationAlerts.length} sub="All time" color={T.accent} bgLight={T.accentLight} icon={NotificationsActive} /></Grid>
                <Grid item xs={6} sm={3}><StatCard label="Open" value={openAlerts} sub="Needs review" color={T.danger} bgLight={T.dangerLight} icon={Warning} /></Grid>
                <Grid item xs={6} sm={3}><StatCard label="Critical" value={criticalAlerts} sub="High severity" color={T.warning} bgLight={T.warningLight} icon={GpsFixed} /></Grid>
                <Grid item xs={6} sm={3}><StatCard label="Resolved" value={closedAlerts} sub="Closed alerts" color={T.success} bgLight={T.successLight} icon={CheckCircle} /></Grid>
            </Grid>

            <Card className="fade-up" sx={{ borderRadius: "14px", border: `1px solid ${T.border}`, boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                <Box sx={{ p: 2.5, borderBottom: `1px solid ${T.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
                    <Box>
                        <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1.1rem" }}>Deviation Alerts</Typography>
                        <Typography sx={{ fontFamily: fontBody, fontSize: "0.78rem", color: T.textMute }}>{filtered.length} alerts</Typography>
                    </Box>
                    <Box display="flex" gap={1.5}>
                        <FormControl size="small" sx={{ minWidth: 120 }}>
                            <Select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} sx={{ borderRadius: "8px", fontFamily: fontBody, fontSize: "0.8rem" }}>
                                <MenuItem value="All">All Status</MenuItem>
                                <MenuItem value="Open">Open</MenuItem>
                                <MenuItem value="Closed">Closed</MenuItem>
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
                                {["ID", "Bus", "Route", "Driver", "Timestamp", "Deviation", "Severity", "Reason", "Status", "Actions"].map(h => (
                                    <TableCell key={h} sx={{ fontFamily: fontBody, fontWeight: 700, fontSize: "0.72rem", color: T.textMute, textTransform: "uppercase", py: 1.5, whiteSpace: "nowrap", ...(h === "Actions" ? { textAlign: "right" } : {}) }}>{h}</TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filtered.map(row => (
                                <TableRow key={row.id} className="row-hover" sx={{ cursor: "pointer" }} onClick={() => setDetailAlert(row)}>
                                    <TableCell sx={{ fontFamily: fontMono, fontWeight: 600, fontSize: "0.78rem", color: T.text }}>{row.id}</TableCell>
                                    <TableCell sx={{ fontFamily: fontMono, fontWeight: 600, fontSize: "0.82rem", color: T.text }}>{row.busId}</TableCell>
                                    <TableCell><Typography sx={{ fontFamily: fontBody, fontSize: "0.8rem", color: T.textSub, maxWidth: 160 }} noWrap>{row.routeName}</Typography></TableCell>
                                    <TableCell sx={{ fontFamily: fontBody, fontSize: "0.82rem", color: T.textSub }}>{row.driverName}</TableCell>
                                    <TableCell sx={{ fontFamily: fontMono, fontSize: "0.75rem", color: T.textMute }}>{row.timestamp}</TableCell>
                                    <TableCell>
                                        <Chip label={row.deviationKm} size="small" sx={{ fontFamily: fontMono, fontSize: "0.7rem", fontWeight: 600, bgcolor: T.dangerLight, color: T.danger, height: 22 }} />
                                    </TableCell>
                                    <TableCell><StatusPill status={row.severity} /></TableCell>
                                    <TableCell><Typography sx={{ fontFamily: fontBody, fontSize: "0.78rem", color: T.textSub, maxWidth: 130 }} noWrap>{row.reason}</Typography></TableCell>
                                    <TableCell><StatusPill status={row.status} /></TableCell>
                                    <TableCell sx={{ textAlign: "right", py: 1 }}>
                                        <Tooltip title="View Details"><IconButton size="small" sx={{ color: T.accent }}><Visibility sx={{ fontSize: 16 }} /></IconButton></Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Box>
            </Card>

            <Dialog open={!!detailAlert} onClose={() => setDetailAlert(null)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: "16px" } }}>
                {detailAlert && (<>
                    <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontFamily: fontHead, fontWeight: 700 }}>
                        Alert — {detailAlert.id}
                        <IconButton onClick={() => setDetailAlert(null)}><Close /></IconButton>
                    </DialogTitle>
                    <DialogContent dividers>
                        <Grid container spacing={2}>
                            {[
                                { label: "Alert ID", value: detailAlert.id },
                                { label: "Bus ID", value: detailAlert.busId },
                                { label: "Route", value: detailAlert.routeName },
                                { label: "Driver", value: detailAlert.driverName },
                                { label: "Timestamp", value: detailAlert.timestamp },
                                { label: "Deviation Distance", value: detailAlert.deviationKm },
                                { label: "Severity", value: detailAlert.severity },
                                { label: "Reason", value: detailAlert.reason },
                                { label: "Location", value: detailAlert.location },
                                { label: "Status", value: detailAlert.status },
                            ].map(item => (
                                <Grid item xs={6} key={item.label}>
                                    <SLabel>{item.label}</SLabel>
                                    <Typography sx={{ fontFamily: fontBody, fontSize: "0.88rem", color: T.text, fontWeight: 600 }}>{item.value}</Typography>
                                </Grid>
                            ))}
                        </Grid>
                    </DialogContent>
                    <DialogActions sx={{ p: 2 }}>
                        <Button onClick={() => setDetailAlert(null)} sx={{ fontFamily: fontBody, textTransform: "none" }}>Close</Button>
                        {detailAlert.status === "Open" && (
                            <Button variant="contained" sx={{ fontFamily: fontBody, textTransform: "none", bgcolor: T.success, borderRadius: "8px" }}>Mark Resolved</Button>
                        )}
                    </DialogActions>
                </>)}
            </Dialog>
        </Box>
    );
}
