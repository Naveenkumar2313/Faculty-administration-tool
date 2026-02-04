// src/app/contexts/SettingsContext.jsx
import { createContext, useState } from "react";
import merge from "lodash/merge";
import { ParcLayoutSettings } from "app/components/ParcLayout/settings";

export const SettingsContext = createContext({
  settings: ParcLayoutSettings,
  updateSettings: () => {}
});

// FIX: Changed 'export default function' to 'export const' (Named Export)
export const SettingsProvider = ({ settings, children }) => {
  const [currentSettings, setCurrentSettings] = useState(settings || ParcLayoutSettings);

  const handleUpdateSettings = (update = {}) => {
    const merged = merge({}, currentSettings, update);
    setCurrentSettings(merged);
  };

  return (
    <SettingsContext.Provider
      value={{ settings: currentSettings, updateSettings: handleUpdateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export default SettingsContext;