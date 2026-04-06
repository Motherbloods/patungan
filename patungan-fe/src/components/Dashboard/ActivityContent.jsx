import ActivityItem from "./ActivityItem";

function ActivityContent({ isLoading, allActivities, hasMore, onLoadMore }) {
  if (isLoading && allActivities.length === 0) {
    return (
      <div className="flex justify-center items-center py-6">
        <p className="text-sm text-secondary">Memuat aktivitas...</p>
      </div>
    );
  }
  if (allActivities.length === 0) {
    return (
      <div className="bg-primary rounded-2xl p-6 text-center shadow-sm border border-custom">
        <p className="text-sm text-secondary">Belum ada aktivitas.</p>
      </div>
    );
  }
  return (
    <>
      <div className="bg-primary rounded-2xl px-4 shadow-sm border border-custom w-full overflow-hidden">
        {allActivities.map((ra) => (
          <ActivityItem key={ra._id ?? ra.id} activity={ra} />
        ))}
      </div>
      {hasMore && (
        <button
          onClick={onLoadMore}
          disabled={isLoading}
          className="w-full mt-3 py-2.5 text-xs font-medium text-blue-500 border border-blue-100 rounded-xl hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {isLoading ? "Memuat..." : "Muat lebih banyak"}
        </button>
      )}
      {!hasMore && allActivities.length > 0 && (
        <p className="text-center text-xs text-secondary mt-3">
          Semua aktivitas sudah ditampilkan
        </p>
      )}
    </>
  );
}

export default ActivityContent;
