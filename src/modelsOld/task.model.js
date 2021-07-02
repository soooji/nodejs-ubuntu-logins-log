"use strict";
var dbConn = require("./../../config/db.config");
var utils = require("../../utils/main.utils");
const mysql = require("mysql");

var Task = function (data) {
  this.name = data.name;
  this.description = data.description;
  this.project_id = data.project_id;
  this.start_date = data.start_date;
  this.end_date = data.end_date;
  this.estimated_time = data.estimated_time;
  this.story_point = data.story_point;
  this.status_id = data.status_id;
};

Task.getAll = function (result) {
  dbConn.query(
    `
    SELECT tasks.*, projects.name as project_name, projects.description as project_description
    FROM tasks INNER JOIN projects ON tasks.project_id = projects.id
    `,
    function (err, res) {
      if (err) {
        console.log("error: ", err);
        return result(err, null);
      } else {
        return result(null, res);
      }
    }
  );
};

Task.get = function (taskId, result) {
  dbConn.query(
    "Select * from tasks where id = ? ",
    taskId,
    function (err, res) {
      if (err) {
        console.log("error: ", err);
        return result(err, null);
      } else {
        return result(null, res);
      }
    }
  );
};

Task.create = function (data, result) {
  let reformedData = { ...data, create_date: new Date() };
  dbConn.query("INSERT INTO tasks set ?", reformedData, function (err, res) {
    if (err) {
      console.log("error: ", err);
      result(err, null);
    } else {
      result(null, res.insertId);
    }
  });
};

Task.createUserTasks = function (taskUsers, result) {
  if (taskUsers.length == 0) {
    return result(null, "Empty List!");
  }
  let error = null;
  for (let i = 0; i < taskUsers.length; i++) {
    if (error) {
      return result(error, null);
    }
    dbConn.query(
      "INSERT INTO users_tasks SET ?",
      taskUsers[i],
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

Task.getTaskUsers = function (taskId, result) {
  dbConn.query(
    `
    SELECT users.id, users.username, users.first_name, users.last_name, users.email
    FROM (
      users_tasks INNER JOIN users ON users_tasks.user_id = users.id
    )
    WHERE users_tasks.task_id = ${mysql.escape(taskId)}
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

Task.removeUserTasks = function (taskId, result) {
  dbConn.query(
    "DELETE FROM users_tasks WHERE task_id = ?",
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

Task.removeTask = function (taskId, result) {
  dbConn.query("DELETE FROM tasks WHERE id = ?", taskId, function (err, res) {
    if (err) {
      console.log("error: ", err);
      result(err, null);
    } else {
      result(null, taskId);
    }
  });
};

Task.removeProjectTasks = function (projectId, result) {
  dbConn.query(
    "DELETE FROM tasks WHERE project_id = ?",
    projectId,
    function (err, res) {
      if (err) {
        console.log("error: ", err);
        result(err, null);
      } else {
        result(null, projectId);
      }
    }
  );
};

Task.updateTask = function (id, task, result) {
  let data = { ...task };
  delete data.users;
  delete data.tags;
  dbConn.query(
    `UPDATE tasks SET ? WHERE id = ${mysql.escape(id)}`,
    data,
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

//for lists
Task.getAllTaskUsers = function (result) {
  dbConn.query(
    `
    SELECT users_tasks.task_id,users.id, users.username, users.first_name, users.last_name, users.email
    FROM ((
      tasks INNER JOIN users_tasks ON tasks.id = users_tasks.task_id
    ) INNER JOIN users)
    WHERE users.id = users_tasks.user_id
    `,
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

Task.getAllTaskTags = function (result) {
  dbConn.query(
    `
    SELECT tasks_tags.task_id, tags.id, tags.name
    FROM ((
      tasks INNER JOIN tasks_tags ON tasks.id = tasks_tags.task_id
    ) INNER JOIN tags)
    WHERE tags.id = tasks_tags.tag_id
    `,
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

Task.comment = function (data, result) {
  dbConn.query("INSERT INTO comments set ?", data, function (err, res) {
    if (err) {
      console.log("error: ", err);
      result(err, null);
    } else {
      result(null, res.insertId);
    }
  });
};

Task.getTaskComments = function (taskId, result) {
  dbConn.query(
    `
    SELECT comments.*, users.id as user_id, users.first_name, users.last_name, users.email
    FROM (comments INNER JOIN users ON comments.user_id = users.id)
    WHERE comments.task_id = ${mysql.escape(taskId)}
    ORDER BY id DESC
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
Task.removeComment = function (commentId, result) {
  dbConn.query(
    "DELETE FROM comments WHERE id = ?",
    commentId,
    function (err, res) {
      if (err) {
        console.log("error: ", err);
        result(err, null);
      } else {
        result(null, res.insertId);
      }
    }
  );
};

module.exports = Task;
