// ─── Shared Design Tokens, Helpers, Mock Data for Transport-Admin Module ───
import L from "leaflet";

/* ── Design Tokens ── */
export const T = {
    bg: "#F5F7FA", surface: "#FFFFFF", border: "#E4E8EF", text: "#111827", textSub: "#4B5563", textMute: "#9CA3AF",
    accent: "#6366F1", accentLight: "#EEF2FF", success: "#10B981", successLight: "#ECFDF5",
    warning: "#F59E0B", warningLight: "#FFFBEB", danger: "#EF4444", dangerLight: "#FEF2F2",
    info: "#3B82F6", infoLight: "#EFF6FF", purple: "#8B5CF6", purpleLight: "#F5F3FF",
    teal: "#14B8A6", tealLight: "#F0FDFA",
};

export const fontHead = "Sora, Roboto, Helvetica, Arial, sans-serif";
export const fontBody = "Nunito, Roboto, Helvetica, Arial, sans-serif";
export const fontMono = "JetBrains Mono, monospace";

/* ── Google Fonts Loader ── */
export const Fonts = () => `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700&family=Nunito:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600&display=swap');
  * { box-sizing: border-box; }
  @keyframes fadeUp { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:none; } }
  .fade-up { animation: fadeUp 0.35s ease both; }
  .row-hover:hover { background: #F9FAFB !important; transition: background 0.15s; }
  .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
  .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
  .custom-scrollbar::-webkit-scrollbar-thumb { background: #E4E8EF; border-radius: 4px; }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #CBD5E1; }
`;

/* ── Status Color Map ── */
export const statusColors = {
    "On Route": { bg: T.successLight, color: T.success },
    "Maintenance": { bg: T.dangerLight, color: T.danger },
    "Idle": { bg: T.bg, color: T.textSub },
    "Active": { bg: T.successLight, color: T.success },
    "Off-Duty": { bg: T.bg, color: T.textSub },
    "Pending": { bg: T.warningLight, color: T.warning },
    "Expired": { bg: T.dangerLight, color: T.danger },
    "On Time": { bg: T.successLight, color: T.success },
    "Delayed": { bg: T.dangerLight, color: T.danger },
    "Scheduled": { bg: T.infoLight, color: T.info },
    "In Service": { bg: T.successLight, color: T.success },
    "Due Soon": { bg: T.warningLight, color: T.warning },
    "Overdue": { bg: T.dangerLight, color: T.danger },
    "Approved": { bg: T.successLight, color: T.success },
    "Rejected": { bg: T.dangerLight, color: T.danger },
    "Renewed": { bg: T.purpleLight, color: T.purple },
    "Completed": { bg: T.successLight, color: T.success },
    "In Progress": { bg: T.infoLight, color: T.info },
    "Open": { bg: T.warningLight, color: T.warning },
    "Closed": { bg: T.bg, color: T.textSub },
    "Critical": { bg: T.dangerLight, color: T.danger },
    "Normal": { bg: T.successLight, color: T.success },
    "Paid": { bg: T.successLight, color: T.success },
    "Unpaid": { bg: T.dangerLight, color: T.danger },
    "Partial": { bg: T.warningLight, color: T.warning },
    "Present": { bg: T.successLight, color: T.success },
    "Absent": { bg: T.dangerLight, color: T.danger },
    "Late": { bg: T.warningLight, color: T.warning },
    "On Leave": { bg: T.purpleLight, color: T.purple },
};

/* ── Mock Data ── */
export const drivers = Array.from({ length: 10 }, (_, i) => ({
    id: `D-${(i + 1).toString().padStart(2, "0")}`,
    name: ["John Doe", "Jane Smith", "Mike Johnson", "Sarah Williams", "Robert Brown", "Emily Davis", "Michael Wilson", "Lisa Taylor", "David Anderson", "Jennifer Thomas"][i],
    license: `DL-${Math.floor(Math.random() * 90000) + 10000}`,
    phone: `+91 98765-${(i + 10).toString().padStart(4, "0")}`,
    busAssigned: `B-${(i + 1).toString().padStart(2, "0")}`,
    status: i < 8 ? "Active" : "Off-Duty",
    rating: (4 + Math.random()).toFixed(1),
    tripsToday: Math.floor(Math.random() * 6) + 1,
    experience: `${Math.floor(Math.random() * 10) + 2} yrs`,
    licenseExpiry: `${["Jan", "Mar", "Jun", "Sep", "Dec"][i % 5]} ${2025 + (i % 3)}`,
    violations: Math.floor(Math.random() * 3),
    lastTrip: `${Math.floor(Math.random() * 3) + 1}h ago`,
    shift: i % 2 === 0 ? "Morning (6AM–2PM)" : "Evening (2PM–10PM)",
    address: `${Math.floor(Math.random() * 100) + 1}, Sector ${Math.floor(Math.random() * 20) + 1}, Bangalore`,
    emergencyContact: `+91 97654-${(i + 20).toString().padStart(4, "0")}`,
    joinDate: `${["Jan", "Mar", "May", "Jul", "Sep"][i % 5]} ${2018 + (i % 5)}`,
}));

