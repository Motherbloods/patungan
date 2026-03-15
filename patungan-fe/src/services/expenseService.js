import apiClient from "../api/index";

const client = apiClient();

const expenseService = {
  getSummary: (group_id) => client.get(`/group/${group_id}`),
  getTransactions: (group_id) => client.get(`/group/${group_id}/transactions`),
  getSettlements: (group_id) => client.get(`/group/${group_id}/settlements`),
  getHistory: (group_id) => client.get(`/group/${group_id}/history`),
  create: (data) => client.post("/group/expense", data),
  update: (group_id, expense_id, data) =>
    client.put(`/group/${group_id}/expense/${expense_id}`, data),
  remove: (group_id, expense_id) =>
    client.delete(`/group/${group_id}/expense/${expense_id}`),
  createSettlement: (group_id, data) =>
    client.post(`/group/${group_id}/settlement`, data),
};

export default expenseService;
