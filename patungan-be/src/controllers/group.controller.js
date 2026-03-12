const asyncHandler = require("../utils/asyncHandler");
const {
  createGroupService,
  createExpenseService,
  getSummaryGroupService,
  getGroupTransactionsService,
} = require("../services/group.service");

const createGroup = asyncHandler(async (req, res) => {
  const result = await createGroupService(req.body);
  res.json(result);
});

const createExpense = asyncHandler(async (req, res) => {
  console.log("halo");
  const result = await createExpenseService(req.body);
  res.json(result);
});

const getSummaryGroup = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const summary = await getSummaryGroupService(id);
  res.json(summary);
});

const getGroupTransactions = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const transaksi = await getGroupTransactionsService(id);
  res.json(transaksi);
});

module.exports = {
  createGroup,
  createExpense,
  getSummaryGroup,
  getGroupTransactions,
};
