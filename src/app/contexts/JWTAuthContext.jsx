import React, { createContext, useEffect, useReducer } from "react";
import Loading from "../components/ParcLoading";

const initialState = {
  isAuthenticated: false,
  isInitialised: false,
  user: null,
};

const isValidToken = (accessToken) => {
  if (!accessToken) return false;
  return true; // Simplified for demo
};

const setSession = (accessToken) => {
  if (accessToken) {
    localStorage.setItem("accessToken", accessToken);
  } else {
    localStorage.removeItem("accessToken");
  }
};

const reducer = (state, action) => {
  switch (action.type) {
    case "INIT": {
      const { isAuthenticated, user } = action.payload;
      return { ...state, isAuthenticated, isInitialised: true, user };
    }
    case "LOGIN": {
      const { user } = action.payload;
      return { ...state, isAuthenticated: true, user };
    }
    case "LOGOUT": {
      return { ...state, isAuthenticated: false, user: null };
    }
    default:
      return state;
  }
};

const AuthContext = createContext({
  ...initialState,
  method: "JWT",
  login: () => Promise.resolve(),
  logout: () => {},
});

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const login = async (email, password) => {
    // MOCK LOGIN LOGIC
    // In real app, make API call here
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if ((email === "admin@parc.edu" && password === "admin123") || 
            (email === "faculty@parc.edu" && password === "faculty123")) {
          
          const role = email.includes("admin") ? "admin" : "faculty";
          const user = {
            id: role === 'admin' ? 1 : 2,
            name: role === 'admin' ? "System Admin" : "Dr. Naveen Kumar",
            role: role,
            email: email,
            avatar: "/assets/images/face-6.jpg"
          };

          setSession("mock-jwt-token-12345");
          dispatch({ type: "LOGIN", payload: { user } });
          resolve(user);
        } else {
          reject("Invalid Email or Password");
        }
      }, 1000);
    });
  };

  const logout = () => {
    setSession(null);
    dispatch({ type: "LOGOUT" });
  };

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken && isValidToken(accessToken)) {
      // Restore session
      const user = { 
        id: 1, 
        name: "Dr. Naveen Kumar", 
        role: "faculty", // Default fallback
        email: "faculty@parc.edu",
        avatar: "/assets/images/face-6.jpg"
      }; 
      dispatch({ type: "INIT", payload: { isAuthenticated: true, user } });
    } else {
      dispatch({ type: "INIT", payload: { isAuthenticated: false, user: null } });
    }
  }, []);

  if (!state.isInitialised) return <Loading />;

  return (
    <AuthContext.Provider value={{ ...state, method: "JWT", login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;