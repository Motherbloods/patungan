const mongoose = require("mongoose");

const historyItemSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["paid", "received", "settlement_paid", "settlement_received"],
    required: true,
  },
  from: { type: mongoose.Schema.Types.ObjectId, required: true },
  to: { type: mongoose.Schema.Types.ObjectId, required: true },
  amount: { type: Number, required: true },
  expense: { type: String },
  created_at: { type: Date, default: Date.now },
});

const userHistorySchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  history: [historyItemSchema],
});

const groupHistorySchema = new mongoose.Schema({
  group_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Group-Patungan",
  },
  histories: [userHistorySchema],
});

const History = mongoose.model("History-Patungan", groupHistorySchema);

module.exports = History;
