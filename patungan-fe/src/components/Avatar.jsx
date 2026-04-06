import PropTypes from "prop-types";
import { expenseMemberShape } from "../propTypes/memberPropTypes";
import { getMemberUtil } from "../utils/member";

function Avatar({ members, uid, size = 36 }) {
  const m = getMemberUtil(members, uid);

  return (
    <div
      title={m.name}
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: m.light,
        border: `2px solid ${m.color}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: size * 0.45,
        flexShrink: 0,
        userSelect: "none",
      }}
    >
      {m.emoji}
    </div>
  );
}

Avatar.propTypes = {
  members: PropTypes.arrayOf(expenseMemberShape).isRequired,
  uid: PropTypes.string.isRequired,
  size: PropTypes.number,
};

export default Avatar;
