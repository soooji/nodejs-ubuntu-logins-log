const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
// const connectEnsureLogin = require("connect-ensure-login");
const passport = require("passport");

router.post("/login", authController.login);
router.post("/register", authController.register);
router.get(
  "/logout",
  passport.authenticate("jwt", { session: false }),
  authController.logout
);
router.post("/forgot-password", authController.forgetPassword);
module.exports = router;
