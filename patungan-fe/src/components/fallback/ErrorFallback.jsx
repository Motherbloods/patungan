function ErrorFallback({ message = "Something went wrong." }) {
  return (
    <div
      className="min-h-full flex items-center justify-center"
      style={{ backgroundColor: "var(--color-bg-secondary)" }}
    >
      <p className="text-red-500">{message}</p>
    </div>
  );
}
export default ErrorFallback;
