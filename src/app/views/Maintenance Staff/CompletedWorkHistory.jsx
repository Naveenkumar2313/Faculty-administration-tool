import React from "react";
import { Box, Card, Typography, Table, TableBody, TableCell, TableHead, TableRow, Chip } from "@mui/material";
import { CheckCircleOutline } from "@mui/icons-material";
import { T, fontHead, fontBody, fontMono, Fonts, mockWorkOrders } from "./maintenanceShared";

export default function CompletedWorkHistory() {
    return (
        <Box sx={{ p: 3, background: T.bg, minHeight: "100vh", fontFamily: fontBody }}>
            <style>{Fonts()}</style>

            <Box mb={4} className="fade-up">
                <Typography sx={{ fontFamily: fontBody, fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: T.textMute, mb: 0.3 }}>Work Orders</Typography>
                <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1.5rem", color: T.text, lineHeight: 1.1 }}>Completed Work History</Typography>
                <Typography sx={{ fontFamily: fontBody, fontSize: "0.85rem", color: T.textSub, mt: 0.4 }}>Archive of all successfully closed maintenance tasks.</Typography>
            </Box>

            <Card className="fade-up" sx={{ borderRadius: "14px", border: `1px solid ${T.border}`, boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                <Box sx={{ p: 2.5, borderBottom: `1px solid ${T.border}` }}>
                    <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1.1rem" }}>Closed Work Orders</Typography>
                </Box>
                <Box sx={{ overflowX: "auto" }}>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ bgcolor: T.bg }}>
                                {["Work ID", "Location", "Resolved Issue", "Completion Date", "Status"].map(h => (
                                    <TableCell key={h} sx={{ fontFamily: fontBody, fontWeight: 700, fontSize: "0.72rem", color: T.textMute, textTransform: "uppercase", py: 1.5 }}>{h}</TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {mockWorkOrders.filter(row => row.status === "Completed").map(row => (
                                <TableRow key={row.id} className="row-hover">
                                    <TableCell sx={{ fontFamily: fontMono, fontWeight: 600, fontSize: "0.8rem", color: T.text }}>{row.id}</TableCell>
                                    <TableCell sx={{ fontFamily: fontBody, fontSize: "0.85rem", color: T.text }}>{row.location}</TableCell>
                                    <TableCell sx={{ fontFamily: fontBody, fontSize: "0.85rem", color: T.textSub, maxWidth: 250, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{row.issue}</TableCell>
                                    <TableCell sx={{ fontFamily: fontMono, fontSize: "0.8rem", color: T.textSub }}>{row.deadline}</TableCell>
                                    <TableCell>
                                        <Chip icon={<CheckCircleOutline style={{ fontSize: 16, color: T.success }} />} sx={{ bgcolor: T.successLight, color: T.success, fontWeight: 700, fontFamily: fontBody, fontSize: "0.7rem", height: 24 }} label="CLOSED" />
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
