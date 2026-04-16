import React, { useState } from "react";
import { Box, Card, Typography, Table, TableBody, TableCell, TableHead, TableRow, TextField, InputAdornment } from "@mui/material";
import { Search } from "@mui/icons-material";
import { T, fontHead, fontBody, fontMono, Fonts, tripHistory, statusColors } from "./driverShared";

const StatusPill = ({ status }) => {
    const s = statusColors[status] || { bg: T.bg, color: T.textSub };
    return (
        <Box sx={{ px: 1.2, py: 0.4, borderRadius: "6px", bgcolor: s.bg, width: "fit-content", display: "inline-flex", alignItems: "center", gap: 0.5 }}>
            <Box sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: s.color }} />
            <Typography sx={{ fontFamily: fontBody, fontSize: "0.7rem", fontWeight: 700, color: s.color }}>{status}</Typography>
        </Box>
    );
};

export default function TripHistory() {
    const [searchTerm, setSearchTerm] = useState("");

    const filtered = tripHistory.filter(t => t.id.toLowerCase().includes(searchTerm.toLowerCase()) || t.date.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <Box sx={{ p: 3, background: T.bg, minHeight: "100vh", fontFamily: fontBody }}>
            <style>{Fonts()}</style>

            <Box mb={3} className="fade-up">
                <Typography sx={{ fontFamily: fontBody, fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: T.textMute, mb: 0.3 }}>My Routes & Schedule</Typography>
                <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1.5rem", color: T.text, lineHeight: 1.1 }}>Trip History</Typography>
                <Typography sx={{ fontFamily: fontBody, fontSize: "0.82rem", color: T.textSub, mt: 0.4 }}>Log of all past trips with timings and attendance.</Typography>
            </Box>

            <Card className="fade-up" sx={{ borderRadius: "14px", border: `1px solid ${T.border}`, boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                <Box sx={{ p: 2.5, borderBottom: `1px solid ${T.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1.1rem" }}>Past Trips</Typography>
                    <TextField
                        size="small"
                        placeholder="Search date or ID..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        InputProps={{ startAdornment: <InputAdornment position="start"><Search sx={{ fontSize: 16, color: T.textMute }} /></InputAdornment> }}
                        sx={{ width: 220, "& .MuiOutlinedInput-root": { borderRadius: "8px", fontFamily: fontBody, fontSize: "0.8rem" } }}
                    />
                </Box>
                <Box sx={{ overflowX: "auto" }}>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ bgcolor: "#F9FAFB" }}>
                                {["Trip ID", "Date", "Type", "Route", "Duration", "Passengers", "Status"].map(h => (
                                    <TableCell key={h} sx={{ fontFamily: fontBody, fontWeight: 700, fontSize: "0.72rem", color: T.textMute, textTransform: "uppercase", py: 1.5 }}>{h}</TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filtered.map(row => (
                                <TableRow key={row.id} className="row-hover">
                                    <TableCell sx={{ fontFamily: fontMono, fontWeight: 600, fontSize: "0.8rem", color: T.text }}>{row.id}</TableCell>
                                    <TableCell sx={{ fontFamily: fontBody, fontSize: "0.82rem", color: T.text }}>{row.date}</TableCell>
                                    <TableCell sx={{ fontFamily: fontBody, fontSize: "0.82rem", color: T.textSub }}>{row.type}</TableCell>
                                    <TableCell sx={{ fontFamily: fontBody, fontSize: "0.82rem", color: T.textSub }}>{row.route}</TableCell>
                                    <TableCell sx={{ fontFamily: fontMono, fontSize: "0.82rem", color: T.textSub }}>{row.duration} min</TableCell>
                                    <TableCell sx={{ fontFamily: fontMono, fontSize: "0.82rem", color: T.text }}>{row.passengers}</TableCell>
                                    <TableCell><StatusPill status={row.status} /></TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Box>
            </Card >
        </Box >
    );
}
