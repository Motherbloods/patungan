const asyncHandler = require("../utils/asyncHandler");
const {
  createGroupService,
  createExpenseService,
  getAllGroupService,
  getGroupDataService,
  editGroupService,
  editMemberService,
  deactivateMemberService,
  reactivateMemberService,
  addMemberService,
  editExpenseService,
  deleteGroupService,
  deleteExpenseService,
  createSettlementService,
  updateOwnerMemberService,
} = require("../services/group.service");

const createGroup = asyncHandler(async (req, res) => {
  const result = await createGroupService(req.body, req.userId);
  res.json(result);
});

const createExpense = asyncHandler(async (req, res) => {
  const result = await createExpenseService(req.body);
  res.json(result);
});

const getAllGroup = asyncHandler(async (req, res) => {
  const groups = await getAllGroupService(req.userId);
  res.json(groups);
});

const getSummaryGroup = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const summary = await getGroupDataService(id, { balances: true }, req.userId);
  res.json(summary);
});

const getGroupTransactions = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const transaksi = await getGroupDataService(
    id,
    { expenses: true },
    req.userId,
  );
  res.json(transaksi);
});

const getGroupSettlements = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const settlement = await getGroupDataService(
    id,
    { settlements: true },
    req.userId,
  );
  res.json(settlement);
});

const getGroupHistory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const history = await getGroupDataService(id, { history: true }, req.userId);
  res.json(history);
});

const editGroup = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await editGroupService(id, req.body, req.userId);
  res.json(result);
});

const editExpense = asyncHandler(async (req, res) => {
  const { group_id, expense_id } = req.params;
  const result = await editExpenseService(group_id, expense_id, req.body);
  res.json(result);
});

const deleteGroup = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await deleteGroupService(id, req.userId);
  res.json(result);
});

const deleteExpense = asyncHandler(async (req, res) => {
  const { group_id, expense_id } = req.params;
  const result = await deleteExpenseService(group_id, expense_id);
  res.json(result);
});

const addMember = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await addMemberService(id, req.body, req.userId);
  res.status(201).json(result);
});

const editMember = asyncHandler(async (req, res) => {
  const { id, member_id } = req.params;
  const result = await editMemberService(id, member_id, req.body, req.userId);
  res.json(result);
});

const deactivateMember = asyncHandler(async (req, res) => {
  const { id, member_id } = req.params;
  const result = await deactivateMemberService(id, member_id, req.userId);
  res.json(result);
});

const reactivateMember = asyncHandler(async (req, res) => {
  const { id, member_id } = req.params;
  const result = await reactivateMemberService(id, member_id, req.userId);
  res.json(result);
});

const createSettlement = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await createSettlementService(id, req.body);
  res.status(201).json(result);
});

const updateOwnerMember = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { memberId } = req.body;
  const result = await updateOwnerMemberService(
    id,
    memberId ?? null,
    req.userId,
  );
  res.json(result);
});

module.exports = {
  createGroup,
  createExpense,
  getAllGroup,
  getSummaryGroup,
  getGroupTransactions,
  getGroupSettlements,
  getGroupHistory,
  editGroup,
  editExpense,
  deleteGroup,
  deleteExpense,
  addMember,
  editMember,
  deactivateMember,
  reactivateMember,
  createSettlement,
  updateOwnerMember,
};
