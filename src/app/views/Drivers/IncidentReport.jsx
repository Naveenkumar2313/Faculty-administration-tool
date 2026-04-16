import React, { useState } from "react";
import { Box, Card, Typography, TextField, Button, Grid, MenuItem, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import { ReportProblem, CloudUpload } from "@mui/icons-material";
import { T, fontHead, fontBody, fontMono, Fonts, reportedIncidents, statusColors } from "./driverShared";

const StatusPill = ({ status }) => {
    const s = statusColors[status] || { bg: T.bg, color: T.textSub };
    return (
        <Box sx={{ px: 1.2, py: 0.4, borderRadius: "6px", bgcolor: s.bg, width: "fit-content", display: "inline-flex", alignItems: "center", gap: 0.5 }}>
            <Box sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: s.color }} />
            <Typography sx={{ fontFamily: fontBody, fontSize: "0.7rem", fontWeight: 700, color: s.color }}>{status}</Typography>
        </Box>
    );
};

export default function IncidentReport() {
    const [isReporting, setIsReporting] = useState(false);

    return (
        <Box sx={{ p: 3, background: T.bg, minHeight: "100vh", fontFamily: fontBody }}>
            <style>{Fonts()}</style>

            <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3} className="fade-up">
                <Box>
                    <Typography sx={{ fontFamily: fontBody, fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: T.textMute, mb: 0.3 }}>Reporting</Typography>
                    <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1.5rem", color: T.text, lineHeight: 1.1 }}>Incident Report</Typography>
                    <Typography sx={{ fontFamily: fontBody, fontSize: "0.82rem", color: T.textSub, mt: 0.4 }}>Report accidents, breakdowns, or passenger complaints.</Typography>
                </Box>
                <Button
                    variant="contained"
                    color="error"
                    startIcon={<ReportProblem />}
                    onClick={() => setIsReporting(!isReporting)}
                    sx={{ textTransform: "none", fontFamily: fontBody, fontWeight: 700, borderRadius: "8px", boxShadow: "none" }}
                >
                    Report Incident
                </Button>
            </Box>

            {isReporting && (
                <Card className="fade-up" sx={{ p: 3, mb: 3, borderRadius: "14px", border: `1px solid ${T.danger}50`, bgcolor: T.dangerLight, boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}>
                    <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1.1rem", color: T.danger, mb: 3 }}>Report New Incident</Typography>
                    <Grid container spacing={2.5}>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                select fullWidth label="Incident Type" defaultValue="Breakdown"
                                InputLabelProps={{ sx: { fontFamily: fontBody, fontSize: "0.85rem" } }}
                                InputProps={{ sx: { fontFamily: fontBody, fontSize: "0.85rem", borderRadius: "8px", bgcolor: "#fff" } }}
                            >
                                <MenuItem value="Breakdown">Vehicle Breakdown</MenuItem>
                                <MenuItem value="Traffic">Traffic Incident / Accident</MenuItem>
                                <MenuItem value="Passenger">Passenger Complaint</MenuItem>
                                <MenuItem value="Other">Other</MenuItem>
                            </TextField>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth label="Location" placeholder="e.g. Agara Junction"
                                InputLabelProps={{ sx: { fontFamily: fontBody, fontSize: "0.85rem" } }}
                                InputProps={{ sx: { fontFamily: fontBody, fontSize: "0.85rem", borderRadius: "8px", bgcolor: "#fff" } }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                select fullWidth label="Severity" defaultValue="Medium"
                                InputLabelProps={{ sx: { fontFamily: fontBody, fontSize: "0.85rem" } }}
                                InputProps={{ sx: { fontFamily: fontBody, fontSize: "0.85rem", borderRadius: "8px", bgcolor: "#fff" } }}
                            >
                                <MenuItem value="Low">Low (No immediate danger)</MenuItem>
                                <MenuItem value="Medium">Medium (Requires assistance)</MenuItem>
                                <MenuItem value="High">High (Emergency)</MenuItem>
                            </TextField>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth multiline rows={3} label="Detailed Description" placeholder="Describe what happened..."
                                InputLabelProps={{ sx: { fontFamily: fontBody, fontSize: "0.85rem" } }}
                                InputProps={{ sx: { fontFamily: fontBody, fontSize: "0.85rem", borderRadius: "8px", bgcolor: "#fff" } }}
                            />
                        </Grid>
                        <Grid item xs={12} display="flex" justifyContent="space-between" alignItems="center">
                            <Button startIcon={<CloudUpload />} component="label" sx={{ fontFamily: fontBody, fontWeight: 600, textTransform: "none" }}>
                                Upload Photos
                                <input type="file" hidden multiple accept="image/*" />
                            </Button>
                            <Box display="flex" gap={1.5}>
                                <Button variant="outlined" color="inherit" onClick={() => setIsReporting(false)} sx={{ fontFamily: fontBody, fontWeight: 700, textTransform: "none", borderRadius: "8px", bgcolor: "#fff" }}>Cancel</Button>
                                <Button variant="contained" color="error" onClick={() => setIsReporting(false)} sx={{ fontFamily: fontBody, fontWeight: 700, textTransform: "none", borderRadius: "8px", boxShadow: "none" }}>Submit Report</Button>
                            </Box>
                        </Grid>
                    </Grid>
                </Card>
            )}

            <Card className="fade-up" sx={{ borderRadius: "14px", border: `1px solid ${T.border}`, boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                <Box sx={{ p: 2.5, borderBottom: `1px solid ${T.border}` }}>
                    <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1.1rem" }}>Report History</Typography>
                </Box>
                <Box sx={{ overflowX: "auto" }}>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ bgcolor: "#F9FAFB" }}>
                                {["Report ID", "Date", "Time", "Type", "Location", "Severity", "Status"].map(h => (
                                    <TableCell key={h} sx={{ fontFamily: fontBody, fontWeight: 700, fontSize: "0.72rem", color: T.textMute, textTransform: "uppercase", py: 1.5 }}>{h}</TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {reportedIncidents.map(row => (
                                <TableRow key={row.id} className="row-hover">
                                    <TableCell sx={{ fontFamily: fontMono, fontWeight: 600, fontSize: "0.8rem", color: T.text }}>{row.id}</TableCell>
                                    <TableCell sx={{ fontFamily: fontBody, fontSize: "0.82rem", color: T.text }}>{row.date}</TableCell>
                                    <TableCell sx={{ fontFamily: fontMono, fontSize: "0.82rem", color: T.textSub }}>{row.time}</TableCell>
                                    <TableCell sx={{ fontFamily: fontBody, fontWeight: 600, fontSize: "0.82rem", color: T.text }}>{row.type}</TableCell>
                                    <TableCell sx={{ fontFamily: fontBody, fontSize: "0.82rem", color: T.textSub }}>{row.location}</TableCell>
                                    <TableCell>
                                        <Typography sx={{ fontFamily: fontBody, fontSize: "0.75rem", fontWeight: 700, color: row.severity === 'High' ? T.danger : row.severity === 'Medium' ? T.warning : T.textSub }}>
                                            {row.severity}
                                        </Typography>
                                    </TableCell>
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
