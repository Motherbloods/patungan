import { useState } from "react";
import PropTypes from "prop-types";
import { memberShape, expenseShape } from "../../propTypes/memberPropTypes";
import Avatar from "../Avatar";
import OwnerBadge from "../OwnerBadge";
import { fmt } from "../../utils/format";
import { EXPENSE_EMOJI } from "../../utils/historyUtils";
import { getMemberUtil } from "../../utils/member";
import { Pencil, Trash2, Loader2 } from "lucide-react";

function TabTransaksi({
  members,
  expenses,
  ownerMemberId,
  onEdit,
  onDelete,
  deletingId,
}) {
  const [selected, setSelected] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  if (!expenses || expenses.length === 0) {
    return (
      <div className="flex flex-col gap-3">
        <p
          className="text-xs font-semibold uppercase tracking-wide"
          style={{ color: "var(--color-text-secondary)" }}
        >
          0 transaksi
        </p>
        <div className="bg-primary rounded-2xl p-6 text-center shadow-sm border border-custom">
          <p className="text-sm text-secondary">
            Belum ada transaksi di grup ini.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <p
        className="text-xs font-semibold uppercase tracking-wide"
        style={{ color: "var(--color-text-secondary)" }}
      >
        {expenses.length} transaksi
      </p>

      {expenses.map((e) => {
        const payer = getMemberUtil(members, e.paid_by);
        const isOpen = selected === e._id;
        const isConfirming = confirmDelete === e._id;
        const payerIsOwner =
          e.paid_by?.toString() === ownerMemberId?.toString();
        const isDeleting = deletingId === e._id;

        return (
          <div
            key={e._id}
            className="bg-primary rounded-2xl overflow-hidden shadow-sm transition-all w-full"
            style={{
              border: `1.5px solid ${isOpen ? payer.color : "var(--color-border)"}`,
              opacity: isDeleting ? 0.6 : 1,
            }}
          >
            <button
              onClick={() => setSelected(isOpen ? null : e._id)}
              disabled={isDeleting}
              className="w-full flex items-center gap-3 px-4 py-4 text-left transition disabled:cursor-wait overflow-hidden"
              style={{ ["--tw-hover-bg"]: "var(--color-bg-secondary)" }}
              onMouseEnter={(ev) =>
                (ev.currentTarget.style.background =
                  "var(--color-bg-secondary)")
              }
              onMouseLeave={(ev) =>
                (ev.currentTarget.style.background = "transparent")
              }
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0"
                style={{ background: payer.light }}
              >
                {EXPENSE_EMOJI(e.name)}
              </div>
              <div className="flex-1 min-w-0">
                <div
                  className="font-bold text-sm text-primary truncate"
                  style={{ fontSize: "clamp(13px, 2.8vw, 15px)" }}
                >
                  {e.name}
                </div>
                <div
                  className="text-xs mt-0.5"
                  style={{
                    fontSize: "clamp(10px, 2.2vw, 12px)",
                    color: "var(--color-text-secondary)",
                  }}
                >
                  Dibayar{" "}
                  <span
                    className="font-semibold"
                    style={{
                      color: payer.color,
                      fontSize: "clamp(11px, 2.4vw, 13px)",
                    }}
                  >
                    {payer.name}
                  </span>
                  {payerIsOwner && (
                    <span className="ml-1 text-[9px] font-semibold text-blue-500 bg-blue-100 px-1.5 py-0.5 rounded-full">
                      Kamu
                    </span>
                  )}{" "}
                  · {e.participants.length} orang
                </div>
              </div>
              <div className="text-right shrink-0">
                {isDeleting ? (
                  <Loader2
                    className="w-5 h-5 animate-spin mx-auto"
                    style={{ color: "var(--color-text-secondary)" }}
                  />
                ) : (
                  <>
                    <div
                      className="font-extrabold"
                      style={{
                        fontSize: "clamp(14px, 3vw, 16px)",
                      }}
                    >
                      {fmt(e.total_amount)}
                    </div>
                    <div
                      className="text-[10px] mt-0.5"
                      style={{
                        fontSize: "clamp(9px, 2vw, 11px)",
                        color: "var(--color-text-secondary)",
                      }}
                    >
                      {isOpen ? "▲ tutup" : "▼ detail"}
                    </div>
                  </>
                )}
              </div>
            </button>

            {isOpen && !isDeleting && (
              <div
                className="px-4 pt-3 pb-4"
                style={{ borderTop: "1px solid var(--color-bg-tertiary)" }}
              >
                <p
                  className="text-[11px] font-bold uppercase tracking-wide mb-3"
                  style={{
                    fontSize: "clamp(10px, 2.2vw, 12px)",
                    color: "var(--color-text-secondary)",
                  }}
                >
                  Pembagian
                </p>
                {e.participants.map((p) => {
                  const m = getMemberUtil(members, p.user_id);
                  const isPayer = p.user_id === e.paid_by;
                  const isOwner =
                    p.user_id?.toString() === ownerMemberId?.toString();
                  return (
                    <div
                      key={p.user_id}
                      className="flex items-center gap-3 mb-2"
                    >
                      <Avatar members={members} uid={p.user_id} size={32} />
                      <div className="flex-1 min-w-0 flex items-center gap-1.5 flex-wrap">
                        <span
                          className="text-sm font-semibold truncate"
                          style={{
                            fontSize: "clamp(13px, 2.6vw, 14px)",
                          }}
                        >
                          {m.name}
                        </span>
                        {isOwner && <OwnerBadge />}
                        {isPayer && (
                          <span
                            className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                            style={{ background: m.light, color: m.color }}
                          >
                            bayar duluan
                          </span>
                        )}
                      </div>
                      <span
                        className="text-sm font-bold"
                        style={{
                          fontSize: "clamp(12px, 2.6vw, 14px)",
                          color: isPayer ? "#16A34A" : "#DC2626",
                        }}
                      >
                        {isPayer ? "+" : "-"}
                        {fmt(p.share_amount)}
                      </span>
                    </div>
                  );
                })}

                <div
                  className="mt-3 pt-3 flex justify-between text-sm"
                  style={{
                    borderTop: "1px dashed var(--color-border)",
                  }}
                >
                  <span style={{ color: "var(--color-text-secondary)" }}>
                    Total
                  </span>
                  <span className="font-extrabold text-primary">
                    {fmt(e.total_amount)}
                  </span>
                </div>

                {isConfirming ? (
                  <div className="mt-3 flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-3 py-2.5">
                    <p className="text-xs text-red-600 font-medium flex-1">
                      Yakin hapus pengeluaran ini?
                    </p>
                    <button
                      onClick={() => {
                        onDelete(e._id);
                        setConfirmDelete(null);
                        setSelected(null);
                      }}
                      className="text-xs font-bold text-white bg-red-500 hover:bg-red-600 px-3 py-1.5 rounded-lg transition"
                    >
                      Hapus
                    </button>
                    <button
                      onClick={() => setConfirmDelete(null)}
                      className="text-xs font-bold px-3 py-1.5 rounded-lg transition"
                      style={{
                        color: "var(--color-text-secondary)",
                        border: "1px solid var(--color-border)",
                        background: "var(--color-bg-primary)",
                      }}
                    >
                      Batal
                    </button>
                  </div>
                ) : (
                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => onEdit(e)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs font-bold transition"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                      Edit
                    </button>
                    <button
                      onClick={() => setConfirmDelete(e._id)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-red-500 text-xs font-bold transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Hapus
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

TabTransaksi.propTypes = {
  members: PropTypes.arrayOf(memberShape).isRequired,
  expenses: PropTypes.arrayOf(expenseShape),
  ownerMemberId: PropTypes.string,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  deletingId: PropTypes.string,
};

TabTransaksi.defaultProps = {
  expenses: [],
  ownerMemberId: null,
  deletingId: null,
};

export default TabTransaksi;
