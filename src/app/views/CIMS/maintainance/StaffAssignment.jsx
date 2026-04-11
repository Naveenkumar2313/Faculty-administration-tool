import React, { useState } from "react";
import {
    Box, Card, Grid, Typography, Button, TextField, Table, TableBody, TableCell, TableHead, TableRow,
    IconButton, InputAdornment, Dialog, DialogTitle, DialogContent, DialogActions, Select, MenuItem
} from "@mui/material";
import {
    Search, FilterList, Add, People, CheckCircle, Schedule, Build, Edit, DeleteOutline, Phone, Email, LocationOn
} from "@mui/icons-material";

/* ── Design Tokens ── */
const T = {
    bg: "#F5F7FA", surface: "#FFFFFF", border: "#E4E8EF", text: "#111827", textSub: "#4B5563", textMute: "#9CA3AF",
    accent: "#6366F1", accentLight: "#EEF2FF", success: "#10B981", successLight: "#ECFDF5",
    warning: "#F59E0B", warningLight: "#FFFBEB", danger: "#EF4444", dangerLight: "#FEF2F2",
    info: "#3B82F6", infoLight: "#EFF6FF"
};
const fontHead = "Sora, Roboto, Helvetica, Arial, sans-serif";
const fontBody = "Nunito, Roboto, Helvetica, Arial, sans-serif";
const fontMono = "JetBrains Mono, monospace";

