import { useState, useEffect } from 'react';

const useGrantSystem = () => {
  const [loading, setLoading] = useState(true);

  // 1. Grant Opportunities (Alerts)
  const [opportunities, setOpportunities] = useState([
    { id: 1, agency: "DST-SERB", scheme: "Core Research Grant (CRG)", deadline: "Nov 30, 2023", match: "High", grantAmount: "₹50L - ₹80L" },
    { id: 2, agency: "ICMR", scheme: "Ad-hoc Research Project", deadline: "Dec 15, 2023", match: "Medium", grantAmount: "₹20L - ₹40L" },
    { id: 3, agency: "MeitY", scheme: "R&D in Cyber Security", deadline: "Jan 10, 2024", match: "High", grantAmount: "₹1Cr+" },
  ]);

  // 2. Application Tracker
  const [applications, setApplications] = useState([
    { id: 101, title: "AI-Driven Crop Disease Detection", agency: "NABARD", submitted: "Aug 10, 2023", status: "Under Review", feedback: null },
    { id: 102, title: "IoT in Rural Healthcare", agency: "DST", submitted: "Jun 01, 2023", status: "Rejected", feedback: "Methodology lacks specific sample size calculation." },
    { id: 103, title: "Blockcahin for Land Records", agency: "State Govt", submitted: "Sep 20, 2023", status: "Shortlisted", feedback: "Presentation scheduled for Nov 05." },
  ]);

  // 3. Active Projects List
  const [projects, setProjects] = useState([
    { id: "PRJ-2022-01", title: "Smart Grid Security Framework", agency: "DST-SERB", budget: 3500000, duration: "2022-2025" },
    { id: "PRJ-2023-05", title: "Waste-to-Energy Optimization", agency: "CSIR", budget: 2200000, duration: "2023-2026" },
  ]);

  // --- DETAIL DATA (Loaded when a project is selected) ---
  
  // 4. Budget & Expenditure (For PRJ-2022-01)
  const [budgetHeads, setBudgetHeads] = useState([
    { head: "Manpower", allocated: 1200000, used: 850000 },
    { head: "Equipment", allocated: 1500000, used: 1450000 },
    { head: "Travel", allocated: 200000, used: 45000 },
    { head: "Consumables", allocated: 400000, used: 120000 },
    { head: "Contingency", allocated: 200000, used: 50000 },
  ]);

  // 5. Team
  const [team, setTeam] = useState([
    { id: 1, name: "Mr. Arjun K", role: "JRF", joinDate: "Jan 2023", status: "Active" },
    { id: 2, name: "Ms. Priya S", role: "Project Assistant", joinDate: "Feb 2023", status: "Active" },
  ]);

  // 6. Deliverables
  const [deliverables, setDeliverables] = useState([
    { id: 1, title: "Attack Vector Analysis", type: "Publication", status: "Published (IEEE Access)" },
    { id: 2, title: "Secure Handshake Protocol", type: "Patent", status: "Filed (App #223311)" },
  ]);

  // 7. Reports
  const [reports, setReports] = useState([
    { id: 1, title: "Annual Progress Report (Y1)", due: "Mar 31, 2023", status: "Submitted", date: "Mar 28, 2023" },
    { id: 2, title: "Utilization Certificate (UC) - Q2", due: "Oct 15, 2023", status: "Pending", date: null },
  ]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 800);
  }, []);

  return {
    loading,
    opportunities,
    applications,
    projects,
    budgetHeads,
    team,
    deliverables,
    reports
  };
};

export default useGrantSystem;