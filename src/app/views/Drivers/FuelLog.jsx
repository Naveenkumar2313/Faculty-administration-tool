import React, { useState } from "react";
import { Box, Card, Typography, TextField, Button, Grid, Table, TableBody, TableCell, TableHead, TableRow, InputAdornment } from "@mui/material";
import { LocalGasStation, Receipt } from "@mui/icons-material";
import { T, fontHead, fontBody, fontMono, Fonts, fuelLogs } from "./driverShared";

export default function FuelLog() {
    const [isLogging, setIsLogging] = useState(false);

    return (
        <Box sx={{ p: 3, background: T.bg, minHeight: "100vh", fontFamily: fontBody }}>
            <style>{Fonts()}</style>

            <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3} className="fade-up">
                <Box>
                    <Typography sx={{ fontFamily: fontBody, fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: T.textMute, mb: 0.3 }}>Reporting</Typography>
                    <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1.5rem", color: T.text, lineHeight: 1.1 }}>Fuel Log</Typography>
                    <Typography sx={{ fontFamily: fontBody, fontSize: "0.82rem", color: T.textSub, mt: 0.4 }}>Submit fuel fill-up records with odometer readings.</Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<LocalGasStation />}
                    onClick={() => setIsLogging(!isLogging)}
                    sx={{ bgcolor: T.info, textTransform: "none", fontFamily: fontBody, fontWeight: 700, borderRadius: "8px", boxShadow: "none", "&:hover": { bgcolor: "#2563EB" } }}
                >
                    Log Fuel Fill-up
                </Button>
            </Box>

            {isLogging && (
                <Card className="fade-up" sx={{ p: 3, mb: 3, borderRadius: "14px", border: `1px solid ${T.info}50`, bgcolor: T.infoLight, boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}>
                    <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1.1rem", color: T.info, mb: 3 }}>New Fuel Log Entry</Typography>
                    <Grid container spacing={2.5}>
                        <Grid item xs={12} sm={3}>
                            <TextField
                                fullWidth label="Odometer Reading" placeholder="e.g. 45200"
                                InputProps={{ endAdornment: <InputAdornment position="end">km</InputAdornment>, sx: { fontFamily: fontBody, fontSize: "0.85rem", borderRadius: "8px", bgcolor: "#fff" } }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={3}>
                            <TextField
                                fullWidth label="Fuel Amount" placeholder="e.g. 50"
                                InputProps={{ endAdornment: <InputAdornment position="end">Liters</InputAdornment>, sx: { fontFamily: fontBody, fontSize: "0.85rem", borderRadius: "8px", bgcolor: "#fff" } }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={3}>
                            <TextField
                                fullWidth label="Total Cost" placeholder="e.g. 4850"
                                InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment>, sx: { fontFamily: fontBody, fontSize: "0.85rem", borderRadius: "8px", bgcolor: "#fff" } }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={3}>
                            <TextField
                                fullWidth type="date" label="Date" InputLabelProps={{ shrink: true }}
                                InputProps={{ sx: { fontFamily: fontBody, fontSize: "0.85rem", borderRadius: "8px", bgcolor: "#fff" } }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth label="Fuel Station Name & Location" placeholder="e.g. HP Petrol Pump, HSR"
                                InputProps={{ sx: { fontFamily: fontBody, fontSize: "0.85rem", borderRadius: "8px", bgcolor: "#fff" } }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Box display="flex" alignItems="center" height="100%" gap={2}>
                                <Button startIcon={<Receipt />} component="label" sx={{ fontFamily: fontBody, fontWeight: 600, textTransform: "none", bgcolor: "#fff", border: `1px solid ${T.border}`, borderRadius: "8px", py: 1, px: 2 }}>
                                    Upload Receipt
                                    <input type="file" hidden accept="image/*,.pdf" />
                                </Button>
                                <Typography sx={{ fontFamily: fontBody, fontSize: "0.75rem", color: T.textSub }}>No file selected</Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} display="flex" justifyContent="flex-end" gap={1.5} mt={1}>
                            <Button variant="outlined" color="inherit" onClick={() => setIsLogging(false)} sx={{ fontFamily: fontBody, fontWeight: 700, textTransform: "none", borderRadius: "8px", bgcolor: "#fff" }}>Cancel</Button>
                            <Button variant="contained" onClick={() => setIsLogging(false)} sx={{ bgcolor: T.info, fontFamily: fontBody, fontWeight: 700, textTransform: "none", borderRadius: "8px", boxShadow: "none", "&:hover": { bgcolor: "#2563EB" } }}>Submit Log</Button>
                        </Grid>
                    </Grid>
                </Card>
            )}

            <Card className="fade-up" sx={{ borderRadius: "14px", border: `1px solid ${T.border}`, boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                <Box sx={{ p: 2.5, borderBottom: `1px solid ${T.border}` }}>
                    <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1.1rem" }}>Past Fuel Logs</Typography>
                </Box>
                <Box sx={{ overflowX: "auto" }}>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ bgcolor: "#F9FAFB" }}>
                                {["Log ID", "Date", "Station", "Amount (L)", "Cost (₹)", "Odometer (km)", "Est. Efficiency"].map(h => (
                                    <TableCell key={h} sx={{ fontFamily: fontBody, fontWeight: 700, fontSize: "0.72rem", color: T.textMute, textTransform: "uppercase", py: 1.5 }}>{h}</TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {fuelLogs.map(row => (
                                <TableRow key={row.id} className="row-hover">
                                    <TableCell sx={{ fontFamily: fontMono, fontWeight: 600, fontSize: "0.8rem", color: T.text }}>{row.id}</TableCell>
                                    <TableCell sx={{ fontFamily: fontBody, fontSize: "0.82rem", color: T.text }}>{row.date}</TableCell>
                                    <TableCell sx={{ fontFamily: fontBody, fontSize: "0.82rem", color: T.textSub }}>{row.station}</TableCell>
                                    <TableCell sx={{ fontFamily: fontMono, fontWeight: 600, fontSize: "0.82rem", color: T.info }}>{row.amount}</TableCell>
                                    <TableCell sx={{ fontFamily: fontMono, fontSize: "0.82rem", color: T.text }}>{row.cost}</TableCell>
                                    <TableCell sx={{ fontFamily: fontMono, fontSize: "0.82rem", color: T.textMute }}>{row.odometer}</TableCell>
                                    <TableCell sx={{ fontFamily: fontMono, fontSize: "0.82rem", color: T.textSub }}>{row.efficiency} km/l</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Box>
            </Card>
        </Box>
    );
}
