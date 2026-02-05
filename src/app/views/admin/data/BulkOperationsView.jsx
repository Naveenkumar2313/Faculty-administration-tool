import React, { useState } from "react";
import { 
  Box, Card, Grid, Typography, Button, TextField, MenuItem, 
  Tabs, Tab, Table, TableBody, TableCell, TableHead, TableRow, 
  Chip, IconButton, Tooltip, LinearProgress, Divider, Alert, AlertTitle
} from "@mui/material";
import { 
  CloudUpload, FileDownload, Publish, Warning, CheckCircle, 
  Schedule, TableView, Delete, ErrorOutline 
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";

const HiddenInput = styled('input')({ display: 'none' });

const BulkOperationsView = () => {
  const [tabIndex, setTabIndex] = useState(0);
  
  // IMPORT STATE
  const [importType, setImportType] = useState("Faculty"); // Faculty, Attendance, Salary
  const [file, setFile] = useState(null);
  const [uploadStep, setUploadStep] = useState(0); // 0: Select, 1: Validating, 2: Preview
  const [validationStats, setValidationStats] = useState({ valid: 0, invalid: 0, total: 0 });
  
  // EXPORT STATE
  const [exportSource, setExportSource] = useState("Faculty Master");
  const [schedules, setSchedules] = useState([
    { id: 1, report: "Monthly Attendance", frequency: "Monthly (1st)", format: "Excel", recipient: "hr@college.edu" },
    { id: 2, report: "Weekly Asset Status", frequency: "Weekly (Mon)", format: "PDF", recipient: "logistics@college.edu" },
  ]);

  const handleTabChange = (event, newValue) => setTabIndex(newValue);

  // MOCK VALIDATION LOGIC
  const handleFileUpload = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
      setUploadStep(1);
      
      // Simulate processing delay
      setTimeout(() => {
        setUploadStep(2);
        setValidationStats({ valid: 48, invalid: 2, total: 50 });
      }, 1500);
    }
  };

  const handleCommit = () => {
    alert("Data committed to database successfully!");
    setFile(null);
    setUploadStep(0);
  };

  const handleRemoveSchedule = (id) => {
    setSchedules(schedules.filter(s => s.id !== id));
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
        Data Import/Export & Bulk Operations
      </Typography>

      <Card sx={{ minHeight: 500 }}>
        <Tabs 
          value={tabIndex} 
          onChange={handleTabChange} 
          sx={{ borderBottom: 1, borderColor: 'divider', px: 2, bgcolor: 'background.paper' }}
        >
          <Tab icon={<Publish />} iconPosition="start" label="Bulk Import" />
          <Tab icon={<FileDownload />} iconPosition="start" label="Data Export & Schedule" />
        </Tabs>

        <Box sx={{ p: 3 }}>
          {/* =================================================================
              TAB 1: BULK IMPORT
          ================================================================= */}
          {tabIndex === 0 && (
            <Grid container spacing={3}>
              {/* LEFT: UPLOAD CONTROLS */}
              <Grid item xs={12} md={4}>
                <Card variant="outlined" sx={{ p: 3, height: '100%' }}>
                  <Typography variant="h6" gutterBottom>1. Select Import Type</Typography>
                  <TextField 
                    select fullWidth label="Data Category" size="small" sx={{ mb: 3 }}
                    value={importType} onChange={(e) => { setImportType(e.target.value); setFile(null); setUploadStep(0); }}
                  >
                    <MenuItem value="Faculty">Faculty Master Data</MenuItem>
                    <MenuItem value="Attendance">Biometric Attendance (CSV)</MenuItem>
                    <MenuItem value="Salary">Salary Components & Increments</MenuItem>
                  </TextField>

                  <Typography variant="h6" gutterBottom>2. Download Template</Typography>
                  <Button variant="outlined" fullWidth startIcon={<TableView />} sx={{ mb: 3 }}>
                    Download {importType} Template
                  </Button>

                  <Typography variant="h6" gutterBottom>3. Upload File</Typography>
                  <Box 
                    border="2px dashed #ccc" borderRadius={2} p={3} textAlign="center" 
                    bgcolor={file ? "primary.50" : "transparent"}
                    sx={{ cursor: 'pointer', transition: '0.3s', '&:hover': { borderColor: 'primary.main' } }}
                  >
                    <label htmlFor="bulk-upload">
                      <CloudUpload fontSize="large" color={file ? "primary" : "action"} sx={{ mb: 1 }} />
                      <Typography variant="body2" fontWeight="bold">
                        {file ? file.name : "Click to Upload Excel/CSV"}
                      </Typography>
                      <HiddenInput accept=".xlsx, .csv" id="bulk-upload" type="file" onChange={handleFileUpload} />
                    </label>
                  </Box>
                </Card>
              </Grid>

              {/* RIGHT: VALIDATION & PREVIEW */}
              <Grid item xs={12} md={8}>
                {uploadStep === 0 && (
                  <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100%" color="text.secondary">
                    <Publish sx={{ fontSize: 60, mb: 2, opacity: 0.3 }} />
                    <Typography>Select a file to begin the import process.</Typography>
                  </Box>
                )}

                {uploadStep === 1 && (
                  <Box p={5} textAlign="center">
                    <Typography variant="h6" gutterBottom>Validating Data Structure...</Typography>
                    <LinearProgress />
                    <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>Checking constraints, types, and duplicates</Typography>
                  </Box>
                )}

                {uploadStep === 2 && (
                  <Box>
                    <Alert severity={validationStats.invalid > 0 ? "warning" : "success"} sx={{ mb: 3 }}>
                      <AlertTitle>Validation Complete</AlertTitle>
                      Found <strong>{validationStats.valid}</strong> valid records and <strong>{validationStats.invalid}</strong> errors out of {validationStats.total} total rows.
                    </Alert>

                    {validationStats.invalid > 0 && (
                      <Box mb={3}>
                        <Typography variant="subtitle2" color="error" gutterBottom display="flex" alignItems="center" gap={1}>
                          <ErrorOutline fontSize="small" /> Error Report (Invalid Rows)
                        </Typography>
                        <Table size="small" sx={{ border: '1px solid #ffcdd2' }}>
                          <TableHead sx={{ bgcolor: '#ffebee' }}>
                            <TableRow>
                              <TableCell>Row #</TableCell>
                              <TableCell>Emp ID</TableCell>
                              <TableCell>Error Details</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            <TableRow>
                              <TableCell>Row 14</TableCell>
                              <TableCell>FAC-X99</TableCell>
                              <TableCell>Invalid Email Format</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>Row 32</TableCell>
                              <TableCell>FAC-Y10</TableCell>
                              <TableCell>Duplicate Employee ID</TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </Box>
                    )}

                    <Box display="flex" justifyContent="flex-end" gap={2}>
                      <Button onClick={() => { setFile(null); setUploadStep(0); }}>Cancel</Button>
                      <Button 
                        variant="contained" color="success" startIcon={<CheckCircle />} 
                        onClick={handleCommit}
                        disabled={validationStats.invalid > 0} // Optional: block if errors exist
                      >
                        Commit Valid Records
                      </Button>
                    </Box>
                  </Box>
                )}
              </Grid>
            </Grid>
          )}

          {/* =================================================================
              TAB 2: DATA EXPORT & SCHEDULE
          ================================================================= */}
          {tabIndex === 1 && (
            <Grid container spacing={3}>
              {/* LEFT: INSTANT EXPORT */}
              <Grid item xs={12} md={5}>
                <Card variant="outlined" sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>Instant Data Export</Typography>
                  
                  <TextField 
                    select fullWidth label="Select Table / Source" size="small" sx={{ mb: 2 }}
                    value={exportSource} onChange={(e) => setExportSource(e.target.value)}
                  >
                    <MenuItem value="Faculty Master">Faculty Master Table</MenuItem>
                    <MenuItem value="Attendance Logs">Attendance Logs</MenuItem>
                    <MenuItem value="Payroll History">Payroll History</MenuItem>
                    <MenuItem value="Assets Register">Assets Register</MenuItem>
                  </TextField>

                  <Grid container spacing={2} mb={2}>
                    <Grid item xs={6}>
                       <TextField fullWidth type="date" label="From" size="small" InputLabelProps={{ shrink: true }} />
                    </Grid>
                    <Grid item xs={6}>
                       <TextField fullWidth type="date" label="To" size="small" InputLabelProps={{ shrink: true }} />
                    </Grid>
                  </Grid>

                  <Button variant="contained" fullWidth startIcon={<FileDownload />}>
                    Export to Excel
                  </Button>
                </Card>
              </Grid>

              {/* RIGHT: SCHEDULED REPORTS */}
              <Grid item xs={12} md={7}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="h6">Scheduled Auto-Exports</Typography>
                  <Button size="small" startIcon={<Schedule />}>Create New Schedule</Button>
                </Box>
                
                <Table>
                  <TableHead sx={{ bgcolor: 'grey.100' }}>
                    <TableRow>
                      <TableCell>Report Type</TableCell>
                      <TableCell>Frequency</TableCell>
                      <TableCell>Format</TableCell>
                      <TableCell>Recipient</TableCell>
                      <TableCell align="right">Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {schedules.map((row) => (
                      <TableRow key={row.id}>
                        <TableCell fontWeight="bold">{row.report}</TableCell>
                        <TableCell>
                          <Chip label={row.frequency} size="small" color="info" variant="outlined" />
                        </TableCell>
                        <TableCell>{row.format}</TableCell>
                        <TableCell>{row.recipient}</TableCell>
                        <TableCell align="right">
                          <IconButton size="small" color="error" onClick={() => handleRemoveSchedule(row.id)}>
                            <Delete />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Grid>
            </Grid>
          )}
        </Box>
      </Card>
    </Box>
  );
};

export default BulkOperationsView;