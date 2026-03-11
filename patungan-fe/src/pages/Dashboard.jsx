import { summaryData, recentActivity } from "../data/dashboardData";
import groupList from "../config/group_list";
import { fmt } from "../utils/format";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Clock,
  Receipt,
  Users,
} from "lucide-react";
import SummaryCard from "../components/Dashboard/SummaryCard";
import BalanceBar from "../components/Dashboard/BalanceBar";
import GroupPagination from "../components/Dashboard/GroupPagination";
import ActivityItem from "../components/Dashboard/ActivityItem";

function Dashboard() {
  const summary = {
    ...summaryData,
    activeGroups: groupList.length,
  };

  return (
    <div className="min-h-full bg-gray-50">
      <div className="border-b border-gray-100 px-4 pt-16 pb-5 sm:px-6 sm:pt-8 md:pt-6">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
            Dashboard
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Ringkasan semua grup patunganmu
          </p>
        </div>
      </div>

      <div className="px-4 py-5 sm:px-6 max-w-2xl mx-auto space-y-5">
        <div className="grid grid-cols-2 gap-3">
          <SummaryCard
            icon={ArrowUpRight}
            label="Harus Kamu Bayar"
            value={fmt(summary.totalOwe)}
            sub="dari semua grup"
            color="text-rose-500"
            bg="bg-rose-50"
          />
          <SummaryCard
            icon={ArrowDownLeft}
            label="Akan Kamu Terima"
            value={fmt(summary.totalOwed)}
            sub="dari semua grup"
            color="text-emerald-500"
            bg="bg-emerald-50"
          />
          <SummaryCard
            icon={Users}
            label="Grup Aktif"
            value={String(summary.activeGroups)}
            color="text-blue-500"
            bg="bg-blue-50"
          />
          <SummaryCard
            icon={Receipt}
            label="Total Pengeluaran"
            value={String(summary.totalExpenses)}
            sub="semua grup"
            color="text-violet-500"
            bg="bg-violet-50"
          />
        </div>

        <BalanceBar owe={summary.totalOwe} owed={summary.totalOwed} />

        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Grup Kamu
            </h2>
            <span className="text-xs text-gray-400">
              {groupList.length} grup
            </span>
          </div>

          <div className="flex flex-col gap-3">
            <GroupPagination groups={groupList} />
          </div>
        </section>

        <section>
          <div className="flex items-center gap-1.5 mb-3">
            <Clock className="w-3.5 h-3.5 text-gray-400" />
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Aktivitas Terbaru
            </h2>
          </div>
          <div className="bg-white rounded-2xl px-4 shadow-sm border border-gray-100">
            {recentActivity.map((ra) => (
              <ActivityItem key={ra.id} activity={ra} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default Dashboard;
