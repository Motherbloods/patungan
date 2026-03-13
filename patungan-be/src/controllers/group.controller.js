const asyncHandler = require("../utils/asyncHandler");
const {
  createGroupService,
  createExpenseService,
  getGroupDataService,
  editGroupService,
  editExpenseService,
  deleteGroupService,
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
  const summary = await getGroupDataService(id, { balances: true });
  res.json(summary);
});

const getGroupTransactions = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const transaksi = await getGroupDataService(id, { expenses: true });
  res.json(transaksi);
});

const getGroupSettlements = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const settlement = await getGroupDataService(id, { settlements: true });
  res.json(settlement);
});

const getGroupHistory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const history = await getGroupDataService(id, { history: true });
  res.json(history);
});

const editGroup = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await editGroupService(id, req.body);
  res.json(result);
});

const editExpense = asyncHandler(async (req, res) => {
  const { group_id, expense_id } = req.params;
  const result = await editExpenseService(group_id, expense_id, req.body);
  req.json(result);
});

const deleteGroup = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await deleteGroupService(id);
  req.json(result);
});

module.exports = {
  createGroup,
  createExpense,
  getSummaryGroup,
  getGroupTransactions,
  getGroupSettlements,
  getGroupHistory,
  editGroup,
  editExpense,
  deleteGroup,
};
