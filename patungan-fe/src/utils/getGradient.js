export function getGradient(username = "") {
  const colors = [
    ["#6366f1", "#8b5cf6"],
    ["#3b82f6", "#06b6d4"],
    ["#10b981", "#34d399"],
    ["#f59e0b", "#f97316"],
    ["#ec4899", "#f43f5e"],
  ];
  const idx = (username.charCodeAt(0) || 0) % colors.length;
  return colors[idx];
}
