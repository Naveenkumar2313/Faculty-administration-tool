import React, { useState } from "react";
import { 
  Box, Card, Grid, Typography, Button, Table, TableBody, TableCell, 
  TableHead, TableRow, Chip, IconButton, Tooltip, Dialog, DialogTitle, 
  DialogContent, DialogActions, LinearProgress, TextField, MenuItem, Divider
} from "@mui/material";
import { 
  PieChart, Assignment, AttachMoney, CheckCircle, Cancel, 
  Visibility, NotificationsActive, Description, TrendingUp 
} from "@mui/icons-material";


const GrantAdminView = () => {
  const [tabIndex, setTabIndex] = useState(0);

  // MOCK DATA: ACTIVE PROJECTS
  const [projects, setProjects] = useState([
    { id: "PRJ-2024-01", pi: "Dr. Sarah Smith", agency: "DST-SERB", budget: 2500000, used: 1800000, duration: "2024-2027", status: "On Track", reports: "UC Pending" },
    { id: "PRJ-2025-05", pi: "Prof. Rajan Kumar", agency: "AICTE-RPS", budget: 1500000, used: 200000, duration: "2025-2026", status: "Active", reports: "All Clear" },
    { id: "PRJ-2023-12", pi: "Dr. Emily Davis", agency: "UGC-STRIDE", budget: 5000000, used: 4800000, duration: "2023-2026", status: "Critical", reports: "Final Report Due" },
  ]);

  // MOCK DATA: APPROVAL QUEUE
  const [approvals, setApprovals] = useState([
    { id: 101, project: "PRJ-2024-01", type: "Utilization Certificate (UC)", amount: 1800000, date: "2026-02-01", status: "Pending Review", pi: "Dr. Sarah Smith" },
    { id: 102, project: "PRJ-2025-05", type: "Fund Release Request", amount: 500000, date: "2026-01-28", status: "Pending Review", pi: "Prof. Rajan Kumar" },
  ]);

  // DIALOG STATE
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [adminRemark, setAdminRemark] = useState("");

  // ACTIONS
  const handleApprove = () => {
    setApprovals(approvals.map(a => a.id === selectedRequest.id ? { ...a, status: "Approved" } : a));
    setOpenDialog(false);
  };

  const handleReject = () => {
    setApprovals(approvals.map(a => a.id === selectedRequest.id ? { ...a, status: "Rejected" } : a));
    setOpenDialog(false);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
        Grant & Project Oversight
      </Typography>

      <Card sx={{ minHeight: 500 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 2, bgcolor: 'background.paper' }}>
          <Button 
            startIcon={<TrendingUp />} 
            sx={{ px: 3, py: 1.5, borderBottom: tabIndex === 0 ? 2 : 0, borderRadius: 0 }}
            color={tabIndex === 0 ? "primary" : "inherit"}
            onClick={() => setTabIndex(0)}
          >
            Grant Monitoring
          </Button>
          <Button 
            startIcon={<Assignment />} 
            sx={{ px: 3, py: 1.5, borderBottom: tabIndex === 1 ? 2 : 0, borderRadius: 0 }}
            color={tabIndex === 1 ? "primary" : "inherit"}
            onClick={() => setTabIndex(1)}
          >
            Report & Fund Approvals
          </Button>
        </Box>

        <Box sx={{ p: 3 }}>
          {/* =================================================================
              TAB 1: ACTIVE GRANT MONITORING
          ================================================================= */}
          {tabIndex === 0 && (
            <Box>
              <Grid container spacing={3} mb={3}>
                {projects.map((p) => {
                  const percent = Math.round((p.used / p.budget) * 100);
                  return (
                    <Grid item xs={12} md={4} key={p.id}>
                      <Card variant="outlined" sx={{ p: 2, position: 'relative' }}>
                        <Box display="flex" justifyContent="space-between" mb={1}>
                          <Chip label={p.agency} size="small" color="primary" variant="outlined" />
                          <Chip 
                            label={p.status} size="small" 
                            color={p.status === 'Critical' ? 'error' : p.status === 'Active' ? 'success' : 'info'} 
                          />
                        </Box>
                        <Typography variant="h6" fontWeight="bold">{p.id}</Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom>PI: {p.pi}</Typography>
                        
                        <Box mt={2} mb={1}>
                          <Box display="flex" justifyContent="space-between">
                            <Typography variant="caption">Budget Used: ₹{p.used.toLocaleString()}</Typography>
                            <Typography variant="caption">{percent}%</Typography>
                          </Box>
                          <LinearProgress 
                            variant="determinate" value={percent} 
                            color={percent > 90 ? "error" : "primary"} 
                            sx={{ height: 6, borderRadius: 3, mt: 0.5 }}
                          />
                          <Typography variant="caption" color="text.secondary" display="block" textAlign="right" mt={0.5}>
                            Total: ₹{p.budget.toLocaleString()}
                          </Typography>
                        </Box>

                        <Divider sx={{ my: 1.5 }} />
                        
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                          <Box display="flex" alignItems="center" gap={0.5} color={p.reports !== "All Clear" ? "error.main" : "success.main"}>
                            <Description fontSize="small" />
                            <Typography variant="caption" fontWeight="bold">{p.reports}</Typography>
                          </Box>
                          {p.reports !== "All Clear" && (
                            <Tooltip title="Send Reminder to PI">
                              <IconButton size="small" color="warning"><NotificationsActive /></IconButton>
                            </Tooltip>
                          )}
                        </Box>
                      </Card>
                    </Grid>
                  );
                })}
              </Grid>
            </Box>
          )}

          {/* =================================================================
              TAB 2: REPORT & FUND APPROVALS
          ================================================================= */}
          {tabIndex === 1 && (
            <Box>
              <Typography variant="h6" gutterBottom>Pending Approvals Queue</Typography>
              <Table>
                <TableHead sx={{ bgcolor: 'grey.100' }}>
                  <TableRow>
                    <TableCell>Project ID</TableCell>
                    <TableCell>Request Type</TableCell>
                    <TableCell>Amount / Value</TableCell>
                    <TableCell>Submission Date</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {approvals.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell fontWeight="bold">
                        {row.project}
                        <Typography variant="caption" display="block">{row.pi}</Typography>
                      </TableCell>
                      <TableCell>{row.type}</TableCell>
                      <TableCell>₹{row.amount.toLocaleString()}</TableCell>
                      <TableCell>{row.date}</TableCell>
                      <TableCell>
                        <Chip 
                          label={row.status} size="small" 
                          color={row.status === 'Approved' ? 'success' : 'warning'} 
                        />
                      </TableCell>
                      <TableCell align="right">
                        {row.status === 'Pending Review' && (
                          <Button 
                            variant="contained" size="small" 
                            startIcon={<Visibility />} 
                            onClick={() => { setSelectedRequest(row); setOpenDialog(true); }}
                          >
                            Verify
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

      {/* APPROVAL DIALOG */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Review Request</DialogTitle>
        <DialogContent dividers>
          <Box mb={2}>
            <Typography variant="subtitle2">Project: {selectedRequest?.project}</Typography>
            <Typography variant="body2" color="textSecondary">Type: {selectedRequest?.type}</Typography>
            <Typography variant="h6" color="primary">₹{selectedRequest?.amount.toLocaleString()}</Typography>
          </Box>
          
          <Box p={2} mb={2} border="1px dashed grey" borderRadius={1} bgcolor="#f9f9f9" display="flex" justifyContent="space-between" alignItems="center">
            <Box display="flex" alignItems="center" gap={1}>
              <Description color="action" />
              <Typography variant="body2">Attached Document (UC/Bill)</Typography>
            </Box>
            <Button size="small">View</Button>
          </Box>

          <TextField 
            fullWidth multiline rows={2} label="Admin Remarks" 
            placeholder="e.g. Expenditure verified against budget head..."
            value={adminRemark} onChange={(e) => setAdminRemark(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleReject} color="error">Reject</Button>
          <Button onClick={handleApprove} variant="contained" color="success" startIcon={<CheckCircle />}>
            Approve & Process
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default GrantAdminView;