const Fonts = () => (
    <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700&family=Nunito:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600&display=swap');
    * { box-sizing: border-box; }
    @keyframes fadeUp { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:none; } }
    .fade-up { animation: fadeUp 0.35s ease both; }
    .row-hover:hover { background: #F9FAFB !important; transition: background 0.15s; }
  `}</style>
);

const DInput = ({ label, type = "text", placeholder, options, value, onChange }) => (
    <Box mb={2}>
        <Typography sx={{ fontFamily: fontBody, fontSize: "0.78rem", fontWeight: 600, color: T.textSub, mb: 0.8 }}>{label}</Typography>
        {options ? (
            <Select fullWidth size="small" value={value} onChange={onChange} sx={{ fontFamily: fontBody, fontSize: "0.85rem", borderRadius: "8px" }}>
                {options.map(o => <MenuItem key={o} value={o} sx={{ fontFamily: fontBody, fontSize: "0.85rem" }}>{o}</MenuItem>)}
            </Select>
        ) : (
            <TextField fullWidth type={type} size="small" placeholder={placeholder} value={value} onChange={onChange} InputProps={{ sx: { fontFamily: fontBody, fontSize: "0.85rem", borderRadius: "8px" } }} />
        )}
    </Box>
);

const StatusPill = ({ status }) => {
    let bg, color, icon;
    if (status === "Available") { bg = T.successLight; color = T.success; icon = <CheckCircle sx={{ fontSize: 14, mr: 0.5 }} />; }
    else if (status === "Busy") { bg = T.warningLight; color = T.warning; icon = <Schedule sx={{ fontSize: 14, mr: 0.5 }} />; }
    else { bg = T.bg; color = T.textSub; icon = <Build sx={{ fontSize: 14, mr: 0.5 }} />; }

    return (
        <Box sx={{ display: "inline-flex", alignItems: "center", px: 1.2, py: 0.4, borderRadius: "6px", bgcolor: bg, color: color, fontFamily: fontBody, fontSize: "0.75rem", fontWeight: 700 }}>
            {icon} {status}
        </Box>
    );
};

const StatCard = ({ label, value, color, bgLight, icon: Icon }) => (
    <Card className="fade-up" sx={{ p: 2.5, borderRadius: "14px", border: `1px solid ${T.border}`, background: T.surface, boxShadow: "0 1px 4px rgba(0,0,0,0.04)", height: "100%" }}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
            <Box>
                <Typography sx={{ fontFamily: fontBody, fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: T.textMute, mb: 0.5 }}>{label}</Typography>
                <Typography sx={{ fontFamily: fontMono, fontWeight: 700, fontSize: "1.8rem", color: T.text, lineHeight: 1.1 }}>{value}</Typography>
            </Box>
            <Box sx={{ p: 1.2, borderRadius: "10px", bgcolor: bgLight, color: color }}><Icon sx={{ fontSize: 22 }} /></Box>
        </Box>
    </Card>
);

const initialStaff = [
    { id: "STF-001", name: "Ramesh K.", specialty: "General", status: "Busy", activeOrders: 3, phone: "+91 98765 43210", email: "ramesh.k@example.com", location: "Main Campus" },
    { id: "STF-002", name: "Suresh B.", specialty: "Electrician", status: "Busy", activeOrders: 2, phone: "+91 98765 43211", email: "suresh.b@example.com", location: "North Wing" },
    { id: "STF-003", name: "Plumbing Team A", specialty: "Plumber", status: "Available", activeOrders: 0, phone: "+91 98765 43212", email: "plumbing.a@example.com", location: "Hostel Block" },
    { id: "STF-004", name: "IT Support Desk", specialty: "IT Support", status: "Busy", activeOrders: 5, phone: "+91 98765 43213", email: "it.support@example.com", location: "Library Building" },
    { id: "STF-005", name: "HVAC Team", specialty: "HVAC", status: "Available", activeOrders: 1, phone: "+91 98765 43214", email: "hvac@example.com", location: "Main Campus" },
    { id: "STF-006", name: "Rajesh M.", specialty: "Carpenter", status: "Off-Duty", activeOrders: 0, phone: "+91 98765 43215", email: "rajesh.m@example.com", location: "Workshop" }
];

export default function StaffAssignment() {
    const [searchTerm, setSearchTerm] = useState("");
    const [staff, setStaff] = useState(initialStaff);
    const [modal, setModal] = useState({ open: false, mode: "create", data: {} });

    const handleSave = () => {
        if (modal.mode === "create") {
            const newStaff = {
                id: `STF-${(staff.length + 1).toString().padStart(3, '0')}`,
                name: modal.data.name || "Unnamed Staff",
                specialty: modal.data.specialty || "General",
                status: modal.data.status || "Available",
                activeOrders: Number(modal.data.activeOrders) || 0,
                phone: modal.data.phone || "N/A",
                email: modal.data.email || "N/A",
                location: modal.data.location || "Main Campus"
            };
            setStaff([...staff, newStaff]);
        } else {
            setStaff(staff.map(s => s.id === modal.data.id ? { ...s, ...modal.data, activeOrders: Number(modal.data.activeOrders) || 0 } : s));
        }
        setModal({ ...modal, open: false });
    };

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to remove this staff member?")) {
            setStaff(staff.filter(s => s.id !== id));
        }
    };

    const filteredStaff = staff.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Box sx={{ p: 3, background: T.bg, minHeight: "100vh", fontFamily: fontBody }}>
            <Fonts />

            {/* ── Header ── */}
            <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3} className="fade-up">
                <Box>
                    <Typography sx={{ fontFamily: fontBody, fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: T.textMute, mb: 0.3 }}>Maintenance Management</Typography>
                    <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1.5rem", color: T.text, lineHeight: 1.1 }}>Staff Assignment</Typography>
                    <Typography sx={{ fontFamily: fontBody, fontSize: "0.82rem", color: T.textSub, mt: 0.4 }}>Manage maintenance staff, their specialties, and current workload.</Typography>
                </Box>
                <Button variant="contained" startIcon={<Add sx={{ fontSize: 16 }} />} onClick={() => setModal({ open: true, mode: "create", data: { status: "Available", specialty: "General", activeOrders: 0 } })} sx={{ fontFamily: fontBody, fontWeight: 700, fontSize: "0.8rem", textTransform: "none", borderRadius: "8px", bgcolor: T.accent, boxShadow: "none" }}>Add Staff</Button>
            </Box>

            {/* ── Stat Cards ── */}
            <Grid container spacing={3} mb={3}>
                <Grid item xs={12} sm={6} md={3}><StatCard label="Total Staff" value={staff.length} color={T.accent} bgLight={T.accentLight} icon={People} /></Grid>
                <Grid item xs={12} sm={6} md={3}><StatCard label="Available" value={staff.filter(s => s.status === 'Available').length} color={T.success} bgLight={T.successLight} icon={CheckCircle} /></Grid>
                <Grid item xs={12} sm={6} md={3}><StatCard label="Busy" value={staff.filter(s => s.status === 'Busy').length} color={T.warning} bgLight={T.warningLight} icon={Schedule} /></Grid>
                <Grid item xs={12} sm={6} md={3}><StatCard label="Active Orders" value={staff.reduce((acc, s) => acc + s.activeOrders, 0)} color={T.info} bgLight={T.infoLight} icon={Build} /></Grid>
            </Grid>

            {/* ── Table Container ── */}
            <Card sx={{ borderRadius: "14px", border: `1px solid ${T.border}`, boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }} className="fade-up">
                <Box sx={{ p: 2.5, borderBottom: `1px solid ${T.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
                    <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1.1rem" }}>Staff Directory</Typography>
                    <Box display="flex" gap={1.5}>
                        <TextField size="small" placeholder="Search staff..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} InputProps={{ startAdornment: <InputAdornment position="start"><Search sx={{ fontSize: 16, color: T.textMute }} /></InputAdornment> }} sx={{ width: 260, "& .MuiOutlinedInput-root": { borderRadius: "8px", fontFamily: fontBody, fontSize: "0.8rem" } }} />
                        <Button variant="outlined" sx={{ minWidth: 0, p: 1, borderRadius: "8px", borderColor: T.border, color: T.textSub }}><FilterList sx={{ fontSize: 18 }} /></Button>
                    </Box>
                </Box>
                <Box sx={{ overflowX: "auto" }}>
                    <Table>
                        <TableHead><TableRow sx={{ bgcolor: "#F9FAFB" }}>
                            {["Staff Info", "Specialty", "Contact", "Location", "Active Orders", "Status", "Actions"].map(h => <TableCell key={h} sx={{ fontFamily: fontBody, fontWeight: 700, fontSize: "0.72rem", color: T.textMute, textTransform: "uppercase", py: 1.5, ...(h === "Active Orders" ? { textAlign: "center" } : h === "Actions" ? { textAlign: "right" } : {}) }}>{h}</TableCell>)}
                        </TableRow></TableHead>
                        <TableBody>
                            {filteredStaff.map(row => (
                                <TableRow key={row.id} className="row-hover">
                                    <TableCell>
                                        <Typography sx={{ fontFamily: fontBody, fontWeight: 700, fontSize: "0.9rem", color: T.text }}>{row.name}</Typography>
                                        <Typography sx={{ fontFamily: fontMono, fontSize: "0.75rem", color: T.textSub }}>{row.id}</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Box sx={{ display: "inline-block", px: 1, py: 0.3, borderRadius: "4px", border: `1px solid ${T.border}`, fontFamily: fontBody, fontSize: "0.75rem", fontWeight: 600, color: T.textSub }}>{row.specialty}</Box>
                                    </TableCell>
                                    <TableCell>
                                        <Box display="flex" alignItems="center" gap={1} mb={0.5}><Phone sx={{ fontSize: 14, color: T.textMute }} /><Typography sx={{ fontFamily: fontBody, fontSize: "0.8rem", color: T.textSub }}>{row.phone}</Typography></Box>
                                        <Box display="flex" alignItems="center" gap={1}><Email sx={{ fontSize: 14, color: T.textMute }} /><Typography sx={{ fontFamily: fontBody, fontSize: "0.8rem", color: T.textSub }}>{row.email}</Typography></Box>
                                    </TableCell>
                                    <TableCell>
                                        <Box display="flex" alignItems="center" gap={1}><LocationOn sx={{ fontSize: 16, color: T.textMute }} /><Typography sx={{ fontFamily: fontBody, fontSize: "0.8rem", color: T.text, fontWeight: 600 }}>{row.location}</Typography></Box>
                                    </TableCell>
                                    <TableCell sx={{ textAlign: "center" }}>
                                        <Box sx={{ display: "inline-block", px: 1.5, py: 0.5, borderRadius: "6px", bgcolor: T.bg, fontFamily: fontMono, fontWeight: 700, fontSize: "0.8rem" }}>{row.activeOrders}</Box>
                                    </TableCell>
                                    <TableCell><StatusPill status={row.status} /></TableCell>
                                    <TableCell sx={{ textAlign: "right", py: 1 }}>
                                        <IconButton size="small" onClick={() => setModal({ open: true, mode: "edit", data: row })} sx={{ color: T.textMute }}><Edit sx={{ fontSize: 16 }} /></IconButton>
                                        <IconButton size="small" onClick={() => handleDelete(row.id)} sx={{ color: T.danger }}><DeleteOutline sx={{ fontSize: 16 }} /></IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Box>
            </Card>

            {/* ── Dialog ── */}
            <Dialog open={modal.open} onClose={() => setModal({ ...modal, open: false })} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: "16px", p: 1 } }}>
                <DialogTitle sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1.2rem", pb: 1 }}>
                    {modal.mode === "create" ? "Add Staff Member" : "Edit Staff Member"}
                </DialogTitle>
                <DialogContent sx={{ pb: 1, mt: 1 }}>
                    <Box display="flex" gap={2}>
                        <Box flex={1}><DInput label="Full Name / Team Name" value={modal.data.name || ""} onChange={(e) => setModal({ ...modal, data: { ...modal.data, name: e.target.value } })} /></Box>
                        <Box flex={1}><DInput label="Specialty" options={["General", "Electrician", "Plumber", "HVAC", "IT Support", "Carpenter"]} value={modal.data.specialty || "General"} onChange={(e) => setModal({ ...modal, data: { ...modal.data, specialty: e.target.value } })} /></Box>
                    </Box>
                    <Box display="flex" gap={2}>
                        <Box flex={1}><DInput label="Phone Number" value={modal.data.phone || ""} onChange={(e) => setModal({ ...modal, data: { ...modal.data, phone: e.target.value } })} /></Box>
                        <Box flex={1}><DInput label="Email Address" type="email" value={modal.data.email || ""} onChange={(e) => setModal({ ...modal, data: { ...modal.data, email: e.target.value } })} /></Box>
                    </Box>
                    <DInput label="Base Location" value={modal.data.location || ""} onChange={(e) => setModal({ ...modal, data: { ...modal.data, location: e.target.value } })} />
                    <Box display="flex" gap={2}>
                        <Box flex={1}><DInput label="Active Orders" type="number" value={modal.data.activeOrders || 0} onChange={(e) => setModal({ ...modal, data: { ...modal.data, activeOrders: e.target.value } })} /></Box>
                        <Box flex={1}><DInput label="Status" options={["Available", "Busy", "Off-Duty"]} value={modal.data.status || "Available"} onChange={(e) => setModal({ ...modal, data: { ...modal.data, status: e.target.value } })} /></Box>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 3 }}>
                    <Button onClick={() => setModal({ ...modal, open: false })} sx={{ fontFamily: fontBody, fontWeight: 600, color: T.textSub, textTransform: "none" }}>Cancel</Button>
                    <Button onClick={handleSave} variant="contained" sx={{ fontFamily: fontBody, fontWeight: 600, bgcolor: T.accent, textTransform: "none", borderRadius: "8px", boxShadow: "none" }}>{modal.mode === "create" ? "Add Staff" : "Save Changes"}</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
