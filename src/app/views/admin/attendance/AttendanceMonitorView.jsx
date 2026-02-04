import React, { useState } from "react";
import { 
  Box, Card, Grid, Typography, Button, TextField, MenuItem, 
  Tabs, Tab, Table, TableBody, TableCell, TableHead, TableRow, 
  Chip, IconButton, Tooltip, LinearProgress 
} from "@mui/material";
import { 
  AccessTime, Warning, FileDownload, Email, CheckCircle, 
  Cancel, FilterList, TrendingDown 
} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";

const AttendanceMonitorView = () => {
  const theme = useTheme();
  const [tabIndex, setTabIndex] = useState(0);
  const [selectedDept, setSelectedDept] = useState("All");

  const handleTabChange = (event, newValue) => setTabIndex(newValue);

  // Mock Departments
  const departments = ["All", "Computer Science", "Mechanical", "Civil Engg", "Electrical"];

  // Mock Faculty Attendance Data
  const attendanceData = [
    { id: 1, name: "Dr. Sarah Smith", dept: "Computer Science", status: "Present", checkIn: "08:45 AM", percent: 92, lateCount: 1, consecutive: 0 },
    { id: 2, name: "Prof. Rajan Kumar", dept: "Mechanical", status: "Absent", checkIn: "-", percent: 72, lateCount: 3, consecutive: 4 }, // Anomaly: <75%, Consecutive
    { id: 3, name: "Dr. Emily Davis", dept: "Civil Engg", status: "On Leave", checkIn: "-", percent: 85, lateCount: 0, consecutive: 0 },
    { id: 4, name: "Mr. John Doe", dept: "Electrical", status: "Present", checkIn: "09:45 AM", percent: 88, lateCount: 6, consecutive: 0 }, // Anomaly: Late > 5
    { id: 5, name: "Ms. Priya Sharma", dept: "Computer Science", status: "Present", checkIn: "09:05 AM", percent: 65, lateCount: 2, consecutive: 0 }, // Anomaly: <75%
  ];

  // Logic to filter data based on Department
  const filteredData = selectedDept === "All" 
    ? attendanceData 
    : attendanceData.filter(d => d.dept === selectedDept);

  // Logic to identify Anomalies
  const getAnomalies = () => {
    return attendanceData.filter(f => 
      f.percent < 75 || f.lateCount > 5 || f.consecutive > 2
    );
  };

  const anomalies = getAnomalies();

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
        Attendance & Leave Administration
      </Typography>

      <Card sx={{ minHeight: 500 }}>
        <Tabs 
          value={tabIndex} 
          onChange={handleTabChange} 
          sx={{ borderBottom: 1, borderColor: 'divider', px: 2, bgcolor: 'background.paper' }}
        >
          <Tab icon={<AccessTime />} iconPosition="start" label="Real-Time Monitor" />
          <Tab icon={<Warning />} iconPosition="start" label="Attendance Anomalies" />
        </Tabs>

        <Box sx={{ p: 3 }}>
          {/* =================================================================
              TAB 1: REAL-TIME MONITOR
          ================================================================= */}
          {tabIndex === 0 && (
            <Box>
              {/* Dashboard Stats */}
              <Grid container spacing={3} mb={3}>
                <Grid item xs={12} md={3}>
                  <Card sx={{ p: 2, bgcolor: 'primary.light', color: 'primary.main', textAlign: 'center' }}>
                    <Typography variant="h4" fontWeight="bold">142</Typography>
                    <Typography variant="body2" fontWeight="bold">Total Faculty</Typography>
                  </Card>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Card sx={{ p: 2, bgcolor: 'success.light', color: 'success.main', textAlign: 'center' }}>
                    <Typography variant="h4" fontWeight="bold">118</Typography>
                    <Typography variant="body2" fontWeight="bold">Present Today</Typography>
                  </Card>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Card sx={{ p: 2, bgcolor: 'warning.light', color: 'warning.main', textAlign: 'center' }}>
                    <Typography variant="h4" fontWeight="bold">12</Typography>
                    <Typography variant="body2" fontWeight="bold">Late Arrivals</Typography>
                  </Card>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Card sx={{ p: 2, bgcolor: 'error.light', color: 'error.main', textAlign: 'center' }}>
                    <Typography variant="h4" fontWeight="bold">12</Typography>
                    <Typography variant="body2" fontWeight="bold">Absent</Typography>
                  </Card>
                </Grid>
              </Grid>

              {/* Filters & Actions */}
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} flexWrap="wrap" gap={2}>
                <Box display="flex" gap={2}>
                  <TextField 
                    select size="small" label="Filter Department" sx={{ minWidth: 200 }}
                    value={selectedDept} onChange={(e) => setSelectedDept(e.target.value)}
                  >
                    {departments.map(d => <MenuItem key={d} value={d}>{d}</MenuItem>)}
                  </TextField>
                  <TextField type="date" size="small" label="Date" InputLabelProps={{ shrink: true }} />
                </Box>
                <Box>
                  <Button variant="outlined" startIcon={<FileDownload />} sx={{ mr: 1 }}>Excel</Button>
                  <Button variant="outlined" startIcon={<FileDownload />}>PDF</Button>
                </Box>
              </Box>

              {/* Attendance List */}
              <Table>
                <TableHead sx={{ bgcolor: 'grey.100' }}>
                  <TableRow>
                    <TableCell>Faculty Name</TableCell>
                    <TableCell>Department</TableCell>
                    <TableCell>Check-In Time</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Attendance %</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredData.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell fontWeight="bold">{row.name}</TableCell>
                      <TableCell>{row.dept}</TableCell>
                      <TableCell>{row.checkIn}</TableCell>
                      <TableCell>
                        <Chip 
                          label={row.status} size="small" 
                          color={row.status === 'Present' ? 'success' : row.status === 'Absent' ? 'error' : 'warning'} 
                          variant={row.status === 'On Leave' ? 'outlined' : 'filled'}
                        />
                      </TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={1}>
                          <LinearProgress 
                            variant="determinate" value={row.percent} 
                            sx={{ width: 80, height: 8, borderRadius: 5 }} 
                            color={row.percent < 75 ? "error" : "success"}
                          />
                          <Typography variant="caption">{row.percent}%</Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          )}

          {/* =================================================================
              TAB 2: ATTENDANCE ANOMALIES
          ================================================================= */}
          {tabIndex === 1 && (
            <Box>
              <Typography variant="h6" gutterBottom color="error" display="flex" alignItems="center" gap={1}>
                <Warning /> Critical Attendance Issues Detected
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={3}>
                System flags faculty with {"<"}75% attendance, consecutive unauthorized absences, or excessive late arrivals.
              </Typography>

              <Table sx={{ border: '1px solid #ffcdd2' }}>
                <TableHead sx={{ bgcolor: '#ffebee' }}>
                  <TableRow>
                    <TableCell>Faculty Name</TableCell>
                    <TableCell>Issue Type</TableCell>
                    <TableCell>Details</TableCell>
                    <TableCell align="right">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {anomalies.map((row) => {
                    let issues = [];
                    if (row.percent < 75) issues.push("Low Attendance (<75%)");
                    if (row.lateCount > 5) issues.push("Excessive Late Arrivals");
                    if (row.consecutive > 2) issues.push("Consecutive Absences");

                    return (
                      <TableRow key={row.id}>
                        <TableCell fontWeight="bold">{row.name}</TableCell>
                        <TableCell>
                          {issues.map((issue, idx) => (
                            <Chip key={idx} label={issue} size="small" color="error" sx={{ mr: 1, mb: 0.5 }} />
                          ))}
                        </TableCell>
                        <TableCell>
                          <Typography variant="caption" display="block">Attendance: {row.percent}%</Typography>
                          <Typography variant="caption" display="block">Late: {row.lateCount}/month</Typography>
                          <Typography variant="caption" display="block">Consecutive Absent: {row.consecutive} days</Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Button variant="contained" color="warning" size="small" startIcon={<Email />}>
                            Send Warning
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {anomalies.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} align="center">No anomalies detected.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </Box>
          )}
        </Box>
      </Card>
    </Box>
  );
};

export default AttendanceMonitorView;