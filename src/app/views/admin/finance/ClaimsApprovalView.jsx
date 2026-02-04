import React from 'react';
import { 
  Box, Card, Typography, Table, TableBody, TableCell, TableHead, TableRow, 
  Button, Stack, Chip, IconButton, Tooltip 
} from "@mui/material";
import { Visibility, Check, Close, AttachFile } from "@mui/icons-material";

const ClaimsApprovalView = () => {
  const claims = [
    { id: "CLM-882", faculty: "Dr. Naveen", type: "Conference Fee", amount: 12500, date: "Oct 24", docs: "Receipt.pdf" },
    { id: "CLM-883", faculty: "Prof. Anjali", type: "Travel (Flight)", amount: 8400, date: "Oct 23", docs: "BoardingPass.pdf" },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>Financial Claims Approval</Typography>
      
      <Card elevation={3}>
        <Table>
          <TableHead sx={{ bgcolor: 'grey.100' }}>
            <TableRow>
              <TableCell>Claim ID</TableCell>
              <TableCell>Faculty</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Documents</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {claims.map((row) => (
              <TableRow key={row.id} hover>
                <TableCell fontWeight="bold">{row.id}</TableCell>
                <TableCell>{row.faculty}</TableCell>
                <TableCell><Chip label={row.type} size="small" /></TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'primary.main' }}>₹{row.amount.toLocaleString()}</TableCell>
                <TableCell>
                  <Button size="small" startIcon={<AttachFile />} sx={{ textTransform: 'none' }}>
                    {row.docs}
                  </Button>
                </TableCell>
                <TableCell align="right">
                  <Stack direction="row" spacing={1} justifyContent="end">
                    <Tooltip title="View Details"><IconButton size="small"><Visibility /></IconButton></Tooltip>
                    <Tooltip title="Approve"><IconButton size="small" color="success"><Check /></IconButton></Tooltip>
                    <Tooltip title="Reject"><IconButton size="small" color="error"><Close /></IconButton></Tooltip>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </Box>
  );
};

export default ClaimsApprovalView;