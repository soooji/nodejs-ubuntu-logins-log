"use strict";
var dbConn = require("./../../config/db.config");
var utils = require("../../utils/main.utils");
var mysql = require("mysql");
//user object create

var Project = function (project) {
  this.name = project.name;
  this.description = project.description;
};

Project.create = function (newProject, result) {
  let reformedData = { ...newProject, create_date: new Date() };
  dbConn.query("INSERT INTO projects set ?", reformedData, function (err, res) {
    if (err) {
      console.log("error: ", err);
      result(err, null);
    } else {
      result(null, res.insertId);
    }
  });
};

Project.updateProject = function (id, project, result) {
  dbConn.query(
    "UPDATE projects SET name=?, description=? WHERE id = ?",
    [project.name, project.description, id],
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

Project.getProjects = function (result) {
  dbConn.query(
    "Select id, name, description from projects",
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

Project.getProject = function (id, result) {
  dbConn.query(
    `Select id, name, description from projects where id = ${mysql.escape(
      id
    )} `,
    function (err, res) {
      if (err) {
        console.log("error: ", err);
        return result(err, null);
      } else {
        if (res.length > 0) {
          return result(null, res[0]);
        } else {
          return result({ sqlMessage: "Project not found" }, null);
        }
      }
    }
  );
};

Project.getProjectTasks = function (id, result) {
  dbConn.query(
    `SELECT * FROM tasks WHERE tasks.project_id = ${mysql.escape(id)} `,
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

Project.deleteProject = function (id, result) {
  dbConn.query(
    `DELETE FROM projects WHERE id = ${mysql.escape(id)}`,
    function (err, res) {
      if (err) {
        console.log("error: ", err);
        return result(err, null);
      } else {
        return result(null, "Project deleted!");
      }
    }
  );
};

module.exports = Project;
