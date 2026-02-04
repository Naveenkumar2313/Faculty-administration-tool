import React, { useState } from "react";
import { 
  Box, Card, Grid, Typography, Button, TextField, MenuItem, 
  Tabs, Tab, Table, TableBody, TableCell, TableHead, TableRow, 
  Chip, IconButton, Tooltip, Dialog, DialogTitle, DialogContent, 
  DialogActions, Autocomplete, Avatar 
} from "@mui/material";
import { 
  Groups, Event, Add, Edit, Delete, CheckCircle, 
  Cancel, MeetingRoom, Description, Archive 
} from "@mui/icons-material";

const CommitteeManagementView = () => {
  const [tabIndex, setTabIndex] = useState(0);
  
  // MOCK DATA: FACULTY
  const facultyList = [
    { id: 1, name: "Dr. Sarah Smith", dept: "CSE" },
    { id: 2, name: "Prof. Rajan Kumar", dept: "Mech" },
    { id: 3, name: "Dr. Emily Davis", dept: "Civil" },
    { id: 4, name: "Dr. A. Verma", dept: "Electrical" },
  ];

  // MOCK DATA: COMMITTEES
  const [committees, setCommittees] = useState([
    { id: 1, name: "Internal Quality Assurance Cell (IQAC)", type: "Statutory", chair: "Dr. Sarah Smith", members: 12, term: "2 Years" },
    { id: 2, name: "Grievance Redressal Committee", type: "Statutory", chair: "Prof. Rajan Kumar", members: 5, term: "1 Year" },
    { id: 3, name: "Cultural Committee", type: "Advisory", chair: "Dr. Emily Davis", members: 8, term: "1 Year" },
  ]);

  // MOCK DATA: MEETINGS
  const [meetings, setMeetings] = useState([
    { id: 101, committee: "IQAC", title: "Quarterly Review", date: "2026-02-15", time: "10:00 AM", room: "Unassigned", status: "Pending Request", convener: "Dr. A. Verma" },
    { id: 102, committee: "Cultural Committee", title: "Annual Fest Planning", date: "2026-02-10", time: "02:00 PM", room: "Conference Hall A", status: "Approved", convener: "Ms. Priya Roy" },
    { id: 103, committee: "Grievance Redressal", title: "Urgent Hearing", date: "2026-01-20", time: "11:00 AM", room: "Board Room", status: "Completed", convener: "Prof. Rajan Kumar", mom: "mom_jan20.pdf" },
  ]);

  // DIALOG STATES
  const [openCommitteeDialog, setOpenCommitteeDialog] = useState(false);
  const [openMeetingDialog, setOpenMeetingDialog] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState(null);

  const handleTabChange = (event, newValue) => setTabIndex(newValue);

  // ACTIONS
  const handleApproveMeeting = () => {
    setMeetings(meetings.map(m => m.id === selectedMeeting.id ? { ...m, status: "Approved", room: selectedMeeting.room || "Conference Hall B" } : m));
    setOpenMeetingDialog(false);
  };

  const handleRejectMeeting = () => {
    setMeetings(meetings.map(m => m.id === selectedMeeting.id ? { ...m, status: "Rejected" } : m));
    setOpenMeetingDialog(false);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
        Committee Administration
      </Typography>

      <Card sx={{ minHeight: 500 }}>
        <Tabs 
          value={tabIndex} 
          onChange={handleTabChange} 
          sx={{ borderBottom: 1, borderColor: 'divider', px: 2, bgcolor: 'background.paper' }}
        >
          <Tab icon={<Groups />} iconPosition="start" label="Committee Setup" />
          <Tab icon={<Event />} iconPosition="start" label="Meeting Scheduler (Admin)" />
        </Tabs>

        <Box sx={{ p: 3 }}>
          {/* =================================================================
              TAB 1: COMMITTEE SETUP
          ================================================================= */}
          {tabIndex === 0 && (
            <Box>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h6">Active Committees</Typography>
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
                    <TableCell>Members</TableCell>
                    <TableCell>Term Duration</TableCell>
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
                      <TableCell>{row.members}</TableCell>
                      <TableCell>{row.term}</TableCell>
                      <TableCell align="right">
                        <IconButton size="small" color="primary"><Edit /></IconButton>
                        <IconButton size="small" color="error"><Delete /></IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          )}

          {/* =================================================================
              TAB 2: MEETING SCHEDULER (ADMIN)
          ================================================================= */}
          {tabIndex === 1 && (
            <Box>
              <Typography variant="h6" gutterBottom>Meeting Requests & Schedule</Typography>
              <Table>
                <TableHead sx={{ bgcolor: 'grey.50' }}>
                  <TableRow>
                    <TableCell>Committee</TableCell>
                    <TableCell>Meeting Title</TableCell>
                    <TableCell>Date & Time</TableCell>
                    <TableCell>Room / Venue</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Admin Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {meetings.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell fontWeight="bold">{row.committee}</TableCell>
                      <TableCell>
                        {row.title}
                        <Typography variant="caption" display="block" color="textSecondary">
                          Convener: {row.convener}
                        </Typography>
                      </TableCell>
                      <TableCell>{row.date} <br/> {row.time}</TableCell>
                      <TableCell>
                        {row.room === "Unassigned" ? (
                          <Chip label="Unassigned" size="small" color="warning" />
                        ) : (
                          <Box display="flex" alignItems="center" gap={0.5}>
                            <MeetingRoom fontSize="small" color="action" /> {row.room}
                          </Box>
                        )}
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={row.status} size="small" 
                          color={row.status === 'Approved' ? 'success' : row.status === 'Completed' ? 'default' : 'warning'} 
                        />
                      </TableCell>
                      <TableCell align="right">
                        {row.status === 'Pending Request' && (
                          <Button 
                            size="small" variant="contained" 
                            onClick={() => { setSelectedMeeting(row); setOpenMeetingDialog(true); }}
                          >
                            Review Request
                          </Button>
                        )}
                        {row.status === 'Completed' && (
                          <Tooltip title="Archive / View MoM">
                            <IconButton color="secondary"><Archive /></IconButton>
                          </Tooltip>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          )}
        </Box>
      </Card>

      {/* CREATE COMMITTEE DIALOG */}
      <Dialog open={openCommitteeDialog} onClose={() => setOpenCommitteeDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Create New Committee</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12} md={8}>
              <TextField fullWidth label="Committee Name" size="small" />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField select fullWidth label="Type" size="small" defaultValue="Statutory">
                <MenuItem value="Statutory">Statutory</MenuItem>
                <MenuItem value="Advisory">Advisory</MenuItem>
                <MenuItem value="Ad-hoc">Ad-hoc</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <Autocomplete
                options={facultyList}
                getOptionLabel={(option) => option.name}
                renderInput={(params) => <TextField {...params} label="Select Chairperson" size="small" />}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Autocomplete
                options={facultyList}
                getOptionLabel={(option) => option.name}
                renderInput={(params) => <TextField {...params} label="Select Convener" size="small" />}
              />
            </Grid>
            <Grid item xs={12}>
              <Autocomplete
                multiple
                options={facultyList}
                getOptionLabel={(option) => option.name}
                renderInput={(params) => <TextField {...params} label="Assign Members" size="small" />}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField type="date" fullWidth label="Formation Date" InputLabelProps={{ shrink: true }} size="small" />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth label="Term Duration (e.g., 2 Years)" size="small" />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCommitteeDialog(false)}>Cancel</Button>
          <Button variant="contained" color="primary">Create Committee</Button>
        </DialogActions>
      </Dialog>

      {/* MEETING APPROVAL DIALOG */}
      <Dialog open={openMeetingDialog} onClose={() => setOpenMeetingDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Approve Meeting Request</DialogTitle>
        <DialogContent dividers>
          <Typography variant="subtitle2" gutterBottom>Request Details:</Typography>
          <Typography variant="body2"><strong>Committee:</strong> {selectedMeeting?.committee}</Typography>
          <Typography variant="body2"><strong>Agenda:</strong> {selectedMeeting?.title}</Typography>
          <Typography variant="body2" mb={2}><strong>Proposed Time:</strong> {selectedMeeting?.date} at {selectedMeeting?.time}</Typography>
          
          <TextField 
            select fullWidth label="Allocate Room / Venue" 
            value={selectedMeeting?.room === "Unassigned" ? "" : selectedMeeting?.room}
            onChange={(e) => setSelectedMeeting({...selectedMeeting, room: e.target.value})}
          >
            <MenuItem value="Conference Hall A">Conference Hall A</MenuItem>
            <MenuItem value="Conference Hall B">Conference Hall B</MenuItem>
            <MenuItem value="Board Room">Board Room</MenuItem>
            <MenuItem value="Seminar Hall">Seminar Hall</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleRejectMeeting} color="error">Reject</Button>
          <Button onClick={handleApproveMeeting} variant="contained" color="success" startIcon={<CheckCircle />}>
            Approve & Allocate
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CommitteeManagementView;