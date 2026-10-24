const mongoose = require("mongoose");
const AppError = require("../errors/AppError");

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const validateObjectIds = (...ids) => {
  for (const id of ids) {
    if (!isValidObjectId(id)) {
      throw new AppError(`Invalid id format: ${id}`, 400);
    }
  }
};

module.exports = { isValidObjectId, validateObjectIds };
