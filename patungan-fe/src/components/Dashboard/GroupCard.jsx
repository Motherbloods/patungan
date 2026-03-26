import { NavLink } from "react-router-dom";
import { fmt } from "../../utils/format";
import { Receipt, Users } from "lucide-react";
import ICON_OPTIONS from "../../config/icons";

function GroupCard({ group }) {
  const iconItem = ICON_OPTIONS.find((item) => item.id === group.icon);
  const Icon = iconItem?.icon;

  const myBalance = group.myBalance;
  const hasTag = myBalance !== null;
  const isPos = hasTag && myBalance > 0;
  const isZero = hasTag && myBalance === 0;

  return (
    <NavLink
      to={`/groups/${group._id}`}
      state={{ autoScrollSidebar: true }}
      className="bg-primary rounded-2xl p-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-300 flex flex-col gap-3 border border-custom w-full overflow-hidden"
    >
      <div className="flex items-start justify-between">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center ${group.color}`}
        >
          {Icon && <Icon className="w-5 h-5 stroke-2" />}
        </div>

        {hasTag ? (
          <span
            className="text-xs font-bold px-2 py-1 rounded-lg"
            style={{
              background: isZero ? "#F3F4F6" : isPos ? "#DCFCE7" : "#FEE2E2",
              color: isZero ? "#9CA3AF" : isPos ? "#16A34A" : "#DC2626",
              fontSize: "clamp(10px, 2.2vw, 12px)",
            }}
          >
            {isZero ? "Lunas" : (isPos ? "+" : "-") + fmt(Math.abs(myBalance))}
          </span>
        ) : (
          <span className="text-xs font-medium px-2 py-1 rounded-lg bg-tertiary text-secondary">
            —
          </span>
        )}
      </div>

      <div>
        <p className="font-bold text-sm text-primary leading-tight">
          {group.name}
        </p>
        <p
          className="text-xs text-secondary mt-1 flex items-center gap-2"
          style={{ fontSize: "clamp(10px, 2.2vw, 12px)" }}
        >
          <span className="flex items-center gap-1">
            <Users className="w-3 h-3" />
            {group.member_count}
          </span>
          <span className="flex items-center gap-1">
            <Receipt className="w-3 h-3" />
            {group.expense_count}
          </span>
        </p>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-custom">
        <span className="text-[11px] text-secondary">Total pengeluaran</span>
        <span
          className="text-xs font-bold text-primary"
          style={{ fontSize: "clamp(12px, 2.5vw, 14px)" }}
        >
          {fmt(group.total_expenses)}
        </span>
      </div>
    </NavLink>
  );
}

export default GroupCard;
