import React, { useState } from 'react';
import { 
  Box, Tabs, Tab, Card, Typography, Button, 
  Grid, TextField, Checkbox, FormControlLabel, Chip 
} from "@mui/material";
import { Work, School, Gavel } from '@mui/icons-material';

const EngagementView = () => {
  const [tabIndex, setTabIndex] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ mb: 3 }}>External Engagement & Portfolio</Typography>
      
      <Card elevation={3}>
        <Tabs 
          value={tabIndex} 
          onChange={handleTabChange} 
          indicatorColor="primary" 
          textColor="primary"
          variant="fullWidth"
        >
          <Tab icon={<Work />} label="Consultancy Projects" />
          <Tab icon={<School />} label="Guest Lectures" />
          <Tab icon={<Gavel />} label="Examiner Duties" />
        </Tabs>
        
        <Box sx={{ p: 4 }}>
          {tabIndex === 0 && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                 <Card variant="outlined" sx={{ p: 2 }}>
                    <Box display="flex" justifyContent="space-between">
                      <Typography variant="h6">Tata Motors Optimization</Typography>
                      <Chip label="Ongoing" color="success" size="small" />
                    </Box>
                    <Typography color="textSecondary" variant="body2" sx={{ mt: 1 }}>
                      Revenue: $12,000 | Share: 70:30
                    </Typography>
                 </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Button variant="contained" fullWidth sx={{ height: '100%' }}>
                  + Register New Consultancy
                </Button>
              </Grid>
            </Grid>
          )}

          {tabIndex === 1 && (
            <Box>
               <Typography variant="h6" gutterBottom>Upcoming Lectures</Typography>
               <Card variant="outlined" sx={{ p: 2, mb: 2, borderLeft: '4px solid #1976d2' }}>
                  <Typography variant="subtitle1" fontWeight="bold">AI in Manufacturing</Typography>
                  <Typography variant="body2">Host: NIT Trichy • Date: Oct 28, 2023</Typography>
               </Card>
            </Box>
          )}

          {tabIndex === 2 && (
             <Box component="form">
                <Typography variant="h6" sx={{ mb: 2 }}>Log Examiner Duty</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth label="Institution Name" variant="outlined" />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                     <TextField fullWidth type="date" label="Date" InputLabelProps={{ shrink: true }} />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControlLabel 
                      control={<Checkbox defaultChecked />} 
                      label="Apply for OD (On-Duty) Leave automatically" 
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button variant="contained" color="primary">Submit Record</Button>
                  </Grid>
                </Grid>
             </Box>
          )}
        </Box>
      </Card>
    </Box>
  );
};

export default EngagementView;