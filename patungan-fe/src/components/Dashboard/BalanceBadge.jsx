import PropTypes from "prop-types";
import {
  getBalanceState,
  getBalanceStyle,
  getBalanceText,
} from "../../utils/balance";

function BalanceBadge({ myBalance }) {
  const { hasTag, isPos, isZero } = getBalanceState(myBalance);

  if (!hasTag) {
    return (
      <span className="text-xs font-medium px-2 py-1 rounded-lg bg-tertiary text-secondary">
        —
      </span>
    );
  }

  return (
    <span
      className="text-xs font-bold px-2 py-1 rounded-lg"
      style={{
        ...getBalanceStyle(isZero, isPos),
        fontSize: "clamp(10px, 2.2vw, 12px)",
      }}
    >
      {getBalanceText(myBalance, isZero, isPos)}
    </span>
  );
}

BalanceBadge.propTypes = {
  myBalance: PropTypes.number,
};

BalanceBadge.defaultProps = {
  myBalance: null,
};

export default BalanceBadge;
