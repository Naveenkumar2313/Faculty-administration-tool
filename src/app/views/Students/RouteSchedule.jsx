import React from "react";
import { Box, Card, Typography, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import { T, fontHead, fontBody, fontMono, Fonts } from "./studentShared";

const mockRoute = [
    { id: 1, name: "HSR Layout Sec 2", time: "06:30 AM" },
    { id: 2, name: "HSR BDA Complex", time: "06:45 AM" },
    { id: 3, name: "Agara Junction", time: "07:00 AM" },
    { id: 4, name: "Koramangala Block 3", time: "07:15 AM" },
    { id: 5, name: "Campus Main Gate", time: "07:45 AM" },
];

export default function RouteSchedule() {
    return (
        <Box sx={{ p: 3, background: T.bg, minHeight: "100vh", fontFamily: fontBody }}>
            <style>{Fonts()}</style>

            <Box mb={4} className="fade-up">
                <Typography sx={{ fontFamily: fontBody, fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: T.textMute, mb: 0.3 }}>Bus & Travel</Typography>
                <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1.5rem", color: T.text, lineHeight: 1.1 }}>Route & Schedule</Typography>
                <Typography sx={{ fontFamily: fontBody, fontSize: "0.85rem", color: T.textSub, mt: 0.4 }}>Route 4 - HSR Layout stops and timing.</Typography>
            </Box>

            <Card className="fade-up" sx={{ borderRadius: "14px", border: `1px solid ${T.border}`, boxShadow: "0 1px 4px rgba(0,0,0,0.04)", maxWidth: 600 }}>
                <Box sx={{ p: 2.5, borderBottom: `1px solid ${T.border}` }}>
                    <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1.1rem" }}>Pickup Schedule</Typography>
                </Box>
                <Box>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ bgcolor: T.bg }}>
                                {["Stop No.", "Location", "Scheduled Time"].map(h => (
                                    <TableCell key={h} sx={{ fontFamily: fontBody, fontWeight: 700, fontSize: "0.72rem", color: T.textMute, textTransform: "uppercase", py: 1.5 }}>{h}</TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {mockRoute.map((row, idx) => (
                                <TableRow key={row.id} className="row-hover">
                                    <TableCell sx={{ fontFamily: fontMono, fontWeight: 600, fontSize: "0.8rem", color: T.text }}>{idx + 1}</TableCell>
                                    <TableCell sx={{ fontFamily: fontBody, fontSize: "0.85rem", color: T.text, fontWeight: row.name === "Agara Junction" ? 700 : 400 }}>
                                        {row.name} {row.name === "Agara Junction" && <span style={{ color: T.accent, fontSize: "0.7rem", marginLeft: 4 }}>(Your Stop)</span>}
                                    </TableCell>
                                    <TableCell sx={{ fontFamily: fontMono, fontSize: "0.82rem", color: T.textSub }}>{row.time}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Box>
            </Card>
        </Box>
    );
}
