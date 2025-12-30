import React from "react";
import { 
  Box, Grid, Card, CardContent, Typography, Button, 
  Avatar, IconButton, LinearProgress, Chip, Stack 
} from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import ReactEcharts from "echarts-for-react"; 
import { 
  Description, AttachMoney, AccessTime, School, 
  ArrowForward, Add, EmojiEvents, Science 
} from "@mui/icons-material";

// --- Styled Components for "Beautiful" UI ---
const WelcomeCard = styled(Card)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
  color: "#fff",
  borderRadius: "16px",
  position: "relative",
  overflow: "hidden",
  marginBottom: "24px",
}));

const StatCard = styled(Card)(({ theme }) => ({
  borderRadius: "16px",
  height: "100%",
  transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: theme.shadows[8],
  },
}));

const IconBox = styled(Box)(({ color, theme }) => ({
  width: 50,
  height: 50,
  borderRadius: "12px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: color || theme.palette.primary.light,
  color: "#fff",
  marginBottom: "16px",
}));

// --- Charts Configuration ---
const getChartOption = (theme) => ({
  tooltip: { trigger: 'axis' },
  grid: { top: '10%', bottom: '10%', left: '3%', right: '4%', containLabel: true },
  xAxis: { 
    type: 'category', 
    data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    axisLine: { show: false },
    axisTick: { show: false },
  },
  yAxis: { 
    type: 'value', 
    splitLine: { lineStyle: { type: 'dashed', color: '#eee' } } 
  },
  series: [
    {
      name: 'Lectures',
      type: 'bar',
      barWidth: 20,
      itemStyle: { color: theme.palette.primary.main, borderRadius: [4, 4, 0, 0] },
      data: [12, 18, 14, 22, 16, 25]
    },
    {
      name: 'Research Hours',
      type: 'line',
      smooth: true,
      lineStyle: { width: 4, color: theme.palette.secondary.main },
      symbol: 'none',
      data: [30, 35, 28, 40, 32, 45]
    }
  ]
});

const DefaultDashboard = () => {
  const theme = useTheme();

  return (
    <Box sx={{ p: 3, backgroundColor: '#f3f4f6', minHeight: '100vh' }}>
      
      {/* 1. Welcome Section */}
      <WelcomeCard elevation={4}>
        <CardContent sx={{ p: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Welcome back, Dr. Naveen!
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9, mb: 2 }}>
              You have <strong style={{color: '#ffeb3b'}}>3 pending approvals</strong> and an upcoming Academic Council meeting today.
            </Typography>
            <Stack direction="row" spacing={2}>
              <Button variant="contained" color="secondary" startIcon={<Add />}>
                Log Activity
              </Button>
              <Button variant="outlined" sx={{ color: 'white', borderColor: 'white' }}>
                View Schedule
              </Button>
            </Stack>
          </Box>
          <Box sx={{ display: { xs: 'none', md: 'block' } }}>
             {/* Decorative Element or Illustration could go here */}
             <School sx={{ fontSize: 120, opacity: 0.2 }} />
          </Box>
        </CardContent>
      </WelcomeCard>

      {/* 2. Quick Stats Overview */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[
          { title: "Attendance", value: "92%", sub: "2 Late this month", icon: AccessTime, color: theme.palette.success.main },
          { title: "Publications", value: "12", sub: "+2 this year", icon: Science, color: theme.palette.info.main },
          { title: "Reimbursements", value: "$450", sub: "Pending Processing", icon: AttachMoney, color: theme.palette.warning.main },
          { title: "Service Bond", value: "1 Yr 2 M", sub: "Remaining", icon: Description, color: theme.palette.error.main },
        ].map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <StatCard elevation={2}>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="start">
                  <IconBox color={stat.color}>
                    <stat.icon />
                  </IconBox>
                  <IconButton size="small"><ArrowForward fontSize="small" /></IconButton>
                </Box>
                <Typography variant="h4" fontWeight="bold" color="text.primary">
                  {stat.value}
                </Typography>
                <Typography variant="subtitle2" color="text.secondary" fontWeight="medium">
                  {stat.title}
                </Typography>
                <Typography variant="caption" color="text.disabled" sx={{ mt: 1, display: 'block' }}>
                  {stat.sub}
                </Typography>
              </CardContent>
            </StatCard>
          </Grid>
        ))}
      </Grid>

      {/* 3. Main Content: Charts & Tasks */}
      <Grid container spacing={3}>
        
        {/* Left Col: Analytics */}
        <Grid item xs={12} md={8}>
          <Card elevation={2} sx={{ borderRadius: "16px", p: 2, height: '100%' }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} px={2}>
              <Typography variant="h6" fontWeight="bold">Academic Performance</Typography>
              <Chip label="This Semester" color="primary" variant="outlined" size="small" />
            </Box>
            <ReactEcharts option={getChartOption(theme)} style={{ height: '350px' }} />
          </Card>
        </Grid>

        {/* Right Col: Recent Activity & Tasks */}
        <Grid item xs={12} md={4}>
          <Card elevation={2} sx={{ borderRadius: "16px", height: '100%' }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Recent Activity
              </Typography>
              
              <Stack spacing={3} sx={{ mt: 3 }}>
                {[
                  { label: "Leave Approved", date: "2 hrs ago", icon: EmojiEvents, color: "success" },
                  { label: "New Policy: IT Usage", date: "Yesterday", icon: Description, color: "primary" },
                  { label: "Grant Submission Due", date: "Oct 28", icon: AccessTime, color: "warning" },
                ].map((item, i) => (
                  <Box key={i} display="flex" alignItems="center" gap={2}>
                    <Avatar sx={{ bgcolor: `${item.color}.light`, color: `${item.color}.main`, width: 40, height: 40 }}>
                      <item.icon fontSize="small" />
                    </Avatar>
                    <Box flex={1}>
                      <Typography variant="subtitle2" fontWeight="bold">{item.label}</Typography>
                      <Typography variant="caption" color="text.secondary">{item.date}</Typography>
                    </Box>
                  </Box>
                ))}
              </Stack>

              <Box mt={4}>
                <Typography variant="subtitle2" gutterBottom>Storage Quota (Assets)</Typography>
                <Box display="flex" alignItems="center" gap={1}>
                  <LinearProgress variant="determinate" value={70} sx={{ flex: 1, height: 8, borderRadius: 5 }} />
                  <Typography variant="caption" fontWeight="bold">70%</Typography>
                </Box>
              </Box>

            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DefaultDashboard;