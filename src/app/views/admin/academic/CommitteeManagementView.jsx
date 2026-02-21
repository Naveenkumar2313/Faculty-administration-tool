import React, { useState, useEffect } from "react";
import { 
  Box, Card, Grid, Typography, Button, TextField, MenuItem, 
  Tabs, Tab, Table, TableBody, TableCell, TableHead, TableRow, 
  Chip, IconButton, Tooltip, Dialog, DialogTitle, DialogContent, 
  DialogActions, Autocomplete, Avatar, Checkbox, FormControlLabel, 
  List, ListItem, ListItemText, ListItemIcon, Divider, LinearProgress,
  Switch, Accordion, AccordionSummary, AccordionDetails, TablePagination,
  FormGroup, Select, FormControl, InputLabel, OutlinedInput, RadioGroup,
  Radio, Stepper, Step, StepLabel, Paper, Alert, Snackbar, CircularProgress,
  Badge, AvatarGroup, InputAdornment
} from "@mui/material";
import { 
  Groups, Event, Add, Edit, Delete, CheckCircle, 
  Cancel, MeetingRoom, Description, Archive, 
  Poll, Assessment, Videocam, CalendarToday, 
  Warning, DoneAll, AttachFile, HowToVote, ExpandMore,
  Download, AccessTime, PersonOff, Visibility, Search,
  FilterList, Send, Repeat, NotificationsActive, Person,
  CloudUpload, Print, Email, ThumbUp, ThumbDown, Timer,
  Assignment, TrendingUp, Schedule, FiberManualRecord,
  PlayArrow, Stop, Close, Info, ErrorOutline
} from "@mui/icons-material";
import ReactQuill from 'react-quill'; // Rich text editor
import 'react-quill/dist/quill.snow.css';

