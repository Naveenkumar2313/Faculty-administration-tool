import React, { useState } from 'react';
import { 
  Box, Card, Grid, Typography, Button, Tabs, Tab, TextField, 
  MenuItem, Chip, Stack, IconButton, Dialog, DialogTitle, 
  DialogContent, DialogActions, FormControlLabel, Checkbox, 
  Slider, Alert, Paper, LinearProgress, Avatar, Divider,
  InputAdornment, Collapse, 
} from "@mui/material";
import { 
  MeetingRoom, CalendarMonth, EventAvailable, Map, 
  Search, FilterList, CheckCircle, Cancel, Videocam, 
  Mic, Kitchen, TrendingUp, BarChart, People,
  ChevronRight, Info, CheckCircleOutline, WarningAmber,
  LocationOn, DoorFront, AirlineSeatFlatAngled, Lightbulb, MapOutlined, AccessTime
} from '@mui/icons-material';

import useRoomBookingSystem from "../../hooks/useRoomBookingSystem";

/* ─────────────────────────────────────────
   DESIGN TOKENS (matching your system)
───────────────────────────────────────── */
const T = {
  bg:           "#F5F7FA",
  surface:      "#FFFFFF",
  border:       "#E4E8EF",
  accent:       "#6366F1",
  accentLight:  "#EEF2FF",
  success:      "#10B981",
  successLight: "#ECFDF5",
  warning:      "#F59E0B",
  warningLight: "#FFFBEB",
  danger:       "#EF4444",
  dangerLight:  "#FEF2F2",
  info:         "#0EA5E9",
  infoLight:    "#F0F9FF",
  purple:       "#8B5CF6",
  purpleLight:  "#F5F3FF",
  text:         "#111827",
  textSub:      "#4B5563",
  textMute:     "#9CA3AF",
};

const fHead = "Roboto, Helvetica, Arial, sans-serif";
const fBody = "Roboto, Helvetica, Arial, sans-serif";
const fMono = "Roboto, Helvetica, Arial, sans-serif";

