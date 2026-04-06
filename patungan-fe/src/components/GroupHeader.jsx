import PropTypes from "prop-types";
import { groupConfigShape } from "../propTypes/memberPropTypes";
import { getGroupStats } from "../config/group_stats";
import ICON_OPTIONS from "../config/icons";

export function GroupHeader({ groupConfig }) {
  const iconItem = ICON_OPTIONS.find((ic) => ic.id === groupConfig.icon);
  const Icon = iconItem?.icon;

  const stats = getGroupStats(groupConfig);

  return (
    <div
      className="px-4 pt-16 sm:px-6 sm:pt-8 sm:pb-5 md:pt-6"
      style={{ borderBottom: "1px solid var(--color-border)" }}
    >
      <div className="max-w-2xl mx-auto">
        <div className="rounded-2xl p-4 flex flex-col gap-4 shadow-sm w-full">
          <div className="flex items-center gap-4 w-full">
            {Icon && (
              <div
                className={`w-14 h-14 flex items-center justify-center rounded-2xl shadow-sm ${groupConfig?.color ?? "bg-gray-100"}`}
              >
                <Icon className="w-7 h-7" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-bold text-primary truncate">
                {groupConfig.name}
              </h1>
              <p
                className="text-xs mt-0.5"
                style={{ color: "var(--color-text-secondary)" }}
              >
                {groupConfig.expense_count} pengeluaran ·{" "}
                {groupConfig.member_count} anggota
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {stats.map(({ icon: StatIcon, label, value, color, bg }) => (
              <div
                key={label}
                className="rounded-2xl p-3 flex flex-col gap-1.5"
                style={{ background: "var(--color-bg-secondary)" }}
              >
                <div
                  className={`w-7 h-7 ${bg} ${color} rounded-lg flex items-center justify-center`}
                >
                  <StatIcon className="w-3.5 h-3.5" />
                </div>
                <p className="text-base font-bold text-primary leading-none">
                  {value}
                </p>
                <p
                  className="text-[10px] font-medium uppercase tracking-wide"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

GroupHeader.propTypes = {
  groupConfig: groupConfigShape.isRequired,
};
