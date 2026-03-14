const Balance = require("../models/balance");

const applyBalances = async (
  group_id,
  participants,
  paid_by,
  total_amount,
  session,
) => {
  for (const p of participants) {
    const isPayer = p.user_id.toString() === paid_by.toString();
    const balanceAmount = isPayer
      ? total_amount - p.share_amount
      : -p.share_amount;

    const balance = await Balance.findOne({
      group_id,
      user_id: p.user_id,
    }).session(session);
    if (balance) {
      balance.amount += balanceAmount;
      await balance.save({ session });
    } else {
      await Balance.create(
        [{ group_id, user_id: p.user_id, amount: balanceAmount }],
        { session },
      );
    }
  }
};

const reverseBalances = async (
  group_id,
  participants,
  paid_by,
  total_amount,
  session,
) => {
  for (const p of participants) {
    const isPayer = p.user_id.toString() === paid_by.toString();
    const reverseAmount = isPayer
      ? -(total_amount - p.share_amount)
      : p.share_amount;

    const balance = await Balance.findOne({
      group_id,
      user_id: p.user_id,
    }).session(session);
    if (!balance) {
      throw new Error(
        `Balance not found for user ${p.user_id} in group ${group_id}. Data may be corrupted.`,
      );
    }
    balance.amount += reverseAmount;
    await balance.save({ session });
  }
};

module.exports = { applyBalances, reverseBalances };
