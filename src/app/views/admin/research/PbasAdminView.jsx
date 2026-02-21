import React, { useState, useEffect } from "react";
import { 
  Box, Card, Grid, Typography, Button, TextField, MenuItem, 
  Tabs, Tab, Table, TableBody, TableCell, TableHead, TableRow, 
  Chip, IconButton, Tooltip, Dialog, DialogTitle, DialogContent, 
  DialogActions, LinearProgress, Divider, Avatar, Alert, Stack, Checkbox
} from "@mui/material";
import { 
  Assessment, RateReview, Verified, CloudUpload, 
  Visibility, CheckCircle, Cancel, NotificationsActive, 
  School, AssignmentInd, History, FactCheck, Gavel
} from "@mui/icons-material";
import Description from "@mui/icons-material/Description";

const PbasAdminView = () => {
  const [tabIndex, setTabIndex] = useState(1); // Default to review tab
  
  // 1. CYCLE SETUP STATE
  const [isCycleActive, setIsCycleActive] = useState(false);
  const [cycleConfig, setCycleConfig] = useState({ year: "2025-26", deadline: "" });

  // 2. SUBMISSION WORKFLOW STATE
  const [submissions, setSubmissions] = useState([
    { 
      id: 1, faculty: "Dr. Sarah Smith", dept: "CSE", date: "2026-01-15", 
      selfScore: 320, hodScore: 310, adminScore: null, status: "Pending Admin",
      joiningDate: "2018-06-01", currentDesg: "Associate Professor", stage: 3,
      documents: [
        { id: 'd1', name: "Scopus Publications.pdf", type: "Research", verified: false },
        { id: 'd2', name: "Mentorship_Log.xlsx", type: "Teaching", verified: false }
      ]
    },
    { 
      id: 2, faculty: "Prof. Rajan Kumar", dept: "Mech", date: "2026-01-12", 
      selfScore: 450, hodScore: 450, adminScore: 445, status: "Verified",
      joiningDate: "2015-03-10", currentDesg: "Professor", stage: 5,
      documents: []
    }
  ]);

  // 3. ELIGIBILITY ENGINE (Logic based on API scores and Service Years)
  const calculateEligibility = (faculty) => {
    const score = faculty.adminScore || faculty.hodScore;
    const yearsService = new Date().getFullYear() - new Date(faculty.joiningDate).getFullYear();
    
    if (score >= 300 && yearsService >= 5) return { eligible: true, nextStage: `Stage ${faculty.stage + 1}` };
    return { eligible: false, nextStage: "Not yet eligible" };
  };

  // DIALOG STATES
  const [openReview, setOpenReview] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [adminInputScore, setAdminInputScore] = useState("");
  const [activeDocs, setActiveDocs] = useState([]);

  // --- HANDLERS ---

  const handleStartCycle = () => {
    setIsCycleActive(true);
    alert(`Appraisal cycle for ${cycleConfig.year} started. Notifications sent to all faculty.`);
  };

  const handleOpenReview = (submission) => {
    setSelectedReview(submission);
    setAdminInputScore(submission.hodScore);
    setActiveDocs(submission.documents);
    setOpenReview(true);
  };

  const verifyDoc = (docId) => {
    setActiveDocs(activeDocs.map(d => d.id === docId ? { ...d, verified: !d.verified } : d));
  };

  const finalizeVerification = () => {
    const allDocsVerified = activeDocs.every(d => d.verified);
    if (!allDocsVerified) {
      if (!window.confirm("Some documents are unverified. Continue with final score?")) return;
    }

    setSubmissions(submissions.map(s => 
      s.id === selectedReview.id 
        ? { ...s, adminScore: parseInt(adminInputScore), status: "Verified", documents: activeDocs } 
        : s
    ));
    setOpenReview(false);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" fontWeight="bold">PBAS & CAS Performance Management</Typography>
        {isCycleActive && <Chip label="Live Appraisal Cycle" color="success" icon={<NotificationsActive />} />}
      </Box>

      <Card elevation={4}>
        <Tabs 
          value={tabIndex} 
          onChange={(e, v) => setTabIndex(v)} 
          sx={{ borderBottom: 1, borderColor: 'divider', px: 2, bgcolor: 'background.paper' }}
        >
          <Tab icon={<AssignmentInd />} iconPosition="start" label="1. Cycle Setup" />
          <Tab icon={<RateReview />} iconPosition="start" label="2. Verification Hub" />
          <Tab icon={<Verified />} iconPosition="start" label="3. CAS Promotion Board" />
        </Tabs>

        <Box sx={{ p: 3, minHeight: 500 }}>
          {/* TAB 1: CYCLE SETUP */}
          {tabIndex === 0 && (
            <Grid container spacing={3} justifyContent="center">
              <Grid item xs={12} md={6}>
                <Card variant="outlined" sx={{ p: 4, textAlign: 'center', bgcolor: isCycleActive ? 'success.50' : 'inherit' }}>
                  <History sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                  <Typography variant="h6">Appraisal Cycle Management</Typography>
                  <Typography variant="body2" color="textSecondary" mb={4}>
                    Deploy Performance Based Appraisal System (PBAS) forms to faculty.
                  </Typography>

                  <Stack spacing={3}>
                    <TextField 
                      select fullWidth label="Academic Year" value={cycleConfig.year}
                      onChange={(e) => setCycleConfig({...cycleConfig, year: e.target.value})}
                    >
                      <MenuItem value="2025-26">2025-26 (Current)</MenuItem>
                      <MenuItem value="2024-25">2024-25 (Audit)</MenuItem>
                    </TextField>
                    <TextField 
                      type="date" fullWidth label="Faculty Submission Deadline" 
                      InputLabelProps={{ shrink: true }} 
                    />
                    <Button 
                      variant="contained" size="large" fullWidth 
                      disabled={isCycleActive}
                      onClick={handleStartCycle}
                      startIcon={<NotificationsActive />}
                    >
                      {isCycleActive ? "Cycle is Live" : "Initiate Global Submission"}
                    </Button>
                  </Stack>
                </Card>
              </Grid>
            </Grid>
          )}

          {/* TAB 2: VERIFICATION HUB */}
          {tabIndex === 1 && (
            <Box>
              <Alert severity="info" sx={{ mb: 3 }}>
                Reviewing HOD-recommended scores and verifying attached proof of research/teaching.
              </Alert>
              <Table>
                <TableHead sx={{ bgcolor: 'grey.100' }}>
                  <TableRow>
                    <TableCell>Faculty</TableCell>
                    <TableCell>API Score (Self/HOD)</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Verification Proof</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {submissions.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell>
                        <Typography fontWeight="bold">{row.faculty}</Typography>
                        <Typography variant="caption">{row.dept} • Stage {row.stage}</Typography>
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Chip label={`Self: ${row.selfScore}`} size="small" variant="outlined" />
                          <Chip label={`HOD: ${row.hodScore}`} size="small" color="info" />
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={row.status} size="small" 
                          color={row.status === 'Verified' ? 'success' : 'warning'} 
                        />
                      </TableCell>
                      <TableCell>
                        {row.documents.length} Evidence Docs
                      </TableCell>
                      <TableCell align="right">
                        <Button 
                          variant={row.status === 'Verified' ? "outlined" : "contained"} 
                          size="small" 
                          onClick={() => handleOpenReview(row)}
                        >
                          {row.status === 'Verified' ? "View" : "Verify Claims"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          )}

          {/* TAB 3: PROMOTION ELIGIBILITY */}
          {tabIndex === 2 && (
            <Box>
              <Typography variant="h6" gutterBottom display="flex" alignItems="center" gap={1}>
                <Gavel color="primary" /> Career Advancement Scheme (CAS) Registry
              </Typography>
              <Table>
                <TableHead sx={{ bgcolor: 'primary.main' }}>
                  <TableRow>
                    <TableCell sx={{ color: 'white' }}>Faculty Name</TableCell>
                    <TableCell sx={{ color: 'white' }}>Current Level</TableCell>
                    <TableCell sx={{ color: 'white' }}>Service Years</TableCell>
                    <TableCell sx={{ color: 'white' }}>Verified API</TableCell>
                    <TableCell sx={{ color: 'white' }}>Eligibility</TableCell>
                    <TableCell sx={{ color: 'white' }} align="right">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {submissions.filter(s => s.status === 'Verified').map((row) => {
                    const eligibility = calculateEligibility(row);
                    return (
                      <TableRow key={row.id}>
                        <TableCell fontWeight="bold">{row.faculty}</TableCell>
                        <TableCell>{row.currentDesg}</TableCell>
                        <TableCell>{new Date().getFullYear() - new Date(row.joiningDate).getFullYear()} Yrs</TableCell>
                        <TableCell>
                          <Typography fontWeight="bold" color="primary">{row.adminScore}</Typography>
                        </TableCell>
                        <TableCell>
                          {eligibility.eligible ? (
                            <Chip label={`Eligible for ${eligibility.nextStage}`} color="success" />
                          ) : (
                            <Typography variant="caption" color="error">Min. Score/Service not met</Typography>
                          )}
                        </TableCell>
                        <TableCell align="right">
                          <Button 
                            variant="contained" color="secondary" size="small"
                            disabled={!eligibility.eligible}
                          >
                            Initiate CAS Process
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </Box>
          )}
        </Box>
      </Card>

      {/* --- WORKFLOW: VERIFICATION DIALOG --- */}
      <Dialog open={openReview} onClose={() => setOpenReview(false)} maxWidth="md" fullWidth>
        <DialogTitle>Administrative Verification: {selectedReview?.faculty}</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={3}>
            {/* Left: Document Checklist */}
            <Grid item xs={12} md={7}>
              <Typography variant="subtitle2" gutterBottom>Evidence Review (Documents)</Typography>
              {activeDocs.length > 0 ? activeDocs.map((doc) => (
                <Box key={doc.id} mb={2} p={1.5} border="1px solid #eee" borderRadius={1} display="flex" justifyContent="space-between" alignItems="center">
                  <Box display="flex" alignItems="center" gap={1}>
                    <Description color="action" />
                    <Box>
                      <Typography variant="body2" fontWeight="bold">{doc.name}</Typography>
                      <Typography variant="caption" color="textSecondary">{doc.type}</Typography>
                    </Box>
                  </Box>
                  <Box>
                    <IconButton size="small" color="primary"><Visibility /></IconButton>
                    <Checkbox 
                      checked={doc.verified} 
                      onChange={() => verifyDoc(doc.id)}
                      icon={<FactCheck color="disabled" />}
                      checkedIcon={<CheckCircle color="success" />}
                    />
                  </Box>
                </Box>
              )) : <Typography color="textSecondary">No documents submitted.</Typography>}
            </Grid>

            {/* Right: Score Moderation */}
            <Grid item xs={12} md={5}>
              <Card variant="outlined" sx={{ p: 2, bgcolor: 'primary.50' }}>
                <Typography variant="subtitle2" gutterBottom>Final Score Moderation</Typography>
                <Stack spacing={2} mt={2}>
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="caption">HOD Recommended:</Typography>
                    <Typography variant="body2" fontWeight="bold">{selectedReview?.hodScore}</Typography>
                  </Box>
                  <TextField 
                    label="Final API Score" type="number" fullWidth focused sx={{ bgcolor: 'white' }}
                    value={adminInputScore}
                    onChange={(e) => setAdminInputScore(e.target.value)}
                    helperText="This value will be used for CAS Promotion criteria."
                  />
                  <Divider />
                  <TextField multiline rows={3} label="Admin Remarks" placeholder="Reason for score changes..." sx={{ bgcolor: 'white' }} />
                </Stack>
              </Card>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenReview(false)}>Cancel</Button>
          <Button onClick={finalizeVerification} variant="contained" color="primary">
            Finalize & Verify
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PbasAdminView;