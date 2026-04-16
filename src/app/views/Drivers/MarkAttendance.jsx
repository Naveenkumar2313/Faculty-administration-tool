import React, { useState } from "react";
import { Box, Card, Typography, Button, IconButton, Grid } from "@mui/material";
import { Fingerprint, CheckCircleOutline, Logout } from "@mui/icons-material";
import { T, fontHead, fontBody, fontMono, Fonts, currentUser } from "./driverShared";

export default function MarkAttendance() {
    const [isCheckedIn, setIsCheckedIn] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));

    // Simple time updater
    React.useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));
        }, 60000);
        return () => clearInterval(timer);
    }, []);

    return (
        <Box sx={{ p: 3, background: T.bg, minHeight: "100vh", fontFamily: fontBody }}>
            <style>{Fonts()}</style>

            <Box mb={3} className="fade-up">
                <Typography sx={{ fontFamily: fontBody, fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: T.textMute, mb: 0.3 }}>Attendance & Leave</Typography>
                <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1.5rem", color: T.text, lineHeight: 1.1 }}>Mark Attendance</Typography>
                <Typography sx={{ fontFamily: fontBody, fontSize: "0.82rem", color: T.textSub, mt: 0.4 }}>Check in / check out for duty shifts.</Typography>
            </Box>

            <Grid container spacing={3} justifyContent="center" mt={4}>
                <Grid item xs={12} sm={8} md={6}>
                    <Card className="fade-up" sx={{ p: 5, borderRadius: "16px", border: `1px solid ${T.border}`, boxShadow: "0 4px 24px rgba(0,0,0,0.04)", textAlign: "center" }}>

                        <Typography sx={{ fontFamily: fontMono, fontSize: "2.5rem", fontWeight: 800, color: T.text, mb: 1 }}>{currentTime}</Typography>
                        <Typography sx={{ fontFamily: fontBody, fontSize: "0.9rem", color: T.textSub, mb: 4 }}>
                            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </Typography>

                        <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
                            <Box
                                onClick={() => setIsCheckedIn(!isCheckedIn)}
                                sx={{
                                    width: 140, height: 140, borderRadius: "50%",
                                    bgcolor: isCheckedIn ? T.accentLight : T.surface,
                                    border: `4px solid ${isCheckedIn ? T.accent : T.border}`,
                                    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                                    cursor: "pointer", transition: "all 0.3s",
                                    boxShadow: isCheckedIn ? `0 0 0 8px ${T.accent}20` : "none",
                                    "&:hover": { transform: "scale(1.05)" }
                                }}
                            >
                                {isCheckedIn ? (
                                    <>
                                        <CheckCircleOutline sx={{ fontSize: 40, color: T.accent, mb: 1 }} />
                                        <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "0.9rem", color: T.accent }}>Checked In</Typography>
                                    </>
                                ) : (
                                    <>
                                        <Fingerprint sx={{ fontSize: 48, color: T.textMute, mb: 1 }} />
                                        <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "0.9rem", color: T.textMute }}>Tap to<br />Check In</Typography>
                                    </>
                                )}
                            </Box>
                        </Box>

                        <Box sx={{ bgcolor: T.bg, p: 2, borderRadius: "10px", textAlign: "left" }}>
                            <Typography sx={{ fontFamily: fontBody, fontSize: "0.75rem", fontWeight: 700, color: T.textSub, textTransform: "uppercase", mb: 1 }}>Shift Details</Typography>
                            <Box display="flex" justifyContent="space-between" mb={0.5}>
                                <Typography sx={{ fontFamily: fontBody, fontSize: "0.85rem", color: T.text }}>Assigned Shift:</Typography>
                                <Typography sx={{ fontFamily: fontMono, fontSize: "0.85rem", fontWeight: 600 }}>{currentUser.shift}</Typography>
                            </Box>
                            <Box display="flex" justifyContent="space-between">
                                <Typography sx={{ fontFamily: fontBody, fontSize: "0.85rem", color: T.text }}>Location:</Typography>
                                <Typography sx={{ fontFamily: fontBody, fontSize: "0.85rem", fontWeight: 600 }}>Main Transport Depot</Typography>
                            </Box>
                        </Box>

                        {isCheckedIn && (
                            <Button
                                variant="outlined"
                                color="error"
                                startIcon={<Logout />}
                                onClick={() => setIsCheckedIn(false)}
                                sx={{ mt: 3, fontFamily: fontBody, fontWeight: 700, textTransform: "none", borderRadius: "8px" }}
                            >
                                Check Out End Shift
                            </Button>
                        )}
                    </Card>
                </Grid>
            </Grid >
        </Box >
    );
}
