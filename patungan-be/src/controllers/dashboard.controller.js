const asyncHandler = require("../utils/asyncHandler");
const {
  getDashboardSummaryService,
  getDashboardGroupsPaginationService,
  getDashboardActivityService,
} = require("../services/dashboard.service");

const getDashboardSummary = asyncHandler(async (req, res) => {
  const result = await getDashboardSummaryService("motherbloodss");
  res.json(result);
});
const getDashboardGroupsPagination = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 4;
  const result = await getDashboardGroupsPaginationService(
    page,
    limit,
    "motherbloodss",
  );
  res.json(result);
});
const getDashboardActivity = asyncHandler(async (req, res) => {
  const result = await getDashboardActivityService("motherbloodss");
  res.json(result);
});

module.exports = {
  getDashboardSummary,
  getDashboardGroupsPagination,
  getDashboardActivity,
};
