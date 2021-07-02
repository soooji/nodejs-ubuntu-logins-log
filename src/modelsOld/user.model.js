"use strict";
var dbConn = require("./../../config/db.config");
var utils = require("../../utils/main.utils");
//user object create

var User = function (user) {
  this.username = user.username;
  this.email = user.email;
  this.security_question = user.security_question;
  this.security_answer = user.security_answer;

  let hashResult = utils.saltHash(user.password);
  this.password = hashResult.passwordHash;
  this.salt = hashResult.salt;
};

User.getUserById = function (userId, result) {
  dbConn.query(
    "Select id, username, email, first_name, last_name, is_admin from users where id = ? ",
    userId,
    function (err, res) {
      if (err) {
        console.log("error: ", err);
        return result(err, null);
      } else {
        if (res.length > 0) {
          return result(null, res[0]);
        } else {
          return result(null, { sqlMessage: "User not found" });
        }
      }
    }
  );
};

User.getUsers = function (result) {
  dbConn.query(
    "Select id, username, email, first_name, last_name, is_admin from users",
    function (err, res) {
      if (err) {
        console.log("error: ", err);
        result(null, err);
      } else {
        console.log("user : ", res);
        result(null, res);
      }
    }
  );
};
// Update user profile:

User.updateUserProfile = function (userId, user, result) {
  let query = "UPDATE users SET first_name=?,last_name=?,email=? WHERE id = ?";
  let data = [user.first_name, user.last_name, user.email, userId];

  dbConn.query(query, data, function (err, res) {
    if (err) {
      console.log("error: ", err);
      result(err, null);
    } else {
      console.log(res);
      result(null, res);
    }
  });
};
User.updateUserProfileByAdmin = function (userId, user, result) {
  let query =
    "UPDATE users SET first_name=?,last_name=?,email=?, is_admin=? WHERE id = ?";
  let data = [
    user.first_name,
    user.last_name,
    user.email,
    user.is_admin,
    userId,
  ];

  dbConn.query(query, data, function (err, res) {
    if (err) {
      console.log("error: ", err);
      result(err, null);
    } else {
      console.log(res);
      result(null, res);
    }
  });
};

User.findByUsername = function (username, result) {
  dbConn.query(
    "Select id, username, email, password, salt, first_name, last_name, is_admin from users where username = ? ",
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

User.findById = function (id, result) {
  dbConn.query(
    "Select id, username, email, password, salt, first_name, last_name from users where id = ? ",
    id,
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

User.changePassword = function (user, result) {
  dbConn.query(
    "UPDATE users SET password=? WHERE id = ?",
    [user.password, user.id],
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

// User.getUserByUsername = function (username, result) {
//   dbConn.query("Select id, first_name, last_name, is_admin, email, username from users where username = ? ", username, function (
//     err,
//     res
//   ) {
//     if (err) {
//       console.log("error: ", err);
//       return result(err, null);
//     } else {
//       if (res.length != 0) {
//         return result(null, res[0].id);
//       } else {
//         return result({ sqlMessage: "User not found" }, null);
//       }
//     }
//   });
// };

module.exports = User;
