import React, { useState } from "react";
import {
    Box, Card, Grid, Typography, Button, TextField, Table, TableBody, TableCell, TableHead, TableRow,
    IconButton, InputAdornment, Dialog, DialogTitle, DialogContent, DialogActions, Select, MenuItem
} from "@mui/material";
import {
    Search, FilterList, Add, EventNote, Schedule, PauseCircleFilled, CheckCircle, Edit, DeleteOutline, Person, Place, CurrencyRupee
} from "@mui/icons-material";

/* ── Design Tokens ── */
const T = {
    bg: "#F5F7FA", surface: "#FFFFFF", border: "#E4E8EF", text: "#111827", textSub: "#4B5563", textMute: "#9CA3AF",
    accent: "#6366F1", accentLight: "#EEF2FF", success: "#10B981", successLight: "#ECFDF5",
    warning: "#F59E0B", warningLight: "#FFFBEB", danger: "#EF4444", dangerLight: "#FEF2F2",
    info: "#3B82F6", infoLight: "#EFF6FF", purple: "#8B5CF6", purpleLight: "#F5F3FF",
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
    let bg, color;
    if (status === "Scheduled") { bg = T.infoLight; color = T.info; }
    else if (status === "In Progress") { bg = T.purpleLight; color = T.purple; }
    else if (status === "On Hold") { bg = T.warningLight; color = T.warning; }
    else if (status === "Completed") { bg = T.successLight; color = T.success; }
    else { bg = T.bg; color = T.textSub; }

    return (
        <Box sx={{ display: "inline-flex", alignItems: "center", px: 1.2, py: 0.4, borderRadius: "6px", bgcolor: bg, color: color, fontFamily: fontBody, fontSize: "0.75rem", fontWeight: 700 }}>
            {status}
        </Box>
    );
};

