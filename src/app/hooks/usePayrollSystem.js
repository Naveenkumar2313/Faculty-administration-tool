import { useState, useEffect } from 'react';

const usePayrollSystem = () => {
  const [loading, setLoading] = useState(true);

  // 1. Basic Salary Data
  const [salaryData, setSalaryData] = useState({
    basic: 142000,
    da: 28400, // 20%
    hra: 12000,
    special: 5000,
    gross: 187400,
    deductions: 18000, // PF + Tax
    net: 169400,
    month: "October 2023"
  });

  // 2. Pay Comparison Data (You vs Avg)
  const [comparisonData, setComparisonData] = useState({
    mySalary: 187400,
    avgSalary: 175000,
    highestSalary: 195000,
    grade: "Associate Professor (Grade 4)"
  });

  // 3. Loans & Advances
  const [loans, setLoans] = useState([
    { id: 1, type: "Computer Advance", total: 50000, paid: 35000, installment: 2500, status: "Active" },
    { id: 2, type: "Personal Loan (Uni)", total: 200000, paid: 200000, installment: 0, status: "Closed" },
  ]);

  // 4. Arrears
  const [arrears, setArrears] = useState([
    { id: 101, title: "DA Increment Arrears (Jan-Mar)", amount: 12500, date: "Apr 2023", status: "Paid" },
    { id: 102, title: "Promotion Arrear Adjustment", amount: 45000, date: "Nov 2023", status: "Pending" },
  ]);

  // 5. Form 16 Documents
  const [form16s, setForm16s] = useState([
    { year: "2022-2023", generated: "June 15, 2023", size: "1.2 MB" },
    { year: "2021-2022", generated: "June 10, 2022", size: "1.1 MB" },
  ]);

  // 6. EPF Data
  const [pfData, setPfData] = useState({
    uan: "100900223112",
    balance: 450200,
    employeeShare: 1800, // Monthly
    employerShare: 1800, // Monthly
    history: [
      { month: "Oct 2023", employee: 1800, employer: 1800 },
      { month: "Sep 2023", employee: 1800, employer: 1800 },
      { month: "Aug 2023", employee: 1800, employer: 1800 },
    ]
  });

  useEffect(() => {
    // Simulate API call
    setTimeout(() => setLoading(false), 800);
  }, []);

  // Helper: Calculate Gratuity
  const calculateGratuity = (years, lastDrawnBasicDA) => {
    // Formula: (15 * Last Drawn * Years) / 26
    if (!years || !lastDrawnBasicDA) return 0;
    return Math.round((15 * lastDrawnBasicDA * years) / 26);
  };

  return { 
    loading, 
    salaryData, 
    comparisonData, 
    loans, 
    arrears, 
    form16s, 
    pfData,
    calculateGratuity
  };
};

export default usePayrollSystem;