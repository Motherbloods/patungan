import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import expenseService from "../services/expenseService";

//enabled untuk agar hanya dipanggil ketika tab active
export const useGetTransactions = (group_id, enabled = false) => {
  return useQuery({
    queryKey: ["expenses", group_id, "transactions"],
    queryFn: () => expenseService.getTransactions(group_id),
    enabled: !!group_id && enabled,
  });
};

export const useGetSettlements = (group_id, enabled = false) => {
  return useQuery({
    queryKey: ["expenses", group_id, "settlements"],
    queryFn: () => expenseService.getSettlements(group_id),
    enabled: !!group_id && enabled,
  });
};

export const useGetHistory = (group_id, enabled = false) => {
  return useQuery({
    queryKey: ["expenses", group_id, "history"],
    queryFn: () => expenseService.getHistory(group_id),
    enabled: !!group_id && enabled,
  });
};

// onSuccess: ({ group_id }) => { mengambil group_id dari response api

export const useCreateExpense = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: expenseService.create,
    onSuccess: ({ group_id }) => {
      client.invalidateQueries({ queryKey: ["expenses", group_id] });
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
      client.invalidateQueries({ queryKey: ["group", group_id] });
      client.invalidateQueries({ queryKey: ["expenses", group_id, "history"] });
    },
  });
};
