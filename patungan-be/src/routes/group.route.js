const express = require("express");
const {
  createGroup,
  createExpense,
  getSummaryGroup,
} = require("../controllers/group.controller");
const router = express.Router();

router.post("/group", createGroup);
router.post("/group/expense", createExpense);
router.get("/group/:id", getSummaryGroup);

module.exports = router;
