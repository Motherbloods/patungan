import { lazy, Suspense } from "react";
import { Navigate } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { GOOGLE_CLIENT_ID } from "./env.js";
import MainLayout from "../layout/MainLayout";
import ProtectedRoute from "../components/ProtectedRoute.jsx";
import PublicRoute from "../components/PublicRoute.jsx";
import LayoutSkeleton from "../components/LayoutSkeleton.jsx";

const Login = lazy(() => import("../pages/Login"));
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
          <Suspense fallback={<LayoutSkeleton />}>
            <Dashboard />
          </Suspense>
        ),
      },
      {
        path: "groups/:id",
        element: (
          <Suspense fallback={<LayoutSkeleton />}>
            <GroupDetail />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: "/login",
    element: (
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <Suspense fallback={<LayoutSkeleton />}>
          <PublicRoute>
            <Login />
          </PublicRoute>
        </Suspense>
      </GoogleOAuthProvider>
    ),
  },
];

export default routes;