export const routes = Array.from({ length: 10 }, (_, i) => ({
    id: `R-${(i + 1).toString().padStart(2, "0")}`,
    name: `Route ${i + 1} - ${["City Center", "North Campus", "South Campus", "East Wing", "West End", "Downtown", "Suburbs", "Tech Park", "Station", "Airport"][i]}`,
    stops: Math.floor(Math.random() * 10) + 5,
    distance: `${Math.floor(Math.random() * 20) + 5} km`,
    duration: `${Math.floor(Math.random() * 30) + 25} min`,
    busAssigned: `B-${(i + 1).toString().padStart(2, "0")}`,
    studentsOnRoute: Math.floor(Math.random() * 40) + 10,
    frequency: `Every ${Math.floor(Math.random() * 15) + 15} min`,
    firstTrip: "6:30 AM",
    lastTrip: `${Math.floor(Math.random() * 3) + 7}:00 PM`,
    status: i < 8 ? "Active" : "Maintenance",
}));

export const buses = Array.from({ length: 10 }, (_, i) => ({
    id: `B-${(i + 1).toString().padStart(2, "0")}`,
    number: `KA-01-AB-${1234 + i}`,
    route: routes[i].name,
    driver: drivers[i].name,
    capacity: 50,
    occupancy: Math.floor(Math.random() * 30) + 15,
    status: i < 8 ? "On Route" : i === 8 ? "Idle" : "Maintenance",
    fuelLevel: `${Math.floor(Math.random() * 50) + 40}%`,
    lastService: `${["07 Jan", "12 Feb", "22 Mar", "03 Apr", "18 May", "29 Jun", "10 Jul", "21 Aug", "05 Sep", "16 Oct"][i]}, 2025`,
    nextService: `${["07 Apr", "12 May", "22 Jun", "03 Jul", "18 Aug", "29 Sep", "10 Oct", "21 Nov", "05 Dec", "16 Jan"][i]}, 2025`,
    mileage: `${Math.floor(Math.random() * 50000) + 10000} km`,
    year: 2020 + (i % 4),
    make: ["Ashok Leyland", "Tata", "Eicher", "BharatBenz", "Mahindra"][i % 5],
    insuranceExpiry: `${["Mar", "Jun", "Sep", "Dec", "Mar"][i % 5]} 2026`,
    fitnessExpiry: `${["Apr", "Jul", "Oct", "Jan", "Apr"][i % 5]} 2026`,
    gpsDeviceId: `GPS-${1000 + i}`,
}));

const firstNames = ["Liam", "Emma", "Noah", "Olivia", "William", "Ava", "James", "Isabella", "Oliver", "Sophia"];
const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez"];

export const students = Array.from({ length: 50 }, (_, i) => ({
    id: `STU-${2023000 + i}`,
    name: `${firstNames[i % 10]} ${lastNames[Math.floor(i / 5) % 10]}`,
    route: routes[i % 10].name,
    passStatus: i % 10 === 0 ? "Expired" : i % 15 === 0 ? "Pending" : "Active",
    expiryDate: i % 10 === 0 ? "Oct 01, 2023" : "Dec 31, 2025",
    department: ["CSE", "ECE", "Mech", "Civil", "EEE", "IT", "AI&DS", "Chem", "Math", "Physics"][i % 10],
    year: (i % 4) + 1,
    phone: `+91 9${Math.floor(1000000000 + Math.random() * 8999999999).toString().slice(0, 9)}`,
    pickupStop: `Stop ${(i % 8) + 1}`,
    passType: i % 3 === 0 ? "Annual" : "Semester",
    amountPaid: i % 3 === 0 ? "₹18,000" : "₹10,000",
}));

