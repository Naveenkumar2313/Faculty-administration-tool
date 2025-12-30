import React from 'react';
import { Box, Grid, Card, CardContent, Typography, Button, Stack } from "@mui/material";
import { CalendarMonth, Groups, Description } from '@mui/icons-material';

const MeetingView = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ mb: 3 }}>Committee Meetings</Typography>
      
      <Grid container spacing={3}>
        {/* Upcoming Meeting Card */}
        <Grid item xs={12} md={6}>
          <Card sx={{ borderLeft: '5px solid #1976d2' }} elevation={3}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2} mb={2}>
                <CalendarMonth color="primary" fontSize="large" />
                <Box>
                  <Typography variant="h6">Academic Council</Typography>
                  <Typography variant="body2" color="textSecondary">Tomorrow, 10:00 AM - Conf Room A</Typography>
                </Box>
              </Box>
              <Typography variant="body2" sx={{ mb: 2 }}>
                Agenda: Approval of new syllabus for Batch 2024.
              </Typography>
              <Stack direction="row" spacing={2}>
                <Button variant="contained" size="small">Confirm Presence</Button>
                <Button variant="outlined" size="small">View Agenda</Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Past Minutes Card */}
        <Grid item xs={12} md={6}>
           <Card elevation={3}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2} mb={2}>
                <Description color="action" fontSize="large" />
                <Box>
                  <Typography variant="h6">Department Monthly</Typography>
                  <Typography variant="body2" color="textSecondary">Held on: Oct 05, 2023</Typography>
                </Box>
              </Box>
              <Button startIcon={<Groups />} variant="text" fullWidth sx={{ justifyContent: 'flex-start' }}>
                View Minutes of Meeting (MoM)
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default MeetingView;