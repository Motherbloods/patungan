import apiClient from "../api/index";

const client = apiClient();

const dashboardService = {
  getDashboardSummary: () => client.get(`/dashboard/summary`),
  getDashboardGroupsPagination: (page, limit) =>
    client.get(`/dashboard/groups`, {
      params: { page, limit },
    }),
  getDashboardActivity: (page, limit) =>
    client.get("/dashboard/activity", {
      params: { page, limit },
    }),
};

export default dashboardService;
