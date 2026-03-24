function InfoBox({ title = "💡 Gimana cara hitung ini?", children }) {
  return (
    <div
      className="rounded-2xl p-4"
      style={{
        background: "rgba(59, 130, 246, 0.08)",
        border: "1.5px solid rgba(96, 165, 250, 0.4)",
      }}
    >
      <div
        className="font-bold text-sm mb-2"
        style={{ color: "var(--color-blue)" }}
      >
        {title}
      </div>
      <p
        className="text-xs leading-relaxed m-0"
        style={{ color: "rgba(96, 165, 250, 0.9)" }}
      >
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
