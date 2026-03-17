import { BrowserRouter, Routes, Route } from "react-router-dom";
import routes from "./config/routes";
import { AuthProvider } from "./context/authContext.jsx";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {routes.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
