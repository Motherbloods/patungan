import { useState } from "react";
import Avatar from "../Avatar";
import InfoBox from "../InfoBox";
import { fmt } from "../../utils/format";
import { getNameUtil } from "../../utils/member";
import { CheckCircle2 } from "lucide-react";

function TabTransfer({
  members,
  suggestions = [],
  settlements = [],
  onSettle,
}) {
  const [confirming, setConfirming] = useState(null); // index of suggestion being confirmed
  console.log("settlement data:", settlements);
  console.log("suggestion data:", suggestions);
  const isEmpty = suggestions.length === 0 && settlements.length === 0;

  if (isEmpty) {
    return (
      <div className="flex flex-col gap-3">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
          0 transfer
        </p>
        <div className="bg-white rounded-2xl p-6 text-center shadow-sm border border-gray-200">
          <p className="text-sm text-gray-500">
            Tidak ada transfer yang diperlukan.
          </p>
        </div>
        <InfoBox />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Suggestions - belum ditransfer */}
      {suggestions.length > 0 && (
        <>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
            {suggestions.length} transfer perlu diselesaikan
          </p>

          {suggestions.map((s, i) => {
            const isConfirming = confirming === i;
            console.log("ini s", s);
            return (
              <div
                key={i}
                className="bg-white rounded-2xl px-4 py-3.5 shadow-sm transition-all"
                style={{
                  border: `1.5px solid ${isConfirming ? "#FCA5A5" : "#E5E7EB"}`,
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500 shrink-0">
                    {i + 1}
                  </div>
                  <Avatar members={members} uid={s.from} size={38} />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-gray-800">
                      <span className="font-bold">
                        {getNameUtil(members, s.from)}
                      </span>
                      <span className="text-gray-400 mx-1.5">transfer ke</span>
                      <span className="font-bold">
                        {getNameUtil(members, s.to)}
                      </span>
                    </div>
                    <div className="font-extrabold text-base text-gray-900 mt-0.5">
                      {fmt(s.amount)}
                    </div>
                    <div className="text-[11px] text-gray-400 mt-0.5">
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
                      className="text-xs font-bold text-gray-500 hover:text-gray-700 px-3 py-1.5 rounded-lg border border-gray-200 bg-white transition"
                    >
                      Batal
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirming(i)}
                    className="mt-3 w-full flex items-center justify-center gap-1.5 py-2 rounded-xl border border-green-200 bg-green-50 hover:bg-green-100 text-green-600 text-xs font-bold transition"
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

      {/* Settlements - sudah ditransfer */}
      {settlements.length > 0 && (
        <>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mt-1">
            {settlements.length} transfer selesai
          </p>

          {settlements.map((s, i) => (
            <div
              key={s._id ?? i}
              className="bg-white rounded-2xl px-4 py-3.5 shadow-sm opacity-70"
              style={{ border: "1.5px solid #BBF7D0" }}
            >
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center text-xs shrink-0">
                  ✅
                </div>
                <Avatar members={members} uid={s.from} size={38} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-gray-800">
                    <span className="font-bold">
                      {getNameUtil(members, s.from)}
                    </span>
                    <span className="text-gray-400 mx-1.5">transfer ke</span>
                    <span className="font-bold">
                      {getNameUtil(members, s.to)}
                    </span>
                  </div>
                  <div className="font-extrabold text-base text-gray-900 mt-0.5">
                    {fmt(s.amount)}
                  </div>
                </div>
                <Avatar members={members} uid={s.to} size={38} />
              </div>
              <div className="mt-2 text-center text-xs text-green-600 font-semibold bg-green-50 rounded-lg py-1.5">
                ✓ Sudah ditransfer
              </div>
            </div>
          ))}
        </>
      )}

      <InfoBox />
    </div>
  );
}

export default TabTransfer;
