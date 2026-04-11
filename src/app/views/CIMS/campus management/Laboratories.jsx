import React, { useState } from "react";
import {
    Box, Grid, Typography, Button, Table, TableBody, TableCell,
    TableHead, TableRow, IconButton, Tooltip, Stack,
    TextField, InputAdornment, Tabs, Tab, Avatar, Chip,
    Dialog, DialogTitle, DialogContent, DialogActions, MenuItem,
    Snackbar, Alert
} from "@mui/material";
import {
    Add, Search, Edit, Close, Business, People,
    CheckCircle, Cancel, Science, Computer, Build,
    EventNote, Person, Warning, AccessTime
} from "@mui/icons-material";

/* ── Design Tokens ── */
const T = {
    bg: "#F5F7FA",
    surface: "#FFFFFF",
    border: "#E4E8EF",
    accent: "#6366F1",
    accentLight: "#EEF2FF",
    success: "#10B981",
    successLight: "#ECFDF5",
    warning: "#F59E0B",
    warningLight: "#FFFBEB",
    danger: "#EF4444",
    dangerLight: "#FEF2F2",
    secondary: "#64748B",
    secondaryLight: "#F1F5F9",
    text: "#111827",
    textSub: "#4B5563",
    textMute: "#9CA3AF",
};

const fHead = "Roboto, Helvetica, Arial, sans-serif";
const fBody = "Roboto, Helvetica, Arial, sans-serif";
const fMono = "Roboto Mono, monospace";

