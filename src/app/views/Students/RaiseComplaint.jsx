import React from "react";
import { Box, Card, Typography, TextField, Button, Grid, MenuItem } from "@mui/material";
import { CloudUpload } from "@mui/icons-material";
import { T, fontHead, fontBody, Fonts } from "./studentShared";

export default function RaiseComplaint() {
    return (
        <Box sx={{ p: 3, background: T.bg, minHeight: "100vh", fontFamily: fontBody, display: "flex", justifyContent: "center" }}>
            <style>{Fonts()}</style>

            <Box sx={{ maxWidth: 600, width: "100%" }}>
                <Box mb={4} className="fade-up" textAlign="center">
                    <Typography sx={{ fontFamily: fontBody, fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: T.textMute, mb: 0.3 }}>Complaints</Typography>
                    <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1.5rem", color: T.text, lineHeight: 1.1 }}>Raise a Complaint</Typography>
                    <Typography sx={{ fontFamily: fontBody, fontSize: "0.85rem", color: T.textSub, mt: 0.4 }}>Report room or common area maintenance issues.</Typography>
                </Box>

                <Card className="fade-up" sx={{ p: 4, borderRadius: "16px", border: `1px solid ${T.danger}50`, bgcolor: T.dangerLight, boxShadow: "0 4px 24px rgba(0,0,0,0.02)" }}>
                    <Grid container spacing={2.5}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                select fullWidth label="Category" defaultValue="Plumbing"
                                InputLabelProps={{ sx: { fontFamily: fontBody, fontSize: "0.85rem" } }}
                                InputProps={{ sx: { fontFamily: fontBody, fontSize: "0.85rem", borderRadius: "8px", bgcolor: "white" } }}
                            >
                                <MenuItem value="Electrical">Electrical</MenuItem>
                                <MenuItem value="Plumbing">Plumbing</MenuItem>
                                <MenuItem value="Carpentry">Carpentry / Furniture</MenuItem>
                                <MenuItem value="Cleaning">Cleaning / Hygiene</MenuItem>
                                <MenuItem value="Other">Other</MenuItem>
                            </TextField>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth label="Location / Room No." defaultValue="A-214"
                                InputLabelProps={{ sx: { fontFamily: fontBody, fontSize: "0.85rem" } }}
                                InputProps={{ sx: { fontFamily: fontBody, fontSize: "0.85rem", borderRadius: "8px", bgcolor: "white" } }}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth multiline rows={4} label="Detailed Description" placeholder="Describe the issue clearly..."
                                InputLabelProps={{ sx: { fontFamily: fontBody, fontSize: "0.85rem" } }}
                                InputProps={{ sx: { fontFamily: fontBody, fontSize: "0.85rem", borderRadius: "8px", bgcolor: "white" } }}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Button startIcon={<CloudUpload />} component="label" sx={{ fontFamily: fontBody, fontWeight: 600, textTransform: "none", color: T.danger }}>
                                Upload Photo Evidence
                                <input type="file" hidden multiple accept="image/*" />
                            </Button>
                        </Grid>

                        <Grid item xs={12} mt={1}>
                            <Button fullWidth variant="contained" color="error" sx={{ fontFamily: fontBody, fontWeight: 700, textTransform: "none", borderRadius: "8px", py: 1.5, boxShadow: "none" }}>
                                Submit Complaint
                            </Button>
                        </Grid>
                    </Grid>
                </Card>
            </Box>
        </Box>
    );
}
