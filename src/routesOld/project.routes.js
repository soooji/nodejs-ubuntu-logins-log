const express = require("express");
const router = express.Router();
const projectController = require("../controllers/project.controller");
// const connectEnsureLogin = require("connect-ensure-login");
const passport = require("passport");

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  projectController.getProjects
);

router.get(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  projectController.getProject
);

// If Admin
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  projectController.createProject
);
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  projectController.deleteProject
);
router.put(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  projectController.updateProject
);

module.exports = router;
