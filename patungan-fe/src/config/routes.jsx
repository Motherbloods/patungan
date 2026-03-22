import { Navigate } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import GroupDetail from "../pages/GroupDetail";
import Login from "../pages/Login";
import MainLayout from "../layout/MainLayout";
import ProtectedRoute from "../components/ProtectedRoute.jsx";
import PublicRoute from "../components/PublicRoute.jsx";

const routes = [
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: "dashboard", element: <Dashboard /> }, // ← hapus "/"
      { path: "groups/:id", element: <GroupDetail /> }, // ← hapus "/"
    ],
  },
  {
    path: "/login",
    element: (
      <PublicRoute>
        <Login />
      </PublicRoute>
    ),
  },
];

export default routes;
