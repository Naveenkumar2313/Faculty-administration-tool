import React from "react";
import { Box, Card, Typography, TextField, Button, Grid, MenuItem } from "@mui/material";
import { Inventory } from "@mui/icons-material";
import { T, fontHead, fontBody, fontMono, Fonts, mockWorkOrders } from "./maintenanceShared";

export default function RequestMaterials() {
    return (
        <Box sx={{ p: 3, background: T.bg, minHeight: "100vh", fontFamily: fontBody, display: "flex", justifyContent: "center" }}>
            <style>{Fonts()}</style>

            <Box sx={{ maxWidth: 650, width: "100%" }}>
                <Box mb={4} className="fade-up" textAlign="center">
                    <Typography sx={{ fontFamily: fontBody, fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: T.textMute, mb: 0.3 }}>Inventory Access</Typography>
                    <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1.5rem", color: T.text, lineHeight: 1.1 }}>Request Materials</Typography>
                    <Typography sx={{ fontFamily: fontBody, fontSize: "0.85rem", color: T.textSub, mt: 0.4 }}>Indent spare parts or tools from the central maintenance store.</Typography>
                </Box>

                <Card className="fade-up" sx={{ p: 4, borderRadius: "16px", border: `1px solid ${T.border}`, boxShadow: "0 4px 24px rgba(0,0,0,0.02)" }}>
                    <Grid container spacing={2.5}>
                        <Grid item xs={12}>
                            <TextField
                                select fullWidth label="Linked Work Order" defaultValue={mockWorkOrders[0].id}
                                InputLabelProps={{ sx: { fontFamily: fontBody, fontSize: "0.85rem" } }}
                                InputProps={{ sx: { fontFamily: fontMono, fontSize: "0.85rem", borderRadius: "8px" } }}
                            >
                                <MenuItem value="None">Independent Request (No WO)</MenuItem>
                                {mockWorkOrders.filter(w => w.status !== "Completed").map(wo => (
                                    <MenuItem key={wo.id} value={wo.id} sx={{ fontFamily: fontMono, fontSize: "0.85rem" }}>
                                        {wo.id} - <span style={{ fontFamily: fontBody, marginLeft: 8 }}>{wo.issue}</span>
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                multiline rows={4} fullWidth label="Requested Items & Quantities" placeholder="e.g. 2x 15A Sockets, 1x Insulation Tape, 5m Wiring Cable"
                                InputLabelProps={{ sx: { fontFamily: fontBody, fontSize: "0.85rem" } }}
                                InputProps={{ sx: { fontFamily: fontBody, fontSize: "0.85rem", borderRadius: "8px" } }}
                            />
                        </Grid>

                        <Grid item xs={12} mt={1}>
                            <Button fullWidth variant="contained" startIcon={<Inventory />} sx={{ bgcolor: T.primary, fontFamily: fontBody, fontWeight: 700, textTransform: "none", borderRadius: "8px", py: 1.5, boxShadow: "none" }}>
                                Submit Material Indent
                            </Button>
                        </Grid>
                    </Grid>
                </Card>
            </Box>
        </Box>
    );
}
