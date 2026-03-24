function SummaryCard({ icon: Icon, label, value, sub, color, bg }) {
  return (
    <div className={`rounded-2xl p-4 flex flex-col gap-3 ${bg}`}>
      <div
        className={`w-9 h-9 rounded-xl flex items-center justify-center ${color} bg-white/60`}
      >
        <Icon style={{ width: 18, height: 18 }} />
      </div>
      <div>
        <p className="text-2xl font-extrabold text-gray-900 leading-none wrap-break-words">
          {value}
        </p>
        <p className="text-xs font-semibold text-secondary mt-1">{label}</p>
        {sub && <p className="text-[11px] text-secondary mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

export default SummaryCard;
