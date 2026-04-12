import React, { useState } from "react";
import {
    Box, Card, CardContent, Typography, Button, TextField, InputAdornment, Dialog, DialogTitle, DialogContent, DialogActions, Select, MenuItem, IconButton
} from "@mui/material";
import {
    Search, FilterList, Add, ErrorOutline, Person, Schedule, CheckCircle, Edit, DeleteOutline, Place, MoreHoriz, ChevronRight, ChevronLeft
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
    .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
    .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: #E4E8EF; border-radius: 4px; }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #CBD5E1; }
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
            <TextField fullWidth type={type} size="small" placeholder={placeholder} value={value} onChange={onChange} multiline={type === "textarea"} rows={type === "textarea" ? 3 : 1} InputProps={{ sx: { fontFamily: fontBody, fontSize: "0.85rem", borderRadius: "8px" } }} />
        )}
    </Box>
);

const initialTickets = [
    { id: "REQ-1024", title: "AC not cooling", category: "Classroom", location: "CR-101", priority: "High", technician: "Unassigned", status: "New", date: "Oct 24, 2023", description: "The AC unit in CR-101 is blowing warm air." },
    { id: "REQ-1025", title: "Broken chair", category: "Lab", location: "Computer Lab 3", priority: "Low", technician: "Ramesh K.", status: "Assigned", date: "Oct 24, 2023", description: "One of the swivel chairs is broken at the base." },
    { id: "REQ-1026", title: "Projector bulb fused", category: "Classroom", location: "Auditorium", priority: "Critical", technician: "Suresh B.", status: "In Progress", date: "Oct 23, 2023", description: "Main projector bulb needs replacement before the event tomorrow." },
    { id: "REQ-1027", title: "Water leak in washroom", category: "Hostel", location: "Boys Hostel B, 2nd Floor", priority: "High", technician: "Plumbing Team", status: "Completed", date: "Oct 22, 2023", description: "Continuous water leak from the sink pipe." },
    { id: "REQ-1028", title: "Bus engine noise", category: "Transport", location: "Bus KA-01-AB-1234", priority: "Medium", technician: "Mechanic Team", status: "New", date: "Oct 25, 2023", description: "Strange rattling noise from the engine compartment." },
    { id: "REQ-1029", title: "Network switch offline", category: "Lab", location: "Networking Lab", priority: "Critical", technician: "IT Support", status: "In Progress", date: "Oct 25, 2023", description: "Main switch for row 3 is completely unresponsive." },
];

