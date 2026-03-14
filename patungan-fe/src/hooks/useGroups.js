import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import groupService from "../services/groupService";

export const useGroups = () => {
  return useQuery({
    queryKey: ["groups"],
    queryFn: groupService.getAll,
  });
};

export const useAddGroup = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: groupService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
    },
  });
};
