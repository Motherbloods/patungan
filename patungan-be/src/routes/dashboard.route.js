const {
  getDashboardSummary,
  getDashboardGroupsPagination,
  getDashboardActivity,
} = require("../controllers/dashboard.controller");
const express = require("express");
const { actorMiddleware } = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/dashboard/summary", actorMiddleware, getDashboardSummary);
router.get("/dashboard/groups", actorMiddleware, getDashboardGroupsPagination);
router.get("/dashboard/activity", actorMiddleware, getDashboardActivity);

module.exports = router;
