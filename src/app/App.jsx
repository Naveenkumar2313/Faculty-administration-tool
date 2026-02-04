import { useRoutes } from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline";
import { SettingsProvider } from "./contexts/SettingsContext"; // This now works with the named export
import { AuthProvider } from "./contexts/JWTAuthContext"; 
import ParcTheme from "./components/parcTheme/ParcTheme";
import routes from "./routes";

const App = () => {
  const content = useRoutes(routes);

  return (
    <SettingsProvider>
      <AuthProvider>
        <ParcTheme>
          <CssBaseline />
          {content}
        </ParcTheme>
      </AuthProvider>
    </SettingsProvider>
  );
};

export default App;