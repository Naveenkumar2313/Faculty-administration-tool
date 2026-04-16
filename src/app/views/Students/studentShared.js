// Shared items and mock data for the Students portal

export const fontHead = "'Sora', sans-serif";
export const fontBody = "'Nunito', sans-serif";
export const fontMono = "'JetBrains Mono', monospace";

export const Fonts = () => `
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700;800&family=Nunito:wght@400;600;700;800&family=Sora:wght@400;600;700;800&display=swap');
.fade-up { animation: fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; transform: translateY(15px); }
@keyframes fadeUp { to { opacity: 1; transform: translateY(0); } }
.row-hover { transition: all 0.2s; }
.row-hover:hover { background-color: #f8fafc; }
.custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
`;

export const T = {
    bg: "#F8FAFC",
    surface: "#FFFFFF",
    border: "#E2E8F0",
    text: "#0F172A",
    textSub: "#475569",
    textMute: "#94A3B8",
    accent: "#6366F1",
    accentLight: "#EEF2FF",
    success: "#10B981",
    successLight: "#ECFDF5",
    warning: "#F59E0B",
    warningLight: "#FFFBEB",
    danger: "#EF4444",
    dangerLight: "#FEF2F2",
    info: "#3B82F6",
    infoLight: "#EFF6FF",
    teal: "#14B8A6",
    tealLight: "#F0FDFA",
    purple: "#8B5CF6",
    purpleLight: "#F5F3FF",
    pink: "#EC4899",
    pinkLight: "#FDF2F8",
};

export const statusColors = {
    "Active": { bg: T.successLight, color: T.success },
    "Pending": { bg: T.warningLight, color: T.warning },
    "Approved": { bg: T.successLight, color: T.success },
    "Rejected": { bg: T.dangerLight, color: T.danger },
    "Resolved": { bg: T.successLight, color: T.success },
    "In Progress": { bg: T.accentLight, color: T.accent },
    "Expired": { bg: T.textMute + "30", color: T.textSub },
    "Upcoming": { bg: T.infoLight, color: T.info },
    "Completed": { bg: T.successLight, color: T.success },
    "Cancelled": { bg: T.dangerLight, color: T.danger },
};

// Current Student Profile
export const currentStudent = {
    name: "Arjun Reddy",
    id: "ST-2023-0145",
    course: "B.Tech Computer Science",
    year: "3rd Year",
    hostel: "Block A",
    room: "A-214",
    bed: "Bed 2",
    bloodGroup: "O+",
    phone: "+91 91234 56789",
    email: "arjun.reddy@student.edu",
    messPlan: "Standard (Veg + Non-Veg)",
    busPass: "BP-5092 (Route 4)",
    parkingPass: "Valid"
};

// Announcements
export const mockAnnouncements = [
    { id: 1, title: "Semester Exams Timetable", date: "Apr 20, 2026", type: "Academic", content: "The schedule for Even Semester exams is released on the noticeboard." },
    { id: 2, title: "Hostel Maintenance Scheduled", date: "Apr 18, 2026", type: "Hostel", content: "Water supply will be affected in Block A from 10 AM to 2 PM." },
    { id: 3, title: "Tech Fest 2026 Registrations", date: "Apr 15, 2026", type: "Event", content: "Register early for hackathons and coding competitions." },
];

export const mockRoommates = [
    { id: "ST-2023-0145", name: "Arjun Reddy", bed: "Bed 2", phone: "+91 91234 56789", isMe: true },
    { id: "ST-2023-0112", name: "Siddharth Iyer", bed: "Bed 1", phone: "+91 98765 43210", isMe: false },
    { id: "ST-2023-0233", name: "Rahul Sharma", bed: "Bed 3", phone: "+91 99887 76655", isMe: false }
];

export const mockExitPasses = [
    { id: "EP-402", applied: "Apr 10, 2026", purpose: "Going home for weekend", outTime: "Apr 11 05:00 PM", expectedIn: "Apr 13 08:00 AM", status: "Approved" },
    { id: "EP-455", applied: "Apr 24, 2026", purpose: "Medical reasoning", outTime: "Apr 25 10:00 AM", expectedIn: "Apr 25 04:00 PM", status: "Pending" }
];

export const mockAttendance = Array.from({ length: 30 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const day = d.getDay();
    // Sunday or occasional absence
    let stat = (day === 0 || i === 5 || i === 12) ? "Absent" : "Present";
    return { date: d.toLocaleDateString(), status: stat, time: stat === 'Present' ? "09:45 PM" : "-" };
});

export const mockMessMenu = {
    Breakfast: ["Idli & Vada", "Sambar", "Coconut Chutney", "Bread & Jam", "Tea/Coffee"],
    Lunch: ["Chapati", "Jeera Rice", "Dal Fry", "Paneer Butter Masala", "Curd", "Gulab Jamun"],
    Snacks: ["Samosa", "Mint Chutney", "Tea/Coffee"],
    Dinner: ["Phulka", "Steamed Rice", "Mixed Veg Curry", "Rasam", "Papad", "Banana"]
};

export const mockComplaints = [
    { id: "COMP-101", category: "Electrical", room: "A-214", desc: "Ceiling fan making loud noise", date: "Apr 15, 2026", status: "Resolved" },
    { id: "COMP-112", category: "Plumbing", room: "A-214", desc: "Bathroom sink draining very slowly", date: "Apr 17, 2026", status: "In Progress" },
];

export const mockBookings = [
    { id: "BK-802", space: "Study Room B", date: "Apr 18, 2026", time: "06:00 PM - 08:00 PM", status: "Upcoming" },
    { id: "BK-745", space: "Tennis Court 1", date: "Apr 12, 2026", time: "05:00 PM - 06:00 PM", status: "Completed" },
];
