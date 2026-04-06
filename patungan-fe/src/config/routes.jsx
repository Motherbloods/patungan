import { lazy, Suspense } from "react";
import { Navigate } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import ProtectedRoute from "../components/ProtectedRoute.jsx";
const LoginRoute = lazy(() => import("./LoginRoute.jsx"));
const Dashboard = lazy(() => import("../pages/Dashboard"));
const GroupDetail = lazy(() => import("../pages/GroupDetail"));

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
      {
        path: "dashboard",
        element: (
          <Suspense fallback={null}>
            <Dashboard />
          </Suspense>
        ),
      },
      {
        path: "groups/:id",
        element: (
          <Suspense fallback={null}>
            <GroupDetail />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: "/login",
    element: (
      <Suspense fallback={null}>
        <LoginRoute />
      </Suspense>
    ),
  },
];

export default routes;
