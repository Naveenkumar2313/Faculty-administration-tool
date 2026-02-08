import React, { useState } from "react";
import { 
  Box, Card, Grid, Typography, Button, Table, TableBody, TableCell, 
  TableHead, TableRow, Chip, IconButton, Tooltip, Dialog, DialogTitle, 
  DialogContent, DialogActions, TextField, MenuItem, Tabs, Tab, 
  LinearProgress, Switch, FormControlLabel, Avatar, Stack
} from "@mui/material";
import { 
  AccessTime, Fingerprint, LocationOn, SwapHoriz, Assessment, 
  SettingsSuggest, Warning, CheckCircle, Cancel, Edit, 
  NotificationsActive, CloudSync, Map, Schedule
} from "@mui/icons-material";

const AttendanceMonitorView = () => {
  const [tabIndex, setTabIndex] = useState(0);

  // --- MOCK DATA ---

  // 1. LIVE MONITOR & BIOMETRIC LOGS
  const [attendanceLogs, setAttendanceLogs] = useState([
    { id: 1, name: "Dr. Sarah Smith", dept: "CSE", timeIn: "09:05 AM", timeOut: "--", status: "Present", device: "Bio-Gate-1", location: "Main Block", late: true },
    { id: 2, name: "Prof. Rajan Kumar", dept: "Mech", timeIn: "08:55 AM", timeOut: "05:00 PM", status: "Present", device: "Bio-Gate-2", location: "Mech Block", late: false },
    { id: 3, name: "Ms. Priya Roy", dept: "Civil", timeIn: "--", timeOut: "--", status: "Absent", device: "--", location: "--", late: false },
  ]);

  const [devices, setDevices] = useState([
    { id: "DEV-001", name: "Main Gate Biometric", ip: "192.168.1.10", status: "Online", lastSync: "Just now" },
    { id: "DEV-002", name: "Admin Block Face Rec", ip: "192.168.1.12", status: "Online", lastSync: "1 min ago" },
    { id: "DEV-003", name: "Library RFID", ip: "192.168.1.15", status: "Offline", lastSync: "2 hours ago" },
  ]);

  // 2. SHIFT MANAGEMENT
  const [shifts, setShifts] = useState([
    { id: "S1", name: "General Shift", time: "09:00 AM - 05:00 PM", type: "Fixed" },
    { id: "S2", name: "Morning Shift", time: "07:00 AM - 02:00 PM", type: "Rotational" },
    { id: "S3", name: "Night Shift", time: "08:00 PM - 04:00 AM", type: "Allowance Eligible" },
  ]);

  const [shiftSwaps, setShiftSwaps] = useState([
    { id: 101, requestor: "Mr. Arjun Singh", current: "Night Shift", requested: "General Shift", date: "2026-02-15", reason: "Health Issue", status: "Pending" }
  ]);

  // 3. GEO-FENCING & REMOTE
  const [geoLogs, setGeoLogs] = useState([
    { id: 1, name: "Dr. A. Verma", type: "Field Visit", location: "IIT Delhi Campus", time: "10:30 AM", status: "Verified (GPS)" },
    { id: 2, name: "Ms. Neha Gupta", type: "Remote Work", location: "Home (Approved IP)", time: "09:00 AM", status: "Verified" }
  ]);

  // 4. AUTOMATION RULES
  const [rules, setRules] = useState({
    autoDeduct: true,
    lateWarning: true,
    escalation: false,
    monthlyReport: true
  });

  // DIALOGS
  const [openCorrectionDialog, setOpenCorrectionDialog] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null);

  const handleTabChange = (event, newValue) => setTabIndex(newValue);

  // ACTIONS
  const handleCorrection = () => {
    alert("Punch correction request processed.");
    setOpenCorrectionDialog(false);
  };

  const toggleRule = (rule) => {
    setRules({ ...rules, [rule]: !rules[rule] });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
        Smart Attendance Monitor
      </Typography>

      <Card sx={{ minHeight: 600 }}>
        <Tabs 
          value={tabIndex} 
          onChange={handleTabChange} 
          variant="scrollable"
          scrollButtons="auto"
          sx={{ borderBottom: 1, borderColor: 'divider', px: 2, bgcolor: 'background.paper' }}
        >
          <Tab icon={<Fingerprint />} iconPosition="start" label="Live Monitor & Biometrics" />
          <Tab icon={<Schedule />} iconPosition="start" label="Shift Management" />
          <Tab icon={<LocationOn />} iconPosition="start" label="Geo-fencing & Remote" />
          <Tab icon={<Assessment />} iconPosition="start" label="Analytics & Trends" />
          <Tab icon={<SettingsSuggest />} iconPosition="start" label="Automation Rules" />
        </Tabs>

        <Box sx={{ p: 3 }}>
          {/* =================================================================
              TAB 1: LIVE MONITOR & BIOMETRIC DEVICES
          ================================================================= */}
          {tabIndex === 0 && (
            <Box>
              <Grid container spacing={3} mb={3}>
                <Grid item xs={12} md={8}>
                   <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                     <Typography variant="h6">Real-time Attendance</Typography>
                     <Chip icon={<CloudSync />} label="Syncing..." color="success" size="small" variant="outlined" />
                   </Box>
                   <Table>
                     <TableHead sx={{ bgcolor: 'grey.100' }}>
                       <TableRow>
                         <TableCell>Faculty</TableCell>
                         <TableCell>In Time</TableCell>
                         <TableCell>Out Time</TableCell>
                         <TableCell>Device/Loc</TableCell>
                         <TableCell>Status</TableCell>
                         <TableCell>Action</TableCell>
                       </TableRow>
                     </TableHead>
                     <TableBody>
                       {attendanceLogs.map((row) => (
                         <TableRow key={row.id}>
                           <TableCell fontWeight="bold">
                             {row.name}
                             <Typography variant="caption" display="block">{row.dept}</Typography>
                           </TableCell>
                           <TableCell>
                             <Typography color={row.late ? "error" : "inherit"} fontWeight={row.late ? "bold" : "regular"}>
                               {row.timeIn}
                             </Typography>
                             {row.late && <Typography variant="caption" color="error">Late Entry</Typography>}
                           </TableCell>
                           <TableCell>{row.timeOut}</TableCell>
                           <TableCell>{row.device}</TableCell>
                           <TableCell>
                             <Chip 
                               label={row.status} size="small" 
                               color={row.status === 'Present' ? 'success' : row.status === 'Absent' ? 'error' : 'default'} 
                             />
                           </TableCell>
                           <TableCell>
                             <Tooltip title="Correction Request">
                               <IconButton size="small" onClick={() => { setSelectedLog(row); setOpenCorrectionDialog(true); }}>
                                 <Edit fontSize="small" />
                               </IconButton>
                             </Tooltip>
                           </TableCell>
                         </TableRow>
                       ))}
                     </TableBody>
                   </Table>
                </Grid>

                <Grid item xs={12} md={4}>
                  <Card variant="outlined" sx={{ p: 2, bgcolor: 'grey.50' }}>
                    <Typography variant="h6" gutterBottom>Device Health Status</Typography>
                    {devices.map((dev) => (
                      <Box key={dev.id} mb={2} p={1.5} bgcolor="white" borderRadius={1} border="1px solid #eee">
                        <Box display="flex" justifyContent="space-between">
                          <Typography variant="subtitle2">{dev.name}</Typography>
                          <Chip 
                            label={dev.status} size="small" 
                            color={dev.status === 'Online' ? 'success' : 'error'} 
                            sx={{ height: 20 }}
                          />
                        </Box>
                        <Typography variant="caption" color="textSecondary">IP: {dev.ip}</Typography>
                        <Box display="flex" alignItems="center" gap={1} mt={0.5}>
                          <AccessTime fontSize="small" sx={{ fontSize: 12, color: 'text.secondary' }} />
                          <Typography variant="caption" color="textSecondary">Sync: {dev.lastSync}</Typography>
                        </Box>
                      </Box>
                    ))}
                    <Button fullWidth variant="outlined" size="small">Manage Devices</Button>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          )}

          {/* =================================================================
              TAB 2: SHIFT MANAGEMENT
          ================================================================= */}
          {tabIndex === 1 && (
            <Box>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>Defined Shifts</Typography>
                  <Table size="small">
                    <TableHead sx={{ bgcolor: 'primary.light' }}>
                      <TableRow>
                        <TableCell sx={{ color: 'white' }}>Shift Name</TableCell>
                        <TableCell sx={{ color: 'white' }}>Timings</TableCell>
                        <TableCell sx={{ color: 'white' }}>Type</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {shifts.map((s) => (
                        <TableRow key={s.id}>
                          <TableCell fontWeight="bold">{s.name}</TableCell>
                          <TableCell>{s.time}</TableCell>
                          <TableCell>
                            <Chip label={s.type} size="small" variant="outlined" />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <Button startIcon={<Schedule />} sx={{ mt: 2 }}>Edit Roster</Button>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>Shift Swap Requests</Typography>
                  {shiftSwaps.map((req) => (
                    <Card key={req.id} variant="outlined" sx={{ p: 2, mb: 2 }}>
                      <Box display="flex" justifyContent="space-between" mb={1}>
                        <Typography variant="subtitle2">{req.requestor}</Typography>
                        <Chip label={req.status} color="warning" size="small" />
                      </Box>
                      <Box display="flex" alignItems="center" gap={2} mb={1}>
                        <Chip label={req.current} size="small" />
                        <SwapHoriz color="action" />
                        <Chip label={req.requested} size="small" color="primary" />
                      </Box>
                      <Typography variant="body2" color="textSecondary">Reason: {req.reason}</Typography>
                      <Box mt={2} display="flex" gap={1} justifyContent="flex-end">
                        <Button size="small" color="error">Reject</Button>
                        <Button size="small" variant="contained" color="success">Approve Swap</Button>
                      </Box>
                    </Card>
                  ))}
                </Grid>
              </Grid>
            </Box>
          )}

          {/* =================================================================
              TAB 3: GEO-FENCING & REMOTE
          ================================================================= */}
          {tabIndex === 2 && (
            <Box>
              <Grid container spacing={3}>
                <Grid item xs={12} md={7}>
                  <Typography variant="h6" gutterBottom>Mobile & Remote Attendance Logs</Typography>
                  <Table>
                    <TableHead sx={{ bgcolor: 'grey.100' }}>
                      <TableRow>
                        <TableCell>Faculty</TableCell>
                        <TableCell>Mode</TableCell>
                        <TableCell>Location / IP</TableCell>
                        <TableCell>Time</TableCell>
                        <TableCell>Verification</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {geoLogs.map((log) => (
                        <TableRow key={log.id}>
                          <TableCell fontWeight="bold">{log.name}</TableCell>
                          <TableCell>{log.type}</TableCell>
                          <TableCell>
                             <Box display="flex" alignItems="center" gap={1}>
                               {log.type === 'Field Visit' ? <Map fontSize="small" color="action" /> : <CloudSync fontSize="small" color="action" />}
                               {log.location}
                             </Box>
                          </TableCell>
                          <TableCell>{log.time}</TableCell>
                          <TableCell>
                            <Chip icon={<CheckCircle />} label={log.status} color="success" size="small" variant="outlined" />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Grid>

                <Grid item xs={12} md={5}>
                   <Card variant="outlined" sx={{ p: 2 }}>
                     <Typography variant="h6" gutterBottom>Geo-fencing Configuration</Typography>
                     <Box p={2} mb={2} border="1px dashed grey" borderRadius={1} bgcolor="#f9f9f9" textAlign="center">
                        <Map sx={{ fontSize: 40, color: 'text.secondary' }} />
                        <Typography variant="body2">Map View Placeholder</Typography>
                        <Typography variant="caption">Allowed Radius: 500m from Campus Center</Typography>
                     </Box>
                     <FormControlLabel control={<Switch defaultChecked />} label="Enable GPS Restriction" />
                     <FormControlLabel control={<Switch defaultChecked />} label="Allow Remote Work Requests" />
                   </Card>
                </Grid>
              </Grid>
            </Box>
          )}

          {/* =================================================================
              TAB 4: ANALYTICS
          ================================================================= */}
          {tabIndex === 3 && (
            <Box>
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Card sx={{ p: 2, bgcolor: 'info.light', color: 'info.main', textAlign: 'center' }}>
                    <Typography variant="h4" fontWeight="bold">92%</Typography>
                    <Typography variant="body2">Average Punctuality</Typography>
                  </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Card sx={{ p: 2, bgcolor: 'warning.light', color: 'warning.main', textAlign: 'center' }}>
                    <Typography variant="h4" fontWeight="bold">15</Typography>
                    <Typography variant="body2">Early Departures (This Month)</Typography>
                  </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Card sx={{ p: 2, bgcolor: 'primary.light', color: 'white', textAlign: 'center' }}>
                    <Typography variant="h4" fontWeight="bold">CSE</Typography>
                    <Typography variant="body2">Best Attendance Dept</Typography>
                  </Card>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>Department-wise Statistics</Typography>
                  {['CSE', 'ECE', 'Mechanical', 'Civil'].map((dept, index) => (
                    <Box key={dept} mb={2}>
                      <Box display="flex" justifyContent="space-between" mb={0.5}>
                        <Typography variant="body2" fontWeight="bold">{dept}</Typography>
                        <Typography variant="body2">{85 + index * 2}%</Typography>
                      </Box>
                      <LinearProgress 
                        variant="determinate" value={85 + index * 2} 
                        color="primary" sx={{ height: 8, borderRadius: 4 }} 
                      />
                    </Box>
                  ))}
                </Grid>
              </Grid>
            </Box>
          )}

          {/* =================================================================
              TAB 5: AUTOMATION RULES
          ================================================================= */}
          {tabIndex === 4 && (
            <Box>
               <Typography variant="h6" gutterBottom>Automated Attendance Policies</Typography>
               <Grid container spacing={3}>
                 <Grid item xs={12} md={6}>
                   <Card variant="outlined" sx={{ p: 2 }}>
                     <FormControlLabel 
                       control={<Switch checked={rules.autoDeduct} onChange={() => toggleRule('autoDeduct')} />} 
                       label="Auto-deduct Leave for Absent Days" 
                     />
                     <Typography variant="caption" display="block" color="textSecondary" ml={4} mb={2}>
                       Automatically converts 'Absent' to 'Casual Leave' if balance exists.
                     </Typography>

                     <FormControlLabel 
                       control={<Switch checked={rules.lateWarning} onChange={() => toggleRule('lateWarning')} />} 
                       label="Auto-send Warning for 3+ Late Comings" 
                     />
                     <Typography variant="caption" display="block" color="textSecondary" ml={4} mb={2}>
                       Triggers an email to faculty after 3 late marks in a month.
                     </Typography>
                   </Card>
                 </Grid>
                 <Grid item xs={12} md={6}>
                   <Card variant="outlined" sx={{ p: 2 }}>
                     <FormControlLabel 
                       control={<Switch checked={rules.escalation} onChange={() => toggleRule('escalation')} />} 
                       label="Escalate Frequent Absenteeism to HOD" 
                     />
                     <Typography variant="caption" display="block" color="textSecondary" ml={4} mb={2}>
                       Notifies HOD if a faculty is absent for >3 consecutive days without info.
                     </Typography>

                     <FormControlLabel 
                       control={<Switch checked={rules.monthlyReport} onChange={() => toggleRule('monthlyReport')} />} 
                       label="Email Monthly Attendance Report" 
                     />
                     <Typography variant="caption" display="block" color="textSecondary" ml={4} mb={2}>
                       Sends a summary PDF to all faculty on the 1st of every month.
                     </Typography>
                   </Card>
                 </Grid>
               </Grid>
            </Box>
          )}

        </Box>
      </Card>

      {/* CORRECTION DIALOG */}
      <Dialog open={openCorrectionDialog} onClose={() => setOpenCorrectionDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Attendance Correction</DialogTitle>
        <DialogContent dividers>
          <Box mb={2}>
            <Typography variant="subtitle2">Faculty: {selectedLog?.name}</Typography>
            <Typography variant="body2" color="error">Current Status: {selectedLog?.status} ({selectedLog?.late ? "Late" : "On Time"})</Typography>
          </Box>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField label="Correct In-Time" type="time" fullWidth InputLabelProps={{ shrink: true }} />
            </Grid>
            <Grid item xs={6}>
              <TextField label="Correct Out-Time" type="time" fullWidth InputLabelProps={{ shrink: true }} />
            </Grid>
            <Grid item xs={12}>
              <TextField label="Reason for Correction" fullWidth multiline rows={2} placeholder="e.g. Device not working, Forgot ID..." />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCorrectionDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCorrection} color="primary">Submit Request</Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
};

export default AttendanceMonitorView;