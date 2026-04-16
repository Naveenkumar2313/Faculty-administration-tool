import React from "react";
import { Box, Card, Typography, Table, TableBody, TableCell, TableHead, TableRow, IconButton } from "@mui/material";
import { DeleteOutline } from "@mui/icons-material";
import { T, fontHead, fontBody, fontMono, Fonts, mockBookings, statusColors } from "./studentShared";

const StatusPill = ({ status }) => {
    const s = statusColors[status] || { bg: T.bg, color: T.textSub };
    return (
        <Box sx={{ px: 1.2, py: 0.4, borderRadius: "6px", bgcolor: s.bg, width: "fit-content", display: "inline-flex", alignItems: "center", gap: 0.5 }}>
            <Box sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: s.color }} />
            <Typography sx={{ fontFamily: fontBody, fontSize: "0.7rem", fontWeight: 700, color: s.color }}>{status}</Typography>
        </Box>
    );
};

export default function MyBookings() {
    return (
        <Box sx={{ p: 3, background: T.bg, minHeight: "100vh", fontFamily: fontBody }}>
            <style>{Fonts()}</style>

            <Box mb={4} className="fade-up">
                <Typography sx={{ fontFamily: fontBody, fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: T.textMute, mb: 0.3 }}>Facilities & Booking</Typography>
                <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1.5rem", color: T.text, lineHeight: 1.1 }}>My Bookings</Typography>
                <Typography sx={{ fontFamily: fontBody, fontSize: "0.85rem", color: T.textSub, mt: 0.4 }}>View or cancel your facility reservations.</Typography>
            </Box>

            <Card className="fade-up" sx={{ borderRadius: "14px", border: `1px solid ${T.border}`, boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                <Box sx={{ p: 2.5, borderBottom: `1px solid ${T.border}` }}>
                    <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1.1rem" }}>Booking History</Typography>
                </Box>
                <Box sx={{ overflowX: "auto" }}>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ bgcolor: T.bg }}>
                                {["Booking ID", "Facility", "Date", "Time Slot", "Status", "Action"].map(h => (
                                    <TableCell key={h} sx={{ fontFamily: fontBody, fontWeight: 700, fontSize: "0.72rem", color: T.textMute, textTransform: "uppercase", py: 1.5 }}>{h}</TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {mockBookings.map(row => (
                                <TableRow key={row.id} className="row-hover">
                                    <TableCell sx={{ fontFamily: fontMono, fontWeight: 600, fontSize: "0.8rem", color: T.text }}>{row.id}</TableCell>
                                    <TableCell sx={{ fontFamily: fontBody, fontSize: "0.85rem", color: T.text, fontWeight: 600 }}>{row.space}</TableCell>
                                    <TableCell sx={{ fontFamily: fontBody, fontSize: "0.82rem", color: T.textSub }}>{row.date}</TableCell>
                                    <TableCell sx={{ fontFamily: fontMono, fontSize: "0.82rem", color: T.textSub }}>{row.time}</TableCell>
                                    <TableCell><StatusPill status={row.status} /></TableCell>
                                    <TableCell>
                                        {row.status === 'Upcoming' && (
                                            <IconButton size="small" color="error"><DeleteOutline fontSize="small" /></IconButton>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Box>
            </Card>
        </Box>
    );
}
