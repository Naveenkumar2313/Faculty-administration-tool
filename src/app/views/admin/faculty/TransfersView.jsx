import React, { useState } from "react";
import {
  Box, Card, Grid, Typography, Button, TextField, MenuItem,
  Tabs, Tab, Table, TableBody, TableCell, TableHead, TableRow,
  FormControlLabel, Checkbox, Divider, Chip, Avatar,
  InputAdornment, LinearProgress, Tooltip
} from "@mui/material";
import {
  SwapHoriz, ExitToApp, Calculate, Print, CheckCircle,
  Cancel, Description, AssignmentReturned, Person,
  ArrowForward, AccountBalance, Info, ArrowBack
} from "@mui/icons-material";

/* ─────────────────────────────────────────────
   Small reusable helpers
───────────────────────────────────────────── */
const SectionLabel = ({ children }) => (
  <Typography
    variant="overline"
    sx={{ color: "text.secondary", letterSpacing: "0.08em", fontSize: 11, fontWeight: 700 }}
  >
    {children}
  </Typography>
);

const RowStat = ({ label, value }) => (
  <Box sx={{ display: "flex", justifyContent: "space-between", py: 1, borderBottom: "1px solid", borderColor: "divider" }}>
    <Typography variant="body2" color="text.secondary">{label}</Typography>
    <Typography variant="body2" fontWeight={700}>{value}</Typography>
  </Box>
);

/* ─────────────────────────────────────────────
   Mock Data
───────────────────────────────────────────── */
const facultyList = [
  { id: 1, name: "Dr. Sarah Smith",   dept: "Computer Science", manager: "Prof. K. Rao",  joinDate: "2015-06-01" },
  { id: 2, name: "Prof. Rajan Kumar", dept: "Mechanical",        manager: "Dr. A. Singh",  joinDate: "2010-08-15" },
  { id: 3, name: "Dr. Emily Davis",   dept: "Civil Engg",        manager: "Prof. M. Ali",  joinDate: "2018-01-20" },
];

const exitRequests = [
  { id: 2, name: "Prof. Rajan Kumar", type: "Retirement",  date: "2026-05-31", status: "Processing", dept: "Mechanical",   progress: 60 },
  { id: 4, name: "Mr. John Doe",       type: "Resignation", date: "2026-03-15", status: "Pending",    dept: "Admin Office", progress: 20 },
];

const departments = ["Computer Science", "Mechanical", "Civil Engg", "Electrical", "Admin Office"];

const recentTransfers = [
  { name: "Dr. A. Verma",  from: "Civil", to: "Admin",     date: "Jan 10, 2026" },
  { name: "Ms. P. Nair",   from: "CS",    to: "Electrical", date: "Dec 22, 2025" },
  { name: "Prof. S. Khan", from: "Mech",  to: "Civil Engg", date: "Dec 01, 2025" },
];