export default function MaintenanceRequests() {
    const [searchTerm, setSearchTerm] = useState("");
    const [tickets, setTickets] = useState(initialTickets);
    const [modal, setModal] = useState({ open: false, mode: "create", data: {} });

    const handleSave = () => {
        if (modal.mode === "create") {
            const newTicket = {
                id: `REQ-${1030 + tickets.length}`,
                title: modal.data.title || "Untitled Issue",
                category: modal.data.category || "Classroom",
                location: modal.data.location || "Unknown",
                priority: modal.data.priority || "Medium",
                technician: modal.data.technician || "Unassigned",
                status: modal.data.status || "New",
                date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                description: modal.data.description || ""
            };
            setTickets([...tickets, newTicket]);
        } else {
            setTickets(tickets.map(t => t.id === modal.data.id ? { ...t, ...modal.data } : t));
        }
        setModal({ open: false, mode: "create", data: {} });
    };

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this ticket?")) {
            setTickets(tickets.filter(t => t.id !== id));
        }
    };

    const moveTicket = (id, newStatus) => {
        setTickets(tickets.map(t => t.id === id ? { ...t, status: newStatus } : t));
    };

    const columns = [
        { id: "New", label: "New Requests", icon: ErrorOutline, color: T.info },
        { id: "Assigned", label: "Assigned", icon: Person, color: T.warning },
        { id: "In Progress", label: "In Progress", icon: Schedule, color: T.purple },
        { id: "Completed", label: "Completed", icon: CheckCircle, color: T.success },
    ];

    const filteredTickets = tickets.filter(t =>
        t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.location.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Box sx={{ p: 3, background: T.bg, minHeight: "100vh", fontFamily: fontBody }}>
            <Fonts />

            {/* ── Header ── */}
            <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3} className="fade-up">
                <Box>
                    <Typography sx={{ fontFamily: fontBody, fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: T.textMute, mb: 0.3 }}>Maintenance Management</Typography>
                    <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1.5rem", color: T.text, lineHeight: 1.1 }}>Maintenance Requests</Typography>
                    <Typography sx={{ fontFamily: fontBody, fontSize: "0.82rem", color: T.textSub, mt: 0.4 }}>Report and track infrastructure issues across the campus.</Typography>
                </Box>
                <Button variant="contained" startIcon={<Add sx={{ fontSize: 16 }} />} onClick={() => setModal({ open: true, mode: "create", data: { status: "New", priority: "Medium", category: "Classroom" } })} sx={{ fontFamily: fontBody, fontWeight: 700, fontSize: "0.8rem", textTransform: "none", borderRadius: "8px", bgcolor: T.accent, boxShadow: "none" }}>Report Issue</Button>
            </Box>

            {/* ── Actions ── */}
            <Box display="flex" gap={1.5} mb={3} className="fade-up">
                <TextField size="small" placeholder="Search tickets by ID, title, or location..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} InputProps={{ startAdornment: <InputAdornment position="start"><Search sx={{ fontSize: 16, color: T.textMute }} /></InputAdornment> }} sx={{ width: 340, "& .MuiOutlinedInput-root": { borderRadius: "8px", fontFamily: fontBody, fontSize: "0.8rem", bgcolor: T.surface } }} />
                <Button variant="outlined" startIcon={<FilterList sx={{ fontSize: 18 }} />} sx={{ borderRadius: "8px", borderColor: T.border, color: T.textSub, fontFamily: fontBody, fontWeight: 600, textTransform: "none" }}>Filters</Button>
            </Box>

            {/* ── Kanban Board ── */}
            <Box display="flex" gap={3} sx={{ overflowX: "auto", pb: 2 }} className="custom-scrollbar fade-up">
                {columns.map((col, colIndex) => {
                    const colTickets = filteredTickets.filter(t => t.status === col.id);
                    return (
                        <Box key={col.id} sx={{ minWidth: 320, maxWidth: 320, flexShrink: 0, bgcolor: "rgba(228, 232, 239, 0.4)", borderRadius: "12px", border: `1px solid ${T.border}`, p: 2, display: "flex", flexDirection: "column", height: "calc(100vh - 220px)" }}>
                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                <Box display="flex" alignItems="center" gap={1}>
                                    <col.icon sx={{ fontSize: 18, color: col.color }} />
                                    <Typography sx={{ fontFamily: fontBody, fontWeight: 700, fontSize: "0.95rem", color: T.text }}>{col.label}</Typography>
                                </Box>
                                <Box sx={{ px: 1, py: 0.2, borderRadius: "10px", bgcolor: T.surface, border: `1px solid ${T.border}`, fontFamily: fontMono, fontSize: "0.75rem", fontWeight: 700 }}>
                                    {colTickets.length}
                                </Box>
                            </Box>

                            <Box sx={{ flex: 1, overflowY: "auto", pr: 0.5, display: "flex", flexDirection: "column", gap: 1.5 }} className="custom-scrollbar">
                                {colTickets.map(ticket => (
                                    <Card key={ticket.id} sx={{ borderRadius: "10px", border: `1px solid ${T.border}`, boxShadow: "0 1px 2px rgba(0,0,0,0.02)", "&:hover": { borderColor: T.accent, boxShadow: "0 4px 12px rgba(99, 102, 241, 0.08)" }, transition: "all 0.2s" }}>
                                        <CardContent sx={{ p: "16px !important" }}>
                                            <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
                                                <Box sx={{ px: 1, py: 0.2, borderRadius: "4px", border: `1px solid ${T.border}`, fontFamily: fontMono, fontSize: "0.7rem", color: T.textSub }}>{ticket.id}</Box>
                                                <Box display="flex" alignItems="center" gap={1}>
                                                    <Box sx={{
                                                        px: 1, py: 0.2, borderRadius: "4px", fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase",
                                                        bgcolor: ticket.priority === "Critical" ? T.dangerLight : ticket.priority === "High" ? T.warningLight : ticket.priority === "Medium" ? T.bg : T.bg,
                                                        color: ticket.priority === "Critical" ? T.danger : ticket.priority === "High" ? T.warning : T.textSub
                                                    }}>
                                                        {ticket.priority}
                                                    </Box>
                                                    <IconButton size="small" onClick={() => setModal({ open: true, mode: "edit", data: ticket })} sx={{ p: 0.2 }}><Edit sx={{ fontSize: 14, color: T.textMute }} /></IconButton>
                                                </Box>
                                            </Box>

                                            <Typography sx={{ fontFamily: fontBody, fontWeight: 700, fontSize: "0.85rem", color: T.text, mb: 1.5, lineHeight: 1.3 }}>{ticket.title}</Typography>

                                            <Box sx={{ display: "flex", flexDirection: "column", gap: 0.8, mb: 2 }}>
                                                <Box display="flex" alignItems="center" gap={0.8}>
                                                    <Place sx={{ fontSize: 13, color: T.textMute }} />
                                                    <Typography sx={{ fontFamily: fontBody, fontSize: "0.75rem", color: T.textSub }} noWrap>{ticket.location}</Typography>
                                                </Box>
                                                <Box display="flex" alignItems="center" gap={0.8}>
                                                    <Person sx={{ fontSize: 13, color: T.textMute }} />
                                                    <Typography sx={{ fontFamily: fontBody, fontSize: "0.75rem", color: T.textSub }} noWrap>{ticket.technician}</Typography>
                                                </Box>
                                            </Box>

                                            <Box display="flex" justifyContent="space-between" alignItems="center" pt={1.5} sx={{ borderTop: `1px solid ${T.border}` }}>
                                                <Typography sx={{ fontFamily: fontBody, fontSize: "0.7rem", fontWeight: 700, color: T.textSub, bgcolor: T.bg, px: 1, py: 0.3, borderRadius: "4px" }}>{ticket.category}</Typography>
                                                <Box display="flex" gap={0.5}>
                                                    {colIndex > 0 && (
                                                        <IconButton size="small" onClick={() => moveTicket(ticket.id, columns[colIndex - 1].id)} sx={{ p: 0.5, bgcolor: T.bg }}><ChevronLeft sx={{ fontSize: 14 }} /></IconButton>
                                                    )}
                                                    {colIndex < columns.length - 1 && (
                                                        <IconButton size="small" onClick={() => moveTicket(ticket.id, columns[colIndex + 1].id)} sx={{ p: 0.5, bgcolor: T.bg }}><ChevronRight sx={{ fontSize: 14 }} /></IconButton>
                                                    )}
                                                </Box>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                ))}
                                {colTickets.length === 0 && (
                                    <Box sx={{ height: 80, border: `2px dashed ${T.border}`, borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        <Typography sx={{ fontFamily: fontBody, fontSize: "0.8rem", color: T.textMute }}>No tickets</Typography>
                                    </Box>
                                )}
                            </Box>
                        </Box>
                    );
                })}
            </Box>

            {/* ── Dialog ── */}
            <Dialog open={modal.open} onClose={() => setModal({ ...modal, open: false })} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: "16px", p: 1 } }}>
                <DialogTitle sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1.2rem", pb: 1 }}>
                    {modal.mode === "create" ? "Report Maintenance Issue" : "Edit Maintenance Issue"}
                    <Typography sx={{ fontFamily: fontBody, fontSize: "0.8rem", color: T.textMute, mt: 0.5 }}>
                        {modal.mode === "create" ? "Submit a new ticket for infrastructure repair or maintenance." : "Update the details of this maintenance ticket."}
                    </Typography>
                </DialogTitle>
                <DialogContent sx={{ pb: 1, mt: 1 }}>
                    <DInput label="Issue Title" placeholder="Brief description of the problem" value={modal.data.title || ""} onChange={(e) => setModal({ ...modal, data: { ...modal.data, title: e.target.value } })} />
                    <Box display="flex" gap={2}>
                        <Box flex={1}><DInput label="Category" options={["Classroom", "Lab", "Hostel", "Transport"]} value={modal.data.category || "Classroom"} onChange={(e) => setModal({ ...modal, data: { ...modal.data, category: e.target.value } })} /></Box>
                        <Box flex={1}><DInput label="Priority" options={["Low", "Medium", "High", "Critical"]} value={modal.data.priority || "Medium"} onChange={(e) => setModal({ ...modal, data: { ...modal.data, priority: e.target.value } })} /></Box>
                    </Box>
                    <DInput label="Specific Location" placeholder="e.g. CR-101, Boys Hostel B Room 205" value={modal.data.location || ""} onChange={(e) => setModal({ ...modal, data: { ...modal.data, location: e.target.value } })} />
                    <DInput label="Detailed Description" type="textarea" placeholder="Provide more details about the issue..." value={modal.data.description || ""} onChange={(e) => setModal({ ...modal, data: { ...modal.data, description: e.target.value } })} />
                    <DInput label="Assign Technician/Team" placeholder="Leave blank for auto-assignment" value={modal.data.technician || ""} onChange={(e) => setModal({ ...modal, data: { ...modal.data, technician: e.target.value } })} />

                    {modal.mode === "edit" && (
                        <Box display="flex" gap={2}>
                            <Box flex={1}><DInput label="Status" options={["New", "Assigned", "In Progress", "Completed"]} value={modal.data.status || "New"} onChange={(e) => setModal({ ...modal, data: { ...modal.data, status: e.target.value } })} /></Box>
                            <Box flex={1} display="flex" alignItems="flex-end" pb={2}>
                                <Button variant="text" color="error" startIcon={<DeleteOutline />} onClick={() => { handleDelete(modal.data.id); setModal({ ...modal, open: false }) }} sx={{ textTransform: "none", fontFamily: fontBody, fontWeight: 700 }}>Delete Ticket</Button>
                            </Box>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 3 }}>
                    <Button onClick={() => setModal({ ...modal, open: false })} sx={{ fontFamily: fontBody, fontWeight: 600, color: T.textSub, textTransform: "none" }}>Cancel</Button>
                    <Button onClick={handleSave} variant="contained" sx={{ fontFamily: fontBody, fontWeight: 600, bgcolor: T.accent, textTransform: "none", borderRadius: "8px", boxShadow: "none" }}>{modal.mode === "create" ? "Submit Ticket" : "Save Changes"}</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
