const GUEST_STORAGE_KEY = "patungan_guest_id";
const GUEST_PREFIX = "guest_";
const GUEST_ID_PATTERN =
  /^guest_[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const canUseStorage = () => typeof window !== "undefined" && !!window.localStorage;
const FALLBACK_UUID_TEMPLATE = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx";

const createFallbackUuid = () =>
  FALLBACK_UUID_TEMPLATE.replaceAll(/[xy]/g, (char) => {
    const random = Math.floor(Math.random() * 16);
    const value = char === "x" ? random : (random & 0x3) | 0x8;
    return value.toString(16);
  });

const buildGuestId = () => {
  const randomValue =
    typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : createFallbackUuid();

  return `${GUEST_PREFIX}${randomValue}`;
};

export const getGuestId = () => {
  if (!canUseStorage()) return null;
  const guestId = window.localStorage.getItem(GUEST_STORAGE_KEY);

  if (!guestId) return null;
  if (!GUEST_ID_PATTERN.test(guestId)) {
    window.localStorage.removeItem(GUEST_STORAGE_KEY);
    return null;
  }

  return guestId;
};

export const ensureGuestSession = () => {
  if (!canUseStorage()) return null;

  const existingGuestId = getGuestId();
  if (existingGuestId) return existingGuestId;

  const newGuestId = buildGuestId();
  window.localStorage.setItem(GUEST_STORAGE_KEY, newGuestId);
  return newGuestId;
};

export const clearGuestSession = () => {
  if (!canUseStorage()) return;
  window.localStorage.removeItem(GUEST_STORAGE_KEY);
};

export const hasGuestSession = () => !!getGuestId();
