import React from 'react';
import { 
  Box, Card, Typography, Fab, List, ListItem, 
  ListItemText, ListItemAvatar, Avatar, Divider, Chip 
} from "@mui/material";
import { Add, ReceiptLong, AttachMoney } from '@mui/icons-material';

const ReimbursementView = () => {
  const claims = [
    { id: 1, title: 'IEEE Conference Fee', date: 'Oct 12', amt: '$450', status: 'Processing' },
    { id: 2, title: 'Medical Claim', date: 'Sep 28', amt: '$120', status: 'Approved' },
    { id: 3, title: 'Internet Allowance', date: 'Sep 01', amt: '$60', status: 'Paid' },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5">Reimbursements & Claims</Typography>
        <Fab color="primary" variant="extended" size="medium">
          <Add sx={{ mr: 1 }} /> New Claim
        </Fab>
      </Box>

      <Card elevation={3}>
        <List>
          {claims.map((claim, index) => (
            <React.Fragment key={claim.id}>
              <ListItem alignItems="flex-start" secondaryAction={
                <Box sx={{ textAlign: 'right' }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{claim.amt}</Typography>
                  <Chip 
                    label={claim.status} 
                    size="small" 
                    color={claim.status === 'Paid' ? 'success' : 'primary'} 
                    variant={claim.status === 'Processing' ? 'outlined' : 'filled'}
                  />
                </Box>
              }>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: 'primary.light' }}>
                    <ReceiptLong />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={claim.title}
                  secondary={
                    <Typography component="span" variant="body2" color="text.secondary">
                      {claim.date} — ID: #{202300 + claim.id}
                    </Typography>
                  }
                />
              </ListItem>
              {index < claims.length - 1 && <Divider variant="inset" component="li" />}
            </React.Fragment>
          ))}
        </List>
      </Card>
    </Box>
  );
};

export default ReimbursementView;