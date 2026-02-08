import React, { useState } from "react";
import { 
  Box, Card, Grid, Typography, Button, TextField, MenuItem, 
  Tabs, Tab, Table, TableBody, TableCell, TableHead, TableRow, 
  IconButton, Chip, InputAdornment, Tooltip 
} from "@mui/material";
import { 
  CloudUpload, Calculate, Print, Save, ReceiptLong, 
  AttachMoney, RemoveCircle, AddCircle, Lock 
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";

const HiddenInput = styled('input')({ display: 'none' });

const PayrollProcessingView = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [month, setMonth] = useState("February 2026");
  
  // Mock Employee Data
  const [employees, setEmployees] = useState([
    { id: 1, name: "Dr. Sarah Smith", basic: 85000, loan: 5000, adjustments: 0, attendance: 28 },
    { id: 2, name: "Prof. Rajan Kumar", basic: 142000, loan: 0, adjustments: 15000, attendance: 28 }, // 15k Arrears
    { id: 3, name: "Dr. Emily Davis", basic: 92000, loan: 0, adjustments: -2000, attendance: 26 }, // -2k Penalty
  ]);

  // Adjustments State
  const [adjType, setAdjType] = useState("Bonus");
  const [adjAmount, setAdjAmount] = useState(0);
  const [adjReason, setAdjReason] = useState("");

  const handleTabChange = (event, newValue) => setTabIndex(newValue);

  // PAYROLL CALCULATOR
  const calculateSalary = (emp) => {
    const da = emp.basic * 0.45; // 45% DA
    const hra = emp.basic * 0.20; // 20% HRA
    const special = 5000;
    const gross = emp.basic + da + hra + special + emp.adjustments;

    const pf = Math.min(emp.basic * 0.12, 1800); // Capped PF
    const tds = gross > 100000 ? gross * 0.10 : 0; // Mock TDS
    const deductions = pf + tds + emp.loan;

    return {
      gross: Math.round(gross),
      deductions: Math.round(deductions),
      net: Math.round(gross - deductions),
      components: { da, hra, pf, tds }
    };
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
        Salary & Payroll Processing
      </Typography>

      <Card sx={{ minHeight: 500 }}>
        <Tabs 
          value={tabIndex} 
          onChange={handleTabChange} 
          sx={{ borderBottom: 1, borderColor: 'divider', px: 2, bgcolor: 'background.paper' }}
        >
          <Tab icon={<Calculate />} iconPosition="start" label="Monthly Runner" />
          <Tab icon={<AttachMoney />} iconPosition="start" label="Arrears & Adjustments" />
          <Tab icon={<ReceiptLong />} iconPosition="start" label="Form 16 Generator" />
        </Tabs>

        <Box sx={{ p: 3 }}>
          {/* =================================================================
              TAB 1: MONTHLY PAYROLL RUNNER
          ================================================================= */}
          {tabIndex === 0 && (
            <Box>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Box display="flex" gap={2}>
                  <TextField size="small" label="Select Month" value={month} />
                  <Button variant="outlined" component="label" startIcon={<CloudUpload />}>
                    Upload Attendance CSV
                    <HiddenInput type="file" accept=".csv" />
                  </Button>
                </Box>
                <Button variant="contained" color="success" startIcon={<Print />}>
                  Finalize & Generate Pay Slips
                </Button>
              </Box>

              <Table size="small">
                <TableHead sx={{ bgcolor: 'grey.100' }}>
                  <TableRow>
                    <TableCell>Faculty Name</TableCell>
                    <TableCell>Basic Pay</TableCell>
                    <TableCell>Allowances (DA+HRA)</TableCell>
                    <TableCell>Gross</TableCell>
                    <TableCell>Deductions (PF+TDS+Loan)</TableCell>
                    <TableCell>Net Payable</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {employees.map((row) => {
                    const sal = calculateSalary(row);
                    return (
                      <TableRow key={row.id}>
                        <TableCell fontWeight="bold">
                          {row.name}
                          {row.adjustments !== 0 && (
                            <Chip label="Adj" size="small" color="warning" sx={{ ml: 1, fontSize: '0.6rem' }} />
                          )}
                        </TableCell>
                        <TableCell>₹{row.basic.toLocaleString()}</TableCell>
                        <TableCell>₹{Math.round(sal.components.da + sal.components.hra).toLocaleString()}</TableCell>
                        <TableCell>₹{sal.gross.toLocaleString()}</TableCell>
                        <TableCell sx={{ color: 'error.main' }}>-₹{sal.deductions.toLocaleString()}</TableCell>
                        <TableCell>
                          <Typography fontWeight="bold" color="success.main">
                            ₹{sal.net.toLocaleString()}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip label="Draft" size="small" />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </Box>
          )}

          {/* =================================================================
              TAB 2: ARREARS & ADJUSTMENTS
          ================================================================= */}
          {tabIndex === 1 && (
            <Grid container spacing={4}>
              <Grid item xs={12} md={5}>
                <Card variant="outlined" sx={{ p: 3 }}>
                  <Typography variant="h6" mb={2}>Add Adjustment</Typography>
                  <TextField select fullWidth label="Select Faculty" sx={{ mb: 2 }}>
                    {employees.map(e => <MenuItem key={e.id} value={e.id}>{e.name}</MenuItem>)}
                  </TextField>
                  <TextField 
                    select fullWidth label="Type" sx={{ mb: 2 }}
                    value={adjType} onChange={(e) => setAdjType(e.target.value)}
                  >
                    <MenuItem value="Bonus">One-time Earning (Bonus/Arrears)</MenuItem>
                    <MenuItem value="Fine">Deduction (Fine/Penalty)</MenuItem>
                  </TextField>
                  <TextField 
                    fullWidth type="number" label="Amount" sx={{ mb: 2 }}
                    InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment> }}
                    value={adjAmount} onChange={(e) => setAdjAmount(e.target.value)}
                  />
                  <TextField 
                    fullWidth label="Reason (e.g. Exam Duty, Late Fine)" sx={{ mb: 2 }}
                    value={adjReason} onChange={(e) => setAdjReason(e.target.value)}
                  />
                  <Button variant="contained" startIcon={<Save />} fullWidth>
                    Save to Payroll
                  </Button>
                </Card>
              </Grid>

              <Grid item xs={12} md={7}>
                <Typography variant="h6" mb={2}>Adjustment History (Current Month)</Typography>
                <Table>
                  <TableHead sx={{ bgcolor: 'grey.50' }}>
                    <TableRow>
                      <TableCell>Faculty</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Reason</TableCell>
                      <TableCell align="right">Amount</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>Prof. Rajan Kumar</TableCell>
                      <TableCell><Chip icon={<AddCircle />} label="Arrears" color="success" size="small" /></TableCell>
                      <TableCell>DA Correction (Jan-Feb)</TableCell>
                      <TableCell align="right" sx={{ color: 'success.main', fontWeight: 'bold' }}>+15,000</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Dr. Emily Davis</TableCell>
                      <TableCell><Chip icon={<RemoveCircle />} label="Penalty" color="error" size="small" /></TableCell>
                      <TableCell>Bond Breakage</TableCell>
                      <TableCell align="right" sx={{ color: 'error.main', fontWeight: 'bold' }}>-2,000</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </Grid>
            </Grid>
          )}

          {/* =================================================================
              TAB 3: FORM 16 GENERATION
          ================================================================= */}
          {tabIndex === 2 && (
            <Box textAlign="center" py={5}>
              <ReceiptLong sx={{ fontSize: 60, color: 'white', mb: 2 }} />
              <Typography variant="h5" gutterBottom>Year-End Tax Certificates (Form 16)</Typography>
              <Typography variant="body2" color="text.secondary" mb={4} maxWidth={600} mx="auto">
                Generate Part A and Part B for all employees. Ensure all TDS data is reconciled before proceeding.
                Files will be password protected (PAN + DOB).
              </Typography>

              <Box display="flex" justifyContent="center" gap={2} mb={4}>
                <TextField select label="Financial Year" size="small" sx={{ width: 150 }} defaultValue="2025-2026">
                  <MenuItem value="2025-2026">FY 2025-26</MenuItem>
                  <MenuItem value="2024-2025">FY 2024-25</MenuItem>
                </TextField>
                <Button variant="outlined" component="label" startIcon={<CloudUpload />}>
                  Import TDS Data (Excel)
                  <HiddenInput type="file" accept=".xlsx" />
                </Button>
              </Box>

              <Button variant="contained" size="large" color="secondary" startIcon={<Lock />}>
                Generate & Email Certificates
              </Button>
            </Box>
          )}
        </Box>
      </Card>
    </Box>
  );
};

export default PayrollProcessingView;