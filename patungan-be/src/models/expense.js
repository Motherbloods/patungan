const expenseSchema = new mongoose.Schema({
  group_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Group-Patungan",
    required: true,
  },
  name: { type: String, required: true },
  paid_by: { type: mongoose.Schema.Types.ObjectId, required: true },
  total_amount: { type: Number, required: true },
  participants: [
    {
      user_id: { type: mongoose.Schema.Types.ObjectId, required: true },
      share_amount: { type: Number, required: true },
    },
  ],
  created_at: { type: Date, default: Date.now },
});

const Expense = mongoose.model("Expense-Patungan", expenseSchema);

module.exports = Expense;
