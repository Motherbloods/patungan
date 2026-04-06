import PropTypes from "prop-types";
import { memberShape, balanceShape } from "../../propTypes/memberPropTypes";
import Avatar from "../Avatar";
import InfoBox from "../InfoBox";
import OwnerBadge from "../OwnerBadge";
import { getMemberUtil } from "../../utils/member";
import {
  getAmountColor,
  getAmountDisplay,
  getAmountLabel,
  getBorderColor,
} from "../../utils/balance";
import StatusPill from "../StatusPill";

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

        const borderColor = getBorderColor(isOwner, isZero, isPos);
        const amountColor = getAmountColor(isZero, isPos);
        const amountLabel = getAmountLabel(isZero, isPos);
        const amountDisplay = getAmountDisplay(isZero, isPos, b.amount);

        return (
          <div
            key={b.user_id}
            className="bg-primary rounded-2xl p-4 flex items-center gap-4 shadow-sm w-full overflow-hidden"
            style={{
              border: `1.5px solid ${borderColor}`,
            }}
          >
            <Avatar members={members} uid={b.user_id} size={48} />
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className="font-bold text-sm text-primary truncate"
                  style={{ fontSize: "clamp(13px, 2.8vw, 15px)" }}
                >
                  {m.name}
                </span>
                {isOwner && <OwnerBadge />}
              </div>
              <div className="mt-1">
                <div style={{ fontSize: "clamp(10px, 2.2vw, 12px)" }}>
                  <StatusPill isZero={isZero} isPos={isPos} />
                </div>
              </div>
            </div>
            <div className="text-right">
              <div
                className="text-right font-extrabold"
                style={{
                  fontSize: "clamp(16px, 3.5vw, 20px)",
                  color: amountColor,
                }}
              >
                {amountDisplay}
              </div>
              <div
                className="mt-0.5"
                style={{
                  fontSize: "clamp(10px, 2.2vw, 11px)",
                  color: "var(--color-text-secondary)",
                }}
              >
                {amountLabel}
              </div>
            </div>
          </div>
        );
      })}
      <InfoBox />
    </div>
  );
}

TabRingkasan.propTypes = {
  members: PropTypes.arrayOf(memberShape).isRequired,
  balances: PropTypes.arrayOf(balanceShape),
  ownerMemberId: PropTypes.string,
};

TabRingkasan.defaultProps = {
  balances: [],
  ownerMemberId: null,
};

export default TabRingkasan;
