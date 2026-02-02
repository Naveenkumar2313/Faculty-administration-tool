import React, { useState } from 'react';
import { 
  Box, Card, Grid, Typography, Tabs, Tab, Button, Table, TableBody, 
  TableCell, TableHead, TableRow, Chip, LinearProgress, Stack, TextField, 
  Divider, IconButton, InputAdornment, Dialog, DialogTitle, DialogContent,
  DialogActions, Alert
} from "@mui/material";
import { 
  Gavel, Description, BusinessCenter, Security, HealthAndSafety, 
  Download, Calculate, CloudUpload, Edit, Save 
} from '@mui/icons-material';

import useLegalSystem from "../../hooks/useLegalSystem";

const LegalView = () => {
  const { 
    contracts, bonds, ndas, consultancyAgreements, insurance, 
    calculateDamages, updateNominee 
  } = useLegalSystem();

  const [tabIndex, setTabIndex] = useState(0);
  
  // Calculator State
  const [salaryInput, setSalaryInput] = useState(142000);
  const [damageResult, setDamageResult] = useState(null);

  // Dialog State (Nominee)
  const [openNomineeDialog, setOpenNomineeDialog] = useState(false);
  const [nomineeName, setNomineeName] = useState("");
  const [nomineeRel, setNomineeRel] = useState("");

  const handleCalculate = () => {
    // Hardcoded ID for demo
    const result = calculateDamages("BOND-PHD-001", salaryInput);
    setDamageResult(result);
  };

  const handleAddNominee = () => {
    const updatedList = [...insurance.nominees, { name: nomineeName, relation: nomineeRel, share: 0 }];
    updateNominee(updatedList);
    setOpenNomineeDialog(false);
    setNomineeName("");
    setNomineeRel("");
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>Legal & Contracts Repository</Typography>

      <Card elevation={3} sx={{ minHeight: 600 }}>
        <Tabs 
          value={tabIndex} 
          onChange={(e, v) => setTabIndex(v)} 
          variant="scrollable"
          scrollButtons="auto"
          sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'grey.50' }}
        >
          <Tab icon={<Description />} label="Employment Contracts" iconPosition="start" />
          <Tab icon={<Gavel />} label="Service Bonds" iconPosition="start" />
          <Tab icon={<Security />} label="Confidentiality (NDA)" iconPosition="start" />
          <Tab icon={<BusinessCenter />} label="Consultancy Agreements" iconPosition="start" />
          <Tab icon={<HealthAndSafety />} label="Insurance & Benefits" iconPosition="start" />
        </Tabs>

        <Box p={4}>
          {/* TAB 1: EMPLOYMENT CONTRACTS */}
          {tabIndex === 0 && (
            <Box>
              <Box display="flex" justifyContent="space-between" mb={2}>
                 <Typography variant="h6">My Employment Documents</Typography>
                 <Button variant="contained" startIcon={<Download />}>Download All (ZIP)</Button>
              </Box>
              <Table sx={{ border: '1px solid #eee' }}>
                <TableHead sx={{ bgcolor: 'grey.100' }}>
                  <TableRow>
                    <TableCell>Document Title</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell align="right">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {contracts.map((doc) => (
                    <TableRow key={doc.id} hover>
                      <TableCell fontWeight="medium">{doc.title}</TableCell>
                      <TableCell><Chip label={doc.type} size="small" variant="outlined" /></TableCell>
                      <TableCell>{doc.date}</TableCell>
                      <TableCell align="right">
                        <Button size="small" startIcon={<Download />}>PDF</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          )}

          {/* TAB 2: SERVICE BONDS */}
          {tabIndex === 1 && (
            <Grid container spacing={4}>
              <Grid item xs={12} md={7}>
                <Typography variant="h6" gutterBottom>Active Service Bonds</Typography>
                {bonds.map((bond) => (
                  <Card key={bond.id} variant="outlined" sx={{ p: 3, mb: 3, borderLeft: '5px solid orange' }}>
                    <Stack direction="row" justifyContent="space-between" mb={2}>
                      <Typography variant="subtitle1" fontWeight="bold">{bond.title}</Typography>
                      <Chip label={bond.status} color="warning" size="small" />
                    </Stack>
                    <Box display="flex" justifyContent="space-between" mb={1}>
                       <Typography variant="body2" color="text.secondary">Bond Value: ₹{bond.totalValue.toLocaleString()}</Typography>
                       <Typography variant="body2" color="text.secondary">{bond.remainingMonths} Months Remaining</Typography>
                    </Box>
                    <LinearProgress variant="determinate" value={60} color="warning" sx={{ height: 8, borderRadius: 4 }} />
                    
                    <Stack direction="row" spacing={2} mt={3}>
                       <Button variant="outlined" size="small">Bond Release Request</Button>
                       <Button variant="outlined" size="small">Apply for NOC</Button>
                    </Stack>
                  </Card>
                ))}
              </Grid>
              
              <Grid item xs={12} md={5}>
                <Card sx={{ p: 3, bgcolor: 'grey.50' }}>
                   <Typography variant="subtitle1" fontWeight="bold" display="flex" alignItems="center" gap={1}>
                     <Calculate /> Liquidated Damages Calculator
                   </Typography>
                   <Typography variant="caption" paragraph>
                     Estimate penalty if you break the bond today.
                   </Typography>
                   <TextField 
                     label="Current Monthly Salary" 
                     fullWidth 
                     type="number"
                     value={salaryInput}
                     onChange={(e) => setSalaryInput(e.target.value)}
                     InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment> }}
                     sx={{ mb: 2 }}
                   />
                   <Button variant="contained" fullWidth onClick={handleCalculate}>Calculate Penalty</Button>

                   {damageResult !== null && (
                     <Box mt={3} p={2} bgcolor="error.light" color="error.dark" borderRadius={2} textAlign="center">
                       <Typography variant="caption">Estimated Penalty</Typography>
                       <Typography variant="h5" fontWeight="bold">₹{damageResult.toLocaleString()}</Typography>
                     </Box>
                   )}
                </Card>
              </Grid>
            </Grid>
          )}

          {/* TAB 3: CONFIDENTIALITY (NDA) */}
          {tabIndex === 2 && (
            <Box>
               <Typography variant="h6" gutterBottom>Non-Disclosure Agreements (NDA)</Typography>
               <Grid container spacing={2}>
                 {ndas.map((nda) => (
                   <Grid item xs={12} md={6} key={nda.id}>
                     <Card variant="outlined" sx={{ p: 2 }}>
                        <Box display="flex" justifyContent="space-between" alignItems="start">
                           <Box>
                             <Typography variant="subtitle1" fontWeight="bold">{nda.title}</Typography>
                             <Typography variant="body2" color="text.secondary">Party: {nda.party}</Typography>
                             <Typography variant="caption">Signed: {nda.date}</Typography>
                           </Box>
                           <Chip label={nda.status} color="success" size="small" variant="outlined" />
                        </Box>
                        <Button size="small" sx={{ mt: 2 }}>View Clause</Button>
                     </Card>
                   </Grid>
                 ))}
               </Grid>
               <Alert severity="info" sx={{ mt: 3 }}>
                 Note: Student data confidentiality is perpetual as per University Policy 2023.
               </Alert>
            </Box>
          )}

          {/* TAB 4: CONSULTANCY CONTRACTS */}
          {tabIndex === 3 && (
             <Box>
                <Typography variant="h6" gutterBottom>Consultancy & Revenue Sharing</Typography>
                <Table>
                  <TableHead>
                    <TableRow>
                       <TableCell>Project</TableCell>
                       <TableCell>Client</TableCell>
                       <TableCell>Revenue Share</TableCell>
                       <TableCell>IP Rights</TableCell>
                       <TableCell>Approval</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {consultancyAgreements.map((row) => (
                      <TableRow key={row.id}>
                         <TableCell fontWeight="bold">{row.project}</TableCell>
                         <TableCell>{row.client}</TableCell>
                         <TableCell>
                           <Chip label={row.revenueShare} size="small" color="primary" variant="outlined" />
                         </TableCell>
                         <TableCell>{row.ipRights}</TableCell>
                         <TableCell>{row.approvalDate}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
             </Box>
          )}

          {/* TAB 5: INSURANCE */}
          {tabIndex === 4 && (
             <Grid container spacing={4}>
               <Grid item xs={12} md={6}>
                 <Card variant="outlined" sx={{ p: 3, height: '100%' }}>
                    <Typography variant="h6" gutterBottom>Group Medical Policy</Typography>
                    <Stack spacing={2}>
                       <Box display="flex" justifyContent="space-between">
                         <Typography color="text.secondary">Policy Number</Typography>
                         <Typography fontWeight="medium">{insurance.policyNo}</Typography>
                       </Box>
                       <Divider />
                       <Box display="flex" justifyContent="space-between">
                         <Typography color="text.secondary">Provider</Typography>
                         <Typography fontWeight="medium">{insurance.provider}</Typography>
                       </Box>
                       <Divider />
                       <Box display="flex" justifyContent="space-between">
                         <Typography color="text.secondary">Valid Till</Typography>
                         <Typography fontWeight="medium">{insurance.validTill}</Typography>
                       </Box>
                       <Divider />
                       <Box display="flex" justifyContent="space-between">
                         <Typography color="text.secondary">Sum Insured</Typography>
                         <Typography fontWeight="bold" color="success.main">₹{insurance.sumInsured.toLocaleString()}</Typography>
                       </Box>
                    </Stack>
                    <Button variant="contained" fullWidth sx={{ mt: 3 }} startIcon={<Download />}>Download E-Card</Button>
                 </Card>
               </Grid>

               <Grid item xs={12} md={6}>
                 <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                   <Typography variant="h6">Nominee Details</Typography>
                   <Button startIcon={<Edit />} size="small" onClick={() => setOpenNomineeDialog(true)}>Update</Button>
                 </Box>
                 <Table size="small" sx={{ border: '1px solid #eee' }}>
                   <TableHead sx={{ bgcolor: 'grey.100' }}>
                     <TableRow>
                       <TableCell>Name</TableCell>
                       <TableCell>Relation</TableCell>
                       <TableCell align="right">Share</TableCell>
                     </TableRow>
                   </TableHead>
                   <TableBody>
                     {insurance.nominees.map((nom, i) => (
                       <TableRow key={i}>
                         <TableCell>{nom.name}</TableCell>
                         <TableCell>{nom.relation}</TableCell>
                         <TableCell align="right">{nom.share}%</TableCell>
                       </TableRow>
                     ))}
                   </TableBody>
                 </Table>
               </Grid>
             </Grid>
          )}
        </Box>
      </Card>

      {/* Nominee Update Dialog */}
      <Dialog open={openNomineeDialog} onClose={() => setOpenNomineeDialog(false)}>
        <DialogTitle>Update Nominee</DialogTitle>
        <DialogContent>
           <TextField 
             autoFocus margin="dense" label="Nominee Name" fullWidth 
             value={nomineeName} onChange={(e) => setNomineeName(e.target.value)}
           />
           <TextField 
             margin="dense" label="Relationship" fullWidth 
             value={nomineeRel} onChange={(e) => setNomineeRel(e.target.value)}
           />
        </DialogContent>
        <DialogActions>
           <Button onClick={() => setOpenNomineeDialog(false)}>Cancel</Button>
           <Button onClick={handleAddNominee} variant="contained" startIcon={<Save />}>Save Changes</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default LegalView;