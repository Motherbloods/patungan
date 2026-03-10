import ICON_OPTIONS from "../../config/icons";
import COLOR_OPTIONS from "../../config/colors";

function GroupInfoStep({
  GroupIcon,
  groupName,
  setGroupName,
  groupIconId,
  setGroupIconId,
  selectedColor,
  setSelectedColor,
  error,
  setError,
}) {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-center">
        <div
          className={`${selectedColor.bg} ${selectedColor.text} w-16 h-16 rounded-2xl flex items-center justify-center shadow-sm transition-all duration-200`}
        >
          {GroupIcon && <GroupIcon className="w-8 h-8 stroke-2 text-current" />}
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
        {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
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
    </div>
  );
}

export default GroupInfoStep;
