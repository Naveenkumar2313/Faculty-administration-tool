import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext(undefined);

// ─── MOCK USERS (all 7 roles) ─────────────────────────────────────────────────
export const mockUsers = [
  {
    id: 1,
    name: "System Admin",
    email: "admin@parc.edu",
    password: "123456",
    role: "superAdmin",
    avatar: "/assets/images/face-6.jpg",
    redirectPath: "/admin/dashboard"
  },
  {
    id: 2,
    name: "Dr. Naveen Kumar",
    email: "faculty@parc.edu",
    password: "123456",
    role: "faculty",
    avatar: "/assets/images/face-7.jpg",
    redirectPath: "/dashboard/default"
  },
  {
    id: 3,
    name: "Mr. Ramesh Hostel",
    email: "hostel@parc.edu",
    password: "123456",
    role: "hostelAdmin",
    avatar: "/assets/images/face-1.jpg",
    redirectPath: "/hostel/dashboard"
  },
  {
    id: 4,
    name: "Ms. Priya Transport",
    email: "transport@parc.edu",
    password: "123456",
    role: "transportAdmin",
    avatar: "/assets/images/face-2.jpg",
    redirectPath: "/transport/dashboard"
  },
  {
    id: 5,
    name: "Kumar Driver",
    email: "driver@parc.edu",
    password: "123456",
    role: "driver",
    avatar: "/assets/images/face-3.jpg",
    redirectPath: "/driver/dashboard"
  },
  {
    id: 6,
    name: "Arun Student",
    email: "student@parc.edu",
    password: "123456",
    role: "student",
    avatar: "/assets/images/face-4.jpg",
    redirectPath: "/student/dashboard"
  },
  {
    id: 7,
    name: "Suresh Maintenance",
    email: "maintenance@parc.edu",
    password: "123456",
    role: "maintenance",
    avatar: "/assets/images/face-5.jpg",
    redirectPath: "/maintenance/dashboard"
  }
];

// ─── ROLE CONFIG (portal display names and accent colours) ───────────────────
export const ROLE_CONFIG = {
  superAdmin: { label: "Super Admin", color: "#1976d2", badge: "ADMIN" },
  faculty: { label: "Faculty", color: "#2e7d32", badge: "FACULTY" },
  hostelAdmin: { label: "Hostel Admin", color: "#c62828", badge: "HOSTEL" },
  transportAdmin: { label: "Transport Admin", color: "#1565c0", badge: "TRANSPORT" },
  driver: { label: "Driver", color: "#2e7d32", badge: "DRIVER" },
  student: { label: "Student", color: "#e65100", badge: "STUDENT" },
  maintenance: { label: "Maintenance Staff", color: "#6a1b9a", badge: "MAINT." }
};

// ─── AUTH PROVIDER ────────────────────────────────────────────────────────────
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('campusone_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Login: match email + password from mock data
  const login = (email, password) => {
    const found = mockUsers.find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (!found) throw new Error("Invalid email or password.");
    const { password: _pw, ...safeUser } = found; // never store the password
    setUser(safeUser);
    localStorage.setItem('campusone_user', JSON.stringify(safeUser));
    return safeUser;
  };

  // Quick login by role (for the demo role buttons)
  const quickLogin = (role) => {
    const found = mockUsers.find(u => u.role === role);
    if (!found) throw new Error(`No mock user for role: ${role}`);
    const { password: _pw, ...safeUser } = found;
    setUser(safeUser);
    localStorage.setItem('campusone_user', JSON.stringify(safeUser));
    return safeUser;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('campusone_user');
    window.location.href = '/session/signin';
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated: !!user, user, login, quickLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export default AuthContext;
