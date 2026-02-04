import React, { useState } from "react";
import { 
  Box, Card, Grid, Typography, Button, TextField, MenuItem, 
  Tabs, Tab, Table, TableBody, TableCell, TableHead, TableRow, 
  Chip, Checkbox, FormControlLabel, FormGroup, Switch, IconButton 
} from "@mui/material";
import { 
  Campaign, NotificationsActive, Send, Schedule, 
  AttachFile, Delete, Edit, MarkEmailRead 
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";

const HiddenInput = styled('input')({ display: 'none' });

const CommunicationAdminView = () => {
  const [tabIndex, setTabIndex] = useState(0);

  // MOCK DATA: ANNOUNCEMENT HISTORY
  const [history, setHistory] = useState([
    { id: 1, title: "PBAS Submission Deadline Extended", target: "All Faculty", date: "2026-02-01", status: "Sent", type: "Email + App" },
    { id: 2, title: "Maintenance: Server Downtime", target: "CSE Dept", date: "2026-02-10", status: "Scheduled", type: "In-App" },
  ]);

  // MOCK DATA: AUTOMATED ALERTS
  const [alerts, setAlerts] = useState([
    { id: 1, name: "Probation Ending", trigger: "30 Days Before", recipient: "HR Head", active: true },
    { id: 2, name: "Low Leave Balance", trigger: "< 3 CL Remaining", recipient: "Faculty", active: true },
    { id: 3, name: "PBAS Deadline", trigger: "7 Days Before", recipient: "All Eligible Faculty", active: false },
    { id: 4, name: "Asset Verification", trigger: "Annual (March 1st)", recipient: "All Faculty", active: true },
  ]);

  // FORM STATE
  const [announcement, setAnnouncement] = useState({
    title: "", message: "", target: "All Faculty", dept: "", designation: "",
    email: true, app: true, schedule: false, date: ""
  });

  const handleTabChange = (event, newValue) => setTabIndex(newValue);

  const handleSend = () => {
    const newEntry = {
      id: Date.now(),
      title: announcement.title,
      target: announcement.target === "Specific Department" ? announcement.dept : announcement.target,
      date: announcement.schedule ? announcement.date : new Date().toISOString().split('T')[0],
      status: announcement.schedule ? "Scheduled" : "Sent",
      type: `${announcement.email ? "Email" : ""}${announcement.email && announcement.app ? " + " : ""}${announcement.app ? "App" : ""}`
    };
    setHistory([newEntry, ...history]);
    // Reset form
    setAnnouncement({ title: "", message: "", target: "All Faculty", dept: "", designation: "", email: true, app: true, schedule: false, date: "" });
  };

  const toggleAlert = (id) => {
    setAlerts(alerts.map(a => a.id === id ? { ...a, active: !a.active } : a));
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
        Notifications & Communication Center
      </Typography>

      <Card sx={{ minHeight: 500 }}>
        <Tabs 
          value={tabIndex} 
          onChange={handleTabChange} 
          sx={{ borderBottom: 1, borderColor: 'divider', px: 2, bgcolor: 'background.paper' }}
        >
          <Tab icon={<Campaign />} iconPosition="start" label="Bulk Announcements" />
          <Tab icon={<NotificationsActive />} iconPosition="start" label="Automated Alerts Config" />
        </Tabs>

        <Box sx={{ p: 3 }}>
          {/* =================================================================
              TAB 1: BULK ANNOUNCEMENTS
          ================================================================= */}
          {tabIndex === 0 && (
            <Grid container spacing={3}>
              {/* LEFT: COMPOSE */}
              <Grid item xs={12} md={5}>
                <Card variant="outlined" sx={{ p: 3, bgcolor: 'grey.50' }}>
                  <Typography variant="h6" gutterBottom>Compose Announcement</Typography>
                  
                  <TextField 
                    fullWidth label="Subject / Title" size="small" sx={{ mb: 2, bgcolor: 'white' }}
                    value={announcement.title} onChange={(e) => setAnnouncement({...announcement, title: e.target.value})}
                  />
                  
                  <TextField 
                    select fullWidth label="Target Audience" size="small" sx={{ mb: 2, bgcolor: 'white' }}
                    value={announcement.target} onChange={(e) => setAnnouncement({...announcement, target: e.target.value})}
                  >
                    <MenuItem value="All Faculty">All Faculty</MenuItem>
                    <MenuItem value="Specific Department">Specific Department</MenuItem>
                    <MenuItem value="Specific Designation">Specific Designation</MenuItem>
                  </TextField>

                  {announcement.target === "Specific Department" && (
                     <TextField 
                       select fullWidth label="Select Department" size="small" sx={{ mb: 2, bgcolor: 'white' }}
                       value={announcement.dept} onChange={(e) => setAnnouncement({...announcement, dept: e.target.value})}
                     >
                       <MenuItem value="CSE">Computer Science</MenuItem>
                       <MenuItem value="ECE">Electronics</MenuItem>
                       <MenuItem value="Mech">Mechanical</MenuItem>
                     </TextField>
                  )}

                  <TextField 
                    fullWidth multiline rows={4} label="Message Body" sx={{ mb: 2, bgcolor: 'white' }}
                    value={announcement.message} onChange={(e) => setAnnouncement({...announcement, message: e.target.value})}
                  />

                  <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                    <Button component="label" size="small" startIcon={<AttachFile />}>
                      Attach File
                      <HiddenInput type="file" />
                    </Button>
                    <FormGroup row>
                      <FormControlLabel 
                        control={<Checkbox checked={announcement.email} onChange={(e) => setAnnouncement({...announcement, email: e.target.checked})} />} 
                        label="Email" 
                      />
                      <FormControlLabel 
                        control={<Checkbox checked={announcement.app} onChange={(e) => setAnnouncement({...announcement, app: e.target.checked})} />} 
                        label="In-App" 
                      />
                    </FormGroup>
                  </Box>

                  <FormControlLabel 
                    control={<Switch checked={announcement.schedule} onChange={(e) => setAnnouncement({...announcement, schedule: e.target.checked})} />} 
                    label="Schedule for Later" 
                  />
                  {announcement.schedule && (
                    <TextField 
                      type="datetime-local" fullWidth size="small" sx={{ mt: 1, bgcolor: 'white' }}
                      value={announcement.date} onChange={(e) => setAnnouncement({...announcement, date: e.target.value})}
                    />
                  )}

                  <Button 
                    variant="contained" fullWidth size="large" sx={{ mt: 3 }}
                    startIcon={announcement.schedule ? <Schedule /> : <Send />}
                    onClick={handleSend}
                  >
                    {announcement.schedule ? "Schedule Announcement" : "Send Now"}
                  </Button>
                </Card>
              </Grid>

              {/* RIGHT: HISTORY */}
              <Grid item xs={12} md={7}>
                <Typography variant="h6" gutterBottom>Announcement History</Typography>
                <Table size="small">
                  <TableHead sx={{ bgcolor: 'grey.100' }}>
                    <TableRow>
                      <TableCell>Title</TableCell>
                      <TableCell>Target</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Channels</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {history.map((row) => (
                      <TableRow key={row.id}>
                        <TableCell fontWeight="bold">{row.title}</TableCell>
                        <TableCell>{row.target}</TableCell>
                        <TableCell>{row.date}</TableCell>
                        <TableCell>
                          <Chip 
                            label={row.status} size="small" 
                            color={row.status === 'Sent' ? 'success' : 'info'} 
                          />
                        </TableCell>
                        <TableCell>
                          <Box display="flex" gap={0.5}>
                            {row.type.includes("Email") && <MarkEmailRead fontSize="small" color="action" />}
                            {row.type.includes("App") && <NotificationsActive fontSize="small" color="action" />}
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Grid>
            </Grid>
          )}

          {/* =================================================================
              TAB 2: AUTOMATED ALERTS
          ================================================================= */}
          {tabIndex === 1 && (
            <Box>
              <Typography variant="h6" gutterBottom>System Triggered Alerts</Typography>
              <Table>
                <TableHead sx={{ bgcolor: 'grey.100' }}>
                  <TableRow>
                    <TableCell>Alert Name</TableCell>
                    <TableCell>Trigger Condition</TableCell>
                    <TableCell>Recipient</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Config</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {alerts.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell fontWeight="bold">{row.name}</TableCell>
                      <TableCell>
                        <Chip label={row.trigger} size="small" variant="outlined" />
                      </TableCell>
                      <TableCell>{row.recipient}</TableCell>
                      <TableCell>
                        <Switch 
                          checked={row.active} 
                          onChange={() => toggleAlert(row.id)}
                          color="success"
                        />
                        <Typography variant="caption" sx={{ ml: 1 }}>
                          {row.active ? "Active" : "Disabled"}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <IconButton size="small"><Edit /></IconButton>
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

export default CommunicationAdminView;