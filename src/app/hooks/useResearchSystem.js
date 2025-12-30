import { useState, useEffect } from "react";

// --- MOCK DATA: PUBLICATIONS ---
const MOCK_PUBS = [
  { id: 1, title: "Deep Learning in Edu", journal: "IEEE Access", year: 2023, citations: 15, type: "Journal", impactFactor: 4.5, status: "Published" },
  { id: 2, title: "Cloud ERP Systems", journal: "Springer", year: 2022, citations: 42, type: "Book Chapter", impactFactor: 0, status: "Published" },
  { id: 3, title: "AI in Attendance", journal: "ICACCI", year: 2024, citations: 1, type: "Conference", impactFactor: 0, status: "Accepted" },
];

// --- MOCK DATA: GRANTS ---
const MOCK_GRANTS = [
  { 
    id: "G-101", title: "AI for Rural Education", agency: "DST-SERB", 
    amountSanctioned: 2500000, amountReceived: 1500000, 
    startDate: "2022-06-01", duration: "3 Years", status: "Ongoing",
    milestones: [{ name: "Phase 1: Data Collection", done: true }, { name: "Phase 2: Prototype", done: false }]
  },
  { 
    id: "G-102", title: "IoT Campus Security", agency: "University Internal", 
    amountSanctioned: 50000, amountReceived: 50000, 
    startDate: "2023-01-15", duration: "1 Year", status: "Completed",
    milestones: [{ name: "Final Report Submitted", done: true }]
  }
];

// --- MOCK DATA: APPRAISAL (Previous Scores) ---
const MOCK_APPRAISAL_HISTORY = [
  { year: "2023-2024", score: 145, status: "Submitted" },
  { year: "2022-2023", score: 120, status: "Approved" },
];

const useResearchSystem = () => {
  const [publications, setPublications] = useState([]);
  const [grants, setGrants] = useState([]);
  const [appraisalHistory, setAppraisalHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setPublications(MOCK_PUBS);
      setGrants(MOCK_GRANTS);
      setAppraisalHistory(MOCK_APPRAISAL_HISTORY);
      setLoading(false);
    }, 800);
  }, []);

  // Actions
  const addPublication = async (data) => {
    console.log("Adding Pub:", data);
    setPublications(prev => [ ...prev, { ...data, id: Math.random(), status: 'Submitted' }]);
  };

  const submitAppraisal = async (data) => {
    console.log("Submitting PBAS:", data);
    return true;
  };

  return { publications, grants, appraisalHistory, loading, addPublication, submitAppraisal };
};

export default useResearchSystem;