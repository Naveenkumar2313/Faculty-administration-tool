import React from "react";
import { Box, Card, Typography, Grid, Button, IconButton } from "@mui/material";
import { DirectionsBus, MeetingRoom, Campaign, Event, ArrowForwardIos, ErrorOutline } from "@mui/icons-material";
import { T, fontHead, fontBody, fontMono, Fonts, currentStudent, mockAnnouncements } from "./studentShared";

const SLabel = ({ children }) => <Typography sx={{ fontFamily: fontBody, fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: T.textMute, mb: 0.5 }}>{children}</Typography>;

export default function StudentDashboard() {
    return (
        <Box sx={{ p: 3, background: T.bg, minHeight: "100vh", fontFamily: fontBody }}>
            <style>{Fonts()}</style>

            <Box display="flex" justifyContent="space-between" alignItems="flex-end" mb={4} className="fade-up">
                <Box>
                    <Typography sx={{ fontFamily: fontMono, fontSize: "0.9rem", color: T.accent, fontWeight: 700, mb: 0.5 }}>Good Afternoon,</Typography>
                    <Typography sx={{ fontFamily: fontHead, fontWeight: 800, fontSize: "2rem", color: T.text, lineHeight: 1.1 }}>{currentStudent.name}</Typography>
                    <Typography sx={{ fontFamily: fontBody, fontSize: "0.85rem", color: T.textSub, mt: 0.5 }}>{currentStudent.course} • {currentStudent.year} • {currentStudent.id}</Typography>
                </Box>
                <Box textAlign="right" display={{ xs: 'none', md: 'block' }}>
                    <SLabel>Current Status</SLabel>
                    <Box display="flex" gap={1.5}>
                        <Box sx={{ px: 1.5, py: 0.5, bgcolor: T.successLight, color: T.success, borderRadius: "6px", fontFamily: fontBody, fontSize: "0.8rem", fontWeight: 700 }}>Hostel Present</Box>
                        <Box sx={{ px: 1.5, py: 0.5, bgcolor: T.infoLight, color: T.info, borderRadius: "6px", fontFamily: fontBody, fontSize: "0.8rem", fontWeight: 700 }}>Passed Medical</Box>
                    </Box>
                </Box>
            </Box>

            <Grid container spacing={3}>
                {/* Noticeboard */}
                <Grid item xs={12} md={7}>
                    <Card className="fade-up" sx={{ p: 3, borderRadius: "14px", border: `1px solid ${T.border}`, boxShadow: "0 4px 20px rgba(0,0,0,0.02)", height: "100%" }}>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                            <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1.1rem" }}>Noticeboard</Typography>
                            <Button size="small" sx={{ fontFamily: fontBody, fontWeight: 700, textTransform: "none" }}>View All</Button>
                        </Box>
                        <Box display="flex" flexDirection="column" gap={2}>
                            {mockAnnouncements.map(ann => (
                                <Box key={ann.id} sx={{ p: 2, borderRadius: "10px", border: `1px solid ${T.border}`, bgcolor: T.surface, transition: "all 0.2s", "&:hover": { borderColor: T.accent, bgcolor: T.accentLight } }}>
                                    <Box display="flex" justifyContent="space-between" mb={0.5}>
                                        <Typography sx={{ fontFamily: fontMono, fontSize: "0.75rem", color: T.accent, fontWeight: 700 }}>{ann.type}</Typography>
                                        <Typography sx={{ fontFamily: fontMono, fontSize: "0.75rem", color: T.textMute }}>{ann.date}</Typography>
                                    </Box>
                                    <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "0.95rem", color: T.text, mb: 0.5 }}>{ann.title}</Typography>
                                    <Typography sx={{ fontFamily: fontBody, fontSize: "0.8rem", color: T.textSub }}>{ann.content}</Typography>
                                </Box>
                            ))}
                        </Box>
                    </Card>
                </Grid>

                {/* Quick Actions & Shortcuts */}
                <Grid item xs={12} md={5}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Card className="fade-up" sx={{ p: 3, borderRadius: "14px", border: `1px solid ${T.border}`, bgcolor: T.accent, color: "white", boxShadow: `0 8px 24px ${T.accent}40`, style: { animationDelay: '0.1s' } }}>
                                <Box display="flex" alignItems="center" justifyContent="space-between">
                                    <Box>
                                        <Typography sx={{ fontFamily: fontBody, fontSize: "0.85rem", opacity: 0.8, mb: 0.5 }}>Live Transport Tracking</Typography>
                                        <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1.2rem", mb: 0.5 }}>Route 4 Bus is Active</Typography>
                                        <Typography sx={{ fontFamily: fontBody, fontSize: "0.85rem", opacity: 0.9 }}>Expected at HSR in 12 mins.</Typography>
                                    </Box>
                                    <Box sx={{ width: 48, height: 48, borderRadius: "50%", bgcolor: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        <DirectionsBus sx={{ fontSize: 24, color: "white" }} />
                                    </Box>
                                </Box>
                                <Button fullWidth variant="contained" sx={{ mt: 2, bgcolor: "white", color: T.accent, fontFamily: fontBody, fontWeight: 700, boxShadow: "none", textTransform: "none", "&:hover": { bgcolor: "#F8FAFC" } }}>
                                    Track Live Location
                                </Button>
                            </Card>
                        </Grid>

                        <Grid item xs={6}>
                            <Card className="fade-up" sx={{ p: 2, borderRadius: "14px", border: `1px solid ${T.border}`, style: { animationDelay: '0.15s' }, cursor: "pointer", "&:hover": { boxShadow: "0 4px 12px rgba(0,0,0,0.05)" } }}>
                                <MeetingRoom sx={{ color: T.teal, mb: 1 }} />
                                <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "0.9rem" }}>Book Facility</Typography>
                                <Typography sx={{ fontFamily: fontBody, fontSize: "0.75rem", color: T.textSub }}>Rooms & Labs</Typography>
                            </Card>
                        </Grid>

                        <Grid item xs={6}>
                            <Card className="fade-up" sx={{ p: 2, borderRadius: "14px", border: `1px solid ${T.border}`, style: { animationDelay: '0.2s' }, cursor: "pointer", "&:hover": { boxShadow: "0 4px 12px rgba(0,0,0,0.05)" } }}>
                                <ErrorOutline sx={{ color: T.warning, mb: 1 }} />
                                <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "0.9rem" }}>Complaints</Typography>
                                <Typography sx={{ fontFamily: fontBody, fontSize: "0.75rem", color: T.textSub }}>Hostel & Maintenance</Typography>
                            </Card>
                        </Grid>

                        <Grid item xs={12}>
                            <Card className="fade-up" sx={{ p: 2, borderRadius: "14px", border: `1px solid ${T.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", style: { animationDelay: '0.25s' } }}>
                                <Box display="flex" alignItems="center" gap={2}>
                                    <Box sx={{ width: 40, height: 40, borderRadius: "10px", bgcolor: T.purpleLight, color: T.purple, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        <Event />
                                    </Box>
                                    <Box>
                                        <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "0.9rem" }}>Upcoming Events</Typography>
                                        <Typography sx={{ fontFamily: fontBody, fontSize: "0.75rem", color: T.textSub }}>2 Registered Validations</Typography>
                                    </Box>
                                </Box>
                                <IconButton size="small"><ArrowForwardIos sx={{ fontSize: 14 }} /></IconButton>
                            </Card>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Box>
    );
}
