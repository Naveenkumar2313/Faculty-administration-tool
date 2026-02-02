import { useState, useEffect } from 'react';

const useLegalSystem = () => {
  const [loading, setLoading] = useState(true);

  // 1. Employment Contracts Data
  const [contracts, setContracts] = useState([
    { id: 101, title: "Original Appointment Letter", type: "Appointment", date: "June 20, 2018", docSize: "2.4 MB" },
    { id: 102, title: "Probation Confirmation", type: "Amendment", date: "June 20, 2019", docSize: "1.1 MB" },
    { id: 103, title: "Promotion Order (Assoc. Prof)", type: "Promotion", date: "Aug 01, 2022", docSize: "1.5 MB" },
    { id: 104, title: "Annual Increment Letter 2023", type: "Renewal", date: "July 01, 2023", docSize: "0.8 MB" },
  ]);

  // 2. Service Bonds Data
  const [bonds, setBonds] = useState([
    { 
      id: "BOND-PHD-001", 
      title: "Ph.D. Sponsorship Bond", 
      totalValue: 500000, 
      startDate: "2020-01-01", 
      endDate: "2023-01-01", 
      servicePeriodYears: 3,
      status: "Active",
      remainingMonths: 14 
    }
  ]);

  // 3. NDAs Data
  const [ndas, setNdas] = useState([
    { id: 1, title: "Research Data NDA", party: "Samsung R&D", date: "Sep 12, 2023", status: "Active" },
    { id: 2, title: "Student Data Confidentiality", party: "University Internal", date: "Jan 01, 2023", status: "Perpetual" },
  ]);

  // 4. Consultancy Agreements
  const [consultancyAgreements, setConsultancyAgreements] = useState([
    { 
      id: "CON-2023-01", 
      project: "Thermal Systems Opt.", 
      client: "Tata Motors", 
      revenueShare: "70:30 (Faculty:Univ)", 
      ipRights: "Jointly Owned",
      approvalDate: "Aug 10, 2023"
    }
  ]);

  // 5. Insurance Data
  const [insurance, setInsurance] = useState({
    policyNo: "MED-GRP-998877",
    provider: "Star Health Insurance",
    validTill: "Mar 31, 2024",
    sumInsured: 500000,
    nominees: [
      { name: "Priya Kumar", relation: "Spouse", share: 100 }
    ]
  });

  useEffect(() => {
    setTimeout(() => setLoading(false), 800);
  }, []);

  // --- ACTIONS ---

  // Calculator: Liquidated Damages (Remaining Months * Salary Factor)
  const calculateDamages = (bondId, monthlySalary) => {
    const bond = bonds.find(b => b.id === bondId);
    if (!bond) return 0;
    // Simple Logic: Remaining Months * Salary
    return bond.remainingMonths * monthlySalary; 
  };

  const updateNominee = (newNomineeList) => {
    setInsurance(prev => ({ ...prev, nominees: newNomineeList }));
  };

  return { 
    loading, 
    contracts, 
    bonds, 
    ndas, 
    consultancyAgreements, 
    insurance,
    calculateDamages,
    updateNominee
  };
};

export default useLegalSystem;