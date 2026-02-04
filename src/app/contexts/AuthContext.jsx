import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(undefined);

// Mock Users Data (Since we don't have the backend yet)
export const mockUsers = [
  {
    id: 1,
    name: "System Admin",
    email: "admin@parc.edu",
    role: "admin",
    avatar: "/assets/images/face-6.jpg"
  },
  {
    id: 2,
    name: "Dr. Naveen Kumar",
    email: "faculty@parc.edu",
    role: "faculty",
    avatar: "/assets/images/face-7.jpg"
  }
];

export const AuthProvider = ({ children }) => {
  // 1. Initialize state from localStorage
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (error) {
      console.error("Error parsing user from local storage", error);
      return null;
    }
  });

  // 2. Login function
  const login = (email, role) => {
    // Find user in mock data
    const userData = mockUsers.find(u => u.email === email && u.role === role);

    if (userData) {
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
    } else {
      console.error("Login failed: User not found");
      throw new Error("Invalid credentials");
    }
  };

  // 3. Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    window.location.href = '/session/signin';
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated: !!user, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;