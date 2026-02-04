import React from "react";
import { useNavigate } from "react-router-dom";
import { 
  Box, Grid, Card, Typography, Button, IconButton, 
  List, ListItem, ListItemIcon, ListItemText, Divider,
  Avatar, Chip
} from "@mui/material";
import { 
  Group, AssignmentTurnedIn, AttachMoney, Warning, 
  Gavel, CheckCircle, TrendingUp, NotificationsActive,
  DateRange, Description, AssignmentLate, School,
  ArrowForward
} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import ReactEcharts from "echarts-for-react";

const AdminDashboard = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  // ---------------------------------------------------------
  // 1. SUMMARY CARDS DATA
  // ---------------------------------------------------------
  const summaryCards = [
    { title: "Total Active Faculty", value: "142", icon: Group, color: theme.palette.primary.main, bg: theme.palette.primary.light },
    { title: "Pending Approvals", value: "28", icon: AssignmentTurnedIn, color: theme.palette.warning.main, bg: "rgba(255, 152, 0, 0.15)" },
    { title: "Leave Requests", value: "12", icon: DateRange, color: "#e91e63", bg: "rgba(233, 30, 99, 0.15)" },
    { title: "Reimbursements", value: "8", icon: AttachMoney, color: theme.palette.success.main, bg: "rgba(76, 175, 80, 0.15)" },
    { title: "Open Grievances", value: "3", icon: Warning, color: theme.palette.error.main, bg: "rgba(244, 67, 54, 0.15)" },
    { title: "Policy Compliance", value: "94%", icon: Gavel, color: "#9c27b0", bg: "rgba(156, 39, 176, 0.15)" },
  ];

  // ---------------------------------------------------------
  // 2. CHARTS CONFIGURATION
  // ---------------------------------------------------------
  
  // A. Faculty Distribution by Department (Pie Chart)
  const facultyDistOption = {
    color: [theme.palette.primary.main, '#e91e63', '#9c27b0', theme.palette.success.main, theme.palette.warning.main],
    tooltip: { trigger: 'item' },
    legend: { bottom: '0%', left: 'center' },
    series: [{
      name: 'Faculty',
      type: 'pie',
      radius: ['40%', '70%'],
      avoidLabelOverlap: false,
      itemStyle: { borderRadius: 10, borderColor: '#fff', borderWidth: 2 },
      label: { show: false, position: 'center' },
      data: [
        { value: 45, name: 'CSE' },
        { value: 35, name: 'ECE' },
        { value: 25, name: 'Mech' },
        { value: 20, name: 'Civil' },
        { value: 17, name: 'Science' }
      ]
    }]
  };

  // B. Monthly Leave Trends (Bar Graph)
  const leaveTrendsOption = {
    grid: { top: 30, bottom: 20, left: 30, right: 10, containLabel: true },
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'] },
    yAxis: { type: 'value' },
    series: [{
      data: [12, 18, 15, 25, 10, 8],
      type: 'bar',
      itemStyle: { color: theme.palette.info.main, borderRadius: [4, 4, 0, 0] },
      barWidth: '40%'
    }]
  };

  // C. Budget Utilization vs Allocated (Line Graph)
  const budgetOption = {
    grid: { top: 30, bottom: 20, left: 30, right: 20, containLabel: true },
    tooltip: { trigger: 'axis' },
    legend: { data: ['Allocated', 'Utilized'], bottom: 0 },
    xAxis: { type: 'category', data: ['Q1', 'Q2', 'Q3', 'Q4'] },
    yAxis: { type: 'value' },
    series: [
      { name: 'Allocated', type: 'line', data: [50, 50, 50, 50], itemStyle: { color: theme.palette.grey[500] }, lineStyle: { type: 'dashed' } },
      { name: 'Utilized', type: 'line', smooth: true, data: [12, 28, 35, 42], itemStyle: { color: theme.palette.success.main }, areaStyle: { opacity: 0.1 } }
    ]
  };

  // D. Top 5 Departments by Research Output (Bar Graph)
  const researchOption = {
    grid: { top: 10, bottom: 20, left: 80, right: 10 },
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'value' },
    yAxis: { type: 'category', data: ['Civil', 'Mech', 'ECE', 'AI&DS', 'CSE'] },
    series: [{
      name: 'Publications',
      type: 'bar',
      data: [12, 19, 23, 28, 42],
      itemStyle: { color: '#673ab7', borderRadius: [0, 4, 4, 0] }
    }]
  };

  // ---------------------------------------------------------
  // 3. ALERTS & NOTIFICATIONS DATA
  // ---------------------------------------------------------
  const alerts = [
    { id: 1, text: "Faculty probation ending in 30 days (3 Faculty)", icon: AssignmentLate, color: theme.palette.warning.main },
    { id: 2, text: "Service bonds expiring next week (Dr. A. Kumar)", icon: Description, color: theme.palette.error.main },
    { id: 3, text: "IT Policy requiring renewal approval", icon: Gavel, color: theme.palette.info.main },
    { id: 4, text: "Overdue PBAS submissions (Dept: Civil)", icon: AssignmentTurnedIn, color: theme.palette.text.secondary },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" fontWeight="bold">Dashboard & Analytics</Typography>
        <Chip label="Academic Year 2025-26" color="primary" variant="outlined" />
      </Box>

      {/* =========================================
          SECTION 1: SUMMARY CARDS
      ========================================= */}
      <Grid container spacing={3} mb={4}>
        {summaryCards.map((stat, i) => (
          <Grid item xs={12} sm={6} md={4} lg={2} key={i}>
            <Card sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', height: '100%', boxShadow: 2 }}>
              <Box sx={{ p: 1.5, borderRadius: '50%', bgcolor: stat.bg, color: stat.color, mb: 1 }}>
                <stat.icon />
              </Box>
              <Typography variant="h4" fontWeight="bold" color="text.primary">{stat.value}</Typography>
              <Typography variant="caption" fontWeight="medium" color="text.secondary">{stat.title}</Typography>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* =========================================
            SECTION 2: CHARTS & VISUALIZATIONS
        ========================================= */}
        
        {/* Row 1 of Charts */}
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 3, height: '100%' }}>
            <Typography variant="subtitle1" fontWeight="bold" mb={2}>Faculty Distribution</Typography>
            <ReactEcharts option={facultyDistOption} style={{ height: '250px' }} />
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ p: 3, height: '100%' }}>
            <Typography variant="subtitle1" fontWeight="bold" mb={2}>Monthly Leave Trends</Typography>
            <ReactEcharts option={leaveTrendsOption} style={{ height: '250px' }} />
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ p: 3, height: '100%' }}>
            <Typography variant="subtitle1" fontWeight="bold" mb={2}>Budget Utilization (Lakhs)</Typography>
            <ReactEcharts option={budgetOption} style={{ height: '250px' }} />
          </Card>
        </Grid>

        {/* Row 2: Research & Widgets */}
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3, height: '100%' }}>
            <Typography variant="subtitle1" fontWeight="bold" mb={2}>Top Departments (Research Output)</Typography>
            <ReactEcharts option={researchOption} style={{ height: '250px' }} />
          </Card>
        </Grid>

        {/* =========================================
            SECTION 3: QUICK ACTIONS & ALERTS
        ========================================= */}
        <Grid item xs={12} md={6}>
          <Grid container spacing={3} height="100%">
            
            {/* Quick Actions Widget */}
            <Grid item xs={12} sm={6}>
              <Card sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Typography variant="subtitle1" fontWeight="bold" mb={2} display="flex" alignItems="center" gap={1}>
                  <TrendingUp fontSize="small" color="action"/> Quick Actions
                </Typography>
                
                <Box display="flex" flexDirection="column" gap={1.5} flexGrow={1}>
                  <Button 
                    variant="outlined" color="primary" fullWidth sx={{ justifyContent: 'flex-start' }}
                    startIcon={<DateRange />} onClick={() => navigate('/admin/hr/leaves')}
                  >
                    Approve Leaves
                  </Button>
                  <Button 
                    variant="outlined" color="success" fullWidth sx={{ justifyContent: 'flex-start' }}
                    startIcon={<AttachMoney />} onClick={() => navigate('/admin/finance/claims')}
                  >
                    Process Claims
                  </Button>
                  <Button 
                    variant="outlined" color="error" fullWidth sx={{ justifyContent: 'flex-start' }}
                    startIcon={<Warning />} onClick={() => navigate('/admin/grievance/queue')}
                  >
                    Review Grievances
                  </Button>
                  <Button 
                    variant="outlined" color="secondary" fullWidth sx={{ justifyContent: 'flex-start' }}
                    startIcon={<School />} onClick={() => navigate('/admin/reports')}
                  >
                    Generate Reports
                  </Button>
                </Box>
              </Card>
            </Grid>

            {/* Alerts & Notifications Widget */}
            <Grid item xs={12} sm={6}>
              <Card sx={{ p: 0, height: '100%' }}>
                <Box p={2} borderBottom={`1px solid ${theme.palette.divider}`} bgcolor={theme.palette.action.hover}>
                  <Typography variant="subtitle1" fontWeight="bold" display="flex" alignItems="center" gap={1}>
                    <NotificationsActive fontSize="small" color="error" /> Critical Alerts
                  </Typography>
                </Box>
                
                <List dense>
                  {alerts.map((alert) => (
                    <React.Fragment key={alert.id}>
                      <ListItem>
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <alert.icon sx={{ color: alert.color, fontSize: 20 }} />
                        </ListItemIcon>
                        <ListItemText 
                          primary={alert.text} 
                          primaryTypographyProps={{ variant: 'body2', fontSize: '0.8rem' }}
                        />
                      </ListItem>
                      {alert.id !== alerts.length && <Divider component="li" />}
                    </React.Fragment>
                  ))}
                </List>
                <Box p={1} textAlign="center">
                  <Button size="small" endIcon={<ArrowForward />}>View All Notifications</Button>
                </Box>
              </Card>
            </Grid>

          </Grid>
        </Grid>

      </Grid>
    </Box>
  );
};

export default AdminDashboard;