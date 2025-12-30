import React, { useState } from "react";
import { 
  Box, Card, Grid, Typography, Button, Chip, CircularProgress, 
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, Avatar 
} from "@mui/material";
import { Laptop, VpnKey, Build, ReportProblem } from "@mui/icons-material";
import useLogisticsSystem from "../../hooks/useLogisticsSystem";

const AssetView = () => {
  const { assets, loading, reportIssue } = useLogisticsSystem();
  const [selectedAsset, setSelectedAsset] = useState(null); // For the "Report Issue" modal
  const [issueText, setIssueText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (loading) return <Box p={5} display="flex" justifyContent="center"><CircularProgress /></Box>;

  const handleReport = async () => {
    setSubmitting(true);
    await reportIssue(selectedAsset.id, issueText);
    setSubmitting(false);
    setSelectedAsset(null);
    setIssueText("");
    alert("Maintenance Ticket Raised Successfully!");
  };

  const getIcon = (type) => {
    if (type === 'Laptop') return <Laptop />;
    if (type === 'Keys') return <VpnKey />;
    return <Build />;
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>My Assets & Inventory</Typography>
      
      <Grid container spacing={3}>
        {assets.map((asset) => (
          <Grid item xs={12} sm={6} md={4} key={asset.id}>
            <Card sx={{ p: 3, position: 'relative', overflow: 'visible' }}>
              <Box display="flex" alignItems="center" gap={2} mb={2}>
                <Avatar sx={{ bgcolor: 'primary.light', color: 'primary.main' }}>
                  {getIcon(asset.type)}
                </Avatar>
                <Box>
                  <Typography variant="h6">{asset.name}</Typography>
                  <Typography variant="caption" color="text.secondary">{asset.serial}</Typography>
                </Box>
              </Box>
              
              <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
                 <Chip 
                   label={asset.status} 
                   color={asset.status === 'Good' ? 'success' : 'error'} 
                   size="small" 
                   variant="outlined" 
                 />
                 <Button 
                   size="small" 
                   color="error" 
                   startIcon={<ReportProblem />}
                   onClick={() => setSelectedAsset(asset)}
                 >
                   Report Issue
                 </Button>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* REPORT ISSUE DIALOG */}
      <Dialog open={Boolean(selectedAsset)} onClose={() => setSelectedAsset(null)} fullWidth maxWidth="sm">
        <DialogTitle>Report Issue: {selectedAsset?.name}</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Describe the problem with this asset. This will create a ticket for the IT/Maintenance department.
          </Typography>
          <TextField
            autoFocus
            margin="dense"
            label="Issue Description"
            fullWidth
            multiline
            rows={4}
            value={issueText}
            onChange={(e) => setIssueText(e.target.value)}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setSelectedAsset(null)}>Cancel</Button>
          <Button variant="contained" color="error" onClick={handleReport} disabled={submitting}>
            {submitting ? "Submitting..." : "Raise Ticket"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AssetView;