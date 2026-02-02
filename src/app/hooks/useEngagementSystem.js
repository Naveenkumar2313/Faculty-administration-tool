import { useState, useEffect } from 'react';

const useEngagementSystem = () => {
  const [loading, setLoading] = useState(true);

  // 1. Consultancy (Existing)
  const [consultancy, setConsultancy] = useState([
    { id: 1, title: "Thermal System Opt.", client: "Tata Motors", revenue: 12000, status: "Ongoing", role: "PI" },
    { id: 2, title: "AI Waste Sorting", client: "City Corporation", revenue: 5000, status: "Completed", role: "Co-PI" },
  ]);

  // 2. Guest Lectures (Existing)
  const [guestLectures, setGuestLectures] = useState([
    { id: 1, topic: "AI in Manufacturing", host: "NIT Trichy", date: "Oct 28, 2023", status: "Done" },
  ]);

  // 3. General Examiner Duties (Existing - Exam Cell)
  const [examDuties, setExamDuties] = useState([
    { id: 1, institution: "Anna University", role: "Paper Setter", date: "Nov 12, 2023", status: "Scheduled" }
  ]);

  // --- NEW SECTIONS ---

  // 4. PhD/Master's Thesis Examiner
  const [thesisEvaluation, setThesisEvaluation] = useState([
    { id: 101, student: "Mr. R. Sharma", university: "VIT Vellore", type: "PhD Thesis", title: "Blockchain in Supply Chain", date: "Sep 15, 2023", fee: 5000, status: "Report Submitted" },
    { id: 102, student: "Ms. A. Lee", university: "SRM University", type: "M.Tech Viva", title: "IoT Security", date: "Nov 20, 2023", fee: 2000, status: "Pending Viva" },
  ]);

  // 5. Expert Talks & Keynotes
  const [expertTalks, setExpertTalks] = useState([
    { id: 201, event: "Intl Conf on Robotics", type: "Keynote Speaker", topic: "Future of Humanoids", date: "Aug 10, 2023", location: "Bangalore" },
    { id: 202, event: "Tech Webinar Series", type: "Webinar Host", topic: "Intro to GenAI", date: "July 05, 2023", location: "Online" },
    { id: 203, event: "Industry 4.0 Summit", type: "Panelist", topic: "Bridging Academia-Industry Gap", date: "Sep 22, 2023", location: "Mumbai" },
  ]);

  // 6. Industry Collaborations
  const [collaborations, setCollaborations] = useState([
    { id: 301, partner: "Samsung R&D", type: "MoU", scope: "Joint Research Lab", validTill: "2025", status: "Active" },
    { id: 302, partner: "Zoho Corp", type: "Internship", scope: "Student Training", validTill: "2024", status: "Active" },
  ]);

  // 7. Professional Services
  const [services, setServices] = useState([
    { id: 401, organization: "IEEE Trans. on Industrial Electronics", role: "Reviewer", year: "2023", details: "Reviewed 3 Papers" },
    { id: 402, organization: "Intl Journal of AI", role: "Editorial Board Member", year: "2022-Present", details: "Associate Editor" },
    { id: 403, organization: "ICDS Conference 2023", role: "Technical Committee", year: "2023", details: "Track Chair" },
  ]);

  // 8. Media & Outreach
  const [media, setMedia] = useState([
    { id: 501, outlet: "The Hindu", type: "Newspaper Article", title: "AI in Education", date: "Oct 02, 2023", link: "#" },
    { id: 502, outlet: "NDTV Tech", type: "TV Appearance", title: "Expert view on ChatGPT", date: "Mar 10, 2023", link: "#" },
    { id: 503, outlet: "Medium Blog", type: "Blog Post", title: "My Research Journey", date: "Monthly", link: "#" },
  ]);

  // Dashboard Stats
  const stats = {
    totalRevenue: consultancy.reduce((acc, curr) => acc + curr.revenue, 0) + thesisEvaluation.reduce((acc, curr) => acc + curr.fee, 0),
    talksCount: expertTalks.length + guestLectures.length,
    collabCount: collaborations.length
  };

  useEffect(() => {
    setTimeout(() => setLoading(false), 800);
  }, []);

  return {
    loading,
    stats,
    consultancy,
    guestLectures,
    examDuties,
    thesisEvaluation,
    expertTalks,
    collaborations,
    services,
    media
  };
};

export default useEngagementSystem;