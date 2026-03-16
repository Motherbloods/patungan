const Group = require("../models/group");
const Expense = require("../models/expense");
const Balance = require("../models/balance");
const History = require("../models/history");

const getDashboardSummaryService = async (user_id) => {
  const balances = await Balance.find().lean();

  const totalOwe = balances
    .filter((b) => b.amount < 0)
    .reduce((sum, { amount }) => sum + Math.abs(amount), 0);

  const totalOwed = balances
    .filter((b) => b.amount > 0)
    .reduce((sum, { amount }) => sum + amount, 0);

  const activeGroups = await Group.countDocuments({
    expense_count: { $gt: 0 },
  });

  const totalExpenseResult = await Expense.aggregate([
    { $group: { _id: null, total: { $sum: "$total_amount" } } },
  ]);
  const totalExpenses = totalExpenseResult[0]?.total ?? 0;

  return { totalOwe, totalOwed, activeGroups, totalExpenses };
};

const getDashboardGroupsPaginationService = async (page, limit, user_id) => {
  const skip = (page - 1) * limit;

  const [groups, totalItems] = await Promise.all([
    Group.find(
      {},
      "_id name icon color expense_count total_expenses member_count",
    )
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Group.countDocuments(),
  ]);

  return {
    groups,
    myBalance: 0,
    pagination: {
      page,
      limit,
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
    },
  };
};

const getDashboardActivityService = async (page, limit, user_id) => {
  const historyDocs = await History.find().populate("group_id", "name").lean();

  const allItems = [];

  for (const doc of historyDocs) {
    const groupName = doc.group_id?.name ?? "-";
    const groupId = doc.group_id?._id ?? doc.group_id;

    for (const userHistory of doc.histories ?? []) {
      for (const item of userHistory.history ?? []) {
        allItems.push({
          _id: item._id,
          type: item.type,
          groupId,
          groupName,
          from: item.from,
          to: item.to,
          amount: item.amount,
          expense: item.expense ?? null,
          expense_id: item.expense_id ?? null,
          created_at: item.created_at,
        });
      }
    }
  }

  const sorted = allItems.sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at),
  );

  const totalItems = sorted.length;
  const totalPages = Math.ceil(totalItems / limit);
  const skip = (page - 1) * limit;
  const activities = sorted.slice(skip, skip + limit);

  return {
    activities,
    pagination: {
      page,
      limit,
      totalItems,
      totalPages,
      hasMore: page < totalPages,
    },
  };
};

module.exports = {
  getDashboardSummaryService,
  getDashboardGroupsPaginationService,
  getDashboardActivityService,
};
