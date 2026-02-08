import React, { useState } from "react";
import { 
  Box, Card, Grid, Typography, Button, TextField, MenuItem, 
  Tabs, Tab, Table, TableBody, TableCell, TableHead, TableRow, 
  Chip, Checkbox, FormControlLabel, FormGroup, Switch, IconButton,
  Divider, LinearProgress, Avatar, Tooltip, List, ListItem, 
  ListItemText, ListItemIcon, InputAdornment, Paper
} from "@mui/material";
import { 
  Campaign, NotificationsActive, Send, Schedule, 
  AttachFile, Delete, Edit, MarkEmailRead, WhatsApp, Sms, 
  Poll, BarChart, Feedback, GroupAdd, PieChart, DoneAll,
  FormatBold, FormatItalic, FormatListBulleted, Image,
  Link as LinkIcon, Update, Warning
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";

const HiddenInput = styled('input')({ display: 'none' });

const CommunicationAdminView = () => {
  const [tabIndex, setTabIndex] = useState(0);

  // --- MOCK DATA ---

  // 1. HISTORY & ANALYTICS
  const [history, setHistory] = useState([
    { 
      id: 1, title: "PBAS Submission Deadline Extended", target: "All Faculty", 
      date: "2026-02-01", status: "Sent", channels: ["Email", "App"],
      stats: { sent: 150, delivered: 148, read: 120, clicked: 45 },
      recurring: "No"
    },
    { 
      id: 2, title: "Urgent: Server Downtime", target: "CSE Dept", 
      date: "2026-02-10", status: "Scheduled", channels: ["SMS", "WhatsApp"],
      stats: { sent: 0, delivered: 0, read: 0, clicked: 0 },
      recurring: "No"
    },
    { 
      id: 3, title: "Weekly Faculty Meet", target: "HODs", 
      date: "Every Monday", status: "Active", channels: ["Calendar"],
      stats: { sent: 40, delivered: 40, read: 35, clicked: 10 },
      recurring: "Weekly"
    },
  ]);

  // 2. FEEDBACK / TWO-WAY
  const [feedback, setFeedback] = useState([
    { id: 101, from: "Dr. Sarah Smith", subject: "Re: PBAS Deadline", message: "Can we submit hard copies?", date: "2026-02-02", status: "Unread" },
    { id: 102, from: "Prof. Rajan Kumar", subject: "Poll Response", message: "Voted for Option B", date: "2026-02-03", status: "Read" },
  ]);

  // 3. GATEWAY CREDITS
  const [credits, setCredits] = useState({
    sms: 4500,
    whatsapp: 1200,
    email: "Unlimited"
  });

  // 4. AUTOMATED ALERTS
  const [alerts, setAlerts] = useState([
    { id: 1, name: "Probation Ending", trigger: "30 Days Before", recipient: "HR Head", active: true },
    { id: 2, name: "Low Leave Balance", trigger: "< 3 CL Remaining", recipient: "Faculty", active: true },
    { id: 3, name: "Asset Verification", trigger: "Annual (March 1st)", recipient: "All Faculty", active: true },
  ]);

  // FORM STATE
  const [announcement, setAnnouncement] = useState({
    title: "", message: "", 
    targetType: "All Faculty", 
    targetFilters: { dept: "", grade: "", campus: "", joiningDate: "" },
    channels: { email: true, app: true, sms: false, whatsapp: false },
    schedule: { isScheduled: false, date: "", isRecurring: false, frequency: "Weekly" },
    richContent: { poll: false, pollOptions: ["", ""] }
  });

  const handleTabChange = (event, newValue) => setTabIndex(newValue);

  // HELPERS
  const toggleChannel = (channel) => {
    setAnnouncement(prev => ({
      ...prev,
      channels: { ...prev.channels, [channel]: !prev.channels[channel] }
    }));
  };

  const handleSend = () => {
    const newEntry = {
      id: Date.now(),
      title: announcement.title,
      target: announcement.targetType,
      date: announcement.schedule.isScheduled ? announcement.schedule.date : new Date().toISOString().split('T')[0],
      status: announcement.schedule.isScheduled ? "Scheduled" : "Sent",
      channels: Object.keys(announcement.channels).filter(k => announcement.channels[k]).map(k => k.charAt(0).toUpperCase() + k.slice(1)),
      stats: { sent: 0, delivered: 0, read: 0, clicked: 0 },
      recurring: announcement.schedule.isRecurring ? announcement.schedule.frequency : "No"
    };
    setHistory([newEntry, ...history]);
    alert("Campaign Created Successfully!");
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
        Smart Communication Hub
      </Typography>

      <Card sx={{ minHeight: 600 }}>
        <Tabs 
          value={tabIndex} 
          onChange={handleTabChange} 
          variant="scrollable"
          scrollButtons="auto"
          sx={{ borderBottom: 1, borderColor: 'divider', px: 2, bgcolor: 'background.paper' }}
        >
          <Tab icon={<Campaign />} iconPosition="start" label="Smart Composer" />
          <Tab icon={<BarChart />} iconPosition="start" label="Delivery Analytics" />
          <Tab icon={<Feedback />} iconPosition="start" label="Inbox & Feedback" />
          <Tab icon={<WhatsApp />} iconPosition="start" label="Gateway & Credits" />
          <Tab icon={<NotificationsActive />} iconPosition="start" label="Auto-Alerts" />
        </Tabs>

        <Box sx={{ p: 3 }}>
          {/* =================================================================
              TAB 1: SMART COMPOSER (RICH TEXT + ADVANCED TARGETING)
          ================================================================= */}
          {tabIndex === 0 && (
            <Grid container spacing={3}>
              {/* LEFT: COMPOSER */}
              <Grid item xs={12} md={7}>
                <Card variant="outlined" sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>Draft Message</Typography>
                  
                  {/* Channels */}
                  <Box display="flex" gap={2} mb={2}>
                     <Chip 
                        icon={<Send />} label="Email" 
                        color={announcement.channels.email ? "primary" : "default"} 
                        onClick={() => toggleChannel('email')} clickable 
                     />
                     <Chip 
                        icon={<NotificationsActive />} label="In-App" 
                        color={announcement.channels.app ? "primary" : "default"} 
                        onClick={() => toggleChannel('app')} clickable 
                     />
                     <Chip 
                        icon={<Sms />} label="SMS" 
                        color={announcement.channels.sms ? "secondary" : "default"} 
                        onClick={() => toggleChannel('sms')} clickable 
                     />
                     <Chip 
                        icon={<WhatsApp />} label="WhatsApp" 
                        color={announcement.channels.whatsapp ? "success" : "default"} 
                        onClick={() => toggleChannel('whatsapp')} clickable 
                     />
                  </Box>

                  <TextField 
                    fullWidth label="Campaign Title / Subject" size="small" sx={{ mb: 2 }}
                    value={announcement.title} onChange={(e) => setAnnouncement({...announcement, title: e.target.value})}
                  />
                  
                  {/* Rich Text Toolbar Mockup */}
                  <Box border="1px solid #ddd" borderRadius={1} mb={2}>
                    <Box bgcolor="grey.100" p={1} borderBottom="1px solid #ddd" display="flex" gap={1}>
                       <IconButton size="small"><FormatBold /></IconButton>
                       <IconButton size="small"><FormatItalic /></IconButton>
                       <IconButton size="small"><FormatListBulleted /></IconButton>
                       <Divider orientation="vertical" flexItem />
                       <IconButton size="small"><Image /></IconButton>
                       <IconButton size="small"><LinkIcon /></IconButton>
                       <IconButton size="small"><AttachFile /></IconButton>
                       <Divider orientation="vertical" flexItem />
                       <Button size="small" startIcon={<Poll />} onClick={() => setAnnouncement(p => ({...p, richContent: {...p.richContent, poll: !p.richContent.poll}}))}>
                         Add Poll
                       </Button>
                    </Box>
                    <TextField 
                       fullWidth multiline rows={6} placeholder="Type your message here..." 
                       variant="standard" InputProps={{ disableUnderline: true, sx: { p: 2 } }}
                       value={announcement.message} onChange={(e) => setAnnouncement({...announcement, message: e.target.value})}
                    />
                    {/* Poll Mockup */}
                    {announcement.richContent.poll && (
                      <Box p={2} bgcolor="primary.50" borderTop="1px dashed #ddd">
                        <Typography variant="caption" fontWeight="bold" color="primary">Poll Question</Typography>
                        <TextField fullWidth size="small" placeholder="Enter Question" sx={{ mb: 1, mt: 0.5 }} />
                        <Typography variant="caption" color="primary">Options</Typography>
                        <Box display="flex" gap={1}>
                          <TextField size="small" placeholder="Option 1" />
                          <TextField size="small" placeholder="Option 2" />
                          <IconButton size="small" color="primary"><GroupAdd /></IconButton>
                        </Box>
                      </Box>
                    )}
                  </Box>

                  {/* Scheduling */}
                  <Box p={2} border="1px solid #eee" borderRadius={1}>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <FormControlLabel 
                        control={<Switch checked={announcement.schedule.isScheduled} onChange={(e) => setAnnouncement({...announcement, schedule: {...announcement.schedule, isScheduled: e.target.checked}})} />} 
                        label="Schedule / Recurring" 
                      />
                      {announcement.schedule.isScheduled && (
                        <FormControlLabel 
                           control={<Checkbox checked={announcement.schedule.isRecurring} onChange={(e) => setAnnouncement({...announcement, schedule: {...announcement.schedule, isRecurring: e.target.checked}})} />}
                           label="Recurring?"
                        />
                      )}
                    </Box>
                    {announcement.schedule.isScheduled && (
                       <Box display="flex" gap={2} mt={1}>
                         <TextField type="datetime-local" size="small" fullWidth />
                         {announcement.schedule.isRecurring && (
                            <TextField select size="small" fullWidth label="Frequency" defaultValue="Weekly">
                               <MenuItem value="Daily">Daily</MenuItem>
                               <MenuItem value="Weekly">Weekly</MenuItem>
                               <MenuItem value="Monthly">Monthly</MenuItem>
                            </TextField>
                         )}
                       </Box>
                    )}
                  </Box>

                  <Button variant="contained" fullWidth size="large" sx={{ mt: 3 }} startIcon={<Send />} onClick={handleSend}>
                    Launch Campaign
                  </Button>
                </Card>
              </Grid>

              {/* RIGHT: ADVANCED TARGETING */}
              <Grid item xs={12} md={5}>
                <Card variant="outlined" sx={{ p: 3, bgcolor: 'grey.50', height: '100%' }}>
                  <Typography variant="h6" gutterBottom>Target Audience</Typography>
                  
                  <TextField 
                    select fullWidth label="Primary Group" size="small" sx={{ mb: 2, bgcolor: 'white' }}
                    value={announcement.targetType} onChange={(e) => setAnnouncement({...announcement, targetType: e.target.value})}
                  >
                    <MenuItem value="All Faculty">All Faculty</MenuItem>
                    <MenuItem value="Specific Department">Specific Department</MenuItem>
                    <MenuItem value="Custom Filter">Custom Filter (Advanced)</MenuItem>
                    <MenuItem value="Custom Group">Saved Group: 'Research Committee'</MenuItem>
                  </TextField>

                  {announcement.targetType === "Custom Filter" && (
                     <Box p={2} bgcolor="white" borderRadius={1} border="1px solid #ddd">
                        <Typography variant="caption" fontWeight="bold" gutterBottom>Advanced Filters</Typography>
                        <Grid container spacing={2}>
                           <Grid item xs={6}>
                              <TextField select fullWidth label="Department" size="small" margin="dense">
                                 <MenuItem value="CSE">CSE</MenuItem>
                                 <MenuItem value="Mech">Mechanical</MenuItem>
                              </TextField>
                           </Grid>
                           <Grid item xs={6}>
                              <TextField select fullWidth label="Grade/Level" size="small" margin="dense">
                                 <MenuItem value="Prof">Professor</MenuItem>
                                 <MenuItem value="Assoc">Associate Prof</MenuItem>
                              </TextField>
                           </Grid>
                           <Grid item xs={6}>
                              <TextField select fullWidth label="Campus" size="small" margin="dense">
                                 <MenuItem value="North">North Campus</MenuItem>
                                 <MenuItem value="South">South Campus</MenuItem>
                              </TextField>
                           </Grid>
                           <Grid item xs={6}>
                              <TextField type="date" fullWidth label="Joined After" size="small" margin="dense" InputLabelProps={{ shrink: true }} />
                           </Grid>
                        </Grid>
                     </Box>
                  )}

                  <Box mt={3} p={2} bgcolor="#e3f2fd" borderRadius={1}>
                     <Typography variant="subtitle2" color="primary">Estimated Reach</Typography>
                     <Typography variant="h4" fontWeight="bold">142</Typography>
                     <Typography variant="caption">Faculty Members</Typography>
                  </Box>
                </Card>
              </Grid>
            </Grid>
          )}

          {/* =================================================================
              TAB 2: DELIVERY ANALYTICS
          ================================================================= */}
          {tabIndex === 1 && (
            <Box>
               <Grid container spacing={3} mb={3}>
                  <Grid item xs={12} md={4}>
                     <Card sx={{ p: 2, bgcolor: 'success.light', color: 'success.main' }}>
                        <Typography variant="h4">98%</Typography>
                        <Typography variant="body2">Average Delivery Rate</Typography>
                     </Card>
                  </Grid>
                  <Grid item xs={12} md={4}>
                     <Card sx={{ p: 2, bgcolor: 'primary.light', color: 'white' }}>
                        <Typography variant="h4">65%</Typography>
                        <Typography variant="body2">Open Rate (Email)</Typography>
                     </Card>
                  </Grid>
                  <Grid item xs={12} md={4}>
                     <Card sx={{ p: 2, bgcolor: 'warning.light', color: 'warning.main' }}>
                        <Typography variant="h4">12</Typography>
                        <Typography variant="body2">Failed / Bounced</Typography>
                     </Card>
                  </Grid>
               </Grid>

               <Typography variant="h6" gutterBottom>Campaign Performance</Typography>
               <Table>
                 <TableHead sx={{ bgcolor: 'grey.100' }}>
                   <TableRow>
                     <TableCell>Campaign Title</TableCell>
                     <TableCell>Channels</TableCell>
                     <TableCell>Sent</TableCell>
                     <TableCell>Engagement (Read/Click)</TableCell>
                     <TableCell>Status</TableCell>
                     <TableCell align="right">Action</TableCell>
                   </TableRow>
                 </TableHead>
                 <TableBody>
                   {history.map((row) => (
                     <TableRow key={row.id}>
                       <TableCell fontWeight="bold">
                          {row.title}
                          {row.recurring !== "No" && <Chip label={row.recurring} size="small" color="info" sx={{ ml: 1, height: 20 }} />}
                       </TableCell>
                       <TableCell>
                          {row.channels.map(c => <Chip key={c} label={c} size="small" variant="outlined" sx={{ mr: 0.5 }} />)}
                       </TableCell>
                       <TableCell>{row.stats.sent}</TableCell>
                       <TableCell sx={{ width: 200 }}>
                          <Box display="flex" alignItems="center" gap={1}>
                             <LinearProgress variant="determinate" value={(row.stats.read / row.stats.delivered) * 100} sx={{ flex: 1, height: 8, borderRadius: 4 }} />
                             <Typography variant="caption">{Math.round((row.stats.read / row.stats.delivered) * 100)}%</Typography>
                          </Box>
                       </TableCell>
                       <TableCell><Chip label={row.status} color={row.status === 'Sent' ? 'success' : 'warning'} size="small" /></TableCell>
                       <TableCell align="right">
                          <Tooltip title="View Detailed Report"><IconButton size="small"><BarChart /></IconButton></Tooltip>
                          {row.stats.sent === 0 && <Tooltip title="Retry Failed"><IconButton size="small" color="error"><Update /></IconButton></Tooltip>}
                       </TableCell>
                     </TableRow>
                   ))}
                 </TableBody>
               </Table>
            </Box>
          )}

          {/* =================================================================
              TAB 3: INBOX & FEEDBACK
          ================================================================= */}
          {tabIndex === 2 && (
             <Box>
                <Grid container spacing={3}>
                   <Grid item xs={12} md={4}>
                      <List sx={{ bgcolor: 'background.paper', border: '1px solid #eee', borderRadius: 1 }}>
                         {feedback.map(item => (
                            <ListItem key={item.id} button divider alignItems="flex-start">
                               <ListItemIcon><Avatar>{item.from[0]}</Avatar></ListItemIcon>
                               <ListItemText 
                                  primary={item.from} 
                                  secondary={
                                     <React.Fragment>
                                        <Typography variant="caption" display="block">{item.date}</Typography>
                                        <Typography variant="body2" color="textPrimary" noWrap>{item.subject}</Typography>
                                     </React.Fragment>
                                  } 
                               />
                               {item.status === 'Unread' && <Chip size="small" color="primary" label="New" />}
                            </ListItem>
                         ))}
                      </List>
                   </Grid>
                   <Grid item xs={12} md={8}>
                      <Card variant="outlined" sx={{ p: 3, height: '100%' }}>
                         <Box display="flex" justifyContent="space-between" mb={2}>
                            <Typography variant="h6">Re: PBAS Deadline</Typography>
                            <Box>
                               <Button size="small" startIcon={<Delete />} color="error">Delete</Button>
                            </Box>
                         </Box>
                         <Divider />
                         <Box my={2}>
                            <Typography variant="body1">Can we submit hard copies instead of uploading everything?</Typography>
                         </Box>
                         <Divider sx={{ mb: 2 }} />
                         <TextField fullWidth multiline rows={4} label="Reply to Faculty" placeholder="Type your response..." />
                         <Box mt={2} textAlign="right">
                            <Button variant="contained" endIcon={<Send />}>Send Reply</Button>
                         </Box>
                      </Card>
                   </Grid>
                </Grid>
             </Box>
          )}

          {/* =================================================================
              TAB 4: GATEWAY & CREDITS
          ================================================================= */}
          {tabIndex === 3 && (
             <Box>
                <Typography variant="h6" gutterBottom>SMS & WhatsApp Gateway Status</Typography>
                <Grid container spacing={3} mb={3}>
                   <Grid item xs={12} md={4}>
                      <Card sx={{ p: 2, borderLeft: '4px solid #9c27b0' }}>
                         <Box display="flex" justifyContent="space-between">
                            <Typography variant="subtitle2">SMS Credits</Typography>
                            <Sms color="secondary" />
                         </Box>
                         <Typography variant="h4" fontWeight="bold">{credits.sms}</Typography>
                         <Typography variant="caption">Available Balance</Typography>
                         <Button size="small" sx={{ mt: 1 }}>Top Up</Button>
                      </Card>
                   </Grid>
                   <Grid item xs={12} md={4}>
                      <Card sx={{ p: 2, borderLeft: '4px solid #2e7d32' }}>
                         <Box display="flex" justifyContent="space-between">
                            <Typography variant="subtitle2">WhatsApp Conversations</Typography>
                            <WhatsApp color="success" />
                         </Box>
                         <Typography variant="h4" fontWeight="bold">{credits.whatsapp}</Typography>
                         <Typography variant="caption">Free Tier Remaining</Typography>
                         <Button size="small" sx={{ mt: 1 }}>Manage API</Button>
                      </Card>
                   </Grid>
                </Grid>

                <Typography variant="subtitle1" gutterBottom>Gateway Configuration</Typography>
                <Paper variant="outlined" sx={{ p: 3 }}>
                   <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                         <TextField label="SMS Gateway Provider" fullWidth size="small" defaultValue="Twilio" disabled />
                      </Grid>
                      <Grid item xs={12} md={6}>
                         <TextField label="WhatsApp Business ID" fullWidth size="small" defaultValue="WABA-99887766" disabled />
                      </Grid>
                      <Grid item xs={12}>
                         <FormControlLabel control={<Switch defaultChecked />} label="Enable Auto-Failover to SMS if WhatsApp fails" />
                      </Grid>
                   </Grid>
                </Paper>
             </Box>
          )}

          {/* =================================================================
              TAB 5: AUTOMATED ALERTS
          ================================================================= */}
          {tabIndex === 4 && (
            <Box>
               <Box display="flex" justifyContent="space-between" mb={2}>
                  <Typography variant="h6">System Triggered Alerts</Typography>
                  <Button startIcon={<Edit />}>Configure Triggers</Button>
               </Box>
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
                        <Switch checked={row.active} color="success" />
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