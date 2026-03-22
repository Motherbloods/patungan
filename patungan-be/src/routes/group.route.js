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
  addMember,
  editMember,
  deactivateMember,
  createSettlement,
  updateOwnerMember,
} = require("../controllers/group.controller");
const { authMiddleware } = require("../middleware/auth.middleware");
const router = express.Router();

router.get("/groups", authMiddleware, getAllGroup);
router.get("/group/:id", authMiddleware, getSummaryGroup);
router.get("/group/:id/transactions", authMiddleware, getGroupTransactions);
router.get("/group/:id/settlements", authMiddleware, getGroupSettlements);
router.get("/group/:id/history", authMiddleware, getGroupHistory);
router.post("/group", authMiddleware, createGroup);
router.post("/group/expense", authMiddleware, createExpense);
router.post("/group/:id/settlement", authMiddleware, createSettlement);
router.put("/group/:id", authMiddleware, editGroup);
router.put("/group/:group_id/expense/:expense_id", authMiddleware, editExpense);
router.delete("/group/:id", authMiddleware, deleteGroup);
router.delete(
  "/group/:group_id/expense/:expense_id",
  authMiddleware,
  deleteExpense,
);
router.post("/group/:id/members", authMiddleware, addMember);
router.patch("/group/:id/members/:member_id", authMiddleware, editMember);
router.patch(
  "/group/:id/members/:member_id/deactivate",
  authMiddleware,
  deactivateMember,
);
router.patch("/group/:id/owner-member", authMiddleware, updateOwnerMember);

module.exports = router;
