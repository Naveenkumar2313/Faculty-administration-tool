import React, { useState } from "react";
import { 
  Box, Grid, Typography, Button, Table, TableBody, TableCell, 
  TableHead, TableRow, Chip, IconButton, Tooltip, Dialog, DialogTitle, 
  DialogContent, DialogActions, TextField, MenuItem, Tabs, Tab, 
  Avatar, Stack, Divider, Alert, InputAdornment, Badge
} from "@mui/material";
import { 
  Security, ManageAccounts, Lock, Add, Delete, Edit, 
  AdminPanelSettings, VerifiedUser, Shield, ArrowRight,
  CheckCircle, Person, Email, LocationCity,  MoreVert,
  Info
} from "@mui/icons-material";

/* ─────────────────────────────────────────
   DESIGN TOKENS (matching your system)
───────────────────────────────────────── */
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
  purple:       "#8B5CF6",
  purpleLight:  "#F5F3FF",
  info:         "#0EA5E9",
  infoLight:    "#F0F9FF",
  text:         "#111827",
  textSub:      "#4B5563",
  textMute:     "#9CA3AF",
};

const fHead = "Roboto, Helvetica, Arial, sans-serif";
const fBody = "Roboto, Helvetica, Arial, sans-serif";
const fMono = "Roboto, Helvetica, Arial, sans-serif";

