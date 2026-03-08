import Dashboard from "../pages/Dashboard";
import GroupDetail from "../pages/GroupDetail";

const routes = [
  { path: "/", redirectTo: "/dashboard" },
  { path: "/dashboard", element: <Dashboard /> },
  { path: "/groups/:id", element: <GroupDetail /> },
];

export default routes;
