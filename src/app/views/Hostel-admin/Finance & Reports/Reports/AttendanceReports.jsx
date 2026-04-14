import React, { useState } from "react";
import {
    Box, Card, Grid, Typography, Table, TableBody, TableCell, TableHead, TableRow,
    Button, Select, MenuItem, FormControl, InputLabel, Chip, Avatar
} from "@mui/material";
import {
    Download, DoneAll, AccessTime, Security, ReportProblem, WarningAmber, ErrorOutline, FactCheck
} from "@mui/icons-material";

/* ── Design Tokens ── */
const T = {
    bg: "#F5F7FA", surface: "#FFFFFF", border: "#E4E8EF", text: "#111827", textSub: "#4B5563", textMute: "#9CA3AF",
    accent: "#6366F1", accentLight: "#EEF2FF", success: "#10B981", successLight: "#ECFDF5",
    warning: "#F59E0B", warningLight: "#FFFBEB", danger: "#EF4444", dangerLight: "#FEF2F2",
    info: "#3B82F6", infoLight: "#EFF6FF", purple: "#8B5CF6", purpleLight: "#F5F3FF"
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
  `}</style>
);

const AGGREGATE_DATA = [
    { period: "Week 2 (April 2024)", curfews: 22, awol: 5, avgPresent: "95.1%", flag: "High Late Entries", status: "Critical" },
    { period: "Week 1 (April 2024)", curfews: 14, awol: 2, avgPresent: "96.4%", flag: "Normal Range", status: "Nominal" },
    { period: "Week 4 (March 2024)", curfews: 8, awol: 0, avgPresent: "98.2%", flag: "Optimal", status: "Excellent" },
    { period: "Week 3 (March 2024)", curfews: 45, awol: 12, avgPresent: "92.0%", flag: "Festival Season Surge", status: "Alert" }
];

const CHRONIC_DEFAULTERS = [
    { id: "STU-2105", name: "Vikram Kumar", division: "Boys", violations: 4, type: "Curfew Breaches", severity: "High" },
    { id: "STU-2115", name: "Riya Verma", division: "Girls", violations: 3, type: "Unauthorized Absence", severity: "Critical" },
    { id: "STU-2201", name: "Aman Gupta", division: "Boys", violations: 3, type: "Curfew Breaches", severity: "Medium" }
];

const StatCard = ({ label, value, sub, color, icon: Icon, bgLight }) => (
    <Card className="fade-up" sx={{ p: 2.5, borderRadius: "14px", border: `1px solid ${T.border}`, background: T.surface, boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
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

export default function AttendanceReports() {
    const [period, setPeriod] = useState("Last 30 Days");

    return (
        <Box sx={{ p: 3, background: T.bg, minHeight: "100vh", fontFamily: fontBody }}>
            <Fonts />
            <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3} className="fade-up">
                <Box>
                    <Typography sx={{ fontFamily: fontBody, fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: T.textMute, mb: 0.3 }}>Enterprise Analytics</Typography>
                    <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1.6rem", color: T.text, lineHeight: 1.1 }}>Compliance & Safety Report</Typography>
                    <Typography sx={{ fontFamily: fontBody, fontSize: "0.85rem", color: T.textSub, mt: 0.4 }}>Aggregated behavioral reports on nightly attendance, curfew fidelity, and security flags.</Typography>
                </Box>
                <Box display="flex" gap={1.5}>
                    <FormControl size="small" sx={{ minWidth: 160 }}>
                        <InputLabel sx={{ fontFamily: fontBody, fontSize: '0.8rem' }}>Timeline View</InputLabel>
                        <Select value={period} label="Timeline View" onChange={e => setPeriod(e.target.value)} sx={{ borderRadius: "8px", fontFamily: fontBody, fontSize: '0.85rem', bgcolor: T.surface, fontWeight: 600 }}>
                            {["Last 30 Days", "Current Semester", "Past Semester", "Year to Date"].map(t => <MenuItem key={t} value={t} sx={{ fontFamily: fontBody, fontSize: '0.85rem', fontWeight: 600 }}>{t}</MenuItem>)}
                        </Select>
                    </FormControl>
                    <Button variant="contained" startIcon={<Download sx={{ fontSize: 18 }} />} sx={{ fontFamily: fontBody, fontWeight: 700, fontSize: "0.85rem", textTransform: "none", borderRadius: "8px", bgcolor: T.accent, boxShadow: "none", px: 2 }}>Export PDF</Button>
                </Box>
            </Box>

            <Grid container spacing={3} mb={3}>
                <Grid item xs={12} md={3}><StatCard label="Overall Presence Score" value="95.4%" color={T.success} bgLight={T.successLight} icon={FactCheck} sub="Rolling 30-day average" /></Grid>
                <Grid item xs={12} md={3}><StatCard label="Curfew Penetrations" value="89" color={T.warning} bgLight={T.warningLight} icon={AccessTime} sub="Cumulative late entries logged" /></Grid>
                <Grid item xs={12} md={3}><StatCard label="Unauthorized Overstays" value="19" color={T.danger} bgLight={T.dangerLight} icon={Security} sub="Absentees lacking validated passes" /></Grid>
                <Grid item xs={12} md={3}><StatCard label="Chronic Defaulters" value="3" color={T.purple} bgLight={T.purpleLight} icon={ReportProblem} sub="Residents w/ > 3 violations" /></Grid>
            </Grid>

            <Grid container spacing={3}>
                <Grid item xs={12} lg={8}>
                    {/* Aggregated Trends */}
                    <Card className="fade-up" sx={{ borderRadius: "14px", border: `1px solid ${T.border}`, boxShadow: "0 1px 4px rgba(0,0,0,0.04)", height: "100%" }}>
                        <Box sx={{ p: 2.5, borderBottom: `1px solid ${T.border}`, bgcolor: "#FAFBFD", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <Box>
                                <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1.1rem" }}>Weekly Statistical Analysis</Typography>
                                <Typography sx={{ fontFamily: fontBody, fontSize: "0.78rem", color: T.textMute }}>Timeline mapping of discipline and security trends.</Typography>
                            </Box>
                        </Box>
                        <Table>
                            <TableHead><TableRow sx={{ bgcolor: "#F9FAFB" }}>
                                {["Audit Window", "Presence Index", "Curfew Violations", "Unauth Leave", "System Diagnostics"].map(h => <TableCell key={h} sx={{ fontFamily: fontBody, fontWeight: 700, fontSize: "0.72rem", color: T.textMute, textTransform: "uppercase", py: 1.5 }}>{h}</TableCell>)}
                            </TableRow></TableHead>
                            <TableBody>
                                {AGGREGATE_DATA.map(row => {
                                    const chipColors = {
                                        "Excellent": { b: T.successLight, c: T.success },
                                        "Nominal": { b: T.bg, c: T.textSub },
                                        "Critical": { b: T.warningLight, c: T.warning },
                                        "Alert": { b: T.dangerLight, c: T.danger }
                                    };
                                    const sc = chipColors[row.status];
                                    return (
                                        <TableRow key={row.period} className="row-hover">
                                            <TableCell sx={{ fontFamily: fontBody, fontWeight: 700, fontSize: "0.85rem", color: T.text }}>{row.period}</TableCell>
                                            <TableCell sx={{ fontFamily: fontMono, fontSize: "0.9rem", color: T.success, fontWeight: 700 }}>{row.avgPresent}</TableCell>
                                            <TableCell sx={{ fontFamily: fontMono, fontSize: "0.9rem", color: row.curfews > 15 ? T.warning : T.text }}>{row.curfews}</TableCell>
                                            <TableCell sx={{ fontFamily: fontMono, fontSize: "0.9rem", color: row.awol > 0 ? T.danger : T.text, fontWeight: row.awol > 0 ? 700 : 400 }}>{row.awol}</TableCell>
                                            <TableCell>
                                                <Typography sx={{ fontFamily: fontBody, fontSize: "0.75rem", color: T.textSub, mb: 0.5, maxWidth: 150 }}>{row.flag}</Typography>
                                                <Chip label={row.status} size="small" sx={{ fontFamily: fontBody, fontWeight: 700, fontSize: "0.65rem", bgcolor: sc.b, color: sc.c, height: 20, borderRadius: "4px" }} />
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </Card>
                </Grid>
                <Grid item xs={12} lg={4}>
                    {/* Action Required Board */}
                    <Card className="fade-up" sx={{ borderRadius: "14px", border: `1px solid ${T.border}`, boxShadow: "0 1px 4px rgba(0,0,0,0.04)", height: "100%", bgcolor: T.dangerLight }}>
                        <Box sx={{ p: 2.5, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <Box>
                                <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1.05rem", color: T.danger }}>Immediate Action Required</Typography>
                                <Typography sx={{ fontFamily: fontBody, fontSize: "0.75rem", color: T.danger, opacity: 0.8 }}>Chronic rule defaulters flagged by system.</Typography>
                            </Box>
                            <ErrorOutline sx={{ color: T.danger, fontSize: 28 }} />
                        </Box>
                        <Box sx={{ p: 2, pt: 0 }}>
                            {CHRONIC_DEFAULTERS.map((s, i) => (
                                <Card key={s.id} sx={{ p: 2, mb: i < CHRONIC_DEFAULTERS.length - 1 ? 1.5 : 0, borderRadius: "10px", border: `1px solid ${T.danger}30`, boxShadow: "none" }}>
                                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                                        <Typography sx={{ fontFamily: fontBody, fontWeight: 700, fontSize: "0.9rem", color: T.text }}>{s.name}</Typography>
                                        <Chip label={`${s.violations} Infractions`} size="small" sx={{ fontFamily: fontMono, fontSize: "0.65rem", fontWeight: 700, bgcolor: s.severity === "Critical" ? T.danger : T.warning, color: T.surface, height: 20 }} />
                                    </Box>
                                    <Typography sx={{ fontFamily: fontMono, fontSize: "0.75rem", color: T.textSub }}>{s.id} • {s.division}</Typography>
                                    <Box display="flex" justifyContent="space-between" mt={1.5} alignItems="center">
                                        <Typography sx={{ fontFamily: fontBody, fontSize: "0.75rem", color: T.danger, fontWeight: 600 }}>{s.type}</Typography>
                                        <Button size="small" sx={{ fontFamily: fontBody, fontWeight: 700, fontSize: "0.65rem", minWidth: 0, color: T.accent }}>View Log & Warn</Button>
                                    </Box>
                                </Card>
                            ))}
                        </Box>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}
