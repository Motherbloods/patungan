import { useState } from "react";
import Avatar from "../Avatar";
import { fmt } from "../../utils/format";
import { EXPENSE_EMOJI } from "../../utils/historyUtils";
import { getMemberUtil } from "../../utils/member";
function TabTransaksi({ members, expenses }) {
  const [selected, setSelected] = useState(null);

  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
        {expenses.length} transaksi
      </p>

      {expenses.map((e) => {
        const payer = getMemberUtil(members, e.paid_by);
        const isOpen = selected === e._id;

        return (
          <div
            key={e._id}
            className="bg-white rounded-2xl overflow-hidden shadow-sm transition-all"
            style={{
              border: `1.5px solid ${isOpen ? payer.color : "#E5E7EB"}`,
            }}
          >
            <button
              onClick={() => setSelected(isOpen ? null : e._id)}
              className="w-full flex items-center gap-3 px-4 py-4 text-left hover:bg-gray-50 transition"
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0"
                style={{ background: payer.light }}
              >
                {EXPENSE_EMOJI(e.name)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-sm text-gray-900 truncate">
                  {e.name}
                </div>
                <div className="text-xs text-gray-400 mt-0.5">
                  Dibayar{" "}
                  <span
                    className="font-semibold"
                    style={{ color: payer.color }}
                  >
                    {payer.name}
                  </span>{" "}
                  · {e.participants.length} orang
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="font-extrabold text-sm text-gray-900">
                  {fmt(e.total_amount)}
                </div>
                <div className="text-[10px] text-gray-400 mt-0.5">
                  {isOpen ? "▲ tutup" : "▼ detail"}
                </div>
              </div>
            </button>

            {isOpen && (
              <div className="border-t border-gray-50 px-4 pt-3 pb-4">
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wide mb-3">
                  Pembagian
                </p>
                {e.participants.map((p) => {
                  const m = getMemberUtil(members, p.user_id);
                  const isPayer = p.user_id === e.paid_by;
                  return (
                    <div
                      key={p.user_id}
                      className="flex items-center gap-3 mb-2"
                    >
                      <Avatar members={members} uid={p.user_id} size={32} />
                      <div className="flex-1 min-w-0">
                        <span className="text-sm font-semibold text-gray-700">
                          {m.name}
                        </span>
                        {isPayer && (
                          <span
                            className="ml-2 text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                            style={{ background: m.light, color: m.color }}
                          >
                            bayar duluan
                          </span>
                        )}
                      </div>
                      <span
                        className="text-sm font-bold"
                        style={{ color: isPayer ? "#16A34A" : "#DC2626" }}
                      >
                        {isPayer ? "+" : "-"}
                        {fmt(p.share_amount)}
                      </span>
                    </div>
                  );
                })}
                <div className="mt-3 pt-3 border-t border-dashed border-gray-200 flex justify-between text-sm">
                  <span className="text-gray-400">Total</span>
                  <span className="font-extrabold text-gray-900">
                    {fmt(e.total_amount)}
                  </span>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default TabTransaksi;
