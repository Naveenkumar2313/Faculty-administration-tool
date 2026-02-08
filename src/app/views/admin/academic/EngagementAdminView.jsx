import React, { useState } from "react";
import { 
  Box, Card, Grid, Typography, Button, Table, TableBody, TableCell, 
  TableHead, TableRow, Chip, IconButton, Tooltip, Dialog, DialogTitle, 
  DialogContent, DialogActions, TextField, MenuItem, Tabs, Tab, 
  LinearProgress, List, ListItem, ListItemText, ListItemIcon, Divider,
  Avatar, Stepper, Step, StepLabel, InputAdornment
} from "@mui/material";
import { 
  Handshake, School, Description, CheckCircle, Cancel, 
  Visibility, Print, FlightTakeoff, Engineering, Business, 
  Lightbulb, ReceiptLong, Payment, Feedback, AccessTime,
  AttachFile, Add, History, EmojiEvents
} from "@mui/icons-material";

const EngagementAdminView = () => {
  const [tabIndex, setTabIndex] = useState(0);

  // --- MOCK DATA ---

  // 1. CONSULTANCY
  const [consultancyList, setConsultancyList] = useState([
    { 
      id: "CON-001", faculty: "Dr. Sarah Smith", client: "TechCorp Solutions", 
      title: "AI Optimization Engine", revenue: 500000, status: "Active", 
      progress: 60, milestones: [
        { name: "Requirement Analysis", status: "Completed", invoice: "INV-001" },
        { name: "Prototype Dev", status: "In Progress", invoice: "Pending" },
        { name: "Final Deployment", status: "Pending", invoice: "Pending" }
      ],
      ipRights: "Joint Ownership"
    },
    { 
      id: "CON-002", faculty: "Prof. Rajan Kumar", client: "City Municipal Corp", 
      title: "Structural Audit Bridge A", revenue: 200000, status: "Completed", 
      progress: 100, milestones: [
        { name: "Site Visit", status: "Completed", invoice: "INV-010" },
        { name: "Report Submission", status: "Completed", invoice: "INV-011" }
      ],
      ipRights: "Client Owned"
    },
  ]);

  // 2. GUEST LECTURES
  const [guestLectures, setGuestLectures] = useState([
    { 
      id: 101, faculty: "Dr. Emily Davis", speaker: "Mr. John Doe (Google)", 
      topic: "Cloud Computing Trends", date: "2026-02-10", 
      status: "Completed", feedback: 4.8, honorarium: 5000, 
      paid: true, certGenerated: true 
    },
    { 
      id: 102, faculty: "Dr. A. Verma", speaker: "Ms. Priya S (StartUp Inc)", 
      topic: "Entrepreneurship 101", date: "2026-03-05", 
      status: "Planned", feedback: 0, honorarium: 3000, 
      paid: false, certGenerated: false 
    },
  ]);

  // 3. EXTERNAL EXAMINER
  const [examiners, setExaminers] = useState([
    { 
      id: "EXT-501", internal: "Dr. A. Verma", external: "Prof. K. Rao (IITM)", 
      subject: "Advanced DSP", date: "2026-04-15", 
      status: "QP Received", steps: 1, // 0: Assigned, 1: QP Received, 2: Evaluated, 3: Paid
      remuneration: 4500, travelClaim: 1200 
    }
  ]);

  // 4. MoUs
  const [mous, setMous] = useState([
    { 
      id: "MOU-01", partner: "Oracle University", type: "Academic", 
      validTill: "2027-12-31", active: true, activities: 5,
      lastActivity: "Student Certification Drive - Jan 2026"
    },
    { 
      id: "MOU-02", partner: "L&T Construction", type: "Industry", 
      validTill: "2025-06-30", active: true, activities: 2,
      lastActivity: "Site Visit - Dec 2025"
    }
  ]);

  // 5. PATENTS
  const [patents, setPatents] = useState([
    {
      id: "PAT-99", title: "Smart Irrigation Sensor", inventors: "Dr. Sarah Smith, Mr. Student A",
      appNumber: "2026/IND/5544", status: "Published", filingDate: "2025-08-10",
      cost: 25000, commercialized: "Negotiating"
    }
  ]);

  // --- DIALOG STATES ---
  const [openConsultancyDialog, setOpenConsultancyDialog] = useState(false);
  const [selectedConsultancy, setSelectedConsultancy] = useState(null);
  
  const [openLectureDialog, setOpenLectureDialog] = useState(false);
  const [selectedLecture, setSelectedLecture] = useState(null);

  const [openExaminerDialog, setOpenExaminerDialog] = useState(false);
  const [selectedExaminer, setSelectedExaminer] = useState(null);

  const handleTabChange = (event, newValue) => setTabIndex(newValue);

  // --- ACTIONS ---

  const handleInvoiceGen = (milestoneIndex) => {
    // Logic to generate invoice
    alert("Invoice Generated for Milestone!");
  };

  const handleGenerateCert = () => {
    alert("Certificate Generated & Emailed to Guest Speaker");
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
        External Engagement & Impact
      </Typography>

      <Card sx={{ minHeight: 600 }}>
        <Tabs 
          value={tabIndex} 
          onChange={handleTabChange} 
          variant="scrollable"
          scrollButtons="auto"
          sx={{ borderBottom: 1, borderColor: 'divider', px: 2, bgcolor: 'background.paper' }}
        >
          <Tab icon={<Engineering />} iconPosition="start" label="Consultancy Projects" />
          <Tab icon={<School />} iconPosition="start" label="Guest Lectures" />
          <Tab icon={<AssignmentIndIcon />} iconPosition="start" label="External Examiners" />
          <Tab icon={<Handshake />} iconPosition="start" label="MoUs & Collaborations" />
          <Tab icon={<Lightbulb />} iconPosition="start" label="Patents & IP" />
        </Tabs>

        <Box sx={{ p: 3 }}>
          {/* =================================================================
              TAB 1: CONSULTANCY
          ================================================================= */}
          {tabIndex === 0 && (
            <Box>
              <Box display="flex" justifyContent="space-between" mb={3}>
                <Typography variant="h6">Active Consultancy Projects</Typography>
                <Button variant="contained" startIcon={<Add />}>New Proposal</Button>
              </Box>
              <Table>
                <TableHead sx={{ bgcolor: 'grey.100' }}>
                  <TableRow>
                    <TableCell>Project Details</TableCell>
                    <TableCell>Faculty Lead</TableCell>
                    <TableCell>Revenue</TableCell>
                    <TableCell>Progress</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {consultancyList.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell>
                        <Typography variant="subtitle2" fontWeight="bold">{row.title}</Typography>
                        <Typography variant="caption" color="textSecondary">Client: {row.client}</Typography>
                      </TableCell>
                      <TableCell>{row.faculty}</TableCell>
                      <TableCell>₹{row.revenue.toLocaleString()}</TableCell>
                      <TableCell sx={{ width: 150 }}>
                        <Box display="flex" alignItems="center" gap={1}>
                          <LinearProgress variant="determinate" value={row.progress} sx={{ flex: 1, height: 6, borderRadius: 3 }} />
                          <Typography variant="caption">{row.progress}%</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                         <Chip label={row.status} size="small" color={row.status === 'Completed' ? 'success' : 'primary'} />
                      </TableCell>
                      <TableCell align="right">
                        <Button 
                           size="small" variant="outlined" 
                           onClick={() => { setSelectedConsultancy(row); setOpenConsultancyDialog(true); }}
                        >
                          Manage
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          )}

          {/* =================================================================
              TAB 2: GUEST LECTURES
          ================================================================= */}
          {tabIndex === 1 && (
             <Box>
               <Typography variant="h6" gutterBottom>Guest Lecture Management</Typography>
               <Table>
                 <TableHead sx={{ bgcolor: 'grey.100' }}>
                   <TableRow>
                     <TableCell>Topic & Speaker</TableCell>
                     <TableCell>Date</TableCell>
                     <TableCell>Feedback</TableCell>
                     <TableCell>Honorarium</TableCell>
                     <TableCell>Status</TableCell>
                     <TableCell align="right">Actions</TableCell>
                   </TableRow>
                 </TableHead>
                 <TableBody>
                   {guestLectures.map((row) => (
                     <TableRow key={row.id}>
                       <TableCell>
                         <Typography variant="subtitle2" fontWeight="bold">{row.topic}</Typography>
                         <Typography variant="caption" display="block">{row.speaker}</Typography>
                         <Typography variant="caption" color="textSecondary">Coord: {row.faculty}</Typography>
                       </TableCell>
                       <TableCell>{row.date}</TableCell>
                       <TableCell>
                         {row.status === 'Completed' ? (
                            <Box display="flex" alignItems="center" gap={0.5}>
                              <Feedback fontSize="small" color="warning" />
                              <Typography fontWeight="bold">{row.feedback}/5</Typography>
                            </Box>
                         ) : "-"}
                       </TableCell>
                       <TableCell>
                         <Typography>₹{row.honorarium}</Typography>
                         {row.paid ? 
                           <Chip label="Paid" size="small" color="success" sx={{ height: 20, fontSize: '0.6rem' }} /> : 
                           <Chip label="Pending" size="small" color="warning" sx={{ height: 20, fontSize: '0.6rem' }} />
                         }
                       </TableCell>
                       <TableCell><Chip label={row.status} size="small" /></TableCell>
                       <TableCell align="right">
                         <Tooltip title="View Details / Pay">
                           <IconButton size="small" color="primary" onClick={() => { setSelectedLecture(row); setOpenLectureDialog(true); }}>
                             <Visibility />
                           </IconButton>
                         </Tooltip>
                         {row.status === 'Completed' && (
                           <Tooltip title="Generate Certificate">
                             <IconButton size="small" color="secondary" onClick={handleGenerateCert}>
                               <EmojiEvents />
                             </IconButton>
                           </Tooltip>
                         )}
                       </TableCell>
                     </TableRow>
                   ))}
                 </TableBody>
               </Table>
             </Box>
          )}

          {/* =================================================================
              TAB 3: EXTERNAL EXAMINERS
          ================================================================= */}
          {tabIndex === 2 && (
            <Box>
              <Typography variant="h6" gutterBottom>External Examiner Module</Typography>
              <Table>
                <TableHead sx={{ bgcolor: 'grey.100' }}>
                  <TableRow>
                    <TableCell>Subject & Faculty</TableCell>
                    <TableCell>External Examiner</TableCell>
                    <TableCell>Exam Date</TableCell>
                    <TableCell>Current Stage</TableCell>
                    <TableCell align="right">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {examiners.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell>
                         <Typography variant="subtitle2" fontWeight="bold">{row.subject}</Typography>
                         <Typography variant="caption">Coord: {row.internal}</Typography>
                      </TableCell>
                      <TableCell>{row.external}</TableCell>
                      <TableCell>{row.date}</TableCell>
                      <TableCell>
                        <Chip label={row.status} color="info" size="small" variant="outlined" />
                      </TableCell>
                      <TableCell align="right">
                        <Button 
                          size="small" variant="contained" 
                          onClick={() => { setSelectedExaminer(row); setOpenExaminerDialog(true); }}
                        >
                          Track
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          )}

          {/* =================================================================
              TAB 4: MoUs & COLLABORATIONS
          ================================================================= */}
          {tabIndex === 3 && (
            <Box>
              <Box display="flex" justifyContent="space-between" mb={3}>
                 <Typography variant="h6">MoU Registry</Typography>
                 <Button variant="outlined" startIcon={<Add />}>Add Partner</Button>
              </Box>
              <Grid container spacing={3}>
                {mous.map((mou) => (
                  <Grid item xs={12} md={6} key={mou.id}>
                    <Card variant="outlined" sx={{ p: 2, position: 'relative', borderLeft: '4px solid #9c27b0' }}>
                       <Box display="flex" justifyContent="space-between">
                         <Typography variant="h6">{mou.partner}</Typography>
                         <Chip label={mou.active ? "Active" : "Expired"} color={mou.active ? "success" : "error"} size="small" />
                       </Box>
                       <Typography variant="body2" color="textSecondary">{mou.type} Partnership</Typography>
                       
                       <Box mt={2} display="flex" gap={2} flexWrap="wrap">
                         <Box display="flex" alignItems="center" gap={1}>
                            <AccessTime fontSize="small" color="action" />
                            <Typography variant="caption">Valid: {mou.validTill}</Typography>
                         </Box>
                         <Box display="flex" alignItems="center" gap={1}>
                            <History fontSize="small" color="action" />
                            <Typography variant="caption">Activities: {mou.activities}</Typography>
                         </Box>
                       </Box>

                       <Divider sx={{ my: 1.5 }} />
                       <Typography variant="caption" display="block" color="primary">Last Activity: {mou.lastActivity}</Typography>
                       
                       <Box mt={2} display="flex" justifyContent="flex-end" gap={1}>
                         <Button size="small" variant="text">View Logs</Button>
                         <Button size="small" variant="outlined">Renew</Button>
                       </Box>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}

          {/* =================================================================
              TAB 5: PATENTS & IP
          ================================================================= */}
          {tabIndex === 4 && (
            <Box>
               <Typography variant="h6" gutterBottom>IPR & Patent Portfolio</Typography>
               <Table>
                 <TableHead sx={{ bgcolor: 'grey.100' }}>
                   <TableRow>
                     <TableCell>Patent Title</TableCell>
                     <TableCell>Inventors</TableCell>
                     <TableCell>Application #</TableCell>
                     <TableCell>Status</TableCell>
                     <TableCell>Cost Incurred</TableCell>
                     <TableCell align="right">Commercialization</TableCell>
                   </TableRow>
                 </TableHead>
                 <TableBody>
                    {patents.map((pat) => (
                      <TableRow key={pat.id}>
                        <TableCell fontWeight="bold">{pat.title}</TableCell>
                        <TableCell>{pat.inventors}</TableCell>
                        <TableCell>{pat.appNumber}</TableCell>
                        <TableCell>
                          <Chip label={pat.status} color="secondary" size="small" />
                          <Typography variant="caption" display="block" color="textSecondary">{pat.filingDate}</Typography>
                        </TableCell>
                        <TableCell>₹{pat.cost}</TableCell>
                        <TableCell align="right">
                          <Chip label={pat.commercialized} variant="outlined" color="success" size="small" />
                        </TableCell>
                      </TableRow>
                    ))}
                 </TableBody>
               </Table>
            </Box>
          )}

        </Box>
      </Card>

      {/* --- DIALOGS --- */}

      {/* 1. CONSULTANCY DETAILS */}
      <Dialog open={openConsultancyDialog} onClose={() => setOpenConsultancyDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Project Management: {selectedConsultancy?.title}</DialogTitle>
        <DialogContent dividers>
          <Box mb={3} display="flex" gap={4}>
             <Box>
               <Typography variant="caption">Total Revenue</Typography>
               <Typography variant="h6">₹{selectedConsultancy?.revenue.toLocaleString()}</Typography>
             </Box>
             <Box>
               <Typography variant="caption">IP Ownership</Typography>
               <Typography variant="subtitle1">{selectedConsultancy?.ipRights}</Typography>
             </Box>
          </Box>
          
          <Typography variant="subtitle2" gutterBottom>Milestone Tracker</Typography>
          <Table size="small" sx={{ mb: 2 }}>
            <TableHead>
              <TableRow>
                <TableCell>Milestone</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Invoice</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {selectedConsultancy?.milestones.map((m, i) => (
                <TableRow key={i}>
                  <TableCell>{m.name}</TableCell>
                  <TableCell>
                    <Chip label={m.status} size="small" color={m.status === 'Completed' ? 'success' : 'default'} />
                  </TableCell>
                  <TableCell>{m.invoice}</TableCell>
                  <TableCell>
                    {m.invoice === 'Pending' && m.status === 'Completed' && (
                      <Button size="small" startIcon={<ReceiptLong />} onClick={() => handleInvoiceGen(i)}>
                        Generate Invoice
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <Button startIcon={<Description />} variant="outlined" fullWidth>
             Upload Project Completion Certificate
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConsultancyDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
      
      {/* 2. GUEST LECTURE ACTION */}
      <Dialog open={openLectureDialog} onClose={() => setOpenLectureDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Guest Lecture Details</DialogTitle>
        <DialogContent dividers>
           <Typography variant="subtitle2">Speaker: {selectedLecture?.speaker}</Typography>
           
           <Box mt={2} p={2} bgcolor="grey.50" borderRadius={1}>
             <Typography variant="caption" display="block" gutterBottom>Finance & Logistics</Typography>
             <Grid container spacing={2}>
               <Grid item xs={6}>
                 <TextField label="Honorarium Amount" size="small" fullWidth value={selectedLecture?.honorarium} />
               </Grid>
               <Grid item xs={6}>
                 <TextField label="Travel/Stay Cost" size="small" fullWidth defaultValue="0" />
               </Grid>
             </Grid>
           </Box>

           <Box mt={2}>
             <Typography variant="caption" display="block" gutterBottom>Documentation</Typography>
             <Button component="label" size="small" startIcon={<AttachFile />}>
                Upload Photos / Geo-tagged Images
                <input type="file" hidden />
             </Button>
           </Box>
        </DialogContent>
        <DialogActions>
           <Button onClick={() => setOpenLectureDialog(false)}>Cancel</Button>
           <Button variant="contained" color="primary" startIcon={<Payment />}>Process Payment</Button>
        </DialogActions>
      </Dialog>

      {/* 3. EXAMINER TRACKING */}
      <Dialog open={openExaminerDialog} onClose={() => setOpenExaminerDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Examiner Workflow Tracker</DialogTitle>
        <DialogContent dividers>
          <Stepper activeStep={selectedExaminer?.steps} alternativeLabel>
            {['Assigned', 'QP Received', 'Evaluation Done', 'Payment Processed'].map((label) => (
              <Step key={label}><StepLabel>{label}</StepLabel></Step>
            ))}
          </Stepper>

          <Box mt={4}>
            <Typography variant="subtitle2" gutterBottom>Claims & Remuneration</Typography>
            <Grid container spacing={2}>
               <Grid item xs={6}>
                 <TextField label="Paper Setting Fee" size="small" fullWidth value={selectedExaminer?.remuneration} />
               </Grid>
               <Grid item xs={6}>
                 <TextField label="Travel Reimbursement" size="small" fullWidth value={selectedExaminer?.travelClaim} />
               </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenExaminerDialog(false)}>Close</Button>
          <Button variant="contained" color="success">Update Status</Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
};

// Simple Icon component for the tab
const AssignmentIndIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
     <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1s-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm0 4c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm6 12H6v-1.4c0-2 4-3.1 6-3.1s6 1.1 6 3.1V19z"/>
  </svg>
);

export default EngagementAdminView;