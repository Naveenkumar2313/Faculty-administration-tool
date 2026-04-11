import React, { useState } from "react";
import {
    Box, Card, Grid, Typography, Button, TextField, IconButton, Tooltip,
    Dialog, DialogTitle, DialogContent, DialogActions, Stack, Snackbar, Alert,
    MenuItem, InputAdornment
} from "@mui/material";
import {
    Add, Search, Edit, Close, DeleteOutline, Category, CalendarToday,
    AccessTime, People, SettingsSuggest, DragIndicator, AddCircleOutline,
    CheckCircle, Cancel as CancelIcon, HelpOutline, ViewModule
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
    @keyframes fadeUp { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:none; } }
    .fu  { animation: fadeUp 0.3s ease both; }
    .cat-item:hover { background: #F9FAFB; transition: background 0.15s; }
    .cat-active { background: #EEF2FF !important; border-right: 3px solid #6366F1; }
    .book-card { transition: all 0.2s ease; border: 1px solid ${T.border}; }
    .book-card:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.05); border-color: ${T.accent}50; }
  `}</style>
);

const SLabel = ({ children, sx = {} }) => (
    <Typography sx={{ fontFamily: fontBody, fontSize: "0.67rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: T.textMute, mb: 0.5, ...sx }}>{children}</Typography>
);

const DInput = ({ sx = {}, ...props }) => (
    <TextField size="small" fullWidth {...props} sx={{
        "& .MuiOutlinedInput-root": { borderRadius: "8px", fontFamily: fontBody, fontSize: "0.82rem", bgcolor: T.surface, "& fieldset": { borderColor: T.border }, "&.Mui-focused fieldset": { borderColor: T.accent } },
        "& .MuiInputLabel-root.Mui-focused": { color: T.accent }, ...sx,
    }} />
);

const StatusPill = ({ status }) => {
    const map = {
        Pending: { bg: T.warningLight, color: T.warning, dot: T.warning },
        Approved: { bg: T.successLight, color: T.success, dot: T.success },
        Rejected: { bg: T.dangerLight, color: T.danger, dot: T.danger },
    };
    const s = map[status] || map.Pending;
    return (
        <Box display="flex" alignItems="center" gap={0.6} sx={{ px: 1, py: 0.25, borderRadius: "6px", bgcolor: s.bg, width: "fit-content" }}>
            <Box sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: s.color }} />
            <Typography sx={{ fontFamily: fontBody, fontSize: "0.68rem", fontWeight: 700, color: s.color }}>{status}</Typography>
        </Box>
    );
};

const SCard = ({ children, sx = {}, className = "", ...p }) => (
    <Box className={className} sx={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: "14px", ...sx }} {...p}>{children}</Box>
);

/* ── Initial Data ── */
const today = new Date().toISOString().split('T')[0];

const INIT_CATEGORIES = [
    { id: "cat-1", name: "Sports Facilities", description: "Bookings for indoor and outdoor sports areas" },
    { id: "cat-2", name: "Equipment", description: "Bookings for specialized equipment" },
    { id: "cat-3", name: "Guest House", description: "Accommodation for visitors" },
];

const INIT_BOOKINGS = [
    { id: "cb-1", categoryId: "cat-1", eventName: "Inter-department Basketball Match", organizer: "Sports Committee", date: today, startTime: "16:00", endTime: "18:00", attendees: 50, status: "Approved", customAttributes: [{ key: "Facility", value: "Main Basketball Court" }, { key: "Referee Required", value: "Yes" }] },
    { id: "cb-2", categoryId: "cat-2", eventName: "Photography Workshop", organizer: "Photography Club", date: "2026-11-05", startTime: "10:00", endTime: "14:00", attendees: 1, status: "Pending", customAttributes: [{ key: "Equipment", value: "DSLR Camera Kit 2" }, { key: "Purpose", value: "Campus Event Coverage" }] },
    { id: "cb-3", categoryId: "cat-1", eventName: "Faculty Fitness Session", organizer: "Dr. Priya Roy", date: "2026-04-10", startTime: "17:00", endTime: "19:00", attendees: 12, status: "Pending", customAttributes: [] },
    { id: "cb-4", categoryId: "cat-3", eventName: "Visiting Researcher Stay", organizer: "Prof. A. Sharma", date: "2026-04-15", startTime: "14:00", endTime: "14:00", attendees: null, status: "Approved", customAttributes: [{ key: "Duration", value: "3 Nights" }, { key: "Guest", value: "Dr. K. Tanaka" }] },
];

/* ═══════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════ */
export default function CustomBookingPage() {
    const [categories, setCategories] = useState(INIT_CATEGORIES);
    const [bookings, setBookings] = useState(INIT_BOOKINGS);
    const [selectedCategoryId, setSelectedCategoryId] = useState(categories[0]?.id || "");
    const [searchQuery, setSearchQuery] = useState("");

    // Modals
    const [catModal, setCatModal] = useState({ open: false, mode: "add", data: {} });
    const [bookModal, setBookModal] = useState({ open: false, mode: "add", data: { customAttributes: [] } });
    const [snack, setSnack] = useState({ open: false, msg: "", severity: "success" });

    const toast = (msg, severity = "success") => setSnack({ open: true, msg, severity });

    const selectedCategory = categories.find(c => c.id === selectedCategoryId);

    const filteredBookings = bookings.filter(b =>
        b.categoryId === selectedCategoryId &&
        (b.eventName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            b.organizer.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    /* ── Category Handlers ── */
    const saveCategory = () => {
        const { id, name, description } = catModal.data;
        if (!name) { toast("Category name required.", "error"); return; }
        if (catModal.mode === "add") {
            const newId = `cat-${Date.now()}`;
            setCategories([...categories, { id: newId, name, description }]);
            if (!selectedCategoryId) setSelectedCategoryId(newId);
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
        setBookings(bookings.filter(b => b.categoryId !== id));
        if (selectedCategoryId === id) setSelectedCategoryId(categories.find(c => c.id !== id)?.id || "");
        toast("Category and its bookings deleted.", "info");
    };

    /* ── Booking Handlers ── */
    const saveBooking = () => {
        const d = bookModal.data;
        if (!d.eventName) { toast("Event/purpose name is required.", "error"); return; }
        const formatted = {
            ...d,
            attendees: d.attendees ? parseInt(d.attendees) : null,
            customAttributes: (d.customAttributes || []).filter(a => a.key.trim() !== ""),
        };
        if (bookModal.mode === "add") {
            setBookings([...bookings, { id: `cb-${Date.now()}`, categoryId: selectedCategoryId, ...formatted }]);
            toast("Booking added.");
        } else {
            setBookings(bookings.map(b => b.id === d.id ? { ...b, ...formatted } : b));
            toast("Booking updated.");
        }
        setBookModal({ open: false, mode: "add", data: { customAttributes: [] } });
    };

    const deleteBooking = (id) => {
        if (window.confirm("Are you sure you want to delete this booking?")) {
            setBookings(bookings.filter(b => b.id !== id));
            toast("Booking removed.", "info");
        }
    };

    const openCategoryModal = (cat = null) => {
        setCatModal({ open: true, mode: cat ? "edit" : "add", data: cat ? { ...cat } : {} });
    };

    const openBookingModal = (booking = null) => {
        if (booking) {
            setBookModal({ open: true, mode: "edit", data: { ...booking, attendees: booking.attendees?.toString() || "", customAttributes: [...booking.customAttributes] } });
        } else {
            setBookModal({ open: true, mode: "add", data: { eventName: "", organizer: "", date: today, startTime: "09:00", endTime: "10:00", attendees: "", status: "Pending", customAttributes: [] } });
        }
    };

    const updateAttr = (index, field, value) => {
        const newAttrs = [...bookModal.data.customAttributes];
        newAttrs[index][field] = value;
        setBookModal({ ...bookModal, data: { ...bookModal.data, customAttributes: newAttrs } });
    };

    return (
        <Box sx={{ p: 3, bgcolor: T.bg, minHeight: "100vh", fontFamily: fontBody }}>
            <Fonts />

            {/* ── Header ── */}
            <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3} className="fu">
                <Box>
                    <Typography sx={{ fontFamily: fontBody, fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: T.textMute, mb: 0.3 }}>
                        Admin Dashboard · Custom
                    </Typography>
                    <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1.5rem", color: T.text }}>Custom Bookings</Typography>
                    <Typography sx={{ fontFamily: fontBody, fontSize: "0.82rem", color: T.textSub, mt: 0.3 }}>
                        Create custom booking categories and manage reservations for miscellaneous resources.
                    </Typography>
                </Box>
            </Box>

            {/* ── Main Layout ── */}
            <Grid container spacing={3} className="fu">

                {/* Left Sidebar: Categories */}
                <Grid item xs={12} md={3}>
                    <SCard sx={{ height: "calc(100vh - 160px)", display: "flex", flexDirection: "column" }}>
                        <Box sx={{ p: 2, borderBottom: `1px solid ${T.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", bgcolor: "#FAFBFD" }}>
                            <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "0.95rem", color: T.text }}>Categories</Typography>
                            <IconButton size="small" onClick={() => openCategoryModal()} sx={{ bgcolor: T.accentLight, color: T.accent, borderRadius: "8px", width: 28, height: 28 }}>
                                <Add sx={{ fontSize: 16 }} />
                            </IconButton>
                        </Box>
                        <Box sx={{ flex: 1, overflowY: "auto", py: 1 }}>
                            {categories.length === 0 && (
                                <Typography sx={{ p: 3, textAlign: "center", fontSize: "0.8rem", color: T.textMute }}>
                                    No categories found. Create one to get started.
                                </Typography>
                            )}
                            {categories.map(cat => {
                                const isActive = selectedCategoryId === cat.id;
                                return (
                                    <Box key={cat.id} className={isActive ? "cat-active" : "cat-item"} onClick={() => setSelectedCategoryId(cat.id)}
                                        sx={{ px: 2.5, py: 1.8, cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid ${T.border}60` }}>
                                        <Box display="flex" alignItems="center" gap={1.2} minWidth={0}>
                                            <Category sx={{ fontSize: 16, color: isActive ? T.accent : T.textMute, flexShrink: 0 }} />
                                            <Typography sx={{ fontFamily: fontBody, fontWeight: isActive ? 700 : 500, fontSize: "0.85rem", color: isActive ? T.accent : T.text }} noWrap>{cat.name}</Typography>
                                        </Box>
                                        <Box display="flex" gap={0.5} sx={{ opacity: isActive ? 1 : 0, transition: "opacity 0.15s", ".cat-item:hover &": { opacity: 1 } }}>
                                            <IconButton size="small" onClick={(e) => { e.stopPropagation(); openCategoryModal(cat); }} sx={{ width: 24, height: 24 }}>
                                                <Edit sx={{ fontSize: 13, color: T.textMute }} />
                                            </IconButton>
                                            <IconButton size="small" onClick={(e) => deleteCategory(cat.id, e)} sx={{ width: 24, height: 24, "&:hover": { color: T.danger } }}>
                                                <DeleteOutline sx={{ fontSize: 13 }} />
                                            </IconButton>
                                        </Box>
                                    </Box>
                                );
                            })}
                        </Box>
                    </SCard>
                </Grid>

                {/* Right Area: Bookings Grid */}
                <Grid item xs={12} md={9}>
                    <SCard sx={{ height: "calc(100vh - 160px)", display: "flex", flexDirection: "column", bgcolor: "#FAFBFD" }}>
                        {selectedCategory ? (
                            <>
                                {/* Category Header + Search + Add */}
                                <Box sx={{ p: 3, borderBottom: `1px solid ${T.border}`, bgcolor: T.surface }}>
                                    <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                                        <Box>
                                            <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1.2rem", color: T.text }}>{selectedCategory.name}</Typography>
                                            <Typography sx={{ fontFamily: fontBody, fontSize: "0.8rem", color: T.textMute }}>{selectedCategory.description || "No description provided."}</Typography>
                                        </Box>
                                        <Button variant="contained" startIcon={<Add sx={{ fontSize: 15 }} />} onClick={() => openBookingModal()}
                                            sx={{ fontFamily: fontBody, fontWeight: 700, fontSize: "0.78rem", textTransform: "none", borderRadius: "9px", bgcolor: T.accent, boxShadow: "none", "&:hover": { bgcolor: "#4F46E5", boxShadow: "none" } }}>
                                            Add Booking
                                        </Button>
                                    </Box>
                                    <TextField size="small" placeholder="Search bookings..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                                        InputProps={{ startAdornment: <InputAdornment position="start"><Search sx={{ fontSize: 15, color: T.textMute }} /></InputAdornment> }}
                                        sx={{ width: 300, "& .MuiOutlinedInput-root": { borderRadius: "8px", bgcolor: "#FAFBFD", fontSize: "0.8rem" } }} />
                                </Box>

                                {/* Bookings Cards */}
                                <Box sx={{ flex: 1, overflowY: "auto", p: 3 }}>
                                    {filteredBookings.length === 0 ? (
                                        <Box sx={{ textAlign: "center", py: 8, display: "flex", flexDirection: "column", alignItems: "center" }}>
                                            <CalendarToday sx={{ fontSize: 48, color: T.border, mb: 2, opacity: 0.5 }} />
                                            <Typography sx={{ fontFamily: fontHead, fontWeight: 600, fontSize: "1rem", color: T.text }}>No bookings found</Typography>
                                            <Typography sx={{ fontFamily: fontBody, fontSize: "0.82rem", color: T.textMute, mt: 0.5 }}>Add a new booking to this category to get started.</Typography>
                                            <Button variant="outlined" startIcon={<Add />} onClick={() => openBookingModal()}
                                                sx={{ mt: 3, fontFamily: fontBody, fontWeight: 600, fontSize: "0.8rem", textTransform: "none", borderRadius: "8px", borderColor: T.border, color: T.textSub, "&:hover": { borderColor: T.accent, color: T.accent } }}>
                                                Add Booking
                                            </Button>
                                        </Box>
                                    ) : (
                                        <Grid container spacing={2.5}>
                                            {filteredBookings.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).map(booking => (
                                                <Grid item xs={12} sm={6} lg={4} key={booking.id}>
                                                    <Box className="book-card" sx={{ bgcolor: T.surface, borderRadius: "12px", overflow: "hidden", display: "flex", flexDirection: "column", height: "100%" }}>
                                                        {/* Card Body */}
                                                        <Box sx={{ p: 2.5, flex: 1 }}>
                                                            <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1.5}>
                                                                <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "0.95rem", color: T.text, lineHeight: 1.2, pr: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{booking.eventName}</Typography>
                                                                <StatusPill status={booking.status} />
                                                            </Box>

                                                            <Stack spacing={1} mb={2.5}>
                                                                <Box display="flex" alignItems="center" gap={1}>
                                                                    <People sx={{ fontSize: 14, color: T.textMute }} />
                                                                    <Typography sx={{ fontFamily: fontBody, fontSize: "0.76rem", color: T.textSub }} noWrap>{booking.organizer}</Typography>
                                                                </Box>
                                                                <Box display="flex" alignItems="center" gap={1}>
                                                                    <CalendarToday sx={{ fontSize: 14, color: T.textMute }} />
                                                                    <Typography sx={{ fontFamily: fontBody, fontSize: "0.76rem", color: T.textSub }}>{booking.date}</Typography>
                                                                </Box>
                                                                <Box display="flex" alignItems="center" gap={1}>
                                                                    <AccessTime sx={{ fontSize: 14, color: T.textMute }} />
                                                                    <Typography sx={{ fontFamily: fontBody, fontSize: "0.76rem", color: T.textSub }}>{booking.startTime} - {booking.endTime}</Typography>
                                                                </Box>
                                                                {booking.attendees && (
                                                                    <Box display="flex" alignItems="center" gap={1}>
                                                                        <People sx={{ fontSize: 14, color: T.textMute }} />
                                                                        <Typography sx={{ fontFamily: fontBody, fontSize: "0.76rem", color: T.textSub }}>Attendees: {booking.attendees}</Typography>
                                                                    </Box>
                                                                )}
                                                            </Stack>

                                                            {booking.customAttributes?.length > 0 && (
                                                                <Box sx={{ pt: 2, borderTop: `1px dashed ${T.border}` }}>
                                                                    <Box display="flex" alignItems="center" gap={0.5} mb={1}>
                                                                        <SettingsSuggest sx={{ fontSize: 13, color: T.textMute }} />
                                                                        <SLabel sx={{ mb: 0, fontSize: "0.6rem" }}>Details</SLabel>
                                                                    </Box>
                                                                    <Grid container spacing={1}>
                                                                        {booking.customAttributes.map((attr, i) => (
                                                                            <Grid item xs={6} key={i}>
                                                                                <Typography sx={{ fontFamily: fontBody, fontSize: "0.65rem", color: T.textMute }}>{attr.key}</Typography>
                                                                                <Typography sx={{ fontFamily: fontBody, fontWeight: 600, fontSize: "0.75rem", color: T.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }} title={attr.value}>{attr.value}</Typography>
                                                                            </Grid>
                                                                        ))}
                                                                    </Grid>
                                                                </Box>
                                                            )}
                                                        </Box>

                                                        {/* Card Footer */}
                                                        <Box sx={{ px: 2, py: 1.2, bgcolor: "#F8FAFC", borderTop: `1px solid ${T.border}`, display: "flex", justifyContent: "flex-end", gap: 1 }}>
                                                            <Button size="small" startIcon={<Edit sx={{ fontSize: 14 }} />} onClick={() => openBookingModal(booking)}
                                                                sx={{ fontFamily: fontBody, fontSize: "0.75rem", fontWeight: 600, textTransform: "none", color: T.textSub, "&:hover": { bgcolor: T.accentLight, color: T.accent } }}>
                                                                Edit
                                                            </Button>
                                                            <Button size="small" startIcon={<DeleteOutline sx={{ fontSize: 14 }} />} onClick={() => deleteBooking(booking.id)}
                                                                sx={{ fontFamily: fontBody, fontSize: "0.75rem", fontWeight: 600, textTransform: "none", color: T.danger, "&:hover": { bgcolor: T.dangerLight } }}>
                                                                Delete
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
                                <ViewModule sx={{ fontSize: 48, color: T.border, mb: 2, opacity: 0.4 }} />
                                <Typography sx={{ fontFamily: fontHead, fontWeight: 600, fontSize: "1rem", color: T.text }}>Select a category</Typography>
                                <Typography sx={{ fontFamily: fontBody, fontSize: "0.82rem", color: T.textMute, mt: 0.5 }}>Choose a category from the sidebar or create a new one.</Typography>
                            </Box>
                        )}
                    </SCard>
                </Grid>
            </Grid>

            {/* ── Category Modal ── */}
            <Dialog open={catModal.open} onClose={() => setCatModal({ ...catModal, open: false })} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: "16px", border: `1px solid ${T.border}` } }}>
                <DialogTitle sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1rem", color: T.text, borderBottom: `1px solid ${T.border}`, bgcolor: "#FAFBFD", pb: 2 }}>
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
                        <Box><SLabel sx={{ mb: 0.7 }}>Category Name *</SLabel><DInput value={catModal.data.name || ""} onChange={e => setCatModal({ ...catModal, data: { ...catModal.data, name: e.target.value } })} placeholder="e.g. Sports Facilities, Equipment" /></Box>
                        <Box><SLabel sx={{ mb: 0.7 }}>Description</SLabel><DInput value={catModal.data.description || ""} onChange={e => setCatModal({ ...catModal, data: { ...catModal.data, description: e.target.value } })} placeholder="Brief description of this category" /></Box>
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 3, borderTop: `1px solid ${T.border}`, pt: 2, bgcolor: "#FAFBFD" }}>
                    <Button onClick={() => setCatModal({ ...catModal, open: false })} variant="outlined" sx={{ fontFamily: fontBody, fontWeight: 600, fontSize: "0.8rem", textTransform: "none", borderRadius: "8px", borderColor: T.border, color: T.textSub }}>Cancel</Button>
                    <Button variant="contained" onClick={saveCategory} sx={{ fontFamily: fontBody, fontWeight: 700, fontSize: "0.8rem", textTransform: "none", borderRadius: "8px", bgcolor: T.accent, boxShadow: "none" }}>Save Category</Button>
                </DialogActions>
            </Dialog>

            {/* ── Booking Modal ── */}
            <Dialog open={bookModal.open} onClose={() => setBookModal({ ...bookModal, open: false })} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: "16px", border: `1px solid ${T.border}` } }}>
                <DialogTitle sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1rem", color: T.text, borderBottom: `1px solid ${T.border}`, bgcolor: "#FAFBFD", pb: 2 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Box display="flex" alignItems="center" gap={1.2}>
                            <Box sx={{ width: 4, height: 22, borderRadius: 2, bgcolor: T.accent }} />
                            {bookModal.mode === "add" ? "Add Booking" : "Edit Booking"}
                        </Box>
                        <IconButton size="small" onClick={() => setBookModal({ ...bookModal, open: false })} sx={{ bgcolor: "#F1F5F9", borderRadius: "8px" }}><Close fontSize="small" /></IconButton>
                    </Box>
                </DialogTitle>
                <DialogContent sx={{ px: 3, pt: 3, pb: 2, maxHeight: "60vh", overflowY: "auto" }}>
                    <Stack spacing={2.2}>
                        <Grid container spacing={2}>
                            <Grid item xs={6}><SLabel sx={{ mb: 0.7 }}>Event/Purpose Name *</SLabel><DInput value={bookModal.data.eventName || ""} onChange={e => setBookModal({ ...bookModal, data: { ...bookModal.data, eventName: e.target.value } })} placeholder="e.g. Basketball Match" /></Grid>
                            <Grid item xs={6}><SLabel sx={{ mb: 0.7 }}>Organizer</SLabel><DInput value={bookModal.data.organizer || ""} onChange={e => setBookModal({ ...bookModal, data: { ...bookModal.data, organizer: e.target.value } })} placeholder="e.g. Sports Committee" /></Grid>
                            <Grid item xs={6}><SLabel sx={{ mb: 0.7 }}>Date</SLabel><DInput type="date" InputLabelProps={{ shrink: true }} value={bookModal.data.date || today} onChange={e => setBookModal({ ...bookModal, data: { ...bookModal.data, date: e.target.value } })} /></Grid>
                            <Grid item xs={6}>
                                <SLabel sx={{ mb: 0.7 }}>Time</SLabel>
                                <Box display="flex" alignItems="center" gap={1}>
                                    <DInput type="time" InputLabelProps={{ shrink: true }} value={bookModal.data.startTime || "09:00"} onChange={e => setBookModal({ ...bookModal, data: { ...bookModal.data, startTime: e.target.value } })} />
                                    <Typography sx={{ fontFamily: fontBody, fontSize: "0.75rem", color: T.textMute, flexShrink: 0 }}>to</Typography>
                                    <DInput type="time" InputLabelProps={{ shrink: true }} value={bookModal.data.endTime || "10:00"} onChange={e => setBookModal({ ...bookModal, data: { ...bookModal.data, endTime: e.target.value } })} />
                                </Box>
                            </Grid>
                            <Grid item xs={6}><SLabel sx={{ mb: 0.7 }}>Attendees (Optional)</SLabel><DInput type="number" value={bookModal.data.attendees || ""} onChange={e => setBookModal({ ...bookModal, data: { ...bookModal.data, attendees: e.target.value } })} placeholder="e.g. 50" /></Grid>
                            <Grid item xs={6}><SLabel sx={{ mb: 0.7 }}>Status</SLabel>
                                <DInput select value={bookModal.data.status || "Pending"} onChange={e => setBookModal({ ...bookModal, data: { ...bookModal.data, status: e.target.value } })}>
                                    {["Pending", "Approved", "Rejected"].map(s => <MenuItem key={s} value={s} sx={{ fontFamily: fontBody, fontSize: "0.82rem" }}>{s}</MenuItem>)}
                                </DInput>
                            </Grid>
                        </Grid>

                        {/* Dynamic Attributes */}
                        <Box sx={{ mt: 2, p: 2, borderRadius: "10px", bgcolor: "#F8FAFC", border: `1px solid ${T.border}` }}>
                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                <Box>
                                    <SLabel sx={{ mb: 0, color: T.text }}>Custom Attributes</SLabel>
                                    <Typography sx={{ fontFamily: fontBody, fontSize: "0.7rem", color: T.textMute }}>Add specific details (e.g. Facility: Main Court)</Typography>
                                </Box>
                                <Button size="small" startIcon={<AddCircleOutline sx={{ fontSize: 16 }} />}
                                    onClick={() => setBookModal({ ...bookModal, data: { ...bookModal.data, customAttributes: [...(bookModal.data.customAttributes || []), { key: "", value: "" }] } })}
                                    sx={{ fontFamily: fontBody, fontWeight: 700, fontSize: "0.7rem", textTransform: "none", color: T.accent, bgcolor: T.accentLight, borderRadius: "6px", px: 1.5 }}>Add Row</Button>
                            </Box>
                            <Stack spacing={1.5}>
                                {(bookModal.data.customAttributes || []).length === 0 && (
                                    <Typography sx={{ fontFamily: fontBody, fontSize: "0.75rem", color: T.textMute, textAlign: "center", py: 2, bgcolor: `${T.border}30`, borderRadius: "8px", border: `1px dashed ${T.border}` }}>
                                        No custom attributes added. You can add specific details like "Facility Name", "Equipment Needed", etc.
                                    </Typography>
                                )}
                                {(bookModal.data.customAttributes || []).map((attr, index) => (
                                    <Box key={index} display="flex" gap={1} alignItems="center">
                                        <DragIndicator sx={{ fontSize: 16, color: T.border }} />
                                        <DInput placeholder="Attribute Name (e.g. Facility)" value={attr.key} onChange={e => updateAttr(index, "key", e.target.value)} sx={{ bgcolor: T.surface }} />
                                        <DInput placeholder="Value (e.g. Main Court)" value={attr.value} onChange={e => updateAttr(index, "value", e.target.value)} sx={{ bgcolor: T.surface }} />
                                        <IconButton size="small" onClick={() => { const n = [...bookModal.data.customAttributes]; n.splice(index, 1); setBookModal({ ...bookModal, data: { ...bookModal.data, customAttributes: n } }); }}
                                            sx={{ color: T.textMute, "&:hover": { color: T.danger } }}>
                                            <DeleteOutline sx={{ fontSize: 18 }} />
                                        </IconButton>
                                    </Box>
                                ))}
                            </Stack>
                        </Box>
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 3, borderTop: `1px solid ${T.border}`, pt: 2, bgcolor: "#FAFBFD" }}>
                    <Button onClick={() => setBookModal({ ...bookModal, open: false })} variant="outlined" sx={{ fontFamily: fontBody, fontWeight: 600, fontSize: "0.8rem", textTransform: "none", borderRadius: "8px", borderColor: T.border, color: T.textSub }}>Cancel</Button>
                    <Button variant="contained" onClick={saveBooking} sx={{ fontFamily: fontBody, fontWeight: 700, fontSize: "0.8rem", textTransform: "none", borderRadius: "8px", bgcolor: T.accent, boxShadow: "none" }}>Save Booking</Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar */}
            <Snackbar open={snack.open} autoHideDuration={3500} onClose={() => setSnack(s => ({ ...s, open: false }))} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
                <Alert severity={snack.severity} sx={{ borderRadius: "10px", fontFamily: fontBody, fontWeight: 600 }} onClose={() => setSnack(s => ({ ...s, open: false }))}>{snack.msg}</Alert>
            </Snackbar>
        </Box>
    );
}
