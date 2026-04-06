import PropTypes from "prop-types";
import Pill from "./Pill";

function StatusPill({ isZero, isPos }) {
  if (isZero) {
    return (
      <Pill bg="var(--color-bg-tertiary)" color="var(--color-text-secondary)">
        ✅ Sudah lunas
      </Pill>
    );
  }
  if (isPos) {
    return (
      <Pill bg="rgba(74, 222, 128, 0.15)" color="#16A34A">
        💰 Berhak terima
      </Pill>
    );
  }
  return (
    <Pill bg="rgba(248, 113, 113, 0.15)" color="#DC2626">
      ⚠️ Perlu transfer
    </Pill>
  );
}

StatusPill.propTypes = {
  isZero: PropTypes.bool.isRequired,
  isPos: PropTypes.bool.isRequired,
};

export default StatusPill;
