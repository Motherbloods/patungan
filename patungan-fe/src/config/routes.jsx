import { Navigate } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import GroupDetail from "../pages/GroupDetail";

const routes = [
  { path: "/", element: <Navigate to="/dashboard" replace /> },
  { path: "/dashboard", element: <Dashboard />, title: "Dashboard" },
  { path: "/groups/:id", element: <GroupDetail />, title: "Group Detail" },
];

export default routes;
