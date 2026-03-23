import {
  LayoutDashboard,
  Menu,
  X,
  MoreVertical,
  LogOut,
  Link2,
  Check,
  ChevronRight,
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
  const linkedCount = [hasGoogle, hasTelegram].filter(Boolean).length;

  const onSubmitModal = (groupData) => {
    return new Promise((resolve, reject) => {
      addGroup(groupData, { onSuccess: resolve, onError: reject });
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
      <style>{`
        @keyframes menuSlideUp {
          from { opacity: 0; transform: translateY(6px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .menu-enter { animation: menuSlideUp 0.18s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
        .group-item:hover .group-actions { opacity: 1; }
        .sidebar-scrollbar::-webkit-scrollbar { width: 3px; }
        .sidebar-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .sidebar-scrollbar::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 99px; }
        .sidebar-scrollbar::-webkit-scrollbar-thumb:hover { background: #d1d5db; }
      `}</style>

      <button
        onClick={() => setOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow"
      >
        <Menu className="w-5 h-5 text-gray-600" />
      </button>

      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 md:hidden"
        />
      )}

      <div
        className={`
          fixed md:static top-0 left-0 h-screen bg-white flex flex-col
          w-full md:w-64 transition-transform duration-300 z-50
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        <div className="flex flex-col h-full pl-4 pr-3 py-4 overflow-hidden">
          <div className="flex items-center justify-between mb-6 pl-1">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold text-blue-600">Patungan</h2>
              </div>
              <p className="text-xs text-gray-500">Kelola grup patungan</p>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="md:hidden p-1.5 hover:bg-gray-100 rounded-lg transition"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>

          <button
            onClick={() => {
              setShowModal(true);
              setOpen(false);
            }}
            className="bg-blue-500  mx-1 mb-5 py-2.5 px-4 rounded-xl text-sm font-semibold transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-md shadow-blue-100 hover:shadow-blue-200"
          >
            <span className="text-white text-lg leading-none mb-0.5">+</span>
            <span className="text-white">Buat Grup Baru</span>
          </button>

          <NavLink
            to="/dashboard"
            onClick={() => {
              setOpen(false);
              listRef.current?.scrollTo({ behavior: "smooth", top: 0 });
            }}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all mb-1 group relative
              ${
                isActive
                  ? "bg-blue-50 text-blue-600 shadow-sm"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-blue-500 rounded-full -ml-1" />
                )}
                <div
                  className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all ${isActive ? "bg-blue-100" : "bg-gray-100 group-hover:bg-blue-50"}`}
                >
                  <LayoutDashboard
                    className={`w-4 h-4 ${isActive ? "text-blue-600" : "text-gray-500 group-hover:text-blue-500"}`}
                  />
                </div>
                <span className="text-sm font-medium">Dashboard</span>
                {isActive && (
                  <ChevronRight size={14} className="ml-auto text-blue-400" />
                )}
              </>
            )}
          </NavLink>

          <div className="flex items-center justify-between px-3 mt-3 mb-2">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              Grup
            </p>
            {!isLoading && groupList.length > 0 && (
              <span className="text-[10px] font-semibold text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full">
                {groupList.length}
              </span>
            )}
          </div>

          <div
            ref={listRef}
            className="flex flex-col gap-0.5 overflow-y-auto flex-1 sidebar-scrollbar pr-0.5"
          >
            {isLoading && (
              <div className="flex flex-col gap-1.5 px-2 py-1">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="h-10 bg-gray-100 rounded-xl animate-pulse"
                    style={{ opacity: 1 - i * 0.25 }}
                  />
                ))}
              </div>
            )}

            {!isLoading && groupList.length === 0 && (
              <div className="flex flex-col items-center gap-2 py-8 px-4 text-center">
                <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                  <span className="text-xl">📂</span>
                </div>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Belum ada grup.
                  <br />
                  Buat grup pertamamu!
                </p>
              </div>
            )}

            {!isLoading &&
              groupList.map((group) => {
                const Icon = ICON_OPTIONS.find(
                  (i) => i.id === group.icon,
                )?.icon;
                return (
                  <div key={group._id} className="relative group/item">
                    <NavLink
                      onClick={() => setOpen(false)}
                      to={`/groups/${group._id}`}
                      ref={(el) => (groupRefs.current[group._id] = el)}
                      className={({ isActive }) =>
                        `flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all pr-9 relative
                        ${
                          isActive
                            ? "bg-blue-50 text-blue-700 shadow-sm"
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          {isActive && (
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-blue-500 rounded-full -ml-1" />
                          )}
                          <div
                            className={`w-8 h-8 flex items-center justify-center rounded-lg shrink-0 ${group.color}`}
                          >
                            {Icon && <Icon className="w-4 h-4 stroke-2" />}
                          </div>
                          <span className="truncate text-sm font-medium">
                            {group.name}
                          </span>
                        </>
                      )}
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
              className="mt-3 pt-3 border-t border-gray-100 relative"
              ref={menuRef}
            >
              {!allLinked && (
                <button
                  onClick={() => {
                    if (!hasGoogle) setLinkingProvider("google");
                    else if (!hasTelegram) setLinkingProvider("telegram");
                  }}
                  className="w-full mb-2 px-3 py-2 rounded-xl bg-amber-50 border border-amber-100 flex items-center gap-2 hover:bg-amber-100 transition-all group/badge"
                >
                  <div className="w-5 h-5 rounded-full bg-amber-200 flex items-center justify-center shrink-0">
                    <span className="text-amber-700 text-[10px] font-bold">
                      !
                    </span>
                  </div>
                  <p className="text-xs text-amber-700 font-medium flex-1 text-left">
                    {linkedCount}/2 akun tertaut
                  </p>
                  <ChevronRight
                    size={12}
                    className="text-amber-400 group-hover/badge:translate-x-0.5 transition-transform"
                  />
                </button>
              )}

              <div
                className={`flex items-center gap-2.5 px-2.5 py-2 rounded-xl transition-all cursor-pointer ${menuOpen ? "bg-gray-100" : "hover:bg-gray-50"}`}
                onClick={() => setMenuOpen((prev) => !prev)}
              >
                <div className="relative shrink-0">
                  {user?.avatar ? (
                    <img
                      src={
                        user.avatar.includes("googleusercontent.com")
                          ? user.avatar.replace(/=s\d+-c/, "=s40-c")
                          : user.avatar
                      }
                      alt={user?.username}
                      className="w-9 h-9 rounded-xl object-cover ring-2 ring-white shadow-sm"
                    />
                  ) : (
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-md ring-2 ring-white"
                      style={{
                        background: `linear-gradient(135deg, ${gradStart}, ${gradEnd})`,
                      }}
                    >
                      {user?.username?.charAt(0)?.toUpperCase() || "?"}
                    </div>
                  )}
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-400 border-2 border-white rounded-full shadow-sm" />
                </div>

                <div className="flex flex-col justify-center min-w-0 flex-1">
                  <span className="text-gray-800 font-semibold text-sm truncate leading-tight">
                    {user?.username}
                  </span>
                  {(user?.firstName || user?.lastName) && (
                    <span className="text-gray-400 text-[11px] truncate leading-tight">
                      {[user.firstName, user.lastName]
                        .filter(Boolean)
                        .join(" ")}
                    </span>
                  )}
                </div>

                <MoreVertical
                  size={15}
                  className={`shrink-0 transition-colors ${menuOpen ? "text-gray-600" : "text-gray-300"}`}
                />
              </div>

              {menuOpen && (
                <div className="menu-enter absolute bottom-full left-0 right-0 mb-2 bg-white border border-gray-100 rounded-2xl shadow-2xl overflow-hidden">
                  {!allLinked && (
                    <>
                      <div className="px-3 pt-3 pb-1">
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider px-1 mb-1.5">
                          Tautkan Akun
                        </p>
                        {!hasGoogle && (
                          <button
                            onClick={() => {
                              setMenuOpen(false);
                              setLinkingProvider("google");
                            }}
                            className="w-full flex items-center gap-2.5 px-2.5 py-2 text-sm rounded-xl hover:bg-blue-50 transition text-left group/btn"
                          >
                            <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                              <svg viewBox="0 0 24 24" className="w-4 h-4">
                                <path
                                  fill="#4285F4"
                                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                />
                                <path
                                  fill="#34A853"
                                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                />
                                <path
                                  fill="#FBBC05"
                                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                />
                                <path
                                  fill="#EA4335"
                                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                />
                              </svg>
                            </div>
                            <span className="text-gray-700 font-medium group-hover/btn:text-blue-600 transition-colors">
                              Tautkan Google
                            </span>
                            <Link2
                              size={12}
                              className="ml-auto text-gray-300 group-hover/btn:text-blue-400 transition-colors"
                            />
                          </button>
                        )}
                        {!hasTelegram && (
                          <button
                            onClick={() => {
                              setMenuOpen(false);
                              setLinkingProvider("telegram");
                            }}
                            className="w-full flex items-center gap-2.5 px-2.5 py-2 text-sm rounded-xl hover:bg-sky-50 transition text-left group/btn"
                          >
                            <div className="w-7 h-7 rounded-lg bg-sky-50 flex items-center justify-center shrink-0">
                              <svg
                                viewBox="0 0 24 24"
                                className="w-4 h-4"
                                fill="#0088cc"
                              >
                                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248l-2.012 9.488c-.148.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.17 14.71l-2.95-.924c-.642-.202-.654-.642.136-.95l11.532-4.448c.534-.194 1.002.13.674.86z" />
                              </svg>
                            </div>
                            <span className="text-gray-700 font-medium group-hover/btn:text-sky-600 transition-colors">
                              Tautkan Telegram
                            </span>
                            <Link2
                              size={12}
                              className="ml-auto text-gray-300 group-hover/btn:text-sky-400 transition-colors"
                            />
                          </button>
                        )}
                      </div>
                      <div className="border-t border-gray-100 mx-3 my-1" />
                    </>
                  )}

                  {allLinked && (
                    <>
                      <div className="px-4 py-2.5 flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-green-50 flex items-center justify-center">
                          <Check size={12} className="text-green-500" />
                        </div>
                        <span className="text-xs text-green-600 font-medium">
                          Semua akun tertaut
                        </span>
                      </div>
                      <div className="border-t border-gray-100 mx-3 my-0.5" />
                    </>
                  )}

                  <div className="px-3 py-2">
                    <button
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                      className="w-full flex items-center gap-2.5 px-2.5 py-2 text-sm rounded-xl hover:bg-red-50 transition text-left text-red-500 disabled:opacity-60 group/logout"
                    >
                      {isLoggingOut ? (
                        <svg
                          className="animate-spin h-4 w-4 text-red-400"
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
                        <LogOut
                          size={14}
                          className="shrink-0 group-hover/logout:translate-x-0.5 transition-transform"
                        />
                      )}
                      <span className="font-medium">
                        {isLoggingOut ? "Logging out..." : "Logout"}
                      </span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
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
