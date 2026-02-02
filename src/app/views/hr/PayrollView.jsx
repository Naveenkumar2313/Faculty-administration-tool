import React, { useState } from "react";
import { 
  Box, Card, Grid, Typography, Button, Tabs, Tab, Table, 
  TableBody, TableCell, TableHead, TableRow, Chip, LinearProgress, 
  Stack, TextField, Divider, IconButton, Tooltip 
} from "@mui/material";
import { 
  Download, AccountBalance, Description, TrendingUp, 
  Calculate, AccountBalanceWallet, ReceiptLong, Lock 
} from "@mui/icons-material";
import ReactEcharts from "echarts-for-react";
import { useTheme } from "@mui/material/styles";

import usePayrollSystem from "../../hooks/usePayrollSystem";

const PayrollView = () => {
  const theme = useTheme();
  const { 
    salaryData, comparisonData, loans, arrears, 
    form16s, pfData, calculateGratuity 
  } = usePayrollSystem();
  
  const [tabIndex, setTabIndex] = useState(0);
  
  // Gratuity Calculator State
  const [gratYears, setGratYears] = useState(5);
  const [gratBasic, setGratBasic] = useState(salaryData.basic + salaryData.da);
  const [gratResult, setGratResult] = useState(0);

  // Chart: Pay Comparison
  const payChartOption = {
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: ['Avg Grade Pay', 'My Pay', 'Highest in Grade'] },
    yAxis: { type: 'value', show: false },
    series: [{
      data: [
        { value: comparisonData.avgSalary, itemStyle: { color: theme.palette.grey[400] } },
        { value: comparisonData.mySalary, itemStyle: { color: theme.palette.success.main } },
        { value: comparisonData.highestSalary, itemStyle: { color: theme.palette.grey[400] } }
      ],
      type: 'bar',
      barWidth: 40,
      label: { show: true, position: 'top', formatter: '₹{c}' }
    }],
    grid: { top: 30, bottom: 20, left: 0, right: 0 }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box mb={3} display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h5" fontWeight="bold">Payroll & Financials</Typography>
        <Button variant="outlined" startIcon={<Download />}>Last Salary Slip</Button>
      </Box>

      {/* TOP SUMMARY CARDS */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 3, bgcolor: 'primary.main', color: 'white' }}>
            <Typography variant="caption" sx={{ opacity: 0.8 }}>NET PAY (OCT 2023)</Typography>
            <Typography variant="h3" fontWeight="bold">₹{salaryData.net.toLocaleString()}</Typography>
            <Typography variant="body2" sx={{ mt: 1, opacity: 0.9 }}>Gross: ₹{salaryData.gross.toLocaleString()}</Typography>
          </Card>
        </Grid>
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 2, height: '100%', display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box flex={1}>
               <Typography variant="subtitle2" fontWeight="bold" gutterBottom>Pay Comparison</Typography>
               <Typography variant="caption" color="text.secondary">Vs Peers in {comparisonData.grade}</Typography>
               <Typography variant="caption" display="block" color="success.main" fontWeight="bold" mt={1}>
                 You are in the top 15% of your grade.
               </Typography>
            </Box>
            <Box flex={1}>
               <ReactEcharts option={payChartOption} style={{ height: '120px' }} />
            </Box>
          </Card>
        </Grid>
      </Grid>

      {/* MAIN TABS */}
      <Card sx={{ minHeight: 500 }}>
        <Tabs value={tabIndex} onChange={(e, v) => setTabIndex(v)} sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tab icon={<ReceiptLong />} label="Salary & PF" iconPosition="start" />
          <Tab icon={<AccountBalance />} label="Loans & Arrears" iconPosition="start" />
          <Tab icon={<Description />} label="Tax (Form 16)" iconPosition="start" />
          <Tab icon={<Calculate />} label="Gratuity Calculator" iconPosition="start" />
        </Tabs>

        <Box p={4}>
          {/* TAB 0: SALARY & PF */}
          {tabIndex === 0 && (
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                 <Typography variant="h6" gutterBottom>EPF Passbook Summary</Typography>
                 <Card variant="outlined" sx={{ p: 3, mb: 3, bgcolor: 'grey.50' }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                       <Box>
                         <Typography variant="caption" color="text.secondary">TOTAL EPF BALANCE</Typography>
                         <Typography variant="h4" fontWeight="bold" color="primary">₹{pfData.balance.toLocaleString()}</Typography>
                       </Box>
                       <Chip label={`UAN: ${pfData.uan}`} />
                    </Stack>
                    <Divider sx={{ my: 2 }} />
                    <Stack direction="row" justifyContent="space-between">
                       <Box>
                         <Typography variant="subtitle2">Employee Share</Typography>
                         <Typography variant="h6">₹{pfData.employeeShare}/mo</Typography>
                       </Box>
                       <Box textAlign="right">
                         <Typography variant="subtitle2">Employer Share</Typography>
                         <Typography variant="h6">₹{pfData.employerShare}/mo</Typography>
                       </Box>
                    </Stack>
                 </Card>
                 <Typography variant="subtitle2" gutterBottom>Recent Contributions</Typography>
                 <Table size="small">
                    <TableHead><TableRow><TableCell>Month</TableCell><TableCell>My Share</TableCell><TableCell>Univ Share</TableCell></TableRow></TableHead>
                    <TableBody>
                       {pfData.history.map((row, i) => (
                         <TableRow key={i}>
                           <TableCell>{row.month}</TableCell>
                           <TableCell>₹{row.employee}</TableCell>
                           <TableCell>₹{row.employer}</TableCell>
                         </TableRow>
                       ))}
                    </TableBody>
                 </Table>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>Salary Structure</Typography>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell>Basic Pay</TableCell>
                      <TableCell align="right">₹{salaryData.basic.toLocaleString()}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Dearness Allowance (DA)</TableCell>
                      <TableCell align="right">₹{salaryData.da.toLocaleString()}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>HRA</TableCell>
                      <TableCell align="right">₹{salaryData.hra.toLocaleString()}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold' }}>Gross Salary</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'bold' }}>₹{salaryData.gross.toLocaleString()}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell sx={{ color: 'error.main' }}>Deductions (Tax + PF)</TableCell>
                      <TableCell align="right" sx={{ color: 'error.main' }}>- ₹{salaryData.deductions.toLocaleString()}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </Grid>
            </Grid>
          )}

          {/* TAB 1: LOANS & ARREARS */}
          {tabIndex === 1 && (
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>Active Loans & Advances</Typography>
                <Stack spacing={2}>
                  {loans.map((loan) => (
                    <Card key={loan.id} variant="outlined" sx={{ p: 2 }}>
                       <Stack direction="row" justifyContent="space-between" mb={1}>
                         <Typography variant="subtitle1" fontWeight="bold">{loan.type}</Typography>
                         <Chip 
                           label={loan.status} 
                           size="small" 
                           color={loan.status === 'Active' ? 'warning' : 'default'} 
                         />
                       </Stack>
                       <LinearProgress 
                         variant="determinate" 
                         value={(loan.paid / loan.total) * 100} 
                         color={loan.status === 'Closed' ? 'success' : 'primary'}
                         sx={{ height: 8, borderRadius: 4, mb: 1 }}
                       />
                       <Typography variant="caption" display="flex" justifyContent="space-between">
                          <span>Paid: ₹{loan.paid.toLocaleString()}</span>
                          <span>Total: ₹{loan.total.toLocaleString()}</span>
                       </Typography>
                    </Card>
                  ))}
                </Stack>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>Arrears & Increments</Typography>
                <Table>
                  <TableHead sx={{ bgcolor: 'grey.100' }}>
                    <TableRow>
                      <TableCell>Description</TableCell>
                      <TableCell>Amount</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {arrears.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          {item.title}
                          <Typography variant="caption" display="block" color="text.secondary">{item.date}</Typography>
                        </TableCell>
                        <TableCell>₹{item.amount.toLocaleString()}</TableCell>
                        <TableCell>
                          <Chip 
                             label={item.status} 
                             size="small" 
                             color={item.status === 'Paid' ? 'success' : 'warning'} 
                             variant="outlined" 
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Grid>
            </Grid>
          )}

          {/* TAB 2: TAX DOCUMENTS */}
          {tabIndex === 2 && (
             <Box maxWidth={600}>
               <Typography variant="h6" gutterBottom>Form 16 Repository</Typography>
               <Table>
                 <TableHead>
                   <TableRow>
                     <TableCell>Financial Year</TableCell>
                     <TableCell>Generated On</TableCell>
                     <TableCell>Action</TableCell>
                   </TableRow>
                 </TableHead>
                 <TableBody>
                   {form16s.map((form, i) => (
                     <TableRow key={i}>
                       <TableCell fontWeight="bold">{form.year}</TableCell>
                       <TableCell>{form.generated}</TableCell>
                       <TableCell>
                         <Button startIcon={<Download />} size="small" variant="contained">
                           PDF ({form.size})
                         </Button>
                       </TableCell>
                     </TableRow>
                   ))}
                 </TableBody>
               </Table>
               
               <Box mt={4} p={2} bgcolor="blue.50" borderRadius={2} display="flex" gap={2}>
                 <Lock color="primary" />
                 <Typography variant="body2">
                   Your Form 16 is password protected. Use your PAN number (uppercase) + Date of Birth (DDMM) to open the file.
                 </Typography>
               </Box>
             </Box>
          )}

          {/* TAB 3: GRATUITY CALCULATOR */}
          {tabIndex === 3 && (
             <Grid container spacing={4}>
               <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>Estimate Your Gratuity</Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Gratuity is a lump sum amount paid by the employer upon retirement or resignation after 5 years of continuous service.
                  </Typography>
                  <Stack spacing={3} mt={3}>
                    <TextField 
                      label="Years of Service" 
                      type="number" 
                      value={gratYears} 
                      onChange={(e) => setGratYears(e.target.value)} 
                    />
                    <TextField 
                      label="Last Drawn Salary (Basic + DA)" 
                      type="number" 
                      value={gratBasic} 
                      onChange={(e) => setGratBasic(e.target.value)} 
                      helperText={`Current Basic+DA is ₹${(salaryData.basic + salaryData.da).toLocaleString()}`}
                    />
                    <Button 
                      variant="contained" 
                      size="large" 
                      startIcon={<Calculate />}
                      onClick={() => setGratResult(calculateGratuity(gratYears, gratBasic))}
                    >
                      Calculate
                    </Button>
                  </Stack>
               </Grid>
               <Grid item xs={12} md={6} display="flex" alignItems="center" justifyContent="center">
                  {gratResult > 0 && (
                    <Card sx={{ p: 4, textAlign: 'center', bgcolor: 'success.light', color: 'success.dark', width: '100%' }}>
                       <AccountBalanceWallet sx={{ fontSize: 60, mb: 2 }} />
                       <Typography variant="h6">Estimated Gratuity Amount</Typography>
                       <Typography variant="h3" fontWeight="bold" my={2}>
                         ₹{gratResult.toLocaleString()}
                       </Typography>
                       <Typography variant="caption">
                         Formula: (15 * Last Drawn * Years) / 26
                       </Typography>
                    </Card>
                  )}
               </Grid>
             </Grid>
          )}
        </Box>
      </Card>
    </Box>
  );
};

export default PayrollView;