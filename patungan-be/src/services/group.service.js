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

const {
  validateExpenseInput,
  normalizeParticipants,
} = require("../helpers/expense.validator");
const MEMBER_COLORS = require("../utils/colors");
const logger = require("../utils/logger");
const { isValidObjectId, validateObjectIds } = require("../utils/objectId");

const createGroupService = async (data, user_id) => {
  const { groupName, groupIcon, groupColor, groupIconColor, members } = data;

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

  const formattedMembers = members.map((member, index) => {
    const palette = MEMBER_COLORS[index % MEMBER_COLORS.length];
    return {
      name: member.name,
      emoji: member.emoji || "",
      color: palette.color,
      light: palette.light,
      isActive: true,
    };
  });

  const group = new Group({
    name: groupName,
    icon: groupIcon,
    color: `${groupColor} ${groupIconColor}`,
    total_expenses: 0,
    expense_count: 0,
    member_count: formattedMembers.length,
    createdBy: user_id,
    members: formattedMembers,
  });

  await group.save();
  logger.info(`Group created: ${group._id} by user: ${user_id}`);
  return group;
};

const createExpenseService = async (data) => {
  const { group_id, name, total_amount, paid_by, participants, split_method } =
    data;

  if (!group_id) throw new Error("group_id is required");
  validateObjectIds(group_id);
  validateExpenseInput({
    name,
    total_amount,
    paid_by,
    participants,
    split_method,
  });

  const updatedParticipants = normalizeParticipants(
    participants,
    paid_by,
    total_amount,
  );

  const session = await mongoose.startSession();
  let expense;

  try {
    await session.withTransaction(async () => {
      [expense] = await Expense.create(
        [
          {
            group_id,
            name,
            total_amount,
            paid_by,
            participants: updatedParticipants,
            split_method,
          },
        ],
        { session },
      );

      await applyBalances(
        group_id,
        updatedParticipants,
        paid_by,
        total_amount,
        session,
      );

      const groupHistory = await getOrCreateGroupHistory(group_id, session);
      pushExpenseHistory(
        groupHistory,
        updatedParticipants,
        paid_by,
        name,
        expense._id,
      );
      await groupHistory.save({ session });

      await Group.findByIdAndUpdate(
        new mongoose.Types.ObjectId(group_id),
        { $inc: { total_expenses: total_amount, expense_count: 1 } },
        { new: true, session },
      );
    });
  } finally {
    session.endSession();
  }

  logger.info(`Expense created: ${expense._id} in group: ${group_id}`);
  return expense;
};

const getAllGroupService = async (user_id) => {
  const groups = await Group.find({ createdBy: user_id });

  return groups;
};

const getGroupOrThrow = async (group_id, user_id) => {
  const query = { _id: group_id };
  if (user_id) query.createdBy = user_id;

  const group = await Group.findOne(query).lean();
  if (!group) throw new Error("Group not found");
  return group;
};

const getGroupDataService = async (group_id, options = {}, user_id) => {
  validateObjectIds(group_id);
  const group = await getGroupOrThrow(group_id, user_id);
  const result = {
    _id: group._id,
    name: group.name,
    icon: group.icon,
    color: group.color,
    expense_count: group.expense_count ?? 0,
    member_count: group.member_count ?? 0,
    total_expenses: group.total_expenses ?? 0,
    members: group.members,
  };

  if (options.balances) {
    result.balances = await Balance.find({ group_id }).lean();
  }

  if (options.expenses) {
    result.expenses = await Expense.find({ group_id }).lean();
  }

  if (options.settlements) {
    const balances = await Balance.find({ group_id }).lean();
    result.suggestions = calculateSuggestions(group_id, balances);
    result.settlements = await Settlement.find({ group_id }).lean();
  }

  if (options.history) {
    result.history = await History.find({ group_id }).lean();
  }

  return result;
};

const editGroupService = async (group_id, data, user_id) => {
  validateObjectIds(group_id);
  const { groupName, groupIcon, groupColor } = data;

  const group = await Group.findOneAndUpdate(
    { _id: group_id, createdBy: user_id },
    {
      name: groupName,
      icon: groupIcon,
      color: groupColor,
    },
    {
      new: true,
      runValidators: true,
    },
  );

  if (!group) throw new Error("Group not found");
  logger.info(`Group updated: ${group_id} by user: ${user_id}`);

  return group;
};

const editMemberService = async (group_id, member_id, data, user_id) => {
  validateObjectIds(group_id, member_id);

  const { name, emoji } = data;
  if (!name?.trim()) throw new Error("Nama member tidak boleh kosong");

  await getGroupOrThrow(group_id, user_id);

  const group = await Group.findOneAndUpdate(
    {
      _id: group_id,
      "members._id": member_id,
    },
    {
      $set: {
        "members.$.name": name.trim(),
        ...(emoji !== undefined && { "members.$.emoji": emoji }),
      },
    },
    { new: true, runValidators: true },
  );

  if (!group) throw new Error("Group atau member tidak ditemukan");

  logger.info(`Member updated: ${member_id} in group: ${group_id}`);
  return group.members.id(member_id);
};

