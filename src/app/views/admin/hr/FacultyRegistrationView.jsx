import React, { useState, useEffect } from "react";
import { 
  Box, Card, Grid, Typography, Button, TextField, MenuItem, 
  Stepper, Step, StepLabel, Avatar, FormControlLabel, Checkbox, 
  Divider, Paper, Stack, Alert 
} from "@mui/material";
import { 
  PersonAdd, School, Work, Badge, CheckCircle, 
  CloudUpload, Print, Email, ArrowBack, ArrowForward 
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";

const HiddenInput = styled('input')({ display: 'none' });

const FacultyRegistrationView = () => {
  const [activeStep, setActiveStep] = useState(0);
  const steps = ['Personal Details', 'Education & Experience', 'Job & Assets', 'Review & Generate'];

  // FORM STATE
  const [formData, setFormData] = useState({
    // Step 1: Personal
    firstName: "", lastName: "", dob: "", gender: "", email: "", phone: "", photo: null,
    // Step 2: Education & Exp
    degree: "", university: "", year: "", prevOrg: "", prevDesg: "", expYears: "",
    // Step 3: Job & Assets
    dept: "", designation: "", grade: "", joiningDate: "", probation: "12 Months",
    laptop: false, cabin: false, keys: false, idCard: false,
    // Generated
    empId: ""
  });

  // MOCK EMPLOYEE ID GENERATION
  useEffect(() => {
    if (activeStep === 3 && !formData.empId) {
      const year = new Date().getFullYear();
      const rand = Math.floor(1000 + Math.random() * 9000);
      setFormData(prev => ({ ...prev, empId: `FAC-${year}-${rand}` }));
    }
  }, [activeStep]);

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);

  const handlePhotoUpload = (event) => {
    if (event.target.files && event.target.files[0]) {
      setFormData({ ...formData, photo: URL.createObjectURL(event.target.files[0]) });
    }
  };

  const handleFinish = () => {
    // Logic to save data to DB
    alert(`Faculty Registered Successfully! ID: ${formData.empId}`);
    // Reset or Redirect logic here
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
        New Faculty Onboarding
      </Typography>

      <Card sx={{ p: 4, minHeight: 600 }}>
        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 5 }}>
          {steps.map((label) => (
            <Step key={label}><StepLabel>{label}</StepLabel></Step>
          ))}
        </Stepper>

        <Box>
          {/* =================================================================
              STEP 1: PERSONAL DETAILS
          ================================================================= */}
          {activeStep === 0 && (
            <Grid container spacing={3}>
              <Grid item xs={12} display="flex" justifyContent="center" mb={2}>
                <Box textAlign="center">
                  <Avatar 
                    src={formData.photo} 
                    sx={{ width: 100, height: 100, mb: 1, mx: 'auto', border: '1px dashed grey' }} 
                  />
                  <Button component="label" size="small" startIcon={<CloudUpload />}>
                    Upload Photo
                    <HiddenInput type="file" accept="image/*" onChange={handlePhotoUpload} />
                  </Button>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField fullWidth label="First Name" value={formData.firstName} onChange={(e) => handleChange('firstName', e.target.value)} />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField fullWidth label="Last Name" value={formData.lastName} onChange={(e) => handleChange('lastName', e.target.value)} />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField fullWidth type="date" label="Date of Birth" InputLabelProps={{ shrink: true }} value={formData.dob} onChange={(e) => handleChange('dob', e.target.value)} />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField select fullWidth label="Gender" value={formData.gender} onChange={(e) => handleChange('gender', e.target.value)}>
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField fullWidth label="Email Address" type="email" value={formData.email} onChange={(e) => handleChange('email', e.target.value)} />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField fullWidth label="Phone Number" value={formData.phone} onChange={(e) => handleChange('phone', e.target.value)} />
              </Grid>
            </Grid>
          )}

          {/* =================================================================
              STEP 2: EDUCATION & EXPERIENCE
          ================================================================= */}
          {activeStep === 1 && (
            <Grid container spacing={3}>
              <Grid item xs={12}><Typography variant="h6">Academic Qualifications</Typography></Grid>
              <Grid item xs={12} md={6}>
                <TextField fullWidth label="Highest Degree" value={formData.degree} onChange={(e) => handleChange('degree', e.target.value)} />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField fullWidth label="University / Institute" value={formData.university} onChange={(e) => handleChange('university', e.target.value)} />
              </Grid>
              <Grid item xs={12}>
                <Button component="label" variant="outlined" startIcon={<CloudUpload />} fullWidth sx={{ height: 55, borderStyle: 'dashed' }}>
                  Upload Degree Certificates (PDF)
                  <HiddenInput type="file" accept=".pdf" />
                </Button>
              </Grid>
              
              <Grid item xs={12} sx={{ mt: 2 }}><Divider /><Typography variant="h6" sx={{ mt: 2 }}>Experience Details</Typography></Grid>
              <Grid item xs={12} md={6}>
                <TextField fullWidth label="Previous Organization" value={formData.prevOrg} onChange={(e) => handleChange('prevOrg', e.target.value)} />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField fullWidth label="Previous Designation" value={formData.prevDesg} onChange={(e) => handleChange('prevDesg', e.target.value)} />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField fullWidth type="number" label="Total Experience (Years)" value={formData.expYears} onChange={(e) => handleChange('expYears', e.target.value)} />
              </Grid>
            </Grid>
          )}

          {/* =================================================================
              STEP 3: JOB DETAILS & ASSETS
          ================================================================= */}
          {activeStep === 2 && (
            <Grid container spacing={3}>
              <Grid item xs={12}><Typography variant="h6">Position Details</Typography></Grid>
              <Grid item xs={12} md={6}>
                <TextField select fullWidth label="Department" value={formData.dept} onChange={(e) => handleChange('dept', e.target.value)}>
                  <MenuItem value="CSE">Computer Science</MenuItem>
                  <MenuItem value="ECE">Electronics</MenuItem>
                  <MenuItem value="Mech">Mechanical</MenuItem>
                  <MenuItem value="Civil">Civil</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField select fullWidth label="Designation" value={formData.designation} onChange={(e) => handleChange('designation', e.target.value)}>
                  <MenuItem value="Professor">Professor</MenuItem>
                  <MenuItem value="Associate Professor">Associate Professor</MenuItem>
                  <MenuItem value="Assistant Professor">Assistant Professor</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField select fullWidth label="Grade / Pay Scale" value={formData.grade} onChange={(e) => handleChange('grade', e.target.value)}>
                  <MenuItem value="Grade A (Level 14)">Grade A (Level 14)</MenuItem>
                  <MenuItem value="Grade B (Level 12)">Grade B (Level 12)</MenuItem>
                  <MenuItem value="Grade C (Level 10)">Grade C (Level 10)</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField type="date" fullWidth label="Joining Date" InputLabelProps={{ shrink: true }} value={formData.joiningDate} onChange={(e) => handleChange('joiningDate', e.target.value)} />
              </Grid>

              <Grid item xs={12} sx={{ mt: 2 }}><Divider /><Typography variant="h6" sx={{ mt: 2 }}>Initial Asset Assignment</Typography></Grid>
              <Grid item xs={12}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <FormControlLabel control={<Checkbox checked={formData.laptop} onChange={(e) => handleChange('laptop', e.target.checked)} />} label="Laptop" />
                  <FormControlLabel control={<Checkbox checked={formData.cabin} onChange={(e) => handleChange('cabin', e.target.checked)} />} label="Cabin Allocation" />
                  <FormControlLabel control={<Checkbox checked={formData.keys} onChange={(e) => handleChange('keys', e.target.checked)} />} label="Office Keys" />
                  <FormControlLabel control={<Checkbox checked={formData.idCard} onChange={(e) => handleChange('idCard', e.target.checked)} />} label="ID Card Requisition" />
                </Stack>
              </Grid>
            </Grid>
          )}

          {/* =================================================================
              STEP 4: REVIEW & GENERATE
          ================================================================= */}
          {activeStep === 3 && (
            <Box textAlign="center">
              <CheckCircle sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
              <Typography variant="h4" fontWeight="bold">Ready to Onboard!</Typography>
              <Typography color="textSecondary" mb={4}>
                Review the details below. Clicking "Confirm" will generate the appointment letter and employee ID.
              </Typography>

              <Paper variant="outlined" sx={{ p: 3, maxWidth: 600, mx: 'auto', textAlign: 'left', mb: 4, bgcolor: 'primary.50' }}>
                <Grid container spacing={2}>
                  <Grid item xs={6}><Typography variant="caption">Generated Employee ID</Typography><Typography variant="h6" fontWeight="bold" color="primary">{formData.empId}</Typography></Grid>
                  <Grid item xs={6}><Typography variant="caption">Name</Typography><Typography fontWeight="bold">{formData.firstName} {formData.lastName}</Typography></Grid>
                  <Grid item xs={6}><Typography variant="caption">Designation</Typography><Typography fontWeight="bold">{formData.designation}</Typography></Grid>
                  <Grid item xs={6}><Typography variant="caption">Department</Typography><Typography fontWeight="bold">{formData.dept}</Typography></Grid>
                  <Grid item xs={6}><Typography variant="caption">Joining Date</Typography><Typography fontWeight="bold">{formData.joiningDate}</Typography></Grid>
                  <Grid item xs={6}><Typography variant="caption">Pay Scale</Typography><Typography fontWeight="bold">{formData.grade}</Typography></Grid>
                </Grid>
              </Paper>

              <Box display="flex" justifyContent="center" gap={3}>
                <Button variant="outlined" startIcon={<Print />}>Preview Appointment Letter</Button>
                <Button variant="contained" color="success" startIcon={<Email />} onClick={handleFinish}>Confirm & Email Offer</Button>
              </Box>
            </Box>
          )}

          {/* NAVIGATION BUTTONS */}
          <Box display="flex" justifyContent="space-between" mt={5}>
            <Button 
              disabled={activeStep === 0 || activeStep === 3} 
              onClick={handleBack} 
              startIcon={<ArrowBack />}
            >
              Back
            </Button>
            {activeStep < 3 && (
              <Button 
                variant="contained" 
                onClick={handleNext} 
                endIcon={<ArrowForward />}
              >
                Next Step
              </Button>
            )}
          </Box>
        </Box>
      </Card>
    </Box>
  );
};

export default FacultyRegistrationView;