const CommitteeManagementView = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // PAGINATION
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // SEARCH & FILTER
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");

  // --- MOCK DATA ---

  // FACULTY MEMBERS
  const facultyList = [
    { id: 1, name: "Dr. Sarah Smith", dept: "CSE", email: "sarah@college.edu", designation: "Professor" },
    { id: 2, name: "Prof. Rajan Kumar", dept: "Mech", email: "rajan@college.edu", designation: "Associate Professor" },
    { id: 3, name: "Dr. Emily Davis", dept: "Civil", email: "emily@college.edu", designation: "Assistant Professor" },
    { id: 4, name: "Dr. A. Verma", dept: "Electrical", email: "verma@college.edu", designation: "Professor" },
    { id: 5, name: "Ms. Priya Roy", dept: "CSE", email: "priya@college.edu", designation: "Assistant Professor" },
  ];

  // COMMITTEES WITH ENHANCED DATA
  const [committees, setCommittees] = useState([
    { 
      id: 1, 
      name: "Internal Quality Assurance Cell (IQAC)", 
      type: "Statutory", 
      chair: { id: 1, name: "Dr. Sarah Smith" },
      convener: { id: 4, name: "Dr. A. Verma" },
      secretary: { id: 5, name: "Ms. Priya Roy" },
      members: [
        { 
          id: 1, 
          facultyId: 1, 
          name: "Dr. Sarah Smith", 
          role: "Chairperson", 
          joinDate: "2024-01-01",
          termEnd: "2026-05-30",
          attendance: { total: 12, present: 11, percentage: 91.67 },
          conflictOfInterest: { declared: true, date: "2024-01-15" },
          contributions: 25,
          status: "Active"
        },
        { 
          id: 2, 
          facultyId: 4, 
          name: "Dr. A. Verma", 
          role: "Convener", 
          joinDate: "2024-01-01",
          termEnd: "2026-05-30",
          attendance: { total: 12, present: 10, percentage: 83.33 },
          conflictOfInterest: { declared: true, date: "2024-01-15" },
          contributions: 18,
          status: "Active"
        },
        // Add more members...
      ],
      termStart: "2024-06-01",
      termEnd: "2026-05-30", 
      status: "Active", 
      effectiveness: 92,
      rotationRules: {
        maxConsecutiveTerms: 2,
        coolingOffPeriod: "6 months",
        diversityQuota: { faculty: 60, students: 20, external: 20 }
      }
    },
    { 
      id: 2, 
      name: "Grievance Redressal Committee", 
      type: "Statutory", 
      chair: { id: 2, name: "Prof. Rajan Kumar" },
      convener: { id: 3, name: "Dr. Emily Davis" },
      secretary: null,
      members: [
        { id: 3, facultyId: 2, name: "Prof. Rajan Kumar", role: "Chairperson", joinDate: "2025-01-01", termEnd: "2026-03-15", attendance: { total: 8, present: 7, percentage: 87.5 }, conflictOfInterest: { declared: true, date: "2025-01-10" }, contributions: 12, status: "Active" },
      ],
      termStart: "2025-01-01",
      termEnd: "2026-03-15", 
      status: "Active", 
      effectiveness: 85 
    },
    { 
      id: 3, 
      name: "Cultural Committee", 
      type: "Advisory", 
      chair: { id: 3, name: "Dr. Emily Davis" },
      convener: null,
      secretary: null,
      members: [],
      termStart: "2025-01-01",
      termEnd: "2025-12-31", 
      status: "Expiring Soon", 
      effectiveness: 78 
    },
  ]);

  // MEETINGS WITH ENHANCED DATA
  const [meetings, setMeetings] = useState([
    { 
      id: 101, 
      committeeId: 1,
      committee: "IQAC", 
      title: "Quarterly Review Meeting", 
      date: "2026-02-15", 
      time: "10:00 AM", 
      duration: 120, // minutes
      room: "Conference Hall A", 
      status: "Scheduled", 
      convener: { id: 4, name: "Dr. A. Verma" },
      videoLink: "https://meet.google.com/abc-xyz",
      agenda: [
        { id: 1, topic: "Review NAAC criteria", duration: 30, presenter: "Dr. Sarah Smith", documents: [] },
        { id: 2, topic: "Budget approval for FY 2026-27", duration: 45, presenter: "Finance Officer", documents: ["budget_proposal.pdf"] },
        { id: 3, topic: "New course proposals", duration: 45, presenter: "Dean Academic", documents: ["course_list.xlsx"] }
      ],
      preMeetingDocuments: ["agenda.pdf", "last_mom.pdf"],
      recurring: false,
      rsvpRequired: true,
      rsvpStatus: {
        accepted: [1, 4, 5],
        declined: [],
        tentative: [2],
        noResponse: [3]
      },
      reminder: {
        sent: true,
        sentDate: "2026-02-10",
        recipients: "all_members"
      }
    },
    { 
      id: 102, 
      committeeId: 3,
      committee: "Cultural Committee", 
      title: "Annual Fest Planning", 
      date: "2026-01-20", 
      time: "02:00 PM",
      duration: 90, 
      room: "Seminar Hall", 
      status: "Completed", 
      convener: { id: 5, name: "Ms. Priya Roy" },
      videoLink: null,
      agenda: [
        { id: 1, topic: "Fest theme selection", duration: 30, presenter: "Committee", documents: [] },
        { id: 2, topic: "Budget discussion", duration: 30, presenter: "Treasurer", documents: [] },
        { id: 3, topic: "Vendor selection", duration: 30, presenter: "Logistics Head", documents: [] }
      ],
      attendance: {
        total: 8,
        present: [1, 2, 4, 5, 6, 7, 8],
        absent: [],
        excused: [3],
        late: [],
        percentage: 87.5
      },
      resolutions: [
        { id: "RES-001", text: "Approve budget of ₹5 Lakhs for Fest", votesFor: 6, votesAgainst: 1, status: "Passed" },
        { id: "RES-002", text: "Vendor Selection: ABC Events", votesFor: 7, votesAgainst: 0, status: "Passed" }
      ],
      actionItems: [
        { id: "ACT-001", description: "Finalize vendor contract", assignedTo: 5, dueDate: "2026-02-01", priority: "High", status: "Completed", completionDate: "2026-01-28" },
        { id: "ACT-002", description: "Book auditorium for main event", assignedTo: 2, dueDate: "2026-02-10", priority: "Medium", status: "In Progress", completionDate: null }
      ],
      mom: {
        version: 3,
        status: "Approved",
        content: "<p>Meeting started at 02:00 PM...</p>",
        approvedBy: 3,
        approvedDate: "2026-01-22",
        file: "mom_fest_plan.pdf",
        versions: [
          { version: 1, status: "Draft", modifiedBy: "Secretary", date: "2026-01-20 17:00" },
          { version: 2, status: "Under Review", modifiedBy: "Chairperson", date: "2026-01-21 10:00" },
          { version: 3, status: "Approved", modifiedBy: "Chairperson", date: "2026-01-22 09:00" }
        ]
      },
      nextMeetingDate: "2026-02-20"
    },
  ]);

  // ACTION ITEMS ACROSS ALL MEETINGS
  const [actionItems, setActionItems] = useState([
    { id: "ACT-001", meetingId: 102, description: "Finalize vendor contract", assignedTo: 5, assignedToName: "Ms. Priya Roy", dueDate: "2026-02-01", priority: "High", status: "Completed", completionDate: "2026-01-28", committee: "Cultural Committee" },
    { id: "ACT-002", meetingId: 102, description: "Book auditorium for main event", assignedTo: 2, assignedToName: "Prof. Rajan Kumar", dueDate: "2026-02-10", priority: "Medium", status: "In Progress", completionDate: null, committee: "Cultural Committee" },
    { id: "ACT-003", meetingId: 101, description: "Submit NAAC self-study report", assignedTo: 1, assignedToName: "Dr. Sarah Smith", dueDate: "2026-03-15", priority: "Critical", status: "Open", completionDate: null, committee: "IQAC" },
  ]);

  // RESOLUTIONS (For Voting Tab)
  const [resolutions, setResolutions] = useState([
    { 
      id: "RES-001", 
      meetingId: 102, 
      committeeId: 3,
      text: "Approve budget of ₹5 Lakhs for Annual Fest", 
      proposedBy: 3,
      proposedDate: "2026-01-20",
      votingMethod: "Show of Hands", // Show of Hands, Secret Ballot, Electronic
      votingPeriod: { start: "2026-01-20 14:30", end: "2026-01-20 15:00" },
      votesFor: 6, 
      votesAgainst: 1, 
      abstain: 1,
      quorum: { required: 60, achieved: 87.5, status: "Met" },
      status: "Passed",
      implementationStatus: "Completed",
      implementationSteps: [
        { step: "Budget allocation", status: "Completed", date: "2026-01-25" },
        { step: "Finance approval", status: "Completed", date: "2026-01-28" }
      ],
      responsibleOfficer: "Dean Student Affairs"
    },
    { 
      id: "RES-002", 
      meetingId: 102, 
      committeeId: 3,
      text: "Vendor Selection: ABC Events for stage setup", 
      proposedBy: 5,
      proposedDate: "2026-01-20",
      votingMethod: "Show of Hands",
      votingPeriod: { start: "2026-01-20 15:00", end: "2026-01-20 15:15" },
      votesFor: 7, 
      votesAgainst: 0, 
      abstain: 1,
      quorum: { required: 60, achieved: 87.5, status: "Met" },
      status: "Passed",
      implementationStatus: "In Progress",
      implementationSteps: [
        { step: "Contract signing", status: "Completed", date: "2026-01-28" },
        { step: "Advance payment", status: "In Progress", dueDate: "2026-02-05" }
      ],
      responsibleOfficer: "Cultural Committee Convener"
    },
    {
      id: "RES-003",
      meetingId: 101,
      committeeId: 1,
      text: "Approve new curriculum structure for B.Tech CSE",
      proposedBy: 1,
      proposedDate: "2026-02-15",
      votingMethod: "Electronic", // E-voting
      votingPeriod: { start: "2026-02-15 10:00", end: "2026-02-15 17:00" },
      votesFor: 0,
      votesAgainst: 0,
      abstain: 0,
      quorum: { required: 60, achieved: 0, status: "Pending" },
      status: "Voting Open",
      votes: [], // Will store individual votes
      eligibleVoters: [1, 2, 4, 5]
    }
  ]);

  // --- DIALOG STATES ---
  const [openCommitteeDialog, setOpenCommitteeDialog] = useState(false);
  const [openMeetingDialog, setOpenMeetingDialog] = useState(false);
  const [openMinutesDialog, setOpenMinutesDialog] = useState(false);
  const [openMemberDialog, setOpenMemberDialog] = useState(false);
  const [openActionItemDialog, setOpenActionItemDialog] = useState(false);
  const [openVotingDialog, setOpenVotingDialog] = useState(false);
  const [openResolutionDialog, setOpenResolutionDialog] = useState(false);

  const [selectedCommittee, setSelectedCommittee] = useState(null);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [selectedActionItem, setSelectedActionItem] = useState(null);
  const [selectedResolution, setSelectedResolution] = useState(null);

  // --- FORM STATES ---

  // Committee Form
  const [committeeForm, setCommitteeForm] = useState({
    name: "",
    type: "Statutory",
    chair: null,
    convener: null,
    secretary: null,
    termStart: "",
    termEnd: "",
    conflictOfInterestRequired: true
  });

  // Meeting Form
  const [meetingForm, setMeetingForm] = useState({
    committeeId: "",
    title: "",
    date: "",
    time: "",
    duration: 120,
    room: "",
    videoLink: "",
    agenda: [{ topic: "", duration: 30, presenter: "", documents: [] }],
    recurring: false,
    recurringPattern: {
      frequency: "Weekly", // Daily, Weekly, Bi-weekly, Monthly, Quarterly
      interval: 1,
      endType: "Never", // Never, After X occurrences, By date
      endDate: "",
      occurrences: 10,
      exceptDates: []
    },
    rsvpRequired: true,
    preMeetingDocuments: []
  });

  // Minutes Form
  const [minutesData, setMinutesData] = useState({
    meetingId: null,
    attendees: {
      present: [],
      absent: [],
      excused: [],
      late: []
    },
    content: "", // Rich text content
    actionItems: [],
    decisions: [],
    nextMeetingDate: "",
    momFile: null,
    status: "Draft" // Draft, Under Review, Approved
  });

  // Action Item Form
  const [actionItemForm, setActionItemForm] = useState({
    meetingId: null,
    description: "",
    assignedTo: null,
    dueDate: "",
    priority: "Medium", // Low, Medium, High, Critical
    dependencies: []
  });

  // Resolution/Voting Form
  const [resolutionForm, setResolutionForm] = useState({
    meetingId: null,
    text: "",
    votingMethod: "Show of Hands", // Show of Hands, Secret Ballot, Electronic
    votingStartTime: "",
    votingEndTime: "",
    quorumRequired: 60
  });

  // --- HANDLERS ---

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
    setPage(0); // Reset pagination
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Committee CRUD
  const handleSaveCommittee = () => {
    if (!committeeForm.name || !committeeForm.chair) {
      showSnackbar("Please fill all required fields", "error");
      return;
    }

    const newCommittee = {
      id: committees.length + 1,
      name: committeeForm.name,
      type: committeeForm.type,
      chair: committeeForm.chair,
      convener: committeeForm.convener,
      secretary: committeeForm.secretary,
      members: [],
      termStart: committeeForm.termStart,
      termEnd: committeeForm.termEnd,
      status: "Active",
      effectiveness: 0
    };

    setCommittees([...committees, newCommittee]);
    setOpenCommitteeDialog(false);
    resetCommitteeForm();
    showSnackbar("Committee created successfully", "success");
  };

  const handleDeleteCommittee = (id) => {
    if (window.confirm("Are you sure you want to delete this committee?")) {
      setCommittees(committees.filter(c => c.id !== id));
      showSnackbar("Committee deleted", "success");
    }
  };

  // Meeting CRUD
  const handleScheduleMeeting = () => {
    if (!meetingForm.committeeId || !meetingForm.title || !meetingForm.date) {
      showSnackbar("Please fill all required fields", "error");
      return;
    }

    const committee = committees.find(c => c.id === meetingForm.committeeId);
    
    const newMeeting = {
      id: meetings.length + 101,
      committeeId: meetingForm.committeeId,
      committee: committee.name,
      title: meetingForm.title,
      date: meetingForm.date,
      time: meetingForm.time,
      duration: meetingForm.duration,
      room: meetingForm.room,
      videoLink: meetingForm.videoLink,
      status: "Scheduled",
      convener: committee.convener,
      agenda: meetingForm.agenda,
      recurring: meetingForm.recurring,
      recurringPattern: meetingForm.recurring ? meetingForm.recurringPattern : null,
      rsvpRequired: meetingForm.rsvpRequired,
      rsvpStatus: {
        accepted: [],
        declined: [],
        tentative: [],
        noResponse: committee.members.map(m => m.id)
      },
      preMeetingDocuments: meetingForm.preMeetingDocuments
    };

    setMeetings([...meetings, newMeeting]);
    setOpenMeetingDialog(false);
    resetMeetingForm();
    showSnackbar("Meeting scheduled successfully. Calendar invites will be sent.", "success");
  };

  const handleCancelMeeting = (id) => {
    if (window.confirm("Are you sure you want to cancel this meeting?")) {
      setMeetings(meetings.map(m => m.id === id ? { ...m, status: "Cancelled" } : m));
      showSnackbar("Meeting cancelled. Notifications sent to all members.", "info");
    }
  };

  // Minutes of Meeting
  const handleSaveMinutes = () => {
    if (!minutesData.content) {
      showSnackbar("Please enter meeting minutes", "error");
      return;
    }

    const updatedMeeting = {
      ...selectedMeeting,
      status: minutesData.status === "Approved" ? "Completed" : "Minutes Pending Approval",
      attendance: {
        total: selectedMeeting.committee ? committees.find(c => c.name === selectedMeeting.committee)?.members.length || 0 : 0,
        present: minutesData.attendees.present,
        absent: minutesData.attendees.absent,
        excused: minutesData.attendees.excused,
        late: minutesData.attendees.late,
        percentage: (minutesData.attendees.present.length / (minutesData.attendees.present.length + minutesData.attendees.absent.length + minutesData.attendees.excused.length + minutesData.attendees.late.length)) * 100
      },
      actionItems: minutesData.actionItems,
      resolutions: minutesData.decisions,
      mom: {
        version: 1,
        status: minutesData.status,
        content: minutesData.content,
        approvedBy: minutesData.status === "Approved" ? 1 : null, // Current user
        approvedDate: minutesData.status === "Approved" ? new Date().toISOString() : null,
        file: minutesData.momFile,
        versions: [
          {
            version: 1,
            status: minutesData.status,
            modifiedBy: "Current User",
            date: new Date().toISOString()
          }
        ]
      },
      nextMeetingDate: minutesData.nextMeetingDate
    };

    setMeetings(meetings.map(m => m.id === selectedMeeting.id ? updatedMeeting : m));
    setOpenMinutesDialog(false);
    resetMinutesData();
    showSnackbar(`Minutes saved as ${minutesData.status}`, "success");
  };

  // Action Items
  const handleSaveActionItem = () => {
    if (!actionItemForm.description || !actionItemForm.assignedTo) {
      showSnackbar("Please fill all required fields", "error");
      return;
    }

    const assignedUser = facultyList.find(f => f.id === actionItemForm.assignedTo);
    const meeting = meetings.find(m => m.id === actionItemForm.meetingId);

    const newActionItem = {
      id: `ACT-${String(actionItems.length + 1).padStart(3, '0')}`,
      meetingId: actionItemForm.meetingId,
      description: actionItemForm.description,
      assignedTo: actionItemForm.assignedTo,
      assignedToName: assignedUser.name,
      dueDate: actionItemForm.dueDate,
      priority: actionItemForm.priority,
      status: "Open",
      completionDate: null,
      committee: meeting.committee,
      dependencies: actionItemForm.dependencies
    };

    setActionItems([...actionItems, newActionItem]);
    
    // Also update the meeting's action items
    setMeetings(meetings.map(m => 
      m.id === actionItemForm.meetingId 
        ? { ...m, actionItems: [...(m.actionItems || []), newActionItem] }
        : m
    ));

    setOpenActionItemDialog(false);
    resetActionItemForm();
    showSnackbar("Action item created and assigned", "success");
  };

  const handleUpdateActionItemStatus = (id, newStatus) => {
    setActionItems(actionItems.map(item => 
      item.id === id 
        ? { ...item, status: newStatus, completionDate: newStatus === "Completed" ? new Date().toISOString().split('T')[0] : null }
        : item
    ));
    showSnackbar(`Action item marked as ${newStatus}`, "success");
  };

  // Resolutions & Voting
  const handleCreateResolution = () => {
    if (!resolutionForm.text) {
      showSnackbar("Please enter resolution text", "error");
      return;
    }

    const meeting = meetings.find(m => m.id === resolutionForm.meetingId);
    const committee = committees.find(c => c.id === meeting.committeeId);

    const newResolution = {
      id: `RES-${String(resolutions.length + 1).padStart(3, '0')}`,
      meetingId: resolutionForm.meetingId,
      committeeId: meeting.committeeId,
      text: resolutionForm.text,
      proposedBy: 1, // Current user
      proposedDate: new Date().toISOString(),
      votingMethod: resolutionForm.votingMethod,
      votingPeriod: {
        start: resolutionForm.votingStartTime,
        end: resolutionForm.votingEndTime
      },
      votesFor: 0,
      votesAgainst: 0,
      abstain: 0,
      quorum: {
        required: resolutionForm.quorumRequired,
        achieved: 0,
        status: "Pending"
      },
      status: resolutionForm.votingMethod === "Electronic" ? "Voting Open" : "Pending Vote",
      eligibleVoters: committee.members.map(m => m.id),
      votes: []
    };

    setResolutions([...resolutions, newResolution]);
    setOpenResolutionDialog(false);
    resetResolutionForm();
    showSnackbar(
      resolutionForm.votingMethod === "Electronic" 
        ? "E-voting initiated. Notifications sent to all members." 
        : "Resolution added to meeting agenda",
      "success"
    );
  };

  const handleCastVote = (resolutionId, vote) => {
    // vote can be: "For", "Against", "Abstain"
    const currentUserId = 1; // Mock current user

    setResolutions(resolutions.map(res => {
      if (res.id === resolutionId) {
        // Check if user already voted
        const existingVote = res.votes?.find(v => v.voterId === currentUserId);
        if (existingVote) {
          showSnackbar("You have already voted on this resolution", "warning");
          return res;
        }

        const newVote = {
          voterId: currentUserId,
          vote: vote,
          timestamp: new Date().toISOString(),
          anonymous: res.votingMethod === "Secret Ballot"
        };

        const updatedVotes = [...(res.votes || []), newVote];
        const votesFor = updatedVotes.filter(v => v.vote === "For").length;
        const votesAgainst = updatedVotes.filter(v => v.vote === "Against").length;
        const abstain = updatedVotes.filter(v => v.vote === "Abstain").length;
        
        const totalVoted = updatedVotes.length;
        const totalEligible = res.eligibleVoters.length;
        const quorumAchieved = (totalVoted / totalEligible) * 100;

        // Check if all have voted or voting period ended
        const allVoted = totalVoted === totalEligible;
        const votingEnded = new Date() > new Date(res.votingPeriod.end);

        let status = res.status;
        if (allVoted || votingEnded) {
          if (quorumAchieved >= res.quorum.required) {
            status = votesFor > votesAgainst ? "Passed" : "Rejected";
          } else {
            status = "Failed - Quorum Not Met";
          }
        }

        return {
          ...res,
          votes: updatedVotes,
          votesFor,
          votesAgainst,
          abstain,
          quorum: {
            ...res.quorum,
            achieved: quorumAchieved,
            status: quorumAchieved >= res.quorum.required ? "Met" : "Not Met"
          },
          status
        };
      }
      return res;
    }));

    showSnackbar("Your vote has been recorded", "success");
  };

  // Member Management
  const handleAddMember = (committeeId, facultyId, role) => {
    const faculty = facultyList.find(f => f.id === facultyId);
    
    setCommittees(committees.map(c => {
      if (c.id === committeeId) {
        const newMember = {
          id: c.members.length + 1,
          facultyId: faculty.id,
          name: faculty.name,
          role: role,
          joinDate: new Date().toISOString().split('T')[0],
          termEnd: c.termEnd,
          attendance: { total: 0, present: 0, percentage: 0 },
          conflictOfInterest: { declared: false },
          contributions: 0,
          status: "Active"
        };
        return { ...c, members: [...c.members, newMember] };
      }
      return c;
    }));

    showSnackbar("Member added successfully", "success");
  };

  const handleRemoveMember = (committeeId, memberId) => {
    if (window.confirm("Are you sure you want to remove this member?")) {
      setCommittees(committees.map(c => {
        if (c.id === committeeId) {
          return { ...c, members: c.members.filter(m => m.id !== memberId) };
        }
        return c;
      }));
      showSnackbar("Member removed", "success");
    }
  };

  // Calendar Invite Download (.ics file)
  const handleDownloadICS = (meeting) => {
    const icsContent = generateICSFile(meeting);
    const blob = new Blob([icsContent], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `meeting_${meeting.id}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const generateICSFile = (meeting) => {
    const startDate = new Date(`${meeting.date}T${meeting.time}`);
    const endDate = new Date(startDate.getTime() + meeting.duration * 60000);

    const formatDate = (date) => {
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };

    return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//College Committee System//EN
BEGIN:VEVENT
UID:${meeting.id}@college.edu
DTSTAMP:${formatDate(new Date())}
DTSTART:${formatDate(startDate)}
DTEND:${formatDate(endDate)}
SUMMARY:${meeting.title}
DESCRIPTION:${meeting.committee}\\n\\nAgenda: ${meeting.agenda?.map(a => a.topic).join(', ')}
LOCATION:${meeting.room || meeting.videoLink}
STATUS:CONFIRMED
SEQUENCE:0
END:VEVENT
END:VCALENDAR`;
  };

  // Utility Functions
  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const resetCommitteeForm = () => {
    setCommitteeForm({
      name: "",
      type: "Statutory",
      chair: null,
      convener: null,
      secretary: null,
      termStart: "",
      termEnd: "",
      conflictOfInterestRequired: true
    });
  };

  const resetMeetingForm = () => {
    setMeetingForm({
      committeeId: "",
      title: "",
      date: "",
      time: "",
      duration: 120,
      room: "",
      videoLink: "",
      agenda: [{ topic: "", duration: 30, presenter: "", documents: [] }],
      recurring: false,
      recurringPattern: {
        frequency: "Weekly",
        interval: 1,
        endType: "Never",
        endDate: "",
        occurrences: 10,
        exceptDates: []
      },
      rsvpRequired: true,
      preMeetingDocuments: []
    });
  };

  const resetMinutesData = () => {
    setMinutesData({
      meetingId: null,
      attendees: {
        present: [],
        absent: [],
        excused: [],
        late: []
      },
      content: "",
      actionItems: [],
      decisions: [],
      nextMeetingDate: "",
      momFile: null,
      status: "Draft"
    });
  };

  const resetActionItemForm = () => {
    setActionItemForm({
      meetingId: null,
      description: "",
      assignedTo: null,
      dueDate: "",
      priority: "Medium",
      dependencies: []
    });
  };

  const resetResolutionForm = () => {
    setResolutionForm({
      meetingId: null,
      text: "",
      votingMethod: "Show of Hands",
      votingStartTime: "",
      votingEndTime: "",
      quorumRequired: 60
    });
  };

  // Filtering
  const filteredCommittees = committees.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === "All" || c.type === filterType;
    const matchesStatus = filterStatus === "All" || c.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const filteredMeetings = meetings.filter(m => {
    const matchesSearch = m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         m.committee.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  // Analytics Calculations
  const calculateAnalytics = () => {
    const totalMeetings = meetings.length;
    const completedMeetings = meetings.filter(m => m.status === "Completed").length;
    const avgAttendance = meetings
      .filter(m => m.attendance)
      .reduce((sum, m) => sum + m.attendance.percentage, 0) / 
      (meetings.filter(m => m.attendance).length || 1);
    
    const totalResolutions = resolutions.length;
    const passedResolutions = resolutions.filter(r => r.status === "Passed").length;
    
    const totalActionItems = actionItems.length;
    const completedActionItems = actionItems.filter(a => a.status === "Completed").length;
    const overdueActionItems = actionItems.filter(a => 
      a.status !== "Completed" && new Date(a.dueDate) < new Date()
    ).length;

    return {
      totalMeetings,
      completedMeetings,
      avgAttendance: avgAttendance.toFixed(1),
      totalResolutions,
      passedResolutions,
      resolutionPassRate: totalResolutions ? ((passedResolutions / totalResolutions) * 100).toFixed(1) : 0,
      totalActionItems,
      completedActionItems,
      actionItemCompletionRate: totalActionItems ? ((completedActionItems / totalActionItems) * 100).toFixed(1) : 0,
      overdueActionItems
    };
  };

  const analytics = calculateAnalytics();

  // --- RENDER ---

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
        Committee Administration & Governance
      </Typography>

      <Card sx={{ minHeight: 600 }}>
        <Tabs 
          value={tabIndex} 
          onChange={handleTabChange} 
          sx={{ borderBottom: 1, borderColor: 'divider', px: 2, bgcolor: 'background.paper' }}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab icon={<Groups />} iconPosition="start" label="Committee Setup" />
          <Tab icon={<Event />} iconPosition="start" label="Meeting Scheduler" />
          <Tab icon={<Description />} iconPosition="start" label="Minutes & Decisions" />
          <Tab icon={<Assignment />} iconPosition="start" label="Action Items Tracker" />
          <Tab icon={<Poll />} iconPosition="start" label="Voting & Resolutions" />
          <Tab icon={<Assessment />} iconPosition="start" label="Analytics & Reports" />
        </Tabs>

        <Box sx={{ p: 3 }}>
          {/* =================================================================
              TAB 1: COMMITTEE SETUP & MEMBER MANAGEMENT
          ================================================================= */}
          {tabIndex === 0 && (
            <Box>
              {/* Search & Filter Bar */}
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} gap={2}>
                <Box display="flex" gap={2} flex={1}>
                  <TextField 
                    size="small" 
                    placeholder="Search committees..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Search />
                        </InputAdornment>
                      )
                    }}
                    sx={{ minWidth: 300 }}
                  />
                  <TextField 
                    select 
                    size="small" 
                    label="Type"
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    sx={{ minWidth: 150 }}
                  >
                    <MenuItem value="All">All Types</MenuItem>
                    <MenuItem value="Statutory">Statutory</MenuItem>
                    <MenuItem value="Advisory">Advisory</MenuItem>
                    <MenuItem value="Ad-hoc">Ad-hoc</MenuItem>
                  </TextField>
                  <TextField 
                    select 
                    size="small" 
                    label="Status"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    sx={{ minWidth: 150 }}
                  >
                    <MenuItem value="All">All Status</MenuItem>
                    <MenuItem value="Active">Active</MenuItem>
                    <MenuItem value="Expiring Soon">Expiring Soon</MenuItem>
                    <MenuItem value="Inactive">Inactive</MenuItem>
                  </TextField>
                </Box>
                <Button 
                  variant="contained" 
                  startIcon={<Add />} 
                  onClick={() => setOpenCommitteeDialog(true)}
                >
                  Create Committee
                </Button>
              </Box>

              {/* Committees Table */}
              {loading ? (
                <Box display="flex" justifyContent="center" py={5}>
                  <CircularProgress />
                </Box>
              ) : filteredCommittees.length === 0 ? (
                <Box textAlign="center" py={5}>
                  <Groups sx={{ fontSize: 60, color: 'grey.400' }} />
                  <Typography color="textSecondary" sx={{ mt: 2 }}>
                    No committees found
                  </Typography>
                  <Button 
                    variant="contained" 
                    startIcon={<Add />} 
                    sx={{ mt: 2 }}
                    onClick={() => setOpenCommitteeDialog(true)}
                  >
                    Create First Committee
                  </Button>
                </Box>
              ) : (
                <>
                  <Table>
                    <TableHead sx={{ bgcolor: 'grey.100' }}>
                      <TableRow>
                        <TableCell>Committee Name</TableCell>
                        <TableCell>Type</TableCell>
                        <TableCell>Leadership</TableCell>
                        <TableCell>Members</TableCell>
                        <TableCell>Term Status</TableCell>
                        <TableCell>Effectiveness</TableCell>
                        <TableCell align="right">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredCommittees
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((row) => {
                          const daysToExpiry = Math.ceil((new Date(row.termEnd) - new Date()) / (1000 * 60 * 60 * 24));
                          return (
                            <TableRow key={row.id} hover>
                              <TableCell>
                                <Typography variant="subtitle2" fontWeight="bold">{row.name}</Typography>
                                <Typography variant="caption" color="textSecondary">
                                  ID: COMM-{String(row.id).padStart(3, '0')}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Chip 
                                  label={row.type} 
                                  size="small" 
                                  color={row.type === 'Statutory' ? 'primary' : row.type === 'Advisory' ? 'secondary' : 'default'} 
                                  variant="outlined" 
                                />
                              </TableCell>
                              <TableCell>
                                <Box display="flex" flexDirection="column" gap={0.5}>
                                  <Box display="flex" alignItems="center" gap={1}>
                                    <Avatar sx={{ width: 20, height: 20, fontSize: 11 }}>{row.chair.name[0]}</Avatar>
                                    <Typography variant="caption">Chair: {row.chair.name}</Typography>
                                  </Box>
                                  {row.convener && (
                                    <Box display="flex" alignItems="center" gap={1}>
                                      <Avatar sx={{ width: 20, height: 20, fontSize: 11 }}>{row.convener.name[0]}</Avatar>
                                      <Typography variant="caption">Convener: {row.convener.name}</Typography>
                                    </Box>
                                  )}
                                </Box>
                              </TableCell>
                              <TableCell>
                                <Box display="flex" alignItems="center" gap={1}>
                                  <AvatarGroup max={3} sx={{ '& .MuiAvatar-root': { width: 24, height: 24, fontSize: 12 } }}>
                                    {row.members.slice(0, 3).map((m, i) => (
                                      <Avatar key={i}>{m.name[0]}</Avatar>
                                    ))}
                                  </AvatarGroup>
                                  <Typography variant="body2">{row.members.length}</Typography>
                                </Box>
                              </TableCell>
                              <TableCell>
                                <Box display="flex" alignItems="center" gap={1}>
                                  {row.status === 'Expiring Soon' ? (
                                    <Warning fontSize="small" color="error" />
                                  ) : (
                                    <CheckCircle fontSize="small" color="success" />
                                  )}
                                  <Box>
                                    <Typography variant="caption" display="block">
                                      {daysToExpiry > 0 ? `${daysToExpiry} days left` : 'Expired'}
                                    </Typography>
                                    <Typography variant="caption" color="textSecondary" display="block">
                                      Ends: {row.termEnd}
                                    </Typography>
                                  </Box>
                                </Box>
                                {row.status === 'Expiring Soon' && (
                                  <Chip 
                                    label="Renew" 
                                    size="small" 
                                    color="warning" 
                                    sx={{ height: 18, fontSize: '0.65rem', mt: 0.5 }} 
                                  />
                                )}
                              </TableCell>
                              <TableCell>
                                <Box>
                                  <LinearProgress 
                                    variant="determinate" 
                                    value={row.effectiveness} 
                                    sx={{ height: 6, borderRadius: 3, mb: 0.5 }}
                                    color={row.effectiveness > 80 ? "success" : row.effectiveness > 60 ? "warning" : "error"}
                                  />
                                  <Typography variant="caption">{row.effectiveness}%</Typography>
                                </Box>
                              </TableCell>
                              <TableCell align="right">
                                <Tooltip title="Manage Members">
                                  <IconButton 
                                    size="small" 
                                    color="primary"
                                    onClick={() => {
                                      setSelectedCommittee(row);
                                      setOpenMemberDialog(true);
                                    }}
                                  >
                                    <Groups />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Edit Committee">
                                  <IconButton size="small">
                                    <Edit />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Delete">
                                  <IconButton 
                                    size="small" 
                                    color="error"
                                    onClick={() => handleDeleteCommittee(row.id)}
                                  >
                                    <Delete />
                                  </IconButton>
                                </Tooltip>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                    </TableBody>
                  </Table>

                  <TablePagination
                    component="div"
                    count={filteredCommittees.length}
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    rowsPerPageOptions={[5, 10, 25, 50]}
                  />
                </>
              )}
            </Box>
          )}

          {/* =================================================================
              TAB 2: MEETING SCHEDULER
          ================================================================= */}
          {tabIndex === 1 && (
            <Box>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Box display="flex" gap={2}>
                  <TextField 
                    size="small" 
                    placeholder="Search meetings..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Search />
                        </InputAdornment>
                      )
                    }}
                    sx={{ minWidth: 300 }}
                  />
                </Box>
                <Button 
                  variant="contained" 
                  startIcon={<Add />} 
                  onClick={() => setOpenMeetingDialog(true)}
                >
                  Schedule Meeting
                </Button>
              </Box>

              {/* Upcoming Meetings */}
              <Typography variant="h6" gutterBottom>Upcoming Meetings</Typography>
              <Grid container spacing={3} mb={4}>
                {filteredMeetings
                  .filter(m => m.status === 'Scheduled' && new Date(m.date) >= new Date())
                  .map(meeting => (
                    <Grid item xs={12} md={6} key={meeting.id}>
                      <Card 
                        variant="outlined" 
                        sx={{ 
                          p: 2, 
                          borderLeft: '4px solid',
                          borderLeftColor: 'primary.main',
                          '&:hover': { boxShadow: 3 }
                        }}
                      >
                        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                          <Box flex={1}>
                            <Typography variant="h6">{meeting.title}</Typography>
                            <Typography variant="body2" color="textSecondary">
                              {meeting.committee}
                            </Typography>
                          </Box>
                          <Chip 
                            label={meeting.status} 
                            color="primary" 
                            size="small" 
                          />
                        </Box>

                        <Box display="flex" gap={3} mb={2} flexWrap="wrap">
                          <Box display="flex" alignItems="center" gap={1}>
                            <CalendarToday fontSize="small" color="action" />
                            <Typography variant="body2">{meeting.date}</Typography>
                          </Box>
                          <Box display="flex" alignItems="center" gap={1}>
                            <AccessTime fontSize="small" color="action" />
                            <Typography variant="body2">{meeting.time}</Typography>
                          </Box>
                          <Box display="flex" alignItems="center" gap={1}>
                            <Timer fontSize="small" color="action" />
                            <Typography variant="body2">{meeting.duration} mins</Typography>
                          </Box>
                        </Box>

                        <Box display="flex" alignItems="center" gap={1} mb={2}>
                          <MeetingRoom fontSize="small" color="action" />
                          <Typography variant="body2">{meeting.room}</Typography>
                        </Box>

                        {meeting.videoLink && (
                          <Box display="flex" alignItems="center" gap={1} mb={2}>
                            <Videocam fontSize="small" color="primary" />
                            <Typography 
                              variant="body2" 
                              component="a" 
                              href={meeting.videoLink} 
                              target="_blank"
                              sx={{ textDecoration: 'none', color: 'primary.main' }}
                            >
                              Join Video Conference
                            </Typography>
                          </Box>
                        )}

                        {meeting.recurring && (
                          <Chip 
                            icon={<Repeat />} 
                            label="Recurring" 
                            size="small" 
                            variant="outlined" 
                            sx={{ mb: 2 }}
                          />
                        )}

                        <Divider sx={{ my: 2 }} />

                        <Accordion>
                          <AccordionSummary expandIcon={<ExpandMore />}>
                            <Typography variant="subtitle2">
                              Agenda ({meeting.agenda?.length || 0} items)
                            </Typography>
                          </AccordionSummary>
                          <AccordionDetails>
                            <List dense>
                              {meeting.agenda?.map((item, idx) => (
                                <ListItem key={idx} disablePadding>
                                  <ListItemIcon sx={{ minWidth: 30 }}>
                                    <FiberManualRecord sx={{ fontSize: 8 }} />
                                  </ListItemIcon>
                                  <ListItemText 
                                    primary={item.topic}
                                    secondary={`${item.duration} min • ${item.presenter}`}
                                  />
                                </ListItem>
                              ))}
                            </List>
                          </AccordionDetails>
                        </Accordion>

                        {meeting.rsvpRequired && (
                          <Box mt={2}>
                            <Typography variant="caption" color="textSecondary" display="block" gutterBottom>
                              RSVP Status:
                            </Typography>
                            <Box display="flex" gap={1}>
                              <Chip 
                                label={`✓ ${meeting.rsvpStatus?.accepted.length || 0}`} 
                                size="small" 
                                color="success" 
                                variant="outlined"
                              />
                              <Chip 
                                label={`? ${meeting.rsvpStatus?.tentative.length || 0}`} 
                                size="small" 
                                color="warning" 
                                variant="outlined"
                              />
                              <Chip 
                                label={`✗ ${meeting.rsvpStatus?.declined.length || 0}`} 
                                size="small" 
                                color="error" 
                                variant="outlined"
                              />
                              <Chip 
                                label={`− ${meeting.rsvpStatus?.noResponse.length || 0}`} 
                                size="small" 
                                variant="outlined"
                              />
                            </Box>
                          </Box>
                        )}

                        <Box mt={2} display="flex" justifyContent="flex-end" gap={1}>
                          <Button 
                            size="small" 
                            startIcon={<Download />} 
                            onClick={() => handleDownloadICS(meeting)}
                          >
                            .ics
                          </Button>
                          <Button 
                            size="small" 
                            variant="outlined" 
                            startIcon={<Edit />}
                          >
                            Edit
                          </Button>
                          <Button 
                            size="small" 
                            color="error"
                            onClick={() => handleCancelMeeting(meeting.id)}
                          >
                            Cancel
                          </Button>
                        </Box>
                      </Card>
                    </Grid>
                  ))}
              </Grid>

              {filteredMeetings.filter(m => m.status === 'Scheduled').length === 0 && (
                <Box textAlign="center" py={5}>
                  <Event sx={{ fontSize: 60, color: 'grey.400' }} />
                  <Typography color="textSecondary" sx={{ mt: 2 }}>
                    No upcoming meetings scheduled
                  </Typography>
                  <Button 
                    variant="contained" 
                    startIcon={<Add />} 
                    sx={{ mt: 2 }}
                    onClick={() => setOpenMeetingDialog(true)}
                  >
                    Schedule First Meeting
                  </Button>
                </Box>
              )}

              {/* Past Meetings */}
              <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>Past Meetings</Typography>
              <Table size="small">
                <TableHead sx={{ bgcolor: 'grey.50' }}>
                  <TableRow>
                    <TableCell>Meeting</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">MoM</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredMeetings
                    .filter(m => m.status === 'Completed' || new Date(m.date) < new Date())
                    .slice(0, 5)
                    .map(meeting => (
                      <TableRow key={meeting.id} hover>
                        <TableCell>
                          <Typography variant="subtitle2">{meeting.title}</Typography>
                          <Typography variant="caption" color="textSecondary">
                            {meeting.committee}
                          </Typography>
                        </TableCell>
                        <TableCell>{meeting.date}</TableCell>
                        <TableCell>
                          <Chip 
                            label={meeting.status} 
                            size="small" 
                            color={meeting.status === 'Completed' ? 'success' : 'default'}
                          />
                        </TableCell>
                        <TableCell align="right">
                          {meeting.mom ? (
                            <Button size="small" startIcon={<Visibility />}>
                              View
                            </Button>
                          ) : (
                            <Typography variant="caption" color="textSecondary">
                              Not Available
                            </Typography>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </Box>
          )}

          {/* =================================================================
              TAB 3: MINUTES & DECISIONS
          ================================================================= */}
          {tabIndex === 2 && (
            <Box>
              <Typography variant="h6" gutterBottom>Minutes of Meeting (MoM) Management</Typography>
              
              <Table>
                <TableHead sx={{ bgcolor: 'grey.50' }}>
                  <TableRow>
                    <TableCell>Meeting Details</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Attendance</TableCell>
                    <TableCell>Resolutions</TableCell>
                    <TableCell>Action Items</TableCell>
                    <TableCell>MoM Status</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {meetings
                    .filter(m => m.status === 'Completed' || m.status === 'Scheduled')
                    .map((row) => (
                      <TableRow key={row.id} hover>
                        <TableCell>
                          <Typography variant="subtitle2" fontWeight="bold">
                            {row.title}
                          </Typography>
                          <Typography variant="caption" display="block" color="textSecondary">
                            {row.committee}
                          </Typography>
                          <Typography variant="caption" display="block">
                            Convener: {row.convener?.name}
                          </Typography>
                        </TableCell>
                        <TableCell>{row.date}</TableCell>
                        <TableCell>
                          {row.attendance ? (
                            <Box>
                              <Typography color="success.main" fontWeight="bold">
                                {row.attendance.percentage.toFixed(0)}%
                              </Typography>
                              <Typography variant="caption" color="textSecondary">
                                {row.attendance.present.length}/{row.attendance.total} present
                              </Typography>
                            </Box>
                          ) : (
                            <Typography color="textSecondary">-</Typography>
                          )}
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={`${row.resolutions?.length || 0} Passed`} 
                            size="small" 
                            color={row.resolutions?.length > 0 ? "success" : "default"}
                          />
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={`${row.actionItems?.length || 0} Items`} 
                            size="small" 
                            color={row.actionItems?.length > 0 ? "primary" : "default"}
                          />
                        </TableCell>
                        <TableCell>
                          {row.mom ? (
                            <Box>
                              <Chip 
                                label={row.mom.status} 
                                size="small" 
                                color={
                                  row.mom.status === 'Approved' ? 'success' : 
                                  row.mom.status === 'Under Review' ? 'warning' : 
                                  'default'
                                }
                              />
                              <Typography variant="caption" display="block" color="textSecondary">
                                v{row.mom.version}
                              </Typography>
                            </Box>
                          ) : (
                            <Chip label="Pending" size="small" color="error" />
                          )}
                        </TableCell>
                        <TableCell align="right">
                          {!row.mom || row.mom.status !== 'Approved' ? (
                            <Button 
                              variant="contained" 
                              size="small" 
                              startIcon={<Description />}
                              onClick={() => {
                                setSelectedMeeting(row);
                                setMinutesData({
                                  ...minutesData,
                                  meetingId: row.id,
                                  content: row.mom?.content || "",
                                  status: row.mom?.status || "Draft"
                                });
                                setOpenMinutesDialog(true);
                              }}
                            >
                              {row.mom ? 'Edit MoM' : 'Record MoM'}
                            </Button>
                          ) : (
                            <Box display="flex" gap={1}>
                              <Tooltip title="View MoM">
                                <IconButton size="small" color="primary">
                                  <Visibility />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Download PDF">
                                <IconButton size="small">
                                  <Download />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Archive">
                                <IconButton size="small">
                                  <Archive />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>

              {meetings.filter(m => m.status === 'Completed' || m.status === 'Scheduled').length === 0 && (
                <Box textAlign="center" py={5}>
                  <Description sx={{ fontSize: 60, color: 'grey.400' }} />
                  <Typography color="textSecondary" sx={{ mt: 2 }}>
                    No meetings require minutes
                  </Typography>
                </Box>
              )}
            </Box>
          )}

          {/* =================================================================
              TAB 4: ACTION ITEMS TRACKER
          ================================================================= */}
          {tabIndex === 3 && (
            <Box>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h6">Action Items Dashboard</Typography>
                <Button 
                  variant="contained" 
                  startIcon={<Add />}
                  onClick={() => setOpenActionItemDialog(true)}
                >
                  Add Action Item
                </Button>
              </Box>

              {/* Stats */}
              <Grid container spacing={2} mb={3}>
                <Grid item xs={12} md={3}>
                  <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'primary.light' }}>
                    <Typography variant="h3" fontWeight="bold" color="white">
                      {actionItems.length}
                    </Typography>
                    <Typography variant="body2" color="white" fontWeight="bold">Total Action Items</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'success.light' }}>
                    <Typography variant="h3" fontWeight="bold" color="white">
                      {actionItems.filter(a => a.status === 'Completed').length}
                    </Typography>
                    <Typography variant="body2" color="white" fontWeight="bold">Completed</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'warning.light' }}>
                    <Typography variant="h3" fontWeight="bold" color="white">
                      {actionItems.filter(a => a.status === 'In Progress').length}
                    </Typography>
                    <Typography variant="body2" color="white" fontWeight="bold">In Progress</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'error.light' }}>
                    <Typography variant="h3" fontWeight="bold" color="white">
                      {actionItems.filter(a => 
                        a.status !== 'Completed' && new Date(a.dueDate) < new Date()
                      ).length}
                    </Typography>
                    <Typography variant="body2" color="white" fontWeight="bold">Overdue</Typography>
                  </Paper>
                </Grid>
              </Grid>

              {/* Action Items Table */}
              <Table>
                <TableHead sx={{ bgcolor: 'grey.100' }}>
                  <TableRow>
                    <TableCell>Action Item</TableCell>
                    <TableCell>Assigned To</TableCell>
                    <TableCell>Due Date</TableCell>
                    <TableCell>Priority</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {actionItems.map((item) => {
                    const isOverdue = new Date(item.dueDate) < new Date() && item.status !== 'Completed';
                    const daysUntilDue = Math.ceil((new Date(item.dueDate) - new Date()) / (1000 * 60 * 60 * 24));

                    return (
                      <TableRow key={item.id} hover>
                        <TableCell>
                          <Typography variant="subtitle2" fontWeight="bold">
                            {item.description}
                          </Typography>
                          <Typography variant="caption" display="block" color="textSecondary">
                            {item.committee} • ID: {item.id}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box display="flex" alignItems="center" gap={1}>
                            <Avatar sx={{ width: 24, height: 24, fontSize: 12 }}>
                              {item.assignedToName[0]}
                            </Avatar>
                            <Typography variant="body2">{item.assignedToName}</Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography 
                            variant="body2"
                            color={isOverdue ? 'error.main' : 'text.primary'}
                            fontWeight={isOverdue ? 'bold' : 'normal'}
                          >
                            {item.dueDate}
                          </Typography>
                          <Typography 
                            variant="caption" 
                            color={isOverdue ? 'error' : daysUntilDue <= 3 ? 'warning' : 'textSecondary'}
                          >
                            {isOverdue 
                              ? `${Math.abs(daysUntilDue)} days overdue` 
                              : daysUntilDue === 0 
                                ? 'Due today' 
                                : `${daysUntilDue} days left`
                            }
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={item.priority} 
                            size="small" 
                            color={
                              item.priority === 'Critical' ? 'error' :
                              item.priority === 'High' ? 'warning' :
                              item.priority === 'Medium' ? 'primary' :
                              'default'
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={item.status} 
                            size="small" 
                            color={
                              item.status === 'Completed' ? 'success' :
                              item.status === 'In Progress' ? 'primary' :
                              'default'
                            }
                          />
                        </TableCell>
                        <TableCell align="right">
                          {item.status !== 'Completed' && (
                            <Box display="flex" gap={0.5} justifyContent="flex-end">
                              {item.status === 'Open' && (
                                <Tooltip title="Start Progress">
                                  <IconButton 
                                    size="small" 
                                    color="primary"
                                    onClick={() => handleUpdateActionItemStatus(item.id, 'In Progress')}
                                  >
                                    <PlayArrow />
                                  </IconButton>
                                </Tooltip>
                              )}
                              <Tooltip title="Mark Complete">
                                <IconButton 
                                  size="small" 
                                  color="success"
                                  onClick={() => handleUpdateActionItemStatus(item.id, 'Completed')}
                                >
                                  <CheckCircle />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Edit">
                                <IconButton size="small">
                                  <Edit />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          )}
                          {item.status === 'Completed' && (
                            <Typography variant="caption" color="success.main">
                              ✓ {item.completionDate}
                            </Typography>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>

              {actionItems.length === 0 && (
                <Box textAlign="center" py={5}>
                  <Assignment sx={{ fontSize: 60, color: 'grey.400' }} />
                  <Typography color="textSecondary" sx={{ mt: 2 }}>
                    No action items yet
                  </Typography>
                  <Button 
                    variant="contained" 
                    startIcon={<Add />} 
                    sx={{ mt: 2 }}
                    onClick={() => setOpenActionItemDialog(true)}
                  >
                    Create First Action Item
                  </Button>
                </Box>
              )}
            </Box>
          )}

          {/* =================================================================
              TAB 5: VOTING & RESOLUTIONS
          ================================================================= */}
          {tabIndex === 4 && (
            <Box>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h6">Resolution Tracker & E-Voting</Typography>
                <Button 
                  variant="contained" 
                  startIcon={<HowToVote />}
                  onClick={() => setOpenResolutionDialog(true)}
                >
                  Create Resolution
                </Button>
              </Box>

              {/* Active Voting */}
              {resolutions.filter(r => r.status === 'Voting Open').length > 0 && (
                <Box mb={4}>
                  <Alert severity="info" sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" fontWeight="bold">
                      Active E-Voting Sessions
                    </Typography>
                    <Typography variant="body2">
                      You have {resolutions.filter(r => r.status === 'Voting Open').length} resolutions awaiting your vote
                    </Typography>
                  </Alert>

                  <Grid container spacing={2}>
                    {resolutions
                      .filter(r => r.status === 'Voting Open')
                      .map((res) => (
                        <Grid item xs={12} key={res.id}>
                          <Card sx={{ p: 3, border: '2px solid', borderColor: 'primary.main' }}>
                            <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                              <Box flex={1}>
                                <Typography variant="caption" color="textSecondary">
                                  ID: {res.id}
                                </Typography>
                                <Typography variant="h6" sx={{ mt: 0.5 }}>
                                  {res.text}
                                </Typography>
                                <Typography variant="caption" color="textSecondary">
                                  {meetings.find(m => m.id === res.meetingId)?.committee}
                                </Typography>
                              </Box>
                              <Chip 
                                icon={<HowToVote />}
                                label="VOTE NOW" 
                                color="error"
                                sx={{ animation: 'pulse 2s infinite' }}
                              />
                            </Box>

                            <Box mb={2}>
                              <Typography variant="caption" color="textSecondary">
                                Voting Period: {new Date(res.votingPeriod.start).toLocaleString()} - {new Date(res.votingPeriod.end).toLocaleString()}
                              </Typography>
                            </Box>

                            <Box display="flex" gap={2} mb={2}>
                              <Box flex={1}>
                                <Typography variant="caption" color="textSecondary">
                                  Quorum Required
                                </Typography>
                                <LinearProgress 
                                  variant="determinate" 
                                  value={res.quorum.achieved} 
                                  sx={{ height: 8, borderRadius: 4, mt: 0.5 }}
                                  color={res.quorum.achieved >= res.quorum.required ? "success" : "warning"}
                                />
                                <Typography variant="caption">
                                  {res.quorum.achieved.toFixed(1)}% / {res.quorum.required}%
                                </Typography>
                              </Box>
                              <Box flex={1}>
                                <Typography variant="caption" color="textSecondary">
                                  Current Status
                                </Typography>
                                <Typography variant="body2">
                                  {res.votes?.length || 0} / {res.eligibleVoters.length} voted
                                </Typography>
                              </Box>
                            </Box>

                            <Box display="flex" gap={2} justifyContent="flex-end">
                              <Button 
                                variant="outlined" 
                                color="success"
                                startIcon={<ThumbUp />}
                                onClick={() => handleCastVote(res.id, 'For')}
                              >
                                Vote For
                              </Button>
                              <Button 
                                variant="outlined" 
                                color="error"
                                startIcon={<ThumbDown />}
                                onClick={() => handleCastVote(res.id, 'Against')}
                              >
                                Vote Against
                              </Button>
                              <Button 
                                variant="outlined"
                                onClick={() => handleCastVote(res.id, 'Abstain')}
                              >
                                Abstain
                              </Button>
                            </Box>
                          </Card>
                        </Grid>
                      ))}
                  </Grid>
                </Box>
              )}

              {/* All Resolutions */}
              <Typography variant="subtitle1" gutterBottom sx={{ mt: 3 }}>
                All Resolutions
              </Typography>

              <Grid container spacing={2}>
                {resolutions
                  .filter(r => r.status !== 'Voting Open')
                  .map((res) => (
                    <Grid item xs={12} md={6} key={res.id}>
                      <Card 
                        sx={{ 
                          p: 2, 
                          borderLeft: '4px solid',
                          borderLeftColor: res.status === 'Passed' ? 'success.main' : 'error.main'
                        }}
                      >
                        <Box display="flex" justifyContent="space-between" mb={1}>
                          <Typography variant="caption" color="textSecondary">
                            ID: {res.id}
                          </Typography>
                          <Chip 
                            label={res.status} 
                            size="small" 
                            color={res.status === 'Passed' ? 'success' : 'error'}
                          />
                        </Box>

                        <Typography variant="subtitle1" sx={{ mb: 1 }}>
                          {res.text}
                        </Typography>

                        <Typography variant="caption" color="textSecondary" display="block" mb={2}>
                          {meetings.find(m => m.id === res.meetingId)?.committee} • {meetings.find(m => m.id === res.meetingId)?.date}
                        </Typography>

                        <Box display="flex" alignItems="center" gap={2} mb={2}>
                          <Chip 
                            icon={<ThumbUp />} 
                            label={`${res.votesFor} For`} 
                            color="success" 
                            variant="outlined" 
                            size="small"
                          />
                          <Chip 
                            icon={<ThumbDown />} 
                            label={`${res.votesAgainst} Against`} 
                            color="error" 
                            variant="outlined" 
                            size="small"
                          />
                          {res.abstain > 0 && (
                            <Chip 
                              label={`${res.abstain} Abstain`} 
                              variant="outlined" 
                              size="small"
                            />
                          )}
                        </Box>

                        <Box display="flex" justifyContent="space-between" alignItems="center">
                          <Typography variant="caption" color="textSecondary">
                            Quorum: {res.quorum.status}
                          </Typography>
                          {res.implementationStatus && (
                            <Chip 
                              label={res.implementationStatus} 
                              size="small" 
                              variant="outlined"
                              color={res.implementationStatus === 'Completed' ? 'success' : 'primary'}
                            />
                          )}
                        </Box>

                        {res.implementationSteps && res.implementationSteps.length > 0 && (
                          <Box mt={2}>
                            <Accordion>
                              <AccordionSummary expandIcon={<ExpandMore />}>
                                <Typography variant="caption">
                                  Implementation Progress
                                </Typography>
                              </AccordionSummary>
                              <AccordionDetails>
                                <Stepper orientation="vertical" activeStep={res.implementationSteps.filter(s => s.status === 'Completed').length}>
                                  {res.implementationSteps.map((step, index) => (
                                    <Step key={index}>
                                      <StepLabel>
                                        {step.step}
                                        {step.date && (
                                          <Typography variant="caption" display="block" color="textSecondary">
                                            {step.date}
                                          </Typography>
                                        )}
                                      </StepLabel>
                                    </Step>
                                  ))}
                                </Stepper>
                              </AccordionDetails>
                            </Accordion>
                          </Box>
                        )}
                      </Card>
                    </Grid>
                  ))}
              </Grid>

              {resolutions.length === 0 && (
                <Box textAlign="center" py={5}>
                  <Poll sx={{ fontSize: 60, color: 'grey.400' }} />
                  <Typography color="textSecondary" sx={{ mt: 2 }}>
                    No resolutions yet
                  </Typography>
                  <Button 
                    variant="contained" 
                    startIcon={<Add />} 
                    sx={{ mt: 2 }}
                    onClick={() => setOpenResolutionDialog(true)}
                  >
                    Create First Resolution
                  </Button>
                </Box>
              )}
            </Box>
          )}

          {/* =================================================================
              TAB 6: ANALYTICS & REPORTS
          ================================================================= */}
          {tabIndex === 5 && (
            <Box>
              <Typography variant="h6" gutterBottom>Committee Effectiveness & Analytics</Typography>

              {/* Key Metrics */}
              <Grid container spacing={3} mb={4}>
                <Grid item xs={12} md={3}>
                  <Paper sx={{ p: 3, textAlign: 'center', bgcolor: 'primary.light' }}>
                    <Typography variant="h3" fontWeight="bold" color="white">
                      {analytics.avgAttendance}%
                    </Typography>
                    <Typography variant="body2" color="white" fontWeight="bold">Average Attendance</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Paper sx={{ p: 3, textAlign: 'center', bgcolor: 'success.light' }}>
                    <Typography variant="h3" fontWeight="bold" color="white">
                      {analytics.passedResolutions}
                    </Typography>
                    <Typography variant="body2" color="white" fontWeight="bold">Resolutions Passed</Typography>
                    <Typography variant="caption" color="white">
                      {analytics.resolutionPassRate}% pass rate
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Paper sx={{ p: 3, textAlign: 'center', bgcolor: 'warning.light' }}>
                    <Typography variant="h3" fontWeight="bold" color="white">
                      {analytics.actionItemCompletionRate}%
                    </Typography>
                    <Typography variant="body2" color="white" fontWeight="bold">Action Items Completed</Typography>
                    <Typography variant="caption" color="white">
                      {analytics.completedActionItems}/{analytics.totalActionItems} total
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Paper sx={{ p: 3, textAlign: 'center', bgcolor: 'error.light' }}>
                    <Typography variant="h3" fontWeight="bold" color="white">
                      {analytics.overdueActionItems}
                    </Typography>
                    <Typography variant="body2" color="white" fontWeight="bold">Overdue Action Items</Typography>
                  </Paper>
                </Grid>
              </Grid>

              {/* Committee-wise Effectiveness */}
              <Typography variant="subtitle1" gutterBottom sx={{ mt: 3 }}>
                Committee Effectiveness Score
              </Typography>
              {committees.map((c) => {
                const meetingCount = meetings.filter(m => m.committeeId === c.id).length;
                const completedMeetings = meetings.filter(m => m.committeeId === c.id && m.status === 'Completed').length;
                const avgAttendance = meetings
                  .filter(m => m.committeeId === c.id && m.attendance)
                  .reduce((sum, m) => sum + m.attendance.percentage, 0) / 
                  (meetings.filter(m => m.committeeId === c.id && m.attendance).length || 1);

                return (
                  <Box key={c.id} mb={3}>
                    <Card variant="outlined" sx={{ p: 2 }}>
                      <Box display="flex" justifyContent="space-between" mb={1}>
                        <Typography variant="subtitle2" fontWeight="bold">
                          {c.name}
                        </Typography>
                        <Chip 
                          label={`${c.effectiveness}%`} 
                          color={c.effectiveness > 80 ? "success" : c.effectiveness > 60 ? "warning" : "error"}
                          size="small"
                        />
                      </Box>

                      <LinearProgress 
                        variant="determinate" 
                        value={c.effectiveness} 
                        sx={{ height: 10, borderRadius: 5, mb: 2 }} 
                        color={c.effectiveness > 80 ? "success" : c.effectiveness > 60 ? "warning" : "error"}
                      />

                      <Grid container spacing={2}>
                        <Grid item xs={4}>
                          <Typography variant="caption" color="textSecondary">
                            Meetings
                          </Typography>
                          <Typography variant="body2" fontWeight="bold">
                            {completedMeetings}/{meetingCount}
                          </Typography>
                        </Grid>
                        <Grid item xs={4}>
                          <Typography variant="caption" color="textSecondary">
                            Avg. Attendance
                          </Typography>
                          <Typography variant="body2" fontWeight="bold">
                            {avgAttendance.toFixed(1)}%
                          </Typography>
                        </Grid>
                        <Grid item xs={4}>
                          <Typography variant="caption" color="textSecondary">
                            Members
                          </Typography>
                          <Typography variant="body2" fontWeight="bold">
                            {c.members.length}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Card>
                  </Box>
                );
              })}

              {/* Export Options */}
              <Box mt={4} display="flex" gap={2}>
                <Button variant="outlined" startIcon={<Download />}>
                  Export Analytics (PDF)
                </Button>
                <Button variant="outlined" startIcon={<Download />}>
                  Download All MoM
                </Button>
                <Button variant="outlined" startIcon={<Print />}>
                  Print Report
                </Button>
              </Box>
            </Box>
          )}
        </Box>
      </Card>

      {/* ========== DIALOGS ========== */}

      {/* CREATE COMMITTEE DIALOG */}
      <Dialog 
        open={openCommitteeDialog} 
        onClose={() => setOpenCommitteeDialog(false)} 
        maxWidth="md" 
        fullWidth
      >
        <DialogTitle>Create New Committee</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField 
                fullWidth 
                label="Committee Name" 
                value={committeeForm.name}
                onChange={(e) => setCommitteeForm({ ...committeeForm, name: e.target.value })}
                required
              />
            </Grid>

            <Grid item xs={6}>
              <TextField 
                select 
                fullWidth 
                label="Type" 
                value={committeeForm.type}
                onChange={(e) => setCommitteeForm({ ...committeeForm, type: e.target.value })}
              >
                <MenuItem value="Statutory">Statutory</MenuItem>
                <MenuItem value="Advisory">Advisory</MenuItem>
                <MenuItem value="Ad-hoc">Ad-hoc</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={6}>
              <TextField 
                type="date" 
                fullWidth 
                label="Term End Date" 
                InputLabelProps={{ shrink: true }}
                value={committeeForm.termEnd}
                onChange={(e) => setCommitteeForm({ ...committeeForm, termEnd: e.target.value })}
                required
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <Autocomplete
                options={facultyList}
                getOptionLabel={(option) => `${option.name} (${option.dept})`}
                value={committeeForm.chair}
                onChange={(e, newValue) => setCommitteeForm({ ...committeeForm, chair: newValue })}
                renderInput={(params) => (
                  <TextField {...params} label="Select Chairperson *" />
                )}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <Autocomplete
                options={facultyList}
                getOptionLabel={(option) => `${option.name} (${option.dept})`}
                value={committeeForm.convener}
                onChange={(e, newValue) => setCommitteeForm({ ...committeeForm, convener: newValue })}
                renderInput={(params) => (
                  <TextField {...params} label="Select Convener" />
                )}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <Autocomplete
                options={facultyList}
                getOptionLabel={(option) => `${option.name} (${option.dept})`}
                value={committeeForm.secretary}
                onChange={(e, newValue) => setCommitteeForm({ ...committeeForm, secretary: newValue })}
                renderInput={(params) => (
                  <TextField {...params} label="Select Secretary" />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel 
                control={
                  <Checkbox 
                    checked={committeeForm.conflictOfInterestRequired}
                    onChange={(e) => setCommitteeForm({ ...committeeForm, conflictOfInterestRequired: e.target.checked })}
                  />
                } 
                label="Require mandatory Conflict of Interest declaration from all members" 
              />
            </Grid>

            <Grid item xs={12}>
              <Alert severity="info">
                <Typography variant="body2">
                  Members can be added after committee creation from the "Manage Members" option.
                </Typography>
              </Alert>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCommitteeDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveCommittee}>
            Create Committee
          </Button>
        </DialogActions>
      </Dialog>

      {/* SCHEDULE MEETING DIALOG */}
      <Dialog 
        open={openMeetingDialog} 
        onClose={() => setOpenMeetingDialog(false)} 
        maxWidth="md" 
        fullWidth
        PaperProps={{ sx: { minHeight: '80vh' } }}
      >
        <DialogTitle>Schedule New Meeting</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField 
                select 
                fullWidth 
                label="Select Committee *"
                value={meetingForm.committeeId}
                onChange={(e) => setMeetingForm({ ...meetingForm, committeeId: e.target.value })}
              >
                {committees.map(c => (
                  <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <TextField 
                fullWidth 
                label="Meeting Title / Agenda *"
                value={meetingForm.title}
                onChange={(e) => setMeetingForm({ ...meetingForm, title: e.target.value })}
              />
            </Grid>

            <Grid item xs={4}>
              <TextField 
                type="date" 
                fullWidth 
                label="Date *" 
                InputLabelProps={{ shrink: true }}
                value={meetingForm.date}
                onChange={(e) => setMeetingForm({ ...meetingForm, date: e.target.value })}
              />
            </Grid>

            <Grid item xs={4}>
              <TextField 
                type="time" 
                fullWidth 
                label="Time *" 
                InputLabelProps={{ shrink: true }}
                value={meetingForm.time}
                onChange={(e) => setMeetingForm({ ...meetingForm, time: e.target.value })}
              />
            </Grid>

            <Grid item xs={4}>
              <TextField 
                type="number" 
                fullWidth 
                label="Duration (minutes)"
                value={meetingForm.duration}
                onChange={(e) => setMeetingForm({ ...meetingForm, duration: parseInt(e.target.value) })}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField 
                select 
                fullWidth 
                label="Venue / Room"
                value={meetingForm.room}
                onChange={(e) => setMeetingForm({ ...meetingForm, room: e.target.value })}
              >
                <MenuItem value="Conference Hall A">Conference Hall A</MenuItem>
                <MenuItem value="Conference Hall B">Conference Hall B</MenuItem>
                <MenuItem value="Seminar Hall">Seminar Hall</MenuItem>
                <MenuItem value="Board Room">Board Room</MenuItem>
                <MenuItem value="Online">Online Only</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={6}>
              <TextField 
                fullWidth 
                label="Video Conference Link"
                placeholder="https://meet.google.com/..."
                value={meetingForm.videoLink}
                onChange={(e) => setMeetingForm({ ...meetingForm, videoLink: e.target.value })}
              />
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 1 }}>
                <Chip label="Agenda Items" size="small" />
              </Divider>
            </Grid>

            {meetingForm.agenda.map((item, index) => (
              <React.Fragment key={index}>
                <Grid item xs={6}>
                  <TextField 
                    fullWidth 
                    label={`Topic ${index + 1}`}
                    value={item.topic}
                    onChange={(e) => {
                      const newAgenda = [...meetingForm.agenda];
                      newAgenda[index].topic = e.target.value;
                      setMeetingForm({ ...meetingForm, agenda: newAgenda });
                    }}
                  />
                </Grid>
                <Grid item xs={3}>
                  <TextField 
                    type="number" 
                    fullWidth 
                    label="Duration (min)"
                    value={item.duration}
                    onChange={(e) => {
                      const newAgenda = [...meetingForm.agenda];
                      newAgenda[index].duration = parseInt(e.target.value);
                      setMeetingForm({ ...meetingForm, agenda: newAgenda });
                    }}
                  />
                </Grid>
                <Grid item xs={3}>
                  <TextField 
                    fullWidth 
                    label="Presenter"
                    value={item.presenter}
                    onChange={(e) => {
                      const newAgenda = [...meetingForm.agenda];
                      newAgenda[index].presenter = e.target.value;
                      setMeetingForm({ ...meetingForm, agenda: newAgenda });
                    }}
                  />
                </Grid>
              </React.Fragment>
            ))}

            <Grid item xs={12}>
              <Button 
                startIcon={<Add />} 
                onClick={() => {
                  setMeetingForm({
                    ...meetingForm,
                    agenda: [...meetingForm.agenda, { topic: "", duration: 30, presenter: "", documents: [] }]
                  });
                }}
              >
                Add Agenda Item
              </Button>
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 1 }}>
                <Chip label="Options" size="small" />
              </Divider>
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel 
                control={
                  <Checkbox 
                    checked={meetingForm.recurring}
                    onChange={(e) => setMeetingForm({ ...meetingForm, recurring: e.target.checked })}
                  />
                } 
                label="Recurring Meeting" 
              />
              <FormControlLabel 
                control={
                  <Checkbox 
                    checked={meetingForm.rsvpRequired}
                    onChange={(e) => setMeetingForm({ ...meetingForm, rsvpRequired: e.target.checked })}
                  />
                } 
                label="Require RSVP from Members" 
              />
            </Grid>

            {meetingForm.recurring && (
              <>
                <Grid item xs={6}>
                  <TextField 
                    select 
                    fullWidth 
                    label="Frequency"
                    value={meetingForm.recurringPattern.frequency}
                    onChange={(e) => setMeetingForm({
                      ...meetingForm,
                      recurringPattern: { ...meetingForm.recurringPattern, frequency: e.target.value }
                    })}
                  >
                    <MenuItem value="Weekly">Weekly</MenuItem>
                    <MenuItem value="Bi-weekly">Bi-weekly</MenuItem>
                    <MenuItem value="Monthly">Monthly</MenuItem>
                    <MenuItem value="Quarterly">Quarterly</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={6}>
                  <TextField 
                    select 
                    fullWidth 
                    label="End Type"
                    value={meetingForm.recurringPattern.endType}
                    onChange={(e) => setMeetingForm({
                      ...meetingForm,
                      recurringPattern: { ...meetingForm.recurringPattern, endType: e.target.value }
                    })}
                  >
                    <MenuItem value="Never">Never</MenuItem>
                    <MenuItem value="After X occurrences">After X occurrences</MenuItem>
                    <MenuItem value="By date">By date</MenuItem>
                  </TextField>
                </Grid>
              </>
            )}

            <Grid item xs={12}>
              <Button 
                component="label" 
                startIcon={<AttachFile />} 
                variant="outlined"
                fullWidth
              >
                Upload Pre-meeting Documents
                <input type="file" hidden multiple />
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setOpenMeetingDialog(false);
            resetMeetingForm();
          }}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleScheduleMeeting} startIcon={<Event />}>
            Schedule & Send Invites
          </Button>
        </DialogActions>
      </Dialog>

      {/* MINUTES (MOM) DIALOG */}
      <Dialog 
        open={openMinutesDialog} 
        onClose={() => setOpenMinutesDialog(false)} 
        maxWidth="lg" 
        fullWidth
        PaperProps={{ sx: { minHeight: '90vh' } }}
      >
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">
              Record Minutes: {selectedMeeting?.title}
            </Typography>
            <Chip 
              label={minutesData.status} 
              color={
                minutesData.status === 'Approved' ? 'success' : 
                minutesData.status === 'Under Review' ? 'warning' : 
                'default'
              }
            />
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          <Tabs value={0} sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}>
            <Tab label="Attendance" />
            <Tab label="Minutes & Discussions" />
            <Tab label="Action Items & Decisions" />
          </Tabs>

          {/* Attendance Section */}
          <Box mb={4}>
            <Typography variant="subtitle2" gutterBottom>Member Attendance</Typography>
            <Alert severity="info" sx={{ mb: 2 }}>
              Click on members to toggle their attendance status
            </Alert>

            <Box display="flex" flexWrap="wrap" gap={2}>
              {selectedMeeting && committees
                .find(c => c.name === selectedMeeting.committee)
                ?.members.map(member => {
                  const isPresent = minutesData.attendees.present.includes(member.id);
                  const isAbsent = minutesData.attendees.absent.includes(member.id);
                  const isExcused = minutesData.attendees.excused.includes(member.id);
                  const isLate = minutesData.attendees.late.includes(member.id);

                  return (
                    <Chip 
                      key={member.id}
                      avatar={<Avatar>{member.name[0]}</Avatar>} 
                      label={member.name}
                      onClick={() => {
                        // Toggle between Present -> Absent -> Excused -> Late -> Present
                        let newAttendees = { ...minutesData.attendees };
                        
                        if (isPresent) {
                          newAttendees.present = newAttendees.present.filter(id => id !== member.id);
                          newAttendees.absent = [...newAttendees.absent, member.id];
                        } else if (isAbsent) {
                          newAttendees.absent = newAttendees.absent.filter(id => id !== member.id);
                          newAttendees.excused = [...newAttendees.excused, member.id];
                        } else if (isExcused) {
                          newAttendees.excused = newAttendees.excused.filter(id => id !== member.id);
                          newAttendees.late = [...newAttendees.late, member.id];
                        } else {
                          newAttendees.late = newAttendees.late.filter(id => id !== member.id);
                          newAttendees.present = [...newAttendees.present, member.id];
                        }

                        setMinutesData({ ...minutesData, attendees: newAttendees });
                      }}
                      color={
                        isPresent ? 'success' :
                        isAbsent ? 'error' :
                        isExcused ? 'warning' :
                        isLate ? 'info' :
                        'default'
                      }
                      variant={isPresent || isAbsent || isExcused || isLate ? 'filled' : 'outlined'}
                      deleteIcon={
                        isPresent ? <CheckCircle /> :
                        isAbsent ? <Cancel /> :
                        isExcused ? <Warning /> :
                        isLate ? <AccessTime /> :
                        <Person />
                      }
                      onDelete={() => {}}
                    />
                  );
                })}
            </Box>

            <Box mt={2} display="flex" gap={2}>
              <Chip icon={<CheckCircle />} label={`Present: ${minutesData.attendees.present.length}`} color="success" size="small" />
              <Chip icon={<Cancel />} label={`Absent: ${minutesData.attendees.absent.length}`} color="error" size="small" />
              <Chip icon={<Warning />} label={`Excused: ${minutesData.attendees.excused.length}`} color="warning" size="small" />
              <Chip icon={<AccessTime />} label={`Late: ${minutesData.attendees.late.length}`} color="info" size="small" />
            </Box>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Minutes Content */}
          <Box mb={4}>
            <Typography variant="subtitle2" gutterBottom>Meeting Minutes (Detailed Discussion)</Typography>
            <ReactQuill 
              value={minutesData.content}
              onChange={(content) => setMinutesData({ ...minutesData, content })}
              modules={{
                toolbar: [
                  [{ 'header': [1, 2, 3, false] }],
                  ['bold', 'italic', 'underline'],
                  [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                  ['link'],
                  ['clean']
                ]
              }}
              style={{ height: '300px', marginBottom: '50px' }}
            />
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Action Items */}
          <Box mb={4}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="subtitle2">Action Items from this Meeting</Typography>
              <Button 
                size="small" 
                startIcon={<Add />}
                onClick={() => setOpenActionItemDialog(true)}
              >
                Add Action Item
              </Button>
            </Box>

            <List dense sx={{ bgcolor: 'grey.50', borderRadius: 1 }}>
              {minutesData.actionItems.map((item, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    <Assignment color="action" />
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.description}
                    secondary={`Assigned to: ${item.assignedToName} | Due: ${item.dueDate} | Priority: ${item.priority}`}
                  />
                  <IconButton size="small" onClick={() => {
                    setMinutesData({
                      ...minutesData,
                      actionItems: minutesData.actionItems.filter((_, i) => i !== index)
                    });
                  }}>
                    <Delete />
                  </IconButton>
                </ListItem>
              ))}
              {minutesData.actionItems.length === 0 && (
                <ListItem>
                  <ListItemText 
                    primary="No action items yet"
                    secondary="Click 'Add Action Item' to create tasks"
                  />
                </ListItem>
              )}
            </List>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Decisions/Resolutions */}
          <Box mb={4}>
            <Typography variant="subtitle2" gutterBottom>Decisions & Resolutions</Typography>
            {/* This would integrate with the resolution creation */}
            <Typography variant="body2" color="textSecondary">
              Resolutions can be added from the "Voting & Resolutions" tab
            </Typography>
          </Box>

          {/* Next Meeting */}
          <Box mb={2}>
            <TextField 
              type="date"
              fullWidth
              label="Next Meeting Date (Optional)"
              InputLabelProps={{ shrink: true }}
              value={minutesData.nextMeetingDate}
              onChange={(e) => setMinutesData({ ...minutesData, nextMeetingDate: e.target.value })}
            />
          </Box>

          {/* Upload Signed MoM */}
          <Box>
            <Button 
              component="label" 
              startIcon={<CloudUpload />}
              variant="outlined"
              fullWidth
            >
              Upload Signed MoM (PDF)
              <input 
                type="file" 
                hidden 
                accept="application/pdf"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setMinutesData({ ...minutesData, momFile: e.target.files[0].name });
                  }
                }}
              />
            </Button>
            {minutesData.momFile && (
              <Typography variant="caption" color="success.main" sx={{ mt: 1, display: 'block' }}>
                ✓ {minutesData.momFile} attached
              </Typography>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => {
              setMinutesData({ ...minutesData, status: 'Draft' });
              handleSaveMinutes();
            }}
          >
            Save as Draft
          </Button>
          <Button 
            variant="outlined"
            onClick={() => {
              setMinutesData({ ...minutesData, status: 'Under Review' });
              handleSaveMinutes();
            }}
          >
            Submit for Review
          </Button>
          <Button 
            variant="contained" 
            color="success"
            onClick={() => {
              setMinutesData({ ...minutesData, status: 'Approved' });
              handleSaveMinutes();
            }}
          >
            Approve & Publish
          </Button>
        </DialogActions>
      </Dialog>

      {/* MEMBER MANAGEMENT DIALOG */}
      <Dialog 
        open={openMemberDialog} 
        onClose={() => setOpenMemberDialog(false)} 
        maxWidth="md" 
        fullWidth
      >
        <DialogTitle>
          Manage Members: {selectedCommittee?.name}
        </DialogTitle>
        <DialogContent dividers>
          {/* Add Member Section */}
          <Box mb={3}>
            <Typography variant="subtitle2" gutterBottom>Add New Member</Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Autocomplete
                  options={facultyList}
                  getOptionLabel={(option) => `${option.name} (${option.dept})`}
                  renderInput={(params) => (
                    <TextField {...params} label="Select Faculty" size="small" />
                  )}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField 
                  select 
                  fullWidth 
                  label="Role" 
                  size="small"
                  defaultValue="Member"
                >
                  <MenuItem value="Member">Member</MenuItem>
                  <MenuItem value="Secretary">Secretary</MenuItem>
                  <MenuItem value="Co-Convener">Co-Convener</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={2}>
                <Button variant="contained" fullWidth sx={{ height: '40px' }}>Add</Button>
              </Grid>
            </Grid>
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* Current Members */}
          <Typography variant="subtitle2" gutterBottom>Current Members</Typography>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Term</TableCell>
                <TableCell>Attendance</TableCell>
                <TableCell>COI Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {selectedCommittee?.members.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Avatar sx={{ width: 24, height: 24, fontSize: 12 }}>
                        {member.name[0]}
                      </Avatar>
                      <Typography variant="body2">{member.name}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip label={member.role} size="small" />
                  </TableCell>
                  <TableCell>
                    <Typography variant="caption">
                      {member.joinDate} - {member.termEnd}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {member.attendance.percentage.toFixed(1)}%
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={member.conflictOfInterest.declared ? "Declared" : "Pending"} 
                      size="small"
                      color={member.conflictOfInterest.declared ? "success" : "warning"}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton size="small">
                      <Edit />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      color="error"
                      onClick={() => handleRemoveMember(selectedCommittee.id, member.id)}
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {selectedCommittee?.members.length === 0 && (
            <Box textAlign="center" py={3}>
              <Typography color="textSecondary">No members added yet</Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenMemberDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* ACTION ITEM DIALOG */}
      <Dialog 
        open={openActionItemDialog} 
        onClose={() => setOpenActionItemDialog(false)} 
        maxWidth="sm" 
        fullWidth
      >
        <DialogTitle>Create Action Item</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField 
                select 
                fullWidth 
                label="Meeting"
                value={actionItemForm.meetingId}
                onChange={(e) => setActionItemForm({ ...actionItemForm, meetingId: e.target.value })}
              >
                {meetings.map(m => (
                  <MenuItem key={m.id} value={m.id}>
                    {m.title} ({m.committee})
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <TextField 
                fullWidth 
                multiline 
                rows={3}
                label="Action Item Description *"
                value={actionItemForm.description}
                onChange={(e) => setActionItemForm({ ...actionItemForm, description: e.target.value })}
              />
            </Grid>

            <Grid item xs={12}>
              <Autocomplete
                options={facultyList}
                getOptionLabel={(option) => `${option.name} (${option.dept})`}
                value={facultyList.find(f => f.id === actionItemForm.assignedTo) || null}
                onChange={(e, newValue) => setActionItemForm({ ...actionItemForm, assignedTo: newValue?.id || null })}
                renderInput={(params) => (
                  <TextField {...params} label="Assign To *" />
                )}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField 
                type="date" 
                fullWidth 
                label="Due Date *" 
                InputLabelProps={{ shrink: true }}
                value={actionItemForm.dueDate}
                onChange={(e) => setActionItemForm({ ...actionItemForm, dueDate: e.target.value })}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField 
                select 
                fullWidth 
                label="Priority"
                value={actionItemForm.priority}
                onChange={(e) => setActionItemForm({ ...actionItemForm, priority: e.target.value })}
              >
                <MenuItem value="Low">Low</MenuItem>
                <MenuItem value="Medium">Medium</MenuItem>
                <MenuItem value="High">High</MenuItem>
                <MenuItem value="Critical">Critical</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setOpenActionItemDialog(false);
            resetActionItemForm();
          }}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleSaveActionItem}>
            Create Action Item
          </Button>
        </DialogActions>
      </Dialog>

      {/* RESOLUTION DIALOG */}
      <Dialog 
        open={openResolutionDialog} 
        onClose={() => setOpenResolutionDialog(false)} 
        maxWidth="sm" 
        fullWidth
      >
        <DialogTitle>Create New Resolution</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField 
                select 
                fullWidth 
                label="Select Meeting *"
                value={resolutionForm.meetingId}
                onChange={(e) => setResolutionForm({ ...resolutionForm, meetingId: e.target.value })}
              >
                {meetings.map(m => (
                  <MenuItem key={m.id} value={m.id}>
                    {m.title} ({m.committee})
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <TextField 
                fullWidth 
                multiline 
                rows={4}
                label="Resolution Text *"
                placeholder="e.g., Approve budget allocation of ₹5 Lakhs for..."
                value={resolutionForm.text}
                onChange={(e) => setResolutionForm({ ...resolutionForm, text: e.target.value })}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField 
                select 
                fullWidth 
                label="Voting Method"
                value={resolutionForm.votingMethod}
                onChange={(e) => setResolutionForm({ ...resolutionForm, votingMethod: e.target.value })}
              >
                <MenuItem value="Show of Hands">Show of Hands (During Meeting)</MenuItem>
                <MenuItem value="Secret Ballot">Secret Ballot (During Meeting)</MenuItem>
                <MenuItem value="Electronic">Electronic (Async E-Voting)</MenuItem>
              </TextField>
            </Grid>

            {resolutionForm.votingMethod === "Electronic" && (
              <>
                <Grid item xs={6}>
                  <TextField 
                    type="datetime-local" 
                    fullWidth 
                    label="Voting Start Time" 
                    InputLabelProps={{ shrink: true }}
                    value={resolutionForm.votingStartTime}
                    onChange={(e) => setResolutionForm({ ...resolutionForm, votingStartTime: e.target.value })}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField 
                    type="datetime-local" 
                    fullWidth 
                    label="Voting End Time" 
                    InputLabelProps={{ shrink: true }}
                    value={resolutionForm.votingEndTime}
                    onChange={(e) => setResolutionForm({ ...resolutionForm, votingEndTime: e.target.value })}
                  />
                </Grid>
              </>
            )}

            <Grid item xs={12}>
              <TextField 
                type="number" 
                fullWidth 
                label="Quorum Required (%)"
                value={resolutionForm.quorumRequired}
                onChange={(e) => setResolutionForm({ ...resolutionForm, quorumRequired: parseInt(e.target.value) })}
                InputProps={{
                  endAdornment: <InputAdornment position="end">%</InputAdornment>
                }}
              />
              <Typography variant="caption" color="textSecondary">
                Minimum percentage of members required to vote for resolution to be valid
              </Typography>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setOpenResolutionDialog(false);
            resetResolutionForm();
          }}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleCreateResolution}>
            Create Resolution
          </Button>
        </DialogActions>
      </Dialog>

      {/* SNACKBAR */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={4000} 
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CommitteeManagementView;