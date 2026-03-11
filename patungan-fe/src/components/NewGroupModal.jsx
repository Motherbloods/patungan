import { useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import ICON_OPTIONS from "../config/icons";
import COLOR_OPTIONS from "../config/colors";
import MEMBER_EMOJIS from "../config/emoji";
import GroupInfoStep from "./NewGroupModal/GroupInfoStep";
import MemberStep from "./NewGroupModal/MemberStep";
import STEP_META from "../config/step_meta";

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
    setInputName("");
    setInputEmoji(MEMBER_EMOJIS[0]);
    setShowEmoji(false);
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
    if (members.length === 0) {
      setError("Minimal tambahkan 1 anggota");
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
              <h2 className="text-base font-bold text-gray-900">
                {STEP_META[step]?.title}
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                {STEP_META[step]?.sub}
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
            <GroupInfoStep
              GroupIcon={GroupIcon}
              groupName={groupName}
              setGroupName={setGroupName}
              groupIconId={groupIconId}
              setGroupIconId={setGroupIconId}
              selectedColor={selectedColor}
              setSelectedColor={setSelectedColor}
              error={error}
              setError={setError}
            />
          )}

          {step === 2 && (
            <MemberStep
              members={members}
              setMembers={setMembers}
              inputName={inputName}
              setInputName={setInputName}
              inputEmoji={inputEmoji}
              setInputEmoji={setInputEmoji}
              showEmojiPicker={showEmojiPicker}
              setShowEmoji={setShowEmoji}
              error={error}
              setError={setError}
            />
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
                disabled={isSubmitting}
                className="flex-1 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-600 active:scale-[0.98] text-white text-sm font-semibold transition-all shadow-sm"
              >
                {isSubmitting ? "Membuat..." : "Buat Grup 🎉"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default NewGroupModal;
