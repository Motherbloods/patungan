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
import {
  useDashboardActivity,
  useDashboardGroupsPagination,
  useDashboardSummary,
} from "../hooks/useDashboards";
import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";

const PAGE_SIZE = 4;
const ACTIVITY_PAGE_SIZE = 10;

function Dashboard() {
  const [searchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page")) || 1;

  const [activityPage, setActivityPage] = useState(1);
  const [allActivities, setAllActivities] = useState([]);

  const {
    data: summary,
    isLoading: isSummaryLoading,
    error: summaryError,
  } = useDashboardSummary();

  const {
    data: groupsData,
    isLoading: isGroupsLoading,
    error: groupsError,
  } = useDashboardGroupsPagination(page, PAGE_SIZE);

  const {
    data: activityData,
    isLoading: isActivityLoading,
    error: activityError,
  } = useDashboardActivity(activityPage, ACTIVITY_PAGE_SIZE);

  // Accumulate activities on each new page load
  useEffect(() => {
    if (!activityData?.activities) return;
    if (activityPage === 1) {
      setAllActivities(activityData.activities);
    } else {
      setAllActivities((prev) => [...prev, ...activityData.activities]);
    }
  }, [activityData, activityPage]);

  const hasMore = activityData?.pagination?.hasMore ?? false;

  const { groups = [], pagination = {}, myBalance = 0 } = groupsData || {};

  return (
    <div className="min-h-full bg-secondary">
      <div className="border-b border-custom px-4 pt-16 pb-5 sm:px-6 sm:pt-8 md:pt-6">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-extrabold text-primary tracking-tight">
            Dashboard
          </h1>
          <p className="text-sm text-secondary mt-1">
            Ringkasan semua grup patunganmu
          </p>
        </div>
      </div>

      <div className="px-4 py-5 sm:px-6 max-w-2xl mx-auto space-y-5">
        {summaryError ? (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-center">
            <p className="text-sm text-red-500">Gagal memuat ringkasan.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3">
              <SummaryCard
                icon={ArrowUpRight}
                label="Harus Kamu Bayar"
                value={isSummaryLoading ? "..." : fmt(summary?.totalOwe ?? 0)}
                sub="dari semua grup"
                color="text-rose-500"
                bg="bg-rose-50"
              />
              <SummaryCard
                icon={ArrowDownLeft}
                label="Akan Kamu Terima"
                value={isSummaryLoading ? "..." : fmt(summary?.totalOwed ?? 0)}
                sub="dari semua grup"
                color="text-emerald-500"
                bg="bg-emerald-50"
              />
              <SummaryCard
                icon={Users}
                label="Grup Aktif"
                value={
                  isSummaryLoading ? "..." : String(summary?.activeGroups ?? 0)
                }
                color="text-blue-500"
                bg="bg-blue-50"
              />
              <SummaryCard
                icon={Receipt}
                label="Total Pengeluaran"
                value={
                  isSummaryLoading ? "..." : fmt(summary?.totalExpenses ?? 0)
                }
                sub="semua grup"
                color="text-violet-500"
                bg="bg-violet-50"
              />
            </div>

            <BalanceBar
              owe={summary?.totalOwe ?? 0}
              owed={summary?.totalOwed ?? 0}
            />
          </>
        )}

        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-bold text-secondary uppercase tracking-wider">
              Grup Kamu
            </h2>
            <span className="text-xs text-secondary">
              {isGroupsLoading ? "..." : `${pagination.totalItems ?? 0} grup`}
            </span>
          </div>

          {groupsError ? (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-center">
              <p className="text-sm text-red-500">Gagal memuat grup.</p>
            </div>
          ) : isGroupsLoading ? (
            <div className="flex justify-center items-center py-10">
              <p className="text-sm text-secondary">Memuat grup...</p>
            </div>
          ) : groups.length === 0 ? (
            <div className="bg-primary rounded-2xl p-6 text-center shadow-sm border border-custom">
              <p className="text-sm text-secondary">Belum ada grup.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <GroupPagination
                groups={groups}
                pagination={pagination}
                myBalance={myBalance}
              />
            </div>
          )}
        </section>

        <section>
          <div className="flex items-center gap-1.5 mb-3">
            <Clock className="w-3.5 h-3.5 text-secondary" />
            <h2 className="text-xs font-bold text-secondary uppercase tracking-wider">
              Aktivitas Terbaru
            </h2>
          </div>

          {activityError ? (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-center">
              <p className="text-sm text-red-500">Gagal memuat aktivitas.</p>
            </div>
          ) : isActivityLoading && allActivities.length === 0 ? (
            <div className="flex justify-center items-center py-6">
              <p className="text-sm text-secondary">Memuat aktivitas...</p>
            </div>
          ) : allActivities.length === 0 ? (
            <div className="bg-primary rounded-2xl p-6 text-center shadow-sm border border-custom">
              <p className="text-sm text-secondary">Belum ada aktivitas.</p>
            </div>
          ) : (
            <>
              <div className="bg-primary rounded-2xl px-4 shadow-sm border border-custom w-full overflow-hidden">
                {allActivities.map((ra) => (
                  <ActivityItem key={ra._id ?? ra.id} activity={ra} />
                ))}
              </div>

              {hasMore && (
                <button
                  onClick={() => setActivityPage((p) => p + 1)}
                  disabled={isActivityLoading}
                  className="w-full mt-3 py-2.5 text-xs font-medium text-blue-500 border border-blue-100 rounded-xl hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  {isActivityLoading ? "Memuat..." : "Muat lebih banyak"}
                </button>
              )}

              {!hasMore && allActivities.length > 0 && (
                <p className="text-center text-xs text-secondary mt-3">
                  Semua aktivitas sudah ditampilkan
                </p>
              )}
            </>
          )}
        </section>
      </div>
    </div>
  );
}

export default Dashboard;
