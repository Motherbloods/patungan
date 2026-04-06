import { fmt } from "./format";

export function getBalanceState(myBalance) {
  const hasTag = myBalance !== null;
  const isPos = hasTag && myBalance > 0;
  const isZero = hasTag && myBalance === 0;
  return { hasTag, isPos, isZero };
}

export function getBalanceStyle(isZero, isPos) {
  if (isZero) return { background: "#F3F4F6", color: "#9CA3AF" };
  if (isPos) return { background: "#DCFCE7", color: "#16A34A" };
  return { background: "#FEE2E2", color: "#DC2626" };
}

export function getBalanceText(myBalance, isZero, isPos) {
  if (isZero) return "Lunas";
  const sign = isPos ? "+" : "-";
  return sign + fmt(Math.abs(myBalance));
}

export function getBorderColor(isOwner, isZero, isPos) {
  if (isOwner) return "rgba(96, 165, 250, 0.5)";
  if (isZero) return "var(--color-border)";
  if (isPos) return "rgba(74, 222, 128, 0.5)";
  return "rgba(248, 113, 113, 0.5)";
}

export function getAmountColor(isZero, isPos) {
  if (isZero) return "var(--color-text-secondary)";
  if (isPos) return "#16A34A";
  return "#DC2626";
}

export function getAmountLabel(isZero, isPos) {
  if (isZero) return "selesai";
  if (isPos) return "akan diterima";
  return "harus ditransfer";
}

export function getAmountDisplay(isZero, isPos, amount) {
  if (isZero) return "—";
  if (isPos) return `+${fmt(amount)}`;
  return `-${fmt(amount)}`;
}
