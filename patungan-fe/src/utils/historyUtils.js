export const HISTORY_LABEL = (members, h, getNameUtil) => {
  const isIncoming = h.type === "received" || h.type === "settlement_received";
  const other = isIncoming ? h.from : h.to;
  const otherName = getNameUtil(members, other);

  return (
    {
      received: `Menerima dari ${otherName}`,
      paid: `Bayar ke ${otherName}`,
      settlement_received: `Terima transfer dari ${otherName}`,
      settlement_paid: `Transfer ke ${otherName}`,
    }[h.type] ?? h.type
  );
};

export const EXPENSE_EMOJI = (name = "") => {
  const lower = name.toLowerCase();

  if (lower.includes("makan")) return "🍽️";
  if (lower.includes("transport") || lower.includes("bensin")) return "🚗";
  if (lower.includes("kopi") || lower.includes("snack")) return "☕";

  return "🧾";
};
