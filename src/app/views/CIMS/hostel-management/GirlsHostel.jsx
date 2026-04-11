import React, { useState } from "react";
import {
    Box, Card, Grid, Typography, Button, TextField, MenuItem, Table, TableBody, TableCell, TableHead, TableRow,
    IconButton, InputAdornment, Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, Alert, Tabs, Tab
} from "@mui/material";
import {
    Search, FilterList, PersonAdd, DoorFront, People, Error, HowToReg, Edit, DeleteOutline, Close
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

const SLabel = ({ children, sx = {} }) => <Typography sx={{ fontFamily: fontBody, fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: T.textMute, mb: 0.5, ...sx }}>{children}</Typography>;
const DInput = ({ sx = {}, ...props }) => <TextField size="small" fullWidth {...props} sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px", fontFamily: fontBody, fontSize: "0.82rem", bgcolor: T.surface, "& fieldset": { borderColor: T.border }, "&.Mui-focused fieldset": { borderColor: T.accent } }, "& .MuiInputLabel-root.Mui-focused": { color: T.accent }, ...sx }} />;

const StatusPill = ({ status }) => {
    const map = {
        Occupied: { bg: T.successLight, color: T.success },
        Pending: { bg: T.warningLight, color: T.warning },
        Resolved: { bg: T.successLight, color: T.success },
        Open: { bg: T.warningLight, color: T.warning },
        High: { bg: T.dangerLight, color: T.danger },
        Medium: { bg: T.bg, color: T.textSub },
        Inside: { bg: T.warningLight, color: T.warning },
    };
    const s = map[status] || { bg: T.bg, color: T.textSub };
    return (
        <Box sx={{ px: 1.2, py: 0.4, borderRadius: "6px", bgcolor: s.bg, width: "fit-content", display: "inline-block" }}>
            <Typography sx={{ fontFamily: fontBody, fontSize: "0.7rem", fontWeight: 700, color: s.color }}>{status}</Typography>
        </Box>
    );
};

const StatCard = ({ label, value, sub, color, icon: Icon, bgLight }) => (
    <Card className="fade-up" sx={{ p: 2.5, borderRadius: "14px", border: `1px solid ${T.border}`, background: T.surface, boxShadow: "0 1px 4px rgba(0,0,0,0.04)", flex: 1 }}>
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

export default function GirlsHostel() {
    const [activeTab, setActiveTab] = useState("allocation");
    const [searchTerm, setSearchTerm] = useState("");

    const [allocations, setAllocations] = useState([
        { id: 1, studentName: "Priya Patel", roomNumber: "G-205", block: "Block G1", checkInDate: "2023-08-15", status: "Occupied" },
        { id: 2, studentName: "Neha Singh", roomNumber: "G-110", block: "Block G1", checkInDate: "2023-08-20", status: "Occupied" },
        { id: 3, studentName: "Anjali Desai", roomNumber: "G-301", block: "Block G2", checkInDate: "2023-09-01", status: "Pending" },
    ]);

    const students = [
        { id: 101, name: "Priya Patel", rollNo: "CS21045", course: "B.Tech CSE", room: "G-205", contact: "9876543210" },
        { id: 102, name: "Neha Singh", rollNo: "EC21012", course: "B.Tech ECE", room: "G-110", contact: "9876543211" },
    ];

    const [visitors, setVisitors] = useState([
        { id: 2, visitorName: "Sunita Kumar", relation: "Mother", studentName: "Neha Singh", date: "2023-10-16", inTime: "14:00", outTime: "" },
    ]);

    const complaints = [
        { id: "C-101", title: "Fan not working", room: "G-205", date: "2023-10-20", status: "Open", priority: "High" },
        { id: "C-102", title: "Leaking tap", room: "G-110", date: "2023-10-18", status: "Resolved", priority: "Medium" },
    ];

    // Modals
    const [allocModal, setAllocModal] = useState({ open: false, data: null });
    const [visitModal, setVisitModal] = useState({ open: false, data: null });
    const [snack, setSnack] = useState({ open: false, msg: "" });

    const toast = (msg) => setSnack({ open: true, msg });

    const handleSaveAllocation = () => {
        toast("Allocation saved successfully.");
        setAllocModal({ open: false, data: null });
    };
    const handleSaveVisitor = () => {
        toast("Visitor log saved successfully.");
        setVisitModal({ open: false, data: null });
    };

    const TabPanel = ({ value, id, children }) => (value === id ? <Box className="fade-up" mt={3}>{children}</Box> : null);

    return (
        <Box sx={{ p: 3, background: T.bg, minHeight: "100vh", fontFamily: fontBody }}>
            <Fonts />

            {/* ── Header ── */}
            <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3} className="fade-up">
                <Box>
                    <Typography sx={{ fontFamily: fontBody, fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: T.textMute, mb: 0.3 }}>Hostel Detail</Typography>
                    <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1.5rem", color: T.text, lineHeight: 1.1 }}>Girls Hostel Management</Typography>
                    <Typography sx={{ fontFamily: fontBody, fontSize: "0.82rem", color: T.textSub, mt: 0.4 }}>Manage room allocations, students, visitors, and complaints for girls hostels.</Typography>
                </Box>
                <Box display="flex" gap={1.5}>
                    {activeTab === "allocation" && <Button variant="contained" startIcon={<PersonAdd sx={{ fontSize: 16 }} />} onClick={() => setAllocModal({ open: true, data: { status: "Occupied" } })} sx={{ fontFamily: fontBody, fontWeight: 700, fontSize: "0.75rem", textTransform: "none", borderRadius: "8px", bgcolor: T.accent, boxShadow: "none" }}>Allocate Room</Button>}
                    {activeTab === "visitors" && <Button variant="contained" startIcon={<PersonAdd sx={{ fontSize: 16 }} />} onClick={() => setVisitModal({ open: true, data: {} })} sx={{ fontFamily: fontBody, fontWeight: 700, fontSize: "0.75rem", textTransform: "none", borderRadius: "8px", bgcolor: T.accent, boxShadow: "none" }}>Add Visitor</Button>}
                </Box>
            </Box>

            {/* ── Stat Cards ── */}
            <Grid container spacing={3} mb={3}>
                <Grid item xs={12} sm={6} md={3}><StatCard label="Total Capacity" value="500" sub={`Across 2 blocks`} color={T.accent} bgLight={T.accentLight} icon={People} /></Grid>
                <Grid item xs={12} sm={6} md={3}><StatCard label="Occupied" value="470" sub="Students currently residing" color={T.success} bgLight={T.successLight} icon={HowToReg} /></Grid>
                <Grid item xs={12} sm={6} md={3}><StatCard label="Vacant Rooms" value="30" sub="Available for allocation" color={T.info} bgLight={T.infoLight} icon={DoorFront} /></Grid>
                <Grid item xs={12} sm={6} md={3}><StatCard label="Active Complaints" value="12" sub="Requires attention" color={T.danger} bgLight={T.dangerLight} icon={Error} /></Grid>
            </Grid>

            {/* ── Tabs ── */}
            <Box sx={{ borderBottom: 1, borderColor: T.border }} className="fade-up">
                <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)} TabIndicatorProps={{ sx: { bgcolor: T.accent, height: 3, borderRadius: "3px 3px 0 0" } }} sx={{ "& .MuiTab-root": { fontFamily: fontBody, fontWeight: 600, fontSize: "0.82rem", textTransform: "none", color: T.textSub, minWidth: 120 }, "& .Mui-selected": { color: `${T.accent} !important` } }}>
                    <Tab label="Room Allocation" value="allocation" />
                    <Tab label="All Students" value="students" />
                    <Tab label="Visitors" value="visitors" />
                    <Tab label="Complaints" value="complaints" />
                </Tabs>
            </Box>

            {/* ── Allocation Tab ── */}
            <TabPanel value={activeTab} id="allocation">
                <Card sx={{ borderRadius: "14px", border: `1px solid ${T.border}`, boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                    <Box sx={{ p: 2.5, borderBottom: `1px solid ${T.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
                        <Box>
                            <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1.1rem" }}>Room Allocations</Typography>
                            <Typography sx={{ fontFamily: fontBody, fontSize: "0.78rem", color: T.textMute }}>Manage room assignments</Typography>
                        </Box>
                        <Box display="flex" gap={1.5}>
                            <TextField size="small" placeholder="Search students or rooms..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} InputProps={{ startAdornment: <InputAdornment position="start"><Search sx={{ fontSize: 16, color: T.textMute }} /></InputAdornment> }} sx={{ width: 260, "& .MuiOutlinedInput-root": { borderRadius: "8px", fontFamily: fontBody, fontSize: "0.8rem" } }} />
                            <Button variant="outlined" sx={{ minWidth: 0, p: 1, borderRadius: "8px", borderColor: T.border, color: T.textSub }}><FilterList sx={{ fontSize: 18 }} /></Button>
                        </Box>
                    </Box>
                    <Table>
                        <TableHead><TableRow sx={{ bgcolor: "#F9FAFB" }}>
                            {["Student Name", "Room Number", "Block", "Check-in Date", "Status", "Actions"].map(h => <TableCell key={h} sx={{ fontFamily: fontBody, fontWeight: 700, fontSize: "0.72rem", color: T.textMute, textTransform: "uppercase", py: 1.5, ...(h === "Actions" ? { textAlign: "right" } : {}) }}>{h}</TableCell>)}
                        </TableRow></TableHead>
                        <TableBody>
                            {allocations.filter(a => a.studentName.toLowerCase().includes(searchTerm.toLowerCase())).map(row => (
                                <TableRow key={row.id} className="row-hover">
                                    <TableCell sx={{ fontFamily: fontBody, fontWeight: 600, fontSize: "0.85rem", color: T.text }}>{row.studentName}</TableCell>
                                    <TableCell sx={{ fontFamily: fontMono, fontSize: "0.8rem", color: T.textSub }}>{row.roomNumber}</TableCell>
                                    <TableCell sx={{ fontFamily: fontBody, fontSize: "0.82rem", color: T.textSub }}>{row.block}</TableCell>
                                    <TableCell sx={{ fontFamily: fontBody, fontSize: "0.82rem", color: T.textSub }}>{row.checkInDate}</TableCell>
                                    <TableCell><StatusPill status={row.status} /></TableCell>
                                    <TableCell sx={{ textAlign: "right", py: 1 }}>
                                        <IconButton size="small" onClick={() => setAllocModal({ open: true, data: row })} sx={{ color: T.textMute }}><Edit sx={{ fontSize: 16 }} /></IconButton>
                                        <IconButton size="small" sx={{ color: T.danger }}><DeleteOutline sx={{ fontSize: 16 }} /></IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Card>
            </TabPanel>

            {/* ── Students Tab ── */}
            <TabPanel value={activeTab} id="students">
                <Card sx={{ borderRadius: "14px", border: `1px solid ${T.border}`, boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                    <Box sx={{ p: 2.5, borderBottom: `1px solid ${T.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Box><Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1.1rem" }}>All Students</Typography><Typography sx={{ fontFamily: fontBody, fontSize: "0.78rem", color: T.textMute }}>Directory of residing students</Typography></Box>
                        <TextField size="small" placeholder="Search students..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} InputProps={{ startAdornment: <InputAdornment position="start"><Search sx={{ fontSize: 16, color: T.textMute }} /></InputAdornment> }} sx={{ width: 260, "& .MuiOutlinedInput-root": { borderRadius: "8px", fontFamily: fontBody, fontSize: "0.8rem" } }} />
                    </Box>
                    <Table>
                        <TableHead><TableRow sx={{ bgcolor: "#F9FAFB" }}>
                            {["Roll No", "Student Name", "Course", "Room", "Contact"].map(h => <TableCell key={h} sx={{ fontFamily: fontBody, fontWeight: 700, fontSize: "0.72rem", color: T.textMute, textTransform: "uppercase", py: 1.5 }}>{h}</TableCell>)}
                        </TableRow></TableHead>
                        <TableBody>
                            {students.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase())).map(row => (
                                <TableRow key={row.id} className="row-hover">
                                    <TableCell sx={{ fontFamily: fontMono, fontSize: "0.75rem", color: T.textSub }}>{row.rollNo}</TableCell>
                                    <TableCell sx={{ fontFamily: fontBody, fontWeight: 600, fontSize: "0.85rem", color: T.text }}>{row.name}</TableCell>
                                    <TableCell sx={{ fontFamily: fontBody, fontSize: "0.82rem", color: T.textSub }}>{row.course}</TableCell>
                                    <TableCell sx={{ fontFamily: fontMono, fontSize: "0.8rem", color: T.textSub }}>{row.room}</TableCell>
                                    <TableCell sx={{ fontFamily: fontBody, fontSize: "0.82rem", color: T.textSub }}>{row.contact}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Card>
            </TabPanel>

            {/* ── Visitors Tab ── */}
            <TabPanel value={activeTab} id="visitors">
                <Card sx={{ borderRadius: "14px", border: `1px solid ${T.border}`, boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                    <Box sx={{ p: 2.5, borderBottom: `1px solid ${T.border}` }}>
                        <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1.1rem" }}>Visitor Logs</Typography>
                        <Typography sx={{ fontFamily: fontBody, fontSize: "0.78rem", color: T.textMute }}>Track visitors entering the premises</Typography>
                    </Box>
                    <Table>
                        <TableHead><TableRow sx={{ bgcolor: "#F9FAFB" }}>
                            {["Visitor Name", "Relation", "Student Visited", "Date", "In Time", "Out Time", "Actions"].map(h => <TableCell key={h} sx={{ fontFamily: fontBody, fontWeight: 700, fontSize: "0.72rem", color: T.textMute, textTransform: "uppercase", py: 1.5, ...(h === "Actions" ? { textAlign: "right" } : {}) }}>{h}</TableCell>)}
                        </TableRow></TableHead>
                        <TableBody>
                            {visitors.map(row => (
                                <TableRow key={row.id} className="row-hover">
                                    <TableCell sx={{ fontFamily: fontBody, fontWeight: 600, fontSize: "0.85rem", color: T.text }}>{row.visitorName}</TableCell>
                                    <TableCell sx={{ fontFamily: fontBody, fontSize: "0.82rem", color: T.textSub }}>{row.relation}</TableCell>
                                    <TableCell sx={{ fontFamily: fontBody, fontSize: "0.82rem", color: T.textSub }}>{row.studentName}</TableCell>
                                    <TableCell sx={{ fontFamily: fontBody, fontSize: "0.82rem", color: T.textSub }}>{row.date}</TableCell>
                                    <TableCell sx={{ fontFamily: fontMono, fontSize: "0.75rem", color: T.textSub }}>{row.inTime}</TableCell>
                                    <TableCell>{!row.outTime ? <StatusPill status="Inside" /> : <Typography sx={{ fontFamily: fontMono, fontSize: "0.75rem", color: T.textSub }}>{row.outTime}</Typography>}</TableCell>
                                    <TableCell sx={{ textAlign: "right", py: 1 }}>
                                        <IconButton size="small" onClick={() => setVisitModal({ open: true, data: row })} sx={{ color: T.textMute }}><Edit sx={{ fontSize: 16 }} /></IconButton>
                                        <IconButton size="small" sx={{ color: T.danger }}><DeleteOutline sx={{ fontSize: 16 }} /></IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Card>
            </TabPanel>

            {/* ── Complaints Tab ── */}
            <TabPanel value={activeTab} id="complaints">
                <Card sx={{ borderRadius: "14px", border: `1px solid ${T.border}`, boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                    <Box sx={{ p: 2.5, borderBottom: `1px solid ${T.border}` }}>
                        <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1.1rem" }}>Complaints</Typography>
                        <Typography sx={{ fontFamily: fontBody, fontSize: "0.78rem", color: T.textMute }}>Student raised issues</Typography>
                    </Box>
                    <Table>
                        <TableHead><TableRow sx={{ bgcolor: "#F9FAFB" }}>
                            {["ID", "Issue", "Room", "Date", "Priority", "Status"].map(h => <TableCell key={h} sx={{ fontFamily: fontBody, fontWeight: 700, fontSize: "0.72rem", color: T.textMute, textTransform: "uppercase", py: 1.5 }}>{h}</TableCell>)}
                        </TableRow></TableHead>
                        <TableBody>
                            {complaints.map(row => (
                                <TableRow key={row.id} className="row-hover">
                                    <TableCell sx={{ fontFamily: fontMono, fontSize: "0.75rem", color: T.textSub }}>{row.id}</TableCell>
                                    <TableCell sx={{ fontFamily: fontBody, fontWeight: 600, fontSize: "0.85rem", color: T.text }}>{row.title}</TableCell>
                                    <TableCell sx={{ fontFamily: fontMono, fontSize: "0.8rem", color: T.textSub }}>{row.room}</TableCell>
                                    <TableCell sx={{ fontFamily: fontBody, fontSize: "0.82rem", color: T.textSub }}>{row.date}</TableCell>
                                    <TableCell><StatusPill status={row.priority} /></TableCell>
                                    <TableCell><StatusPill status={row.status} /></TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Card>
            </TabPanel>

            {/* Allocation Modal */}
            <Dialog open={allocModal.open} onClose={() => setAllocModal({ open: false, data: null })} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: "16px", border: `1px solid ${T.border}` } }}>
                <DialogTitle sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1rem", color: T.text, borderBottom: `1px solid ${T.border}`, bgcolor: "#FAFBFD", pb: 2 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Box>{allocModal.data?.id ? "Edit Allocation" : "Allocate Room"}</Box>
                        <IconButton size="small" onClick={() => setAllocModal({ open: false, data: null })}><Close fontSize="small" /></IconButton>
                    </Box>
                </DialogTitle>
                <DialogContent sx={{ px: 3, pt: 3, pb: 2 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}><SLabel>Student Name</SLabel><DInput value={allocModal.data?.studentName || ""} /></Grid>
                        <Grid item xs={6}><SLabel>Room Number</SLabel><DInput value={allocModal.data?.roomNumber || ""} /></Grid>
                        <Grid item xs={6}><SLabel>Block</SLabel><DInput value={allocModal.data?.block || ""} /></Grid>
                        <Grid item xs={6}><SLabel>Check-in Date</SLabel><DInput type="date" InputLabelProps={{ shrink: true }} value={allocModal.data?.checkInDate || ""} /></Grid>
                        <Grid item xs={6}><SLabel>Status</SLabel>
                            <DInput select value={allocModal.data?.status || "Occupied"}>
                                {["Occupied", "Pending", "Vacated"].map(s => <MenuItem key={s} value={s} sx={{ fontFamily: fontBody, fontSize: "0.82rem" }}>{s}</MenuItem>)}
                            </DInput>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 3, borderTop: `1px solid ${T.border}`, pt: 2, bgcolor: "#FAFBFD" }}>
                    <Button onClick={() => setAllocModal({ open: false, data: null })} variant="outlined" sx={{ fontFamily: fontBody, fontWeight: 600, fontSize: "0.8rem", textTransform: "none", borderRadius: "8px", borderColor: T.border, color: T.textSub }}>Cancel</Button>
                    <Button variant="contained" onClick={handleSaveAllocation} sx={{ fontFamily: fontBody, fontWeight: 700, fontSize: "0.8rem", textTransform: "none", borderRadius: "8px", bgcolor: T.accent, boxShadow: "none" }}>Save</Button>
                </DialogActions>
            </Dialog>

            {/* Visitor Modal */}
            <Dialog open={visitModal.open} onClose={() => setVisitModal({ open: false, data: null })} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: "16px", border: `1px solid ${T.border}` } }}>
                <DialogTitle sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1rem", color: T.text, borderBottom: `1px solid ${T.border}`, bgcolor: "#FAFBFD", pb: 2 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Box>{visitModal.data?.id ? "Edit Visitor" : "Add Visitor"}</Box>
                        <IconButton size="small" onClick={() => setVisitModal({ open: false, data: null })}><Close fontSize="small" /></IconButton>
                    </Box>
                </DialogTitle>
                <DialogContent sx={{ px: 3, pt: 3, pb: 2 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={6}><SLabel>Visitor Name</SLabel><DInput value={visitModal.data?.visitorName || ""} /></Grid>
                        <Grid item xs={6}><SLabel>Relation</SLabel><DInput value={visitModal.data?.relation || ""} /></Grid>
                        <Grid item xs={12}><SLabel>Student Visited</SLabel><DInput value={visitModal.data?.studentName || ""} /></Grid>
                        <Grid item xs={4}><SLabel>Date</SLabel><DInput type="date" InputLabelProps={{ shrink: true }} value={visitModal.data?.date || ""} /></Grid>
                        <Grid item xs={4}><SLabel>In Time</SLabel><DInput type="time" InputLabelProps={{ shrink: true }} value={visitModal.data?.inTime || ""} /></Grid>
                        <Grid item xs={4}><SLabel>Out Time</SLabel><DInput type="time" InputLabelProps={{ shrink: true }} value={visitModal.data?.outTime || ""} /></Grid>
                    </Grid>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 3, borderTop: `1px solid ${T.border}`, pt: 2, bgcolor: "#FAFBFD" }}>
                    <Button onClick={() => setVisitModal({ open: false, data: null })} variant="outlined" sx={{ fontFamily: fontBody, fontWeight: 600, fontSize: "0.8rem", textTransform: "none", borderRadius: "8px", borderColor: T.border, color: T.textSub }}>Cancel</Button>
                    <Button variant="contained" onClick={handleSaveVisitor} sx={{ fontFamily: fontBody, fontWeight: 700, fontSize: "0.8rem", textTransform: "none", borderRadius: "8px", bgcolor: T.accent, boxShadow: "none" }}>Save</Button>
                </DialogActions>
            </Dialog>

            <Snackbar open={snack.open} autoHideDuration={3000} onClose={() => setSnack({ open: false, msg: "" })} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
                <Alert severity="success" sx={{ borderRadius: "10px", fontFamily: fontBody, fontWeight: 600 }}>{snack.msg}</Alert>
            </Snackbar>
        </Box>
    );
}
