const express = require("express");
const router = express.Router();
const logController = require("../controllers/log.controller");
const passport = require("passport");

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  logController.getLogs
);

module.exports = router;
