function NotFoundFallback({ message = "Not found." }) {
  return (
    <div className="min-h-full bg-gray-50 flex items-center justify-center">
      <p className="text-gray-400">{message}</p>
    </div>
  );
}
export default NotFoundFallback;
