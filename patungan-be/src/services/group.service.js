const mongoose = require("mongoose");
const Group = require("../models/group");
const Expense = require("../models/expense");
const Balance = require("../models/balance");
const History = require("../models/history");
const Settlement = require("../models/settlement");
const { applyBalances, reverseBalances } = require("../helpers/balance.helper");
const {
  pushExpenseHistory,
  getOrCreateGroupHistory,
  updateExpenseNameInHistory,
  removeExpenseHistory,
} = require("../helpers/history.helper");

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

  await applyBalances(group_id, updatedParticipants, paid_by, total_amount);

  const groupHistory = await getOrCreateGroupHistory(group_id);
  pushExpenseHistory(
    groupHistory,
    updatedParticipants,
    paid_by,
    name,
    expense._id,
  );
  await groupHistory.save();

  await Group.findByIdAndUpdate(
    new mongoose.Types.ObjectId(group_id),
    { $inc: { total_expenses: total_amount, expense_count: 1 } },
    { new: true },
  );

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
    await reverseBalances(
      group_id,
      oldExpense.participants,
      oldExpense.paid_by,
      oldExpense.total_amount,
    );

    const groupHistory = await getOrCreateGroupHistory(group_id);
    removeExpenseHistory(groupHistory, oldExpense._id);
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

    await applyBalances(group_id, updatedParticipants, paid_by, total_amount);

    pushExpenseHistory(
      groupHistory,
      updatedParticipants,
      paid_by,
      name,
      updatedExpense._id,
    );
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

    const groupHistory = await getOrCreateGroupHistory(group_id);
    updateExpenseNameInHistory(groupHistory, expense_id, name);
    await groupHistory.save();

    return updatedExpense;
  }
};

const deleteGroupService = async (group_id) => {
  const session = await mongoose.startSession();

  try {
    await session.withTransaction(async () => {
      const group = await Group.findById(group_id).session(session);
      if (!group) {
        throw new Error("Group not found");
      }

      await Expense.deleteMany({ group_id }).session(session);
      await Balance.deleteMany({ group_id }).session(session);
      await History.deleteMany({ group_id }).session(session);
      await Settlement.deleteMany({ group_id }).session(session);

      await Group.findByIdAndDelete(group_id).session(session);
    });
  } finally {
    session.endSession();
  }

  return { message: "Group and related data deleted successfully" };
};

const deleteExpenseService = async (group_id, expense_id) => {
  if (!group_id || !expense_id) {
    throw new Error(
      "All required fields must be provided: group_id, expense_id",
    );
  }

  const expense = await Expense.findById(expense_id);
  if (!expense) throw new Error("Expense Not Found");

  await reverseBalances(
    group_id,
    expense.participants,
    expense.paid_by,
    expense.total_amount,
  );

  const groupHistory = await History.findOne({ group_id });
  if (groupHistory) {
    removeExpenseHistory(groupHistory, expense._id);
    await groupHistory.save();
  }

  await Expense.findByIdAndDelete(expense_id);

  await Group.findByIdAndUpdate(
    new mongoose.Types.ObjectId(group_id),
    { $inc: { total_expenses: -expense.total_amount, expense_count: -1 } },
    { new: true },
  );

  return { message: "Expense deleted successfully" };
};

module.exports = {
  createGroupService,
  createExpenseService,
  getGroupDataService,
  editGroupService,
  editExpenseService,
  deleteGroupService,
  deleteExpenseService,
};
