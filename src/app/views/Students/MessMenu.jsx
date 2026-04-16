import React from "react";
import { Box, Card, Typography, Grid, Chip } from "@mui/material";
import { RestaurantMenu, AccessTime } from "@mui/icons-material";
import { T, fontHead, fontBody, fontMono, Fonts, mockMessMenu } from "./studentShared";

const SLabel = ({ children }) => <Typography sx={{ fontFamily: fontBody, fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: T.textMute, mb: 0.5 }}>{children}</Typography>;

export default function MessMenu() {
    const mealTimes = {
        Breakfast: "07:30 AM - 09:30 AM",
        Lunch: "12:30 PM - 02:30 PM",
        Snacks: "05:00 PM - 06:00 PM",
        Dinner: "07:30 PM - 09:30 PM"
    };

    return (
        <Box sx={{ p: 3, background: T.bg, minHeight: "100vh", fontFamily: fontBody }}>
            <style>{Fonts()}</style>

            <Box mb={4} className="fade-up">
                <Typography sx={{ fontFamily: fontBody, fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: T.textMute, mb: 0.3 }}>Mess & Food</Typography>
                <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1.5rem", color: T.text, lineHeight: 1.1 }}>Today's Menu</Typography>
                <Typography sx={{ fontFamily: fontBody, fontSize: "0.85rem", color: T.textSub, mt: 0.4 }}>View academic mess menu and timings.</Typography>
            </Box>

            <Grid container spacing={3}>
                {Object.keys(mockMessMenu).map((meal, index) => (
                    <Grid item xs={12} md={6} key={meal}>
                        <Card className="fade-up" sx={{ p: 3, borderRadius: "14px", border: `1px solid ${T.border}`, boxShadow: "0 2px 10px rgba(0,0,0,0.02)", animationDelay: `${index * 0.1}s` }}>
                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                <Box display="flex" alignItems="center" gap={1.5}>
                                    <Box sx={{ width: 40, height: 40, borderRadius: "10px", bgcolor: T.accentLight, color: T.accent, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        <RestaurantMenu />
                                    </Box>
                                    <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1.2rem" }}>{meal}</Typography>
                                </Box>
                                <Chip icon={<AccessTime sx={{ fontSize: "16px !important" }} />} label={mealTimes[meal]} size="small" sx={{ fontFamily: fontMono, fontWeight: 600, bgcolor: T.bg, color: T.textSub }} />
                            </Box>
                            <Box sx={{ p: 2, borderRadius: "10px", bgcolor: "#FAFAFA", border: `1px dashed ${T.border}` }}>
                                <Grid container spacing={1}>
                                    {mockMessMenu[meal].map((item, i) => (
                                        <Grid item xs={6} key={i}>
                                            <Typography sx={{ fontFamily: fontBody, fontSize: "0.85rem", color: T.text, fontWeight: 600 }}>• {item}</Typography>
                                        </Grid>
                                    ))}
                                </Grid>
                            </Box>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}
