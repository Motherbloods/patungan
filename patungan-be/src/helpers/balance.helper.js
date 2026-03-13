const Balance = require("../models/balance");

const applyBalances = async (group_id, participants, paid_by, total_amount) => {
  for (const p of participants) {
    const isPayer = p.user_id.toString() === paid_by.toString();
    const balanceAmount = isPayer
      ? total_amount - p.share_amount
      : -p.share_amount;

    const balance = await Balance.findOne({ group_id, user_id: p.user_id });
    if (balance) {
      balance.amount += balanceAmount;
      await balance.save();
    } else {
      await Balance.create({
        group_id,
        user_id: p.user_id,
        amount: balanceAmount,
      });
    }
  }
};

const reverseBalances = async (
  group_id,
  participants,
  paid_by,
  total_amount,
) => {
  for (const p of participants) {
    const isPayer = p.user_id.toString() === paid_by.toString();
    const reverseAmount = isPayer
      ? -(total_amount - p.share_amount)
      : p.share_amount;

    const balance = await Balance.findOne({ group_id, user_id: p.user_id });
    if (balance) {
      balance.amount += reverseAmount;
      await balance.save();
    }
  }
};

module.exports = { applyBalances, reverseBalances };
