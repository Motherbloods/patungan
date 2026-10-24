const { validate: validateUuid, version: uuidVersion } = require("uuid");

const GUEST_ID_PREFIX = "guest_";

const createGuestIdPattern = () =>
  new RegExp(`^${GUEST_ID_PREFIX}([0-9a-fA-F-]{36})$`);

const isValidGuestId = (guestId) => {
  if (typeof guestId !== "string") return false;

  const normalized = guestId.trim();
  const match = normalized.match(createGuestIdPattern());
  if (!match) return false;

  const uuid = match[1];
  return validateUuid(uuid) && uuidVersion(uuid) === 4;
};

const normalizeGuestId = (guestId) => {
  if (typeof guestId !== "string") return null;
  const normalized = guestId.trim();
  return isValidGuestId(normalized) ? normalized : null;
};

module.exports = {
  GUEST_ID_PREFIX,
  isValidGuestId,
  normalizeGuestId,
};
