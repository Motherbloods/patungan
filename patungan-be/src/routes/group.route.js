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
  reactivateMember,
  createSettlement,
  updateOwnerMember,
} = require("../controllers/group.controller");
const { actorMiddleware } = require("../middleware/auth.middleware");
const router = express.Router();

router.get("/groups", actorMiddleware, getAllGroup);
router.get("/group/:id", actorMiddleware, getSummaryGroup);
router.get("/group/:id/transactions", actorMiddleware, getGroupTransactions);
router.get("/group/:id/settlements", actorMiddleware, getGroupSettlements);
router.get("/group/:id/history", actorMiddleware, getGroupHistory);
router.post("/group", actorMiddleware, createGroup);
router.post("/group/expense", actorMiddleware, createExpense);
router.post("/group/:id/settlement", actorMiddleware, createSettlement);
router.put("/group/:id", actorMiddleware, editGroup);
router.put("/group/:group_id/expense/:expense_id", actorMiddleware, editExpense);
router.delete("/group/:id", actorMiddleware, deleteGroup);
router.delete(
  "/group/:group_id/expense/:expense_id",
  actorMiddleware,
  deleteExpense,
);
router.post("/group/:id/members", actorMiddleware, addMember);
router.patch("/group/:id/members/:member_id", actorMiddleware, editMember);
router.patch(
  "/group/:id/members/:member_id/deactivate",
  actorMiddleware,
  deactivateMember,
);
router.patch(
  "/group/:id/members/:member_id/reactivate",
  actorMiddleware,
  reactivateMember,
);
router.patch("/group/:id/owner-member", actorMiddleware, updateOwnerMember);

module.exports = router;