export const faculty = Array.from({ length: 20 }, (_, i) => ({
    id: `FAC-${3000 + i}`,
    name: `${["Dr.", "Prof.", "Mr.", "Ms."][i % 4]} ${firstNames[i % 10]} ${lastNames[(i + 3) % 10]}`,
    department: ["CSE", "ECE", "Mech", "Civil", "EEE", "IT", "AI&DS", "Chem", "Math", "Physics"][i % 10],
    route: routes[i % 10].name,
    passStatus: i % 8 === 0 ? "Expired" : i % 12 === 0 ? "Pending" : "Active",
    expiryDate: i % 8 === 0 ? "Sep 30, 2024" : "Jun 30, 2026",
    phone: `+91 9${Math.floor(1000000000 + Math.random() * 8999999999).toString().slice(0, 9)}`,
    pickupStop: `Stop ${(i % 6) + 1}`,
    passType: i % 2 === 0 ? "Annual" : "Semester",
    amountPaid: i % 2 === 0 ? "₹12,000" : "₹7,000",
    designation: ["Assistant Professor", "Associate Professor", "Professor", "HOD"][i % 4],
}));

export const liveTracking = Array.from({ length: 10 }, (_, i) => ({
    id: `B-${(i + 1).toString().padStart(2, "0")}`,
    currentStop: `Stop ${Math.floor(Math.random() * 5) + 1}`,
    nextStop: `Stop ${Math.floor(Math.random() * 5) + 6}`,
    speed: `${Math.floor(Math.random() * 30) + 20} km/h`,
    status: i % 4 === 0 ? "Delayed" : "On Time",
    lat: 12.9716 + (Math.random() - 0.5) * 0.08,
    lng: 77.5946 + (Math.random() - 0.5) * 0.08,
    eta: `${Math.floor(Math.random() * 15) + 3} min`,
    passengers: Math.floor(Math.random() * 40) + 8,
    route: routes[i].name,
    driver: drivers[i].name,
}));

/* ── Maintenance Records ── */
export const maintenanceRecords = Array.from({ length: 15 }, (_, i) => ({
    id: `MNT-${(i + 1).toString().padStart(3, "0")}`,
    busId: buses[i % 10].id,
    busNumber: buses[i % 10].number,
    type: ["Oil Change", "Brake Inspection", "Tire Replacement", "Engine Tune-up", "AC Service", "Battery Check", "Transmission Service", "Full Service"][i % 8],
    scheduledDate: `${["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i % 12]} ${Math.floor(Math.random() * 28) + 1}, 2025`,
    status: ["Scheduled", "Completed", "In Progress", "Overdue", "Due Soon"][i % 5],
    cost: `₹${(Math.floor(Math.random() * 15) + 2) * 1000}`,
    vendor: ["AutoCare Services", "Fleet Garage", "QuickFix Motors", "Prime Auto Works", "SpeedServ"][i % 5],
    notes: ["Routine maintenance", "Reported unusual noise", "Quarterly check", "Emergency repair needed", "Preventive service"][i % 5],
    completedDate: i % 5 === 1 ? `${["Jan", "Feb", "Mar", "Apr", "May"][i % 5]} ${Math.floor(Math.random() * 28) + 1}, 2025` : null,
    odometer: `${Math.floor(Math.random() * 50000) + 20000} km`,
}));

/* ── Fuel Logs ── */
export const fuelLogs = Array.from({ length: 20 }, (_, i) => ({
    id: `FUEL-${(i + 1).toString().padStart(3, "0")}`,
    busId: buses[i % 10].id,
    busNumber: buses[i % 10].number,
    date: `${["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct"][i % 10]} ${Math.floor(Math.random() * 28) + 1}, 2025`,
    litres: (Math.floor(Math.random() * 40) + 20).toFixed(1),
    costPerLitre: `₹${(Math.random() * 5 + 95).toFixed(2)}`,
    totalCost: `₹${Math.floor(Math.random() * 3000) + 2000}`,
    odometer: `${Math.floor(Math.random() * 50000) + 15000} km`,
    station: ["Indian Oil - MG Road", "HP - Ring Road", "BPCL - Highway", "Shell - Tech Park", "Indian Oil - Station"][i % 5],
    filledBy: drivers[i % 10].name,
    efficiency: `${(Math.random() * 2 + 3).toFixed(1)} km/l`,
}));

/* ── Schedule Data ── */
export const schedules = Array.from({ length: 15 }, (_, i) => ({
    id: `SCH-${(i + 1).toString().padStart(3, "0")}`,
    routeId: routes[i % 10].id,
    routeName: routes[i % 10].name,
    busId: buses[i % 10].id,
    driverId: drivers[i % 10].id,
    driverName: drivers[i % 10].name,
    departure: `${6 + Math.floor(i * 0.8)}:${i % 2 === 0 ? "00" : "30"} AM`,
    arrival: `${7 + Math.floor(i * 0.8)}:${i % 2 === 0 ? "15" : "45"} AM`,
    tripType: i % 3 === 0 ? "Return" : "Pickup",
    status: i < 10 ? "Active" : "Scheduled",
    passengers: Math.floor(Math.random() * 35) + 10,
}));

