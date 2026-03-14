import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";

function GroupMenu({ onEdit, onDelete }) {
  const [open, setOpen] = useState(false);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });
  const btnRef = useRef(null);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        btnRef.current &&
        !btnRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const rect = btnRef.current.getBoundingClientRect();
    setMenuPos({
      top: rect.bottom + 4,
      left: rect.right - 144,
    });
    setOpen((prev) => !prev);
  };

  const handleEdit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setOpen(false);
    onEdit?.();
  };

  const handleDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setOpen(false);
    onDelete?.();
  };

  return (
    <div className="absolute right-1 top-1/2 -translate-y-1/2 opacity-0 group-hover/item:opacity-100 transition-opacity">
      <button
        ref={btnRef}
        onClick={handleToggle}
        className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-200 transition"
      >
        <MoreHorizontal className="w-4 h-4 text-gray-400" />
      </button>

      {open &&
        createPortal(
          <div
            ref={menuRef}
            style={{ top: menuPos.top, left: menuPos.left }}
            className="fixed z-9999 bg-white border border-gray-100 rounded-xl shadow-lg py-1 w-36 text-sm"
          >
            <button
              onClick={handleEdit}
              className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-50 text-gray-700 transition"
            >
              <Pencil className="w-3.5 h-3.5 text-blue-500" />
              Edit Grup
            </button>
            <button
              onClick={handleDelete}
              className="w-full flex items-center gap-2 px-3 py-2 hover:bg-rose-50 text-rose-500 transition"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Hapus Grup
            </button>
          </div>,
          document.body,
        )}
    </div>
  );
}

export default GroupMenu;
