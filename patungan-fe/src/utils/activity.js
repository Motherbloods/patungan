export const ACTIVITY_LABEL = {
  paid: "Bayar ke",
  received: "Terima dari",
  settlement_paid: "Transfer ke",
  settlement_received: "Terima transfer dari",
};

export const ACTIVITY_ICON = {
  paid: "⬆️",
  received: "⬇️",
  settlement_paid: "⬆️",
  settlement_received: "⬇️",
};

export const ACTIVITY_BG = {
  paid: "#FEE2E2",
  received: "#DCFCE7",
  settlement_paid: "#EDE9FE",
  settlement_received: "#DCFCE7",
};

export const ACTIVITY_COLOR = {
  paid: "#DC2626",
  received: "#16A34A",
  settlement_paid: "#7C3AED",
  settlement_received: "#16A34A",
};

export function formatTime(dateStr) {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}
