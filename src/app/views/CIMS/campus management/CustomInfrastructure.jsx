import React, { useState } from "react";
import {
    Box, Grid, Typography, Button, IconButton, Tooltip, Stack,
    Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, MenuItem, InputAdornment, Snackbar, Alert, Divider, Badge
} from "@mui/material";
import {
    Add, Search, Edit, Close, DeleteOutline,
    Category, LocationOn, People, SettingsSuggest,
    DragIndicator, AddCircleOutline
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
    .cat-item:hover { background: #F9FAFB; transition: background 0.15s; }
    .cat-active { background: #EEF2FF !important; border-right: 3px solid #6366F1; }
    .fac-card { transition: all 0.2s ease; border: 1px solid ${T.border}; }
    .fac-card:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.05); border-color: ${T.accent}50; }
  `}</style>
);

/* ── Mock Data ── */
const INIT_CATEGORIES = [
    { id: "cat-1", name: "Sports Facilities", description: "Indoor and outdoor sports areas" },
    { id: "cat-2", name: "Cafeterias", description: "Dining and food courts" },
    { id: "cat-3", name: "Libraries", description: "Reading rooms and book storage" },
];

const INIT_FACILITIES = [
    { id: "fac-1", categoryId: "cat-1", name: "Main Basketball Court", location: "Sports Complex", capacity: 200, status: "Available", customAttributes: [{ key: "Surface", value: "Wooden" }, { key: "Lighting", value: "LED Floodlights" }] },
    { id: "fac-2", categoryId: "cat-1", name: "Swimming Pool", location: "Sports Complex", capacity: 50, status: "Maintenance", customAttributes: [{ key: "Type", value: "Olympic Size" }, { key: "Heated", value: "Yes" }] },
    { id: "fac-3", categoryId: "cat-2", name: "Central Canteen", location: "Student Center", capacity: 300, status: "Available", customAttributes: [{ key: "Cuisine", value: "Multi-cuisine" }, { key: "Operating Hours", value: "8 AM - 10 PM" }] }
];

const STATUS_META = {
    Available: { color: T.success, bg: T.successLight },
    Occupied: { color: T.warning, bg: T.warningLight },
    Maintenance: { color: T.danger, bg: T.dangerLight },
};

/* ── Primitives ── */
const SCard = ({ children, sx = {}, className = "", ...p }) => (
    <Box className={className} sx={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: "14px", ...sx }} {...p}>{children}</Box>
);

const SLabel = ({ children, sx = {} }) => (
    <Typography sx={{ fontFamily: fBody, fontSize: "0.67rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: T.textMute, mb: 0.5, ...sx }}>{children}</Typography>
);

const StatusPill = ({ status }) => {
    const s = STATUS_META[status] || { color: T.textMute, bg: "#F1F5F9" };
    return (
        <Box display="flex" alignItems="center" gap={0.6} sx={{ px: 1, py: 0.25, borderRadius: "6px", bgcolor: s.bg, width: "fit-content" }}>
            <Box sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: s.color }} />
            <Typography sx={{ fontFamily: fBody, fontSize: "0.68rem", fontWeight: 700, color: s.color }}>{status}</Typography>
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
export default function CustomInfrastructure() {
    const [categories, setCategories] = useState(INIT_CATEGORIES);
    const [facilities, setFacilities] = useState(INIT_FACILITIES);
    const [selectedCatId, setSelectedCatId] = useState(categories[0]?.id || "");
    const [searchQuery, setSearchQuery] = useState("");

    // Modals
    const [catModal, setCatModal] = useState({ open: false, mode: "add", data: {} });
    const [facModal, setFacModal] = useState({ open: false, mode: "add", data: { customAttributes: [] } });
    const [snack, setSnack] = useState({ open: false, msg: "", severity: "success" });

    const toast = (msg, severity = "success") => setSnack({ open: true, msg, severity });

    const selectedCat = categories.find(c => c.id === selectedCatId);

    const filteredFacilities = facilities.filter(f =>
        f.categoryId === selectedCatId &&
        (f.name.toLowerCase().includes(searchQuery.toLowerCase()) || f.location.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    /* ── Category Handlers ── */
    const saveCategory = () => {
        const { id, name, description } = catModal.data;
        if (!name) { toast("Category name required.", "error"); return; }

        if (catModal.mode === "add") {
            const newId = `cat-${Date.now()}`;
            setCategories([...categories, { id: newId, name, description }]);
            if (!selectedCatId) setSelectedCatId(newId);
            toast("Category created.");
        } else {
            setCategories(categories.map(c => c.id === id ? { ...c, name, description } : c));
            toast("Category updated.");
        }
        setCatModal({ open: false, mode: "add", data: {} });
    };

    const deleteCategory = (id, e) => {
        e.stopPropagation();
        setCategories(categories.filter(c => c.id !== id));
        setFacilities(facilities.filter(f => f.categoryId !== id));
        if (selectedCatId === id) setSelectedCatId(categories.find(c => c.id !== id)?.id || "");
        toast("Category and its facilities deleted.", "info");
    };

    /* ── Facility Handlers ── */
    const saveFacility = () => {
        const d = facModal.data;
        if (!d.name || !d.location) { toast("Name and Location are required.", "error"); return; }

        const formattedData = {
            ...d,
            capacity: d.capacity ? parseInt(d.capacity) : null,
            customAttributes: d.customAttributes.filter(a => a.key.trim() !== "")
        };

        if (facModal.mode === "add") {
            setFacilities([...facilities, { id: `fac-${Date.now()}`, categoryId: selectedCatId, ...formattedData }]);
            toast("Facility added.");
        } else {
            setFacilities(facilities.map(f => f.id === d.id ? { ...f, ...formattedData } : f));
            toast("Facility updated.");
        }
        setFacModal({ open: false, mode: "add", data: { customAttributes: [] } });
    };

    const deleteFacility = (id) => {
        setFacilities(facilities.filter(f => f.id !== id));
        toast("Facility removed.", "info");
    };

    const updateAttr = (index, field, value) => {
        const newAttrs = [...facModal.data.customAttributes];
        newAttrs[index][field] = value;
        setFacModal({ ...facModal, data: { ...facModal.data, customAttributes: newAttrs } });
    };

    return (
        <Box sx={{ p: 3, bgcolor: T.bg, minHeight: "100vh", fontFamily: fBody }}>
            <Fonts />

            {/* ── Header ── */}
            <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3} className="fu">
                <Box>
                    <Typography sx={{ fontFamily: fBody, fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: T.textMute, mb: 0.3 }}>
                        Admin Dashboard · Custom
                    </Typography>
                    <Typography sx={{ fontFamily: fHead, fontWeight: 700, fontSize: "1.5rem", color: T.text }}>Other Facilities</Typography>
                    <Typography sx={{ fontFamily: fBody, fontSize: "0.82rem", color: T.textSub, mt: 0.3 }}>
                        Create custom categories and manage miscellaneous campus infrastructure with dynamic attributes.
                    </Typography>
                </Box>
            </Box>

            {/* ── Main Layout ── */}
            <Grid container spacing={3} className="fu">

                {/* Left Sidebar: Categories */}
                <Grid item xs={12} md={3}>
                    <SCard sx={{ height: "calc(100vh - 160px)", display: "flex", flexDirection: "column" }}>
                        <Box sx={{ p: 2, borderBottom: `1px solid ${T.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", bgcolor: "#FAFBFD" }}>
                            <Typography sx={{ fontFamily: fHead, fontWeight: 700, fontSize: "0.95rem", color: T.text }}>Categories</Typography>
                            <IconButton size="small" onClick={() => setCatModal({ open: true, mode: "add", data: {} })} sx={{ bgcolor: T.accentLight, color: T.accent, borderRadius: "8px", width: 28, height: 28 }}>
                                <Add sx={{ fontSize: 16 }} />
                            </IconButton>
                        </Box>
                        <Box sx={{ flex: 1, overflowY: "auto", py: 1 }}>
                            {categories.length === 0 && <Typography sx={{ p: 3, textAlign: "center", fontSize: "0.8rem", color: T.textMute }}>No categories found.</Typography>}
                            {categories.map(cat => {
                                const isActive = selectedCatId === cat.id;
                                return (
                                    <Box key={cat.id} className={isActive ? "cat-active" : "cat-item"} onClick={() => setSelectedCatId(cat.id)}
                                        sx={{ px: 2.5, py: 1.8, cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid ${T.border}60` }}>
                                        <Box display="flex" alignItems="center" gap={1.2}>
                                            <Category sx={{ fontSize: 16, color: isActive ? T.accent : T.textMute }} />
                                            <Typography sx={{ fontFamily: fBody, fontWeight: isActive ? 700 : 500, fontSize: "0.85rem", color: isActive ? T.accent : T.text }}>{cat.name}</Typography>
                                        </Box>
                                        {isActive && (
                                            <Box display="flex" gap={0.5}>
                                                <IconButton size="small" onClick={(e) => { e.stopPropagation(); setCatModal({ open: true, mode: "edit", data: cat }); }} sx={{ width: 24, height: 24 }}>
                                                    <Edit sx={{ fontSize: 13, color: T.textMute }} />
                                                </IconButton>
                                                <IconButton size="small" onClick={(e) => deleteCategory(cat.id, e)} sx={{ width: 24, height: 24, "&:hover": { color: T.danger } }}>
                                                    <DeleteOutline sx={{ fontSize: 13 }} />
                                                </IconButton>
                                            </Box>
                                        )}
                                    </Box>
                                );
                            })}
                        </Box>
                    </SCard>
                </Grid>

                {/* Right Area: Facilities Grid */}
                <Grid item xs={12} md={9}>
                    <SCard sx={{ height: "calc(100vh - 160px)", display: "flex", flexDirection: "column", bgcolor: "#FAFBFD" }}>
                        {selectedCat ? (
                            <>
                                <Box sx={{ p: 3, borderBottom: `1px solid ${T.border}`, bgcolor: T.surface }}>
                                    <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                                        <Box>
                                            <Typography sx={{ fontFamily: fHead, fontWeight: 700, fontSize: "1.2rem", color: T.text }}>{selectedCat.name}</Typography>
                                            <Typography sx={{ fontFamily: fBody, fontSize: "0.8rem", color: T.textMute }}>{selectedCat.description || "No description provided."}</Typography>
                                        </Box>
                                        <Button variant="contained" startIcon={<Add sx={{ fontSize: 15 }} />} onClick={() => setFacModal({ open: true, mode: "add", data: { status: "Available", customAttributes: [] } })}
                                            sx={{ fontFamily: fBody, fontWeight: 700, fontSize: "0.78rem", textTransform: "none", borderRadius: "9px", bgcolor: T.accent, boxShadow: "none", "&:hover": { bgcolor: "#4F46E5", boxShadow: "none" } }}>
                                            Add Facility
                                        </Button>
                                    </Box>
                                    <TextField size="small" placeholder="Search facilities in this category…" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                                        InputProps={{ startAdornment: <InputAdornment position="start"><Search sx={{ fontSize: 15, color: T.textMute }} /></InputAdornment> }}
                                        sx={{ width: 300, "& .MuiOutlinedInput-root": { borderRadius: "8px", bgcolor: "#FAFBFD", fontSize: "0.8rem" } }} />
                                </Box>

                                <Box sx={{ flex: 1, overflowY: "auto", p: 3 }}>
                                    {filteredFacilities.length === 0 ? (
                                        <Box sx={{ textAlign: "center", py: 8 }}>
                                            <Category sx={{ fontSize: 40, color: T.border, mb: 2 }} />
                                            <Typography sx={{ fontFamily: fBody, fontWeight: 600, color: T.textMute }}>No facilities found</Typography>
                                        </Box>
                                    ) : (
                                        <Grid container spacing={2.5}>
                                            {filteredFacilities.map(fac => (
                                                <Grid item xs={12} sm={6} lg={4} key={fac.id}>
                                                    <Box className="fac-card" sx={{ bgcolor: T.surface, borderRadius: "12px", overflow: "hidden", display: "flex", flexDirection: "column", height: "100%" }}>
                                                        <Box sx={{ p: 2.5, flex: 1 }}>
                                                            <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1.5}>
                                                                <Typography sx={{ fontFamily: fHead, fontWeight: 700, fontSize: "0.95rem", color: T.text, lineHeight: 1.2, pr: 1 }}>{fac.name}</Typography>
                                                                <StatusPill status={fac.status} />
                                                            </Box>

                                                            <Stack spacing={1} mb={2.5}>
                                                                <Box display="flex" alignItems="center" gap={1}>
                                                                    <LocationOn sx={{ fontSize: 14, color: T.textMute }} />
                                                                    <Typography sx={{ fontFamily: fBody, fontSize: "0.76rem", color: T.textSub }}>{fac.location}</Typography>
                                                                </Box>
                                                                {fac.capacity && (
                                                                    <Box display="flex" alignItems="center" gap={1}>
                                                                        <People sx={{ fontSize: 14, color: T.textMute }} />
                                                                        <Typography sx={{ fontFamily: fBody, fontSize: "0.76rem", color: T.textSub }}>Capacity: {fac.capacity}</Typography>
                                                                    </Box>
                                                                )}
                                                            </Stack>

                                                            {fac.customAttributes?.length > 0 && (
                                                                <Box sx={{ pt: 2, borderTop: `1px dashed ${T.border}` }}>
                                                                    <Box display="flex" alignItems="center" gap={0.5} mb={1}>
                                                                        <SettingsSuggest sx={{ fontSize: 13, color: T.textMute }} />
                                                                        <SLabel sx={{ mb: 0, fontSize: "0.6rem" }}>Custom Details</SLabel>
                                                                    </Box>
                                                                    <Grid container spacing={1}>
                                                                        {fac.customAttributes.map((attr, i) => (
                                                                            <Grid item xs={6} key={i}>
                                                                                <Typography sx={{ fontFamily: fBody, fontSize: "0.65rem", color: T.textMute }}>{attr.key}</Typography>
                                                                                <Typography sx={{ fontFamily: fBody, fontWeight: 600, fontSize: "0.75rem", color: T.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }} title={attr.value}>{attr.value}</Typography>
                                                                            </Grid>
                                                                        ))}
                                                                    </Grid>
                                                                </Box>
                                                            )}
                                                        </Box>

                                                        <Box sx={{ px: 2, py: 1.2, bgcolor: "#F8FAFC", borderTop: `1px solid ${T.border}`, display: "flex", justifyContent: "flex-end", gap: 1 }}>
                                                            <Button size="small" sx={{ minWidth: 0, p: 0.5, color: T.textSub }} onClick={() => setFacModal({ open: true, mode: "edit", data: fac })}>
                                                                <Edit sx={{ fontSize: 16 }} />
                                                            </Button>
                                                            <Button size="small" sx={{ minWidth: 0, p: 0.5, color: T.danger }} onClick={() => deleteFacility(fac.id)}>
                                                                <DeleteOutline sx={{ fontSize: 16 }} />
                                                            </Button>
                                                        </Box>
                                                    </Box>
                                                </Grid>
                                            ))}
                                        </Grid>
                                    )}
                                </Box>
                            </>
                        ) : (
                            <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100%">
                                <Category sx={{ fontSize: 40, color: T.border, mb: 2 }} />
                                <Typography sx={{ fontFamily: fBody, fontWeight: 600, color: T.textMute }}>Select a category</Typography>
                            </Box>
                        )}
                    </SCard>
                </Grid>
            </Grid>

            {/* ── Category Modal ── */}
            <Dialog open={catModal.open} onClose={() => setCatModal({ ...catModal, open: false })} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: "16px", border: `1px solid ${T.border}` } }}>
                <DialogTitle sx={{ fontFamily: fHead, fontWeight: 700, fontSize: "1rem", color: T.text, borderBottom: `1px solid ${T.border}`, bgcolor: "#FAFBFD", pb: 2 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Box display="flex" alignItems="center" gap={1.2}>
                            <Box sx={{ width: 4, height: 22, borderRadius: 2, bgcolor: T.accent }} />
                            {catModal.mode === "add" ? "Add Category" : "Edit Category"}
                        </Box>
                        <IconButton size="small" onClick={() => setCatModal({ ...catModal, open: false })} sx={{ bgcolor: "#F1F5F9", borderRadius: "8px" }}><Close fontSize="small" /></IconButton>
                    </Box>
                </DialogTitle>
                <DialogContent sx={{ px: 3, pt: 3, pb: 2 }}>
                    <Stack spacing={2.2}>
                        <Box><SLabel sx={{ mb: 0.7 }}>Category Name *</SLabel><DInput value={catModal.data.name || ""} onChange={e => setCatModal({ ...catModal, data: { ...catModal.data, name: e.target.value } })} placeholder="e.g. Sports Complex" /></Box>
                        <Box><SLabel sx={{ mb: 0.7 }}>Description</SLabel><DInput value={catModal.data.description || ""} onChange={e => setCatModal({ ...catModal, data: { ...catModal.data, description: e.target.value } })} placeholder="Brief description" /></Box>
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 3, borderTop: `1px solid ${T.border}`, pt: 2, bgcolor: "#FAFBFD" }}>
                    <Button onClick={() => setCatModal({ ...catModal, open: false })} variant="outlined" sx={{ fontFamily: fBody, fontWeight: 600, fontSize: "0.8rem", textTransform: "none", borderRadius: "8px", borderColor: T.border, color: T.textSub }}>Cancel</Button>
                    <Button variant="contained" onClick={saveCategory} sx={{ fontFamily: fBody, fontWeight: 700, fontSize: "0.8rem", textTransform: "none", borderRadius: "8px", bgcolor: T.accent, boxShadow: "none" }}>Save</Button>
                </DialogActions>
            </Dialog>

            {/* ── Facility Modal ── */}
            <Dialog open={facModal.open} onClose={() => setFacModal({ ...facModal, open: false })} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: "16px", border: `1px solid ${T.border}` } }}>
                <DialogTitle sx={{ fontFamily: fHead, fontWeight: 700, fontSize: "1rem", color: T.text, borderBottom: `1px solid ${T.border}`, bgcolor: "#FAFBFD", pb: 2 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Box display="flex" alignItems="center" gap={1.2}>
                            <Box sx={{ width: 4, height: 22, borderRadius: 2, bgcolor: T.accent }} />
                            {facModal.mode === "add" ? "Add Facility" : "Edit Facility"}
                        </Box>
                        <IconButton size="small" onClick={() => setFacModal({ ...facModal, open: false })} sx={{ bgcolor: "#F1F5F9", borderRadius: "8px" }}><Close fontSize="small" /></IconButton>
                    </Box>
                </DialogTitle>
                <DialogContent sx={{ px: 3, pt: 3, pb: 2 }}>
                    <Stack spacing={2.2}>
                        <Grid container spacing={2}>
                            <Grid item xs={6}><SLabel sx={{ mb: 0.7 }}>Facility Name *</SLabel><DInput value={facModal.data.name || ""} onChange={e => setFacModal({ ...facModal, data: { ...facModal.data, name: e.target.value } })} placeholder="e.g. Swimming Pool" /></Grid>
                            <Grid item xs={6}><SLabel sx={{ mb: 0.7 }}>Location *</SLabel><DInput value={facModal.data.location || ""} onChange={e => setFacModal({ ...facModal, data: { ...facModal.data, location: e.target.value } })} placeholder="e.g. Main Campus" /></Grid>
                            <Grid item xs={6}><SLabel sx={{ mb: 0.7 }}>Capacity (Optional)</SLabel><DInput type="number" value={facModal.data.capacity || ""} onChange={e => setFacModal({ ...facModal, data: { ...facModal.data, capacity: e.target.value } })} placeholder="e.g. 50" /></Grid>
                            <Grid item xs={6}><SLabel sx={{ mb: 0.7 }}>Status</SLabel>
                                <DInput select value={facModal.data.status || "Available"} onChange={e => setFacModal({ ...facModal, data: { ...facModal.data, status: e.target.value } })}>
                                    {["Available", "Occupied", "Maintenance"].map(s => <MenuItem key={s} value={s} sx={{ fontFamily: fBody, fontSize: "0.82rem" }}>{s}</MenuItem>)}
                                </DInput>
                            </Grid>
                        </Grid>

                        {/* Dynamic Attributes */}
                        <Box sx={{ mt: 2, p: 2, borderRadius: "10px", bgcolor: "#F8FAFC", border: `1px solid ${T.border}` }}>
                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                <Box>
                                    <SLabel sx={{ mb: 0, color: T.text }}>Custom Attributes</SLabel>
                                    <Typography sx={{ fontFamily: fBody, fontSize: "0.7rem", color: T.textMute }}>Add specific details (e.g. Surface: Wooden)</Typography>
                                </Box>
                                <Button size="small" startIcon={<AddCircleOutline sx={{ fontSize: 16 }} />} onClick={() => setFacModal({ ...facModal, data: { ...facModal.data, customAttributes: [...facModal.data.customAttributes, { key: "", value: "" }] } })}
                                    sx={{ fontFamily: fBody, fontWeight: 700, fontSize: "0.7rem", textTransform: "none", color: T.accent, bgcolor: T.accentLight, borderRadius: "6px", px: 1.5 }}>Add Row</Button>
                            </Box>

                            <Stack spacing={1.5}>
                                {facModal.data.customAttributes?.length === 0 && <Typography sx={{ fontFamily: fBody, fontSize: "0.75rem", color: T.textMute, textAlign: "center", py: 1 }}>No attributes added.</Typography>}
                                {facModal.data.customAttributes?.map((attr, index) => (
                                    <Box key={index} display="flex" gap={1} alignItems="center">
                                        <DragIndicator sx={{ fontSize: 16, color: T.border }} />
                                        <DInput placeholder="Key (e.g. Surface)" value={attr.key} onChange={e => updateAttr(index, "key", e.target.value)} sx={{ bgcolor: T.surface }} />
                                        <DInput placeholder="Value (e.g. Wooden)" value={attr.value} onChange={e => updateAttr(index, "value", e.target.value)} sx={{ bgcolor: T.surface }} />
                                        <IconButton size="small" onClick={() => { const newA = [...facModal.data.customAttributes]; newA.splice(index, 1); setFacModal({ ...facModal, data: { ...facModal.data, customAttributes: newA } }); }} sx={{ color: T.textMute, "&:hover": { color: T.danger } }}>
                                            <DeleteOutline sx={{ fontSize: 18 }} />
                                        </IconButton>
                                    </Box>
                                ))}
                            </Stack>
                        </Box>
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 3, borderTop: `1px solid ${T.border}`, pt: 2, bgcolor: "#FAFBFD" }}>
                    <Button onClick={() => setFacModal({ ...facModal, open: false })} variant="outlined" sx={{ fontFamily: fBody, fontWeight: 600, fontSize: "0.8rem", textTransform: "none", borderRadius: "8px", borderColor: T.border, color: T.textSub }}>Cancel</Button>
                    <Button variant="contained" onClick={saveFacility} sx={{ fontFamily: fBody, fontWeight: 700, fontSize: "0.8rem", textTransform: "none", borderRadius: "8px", bgcolor: T.accent, boxShadow: "none" }}>Save</Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar */}
            <Snackbar open={snack.open} autoHideDuration={3500} onClose={() => setSnack(s => ({ ...s, open: false }))} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
                <Alert severity={snack.severity} sx={{ borderRadius: "10px", fontFamily: fBody, fontWeight: 600 }} onClose={() => setSnack(s => ({ ...s, open: false }))}>{snack.msg}</Alert>
            </Snackbar>
        </Box>
    );
}