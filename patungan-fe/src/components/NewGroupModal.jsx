import { useState } from "react";
import { X } from "lucide-react";
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

function NewGroupModal({ open, onClose, onSubmit }) {
  const [groupName, setGroupName] = useState("");
  const [groupIconId, setGroupIconId] = useState(ICON_OPTIONS[0].id);
  const [selectedColor, setSelectedColor] = useState(COLOR_OPTIONS[0]);
  const [members, setMembers] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const GroupIcon = ICON_OPTIONS.find((o) => o.id === groupIconId)?.icon;

  if (!open) return null;

  const handleClose = () => {
    setGroupName("");
    setGroupIconId(ICON_OPTIONS[0].id);
    setSelectedColor(COLOR_OPTIONS[0]);
    setMembers([]);
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

            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="mt-4 w-full py-2.5 rounded-xl bg-blue-500 text-white font-semibold hover:bg-blue-600 transition disabled:opacity-50"
            >
              {isSubmitting ? "Membuat..." : "Buat Grup"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NewGroupModal;
