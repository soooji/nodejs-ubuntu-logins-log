"use strict";
var dbConn = require("./../../config/db.config");
var utils = require("../../utils/main.utils");

//user object create

var User = function (user) {
  this.username = user.username;
  this.email = user.email;
  this.answer = user.answer;
  this.first_name = user.first_name;
  this.last_name = user.last_name;
    dbConn
  let hashResult = utils.saltHash(user.password);
  this.password = hashResult.passwordHash;
  this.salt = hashResult.salt;
};

User.register = function (newUser, result) {
  let reformedUser = { ...newUser, create_date: new Date() };
  dbConn.query("INSERT INTO users set ?", reformedUser, function (err, res) {
    if (err) {
      console.log("error: ", err);
      result(err, null);
    } else {
      result(null, res.insertId);
    }
  });
};

User.changePassword = function (user, result) {
  dbConn.query(
    "UPDATE users SET password=? WHERE username = ?",
    [user.password, user.username],
    function (err, res) {
      if (err) {
        console.log("error: ", err);
        result(null, err);
      } else {
        result(null, res);
      }
    }
  );
};

User.getAnswer = function (username, result) {
  dbConn.query(
    "Select id, username, answer, salt  from users where username = ? ",
    username,
    function (err, res) {
      if (err) {
        console.log("error: ", err);
        result(err, null);
      } else {
        result(null, res);
      }
    }
  );
};

User.findByUsername = function (username, result) {
  dbConn.query(
    "Select id, username, email, password, salt, first_name, last_name from users where username = ? ",
    username,
    function (err, res) {
      if (err) {
        console.log("error: ", err);
        result(err, null);
      } else {
        result(null, res);
      }
    }
  );
};

module.exports = User;
