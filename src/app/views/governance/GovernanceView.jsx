import React from 'react';
import { 
  Box, Typography, Paper, Table, TableBody, 
  TableCell, TableContainer, TableHead, TableRow, Button 
} from "@mui/material";
import { VerifiedUser, GppBad } from '@mui/icons-material';

const GovernanceView = () => {
  const policies = [
    { name: "IT Usage Policy v2.0", date: "Jan 10, 2023", status: "Signed", required: true },
    { name: "Code of Conduct 2024", date: "Oct 01, 2023", status: "Pending", required: true },
    { name: "Research Ethics Guidelines", date: "Aug 15, 2023", status: "Signed", required: false },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ mb: 3 }}>Governance & Policy Compliance</Typography>
      
      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead sx={{ bgcolor: 'grey.100' }}>
            <TableRow>
              <TableCell>Policy Name</TableCell>
              <TableCell>Release Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {policies.map((policy, index) => (
              <TableRow key={index}>
                <TableCell component="th" scope="row" sx={{ fontWeight: 'medium' }}>
                  {policy.name}
                  {policy.required && <Box component="span" sx={{ color: 'red', ml: 1 }}>*</Box>}
                </TableCell>
                <TableCell>{policy.date}</TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={1}>
                    {policy.status === 'Signed' 
                      ? <VerifiedUser color="success" fontSize="small" /> 
                      : <GppBad color="error" fontSize="small" />
                    }
                    <Typography variant="body2">{policy.status}</Typography>
                  </Box>
                </TableCell>
                <TableCell align="right">
                   {policy.status === 'Pending' ? (
                     <Button variant="contained" size="small" color="primary">Read & Sign</Button>
                   ) : (
                     <Button variant="outlined" size="small">View PDF</Button>
                   )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default GovernanceView;