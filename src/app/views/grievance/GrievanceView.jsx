import React, { useState } from 'react';
import { 
  Box, Typography, Card, TextField, Button, Switch, 
  FormControlLabel, Alert, Stepper, Step, StepLabel, Grid, 
  MenuItem, Chip, Tabs, Tab, Rating, Divider, Stack 
} from "@mui/material";
import { 
  ReportProblem, History, AccessTime, TrendingUp, 
  ThumbUp, VisibilityOff 
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

import useGrievanceSystem from "../../hooks/useGrievanceSystem";

const GrievanceView = () => {
  const theme = useTheme();
  const { 
    categories, activeTicket, history, 
    submitGrievance, escalateGrievance, submitRating 
  } = useGrievanceSystem();

  const [tabIndex, setTabIndex] = useState(0);
  
  // Form State
  const [anonymous, setAnonymous] = useState(false);
  const [category, setCategory] = useState("");
  const [subject, setSubject] = useState("");
  const [desc, setDesc] = useState("");

  const handleSubmit = () => {
    if (!category || !subject || !desc) return alert("Please fill all fields");
    submitGrievance({ anonymous, category, subject, desc });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>Grievance Redressal Portal</Typography>

      <Card elevation={3} sx={{ minHeight: 600 }}>
        <Tabs 
          value={tabIndex} 
          onChange={(e, v) => setTabIndex(v)} 
          sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'grey.50' }}
        >
          <Tab icon={<ReportProblem />} label="Lodge & Track" iconPosition="start" />
          <Tab icon={<History />} label="My History" iconPosition="start" />
        </Tabs>

        <Box p={4}>
          {/* TAB 0: LODGE & TRACK */}
          {tabIndex === 0 && (
            <Grid container spacing={4}>
              {/* Left Col: Submission Form */}
              <Grid item xs={12} md={7}>
                <Typography variant="h6" gutterBottom>Lodge New Complaint</Typography>
                <Alert severity="info" sx={{ mb: 3 }}>
                  Strict confidentiality is maintained. Anonymous complaints are routed to the Ombudsman directly.
                </Alert>
                
                <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Card variant="outlined" sx={{ p: 2, bgcolor: anonymous ? 'grey.100' : 'transparent', transition: '0.3s' }}>
                    <FormControlLabel
                      control={<Switch checked={anonymous} onChange={(e) => setAnonymous(e.target.checked)} />}
                      label={
                        <Box display="flex" alignItems="center" gap={1}>
                           <VisibilityOff fontSize="small" />
                           <Typography fontWeight="medium">Submit Anonymously</Typography>
                        </Box>
                      }
                    />
                    {anonymous && (
                      <Typography variant="caption" display="block" color="text.secondary" mt={1}>
                        * Your Employee ID and Name will be hidden from the database record.
                      </Typography>
                    )}
                  </Card>

                  {!anonymous && (
                     <TextField label="Your Name" defaultValue="Dr. Naveen Kumar" disabled variant="filled" fullWidth />
                  )}
                  
                  <TextField 
                    select 
                    label="Grievance Category" 
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    fullWidth
                  >
                    {categories.map((cat) => (
                      <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                    ))}
                  </TextField>

                  <TextField 
                    label="Subject" 
                    value={subject} 
                    onChange={(e) => setSubject(e.target.value)} 
                    fullWidth 
                  />
                  
                  <TextField 
                    label="Detailed Description" 
                    multiline 
                    rows={4} 
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                    fullWidth 
                    placeholder="Describe the incident, dates, and people involved..."
                  />
                  
                  <Button variant="contained" color="error" size="large" onClick={handleSubmit}>
                    Submit Grievance
                  </Button>
                </Box>
              </Grid>

              {/* Right Col: Active Tracker */}
              <Grid item xs={12} md={5}>
                 <Card elevation={0} variant="outlined" sx={{ p: 0, height: '100%', overflow: 'hidden' }}>
                    <Box sx={{ p: 2, bgcolor: 'white', color: 'white' }}>
                      <Typography variant="subtitle2">ACTIVE TICKET</Typography>
                      <Typography variant="h6" fontWeight="bold">#{activeTicket.id}</Typography>
                      <Typography variant="caption" sx={{ opacity: 0.9 }}>
                        Expected Resolution: {activeTicket.slaDate}
                      </Typography>
                    </Box>
                    
                    <Box p={3}>
                       <Chip label={activeTicket.category} size="small" sx={{ mb: 2 }} />
                       <Typography variant="subtitle1" fontWeight="bold">{activeTicket.subject}</Typography>
                       <Typography variant="body2" color="text.secondary" paragraph>
                         Status: {activeTicket.status}
                       </Typography>

                       <Stepper activeStep={activeTicket.step} orientation="vertical" sx={{ mb: 3 }}>
                          <Step><StepLabel>Submitted ({activeTicket.date})</StepLabel></Step>
                          <Step><StepLabel>Under Review</StepLabel></Step>
                          <Step><StepLabel>Resolution Proposed</StepLabel></Step>
                          <Step><StepLabel>Closed</StepLabel></Step>
                       </Stepper>
                       
                       <Divider sx={{ mb: 2 }} />
                       
                       <Box display="flex" alignItems="center" gap={1} mb={1}>
                          <AccessTime color="action" fontSize="small" />
                          <Typography variant="body2" color="text.secondary">SLA: 15 Days Policy</Typography>
                       </Box>
                       
                       {/* Escalation Button (Demo: Always active for visualization) */}
                       <Button 
                         variant="outlined" 
                         color="warning" 
                         fullWidth 
                         startIcon={<TrendingUp />}
                         onClick={() => escalateGrievance(activeTicket.id)}
                       >
                         Escalate to Higher Authority
                       </Button>
                       <Typography variant="caption" color="text.secondary" display="block" textAlign="center" mt={1}>
                         (Use if no response by {activeTicket.slaDate})
                       </Typography>
                    </Box>
                 </Card>
              </Grid>
            </Grid>
          )}

          {/* TAB 1: HISTORY */}
          {tabIndex === 1 && (
            <Stack spacing={2}>
               {history.map((ticket) => (
                 <Card key={ticket.id} variant="outlined" sx={{ p: 2 }}>
                    <Grid container spacing={2} alignItems="center">
                       <Grid item xs={12} md={8}>
                          <Box display="flex" alignItems="center" gap={2} mb={1}>
                            <Typography variant="subtitle1" fontWeight="bold">{ticket.subject}</Typography>
                            {ticket.isAnonymous && (
                              <Chip icon={<VisibilityOff />} label="Anonymous" size="small" />
                            )}
                            <Chip label={ticket.status} color="success" size="small" variant="outlined" />
                          </Box>
                          <Typography variant="body2" color="text.secondary">
                            ID: {ticket.id} • {ticket.date} • {ticket.category}
                          </Typography>
                          <Box mt={1} p={1} bgcolor="grey.50" borderRadius={1}>
                            <Typography variant="body2"><strong>Resolution:</strong> {ticket.resolution}</Typography>
                          </Box>
                       </Grid>
                       
                       <Grid item xs={12} md={4} textAlign={{ xs: 'left', md: 'center' }}>
                          <Typography variant="caption" display="block" gutterBottom>
                            Rate Resolution Process
                          </Typography>
                          <Rating 
                            value={ticket.rating} 
                            onChange={(event, newValue) => submitRating(ticket.id, newValue)}
                          />
                          {ticket.rating > 0 && (
                            <Typography variant="caption" display="block" color="success.main" fontWeight="bold">
                              Thank you for feedback!
                            </Typography>
                          )}
                       </Grid>
                    </Grid>
                 </Card>
               ))}
               
               {history.length === 0 && (
                 <Box textAlign="center" py={5}>
                   <ThumbUp color="disabled" sx={{ fontSize: 60, mb: 2 }} />
                   <Typography color="text.secondary">No past grievances found.</Typography>
                 </Box>
               )}
            </Stack>
          )}
        </Box>
      </Card>
    </Box>
  );
};

export default GrievanceView;