/* ── Incident Reports ── */
export const incidents = Array.from({ length: 12 }, (_, i) => ({
    id: `INC-${(i + 1).toString().padStart(3, "0")}`,
    driverId: drivers[i % 10].id,
    driverName: drivers[i % 10].name,
    busId: buses[i % 10].id,
    date: `${["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i % 12]} ${Math.floor(Math.random() * 28) + 1}, 2025`,
    type: ["Minor Collision", "Traffic Violation", "Passenger Complaint", "Mechanical Failure", "Route Deviation", "Speed Violation"][i % 6],
    severity: ["Low", "Medium", "High", "Critical"][i % 4],
    description: [
        "Minor scratch on rear bumper during parking",
        "Exceeded speed limit on highway section",
        "Student complaint about rash driving",
        "Engine stalled mid-route, required towing",
        "Deviated from designated route due to road work",
        "Crossed signal during amber light"
    ][i % 6],
    status: ["Open", "In Progress", "Closed", "Closed"][i % 4],
    actionTaken: i % 4 > 1 ? "Warning issued and documented" : null,
    location: `${["MG Road", "Ring Road", "Highway NH-44", "Station Road", "Campus Gate", "Tech Park Junction"][i % 6]}`,
}));

/* ── Driver Attendance ── */
export const driverAttendance = [];
const attendanceStatuses = ["Present", "Absent", "Late", "On Leave"];
drivers.forEach(d => {
    for (let day = 1; day <= 15; day++) {
        driverAttendance.push({
            driverId: d.id,
            driverName: d.name,
            date: `Apr ${day.toString().padStart(2, "0")}, 2025`,
            status: attendanceStatuses[Math.floor(Math.random() * (day % 5 === 0 ? 4 : 2))],
            checkIn: day % 5 === 0 ? null : `${d.id.includes("01") || d.id.includes("03") ? "06" : "14"}:${Math.floor(Math.random() * 15).toString().padStart(2, "0")} ${d.id.includes("01") || d.id.includes("03") ? "AM" : "PM"}`,
            checkOut: day % 5 === 0 ? null : `${d.id.includes("01") || d.id.includes("03") ? "02" : "10"}:${Math.floor(Math.random() * 15).toString().padStart(2, "0")} ${d.id.includes("01") || d.id.includes("03") ? "PM" : "PM"}`,
            shift: d.shift,
        });
    }
});

/* ── Route Deviation Alerts ── */
export const deviationAlerts = Array.from({ length: 10 }, (_, i) => ({
    id: `DEV-${(i + 1).toString().padStart(3, "0")}`,
    busId: buses[i % 10].id,
    routeId: routes[i % 10].id,
    routeName: routes[i % 10].name,
    driverName: drivers[i % 10].name,
    timestamp: `Apr ${Math.floor(Math.random() * 15) + 1}, 2025 ${Math.floor(Math.random() * 12) + 6}:${Math.floor(Math.random() * 60).toString().padStart(2, "0")} AM`,
    deviationKm: `${(Math.random() * 3 + 0.5).toFixed(1)} km`,
    severity: ["Normal", "Normal", "Critical"][i % 3],
    status: i < 6 ? "Open" : "Closed",
    reason: ["Road construction", "Traffic jam", "Accident on route", "Driver error", "Detour required"][i % 5],
    location: `Lat: ${(12.9716 + (Math.random() - 0.5) * 0.08).toFixed(4)}, Lng: ${(77.5946 + (Math.random() - 0.5) * 0.08).toFixed(4)}`,
}));

/* ── Leaflet Custom Icon ── */
export const createCustomIcon = (id, status) => {
    const color = status === "Delayed" ? "#ef4444" : "#10b981";
    return L.divIcon({
        className: "custom-bus-marker",
        html: `
      <div style="display:flex;flex-direction:column;align-items:center;transform:translateY(-100%);">
        <div style="background:${color};color:#fff;font-family:${fontBody};font-size:10px;font-weight:700;padding:2px 6px;border-radius:4px;box-shadow:0 2px 4px rgba(0,0,0,0.2);margin-bottom:4px;white-space:nowrap;">${id}</div>
        <div style="height:16px;width:16px;background:${color};border-radius:50%;border:2px solid #fff;box-shadow:0 2px 4px rgba(0,0,0,0.2);"></div>
      </div>`,
        iconSize: [0, 0],
        iconAnchor: [0, 0],
    });
};
