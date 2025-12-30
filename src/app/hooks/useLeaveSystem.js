import { useState, useEffect } from "react";

// --- MOCK DATABASE RESPONSE ---
const MOCK_BALANCES = {
  cl: { total: 12, used: 4, available: 8, name: "Casual Leave" },
  el: { total: 30, used: 0, available: 30, name: "Earned Leave" },
  ml: { total: 10, used: 2, available: 8, name: "Medical Leave" },
  od: { total: 15, used: 1, available: 14, name: "On Duty (OD)" }
};

const MOCK_HISTORY = [
  { id: 101, type: "CL", from: "2023-10-05", to: "2023-10-06", days: 2, reason: "Personal work", status: "Approved", substitute: "Dr. A. Sharma" },
  { id: 102, type: "OD", from: "2023-11-12", to: "2023-11-12", days: 1, reason: "External Examiner Duty", status: "Pending", substitute: "Prof. K. Verma" },
];

const MOCK_FACULTY_LIST = [
  { id: "FAC002", name: "Dr. Amit Sharma" },
  { id: "FAC003", name: "Prof. Kavita Verma" },
  { id: "FAC004", name: "Dr. John Doe" },
];

const useLeaveSystem = () => {
  const [balances, setBalances] = useState(null);
  const [history, setHistory] = useState([]);
  const [facultyList, setFacultyList] = useState([]); // For substitution dropdown
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // SIMULATE FETCHING DATA FROM API
    const fetchData = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 800)); // 800ms delay
      
      setBalances(MOCK_BALANCES);
      setHistory(MOCK_HISTORY);
      setFacultyList(MOCK_FACULTY_LIST);
      setLoading(false);
    };
    fetchData();
  }, []);

  // SIMULATE APPLYING FOR LEAVE
  const applyForLeave = async (values) => {
    console.log("Submitting Leave Request to Backend:", values);
    
    return new Promise((resolve) => {
      setTimeout(() => {
        // Optimistically update the history list locally
        const newLeave = {
          id: Math.random(),
          type: values.leaveType,
          from: values.startDate,
          to: values.endDate,
          days: 3, // Logic to calculate days diff goes here usually
          reason: values.reason,
          status: "Pending", // Default status
          substitute: facultyList.find(f => f.id === values.substituteId)?.name || "Unknown"
        };
        
        setHistory(prev => [newLeave, ...prev]);
        resolve({ success: true, message: "Leave application submitted to HOD." });
      }, 1000);
    });
  };

  return { balances, history, facultyList, loading, applyForLeave };
};

export default useLeaveSystem;