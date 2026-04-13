import React, { useState } from "react";
import {
    Box, Grid, Typography, Button, TextField, Switch,
    Tabs, Tab, Chip, IconButton, Tooltip, Snackbar, Alert,
    Dialog, DialogTitle, DialogContent, DialogActions,
    InputAdornment, Accordion, AccordionSummary, AccordionDetails, Divider
} from "@mui/material";
import {
    Fingerprint, LocalShipping, Payment, SettingsInputComponent,
    Api, Sync, CheckCircle, ErrorOutline, Info, Visibility,
    VisibilityOff, Refresh, Delete, Add, VpnKey, ExpandMore,
    Sensors, Build, Save, Cancel
} from "@mui/icons-material";

/* ═════════════ DESIGN TOKENS ═════════════ */
const T = {
    bg: "#F5F7FA", surface: "#FFFFFF", border: "#E4E8EF",
    accent: "#6366F1", accentLight: "#EEF2FF",
    success: "#10B981", successLight: "#ECFDF5",
    warning: "#F59E0B", warningLight: "#FFFBEB",
    danger: "#EF4444", dangerLight: "#FEF2F2",
    purple: "#7C3AED", purpleLight: "#F5F3FF",
    teal: "#14B8A6", tealLight: "#F0FDFA",
    cyan: "#0891B2", cyanLight: "#ECFEFF",
    text: "#111827", textSub: "#4B5563", textMute: "#9CA3AF",
};
const fH = "Roboto, Helvetica, Arial, sans-serif";
const fB = "Roboto, Helvetica, Arial, sans-serif";
const fM = "Roboto, Helvetica, Arial, sans-serif";

/* ═════════════ MOCK INTEGRATIONS DATA ═════════════ */
const INITIAL_INTEGRATIONS = {
    biometric: [
        { id: "bio-1", name: "ZKTeco Essl Series", location: "Main Gate", status: "Connected", lastSync: "2 mins ago", ip: "192.168.1.150", port: "4370", active: true },
        { id: "bio-2", name: "Matrix Cosec", location: "Hostel Block A", status: "Disconnected", lastSync: "2 hours ago", ip: "192.168.1.155", port: "8000", active: false },
        { id: "bio-3", name: "Mantra MFS100", location: "Admin Block", status: "Connected", lastSync: "5 mins ago", ip: "192.168.1.156", port: "8080", active: true },
    ],
    gps: [
        { id: "gps-1", name: "GeoTrack Pro API", provider: "GeoTrack", status: "Connected", apiCalls: "14,230 / day", webhook: "https://api.cims.com/webhook/geotrack", active: true },
        { id: "gps-2", name: "LocateIt OBD", provider: "LocateIt", status: "Warning", apiCalls: "5,100 / day", webhook: "https://api.cims.com/webhook/locateit", active: true },
    ],
    payment: [
        { id: "pay-1", name: "Razorpay Sandbox", mode: "Test", status: "Active", gateway: "Razorpay", currency: "INR", active: true },
        { id: "pay-2", name: "Stripe International", mode: "Live", status: "Active", gateway: "Stripe", currency: "USD", active: true },
        { id: "pay-3", name: "CCAvenue", mode: "Live", status: "Disabled", gateway: "CCAvenue", currency: "INR", active: false },
    ]
};

/* ═════════════ PRIMITIVES ═════════════ */
const SCard = ({ children, sx = {}, ...props }) => (
    <Box sx={{ bgcolor: T.surface, border: `1px solid ${T.border}`, borderRadius: "14px", ...sx }} {...props}>
        {children}
    </Box>
);
const SLabel = ({ children, sx = {} }) => (
    <Typography sx={{ fontFamily: fB, fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: T.textMute, mb: 0.5, ...sx }}>{children}</Typography>
);

