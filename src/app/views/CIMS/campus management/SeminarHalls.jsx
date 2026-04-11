import React, { useState } from "react";
import {
    Box, Grid, Typography, Button, Table, TableBody, TableCell,
    TableHead, TableRow, IconButton, Tooltip, Stack, Chip,
    Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, MenuItem, InputAdornment, Snackbar, Alert, Divider
} from "@mui/material";
import {
    Add, Search, Edit, Close, Business, People,
    CheckCircle, Cancel, Videocam, Dashboard, AcUnit,
    EventNote
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
const SEMINAR_HALLS_INIT = [
    { id: "SH-101", name: "Tech Seminar Room", building: "Block A", capacity: 80, status: "Available", videoConferencing: true, smartBoard: true, ac: true },
    { id: "SH-102", name: "Hall B", building: "Block B", capacity: 150, status: "Occupied", videoConferencing: true, smartBoard: false, ac: true },
    { id: "SH-201", name: "Executive Hall", building: "Block C", capacity: 50, status: "Maintenance", videoConferencing: false, smartBoard: true, ac: true },
];

const STATUS_META = {
    Available: { color: T.success, bg: T.successLight },
    Occupied: { color: T.warning, bg: T.warningLight },
    Maintenance: { color: T.danger, bg: T.dangerLight },
};

/* ── Primitives ── */
const SCard = ({ children, sx = {}, ...p }) => (
    <Box sx={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: "14px", ...sx }} {...p}>{children}</Box>
);

