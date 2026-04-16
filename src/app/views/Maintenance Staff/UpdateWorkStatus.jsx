import React from "react";
import { Box, Card, Typography, TextField, Button, Grid, MenuItem } from "@mui/material";
import { UploadFile } from "@mui/icons-material";
import { T, fontHead, fontBody, fontMono, Fonts, mockWorkOrders } from "./maintenanceShared";

export default function UpdateWorkStatus() {
    return (
        <Box sx={{ p: 3, background: T.bg, minHeight: "100vh", fontFamily: fontBody, display: "flex", justifyContent: "center" }}>
            <style>{Fonts()}</style>

            <Box sx={{ maxWidth: 650, width: "100%" }}>
                <Box mb={4} className="fade-up" textAlign="center">
                    <Typography sx={{ fontFamily: fontBody, fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: T.textMute, mb: 0.3 }}>Work Orders</Typography>
                    <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1.5rem", color: T.text, lineHeight: 1.1 }}>Update Work Status</Typography>
                    <Typography sx={{ fontFamily: fontBody, fontSize: "0.85rem", color: T.textSub, mt: 0.4 }}>Update the progress of an assigned job and attach completion photos.</Typography>
                </Box>

                <Card className="fade-up" sx={{ p: 4, borderRadius: "16px", border: `1px solid ${T.border}`, boxShadow: "0 4px 24px rgba(0,0,0,0.02)" }}>
                    <Grid container spacing={2.5}>
                        <Grid item xs={12}>
                            <TextField
                                select fullWidth label="Select Work Order" defaultValue={mockWorkOrders[0].id}
                                InputLabelProps={{ sx: { fontFamily: fontBody, fontSize: "0.85rem" } }}
                                InputProps={{ sx: { fontFamily: fontMono, fontSize: "0.85rem", borderRadius: "8px" } }}
                            >
                                {mockWorkOrders.filter(w => w.status !== "Completed").map(wo => (
                                    <MenuItem key={wo.id} value={wo.id} sx={{ fontFamily: fontMono, fontSize: "0.85rem" }}>
                                        {wo.id} - <span style={{ fontFamily: fontBody, marginLeft: 8 }}>{wo.issue}</span>
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                select fullWidth label="Update Status" defaultValue="In Progress"
                                InputLabelProps={{ sx: { fontFamily: fontBody, fontSize: "0.85rem" } }}
                                InputProps={{ sx: { fontFamily: fontBody, fontSize: "0.85rem", borderRadius: "8px" } }}
                            >
                                <MenuItem value="Pending">Pending / On Hold</MenuItem>
                                <MenuItem value="In Progress">In Progress</MenuItem>
                                <MenuItem value="Completed">Completed - Ready for Review</MenuItem>
                            </TextField>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                type="number" fullWidth label="Hours Logged" defaultValue="1"
                                InputLabelProps={{ sx: { fontFamily: fontBody, fontSize: "0.85rem" } }}
                                InputProps={{ sx: { fontFamily: fontBody, fontSize: "0.85rem", borderRadius: "8px" } }}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                multiline rows={3} fullWidth label="Maintenance Notes & Action Taken" placeholder="Briefly describe what was repaired or replaced..."
                                InputLabelProps={{ sx: { fontFamily: fontBody, fontSize: "0.85rem" } }}
                                InputProps={{ sx: { fontFamily: fontBody, fontSize: "0.85rem", borderRadius: "8px" } }}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Box sx={{ p: 3, border: `1px dashed ${T.border}`, borderRadius: "8px", textAlign: "center", bgcolor: "#FAFAFA", cursor: "pointer" }}>
                                <UploadFile sx={{ color: T.textMute, fontSize: 32, mb: 1 }} />
                                <Typography sx={{ fontFamily: fontBody, fontSize: "0.85rem", color: T.text }}>Upload Completion Photo (Optional)</Typography>
                                <Typography sx={{ fontFamily: fontBody, fontSize: "0.75rem", color: T.textMute, mt: 0.5 }}>JPG or PNG (max 5MB)</Typography>
                            </Box>
                        </Grid>

                        <Grid item xs={12} mt={1}>
                            <Button fullWidth variant="contained" sx={{ bgcolor: T.primary, fontFamily: fontBody, fontWeight: 700, textTransform: "none", borderRadius: "8px", py: 1.5, boxShadow: "none" }}>
                                Save Status Update
                            </Button>
                        </Grid>
                    </Grid>
                </Card>
            </Box>
        </Box>
    );
}
