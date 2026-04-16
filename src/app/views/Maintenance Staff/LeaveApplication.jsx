import React from "react";
import { Box, Card, Typography, TextField, Button, Grid, MenuItem } from "@mui/material";
import { DateRange } from "@mui/icons-material";
import { T, fontHead, fontBody, Fonts } from "./maintenanceShared";

export default function LeaveApplication() {
    return (
        <Box sx={{ p: 3, background: T.bg, minHeight: "100vh", fontFamily: fontBody, display: "flex", justifyContent: "center" }}>
            <style>{Fonts()}</style>

            <Box sx={{ maxWidth: 650, width: "100%" }}>
                <Box mb={4} className="fade-up" textAlign="center">
                    <Typography sx={{ fontFamily: fontBody, fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: T.textMute, mb: 0.3 }}>Attendance & Leave</Typography>
                    <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1.5rem", color: T.text, lineHeight: 1.1 }}>Leave Application</Typography>
                    <Typography sx={{ fontFamily: fontBody, fontSize: "0.85rem", color: T.textSub, mt: 0.4 }}>Apply for sick leave, casual leave, or earned leave.</Typography>
                </Box>

                <Card className="fade-up" sx={{ p: 4, borderRadius: "16px", border: `1px solid ${T.border}`, boxShadow: "0 4px 24px rgba(0,0,0,0.02)" }}>
                    <Grid container spacing={2.5}>
                        <Grid item xs={12}>
                            <TextField
                                select fullWidth label="Leave Type" defaultValue="Casual"
                                InputLabelProps={{ sx: { fontFamily: fontBody, fontSize: "0.85rem" } }}
                                InputProps={{ sx: { fontFamily: fontBody, fontSize: "0.85rem", borderRadius: "8px" } }}
                            >
                                <MenuItem value="Casual">Casual Leave</MenuItem>
                                <MenuItem value="Sick">Sick Leave</MenuItem>
                                <MenuItem value="Earned">Earned Leave</MenuItem>
                            </TextField>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                type="date" fullWidth label="From Date" InputLabelProps={{ shrink: true, sx: { fontFamily: fontBody, fontSize: "0.85rem" } }}
                                InputProps={{ sx: { fontFamily: fontMono, fontSize: "0.85rem", borderRadius: "8px" } }}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                type="date" fullWidth label="To Date" InputLabelProps={{ shrink: true, sx: { fontFamily: fontBody, fontSize: "0.85rem" } }}
                                InputProps={{ sx: { fontFamily: fontMono, fontSize: "0.85rem", borderRadius: "8px" } }}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                multiline rows={3} fullWidth label="Reason for Leave" placeholder="Provide a short description..."
                                InputLabelProps={{ sx: { fontFamily: fontBody, fontSize: "0.85rem" } }}
                                InputProps={{ sx: { fontFamily: fontBody, fontSize: "0.85rem", borderRadius: "8px" } }}
                            />
                        </Grid>

                        <Grid item xs={12} mt={1}>
                            <Button fullWidth variant="contained" startIcon={<DateRange />} sx={{ bgcolor: T.primary, fontFamily: fontBody, fontWeight: 700, textTransform: "none", borderRadius: "8px", py: 1.5, boxShadow: "none" }}>
                                Submit Application
                            </Button>
                        </Grid>
                    </Grid>
                </Card>
            </Box>
        </Box>
    );
}
