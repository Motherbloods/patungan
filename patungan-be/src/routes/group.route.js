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
  getAllGroup,
} = require("../controllers/group.controller");
const router = express.Router();

router.get("/groups", getAllGroup);
router.get("/group/:id", getSummaryGroup);
router.get("/group/:id/transactions", getGroupTransactions);
router.get("/group/:id/settlements", getGroupSettlements);
router.get("/group/:id/history", getGroupHistory);
router.post("/group", createGroup);
router.post("/group/expense", createExpense);
router.put("/group/:id", editGroup);
router.put("/group/:group_id/expense/:expense_id", editExpense);
router.delete("/group/:id", deleteGroup);
router.delete("/group/:group_id/expense/:expense_id", deleteExpense);

module.exports = router;