const Fonts = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Sora:wght@600;700&family=Nunito:wght@400;500;600;700&family=JetBrains+Mono:wght@500;600&display=swap');
    * { box-sizing:border-box; }
    @keyframes fadeUp { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:none} }
    @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.35} }
    .fu  { animation: fadeUp 0.28s ease both; }
    .fu1 { animation: fadeUp 0.28s .07s ease both; }
    .fu2 { animation: fadeUp 0.28s .14s ease both; }
    .fu3 { animation: fadeUp 0.28s .21s ease both; }
    .card-h { transition:box-shadow .16s,transform .16s; }
    .card-h:hover { box-shadow:0 4px 20px rgba(99,102,241,.11); transform:translateY(-2px); }
    .row-h:hover { background:#F9FAFB !important; transition:background .13s; }
  `}</style>
);

/* ─────────────────────────────────────────
   PRIMITIVES
───────────────────────────────────────── */
const SCard = ({ children, sx={}, hover=false, ...p }) => (
  <Box className={hover?"card-h":""}
    sx={{ background:T.surface, border:`1px solid ${T.border}`, borderRadius:"14px", ...sx }}
    {...p}>
    {children}
  </Box>
);

const SLabel = ({ children, sx={} }) => (
  <Typography sx={{ fontFamily:fBody, fontSize:"0.67rem", fontWeight:700,
    letterSpacing:"0.08em", textTransform:"uppercase", color:T.textMute, mb:0.6, ...sx }}>
    {children}
  </Typography>
);

/* ─────────────────────────────────────────
   MOCK DATA
───────────────────────────────────────── */
const ROLES_DATA = [
  { id: 1, name: "Super Admin", desc: "Full access to everything", users: 2, color: T.danger, light: T.dangerLight, icon: Shield },
  { id: 2, name: "HR Manager", desc: "HR, Payroll, Leave, Attendance", users: 3, color: T.accent, light: T.accentLight, icon: ManageAccounts },
  { id: 3, name: "Finance Controller", desc: "Reimbursements, Salary, Budgets", users: 2, color: T.success, light: T.successLight, icon: LocationCity },
  { id: 4, name: "Academic Dean", desc: "PBAS, Committees, Research", users: 1, color: T.info, light: T.infoLight, icon: AdminPanelSettings },
  { id: 5, name: "Legal Officer", desc: "Policies, Contracts, Grievances", users: 1, color: T.warning, light: T.warningLight, icon: Lock },
  { id: 6, name: "Logistics Manager", desc: "Assets, Rooms, Maintenance", users: 2, color: T.purple, light: T.purpleLight, icon: ManageAccounts },
  { id: 7, name: "HOD", desc: "Dept-level approvals (leave, OD)", users: 6, color: T.textMute, light: "#F3F4F6", icon: Person },
];

const PERMISSIONS_MATRIX = {
  "Super Admin": ["RW", "RW", "RW", "RW", "RW", "RW"],
  "HR Manager": ["RW", "R", "R", "-", "-", "-"],
  "Finance Controller": ["R", "RW", "-", "R", "-", "-"],
  "Academic Dean": ["-", "-", "RW", "-", "-", "-"],
  "Logistics Manager": ["-", "-", "-", "RW", "-", "-"],
  "Legal Officer": ["-", "-", "-", "-", "RW", "-"],
};

const MODULES = ["HR & Payroll", "Finance", "Research (PBAS)", "Logistics", "Legal", "Settings"];

const RBACSettingsView = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [newUser, setNewUser] = useState({ name: "", role: "HR Manager" });
  const [assignments, setAssignments] = useState([
    { id: 101, name: "Dr. Admin User", email: "admin@college.edu", role: "Super Admin", dept: "Administration", avatar: "A" },
    { id: 102, name: "Mr. HR Head", email: "hr@college.edu", role: "HR Manager", dept: "HR Office", avatar: "H" },
    { id: 103, name: "Ms. Fin Officer", email: "finance@college.edu", role: "Finance Controller", dept: "Accounts", avatar: "F" },
    { id: 104, name: "Dr. Sarah Smith", email: "sarah.cse@college.edu", role: "HOD", dept: "CSE", avatar: "S" },
  ]);

  const handleAssign = () => {
    if (!newUser.name.trim()) return;
    const newAssignment = {
      id: Date.now(),
      name: newUser.name,
      email: `${newUser.name.toLowerCase().replace(/\s+/g, ".")}@college.edu`,
      role: newUser.role,
      dept: "Assigned Department",
      avatar: newUser.name.charAt(0).toUpperCase()
    };
    setAssignments([...assignments, newAssignment]);
    setOpenDialog(false);
    setNewUser({ name: "", role: "HR Manager" });
  };

  const handleRevoke = (id) => {
    setAssignments(assignments.filter(a => a.id !== id));
  };

  const getRoleColor = (roleName) => {
    const role = ROLES_DATA.find(r => r.name === roleName);
    return role || { color: T.textMute, light: "#F3F4F6" };
  };

  const PermissionChip = ({ permission }) => {
    if (permission === "RW") {
      return <Chip label="Read/Write" size="small" sx={{ bgcolor:T.successLight, color:T.success, fontWeight:600, fontSize:"0.7rem", fontFamily:fBody }} icon={<CheckCircle sx={{fontSize:14}}/>} />;
    } else if (permission === "R") {
      return <Chip label="Read Only" size="small" sx={{ bgcolor:T.infoLight, color:T.info, fontWeight:600, fontSize:"0.7rem", fontFamily:fBody, border:`1px solid ${T.info}40` }} variant="outlined" />;
    } else {
      return <Chip label="No Access" size="small" sx={{ bgcolor:"#F3F4F6", color:T.textMute, fontWeight:600, fontSize:"0.7rem", fontFamily:fBody, opacity:0.6 }} variant="outlined" />;
    }
  };

  return (
    <Box sx={{ p:3, bgcolor:T.bg, minHeight:"100vh", fontFamily:fBody }}>
      <Fonts />

      {/* ─── HEADER ─── */}
      <Box mb={3} className="fu">
        <Typography sx={{ fontFamily:fBody, fontSize:"0.72rem", fontWeight:700,
          letterSpacing:"0.1em", textTransform:"uppercase", color:T.textMute, mb:0.3 }}>
          Administration · Settings
        </Typography>
        <Typography sx={{ fontFamily:fHead, fontWeight:700, fontSize:"1.5rem", color:T.text, mb:0.5 }}>
          Role-Based Access Control
        </Typography>
        <Typography sx={{ fontFamily:fBody, fontSize:"0.82rem", color:T.textSub }}>
          Manage roles, permissions, and user access levels
        </Typography>
      </Box>

      {/* ─── MAIN CARD ─── */}
      <SCard sx={{ overflow:"hidden" }} className="fu1">
        {/* TAB NAVIGATION */}
        <Box sx={{ borderBottom:`1px solid ${T.border}`, bgcolor:"#FAFBFD", px:3 }}>
          <Tabs 
            value={tabIndex} 
            onChange={(e, v) => setTabIndex(v)}
            sx={{
              "& .MuiTabs-indicator":{ bgcolor:T.accent, height:"2.5px", borderRadius:"2px 2px 0 0" },
              "& .MuiTab-root":{ fontFamily:fBody, fontWeight:600, fontSize:"0.82rem", textTransform:"none", color:T.textMute, minHeight:50, "&.Mui-selected":{ color:T.accent } }
            }}
          >
            <Tab icon={<ManageAccounts sx={{fontSize:16}} />} iconPosition="start" label="User Assignments" />
            <Tab icon={<Security sx={{fontSize:16}} />} iconPosition="start" label="Permission Matrix" />
            <Tab icon={<AdminPanelSettings sx={{fontSize:16}} />} iconPosition="start" label="Role Definitions" />
          </Tabs>
        </Box>

        <Box p={3}>
          {/* ══════════════════════════════════════
              TAB 0: USER ASSIGNMENTS
          ══════════════════════════════════════ */}
          {tabIndex === 0 && (
            <Box>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2.5}>
                <Box>
                  <Typography sx={{ fontFamily:fHead, fontWeight:700, fontSize:"0.95rem", color:T.text, mb:0.3 }}>
                    Admin Users
                  </Typography>
                  <Typography sx={{ fontFamily:fBody, fontSize:"0.75rem", color:T.textMute }}>
                    {assignments.length} users with administrative privileges
                  </Typography>
                </Box>
                <Button 
                  variant="contained" 
                  startIcon={<Add sx={{fontSize:16}} />} 
                  onClick={() => setOpenDialog(true)}
                  sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.8rem", textTransform:"none", borderRadius:"9px", bgcolor:T.accent, boxShadow:"none", "&:hover":{ bgcolor:"#4F46E5", boxShadow:"none" } }}>
                  Assign New Admin
                </Button>
              </Box>

              {assignments.length === 0 ? (
                <Box sx={{ textAlign:"center", py:6 }}>
                  <ManageAccounts sx={{ fontSize:48, color:T.border, mb:2 }} />
                  <Typography sx={{ fontFamily:fBody, color:T.textMute }}>
                    No users assigned yet. Add your first admin user.
                  </Typography>
                </Box>
              ) : (
                <Box sx={{ overflowX:"auto" }}>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ bgcolor:"#FAFBFD", borderBottom:`1px solid ${T.border}` }}>
                        <TableCell sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.75rem", color:T.textMute, textTransform:"uppercase", letterSpacing:"0.05em" }}>User</TableCell>
                        <TableCell sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.75rem", color:T.textMute, textTransform:"uppercase", letterSpacing:"0.05em" }}>Email</TableCell>
                        <TableCell sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.75rem", color:T.textMute, textTransform:"uppercase", letterSpacing:"0.05em" }}>Assigned Role</TableCell>
                        <TableCell sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.75rem", color:T.textMute, textTransform:"uppercase", letterSpacing:"0.05em" }}>Department</TableCell>
                        <TableCell align="right" sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.75rem", color:T.textMute, textTransform:"uppercase", letterSpacing:"0.05em" }}>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {assignments.map((row) => {
                        const roleInfo = getRoleColor(row.role);
                        return (
                          <TableRow key={row.id} className="row-h" sx={{ borderBottom:`1px solid ${T.border}` }}>
                            <TableCell>
                              <Box display="flex" alignItems="center" gap={1}>
                                <Avatar sx={{ width:32, height:32, bgcolor:T.accentLight, color:T.accent, fontWeight:700, fontSize:"0.75rem" }}>
                                  {row.avatar}
                                </Avatar>
                                <Box>
                                  <Typography sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.8rem", color:T.text }}>
                                    {row.name}
                                  </Typography>
                                </Box>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Typography sx={{ fontFamily:fBody, fontSize:"0.75rem", color:T.textSub, display:"flex", alignItems:"center", gap:0.5 }}>
                                <Email sx={{fontSize:13}} /> {row.email}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Chip 
                                label={row.role} 
                                size="small" 
                                sx={{ 
                                  bgcolor:roleInfo.light, 
                                  color:roleInfo.color, 
                                  fontWeight:700, 
                                  fontSize:"0.7rem",
                                  fontFamily:fBody
                                }} 
                              />
                            </TableCell>
                            <TableCell>
                              <Typography sx={{ fontFamily:fBody, fontSize:"0.75rem", color:T.textSub, display:"flex", alignItems:"center", gap:0.5 }}>
                                <LocationCity sx={{fontSize:13}} /> {row.dept}
                              </Typography>
                            </TableCell>
                            <TableCell align="right">
                              <Tooltip title="Edit Role">
                                <IconButton size="small" sx={{ color:T.accent, "&:hover":{ bgcolor:T.accentLight } }}>
                                  <Edit sx={{fontSize:16}} />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Revoke Access">
                                <IconButton 
                                  size="small" 
                                  sx={{ color:T.danger, "&:hover":{ bgcolor:T.dangerLight } }}
                                  onClick={() => handleRevoke(row.id)}>
                                  <Delete sx={{fontSize:16}} />
                                </IconButton>
                              </Tooltip>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </Box>
              )}
            </Box>
          )}

          {/* ══════════════════════════════════════
              TAB 1: PERMISSION MATRIX
          ══════════════════════════════════════ */}
          {tabIndex === 1 && (
            <Box>
              <Box mb={2}>
                <Typography sx={{ fontFamily:fHead, fontWeight:700, fontSize:"0.95rem", color:T.text, mb:0.3 }}>
                  Access Rights Overview
                </Typography>
                <Typography sx={{ fontFamily:fBody, fontSize:"0.75rem", color:T.textMute }}>
                  Module-level permissions for each role
                </Typography>
              </Box>

              <Box sx={{ overflowX:"auto", borderRadius:"10px", border:`1px solid ${T.border}`, bgcolor:T.surface }}>
                <Table sx={{ minWidth:900 }}>
                  <TableHead>
                    <TableRow sx={{ bgcolor:"#FAFBFD", borderBottom:`1px solid ${T.border}` }}>
                      <TableCell sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.75rem", color:T.textMute, textTransform:"uppercase", letterSpacing:"0.05em", minWidth:150 }}>
                        Role / Module
                      </TableCell>
                      {MODULES.map(m => (
                        <TableCell key={m} align="center" sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.7rem", color:T.textMute, textTransform:"uppercase", letterSpacing:"0.05em", minWidth:120 }}>
                          {m}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {Object.entries(PERMISSIONS_MATRIX).map(([role, perms]) => {
                      const roleInfo = getRoleColor(role);
                      return (
                        <TableRow key={role} className="row-h" sx={{ borderBottom:`1px solid ${T.border}` }}>
                          <TableCell sx={{ borderRight:`1px solid ${T.border}`, bgcolor:"#FAFBFD" }}>
                            <Box display="flex" alignItems="center" gap={1}>
                              <Box sx={{ width:6, height:6, borderRadius:"50%", bgcolor:roleInfo.color }} />
                              <Typography sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.8rem", color:T.text }}>
                                {role}
                              </Typography>
                            </Box>
                          </TableCell>
                          {perms.map((p, i) => (
                            <TableCell key={i} align="center">
                              <PermissionChip permission={p} />
                            </TableCell>
                          ))}
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </Box>

              {/* Info Alert */}
              <Alert 
                severity="info" 
                icon={<Info sx={{fontSize:16}} />}
                sx={{ mt:2.5, borderRadius:"9px", fontFamily:fBody, fontSize:"0.77rem", bgcolor:T.infoLight, color:T.info, border:`1px solid ${T.info}30` }}>
                Permissions are hardcoded in v1.0. Custom role definitions and dynamic permission assignment coming in future releases.
              </Alert>
            </Box>
          )}

          {/* ══════════════════════════════════════
              TAB 2: ROLE DEFINITIONS
          ══════════════════════════════════════ */}
          {tabIndex === 2 && (
            <Box>
              <Box mb={2.5}>
                <Typography sx={{ fontFamily:fHead, fontWeight:700, fontSize:"0.95rem", color:T.text, mb:0.3 }}>
                  Available Roles
                </Typography>
                <Typography sx={{ fontFamily:fBody, fontSize:"0.75rem", color:T.textMute }}>
                  {ROLES_DATA.length} predefined roles with specific access levels
                </Typography>
              </Box>

              <Grid container spacing={2.5}>
                {ROLES_DATA.map((role, idx) => {
                  const Icon = role.icon;
                  return (
                    <Grid item xs={12} sm={6} md={4} key={role.id} className="fu1" sx={{animationDelay: `${idx * 50}ms`}}>
                      <SCard 
                        hover 
                        sx={{ 
                          p:2.5, 
                          height:"100%",
                          display:"flex",
                          flexDirection:"column",
                          borderTop:`3px solid ${role.color}`
                        }}>
                        {/* Header */}
                        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1.5}>
                          <Box>
                            <Typography sx={{ fontFamily:fHead, fontWeight:700, fontSize:"0.9rem", color:T.text }}>
                              {role.name}
                            </Typography>
                          </Box>
                          <Box sx={{ p:0.8, borderRadius:"8px", bgcolor:role.light, color:role.color }}>
                            <Icon sx={{fontSize:16}} />
                          </Box>
                        </Box>

                        {/* Description */}
                        <Typography sx={{ fontFamily:fBody, fontSize:"0.75rem", color:T.textSub, mb:2, minHeight:40, flex:1 }}>
                          {role.desc}
                        </Typography>

                        <Divider sx={{ borderColor:T.border, my:1.5 }} />

                        {/* Footer */}
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                          <Box display="flex" alignItems="center" gap={0.8}>
                            <Badge badgeContent={role.users} color="primary" sx={{ "& .MuiBadge-badge":{ bgcolor:T.accent, color:"#fff", fontFamily:fMono, fontWeight:700 } }}>
                              <Person sx={{fontSize:16, color:T.textMute}} />
                            </Badge>
                            <Typography sx={{ fontFamily:fBody, fontSize:"0.7rem", color:T.textMute }}>
                              Active User{role.users !== 1 ? 's' : ''}
                            </Typography>
                          </Box>
                          <IconButton size="small" sx={{ color:T.accent }}>
                            <ArrowRight sx={{fontSize:16}} />
                          </IconButton>
                        </Box>
                      </SCard>
                    </Grid>
                  );
                })}
              </Grid>
            </Box>
          )}
        </Box>
      </SCard>

      {/* ══════════════════════════════════════
          ASSIGN DIALOG
      ══════════════════════════════════════ */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth
        PaperProps={{ sx:{ borderRadius:"16px", border:`1px solid ${T.border}` } }}>
        <DialogTitle sx={{ fontFamily:fHead, fontWeight:700, borderBottom:`1px solid ${T.border}`, bgcolor:"#FAFBFD", pb:2 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography sx={{ fontFamily:fHead, fontWeight:700, fontSize:"0.98rem", color:T.text }}>
                Assign Admin Role
              </Typography>
              <Typography sx={{ fontFamily:fBody, fontSize:"0.7rem", color:T.textMute, mt:0.3 }}>
                Grant administrative privileges to a user
              </Typography>
            </Box>
            <IconButton size="small" onClick={() => setOpenDialog(false)} sx={{ color:T.textMute }}>
              <Lock />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent dividers sx={{ py:3 }}>
          <Stack spacing={2}>
            {/* Name Field */}
            <Box>
              <SLabel>Faculty / Staff Name</SLabel>
              <TextField 
                fullWidth 
                placeholder="Search and select user"
                value={newUser.name} 
                onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person sx={{fontSize:16, color:T.textMute}} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root":{ borderRadius:"8px", fontFamily:fBody,
                    "& fieldset":{ borderColor:T.border },
                    "&.Mui-focused fieldset":{ borderColor:T.accent } }
                }}
              />
            </Box>

            {/* Role Field */}
            <Box>
              <SLabel>Select Role</SLabel>
              <TextField 
                select 
                fullWidth 
                value={newUser.role} 
                onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                sx={{
                  "& .MuiOutlinedInput-root":{ borderRadius:"8px", fontFamily:fBody,
                    "& fieldset":{ borderColor:T.border },
                    "&.Mui-focused fieldset":{ borderColor:T.accent } }
                }}
              >
                {ROLES_DATA.map(r => (
                  <MenuItem key={r.id} value={r.name}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Box sx={{ width:6, height:6, borderRadius:"50%", bgcolor:r.color }} />
                      {r.name}
                    </Box>
                  </MenuItem>
                ))}
              </TextField>
            </Box>

            <Divider sx={{ borderColor:T.border }} />

            {/* Warning Alert */}
            <Alert 
              severity="warning" 
              icon={<Lock sx={{fontSize:16}} />}
              sx={{ borderRadius:"9px", fontFamily:fBody, fontSize:"0.77rem", bgcolor:T.warningLight, color:T.warning, border:`1px solid ${T.warning}30` }}>
              This action grants high-level system access. Assign roles carefully.
            </Alert>
          </Stack>
        </DialogContent>

        <DialogActions sx={{ px:3, pb:3, pt:2, bgcolor:"#FAFBFD", borderTop:`1px solid ${T.border}`, gap:1 }}>
          <Button 
            onClick={() => setOpenDialog(false)} 
            variant="outlined" 
            size="small"
            sx={{ fontFamily:fBody, fontWeight:600, fontSize:"0.78rem", textTransform:"none", borderRadius:"8px", borderColor:T.border, color:T.textSub }}>
            Cancel
          </Button>
          <Button 
            onClick={handleAssign} 
            variant="contained" 
            size="small"
            startIcon={<CheckCircle sx={{fontSize:14}} />}
            sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.78rem", textTransform:"none", borderRadius:"8px", bgcolor:T.accent, boxShadow:"none", "&:hover":{ bgcolor:"#4F46E5", boxShadow:"none" } }}>
            Assign Role
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RBACSettingsView;