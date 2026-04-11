import React from "react";
import { Box, Card, Grid, Typography, Badge as MuiBadge, Avatar, LinearProgress } from "@mui/material";
import { People, Home, DoorFront, Error, Restaurant, Login, Logout } from "@mui/icons-material";

/* ── Design Tokens ── */
const T = {
    bg: "#F5F7FA", surface: "#FFFFFF", border: "#E4E8EF", text: "#111827", textSub: "#4B5563", textMute: "#9CA3AF",
    accent: "#6366F1", accentLight: "#EEF2FF", success: "#10B981", successLight: "#ECFDF5",
    warning: "#F59E0B", warningLight: "#FFFBEB", danger: "#EF4444", dangerLight: "#FEF2F2",
    info: "#3B82F6", infoLight: "#EFF6FF", purple: "#8B5CF6", purpleLight: "#F5F3FF",
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
  `}</style>
);

const SLabel = ({ children, sx = {} }) => (
    <Typography sx={{ fontFamily: fontBody, fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: T.textMute, mb: 0.5, ...sx }}>{children}</Typography>
);

const StatCard = ({ label, value, sub, color, icon: Icon, bgLight }) => (
    <Card className="fade-up" sx={{ p: 2.5, borderRadius: "14px", border: `1px solid ${T.border}`, background: T.surface, boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
            <Box>
                <SLabel>{label}</SLabel>
                <Typography sx={{ fontFamily: fontMono, fontWeight: 700, fontSize: "1.8rem", color: color || T.text, lineHeight: 1.1 }}>{value}</Typography>
                {sub && <Typography sx={{ fontFamily: fontBody, fontSize: "0.72rem", color: T.textMute, mt: 0.4 }}>{sub}</Typography>}
            </Box>
            {Icon && (
                <Box sx={{ p: 1.2, borderRadius: "10px", bgcolor: bgLight || `${color}15`, color: color }}>
                    <Icon sx={{ fontSize: 22 }} />
                </Box>
            )}
        </Box>
    </Card>
);

const StatusPill = ({ text, type = "success" }) => {
    const map = {
        success: { bg: T.successLight, color: T.success },
        warning: { bg: T.warningLight, color: T.warning },
        secondary: { bg: T.bg, color: T.textSub },
    };
    const s = map[type];
    return (
        <Box sx={{ px: 1, py: 0.3, borderRadius: "6px", bgcolor: s.bg, display: "inline-block" }}>
            <Typography sx={{ fontFamily: fontBody, fontSize: "0.7rem", fontWeight: 700, color: s.color }}>{text}</Typography>
        </Box>
    );
};

export default function HostelOverview() {
    return (
        <Box sx={{ p: 3, background: T.bg, minHeight: "100vh", fontFamily: fontBody }}>
            <Fonts />

            {/* ── Header ── */}
            <Box mb={3} className="fade-up">
                <Typography sx={{ fontFamily: fontBody, fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: T.textMute, mb: 0.3 }}>Admin Dashboard</Typography>
                <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1.5rem", color: T.text, lineHeight: 1.1 }}>Hostel Overview</Typography>
                <Typography sx={{ fontFamily: fontBody, fontSize: "0.82rem", color: T.textSub, mt: 0.4 }}>Comprehensive view of all hostel facilities, occupancy, and operations.</Typography>
            </Box>

            {/* ── Stat Cards ── */}
            <Grid container spacing={3} mb={3}>
                <Grid item xs={12} sm={6} md={3}><StatCard label="Total Capacity" value="1,200" sub="Across 4 blocks" color={T.accent} bgLight={T.accentLight} icon={People} /></Grid>
                <Grid item xs={12} sm={6} md={3}><StatCard label="Occupied Rooms" value="1,140" sub="95% occupancy rate" color={T.success} bgLight={T.successLight} icon={DoorFront} /></Grid>
                <Grid item xs={12} sm={6} md={3}><StatCard label="Vacant Rooms" value="60" sub="Available for allocation" color={T.info} bgLight={T.infoLight} icon={Home} /></Grid>
                <Grid item xs={12} sm={6} md={3}><StatCard label="Active Complaints" value="24" sub="8 critical issues" color={T.danger} bgLight={T.dangerLight} icon={Error} /></Grid>
            </Grid>

            <Grid container spacing={3} mb={3} className="fade-up">
                {/* ── Boys Hostels ── */}
                <Grid item xs={12} md={6}>
                    <Card sx={{ p: 0, borderRadius: "14px", border: `1px solid ${T.border}`, boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                        <Box sx={{ p: 2.5, borderBottom: `1px solid ${T.border}`, bgcolor: T.surface }}>
                            <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1.1rem", color: T.text }}>Boys Hostels</Typography>
                            <Typography sx={{ fontFamily: fontBody, fontSize: "0.78rem", color: T.textMute, mt: 0.2 }}>Occupancy and status for boys blocks</Typography>
                        </Box>
                        <Box sx={{ p: 2.5, display: "flex", flexDirection: "column", gap: 3 }}>
                            {[{ block: "Block A", pct: 95, occ: 380, tot: 400 }, { block: "Block B", pct: 96, occ: 290, tot: 300 }].map((b, i) => (
                                <Box key={i}>
                                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                                        <Typography sx={{ fontFamily: fontBody, fontWeight: 700, fontSize: "0.9rem", color: T.text }}>{b.block}</Typography>
                                        <StatusPill text={`${b.pct}% Full`} type="success" />
                                    </Box>
                                    <Box display="flex" justifyContent="space-between" mb={1}>
                                        <Typography sx={{ fontFamily: fontBody, fontSize: "0.75rem", color: T.textSub }}>{b.occ} / {b.tot} Occupied</Typography>
                                        <Typography sx={{ fontFamily: fontBody, fontSize: "0.75rem", color: T.textMute }}>{b.tot - b.occ} Vacant</Typography>
                                    </Box>
                                    <LinearProgress variant="determinate" value={b.pct} sx={{ height: 6, borderRadius: "3px", bgcolor: `${T.accent}20`, "& .MuiLinearProgress-bar": { borderRadius: "3px", bgcolor: T.accent } }} />
                                </Box>
                            ))}
                        </Box>
                    </Card>
                </Grid>

                {/* ── Girls Hostels ── */}
                <Grid item xs={12} md={6}>
                    <Card sx={{ p: 0, borderRadius: "14px", border: `1px solid ${T.border}`, boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                        <Box sx={{ p: 2.5, borderBottom: `1px solid ${T.border}`, bgcolor: T.surface }}>
                            <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1.1rem", color: T.text }}>Girls Hostels</Typography>
                            <Typography sx={{ fontFamily: fontBody, fontSize: "0.78rem", color: T.textMute, mt: 0.2 }}>Occupancy and status for girls blocks</Typography>
                        </Box>
                        <Box sx={{ p: 2.5, display: "flex", flexDirection: "column", gap: 3 }}>
                            <Box>
                                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                                    <Typography sx={{ fontFamily: fontBody, fontWeight: 700, fontSize: "0.9rem", color: T.text }}>Block G1</Typography>
                                    <StatusPill text="94% Full" type="success" />
                                </Box>
                                <Box display="flex" justifyContent="space-between" mb={1}>
                                    <Typography sx={{ fontFamily: fontBody, fontSize: "0.75rem", color: T.textSub }}>470 / 500 Occupied</Typography>
                                    <Typography sx={{ fontFamily: fontBody, fontSize: "0.75rem", color: T.textMute }}>30 Vacant</Typography>
                                </Box>
                                <LinearProgress variant="determinate" value={94} sx={{ height: 6, borderRadius: "3px", bgcolor: `${T.success}20`, "& .MuiLinearProgress-bar": { borderRadius: "3px", bgcolor: T.success } }} />
                            </Box>
                        </Box>
                    </Card>
                </Grid>
            </Grid>

            <Grid container spacing={3} className="fade-up">
                {/* ── Recent Activity ── */}
                <Grid item xs={12} md={6}>
                    <Card sx={{ p: 0, borderRadius: "14px", border: `1px solid ${T.border}`, boxShadow: "0 1px 4px rgba(0,0,0,0.04)", height: "100%" }}>
                        <Box sx={{ p: 2.5, borderBottom: `1px solid ${T.border}`, bgcolor: T.surface }}>
                            <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1.1rem", color: T.text }}>Recent Entry/Exit Activity</Typography>
                            <Typography sx={{ fontFamily: fontBody, fontSize: "0.78rem", color: T.textMute, mt: 0.2 }}>Latest student movements</Typography>
                        </Box>
                        <Box sx={{ p: 0 }}>
                            {[
                                { name: "Rahul Sharma", action: "Out", time: "10:15 AM", block: "Boys A" },
                                { name: "Priya Patel", action: "In", time: "10:05 AM", block: "Girls G1" },
                                { name: "Amit Kumar", action: "Out", time: "09:45 AM", block: "Boys B" },
                            ].map((log, i) => (
                                <Box key={i} sx={{ px: 2.5, py: 2, display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: i < 2 ? `1px solid ${T.border}` : "none", "&:hover": { bgcolor: "#F9FAFB" } }}>
                                    <Box display="flex" alignItems="center" gap={1.5}>
                                        <Avatar sx={{ width: 36, height: 36, bgcolor: log.action === "In" ? T.successLight : T.infoLight, color: log.action === "In" ? T.success : T.info }}>
                                            {log.action === "In" ? <Login fontSize="small" /> : <Logout fontSize="small" />}
                                        </Avatar>
                                        <Box>
                                            <Typography sx={{ fontFamily: fontBody, fontWeight: 600, fontSize: "0.85rem", color: T.text }}>{log.name}</Typography>
                                            <Typography sx={{ fontFamily: fontBody, fontSize: "0.7rem", color: T.textMute }}>{log.block}</Typography>
                                        </Box>
                                    </Box>
                                    <Box textAlign="right">
                                        <StatusPill text={log.action} type={log.action === "In" ? "success" : "secondary"} />
                                        <Typography sx={{ fontFamily: fontMono, fontSize: "0.7rem", color: T.textMute, mt: 0.5 }}>{log.time}</Typography>
                                    </Box>
                                </Box>
                            ))}
                        </Box>
                    </Card>
                </Grid>

                {/* ── Today's Mess Menu ── */}
                <Grid item xs={12} md={6}>
                    <Card sx={{ p: 0, borderRadius: "14px", border: `1px solid ${T.border}`, boxShadow: "0 1px 4px rgba(0,0,0,0.04)", height: "100%" }}>
                        <Box sx={{ p: 2.5, borderBottom: `1px solid ${T.border}`, bgcolor: T.surface }}>
                            <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1.1rem", color: T.text }}>Today's Mess Menu</Typography>
                            <Typography sx={{ fontFamily: fontBody, fontSize: "0.78rem", color: T.textMute, mt: 0.2 }}>Current meal plan across all hostels</Typography>
                        </Box>
                        <Box sx={{ p: 2.5, display: "flex", flexDirection: "column", gap: 2.5 }}>
                            {[
                                { meal: "Breakfast (07:30 - 09:30)", items: "Idli, Sambar, Chutney, Tea/Coffee" },
                                { meal: "Lunch (12:30 - 14:30)", items: "Rice, Roti, Dal Tadka, Paneer Butter Masala, Salad" },
                                { meal: "Dinner (19:30 - 21:30)", items: "Veg Pulao, Mixed Veg Curry, Raita, Gulab Jamun" },
                            ].map((m, i) => (
                                <Box key={i} display="flex" alignItems="flex-start" gap={2}>
                                    <Box sx={{ p: 1, borderRadius: "8px", bgcolor: T.accentLight, color: T.accent, display: "flex" }}>
                                        <Restaurant fontSize="small" />
                                    </Box>
                                    <Box>
                                        <Typography sx={{ fontFamily: fontBody, fontWeight: 700, fontSize: "0.85rem", color: T.text }}>{m.meal}</Typography>
                                        <Typography sx={{ fontFamily: fontBody, fontSize: "0.78rem", color: T.textSub, mt: 0.3 }}>{m.items}</Typography>
                                    </Box>
                                </Box>
                            ))}
                        </Box>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}
