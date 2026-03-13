const History = require("../models/history");

const getOrCreateUserHistory = (groupHistory, userId) => {
  let userHistory = groupHistory.histories.find(
    (h) => h.user_id.toString() === userId.toString(),
  );
  if (!userHistory) {
    groupHistory.histories.push({ user_id: userId, history: [] });
    userHistory = groupHistory.histories[groupHistory.histories.length - 1];
  }
  return userHistory;
};

const pushExpenseHistory = (
  groupHistory,
  participants,
  paid_by,
  name,
  expense_id,
) => {
  for (const p of participants) {
    if (p.user_id.toString() === paid_by.toString()) continue;

    const payerHistory = getOrCreateUserHistory(groupHistory, paid_by);
    payerHistory.history.push({
      type: "received",
      from: p.user_id,
      to: paid_by,
      amount: p.share_amount,
      expense: name,
      expense_id,
    });

    const participantHistory = getOrCreateUserHistory(groupHistory, p.user_id);
    participantHistory.history.push({
      type: "paid",
      from: p.user_id,
      to: paid_by,
      amount: p.share_amount,
      expense: name,
      expense_id,
    });
  }
};

const removeExpenseHistory = (groupHistory, expense_id) => {
  for (const userHistory of groupHistory.histories) {
    userHistory.history = userHistory.history.filter(
      (h) => !h.expense_id || h.expense_id.toString() !== expense_id.toString(),
    );
  }
};

const updateExpenseNameInHistory = (groupHistory, expense_id, newName) => {
  for (const userHistory of groupHistory.histories) {
    for (const item of userHistory.history) {
      if (
        item.expense_id &&
        item.expense_id.toString() === expense_id.toString()
      ) {
        item.expense = newName;
      }
    }
  }
};

const getOrCreateGroupHistory = async (group_id, session) => {
  let groupHistory = await History.findOne({ group_id }).session(session);
  if (!groupHistory) {
    groupHistory = new History({ group_id, histories: [] });
  }
  return groupHistory;
};

module.exports = {
  getOrCreateUserHistory,
  pushExpenseHistory,
  removeExpenseHistory,
  updateExpenseNameInHistory,
  getOrCreateGroupHistory,
};
