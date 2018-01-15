const mongoose = require("mongoose");

const MatchTemplate = require("../models/matchTemplate");

exports.matchTemplate_get_all = (req, res, next) => {
  MatchTemplate.find()
    .select("matchNumber matchType homeTeam awayTeam _id")
    .exec()
    .then(matchTemplate => {
      if (!matchTemplate) {
        return res.status(404).json({
          message: "Order not found"
        });
      }
      res.status(200).json({
        matchTemplate: matchTemplate
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
};

exports.matchTemplate_get_matchTemplate = (req, res, next) => {
  MatchTemplate.findById(req.params.matchTemplateId)
    .select("matchNumber matchType homeTeam awayTeam _id")
    .exec()
    .then(matchTemplate => {
      if (!matchTemplate) {
        return res.status(404).json({
          message: "MatchTemplate not found"
        });
      }
      res.status(200).json({
        matchTemplate: matchTemplate
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
};

exports.matchTemplate_delete_matchTemplate = (req, res, next) => {
  MatchTemplate.remove()
    .exec()
    .then(result => {
      res.status(200).json({
        message: "MatchTemplate deleted"
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
};