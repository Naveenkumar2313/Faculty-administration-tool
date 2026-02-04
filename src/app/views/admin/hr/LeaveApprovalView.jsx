import React, { useState } from "react";
import { 
  Box, Card, Grid, Typography, Button, TextField, MenuItem, 
  Tabs, Tab, Table, TableBody, TableCell, TableHead, TableRow, 
  Chip, IconButton, Tooltip, Avatar, Badge 
} from "@mui/material";
import { 
  CheckCircle, Cancel, HelpOutline, DateRange, 
  Edit, EventBusy, History 
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";

const LeaveApprovalView = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [deptFilter, setDeptFilter] = useState("All");

  const handleTabChange = (event, newValue) => setTabIndex(newValue);

  // MOCK DATA
  const requests = [
    { id: 1, faculty: "Dr. Sarah Smith", type: "CL", from: "2026-02-10", to: "2026-02-11", days: 2, reason: "Personal Work", substitute: "Dr. A. Verma", status: "Pending", dept: "CSE" },
    { id: 2, faculty: "Prof. Rajan Kumar", type: "EL", from: "2026-02-12", to: "2026-02-20", days: 8, reason: "Family Trip", substitute: "Prof. K. Singh", status: "Pending", dept: "Mech" },
    { id: 3, faculty: "Ms. Priya Roy", type: "CL", from: "2026-02-10", to: "2026-02-10", days: 1, reason: "Sick Leave", substitute: "None", status: "Pending", dept: "CSE" }, // Conflict with Sarah (Same Dept, Same Day)
    { id: 4, faculty: "Dr. Emily Davis", type: "CL", from: "2026-02-10", to: "2026-02-10", days: 1, reason: "Emergency", substitute: "None", status: "Pending", dept: "CSE" }, // Conflict trigger (>2)
  ];

  const balances = [
    { id: 1, name: "Dr. Sarah Smith", cl: 8, el: 12, ml: 10 },
    { id: 2, name: "Prof. Rajan Kumar", cl: 2, el: 28, ml: 15 },
  ];

  // CALENDAR MOCK (Simple Grid for Demo)
  const calendarDays = [
    { date: "10 Feb", leaves: 3, depts: ["CSE", "CSE", "CSE"], status: "Critical" },
    { date: "11 Feb", leaves: 1, depts: ["CSE"], status: "Normal" },
    { date: "12 Feb", leaves: 1, depts: ["Mech"], status: "Normal" },
    { date: "13 Feb", leaves: 0, depts: [], status: "Normal" },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
        Leave Approval & Management
      </Typography>

      <Card sx={{ minHeight: 500 }}>
        <Tabs 
          value={tabIndex} 
          onChange={handleTabChange} 
          sx={{ borderBottom: 1, borderColor: 'divider', px: 2, bgcolor: 'background.paper' }}
        >
          <Tab label="Pending Requests" />
          <Tab label="Department Calendar" />
          <Tab label="Balance Adjustment" />
        </Tabs>

        <Box sx={{ p: 3 }}>
          {/* =================================================================
              TAB 1: PENDING REQUESTS DASHBOARD
          ================================================================= */}
          {tabIndex === 0 && (
            <Box>
              <Box display="flex" gap={2} mb={3}>
                <TextField 
                  select size="small" label="Department" sx={{ width: 200 }}
                  value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)}
                >
                  <MenuItem value="All">All Departments</MenuItem>
                  <MenuItem value="CSE">Computer Science</MenuItem>
                  <MenuItem value="Mech">Mechanical</MenuItem>
                </TextField>
                <TextField select size="small" label="Leave Type" sx={{ width: 150 }} defaultValue="All">
                  <MenuItem value="All">All Types</MenuItem>
                  <MenuItem value="CL">CL</MenuItem>
                  <MenuItem value="EL">EL</MenuItem>
                </TextField>
              </Box>

              <Table>
                <TableHead sx={{ bgcolor: 'grey.100' }}>
                  <TableRow>
                    <TableCell>Faculty</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Duration</TableCell>
                    <TableCell>Reason</TableCell>
                    <TableCell>Substitute</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {requests.filter(r => deptFilter === "All" || r.dept === deptFilter).map((row) => (
                    <TableRow key={row.id}>
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={1}>
                          <Avatar sx={{ width: 30, height: 30, bgcolor: 'primary.main' }}>{row.faculty[0]}</Avatar>
                          <Box>
                            <Typography variant="subtitle2">{row.faculty}</Typography>
                            <Typography variant="caption" color="text.secondary">{row.dept}</Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell><Chip label={row.type} size="small" color="primary" variant="outlined" /></TableCell>
                      <TableCell>
                        <Typography variant="body2">{row.from} to {row.to}</Typography>
                        <Typography variant="caption" fontWeight="bold">({row.days} Days)</Typography>
                      </TableCell>
                      <TableCell>{row.reason}</TableCell>
                      <TableCell>{row.substitute}</TableCell>
                      <TableCell align="center">
                        <Tooltip title="Approve">
                          <IconButton color="success"><CheckCircle /></IconButton>
                        </Tooltip>
                        <Tooltip title="Reject">
                          <IconButton color="error"><Cancel /></IconButton>
                        </Tooltip>
                        <Tooltip title="Request Clarification">
                          <IconButton color="warning"><HelpOutline /></IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          )}

          {/* =================================================================
              TAB 2: DEPARTMENTAL LEAVE CALENDAR
          ================================================================= */}
          {tabIndex === 1 && (
            <Box>
              <Box display="flex" alignItems="center" gap={2} mb={3}>
                <Typography variant="h6">Leave Conflict Monitor (Feb 2026)</Typography>
                <Chip icon={<EventBusy />} label="Conflict Rule: >2 Faculty from same Dept" color="error" variant="outlined" />
              </Box>

              <Grid container spacing={2}>
                {calendarDays.map((day, index) => (
                  <Grid item xs={12} sm={6} md={3} key={index}>
                    <Card sx={{ 
                      p: 2, border: 1, 
                      borderColor: day.status === 'Critical' ? 'error.main' : 'grey.300',
                      bgcolor: day.status === 'Critical' ? 'error.light' : 'background.paper'
                    }}>
                      <Box display="flex" justifyContent="space-between" mb={1}>
                        <Typography fontWeight="bold">{day.date}</Typography>
                        <Chip label={`${day.leaves} Leaves`} size="small" color={day.status === 'Critical' ? "error" : "default"} />
                      </Box>
                      <Typography variant="body2" color="text.secondary">Departments Affected:</Typography>
                      <Box mt={1}>
                        {day.depts.map((d, i) => (
                          <Chip key={i} label={d} size="small" sx={{ mr: 0.5, mb: 0.5, fontSize: '0.7rem' }} />
                        ))}
                      </Box>
                      {day.status === 'Critical' && (
                        <Button size="small" color="error" variant="contained" fullWidth sx={{ mt: 2 }}>
                          Override Conflict
                        </Button>
                      )}
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}

          {/* =================================================================
              TAB 3: LEAVE BALANCE ADJUSTMENT
          ================================================================= */}
          {tabIndex === 2 && (
            <Box>
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Card variant="outlined" sx={{ p: 2, bgcolor: 'primary.50' }}>
                    <Typography variant="subtitle1" fontWeight="bold" mb={2}>Manual Adjustment</Typography>
                    <TextField select fullWidth label="Select Faculty" size="small" sx={{ mb: 2, bgcolor: 'white' }}>
                      {balances.map(b => <MenuItem key={b.id} value={b.id}>{b.name}</MenuItem>)}
                    </TextField>
                    <TextField select fullWidth label="Leave Type" size="small" sx={{ mb: 2, bgcolor: 'white' }}>
                      <MenuItem value="CL">Casual Leave (CL)</MenuItem>
                      <MenuItem value="EL">Earned Leave (EL)</MenuItem>
                      <MenuItem value="CO">Compensatory Off</MenuItem>
                    </TextField>
                    <TextField type="number" fullWidth label="Credit / Debit (+/- Days)" size="small" sx={{ mb: 2, bgcolor: 'white' }} />
                    <TextField fullWidth label="Remarks (e.g., Election Duty)" size="small" sx={{ mb: 2, bgcolor: 'white' }} />
                    <Button variant="contained" fullWidth startIcon={<Edit />}>Update Balance</Button>
                  </Card>
                </Grid>

                <Grid item xs={12} md={8}>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="h6">Current Balances & Rules</Typography>
                    <Button startIcon={<History />} color="secondary">Annual Reset Rules</Button>
                  </Box>
                  <Table size="small">
                    <TableHead sx={{ bgcolor: 'grey.100' }}>
                      <TableRow>
                        <TableCell>Faculty</TableCell>
                        <TableCell>CL (Max 12)</TableCell>
                        <TableCell>EL (Max 30 Carry)</TableCell>
                        <TableCell>Medical</TableCell>
                        <TableCell>Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {balances.map((row) => (
                        <TableRow key={row.id}>
                          <TableCell fontWeight="bold">{row.name}</TableCell>
                          <TableCell>{row.cl}</TableCell>
                          <TableCell>
                            {row.el} 
                            {row.el > 30 && <Chip label="Cap Exceeded" size="small" color="warning" sx={{ ml: 1, fontSize: '0.6rem' }} />}
                          </TableCell>
                          <TableCell>{row.ml}</TableCell>
                          <TableCell>
                            <Button size="small" variant="text">View Log</Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <Box mt={2} p={2} bgcolor="warning.light" borderRadius={1}>
                    <Typography variant="caption" fontWeight="bold">
                      Note: CL lapses at year-end. EL carries forward up to 30 days.
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          )}
        </Box>
      </Card>
    </Box>
  );
};

export default LeaveApprovalView;