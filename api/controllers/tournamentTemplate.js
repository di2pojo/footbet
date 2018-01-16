const mongoose = require("mongoose");

const TournamentTemplate = require("../models/tournamentTemplate");
const MatchTemplate = require("../models/matchTemplate");

exports.get_all = (req, res, next) => {
    TournamentTemplate.find()
        .select("matches name _id")
        .populate("matches", "matchNumber matchType homeTeam awayTeam")
        .exec()
        .then(tournamentTemplate => {
            if (!tournamentTemplate) {
                return res.status(404).json({
                    message: "Order not found"
                });
            }
            res.status(200).json({
                tournamentTemplate: tournamentTemplate
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
};

exports.create_tournamentTemplate = (req, res, next) => {
    TournamentTemplate.find({ "name": req.body.name })
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
                const tournamentTemplate = new TournamentTemplate({
                    _id: mongoose.Types.ObjectId(),
                    name: req.body.name,
                    matches: req.body.matchIds
                });
                tournamentTemplate.save();
                res.status(201).json({
                    message: "TournamentTemplate stored",
                    createdOrder: tournamentTemplate
                });
            }
        });
};

exports.get_tournamentTemplate = (req, res, next) => {
    TournamentTemplate.findById(req.params.tournamentTemplateId)
        .select("matches name _id")
        .populate("matches", "matchNumber matchType homeTeam awayTeam")
        .exec()
        .then(tournamentTemplate => {
            if (!tournamentTemplate) {
                return res.status(404).json({
                    message: "TournamentTemplate not found"
                });
            }
            res.status(200).json({
                tournamentTemplate: tournamentTemplate
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
};

exports.delete_tournamentTemplate = (req, res, next) => {
    TournamentTemplate.findById(req.params.tournamentTemplateId)
        .select("matches name _id")
        .populate("matches", "matchNumber matchType homeTeam awayTeam")
        .exec()
        .then(template => {
            for (var i = 0; i < template.matches.length; i++) {
                MatchTemplate.remove({ _id: template.matches[i]._id })
                    .exec();
            }
        }).then(
            TournamentTemplate
            .remove({ _id: req.params.tournamentTemplateId })
            .exec()
            .then(result => {
                res.status(200).json({
                    message: "TournamentTemplate deleted"
                });
            }))
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
};