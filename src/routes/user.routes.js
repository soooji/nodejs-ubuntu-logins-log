const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
// const passport = require("passport");

router.post("/login", authController.login);
module.exports = router;

// router.get(
//   "/logout",
//   passport.authenticate("jwt", { session: false }),
//   authController.logout
// );