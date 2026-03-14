import { LayoutDashboard, Menu, X } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import NewGroupModal from "./NewGroupModal";
import { useAddGroup, useGroups } from "../hooks/useGroups";
import ICON_OPTIONS from "../config/icons";
import GroupMenu from "./GroupMenu";
import EditGroupModal from "./EditGroupModal";

function Sidebar() {
  const [open, setOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const groupRefs = useRef({});
  const listRef = useRef(null);
  const location = useLocation();

  const { data: groupList = [], isLoading } = useGroups();
  const { mutate: addGroup } = useAddGroup();
  const deleteGroup = (id) => {
    console.log("hapus group ", id);
  };

  const onSubmitModal = (groupData) => {
    addGroup(groupData);
  };

  useEffect(() => {
    if (!location.state?.autoScrollSidebar) return;

    const match = location.pathname.match(/\/groups\/(\w+)/);
    if (match) {
      const groupId = match[1];
      const groupElement = groupRefs.current[groupId];
      if (groupElement) {
        groupElement.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [location]);
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow"
      >
        <Menu className="w-5 h-5" />
      </button>

      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
        />
      )}

      <div
        className={`
  fixed md:static top-0 left-0 h-screen bg-white p-4 flex flex-col
  w-full md:w-64 transition-transform duration-300 z-50
  ${open ? "translate-x-0" : "-translate-x-full"}
  md:translate-x-0
  `}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-blue-600">Patungan</h2>
            <p className="text-xs text-gray-500">Kelola grup patungan</p>
          </div>

          <button
            onClick={() => setOpen(false)}
            aria-label="Close"
            className="md:hidden p-2 hover:bg-gray-100 rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <button
          onClick={() => {
            setShowModal(true);
            setOpen(false);
          }}
          className="bg-blue-500 hover:bg-blue-600 text-white py-2.5 px-3 rounded-xl mb-6 text-sm font-medium transition shadow-sm"
        >
          + New Group
        </button>

        <NavLink
          to="/dashboard"
          onClick={() => {
            setOpen(false);
            listRef.current.scrollTo({ behavior: "smooth", top: 0 });
          }}
          className={({ isActive }) =>
            `flex items-center gap-3 p-2 rounded-xl transition group mb-4
            ${isActive ? "bg-blue-100" : "hover:bg-blue-50"}`
          }
        >
          <div className="w-9 h-9 flex items-center justify-center rounded-lg shrink-0 bg-blue-100 text-blue-600">
            <LayoutDashboard className="w-5 h-5 stroke-2" />
          </div>

          <span className="text-sm font-medium text-gray-700">Dashboard</span>
        </NavLink>

        <p className="text-xs font-semibold text-gray-400 uppercase mb-2">
          Groups
        </p>

        <div ref={listRef} className="flex flex-col gap-1 overflow-y-auto">
          {isLoading && (
            <p className="text-sm text-gray-400 px-2 py-1">Loading groups...</p>
          )}

          {!isLoading && groupList.length === 0 && (
            <p className="text-sm text-gray-400 px-2 py-1">
              Belum ada group. Buat group baru.
            </p>
          )}
          {!isLoading &&
            groupList.map((group) => {
              const Icon = ICON_OPTIONS.find((i) => i.id === group.icon)?.icon;

              return (
                <div key={group._id} className="relative group/item">
                  <NavLink
                    to={`/groups/${group._id}`}
                    className={({ isActive }) =>
                      `flex items-center gap-3 p-2 rounded-xl transition pr-8
          ${isActive ? "bg-blue-100" : "hover:bg-blue-50"}`
                    }
                  >
                    <div
                      className={`w-9 h-9 flex items-center justify-center rounded-lg shrink-0 ${group.color}`}
                    >
                      {Icon && <Icon className="w-5 h-5 stroke-2" />}
                    </div>
                    <span className="truncate text-sm font-medium text-gray-700">
                      {group.name}
                    </span>
                  </NavLink>

                  <GroupMenu
                    onEdit={() => setEditTarget(group)}
                    onDelete={() => deleteGroup(group._id)}
                  />
                </div>
              );
            })}
        </div>
      </div>

      {editTarget && (
        <EditGroupModal
          open={!!editTarget}
          group={editTarget}
          onClose={() => setEditTarget(null)}
        />
      )}

      {showModal && (
        <NewGroupModal
          open={showModal}
          onClose={() => setShowModal(false)}
          onSubmit={onSubmitModal}
        />
      )}
    </>
  );
}

export default Sidebar;
