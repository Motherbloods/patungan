import { useQuery } from "@tanstack/react-query";
import dashboardService from "../services/dashboardService";
import { useAuth } from "../context/authContext";

export const useDashboardSummary = () => {
  const { isActorReady } = useAuth();

  return useQuery({
    queryKey: ["dashboard", "summary"],
    queryFn: dashboardService.getDashboardSummary,
    enabled: isActorReady,
    retry: false,
    staleTime: 30_000,
  });
};

export const useDashboardGroupsPagination = (page, limit) => {
  const { isActorReady } = useAuth();

  return useQuery({
    queryKey: ["dashboard", "groups", page, limit],
    queryFn: () => dashboardService.getDashboardGroupsPagination(page, limit),
    enabled: isActorReady,
    retry: false,
    staleTime: 30_000,
  });
};

export const useDashboardActivity = (page, limit) => {
  const { isActorReady } = useAuth();

  return useQuery({
    queryKey: ["dashboard", "activity", page, limit],
    queryFn: () => dashboardService.getDashboardActivity(page, limit),
    enabled: isActorReady,
    retry: false,
    staleTime: 30_000,
  });
};
