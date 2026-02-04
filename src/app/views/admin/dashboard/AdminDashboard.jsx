import React from "react";
import { 
  Box, Grid, Card, Typography, IconButton, Chip, 
  Table, TableBody, TableCell, TableHead, TableRow, 
  Button // <--- ADDED THIS IMPORT
} from "@mui/material";
import { 
  Group, AttachMoney, AssignmentTurnedIn, Warning, 
  ArrowForward, CheckCircle, Cancel 
} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import ReactEcharts from "echarts-for-react";

const AdminDashboard = () => {
  const theme = useTheme();

  // Mock Data
  const stats = [
    { title: "Total Faculty", value: "142", icon: Group, color: "primary.main", bg: "primary.light" },
    { title: "Pending Leaves", value: "8", icon: AssignmentTurnedIn, color: "warning.main", bg: "warning.light" },
    { title: "Claims Pending", value: "₹4.2L", icon: AttachMoney, color: "success.main", bg: "success.light" },
    { title: "Grievances", value: "3", icon: Warning, color: "error.main", bg: "error.light" },
  ];

  const recentRequests = [
    { id: "REQ-001", name: "Dr. Sarah Smith", type: "Travel Claim", date: "2 mins ago", status: "Pending" },
    { id: "REQ-002", name: "Prof. Rajan", type: "Medical Leave", date: "1 hour ago", status: "Approved" },
    { id: "REQ-003", name: "Dr. Emily", type: "Asset Request", date: "3 hours ago", status: "Rejected" },
  ];

  const attendanceOption = {
    tooltip: { trigger: 'item' },
    series: [{
      type: 'pie', radius: ['40%', '70%'], avoidLabelOverlap: false,
      label: { show: false },
      data: [
        { value: 120, name: 'Present', itemStyle: { color: theme.palette.success.main } },
        { value: 12, name: 'On Leave', itemStyle: { color: theme.palette.warning.main } },
        { value: 10, name: 'Absent', itemStyle: { color: theme.palette.error.main } }
      ]
    }]
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>Admin Control Center</Typography>

      {/* 1. KEY METRICS */}
      <Grid container spacing={3} mb={4}>
        {stats.map((stat, i) => (
          <Grid item xs={12} sm={6} md={3} key={i}>
            <Card sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ p: 2, borderRadius: 2, bgcolor: stat.bg, color: stat.color }}>
                <stat.icon />
              </Box>
              <Box>
                <Typography variant="h4" fontWeight="bold">{stat.value}</Typography>
                <Typography variant="body2" color="text.secondary">{stat.title}</Typography>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* 2. ATTENDANCE OVERVIEW */}
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 3, height: '100%' }}>
            <Typography variant="subtitle1" fontWeight="bold">Today's Attendance</Typography>
            <ReactEcharts option={attendanceOption} style={{ height: '250px' }} />
            <Box textAlign="center">
              <Typography variant="h6">85%</Typography>
              <Typography variant="caption" color="text.secondary">Faculty Present</Typography>
            </Box>
          </Card>
        </Grid>

        {/* 3. PENDING ACTIONS */}
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 0 }}>
            <Box sx={{ p: 2, borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="subtitle1" fontWeight="bold">Recent Requests</Typography>
              <Button size="small" endIcon={<ArrowForward />}>View All</Button>
            </Box>
            <Table>
              <TableHead sx={{ bgcolor: 'grey.50' }}>
                <TableRow>
                  <TableCell>Faculty</TableCell>
                  <TableCell>Request Type</TableCell>
                  <TableCell>Time</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {recentRequests.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell fontWeight="bold">{row.name}</TableCell>
                    <TableCell>{row.type}</TableCell>
                    <TableCell>{row.date}</TableCell>
                    <TableCell>
                      <Chip 
                        label={row.status} 
                        size="small" 
                        color={row.status === 'Approved' ? 'success' : row.status === 'Pending' ? 'warning' : 'error'} 
                      />
                    </TableCell>
                    <TableCell align="right">
                      {row.status === 'Pending' && (
                        <>
                          <IconButton color="success" size="small"><CheckCircle /></IconButton>
                          <IconButton color="error" size="small"><Cancel /></IconButton>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboard;