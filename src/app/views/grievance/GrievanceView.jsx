import React from 'react';
import { 
  Box, Typography, Card, TextField, Button, Switch, 
  FormControlLabel, Alert, Stepper, Step, StepLabel, Grid 
} from "@mui/material";

const GrievanceView = () => {
  const [anonymous, setAnonymous] = React.useState(false);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ mb: 3 }}>Grievance Redressal</Typography>

      <Grid container spacing={4}>
        {/* Form */}
        <Grid item xs={12} md={7}>
          <Card elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Submit New Complaint</Typography>
            <Alert severity="info" sx={{ mb: 2 }}>
              Your grievance will be handled by the specialized committee.
            </Alert>
            
            <Box component="form" noValidate autoComplete="off" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <FormControlLabel
                control={<Switch checked={anonymous} onChange={(e) => setAnonymous(e.target.checked)} />}
                label="Submit Anonymously (Hide my ID)"
              />
              
              {!anonymous && (
                 <TextField label="Your Name" defaultValue="Dr. Naveen Kumar" disabled variant="filled" />
              )}
              
              <TextField label="Subject" variant="outlined" fullWidth />
              <TextField 
                label="Description" 
                multiline 
                rows={4} 
                variant="outlined" 
                fullWidth 
                placeholder="Describe the issue in detail..."
              />
              
              <Button variant="contained" color="error" size="large">
                Lodge Grievance
              </Button>
            </Box>
          </Card>
        </Grid>

        {/* Active Ticket Status */}
        <Grid item xs={12} md={5}>
           <Card elevation={3} sx={{ p: 3 }}>
             <Typography variant="h6" gutterBottom>Ticket #GR-992 Status</Typography>
             <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
               Subject: Lab Equipment Safety
             </Typography>
             
             <Stepper activeStep={1} orientation="vertical">
                <Step><StepLabel>Submitted (Oct 20)</StepLabel></Step>
                <Step><StepLabel>Under Review by Committee</StepLabel></Step>
                <Step><StepLabel>Resolution Proposed</StepLabel></Step>
                <Step><StepLabel>Closed</StepLabel></Step>
             </Stepper>
           </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default GrievanceView;