const express = require("express");
const router = express.Router();
const statController = require("../controllers/stat.controller");
const passport = require("passport");

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  statController.get
);

module.exports = router;
