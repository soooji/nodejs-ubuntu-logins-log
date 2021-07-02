const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
// const passport = require("passport");

router.post("/login", userController.login);
module.exports = router;

// router.get(
//   "/logout",
//   passport.authenticate("jwt", { session: false }),
//   authController.logout
// );