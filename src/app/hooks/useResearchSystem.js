import { useState, useEffect } from 'react';

const useResearchSystem = () => {
  const [loading, setLoading] = useState(true);

  // 1. Impact Metrics
  const [metrics, setMetrics] = useState({
    citations: 452,
    hIndex: 12,
    i10Index: 15,
    researchGateScore: 24.5,
    citationGrowth: [
      { year: 2019, count: 20 },
      { year: 2020, count: 45 },
      { year: 2021, count: 80 },
      { year: 2022, count: 120 },
      { year: 2023, count: 187 },
    ]
  });

  // 2. My Publications
  const [publications, setPublications] = useState([
    { 
      id: 1, 
      title: "Deep Learning in Thermal Imaging", 
      journal: "IEEE Transactions on Industrial Informatics", 
      year: 2023, 
      citations: 12, 
      status: "Published", 
      ugcCare: true, 
      scopus: true, 
      proofUploaded: true 
    },
    { 
      id: 2, 
      title: "Blockchain for Supply Chain Transparency", 
      journal: "Intl. Journal of Logistics", 
      year: 2022, 
      citations: 28, 
      status: "Published", 
      ugcCare: true, 
      scopus: false, 
      proofUploaded: false 
    }
  ]);

  // 3. Publication Planner (Targeting & Review)
  const [planner, setPlanner] = useState([
    { 
      id: 101, 
      title: "Zero-Knowledge Proofs in IoT", 
      targetJournal: "Elsevier Computers & Security", 
      deadline: "Nov 30, 2023", 
      stage: "Drafting", // Drafting, Submitted, Under Review, Revision
      probability: "High" 
    },
    { 
      id: 102, 
      title: "AI Ethics in Healthcare", 
      targetJournal: "Nature Digital Medicine", 
      deadline: "Oct 15, 2023", 
      stage: "Under Review", 
      probability: "Medium" 
    }
  ]);

  // 4. Co-Authors
  const [coAuthors, setCoAuthors] = useState([
    { id: 1, name: "Dr. A. Smith", affil: "MIT", collaborations: 3 },
    { id: 2, name: "Prof. R. Gupta", affil: "IIT Delhi", collaborations: 5 },
  ]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 800);
  }, []);

  // --- ACTIONS ---

  const checkPredatory = (journalName) => {
    // Mock Logic: Flag journals containing "Global" or "Generic" as suspicious for demo
    const isSuspicious = journalName.includes("Global") || journalName.includes("Generic");
    return {
      isPredatory: isSuspicious,
      message: isSuspicious 
        ? "Flagged: Potential predatory journal. Not found in UGC-CARE list." 
        : "Verified: Listed in Scopus & UGC-CARE."
    };
  };

  const syncORCID = () => {
    return new Promise((resolve) => {
      setTimeout(() => resolve("Synced 2 new papers from ORCID."), 1500);
    });
  };

  return {
    loading,
    metrics,
    publications,
    planner,
    coAuthors,
    checkPredatory,
    syncORCID
  };
};

export default useResearchSystem;