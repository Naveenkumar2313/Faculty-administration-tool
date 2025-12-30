import { useState, useEffect } from "react";

// --- MOCK DATA (Moved out of the View) ---
const MOCK_DATA = {
  id: "FAC-001",
  name: "Dr. Sarah Jenkins",
  designation: "Associate Professor",
  department: "Computer Science & Engineering",
  avatar: "https://i.pravatar.cc/300",
  joiningDate: "2018-06-15",
  status: "Confirmed",
  email: "sarah.jenkins@university.edu",
  phone: "+91 98765 43210",
  address: "B-402, Faculty Quarters, University Campus, Bangalore",
  emergencyContact: "Mr. Robert Jenkins (Husband) - 98765 12345",
  serviceHistory: [
    { year: "2018", title: "Joined as Assistant Professor", description: "Grade II - Level 10", color: "primary" },
    { year: "2019", title: "Probation Completed", description: "Confirmed by BOM", color: "success" },
    { year: "2023", title: "Promoted to Assoc. Professor", description: "Level 12 - CAS Promotion", color: "secondary" },
  ],
  documents: [
    { name: "Appointment Letter", type: "PDF", date: "2018-06-10" },
    { name: "Ph.D. Degree Certificate", type: "PDF", date: "2021-04-20" },
  ]
};

const useFacultyProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // SIMULATING AN API CALL
    const fetchProfile = async () => {
      try {
        setLoading(true);
        
        // Simulate network delay (1 second)
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // In the future, this line becomes: const response = await axios.get('/api/faculty/me');
        // setProfile(response.data);
        
        setProfile(MOCK_DATA); 
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Function to update profile (Will connect to PUT /api/faculty/me later)
  const updateProfile = async (newValues) => {
     console.log("Saving to backend...", newValues);
     // Simulate API success
     setProfile(prev => ({ ...prev, ...newValues }));
     return true; 
  };

  return { profile, loading, error, updateProfile };
};

export default useFacultyProfile;