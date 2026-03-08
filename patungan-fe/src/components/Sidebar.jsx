import { LayoutDashboard, Menu, X } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useState } from "react";
import groupList from "../config/group_list";

function Sidebar() {
  const [open, setOpen] = useState(false);
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
        w-full transition-transform duration-300 z-50
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
            className="md:hidden p-2 hover:bg-gray-100 rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <button className="bg-blue-500 hover:bg-blue-600 text-white py-2.5 px-3 rounded-xl mb-6 text-sm font-medium transition shadow-sm">
          + New Group
        </button>

        <NavLink
          to="/dashboard"
          onClick={() => setOpen(false)}
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

        <div className="flex flex-col gap-1 overflow-y-auto">
          {groupList.map((group) => {
            const Icon = group.icon;

            return (
              <NavLink
                key={group.id}
                to={`/groups/${group.id}`}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 p-2 rounded-xl transition group
                  ${isActive ? "bg-blue-100" : "hover:bg-blue-50"}`
                }
              >
                <div
                  className={`w-9 h-9 flex items-center justify-center rounded-lg shrink-0 ${group.color}`}
                >
                  <Icon className="w-5 h-5 stroke-2" />
                </div>

                <span className="truncate text-sm font-medium text-gray-700">
                  {group.name}
                </span>
              </NavLink>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default Sidebar;
