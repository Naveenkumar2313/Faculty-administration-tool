import React, { useState } from "react";
import { 
  Box, Card, Grid, Typography, Tabs, Tab, Table, TableHead, TableRow, TableCell, TableBody, 
  Button, TextField, MenuItem, Chip, CircularProgress, Divider, InputAdornment 
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Download, ReceiptLong, AccountBalanceWallet, Save } from "@mui/icons-material";
import { Formik } from "formik";
import * as yup from "yup";

import usePayrollSystem from "../../hooks/usePayrollSystem";

const PayrollView = () => {
  const { salarySlips, taxData, loading, downloadSlip, submitTaxDeclaration } = usePayrollSystem();
  const [tabIndex, setTabIndex] = useState(0);

  if (loading) return <Box p={5} display="flex" justifyContent="center"><CircularProgress /></Box>;

  // --- TAB 1: SALARY SLIPS ---
  const SalaryTab = () => (
    <Card>
      <Table>
        <TableHead sx={{ bgcolor: 'grey.100' }}>
          <TableRow>
            <TableCell>Month / Year</TableCell>
            <TableCell>Basic Pay</TableCell>
            <TableCell>Allowances</TableCell>
            <TableCell>Deductions</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Net Salary</TableCell>
            <TableCell>Status</TableCell>
            <TableCell align="right">Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {salarySlips.map((row) => (
            <TableRow key={row.id} hover>
              <TableCell sx={{ fontWeight: 'bold' }}>{row.month} {row.year}</TableCell>
              <TableCell>₹{row.basic.toLocaleString()}</TableCell>
              <TableCell>₹{(row.da + row.hra).toLocaleString()}</TableCell>
              <TableCell sx={{ color: 'error.main' }}>- ₹{row.deductions.toLocaleString()}</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: 'success.main' }}>₹{row.net.toLocaleString()}</TableCell>
              <TableCell><Chip label={row.status} color="success" size="small" variant="outlined" /></TableCell>
              <TableCell align="right">
                <Button 
                  startIcon={<Download />} 
                  size="small" 
                  onClick={() => downloadSlip(row.id)}
                >
                  Slip
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );

  // --- TAB 2: TAX DECLARATION FORM ---
  const TaxTab = () => (
    <Card sx={{ p: 4, maxWidth: 900, mx: 'auto' }}>
      <Box mb={4} display="flex" alignItems="center" gap={2}>
        <AccountBalanceWallet color="primary" sx={{ fontSize: 40 }} />
        <Box>
          <Typography variant="h5">Investment Declaration (80C)</Typography>
          <Typography variant="body2" color="text.secondary">
            Declare your investments to reduce TDS deductions. Status: <strong>{taxData.status}</strong>
          </Typography>
        </Box>
      </Box>

      <Formik
        initialValues={{
          regime: taxData?.regime || "new",
          lic: taxData?.investments?.lic || 0,
          ppf: taxData?.investments?.ppf || 0,
          mediclaim: taxData?.investments?.mediclaim || 0,
          hra_rent: taxData?.investments?.hra_rent || 0,
        }}
        onSubmit={async (values, { setSubmitting }) => {
          await submitTaxDeclaration(values);
          setSubmitting(false);
          alert("Declaration updated successfully!");
        }}
      >
        {({ values, handleChange, handleSubmit, isSubmitting }) => (
          <form onSubmit={handleSubmit}>
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <TextField
                  select
                  fullWidth
                  label="Tax Regime"
                  name="regime"
                  value={values.regime}
                  onChange={handleChange}
                  helperText="New Regime has lower rates but fewer exemptions."
                >
                  <MenuItem value="old">Old Tax Regime (With Exemptions)</MenuItem>
                  <MenuItem value="new">New Tax Regime (Lower Rates)</MenuItem>
                </TextField>
              </Grid>

              {values.regime === 'old' && (
                <>
                  <Grid item xs={12}><Divider><Chip label="Section 80C Exemptions" /></Divider></Grid>
                  
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Life Insurance Premium (LIC)"
                      name="lic"
                      type="number"
                      value={values.lic}
                      onChange={handleChange}
                      InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment> }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Public Provident Fund (PPF)"
                      name="ppf"
                      type="number"
                      value={values.ppf}
                      onChange={handleChange}
                      InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment> }}
                    />
                  </Grid>

                  <Grid item xs={12}><Divider><Chip label="Other Exemptions" /></Divider></Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Medical Insurance (80D)"
                      name="mediclaim"
                      type="number"
                      value={values.mediclaim}
                      onChange={handleChange}
                      InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment> }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Annual Rent Paid (For HRA)"
                      name="hra_rent"
                      type="number"
                      value={values.hra_rent}
                      onChange={handleChange}
                      helperText="Requires Rent Receipts if > ₹1 Lakh"
                      InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment> }}
                    />
                  </Grid>
                </>
              )}

              {values.regime === 'new' && (
                <Grid item xs={12}>
                  <Box p={3} bgcolor="info.light" color="info.contrastText" borderRadius={2}>
                    <Typography>
                      Note: Investment declarations (80C, 80D, HRA) are <strong>not applicable</strong> under the New Tax Regime. 
                      Standard Deduction applies automatically.
                    </Typography>
                  </Box>
                </Grid>
              )}

              <Grid item xs={12} display="flex" justifyContent="flex-end">
                <LoadingButton 
                  loading={isSubmitting} 
                  type="submit" 
                  variant="contained" 
                  size="large"
                  startIcon={<Save />}
                >
                  Submit Declaration
                </LoadingButton>
              </Grid>
            </Grid>
          </form>
        )}
      </Formik>
    </Card>
  );

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>Payroll & Taxation</Typography>
      
      <Tabs value={tabIndex} onChange={(e, v) => setTabIndex(v)} sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}>
        <Tab label="Salary Slips" icon={<ReceiptLong />} iconPosition="start" />
        <Tab label="IT Declaration" icon={<AccountBalanceWallet />} iconPosition="start" />
      </Tabs>

      {tabIndex === 0 ? <SalaryTab /> : <TaxTab />}
    </Box>
  );
};

export default PayrollView;