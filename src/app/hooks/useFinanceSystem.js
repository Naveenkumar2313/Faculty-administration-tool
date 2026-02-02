import { useState, useEffect } from 'react';

const useFinanceSystem = () => {
  const [loading, setLoading] = useState(true);

  // 1. Annual Budget Limits
  const [budgets, setBudgets] = useState([
    { category: "Conference & Travel", limit: 50000, used: 12500, color: "primary" },
    { category: "Medical Reimbursement", limit: 15000, used: 3000, color: "error" },
    { category: "Professional Membership", limit: 10000, used: 8500, color: "warning" },
    { category: "Book & Internet Allowance", limit: 12000, used: 4000, color: "success" },
  ]);

  // 2. My Claims History
  const [claims, setClaims] = useState([
    { 
      id: "CLM-2023-001", 
      type: "Conference Fee", 
      amount: 12500, 
      date: "Oct 15, 2023", 
      status: "Finance Processing", 
      step: 2, // 0:Submitted, 1:HOD, 2:Finance, 3:Paid
      description: "Registration for IEEE ICC 2023",
      rejectionReason: null 
    },
    { 
      id: "CLM-2023-002", 
      type: "Medical Claim", 
      amount: 2400, 
      date: "Sep 20, 2023", 
      status: "Paid", 
      step: 3,
      description: "OPD Consultation - Dr. Smith",
      rejectionReason: null 
    },
    { 
      id: "CLM-2023-003", 
      type: "Travel Allowance", 
      amount: 8500, 
      date: "Aug 05, 2023", 
      status: "Rejected", 
      step: 0,
      description: "Flight to Delhi for Seminar",
      rejectionReason: "Boarding pass missing. Please resubmit." 
    }
  ]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 800);
  }, []);

  // --- ACTIONS ---

  const calculateTADA = (distance, mode, cityType) => {
    // Mock Calculation Logic
    let rate = mode === 'Car' ? 12 : mode === 'Bike' ? 6 : 0;
    let travelCost = distance * rate;
    let da = cityType === 'Metro' ? 1200 : 800; // Per Diem
    return { travelCost, da, total: travelCost + da };
  };

  const submitClaim = (newClaim) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const claimEntry = { 
          ...newClaim, 
          id: `CLM-2023-${Math.floor(Math.random() * 1000)}`,
          status: "Submitted",
          step: 0
        };
        setClaims([claimEntry, ...claims]);
        
        // Update Budget Usage
        const categoryMap = {
          "Conference Fee": "Conference & Travel",
          "Travel Allowance": "Conference & Travel",
          "Medical Claim": "Medical Reimbursement",
          "Membership Fee": "Professional Membership",
          "Internet/Mobile": "Book & Internet Allowance"
        };
        
        const budgetCat = categoryMap[newClaim.type];
        if (budgetCat) {
          setBudgets(prev => prev.map(b => 
            b.category === budgetCat ? { ...b, used: b.used + Number(newClaim.amount) } : b
          ));
        }
        
        resolve();
      }, 1000);
    });
  };

  return { 
    loading, 
    budgets, 
    claims, 
    calculateTADA, 
    submitClaim
  };
};

export default useFinanceSystem;