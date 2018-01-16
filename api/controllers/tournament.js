const mongoose = require("mongoose");

const Tournament = require("../models/tournament");
const TournamentMatch = require("../models/tournamentMatch");
const TournamentTeam = require("../models/tournamentTeam");
const TournamentTemplate = require("../models/tournamentTemplate");

exports.get_all = (req, res, next) => {
    Tournament.find()
        .select("template name _id")
        .populate("template", "name")
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

exports.create_tournament = (req, res, next) => {
    Tournament.find({ "name": req.body.name })
        .then(tournament => {
            console.log(req.body);
            if (tournament.length > 0) {
                res.status(404).json({
                    message: "Tournament already exists"
                });
            } else {
                const tournament = new Tournament({
                    _id: mongoose.Types.ObjectId(),
                    name: req.body.name,
                    template: req.body.templateId
                });
                tournament.save();
                res.status(201).json({
                    message: "Tournament stored",
                    tournament: tournament.name,
                    tournamentId: tournament._id
                });
            };
        });
};

exports.test_get_tournament = (req, res, next) => {
    console.log('test');
    Tournament.findById(req.params.tournamentId)
        .select('template name _id')
        .populate('template', '_id')
        .exec()
        .then(tournament => {
            console.log(tournament.template._id)
            TournamentTemplate.findById(tournament.template._id)
                .select('matches')
                .populate('matches', 'matchNumber matchType homeTeam awayTeam')
                .exec()
                .then(template => {
                    console.log('test2')
                    return template.matches;
                })
                .then(matches => {
                    matches.forEach(match => {
                        console.log(match)
                        TournamentTeam.findOne({ 'tournament': tournament._id, 'groupPos': match.homeTeam })
                            .populate('team', 'name flag')
                            .exec()
                            .then(team => {
                                console.log('test')
                                const homeTeam = team.team._id
                            })
                            .catch(err => {
                                res.status(500).json({
                                    error: err
                                });
                            });
                        TournamentTeam.findOne({ 'tournament': tournament._id, 'groupPos': match.awayTeam })
                            .populate('team', 'name flag')
                            .exec()
                            .then(team => {
                                const awayTeam = team.team._id
                            })
                            .catch(err => {
                                res.status(500).json({
                                    error: err
                                });
                            });
                        const tournamentMatch = new TournamentMatch({
                            tournament: tournament._id,
                            matchNumber: match.matchNumber,
                            matchType: match.matchType,
                            homeTeam: homeTeam,
                            matchNumber: awayTeam

                        })
                        console.log(tournamentMatch)
                    });
                })


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

exports.get_tournament = (req, res, next) => {
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

exports.delete_tournament = (req, res, next) => {
    Tournament
        .remove({ _id: req.params.tournamentId })
        .exec()
        .then(result => {
            res.status(200).json({
                message: "Tournament deleted"
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
};