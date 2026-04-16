import React, { useState } from "react";
import { Box, Card, Typography, TextField, Button, Grid, MenuItem, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import { Add, Description } from "@mui/icons-material";
import { T, fontHead, fontBody, fontMono, Fonts, leaveApplications, statusColors } from "./driverShared";

const StatusPill = ({ status }) => {
    const s = statusColors[status] || { bg: T.bg, color: T.textSub };
    return (
        <Box sx={{ px: 1.2, py: 0.4, borderRadius: "6px", bgcolor: s.bg, width: "fit-content", display: "inline-flex", alignItems: "center", gap: 0.5 }}>
            <Box sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: s.color }} />
            <Typography sx={{ fontFamily: fontBody, fontSize: "0.7rem", fontWeight: 700, color: s.color }}>{status}</Typography>
        </Box>
    );
};

export default function LeaveApplication() {
    const [isApplying, setIsApplying] = useState(false);

    return (
        <Box sx={{ p: 3, background: T.bg, minHeight: "100vh", fontFamily: fontBody }}>
            <style>{Fonts()}</style>

            <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3} className="fade-up">
                <Box>
                    <Typography sx={{ fontFamily: fontBody, fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: T.textMute, mb: 0.3 }}>Attendance & Leave</Typography>
                    <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1.5rem", color: T.text, lineHeight: 1.1 }}>Leave Application</Typography>
                    <Typography sx={{ fontFamily: fontBody, fontSize: "0.82rem", color: T.textSub, mt: 0.4 }}>Apply for leave and track approval status.</Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => setIsApplying(!isApplying)}
                    sx={{ bgcolor: T.accent, textTransform: "none", fontFamily: fontBody, fontWeight: 700, borderRadius: "8px", boxShadow: "none" }}
                >
                    Apply for Leave
                </Button>
            </Box>

            {isApplying && (
                <Card className="fade-up" sx={{ p: 3, mb: 3, borderRadius: "14px", border: `1px solid ${T.border}`, boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}>
                    <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1.1rem", mb: 3 }}>New Leave Application</Typography>
                    <Grid container spacing={2.5}>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                select fullWidth label="Leave Type" defaultValue="Casual"
                                InputLabelProps={{ sx: { fontFamily: fontBody, fontSize: "0.85rem" } }}
                                InputProps={{ sx: { fontFamily: fontBody, fontSize: "0.85rem", borderRadius: "8px" } }}
                            >
                                <MenuItem value="Casual">Casual Leave</MenuItem>
                                <MenuItem value="Sick">Sick Leave</MenuItem>
                                <MenuItem value="Earned">Earned Leave</MenuItem>
                            </TextField>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth type="date" label="From Date" InputLabelProps={{ shrink: true, sx: { fontFamily: fontBody, fontSize: "0.85rem" } }}
                                InputProps={{ sx: { fontFamily: fontBody, fontSize: "0.85rem", borderRadius: "8px" } }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth type="date" label="To Date" InputLabelProps={{ shrink: true, sx: { fontFamily: fontBody, fontSize: "0.85rem" } }}
                                InputProps={{ sx: { fontFamily: fontBody, fontSize: "0.85rem", borderRadius: "8px" } }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth multiline rows={3} label="Reason for Leave"
                                InputLabelProps={{ sx: { fontFamily: fontBody, fontSize: "0.85rem" } }}
                                InputProps={{ sx: { fontFamily: fontBody, fontSize: "0.85rem", borderRadius: "8px" } }}
                            />
                        </Grid>
                        <Grid item xs={12} display="flex" justifyContent="flex-end" gap={1.5}>
                            <Button variant="outlined" onClick={() => setIsApplying(false)} sx={{ fontFamily: fontBody, fontWeight: 700, textTransform: "none", borderRadius: "8px" }}>Cancel</Button>
                            <Button variant="contained" onClick={() => setIsApplying(false)} sx={{ bgcolor: T.accent, fontFamily: fontBody, fontWeight: 700, textTransform: "none", borderRadius: "8px", boxShadow: "none" }}>Submit Application</Button>
                        </Grid>
                    </Grid>
                </Card>
            )}

            <Card className="fade-up" sx={{ borderRadius: "14px", border: `1px solid ${T.border}`, boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                <Box sx={{ p: 2.5, borderBottom: `1px solid ${T.border}` }}>
                    <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1.1rem" }}>My Leaves history</Typography>
                </Box>
                <Box sx={{ overflowX: "auto" }}>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ bgcolor: "#F9FAFB" }}>
                                {["App ID", "Leave Type", "Date Range", "Reason", "Applied On", "Status"].map(h => (
                                    <TableCell key={h} sx={{ fontFamily: fontBody, fontWeight: 700, fontSize: "0.72rem", color: T.textMute, textTransform: "uppercase", py: 1.5 }}>{h}</TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {leaveApplications.map(row => (
                                <TableRow key={row.id} className="row-hover">
                                    <TableCell sx={{ fontFamily: fontMono, fontWeight: 600, fontSize: "0.8rem", color: T.text }}>{row.id}</TableCell>
                                    <TableCell sx={{ fontFamily: fontBody, fontWeight: 600, fontSize: "0.82rem", color: T.text }}>{row.type}</TableCell>
                                    <TableCell sx={{ fontFamily: fontMono, fontSize: "0.82rem", color: T.textSub }}>{row.from} - {row.to}</TableCell>
                                    <TableCell sx={{ fontFamily: fontBody, fontSize: "0.82rem", color: T.textSub, maxWidth: 200 }} noWrap>{row.reason}</TableCell>
                                    <TableCell sx={{ fontFamily: fontBody, fontSize: "0.82rem", color: T.textMute }}>{row.appliedOn}</TableCell>
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
