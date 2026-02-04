import React, { useState } from "react";
import { 
  Box, Card, Grid, Typography, Button, Table, TableBody, TableCell, 
  TableHead, TableRow, Chip, IconButton, Tooltip, LinearProgress, 
  TextField, MenuItem, Tabs, Tab
} from "@mui/material";
import { 
  Email, VerifiedUser, GppBad, Download, History, 
  Fingerprint, Send, CheckCircle 
} from "@mui/icons-material";

const PolicyComplianceView = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [filterPolicy, setFilterPolicy] = useState("All");

  const handleTabChange = (event, newValue) => setTabIndex(newValue);

  // MOCK DATA: POLICIES
  const policies = [
    { id: 1, title: "Code of Ethics", version: "1.2", total: 142, signed: 134, pending: 8, deadline: "2025-02-28" },
    { id: 2, title: "IT Security Guidelines", version: "2.0", total: 142, signed: 65, pending: 77, deadline: "2026-03-15" },
    { id: 3, title: "Research Integrity", version: "1.0", total: 142, signed: 142, pending: 0, deadline: "2024-12-31" },
  ];

  // MOCK DATA: FACULTY STATUS
  const facultyStatus = [
    { id: 101, name: "Dr. Emily Davis", dept: "Civil", policy: "IT Security Guidelines", status: "Pending", daysOverdue: 2 },
    { id: 102, name: "Prof. Rajan Kumar", dept: "Mech", policy: "Code of Ethics", status: "Pending", daysOverdue: 5 },
    { id: 103, name: "Ms. Priya Roy", dept: "CSE", policy: "IT Security Guidelines", status: "Pending", daysOverdue: 0 },
  ];

  // MOCK DATA: SIGNATURE LOGS
  const signatureLogs = [
    { id: 1, name: "Dr. Sarah Smith", policy: "Code of Ethics", time: "2026-02-04 10:30 AM", ip: "192.168.1.45", otp: "Verified", method: "Digital ID" },
    { id: 2, name: "Mr. John Doe", policy: "IT Security Guidelines", time: "2026-02-04 11:15 AM", ip: "192.168.1.12", otp: "Verified", method: "Aadhaar eSign" },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
        Policy Compliance & Tracking
      </Typography>

      <Card sx={{ minHeight: 500 }}>
        <Tabs 
          value={tabIndex} 
          onChange={handleTabChange} 
          sx={{ borderBottom: 1, borderColor: 'divider', px: 2, bgcolor: 'background.paper' }}
        >
          <Tab icon={<VerifiedUser />} iconPosition="start" label="Compliance Dashboard" />
          <Tab icon={<GppBad />} iconPosition="start" label="Non-Compliant Tracker" />
          <Tab icon={<Fingerprint />} iconPosition="start" label="Signature Verification" />
        </Tabs>

        <Box sx={{ p: 3 }}>
          {/* =================================================================
              TAB 1: COMPLIANCE DASHBOARD
          ================================================================= */}
          {tabIndex === 0 && (
            <Box>
              <Grid container spacing={3} mb={4}>
                {policies.map((p) => {
                  const percent = Math.round((p.signed / p.total) * 100);
                  return (
                    <Grid item xs={12} md={4} key={p.id}>
                      <Card variant="outlined" sx={{ p: 2, borderLeft: 5, borderColor: percent === 100 ? 'success.main' : percent > 50 ? 'warning.main' : 'error.main' }}>
                        <Typography variant="h6" fontWeight="bold" noWrap>{p.title}</Typography>
                        <Typography variant="caption" color="text.secondary">Version {p.version} • Deadline: {p.deadline}</Typography>
                        
                        <Box mt={2} mb={1}>
                          <Box display="flex" justifyContent="space-between">
                            <Typography variant="body2">{percent}% Compliant</Typography>
                            <Typography variant="caption">{p.signed}/{p.total} Signed</Typography>
                          </Box>
                          <LinearProgress 
                            variant="determinate" value={percent} 
                            color={percent === 100 ? "success" : percent > 50 ? "warning" : "error"} 
                            sx={{ height: 8, borderRadius: 4, mt: 0.5 }}
                          />
                        </Box>
                        
                        {p.pending > 0 && (
                          <Button size="small" color="error" fullWidth startIcon={<Send />}>
                            Remind {p.pending} Pending
                          </Button>
                        )}
                      </Card>
                    </Grid>
                  );
                })}
              </Grid>

              <Typography variant="h6" gutterBottom>Detailed Compliance Report</Typography>
              <Table size="small">
                <TableHead sx={{ bgcolor: 'grey.100' }}>
                  <TableRow>
                    <TableCell>Policy Name</TableCell>
                    <TableCell>Total Faculty</TableCell>
                    <TableCell>Signed</TableCell>
                    <TableCell>Pending</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {policies.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell fontWeight="bold">{row.title}</TableCell>
                      <TableCell>{row.total}</TableCell>
                      <TableCell sx={{ color: 'success.main' }}>{row.signed}</TableCell>
                      <TableCell sx={{ color: 'error.main', fontWeight: 'bold' }}>{row.pending}</TableCell>
                      <TableCell>
                        <Chip 
                          label={row.pending === 0 ? "Fully Compliant" : "In Progress"} 
                          color={row.pending === 0 ? "success" : "warning"} 
                          size="small" 
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          )}

          {/* =================================================================
              TAB 2: NON-COMPLIANT TRACKER
          ================================================================= */}
          {tabIndex === 1 && (
            <Box>
              <Box display="flex" justifyContent="space-between" mb={3}>
                <Box display="flex" gap={2}>
                  <TextField 
                    select size="small" label="Filter by Policy" sx={{ width: 250 }}
                    value={filterPolicy} onChange={(e) => setFilterPolicy(e.target.value)}
                  >
                    <MenuItem value="All">All Policies</MenuItem>
                    {policies.map(p => <MenuItem key={p.id} value={p.title}>{p.title}</MenuItem>)}
                  </TextField>
                </Box>
                <Button variant="contained" color="warning" startIcon={<Email />}>
                  Send Bulk Reminders
                </Button>
              </Box>

              <Table>
                <TableHead sx={{ bgcolor: 'error.light' }}>
                  <TableRow>
                    <TableCell sx={{ color: 'error.contrastText' }}>Faculty Name</TableCell>
                    <TableCell sx={{ color: 'error.contrastText' }}>Department</TableCell>
                    <TableCell sx={{ color: 'error.contrastText' }}>Pending Policy</TableCell>
                    <TableCell sx={{ color: 'error.contrastText' }}>Days Overdue</TableCell>
                    <TableCell align="right" sx={{ color: 'error.contrastText' }}>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {facultyStatus.filter(f => filterPolicy === "All" || f.policy === filterPolicy).map((row) => (
                    <TableRow key={row.id}>
                      <TableCell fontWeight="bold">{row.name}</TableCell>
                      <TableCell>{row.dept}</TableCell>
                      <TableCell>{row.policy}</TableCell>
                      <TableCell>
                        <Chip label={`${row.daysOverdue} Days`} size="small" color={row.daysOverdue > 3 ? "error" : "warning"} variant="outlined" />
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip title="Send Individual Reminder">
                          <IconButton color="primary"><Send /></IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          )}

          {/* =================================================================
              TAB 3: SIGNATURE VERIFICATION
          ================================================================= */}
          {tabIndex === 2 && (
            <Box>
              <Typography variant="h6" gutterBottom display="flex" alignItems="center" gap={1}>
                <History /> Audit Logs & Certificates
              </Typography>
              <Table>
                <TableHead sx={{ bgcolor: 'grey.50' }}>
                  <TableRow>
                    <TableCell>Signed By</TableCell>
                    <TableCell>Policy</TableCell>
                    <TableCell>Timestamp</TableCell>
                    <TableCell>Verification Data</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Certificate</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {signatureLogs.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell fontWeight="bold">{row.name}</TableCell>
                      <TableCell>{row.policy}</TableCell>
                      <TableCell>{row.time}</TableCell>
                      <TableCell>
                        <Typography variant="caption" display="block">IP: {row.ip}</Typography>
                        <Typography variant="caption" display="block">Method: {row.method}</Typography>
                      </TableCell>
                      <TableCell>
                        <Chip icon={<CheckCircle />} label={row.otp} color="success" size="small" variant="outlined" />
                      </TableCell>
                      <TableCell align="right">
                        <Button size="small" variant="outlined" startIcon={<Download />}>
                          Download
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          )}
        </Box>
      </Card>
    </Box>
  );
};

export default PolicyComplianceView;