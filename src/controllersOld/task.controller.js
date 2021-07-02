"use strict";
const Tasks = require("../models/task.model");
const Tags = require("../models/tag.model");
var validate = require("validate.js");
var constraints = require("../validators/task.validators");
var utils = require("./../../utils/main.utils");
var _ = require("lodash");
const Project = require("../models/project.model");

exports.getTasks = function (req, res) {
  Tasks.getAll(function (err, data) {
    if (err) {
      res.status(406).send({
        error: true,
        message: {
          text: err.sqlMessage ? err.sqlMessage : "Could not get tasks!",
          details: err,
        },
      });
    } else {
      if (data.length == 0) {
        res.json({ data, token: req.query.secret_token });
      } else {
        let tasks = data;
        Tasks.getAllTaskTags(function (err, allTaskTags) {
          if (err) {
            res.status(406).send({
              error: true,
              message: {
                text: err.sqlMessage
                  ? err.sqlMessage
                  : "Could not get tasks tags!",
                details: err,
              },
            });
          } else {
            let tags = allTaskTags;
            Tasks.getAllTaskUsers(function (err, allTaskUsers) {
              if (err) {
                res.status(406).send({
                  error: true,
                  message: {
                    text: err.sqlMessage
                      ? err.sqlMessage
                      : "Could not get tasks users!",
                    details: err,
                  },
                });
              } else {
                let users = allTaskUsers;

                //group tasks and users
                let tagsByTask = _.groupBy(tags, function (item) {
                  return item.task_id;
                });
                let usersByTask = _.groupBy(users, function (item) {
                  return item.task_id;
                });

                for (let i = 0; i < tasks.length; i++) {
                  tasks[i]["tags"] = tagsByTask[tasks[i]["id"]]
                    ? tagsByTask[tasks[i]["id"]]
                    : [];
                  tasks[i]["users"] = usersByTask[tasks[i]["id"]]
                    ? usersByTask[tasks[i]["id"]]
                    : [];
                }

                let groupedByStatus = _.groupBy(tasks, function (item) {
                  return item.status_id;
                });

                res.json({
                  data: groupedByStatus,
                  token: req.query.secret_token,
                });
              }
            });
          }
        });
      }
    }
  });
};

exports.getTask = function (req, res) {
  Tasks.get(req.params.id, function (err, data) {
    if (err) {
      res.status(406).send({
        error: true,
        message: {
          text: err.sqlMessage ? err.sqlMessage : "Could not get target task!",
          details: err,
        },
      });
    } else {
      if (data.length == 0) {
        res.status(406).send({
          error: true,
          message: {
            text: err.sqlMessage
              ? err.sqlMessage
              : "Could not find target task!",
            details: err,
          },
        });
      } else {
        let targetTask = data[0];
        Tasks.getTaskUsers(req.params.id, function (err, users) {
          if (err) {
            res.status(406).send({
              error: true,
              message: {
                text: err.sqlMessage
                  ? err.sqlMessage
                  : "Could not get task users!",
                details: err,
              },
            });
          } else {
            targetTask["users"] = users;
            Tags.getTaskTags(req.params.id, function (err, tags) {
              if (err) {
                res.status(406).send({
                  error: true,
                  message: {
                    text: err.sqlMessage
                      ? err.sqlMessage
                      : "Could not get task users!",
                    details: err,
                  },
                });
              } else {
                targetTask["tags"] = tags;
                Project.getProject(
                  targetTask.project_id,
                  function (err, taskProject) {
                    if (err) {
                      res.status(406).send({
                        error: true,
                        message: {
                          text: err.sqlMessage
                            ? err.sqlMessage
                            : "Could not get task project info!",
                          details: err,
                        },
                      });
                    } else {
                      targetTask["project"] = taskProject;
                      Tasks.getTaskComments(
                        req.params.id,
                        function (err, taskComments) {
                          if (err) {
                            res.status(406).send({
                              error: true,
                              message: {
                                text: err.sqlMessage
                                  ? err.sqlMessage
                                  : "Could not get task comments!",
                                details: err,
                              },
                            });
                          } else {
                            targetTask["comments"] = taskComments;
                            res.json({
                              data: targetTask,
                              token: req.query.secret_token,
                            });
                          }
                        }
                      );
                    }
                  }
                );
              }
            });
          }
        });
      }
    }
  });
};

exports.createTask = function (req, res) {
  let checkResult = validate(req.body, constraints.create);
  if (checkResult) {
    console.log(checkResult);
    res.status(406).send({
      error: true,
      message: {
        text: "Entered data are not acceptable",
        details: checkResult,
      },
    });
  } else {
    let taskData = new Tasks(req.body);
    Tasks.create(taskData, function (err, insertId) {
      if (err || !insertId) {
        res.status(406).send({
          error: true,
          message: {
            text: err.sqlMessage
              ? err.sqlMessage
              : "Entered data are not acceptable",
            details: err,
          },
        });
      } else {
        if (!req.body.tags && !req.body.users) {
          res.json({
            token: req.query.secret_token,
            data: insertId,
          });
        }

        let taskUsers = [];
        for (let i = 0; i < req.body.users.length; i++) {
          taskUsers.push({
            task_id: insertId,
            user_id: parseInt(req.body.users[i]),
          });
        }
        Tasks.createUserTasks(taskUsers, function (err, userTasks) {
          if (err) {
            console.log(err);
            res.status(406).send({
              error: true,
              message: {
                text: err.sqlMessage
                  ? err.sqlMessage
                  : "Could not assign task to user!",
                details: err,
              },
            });
          } else {
            if (!req.body.tags) {
              res.json({
                token: req.query.secret_token,
                data: insertId,
              });
            } else {
              let taskTags = [];
              for (let i = 0; i < req.body.tags.length; i++) {
                taskTags.push({
                  task_id: insertId,
                  tag_id: parseInt(req.body.tags[i]),
                });
              }

              Tags.addTagsToTask(taskTags, function (err) {
                if (err) {
                  console.log(err);
                  res.status(406).send({
                    error: true,
                    message: {
                      text: err.sqlMessage
                        ? err.sqlMessage
                        : "Could not assign tags to task!",
                      details: err,
                    },
                  });
                } else {
                  res.json({
                    token: req.query.secret_token,
                    data: insertId,
                  });
                }
              });
            }
          }
        });
      }
    });
  }
};

