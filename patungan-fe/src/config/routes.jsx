import { Navigate } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import GroupDetail from "../pages/GroupDetail";
import Login from "../pages/Login";
import MainLayout from "../layout/MainLayout";
import ProtectedRoute from "../components/ProtectedRoute.jsx";
import PublicRoute from "../components/PublicRoute.jsx";

const withLayout = (Element, layout = true) =>
  layout ? <MainLayout>{Element}</MainLayout> : Element;

const withProtection = (Element, isProtected = false) =>
  isProtected ? (
    <ProtectedRoute>{Element}</ProtectedRoute>
  ) : (
    <PublicRoute>{Element}</PublicRoute>
  );

const routes = [
  {
    path: "/",
    element: withProtection(
      withLayout(<Navigate to="/dashboard" replace />),
      true,
    ),
  },
  {
    path: "/dashboard",
    element: withProtection(withLayout(<Dashboard />), true),
  },
  {
    path: "/groups/:id",
    element: withProtection(withLayout(<GroupDetail />), true),
  },
  {
    path: "/login",
    element: withProtection(withLayout(<Login />, false), false),
  },
];

export default routes;