const Fonts = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Sora:wght@600;700&family=Nunito:wght@400;500;600;700&family=JetBrains+Mono:wght@500;600&display=swap');
    * { box-sizing:border-box; }
    @keyframes fadeUp { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:none} }
    .fu  { animation: fadeUp 0.28s ease both; }
    .fu1 { animation: fadeUp 0.28s .07s ease both; }
    .fu2 { animation: fadeUp 0.28s .14s ease both; }
    .card-h { transition:box-shadow .16s,transform .16s; }
    .card-h:hover { box-shadow:0 4px 20px rgba(99,102,241,.11); transform:translateY(-2px); }
    .row-h:hover { background:#F9FAFB !important; transition:background .13s; }
  `}</style>
);

/* ─────────────────────────────────────────
   PRIMITIVES
───────────────────────────────────────── */
const SCard = ({ children, sx={}, hover=false, ...p }) => (
  <Box className={hover?"card-h":""}
    sx={{ background:T.surface, border:`1px solid ${T.border}`, borderRadius:"14px", ...sx }}
    {...p}>
    {children}
  </Box>
);

const SLabel = ({ children, sx={} }) => (
  <Typography sx={{ fontFamily:fBody, fontSize:"0.67rem", fontWeight:700,
    letterSpacing:"0.08em", textTransform:"uppercase", color:T.textMute, mb:0.6, ...sx }}>
    {children}
  </Typography>
);

const StatusBadge = ({ status }) => {
  const map = {
    'Available':     { color:T.success,  bg:T.successLight  },
    'Occupied':      { color:T.warning,  bg:T.warningLight  },
    'Maintenance':   { color:T.danger,   bg:T.dangerLight   },
    'Confirmed':     { color:T.success,  bg:T.successLight  },
    'Pending':       { color:T.warning,  bg:T.warningLight  },
    'Cancelled':     { color:T.danger,   bg:T.dangerLight   },
  };
  const m = map[status] || { color:T.textMute, bg:"#F1F5F9" };
  return (
    <Box display="flex" alignItems="center" gap={0.6} sx={{ px:1.2, py:0.4, borderRadius:"99px", bgcolor:m.bg, width:"fit-content" }}>
      <Box sx={{ width:6, height:6, borderRadius:"50%", bgcolor:m.color }} />
      <Typography sx={{ fontFamily:fBody, fontSize:"0.71rem", fontWeight:700, color:m.color }}>{status}</Typography>
    </Box>
  );
};

const RoomBookingView = () => {
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
  const [bookingDetails, setBookingDetails] = useState({ date: "", slot: "", purpose: "", attendees: "", mics: false, catering: false });
  const [errorMsg, setErrorMsg] = useState("");

  const handleBookingSubmit = async () => {
    setErrorMsg("");
    if (!bookingDetails.date || !bookingDetails.slot || !bookingDetails.purpose || !bookingDetails.attendees) {
      setErrorMsg("Please fill all required fields.");
      return;
    }
    try {
      await bookRoom({ ...bookingDetails, roomId: selectedRoomId });
      setOpenBooking(false);
      alert("Booking Request Sent for Approval!");
      setBookingDetails({ date: "", slot: "", purpose: "", attendees: "", mics: false, catering: false });
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
    <Box sx={{ p:3, bgcolor:T.bg, minHeight:"100vh", fontFamily:fBody }}>
      <Fonts />

      {/* ── HEADER ── */}
      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3} flexWrap="wrap" gap={2} className="fu">
        <Box>
          <Typography sx={{ fontFamily:fBody, fontSize:"0.72rem", fontWeight:700,
            letterSpacing:"0.1em", textTransform:"uppercase", color:T.textMute, mb:0.3 }}>
            Facilities · Logistics
          </Typography>
          <Typography sx={{ fontFamily:fHead, fontWeight:700, fontSize:"1.5rem", color:T.text }}>
            Room Booking & Facilities
          </Typography>
          <Typography sx={{ fontFamily:fBody, fontSize:"0.82rem", color:T.textSub, mt:0.3 }}>
            Search available spaces, book rooms, manage reservations
          </Typography>
        </Box>
      </Box>

      {/* ── ANALYTICS CARDS ── */}
      <Grid container spacing={2.5} mb={3} className="fu1">
        <Grid item xs={12} sm={6} md={3}>
          <SCard sx={{ p:2.5 }} hover>
            <Box display="flex" justifyContent="space-between" alignItems="flex-start">
              <Box>
                <SLabel>Avg. Utilization</SLabel>
                <Typography sx={{ fontFamily:fMono, fontWeight:700, fontSize:"1.8rem", color:T.accent, lineHeight:1.1 }}>
                  {stats.utilization}%
                </Typography>
                <Typography sx={{ fontFamily:fBody, fontSize:"0.7rem", color:T.textMute, mt:0.3 }}>Across all spaces</Typography>
              </Box>
              <Box sx={{ p:1.1, borderRadius:"10px", bgcolor:T.accentLight, color:T.accent }}>
                <TrendingUp sx={{ fontSize:20 }} />
              </Box>
            </Box>
          </SCard>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <SCard sx={{ p:2.5 }} hover>
            <Box display="flex" justifyContent="space-between" alignItems="flex-start">
              <Box>
                <SLabel>Most Popular</SLabel>
                <Typography sx={{ fontFamily:fMono, fontWeight:700, fontSize:"1.2rem", color:T.success, lineHeight:1.1 }}>
                  {stats.mostBooked}
                </Typography>
                <Typography sx={{ fontFamily:fBody, fontSize:"0.7rem", color:T.textMute, mt:0.3 }}>Most booked room</Typography>
              </Box>
              <Box sx={{ p:1.1, borderRadius:"10px", bgcolor:T.successLight, color:T.success }}>
                <BarChart sx={{ fontSize:20 }} />
              </Box>
            </Box>
          </SCard>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <SCard sx={{ p:2.5 }} hover>
            <Box display="flex" justifyContent="space-between" alignItems="flex-start">
              <Box>
                <SLabel>Peak Usage Time</SLabel>
                <Typography sx={{ fontFamily:fMono, fontWeight:700, fontSize:"1.2rem", color:T.warning, lineHeight:1.1 }}>
                  {stats.peakTime}
                </Typography>
                <Typography sx={{ fontFamily:fBody, fontSize:"0.7rem", color:T.textMute, mt:0.3 }}>Peak demand slot</Typography>
              </Box>
              <Box sx={{ p:1.1, borderRadius:"10px", bgcolor:T.warningLight, color:T.warning }}>
                <AccessTime sx={{ fontSize:20 }} />
              </Box>
            </Box>
          </SCard>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <SCard sx={{ p:2.5 }} hover>
            <Box display="flex" justifyContent="space-between" alignItems="flex-start">
              <Box>
                <SLabel>Pending Approvals</SLabel>
                <Typography sx={{ fontFamily:fMono, fontWeight:700, fontSize:"1.8rem", color:T.danger, lineHeight:1.1 }}>
                  {stats.pendingRequests}
                </Typography>
                <Typography sx={{ fontFamily:fBody, fontSize:"0.7rem", color:T.textMute, mt:0.3 }}>Awaiting action</Typography>
              </Box>
              <Box sx={{ p:1.1, borderRadius:"10px", bgcolor:T.dangerLight, color:T.danger }}>
                <WarningAmber sx={{ fontSize:20 }} />
              </Box>
            </Box>
          </SCard>
        </Grid>
      </Grid>

      {/* ── MAIN CARD ── */}
      <SCard sx={{ overflow:"hidden" }} className="fu2">
        <Box sx={{ borderBottom:`1px solid ${T.border}`, bgcolor:"#FAFBFD", px:3 }}>
          <Tabs 
            value={tabIndex} 
            onChange={(e, v) => setTabIndex(v)}
            sx={{
              "& .MuiTabs-indicator":{ bgcolor:T.accent, height:"2.5px", borderRadius:"2px 2px 0 0" },
              "& .MuiTab-root":{ fontFamily:fBody, fontWeight:600, fontSize:"0.82rem", textTransform:"none", color:T.textMute, minHeight:50, "&.Mui-selected":{ color:T.accent } }
            }}
          >
            <Tab icon={<Search sx={{ fontSize:16 }} />} iconPosition="start" label="Find & Book" />
            <Tab icon={<Map sx={{ fontSize:16 }} />} iconPosition="start" label="Floor Plan" />
            <Tab icon={<EventAvailable sx={{ fontSize:16 }} />} iconPosition="start" label="My Bookings" />
          </Tabs>
        </Box>

        <Box p={3}>
          {/* ══════════════════════════════════════
              TAB 0: FIND & BOOK
          ══════════════════════════════════════ */}
          {tabIndex === 0 && (
            <Grid container spacing={3}>
              {/* FILTERS PANEL */}
              <Grid item xs={12} md={3}>
                <Box display="flex" alignItems="center" gap={1} mb={2}>
                  <FilterList sx={{ fontSize:18, color:T.accent }} />
                  <Typography sx={{ fontFamily:fHead, fontWeight:700, fontSize:"0.9rem", color:T.text }}>Filters</Typography>
                </Box>

                <Box sx={{ p:2, borderRadius:"10px", bgcolor:"#FAFBFD", border:`1px solid ${T.border}` }}>
                  <Box mb={2.5}>
                    <SLabel sx={{ mb:1 }}>Min. Capacity</SLabel>
                    <Box display="flex" alignItems="center" gap={1.5} mb={1}>
                      <Slider 
                        value={filterCapacity} 
                        onChange={(e, v) => setFilterCapacity(v)} 
                        min={10} max={200} step={10} 
                        valueLabelDisplay="auto"
                        sx={{
                          flex:1,
                          "& .MuiSlider-thumb":{ bgcolor:T.accent, boxShadow:`0 0 0 4px ${T.accentLight}` },
                          "& .MuiSlider-track":{ bgcolor:T.accent },
                          "& .MuiSlider-rail":{ bgcolor:T.border }
                        }}
                      />
                      <Box sx={{ px:1.2, py:0.4, borderRadius:"6px", bgcolor:T.accentLight, minWidth:40 }}>
                        <Typography sx={{ fontFamily:fMono, fontWeight:700, fontSize:"0.75rem", color:T.accent, textAlign:"center" }}>
                          {filterCapacity}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  <Divider sx={{ borderColor:T.border, my:2 }} />

                  <Stack spacing={1.2}>
                    <FormControlLabel 
                      control={<Checkbox checked={filterAC} onChange={(e) => setFilterAC(e.target.checked)} sx={{
                        "&.Mui-checked":{ color:T.accent },
                        color:T.border
                      }} />}
                      label={
                        <Typography sx={{ fontFamily:fBody, fontSize:"0.8rem", color:T.textSub, fontWeight:500 }}>
                          Air Conditioned Only
                        </Typography>
                      }
                    />
                    <FormControlLabel 
                      control={<Checkbox checked={filterVC} onChange={(e) => setFilterVC(e.target.checked)} sx={{
                        "&.Mui-checked":{ color:T.accent },
                        color:T.border
                      }} />}
                      label={
                        <Typography sx={{ fontFamily:fBody, fontSize:"0.8rem", color:T.textSub, fontWeight:500 }}>
                          Video Conferencing Setup
                        </Typography>
                      }
                    />
                  </Stack>
                </Box>

                {/* Filter results summary */}
                <Box mt={2}>
                  <Typography sx={{ fontFamily:fBody, fontSize:"0.75rem", color:T.textMute, fontWeight:600, mb:0.5 }}>
                    RESULTS
                  </Typography>
                  <Box sx={{ p:1.5, borderRadius:"8px", bgcolor:T.accentLight, border:`1px solid ${T.accent}30` }}>
                    <Typography sx={{ fontFamily:fMono, fontWeight:700, fontSize:"1.1rem", color:T.accent }}>
                      {filteredRooms.length}
                    </Typography>
                    <Typography sx={{ fontFamily:fBody, fontSize:"0.7rem", color:T.accent }}>
                      Matching rooms
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              {/* ROOMS GRID */}
              <Grid item xs={12} md={9}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography sx={{ fontFamily:fBody, fontSize:"0.8rem", color:T.textMute }}>
                    Showing {filteredRooms.length} available space{filteredRooms.length !== 1 ? 's' : ''}
                  </Typography>
                </Box>

                {filteredRooms.length === 0 ? (
                  <Box sx={{ textAlign:"center", py:6 }}>
                    <MeetingRoom sx={{ fontSize:48, color:T.border, mb:2 }} />
                    <Typography sx={{ fontFamily:fBody, color:T.textMute }}>
                      No rooms match your criteria. Try adjusting filters.
                    </Typography>
                  </Box>
                ) : (
                  <Grid container spacing={2.5}>
                    {filteredRooms.map((room) => (
                      <Grid item xs={12} sm={6} lg={4} key={room.id}>
                        <SCard hover sx={{ overflow:"hidden", display:"flex", flexDirection:"column", height:"100%" }}>
                          {/* Room image placeholder */}
                          <Box sx={{ height:120, bgcolor:"#F1F5F9", display:"flex", alignItems:"center", justifyContent:"center", position:"relative", overflow:"hidden" }}>
                            <Box sx={{ display:"flex", alignItems:"center", justifyContent:"center", width:"100%", height:"100%" }}>
                              {room.features.includes('Video Conf') && (
                                <Box sx={{ position:"absolute", top:8, right:8, p:0.6, borderRadius:"8px", bgcolor:T.infoLight, color:T.info }}>
                                  <Videocam sx={{ fontSize:14 }} />
                                </Box>
                              )}
                              <MeetingRoom sx={{ fontSize:56, color:T.textMute }} />
                            </Box>
                            {room.status === 'Maintenance' && (
                              <Box sx={{ position:"absolute", inset:0, bgcolor:"rgba(0,0,0,.4)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                                <Typography sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.8rem", color:"#fff" }}>MAINTENANCE</Typography>
                              </Box>
                            )}
                          </Box>

                          {/* Room details */}
                          <Box p={2} sx={{ flex:1, display:"flex", flexDirection:"column" }}>
                            <Typography sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.95rem", color:T.text, mb:0.5 }}>
                              {room.name}
                            </Typography>
                            
                            <Box display="flex" alignItems="center" gap={1} mb={1}>
                              <LocationOn sx={{ fontSize:13, color:T.textMute }} />
                              <Typography sx={{ fontFamily:fBody, fontSize:"0.7rem", color:T.textMute }}>
                                Floor {room.floor} • {room.type}
                              </Typography>
                            </Box>

                            <Box display="flex" alignItems="center" gap={1} mb={1.5}>
                              <People sx={{ fontSize:13, color:T.textMute }} />
                              <Typography sx={{ fontFamily:fBody, fontSize:"0.7rem", color:T.textMute }}>
                                Capacity: {room.capacity} people
                              </Typography>
                            </Box>

                            {/* Features */}
                            <Box display="flex" gap={1} mb={1.5} flexWrap="wrap">
                              {room.features.map(f => (
                                <Box key={f} sx={{ px:1, py:0.3, borderRadius:"6px", bgcolor:T.accentLight, border:`1px solid ${T.accent}40` }}>
                                  <Typography sx={{ fontFamily:fBody, fontSize:"0.65rem", fontWeight:600, color:T.accent }}>
                                    {f}
                                  </Typography>
                                </Box>
                              ))}
                            </Box>

                            {/* Status */}
                            <Box mb={1.5}>
                              <StatusBadge status={room.status} />
                            </Box>

                            {/* Book button */}
                            <Button 
                              variant="contained" 
                              fullWidth 
                              disabled={room.status !== 'Available'}
                              onClick={() => { setSelectedRoomId(room.id); setOpenBooking(true); }}
                              sx={{
                                fontFamily:fBody, fontWeight:700, fontSize:"0.8rem", textTransform:"none",
                                borderRadius:"9px", py:1.1,
                                bgcolor:room.status !== 'Available' ? T.border : T.accent,
                                color:"#fff",
                                boxShadow:"none",
                                "&:hover":{ bgcolor:room.status !== 'Available' ? T.border : "#4F46E5", boxShadow:"none" },
                                "&.Mui-disabled":{ opacity:0.6 }
                              }}
                            >
                              {room.status === 'Available' ? 'Book Now' : 'Unavailable'}
                            </Button>
                          </Box>
                        </SCard>
                      </Grid>
                    ))}
                  </Grid>
                )}
              </Grid>
            </Grid>
          )}

          {/* ══════════════════════════════════════
              TAB 1: FLOOR PLAN
          ══════════════════════════════════════ */}
          {tabIndex === 1 && (
            <Box>
              <Typography sx={{ fontFamily:fHead, fontWeight:700, fontSize:"0.95rem", color:T.text, mb:2.5 }}>
                Campus Floor Layout
              </Typography>
              <Box sx={{ display:"flex", flexDirection:"column", gap:3 }}>
                {[1, 2].map(floor => (
                  <Box key={floor}>
                    <Box display="flex" alignItems="center" mb={2}>
                      <Box sx={{ p:0.8, borderRadius:"8px", bgcolor:T.accentLight, color:T.accent }}>
                        <DoorFront sx={{ fontSize:16 }} />
                      </Box>
                      <Typography sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.9rem", color:T.text }}>
                        Floor {floor}
                      </Typography>
                    </Box>

                    <Grid container spacing={2}>
                      {rooms.filter(r => r.floor === floor).map(room => (
                        <Grid item xs={6} sm={4} md={3} key={room.id}>
                          <Box 
                            sx={{ 
                              p:2, borderRadius:"10px", textAlign:"center", cursor:"pointer",
                              border:`1.5px solid ${room.status === 'Available' ? T.success : T.border}`,
                              bgcolor:room.status === 'Available' ? T.successLight : "#F9FAFB",
                              transition:"all 0.2s",
                              "&:hover":{ 
                                transform:"translateY(-2px)",
                                boxShadow:room.status === 'Available' ? `0 4px 12px ${T.success}20` : "none"
                              }
                            }}
                            onClick={() => { if(room.status === 'Available') { setSelectedRoomId(room.id); setOpenBooking(true); } }}
                          >
                            <Box sx={{ p:1, borderRadius:"8px", bgcolor:T.surface, mb:1, display:"inline-block" }}>
                              <MeetingRoom sx={{ fontSize:20, color:room.status === 'Available' ? T.success : T.textMute }} />
                            </Box>
                            <Typography sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.82rem", color:T.text, mb:0.4 }}>
                              {room.name}
                            </Typography>
                            <Typography sx={{ fontFamily:fBody, fontSize:"0.7rem", color:T.textMute, mb:0.8 }}>
                              Cap: {room.capacity}
                            </Typography>
                            <StatusBadge status={room.status} />
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                ))}
              </Box>

              {/* Legend */}
              <Box sx={{ mt:3, p:2, borderRadius:"10px", bgcolor:"#FAFBFD", border:`1px solid ${T.border}` }}>
                <Typography sx={{ fontFamily:fBody, fontSize:"0.75rem", fontWeight:700, color:T.textMute, mb:1.2, textTransform:"uppercase" }}>
                  Legend
                </Typography>
                <Box display="flex" gap={2} flexWrap="wrap">
                  {[
                    { label:"Available", color:T.success, bg:T.successLight },
                    { label:"Occupied", color:T.warning, bg:T.warningLight },
                    { label:"Maintenance", color:T.danger, bg:T.dangerLight },
                  ].map(l => (
                    <Box key={l.label} display="flex" alignItems="center" gap={0.8}>
                      <Box sx={{ width:12, height:12, borderRadius:"3px", bgcolor:l.bg, border:`1.5px solid ${l.color}` }} />
                      <Typography sx={{ fontFamily:fBody, fontSize:"0.75rem", color:T.textSub }}>{l.label}</Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Box>
          )}

          {/* ══════════════════════════════════════
              TAB 2: MY BOOKINGS
          ══════════════════════════════════════ */}
          {tabIndex === 2 && (
            <Stack spacing={2}>
              {bookings.filter(b => b.user === 'Self').length === 0 ? (
                <Box sx={{ textAlign:"center", py:6 }}>
                  <EventAvailable sx={{ fontSize:48, color:T.border, mb:2 }} />
                  <Typography sx={{ fontFamily:fBody, color:T.textMute }}>
                    No bookings yet. Start by exploring available rooms!
                  </Typography>
                </Box>
              ) : (
                bookings.filter(b => b.user === 'Self').map((booking) => (
                  <SCard key={booking.id} sx={{ p:2.5, border:`1px solid ${booking.status === 'Confirmed' ? T.success : booking.status === 'Pending' ? T.warning : T.danger}20` }} hover>
                    <Grid container alignItems="center" spacing={2}>
                      <Grid item xs={12} md={8}>
                        <Box display="flex" alignItems="flex-start" gap={2} mb={1}>
                          <Box sx={{ p:1, borderRadius:"8px", bgcolor:T.accentLight, color:T.accent, flexShrink:0 }}>
                            <MeetingRoom sx={{ fontSize:18 }} />
                          </Box>
                          <Box flex={1}>
                            <Typography sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.9rem", color:T.text, mb:0.5 }}>
                              {booking.purpose}
                            </Typography>
                            <Box display="flex" gap={2} flexWrap="wrap">
                              <Typography sx={{ fontFamily:fBody, fontSize:"0.75rem", color:T.textMute, display:"flex", alignItems:"center", gap:0.5 }}>
                                <MeetingRoom sx={{ fontSize:12 }} /> {booking.room}
                              </Typography>
                              <Typography sx={{ fontFamily:fBody, fontSize:"0.75rem", color:T.textMute, display:"flex", alignItems:"center", gap:0.5 }}>
                                <CalendarMonth sx={{ fontSize:12 }} /> {booking.date} @ {booking.slot}
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                      </Grid>
                      <Grid item xs={12} md={4} display="flex" justifyContent={{ xs:"flex-start", md:"flex-end" }} alignItems="center" gap={2}>
                        <StatusBadge status={booking.status} />
                        {booking.status !== 'Cancelled' && (
                          <Button size="small" variant="outlined" color="error" 
                            onClick={() => cancelBooking(booking.id)}
                            sx={{ fontFamily:fBody, fontWeight:600, fontSize:"0.75rem", textTransform:"none", borderRadius:"7px" }}>
                            Cancel
                          </Button>
                        )}
                      </Grid>
                    </Grid>
                  </SCard>
                ))
              )}
            </Stack>
          )}
        </Box>
      </SCard>

      {/* ══════════════════════════════════════
          BOOKING DIALOG
      ══════════════════════════════════════ */}
      <Dialog open={openBooking} onClose={() => setOpenBooking(false)} maxWidth="sm" fullWidth
        PaperProps={{ sx:{ borderRadius:"16px", border:`1px solid ${T.border}` } }}>
        <DialogTitle sx={{ fontFamily:fHead, fontWeight:700, borderBottom:`1px solid ${T.border}`, bgcolor:"#FAFBFD", pb:2 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography sx={{ fontFamily:fHead, fontWeight:700, fontSize:"0.98rem", color:T.text }}>
                Book Room: {rooms.find(r => r.id === selectedRoomId)?.name}
              </Typography>
              <Typography sx={{ fontFamily:fBody, fontSize:"0.7rem", color:T.textMute, mt:0.3 }}>
                Complete booking details below
              </Typography>
            </Box>
            <IconButton size="small" onClick={() => setOpenBooking(false)} sx={{ color:T.textMute }}>
              <Cancel />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent dividers sx={{ py:3 }}>
          {errorMsg && (
            <Alert severity="error" sx={{ mb:2, borderRadius:"9px", fontFamily:fBody }}>
              {errorMsg}
            </Alert>
          )}

          <Stack spacing={2}>
            {/* Date & Time row */}
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography sx={{ fontFamily:fBody, fontSize:"0.72rem", fontWeight:700, color:T.textMute, mb:0.6, textTransform:"uppercase" }}>
                  Date
                </Typography>
                <TextField 
                  type="date" fullWidth size="small"
                  value={bookingDetails.date}
                  onChange={(e) => setBookingDetails({...bookingDetails, date: e.target.value})}
                  InputLabelProps={{ shrink:true }}
                  sx={{
                    "& .MuiOutlinedInput-root":{ borderRadius:"8px", fontFamily:fBody,
                      "& fieldset":{ borderColor:T.border },
                      "&.Mui-focused fieldset":{ borderColor:T.accent } }
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <Typography sx={{ fontFamily:fBody, fontSize:"0.72rem", fontWeight:700, color:T.textMute, mb:0.6, textTransform:"uppercase" }}>
                  Time Slot
                </Typography>
                <TextField 
                  select fullWidth size="small"
                  value={bookingDetails.slot}
                  onChange={(e) => setBookingDetails({...bookingDetails, slot: e.target.value})}
                  sx={{
                    "& .MuiOutlinedInput-root":{ borderRadius:"8px", fontFamily:fBody,
                      "& fieldset":{ borderColor:T.border },
                      "&.Mui-focused fieldset":{ borderColor:T.accent } }
                  }}
                >
                  <MenuItem value="">Select slot</MenuItem>
                  <MenuItem value="09:00 - 10:00">09:00 - 10:00</MenuItem>
                  <MenuItem value="10:00 - 12:00">10:00 - 12:00</MenuItem>
                  <MenuItem value="14:00 - 16:00">14:00 - 16:00</MenuItem>
                </TextField>
              </Grid>
            </Grid>

            {/* Purpose */}
            <Box>
              <Typography sx={{ fontFamily:fBody, fontSize:"0.72rem", fontWeight:700, color:T.textMute, mb:0.6, textTransform:"uppercase" }}>
                Purpose of Booking
              </Typography>
              <TextField 
                label="" fullWidth size="small"
                placeholder="e.g., Faculty meeting, Department seminar, etc."
                value={bookingDetails.purpose}
                onChange={(e) => setBookingDetails({...bookingDetails, purpose: e.target.value})}
                sx={{
                  "& .MuiOutlinedInput-root":{ borderRadius:"8px", fontFamily:fBody,
                    "& fieldset":{ borderColor:T.border },
                    "&.Mui-focused fieldset":{ borderColor:T.accent } }
                }}
              />
            </Box>

            {/* Attendees */}
            <Box>
              <Typography sx={{ fontFamily:fBody, fontSize:"0.72rem", fontWeight:700, color:T.textMute, mb:0.6, textTransform:"uppercase" }}>
                Expected Attendees
              </Typography>
              <TextField 
                type="number" fullWidth size="small"
                placeholder="Number of people"
                value={bookingDetails.attendees}
                onChange={(e) => setBookingDetails({...bookingDetails, attendees: e.target.value})}
                sx={{
                  "& .MuiOutlinedInput-root":{ borderRadius:"8px", fontFamily:fBody,
                    "& fieldset":{ borderColor:T.border },
                    "&.Mui-focused fieldset":{ borderColor:T.accent } }
                }}
              />
            </Box>

            <Divider sx={{ borderColor:T.border }} />

            {/* Add-ons */}
            <Box>
              <Typography sx={{ fontFamily:fBody, fontSize:"0.75rem", fontWeight:700, color:T.text, mb:1.2 }}>
                Optional Add-ons
              </Typography>
              <Box display="flex" gap={1} flexWrap="wrap">
                <Box 
                  onClick={() => setBookingDetails({...bookingDetails, mics: !bookingDetails.mics})}
                  sx={{ 
                    p:1.5, borderRadius:"9px", cursor:"pointer", flex:1, minWidth:140,
                    border:`1.5px solid ${bookingDetails.mics ? T.accent : T.border}`,
                    bgcolor:bookingDetails.mics ? T.accentLight : T.surface,
                    transition:"all 0.2s"
                  }}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Box sx={{ p:0.6, borderRadius:"6px", bgcolor:bookingDetails.mics ? T.accent : T.border, color:"#fff", display:"flex", alignItems:"center", justifyContent:"center" }}>
                      <Mic sx={{ fontSize:14 }} />
                    </Box>
                    <Typography sx={{ fontFamily:fBody, fontWeight:600, fontSize:"0.78rem", color:bookingDetails.mics ? T.accent : T.textSub }}>
                      Extra Microphones
                    </Typography>
                  </Box>
                </Box>

                <Box 
                  onClick={() => setBookingDetails({...bookingDetails, catering: !bookingDetails.catering})}
                  sx={{ 
                    p:1.5, borderRadius:"9px", cursor:"pointer", flex:1, minWidth:140,
                    border:`1.5px solid ${bookingDetails.catering ? T.accent : T.border}`,
                    bgcolor:bookingDetails.catering ? T.accentLight : T.surface,
                    transition:"all 0.2s"
                  }}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Box sx={{ p:0.6, borderRadius:"6px", bgcolor:bookingDetails.catering ? T.accent : T.border, color:"#fff", display:"flex", alignItems:"center", justifyContent:"center" }}>
                      <Kitchen sx={{ fontSize:14 }} />
                    </Box>
                    <Typography sx={{ fontFamily:fBody, fontWeight:600, fontSize:"0.78rem", color:bookingDetails.catering ? T.accent : T.textSub }}>
                      Catering
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>

            {/* Info alert */}
            <Alert severity="info" icon={<Info sx={{ fontSize:16 }} />} sx={{ borderRadius:"9px", fontFamily:fBody, fontSize:"0.77rem", py:0.8 }}>
              Your request will be sent to the Room Admin for approval. You'll receive confirmation via email.
            </Alert>
          </Stack>
        </DialogContent>

        <DialogActions sx={{ px:3, pb:3, pt:2, bgcolor:"#FAFBFD", borderTop:`1px solid ${T.border}`, gap:1 }}>
          <Button onClick={() => setOpenBooking(false)} variant="outlined" size="small"
            sx={{ fontFamily:fBody, fontWeight:600, fontSize:"0.78rem", textTransform:"none", borderRadius:"8px", borderColor:T.border, color:T.textSub }}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleBookingSubmit} size="small"
            startIcon={<CheckCircle sx={{ fontSize:14 }} />}
            sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.78rem", textTransform:"none", borderRadius:"8px", bgcolor:T.accent, boxShadow:"none", "&:hover":{ bgcolor:"#4F46E5", boxShadow:"none" } }}>
            Submit Request
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RoomBookingView;