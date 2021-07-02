"use strict";
const Stat = require("../models/stat.model");
const User = require("../models/user.model");

function getError(res, err, then) {
  if (err) {
    return res.status(404).send({
      error: true,
      message: {
        text: err.sqlMessage ? err.sqlMessage : "Error whilte getting stats.",
        details: err,
      },
    });
  } else {
    then();
  }
}
exports.get = function (req, res) {
  User.getUserById(req.user.id, function (err, user) {
    if (err) res.send(err);
    if (!user.is_admin) {
      res.status(406).send({
        error: true,
        message: {
          text: "You don't have permission!",
          details: null,
        },
      });
    } else {
      let statsData = {
        projects: {
          weak: [],
          month: [],
        },
        tasks: {
          weak: [],
          month: [],
        },
        users: {
          weak: [],
          month: [],
        },
      };

      Stat.projects(7, function (err, weakProjects) {
        getError(res, err, function () {
          statsData.projects.weak = weakProjects;
          /////
          Stat.projects(30, function (err1, monthProjects) {
            getError(res, err1, function () {
              statsData.projects.month = monthProjects;
              /////
              Stat.users(7, function (err2, weakUsers) {
                getError(res, err2, function () {
                  statsData.users.weak = weakUsers;
                  /////
                  Stat.users(30, function (err3, monthUsers) {
                    getError(res, err3, function () {
                      statsData.users.month = monthUsers;
                      /////
                      Stat.tasks(7, function (err4, weakTasks) {
                        getError(res, err4, function () {
                          statsData.tasks.weak = weakTasks;
                          /////
                          Stat.tasks(30, function (err5, monthTasks) {
                            getError(res, err5, function () {
                              statsData.tasks.month = monthTasks;
                              /////
                              /////
                              return res.json({
                                data: statsData,
                                token: req.query.secret_token,
                              });
                              /////
                              /////
                            });
                          });
                          /////
                        });
                      });
                      /////
                    });
                  });
                  /////
                });
              });
              /////
            });
          });
          /////
        });
      });
    }
  });
};
