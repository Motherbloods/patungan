const ALLOWED_SPLIT_METHODS = ["bagi-rata", "custom"];

const validateExpenseInput = ({
  name,
  total_amount,
  paid_by,
  participants,
  split_method,
}) => {
  if (!name || !total_amount || !paid_by || !participants || !split_method) {
    throw new Error(
      "All required fields must be provided: name, total_amount, paid_by, participants, split_method",
    );
  }

  if (typeof total_amount !== "number" || total_amount <= 0) {
    throw new Error("total_amount must be a number greater than 0");
  }

  if (!Array.isArray(participants) || participants.length === 0) {
    throw new Error("participants must be a non-empty array");
  }

  participants.forEach((p, index) => {
    if (!p.user_id) {
      throw new Error(`Participant at index ${index} must have a user_id`);
    }
    if (typeof p.share_amount !== "number") {
      throw new Error(
        `Participant at index ${index} must have share_amount as number`,
      );
    }
  });

  if (!ALLOWED_SPLIT_METHODS.includes(split_method)) {
    throw new Error(
      `split_method must be one of: ${ALLOWED_SPLIT_METHODS.join(", ")}`,
    );
  }
};

const normalizeParticipants = (participants, paid_by, total_amount) => {
  const totalShare = participants.reduce((sum, p) => sum + p.share_amount, 0);
  const roundingDiff = total_amount - totalShare;

  return participants.map((p) =>
    p.user_id.toString() === paid_by.toString()
      ? { ...p, share_amount: p.share_amount + roundingDiff }
      : p,
  );
};

module.exports = { validateExpenseInput, normalizeParticipants };
