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
      <p className="text-xs text-gray-400 text-center">
        Tambahkan anggota yang akan ikut patungan. Tekan Enter atau tombol +
        untuk menambah.
      </p>
      <div className="flex gap-2 items-center">
        <div className="relative shrink-0" ref={pickerRef}>
          <button
            onClick={() => setShowEmoji((v) => !v)}
            className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 text-xl hover:border-gray-300 hover:bg-gray-50 transition"
          >
            {inputEmoji}
          </button>
          {showEmojiPicker && (
            <div className="absolute top-12 left-0 z-10 bg-white border border-gray-200 rounded-2xl p-2 shadow-lg grid grid-cols-6 gap-1 w-44">
              {MEMBER_EMOJIS.map((em) => (
                <button
                  key={em}
                  onClick={() => {
                    setInputEmoji(em);
                    setShowEmoji(false);
                  }}
                  className={`w-7 h-7 rounded-lg flex items-center justify-center text-base hover:bg-gray-100 transition ${inputEmoji === em ? "bg-blue-50" : ""}`}
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
          className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition"
          autoFocus
        />
        <button
          onClick={addMember}
          className="w-10 h-10 flex items-center justify-center bg-blue-500 hover:bg-blue-600 active:scale-95 text-white rounded-xl shadow-sm transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {error && (
        <p className="text-xs text-red-500 font-medium -mt-2">{error}</p>
      )}

      {members.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-8 text-gray-300">
          <span className="text-4xl">👥</span>
          <p className="text-xs font-medium">Belum ada anggota ditambahkan</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {ownerMemberId === null && (
            <p className="text-[11px] text-blue-400 text-center font-medium bg-blue-50 rounded-xl py-2 px-3">
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
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border transition-all ${
                  isOwner
                    ? "bg-blue-50 border-blue-200"
                    : "bg-gray-50 border-gray-100"
                }`}
              >
                <span className="text-xl">{m.emoji}</span>
                <span className="flex-1 text-sm font-medium text-gray-700">
                  {m.name}
                </span>

                {isOwner && <OwnerBadge />}

                <span className="text-[11px] text-gray-400 font-medium">
                  #{i + 1}
                </span>

                <button
                  onClick={() => handleTagOwner(m.id)}
                  title={isOwner ? "Batalkan tandai" : "Tandai sebagai kamu"}
                  className={`w-7 h-7 flex items-center justify-center rounded-full transition ${
                    isOwner
                      ? "bg-blue-100 text-blue-500 hover:bg-blue-200"
                      : "text-gray-300 hover:bg-blue-50 hover:text-blue-400"
                  }`}
                >
                  <UserCheck className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => handleRemove(m.id)}
                  className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-red-50 text-gray-300 hover:text-red-400 transition"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}

          <p className="text-center text-xs text-gray-400">
            {members.length} anggota
          </p>
        </div>
      )}
    </div>
  );
}

export default MemberStep;
