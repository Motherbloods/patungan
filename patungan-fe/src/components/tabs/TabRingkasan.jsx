import Avatar from "../Avatar";
import Pill from "../Pill";
import InfoBox from "../InfoBox";
import OwnerBadge from "../OwnerBadge";
import { getMemberUtil } from "../../utils/member";
import { fmt } from "../../utils/format";

function TabRingkasan({ members, balances, ownerMemberId }) {
  if (!balances || balances.length === 0) {
    return (
      <div className="flex flex-col gap-3">
        <div className="bg-white rounded-2xl p-6 text-center shadow-sm border border-gray-200">
          <p className="text-sm text-gray-500">
            Belum ada data ringkasan pembagian.
          </p>
        </div>
        <InfoBox />
      </div>
    );
  }

  // tampilkan member user login paling atas
  const sorted = ownerMemberId
    ? [...balances].sort((a, b) => {
        if (a.user_id?.toString() === ownerMemberId?.toString()) return -1;
        if (b.user_id?.toString() === ownerMemberId?.toString()) return 1;
        return 0;
      })
    : balances;

  return (
    <div className="flex flex-col gap-3">
      {sorted.map((b) => {
        const isPos = b.amount > 0;
        const isZero = b.amount === 0;
        const isOwner = b.user_id?.toString() === ownerMemberId?.toString();
        const m = getMemberUtil(members, b.user_id);

        return (
          <div
            key={b.user_id}
            className="bg-white rounded-2xl p-4 flex items-center gap-4 shadow-sm"
            style={{
              border: `1.5px solid ${isOwner ? "#BFDBFE" : isZero ? "#E5E7EB" : isPos ? "#BBF7D0" : "#FECACA"}`,
            }}
          >
            <Avatar members={members} uid={b.user_id} size={48} />
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-sm text-gray-900">
                  {m.name}
                </span>
                {isOwner && <OwnerBadge />}
              </div>
              <div className="mt-1">
                {isZero ? (
                  <Pill bg="#F3F4F6" color="#6B7280">
                    ✅ Sudah lunas
                  </Pill>
                ) : isPos ? (
                  <Pill bg="#DCFCE7" color="#15803D">
                    💰 Berhak terima
                  </Pill>
                ) : (
                  <Pill bg="#FEE2E2" color="#DC2626">
                    ⚠️ Perlu transfer
                  </Pill>
                )}
              </div>
            </div>
            <div className="text-right">
              <div
                className="text-xl font-extrabold"
                style={{
                  color: isZero ? "#9CA3AF" : isPos ? "#16A34A" : "#DC2626",
                }}
              >
                {isZero ? "—" : (isPos ? "+" : "-") + fmt(b.amount)}
              </div>
              <div className="text-[11px] text-gray-400 mt-0.5">
                {isZero
                  ? "selesai"
                  : isPos
                    ? "akan diterima"
                    : "harus ditransfer"}
              </div>
            </div>
          </div>
        );
      })}
      <InfoBox />
    </div>
  );
}

export default TabRingkasan;