const deactivateMemberService = async (group_id, member_id, user_id) => {
  validateObjectIds(group_id, member_id);

  await getGroupOrThrow(group_id, user_id);

  const expenseCount = await Expense.countDocuments({
    group_id,
    $or: [{ paid_by: member_id }, { "participants.user_id": member_id }],
  });

  const group = await Group.findOneAndUpdate(
    {
      _id: group_id,
      "members._id": member_id,
    },
    {
      $set: { "members.$.isActive": false },
      $inc: { member_count: -1 },
    },
    { new: true },
  );

  if (!group) throw new Error("Group atau member tidak ditemukan");

  logger.info(`Member deactivated: ${member_id} in group: ${group_id}`);
  return {
    member: group.members.id(member_id),
    hadExpenses: expenseCount > 0,
  };
};

const addMemberService = async (group_id, data, user_id) => {
  validateObjectIds(group_id);

  const { name, emoji } = data;
  if (!name?.trim()) throw new Error("Nama member tidak boleh kosong");

  const group = await Group.findOne({ _id: group_id, createdBy: user_id });
  if (!group) throw new Error("Group tidak ditemukan");

  const isDuplicate = group.members.some(
    (m) => m.isActive && m.name.toLowerCase() === name.trim().toLowerCase(),
  );
  if (isDuplicate) throw new Error("Nama member sudah ada di grup ini");

  const activeCount = group.members.filter((m) => m.isActive).length;
  const palette = MEMBER_COLORS[activeCount % MEMBER_COLORS.length];

  group.members.push({
    name: name.trim(),
    emoji: emoji || "",
    color: palette.color,
    light: palette.light,
    isActive: true,
  });
  group.member_count += 1;

  await group.save();

  logger.info(`Member added to group: ${group_id} by user: ${user_id}`);
  return group.members[group.members.length - 1];
};

const editExpenseService = async (group_id, expense_id, data) => {
  validateObjectIds(group_id, expense_id);
  const { name, total_amount, paid_by, participants, split_method } = data;

  if (!group_id || !expense_id)
    throw new Error("group_id and expense_id are required");
  validateObjectIds(group_id, expense_id);
  validateExpenseInput({
    name,
    total_amount,
    paid_by,
    participants,
    split_method,
  });

  const oldExpense = await Expense.findById(expense_id);
  if (!oldExpense) throw new Error("Expense Not Found");

  if (oldExpense.group_id.toString() !== group_id.toString()) {
    throw new Error("Expense does not belong to this group");
  }

  const sortParticipants = (arr) =>
    [...arr].sort((a, b) =>
      a.user_id.toString().localeCompare(b.user_id.toString()),
    );

  const isCalculationChanged =
    oldExpense.total_amount !== total_amount ||
    oldExpense.paid_by.toString() !== paid_by.toString() ||
    oldExpense.split_method !== split_method ||
    JSON.stringify(
      sortParticipants(oldExpense.participants).map((p) => ({
        id: p.user_id.toString(),
        share: p.share_amount,
      })),
    ) !==
      JSON.stringify(
        sortParticipants(participants).map((p) => ({
          id: p.user_id.toString(),
          share: p.share_amount,
        })),
      );
  const session = await mongoose.startSession();
  let updatedExpense;

  try {
    await session.withTransaction(async () => {
      if (isCalculationChanged) {
        await reverseBalances(
          group_id,
          oldExpense.participants,
          oldExpense.paid_by,
          oldExpense.total_amount,
          session,
        );

        const groupHistory = await getOrCreateGroupHistory(group_id, session);
        removeExpenseHistory(groupHistory, oldExpense._id);

        const updatedParticipants = normalizeParticipants(
          participants,
          paid_by,
          total_amount,
        );

        updatedExpense = await Expense.findByIdAndUpdate(
          expense_id,
          {
            name,
            total_amount,
            paid_by,
            participants: updatedParticipants,
            split_method,
          },
          { new: true, session },
        );

        await applyBalances(
          group_id,
          updatedParticipants,
          paid_by,
          total_amount,
          session,
        );

        pushExpenseHistory(
          groupHistory,
          updatedParticipants,
          paid_by,
          name,
          updatedExpense._id,
        );
        await groupHistory.save({ session });

        const diff = total_amount - oldExpense.total_amount;
        await Group.findByIdAndUpdate(
          new mongoose.Types.ObjectId(group_id),
          { $inc: { total_expenses: diff } },
          { new: true, session },
        );
      } else {
        updatedExpense = await Expense.findByIdAndUpdate(
          expense_id,
          { name },
          { new: true, session },
        );

        const groupHistory = await getOrCreateGroupHistory(group_id, session);
        updateExpenseNameInHistory(groupHistory, expense_id, name);
        await groupHistory.save({ session });
      }
    });
  } finally {
    session.endSession();
  }

  logger.info(`Expense updated: ${expense_id} in group: ${group_id}`);
  return updatedExpense;
};

