// ─── Shared Design Tokens, Helpers, and Mock Data for Transportation Module ───
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
