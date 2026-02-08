import React, { useState } from 'react';
import { 
  Box, Card, Grid, Typography, Button, Tabs, Tab, Table, TableBody, 
  TableCell, TableHead, TableRow, Chip, LinearProgress, Stack, 
  IconButton, Divider, TextField, Tooltip, Alert, Badge 
} from "@mui/material";
import { LoadingButton } from '@mui/lab';
import { 
  Description, Timeline, Group, FactCheck, CloudUpload, 
  Link, Warning, VerifiedUser, Science, School, EditNote 
} from '@mui/icons-material';
import ReactEcharts from "echarts-for-react";
import { useTheme } from '@mui/material/styles';

import useResearchSystem from "../../hooks/useResearchSystem";

const PublicationView = () => {
  const theme = useTheme();
  const { 
    metrics, publications, planner, coAuthors, 
    checkPredatory, syncORCID 
  } = useResearchSystem();

  const [tabIndex, setTabIndex] = useState(0);
  const [journalCheck, setJournalCheck] = useState("");
  const [checkResult, setCheckResult] = useState(null);
  const [syncing, setSyncing] = useState(false);

  // Chart: Citation Growth
  const citationOption = {
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: metrics.citationGrowth.map(d => d.year) },
    yAxis: { type: 'value' },
    series: [{
      data: metrics.citationGrowth.map(d => d.count),
      type: 'line',
      smooth: true,
      areaStyle: { opacity: 0.2 },
      itemStyle: { color: theme.palette.primary.main }
    }],
    grid: { top: 20, bottom: 20, left: 40, right: 20 }
  };

  const handleJournalCheck = () => {
    if (!journalCheck) return;
    const result = checkPredatory(journalCheck);
    setCheckResult(result);
  };

  const handleOrcidSync = async () => {
    setSyncing(true);
    await syncORCID();
    setSyncing(false);
    alert("ORCID Sync Complete!");
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" fontWeight="bold">Research & Publications</Typography>
        <LoadingButton 
          loading={syncing}
          variant="outlined" 
          startIcon={<Link />} 
          onClick={handleOrcidSync}
        >
          Sync with ORCID
        </LoadingButton>
      </Box>

      {/* 1. IMPACT DASHBOARD */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Typography variant="subtitle2" fontWeight="bold" gutterBottom>Citation Growth</Typography>
            <Box flex={1}>
               <ReactEcharts option={citationOption} style={{ height: '200px' }} />
            </Box>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Grid container spacing={2}>
             <Grid item xs={6}>
               <Card sx={{ p: 2, textAlign: 'center', bgcolor: 'primary.light', color: 'white' }}>
                 <Typography variant="h3" fontWeight="bold">{metrics.hIndex}</Typography>
                 <Typography variant="caption">h-index</Typography>
               </Card>
             </Grid>
             <Grid item xs={6}>
               <Card sx={{ p: 2, textAlign: 'center', bgcolor: 'secondary.light', color: 'white' }}>
                 <Typography variant="h3" fontWeight="bold">{metrics.i10Index}</Typography>
                 <Typography variant="caption">i10-index</Typography>
               </Card>
             </Grid>
             <Grid item xs={12}>
               <Card sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                 <Box>
                   <Typography variant="h5" fontWeight="bold">{metrics.citations}</Typography>
                   <Typography variant="caption" color="text.secondary">Total Citations</Typography>
                 </Box>
                 <Science sx={{ fontSize: 40, color: 'grey.300' }} />
               </Card>
             </Grid>
             <Grid item xs={12}>
               <Card sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                 <Box>
                   <Typography variant="h5" fontWeight="bold">{metrics.researchGateScore}</Typography>
                   <Typography variant="caption" color="text.secondary">RG Score</Typography>
                 </Box>
                 <School sx={{ fontSize: 40, color: 'grey.300' }} />
               </Card>
             </Grid>
          </Grid>
        </Grid>
      </Grid>

      {/* 2. MAIN TABS */}
      <Card elevation={3}>
        <Tabs 
          value={tabIndex} 
          onChange={(e, v) => setTabIndex(v)} 
          sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'grey.50' }}
        >
          <Tab icon={<Description />} label="My Publications" iconPosition="start" />
          <Tab icon={<Timeline />} label="Planner & Targets" iconPosition="start" />
          <Tab icon={<FactCheck />} label="Predatory Checker" iconPosition="start" />
          <Tab icon={<Group />} label="Co-Authors" iconPosition="start" />
        </Tabs>

        <Box p={4}>
          {/* TAB 0: PUBLICATIONS LIST */}
          {tabIndex === 0 && (
            <Box>
              <Typography variant="h6" gutterBottom>Published Works</Typography>
              <Table>
                <TableHead sx={{ bgcolor: 'grey.100' }}>
                  <TableRow>
                    <TableCell>Title & Journal</TableCell>
                    <TableCell>Year</TableCell>
                    <TableCell>Citations</TableCell>
                    <TableCell>Indexing</TableCell>
                    <TableCell align="right">Proofs</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {publications.map((pub) => (
                    <TableRow key={pub.id}>
                      <TableCell>
                        <Typography variant="subtitle2" fontWeight="bold">{pub.title}</Typography>
                        <Typography variant="caption" color="text.secondary">{pub.journal}</Typography>
                      </TableCell>
                      <TableCell>{pub.year}</TableCell>
                      <TableCell>
                        <Badge badgeContent={pub.citations} color="primary" showZero>
                           <Typography variant="body2" sx={{ px: 1 }}>Refs</Typography>
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1}>
                          {pub.scopus && <Chip label="Scopus" size="small" color="success" variant="outlined" />}
                          {pub.ugcCare && <Chip label="UGC-CARE" size="small" color="primary" variant="outlined" />}
                        </Stack>
                      </TableCell>
                      <TableCell align="right">
                        {pub.proofUploaded ? (
                          <Chip icon={<VerifiedUser />} label="Verified" size="small" color="success" />
                        ) : (
                          <Button size="small" startIcon={<CloudUpload />} color="error">Upload PDF</Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          )}

          {/* TAB 1: PLANNER */}
          {tabIndex === 1 && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                <Typography variant="h6" gutterBottom>Submission Pipeline</Typography>
                {planner.map((item) => (
                  <Card key={item.id} variant="outlined" sx={{ p: 2, mb: 2, display: 'flex', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography variant="subtitle1" fontWeight="bold">{item.title}</Typography>
                      <Typography variant="body2" color="text.secondary">Target: {item.targetJournal}</Typography>
                      <Stack direction="row" spacing={2} mt={1}>
                         <Typography variant="caption" color="error">Due: {item.deadline}</Typography>
                         <Typography variant="caption">Prob: {item.probability}</Typography>
                      </Stack>
                    </Box>
                    <Box textAlign="right">
                      <Chip 
                        label={item.stage} 
                        color={item.stage === 'Under Review' ? 'warning' : 'default'} 
                        sx={{ mb: 1 }}
                      />
                      <Box>
                        <IconButton size="small"><EditNote /></IconButton>
                      </Box>
                    </Box>
                  </Card>
                ))}
                <Button variant="dashed" fullWidth sx={{ border: '1px dashed grey', py: 2 }}>
                  + Add New Target
                </Button>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Alert severity="info">
                  <strong>Tip:</strong> Aim for journals with Impact Factor > 2.0 for your next appraisal cycle.
                </Alert>
              </Grid>
            </Grid>
          )}

          {/* TAB 2: PREDATORY CHECKER */}
          {tabIndex === 2 && (
            <Box maxWidth={600}>
              <Typography variant="h6" gutterBottom>Journal Safety Check</Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Verify if a journal is indexed in UGC-CARE, Scopus, or Web of Science before submitting.
              </Typography>
              
              <Box display="flex" gap={2} my={3}>
                <TextField 
                  fullWidth 
                  label="Enter Journal Name / ISSN" 
                  value={journalCheck} 
                  onChange={(e) => setJournalCheck(e.target.value)}
                />
                <Button 
                  variant="contained" 
                  size="large" 
                  onClick={handleJournalCheck}
                  disabled={!journalCheck}
                >
                  Check
                </Button>
              </Box>

              {checkResult && (
                <Card sx={{ p: 2, bgcolor: checkResult.isPredatory ? 'error.light' : 'success.light', color: 'white' }}>
                  <Box display="flex" alignItems="center" gap={2}>
                    {checkResult.isPredatory ? <Warning fontSize="large" /> : <VerifiedUser fontSize="large" />}
                    <Typography variant="body1" fontWeight="medium">
                      {checkResult.message}
                    </Typography>
                  </Box>
                </Card>
              )}
            </Box>
          )}

          {/* TAB 3: CO-AUTHORS */}
          {tabIndex === 3 && (
            <Grid container spacing={3}>
              {coAuthors.map((author) => (
                <Grid item xs={12} md={6} key={author.id}>
                  <Card variant="outlined" sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Group sx={{ fontSize: 40, color: 'white', bgcolor: 'primary.light', borderRadius: '50%', p: 1 }} />
                    <Box>
                      <Typography variant="subtitle1" fontWeight="bold">{author.name}</Typography>
                      <Typography variant="body2" color="text.secondary">{author.affil}</Typography>
                      <Typography variant="caption" color="primary">
                        {author.collaborations} Joint Papers
                      </Typography>
                    </Box>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      </Card>
    </Box>
  );
};

export default PublicationView;