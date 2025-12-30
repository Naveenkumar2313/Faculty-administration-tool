import React from 'react';
import { Box, Typography, Grid, Card, CardContent, LinearProgress, Chip, Button } from "@mui/material";
import { Description, Timer } from '@mui/icons-material';

const LegalView = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ mb: 3 }}>Legal & Contracts</Typography>

      <Grid container spacing={3}>
        {/* Employment Contract */}
        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" mb={2}>
                 <Typography variant="h6">Employment Contract</Typography>
                 <Chip label="Active" color="success" size="small" />
              </Box>
              <Box display="flex" alignItems="center" gap={2} mb={2}>
                <Description fontSize="large" color="action" />
                <Box>
                  <Typography variant="body2">Type: Permanent / Tenure Track</Typography>
                  <Typography variant="caption" color="textSecondary">Signed on: June 20, 2020</Typography>
                </Box>
              </Box>
              <Button size="small" variant="outlined">Request Copy</Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Bond Tracker */}
        <Grid item xs={12} md={6}>
          <Card elevation={3} sx={{ borderLeft: '4px solid orange' }}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                 <Timer color="warning" />
                 <Typography variant="h6">Service Bond Tracking</Typography>
              </Box>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Ph.D. Sponsorship Bond (3 Years)
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Box sx={{ width: '100%', mr: 1 }}>
                  <LinearProgress variant="determinate" value={60} color="warning" />
                </Box>
                <Box sx={{ minWidth: 35 }}>
                  <Typography variant="body2" color="text.secondary">60%</Typography>
                </Box>
              </Box>
              <Typography variant="caption">1 Year 2 Months remaining</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default LegalView;