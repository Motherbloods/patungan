function NotFoundFallback({ message = "Not found." }) {
  return (
    <div
      className="min-h-full flex items-center justify-center"
      style={{ backgroundColor: "var(--color-bg-secondary)" }}
    >
      <p style={{ color: "var(--color-text-secondary)" }}>{message}</p>
    </div>
  );
}
export default NotFoundFallback;
