import { useState, useEffect } from 'react';

const useGovernanceSystem = () => {
  const [loading, setLoading] = useState(true);
  
  // Mock Policy Database with "Effective" features
  const [policies, setPolicies] = useState([
    { 
      id: "POL-001", 
      title: "Prevention of Sexual Harassment (POSH)", 
      category: "Workplace Ethics",
      version: "2024.1",
      lastUpdated: "Oct 01, 2023",
      status: "Pending", // Pending, Signed, Compliant
      deadline: "Nov 15, 2023", // Upcoming deadline
      requiresVideo: true,
      requiresQuiz: true,
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Placeholder
      changes: "Updated Committee Contact Details and digital complaint workflow.",
      quiz: [
        { q: "Who heads the Internal Complaints Committee (ICC)?", options: ["HR Manager", "Senior Woman Faculty", "Dean"], correct: 1 },
        { q: "What is the timeline for resolving a complaint?", options: ["90 Days", "30 Days", "60 Days"], correct: 0 },
        { q: "Can a complaint be filed anonymously?", options: ["Yes", "No"], correct: 0 }
      ]
    },
    { 
      id: "POL-002", 
      title: "Research Ethics & Plagiarism", 
      category: "Research",
      version: "3.0", 
      lastUpdated: "Aug 15, 2023", 
      status: "Compliant",
      deadline: "Dec 31, 2023",
      requiresVideo: false,
      requiresQuiz: true,
      quiz: [
        { q: "Maximum allowed similarity index for Ph.D. thesis?", options: ["10%", "15%", "25%"], correct: 0 },
        { q: "Is self-plagiarism considered an offense?", options: ["Yes", "No", "Depends"], correct: 0 },
        { q: "Who owns the IP of a sponsored project?", options: ["Faculty", "Sponsor/University", "Student"], correct: 1 }
      ]
    },
    { 
      id: "POL-003", 
      title: "IT Usage & Data Protection (GDPR)", 
      category: "IT & Security",
      version: "1.5", 
      lastUpdated: "Jan 10, 2023", 
      status: "Pending",
      deadline: "Oct 30, 2023", // Due very soon
      requiresVideo: false,
      requiresQuiz: false,
      changes: "Added clause for personal device usage (BYOD)."
    },
    { 
      id: "POL-004", 
      title: "Conflict of Interest Declaration", 
      category: "Legal",
      version: "Annual-2023", 
      lastUpdated: "Apr 01, 2023", 
      status: "Signed",
      deadline: null,
      requiresVideo: false,
      requiresQuiz: false
    }
  ]);

  const [otpSent, setOtpSent] = useState(false);

  useEffect(() => {
    setTimeout(() => setLoading(false), 800);
  }, []);

  // Actions
  const sendOTP = () => {
    setOtpSent(true);
    alert("OTP sent to your registered mobile: 1234"); // Demo simulation
  };

  const verifyOTP = (inputOtp) => {
    return inputOtp === "1234";
  };

  const submitPolicyCompletion = (policyId, score = null) => {
    setPolicies(prev => prev.map(p => {
      if (p.id === policyId) {
        return { ...p, status: score !== null ? 'Compliant' : 'Signed', completedDate: new Date().toLocaleDateString() };
      }
      return p;
    }));
    setOtpSent(false);
  };

  return { 
    loading, 
    policies, 
    otpSent, 
    sendOTP, 
    verifyOTP, 
    submitPolicyCompletion 
  };
};

export default useGovernanceSystem;