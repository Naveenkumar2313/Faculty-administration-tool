import React, { useState } from "react";
import { 
  Box, Card, Grid, Typography, Button, Table, TableBody, TableCell, 
  TableHead, TableRow, Chip, IconButton, Tooltip, Dialog, DialogTitle, 
  DialogContent, DialogActions, TextField, MenuItem, Switch, FormControlLabel,
  InputAdornment, Accordion, AccordionSummary, AccordionDetails, Divider
} from "@mui/material";
import { 
  Add, Edit, CloudUpload, OndemandVideo, Quiz, 
  NotificationsActive, History, ExpandMore, Difference,
  Visibility, CheckCircle
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";

const HiddenInput = styled('input')({ display: 'none' });

const PolicyManagementView = () => {
  // MOCK DATA
  const [policies, setPolicies] = useState([
    { id: 1, title: "Code of Ethics", category: "Ethics", version: 1.2, date: "2025-01-10", compliance: 94, status: "Active", quiz: true, video: false },
    { id: 2, title: "IT Security Guidelines", category: "IT", version: 2.0, date: "2026-02-01", compliance: 45, status: "Pending", quiz: true, video: true },
    { id: 3, title: "Research Integrity", category: "Research", version: 1.0, date: "2024-11-20", compliance: 100, status: "Active", quiz: false, video: true },
  ]);

  const [openDialog, setOpenDialog] = useState(false);
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  
  // FORM STATE
  const [currentPolicy, setCurrentPolicy] = useState({
    title: "", category: "", version: 1.0, deadline: 30,
    hasQuiz: false, hasVideo: false, videoUrl: "",
    file: null
  });

  // QUIZ STATE (Mock)
  const [quizQuestions, setQuizQuestions] = useState([{ q: "What is the primary rule?", options: ["A", "B"], correct: "A" }]);

  // ACTIONS
  const handleOpenAdd = () => {
    setIsUpdateMode(false);
    setCurrentPolicy({ title: "", category: "", version: 1.0, deadline: 30, hasQuiz: false, hasVideo: false, videoUrl: "" });
    setOpenDialog(true);
  };

  const handleOpenUpdate = (policy) => {
    setIsUpdateMode(true);
    setCurrentPolicy({ 
      ...policy, 
      version: (parseFloat(policy.version) + 0.1).toFixed(1), // Auto-increment
      file: null 
    });
    setOpenDialog(true);
  };

  const handleSave = () => {
    if (isUpdateMode) {
      // Mock Update Logic: Highlight changes & Reset Compliance
      const updated = policies.map(p => 
        p.id === currentPolicy.id 
          ? { ...currentPolicy, status: "Pending", compliance: 0, date: new Date().toISOString().split('T')[0] } 
          : p
      );
      setPolicies(updated);
    } else {
      // Add New
      setPolicies([...policies, { id: Date.now(), ...currentPolicy, status: "Pending", compliance: 0, date: new Date().toISOString().split('T')[0] }]);
    }
    setOpenDialog(false);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h5" fontWeight="bold">Policy Management</Typography>
          <Typography variant="body2" color="text.secondary">Create, Publish & Track Compliance</Typography>
        </Box>
        <Button variant="contained" color="primary" startIcon={<Add />} onClick={handleOpenAdd}>
          Add New Policy
        </Button>
      </Box>

      {/* POLICY LIST */}
      <Card>
        <Table>
          <TableHead sx={{ bgcolor: 'grey.100' }}>
            <TableRow>
              <TableCell>Policy Title</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Version</TableCell>
              <TableCell>Requirements</TableCell>
              <TableCell>Compliance</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {policies.map((row) => (
              <TableRow key={row.id}>
                <TableCell fontWeight="bold">{row.title}</TableCell>
                <TableCell><Chip label={row.category} size="small" variant="outlined" /></TableCell>
                <TableCell>v{row.version}</TableCell>
                <TableCell>
                  <Box display="flex" gap={1}>
                    {row.quiz && <Tooltip title="Quiz Required"><Quiz color="action" fontSize="small" /></Tooltip>}
                    {row.video && <Tooltip title="Video Training"><OndemandVideo color="action" fontSize="small" /></Tooltip>}
                    {!row.quiz && !row.video && <Typography variant="caption" color="text.secondary">Read Only</Typography>}
                  </Box>
                </TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="caption" fontWeight="bold" color={row.compliance < 50 ? "error" : "success"}>
                      {row.compliance}%
                    </Typography>
                    {row.compliance === 100 && <CheckCircle fontSize="small" color="success" />}
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip 
                    label={row.status} size="small" 
                    color={row.status === 'Active' ? 'success' : 'warning'} 
                  />
                </TableCell>
                <TableCell align="right">
                  <Tooltip title="Update / Revise">
                    <IconButton color="primary" onClick={() => handleOpenUpdate(row)}>
                      <Edit />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="View History">
                    <IconButton><History /></IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* ADD / UPDATE DIALOG */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {isUpdateMode ? `Update Policy: ${currentPolicy.title}` : "Create New Policy"}
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={3}>
            {/* LEFT COL: BASIC INFO */}
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="primary" mb={2}>1. Basic Information</Typography>
              <TextField 
                fullWidth label="Policy Title" size="small" sx={{ mb: 2 }}
                value={currentPolicy.title} 
                onChange={(e) => setCurrentPolicy({...currentPolicy, title: e.target.value})}
              />
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField 
                    select fullWidth label="Category" size="small"
                    value={currentPolicy.category}
                    onChange={(e) => setCurrentPolicy({...currentPolicy, category: e.target.value})}
                  >
                    <MenuItem value="Ethics">Ethics</MenuItem>
                    <MenuItem value="IT">IT & Security</MenuItem>
                    <MenuItem value="Research">Research</MenuItem>
                    <MenuItem value="HR">HR & Admin</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={6}>
                  <TextField 
                    fullWidth label="Version" size="small" disabled 
                    value={currentPolicy.version} 
                  />
                </Grid>
              </Grid>
              
              <Box mt={2} p={2} border="1px dashed grey" borderRadius={2} textAlign="center">
                <Button component="label" startIcon={<CloudUpload />}>
                  Upload Policy Document (PDF)
                  <HiddenInput type="file" accept="application/pdf" />
                </Button>
                {isUpdateMode && (
                  <Button size="small" color="secondary" startIcon={<Difference />} sx={{ mt: 1 }}>
                    Compare with Previous
                  </Button>
                )}
              </Box>
            </Grid>

            {/* RIGHT COL: COMPLIANCE SETTINGS */}
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="primary" mb={2}>2. Compliance Requirements</Typography>
              
              <TextField 
                type="number" fullWidth label="Compliance Deadline (Days)" size="small" sx={{ mb: 2 }}
                value={currentPolicy.deadline}
                onChange={(e) => setCurrentPolicy({...currentPolicy, deadline: e.target.value})}
              />

              <FormControlLabel 
                control={<Switch checked={currentPolicy.hasVideo} onChange={(e) => setCurrentPolicy({...currentPolicy, hasVideo: e.target.checked})} />} 
                label="Require Training Video" 
              />
              {currentPolicy.hasVideo && (
                <TextField 
                  fullWidth size="small" placeholder="Paste Video URL (YouTube/Vimeo)" sx={{ mt: 1, mb: 2 }}
                  value={currentPolicy.videoUrl}
                  onChange={(e) => setCurrentPolicy({...currentPolicy, videoUrl: e.target.value})}
                />
              )}

              <Divider sx={{ my: 1 }} />

              <FormControlLabel 
                control={<Switch checked={currentPolicy.hasQuiz} onChange={(e) => setCurrentPolicy({...currentPolicy, hasQuiz: e.target.checked})} />} 
                label="Require Assessment Quiz" 
              />
              {currentPolicy.hasQuiz && (
                <Accordion variant="outlined" sx={{ mt: 1 }}>
                  <AccordionSummary expandIcon={<ExpandMore />}>
                    <Typography variant="caption">Manage Quiz Questions ({quizQuestions.length})</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Button size="small" startIcon={<Add />}>Add Question</Button>
                  </AccordionDetails>
                </Accordion>
              )}
            </Grid>

            {isUpdateMode && (
              <Grid item xs={12}>
                <Box bgcolor="warning.light" p={1.5} borderRadius={1} display="flex" alignItems="center" gap={1}>
                  <NotificationsActive color="warning" />
                  <Typography variant="caption" fontWeight="bold">
                    Warning: Updating this policy will reset compliance status for all faculty. 
                    Automated email notifications will be sent immediately.
                  </Typography>
                </Box>
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleSave} variant="contained" color="primary">
            {isUpdateMode ? "Publish Update & Notify" : "Create Policy"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PolicyManagementView;