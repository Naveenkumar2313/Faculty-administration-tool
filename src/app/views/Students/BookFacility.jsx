import React, { useState } from "react";
import { Box, Card, Typography, TextField, Button, Grid, MenuItem } from "@mui/material";
import { InsertInvitation } from "@mui/icons-material";
import { T, fontHead, fontBody, Fonts } from "./studentShared";

export default function BookFacility() {
    return (
        <Box sx={{ p: 3, background: T.bg, minHeight: "100vh", fontFamily: fontBody, display: "flex", justifyContent: "center" }}>
            <style>{Fonts()}</style>

            <Box sx={{ maxWidth: 600, width: "100%" }}>
                <Box mb={4} className="fade-up" textAlign="center">
                    <Typography sx={{ fontFamily: fontBody, fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: T.textMute, mb: 0.3 }}>Facilities & Booking</Typography>
                    <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1.5rem", color: T.text, lineHeight: 1.1 }}>Book a Room / Lab</Typography>
                    <Typography sx={{ fontFamily: fontBody, fontSize: "0.85rem", color: T.textSub, mt: 0.4 }}>Check availability and reserve study spaces.</Typography>
                </Box>

                <Card className="fade-up" sx={{ p: 4, borderRadius: "16px", border: `1px solid ${T.accent}50`, boxShadow: "0 4px 24px rgba(0,0,0,0.02)" }}>
                    <Grid container spacing={2.5}>
                        <Grid item xs={12}>
                            <TextField
                                select fullWidth label="Facility Type" defaultValue="Study Room"
                                InputLabelProps={{ sx: { fontFamily: fontBody, fontSize: "0.85rem" } }}
                                InputProps={{ sx: { fontFamily: fontBody, fontSize: "0.85rem", borderRadius: "8px" } }}
                            >
                                <MenuItem value="Study Room">Study Room</MenuItem>
                                <MenuItem value="Computer Lab">Computer Lab</MenuItem>
                                <MenuItem value="Tennis Court">Tennis Court</MenuItem>
                                <MenuItem value="Meeting Room">Meeting Room</MenuItem>
                            </TextField>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                type="date" fullWidth label="Date" InputLabelProps={{ shrink: true, sx: { fontFamily: fontBody, fontSize: "0.85rem" } }}
                                InputProps={{ sx: { fontFamily: fontBody, fontSize: "0.85rem", borderRadius: "8px" } }}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                select fullWidth label="Time Slot" defaultValue="18:00"
                                InputLabelProps={{ sx: { fontFamily: fontBody, fontSize: "0.85rem" } }}
                                InputProps={{ sx: { fontFamily: fontBody, fontSize: "0.85rem", borderRadius: "8px" } }}
                            >
                                <MenuItem value="16:00">04:00 PM - 06:00 PM</MenuItem>
                                <MenuItem value="18:00">06:00 PM - 08:00 PM</MenuItem>
                                <MenuItem value="20:00">08:00 PM - 10:00 PM</MenuItem>
                            </TextField>
                        </Grid>

                        <Grid item xs={12} mt={1}>
                            <Button fullWidth variant="contained" startIcon={<InsertInvitation />} sx={{ bgcolor: T.accent, fontFamily: fontBody, fontWeight: 700, textTransform: "none", borderRadius: "8px", py: 1.5, boxShadow: "none" }}>
                                Confirm Booking
                            </Button>
                        </Grid>
                    </Grid>
                </Card>
            </Box>
        </Box>
    );
}
