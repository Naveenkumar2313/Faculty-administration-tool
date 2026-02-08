import React, { useState } from 'react';
import { 
  Box, Card, Grid, Typography, Button, Stepper, Step, StepLabel, 
  TextField, Table, TableHead, TableBody, TableRow, TableCell, 
  Chip, LinearProgress, Stack, Paper, Alert 
} from "@mui/material";
import { 
  Assessment, UploadFile, VerifiedUser, TrendingUp, School, 
  GroupWork 
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

import useAppraisalSystem from "../../hooks/useAppraisalSystem";

const AppraisalView = () => {
  const theme = useTheme();
  const { 
    cat1, cat2, cat3, documents, 
    calculateTotalAPI, getPromotionStatus 
  } = useAppraisalSystem();

  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    'Teaching & Learning (Cat-I)', 
    'Professional Dev (Cat-II)', 
    'Research & Publications (Cat-III)',
    'Evidence & Submit'
  ];

  const totalScore = calculateTotalAPI();
  const promotion = getPromotionStatus();

  return (
    <Box sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h5" fontWeight="bold">Annual Performance Appraisal (PBAS)</Typography>
          <Typography variant="body2" color="text.secondary">Academic Year 2023-2024</Typography>
        </Box>
      </Box>

      {/* 1. SCORE DASHBOARD (Always Visible) */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 3, bgcolor: 'white', color: 'white' }}>
            <Typography variant="overline" sx={{ opacity: 0.8 }}>TOTAL API SCORE</Typography>
            <Typography variant="h2" fontWeight="bold">{totalScore}</Typography>
            <Typography variant="body2">
              Status: {promotion.eligible ? "Eligible for Promotion" : `Shortfall: ${promotion.shortfall} pts`}
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3, height: '100%' }}>
            <Typography variant="subtitle2" fontWeight="bold" gutterBottom>Category Breakdown</Typography>
            
            <Box mb={2}>
              <Box display="flex" justifyContent="space-between">
                <Typography variant="caption">Teaching (Cat-I)</Typography>
                <Typography variant="caption" fontWeight="bold">{cat1.total} / 100</Typography>
              </Box>
              <LinearProgress variant="determinate" value={cat1.total} color={cat1.total >= 75 ? "success" : "warning"} sx={{ height: 8, borderRadius: 4 }} />
            </Box>

            <Box mb={2}>
              <Box display="flex" justifyContent="space-between">
                <Typography variant="caption">Co-Curricular (Cat-II)</Typography>
                <Typography variant="caption" fontWeight="bold">{cat2.total} / 100</Typography>
              </Box>
              <LinearProgress variant="determinate" value={cat2.total} color="info" sx={{ height: 8, borderRadius: 4 }} />
            </Box>

            <Box>
              <Box display="flex" justifyContent="space-between">
                <Typography variant="caption">Research (Cat-III)</Typography>
                <Typography variant="caption" fontWeight="bold">{cat3.total}</Typography>
              </Box>
              <LinearProgress variant="determinate" value={Math.min((cat3.total/200)*100, 100)} color="secondary" sx={{ height: 8, borderRadius: 4 }} />
            </Box>
          </Card>
        </Grid>
      </Grid>

      {/* 2. MAIN WIZARD */}
      <Card elevation={3} sx={{ minHeight: 600 }}>
        <Box sx={{ p: 3, bgcolor: 'grey.50', borderBottom: 1, borderColor: 'divider' }}>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label) => <Step key={label}><StepLabel>{label}</StepLabel></Step>)}
          </Stepper>
        </Box>

        <Box p={4}>
          {/* STEP 0: CAT-I TEACHING */}
          {activeStep === 0 && (
            <Grid container spacing={4}>
              <Grid item xs={12} md={8}>
                <Typography variant="h6" gutterBottom display="flex" alignItems="center" gap={1}>
                  <School color="primary" /> Teaching & Evaluation
                </Typography>
                <Table size="small" sx={{ border: '1px solid #eee' }}>
                  <TableHead sx={{ bgcolor: 'grey.100' }}>
                    <TableRow>
                      <TableCell>Activity</TableCell>
                      <TableCell align="center">Claimed Count</TableCell>
                      <TableCell align="center">Calculated Score</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>Lectures/Tutorials (Hours)</TableCell>
                      <TableCell align="center"><TextField size="small" type="number" sx={{ width: 80 }} value={cat1.lectures.count} /></TableCell>
                      <TableCell align="center" sx={{ fontWeight: 'bold' }}>{cat1.lectures.points}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Practical/Field Work (Hours)</TableCell>
                      <TableCell align="center"><TextField size="small" type="number" sx={{ width: 80 }} value={cat1.practicals.count} /></TableCell>
                      <TableCell align="center" sx={{ fontWeight: 'bold' }}>{cat1.practicals.points}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Evaluation Duties (Scripts)</TableCell>
                      <TableCell align="center"><TextField size="small" type="number" sx={{ width: 80 }} value="250" /></TableCell>
                      <TableCell align="center" sx={{ fontWeight: 'bold' }}>10</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Students Mentored</TableCell>
                      <TableCell align="center"><TextField size="small" type="number" sx={{ width: 80 }} value={cat1.mentoring.count} /></TableCell>
                      <TableCell align="center" sx={{ fontWeight: 'bold' }}>{cat1.mentoring.points}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </Grid>
              <Grid item xs={12} md={4}>
                <Alert severity="info" sx={{ mb: 2 }}>
                  Minimum 75 points required in Category I for positive appraisal.
                </Alert>
                <Card variant="outlined" sx={{ p: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>Evidence Upload</Typography>
                  <Button variant="outlined" startIcon={<UploadFile />} fullWidth size="small">
                    Attach Time Table
                  </Button>
                  <Button variant="outlined" startIcon={<UploadFile />} fullWidth size="small" sx={{ mt: 1 }}>
                    Attach Exam Duty Cert.
                  </Button>
                </Card>
              </Grid>
            </Grid>
          )}

          {/* STEP 1: CAT-II PROFESSIONAL DEV */}
          {activeStep === 1 && (
            <Box>
              <Typography variant="h6" gutterBottom display="flex" alignItems="center" gap={1}>
                <GroupWork color="info" /> Co-Curricular & Extension
              </Typography>
              <Grid container spacing={2}>
                {[
                  { label: "NSS / NCC Activities", score: cat2.nss.points },
                  { label: "Student Clubs Guided", score: cat2.clubs.points },
                  { label: "Industrial Visits Organized", score: 5 },
                  { label: "Conferences Attended", score: cat2.conferences.points },
                  { label: "FDPs Attended (1 Week+)", score: cat2.fdp.points },
                  { label: "Admin Responsibilities (HOD/Warden)", score: cat2.adminRoles.points },
                ].map((item, i) => (
                  <Grid item xs={12} sm={6} md={4} key={i}>
                    <Card variant="outlined" sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2">{item.label}</Typography>
                      <Chip label={item.score} color="primary" variant="outlined" size="small" />
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}

          {/* STEP 2: CAT-III RESEARCH */}
          {activeStep === 2 && (
            <Box>
              <Typography variant="h6" gutterBottom display="flex" alignItems="center" gap={1}>
                <TrendingUp color="secondary" /> Research Contributions
              </Typography>
              <Table size="small" sx={{ mb: 3 }}>
                <TableHead sx={{ bgcolor: 'secondary.light' }}>
                  <TableRow>
                    <TableCell sx={{ color: 'white' }}>Contribution Type</TableCell>
                    <TableCell align="center" sx={{ color: 'white' }}>Quantity</TableCell>
                    <TableCell align="center" sx={{ color: 'white' }}>Unit Points</TableCell>
                    <TableCell align="center" sx={{ color: 'white' }}>Total Score</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>Research Papers (Scopus/Web of Science)</TableCell>
                    <TableCell align="center">3</TableCell>
                    <TableCell align="center">25</TableCell>
                    <TableCell align="center" fontWeight="bold">75</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Books Authored (International)</TableCell>
                    <TableCell align="center">0</TableCell>
                    <TableCell align="center">30</TableCell>
                    <TableCell align="center" fontWeight="bold">0</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Ph.D. Guidance (Awarded)</TableCell>
                    <TableCell align="center">{cat3.phd.awarded}</TableCell>
                    <TableCell align="center">30</TableCell>
                    <TableCell align="center" fontWeight="bold">30</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Major Research Projects (>30 Lakhs)</TableCell>
                    <TableCell align="center">{cat3.projects.major}</TableCell>
                    <TableCell align="center">20</TableCell>
                    <TableCell align="center" fontWeight="bold">20</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <Button startIcon={<Assessment />} color="secondary">Import from Publications Module</Button>
            </Box>
          )}

          {/* STEP 3: REVIEW & SUBMIT */}
          {activeStep === 3 && (
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>Uploaded Evidences</Typography>
                <Alert severity="warning" sx={{ mb: 3 }}>
                  Please ensure all claims above 10 points are supported by documentary evidence.
                </Alert>
                <Stack spacing={1} mb={3}>
                  {documents.map((doc) => (
                    <Paper key={doc.id} variant="outlined" sx={{ p: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                       <Box display="flex" gap={2} alignItems="center">
                         <Chip label={doc.category} size="small" />
                         <Typography variant="body2">{doc.title}</Typography>
                       </Box>
                       <Chip icon={<VerifiedUser />} label={doc.status} size="small" color={doc.status === 'Verified' ? 'success' : 'default'} />
                    </Paper>
                  ))}
                </Stack>
                <Button variant="outlined" component="label" startIcon={<UploadFile />}>
                  Upload Additional Documents
                  <input hidden accept=".pdf" type="file" />
                </Button>
              </Grid>
            </Grid>
          )}
        </Box>

        {/* FOOTER ACTIONS */}
        <Box sx={{ p: 3, borderTop: 1, borderColor: 'divider', display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button disabled={activeStep === 0} onClick={() => setActiveStep(prev => prev - 1)}>Back</Button>
          {activeStep < 3 ? (
            <Button variant="contained" onClick={() => setActiveStep(prev => prev + 1)}>Next</Button>
          ) : (
            <Button variant="contained" color="success" size="large" onClick={() => alert("Self Appraisal Submitted for HOD Review!")}>
              Final Submit
            </Button>
          )}
        </Box>
      </Card>
    </Box>
  );
};

export default AppraisalView;