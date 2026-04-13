import React, { useState } from "react";
import {
    Box, Card, Grid, Typography, Button, TextField, Table, TableBody, TableCell,
    TableHead, TableRow, IconButton, InputAdornment, Chip, Dialog,
    DialogTitle, DialogContent, DialogActions, Tooltip, FormControl,
    Select, MenuItem, Avatar, Tabs, Tab
} from "@mui/material";
import {
    Search, Add, ConfirmationNumber, People, Warning, CheckCircle,
    Close, Visibility, Edit, School, CalendarMonth, CreditCard,
    FileDownload, Refresh
} from "@mui/icons-material";
import { T, fontHead, fontBody, fontMono, Fonts, students, statusColors } from "./transportShared";

const SLabel = ({ children, sx = {} }) => (
    <Typography sx={{ fontFamily: fontBody, fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: T.textMute, mb: 0.5, ...sx }}>{children}</Typography>
);

const StatusPill = ({ status }) => {
    const s = statusColors[status] || { bg: T.bg, color: T.textSub };
    return (
        <Box sx={{ px: 1.2, py: 0.4, borderRadius: "6px", bgcolor: s.bg, width: "fit-content", display: "inline-flex", alignItems: "center", gap: 0.5 }}>
            <Box sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: s.color }} />
            <Typography sx={{ fontFamily: fontBody, fontSize: "0.7rem", fontWeight: 700, color: s.color }}>{status}</Typography>
        </Box>
    );
};

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

