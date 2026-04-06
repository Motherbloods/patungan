import PropTypes from "prop-types";
import ICON_OPTIONS from "../../config/icons";
import COLOR_OPTIONS from "../../config/colors";
import { colorShape } from "../../propTypes/memberPropTypes";

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
  const iconItem = ICON_OPTIONS.find((item) => item.id === GroupIcon);
  const Icon = iconItem.icon;
  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-center">
        <div
          className={`${selectedColor.bg} ${selectedColor.text} w-16 h-16 rounded-2xl flex items-center justify-center shadow-sm transition-all duration-200`}
        >
          {Icon && <Icon className="w-8 h-8 stroke-2 text-current" />}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="group-name-input"
          className="text-xs font-semibold uppercase tracking-wide"
          style={{ color: "var(--color-text-secondary)" }}
        >
          Nama Grup
        </label>
        <input
          id="group-name-input"
          type="text"
          placeholder="cth. Liburan Bandung, Kos Bareng..."
          value={groupName}
          onChange={(e) => {
            setGroupName(e.target.value);
            setError("");
          }}
          style={{
            backgroundColor: "var(--color-bg-primary)",
            color: "var(--color-text-primary)",
            borderColor: "var(--color-border)",
          }}
          className="w-full rounded-xl px-4 py-2.5 text-sm border placeholder:text-(--color-text-secondary) focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition"
          autoFocus
        />
        {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
      </div>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="group-icon-grid"
          className="text-xs font-semibold uppercase tracking-wide"
          style={{ color: "var(--color-text-secondary)" }}
        >
          Ikon
        </label>
        <div id="group-icon-grid" className="grid grid-cols-6 gap-2">
          {ICON_OPTIONS.map(({ id, icon: Icon, label }) => {
            const active = groupIconId === id;
            return (
              <button
                key={id}
                title={label}
                aria-label={label}
                onClick={() => setGroupIconId(id)}
                style={
                  active
                    ? {}
                    : {
                        borderColor: "var(--color-border)",
                        color: "var(--color-text-secondary)",
                      }
                }
                className={`aspect-square flex items-center justify-center rounded-xl border-2 transition-all ${
                  active
                    ? `${selectedColor.bg} ${selectedColor.text} border-current`
                    : "hover:border-(--color-text-secondary)"
                }`}
              >
                <Icon className="w-5 h-5 stroke-2" />
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="group-color-picker"
          className="text-xs font-semibold uppercase tracking-wide"
          style={{ color: "var(--color-text-secondary)" }}
        >
          Warna
        </label>
        <div id="group-color-picker" className="flex gap-2 flex-wrap">
          {COLOR_OPTIONS.map((c) => (
            <button
              key={c.id}
              aria-label={c.text}
              onClick={() => setSelectedColor(c)}
              style={
                selectedColor.id === c.id
                  ? { borderColor: "var(--color-text-primary)" }
                  : {}
              }
              className={`w-8 h-8 rounded-full border-2 transition-all ${c.bg} ${
                selectedColor.id === c.id
                  ? "scale-110 shadow-md"
                  : "border-transparent hover:scale-105"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

GroupInfoStep.propTypes = {
  GroupIcon: PropTypes.string.isRequired,
  groupName: PropTypes.string.isRequired,
  setGroupName: PropTypes.func.isRequired,
  groupIconId: PropTypes.string.isRequired,
  setGroupIconId: PropTypes.func.isRequired,
  selectedColor: colorShape.isRequired,
  setSelectedColor: PropTypes.func.isRequired,
  error: PropTypes.string,
  setError: PropTypes.func.isRequired,
};

GroupInfoStep.defaultProps = {
  error: "",
};

export default GroupInfoStep;
