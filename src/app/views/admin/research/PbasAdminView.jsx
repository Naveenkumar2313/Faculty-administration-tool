import React, { useState } from "react";
import { 
  Box, Card, Grid, Typography, Button, TextField, MenuItem, 
  Tabs, Tab, Table, TableBody, TableCell, TableHead, TableRow, 
  Chip, IconButton, Tooltip, Dialog, DialogTitle, DialogContent, 
  DialogActions, LinearProgress, Divider, Avatar 
} from "@mui/material";
import { 
  Assessment, RateReview, Verified, CloudUpload, 
  Visibility, CheckCircle, Cancel, NotificationsActive, 
  School, AssignmentInd 
} from "@mui/icons-material";
import Description from "@mui/icons-material/Description";

const PbasAdminView = () => {
  const [tabIndex, setTabIndex] = useState(0);
  
  // MOCK DATA: APPRAISAL SUBMISSIONS
  const [submissions, setSubmissions] = useState([
    { id: 1, faculty: "Dr. Sarah Smith", dept: "CSE", date: "2026-01-15", selfScore: 320, hodScore: 310, adminScore: null, status: "Pending Review" },
    { id: 2, faculty: "Prof. Rajan Kumar", dept: "Mech", date: "2026-01-12", selfScore: 450, hodScore: 450, adminScore: 445, status: "Verified" },
    { id: 3, faculty: "Dr. Emily Davis", dept: "Civil", date: "2026-01-20", selfScore: 180, hodScore: 175, adminScore: null, status: "Pending Review" },
  ]);

  // MOCK DATA: ELIGIBILITY LIST (Auto-generated)
  const eligibleFaculty = submissions.filter(s => (s.adminScore || s.hodScore) >= 300);

  // REVIEW DIALOG STATE
  const [openReview, setOpenReview] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [adminInputScore, setAdminInputScore] = useState("");
  const [reviewDocs, setReviewDocs] = useState([
    { id: 1, name: "Teaching Portfolio (Timetable)", status: "Pending" },
    { id: 2, name: "Research Publications Proof", status: "Pending" },
    { id: 3, name: "FDP Certificates", status: "Pending" },
  ]);

  const handleTabChange = (event, newValue) => setTabIndex(newValue);

  // ACTIONS
  const handleOpenReview = (submission) => {
    setSelectedReview(submission);
    setAdminInputScore(submission.hodScore); // Default to HOD score
    setReviewDocs(reviewDocs.map(d => ({ ...d, status: "Pending" }))); // Reset for demo
    setOpenReview(true);
  };

  const handleDocAction = (id, status) => {
    setReviewDocs(reviewDocs.map(d => d.id === id ? { ...d, status } : d));
  };

  const handleSubmitScore = () => {
    setSubmissions(submissions.map(s => 
      s.id === selectedReview.id 
        ? { ...s, adminScore: parseInt(adminInputScore), status: "Verified" } 
        : s
    ));
    setOpenReview(false);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
        PBAS & Appraisal Management
      </Typography>

      <Card sx={{ minHeight: 500 }}>
        <Tabs 
          value={tabIndex} 
          onChange={handleTabChange} 
          sx={{ borderBottom: 1, borderColor: 'divider', px: 2, bgcolor: 'background.paper' }}
        >
          <Tab icon={<Assessment />} iconPosition="start" label="Appraisal Cycle Setup" />
          <Tab icon={<RateReview />} iconPosition="start" label="Submission Review" />
          <Tab icon={<Verified />} iconPosition="start" label="Promotion Eligibility (CAS)" />
        </Tabs>

        <Box sx={{ p: 3 }}>
          {/* =================================================================
              TAB 1: APPRAISAL CYCLE SETUP
          ================================================================= */}
          {tabIndex === 0 && (
            <Grid container spacing={3} justifyContent="center">
              <Grid item xs={12} md={8} lg={6}>
                <Card variant="outlined" sx={{ p: 4, textAlign: 'center' }}>
                  <AssignmentInd sx={{ fontSize: 60, color: 'white', mb: 2 }} />
                  <Typography variant="h6" gutterBottom>Start New Appraisal Cycle</Typography>
                  <Typography variant="body2" color="text.secondary" mb={4}>
                    Define the academic year and set the deadline. This will trigger email notifications to all eligible faculty members to submit their PBAS forms.
                  </Typography>

                  <Grid container spacing={2} sx={{ textAlign: 'left' }}>
                    <Grid item xs={12}>
                      <TextField select fullWidth label="Academic Year" defaultValue="2025-26">
                        <MenuItem value="2024-25">2024-25</MenuItem>
                        <MenuItem value="2025-26">2025-26</MenuItem>
                      </TextField>
                    </Grid>
                    <Grid item xs={12}>
                      <TextField type="date" fullWidth label="Submission Deadline" InputLabelProps={{ shrink: true }} />
                    </Grid>
                    <Grid item xs={12}>
                      <Button variant="contained" size="large" fullWidth startIcon={<NotificationsActive />}>
                        Start Cycle & Notify Faculty
                      </Button>
                    </Grid>
                  </Grid>
                </Card>
              </Grid>
            </Grid>
          )}

          {/* =================================================================
              TAB 2: SUBMISSION REVIEW
          ================================================================= */}
          {tabIndex === 1 && (
            <Box>
              <Typography variant="h6" gutterBottom>Pending Appraisals</Typography>
              <Table>
                <TableHead sx={{ bgcolor: 'grey.100' }}>
                  <TableRow>
                    <TableCell>Faculty</TableCell>
                    <TableCell>Department</TableCell>
                    <TableCell>Submission Date</TableCell>
                    <TableCell>Self Score</TableCell>
                    <TableCell>HOD Score</TableCell>
                    <TableCell>Admin Score</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {submissions.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell fontWeight="bold">{row.faculty}</TableCell>
                      <TableCell>{row.dept}</TableCell>
                      <TableCell>{row.date}</TableCell>
                      <TableCell>{row.selfScore}</TableCell>
                      <TableCell>{row.hodScore}</TableCell>
                      <TableCell>
                        {row.adminScore ? (
                          <Typography fontWeight="bold" color="primary">{row.adminScore}</Typography>
                        ) : (
                          <Typography variant="caption" color="text.secondary">--</Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={row.status} size="small" 
                          color={row.status === 'Verified' ? 'success' : 'warning'} 
                        />
                      </TableCell>
                      <TableCell align="right">
                        {row.status === 'Pending Review' && (
                          <Button 
                            variant="contained" size="small" 
                            startIcon={<Visibility />} 
                            onClick={() => handleOpenReview(row)}
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

          {/* =================================================================
              TAB 3: PROMOTION ELIGIBILITY
          ================================================================= */}
          {tabIndex === 2 && (
            <Box>
              <Box display="flex" alignItems="center" gap={2} mb={3}>
                <School color="primary" />
                <Typography variant="h6">CAS Promotion Eligibility List</Typography>
                <Chip label="Criteria: API Score ≥ 300" size="small" variant="outlined" />
              </Box>

              <Table>
                <TableHead sx={{ bgcolor: 'success.light' }}>
                  <TableRow>
                    <TableCell sx={{ color: 'white' }}>Faculty Name</TableCell>
                    <TableCell sx={{ color: 'white' }}>Department</TableCell>
                    <TableCell sx={{ color: 'white' }}>Final API Score</TableCell>
                    <TableCell sx={{ color: 'white' }}>Eligible For</TableCell>
                    <TableCell sx={{ color: 'white' }} align="right">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {eligibleFaculty.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell fontWeight="bold">{row.faculty}</TableCell>
                      <TableCell>{row.dept}</TableCell>
                      <TableCell>
                        <Typography fontWeight="bold" color="success.main">{row.adminScore || row.hodScore}</Typography>
                      </TableCell>
                      <TableCell>Associate Professor (Stage 4)</TableCell>
                      <TableCell align="right">
                        <Button variant="outlined" size="small" color="primary">
                          Initiate CAS Process
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {eligibleFaculty.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} align="center">No faculty meeting the criteria yet.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </Box>
          )}
        </Box>
      </Card>

      {/* REVIEW DIALOG */}
      <Dialog open={openReview} onClose={() => setOpenReview(false)} maxWidth="md" fullWidth>
        <DialogTitle>Verification: {selectedReview?.faculty}</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={3}>
            <Grid item xs={12} md={7}>
              <Typography variant="subtitle2" gutterBottom>Document Verification</Typography>
              {reviewDocs.map((doc) => (
                <Box key={doc.id} display="flex" justifyContent="space-between" alignItems="center" mb={2} p={1} border="1px solid #eee" borderRadius={1}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Description color="action" />
                    <Typography variant="body2">{doc.name}</Typography>
                  </Box>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Button size="small" startIcon={<Visibility />}>View</Button>
                    {doc.status === 'Pending' ? (
                      <>
                        <IconButton size="small" color="success" onClick={() => handleDocAction(doc.id, "Approved")}><CheckCircle /></IconButton>
                        <IconButton size="small" color="error" onClick={() => handleDocAction(doc.id, "Rejected")}><Cancel /></IconButton>
                      </>
                    ) : (
                      <Chip label={doc.status} size="small" color={doc.status === 'Approved' ? 'success' : 'error'} />
                    )}
                  </Box>
                </Box>
              ))}
            </Grid>

            <Grid item xs={12} md={5}>
              <Card variant="outlined" sx={{ p: 2, bgcolor: 'primary.50' }}>
                <Typography variant="subtitle2" gutterBottom>Score Moderation</Typography>
                <Box display="flex" justify="space-between" mb={1}>
                  <Typography variant="caption">Self Score:</Typography>
                  <Typography variant="caption" fontWeight="bold">{selectedReview?.selfScore}</Typography>
                </Box>
                <Box display="flex" justify="space-between" mb={2}>
                  <Typography variant="caption">HOD Recommended:</Typography>
                  <Typography variant="caption" fontWeight="bold">{selectedReview?.hodScore}</Typography>
                </Box>
                
                <TextField 
                  label="Final Admin Score" type="number" fullWidth focused sx={{ bgcolor: 'white' }}
                  value={adminInputScore}
                  onChange={(e) => setAdminInputScore(e.target.value)}
                />
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                  * This score will determine promotion eligibility.
                </Typography>
              </Card>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenReview(false)}>Cancel</Button>
          <Button onClick={handleSubmitScore} variant="contained" color="primary">
            Finalize & Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PbasAdminView;