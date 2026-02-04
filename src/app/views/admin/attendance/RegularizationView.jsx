import React, { useState } from "react";
import { 
  Box, Card, Typography, Button, Table, TableBody, TableCell, 
  TableHead, TableRow, Checkbox, IconButton, Chip, 
  Tooltip, TextField, Dialog, DialogTitle, DialogContent, DialogActions
} from "@mui/material";
import { 
  CheckCircle, Cancel, Description, DoneAll, 
  AssignmentTurnedIn, Warning 
} from "@mui/icons-material";

const RegularizationView = () => {
  const [selectedIds, setSelectedIds] = useState([]);
  const [requests, setRequests] = useState([
    { id: 1, name: "Dr. Sarah Smith", date: "2026-02-01", reason: "Forgot ID Card", doc: "email_approval.pdf", status: "Pending" },
    { id: 2, name: "Prof. Rajan Kumar", date: "2026-02-02", reason: "Biometric Error", doc: "log_screenshot.png", status: "Pending" },
    { id: 3, name: "Dr. Emily Davis", date: "2026-01-28", reason: "On Duty (OD)", doc: "conference_invite.pdf", status: "Pending" },
    { id: 4, name: "Mr. John Doe", date: "2026-02-03", reason: "Device Malfunction", doc: null, status: "Pending" },
  ]);

  // Reject Modal State
  const [openReject, setOpenReject] = useState(false);
  const [rejectId, setRejectId] = useState(null);
  const [rejectReason, setRejectReason] = useState("");

  // BULK SELECTION
  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedIds(requests.filter(r => r.status === "Pending").map(r => r.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id) => {
    const selectedIndex = selectedIds.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedIds, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedIds.slice(1));
    } else if (selectedIndex === selectedIds.length - 1) {
      newSelected = newSelected.concat(selectedIds.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selectedIds.slice(0, selectedIndex),
        selectedIds.slice(selectedIndex + 1)
      );
    }
    setSelectedIds(newSelected);
  };

  // ACTIONS
  const handleBulkApprove = () => {
    const updated = requests.map(req => 
      selectedIds.includes(req.id) ? { ...req, status: "Approved" } : req
    );
    setRequests(updated);
    setSelectedIds([]);
  };

  const handleApprove = (id) => {
    setRequests(requests.map(req => req.id === id ? { ...req, status: "Approved" } : req));
  };

  const openRejectDialog = (id) => {
    setRejectId(id);
    setOpenReject(true);
  };

  const handleConfirmReject = () => {
    setRequests(requests.map(req => 
      req.id === rejectId ? { ...req, status: "Rejected", note: "Leave Deducted" } : req
    ));
    setOpenReject(false);
    setRejectId(null);
    setRejectReason("");
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" fontWeight="bold">Attendance Regularization Queue</Typography>
        <Button 
          variant="contained" color="success" startIcon={<DoneAll />}
          disabled={selectedIds.length === 0}
          onClick={handleBulkApprove}
        >
          Approve Selected ({selectedIds.length})
        </Button>
      </Box>

      <Card>
        <Table>
          <TableHead sx={{ bgcolor: 'grey.100' }}>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox 
                  onChange={handleSelectAll} 
                  checked={selectedIds.length > 0 && selectedIds.length === requests.filter(r => r.status === "Pending").length} 
                  indeterminate={selectedIds.length > 0 && selectedIds.length < requests.filter(r => r.status === "Pending").length}
                />
              </TableCell>
              <TableCell>Faculty Name</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Reason</TableCell>
              <TableCell>Supporting Doc</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {requests.map((row) => (
              <TableRow key={row.id} selected={selectedIds.indexOf(row.id) !== -1}>
                <TableCell padding="checkbox">
                  <Checkbox 
                    checked={selectedIds.indexOf(row.id) !== -1}
                    onChange={() => handleSelectOne(row.id)}
                    disabled={row.status !== "Pending"}
                  />
                </TableCell>
                <TableCell fontWeight="bold">{row.name}</TableCell>
                <TableCell>{row.date}</TableCell>
                <TableCell>{row.reason}</TableCell>
                <TableCell>
                  {row.doc ? (
                    <Tooltip title="View Document">
                      <IconButton color="primary" size="small"><Description /></IconButton>
                    </Tooltip>
                  ) : (
                    <Typography variant="caption" color="text.secondary">None</Typography>
                  )}
                </TableCell>
                <TableCell>
                  <Chip 
                    label={row.status} size="small" 
                    color={row.status === 'Approved' ? 'success' : row.status === 'Rejected' ? 'error' : 'warning'} 
                  />
                  {row.status === 'Rejected' && (
                    <Typography variant="caption" display="block" color="error" sx={{ mt: 0.5 }}>
                      -1 Leave Day
                    </Typography>
                  )}
                </TableCell>
                <TableCell align="right">
                  {row.status === 'Pending' && (
                    <>
                      <Tooltip title="Approve">
                        <IconButton color="success" onClick={() => handleApprove(row.id)}>
                          <CheckCircle />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Reject (Deduct Leave)">
                        <IconButton color="error" onClick={() => openRejectDialog(row.id)}>
                          <Cancel />
                        </IconButton>
                      </Tooltip>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* REJECTION DIALOG */}
      <Dialog open={openReject} onClose={() => setOpenReject(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Reject Request</DialogTitle>
        <DialogContent>
          <Box display="flex" alignItems="center" gap={1} mb={2} color="warning.main">
            <Warning /> 
            <Typography variant="body2">
              Rejection will automatically deduct 1 day from the faculty's leave balance.
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