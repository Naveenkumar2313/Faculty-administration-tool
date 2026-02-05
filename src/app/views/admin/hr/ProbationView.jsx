import React, { useState } from "react";
import { 
  Box, Card, Grid, Typography, Button, Table, TableBody, TableCell, 
  TableHead, TableRow, Chip, IconButton, Tooltip, Dialog, DialogTitle, 
  DialogContent, DialogActions, FormControlLabel, Checkbox, TextField, 
  LinearProgress, Alert 
} from "@mui/material";
import { 
  Timer, CheckCircle, AssignmentInd, School, 
  VerifiedUser, HourglassEmpty, ReportProblem, Print 
} from "@mui/icons-material";

const ProbationView = () => {
  // MOCK DATA: FACULTY ON PROBATION
  const [facultyList, setFacultyList] = useState([
    { id: 1, name: "Mr. Arjun Singh", dept: "CSE", joinDate: "2025-06-01", probationEnd: "2026-06-01", attendance: 92, feedback: 4.5, research: "2 Papers", status: "On Track" },
    { id: 2, name: "Ms. Neha Gupta", dept: "ECE", joinDate: "2025-08-15", probationEnd: "2026-02-15", attendance: 88, feedback: 3.8, research: "In Progress", status: "Due Soon" },
    { id: 3, name: "Dr. K. Reddy", dept: "Civil", joinDate: "2025-01-10", probationEnd: "2026-01-10", attendance: 75, feedback: 4.2, research: "None", status: "Overdue" },
  ]);

  // DIALOG STATE
  const [openReview, setOpenReview] = useState(false);
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [checklist, setChecklist] = useState({
    attendance: false,
    feedback: false,
    research: false,
    disciplinary: false
  });
  const [remarks, setRemarks] = useState("");

  // HELPER: CALCULATE DAYS REMAINING
  const getDaysRemaining = (endDate) => {
    const end = new Date(endDate);
    const today = new Date();
    const diffTime = end - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
  };

  // ACTIONS
  const handleOpenReview = (faculty) => {
    setSelectedFaculty(faculty);
    // Auto-check logic based on mock performance data
    setChecklist({
      attendance: faculty.attendance >= 85,
      feedback: faculty.feedback >= 4.0,
      research: faculty.research !== "None",
      disciplinary: true // Assuming no issues by default
    });
    setRemarks("");
    setOpenReview(true);
  };

  const handleConfirmEmployment = () => {
    setFacultyList(facultyList.map(f => f.id === selectedFaculty.id ? { ...f, status: "Confirmed" } : f));
    setOpenReview(false);
    // Ideally trigger API to generate letter here
  };

  const handleExtendProbation = () => {
    setFacultyList(facultyList.map(f => f.id === selectedFaculty.id ? { ...f, status: "Extended" } : f));
    setOpenReview(false);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
        Probation Tracking & Confirmation
      </Typography>

      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 2, bgcolor: 'primary.light', color: 'primary.main', display: 'flex', alignItems: 'center', gap: 2 }}>
            <HourglassEmpty fontSize="large" />
            <Box>
              <Typography variant="h4" fontWeight="bold">{facultyList.filter(f => f.status !== 'Confirmed').length}</Typography>
              <Typography variant="body2">Active Probation Cases</Typography>
            </Box>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 2, bgcolor: 'warning.light', color: 'warning.main', display: 'flex', alignItems: 'center', gap: 2 }}>
            <Timer fontSize="large" />
            <Box>
              <Typography variant="h4" fontWeight="bold">
                {facultyList.filter(f => getDaysRemaining(f.probationEnd) <= 30 && f.status !== 'Confirmed').length}
              </Typography>
              <Typography variant="body2">Due for Confirmation (&lt;30 Days)</Typography>
            </Box>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 2, bgcolor: 'success.light', color: 'success.main', display: 'flex', alignItems: 'center', gap: 2 }}>
            <VerifiedUser fontSize="large" />
            <Box>
              <Typography variant="h4" fontWeight="bold">18</Typography>
              <Typography variant="body2">Confirmed this Year</Typography>
            </Box>
          </Card>
        </Grid>
      </Grid>

      <Card>
        <Typography variant="h6" sx={{ p: 2, pb: 0 }}>Faculty Probation List</Typography>
        <Table>
          <TableHead sx={{ bgcolor: 'grey.100' }}>
            <TableRow>
              <TableCell>Faculty Name</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Probation End Date</TableCell>
              <TableCell>Timeline Status</TableCell>
              <TableCell>Performance Metrics</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {facultyList.map((row) => {
              const daysLeft = getDaysRemaining(row.probationEnd);
              const totalDays = 365; // Assuming 1 year probation
              const progress = Math.min(100, Math.max(0, ((totalDays - daysLeft) / totalDays) * 100));

              return (
                <TableRow key={row.id}>
                  <TableCell fontWeight="bold">{row.name}</TableCell>
                  <TableCell>{row.dept}</TableCell>
                  <TableCell>
                    {row.probationEnd}
                  </TableCell>
                  <TableCell sx={{ minWidth: 150 }}>
                    <Box display="flex" justifyContent="space-between" mb={0.5}>
                      <Typography variant="caption" color={daysLeft < 0 ? "error" : "textSecondary"}>
                        {daysLeft < 0 ? `${Math.abs(daysLeft)} days Overdue` : `${daysLeft} days left`}
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" value={progress} 
                      color={daysLeft < 30 ? "warning" : "primary"} 
                      sx={{ height: 6, borderRadius: 3 }}
                    />
                  </TableCell>
                  <TableCell>
                    <Tooltip title={`Attendance: ${row.attendance}% | Feedback: ${row.feedback}/5`}>
                      <Chip label="View Metrics" size="small" variant="outlined" icon={<School />} />
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={row.status} size="small" 
                      color={row.status === 'Confirmed' ? 'success' : row.status === 'Overdue' ? 'error' : row.status === 'Due Soon' ? 'warning' : 'primary'} 
                    />
                  </TableCell>
                  <TableCell align="right">
                    {row.status === 'Confirmed' ? (
                      <Button size="small" variant="outlined" startIcon={<Print />}>Letter</Button>
                    ) : (
                      <Button 
                        size="small" variant="contained" color="primary"
                        startIcon={<AssignmentInd />}
                        onClick={() => handleOpenReview(row)}
                      >
                        Review
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Card>

      {/* CONFIRMATION REVIEW DIALOG */}
      <Dialog open={openReview} onClose={() => setOpenReview(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Performance Review: {selectedFaculty?.name}</DialogTitle>
        <DialogContent dividers>
          <Alert severity="info" sx={{ mb: 2 }}>
            Review the following criteria before confirming employment.
          </Alert>
          
          <Box mb={2} p={2} bgcolor="grey.50" borderRadius={1}>
            <Typography variant="subtitle2" gutterBottom>Performance Snapshot:</Typography>
            <Grid container spacing={1}>
              <Grid item xs={4}><Typography variant="caption">Attendance</Typography><Typography fontWeight="bold">{selectedFaculty?.attendance}%</Typography></Grid>
              <Grid item xs={4}><Typography variant="caption">Student Feedback</Typography><Typography fontWeight="bold">{selectedFaculty?.feedback}/5.0</Typography></Grid>
              <Grid item xs={4}><Typography variant="caption">Research</Typography><Typography fontWeight="bold">{selectedFaculty?.research}</Typography></Grid>
            </Grid>
          </Box>

          <Typography variant="subtitle2" gutterBottom>Confirmation Checklist</Typography>
          <Box display="flex" flexDirection="column">
            <FormControlLabel 
              control={<Checkbox checked={checklist.attendance} onChange={(e) => setChecklist({...checklist, attendance: e.target.checked})} />} 
              label="Attendance Requirement Met (>85%)" 
            />
            <FormControlLabel 
              control={<Checkbox checked={checklist.feedback} onChange={(e) => setChecklist({...checklist, feedback: e.target.checked})} />} 
              label="Satisfactory Teaching Feedback (>4.0)" 
            />
            <FormControlLabel 
              control={<Checkbox checked={checklist.research} onChange={(e) => setChecklist({...checklist, research: e.target.checked})} />} 
              label="Research Output / Publications Verified" 
            />
            <FormControlLabel 
              control={<Checkbox checked={checklist.disciplinary} onChange={(e) => setChecklist({...checklist, disciplinary: e.target.checked})} />} 
              label="No Disciplinary Actions Pending" 
            />
          </Box>
          
          <TextField 
            fullWidth label="Admin Remarks / Extension Reason" multiline rows={2} 
            sx={{ mt: 2 }} value={remarks} onChange={(e) => setRemarks(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleExtendProbation} color="warning">Extend Probation</Button>
          <Button 
            onClick={handleConfirmEmployment} 
            variant="contained" color="success" startIcon={<CheckCircle />}
            disabled={!Object.values(checklist).every(Boolean)}
          >
            Confirm & Generate Letter
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProbationView;