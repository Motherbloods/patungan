const AppError = require("../errors/AppError");

const getActorOwnershipFilter = (actor) => {
  if (!actor) throw new AppError("Unauthorized", 401);

  if (actor.type === "user") {
    return { createdBy: actor.userId };
  }

  if (actor.type === "guest") {
    return { createdBy: null, guestId: actor.guestId };
  }

  throw new AppError("Unauthorized", 401);
};

module.exports = {
  getActorOwnershipFilter,
};
