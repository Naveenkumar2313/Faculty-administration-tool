// Shared items and mock data for the Drivers portal

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
    // Shared Statuses
    "Active": { bg: T.successLight, color: T.success },
    "Pending": { bg: T.warningLight, color: T.warning },
    "Approved": { bg: T.successLight, color: T.success },
    "Rejected": { bg: T.dangerLight, color: T.danger },
    "Resolved": { bg: T.successLight, color: T.success },

    // Attendance
    "Checked In": { bg: T.successLight, color: T.success },
    "Checked Out": { bg: T.textMute + "30", color: T.textSub },
    "On leave": { bg: T.purpleLight, color: T.purple },

    // Trips
    "Upcoming": { bg: T.infoLight, color: T.info },
    "In Progress": { bg: T.accentLight, color: T.accent },
    "Completed": { bg: T.successLight, color: T.success },

    // Condition
    "Good": { bg: T.successLight, color: T.success },
    "Needs Attention": { bg: T.warningLight, color: T.warning },
    "Critical": { bg: T.dangerLight, color: T.danger },
};

// Driver info mock
export const currentUser = {
    name: "Rajesh Kumar",
    id: "DRV-1024",
    busAssigned: "KA-01-HG-1024",
    routeAssigned: "Route 4 - HSR Layout",
    shift: "Morning (06:00 AM - 02:00 PM)",
    phone: "+91 9876543210",
    licenseExpiry: "2027-05-15",
    rating: 4.8
};

// Mock data: Today's schedule
export const todaySchedule = [
    { tripId: "TRP-801", type: "Pickup", time: "06:30 AM", start: "HSR Layout Sec 2", end: "Campus Main Gate", status: "Completed", passengers: 42 },
    { tripId: "TRP-802", type: "Drop-off", time: "12:15 PM", start: "Campus Main Gate", end: "HSR Layout Sec 2", status: "Upcoming", passengers: 0 },
];

// Mock data: Stops for Route 4
export const routeStops = [
    { id: 1, name: "HSR Layout Sec 2", time: "06:30 AM", lat: 12.9116, lng: 77.6389, boarded: 12 },
    { id: 2, name: "HSR BDA Complex", time: "06:45 AM", lat: 12.9121, lng: 77.6446, boarded: 15 },
    { id: 3, name: "Agara Junction", time: "07:00 AM", lat: 12.9234, lng: 77.6404, boarded: 8 },
    { id: 4, name: "Koramangala Block 3", time: "07:15 AM", lat: 12.9279, lng: 77.6271, boarded: 7 },
    { id: 5, name: "Campus Main Gate", time: "07:45 AM", lat: 12.9716, lng: 77.5946, boarded: 0 },
];

// Mock data: Trip History
export const tripHistory = Array.from({ length: 15 }).map((_, i) => ({
    id: `TRP-7${80 - i}`,
    date: new Date(Date.now() - (i + 1) * 86400000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    type: i % 2 === 0 ? "Pickup" : "Drop-off",
    route: "Route 4 - HSR Layout",
    passengers: Math.floor(Math.random() * 20) + 25,
    status: "Completed",
    duration: Math.floor(Math.random() * 15) + 65, // mins
}));

// Mock data: Leaves
export const leaveApplications = [
    { id: "L-112", type: "Sick Leave", from: "Apr 10, 2026", to: "Apr 11, 2026", reason: "Viral Fever", status: "Approved", appliedOn: "Apr 09, 2026" },
    { id: "L-084", type: "Casual Leave", from: "Mar 15, 2026", to: "Mar 16, 2026", reason: "Family Function", status: "Approved", appliedOn: "Mar 10, 2026" },
    { id: "L-145", type: "Earned Leave", from: "May 01, 2026", to: "May 05, 2026", reason: "Vacation", status: "Pending", appliedOn: "Apr 14, 2026" },
];

// Mock data: Incidents
export const reportedIncidents = [
    { id: "INC-204", date: "Apr 05, 2026", time: "07:20 AM", type: "Vehicle Breakdown", location: "Agara Junction", severity: "Medium", status: "Resolved" },
    { id: "INC-188", date: "Mar 22, 2026", time: "04:30 PM", type: "Traffic Incident", location: "Koramangala", severity: "Low", status: "Resolved" },
    { id: "INC-215", date: "Apr 16, 2026", time: "06:40 AM", type: "Passenger Complaint", location: "HSR Layout Sec 2", severity: "Low", status: "Pending" },
];

// Mock data: Fuel Logs
export const fuelLogs = [
    { id: "FL-502", date: "Apr 16, 2026", station: "HP Petrol Pump, HSR", amount: "50", cost: "4,850", odometer: "45,200", efficiency: "4.5" },
    { id: "FL-485", date: "Apr 10, 2026", station: "Shell, Koramangala", amount: "48", cost: "4,700", odometer: "44,984", efficiency: "4.3" },
    { id: "FL-466", date: "Apr 04, 2026", station: "HP Petrol Pump, HSR", amount: "52", cost: "5,044", odometer: "44,760", efficiency: "4.6" },
];

// Mock data: Condition Reports
export const conditionReports = [
    { id: "BCR-305", date: "Apr 17, 2026", time: "05:45 AM", status: "Good", notes: "All check passed", tires: "Good", brakes: "Good", lights: "Good", fluids: "Good" },
    { id: "BCR-304", date: "Apr 16, 2026", time: "05:50 AM", status: "Needs Attention", notes: "Left indicator flickering", tires: "Good", brakes: "Good", lights: "Needs Attention", fluids: "Good" },
    { id: "BCR-303", date: "Apr 15, 2026", time: "05:45 AM", status: "Good", notes: "All check passed", tires: "Good", brakes: "Good", lights: "Good", fluids: "Good" },
];

export const createCustomIcon = (busId, status) => {
    return window.L ? window.L.divIcon({
        className: '',
        html: `
            <div style="background:${status === 'Delayed' ? T.danger : status === 'Good' ? T.success : T.accent}; color:white; font-family:${fontMono}; font-weight:700; font-size:10px; padding:4px 8px; border-radius:12px; border:2px solid white; box-shadow:0 2px 6px rgba(0,0,0,0.2); white-space:nowrap; transform:translate(-50%, -50%);">
                ${busId}
            </div>
        `,
        iconSize: [40, 24]
    }) : null;
};
