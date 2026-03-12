const express = require("express");
const {
  createGroup,
  createExpense,
  getSummaryGroup,
  getGroupTransactions,
} = require("../controllers/group.controller");
const router = express.Router();

router.post("/group", createGroup);
router.post("/group/expense", createExpense);
router.get("/group/:id", getSummaryGroup);
router.get("/group/:id/transactions", getGroupTransactions);

module.exports = router;
