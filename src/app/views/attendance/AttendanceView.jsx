import React, { useState } from 'react';
import { 
  Box, Card, Grid, Typography, Table, TableBody, TableCell, TableHead, TableRow, 
  Chip, Button, LinearProgress, Stack, Dialog, DialogTitle, DialogContent, 
  DialogActions, TextField, MenuItem, IconButton, Tooltip 
} from "@mui/material";
import { 
  AccessTime, Download, LocationOn, CheckCircle, Warning, 
  TrendingUp, Fingerprint, History 
} from '@mui/icons-material';
import ReactEcharts from "echarts-for-react";
import { useTheme } from '@mui/material/styles';

const AttendanceView = () => {
  const theme = useTheme();
  const [openRegularize, setOpenRegularize] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null);

  // --- MOCK DATA ---
  const attendanceData = [
    { id: 1, date: "Oct 24, 2023", in: "09:05 AM", out: "05:10 PM", hours: "8h 05m", status: "Present", type: "On-Time" },
    { id: 2, date: "Oct 23, 2023", in: "09:45 AM", out: "05:30 PM", hours: "7h 45m", status: "Present", type: "Late" },
    { id: 3, date: "Oct 22, 2023", in: "-", out: "-", hours: "0h 00m", status: "Absent", type: "Leave" },
    { id: 4, date: "Oct 21, 2023", in: "09:00 AM", out: "01:00 PM", hours: "4h 00m", status: "Half-Day", type: "Early Departure" },
  ];

  // Chart Data: Your attendance vs Dept Average
  const chartOption = {
    tooltip: { trigger: 'axis' },
    legend: { data: ['My Hours', 'Dept Avg'], bottom: -10 },
    grid: { top: '10%', bottom: '20%', left: '10%', right: '5%' },
    xAxis: { 
      type: 'category', 
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      axisLine: { show: false },
      axisTick: { show: false }
    },
    yAxis: { type: 'value', splitLine: { lineStyle: { type: 'dashed' } } },
    series: [
      {
        name: 'My Hours',
        type: 'bar',
        data: [8.2, 7.5, 8.0, 6.5, 8.5],
        itemStyle: { color: theme.palette.primary.main, borderRadius: [4, 4, 0, 0] },
        barWidth: 12
      },
      {
        name: 'Dept Avg',
        type: 'line',
        data: [7.8, 7.8, 7.9, 7.8, 7.6],
        itemStyle: { color: theme.palette.secondary.main },
        smooth: true
      }
    ]
  };

  const handleRegularizeClick = (row) => {
    setSelectedLog(row);
    setOpenRegularize(true);
  };

  const handleClose = () => {
    setOpenRegularize(false);
    setSelectedLog(null);
  };

  const getStatusColor = (type) => {
    switch (type) {
      case 'On-Time': return 'success';
      case 'Late': return 'warning';
      case 'Leave': return 'error';
      case 'Early Departure': return 'info';
      default: return 'default';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* 1. HEADER SECTION */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} flexWrap="wrap" gap={2}>
        <Box>
          <Typography variant="h5" fontWeight="bold">Attendance Logs</Typography>
          <Typography variant="body2" color="text.secondary">October 2023</Typography>
        </Box>
        
        <Stack direction="row" spacing={2} alignItems="center">
          {/* Geo-fencing Badge */}
          <Chip 
            icon={<LocationOn />} 
            label="Geo-fencing Active: Campus Zone A" 
            color="success" 
            variant="outlined" 
            sx={{ fontWeight: 'medium' }}
          />
          <Button variant="contained" startIcon={<Download />} color="secondary">
            Download Report
          </Button>
        </Stack>
      </Box>

      {/* 2. SUMMARY CARDS */}
      <Grid container spacing={3} mb={3}>
        {/* Hours Worked Card */}
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <Box display="flex" justifyContent="space-between" mb={1}>
              <Typography variant="subtitle1" fontWeight="bold">Monthly Hours</Typography>
              <Chip size="small" label="85% Target Met" color="primary" />
            </Box>
            <Typography variant="h3" fontWeight="bold" color="primary">142h <span style={{fontSize: '1rem', color: '#888'}}>/ 160h</span></Typography>
            <Box mt={2}>
              <LinearProgress variant="determinate" value={88} sx={{ height: 10, borderRadius: 5 }} />
            </Box>
            <Typography variant="caption" sx={{ mt: 1, color: 'text.secondary' }}>18 hours remaining for full credit</Typography>
          </Card>
        </Grid>

        {/* Stats Grid */}
        <Grid item xs={12} md={4}>
          <Grid container spacing={2}>
            {[
              { label: 'Present', val: '19', color: 'success.main', icon: CheckCircle },
              { label: 'Late', val: '02', color: 'warning.main', icon: Warning },
              { label: 'Leaves', val: '01', color: 'error.main', icon: History },
              { label: 'Avg In-Time', val: '09:15', color: 'info.main', icon: AccessTime },
            ].map((item, i) => (
              <Grid item xs={6} key={i}>
                <Card sx={{ p: 2, textAlign: 'center', height: '100%' }}>
                  <item.icon sx={{ color: item.color, mb: 1 }} />
                  <Typography variant="h5" fontWeight="bold">{item.val}</Typography>
                  <Typography variant="caption" color="text.secondary">{item.label}</Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>

        {/* Comparison Graph */}
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 2, height: '100%' }}>
            <Typography variant="subtitle2" fontWeight="bold" gutterBottom>Vs Department Average</Typography>
            <ReactEcharts option={chartOption} style={{ height: '150px' }} />
          </Card>
        </Grid>
      </Grid>

      {/* 3. DAILY LOGS TABLE */}
      <Card>
        <Box p={2} display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Daily Activity Log</Typography>
        </Box>
        <Table>
          <TableHead sx={{ bgcolor: 'grey.50' }}>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Check In</TableCell>
              <TableCell>Check Out</TableCell>
              <TableCell>Effective Hours</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {attendanceData.map((row) => (
              <TableRow key={row.id}>
                <TableCell sx={{ fontWeight: 'medium' }}>{row.date}</TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Fingerprint fontSize="small" color="action" /> {row.in}
                  </Box>
                </TableCell>
                <TableCell>{row.out}</TableCell>
                <TableCell>{row.hours}</TableCell>
                <TableCell>
                  <Chip 
                    label={row.type} 
                    color={getStatusColor(row.type)} 
                    size="small" 
                    variant={row.type === 'On-Time' ? 'outlined' : 'filled'}
                  />
                </TableCell>
                <TableCell align="right">
                  {(row.type === 'Late' || row.type === 'Early Departure' || row.status === 'Absent') ? (
                    <Button 
                      size="small" 
                      variant="outlined" 
                      color="warning" 
                      onClick={() => handleRegularizeClick(row)}
                    >
                      Regularize
                    </Button>
                  ) : (
                    <Tooltip title="Verified by Biometric">
                      <CheckCircle color="disabled" fontSize="small" />
                    </Tooltip>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* 4. REGULARIZATION DIALOG */}
      <Dialog open={openRegularize} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Regularize Attendance</DialogTitle>
        <DialogContent dividers>
          <Box mb={2}>
            <Typography variant="subtitle2" color="text.secondary">Date to Regularize</Typography>
            <Typography variant="h6">{selectedLog?.date}</Typography>
          </Box>
          <Box mb={2}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>Discrepancy</Typography>
            <Chip 
              label={selectedLog?.type} 
              color="warning" 
              size="small" 
              sx={{ fontWeight: 'bold' }} 
            />
          </Box>
          <TextField
            select
            label="Reason Category"
            fullWidth
            margin="normal"
            defaultValue=""
          >
            <MenuItem value="traffic">Traffic Delay</MenuItem>
            <MenuItem value="transport">Public Transport Failure</MenuItem>
            <MenuItem value="official">Official Duty (Outside Campus)</MenuItem>
            <MenuItem value="medical">Medical Emergency</MenuItem>
            <MenuItem value="forgot">Forgot ID Card/Biometric Issue</MenuItem>
          </TextField>
          <TextField
            label="Detailed Justification"
            multiline
            rows={3}
            fullWidth
            margin="normal"
            placeholder="Please explain why you were late..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="inherit">Cancel</Button>
          <Button onClick={handleClose} variant="contained" color="primary">Submit Request</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AttendanceView;