import { useState, useEffect } from 'react';

const useAppraisalSystem = () => {
  const [loading, setLoading] = useState(true);

  // --- CATEGORY I: Teaching (Max 100) ---
  const [cat1, setCat1] = useState({
    lectures: { count: 180, points: 60 }, // Max 70
    practicals: { count: 40, points: 10 },
    mentoring: { count: 20, points: 5 },
    feedback: { score: 4.5, points: 10 }, // Max 10
    innovation: { count: 2, points: 10 },
    total: 95
  });

  // --- CATEGORY II: Professional Dev (Max 100) ---
  const [cat2, setCat2] = useState({
    clubs: { count: 1, points: 10 },
    nss: { count: 0, points: 0 },
    fdp: { count: 2, points: 20 },
    conferences: { count: 1, points: 10 },
    adminRoles: { count: 2, points: 20 },
    total: 60
  });

  // --- CATEGORY III: Research (No Max) ---
  const [cat3, setCat3] = useState({
    journals: { q1: 2, q2: 1, points: 65 }, // 25*2 + 15
    books: { international: 0, national: 1, points: 20 },
    projects: { major: 1, minor: 0, points: 30 },
    phd: { awarded: 1, ongoing: 2, points: 40 }, // 30 + 5*2
    total: 155
  });

  const [documents, setDocuments] = useState([
    { id: 1, category: "Cat-I", title: "Time Table Sem 1.pdf", status: "Verified" },
    { id: 2, category: "Cat-III", title: "IEEE Acceptance Letter.pdf", status: "Pending" }
  ]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 800);
  }, []);

  // --- ACTIONS ---

  const calculateTotalAPI = () => cat1.total + cat2.total + cat3.total;

  const getPromotionStatus = () => {
    const total = calculateTotalAPI();
    // Mock Logic for Assistant Prof (Grade 12) -> Assoc Prof (Grade 13)
    const required = 300; 
    return {
      eligible: total >= required,
      shortfall: total < required ? required - total : 0,
      nextGrade: "Associate Professor (Lvl 13A)"
    };
  };

  return {
    loading,
    cat1, setCat1,
    cat2, setCat2,
    cat3, setCat3,
    documents,
    calculateTotalAPI,
    getPromotionStatus
  };
};

export default useAppraisalSystem;