const {
  getDashboardSummary,
  getDashboardGroupsPagination,
  getDashboardActivity,
} = require("../controllers/dashboard.controller");
const express = require("express");
const { authMiddleware } = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/dashboard/summary", authMiddleware, getDashboardSummary);
router.get("/dashboard/groups", authMiddleware, getDashboardGroupsPagination);
router.get("/dashboard/activity", authMiddleware, getDashboardActivity);

module.exports = router;