const Fonts = () => (
    <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;600;700&family=Roboto+Mono:wght@500;600&display=swap');
    * { box-sizing: border-box; }
    @keyframes fadeUp { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:none; } }
    .fu  { animation: fadeUp 0.3s ease both; }
    .fu1 { animation: fadeUp 0.3s 0.06s ease both; }
    .row-h:hover { background: #F9FAFB !important; transition: background 0.15s; }
    .row-sel { background: #EEF2FF !important; }
  `}</style>
);

/* ── Mock Data ── */
const LABS_INIT = [
    {
        id: "LAB-CS-01", name: "Advanced Computing Lab", department: "Computer Science", capacity: 40, incharge: "Dr. Alan Turing", status: "Active", equipmentCount: 45,
        description: "High-performance computing facility for AI and Machine Learning research.",
        equipment: [
            { id: "EQ-001", name: "Dell Precision Workstation", serial: "DPW-8923-1", status: "Active", lastService: "2023-09-15" },
            { id: "EQ-002", name: "NVIDIA DGX Station", serial: "NDGX-102-A", status: "Active", lastService: "2023-10-01" },
        ],
        timetable: [
            { id: 1, day: "Monday", time: "09:00 - 11:00", course: "CS401: Machine Learning", instructor: "Dr. Alan Turing" },
        ],
        maintenance: [
            { id: "M-101", issue: "Network switch dropping packets", status: "In Progress", date: "2023-10-22", priority: "High" },
        ]
    },
    {
        id: "LAB-ME-03", name: "Robotics & Automation Lab", department: "Mechanical Engineering", capacity: 25, incharge: "Prof. Nikola Tesla", status: "Maintenance", equipmentCount: 15,
        description: "Advanced robotics testing and automation systems laboratory.",
        equipment: [
            { id: "EQ-201", name: "6-Axis Industrial Robot", serial: "IRB-1200", status: "Maintenance", lastService: "2023-09-01" },
        ],
        timetable: [],
        maintenance: [
            { id: "M-301", issue: "Robot arm calibration error", status: "In Progress", date: "2023-10-23", priority: "Critical" },
        ]
    }
];

const STATUS_META = {
    Active: { color: T.success, bg: T.successLight },
    Maintenance: { color: T.warning, bg: T.warningLight },
    "Out of Order": { color: T.danger, bg: T.dangerLight },
};

/* ── Primitives ── */
const SCard = ({ children, sx = {}, ...p }) => (
    <Box sx={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: "14px", ...sx }} {...p}>{children}</Box>
);

const SLabel = ({ children, sx = {} }) => (
    <Typography sx={{ fontFamily: fBody, fontSize: "0.67rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: T.textMute, mb: 0.5, ...sx }}>{children}</Typography>
);

const TH = ({ children, align }) => (
    <TableCell align={align} sx={{ fontFamily: fBody, fontWeight: 700, fontSize: "0.68rem", letterSpacing: "0.06em", textTransform: "uppercase", color: T.textMute, borderBottom: `1px solid ${T.border}`, py: 1.2, bgcolor: "#F9FAFB", whiteSpace: "nowrap" }}>{children}</TableCell>
);

const TD = ({ children, sx = {}, align }) => (
    <TableCell align={align} sx={{ fontFamily: fBody, fontSize: "0.78rem", color: T.textSub, borderBottom: `1px solid ${T.border}`, py: 1.5, ...sx }}>{children}</TableCell>
);

const StatusPill = ({ status }) => {
    const s = STATUS_META[status] || { color: T.textMute, bg: "#F1F5F9" };
    return (
        <Box display="flex" alignItems="center" gap={0.6} sx={{ px: 1.2, py: 0.35, borderRadius: "99px", bgcolor: s.bg, width: "fit-content" }}>
            <Box sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: s.color }} />
            <Typography sx={{ fontFamily: fBody, fontSize: "0.71rem", fontWeight: 700, color: s.color }}>{status}</Typography>
        </Box>
    );
};

const DInput = ({ sx = {}, ...props }) => (
    <TextField size="small" fullWidth {...props} sx={{
        "& .MuiOutlinedInput-root": { borderRadius: "8px", fontFamily: fBody, fontSize: "0.82rem", bgcolor: T.surface, "& fieldset": { borderColor: T.border }, "&.Mui-focused fieldset": { borderColor: T.accent } },
        "& .MuiInputLabel-root.Mui-focused": { color: T.accent }, ...sx,
    }} />
);

/* ═══════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════ */
export default function Laboratories() {
    const [labs, setLabs] = useState(LABS_INIT);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedLab, setSelectedLab] = useState(null);
    const [activeTab, setActiveTab] = useState(0);

    // Modal & Form State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState("add");
    const [formData, setFormData] = useState({});
    const [snack, setSnack] = useState({ open: false, msg: "", severity: "success" });

    const toast = (msg, severity = "success") => setSnack({ open: true, msg, severity });

    const filteredLabs = labs.filter(lab =>
        lab.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lab.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lab.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Handlers for Add/Edit
    const handleOpenAddModal = () => {
        setModalMode("add");
        setFormData({ status: "Active", capacity: 30, equipmentCount: 0, equipment: [], timetable: [], maintenance: [] });
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (lab, e) => {
        e && e.stopPropagation();
        setModalMode("edit");
        setFormData({ ...lab });
        setIsModalOpen(true);
    };

    const handleSave = () => {
        if (!formData.name || !formData.id) { toast("Lab ID and Name are required.", "error"); return; }

        if (modalMode === "add") {
            setLabs(prev => [...prev, formData]);
            toast(`Laboratory "${formData.name}" added successfully.`);
        } else {
            setLabs(prev => prev.map(l => l.id === formData.id ? { ...l, ...formData } : l));
            if (selectedLab?.id === formData.id) setSelectedLab({ ...selectedLab, ...formData });
            toast(`Laboratory "${formData.name}" updated.`);
        }
        setIsModalOpen(false);
    };

    return (
        <Box sx={{ p: 3, bgcolor: T.bg, minHeight: "100vh", fontFamily: fBody }}>
            <Fonts />

            {/* ── Header ── */}
            <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3} flexWrap="wrap" gap={2} className="fu">
                <Box>
                    <Typography sx={{ fontFamily: fBody, fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: T.textMute, mb: 0.3 }}>
                        Admin Dashboard · Infrastructure
                    </Typography>
                    <Typography sx={{ fontFamily: fHead, fontWeight: 700, fontSize: "1.5rem", color: T.text }}>Laboratory Management</Typography>
                    <Typography sx={{ fontFamily: fBody, fontSize: "0.82rem", color: T.textSub, mt: 0.3 }}>
                        Manage lab facilities, specialized equipment inventory, and session schedules.
                    </Typography>
                </Box>
                <Button variant="contained" startIcon={<Add sx={{ fontSize: 15 }} />} onClick={handleOpenAddModal}
                    sx={{ fontFamily: fBody, fontWeight: 700, fontSize: "0.78rem", textTransform: "none", borderRadius: "9px", bgcolor: T.accent, boxShadow: "none", "&:hover": { bgcolor: "#4F46E5", boxShadow: "none" } }}>
                    Add Laboratory
                </Button>
            </Box>

            {/* ── Stat Strip ── */}
            <Grid container spacing={2} mb={3} className="fu1">
                {[
                    { label: "Total Labs", value: labs.length, sub: "All Departments", color: T.accent, Icon: Science },
                    { label: "Active Facilities", value: labs.filter(l => l.status === "Active").length, sub: "Fully operational", color: T.success, Icon: CheckCircle },
                    { label: "Active Issues", value: labs.reduce((sum, lab) => sum + lab.maintenance.length, 0), sub: "Maintenance logs", color: T.warning, Icon: Build },
                    { label: "Total Equipment", value: labs.reduce((sum, lab) => sum + lab.equipmentCount, 0), sub: "Tracked inventory", color: T.secondary, Icon: Computer },
                ].map((s, i) => (
                    <Grid item xs={6} md={3} key={i}>
                        <SCard sx={{ p: 2.5 }}>
                            <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                                <Box>
                                    <SLabel>{s.label}</SLabel>
                                    <Typography sx={{ fontFamily: fMono, fontWeight: 700, fontSize: "1.7rem", color: s.color, lineHeight: 1.1 }}>{s.value}</Typography>
                                    <Typography sx={{ fontFamily: fBody, fontSize: "0.7rem", color: T.textMute, mt: 0.3 }}>{s.sub}</Typography>
                                </Box>
                                <Box sx={{ p: 1.1, borderRadius: "10px", bgcolor: `${s.color}15`, color: s.color }}><s.Icon sx={{ fontSize: 20 }} /></Box>
                            </Box>
                        </SCard>
                    </Grid>
                ))}
            </Grid>

            {/* ── Main Content ── */}
            <Grid container spacing={2.5}>
                {/* ── Table (Master View) ── */}
                <Grid item xs={12} md={selectedLab ? 6 : 12}>
                    <SCard sx={{ overflow: "hidden" }}>
                        <Box sx={{ px: 2.5, py: 2, borderBottom: `1px solid ${T.border}`, bgcolor: "#FAFBFD", display: "flex", gap: 1.5, flexWrap: "wrap", alignItems: "center" }}>
                            <TextField size="small" placeholder="Search labs or departments…" value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                                InputProps={{ startAdornment: <InputAdornment position="start"><Search sx={{ fontSize: 15, color: T.textMute }} /></InputAdornment> }}
                                sx={{ width: 260, "& .MuiOutlinedInput-root": { borderRadius: "8px", fontFamily: fBody, fontSize: "0.8rem", "& fieldset": { borderColor: T.border }, "&.Mui-focused fieldset": { borderColor: T.accent } } }} />
                            <Typography sx={{ fontFamily: fBody, fontSize: "0.75rem", color: T.textMute, ml: "auto", alignSelf: "center" }}>{filteredLabs.length} lab{filteredLabs.length !== 1 ? "s" : ""}</Typography>
                        </Box>

                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TH>Laboratory</TH>
                                    <TH>Department</TH>
                                    {!selectedLab && <TH align="center">Capacity</TH>}
                                    {!selectedLab && <TH align="center">Equipment</TH>}
                                    <TH>Status</TH>
                                    {!selectedLab && <TH align="right">Actions</TH>}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredLabs.map(lab => (
                                    <TableRow key={lab.id} className={selectedLab?.id === lab.id ? "row-sel" : "row-h"} onClick={() => { setSelectedLab(lab); setActiveTab(0); }} sx={{ cursor: "pointer" }}>
                                        <TD>
                                            <Box display="flex" alignItems="center" gap={1.2}>
                                                <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: STATUS_META[lab.status]?.color || T.textMute, flexShrink: 0 }} />
                                                <Box>
                                                    <Typography sx={{ fontFamily: fBody, fontWeight: 700, fontSize: "0.82rem", color: T.text }}>{lab.name}</Typography>
                                                    <Typography sx={{ fontFamily: fMono, fontSize: "0.68rem", color: T.textMute }}>{lab.id}</Typography>
                                                </Box>
                                            </Box>
                                        </TD>
                                        <TD sx={{ fontWeight: 600, color: T.textSub }}>{lab.department}</TD>
                                        {!selectedLab && (
                                            <TD align="center"><Typography sx={{ fontFamily: fMono, fontWeight: 700, fontSize: "0.84rem", color: T.text }}>{lab.capacity}</Typography></TD>
                                        )}
                                        {!selectedLab && (
                                            <TD align="center">
                                                <Box sx={{ px: 1, py: 0.2, borderRadius: "6px", bgcolor: T.secondaryLight, display: "inline-block" }}>
                                                    <Typography sx={{ fontFamily: fMono, fontSize: "0.72rem", fontWeight: 700, color: T.secondary }}>{lab.equipmentCount} Items</Typography>
                                                </Box>
                                            </TD>
                                        )}
                                        <TD><StatusPill status={lab.status} /></TD>
                                        {!selectedLab && (
                                            <TD align="right">
                                                <Tooltip title="Edit Lab">
                                                    <IconButton size="small" sx={{ bgcolor: T.accentLight, color: T.accent, borderRadius: "7px", width: 28, height: 28, "&:hover": { bgcolor: "#D4D8FF" } }}
                                                        onClick={e => handleOpenEditModal(lab, e)}>
                                                        <Edit sx={{ fontSize: 14 }} />
                                                    </IconButton>
                                                </Tooltip>
                                            </TD>
                                        )}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </SCard>
                </Grid>

                {/* ── Detail Panel (Tabs) ── */}
                {selectedLab && (
                    <Grid item xs={12} md={6} className="fu">
                        <SCard sx={{ overflow: "hidden", display: "flex", flexDirection: "column", height: "100%", minHeight: "500px", position: "sticky", top: 24 }}>
                            {/* Header */}
                            <Box sx={{ px: 3, pt: 3, pb: 1, borderBottom: `1px solid ${T.border}`, bgcolor: "#FAFBFD", position: "relative" }}>
                                <IconButton size="small" onClick={() => setSelectedLab(null)} sx={{ position: "absolute", right: 16, top: 16, bgcolor: "#F1F5F9", borderRadius: "8px" }}><Close fontSize="small" /></IconButton>

                                <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                                    <Chip label={selectedLab.id} size="small" sx={{ borderRadius: "6px", fontFamily: fMono, fontWeight: 700, fontSize: "0.65rem", bgcolor: T.accentLight, color: T.accent }} />
                                    <StatusPill status={selectedLab.status} />
                                </Box>
                                <Typography sx={{ fontFamily: fHead, fontWeight: 700, fontSize: "1.2rem", color: T.text, mt: 1 }}>{selectedLab.name}</Typography>
                                <Typography sx={{ fontFamily: fBody, fontSize: "0.78rem", color: T.textSub, mt: 0.5, pr: 4 }}>{selectedLab.description}</Typography>

                                <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)} variant="scrollable" scrollButtons="auto"
                                    sx={{
                                        mt: 2, minHeight: 40, "& .MuiTabs-indicator": { bgcolor: T.accent, height: 2.5, borderRadius: "2px 2px 0 0" },
                                        "& .MuiTab-root": { fontFamily: fBody, fontWeight: 600, fontSize: "0.78rem", textTransform: "none", color: T.textMute, minHeight: 40, "&.Mui-selected": { color: T.accent } }
                                    }}>
                                    <Tab icon={<Science sx={{ fontSize: 16 }} />} iconPosition="start" label="Overview" />
                                    <Tab icon={<Computer sx={{ fontSize: 16 }} />} iconPosition="start" label={`Equipment (${selectedLab.equipment.length})`} />
                                    <Tab icon={<EventNote sx={{ fontSize: 16 }} />} iconPosition="start" label="Timetable" />
                                    <Tab icon={<Build sx={{ fontSize: 16 }} />} iconPosition="start" label={`Maintenance (${selectedLab.maintenance.length})`} />
                                </Tabs>
                            </Box>

                            {/* Tab Content Area */}
                            <Box sx={{ p: 3, flex: 1, overflowY: "auto", bgcolor: T.surface }}>

                                {/* ── TAB 0: OVERVIEW ── */}
                                {activeTab === 0 && (
                                    <Stack spacing={3} className="fu">
                                        <Box>
                                            <SLabel sx={{ mb: 1.5 }}>Laboratory Details</SLabel>
                                            <Stack spacing={2}>
                                                <Box display="flex" alignItems="center" gap={2}>
                                                    <Avatar sx={{ bgcolor: T.accentLight, color: T.accent, width: 34, height: 34 }}><Business fontSize="small" /></Avatar>
                                                    <Box><Typography sx={{ fontFamily: fBody, fontSize: "0.7rem", color: T.textMute, fontWeight: 700 }}>DEPARTMENT</Typography>
                                                        <Typography sx={{ fontFamily: fBody, fontWeight: 600, fontSize: "0.85rem" }}>{selectedLab.department}</Typography></Box>
                                                </Box>
                                                <Box display="flex" alignItems="center" gap={2}>
                                                    <Avatar sx={{ bgcolor: T.successLight, color: T.success, width: 34, height: 34 }}><People fontSize="small" /></Avatar>
                                                    <Box><Typography sx={{ fontFamily: fBody, fontSize: "0.7rem", color: T.textMute, fontWeight: 700 }}>STUDENT CAPACITY</Typography>
                                                        <Typography sx={{ fontFamily: fBody, fontWeight: 600, fontSize: "0.85rem" }}>{selectedLab.capacity} Workstations</Typography></Box>
                                                </Box>
                                                <Box display="flex" alignItems="center" gap={2}>
                                                    <Avatar sx={{ bgcolor: T.warningLight, color: T.warning, width: 34, height: 34 }}><Person fontSize="small" /></Avatar>
                                                    <Box><Typography sx={{ fontFamily: fBody, fontSize: "0.7rem", color: T.textMute, fontWeight: 700 }}>LAB INCHARGE</Typography>
                                                        <Typography sx={{ fontFamily: fBody, fontWeight: 600, fontSize: "0.85rem" }}>{selectedLab.incharge}</Typography></Box>
                                                </Box>
                                            </Stack>
                                        </Box>

                                        <Box>
                                            <SLabel sx={{ mb: 1.5 }}>Quick Actions</SLabel>
                                            <Box display="flex" gap={1.5}>
                                                <Button variant="outlined" size="small" startIcon={<Edit sx={{ fontSize: 15 }} />} onClick={() => handleOpenEditModal(selectedLab, null)}
                                                    sx={{ fontFamily: fBody, fontWeight: 700, fontSize: "0.75rem", textTransform: "none", borderRadius: "8px", borderColor: T.border, color: T.textSub, "&:hover": { borderColor: T.accent, color: T.accent } }}>Edit Lab</Button>
                                                <Button variant="outlined" size="small" startIcon={<Build sx={{ fontSize: 15 }} />}
                                                    sx={{ fontFamily: fBody, fontWeight: 700, fontSize: "0.75rem", textTransform: "none", borderRadius: "8px", borderColor: T.border, color: T.textSub }}>Report Issue</Button>
                                            </Box>
                                        </Box>
                                    </Stack>
                                )}

                                {/* ── TAB 1: EQUIPMENT ── */}
                                {activeTab === 1 && (
                                    <Box className="fu" sx={{ border: `1px solid ${T.border}`, borderRadius: "10px", overflow: "hidden" }}>
                                        <Table size="small">
                                            <TableHead><TableRow><TH>Equipment Name</TH><TH>Serial / ID</TH><TH>Status</TH></TableRow></TableHead>
                                            <TableBody>
                                                {selectedLab.equipment.map(eq => (
                                                    <TableRow key={eq.id} className="row-h">
                                                        <TD sx={{ fontWeight: 600, color: T.text }}>{eq.name}
                                                            <Typography sx={{ fontFamily: fBody, fontSize: "0.65rem", color: T.textMute, mt: 0.3 }}>Service: {eq.lastService}</Typography>
                                                        </TD>
                                                        <TD><Typography sx={{ fontFamily: fMono, fontSize: "0.7rem", color: T.textMute }}>{eq.serial}</Typography></TD>
                                                        <TD><StatusPill status={eq.status} /></TD>
                                                    </TableRow>
                                                ))}
                                                {selectedLab.equipment.length === 0 && (
                                                    <TableRow><TableCell colSpan={3} sx={{ textAlign: "center", py: 4, color: T.textMute, fontFamily: fBody, fontSize: "0.8rem" }}>No equipment assigned.</TableCell></TableRow>
                                                )}
                                            </TableBody>
                                        </Table>
                                    </Box>
                                )}

                                {/* ── TAB 2: TIMETABLE ── */}
                                {activeTab === 2 && (
                                    <Box className="fu" sx={{ border: `1px solid ${T.border}`, borderRadius: "10px", overflow: "hidden" }}>
                                        <Table size="small">
                                            <TableHead><TableRow><TH>Schedule</TH><TH>Course / Instructor</TH></TableRow></TableHead>
                                            <TableBody>
                                                {selectedLab.timetable.map(session => (
                                                    <TableRow key={session.id} className="row-h">
                                                        <TD>
                                                            <Typography sx={{ fontFamily: fBody, fontWeight: 700, fontSize: "0.78rem", color: T.text }}>{session.day}</Typography>
                                                            <Box display="flex" alignItems="center" gap={0.5} mt={0.3}>
                                                                <AccessTime sx={{ fontSize: 11, color: T.textMute }} />
                                                                <Typography sx={{ fontFamily: fMono, fontSize: "0.7rem", color: T.textMute }}>{session.time}</Typography>
                                                            </Box>
                                                        </TD>
                                                        <TD>
                                                            <Typography sx={{ fontFamily: fBody, fontWeight: 600, fontSize: "0.78rem", color: T.accent }}>{session.course}</Typography>
                                                            <Typography sx={{ fontFamily: fBody, fontSize: "0.7rem", color: T.textMute, mt: 0.3 }}>{session.instructor}</Typography>
                                                        </TD>
                                                    </TableRow>
                                                ))}
                                                {selectedLab.timetable.length === 0 && (
                                                    <TableRow><TableCell colSpan={2} sx={{ textAlign: "center", py: 4, color: T.textMute, fontFamily: fBody, fontSize: "0.8rem" }}>No sessions scheduled.</TableCell></TableRow>
                                                )}
                                            </TableBody>
                                        </Table>
                                    </Box>
                                )}

                                {/* ── TAB 3: MAINTENANCE ── */}
                                {activeTab === 3 && (
                                    <Box className="fu">
                                        <Stack spacing={1.5}>
                                            {selectedLab.maintenance.map(maint => {
                                                const prioColors = { Critical: T.danger, High: T.warning, Medium: T.secondary };
                                                const pc = prioColors[maint.priority] || T.secondary;
                                                return (
                                                    <Box key={maint.id} sx={{ p: 2, borderRadius: "10px", border: `1px solid ${T.border}`, bgcolor: "#FAFBFD" }}>
                                                        <Box display="flex" justifyContent="space-between" mb={1}>
                                                            <Box display="flex" alignItems="center" gap={1}>
                                                                <Warning sx={{ fontSize: 16, color: pc }} />
                                                                <Typography sx={{ fontFamily: fMono, fontSize: "0.7rem", fontWeight: 700, color: pc }}>{maint.id} · {maint.priority}</Typography>
                                                            </Box>
                                                            <StatusPill status={maint.status} />
                                                        </Box>
                                                        <Typography sx={{ fontFamily: fBody, fontWeight: 600, fontSize: "0.82rem", color: T.text }}>{maint.issue}</Typography>
                                                        <Typography sx={{ fontFamily: fBody, fontSize: "0.7rem", color: T.textMute, mt: 0.6 }}>Reported: {maint.date}</Typography>
                                                    </Box>
                                                );
                                            })}
                                            {selectedLab.maintenance.length === 0 && (
                                                <Box sx={{ p: 4, textAlign: "center", border: `1px dashed ${T.border}`, borderRadius: "10px" }}>
                                                    <Typography sx={{ fontFamily: fBody, fontSize: "0.8rem", color: T.textMute }}>No active maintenance records.</Typography>
                                                </Box>
                                            )}
                                        </Stack>
                                    </Box>
                                )}
                            </Box>
                        </SCard>
                    </Grid>
                )}
            </Grid>

            {/* ── Add / Edit Dialog ── */}
            <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} maxWidth="sm" fullWidth
                PaperProps={{ sx: { borderRadius: "16px", border: `1px solid ${T.border}` } }}>
                <DialogTitle sx={{ fontFamily: fHead, fontWeight: 700, fontSize: "1rem", color: T.text, borderBottom: `1px solid ${T.border}`, bgcolor: "#FAFBFD", pb: 2 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Box display="flex" alignItems="center" gap={1.2}>
                            <Box sx={{ width: 4, height: 22, borderRadius: 2, bgcolor: T.accent }} />
                            {modalMode === "add" ? "Add New Laboratory" : "Edit Laboratory"}
                        </Box>
                        <IconButton size="small" onClick={() => setIsModalOpen(false)} sx={{ bgcolor: "#F1F5F9", borderRadius: "8px" }}><Close fontSize="small" /></IconButton>
                    </Box>
                </DialogTitle>

                <DialogContent sx={{ px: 3, pt: 3, pb: 2 }}>
                    <Stack spacing={2.2}>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <SLabel sx={{ mb: 0.7 }}>Lab ID *</SLabel>
                                <DInput value={formData.id || ""} onChange={e => setFormData({ ...formData, id: e.target.value })} placeholder="e.g. LAB-CS-01" disabled={modalMode === "edit"} />
                            </Grid>
                            <Grid item xs={6}>
                                <SLabel sx={{ mb: 0.7 }}>Status</SLabel>
                                <DInput select value={formData.status || "Active"} onChange={e => setFormData({ ...formData, status: e.target.value })}>
                                    {["Active", "Maintenance", "Out of Order"].map(s => <MenuItem key={s} value={s} sx={{ fontFamily: fBody, fontSize: "0.82rem" }}>{s}</MenuItem>)}
                                </DInput>
                            </Grid>
                        </Grid>

                        <Box>
                            <SLabel sx={{ mb: 0.7 }}>Lab Name *</SLabel>
                            <DInput value={formData.name || ""} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="e.g. Advanced Computing Lab" />
                        </Box>
                        <Box>
                            <SLabel sx={{ mb: 0.7 }}>Description</SLabel>
                            <DInput multiline rows={2} value={formData.description || ""} onChange={e => setFormData({ ...formData, description: e.target.value })} placeholder="Brief description of the facility..." />
                        </Box>

                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <SLabel sx={{ mb: 0.7 }}>Department</SLabel>
                                <DInput value={formData.department || ""} onChange={e => setFormData({ ...formData, department: e.target.value })} placeholder="e.g. Computer Science" />
                            </Grid>
                            <Grid item xs={6}>
                                <SLabel sx={{ mb: 0.7 }}>Capacity (Students)</SLabel>
                                <DInput type="number" value={formData.capacity || ""} onChange={e => setFormData({ ...formData, capacity: parseInt(e.target.value) })} placeholder="40" />
                            </Grid>
                        </Grid>
                        <Box>
                            <SLabel sx={{ mb: 0.7 }}>Lab Incharge</SLabel>
                            <DInput value={formData.incharge || ""} onChange={e => setFormData({ ...formData, incharge: e.target.value })} placeholder="e.g. Dr. Alan Turing" />
                        </Box>
                    </Stack>
                </DialogContent>

                <DialogActions sx={{ px: 3, pb: 3, borderTop: `1px solid ${T.border}`, pt: 2, bgcolor: "#FAFBFD", gap: 1 }}>
                    <Button onClick={() => setIsModalOpen(false)} variant="outlined" sx={{ fontFamily: fBody, fontWeight: 600, fontSize: "0.8rem", textTransform: "none", borderRadius: "8px", borderColor: T.border, color: T.textSub }}>Cancel</Button>
                    <Button variant="contained" onClick={handleSave} sx={{ fontFamily: fBody, fontWeight: 700, fontSize: "0.8rem", textTransform: "none", borderRadius: "8px", bgcolor: T.accent, boxShadow: "none", "&:hover": { bgcolor: "#4F46E5", boxShadow: "none" } }}>
                        {modalMode === "add" ? "Save Laboratory" : "Save Changes"}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar */}
            <Snackbar open={snack.open} autoHideDuration={3500} onClose={() => setSnack(s => ({ ...s, open: false }))} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
                <Alert severity={snack.severity} sx={{ borderRadius: "10px", fontFamily: fBody, fontWeight: 600 }} onClose={() => setSnack(s => ({ ...s, open: false }))}>{snack.msg}</Alert>
            </Snackbar>
        </Box>
    );
}