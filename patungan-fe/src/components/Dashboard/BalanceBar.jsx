import PropTypes from "prop-types";
import { fmt } from "../../utils/format";

function BalanceBar({ owe, owed }) {
  const total = owe + owed;
  const owedPct = total > 0 ? Math.round((owed / total) * 100) : 50;
  const net = owed - owe;

  return (
    <div className="bg-primary rounded-2xl p-5 shadow-sm border border-custom">
      <div className="flex justify-between items-end mb-3">
        <div>
          <p className="text-xs font-semibold text-secondary uppercase tracking-wide">
            Neraca Keuangan
          </p>
          <p
            className="text-sm text-secondary mt-0.5"
            style={{ fontSize: "clamp(12px, 2.5vw, 14px)" }}
          >
            Bersih:{" "}
            <span
              className={`font-bold ${net >= 0 ? "text-emerald-500" : "text-rose-500"}`}
              style={{ fontSize: "clamp(14px, 3vw, 18px)" }}
            >
              {net >= 0 ? "+" : "-"}
              {fmt(Math.abs(net))}
            </span>
          </p>
        </div>
        <div className="text-right text-xs text-secondary">
          <div
            className="flex items-center gap-1 justify-end mb-0.5"
            style={{ fontSize: "clamp(11px, 2.2vw, 13px)" }}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
            Terima {fmt(owed)}
          </div>
          <div
            className="flex items-center gap-1 justify-end"
            style={{ fontSize: "clamp(11px, 2.2vw, 13px)" }}
          >
            <span className="w-2 h-2 rounded-full bg-rose-400 inline-block" />
            Bayar {fmt(owe)}
          </div>
        </div>
      </div>
      <div className="w-full h-3 bg-tertiary rounded-full overflow-hidden flex gap-0.5">
        <div
          className="h-full bg-emerald-400 rounded-full transition-all duration-700"
          style={{ width: `${owedPct}%` }}
        />
        <div
          className="h-full bg-rose-400 rounded-full transition-all duration-700"
          style={{ width: `${100 - owedPct}%` }}
        />
      </div>
    </div>
  );
}

BalanceBar.propTypes = {
  owe: PropTypes.number.isRequired,
  owed: PropTypes.number.isRequired,
};

export default BalanceBar;