const SLabel = ({ children, sx = {} }) => (
    <Typography sx={{ fontFamily: fBody, fontSize: "0.67rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: T.textMute, mb: 0.5, ...sx }}>{children}</Typography>
);

const TH = ({ children, align }) => (
    <TableCell align={align} sx={{ fontFamily: fBody, fontWeight: 700, fontSize: "0.68rem", letterSpacing: "0.06em", textTransform: "uppercase", color: T.textMute, borderBottom: `1px solid ${T.border}`, py: 1.5, bgcolor: "#F9FAFB", whiteSpace: "nowrap" }}>{children}</TableCell>
);

const TD = ({ children, sx = {}, align }) => (
    <TableCell align={align} sx={{ fontFamily: fBody, fontSize: "0.81rem", color: T.textSub, borderBottom: `1px solid ${T.border}`, py: 1.8, ...sx }}>{children}</TableCell>
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

const AmenityChip = ({ active, Icon, label }) => (
    <Box display="flex" alignItems="center" gap={0.8} sx={{
        px: 1.2, py: 0.6, borderRadius: "8px",
        bgcolor: active ? T.successLight : "#F1F5F9",
        border: `1px solid ${active ? T.success + "40" : T.border}`,
    }}>
        <Icon sx={{ fontSize: 13, color: active ? T.success : T.textMute }} />
        <Typography sx={{ fontFamily: fBody, fontSize: "0.72rem", fontWeight: 600, color: active ? T.success : T.textMute, textDecoration: active ? "none" : "line-through" }}>
            {label}
        </Typography>
    </Box>
);

const DInput = ({ sx = {}, ...props }) => (
    <TextField size="small" fullWidth {...props} sx={{
        "& .MuiOutlinedInput-root": { borderRadius: "8px", fontFamily: fBody, fontSize: "0.82rem", bgcolor: T.surface, "& fieldset": { borderColor: T.border }, "&.Mui-focused fieldset": { borderColor: T.accent } },
        "& .MuiInputLabel-root.Mui-focused": { color: T.accent }, ...sx,
    }} />
);

/* ═══════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════ */
export default function SeminarHalls() {
    const [halls, setHalls] = useState(SEMINAR_HALLS_INIT);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterBuilding, setFilterBuilding] = useState("");
    const [filterStatus, setFilterStatus] = useState("");
    const [selectedHall, setSelectedHall] = useState(null);

    // Modals & Forms
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState("add");
    const [formData, setFormData] = useState({});
    const [snack, setSnack] = useState({ open: false, msg: "", severity: "success" });

    const toast = (msg, severity = "success") => setSnack({ open: true, msg, severity });

    const uniqueBuildings = [...new Set(halls.map(h => h.building))];

    const filteredHalls = halls.filter(hall => {
        const matchesSearch = hall.name.toLowerCase().includes(searchTerm.toLowerCase()) || hall.id.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesBuilding = filterBuilding ? hall.building === filterBuilding : true;
        const matchesStatus = filterStatus ? hall.status === filterStatus : true;
        return matchesSearch && matchesBuilding && matchesStatus;
    });

    const handleOpenAddModal = () => {
        setModalMode("add");
        setFormData({ videoConferencing: false, smartBoard: false, ac: true, status: "Available", capacity: 50 });
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (hall, e) => {
        e && e.stopPropagation();
        setModalMode("edit");
        setFormData({ ...hall });
        setIsModalOpen(true);
    };

    const handleSave = () => {
        if (!formData.name || !formData.building) { toast("Name and Building are required.", "error"); return; }

        if (modalMode === "add") {
            const newHall = { ...formData, id: formData.id || `SH-${Math.floor(Math.random() * 900) + 100}` };
            setHalls(prev => [...prev, newHall]);
            toast(`Seminar Hall "${newHall.name}" added successfully.`);
        } else {
            setHalls(prev => prev.map(h => h.id === formData.id ? { ...h, ...formData } : h));
            if (selectedHall?.id === formData.id) setSelectedHall({ ...selectedHall, ...formData });
            toast(`Seminar Hall "${formData.name}" updated.`);
        }
        setIsModalOpen(false);
    };

    const totalCapacity = halls.reduce((a, b) => a + b.capacity, 0);

    return (
        <Box sx={{ p: 3, bgcolor: T.bg, minHeight: "100vh", fontFamily: fBody }}>
            <Fonts />

            {/* ── Header ── */}
            <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3} flexWrap="wrap" gap={2} className="fu">
                <Box>
                    <Typography sx={{ fontFamily: fBody, fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: T.textMute, mb: 0.3 }}>
                        Admin Dashboard · Infrastructure
                    </Typography>
                    <Typography sx={{ fontFamily: fHead, fontWeight: 700, fontSize: "1.5rem", color: T.text }}>Seminar Halls</Typography>
                    <Typography sx={{ fontFamily: fBody, fontSize: "0.82rem", color: T.textSub, mt: 0.3 }}>
                        Manage presentation venues, capacities, and specialized conferencing equipment.
                    </Typography>
                </Box>
                <Button variant="contained" startIcon={<Add sx={{ fontSize: 15 }} />} onClick={handleOpenAddModal}
                    sx={{ fontFamily: fBody, fontWeight: 700, fontSize: "0.78rem", textTransform: "none", borderRadius: "9px", bgcolor: T.accent, boxShadow: "none", "&:hover": { bgcolor: "#4F46E5", boxShadow: "none" } }}>
                    Add Seminar Hall
                </Button>
            </Box>

            {/* ── Stat Strip ── */}
            <Grid container spacing={2} mb={3} className="fu1">
                {[
                    { label: "Total Halls", value: halls.length, sub: "Campus-wide", color: T.accent, Icon: Business },
                    { label: "Available", value: halls.filter(h => h.status === "Available").length, sub: "Ready for use", color: T.success, Icon: CheckCircle },
                    { label: "Maintenance", value: halls.filter(h => h.status === "Maintenance").length, sub: "Under service", color: T.danger, Icon: Cancel },
                    { label: "Total Seats", value: totalCapacity, sub: "Across all halls", color: T.secondary, Icon: People },
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
                {/* ── Table ── */}
                <Grid item xs={12} md={selectedHall ? 8 : 12}>
                    <SCard sx={{ overflow: "hidden" }}>
                        <Box sx={{ px: 2.5, py: 2, borderBottom: `1px solid ${T.border}`, bgcolor: "#FAFBFD", display: "flex", gap: 1.5, flexWrap: "wrap", alignItems: "center" }}>
                            <TextField size="small" placeholder="Search name or ID…" value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                                InputProps={{ startAdornment: <InputAdornment position="start"><Search sx={{ fontSize: 15, color: T.textMute }} /></InputAdornment> }}
                                sx={{ width: 220, "& .MuiOutlinedInput-root": { borderRadius: "8px", fontFamily: fBody, fontSize: "0.8rem", "& fieldset": { borderColor: T.border }, "&.Mui-focused fieldset": { borderColor: T.accent } } }} />
                            <DInput select value={filterBuilding} onChange={e => setFilterBuilding(e.target.value)} sx={{ width: 140 }}>
                                <MenuItem value="" sx={{ fontFamily: fBody, fontSize: "0.82rem" }}>All Buildings</MenuItem>
                                {uniqueBuildings.map(b => <MenuItem key={b} value={b} sx={{ fontFamily: fBody, fontSize: "0.82rem" }}>{b}</MenuItem>)}
                            </DInput>
                            <DInput select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} sx={{ width: 140 }}>
                                <MenuItem value="" sx={{ fontFamily: fBody, fontSize: "0.82rem" }}>All Statuses</MenuItem>
                                {["Available", "Occupied", "Maintenance"].map(s => <MenuItem key={s} value={s} sx={{ fontFamily: fBody, fontSize: "0.82rem" }}>{s}</MenuItem>)}
                            </DInput>
                            <Typography sx={{ fontFamily: fBody, fontSize: "0.75rem", color: T.textMute, ml: "auto", alignSelf: "center" }}>{filteredHalls.length} hall{filteredHalls.length !== 1 ? "s" : ""}</Typography>
                        </Box>

                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TH>Seminar Hall</TH>
                                    <TH>Building</TH>
                                    <TH align="center">Capacity</TH>
                                    <TH align="center">Video Conf.</TH>
                                    <TH align="center">Smart Board</TH>
                                    <TH align="center">AC</TH>
                                    <TH>Status</TH>
                                    <TH align="right">Actions</TH>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredHalls.map(hall => (
                                    <TableRow key={hall.id} className={selectedHall?.id === hall.id ? "row-sel" : "row-h"} onClick={() => setSelectedHall(hall)} sx={{ cursor: "pointer" }}>
                                        <TD>
                                            <Box display="flex" alignItems="center" gap={1.2}>
                                                <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: STATUS_META[hall.status]?.color || T.textMute, flexShrink: 0 }} />
                                                <Box>
                                                    <Typography sx={{ fontFamily: fBody, fontWeight: 700, fontSize: "0.82rem", color: T.text }}>{hall.name}</Typography>
                                                    <Typography sx={{ fontFamily: fMono, fontSize: "0.68rem", color: T.textMute }}>{hall.id}</Typography>
                                                </Box>
                                            </Box>
                                        </TD>
                                        <TD sx={{ fontWeight: 600, color: T.text }}>{hall.building}</TD>
                                        <TD align="center">
                                            <Typography sx={{ fontFamily: fMono, fontWeight: 700, fontSize: "0.84rem", color: T.text }}>{hall.capacity}</Typography>
                                        </TD>
                                        {[hall.videoConferencing, hall.smartBoard, hall.ac].map((val, idx) => (
                                            <TD key={idx} align="center">
                                                {val ? <CheckCircle sx={{ fontSize: 16, color: T.success }} /> : <Cancel sx={{ fontSize: 16, color: T.border }} />}
                                            </TD>
                                        ))}
                                        <TD><StatusPill status={hall.status} /></TD>
                                        <TD align="right">
                                            <Tooltip title="Edit Hall">
                                                <IconButton size="small" sx={{ bgcolor: T.accentLight, color: T.accent, borderRadius: "7px", width: 28, height: 28, "&:hover": { bgcolor: "#D4D8FF" } }}
                                                    onClick={e => handleOpenEditModal(hall, e)}>
                                                    <Edit sx={{ fontSize: 14 }} />
                                                </IconButton>
                                            </Tooltip>
                                        </TD>
                                    </TableRow>
                                ))}
                                {filteredHalls.length === 0 && (
                                    <TableRow><TableCell colSpan={8} sx={{ textAlign: "center", py: 6, fontFamily: fBody, color: T.textMute }}>No seminar halls found matching your filters.</TableCell></TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </SCard>
                </Grid>

                {/* ── Detail Panel ── */}
                {selectedHall && (
                    <Grid item xs={12} md={4} className="fu">
                        <SCard sx={{ p: 0, overflow: "hidden", position: "sticky", top: 24 }}>
                            <Box sx={{ px: 2.5, py: 2, borderBottom: `1px solid ${T.border}`, bgcolor: "#FAFBFD", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                <Box>
                                    <Typography sx={{ fontFamily: fHead, fontWeight: 700, fontSize: "1.1rem", color: T.text }}>{selectedHall.name}</Typography>
                                    <Typography sx={{ fontFamily: fMono, fontSize: "0.75rem", color: T.textMute }}>{selectedHall.id}</Typography>
                                </Box>
                                <IconButton size="small" onClick={() => setSelectedHall(null)} sx={{ bgcolor: "#F1F5F9", borderRadius: "8px" }}><Close fontSize="small" /></IconButton>
                            </Box>

                            <Box sx={{ p: 2.5 }}>
                                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2.5}>
                                    <StatusPill status={selectedHall.status} />
                                    <Button size="small" variant="outlined" startIcon={<Edit sx={{ fontSize: 13 }} />} onClick={() => handleOpenEditModal(selectedHall, null)}
                                        sx={{ fontFamily: fBody, fontWeight: 700, fontSize: "0.73rem", textTransform: "none", borderRadius: "8px", borderColor: T.border, color: T.textSub, "&:hover": { borderColor: T.accent, color: T.accent } }}>
                                        Edit
                                    </Button>
                                </Box>

                                <Stack spacing={2} mb={2.5}>
                                    <Box display="flex" alignItems="center" gap={1.5}>
                                        <Box sx={{ p: 0.8, borderRadius: "7px", bgcolor: T.accentLight, color: T.accent, flexShrink: 0 }}><Business sx={{ fontSize: 15 }} /></Box>
                                        <Box><SLabel sx={{ mb: 0 }}>Location</SLabel><Typography sx={{ fontFamily: fBody, fontWeight: 600, fontSize: "0.82rem", color: T.text }}>{selectedHall.building}</Typography></Box>
                                    </Box>
                                    <Box display="flex" alignItems="center" gap={1.5}>
                                        <Box sx={{ p: 0.8, borderRadius: "7px", bgcolor: T.accentLight, color: T.accent, flexShrink: 0 }}><People sx={{ fontSize: 15 }} /></Box>
                                        <Box><SLabel sx={{ mb: 0 }}>Capacity</SLabel><Typography sx={{ fontFamily: fBody, fontWeight: 600, fontSize: "0.82rem", color: T.text }}>{selectedHall.capacity} Seats</Typography></Box>
                                    </Box>
                                </Stack>

                                <Divider sx={{ borderColor: T.border, mb: 2 }} />

                                <SLabel sx={{ mb: 1.2 }}>Equipment</SLabel>
                                <Stack spacing={0.8}>
                                    <AmenityChip active={selectedHall.videoConferencing} Icon={Videocam} label="Video Conferencing Suite" />
                                    <AmenityChip active={selectedHall.smartBoard} Icon={Dashboard} label="Interactive Smart Board" />
                                    <AmenityChip active={selectedHall.ac} Icon={AcUnit} label="Central Air Conditioning" />
                                </Stack>

                                <Box mt={2.5}>
                                    <Button fullWidth variant="outlined" startIcon={<EventNote sx={{ fontSize: 15 }} />}
                                        sx={{ fontFamily: fBody, fontWeight: 700, fontSize: "0.78rem", textTransform: "none", borderRadius: "9px", borderColor: T.border, color: T.textSub, py: 1, "&:hover": { borderColor: T.accent, color: T.accent, bgcolor: T.accentLight } }}>
                                        View Schedule
                                    </Button>
                                </Box>
                            </Box>
                        </SCard>
                    </Grid>
                )}
            </Grid>

            {/* ── Add / Edit Dialog ── */}
            <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: "16px", border: `1px solid ${T.border}` } }}>
                <DialogTitle sx={{ fontFamily: fHead, fontWeight: 700, fontSize: "1rem", color: T.text, borderBottom: `1px solid ${T.border}`, bgcolor: "#FAFBFD", pb: 2 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Box display="flex" alignItems="center" gap={1.2}>
                            <Box sx={{ width: 4, height: 22, borderRadius: 2, bgcolor: T.accent }} />
                            {modalMode === "add" ? "Add New Seminar Hall" : "Edit Seminar Hall"}
                        </Box>
                        <IconButton size="small" onClick={() => setIsModalOpen(false)} sx={{ bgcolor: "#F1F5F9", borderRadius: "8px" }}><Close fontSize="small" /></IconButton>
                    </Box>
                </DialogTitle>

                <DialogContent sx={{ px: 3, pt: 3, pb: 2 }}>
                    <Stack spacing={2.2}>
                        <Box>
                            <SLabel sx={{ mb: 0.7 }}>Hall ID</SLabel>
                            <DInput value={formData.id || ""} onChange={e => setFormData({ ...formData, id: e.target.value })} placeholder="e.g. SH-103" disabled={modalMode === "edit"} />
                        </Box>
                        <Box>
                            <SLabel sx={{ mb: 0.7 }}>Name *</SLabel>
                            <DInput value={formData.name || ""} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="e.g. Tech Seminar Room" />
                        </Box>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <SLabel sx={{ mb: 0.7 }}>Building *</SLabel>
                                <DInput select value={formData.building || ""} onChange={e => setFormData({ ...formData, building: e.target.value })}>
                                    <MenuItem value="" sx={{ fontFamily: fBody, fontSize: "0.82rem" }}>Select Building…</MenuItem>
                                    {["Block A", "Block B", "Block C"].map(b => <MenuItem key={b} value={b} sx={{ fontFamily: fBody, fontSize: "0.82rem" }}>{b}</MenuItem>)}
                                </DInput>
                            </Grid>
                            <Grid item xs={6}>
                                <SLabel sx={{ mb: 0.7 }}>Capacity</SLabel>
                                <DInput type="number" value={formData.capacity || ""} onChange={e => setFormData({ ...formData, capacity: parseInt(e.target.value) })} placeholder="100" />
                            </Grid>
                        </Grid>
                        <Box>
                            <SLabel sx={{ mb: 0.7 }}>Status</SLabel>
                            <DInput select value={formData.status || "Available"} onChange={e => setFormData({ ...formData, status: e.target.value })}>
                                {["Available", "Occupied", "Maintenance"].map(s => <MenuItem key={s} value={s} sx={{ fontFamily: fBody, fontSize: "0.82rem" }}>{s}</MenuItem>)}
                            </DInput>
                        </Box>
                        <Box>
                            <SLabel sx={{ mb: 1 }}>Equipment Options</SLabel>
                            <Stack direction="row" spacing={1} flexWrap="wrap">
                                {[
                                    { key: "videoConferencing", label: "Video Conferencing", Icon: Videocam },
                                    { key: "smartBoard", label: "Smart Board", Icon: Dashboard },
                                    { key: "ac", label: "Air Conditioning", Icon: AcUnit },
                                ].map(eq => (
                                    <Box key={eq.key} onClick={() => setFormData({ ...formData, [eq.key]: !formData[eq.key] })}
                                        sx={{
                                            display: "flex", alignItems: "center", gap: 0.8, px: 1.3, py: 0.8, borderRadius: "8px", cursor: "pointer", mb: 1,
                                            border: `1.5px solid ${formData[eq.key] ? T.success : T.border}`, bgcolor: formData[eq.key] ? T.successLight : "transparent", transition: "all 0.14s",
                                        }}>
                                        <eq.Icon sx={{ fontSize: 14, color: formData[eq.key] ? T.success : T.textMute }} />
                                        <Typography sx={{ fontFamily: fBody, fontSize: "0.76rem", fontWeight: formData[eq.key] ? 700 : 500, color: formData[eq.key] ? T.success : T.textSub }}>{eq.label}</Typography>
                                        {formData[eq.key] && <CheckCircle sx={{ fontSize: 13, color: T.success }} />}
                                    </Box>
                                ))}
                            </Stack>
                        </Box>
                    </Stack>
                </DialogContent>

                <DialogActions sx={{ px: 3, pb: 3, borderTop: `1px solid ${T.border}`, pt: 2, bgcolor: "#FAFBFD", gap: 1 }}>
                    <Button onClick={() => setIsModalOpen(false)} variant="outlined" sx={{ fontFamily: fBody, fontWeight: 600, fontSize: "0.8rem", textTransform: "none", borderRadius: "8px", borderColor: T.border, color: T.textSub }}>Cancel</Button>
                    <Button variant="contained" onClick={handleSave} sx={{ fontFamily: fBody, fontWeight: 700, fontSize: "0.8rem", textTransform: "none", borderRadius: "8px", bgcolor: T.accent, boxShadow: "none", "&:hover": { bgcolor: "#4F46E5", boxShadow: "none" } }}>
                        {modalMode === "add" ? "Save Seminar Hall" : "Save Changes"}
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar open={snack.open} autoHideDuration={3500} onClose={() => setSnack(s => ({ ...s, open: false }))} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
                <Alert severity={snack.severity} sx={{ borderRadius: "10px", fontFamily: fBody, fontWeight: 600 }} onClose={() => setSnack(s => ({ ...s, open: false }))}>{snack.msg}</Alert>
            </Snackbar>
        </Box>
    );
}