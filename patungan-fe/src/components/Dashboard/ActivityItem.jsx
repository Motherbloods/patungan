import { fmt } from "../../utils/format";

function ActivityItem({ activity }) {
  const isSettlement = activity.type === "settlement";
  const isIncome = isSettlement && activity.desc.startsWith("Terima");
  return (
    <div key={activity.id}>
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
            {activity.desc}
          </p>
          <p className="text-xs text-gray-400 mt-0.5">
            <span className="font-semibold" style={{ color: "#6366F1" }}>
              {activity.groupName}
            </span>{" "}
            · {activity.paidBy} · {activity.time}
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
          {fmt(activity.amount)}
        </span>
      </div>
    </div>
  );
}

export default ActivityItem;
