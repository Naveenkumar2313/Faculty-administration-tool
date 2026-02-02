import { useState, useEffect } from 'react';

const useCommitteeSystem = () => {
  const [loading, setLoading] = useState(true);

  // 1. My Committees
  const [committees, setCommittees] = useState([
    { id: 1, name: "Board of Studies (BoS) - CSE", role: "Chairperson", appointed: "Jan 10, 2022", members: 12 },
    { id: 2, name: "Academic Council", role: "Member", appointed: "Aug 01, 2021", members: 25 },
    { id: 3, name: "Library Committee", role: "Convener", appointed: "June 20, 2023", members: 8 },
    { id: 4, name: "Internal Complaints (ICC)", role: "Member", appointed: "Mar 15, 2023", members: 5 },
  ]);

  // 2. Meetings (Upcoming & Past)
  const [meetings, setMeetings] = useState([
    {
      id: 101,
      title: "BoS Curriculum Review",
      committee: "Board of Studies (BoS) - CSE",
      date: "Oct 28, 2023",
      time: "10:00 AM",
      venue: "Conference Hall A",
      agenda: "Review of AI Syllabus, New Electives Approval",
      status: "Scheduled",
      myAttendance: "Pending", // Present, Absent, Apology
      canSchedule: true // Because role is Chairperson
    },
    {
      id: 102,
      title: "Library Budget Allocation",
      committee: "Library Committee",
      date: "Nov 05, 2023",
      time: "02:00 PM",
      venue: "Meeting Room 2",
      agenda: "Q4 Book Purchase, Digital Subscription Renewal",
      status: "Scheduled",
      myAttendance: "Pending",
      canSchedule: true // Because role is Convener
    },
    {
      id: 99,
      title: "Quarterly Academic Review",
      committee: "Academic Council",
      date: "Sep 15, 2023",
      time: "11:00 AM",
      venue: "Main Auditorium",
      agenda: "Result Analysis, Admission Stats",
      status: "Completed",
      momAvailable: true,
      myAttendance: "Present",
      canSchedule: false
    }
  ]);

  // 3. Action Items (Tasks assigned to you)
  const [actionItems, setActionItems] = useState([
    { id: 1, task: "Draft Syllabus for 'Ethics in AI'", meeting: "BoS Curriculum Review", deadline: "Nov 10, 2023", status: "In Progress" },
    { id: 2, task: "Collect vendor quotes for Kindle purchase", meeting: "Library Budget Allocation", deadline: "Nov 01, 2023", status: "Pending" },
    { id: 3, task: "Submit Department Result Analysis", meeting: "Quarterly Academic Review", deadline: "Sep 30, 2023", status: "Completed" },
  ]);

  // 4. Resolutions Archive
  const [resolutions, setResolutions] = useState([
    { id: "RES-2023-05", text: "Approved introduction of B.Tech in Data Science starting 2024.", committee: "Academic Council", date: "Sep 15, 2023" },
    { id: "RES-2023-04", text: "Library hours extended to 10 PM during exam weeks.", committee: "Library Committee", date: "June 20, 2023" },
    { id: "RES-2023-03", text: "Revised Anti-Ragging policy v2.0 adopted.", committee: "Anti-Ragging Committee", date: "Jan 10, 2023" },
  ]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 800);
  }, []);

  // --- ACTIONS ---

  const scheduleMeeting = (newMeeting) => {
    setMeetings([...meetings, { ...newMeeting, id: Date.now(), status: "Scheduled", myAttendance: "Pending", canSchedule: true }]);
  };

  const markAttendance = (id, status) => {
    setMeetings(meetings.map(m => m.id === id ? { ...m, myAttendance: status } : m));
  };

  const updateTaskStatus = (id, status) => {
    setActionItems(actionItems.map(t => t.id === id ? { ...t, status } : t));
  };

  return {
    loading,
    committees,
    meetings,
    actionItems,
    resolutions,
    scheduleMeeting,
    markAttendance,
    updateTaskStatus
  };
};

export default useCommitteeSystem;