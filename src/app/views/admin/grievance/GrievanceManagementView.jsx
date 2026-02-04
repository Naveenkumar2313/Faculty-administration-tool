import React, { useState } from "react";
import { 
  Box, Card, Typography, Button, Table, TableBody, TableCell, 
  TableHead, TableRow, Chip, IconButton, Tooltip, Dialog, 
  DialogTitle, DialogContent, DialogActions, TextField, 
  MenuItem, LinearProgress, Avatar 
} from "@mui/material";
import { 
  Visibility, Gavel, PersonOff, Security, CloudUpload, 
  CheckCircle, Send, Flag 
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";

const HiddenInput = styled('input')({ display: 'none' });

const GrievanceManagementView = () => {
  // MOCK DATA
  const [tickets, setTickets] = useState([
    { id: "TKT-2026-001", category: "Harassment", by: "Anonymous", date: "2026-02-01", status: "Under Review", sla: 2, priority: "High" },
    { id: "TKT-2026-002", category: "Facilities", by: "Dr. Sarah Smith", date: "2026-01-28", status: "Proposed Resolution", sla: 5, priority: "Medium" },
    { id: "TKT-2026-003", category: "Salary", by: "Prof. Rajan Kumar", date: "2026-02-03", status: "Open", sla: 7, priority: "High" },
  ]);

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [resolution, setResolution] = useState({ action: "", status: "", doc: null });

  // ACTIONS
  const handleOpenResolve = (ticket) => {
    setSelectedTicket(ticket);
    setResolution({ action: "", status: ticket.status, doc: null });
    setOpenDialog(true);
  };

  const handleSaveResolution = () => {
    setTickets(tickets.map(t => 
      t.id === selectedTicket.id ? { ...t, status: resolution.status } : t
    ));
    setOpenDialog(false);
  };

  // HELPER: SLA COLOR
  const getSlaColor = (days) => days < 3 ? "error" : days < 7 ? "warning" : "success";

  return (
    <Box sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" fontWeight="bold">Grievance & Complaint Handling</Typography>
        <Box display="flex" alignItems="center" gap={1} bgcolor="warning.light" p={1} borderRadius={1}>
          <Security color="warning" />
          <Typography variant="caption" fontWeight="bold">Ombudsman Mode Active</Typography>
        </Box>
      </Box>

      <Card>
        <Box p={2} borderBottom="1px solid #eee">
          <Typography variant="h6">Active Grievance Queue</Typography>
        </Box>
        <Table>
          <TableHead sx={{ bgcolor: 'grey.100' }}>
            <TableRow>
              <TableCell>Ticket ID</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Submitted By</TableCell>
              <TableCell>Date Submitted</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>SLA Remaining</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tickets.map((row) => (
              <TableRow key={row.id}>
                <TableCell fontWeight="bold">{row.id}</TableCell>
                <TableCell>
                  <Chip 
                    label={row.category} size="small" 
                    color={row.category === 'Harassment' ? 'error' : 'default'} 
                    variant="outlined" 
                  />
                </TableCell>
                <TableCell>
                  {row.by === "Anonymous" ? (
                    <Box display="flex" alignItems="center" gap={1} color="text.secondary">
                      <PersonOff fontSize="small" /> 
                      <em>Hidden (Anonymous)</em>
                    </Box>
                  ) : (
                    row.by
                  )}
                </TableCell>
                <TableCell>{row.date}</TableCell>
                <TableCell>
                  <Chip 
                    label={row.status} size="small" 
                    color={row.status === 'Closed' ? 'success' : row.status === 'Open' ? 'error' : 'info'} 
                  />
                </TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="body2" color={`${getSlaColor(row.sla)}.main`} fontWeight="bold">
                      {row.sla} Days
                    </Typography>
                    <LinearProgress 
                      variant="determinate" value={(row.sla / 10) * 100} 
                      color={getSlaColor(row.sla)} 
                      sx={{ width: 60, height: 6, borderRadius: 3 }}
                    />
                  </Box>
                </TableCell>
                <TableCell align="right">
                  <Button 
                    size="small" variant="contained" color="primary" 
                    startIcon={<Gavel />} 
                    onClick={() => handleOpenResolve(row)}
                  >
                    Resolve
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* RESOLUTION DIALOG */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Resolution Workflow: {selectedTicket?.id}</DialogTitle>
        <DialogContent dividers>
          <Box display="flex" gap={2} mb={3}>
            <Box flex={1} p={2} bgcolor="grey.50" borderRadius={1}>
              <Typography variant="caption" color="text.secondary">Category</Typography>
              <Typography variant="subtitle1" fontWeight="bold">{selectedTicket?.category}</Typography>
            </Box>
            <Box flex={1} p={2} bgcolor="grey.50" borderRadius={1}>
              <Typography variant="caption" color="text.secondary">Complainant</Typography>
              <Typography variant="subtitle1" fontWeight="bold" display="flex" alignItems="center" gap={1}>
                {selectedTicket?.by === "Anonymous" ? <PersonOff fontSize="small"/> : <Avatar sx={{ width: 24, height: 24 }} />}
                {selectedTicket?.by}
              </Typography>
            </Box>
          </Box>

          <Typography variant="subtitle2" gutterBottom>1. Assign & Update Status</Typography>
          <Box display="flex" gap={2} mb={3}>
            <TextField 
              select fullWidth label="Assign To Committee Member" size="small"
              defaultValue="Dr. Chairperson"
            >
              <MenuItem value="Dr. Chairperson">Dr. Chairperson (Internal Complaint Comm.)</MenuItem>
              <MenuItem value="HR Head">HR Head</MenuItem>
            </TextField>
            <TextField 
              select fullWidth label="Update Status" size="small"
              value={resolution.status}
              onChange={(e) => setResolution({ ...resolution, status: e.target.value })}
            >
              <MenuItem value="Under Review">Under Review</MenuItem>
              <MenuItem value="Proposed Resolution">Proposed Resolution</MenuItem>
              <MenuItem value="Closed">Closed</MenuItem>
            </TextField>
          </Box>

          <Typography variant="subtitle2" gutterBottom>2. Resolution Details</Typography>
          <TextField 
            fullWidth multiline rows={4} label="Action Taken / Resolution Notes" 
            placeholder="Describe the investigation findings and final decision..."
            value={resolution.action}
            onChange={(e) => setResolution({ ...resolution, action: e.target.value })}
            sx={{ mb: 2 }}
          />

          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Button component="label" startIcon={<CloudUpload />} size="small">
              Upload Investigation Report (PDF)
              <HiddenInput type="file" accept="application/pdf" />
            </Button>
            {resolution.status === "Proposed Resolution" && (
              <Chip icon={<Flag />} label="Auto-Email will be sent to faculty" color="info" variant="outlined" />
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleSaveResolution} variant="contained" color="success" startIcon={<CheckCircle />}>
            Submit Resolution
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default GrievanceManagementView;