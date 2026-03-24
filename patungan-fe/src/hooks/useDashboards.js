import { useQuery } from "@tanstack/react-query";
import dashboardService from "../services/dashboardService";

export const useDashboardSummary = () => {
  return useQuery({
    queryKey: ["dashboard", "summary"],
    queryFn: dashboardService.getDashboardSummary,
    staleTime: 30_000,
  });
};

export const useDashboardGroupsPagination = (page, limit) => {
  return useQuery({
    queryKey: ["dashboard", "groups", page, limit],
    queryFn: () => dashboardService.getDashboardGroupsPagination(page, limit),
    staleTime: 30_000,
  });
};

export const useDashboardActivity = (page, limit) => {
  return useQuery({
    queryKey: ["dashboard", "activity", page, limit],
    queryFn: () => dashboardService.getDashboardActivity(page, limit),
    staleTime: 30_000,
  });
};
