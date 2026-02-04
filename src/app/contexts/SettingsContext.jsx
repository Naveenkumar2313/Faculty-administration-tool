import React, { createContext, useState } from "react";
import merge from "lodash/merge";
import { ParcLayoutSettings } from "app/components/ParcLayout/settings";

// Helper to persist role on refresh
const getStoredRole = () => {
  try {
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      return user.role || 'faculty';
    }
  } catch (error) {
    console.error("SettingsContext: Error reading role from storage", error);
  }
  return 'faculty';
};

export const SettingsContext = createContext({
  settings: {
    ...ParcLayoutSettings,
    role: "faculty" 
  },
  updateSettings: () => {}
});

export const SettingsProvider = ({ settings, children }) => {
  const [currentSettings, setCurrentSettings] = useState(
    settings || {
      ...ParcLayoutSettings,
      // CRITICAL FIX: Load role from storage so it persists after refresh
      role: getStoredRole() 
    }
  );

  const handleUpdateSettings = (update = {}) => {
    const merged = merge({}, currentSettings, update);
    setCurrentSettings(merged);
  };

  return (
    <SettingsContext.Provider
      value={{
        settings: currentSettings,
        updateSettings: handleUpdateSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export default SettingsContext;