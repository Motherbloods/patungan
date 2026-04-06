import {
  Pencil,
  PlusCircle,
  SplitSquareVertical,
  X,
  Loader2,
} from "lucide-react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { fmt } from "../utils/format";

function AddExpenseForm({
  members = [],
  onCancel,
  onSubmit,
  isEditing = false,
  initialData = null,
  isSubmitting = false,
}) {
  const { id } = useParams();
  const [name, setName] = useState(initialData?.name ?? "");
  const [amount, setAmount] = useState(
    initialData?.total_amount?.toString() ?? "",
  );
  const [paidBy, setPaidBy] = useState(initialData?.paid_by ?? "");

  const activeMembers = members.filter((m) => m.isActive !== false);

  const visibleMembers = isEditing ? members : activeMembers;

  const [participants, setParticipants] = useState(() => {
    if (initialData) {
      return initialData?.participants?.map((p) => p.user_id);
    }
    return activeMembers.map((m) => m._id);
  });

  const [splitMethod, setSplitMethod] = useState(
    initialData?.split_method ?? "bagi-rata",
  );
  const [customShares, setCustomShares] = useState(() => {
    if (initialData?.split_method === "custom") {
      return initialData.participants.reduce((acc, p) => {
        acc[p.user_id] = p.share_amount.toString();
        return acc;
      }, {});
    }
    return {};
  });
  const [error, setError] = useState("");

  const totalAmount = Number(amount) || 0;
  const perPerson =
    participants.length > 0 ? Math.floor(totalAmount / participants.length) : 0;

  const toggleParticipant = (memberId, isActive) => {
    if (!isActive) return;

    setParticipants((prev) =>
      prev.includes(memberId)
        ? prev.filter((pid) => pid !== memberId)
        : [...prev, memberId],
    );
  };

  const handleAmountInput = (value) => {
    const numericValue = value.replace(/\D/g, "");
    setAmount(numericValue);
  };

  const handleSubmit = () => {
    if (isSubmitting) return;

    if (!name.trim()) {
      setError("Nama pengeluaran wajib diisi.");
      return;
    }
    if (totalAmount <= 0) {
      setError("Jumlah pengeluaran harus lebih besar dari 0.");
      return;
    }
    if (!paidBy) {
      setError("Pilih siapa yang membayar pengeluaran ini.");
      return;
    }
    if (participants.length === 0) {
      setError("Pilih setidaknya satu peserta yang berbagi pengeluaran ini.");
      return;
    }
    if (splitMethod === "custom") {
      const totalCustom = participants.reduce(
        (sum, uid) => sum + Number(customShares[uid] || 0),
        0,
      );
      if (totalCustom !== totalAmount) {
        setError("Total pembagian tidak sama dengan jumlah pengeluaran.");
        return;
      }
    }

    const participantList = participants.map((uid) => ({
      user_id: uid,
      share_amount:
        splitMethod === "bagi-rata"
          ? perPerson
          : parseFloat(customShares[uid] || 0),
    }));

    const expenseData = {
      group_id: id,
      name: name.trim(),
      total_amount: totalAmount,
      paid_by: paidBy,
      participants: participantList,
      split_method: splitMethod,
    };

    setError("");
    onSubmit(expenseData);

    if (!isEditing) {
      setName("");
      setAmount("");
      setPaidBy(activeMembers[0]?._id ?? "");
      setParticipants(activeMembers.map((m) => m._id));
      setCustomShares({});
    }
  };

  return (
    <div
      className="bg-primary rounded-2xl shadow-sm overflow-hidden transition-all"
      style={{
        border: "1px solid var(--color-border)",
        opacity: isSubmitting ? 0.8 : 1,
      }}
    >
      <div
        className="flex items-center justify-between px-5 py-4"
        style={{ borderBottom: "1px solid var(--color-bg-tertiary)" }}
      >
        <div className="flex items-center gap-2">
          {isEditing ? (
            <Pencil className="w-4 h-4 text-blue-500" />
          ) : (
            <PlusCircle className="w-4 h-4 text-blue-500" />
          )}
          <span className="font-semibold text-sm text-primary">
            {isEditing ? "Edit Pengeluaran" : "Tambah Pengeluaran"}
          </span>
        </div>
        {onCancel && (
          <button
            onClick={onCancel}
            disabled={isSubmitting}
            aria-label="Close"
            className="w-7 h-7 flex items-center justify-center rounded-full transition disabled:opacity-40"
            style={{ ["--hover-bg"]: "var(--color-bg-tertiary)" }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "var(--color-bg-tertiary)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "transparent")
            }
          >
            <X
              className="w-4 h-4"
              style={{ color: "var(--color-text-secondary)" }}
            />
          </button>
        )}
      </div>

      <div className="px-5 py-4 flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label
            className="text-xs font-semibold uppercase tracking-wide"
            style={{ color: "var(--color-text-secondary)" }}
          >
            Nama Pengeluaran
          </label>
          <input
            type="text"
            placeholder="cth. Makan Malam, Bensin..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isSubmitting}
            className="w-full rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition disabled:opacity-60"
            style={{
              border: "1px solid var(--color-border)",
              background: "var(--color-bg-primary)",
              color: "var(--color-text-primary)",
            }}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            className="text-xs font-semibold uppercase tracking-wide"
            style={{ color: "var(--color-text-secondary)" }}
          >
            Jumlah
          </label>
          <div className="relative">
            <span
              className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold"
              style={{ color: "var(--color-text-secondary)" }}
            >
              Rp
            </span>
            <input
              type="text"
              inputMode="numeric"
              placeholder="0"
              value={totalAmount ? totalAmount.toLocaleString("id-ID") : ""}
              onChange={(e) => handleAmountInput(e.target.value)}
              disabled={isSubmitting}
              className="w-full rounded-xl pl-10 pr-4 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition disabled:opacity-60"
              style={{
                border: "1px solid var(--color-border)",
                background: "var(--color-bg-primary)",
                color: "var(--color-text-primary)",
              }}
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            className="text-xs font-semibold uppercase tracking-wide"
            style={{ color: "var(--color-text-secondary)" }}
          >
            Dibayar oleh
          </label>
          <div className="flex gap-2 flex-wrap">
            {activeMembers.map((m) => (
              <button
                key={m._id}
                onClick={() => setPaidBy(m._id)}
                disabled={isSubmitting}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border-2 text-xs font-semibold transition-all disabled:opacity-50"
                style={{
                  borderColor:
                    paidBy === m._id ? m.color : "var(--color-border)",
                  background: paidBy === m._id ? m.light : "transparent",
                  color:
                    paidBy === m._id ? m.color : "var(--color-text-secondary)",
                }}
              >
                <span>{m.emoji}</span>
                {m.name}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label
              className="text-xs font-semibold uppercase tracking-wide"
              style={{ color: "var(--color-text-secondary)" }}
            >
              Dibagi ke
            </label>
            <button
              onClick={() =>
                setSplitMethod((sm) =>
                  sm === "bagi-rata" ? "custom" : "bagi-rata",
                )
              }
              disabled={isSubmitting}
              className="flex items-center gap-1 text-xs font-semibold text-blue-500 hover:text-blue-600 transition disabled:opacity-50"
            >
              <SplitSquareVertical className="w-3.5 h-3.5" />
              {splitMethod === "bagi-rata" ? "Custom" : "Sama Rata"}
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          {visibleMembers.map((m) => {
            const active = participants.includes(m._id);
            const memberIsActive = m.isActive !== false;

            return (
              <div
                key={m._id}
                className="flex items-center gap-3 p-2.5 rounded-xl border transition-all"
                style={{
                  borderColor: active ? m.color : "var(--color-border)",
                  background: active
                    ? m.light + "44"
                    : "var(--color-bg-secondary)",
                  opacity: memberIsActive ? 1 : 0.55,
                }}
              >
                <button
                  onClick={() => toggleParticipant(m._id, memberIsActive)}
                  disabled={!memberIsActive || isSubmitting}
                  className="flex items-center gap-2 flex-1 text-left disabled:cursor-not-allowed"
                >
                  <div
                    className="w-5 h-5 rounded-md border-2 flex items-center justify-center text-white text-xs transition-all"
                    style={{
                      borderColor: active ? m.color : "var(--color-border)",
                      background: active ? m.color : "transparent",
                    }}
                  >
                    {active && "✓"}
                  </div>
                  <span
                    className="text-sm font-medium"
                    style={{
                      color: active ? m.color : "var(--color-text-secondary)",
                    }}
                  >
                    {m.emoji} {m.name}
                    {isEditing && !memberIsActive && (
                      <span
                        className="ml-1.5 text-xs font-normal"
                        style={{ color: "var(--color-text-secondary)" }}
                      >
                        (nonaktif)
                      </span>
                    )}
                  </span>
                </button>
                <span
                  className="text-sm font-bold"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  {active ? (
                    splitMethod === "bagi-rata" ? (
                      fmt(perPerson)
                    ) : (
                      <input
                        type="text"
                        inputMode="numeric"
                        disabled={!memberIsActive || isSubmitting}
                        value={
                          customShares[m._id]
                            ? Number(customShares[m._id]).toLocaleString(
                                "id-ID",
                              )
                            : ""
                        }
                        onChange={(e) => {
                          const numeric = e.target.value.replace(/\D/g, "");
                          setCustomShares((prev) => ({
                            ...prev,
                            [m._id]: numeric,
                          }));
                        }}
                        className="w-24 rounded-lg px-2 py-1 text-sm text-right disabled:opacity-60 disabled:cursor-not-allowed"
                        style={{
                          border: "1px solid var(--color-border)",
                          background: "var(--color-bg-primary)",
                          color: "var(--color-text-primary)",
                        }}
                        placeholder="0"
                      />
                    )
                  ) : (
                    "—"
                  )}
                </span>
              </div>
            );
          })}

          {splitMethod === "bagi-rata" &&
            participants.length > 0 &&
            totalAmount > 0 && (
              <p
                className="text-xs text-center mt-1"
                style={{ color: "var(--color-text-secondary)" }}
              >
                {fmt(totalAmount)} ÷ {participants.length} orang ={" "}
                <strong className="text-primary">{fmt(perPerson)}/orang</strong>
              </p>
            )}
        </div>

        {error && (
          <p className="text-xs text-red-500 font-medium bg-red-50 rounded-xl px-4 py-2">
            ⚠️ {error}
          </p>
        )}

        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 active:scale-[0.98] disabled:bg-blue-400 text-white font-semibold py-3 rounded-xl text-sm transition-all duration-150 shadow-sm mt-1"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              {isEditing ? "Menyimpan..." : "Menambahkan..."}
            </>
          ) : isEditing ? (
            "Simpan Perubahan"
          ) : (
            "Simpan Pengeluaran"
          )}
        </button>
      </div>
    </div>
  );
}

export default AddExpenseForm;
