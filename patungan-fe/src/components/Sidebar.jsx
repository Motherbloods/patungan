import {
  LayoutDashboard,
  Menu,
  X,
  MoreVertical,
  LogOut,
  Link2,
  Check,
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import NewGroupModal from "./NewGroupModal";
import { useAddGroup, useDeleteGroup, useGroups } from "../hooks/useGroups";
import ICON_OPTIONS from "../config/icons";
import GroupMenu from "./GroupMenu";
import EditGroupModal from "./EditGroupModal";
import toast from "react-hot-toast";
import { useAuth } from "../context/authContext";
import { getGradient } from "../utils/getGradient";
import LinkAccountModal from "./LinkAccountModal";

function Sidebar() {
  const { user, setUser, isAuthenticated, logout, isLoggingOut } = useAuth();
  const [open, setOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [linkingProvider, setLinkingProvider] = useState(null);
  const [gradStart, gradEnd] = getGradient(user?.username);
  const groupRefs = useRef({});
  const listRef = useRef(null);
  const menuRef = useRef(null);
  const location = useLocation();

  const { data: groupList = [], isLoading } = useGroups();
  const { mutate: addGroup } = useAddGroup();
  const { mutate: deleteGroup } = useDeleteGroup();

  const hasGoogle = user?.providers?.includes("google");
  const hasTelegram = user?.providers?.includes("telegram");
  const allLinked = hasGoogle && hasTelegram;

  const onSubmitModal = (groupData) => {
    return new Promise((resolve, reject) => {
      addGroup(groupData, {
        onSuccess: resolve,
        onError: reject,
      });
    });
  };

  const handleDelete = (groupId) => {
    toast(
      (t) => (
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium text-gray-800">Hapus grup ini?</p>
          <p className="text-xs text-gray-500">
            Semua data akan hilang permanen.
          </p>
          <div className="flex gap-2 mt-1">
            <button
              onClick={() => {
                toast.dismiss(t.id);
                deleteGroup(groupId, {
                  onSuccess: () => toast.success("Grup berhasil dihapus"),
                  onError: () => toast.error("Gagal menghapus grup"),
                });
              }}
              className="flex-1 py-1.5 rounded-lg bg-red-500 hover:bg-red-600 text-white text-xs font-bold transition"
            >
              Hapus
            </button>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="flex-1 py-1.5 rounded-lg border border-gray-200 text-gray-500 text-xs font-semibold hover:bg-gray-50 transition"
            >
              Batal
            </button>
          </div>
        </div>
      ),
      { duration: Infinity },
    );
  };

  const handleLogout = () => {
    setMenuOpen(false);

    logout({
      onSuccess: () => toast.success("Berhasil logout"),
      onError: () => toast.error("Gagal logout"),
    });
  };

  const handleLinkSuccess = (updatedUser) => {
    setUser(updatedUser);
    setLinkingProvider(null);
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

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

        <div
          ref={listRef}
          className="flex flex-col gap-1 overflow-y-auto flex-1"
        >
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
                    onDelete={() => handleDelete(group._id)}
                  />
                </div>
              );
            })}
        </div>

        {isAuthenticated && (
          <div
            className="mt-4 pt-4 border-t border-gray-100 relative"
            ref={menuRef}
          >
            <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 transition-colors duration-200">
              <div className="relative shrink-0">
                {user?.avatar ? (
                  <img
                    src={
                      user.avatar.includes("googleusercontent.com")
                        ? user.avatar.replace(/=s\d+-c/, "=s40-c")
                        : user.avatar
                    }
                    alt={user?.username}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md"
                    style={{
                      background: `linear-gradient(135deg, ${gradStart}, ${gradEnd})`,
                    }}
                  >
                    {user?.username?.charAt(0)?.toUpperCase() || "?"}
                  </div>
                )}
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 border-2 border-white rounded-full" />
              </div>

              <div className="flex flex-col justify-center min-w-0 flex-1">
                <span className="text-gray-800 font-semibold text-sm truncate leading-tight">
                  {user?.username}
                </span>
                {(user?.firstName || user?.lastName) && (
                  <span className="text-gray-400 text-xs truncate leading-tight">
                    {[user.firstName, user.lastName].filter(Boolean).join(" ")}
                  </span>
                )}
              </div>

              <button
                onClick={() => setMenuOpen((prev) => !prev)}
                className={`p-1.5 rounded-lg transition-colors shrink-0 ${menuOpen ? "bg-gray-100 text-gray-700" : "hover:bg-gray-100 text-gray-400"}`}
                aria-label="More options"
              >
                <MoreVertical size={16} />
              </button>
            </div>

            {menuOpen && (
              <div className="absolute bottom-full right-0 mb-2 w-52 bg-white border border-gray-100 rounded-xl shadow-2xl py-2 z-50 overflow-hidden">
                <div className="px-3 pb-1">
                  <p className="text-xs text-gray-400 font-medium px-1 pb-1.5 uppercase tracking-wide">
                    Tautkan Akun
                  </p>

                  {!hasGoogle && (
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        setLinkingProvider("google");
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-sm rounded-lg hover:bg-gray-50 transition text-left"
                    >
                      <span className="w-6 h-6 flex items-center justify-center rounded-full bg-blue-50 text-blue-500 text-xs font-bold flex-shrink-0">
                        G
                      </span>
                      <span className="text-gray-700">Tautkan Google</span>
                      <Link2 size={13} className="ml-auto text-gray-400" />
                    </button>
                  )}

                  {!hasTelegram && (
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        setLinkingProvider("telegram");
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-sm rounded-lg hover:bg-gray-50 transition text-left"
                    >
                      <span className="w-6 h-6 flex items-center justify-center rounded-full bg-sky-50 text-sky-500 text-xs font-bold flex-shrink-0">
                        TG
                      </span>
                      <span className="text-gray-700">Tautkan Telegram</span>
                      <Link2 size={13} className="ml-auto text-gray-400" />
                    </button>
                  )}

                  {allLinked && (
                    <div className="flex items-center gap-2.5 px-3 py-2 text-sm text-green-500">
                      <span className="w-6 h-6 flex items-center justify-center rounded-full bg-green-50">
                        <Check size={13} />
                      </span>
                      <span>Semua akun tertaut</span>
                    </div>
                  )}
                </div>

                <div className="border-t border-gray-100 my-1.5 mx-2" />

                <div className="px-3">
                  <button
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-sm rounded-lg hover:bg-red-50 transition text-left text-red-500 disabled:opacity-60"
                  >
                    {isLoggingOut ? (
                      <svg
                        className="animate-spin h-4 w-4 text-red-500"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                        />
                      </svg>
                    ) : (
                      <LogOut size={15} className="shrink-0" />
                    )}
                    <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
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

      {linkingProvider && (
        <LinkAccountModal
          provider={linkingProvider}
          onClose={() => setLinkingProvider(null)}
          onSuccess={handleLinkSuccess}
        />
      )}
    </>
  );
}

export default Sidebar;
