import PropTypes from "prop-types";

export const memberShape = PropTypes.shape({
  _id: PropTypes.string,
  name: PropTypes.string,
  emoji: PropTypes.string,
  isActive: PropTypes.bool,
});

export const colorShape = PropTypes.shape({
  id: PropTypes.string,
  bg: PropTypes.string,
  text: PropTypes.string,
});

export const groupShape = PropTypes.shape({
  _id: PropTypes.string,
  name: PropTypes.string,
  icon: PropTypes.string,
  color: PropTypes.string,
  ownerMemberId: PropTypes.string,
  members: PropTypes.arrayOf(memberShape),
});
