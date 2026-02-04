import React, { useState } from "react";
import { 
  Box, Card, Grid, Typography, Button, Table, TableBody, TableCell, 
  TableHead, TableRow, Chip, IconButton, Tooltip, LinearProgress, 
  Dialog, DialogTitle, DialogContent, DialogActions, Stepper, Step, StepLabel 
} from "@mui/material";
import { 
  CheckCircle, Cancel, Visibility, Receipt, 
  AttachMoney, Map, Warning 
} from "@mui/icons-material";

const ClaimsApprovalView = () => {
  // MOCK DATA
  const [claims, setClaims] = useState([
    { id: 1, faculty: "Dr. Sarah Smith", type: "Conference", amount: 12000, date: "2026-02-01", stage: 1, status: "Pending", proof: "conf_receipt.pdf", distance: 0 },
    { id: 2, faculty: "Prof. Rajan Kumar", type: "Medical", amount: 4500, date: "2026-01-28", stage: 2, status: "Pending", proof: "med_bills.pdf", distance: 0 },
    { id: 3, faculty: "Dr. Emily Davis", type: "Travel (TA/DA)", amount: 8500, date: "2026-02-03", stage: 0, status: "Pending", proof: "ticket.pdf", distance: 450 },
  ]);

  // BUDGET TRACKER DATA
  const budgets = [
    { category: "Conference", limit: 50000, used: 38000, color: "primary" },
    { category: "Medical", limit: 15000, used: 11000, color: "warning" },
    { category: "Travel (TA/DA)", limit: 25000, used: 5000, color: "success" },
    { category: "Research Grant", limit: 100000, used: 92000, color: "error" },
  ];

  // MODAL STATE
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedClaim, setSelectedClaim] = useState(null);

  // Workflow Stages
  const steps = ['HOD Approval', 'Finance Verification', 'Accounts Payment'];

  // ACTIONS
  const handleInspect = (claim) => {
    setSelectedClaim(claim);
    setOpenDialog(true);
  };

  const handleApprove = () => {
    // Move to next stage or Mark Paid
    const updatedClaims = claims.map(c => {
      if (c.id === selectedClaim.id) {
        if (c.stage < 2) return { ...c, stage: c.stage + 1 };
        return { ...c, status: "Paid", stage: 3 };
      }
      return c;
    });
    setClaims(updatedClaims);
    setOpenDialog(false);
  };

  const handleReject = () => {
    setClaims(claims.map(c => c.id === selectedClaim.id ? { ...c, status: "Rejected", stage: -1 } : c));
    setOpenDialog(false);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
        Reimbursement & Claims Approval
      </Typography>

      <Grid container spacing={3}>
        {/* LEFT COL: BUDGET TRACKER */}
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>Budget Utilization (FY 2025-26)</Typography>
            {budgets.map((b, i) => {
              const percent = (b.used / b.limit) * 100;
              return (
                <Box key={i} mb={2}>
                  <Box display="flex" justifyContent="space-between" mb={0.5}>
                    <Typography variant="body2" fontWeight="bold">{b.category}</Typography>
                    <Typography variant="caption">{percent.toFixed(0)}% Used</Typography>
                  </Box>
                  <LinearProgress variant="determinate" value={percent} color={b.color} sx={{ height: 8, borderRadius: 4 }} />
                  <Box display="flex" justifyContent="space-between" mt={0.5}>
                    <Typography variant="caption">₹{b.used.toLocaleString()}</Typography>
                    <Typography variant="caption">Limit: ₹{b.limit.toLocaleString()}</Typography>
                  </Box>
                  {percent > 80 && (
                    <Box display="flex" alignItems="center" gap={0.5} mt={0.5} color="error.main">
                      <Warning sx={{ fontSize: 12 }} /> 
                      <Typography variant="caption">Budget nearly exhausted</Typography>
                    </Box>
                  )}
                </Box>
              );
            })}
          </Card>
        </Grid>

        {/* RIGHT COL: CLAIMS DASHBOARD */}
        <Grid item xs={12} md={8}>
          <Card>
            <Box p={2} bgcolor="grey.100" borderBottom="1px solid #ddd">
              <Typography variant="subtitle1" fontWeight="bold">Pending Claims Queue</Typography>
            </Box>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Faculty</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Current Stage</TableCell>
                  <TableCell align="right">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {claims.filter(c => c.status === "Pending").map((row) => (
                  <TableRow key={row.id}>
                    <TableCell fontWeight="bold">{row.faculty}</TableCell>
                    <TableCell>
                      <Chip label={row.type} size="small" variant="outlined" />
                    </TableCell>
                    <TableCell>₹{row.amount.toLocaleString()}</TableCell>
                    <TableCell>
                      <Chip 
                        label={steps[row.stage]} 
                        color={row.stage === 0 ? "default" : row.stage === 1 ? "info" : "warning"} 
                        size="small" 
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Button 
                        size="small" variant="contained" color="primary" 
                        startIcon={<Visibility />} 
                        onClick={() => handleInspect(row)}
                      >
                        Inspect
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {claims.filter(c => c.status === "Pending").length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} align="center">No pending claims.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Card>
        </Grid>
      </Grid>

      {/* INSPECTION DIALOG */}
      {selectedClaim && (
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
          <DialogTitle>Claim Inspection: {selectedClaim.faculty}</DialogTitle>
          <DialogContent dividers>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Stepper activeStep={selectedClaim.stage} alternativeLabel>
                  {steps.map((label) => (
                    <Step key={label}><StepLabel>{label}</StepLabel></Step>
                  ))}
                </Stepper>
              </Grid>

              {/* DETAILS */}
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">Claim Details</Typography>
                <Box p={2} bgcolor="grey.50" borderRadius={2} mt={1}>
                  <Typography><strong>Category:</strong> {selectedClaim.type}</Typography>
                  <Typography><strong>Date:</strong> {selectedClaim.date}</Typography>
                  <Typography display="flex" alignItems="center" gap={1}>
                    <strong>Amount:</strong> 
                    <span style={{ fontSize: '1.2rem', color: 'green' }}>₹{selectedClaim.amount}</span>
                  </Typography>
                  
                  {/* TA/DA Verification Logic */}
                  {selectedClaim.type.includes("Travel") && (
                    <Box mt={2} p={1} border="1px dashed orange" borderRadius={1} bgcolor="#fff3e0">
                      <Typography variant="caption" fontWeight="bold" display="flex" alignItems="center" gap={1}>
                        <Map fontSize="small" /> Automated Verification
                      </Typography>
                      <Typography variant="caption" display="block">Distance: {selectedClaim.distance} km</Typography>
                      <Typography variant="caption" display="block" color={selectedClaim.distance * 15 < selectedClaim.amount ? "error" : "success"}>
                        Est. Fare (₹15/km): ₹{selectedClaim.distance * 15}
                        {selectedClaim.distance * 15 < selectedClaim.amount && " (Claim exceeds estimate!)"}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Grid>

              {/* PROOF */}
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">Supporting Documents</Typography>
                <Box 
                  height={150} mt={1} border="1px solid #ddd" borderRadius={2} 
                  display="flex" alignItems="center" justifyContent="center" flexDirection="column"
                  bgcolor="#f9f9f9"
                >
                  <Receipt fontSize="large" color="action" />
                  <Typography variant="caption">{selectedClaim.proof}</Typography>
                  <Button size="small">View PDF</Button>
                </Box>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleReject} color="error" startIcon={<Cancel />}>Reject</Button>
            <Button onClick={handleApprove} variant="contained" color="success" startIcon={<CheckCircle />}>
              {selectedClaim.stage === 2 ? "Authorize Payment" : "Approve & Forward"}
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
};

export default ClaimsApprovalView;