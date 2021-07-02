"use strict";
const Tags = require("../models/tag.model");
var validate = require("validate.js");
var constraints = require("../validators/tag.validators");
var utils = require("./../../utils/main.utils");

exports.getTags = function (req, res) {
  Tags.get(function (err, data) {
    if (err) res.send(err);
    res.json({ data, token: req.query.secret_token });
  });
};

exports.createTag = function (req, res) {
  let checkResult = validate(req.body, constraints.createTag);
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
    Tags.findByName(req.body.name, function (err, foundTag) {
      if (err) {
        res.status(406).send({
          error: true,
          message: {
            text: err.sqlMessage
              ? err.sqlMessage
              : "Entered data are not acceptable",
            details: err,
          },
        });
      } else if (foundTag.length != 0) {
        res.status(406).send({
          error: true,
          message: {
            text: "Duplicated tag entered!",
            details: null,
          },
        });
      } else {
        Tags.create(req.body, function (err, tag) {
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
            res.json({
              token: req.query.secret_token,
              tag: tag,
            });
          }
        });
      }
    });
  }
};
