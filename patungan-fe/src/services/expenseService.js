import apiClient from "../api/index";

const client = apiClient();

const expenseService = {
  getSummary: (group_id) => client.get(`/group/${group_id}`),
  getTransactions: (group_id) => client.get(`/group/${group_id}/transactions`),
  getSettlements: (group_id) => client.get(`/group/${group_id}/settlements`),
  getHistory: (group_id) => client.get(`/group/${group_id}/history`),
};

export default expenseService;
