const asyncHandler = require("../utils/asyncHandler");
const {
  createGroupService,
  createExpenseService,
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

module.exports = { createGroup, createExpense };
