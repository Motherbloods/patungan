import { useQuery } from "@tanstack/react-query";
import groupService from "../services/groupService";

export const useGroupDetail = (id) => {
  return useQuery({
    queryKey: ["groups", id],
    queryFn: () => groupService.getSummary(id),
    enabled: !!id,
  });
};
