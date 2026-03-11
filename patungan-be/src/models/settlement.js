const settlementSchema = new mongoose.Schema({
  group_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Group-Patungan",
    required: true,
  },
  from: { type: mongoose.Schema.Types.ObjectId, required: true },
  to: { type: mongoose.Schema.Types.ObjectId, required: true },
  amount: { type: Number, required: true },
  created_at: { type: Date, default: Date.now },
});

const Settlement = mongoose.model("Settlement-Patungan", settlementSchema);

module.exports = Settlement;
