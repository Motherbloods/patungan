import {
  ACTIVITY_BG,
  ACTIVITY_COLOR,
  ACTIVITY_ICON,
  ACTIVITY_LABEL,
  formatTime,
} from "../../utils/activity";
import { fmt } from "../../utils/format";

function ActivityItem({ activity }) {
  const isIncoming =
    activity.type === "received" || activity.type === "settlement_received";

  return (
    <div className="flex items-center gap-3 py-3 border-b border-custom last:border-0">
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center text-base shrink-0"
        style={{ background: ACTIVITY_BG[activity.type] ?? "#EFF6FF" }}
      >
        {ACTIVITY_ICON[activity.type] ?? "🧾"}
      </div>

      <div className="flex-1 min-w-0">
        <p
          className="text-sm font-medium text-primary truncate"
          style={{ fontSize: "clamp(13px, 2.8vw, 15px)" }}
        >
          {activity.expense ?? ACTIVITY_LABEL[activity.type] ?? activity.type}
        </p>
        <p
          className="text-xs text-secondary mt-0.5"
          style={{ fontSize: "clamp(10px, 2.2vw, 12px)" }}
        >
          <span className="font-semibold" style={{ color: "#6366F1" }}>
            {activity.groupName}
          </span>{" "}
          · {formatTime(activity.created_at)}
        </p>
      </div>

      <span
        className="font-bold shrink-0"
        style={{
          color: ACTIVITY_COLOR[activity.type] ?? "var(--color-text-primary)",
          fontSize: "clamp(12px, 2.6vw, 14px)",
        }}
      >
        {isIncoming ? "+" : "-"}
        {fmt(activity.amount)}
      </span>
    </div>
  );
}

export default ActivityItem;
