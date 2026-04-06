function Bone({ className = "", style = {} }) {
  return (
    <div
      className={`relative overflow-hidden rounded-lg bg-tertiary ${className}`}
      style={style}
    >
      <div className="skeleton-shimmer absolute inset-0" />
    </div>
  );
}

function SidebarSkeleton() {
  return (
    <div className="fixed md:static top-0 left-0 h-screen w-64 shrink-0 flex flex-col py-4 px-3 bg-primary border-r border-custom overflow-hidden">
      <div className="absolute left-0 top-0 bottom-0 w-0.75 bg-linear-to-b from-blue-200 via-blue-300 to-indigo-200 rounded-full" />

      <div className="flex items-center gap-2.5 px-2 mb-6">
        <Bone className="w-7 h-7 rounded-xl shrink-0" />
        <div className="flex flex-col gap-1.5">
          <Bone className="w-24 h-4" />
          <Bone className="w-32 h-2.5" />
        </div>
      </div>

      <Bone className="mx-1 h-10 rounded-xl mb-5" />

      <div className="flex items-center gap-3 px-3 py-2.5 mb-1">
        <Bone className="w-8 h-8 rounded-lg shrink-0" />
        <Bone className="w-20 h-3.5" />
      </div>

      <div className="px-3 mt-3 mb-2 flex items-center justify-between">
        <Bone className="w-10 h-2.5" />
        <Bone className="w-5 h-4 rounded-full" />
      </div>

      <div className="flex flex-col gap-1 flex-1 overflow-hidden">
        {[1, 0.85, 0.7].map((opacity, i) => (
          <div
            key={i}
            className="flex items-center gap-2.5 px-3 py-2.5"
            style={{ opacity }}
          >
            <Bone className="w-8 h-8 rounded-lg shrink-0" />
            <Bone
              className="h-3.5 rounded-lg"
              style={{ width: `${[55, 70, 45][i]}%` }}
            />
          </div>
        ))}
      </div>

      <div className="mt-3 pt-3 border-t border-custom">
        <div className="flex items-center gap-2.5 px-2.5 py-2">
          <Bone className="w-9 h-9 rounded-xl shrink-0" />
          <div className="flex flex-col gap-1.5 flex-1">
            <Bone className="w-24 h-3.5" />
            <Bone className="w-16 h-2.5" />
          </div>
          <Bone className="w-5 h-5 rounded-md" />
        </div>
      </div>
    </div>
  );
}

function SummaryCardSkeleton() {
  return (
    <div className="bg-primary rounded-2xl p-4 border border-custom shadow-sm flex flex-col gap-3">
      <div className="flex items-start justify-between">
        <Bone className="w-8 h-8 rounded-xl" />
        <Bone className="w-12 h-3 rounded" />
      </div>
      <div className="flex flex-col gap-1.5">
        <Bone className="w-28 h-5 rounded-lg" />
        <Bone className="w-20 h-3 rounded" />
      </div>
    </div>
  );
}

function BalanceBarSkeleton() {
  return (
    <div className="bg-primary rounded-2xl p-4 border border-custom shadow-sm flex flex-col gap-3">
      <div className="flex justify-between">
        <Bone className="w-20 h-3" />
        <Bone className="w-20 h-3" />
      </div>
      <Bone className="w-full h-3 rounded-full" />
      <div className="flex justify-between">
        <Bone className="w-16 h-3" />
        <Bone className="w-16 h-3" />
      </div>
    </div>
  );
}

function GroupCardSkeleton({ opacity = 1 }) {
  return (
    <div
      className="bg-primary rounded-2xl p-4 border border-custom shadow-sm flex items-center gap-3"
      style={{ opacity }}
    >
      <Bone className="w-11 h-11 rounded-xl shrink-0" />
      <div className="flex flex-col gap-2 flex-1">
        <Bone className="w-32 h-3.5 rounded" />
        <Bone className="w-20 h-3 rounded" />
      </div>
      <div className="flex flex-col items-end gap-1.5">
        <Bone className="w-16 h-4 rounded-lg" />
        <Bone className="w-10 h-2.5 rounded" />
      </div>
    </div>
  );
}

function ActivityItemSkeleton({ opacity = 1 }) {
  return (
    <div
      className="flex items-center gap-3 py-3 border-b border-custom last:border-0"
      style={{ opacity }}
    >
      <Bone className="w-8 h-8 rounded-xl shrink-0" />
      <div className="flex flex-col gap-1.5 flex-1">
        <Bone className="h-3 rounded" style={{ width: "65%" }} />
        <Bone className="w-24 h-2.5 rounded" />
      </div>
      <Bone className="w-16 h-3.5 rounded-lg" />
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="min-h-full bg-secondary">
      <div className="border-b border-custom px-4 pt-16 pb-5 sm:px-6 sm:pt-8 md:pt-6">
        <div className="max-w-2xl mx-auto flex flex-col gap-2">
          <Bone className="w-36 h-7 rounded-xl" />
          <Bone className="w-52 h-3.5 rounded" />
        </div>
      </div>

      <div className="px-4 py-5 sm:px-6 max-w-2xl mx-auto space-y-5">
        <div className="grid grid-cols-2 gap-3">
          <SummaryCardSkeleton />
          <SummaryCardSkeleton />
          <SummaryCardSkeleton />
          <SummaryCardSkeleton />
        </div>

        <BalanceBarSkeleton />

        <section>
          <div className="flex items-center justify-between mb-3">
            <Bone className="w-20 h-3 rounded" />
            <Bone className="w-12 h-3 rounded" />
          </div>
          <div className="flex flex-col gap-3">
            <GroupCardSkeleton />
            <GroupCardSkeleton opacity={0.7} />
            <GroupCardSkeleton opacity={0.45} />
          </div>
        </section>

        <section>
          <div className="flex items-center gap-1.5 mb-3">
            <Bone className="w-3.5 h-3.5 rounded" />
            <Bone className="w-28 h-3 rounded" />
          </div>
          <div className="bg-primary rounded-2xl px-4 shadow-sm border border-custom">
            <ActivityItemSkeleton />
            <ActivityItemSkeleton opacity={0.8} />
            <ActivityItemSkeleton opacity={0.6} />
            <ActivityItemSkeleton opacity={0.4} />
            <ActivityItemSkeleton opacity={0.25} />
          </div>
        </section>
      </div>
    </div>
  );
}

function LayoutSkeleton() {
  return (
    <>
      <style>{`
        @keyframes skeletonShimmer {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .skeleton-shimmer {
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(255,255,255,0.7) 40%,
            rgba(255,255,255,0.9) 50%,
            rgba(255,255,255,0.7) 60%,
            transparent 100%
          );
          animation: skeletonShimmer 1.6s ease infinite;
        }
      `}</style>

      <div className="flex h-screen overflow-hidden">
        <div className="hidden md:block">
          <SidebarSkeleton />
        </div>

        <main className="flex-1 overflow-y-auto">
          <DashboardSkeleton />
        </main>
      </div>
    </>
  );
}

export default LayoutSkeleton;
