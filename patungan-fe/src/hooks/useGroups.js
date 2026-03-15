import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import groupService from "../services/groupService";
import expenseService from "../services/expenseService";
import { useNavigate } from "react-router-dom";

export const useGroups = () => {
  return useQuery({
    queryKey: ["groups"],
    queryFn: groupService.getAll,
  });
};

export const useGroupDetail = (id) => {
  return useQuery({
    queryKey: ["groups", id],
    queryFn: () => expenseService.getSummary(id),
    enabled: !!id,
  });
};

export const useAddGroup = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: groupService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
};

export const useEditGroup = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => groupService.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      queryClient.invalidateQueries({ queryKey: ["groups", id] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
};

export const useDeleteGroup = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: (id) => groupService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      navigate("/dashboard");
    },
  });
};

export const useAddMember = (groupId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => groupService.addMember(groupId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups", groupId] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["groups"] });
    },
  });
};

export const useEditMember = (groupId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ memberId, data }) =>
      groupService.updateMember(groupId, memberId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups", groupId] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
};

export const useDeactivateMember = (groupId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (memberId) => groupService.deactivateMember(groupId, memberId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups", groupId] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["groups"] });
    },
  });
};
