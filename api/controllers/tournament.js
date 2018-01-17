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
    //TournamentMatch.remove()
    //    .exec()
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
                    let list = []
                    matches.forEach(async(match) => {
                        if (match.matchType === 'GROUP') {

                            const homeTeam = await findTeam(tournament._id, match.homeTeam);

                            const awayTeam = await findTeam(tournament._id, match.awayTeam);

                            const tmatch = await createTeam(tournament._id, match, homeTeam, awayTeam);


                            tmatch.save();
                        }
                    });

                    res.status(200).json({
                        tournament: tournament
                    });
                })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
};

createTeam = (tournamentId, match, homeTeam, awayTeam) => {
    return TournamentMatch.find({ 'tournament': tournamentId, 'matchNumber': match.matchNumber })
        .exec()
        .then(result => {
            console.log(result.length)
            if (result.length < 1) {

                console.log('not')
                const tournamentMatch = new TournamentMatch({
                    _id: mongoose.Types.ObjectId(),
                    tournament: tournamentId,
                    matchNumber: match.matchNumber,
                    matchType: match.matchType,
                    homeTeam: homeTeam.team._id,
                    awayTeam: awayTeam.team._id
                })
                console.log(tournamentMatch);
                return tournamentMatch;
            }
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
}

findTeam = (tournamentId, groupPos) => {
    return TournamentTeam.findOne({ 'tournament': tournamentId, 'groupPos': groupPos })
        .populate('team', '_id name flag')
        .exec()
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
}

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