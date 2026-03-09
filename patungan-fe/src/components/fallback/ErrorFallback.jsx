function ErrorFallback({ message = "Something went wrong." }) {
  return (
    <div className="min-h-full bg-gray-50 flex items-center justify-center">
      <p className="text-red-500">{message}</p>
    </div>
  );
}
export default ErrorFallback;
