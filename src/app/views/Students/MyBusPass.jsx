import React from "react";
import { Box, Card, Typography, Grid, Button } from "@mui/material";
import { DirectionsBus, QrCode2 } from "@mui/icons-material";
import { T, fontHead, fontBody, fontMono, Fonts, currentStudent } from "./studentShared";

const SLabel = ({ children }) => <Typography sx={{ fontFamily: fontBody, fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: T.textMute, mb: 0.5 }}>{children}</Typography>;

export default function MyBusPass() {
    return (
        <Box sx={{ p: 3, background: T.bg, minHeight: "100vh", fontFamily: fontBody, display: "flex", justifyContent: "center" }}>
            <style>{Fonts()}</style>

            <Box sx={{ maxWidth: 800, width: "100%" }}>
                <Box mb={4} className="fade-up" textAlign="center">
                    <Typography sx={{ fontFamily: fontBody, fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: T.textMute, mb: 0.3 }}>Bus & Travel</Typography>
                    <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1.5rem", color: T.text, lineHeight: 1.1 }}>My Bus Pass</Typography>
                    <Typography sx={{ fontFamily: fontBody, fontSize: "0.85rem", color: T.textSub, mt: 0.4 }}>View and scan your digital bus pass.</Typography>
                </Box>

                <Card className="fade-up" sx={{ borderRadius: "16px", border: `1px solid ${T.info}40`, overflow: "hidden", boxShadow: `0 8px 32px ${T.info}20` }}>
                    <Box sx={{ bgcolor: T.info, p: 3, color: "white", display: "flex", alignItems: "center", gap: 2 }}>
                        <Box sx={{ p: 1.5, bgcolor: "rgba(255,255,255,0.2)", borderRadius: "12px" }}>
                            <DirectionsBus sx={{ fontSize: 32 }} />
                        </Box>
                        <Box>
                            <Typography sx={{ fontFamily: fontHead, fontWeight: 800, fontSize: "1.4rem" }}>Student Bus Pass</Typography>
                            <Typography sx={{ fontFamily: fontMono, fontSize: "0.85rem", opacity: 0.9 }}>{currentStudent.busPass}</Typography>
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
                                        <SLabel>Student ID</SLabel>
                                        <Typography sx={{ fontFamily: fontMono, fontWeight: 600, fontSize: "0.95rem", color: T.text }}>{currentStudent.id}</Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <SLabel>Assigned Route</SLabel>
                                        <Typography sx={{ fontFamily: fontBody, fontWeight: 700, fontSize: "0.95rem", color: T.text }}>Route 4</Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <SLabel>Pickup Point</SLabel>
                                        <Typography sx={{ fontFamily: fontBody, fontWeight: 600, fontSize: "0.9rem", color: T.textSub }}>HSR Layout Sec 2</Typography>
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
                                <Typography sx={{ fontFamily: fontBody, fontSize: "0.75rem", color: T.textSub, mt: 1, textAlign: "center" }}>Scan when boarding the bus</Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </Card>

                <Box mt={3} className="fade-up" style={{ animationDelay: '0.1s' }} display="flex" justifyContent="center">
                    <Button variant="outlined" sx={{ fontFamily: fontBody, fontWeight: 700, textTransform: "none", borderRadius: "8px", color: T.text }}>
                        Download PDF Pass
                    </Button>
                </Box>
            </Box>
        </Box>
    );
}
