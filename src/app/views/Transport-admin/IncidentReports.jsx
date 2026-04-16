import React, { useState } from "react";
import {
    Box, Card, Grid, Typography, Button, TextField, Table, TableBody, TableCell,
    TableHead, TableRow, IconButton, InputAdornment, Dialog,
    DialogTitle, DialogContent, DialogActions, MenuItem, Select, FormControl, Tooltip
} from "@mui/material";
import {
    Search, Add, Warning, Close, Visibility, ReportProblem,
    CheckCircle, DirectionsBus, Edit
} from "@mui/icons-material";
import { T, fontHead, fontBody, fontMono, Fonts, incidents, statusColors } from "./transportAdminShared";

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

export default function IncidentReports() {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [detailIncident, setDetailIncident] = useState(null);

    const filtered = incidents.filter(inc => {
        const matchSearch = inc.driverName.toLowerCase().includes(searchTerm.toLowerCase()) || inc.id.toLowerCase().includes(searchTerm.toLowerCase()) || inc.type.toLowerCase().includes(searchTerm.toLowerCase());
        const matchStatus = statusFilter === "All" || inc.status === statusFilter;
        return matchSearch && matchStatus;
    });

    const openIncidents = incidents.filter(i => i.status === "Open").length;
    const inProgressIncidents = incidents.filter(i => i.status === "In Progress").length;
    const closedIncidents = incidents.filter(i => i.status === "Closed").length;
    const highSeverity = incidents.filter(i => i.severity === "High" || i.severity === "Critical").length;

    return (
        <Box sx={{ p: 3, background: T.bg, minHeight: "100vh", fontFamily: fontBody }}>
            <style>{Fonts()}</style>

            <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3} className="fade-up">
                <Box>
                    <Typography sx={{ fontFamily: fontBody, fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: T.textMute, mb: 0.3 }}>Drivers & Passes · Driver Management</Typography>
                    <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1.5rem", color: T.text, lineHeight: 1.1 }}>Incident Reports</Typography>
                    <Typography sx={{ fontFamily: fontBody, fontSize: "0.82rem", color: T.textSub, mt: 0.4 }}>Record and manage traffic incidents or complaints against drivers.</Typography>
                </Box>
                <Button variant="contained" startIcon={<Add sx={{ fontSize: 16 }} />} sx={{ fontFamily: fontBody, fontWeight: 700, fontSize: "0.8rem", textTransform: "none", borderRadius: "8px", bgcolor: T.accent, boxShadow: "none", "&:hover": { bgcolor: "#5558e6" } }}>Report Incident</Button>
            </Box>

            <Grid container spacing={2.5} mb={3}>
                <Grid item xs={6} sm={3}><StatCard label="Total Incidents" value={incidents.length} sub="All time" color={T.accent} bgLight={T.accentLight} icon={ReportProblem} /></Grid>
                <Grid item xs={6} sm={3}><StatCard label="Open" value={openIncidents} sub={`${inProgressIncidents} in progress`} color={T.warning} bgLight={T.warningLight} icon={Warning} /></Grid>
                <Grid item xs={6} sm={3}><StatCard label="High Severity" value={highSeverity} sub="Requires attention" color={T.danger} bgLight={T.dangerLight} icon={ReportProblem} /></Grid>
                <Grid item xs={6} sm={3}><StatCard label="Resolved" value={closedIncidents} sub="Closed incidents" color={T.success} bgLight={T.successLight} icon={CheckCircle} /></Grid>
            </Grid>

            <Card className="fade-up" sx={{ borderRadius: "14px", border: `1px solid ${T.border}`, boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                <Box sx={{ p: 2.5, borderBottom: `1px solid ${T.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
                    <Box>
                        <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1.1rem" }}>All Incidents</Typography>
                        <Typography sx={{ fontFamily: fontBody, fontSize: "0.78rem", color: T.textMute }}>{filtered.length} reports</Typography>
                    </Box>
                    <Box display="flex" gap={1.5}>
                        <FormControl size="small" sx={{ minWidth: 120 }}>
                            <Select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} sx={{ borderRadius: "8px", fontFamily: fontBody, fontSize: "0.8rem" }}>
                                <MenuItem value="All">All Status</MenuItem>
                                <MenuItem value="Open">Open</MenuItem>
                                <MenuItem value="In Progress">In Progress</MenuItem>
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
                                {["ID", "Driver", "Bus", "Date", "Type", "Severity", "Location", "Status", "Actions"].map(h => (
                                    <TableCell key={h} sx={{ fontFamily: fontBody, fontWeight: 700, fontSize: "0.72rem", color: T.textMute, textTransform: "uppercase", py: 1.5, whiteSpace: "nowrap", ...(h === "Actions" ? { textAlign: "right" } : {}) }}>{h}</TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filtered.map(row => (
                                <TableRow key={row.id} className="row-hover" sx={{ cursor: "pointer" }} onClick={() => setDetailIncident(row)}>
                                    <TableCell sx={{ fontFamily: fontMono, fontWeight: 600, fontSize: "0.78rem", color: T.text }}>{row.id}</TableCell>
                                    <TableCell sx={{ fontFamily: fontBody, fontSize: "0.82rem", color: T.textSub }}>{row.driverName}</TableCell>
                                    <TableCell sx={{ fontFamily: fontMono, fontSize: "0.82rem", color: T.text, fontWeight: 600 }}>{row.busId}</TableCell>
                                    <TableCell sx={{ fontFamily: fontBody, fontSize: "0.82rem", color: T.textSub }}>{row.date}</TableCell>
                                    <TableCell sx={{ fontFamily: fontBody, fontSize: "0.82rem", color: T.textSub }}>{row.type}</TableCell>
                                    <TableCell><StatusPill status={row.severity === "High" || row.severity === "Critical" ? "Critical" : row.severity === "Medium" ? "Pending" : "Active"} /></TableCell>
                                    <TableCell><Typography sx={{ fontFamily: fontBody, fontSize: "0.78rem", color: T.textSub, maxWidth: 120 }} noWrap>{row.location}</Typography></TableCell>
                                    <TableCell><StatusPill status={row.status} /></TableCell>
                                    <TableCell sx={{ textAlign: "right", py: 1 }}>
                                        <Tooltip title="View"><IconButton size="small" sx={{ color: T.accent }}><Visibility sx={{ fontSize: 16 }} /></IconButton></Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Box>
            </Card>

            <Dialog open={!!detailIncident} onClose={() => setDetailIncident(null)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: "16px" } }}>
                {detailIncident && (<>
                    <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontFamily: fontHead, fontWeight: 700 }}>
                        Incident — {detailIncident.id}
                        <IconButton onClick={() => setDetailIncident(null)}><Close /></IconButton>
                    </DialogTitle>
                    <DialogContent dividers>
                        <Grid container spacing={2}>
                            {[
                                { label: "Incident ID", value: detailIncident.id },
                                { label: "Driver", value: `${detailIncident.driverName} (${detailIncident.driverId})` },
                                { label: "Bus ID", value: detailIncident.busId },
                                { label: "Date", value: detailIncident.date },
                                { label: "Type", value: detailIncident.type },
                                { label: "Severity", value: detailIncident.severity },
                                { label: "Location", value: detailIncident.location },
                                { label: "Status", value: detailIncident.status },
                                { label: "Action Taken", value: detailIncident.actionTaken || "Pending review" },
                            ].map(item => (
                                <Grid item xs={6} key={item.label}>
                                    <SLabel>{item.label}</SLabel>
                                    <Typography sx={{ fontFamily: fontBody, fontSize: "0.88rem", color: T.text, fontWeight: 600 }}>{item.value}</Typography>
                                </Grid>
                            ))}
                            <Grid item xs={12}>
                                <SLabel>Description</SLabel>
                                <Typography sx={{ fontFamily: fontBody, fontSize: "0.88rem", color: T.text }}>{detailIncident.description}</Typography>
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions sx={{ p: 2 }}>
                        <Button onClick={() => setDetailIncident(null)} sx={{ fontFamily: fontBody, textTransform: "none" }}>Close</Button>
                        {detailIncident.status !== "Closed" && (
                            <Button variant="contained" sx={{ fontFamily: fontBody, textTransform: "none", bgcolor: T.success, borderRadius: "8px" }}>Mark Resolved</Button>
                        )}
                    </DialogActions>
                </>)}
            </Dialog>
        </Box>
    );
}
