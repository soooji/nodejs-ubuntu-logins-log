"use strict";
var dbConn = require("./../../config/db.config");
var utils = require("../../utils/main.utils");
var mysql = require("mysql");
//user object create

var Stat = function () {};

Stat.users = function (days, result) {
  dbConn.query(
    `
       SELECT count(id) AS count, CAST(create_date AS DATE) AS date
       FROM users
       WHERE CAST(create_date AS DATE) <= DATE_ADD(CURRENT_DATE(), INTERVAL ? DAY)
       GROUP BY date
    `,
    days,
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

Stat.tasks = function (days, result) {
  dbConn.query(
    `
        SELECT count(id) AS count, CAST(create_date AS DATE) AS date
        FROM tasks
        WHERE CAST(create_date AS DATE) <= DATE_ADD(CURRENT_DATE(), INTERVAL ? DAY)
        GROUP BY date
     `,
    days,
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

Stat.projects = function (days, result) {
  dbConn.query(
    `
      SELECT count(id) AS count, CAST(create_date AS DATE) AS date
      FROM projects
      WHERE CAST(create_date AS DATE) <= DATE_ADD(CURRENT_DATE(), INTERVAL ? DAY)
      GROUP BY date
   `,
    days,
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

module.exports = Stat;
