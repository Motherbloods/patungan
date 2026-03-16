import { useQuery } from "@tanstack/react-query";
import dashboardService from "../services/dashboardService";

export const useDashboardSummary = () => {
  return useQuery({
    queryKey: ["dashboard", "summary"],
    queryFn: dashboardService.getDashboardSummary,
  });
};

export const useDashboardGroupsPagination = (page, limit) => {
  return useQuery({
    queryKey: ["dashboard", "groups", page, limit],
    queryFn: () => dashboardService.getDashboardGroupsPagination(page, limit),
  });
};

export const useDashboardActivity = (page, limit) => {
  return useQuery({
    queryKey: ["dashboard", "activity", page, limit],
    queryFn: () => dashboardService.getDashboardActivity(page, limit),
  });
};
