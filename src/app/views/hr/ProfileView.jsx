import React, { useState } from "react";
import { 
  Box, Card, Grid, Avatar, Typography, Button, Tabs, Tab, TextField, 
  CircularProgress, Table, TableBody, TableCell, TableHead, TableRow, 
  Chip, Divider, Stack, IconButton, Paper, useTheme, Fade
} from "@mui/material";
import { 
  LoadingButton, Timeline, TimelineItem, TimelineSeparator, 
  TimelineConnector, TimelineContent, TimelineDot, TimelineOppositeContent 
} from "@mui/lab";
import { 
  Edit, Save, Download, WorkspacePremium, CardMembership, 
  TrendingUp, TransferWithinAStation, School, VerifiedUser,
  Email, Phone, LocationOn, CalendarMonth, Badge, CameraAlt
} from "@mui/icons-material";
import { Formik } from "formik";
import { styled } from "@mui/material/styles";
import useFacultyProfile from "../../hooks/useFacultyProfile";

// --- Styled Components ---
const CoverImage = styled(Box)(({ theme }) => ({
  height: 160,
  background: `linear-gradient(120deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
  borderRadius: "16px 16px 0 0",
  position: "relative",
}));

const ProfileAvatar = styled(Avatar)(({ theme }) => ({
  width: 130,
  height: 130,
  border: "4px solid #fff",
  boxShadow: theme.shadows[3],
  position: "absolute",
  bottom: -65,
  left: 32,
  [theme.breakpoints.down("sm")]: {
    left: "50%",
    transform: "translateX(-50%)",
  }
}));

const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: 20,
  textTransform: 'none',
  fontWeight: 600,
  boxShadow: 'none',
  '&:hover': {
    boxShadow: theme.shadows[2],
  }
}));

const InfoCard = styled(Card)(({ theme }) => ({
  borderRadius: 16,
  boxShadow: '0 4px 20px 0 rgba(0,0,0,0.05)',
  border: '1px solid rgba(0,0,0,0.08)',
  height: '100%'
}));

const StyledTab = styled(Tab)({
  textTransform: 'none', 
  fontWeight: 600, 
  fontSize: '1rem',
  minHeight: 56,
});

const ProfileView = () => {
  const theme = useTheme();
  const { profile, loading, updateProfile } = useFacultyProfile();
  const [tabIndex, setTabIndex] = useState(0);
  const [isEditing, setIsEditing] = useState(false);

  // --- MOCK DATA ---
  const increments = [
    { year: "2023", month: "July", amount: "₹8,400", newBasic: "₹1,42,000", orderNo: "INC/23/005" },
    { year: "2022", month: "July", amount: "₹7,800", newBasic: "₹1,33,600", orderNo: "INC/22/112" },
    { year: "2021", month: "July", amount: "₹7,200", newBasic: "₹1,25,800", orderNo: "INC/21/098" },
  ];

  const transfers = [
    { date: "Aug 15, 2021", from: "CSE Dept, South Campus", to: "AI Dept, Main Campus", type: "Internal Transfer" },
    { date: "June 01, 2018", from: "IT Dept, City Campus", to: "CSE Dept, South Campus", type: "Promotion & Transfer" },
  ];

  const awards = [
    { title: "Best Researcher Award", year: "2022", authority: "University Research Council", icon: <WorkspacePremium sx={{fontSize: 40, color: '#FFD700'}}/> },
    { title: "Excellence in Teaching", year: "2020", authority: "Department of CSE", icon: <School sx={{fontSize: 40, color: theme.palette.primary.main}}/> },
  ];

  const memberships = [
    { org: "IEEE Senior Member", id: "90823122", expiry: "Dec 2024", status: "Active", color: "success" },
    { org: "ACM Professional", id: "3321120", expiry: "Nov 2023", status: "Expiring", color: "warning" },
    { org: "ISTE Life Member", id: "LM-8821", expiry: "Lifetime", status: "Active", color: "info" },
  ];

  const handleDownloadCertificate = () => {
    alert("Downloading Experience Certificate PDF...");
  };

  if (loading) {
    return <Box display="flex" justifyContent="center" p={5}><CircularProgress /></Box>;
  }

  return (
    <Box sx={{ p: 3, maxWidth: 1600, margin: '0 auto' }}>
      
      {/* 1. HERO HEADER */}
      <Paper elevation={0} sx={{ borderRadius: 4, mb: 4, bgcolor: 'transparent' }}>
        <CoverImage>
           <Box position="absolute" right={20} bottom={20}>
              <IconButton sx={{ color: 'white', bgcolor: 'rgba(0,0,0,0.3)', '&:hover': { bgcolor: 'rgba(0,0,0,0.5)' } }}>
                <CameraAlt />
              </IconButton>
           </Box>
        </CoverImage>
        <Box sx={{ position: 'relative', pt: { xs: 9, sm: 2 }, pb: 2, px: 4, bgcolor: 'white', borderRadius: "0 0 16px 16px", boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
          <ProfileAvatar src={profile.avatar} />
          
          <Box sx={{ ml: { sm: 18 }, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'center', md: 'flex-start' }, textAlign: { xs: 'center', md: 'left' } }}>
            <Box>
              <Typography variant="h4" fontWeight="800" color="text.primary">{profile.name}</Typography>
              <Typography variant="h6" color="text.secondary" fontWeight="500">{profile.designation} • Dept. of Computer Science</Typography>
              <Stack direction="row" spacing={1} mt={1} justifyContent={{ xs: 'center', md: 'flex-start' }}>
                <Chip icon={<VerifiedUser fontSize="small" />} label="Regular Employee" color="success" size="small" variant="filled" sx={{ borderRadius: 1 }} />
                <Chip icon={<School fontSize="small" />} label="Ph.D. Guide" color="primary" size="small" variant="filled" sx={{ borderRadius: 1 }} />
                <Chip label="Grade 13A" size="small" sx={{ borderRadius: 1, bgcolor: 'grey.100' }} />
              </Stack>
            </Box>
            
            <Stack direction="row" spacing={2} mt={{ xs: 3, md: 0 }}>
              <ActionButton 
                variant="outlined" 
                color="inherit" 
                startIcon={<Download />}
                onClick={handleDownloadCertificate}
              >
                Service Cert.
              </ActionButton>
              <ActionButton 
                variant="contained" 
                color="primary"
                onClick={() => setIsEditing(!isEditing)}
                startIcon={isEditing ? <Save /> : <Edit />}
              >
                {isEditing ? "Save Changes" : "Edit Profile"}
              </ActionButton>
            </Stack>
          </Box>
        </Box>
      </Paper>

      <Grid container spacing={3}>
        {/* 2. LEFT SIDEBAR - PERSONAL INFO */}
        <Grid item xs={12} md={4} lg={3}>
          <Stack spacing={3}>
            {/* Quick Contact Card */}
            <InfoCard>
              <Box p={3}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>Personal Details</Typography>
                <Formik
                  initialValues={{
                    phone: profile.phone || '',
                    email: 'naveen.kumar@univ.edu', // Mock
                    address: profile.address || '',
                    emergencyContact: profile.emergencyContact || ''
                  }}
                  onSubmit={async (values) => {
                    await updateProfile(values);
                    setIsEditing(false);
                  }}
                >
                  {({ values, handleChange, handleSubmit }) => (
                    <Stack spacing={2.5} mt={2}>
                      <Box display="flex" gap={2}>
                        <Email color="action" />
                        <Box>
                          <Typography variant="caption" color="text.secondary">Official Email</Typography>
                          <Typography variant="body2" fontWeight="500">{values.email}</Typography>
                        </Box>
                      </Box>
                      
                      <Box display="flex" gap={2}>
                        <Phone color="action" />
                        <Box width="100%">
                          <Typography variant="caption" color="text.secondary">Mobile</Typography>
                          {isEditing ? (
                            <TextField fullWidth size="small" name="phone" value={values.phone} onChange={handleChange} variant="standard" />
                          ) : (
                            <Typography variant="body2" fontWeight="500">{values.phone}</Typography>
                          )}
                        </Box>
                      </Box>

                      <Box display="flex" gap={2}>
                        <LocationOn color="action" />
                        <Box width="100%">
                          <Typography variant="caption" color="text.secondary">Residence</Typography>
                          {isEditing ? (
                            <TextField fullWidth multiline maxRows={3} name="address" value={values.address} onChange={handleChange} variant="standard" />
                          ) : (
                            <Typography variant="body2" fontWeight="500">{values.address}</Typography>
                          )}
                        </Box>
                      </Box>

                      <Box display="flex" gap={2}>
                        <Badge color="action" />
                        <Box width="100%">
                          <Typography variant="caption" color="text.secondary">Emergency Contact</Typography>
                          {isEditing ? (
                            <TextField fullWidth size="small" name="emergencyContact" value={values.emergencyContact} onChange={handleChange} variant="standard" />
                          ) : (
                            <Typography variant="body2" fontWeight="500">{values.emergencyContact}</Typography>
                          )}
                        </Box>
                      </Box>
                      
                      {isEditing && (
                        <Button fullWidth variant="contained" onClick={handleSubmit}>Update Details</Button>
                      )}
                    </Stack>
                  )}
                </Formik>
              </Box>
            </InfoCard>

            {/* Quick Stats Widget */}
            <InfoCard sx={{ bgcolor: 'primary.dark', color: 'white' }}>
              <Box p={3}>
                <Typography variant="subtitle2" sx={{ opacity: 0.8 }} gutterBottom>TOTAL SERVICE</Typography>
                <Typography variant="h3" fontWeight="bold">12 <span style={{fontSize: '1rem'}}>Years</span></Typography>
                <Divider sx={{ bgcolor: 'rgba(255,255,255,0.2)', my: 2 }} />
                <Grid container>
                  <Grid item xs={6}>
                    <Typography variant="h5" fontWeight="bold">4</Typography>
                    <Typography variant="caption" sx={{ opacity: 0.8 }}>Promotions</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="h5" fontWeight="bold">2</Typography>
                    <Typography variant="caption" sx={{ opacity: 0.8 }}>Transfers</Typography>
                  </Grid>
                </Grid>
              </Box>
            </InfoCard>
          </Stack>
        </Grid>

        {/* 3. MAIN CONTENT - TABS */}
        <Grid item xs={12} md={8} lg={9}>
          <InfoCard sx={{ overflow: 'hidden' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'grey.50' }}>
              <Tabs 
                value={tabIndex} 
                onChange={(e, v) => setTabIndex(v)} 
                variant="scrollable"
                scrollButtons="auto"
                sx={{ '& .MuiTab-root': { px: 4 } }}
              >
                <StyledTab label="Career Timeline" />
                <StyledTab label="Salary & Increments" />
                <StyledTab label="Professional Portfolio" />
              </Tabs>
            </Box>

            {/* TAB 0: TIMELINE */}
            <Fade in={tabIndex === 0}>
              <Box p={4} role="tabpanel" hidden={tabIndex !== 0}>
                {tabIndex === 0 && (
                  <Grid container spacing={4}>
                    <Grid item xs={12} md={7}>
                      <Typography variant="h6" fontWeight="bold" mb={3} display="flex" alignItems="center" gap={1}>
                        <TrendingUp color="primary" /> Promotion & Role History
                      </Typography>
                      <Timeline position="right" sx={{ p: 0, m: 0 }}>
                        {profile.serviceHistory?.map((item, index) => (
                          <TimelineItem key={index}>
                            <TimelineOppositeContent color="text.secondary" sx={{ flex: 0.2, pt: 0.5, fontWeight: 'bold' }}>
                              {item.year}
                            </TimelineOppositeContent>
                            <TimelineSeparator>
                              <TimelineDot color={index === 0 ? "primary" : "grey"} variant={index === 0 ? "filled" : "outlined"} />
                              {index < profile.serviceHistory.length - 1 && <TimelineConnector />}
                            </TimelineSeparator>
                            <TimelineContent sx={{ pt: 0, pb: 3 }}>
                              <Paper elevation={0} variant="outlined" sx={{ p: 2, bgcolor: index === 0 ? 'primary.50' : 'white' }}>
                                <Typography variant="subtitle1" fontWeight="bold">{item.title}</Typography>
                                <Typography variant="body2" color="text.secondary">{item.description}</Typography>
                              </Paper>
                            </TimelineContent>
                          </TimelineItem>
                        ))}
                      </Timeline>
                    </Grid>
                    
                    <Grid item xs={12} md={5}>
                      <Typography variant="h6" fontWeight="bold" mb={3} display="flex" alignItems="center" gap={1}>
                        <TransferWithinAStation color="secondary" /> Transfer Log
                      </Typography>
                      <Stack spacing={2}>
                        {transfers.map((t, i) => (
                          <Paper key={i} variant="outlined" sx={{ p: 2, borderLeft: '4px solid #9c27b0' }}>
                             <Box display="flex" justifyContent="space-between" mb={1}>
                               <Typography variant="caption" fontWeight="bold" color="secondary">{t.type}</Typography>
                               <Typography variant="caption" color="text.secondary">{t.date}</Typography>
                             </Box>
                             <Typography variant="body2"><strong>From:</strong> {t.from}</Typography>
                             <Typography variant="body2"><strong>To:</strong> {t.to}</Typography>
                          </Paper>
                        ))}
                      </Stack>
                    </Grid>
                  </Grid>
                )}
              </Box>
            </Fade>

            {/* TAB 1: INCREMENTS */}
            <Fade in={tabIndex === 1}>
              <Box p={0} role="tabpanel" hidden={tabIndex !== 1}>
                {tabIndex === 1 && (
                  <Box>
                    <Box p={3} bgcolor="success.50" display="flex" justifyContent="space-between" alignItems="center">
                       <Box>
                         <Typography variant="subtitle1" fontWeight="bold" color="success.800">Current Basic Pay</Typography>
                         <Typography variant="h4" fontWeight="800" color="success.900">₹1,42,000</Typography>
                       </Box>
                       <CalendarMonth sx={{ fontSize: 60, opacity: 0.2, color: 'success.main' }} />
                    </Box>
                    <Table>
                      <TableHead sx={{ bgcolor: 'grey.100' }}>
                        <TableRow>
                          <TableCell>Effective Date</TableCell>
                          <TableCell>Order Number</TableCell>
                          <TableCell>Increment Amount</TableCell>
                          <TableCell>New Basic Pay</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {increments.map((row, i) => (
                          <TableRow key={i} hover>
                            <TableCell sx={{ fontWeight: 'bold' }}>{row.month} {row.year}</TableCell>
                            <TableCell>{row.orderNo}</TableCell>
                            <TableCell sx={{ color: 'success.main', fontWeight: 'bold' }}>+{row.amount}</TableCell>
                            <TableCell>{row.newBasic}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Box>
                )}
              </Box>
            </Fade>

            {/* TAB 2: ACHIEVEMENTS */}
            <Fade in={tabIndex === 2}>
              <Box p={4} role="tabpanel" hidden={tabIndex !== 2}>
                {tabIndex === 2 && (
                  <Grid container spacing={4}>
                    {/* Awards */}
                    <Grid item xs={12}>
                      <Typography variant="h6" gutterBottom fontWeight="bold">Awards & Honors</Typography>
                      <Grid container spacing={2}>
                        {awards.map((award, i) => (
                          <Grid item xs={12} sm={6} key={i}>
                            <Card variant="outlined" sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2, transition: '0.3s', '&:hover': { borderColor: theme.palette.primary.main, boxShadow: theme.shadows[2] } }}>
                               <Box sx={{ p: 1, bgcolor: 'grey.50', borderRadius: 2 }}>
                                 {award.icon}
                               </Box>
                               <Box>
                                 <Typography variant="subtitle1" fontWeight="bold">{award.title}</Typography>
                                 <Typography variant="body2" color="text.secondary">{award.authority} • {award.year}</Typography>
                               </Box>
                            </Card>
                          </Grid>
                        ))}
                      </Grid>
                    </Grid>

                    <Grid item xs={12}><Divider /></Grid>

                    {/* Memberships */}
                    <Grid item xs={12}>
                      <Typography variant="h6" gutterBottom fontWeight="bold">Professional Memberships</Typography>
                      <Grid container spacing={2}>
                        {memberships.map((mem, i) => (
                          <Grid item xs={12} sm={6} md={4} key={i}>
                            <Card variant="outlined" sx={{ p: 2, position: 'relative', overflow: 'hidden' }}>
                               <Box sx={{ position: 'absolute', top: 0, left: 0, width: 4, height: '100%', bgcolor: `${mem.color}.main` }} />
                               <Stack direction="row" justifyContent="space-between" mb={1}>
                                  <CardMembership color="action" />
                                  <Chip label={mem.status} size="small" color={mem.color} variant="filled" sx={{ height: 20, fontSize: 10 }} />
                               </Stack>
                               <Typography variant="subtitle2" fontWeight="bold">{mem.org}</Typography>
                               <Typography variant="caption" display="block" color="text.secondary">ID: {mem.id}</Typography>
                               <Typography variant="caption" fontWeight="medium" sx={{ mt: 1, display: 'block' }}>Valid Till: {mem.expiry}</Typography>
                            </Card>
                          </Grid>
                        ))}
                      </Grid>
                    </Grid>
                  </Grid>
                )}
              </Box>
            </Fade>
          </InfoCard>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProfileView;