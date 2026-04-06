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
