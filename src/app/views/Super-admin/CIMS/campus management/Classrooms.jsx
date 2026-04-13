import React, { useState } from "react";
import {
  Box, Grid, Typography, Button, Table, TableBody, TableCell,
  TableHead, TableRow, IconButton, Tooltip, Stack, Chip,
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, MenuItem, InputAdornment, Checkbox, FormControlLabel,
  Snackbar, Alert, Divider,
} from "@mui/material";
import {
  Add, Search, Edit, Close, Business, People,
  Info, CheckCircle, Cancel, AcUnit, Videocam,
  Dashboard, EventNote,
} from "@mui/icons-material";

/* ── Design Tokens (platform-consistent) ── */
const T = {
  bg:           "#F5F7FA",
  surface:      "#FFFFFF",
  border:       "#E4E8EF",
  accent:       "#6366F1",
  accentLight:  "#EEF2FF",
  success:      "#10B981",
  successLight: "#ECFDF5",
  warning:      "#F59E0B",
  warningLight: "#FFFBEB",
  danger:       "#EF4444",
  dangerLight:  "#FEF2F2",
  secondary:    "#64748B",
  secondaryLight:"#F1F5F9",
  text:         "#111827",
  textSub:      "#4B5563",
  textMute:     "#9CA3AF",
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
const CLASSROOMS_INIT = [
  { id: "CR-101", building: "Block A", capacity: 60,  type: "Lecture Hall",  status: "Available", projector: true,  smartBoard: true,  ac: true,  department: "Computer Science" },
  { id: "CR-102", building: "Block A", capacity: 40,  type: "Tutorial Room", status: "Occupied",   projector: false, smartBoard: false, ac: true,  department: "Mathematics"      },
  { id: "CR-205", building: "Block B", capacity: 120, type: "Auditorium",    status: "Maintenance",projector: true,  smartBoard: false, ac: true,  department: "General"          },
  { id: "CR-301", building: "Block C", capacity: 50,  type: "Lecture Hall",  status: "Available", projector: true,  smartBoard: false, ac: false, department: "Physics"          },
  { id: "CR-302", building: "Block C", capacity: 30,  type: "Seminar Room",  status: "Occupied",   projector: true,  smartBoard: true,  ac: true,  department: "Chemistry"        },
];

const STATUS_META = {
  Available:   { color: T.success,   bg: T.successLight   },
  Occupied:    { color: T.warning,   bg: T.warningLight   },
  Maintenance: { color: T.danger,    bg: T.dangerLight    },
};

const TYPE_META = {
  "Lecture Hall":  { color: T.accent,    bg: T.accentLight    },
  "Tutorial Room": { color: T.secondary, bg: T.secondaryLight },
  "Auditorium":    { color: "#7C3AED",   bg: "#F5F3FF"        },
  "Seminar Room":  { color: T.warning,   bg: T.warningLight   },
};

/* ── Primitives ── */
const SCard = ({ children, sx = {}, ...p }) => (
  <Box sx={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: "14px", ...sx }} {...p}>
    {children}
  </Box>
);

const SLabel = ({ children, sx = {} }) => (
  <Typography sx={{ fontFamily: fBody, fontSize: "0.67rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: T.textMute, mb: 0.5, ...sx }}>
    {children}
  </Typography>
);

const TH = ({ children, align }) => (
  <TableCell align={align} sx={{ fontFamily: fBody, fontWeight: 700, fontSize: "0.68rem", letterSpacing: "0.06em", textTransform: "uppercase", color: T.textMute, borderBottom: `1px solid ${T.border}`, py: 1.5, bgcolor: "#F9FAFB", whiteSpace: "nowrap" }}>
    {children}
  </TableCell>
);

const TD = ({ children, sx = {}, align }) => (
  <TableCell align={align} sx={{ fontFamily: fBody, fontSize: "0.81rem", color: T.textSub, borderBottom: `1px solid ${T.border}`, py: 1.8, ...sx }}>
    {children}
  </TableCell>
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
    "& .MuiInputLabel-root.Mui-focused": { color: T.accent },
    ...sx,
  }} />
);

