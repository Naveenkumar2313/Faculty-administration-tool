import React, { useState } from "react";
import {
    Box, Card, Grid, Typography, Button, TextField, Table, TableBody, TableCell,
    TableHead, TableRow, IconButton, InputAdornment, Chip, Dialog,
    DialogTitle, DialogContent, DialogActions, Tooltip
} from "@mui/material";
import {
    Search, Add, LocalGasStation, Close, Visibility,
    TrendingUp, DirectionsBus, CalendarMonth, Speed
} from "@mui/icons-material";
import { T, fontHead, fontBody, fontMono, Fonts, fuelLogs, statusColors } from "./transportAdminShared";

const SLabel = ({ children, sx = {} }) => (
    <Typography sx={{ fontFamily: fontBody, fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: T.textMute, mb: 0.5, ...sx }}>{children}</Typography>
);
const StatCard = ({ label, value, sub, color, icon: Icon, bgLight }) => (
    <Card className="fade-up" sx={{ p: 2.5, borderRadius: "14px", border: `1px solid ${T.border}`, background: T.surface, boxShadow: "0 1px 4px rgba(0,0,0,0.04)", height: "100%", transition: "all 0.25s ease", "&:hover": { transform: "translateY(-2px)", boxShadow: "0 4px 20px rgba(99,102,241,0.08)" } }}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
            <Box>
                <SLabel>{label}</SLabel>
                <Typography sx={{ fontFamily: fontMono, fontWeight: 700, fontSize: "1.8rem", color: color || T.text, lineHeight: 1.1 }}>{value}</Typography>
                {sub && <Typography sx={{ fontFamily: fontBody, fontSize: "0.72rem", color: T.textMute, mt: 0.4 }}>{sub}</Typography>}
            </Box>
            {Icon && <Box sx={{ p: 1.2, borderRadius: "10px", bgcolor: bgLight || `${color}15`, color: color }}><Icon sx={{ fontSize: 22 }} /></Box>}
        </Box>
    </Card>
);

export default function FuelManagement() {
    const [searchTerm, setSearchTerm] = useState("");
    const [detailLog, setDetailLog] = useState(null);

    const filtered = fuelLogs.filter(f =>
        f.busNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.station.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalLitres = fuelLogs.reduce((a, f) => a + parseFloat(f.litres), 0).toFixed(0);
    const totalCost = fuelLogs.reduce((a, f) => a + parseInt(f.totalCost.replace(/[₹,]/g, "")), 0);
    const avgEfficiency = (fuelLogs.reduce((a, f) => a + parseFloat(f.efficiency), 0) / fuelLogs.length).toFixed(1);

    return (
        <Box sx={{ p: 3, background: T.bg, minHeight: "100vh", fontFamily: fontBody }}>
            <style>{Fonts()}</style>

            <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3} className="fade-up">
                <Box>
                    <Typography sx={{ fontFamily: fontBody, fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: T.textMute, mb: 0.3 }}>Fleet & Routes · Bus Fleet</Typography>
                    <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1.5rem", color: T.text, lineHeight: 1.1 }}>Fuel Management</Typography>
                    <Typography sx={{ fontFamily: fontBody, fontSize: "0.82rem", color: T.textSub, mt: 0.4 }}>Log and track fuel consumption per vehicle.</Typography>
                </Box>
                <Button variant="contained" startIcon={<Add sx={{ fontSize: 16 }} />} sx={{ fontFamily: fontBody, fontWeight: 700, fontSize: "0.8rem", textTransform: "none", borderRadius: "8px", bgcolor: T.accent, boxShadow: "none", "&:hover": { bgcolor: "#5558e6" } }}>Log Fuel Entry</Button>
            </Box>

            <Grid container spacing={2.5} mb={3}>
                <Grid item xs={6} sm={3}><StatCard label="Total Entries" value={fuelLogs.length} sub="This period" color={T.accent} bgLight={T.accentLight} icon={CalendarMonth} /></Grid>
                <Grid item xs={6} sm={3}><StatCard label="Total Litres" value={totalLitres} sub="Consumed" color={T.warning} bgLight={T.warningLight} icon={LocalGasStation} /></Grid>
                <Grid item xs={6} sm={3}><StatCard label="Total Cost" value={`₹${(totalCost / 1000).toFixed(0)}K`} sub="Fuel expenditure" color={T.danger} bgLight={T.dangerLight} icon={TrendingUp} /></Grid>
                <Grid item xs={6} sm={3}><StatCard label="Avg. Efficiency" value={`${avgEfficiency} km/l`} sub="Fleet average" color={T.success} bgLight={T.successLight} icon={Speed} /></Grid>
            </Grid>

            <Card className="fade-up" sx={{ borderRadius: "14px", border: `1px solid ${T.border}`, boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                <Box sx={{ p: 2.5, borderBottom: `1px solid ${T.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
                    <Box>
                        <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1.1rem" }}>Fuel Logs</Typography>
                        <Typography sx={{ fontFamily: fontBody, fontSize: "0.78rem", color: T.textMute }}>{filtered.length} entries</Typography>
                    </Box>
                    <TextField size="small" placeholder="Search buses or stations..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                        InputProps={{ startAdornment: <InputAdornment position="start"><Search sx={{ fontSize: 16, color: T.textMute }} /></InputAdornment> }}
                        sx={{ width: 280, "& .MuiOutlinedInput-root": { borderRadius: "8px", fontFamily: fontBody, fontSize: "0.8rem" } }} />
                </Box>
                <Box sx={{ overflowX: "auto" }}>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ bgcolor: "#F9FAFB" }}>
                                {["ID", "Bus", "Date", "Litres", "Cost/L", "Total Cost", "Odometer", "Station", "Efficiency", "Actions"].map(h => (
                                    <TableCell key={h} sx={{ fontFamily: fontBody, fontWeight: 700, fontSize: "0.72rem", color: T.textMute, textTransform: "uppercase", py: 1.5, whiteSpace: "nowrap", ...(h === "Actions" ? { textAlign: "right" } : {}) }}>{h}</TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filtered.map(row => (
                                <TableRow key={row.id} className="row-hover" sx={{ cursor: "pointer" }} onClick={() => setDetailLog(row)}>
                                    <TableCell sx={{ fontFamily: fontMono, fontWeight: 600, fontSize: "0.78rem", color: T.text }}>{row.id}</TableCell>
                                    <TableCell>
                                        <Typography sx={{ fontFamily: fontBody, fontWeight: 600, fontSize: "0.82rem", color: T.text }}>{row.busNumber}</Typography>
                                        <Typography sx={{ fontFamily: fontMono, fontSize: "0.68rem", color: T.textMute }}>{row.busId}</Typography>
                                    </TableCell>
                                    <TableCell sx={{ fontFamily: fontBody, fontSize: "0.82rem", color: T.textSub }}>{row.date}</TableCell>
                                    <TableCell sx={{ fontFamily: fontMono, fontSize: "0.82rem", color: T.text, fontWeight: 600 }}>{row.litres} L</TableCell>
                                    <TableCell sx={{ fontFamily: fontMono, fontSize: "0.78rem", color: T.textSub }}>{row.costPerLitre}</TableCell>
                                    <TableCell sx={{ fontFamily: fontMono, fontSize: "0.82rem", color: T.text, fontWeight: 600 }}>{row.totalCost}</TableCell>
                                    <TableCell sx={{ fontFamily: fontMono, fontSize: "0.78rem", color: T.textMute }}>{row.odometer}</TableCell>
                                    <TableCell><Typography sx={{ fontFamily: fontBody, fontSize: "0.8rem", color: T.textSub, maxWidth: 150 }} noWrap>{row.station}</Typography></TableCell>
                                    <TableCell>
                                        <Chip label={row.efficiency} size="small" sx={{ fontFamily: fontMono, fontSize: "0.7rem", fontWeight: 600, bgcolor: parseFloat(row.efficiency) > 3.5 ? T.successLight : T.warningLight, color: parseFloat(row.efficiency) > 3.5 ? T.success : T.warning, height: 24 }} />
                                    </TableCell>
                                    <TableCell sx={{ textAlign: "right", py: 1 }}>
                                        <Tooltip title="View"><IconButton size="small" sx={{ color: T.accent }}><Visibility sx={{ fontSize: 16 }} /></IconButton></Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Box>
            </Card>

            <Dialog open={!!detailLog} onClose={() => setDetailLog(null)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: "16px" } }}>
                {detailLog && (<>
                    <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontFamily: fontHead, fontWeight: 700 }}>
                        Fuel Entry — {detailLog.id}
                        <IconButton onClick={() => setDetailLog(null)}><Close /></IconButton>
                    </DialogTitle>
                    <DialogContent dividers>
                        <Grid container spacing={2}>
                            {[
                                { label: "Entry ID", value: detailLog.id },
                                { label: "Bus", value: `${detailLog.busNumber} (${detailLog.busId})` },
                                { label: "Date", value: detailLog.date },
                                { label: "Litres Filled", value: `${detailLog.litres} L` },
                                { label: "Cost per Litre", value: detailLog.costPerLitre },
                                { label: "Total Cost", value: detailLog.totalCost },
                                { label: "Odometer Reading", value: detailLog.odometer },
                                { label: "Station", value: detailLog.station },
                                { label: "Filled By", value: detailLog.filledBy },
                                { label: "Fuel Efficiency", value: detailLog.efficiency },
                            ].map(item => (
                                <Grid item xs={6} key={item.label}>
                                    <SLabel>{item.label}</SLabel>
                                    <Typography sx={{ fontFamily: fontBody, fontSize: "0.88rem", color: T.text, fontWeight: 600 }}>{item.value}</Typography>
                                </Grid>
                            ))}
                        </Grid>
                    </DialogContent>
                    <DialogActions sx={{ p: 2 }}>
                        <Button onClick={() => setDetailLog(null)} sx={{ fontFamily: fontBody, textTransform: "none" }}>Close</Button>
                    </DialogActions>
                </>)}
            </Dialog>
        </Box>
    );
}
