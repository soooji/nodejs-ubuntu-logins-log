"use strict";
const User = require("../models/user.model");
var validate = require("validate.js");
var constraints = require("../validators/user.validators");
var utils = require("./../../utils/main.utils");
const Log = require("../models/log.model");
const { exec } = require("child_process");

const UBUNTU_PASS = "marzie78"

function sendCredError(res, code, msg) {
   res.status(code).send({
      error: true,
      message: {
         text: msg
      },
   });
}

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
 };
 