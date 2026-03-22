import { useState } from "react";
import { Pencil, Plus, UserX, Check, X, UserCheck } from "lucide-react";
import MEMBER_EMOJIS from "../../config/emoji";
import OwnerBadge from "../OwnerBadge";

function MemberRow({ member, isOwner, onEdit, onDeactivate, onTagOwner }) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(member?.name);
  const [emoji, setEmoji] = useState(member?.emoji || "👤");
  const [showEmoji, setShowEmoji] = useState(false);

  const handleSave = () => {
    if (!name.trim()) return;
    onEdit(member?._id, { name: name.trim(), emoji });
    setEditing(false);
    setShowEmoji(false);
  };

  const handleCancel = () => {
    setName(member?.name);
    setEmoji(member?.emoji || "👤");
    setEditing(false);
    setShowEmoji(false);
  };

  if (!member?.isActive) {
    return (
      <div className="flex items-center gap-3 px-4 py-2.5 bg-gray-50 rounded-xl border border-gray-100 opacity-50">
        <span className="text-xl">{member?.emoji || "👤"}</span>
        <span className="flex-1 text-sm font-medium text-gray-400 line-through">
          {member?.name}
        </span>
        <span className="text-[10px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
          Nonaktif
        </span>
      </div>
    );
  }

  if (editing) {
    return (
      <div className="flex flex-col gap-2 px-4 py-3 bg-blue-50 rounded-xl border border-blue-200">
        <div className="flex items-center gap-2">
          <div className="relative shrink-0">
            <button
              onClick={() => setShowEmoji((v) => !v)}
              className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 bg-white text-xl hover:border-blue-300 transition"
            >
              {emoji}
            </button>
            {showEmoji && (
              <div className="absolute top-12 left-0 z-20 bg-white border border-gray-200 rounded-2xl p-2 shadow-lg grid grid-cols-6 gap-1 w-44">
                {MEMBER_EMOJIS.map((em) => (
                  <button
                    key={em}
                    onClick={() => {
                      setEmoji(em);
                      setShowEmoji(false);
                    }}
                    className={`w-7 h-7 rounded-lg flex items-center justify-center text-base hover:bg-gray-100 transition ${emoji === em ? "bg-blue-50" : ""}`}
                  >
                    {em}
                  </button>
                ))}
              </div>
            )}
          </div>

          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSave();
              if (e.key === "Escape") handleCancel();
            }}
            className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition bg-white"
          />

          <button
            onClick={handleSave}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-500 hover:bg-blue-600 text-white transition shrink-0"
          >
            <Check className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleCancel}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 text-gray-400 transition shrink-0"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border group transition-all ${
        isOwner ? "bg-blue-50 border-blue-200" : "bg-gray-50 border-gray-100"
      }`}
    >
      <span className="text-xl">{member?.emoji || "👤"}</span>
      <span className="flex-1 text-sm font-medium text-gray-700">
        {member?.name}
      </span>

      {isOwner && <OwnerBadge />}

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => onTagOwner(member?._id)}
          title={isOwner ? "Batalkan tandai" : "Tandai sebagai kamu"}
          className={`w-7 h-7 flex items-center justify-center rounded-full transition ${
            isOwner
              ? "bg-blue-100 text-blue-500 hover:bg-blue-200"
              : "text-gray-400 hover:bg-blue-50 hover:text-blue-400"
          }`}
        >
          <UserCheck className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={() => setEditing(true)}
          className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-blue-100 text-gray-400 hover:text-blue-500 transition"
          title="Edit member"
        >
          <Pencil className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => onDeactivate(member)}
          className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-red-50 text-gray-400 hover:text-red-400 transition"
          title="Nonaktifkan member"
        >
          <UserX className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

function DeactivateConfirm({ member, onConfirm, onCancel }) {
  return (
    <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex flex-col gap-3">
      <div className="flex items-start gap-3">
        <span className="text-2xl">{member?.emoji || "👤"}</span>
        <div>
          <p className="text-sm font-semibold text-gray-800">
            Nonaktifkan {member?.name}?
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Member tidak akan bisa dipilih di transaksi baru. Riwayat transaksi
            sebelumnya tetap tersimpan dan tidak terpengaruh.
          </p>
        </div>
      </div>
      <div className="flex gap-2">
        <button
          onClick={onCancel}
          className="flex-1 py-2 rounded-xl border border-gray-200 text-sm font-semibold text-gray-500 hover:bg-white transition"
        >
          Batal
        </button>
        <button
          onClick={onConfirm}
          className="flex-1 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-sm font-semibold transition"
        >
          Nonaktifkan
        </button>
      </div>
    </div>
  );
}

function EditMemberStep({
  members = [],
  ownerMemberId,
  onEditMember,
  onDeactivateMember,
  onAddMember,
  onTagOwner,
}) {
  const [confirmTarget, setConfirmTarget] = useState(null);
  const [inputName, setInputName] = useState("");
  const [inputEmoji, setInputEmoji] = useState(MEMBER_EMOJIS[0]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [addError, setAddError] = useState("");

  const activeMembers = members.filter((m) => m?.isActive);
  const inactiveMembers = members.filter((m) => !m?.isActive);

  const handleAdd = () => {
    const trimmed = inputName.trim();
    if (!trimmed) return;
    const isDuplicate = activeMembers.some(
      (m) => m.name.toLowerCase() === trimmed.toLowerCase(),
    );
    if (isDuplicate) {
      setAddError("Nama member sudah ada");
      return;
    }
    onAddMember({ name: trimmed, emoji: inputEmoji });
    setInputName("");
    setAddError("");
  };

  const handleDeactivate = (memberId) => {
    if (ownerMemberId?.toString() === memberId?.toString()) {
      onTagOwner(null);
    }
    onDeactivateMember(memberId);
    setConfirmTarget(null);
  };

  const handleTagOwner = (memberId) => {
    const isSame = ownerMemberId?.toString() === memberId?.toString();
    onTagOwner(isSame ? null : memberId);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2 items-center">
        <div className="relative shrink-0">
          <button
            onClick={() => setShowEmojiPicker((v) => !v)}
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
                    setShowEmojiPicker(false);
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
          placeholder="Tambah member baru..."
          value={inputName}
          onChange={(e) => {
            setInputName(e.target.value);
            setAddError("");
          }}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition"
        />
        <button
          onClick={handleAdd}
          className="w-10 h-10 flex items-center justify-center bg-blue-500 hover:bg-blue-600 active:scale-95 text-white rounded-xl shadow-sm transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {addError && (
        <p className="text-xs text-red-500 font-medium -mt-2">{addError}</p>
      )}

      <div className="flex flex-col gap-2">
        {activeMembers.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-6 text-gray-300">
            <span className="text-3xl">👥</span>
            <p className="text-xs font-medium">Tidak ada member aktif</p>
          </div>
        ) : (
          activeMembers.map((m) =>
            confirmTarget?._id === m._id ? (
              <DeactivateConfirm
                key={m._id}
                member={m}
                onCancel={() => setConfirmTarget(null)}
                onConfirm={() => handleDeactivate(m._id)}
              />
            ) : (
              <MemberRow
                key={m._id}
                member={m}
                isOwner={ownerMemberId?.toString() === m._id?.toString()}
                onEdit={onEditMember}
                onDeactivate={(member) => setConfirmTarget(member)}
                onTagOwner={handleTagOwner}
              />
            ),
          )
        )}
      </div>

      {inactiveMembers.length > 0 && (
        <div className="flex flex-col gap-2">
          <p className="text-xs font-semibold text-gray-400 uppercase">
            Nonaktif ({inactiveMembers.length})
          </p>
          {inactiveMembers.map((m) => (
            <MemberRow
              key={m?._id}
              member={m}
              isOwner={false}
              onEdit={() => {}}
              onDeactivate={() => {}}
              onTagOwner={() => {}}
            />
          ))}
        </div>
      )}

      <p className="text-center text-xs text-gray-400">
        {activeMembers.length} member aktif
      </p>
    </div>
  );
}

export default EditMemberStep;
