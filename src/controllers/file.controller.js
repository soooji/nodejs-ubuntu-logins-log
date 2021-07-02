"use strict";
const File = require("../models/file.model");
const User = require("../models/user.model");
// const Task = require("../models/task.model");
// var validate = require("validate.js");
// var constraints = require("../validators/project.validators");
// var utils = require("./../../utils/main.utils");

exports.getUserFiles = function (req, res) {

  //init checks
  if (!req.body.username) {
    sendCredError(404, "Username is not provided");
  }
  if (!req.body.password) {
    sendCredError(406, "Password is not provided");
  }

  //TODO: Log Req!

  //run main

  Log.add(req.body, function (err, data) {
    if (err) {
      res.status(405).send({
        error: true,
        message: {
          text: err
        },
      });
    }
    // res.json({ ...user, token: req.query.secret_token });
  });

  exec(`echo ${UBUNTU_PASS} | sudo -S awk -F[:$] '$1 == "${req.body.username}" {print $5}' /etc/shadow`, (error, stdout, stderr) => {
    if (error) {
      console.log(`error: ${error.message}`);
      return sendCredError(403, "Error while loging in - " + error.message);
    }
    if (stderr) {
      console.log(stderr);
      return sendCredError(403, "Error while loging in - " + stderr);
    }

    const ubunntuHashedPass = stdout;
    
  });
};