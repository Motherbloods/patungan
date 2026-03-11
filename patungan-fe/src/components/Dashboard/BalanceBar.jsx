import { fmt } from "../../utils/format";

function BalanceBar({ owe, owed }) {
  const total = owe + owed;
  const owedPct = total > 0 ? Math.round((owed / total) * 100) : 50;
  const net = owed - owe;

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
      <div className="flex justify-between items-end mb-3">
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
            Neraca Keuangan
          </p>
          <p className="text-sm text-gray-500 mt-0.5">
            Bersih:{" "}
            <span
              className={`font-bold ${net >= 0 ? "text-emerald-500" : "text-rose-500"}`}
            >
              {net >= 0 ? "+" : "-"}
              {fmt(Math.abs(net))}
            </span>
          </p>
        </div>
        <div className="text-right text-xs text-gray-400">
          <div className="flex items-center gap-1 justify-end mb-0.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
            Terima {fmt(owed)}
          </div>
          <div className="flex items-center gap-1 justify-end">
            <span className="w-2 h-2 rounded-full bg-rose-400 inline-block" />
            Bayar {fmt(owe)}
          </div>
        </div>
      </div>
      <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden flex gap-0.5">
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

export default BalanceBar;
