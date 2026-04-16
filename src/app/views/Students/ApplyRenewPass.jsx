import React from "react";
import { Box, Card, Typography, TextField, Button, Grid, MenuItem } from "@mui/material";
import { T, fontHead, fontBody, Fonts } from "./studentShared";

export default function ApplyRenewPass() {
    return (
        <Box sx={{ p: 3, background: T.bg, minHeight: "100vh", fontFamily: fontBody, display: "flex", justifyContent: "center" }}>
            <style>{Fonts()}</style>

            <Box sx={{ maxWidth: 600, width: "100%" }}>
                <Box mb={4} className="fade-up" textAlign="center">
                    <Typography sx={{ fontFamily: fontBody, fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: T.textMute, mb: 0.3 }}>Bus & Travel</Typography>
                    <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1.5rem", color: T.text, lineHeight: 1.1 }}>Apply / Renew Pass</Typography>
                    <Typography sx={{ fontFamily: fontBody, fontSize: "0.85rem", color: T.textSub, mt: 0.4 }}>Subscribe to a new route or renew your current pass.</Typography>
                </Box>

                <Card className="fade-up" sx={{ p: 4, borderRadius: "16px", border: `1px solid ${T.border}`, boxShadow: "0 4px 24px rgba(0,0,0,0.02)" }}>
                    <Grid container spacing={2.5}>
                        <Grid item xs={12}>
                            <TextField
                                select fullWidth label="Application Type" defaultValue="Renew"
                                InputLabelProps={{ sx: { fontFamily: fontBody, fontSize: "0.85rem" } }}
                                InputProps={{ sx: { fontFamily: fontBody, fontSize: "0.85rem", borderRadius: "8px" } }}
                            >
                                <MenuItem value="New">Apply for New Pass</MenuItem>
                                <MenuItem value="Renew">Renew Current Pass</MenuItem>
                                <MenuItem value="Change">Change Route / Stop</MenuItem>
                            </TextField>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                select fullWidth label="Select Route" defaultValue="Route 4"
                                InputLabelProps={{ sx: { fontFamily: fontBody, fontSize: "0.85rem" } }}
                                InputProps={{ sx: { fontFamily: fontBody, fontSize: "0.85rem", borderRadius: "8px" } }}
                            >
                                <MenuItem value="Route 1">Route 1 (Indiranagar)</MenuItem>
                                <MenuItem value="Route 2">Route 2 (Whitefield)</MenuItem>
                                <MenuItem value="Route 3">Route 3 (Malleswaram)</MenuItem>
                                <MenuItem value="Route 4">Route 4 (HSR Layout)</MenuItem>
                            </TextField>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                select fullWidth label="Boarding Stop" defaultValue="HSR Layout Sec 2"
                                InputLabelProps={{ sx: { fontFamily: fontBody, fontSize: "0.85rem" } }}
                                InputProps={{ sx: { fontFamily: fontBody, fontSize: "0.85rem", borderRadius: "8px" } }}
                            >
                                <MenuItem value="HSR Layout Sec 2">HSR Layout Sec 2</MenuItem>
                                <MenuItem value="HSR BDA Complex">HSR BDA Complex</MenuItem>
                                <MenuItem value="Agara Junction">Agara Junction</MenuItem>
                            </TextField>
                        </Grid>

                        <Grid item xs={12}>
                            <Box sx={{ p: 2, bgcolor: T.bg, borderRadius: "8px", border: `1px dashed ${T.border}` }}>
                                <Typography sx={{ fontFamily: fontBody, fontSize: "0.85rem" }}>
                                    <strong>Fee:</strong> ₹10,500 / Semester <br />
                                    <span style={{ color: T.textSub, fontSize: "0.75rem" }}>Includes taxes. Once approved, you can pay online via the payment portal.</span>
                                </Typography>
                            </Box>
                        </Grid>

                        <Grid item xs={12} mt={1}>
                            <Button fullWidth variant="contained" sx={{ bgcolor: T.info, fontFamily: fontBody, fontWeight: 700, textTransform: "none", borderRadius: "8px", py: 1.5, boxShadow: "none" }}>
                                Submit Application
                            </Button>
                        </Grid>
                    </Grid>
                </Card>
            </Box>
        </Box>
    );
}
