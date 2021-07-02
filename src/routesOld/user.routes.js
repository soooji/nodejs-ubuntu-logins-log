const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
// const connectEnsureLogin = require("connect-ensure-login");
const passport = require("passport");

// All users
router.get(
  "/profile",
  passport.authenticate("jwt", { session: false }),
  userController.getUser
);

router.put(
  "/profile",
  passport.authenticate("jwt", { session: false }),
  userController.updateProfile
);

router.put(
  "/change-password",
  passport.authenticate("jwt", { session: false }),
  userController.changePassword
);

// If Admin
router.get(
  "/all",
  passport.authenticate("jwt", { session: false }),
  userController.getUsers
);
router.put(
  "/all/:id",
  passport.authenticate("jwt", { session: false }),
  userController.putUserByAdmin
);
router.get(
  "/all/:id",
  passport.authenticate("jwt", { session: false }),
  userController.getUserItem
);

module.exports = router;
