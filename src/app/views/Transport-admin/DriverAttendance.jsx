import React, { useState } from "react";
import {
    Box, Card, Grid, Typography, TextField, Table, TableBody, TableCell,
    TableHead, TableRow, InputAdornment, Chip, MenuItem, Select, FormControl, Avatar
} from "@mui/material";
import {
    Search, CheckCircle, Cancel, Schedule, People
} from "@mui/icons-material";
import { T, fontHead, fontBody, fontMono, Fonts, drivers, driverAttendance, statusColors } from "./transportAdminShared";

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

export default function DriverAttendance() {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [driverFilter, setDriverFilter] = useState("All");

    // Get latest attendance for each driver (most recent day)
    const latestDate = "Apr 15, 2025";
    const todayAttendance = driverAttendance.filter(a => a.date === latestDate);

    const filtered = driverAttendance.filter(a => {
        const matchSearch = a.driverName.toLowerCase().includes(searchTerm.toLowerCase()) || a.driverId.toLowerCase().includes(searchTerm.toLowerCase());
        const matchStatus = statusFilter === "All" || a.status === statusFilter;
        const matchDriver = driverFilter === "All" || a.driverId === driverFilter;
        return matchSearch && matchStatus && matchDriver;
    }).slice(0, 50); // Limit display

    const presentToday = todayAttendance.filter(a => a.status === "Present").length;
    const absentToday = todayAttendance.filter(a => a.status === "Absent").length;
    const lateToday = todayAttendance.filter(a => a.status === "Late").length;
    const onLeaveToday = todayAttendance.filter(a => a.status === "On Leave").length;

    return (
        <Box sx={{ p: 3, background: T.bg, minHeight: "100vh", fontFamily: fontBody }}>
            <style>{Fonts()}</style>

            <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3} className="fade-up">
                <Box>
                    <Typography sx={{ fontFamily: fontBody, fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: T.textMute, mb: 0.3 }}>Drivers & Passes · Driver Management</Typography>
                    <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1.5rem", color: T.text, lineHeight: 1.1 }}>Driver Attendance</Typography>
                    <Typography sx={{ fontFamily: fontBody, fontSize: "0.82rem", color: T.textSub, mt: 0.4 }}>Log and track driver attendance and shift adherence.</Typography>
                </Box>
            </Box>

            <Grid container spacing={2.5} mb={3}>
                <Grid item xs={6} sm={3}><StatCard label="Present Today" value={presentToday} sub={`of ${drivers.length} drivers`} color={T.success} bgLight={T.successLight} icon={CheckCircle} /></Grid>
                <Grid item xs={6} sm={3}><StatCard label="Absent" value={absentToday} sub="Not reported" color={T.danger} bgLight={T.dangerLight} icon={Cancel} /></Grid>
                <Grid item xs={6} sm={3}><StatCard label="Late Arrivals" value={lateToday} sub="Today" color={T.warning} bgLight={T.warningLight} icon={Schedule} /></Grid>
                <Grid item xs={6} sm={3}><StatCard label="On Leave" value={onLeaveToday} sub="Planned leave" color={T.purple} bgLight={T.purpleLight} icon={People} /></Grid>
            </Grid>

            <Card className="fade-up" sx={{ borderRadius: "14px", border: `1px solid ${T.border}`, boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                <Box sx={{ p: 2.5, borderBottom: `1px solid ${T.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
                    <Box>
                        <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1.1rem" }}>Attendance Log</Typography>
                        <Typography sx={{ fontFamily: fontBody, fontSize: "0.78rem", color: T.textMute }}>{filtered.length} records shown</Typography>
                    </Box>
                    <Box display="flex" gap={1.5}>
                        <FormControl size="small" sx={{ minWidth: 130 }}>
                            <Select value={driverFilter} onChange={e => setDriverFilter(e.target.value)} sx={{ borderRadius: "8px", fontFamily: fontBody, fontSize: "0.8rem" }}>
                                <MenuItem value="All">All Drivers</MenuItem>
                                {drivers.map(d => <MenuItem key={d.id} value={d.id}>{d.name}</MenuItem>)}
                            </Select>
                        </FormControl>
                        <FormControl size="small" sx={{ minWidth: 120 }}>
                            <Select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} sx={{ borderRadius: "8px", fontFamily: fontBody, fontSize: "0.8rem" }}>
                                <MenuItem value="All">All Status</MenuItem>
                                <MenuItem value="Present">Present</MenuItem>
                                <MenuItem value="Absent">Absent</MenuItem>
                                <MenuItem value="Late">Late</MenuItem>
                                <MenuItem value="On Leave">On Leave</MenuItem>
                            </Select>
                        </FormControl>
                        <TextField size="small" placeholder="Search..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                            InputProps={{ startAdornment: <InputAdornment position="start"><Search sx={{ fontSize: 16, color: T.textMute }} /></InputAdornment> }}
                            sx={{ width: 220, "& .MuiOutlinedInput-root": { borderRadius: "8px", fontFamily: fontBody, fontSize: "0.8rem" } }} />
                    </Box>
                </Box>
                <Box sx={{ overflowX: "auto" }}>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ bgcolor: "#F9FAFB" }}>
                                {["Driver", "Date", "Shift", "Check In", "Check Out", "Status"].map(h => (
                                    <TableCell key={h} sx={{ fontFamily: fontBody, fontWeight: 700, fontSize: "0.72rem", color: T.textMute, textTransform: "uppercase", py: 1.5, whiteSpace: "nowrap" }}>{h}</TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filtered.map((row, idx) => (
                                <TableRow key={`${row.driverId}-${row.date}-${idx}`} className="row-hover">
                                    <TableCell>
                                        <Box display="flex" alignItems="center" gap={1.5}>
                                            <Avatar sx={{ width: 30, height: 30, bgcolor: T.accentLight, color: T.accent, fontFamily: fontBody, fontWeight: 700, fontSize: "0.65rem" }}>
                                                {row.driverName.split(" ").map(n => n[0]).join("")}
                                            </Avatar>
                                            <Box>
                                                <Typography sx={{ fontFamily: fontBody, fontWeight: 600, fontSize: "0.82rem", color: T.text }}>{row.driverName}</Typography>
                                                <Typography sx={{ fontFamily: fontMono, fontSize: "0.68rem", color: T.textMute }}>{row.driverId}</Typography>
                                            </Box>
                                        </Box>
                                    </TableCell>
                                    <TableCell sx={{ fontFamily: fontBody, fontSize: "0.82rem", color: T.textSub }}>{row.date}</TableCell>
                                    <TableCell><Typography sx={{ fontFamily: fontBody, fontSize: "0.75rem", color: T.textSub, maxWidth: 150 }} noWrap>{row.shift}</Typography></TableCell>
                                    <TableCell sx={{ fontFamily: fontMono, fontSize: "0.82rem", color: row.checkIn ? T.text : T.textMute }}>{row.checkIn || "—"}</TableCell>
                                    <TableCell sx={{ fontFamily: fontMono, fontSize: "0.82rem", color: row.checkOut ? T.text : T.textMute }}>{row.checkOut || "—"}</TableCell>
                                    <TableCell><StatusPill status={row.status} /></TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Box>
            </Card>
        </Box>
    );
}
