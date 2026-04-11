import React, { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Sky, Text, Html, useHelper } from "@react-three/drei";
import * as THREE from "three";
import {
  Box, Grid, Typography, Button, IconButton, Tooltip, Stack,
  TextField, MenuItem, InputAdornment, Chip, Divider,
  LinearProgress, Switch, Tabs, Tab, Badge as MuiBadge,
  Snackbar, Alert, Collapse, CircularProgress, Slider,
  ToggleButton, ToggleButtonGroup, Paper,
} from "@mui/material";
import {
  Search, Layers, Business, Close, Info, Warning,
  CheckCircle, Cancel, EventNote, People, Build,
  DirectionsBus, Wifi, AcUnit, LocalParking, Security,
  Thermostat, Bolt, WaterDrop, Speed, Visibility,
  VisibilityOff, ZoomIn, ZoomOut, MyLocation, Map,
  Dashboard, TrendingUp, TrendingDown, Circle,
  Notifications, FilterList, Download, Refresh,
  FlashOn, MeetingRoom, School, Hotel, SportsFootball,
  LocalLibrary, Science, Restaurant, Elevator,
  NavigateBefore, NavigateNext, FiberManualRecord,
  CenterFocusStrong, ViewInAr, Timeline, BubbleChart,
  ExpandMore, ExpandLess, ElectricBolt, SatelliteAlt,
} from "@mui/icons-material";

/* ═══════════════════════════════════════════════
   DESIGN TOKENS
═══════════════════════════════════════════════ */
const T = {
  bg: "#0F1117",
  surface: "#1A1D27",
  surfaceAlt: "#22263A",
  border: "#2E3354",
  accent: "#6366F1",
  accentLight: "#EEF2FF",
  accentGlow: "rgba(99,102,241,0.25)",
  success: "#10B981",
  successLight: "#ECFDF5",
  warning: "#F59E0B",
  warningLight: "#FFFBEB",
  danger: "#EF4444",
  dangerLight: "#FEF2F2",
  cyan: "#06B6D4",
  purple: "#7C3AED",
  gold: "#F59E0B",
  text: "#F1F5F9",
  textSub: "#94A3B8",
  textMute: "#475569",
  neon: "#00FFB3",
};

const fMono = "'Roboto Mono', monospace";
const fBody = "Roboto, sans-serif";

