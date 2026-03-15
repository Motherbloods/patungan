const {
  getDashboardSummary,
  getDashboardGroupsPagination,
  getDashboardActivity,
} = require("../controllers/dashboard.controller");
const express = require("express");

const router = express.Router();

router.get("/dashboard/summary", getDashboardSummary);
router.get("/dashboard/groups", getDashboardGroupsPagination);
router.get("/dashboard/activity", getDashboardActivity);

module.exports = router;
