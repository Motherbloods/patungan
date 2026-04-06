import { fmt } from "../../utils/format";
import { ArrowUpRight, ArrowDownLeft, Users, Receipt } from "lucide-react";
import SummaryCard from "./SummaryCard";

function SummarySection({ summary, isLoading }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <SummaryCard
        icon={ArrowUpRight}
        label="Harus Kamu Bayar"
        value={isLoading ? "..." : fmt(summary?.totalOwe ?? 0)}
        sub="dari semua grup"
        color="text-rose-500"
        bg="bg-rose-50"
      />
      <SummaryCard
        icon={ArrowDownLeft}
        label="Akan Kamu Terima"
        value={isLoading ? "..." : fmt(summary?.totalOwed ?? 0)}
        sub="dari semua grup"
        color="text-emerald-500"
        bg="bg-emerald-50"
      />
      <SummaryCard
        icon={Users}
        label="Grup Aktif"
        value={isLoading ? "..." : String(summary?.activeGroups ?? 0)}
        color="text-blue-500"
        bg="bg-blue-50"
      />
      <SummaryCard
        icon={Receipt}
        label="Total Pengeluaran"
        value={isLoading ? "..." : fmt(summary?.totalExpenses ?? 0)}
        sub="semua grup"
        color="text-violet-500"
        bg="bg-violet-50"
      />
    </div>
  );
}

export default SummarySection;
