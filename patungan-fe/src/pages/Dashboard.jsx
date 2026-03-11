import { NavLink, useSearchParams } from "react-router-dom";
import {
  summaryData,
  recentActivity,
  generateGroupSummaries,
} from "../data/dashboardData";
import groupList from "../config/group_list";
import { fmt } from "../utils/format";
import {
  ArrowDownLeft,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Clock,
  Receipt,
  Users,
} from "lucide-react";
import SummaryCard from "../components/Dashboard/SummaryCard";
import BalanceBar from "../components/Dashboard/BalanceBar";

const PAGE_SIZE = 4;

function Dashboard() {
  const [searchParams, setSearchParams] = useSearchParams();

  const summary = {
    ...summaryData,
    activeGroups: groupList.length,
  };
  const groupSummaries = generateGroupSummaries(groupList);

  const totalPages = Math.ceil(groupSummaries.length / PAGE_SIZE);
  const page = Math.min(
    Math.max(1, parseInt(searchParams.get("page") || "1", 10)),
    totalPages,
  );
  const start = (page - 1) * PAGE_SIZE;
  const visible = groupSummaries.slice(start, start + PAGE_SIZE);

  function goTo(n) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("page", String(n));
      return next;
    });
  }
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
            <div className="grid grid-cols-2 gap-3">
              {visible.map((g) => {
                const Icon = g.icon;
                const isPos = g.myBalance > 0;
                const isZero = g.myBalance === 0;
                return (
                  <NavLink
                    to={`/groups/${g.id}`}
                    key={g._id}
                    className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-300 flex flex-col gap-3"
                  >
                    <div className="flex items-start justify-between">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center ${g.color}`}
                      >
                        <Icon className="w-5 h-5 stroke-2" />
                      </div>
                      <span
                        className="text-xs font-bold px-2 py-1 rounded-lg"
                        style={{
                          background: isZero
                            ? "#F3F4F6"
                            : isPos
                              ? "#DCFCE7"
                              : "#FEE2E2",
                          color: isZero
                            ? "#9CA3AF"
                            : isPos
                              ? "#16A34A"
                              : "#DC2626",
                        }}
                      >
                        {isZero
                          ? "Lunas"
                          : (isPos ? "+" : "-") + fmt(g.myBalance)}
                      </span>
                    </div>

                    <div>
                      <p className="font-bold text-sm text-gray-900 leading-tight">
                        {g.name}
                      </p>
                      <p className="text-xs text-gray-400 mt-1 flex items-center gap-2">
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {g.memberCount}
                        </span>
                        <span className="flex items-center gap-1">
                          <Receipt className="w-3 h-3" />
                          {g.expenseCount}
                        </span>
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-gray-50">
                      <span className="text-[11px] text-gray-400">
                        Total pengeluaran
                      </span>
                      <span className="text-xs font-bold text-gray-600">
                        {fmt(g.totalSpent)}
                      </span>
                    </div>
                  </NavLink>
                );
              })}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between px-1 pt-1">
                <button
                  onClick={() => goTo(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="flex items-center gap-1 text-xs font-semibold px-3 py-2 rounded-xl border border-gray-200 transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 active:scale-95"
                >
                  <ChevronLeft className="w-3.5 h-3.5" /> Prev
                </button>

                <div className="flex items-center gap-1.5 sm:hidden">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (n) => (
                      <button
                        key={n}
                        onClick={() => goTo(n)}
                        className="transition-all duration-200"
                        style={{
                          width: n === page ? 20 : 8,
                          height: 8,
                          borderRadius: 99,
                          background: n === page ? "#3B82F6" : "#D1D5DB",
                        }}
                      />
                    ),
                  )}
                </div>

                <div className="hidden sm:flex items-center gap-1.5">
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i}
                      onClick={() => goTo(i + 1)}
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${
                        page === i + 1
                          ? "bg-blue-500 text-white"
                          : "text-gray-500 hover:bg-gray-200"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => goTo(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  className="flex items-center gap-1 text-xs font-semibold px-3 py-2 rounded-xl border border-gray-200 transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 active:scale-95"
                >
                  Next <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
            <p className="text-center text-[11px] text-gray-400">
              {start + 1}–{Math.min(start + PAGE_SIZE, groupList.length)} dari{" "}
              {groupList.length} grup
            </p>
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
            {recentActivity.map((ra) => {
              const isSettlement = ra.type === "settlement";
              const isIncome = isSettlement && ra.desc.startsWith("Terima");
              return (
                <div key={ra._id}>
                  <div className="flex items-center gap-3 py-3 border-b border-gray-50 last:border-0">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center text-base shrink-0"
                      style={{
                        background: isSettlement
                          ? isIncome
                            ? "#DCFCE7"
                            : "#EDE9FE"
                          : "#EFF6FF",
                      }}
                    >
                      {isSettlement ? (isIncome ? "⬇️" : "⬆️") : "🧾"}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">
                        {ra.desc}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        <span
                          className="font-semibold"
                          style={{ color: "#6366F1" }}
                        >
                          {ra.groupName}
                        </span>{" "}
                        · {ra.paidBy} · {ra.time}
                      </p>
                    </div>

                    <span
                      className="text-sm font-bold shrink-0"
                      style={{
                        color: isSettlement
                          ? isIncome
                            ? "#16A34A"
                            : "#7C3AED"
                          : "#374151",
                      }}
                    >
                      {isSettlement && (isIncome ? "+" : "-")}
                      {fmt(ra.amount)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}

export default Dashboard;
