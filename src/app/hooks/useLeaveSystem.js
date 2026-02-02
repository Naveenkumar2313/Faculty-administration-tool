import { useState, useEffect } from 'react';

const useLeaveSystem = () => {
  const [loading, setLoading] = useState(true);
  
  // Mock Balance Data
  const [balance, setBalance] = useState({
    casual: 12,
    medical: 10,
    earned: 15,
    onDuty: 10
  });

  // Mock Personal Leaves
  const [leaves, setLeaves] = useState([
    { id: 1, type: "Medical Leave", from: new Date(2023, 9, 10), to: new Date(2023, 9, 12), days: 3, status: "Approved", reason: "Viral Fever" },
    { id: 2, type: "Casual Leave", from: new Date(2023, 10, 5), to: new Date(2023, 10, 6), days: 2, status: "Pending", reason: "Family Function" },
  ]);

  // Mock Department Leaves (Colleagues)
  const [deptLeaves, setDeptLeaves] = useState([
    { id: 101, name: "Dr. Sarah Smith", type: "OD", date: new Date(2023, 9, 24), status: "Approved" },
    { id: 102, name: "Prof. Rajan", type: "Casual", date: new Date(2023, 9, 25), status: "Approved" },
    { id: 103, name: "Dr. Emily", type: "Medical", date: new Date(2023, 9, 26), status: "Pending" },
  ]);

  useEffect(() => {
    // Simulate API Fetch
    setTimeout(() => setLoading(false), 800);
  }, []);

  // 1. Submit Leave & Auto-deduct
  const submitLeave = (newLeave) => {
    return new Promise((resolve, reject) => {
      setLoading(true);
      setTimeout(() => {
        // Calculate Days
        const diffTime = Math.abs(newLeave.to - newLeave.from);
        const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; 

        // Check Balance
        const leaveKey = newLeave.type.split(' ')[0].toLowerCase(); // e.g. "Medical Leave" -> "medical"
        if (balance[leaveKey] !== undefined && balance[leaveKey] < days) {
           setLoading(false);
           reject("Insufficient Leave Balance!");
           return;
        }

        // Deduct Balance (Simulating immediate deduction upon request, or you can do it on approval)
        setBalance(prev => ({
          ...prev,
          [leaveKey]: prev[leaveKey] - days
        }));

        // Add to List
        const leaveEntry = { ...newLeave, id: Date.now(), days, status: "Pending" };
        setLeaves(prev => [leaveEntry, ...prev]);
        
        setLoading(false);
        resolve(leaveEntry);
      }, 1000);
    });
  };

  // 2. Cancel Leave Logic
  const cancelLeave = (id) => {
    setLoading(true);
    setTimeout(() => {
      const leaveToCancel = leaves.find(l => l.id === id);
      if (leaveToCancel && leaveToCancel.status === 'Pending') {
        // Refund Balance
        const leaveKey = leaveToCancel.type.split(' ')[0].toLowerCase();
        setBalance(prev => ({
          ...prev,
          [leaveKey]: prev[leaveKey] + leaveToCancel.days
        }));
        
        // Remove or Update Status
        setLeaves(prev => prev.filter(l => l.id !== id)); // Removing for demo, or set status 'Cancelled'
      }
      setLoading(false);
    }, 500);
  };

  return { leaves, deptLeaves, balance, loading, submitLeave, cancelLeave };
};

export default useLeaveSystem;