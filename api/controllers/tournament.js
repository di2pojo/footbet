const mongoose = require("mongoose");

const Tournament = require("../models/tournament");
const MatchTemplate = require("../models/matchTemplate");

exports.tournament_get_all = (req, res, next) => {
  Tournament.find()
    .select("matches name _id")
    .populate("matches", "matchNumber matchType homeTeam awayTeam")
    .exec()
    .then(tournament => {
      if (!tournament) {
        return res.status(404).json({
          message: "Order not found"
        });
      }
      res.status(200).json({
        tournament: tournament
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
};

exports.tournament_create_tournament = (req, res, next) => {
  Tournament.find({ "name": req.body.name })
    .then(tournament => {
      if (tournament.length > 0) {
        res.status(404).json({
          message: "Template already exists"
        });
      } else {
        req.body.matchIds = [];
        for (var i = 0; i < req.body.matches.length; i++) {
          var match = req.body.matches[i];
          const matchTemplate = new MatchTemplate({
            _id: mongoose.Types.ObjectId(),
            matchNumber: match.matchNumber,
            matchType: match.matchType,
            homeTeam: match.homeTeam,
            awayTeam: match.awayTeam
          });
          req.body.matchIds.push(matchTemplate._id);
          matchTemplate.save();
        };
        const tournament = new Tournament({
          _id: mongoose.Types.ObjectId(),
          name: req.body.name,
          matches: req.body.matchIds
        });
        tournament.save();
        res.status(201).json({
          message: "Tournament stored",
          createdOrder: tournament
        });
      }  
    });
};

exports.tournament_get_tournament = (req, res, next) => {
  Tournament.findById(req.params.tournamentId)
    .select("matches name _id")
    .populate("matches", "matchNumber matchType homeTeam awayTeam")
    .exec()
    .then(tournament => {
      if (!tournament) {
        return res.status(404).json({
          message: "Tournament not found"
        });
      }
      res.status(200).json({
        tournament: tournament
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
};

exports.tournament_delete_tournament = (req, res, next) => {
  Tournament.findById(req.params.tournamentId)
    .select("matches name _id")
    .populate("matches", "matchNumber matchType homeTeam awayTeam")
    .exec()
    .then(template => {
      for (var i = 0; i < template.matches.length; i++) {
        MatchTemplate.remove({ _id: template.matches[i]._id })
        .exec();
      }
    }).then(
      Tournament
      .remove({ _id: req.params.tournamentId })
      .exec()
      .then(result => {
          res.status(200).json({
          message: "Tournament deleted"
        });
      }))
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
};