import React, { useState } from "react";
import {
    Box, Card, Grid, Typography, Button, TextField, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, Alert, Tabs, Tab
} from "@mui/material";
import {
    CalendarMonth, Edit, Close, RestaurantMenu, FreeBreakfast, LunchDining, Tapas, DinnerDining, Male, Female, People
} from "@mui/icons-material";

/* ── Design Tokens ── */
const T = {
    bg: "#F5F7FA", surface: "#FFFFFF", border: "#E4E8EF", text: "#111827", textSub: "#4B5563", textMute: "#9CA3AF",
    accent: "#6366F1", accentLight: "#EEF2FF", success: "#10B981", successLight: "#ECFDF5",
    warning: "#F59E0B", warningLight: "#FFFBEB", danger: "#EF4444", dangerLight: "#FEF2F2",
    info: "#3B82F6", infoLight: "#EFF6FF", purple: "#8B5CF6", purpleLight: "#F5F3FF",
    pink: "#EC4899", pinkLight: "#FDF2F8"
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
    .day-btn { justify-content: flex-start; text-align: left; padding: 10px 16px; border-radius: 8px; text-transform: none; font-family: ${fontBody}; font-weight: 600; font-size: 0.85rem; color: ${T.textSub}; background: transparent; transition: all 0.2s; }
    .day-btn:hover { background: #F1F5F9; }
    .day-active { background: ${T.accentLight}; color: ${T.accent}; }
    .day-active:hover { background: ${T.accentLight}; }
    .meal-card { background: ${T.surface}; border: 1px solid ${T.border}; border-radius: 12px; padding: 20px; flex: 1; box-shadow: 0 1px 3px rgba(0,0,0,0.02); }
  `}</style>
);

const SLabel = ({ children, sx = {} }) => <Typography sx={{ fontFamily: fontBody, fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: T.textMute, mb: 0.5, ...sx }}>{children}</Typography>;
const DInput = ({ sx = {}, ...props }) => <TextField size="small" fullWidth {...props} sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px", fontFamily: fontBody, fontSize: "0.82rem", bgcolor: T.surface, "& fieldset": { borderColor: T.border }, "&.Mui-focused fieldset": { borderColor: T.accent } }, "& .MuiInputLabel-root.Mui-focused": { color: T.accent }, ...sx }} />;

const StatCard = ({ label, value, sub, color, icon: Icon, bgLight, children }) => (
    <Card className="fade-up" sx={{ p: 2.5, borderRadius: "14px", border: `1px solid ${T.border}`, background: T.surface, boxShadow: "0 1px 4px rgba(0,0,0,0.04)", height: "100%", display: "flex", flexDirection: "column" }}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={children ? 2 : 0}>
            <Box>
                <SLabel>{label}</SLabel>
                {value && <Typography sx={{ fontFamily: fontMono, fontWeight: 700, fontSize: "1.6rem", color: color || T.text, lineHeight: 1.1 }}>{value}</Typography>}
                {sub && <Typography sx={{ fontFamily: fontBody, fontSize: "0.72rem", color: T.textMute, mt: 0.4 }}>{sub}</Typography>}
            </Box>
            {Icon && <Box sx={{ p: 1, borderRadius: "8px", bgcolor: bgLight || `${color}15`, color: color }}><Icon sx={{ fontSize: 20 }} /></Box>}
        </Box>
        {children}
    </Card>
);

const initialWeeklyMenu = [
    { type: "Common", day: "Monday", breakfast: "Poha, Jalebi, Tea/Coffee", lunch: "Rajma, Rice, Roti, Salad, Curd", snacks: "Samosa, Tea", dinner: "Aloo Gobi, Dal Tadka, Roti, Rice" },
    { type: "Common", day: "Tuesday", breakfast: "Idli, Sambar, Chutney, Tea/Coffee", lunch: "Kadi Pakoda, Rice, Roti, Salad", snacks: "Bread Pakoda, Tea", dinner: "Paneer Butter Masala, Dal Makhani" },
    { type: "Common", day: "Wednesday", breakfast: "Aloo Paratha, Curd, Pickle, Tea/Coffee", lunch: "Chole, Bhature, Rice, Salad", snacks: "Veg Sandwich, Tea", dinner: "Mix Veg, Dal Fry, Roti, Rice" },
    { type: "Boys", day: "Thursday", breakfast: "Upma, Sev, Tea/Coffee", lunch: "Dal Bati Churma, Garlic Chutney", snacks: "Kachori, Tea", dinner: "Chicken Curry, Paneer Curry, Roti, Rice" },
    { type: "Girls", day: "Thursday", breakfast: "Upma, Sev, Tea/Coffee", lunch: "Dal Bati Churma, Garlic Chutney", snacks: "Kachori, Tea", dinner: "Paneer Tikka Masala, Mix Veg, Roti, Rice" },
    { type: "Common", day: "Friday", breakfast: "Masala Dosa, Sambar, Chutney, Tea/Coffee", lunch: "Veg Biryani, Raita, Salan", snacks: "Patties, Tea", dinner: "Malai Kofta, Dal Fry, Roti, Rice" },
    { type: "Common", day: "Saturday", breakfast: "Puri Bhaji, Tea/Coffee", lunch: "Khichdi, Kadhi, Papad, Pickle", snacks: "Bhel Puri, Tea", dinner: "Pav Bhaji, Pulao, Salad" },
    { type: "Common", day: "Sunday", breakfast: "Chole Kulche, Lassi", lunch: "Special Thali (Paneer, Dal, 2 Sabzi, Rice, Sweet)", snacks: "Pasta, Tea", dinner: "Veg Noodles, Manchurian, Fried Rice" }
];

export default function DailyMenu() {
    const [activeDay, setActiveDay] = useState("Monday");
    const [hostelType, setHostelType] = useState("Common");
    const [weeklyMenu, setWeeklyMenu] = useState(initialWeeklyMenu);
    const [modal, setModal] = useState({ open: false, data: null });
    const [snack, setSnack] = useState({ open: false, msg: "" });

    // Derive correct menu
    let currentMenu = weeklyMenu.find(m => m.day === activeDay && m.type === hostelType);
    if (!currentMenu) {
        currentMenu = weeklyMenu.find(m => m.day === activeDay && m.type === "Common");
    }

    const handleSave = () => {
        let existsIndex = weeklyMenu.findIndex(m => m.day === modal.data.day && m.type === hostelType);
        let newMenu = [...weeklyMenu];

        if (existsIndex > -1) {
            newMenu[existsIndex] = { ...modal.data, type: hostelType };
        } else {
            // Decoupling a common day into specific
            newMenu.push({ ...modal.data, type: hostelType });
        }

        setWeeklyMenu(newMenu);
        setSnack({ open: true, msg: `${hostelType} Menu updated successfully.` });
        setModal({ open: false, data: null });
    };

    return (
        <Box sx={{ p: 3, background: T.bg, minHeight: "100vh", fontFamily: fontBody }}>
            <Fonts />
            <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3} className="fade-up">
                <Box>
                    <Typography sx={{ fontFamily: fontBody, fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: T.textMute, mb: 0.3 }}>Mess Management</Typography>
                    <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1.5rem", color: T.text, lineHeight: 1.1 }}>Daily Menus</Typography>
                    <Typography sx={{ fontFamily: fontBody, fontSize: "0.82rem", color: T.textSub, mt: 0.4 }}>Publish and customize daily menus for the residents.</Typography>
                </Box>
                <Button variant="contained" startIcon={<Edit sx={{ fontSize: 16 }} />} onClick={() => setModal({ open: true, data: currentMenu })} sx={{ fontFamily: fontBody, fontWeight: 700, fontSize: "0.8rem", textTransform: "none", borderRadius: "8px", bgcolor: T.accent, boxShadow: "none" }}>Customize {activeDay} Menu</Button>
            </Box>

            <Box sx={{ borderBottom: 1, borderColor: T.border, mb: 3 }} className="fade-up">
                <Tabs value={hostelType} onChange={(e, v) => setHostelType(v)} TabIndicatorProps={{ sx: { bgcolor: hostelType === "Girls" ? T.pink : (hostelType === "Boys" ? T.info : T.accent), height: 3, borderRadius: "3px 3px 0 0" } }} sx={{ "& .MuiTab-root": { fontFamily: fontBody, fontWeight: 600, fontSize: "0.9rem", textTransform: "none", color: T.textSub, minWidth: 140, minHeight: 48 }, "& .Mui-selected": { color: `${hostelType === "Girls" ? T.pink : (hostelType === "Boys" ? T.info : T.accent)} !important` } }}>
                    <Tab label={<Box display="flex" alignItems="center" gap={1}><People fontSize="small" /> Common Menu</Box>} value="Common" />
                    <Tab label={<Box display="flex" alignItems="center" gap={1}><Male fontSize="small" /> Boys Specific</Box>} value="Boys" />
                    <Tab label={<Box display="flex" alignItems="center" gap={1}><Female fontSize="small" /> Girls Specific</Box>} value="Girls" />
                </Tabs>
            </Box>

            <Grid container spacing={3} mb={3}>
                <Grid item xs={12} sm={6} md={4}>
                    <StatCard label="Meal Timings" color={T.textSub} bgLight={T.border} icon={CalendarMonth}>
                        <Box display="flex" flexDirection="column" gap={1}>
                            {[
                                { m: "Breakfast", t: "07:30 - 09:30" }, { m: "Lunch", t: "12:30 - 14:30" },
                                { m: "Snacks", t: "17:00 - 18:00" }, { m: "Dinner", t: "19:30 - 21:30" }
                            ].map(x => (
                                <Box key={x.m} display="flex" justifyContent="space-between">
                                    <Typography sx={{ fontFamily: fontBody, fontSize: "0.8rem", color: T.textMute }}>{x.m}:</Typography>
                                    <Typography sx={{ fontFamily: fontMono, fontSize: "0.8rem", color: T.textSub }}>{x.t}</Typography>
                                </Box>
                            ))}
                        </Box>
                    </StatCard>
                </Grid>
                <Grid item xs={12} sm={6} md={4}><StatCard label={`${hostelType} Headcount`} value={hostelType === "Boys" ? "612" : hostelType === "Girls" ? "483" : "1,095"} sub="Expected for meals today" color={T.accent} bgLight={T.accentLight} icon={RestaurantMenu} /></Grid>
                <Grid item xs={12} sm={6} md={4}><StatCard label="Current Serving" value={activeDay} sub="Publishing menu for active day" color={T.info} bgLight={T.infoLight} icon={RestaurantMenu} /></Grid>
            </Grid>

            <Card className="fade-up" sx={{ borderRadius: "14px", border: `1px solid ${T.border}`, boxShadow: "0 1px 4px rgba(0,0,0,0.04)", overflow: "hidden" }}>
                <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" } }}>
                    <Box sx={{ width: { xs: "100%", md: 220 }, p: 2, borderRight: { md: `1px solid ${T.border}` }, borderBottom: { xs: `1px solid ${T.border}`, md: "none" }, display: "flex", flexDirection: { xs: "row", md: "column" }, gap: 1, overflowX: "auto" }}>
                        {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(day => {
                            const isSpecific = hostelType !== "Common" && weeklyMenu.some(m => m.day === day && m.type === hostelType);
                            const activeColor = hostelType === "Girls" ? T.pinkLight : hostelType === "Boys" ? T.infoLight : T.accentLight;
                            const activeText = hostelType === "Girls" ? T.pink : hostelType === "Boys" ? T.info : T.accent;
                            return (
                                <Button key={day} disableElevation disableRipple onClick={() => setActiveDay(day)} sx={{ justifyContent: "space-between", textAlign: "left", padding: "10px 16px", borderRadius: "8px", textTransform: "none", fontFamily: fontBody, fontWeight: 600, fontSize: "0.85rem", color: activeDay === day ? activeText : T.textSub, background: activeDay === day ? activeColor : "transparent", transition: "all 0.2s", flexShrink: 0, "&:hover": { background: activeDay === day ? activeColor : "#F1F5F9" } }}>
                                    {day} {isSpecific && <span style={{ fontSize: "0.6rem", color: activeText }}>• Edited</span>}
                                </Button>
                            );
                        })}
                    </Box>
                    <Box sx={{ flex: 1, p: 3, bgcolor: "#FAFBFD" }}>
                        <Grid container spacing={3}>
                            {[
                                { k: "breakfast", n: "Breakfast", icon: FreeBreakfast, c: T.warning },
                                { k: "lunch", n: "Lunch", icon: LunchDining, c: T.success },
                                { k: "snacks", n: "Snacks", icon: Tapas, c: T.info },
                                { k: "dinner", n: "Dinner", icon: DinnerDining, c: T.purple }
                            ].map(t => (
                                <Grid item xs={12} md={6} key={t.k} display="flex">
                                    <Box className="meal-card" sx={{ borderTop: `4px solid ${t.c}` }}>
                                        <Box display="flex" alignItems="center" gap={1.5} mb={1.5}>
                                            <Box sx={{ p: 0.8, borderRadius: "8px", bgcolor: `${t.c}15`, color: t.c, display: "flex" }}>
                                                <t.icon fontSize="small" />
                                            </Box>
                                            <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1rem", color: T.text }}>{t.n}</Typography>
                                        </Box>
                                        <Typography sx={{ fontFamily: fontBody, fontSize: "0.9rem", color: T.textSub, lineHeight: 1.6 }}>
                                            {currentMenu?.[t.k] || "Not Set"}
                                        </Typography>
                                    </Box>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                </Box>
            </Card>

            <Dialog open={modal.open} onClose={() => setModal({ open: false, data: null })} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: "16px" } }}>
                <DialogTitle sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1.1rem", color: T.text, borderBottom: `1px solid ${T.border}`, bgcolor: "#FAFBFD", pb: 2 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Box>Edit {hostelType} Menu for {modal.data?.day}</Box>
                        <IconButton size="small" onClick={() => setModal({ open: false, data: null })}><Close fontSize="small" /></IconButton>
                    </Box>
                </DialogTitle>
                <DialogContent sx={{ px: 3, pt: 3, pb: 2 }}>
                    <Grid container spacing={3}>
                        {["breakfast", "lunch", "snacks", "dinner"].map(meal => (
                            <Grid item xs={12} key={meal}>
                                <SLabel>{meal}</SLabel>
                                <DInput multiline rows={2} value={modal.data?.[meal] || ""} onChange={e => setModal({ ...modal, data: { ...modal.data, [meal]: e.target.value } })} />
                            </Grid>
                        ))}
                    </Grid>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 3, borderTop: `1px solid ${T.border}`, pt: 2, bgcolor: "#FAFBFD" }}>
                    <Button onClick={() => setModal({ open: false, data: null })} variant="outlined" sx={{ fontFamily: fontBody, fontWeight: 600, fontSize: "0.8rem", textTransform: "none", borderRadius: "8px", borderColor: T.border, color: T.textSub }}>Cancel</Button>
                    <Button variant="contained" onClick={handleSave} sx={{ fontFamily: fontBody, fontWeight: 700, fontSize: "0.8rem", textTransform: "none", borderRadius: "8px", bgcolor: hostelType === "Girls" ? T.pink : (hostelType === "Boys" ? T.info : T.accent), boxShadow: "none" }}>Save {hostelType} Menu</Button>
                </DialogActions>
            </Dialog>

            <Snackbar open={snack.open} autoHideDuration={3000} onClose={() => setSnack({ open: false, msg: "" })} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
                <Alert severity="success" sx={{ borderRadius: "10px", fontFamily: fontBody, fontWeight: 600 }}>{snack.msg}</Alert>
            </Snackbar>
        </Box>
    );
}
