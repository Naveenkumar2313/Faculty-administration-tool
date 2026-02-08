import React, { useState } from "react";
import { 
  Box, Card, Typography, Button, Table, TableBody, TableCell, 
  TableHead, TableRow, Checkbox, IconButton, Chip, 
  Tooltip, TextField, Dialog, DialogTitle, DialogContent, DialogActions,
  Tabs, Tab, Grid, LinearProgress, List, ListItem, ListItemText, ListItemIcon,
  Avatar, Divider, Alert
} from "@mui/material";
import { 
  CheckCircle, Cancel, Description, DoneAll, 
  AssignmentTurnedIn, Warning, History, UploadFile,
  Analytics, VerifiedUser, AutoAwesome, Visibility,
  DateRange, HolidayVillage, Person, FactCheck
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";

const HiddenInput = styled('input')({ display: 'none' });

const RegularizationView = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [selectedIds, setSelectedIds] = useState([]);

  // --- MOCK DATA ---
  
  const [requests, setRequests] = useState([
    { 
      id: 1, name: "Dr. Sarah Smith", dept: "CSE", date: "2026-02-01", 
      reason: "Forgot ID Card", doc: "email_approval.pdf", 
      status: "HOD Approved", adminStatus: "Pending",
      leaveBalance: 12, isHoliday: false, isDuplicate: false,
      ocrData: "Date: 01-Feb-2026 | ID: 998877"
    },
    { 
      id: 2, name: "Prof. Rajan Kumar", dept: "Mech", date: "2026-02-02", 
      reason: "Biometric Error", doc: "log_screenshot.png", 
      status: "Pending", adminStatus: "Pending",
      leaveBalance: 5, isHoliday: false, isDuplicate: true,
      ocrData: "Error Code: BIO-FAIL-01"
    },
    { 
      id: 3, name: "Dr. Emily Davis", dept: "Civil", date: "2026-01-26", 
      reason: "On Duty (OD)", doc: "conference_invite.pdf", 
      status: "Pending", adminStatus: "Pending",
      leaveBalance: 8, isHoliday: true, isDuplicate: false, // Republic Day warning
      ocrData: "Conf Date: 26-Jan-2026 | Venue: IITM"
    },
  ]);

  const [history, setHistory] = useState([
    { id: 101, name: "Mr. John Doe", date: "2026-01-15", reason: "Sick Leave", status: "Approved", actionBy: "Admin" },
    { id: 102, name: "Ms. Priya Roy", date: "2026-01-10", reason: "Traffic", status: "Rejected", actionBy: "HOD", note: "Not valid reason" },
  ]);

  // DIALOG STATES
  const [openReject, setOpenReject] = useState(false);
  const [rejectId, setRejectId] = useState(null);
  const [rejectReason, setRejectReason] = useState("");

  const [openDocPreview, setOpenDocPreview] = useState(false);
  const [selectedDocRequest, setSelectedDocRequest] = useState(null);

  // --- ACTIONS ---

  const handleTabChange = (event, newValue) => setTabIndex(newValue);

  // BULK SELECTION
  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedIds(requests.filter(r => r.adminStatus === "Pending").map(r => r.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id) => {
    const selectedIndex = selectedIds.indexOf(id);
    let newSelected = [];
    if (selectedIndex === -1) newSelected = newSelected.concat(selectedIds, id);
    else if (selectedIndex === 0) newSelected = newSelected.concat(selectedIds.slice(1));
    else if (selectedIndex === selectedIds.length - 1) newSelected = newSelected.concat(selectedIds.slice(0, -1));
    else if (selectedIndex > 0) newSelected = newSelected.concat(selectedIds.slice(0, selectedIndex), selectedIds.slice(selectedIndex + 1));
    setSelectedIds(newSelected);
  };

  // APPROVAL WORKFLOW
  const handleApprove = (id) => {
    setRequests(requests.map(req => req.id === id ? { ...req, adminStatus: "Approved", status: "Approved" } : req));
    addToHistory(id, "Approved");
  };

  const handleBulkApprove = () => {
    const updatedRequests = requests.map(req => {
      if (selectedIds.includes(req.id)) {
        return { ...req, adminStatus: "Approved", status: "Approved" };
      }
      return req;
    });
    setRequests(updatedRequests);
    setSelectedIds([]);
    // Mock adding to history...
  };

  const handleAutoApproveOD = () => {
    const updatedRequests = requests.map(req => {
      if (req.reason.includes("On Duty") && req.adminStatus === "Pending") {
        return { ...req, adminStatus: "Approved", status: "Auto-Approved (OD)" };
      }
      return req;
    });
    setRequests(updatedRequests);
  };

  // REJECTION LOGIC
  const openRejectDialog = (id) => {
    setRejectId(id);
    setOpenReject(true);
  };

  const handleConfirmReject = () => {
    setRequests(requests.map(req => req.id === rejectId ? { ...req, adminStatus: "Rejected", status: "Rejected" } : req));
    addToHistory(rejectId, "Rejected");
    setOpenReject(false);
    setRejectId(null);
    setRejectReason("");
  };

  const addToHistory = (id, status) => {
    const req = requests.find(r => r.id === id);
    if(req) {
      setHistory([{ ...req, id: Date.now(), status: status, actionBy: "Admin", note: rejectReason }, ...history]);
    }
  };

  // HELPER: SMART VALIDATION
  const getValidationWarnings = (req) => {
    let warnings = [];
    if (req.isHoliday) warnings.push("Date matches a Holiday");
    if (req.isDuplicate) warnings.push("Duplicate request for this date");
    if (req.leaveBalance < 1) warnings.push("Low Leave Balance");
    return warnings;
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
        Attendance Regularization
      </Typography>

      <Card sx={{ minHeight: 600 }}>
        <Tabs 
          value={tabIndex} 
          onChange={handleTabChange} 
          sx={{ borderBottom: 1, borderColor: 'divider', px: 2, bgcolor: 'background.paper' }}
        >
          <Tab icon={<AssignmentTurnedIn />} iconPosition="start" label="Pending Requests" />
          <Tab icon={<History />} iconPosition="start" label="Request History" />
          <Tab icon={<UploadFile />} iconPosition="start" label="Bulk Upload" />
          <Tab icon={<Analytics />} iconPosition="start" label="Analytics & Trends" />
        </Tabs>

        <Box sx={{ p: 3 }}>
          {/* =================================================================
              TAB 1: PENDING REQUESTS
          ================================================================= */}
          {tabIndex === 0 && (
            <Box>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Box display="flex" gap={2}>
                  <Button 
                    variant="contained" color="success" startIcon={<DoneAll />}
                    disabled={selectedIds.length === 0}
                    onClick={handleBulkApprove}
                  >
                    Approve Selected ({selectedIds.length})
                  </Button>
                  <Button 
                    variant="outlined" color="primary" startIcon={<AutoAwesome />}
                    onClick={handleAutoApproveOD}
                  >
                    Auto-Approve OD Cases
                  </Button>
                </Box>
                <Chip label={`${requests.filter(r => r.adminStatus === 'Pending').length} Pending`} color="warning" />
              </Box>

              <Table>
                <TableHead sx={{ bgcolor: 'grey.100' }}>
                  <TableRow>
                    <TableCell padding="checkbox">
                      <Checkbox onChange={handleSelectAll} />
                    </TableCell>
                    <TableCell>Faculty Details</TableCell>
                    <TableCell>Request Details</TableCell>
                    <TableCell>Smart Validation</TableCell>
                    <TableCell>Documents</TableCell>
                    <TableCell>Workflow Status</TableCell>
                    <TableCell align="right">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {requests.filter(r => r.adminStatus === 'Pending').map((row) => {
                    const warnings = getValidationWarnings(row);
                    return (
                      <TableRow key={row.id} selected={selectedIds.includes(row.id)}>
                        <TableCell padding="checkbox">
                          <Checkbox 
                            checked={selectedIds.includes(row.id)}
                            onChange={() => handleSelectOne(row.id)}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography fontWeight="bold">{row.name}</Typography>
                          <Typography variant="caption" display="block">{row.dept}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">{row.date}</Typography>
                          <Typography variant="caption" color="textSecondary">{row.reason}</Typography>
                        </TableCell>
                        <TableCell>
                          {warnings.length > 0 ? (
                            warnings.map((w, i) => (
                              <Chip key={i} icon={<Warning />} label={w} size="small" color="error" variant="outlined" sx={{ mr: 0.5, mb: 0.5 }} />
                            ))
                          ) : (
                            <Chip icon={<CheckCircle />} label="Clear" size="small" color="success" variant="outlined" />
                          )}
                        </TableCell>
                        <TableCell>
                          <Button 
                            size="small" startIcon={<Visibility />} 
                            onClick={() => { setSelectedDocRequest(row); setOpenDocPreview(true); }}
                          >
                            Preview
                          </Button>
                        </TableCell>
                        <TableCell>
                          <Box display="flex" flexDirection="column" gap={0.5}>
                             <Chip label={`HOD: ${row.status.includes('HOD') ? 'Approved' : 'Pending'}`} size="small" color={row.status.includes('HOD') ? "success" : "default"} />
                             <Chip label="Admin: Pending" size="small" color="warning" />
                          </Box>
                        </TableCell>
                        <TableCell align="right">
                           <IconButton color="success" onClick={() => handleApprove(row.id)}><CheckCircle /></IconButton>
                           <IconButton color="error" onClick={() => openRejectDialog(row.id)}><Cancel /></IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </Box>
          )}

          {/* =================================================================
              TAB 2: HISTORY
          ================================================================= */}
          {tabIndex === 1 && (
             <Box>
               <Typography variant="h6" gutterBottom>Regularization History</Typography>
               <Table>
                 <TableHead sx={{ bgcolor: 'grey.50' }}>
                   <TableRow>
                     <TableCell>Faculty</TableCell>
                     <TableCell>Date</TableCell>
                     <TableCell>Reason</TableCell>
                     <TableCell>Status</TableCell>
                     <TableCell>Action By</TableCell>
                     <TableCell>Notes</TableCell>
                   </TableRow>
                 </TableHead>
                 <TableBody>
                   {history.map(row => (
                     <TableRow key={row.id}>
                       <TableCell fontWeight="bold">{row.name}</TableCell>
                       <TableCell>{row.date}</TableCell>
                       <TableCell>{row.reason}</TableCell>
                       <TableCell>
                         <Chip label={row.status} color={row.status === 'Approved' ? 'success' : 'error'} size="small" />
                       </TableCell>
                       <TableCell>{row.actionBy}</TableCell>
                       <TableCell>{row.note || "-"}</TableCell>
                     </TableRow>
                   ))}
                 </TableBody>
               </Table>
             </Box>
          )}

          {/* =================================================================
              TAB 3: BULK UPLOAD
          ================================================================= */}
          {tabIndex === 2 && (
             <Grid container spacing={3} justifyContent="center">
               <Grid item xs={12} md={6} textAlign="center">
                 <Box border="2px dashed #ccc" borderRadius={2} p={5} mt={3}>
                   <UploadFile sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                   <Typography variant="h6">Bulk Regularization Upload</Typography>
                   <Typography variant="body2" color="textSecondary" mb={3}>
                     Upload CSV/Excel file containing Faculty ID, Date, and Reason.
                   </Typography>
                   <Button variant="contained" component="label">
                     Select File
                     <HiddenInput type="file" />
                   </Button>
                   <Box mt={2}>
                     <Button size="small" href="#">Download Template</Button>
                   </Box>
                 </Box>
               </Grid>
             </Grid>
          )}

          {/* =================================================================
              TAB 4: ANALYTICS
          ================================================================= */}
          {tabIndex === 3 && (
             <Box>
               <Grid container spacing={3}>
                 <Grid item xs={12} md={4}>
                   <Card sx={{ p: 2, bgcolor: 'primary.light', color: 'black' }}>
                     <Typography variant="h6">Frequent Requestors</Typography>
                     <List dense>
                       <ListItem>
                         <ListItemIcon><Person /></ListItemIcon>
                         <ListItemText primary="Prof. Rajan Kumar" secondary="5 requests this month" />
                       </ListItem>
                       <ListItem>
                         <ListItemIcon><Person /></ListItemIcon>
                         <ListItemText primary="Dr. Emily Davis" secondary="3 requests this month" />
                       </ListItem>
                     </List>
                   </Card>
                 </Grid>
                 <Grid item xs={12} md={4}>
                   <Card sx={{ p: 2, bgcolor: 'error.light', color: 'black' }}>
                     <Typography variant="h6">Rejection Reasons</Typography>
                     <Box mt={2}>
                       <Typography variant="body2" display="flex" justifyContent="space-between">
                         <span>Insuficient Proof</span> <span>45%</span>
                       </Typography>
                       <LinearProgress variant="determinate" value={45} color="error" sx={{ mb: 1 }} />
                       <Typography variant="body2" display="flex" justifyContent="space-between">
                         <span>Duplicate Request</span> <span>30%</span>
                       </Typography>
                       <LinearProgress variant="determinate" value={30} color="error" sx={{ mb: 1 }} />
                     </Box>
                   </Card>
                 </Grid>
                 <Grid item xs={12} md={4}>
                   <Card sx={{ p: 2, bgcolor: 'info.light', color: 'black' }}>
                     <Typography variant="h6">Department Trends</Typography>
                     <Box mt={2}>
                       <Typography variant="body2">CSE: 12 Requests</Typography>
                       <Typography variant="body2">Mech: 8 Requests</Typography>
                       <Typography variant="body2">Civil: 5 Requests</Typography>
                     </Box>
                   </Card>
                 </Grid>
               </Grid>
             </Box>
          )}
        </Box>
      </Card>

      {/* --- DIALOGS --- */}

      {/* 1. DOCUMENT PREVIEW */}
      <Dialog open={openDocPreview} onClose={() => setOpenDocPreview(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Document Verification: {selectedDocRequest?.name}</DialogTitle>
        <DialogContent dividers>
          <Box mb={2} p={2} bgcolor="grey.100" borderRadius={1} display="flex" alignItems="center" justifyContent="center" height={150}>
            <Typography color="textSecondary">[ Mock Document Preview ]</Typography>
            {/* Real app would use an <iframe> or image tag here */}
          </Box>
          
          <Alert severity="info" icon={<AutoAwesome />} sx={{ mb: 2 }}>
            <strong>OCR Extracted Data:</strong> {selectedDocRequest?.ocrData || "No text detected."}
          </Alert>

          <Typography variant="subtitle2" gutterBottom>Verification Checklist</Typography>
          <List dense disablePadding>
             <ListItem><ListItemIcon><CheckCircle color="success" /></ListItemIcon><ListItemText primary="Date Matches Request" /></ListItem>
             <ListItem><ListItemIcon><CheckCircle color="success" /></ListItemIcon><ListItemText primary="Reason Matches Request" /></ListItem>
             <ListItem><ListItemIcon><Warning color="warning" /></ListItemIcon><ListItemText primary="Document Expiry Check (Optional)" /></ListItem>
          </List>
        </DialogContent>
        <DialogActions>
           <Button onClick={() => setOpenDocPreview(false)}>Close</Button>
           <Button variant="contained" onClick={() => { handleApprove(selectedDocRequest.id); setOpenDocPreview(false); }}>Verify & Approve</Button>
        </DialogActions>
      </Dialog>

      {/* 2. REJECTION DIALOG */}
      <Dialog open={openReject} onClose={() => setOpenReject(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Reject Request</DialogTitle>
        <DialogContent>
          <Box display="flex" alignItems="center" gap={1} mb={2} color="warning.main">
            <Warning /> 
            <Typography variant="body2">
              Rejection will deduct 1 day from the faculty's leave balance.
            </Typography>
          </Box>
          <TextField
            autoFocus margin="dense" label="Rejection Reason / Comments" fullWidth multiline rows={3}
            value={rejectReason} onChange={(e) => setRejectReason(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenReject(false)}>Cancel</Button>
          <Button onClick={handleConfirmReject} color="error" variant="contained">Confirm Rejection</Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
};

export default RegularizationView;