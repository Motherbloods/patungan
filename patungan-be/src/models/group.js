const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    icon: { type: String, required: true },
    color: { type: String, required: true },
    total_expenses: { type: Number, default: 0 },
    expense_count: { type: Number, default: 0 },
    member_count: { type: Number, default: 0 },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User-Patungan",
      required: true,
      index: true,
    },

    members: [
      {
        name: { type: String, required: true },
        emoji: { type: String },
        color: { type: String },
        light: { type: String },
        isActive: { type: Boolean, default: true },
      },
    ],
  },
  { timestamps: true },
);

const Group = mongoose.model("Group-Patungan", groupSchema);

module.exports = Group;
