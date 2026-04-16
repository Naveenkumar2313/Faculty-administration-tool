import React, { useState } from "react";
import {
    Box, Card, Grid, Typography, Button, TextField, Table, TableBody, TableCell,
    TableHead, TableRow, IconButton, InputAdornment, Chip, Dialog,
    DialogTitle, DialogContent, DialogActions, MenuItem, Select, FormControl, Tooltip
} from "@mui/material";
import {
    Search, Add, Build, CalendarMonth, Close, Visibility, Edit,
    DirectionsBus, CheckCircle, Warning, Schedule
} from "@mui/icons-material";
import { T, fontHead, fontBody, fontMono, Fonts, maintenanceRecords, statusColors } from "./transportAdminShared";

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

export default function MaintenanceSchedule() {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [detailRecord, setDetailRecord] = useState(null);

    const filtered = maintenanceRecords.filter(m => {
        const matchSearch = m.busNumber.toLowerCase().includes(searchTerm.toLowerCase()) || m.type.toLowerCase().includes(searchTerm.toLowerCase()) || m.id.toLowerCase().includes(searchTerm.toLowerCase());
        const matchStatus = statusFilter === "All" || m.status === statusFilter;
        return matchSearch && matchStatus;
    });

    const scheduled = maintenanceRecords.filter(m => m.status === "Scheduled").length;
    const completed = maintenanceRecords.filter(m => m.status === "Completed").length;
    const overdue = maintenanceRecords.filter(m => m.status === "Overdue").length;
    const totalCost = maintenanceRecords.reduce((a, m) => a + parseInt(m.cost.replace(/[₹,]/g, "")), 0);

    return (
        <Box sx={{ p: 3, background: T.bg, minHeight: "100vh", fontFamily: fontBody }}>
            <style>{Fonts()}</style>

            <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3} className="fade-up">
                <Box>
                    <Typography sx={{ fontFamily: fontBody, fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: T.textMute, mb: 0.3 }}>Fleet & Routes · Bus Fleet</Typography>
                    <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1.5rem", color: T.text, lineHeight: 1.1 }}>Maintenance Schedule</Typography>
                    <Typography sx={{ fontFamily: fontBody, fontSize: "0.82rem", color: T.textSub, mt: 0.4 }}>Upcoming and past service records for each vehicle.</Typography>
                </Box>
                <Button variant="contained" startIcon={<Add sx={{ fontSize: 16 }} />} sx={{ fontFamily: fontBody, fontWeight: 700, fontSize: "0.8rem", textTransform: "none", borderRadius: "8px", bgcolor: T.accent, boxShadow: "none", "&:hover": { bgcolor: "#5558e6" } }}>Schedule Service</Button>
            </Box>

            <Grid container spacing={2.5} mb={3}>
                <Grid item xs={6} sm={3}><StatCard label="Total Records" value={maintenanceRecords.length} sub={`${scheduled} scheduled`} color={T.accent} bgLight={T.accentLight} icon={CalendarMonth} /></Grid>
                <Grid item xs={6} sm={3}><StatCard label="Completed" value={completed} sub="Services done" color={T.success} bgLight={T.successLight} icon={CheckCircle} /></Grid>
                <Grid item xs={6} sm={3}><StatCard label="Overdue" value={overdue} sub="Needs attention" color={T.danger} bgLight={T.dangerLight} icon={Warning} /></Grid>
                <Grid item xs={6} sm={3}><StatCard label="Total Cost" value={`₹${(totalCost / 1000).toFixed(0)}K`} sub="This period" color={T.info} bgLight={T.infoLight} icon={Build} /></Grid>
            </Grid>

            <Card className="fade-up" sx={{ borderRadius: "14px", border: `1px solid ${T.border}`, boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                <Box sx={{ p: 2.5, borderBottom: `1px solid ${T.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
                    <Box>
                        <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1.1rem" }}>Maintenance Records</Typography>
                        <Typography sx={{ fontFamily: fontBody, fontSize: "0.78rem", color: T.textMute }}>{filtered.length} records</Typography>
                    </Box>
                    <Box display="flex" gap={1.5}>
                        <FormControl size="small" sx={{ minWidth: 130 }}>
                            <Select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} sx={{ borderRadius: "8px", fontFamily: fontBody, fontSize: "0.8rem" }}>
                                <MenuItem value="All">All Status</MenuItem>
                                <MenuItem value="Scheduled">Scheduled</MenuItem>
                                <MenuItem value="In Progress">In Progress</MenuItem>
                                <MenuItem value="Completed">Completed</MenuItem>
                                <MenuItem value="Overdue">Overdue</MenuItem>
                                <MenuItem value="Due Soon">Due Soon</MenuItem>
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
                                {["ID", "Bus", "Service Type", "Scheduled Date", "Vendor", "Cost", "Odometer", "Status", "Actions"].map(h => (
                                    <TableCell key={h} sx={{ fontFamily: fontBody, fontWeight: 700, fontSize: "0.72rem", color: T.textMute, textTransform: "uppercase", py: 1.5, whiteSpace: "nowrap", ...(h === "Actions" ? { textAlign: "right" } : {}) }}>{h}</TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filtered.map(row => (
                                <TableRow key={row.id} className="row-hover" sx={{ cursor: "pointer" }} onClick={() => setDetailRecord(row)}>
                                    <TableCell sx={{ fontFamily: fontMono, fontWeight: 600, fontSize: "0.78rem", color: T.text }}>{row.id}</TableCell>
                                    <TableCell>
                                        <Typography sx={{ fontFamily: fontBody, fontWeight: 600, fontSize: "0.82rem", color: T.text }}>{row.busNumber}</Typography>
                                        <Typography sx={{ fontFamily: fontMono, fontSize: "0.68rem", color: T.textMute }}>{row.busId}</Typography>
                                    </TableCell>
                                    <TableCell sx={{ fontFamily: fontBody, fontSize: "0.82rem", color: T.textSub }}>{row.type}</TableCell>
                                    <TableCell sx={{ fontFamily: fontBody, fontSize: "0.82rem", color: T.textSub }}>{row.scheduledDate}</TableCell>
                                    <TableCell sx={{ fontFamily: fontBody, fontSize: "0.82rem", color: T.textSub }}>{row.vendor}</TableCell>
                                    <TableCell sx={{ fontFamily: fontMono, fontSize: "0.82rem", color: T.text, fontWeight: 600 }}>{row.cost}</TableCell>
                                    <TableCell sx={{ fontFamily: fontMono, fontSize: "0.78rem", color: T.textMute }}>{row.odometer}</TableCell>
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

            <Dialog open={!!detailRecord} onClose={() => setDetailRecord(null)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: "16px" } }}>
                {detailRecord && (<>
                    <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontFamily: fontHead, fontWeight: 700 }}>
                        Service Record — {detailRecord.id}
                        <IconButton onClick={() => setDetailRecord(null)}><Close /></IconButton>
                    </DialogTitle>
                    <DialogContent dividers>
                        <Grid container spacing={2}>
                            {[
                                { label: "Record ID", value: detailRecord.id },
                                { label: "Bus", value: `${detailRecord.busNumber} (${detailRecord.busId})` },
                                { label: "Service Type", value: detailRecord.type },
                                { label: "Scheduled Date", value: detailRecord.scheduledDate },
                                { label: "Completed Date", value: detailRecord.completedDate || "—" },
                                { label: "Vendor", value: detailRecord.vendor },
                                { label: "Cost", value: detailRecord.cost },
                                { label: "Odometer", value: detailRecord.odometer },
                                { label: "Notes", value: detailRecord.notes },
                                { label: "Status", value: detailRecord.status },
                            ].map(item => (
                                <Grid item xs={6} key={item.label}>
                                    <SLabel>{item.label}</SLabel>
                                    <Typography sx={{ fontFamily: fontBody, fontSize: "0.88rem", color: T.text, fontWeight: 600 }}>{item.value}</Typography>
                                </Grid>
                            ))}
                        </Grid>
                    </DialogContent>
                    <DialogActions sx={{ p: 2 }}>
                        <Button onClick={() => setDetailRecord(null)} sx={{ fontFamily: fontBody, textTransform: "none" }}>Close</Button>
                        <Button variant="contained" sx={{ fontFamily: fontBody, textTransform: "none", bgcolor: T.accent, borderRadius: "8px" }}>Edit Record</Button>
                    </DialogActions>
                </>)}
            </Dialog>
        </Box>
    );
}
