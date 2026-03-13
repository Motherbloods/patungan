const express = require("express");
const {
  createGroup,
  createExpense,
  getSummaryGroup,
  getGroupTransactions,
  getGroupSettlements,
  getGroupHistory,
} = require("../controllers/group.controller");
const router = express.Router();

router.post("/group", createGroup);
router.post("/group/expense", createExpense);
router.get("/group/:id", getSummaryGroup);
router.get("/group/:id/transactions", getGroupTransactions);
router.get("/group/:id/settlements", getGroupSettlements);
router.get("/group/:id/history", getGroupHistory);
router.put("group/edit");

module.exports = router;