const Fonts = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&family=Roboto+Mono:wght@400;500;700&display=swap');
    * { box-sizing: border-box; }
    @keyframes fadeUp   { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:none} }
    @keyframes pulse    { 0%,100%{opacity:1} 50%{opacity:.3} }
    @keyframes glow     { 0%,100%{box-shadow:0 0 8px ${T.accent}60} 50%{box-shadow:0 0 24px ${T.accent}} }
    @keyframes scan     { 0%{transform:translateY(-100%)} 100%{transform:translateY(100vh)} }
    @keyframes spin     { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
    @keyframes neonPulse{ 0%,100%{opacity:0.7} 50%{opacity:1} }
    .fu  { animation: fadeUp 0.3s ease both; }
    .pulse { animation: pulse 2s infinite; }
    .glow  { animation: glow 2s infinite; }
    .spin  { animation: spin 8s linear infinite; }
    ::-webkit-scrollbar { width:4px; }
    ::-webkit-scrollbar-track { background: ${T.surface}; }
    ::-webkit-scrollbar-thumb { background: ${T.border}; border-radius:2px; }
  `}</style>
);

/* ═══════════════════════════════════════════════
   MOCK DATA
═══════════════════════════════════════════════ */
const BUILDINGS = [
  {
    id: "b1", name: "Main Academic Block", shortName: "MAB", type: "academic",
    position: [0, 5, 0], size: [20, 10, 20], color: "#6366F1",
    departments: ["Computer Science", "Electronics", "Mathematics"],
    occupancy: 75, totalRooms: 42, availableRooms: 12,
    hasMaintenanceAlert: true, energyUsage: 840, wifiStrength: 95,
    temperature: 23, co2Level: 420, waterUsage: 320,
    floors: [
      {
        id: "f1", level: 1, name: "Ground Floor",
        rooms: [
          { id: "r101", number: "101", type: "classroom", capacity: 60, equipment: ["Projector", "Smartboard", "AC"], status: "Available", occupants: 0 },
          { id: "r102", number: "102", type: "lab", capacity: 30, equipment: ["Computers", "Server", "AC"], status: "Occupied", occupants: 28 },
          { id: "r103", number: "103", type: "auditorium", capacity: 200, equipment: ["PA System", "Projector", "AC"], status: "Maintenance", occupants: 0 },
          { id: "r104", number: "104", type: "classroom", capacity: 45, equipment: ["Projector", "AC"], status: "Available", occupants: 0 },
        ]
      },
      {
        id: "f2", level: 2, name: "First Floor",
        rooms: [
          { id: "r201", number: "201", type: "classroom", capacity: 60, equipment: ["Projector", "AC"], status: "Occupied", occupants: 55 },
          { id: "r202", number: "202", type: "classroom", capacity: 60, equipment: ["Projector", "Smartboard"], status: "Available", occupants: 0 },
          { id: "r203", number: "203", type: "office", capacity: 10, equipment: ["Whiteboard"], status: "Available", occupants: 3 },
          { id: "r204", number: "204", type: "lab", capacity: 25, equipment: ["Computers", "3D Printer"], status: "Occupied", occupants: 20 },
        ]
      },
      {
        id: "f3", level: 3, name: "Second Floor",
        rooms: [
          { id: "r301", number: "301", type: "seminar", capacity: 20, equipment: ["TV Screen", "Whiteboard"], status: "Available", occupants: 0 },
          { id: "r302", number: "302", type: "office", capacity: 8, equipment: ["Whiteboard"], status: "Occupied", occupants: 6 },
          { id: "r303", number: "303", type: "classroom", capacity: 50, equipment: ["Projector", "AC", "Smartboard"], status: "Available", occupants: 0 },
        ]
      }
    ]
  },
  {
    id: "b2", name: "Boys Hostel A", shortName: "BHA", type: "hostel",
    position: [-35, 8, -22], size: [15, 16, 15], color: "#EC4899",
    departments: [], occupancy: 95, totalRooms: 120, availableRooms: 6,
    hasMaintenanceAlert: false, energyUsage: 520, wifiStrength: 88,
    temperature: 25, co2Level: 390, waterUsage: 890,
    floors: [
      {
        id: "h1", level: 1, name: "Wing A – Ground", rooms: [
          { id: "ha101", number: "A101", type: "room", capacity: 2, equipment: ["WiFi", "AC"], status: "Occupied", occupants: 2 },
          { id: "ha102", number: "A102", type: "room", capacity: 2, equipment: ["WiFi"], status: "Occupied", occupants: 1 },
          { id: "ha103", number: "A103", type: "room", capacity: 2, equipment: ["WiFi", "AC"], status: "Available", occupants: 0 },
        ]
      }
    ]
  },
  {
    id: "b3", name: "Central Library", shortName: "LIB", type: "library",
    position: [32, 4, -12], size: [15, 8, 15], color: "#8B5CF6",
    departments: ["Library Services"], occupancy: 40, totalRooms: 8, availableRooms: 5,
    hasMaintenanceAlert: false, energyUsage: 210, wifiStrength: 99,
    temperature: 21, co2Level: 350, waterUsage: 80,
    floors: [
      {
        id: "l1", level: 1, name: "Reading Hall", rooms: [
          { id: "lr1", number: "Reading Area", type: "other", capacity: 300, equipment: ["Desks", "Wi-Fi", "AC"], status: "Available", occupants: 120 },
          { id: "lr2", number: "Digital Lab", type: "lab", capacity: 40, equipment: ["Computers", "Wi-Fi"], status: "Occupied", occupants: 22 },
          { id: "lr3", number: "Discussion Room", type: "seminar", capacity: 15, equipment: ["Whiteboard", "TV"], status: "Available", occupants: 0 },
        ]
      },
      {
        id: "l2", level: 2, name: "Research Wing", rooms: [
          { id: "lr4", number: "Archives", type: "other", capacity: 10, equipment: ["Desks"], status: "Available", occupants: 2 },
          { id: "lr5", number: "Faculty Lounge", type: "office", capacity: 20, equipment: ["Wi-Fi", "Coffee"], status: "Occupied", occupants: 8 },
        ]
      }
    ]
  },
  {
    id: "b4", name: "Sports Complex", shortName: "SPC", type: "sports",
    position: [0, 3, 34], size: [25, 6, 20], color: "#10B981",
    departments: ["Physical Education"], occupancy: 30, totalRooms: 6, availableRooms: 4,
    hasMaintenanceAlert: false, energyUsage: 680, wifiStrength: 72,
    temperature: 28, co2Level: 480, waterUsage: 1200,
    floors: [
      {
        id: "s1", level: 1, name: "Ground Level", rooms: [
          { id: "sp1", number: "Main Arena", type: "other", capacity: 500, equipment: ["Scoreboard", "PA System"], status: "Available", occupants: 0 },
          { id: "sp2", number: "Gym", type: "other", capacity: 80, equipment: ["Equipment"], status: "Occupied", occupants: 24 },
          { id: "sp3", number: "Locker Room A", type: "other", capacity: 40, equipment: [], status: "Available", occupants: 0 },
        ]
      }
    ]
  },
  {
    id: "b5", name: "Admin Block", shortName: "ADM", type: "admin",
    position: [-20, 4, 20], size: [12, 8, 12], color: "#F59E0B",
    departments: ["Administration", "Finance", "HR"], occupancy: 60, totalRooms: 20, availableRooms: 8,
    hasMaintenanceAlert: false, energyUsage: 190, wifiStrength: 92,
    temperature: 22, co2Level: 380, waterUsage: 95,
    floors: [
      {
        id: "a1", level: 1, name: "Ground Floor", rooms: [
          { id: "ad1", number: "Reception", type: "office", capacity: 5, equipment: ["Computer"], status: "Occupied", occupants: 3 },
          { id: "ad2", number: "Conf. Room A", type: "seminar", capacity: 20, equipment: ["TV", "Whiteboard"], status: "Available", occupants: 0 },
          { id: "ad3", number: "Finance Dept", type: "office", capacity: 15, equipment: ["Computers"], status: "Occupied", occupants: 10 },
        ]
      },
    ]
  },
  {
    id: "b6", name: "Girls Hostel", shortName: "GHB", type: "hostel",
    position: [35, 8, 12], size: [15, 16, 15], color: "#F43F5E",
    departments: [], occupancy: 88, totalRooms: 100, availableRooms: 12,
    hasMaintenanceAlert: true, energyUsage: 480, wifiStrength: 85,
    temperature: 24, co2Level: 400, waterUsage: 760,
    floors: []
  },
  {
    id: "b7", name: "Research Center", shortName: "RCT", type: "academic",
    position: [-30, 6, 18], size: [14, 12, 14], color: "#06B6D4",
    departments: ["Biotechnology", "Nanotechnology"], occupancy: 55, totalRooms: 18, availableRooms: 8,
    hasMaintenanceAlert: false, energyUsage: 920, wifiStrength: 97,
    temperature: 20, co2Level: 340, waterUsage: 210,
    floors: [
      {
        id: "rc1", level: 1, name: "Lab Wing", rooms: [
          { id: "rcl1", number: "Bio Lab", type: "lab", capacity: 20, equipment: ["Microscopes", "Centrifuge", "AC"], status: "Occupied", occupants: 15 },
          { id: "rcl2", number: "Nano Lab", type: "lab", capacity: 12, equipment: ["Clean Room", "SEM"], status: "Occupied", occupants: 8 },
          { id: "rcl3", number: "Storage", type: "other", capacity: 5, equipment: [], status: "Available", occupants: 0 },
        ]
      }
    ]
  },
  {
    id: "b8", name: "Cafeteria", shortName: "CAF", type: "admin",
    position: [14, 3, 18], size: [16, 6, 14], color: "#D97706",
    departments: ["Catering"], occupancy: 45, totalRooms: 4, availableRooms: 2,
    hasMaintenanceAlert: false, energyUsage: 750, wifiStrength: 80,
    temperature: 27, co2Level: 550, waterUsage: 1500,
    floors: [
      {
        id: "cf1", level: 1, name: "Dining Hall", rooms: [
          { id: "caf1", number: "Main Dining", type: "other", capacity: 400, equipment: ["Tables", "AC"], status: "Available", occupants: 180 },
          { id: "caf2", number: "VIP Lounge", type: "other", capacity: 40, equipment: ["AC", "TV"], status: "Available", occupants: 8 },
        ]
      }
    ]
  },
];

const ALERTS = [
  { id: 1, type: "warning", building: "Main Academic Block", msg: "HVAC maintenance scheduled – Room 103", time: "2 min ago" },
  { id: 2, type: "info", building: "Girls Hostel", msg: "Generator test at 6PM today", time: "15 min ago" },
  { id: 3, type: "success", building: "Central Library", msg: "WiFi upgrade completed successfully", time: "1 hr ago" },
  { id: 4, type: "error", building: "Research Center", msg: "CO₂ sensor offline in Bio Lab", time: "2 hr ago" },
];

const EVENTS = [
  { id: 1, room: "Auditorium – Room 103", title: "Convocation Rehearsal", time: "10:00 AM", status: "ongoing" },
  { id: 2, room: "Bio Lab – RC1", title: "Nano Research Session", time: "11:00 AM", status: "upcoming" },
  { id: 3, room: "Main Arena – SPC", title: "Inter-College Basketball", time: "2:00 PM", status: "upcoming" },
  { id: 4, room: "Conf. Room A – ADM", title: "Faculty Senate Meeting", time: "3:30 PM", status: "upcoming" },
];

/* ═══════════════════════════════════════════════
   DESIGN PRIMITIVES
═══════════════════════════════════════════════ */
const GlassCard = ({ children, sx = {}, ...p }) => (
  <Box sx={{
    background: "rgba(26,29,39,0.85)",
    backdropFilter: "blur(12px)",
    border: `1px solid ${T.border}`,
    borderRadius: "14px",
    ...sx
  }} {...p}>{children}</Box>
);

const SLabel = ({ children, sx = {} }) => (
  <Typography sx={{ fontFamily: fBody, fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: T.textMute, ...sx }}>
    {children}
  </Typography>
);

const MetricCard = ({ label, value, unit, icon: Icon, color, trend }) => (
  <Box sx={{ p: 1.5, borderRadius: "10px", bgcolor: `${color}12`, border: `1px solid ${color}30` }}>
    <Box display="flex" alignItems="center" justifyContent="space-between" mb={0.5}>
      <Icon sx={{ fontSize: 14, color }} />
      {trend !== undefined && (
        trend > 0
          ? <TrendingUp sx={{ fontSize: 11, color: T.success }} />
          : <TrendingDown sx={{ fontSize: 11, color: T.danger }} />
      )}
    </Box>
    <Typography sx={{ fontFamily: fMono, fontSize: "1.1rem", fontWeight: 700, color, lineHeight: 1 }}>{value}<Typography component="span" sx={{ fontSize: "0.6rem", color: T.textMute, ml: 0.3 }}>{unit}</Typography></Typography>
    <SLabel sx={{ mt: 0.3, mb: 0 }}>{label}</SLabel>
  </Box>
);

const StatusPill = ({ status, small }) => {
  const map = {
    Available: { color: T.success, bg: "rgba(16,185,129,0.15)" },
    Occupied: { color: T.danger, bg: "rgba(239,68,68,0.15)" },
    Maintenance: { color: T.warning, bg: "rgba(245,158,11,0.15)" },
    ongoing: { color: T.success, bg: "rgba(16,185,129,0.15)" },
    upcoming: { color: T.accent, bg: "rgba(99,102,241,0.15)" },
  };
  const s = map[status] || { color: T.textMute, bg: "rgba(255,255,255,0.05)" };
  return (
    <Box display="flex" alignItems="center" gap={0.5} sx={{ px: small ? 0.8 : 1.2, py: small ? 0.2 : 0.35, borderRadius: "99px", bgcolor: s.bg, width: "fit-content" }}>
      <Box sx={{ width: small ? 5 : 6, height: small ? 5 : 6, borderRadius: "50%", bgcolor: s.color }} className={status === "ongoing" ? "pulse" : ""} />
      <Typography sx={{ fontFamily: fBody, fontSize: small ? "0.62rem" : "0.71rem", fontWeight: 700, color: s.color }}>{status}</Typography>
    </Box>
  );
};

const OccupancyBar = ({ value, color }) => (
  <Box>
    <Box display="flex" justifyContent="space-between" mb={0.4}>
      <SLabel>Occupancy</SLabel>
      <Typography sx={{ fontFamily: fMono, fontSize: "0.7rem", fontWeight: 700, color }}>{value}%</Typography>
    </Box>
    <Box sx={{ height: 5, borderRadius: 99, bgcolor: "rgba(255,255,255,0.08)", overflow: "hidden" }}>
      <Box sx={{ height: "100%", width: `${value}%`, borderRadius: 99, bgcolor: color, transition: "width 1s ease" }} />
    </Box>
  </Box>
);

/* ═══════════════════════════════════════════════
   3D BUILDING MODEL
═══════════════════════════════════════════════ */
const BuildingModel3D = ({ data, onClick, selected, heatMap }) => {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);
  const [pulse, setPulse] = useState(0);

  useFrame((state) => {
    if (!meshRef.current) return;
    if (selected) {
      meshRef.current.material.emissiveIntensity = 0.3 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
    } else if (hovered) {
      meshRef.current.material.emissiveIntensity = 0.2;
    } else {
      meshRef.current.material.emissiveIntensity = 0.05;
    }
    if (data.hasMaintenanceAlert) {
      setPulse(Math.sin(state.clock.elapsedTime * 3) * 0.5 + 0.5);
    }
  });

  const getColor = () => {
    if (heatMap === "occupancy") {
      const o = data.occupancy;
      if (o > 80) return "#EF4444";
      if (o > 50) return "#F59E0B";
      return "#10B981";
    }
    if (heatMap === "energy") {
      const e = data.energyUsage;
      if (e > 700) return "#EF4444";
      if (e > 400) return "#F59E0B";
      return "#10B981";
    }
    if (selected) return "#6366F1";
    if (hovered) return "#818CF8";
    return data.color;
  };

  const color = getColor();

  return (
    <group position={data.position}>
      {/* Main building body */}
      <mesh
        ref={meshRef}
        castShadow
        receiveShadow
        onClick={(e) => { e.stopPropagation(); onClick(data); }}
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = "pointer"; }}
        onPointerOut={(e) => { e.stopPropagation(); setHovered(false); document.body.style.cursor = "auto"; }}
      >
        <boxGeometry args={data.size} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.05}
          roughness={0.4}
          metalness={0.3}
          transparent
          opacity={selected ? 0.85 : 1}
        />
      </mesh>

      {/* Floor lines */}
      {data.floors.map((f, i) => (
        <mesh key={f.id} position={[0, -data.size[1] / 2 + (i + 1) * (data.size[1] / (data.floors.length + 1)), 0]}>
          <boxGeometry args={[data.size[0] + 0.1, 0.08, data.size[2] + 0.1]} />
          <meshBasicMaterial color="#FFFFFF" transparent opacity={0.15} />
        </mesh>
      ))}

      {/* Window grid on front face */}
      {Array.from({ length: data.floors.length || 2 }).map((_, fi) =>
        Array.from({ length: 3 }).map((_, wi) => (
          <mesh
            key={`w-${fi}-${wi}`}
            position={[
              -data.size[0] / 3 + wi * (data.size[0] / 3),
              -data.size[1] / 2 + (fi + 0.6) * (data.size[1] / ((data.floors.length || 2) + 0.5)),
              data.size[2] / 2 + 0.05
            ]}
          >
            <planeGeometry args={[1.2, 0.8]} />
            <meshBasicMaterial color={data.occupancy > 60 ? "#FCD34D" : "#E0F2FE"} transparent opacity={0.6} />
          </mesh>
        ))
      )}

      {/* Roof detail */}
      <mesh position={[0, data.size[1] / 2 + 0.2, 0]}>
        <boxGeometry args={[data.size[0] + 0.2, 0.4, data.size[2] + 0.2]} />
        <meshStandardMaterial color="#1E293B" roughness={0.8} />
      </mesh>

      {/* Antenna / top marker */}
      <mesh position={[0, data.size[1] / 2 + 1.5, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 2, 8]} />
        <meshBasicMaterial color={data.hasMaintenanceAlert ? "#F59E0B" : "#94A3B8"} transparent opacity={data.hasMaintenanceAlert ? 0.4 + pulse * 0.6 : 1} />
      </mesh>

      {/* Floating label */}
      {!selected && (
        <Text
          position={[0, data.size[1] / 2 + 3.5, 0]}
          fontSize={1.2}
          color={hovered ? "#FFFFFF" : "#CBD5E1"}
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.06}
          outlineColor="#000000"
        >
          {data.shortName}
        </Text>
      )}

      {/* Maintenance badge HTML overlay */}
      {data.hasMaintenanceAlert && (
        <Html position={[data.size[0] / 2 + 0.5, data.size[1] / 2 + 1, 0]} center>
          <Box sx={{
            bgcolor: T.warning, color: "#000", px: 0.8, py: 0.3, borderRadius: "6px",
            fontSize: "0.6rem", fontWeight: 700, whiteSpace: "nowrap",
            animation: "glow 2s infinite", boxShadow: `0 0 8px ${T.warning}80`
          }}>
            ⚠ MAINT
          </Box>
        </Html>
      )}

      {/* Occupancy ring at base */}
      {hovered && (
        <mesh position={[0, -data.size[1] / 2 - 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[data.size[0] / 1.8, data.size[0] / 1.6, 32, 1, 0, (data.occupancy / 100) * Math.PI * 2]} />
          <meshBasicMaterial color={data.occupancy > 80 ? T.danger : T.success} transparent opacity={0.8} side={THREE.DoubleSide} />
        </mesh>
      )}
    </group>
  );
};

const CAR_COLORS = ["#1E3A5F", "#2D4A1E", "#4A1E1E", "#1E1E4A", "#2D2D2D", "#1A3A3A", "#3A1A2D", "#2A2A1A"];
const PARKING_CARS = Array.from({ length: 4 }, (_, i) =>
  Array.from({ length: 5 }, (_, j) => ({
    key: `car-${i}-${j}`,
    pos: [-8 + i * 5, 0.5, -8 + j * 4],
    color: CAR_COLORS[(i * 5 + j) % CAR_COLORS.length],
  }))
).flat();

/* ═══════════════════════════════════════════════
   GROUND & ENVIRONMENT
═══════════════════════════════════════════════ */
const CampusGround = ({ showTransport, showGrid, showParking }) => {
  return (
    <group>
      {/* Main ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[300, 300]} />
        <meshStandardMaterial color="#0F1A0F" roughness={1} />
      </mesh>

      {/* Campus plaza */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <planeGeometry args={[80, 80]} />
        <meshStandardMaterial color="#1A2E1A" roughness={0.9} />
      </mesh>

      {/* Pathways */}
      {[
        { pos: [0, 0.02, 0], size: [3, 60], rot: 0 },
        { pos: [0, 0.02, 0], size: [60, 3], rot: 0 },
        { pos: [18, 0.02, 10], size: [3, 30], rot: 0.3 },
      ].map((p, i) => (
        <mesh key={i} rotation={[-Math.PI / 2, p.rot, 0]} position={p.pos}>
          <planeGeometry args={p.size} />
          <meshStandardMaterial color="#1E2D1E" roughness={0.95} />
        </mesh>
      ))}

      {/* Transport ring */}
      {showTransport && (
        <>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
            <ringGeometry args={[50, 52, 64]} />
            <meshBasicMaterial color="#F97316" side={THREE.DoubleSide} transparent opacity={0.5} />
          </mesh>
          {/* Bus stops */}
          {[[50, 0.3, 0], [-50, 0.3, 0], [0, 0.3, 50], [0, 0.3, -50]].map((pos, i) => (
            <mesh key={i} position={pos}>
              <boxGeometry args={[3, 0.6, 1.5]} />
              <meshStandardMaterial color="#F97316" />
            </mesh>
          ))}
        </>
      )}

      {/* Grid overlay */}
      {showGrid && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
          <planeGeometry args={[200, 200, 20, 20]} />
          <meshBasicMaterial color="#6366F1" transparent opacity={0.06} wireframe />
        </mesh>
      )}

      {/* Parking lot */}
      {showParking && (
        <group position={[-45, 0.02, 10]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[20, 20]} />
            <meshStandardMaterial color="#0F1520" />
          </mesh>
          {PARKING_CARS.map(car => (
            <mesh key={car.key} position={car.pos}>
              <boxGeometry args={[3, 1, 2]} />
              <meshStandardMaterial color={car.color} />
            </mesh>
          ))}
        </group>
      )}

      {/* Trees */}
      {[[-10, 0, -35], [10, 0, -35], [40, 0, 30], [-40, 0, 30], [40, 0, -30], [-18, 0, -38]].map((pos, i) => (
        <group key={`tree-${i}`} position={pos}>
          <mesh position={[0, 1.5, 0]}>
            <cylinderGeometry args={[0.25, 0.35, 3, 8]} />
            <meshStandardMaterial color="#5C3D1E" roughness={0.9} />
          </mesh>
          <mesh position={[0, 5, 0]}>
            <sphereGeometry args={[2.5, 8, 8]} />
            <meshStandardMaterial color="#1A4A1A" roughness={0.8} />
          </mesh>
        </group>
      ))}

      {/* Fountain */}
      <group position={[0, 0, 0]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[2.5, 3, 32]} />
          <meshStandardMaterial color="#1E3A5F" />
        </mesh>
        <mesh position={[0, 0.5, 0]}>
          <cylinderGeometry args={[0.1, 0.1, 1, 8]} />
          <meshStandardMaterial color="#94A3B8" metalness={0.8} />
        </mesh>
      </group>
    </group>
  );
};

/* ═══════════════════════════════════════════════
   SCENE EFFECTS
═══════════════════════════════════════════════ */
const SceneLighting = ({ timeOfDay }) => {
  const sunPos = useMemo(() => {
    const angle = (timeOfDay / 24) * Math.PI * 2 - Math.PI / 2;
    return [Math.cos(angle) * 80, Math.abs(Math.sin(angle)) * 60 + 5, 50];
  }, [timeOfDay]);

  return (
    <>
      <ambientLight intensity={timeOfDay > 6 && timeOfDay < 20 ? 0.4 : 0.1} color="#D0E8FF" />
      <directionalLight
        castShadow
        position={sunPos}
        intensity={timeOfDay > 6 && timeOfDay < 20 ? 1.2 : 0.1}
        color={timeOfDay > 17 ? "#FF8844" : "#FFFFFF"}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={200}
        shadow-camera-left={-100}
        shadow-camera-right={100}
        shadow-camera-top={100}
        shadow-camera-bottom={-100}
      />
      {/* Accent point lights */}
      <pointLight position={[0, 20, 0]} intensity={0.3} color={T.accent} distance={80} />
      <pointLight position={[-35, 10, -22]} intensity={0.2} color="#EC4899" distance={40} />
      <pointLight position={[32, 8, -12]} intensity={0.2} color="#8B5CF6" distance={40} />
    </>
  );
};

/* ═══════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════ */
export default function CampusDigitalTwin() {
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [selectedFloor, setSelectedFloor] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [panelTab, setPanelTab] = useState(0);
  const [sideTab, setSideTab] = useState(0);
  const [heatMap, setHeatMap] = useState("none");
  const [timeOfDay, setTimeOfDay] = useState(10);
  const [snack, setSnack] = useState({ open: false, msg: "", severity: "success" });
  const [alertsOpen, setAlertsOpen] = useState(false);
  const [live, setLive] = useState(true);
  const [showSearch, setShowSearch] = useState(false);

  // Layer toggles
  const [layers, setLayers] = useState({
    academic: true, hostel: true, sports: true, admin: true, library: true,
    transport: true, grid: false, parking: true, labels: true,
  });

  const toast = (msg, severity = "info") => setSnack({ open: true, msg, severity });

  // Live simulation tick
  useEffect(() => {
    if (!live) return;
    const t = setInterval(() => {
      setTimeOfDay(prev => (prev + 0.1) % 24);
    }, 3000);
    return () => clearInterval(t);
  }, [live]);

  const visibleBuildings = useMemo(() =>
    BUILDINGS.filter(b => layers[b.type] !== false),
    [layers]
  );

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    const results = [];
    BUILDINGS.forEach(b => {
      if (b.name.toLowerCase().includes(q) || b.departments.some(d => d.toLowerCase().includes(q)))
        results.push({ type: "building", item: b });
      b.floors.forEach(f => f.rooms.forEach(r => {
        if (r.number.toLowerCase().includes(q) || r.type.toLowerCase().includes(q))
          results.push({ type: "room", item: r, building: b, floor: f });
      }));
    });
    return results;
  }, [searchQuery]);

  const handleBuildingClick = (bld) => {
    setSelectedBuilding(bld);
    setSelectedFloor(bld.floors.length > 0 ? bld.floors[0] : null);
    setSelectedRoom(null);
    setSideTab(0);
  };

  const handleBack = () => {
    setSelectedBuilding(null);
    setSelectedFloor(null);
    setSelectedRoom(null);
  };

  // Campus-wide stats
  const campusStats = useMemo(() => ({
    totalBuildings: BUILDINGS.length,
    avgOccupancy: Math.round(BUILDINGS.reduce((a, b) => a + b.occupancy, 0) / BUILDINGS.length),
    maintenanceCount: BUILDINGS.filter(b => b.hasMaintenanceAlert).length,
    totalEnergy: BUILDINGS.reduce((a, b) => a + b.energyUsage, 0),
    availableRooms: BUILDINGS.reduce((a, b) => a + b.availableRooms, 0),
  }), []);

  const ROOM_TYPE_ICON = {
    classroom: School, lab: Science, auditorium: Business,
    office: Business, other: MeetingRoom, seminar: People,
    room: Hotel,
  };

  const typeColor = {
    academic: T.accent, hostel: "#EC4899", sports: T.success,
    library: "#8B5CF6", admin: T.warning,
  };

  const formatTime = (h) => {
    const hour = Math.floor(h);
    const min = Math.floor((h % 1) * 60);
    return `${String(hour).padStart(2, "0")}:${String(min).padStart(2, "0")}`;
  };

  return (
    <Box sx={{ display: "flex", height: "calc(100vh - 64px)", width: "100%", overflow: "hidden", bgcolor: T.bg, fontFamily: fBody }}>
      <Fonts />

      {/* ══════════════════════════════
          LEFT CONTROL PANEL
      ══════════════════════════════ */}
      <Box sx={{
        width: 260, flexShrink: 0, display: "flex", flexDirection: "column",
        bgcolor: T.surface, borderRight: `1px solid ${T.border}`, zIndex: 10, overflow: "hidden",
      }}>
        {/* Header */}
        <Box sx={{ p: 2, borderBottom: `1px solid ${T.border}`, background: `linear-gradient(135deg, ${T.accent}20, ${T.surface})` }}>
          <Box display="flex" alignItems="center" gap={1} mb={0.5}>
            <SatelliteAlt sx={{ fontSize: 16, color: T.accent }} />
            <Typography sx={{ fontFamily: fMono, fontWeight: 700, fontSize: "0.82rem", color: T.text }}>CAMPUS TWIN</Typography>
            <Box sx={{ ml: "auto", width: 7, height: 7, borderRadius: "50%", bgcolor: live ? T.success : T.textMute }} className={live ? "pulse" : ""} />
          </Box>
          <Typography sx={{ fontFamily: fBody, fontSize: "0.68rem", color: T.textMute }}>
            Digital Infrastructure Monitor
          </Typography>
        </Box>

        {/* Scrollable content */}
        <Box sx={{ flex: 1, overflowY: "auto", p: 1.5 }}>

          {/* Live clock */}
          <Box sx={{ mb: 1.5, p: 1.5, borderRadius: "10px", bgcolor: T.surfaceAlt, border: `1px solid ${T.border}` }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.8}>
              <SLabel>Simulation Time</SLabel>
              <Switch
                size="small"
                checked={live}
                onChange={e => setLive(e.target.checked)}
                sx={{ "& .MuiSwitch-switchBase.Mui-checked": { color: T.success }, "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { bgcolor: T.success } }}
              />
            </Box>
            <Typography sx={{ fontFamily: fMono, fontSize: "1.5rem", fontWeight: 700, color: T.text, letterSpacing: "0.05em" }}>
              {formatTime(timeOfDay)}
            </Typography>
            <Slider
              value={timeOfDay}
              min={0} max={24} step={0.5}
              onChange={(_, v) => setTimeOfDay(v)}
              size="small"
              sx={{ color: T.accent, mt: 0.5, "& .MuiSlider-thumb": { width: 10, height: 10 } }}
            />
          </Box>

          {/* Campus Stats Strip */}
          <Box sx={{ mb: 1.5 }}>
            <SLabel sx={{ mb: 0.8 }}>Campus At a Glance</SLabel>
            <Grid container spacing={0.8}>
              {[
                { label: "Buildings", value: campusStats.totalBuildings, color: T.accent, icon: Business },
                { label: "Avg Occ.", value: `${campusStats.avgOccupancy}%`, color: campusStats.avgOccupancy > 75 ? T.danger : T.success, icon: People },
                { label: "Alerts", value: campusStats.maintenanceCount, color: T.warning, icon: Warning },
                { label: "Free Rooms", value: campusStats.availableRooms, color: T.success, icon: MeetingRoom },
              ].map((s, i) => (
                <Grid item xs={6} key={i}>
                  <Box sx={{ p: 1, borderRadius: "8px", bgcolor: `${s.color}12`, border: `1px solid ${s.color}25` }}>
                    <s.icon sx={{ fontSize: 12, color: s.color }} />
                    <Typography sx={{ fontFamily: fMono, fontWeight: 700, fontSize: "1rem", color: s.color, lineHeight: 1.1 }}>{s.value}</Typography>
                    <SLabel sx={{ mb: 0 }}>{s.label}</SLabel>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Heatmap Mode */}
          <Box sx={{ mb: 1.5 }}>
            <SLabel sx={{ mb: 0.8 }}>Heatmap Overlay</SLabel>
            <ToggleButtonGroup
              value={heatMap}
              exclusive
              onChange={(_, v) => setHeatMap(v || "none")}
              size="small" fullWidth
              sx={{ "& .MuiToggleButton-root": { fontFamily: fBody, fontSize: "0.65rem", fontWeight: 700, textTransform: "none", color: T.textMute, borderColor: T.border, py: 0.5, "&.Mui-selected": { bgcolor: `${T.accent}20`, color: T.accent, borderColor: T.accent } } }}
            >
              <ToggleButton value="none">None</ToggleButton>
              <ToggleButton value="occupancy">Occ.</ToggleButton>
              <ToggleButton value="energy">Energy</ToggleButton>
            </ToggleButtonGroup>
          </Box>

          {/* Layer Controls */}
          <Box sx={{ mb: 1.5 }}>
            <SLabel sx={{ mb: 0.8 }}>Layers</SLabel>
            <Stack spacing={0.5}>
              {[
                { key: "academic", label: "Academic", dot: T.accent, icon: School },
                { key: "hostel", label: "Hostels", dot: "#EC4899", icon: Hotel },
                { key: "sports", label: "Sports", dot: T.success, icon: SportsFootball },
                { key: "library", label: "Library", dot: "#8B5CF6", icon: LocalLibrary },
                { key: "admin", label: "Admin/Other", dot: T.warning, icon: Business },
                { key: "transport", label: "Transport", dot: "#F97316", icon: DirectionsBus },
                { key: "parking", label: "Parking", dot: T.textMute, icon: LocalParking },
                { key: "grid", label: "Grid Overlay", dot: `${T.accent}80`, icon: Map },
              ].map(item => (
                <Box key={item.key} display="flex" alignItems="center" justifyContent="space-between"
                  sx={{ px: 1, py: 0.5, borderRadius: "7px", cursor: "pointer", bgcolor: layers[item.key] ? `${item.dot}10` : "transparent", "&:hover": { bgcolor: "rgba(255,255,255,0.04)" } }}
                  onClick={() => setLayers(p => ({ ...p, [item.key]: !p[item.key] }))}
                >
                  <Box display="flex" alignItems="center" gap={1}>
                    <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: layers[item.key] ? item.dot : T.textMute, flexShrink: 0 }} />
                    <Typography sx={{ fontFamily: fBody, fontSize: "0.76rem", color: layers[item.key] ? T.text : T.textMute }}>{item.label}</Typography>
                  </Box>
                  {layers[item.key]
                    ? <Visibility sx={{ fontSize: 13, color: item.dot }} />
                    : <VisibilityOff sx={{ fontSize: 13, color: T.textMute }} />
                  }
                </Box>
              ))}
            </Stack>
          </Box>

          {/* Building Quick List */}
          <Box>
            <SLabel sx={{ mb: 0.8 }}>Buildings</SLabel>
            <Stack spacing={0.5}>
              {BUILDINGS.map(b => (
                <Box key={b.id}
                  onClick={() => handleBuildingClick(b)}
                  sx={{
                    px: 1, py: 0.8, borderRadius: "8px", cursor: "pointer",
                    border: `1px solid ${selectedBuilding?.id === b.id ? b.color : "transparent"}`,
                    bgcolor: selectedBuilding?.id === b.id ? `${b.color}15` : "transparent",
                    "&:hover": { bgcolor: "rgba(255,255,255,0.05)" }, transition: "all 0.15s",
                  }}
                >
                  <Box display="flex" alignItems="center" gap={1}>
                    <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: b.color, flexShrink: 0 }} />
                    <Box flex={1} minWidth={0}>
                      <Typography sx={{ fontFamily: fBody, fontSize: "0.74rem", fontWeight: 600, color: T.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {b.shortName}
                      </Typography>
                    </Box>
                    <Typography sx={{ fontFamily: fMono, fontSize: "0.64rem", color: b.occupancy > 80 ? T.danger : T.textMute, fontWeight: 700 }}>
                      {b.occupancy}%
                    </Typography>
                    {b.hasMaintenanceAlert && <Warning sx={{ fontSize: 10, color: T.warning }} />}
                  </Box>
                </Box>
              ))}
            </Stack>
          </Box>
        </Box>

        {/* Bottom energy strip */}
        <Box sx={{ p: 1.5, borderTop: `1px solid ${T.border}`, bgcolor: T.surfaceAlt }}>
          <SLabel sx={{ mb: 0.6 }}>Campus Energy</SLabel>
          <Box display="flex" alignItems="center" gap={1}>
            <ElectricBolt sx={{ fontSize: 14, color: T.warning }} />
            <Typography sx={{ fontFamily: fMono, fontSize: "0.82rem", fontWeight: 700, color: T.warning }}>{campusStats.totalEnergy} kW</Typography>
          </Box>
          <Box sx={{ mt: 0.5, height: 3, borderRadius: 99, bgcolor: "rgba(255,255,255,0.08)", overflow: "hidden" }}>
            <Box sx={{ height: "100%", width: "72%", borderRadius: 99, background: `linear-gradient(90deg, ${T.success}, ${T.warning})` }} />
          </Box>
        </Box>
      </Box>

      {/* ══════════════════════════════
          3D CANVAS
      ══════════════════════════════ */}
      <Box sx={{ flex: 1, position: "relative" }}>

        {/* Top HUD */}
        <Box sx={{ position: "absolute", top: 12, left: 12, right: 12, zIndex: 10, display: "flex", gap: 1.5, alignItems: "flex-start", pointerEvents: "none" }}>

          {/* Search bar */}
          <Box sx={{ pointerEvents: "auto" }}>
            <GlassCard sx={{ display: "flex", alignItems: "center", gap: 1, px: 1.5, py: 0.7, borderRadius: "10px" }}>
              <Search sx={{ fontSize: 16, color: T.textMute }} />
              <input
                placeholder="Search buildings, rooms, labs…"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{
                  background: "none", border: "none", outline: "none",
                  color: T.text, fontFamily: fBody, fontSize: "0.82rem",
                  width: 220, caretColor: T.accent,
                }}
              />
              {searchQuery && (
                <IconButton size="small" onClick={() => setSearchQuery("")} sx={{ color: T.textMute, p: 0.3 }}>
                  <Close sx={{ fontSize: 14 }} />
                </IconButton>
              )}
            </GlassCard>

            {/* Search results dropdown */}
            {searchQuery && searchResults.length > 0 && (
              <GlassCard sx={{ mt: 0.5, maxHeight: 280, overflowY: "auto", p: 0.5 }}>
                <SLabel sx={{ px: 1, py: 0.5 }}>Results ({searchResults.length})</SLabel>
                {searchResults.map((res, idx) => (
                  <Box key={idx}
                    onClick={() => {
                      if (res.type === "building") handleBuildingClick(res.item);
                      else { handleBuildingClick(res.building); setSelectedFloor(res.floor); setSelectedRoom(res.item); }
                      setSearchQuery("");
                    }}
                    sx={{ px: 1.5, py: 1, borderRadius: "8px", cursor: "pointer", display: "flex", alignItems: "center", gap: 1.2, "&:hover": { bgcolor: "rgba(255,255,255,0.07)" } }}
                  >
                    {res.type === "building"
                      ? <Business sx={{ fontSize: 14, color: T.accent }} />
                      : <MeetingRoom sx={{ fontSize: 14, color: T.success }} />
                    }
                    <Box>
                      <Typography sx={{ fontFamily: fBody, fontWeight: 600, fontSize: "0.78rem", color: T.text }}>
                        {res.type === "building" ? res.item.name : `Room ${res.item.number}`}
                      </Typography>
                      <Typography sx={{ fontFamily: fBody, fontSize: "0.65rem", color: T.textMute }}>
                        {res.type === "building" ? res.item.type : `${res.building.name} · ${res.floor.name}`}
                      </Typography>
                    </Box>
                    <StatusPill status={res.item.status || res.item.occupancy > 80 ? "Occupied" : "Available"} small />
                  </Box>
                ))}
              </GlassCard>
            )}
          </Box>

          <Box sx={{ flex: 1 }} />

          {/* Right HUD buttons */}
          <Box sx={{ pointerEvents: "auto", display: "flex", gap: 1 }}>
            <Tooltip title="Alerts">
              <Box sx={{ position: "relative" }}>
                <GlassCard sx={{ p: 0.7, borderRadius: "10px", cursor: "pointer" }} onClick={() => setAlertsOpen(p => !p)}>
                  <Notifications sx={{ fontSize: 18, color: ALERTS.length > 0 ? T.warning : T.textMute }} />
                </GlassCard>
                {ALERTS.length > 0 && (
                  <Box sx={{ position: "absolute", top: -4, right: -4, width: 14, height: 14, borderRadius: "50%", bgcolor: T.danger, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Typography sx={{ fontSize: "0.55rem", fontWeight: 700, color: "#fff" }}>{ALERTS.length}</Typography>
                  </Box>
                )}
              </Box>
            </Tooltip>

            <GlassCard sx={{ px: 1.5, py: 0.7, borderRadius: "10px", display: "flex", alignItems: "center", gap: 0.8, cursor: "pointer" }}
              onClick={() => toast("AR/VR Mode — XR hardware not detected", "warning")}>
              <ViewInAr sx={{ fontSize: 16, color: T.accent }} />
              <Typography sx={{ fontFamily: fBody, fontSize: "0.74rem", fontWeight: 700, color: T.accent }}>AR View</Typography>
            </GlassCard>

            <GlassCard sx={{ px: 1.5, py: 0.7, borderRadius: "10px", display: "flex", alignItems: "center", gap: 0.8, cursor: "pointer" }}
              onClick={() => toast("Report exported", "success")}>
              <Download sx={{ fontSize: 16, color: T.textMute }} />
            </GlassCard>
          </Box>
        </Box>

        {/* Alerts panel */}
        <Collapse in={alertsOpen} sx={{ position: "absolute", top: 64, right: 12, zIndex: 20, width: 320 }}>
          <GlassCard sx={{ p: 1.5 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
              <SLabel>System Alerts</SLabel>
              <IconButton size="small" onClick={() => setAlertsOpen(false)} sx={{ color: T.textMute, p: 0.3 }}>
                <Close sx={{ fontSize: 13 }} />
              </IconButton>
            </Box>
            <Stack spacing={0.8}>
              {ALERTS.map(a => {
                const iconMap = { warning: <Warning sx={{ fontSize: 13, color: T.warning }} />, info: <Info sx={{ fontSize: 13, color: T.accent }} />, success: <CheckCircle sx={{ fontSize: 13, color: T.success }} />, error: <Cancel sx={{ fontSize: 13, color: T.danger }} /> };
                return (
                  <Box key={a.id} sx={{ px: 1.2, py: 0.8, borderRadius: "8px", bgcolor: "rgba(255,255,255,0.04)", border: `1px solid ${T.border}` }}>
                    <Box display="flex" alignItems="flex-start" gap={1}>
                      {iconMap[a.type]}
                      <Box flex={1}>
                        <Typography sx={{ fontFamily: fBody, fontSize: "0.72rem", fontWeight: 600, color: T.text }}>{a.msg}</Typography>
                        <Typography sx={{ fontFamily: fBody, fontSize: "0.62rem", color: T.textMute }}>{a.building} · {a.time}</Typography>
                      </Box>
                    </Box>
                  </Box>
                );
              })}
            </Stack>
          </GlassCard>
        </Collapse>

        {/* Heatmap legend */}
        {heatMap !== "none" && (
          <Box sx={{ position: "absolute", bottom: 16, left: "50%", transform: "translateX(-50%)", zIndex: 10 }}>
            <GlassCard sx={{ px: 2, py: 1, display: "flex", alignItems: "center", gap: 2 }}>
              <SLabel sx={{ mb: 0 }}>{heatMap === "occupancy" ? "Occupancy" : "Energy"} Heatmap</SLabel>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                {[T.success, T.warning, T.danger].map((c, i) => (
                  <Box key={i} sx={{ width: 24, height: 10, bgcolor: c, borderRadius: i === 0 ? "3px 0 0 3px" : i === 2 ? "0 3px 3px 0" : 0 }} />
                ))}
              </Box>
              <Typography sx={{ fontFamily: fMono, fontSize: "0.64rem", color: T.textMute }}>Low → High</Typography>
            </GlassCard>
          </Box>
        )}

        {/* Selected building back button */}
        {selectedBuilding && (
          <Box sx={{ position: "absolute", bottom: 16, right: 16, zIndex: 10 }}>
            <Button variant="contained" onClick={handleBack} startIcon={<NavigateBefore />}
              sx={{ fontFamily: fBody, fontWeight: 700, fontSize: "0.78rem", textTransform: "none", borderRadius: "10px", bgcolor: T.surfaceAlt, color: T.text, border: `1px solid ${T.border}`, boxShadow: "none", backdropFilter: "blur(8px)", "&:hover": { bgcolor: T.border } }}>
              Campus Map
            </Button>
          </Box>
        )}

        {/* 3D Canvas */}
        <Canvas
          shadows
          camera={{ position: [0, 55, 80], fov: 42 }}
          style={{ background: "linear-gradient(to bottom, #0A0F1A 0%, #0D1A0D 100%)" }}
        >
          <SceneLighting timeOfDay={timeOfDay} />
          <Sky
            distance={450000}
            sunPosition={[
              Math.cos((timeOfDay / 24) * Math.PI * 2) * 100,
              Math.abs(Math.sin((timeOfDay / 24) * Math.PI * 2)) * 60,
              50
            ]}
            inclination={0.49}
            azimuth={timeOfDay > 12 ? 0.4 : 0.1}
            rayleigh={timeOfDay > 18 || timeOfDay < 6 ? 3 : 0.5}
          />

          <OrbitControls
            makeDefault
            maxPolarAngle={Math.PI / 2 - 0.05}
            minDistance={12}
            maxDistance={180}
            enableDamping
            dampingFactor={0.06}
          />

          <CampusGround
            showTransport={layers.transport}
            showGrid={layers.grid}
            showParking={layers.parking}
          />

          {visibleBuildings.map(b => (
            <BuildingModel3D
              key={b.id}
              data={b}
              onClick={handleBuildingClick}
              selected={selectedBuilding?.id === b.id}
              heatMap={heatMap}
            />
          ))}
        </Canvas>

        {/* Mini compass */}
        <Box sx={{ position: "absolute", bottom: 60, right: 16, zIndex: 10 }}>
          <GlassCard sx={{ width: 40, height: 40, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", border: `1px solid ${T.accent}50` }}>
            <Typography sx={{ fontFamily: fMono, fontSize: "0.6rem", fontWeight: 700, color: T.accent }}>N</Typography>
          </GlassCard>
        </Box>
      </Box>

      {/* ══════════════════════════════
          RIGHT DETAIL PANEL
      ══════════════════════════════ */}
      <Box sx={{
        width: 340, flexShrink: 0, display: "flex", flexDirection: "column",
        bgcolor: T.surface, borderLeft: `1px solid ${T.border}`, zIndex: 10, overflow: "hidden",
      }}>
        {!selectedBuilding ? (
          /* ── Campus Overview state ── */
          <Box sx={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
            <Box sx={{ p: 2, borderBottom: `1px solid ${T.border}` }}>
              <Typography sx={{ fontFamily: fMono, fontWeight: 700, fontSize: "0.88rem", color: T.text, mb: 0.3 }}>Campus Overview</Typography>
              <Typography sx={{ fontFamily: fBody, fontSize: "0.72rem", color: T.textMute }}>Click a building to inspect details</Typography>
            </Box>

            <Tabs value={panelTab} onChange={(_, v) => setPanelTab(v)} sx={{
              borderBottom: `1px solid ${T.border}`, minHeight: 38,
              "& .MuiTabs-indicator": { bgcolor: T.accent, height: 2 },
              "& .MuiTab-root": { fontFamily: fBody, fontSize: "0.7rem", fontWeight: 600, textTransform: "none", color: T.textMute, minHeight: 38, "&.Mui-selected": { color: T.accent } }
            }}>
              <Tab label="Analytics" />
              <Tab label="Events" />
              <Tab label="IoT Feeds" />
            </Tabs>

            <Box sx={{ flex: 1, overflowY: "auto", p: 1.5 }}>

              {/* ANALYTICS TAB */}
              {panelTab === 0 && (
                <Box className="fu">
                  <Grid container spacing={1} mb={1.5}>
                    <Grid item xs={6}><MetricCard label="Avg Occ." value={campusStats.avgOccupancy} unit="%" icon={People} color={T.accent} /></Grid>
                    <Grid item xs={6}><MetricCard label="Free Rooms" value={campusStats.availableRooms} unit="" icon={MeetingRoom} color={T.success} /></Grid>
                    <Grid item xs={6}><MetricCard label="Energy" value={campusStats.totalEnergy} unit="kW" icon={Bolt} color={T.warning} trend={1} /></Grid>
                    <Grid item xs={6}><MetricCard label="Alerts" value={campusStats.maintenanceCount} unit="" icon={Warning} color={T.danger} /></Grid>
                  </Grid>

                  <SLabel sx={{ mb: 0.8 }}>Building Occupancy</SLabel>
                  <Stack spacing={1} mb={1.5}>
                    {BUILDINGS.slice(0, 6).map(b => (
                      <Box key={b.id}
                        onClick={() => handleBuildingClick(b)}
                        sx={{ px: 1.2, py: 0.8, borderRadius: "8px", bgcolor: T.surfaceAlt, cursor: "pointer", "&:hover": { border: `1px solid ${b.color}40` }, border: "1px solid transparent", transition: "all 0.15s" }}
                      >
                        <Box display="flex" justifyContent="space-between" mb={0.5}>
                          <Typography sx={{ fontFamily: fBody, fontSize: "0.74rem", fontWeight: 600, color: T.text }}>{b.shortName}</Typography>
                          <Typography sx={{ fontFamily: fMono, fontSize: "0.7rem", fontWeight: 700, color: b.occupancy > 80 ? T.danger : b.occupancy > 50 ? T.warning : T.success }}>{b.occupancy}%</Typography>
                        </Box>
                        <Box sx={{ height: 4, borderRadius: 99, bgcolor: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
                          <Box sx={{ height: "100%", width: `${b.occupancy}%`, borderRadius: 99, bgcolor: b.occupancy > 80 ? T.danger : b.occupancy > 50 ? T.warning : T.success, transition: "width 1s ease" }} />
                        </Box>
                      </Box>
                    ))}
                  </Stack>
                </Box>
              )}

              {/* EVENTS TAB */}
              {panelTab === 1 && (
                <Box className="fu">
                  <SLabel sx={{ mb: 0.8 }}>Today's Schedule</SLabel>
                  <Stack spacing={1}>
                    {EVENTS.map(ev => (
                      <Box key={ev.id} sx={{ px: 1.5, py: 1.2, borderRadius: "10px", bgcolor: T.surfaceAlt, border: `1px solid ${T.border}`, borderLeft: `3px solid ${ev.status === "ongoing" ? T.success : T.accent}` }}>
                        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={0.4}>
                          <Typography sx={{ fontFamily: fBody, fontWeight: 700, fontSize: "0.78rem", color: T.text }}>{ev.title}</Typography>
                          <StatusPill status={ev.status} small />
                        </Box>
                        <Typography sx={{ fontFamily: fMono, fontSize: "0.66rem", color: T.accent }}>{ev.time}</Typography>
                        <Typography sx={{ fontFamily: fBody, fontSize: "0.65rem", color: T.textMute, mt: 0.2 }}>{ev.room}</Typography>
                      </Box>
                    ))}
                  </Stack>
                </Box>
              )}

              {/* IOT TAB */}
              {panelTab === 2 && (
                <Box className="fu">
                  <SLabel sx={{ mb: 0.8 }}>Live Campus IoT Feed</SLabel>
                  <Stack spacing={1}>
                    {[
                      { label: "Avg. Temperature", value: "23.5°C", icon: Thermostat, color: T.warning, status: "normal" },
                      { label: "Total Power Draw", value: "3.4 MW", icon: Bolt, color: T.warning, status: "elevated" },
                      { label: "Water Consumption", value: "4,850 L", icon: WaterDrop, color: T.cyan, status: "normal" },
                      { label: "Avg. CO₂ Level", value: "412 ppm", icon: BubbleChart, color: T.success, status: "normal" },
                      { label: "Campus WiFi Load", value: "68%", icon: Wifi, color: T.accent, status: "normal" },
                      { label: "CCTV Cameras", value: "24/26", icon: Security, color: T.success, status: "warning" },
                    ].map((item, i) => (
                      <Box key={i} sx={{ px: 1.2, py: 1, borderRadius: "8px", bgcolor: T.surfaceAlt, border: `1px solid ${T.border}`, display: "flex", alignItems: "center", gap: 1.5 }}>
                        <Box sx={{ p: 0.7, borderRadius: "7px", bgcolor: `${item.color}15` }}>
                          <item.icon sx={{ fontSize: 15, color: item.color }} />
                        </Box>
                        <Box flex={1}>
                          <Typography sx={{ fontFamily: fBody, fontSize: "0.72rem", color: T.textMute }}>{item.label}</Typography>
                          <Typography sx={{ fontFamily: fMono, fontWeight: 700, fontSize: "0.84rem", color: item.color }}>{item.value}</Typography>
                        </Box>
                        <Box sx={{ width: 7, height: 7, borderRadius: "50%", bgcolor: item.status === "normal" ? T.success : item.status === "elevated" ? T.warning : T.danger }} className={item.status !== "normal" ? "pulse" : ""} />
                      </Box>
                    ))}
                  </Stack>
                </Box>
              )}
            </Box>
          </Box>
        ) : (
          /* ── Building Detail State ── */
          <Box sx={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

            {/* Building header */}
            <Box sx={{ p: 2, borderBottom: `1px solid ${T.border}`, background: `linear-gradient(135deg, ${selectedBuilding.color}18, ${T.surface})` }}>
              <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                <Box>
                  <Box sx={{ px: 1, py: 0.2, borderRadius: "5px", bgcolor: `${selectedBuilding.color}20`, display: "inline-block", mb: 0.5 }}>
                    <Typography sx={{ fontFamily: fMono, fontSize: "0.62rem", fontWeight: 700, color: selectedBuilding.color }}>{selectedBuilding.shortName} · {selectedBuilding.type.toUpperCase()}</Typography>
                  </Box>
                  <Typography sx={{ fontFamily: fMono, fontWeight: 700, fontSize: "0.96rem", color: T.text, lineHeight: 1.2 }}>{selectedBuilding.name}</Typography>
                </Box>
                <IconButton size="small" onClick={handleBack} sx={{ bgcolor: "rgba(255,255,255,0.06)", borderRadius: "8px", color: T.textMute }}>
                  <Close sx={{ fontSize: 15 }} />
                </IconButton>
              </Box>

              {/* Status chips */}
              <Box display="flex" gap={0.8} mt={1} flexWrap="wrap">
                <Box sx={{ px: 1, py: 0.25, borderRadius: "6px", bgcolor: `${selectedBuilding.color}20` }}>
                  <Typography sx={{ fontFamily: fMono, fontSize: "0.62rem", fontWeight: 700, color: selectedBuilding.color }}>{selectedBuilding.floors.length} Floors</Typography>
                </Box>
                <Box sx={{ px: 1, py: 0.25, borderRadius: "6px", bgcolor: selectedBuilding.occupancy > 80 ? "rgba(239,68,68,0.15)" : "rgba(16,185,129,0.15)" }}>
                  <Typography sx={{ fontFamily: fMono, fontSize: "0.62rem", fontWeight: 700, color: selectedBuilding.occupancy > 80 ? T.danger : T.success }}>{selectedBuilding.occupancy}% Occupied</Typography>
                </Box>
                <Box sx={{ px: 1, py: 0.25, borderRadius: "6px", bgcolor: "rgba(255,255,255,0.06)" }}>
                  <Typography sx={{ fontFamily: fMono, fontSize: "0.62rem", fontWeight: 700, color: T.textMute }}>{selectedBuilding.availableRooms} Free Rooms</Typography>
                </Box>
                {selectedBuilding.hasMaintenanceAlert && (
                  <Box sx={{ px: 1, py: 0.25, borderRadius: "6px", bgcolor: "rgba(245,158,11,0.15)", display: "flex", alignItems: "center", gap: 0.4 }}>
                    <Warning sx={{ fontSize: 10, color: T.warning }} />
                    <Typography sx={{ fontFamily: fMono, fontSize: "0.62rem", fontWeight: 700, color: T.warning }}>Alert</Typography>
                  </Box>
                )}
              </Box>
            </Box>

            {/* Tabs */}
            <Tabs value={sideTab} onChange={(_, v) => setSideTab(v)} sx={{
              borderBottom: `1px solid ${T.border}`, minHeight: 38,
              "& .MuiTabs-indicator": { bgcolor: selectedBuilding.color, height: 2 },
              "& .MuiTab-root": { fontFamily: fBody, fontSize: "0.68rem", fontWeight: 600, textTransform: "none", color: T.textMute, minHeight: 38, "&.Mui-selected": { color: selectedBuilding.color } }
            }}>
              <Tab label="Floors" />
              <Tab label="IoT" />
              <Tab label="Analytics" />
            </Tabs>

            <Box sx={{ flex: 1, overflowY: "auto", p: 1.5 }}>

              {/* FLOORS TAB */}
              {sideTab === 0 && (
                <Box className="fu">
                  {selectedBuilding.departments.length > 0 && (
                    <Box mb={1.5}>
                      <SLabel sx={{ mb: 0.6 }}>Departments</SLabel>
                      <Box display="flex" flexWrap="wrap" gap={0.5}>
                        {selectedBuilding.departments.map(d => (
                          <Box key={d} sx={{ px: 1, py: 0.3, borderRadius: "6px", bgcolor: `${selectedBuilding.color}15`, border: `1px solid ${selectedBuilding.color}30` }}>
                            <Typography sx={{ fontFamily: fBody, fontSize: "0.67rem", fontWeight: 600, color: selectedBuilding.color }}>{d}</Typography>
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  )}

                  {selectedBuilding.floors.length === 0 ? (
                    <Box sx={{ py: 3, textAlign: "center" }}>
                      <Typography sx={{ fontFamily: fBody, fontSize: "0.78rem", color: T.textMute }}>No floor data available.</Typography>
                    </Box>
                  ) : (
                    <Stack spacing={1}>
                      {selectedBuilding.floors.map(floor => (
                        <Box key={floor.id} sx={{ borderRadius: "10px", border: `1px solid ${selectedFloor?.id === floor.id ? selectedBuilding.color + "60" : T.border}`, overflow: "hidden" }}>
                          {/* Floor header */}
                          <Box
                            onClick={() => { setSelectedFloor(selectedFloor?.id === floor.id ? null : floor); setSelectedRoom(null); }}
                            sx={{ px: 1.5, py: 1, bgcolor: selectedFloor?.id === floor.id ? `${selectedBuilding.color}12` : T.surfaceAlt, display: "flex", alignItems: "center", cursor: "pointer", "&:hover": { bgcolor: `${selectedBuilding.color}08` } }}
                          >
                            <Box sx={{ px: 0.7, py: 0.1, borderRadius: "4px", bgcolor: `${selectedBuilding.color}20`, mr: 1 }}>
                              <Typography sx={{ fontFamily: fMono, fontSize: "0.6rem", fontWeight: 700, color: selectedBuilding.color }}>F{floor.level}</Typography>
                            </Box>
                            <Typography sx={{ fontFamily: fBody, fontWeight: 600, fontSize: "0.78rem", color: T.text, flex: 1 }}>{floor.name}</Typography>
                            <Typography sx={{ fontFamily: fMono, fontSize: "0.62rem", color: T.textMute, mr: 0.5 }}>{floor.rooms.length} rooms</Typography>
                            {selectedFloor?.id === floor.id
                              ? <ExpandLess sx={{ fontSize: 14, color: T.textMute }} />
                              : <ExpandMore sx={{ fontSize: 14, color: T.textMute }} />
                            }
                          </Box>

                          {/* Rooms grid */}
                          <Collapse in={selectedFloor?.id === floor.id}>
                            <Box sx={{ p: 1, bgcolor: "rgba(0,0,0,0.2)" }}>
                              <Grid container spacing={0.8}>
                                {floor.rooms.map(room => {
                                  const RoomIcon = ROOM_TYPE_ICON[room.type] || MeetingRoom;
                                  const statusColor = room.status === "Available" ? T.success : room.status === "Occupied" ? T.danger : T.warning;
                                  return (
                                    <Grid item xs={6} key={room.id}>
                                      <Box
                                        onClick={() => setSelectedRoom(selectedRoom?.id === room.id ? null : room)}
                                        sx={{
                                          p: 1, borderRadius: "8px", cursor: "pointer",
                                          border: `1px solid ${selectedRoom?.id === room.id ? statusColor : T.border}`,
                                          bgcolor: selectedRoom?.id === room.id ? `${statusColor}12` : "rgba(255,255,255,0.03)",
                                          "&:hover": { bgcolor: "rgba(255,255,255,0.06)" }, transition: "all 0.15s",
                                        }}
                                      >
                                        <Box display="flex" alignItems="center" justifyContent="space-between" mb={0.4}>
                                          <RoomIcon sx={{ fontSize: 12, color: statusColor }} />
                                          <Box sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: statusColor }} className={room.status === "Occupied" ? "pulse" : ""} />
                                        </Box>
                                        <Typography sx={{ fontFamily: fMono, fontWeight: 700, fontSize: "0.76rem", color: T.text }}>{room.number}</Typography>
                                        <Typography sx={{ fontFamily: fBody, fontSize: "0.6rem", color: T.textMute, textTransform: "capitalize" }}>{room.type}</Typography>
                                        {room.occupants > 0 && (
                                          <Typography sx={{ fontFamily: fMono, fontSize: "0.6rem", color: statusColor, mt: 0.2 }}>{room.occupants}/{room.capacity}</Typography>
                                        )}
                                      </Box>
                                    </Grid>
                                  );
                                })}
                              </Grid>
                            </Box>
                          </Collapse>
                        </Box>
                      ))}
                    </Stack>
                  )}

                  {/* Selected room detail */}
                  <Collapse in={!!selectedRoom}>
                    {selectedRoom && (
                      <Box sx={{ mt: 1.5, p: 1.5, borderRadius: "12px", border: `1px solid ${selectedBuilding.color}50`, bgcolor: `${selectedBuilding.color}0A` }} className="fu">
                        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
                          <Box>
                            <Typography sx={{ fontFamily: fMono, fontWeight: 700, fontSize: "0.9rem", color: T.text }}>Room {selectedRoom.number}</Typography>
                            <Typography sx={{ fontFamily: fBody, fontSize: "0.68rem", color: T.textMute, textTransform: "capitalize" }}>{selectedRoom.type}</Typography>
                          </Box>
                          <StatusPill status={selectedRoom.status} />
                        </Box>

                        <Grid container spacing={1} mb={1}>
                          {[
                            { label: "Capacity", value: `${selectedRoom.capacity} persons` },
                            { label: "Current", value: `${selectedRoom.occupants || 0} persons` },
                            { label: "Floor", value: selectedFloor?.name },
                          ].map(item => (
                            <Grid item xs={4} key={item.label}>
                              <SLabel sx={{ mb: 0.2 }}>{item.label}</SLabel>
                              <Typography sx={{ fontFamily: fMono, fontSize: "0.74rem", fontWeight: 700, color: T.text }}>{item.value}</Typography>
                            </Grid>
                          ))}
                        </Grid>

                        <SLabel sx={{ mb: 0.6 }}>Equipment</SLabel>
                        <Box display="flex" flexWrap="wrap" gap={0.5} mb={1.5}>
                          {selectedRoom.equipment.map((eq, i) => (
                            <Box key={i} sx={{ px: 0.9, py: 0.25, borderRadius: "5px", bgcolor: "rgba(255,255,255,0.06)", border: `1px solid ${T.border}` }}>
                              <Typography sx={{ fontFamily: fBody, fontSize: "0.64rem", color: T.textSub }}>{eq}</Typography>
                            </Box>
                          ))}
                          {selectedRoom.equipment.length === 0 && (
                            <Typography sx={{ fontFamily: fBody, fontSize: "0.68rem", color: T.textMute }}>None listed</Typography>
                          )}
                        </Box>

                        <Stack spacing={0.8}>
                          <Button fullWidth variant="contained" disabled={selectedRoom.status === "Maintenance"}
                            startIcon={<EventNote sx={{ fontSize: 14 }} />}
                            onClick={() => toast(`Booking initiated for Room ${selectedRoom.number}`, "success")}
                            sx={{ fontFamily: fBody, fontWeight: 700, fontSize: "0.76rem", textTransform: "none", borderRadius: "8px", bgcolor: selectedBuilding.color, boxShadow: "none", py: 0.8, "&:hover": { opacity: 0.9, boxShadow: "none" }, "&.Mui-disabled": { bgcolor: "rgba(255,255,255,0.06)", color: T.textMute } }}>
                            Book Room
                          </Button>
                          <Button fullWidth variant="outlined"
                            startIcon={<Timeline sx={{ fontSize: 14 }} />}
                            onClick={() => toast("Schedule loaded", "info")}
                            sx={{ fontFamily: fBody, fontWeight: 600, fontSize: "0.74rem", textTransform: "none", borderRadius: "8px", borderColor: T.border, color: T.textMute, py: 0.7, "&:hover": { borderColor: selectedBuilding.color, color: selectedBuilding.color } }}>
                            View Schedule
                          </Button>
                        </Stack>
                      </Box>
                    )}
                  </Collapse>
                </Box>
              )}

              {/* IOT TAB */}
              {sideTab === 1 && (
                <Box className="fu">
                  <Grid container spacing={1} mb={1.5}>
                    <Grid item xs={6}><MetricCard label="Temperature" value={selectedBuilding.temperature} unit="°C" icon={Thermostat} color={selectedBuilding.temperature > 26 ? T.danger : T.success} /></Grid>
                    <Grid item xs={6}><MetricCard label="CO₂ Level" value={selectedBuilding.co2Level} unit="ppm" icon={BubbleChart} color={selectedBuilding.co2Level > 500 ? T.danger : T.success} /></Grid>
                    <Grid item xs={6}><MetricCard label="Energy Use" value={selectedBuilding.energyUsage} unit="kW" icon={Bolt} color={T.warning} trend={1} /></Grid>
                    <Grid item xs={6}><MetricCard label="Water Use" value={selectedBuilding.waterUsage} unit="L" icon={WaterDrop} color={T.cyan} /></Grid>
                  </Grid>

                  <SLabel sx={{ mb: 0.8 }}>WiFi Signal Strength</SLabel>
                  <Box sx={{ px: 1.5, py: 1.2, borderRadius: "10px", bgcolor: T.surfaceAlt, mb: 1.5 }}>
                    <Box display="flex" justifyContent="space-between" mb={0.6}>
                      <Typography sx={{ fontFamily: fBody, fontSize: "0.74rem", color: T.text }}>Signal Strength</Typography>
                      <Typography sx={{ fontFamily: fMono, fontWeight: 700, fontSize: "0.78rem", color: T.accent }}>{selectedBuilding.wifiStrength}%</Typography>
                    </Box>
                    <Box sx={{ height: 6, borderRadius: 99, bgcolor: "rgba(255,255,255,0.08)", overflow: "hidden" }}>
                      <Box sx={{ height: "100%", width: `${selectedBuilding.wifiStrength}%`, borderRadius: 99, bgcolor: T.accent }} />
                    </Box>
                    <Box display="flex" gap={1.5} mt={1}>
                      {["2.4 GHz", "5 GHz"].map((band, i) => (
                        <Box key={i} sx={{ px: 1, py: 0.3, borderRadius: "5px", bgcolor: `${T.accent}15`, border: `1px solid ${T.accent}30` }}>
                          <Typography sx={{ fontFamily: fMono, fontSize: "0.62rem", color: T.accent }}>{band} ● Active</Typography>
                        </Box>
                      ))}
                    </Box>
                  </Box>

                  <SLabel sx={{ mb: 0.8 }}>Environmental Status</SLabel>
                  <Stack spacing={0.8}>
                    {[
                      { label: "HVAC System", status: selectedBuilding.hasMaintenanceAlert ? "warning" : "ok", value: selectedBuilding.hasMaintenanceAlert ? "Service Due" : "Operational" },
                      { label: "Fire Sensors", status: "ok", value: "All Clear" },
                      { label: "CCTV Coverage", status: "ok", value: "100% Active" },
                      { label: "Access Control", status: "ok", value: "Locked & Secure" },
                      { label: "Elevator", status: selectedBuilding.floors.length > 2 ? "ok" : "na", value: selectedBuilding.floors.length > 2 ? "Operational" : "N/A" },
                    ].map((item, i) => {
                      const statusColor = item.status === "ok" ? T.success : item.status === "warning" ? T.warning : T.textMute;
                      return (
                        <Box key={i} sx={{ px: 1.2, py: 0.8, borderRadius: "8px", bgcolor: T.surfaceAlt, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                          <Typography sx={{ fontFamily: fBody, fontSize: "0.73rem", color: T.textSub }}>{item.label}</Typography>
                          <Box display="flex" alignItems="center" gap={0.6}>
                            <Box sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: statusColor }} className={item.status === "warning" ? "pulse" : ""} />
                            <Typography sx={{ fontFamily: fMono, fontSize: "0.65rem", fontWeight: 700, color: statusColor }}>{item.value}</Typography>
                          </Box>
                        </Box>
                      );
                    })}
                  </Stack>
                </Box>
              )}

              {/* ANALYTICS TAB */}
              {sideTab === 2 && (
                <Box className="fu">
                  <SLabel sx={{ mb: 0.8 }}>Occupancy by Floor</SLabel>
                  <Stack spacing={0.8} mb={1.5}>
                    {selectedBuilding.floors.map((f, i) => {
                      const occupied = f.rooms.filter(r => r.status === "Occupied").length;
                      const pct = f.rooms.length > 0 ? Math.round((occupied / f.rooms.length) * 100) : 0;
                      return (
                        <Box key={f.id} sx={{ px: 1.2, py: 0.8, borderRadius: "8px", bgcolor: T.surfaceAlt }}>
                          <Box display="flex" justifyContent="space-between" mb={0.4}>
                            <Typography sx={{ fontFamily: fBody, fontSize: "0.73rem", color: T.text }}>{f.name}</Typography>
                            <Typography sx={{ fontFamily: fMono, fontSize: "0.68rem", fontWeight: 700, color: pct > 70 ? T.danger : T.success }}>{pct}%</Typography>
                          </Box>
                          <Box sx={{ height: 4, borderRadius: 99, bgcolor: "rgba(255,255,255,0.08)", overflow: "hidden" }}>
                            <Box sx={{ height: "100%", width: `${pct}%`, borderRadius: 99, bgcolor: pct > 70 ? T.danger : T.success }} />
                          </Box>
                          <Typography sx={{ fontFamily: fBody, fontSize: "0.62rem", color: T.textMute, mt: 0.3 }}>{occupied}/{f.rooms.length} rooms occupied</Typography>
                        </Box>
                      );
                    })}
                  </Stack>

                  <SLabel sx={{ mb: 0.8 }}>Room Type Distribution</SLabel>
                  <Box sx={{ px: 1.5, py: 1.2, borderRadius: "10px", bgcolor: T.surfaceAlt, mb: 1.5 }}>
                    {(() => {
                      const allRooms = selectedBuilding.floors.flatMap(f => f.rooms);
                      const types = {};
                      allRooms.forEach(r => { types[r.type] = (types[r.type] || 0) + 1; });
                      return Object.entries(types).map(([type, count]) => (
                        <Box key={type} display="flex" justifyContent="space-between" alignItems="center" mb={0.5}>
                          <Typography sx={{ fontFamily: fBody, fontSize: "0.72rem", color: T.textSub, textTransform: "capitalize" }}>{type}</Typography>
                          <Box display="flex" alignItems="center" gap={0.8}>
                            <Box sx={{ height: 4, width: `${(count / allRooms.length) * 80}px`, borderRadius: 99, bgcolor: selectedBuilding.color, opacity: 0.7 }} />
                            <Typography sx={{ fontFamily: fMono, fontSize: "0.68rem", fontWeight: 700, color: T.text, minWidth: 16, textAlign: "right" }}>{count}</Typography>
                          </Box>
                        </Box>
                      ));
                    })()}
                  </Box>

                  <SLabel sx={{ mb: 0.8 }}>Energy Trend (7-day)</SLabel>
                  <Box sx={{ px: 1.5, py: 1.2, borderRadius: "10px", bgcolor: T.surfaceAlt }}>
                    <Box display="flex" alignItems="flex-end" gap={0.4} height={50}>
                      {[72, 68, 80, 75, 90, 83, selectedBuilding.energyUsage / 12].map((v, i) => (
                        <Box key={i} sx={{ flex: 1, bgcolor: i === 6 ? selectedBuilding.color : `${selectedBuilding.color}50`, borderRadius: "3px 3px 0 0", height: `${(v / 95) * 100}%`, transition: "height 1s ease" }} />
                      ))}
                    </Box>
                    <Box display="flex" justifyContent="space-between" mt={0.5}>
                      {["M", "T", "W", "T", "F", "S", "Today"].map((d, i) => (
                        <Typography key={i} sx={{ fontFamily: fMono, fontSize: "0.55rem", color: i === 6 ? selectedBuilding.color : T.textMute }}>{d}</Typography>
                      ))}
                    </Box>
                  </Box>
                </Box>
              )}
            </Box>
          </Box>
        )}
      </Box>

      {/* Toast */}
      <Snackbar open={snack.open} autoHideDuration={3500} onClose={() => setSnack(s => ({ ...s, open: false }))} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <Alert severity={snack.severity} sx={{ borderRadius: "10px", fontFamily: fBody, fontWeight: 600, bgcolor: T.surfaceAlt, color: T.text, border: `1px solid ${T.border}` }} onClose={() => setSnack(s => ({ ...s, open: false }))}>
          {snack.msg}
        </Alert>
      </Snackbar>
    </Box>
  );
}