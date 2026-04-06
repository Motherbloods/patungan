import { Clock } from "lucide-react";
import BalanceBar from "../components/Dashboard/BalanceBar";
import {
  useDashboardActivity,
  useDashboardGroupsPagination,
  useDashboardSummary,
} from "../hooks/useDashboards";
import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import SummarySection from "../components/Dashboard/SummarySection";
import GroupsContent from "../components/Dashboard/GroupsContent";
import ActivityContent from "../components/Dashboard/ActivityContent";

const PAGE_SIZE = 4;
const ACTIVITY_PAGE_SIZE = 10;

function Dashboard() {
  const [searchParams] = useSearchParams();
  const page = Number.parseInt(searchParams.get("page"), 10) || 1;

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
            <SummarySection summary={summary} isLoading={isSummaryLoading} />
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
          ) : (
            <GroupsContent
              isLoading={isGroupsLoading}
              groups={groups}
              pagination={pagination}
              myBalance={myBalance}
            />
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
          ) : (
            <ActivityContent
              isLoading={isActivityLoading}
              allActivities={allActivities}
              hasMore={hasMore}
              onLoadMore={() => setActivityPage((p) => p + 1)}
            />
          )}
        </section>
      </div>
    </div>
  );
}

export default Dashboard;
