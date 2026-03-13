const express = require("express");
const {
  createGroup,
  createExpense,
  getSummaryGroup,
  getGroupTransactions,
  getGroupSettlements,
  getGroupHistory,
  editGroup,
  editExpense,
  deleteGroup,
  deleteExpense,
} = require("../controllers/group.controller");
const router = express.Router();

router.post("/group", createGroup);
router.post("/group/expense", createExpense);
router.get("/group/:id", getSummaryGroup);
router.get("/group/:id/transactions", getGroupTransactions);
router.get("/group/:id/settlements", getGroupSettlements);
router.get("/group/:id/history", getGroupHistory);
router.put("/groups/:id", editGroup);
router.put("/groups/:group_id/expense/:expense_id", editExpense);
router.delete("/group/:id", deleteGroup);
router.delete("/group/:group_id/expense/:expense_id", deleteExpense);

module.exports = router;
