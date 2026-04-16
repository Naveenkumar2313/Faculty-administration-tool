import React from "react";
import { Box, Card, Typography, Grid } from "@mui/material";
import { T, fontHead, fontBody, fontMono, Fonts, mockAnnouncements } from "./studentShared";

export default function Announcements() {
    return (
        <Box sx={{ p: 3, background: T.bg, minHeight: "100vh", fontFamily: fontBody }}>
            <style>{Fonts()}</style>

            <Box mb={4} className="fade-up">
                <Typography sx={{ fontFamily: fontBody, fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: T.textMute, mb: 0.3 }}>Noticeboard</Typography>
                <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1.5rem", color: T.text, lineHeight: 1.1 }}>Announcements</Typography>
                <Typography sx={{ fontFamily: fontBody, fontSize: "0.85rem", color: T.textSub, mt: 0.4 }}>Latest campus and hostel notifications.</Typography>
            </Box>

            <Grid container spacing={2}>
                {mockAnnouncements.map((ann, i) => (
                    <Grid item xs={12} md={6} lg={4} key={ann.id}>
                        <Card className="fade-up" sx={{ p: 3, borderRadius: "14px", border: `1px solid ${T.border}`, boxShadow: "0 2px 10px rgba(0,0,0,0.02)", height: "100%", animationDelay: `${i * 0.1}s` }}>
                            <Box display="flex" justifyContent="space-between" mb={1.5}>
                                <Box sx={{ px: 1, py: 0.3, borderRadius: "4px", bgcolor: T.accentLight, color: T.accent, fontFamily: fontMono, fontSize: "0.7rem", fontWeight: 700 }}>
                                    {ann.type}
                                </Box>
                                <Typography sx={{ fontFamily: fontMono, fontSize: "0.75rem", color: T.textMute }}>{ann.date}</Typography>
                            </Box>
                            <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1.1rem", color: T.text, mb: 1 }}>{ann.title}</Typography>
                            <Typography sx={{ fontFamily: fontBody, fontSize: "0.85rem", color: T.textSub }}>{ann.content}</Typography>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}
