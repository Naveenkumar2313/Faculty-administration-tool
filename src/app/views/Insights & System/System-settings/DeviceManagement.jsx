import React, { useState } from 'react';
import {
    Box, Grid, Typography, Button, Table, TableBody, TableCell, TableHead, TableRow, Stack,
    Badge, Switch, Card, CardContent, CardHeader, TextField, InputAdornment, IconButton, Tooltip
} from "@mui/material";
import {
    Phonelink, VerifiedUser, LaptopMac, Smartphone, CheckCircle, Cancel,
    Logout, Warning, Security, Search, FilterList, Sync
} from "@mui/icons-material";

const T = { bg: "#F5F7FA", surface: "#FFFFFF", border: "#E4E8EF", accent: "#6366F1", text: "#111827", textSub: "#4B5563", textMute: "#9CA3AF" };
const fHead = "Roboto, sans-serif"; const fBody = "Roboto, sans-serif"; const fMono = "Roboto Mono, monospace";

const INIT_SESSIONS = [
    { id: 's1', user: 'Dr. Smith', email: 'smith@university.edu', device: 'MacBook Pro', os: 'macOS', browser: 'Chrome', ip: '192.168.1.105', lastActive: '2 mins ago', isCurrent: false, locked: true },
    { id: 's2', user: 'Admin User', email: 'admin@university.edu', device: 'Windows PC', os: 'Windows 11', browser: 'Edge', ip: '192.168.1.50', lastActive: 'Just now', isCurrent: true, locked: false },
];

const INIT_REQS = [
    { id: 'req1', user: 'Prof. Johnson', email: 'johnson@university.edu', oldDeviceId: 's3', oldDevice: 'iPhone 13', newDevice: 'iPhone 15 Pro', os: 'iOS', browser: 'Safari', ip: '10.0.0.99', reason: 'Lost previous device', date: '10 mins ago' },
];