/* ═══════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════ */
const IntegrationSettingsView = () => {
    const [tabIndex, setTabIndex] = useState(0);
    const [integrations, setIntegrations] = useState(INITIAL_INTEGRATIONS);
    const [snack, setSnack] = useState({ open: false, msg: "", severity: "success" });
    const [showTokens, setShowTokens] = useState({});
    const [configOpen, setConfigOpen] = useState(false);
    const [currentConfig, setCurrentConfig] = useState(null);

    const toast = (msg, severity = "success") => setSnack({ open: true, msg, severity });

    const handleToggleActive = (category, id) => {
        setIntegrations(prev => ({
            ...prev,
            [category]: prev[category].map(item => item.id === id ? { ...item, active: !item.active, status: !item.active ? "Connected" : "Disabled" } : item)
        }));
        toast("Integration status updated", "success");
    };

    const handleOpenConfig = (item, category) => {
        setCurrentConfig({ ...item, category });
        setConfigOpen(true);
    };

    const handleSaveConfig = () => {
        setIntegrations(prev => ({
            ...prev,
            [currentConfig.category]: prev[currentConfig.category].map(item => item.id === currentConfig.id ? currentConfig : item)
        }));
        setConfigOpen(false);
        toast(`${currentConfig.name} configuration saved successfully.`);
    };

    const handleSync = (name) => {
        toast(`Syncing data for ${name}...`, "info");
        setTimeout(() => toast(`Data synced successfully for ${name}`, "success"), 1500);
    };

    const toggleTokenVisibility = (id) => {
        setShowTokens(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const TABS = [
        { label: "Biometric & Attendance", Icon: Fingerprint, count: integrations.biometric.length },
        { label: "GPS & Live Tracking", Icon: LocalShipping, count: integrations.gps.length },
        { label: "Payment Gateways", Icon: Payment, count: integrations.payment.length },
        { label: "API Webhooks", Icon: Api, count: 0 },
    ];

    const renderStatus = (status) => {
        const map = {
            "Connected": { color: T.success, icon: <CheckCircle sx={{ fontSize: 14 }} /> },
            "Active": { color: T.success, icon: <CheckCircle sx={{ fontSize: 14 }} /> },
            "Disconnected": { color: T.danger, icon: <ErrorOutline sx={{ fontSize: 14 }} /> },
            "Warning": { color: T.warning, icon: <ErrorOutline sx={{ fontSize: 14 }} /> },
            "Disabled": { color: T.textMute, icon: <Cancel sx={{ fontSize: 14 }} /> },
        };
        const s = map[status] || map["Disabled"];
        return (
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, px: 1, py: 0.3, borderRadius: "6px", bgcolor: `${s.color}15`, color: s.color }}>
                {s.icon}
                <Typography sx={{ fontFamily: fB, fontSize: "0.7rem", fontWeight: 700 }}>{status}</Typography>
            </Box>
        );
    };

    return (
        <Box sx={{ p: 3, bgcolor: T.bg, minHeight: "100vh", fontFamily: fB }}>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@600;700&family=Nunito:wght@400;500;600;700&family=JetBrains+Mono:wght@500;600&display=swap');
        * { box-sizing:border-box; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:none} }
        .fu  { animation: fadeUp 0.3s ease both; }
        .fu1 { animation: fadeUp 0.3s .06s ease both; }
        .fu2 { animation: fadeUp 0.3s .12s ease both; }
      `}</style>

            {/* ── Header ── */}
            <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3} flexWrap="wrap" gap={2} className="fu">
                <Box>
                    <Typography sx={{ fontFamily: fB, fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: T.textMute, mb: 0.3 }}>Insights & System · Settings</Typography>
                    <Typography sx={{ fontFamily: fH, fontWeight: 700, fontSize: "1.5rem", color: T.text }}>Integration Settings</Typography>
                    <Typography sx={{ fontFamily: fB, fontSize: "0.82rem", color: T.textSub, mt: 0.3 }}>Configure external systems like Biometrics, GPS providers, and Payment Gateways.</Typography>
                </Box>
                <Box display="flex" gap={1}>
                    <Button size="small" variant="outlined" startIcon={<Build sx={{ fontSize: 15 }} />} onClick={() => toast("Diagnostics initiated")}
                        sx={{ fontFamily: fB, fontWeight: 600, fontSize: "0.76rem", textTransform: "none", borderRadius: "8px", borderColor: T.border, color: T.textSub, "&:hover": { borderColor: T.accent, color: T.accent } }}>
                        Run Diagnostics
                    </Button>
                    <Button size="small" variant="contained" startIcon={<Add sx={{ fontSize: 15 }} />} onClick={() => toast("Adding new integration requires module selection.")}
                        sx={{ fontFamily: fB, fontWeight: 600, fontSize: "0.76rem", textTransform: "none", borderRadius: "8px", bgcolor: T.accent, boxShadow: "none", "&:hover": { bgcolor: "#5558e6" } }}>
                        Add Integration
                    </Button>
                </Box>
            </Box>

            {/* ── Summary Cards ── */}
            <Grid container spacing={2} mb={3} className="fu1">
                {[
                    { label: "Active Integrations", value: 6, color: T.accent, Icon: SettingsInputComponent },
                    { label: "Sync Errors", value: 1, color: T.danger, Icon: ErrorOutline },
                    { label: "API Requests Today", value: "34,210", color: T.purple, Icon: Api },
                    { label: "System Health", value: "98.5%", color: T.success, Icon: Sensors },
                ].map((s, i) => (
                    <Grid item xs={6} sm={3} key={i}>
                        <SCard sx={{ p: 2 }}>
                            <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                                <Box>
                                    <SLabel>{s.label}</SLabel>
                                    <Typography sx={{ fontFamily: fM, fontWeight: 700, fontSize: "1.4rem", color: s.color, lineHeight: 1.1 }}>{s.value}</Typography>
                                </Box>
                                <Box sx={{ p: 0.8, borderRadius: "8px", bgcolor: `${s.color}15`, color: s.color }}>
                                    <s.Icon sx={{ fontSize: 18 }} />
                                </Box>
                            </Box>
                        </SCard>
                    </Grid>
                ))}
            </Grid>

            {/* ── Main Panel ── */}
            <SCard sx={{ overflow: "hidden" }} className="fu2">
                {/* Tabs */}
                <Box sx={{ borderBottom: `1px solid ${T.border}`, bgcolor: "#FAFBFD", overflowX: "auto" }}>
                    <Tabs value={tabIndex} onChange={(_, v) => setTabIndex(v)} variant="scrollable" scrollButtons="auto"
                        sx={{
                            px: 2, "& .MuiTabs-indicator": { bgcolor: T.accent, height: "3px", borderRadius: "3px 3px 0 0" },
                            "& .MuiTab-root": { fontFamily: fB, fontWeight: 600, fontSize: "0.78rem", textTransform: "none", color: T.textMute, minHeight: 52, "&.Mui-selected": { color: T.accent } }
                        }}>
                        {TABS.map((t, i) => (
                            <Tab key={i} icon={<t.Icon sx={{ fontSize: 16 }} />} iconPosition="start"
                                label={
                                    <Box display="flex" alignItems="center" gap={0.8}>
                                        {t.label}
                                        {t.count > 0 && (
                                            <Box sx={{ px: 0.7, py: 0.1, borderRadius: "99px", bgcolor: tabIndex === i ? T.accentLight : "#F1F5F9" }}>
                                                <Typography sx={{ fontFamily: fM, fontSize: "0.62rem", fontWeight: 700, color: tabIndex === i ? T.accent : T.textMute }}>{t.count}</Typography>
                                            </Box>
                                        )}
                                    </Box>
                                }
                            />
                        ))}
                    </Tabs>
                </Box>

                <Box sx={{ p: 3, bgcolor: "#FAFAFA" }}>
                    {/* ════ TAB 0: BIOMETRIC ════ */}
                    {tabIndex === 0 && (
                        <Grid container spacing={2.5}>
                            {integrations.biometric.map((item) => (
                                <Grid item xs={12} md={6} lg={4} key={item.id}>
                                    <SCard sx={{ p: 2, height: "100%", transition: "all 0.2s", "&:hover": { borderColor: T.accent, boxShadow: `0 4px 12px ${T.accent}15` } }}>
                                        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                                            <Box display="flex" alignItems="center" gap={1.5}>
                                                <Box sx={{ p: 1, borderRadius: "8px", bgcolor: `${T.teal}15`, color: T.teal }}>
                                                    <Fingerprint sx={{ fontSize: 20 }} />
                                                </Box>
                                                <Box>
                                                    <Typography sx={{ fontFamily: fB, fontWeight: 700, fontSize: "0.9rem", color: T.text }}>{item.name}</Typography>
                                                    <Typography sx={{ fontFamily: fB, fontSize: "0.7rem", color: T.textMute }}>{item.location}</Typography>
                                                </Box>
                                            </Box>
                                            <Switch size="small" checked={item.active} onChange={() => handleToggleActive("biometric", item.id)} sx={{ "& .MuiSwitch-switchBase.Mui-checked": { color: T.teal }, "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { bgcolor: T.teal } }} />
                                        </Box>
                                        <Divider sx={{ mb: 1.5, borderColor: T.border }} />
                                        <Box display="flex" flexDirection="column" gap={1}>
                                            <Box display="flex" justifyContent="space-between">
                                                <Typography sx={{ fontFamily: fB, fontSize: "0.75rem", color: T.textSub }}>Status</Typography>
                                                {renderStatus(item.status)}
                                            </Box>
                                            <Box display="flex" justifyContent="space-between">
                                                <Typography sx={{ fontFamily: fB, fontSize: "0.75rem", color: T.textSub }}>Network</Typography>
                                                <Typography sx={{ fontFamily: fM, fontSize: "0.75rem", color: T.text }}>{item.ip}:{item.port}</Typography>
                                            </Box>
                                            <Box display="flex" justifyContent="space-between">
                                                <Typography sx={{ fontFamily: fB, fontSize: "0.75rem", color: T.textSub }}>Last Sync</Typography>
                                                <Typography sx={{ fontFamily: fB, fontSize: "0.75rem", color: T.text }}>{item.lastSync}</Typography>
                                            </Box>
                                        </Box>
                                        <Box display="flex" gap={1} mt={2.5}>
                                            <Button fullWidth size="small" variant="outlined" startIcon={<SettingsInputComponent sx={{ fontSize: 13 }} />} onClick={() => handleOpenConfig(item, "biometric")}
                                                sx={{ fontFamily: fB, fontSize: "0.72rem", textTransform: "none", color: T.textSub, borderColor: T.border, borderRadius: "6px" }}>Configure</Button>
                                            <Button fullWidth size="small" variant="contained" disabled={!item.active} startIcon={<Sync sx={{ fontSize: 13 }} />} onClick={() => handleSync(item.name)}
                                                sx={{ fontFamily: fB, fontSize: "0.72rem", textTransform: "none", bgcolor: T.teal, boxShadow: "none", borderRadius: "6px", "&:hover": { bgcolor: "#0d9488" } }}>Sync Now</Button>
                                        </Box>
                                    </SCard>
                                </Grid>
                            ))}
                        </Grid>
                    )}

                    {/* ════ TAB 1: GPS ════ */}
                    {tabIndex === 1 && (
                        <Grid container spacing={2.5}>
                            {integrations.gps.map((item) => (
                                <Grid item xs={12} md={6} key={item.id}>
                                    <SCard sx={{ p: 2, height: "100%", transition: "all 0.2s", "&:hover": { borderColor: T.purple, boxShadow: `0 4px 12px ${T.purple}15` } }}>
                                        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                                            <Box display="flex" alignItems="center" gap={1.5}>
                                                <Box sx={{ p: 1, borderRadius: "8px", bgcolor: `${T.purple}15`, color: T.purple }}>
                                                    <LocalShipping sx={{ fontSize: 20 }} />
                                                </Box>
                                                <Box>
                                                    <Typography sx={{ fontFamily: fB, fontWeight: 700, fontSize: "0.9rem", color: T.text }}>{item.name}</Typography>
                                                    <Typography sx={{ fontFamily: fB, fontSize: "0.7rem", color: T.textMute }}>Provider: {item.provider}</Typography>
                                                </Box>
                                            </Box>
                                            <Switch size="small" checked={item.active} onChange={() => handleToggleActive("gps", item.id)} sx={{ "& .MuiSwitch-switchBase.Mui-checked": { color: T.purple }, "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { bgcolor: T.purple } }} />
                                        </Box>
                                        <Divider sx={{ mb: 1.5, borderColor: T.border }} />
                                        <Box display="flex" flexDirection="column" gap={1}>
                                            <Box display="flex" justifyContent="space-between">
                                                <Typography sx={{ fontFamily: fB, fontSize: "0.75rem", color: T.textSub }}>Status</Typography>
                                                {renderStatus(item.status)}
                                            </Box>
                                            <Box display="flex" justifyContent="space-between">
                                                <Typography sx={{ fontFamily: fB, fontSize: "0.75rem", color: T.textSub }}>API Calls</Typography>
                                                <Typography sx={{ fontFamily: fM, fontSize: "0.75rem", color: T.text }}>{item.apiCalls}</Typography>
                                            </Box>
                                            <Box mt={1}>
                                                <Typography sx={{ fontFamily: fB, fontSize: "0.7rem", color: T.textMute, mb: 0.5 }}>Webhook URL</Typography>
                                                <Box sx={{ display: "flex", alignItems: "center", bgcolor: "#F3F4F6", borderRadius: "6px", px: 1.5, py: 0.8 }}>
                                                    <Typography sx={{ fontFamily: fM, fontSize: "0.7rem", color: T.textSub, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.webhook}</Typography>
                                                </Box>
                                            </Box>
                                        </Box>
                                        <Box display="flex" gap={1} mt={2.5}>
                                            <Button fullWidth size="small" variant="outlined" startIcon={<SettingsInputComponent sx={{ fontSize: 13 }} />} onClick={() => handleOpenConfig(item, "gps")}
                                                sx={{ fontFamily: fB, fontSize: "0.72rem", textTransform: "none", color: T.textSub, borderColor: T.border, borderRadius: "6px" }}>Configure Settings</Button>
                                        </Box>
                                    </SCard>
                                </Grid>
                            ))}
                        </Grid>
                    )}

                    {/* ════ TAB 2: PAYMENTS ════ */}
                    {tabIndex === 2 && (
                        <Grid container spacing={2.5}>
                            {integrations.payment.map((item) => (
                                <Grid item xs={12} md={6} lg={4} key={item.id}>
                                    <SCard sx={{ p: 2, height: "100%", transition: "all 0.2s", opacity: item.active ? 1 : 0.6, "&:hover": { borderColor: T.accent, boxShadow: `0 4px 12px ${T.accent}15`, opacity: 1 } }}>
                                        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                                            <Box display="flex" alignItems="center" gap={1.5}>
                                                <Box sx={{ p: 1, borderRadius: "8px", bgcolor: `${T.accent}15`, color: T.accent }}>
                                                    <Payment sx={{ fontSize: 20 }} />
                                                </Box>
                                                <Box>
                                                    <Typography sx={{ fontFamily: fB, fontWeight: 700, fontSize: "0.9rem", color: T.text }}>{item.name}</Typography>
                                                    <Typography sx={{ fontFamily: fB, fontSize: "0.7rem", color: T.textMute }}>Gateway: {item.gateway}</Typography>
                                                </Box>
                                            </Box>
                                            <Switch size="small" checked={item.active} onChange={() => handleToggleActive("payment", item.id)} sx={{ "& .MuiSwitch-switchBase.Mui-checked": { color: T.accent }, "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { bgcolor: T.accent } }} />
                                        </Box>
                                        <Divider sx={{ mb: 1.5, borderColor: T.border }} />
                                        <Box display="flex" flexDirection="column" gap={1}>
                                            <Box display="flex" justifyContent="space-between">
                                                <Typography sx={{ fontFamily: fB, fontSize: "0.75rem", color: T.textSub }}>Status</Typography>
                                                {renderStatus(item.status)}
                                            </Box>
                                            <Box display="flex" justifyContent="space-between">
                                                <Typography sx={{ fontFamily: fB, fontSize: "0.75rem", color: T.textSub }}>Environment</Typography>
                                                <Chip label={item.mode} size="small" sx={{ height: 20, fontSize: "0.65rem", fontFamily: fB, fontWeight: 700, bgcolor: item.mode === "Live" ? T.successLight : T.warningLight, color: item.mode === "Live" ? T.success : T.warning }} />
                                            </Box>
                                            <Box display="flex" justifyContent="space-between">
                                                <Typography sx={{ fontFamily: fB, fontSize: "0.75rem", color: T.textSub }}>Currency</Typography>
                                                <Typography sx={{ fontFamily: fM, fontSize: "0.75rem", color: T.text }}>{item.currency}</Typography>
                                            </Box>
                                            <Box mt={1}>
                                                <Typography sx={{ fontFamily: fB, fontSize: "0.7rem", color: T.textMute, mb: 0.5 }}>API Keys</Typography>
                                                <Box sx={{ display: "flex", alignItems: "center", bgcolor: "#F3F4F6", borderRadius: "6px", px: 1, py: 0.5 }}>
                                                    <VpnKey sx={{ fontSize: 13, color: T.textMute, mr: 1 }} />
                                                    <Typography sx={{ fontFamily: fM, fontSize: "0.7rem", color: T.textSub, flex: 1, letterSpacing: showTokens[item.id] ? "normal" : "2px" }}>
                                                        {showTokens[item.id] ? "sk_test_1234567890abcdef" : "••••••••••••••••"}
                                                    </Typography>
                                                    <IconButton size="small" onClick={() => toggleTokenVisibility(item.id)}>
                                                        {showTokens[item.id] ? <VisibilityOff sx={{ fontSize: 14 }} /> : <Visibility sx={{ fontSize: 14 }} />}
                                                    </IconButton>
                                                </Box>
                                            </Box>
                                        </Box>
                                        <Box display="flex" gap={1} mt={2.5}>
                                            <Button fullWidth size="small" variant="contained" disabled={!item.active} startIcon={<SettingsInputComponent sx={{ fontSize: 13 }} />} onClick={() => handleOpenConfig(item, "payment")}
                                                sx={{ fontFamily: fB, fontSize: "0.72rem", textTransform: "none", bgcolor: T.accent, boxShadow: "none", borderRadius: "6px", "&:hover": { bgcolor: "#4f46e5" } }}>Manage Keys</Button>
                                        </Box>
                                    </SCard>
                                </Grid>
                            ))}
                        </Grid>
                    )}

                    {/* ════ TAB 3: WEBHOOKS (EMPTY STATE) ════ */}
                    {tabIndex === 3 && (
                        <Box sx={{ textAlign: "center", py: 8 }}>
                            <Api sx={{ fontSize: 60, color: T.textMute, opacity: 0.3, mb: 2 }} />
                            <Typography sx={{ fontFamily: fH, fontWeight: 700, fontSize: "1.2rem", color: T.text }}>No Custom Webhooks</Typography>
                            <Typography sx={{ fontFamily: fB, fontSize: "0.85rem", color: T.textSub, mt: 1, maxWidth: 400, mx: "auto", mb: 3 }}>
                                You haven't configured any custom webhook endpoints to receive system events.
                            </Typography>
                            <Button variant="outlined" startIcon={<Add />} sx={{ fontFamily: fB, textTransform: "none", borderRadius: "8px", borderColor: T.accent, color: T.accent }}>
                                Create Webhook
                            </Button>
                        </Box>
                    )}
                </Box>
            </SCard>

            {/* ═══ Configuration Dialog ═══ */}
            <Dialog open={configOpen} onClose={() => setConfigOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: "14px", p: 1 } }}>
                {currentConfig && (
                    <>
                        <DialogTitle sx={{ fontFamily: fH, fontWeight: 700, pb: 1 }}>Configure: {currentConfig.name}</DialogTitle>
                        <DialogContent>
                            <Box my={1} display="flex" flexDirection="column" gap={2}>
                                <TextField fullWidth size="small" label="Name / Identifier" value={currentConfig.name} onChange={(e) => setCurrentConfig({ ...currentConfig, name: e.target.value })} sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px", fontFamily: fB } }} />
                                {currentConfig.category === "biometric" && (
                                    <Grid container spacing={2}>
                                        <Grid item xs={8}><TextField fullWidth size="small" label="Device IP Address" value={currentConfig.ip} onChange={(e) => setCurrentConfig({ ...currentConfig, ip: e.target.value })} sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px", fontFamily: fM } }} /></Grid>
                                        <Grid item xs={4}><TextField fullWidth size="small" label="Port" value={currentConfig.port} onChange={(e) => setCurrentConfig({ ...currentConfig, port: e.target.value })} sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px", fontFamily: fM } }} /></Grid>
                                        <Grid item xs={12}><TextField fullWidth size="small" label="Physical Location" value={currentConfig.location} onChange={(e) => setCurrentConfig({ ...currentConfig, location: e.target.value })} sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px", fontFamily: fB } }} /></Grid>
                                    </Grid>
                                )}
                                {currentConfig.category === "gps" && (
                                    <Grid container spacing={2}>
                                        <Grid item xs={12}><TextField fullWidth size="small" label="Provider / Service" value={currentConfig.provider} disabled sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px", fontFamily: fB } }} /></Grid>
                                        <Grid item xs={12}><TextField fullWidth size="small" label="Webhook URL" value={currentConfig.webhook} onChange={(e) => setCurrentConfig({ ...currentConfig, webhook: e.target.value })} sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px", fontFamily: fM } }} /></Grid>
                                    </Grid>
                                )}
                                {currentConfig.category === "payment" && (
                                    <Grid container spacing={2}>
                                        <Grid item xs={12}><TextField fullWidth size="small" label="Gateway Identifier" value={currentConfig.gateway} disabled sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px", fontFamily: fB } }} /></Grid>
                                        <Grid item xs={12}><TextField fullWidth size="small" label="API Key (Secret)" defaultValue="sk_test_1234567890abcdef" type="password" sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px", fontFamily: fM } }} /></Grid>
                                        <Grid item xs={12}><TextField fullWidth size="small" label="Webhook Secret" defaultValue="whsec_xxxxx" type="password" sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px", fontFamily: fM } }} /></Grid>
                                    </Grid>
                                )}
                            </Box>
                        </DialogContent>
                        <DialogActions sx={{ p: 2 }}>
                            <Button onClick={() => setConfigOpen(false)} sx={{ fontFamily: fB, fontWeight: 600, textTransform: "none", color: T.textSub }}>Cancel</Button>
                            <Button onClick={handleSaveConfig} variant="contained" sx={{ fontFamily: fB, fontWeight: 600, textTransform: "none", bgcolor: T.accent, borderRadius: "8px" }}>Save Configuration</Button>
                        </DialogActions>
                    </>
                )}
            </Dialog>

            {/* Snackbar */}
            <Snackbar open={snack.open} autoHideDuration={3000} onClose={() => setSnack(s => ({ ...s, open: false }))} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
                <Alert severity={snack.severity} sx={{ borderRadius: "10px", fontFamily: fB, fontWeight: 600 }} onClose={() => setSnack(s => ({ ...s, open: false }))}>{snack.msg}</Alert>
            </Snackbar>
        </Box>
    );
};

export default IntegrationSettingsView;
