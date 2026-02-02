import React, { useState } from 'react';
import { 
  Box, Card, Grid, Typography, Button, Tabs, Tab, TextField, 
  MenuItem, LinearProgress, Stepper, Step, StepLabel, Chip, 
  Stack, Alert, InputAdornment 
} from "@mui/material";
import { LoadingButton } from '@mui/lab';
import { 
  FlightTakeoff, MedicalServices, Wifi, MenuBook, 
  CardMembership, AccountBalance, CloudUpload, 
  Calculate
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

import useFinanceSystem from "../../hooks/useFinanceSystem";

const ReimbursementView = () => {
  const theme = useTheme();
  const { 
    budgets, claims, calculateTADA, submitClaim 
  } = useFinanceSystem();
  
  const [tabIndex, setTabIndex] = useState(0);
  
  // Form State
  const [claimType, setClaimType] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // TA/DA State
  const [tripDistance, setTripDistance] = useState(0);
  const [tripMode, setTripMode] = useState("Car");
  const [tripCity, setTripCity] = useState("Non-Metro");
  const [tadaResult, setTadaResult] = useState(null);

  const quickButtons = [
    { label: "Conference Fee", icon: AccountBalance, color: "#1976d2" },
    { label: "Travel Allowance", icon: FlightTakeoff, color: "#e91e63" },
    { label: "Medical Claim", icon: MedicalServices, color: "#d32f2f" },
    { label: "Internet/Mobile", icon: Wifi, color: "#0288d1" },
    { label: "Book Purchase", icon: MenuBook, color: "#2e7d32" },
    { label: "Membership Fee", icon: CardMembership, color: "#ed6c02" },
  ];

  const handleQuickClaim = (type) => {
    setClaimType(type);
    setTabIndex(2); // Move to New Claim Tab
  };

  const handleTADACalculate = () => {
    const result = calculateTADA(tripDistance, tripMode, tripCity);
    setTadaResult(result);
    setAmount(result.total); // Auto-fill amount
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    await submitClaim({ 
      type: claimType, 
      amount, 
      date: new Date().toLocaleDateString(),
      description 
    });
    setIsSubmitting(false);
    setTabIndex(1); // Move to Tracker Tab
    // Reset Form
    setClaimType(""); setAmount(""); setDescription(""); setTadaResult(null);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>Claims & Reimbursements</Typography>

      <Card elevation={3} sx={{ minHeight: 600 }}>
        <Tabs 
          value={tabIndex} 
          onChange={(e, v) => setTabIndex(v)} 
          sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'grey.50' }}
        >
          <Tab label="Overview" />
          <Tab label="My Claims Tracker" />
          <Tab label="New Claim Submission" />
        </Tabs>

        <Box p={4}>
          {/* TAB 0: OVERVIEW */}
          {tabIndex === 0 && (
            <Grid container spacing={4}>
              {/* Annual Limits */}
              <Grid item xs={12} md={7}>
                <Typography variant="h6" gutterBottom>Annual Budget Utilization</Typography>
                <Stack spacing={3}>
                  {budgets.map((b, i) => (
                    <Box key={i}>
                      <Box display="flex" justifyContent="space-between" mb={0.5}>
                        <Typography variant="subtitle2" fontWeight="bold">{b.category}</Typography>
                        <Typography variant="caption">
                          ₹{b.used.toLocaleString()} / ₹{b.limit.toLocaleString()}
                        </Typography>
                      </Box>
                      <LinearProgress 
                        variant="determinate" 
                        value={(b.used / b.limit) * 100} 
                        color={b.color} 
                        sx={{ height: 10, borderRadius: 5 }} 
                      />
                    </Box>
                  ))}
                </Stack>
              </Grid>

              {/* Quick Buttons */}
              <Grid item xs={12} md={5}>
                <Typography variant="h6" gutterBottom>Quick Claim</Typography>
                <Grid container spacing={2}>
                  {quickButtons.map((btn) => (
                    <Grid item xs={6} key={btn.label}>
                      <Card 
                        variant="outlined" 
                        sx={{ 
                          p: 2, textAlign: 'center', cursor: 'pointer',
                          '&:hover': { bgcolor: 'grey.50', borderColor: btn.color }
                        }}
                        onClick={() => handleQuickClaim(btn.label)}
                      >
                        <btn.icon sx={{ fontSize: 30, color: btn.color, mb: 1 }} />
                        <Typography variant="body2" fontWeight="medium">{btn.label}</Typography>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            </Grid>
          )}

          {/* TAB 1: TRACKER */}
          {tabIndex === 1 && (
             <Stack spacing={3}>
               {claims.map((claim) => (
                 <Card key={claim.id} variant="outlined" sx={{ p: 3 }}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={4}>
                        <Typography variant="subtitle1" fontWeight="bold">{claim.type}</Typography>
                        <Typography variant="h5" color="primary.main" fontWeight="bold">₹{claim.amount.toLocaleString()}</Typography>
                        <Typography variant="caption" color="text.secondary">ID: {claim.id} • {claim.date}</Typography>
                        
                        {claim.status === 'Rejected' && (
                          <Alert severity="error" sx={{ mt: 2 }}>
                             <strong>Reason:</strong> {claim.rejectionReason}
                             <Button size="small" color="error" sx={{ display: 'block', mt: 1 }}>Resubmit Claim</Button>
                          </Alert>
                        )}
                      </Grid>
                      
                      <Grid item xs={12} md={8}>
                        <Stepper activeStep={claim.step} alternativeLabel>
                          <Step>
                            <StepLabel error={claim.status === 'Rejected' && claim.step === 0}>Submitted</StepLabel>
                          </Step>
                          <Step>
                            <StepLabel error={claim.status === 'Rejected' && claim.step === 1}>HOD Approval</StepLabel>
                          </Step>
                          <Step>
                            <StepLabel error={claim.status === 'Rejected' && claim.step === 2}>Finance Check</StepLabel>
                          </Step>
                          <Step><StepLabel>Disbursed</StepLabel></Step>
                        </Stepper>
                        <Box textAlign="center" mt={2}>
                           <Chip 
                             label={claim.status} 
                             color={claim.status === 'Paid' ? 'success' : claim.status === 'Rejected' ? 'error' : 'primary'} 
                             variant="outlined" 
                           />
                        </Box>
                      </Grid>
                    </Grid>
                 </Card>
               ))}
             </Stack>
          )}

          {/* TAB 2: NEW CLAIM FORM */}
          {tabIndex === 2 && (
            <Grid container spacing={4}>
              <Grid item xs={12} md={8}>
                <Typography variant="h6" gutterBottom>Claim Details</Typography>
                <Grid container spacing={3}>
                   <Grid item xs={12} md={6}>
                      <TextField 
                        select label="Expense Type" fullWidth 
                        value={claimType} onChange={(e) => setClaimType(e.target.value)}
                      >
                        {quickButtons.map(b => <MenuItem key={b.label} value={b.label}>{b.label}</MenuItem>)}
                      </TextField>
                   </Grid>
                   <Grid item xs={12} md={6}>
                      <TextField 
                        label="Amount" type="number" fullWidth 
                        value={amount} onChange={(e) => setAmount(e.target.value)}
                        InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment> }}
                      />
                   </Grid>
                   
                   {/* TA/DA CALCULATOR WIDGET (Only if Travel) */}
                   {claimType === 'Travel Allowance' && (
                     <Grid item xs={12}>
                       <Card variant="outlined" sx={{ p: 2, bgcolor: 'blue.50', borderColor: 'blue.200' }}>
                          <Typography variant="subtitle2" fontWeight="bold" display="flex" alignItems="center" gap={1}>
                            <Calculate fontSize="small" /> TA/DA Auto-Calculator
                          </Typography>
                          <Grid container spacing={2} mt={1}>
                             <Grid item xs={4}>
                               <TextField 
                                 label="Distance (km)" size="small" type="number" fullWidth 
                                 value={tripDistance} onChange={(e) => setTripDistance(e.target.value)}
                               />
                             </Grid>
                             <Grid item xs={4}>
                               <TextField 
                                 select label="Mode" size="small" fullWidth 
                                 value={tripMode} onChange={(e) => setTripMode(e.target.value)}
                               >
                                 <MenuItem value="Car">Car (₹12/km)</MenuItem>
                                 <MenuItem value="Bike">Bike (₹6/km)</MenuItem>
                               </TextField>
                             </Grid>
                             <Grid item xs={4}>
                               <TextField 
                                 select label="City" size="small" fullWidth 
                                 value={tripCity} onChange={(e) => setTripCity(e.target.value)}
                               >
                                 <MenuItem value="Metro">Metro</MenuItem>
                                 <MenuItem value="Non-Metro">Non-Metro</MenuItem>
                               </TextField>
                             </Grid>
                             <Grid item xs={12}>
                               <Button size="small" variant="contained" onClick={handleTADACalculate}>Calculate & Apply</Button>
                               {tadaResult && (
                                 <Typography variant="caption" sx={{ ml: 2, fontWeight: 'bold' }}>
                                    Travel: ₹{tadaResult.travelCost} + DA: ₹{tadaResult.da} = Total: ₹{tadaResult.total}
                                 </Typography>
                               )}
                             </Grid>
                          </Grid>
                       </Card>
                     </Grid>
                   )}

                   <Grid item xs={12}>
                      <TextField 
                        label="Justification / Description" multiline rows={3} fullWidth 
                        value={description} onChange={(e) => setDescription(e.target.value)}
                      />
                   </Grid>
                   <Grid item xs={12}>
                      <Box sx={{ border: '1px dashed grey', p: 3, textAlign: 'center', borderRadius: 2 }}>
                         <CloudUpload color="action" />
                         <Typography variant="body2">Drag & Drop Bills Here or Click to Upload</Typography>
                         <Typography variant="caption" color="text.secondary">(Max 5MB, PDF/JPG)</Typography>
                      </Box>
                   </Grid>
                   <Grid item xs={12}>
                      <LoadingButton 
                        loading={isSubmitting}
                        variant="contained" size="large" fullWidth 
                        onClick={handleSubmit}
                        disabled={!claimType || !amount}
                      >
                        Submit Claim
                      </LoadingButton>
                   </Grid>
                </Grid>
              </Grid>

              {/* Sidebar Guide */}
              <Grid item xs={12} md={4}>
                <Alert severity="info" sx={{ mb: 2 }}>
                  Ensure you upload original GST bills. Handwritten bills require HOD countersign.
                </Alert>
                <Card variant="outlined" sx={{ p: 2 }}>
                  <Typography variant="subtitle2" fontWeight="bold">Approver Flow</Typography>
                  <Stepper orientation="vertical" activeStep={-1}>
                     <Step expanded><StepLabel>You (Submit)</StepLabel></Step>
                     <Step expanded><StepLabel>Dr. Ramesh (HOD)</StepLabel></Step>
                     <Step expanded><StepLabel>Finance Dept.</StepLabel></Step>
                  </Stepper>
                </Card>
              </Grid>
            </Grid>
          )}
        </Box>
      </Card>
    </Box>
  );
};

export default ReimbursementView;