import { summaryData } from "../data/dashboardData";
import groupList from "../config/group_list";
import { fmt } from "../utils/format";
import { ArrowDownLeft, ArrowUpRight, Receipt, Users } from "lucide-react";
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
          <div className={`rounded-2xl p-4 flex flex-col gap-3 bg-rose-50`}>
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center text-rose-500 bg-white/60`}
            >
              <ArrowUpRight style={{ width: 18, height: 18 }} />
            </div>
            <div>
              <p className="text-2xl font-extrabold text-gray-900 leading-none">
                {fmt(summary.totalOwe)}
              </p>
              <p className="text-xs font-semibold text-gray-500 mt-1">
                Harus Kamu Bayar
              </p>
              <p className="text-[11px] text-gray-400 mt-0.5">
                dari semua grup
              </p>
            </div>
          </div>

          <div className={`rounded-2xl p-4 flex flex-col gap-3 bg-emerald-50`}>
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center text-emerald-500 bg-white/60`}
            >
              <ArrowDownLeft style={{ width: 18, height: 18 }} />
            </div>
            <div>
              <p className="text-2xl font-extrabold text-gray-900 leading-none">
                {fmt(summary.totalOwed)}
              </p>
              <p className="text-xs font-semibold text-gray-500 mt-1">
                Akan Kamu Terima
              </p>
              <p className="text-[11px] text-gray-400 mt-0.5">
                dari semua grup
              </p>
            </div>
          </div>

          <div className={`rounded-2xl p-4 flex flex-col gap-3 bg-blue-50`}>
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center text-blue-500 bg-white/60`}
            >
              <Users style={{ width: 18, height: 18 }} />
            </div>
            <div>
              <p className="text-2xl font-extrabold text-gray-900 leading-none">
                {String(summary.activeGroups)}
              </p>
              <p className="text-xs font-semibold text-gray-500 mt-1">
                Grup Aktif
              </p>
            </div>
          </div>

          <div className={`rounded-2xl p-4 flex flex-col gap-3 bg-violet-50`}>
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center text-violet-500 bg-white/60`}
            >
              <Receipt style={{ width: 18, height: 18 }} />
            </div>
            <div>
              <p className="text-2xl font-extrabold text-gray-900 leading-none">
                {fmt(summary.totalExpenses)}
              </p>
              <p className="text-xs font-semibold text-gray-500 mt-1">
                Total Pengeluaran
              </p>
              <p className="text-[11px] text-gray-400 mt-0.5">semua grup</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
