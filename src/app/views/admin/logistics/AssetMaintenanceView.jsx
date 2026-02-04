import React, { useState } from "react";
import { 
  Box, Card, Grid, Typography, Button, Table, TableBody, TableCell, 
  TableHead, TableRow, Chip, IconButton, Tooltip, Dialog, DialogTitle, 
  DialogContent, DialogActions, TextField, LinearProgress, MenuItem 
} from "@mui/material";
import { 
  VerifiedUser, Build, NotificationsActive, ReportProblem, 
  AssignmentInd, CheckCircle, History 
} from "@mui/icons-material";

const AssetMaintenanceView = () => {
  const [tabIndex, setTabIndex] = useState(0);

  // MOCK DATA: VERIFICATION
  const [verificationStats, setVerificationStats] = useState({
    total: 1500, verified: 850, missing: 15, deadline: "2026-03-31", status: "In Progress"
  });

  const [missingAssets, setMissingAssets] = useState([
    { id: "AST-005", name: "Epson Projector", location: "Seminar Hall", lastSeen: "2025-12-10" },
    { id: "AST-022", name: "Lab Microscope", location: "Bio Lab 1", lastSeen: "2025-11-05" },
  ]);

  // MOCK DATA: MAINTENANCE TICKETS
  const [tickets, setTickets] = useState([
    { id: "TKT-501", asset: "AST-001 (Laptop)", issue: "Screen Flicker", reportedBy: "Dr. Sarah Smith", date: "2026-02-01", status: "Open", tech: "Unassigned" },
    { id: "TKT-502", asset: "AST-010 (AC Unit)", issue: "Not Cooling", reportedBy: "Admin Office", date: "2026-01-28", status: "In Progress", tech: "Vendor: CoolTech" },
    { id: "TKT-503", asset: "AST-055 (Printer)", issue: "Paper Jam", reportedBy: "Exam Cell", date: "2026-02-03", status: "Resolved", tech: "Mr. Ram (Internal)" },
  ]);

  // MOCK DATA: AMC TRACKER
  const [amcList, setAmcList] = useState([
    { id: 1, vendor: "Dell India", assets: "Laptops (50 Units)", expiry: "2026-03-15", status: "Expiring Soon" },
    { id: 2, vendor: "Voltas", assets: "ACs (All Blocks)", expiry: "2026-06-30", status: "Active" },
  ]);

  // DIALOG STATES
  const [openVerifyDialog, setOpenVerifyDialog] = useState(false);
  const [newDeadline, setNewDeadline] = useState("");
  
  const [openAssignDialog, setOpenAssignDialog] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [technician, setTechnician] = useState("");

  // ACTIONS
  const handleInitiateVerification = () => {
    setVerificationStats({ ...verificationStats, status: "In Progress", deadline: newDeadline, verified: 0 });
    setOpenVerifyDialog(false);
  };

  const handleAssignTech = () => {
    setTickets(tickets.map(t => t.id === selectedTicket.id ? { ...t, status: "In Progress", tech: technician } : t));
    setOpenAssignDialog(false);
  };

  const handleCloseTicket = (id) => {
    setTickets(tickets.map(t => t.id === id ? { ...t, status: "Resolved" } : t));
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
        Maintenance & Verification
      </Typography>

      <Card sx={{ minHeight: 500 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 2, bgcolor: 'background.paper' }}>
          <Button 
            startIcon={<VerifiedUser />} 
            sx={{ px: 3, py: 1.5, borderBottom: tabIndex === 0 ? 2 : 0, borderRadius: 0 }}
            color={tabIndex === 0 ? "primary" : "inherit"}
            onClick={() => setTabIndex(0)}
          >
            Annual Verification Drive
          </Button>
          <Button 
            startIcon={<Build />} 
            sx={{ px: 3, py: 1.5, borderBottom: tabIndex === 1 ? 2 : 0, borderRadius: 0 }}
            color={tabIndex === 1 ? "primary" : "inherit"}
            onClick={() => setTabIndex(1)}
          >
            Maintenance & AMC
          </Button>
        </Box>

        <Box sx={{ p: 3 }}>
          {/* =================================================================
              TAB 1: ANNUAL VERIFICATION
          ================================================================= */}
          {tabIndex === 0 && (
            <Box>
              <Grid container spacing={3} mb={4}>
                <Grid item xs={12} md={8}>
                  <Card variant="outlined" sx={{ p: 3 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                      <Typography variant="h6">Verification Progress (FY 2025-26)</Typography>
                      {verificationStats.status === "In Progress" ? (
                        <Chip label={`Deadline: ${verificationStats.deadline}`} color="primary" variant="outlined" />
                      ) : (
                        <Button variant="contained" size="small" onClick={() => setOpenVerifyDialog(true)}>
                          Initiate New Drive
                        </Button>
                      )}
                    </Box>
                    
                    <LinearProgress 
                      variant="determinate" 
                      value={(verificationStats.verified / verificationStats.total) * 100} 
                      sx={{ height: 10, borderRadius: 5, mb: 1 }}
                    />
                    <Box display="flex" justifyContent="space-between">
                      <Typography variant="body2">{verificationStats.verified} Verified</Typography>
                      <Typography variant="body2">{verificationStats.total} Total Assets</Typography>
                    </Box>

                    <Box mt={3} display="flex" gap={2}>
                      <Button variant="outlined" startIcon={<NotificationsActive />} color="warning">
                        Send Reminders to Non-Responders
                      </Button>
                      <Button variant="outlined" startIcon={<ReportProblem />} color="error">
                        Download Missing Assets Report
                      </Button>
                    </Box>
                  </Card>
                </Grid>

                <Grid item xs={12} md={4}>
                  <Card sx={{ p: 3, bgcolor: 'error.50', height: '100%' }}>
                    <Typography variant="h6" color="error" gutterBottom>Missing / Unaccounted</Typography>
                    <Typography variant="h3" fontWeight="bold" color="error">{verificationStats.missing}</Typography>
                    <Typography variant="body2">Assets not found during drive</Typography>
                  </Card>
                </Grid>
              </Grid>

              <Typography variant="h6" gutterBottom>Missing Assets List</Typography>
              <Table size="small">
                <TableHead sx={{ bgcolor: 'grey.100' }}>
                  <TableRow>
                    <TableCell>Asset ID</TableCell>
                    <TableCell>Asset Name</TableCell>
                    <TableCell>Last Known Location</TableCell>
                    <TableCell>Last Verified Date</TableCell>
                    <TableCell align="right">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {missingAssets.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell fontWeight="bold">{row.id}</TableCell>
                      <TableCell>{row.name}</TableCell>
                      <TableCell>{row.location}</TableCell>
                      <TableCell>{row.lastSeen}</TableCell>
                      <TableCell align="right">
                        <Button size="small" color="error">Mark Lost</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          )}

          {/* =================================================================
              TAB 2: MAINTENANCE & AMC
          ================================================================= */}
          {tabIndex === 1 && (
            <Grid container spacing={3}>
              {/* LEFT: TICKETS */}
              <Grid item xs={12} md={8}>
                <Typography variant="h6" gutterBottom>Maintenance Tickets</Typography>
                <Table>
                  <TableHead sx={{ bgcolor: 'grey.100' }}>
                    <TableRow>
                      <TableCell>Ticket ID</TableCell>
                      <TableCell>Asset & Issue</TableCell>
                      <TableCell>Assigned To</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell align="right">Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {tickets.map((row) => (
                      <TableRow key={row.id}>
                        <TableCell fontWeight="bold">{row.id}</TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight="bold">{row.asset}</Typography>
                          <Typography variant="caption" color="error">{row.issue}</Typography>
                        </TableCell>
                        <TableCell>{row.tech}</TableCell>
                        <TableCell>
                          <Chip 
                            label={row.status} size="small" 
                            color={row.status === 'Resolved' ? 'success' : row.status === 'Open' ? 'error' : 'warning'} 
                          />
                        </TableCell>
                        <TableCell align="right">
                          {row.status === 'Open' && (
                            <Tooltip title="Assign Technician">
                              <IconButton color="primary" onClick={() => { setSelectedTicket(row); setOpenAssignDialog(true); }}>
                                <AssignmentInd />
                              </IconButton>
                            </Tooltip>
                          )}
                          {row.status === 'In Progress' && (
                            <Tooltip title="Close Ticket">
                              <IconButton color="success" onClick={() => handleCloseTicket(row.id)}>
                                <CheckCircle />
                              </IconButton>
                            </Tooltip>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Grid>

              {/* RIGHT: AMC TRACKER */}
              <Grid item xs={12} md={4}>
                <Typography variant="h6" gutterBottom>AMC Contracts</Typography>
                {amcList.map((amc) => (
                  <Card key={amc.id} variant="outlined" sx={{ p: 2, mb: 2, borderLeft: 4, borderColor: amc.status === 'Expiring Soon' ? 'warning.main' : 'success.main' }}>
                    <Box display="flex" justifyContent="space-between" mb={1}>
                      <Typography variant="subtitle2" fontWeight="bold">{amc.vendor}</Typography>
                      <Chip label={amc.status} size="small" color={amc.status === 'Expiring Soon' ? 'warning' : 'success'} />
                    </Box>
                    <Typography variant="body2" color="textSecondary">{amc.assets}</Typography>
                    <Box display="flex" alignItems="center" gap={1} mt={1}>
                      <History fontSize="small" color="action" />
                      <Typography variant="caption">Expires: {amc.expiry}</Typography>
                    </Box>
                    {amc.status === 'Expiring Soon' && (
                      <Button size="small" fullWidth variant="outlined" color="primary" sx={{ mt: 1 }}>
                        Renew Contract
                      </Button>
                    )}
                  </Card>
                ))}
              </Grid>
            </Grid>
          )}
        </Box>
      </Card>

      {/* VERIFICATION DIALOG */}
      <Dialog open={openVerifyDialog} onClose={() => setOpenVerifyDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Initiate Annual Verification</DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2" mb={2}>
            This will trigger a system-wide verification request. All faculty/departments must scan assigned assets.
          </Typography>
          <TextField 
            fullWidth type="date" label="Set Completion Deadline" InputLabelProps={{ shrink: true }}
            value={newDeadline} onChange={(e) => setNewDeadline(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenVerifyDialog(false)}>Cancel</Button>
          <Button onClick={handleInitiateVerification} variant="contained" color="primary">Start Drive</Button>
        </DialogActions>
      </Dialog>

      {/* ASSIGN TECH DIALOG */}
      <Dialog open={openAssignDialog} onClose={() => setOpenAssignDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Assign Technician</DialogTitle>
        <DialogContent dividers>
          <Typography variant="subtitle2" gutterBottom>Ticket: {selectedTicket?.id} ({selectedTicket?.issue})</Typography>
          <TextField 
            select fullWidth label="Select Technician / Vendor" margin="dense"
            value={technician} onChange={(e) => setTechnician(e.target.value)}
          >
            <MenuItem value="Mr. Ram (Internal IT)">Mr. Ram (Internal IT)</MenuItem>
            <MenuItem value="Mr. Shyam (Electrician)">Mr. Shyam (Electrician)</MenuItem>
            <MenuItem value="Vendor: CoolTech Services">Vendor: CoolTech Services</MenuItem>
            <MenuItem value="Vendor: Dell Support">Vendor: Dell Support</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAssignDialog(false)}>Cancel</Button>
          <Button onClick={handleAssignTech} variant="contained" color="primary">Assign</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AssetMaintenanceView;