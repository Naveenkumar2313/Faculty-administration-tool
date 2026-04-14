import React from "react";
import {
    Box, Card, Grid, Typography, Button, LinearProgress, Table, TableBody,
    TableCell, TableHead, TableRow, Chip, Divider, Avatar
} from "@mui/material";
import {
    HomeWork, Hotel, FactCheck, DoneAll, AccessTime, Build, ArrowForward,
    WarningAmber, HowToReg, NightsStay, ErrorOutline
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

/* ── Design Tokens ── */
const T = {
    bg: "#F5F7FA", surface: "#FFFFFF", border: "#E4E8EF", text: "#111827", textSub: "#4B5563", textMute: "#9CA3AF",
    accent: "#6366F1", accentLight: "#EEF2FF", success: "#10B981", successLight: "#ECFDF5",
    warning: "#F59E0B", warningLight: "#FFFBEB", danger: "#EF4444", dangerLight: "#FEF2F2",
    info: "#3B82F6", infoLight: "#EFF6FF", purple: "#8B5CF6", purpleLight: "#F5F3FF",
    pink: "#EC4899", pinkLight: "#FDF2F8"
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
    .hover-lift:hover { transform: translateY(-2px); box-shadow: 0 6px 16px rgba(0,0,0,0.07); transition: all 0.2s ease; }
    .row-hover:hover { background: #F9FAFB !important; transition: background 0.15s; }
  `}</style>
);

/* ── Occupancy Data ── */
const OCCUPANCY = [
    { block: "Boys Hostel A", capacity: 250, occupied: 245, division: "Boys" },
    { block: "Boys Hostel B", capacity: 200, occupied: 180, division: "Boys" },
    { block: "Boys Hostel C", capacity: 150, occupied: 148, division: "Boys" },
    { block: "Girls Hostel A", capacity: 220, occupied: 215, division: "Girls" },
    { block: "Girls Hostel B", capacity: 180, occupied: 152, division: "Girls" }
];

/* ── Complaints Data ── */
const COMPLAINTS = [
    { id: "CMP-021", issue: "Bathroom pipe leaking", block: "Girls B, Rm 205", priority: "High", time: "2h ago" },
    { id: "CMP-022", issue: "Fan regulator not working", block: "Boys A, Rm 101", priority: "Medium", time: "4h ago" },
    { id: "CMP-023", issue: "Window latch broken", block: "Boys C, Rm 310", priority: "Low", time: "6h ago" },
    { id: "CMP-024", issue: "Water heater malfunction", block: "Girls A, Rm 118", priority: "High", time: "1h ago" }
];

/* ── Pending Approvals ── */
const APPROVALS = [
    { id: "REQ-110", student: "Rahul Sharma", type: "Late Entry", detail: "Return by 11:30 PM", block: "Boys A" },
    { id: "REQ-111", student: "Priya Patel", type: "Late Entry", detail: "Medical emergency visit", block: "Girls B" },
    { id: "REQ-112", student: "Aman Gupta", type: "Late Entry", detail: "Train delay, ETA 12:15 AM", block: "Boys B" },
    { id: "REQ-113", student: "Neha Singh", type: "Room Swap", detail: "Rm 204 → Rm 310", block: "Girls A" },
    { id: "REQ-114", student: "Vikram Kumar", type: "Late Entry", detail: "Family function", block: "Boys C" }
];

/* ── Attendance Data ── */
const ATTENDANCE = {
    boys: { total: 573, present: 558, absent: 10, leave: 5 },
    girls: { total: 367, present: 355, absent: 8, leave: 4 }
};

const StatCard = ({ label, value, sub, color, icon: Icon, bgLight, onClick }) => (
    <Card onClick={onClick} className="fade-up hover-lift" sx={{ p: 2.5, borderRadius: "14px", border: `1px solid ${T.border}`, background: T.surface, cursor: onClick ? "pointer" : "default", boxShadow: "0 1px 4px rgba(0,0,0,0.04)", height: "100%" }}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
            <Box>
                <Typography sx={{ fontFamily: fontBody, fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: T.textMute, mb: 0.5 }}>{label}</Typography>
                <Typography sx={{ fontFamily: fontMono, fontWeight: 700, fontSize: "1.9rem", color: color || T.text, lineHeight: 1.1 }}>{value}</Typography>
                {sub && <Typography sx={{ fontFamily: fontBody, fontSize: "0.75rem", color: T.textSub, mt: 0.6, fontWeight: 600 }}>{sub}</Typography>}
            </Box>
            {Icon && <Box sx={{ p: 1.3, borderRadius: "10px", bgcolor: bgLight, color }}><Icon sx={{ fontSize: 22 }} /></Box>}
        </Box>
    </Card>
);

const SectionHeader = ({ title, subtitle, action, onAction }) => (
    <Box sx={{ p: 2.5, borderBottom: `1px solid ${T.border}`, bgcolor: "#FAFBFD", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Box>
            <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1.05rem", color: T.text }}>{title}</Typography>
            {subtitle && <Typography sx={{ fontFamily: fontBody, fontSize: "0.75rem", color: T.textMute, mt: 0.2 }}>{subtitle}</Typography>}
        </Box>
        {action && <Button size="small" endIcon={<ArrowForward sx={{ fontSize: 14 }} />} onClick={onAction} sx={{ fontFamily: fontBody, fontWeight: 700, fontSize: "0.75rem", color: T.accent, textTransform: "none" }}>{action}</Button>}
    </Box>
);

export default function HostelDashboard() {
    const navigate = useNavigate();

    const totalCap = OCCUPANCY.reduce((a, c) => a + c.capacity, 0);
    const totalOcc = OCCUPANCY.reduce((a, c) => a + c.occupied, 0);
    const totalVacant = totalCap - totalOcc;
    const fillRate = ((totalOcc / totalCap) * 100).toFixed(1);

    const totalPresent = ATTENDANCE.boys.present + ATTENDANCE.girls.present;
    const totalResident = ATTENDANCE.boys.total + ATTENDANCE.girls.total;
    const totalAbsent = ATTENDANCE.boys.absent + ATTENDANCE.girls.absent;
    const totalLeave = ATTENDANCE.boys.leave + ATTENDANCE.girls.leave;
    const presenceRate = ((totalPresent / totalResident) * 100).toFixed(1);

    return (
        <Box sx={{ p: 3, background: T.bg, minHeight: "100vh", fontFamily: fontBody }}>
            <Fonts />

            {/* ── Header ── */}
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} className="fade-up">
                <Box>
                    <Typography sx={{ fontFamily: fontBody, fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: T.textMute, mb: 0.3 }}>Control Center</Typography>
                    <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1.6rem", color: T.text, lineHeight: 1.1 }}>Hostel Administration</Typography>
                </Box>
                <Box sx={{ textAlign: "right" }}>
                    <Typography sx={{ fontFamily: fontMono, fontSize: "0.85rem", color: T.text, fontWeight: 700 }}>
                        {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' })}
                    </Typography>
                    <Typography sx={{ fontFamily: fontMono, fontSize: "0.72rem", color: T.textMute }}>
                        {new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })} IST
                    </Typography>
                </Box>
            </Box>

            {/* ── Stat Cards ── */}
            <Grid container spacing={2.5} mb={3}>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard label="Total Residents" value={totalResident} sub={`${totalCap} Bed Capacity`} color={T.text} icon={HomeWork} bgLight="#E5E7EB" />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard label="Occupancy Rate" value={`${fillRate}%`} sub={`${totalVacant} Beds Vacant`} color={T.info} icon={Hotel} bgLight={T.infoLight} onClick={() => navigate('/hostel/reports/occupancy')} />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard label="Attendance Rate" value={`${presenceRate}%`} sub={`${totalAbsent} Absent Tonight`} color={parseFloat(presenceRate) > 95 ? T.success : T.warning} icon={NightsStay} bgLight={parseFloat(presenceRate) > 95 ? T.successLight : T.warningLight} onClick={() => navigate('/hostel/attendance/nightly')} />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard label="Pending Approvals" value={APPROVALS.length} sub={`${APPROVALS.filter(a => a.type === "Late Entry").length} Late Entry Requests`} color={T.accent} icon={AccessTime} bgLight={T.accentLight} onClick={() => navigate('/hostel/attendance/late-entry')} />
                </Grid>
            </Grid>

            {/* ── Row 2: Occupancy Summary + Complaints ── */}
            <Grid container spacing={3} mb={3}>
                {/* Occupancy Summary */}
                <Grid item xs={12} lg={7}>
                    <Card className="fade-up" sx={{ borderRadius: "14px", border: `1px solid ${T.border}`, boxShadow: "0 1px 4px rgba(0,0,0,0.04)", height: "100%" }}>
                        <SectionHeader title="Occupancy Summary" subtitle="Block-wise capacity utilization" action="Full Report" onAction={() => navigate('/hostel/reports/occupancy')} />
                        <Table>
                            <TableHead><TableRow sx={{ bgcolor: "#F9FAFB" }}>
                                {["Block", "Division", "Occupied / Capacity", "Fill Rate"].map(h => (
                                    <TableCell key={h} sx={{ fontFamily: fontBody, fontWeight: 700, fontSize: "0.7rem", color: T.textMute, textTransform: "uppercase", py: 1.2 }}>{h}</TableCell>
                                ))}
                            </TableRow></TableHead>
                            <TableBody>
                                {OCCUPANCY.map(row => {
                                    const rate = (row.occupied / row.capacity) * 100;
                                    const divColor = row.division === "Boys" ? T.info : T.pink;
                                    return (
                                        <TableRow key={row.block} className="row-hover">
                                            <TableCell sx={{ fontFamily: fontBody, fontWeight: 700, fontSize: "0.85rem", color: T.text, py: 1.5 }}>{row.block}</TableCell>
                                            <TableCell>
                                                <Chip label={row.division} size="small" sx={{ fontFamily: fontBody, fontWeight: 700, fontSize: "0.65rem", bgcolor: `${divColor}12`, color: divColor, height: 22, borderRadius: "4px" }} />
                                            </TableCell>
                                            <TableCell sx={{ minWidth: 160 }}>
                                                <Box display="flex" justifyContent="space-between" mb={0.5}>
                                                    <Typography sx={{ fontFamily: fontMono, fontSize: "0.82rem", fontWeight: 700, color: T.text }}>{row.occupied} / {row.capacity}</Typography>
                                                </Box>
                                                <LinearProgress variant="determinate" value={rate} sx={{ height: 5, borderRadius: 3, bgcolor: T.bg, "& .MuiLinearProgress-bar": { bgcolor: rate > 95 ? T.success : T.accent, borderRadius: 3 } }} />
                                            </TableCell>
                                            <TableCell>
                                                <Typography sx={{ fontFamily: fontMono, fontSize: "0.85rem", fontWeight: 700, color: rate > 95 ? T.success : T.accent }}>{rate.toFixed(1)}%</Typography>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                        <Box sx={{ p: 2, borderTop: `1px solid ${T.border}`, bgcolor: "#FAFBFD", display: "flex", gap: 4 }}>
                            <Typography sx={{ fontFamily: fontBody, fontSize: "0.78rem", color: T.textSub }}><b style={{ color: T.text }}>{totalOcc}</b> Occupied</Typography>
                            <Typography sx={{ fontFamily: fontBody, fontSize: "0.78rem", color: T.textSub }}><b style={{ color: T.info }}>{totalVacant}</b> Vacant</Typography>
                            <Typography sx={{ fontFamily: fontBody, fontSize: "0.78rem", color: T.textSub }}><b style={{ color: T.text }}>{totalCap}</b> Total Capacity</Typography>
                        </Box>
                    </Card>
                </Grid>

                {/* Today's Complaints */}
                <Grid item xs={12} lg={5}>
                    <Card className="fade-up" sx={{ borderRadius: "14px", border: `1px solid ${T.border}`, boxShadow: "0 1px 4px rgba(0,0,0,0.04)", height: "100%" }}>
                        <SectionHeader title="Today's Complaints" subtitle={`${COMPLAINTS.length} issues reported today`} action="View All" onAction={() => navigate('/admin/CIMS/hostel-complaints')} />
                        <Box sx={{ p: 0 }}>
                            {COMPLAINTS.map((c, i) => {
                                const pColor = c.priority === "High" ? T.danger : c.priority === "Medium" ? T.warning : T.textSub;
                                const pBg = c.priority === "High" ? T.dangerLight : c.priority === "Medium" ? T.warningLight : T.bg;
                                return (
                                    <Box key={c.id} sx={{ px: 2.5, py: 2, borderBottom: i < COMPLAINTS.length - 1 ? `1px solid ${T.border}` : "none", "&:hover": { bgcolor: "#F9FAFB" }, transition: "0.15s" }}>
                                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.5}>
                                            <Box display="flex" alignItems="center" gap={1.5}>
                                                <Avatar sx={{ width: 30, height: 30, bgcolor: pBg, color: pColor }}><Build sx={{ fontSize: 15 }} /></Avatar>
                                                <Typography sx={{ fontFamily: fontBody, fontWeight: 700, fontSize: "0.85rem", color: T.text }}>{c.issue}</Typography>
                                            </Box>
                                            <Chip label={c.priority} size="small" sx={{ fontFamily: fontBody, fontWeight: 700, fontSize: "0.62rem", bgcolor: pBg, color: pColor, height: 20, borderRadius: "4px", border: `1px solid ${pColor}30` }} />
                                        </Box>
                                        <Box display="flex" justifyContent="space-between" pl={5.5}>
                                            <Typography sx={{ fontFamily: fontBody, fontSize: "0.75rem", color: T.textSub }}>{c.block}</Typography>
                                            <Typography sx={{ fontFamily: fontMono, fontSize: "0.7rem", color: T.textMute }}>{c.time}</Typography>
                                        </Box>
                                    </Box>
                                );
                            })}
                        </Box>
                        <Box sx={{ p: 1.5, borderTop: `1px solid ${T.border}`, bgcolor: "#FAFBFD", textAlign: "center" }}>
                            <Button size="small" onClick={() => navigate('/hostel/complaints/escalate')} sx={{ fontFamily: fontBody, fontWeight: 700, fontSize: "0.75rem", color: T.danger, textTransform: "none" }}>
                                <ErrorOutline sx={{ fontSize: 14, mr: 0.5 }} /> Escalate Pending Issues
                            </Button>
                        </Box>
                    </Card>
                </Grid>
            </Grid>

            {/* ── Row 3: Pending Approvals + Attendance Overview ── */}
            <Grid container spacing={3}>
                {/* Pending Approvals */}
                <Grid item xs={12} lg={5}>
                    <Card className="fade-up" sx={{ borderRadius: "14px", border: `1px solid ${T.border}`, boxShadow: "0 1px 4px rgba(0,0,0,0.04)", height: "100%" }}>
                        <SectionHeader title="Pending Approvals" subtitle={`${APPROVALS.length} requests awaiting action`} action="Review All" onAction={() => navigate('/hostel/attendance/late-entry')} />
                        <Box sx={{ p: 0 }}>
                            {APPROVALS.map((a, i) => (
                                <Box key={a.id} sx={{ px: 2.5, py: 1.8, borderBottom: i < APPROVALS.length - 1 ? `1px solid ${T.border}` : "none", "&:hover": { bgcolor: "#F9FAFB" }, transition: "0.15s" }}>
                                    <Box display="flex" justifyContent="space-between" alignItems="center">
                                        <Box display="flex" alignItems="center" gap={1.5}>
                                            <Avatar sx={{ width: 32, height: 32, bgcolor: T.accentLight, color: T.accent, fontFamily: fontBody, fontWeight: 700, fontSize: "0.7rem" }}>
                                                {a.student.split(" ").map(n => n[0]).join("")}
                                            </Avatar>
                                            <Box>
                                                <Typography sx={{ fontFamily: fontBody, fontWeight: 700, fontSize: "0.85rem", color: T.text }}>{a.student}</Typography>
                                                <Typography sx={{ fontFamily: fontBody, fontSize: "0.72rem", color: T.textMute }}>{a.block} · {a.detail}</Typography>
                                            </Box>
                                        </Box>
                                        <Chip label={a.type} size="small" sx={{ fontFamily: fontBody, fontWeight: 700, fontSize: "0.62rem", bgcolor: a.type === "Late Entry" ? T.warningLight : T.purpleLight, color: a.type === "Late Entry" ? T.warning : T.purple, height: 20, borderRadius: "4px" }} />
                                    </Box>
                                </Box>
                            ))}
                        </Box>
                    </Card>
                </Grid>

                {/* Attendance Overview */}
                <Grid item xs={12} lg={7}>
                    <Card className="fade-up" sx={{ borderRadius: "14px", border: `1px solid ${T.border}`, boxShadow: "0 1px 4px rgba(0,0,0,0.04)", height: "100%" }}>
                        <SectionHeader title="Attendance Overview" subtitle="Last nightly roll-call summary" action="Full Attendance" onAction={() => navigate('/hostel/attendance/nightly')} />
                        <Box sx={{ p: 3 }}>
                            <Grid container spacing={3}>
                                {/* Boys */}
                                <Grid item xs={12} md={6}>
                                    <Box sx={{ p: 2.5, borderRadius: "12px", border: `1px solid ${T.info}25`, bgcolor: `${T.info}06` }}>
                                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                            <Typography sx={{ fontFamily: fontBody, fontWeight: 700, fontSize: "0.9rem", color: T.info }}>Boys Hostel</Typography>
                                            <Typography sx={{ fontFamily: fontMono, fontWeight: 700, fontSize: "1.1rem", color: T.text }}>
                                                {((ATTENDANCE.boys.present / ATTENDANCE.boys.total) * 100).toFixed(1)}%
                                            </Typography>
                                        </Box>
                                        <LinearProgress variant="determinate" value={(ATTENDANCE.boys.present / ATTENDANCE.boys.total) * 100} sx={{ height: 8, borderRadius: 4, bgcolor: `${T.info}15`, mb: 2, "& .MuiLinearProgress-bar": { bgcolor: T.info, borderRadius: 4 } }} />
                                        <Grid container spacing={1}>
                                            {[
                                                { label: "Present", val: ATTENDANCE.boys.present, color: T.success },
                                                { label: "Absent", val: ATTENDANCE.boys.absent, color: T.danger },
                                                { label: "On Leave", val: ATTENDANCE.boys.leave, color: T.warning }
                                            ].map(s => (
                                                <Grid item xs={4} key={s.label}>
                                                    <Box sx={{ textAlign: "center", p: 1, borderRadius: "8px", bgcolor: T.surface, border: `1px solid ${T.border}` }}>
                                                        <Typography sx={{ fontFamily: fontMono, fontWeight: 700, fontSize: "1.1rem", color: s.color }}>{s.val}</Typography>
                                                        <Typography sx={{ fontFamily: fontBody, fontSize: "0.65rem", fontWeight: 700, color: T.textMute, textTransform: "uppercase" }}>{s.label}</Typography>
                                                    </Box>
                                                </Grid>
                                            ))}
                                        </Grid>
                                    </Box>
                                </Grid>

                                {/* Girls */}
                                <Grid item xs={12} md={6}>
                                    <Box sx={{ p: 2.5, borderRadius: "12px", border: `1px solid ${T.pink}25`, bgcolor: `${T.pink}06` }}>
                                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                            <Typography sx={{ fontFamily: fontBody, fontWeight: 700, fontSize: "0.9rem", color: T.pink }}>Girls Hostel</Typography>
                                            <Typography sx={{ fontFamily: fontMono, fontWeight: 700, fontSize: "1.1rem", color: T.text }}>
                                                {((ATTENDANCE.girls.present / ATTENDANCE.girls.total) * 100).toFixed(1)}%
                                            </Typography>
                                        </Box>
                                        <LinearProgress variant="determinate" value={(ATTENDANCE.girls.present / ATTENDANCE.girls.total) * 100} sx={{ height: 8, borderRadius: 4, bgcolor: `${T.pink}15`, mb: 2, "& .MuiLinearProgress-bar": { bgcolor: T.pink, borderRadius: 4 } }} />
                                        <Grid container spacing={1}>
                                            {[
                                                { label: "Present", val: ATTENDANCE.girls.present, color: T.success },
                                                { label: "Absent", val: ATTENDANCE.girls.absent, color: T.danger },
                                                { label: "On Leave", val: ATTENDANCE.girls.leave, color: T.warning }
                                            ].map(s => (
                                                <Grid item xs={4} key={s.label}>
                                                    <Box sx={{ textAlign: "center", p: 1, borderRadius: "8px", bgcolor: T.surface, border: `1px solid ${T.border}` }}>
                                                        <Typography sx={{ fontFamily: fontMono, fontWeight: 700, fontSize: "1.1rem", color: s.color }}>{s.val}</Typography>
                                                        <Typography sx={{ fontFamily: fontBody, fontSize: "0.65rem", fontWeight: 700, color: T.textMute, textTransform: "uppercase" }}>{s.label}</Typography>
                                                    </Box>
                                                </Grid>
                                            ))}
                                        </Grid>
                                    </Box>
                                </Grid>
                            </Grid>

                            {/* Footer stats */}
                            <Box sx={{ mt: 2.5, p: 2, borderRadius: "10px", bgcolor: "#FAFBFD", border: `1px solid ${T.border}`, display: "flex", justifyContent: "space-around" }}>
                                {[
                                    { label: "Total Residents", val: totalResident, icon: <HowToReg sx={{ fontSize: 16, color: T.accent }} /> },
                                    { label: "Present", val: totalPresent, icon: <DoneAll sx={{ fontSize: 16, color: T.success }} /> },
                                    { label: "Absent", val: totalAbsent, icon: <WarningAmber sx={{ fontSize: 16, color: T.danger }} /> },
                                    { label: "Approved Leave", val: totalLeave, icon: <FactCheck sx={{ fontSize: 16, color: T.warning }} /> }
                                ].map((s, i) => (
                                    <Box key={s.label} display="flex" alignItems="center" gap={1}>
                                        {s.icon}
                                        <Box>
                                            <Typography sx={{ fontFamily: fontMono, fontWeight: 700, fontSize: "0.95rem", color: T.text, lineHeight: 1 }}>{s.val}</Typography>
                                            <Typography sx={{ fontFamily: fontBody, fontSize: "0.62rem", fontWeight: 700, color: T.textMute, textTransform: "uppercase" }}>{s.label}</Typography>
                                        </Box>
                                    </Box>
                                ))}
                            </Box>
                        </Box>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}
