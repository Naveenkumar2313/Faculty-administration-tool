import React, { useState } from 'react';
import { 
  Box, Card, Grid, Typography, Button, Tabs, Tab, TextField, 
  MenuItem, Chip, Stack, IconButton, Dialog, DialogTitle, 
  DialogContent, DialogActions, FormControlLabel, Checkbox, 
  Slider, Alert, Paper, LinearProgress, Avatar
} from "@mui/material";
import { 
  MeetingRoom, CalendarMonth, EventAvailable, Map, 
  Search, FilterList, CheckCircle, Cancel, Videocam, 
  Mic, Kitchen 
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

import useRoomBookingSystem from "../../hooks/useRoomBookingSystem";

const RoomBookingView = () => {
  const theme = useTheme();
  const { 
    rooms, bookings, stats, 
    checkAvailability, bookRoom, cancelBooking 
  } = useRoomBookingSystem();

  const [tabIndex, setTabIndex] = useState(0);
  
  // Filters
  const [filterCapacity, setFilterCapacity] = useState(10);
  const [filterAC, setFilterAC] = useState(false);
  const [filterVC, setFilterVC] = useState(false);

  // Booking Form State
  const [openBooking, setOpenBooking] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState("");
  const [bookingDetails, setBookingDetails] = useState({ date: "", slot: "", purpose: "", attendees: "", catering: false });
  const [errorMsg, setErrorMsg] = useState("");

  const handleBookingSubmit = async () => {
    setErrorMsg("");
    try {
      await bookRoom({ ...bookingDetails, roomId: selectedRoomId });
      setOpenBooking(false);
      alert("Booking Request Sent for Approval!");
      setBookingDetails({ date: "", slot: "", purpose: "", attendees: "", catering: false });
    } catch (err) {
      setErrorMsg(err);
    }
  };

  const getFilteredRooms = () => {
    return rooms.filter(r => {
      if (r.capacity < filterCapacity) return false;
      if (filterAC && r.type !== 'AC') return false;
      if (filterVC && !r.features.includes('Video Conf')) return false;
      return true;
    });
  };

  const filteredRooms = getFilteredRooms();

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>Room Booking & Facilities</Typography>

      {/* 1. ANALYTICS HEADER */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} md={3}>
          <Card sx={{ p: 2, textAlign: 'center', bgcolor: 'primary.light', color: 'white' }}>
            <Typography variant="h4" fontWeight="bold">{stats.utilization}%</Typography>
            <Typography variant="caption">Avg. Utilization</Typography>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h6" fontWeight="bold">{stats.mostBooked}</Typography>
            <Typography variant="caption" color="text.secondary">Most Popular Room</Typography>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h6" fontWeight="bold">{stats.peakTime}</Typography>
            <Typography variant="caption" color="text.secondary">Peak Usage Time</Typography>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card sx={{ p: 2, textAlign: 'center', bgcolor: 'warning.light', color: 'warning.dark' }}>
            <Typography variant="h4" fontWeight="bold">{stats.pendingRequests}</Typography>
            <Typography variant="caption">Pending Approvals</Typography>
          </Card>
        </Grid>
      </Grid>

      <Card elevation={3} sx={{ minHeight: 600 }}>
        <Tabs 
          value={tabIndex} 
          onChange={(e, v) => setTabIndex(v)} 
          sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'grey.50' }}
        >
          <Tab icon={<Search />} label="Find & Book" iconPosition="start" />
          <Tab icon={<Map />} label="Visual Floor Plan" iconPosition="start" />
          <Tab icon={<EventAvailable />} label="My Bookings" iconPosition="start" />
        </Tabs>

        <Box p={3}>
          {/* TAB 0: FIND & BOOK */}
          {tabIndex === 0 && (
            <Grid container spacing={3}>
              {/* FILTERS */}
              <Grid item xs={12} md={3} sx={{ borderRight: '1px solid #eee' }}>
                <Typography variant="subtitle2" fontWeight="bold" gutterBottom display="flex" alignItems="center" gap={1}>
                  <FilterList fontSize="small" /> Filters
                </Typography>
                <Box mt={2}>
                  <Typography variant="caption" gutterBottom>Min Capacity: {filterCapacity}</Typography>
                  <Slider 
                    value={filterCapacity} 
                    onChange={(e, v) => setFilterCapacity(v)} 
                    min={10} max={200} step={10} 
                    valueLabelDisplay="auto" 
                  />
                </Box>
                <Stack spacing={1} mt={2}>
                  <FormControlLabel 
                    control={<Checkbox checked={filterAC} onChange={(e) => setFilterAC(e.target.checked)} />} 
                    label="AC Room Only" 
                  />
                  <FormControlLabel 
                    control={<Checkbox checked={filterVC} onChange={(e) => setFilterVC(e.target.checked)} />} 
                    label="Video Conferencing" 
                  />
                </Stack>
              </Grid>

              {/* ROOM LIST */}
              <Grid item xs={12} md={9}>
                <Typography variant="subtitle2" color="text.secondary" mb={2}>
                  Showing {filteredRooms.length} rooms matching criteria
                </Typography>
                <Grid container spacing={3}>
                  {filteredRooms.map((room) => (
                    <Grid item xs={12} sm={6} lg={4} key={room.id}>
                      <Card variant="outlined" sx={{ position: 'relative', overflow: 'hidden' }}>
                        <Box sx={{ height: 100, bgcolor: 'grey.200', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                           <MeetingRoom sx={{ fontSize: 50, color: 'grey.400' }} />
                        </Box>
                        {room.status === 'Maintenance' && (
                          <Box sx={{ position: 'absolute', top: 0, right: 0, bgcolor: 'error.main', color: 'white', px: 1, fontSize: 10 }}>
                            MAINTENANCE
                          </Box>
                        )}
                        <Box p={2}>
                          <Typography variant="subtitle1" fontWeight="bold">{room.name}</Typography>
                          <Typography variant="caption" color="text.secondary" display="block">Floor {room.floor} • {room.type}</Typography>
                          <Stack direction="row" spacing={1} mt={1} flexWrap="wrap">
                             <Chip label={`Cap: ${room.capacity}`} size="small" />
                             {room.features.includes('Video Conf') && <Chip icon={<Videocam />} label="VC" size="small" color="primary" variant="outlined" />}
                          </Stack>
                          <Button 
                            variant="contained" fullWidth sx={{ mt: 2 }} 
                            disabled={room.status !== 'Available'}
                            onClick={() => { setSelectedRoomId(room.id); setOpenBooking(true); }}
                          >
                            Book Now
                          </Button>
                        </Box>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            </Grid>
          )}

          {/* TAB 1: VISUAL FLOOR PLAN */}
          {tabIndex === 1 && (
            <Box>
              <Typography variant="h6" gutterBottom>Campus Map View</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {[1, 2].map(floor => (
                  <Paper key={floor} variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>Floor {floor}</Typography>
                    <Grid container spacing={2}>
                      {rooms.filter(r => r.floor === floor).map(room => (
                        <Grid item xs={6} md={3} key={room.id}>
                          <Card 
                            variant="outlined" 
                            sx={{ 
                              p: 2, textAlign: 'center', cursor: 'pointer',
                              bgcolor: room.status === 'Available' ? 'success.light' : 'grey.300',
                              color: room.status === 'Available' ? 'white' : 'grey.700',
                              '&:hover': { transform: 'scale(1.05)', transition: '0.2s' }
                            }}
                            onClick={() => { if(room.status === 'Available') { setSelectedRoomId(room.id); setOpenBooking(true); } }}
                          >
                            <Typography variant="body2" fontWeight="bold">{room.name}</Typography>
                            <Typography variant="caption">Cap: {room.capacity}</Typography>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  </Paper>
                ))}
              </Box>
              <Box mt={2} display="flex" gap={2}>
                <Box display="flex" alignItems="center" gap={1}><Box sx={{ w: 16, h: 16, bgcolor: 'success.light', p: 1 }} /> Available</Box>
                <Box display="flex" alignItems="center" gap={1}><Box sx={{ w: 16, h: 16, bgcolor: 'grey.300', p: 1 }} /> Maintenance/Occupied</Box>
              </Box>
            </Box>
          )}

          {/* TAB 2: MY BOOKINGS */}
          {tabIndex === 2 && (
            <Stack spacing={2}>
              {bookings.filter(b => b.user === 'Self').map((booking) => (
                <Card key={booking.id} variant="outlined" sx={{ p: 2 }}>
                  <Grid container alignItems="center">
                    <Grid item xs={12} md={8}>
                      <Typography variant="subtitle1" fontWeight="bold">{booking.purpose}</Typography>
                      <Typography variant="body2">
                        {booking.room} • {booking.date} @ {booking.slot}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={4} textAlign={{ xs: 'left', md: 'right' }}>
                      <Chip 
                        label={booking.status} 
                        color={booking.status === 'Confirmed' ? 'success' : booking.status === 'Cancelled' ? 'error' : 'warning'} 
                        size="small" 
                        sx={{ mr: 2 }}
                      />
                      {booking.status !== 'Cancelled' && (
                        <Button size="small" color="error" onClick={() => cancelBooking(booking.id)}>Cancel</Button>
                      )}
                    </Grid>
                  </Grid>
                </Card>
              ))}
            </Stack>
          )}
        </Box>
      </Card>

      {/* BOOKING DIALOG */}
      <Dialog open={openBooking} onClose={() => setOpenBooking(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Book Room: {rooms.find(r => r.id === selectedRoomId)?.name}</DialogTitle>
        <DialogContent dividers>
          {errorMsg && <Alert severity="error" sx={{ mb: 2 }}>{errorMsg}</Alert>}
          <Stack spacing={2}>
            <Stack direction="row" spacing={2}>
              <TextField 
                type="date" label="Date" fullWidth InputLabelProps={{ shrink: true }}
                value={bookingDetails.date}
                onChange={(e) => setBookingDetails({...bookingDetails, date: e.target.value})}
              />
              <TextField 
                select label="Time Slot" fullWidth 
                value={bookingDetails.slot}
                onChange={(e) => setBookingDetails({...bookingDetails, slot: e.target.value})}
              >
                <MenuItem value="09:00 - 10:00">09:00 - 10:00</MenuItem>
                <MenuItem value="10:00 - 12:00">10:00 - 12:00</MenuItem>
                <MenuItem value="14:00 - 16:00">14:00 - 16:00</MenuItem>
              </TextField>
            </Stack>
            <TextField 
              label="Purpose of Booking" fullWidth 
              value={bookingDetails.purpose}
              onChange={(e) => setBookingDetails({...bookingDetails, purpose: e.target.value})}
            />
            <TextField 
              type="number" label="Expected Attendees" fullWidth 
              value={bookingDetails.attendees}
              onChange={(e) => setBookingDetails({...bookingDetails, attendees: e.target.value})}
            />
            <Typography variant="subtitle2" gutterBottom>Add-ons Required:</Typography>
            <Box display="flex" gap={2}>
               <Chip 
                 icon={<Mic />} label="Extra Mics" 
                 variant={bookingDetails.mics ? "filled" : "outlined"} 
                 color="primary"
                 onClick={() => setBookingDetails({...bookingDetails, mics: !bookingDetails.mics})}
               />
               <Chip 
                 icon={<Kitchen />} label="Catering" 
                 variant={bookingDetails.catering ? "filled" : "outlined"} 
                 color="primary"
                 onClick={() => setBookingDetails({...bookingDetails, catering: !bookingDetails.catering})}
               />
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenBooking(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleBookingSubmit}>Submit Request</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RoomBookingView;