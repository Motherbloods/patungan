import { useState } from "react";
import { Loader2, X } from "lucide-react";
import ICON_OPTIONS from "../config/icons";
import COLOR_OPTIONS from "../config/colors";
import GroupInfoStep from "./NewGroupModal/GroupInfoStep";
import EditMemberStep from "./EditGroupModal/EditMemberStep";
import {
  useEditGroup,
  useEditMember,
  useDeactivateMember,
  useAddMember,
  useUpdateOwnerMember,
} from "../hooks/useGroups";
import toast from "react-hot-toast";

const TABS = [
  { id: "info", label: "Info Grup" },
  { id: "members", label: "Members" },
];

function EditGroupModal({ open, onClose, group }) {
  const initialColor =
    COLOR_OPTIONS.find(
      (c) => group?.color?.includes(c.bg) && group?.color?.includes(c.text),
    ) ?? COLOR_OPTIONS[0];

  const [activeTab, setActiveTab] = useState("info");
  const [groupName, setGroupName] = useState(group?.name ?? "");
  const [groupIconId, setGroupIconId] = useState(
    group?.icon ?? ICON_OPTIONS[0].id,
  );
  const [selectedColor, setSelectedColor] = useState(initialColor);
  const [error, setError] = useState("");

  const [localMembers, setLocalMembers] = useState(group?.members ?? []);
  const [ownerMemberId, setOwnerMemberId] = useState(
    group?.ownerMemberId ?? null,
  );

  const { mutate: editGroup, isPending: isSavingGroup } = useEditGroup();
  const { mutate: editMember } = useEditMember(group?._id);
  const { mutate: deactivateMember } = useDeactivateMember(group?._id);
  const { mutate: addMember } = useAddMember(group?._id);
  const { mutate: updateOwnerMember } = useUpdateOwnerMember(group?._id);

  const GroupIcon = ICON_OPTIONS.find((o) => o.id === groupIconId)?.id;

  if (!open) return null;

  const handleClose = () => {
    setError("");
    setActiveTab("info");
    onClose?.();
  };

  const handleSaveInfo = () => {
    if (!groupName.trim()) {
      setError("Nama grup tidak boleh kosong");
      return;
    }
    editGroup(
      {
        id: group._id,
        data: {
          groupName,
          groupIcon: GroupIcon,
          groupColor: `${selectedColor.bg} ${selectedColor.text}`,
        },
      },
      {
        onSuccess: () => {
          toast.success("Info grup berhasil disimpan");
          handleClose();
        },
        onError: (err) => {
          const msg = err.message || "Gagal menyimpan";
          setError(msg);
          toast.error(msg);
        },
      },
    );
  };

  const handleEditMember = (memberId, data) => {
    setLocalMembers((prev) =>
      prev.map((m) => (m._id === memberId ? { ...m, ...data } : m)),
    );
    editMember(
      { memberId, data },
      {
        onSuccess: () => toast.success("Nama member diperbarui"),
        onError: () => toast.error("Gagal memperbarui member"),
      },
    );
  };

  const handleDeactivateMember = (memberId) => {
    setLocalMembers((prev) =>
      prev.map((m) => (m._id === memberId ? { ...m, isActive: false } : m)),
    );
    deactivateMember(memberId, {
      onSuccess: () => toast.success("Member dinonaktifkan"),
      onError: () => {
        setLocalMembers((prev) =>
          prev.map((m) => (m._id === memberId ? { ...m, isActive: true } : m)),
        );
        toast.error("Gagal menonaktifkan member");
      },
    });
  };

  const handleAddMember = (data) => {
    addMember(data, {
      onSuccess: (newMember) => {
        setLocalMembers((prev) => [...prev, newMember]);
        toast.success("Member berhasil ditambahkan");
      },
      onError: () => toast.error("Gagal menambahkan member"),
    });
  };

  const handleTagOwner = (memberId) => {
    setOwnerMemberId(memberId);
    updateOwnerMember(
      { memberId: memberId ?? null },
      {
        onSuccess: () => toast.success("Owner berhasil diperbarui"),
        onError: () => {
          setOwnerMemberId(group?.ownerMemberId ?? null);
          toast.error("Gagal memperbarui owner");
        },
      },
    );
  };

  return (
    <div
      className="fixed inset-0 z-60 flex items-end sm:items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(2px)" }}
      onClick={(e) => e.target === e.currentTarget && handleClose()}
    >
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-6 pt-5 pb-4 border-b border-gray-100">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-gray-900">Edit Grup</h2>
              <p className="text-xs text-gray-400 mt-0.5">
                Ubah info grup atau kelola member
              </p>
            </div>
            <button
              onClick={handleClose}
              aria-label="Close"
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition mt-0.5"
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>
          </div>

          <div className="flex gap-1 bg-gray-100 p-1 rounded-xl">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setError("");
                }}
                className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === tab.id
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-y-auto px-6 py-5 flex-1">
          {activeTab === "info" && (
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

          {activeTab === "members" && (
            <EditMemberStep
              members={localMembers}
              ownerMemberId={ownerMemberId}
              onEditMember={handleEditMember}
              onDeactivateMember={handleDeactivateMember}
              onAddMember={handleAddMember}
              onTagOwner={handleTagOwner}
            />
          )}
        </div>

        {activeTab === "info" && (
          <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
            <button
              onClick={handleClose}
              disabled={isSavingGroup}
              className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-500 hover:bg-gray-50 transition disabled:opacity-40"
            >
              Batal
            </button>
            <button
              onClick={handleSaveInfo}
              disabled={isSavingGroup}
              className="flex-1 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-600 active:scale-[0.98] disabled:bg-blue-400 text-white text-sm font-semibold transition-all shadow-sm flex items-center justify-center gap-2"
            >
              {isSavingGroup ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                "Simpan Perubahan"
              )}
            </button>
          </div>
        )}

        {activeTab === "members" && (
          <div className="px-6 py-3 border-t border-gray-100">
            <p className="text-center text-xs text-gray-400">
              Perubahan member tersimpan otomatis
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default EditGroupModal;
