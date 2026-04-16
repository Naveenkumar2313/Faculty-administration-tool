import React from "react";
import { Box, Card, Typography, Grid, Avatar } from "@mui/material";
import { Bed, Phone, Email, LocationOn } from "@mui/icons-material";
import { T, fontHead, fontBody, fontMono, Fonts, currentStudent, mockRoommates } from "./studentShared";

const SLabel = ({ children }) => <Typography sx={{ fontFamily: fontBody, fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: T.textMute, mb: 0.5 }}>{children}</Typography>;

export default function MyRoomDetails() {
    return (
        <Box sx={{ p: 3, background: T.bg, minHeight: "100vh", fontFamily: fontBody }}>
            <style>{Fonts()}</style>

            <Box mb={4} className="fade-up">
                <Typography sx={{ fontFamily: fontBody, fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: T.textMute, mb: 0.3 }}>Hostel Dashboard</Typography>
                <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1.5rem", color: T.text, lineHeight: 1.1 }}>My Room Details</Typography>
                <Typography sx={{ fontFamily: fontBody, fontSize: "0.85rem", color: T.textSub, mt: 0.4 }}>View your assigned room and roommate information.</Typography>
            </Box>

            <Grid container spacing={3}>
                <Grid item xs={12} md={5}>
                    <Card className="fade-up" sx={{ p: 4, borderRadius: "16px", border: `1px solid ${T.border}`, boxShadow: "0 4px 24px rgba(0,0,0,0.02)", textAlign: "center" }}>
                        <Bed sx={{ fontSize: 48, color: T.accent, mb: 2 }} />
                        <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1.8rem", color: T.text }}>{currentStudent.room}</Typography>
                        <Box display="flex" justifyContent="center" gap={1} mt={1} mb={3}>
                            <Box sx={{ bgcolor: T.bg, px: 1.5, py: 0.5, borderRadius: "8px", border: `1px solid ${T.border}` }}>
                                <Typography sx={{ fontFamily: fontBody, fontSize: "0.75rem", fontWeight: 700 }}>{currentStudent.hostel}</Typography>
                            </Box>
                            <Box sx={{ bgcolor: T.bg, px: 1.5, py: 0.5, borderRadius: "8px", border: `1px solid ${T.border}` }}>
                                <Typography sx={{ fontFamily: fontBody, fontSize: "0.75rem", fontWeight: 700 }}>3-Sharing</Typography>
                            </Box>
                        </Box>

                        <Box textAlign="left" sx={{ mt: 4, pt: 3, borderTop: `1px dashed ${T.border}` }}>
                            <SLabel>Facilities Assigned</SLabel>
                            <Box display="flex" flexDirection="column" gap={1.5} mt={1.5}>
                                {["Study Table - T2", "Almirah - L2", "LAN Port Active", "Attached Washroom"].map(f => (
                                    <Typography key={f} sx={{ fontFamily: fontBody, fontSize: "0.85rem", fontWeight: 600, color: T.textSub }}>• {f}</Typography>
                                ))}
                            </Box>
                        </Box>
                    </Card>
                </Grid>

                <Grid item xs={12} md={7}>
                    <Card className="fade-up" sx={{ p: 3, borderRadius: "16px", border: `1px solid ${T.border}`, boxShadow: "0 4px 20px rgba(0,0,0,0.02)", style: { animationDelay: '0.1s' } }}>
                        <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1.1rem", mb: 3 }}>Roommates</Typography>

                        <Box display="flex" flexDirection="column" gap={2}>
                            {mockRoommates.map(rm => (
                                <Box key={rm.id} sx={{ p: 2, borderRadius: "12px", border: `1px solid ${rm.isMe ? T.accent : T.border}`, bgcolor: rm.isMe ? T.accentLight : T.surface, display: "flex", alignItems: "center", gap: 2 }}>
                                    <Avatar sx={{ width: 50, height: 50, bgcolor: rm.isMe ? T.accent : T.textMute, fontWeight: 700, fontFamily: fontHead }}>
                                        {rm.name.split(' ').map(n => n[0]).join('')}
                                    </Avatar>
                                    <Box flex={1}>
                                        <Box display="flex" justifyContent="space-between" alignItems="center">
                                            <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "0.95rem", color: T.text }}>
                                                {rm.name} {rm.isMe && <span style={{ color: T.accent, fontSize: "0.75rem", marginLeft: 4 }}>(You)</span>}
                                            </Typography>
                                            <Box sx={{ px: 1, py: 0.2, borderRadius: "4px", bgcolor: "#fff", border: `1px solid ${T.border}` }}>
                                                <Typography sx={{ fontFamily: fontMono, fontSize: "0.7rem", fontWeight: 700 }}>{rm.bed}</Typography>
                                            </Box>
                                        </Box>
                                        <Typography sx={{ fontFamily: fontMono, fontSize: "0.8rem", color: T.textSub, mt: 0.2 }}>{rm.id}</Typography>
                                        {!rm.isMe && (
                                            <Box display="flex" gap={2} mt={1}>
                                                <Box display="flex" alignItems="center" gap={0.5}>
                                                    <Phone sx={{ fontSize: 14, color: T.textMute }} />
                                                    <Typography sx={{ fontFamily: fontBody, fontSize: "0.8rem", color: T.textSub }}>{rm.phone}</Typography>
                                                </Box>
                                            </Box>
                                        )}
                                    </Box>
                                </Box>
                            ))}
                        </Box>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}
