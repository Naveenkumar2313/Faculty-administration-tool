import { useState, useEffect } from 'react';

const useGrievanceSystem = () => {
  const [loading, setLoading] = useState(true);

  // Mock Categories
  const categories = [
    "Salary & Payroll",
    "Harassment & Misconduct",
    "Facilities & Infrastructure",
    "Workload & Academics",
    "IT & Technical Support",
    "Others"
  ];

  // Mock Data
  const [activeTicket, setActiveTicket] = useState({
    id: "GR-2023-992",
    subject: "Lab Equipment Safety in Block C",
    category: "Facilities & Infrastructure",
    date: "Oct 20, 2023",
    status: "Under Review",
    step: 1, // 0: Submitted, 1: Review, 2: Proposal, 3: Closed
    slaDate: "Nov 04, 2023", // 15 days SLA
    isAnonymous: false
  });

  const [history, setHistory] = useState([
    { 
      id: "GR-2023-850", 
      subject: "Incorrect DA Calculation", 
      category: "Salary & Payroll", 
      date: "Aug 10, 2023", 
      status: "Resolved", 
      resolution: "Arrears credited in Sep payroll.",
      rating: 4, // 1-5
      isAnonymous: false
    },
    { 
      id: "GR-2023-112", 
      subject: "Projector Malfunction Room 304", 
      category: "Facilities & Infrastructure", 
      date: "Jun 15, 2023", 
      status: "Resolved", 
      resolution: "Projector replaced.",
      rating: 0, // Not rated yet
      isAnonymous: true 
    }
  ]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 800);
  }, []);

  const submitGrievance = (data) => {
    // Mock API Call
    console.log("Submitting:", data);
    alert("Grievance lodged successfully. Ticket ID generated.");
  };

  const escalateGrievance = (id) => {
    if(activeTicket.id === id) {
      setActiveTicket(prev => ({ ...prev, status: "Escalated to Dean" }));
    }
  };

  const submitRating = (id, rating) => {
    setHistory(prev => prev.map(item => 
      item.id === id ? { ...item, rating } : item
    ));
  };

  return { 
    loading, 
    categories, 
    activeTicket, 
    history, 
    submitGrievance, 
    escalateGrievance,
    submitRating
  };
};

export default useGrievanceSystem;