const deleteGroupService = async (group_id, user_id) => {
  validateObjectIds(group_id);
  const session = await mongoose.startSession();

  try {
    await session.withTransaction(async () => {
      const group = await Group.findOne({
        _id: group_id,
        createdBy: user_id,
      }).session(session);
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

  logger.info(`Group deleted: ${group_id} by user: ${user_id}`);
  return { message: "Group and related data deleted successfully" };
};

const deleteExpenseService = async (group_id, expense_id) => {
  if (!group_id || !expense_id) {
    throw new Error(
      "All required fields must be provided: group_id, expense_id",
    );
  }
  validateObjectIds(group_id, expense_id);

  const expense = await Expense.findById(expense_id);
  if (!expense) throw new Error("Expense Not Found");

  if (expense.group_id.toString() !== group_id.toString()) {
    throw new Error("Expense does not belong to this group");
  }
  const session = await mongoose.startSession();

  try {
    await session.withTransaction(async () => {
      await reverseBalances(
        group_id,
        expense.participants,
        expense.paid_by,
        expense.total_amount,
        session,
      );

      const groupHistory = await getOrCreateGroupHistory(group_id, session);
      removeExpenseHistory(groupHistory, expense._id);
      await groupHistory.save({ session });

      await Expense.findByIdAndDelete(expense_id).session(session);

      await Group.findByIdAndUpdate(
        new mongoose.Types.ObjectId(group_id),
        { $inc: { total_expenses: -expense.total_amount, expense_count: -1 } },
        { new: true, session },
      );
    });
  } finally {
    session.endSession();
  }

  logger.info(`Expense deleted: ${expense_id} from group: ${group_id}`);
  return { message: "Expense deleted successfully" };
};

const calculateSuggestions = (group_id, balances) => {
  const creditors = balances
    .filter((b) => b.amount > 0)
    .map((b) => ({ user_id: b.user_id, amount: b.amount }));
  const debtors = balances
    .filter((b) => b.amount < 0)
    .map((b) => ({ user_id: b.user_id, amount: Math.abs(b.amount) }));

  const suggestions = [];
  let i = 0;
  let j = 0;

  while (i < debtors.length && j < creditors.length) {
    const debtor = debtors[i];
    const creditor = creditors[j];
    const transferAmount = Math.min(debtor.amount, creditor.amount);

    suggestions.push({
      group_id,
      from: debtor.user_id,
      to: creditor.user_id,
      amount: transferAmount,
    });

    debtor.amount -= transferAmount;
    creditor.amount -= transferAmount;

    if (debtor.amount === 0) i++;
    if (creditor.amount === 0) j++;
  }

  return suggestions;
};

const createSettlementService = async (group_id, data) => {
  validateObjectIds(group_id);
  const { from, to, amount } = data;

  if (!from || !to || !amount) {
    throw new Error("from, to, and amount are required");
  }
  if (typeof amount !== "number" || amount <= 0) {
    throw new Error("amount must be a number greater than 0");
  }
  validateObjectIds(from, to);

  const session = await mongoose.startSession();
  let settlement;

  try {
    await session.withTransaction(async () => {
      [settlement] = await Settlement.create([{ group_id, from, to, amount }], {
        session,
      });

      const fromBalance = await Balance.findOne({
        group_id,
        user_id: from,
      }).session(session);
      if (fromBalance) {
        fromBalance.amount = 0;
        await fromBalance.save({ session });
      }

      const toBalance = await Balance.findOne({
        group_id,
        user_id: to,
      }).session(session);
      if (toBalance) {
        toBalance.amount -= amount;
        await toBalance.save({ session });
      }

      const groupHistory = await getOrCreateGroupHistory(group_id, session);

      const fromHistory = groupHistory.histories.find(
        (h) => h.user_id.toString() === from.toString(),
      );
      if (fromHistory) {
        fromHistory.history.push({ type: "settlement_paid", from, to, amount });
      } else {
        groupHistory.histories.push({
          user_id: from,
          history: [{ type: "settlement_paid", from, to, amount }],
        });
      }

      const toHistory = groupHistory.histories.find(
        (h) => h.user_id.toString() === to.toString(),
      );
      if (toHistory) {
        toHistory.history.push({
          type: "settlement_received",
          from,
          to,
          amount,
        });
      } else {
        groupHistory.histories.push({
          user_id: to,
          history: [{ type: "settlement_received", from, to, amount }],
        });
      }

      await groupHistory.save({ session });
    });
  } finally {
    session.endSession();
  }

  logger.info(`Settlement created: ${settlement._id} in group: ${group_id}`);
  return settlement;
};

module.exports = {
  createGroupService,
  createExpenseService,
  getAllGroupService,
  getGroupDataService,
  editGroupService,
  editMemberService,
  deactivateMemberService,
  addMemberService,
  editExpenseService,
  deleteGroupService,
  deleteExpenseService,
  calculateSuggestions,
  createSettlementService,
};
