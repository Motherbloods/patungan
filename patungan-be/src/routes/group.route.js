const express = require("express");
const {
  createGroup,
  createExpense,
} = require("../controllers/group.controller");
const router = express.Router();

router.post("/group", createGroup);
router.post("/group/expense", createExpense);

module.exports = router;
