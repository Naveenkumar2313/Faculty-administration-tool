import React, { useState } from "react";
import { 
  Box, Card, Grid, Typography, Button, Table, TableBody, TableCell, 
  TableHead, TableRow, Chip, IconButton, Tooltip, Dialog, DialogTitle, 
  DialogContent, DialogActions, TextField, MenuItem, Divider 
} from "@mui/material";
import { 
  Inventory, Add, MoveDown, CheckCircle, Cancel, 
  Visibility, QrCode, UploadFile 
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";

const HiddenInput = styled('input')({ display: 'none' });

const AssetAdminView = () => {
  const [tabIndex, setTabIndex] = useState(0);

  // MOCK DATA: ASSET INVENTORY
  const [assets, setAssets] = useState([
    { id: "AST-001", name: "Dell Latitude 5420", type: "Laptop", sn: "DL-5420-X88", user: "Dr. Sarah Smith", location: "CSE Lab 1", value: 65000, status: "Assigned" },
    { id: "AST-002", name: "Epson Projector", type: "Equipment", sn: "EPS-PROJ-99", user: "Classroom 301", location: "Block A", value: 35000, status: "Active" },
    { id: "AST-003", name: "Lab Chair (Ergo)", type: "Furniture", sn: "FURN-CH-102", user: "Library", location: "Central Lib", value: 4500, status: "Maintenance" },
  ]);

  // MOCK DATA: TRANSFER REQUESTS
  const [transfers, setTransfers] = useState([
    { id: 101, asset: "AST-001 (Laptop)", from: "Dr. Sarah Smith", to: "Prof. Rajan Kumar", date: "2026-02-04", reason: "Faculty Exit", status: "Pending Approval" },
    { id: 102, asset: "AST-005 (Printer)", from: "Admin Office", to: "Exam Cell", date: "2026-02-01", reason: "Relocation", status: "Approved" },
  ]);

  // DIALOG STATES
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [newAsset, setNewAsset] = useState({ name: "", type: "", sn: "", value: "", warranty: "" });

  const [openTransferDialog, setOpenTransferDialog] = useState(false);
  const [selectedTransfer, setSelectedTransfer] = useState(null);

  // ACTIONS
  const handleAddAsset = () => {
    const asset = {
      id: `AST-00${assets.length + 1}`,
      name: newAsset.name,
      type: newAsset.type,
      sn: newAsset.sn,
      user: "Unassigned",
      location: "Store Room",
      value: newAsset.value,
      status: "In Stock"
    };
    setAssets([...assets, asset]);
    setOpenAddDialog(false);
  };

  const handleTransferAction = (id, status) => {
    setTransfers(transfers.map(t => t.id === id ? { ...t, status } : t));
    setOpenTransferDialog(false);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
        Asset Management & Inventory
      </Typography>

      <Card sx={{ minHeight: 500 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 2, bgcolor: 'background.paper' }}>
          <Button 
            startIcon={<Inventory />} 
            sx={{ px: 3, py: 1.5, borderBottom: tabIndex === 0 ? 2 : 0, borderRadius: 0 }}
            color={tabIndex === 0 ? "primary" : "inherit"}
            onClick={() => setTabIndex(0)}
          >
            Asset Inventory
          </Button>
          <Button 
            startIcon={<MoveDown />} 
            sx={{ px: 3, py: 1.5, borderBottom: tabIndex === 1 ? 2 : 0, borderRadius: 0 }}
            color={tabIndex === 1 ? "primary" : "inherit"}
            onClick={() => setTabIndex(1)}
          >
            Transfer Approvals
          </Button>
        </Box>

        <Box sx={{ p: 3 }}>
          {/* =================================================================
              TAB 1: ASSET INVENTORY
          ================================================================= */}
          {tabIndex === 0 && (
            <Box>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h6">Master Asset Register</Typography>
                <Button variant="contained" startIcon={<Add />} onClick={() => setOpenAddDialog(true)}>
                  Add New Asset
                </Button>
              </Box>

              <Table>
                <TableHead sx={{ bgcolor: 'grey.100' }}>
                  <TableRow>
                    <TableCell>Asset ID / S.No</TableCell>
                    <TableCell>Name & Type</TableCell>
                    <TableCell>Current User / Location</TableCell>
                    <TableCell>Value</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {assets.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell>
                        <Typography variant="body2" fontWeight="bold">{row.id}</Typography>
                        <Typography variant="caption" color="textSecondary">{row.sn}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{row.name}</Typography>
                        <Chip label={row.type} size="small" variant="outlined" sx={{ mt: 0.5, fontSize: '0.7rem' }} />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{row.user}</Typography>
                        <Typography variant="caption" color="textSecondary">{row.location}</Typography>
                      </TableCell>
                      <TableCell>₹{row.value.toLocaleString()}</TableCell>
                      <TableCell>
                        <Chip 
                          label={row.status} size="small" 
                          color={row.status === 'Assigned' ? 'primary' : row.status === 'In Stock' ? 'success' : 'warning'} 
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip title="View QR Code">
                          <IconButton size="small"><QrCode /></IconButton>
                        </Tooltip>
                        <Tooltip title="View Details">
                          <IconButton size="small" color="primary"><Visibility /></IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          )}

          {/* =================================================================
              TAB 2: TRANSFER APPROVALS
          ================================================================= */}
          {tabIndex === 1 && (
            <Box>
              <Typography variant="h6" gutterBottom>Asset Transfer Queue</Typography>
              <Table>
                <TableHead sx={{ bgcolor: 'grey.100' }}>
                  <TableRow>
                    <TableCell>Asset</TableCell>
                    <TableCell>Transfer Route (From &rarr; To)</TableCell>
                    <TableCell>Request Date</TableCell>
                    <TableCell>Reason</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {transfers.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell fontWeight="bold">{row.asset}</TableCell>
                      <TableCell>
                        <Typography variant="body2">{row.from} &rarr; <strong>{row.to}</strong></Typography>
                      </TableCell>
                      <TableCell>{row.date}</TableCell>
                      <TableCell>{row.reason}</TableCell>
                      <TableCell>
                        <Chip 
                          label={row.status} size="small" 
                          color={row.status === 'Approved' ? 'success' : 'warning'} 
                        />
                      </TableCell>
                      <TableCell align="right">
                        {row.status === 'Pending Approval' && (
                          <Button 
                            variant="contained" size="small" 
                            onClick={() => { setSelectedTransfer(row); setOpenTransferDialog(true); }}
                          >
                            Review
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          )}
        </Box>
      </Card>

      {/* ADD ASSET DIALOG */}
      <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Register New Asset</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField 
                fullWidth label="Asset Name" size="small" 
                value={newAsset.name} onChange={(e) => setNewAsset({...newAsset, name: e.target.value})}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField 
                select fullWidth label="Asset Type" size="small"
                value={newAsset.type} onChange={(e) => setNewAsset({...newAsset, type: e.target.value})}
              >
                <MenuItem value="Laptop">Laptop / Desktop</MenuItem>
                <MenuItem value="Furniture">Furniture</MenuItem>
                <MenuItem value="Equipment">Lab Equipment</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={6}>
              <TextField 
                fullWidth label="Serial Number" size="small"
                value={newAsset.sn} onChange={(e) => setNewAsset({...newAsset, sn: e.target.value})}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField 
                fullWidth label="Purchase Value (₹)" type="number" size="small"
                value={newAsset.value} onChange={(e) => setNewAsset({...newAsset, value: e.target.value})}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField 
                fullWidth label="Purchase Date" type="date" size="small" InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField 
                fullWidth label="Warranty Expires On" type="date" size="small" InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <Button component="label" variant="outlined" startIcon={<UploadFile />} fullWidth>
                Upload Invoice / PO (PDF)
                <HiddenInput type="file" accept="application/pdf" />
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddDialog(false)}>Cancel</Button>
          <Button onClick={handleAddAsset} variant="contained" color="primary">Register Asset</Button>
        </DialogActions>
      </Dialog>

      {/* TRANSFER APPROVAL DIALOG */}
      <Dialog open={openTransferDialog} onClose={() => setOpenTransferDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Approve Asset Transfer</DialogTitle>
        <DialogContent dividers>
          <Typography variant="subtitle2" gutterBottom>Asset: {selectedTransfer?.asset}</Typography>
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={2} p={2} bgcolor="grey.100" borderRadius={1}>
            <Box>
              <Typography variant="caption" color="textSecondary">Current Owner</Typography>
              <Typography variant="body2" fontWeight="bold">{selectedTransfer?.from}</Typography>
            </Box>
            <MoveDown color="action" />
            <Box textAlign="right">
              <Typography variant="caption" color="textSecondary">New Owner</Typography>
              <Typography variant="body2" fontWeight="bold">{selectedTransfer?.to}</Typography>
            </Box>
          </Box>
          <TextField 
            fullWidth label="Admin Remarks" multiline rows={2} 
            placeholder="e.g. Verified physical condition before handover..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleTransferAction(selectedTransfer.id, "Rejected")} color="error">Reject</Button>
          <Button onClick={() => handleTransferAction(selectedTransfer.id, "Approved")} variant="contained" color="success" startIcon={<CheckCircle />}>
            Approve Transfer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AssetAdminView;