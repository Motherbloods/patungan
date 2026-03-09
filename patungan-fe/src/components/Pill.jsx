export default function Pill({ children, color = "#6B7280", bg = "#F3F4F6" }) {
  return (
    <span
      style={{
        background: bg,
        color,
        fontSize: 11,
        fontWeight: 700,
        padding: "2px 8px",
        borderRadius: 99,
      }}
    >
      {children}
    </span>
  );
}
