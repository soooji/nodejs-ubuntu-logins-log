const express = require("express");
const router = express.Router();
const controller = require("../controllers/file.controller.js");
const passport = require("passport");

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  controller.getUserFiles
);

module.exports = router;
