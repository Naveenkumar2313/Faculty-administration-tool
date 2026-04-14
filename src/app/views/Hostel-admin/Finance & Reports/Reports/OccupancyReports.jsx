import React, { useState } from "react";
import {
    Box, Card, Grid, Typography, Table, TableBody, TableCell, TableHead, TableRow,
    Button, Select, MenuItem, FormControl, InputLabel, Chip, LinearProgress, Divider
} from "@mui/material";
import {
    Download, HomeWork, Hotel, ShowChart, Domain, FactCheck, AccessTime, FileDownload
} from "@mui/icons-material";

/* ── Design Tokens ── */
const T = {
    bg: "#F5F7FA", surface: "#FFFFFF", border: "#E4E8EF", text: "#111827", textSub: "#4B5563", textMute: "#9CA3AF",
    accent: "#6366F1", accentLight: "#EEF2FF", success: "#10B981", successLight: "#ECFDF5",
    warning: "#F59E0B", warningLight: "#FFFBEB", danger: "#EF4444", dangerLight: "#FEF2F2",
    info: "#3B82F6", infoLight: "#EFF6FF", purple: "#8B5CF6", purpleLight: "#F5F3FF", pink: "#EC4899", pinkLight: "#FDF2F8"
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
    .chart-bar { background: ${T.bg}; border-radius: 6px; overflow: hidden; display: flex; height: 32px; border: 1px solid ${T.border}; }
    .chart-fill-b { background: ${T.info}; height: 100%; display: flex; align-items: center; justify-content: center; color: white; font-size: 0.7rem; font-weight: 700; font-family: ${fontMono}; }
    .chart-fill-g { background: ${T.pink}; height: 100%; display: flex; align-items: center; justify-content: center; color: white; font-size: 0.7rem; font-weight: 700; font-family: ${fontMono}; }
    .chart-vacant { background: transparent; height: 100%; display: flex; align-items: center; justify-content: center; color: ${T.textMute}; font-size: 0.7rem; font-family: ${fontMono}; }
  `}</style>
);

const RAW_DATA = [
    { block: "Boys Hostel A", totalBeds: 250, occupied: 245, maintenance: 2, division: "Boys", trend: "+2.1%", ytdAvg: "96%", warden: "Mr. Verma" },
    { block: "Boys Hostel B", totalBeds: 200, occupied: 180, maintenance: 5, division: "Boys", trend: "-1.5%", ytdAvg: "92%", warden: "Mr. Sharma" },
    { block: "Boys Hostel C", totalBeds: 150, occupied: 150, maintenance: 0, division: "Boys", trend: "0.0%", ytdAvg: "99%", warden: "Mr. Gupta" },
    { block: "Girls Hostel A", totalBeds: 220, occupied: 215, maintenance: 1, division: "Girls", trend: "+0.5%", ytdAvg: "97%", warden: "Mrs. Reddy" },
    { block: "Girls Hostel B", totalBeds: 180, occupied: 150, maintenance: 8, division: "Girls", trend: "+5.2%", ytdAvg: "85%", warden: "Mrs. Iyer" }
];

const UPCOMING_VACANCIES = [
    { id: "VAC-01", room: "A-108", block: "Boys Hostel A", student: "Rahul Sharma", date: "2024-05-15", reason: "Graduating" },
    { id: "VAC-02", room: "B-220", block: "Girls Hostel B", student: "Priya Patel", date: "2024-05-20", reason: "Term Ending" },
    { id: "VAC-03", room: "A-304", block: "Girls Hostel A", student: "Neha Singh", date: "2024-05-22", reason: "Moving out of city" },
    { id: "VAC-04", room: "B-112", block: "Boys Hostel B", student: "Arjun Reddy", date: "2024-05-30", reason: "Internship" }
];

const StatCard = ({ label, value, sub, color, icon: Icon, bgLight }) => (
    <Card className="fade-up" sx={{ p: 2.5, borderRadius: "14px", border: `1px solid ${T.border}`, background: T.surface, boxShadow: "0 1px 4px rgba(0,0,0,0.04)", height: "100%", display: "flex", flexDirection: "column" }}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
            <Box>
                <Typography sx={{ fontFamily: fontBody, fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: T.textMute, mb: 0.5 }}>{label}</Typography>
                <Typography sx={{ fontFamily: fontMono, fontWeight: 700, fontSize: "2rem", color: color || T.text, lineHeight: 1 }}>{value}</Typography>
                {sub && <Typography sx={{ fontFamily: fontBody, fontSize: "0.75rem", color: T.textSub, mt: 0.8, fontWeight: 600 }}>{sub}</Typography>}
            </Box>
            {Icon && <Box sx={{ p: 1.5, borderRadius: "10px", bgcolor: bgLight || `${color}15`, color: color }}><Icon sx={{ fontSize: 24 }} /></Box>}
        </Box>
    </Card>
);

export default function OccupancyReports() {
    const [period, setPeriod] = useState("Spring 2024");

    const totalCapacity = RAW_DATA.reduce((acc, c) => acc + c.totalBeds, 0);
    const totalOccupied = RAW_DATA.reduce((acc, c) => acc + c.occupied, 0);
    const totalMaintenance = RAW_DATA.reduce((acc, c) => acc + c.maintenance, 0);
    const totalVacant = totalCapacity - totalOccupied - totalMaintenance;
    const overallRate = ((totalOccupied / totalCapacity) * 100).toFixed(1);

    const boysOcc = RAW_DATA.filter(d => d.division === "Boys").reduce((a, c) => a + c.occupied, 0);
    const boysCap = RAW_DATA.filter(d => d.division === "Boys").reduce((a, c) => a + c.totalBeds, 0);
    const girlsOcc = RAW_DATA.filter(d => d.division === "Girls").reduce((a, c) => a + c.occupied, 0);
    const girlsCap = RAW_DATA.filter(d => d.division === "Girls").reduce((a, c) => a + c.totalBeds, 0);

    return (
        <Box sx={{ p: 3, background: T.bg, minHeight: "100vh", fontFamily: fontBody }}>
            <Fonts />
            <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3} className="fade-up">
                <Box>
                    <Typography sx={{ fontFamily: fontBody, fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: T.textMute, mb: 0.3 }}>Enterprise Analytics</Typography>
                    <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1.6rem", color: T.text, lineHeight: 1.1 }}>Master Occupancy Report</Typography>
                    <Typography sx={{ fontFamily: fontBody, fontSize: "0.85rem", color: T.textSub, mt: 0.4 }}>Comprehensive analysis of institutional housing capacities and forward-looking trends.</Typography>
                </Box>
                <Box display="flex" gap={1.5}>
                    <FormControl size="small" sx={{ minWidth: 160 }}>
                        <InputLabel sx={{ fontFamily: fontBody, fontSize: '0.8rem' }}>Reporting Term</InputLabel>
                        <Select value={period} label="Reporting Term" onChange={e => setPeriod(e.target.value)} sx={{ borderRadius: "8px", fontFamily: fontBody, fontSize: '0.85rem', bgcolor: T.surface, fontWeight: 600 }}>
                            {["Spring 2024", "Fall 2023", "Spring 2023", "FY 2023-2024"].map(t => <MenuItem key={t} value={t} sx={{ fontFamily: fontBody, fontSize: '0.85rem', fontWeight: 600 }}>{t}</MenuItem>)}
                        </Select>
                    </FormControl>
                    <Button variant="contained" startIcon={<FileDownload sx={{ fontSize: 18 }} />} sx={{ fontFamily: fontBody, fontWeight: 700, fontSize: "0.85rem", textTransform: "none", borderRadius: "8px", bgcolor: T.accent, boxShadow: "none", px: 2 }}>Export CSV</Button>
                </Box>
            </Box>

            <Grid container spacing={3} mb={3}>
                <Grid item xs={12} md={3}><StatCard label="Total Capacity" value={totalCapacity} color={T.text} bgLight="#E5E7EB" icon={Domain} sub="Total Commissioned Beds" /></Grid>
                <Grid item xs={12} md={3}><StatCard label="Active Residents" value={totalOccupied} color={T.success} bgLight={T.successLight} icon={Hotel} sub={`Fill Rate: ${overallRate}%`} /></Grid>
                <Grid item xs={12} md={3}><StatCard label="Vacant & Available" value={totalVacant} color={T.info} bgLight={T.infoLight} icon={FactCheck} sub="Ready for allocation" /></Grid>
                <Grid item xs={12} md={3}><StatCard label="Under Maintenance" value={totalMaintenance} color={T.danger} bgLight={T.dangerLight} icon={HomeWork} sub="Offline due to repairs" /></Grid>
            </Grid>

            {/* Division Level Visual Matrix */}
            <Card className="fade-up" sx={{ p: 3, borderRadius: "14px", border: `1px solid ${T.border}`, background: T.surface, boxShadow: "0 1px 4px rgba(0,0,0,0.04)", mb: 3 }}>
                <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1.1rem", mb: 2 }}>Macro Division Matrix</Typography>
                <Grid container spacing={4}>
                    <Grid item xs={12} md={6}>
                        <Box display="flex" justifyContent="space-between" mb={1}>
                            <Typography sx={{ fontFamily: fontBody, fontWeight: 700, color: T.info }}>Boys Hostel Cluster</Typography>
                            <Typography sx={{ fontFamily: fontMono, fontWeight: 700, color: T.text }}>{boysOcc} / {boysCap}</Typography>
                        </Box>
                        <Box className="chart-bar">
                            <Box className="chart-fill-b" sx={{ width: `${(boysOcc / boysCap) * 100}%` }}>{((boysOcc / boysCap) * 100).toFixed(1)}%</Box>
                            <Box className="chart-vacant" sx={{ flex: 1 }}>{boysCap - boysOcc} Vacant</Box>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Box display="flex" justifyContent="space-between" mb={1}>
                            <Typography sx={{ fontFamily: fontBody, fontWeight: 700, color: T.pink }}>Girls Hostel Cluster</Typography>
                            <Typography sx={{ fontFamily: fontMono, fontWeight: 700, color: T.text }}>{girlsOcc} / {girlsCap}</Typography>
                        </Box>
                        <Box className="chart-bar">
                            <Box className="chart-fill-g" sx={{ width: `${(girlsOcc / girlsCap) * 100}%` }}>{((girlsOcc / girlsCap) * 100).toFixed(1)}%</Box>
                            <Box className="chart-vacant" sx={{ flex: 1 }}>{girlsCap - girlsOcc} Vacant</Box>
                        </Box>
                    </Grid>
                </Grid>
            </Card>

            <Grid container spacing={3}>
                <Grid item xs={12} lg={8}>
                    {/* Granular Report */}
                    <Card className="fade-up" sx={{ borderRadius: "14px", border: `1px solid ${T.border}`, boxShadow: "0 1px 4px rgba(0,0,0,0.04)", height: "100%" }}>
                        <Box sx={{ p: 2.5, borderBottom: `1px solid ${T.border}`, bgcolor: "#FAFBFD", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <Box>
                                <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1.1rem" }}>Granular Property Report</Typography>
                                <Typography sx={{ fontFamily: fontBody, fontSize: "0.78rem", color: T.textMute }}>Block-by-block breakdown of assets and metrics.</Typography>
                            </Box>
                            <Button size="small" variant="outlined" sx={{ fontFamily: fontBody, fontWeight: 700, textTransform: "none", color: T.textSub, borderColor: T.border }}>Advanced Filters</Button>
                        </Box>
                        <Table>
                            <TableHead><TableRow sx={{ bgcolor: "#F9FAFB" }}>
                                {["Property Block", "Supervisor", "Metrics (Occ/Cap)", "YTD Avg", "Trending M-o-M", "Status"].map((h, i) => <TableCell key={h} sx={{ fontFamily: fontBody, fontWeight: 700, fontSize: "0.72rem", color: T.textMute, textTransform: "uppercase", py: 1.5, ...(i === 5 ? { textAlign: "right" } : {}) }}>{h}</TableCell>)}
                            </TableRow></TableHead>
                            <TableBody>
                                {RAW_DATA.map(row => {
                                    const rate = (row.occupied / row.totalBeds) * 100;
                                    const isCritical = rate > 95;
                                    return (
                                        <TableRow key={row.block} className="row-hover">
                                            <TableCell>
                                                <Typography sx={{ fontFamily: fontBody, fontWeight: 700, fontSize: "0.85rem", color: T.text }}>{row.block}</Typography>
                                                <Typography sx={{ fontFamily: fontBody, fontSize: "0.7rem", fontWeight: 700, color: row.division === "Girls" ? T.pink : T.info, mt: 0.3 }}>{row.division} Division</Typography>
                                            </TableCell>
                                            <TableCell sx={{ fontFamily: fontBody, fontSize: "0.82rem", color: T.textSub }}>{row.warden}</TableCell>
                                            <TableCell sx={{ minWidth: 140 }}>
                                                <Box display="flex" justifyContent="space-between" mb={0.5}>
                                                    <Typography sx={{ fontFamily: fontMono, fontSize: "0.85rem", fontWeight: 700, color: T.text }}>{row.occupied} / {row.totalBeds}</Typography>
                                                    <Typography sx={{ fontFamily: fontMono, fontSize: "0.75rem", color: T.textSub }}>{rate.toFixed(1)}%</Typography>
                                                </Box>
                                                <LinearProgress variant="determinate" value={rate} sx={{ height: 6, borderRadius: 3, bgcolor: T.bg, "& .MuiLinearProgress-bar": { bgcolor: isCritical ? T.success : T.accent } }} />
                                            </TableCell>
                                            <TableCell sx={{ fontFamily: fontMono, fontSize: "0.85rem", color: T.textSub }}>{row.ytdAvg}</TableCell>
                                            <TableCell sx={{ fontFamily: fontMono, fontSize: "0.8rem", fontWeight: 700, color: row.trend.includes("+") ? T.success : (row.trend.includes("-") ? T.warning : T.textSub) }}>
                                                <Box display="flex" alignItems="center"><ShowChart sx={{ fontSize: 14, mr: 0.5 }} /> {row.trend}</Box>
                                            </TableCell>
                                            <TableCell sx={{ textAlign: "right" }}>
                                                <Chip label={isCritical ? "Near Capacity" : "Optimal"} size="small" sx={{ fontFamily: fontBody, fontWeight: 700, fontSize: "0.65rem", bgcolor: isCritical ? T.accentLight : T.successLight, color: isCritical ? T.accent : T.success, borderRadius: "4px" }} />
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </Card>
                </Grid>
                <Grid item xs={12} lg={4}>
                    {/* Upcoming Vacancies */}
                    <Card className="fade-up" sx={{ borderRadius: "14px", border: `1px solid ${T.border}`, boxShadow: "0 1px 4px rgba(0,0,0,0.04)", height: "100%" }}>
                        <Box sx={{ p: 2.5, borderBottom: `1px solid ${T.border}`, bgcolor: "#FAFBFD", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <Box>
                                <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1.05rem" }}>Projected Vacancies</Typography>
                                <Typography sx={{ fontFamily: fontBody, fontSize: "0.75rem", color: T.textMute }}>Within next 30 days based on check-out dates.</Typography>
                            </Box>
                        </Box>
                        <Box sx={{ p: 0 }}>
                            {UPCOMING_VACANCIES.map((v, i) => (
                                <Box key={v.id} sx={{ p: 2, borderBottom: i < UPCOMING_VACANCIES.length - 1 ? `1px solid ${T.border}` : 'none', "&:hover": { bgcolor: "#F9FAFB" }, transition: "0.2s" }}>
                                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.5}>
                                        <Typography sx={{ fontFamily: fontMono, fontWeight: 700, fontSize: "0.9rem", color: T.text }}>{v.room}</Typography>
                                        <Typography sx={{ fontFamily: fontMono, fontSize: "0.75rem", color: T.accent, bgcolor: T.accentLight, px: 1, py: 0.3, borderRadius: "4px", fontWeight: 700 }}>{v.date}</Typography>
                                    </Box>
                                    <Typography sx={{ fontFamily: fontBody, fontSize: "0.85rem", color: T.textSub }}>{v.block}</Typography>
                                    <Box display="flex" justifyContent="space-between" mt={1}>
                                        <Typography sx={{ fontFamily: fontBody, fontSize: "0.75rem", color: T.textMute }}>{v.student}</Typography>
                                        <Typography sx={{ fontFamily: fontBody, fontSize: "0.75rem", color: T.warning, fontStyle: "italic" }}>{v.reason}</Typography>
                                    </Box>
                                </Box>
                            ))}
                        </Box>
                        <Box sx={{ p: 2, borderTop: `1px solid ${T.border}`, textAlign: "center", bgcolor: "#FAFBFD" }}>
                            <Button fullWidth sx={{ fontFamily: fontBody, fontWeight: 700, textTransform: "none", color: T.accent }}>View Complete Projection Schedule</Button>
                        </Box>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}
