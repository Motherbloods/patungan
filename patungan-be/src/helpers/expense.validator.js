const AppError = require("../errors/AppError");
const { isValidObjectId } = require("../utils/objectId");

const ALLOWED_SPLIT_METHODS = ["bagi-rata", "custom"];
const MAX_AMOUNT = 1e12;
const MAX_NAME_LENGTH = 100;

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

  if (typeof name !== "string" || name.trim().length > MAX_NAME_LENGTH) {
    throw new AppError(
      `name must be a string up to ${MAX_NAME_LENGTH} characters`,
      400,
    );
  }

  if (
    typeof total_amount !== "number" ||
    !Number.isFinite(total_amount) ||
    total_amount <= 0 ||
    total_amount > MAX_AMOUNT
  ) {
    throw new AppError("total_amount must be a valid number greater than 0", 400);
  }

  if (!isValidObjectId(paid_by)) {
    throw new AppError("paid_by must be a valid id", 400);
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

    if (!isValidObjectId(p.user_id)) {
      throw new AppError(
        `Participant at index ${index} must have a valid user_id`,
        400,
      );
    }

    if (
      typeof p.share_amount !== "number" ||
      !Number.isFinite(p.share_amount) ||
      p.share_amount > MAX_AMOUNT
    ) {
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

  const uniqueIds = new Set(participants.map((p) => p.user_id.toString()));
  if (uniqueIds.size !== participants.length) {
    throw new AppError("participants must not contain duplicates", 400);
  }

  const totalShare = participants.reduce((sum, p) => sum + p.share_amount, 0);
  if (Math.abs(total_amount - totalShare) > participants.length) {
    throw new AppError("Sum of participant shares must match total_amount", 400);
  }

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
