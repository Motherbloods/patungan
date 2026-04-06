const asyncHandler = require("../utils/asyncHandler");
const {
  getDashboardSummaryService,
  getDashboardGroupsPaginationService,
  getDashboardActivityService,
} = require("../services/dashboard.service");

const getDashboardSummary = asyncHandler(async (req, res) => {
  const result = await getDashboardSummaryService(req.userId);
  res.json(result);
});

const getDashboardGroupsPagination = asyncHandler(async (req, res) => {
  const page = Number.parseInt(req.query.page) || 1;
  const limit = Number.parseInt(req.query.limit) || 4;
  const result = await getDashboardGroupsPaginationService(
    page,
    limit,
    req.userId,
  );
  res.json(result);
});

const getDashboardActivity = asyncHandler(async (req, res) => {
  const page = Number.parseInt(req.query.page) || 1;
  const limit = Number.parseInt(req.query.limit) || 10;
  const result = await getDashboardActivityService(page, limit, req.userId);
  res.json(result);
});

module.exports = {
  getDashboardSummary,
  getDashboardGroupsPagination,
  getDashboardActivity,
};