exports.deleteTask = function (req, res) {
  Tags.removeTaskTags(req.params.id, function (err, data) {
    if (err) {
      res.status(406).send({
        error: true,
        message: {
          text: err.sqlMessage
            ? err.sqlMessage
            : "Could not remove tags from tasks!",
          details: err,
        },
      });
    } else {
      Tasks.removeUserTasks(req.params.id, function (err, data) {
        if (err) {
          res.status(406).send({
            error: true,
            message: {
              text: err.sqlMessage
                ? err.sqlMessage
                : "Could not remove users from tasks!",
              details: err,
            },
          });
        } else {
          Tasks.removeTask(req.params.id, function (err, data) {
            if (err) {
              res.status(406).send({
                error: true,
                message: {
                  text: err.sqlMessage
                    ? err.sqlMessage
                    : "Could not remove task!",
                  details: err,
                },
              });
            } else {
              res.json({
                token: req.query.secret_token,
                data: data,
              });
            }
          });
        }
      });
    }
  });
};

exports.updateTask = function (req, res) {
  Tasks.updateTask(req.params.id, req.body, function (err, data) {
    if (err) {
      res.status(406).send({
        error: true,
        message: {
          text: err.sqlMessage ? err.sqlMessage : "Could not update task info!",
          details: err,
        },
      });
    } else {
      Tags.removeTaskTags(req.params.id, function (err, data) {
        if (err) {
          res.status(406).send({
            error: true,
            message: {
              text: err.sqlMessage
                ? err.sqlMessage
                : "Could not update task tags!",
              details: err,
            },
          });
        } else {
          Tasks.removeUserTasks(req.params.id, function (err, data) {
            if (err) {
              res.status(406).send({
                error: true,
                message: {
                  text: err.sqlMessage
                    ? err.sqlMessage
                    : "Could not update task users!",
                  details: err,
                },
              });
            } else {
              if (!req.body.tags && !req.body.users) {
                res.json({
                  token: req.query.secret_token,
                  data: req.params.id,
                });
              }

              let taskUsers = [];
              for (let i = 0; i < req.body.users.length; i++) {
                taskUsers.push({
                  task_id: req.params.id,
                  user_id: parseInt(req.body.users[i]),
                });
              }
              Tasks.createUserTasks(taskUsers, function (err, userTasks) {
                if (err) {
                  console.log(err);
                  res.status(406).send({
                    error: true,
                    message: {
                      text: err.sqlMessage
                        ? err.sqlMessage
                        : "Could not assign task to users!",
                      details: err,
                    },
                  });
                } else {
                  if (!req.body.tags) {
                    res.json({
                      token: req.query.secret_token,
                      data: req.params.id,
                    });
                  } else {
                    let taskTags = [];
                    for (let i = 0; i < req.body.tags.length; i++) {
                      taskTags.push({
                        task_id: req.params.id,
                        tag_id: parseInt(req.body.tags[i]),
                      });
                    }

                    Tags.addTagsToTask(taskTags, function (err) {
                      if (err) {
                        console.log(err);
                        res.status(406).send({
                          error: true,
                          message: {
                            text: err.sqlMessage
                              ? err.sqlMessage
                              : "Could not assign tags to task!",
                            details: err,
                          },
                        });
                      } else {
                        res.json({
                          token: req.query.secret_token,
                          data: req.params.id,
                        });
                      }
                    });
                  }
                }
              });
            }
          });
        }
      });
    }
  });
};

exports.comment = function (req, res) {
  let comment = req.body;
  comment["task_id"] = req.params.id;
  comment["user_id"] = req.user.id;
  comment["update_time"] = new Date();
  Tasks.comment(comment, function (err, data) {
    if (err) res.send(err);
    else {
      res.json({ data, token: req.query.secret_token });
    }
  });
};

exports.deleteComment = function (req, res) {
  Tasks.removeComment(req.params.id, function (err, data) {
    if (err) {
      res.status(406).send({
        error: true,
        message: {
          text: err.sqlMessage ? err.sqlMessage : "Could not remove comment!",
          details: err,
        },
      });
    } else {
      res.json({ data, token: req.query.secret_token });
    }
  });
};
// exports.comments = function (req, res) {
//   Tasks.getTaskComments(req.params.id, function (err, data) {
//     if (err) res.send(err);
//     else {
//       res.json(data);
//     }
//   });
// };
