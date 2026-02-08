import React, { useState, useEffect } from "react";
import { 
  Box, Card, Grid, Typography, Button, TextField, MenuItem, 
  Tabs, Tab, Table, TableBody, TableCell, TableHead, TableRow, 
  Chip, IconButton, Tooltip, LinearProgress, Divider, Alert, AlertTitle,
  Stepper, Step, StepLabel, Paper, Checkbox, FormControlLabel,
  List, ListItem, ListItemText, ListItemIcon, Collapse, Avatar, ListSubheader, ListItemButton, Switch
} from "@mui/material";
import { 
  CloudUpload, FileDownload, Publish, Warning, CheckCircle, 
  Schedule, TableView, Delete, ErrorOutline, CompareArrows,
  Transform, Storage, History, LibraryBooks, AutoFixHigh,
  SettingsBackupRestore, FilterAlt, Lan, Email, CloudSync, Add
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";

const HiddenInput = styled('input')({ display: 'none' });

const BulkOperationsView = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [activeStep, setActiveStep] = useState(0);
  
  // --- STATE MANAGEMENT ---
  const [importConfig, setImportConfig] = useState({
    type: "Faculty",
    format: "XLSX",
    dryRun: true,
    autoFix: false,
    partialCommit: true
  });

  const [file, setFile] = useState(null);
  const [mapping, setMapping] = useState({
    "Employee Name": "name",
    "Dept_ID": "department",
    "DOJ": "joiningDate",
    "Basic_Pay": "salary"
  });

  // MOCK DATA: VALIDATION & PREVIEW
  const [previewData, setPreviewData] = useState([
    { id: 1, source: "Dr. Sarah S.", target: "Dr. Sarah Smith", status: "Modified", score: 95, action: "Update" },
    { id: 2, source: "Arjun Singh", target: "Arjun Singh", status: "New", score: 100, action: "Insert" },
    { id: 3, source: "Invalid_Email", target: "null", status: "Error", score: 20, action: "Skip" },
  ]);

  const [auditLog, setAuditLog] = useState([
    { id: "LOG-99", date: "2026-02-05 10:00 AM", user: "Admin", action: "Bulk Import", records: 150, status: "Success" },
    { id: "LOG-98", date: "2026-02-01 02:00 PM", user: "HR Mgr", action: "Salary Update", records: 45, status: "Rolled Back" },
  ]);

  // --- ACTIONS ---
  const handleTabChange = (event, newValue) => setTabIndex(newValue);
  
  const handleFileUpload = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
      setActiveStep(1); // Move to Mapping
    }
  };

  const runValidation = () => {
    setActiveStep(2); // Move to Preview
  };

  const handleCommit = () => {
    alert("Transaction committed. Transaction ID: TXN-887766");
    setActiveStep(0);
    setFile(null);
  };

  const handleRollback = (id) => {
    if(window.confirm(`Are you sure you want to rollback Transaction ${id}?`)) {
      alert("Rollback successful. System state restored.");
    }
  };

  // --- RENDER HELPERS ---

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
        Advanced Bulk Data Management
      </Typography>

      <Card sx={{ minHeight: 600 }}>
        <Tabs 
          value={tabIndex} 
          onChange={handleTabChange} 
          sx={{ borderBottom: 1, borderColor: 'divider', px: 2, bgcolor: 'background.paper' }}
        >
          <Tab icon={<Publish />} iconPosition="start" label="Import Wizard" />
          <Tab icon={<History />} iconPosition="start" label="Audit & Rollback" />
          <Tab icon={<LibraryBooks />} iconPosition="start" label="Template Manager" />
          <Tab icon={<CloudSync />} iconPosition="start" label="Scheduled Ops" />
        </Tabs>

        <Box sx={{ p: 3 }}>
          
          {/* =================================================================
              TAB 1: IMPORT WIZARD (ADVANCED)
          ================================================================= */}
          {tabIndex === 0 && (
            <Box>
              <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
                {['Upload', 'Mapping & Rules', 'Preview & Validate', 'Commit'].map((label) => (
                  <Step key={label}><StepLabel>{label}</StepLabel></Step>
                ))}
              </Stepper>

              <Grid container spacing={3}>
                {/* STEP 0: UPLOAD */}
                {activeStep === 0 && (
                  <Grid item xs={12} md={6} sx={{ mx: 'auto', textAlign: 'center' }}>
                    <Paper variant="outlined" sx={{ p: 5, borderStyle: 'dashed', bgcolor: 'grey.50' }}>
                      <CloudUpload sx={{ fontSize: 60, mb: 2, color: 'primary.main' }} />
                      <Typography variant="h6">Select Source File</Typography>
                      <Typography variant="body2" color="textSecondary" mb={3}>
                        Supports CSV, XLSX, and JSON formats
                      </Typography>
                      <Button variant="contained" component="label" size="large">
                        Choose File
                        <HiddenInput type="file" onChange={handleFileUpload} />
                      </Button>
                      <Box mt={3} display="flex" justifyContent="center" gap={2}>
                         <Chip label="Max Size: 50MB" size="small" />
                         <Chip label="Auto-detect format" size="small" variant="outlined" />
                      </Box>
                    </Paper>
                  </Grid>
                )}

                {/* STEP 1: MAPPING */}
                {activeStep === 1 && (
                  <Grid item xs={12}>
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={7}>
                        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>Field Mapping Interface</Typography>
                        <Table size="small" border={1} sx={{ borderColor: 'divider' }}>
                          <TableHead sx={{ bgcolor: 'grey.100' }}>
                            <TableRow>
                              <TableCell>Source Column (Excel)</TableCell>
                              <TableCell align="center"><CompareArrows /></TableCell>
                              <TableCell>System Field (Database)</TableCell>
                              <TableCell>Transformation</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {Object.entries(mapping).map(([src, target]) => (
                              <TableRow key={src}>
                                <TableCell>{src}</TableCell>
                                <TableCell align="center"><Transform color="primary" fontSize="small" /></TableCell>
                                <TableCell>
                                  <TextField select fullWidth size="small" defaultValue={target}>
                                     <MenuItem value="name">Faculty Name</MenuItem>
                                     <MenuItem value="department">Dept Code</MenuItem>
                                     <MenuItem value="joiningDate">Join Date</MenuItem>
                                  </TextField>
                                </TableCell>
                                <TableCell>
                                   <Chip label="Proper Case" size="small" onClick={() => {}} />
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </Grid>
                      <Grid item xs={12} md={5}>
                        <Card variant="outlined" sx={{ p: 2, bgcolor: 'primary.50' }}>
                           <Typography variant="subtitle2" gutterBottom>Import Strategies</Typography>
                           <FormControlLabel control={<Switch checked={importConfig.autoFix} />} label="Auto-fix common date/case errors" />
                           <FormControlLabel control={<Switch defaultChecked />} label="Detect duplicates by Phone/Email" />
                           <FormControlLabel control={<Switch checked={importConfig.partialCommit} />} label="Allow partial commit (Skip errors)" />
                           <Divider sx={{ my: 2 }} />
                           <Button variant="contained" fullWidth onClick={runValidation}>Run Validation Engine</Button>
                        </Card>
                      </Grid>
                    </Grid>
                  </Grid>
                )}

                {/* STEP 2: PREVIEW */}
                {activeStep === 2 && (
                  <Grid item xs={12}>
                    <Box display="flex" justifyContent="space-between" mb={2}>
                       <Box display="flex" gap={2}>
                          <Alert icon={<AutoFixHigh />} severity="info" sx={{ py: 0 }}>Quality Score: 88/100</Alert>
                          <Chip label="Valid: 48" color="success" />
                          <Chip label="Errors: 2" color="error" />
                       </Box>
                       <Button variant="contained" color="success" startIcon={<CheckCircle />} onClick={handleCommit}>
                         Commit 48 Records
                       </Button>
                    </Box>
                    <Table>
                      <TableHead sx={{ bgcolor: 'grey.100' }}>
                        <TableRow>
                          <TableCell>Source Data</TableCell>
                          <TableCell>Processed/Target</TableCell>
                          <TableCell>Quality Score</TableCell>
                          <TableCell>Status</TableCell>
                          <TableCell>Action</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {previewData.map(row => (
                          <TableRow key={row.id}>
                            <TableCell>{row.source}</TableCell>
                            <TableCell>{row.target}</TableCell>
                            <TableCell>
                               <LinearProgress variant="determinate" value={row.score} color={row.score > 80 ? "success" : "error"} sx={{ width: 100, height: 6, borderRadius: 3 }} />
                            </TableCell>
                            <TableCell>
                              <Chip label={row.status} size="small" color={row.status === 'Error' ? 'error' : 'info'} />
                            </TableCell>
                            <TableCell>
                               {row.status === 'Error' ? <Tooltip title="View Error Detail"><IconButton color="error"><ErrorOutline /></IconButton></Tooltip> : <Typography variant="caption">{row.action}</Typography>}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Grid>
                )}
              </Grid>
            </Box>
          )}

          {/* =================================================================
              TAB 2: AUDIT & ROLLBACK
          ================================================================= */}
          {tabIndex === 1 && (
            <Box>
              <Box display="flex" justifyContent="space-between" mb={2}>
                <Typography variant="h6">Transaction Audit Trail</Typography>
                <Button variant="outlined" startIcon={<FilterAlt />}>Filter Logs</Button>
              </Box>
              <Table>
                <TableHead sx={{ bgcolor: 'grey.50' }}>
                  <TableRow>
                    <TableCell>Transaction ID</TableCell>
                    <TableCell>Date & Time</TableCell>
                    <TableCell>Executed By</TableCell>
                    <TableCell>Impact (Records)</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Safety Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {auditLog.map(log => (
                    <TableRow key={log.id}>
                      <TableCell fontWeight="bold">{log.id}</TableCell>
                      <TableCell>{log.date}</TableCell>
                      <TableCell>{log.user}</TableCell>
                      <TableCell>{log.records}</TableCell>
                      <TableCell>
                        <Chip label={log.status} size="small" color={log.status === 'Success' ? 'success' : 'default'} />
                      </TableCell>
                      <TableCell align="right">
                        {log.status === 'Success' && (
                          <Button 
                            size="small" color="error" startIcon={<SettingsBackupRestore />}
                            onClick={() => handleRollback(log.id)}
                          >
                            Rollback
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          )}

          {/* =================================================================
              TAB 3: TEMPLATE MANAGER
          ================================================================= */}
          {tabIndex === 2 && (
             <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Card variant="outlined" sx={{ p: 2 }}>
                     <Typography variant="subtitle1" fontWeight="bold">Download Master Templates</Typography>
                     <List dense>
                        <ListItem button divider><ListItemIcon><TableView /></ListItemIcon><ListItemText primary="Faculty Master Template" /></ListItem>
                        <ListItem button divider><ListItemIcon><TableView /></ListItemIcon><ListItemText primary="Biometric Log Format" /></ListItem>
                        <ListItem button divider><ListItemIcon><TableView /></ListItemIcon><ListItemText primary="Salary Revision Template" /></ListItem>
                     </List>
                  </Card>
                </Grid>
                <Grid item xs={12} md={8}>
                   <Card sx={{ p: 3, bgcolor: 'grey.50' }}>
                      <Typography variant="h6">Template Configurator</Typography>
                      <Typography variant="body2" color="textSecondary" mb={3}>Define mandatory fields and validation rules for custom templates</Typography>
                      <Grid container spacing={2}>
                         <Grid item xs={12}>
                            <TextField fullWidth label="Template Name" size="small" defaultValue="Custom Research Grant Upload" />
                         </Grid>
                         <Grid item xs={12}>
                            <Typography variant="caption">Mandatory Columns:</Typography>
                            <Box display="flex" gap={1} mt={1}>
                               <Chip label="Grant_ID" onDelete={()=>{}} />
                               <Chip label="PI_Name" onDelete={()=>{}} />
                               <Chip label="Budget_INR" onDelete={()=>{}} />
                               <Button size="small" startIcon={<Add />}>Add Field</Button>
                            </Box>
                         </Grid>
                      </Grid>
                   </Card>
                </Grid>
             </Grid>
          )}

          {/* =================================================================
              TAB 4: SCHEDULED OPERATIONS
          ================================================================= */}
          {tabIndex === 3 && (
            <Box>
               <Grid container spacing={3} mb={4}>
                  <Grid item xs={12} md={4}>
                     <Card sx={{ p: 2, borderLeft: 4, borderColor: 'info.main' }}>
                        <Box display="flex" justifyContent="space-between">
                           <Typography variant="subtitle2">SFTP Integration</Typography>
                           <Storage color="info" />
                        </Box>
                        <Typography variant="body2" color="textSecondary">Status: Connected</Typography>
                        <Typography variant="caption">Path: /uploads/biometric/</Typography>
                     </Card>
                  </Grid>
                  <Grid item xs={12} md={4}>
                     <Card sx={{ p: 2, borderLeft: 4, borderColor: 'secondary.main' }}>
                        <Box display="flex" justifyContent="space-between">
                           <Typography variant="subtitle2">Email Watcher</Typography>
                           <Email color="secondary" />
                        </Box>
                        <Typography variant="body2" color="textSecondary">Active: hr-data@college.edu</Typography>
                        <Typography variant="caption">Action: Process Attachments</Typography>
                     </Card>
                  </Grid>
               </Grid>

               <Typography variant="h6" gutterBottom>Scheduled Jobs</Typography>
               <Table>
                 <TableHead>
                   <TableRow>
                     <TableCell>Job Name</TableCell>
                     <TableCell>Frequency</TableCell>
                     <TableCell>Source</TableCell>
                     <TableCell>Last Run</TableCell>
                     <TableCell>Status</TableCell>
                     <TableCell align="right">Action</TableCell>
                   </TableRow>
                 </TableHead>
                 <TableBody>
                    <TableRow>
                       <TableCell fontWeight="bold">Nightly Attendance Sync</TableCell>
                       <TableCell><Chip label="Daily 02:00 AM" size="small" variant="outlined"/></TableCell>
                       <TableCell>SFTP Server</TableCell>
                       <TableCell>Today 02:00 AM</TableCell>
                       <TableCell><Chip label="Healthy" color="success" size="small" /></TableCell>
                       <TableCell align="right"><IconButton><Settings /></IconButton></TableCell>
                    </TableRow>
                 </TableBody>
               </Table>
            </Box>
          )}

        </Box>
      </Card>
    </Box>
  );
};

// Generic Settings Icon
const Settings = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
     <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/>
  </svg>
);

export default BulkOperationsView;