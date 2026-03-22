import { BrowserRouter, Routes, Route, useRoutes } from "react-router-dom";
import routes from "./config/routes";
import { AuthProvider } from "./context/authContext.jsx";
function AppRoutes() {
  return useRoutes(routes);
}
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
