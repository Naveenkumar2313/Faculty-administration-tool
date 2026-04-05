import React, { createContext, useState } from "react";
import merge from "lodash/merge";
import { ParcLayoutSettings } from "app/components/ParcLayout/settings";

// Read role from localStorage (survives page refresh)
const getStoredRole = () => {
  try {
    const raw = localStorage.getItem('campusone_user');
    if (raw) return JSON.parse(raw)?.role || 'faculty';
  } catch { /* ignore */ }
  return 'faculty';
};

export const SettingsContext = createContext({
  settings: { ...ParcLayoutSettings, role: "faculty" },
  updateSettings: () => { }
});

export const SettingsProvider = ({ settings, children }) => {
  const [currentSettings, setCurrentSettings] = useState(
    settings || { ...ParcLayoutSettings, role: getStoredRole() }
  );

  const handleUpdateSettings = (update = {}) => {
    setCurrentSettings(prev => merge({}, prev, update));
  };

  return (
    <SettingsContext.Provider value={{ settings: currentSettings, updateSettings: handleUpdateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export default SettingsContext;
