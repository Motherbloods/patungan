function InfoBox({ title = "💡 Gimana cara hitung ini?", children }) {
  return (
    <div
      className="rounded-2xl p-4"
      style={{ background: "#EFF6FF", border: "1.5px solid #BFDBFE" }}
    >
      <div className="font-bold text-sm mb-2" style={{ color: "#1D4ED8" }}>
        {title}
      </div>
      <p className="text-xs leading-relaxed m-0" style={{ color: "#3B82F6" }}>
        {children ?? (
          <>
            Semua hutang-piutang digabung jadi{" "}
            <strong>transfer sesedikit mungkin</strong>. Misalnya kalau A hutang
            ke B, dan B hutang ke C — sistem otomatis jadiin A langsung transfer
            ke C. Lebih efisien!
          </>
        )}
      </p>
    </div>
  );
}

export default InfoBox;
