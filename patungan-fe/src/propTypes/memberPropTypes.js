import PropTypes from "prop-types";

export const memberShape = PropTypes.shape({
  _id: PropTypes.string,
  name: PropTypes.string,
  emoji: PropTypes.string,
  isActive: PropTypes.bool,
});

export const expenseMemberShape = PropTypes.shape({
  _id: PropTypes.string,
  name: PropTypes.string,
  emoji: PropTypes.string,
  color: PropTypes.string,
  light: PropTypes.string,
});

export const initialExpenseShape = PropTypes.shape({
  name: PropTypes.string,
  total_amount: PropTypes.number,
  paid_by: PropTypes.string,
  split_method: PropTypes.string,
  participants: PropTypes.arrayOf(
    PropTypes.shape({
      user_id: PropTypes.string,
      share_amount: PropTypes.number,
    }),
  ),
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