/* ═══════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════ */
const TransfersView = () => {
  const [tabIndex, setTabIndex]               = useState(0);
  const [selectedFaculty, setSelectedFaculty] = useState("");
  const [exitFaculty, setExitFaculty]         = useState(null);
  const [newDept, setNewDept]                 = useState("");
  const [newManager, setNewManager]           = useState("");
  const [newCampus, setNewCampus]             = useState("");
  const [effectiveDate, setEffectiveDate]     = useState("");
  const [checklist, setChecklist]             = useState({ laptop: false, labKeys: false, library: false, idCard: false });

  const [basicPay, setBasicPay]         = useState(0);
  const [yearsService, setYearsService] = useState(0);
  const [leaveBalance, setLeaveBalance] = useState(0);
  const [settlement, setSettlement]     = useState({ gratuity: 0, leaveEncash: 0, total: 0, calculated: false });

  const selected     = facultyList.find(f => f.id === selectedFaculty);
  const checkedCount = Object.values(checklist).filter(Boolean).length;
  const initials     = (name) => name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();

  const calculateSettlement = () => {
    const gratuity   = Math.round((15 * Number(basicPay) * Number(yearsService)) / 26);
    const encashment = Math.round((Number(basicPay) / 30) * Number(leaveBalance));
    setSettlement({ gratuity, leaveEncash: encashment, total: gratuity + encashment, calculated: true });
  };

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>

      {/* ── Page Header ── */}
      <Box sx={{ mb: 3, display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 1.5 }}>
        <Box>
          <SectionLabel>Human Resources · Administration</SectionLabel>
          <Typography variant="h5" fontWeight={800} sx={{ letterSpacing: "-0.01em" }}>
            Transfer & Separation Management
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 1, pt: 0.5 }}>
          <Chip icon={<ExitToApp fontSize="small" />} label={`${exitRequests.length} Pending Exits`} variant="outlined" color="warning" size="small" sx={{ fontWeight: 600 }} />
          <Chip icon={<SwapHoriz fontSize="small" />} label="3 Transfers This Month" variant="outlined" color="primary" size="small" sx={{ fontWeight: 600 }} />
        </Box>
      </Box>

      {/* ── Main Card ── */}
      <Card elevation={1} sx={{ borderRadius: 2 }}>
        <Tabs
          value={tabIndex}
          onChange={(_, v) => setTabIndex(v)}
          sx={{ borderBottom: 1, borderColor: "divider", px: 2, bgcolor: "grey.50" }}
        >
          <Tab icon={<SwapHoriz fontSize="small" />} iconPosition="start" label="Internal Transfers"
            sx={{ textTransform: "none", fontWeight: 600, minHeight: 52 }} />
          <Tab icon={<ExitToApp fontSize="small" />} iconPosition="start" label="Separation & Exits"
            sx={{ textTransform: "none", fontWeight: 600, minHeight: 52 }} />
        </Tabs>

        <Box sx={{ p: 3 }}>

          {/* ══════════════════════════════════════
              TAB 0 — INTERNAL TRANSFERS
          ══════════════════════════════════════ */}
          {tabIndex === 0 && (
            <Grid container spacing={3}>

              {/* LEFT: Form */}
              <Grid item xs={12} md={7}>
                <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                  Initiate Faculty Transfer
                </Typography>

                <Card variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
                  <Grid container spacing={2.5}>

                    {/* Faculty Selector */}
                    <Grid item xs={12}>
                      <TextField
                        select fullWidth label="Select Faculty Member" size="small"
                        value={selectedFaculty}
                        onChange={e => setSelectedFaculty(e.target.value)}
                      >
                        {facultyList.map(f => (
                          <MenuItem key={f.id} value={f.id}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                              <Avatar sx={{ width: 28, height: 28, bgcolor: "primary.main", fontSize: 11, fontWeight: 700 }}>
                                {initials(f.name)}
                              </Avatar>
                              <Box>
                                <Typography variant="body2" fontWeight={600}>{f.name}</Typography>
                                <Typography variant="caption" color="text.secondary">{f.dept}</Typography>
                              </Box>
                            </Box>
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>

                    {/* Selected Faculty Banner */}
                    {selected && (
                      <Grid item xs={12}>
                        <Box sx={{
                          display: "flex", alignItems: "center", gap: 2, p: 2,
                          bgcolor: "primary.50", border: "1px solid", borderColor: "primary.200", borderRadius: 1.5
                        }}>
                          <Avatar sx={{ bgcolor: "primary.main", fontWeight: 700 }}>{initials(selected.name)}</Avatar>
                          <Box>
                            <Typography variant="body2" fontWeight={700}>{selected.name}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              {selected.dept} &nbsp;·&nbsp; Reports to {selected.manager} &nbsp;·&nbsp; Joined {selected.joinDate}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                    )}

                    {/* Read-only Current Info */}
                    <Grid item xs={12} sm={6}>
                      <TextField fullWidth label="Current Department" size="small"
                        value={selected ? selected.dept : ""} disabled />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField fullWidth label="Current Reporting Manager" size="small"
                        value={selected ? selected.manager : ""} disabled />
                    </Grid>

                    <Grid item xs={12}>
                      <Divider>
                        <Chip label="Transfer Details" size="small" variant="outlined" />
                      </Divider>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField select fullWidth label="New Department" size="small"
                        value={newDept} onChange={e => setNewDept(e.target.value)}>
                        {departments.map(d => <MenuItem key={d} value={d}>{d}</MenuItem>)}
                      </TextField>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField select fullWidth label="New Reporting Manager" size="small"
                        value={newManager} onChange={e => setNewManager(e.target.value)}>
                        <MenuItem value="HOD1">Dr. HOD One</MenuItem>
                        <MenuItem value="HOD2">Dr. HOD Two</MenuItem>
                      </TextField>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField type="date" fullWidth label="Effective Date" size="small"
                        InputLabelProps={{ shrink: true }}
                        value={effectiveDate} onChange={e => setEffectiveDate(e.target.value)} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField select fullWidth label="New Campus Location" size="small"
                        value={newCampus} onChange={e => setNewCampus(e.target.value)}>
                        <MenuItem value="Main">Main Campus</MenuItem>
                        <MenuItem value="City">City Campus</MenuItem>
                      </TextField>
                    </Grid>

                    {/* Checklist */}
                    <Grid item xs={12}>
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                        <Typography variant="subtitle2" fontWeight={700}>Asset Handover Checklist</Typography>
                        <Chip
                          label={`${checkedCount} / 4 Confirmed`} size="small"
                          color={checkedCount === 4 ? "success" : "default"}
                          variant={checkedCount === 4 ? "filled" : "outlined"}
                          sx={{ fontSize: 11, fontWeight: 600 }}
                        />
                      </Box>
                      <Box sx={{ display: "flex", flexWrap: "wrap" }}>
                        {[
                          { key: "laptop",  label: "Laptop / Devices" },
                          { key: "labKeys", label: "Lab Keys" },
                          { key: "library", label: "Library Books" },
                          { key: "idCard",  label: "ID Card Re-issue" },
                        ].map(item => (
                          <Box key={item.key} sx={{ width: "50%" }}>
                            <FormControlLabel
                              control={
                                <Checkbox size="small"
                                  checked={checklist[item.key]}
                                  onChange={() => setChecklist(p => ({ ...p, [item.key]: !p[item.key] }))} />
                              }
                              label={<Typography variant="body2">{item.label}</Typography>}
                            />
                          </Box>
                        ))}
                      </Box>
                    </Grid>

                    <Grid item xs={12}>
                      <Button variant="contained" color="primary" fullWidth startIcon={<SwapHoriz />}
                        sx={{ textTransform: "none", fontWeight: 700, py: 1.2, borderRadius: 1.5 }}>
                        Process Transfer
                      </Button>
                    </Grid>
                  </Grid>
                </Card>
              </Grid>

              {/* RIGHT: History + Stats */}
              <Grid item xs={12} md={5}>
                <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                  Recent Transfer History
                </Typography>
                <Card variant="outlined" sx={{ borderRadius: 2, overflow: "hidden" }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ bgcolor: "grey.50" }}>
                        <TableCell sx={{ fontWeight: 700, fontSize: 12, color: "text.secondary" }}>Faculty</TableCell>
                        <TableCell sx={{ fontWeight: 700, fontSize: 12, color: "text.secondary" }}>Movement</TableCell>
                        <TableCell sx={{ fontWeight: 700, fontSize: 12, color: "text.secondary" }}>Date</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {recentTransfers.map((r, i) => (
                        <TableRow key={i} hover>
                          <TableCell><Typography variant="body2" fontWeight={600}>{r.name}</Typography></TableCell>
                          <TableCell>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                              <Typography variant="caption" color="text.secondary">{r.from}</Typography>
                              <ArrowForward sx={{ fontSize: 11, color: "primary.main" }} />
                              <Typography variant="caption" fontWeight={600}>{r.to}</Typography>
                            </Box>
                          </TableCell>
                          <TableCell><Typography variant="caption" color="text.secondary">{r.date}</Typography></TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Card>

                <Card variant="outlined" sx={{ borderRadius: 2, p: 2.5, mt: 2 }}>
                  <Typography variant="subtitle2" fontWeight={700} gutterBottom>Module Summary</Typography>
                  <RowStat label="Total Faculty" value="147" />
                  <RowStat label="Transfers This Year" value="12" />
                  <RowStat label="Avg. Processing Time" value="3.2 days" />
                  <RowStat label="Pending Approvals" value="2" />
                </Card>
              </Grid>
            </Grid>
          )}

          {/* ══════════════════════════════════════
              TAB 1 — SEPARATION & EXITS
          ══════════════════════════════════════ */}
          {tabIndex === 1 && (
            <Box>
              {!exitFaculty ? (
                /* ── Queue ── */
                <Box>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                    <Typography variant="subtitle1" fontWeight={700}>Resignation & Retirement Queue</Typography>
                    <Chip label={`${exitRequests.length} Active`} size="small" color="error" variant="outlined" sx={{ fontWeight: 600, fontSize: 11 }} />
                  </Box>

                  <Card variant="outlined" sx={{ borderRadius: 2, overflow: "hidden" }}>
                    <Table>
                      <TableHead>
                        <TableRow sx={{ bgcolor: "grey.50" }}>
                          {["Faculty", "Type", "Last Working Day", "Clearance Progress", "Status", ""].map(h => (
                            <TableCell key={h} sx={{ fontWeight: 700, fontSize: 12, color: "text.secondary" }}>{h}</TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {exitRequests.map(row => (
                          <TableRow key={row.id} hover>
                            <TableCell>
                              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                                <Avatar sx={{ width: 34, height: 34, bgcolor: "grey.300", color: "text.primary", fontSize: 12, fontWeight: 700 }}>
                                  {initials(row.name)}
                                </Avatar>
                                <Box>
                                  <Typography variant="body2" fontWeight={600}>{row.name}</Typography>
                                  <Typography variant="caption" color="text.secondary">{row.dept}</Typography>
                                </Box>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Chip label={row.type} size="small" variant="outlined"
                                color={row.type === "Retirement" ? "info" : "warning"}
                                sx={{ fontWeight: 600, fontSize: 11 }} />
                            </TableCell>
                            <TableCell><Typography variant="body2">{row.date}</Typography></TableCell>
                            <TableCell sx={{ minWidth: 130 }}>
                              <LinearProgress variant="determinate" value={row.progress}
                                color={row.progress > 50 ? "success" : "primary"}
                                sx={{ height: 6, borderRadius: 3, mb: 0.5 }} />
                              <Typography variant="caption" color="text.secondary">{row.progress}% complete</Typography>
                            </TableCell>
                            <TableCell>
                              <Chip label={row.status} size="small"
                                color={row.status === "Processing" ? "primary" : "default"}
                                sx={{ fontWeight: 600, fontSize: 11 }} />
                            </TableCell>
                            <TableCell align="right">
                              <Button variant="outlined" size="small" color="primary"
                                onClick={() => { setExitFaculty(row); setBasicPay(142000); setYearsService(15); }}
                                sx={{ textTransform: "none", fontWeight: 600, borderRadius: 1.5 }}>
                                Process Exit
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Card>
                </Box>
              ) : (
                /* ── Exit Detail ── */
                <Box>
                  <Button startIcon={<ArrowBack />} onClick={() => setExitFaculty(null)}
                    sx={{ mb: 2, textTransform: "none", fontWeight: 600, color: "text.secondary" }}>
                    Back to Queue
                  </Button>

                  {/* Faculty Banner */}
                  <Box sx={{
                    display: "flex", alignItems: "center", gap: 2, p: 2.5, mb: 3,
                    bgcolor: "grey.50", border: "1px solid", borderColor: "divider", borderRadius: 2
                  }}>
                    <Avatar sx={{ width: 48, height: 48, bgcolor: "primary.main", fontWeight: 800, fontSize: 16 }}>
                      {initials(exitFaculty.name)}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" fontWeight={800}>{exitFaculty.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {exitFaculty.type} Processing &nbsp;·&nbsp; Last Working Day: {exitFaculty.date}
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: "right" }}>
                      <Typography variant="caption" color="text.secondary" display="block">Overall Progress</Typography>
                      <Typography variant="h5" fontWeight={800} color="primary.main">{exitFaculty.progress}%</Typography>
                    </Box>
                  </Box>

                  <Grid container spacing={3}>
                    {/* LEFT: Clearance */}
                    <Grid item xs={12} md={6}>
                      <Card variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
                        <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>1. No-Dues Clearance</Typography>
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                          {[
                            { label: "Library Books Returned",             defaultChecked: true  },
                            { label: "IT Assets (Laptop/Dongle) Returned", defaultChecked: true  },
                            { label: "Finance (Loans/Advances) Cleared",   defaultChecked: false },
                            { label: "Admin ID Card & Keys Returned",      defaultChecked: false },
                          ].map((item, i) => (
                            <FormControlLabel key={i}
                              control={<Checkbox defaultChecked={item.defaultChecked} size="small" />}
                              label={<Typography variant="body2">{item.label}</Typography>}
                            />
                          ))}
                        </Box>

                        <Divider sx={{ my: 2.5 }} />

                        <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1.5 }}>2. Documentation</Typography>
                        <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
                          <Button variant="outlined" size="small" startIcon={<AssignmentReturned />}
                            sx={{ textTransform: "none", fontWeight: 600, borderRadius: 1.5 }}>
                            Exit Interview
                          </Button>
                          <Button variant="outlined" size="small" startIcon={<Print />}
                            sx={{ textTransform: "none", fontWeight: 600, borderRadius: 1.5 }}>
                            No-Dues Certificate
                          </Button>
                        </Box>
                      </Card>
                    </Grid>

                    {/* RIGHT: Calculator */}
                    <Grid item xs={12} md={6}>
                      <Card variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
                        <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
                          <AccountBalance fontSize="small" color="primary" />
                          Final Settlement Calculator
                        </Typography>

                        <Grid container spacing={2}>
                          <Grid item xs={6}>
                            <TextField fullWidth label="Last Basic Pay" type="number" size="small"
                              value={basicPay} onChange={e => setBasicPay(e.target.value)}
                              InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment> }} />
                          </Grid>
                          <Grid item xs={6}>
                            <TextField fullWidth label="Service Years" type="number" size="small"
                              value={yearsService} onChange={e => setYearsService(e.target.value)} />
                          </Grid>
                          <Grid item xs={12}>
                            <TextField fullWidth label="Earned Leave Balance (Days)" type="number" size="small"
                              value={leaveBalance} onChange={e => setLeaveBalance(e.target.value)} />
                          </Grid>
                          <Grid item xs={12}>
                            <Button variant="contained" fullWidth onClick={calculateSettlement}
                              startIcon={<Calculate />}
                              sx={{ textTransform: "none", fontWeight: 700, py: 1.1, borderRadius: 1.5 }}>
                              Calculate Settlement
                            </Button>
                          </Grid>

                          {settlement.calculated && (
                            <Grid item xs={12}>
                              <Divider sx={{ mb: 1.5 }} />
                              <Box sx={{ display: "flex", justifyContent: "space-between", py: 1 }}>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                  <Typography variant="body2" color="text.secondary">Gratuity</Typography>
                                  <Tooltip title="(15 × Basic × Years) ÷ 26" arrow>
                                    <Info sx={{ fontSize: 13, color: "text.disabled", cursor: "help" }} />
                                  </Tooltip>
                                </Box>
                                <Typography variant="body2" fontWeight={700}>
                                  ₹{settlement.gratuity.toLocaleString("en-IN")}
                                </Typography>
                              </Box>
                              <Box sx={{ display: "flex", justifyContent: "space-between", py: 1 }}>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                  <Typography variant="body2" color="text.secondary">Leave Encashment</Typography>
                                  <Tooltip title="(Basic ÷ 30) × Leave Days" arrow>
                                    <Info sx={{ fontSize: 13, color: "text.disabled", cursor: "help" }} />
                                  </Tooltip>
                                </Box>
                                <Typography variant="body2" fontWeight={700}>
                                  ₹{settlement.leaveEncash.toLocaleString("en-IN")}
                                </Typography>
                              </Box>
                              <Box sx={{
                                display: "flex", justifyContent: "space-between", alignItems: "center",
                                mt: 1.5, p: 1.5, bgcolor: "success.light", borderRadius: 1.5
                              }}>
                                <Typography fontWeight={700} color="white">Total Payable</Typography>
                                <Typography variant="h6" fontWeight={800} color="white">
                                  ₹{settlement.total.toLocaleString("en-IN")}
                                </Typography>
                              </Box>
                            </Grid>
                          )}
                        </Grid>
                      </Card>

                      <Box sx={{ display: "flex", gap: 1.5, mt: 2, justifyContent: "flex-end", flexWrap: "wrap" }}>
                        <Button variant="contained" color="secondary" startIcon={<Description />}
                          sx={{ textTransform: "none", fontWeight: 600, borderRadius: 1.5 }}>
                          Generate Service Cert
                        </Button>
                        <Button variant="contained" color="success" startIcon={<CheckCircle />}
                          sx={{ textTransform: "none", fontWeight: 700, borderRadius: 1.5 }}>
                          Finalize & Close
                        </Button>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              )}
            </Box>
          )}
        </Box>
      </Card>
    </Box>
  );
};

export default TransfersView;