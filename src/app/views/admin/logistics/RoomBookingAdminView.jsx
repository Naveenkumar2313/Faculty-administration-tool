import React, { useState } from "react";
import { 
  Box, Card, Grid, Typography, Button, Table, TableBody, TableCell, 
  TableHead, TableRow, Chip, IconButton, Tooltip, Dialog, DialogTitle, 
  DialogContent, DialogActions, TextField, MenuItem, Switch, FormControlLabel,
  LinearProgress, Checkbox, FormGroup ,Divider
} from "@mui/material";
import { 
  EventAvailable, MeetingRoom, Analytics, CheckCircle, Cancel, 
  Add, Edit, Build, Block, Videocam, AcUnit, Wifi 
} from "@mui/icons-material";

const RoomBookingAdminView = () => {
  const [tabIndex, setTabIndex] = useState(0);

  // MOCK DATA: BOOKING REQUESTS
  const [requests, setRequests] = useState([
    { id: 101, room: "Conference Hall A", faculty: "Dr. Sarah Smith", date: "2026-02-15", time: "10:00 AM - 12:00 PM", purpose: "Dept Meeting", status: "Pending" },
    { id: 102, room: "Seminar Hall", faculty: "Prof. Rajan Kumar", date: "2026-02-18", time: "02:00 PM - 04:00 PM", purpose: "Guest Lecture", status: "Pending" },
    { id: 103, room: "Lab 3 (Computer)", faculty: "Ms. Priya Roy", date: "2026-02-15", time: "10:00 AM - 12:00 PM", purpose: "Workshop", status: "Conflict" }, // Conflict
  ]);

  // MOCK DATA: ROOMS
  const [rooms, setRooms] = useState([
    { id: 1, name: "Conference Hall A", capacity: 50, floor: "Ground", features: ["Projector", "AC", "Wi-Fi"], status: "Active" },
    { id: 2, name: "Seminar Hall", capacity: 200, floor: "1st Floor", features: ["Projector", "Sound System", "AC"], status: "Active" },
    { id: 3, name: "Lab 3 (Computer)", capacity: 40, floor: "2nd Floor", features: ["Computers", "AC"], status: "Under Maintenance" },
  ]);

  // DIALOG STATES
  const [openRoomDialog, setOpenRoomDialog] = useState(false);
  const [currentRoom, setCurrentRoom] = useState({ name: "", capacity: "", floor: "", features: [], status: "Active" });

  const [openApproveDialog, setOpenApproveDialog] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [adminComment, setAdminComment] = useState("");

  // ACTIONS
  const handleRequestAction = (status) => {
    setRequests(requests.map(r => r.id === selectedRequest.id ? { ...r, status: status } : r));
    setOpenApproveDialog(false);
    setAdminComment("");
  };

  const handleSaveRoom = () => {
    const newId = rooms.length + 1;
    setRooms([...rooms, { id: newId, ...currentRoom }]);
    setOpenRoomDialog(false);
  };

  const toggleMaintenance = (id) => {
    setRooms(rooms.map(r => r.id === id ? { ...r, status: r.status === "Active" ? "Under Maintenance" : "Active" } : r));
  };

  // ANALYTICS DATA
  const utilization = [
    { name: "Conference Hall A", percent: 85 },
    { name: "Seminar Hall", percent: 45 },
    { name: "Lab 3", percent: 92 },
    { name: "Meeting Room B", percent: 20 },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
        Room Booking Administration
      </Typography>

      <Card sx={{ minHeight: 500 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 2, bgcolor: 'background.paper' }}>
          <Button 
            startIcon={<EventAvailable />} 
            sx={{ px: 3, py: 1.5, borderBottom: tabIndex === 0 ? 2 : 0, borderRadius: 0 }}
            color={tabIndex === 0 ? "primary" : "inherit"}
            onClick={() => setTabIndex(0)}
          >
            Booking Approvals
          </Button>
          <Button 
            startIcon={<MeetingRoom />} 
            sx={{ px: 3, py: 1.5, borderBottom: tabIndex === 1 ? 2 : 0, borderRadius: 0 }}
            color={tabIndex === 1 ? "primary" : "inherit"}
            onClick={() => setTabIndex(1)}
          >
            Room Master Data
          </Button>
          <Button 
            startIcon={<Analytics />} 
            sx={{ px: 3, py: 1.5, borderBottom: tabIndex === 2 ? 2 : 0, borderRadius: 0 }}
            color={tabIndex === 2 ? "primary" : "inherit"}
            onClick={() => setTabIndex(2)}
          >
            Utilization Analytics
          </Button>
        </Box>

        <Box sx={{ p: 3 }}>
          {/* =================================================================
              TAB 1: BOOKING APPROVALS
          ================================================================= */}
          {tabIndex === 0 && (
            <Box>
              <Typography variant="h6" gutterBottom>Pending Booking Requests</Typography>
              <Table>
                <TableHead sx={{ bgcolor: 'grey.100' }}>
                  <TableRow>
                    <TableCell>Room</TableCell>
                    <TableCell>Faculty & Purpose</TableCell>
                    <TableCell>Date & Time</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {requests.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell fontWeight="bold">{row.room}</TableCell>
                      <TableCell>
                        <Typography variant="body2">{row.faculty}</Typography>
                        <Typography variant="caption" color="textSecondary">{row.purpose}</Typography>
                      </TableCell>
                      <TableCell>{row.date} <br/> {row.time}</TableCell>
                      <TableCell>
                        <Chip 
                          label={row.status} size="small" 
                          color={row.status === 'Approved' ? 'success' : row.status === 'Conflict' ? 'error' : 'warning'} 
                        />
                      </TableCell>
                      <TableCell align="right">
                        {row.status !== 'Approved' && row.status !== 'Rejected' && (
                          <Button 
                            variant="contained" size="small" 
                            onClick={() => { setSelectedRequest(row); setOpenApproveDialog(true); }}
                          >
                            Review
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          )}

          {/* =================================================================
              TAB 2: ROOM MASTER DATA
          ================================================================= */}
          {tabIndex === 1 && (
            <Box>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h6">Manage Rooms & Facilities</Typography>
                <Button variant="contained" startIcon={<Add />} onClick={() => setOpenRoomDialog(true)}>
                  Add New Room
                </Button>
              </Box>

              <Grid container spacing={3}>
                {rooms.map((room) => (
                  <Grid item xs={12} md={4} key={room.id}>
                    <Card variant="outlined" sx={{ p: 2, position: 'relative' }}>
                      <Box display="flex" justifyContent="space-between" mb={1}>
                        <Typography variant="subtitle1" fontWeight="bold">{room.name}</Typography>
                        <Chip 
                          label={room.status} size="small" 
                          color={room.status === 'Active' ? 'success' : 'error'} 
                        />
                      </Box>
                      <Typography variant="body2" color="textSecondary">Capacity: {room.capacity} • {room.floor}</Typography>
                      
                      <Box display="flex" gap={1} mt={2} mb={2}>
                        {room.features.includes("Projector") && <Tooltip title="Projector"><Videocam fontSize="small" color="action" /></Tooltip>}
                        {room.features.includes("AC") && <Tooltip title="AC"><AcUnit fontSize="small" color="action" /></Tooltip>}
                        {room.features.includes("Wi-Fi") && <Tooltip title="Wi-Fi"><Wifi fontSize="small" color="action" /></Tooltip>}
                      </Box>

                      <Divider />
                      
                      <Box display="flex" justifyContent="space-between" mt={2}>
                        <Button size="small" startIcon={<Edit />}>Edit</Button>
                        <Button 
                          size="small" color={room.status === "Active" ? "warning" : "success"} 
                          startIcon={room.status === "Active" ? <Build /> : <CheckCircle />}
                          onClick={() => toggleMaintenance(room.id)}
                        >
                          {room.status === "Active" ? "Maintenance" : "Activate"}
                        </Button>
                      </Box>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}

          {/* =================================================================
              TAB 3: UTILIZATION ANALYTICS
          ================================================================= */}
          {tabIndex === 2 && (
            <Box>
              <Grid container spacing={3} mb={4}>
                <Grid item xs={12} md={4}>
                  <Card sx={{ p: 2, bgcolor: 'primary.light', color: 'white', textAlign: 'center' }}>
                    <Typography variant="h6">Peak Usage Time</Typography>
                    <Typography variant="h4" fontWeight="bold">10 AM - 2 PM</Typography>
                  </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Card sx={{ p: 2, bgcolor: 'secondary.light', color: 'white', textAlign: 'center' }}>
                    <Typography variant="h6">Most Booked</Typography>
                    <Typography variant="h4" fontWeight="bold">Conf. Hall A</Typography>
                  </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Card sx={{ p: 2, bgcolor: 'success.light', color: 'white', textAlign: 'center' }}>
                    <Typography variant="h6">Avg. Utilization</Typography>
                    <Typography variant="h4" fontWeight="bold">68%</Typography>
                  </Card>
                </Grid>
              </Grid>

              <Typography variant="h6" gutterBottom>Room Utilization Rates</Typography>
              <Table size="small">
                <TableHead sx={{ bgcolor: 'grey.50' }}>
                  <TableRow>
                    <TableCell>Room Name</TableCell>
                    <TableCell>Utilization %</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {utilization.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell fontWeight="bold">{row.name}</TableCell>
                      <TableCell sx={{ width: '50%' }}>
                        <Box display="flex" alignItems="center" gap={2}>
                          <LinearProgress 
                            variant="determinate" value={row.percent} 
                            color={row.percent > 80 ? "success" : row.percent > 40 ? "primary" : "warning"} 
                            sx={{ width: '100%', height: 8, borderRadius: 4 }}
                          />
                          <Typography variant="caption" fontWeight="bold">{row.percent}%</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="caption" color="textSecondary">
                          {row.percent > 80 ? "High Demand" : "Available"}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          )}
        </Box>
      </Card>

      {/* APPROVE DIALOG */}
      <Dialog open={openApproveDialog} onClose={() => setOpenApproveDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Review Booking Request</DialogTitle>
        <DialogContent dividers>
          <Box mb={2}>
            <Typography variant="subtitle2">Room: {selectedRequest?.room}</Typography>
            <Typography variant="body2">Requested by: {selectedRequest?.faculty}</Typography>
            <Typography variant="body2">Time: {selectedRequest?.time}</Typography>
            {selectedRequest?.status === 'Conflict' && (
              <Box mt={1} p={1} bgcolor="error.light" color="error.contrastText" borderRadius={1} display="flex" alignItems="center" gap={1}>
                <Block fontSize="small" />
                <Typography variant="caption" fontWeight="bold">Warning: Overlaps with existing booking!</Typography>
              </Box>
            )}
          </Box>
          <TextField 
            fullWidth label="Admin Comments / Rejection Reason" multiline rows={2}
            value={adminComment} onChange={(e) => setAdminComment(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleRequestAction("Rejected")} color="error">Reject</Button>
          <Button onClick={() => handleRequestAction("Approved")} variant="contained" color="success" startIcon={<CheckCircle />}>
            Approve Booking
          </Button>
        </DialogActions>
      </Dialog>

      {/* ADD ROOM DIALOG */}
      <Dialog open={openRoomDialog} onClose={() => setOpenRoomDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Add New Room</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={8}>
              <TextField 
                fullWidth label="Room Name / Number" size="small"
                value={currentRoom.name} onChange={(e) => setCurrentRoom({...currentRoom, name: e.target.value})}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField 
                fullWidth label="Capacity" type="number" size="small"
                value={currentRoom.capacity} onChange={(e) => setCurrentRoom({...currentRoom, capacity: e.target.value})}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField 
                select fullWidth label="Floor / Location" size="small" defaultValue=""
                value={currentRoom.floor} onChange={(e) => setCurrentRoom({...currentRoom, floor: e.target.value})}
              >
                <MenuItem value="Ground Floor">Ground Floor</MenuItem>
                <MenuItem value="1st Floor">1st Floor</MenuItem>
                <MenuItem value="2nd Floor">2nd Floor</MenuItem>
                <MenuItem value="Block B">Block B</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="caption" color="textSecondary" mb={1} display="block">Available Facilities</Typography>
              <FormGroup row>
                <FormControlLabel control={<Checkbox />} label="Projector" />
                <FormControlLabel control={<Checkbox />} label="Air Conditioning" />
                <FormControlLabel control={<Checkbox />} label="Video Conf. System" />
                <FormControlLabel control={<Checkbox />} label="Smart Board" />
              </FormGroup>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenRoomDialog(false)}>Cancel</Button>
          <Button onClick={handleSaveRoom} variant="contained" color="primary">Save Room</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RoomBookingAdminView;