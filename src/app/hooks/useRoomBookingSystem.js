import { useState, useEffect } from 'react';

const useRoomBookingSystem = () => {
  const [loading, setLoading] = useState(true);

  // 1. Room Inventory
  const [rooms, setRooms] = useState([
    { 
      id: "R-101", name: "Conference Hall A", capacity: 120, floor: 1, 
      type: "AC", features: ["Projector", "Video Conf", "Smart Board"], 
      status: "Available", image: "https://via.placeholder.com/150" 
    },
    { 
      id: "R-102", name: "Lecture Hall 1", capacity: 60, floor: 1, 
      type: "Non-AC", features: ["Projector", "Mic System"], 
      status: "Available", image: "https://via.placeholder.com/150" 
    },
    { 
      id: "R-201", name: "Seminar Room", capacity: 30, floor: 2, 
      type: "AC", features: ["Smart Board", "Whiteboard"], 
      status: "Maintenance", image: "https://via.placeholder.com/150" 
    },
    { 
      id: "R-202", name: "Computer Lab 1", capacity: 40, floor: 2, 
      type: "AC", features: ["Computers", "Projector", "High-Speed Net"], 
      status: "Available", image: "https://via.placeholder.com/150" 
    },
  ]);

  // 2. Bookings Database
  const [bookings, setBookings] = useState([
    { id: "BK-001", room: "Conference Hall A", roomId: "R-101", date: "2023-10-28", slot: "10:00 - 12:00", purpose: "Dept Meeting", user: "Self", status: "Confirmed" },
    { id: "BK-002", room: "Lecture Hall 1", roomId: "R-102", date: "2023-10-29", slot: "14:00 - 16:00", purpose: "Guest Lecture", user: "Self", status: "Pending Approval" },
    { id: "BK-999", room: "Conference Hall A", roomId: "R-101", date: "2023-10-28", slot: "14:00 - 15:00", purpose: "Student Club", user: "Other", status: "Confirmed" }, 
  ]);

  // 3. Analytics Data
  const stats = {
    utilization: 68, // %
    peakTime: "10 AM - 12 PM",
    mostBooked: "Conference Hall A",
    pendingRequests: 3
  };

  useEffect(() => {
    setTimeout(() => setLoading(false), 800);
  }, []);

  // --- ACTIONS ---

  const checkAvailability = (roomId, date, timeSlot) => {
    // Simple exact match for demo (In real app, would check overlapping time ranges)
    const conflict = bookings.find(b => b.roomId === roomId && b.date === date && b.slot === timeSlot && b.status !== 'Cancelled');
    return !conflict;
  };

  const bookRoom = (details) => {
    return new Promise((resolve, reject) => {
      // 1. Conflict Check
      if (!checkAvailability(details.roomId, details.date, details.slot)) {
        reject("Slot Conflict: Room already booked by another user.");
        return;
      }
      
      const roomName = rooms.find(r => r.id === details.roomId)?.name;
      
      const newBooking = {
        id: `BK-${Date.now()}`,
        room: roomName,
        roomId: details.roomId,
        date: details.date,
        slot: details.slot,
        purpose: details.purpose,
        user: "Self",
        status: "Pending Approval" // Default workflow
      };
      
      setTimeout(() => {
        setBookings([newBooking, ...bookings]);
        resolve(newBooking);
      }, 1000);
    });
  };

  const cancelBooking = (id) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: "Cancelled" } : b));
  };

  return {
    loading,
    rooms,
    bookings,
    stats,
    checkAvailability,
    bookRoom,
    cancelBooking
  };
};

export default useRoomBookingSystem;