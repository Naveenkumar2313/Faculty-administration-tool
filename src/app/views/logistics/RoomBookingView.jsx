import React, { useState } from "react";
import { 
  Box, Card, Grid, Typography, Button, Chip, CircularProgress, 
  Stack, Divider, TextField 
} from "@mui/material";
import { EventSeat, CheckCircle, Cancel, CalendarMonth } from "@mui/icons-material";
import useLogisticsSystem from "../../hooks/useLogisticsSystem";

const RoomBookingView = () => {
  const { rooms, loading, bookRoom } = useLogisticsSystem();
  
  if (loading) return <Box p={5} display="flex" justifyContent="center"><CircularProgress /></Box>;

  return (
    <Box sx={{ p: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" fontWeight="bold">Room Booking</Typography>
        <Button variant="outlined" startIcon={<CalendarMonth />}>Check Schedule</Button>
      </Box>

      <Grid container spacing={3}>
        {rooms.map((room) => (
          <Grid item xs={12} md={6} lg={4} key={room.id}>
            <Card sx={{ p: 0, opacity: room.status === 'Booked' ? 0.7 : 1 }}>
              <Box sx={{ p: 3, bgcolor: room.status === 'Booked' ? 'grey.200' : 'primary.main', color: room.status === 'Booked' ? 'text.primary' : 'white' }}>
                 <Typography variant="h6">{room.name}</Typography>
                 <Typography variant="subtitle2" sx={{ opacity: 0.8 }}>Capacity: {room.capacity}</Typography>
              </Box>
              
              <Box sx={{ p: 3 }}>
                <Stack direction="row" spacing={1} sx={{ mb: 3 }}>
                  {room.features.map(f => <Chip key={f} label={f} size="small" />)}
                </Stack>

                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Chip 
                    icon={room.status === 'Available' ? <CheckCircle /> : <Cancel />}
                    label={room.status}
                    color={room.status === 'Available' ? 'success' : 'default'}
                  />
                  <Button 
                    variant="contained" 
                    disabled={room.status !== 'Available'}
                    onClick={() => {
                        if(window.confirm(`Book ${room.name}?`)) bookRoom(room.id);
                    }}
                  >
                    Book Now
                  </Button>
                </Box>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default RoomBookingView;