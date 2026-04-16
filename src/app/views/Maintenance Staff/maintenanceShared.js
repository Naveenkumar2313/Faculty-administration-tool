export const fontHead = "'Plus Jakarta Sans', sans-serif";
export const fontBody = "'Inter', sans-serif";
export const fontMono = "'JetBrains Mono', monospace";

export const T = {
    bg: "#F8FAFC",
    surface: "#FFFFFF",
    border: "#E2E8F0",
    text: "#0F172A",
    textSub: "#64748B",
    textMute: "#94A3B8",
    primary: "#D97706", // Amber
    primaryLight: "#FEF3C7",
    success: "#16A34A",
    successLight: "#DCFCE7",
    info: "#2563EB",
    infoLight: "#DBEAFE",
    error: "#DC2626",
    errorLight: "#FEE2E2",
};

export const statusColors = {
    "Pending": { bg: T.errorLight, color: T.error },
    "In Progress": { bg: T.primaryLight, color: T.primary },
    "Completed": { bg: T.successLight, color: T.success },
    "Approved": { bg: T.successLight, color: T.success },
    "Rejected": { bg: T.errorLight, color: T.error },
    "Checked-In": { bg: T.successLight, color: T.success },
    "Absent": { bg: T.errorLight, color: T.error },
};

export const Fonts = () => `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600;700&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap');
    
    .fade-up {
        animation: fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        opacity: 0;
        transform: translateY(12px);
    }
    
    @keyframes fadeUp {
        0% { opacity: 0; transform: translateY(12px); }
        100% { opacity: 1; transform: translateY(0); }
    }
    
    .row-hover {
        transition: background-color 0.2s;
    }
    .row-hover:hover {
        background-color: #F8FAFC;
    }
`;

export const currentStaff = {
    id: "MNT-40291",
    name: "Ramesh Kumar",
    trade: "Electrician",
    contact: "+91 98765 43210"
};

export const mockWorkOrders = [
    { id: "WO-2026-031", location: "Boys Hostel A - Room 102", issue: "Ceiling fan regulator not working", priority: "High", status: "In Progress", date: "2026-04-16", deadline: "Today" },
    { id: "WO-2026-028", location: "Academic Block - Lab 3", issue: "Multiple power sockets burnt", priority: "High", status: "Pending", date: "2026-04-17", deadline: "Today" },
    { id: "WO-2026-004", location: "Library - 2nd Floor", issue: "Flickering lights in reading zone", priority: "Low", status: "Completed", date: "2026-04-11", deadline: "2026-04-12" },
];

export const mockMaterialLogs = [
    { id: "REQ-012", workOrder: "WO-2026-031", items: "1x 5-step Regulator, Wire tape", date: "2026-04-16", status: "Approved" },
    { id: "REQ-011", workOrder: "WO-2026-028", items: "3x 15A Sockets, 2x Switches", date: "2026-04-16", status: "Pending" },
    { id: "REQ-002", workOrder: "WO-2026-004", items: "5x LED Tube lights (20W)", date: "2026-04-11", status: "Approved" }
];
