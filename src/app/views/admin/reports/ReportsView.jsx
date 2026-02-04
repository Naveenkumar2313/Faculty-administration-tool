import React, { useState } from "react";
import { 
  Box, Card, Grid, Typography, Button, TextField, MenuItem, 
  Table, TableBody, TableCell, TableHead, TableRow, Chip, 
  FormControl, InputLabel, Select, Checkbox, ListItemText, OutlinedInput
} from "@mui/material";
import { 
  Description, PictureAsPdf, TableView, Download, 
  FilterAlt, Assessment, PieChart, BarChart 
} from "@mui/icons-material";

const ReportsView = () => {
  const [reportCategory, setReportCategory] = useState("HR");
  const [selectedReport, setSelectedReport] = useState("");
  const [filters, setFilters] = useState({
    dept: [],
    dateFrom: "",
    dateTo: "",
    designation: "All"
  });

  // MOCK DEPARTMENTS
  const departments = ["CSE", "ECE", "Mech", "Civil", "Electrical", "Science"];
  
  // REPORT DEFINITIONS
  const reportTypes = {
    HR: [
      { id: "hr_strength", name: "Faculty Strength by Department", type: "Chart" },
      { id: "hr_attendance", name: "Attendance Summary (Monthly)", type: "Table" },
      { id: "hr_leave", name: "Leave Balance Report", type: "Table" },
      { id: "hr_salary", name: "Salary Register (Month-wise)", type: "Table" },
      { id: "hr_increment", name: "Increment History", type: "Table" },
    ],
    Financial: [
      { id: "fin_reimburse", name: "Reimbursement Summary", type: "Table" },
      { id: "fin_budget", name: "Budget vs Actual Expenditure", type: "Chart" },
      { id: "fin_loan", name: "Outstanding Loan Report", type: "Table" },
    ],
    Academic: [
      { id: "aca_pubs", name: "Publication Count by Dept", type: "Chart" },
      { id: "aca_grants", name: "Grant Portfolio Overview", type: "Table" },
      { id: "aca_pbas", name: "PBAS Submission Status", type: "Table" },
      { id: "aca_committee", name: "Committee Membership Matrix", type: "Table" },
    ],
    Compliance: [
      { id: "comp_policy", name: "Policy Compliance Rate", type: "Chart" },
      { id: "comp_bond", name: "Service Bond Status", type: "Table" },
      { id: "comp_asset", name: "Asset Verification Status", type: "Table" },
    ]
  };

  // MOCK REPORT PREVIEW DATA
  const previewData = [
    { col1: "Computer Science", col2: "45 Faculty", col3: "92% Attendance", col4: "₹42.5L Salary" },
    { col1: "Mechanical", col2: "35 Faculty", col3: "88% Attendance", col4: "₹35.2L Salary" },
    { col1: "Civil Engg", col2: "25 Faculty", col3: "85% Attendance", col4: "₹28.1L Salary" },
    { col1: "Electrical", col2: "20 Faculty", col3: "90% Attendance", col4: "₹22.4L Salary" },
  ];

  // HANDLERS
  const handleDeptChange = (event) => {
    const { target: { value } } = event;
    setFilters({ ...filters, dept: typeof value === 'string' ? value.split(',') : value });
  };

  const handleGenerate = () => {
    // Logic to fetch and render report based on 'selectedReport' and 'filters'
    alert(`Generating ${selectedReport || "Report"}...`);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }} display="flex" alignItems="center" gap={1}>
        <Assessment fontSize="large" color="primary" /> Report Generation Engine
      </Typography>

      <Grid container spacing={3}>
        {/* LEFT: REPORT SELECTION & FILTERS */}
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>1. Select Report Type</Typography>
            
            <Box display="flex" gap={1} flexWrap="wrap" mb={3}>
              {Object.keys(reportTypes).map((cat) => (
                <Chip 
                  key={cat} label={cat} clickable
                  color={reportCategory === cat ? "primary" : "default"}
                  onClick={() => { setReportCategory(cat); setSelectedReport(""); }}
                />
              ))}
            </Box>

            <TextField 
              select fullWidth label={`Select ${reportCategory} Report`} size="small" sx={{ mb: 3 }}
              value={selectedReport} onChange={(e) => setSelectedReport(e.target.value)}
            >
              {reportTypes[reportCategory].map((rep) => (
                <MenuItem key={rep.id} value={rep.name}>
                  <Box display="flex" alignItems="center" gap={1}>
                    {rep.type === 'Chart' ? <PieChart fontSize="small" color="action"/> : <TableView fontSize="small" color="action"/>}
                    {rep.name}
                  </Box>
                </MenuItem>
              ))}
            </TextField>

            <Typography variant="h6" gutterBottom>2. Apply Filters</Typography>
            
            <FormControl fullWidth size="small" sx={{ mb: 2 }}>
              <InputLabel>Departments</InputLabel>
              <Select
                multiple value={filters.dept} onChange={handleDeptChange}
                input={<OutlinedInput label="Departments" />}
                renderValue={(selected) => selected.join(', ')}
              >
                {departments.map((name) => (
                  <MenuItem key={name} value={name}>
                    <Checkbox checked={filters.dept.indexOf(name) > -1} />
                    <ListItemText primary={name} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Grid container spacing={2} mb={2}>
              <Grid item xs={6}>
                <TextField 
                  fullWidth type="date" label="From" size="small" InputLabelProps={{ shrink: true }} 
                  value={filters.dateFrom} onChange={(e) => setFilters({...filters, dateFrom: e.target.value})}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField 
                  fullWidth type="date" label="To" size="small" InputLabelProps={{ shrink: true }} 
                  value={filters.dateTo} onChange={(e) => setFilters({...filters, dateTo: e.target.value})}
                />
              </Grid>
            </Grid>

            <TextField 
              select fullWidth label="Employee Designation" size="small" sx={{ mb: 3 }}
              value={filters.designation} onChange={(e) => setFilters({...filters, designation: e.target.value})}
            >
              <MenuItem value="All">All Designations</MenuItem>
              <MenuItem value="Professor">Professor</MenuItem>
              <MenuItem value="Associate Professor">Associate Professor</MenuItem>
              <MenuItem value="Asst. Professor">Asst. Professor</MenuItem>
            </TextField>

            <Button 
              variant="contained" fullWidth size="large" startIcon={<Description />}
              disabled={!selectedReport} onClick={handleGenerate}
            >
              Generate Report
            </Button>
          </Card>
        </Grid>

        {/* RIGHT: PREVIEW & EXPORT */}
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 0, height: '100%', minHeight: 500, display: 'flex', flexDirection: 'column' }}>
            <Box p={2} borderBottom="1px solid #eee" display="flex" justifyContent="space-between" alignItems="center" bgcolor="grey.50">
              <Box>
                <Typography variant="subtitle1" fontWeight="bold">
                  Preview: {selectedReport || "Select a report..."}
                </Typography>
                {selectedReport && (
                  <Typography variant="caption" color="text.secondary">
                    Filters: {filters.dept.length ? filters.dept.join(", ") : "All Depts"} • {filters.dateFrom || "Start"} to {filters.dateTo || "End"}
                  </Typography>
                )}
              </Box>
              <Box>
                <Button size="small" startIcon={<PictureAsPdf />} sx={{ mr: 1 }}>PDF</Button>
                <Button size="small" startIcon={<TableView />} sx={{ mr: 1 }}>Excel</Button>
                <Button size="small" startIcon={<Download />}>CSV</Button>
              </Box>
            </Box>

            <Box p={3} flexGrow={1}>
              {selectedReport ? (
                <>
                  {/* Mock Chart Placeholder */}
                  {selectedReport.includes("Chart") || selectedReport.includes("Strength") || selectedReport.includes("Budget") ? (
                    <Box height={300} display="flex" alignItems="center" justifyContent="center" bgcolor="#f9f9f9" borderRadius={2} mb={3}>
                      <BarChart sx={{ fontSize: 100, color: 'action.disabled' }} />
                      <Typography color="text.secondary">Chart Visualization would appear here</Typography>
                    </Box>
                  ) : null}

                  {/* Data Table */}
                  <Table size="small" sx={{ border: '1px solid #eee' }}>
                    <TableHead sx={{ bgcolor: 'primary.50' }}>
                      <TableRow>
                        <TableCell fontWeight="bold">Department / Metric</TableCell>
                        <TableCell>Data Point A</TableCell>
                        <TableCell>Data Point B</TableCell>
                        <TableCell>Data Point C</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {previewData.map((row, i) => (
                        <TableRow key={i}>
                          <TableCell fontWeight="bold">{row.col1}</TableCell>
                          <TableCell>{row.col2}</TableCell>
                          <TableCell>{row.col3}</TableCell>
                          <TableCell>{row.col4}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </>
              ) : (
                <Box height="100%" display="flex" flexDirection="column" alignItems="center" justifyContent="center" color="text.secondary">
                  <FilterAlt sx={{ fontSize: 60, mb: 2, opacity: 0.5 }} />
                  <Typography>Select parameters on the left to generate a preview.</Typography>
                </Box>
              )}
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ReportsView;