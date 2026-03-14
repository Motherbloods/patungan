import { useState } from "react";
import { X } from "lucide-react";
import ICON_OPTIONS from "../config/icons";
import COLOR_OPTIONS from "../config/colors";
import GroupInfoStep from "./NewGroupModal/GroupInfoStep";

function EditGroupModal({ open, onClose, onSubmit, group }) {
  const initialColor =
    COLOR_OPTIONS.find((c) => c.bg === group?.color) ?? COLOR_OPTIONS[0];

  const [groupName, setGroupName] = useState(group?.name ?? "");
  const [groupIconId, setGroupIconId] = useState(
    group?.icon ?? ICON_OPTIONS[0].id,
  );
  const [selectedColor, setSelectedColor] = useState(initialColor);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const GroupIcon = ICON_OPTIONS.find((o) => o.id === groupIconId)?.id;

  if (!open) return null;

  const handleClose = () => {
    setError("");
    onClose?.();
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
      });
      handleClose();
    } catch (err) {
      setError(err.message || "Gagal mengupdate grup");
    } finally {
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
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-base font-bold text-gray-900">Edit Grup</h2>
              <p className="text-xs text-gray-400 mt-0.5">
                Ubah nama, ikon, atau warna grup
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
        </div>

        <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
          <button
            onClick={handleClose}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-500 hover:bg-gray-50 transition"
          >
            Batal
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex-1 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-600 active:scale-[0.98] text-white text-sm font-semibold transition-all shadow-sm"
          >
            {isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditGroupModal;
