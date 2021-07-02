const express = require("express");
const router = express.Router();
const taskController = require("../controllers/task.controller");
// const connectEnsureLogin = require("connect-ensure-login");
const passport = require("passport");

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  taskController.getTasks
); //grouped by status including tags
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  taskController.createTask
); //including tag_id s
router.get(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  taskController.getTask
); //including comments and tags
router.put(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  taskController.updateTask
);
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  taskController.deleteTask
);

router.post(
  "/:id/comment",
  passport.authenticate("jwt", { session: false }),
  taskController.comment
);

router.delete(
  "/comment/:id",
  passport.authenticate("jwt", { session: false }),
  taskController.deleteComment
);

module.exports = router;
