import PropTypes from "prop-types";

function LoadingFallback({ message = "Loading..." }) {
  return (
    <div
      className="min-h-full flex items-center justify-center"
      style={{ backgroundColor: "var(--color-bg-secondary)" }}
    >
      <p style={{ color: "var(--color-text-secondary)" }}>{message}</p>
    </div>
  );
}

LoadingFallback.propTypes = {
  message: PropTypes.string,
};

export default LoadingFallback;
