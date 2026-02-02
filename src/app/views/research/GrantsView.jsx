import React, { useState } from 'react';
import { 
  Box, Card, Grid, Typography, Button, Tabs, Tab, Chip, Stack, 
  LinearProgress, Table, TableHead, TableBody, TableRow, TableCell, 
  MenuItem, TextField, IconButton, Alert, Divider, Paper
} from "@mui/material";
import { 
  TrendingUp, AccountBalance, Group, Description, 
  NotificationsActive, CheckCircle, Cancel, Download, 
  Timeline, Add, Assignment 
} from '@mui/icons-material';
import ReactEcharts from "echarts-for-react";
import { useTheme } from '@mui/material/styles';

import useGrantSystem from "../../hooks/useGrantSystem";

const GrantsView = () => {
  const theme = useTheme();
  const { 
    opportunities, applications, projects, 
    budgetHeads, team, deliverables, reports 
  } = useGrantSystem();

  const [mainTab, setMainTab] = useState(0); // 0: Dashboard, 1: Projects, 2: Applications
  const [selectedProject, setSelectedProject] = useState(projects[0].id);
  const [projectTab, setProjectTab] = useState(0); // Sub-tabs for Project View

  // Chart: Budget Utilization
  const budgetOption = {
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    legend: { bottom: 0 },
    grid: { left: '3%', right: '4%', bottom: '10%', containLabel: true },
    xAxis: { type: 'value', boundaryGap: [0, 0.01] },
    yAxis: { type: 'category', data: budgetHeads.map(b => b.head) },
    series: [
      {
        name: 'Allocated',
        type: 'bar',
        data: budgetHeads.map(b => b.allocated),
        itemStyle: { color: theme.palette.grey[300] }
      },
      {
        name: 'Used',
        type: 'bar',
        data: budgetHeads.map(b => b.used),
        itemStyle: { color: theme.palette.primary.main }
      }
    ]
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>Grants & Research Projects</Typography>

      <Card elevation={3} sx={{ minHeight: 600 }}>
        <Tabs 
          value={mainTab} 
          onChange={(e, v) => setMainTab(v)} 
          sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'grey.50' }}
        >
          <Tab icon={<TrendingUp />} label="Overview & Alerts" iconPosition="start" />
          <Tab icon={<AccountBalance />} label="Active Projects" iconPosition="start" />
          <Tab icon={<Timeline />} label="Application Tracker" iconPosition="start" />
        </Tabs>

        <Box p={3}>
          {/* TAB 0: OVERVIEW & ALERTS */}
          {mainTab === 0 && (
            <Grid container spacing={4}>
              <Grid item xs={12} md={8}>
                <Typography variant="h6" gutterBottom>Upcoming Funding Opportunities</Typography>
                <Stack spacing={2}>
                  {opportunities.map((opp) => (
                    <Card key={opp.id} variant="outlined" sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                       <Box>
                         <Stack direction="row" spacing={1} mb={0.5}>
                           <Chip label={opp.agency} size="small" color="primary" sx={{ fontWeight: 'bold' }} />
                           <Typography variant="subtitle1" fontWeight="bold">{opp.scheme}</Typography>
                         </Stack>
                         <Typography variant="body2" color="text.secondary">
                           Grant: {opp.grantAmount} • Deadline: <span style={{ color: 'red' }}>{opp.deadline}</span>
                         </Typography>
                       </Box>
                       <Box textAlign="right">
                         <Chip label={`${opp.match} Match`} size="small" color={opp.match === 'High' ? "success" : "warning"} variant="outlined" />
                         <Button size="small" sx={{ display: 'block', mt: 1 }}>View Call</Button>
                       </Box>
                    </Card>
                  ))}
                </Stack>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card sx={{ p: 3, bgcolor: 'primary.light', color: 'white', mb: 3 }}>
                   <Typography variant="overline">TOTAL ACTIVE GRANTS</Typography>
                   <Typography variant="h3" fontWeight="bold">₹57.0L</Typography>
                   <Typography variant="caption">Across {projects.length} Projects</Typography>
                </Card>
                <Card variant="outlined" sx={{ p: 2 }}>
                   <Typography variant="subtitle2" fontWeight="bold" gutterBottom>Pending Actions</Typography>
                   <Stack spacing={1}>
                      <Alert severity="warning" sx={{ py: 0 }}>Submit UC for DST Project</Alert>
                      <Alert severity="info" sx={{ py: 0 }}>Review JRF Applications</Alert>
                   </Stack>
                </Card>
              </Grid>
            </Grid>
          )}

          {/* TAB 1: ACTIVE PROJECTS MANAGER */}
          {mainTab === 1 && (
            <Box>
              {/* Project Selector Toolbar */}
              <Paper variant="outlined" sx={{ p: 2, mb: 3, display: 'flex', alignItems: 'center', gap: 2, bgcolor: 'grey.50' }}>
                 <Typography fontWeight="bold">Select Project:</Typography>
                 <TextField 
                   select 
                   size="small" 
                   value={selectedProject} 
                   onChange={(e) => setSelectedProject(e.target.value)}
                   sx={{ minWidth: 300, bgcolor: 'white' }}
                 >
                   {projects.map((p) => (
                     <MenuItem key={p.id} value={p.id}>{p.id} - {p.title}</MenuItem>
                   ))}
                 </TextField>
                 <Chip label="Active" color="success" size="small" />
              </Paper>

              <Tabs 
                value={projectTab} 
                onChange={(e, v) => setProjectTab(v)} 
                variant="fullWidth"
                sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}
              >
                <Tab label="Financials" />
                <Tab label="Team" />
                <Tab label="Deliverables" />
                <Tab label="Reporting & UC" />
              </Tabs>

              {/* Sub-Tab: Financials */}
              {projectTab === 0 && (
                <Grid container spacing={3}>
                  <Grid item xs={12} md={7}>
                    <Typography variant="subtitle1" fontWeight="bold">Budget vs Actuals</Typography>
                    <ReactEcharts option={budgetOption} style={{ height: '300px' }} />
                  </Grid>
                  <Grid item xs={12} md={5}>
                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>Expenditure Summary</Typography>
                    <Stack spacing={2}>
                      {budgetHeads.map((head, i) => (
                        <Box key={i}>
                          <Box display="flex" justifyContent="space-between">
                            <Typography variant="body2">{head.head}</Typography>
                            <Typography variant="caption">{Math.round((head.used/head.allocated)*100)}% Utilized</Typography>
                          </Box>
                          <LinearProgress variant="determinate" value={(head.used/head.allocated)*100} sx={{ height: 6, borderRadius: 3, my: 0.5 }} />
                          <Typography variant="caption" color="text.secondary">₹{head.used.toLocaleString()} / ₹{head.allocated.toLocaleString()}</Typography>
                        </Box>
                      ))}
                    </Stack>
                    <Button variant="outlined" fullWidth sx={{ mt: 3 }} startIcon={<Add />}>Log New Expense</Button>
                  </Grid>
                </Grid>
              )}

              {/* Sub-Tab: Team */}
              {projectTab === 1 && (
                <Table>
                  <TableHead sx={{ bgcolor: 'grey.100' }}>
                    <TableRow><TableCell>Name</TableCell><TableCell>Role</TableCell><TableCell>Join Date</TableCell><TableCell>Status</TableCell></TableRow>
                  </TableHead>
                  <TableBody>
                    {team.map((member) => (
                      <TableRow key={member.id}>
                        <TableCell fontWeight="bold">{member.name}</TableCell>
                        <TableCell>{member.role}</TableCell>
                        <TableCell>{member.joinDate}</TableCell>
                        <TableCell><Chip label={member.status} size="small" color="success" variant="outlined" /></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}

              {/* Sub-Tab: Deliverables */}
              {projectTab === 2 && (
                <Grid container spacing={2}>
                  {deliverables.map((item) => (
                    <Grid item xs={12} md={6} key={item.id}>
                      <Card variant="outlined" sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                         <Description color="action" />
                         <Box flex={1}>
                           <Typography variant="subtitle2" fontWeight="bold">{item.title}</Typography>
                           <Typography variant="caption">{item.status}</Typography>
                         </Box>
                         <Chip label={item.type} size="small" />
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}

              {/* Sub-Tab: Reporting */}
              {projectTab === 3 && (
                <Table>
                  <TableHead sx={{ bgcolor: 'grey.100' }}>
                    <TableRow><TableCell>Report Type</TableCell><TableCell>Due Date</TableCell><TableCell>Status</TableCell><TableCell align="right">Action</TableCell></TableRow>
                  </TableHead>
                  <TableBody>
                    {reports.map((rpt) => (
                      <TableRow key={rpt.id}>
                        <TableCell fontWeight="bold">{rpt.title}</TableCell>
                        <TableCell sx={{ color: rpt.status === 'Pending' ? 'error.main' : 'inherit' }}>{rpt.due}</TableCell>
                        <TableCell>
                          <Chip 
                            label={rpt.status} 
                            size="small" 
                            color={rpt.status === 'Submitted' ? 'success' : 'warning'} 
                          />
                        </TableCell>
                        <TableCell align="right">
                          {rpt.status === 'Submitted' ? (
                            <IconButton color="primary"><Download /></IconButton>
                          ) : (
                            <Button size="small" variant="contained" startIcon={<Assignment />}>Submit</Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </Box>
          )}

          {/* TAB 2: APPLICATION TRACKER */}
          {mainTab === 2 && (
            <Box>
              <Box display="flex" justifyContent="space-between" mb={2}>
                <Typography variant="h6">My Grant Applications</Typography>
                <Button variant="contained" startIcon={<Add />}>New Application</Button>
              </Box>
              <Table sx={{ border: '1px solid #eee' }}>
                <TableHead sx={{ bgcolor: 'grey.100' }}>
                  <TableRow>
                    <TableCell>Project Title</TableCell>
                    <TableCell>Agency</TableCell>
                    <TableCell>Submitted On</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Feedback</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {applications.map((app) => (
                    <TableRow key={app.id}>
                      <TableCell fontWeight="bold">{app.title}</TableCell>
                      <TableCell>{app.agency}</TableCell>
                      <TableCell>{app.submitted}</TableCell>
                      <TableCell>
                        <Chip 
                          label={app.status} 
                          size="small" 
                          color={app.status === 'Shortlisted' ? 'success' : app.status === 'Rejected' ? 'error' : 'primary'} 
                        />
                      </TableCell>
                      <TableCell>
                        {app.feedback ? (
                          <Typography variant="caption" color="error">{app.feedback}</Typography>
                        ) : (
                          <Typography variant="caption" color="text.secondary">-</Typography>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          )}
        </Box>
      </Card>
    </Box>
  );
};

export default GrantsView;