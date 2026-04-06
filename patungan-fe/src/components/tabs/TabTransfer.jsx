import { useState } from "react";
import PropTypes from "prop-types";
import { memberShape, transferShape } from "../../propTypes/memberPropTypes";
import Avatar from "../Avatar";
import InfoBox from "../InfoBox";
import OwnerBadge from "../OwnerBadge";
import { fmt } from "../../utils/format";
import { getNameUtil } from "../../utils/member";
import { CheckCircle2 } from "lucide-react";

function getSuggestionBorderColor(fromIsOwner, toIsOwner, isConfirming) {
  if (fromIsOwner || toIsOwner) return "rgba(96, 165, 250, 0.5)";
  if (isConfirming) return "rgba(248, 113, 113, 0.5)";
  return "var(--color-border)";
}

function TabTransfer({
  members,
  suggestions = [],
  settlements = [],
  ownerMemberId,
  onSettle,
}) {
  const [confirming, setConfirming] = useState(null);

  const isEmpty = suggestions.length === 0 && settlements.length === 0;

  const isOwner = (uid) => uid?.toString() === ownerMemberId?.toString();

  if (isEmpty) {
    return (
      <div className="flex flex-col gap-3 w-full">
        <p
          className="text-xs font-semibold uppercase tracking-wide"
          style={{
            color: "var(--color-text-secondary)",
            fontSize: "clamp(10px, 2.2vw, 12px)",
          }}
        >
          0 transfer
        </p>
        <div className="bg-primary rounded-2xl p-6 text-center shadow-sm border border-custom">
          <p className="text-sm text-secondary">
            Tidak ada transfer yang diperlukan.
          </p>
        </div>
        <InfoBox />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {suggestions.length > 0 && (
        <>
          <p
            className="text-xs font-semibold uppercase tracking-wide"
            style={{ color: "var(--color-text-secondary)" }}
          >
            {suggestions.length} transfer perlu diselesaikan
          </p>

          {suggestions.map((s) => {
            const isConfirming = confirming === s.from + s.to;
            const fromIsOwner = isOwner(s.from);
            const toIsOwner = isOwner(s.to);
            const borderColor = getSuggestionBorderColor(
              fromIsOwner,
              toIsOwner,
              isConfirming,
            );

            return (
              <div
                key={`${s.from}-${s.to}`}
                className="bg-primary rounded-2xl px-4 py-3.5 shadow-sm transition-all w-full overflow-hidden"
                style={{ border: `1.5px solid ${borderColor}` }}
              >
                <div className="flex items-center gap-3 w-full">
                  <Avatar members={members} uid={s.from} size={38} />
                  <div className="flex-1 min-w-0">
                    <div
                      className="text-sm flex items-center gap-1.5 flex-wrap"
                      style={{ color: "var(--color-text-primary)" }}
                    >
                      <span
                        className="font-bold"
                        style={{ fontSize: "clamp(13px, 2.8vw, 15px)" }}
                      >
                        {getNameUtil(members, s.from)}
                      </span>
                      {fromIsOwner && <OwnerBadge />}
                      <span style={{ color: "var(--color-text-secondary)" }}>
                        transfer ke
                      </span>
                      <span
                        className="font-bold"
                        style={{ fontSize: "clamp(13px, 2.8vw, 15px)" }}
                      >
                        {getNameUtil(members, s.to)}
                      </span>
                      {toIsOwner && <OwnerBadge />}
                    </div>
                    <div
                      className="font-extrabold mt-0.5"
                      style={{ fontSize: "clamp(15px, 3.2vw, 18px)" }}
                    >
                      {fmt(s.amount)}
                    </div>
                    <div
                      className="text-[11px] mt-0.5"
                      style={{
                        fontSize: "clamp(10px, 2.2vw, 12px)",
                        color: "var(--color-text-secondary)",
                      }}
                    >
                      1 kali transfer · langsung lunas
                    </div>
                  </div>
                  <Avatar members={members} uid={s.to} size={38} />
                </div>

                {isConfirming ? (
                  <div className="mt-3 flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-3 py-2.5">
                    <p className="text-xs text-green-700 font-medium flex-1">
                      Konfirmasi transfer sudah dilakukan?
                    </p>
                    <button
                      onClick={() => {
                        onSettle(s);
                        setConfirming(null);
                      }}
                      className="text-xs font-bold text-white bg-green-500 hover:bg-green-600 px-3 py-1.5 rounded-lg transition"
                    >
                      Ya, sudah
                    </button>
                    <button
                      onClick={() => setConfirming(null)}
                      className="text-xs font-bold px-3 py-1.5 rounded-lg transition"
                      style={{
                        color: "var(--color-text-secondary)",
                        fontSize: "clamp(11px, 2.3vw, 13px)",
                        border: "1px solid var(--color-border)",
                        background: "var(--color-bg-primary)",
                      }}
                    >
                      Batal
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirming(s.from + s.to)}
                    className="mt-3 w-full flex items-center justify-center gap-1.5 py-2 rounded-xl border border-green-200 bg-green-50 hover:bg-green-100 text-green-600 text-xs font-bold transition"
                    style={{ fontSize: "clamp(11px, 2.4vw, 13px)" }}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Tandai Sudah Transfer
                  </button>
                )}
              </div>
            );
          })}
        </>
      )}

      {settlements.length > 0 && (
        <>
          <p
            className="text-xs font-semibold uppercase tracking-wide mt-1"
            style={{ color: "var(--color-text-secondary)" }}
          >
            {settlements.length} transfer selesai
          </p>

          {settlements.map((s, i) => {
            const fromIsOwner = isOwner(s.from);
            const toIsOwner = isOwner(s.to);

            return (
              <div
                key={s._id ?? `settled-${s.from}-${s.to}-${i}`}
                className="bg-primary rounded-2xl px-4 py-3.5 shadow-sm opacity-70"
                style={{ border: "1.5px solid rgba(74, 222, 128, 0.4)" }}
              >
                <div className="flex items-center gap-3 w-full">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-xs shrink-0"
                    style={{ background: "rgba(74, 222, 128, 0.15)" }}
                  >
                    ✅
                  </div>
                  <Avatar members={members} uid={s.from} size={38} />
                  <div className="flex-1 min-w-0">
                    <div
                      className="text-sm flex items-center gap-1.5 flex-wrap"
                      style={{ color: "var(--color-text-primary)" }}
                    >
                      <span className="font-bold">
                        {getNameUtil(members, s.from)}
                      </span>
                      {fromIsOwner && <OwnerBadge />}
                      <span
                        style={{
                          color: "var(--color-text-secondary)",
                          fontSize: "clamp(11px, 2.4vw, 13px)",
                        }}
                      >
                        transfer ke
                      </span>
                      <span className="font-bold">
                        {getNameUtil(members, s.to)}
                      </span>
                      {toIsOwner && <OwnerBadge />}
                    </div>
                    <div
                      className="font-extrabold mt-0.5"
                      style={{ fontSize: "clamp(15px, 3.2vw, 18px)" }}
                    >
                      {fmt(s.amount)}
                    </div>
                  </div>
                  <Avatar members={members} uid={s.to} size={38} />
                </div>
                <div
                  className="mt-2 text-center text-xs font-semibold rounded-lg py-1.5"
                  style={{
                    fontSize: "clamp(10px, 2.2vw, 12px)",
                    background: "rgba(74, 222, 128, 0.1)",
                  }}
                >
                  ✓ Sudah ditransfer
                </div>
              </div>
            );
          })}
        </>
      )}

      <InfoBox />
    </div>
  );
}

TabTransfer.propTypes = {
  members: PropTypes.arrayOf(memberShape).isRequired,
  suggestions: PropTypes.arrayOf(transferShape),
  settlements: PropTypes.arrayOf(transferShape),
  ownerMemberId: PropTypes.string,
  onSettle: PropTypes.func.isRequired,
};

TabTransfer.defaultProps = {
  suggestions: [],
  settlements: [],
  ownerMemberId: null,
};

export default TabTransfer;
