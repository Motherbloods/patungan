import { useState, useMemo } from "react";
import Avatar from "../Avatar";
import OwnerBadge from "../OwnerBadge";
import { fmt } from "../../utils/format";
import { HISTORY_LABEL } from "../../utils/historyUtils";
import { getNameUtil, getMemberUtil } from "../../utils/member";
import Pill from "../Pill";

function TabRiwayat({
  members = [],
  balances = [],
  history = [],
  ownerMemberId,
}) {
  const [filterUser, setFilterUser] = useState(null);

  const visibleUsers = useMemo(
    () => (filterUser ? [filterUser] : members.map((m) => m._id)),
    [filterUser, members],
  );

  const historyMap = Array.isArray(history)
    ? history.reduce((acc, hGroup) => {
        hGroup.histories?.forEach((h) => {
          acc[h.user_id] = h.history ?? [];
        });
        return acc;
      }, {})
    : (history ?? {});

  const isEmpty =
    !history ||
    Object.values(historyMap).every((arr) => !arr || arr.length === 0);

  if (isEmpty) {
    return (
      <div className="flex flex-col gap-4">
        <div className="bg-primary rounded-2xl p-6 text-center shadow-sm border border-custom">
          <p className="text-sm text-secondary">
            Belum ada riwayat transaksi di grup ini.
          </p>
        </div>
      </div>
    );
  }

  // tampilkan member user login paling depan di filter
  const sortedMembers = ownerMemberId
    ? [...members].sort((a, b) => {
        if (a._id?.toString() === ownerMemberId?.toString()) return -1;
        if (b._id?.toString() === ownerMemberId?.toString()) return 1;
        return 0;
      })
    : members;

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex gap-2 flex-wrap">
        {sortedMembers.map((m) => {
          const active = filterUser === m._id;
          const isOwner = m._id?.toString() === ownerMemberId?.toString();
          return (
            <button
              key={m._id}
              onClick={() => setFilterUser(active ? null : m._id)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border-2 text-xs font-bold transition-all"
              style={{
                borderColor: active ? m.color : "var(--color-border)",
                background: active ? m.light : "var(--color-bg-primary)",
                color: active ? m.color : "var(--color-text-secondary)",
                fontSize: "clamp(10px, 2.2vw, 12px)",
              }}
            >
              {m.emoji} {m.name}
              {isOwner && (
                <span className="text-[9px] font-semibold text-blue-500 bg-blue-100 px-1.5 py-0.5 rounded-full">
                  Kamu
                </span>
              )}
            </button>
          );
        })}
      </div>

      {visibleUsers.map((uid) => {
        const balance = balances.find((b) => b.user_id === uid)?.amount ?? 0;
        const m = getMemberUtil(members, uid) || { name: "Unknown" };
        const userHistory = historyMap[uid] ?? [];
        const isOwner = uid?.toString() === ownerMemberId?.toString();

        return (
          <div
            key={uid}
            className="bg-primary rounded-2xl shadow-sm overflow-hidden"
            style={{
              border: `1.5px solid ${isOwner ? "rgba(96, 165, 250, 0.5)" : "var(--color-border)"}`,
            }}
          >
            <div
              className="flex items-center gap-3 px-4 py-3"
              style={{ borderBottom: "1px solid var(--color-bg-tertiary)" }}
            >
              <Avatar members={members} uid={uid} size={36} />
              <span
                className="font-bold text-primary flex-1 truncate"
                style={{ fontSize: "clamp(13px, 2.8vw, 15px)" }}
              >
                {m.name}
              </span>
              {isOwner && <OwnerBadge />}
              <span
                className="font-extrabold"
                style={{
                  fontSize: "clamp(13px, 3vw, 15px)",
                  color: balance >= 0 ? "#16A34A" : "#DC2626",
                }}
              >
                {(balance >= 0 ? "+" : "-") + fmt(balance)}
              </span>
            </div>

            <div className="px-4">
              {userHistory.map((h, i) => {
                const isIn =
                  h.type === "received" || h.type === "settlement_received";
                const isSettlement = h.type?.startsWith("settlement");

                return (
                  <div
                    key={i}
                    className="flex items-center gap-3 py-3 w-full overflow-hidden"
                    style={{
                      borderBottom:
                        i < userHistory.length - 1
                          ? "1px solid var(--color-bg-tertiary)"
                          : "none",
                    }}
                  >
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-sm shrink-0"
                      style={{
                        background: isIn
                          ? "rgba(74, 222, 128, 0.15)"
                          : "rgba(248, 113, 113, 0.15)",
                      }}
                    >
                      {isIn ? "⬇️" : "⬆️"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {isSettlement && (
                          <Pill bg="rgba(59, 130, 246, 0.15)" color="#3B82F6">
                            Transfer akhir
                          </Pill>
                        )}
                        <span
                          className="text-xs font-medium truncate"
                          style={{
                            fontSize: "clamp(11px, 2.5vw, 13px)",
                            color: "var(--color-text-secondary)",
                          }}
                        >
                          {HISTORY_LABEL(members, h, getNameUtil)}
                        </span>
                      </div>
                      {h.expense && (
                        <div
                          className="text-[11px] mt-0.5"
                          style={{
                            fontSize: "clamp(10px, 2.2vw, 12px)",
                            color: "var(--color-text-secondary)",
                          }}
                        >
                          📌 {h.expense}
                        </div>
                      )}
                    </div>
                    <span
                      className="font-bold shrink-0"
                      style={{
                        fontSize: "clamp(12px, 2.6vw, 14px)",
                        color: isIn ? "#16A34A" : "#DC2626",
                      }}
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
