import React, { useState } from "react";
import { 
  Box, Card, Grid, Typography, Button, TextField, 
  Stepper, Step, StepLabel, Paper, Divider
} from "@mui/material";
import { Verified } from "@mui/icons-material";

const AppraisalView = () => {
  const [activeStep, setActiveStep] = useState(0);
  const steps = ['Teaching & Learning', 'Research & Academic', 'Administrative Roles', 'Final Review'];
  
  // Simple State for Score Preview
  const [scores, setScores] = useState({ cat1: 0, cat2: 0, cat3: 0 });

  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5" fontWeight="bold" mb={3}>Annual Performance Appraisal (PBAS)</Typography>
      
      {/* STEPPER NAV */}
      <Card sx={{ p: 3, mb: 4 }}>
        <Stepper activeStep={activeStep}>
            {steps.map((label) => (
                <Step key={label}><StepLabel>{label}</StepLabel></Step>
            ))}
        </Stepper>
      </Card>

      <Grid container spacing={3}>
        {/* LEFT: FORM AREA */}
        <Grid item xs={12} md={8}>
            <Card sx={{ p: 4, minHeight: 400 }}>
                {activeStep === 0 && (
                    <Box>
                        <Typography variant="h6" gutterBottom>Category I: Teaching</Typography>
                        <Typography variant="body2" color="text.secondary" mb={3}>Enter hours spent on lectures, tutorials, and practicals.</Typography>
                        <TextField fullWidth label="Odd Sem: Total Hours Conducted" type="number" sx={{ mb: 2 }} onChange={(e) => setScores({...scores, cat1: Number(e.target.value)/10})} />
                        <TextField fullWidth label="Even Sem: Total Hours Conducted" type="number" sx={{ mb: 2 }} />
                        <TextField fullWidth label="Examination Duties Assigned" type="number" />
                    </Box>
                )}

                {activeStep === 1 && (
                     <Box>
                        <Typography variant="h6" gutterBottom>Category II: Research</Typography>
                        <TextField fullWidth label="Number of Scopus Papers (25 pts each)" type="number" sx={{ mb: 2 }} onChange={(e) => setScores({...scores, cat2: Number(e.target.value)*25})} />
                        <TextField fullWidth label="Number of PhDs Awarded (30 pts each)" type="number" sx={{ mb: 2 }} />
                    </Box>
                )}

                {activeStep === 3 && (
                    <Box textAlign="center" py={5}>
                        <Verified color="success" sx={{ fontSize: 60, mb: 2 }} />
                        <Typography variant="h5">Ready to Submit</Typography>
                        <Typography>Total Calculated API Score: <strong>{scores.cat1 + scores.cat2 + scores.cat3}</strong></Typography>
                    </Box>
                )}

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
                    <Button disabled={activeStep === 0} onClick={handleBack} sx={{ mr: 1 }}>Back</Button>
                    {activeStep < steps.length - 1 ? (
                        <Button variant="contained" onClick={handleNext}>Next Section</Button>
                    ) : (
                        <Button variant="contained" color="success">Submit Final Appraisal</Button>
                    )}
                </Box>
            </Card>
        </Grid>

        {/* RIGHT: SCORECARD PREVIEW */}
        <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 3, bgcolor: 'primary.main', color: 'white' }}>
                <Typography variant="h6" gutterBottom>Live Score Preview</Typography>
                <Box display="flex" justifyContent="space-between" my={1}>
                    <Typography>Cat I (Teaching)</Typography>
                    <Typography fontWeight="bold">{scores.cat1}</Typography>
                </Box>
                <Box display="flex" justifyContent="space-between" my={1}>
                    <Typography>Cat II (Research)</Typography>
                    <Typography fontWeight="bold">{scores.cat2}</Typography>
                </Box>
                <Divider sx={{ bgcolor: 'rgba(255,255,255,0.3)', my: 2 }} />
                <Box display="flex" justifyContent="space-between">
                    <Typography variant="h5">Total API</Typography>
                    <Typography variant="h5" fontWeight="bold">{scores.cat1 + scores.cat2 + scores.cat3}</Typography>
                </Box>
            </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AppraisalView;