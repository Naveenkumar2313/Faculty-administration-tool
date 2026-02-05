import React, { useState } from "react";
import { 
  Box, Card, Grid, Typography, Button, TextField, List, ListItem, 
  ListItemText, ListItemIcon, Divider, Chip, IconButton, Dialog, 
  DialogTitle, DialogContent, DialogActions 
} from "@mui/material";
import { 
  Email, Edit, Visibility, Save, ContentCopy, 
  InsertDriveFile, Send 
} from "@mui/icons-material";

const EmailTemplatesView = () => {
  // MOCK DATA: TEMPLATES
  const [templates, setTemplates] = useState([
    { 
      id: "appt_letter", 
      name: "Appointment Letter", 
      subject: "Offer of Appointment - {{designation}}", 
      body: "Dear {{faculty_name}},\n\nWe are pleased to offer you the position of {{designation}} in the Department of {{department}}.\n\nYour joining date is {{joining_date}}.\n\nRegards,\nHR Department" 
    },
    { 
      id: "leave_approve", 
      name: "Leave Approval", 
      subject: "Leave Request Approved", 
      body: "Dear {{faculty_name}},\n\nYour leave request for {{leave_days}} days has been approved.\n\nRegards,\nAdmin" 
    },
    { 
      id: "salary_slip", 
      name: "Monthly Salary Slip", 
      subject: "Salary Slip for {{month_year}}", 
      body: "Dear {{faculty_name}},\n\nPlease find attached your salary slip for {{month_year}}.\n\nNet Payable: {{salary}}\n\nRegards,\nFinance Team" 
    },
    { 
      id: "increment", 
      name: "Annual Increment Letter", 
      subject: "Annual Increment Notification", 
      body: "Dear {{faculty_name}},\n\nWe are happy to inform you that your salary has been revised.\n\nNew Basic Pay: {{new_basic}}\nEffective Date: {{effective_date}}\n\nRegards,\nManagement" 
    },
  ]);

  const [selectedTemplate, setSelectedTemplate] = useState(templates[0]);
  const [openPreview, setOpenPreview] = useState(false);

  // AVAILABLE PLACEHOLDERS
  const placeholders = [
    "{{faculty_name}}", "{{designation}}", "{{department}}", 
    "{{salary}}", "{{joining_date}}", "{{leave_days}}", 
    "{{month_year}}", "{{new_basic}}"
  ];

  // ACTIONS
  const handleSelect = (template) => {
    setSelectedTemplate({ ...template }); // Clone to avoid direct mutation
  };

  const handleSave = () => {
    setTemplates(templates.map(t => t.id === selectedTemplate.id ? selectedTemplate : t));
    alert("Template saved successfully!");
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // Ideally show a snackbar here
  };

  // PREVIEW GENERATOR
  const getPreview = () => {
    let preview = selectedTemplate.body;
    // Mock replacements
    preview = preview.replace("{{faculty_name}}", "Dr. Sarah Smith");
    preview = preview.replace("{{designation}}", "Associate Professor");
    preview = preview.replace("{{department}}", "Computer Science");
    preview = preview.replace("{{joining_date}}", "01-June-2026");
    preview = preview.replace("{{leave_days}}", "3");
    preview = preview.replace("{{month_year}}", "February 2026");
    preview = preview.replace("{{salary}}", "₹1,42,000");
    preview = preview.replace("{{new_basic}}", "₹96,000");
    
    return preview;
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
        Email & Notification Templates
      </Typography>

      <Grid container spacing={3}>
        {/* LEFT: TEMPLATE LIST */}
        <Grid item xs={12} md={4}>
          <Card variant="outlined" sx={{ height: '100%', p: 0 }}>
            <Box p={2} bgcolor="grey.100" borderBottom="1px solid #ddd">
              <Typography variant="h6">Available Templates</Typography>
            </Box>
            <List component="nav">
              {templates.map((tmpl) => (
                <React.Fragment key={tmpl.id}>
                  <ListItem 
                    button 
                    selected={selectedTemplate.id === tmpl.id}
                    onClick={() => handleSelect(tmpl)}
                    sx={{ borderLeft: selectedTemplate.id === tmpl.id ? '4px solid #1976d2' : '4px solid transparent' }}
                  >
                    <ListItemIcon><InsertDriveFile color={selectedTemplate.id === tmpl.id ? "primary" : "action"} /></ListItemIcon>
                    <ListItemText primary={tmpl.name} />
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))}
            </List>
          </Card>
        </Grid>

        {/* RIGHT: EDITOR */}
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <Typography variant="h6" display="flex" alignItems="center" gap={1}>
                <Edit color="primary" /> Edit Template: {selectedTemplate.name}
              </Typography>
              <Box>
                <Button variant="outlined" startIcon={<Visibility />} sx={{ mr: 1 }} onClick={() => setOpenPreview(true)}>
                  Preview
                </Button>
                <Button variant="contained" startIcon={<Save />} onClick={handleSave}>
                  Save Changes
                </Button>
              </Box>
            </Box>

            <Box mb={3} p={2} bgcolor="primary.50" borderRadius={1} border="1px dashed #90caf9">
              <Typography variant="subtitle2" gutterBottom color="primary.main">Available Placeholders (Click to Copy)</Typography>
              <Box display="flex" flexWrap="wrap" gap={1}>
                {placeholders.map((ph) => (
                  <Chip 
                    key={ph} label={ph} size="small" onClick={() => copyToClipboard(ph)}
                    icon={<ContentCopy fontSize="small" />} clickable color="default" variant="outlined"
                    sx={{ bgcolor: 'white' }}
                  />
                ))}
              </Box>
            </Box>

            <TextField 
              fullWidth label="Email Subject Line" variant="outlined" sx={{ mb: 3 }}
              value={selectedTemplate.subject}
              onChange={(e) => setSelectedTemplate({...selectedTemplate, subject: e.target.value})}
            />

            <TextField 
              fullWidth label="Email Body Content" multiline rows={12} variant="outlined"
              value={selectedTemplate.body}
              onChange={(e) => setSelectedTemplate({...selectedTemplate, body: e.target.value})}
              helperText="Use placeholders to insert dynamic data automatically."
            />
          </Card>
        </Grid>
      </Grid>

      {/* PREVIEW DIALOG */}
      <Dialog open={openPreview} onClose={() => setOpenPreview(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Template Preview: {selectedTemplate.name}</DialogTitle>
        <DialogContent dividers>
          <Box mb={2}>
            <Typography variant="caption" color="textSecondary">Subject:</Typography>
            <Typography variant="subtitle1" fontWeight="bold">
              {selectedTemplate.subject.replace("{{designation}}", "Associate Professor").replace("{{month_year}}", "February 2026")}
            </Typography>
          </Box>
          <Divider sx={{ mb: 2 }} />
          <Box p={3} bgcolor="#f5f5f5" borderRadius={1} sx={{ whiteSpace: 'pre-line' }}>
            <Typography variant="body1">{getPreview()}</Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPreview(false)}>Close</Button>
          <Button variant="contained" endIcon={<Send />}>Send Test Email</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EmailTemplatesView;