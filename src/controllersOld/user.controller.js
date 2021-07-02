"use strict";
const User = require("../models/user.model");
var validate = require("validate.js");
var constraints = require("../validators/user.validators");
var utils = require("./../../utils/main.utils");

exports.updateProfile = function (req, res) {
  let checkResult = validate(req.body, constraints.updateUserProfile);
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
    User.updateUserProfile(req.user.id, req.body, function (err, user) {
      if (err) {
        console.log(err);
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
};

exports.getUser = function (req, res) {
  User.getUserById(req.user.id, function (err, user) {
    if (err) res.send(err);
    res.json({ ...user, token: req.query.secret_token });
  });
};

exports.getUsers = function (req, res) {
  User.getUserById(req.user.id, function (err, user) {
    if (err) res.send(err);
    User.getUsers(function (err, users) {
      if (err) res.send(err);
      res.json({ users, token: req.query.secret_token });
    });
  });
};

exports.putUserByAdmin = function (req, res) {
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
      User.updateUserProfileByAdmin(
        req.params.id,
        req.body,
        function (err, users) {
          if (err) res.send(err);
          res.json({ data: users, token: req.query.secret_token });
        }
      );
    }
  });
};

exports.getUserItem = function (req, res) {
  User.getUserById(req.user.id, function (err, user) {
    if (err) res.send(err);
    console.log(user.is_admin);
    if (!user.is_admin) {
      res.status(406).send({
        error: true,
        message: {
          text: "You don't have permission!",
          details: null,
        },
      });
    } else {
      User.getUserById(req.params.id, function (err, user) {
        if (err) res.send(err);
        res.json({ user, token: req.query.secret_token });
      });
    }
  });
};

exports.changePassword = function (req, res) {
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
    User.findById(req.user.id, function (err, user) {
      if (!err && user[0]) {
        const hashedPass = utils.saltHash(req.body.oldPassword, user[0].salt);
        const newHashedPass = utils.saltHash(req.body.password, user[0].salt);
        if (hashedPass.passwordHash === user[0].password) {
          User.changePassword(
            { password: newHashedPass.passwordHash, id: user[0].id },
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
          return done(Error("Username or password is incorrect!"), null);
        }
      } else {
        return done(err, null);
      }
    });
  }
};
