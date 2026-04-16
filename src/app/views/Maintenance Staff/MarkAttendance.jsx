import React, { useState, useEffect } from "react";
import { Box, Card, Typography, Grid, Button } from "@mui/material";
import { Fingerprint, AccessTime, CheckCircle } from "@mui/icons-material";
import { T, fontHead, fontBody, fontMono, Fonts } from "./maintenanceShared";

export default function MarkAttendance() {
    const [time, setTime] = useState("");
    const [status, setStatus] = useState("Not Checked-In");

    useEffect(() => {
        const update = () => {
            const now = new Date();
            setTime(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
        };
        update();
        const int = setInterval(update, 1000);
        return () => clearInterval(int);
    }, []);

    return (
        <Box sx={{ p: 3, background: T.bg, minHeight: "100vh", fontFamily: fontBody, display: "flex", justifyContent: "center" }}>
            <style>{Fonts()}</style>

            <Box sx={{ maxWidth: 500, width: "100%" }}>
                <Box mb={4} className="fade-up" textAlign="center">
                    <Typography sx={{ fontFamily: fontBody, fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: T.textMute, mb: 0.3 }}>Attendance & Leave</Typography>
                    <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1.5rem", color: T.text, lineHeight: 1.1 }}>Daily Check-In</Typography>
                    <Typography sx={{ fontFamily: fontBody, fontSize: "0.85rem", color: T.textSub, mt: 0.4 }}>Record your daily campus entry and exit.</Typography>
                </Box>

                <Card className="fade-up" sx={{ p: 4, borderRadius: "16px", border: `1px solid ${T.border}`, boxShadow: "0 4px 24px rgba(0,0,0,0.02)", textAlign: "center" }}>
                    <Box sx={{ mb: 4 }}>
                        <AccessTime sx={{ color: T.textMute, fontSize: 32, mb: 1 }} />
                        <Typography sx={{ fontFamily: fontMono, fontSize: "2rem", fontWeight: 700, color: T.text, lineHeight: 1 }}>{time}</Typography>
                        <Typography sx={{ fontFamily: fontBody, fontSize: "0.85rem", color: T.textSub, mt: 0.5 }}>
                            Status: <span style={{ color: status === "Checked-In" ? T.success : T.textSub, fontWeight: 700 }}>{status}</span>
                        </Typography>
                    </Box>

                    {status === "Not Checked-In" ? (
                        <Button
                            fullWidth variant="contained"
                            startIcon={<Fingerprint />}
                            onClick={() => setStatus("Checked-In")}
                            sx={{ bgcolor: T.primary, color: "white", fontFamily: fontBody, fontWeight: 700, py: 1.5, borderRadius: "8px", boxShadow: "none", textTransform: "none", fontSize: "1rem" }}
                        >
                            Log Entry (Check-In)
                        </Button>
                    ) : (
                        <Button
                            fullWidth variant="outlined"
                            startIcon={<CheckCircle />}
                            onClick={() => setStatus("Not Checked-In")}
                            sx={{ color: T.error, borderColor: `${T.error}50`, fontFamily: fontBody, fontWeight: 700, py: 1.5, borderRadius: "8px", textTransform: "none", fontSize: "1rem", '&:hover': { borderColor: T.error, bgcolor: "#fef2f2" } }}
                        >
                            End Shift (Check-Out)
                        </Button>
                    )}
                </Card>
            </Box>
        </Box>
    );
}
