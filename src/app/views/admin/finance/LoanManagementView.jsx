import React, { useState } from "react";
import { 
  Box, Card, Grid, Typography, Button, Table, TableBody, TableCell, 
  TableHead, TableRow, Chip, IconButton, Tooltip, Dialog, DialogTitle, 
  DialogContent, DialogActions, TextField, LinearProgress, InputAdornment 
} from "@mui/material";
import { 
  CheckCircle, Cancel, Visibility, AccountBalance, 
  Description, ReceiptLong, Calculate 
} from "@mui/icons-material";

const LoanManagementView = () => {
  const [tabIndex, setTabIndex] = useState(0); // 0: Applications, 1: Active Loans
  
  // MOCK DATA: APPLICATIONS
  const [applications, setApplications] = useState([
    { id: 1, faculty: "Dr. Sarah Smith", type: "Computer Advance", amount: 60000, purpose: "New Laptop", date: "2026-02-01", status: "Pending" },
    { id: 2, faculty: "Mr. John Doe", type: "Personal Loan", amount: 200000, purpose: "Medical Emergency", date: "2026-01-28", status: "Pending" },
  ]);

  // MOCK DATA: ACTIVE LOANS
  const [activeLoans, setActiveLoans] = useState([
    { id: 101, faculty: "Prof. Rajan Kumar", type: "Housing Loan", principal: 1500000, paid: 450000, tenure: 120, emi: 18500, nextDate: "2026-03-01" },
    { id: 102, faculty: "Dr. Emily Davis", type: "Computer Advance", principal: 50000, paid: 45000, tenure: 12, emi: 4500, nextDate: "2026-03-01" },
  ]);

  // APPROVAL DIALOG STATE
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);
  const [sanctionDetails, setSanctionDetails] = useState({ interest: 8.5, tenure: 24, emi: 0 });

  // CALCULATE EMI
  const calculateEMI = () => {
    const P = selectedApp?.amount || 0;
    const R = sanctionDetails.interest / 12 / 100; // Monthly Rate
    const N = sanctionDetails.tenure; // Months
    
    if (P > 0 && R > 0 && N > 0) {
      const emi = (P * R * Math.pow(1 + R, N)) / (Math.pow(1 + R, N) - 1);
      setSanctionDetails({ ...sanctionDetails, emi: Math.round(emi) });
    } else {
      setSanctionDetails({ ...sanctionDetails, emi: Math.round(P / N) }); // Simple division if 0 interest
    }
  };

  // ACTIONS
  const handleOpenApprove = (app) => {
    setSelectedApp(app);
    setSanctionDetails({ interest: 8.5, tenure: 24, emi: 0 }); // Reset defaults
    setOpenDialog(true);
  };

  const handleConfirmSanction = () => {
    // 1. Remove from applications
    setApplications(applications.filter(a => a.id !== selectedApp.id));
    // 2. Add to Active Loans (Mock logic)
    const newLoan = {
      id: Date.now(),
      faculty: selectedApp.faculty,
      type: selectedApp.type,
      principal: selectedApp.amount,
      paid: 0,
      tenure: sanctionDetails.tenure,
      emi: sanctionDetails.emi,
      nextDate: "2026-03-01"
    };
    setActiveLoans([...activeLoans, newLoan]);
    setOpenDialog(false);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
        Loan & Advance Management
      </Typography>

      <Grid container spacing={3}>
        {/* TOP STATS */}
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 3, bgcolor: 'primary.light', color: 'primary.main', mb: 3 }}>
            <Typography variant="h6">Total Disbursed</Typography>
            <Typography variant="h3" fontWeight="bold">₹18.5L</Typography>
            <Typography variant="body2">Across {activeLoans.length} active loans</Typography>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 3, bgcolor: 'success.light', color: 'success.main', mb: 3 }}>
            <Typography variant="h6">Recovered (YTD)</Typography>
            <Typography variant="h3" fontWeight="bold">₹4.2L</Typography>
            <Typography variant="body2">Through EMI deductions</Typography>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 3, bgcolor: 'warning.light', color: 'warning.main', mb: 3 }}>
            <Typography variant="h6">Pending Requests</Typography>
            <Typography variant="h3" fontWeight="bold">{applications.length}</Typography>
            <Typography variant="body2">Needs Review</Typography>
          </Card>
        </Grid>
      </Grid>

      {/* MAIN CONTENT AREA */}
      <Grid container spacing={3}>
        {/* LEFT: APPLICATIONS */}
        <Grid item xs={12} lg={6}>
          <Card sx={{ p: 0, height: '100%' }}>
            <Box p={2} borderBottom="1px solid #eee" display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h6" fontWeight="bold">Application Queue</Typography>
              <Chip label="New" color="primary" size="small" />
            </Box>
            <Table>
              <TableHead sx={{ bgcolor: 'grey.50' }}>
                <TableRow>
                  <TableCell>Faculty</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell align="right">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {applications.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>
                      <Typography variant="subtitle2">{row.faculty}</Typography>
                      <Typography variant="caption" color="textSecondary">{row.date}</Typography>
                    </TableCell>
                    <TableCell>{row.type}</TableCell>
                    <TableCell fontWeight="bold">₹{row.amount.toLocaleString()}</TableCell>
                    <TableCell align="right">
                      <Tooltip title="Review & Sanction">
                        <IconButton color="primary" onClick={() => handleOpenApprove(row)}>
                          <Description />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
                {applications.length === 0 && (
                  <TableRow><TableCell colSpan={4} align="center">No pending applications</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </Card>
        </Grid>

        {/* RIGHT: ACTIVE LOANS TRACKER */}
        <Grid item xs={12} lg={6}>
          <Card sx={{ p: 0, height: '100%' }}>
            <Box p={2} borderBottom="1px solid #eee">
              <Typography variant="h6" fontWeight="bold">Active Loans Tracker</Typography>
            </Box>
            <Table>
              <TableHead sx={{ bgcolor: 'grey.50' }}>
                <TableRow>
                  <TableCell>Faculty</TableCell>
                  <TableCell>Loan Info</TableCell>
                  <TableCell>Repayment Progress</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {activeLoans.map((row) => {
                  const percent = (row.paid / row.principal) * 100;
                  return (
                    <TableRow key={row.id}>
                      <TableCell fontWeight="bold">{row.faculty}</TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight="bold">₹{row.principal.toLocaleString()}</Typography>
                        <Typography variant="caption" display="block">{row.type}</Typography>
                        <Chip label={`EMI: ₹${row.emi}`} size="small" variant="outlined" sx={{ mt: 0.5 }} />
                      </TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center" justifyContent="space-between" mb={0.5}>
                          <Typography variant="caption">Paid: ₹{row.paid.toLocaleString()}</Typography>
                          <Typography variant="caption">{percent.toFixed(0)}%</Typography>
                        </Box>
                        <LinearProgress variant="determinate" value={percent} color={percent > 90 ? "success" : "primary"} sx={{ height: 6, borderRadius: 3 }} />
                        <Typography variant="caption" color="textSecondary" sx={{ mt: 0.5, display: 'block' }}>
                          Outstanding: ₹{(row.principal - row.paid).toLocaleString()}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Card>
        </Grid>
      </Grid>

      {/* SANCTION DIALOG */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Sanction Loan: {selectedApp?.faculty}</DialogTitle>
        <DialogContent>
          <Box mb={3} p={2} bgcolor="primary.50" borderRadius={1}>
            <Typography variant="subtitle2">Requested Amount: <strong>₹{selectedApp?.amount.toLocaleString()}</strong></Typography>
            <Typography variant="subtitle2">Purpose: {selectedApp?.purpose}</Typography>
          </Box>
          
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={6}>
              <TextField 
                label="Interest Rate (%)" type="number" fullWidth
                value={sanctionDetails.interest} 
                onChange={(e) => setSanctionDetails({ ...sanctionDetails, interest: e.target.value })}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField 
                label="Tenure (Months)" type="number" fullWidth
                value={sanctionDetails.tenure} 
                onChange={(e) => setSanctionDetails({ ...sanctionDetails, tenure: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <Button variant="outlined" startIcon={<Calculate />} fullWidth onClick={calculateEMI}>
                Calculate EMI
              </Button>
            </Grid>
            <Grid item xs={12}>
              <TextField 
                label="Monthly Deduction (EMI)" fullWidth focused
                value={sanctionDetails.emi} 
                InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment> }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="error">Reject Application</Button>
          <Button onClick={handleConfirmSanction} variant="contained" color="success" startIcon={<ReceiptLong />}>
            Generate Sanction Letter
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default LoanManagementView;