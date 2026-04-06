import { BrowserRouter, useRoutes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import routes from "./config/routes";
import { AuthProvider } from "./context/authContext.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";

function AppRoutes() {
  return useRoutes(routes);
}

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AuthProvider>
          <Toaster position="top-right" reverseOrder={false} />
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