/* ═══════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════ */
const Classrooms = () => {
  const [classrooms, setClassrooms]       = useState(CLASSROOMS_INIT);
  const [searchTerm, setSearchTerm]       = useState("");
  const [filterBuilding, setFilterBuilding] = useState("");
  const [filterStatus, setFilterStatus]   = useState("");
  const [filterCapacity, setFilterCapacity] = useState("");
  const [selectedRoom, setSelectedRoom]   = useState(null);
  const [isModalOpen, setIsModalOpen]     = useState(false);
  const [modalMode, setModalMode]         = useState("add");
  const [formData, setFormData]           = useState({});
  const [snack, setSnack]                 = useState({ open: false, msg: "", severity: "success" });

  const toast = (msg, severity = "success") => setSnack({ open: true, msg, severity });

  const uniqueBuildings = [...new Set(classrooms.map(r => r.building))];

  const filteredClassrooms = classrooms.filter(room => {
    const matchesSearch   = room.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            room.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            room.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBuilding = filterBuilding ? room.building === filterBuilding : true;
    const matchesStatus   = filterStatus   ? room.status   === filterStatus   : true;
    const matchesCapacity = filterCapacity ? room.capacity >= parseInt(filterCapacity) : true;
    return matchesSearch && matchesBuilding && matchesStatus && matchesCapacity;
  });

  const handleOpenAddModal = () => {
    setModalMode("add");
    setFormData({ projector: false, smartBoard: false, ac: false, status: "Available" });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (room, e) => {
    e && e.stopPropagation();
    setModalMode("edit");
    setFormData({ ...room });
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!formData.building) { toast("Please select a building.", "error"); return; }
    if (modalMode === "add") {
      const newRoom = { ...formData, id: formData.id || `CR-${Math.floor(Math.random() * 900) + 100}` };
      setClassrooms(prev => [...prev, newRoom]);
      toast(`Classroom "${newRoom.id}" added successfully.`);
    } else {
      setClassrooms(prev => prev.map(r => r.id === formData.id ? { ...r, ...formData } : r));
      if (selectedRoom?.id === formData.id) setSelectedRoom({ ...selectedRoom, ...formData });
      toast(`Classroom "${formData.id}" updated.`);
    }
    setIsModalOpen(false);
  };

  /* Stats */
  const availableCount   = classrooms.filter(r => r.status === "Available").length;
  const occupiedCount    = classrooms.filter(r => r.status === "Occupied").length;
  const maintenanceCount = classrooms.filter(r => r.status === "Maintenance").length;
  const totalCapacity    = classrooms.reduce((a, r) => a + r.capacity, 0);

  return (
    <Box sx={{ p: 3, bgcolor: T.bg, minHeight: "100vh", fontFamily: fBody }}>
      <Fonts />

      {/* ── Header ── */}
      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3} flexWrap="wrap" gap={2} className="fu">
        <Box>
          <Typography sx={{ fontFamily: fBody, fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: T.textMute, mb: 0.3 }}>
            Admin Dashboard · Infrastructure
          </Typography>
          <Typography sx={{ fontFamily: fHead, fontWeight: 700, fontSize: "1.5rem", color: T.text }}>
            Classrooms
          </Typography>
          <Typography sx={{ fontFamily: fBody, fontSize: "0.82rem", color: T.textSub, mt: 0.3 }}>
            Manage and monitor classroom availability and equipment.
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<Add sx={{ fontSize: 15 }} />} onClick={handleOpenAddModal}
          sx={{ fontFamily: fBody, fontWeight: 700, fontSize: "0.78rem", textTransform: "none", borderRadius: "9px", bgcolor: T.accent, boxShadow: "none", "&:hover": { bgcolor: "#4F46E5", boxShadow: "none" } }}>
          Add Classroom
        </Button>
      </Box>

      {/* ── Stat Strip ── */}
      <Grid container spacing={2} mb={3} className="fu1">
        {[
          { label: "Available",   value: availableCount,   sub: "Ready for use",    color: T.success,   Icon: CheckCircle },
          { label: "Occupied",    value: occupiedCount,    sub: "Currently in use", color: T.warning,   Icon: People      },
          { label: "Maintenance", value: maintenanceCount, sub: "Under service",    color: T.danger,    Icon: Cancel      },
          { label: "Total Seats", value: totalCapacity,    sub: "Across all rooms", color: T.secondary, Icon: People      },
        ].map((s, i) => (
          <Grid item xs={6} md={3} key={i}>
            <SCard sx={{ p: 2.5 }}>
              <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                <Box>
                  <SLabel>{s.label}</SLabel>
                  <Typography sx={{ fontFamily: fMono, fontWeight: 700, fontSize: "1.7rem", color: s.color, lineHeight: 1.1 }}>{s.value}</Typography>
                  <Typography sx={{ fontFamily: fBody, fontSize: "0.7rem", color: T.textMute, mt: 0.3 }}>{s.sub}</Typography>
                </Box>
                <Box sx={{ p: 1.1, borderRadius: "10px", bgcolor: `${s.color}15`, color: s.color }}>
                  <s.Icon sx={{ fontSize: 20 }} />
                </Box>
              </Box>
            </SCard>
          </Grid>
        ))}
      </Grid>

      {/* ── Main Content ── */}
      <Grid container spacing={2.5}>

        {/* ── Table ── */}
        <Grid item xs={12} md={selectedRoom ? 8 : 12}>
          <SCard sx={{ overflow: "hidden" }}>
            {/* Toolbar */}
            <Box sx={{ px: 2.5, py: 2, borderBottom: `1px solid ${T.border}`, bgcolor: "#FAFBFD", display: "flex", gap: 1.5, flexWrap: "wrap", alignItems: "center" }}>
              <TextField size="small" placeholder="Search room, dept, or type…" value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                InputProps={{ startAdornment: <InputAdornment position="start"><Search sx={{ fontSize: 15, color: T.textMute }} /></InputAdornment> }}
                sx={{ width: 230, "& .MuiOutlinedInput-root": { borderRadius: "8px", fontFamily: fBody, fontSize: "0.8rem", "& fieldset": { borderColor: T.border }, "&.Mui-focused fieldset": { borderColor: T.accent } } }}
              />
              <DInput select value={filterBuilding} onChange={e => setFilterBuilding(e.target.value)} sx={{ width: 140 }}>
                <MenuItem value="" sx={{ fontFamily: fBody, fontSize: "0.82rem" }}>All Buildings</MenuItem>
                {uniqueBuildings.map(b => (
                  <MenuItem key={b} value={b} sx={{ fontFamily: fBody, fontSize: "0.82rem" }}>{b}</MenuItem>
                ))}
              </DInput>
              <DInput select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} sx={{ width: 140 }}>
                <MenuItem value="" sx={{ fontFamily: fBody, fontSize: "0.82rem" }}>All Statuses</MenuItem>
                {["Available", "Occupied", "Maintenance"].map(s => (
                  <MenuItem key={s} value={s} sx={{ fontFamily: fBody, fontSize: "0.82rem" }}>{s}</MenuItem>
                ))}
              </DInput>
              <DInput select value={filterCapacity} onChange={e => setFilterCapacity(e.target.value)} sx={{ width: 145 }}>
                <MenuItem value="" sx={{ fontFamily: fBody, fontSize: "0.82rem" }}>Any Capacity</MenuItem>
                {[["30", "30+ Seats"], ["50", "50+ Seats"], ["100", "100+ Seats"]].map(([v, l]) => (
                  <MenuItem key={v} value={v} sx={{ fontFamily: fBody, fontSize: "0.82rem" }}>{l}</MenuItem>
                ))}
              </DInput>
              <Typography sx={{ fontFamily: fBody, fontSize: "0.75rem", color: T.textMute, ml: "auto", alignSelf: "center" }}>
                {filteredClassrooms.length} room{filteredClassrooms.length !== 1 ? "s" : ""}
              </Typography>
            </Box>

            <Table>
              <TableHead>
                <TableRow>
                  <TH>Room</TH>
                  <TH>Building · Type</TH>
                  <TH align="center">Capacity</TH>
                  <TH align="center">Projector</TH>
                  <TH align="center">Smart Board</TH>
                  <TH align="center">AC</TH>
                  <TH>Status</TH>
                  <TH align="right">Actions</TH>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredClassrooms.map(room => {
                  const typeMeta = TYPE_META[room.type] || { color: T.secondary, bg: T.secondaryLight };
                  return (
                    <TableRow
                      key={room.id}
                      className={selectedRoom?.id === room.id ? "row-sel" : "row-h"}
                      onClick={() => setSelectedRoom(room)}
                      sx={{ cursor: "pointer" }}
                    >
                      <TD>
                        <Box display="flex" alignItems="center" gap={1.2}>
                          <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: STATUS_META[room.status]?.color || T.textMute, flexShrink: 0 }} />
                          <Typography sx={{ fontFamily: fMono, fontWeight: 700, fontSize: "0.82rem", color: T.text }}>{room.id}</Typography>
                        </Box>
                        <Typography sx={{ fontFamily: fBody, fontSize: "0.68rem", color: T.textMute, ml: 2.5 }}>{room.department}</Typography>
                      </TD>
                      <TD>
                        <Typography sx={{ fontFamily: fBody, fontWeight: 600, fontSize: "0.8rem", color: T.text }}>{room.building}</Typography>
                        <Box sx={{ px: 0.9, py: 0.15, borderRadius: "5px", bgcolor: typeMeta.bg, display: "inline-block", mt: 0.3 }}>
                          <Typography sx={{ fontFamily: fBody, fontSize: "0.64rem", fontWeight: 700, color: typeMeta.color }}>{room.type}</Typography>
                        </Box>
                      </TD>
                      <TD align="center">
                        <Typography sx={{ fontFamily: fMono, fontWeight: 700, fontSize: "0.84rem", color: T.text }}>{room.capacity}</Typography>
                        <Typography sx={{ fontFamily: fBody, fontSize: "0.65rem", color: T.textMute }}>seats</Typography>
                      </TD>
                      {[room.projector, room.smartBoard, room.ac].map((val, idx) => (
                        <TD key={idx} align="center">
                          {val
                            ? <CheckCircle sx={{ fontSize: 16, color: T.success }} />
                            : <Cancel      sx={{ fontSize: 16, color: T.border  }} />
                          }
                        </TD>
                      ))}
                      <TD><StatusPill status={room.status} /></TD>
                      <TD align="right">
                        <Tooltip title="Edit classroom">
                          <IconButton size="small"
                            sx={{ bgcolor: T.accentLight, color: T.accent, borderRadius: "7px", width: 28, height: 28, "&:hover": { bgcolor: "#D4D8FF" } }}
                            onClick={e => handleOpenEditModal(room, e)}>
                            <Edit sx={{ fontSize: 14 }} />
                          </IconButton>
                        </Tooltip>
                      </TD>
                    </TableRow>
                  );
                })}
                {filteredClassrooms.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} sx={{ textAlign: "center", py: 6, fontFamily: fBody, color: T.textMute }}>
                      No classrooms found matching your filters.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </SCard>
        </Grid>

        {/* ── Detail Panel ── */}
        {selectedRoom && (
          <Grid item xs={12} md={4} className="fu">
            <SCard sx={{ p: 0, overflow: "hidden", position: "sticky", top: 24 }}>
              {/* Panel header */}
              <Box sx={{ px: 2.5, py: 2, borderBottom: `1px solid ${T.border}`, bgcolor: "#FAFBFD", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <Box>
                  <Typography sx={{ fontFamily: fMono, fontWeight: 700, fontSize: "1.1rem", color: T.text }}>{selectedRoom.id}</Typography>
                  <Typography sx={{ fontFamily: fBody, fontSize: "0.75rem", color: T.textMute }}>{selectedRoom.department}</Typography>
                </Box>
                <IconButton size="small" onClick={() => setSelectedRoom(null)} sx={{ bgcolor: "#F1F5F9", borderRadius: "8px" }}>
                  <Close fontSize="small" />
                </IconButton>
              </Box>

              <Box sx={{ p: 2.5 }}>
                {/* Status + Edit */}
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2.5}>
                  <StatusPill status={selectedRoom.status} />
                  <Button size="small" variant="outlined" startIcon={<Edit sx={{ fontSize: 13 }} />}
                    onClick={() => handleOpenEditModal(selectedRoom, null)}
                    sx={{ fontFamily: fBody, fontWeight: 700, fontSize: "0.73rem", textTransform: "none", borderRadius: "8px", borderColor: T.border, color: T.textSub, "&:hover": { borderColor: T.accent, color: T.accent } }}>
                    Edit
                  </Button>
                </Box>

                {/* Room Info */}
                <Stack spacing={2} mb={2.5}>
                  {[
                    { Icon: Business, label: "Building",   value: selectedRoom.building   },
                    { Icon: People,   label: "Capacity",   value: `${selectedRoom.capacity} Seats` },
                    { Icon: Info,     label: "Room Type",  value: selectedRoom.type        },
                  ].map(({ Icon, label, value }) => (
                    <Box key={label} display="flex" alignItems="center" gap={1.5}>
                      <Box sx={{ p: 0.8, borderRadius: "7px", bgcolor: T.accentLight, color: T.accent, flexShrink: 0 }}>
                        <Icon sx={{ fontSize: 15 }} />
                      </Box>
                      <Box>
                        <SLabel sx={{ mb: 0 }}>{label}</SLabel>
                        <Typography sx={{ fontFamily: fBody, fontWeight: 600, fontSize: "0.82rem", color: T.text }}>{value}</Typography>
                      </Box>
                    </Box>
                  ))}
                </Stack>

                <Divider sx={{ borderColor: T.border, mb: 2 }} />

                {/* Amenities */}
                <SLabel sx={{ mb: 1.2 }}>Equipment & Amenities</SLabel>
                <Stack spacing={0.8}>
                  <AmenityChip active={selectedRoom.projector}   Icon={Videocam}   label="Projector"    />
                  <AmenityChip active={selectedRoom.smartBoard}  Icon={Dashboard}  label="Smart Board"  />
                  <AmenityChip active={selectedRoom.ac}          Icon={AcUnit}     label="Air Conditioning" />
                </Stack>

                {/* View Schedule btn */}
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
      <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} maxWidth="sm" fullWidth
        PaperProps={{ sx: { borderRadius: "16px", border: `1px solid ${T.border}` } }}>
        <DialogTitle sx={{ fontFamily: fHead, fontWeight: 700, fontSize: "1rem", color: T.text, borderBottom: `1px solid ${T.border}`, bgcolor: "#FAFBFD", pb: 2 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box display="flex" alignItems="center" gap={1.2}>
              <Box sx={{ width: 4, height: 22, borderRadius: 2, bgcolor: T.accent }} />
              {modalMode === "add" ? "Add New Classroom" : "Edit Classroom"}
            </Box>
            <IconButton size="small" onClick={() => setIsModalOpen(false)} sx={{ bgcolor: "#F1F5F9", borderRadius: "8px" }}>
              <Close fontSize="small" />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ px: 3, pt: 3, pb: 2 }}>
          <Stack spacing={2.2}>
            {/* Room ID — only editable on add */}
            <Box>
              <SLabel sx={{ mb: 0.7 }}>Room ID</SLabel>
              <DInput
                value={formData.id || ""}
                onChange={e => setFormData({ ...formData, id: e.target.value })}
                placeholder="e.g. CR-401"
                disabled={modalMode === "edit"}
              />
            </Box>

            {/* Building */}
            <Box>
              <SLabel sx={{ mb: 0.7 }}>Building *</SLabel>
              <DInput select value={formData.building || ""} onChange={e => setFormData({ ...formData, building: e.target.value })}>
                <MenuItem value="" sx={{ fontFamily: fBody, fontSize: "0.82rem" }}>Select Building…</MenuItem>
                {["Block A", "Block B", "Block C", "Block D", "Block E"].map(b => (
                  <MenuItem key={b} value={b} sx={{ fontFamily: fBody, fontSize: "0.82rem" }}>{b}</MenuItem>
                ))}
              </DInput>
            </Box>

            {/* Room Type */}
            <Box>
              <SLabel sx={{ mb: 0.7 }}>Room Type</SLabel>
              <DInput select value={formData.type || ""} onChange={e => setFormData({ ...formData, type: e.target.value })}>
                <MenuItem value="" sx={{ fontFamily: fBody, fontSize: "0.82rem" }}>Select Type…</MenuItem>
                {["Lecture Hall", "Tutorial Room", "Auditorium", "Seminar Room", "Lab"].map(t => (
                  <MenuItem key={t} value={t} sx={{ fontFamily: fBody, fontSize: "0.82rem" }}>{t}</MenuItem>
                ))}
              </DInput>
            </Box>

            {/* Capacity + Department */}
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <SLabel sx={{ mb: 0.7 }}>Capacity (Seats)</SLabel>
                <DInput type="number" value={formData.capacity || ""} onChange={e => setFormData({ ...formData, capacity: parseInt(e.target.value) })} placeholder="60" />
              </Grid>
              <Grid item xs={6}>
                <SLabel sx={{ mb: 0.7 }}>Department</SLabel>
                <DInput value={formData.department || ""} onChange={e => setFormData({ ...formData, department: e.target.value })} placeholder="e.g. Computer Science" />
              </Grid>
            </Grid>

            {/* Status */}
            <Box>
              <SLabel sx={{ mb: 0.7 }}>Status</SLabel>
              <DInput select value={formData.status || "Available"} onChange={e => setFormData({ ...formData, status: e.target.value })}>
                {["Available", "Occupied", "Maintenance"].map(s => (
                  <MenuItem key={s} value={s} sx={{ fontFamily: fBody, fontSize: "0.82rem" }}>{s}</MenuItem>
                ))}
              </DInput>
            </Box>

            {/* Equipment checkboxes */}
            <Box>
              <SLabel sx={{ mb: 1 }}>Equipment</SLabel>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                {[
                  { key: "projector",  label: "Projector",         Icon: Videocam  },
                  { key: "smartBoard", label: "Smart Board",        Icon: Dashboard },
                  { key: "ac",         label: "Air Conditioning",   Icon: AcUnit    },
                ].map(eq => (
                  <Box key={eq.key}
                    onClick={() => setFormData({ ...formData, [eq.key]: !formData[eq.key] })}
                    sx={{
                      display: "flex", alignItems: "center", gap: 0.8, px: 1.3, py: 0.8,
                      borderRadius: "8px", cursor: "pointer", mb: 1,
                      border: `1.5px solid ${formData[eq.key] ? T.success : T.border}`,
                      bgcolor: formData[eq.key] ? T.successLight : "transparent",
                      transition: "all 0.14s",
                    }}>
                    <eq.Icon sx={{ fontSize: 14, color: formData[eq.key] ? T.success : T.textMute }} />
                    <Typography sx={{ fontFamily: fBody, fontSize: "0.76rem", fontWeight: formData[eq.key] ? 700 : 500, color: formData[eq.key] ? T.success : T.textSub }}>
                      {eq.label}
                    </Typography>
                    {formData[eq.key] && <CheckCircle sx={{ fontSize: 13, color: T.success }} />}
                  </Box>
                ))}
              </Stack>
            </Box>
          </Stack>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3, borderTop: `1px solid ${T.border}`, pt: 2, bgcolor: "#FAFBFD", gap: 1 }}>
          <Button onClick={() => setIsModalOpen(false)} variant="outlined"
            sx={{ fontFamily: fBody, fontWeight: 600, fontSize: "0.8rem", textTransform: "none", borderRadius: "8px", borderColor: T.border, color: T.textSub }}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleSave}
            sx={{ fontFamily: fBody, fontWeight: 700, fontSize: "0.8rem", textTransform: "none", borderRadius: "8px", bgcolor: T.accent, boxShadow: "none", "&:hover": { bgcolor: "#4F46E5", boxShadow: "none" } }}>
            {modalMode === "add" ? "Save Classroom" : "Save Changes"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar open={snack.open} autoHideDuration={3500} onClose={() => setSnack(s => ({ ...s, open: false }))} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <Alert severity={snack.severity} sx={{ borderRadius: "10px", fontFamily: fBody, fontWeight: 600 }} onClose={() => setSnack(s => ({ ...s, open: false }))}>
          {snack.msg}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Classrooms;
