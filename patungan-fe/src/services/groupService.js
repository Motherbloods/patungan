import apiClient from "../api/index";

const client = apiClient();

const groupService = {
  getAll: () => client.get("/groups"),
  getSummary: (id) => client.get(`/group/${id}`),
  getTransactions: (id) => client.get(`/group/${id}/transactions`),
  getSettlements: (id) => client.get(`/group/${id}/settlements`),
  getHistory: (id) => client.get(`/group/${id}/history`),
  create: (data) => client.post("/group", data),
  update: (id, data) => client.put(`/group/${id}`, data),
  remove: (id) => client.delete(`/group/${id}`),
};

export default groupService;
