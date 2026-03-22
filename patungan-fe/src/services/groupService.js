import apiClient from "../api/index";

const client = apiClient();

const groupService = {
  getAll: () => client.get("/groups"),
  create: (data) => client.post("/group", data),
  update: (id, data) => client.put(`/group/${id}`, data),
  remove: (id) => client.delete(`/group/${id}`),
  addMember: (groupId, data) => client.post(`/group/${groupId}/members`, data),
  updateMember: (groupId, memberId, data) =>
    client.patch(`/group/${groupId}/members/${memberId}`, data),
  deactivateMember: (groupId, memberId) =>
    client.patch(`/group/${groupId}/members/${memberId}/deactivate`),
  updateOwnerMember: (groupId, memberId) =>
    client.patch(`/group/${groupId}/owner-member`, { memberId }),
};

export default groupService;
