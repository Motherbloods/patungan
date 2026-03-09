import { useState } from "react";
import Avatar from "../Avatar";
import { fmt } from "../../utils/format";
import { HISTORY_LABEL } from "../../utils/historyUtils";
import { getNameUtil, getMemberUtil } from "../../utils/member";
import Pill from "../Pill";

function TabRiwayat({ members, balances, history }) {
  const [filterUser, setFilterUser] = useState(null);
  const visibleUsers = filterUser ? [filterUser] : members.map((m) => m._id);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2 flex-wrap">
        {members.map((m) => {
          const active = filterUser === m._id;
          return (
            <button
              key={m._id}
              onClick={() => setFilterUser(active ? null : m._id)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border-2 text-xs font-bold transition-all"
              style={{
                borderColor: active ? m.color : "#E5E7EB",
                background: active ? m.light : "#fff",
                color: active ? m.color : "#6B7280",
              }}
            >
              {m.emoji} {m.name}
            </button>
          );
        })}
      </div>

      {visibleUsers.map((uid) => {
        const balance = balances.find((b) => b.user_id === uid)?.amount ?? 0;
        const m = getMemberUtil(members, uid);

        return (
          <div
            key={uid}
            className="bg-white rounded-2xl shadow-sm overflow-hidden"
            style={{ border: "1.5px solid #E5E7EB" }}
          >
            <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-50">
              <Avatar members={members} uid={uid} size={36} />
              <span className="font-bold text-sm text-gray-900 flex-1">
                {m.name}
              </span>
              <span
                className="font-extrabold text-sm"
                style={{ color: balance >= 0 ? "#16A34A" : "#DC2626" }}
              >
                {(balance >= 0 ? "+" : "-") + fmt(balance)}
              </span>
            </div>

            <div className="px-4">
              {(history[uid] ?? []).map((h, i) => {
                const isIn =
                  h.type === "received" || h.type === "settlement_received";
                const isSettlement = h.type.startsWith("settlement");

                return (
                  <div
                    key={i}
                    className="flex items-center gap-3 py-3"
                    style={{
                      borderBottom:
                        i < (history[uid] ?? []).length - 1
                          ? "1px solid #F3F4F6"
                          : "none",
                    }}
                  >
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-sm shrink-0"
                      style={{ background: isIn ? "#DCFCE7" : "#FEE2E2" }}
                    >
                      {isIn ? "⬇️" : "⬆️"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {isSettlement && (
                          <Pill bg="#DBEAFE" color="#1D4ED8">
                            Transfer akhir
                          </Pill>
                        )}
                        <span className="text-xs text-gray-600 font-medium">
                          {HISTORY_LABEL(members, h, getNameUtil)}
                        </span>
                      </div>
                      {h.expense && (
                        <div className="text-[11px] text-gray-400 mt-0.5">
                          📌 {h.expense}
                        </div>
                      )}
                    </div>
                    <span
                      className="text-sm font-bold shrink-0"
                      style={{ color: isIn ? "#16A34A" : "#DC2626" }}
                    >
                      {isIn ? "+" : "-"}
                      {fmt(h.amount)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default TabRiwayat;