export default function DeviceManagement() {
    const [sessions, setSessions] = useState(INIT_SESSIONS);
    const [requests, setRequests] = useState(INIT_REQS);
    const [searchQuery, setSearchQuery] = useState('');
    const [strictLockIn, setStrictLockIn] = useState(true);

    const handleRevoke = (id) => setSessions(sessions.filter(s => s.id !== id));
    const handleToggleLock = (id) => setSessions(sessions.map(s => s.id === id ? { ...s, locked: !s.locked } : s));

    const handleApprove = (req) => {
        setSessions(prev => [
            ...prev.filter(s => s.id !== req.oldDeviceId),
            { id: `s_${Date.now()}`, user: req.user, email: req.email, device: req.newDevice, os: req.os, browser: req.browser, ip: req.ip, lastActive: 'Just now', isCurrent: false, locked: true }
        ]);
        setRequests(prev => prev.filter(r => r.id !== req.id));
    };

    const filteredSessions = sessions.filter(s => s.user.toLowerCase().includes(searchQuery.toLowerCase()) || s.device.toLowerCase().includes(searchQuery.toLowerCase()));

    return (
        <Box sx={{ p: 3, bgcolor: T.bg, minHeight: "100vh", fontFamily: fBody }}>
            <Box mb={3}>
                <Typography sx={{ fontFamily: fHead, fontWeight: 700, fontSize: "1.5rem", color: T.text }}>Device & Session Management</Typography>
                <Typography sx={{ fontFamily: fBody, fontSize: "0.82rem", color: T.textSub }}>Manage active user sessions and enforce device lock-in policies.</Typography>
            </Box>

            <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                    <Stack spacing={3}>
                        {/* Pending Requests */}
                        {requests.length > 0 && (
                            <Card sx={{ border: "1px solid #FED7AA", boxShadow: "none", borderRadius: "14px" }}>
                                <Box sx={{ bgcolor: "#FFF7ED", p: 2.5, borderBottom: "1px solid #FFEDD5" }}>
                                    <Typography sx={{ display: "flex", alignItems: "center", gap: 1, fontFamily: fHead, fontWeight: 700, color: "#9A3412" }}>
                                        <Sync sx={{ fontSize: 18 }} /> Pending Device Replacements
                                        <Badge badgeContent={requests.length} sx={{ "& .MuiBadge-badge": { bgcolor: "#FED7AA", color: "#9A3412", fontWeight: 700 } }} />
                                    </Typography>
                                </Box>
                                <Table>
                                    <TableHead><TableRow><TableCell>User</TableCell><TableCell>Replacement Request</TableCell><TableCell>Reason</TableCell><TableCell align="right">Actions</TableCell></TableRow></TableHead>
                                    <TableBody>
                                        {requests.map(req => (
                                            <TableRow key={req.id}>
                                                <TableCell><Typography sx={{ fontWeight: 600 }}>{req.user}</Typography><Typography sx={{ fontSize: "0.75rem", color: T.textMute }}>{req.email}</Typography></TableCell>
                                                <TableCell>
                                                    <Typography sx={{ fontSize: "0.8rem", color: T.textMute, textDecoration: "line-through", display: "flex", alignItems: "center", gap: 1 }}><Cancel sx={{ fontSize: 14, color: T.danger }} /> {req.oldDevice}</Typography>
                                                    <Typography sx={{ fontSize: "0.8rem", fontWeight: 600, color: "#15803D", display: "flex", alignItems: "center", gap: 1 }}><CheckCircle sx={{ fontSize: 14 }} /> {req.newDevice} ({req.os})</Typography>
                                                </TableCell>
                                                <TableCell><Typography sx={{ fontSize: "0.8rem" }}>{req.reason}</Typography><Typography sx={{ fontSize: "0.7rem", color: T.textMute }}>{req.date}</Typography></TableCell>
                                                <TableCell align="right">
                                                    <Button size="small" variant="outlined" color="error" sx={{ mr: 1, textTransform: "none" }} onClick={() => setRequests(requests.filter(r => r.id !== req.id))}>Deny</Button>
                                                    <Button size="small" variant="contained" color="success" sx={{ textTransform: "none", boxShadow: "none" }} onClick={() => handleApprove(req)}>Approve</Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </Card>
                        )}

                        {/* Active Sessions */}
                        <Card sx={{ border: `1px solid ${T.border}`, boxShadow: "none", borderRadius: "14px" }}>
                            <Box p={2.5} borderBottom={`1px solid ${T.border}`}>
                                <Typography sx={{ display: "flex", alignItems: "center", gap: 1, fontFamily: fHead, fontWeight: 700, fontSize: "1.1rem" }}><Phonelink sx={{ color: T.accent }} /> Active Sessions</Typography>
                            </Box>
                            <Box p={2.5} display="flex" gap={2}>
                                <TextField size="small" placeholder="Search by user or device..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} InputProps={{ startAdornment: <InputAdornment position="start"><Search sx={{ fontSize: 18 }} /></InputAdornment> }} sx={{ flex: 1, "& .MuiOutlinedInput-root": { borderRadius: "8px" } }} />
                                <Button variant="outlined" startIcon={<FilterList />} sx={{ borderRadius: "8px", textTransform: "none", color: T.textSub, borderColor: T.border }}>Filter</Button>
                            </Box>
                            <Table>
                                <TableHead><TableRow><TableCell>User</TableCell><TableCell>Device Info</TableCell><TableCell>IP Address</TableCell><TableCell>Status</TableCell><TableCell align="right">Actions</TableCell></TableRow></TableHead>
                                <TableBody>
                                    {filteredSessions.map(session => (
                                        <TableRow key={session.id}>
                                            <TableCell><Typography sx={{ fontWeight: 600, fontSize: "0.85rem" }}>{session.user}</Typography><Typography sx={{ fontSize: "0.75rem", color: T.textMute }}>{session.email}</Typography></TableCell>
                                            <TableCell>
                                                <Box display="flex" alignItems="center" gap={1.5}>
                                                    {session.os.includes('iOS') || session.os.includes('Android') ? <Smartphone sx={{ color: T.textMute }} /> : <LaptopMac sx={{ color: T.textMute }} />}
                                                    <Box><Typography sx={{ fontSize: "0.85rem", fontWeight: 500 }}>{session.device}</Typography><Typography sx={{ fontSize: "0.7rem", color: T.textMute }}>{session.os} • {session.browser}</Typography></Box>
                                                </Box>
                                            </TableCell>
                                            <TableCell><Typography sx={{ fontFamily: fMono, fontSize: "0.8rem", color: T.textMute }}>{session.ip}</Typography><Typography sx={{ fontSize: "0.7rem", color: T.textMute }}>{session.lastActive}</Typography></TableCell>
                                            <TableCell>
                                                {session.isCurrent ? <Box sx={{ px: 1, py: 0.3, borderRadius: "6px", bgcolor: "#22C55E", color: "#FFF", fontSize: "0.7rem", fontWeight: 700, display: "inline-block" }}>Current Session</Box> :
                                                    session.locked ? <Box sx={{ px: 1, py: 0.3, borderRadius: "6px", border: `1px solid ${T.accent}`, color: T.accent, fontSize: "0.7rem", fontWeight: 700, display: "flex", alignItems: "center", gap: 0.5, width: "fit-content" }}><VerifiedUser sx={{ fontSize: 14 }} /> Locked In</Box> :
                                                        <Box sx={{ px: 1, py: 0.3, borderRadius: "6px", bgcolor: T.border, fontSize: "0.7rem", fontWeight: 700, display: "inline-block" }}>Active</Box>}
                                            </TableCell>
                                            <TableCell align="right">
                                                {!session.isCurrent && (
                                                    <Box display="flex" justifyContent="flex-end" gap={1}>
                                                        <Tooltip title={session.locked ? "Unlock Device" : "Lock to Device"}>
                                                            <IconButton size="small" onClick={() => handleToggleLock(session.id)} sx={{ border: `1px solid ${T.border}`, borderRadius: "8px" }}>
                                                                {session.locked ? <Cancel sx={{ fontSize: 16, color: T.textMute }} /> : <VerifiedUser sx={{ fontSize: 16, color: T.accent }} />}
                                                            </IconButton>
                                                        </Tooltip>
                                                        <Tooltip title="Revoke Session">
                                                            <IconButton size="small" onClick={() => handleRevoke(session.id)} sx={{ border: `1px solid ${T.danger}50`, color: T.danger, borderRadius: "8px", bgcolor: T.dangerLight }}>
                                                                <Logout sx={{ fontSize: 16 }} />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </Box>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Card>
                    </Stack>
                </Grid>

                {/* Policies Sidebar */}
                <Grid item xs={12} md={4}>
                    <Stack spacing={3}>
                        <Card sx={{ border: `1px solid ${T.border}`, boxShadow: "none", borderRadius: "14px" }}>
                            <Box p={2.5} borderBottom={`1px solid ${T.border}`}>
                                <Typography sx={{ display: "flex", alignItems: "center", gap: 1, fontFamily: fHead, fontWeight: 700, fontSize: "1.1rem" }}><Security sx={{ color: T.accent }} /> Security Policies</Typography>
                            </Box>
                            <CardContent sx={{ p: 2.5 }}>
                                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3}>
                                    <Box flex={1} pr={2}>
                                        <Typography sx={{ fontWeight: 600, fontSize: "0.85rem", mb: 0.5 }}>Strict Device Lock-in</Typography>
                                        <Typography sx={{ fontSize: "0.75rem", color: T.textSub, lineHeight: 1.4 }}>When enabled, users can only log in from their registered primary device.</Typography>
                                    </Box>
                                    <Switch checked={strictLockIn} onChange={e => setStrictLockIn(e.target.checked)} sx={{ "& .MuiSwitch-switchBase.Mui-checked": { color: T.accent }, "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { bgcolor: T.accent } }} />
                                </Box>
                                <Box mb={3}>
                                    <Box mb={1}>
                                        <Typography sx={{ fontWeight: 600, fontSize: "0.85rem" }}>Max Devices per User</Typography>
                                        <Typography sx={{ fontSize: "0.75rem", color: T.textSub }}>Limit the number of simultaneous active devices.</Typography>
                                    </Box>
                                    <TextField fullWidth size="small" type="number" defaultValue={3} InputProps={{ endAdornment: <InputAdornment position="end">devices</InputAdornment> }} sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px", fontFamily: fBody } }} />
                                </Box>
                                <Box mb={3}>
                                    <Box mb={1}>
                                        <Typography sx={{ fontWeight: 600, fontSize: "0.85rem" }}>Session Timeout</Typography>
                                        <Typography sx={{ fontSize: "0.75rem", color: T.textSub }}>Automatically log out inactive sessions.</Typography>
                                    </Box>
                                    <TextField fullWidth size="small" type="number" defaultValue={24} InputProps={{ endAdornment: <InputAdornment position="end">hours</InputAdornment> }} sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px", fontFamily: fBody } }} />
                                </Box>
                                <Button fullWidth variant="contained" sx={{ bgcolor: T.text, borderRadius: "8px", textTransform: "none", fontWeight: 700, py: 1, color: "#FFF" }}>Save Policies</Button>
                            </CardContent>
                        </Card>

                        <Box sx={{ p: 2.5, bgcolor: T.accentLight, borderRadius: "14px", border: `1px solid ${T.accent}30` }}>
                            <Box display="flex" gap={1.5}>
                                <Warning sx={{ color: T.accent, fontSize: 20 }} />
                                <Box>
                                    <Typography sx={{ fontWeight: 700, fontSize: "0.85rem", color: T.accent, mb: 0.5 }}>About Device Lock-in</Typography>
                                    <Typography sx={{ fontSize: "0.75rem", color: T.textSub, lineHeight: 1.5 }}>
                                        Device lock-in uses browser fingerprinting and IP tracking to ensure users only access the system from authorized hardware. Revoking a session immediately logs the user out on that device.
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                    </Stack>
                </Grid>
            </Grid>
        </Box>
    );
}