import Dashboard from "../pages/Dashboard";

const routes = [
    { path: "/", redirectTo: "/dashboard" },
    { path: "/dashboard", element: <Dashboard /> }
]

export default routes