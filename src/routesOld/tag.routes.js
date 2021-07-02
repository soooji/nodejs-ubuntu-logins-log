const express = require("express");
const router = express.Router();
const tagController = require("../controllers/tag.controller");
const connectEnsureLogin = require("connect-ensure-login");
const passport = require("passport");

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  tagController.getTags
);
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  tagController.createTag
);

module.exports = router;
