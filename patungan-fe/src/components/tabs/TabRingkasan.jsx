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
        <div className="bg-primary rounded-2xl p-6 text-center shadow-sm border border-custom">
          <p className="text-sm text-secondary">
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

        const borderColor = isOwner
          ? "rgba(96, 165, 250, 0.5)"
          : isZero
            ? "var(--color-border)"
            : isPos
              ? "rgba(74, 222, 128, 0.5)"
              : "rgba(248, 113, 113, 0.5)";

        return (
          <div
            key={b.user_id}
            className="bg-primary rounded-2xl p-4 flex items-center gap-4 shadow-sm"
            style={{
              border: `1.5px solid ${borderColor}`,
            }}
          >
            <Avatar members={members} uid={b.user_id} size={48} />
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-sm text-primary">{m.name}</span>
                {isOwner && <OwnerBadge />}
              </div>
              <div className="mt-1">
                {isZero ? (
                  <Pill
                    bg="var(--color-bg-tertiary)"
                    color="var(--color-text-secondary)"
                  >
                    ✅ Sudah lunas
                  </Pill>
                ) : isPos ? (
                  <Pill bg="rgba(74, 222, 128, 0.15)" color="#16A34A">
                    💰 Berhak terima
                  </Pill>
                ) : (
                  <Pill bg="rgba(248, 113, 113, 0.15)" color="#DC2626">
                    ⚠️ Perlu transfer
                  </Pill>
                )}
              </div>
            </div>
            <div className="text-right">
              <div
                className="text-xl font-extrabold"
                style={{
                  color: isZero
                    ? "var(--color-text-secondary)"
                    : isPos
                      ? "#16A34A"
                      : "#DC2626",
                }}
              >
                {isZero ? "—" : (isPos ? "+" : "-") + fmt(b.amount)}
              </div>
              <div
                className="text-[11px] mt-0.5"
                style={{ color: "var(--color-text-secondary)" }}
              >
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
