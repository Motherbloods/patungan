const mongoose = require("mongoose");

const balanceSchema = new mongoose.Schema({
  group_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Group-Patungan",
    required: true,
  },
  user_id: { type: mongoose.Schema.Types.ObjectId, required: true },
  amount: { type: Number, default: 0 },
});

const Balance = mongoose.model("Balance-Patungan", balanceSchema);

module.exports = Balance;
