import React, { useState } from "react";
import { 
  Box, Card, Grid, Typography, Button, TextField, MenuItem, 
  Table, TableBody, TableCell, TableHead, TableRow, Chip, 
  IconButton, LinearProgress, Stack, Avatar, Divider, Badge, Tooltip 
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { 
  Add, Cancel, EventAvailable, History, 
  BeachAccess, MedicalServices, Work, Badge as BadgeIcon 
} from "@mui/icons-material";
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { PickersDay } from '@mui/x-date-pickers/PickersDay';
import { isSameDay, isWithinInterval } from "date-fns";
import { Formik } from "formik";
import * as yup from "yup";

import useLeaveSystem from "../../hooks/useLeaveSystem";

// --- CUSTOM CALENDAR DAY COMPONENT ---
const ServerDay = (props) => {
  const { day, leaves, ...other } = props;

  const matchedLeave = leaves.find(leave => 
    isWithinInterval(day, { start: leave.from, end: leave.to })
  );

  const isSelected = !!matchedLeave;
  const color = matchedLeave?.status === 'Approved' ? 'success.main' : 'warning.main';

  return (
    <Badge
      key={props.day.toString()}
      overlap="circular"
      badgeContent={isSelected ? " " : undefined}
      sx={{ 
        '& .MuiBadge-badge': { 
            bgcolor: color, 
            width: 8, height: 8, borderRadius: '50%',
            bottom: 5, right: '50%', transform: 'translateX(50%)'
        } 
      }}
    >
      <PickersDay {...other} day={day} />
    </Badge>
  );
};

const LeaveAppView = () => {
  const { leaves, deptLeaves, balance, loading, submitLeave, cancelLeave } = useLeaveSystem();
  const [tab, setTab] = useState(0); // 0: Apply/Calendar, 1: History

  const leaveTypes = [
    { value: "Casual Leave", label: "Casual Leave (CL)", icon: BeachAccess, color: "#2196f3" },
    { value: "Medical Leave", label: "Medical Leave (ML)", icon: MedicalServices, color: "#e91e63" },
    { value: "Earned Leave", label: "Earned Leave (EL)", icon: Work, color: "#4caf50" },
    { value: "On-Duty", label: "On Duty (OD)", icon: BadgeIcon, color: "#ff9800" },
  ];

  const validationSchema = yup.object({
    type: yup.string().required("Leave type is required"),
    from: yup.date().required("Start date is required"),
    to: yup.date().required("End date is required"),
    reason: yup.string().required("Reason is required"),
  });

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ p: 3 }}>
        
        {/* 1. BALANCE CARDS */}
        <Grid container spacing={3} mb={4}>
          {Object.entries(balance).map(([key, val], i) => (
            <Grid item xs={6} md={3} key={i}>
              <Card sx={{ p: 2, textAlign: 'center', bgcolor: 'primary.light', color: 'white' }}>
                <Typography variant="overline" sx={{ opacity: 0.8 }}>{key.toUpperCase()}</Typography>
                <Typography variant="h4" fontWeight="bold">{val}</Typography>
                <Typography variant="caption">Available Days</Typography>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={3}>
          {/* 2. LEFT COL: APPLICATION & CALENDAR */}
          <Grid item xs={12} md={8}>
            <Card sx={{ p: 0, overflow: 'hidden' }}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'grey.50' }}>
                <Stack direction="row">
                  <Button 
                    startIcon={<EventAvailable />} 
                    sx={{ borderRadius: 0, py: 2, px: 3, bgcolor: tab===0 ? 'white' : 'transparent', borderBottom: tab===0 ? '2px solid #1976d2' : 'none' }}
                    onClick={() => setTab(0)}
                  >
                    Calendar & Apply
                  </Button>
                  <Button 
                    startIcon={<History />} 
                    sx={{ borderRadius: 0, py: 2, px: 3, bgcolor: tab===1 ? 'white' : 'transparent', borderBottom: tab===1 ? '2px solid #1976d2' : 'none' }}
                    onClick={() => setTab(1)}
                  >
                    My History
                  </Button>
                </Stack>
              </Box>

              <Box sx={{ p: 3 }}>
                {tab === 0 && (
                  <Grid container spacing={4}>
                    {/* CALENDAR VIEW */}
                    <Grid item xs={12} md={6} sx={{ borderRight: { md: '1px solid #eee' } }}>
                      <Typography variant="subtitle2" fontWeight="bold" align="center" gutterBottom>
                        My Leave Schedule
                      </Typography>
                      <DateCalendar 
                        readOnly 
                        slots={{ day: ServerDay }}
                        slotProps={{ day: { leaves } }}
                      />
                      <Box display="flex" justifyContent="center" gap={2} mt={1}>
                        <Chip label="Approved" size="small" sx={{ bgcolor: 'success.light', color: 'success.dark' }} />
                        <Chip label="Pending" size="small" sx={{ bgcolor: 'warning.light', color: 'warning.dark' }} />
                      </Box>
                    </Grid>

                    {/* APPLICATION FORM */}
                    <Grid item xs={12} md={6}>
                      <Typography variant="h6" gutterBottom>Request New Leave</Typography>
                      <Formik
                        initialValues={{ type: "", from: null, to: null, reason: "" }}
                        validationSchema={validationSchema}
                        onSubmit={async (values, { resetForm }) => {
                          try {
                            await submitLeave(values);
                            resetForm();
                            // Optional: Show Success Toast
                          } catch (err) {
                            alert(err);
                          }
                        }}
                      >
                        {({ values, errors, touched, handleChange, setFieldValue, handleSubmit, isSubmitting }) => (
                          <form onSubmit={handleSubmit}>
                            <TextField
                              select
                              fullWidth
                              label="Leave Type"
                              name="type"
                              value={values.type}
                              onChange={handleChange}
                              error={touched.type && Boolean(errors.type)}
                              helperText={touched.type && errors.type}
                              margin="normal"
                              size="small"
                            >
                              {leaveTypes.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                  <Box display="flex" alignItems="center" gap={1}>
                                    <option.icon sx={{ color: option.color, fontSize: 18 }} />
                                    {option.label}
                                  </Box>
                                </MenuItem>
                              ))}
                            </TextField>

                            <Stack direction="row" spacing={2} mt={1}>
                               <TextField
                                type="date"
                                label="From"
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                                onChange={(e) => setFieldValue("from", new Date(e.target.value))}
                                margin="normal"
                                size="small"
                                required
                              />
                               <TextField
                                type="date"
                                label="To"
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                                onChange={(e) => setFieldValue("to", new Date(e.target.value))}
                                margin="normal"
                                size="small"
                                required
                              />
                            </Stack>

                            <TextField
                              fullWidth
                              label="Reason"
                              name="reason"
                              multiline
                              rows={3}
                              value={values.reason}
                              onChange={handleChange}
                              margin="normal"
                              size="small"
                            />

                            <LoadingButton 
                              loading={isSubmitting}
                              type="submit" 
                              variant="contained" 
                              fullWidth 
                              sx={{ mt: 2 }}
                            >
                              Submit Request
                            </LoadingButton>
                          </form>
                        )}
                      </Formik>
                    </Grid>
                  </Grid>
                )}

                {/* HISTORY TAB */}
                {tab === 1 && (
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Type</TableCell>
                        <TableCell>Dates</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell align="right">Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {leaves.map((row) => (
                        <TableRow key={row.id}>
                          <TableCell sx={{ fontWeight: 'medium' }}>{row.type}</TableCell>
                          <TableCell>
                            {row.from.toLocaleDateString()} - {row.to.toLocaleDateString()} 
                            <Typography variant="caption" display="block" color="text.secondary">({row.days} days)</Typography>
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={row.status} 
                              size="small" 
                              color={row.status === 'Approved' ? 'success' : 'warning'} 
                              variant={row.status === 'Approved' ? 'filled' : 'outlined'}
                            />
                          </TableCell>
                          <TableCell align="right">
                            {row.status === 'Pending' && (
                              <Tooltip title="Cancel Request">
                                <IconButton color="error" size="small" onClick={() => cancelLeave(row.id)}>
                                  <Cancel fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </Box>
            </Card>
          </Grid>

          {/* 3. RIGHT COL: DEPARTMENT STATUS */}
          <Grid item xs={12} md={4}>
            <Card sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" gutterBottom display="flex" alignItems="center" gap={1}>
                <BadgeIcon color="action" /> Dept. Leave Status
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={3}>
                Colleagues on leave this month
              </Typography>

              <Stack spacing={2}>
                {deptLeaves.map((item) => (
                  <Box key={item.id} display="flex" alignItems="center" justifyContent="space-between">
                    <Box display="flex" alignItems="center" gap={2}>
                      <Avatar sx={{ width: 32, height: 32, bgcolor: item.status === 'Approved' ? 'grey.300' : 'orange.100', color: 'grey.800', fontSize: 14 }}>
                        {item.name.charAt(4)}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle2" fontWeight="bold">{item.name}</Typography>
                        <Typography variant="caption">{item.date.toLocaleDateString()} • {item.type}</Typography>
                      </Box>
                    </Box>
                    {item.status === 'Approved' ? (
                       <Chip label="Away" size="small" color="default" sx={{ height: 20, fontSize: 10 }} />
                    ) : (
                       <Chip label="Planned" size="small" variant="outlined" sx={{ height: 20, fontSize: 10 }} />
                    )}
                  </Box>
                ))}
              </Stack>
              
              <Divider sx={{ my: 3 }} />
              
              <Box bgcolor="blue.50" p={2} borderRadius={2}>
                 <Typography variant="caption" color="blue.800" fontWeight="bold">NOTE</Typography>
                 <Typography variant="caption" display="block" color="blue.900" mt={0.5}>
                    Only 2 faculty members from the department can be on "Casual Leave" simultaneously.
                 </Typography>
              </Box>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </LocalizationProvider>
  );
};

export default LeaveAppView;