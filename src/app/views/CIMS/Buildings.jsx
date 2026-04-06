import React, { useState } from "react";
import {
  Box, Grid, Typography, Button, Table, TableBody, TableCell,
  TableHead, TableRow, IconButton, Tooltip, Stack,
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, MenuItem, InputAdornment, Snackbar, Alert,
} from "@mui/material";
import {
  Add, Search, Edit, Close, LocationOn, Layers,
  DoorOpen, Business,
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
const BUILDINGS_INIT = [
  { id: "BLD-01", name: "Main Academic Block",      code: "Block A", floors: 5, totalRooms: 45, status: "Active",             location: "North Campus" },
  { id: "BLD-02", name: "Science & Research Center", code: "Block B", floors: 4, totalRooms: 32, status: "Active",             location: "East Campus"  },
  { id: "BLD-03", name: "Central Library",           code: "Block C", floors: 3, totalRooms: 15, status: "Maintenance",        location: "Center Campus"},
  { id: "BLD-04", name: "Engineering Annex",         code: "Block D", floors: 6, totalRooms: 60, status: "Active",             location: "South Campus" },
  { id: "BLD-05", name: "New Innovation Hub",        code: "Block E", floors: 2, totalRooms: 10, status: "Under Construction", location: "West Campus"  },
];

const STATUS_META = {
  Active:               { color: T.success, bg: T.successLight },
  Maintenance:          { color: T.warning, bg: T.warningLight },
  "Under Construction": { color: T.secondary, bg: T.secondaryLight },
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

const DInput = ({ sx = {}, ...props }) => (
  <TextField size="small" fullWidth {...props} sx={{
    "& .MuiOutlinedInput-root": { borderRadius: "8px", fontFamily: fBody, fontSize: "0.82rem", bgcolor: T.surface, "& fieldset": { borderColor: T.border }, "&.Mui-focused fieldset": { borderColor: T.accent } },
    "& .MuiInputLabel-root.Mui-focused": { color: T.accent },
    ...sx,
  }} />
);

const DetailRow = ({ Icon, label, value }) => (
  <Box display="flex" alignItems="center" gap={1.5}>
    <Box sx={{ p: 0.8, borderRadius: "7px", bgcolor: T.accentLight, color: T.accent, flexShrink: 0 }}>
      <Icon sx={{ fontSize: 15 }} />
    </Box>
    <Box>
      <SLabel sx={{ mb: 0 }}>{label}</SLabel>
      <Typography sx={{ fontFamily: fBody, fontWeight: 600, fontSize: "0.82rem", color: T.text }}>{value}</Typography>
    </Box>
  </Box>
);

/* ═══════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════ */
const Buildings = () => {
  const [buildings, setBuildings]         = useState(BUILDINGS_INIT);
  const [searchTerm, setSearchTerm]       = useState("");
  const [filterStatus, setFilterStatus]   = useState("");
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [isModalOpen, setIsModalOpen]     = useState(false);
  const [modalMode, setModalMode]         = useState("add");
  const [formData, setFormData]           = useState({});
  const [snack, setSnack]                 = useState({ open: false, msg: "", severity: "success" });

  const toast = (msg, severity = "success") => setSnack({ open: true, msg, severity });

  const filteredBuildings = buildings.filter(bld => {
    const matchesSearch = bld.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          bld.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus ? bld.status === filterStatus : true;
    return matchesSearch && matchesStatus;
  });

  const handleOpenAddModal = () => {
    setModalMode("add");
    setFormData({ status: "Active" });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (bld, e) => {
    e && e.stopPropagation();
    setModalMode("edit");
    setFormData({ ...bld });
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!formData.name || !formData.code) { toast("Name and Code are required.", "error"); return; }
    if (modalMode === "add") {
      const newBld = { ...formData, id: `BLD-${String(buildings.length + 1).padStart(2, "0")}` };
      setBuildings(prev => [...prev, newBld]);
      toast(`Building "${newBld.name}" added successfully.`);
    } else {
      setBuildings(prev => prev.map(b => b.id === formData.id ? { ...b, ...formData } : b));
      if (selectedBuilding?.id === formData.id) setSelectedBuilding({ ...selectedBuilding, ...formData });
      toast(`Building "${formData.name}" updated.`);
    }
    setIsModalOpen(false);
  };

  /* Stats */
  const totalRooms    = buildings.reduce((a, b) => a + b.totalRooms, 0);
  const activeCount   = buildings.filter(b => b.status === "Active").length;
  const maintenanceCount = buildings.filter(b => b.status === "Maintenance").length;

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
            Buildings Management
          </Typography>
          <Typography sx={{ fontFamily: fBody, fontSize: "0.82rem", color: T.textSub, mt: 0.3 }}>
            Manage campus buildings, floors, and overall room capacities.
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<Add sx={{ fontSize: 15 }} />} onClick={handleOpenAddModal}
          sx={{ fontFamily: fBody, fontWeight: 700, fontSize: "0.78rem", textTransform: "none", borderRadius: "9px", bgcolor: T.accent, boxShadow: "none", "&:hover": { bgcolor: "#4F46E5", boxShadow: "none" } }}>
          Add Building
        </Button>
      </Box>

      {/* ── Stat Strip ── */}
      <Grid container spacing={2} mb={3} className="fu1">
        {[
          { label: "Total Buildings", value: buildings.length,   sub: "Campus-wide",       color: T.accent,   Icon: Business   },
          { label: "Active",          value: activeCount,        sub: "Operational now",   color: T.success,  Icon: Business   },
          { label: "Maintenance",     value: maintenanceCount,   sub: "Under service",     color: T.warning,  Icon: Business   },
          { label: "Total Rooms",     value: totalRooms,         sub: "Across all blocks", color: T.secondary,Icon: DoorOpen   },
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
        <Grid item xs={12} md={selectedBuilding ? 8 : 12}>
          <SCard sx={{ overflow: "hidden" }}>
            {/* Toolbar */}
            <Box sx={{ px: 2.5, py: 2, borderBottom: `1px solid ${T.border}`, bgcolor: "#FAFBFD", display: "flex", gap: 1.5, flexWrap: "wrap", alignItems: "center" }}>
              <TextField size="small" placeholder="Search by name or code…" value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                InputProps={{ startAdornment: <InputAdornment position="start"><Search sx={{ fontSize: 15, color: T.textMute }} /></InputAdornment> }}
                sx={{ width: 220, "& .MuiOutlinedInput-root": { borderRadius: "8px", fontFamily: fBody, fontSize: "0.8rem", "& fieldset": { borderColor: T.border }, "&.Mui-focused fieldset": { borderColor: T.accent } } }}
              />
              <DInput select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} sx={{ width: 160 }}>
                <MenuItem value="" sx={{ fontFamily: fBody, fontSize: "0.82rem" }}>All Statuses</MenuItem>
                {["Active", "Maintenance", "Under Construction"].map(s => (
                  <MenuItem key={s} value={s} sx={{ fontFamily: fBody, fontSize: "0.82rem" }}>{s}</MenuItem>
                ))}
              </DInput>
              <Typography sx={{ fontFamily: fBody, fontSize: "0.75rem", color: T.textMute, ml: "auto", alignSelf: "center" }}>
                {filteredBuildings.length} building{filteredBuildings.length !== 1 ? "s" : ""}
              </Typography>
            </Box>

            <Table>
              <TableHead>
                <TableRow>
                  <TH>Code</TH>
                  <TH>Building Name</TH>
                  <TH>Location</TH>
                  <TH align="center">Floors</TH>
                  <TH align="center">Total Rooms</TH>
                  <TH>Status</TH>
                  <TH align="right">Actions</TH>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredBuildings.map(bld => (
                  <TableRow
                    key={bld.id}
                    className={selectedBuilding?.id === bld.id ? "row-sel" : "row-h"}
                    onClick={() => setSelectedBuilding(bld)}
                    sx={{ cursor: "pointer" }}
                  >
                    <TD>
                      <Box sx={{ px: 1, py: 0.25, borderRadius: "6px", bgcolor: T.accentLight, display: "inline-block" }}>
                        <Typography sx={{ fontFamily: fMono, fontSize: "0.72rem", fontWeight: 700, color: T.accent }}>{bld.code}</Typography>
                      </Box>
                    </TD>
                    <TD sx={{ fontWeight: 700, color: T.text }}>{bld.name}</TD>
                    <TD>
                      <Box display="flex" alignItems="center" gap={0.7}>
                        <LocationOn sx={{ fontSize: 13, color: T.textMute }} />
                        <Typography sx={{ fontFamily: fBody, fontSize: "0.79rem" }}>{bld.location}</Typography>
                      </Box>
                    </TD>
                    <TD align="center">
                      <Typography sx={{ fontFamily: fMono, fontWeight: 600, fontSize: "0.82rem", color: T.text }}>{bld.floors}</Typography>
                    </TD>
                    <TD align="center">
                      <Typography sx={{ fontFamily: fMono, fontWeight: 600, fontSize: "0.82rem", color: T.text }}>{bld.totalRooms}</Typography>
                    </TD>
                    <TD><StatusPill status={bld.status} /></TD>
                    <TD align="right">
                      <Tooltip title="Edit building">
                        <IconButton size="small"
                          sx={{ bgcolor: T.accentLight, color: T.accent, borderRadius: "7px", width: 28, height: 28, "&:hover": { bgcolor: "#D4D8FF" } }}
                          onClick={e => handleOpenEditModal(bld, e)}>
                          <Edit sx={{ fontSize: 14 }} />
                        </IconButton>
                      </Tooltip>
                    </TD>
                  </TableRow>
                ))}
                {filteredBuildings.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} sx={{ textAlign: "center", py: 6, fontFamily: fBody, color: T.textMute }}>
                      No buildings found matching your filters.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </SCard>
        </Grid>

        {/* ── Detail Panel ── */}
        {selectedBuilding && (
          <Grid item xs={12} md={4} className="fu">
            <SCard sx={{ p: 0, overflow: "hidden", position: "sticky", top: 24 }}>
              {/* Panel header */}
              <Box sx={{ px: 2.5, py: 2, borderBottom: `1px solid ${T.border}`, bgcolor: "#FAFBFD", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <Box>
                  <Box sx={{ px: 1.2, py: 0.3, borderRadius: "6px", bgcolor: T.accentLight, display: "inline-block", mb: 0.7 }}>
                    <Typography sx={{ fontFamily: fMono, fontSize: "0.72rem", fontWeight: 700, color: T.accent }}>{selectedBuilding.code}</Typography>
                  </Box>
                  <Typography sx={{ fontFamily: fHead, fontWeight: 700, fontSize: "1rem", color: T.text }}>{selectedBuilding.name}</Typography>
                </Box>
                <IconButton size="small" onClick={() => setSelectedBuilding(null)}
                  sx={{ bgcolor: "#F1F5F9", borderRadius: "8px" }}>
                  <Close fontSize="small" />
                </IconButton>
              </Box>

              <Box sx={{ p: 2.5 }}>
                {/* Status + Edit row */}
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                  <StatusPill status={selectedBuilding.status} />
                  <Button size="small" variant="outlined" startIcon={<Edit sx={{ fontSize: 13 }} />}
                    onClick={() => handleOpenEditModal(selectedBuilding, null)}
                    sx={{ fontFamily: fBody, fontWeight: 700, fontSize: "0.73rem", textTransform: "none", borderRadius: "8px", borderColor: T.border, color: T.textSub, "&:hover": { borderColor: T.accent, color: T.accent } }}>
                    Edit
                  </Button>
                </Box>

                {/* Details */}
                <Stack spacing={2} mb={3}>
                  <DetailRow Icon={LocationOn} label="Location"   value={selectedBuilding.location} />
                  <DetailRow Icon={Layers}     label="Floors"     value={`${selectedBuilding.floors} Floor${selectedBuilding.floors !== 1 ? "s" : ""}`} />
                  <DetailRow Icon={DoorOpen}   label="Total Rooms" value={`${selectedBuilding.totalRooms} Rooms`} />
                </Stack>

                {/* Summary bar */}
                <Box sx={{ p: 2, borderRadius: "10px", bgcolor: T.accentLight, border: `1px solid ${T.accent}25` }}>
                  <Box display="flex" justifyContent="space-between" mb={0.5}>
                    <Typography sx={{ fontFamily: fBody, fontSize: "0.74rem", color: T.textSub }}>Avg. rooms / floor</Typography>
                    <Typography sx={{ fontFamily: fMono, fontWeight: 700, fontSize: "0.78rem", color: T.accent }}>
                      {Math.round(selectedBuilding.totalRooms / selectedBuilding.floors)}
                    </Typography>
                  </Box>
                  <Box sx={{ height: 5, borderRadius: 99, bgcolor: `${T.accent}25`, overflow: "hidden" }}>
                    <Box sx={{ height: "100%", width: `${Math.min((selectedBuilding.totalRooms / 60) * 100, 100)}%`, borderRadius: 99, bgcolor: T.accent }} />
                  </Box>
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
              {modalMode === "add" ? "Add New Building" : "Edit Building"}
            </Box>
            <IconButton size="small" onClick={() => setIsModalOpen(false)} sx={{ bgcolor: "#F1F5F9", borderRadius: "8px" }}>
              <Close fontSize="small" />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ px: 3, pt: 3, pb: 2 }}>
          <Stack spacing={2.2}>
            <Box>
              <SLabel sx={{ mb: 0.7 }}>Block Code *</SLabel>
              <DInput value={formData.code || ""} onChange={e => setFormData({ ...formData, code: e.target.value })} placeholder="e.g. Block A" />
            </Box>
            <Box>
              <SLabel sx={{ mb: 0.7 }}>Building Name *</SLabel>
              <DInput value={formData.name || ""} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="e.g. Main Academic Block" />
            </Box>
            <Box>
              <SLabel sx={{ mb: 0.7 }}>Location</SLabel>
              <DInput value={formData.location || ""} onChange={e => setFormData({ ...formData, location: e.target.value })} placeholder="e.g. North Campus" />
            </Box>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <SLabel sx={{ mb: 0.7 }}>Number of Floors</SLabel>
                <DInput type="number" value={formData.floors || ""} onChange={e => setFormData({ ...formData, floors: parseInt(e.target.value) })} placeholder="5" />
              </Grid>
              <Grid item xs={6}>
                <SLabel sx={{ mb: 0.7 }}>Total Rooms</SLabel>
                <DInput type="number" value={formData.totalRooms || ""} onChange={e => setFormData({ ...formData, totalRooms: parseInt(e.target.value) })} placeholder="45" />
              </Grid>
            </Grid>
            <Box>
              <SLabel sx={{ mb: 0.7 }}>Status</SLabel>
              <DInput select value={formData.status || "Active"} onChange={e => setFormData({ ...formData, status: e.target.value })}>
                {["Active", "Maintenance", "Under Construction"].map(s => (
                  <MenuItem key={s} value={s} sx={{ fontFamily: fBody, fontSize: "0.82rem" }}>{s}</MenuItem>
                ))}
              </DInput>
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
            {modalMode === "add" ? "Save Building" : "Save Changes"}
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

export default Buildings;
