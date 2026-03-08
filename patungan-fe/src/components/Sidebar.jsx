import groupList from "../config/group_list";

function Sidebar() {
  return (
    <div className="w-64 h-screen bg-white p-4 flex flex-col">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-blue-600">Patungan</h2>
        <p className="text-xs text-gray-500">Kelola grup patungan</p>
      </div>

      <button className="bg-blue-500 hover:bg-blue-600 text-white py-2.5 px-3 rounded-xl mb-6 text-sm font-medium transition shadow-sm">
        + New Group
      </button>

      <p className="text-xs font-semibold text-gray-400 uppercase mb-2">
        Groups
      </p>

      <div className="flex flex-col gap-1 overflow-y-auto">
        {groupList.map((group) => {
          const Icon = group.icon;

          return (
            <div
              key={group.id}
              className="flex items-center gap-3 p-2 rounded-xl hover:bg-blue-50 cursor-pointer transition group"
            >
              <div
                className={`w-9 h-9 flex items-center justify-center rounded-lg shrink-0 ${group.color}`}
              >
                <Icon className="w-5 h-5 stroke-2" />
              </div>

              <span className="truncate text-sm font-medium text-gray-700 group-hover:text-gray-900">
                {group.name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Sidebar;
