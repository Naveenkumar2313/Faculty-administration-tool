import React, { useState } from 'react';
import { 
  Box, Tabs, Tab, Card, Typography, Button, Grid, Chip, 
  Table, TableBody, TableCell, TableHead, TableRow, 
  Stack, Avatar, LinearProgress, Divider, Link 
} from "@mui/material";
import { 
  Work, School, Gavel, Handshake, Mic, Description, 
  Newspaper, AssignmentInd, Add, OpenInNew 
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

import useEngagementSystem from "../../hooks/useEngagementSystem";

const EngagementView = () => {
  const theme = useTheme();
  const { 
    stats, consultancy, guestLectures, examDuties, 
    thesisEvaluation, expertTalks, collaborations, services, media 
  } = useEngagementSystem();

  const [tabIndex, setTabIndex] = useState(0);

  const tabs = [
    { label: "Consultancy", icon: Work },
    { label: "Guest Lectures", icon: School },
    { label: "Exam Duties", icon: AssignmentInd },
    { label: "Thesis Examiner", icon: Gavel },
    { label: "Expert Talks", icon: Mic },
    { label: "Industry Collab", icon: Handshake },
    { label: "Prof. Services", icon: Description },
    { label: "Media", icon: Newspaper },
  ];

  return (
    <Box sx={{ p: 3 }}>
      {/* 1. IMPACT DASHBOARD */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3, bgcolor: 'primary.main', color: 'white' }}>
            <Typography variant="overline" sx={{ opacity: 0.8 }}>TOTAL GENERATED REVENUE (YTD)</Typography>
            <Typography variant="h3" fontWeight="bold">₹{stats.totalRevenue.toLocaleString()}</Typography>
            <Box mt={2} display="flex" gap={3}>
               <Box>
                 <Typography variant="h6" fontWeight="bold">{stats.talksCount}</Typography>
                 <Typography variant="caption">Talks Delivered</Typography>
               </Box>
               <Box>
                 <Typography variant="h6" fontWeight="bold">{stats.collabCount}</Typography>
                 <Typography variant="caption">Active MoUs</Typography>
               </Box>
               <Box>
                 <Typography variant="h6" fontWeight="bold">12</Typography>
                 <Typography variant="caption">Citations This Month</Typography>
               </Box>
            </Box>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
           <Card sx={{ p: 3, height: '100%' }}>
             <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
               <Typography variant="subtitle2" fontWeight="bold">Outreach Goal</Typography>
               <Chip label="75%" size="small" color="success" />
             </Box>
             <LinearProgress variant="determinate" value={75} color="success" sx={{ height: 10, borderRadius: 5, mb: 2 }} />
             <Typography variant="body2" color="text.secondary">
               You have delivered <strong>{stats.talksCount}</strong> talks this year. Target is 10.
             </Typography>
             <Button variant="outlined" size="small" sx={{ mt: 2 }} startIcon={<Add />}>
               Log New Activity
             </Button>
           </Card>
        </Grid>
      </Grid>

      {/* 2. MAIN TABS */}
      <Card elevation={3}>
        <Tabs 
          value={tabIndex} 
          onChange={(e, v) => setTabIndex(v)} 
          variant="scrollable"
          scrollButtons="auto"
          sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'grey.50' }}
        >
          {tabs.map((tab, i) => (
            <Tab key={i} icon={<tab.icon />} label={tab.label} iconPosition="start" />
          ))}
        </Tabs>
        
        <Box p={3}>
          {/* TAB 0: CONSULTANCY */}
          {tabIndex === 0 && (
            <Box>
              <Box display="flex" justifyContent="space-between" mb={2}>
                 <Typography variant="h6">Industrial Consultancy</Typography>
                 <Button variant="contained" size="small">Add Project</Button>
              </Box>
              <Table>
                <TableHead sx={{ bgcolor: 'grey.100' }}>
                   <TableRow><TableCell>Project Title</TableCell><TableCell>Client</TableCell><TableCell>Role</TableCell><TableCell>Revenue</TableCell><TableCell>Status</TableCell></TableRow>
                </TableHead>
                <TableBody>
                   {consultancy.map((row) => (
                     <TableRow key={row.id}>
                        <TableCell fontWeight="bold">{row.title}</TableCell>
                        <TableCell>{row.client}</TableCell>
                        <TableCell>{row.role}</TableCell>
                        <TableCell>₹{row.revenue.toLocaleString()}</TableCell>
                        <TableCell><Chip label={row.status} size="small" color={row.status === 'Ongoing' ? 'success' : 'default'} /></TableCell>
                     </TableRow>
                   ))}
                </TableBody>
              </Table>
            </Box>
          )}

          {/* TAB 1: GUEST LECTURES */}
          {tabIndex === 1 && (
            <Box>
              <Typography variant="h6" gutterBottom>Guest Lectures Delivered</Typography>
               {guestLectures.map(gl => (
                 <Card key={gl.id} variant="outlined" sx={{ p: 2, mb: 2 }}>
                    <Grid container alignItems="center">
                       <Grid item xs={12} md={8}>
                          <Typography variant="subtitle1" fontWeight="bold">{gl.topic}</Typography>
                          <Typography variant="body2" color="text.secondary">Host: {gl.host}</Typography>
                       </Grid>
                       <Grid item xs={12} md={4} textAlign={{ xs: 'left', md: 'right' }}>
                          <Chip label={gl.date} size="small" />
                       </Grid>
                    </Grid>
                 </Card>
               ))}
            </Box>
          )}

          {/* TAB 2: EXAM DUTIES */}
          {tabIndex === 2 && (
            <Box>
              <Typography variant="h6" gutterBottom>General Exam Duties</Typography>
              <Table size="small">
                <TableHead><TableRow><TableCell>Institution</TableCell><TableCell>Role</TableCell><TableCell>Date</TableCell><TableCell>Status</TableCell></TableRow></TableHead>
                <TableBody>
                   {examDuties.map((row) => (
                     <TableRow key={row.id}>
                        <TableCell>{row.institution}</TableCell>
                        <TableCell>{row.role}</TableCell>
                        <TableCell>{row.date}</TableCell>
                        <TableCell><Chip label={row.status} size="small" color="primary" variant="outlined" /></TableCell>
                     </TableRow>
                   ))}
                </TableBody>
              </Table>
            </Box>
          )}

          {/* TAB 3: THESIS EXAMINER (PhD/Master's) */}
          {tabIndex === 3 && (
            <Box>
              <Typography variant="h6" gutterBottom>PhD & Master's Thesis Evaluation</Typography>
              <Table>
                <TableHead sx={{ bgcolor: 'grey.100' }}>
                   <TableRow>
                     <TableCell>Scholar Name</TableCell>
                     <TableCell>University</TableCell>
                     <TableCell>Thesis Title</TableCell>
                     <TableCell>Type</TableCell>
                     <TableCell>Fee</TableCell>
                     <TableCell>Status</TableCell>
                   </TableRow>
                </TableHead>
                <TableBody>
                   {thesisEvaluation.map((row) => (
                     <TableRow key={row.id}>
                        <TableCell fontWeight="bold">{row.student}</TableCell>
                        <TableCell>{row.university}</TableCell>
                        <TableCell>{row.title}</TableCell>
                        <TableCell><Chip label={row.type} size="small" sx={{ bgcolor: 'purple.50', color: 'purple.700' }} /></TableCell>
                        <TableCell>₹{row.fee}</TableCell>
                        <TableCell><Chip label={row.status} size="small" color={row.status.includes('Pending') ? 'warning' : 'success'} /></TableCell>
                     </TableRow>
                   ))}
                </TableBody>
              </Table>
            </Box>
          )}

          {/* TAB 4: EXPERT TALKS & KEYNOTES */}
          {tabIndex === 4 && (
            <Grid container spacing={3}>
              {expertTalks.map((talk) => (
                <Grid item xs={12} md={6} key={talk.id}>
                  <Card variant="outlined" sx={{ p: 2, height: '100%', borderLeft: '4px solid #9c27b0' }}>
                     <Chip label={talk.type} size="small" sx={{ mb: 1, bgcolor: 'purple.50', color: 'purple.800', fontWeight: 'bold' }} />
                     <Typography variant="subtitle1" fontWeight="bold">{talk.topic}</Typography>
                     <Typography variant="body2" color="text.secondary" gutterBottom>{talk.event}</Typography>
                     <Divider sx={{ my: 1 }} />
                     <Box display="flex" justifyContent="space-between">
                        <Typography variant="caption">{talk.location}</Typography>
                        <Typography variant="caption" fontWeight="bold">{talk.date}</Typography>
                     </Box>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}

          {/* TAB 5: INDUSTRY COLLABORATIONS */}
          {tabIndex === 5 && (
            <Box>
              <Typography variant="h6" gutterBottom>Industry MoUs & Linkages</Typography>
              <Grid container spacing={3}>
                 {collaborations.map((collab) => (
                   <Grid item xs={12} md={6} key={collab.id}>
                      <Card sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2, bgcolor: 'grey.50' }}>
                         <Avatar variant="rounded" sx={{ bgcolor: 'primary.dark' }}>
                           <Handshake />
                         </Avatar>
                         <Box flex={1}>
                            <Typography variant="subtitle1" fontWeight="bold">{collab.partner}</Typography>
                            <Typography variant="body2">{collab.scope} ({collab.type})</Typography>
                            <Typography variant="caption" color="text.secondary">Valid till: {collab.validTill}</Typography>
                         </Box>
                         <Chip label={collab.status} color="success" size="small" />
                      </Card>
                   </Grid>
                 ))}
              </Grid>
            </Box>
          )}

          {/* TAB 6: PROFESSIONAL SERVICES */}
          {tabIndex === 6 && (
            <Box>
              <Typography variant="h6" gutterBottom>Journal & Conference Services</Typography>
              <Stack spacing={2}>
                 {services.map((svc) => (
                   <Card key={svc.id} variant="outlined" sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box>
                         <Typography variant="subtitle1" fontWeight="bold">{svc.role}</Typography>
                         <Typography variant="body2">{svc.organization}</Typography>
                         <Typography variant="caption" color="text.secondary">{svc.details}</Typography>
                      </Box>
                      <Chip label={svc.year} variant="outlined" />
                   </Card>
                 ))}
              </Stack>
            </Box>
          )}

          {/* TAB 7: MEDIA & OUTREACH */}
          {tabIndex === 7 && (
             <Box>
               <Typography variant="h6" gutterBottom>Media Appearances & Articles</Typography>
               <Grid container spacing={2}>
                  {media.map((item) => (
                    <Grid item xs={12} sm={6} md={4} key={item.id}>
                       <Card variant="outlined" sx={{ p: 2 }}>
                          <Stack direction="row" spacing={1} mb={1}>
                             <Chip label={item.type} size="small" color="info" variant="outlined" />
                             <Typography variant="caption" color="text.secondary">{item.date}</Typography>
                          </Stack>
                          <Typography variant="subtitle2" fontWeight="bold" gutterBottom>{item.title}</Typography>
                          <Typography variant="body2" color="text.secondary" paragraph>{item.outlet}</Typography>
                          <Button size="small" startIcon={<OpenInNew />} href={item.link}>View</Button>
                       </Card>
                    </Grid>
                  ))}
               </Grid>
             </Box>
          )}
        </Box>
      </Card>
    </Box>
  );
};

export default EngagementView;