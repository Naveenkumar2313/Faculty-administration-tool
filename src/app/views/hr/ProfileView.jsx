import React, { useState } from "react";
import { 
  Box, Card, Grid, Avatar, Typography, Button, Tabs, Tab, TextField, 
  CircularProgress, Table, TableBody, TableCell, TableHead, TableRow, 
  Chip, Divider, Alert, Stack 
} from "@mui/material";
import { 
  LoadingButton, Timeline, TimelineItem, TimelineSeparator, 
  TimelineConnector, TimelineContent, TimelineDot, TimelineOppositeContent 
} from "@mui/lab";
import { 
  Edit, Cancel, Download, WorkspacePremium, CardMembership, 
  TrendingUp, TransferWithinAStation, School, VerifiedUser 
} from "@mui/icons-material";
import { Formik } from "formik";
import useFacultyProfile from "../../hooks/useFacultyProfile";

const ProfileView = () => {
  const { profile, loading, updateProfile } = useFacultyProfile();
  const [tabIndex, setTabIndex] = useState(0);
  const [isEditing, setIsEditing] = useState(false);

  // --- MOCK DATA FOR NEW FEATURES ---
  // (Ideally, these would come from the useFacultyProfile hook)
  const increments = [
    { year: "2023", month: "July", amount: "₹8,400", newBasic: "₹1,42,000", orderNo: "INC/23/005" },
    { year: "2022", month: "July", amount: "₹7,800", newBasic: "₹1,33,600", orderNo: "INC/22/112" },
  ];

  const transfers = [
    { date: "Aug 15, 2021", from: "CSE Dept, South Campus", to: "AI Dept, Main Campus", type: "Internal Transfer" },
    { date: "June 01, 2018", from: "IT Dept, City Campus", to: "CSE Dept, South Campus", type: "Promotion & Transfer" },
  ];

  const awards = [
    { title: "Best Researcher Award", year: "2022", authority: "University Research Council" },
    { title: "Excellence in Teaching", year: "2020", authority: "Department of CSE" },
  ];

  const memberships = [
    { org: "IEEE", id: "90823122", expiry: "2024-12-31", status: "Active" },
    { org: "ACM Professional", id: "3321120", expiry: "2023-11-30", status: "Expiring Soon" },
    { org: "ISTE Life Member", id: "LM-8821", expiry: "Lifetime", status: "Active" },
  ];

  const handleDownloadCertificate = () => {
    alert("Downloading Experience Certificate PDF...");
    // Logic to trigger backend PDF generation API would go here
  };

  if (loading) {
    return <Box display="flex" justifyContent="center" p={5}><CircularProgress /></Box>;
  }

  return (
    <Box sx={{ p: 4 }}>
      {/* 1. HEADER CARD WITH ACTIONS */}
      <Card sx={{ p: 4, mb: 3, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: 'center', gap: 4 }}>
        <Avatar src={profile.avatar} sx={{ width: 100, height: 100, border: '4px solid #fff', boxShadow: 2 }} />
        <Box flexGrow={1} textAlign={{ xs: 'center', md: 'left' }}>
          <Typography variant="h4" fontWeight="bold" color="primary.main">{profile.name}</Typography>
          <Typography variant="h6" color="text.secondary" gutterBottom>{profile.designation}</Typography>
          <Box display="flex" gap={1} flexWrap="wrap" justifyContent={{ xs: 'center', md: 'flex-start' }}>
            <Chip icon={<VerifiedUser />} label="Regular Employee" color="success" size="small" variant="outlined" />
            <Chip icon={<School />} label="Ph.D. Guide" color="primary" size="small" variant="outlined" />
          </Box>
        </Box>
        
        <Stack direction="column" spacing={2} minWidth={200}>
          <Button 
             variant="contained" 
             color="primary" 
             startIcon={<Download />}
             onClick={handleDownloadCertificate}
          >
            Exp. Certificate
          </Button>
          <Button 
            variant="outlined" 
            color={isEditing ? "error" : "secondary"}
            onClick={() => setIsEditing(!isEditing)}
            startIcon={isEditing ? <Cancel /> : <Edit />}
          >
            {isEditing ? "Cancel Edit" : "Edit Profile"}
          </Button>
        </Stack>
      </Card>

      {/* 2. MAIN TABS */}
      <Card sx={{ minHeight: 600 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabIndex} onChange={(e, v) => setTabIndex(v)} centered variant="fullWidth">
            <Tab label="Personal Details" />
            <Tab label="Service Record & History" />
            <Tab label="Professional & Achievements" />
          </Tabs>
        </Box>

        {/* TAB 0: PERSONAL DETAILS */}
        <Box role="tabpanel" hidden={tabIndex !== 0} p={4}>
          {tabIndex === 0 && (
            <Formik
              initialValues={{
                phone: profile.phone || '',
                address: profile.address || '',
                emergencyContact: profile.emergencyContact || ''
              }}
              onSubmit={async (values, { setSubmitting }) => {
                await updateProfile(values);
                setIsEditing(false);
                setSubmitting(false);
              }}
            >
              {({ values, handleChange, handleSubmit, isSubmitting }) => (
                <form onSubmit={handleSubmit}>
                  <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>Contact Information</Typography>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <TextField 
                         fullWidth label="Mobile Number" name="phone" 
                         value={values.phone} onChange={handleChange} 
                         disabled={!isEditing} variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField 
                         fullWidth label="Emergency Contact" name="emergencyContact" 
                         value={values.emergencyContact} onChange={handleChange} 
                         disabled={!isEditing} variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField 
                         fullWidth label="Residential Address" name="address" 
                         multiline rows={3}
                         value={values.address} onChange={handleChange} 
                         disabled={!isEditing} variant="outlined"
                      />
                    </Grid>
                    {isEditing && (
                      <Grid item xs={12} display="flex" justifyContent="flex-end">
                        <LoadingButton loading={isSubmitting} type="submit" variant="contained" size="large">
                          Save Changes
                        </LoadingButton>
                      </Grid>
                    )}
                  </Grid>
                </form>
              )}
            </Formik>
          )}
        </Box>

        {/* TAB 1: SERVICE RECORD (Timeline + Increments + Transfers) */}
        <Box role="tabpanel" hidden={tabIndex !== 1} p={0}>
          {tabIndex === 1 && (
            <Grid container>
              {/* Left Column: Promotion Timeline */}
              <Grid item xs={12} md={5} sx={{ borderRight: 1, borderColor: 'divider', p: 4 }}>
                <Typography variant="h6" gutterBottom display="flex" alignItems="center" gap={1}>
                  <TrendingUp color="primary" /> Promotion Timeline
                </Typography>
                <Timeline position="right">
                  {profile.serviceHistory?.map((item, index) => (
                    <TimelineItem key={index}>
                      <TimelineOppositeContent color="text.secondary" sx={{ flex: 0.3 }}>
                        {item.year}
                      </TimelineOppositeContent>
                      <TimelineSeparator>
                        <TimelineDot color={item.color || "primary"} />
                        {index < profile.serviceHistory.length - 1 && <TimelineConnector />}
                      </TimelineSeparator>
                      <TimelineContent>
                        <Typography variant="subtitle1" fontWeight="bold">{item.title}</Typography>
                        <Typography variant="body2" color="text.secondary">{item.description}</Typography>
                      </TimelineContent>
                    </TimelineItem>
                  ))}
                </Timeline>
              </Grid>

              {/* Right Column: Increments & Transfers */}
              <Grid item xs={12} md={7} sx={{ p: 4, bgcolor: 'grey.50' }}>
                
                {/* 1. Increment History */}
                <Box mb={5}>
                  <Typography variant="h6" gutterBottom display="flex" alignItems="center" gap={1}>
                     Annual Increment History
                  </Typography>
                  <Table size="small" sx={{ bgcolor: 'white', borderRadius: 2, overflow: 'hidden', boxShadow: 1 }}>
                    <TableHead sx={{ bgcolor: 'primary.light' }}>
                      <TableRow>
                        <TableCell sx={{ color: 'white' }}>Year</TableCell>
                        <TableCell sx={{ color: 'white' }}>Increment Amt</TableCell>
                        <TableCell sx={{ color: 'white' }}>New Basic</TableCell>
                        <TableCell sx={{ color: 'white' }}>Order No.</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {increments.map((row, i) => (
                        <TableRow key={i}>
                          <TableCell>{row.year}</TableCell>
                          <TableCell sx={{ color: 'success.main', fontWeight: 'bold' }}>+{row.amount}</TableCell>
                          <TableCell>{row.newBasic}</TableCell>
                          <TableCell sx={{ color: 'text.secondary', fontSize: '0.8rem' }}>{row.orderNo}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Box>

                {/* 2. Transfer History */}
                <Box>
                  <Typography variant="h6" gutterBottom display="flex" alignItems="center" gap={1}>
                    <TransferWithinAStation color="secondary" /> Transfer History
                  </Typography>
                  <Table size="small" sx={{ bgcolor: 'white', borderRadius: 2, overflow: 'hidden', boxShadow: 1 }}>
                    <TableHead sx={{ bgcolor: 'secondary.light' }}>
                      <TableRow>
                        <TableCell sx={{ color: 'white' }}>Date</TableCell>
                        <TableCell sx={{ color: 'white' }}>From</TableCell>
                        <TableCell sx={{ color: 'white' }}>To</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {transfers.map((row, i) => (
                        <TableRow key={i}>
                          <TableCell>{row.date}</TableCell>
                          <TableCell>{row.from}</TableCell>
                          <TableCell>{row.to}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Box>
              </Grid>
            </Grid>
          )}
        </Box>

        {/* TAB 2: PROFESSIONAL & ACHIEVEMENTS */}
        <Box role="tabpanel" hidden={tabIndex !== 2} p={4}>
          {tabIndex === 2 && (
            <Grid container spacing={4}>
              {/* Awards Section */}
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom display="flex" alignItems="center" gap={1}>
                  <WorkspacePremium color="warning" /> Awards & Recognitions
                </Typography>
                <Stack spacing={2}>
                  {awards.map((award, i) => (
                    <Card key={i} variant="outlined" sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                       <Avatar sx={{ bgcolor: 'warning.light', color: 'warning.dark' }}>
                         <WorkspacePremium />
                       </Avatar>
                       <Box>
                         <Typography variant="subtitle1" fontWeight="bold">{award.title}</Typography>
                         <Typography variant="body2" color="text.secondary">{award.authority} • {award.year}</Typography>
                       </Box>
                    </Card>
                  ))}
                </Stack>
              </Grid>

              {/* Memberships Section */}
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom display="flex" alignItems="center" gap={1}>
                  <CardMembership color="info" /> Professional Memberships
                </Typography>
                <Stack spacing={2}>
                  {memberships.map((mem, i) => (
                    <Card key={i} variant="outlined" sx={{ p: 2 }}>
                       <Box display="flex" justifyContent="space-between" alignItems="start">
                         <Box>
                           <Typography variant="subtitle1" fontWeight="bold">{mem.org}</Typography>
                           <Typography variant="body2" color="text.secondary">ID: {mem.id}</Typography>
                         </Box>
                         <Chip 
                           label={mem.status} 
                           size="small" 
                           color={mem.status === 'Active' ? 'success' : 'warning'} 
                           variant={mem.status === 'Active' ? 'filled' : 'outlined'} 
                         />
                       </Box>
                       <Typography variant="caption" display="block" mt={1} color="text.secondary">
                         Valid Till: {mem.expiry}
                       </Typography>
                    </Card>
                  ))}
                </Stack>
              </Grid>
            </Grid>
          )}
        </Box>
      </Card>
    </Box>
  );
};

export default ProfileView;