export default function StudentPassesView() {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [passTypeFilter, setPassTypeFilter] = useState("All");
    const [detailStudent, setDetailStudent] = useState(null);

    const filtered = students.filter(s => {
        const matchSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.id.toLowerCase().includes(searchTerm.toLowerCase()) || s.department.toLowerCase().includes(searchTerm.toLowerCase());
        const matchStatus = statusFilter === "All" || s.passStatus === statusFilter;
        const matchType = passTypeFilter === "All" || s.passType === passTypeFilter;
        return matchSearch && matchStatus && matchType;
    });

    const activeCount = students.filter(s => s.passStatus === "Active").length;
    const expiredCount = students.filter(s => s.passStatus === "Expired").length;
    const pendingCount = students.filter(s => s.passStatus === "Pending").length;
    const totalRevenue = students.reduce((a, s) => a + parseInt(s.amountPaid.replace(/[₹,]/g, "")), 0);

    return (
        <Box sx={{ p: 3, background: T.bg, minHeight: "100vh", fontFamily: fontBody }}>
            <style>{Fonts()}</style>

            {/* ── Header ── */}
            <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3} className="fade-up">
                <Box>
                    <Typography sx={{ fontFamily: fontBody, fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: T.textMute, mb: 0.3 }}>Transportation · Passes</Typography>
                    <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1.5rem", color: T.text, lineHeight: 1.1 }}>Student Bus Passes</Typography>
                    <Typography sx={{ fontFamily: fontBody, fontSize: "0.82rem", color: T.textSub, mt: 0.4 }}>Manage student transport registrations, pass validity, renewals, and payment tracking.</Typography>
                </Box>
                <Box display="flex" gap={1}>
                    <Button variant="outlined" startIcon={<FileDownload sx={{ fontSize: 16 }} />} sx={{ fontFamily: fontBody, fontWeight: 600, fontSize: "0.8rem", textTransform: "none", borderRadius: "8px", borderColor: T.border, color: T.textSub }}>Export</Button>
                    <Button variant="contained" startIcon={<Add sx={{ fontSize: 16 }} />} sx={{ fontFamily: fontBody, fontWeight: 700, fontSize: "0.8rem", textTransform: "none", borderRadius: "8px", bgcolor: T.accent, boxShadow: "none", "&:hover": { bgcolor: "#5558e6" } }}>Issue Pass</Button>
                </Box>
            </Box>

            {/* ── Stats ── */}
            <Grid container spacing={2.5} mb={3}>
                <Grid item xs={6} sm={3}><StatCard label="Total Students" value={students.length} sub="Registered for transport" color={T.accent} bgLight={T.accentLight} icon={People} /></Grid>
                <Grid item xs={6} sm={3}><StatCard label="Active Passes" value={activeCount} sub={`${Math.round(activeCount / students.length * 100)}% of total`} color={T.success} bgLight={T.successLight} icon={CheckCircle} /></Grid>
                <Grid item xs={6} sm={3}><StatCard label="Expired / Pending" value={`${expiredCount} / ${pendingCount}`} sub="Needs attention" color={T.danger} bgLight={T.dangerLight} icon={Warning} /></Grid>
                <Grid item xs={6} sm={3}><StatCard label="Revenue Collected" value={`₹${(totalRevenue / 1000).toFixed(0)}K`} sub="This academic year" color={T.info} bgLight={T.infoLight} icon={CreditCard} /></Grid>
            </Grid>

            {/* ── Table ── */}
            <Card className="fade-up" sx={{ borderRadius: "14px", border: `1px solid ${T.border}`, boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                <Box sx={{ p: 2.5, borderBottom: `1px solid ${T.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
                    <Box>
                        <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1.1rem" }}>Student Bus Passes</Typography>
                        <Typography sx={{ fontFamily: fontBody, fontSize: "0.78rem", color: T.textMute }}>{filtered.length} of {students.length} students shown</Typography>
                    </Box>
                    <Box display="flex" gap={1.5}>
                        <FormControl size="small" sx={{ minWidth: 120 }}>
                            <Select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} sx={{ borderRadius: "8px", fontFamily: fontBody, fontSize: "0.8rem" }}>
                                <MenuItem value="All">All Status</MenuItem>
                                <MenuItem value="Active">Active</MenuItem>
                                <MenuItem value="Expired">Expired</MenuItem>
                                <MenuItem value="Pending">Pending</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl size="small" sx={{ minWidth: 120 }}>
                            <Select value={passTypeFilter} onChange={e => setPassTypeFilter(e.target.value)} sx={{ borderRadius: "8px", fontFamily: fontBody, fontSize: "0.8rem" }}>
                                <MenuItem value="All">All Types</MenuItem>
                                <MenuItem value="Annual">Annual</MenuItem>
                                <MenuItem value="Semester">Semester</MenuItem>
                            </Select>
                        </FormControl>
                        <TextField size="small" placeholder="Search students..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                            InputProps={{ startAdornment: <InputAdornment position="start"><Search sx={{ fontSize: 16, color: T.textMute }} /></InputAdornment> }}
                            sx={{ width: 260, "& .MuiOutlinedInput-root": { borderRadius: "8px", fontFamily: fontBody, fontSize: "0.8rem" } }} />
                    </Box>
                </Box>

                <Box sx={{ overflowX: "auto" }}>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ bgcolor: "#F9FAFB" }}>
                                {["Student", "Department", "Route", "Pass Type", "Amount", "Expiry", "Status", "Actions"].map(h => (
                                    <TableCell key={h} sx={{ fontFamily: fontBody, fontWeight: 700, fontSize: "0.72rem", color: T.textMute, textTransform: "uppercase", py: 1.5, whiteSpace: "nowrap", ...(h === "Actions" ? { textAlign: "right" } : {}) }}>{h}</TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filtered.slice(0, 25).map(row => (
                                <TableRow key={row.id} className="row-hover" sx={{ cursor: "pointer" }} onClick={() => setDetailStudent(row)}>
                                    <TableCell>
                                        <Box display="flex" alignItems="center" gap={1.5}>
                                            <Avatar sx={{ width: 32, height: 32, bgcolor: T.purpleLight, color: T.purple, fontFamily: fontBody, fontWeight: 700, fontSize: "0.7rem" }}>
                                                {row.name.split(" ").map(n => n[0]).join("")}
                                            </Avatar>
                                            <Box>
                                                <Typography sx={{ fontFamily: fontBody, fontWeight: 600, fontSize: "0.82rem", color: T.text }}>{row.name}</Typography>
                                                <Typography sx={{ fontFamily: fontMono, fontSize: "0.68rem", color: T.textMute }}>{row.id}</Typography>
                                            </Box>
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Chip label={row.department} size="small" sx={{ fontFamily: fontBody, fontSize: "0.7rem", bgcolor: T.accentLight, color: T.accent, height: 22 }} />
                                    </TableCell>
                                    <TableCell>
                                        <Typography sx={{ fontFamily: fontBody, fontSize: "0.8rem", color: T.textSub, maxWidth: 160 }} noWrap>{row.route}</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Chip label={row.passType} size="small" variant="outlined" sx={{ fontFamily: fontBody, fontSize: "0.7rem", borderColor: T.border, color: T.textSub, height: 22 }} />
                                    </TableCell>
                                    <TableCell sx={{ fontFamily: fontMono, fontSize: "0.82rem", color: T.text, fontWeight: 600 }}>{row.amountPaid}</TableCell>
                                    <TableCell sx={{ fontFamily: fontBody, fontSize: "0.82rem", color: row.passStatus === "Expired" ? T.danger : T.textSub }}>{row.expiryDate}</TableCell>
                                    <TableCell><StatusPill status={row.passStatus} /></TableCell>
                                    <TableCell sx={{ textAlign: "right", py: 1 }}>
                                        <Tooltip title="View"><IconButton size="small" sx={{ color: T.accent }}><Visibility sx={{ fontSize: 16 }} /></IconButton></Tooltip>
                                        {row.passStatus === "Expired" && (
                                            <Tooltip title="Renew"><IconButton size="small" sx={{ color: T.success }}><Refresh sx={{ fontSize: 16 }} /></IconButton></Tooltip>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Box>

                {filtered.length > 25 && (
                    <Box sx={{ p: 2, borderTop: `1px solid ${T.border}`, textAlign: "center" }}>
                        <Typography sx={{ fontFamily: fontBody, fontSize: "0.78rem", color: T.textMute }}>Showing 25 of {filtered.length} records</Typography>
                    </Box>
                )}
            </Card>

            {/* ── Detail Dialog ── */}
            <Dialog open={!!detailStudent} onClose={() => setDetailStudent(null)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: "16px" } }}>
                {detailStudent && (<>
                    <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontFamily: fontHead, fontWeight: 700 }}>
                        Student Pass Details
                        <IconButton onClick={() => setDetailStudent(null)}><Close /></IconButton>
                    </DialogTitle>
                    <DialogContent dividers>
                        <Box display="flex" alignItems="center" gap={2} mb={3}>
                            <Avatar sx={{ width: 52, height: 52, bgcolor: T.purpleLight, color: T.purple, fontFamily: fontBody, fontWeight: 700, fontSize: "1rem" }}>
                                {detailStudent.name.split(" ").map(n => n[0]).join("")}
                            </Avatar>
                            <Box>
                                <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1.1rem", color: T.text }}>{detailStudent.name}</Typography>
                                <Typography sx={{ fontFamily: fontMono, fontSize: "0.78rem", color: T.textMute }}>{detailStudent.id}</Typography>
                                <StatusPill status={detailStudent.passStatus} />
                            </Box>
                        </Box>
                        <Grid container spacing={2}>
                            {[
                                { label: "Department", value: detailStudent.department },
                                { label: "Year", value: `Year ${detailStudent.year}` },
                                { label: "Phone", value: detailStudent.phone },
                                { label: "Route", value: detailStudent.route },
                                { label: "Pickup Stop", value: detailStudent.pickupStop },
                                { label: "Pass Type", value: detailStudent.passType },
                                { label: "Amount Paid", value: detailStudent.amountPaid },
                                { label: "Expiry Date", value: detailStudent.expiryDate },
                            ].map(item => (
                                <Grid item xs={6} key={item.label}>
                                    <SLabel>{item.label}</SLabel>
                                    <Typography sx={{ fontFamily: fontBody, fontSize: "0.88rem", color: T.text, fontWeight: 600 }}>{item.value}</Typography>
                                </Grid>
                            ))}
                        </Grid>
                    </DialogContent>
                    <DialogActions sx={{ p: 2 }}>
                        <Button onClick={() => setDetailStudent(null)} sx={{ fontFamily: fontBody, textTransform: "none" }}>Close</Button>
                        {detailStudent.passStatus === "Expired" && (
                            <Button variant="contained" sx={{ fontFamily: fontBody, textTransform: "none", bgcolor: T.success, borderRadius: "8px" }}>Renew Pass</Button>
                        )}
                        <Button variant="contained" sx={{ fontFamily: fontBody, textTransform: "none", bgcolor: T.accent, borderRadius: "8px" }}>Edit Details</Button>
                    </DialogActions>
                </>)}
            </Dialog>
        </Box>
    );
}
