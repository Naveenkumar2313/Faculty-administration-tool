import React from 'react';
import { 
  Box, Card, Grid, Typography, Table, TableBody, 
  TableCell, TableHead, TableRow, Chip, Button 
} from "@mui/material";
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  padding: '1rem',
  textAlign: 'center'
}));

const AttendanceView = () => {
  const attendanceData = [
    { date: "Oct 24, 2023", in: "09:05 AM", out: "05:10 PM", status: "Present", type: "On-Time" },
    { date: "Oct 23, 2023", in: "09:45 AM", out: "05:30 PM", status: "Present", type: "Late" },
    { date: "Oct 22, 2023", in: "-", out: "-", status: "Absent", type: "Leave" },
  ];

  const getStatusColor = (type) => {
    switch (type) {
      case 'On-Time': return 'success';
      case 'Late': return 'warning';
      case 'Leave': return 'error';
      default: return 'default';
    }
  };

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h5" sx={{ mb: 3 }}>Attendance & Biometric Logs</Typography>

      {/* Stats Row */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[
          { label: "Working Days", val: "22", color: "text.primary" },
          { label: "Present", val: "19", color: "green" },
          { label: "Late Arrivals", val: "2", color: "orange" },
          { label: "Leaves", val: "1", color: "red" }
        ].map((stat, i) => (
          <Grid item xs={12} sm={6} md={3} key={i}>
            <StyledCard elevation={2}>
              <Typography color="textSecondary" variant="overline">{stat.label}</Typography>
              <Typography variant="h4" sx={{ color: stat.color, fontWeight: 'bold' }}>
                {stat.val}
              </Typography>
            </StyledCard>
          </Grid>
        ))}
      </Grid>

      {/* Logs Table */}
      <Card elevation={3}>
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Daily Logs</Typography>
          <Button variant="outlined" color="primary">Apply Regularization</Button>
        </Box>
        <Table>
          <TableHead sx={{ bgcolor: 'grey.100' }}>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Check In</TableCell>
              <TableCell>Check Out</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {attendanceData.map((row, index) => (
              <TableRow key={index}>
                <TableCell>{row.date}</TableCell>
                <TableCell>{row.in}</TableCell>
                <TableCell>{row.out}</TableCell>
                <TableCell>
                  <Chip 
                    label={row.type} 
                    color={getStatusColor(row.type)} 
                    size="small" 
                    variant="outlined" 
                  />
                </TableCell>
                <TableCell align="right">
                  {row.type === 'Late' && (
                    <Button size="small" color="secondary">Regularize</Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </Box>
  );
};

export default AttendanceView;