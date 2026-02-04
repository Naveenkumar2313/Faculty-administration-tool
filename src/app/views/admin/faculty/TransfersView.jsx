import React, { useState } from "react";
import { 
  Box, Card, Grid, Typography, Button, TextField, MenuItem, 
  Tabs, Tab, Table, TableBody, TableCell, TableHead, TableRow, 
  FormControlLabel, Checkbox, Divider, Chip, IconButton,
  InputAdornment, Paper
} from "@mui/material";
import { 
  SwapHoriz, ExitToApp, Calculate, Print, CheckCircle, 
  Cancel, Description, AssignmentReturned, Person
} from "@mui/icons-material";

const TransfersView = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [selectedFaculty, setSelectedFaculty] = useState("");
  const [exitFaculty, setExitFaculty] = useState(null); // For Settlement Modal/View

  // Settlement State
  const [basicPay, setBasicPay] = useState(0);
  const [yearsService, setYearsService] = useState(0);
  const [leaveBalance, setLeaveBalance] = useState(0);
  const [settlement, setSettlement] = useState({ gratuity: 0, leaveEncash: 0, total: 0 });

  const handleTabChange = (event, newValue) => setTabIndex(newValue);

  // Mock Data
  const facultyList = [
    { id: 1, name: "Dr. Sarah Smith", dept: "Computer Science", manager: "Prof. K. Rao", joinDate: "2015-06-01" },
    { id: 2, name: "Prof. Rajan Kumar", dept: "Mechanical", manager: "Dr. A. Singh", joinDate: "2010-08-15" },
    { id: 3, name: "Dr. Emily Davis", dept: "Civil Engg", manager: "Prof. M. Ali", joinDate: "2018-01-20" },
  ];

  const exitRequests = [
    { id: 2, name: "Prof. Rajan Kumar", type: "Retirement", date: "2026-05-31", status: "Processing" },
    { id: 4, name: "Mr. John Doe", type: "Resignation", date: "2026-03-15", status: "Pending" },
  ];

  const departments = ["Computer Science", "Mechanical", "Civil Engg", "Electrical", "Admin Office"];

  // Calculator Logic
  const calculateSettlement = () => {
    // Basic Gratuity Rule: (15 days * Last Drawn Basic * Years) / 26
    const gratuity = Math.round(((15 * basicPay * yearsService) / 26));
    
    // Leave Encashment: (Basic / 30) * Leave Balance
    const encashment = Math.round((basicPay / 30) * leaveBalance);

    setSettlement({
      gratuity: gratuity,
      leaveEncash: encashment,
      total: gratuity + encashment
    });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
        Transfer & Separation Management
      </Typography>

      <Card sx={{ minHeight: 500 }}>
        <Tabs 
          value={tabIndex} 
          onChange={handleTabChange} 
          sx={{ borderBottom: 1, borderColor: 'divider', px: 2, bgcolor: 'background.paper' }}
        >
          <Tab icon={<SwapHoriz />} iconPosition="start" label="Internal Transfers" />
          <Tab icon={<ExitToApp />} iconPosition="start" label="Separation & Exits" />
        </Tabs>

        <Box sx={{ p: 3 }}>
          {/* =================================================================
              TAB 1: INTERNAL TRANSFER
          ================================================================= */}
          {tabIndex === 0 && (
            <Grid container spacing={4}>
              <Grid item xs={12} md={7}>
                <Typography variant="h6" gutterBottom>Initiate Faculty Transfer</Typography>
                <Card variant="outlined" sx={{ p: 3 }}>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <TextField 
                        select fullWidth label="Select Faculty" 
                        value={selectedFaculty} onChange={(e) => setSelectedFaculty(e.target.value)}
                      >
                        {facultyList.map((f) => (
                          <MenuItem key={f.id} value={f.id}>{f.name} ({f.dept})</MenuItem>
                        ))}
                      </TextField>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField fullWidth label="Current Department" value={selectedFaculty ? facultyList.find(f=>f.id===selectedFaculty).dept : ""} disabled />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField fullWidth label="Current Manager" value={selectedFaculty ? facultyList.find(f=>f.id===selectedFaculty).manager : ""} disabled />
                    </Grid>

                    <Grid item xs={12}>
                      <Divider><Chip label="Transfer Details" size="small" /></Divider>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField select fullWidth label="New Department">
                        {departments.map((d) => <MenuItem key={d} value={d}>{d}</MenuItem>)}
                      </TextField>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField select fullWidth label="New Reporting Manager">
                        <MenuItem value="HOD1">Dr. HOD One</MenuItem>
                        <MenuItem value="HOD2">Dr. HOD Two</MenuItem>
                      </TextField>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField type="date" fullWidth label="Effective Date" InputLabelProps={{ shrink: true }} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField select fullWidth label="New Campus Location">
                        <MenuItem value="Main">Main Campus</MenuItem>
                        <MenuItem value="City">City Campus</MenuItem>
                      </TextField>
                    </Grid>

                    <Grid item xs={12}>
                      <Typography variant="subtitle2" fontWeight="bold">Asset Handover Checklist</Typography>
                      <Box display="flex" gap={2} flexWrap="wrap">
                        <FormControlLabel control={<Checkbox />} label="Laptop/Devices" />
                        <FormControlLabel control={<Checkbox />} label="Lab Keys" />
                        <FormControlLabel control={<Checkbox />} label="Library Books" />
                        <FormControlLabel control={<Checkbox />} label="ID Card Re-issue" />
                      </Box>
                    </Grid>

                    <Grid item xs={12}>
                      <Button variant="contained" color="primary" fullWidth startIcon={<SwapHoriz />}>
                        Process Transfer
                      </Button>
                    </Grid>
                  </Grid>
                </Card>
              </Grid>

              <Grid item xs={12} md={5}>
                <Typography variant="h6" gutterBottom>Recent Transfer History</Typography>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Faculty</TableCell>
                      <TableCell>From &rarr; To</TableCell>
                      <TableCell>Date</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>Dr. A. Verma</TableCell>
                      <TableCell>Civil &rarr; Admin</TableCell>
                      <TableCell>Jan 10</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Ms. P. Roy</TableCell>
                      <TableCell>City &rarr; Main</TableCell>
                      <TableCell>Dec 01</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </Grid>
            </Grid>
          )}

          {/* =================================================================
              TAB 2: SEPARATION & EXITS
          ================================================================= */}
          {tabIndex === 1 && (
            <Box>
              {!exitFaculty ? (
                // VIEW 1: LIST OF EXITS
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom>Resignation & Retirement Queue</Typography>
                    <Table sx={{ border: '1px solid #eee' }}>
                      <TableHead sx={{ bgcolor: 'grey.100' }}>
                        <TableRow>
                          <TableCell>Faculty Name</TableCell>
                          <TableCell>Type</TableCell>
                          <TableCell>Last Working Day</TableCell>
                          <TableCell>Clearance Status</TableCell>
                          <TableCell align="right">Action</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {exitRequests.map((row) => (
                          <TableRow key={row.id}>
                            <TableCell fontWeight="bold">{row.name}</TableCell>
                            <TableCell>
                              <Chip 
                                label={row.type} size="small" 
                                color={row.type === 'Retirement' ? 'info' : 'warning'} 
                                variant="outlined" 
                              />
                            </TableCell>
                            <TableCell>{row.date}</TableCell>
                            <TableCell>
                              <Chip label={row.status} color={row.status === 'Processing' ? 'primary' : 'default'} size="small" />
                            </TableCell>
                            <TableCell align="right">
                              <Button 
                                variant="outlined" size="small" 
                                onClick={() => { 
                                  setExitFaculty(row); 
                                  setBasicPay(142000); // Mock default
                                  setYearsService(15); 
                                }}
                              >
                                Process Exit
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Grid>
                </Grid>
              ) : (
                // VIEW 2: EXIT PROCESSING DETAIL
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Button startIcon={<Cancel />} onClick={() => setExitFaculty(null)} sx={{ mb: 2 }}>
                      Back to Queue
                    </Button>
                    <Box display="flex" alignItems="center" gap={2} mb={3}>
                      <Person fontSize="large" color="primary" />
                      <Box>
                        <Typography variant="h5" fontWeight="bold">{exitFaculty.name}</Typography>
                        <Typography variant="body2" color="textSecondary">{exitFaculty.type} Processing</Typography>
                      </Box>
                    </Box>
                  </Grid>

                  {/* LEFT COL: No Dues & Assets */}
                  <Grid item xs={12} md={6}>
                    <Card sx={{ p: 3, mb: 3 }}>
                      <Typography variant="subtitle1" fontWeight="bold" mb={2}>1. No-Dues Clearance</Typography>
                      <Box display="flex" flexDirection="column" gap={1}>
                        <FormControlLabel control={<Checkbox defaultChecked />} label="Library Books Returned" />
                        <FormControlLabel control={<Checkbox defaultChecked />} label="IT Assets (Laptop/Dongle) Returned" />
                        <FormControlLabel control={<Checkbox />} label="Finance (Loans/Advances) Cleared" />
                        <FormControlLabel control={<Checkbox />} label="Admin ID Card & Keys Returned" />
                      </Box>
                      <Divider sx={{ my: 2 }} />
                      <Typography variant="subtitle1" fontWeight="bold" mb={2}>2. Documentation</Typography>
                      <Box display="flex" gap={2}>
                        <Button variant="outlined" startIcon={<AssignmentReturned />}>Exit Interview</Button>
                        <Button variant="outlined" startIcon={<Print />}>No-Dues Cert</Button>
                      </Box>
                    </Card>
                  </Grid>

                  {/* RIGHT COL: Final Settlement Calculator */}
                  <Grid item xs={12} md={6}>
                    <Card sx={{ p: 3, bgcolor: 'primary.50' }}>
                      <Typography variant="subtitle1" fontWeight="bold" mb={2} display="flex" alignItems="center" gap={1}>
                        <Calculate /> Final Settlement Calculator
                      </Typography>
                      
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <TextField 
                            fullWidth label="Last Basic Pay" type="number"
                            value={basicPay} onChange={(e) => setBasicPay(e.target.value)}
                            InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment> }}
                            sx={{ bgcolor: 'white' }} size="small"
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <TextField 
                            fullWidth label="Service Years" type="number"
                            value={yearsService} onChange={(e) => setYearsService(e.target.value)}
                            sx={{ bgcolor: 'white' }} size="small"
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField 
                            fullWidth label="Earned Leave Balance (Days)" type="number"
                            value={leaveBalance} onChange={(e) => setLeaveBalance(e.target.value)}
                            sx={{ bgcolor: 'white' }} size="small"
                          />
                        </Grid>
                        
                        <Grid item xs={12}>
                          <Button variant="contained" fullWidth onClick={calculateSettlement}>Calculate</Button>
                        </Grid>

                        <Grid item xs={12}>
                          <Divider sx={{ my: 1 }} />
                          <Box display="flex" justifyContent="space-between" my={1}>
                            <Typography>Gratuity:</Typography>
                            <Typography fontWeight="bold">₹{settlement.gratuity.toLocaleString()}</Typography>
                          </Box>
                          <Box display="flex" justifyContent="space-between" my={1}>
                            <Typography>Leave Encashment:</Typography>
                            <Typography fontWeight="bold">₹{settlement.leaveEncash.toLocaleString()}</Typography>
                          </Box>
                          <Box display="flex" justifyContent="space-between" mt={2} p={1} bgcolor="success.light" borderRadius={1} color="white">
                            <Typography fontWeight="bold">Total Payable:</Typography>
                            <Typography variant="h6" fontWeight="bold">₹{settlement.total.toLocaleString()}</Typography>
                          </Box>
                        </Grid>
                      </Grid>
                    </Card>

                    <Box mt={3} display="flex" gap={2} justifyContent="flex-end">
                      <Button variant="contained" color="secondary" startIcon={<Description />}>
                        Generate Service Cert
                      </Button>
                      <Button variant="contained" color="success" startIcon={<CheckCircle />}>
                        Finalize & Close
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              )}
            </Box>
          )}
        </Box>
      </Card>
    </Box>
  );
};

export default TransfersView;