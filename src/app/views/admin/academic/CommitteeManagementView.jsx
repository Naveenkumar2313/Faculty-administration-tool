import React, { useState } from "react";
import { 
  Box, Card, Grid, Typography, Button, TextField, MenuItem, 
  Tabs, Tab, Table, TableBody, TableCell, TableHead, TableRow, 
  Chip, IconButton, Tooltip, Dialog, DialogTitle, DialogContent, 
  DialogActions, Autocomplete, Avatar, Checkbox, FormControlLabel, 
  List, ListItem, ListItemText, ListItemIcon, Divider, LinearProgress,
  Switch, Accordion, AccordionSummary, AccordionDetails
} from "@mui/material";
import { 
  Groups, Event, Add, Edit, Delete, CheckCircle, 
  Cancel, MeetingRoom, Description, Archive, 
  Poll, Assessment, Videocam, CalendarToday, 
  Warning, DoneAll, AttachFile, HowToVote, ExpandMore,
  Download, AccessTime, PersonOff, Visibility
} from "@mui/icons-material";

const CommitteeManagementView = () => {
  const [tabIndex, setTabIndex] = useState(0);
  
  // MOCK DATA: FACULTY MEMBERS
  const facultyList = [
    { id: 1, name: "Dr. Sarah Smith", dept: "CSE", email: "sarah@college.edu" },
    { id: 2, name: "Prof. Rajan Kumar", dept: "Mech", email: "rajan@college.edu" },
    { id: 3, name: "Dr. Emily Davis", dept: "Civil", email: "emily@college.edu" },
    { id: 4, name: "Dr. A. Verma", dept: "Electrical", email: "verma@college.edu" },
  ];

  // MOCK DATA: COMMITTEES
  const [committees, setCommittees] = useState([
    { 
      id: 1, name: "Internal Quality Assurance Cell (IQAC)", type: "Statutory", 
      chair: "Dr. Sarah Smith", membersCount: 12, termEnd: "2026-05-30", 
      status: "Active", effectiveness: 92 
    },
    { 
      id: 2, name: "Grievance Redressal Committee", type: "Statutory", 
      chair: "Prof. Rajan Kumar", membersCount: 5, termEnd: "2026-03-15", 
      status: "Active", effectiveness: 85 
    },
    { 
      id: 3, name: "Cultural Committee", type: "Advisory", 
      chair: "Dr. Emily Davis", membersCount: 8, termEnd: "2025-12-31", 
      status: "Expiring Soon", effectiveness: 78 
    },
  ]);

  // MOCK DATA: MEETINGS
  const [meetings, setMeetings] = useState([
    { 
      id: 101, committee: "IQAC", title: "Quarterly Review", date: "2026-02-15", time: "10:00 AM", 
      room: "Conference Hall A", status: "Scheduled", convener: "Dr. A. Verma",
      videoLink: "https://meet.google.com/abc-xyz", agenda: ["Review NAAC criteria", "Budget approval"]
    },
    { 
      id: 102, committee: "Cultural Committee", title: "Annual Fest Planning", date: "2026-01-20", time: "02:00 PM", 
      room: "Seminar Hall", status: "Completed", convener: "Ms. Priya Roy",
      attendance: 85, resolutions: 2, mom: "mom_fest_plan.pdf"
    },
  ]);

  // MOCK DATA: RESOLUTIONS (For Voting)
  const [resolutions, setResolutions] = useState([
    { id: "RES-001", meetingId: 102, text: "Approve budget of ₹5 Lakhs for Fest", votesFor: 6, votesAgainst: 1, status: "Passed" },
    { id: "RES-002", meetingId: 102, text: "Vendor Selection: ABC Events", votesFor: 7, votesAgainst: 0, status: "Passed" },
  ]);

  // DIALOG STATES
  const [openCommitteeDialog, setOpenCommitteeDialog] = useState(false);
  const [openMeetingDialog, setOpenMeetingDialog] = useState(false);
  const [openMinutesDialog, setOpenMinutesDialog] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState(null);

  // MINUTES FORM STATE
  const [minutesData, setMinutesData] = useState({
    attendees: [],
    absentees: [],
    actionItems: [],
    momFile: null
  });

  const handleTabChange = (event, newValue) => setTabIndex(newValue);

  // --- ACTIONS ---

  const handleScheduleMeeting = () => {
    // Logic to save meeting
    setOpenMeetingDialog(false);
  };

  const handleSaveMinutes = () => {
    // Logic to save minutes & update meeting status
    setMeetings(meetings.map(m => m.id === selectedMeeting.id ? { ...m, status: "Completed", mom: "generated_mom.pdf" } : m));
    setOpenMinutesDialog(false);
  };

  const handleDownloadICS = (meeting) => {
    alert(`Downloading .ics calendar invite for: ${meeting.title}`);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
        Committee Administration & Governance
      </Typography>

      <Card sx={{ minHeight: 600 }}>
        <Tabs 
          value={tabIndex} 
          onChange={handleTabChange} 
          sx={{ borderBottom: 1, borderColor: 'divider', px: 2, bgcolor: 'background.paper' }}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab icon={<Groups />} iconPosition="start" label="Committee Setup" />
          <Tab icon={<Event />} iconPosition="start" label="Meeting Scheduler" />
          <Tab icon={<Description />} iconPosition="start" label="Minutes & Decisions" />
          <Tab icon={<Poll />} iconPosition="start" label="Voting & Resolutions" />
          <Tab icon={<Assessment />} iconPosition="start" label="Effectiveness Analytics" />
        </Tabs>

        <Box sx={{ p: 3 }}>
          {/* =================================================================
              TAB 1: COMMITTEE SETUP & MEMBER MANAGEMENT
          ================================================================= */}
          {tabIndex === 0 && (
            <Box>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h6">Active Committees Registry</Typography>
                <Button variant="contained" startIcon={<Add />} onClick={() => setOpenCommitteeDialog(true)}>
                  Create Committee
                </Button>
              </Box>

              <Table>
                <TableHead sx={{ bgcolor: 'grey.100' }}>
                  <TableRow>
                    <TableCell>Committee Name</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Chairperson</TableCell>
                    <TableCell>Term Status</TableCell>
                    <TableCell>Members</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {committees.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell fontWeight="bold">{row.name}</TableCell>
                      <TableCell>
                        <Chip label={row.type} size="small" color={row.type === 'Statutory' ? 'primary' : 'default'} variant="outlined" />
                      </TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={1}>
                          <Avatar sx={{ width: 24, height: 24, fontSize: 12 }}>{row.chair[0]}</Avatar>
                          {row.chair}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={1}>
                          <AccessTime fontSize="small" color={row.status === 'Expiring Soon' ? "error" : "action"} />
                          <Box>
                            <Typography variant="caption" display="block">Ends: {row.termEnd}</Typography>
                            {row.status === 'Expiring Soon' && <Chip label="Renew Now" size="small" color="error" sx={{ height: 16, fontSize: '0.6rem' }} />}
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>{row.membersCount}</TableCell>
                      <TableCell align="right">
                        <Tooltip title="Manage Members & Roles">
                          <IconButton size="small" color="primary"><Groups /></IconButton>
                        </Tooltip>
                        <IconButton size="small"><Edit /></IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          )}

          {/* =================================================================
              TAB 2: MEETING SCHEDULER
          ================================================================= */}
          {tabIndex === 1 && (
            <Box>
              <Box display="flex" justifyContent="space-between" mb={3}>
                <Typography variant="h6">Upcoming Meetings</Typography>
                <Button variant="contained" startIcon={<Add />} onClick={() => setOpenMeetingDialog(true)}>
                  Schedule Meeting
                </Button>
              </Box>
              
              <Grid container spacing={3}>
                {meetings.filter(m => m.status === 'Scheduled').map(meeting => (
                  <Grid item xs={12} md={6} key={meeting.id}>
                    <Card variant="outlined" sx={{ p: 2, borderLeft: '4px solid #1976d2' }}>
                      <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                        <Box>
                          <Typography variant="h6">{meeting.title}</Typography>
                          <Typography variant="body2" color="textSecondary">{meeting.committee}</Typography>
                        </Box>
                        <Chip label={meeting.status} color="primary" size="small" />
                      </Box>
                      
                      <Box mt={2} display="flex" gap={3}>
                        <Box display="flex" alignItems="center" gap={1}>
                          <CalendarToday fontSize="small" color="action" /> {meeting.date}
                        </Box>
                        <Box display="flex" alignItems="center" gap={1}>
                          <AccessTime fontSize="small" color="action" /> {meeting.time}
                        </Box>
                        <Box display="flex" alignItems="center" gap={1}>
                          <MeetingRoom fontSize="small" color="action" /> {meeting.room}
                        </Box>
                      </Box>

                      {meeting.videoLink && (
                         <Box mt={1} display="flex" alignItems="center" gap={1}>
                           <Videocam fontSize="small" color="primary" />
                           <Typography variant="body2" component="a" href={meeting.videoLink} target="_blank" sx={{ textDecoration: 'none' }}>
                             {meeting.videoLink}
                           </Typography>
                         </Box>
                      )}

                      <Divider sx={{ my: 2 }} />
                      
                      <Typography variant="subtitle2" gutterBottom>Agenda:</Typography>
                      <List dense disablePadding>
                        {meeting.agenda?.map((item, idx) => (
                           <ListItem key={idx} disablePadding sx={{ display: 'list-item', pl: 2 }}>
                             <ListItemText primary={item} />
                           </ListItem>
                        ))}
                      </List>

                      <Box mt={2} display="flex" justifyContent="flex-end" gap={1}>
                        <Button size="small" startIcon={<Download />} onClick={() => handleDownloadICS(meeting)}>
                          Invite (.ics)
                        </Button>
                        <Button size="small" variant="outlined" startIcon={<Edit />}>
                          Edit
                        </Button>
                      </Box>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}

          {/* =================================================================
              TAB 3: MINUTES & DECISIONS (MoM)
          ================================================================= */}
          {tabIndex === 2 && (
            <Box>
              <Typography variant="h6" gutterBottom>Minutes of Meeting (MoM) Management</Typography>
              <Table>
                <TableHead sx={{ bgcolor: 'grey.50' }}>
                  <TableRow>
                    <TableCell>Meeting Details</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Attendance</TableCell>
                    <TableCell>Resolutions</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {meetings.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell fontWeight="bold">
                        {row.title}
                        <Typography variant="caption" display="block">{row.committee}</Typography>
                      </TableCell>
                      <TableCell>{row.date}</TableCell>
                      <TableCell>
                        {row.status === 'Completed' ? (
                          <Typography color="success.main" fontWeight="bold">{row.attendance}% Present</Typography>
                        ) : (
                          <Typography color="textSecondary">-</Typography>
                        )}
                      </TableCell>
                      <TableCell>{row.resolutions || 0} Passed</TableCell>
                      <TableCell>
                        <Chip 
                          label={row.status} size="small" 
                          color={row.status === 'Completed' ? 'success' : 'warning'} 
                        />
                      </TableCell>
                      <TableCell align="right">
                        {row.status === 'Scheduled' ? (
                          <Button 
                            variant="contained" size="small" startIcon={<Description />}
                            onClick={() => { setSelectedMeeting(row); setOpenMinutesDialog(true); }}
                          >
                            Record MoM
                          </Button>
                        ) : (
                          <Box display="flex" gap={1} justifyContent="flex-end">
                             <Tooltip title="View MoM">
                               <IconButton size="small" color="primary"><Visibility /></IconButton>
                             </Tooltip>
                             <Tooltip title="Archive">
                               <IconButton size="small"><Archive /></IconButton>
                             </Tooltip>
                          </Box>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          )}

          {/* =================================================================
              TAB 4: VOTING & RESOLUTIONS
          ================================================================= */}
          {tabIndex === 3 && (
            <Box>
              <Box display="flex" justifyContent="space-between" mb={3}>
                <Typography variant="h6">Resolution Tracker</Typography>
                <Button variant="outlined" startIcon={<HowToVote />}>Initiate E-Voting</Button>
              </Box>

              <Grid container spacing={2}>
                {resolutions.map((res) => (
                  <Grid item xs={12} md={6} key={res.id}>
                    <Card sx={{ p: 2, borderLeft: '4px solid #4caf50' }}>
                      <Box display="flex" justifyContent="space-between">
                        <Typography variant="subtitle2" color="textSecondary">ID: {res.id}</Typography>
                        <Chip label={res.status} color="success" size="small" />
                      </Box>
                      <Typography variant="h6" sx={{ my: 1 }}>{res.text}</Typography>
                      
                      <Box display="flex" alignItems="center" gap={2} mt={2}>
                        <Chip icon={<CheckCircle />} label={`${res.votesFor} For`} color="success" variant="outlined" />
                        <Chip icon={<Cancel />} label={`${res.votesAgainst} Against`} color="error" variant="outlined" />
                        <Typography variant="caption" color="textSecondary">Quorum Met: Yes</Typography>
                      </Box>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}

          {/* =================================================================
              TAB 5: ANALYTICS
          ================================================================= */}
          {tabIndex === 4 && (
             <Box>
               <Grid container spacing={3}>
                 <Grid item xs={12} md={4}>
                   <Card sx={{ p: 3, textAlign: 'center', bgcolor: 'primary.light', color: 'white' }}>
                     <Typography variant="h3" fontWeight="bold">88%</Typography>
                     <Typography variant="subtitle1">Average Attendance</Typography>
                   </Card>
                 </Grid>
                 <Grid item xs={12} md={4}>
                   <Card sx={{ p: 3, textAlign: 'center', bgcolor: 'success.light', color: 'success.main' }}>
                     <Typography variant="h3" fontWeight="bold">12</Typography>
                     <Typography variant="subtitle1">Resolutions Passed</Typography>
                   </Card>
                 </Grid>
                 <Grid item xs={12} md={4}>
                   <Card sx={{ p: 3, textAlign: 'center', bgcolor: 'warning.light', color: 'warning.main' }}>
                     <Typography variant="h3" fontWeight="bold">5 Days</Typography>
                     <Typography variant="subtitle1">Avg Decision Turnaround</Typography>
                   </Card>
                 </Grid>

                 <Grid item xs={12}>
                   <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>Committee Effectiveness Score</Typography>
                   {committees.map((c) => (
                     <Box key={c.id} mb={2}>
                       <Box display="flex" justifyContent="space-between" mb={0.5}>
                         <Typography variant="body2" fontWeight="bold">{c.name}</Typography>
                         <Typography variant="body2">{c.effectiveness}%</Typography>
                       </Box>
                       <LinearProgress 
                         variant="determinate" value={c.effectiveness} 
                         sx={{ height: 10, borderRadius: 5 }} 
                         color={c.effectiveness > 80 ? "success" : c.effectiveness > 50 ? "warning" : "error"}
                       />
                     </Box>
                   ))}
                 </Grid>
               </Grid>
             </Box>
          )}

        </Box>
      </Card>

      {/* --- DIALOGS --- */}
      
      {/* 1. SCHEDULE MEETING DIALOG */}
      <Dialog open={openMeetingDialog} onClose={() => setOpenMeetingDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Schedule New Meeting</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField select fullWidth label="Select Committee" size="small">
                 {committees.map(c => <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Meeting Title / Agenda" size="small" />
            </Grid>
            <Grid item xs={6}>
              <TextField type="date" fullWidth label="Date" InputLabelProps={{ shrink: true }} size="small" />
            </Grid>
            <Grid item xs={6}>
              <TextField type="time" fullWidth label="Time" InputLabelProps={{ shrink: true }} size="small" />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField select fullWidth label="Venue / Room" size="small">
                <MenuItem value="Conf Hall A">Conf Hall A</MenuItem>
                <MenuItem value="Online">Online (Video Conf)</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Video Link (if Online)" size="small" />
            </Grid>
            
            <Grid item xs={12}>
               <Typography variant="caption" color="textSecondary" gutterBottom>Options</Typography>
               <Box display="flex" gap={2}>
                 <FormControlLabel control={<Checkbox />} label="Recurring Meeting" />
                 <FormControlLabel control={<Checkbox defaultChecked />} label="Send Calendar Invites" />
                 <FormControlLabel control={<Checkbox defaultChecked />} label="Require RSVP" />
               </Box>
            </Grid>

            <Grid item xs={12}>
               <Typography variant="subtitle2" gutterBottom>Pre-meeting Documents</Typography>
               <Button component="label" size="small" startIcon={<AttachFile />} variant="outlined">
                 Upload Agenda / Reports
                 <input type="file" hidden />
               </Button>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenMeetingDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleScheduleMeeting} startIcon={<Event />}>
            Schedule & Notify Members
          </Button>
        </DialogActions>
      </Dialog>

      {/* 2. MINUTES (MoM) DIALOG */}
      <Dialog open={openMinutesDialog} onClose={() => setOpenMinutesDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Record Minutes: {selectedMeeting?.title}</DialogTitle>
        <DialogContent dividers>
          <Tabs value={0} sx={{ mb: 2, borderBottom: 1, borderColor: 'divider' }}>
             <Tab label="Attendance" />
             <Tab label="Minutes & Actions" />
             <Tab label="Decisions" />
          </Tabs>

          <Box mb={3}>
            <Typography variant="subtitle2" gutterBottom>Member Attendance</Typography>
            <Box display="flex" flexWrap="wrap" gap={2}>
              {facultyList.map(f => (
                <Chip 
                  key={f.id} 
                  avatar={<Avatar>{f.name[0]}</Avatar>} 
                  label={f.name} 
                  color="success" 
                  variant="outlined" 
                  onDelete={() => {}} // Dummy delete icon for toggle
                  deleteIcon={<CheckCircle />}
                />
              ))}
              <Chip icon={<PersonOff />} label="Mark Absentee" clickable />
            </Box>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Typography variant="subtitle2" gutterBottom>Meeting Minutes</Typography>
          <TextField 
            fullWidth 
            multiline 
            rows={6} 
            placeholder="Type minutes here... (Rich Text Placeholder)" 
            variant="outlined" 
            sx={{ mb: 2 }}
          />

          <Typography variant="subtitle2" gutterBottom>Action Items</Typography>
          <List dense sx={{ bgcolor: 'grey.50', borderRadius: 1 }}>
             <ListItem>
               <ListItemIcon><Warning color="warning" /></ListItemIcon>
               <ListItemText primary="Submit Budget Report" secondary="Assigned to: Dr. A. Verma | Due: 20 Feb" />
             </ListItem>
             <ListItem button>
               <ListItemIcon><Add /></ListItemIcon>
               <ListItemText primary="Add New Action Item" />
             </ListItem>
          </List>
          
          <Box mt={2}>
             <Button component="label" startIcon={<AttachFile />} size="small">
               Upload Signed MoM (PDF)
               <input type="file" hidden />
             </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenMinutesDialog(false)}>Save Draft</Button>
          <Button variant="contained" onClick={handleSaveMinutes} color="success">
            Finalize & Publish
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* 3. COMMITTEE SETUP DIALOG */}
      <Dialog open={openCommitteeDialog} onClose={() => setOpenCommitteeDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Committee</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField fullWidth label="Committee Name" size="small" />
            </Grid>
            <Grid item xs={6}>
              <TextField select fullWidth label="Type" size="small">
                 <MenuItem value="Statutory">Statutory</MenuItem>
                 <MenuItem value="Advisory">Advisory</MenuItem>
                 <MenuItem value="Ad-hoc">Ad-hoc</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={6}>
               <TextField type="date" fullWidth label="Term Expiry" InputLabelProps={{ shrink: true }} size="small" />
            </Grid>
            <Grid item xs={12}>
              <Autocomplete
                options={facultyList}
                getOptionLabel={(option) => option.name}
                renderInput={(params) => <TextField {...params} label="Select Chairperson" size="small" />}
              />
            </Grid>
            <Grid item xs={12}>
               <Typography variant="caption">Conflict of Interest Check:</Typography>
               <FormControlLabel control={<Checkbox defaultChecked />} label="Enable mandatory conflict declaration for members" />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCommitteeDialog(false)}>Cancel</Button>
          <Button variant="contained">Create Committee</Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
};

export default CommitteeManagementView;