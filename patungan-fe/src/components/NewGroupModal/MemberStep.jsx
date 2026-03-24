import { Plus, Trash2, UserCheck } from "lucide-react";
import MEMBER_EMOJIS from "../../config/emoji";
import OwnerBadge from "../OwnerBadge";
import { useEffect, useRef } from "react";

function MemberStep({
  inputName,
  setInputName,
  inputEmoji,
  setInputEmoji,
  members,
  setMembers,
  ownerMemberId,
  setOwnerMemberId,
  showEmojiPicker,
  setShowEmoji,
  error,
  setError,
}) {
  const pickerRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) {
        setShowEmoji(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const addMember = () => {
    const trimmed = inputName.trim();
    if (!trimmed) return;
    if (members.find((m) => m.name.toLowerCase() === trimmed.toLowerCase())) {
      return setError("Nama anggota sudah ada.");
    }
    setMembers((prev) => [
      ...prev,
      { id: Date.now(), name: trimmed, emoji: inputEmoji },
    ]);
    setInputName("");
    setError("");
  };

  const handleTagOwner = (memberId) => {
    setOwnerMemberId((prev) => (prev === memberId ? null : memberId));
  };

  const handleRemove = (id) => {
    setMembers((prev) => prev.filter((x) => x.id !== id));
    if (ownerMemberId === id) setOwnerMemberId(null);
  };

  return (
    <div className="flex flex-col gap-4">
      <p
        className="text-xs text-center"
        style={{ color: "var(--color-text-secondary)" }}
      >
        Tambahkan anggota yang akan ikut patungan. Tekan Enter atau tombol +
        untuk menambah.
      </p>

      <div className="flex gap-2 items-center">
        <div className="relative shrink-0" ref={pickerRef}>
          <button
            onClick={() => setShowEmoji((v) => !v)}
            aria-label="Input Emoji"
            style={{
              borderColor: "var(--color-border)",
              backgroundColor: "var(--color-bg-primary)",
            }}
            className="w-10 h-10 flex items-center justify-center rounded-xl border text-xl hover:border-[var(--color-text-secondary)] hover:bg-[var(--color-bg-tertiary)] transition"
          >
            {inputEmoji}
          </button>

          {showEmojiPicker && (
            <div
              style={{
                backgroundColor: "var(--color-bg-primary)",
                borderColor: "var(--color-border)",
              }}
              className="absolute top-12 left-0 z-10 border rounded-2xl p-2 shadow-lg grid grid-cols-6 gap-1 w-44"
            >
              {MEMBER_EMOJIS.map((em) => (
                <button
                  key={em}
                  aria-label={`Member Emoji ${em}`}
                  onClick={() => {
                    setInputEmoji(em);
                    setShowEmoji(false);
                  }}
                  style={
                    inputEmoji === em
                      ? { backgroundColor: "var(--color-bg-tertiary)" }
                      : {}
                  }
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-base hover:bg-[var(--color-bg-tertiary)] transition"
                >
                  {em}
                </button>
              ))}
            </div>
          )}
        </div>

        <input
          type="text"
          placeholder="Nama anggota..."
          value={inputName}
          onChange={(e) => {
            setInputName(e.target.value);
            setError("");
          }}
          onKeyDown={(e) => e.key === "Enter" && addMember()}
          style={{
            backgroundColor: "var(--color-bg-primary)",
            color: "var(--color-text-primary)",
            borderColor: "var(--color-border)",
          }}
          className="flex-1 border rounded-xl px-4 py-2.5 text-sm placeholder:text-[var(--color-text-secondary)] focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition"
          autoFocus
        />

        <button
          onClick={addMember}
          aria-label="Tambah Member"
          className="w-10 h-10 flex items-center justify-center btn-primary active:scale-95 rounded-xl shadow-sm transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {error && (
        <p className="text-xs text-red-500 font-medium -mt-2">{error}</p>
      )}

      {members.length === 0 ? (
        <div
          className="flex flex-col items-center gap-2 py-8"
          style={{ color: "var(--color-text-secondary)" }}
        >
          <span className="text-4xl">👥</span>
          <p className="text-xs font-medium">Belum ada anggota ditambahkan</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {ownerMemberId === null && (
            <p className="text-[11px] text-blue-400 text-center font-medium bg-blue-50 dark:bg-blue-950/30 rounded-xl py-2 px-3">
              Tandai dirimu dengan menekan{" "}
              <UserCheck className="w-3 h-3 inline-block" /> di salah satu
              anggota
            </p>
          )}

          {members.map((m, i) => {
            const isOwner = ownerMemberId === m.id;
            return (
              <div
                key={m.id}
                style={
                  isOwner
                    ? {}
                    : {
                        backgroundColor: "var(--color-bg-secondary)",
                        borderColor: "var(--color-border)",
                      }
                }
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border transition-all ${
                  isOwner
                    ? "bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800"
                    : ""
                }`}
              >
                <span className="text-xl">{m.emoji}</span>
                <span
                  className="flex-1 text-sm font-medium"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  {m.name}
                </span>

                {isOwner && <OwnerBadge />}

                <span
                  className="text-[11px] font-medium"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  #{i + 1}
                </span>

                <button
                  onClick={() => handleTagOwner(m.id)}
                  aria-label="Tandai"
                  title={isOwner ? "Batalkan tandai" : "Tandai sebagai kamu"}
                  className={`w-7 h-7 flex items-center justify-center rounded-full transition ${
                    isOwner
                      ? "bg-blue-100 dark:bg-blue-900/50 text-blue-500 hover:bg-blue-200 dark:hover:bg-blue-900"
                      : "hover:bg-blue-50 dark:hover:bg-blue-950/30 hover:text-blue-400"
                  }`}
                  style={
                    isOwner ? {} : { color: "var(--color-text-secondary)" }
                  }
                >
                  <UserCheck className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => handleRemove(m.id)}
                  aria-label="Delete"
                  style={{ color: "var(--color-text-secondary)" }}
                  className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-400 transition"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}

          <p
            className="text-center text-xs"
            style={{ color: "var(--color-text-secondary)" }}
          >
            {members.length} anggota
          </p>
        </div>
      )}
    </div>
  );
}

export default MemberStep;
