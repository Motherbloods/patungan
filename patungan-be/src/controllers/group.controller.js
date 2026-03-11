const asyncHandler = require("../utils/asyncHandler");
const { createGroupService } = require("../services/group.service");

const createGroup = asyncHandler(async (req, res) => {
  const result = await createGroupService(req.body);
  res.json(result);
});

module.exports = { createGroup };
