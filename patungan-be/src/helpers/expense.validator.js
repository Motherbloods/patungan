const AppError = require("../errors/AppError");

const ALLOWED_SPLIT_METHODS = ["bagi-rata", "custom"];

const validateExpenseInput = ({
  name,
  total_amount,
  paid_by,
  participants,
  split_method,
}) => {
  if (!name || !total_amount || !paid_by || !participants || !split_method) {
    throw new AppError(
      "All required fields must be provided: name, total_amount, paid_by, participants, split_method",
      400,
    );
  }

  if (typeof total_amount !== "number" || total_amount <= 0) {
    throw new AppError("total_amount must be a number greater than 0", 400);
  }

  if (!Array.isArray(participants) || participants.length === 0) {
    throw new AppError("participants must be a non-empty array", 400);
  }

  participants.forEach((p, index) => {
    if (!p.user_id) {
      throw new AppError(
        `Participant at index ${index} must have a user_id`,
        400,
      );
    }

    if (typeof p.share_amount !== "number") {
      throw new AppError(
        `Participant at index ${index} must have share_amount as number`,
        400,
      );
    }

    if (p.share_amount < 0) {
      throw new AppError(
        `Participant at index ${index} cannot have negative share_amount`,
        400,
      );
    }
  });

  if (!ALLOWED_SPLIT_METHODS.includes(split_method)) {
    throw new AppError(
      `split_method must be one of: ${ALLOWED_SPLIT_METHODS.join(", ")}`,
      400,
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

module.exports = {
  validateExpenseInput,
  normalizeParticipants,
};
