"use strict";
var dbConn = require("./../../config/db.config");
// var utils = require("../../utils/main.utils");
var mysql = require("mysql");

var Tag = function (tag) {
  this.name = tag.name;
};

Tag.create = function (data, result) {
  dbConn.query("INSERT INTO tags set ?", data, function (err, res) {
    if (err) {
      console.log("error: ", err);
      result(err, null);
    } else {
      result(null, res.insertId);
    }
  });
};

Tag.get = function (result) {
  dbConn.query("Select id, name from tags", function (err, res) {
    if (err) {
      console.log("error: ", err);
      result(null, err);
    } else {
      result(null, res);
    }
  });
};

Tag.findByName = function (tagName, result) {
  dbConn.query(
    "Select id, name from tags WHERE name = ?",
    tagName,
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

// Tag.addTagsToTask = function (taskTags, result) {
//   if (taskTags.length == 0) {
//     return result(null, "Empty List!");
//   }
//   dbConn.query("INSERT INTO tasks_tags SET ?", taskTags, function (err, res) {
//     if (err) {
//       console.log("error: ", err);
//       result(err, null);
//     } else {
//       result(null, res.insertId);
//     }
//   });
// };

Tag.addTagsToTask = function (taskTags, result) {
  if (taskTags.length == 0) {
    return result(null, "Empty List!");
  }
  let error = null;
  for (let i = 0; i < taskTags.length; i++) {
    if (error) {
      return result(error, null);
    }
    dbConn.query(
      "INSERT INTO tasks_tags SET ?",
      taskTags[i],
      function (err, res) {
        if (err) {
          console.log("error: ", err);
          error = err;
        }
      }
    );
  }
  if (error) {
    return result(error, null);
  } else {
    result(null, "Success!");
  }
};

Tag.removeTaskTags = function (taskId, result) {
  dbConn.query(
    "DELETE FROM tasks_tags WHERE task_id = ?",
    taskId,
    function (err, res) {
      if (err) {
        console.log("error: ", err);
        result(err, null);
      } else {
        result(null, taskId);
      }
    }
  );
};

Tag.getTaskTags = function (taskId, result) {
  dbConn.query(
    `
    SELECT tags.id, tags.name
    FROM (
      tasks_tags INNER JOIN tags ON tasks_tags.tag_id = tags.id
    )
    WHERE tasks_tags.task_id = ${mysql.escape(taskId)}
    `,
    taskId,
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

module.exports = Tag;
