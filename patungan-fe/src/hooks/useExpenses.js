import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import expenseService from "../services/expenseService";
import { useAuth } from "../context/authContext";

//enabled untuk agar hanya dipanggil ketika tab active
export const useGetTransactions = (group_id, enabled = false) => {
  const { isActorReady } = useAuth();

  return useQuery({
    queryKey: ["expenses", group_id, "transactions"],
    queryFn: () => expenseService.getTransactions(group_id),
    enabled: !!group_id && enabled && isActorReady,
    retry: false,
  });
};

export const useGetSettlements = (group_id, enabled = false) => {
  const { isActorReady } = useAuth();

  return useQuery({
    queryKey: ["expenses", group_id, "settlements"],
    queryFn: () => expenseService.getSettlements(group_id),
    enabled: !!group_id && enabled && isActorReady,
    retry: false,
  });
};

export const useGetHistory = (group_id, enabled = false) => {
  const { isActorReady } = useAuth();

  return useQuery({
    queryKey: ["expenses", group_id, "history"],
    queryFn: () => expenseService.getHistory(group_id),
    enabled: !!group_id && enabled && isActorReady,
    retry: false,
  });
};

// onSuccess: ({ group_id }) => { mengambil group_id dari response api

export const useCreateExpense = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: expenseService.create,
    onSuccess: (data) => {
      const group_id = data.group_id.toString();
      client.invalidateQueries({ queryKey: ["expenses", group_id] });
      client.invalidateQueries({ queryKey: ["groups", group_id] });
      client.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
};

export const useEditExpense = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({ group_id, expense_id, data }) => {
      return expenseService.update(group_id, expense_id, data);
    },
    onSuccess: (_, { group_id }) => {
      client.invalidateQueries({ queryKey: ["expenses", group_id] });
      client.invalidateQueries({ queryKey: ["groups", group_id] });
      client.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
};

// onSuccess: (_, { group_id }) mengambil group_id dari input pengguna

export const useDeleteExpense = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({ group_id, expense_id }) =>
      expenseService.remove(group_id, expense_id),
    onSuccess: (_, { group_id }) => {
      client.invalidateQueries({ queryKey: ["expenses", group_id] });
      client.invalidateQueries({ queryKey: ["groups", group_id] });
      client.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
};

export const useCreateSettlement = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({ group_id, from, to, amount }) =>
      expenseService.createSettlement(group_id, { from, to, amount }),
    onSuccess: (_, { group_id }) => {
      client.invalidateQueries({
        queryKey: ["expenses", group_id, "settlements"],
      });
      client.invalidateQueries({ queryKey: ["groups", group_id] });
      client.invalidateQueries({ queryKey: ["expenses", group_id, "history"] });
      client.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
};
