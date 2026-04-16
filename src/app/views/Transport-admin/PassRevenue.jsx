import React, { useState } from "react";
import {
    Box, Card, Grid, Typography, Button, Table, TableBody, TableCell,
    TableHead, TableRow, Chip, MenuItem, Select, FormControl
} from "@mui/material";
import {
    CreditCard, TrendingUp, People, Warning, FileDownload, School
} from "@mui/icons-material";
import { T, fontHead, fontBody, fontMono, Fonts, students, faculty, statusColors } from "./transportAdminShared";

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

export default function PassRevenue() {
    const [periodFilter, setPeriodFilter] = useState("All");

    const studentRevenue = students.reduce((a, s) => a + parseInt(s.amountPaid.replace(/[₹,]/g, "")), 0);
    const facultyRevenue = faculty.reduce((a, f) => a + parseInt(f.amountPaid.replace(/[₹,]/g, "")), 0);
    const totalRevenue = studentRevenue + facultyRevenue;
    const paidStudents = students.filter(s => s.passStatus === "Active").length;
    const paidFaculty = faculty.filter(f => f.passStatus === "Active").length;
    const pendingStudents = students.filter(s => s.passStatus === "Pending" || s.passStatus === "Expired").length;
    const pendingFaculty = faculty.filter(f => f.passStatus === "Pending" || f.passStatus === "Expired").length;
    const pendingAmount = (pendingStudents * 10000 + pendingFaculty * 7000);

    // Revenue by department
    const deptMap = {};
    students.forEach(s => {
        deptMap[s.department] = (deptMap[s.department] || 0) + parseInt(s.amountPaid.replace(/[₹,]/g, ""));
    });
    faculty.forEach(f => {
        deptMap[f.department] = (deptMap[f.department] || 0) + parseInt(f.amountPaid.replace(/[₹,]/g, ""));
    });
    const deptRevenue = Object.entries(deptMap).sort((a, b) => b[1] - a[1]);

    // Revenue by pass type
    const annualStudents = students.filter(s => s.passType === "Annual");
    const semesterStudents = students.filter(s => s.passType === "Semester");
    const annualFaculty = faculty.filter(f => f.passType === "Annual");
    const semesterFaculty = faculty.filter(f => f.passType === "Semester");

    return (
        <Box sx={{ p: 3, background: T.bg, minHeight: "100vh", fontFamily: fontBody }}>
            <style>{Fonts()}</style>

            <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3} className="fade-up">
                <Box>
                    <Typography sx={{ fontFamily: fontBody, fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: T.textMute, mb: 0.3 }}>Drivers & Passes · Bus Pass Management</Typography>
                    <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1.5rem", color: T.text, lineHeight: 1.1 }}>Pass Revenue</Typography>
                    <Typography sx={{ fontFamily: fontBody, fontSize: "0.82rem", color: T.textSub, mt: 0.4 }}>Track pass fee collections and pending dues.</Typography>
                </Box>
                <Button variant="outlined" startIcon={<FileDownload sx={{ fontSize: 16 }} />} sx={{ fontFamily: fontBody, fontWeight: 600, fontSize: "0.8rem", textTransform: "none", borderRadius: "8px", borderColor: T.border, color: T.textSub }}>Export Report</Button>
            </Box>

            <Grid container spacing={2.5} mb={3}>
                <Grid item xs={6} sm={3}><StatCard label="Total Revenue" value={`₹${(totalRevenue / 1000).toFixed(0)}K`} sub="This academic year" color={T.success} bgLight={T.successLight} icon={CreditCard} /></Grid>
                <Grid item xs={6} sm={3}><StatCard label="Student Revenue" value={`₹${(studentRevenue / 1000).toFixed(0)}K`} sub={`${paidStudents} passes issued`} color={T.accent} bgLight={T.accentLight} icon={People} /></Grid>
                <Grid item xs={6} sm={3}><StatCard label="Faculty Revenue" value={`₹${(facultyRevenue / 1000).toFixed(0)}K`} sub={`${paidFaculty} passes issued`} color={T.info} bgLight={T.infoLight} icon={School} /></Grid>
                <Grid item xs={6} sm={3}><StatCard label="Pending Dues" value={`₹${(pendingAmount / 1000).toFixed(0)}K`} sub={`${pendingStudents + pendingFaculty} unpaid`} color={T.danger} bgLight={T.dangerLight} icon={Warning} /></Grid>
            </Grid>

            <Grid container spacing={3}>
                {/* Revenue by Pass Type */}
                <Grid item xs={12} md={6}>
                    <Card className="fade-up" sx={{ borderRadius: "14px", border: `1px solid ${T.border}`, boxShadow: "0 1px 4px rgba(0,0,0,0.04)", height: "100%" }}>
                        <Box sx={{ p: 2.5, borderBottom: `1px solid ${T.border}` }}>
                            <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1rem" }}>Revenue by Pass Type</Typography>
                        </Box>
                        <Box sx={{ p: 2.5 }}>
                            {[
                                { type: "Annual — Students", count: annualStudents.length, revenue: annualStudents.reduce((a, s) => a + parseInt(s.amountPaid.replace(/[₹,]/g, "")), 0), color: T.accent },
                                { type: "Semester — Students", count: semesterStudents.length, revenue: semesterStudents.reduce((a, s) => a + parseInt(s.amountPaid.replace(/[₹,]/g, "")), 0), color: T.info },
                                { type: "Annual — Faculty", count: annualFaculty.length, revenue: annualFaculty.reduce((a, f) => a + parseInt(f.amountPaid.replace(/[₹,]/g, "")), 0), color: T.success },
                                { type: "Semester — Faculty", count: semesterFaculty.length, revenue: semesterFaculty.reduce((a, f) => a + parseInt(f.amountPaid.replace(/[₹,]/g, "")), 0), color: T.purple },
                            ].map(item => (
                                <Box key={item.type} sx={{ mb: 2.5 }}>
                                    <Box display="flex" justifyContent="space-between" mb={0.5}>
                                        <Box>
                                            <Typography sx={{ fontFamily: fontBody, fontSize: "0.82rem", fontWeight: 600, color: T.text }}>{item.type}</Typography>
                                            <Typography sx={{ fontFamily: fontBody, fontSize: "0.68rem", color: T.textMute }}>{item.count} passes</Typography>
                                        </Box>
                                        <Typography sx={{ fontFamily: fontMono, fontSize: "0.88rem", fontWeight: 700, color: item.color }}>₹{(item.revenue / 1000).toFixed(0)}K</Typography>
                                    </Box>
                                    <Box sx={{ height: 6, borderRadius: 3, bgcolor: T.border, overflow: "hidden" }}>
                                        <Box sx={{ height: "100%", width: `${(item.revenue / totalRevenue) * 100}%`, bgcolor: item.color, borderRadius: 3, transition: "width 0.5s ease" }} />
                                    </Box>
                                </Box>
                            ))}
                        </Box>
                    </Card>
                </Grid>

                {/* Revenue by Department */}
                <Grid item xs={12} md={6}>
                    <Card className="fade-up" sx={{ borderRadius: "14px", border: `1px solid ${T.border}`, boxShadow: "0 1px 4px rgba(0,0,0,0.04)", height: "100%" }}>
                        <Box sx={{ p: 2.5, borderBottom: `1px solid ${T.border}` }}>
                            <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1rem" }}>Revenue by Department</Typography>
                        </Box>
                        <Table>
                            <TableHead>
                                <TableRow sx={{ bgcolor: "#F9FAFB" }}>
                                    {["Department", "Revenue", "Share"].map(h => (
                                        <TableCell key={h} sx={{ fontFamily: fontBody, fontWeight: 700, fontSize: "0.72rem", color: T.textMute, textTransform: "uppercase", py: 1.5 }}>{h}</TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {deptRevenue.map(([dept, revenue]) => (
                                    <TableRow key={dept} className="row-hover">
                                        <TableCell>
                                            <Chip label={dept} size="small" sx={{ fontFamily: fontBody, fontSize: "0.72rem", bgcolor: T.accentLight, color: T.accent, height: 24 }} />
                                        </TableCell>
                                        <TableCell sx={{ fontFamily: fontMono, fontSize: "0.85rem", color: T.text, fontWeight: 600 }}>₹{revenue.toLocaleString()}</TableCell>
                                        <TableCell sx={{ fontFamily: fontMono, fontSize: "0.78rem", color: T.textSub }}>{((revenue / totalRevenue) * 100).toFixed(1)}%</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Card>
                </Grid>

                {/* Collection Summary */}
                <Grid item xs={12}>
                    <Card className="fade-up" sx={{ borderRadius: "14px", border: `1px solid ${T.border}`, boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                        <Box sx={{ p: 2.5, borderBottom: `1px solid ${T.border}` }}>
                            <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1rem" }}>Collection Summary</Typography>
                        </Box>
                        <Table>
                            <TableHead>
                                <TableRow sx={{ bgcolor: "#F9FAFB" }}>
                                    {["Category", "Total Persons", "Passes Issued", "Pending/Expired", "Revenue Collected", "Pending Dues", "Collection Rate"].map(h => (
                                        <TableCell key={h} sx={{ fontFamily: fontBody, fontWeight: 700, fontSize: "0.72rem", color: T.textMute, textTransform: "uppercase", py: 1.5, whiteSpace: "nowrap" }}>{h}</TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow className="row-hover">
                                    <TableCell sx={{ fontFamily: fontBody, fontWeight: 600, fontSize: "0.85rem", color: T.text }}>Students</TableCell>
                                    <TableCell sx={{ fontFamily: fontMono, fontSize: "0.85rem", color: T.text, fontWeight: 600 }}>{students.length}</TableCell>
                                    <TableCell sx={{ fontFamily: fontMono, fontSize: "0.85rem", color: T.success, fontWeight: 600 }}>{paidStudents}</TableCell>
                                    <TableCell sx={{ fontFamily: fontMono, fontSize: "0.85rem", color: T.danger, fontWeight: 600 }}>{pendingStudents}</TableCell>
                                    <TableCell sx={{ fontFamily: fontMono, fontSize: "0.85rem", color: T.text, fontWeight: 700 }}>₹{studentRevenue.toLocaleString()}</TableCell>
                                    <TableCell sx={{ fontFamily: fontMono, fontSize: "0.85rem", color: T.danger, fontWeight: 600 }}>₹{(pendingStudents * 10000).toLocaleString()}</TableCell>
                                    <TableCell>
                                        <Chip label={`${Math.round((paidStudents / students.length) * 100)}%`} size="small" sx={{ fontFamily: fontMono, fontSize: "0.72rem", fontWeight: 700, bgcolor: T.successLight, color: T.success, height: 24 }} />
                                    </TableCell>
                                </TableRow>
                                <TableRow className="row-hover">
                                    <TableCell sx={{ fontFamily: fontBody, fontWeight: 600, fontSize: "0.85rem", color: T.text }}>Faculty</TableCell>
                                    <TableCell sx={{ fontFamily: fontMono, fontSize: "0.85rem", color: T.text, fontWeight: 600 }}>{faculty.length}</TableCell>
                                    <TableCell sx={{ fontFamily: fontMono, fontSize: "0.85rem", color: T.success, fontWeight: 600 }}>{paidFaculty}</TableCell>
                                    <TableCell sx={{ fontFamily: fontMono, fontSize: "0.85rem", color: T.danger, fontWeight: 600 }}>{pendingFaculty}</TableCell>
                                    <TableCell sx={{ fontFamily: fontMono, fontSize: "0.85rem", color: T.text, fontWeight: 700 }}>₹{facultyRevenue.toLocaleString()}</TableCell>
                                    <TableCell sx={{ fontFamily: fontMono, fontSize: "0.85rem", color: T.danger, fontWeight: 600 }}>₹{(pendingFaculty * 7000).toLocaleString()}</TableCell>
                                    <TableCell>
                                        <Chip label={`${Math.round((paidFaculty / faculty.length) * 100)}%`} size="small" sx={{ fontFamily: fontMono, fontSize: "0.72rem", fontWeight: 700, bgcolor: T.successLight, color: T.success, height: 24 }} />
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}
