import React, { useState } from "react";
import { 
  Box, Card, Grid, Typography, Button, Table, TableBody, TableCell, 
  TableHead, TableRow, Chip, IconButton, Tooltip, Dialog, DialogTitle, 
  DialogContent, DialogActions, TextField, MenuItem, Divider 
} from "@mui/material";
import { 
  Handshake, School, Description, CheckCircle, Cancel, 
  Visibility, Print, FlightTakeoff 
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";

const EngagementAdminView = () => {
  const [tabIndex, setTabIndex] = useState(0);

  // MOCK DATA: CONSULTANCY
  const [consultancyRequests, setConsultancyRequests] = useState([
    { id: 1, faculty: "Dr. Sarah Smith", client: "TechCorp Solutions", title: "AI Optimization", revenue: 500000, share: "70:30", status: "Pending" },
    { id: 2, faculty: "Prof. Rajan Kumar", client: "City Municipal Corp", title: "Structural Audit", revenue: 200000, share: "60:40", status: "Approved" },
  ]);

  // MOCK DATA: GUEST LECTURES
  const [guestLectures, setGuestLectures] = useState([
    { id: 101, faculty: "Dr. Emily Davis", type: "Guest Lecture", org: "NIT Warangal", date: "2026-02-10", status: "Pending Verification", doc: "invite_letter.pdf" },
    { id: 102, faculty: "Dr. A. Verma", type: "External Examiner", org: "Anna University", date: "2026-02-05", status: "OD Granted", doc: "duty_cert.pdf" },
  ]);

  // DIALOG STATES
  const [openConsultancyDialog, setOpenConsultancyDialog] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [openLectureDialog, setOpenLectureDialog] = useState(false);
  const [selectedLecture, setSelectedLecture] = useState(null);

  // ACTIONS
  const handleApproveConsultancy = () => {
    setConsultancyRequests(consultancyRequests.map(r => r.id === selectedRequest.id ? { ...r, status: "Approved" } : r));
    setOpenConsultancyDialog(false);
  };

  const handleGrantOD = () => {
    setGuestLectures(guestLectures.map(l => l.id === selectedLecture.id ? { ...l, status: "OD Granted" } : l));
    setOpenLectureDialog(false);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
        External Engagement Approvals
      </Typography>

      <Card sx={{ minHeight: 500 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 2, bgcolor: 'background.paper' }}>
          <Button 
            startIcon={<Handshake />} 
            sx={{ px: 3, py: 1.5, borderBottom: tabIndex === 0 ? 2 : 0, borderRadius: 0 }}
            color={tabIndex === 0 ? "primary" : "inherit"}
            onClick={() => setTabIndex(0)}
          >
            Consultancy Projects
          </Button>
          <Button 
            startIcon={<School />} 
            sx={{ px: 3, py: 1.5, borderBottom: tabIndex === 1 ? 2 : 0, borderRadius: 0 }}
            color={tabIndex === 1 ? "primary" : "inherit"}
            onClick={() => setTabIndex(1)}
          >
            Guest Lectures & OD
          </Button>
        </Box>

        <Box sx={{ p: 3 }}>
          {/* =================================================================
              TAB 1: CONSULTANCY APPROVALS
          ================================================================= */}
          {tabIndex === 0 && (
            <Box>
              <Typography variant="h6" gutterBottom>Pending Consultancy Requests</Typography>
              <Table>
                <TableHead sx={{ bgcolor: 'grey.100' }}>
                  <TableRow>
                    <TableCell>Faculty</TableCell>
                    <TableCell>Client & Project</TableCell>
                    <TableCell>Revenue</TableCell>
                    <TableCell>Share (Fac:Inst)</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {consultancyRequests.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell fontWeight="bold">{row.faculty}</TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight="bold">{row.client}</Typography>
                        <Typography variant="caption">{row.title}</Typography>
                      </TableCell>
                      <TableCell>₹{row.revenue.toLocaleString()}</TableCell>
                      <TableCell>{row.share}</TableCell>
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
                            onClick={() => { setSelectedRequest(row); setOpenConsultancyDialog(true); }}
                          >
                            Review
                          </Button>
                        ) : (
                          <Button variant="outlined" size="small" startIcon={<Print />}>
                            Letter
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          )}

          {/* =================================================================
              TAB 2: GUEST LECTURES & OD
          ================================================================= */}
          {tabIndex === 1 && (
            <Box>
              <Typography variant="h6" gutterBottom>Guest Lecture & Examiner Duty Claims</Typography>
              <Table>
                <TableHead sx={{ bgcolor: 'grey.100' }}>
                  <TableRow>
                    <TableCell>Faculty</TableCell>
                    <TableCell>Engagement Type</TableCell>
                    <TableCell>Organization</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {guestLectures.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell fontWeight="bold">{row.faculty}</TableCell>
                      <TableCell>{row.type}</TableCell>
                      <TableCell>{row.org}</TableCell>
                      <TableCell>{row.date}</TableCell>
                      <TableCell>
                        <Chip 
                          label={row.status} size="small" 
                          color={row.status === 'OD Granted' ? 'success' : 'warning'} 
                          variant={row.status === 'OD Granted' ? 'filled' : 'outlined'}
                        />
                      </TableCell>
                      <TableCell align="right">
                        {row.status === 'Pending Verification' && (
                          <Button 
                            variant="contained" size="small" color="info"
                            startIcon={<Visibility />} 
                            onClick={() => { setSelectedLecture(row); setOpenLectureDialog(true); }}
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

      {/* CONSULTANCY REVIEW DIALOG */}
      <Dialog open={openConsultancyDialog} onClose={() => setOpenConsultancyDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Review Consultancy Proposal</DialogTitle>
        <DialogContent dividers>
          <Box mb={2}>
            <Typography variant="subtitle2">Applicant: {selectedRequest?.faculty}</Typography>
            <Typography variant="body2" color="textSecondary">Project: {selectedRequest?.title}</Typography>
            <Typography variant="body2" color="textSecondary">Client: {selectedRequest?.client}</Typography>
          </Box>
          
          <Typography variant="subtitle2" gutterBottom color="primary">Compliance Checklist</Typography>
          <Box display="flex" flexDirection="column" gap={1}>
            <TextField select size="small" label="Revenue Sharing Model" defaultValue="Standard (70:30)">
              <MenuItem value="Standard (70:30)">Standard (70:30)</MenuItem>
              <MenuItem value="Special (60:40)">Special (60:40)</MenuItem>
            </TextField>
            <TextField select size="small" label="IP Rights Clause" defaultValue="Verified - Institute Owned">
              <MenuItem value="Verified - Institute Owned">Verified - Institute Owned</MenuItem>
              <MenuItem value="Verified - Shared">Verified - Shared</MenuItem>
              <MenuItem value="Not Clear">Not Clear (Reject)</MenuItem>
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConsultancyDialog(false)} color="error">Reject</Button>
          <Button onClick={handleApproveConsultancy} variant="contained" color="success" startIcon={<CheckCircle />}>
            Approve & Generate Letter
          </Button>
        </DialogActions>
      </Dialog>

      {/* OD GRANT DIALOG */}
      <Dialog open={openLectureDialog} onClose={() => setOpenLectureDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Verify Engagement & Grant OD</DialogTitle>
        <DialogContent dividers>
          <Box mb={2}>
            <Typography variant="subtitle2">Faculty: {selectedLecture?.faculty}</Typography>
            <Typography variant="body2">Event: {selectedLecture?.type} at {selectedLecture?.org}</Typography>
            <Typography variant="body2">Date: {selectedLecture?.date}</Typography>
          </Box>

          <Box p={2} border="1px dashed grey" borderRadius={1} bgcolor="#f9f9f9" display="flex" alignItems="center" justifyContent="space-between">
            <Box display="flex" alignItems="center" gap={1}>
              <Description color="action" />
              <Typography variant="body2">{selectedLecture?.doc}</Typography>
            </Box>
            <Button size="small">View</Button>
          </Box>

          <Box mt={2} p={1} bgcolor="info.light" color="info.contrastText" borderRadius={1} display="flex" alignItems="center" gap={1}>
            <FlightTakeoff fontSize="small" />
            <Typography variant="caption">Approving this will automatically credit 1 day OD Leave.</Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenLectureDialog(false)} color="error">Reject</Button>
          <Button onClick={handleGrantOD} variant="contained" color="success" startIcon={<CheckCircle />}>
            Verify & Grant OD
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EngagementAdminView;