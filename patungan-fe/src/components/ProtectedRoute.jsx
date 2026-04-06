import { useAuth } from "../context/authContext";
import { Navigate, useLocation } from "react-router-dom";
import LayoutSkeleton from "./LayoutSkeleton";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import PropTypes from "prop-types";
import expenseService from "../services/expenseService";
import groupService from "../services/groupService";
import dashboardService from "../services/dashboardService";

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const queryClient = useQueryClient();
  const location = useLocation();

  useEffect(() => {
    if (!user) return;

    queryClient.prefetchQuery({
      queryKey: ["groups"],
      queryFn: groupService.getAll,
      staleTime: 30_000,
    });

    const groupMatch = location.pathname.match(/\/groups\/(\w+)/);
    if (groupMatch) {
      queryClient.prefetchQuery({
        queryKey: ["groups", groupMatch[1]],
        queryFn: () => expenseService.getSummary(groupMatch[1]),
        staleTime: 30_000,
      });
    }

    if (location.pathname === "/dashboard") {
      queryClient.prefetchQuery({
        queryKey: ["dashboard", "summary"],
        queryFn: dashboardService.getDashboardSummary,
        staleTime: 30_000,
      });
      queryClient.prefetchQuery({
        queryKey: ["dashboard", "groups", 1, 4],
        queryFn: () => dashboardService.getDashboardGroupsPagination(1, 4),
        staleTime: 30_000,
      });
      queryClient.prefetchQuery({
        queryKey: ["dashboard", "activity", 1, 10],
        queryFn: () => dashboardService.getDashboardActivity(1, 10),
        staleTime: 30_000,
      });
    }
  }, [user, location.pathname, queryClient]);

  if (loading) return <LayoutSkeleton />;
  if (!user) return <Navigate to="/login" replace />;

  return children;
}

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ProtectedRoute;
