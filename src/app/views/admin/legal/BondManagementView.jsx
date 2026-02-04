import React, { useState, useEffect } from "react";
import { 
  Box, Card, Grid, Typography, Button, TextField, MenuItem, 
  Tabs, Tab, Table, TableBody, TableCell, TableHead, TableRow, 
  Chip, IconButton, Tooltip, Dialog, DialogTitle, DialogContent, 
  DialogActions, InputAdornment, LinearProgress 
} from "@mui/material";
import { 
  Gavel, Description, CloudUpload, Add, CheckCircle, 
  Cancel, Warning, Timer, Print 
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";

const HiddenInput = styled('input')({ display: 'none' });

const BondManagementView = () => {
  const [tabIndex, setTabIndex] = useState(0);
  
  // FORM STATE
  const [bondForm, setBondForm] = useState({
    facultyId: "", type: "Ph.D. Sponsorship", value: "", 
    startDate: "", duration: 3, endDate: ""
  });
  
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedNoc, setSelectedNoc] = useState(null);

  // MOCK DATA: FACULTY
  const facultyList = [
    { id: 101, name: "Dr. Sarah Smith", dept: "CSE" },
    { id: 102, name: "Prof. Rajan Kumar", dept: "Mech" },
    { id: 103, name: "Ms. Priya Roy", dept: "Civil" },
  ];

  // MOCK DATA: ACTIVE BONDS
  const [activeBonds, setActiveBonds] = useState([
    { id: 1, faculty: "Dr. Sarah Smith", type: "Ph.D. Sponsorship", value: 500000, start: "2023-06-01", end: "2026-05-31", status: "Active" },
    { id: 2, faculty: "Prof. Rajan Kumar", type: "Study Leave", value: 200000, start: "2024-01-01", end: "2025-12-31", status: "Active" },
    { id: 3, faculty: "Ms. Priya Roy", type: "Training Bond", value: 50000, start: "2023-03-01", end: "2026-03-01", status: "Expiring Soon" }, // Expiring
  ]);

  // MOCK DATA: NOC REQUESTS
  const [nocRequests, setNocRequests] = useState([
    { id: 1, faculty: "Dr. Emily Davis", purpose: "Part-time PhD", org: "IIT Delhi", date: "2026-02-01", status: "Pending" },
    { id: 2, faculty: "Mr. John Doe", purpose: "Consultancy Project", org: "TechCorp Inc.", date: "2026-01-28", status: "Approved" },
  ]);

  const handleTabChange = (event, newValue) => setTabIndex(newValue);

  // AUTO-CALCULATE END DATE
  useEffect(() => {
    if (bondForm.startDate && bondForm.duration) {
      const start = new Date(bondForm.startDate);
      const end = new Date(start.setFullYear(start.getFullYear() + parseInt(bondForm.duration)));
      end.setDate(end.getDate() - 1); // Subtract 1 day
      setBondForm(prev => ({ ...prev, endDate: end.toISOString().split('T')[0] }));
    }
  }, [bondForm.startDate, bondForm.duration]);

  // CALCULATE REMAINING MONTHS
  const getRemainingMonths = (endDate) => {
    const end = new Date(endDate);
    const now = new Date();
    const months = (end.getFullYear() - now.getFullYear()) * 12 + (end.getMonth() - now.getMonth());
    return months > 0 ? months : 0;
  };

  // ACTIONS
  const handleCreateBond = () => {
    const facultyName = facultyList.find(f => f.id === bondForm.facultyId)?.name;
    const newBond = {
      id: Date.now(),
      faculty: facultyName,
      type: bondForm.type,
      value: bondForm.value,
      start: bondForm.startDate,
      end: bondForm.endDate,
      status: "Active"
    };
    setActiveBonds([...activeBonds, newBond]);
    // Reset Form
    setBondForm({ facultyId: "", type: "Ph.D. Sponsorship", value: "", startDate: "", duration: 3, endDate: "" });
  };

  const handleNocAction = (id, status) => {
    setNocRequests(nocRequests.map(req => req.id === id ? { ...req, status } : req));
    setOpenDialog(false);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
        Contracts & Bonds Administration
      </Typography>

      <Card sx={{ minHeight: 500 }}>
        <Tabs 
          value={tabIndex} 
          onChange={handleTabChange} 
          sx={{ borderBottom: 1, borderColor: 'divider', px: 2, bgcolor: 'background.paper' }}
        >
          <Tab icon={<Gavel />} iconPosition="start" label="Service Bonds Management" />
          <Tab icon={<Description />} iconPosition="start" label="NOC & Clearance" />
        </Tabs>

        <Box sx={{ p: 3 }}>
          {/* =================================================================
              TAB 1: BOND MANAGEMENT
          ================================================================= */}
          {tabIndex === 0 && (
            <Grid container spacing={3}>
              {/* LEFT: CREATE BOND */}
              <Grid item xs={12} md={4}>
                <Card variant="outlined" sx={{ p: 3, height: '100%' }}>
                  <Typography variant="h6" gutterBottom color="primary">Create Service Bond</Typography>
                  
                  <TextField 
                    select fullWidth label="Select Faculty" size="small" sx={{ mb: 2 }}
                    value={bondForm.facultyId} 
                    onChange={(e) => setBondForm({...bondForm, facultyId: e.target.value})}
                  >
                    {facultyList.map(f => <MenuItem key={f.id} value={f.id}>{f.name} ({f.dept})</MenuItem>)}
                  </TextField>

                  <TextField 
                    select fullWidth label="Bond Type" size="small" sx={{ mb: 2 }}
                    value={bondForm.type} 
                    onChange={(e) => setBondForm({...bondForm, type: e.target.value})}
                  >
                    <MenuItem value="Ph.D. Sponsorship">Ph.D. Sponsorship</MenuItem>
                    <MenuItem value="Training Bond">Training Bond</MenuItem>
                    <MenuItem value="Study Leave">Study Leave</MenuItem>
                  </TextField>

                  <Grid container spacing={2} mb={2}>
                    <Grid item xs={6}>
                      <TextField 
                        fullWidth label="Value (₹)" type="number" size="small"
                        value={bondForm.value} 
                        onChange={(e) => setBondForm({...bondForm, value: e.target.value})}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField 
                        fullWidth label="Duration (Yrs)" type="number" size="small"
                        value={bondForm.duration} 
                        onChange={(e) => setBondForm({...bondForm, duration: e.target.value})}
                      />
                    </Grid>
                  </Grid>

                  <Grid container spacing={2} mb={2}>
                    <Grid item xs={6}>
                      <TextField 
                        fullWidth label="Start Date" type="date" size="small" InputLabelProps={{ shrink: true }}
                        value={bondForm.startDate} 
                        onChange={(e) => setBondForm({...bondForm, startDate: e.target.value})}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField 
                        fullWidth label="End Date" size="small" disabled
                        value={bondForm.endDate} 
                      />
                    </Grid>
                  </Grid>

                  <Button component="label" variant="outlined" fullWidth sx={{ mb: 2 }} startIcon={<CloudUpload />}>
                    Upload Signed Bond (PDF)
                    <HiddenInput type="file" accept="application/pdf" />
                  </Button>

                  <Button variant="contained" fullWidth startIcon={<Add />} onClick={handleCreateBond}>
                    Register Bond
                  </Button>
                </Card>
              </Grid>

              {/* RIGHT: BOND TRACKER */}
              <Grid item xs={12} md={8}>
                <Typography variant="h6" gutterBottom>Active Bond Tracker</Typography>
                <Table size="small">
                  <TableHead sx={{ bgcolor: 'grey.50' }}>
                    <TableRow>
                      <TableCell>Faculty</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Bond Value</TableCell>
                      <TableCell>Timeline</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {activeBonds.map((row) => {
                      const remaining = getRemainingMonths(row.end);
                      const isExpiring = remaining <= 3;
                      return (
                        <TableRow key={row.id}>
                          <TableCell fontWeight="bold">{row.faculty}</TableCell>
                          <TableCell>{row.type}</TableCell>
                          <TableCell>₹{row.value.toLocaleString()}</TableCell>
                          <TableCell>
                            <Typography variant="caption" display="block">Ends: {row.end}</Typography>
                            <Box display="flex" alignItems="center" gap={1}>
                              <Timer fontSize="inherit" color={isExpiring ? "error" : "action"} />
                              <Typography variant="caption" color={isExpiring ? "error" : "textSecondary"}>
                                {remaining} Months left
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={isExpiring ? "Expiring Soon" : "Active"} 
                              color={isExpiring ? "error" : "success"} 
                              size="small" 
                            />
                          </TableCell>
                          <TableCell>
                            {isExpiring && (
                              <Button size="small" variant="outlined" color="warning">
                                Release Request
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </Grid>
            </Grid>
          )}

          {/* =================================================================
              TAB 2: NOC & CLEARANCE
          ================================================================= */}
          {tabIndex === 1 && (
            <Box>
              <Typography variant="h6" gutterBottom>NOC Requests Queue</Typography>
              <Table>
                <TableHead sx={{ bgcolor: 'grey.100' }}>
                  <TableRow>
                    <TableCell>Faculty</TableCell>
                    <TableCell>Purpose</TableCell>
                    <TableCell>Organization</TableCell>
                    <TableCell>Date Requested</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {nocRequests.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell fontWeight="bold">{row.faculty}</TableCell>
                      <TableCell>{row.purpose}</TableCell>
                      <TableCell>{row.org}</TableCell>
                      <TableCell>{row.date}</TableCell>
                      <TableCell>
                        <Chip 
                          label={row.status} size="small" 
                          color={row.status === 'Approved' ? 'success' : 'warning'} 
                        />
                      </TableCell>
                      <TableCell align="right">
                        {row.status === 'Pending' ? (
                          <Button 
                            variant="contained" size="small" 
                            onClick={() => { setSelectedNoc(row); setOpenDialog(true); }}
                          >
                            Review
                          </Button>
                        ) : (
                          <Button variant="outlined" size="small" startIcon={<Print />}>
                            Print Letter
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          )}
        </Box>
      </Card>

      {/* NOC APPROVAL DIALOG */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Review NOC Request</DialogTitle>
        <DialogContent dividers>
          <Box mb={2}>
            <Typography variant="subtitle2">Applicant: {selectedNoc?.faculty}</Typography>
            <Typography variant="body2" color="textSecondary">Purpose: {selectedNoc?.purpose} at {selectedNoc?.org}</Typography>
          </Box>
          <TextField 
            fullWidth label="Admin Remarks / Conditions" multiline rows={3}
            placeholder="e.g. Approved subject to zero impact on teaching hours."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleNocAction(selectedNoc.id, "Rejected")} color="error">Reject</Button>
          <Button onClick={() => handleNocAction(selectedNoc.id, "Approved")} variant="contained" color="success" startIcon={<CheckCircle />}>
            Approve & Generate Letter
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BondManagementView;