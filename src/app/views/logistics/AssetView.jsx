import React, { useState } from 'react';
import { 
  Box, Card, Grid, Typography, Button, Tabs, Tab, Table, TableBody, 
  TableCell, TableHead, TableRow, Chip, Stack, TextField, MenuItem, 
  IconButton, Alert, Dialog, DialogTitle, DialogContent, DialogActions, 
  LinearProgress, Switch, FormControlLabel
} from "@mui/material";
import { 
  Devices, Chair, Science, DirectionsCar, VpnKey, Inventory, 
  Build, SwapHoriz, CheckCircle, Warning, ContentCopy, Add 
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

import useLogisticsSystem from "../../hooks/useLogisticsSystem";

const AssetView = () => {
  const theme = useTheme();
  const { 
    assets, software, stock, maintenance, 
    requestStock, initiateTransfer, reportIssue 
  } = useLogisticsSystem();

  const [tabIndex, setTabIndex] = useState(0);
  const [verificationMode, setVerificationMode] = useState(false);
  const [verifiedAssets, setVerifiedAssets] = useState([]);

  // Dialog States
  const [openTransfer, setOpenTransfer] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [transferTarget, setTransferTarget] = useState("");

  const handleVerify = (id) => {
    if (!verifiedAssets.includes(id)) {
      setVerifiedAssets([...verifiedAssets, id]);
    }
  };

  const handleTransferSubmit = () => {
    initiateTransfer(selectedAsset.id, transferTarget);
    setOpenTransfer(false);
    setTransferTarget("");
  };

  const getIcon = (type) => {
    switch(type) {
      case 'IT': return <Devices />;
      case 'Furniture': return <Chair />;
      case 'Lab Equipment': return <Science />;
      case 'Vehicle': return <DirectionsCar />;
      default: return <Inventory />;
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" fontWeight="bold">Asset & Inventory Management</Typography>
        <FormControlLabel 
          control={<Switch checked={verificationMode} onChange={(e) => setVerificationMode(e.target.checked)} />} 
          label={<Typography fontWeight="bold" color={verificationMode ? "primary" : "text.secondary"}>Annual Verification Mode</Typography>} 
        />
      </Box>

      {/* 1. VERIFICATION BANNER */}
      {verificationMode && (
        <Alert severity="warning" sx={{ mb: 3 }} action={<Button color="inherit" size="small">Submit Report</Button>}>
          <strong>Action Required:</strong> Please physically verify all assets assigned to you. 
          Progress: {verifiedAssets.length} / {assets.length} Verified.
        </Alert>
      )}

      {/* 2. MAIN TABS */}
      <Card elevation={3} sx={{ minHeight: 600 }}>
        <Tabs 
          value={tabIndex} 
          onChange={(e, v) => setTabIndex(v)} 
          sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'grey.50' }}
        >
          <Tab icon={<Inventory />} label="Fixed Assets" iconPosition="start" />
          <Tab icon={<VpnKey />} label="Software Licenses" iconPosition="start" />
          <Tab icon={<Build />} label="Maintenance & AMC" iconPosition="start" />
          <Tab icon={<SwapHoriz />} label="Stock Register" iconPosition="start" />
        </Tabs>

        <Box p={4}>
          {/* TAB 0: FIXED ASSETS */}
          {tabIndex === 0 && (
            <Grid container spacing={3}>
              {assets.map((asset) => (
                <Grid item xs={12} md={6} key={asset.id}>
                  <Card variant="outlined" sx={{ p: 2, borderLeft: `5px solid ${theme.palette.primary.main}` }}>
                    <Box display="flex" justifyContent="space-between" alignItems="start">
                      <Box display="flex" gap={2}>
                        <Box sx={{ p: 1.5, bgcolor: 'grey.100', borderRadius: 2 }}>
                          {getIcon(asset.type)}
                        </Box>
                        <Box>
                          <Typography variant="subtitle1" fontWeight="bold">{asset.name}</Typography>
                          <Typography variant="caption" display="block">ID: {asset.id}</Typography>
                          <Typography variant="caption" color="text.secondary">Serial: {asset.serial}</Typography>
                        </Box>
                      </Box>
                      <Chip label={asset.status} size="small" color={asset.status === 'Assigned' ? "success" : "warning"} />
                    </Box>
                    
                    <Grid container spacing={2} mt={2}>
                       <Grid item xs={6}>
                         <Typography variant="caption" color="text.secondary">Purchase Date</Typography>
                         <Typography variant="body2">{asset.purchaseDate}</Typography>
                       </Grid>
                       <Grid item xs={6}>
                         <Typography variant="caption" color="text.secondary">Warranty / AMC</Typography>
                         <Typography variant="body2" color={asset.warranty === 'Expired' ? 'error' : 'inherit'}>
                           {asset.warranty}
                         </Typography>
                       </Grid>
                    </Grid>

                    <Stack direction="row" spacing={1} mt={3} justifyContent="flex-end">
                      {verificationMode ? (
                        verifiedAssets.includes(asset.id) ? (
                          <Button startIcon={<CheckCircle />} color="success" disabled>Verified</Button>
                        ) : (
                          <Button variant="contained" size="small" onClick={() => handleVerify(asset.id)}>Confirm Possession</Button>
                        )
                      ) : (
                        <>
                          <Button size="small" startIcon={<Build />} color="error" onClick={() => reportIssue(asset.id, "General Issue")}>Report Issue</Button>
                          <Button 
                            size="small" startIcon={<SwapHoriz />} variant="outlined"
                            onClick={() => { setSelectedAsset(asset); setOpenTransfer(true); }}
                          >
                            Transfer
                          </Button>
                        </>
                      )}
                    </Stack>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}

          {/* TAB 1: SOFTWARE LICENSES */}
          {tabIndex === 1 && (
            <Grid container spacing={3}>
              {software.map((lic) => (
                <Grid item xs={12} md={6} key={lic.id}>
                  <Card variant="outlined" sx={{ p: 3, bgcolor: 'grey.50' }}>
                    <Box display="flex" justifyContent="space-between" mb={2}>
                      <Typography variant="h6" fontWeight="bold">{lic.name}</Typography>
                      <Chip label={lic.version} size="small" color="primary" />
                    </Box>
                    
                    <Box sx={{ p: 2, bgcolor: 'white', border: '1px dashed grey', borderRadius: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                       <Typography variant="body2" fontFamily="monospace">{lic.key}</Typography>
                       <IconButton size="small" onClick={() => navigator.clipboard.writeText(lic.key)}>
                         <ContentCopy fontSize="small" />
                       </IconButton>
                    </Box>

                    <Stack direction="row" justifyContent="space-between" mt={2}>
                       <Typography variant="caption">Valid Till: <strong>{lic.expiry}</strong></Typography>
                       <Typography variant="caption">Type: <strong>{lic.seats}</strong></Typography>
                    </Stack>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}

          {/* TAB 2: MAINTENANCE */}
          {tabIndex === 2 && (
            <Box>
              <Typography variant="h6" gutterBottom>Service & Repair Log</Typography>
              <Table>
                <TableHead sx={{ bgcolor: 'grey.100' }}>
                  <TableRow>
                    <TableCell>Asset ID</TableCell>
                    <TableCell>Issue / Type</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Cost</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {maintenance.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell fontWeight="bold">{log.assetId}</TableCell>
                      <TableCell>
                        {log.type}
                        <Typography variant="caption" display="block" color="text.secondary">{log.desc}</Typography>
                      </TableCell>
                      <TableCell>{log.date}</TableCell>
                      <TableCell>₹{log.cost}</TableCell>
                      <TableCell>
                        <Chip label={log.status} size="small" variant="outlined" />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          )}

          {/* TAB 3: STOCK REGISTER */}
          {tabIndex === 3 && (
            <Grid container spacing={4}>
              <Grid item xs={12} md={8}>
                <Typography variant="h6" gutterBottom>Consumables Assigned</Typography>
                <Table size="small" sx={{ border: '1px solid #eee' }}>
                  <TableHead sx={{ bgcolor: 'grey.100' }}>
                    <TableRow>
                      <TableCell>Item Name</TableCell>
                      <TableCell>Last Issued</TableCell>
                      <TableCell>Qty Issued</TableCell>
                      <TableCell>Est. Remaining</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {stock.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell fontWeight="bold">{item.item}</TableCell>
                        <TableCell>{item.date}</TableCell>
                        <TableCell>{item.issued} {item.unit}</TableCell>
                        <TableCell sx={{ color: item.remaining < 2 ? 'error.main' : 'inherit' }}>
                          {item.remaining} {item.unit}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card variant="outlined" sx={{ p: 2 }}>
                  <Typography variant="subtitle2" fontWeight="bold" gutterBottom display="flex" alignItems="center" gap={1}>
                    <Add fontSize="small" /> Request Stock
                  </Typography>
                  <Stack spacing={2} mt={2}>
                    <TextField label="Item Name" size="small" fullWidth />
                    <TextField label="Quantity Required" type="number" size="small" fullWidth />
                    <Button variant="contained" fullWidth onClick={() => requestStock("Item", 1)}>Submit Request</Button>
                  </Stack>
                </Card>
              </Grid>
            </Grid>
          )}
        </Box>
      </Card>

      {/* TRANSFER DIALOG */}
      <Dialog open={openTransfer} onClose={() => setOpenTransfer(false)}>
        <DialogTitle>Transfer Asset</DialogTitle>
        <DialogContent>
          <Typography variant="body2" gutterBottom>
            Transferring <strong>{selectedAsset?.name}</strong> ({selectedAsset?.id}).
          </Typography>
          <TextField 
            select label="Transfer To (Department/Lab)" fullWidth margin="normal"
            value={transferTarget} onChange={(e) => setTransferTarget(e.target.value)}
          >
            <MenuItem value="Dept. Library">Dept. Library</MenuItem>
            <MenuItem value="Research Lab 2">Research Lab 2</MenuItem>
            <MenuItem value="Admin Office">Admin Office</MenuItem>
          </TextField>
          <TextField 
            label="Condition Report / Remarks" multiline rows={2} fullWidth margin="normal"
            placeholder="E.g., Working condition, charger included..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenTransfer(false)}>Cancel</Button>
          <Button onClick={handleTransferSubmit} variant="contained" color="warning">Initiate Transfer</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AssetView;