const PriorityPill = ({ priority }) => {
    let bg, color;
    if (priority === "Critical") { bg = T.dangerLight; color = T.danger; }
    else if (priority === "High") { bg = T.warningLight; color = T.warning; }
    else if (priority === "Medium") { bg = T.bg; color = T.textSub; }
    else { bg = T.bg; color = T.textSub; }

    return (
        <Box sx={{ display: "inline-flex", alignItems: "center", px: 1, py: 0.2, borderRadius: "4px", border: `1px solid ${color || T.border}`, color: color || T.textSub, fontFamily: fontBody, fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase" }}>
            {priority}
        </Box>
    );
}

const StatCard = ({ label, value, color, bgLight, icon: Icon }) => (
    <Card className="fade-up" sx={{ p: 2.5, borderRadius: "14px", border: `1px solid ${T.border}`, background: T.surface, boxShadow: "0 1px 4px rgba(0,0,0,0.04)", height: "100%" }}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
            <Box>
                <Typography sx={{ fontFamily: fontBody, fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: T.textMute, mb: 0.5 }}>{label}</Typography>
                <Typography sx={{ fontFamily: fontMono, fontWeight: 700, fontSize: "1.8rem", color: color || T.text, lineHeight: 1.1 }}>{value}</Typography>
            </Box>
            <Box sx={{ p: 1.2, borderRadius: "10px", bgcolor: bgLight, color: color }}><Icon sx={{ fontSize: 22 }} /></Box>
        </Box>
    </Card>
);

const initialWorkOrders = [
    { id: "WO-2023-001", requestId: "REQ-1024", title: "AC Repair & Servicing", assignedTo: "HVAC Team", status: "Scheduled", scheduledDate: "2023-10-26", estimatedCost: 150, priority: "High", location: "CR-101" },
    { id: "WO-2023-002", requestId: "REQ-1026", title: "Projector Bulb Replacement", assignedTo: "Suresh B.", status: "In Progress", scheduledDate: "2023-10-25", estimatedCost: 200, priority: "Critical", location: "Auditorium" },
    { id: "WO-2023-003", requestId: "REQ-1027", title: "Washroom Pipe Fixing", assignedTo: "Plumbing Team", status: "Completed", scheduledDate: "2023-10-23", estimatedCost: 50, priority: "Medium", location: "Boys Hostel B" },
    { id: "WO-2023-004", requestId: "REQ-1029", title: "Network Switch Replacement", assignedTo: "IT Support", status: "On Hold", scheduledDate: "2023-10-27", estimatedCost: 450, priority: "Critical", location: "Networking Lab" }
];

export default function WorkOrders() {
    const [searchTerm, setSearchTerm] = useState("");
    const [workOrders, setWorkOrders] = useState(initialWorkOrders);
    const [modal, setModal] = useState({ open: false, mode: "create", data: {} });

    const handleSave = () => {
        if (modal.mode === "create") {
            const newWO = {
                id: `WO-2023-${(workOrders.length + 1).toString().padStart(3, '0')}`,
                requestId: modal.data.requestId || "N/A",
                title: modal.data.title || "Untitled Work Order",
                assignedTo: modal.data.assignedTo || "Unassigned",
                status: modal.data.status || "Scheduled",
                scheduledDate: modal.data.scheduledDate || new Date().toISOString().split('T')[0],
                estimatedCost: Number(modal.data.estimatedCost) || 0,
                priority: modal.data.priority || "Medium",
                location: modal.data.location || "Unknown"
            };
            setWorkOrders([...workOrders, newWO]);
        } else {
            setWorkOrders(workOrders.map(wo => wo.id === modal.data.id ? { ...wo, ...modal.data, estimatedCost: Number(modal.data.estimatedCost) } : wo));
        }
        setModal({ ...modal, open: false });
    };

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this work order?")) {
            setWorkOrders(workOrders.filter(wo => wo.id !== id));
        }
    };

    const filteredWorkOrders = workOrders.filter(wo =>
        wo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        wo.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        wo.assignedTo.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Box sx={{ p: 3, background: T.bg, minHeight: "100vh", fontFamily: fontBody }}>
            <Fonts />

            {/* ── Header ── */}
            <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3} className="fade-up">
                <Box>
                    <Typography sx={{ fontFamily: fontBody, fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: T.textMute, mb: 0.3 }}>Maintenance Management</Typography>
                    <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1.5rem", color: T.text, lineHeight: 1.1 }}>Work Orders</Typography>
                    <Typography sx={{ fontFamily: fontBody, fontSize: "0.82rem", color: T.textSub, mt: 0.4 }}>Manage and track maintenance work orders and their costs.</Typography>
                </Box>
                <Button variant="contained" startIcon={<Add sx={{ fontSize: 16 }} />} onClick={() => setModal({ open: true, mode: "create", data: { status: "Scheduled", priority: "Medium", estimatedCost: 0 } })} sx={{ fontFamily: fontBody, fontWeight: 700, fontSize: "0.8rem", textTransform: "none", borderRadius: "8px", bgcolor: T.accent, boxShadow: "none" }}>Create Work Order</Button>
            </Box>

            {/* ── Stat Cards ── */}
            <Grid container spacing={3} mb={3}>
                <Grid item xs={12} sm={6} md={3}><StatCard label="Scheduled" value={workOrders.filter(w => w.status === 'Scheduled').length} color={T.info} bgLight={T.infoLight} icon={EventNote} /></Grid>
                <Grid item xs={12} sm={6} md={3}><StatCard label="In Progress" value={workOrders.filter(w => w.status === 'In Progress').length} color={T.purple} bgLight={T.purpleLight} icon={Schedule} /></Grid>
                <Grid item xs={12} sm={6} md={3}><StatCard label="On Hold" value={workOrders.filter(w => w.status === 'On Hold').length} color={T.warning} bgLight={T.warningLight} icon={PauseCircleFilled} /></Grid>
                <Grid item xs={12} sm={6} md={3}><StatCard label="Completed" value={workOrders.filter(w => w.status === 'Completed').length} color={T.success} bgLight={T.successLight} icon={CheckCircle} /></Grid>
            </Grid>

            {/* ── Table Container ── */}
            <Card sx={{ borderRadius: "14px", border: `1px solid ${T.border}`, boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }} className="fade-up">
                <Box sx={{ p: 2.5, borderBottom: `1px solid ${T.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
                    <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1.1rem" }}>All Work Orders</Typography>
                    <Box display="flex" gap={1.5}>
                        <TextField size="small" placeholder="Search work orders..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} InputProps={{ startAdornment: <InputAdornment position="start"><Search sx={{ fontSize: 16, color: T.textMute }} /></InputAdornment> }} sx={{ width: 260, "& .MuiOutlinedInput-root": { borderRadius: "8px", fontFamily: fontBody, fontSize: "0.8rem" } }} />
                        <Button variant="outlined" sx={{ minWidth: 0, p: 1, borderRadius: "8px", borderColor: T.border, color: T.textSub }}><FilterList sx={{ fontSize: 18 }} /></Button>
                    </Box>
                </Box>
                <Box sx={{ overflowX: "auto" }}>
                    <Table>
                        <TableHead><TableRow sx={{ bgcolor: "#F9FAFB" }}>
                            {["Work Order ID", "Title & Location", "Assigned To", "Schedule", "Priority", "Est. Cost", "Status", "Actions"].map(h => <TableCell key={h} sx={{ fontFamily: fontBody, fontWeight: 700, fontSize: "0.72rem", color: T.textMute, textTransform: "uppercase", py: 1.5, ...(h === "Actions" ? { textAlign: "right" } : {}) }}>{h}</TableCell>)}
                        </TableRow></TableHead>
                        <TableBody>
                            {filteredWorkOrders.map(row => (
                                <TableRow key={row.id} className="row-hover">
                                    <TableCell>
                                        <Typography sx={{ fontFamily: fontMono, fontWeight: 700, fontSize: "0.8rem", color: T.text }}>{row.id}</Typography>
                                        <Typography sx={{ fontFamily: fontMono, fontSize: "0.7rem", color: T.textSub }}>Ref: {row.requestId}</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography sx={{ fontFamily: fontBody, fontWeight: 700, fontSize: "0.9rem", color: T.text }}>{row.title}</Typography>
                                        <Box display="flex" alignItems="center" gap={0.5} mt={0.5}><Place sx={{ fontSize: 13, color: T.textMute }} /><Typography sx={{ fontFamily: fontBody, fontSize: "0.75rem", color: T.textSub }}>{row.location}</Typography></Box>
                                    </TableCell>
                                    <TableCell>
                                        <Box display="flex" alignItems="center" gap={1}><Person sx={{ fontSize: 16, color: T.textMute }} /><Typography sx={{ fontFamily: fontBody, fontSize: "0.85rem", color: T.textSub }}>{row.assignedTo}</Typography></Box>
                                    </TableCell>
                                    <TableCell>
                                        <Box display="flex" alignItems="center" gap={1}><EventNote sx={{ fontSize: 16, color: T.textMute }} /><Typography sx={{ fontFamily: fontMono, fontSize: "0.8rem", color: T.textSub }}>{row.scheduledDate}</Typography></Box>
                                    </TableCell>
                                    <TableCell><PriorityPill priority={row.priority} /></TableCell>
                                    <TableCell>
                                        <Box display="flex" alignItems="center" gap={0.5}><CurrencyRupee sx={{ fontSize: 13, color: T.textMute }} /><Typography sx={{ fontFamily: fontMono, fontWeight: 700, fontSize: "0.85rem", color: T.text }}>{row.estimatedCost}</Typography></Box>
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
                    {modal.mode === "create" ? "Create Work Order" : "Edit Work Order"}
                </DialogTitle>
                <DialogContent sx={{ pb: 1, mt: 1 }}>
                    <Box display="flex" gap={2}>
                        <Box flex={1}><DInput label="Related Request ID" placeholder="e.g. REQ-1024" value={modal.data.requestId || ""} onChange={(e) => setModal({ ...modal, data: { ...modal.data, requestId: e.target.value } })} /></Box>
                        <Box flex={1}><DInput label="Priority" options={["Low", "Medium", "High", "Critical"]} value={modal.data.priority || "Medium"} onChange={(e) => setModal({ ...modal, data: { ...modal.data, priority: e.target.value } })} /></Box>
                    </Box>
                    <DInput label="Work Order Title" placeholder="Brief description" value={modal.data.title || ""} onChange={(e) => setModal({ ...modal, data: { ...modal.data, title: e.target.value } })} />
                    <DInput label="Location" placeholder="e.g. CR-101, Boys Hostel B" value={modal.data.location || ""} onChange={(e) => setModal({ ...modal, data: { ...modal.data, location: e.target.value } })} />
                    <Box display="flex" gap={2}>
                        <Box flex={1}><DInput label="Assigned To" placeholder="Technician or Team" value={modal.data.assignedTo || ""} onChange={(e) => setModal({ ...modal, data: { ...modal.data, assignedTo: e.target.value } })} /></Box>
                        <Box flex={1}><DInput label="Scheduled Date" type="date" value={modal.data.scheduledDate || ""} onChange={(e) => setModal({ ...modal, data: { ...modal.data, scheduledDate: e.target.value } })} /></Box>
                    </Box>
                    <Box display="flex" gap={2}>
                        <Box flex={1}><DInput label="Estimated Cost (₹)" type="number" placeholder="0" value={modal.data.estimatedCost || ""} onChange={(e) => setModal({ ...modal, data: { ...modal.data, estimatedCost: e.target.value } })} /></Box>
                        <Box flex={1}><DInput label="Status" options={["Scheduled", "In Progress", "On Hold", "Completed"]} value={modal.data.status || "Scheduled"} onChange={(e) => setModal({ ...modal, data: { ...modal.data, status: e.target.value } })} /></Box>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 3 }}>
                    <Button onClick={() => setModal({ ...modal, open: false })} sx={{ fontFamily: fontBody, fontWeight: 600, color: T.textSub, textTransform: "none" }}>Cancel</Button>
                    <Button onClick={handleSave} variant="contained" sx={{ fontFamily: fontBody, fontWeight: 600, bgcolor: T.accent, textTransform: "none", borderRadius: "8px", boxShadow: "none" }}>{modal.mode === "create" ? "Create Order" : "Save Changes"}</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
