import { Receipt, Users, TrendingUp } from "lucide-react";
import { getGroupStats } from "../config/group_stats";

export function GroupHeader({ groupConfig }) {
  const Icon = groupConfig?.icon;

  const stats = getGroupStats(groupConfig);

  return (
    <div className=" border-b border-gray-100 px-4 pt-16 pb-5 sm:px-6 sm:pt-8 md:pt-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-5">
          {Icon && (
            <div
              className={`w-14 h-14 flex items-center justify-center rounded-2xl shadow-sm ${groupConfig?.color ?? "bg-gray-100"}`}
            >
              <Icon className="w-7 h-7" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold text-gray-900 truncate">
              {groupConfig.name}
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">
              {groupConfig.expense_count} pengeluaran ·{" "}
              {groupConfig.member_count} anggota
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {stats.map(({ icon: StatIcon, label, value, color, bg }) => (
            <div
              key={label}
              className="bg-gray-50 rounded-2xl p-3 flex flex-col gap-1.5"
            >
              <div
                className={`w-7 h-7 ${bg} ${color} rounded-lg flex items-center justify-center`}
              >
                <StatIcon className="w-3.5 h-3.5" />
              </div>
              <p className="text-base font-bold text-gray-800 leading-none">
                {value}
              </p>
              <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">
                {label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
