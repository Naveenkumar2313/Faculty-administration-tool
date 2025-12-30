import { useState, useEffect } from "react";

// --- MOCK DATA ---
const MOCK_SALARY_HISTORY = [
  { id: 101, month: "October", year: 2023, basic: 45000, da: 12000, hra: 8000, deductions: 2500, net: 62500, status: "Paid" },
  { id: 102, month: "September", year: 2023, basic: 45000, da: 12000, hra: 8000, deductions: 2500, net: 62500, status: "Paid" },
  { id: 103, month: "August", year: 2023, basic: 43000, da: 11000, hra: 7500, deductions: 2500, net: 59000, status: "Paid" },
];

const MOCK_TAX_DECLARATION = {
  regime: "new", // 'old' or 'new'
  investments: {
    lic: 15000,
    ppf: 50000,
    elss: 0,
    mediclaim: 12000,
    hra_rent: 180000
  },
  status: "Submitted" // 'Draft', 'Submitted', 'Verified'
};

const usePayrollSystem = () => {
  const [salarySlips, setSalarySlips] = useState([]);
  const [taxData, setTaxData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API Call
    setTimeout(() => {
      setSalarySlips(MOCK_SALARY_HISTORY);
      setTaxData(MOCK_TAX_DECLARATION);
      setLoading(false);
    }, 800);
  }, []);

  const downloadSlip = (id) => {
    alert(`Downloading PDF for Slip ID: ${id}... (Backend integration required)`);
  };

  const submitTaxDeclaration = async (values) => {
    console.log("Submitting Tax Data:", values);
    return new Promise(resolve => setTimeout(resolve, 1000));
  };

  return { salarySlips, taxData, loading, downloadSlip, submitTaxDeclaration };
};

export default usePayrollSystem;