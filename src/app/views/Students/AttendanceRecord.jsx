import React from "react";
import { Box, Card, Typography, Grid } from "@mui/material";
import { CalendarMonth, CheckCircleOutline, CancelOutlined } from "@mui/icons-material";
import { T, fontHead, fontBody, Fonts, mockAttendance } from "./studentShared";

const SLabel = ({ children }) => <Typography sx={{ fontFamily: fontBody, fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: T.textMute, mb: 0.5 }}>{children}</Typography>;

export default function AttendanceRecord() {
    const presentCount = mockAttendance.filter(a => a.status === 'Present').length;
    const absentCount = mockAttendance.filter(a => a.status === 'Absent').length;
    const percentage = Math.round((presentCount / mockAttendance.length) * 100);

    return (
        <Box sx={{ p: 3, background: T.bg, minHeight: "100vh", fontFamily: fontBody }}>
            <style>{Fonts()}</style>

            <Box mb={4} className="fade-up">
                <Typography sx={{ fontFamily: fontBody, fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: T.textMute, mb: 0.3 }}>Hostel Dashboard</Typography>
                <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1.5rem", color: T.text, lineHeight: 1.1 }}>Night Attendance Record</Typography>
                <Typography sx={{ fontFamily: fontBody, fontSize: "0.85rem", color: T.textSub, mt: 0.4 }}>Overview of your daily hostel attendance.</Typography>
            </Box>

            <Grid container spacing={3} mb={3}>
                <Grid item xs={12} sm={4}>
                    <Card className="fade-up" sx={{ p: 2.5, borderRadius: "14px", border: `1px solid ${T.border}`, boxShadow: "0 1px 4px rgba(0,0,0,0.02)" }}>
                        <SLabel>Overall Attendance</SLabel>
                        <Box display="flex" alignItems="center" gap={1.5} mt={1}>
                            <Box sx={{ width: 44, height: 44, borderRadius: "50%", bgcolor: T.accentLight, color: T.accent, display: "flex", alignItems: "center", justifyContent: "center" }}><CalendarMonth /></Box>
                            <Typography sx={{ fontFamily: fontHead, fontWeight: 800, fontSize: "2rem", color: percentage > 85 ? T.success : T.warning }}>{percentage}%</Typography>
                        </Box>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Card className="fade-up" sx={{ p: 2.5, borderRadius: "14px", border: `1px solid ${T.border}`, boxShadow: "0 1px 4px rgba(0,0,0,0.02)", style: { animationDelay: '0.1s' } }}>
                        <SLabel>Days Present</SLabel>
                        <Box display="flex" alignItems="center" gap={1.5} mt={1}>
                            <Box sx={{ width: 44, height: 44, borderRadius: "50%", bgcolor: T.successLight, color: T.success, display: "flex", alignItems: "center", justifyContent: "center" }}><CheckCircleOutline /></Box>
                            <Typography sx={{ fontFamily: fontHead, fontWeight: 800, fontSize: "2rem", color: T.text }}>{presentCount}</Typography>
                        </Box>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Card className="fade-up" sx={{ p: 2.5, borderRadius: "14px", border: `1px solid ${T.border}`, boxShadow: "0 1px 4px rgba(0,0,0,0.02)", style: { animationDelay: '0.2s' } }}>
                        <SLabel>Days Absent</SLabel>
                        <Box display="flex" alignItems="center" gap={1.5} mt={1}>
                            <Box sx={{ width: 44, height: 44, borderRadius: "50%", bgcolor: T.dangerLight, color: T.danger, display: "flex", alignItems: "center", justifyContent: "center" }}><CancelOutlined /></Box>
                            <Typography sx={{ fontFamily: fontHead, fontWeight: 800, fontSize: "2rem", color: T.text }}>{absentCount}</Typography>
                        </Box>
                    </Card>
                </Grid>
            </Grid>

            <Card className="fade-up" sx={{ borderRadius: "14px", border: `1px solid ${T.border}`, p: 3, boxShadow: "0 1px 4px rgba(0,0,0,0.02)" }}>
                <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1.1rem", mb: 3 }}>Last 30 Days</Typography>
                <Grid container spacing={2}>
                    {mockAttendance.map((rec, i) => (
                        <Grid item xs={6} sm={4} md={3} lg={2} key={i}>
                            <Box sx={{ p: 1.5, borderRadius: "10px", border: `1px solid ${rec.status === 'Present' ? T.success + '40' : T.danger + '40'}`, bgcolor: rec.status === 'Present' ? T.successLight : T.dangerLight, textAlign: "center" }}>
                                <Typography sx={{ fontFamily: fontBody, fontSize: "0.75rem", color: T.textSub, mb: 0.5 }}>{rec.date}</Typography>
                                <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "0.85rem", color: rec.status === 'Present' ? T.success : T.danger }}>{rec.status}</Typography>
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            </Card>
        </Box>
    );
}
