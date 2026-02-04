import React, { useState } from "react";
import { 
  Box, Card, Grid, Typography, Button, Table, TableBody, TableCell, 
  TableHead, TableRow, Chip, IconButton, Tooltip, Dialog, DialogTitle, 
  DialogContent, DialogActions, TextField, MenuItem, Tabs, Tab, Checkbox, 
  Avatar 
} from "@mui/material";
import { 
  Security, ManageAccounts, Lock, Add, Delete, Edit, 
  AdminPanelSettings, VerifiedUser 
} from "@mui/icons-material";

const RBACSettingsView = () => {
  const [tabIndex, setTabIndex] = useState(0);

  // MOCK DATA: ROLES
  const roles = [
    { id: 1, name: "Super Admin", desc: "Full access to everything", users: 2, color: "error" },
    { id: 2, name: "HR Manager", desc: "HR, Payroll, Leave, Attendance", users: 3, color: "primary" },
    { id: 3, name: "Finance Controller", desc: "Reimbursements, Salary, Budgets", users: 2, color: "success" },
    { id: 4, name: "Academic Dean", desc: "PBAS, Committees, Research", users: 1, color: "info" },
    { id: 5, name: "Legal Officer", desc: "Policies, Contracts, Grievances", users: 1, color: "warning" },
    { id: 6, name: "Logistics Manager", desc: "Assets, Rooms, Maintenance", users: 2, color: "secondary" },
    { id: 7, name: "HOD", desc: "Dept-level approvals (leave, OD)", users: 6, color: "default" },
  ];

  // MOCK DATA: USER ASSIGNMENTS
  const [assignments, setAssignments] = useState([
    { id: 101, name: "Dr. Admin User", email: "admin@college.edu", role: "Super Admin", dept: "Administration" },
    { id: 102, name: "Mr. HR Head", email: "hr@college.edu", role: "HR Manager", dept: "HR Office" },
    { id: 103, name: "Ms. Fin Officer", email: "finance@college.edu", role: "Finance Controller", dept: "Accounts" },
    { id: 104, name: "Dr. Sarah Smith", email: "sarah.cse@college.edu", role: "HOD", dept: "CSE" },
  ]);

  // MOCK DATA: PERMISSION MATRIX (Simplified)
  const modules = ["HR & Payroll", "Finance", "Research (PBAS)", "Logistics", "Legal", "Settings"];
  const matrix = {
    "Super Admin": ["RW", "RW", "RW", "RW", "RW", "RW"],
    "HR Manager": ["RW", "R", "R", "-", "-", "-"],
    "Finance Controller": ["R", "RW", "-", "R", "-", "-"],
    "Academic Dean": ["-", "-", "RW", "-", "-", "-"],
  };

  const [openDialog, setOpenDialog] = useState(false);
  const [newUser, setNewUser] = useState({ name: "", role: "HR Manager" });

  const handleTabChange = (event, newValue) => setTabIndex(newValue);

  const handleAssign = () => {
    const newAssignment = {
      id: Date.now(),
      name: newUser.name, // Mock
      email: `${newUser.name.toLowerCase().replace(" ", ".")}@college.edu`,
      role: newUser.role,
      dept: "Assigned Dept"
    };
    setAssignments([...assignments, newAssignment]);
    setOpenDialog(false);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
        Role-Based Access Control (RBAC)
      </Typography>

      <Card sx={{ minHeight: 500 }}>
        <Tabs 
          value={tabIndex} 
          onChange={handleTabChange} 
          sx={{ borderBottom: 1, borderColor: 'divider', px: 2, bgcolor: 'background.paper' }}
        >
          <Tab icon={<ManageAccounts />} iconPosition="start" label="User Assignments" />
          <Tab icon={<Security />} iconPosition="start" label="Permission Matrix" />
          <Tab icon={<AdminPanelSettings />} iconPosition="start" label="Role Definitions" />
        </Tabs>

        <Box sx={{ p: 3 }}>
          {/* =================================================================
              TAB 1: USER ASSIGNMENTS
          ================================================================= */}
          {tabIndex === 0 && (
            <Box>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h6">Admin Users</Typography>
                <Button variant="contained" startIcon={<Add />} onClick={() => setOpenDialog(true)}>
                  Assign New Admin
                </Button>
              </Box>

              <Table>
                <TableHead sx={{ bgcolor: 'grey.100' }}>
                  <TableRow>
                    <TableCell>User</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Assigned Role</TableCell>
                    <TableCell>Department</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {assignments.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell fontWeight="bold">
                        <Box display="flex" alignItems="center" gap={1}>
                          <Avatar sx={{ width: 24, height: 24 }} /> {row.name}
                        </Box>
                      </TableCell>
                      <TableCell>{row.email}</TableCell>
                      <TableCell>
                        <Chip 
                          label={row.role} size="small" 
                          color={roles.find(r => r.name === row.role)?.color || "default"} 
                        />
                      </TableCell>
                      <TableCell>{row.dept}</TableCell>
                      <TableCell align="right">
                        <Tooltip title="Edit Role">
                          <IconButton size="small"><Edit /></IconButton>
                        </Tooltip>
                        <Tooltip title="Revoke Access">
                          <IconButton size="small" color="error"><Delete /></IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          )}

          {/* =================================================================
              TAB 2: PERMISSION MATRIX
          ================================================================= */}
          {tabIndex === 1 && (
            <Box>
              <Typography variant="h6" gutterBottom>Access Rights Overview</Typography>
              <Box overflow="auto">
                <Table sx={{ minWidth: 600 }}>
                  <TableHead sx={{ bgcolor: 'grey.50' }}>
                    <TableRow>
                      <TableCell>Role / Module</TableCell>
                      {modules.map(m => <TableCell key={m} align="center">{m}</TableCell>)}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {Object.entries(matrix).map(([role, perms]) => (
                      <TableRow key={role}>
                        <TableCell fontWeight="bold" sx={{ borderRight: '1px solid #eee' }}>{role}</TableCell>
                        {perms.map((p, i) => (
                          <TableCell key={i} align="center">
                            {p === "RW" && <Chip label="Read/Write" color="success" size="small" />}
                            {p === "R" && <Chip label="Read Only" color="info" size="small" variant="outlined" />}
                            {p === "-" && <Chip label="No Access" color="default" size="small" variant="outlined" sx={{ opacity: 0.5 }} />}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
              <Box mt={2} display="flex" gap={2}>
                 <Typography variant="caption" display="flex" alignItems="center" gap={0.5}><Lock fontSize="small" /> System Locked</Typography>
                 <Typography variant="caption" color="textSecondary">Permissions are hardcoded in v1.0. Custom roles coming soon.</Typography>
              </Box>
            </Box>
          )}

          {/* =================================================================
              TAB 3: ROLE DEFINITIONS
          ================================================================= */}
          {tabIndex === 2 && (
            <Grid container spacing={3}>
              {roles.map((role) => (
                <Grid item xs={12} md={4} key={role.id}>
                  <Card variant="outlined" sx={{ p: 2, height: '100%', borderTop: 4, borderColor: `${role.color}.main` }}>
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                      <Typography variant="subtitle1" fontWeight="bold">{role.name}</Typography>
                      <VerifiedUser color={role.color} />
                    </Box>
                    <Typography variant="body2" color="textSecondary" sx={{ mb: 2, minHeight: 40 }}>
                      {role.desc}
                    </Typography>
                    <Chip label={`${role.users} Active Users`} size="small" />
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      </Card>

      {/* ASSIGN DIALOG */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Assign Admin Role</DialogTitle>
        <DialogContent dividers>
          <TextField 
            fullWidth label="Search Faculty / Staff Name" margin="dense"
            value={newUser.name} onChange={(e) => setNewUser({...newUser, name: e.target.value})}
          />
          <TextField 
            select fullWidth label="Select Role" margin="dense"
            value={newUser.role} onChange={(e) => setNewUser({...newUser, role: e.target.value})}
          >
            {roles.map(r => <MenuItem key={r.id} value={r.name}>{r.name}</MenuItem>)}
          </TextField>
          <Box mt={2} p={1} bgcolor="warning.light" borderRadius={1} display="flex" gap={1} alignItems="center">
            <Lock fontSize="small" color="warning" />
            <Typography variant="caption" fontWeight="bold">This grants high-level system access.</Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleAssign} variant="contained" color="primary">Assign</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RBACSettingsView;