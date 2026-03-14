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

const createGroupService = async (data) => {
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
  logger.info(`Group created: ${group._id}`);
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

const getAllGroupService = async () => {
  const groups = await Group.find();

  return groups;
};

const getGroupOrThrow = async (group_id) => {
  const group = await Group.findById(group_id).lean();
  if (!group) throw new Error("Group not found");
  return group;
};

const getGroupDataService = async (group_id, options = {}) => {
  validateObjectIds(group_id);
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
  validateObjectIds(group_id);
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

  if (!group) throw new Error("Group not found");
  logger.info(`Group updated: ${group_id}`);

  return group;
};

const editExpenseService = async (group_id, expense_id, data) => {
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

const deleteGroupService = async (group_id) => {
  validateObjectIds(group_id);
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

  logger.info(`Group deleted: ${group_id}`);
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

module.exports = {
  createGroupService,
  createExpenseService,
  getAllGroupService,
  getGroupDataService,
  editGroupService,
  editExpenseService,
  deleteGroupService,
  deleteExpenseService,
};
