import React from "react";
import { Box, Card, Typography, Grid, Avatar } from "@mui/material";
import { BuildCircle, Warning, CheckCircle, Moving } from "@mui/icons-material";
import { T, fontHead, fontBody, fontMono, Fonts, currentStaff, mockWorkOrders } from "./maintenanceShared";

const StatCard = ({ icon, label, value, color, delay }) => (
    <Card className="fade-up" sx={{ p: 3, borderRadius: "16px", border: `1px solid ${T.border}`, boxShadow: "0 1px 4px rgba(0,0,0,0.02)", display: "flex", alignItems: "center", gap: 2, style: { animationDelay: delay } }}>
        <Box sx={{ width: 48, height: 48, borderRadius: "12px", bgcolor: `${color}15`, display: "flex", alignItems: "center", justifyContent: "center", color }}>
            {icon}
        </Box>
        <Box>
            <Typography sx={{ fontFamily: fontMono, fontSize: "1.4rem", fontWeight: 700, color: T.text, lineHeight: 1 }}>{value}</Typography>
            <Typography sx={{ fontFamily: fontBody, fontSize: "0.8rem", color: T.textSub, mt: 0.5, fontWeight: 600 }}>{label}</Typography>
        </Box>
    </Card>
);

export default function MaintenanceDashboard() {
    return (
        <Box sx={{ p: 3, background: T.bg, minHeight: "100vh", fontFamily: fontBody }}>
            <style>{Fonts()}</style>

            <Box display="flex" justifyContent="space-between" alignItems="flex-end" mb={4} className="fade-up">
                <Box>
                    <Typography sx={{ fontFamily: fontBody, fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: T.textMute, mb: 0.3 }}>Maintenance Portal</Typography>
                    <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1.5rem", color: T.text, lineHeight: 1.1 }}>Welcome, {currentStaff.name.split(" ")[0]}</Typography>
                </Box>
                <Box textAlign="right" sx={{ display: { xs: "none", sm: "block" } }}>
                    <Typography sx={{ fontFamily: fontHead, fontSize: "0.95rem", fontWeight: 700, color: T.text }}>{currentStaff.trade}</Typography>
                    <Typography sx={{ fontFamily: fontMono, fontSize: "0.8rem", color: T.textSub }}>ID: {currentStaff.id}</Typography>
                </Box>
            </Box>

            <Grid container spacing={3} mb={4}>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard icon={<Warning />} label="Pending Tasks" value="2" color={T.error} delay="0.1s" />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard icon={<Moving />} label="In Progress" value="1" color={T.primary} delay="0.2s" />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard icon={<CheckCircle />} label="Completed Today" value="0" color={T.success} delay="0.3s" />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard icon={<BuildCircle />} label="Materials Pending" value="1" color={T.info} delay="0.4s" />
                </Grid>
            </Grid>

            <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                    <Card className="fade-up" style={{ animationDelay: '0.4s' }} sx={{ p: 3, borderRadius: "16px", border: `1px solid ${T.border}`, boxShadow: "0 1px 4px rgba(0,0,0,0.02)", height: "100%" }}>
                        <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1.1rem", mb: 3 }}>Today's Priority Tasks</Typography>

                        {mockWorkOrders.filter(w => w.status !== "Completed").map((wo, i) => (
                            <Box key={i} sx={{ p: 2, mb: 2, borderRadius: "10px", border: `1px solid ${wo.priority === "High" ? T.errorLight : T.border}`, bgcolor: wo.priority === "High" ? '#FEF2F2' : T.surface, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <Box>
                                    <Box display="flex" alignItems="center" gap={1.5} mb={0.5}>
                                        <Typography sx={{ fontFamily: fontMono, fontSize: "0.75rem", fontWeight: 700, color: T.textSub }}>{wo.id}</Typography>
                                        <Box sx={{ px: 1, py: 0.2, borderRadius: "4px", bgcolor: wo.priority === "High" ? T.error : T.textSub, color: "white", fontSize: "0.6rem", fontWeight: 700, fontFamily: fontMono, textTransform: "uppercase" }}>{wo.priority} PRIORITY</Box>
                                    </Box>
                                    <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "0.95rem", color: T.text }}>{wo.issue}</Typography>
                                    <Typography sx={{ fontFamily: fontBody, fontSize: "0.85rem", color: T.textSub, mt: 0.2 }}>{wo.location}</Typography>
                                </Box>
                                <Typography sx={{ fontFamily: fontMono, fontWeight: 700, fontSize: "0.8rem", color: wo.status === "Pending" ? T.error : T.primary }}>{wo.status}</Typography>
                            </Box>
                        ))}
                    </Card>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Card className="fade-up" style={{ animationDelay: '0.5s' }} sx={{ p: 3, borderRadius: "16px", border: `1px solid ${T.border}`, boxShadow: "0 1px 4px rgba(0,0,0,0.02)", height: "100%" }}>
                        <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1.1rem", mb: 2 }}>Quick Actions</Typography>
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                            {['Update Work Status', 'Request Materials', 'Mark Attendance'].map((action, i) => (
                                <Box key={i} sx={{ p: 1.5, borderRadius: "8px", border: `1px dashed ${T.border}`, cursor: "pointer", transition: "0.2s", '&:hover': { bgcolor: T.bg, borderColor: T.primary } }}>
                                    <Typography sx={{ fontFamily: fontBody, fontWeight: 600, fontSize: "0.85rem", color: T.text }}>{action}</Typography>
                                </Box>
                            ))}
                        </Box>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}
