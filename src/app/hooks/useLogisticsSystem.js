import { useState, useEffect } from "react";

// --- MOCK DATA: ASSETS ---
const MOCK_ASSETS = [
  { id: "AST-101", name: "Dell Latitude 5420", type: "Laptop", serial: "8X992A", status: "Good", issuedDate: "2022-01-15" },
  { id: "AST-102", name: "Cabin Keys (Room 402)", type: "Keys", serial: "KEY-402", status: "Good", issuedDate: "2018-06-15" },
  { id: "AST-103", name: "Epson Projector", type: "Equipment", serial: "EP-8821", status: "Needs Repair", issuedDate: "2023-03-10" },
];

// --- MOCK DATA: ROOMS ---
const MOCK_ROOMS = [
  { id: "RM-101", name: "Seminar Hall A", capacity: 120, features: ["Projector", "AC", "Sound System"], status: "Available" },
  { id: "RM-102", name: "Computer Lab 1", capacity: 60, features: ["50 PCs", "Whiteboard"], status: "Booked" },
  { id: "RM-201", name: "Conference Room", capacity: 15, features: ["Video Conf", "AC"], status: "Available" },
];

const useLogisticsSystem = () => {
  const [assets, setAssets] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API Fetch
    setTimeout(() => {
      setAssets(MOCK_ASSETS);
      setRooms(MOCK_ROOMS);
      setLoading(false);
    }, 800);
  }, []);

  // Action: Report a broken asset
  const reportIssue = async (assetId, issueDescription) => {
    console.log(`Reporting issue for ${assetId}: ${issueDescription}`);
    return new Promise(resolve => setTimeout(resolve, 1000));
  };

  // Action: Book a room
  const bookRoom = async (roomId, date, timeSlot) => {
    console.log(`Booking Room ${roomId} on ${date} for ${timeSlot}`);
    // Optimistic Update: Mark room as booked locally
    setRooms(prev => prev.map(r => r.id === roomId ? { ...r, status: "Booked" } : r));
    return new Promise(resolve => setTimeout(resolve, 1000));
  };

  return { assets, rooms, loading, reportIssue, bookRoom };
};

export default useLogisticsSystem;