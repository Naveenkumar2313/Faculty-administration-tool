import React, { useState } from 'react';
import { 
  Box, Card, Grid, Typography, Button, Chip, LinearProgress, 
  Dialog, DialogTitle, DialogContent, DialogActions, Stepper, Step, StepLabel,
  Radio, RadioGroup, FormControlLabel, FormControl, FormLabel,
  TextField, Alert, Stack, Divider, IconButton
} from "@mui/material";
import { 
  Gavel, VerifiedUser, Warning, PlayCircle, Quiz, 
  HistoryEdu, Download, CheckCircle, Close, Fingerprint 
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

import useGovernanceSystem from "../../hooks/useGovernanceSystem";

// Helper to calculate days remaining
const getDaysRemaining = (deadline) => {
  if (!deadline) return 999;
  const diff = new Date(deadline) - new Date();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

const GovernanceView = () => {
  const theme = useTheme();
  const { policies, loading, otpSent, sendOTP, verifyOTP, submitPolicyCompletion } = useGovernanceSystem();

  // Dialog State
  const [open, setOpen] = useState(false);
  const [activePolicy, setActivePolicy] = useState(null);
  const [activeStep, setActiveStep] = useState(0);
  
  // Quiz State
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizError, setQuizError] = useState(false);

  // OTP State
  const [otpInput, setOtpInput] = useState("");

  const handleStartCompliance = (policy) => {
    setActivePolicy(policy);
    setActiveStep(0);
    setQuizAnswers({});
    setOtpInput("");
    setOpen(true);
  };

  const handleNext = () => {
    // Validation Logic for Steps
    if (activeStep === 1 && activePolicy.requiresQuiz) {
      // Validate Quiz
      let passed = true;
      activePolicy.quiz.forEach((q, i) => {
        if (quizAnswers[i] !== q.correct) passed = false;
      });
      
      if (!passed) {
        setQuizError(true);
        return;
      }
      setQuizError(false);
    }
    
    if (activeStep === 2 && !otpInput) {
       // Logic handled in OTP block
       return; 
    }

    setActiveStep((prev) => prev + 1);
  };

  const handleSign = () => {
    if (verifyOTP(otpInput)) {
      submitPolicyCompletion(activePolicy.id, activePolicy.requiresQuiz ? 100 : null);
      setOpen(false);
      // Show success toast here
    } else {
      alert("Invalid OTP");
    }
  };

  // Determine steps based on policy requirements
  const getSteps = () => {
    if (!activePolicy) return [];
    let steps = ['Review Policy'];
    if (activePolicy.requiresVideo) steps.push('Training Video');
    if (activePolicy.requiresQuiz) steps.push('Knowledge Quiz');
    steps.push('Digital Signature');
    return steps;
  };

  const steps = getSteps();

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
        Policies & Compliance Hub
      </Typography>

      {/* 1. POLICY CARDS GRID */}
      <Grid container spacing={3}>
        {policies.map((policy) => {
          const daysLeft = getDaysRemaining(policy.deadline);
          const isUrgent = daysLeft < 7 && policy.status !== 'Compliant' && policy.status !== 'Signed';

          return (
            <Grid item xs={12} md={6} key={policy.id}>
              <Card 
                elevation={3} 
                sx={{ 
                  p: 3, 
                  borderLeft: `5px solid ${policy.status === 'Pending' ? theme.palette.warning.main : theme.palette.success.main}`,
                  position: 'relative'
                }}
              >
                {/* Status Badge */}
                <Box display="flex" justifyContent="space-between" alignItems="start" mb={2}>
                  <Chip 
                    label={policy.category} 
                    size="small" 
                    sx={{ bgcolor: 'grey.100' }} 
                  />
                  {policy.status === 'Compliant' || policy.status === 'Signed' ? (
                     <Chip icon={<VerifiedUser />} label="Compliant" color="success" />
                  ) : (
                     <Chip icon={<Warning />} label={`Due in ${daysLeft} days`} color={isUrgent ? "error" : "warning"} />
                  )}
                </Box>

                <Typography variant="h6" fontWeight="bold">{policy.title}</Typography>
                <Typography variant="caption" color="text.secondary">Version {policy.version} • Updated: {policy.lastUpdated}</Typography>

                {/* Changes Highlight */}
                {policy.changes && policy.status === 'Pending' && (
                  <Alert severity="info" sx={{ mt: 2, py: 0, fontSize: '0.85rem' }}>
                    <strong>New:</strong> {policy.changes}
                  </Alert>
                )}

                {/* Requirements Icons */}
                <Stack direction="row" spacing={1} mt={2} mb={3}>
                  {policy.requiresVideo && (
                    <Chip icon={<PlayCircle />} label="Video Training" size="small" variant="outlined" />
                  )}
                  {policy.requiresQuiz && (
                    <Chip icon={<Quiz />} label="Mandatory Quiz" size="small" variant="outlined" />
                  )}
                </Stack>

                {/* Action Buttons */}
                <Box display="flex" gap={2}>
                  {policy.status === 'Pending' ? (
                    <Button 
                      variant="contained" 
                      fullWidth 
                      onClick={() => handleStartCompliance(policy)}
                    >
                      Start Compliance
                    </Button>
                  ) : (
                    <Button 
                      variant="outlined" 
                      color="success" 
                      fullWidth 
                      startIcon={<Download />}
                      onClick={() => alert("Downloading Certificate...")}
                    >
                      Download Certificate
                    </Button>
                  )}
                </Box>
              </Card>
            </Grid>
          );
        })}
      </Grid>


      {/* 2. COMPLIANCE DIALOG (WIZARD) */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ borderBottom: '1px solid #eee', pb: 2 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            {activePolicy?.title}
            <IconButton onClick={() => setOpen(false)}><Close /></IconButton>
          </Box>
        </DialogTitle>
        
        <DialogContent sx={{ py: 3 }}>
          <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
            {steps.map((label) => <Step key={label}><StepLabel>{label}</StepLabel></Step>)}
          </Stepper>

          {/* STEP 1: READ */}
          {activeStep === 0 && (
            <Box>
               <Typography variant="h6" gutterBottom>Policy Document (v{activePolicy?.version})</Typography>
               <Box sx={{ height: 300, bgcolor: 'grey.50', p: 2, overflowY: 'auto', borderRadius: 2, border: '1px solid #ddd' }}>
                 <Typography paragraph>
                   <strong>1. Purpose:</strong> This policy outlines the guidelines for {activePolicy?.title}...
                 </Typography>
                 <Typography paragraph>
                   <strong>2. Scope:</strong> Applies to all faculty, staff, and students...
                 </Typography>
                 <Typography paragraph>
                   [... Full legal text would be displayed here ...]
                 </Typography>
                 <Typography paragraph color="error">
                   <strong>3. Critical Update:</strong> {activePolicy?.changes || "No major changes."}
                 </Typography>
               </Box>
               <FormControlLabel 
                 control={<Radio checked={true} />} 
                 label="I have read and understood the document entirely." 
                 sx={{ mt: 2 }} 
               />
            </Box>
          )}

          {/* STEP 2: VIDEO (If Required) */}
          {activeStep === 1 && activePolicy?.requiresVideo && (
             <Box textAlign="center">
                <Typography variant="h6" gutterBottom>Mandatory Training Video</Typography>
                <Box sx={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: 2 }}>
                  <iframe 
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                    src={activePolicy.videoUrl} 
                    title="Training Video"
                    allowFullScreen
                  />
                </Box>
                <Typography variant="caption" display="block" mt={1}>
                  Please watch the entire video to proceed.
                </Typography>
             </Box>
          )}

          {/* STEP 3: QUIZ (If Required) */}
          {activeStep === (activePolicy?.requiresVideo ? 2 : 1) && activePolicy?.requiresQuiz && (
             <Box>
                <Typography variant="h6" gutterBottom>Knowledge Check</Typography>
                <Alert severity="info" sx={{ mb: 3 }}>You must answer all questions correctly to proceed.</Alert>
                
                {activePolicy.quiz.map((q, idx) => (
                  <FormControl component="fieldset" key={idx} sx={{ mb: 3, display: 'block' }}>
                    <FormLabel component="legend" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                      {idx + 1}. {q.q}
                    </FormLabel>
                    <RadioGroup 
                      onChange={(e) => setQuizAnswers({ ...quizAnswers, [idx]: parseInt(e.target.value) })}
                    >
                      {q.options.map((opt, optIdx) => (
                        <FormControlLabel key={optIdx} value={optIdx} control={<Radio />} label={opt} />
                      ))}
                    </RadioGroup>
                  </FormControl>
                ))}

                {quizError && <Alert severity="error">Some answers are incorrect. Please try again.</Alert>}
             </Box>
          )}

          {/* STEP 4: SIGNATURE (Final) */}
          {activeStep === steps.length - 1 && (
             <Box textAlign="center" py={2}>
               <Fingerprint sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
               <Typography variant="h5" gutterBottom>Digital Acceptance</Typography>
               <Typography color="text.secondary" paragraph>
                 By signing this, you acknowledge that you have read the policy and agree to abide by the Code of Conduct.
               </Typography>

               {!otpSent ? (
                 <Button variant="contained" size="large" onClick={sendOTP}>
                   Send OTP to Sign
                 </Button>
               ) : (
                 <Box maxWidth={300} mx="auto">
                    <TextField 
                      fullWidth 
                      label="Enter OTP" 
                      placeholder="1234"
                      value={otpInput}
                      onChange={(e) => setOtpInput(e.target.value)}
                      sx={{ mb: 2 }}
                    />
                    <Button variant="contained" color="success" size="large" fullWidth onClick={handleSign}>
                      Verify & Sign
                    </Button>
                    <Button size="small" sx={{ mt: 1 }} onClick={sendOTP}>Resend OTP</Button>
                 </Box>
               )}
             </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 2, borderTop: '1px solid #eee' }}>
          {activeStep < steps.length - 1 && (
            <Button variant="contained" onClick={handleNext}>
              {activeStep === 0 ? "Agree & Continue" : "Next"}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default GovernanceView;