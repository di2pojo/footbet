const mongoose = require("mongoose");

const TournamentTeam = require("../models/tournamentTeam");

exports.get_all = (req, res, next) => {
    TournamentTeam.find()
        .select('tournament team groupPos')
        .populate('tournament', 'name')
        .populate('team', 'name flag')
        .exec()
        .then(team => {
            if (team.length === 0) {
                return res.status(404).json({
                    message: "No teams found"
                });
            }
            res.status(200).json({
                team: team
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
};

exports.create_team = (req, res, next) => {
    TournamentTeam.find({ 'tournament': req.body.tournamentId })
        .exec()
        .then(teams => {
            const currentTeams = [];
            teams.forEach(team => {
                currentTeams.push(team.name)
            })
            return currentTeams;
        })
        .then(currentTeams => {
            let createdTeams = [];
            req.body.teams.forEach(team => {
                if (currentTeams.indexOf(team.teamId) > -1 || createdTeams.indexOf(team.teamId) > -1) {
                    createdTeams.push('Duplicate detected. ' + team.teamId + ' not created');
                } else {
                    const teamToAdd = new TournamentTeam({
                        _id: mongoose.Types.ObjectId(),
                        tournament: req.body.tournamentId,
                        team: team.teamId,
                        groupPos: team.groupPos
                    });
                    teamToAdd.save();
                    createdTeams.push(team.teamId + ' created');
                }
            })
            return createdTeams;
        })
        .then(createdTeams => {
            res.status(201).json({
                message: "Teams stored",
                teams: createdTeams
            });
        })
};

exports.get_team = (req, res, next) => {
    TournamentTeam.findById(req.params.teamId)
        .exec()
        .then(team => {
            if (!team) {
                return res.status(404).json({
                    message: "Team not found"
                });
            }
            res.status(200).json({
                team: team
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
};

exports.delete_team = (req, res, next) => {
    TournamentTeam.remove({ _id: req.params.teamId })
        .exec()
        .then(result => {
            res.status(200).json({
                message: "Team deleted"
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
};

exports.delete_all_teams = (req, res, next) => {
    TournamentTeam.remove()
        .exec()
        .then(result => {
            res.status(200).json({
                message: "All teams deleted"
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
};