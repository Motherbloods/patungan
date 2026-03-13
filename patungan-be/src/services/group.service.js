const mongoose = require("mongoose");
const Group = require("../models/group");
const Expense = require("../models/expense");
const Balance = require("../models/balance");
const History = require("../models/history");
const Settlement = require("../models/settlement");

const createGroupService = async (data) => {
  const { groupName, groupIcon, groupColor, groupIconColor, members } = data;
  console.log(data);

  if (
    !groupName ||
    !groupIcon ||
    !groupColor ||
    !groupIconColor ||
    !members ||
    members.length === 0
  ) {
    throw new Error(
      "All required fields must be provided: groupName, groupIcon, groupColor, groupIconColor, members",
    );
  }

  const formattedMembers = members.map((member) => {
    const palette = MEMBER_COLORS[index % MEMBER_COLORS.length];
    return {
      name: member.name,
      emoji: member.emoji || "",
      color: palette.color,
      light: palette.light,
    };
  });

  const group = new Group({
    name: groupName,
    icon: groupIcon,
    color: `${groupColor} ${groupIconColor}`,
    total_expenses: 0,
    expense_count: 0,
    member_count: formattedMembers.length,
    members: formattedMembers,
  });

  await group.save();
  return group;
};

const createExpenseService = async (data) => {
  const { group_id, name, total_amount, paid_by, participants, split_method } =
    data;

  if (
    !group_id ||
    !name ||
    !total_amount ||
    !paid_by ||
    !participants ||
    !split_method
  ) {
    throw new Error(
      "All required fields must be provided: name, total_amount, paid_by, participants, split_method",
    );
  }

  if (typeof total_amount !== "number" || total_amount <= 0) {
    throw new Error("total_amount must be a number greater than 0");
  }

  if (!Array.isArray(participants) || participants.length === 0) {
    throw new Error("participants must be a non-empty array");
  }

  participants.forEach((p, index) => {
    if (!p.user_id) {
      throw new Error(`Participant at index ${index} must have a user_id`);
    }
    if (typeof p.share_amount !== "number") {
      throw new Error(
        `Participant at index ${index} must have share_amount as number`,
      );
    }
  });

  const allowedSplitMethods = ["bagi-rata", "custom"];
  if (!allowedSplitMethods.includes(split_method)) {
    throw new Error(
      `split_method must be one of: ${allowedSplitMethods.join(", ")}`,
    );
  }

  // normalisasi total amount
  const totalShare = participants.reduce((sum, p) => sum + p.share_amount, 0);
  const roundingDiff = total_amount - totalShare;

  const updatedParticipants = participants.map((p) =>
    p.user_id.toString() === paid_by.toString()
      ? { ...p, share_amount: p.share_amount + roundingDiff }
      : p,
  );

  const expense = await Expense.create({
    group_id,
    name,
    total_amount,
    paid_by,
    participants: updatedParticipants,
    split_method,
    createdAt: new Date(),
  });

  for (const p of updatedParticipants) {
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

  let groupHistory = await History.findOne({ group_id });
  if (!groupHistory) {
    groupHistory = new History({ group_id, histories: [] });
  }

  const getOrCreateUserHistory = (userId) => {
    let userHistory = groupHistory.histories.find(
      (h) => h.user_id.toString() === userId.toString(),
    );
    if (!userHistory) {
      groupHistory.histories.push({ user_id: userId, history: [] });
      userHistory = groupHistory.histories[groupHistory.histories.length - 1];
    }
    return userHistory;
  };

  for (const p of updatedParticipants) {
    if (p.user_id.toString() === paid_by.toString()) continue;

    const payerHistory = getOrCreateUserHistory(paid_by);
    payerHistory.history.push({
      type: "received",
      from: p.user_id,
      to: paid_by,
      amount: p.share_amount,
      expense: name,
      expense_id: expense._id,
    });

    const participantHistory = getOrCreateUserHistory(p.user_id);
    participantHistory.history.push({
      type: "paid",
      from: p.user_id,
      to: paid_by,
      amount: p.share_amount,
      expense: name,
      expense_id: expense._id,
    });
  }

  await groupHistory.save();

  const groupupdete = await Group.findByIdAndUpdate(
    new mongoose.Types.ObjectId(group_id),
    {
      $inc: { total_expenses: total_amount, expense_count: 1 },
    },
    { new: true },
  );
  console.log(groupupdete);

  return expense;
};

const getGroupOrThrow = async (group_id) => {
  const group = await Group.findById(group_id).lean();
  if (!group) throw new Error("Group not found");
  return group;
};

const getGroupDataService = async (group_id, options = {}) => {
  const group = await getGroupOrThrow(group_id);
  const result = { members: group.members };

  if (options.balances) {
    result.balances = await Balance.find({ group_id }).lean();
  }

  if (options.expenses) {
    result.expenses = await Expense.find({ group_id }).lean();
  }

  if (options.settlements) {
    result.settlements = await Settlement.find({ group_id }).lean();
  }

  if (options.history) {
    result.history = await History.find({ group_id }).lean();
  }

  return result;
};

const editGroupService = async (group_id, data) => {
  const { groupName, groupIcon, groupColor, members } = data;

  const group = await Group.findByIdAndUpdate(
    group_id,
    {
      name: groupName,
      icon: groupIcon,
      color: groupColor,
      members,
    },
    {
      new: true,
      runValidators: true,
    },
  );

  return group;
};

const editExpenseService = async (group_id, expense_id, data) => {
  const { name, total_amount, paid_by, participants, split_method } = data;

  // validasi input
  if (
    !group_id ||
    !expense_id ||
    !name ||
    !total_amount ||
    !paid_by ||
    !participants ||
    !split_method
  ) {
    throw new Error(
      "All required fields must be provided: group_id, expense_id, name, total_amount, paid_by, participants, split_method",
    );
  }

  if (typeof total_amount !== "number" || total_amount <= 0) {
    throw new Error("total_amount must be a number greater than 0");
  }

  if (!Array.isArray(participants) || participants.length === 0) {
    throw new Error("participants must be a non-empty array");
  }

  participants.forEach((p, index) => {
    if (!p.user_id) {
      throw new Error(`Participant at index ${index} must have a user_id`);
    }
    if (typeof p.share_amount !== "number") {
      throw new Error(
        `Participant at index ${index} must have share_amount as number`,
      );
    }
  });

  const allowedSplitMethods = ["bagi-rata", "custom"];
  if (!allowedSplitMethods.includes(split_method)) {
    throw new Error(
      `split_method must be one of: ${allowedSplitMethods.join(", ")}`,
    );
  }

  const oldExpense = await Expense.findById(expense_id);
  if (!oldExpense) throw new Error("Expense Not Found");

  const isCalculationChanged =
    oldExpense.total_amount !== total_amount ||
    oldExpense.paid_by.toString() !== paid_by.toString() ||
    oldExpense.split_method !== split_method ||
    JSON.stringify(
      oldExpense.participants.map((p) => ({
        id: p.user_id.toString(),
        share: p.share_amount,
      })),
    ) !==
      JSON.stringify(
        participants.map((p) => ({
          id: p.user_id.toString(),
          share: p.share_amount,
        })),
      );

  if (isCalculationChanged) {
    for (const p of oldExpense.participants) {
      const isPayer = p.user_id.toString() === oldExpense.paid_by.toString();
      const reverseAmount = isPayer
        ? -(oldExpense.total_amount - p.share_amount)
        : p.share_amount;

      const balance = await Balance.findOne({ group_id, user_id: p.user_id });
      if (balance) {
        balance.amount += reverseAmount;
        await balance.save();
      }
    }

    let groupHistory = await History.findOne({ group_id });
    if (!groupHistory) {
      groupHistory = new History({ group_id, histories: [] });
    }

    for (const userHistory of groupHistory.histories) {
      userHistory.history = userHistory.history.filter(
        (h) =>
          !h.expense_id ||
          h.expense_id.toString() !== oldExpense._id.toString(),
      );
    }

    const totalShare = participants.reduce((sum, p) => sum + p.share_amount, 0);
    const roundingDiff = total_amount - totalShare;

    const updatedParticipants = participants.map((p) =>
      p.user_id.toString() === paid_by.toString()
        ? { ...p, share_amount: p.share_amount + roundingDiff }
        : p,
    );

    const updatedExpense = await Expense.findByIdAndUpdate(
      expense_id,
      {
        name,
        total_amount,
        paid_by,
        participants: updatedParticipants,
        split_method,
      },
      { new: true },
    );

    for (const p of updatedParticipants) {
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

    const getOrCreateUserHistory = (userId) => {
      let userHistory = groupHistory.histories.find(
        (h) => h.user_id.toString() === userId.toString(),
      );
      if (!userHistory) {
        groupHistory.histories.push({ user_id: userId, history: [] });
        userHistory = groupHistory.histories[groupHistory.histories.length - 1];
      }
      return userHistory;
    };

    for (const p of updatedParticipants) {
      if (p.user_id.toString() === paid_by.toString()) continue;

      const payerHistory = getOrCreateUserHistory(paid_by);
      payerHistory.history.push({
        type: "received",
        from: p.user_id,
        to: paid_by,
        amount: p.share_amount,
        expense: name,
        expense_id: updatedExpense._id,
      });

      const participantHistory = getOrCreateUserHistory(p.user_id);
      participantHistory.history.push({
        type: "paid",
        from: p.user_id,
        to: paid_by,
        amount: p.share_amount,
        expense: name,
        expense_id: updatedExpense._id,
      });
    }

    await groupHistory.save();

    const diff = total_amount - oldExpense.total_amount;
    await Group.findByIdAndUpdate(
      new mongoose.Types.ObjectId(group_id),
      { $inc: { total_expenses: diff } },
      { new: true },
    );

    return updatedExpense;
  } else {
    const updatedExpense = await Expense.findByIdAndUpdate(
      expense_id,
      { name },
      { new: true },
    );
    return updatedExpense;
  }
};

const deleteExpenseService = async (data) => {};

module.exports = {
  createGroupService,
  createExpenseService,
  getGroupDataService,
  editGroupService,
  editExpenseService,
};
