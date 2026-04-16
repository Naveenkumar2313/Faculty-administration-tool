import React from "react";
import { Box, Card, Typography, Grid, Button } from "@mui/material";
import { LocalParking, QrCode2 } from "@mui/icons-material";
import { T, fontHead, fontBody, fontMono, Fonts, currentStudent } from "./studentShared";

const SLabel = ({ children }) => <Typography sx={{ fontFamily: fontBody, fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: T.textMute, mb: 0.5 }}>{children}</Typography>;

export default function MyParkingPass() {
    return (
        <Box sx={{ p: 3, background: T.bg, minHeight: "100vh", fontFamily: fontBody, display: "flex", justifyContent: "center" }}>
            <style>{Fonts()}</style>

            <Box sx={{ maxWidth: 800, width: "100%" }}>
                <Box mb={4} className="fade-up" textAlign="center">
                    <Typography sx={{ fontFamily: fontBody, fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: T.textMute, mb: 0.3 }}>Parking</Typography>
                    <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1.5rem", color: T.text, lineHeight: 1.1 }}>My Parking Pass</Typography>
                    <Typography sx={{ fontFamily: fontBody, fontSize: "0.85rem", color: T.textSub, mt: 0.4 }}>View your vehicle parking authorization.</Typography>
                </Box>

                <Card className="fade-up" sx={{ borderRadius: "16px", border: `1px solid ${T.purple}40`, overflow: "hidden", boxShadow: `0 8px 32px ${T.purple}20` }}>
                    <Box sx={{ bgcolor: T.purple, p: 3, color: "white", display: "flex", alignItems: "center", gap: 2 }}>
                        <Box sx={{ p: 1.5, bgcolor: "rgba(255,255,255,0.2)", borderRadius: "12px" }}>
                            <LocalParking sx={{ fontSize: 32 }} />
                        </Box>
                        <Box>
                            <Typography sx={{ fontFamily: fontHead, fontWeight: 800, fontSize: "1.4rem" }}>Student Parking Pass</Typography>
                            <Typography sx={{ fontFamily: fontMono, fontSize: "0.85rem", opacity: 0.9 }}>Two Wheeler</Typography>
                        </Box>
                    </Box>

                    <Grid container>
                        <Grid item xs={12} sm={8}>
                            <Box sx={{ p: 4 }}>
                                <Grid container spacing={3}>
                                    <Grid item xs={12}>
                                        <SLabel>Student Name</SLabel>
                                        <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1.2rem", color: T.text }}>{currentStudent.name}</Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <SLabel>Vehicle Number</SLabel>
                                        <Typography sx={{ fontFamily: fontMono, fontWeight: 600, fontSize: "1rem", color: T.text }}>KA-01-AB-1234</Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <SLabel>Vehicle Make</SLabel>
                                        <Typography sx={{ fontFamily: fontBody, fontWeight: 700, fontSize: "0.95rem", color: T.text }}>Honda Activa</Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <SLabel>Designated Area</SLabel>
                                        <Typography sx={{ fontFamily: fontBody, fontWeight: 600, fontSize: "0.9rem", color: T.textSub }}>North Parking (Lot-B)</Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <SLabel>Validity</SLabel>
                                        <Typography sx={{ fontFamily: fontBody, fontWeight: 700, fontSize: "0.9rem", color: T.success }}>Valid till May 2026</Typography>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Box sx={{ bgcolor: T.bg, height: "100%", p: 4, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", borderLeft: `1px dashed ${T.border}` }}>
                                <QrCode2 sx={{ fontSize: 120, color: T.text }} />
                                <Typography sx={{ fontFamily: fontBody, fontSize: "0.75rem", color: T.textSub, mt: 1, textAlign: "center" }}>Scan at boom barrier</Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </Card>

                <Box mt={3} className="fade-up" style={{ animationDelay: '0.1s' }} display="flex" justifyContent="center">
                    <Button variant="outlined" sx={{ fontFamily: fontBody, fontWeight: 700, textTransform: "none", borderRadius: "8px", color: T.text }}>
                        Apply for Renewal
                    </Button>
                </Box>
            </Box>
        </Box>
    );
}
