import React, { useState } from "react";
import { Box, Card, Grid, Avatar, Typography, Button, Tabs, Tab, TextField, CircularProgress } from "@mui/material";
import { LoadingButton, Timeline, TimelineItem, TimelineSeparator, TimelineConnector, TimelineContent, TimelineDot, TimelineOppositeContent } from "@mui/lab";
import { Edit, Save, Cancel, VerifiedUser, Work, School } from "@mui/icons-material";
import { Formik } from "formik";
import * as yup from "yup";

// Import your new hook
import useFacultyProfile from "../../hooks/useFacultyProfile";

// Helper to map string icon names to components (since JSON data can't hold React components)
const getIcon = (iconName) => {
  // Simple mapping logic
  return <VerifiedUser />; // Default for now
};

const ProfileView = () => {
  // 1. USE THE HOOK
  const { profile, loading, updateProfile } = useFacultyProfile();
  
  const [tabIndex, setTabIndex] = useState(0);
  const [isEditing, setIsEditing] = useState(false);

  // 2. HANDLE LOADING STATE
  if (loading) {
    return <Box display="flex" justifyContent="center" p={5}><CircularProgress /></Box>;
  }

  // 3. RENDER UI (using 'profile' object from hook)
  return (
    <Box sx={{ p: 4 }}>
      {/* HEADER */}
      <Card sx={{ p: 4, mb: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
        <Avatar src={profile.avatar} sx={{ width: 100, height: 100 }} />
        <Box flexGrow={1}>
          <Typography variant="h4">{profile.name}</Typography>
          <Typography variant="h6">{profile.designation}</Typography>
        </Box>
        <Button 
          variant="contained" 
          onClick={() => setIsEditing(!isEditing)}
          startIcon={isEditing ? <Cancel /> : <Edit />}
        >
          {isEditing ? "Cancel" : "Edit"}
        </Button>
      </Card>

      {/* TABS */}
      <Tabs value={tabIndex} onChange={(e, v) => setTabIndex(v)} sx={{ mb: 3 }}>
        <Tab label="Personal Details" />
        <Tab label="Service History" />
      </Tabs>

      {/* TAB 1: FORM */}
      {tabIndex === 0 && (
        <Card sx={{ p: 4 }}>
          <Formik
            initialValues={{
              phone: profile.phone,
              address: profile.address,
              emergencyContact: profile.emergencyContact
            }}
            onSubmit={async (values, { setSubmitting }) => {
              // CALL THE HOOK FUNCTION, NOT MOCK LOGIC
              await updateProfile(values);
              setIsEditing(false);
              setSubmitting(false);
            }}
          >
            {({ values, handleChange, handleSubmit, isSubmitting }) => (
              <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextField 
                       fullWidth label="Phone" name="phone" 
                       value={values.phone} onChange={handleChange} 
                       disabled={!isEditing} 
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField 
                       fullWidth label="Address" name="address" 
                       value={values.address} onChange={handleChange} 
                       disabled={!isEditing} 
                    />
                  </Grid>
                  {isEditing && (
                    <Grid item xs={12}>
                      <LoadingButton loading={isSubmitting} type="submit" variant="contained">
                        Save Changes
                      </LoadingButton>
                    </Grid>
                  )}
                </Grid>
              </form>
            )}
          </Formik>
        </Card>
      )}

      {/* TAB 2: TIMELINE */}
      {tabIndex === 1 && (
        <Card sx={{ p: 4 }}>
          <Timeline position="alternate">
            {profile.serviceHistory.map((item, index) => (
              <TimelineItem key={index}>
                <TimelineOppositeContent>{item.year}</TimelineOppositeContent>
                <TimelineSeparator>
                  <TimelineDot color={item.color} />
                  {index < profile.serviceHistory.length - 1 && <TimelineConnector />}
                </TimelineSeparator>
                <TimelineContent>
                  <Typography variant="h6">{item.title}</Typography>
                  <Typography>{item.description}</Typography>
                </TimelineContent>
              </TimelineItem>
            ))}
          </Timeline>
        </Card>
      )}
    </Box>
  );
};

export default ProfileView;