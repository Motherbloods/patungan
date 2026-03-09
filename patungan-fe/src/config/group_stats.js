import { Receipt, Users, TrendingUp } from "lucide-react";
import { fmt } from "../utils/format";

export function getGroupStats(group) {
  return [
    {
      icon: Receipt,
      label: "Pengeluaran",
      value: String(group.expense_count),
      color: "text-blue-500",
      bg: "bg-blue-50",
    },
    {
      icon: Users,
      label: "Anggota",
      value: String(group.member_count),
      color: "text-violet-500",
      bg: "bg-violet-50",
    },
    {
      icon: TrendingUp,
      label: "Total",
      value: fmt(group.total_expenses),
      color: "text-emerald-500",
      bg: "bg-emerald-50",
    },
  ];
}
