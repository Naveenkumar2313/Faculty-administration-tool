import React, { useState } from "react";
import { Box, Card, Typography, TextField, Button, Grid, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import { AddAlert } from "@mui/icons-material";
import { T, fontHead, fontBody, fontMono, Fonts, mockExitPasses, statusColors } from "./studentShared";

const StatusPill = ({ status }) => {
    const s = statusColors[status] || { bg: T.bg, color: T.textSub };
    return (
        <Box sx={{ px: 1.2, py: 0.4, borderRadius: "6px", bgcolor: s.bg, width: "fit-content", display: "inline-flex", alignItems: "center", gap: 0.5 }}>
            <Box sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: s.color }} />
            <Typography sx={{ fontFamily: fontBody, fontSize: "0.7rem", fontWeight: 700, color: s.color }}>{status}</Typography>
        </Box>
    );
};

export default function EntryExitPass() {
    const [isApplying, setIsApplying] = useState(false);

    return (
        <Box sx={{ p: 3, background: T.bg, minHeight: "100vh", fontFamily: fontBody }}>
            <style>{Fonts()}</style>

            <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={4} className="fade-up">
                <Box>
                    <Typography sx={{ fontFamily: fontBody, fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: T.textMute, mb: 0.3 }}>Hostel Dashboard</Typography>
                    <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1.5rem", color: T.text, lineHeight: 1.1 }}>Entry / Exit Pass</Typography>
                    <Typography sx={{ fontFamily: fontBody, fontSize: "0.85rem", color: T.textSub, mt: 0.4 }}>Request a late-night or weekend pass.</Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<AddAlert />}
                    onClick={() => setIsApplying(!isApplying)}
                    sx={{ bgcolor: T.accent, textTransform: "none", fontFamily: fontBody, fontWeight: 700, borderRadius: "8px", boxShadow: "none" }}
                >
                    Apply for Pass
                </Button>
            </Box>

            {isApplying && (
                <Card className="fade-up" sx={{ p: 3, mb: 3, borderRadius: "14px", border: `1px solid ${T.border}`, boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}>
                    <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1.1rem", mb: 3 }}>New Pass Application</Typography>
                    <Grid container spacing={2.5}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth type="datetime-local" label="Out Time" InputLabelProps={{ shrink: true, sx: { fontFamily: fontBody, fontSize: "0.85rem" } }}
                                InputProps={{ sx: { fontFamily: fontBody, fontSize: "0.85rem", borderRadius: "8px" } }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth type="datetime-local" label="Expected In Time" InputLabelProps={{ shrink: true, sx: { fontFamily: fontBody, fontSize: "0.85rem" } }}
                                InputProps={{ sx: { fontFamily: fontBody, fontSize: "0.85rem", borderRadius: "8px" } }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth multiline rows={3} label="Reason/Purpose" placeholder="Going home, attending an event, etc."
                                InputLabelProps={{ sx: { fontFamily: fontBody, fontSize: "0.85rem" } }}
                                InputProps={{ sx: { fontFamily: fontBody, fontSize: "0.85rem", borderRadius: "8px" } }}
                            />
                        </Grid>
                        <Grid item xs={12} display="flex" justifyContent="flex-end" gap={1.5}>
                            <Button variant="outlined" onClick={() => setIsApplying(false)} sx={{ fontFamily: fontBody, fontWeight: 700, textTransform: "none", borderRadius: "8px" }}>Cancel</Button>
                            <Button variant="contained" onClick={() => setIsApplying(false)} sx={{ bgcolor: T.accent, fontFamily: fontBody, fontWeight: 700, textTransform: "none", borderRadius: "8px", boxShadow: "none" }}>Submit Request</Button>
                        </Grid>
                    </Grid>
                </Card>
            )}

            <Card className="fade-up" sx={{ borderRadius: "14px", border: `1px solid ${T.border}`, boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                <Box sx={{ p: 2.5, borderBottom: `1px solid ${T.border}` }}>
                    <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1.1rem" }}>Pass History</Typography>
                </Box>
                <Box sx={{ overflowX: "auto" }}>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ bgcolor: T.bg }}>
                                {["Pass ID", "Applied On", "Purpose", "Out Time", "Expected In Time", "Status"].map(h => (
                                    <TableCell key={h} sx={{ fontFamily: fontBody, fontWeight: 700, fontSize: "0.72rem", color: T.textMute, textTransform: "uppercase", py: 1.5 }}>{h}</TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {mockExitPasses.map(row => (
                                <TableRow key={row.id} className="row-hover">
                                    <TableCell sx={{ fontFamily: fontMono, fontWeight: 600, fontSize: "0.8rem", color: T.text }}>{row.id}</TableCell>
                                    <TableCell sx={{ fontFamily: fontMono, fontSize: "0.82rem", color: T.textSub }}>{row.applied}</TableCell>
                                    <TableCell sx={{ fontFamily: fontBody, fontSize: "0.82rem", color: T.text }}>{row.purpose}</TableCell>
                                    <TableCell sx={{ fontFamily: fontMono, fontSize: "0.82rem", color: T.textSub }}>{row.outTime}</TableCell>
                                    <TableCell sx={{ fontFamily: fontMono, fontSize: "0.82rem", color: T.textSub }}>{row.expectedIn}</TableCell>
                                    <TableCell><StatusPill status={row.status} /></TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Box>
            </Card>
        </Box>
    );
}
