import PropTypes from "prop-types";

export const memberShape = PropTypes.shape({
  _id: PropTypes.string,
  name: PropTypes.string,
  emoji: PropTypes.string,
  isActive: PropTypes.bool,
});
