const mongoose = require("mongoose");

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const validateObjectIds = (...ids) => {
  for (const id of ids) {
    if (!isValidObjectId(id)) {
      throw new Error(`Invalid id format: ${id}`);
    }
  }
};

module.exports = { isValidObjectId, validateObjectIds };
