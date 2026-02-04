import React, { useState } from 'react';
import { 
  Box, Card, Typography, Tabs, Tab, Avatar, Button, Stack, 
  TextField, Dialog, DialogTitle, DialogContent, DialogActions, 
  Chip, Collapse, IconButton 
} from "@mui/material";
import { 
  CheckCircle, Cancel, ExpandMore, ExpandLess, 
  DateRange, Description 
} from "@mui/icons-material";

const LeaveApprovalView = () => {
  const [tabIndex, setTabIndex] = useState(0); // 0: Pending, 1: History
  const [expandedId, setExpandedId] = useState(null);
  
  // Dialog State
  const [openReject, setOpenReject] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  // Mock Requests
  const [requests, setRequests] = useState([
    { id: 1, name: "Dr. Sarah Smith", type: "Medical Leave", from: "Oct 24", to: "Oct 26", days: 3, reason: "Viral Fever", history: "Used 2/12 ML", status: "Pending" },
    { id: 2, name: "Prof. Rajan", type: "Casual Leave", from: "Nov 02", to: "Nov 02", days: 1, reason: "Personal work", history: "Used 8/12 CL", status: "Pending" },
  ]);

  const handleAction = (id, action) => {
    if (action === 'Reject') {
      setSelectedId(id);
      setOpenReject(true);
    } else {
      setRequests(prev => prev.filter(r => r.id !== id));
      alert(`Request ${action}ed successfully`);
    }
  };

  const handleRejectConfirm = () => {
    setRequests(prev => prev.filter(r => r.id !== selectedId));
    setOpenReject(false);
    setRejectReason("");
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>Leave Management</Typography>

      <Card elevation={3}>
        <Tabs value={tabIndex} onChange={(e, v) => setTabIndex(v)} sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tab label={`Pending Requests (${requests.length})`} />
          <Tab label="Approval History" />
        </Tabs>

        <Box p={3} sx={{ bgcolor: 'grey.50', minHeight: 500 }}>
          {tabIndex === 0 && (
            <Stack spacing={2}>
              {requests.map((req) => (
                <Card key={req.id} sx={{ p: 2, borderLeft: '4px solid #1976d2' }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Box display="flex" gap={2} alignItems="center">
                      <Avatar sx={{ bgcolor: 'primary.light' }}>{req.name[0]}</Avatar>
                      <Box>
                        <Typography variant="subtitle1" fontWeight="bold">{req.name}</Typography>
                        <Typography variant="body2" color="text.secondary">{req.type} • {req.days} Days</Typography>
                      </Box>
                    </Box>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Chip label={req.from + ' - ' + req.to} icon={<DateRange />} size="small" />
                      <IconButton onClick={() => setExpandedId(expandedId === req.id ? null : req.id)}>
                        {expandedId === req.id ? <ExpandLess /> : <ExpandMore />}
                      </IconButton>
                    </Stack>
                  </Box>

                  {/* Expanded Details */}
                  <Collapse in={expandedId === req.id}>
                    <Box mt={2} p={2} bgcolor="grey.100" borderRadius={2}>
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={8}>
                          <Typography variant="caption" fontWeight="bold">Reason:</Typography>
                          <Typography variant="body2" mb={1}>{req.reason}</Typography>
                          
                          <Typography variant="caption" fontWeight="bold">Leave Balance History:</Typography>
                          <Typography variant="body2" color="text.secondary">{req.history}</Typography>
                        </Grid>
                        <Grid item xs={12} md={4} display="flex" flexDirection="column" gap={1} justifyContent="center">
                          <Button 
                            variant="contained" color="success" startIcon={<CheckCircle />}
                            onClick={() => handleAction(req.id, 'Approve')}
                          >
                            Approve Request
                          </Button>
                          <Button 
                            variant="outlined" color="error" startIcon={<Cancel />}
                            onClick={() => handleAction(req.id, 'Reject')}
                          >
                            Reject
                          </Button>
                        </Grid>
                      </Grid>
                    </Box>
                  </Collapse>
                </Card>
              ))}
              
              {requests.length === 0 && (
                <Typography textAlign="center" color="text.secondary" py={5}>No pending requests.</Typography>
              )}
            </Stack>
          )}
        </Box>
      </Card>

      {/* Reject Dialog */}
      <Dialog open={openReject} onClose={() => setOpenReject(false)} fullWidth maxWidth="sm">
        <DialogTitle>Reject Leave Request</DialogTitle>
        <DialogContent>
          <Typography variant="body2" mb={2}>Please provide a reason for rejection. This will be sent to the faculty.</Typography>
          <TextField 
            fullWidth multiline rows={3} label="Rejection Reason" 
            value={rejectReason} onChange={(e) => setRejectReason(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenReject(false)}>Cancel</Button>
          <Button variant="contained" color="error" onClick={handleRejectConfirm}>Confirm Rejection</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default LeaveApprovalView;