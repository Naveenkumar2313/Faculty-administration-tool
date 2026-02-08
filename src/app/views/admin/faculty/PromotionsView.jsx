import React, { useState } from "react";
import { 
  Box, Card, Grid, Typography, Button, TextField, MenuItem, 
  Tabs, Tab, Table, TableBody, TableCell, TableHead, TableRow, 
  IconButton, Chip, InputAdornment 
} from "@mui/material";
import { 
  CloudUpload, Save, Calculate, Print, CheckCircle, 
  Warning, Assignment, FileDownload 
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";

// Styled Components
const HiddenInput = styled('input')({ display: 'none' });

const PromotionsView = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [selectedFaculty, setSelectedFaculty] = useState("");
  const [currentPay, setCurrentPay] = useState(0);
  const [newPay, setNewPay] = useState(0);

  const handleTabChange = (event, newValue) => setTabIndex(newValue);

  // Mock Faculty List
  const facultyList = [
    { id: 1, name: "Dr. Sarah Smith", currentDesg: "Assistant Professor", currentPay: 85000, level: 10, pbas: 120, service: 5 },
    { id: 2, name: "Prof. Rajan Kumar", currentDesg: "Associate Professor", currentPay: 142000, level: 13, pbas: 350, service: 12 },
    { id: 3, name: "Dr. Emily Davis", currentDesg: "Assistant Professor", currentPay: 92000, level: 11, pbas: 95, service: 3 },
  ];

  // Logic: Simple 3% Increment Calculator
  const handleCalculatePay = () => {
    if (currentPay) {
      const increment = currentPay * 0.2;
      setNewPay(Math.round(currentPay + increment));
    }
  };

  const handleFacultyChange = (e) => {
    const fid = e.target.value;
    setSelectedFaculty(fid);
    const fac = facultyList.find(f => f.id === fid);
    if(fac) setCurrentPay(fac.currentPay);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
        Promotion & Increment Management
      </Typography>

      <Card sx={{ mb: 3 }}>
        <Tabs value={tabIndex} onChange={handleTabChange} sx={{ borderBottom: 1, borderColor: 'divider', px: 2 }}>
          <Tab label="Promotion Orders" />
          <Tab label="Annual Increments" />
          <Tab label="CAS Tracker" />
        </Tabs>

        <Box sx={{ p: 3 }}>
          {/* TAB 1: PROMOTION ORDER CREATION */}
          {tabIndex === 0 && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" sx={{ mb: 2 }}>Create New Promotion Order</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField 
                      select fullWidth label="Select Faculty" 
                      value={selectedFaculty} onChange={handleFacultyChange}
                    >
                      {facultyList.map((fac) => (
                        <MenuItem key={fac.id} value={fac.id}>{fac.name} ({fac.currentDesg})</MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField select fullWidth label="New Designation" defaultValue="">
                      <MenuItem value="Sr. Asst. Professor">Sr. Asst. Professor</MenuItem>
                      <MenuItem value="Associate Professor">Associate Professor</MenuItem>
                      <MenuItem value="Professor">Professor</MenuItem>
                    </TextField>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField type="date" fullWidth label="Effective Date" InputLabelProps={{ shrink: true }} />
                  </Grid>
                  
                  {/* Salary Calculator */}
                  <Grid item xs={12}>
                    <Box sx={{ p: 2, bgcolor: 'action.hover', borderRadius: 2 }}>
                      <Typography variant="subtitle2" fontWeight="bold" mb={1}>Salary Revision Calculator</Typography>
                      <Grid container spacing={2} alignItems="center">
                        <Grid item xs={5}>
                          <TextField 
                            fullWidth label="Current Basic" value={currentPay} 
                            InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment> }} 
                          />
                        </Grid>
                        <Grid item xs={2} textAlign="center">
                          <IconButton color="primary" onClick={handleCalculatePay}><Calculate /></IconButton>
                        </Grid>
                        <Grid item xs={5}>
                          <TextField 
                            fullWidth label="New Basic Pay" value={newPay} focused
                            InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment> }} 
                          />
                        </Grid>
                      </Grid>
                    </Box>
                  </Grid>

                  <Grid item xs={12}>
                    <label htmlFor="upload-promotion">
                      <HiddenInput accept="application/pdf" id="upload-promotion" type="file" />
                      <Button variant="outlined" component="span" startIcon={<CloudUpload />} fullWidth>
                        Upload Signed Promotion Order (PDF)
                      </Button>
                    </label>
                  </Grid>

                  <Grid item xs={12}>
                    <Button variant="contained" color="primary" startIcon={<Save />} fullWidth>
                      Generate & Save Order
                    </Button>
                  </Grid>
                </Grid>
              </Grid>

              {/* Recent History */}
              <Grid item xs={12} md={6}>
                <Typography variant="h6" sx={{ mb: 2 }}>Recent Promotion History</Typography>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Faculty</TableCell>
                      <TableCell>To Designation</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>Dr. A. Verma</TableCell>
                      <TableCell>Assoc. Prof</TableCell>
                      <TableCell>Jan 01, 2026</TableCell>
                      <TableCell><Chip label="Active" color="success" size="small" /></TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Prof. K. Singh</TableCell>
                      <TableCell>HOD</TableCell>
                      <TableCell>Dec 15, 2025</TableCell>
                      <TableCell><Chip label="Pending" color="warning" size="small" /></TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </Grid>
            </Grid>
          )}

          {/* TAB 2: ANNUAL INCREMENT PROCESSING */}
          {tabIndex === 1 && (
            <Box>
              <Box display="flex" justifyContent="space-between" mb={3}>
                <Typography variant="h6">Annual Increment Processing (July 2026)</Typography>
                <Box>
                  <Button variant="outlined" startIcon={<FileDownload />} sx={{ mr: 2 }}>
                    Template CSV
                  </Button>
                  <Button variant="contained" color="info" component="label" startIcon={<CloudUpload />}>
                    Upload Increment CSV
                    <HiddenInput type="file" accept=".csv" />
                  </Button>
                </Box>
              </Box>

              <Table sx={{ mb: 3 }}>
                <TableHead sx={{ bgcolor: 'grey.100' }}>
                  <TableRow>
                    <TableCell>Emp ID</TableCell>
                    <TableCell>Faculty Name</TableCell>
                    <TableCell>Current Basic</TableCell>
                    <TableCell>Increment %</TableCell>
                    <TableCell>New Basic</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {facultyList.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell>FAC-{100 + row.id}</TableCell>
                      <TableCell>{row.name}</TableCell>
                      <TableCell>₹{row.currentPay.toLocaleString()}</TableCell>
                      <TableCell>3%</TableCell>
                      <TableCell fontWeight="bold">₹{Math.round(row.currentPay * 1.03).toLocaleString()}</TableCell>
                      <TableCell>
                        <Chip icon={<CheckCircle />} label="Verified" color="success" size="small" variant="outlined" />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <Box display="flex" justifyContent="flex-end" gap={2}>
                <Button variant="outlined" color="secondary" startIcon={<Print />}>
                  Preview Letters
                </Button>
                <Button variant="contained" color="primary" startIcon={<Save />}>
                  Commit Changes
                </Button>
              </Box>
            </Box>
          )}

          {/* TAB 3: CAS TRACKER */}
          {tabIndex === 2 && (
            <Box>
              <Typography variant="h6" sx={{ mb: 2 }}>CAS Eligibility Tracker (Level 10 → 11 → 12)</Typography>
              <Grid container spacing={2} mb={3}>
                <Grid item xs={12} md={3}>
                  <Card sx={{ p: 2, bgcolor: 'primary.light', color: 'white', textAlign: 'center' }}>
                    <Typography variant="h4" fontWeight="bold">5</Typography>
                    <Typography variant="body2">Eligible for Level 11</Typography>
                  </Card>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Card sx={{ p: 2, bgcolor: 'success.light', color: 'success.main', textAlign: 'center' }}>
                    <Typography variant="h4" fontWeight="bold">2</Typography>
                    <Typography variant="body2">Eligible for Level 12</Typography>
                  </Card>
                </Grid>
              </Grid>

              <Table>
                <TableHead sx={{ bgcolor: 'grey.100' }}>
                  <TableRow>
                    <TableCell>Faculty Name</TableCell>
                    <TableCell>Current Level</TableCell>
                    <TableCell>Service Years</TableCell>
                    <TableCell>PBAS Score</TableCell>
                    <TableCell>Eligibility Status</TableCell>
                    <TableCell align="right">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {facultyList.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell>{row.name}</TableCell>
                      <TableCell>Level {row.level}</TableCell>
                      <TableCell>{row.service} Years</TableCell>
                      <TableCell>
                        <Chip label={row.pbas} color={row.pbas > 100 ? "success" : "warning"} size="small" />
                      </TableCell>
                      <TableCell>
                        {row.service >= 4 && row.pbas > 100 ? (
                          <Chip label="Eligible" color="success" size="small" />
                        ) : (
                          <Chip label="In Progress" color="default" size="small" />
                        )}
                      </TableCell>
                      <TableCell align="right">
                        <Button 
                          size="small" variant="outlined" 
                          disabled={!(row.service >= 4 && row.pbas > 100)}
                          startIcon={<Assignment />}
                        >
                          Initiate Review
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          )}
        </Box>
      </Card>
    </Box>
  );
};

export default PromotionsView;