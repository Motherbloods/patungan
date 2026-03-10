import { useState } from "react";
import { ChevronLeft, ChevronRight, Plus, Trash2, X } from "lucide-react";
import {
  UtensilsCrossed,
  Car,
  Plane,
  Home,
  Music,
  ShoppingBag,
  Gamepad2,
  Heart,
  Coffee,
  Briefcase,
  Bike,
  Tent,
} from "lucide-react";
import ICON_OPTIONS from "../config/colors";
import COLOR_OPTIONS from "../config/icons";

const MEMBER_EMOJIS = [
  "🧑",
  "👦",
  "👧",
  "🧔",
  "👩",
  "🧒",
  "👨",
  "🙋",
  "🙆",
  "🤷",
  "👱",
  "🧕",
];

function NewGroupModal({ open, onClose, onSubmit }) {
  const [step, setStep] = useState(1);
  const [groupName, setGroupName] = useState("");
  const [groupIconId, setGroupIconId] = useState(ICON_OPTIONS[0].id);
  const [selectedColor, setSelectedColor] = useState(COLOR_OPTIONS[0]);
  const [members, setMembers] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [inputName, setInputName] = useState("");
  const [inputEmoji, setInputEmoji] = useState(MEMBER_EMOJIS[0]);
  const [showEmojiPicker, setShowEmoji] = useState(false);
  const [error, setError] = useState("");

  const GroupIcon = ICON_OPTIONS.find((o) => o.id === groupIconId)?.icon;

  if (!open) return null;

  const handleClose = () => {
    setStep(1);
    setGroupName("");
    setGroupIconId(ICON_OPTIONS[0].id);
    setSelectedColor(COLOR_OPTIONS[0]);
    setMembers([]);
    setError("");
    onClose?.();
  };

  const handleNext = () => {
    if (step === 1) {
      if (!groupName.trim()) {
        setError("Nama grup tidak boleh kosong");
        return;
      }
      setError("");
      setStep(2);
    }
  };

  const handleSubmit = async () => {
    if (!groupName.trim()) {
      setError("Nama grup tidak boleh kosong");
      return;
    }
    setIsSubmitting(true);
    try {
      await onSubmit({
        groupName,
        groupIcon: GroupIcon,
        groupColor: selectedColor.bg,
        groupIconColor: selectedColor.text,
        members,
      });
      setIsSubmitting(false);
      handleClose();
    } catch (err) {
      setError(err.message || "Gagal membuat grup");
      setIsSubmitting(false);
    }
  };

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

  return (
    <div
      className="fixed inset-0 z-60 flex items-end sm:items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(2px)" }}
      onClick={(e) => e.target === e.currentTarget && handleClose()}
    >
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-6 pt-5 pb-4 border-b border-gray-100">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h2 className="text-base font-bold text-gray-900">Info Group</h2>
              <p className="text-xs text-gray-400 mt-0.5">
                Atur nama, ikon, dan warna grupmu
              </p>
            </div>
            <button
              onClick={handleClose}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition mt-0.5"
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>

        <div className="overflow-y-auto px-6 py-5">
          {step === 1 && (
            <div className="flex flex-col gap-5">
              <div className="flex justify-center">
                <div
                  className={`${selectedColor.bg} ${selectedColor.text} w-16 h-16 rounded-2xl flex items-center justify-center shadow-sm transition-all duration-200`}
                >
                  {GroupIcon && (
                    <GroupIcon className="w-8 h-8 stroke-2 text-current" />
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Nama Grup
                </label>
                <input
                  type="text"
                  placeholder="cth. Liburan Bandung, Kos Bareng..."
                  value={groupName}
                  onChange={(e) => {
                    setGroupName(e.target.value);
                    setError("");
                  }}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition"
                  autoFocus
                />
                {error && (
                  <p className="text-xs text-red-500 font-medium">{error}</p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Ikon
                </label>
                <div className="grid grid-cols-6 gap-2">
                  {ICON_OPTIONS.map(({ id, icon: Icon, label }) => {
                    const active = groupIconId === id;
                    return (
                      <button
                        key={id}
                        title={label}
                        onClick={() => setGroupIconId(id)}
                        className={`aspect-square flex items-center justify-center rounded-xl border-2 transition-all ${
                          active
                            ? `${selectedColor.bg} ${selectedColor.text} border-current`
                            : "border-gray-100 hover:border-gray-300 text-gray-400"
                        }`}
                      >
                        <Icon className="w-5 h-5 stroke-2" />
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Warna
                </label>
                <div className="flex gap-2 flex-wrap">
                  {COLOR_OPTIONS.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setSelectedColor(c)}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${c.bg} ${
                        selectedColor.id === c.id
                          ? "border-gray-500 scale-110 shadow-md"
                          : "border-transparent hover:scale-105"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="flex flex-col gap-4">
              <p className="text-xs text-gray-400 text-center">
                Tambahkan anggota yang akan ikut patungan. Tekan Enter atau
                tombol + untuk menambah.
              </p>
              <div className="flex gap-2 items-center">
                <div className="relative shrink-0">
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
                <p className="text-xs text-red-500 font-medium -mt-2">
                  {error}
                </p>
              )}

              {members.length === 0 ? (
                <div className="flex flex-col items-center gap-2 py-8 text-gray-300">
                  <span className="text-4xl">👥</span>
                  <p className="text-xs font-medium">
                    Belum ada anggota ditambahkan
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  {members.map((m, i) => (
                    <div
                      key={m.id}
                      className="flex items-center gap-3 px-4 py-2.5 bg-gray-50 rounded-xl border border-gray-100"
                    >
                      <span className="text-xl">{m.emoji}</span>
                      <span className="flex-1 text-sm font-medium text-gray-700">
                        {m.name}
                      </span>
                      <span className="text-[11px] text-gray-400 font-medium">
                        #{i + 1}
                      </span>
                      <button
                        onClick={() =>
                          setMembers((prev) =>
                            prev.filter((x) => x.id !== m.id),
                          )
                        }
                        className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-red-50 text-gray-300 hover:text-red-400 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                  <p className="text-center text-xs text-gray-400">
                    {members.length} anggota
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
          {step === 1 ? (
            <>
              <button
                onClick={handleClose}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-500 hover:bg-gray-50 transition"
              >
                Batal
              </button>
              <button
                onClick={handleNext}
                className="flex-1 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-600 active:scale-[0.98] text-white text-sm font-semibold transition-all shadow-sm flex items-center justify-center gap-1.5"
              >
                Selanjutnya <ChevronRight className="w-4 h-4" />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => {
                  setStep(1);
                  setError("");
                }}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-500 hover:bg-gray-50 transition flex items-center justify-center gap-1.5"
              >
                <ChevronLeft className="w-4 h-4" /> Kembali
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-600 active:scale-[0.98] text-white text-sm font-semibold transition-all shadow-sm"
              >
                Buat Grup 🎉
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default NewGroupModal;
