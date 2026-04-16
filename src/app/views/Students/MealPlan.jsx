import React from "react";
import { Box, Card, Typography, Grid, Button } from "@mui/material";
import { Stars, MonetizationOn } from "@mui/icons-material";
import { T, fontHead, fontBody, fontMono, Fonts, currentStudent } from "./studentShared";

const SLabel = ({ children }) => <Typography sx={{ fontFamily: fontBody, fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: T.textMute, mb: 0.5 }}>{children}</Typography>;

export default function MealPlan() {
    return (
        <Box sx={{ p: 3, background: T.bg, minHeight: "100vh", fontFamily: fontBody }}>
            <style>{Fonts()}</style>

            <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={4} className="fade-up">
                <Box>
                    <Typography sx={{ fontFamily: fontBody, fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: T.textMute, mb: 0.3 }}>Mess & Food</Typography>
                    <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1.5rem", color: T.text, lineHeight: 1.1 }}>Meal Plan Subscription</Typography>
                    <Typography sx={{ fontFamily: fontBody, fontSize: "0.85rem", color: T.textSub, mt: 0.4 }}>Manage your active mess plan and billing.</Typography>
                </Box>
            </Box>

            <Grid container spacing={3}>
                <Grid item xs={12} md={7}>
                    <Card className="fade-up" sx={{ p: 4, borderRadius: "16px", border: `2px solid ${T.accent}`, bgcolor: T.accentLight, boxShadow: `0 8px 32px ${T.accent}20` }}>
                        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3}>
                            <Box>
                                <SLabel>Current Plan</SLabel>
                                <Typography sx={{ fontFamily: fontHead, fontWeight: 800, fontSize: "1.8rem", color: T.accent }}>{currentStudent.messPlan}</Typography>
                                <Box sx={{ display: "inline-block", mt: 1, px: 1.5, py: 0.5, bgcolor: T.success, color: "white", borderRadius: "20px", fontFamily: fontMono, fontSize: "0.7rem", fontWeight: 700 }}>
                                    ACTIVE UNTIL MAY 2026
                                </Box>
                            </Box>
                            <Stars sx={{ fontSize: 48, color: T.accent, opacity: 0.2 }} />
                        </Box>

                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <Box sx={{ p: 2, bgcolor: "white", borderRadius: "10px", border: `1px solid ${T.accent}40` }}>
                                    <SLabel>Meals Included</SLabel>
                                    <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1.1rem" }}>4 Meals / Day</Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={6}>
                                <Box sx={{ p: 2, bgcolor: "white", borderRadius: "10px", border: `1px solid ${T.accent}40` }}>
                                    <SLabel>Price</SLabel>
                                    <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1.1rem" }}>₹45,000 / Sem</Typography>
                                </Box>
                            </Grid>
                        </Grid>
                    </Card>
                </Grid>

                <Grid item xs={12} md={5}>
                    <Card className="fade-up" sx={{ p: 3, borderRadius: "14px", border: `1px solid ${T.border}`, boxShadow: "0 1px 4px rgba(0,0,0,0.02)", height: "100%", style: { animationDelay: '0.1s' } }}>
                        <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1.1rem", mb: 2 }}>Available Upgrades</Typography>
                        <Box sx={{ p: 2, mb: 2, borderRadius: "10px", border: `1px solid ${T.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <Box>
                                <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "0.95rem" }}>Premium Continental</Typography>
                                <Typography sx={{ fontFamily: fontBody, fontSize: "0.75rem", color: T.textSub }}>Includes special diet options</Typography>
                            </Box>
                            <Button size="small" sx={{ fontFamily: fontBody, fontWeight: 700, textTransform: "none" }}>Upgrade</Button>
                        </Box>

                        <Box sx={{ mt: 4, pt: 3, borderTop: `1px solid ${T.border}` }}>
                            <Button fullWidth variant="outlined" startIcon={<MonetizationOn />} sx={{ borderRadius: "8px", fontFamily: fontBody, fontWeight: 700, textTransform: "none", color: T.text, borderColor: T.border }}>Pay Mess Dues</Button>
                        </Box>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}
