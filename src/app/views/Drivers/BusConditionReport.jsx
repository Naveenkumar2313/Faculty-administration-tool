import React, { useState } from "react";
import { Box, Card, Typography, TextField, Button, Grid, Table, TableBody, TableCell, TableHead, TableRow, FormControlLabel, Checkbox } from "@mui/material";
import { VerifiedUser, CheckCircle } from "@mui/icons-material";
import { T, fontHead, fontBody, fontMono, Fonts, conditionReports, statusColors } from "./driverShared";

const StatusPill = ({ status }) => {
    const s = statusColors[status] || { bg: T.bg, color: T.textSub };
    return (
        <Box sx={{ px: 1.2, py: 0.4, borderRadius: "6px", bgcolor: s.bg, width: "fit-content", display: "inline-flex", alignItems: "center", gap: 0.5 }}>
            <Box sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: s.color }} />
            <Typography sx={{ fontFamily: fontBody, fontSize: "0.7rem", fontWeight: 700, color: s.color }}>{status}</Typography>
        </Box>
    );
};

export default function BusConditionReport() {
    const [isReporting, setIsReporting] = useState(false);
    const [checks, setChecks] = useState({ tires: false, brakes: false, lights: false, fluids: false, wipers: false, interior: false });

    const handleCheck = (e) => setChecks({ ...checks, [e.target.name]: e.target.checked });
    const allChecked = Object.values(checks).every(v => v === true);

    return (
        <Box sx={{ p: 3, background: T.bg, minHeight: "100vh", fontFamily: fontBody }}>
            <style>{Fonts()}</style>

            <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3} className="fade-up">
                <Box>
                    <Typography sx={{ fontFamily: fontBody, fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: T.textMute, mb: 0.3 }}>Reporting</Typography>
                    <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1.5rem", color: T.text, lineHeight: 1.1 }}>Bus Condition Report</Typography>
                    <Typography sx={{ fontFamily: fontBody, fontSize: "0.82rem", color: T.textSub, mt: 0.4 }}>Daily pre-trip vehicle checklist for safety compliance.</Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<VerifiedUser />}
                    onClick={() => setIsReporting(!isReporting)}
                    sx={{ bgcolor: T.success, textTransform: "none", fontFamily: fontBody, fontWeight: 700, borderRadius: "8px", boxShadow: "none", "&:hover": { bgcolor: "#059669" } }}
                >
                    Start Inspection
                </Button>
            </Box>

            {isReporting && (
                <Card className="fade-up" sx={{ p: 3, mb: 3, borderRadius: "14px", border: `1px solid ${T.success}50`, bgcolor: "#FFFFFF", boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}>
                    <Box display="flex" alignItems="center" gap={1} mb={3}>
                        <CheckCircle sx={{ color: T.success }} />
                        <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1.1rem", color: T.success }}>Pre-Trip Checklist</Typography>
                    </Box>

                    <Typography sx={{ fontFamily: fontBody, fontSize: "0.85rem", color: T.textSub, mb: 2 }}>Please verify the condition of the following items. Check the box if the item is in good working condition.</Typography>

                    <Grid container spacing={2} mb={3}>
                        {[
                            { name: "tires", label: "Tires & Wheels (Pressure, tread, nuts)" },
                            { name: "brakes", label: "Brakes (Handbrake, footbrake response)" },
                            { name: "lights", label: "Lights & Indicators (Headlights, tail, turn signals)" },
                            { name: "fluids", label: "Fluids (Oil, coolant, fuel level)" },
                            { name: "wipers", label: "Wipers & Mirrors (Clean, functioning)" },
                            { name: "interior", label: "Interior & Safety (Seats clean, first aid present)" }
                        ].map((item) => (
                            <Grid item xs={12} sm={6} md={4} key={item.name}>
                                <Box sx={{ p: 1.5, border: `1px solid ${checks[item.name] ? T.success : T.border}`, borderRadius: "8px", bgcolor: checks[item.name] ? T.successLight : "#F9FAFB", transition: "all 0.2s" }}>
                                    <FormControlLabel
                                        control={<Checkbox name={item.name} checked={checks[item.name]} onChange={handleCheck} color="success" />}
                                        label={<Typography sx={{ fontFamily: fontBody, fontSize: "0.85rem", fontWeight: checks[item.name] ? 700 : 400 }}>{item.label}</Typography>}
                                    />
                                </Box>
                            </Grid>
                        ))}
                    </Grid>

                    <TextField
                        fullWidth multiline rows={2} label="Additional Notes / Issues Found" placeholder="Leave blank if everything is perfect..."
                        InputProps={{ sx: { fontFamily: fontBody, fontSize: "0.85rem", borderRadius: "8px" } }} sx={{ mb: 3 }}
                    />

                    <Box display="flex" justifyContent="space-between" alignItems="center" pt={2} borderTop={`1px solid ${T.border}`}>
                        <Typography sx={{ fontFamily: fontBody, fontSize: "0.85rem", color: allChecked ? T.success : T.warning, fontWeight: 700 }}>
                            {allChecked ? "All systems Go!" : "Inspection incomplete or issues found."}
                        </Typography>
                        <Box display="flex" gap={1.5}>
                            <Button variant="outlined" color="inherit" onClick={() => setIsReporting(false)} sx={{ fontFamily: fontBody, fontWeight: 700, textTransform: "none", borderRadius: "8px" }}>Cancel</Button>
                            <Button variant="contained" onClick={() => setIsReporting(false)} sx={{ bgcolor: T.success, fontFamily: fontBody, fontWeight: 700, textTransform: "none", borderRadius: "8px", boxShadow: "none", "&:hover": { bgcolor: "#059669" } }}>Submit Report</Button>
                        </Box>
                    </Box>
                </Card>
            )}

            <Card className="fade-up" sx={{ borderRadius: "14px", border: `1px solid ${T.border}`, boxShadow: "0 1px 4px rgba(0,0,0,0.04)", style: { animationDelay: '0.1s' } }}>
                <Box sx={{ p: 2.5, borderBottom: `1px solid ${T.border}` }}>
                    <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1.1rem" }}>Past Condition Reports</Typography>
                </Box>
                <Box sx={{ overflowX: "auto" }}>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ bgcolor: "#F9FAFB" }}>
                                {["Report ID", "Date", "Time", "Status", "Notes", "Tires", "Brakes", "Lights", "Fluids"].map(h => (
                                    <TableCell key={h} sx={{ fontFamily: fontBody, fontWeight: 700, fontSize: "0.72rem", color: T.textMute, textTransform: "uppercase", py: 1.5 }}>{h}</TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {conditionReports.map(row => (
                                <TableRow key={row.id} className="row-hover">
                                    <TableCell sx={{ fontFamily: fontMono, fontWeight: 600, fontSize: "0.8rem", color: T.text }}>{row.id}</TableCell>
                                    <TableCell sx={{ fontFamily: fontBody, fontSize: "0.82rem", color: T.text }}>{row.date}</TableCell>
                                    <TableCell sx={{ fontFamily: fontMono, fontSize: "0.82rem", color: T.textSub }}>{row.time}</TableCell>
                                    <TableCell><StatusPill status={row.status} /></TableCell>
                                    <TableCell sx={{ fontFamily: fontBody, fontSize: "0.82rem", color: T.textSub }}>{row.notes}</TableCell>

                                    <TableCell><Typography sx={{ fontFamily: fontBody, fontSize: "0.75rem", color: row.tires === 'Good' ? T.success : T.danger }}>{row.tires}</Typography></TableCell>
                                    <TableCell><Typography sx={{ fontFamily: fontBody, fontSize: "0.75rem", color: row.brakes === 'Good' ? T.success : T.danger }}>{row.brakes}</Typography></TableCell>
                                    <TableCell><Typography sx={{ fontFamily: fontBody, fontSize: "0.75rem", color: row.lights === 'Good' ? T.success : T.danger }}>{row.lights}</Typography></TableCell>
                                    <TableCell><Typography sx={{ fontFamily: fontBody, fontSize: "0.75rem", color: row.fluids === 'Good' ? T.success : T.danger }}>{row.fluids}</Typography></TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Box>
            </Card>
        </Box>
    );
}
