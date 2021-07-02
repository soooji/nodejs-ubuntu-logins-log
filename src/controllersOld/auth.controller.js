"use strict";
const passport = require("passport");
const User = require("../models/auth.model");
var validate = require("validate.js");
var constraints = require("../validators/auth.validatros");
var utils = require("./../../utils/main.utils");
const jwt = require("jsonwebtoken");

exports.register = function (req, res) {
  let checkResult = validate(req.body, constraints.register);
  if (checkResult) {
    res.status(406).send({
      error: true,
      message: {
        text: "Entered data are not acceptable",
        details: checkResult,
      },
    });
  } else {
    User.findByUsername(req.body.username, function (err, foundUser) {
      if (err) {
        res.status(406).send({
          error: true,
          message: {
            text: "Cannot check username availability!",
            details: checkResult,
          },
        });
      } else if (!foundUser || foundUser.length != 0) {
        res.status(406).send({
          error: true,
          message: {
            text: "Duplicate username!",
            details: checkResult,
          },
        });
      } else {
        const new_user = new User(req.body);
        User.register(new_user, function (err, user) {
          if (err) {
            // res.send(err);
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
            res.json({ token: req.query.secret_token });
          }
        });
      }
    });
  }
};

exports.login = function (req, res, next) {
  passport.authenticate("local", async (err, user, info) => {
    try {
      if (err || !user) {
        return res.status(401).send({
          error: true,
          message: {
            text: err.message
              ? err.message
              : "Username or Password is incorrect",
            details: null,
          },
        });
      }
      req.login(user, { session: false }, async (error) => {
        if (error) return next(error);

        const body = { id: user.id, username: user.username };
        const token = jwt.sign({ user: body }, "TOP_SECRET");

        const userToSend = { ...user };
        delete userToSend.password;
        delete userToSend.salt;

        return res.json({ ...userToSend, token });
      });
    } catch (error) {
      res.status(401).send({
        error: true,
        message: {
          text: error.message
            ? error.message
            : "Username or Password is incorrect",
          details: null,
        },
      });
      // return next(error);
    }
  })(req, res, next);
  // passport.authenticate("local", (err, user, info) => {
  //   if (err) {
  //     console.log(err);
  //     return res.status(401).send({
  //       error: true,
  //       message: {
  //         text: "Password is incorrect",
  //         details: err,
  //       },
  //     });
  //   }

  //   if (!user) {
  //     return res.status(404).send({
  //       error: true,
  //       message: {
  //         text: "User not found",
  //         details: {},
  //       },
  //     });
  //   }
  //   req.login(user, (err) => {
  //     console.log(
  //       `req.session.passport: ${JSON.stringify(req.session.passport)}`
  //     );
  //     console.log(`req.user: ${JSON.stringify(req.user)}`);
  //     return res.send(req.user);
  //   });
  // })(req, res, next);
};

exports.logout = function (req, res) {
  if (req.user) {
    console.log("User logged out:");
    console.log(req.user);
  }
  req.logout();
  return res.send("You are successfully logged out!\n");
};

exports.forgetPassword = function (req, res) {
  let checkResult = validate(req.body, constraints.changePassword);
  if (checkResult) {
    res.status(406).send({
      error: true,
      message: {
        text: "Entered data are not acceptable",
        details: checkResult,
      },
    });
  } else {
    User.getAnswer(req.body.username, function (err, result) {
      if (err) {
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
        let newPass = utils.saltHash(req.body.password, result[0].salt);
        if (result[0].answer == req.body.answer) {
          User.changePassword(
            { ...req.body, password: newPass.passwordHash },
            function (err, result) {
              if (!err) {
                res.json({ token: req.query.secret_token });
              } else {
                res.status(406).send({
                  error: true,
                  message: {
                    text: err.sqlMessage
                      ? err.sqlMessage
                      : "Entered data are not acceptable",
                    details: err,
                  },
                });
              }
            }
          );
        } else {
          res.json({
            error: false,
            message: "Security answer is not cuurect!",
            data: null,
          });
        }
      }
    });
  }
};
