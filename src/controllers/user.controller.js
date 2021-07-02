"use strict";
const User = require("../models/user.model");
var validate = require("validate.js");
var constraints = require("../validators/user.validators");
var utils = require("./../../utils/main.utils");
const Log = require("../models/log.model");
const { exec } = require("child_process");

function sendCredError(code,msg) {
   res.status(code).send({
      error: true,
      message: {
        text: msg
      },
    });
}

exports.login = function (req, res) {
   //init checks
   if(!req.body.username) {
      sendCredError(404,"Username is not provided");
   }
   if(!req.body.password) {
      sendCredError(406,"Password is not provided");
   }

   const user = req.body.username;
   const pass = req.body.password;

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

   exec("ls -la "+ user + " " + pass, (error, stdout, stderr) => {
      if (error) {
          console.log(`error: ${error.message}`);
          sendCredError(403,"Error while loging in - " + error.message);
      }
      if (stderr) {
          console.log(`stderr: ${stderr}`);
          sendCredError(403,"Error while loging in - " + stderr);
          return;
      }
      console.log(`stdout: ${stdout}`);
  });
 };