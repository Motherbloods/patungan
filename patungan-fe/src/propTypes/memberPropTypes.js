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

export const groupCardShape = PropTypes.shape({
  _id: PropTypes.string,
  name: PropTypes.string,
  icon: PropTypes.string,
  color: PropTypes.string,
  myBalance: PropTypes.number,
  member_count: PropTypes.number,
  expense_count: PropTypes.number,
  total_expenses: PropTypes.number,
});

export const activityShape = PropTypes.shape({
  type: PropTypes.string,
  expense: PropTypes.string,
  groupName: PropTypes.string,
  created_at: PropTypes.string,
  amount: PropTypes.number,
});

export const balanceShape = PropTypes.shape({
  user_id: PropTypes.string,
  amount: PropTypes.number,
});

export const expenseShape = PropTypes.shape({
  _id: PropTypes.string,
  name: PropTypes.string,
  total_amount: PropTypes.number,
  paid_by: PropTypes.string,
  participants: PropTypes.arrayOf(
    PropTypes.shape({
      user_id: PropTypes.string,
      share_amount: PropTypes.number,
    }),
  ),
});

export const transferShape = PropTypes.shape({
  _id: PropTypes.string,
  from: PropTypes.string,
  to: PropTypes.string,
  amount: PropTypes.number,
});

export const groupConfigShape = PropTypes.shape({
  _id: PropTypes.string,
  name: PropTypes.string,
  icon: PropTypes.string,
  color: PropTypes.string,
  expense_count: PropTypes.number,
  member_count: PropTypes.number,
  total_expenses: PropTypes.number,
  myBalance: PropTypes.number,
});
