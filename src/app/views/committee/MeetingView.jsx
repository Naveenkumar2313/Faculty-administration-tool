import React, { useState } from 'react';
import { 
  Box, Card, Grid, Typography, Button, Tabs, Tab, Chip, Stack, 
  IconButton, Divider, Dialog, DialogTitle, DialogContent, TextField, 
  DialogActions, MenuItem, LinearProgress, Table, TableHead, TableRow, 
  TableCell, TableBody, InputAdornment 
} from "@mui/material";
import { 
  Groups, CalendarMonth, AssignmentTurnedIn, Gavel, Add, 
  CheckCircle, Cancel, Download, Search, CloudUpload, Edit 
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

import useCommitteeSystem from "../../hooks/useCommitteeSystem";

const MeetingView = () => {
  const theme = useTheme();
  const { 
    committees, meetings, actionItems, resolutions, 
    scheduleMeeting, markAttendance, updateTaskStatus 
  } = useCommitteeSystem();

  const [tabIndex, setTabIndex] = useState(0);
  
  // Scheduler State
  const [openScheduler, setOpenScheduler] = useState(false);
  const [newMeeting, setNewMeeting] = useState({ committee: "", title: "", date: "", time: "", agenda: "" });

  const handleScheduleSubmit = () => {
    scheduleMeeting(newMeeting);
    setOpenScheduler(false);
    setNewMeeting({ committee: "", title: "", date: "", time: "", agenda: "" });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>Committee & Meeting Management</Typography>

      <Card elevation={3} sx={{ minHeight: 600 }}>
        <Tabs 
          value={tabIndex} 
          onChange={(e, v) => setTabIndex(v)} 
          sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'grey.50' }}
        >
          <Tab icon={<Groups />} label="My Committees" iconPosition="start" />
          <Tab icon={<CalendarMonth />} label="Meetings & Attendance" iconPosition="start" />
          <Tab icon={<AssignmentTurnedIn />} label="Action Items" iconPosition="start" />
          <Tab icon={<Gavel />} label="Minutes & Resolutions" iconPosition="start" />
        </Tabs>

        <Box p={4}>
          {/* TAB 0: MY COMMITTEES */}
          {tabIndex === 0 && (
            <Grid container spacing={3}>
              {committees.map((committee) => (
                <Grid item xs={12} md={6} key={committee.id}>
                  <Card variant="outlined" sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="h6" fontWeight="bold">{committee.name}</Typography>
                      <Box display="flex" gap={1} mt={1}>
                        <Chip 
                          label={committee.role} 
                          color={committee.role === 'Chairperson' || committee.role === 'Convener' ? "primary" : "default"} 
                          size="small" 
                        />
                        <Typography variant="caption" sx={{ alignSelf: 'center', color: 'text.secondary' }}>
                          Since: {committee.appointed}
                        </Typography>
                      </Box>
                    </Box>
                    <Box textAlign="center" sx={{ bgcolor: 'grey.100', p: 1, borderRadius: 2, minWidth: 80 }}>
                       <Typography variant="h4" fontWeight="bold" color="primary">{committee.members}</Typography>
                       <Typography variant="caption">Members</Typography>
                    </Box>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}

          {/* TAB 1: MEETINGS & SCHEDULER */}
          {tabIndex === 1 && (
            <Box>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h6">Upcoming Schedule</Typography>
                <Button variant="contained" startIcon={<Add />} onClick={() => setOpenScheduler(true)}>
                  Schedule Meeting
                </Button>
              </Box>

              <Grid container spacing={3}>
                {meetings.filter(m => m.status === 'Scheduled').map((meeting) => (
                  <Grid item xs={12} md={6} key={meeting.id}>
                    <Card variant="outlined" sx={{ p: 0, overflow: 'hidden', borderLeft: '5px solid #1976d2' }}>
                      <Box sx={{ p: 2, bgcolor: 'grey.50', borderBottom: '1px solid #eee' }}>
                        <Typography variant="subtitle1" fontWeight="bold">{meeting.title}</Typography>
                        <Typography variant="caption">{meeting.committee}</Typography>
                      </Box>
                      <Box p={2}>
                        <Grid container spacing={2}>
                          <Grid item xs={6}>
                            <Typography variant="caption" color="text.secondary">Date & Time</Typography>
                            <Typography variant="body2" fontWeight="medium">{meeting.date} @ {meeting.time}</Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="caption" color="text.secondary">Venue</Typography>
                            <Typography variant="body2" fontWeight="medium">{meeting.venue}</Typography>
                          </Grid>
                          <Grid item xs={12}>
                            <Typography variant="caption" color="text.secondary">Agenda</Typography>
                            <Typography variant="body2">{meeting.agenda}</Typography>
                          </Grid>
                        </Grid>
                        <Divider sx={{ my: 2 }} />
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                          <Typography variant="body2" fontWeight="bold">Attendance:</Typography>
                          {meeting.myAttendance === 'Pending' ? (
                            <Stack direction="row" spacing={1}>
                              <Button 
                                size="small" variant="contained" color="success" 
                                onClick={() => markAttendance(meeting.id, 'Present')}
                              >
                                Confirm
                              </Button>
                              <Button 
                                size="small" variant="outlined" color="error" 
                                onClick={() => markAttendance(meeting.id, 'Apology')}
                              >
                                Send Apology
                              </Button>
                            </Stack>
                          ) : (
                            <Chip label={meeting.myAttendance} color={meeting.myAttendance === 'Present' ? "success" : "warning"} size="small" />
                          )}
                        </Box>
                      </Box>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}

          {/* TAB 2: ACTION ITEMS */}
          {tabIndex === 2 && (
            <Box>
              <Typography variant="h6" gutterBottom>My Assigned Tasks</Typography>
              <Table sx={{ border: '1px solid #eee' }}>
                <TableHead sx={{ bgcolor: 'grey.100' }}>
                  <TableRow>
                    <TableCell>Task Description</TableCell>
                    <TableCell>Meeting Source</TableCell>
                    <TableCell>Deadline</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {actionItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell fontWeight="medium">{item.task}</TableCell>
                      <TableCell>{item.meeting}</TableCell>
                      <TableCell sx={{ color: 'error.main', fontWeight: 'bold' }}>{item.deadline}</TableCell>
                      <TableCell>
                        <Chip 
                          label={item.status} 
                          size="small" 
                          color={item.status === 'Completed' ? 'success' : item.status === 'In Progress' ? 'primary' : 'default'} 
                        />
                      </TableCell>
                      <TableCell align="right">
                        {item.status !== 'Completed' && (
                          <Stack direction="row" justifyContent="end" spacing={1}>
                             <IconButton color="primary" size="small" title="Upload Deliverable"><CloudUpload fontSize="small" /></IconButton>
                             <IconButton color="success" size="small" title="Mark Done" onClick={() => updateTaskStatus(item.id, 'Completed')}><CheckCircle fontSize="small" /></IconButton>
                          </Stack>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          )}

          {/* TAB 3: MINUTES & RESOLUTIONS */}
          {tabIndex === 3 && (
            <Grid container spacing={4}>
              <Grid item xs={12} md={7}>
                <Typography variant="h6" gutterBottom>Past Minutes of Meeting (MoM)</Typography>
                {meetings.filter(m => m.status === 'Completed').map((m) => (
                  <Card key={m.id} variant="outlined" sx={{ p: 2, mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                     <Box>
                       <Typography variant="subtitle2" fontWeight="bold">{m.title}</Typography>
                       <Typography variant="caption" color="text.secondary">Held on {m.date}</Typography>
                     </Box>
                     <Button startIcon={<Download />} size="small" variant="outlined">Download MoM</Button>
                  </Card>
                ))}
              </Grid>
              <Grid item xs={12} md={5}>
                <Card sx={{ p: 3, bgcolor: 'grey.50', height: '100%' }}>
                   <Typography variant="subtitle1" fontWeight="bold" gutterBottom display="flex" alignItems="center" gap={1}>
                     <Search /> Resolution Archive
                   </Typography>
                   <TextField 
                     placeholder="Search resolutions..." 
                     size="small" 
                     fullWidth 
                     sx={{ mb: 2, bgcolor: 'white' }} 
                   />
                   <Stack spacing={2}>
                     {resolutions.map((res) => (
                       <Box key={res.id} sx={{ p: 2, bgcolor: 'white', borderRadius: 1, border: '1px solid #ddd' }}>
                          <Typography variant="body2" fontStyle="italic">"{res.text}"</Typography>
                          <Box display="flex" justifyContent="space-between" mt={1}>
                            <Typography variant="caption" fontWeight="bold">{res.committee}</Typography>
                            <Typography variant="caption" color="text.secondary">{res.date}</Typography>
                          </Box>
                       </Box>
                     ))}
                   </Stack>
                </Card>
              </Grid>
            </Grid>
          )}
        </Box>
      </Card>

      {/* SCHEDULER DIALOG */}
      <Dialog open={openScheduler} onClose={() => setOpenScheduler(false)} fullWidth maxWidth="sm">
        <DialogTitle>Schedule New Meeting</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} mt={1}>
            <TextField 
              select label="Select Committee" fullWidth 
              value={newMeeting.committee}
              onChange={(e) => setNewMeeting({ ...newMeeting, committee: e.target.value })}
            >
              {committees.filter(c => c.role === 'Chairperson' || c.role === 'Convener').map((c) => (
                <MenuItem key={c.id} value={c.name}>{c.name}</MenuItem>
              ))}
            </TextField>
            <TextField 
              label="Meeting Title" fullWidth 
              value={newMeeting.title}
              onChange={(e) => setNewMeeting({ ...newMeeting, title: e.target.value })}
            />
            <Stack direction="row" spacing={2}>
              <TextField 
                type="date" label="Date" fullWidth InputLabelProps={{ shrink: true }} 
                value={newMeeting.date}
                onChange={(e) => setNewMeeting({ ...newMeeting, date: e.target.value })}
              />
              <TextField 
                type="time" label="Time" fullWidth InputLabelProps={{ shrink: true }} 
                value={newMeeting.time}
                onChange={(e) => setNewMeeting({ ...newMeeting, time: e.target.value })}
              />
            </Stack>
            <TextField 
              label="Agenda Items" multiline rows={3} fullWidth placeholder="Enter agenda..." 
              value={newMeeting.agenda}
              onChange={(e) => setNewMeeting({ ...newMeeting, agenda: e.target.value })}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenScheduler(false)}>Cancel</Button>
          <Button onClick={handleScheduleSubmit} variant="contained">Send Invitations</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MeetingView;