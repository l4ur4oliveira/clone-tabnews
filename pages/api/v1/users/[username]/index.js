import { createRouter } from "next-connect";
import controller from "infra/controller.js";
import { ForbiddenError } from "infra/errors.js";
import user from "models/user.js";
import authorization from "models/authorization.js";

const router = createRouter();

router.use(controller.injectAnonymousOrUser);
router.get(getHandler);
router.patch(controller.canRequest("update:user"), patchHandler);

export default router.handler(controller.errorHandlers);

async function getHandler(req, res) {
  const userTryingToGet = req.context.user;
  const username = req.query.username;
  const userFound = await user.findOneByUsername(username);

  const secureOutputValues = authorization.filterOutput(
    userTryingToGet,
    "read:user",
    userFound,
  );

  return res.status(200).json(secureOutputValues);
}

async function patchHandler(req, res) {
  const username = req.query.username;
  const userInputValues = req.body;

  const userTryingToPatch = req.context.user;
  const targetUser = await user.findOneByUsername(username);

  if (!authorization.can(userTryingToPatch, "update:user", targetUser)) {
    throw new ForbiddenError({
      message: "You're not allowed to update this user.",
      action: "Check if your user have the proper feature.",
    });
  }

  const updatedUser = await user.update(username, userInputValues);

  const secureOutputValues = authorization.filterOutput(
    userTryingToPatch,
    "read:user",
    updatedUser,
  );

  return res.status(200).json(secureOutputValues);
}
