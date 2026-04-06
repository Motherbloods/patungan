import GroupPagination from "./GroupPagination";

function GroupsContent({ isLoading, groups, pagination, myBalance }) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-10">
        <p className="text-sm text-secondary">Memuat grup...</p>
      </div>
    );
  }
  if (groups.length === 0) {
    return (
      <div className="bg-primary rounded-2xl p-6 text-center shadow-sm border border-custom">
        <p className="text-sm text-secondary">Belum ada grup.</p>
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-3">
      <GroupPagination
        groups={groups}
        pagination={pagination}
        myBalance={myBalance}
      />
    </div>
  );
}

export default GroupsContent;
