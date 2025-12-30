import React, { useState } from "react";
import { 
  Box, Grid, Card, Typography, Button, TextField, MenuItem, 
  Table, TableBody, TableCell, TableHead, TableRow, Chip, 
  CircularProgress, Divider, LinearProgress 
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { AddCircleOutline, History, EventNote } from "@mui/icons-material";
import { Formik } from "formik";
import * as yup from "yup";

// Import your Custom Hook
import useLeaveSystem from "../../hooks/useLeaveSystem";

// Validation Schema
const leaveSchema = yup.object().shape({
  leaveType: yup.string().required("Select leave type"),
  startDate: yup.date().required("Start date is required"),
  endDate: yup.date()
    .required("End date is required")
    .min(yup.ref('startDate'), "End date can't be before start date"),
  reason: yup.string().required("Reason is required"),
  substituteId: yup.string().required("You must assign a substitute"),
});

const LeaveAppView = () => {
  const { balances, history, facultyList, loading, applyForLeave } = useLeaveSystem();
  const [showForm, setShowForm] = useState(false);

  if (loading) return <Box p={5} display="flex" justify="center"><CircularProgress /></Box>;

  // Helper to render Status Chips
  const getStatusChip = (status) => {
    const colorMap = {
      Approved: "success",
      Pending: "warning",
      Rejected: "error",
    };
    return <Chip label={status} color={colorMap[status] || "default"} size="small" variant="outlined" />;
  };

  return (
    <Box sx={{ p: 4 }}>
      
      {/* 1. BALANCE CARDS */}
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>Leave Balance</Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {Object.entries(balances).map(([key, data]) => (
          <Grid item xs={12} sm={6} md={3} key={key}>
            <Card sx={{ p: 3, textAlign: 'center', boxShadow: 3 }}>
              <Typography variant="subtitle2" color="text.secondary" sx={{ textTransform: 'uppercase' }}>
                {data.name}
              </Typography>
              <Typography variant="h3" color={data.available < 3 ? "error" : "primary"} sx={{ my: 1, fontWeight: 'bold' }}>
                {data.available}
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={(data.used / data.total) * 100} 
                sx={{ height: 6, borderRadius: 5, mt: 1 }} 
                color={data.available < 3 ? "error" : "primary"}
              />
              <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                Used: {data.used} / Total: {data.total}
              </Typography>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* 2. ACTION BUTTON */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Leave History</Typography>
        <Button 
          variant="contained" 
          startIcon={showForm ? <History /> : <AddCircleOutline />}
          onClick={() => setShowForm(!showForm)}
          color={showForm ? "inherit" : "primary"}
        >
          {showForm ? "View History" : "Apply New Leave"}
        </Button>
      </Box>

      {/* 3. CONDITIONAL RENDER: FORM vs HISTORY TABLE */}
      {showForm ? (
        // --- APPLY LEAVE FORM ---
        <Card sx={{ p: 4, maxWidth: 800, mx: 'auto' }}>
          <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
            <EventNote color="primary" /> New Application
          </Typography>
          
          <Formik
            initialValues={{ leaveType: "", startDate: "", endDate: "", reason: "", substituteId: "" }}
            validationSchema={leaveSchema}
            onSubmit={async (values, { setSubmitting, resetForm }) => {
              await applyForLeave(values);
              setSubmitting(false);
              setShowForm(false); // Go back to history to see new entry
              alert("Application Submitted successfully!");
            }}
          >
            {({ values, errors, touched, handleChange, handleSubmit, isSubmitting }) => (
              <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      select
                      fullWidth
                      label="Leave Type"
                      name="leaveType"
                      value={values.leaveType}
                      onChange={handleChange}
                      error={touched.leaveType && Boolean(errors.leaveType)}
                      helperText={touched.leaveType && errors.leaveType}
                    >
                      {Object.entries(balances).map(([key, data]) => (
                        <MenuItem key={key} value={key.toUpperCase()}>{data.name}</MenuItem>
                      ))}
                    </TextField>
                  </Grid>

                  <Grid item xs={12} md={6}>
                     {/* SUBSTITUTION LOGIC */}
                    <TextField
                      select
                      fullWidth
                      label="Assign Substitute"
                      name="substituteId"
                      value={values.substituteId}
                      onChange={handleChange}
                      error={touched.substituteId && Boolean(errors.substituteId)}
                      helperText={touched.substituteId && errors.substituteId || "Who will manage your classes?"}
                    >
                      {facultyList.map((fac) => (
                        <MenuItem key={fac.id} value={fac.id}>{fac.name}</MenuItem>
                      ))}
                    </TextField>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      type="date"
                      label="Start Date"
                      name="startDate"
                      InputLabelProps={{ shrink: true }}
                      value={values.startDate}
                      onChange={handleChange}
                      error={touched.startDate && Boolean(errors.startDate)}
                      helperText={touched.startDate && errors.startDate}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      type="date"
                      label="End Date"
                      name="endDate"
                      InputLabelProps={{ shrink: true }}
                      value={values.endDate}
                      onChange={handleChange}
                      error={touched.endDate && Boolean(errors.endDate)}
                      helperText={touched.endDate && errors.endDate}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      label="Reason for Leave"
                      name="reason"
                      value={values.reason}
                      onChange={handleChange}
                      error={touched.reason && Boolean(errors.reason)}
                      helperText={touched.reason && errors.reason}
                    />
                  </Grid>

                  <Grid item xs={12} display="flex" justifyContent="flex-end" gap={2}>
                    <Button variant="outlined" onClick={() => setShowForm(false)}>Cancel</Button>
                    <LoadingButton loading={isSubmitting} type="submit" variant="contained">
                      Submit Request
                    </LoadingButton>
                  </Grid>
                </Grid>
              </form>
            )}
          </Formik>
        </Card>
      ) : (
        // --- HISTORY TABLE ---
        <Card>
          <Table>
            <TableHead sx={{ bgcolor: 'grey.100' }}>
              <TableRow>
                <TableCell>Type</TableCell>
                <TableCell>Duration</TableCell>
                <TableCell>Dates</TableCell>
                <TableCell>Substitute</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {history.map((row) => (
                <TableRow key={row.id} hover>
                  <TableCell sx={{ fontWeight: 'bold' }}>{row.type}</TableCell>
                  <TableCell>{row.days} Days</TableCell>
                  <TableCell>{row.from} to {row.to}</TableCell>
                  <TableCell>{row.substitute}</TableCell>
                  <TableCell>{getStatusChip(row.status)}</TableCell>
                </TableRow>
              ))}
              {history.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center">No leave history found</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>
      )}
    </Box>
  );
};

export default LeaveAppView;