import { Navigate } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import GroupDetail from "../pages/GroupDetail";

const routes = [
  { path: "/", element: <Navigate to="/dashboard" replace />, protected: true },
  {
    path: "/dashboard",
    element: <Dashboard />,
    title: "Dashboard",
    protected: true,
  },
  {
    path: "/groups/:id",
    element: <GroupDetail />,
    title: "Group Detail",
    protected: true,
  },
];

export default routes;
