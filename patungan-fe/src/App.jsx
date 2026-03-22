import { BrowserRouter, Routes, Route, useRoutes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import routes from "./config/routes";
import { AuthProvider } from "./context/authContext.jsx";
function AppRoutes() {
  return useRoutes(routes);
}
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster position="top-right" reverseOrder={false} />
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
