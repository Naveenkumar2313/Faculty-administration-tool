import React from "react";
import { 
  Box, Card, Grid, Typography, LinearProgress, Chip, 
  Avatar, Stack, Button, Divider 
} from "@mui/material";
import { AttachMoney, CalendarMonth, CheckCircle, Assignment } from "@mui/icons-material";
import useResearchSystem from "../../hooks/useResearchSystem";

const GrantsView = () => {
  const { grants } = useResearchSystem();

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5" fontWeight="bold" mb={3}>Sponsored Projects & Grants</Typography>

      <Grid container spacing={3}>
        {grants.map((grant) => {
            const percentUsed = (grant.amountReceived / grant.amountSanctioned) * 100;
            
            return (
            <Grid item xs={12} md={6} key={grant.id}>
                <Card sx={{ p: 3, position: 'relative' }}>
                    <Box display="flex" justifyContent="space-between" mb={2}>
                        <Chip label={grant.agency} color="primary" variant="outlined" />
                        <Chip label={grant.status} color={grant.status === 'Ongoing' ? 'success' : 'default'} />
                    </Box>
                    
                    <Typography variant="h6" gutterBottom>{grant.title}</Typography>
                    
                    <Box display="flex" gap={4} my={2}>
                        <Box>
                            <Typography variant="caption" color="text.secondary">Sanctioned Amount</Typography>
                            <Typography variant="h6">₹{(grant.amountSanctioned/100000).toFixed(1)} Lakhs</Typography>
                        </Box>
                        <Box>
                             <Typography variant="caption" color="text.secondary">Duration</Typography>
                             <Typography variant="h6">{grant.duration}</Typography>
                        </Box>
                    </Box>

                    {/* FUND UTILIZATION BAR */}
                    <Box mb={2}>
                         <Box display="flex" justifyContent="space-between">
                            <Typography variant="caption">Funds Received: ₹{grant.amountReceived}</Typography>
                            <Typography variant="caption">{percentUsed}%</Typography>
                         </Box>
                        <LinearProgress variant="determinate" value={percentUsed} sx={{ height: 8, borderRadius: 5, mt: 0.5 }} />
                    </Box>

                    <Divider sx={{ my: 2 }} />
                    
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>Project Milestones:</Typography>
                    <Stack spacing={1}>
                        {grant.milestones.map((m, i) => (
                            <Box key={i} display="flex" alignItems="center" gap={1}>
                                {m.done ? <CheckCircle color="success" fontSize="small" /> : <Assignment color="disabled" fontSize="small" />}
                                <Typography variant="body2" sx={{ textDecoration: m.done ? 'line-through' : 'none', color: m.done ? 'text.secondary' : 'text.primary' }}>
                                    {m.name}
                                </Typography>
                            </Box>
                        ))}
                    </Stack>
                </Card>
            </Grid>
        )})}
      </Grid>
    </Box>
  );
};

export default GrantsView;