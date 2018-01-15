const mongoose = require("mongoose");

const Team = require("../models/team");

exports.team_get_all = (req, res, next) => {
  Team.find()
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

exports.team_create_team = (req, res, next) => {
  Team.find()
    .select('name')
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
        if (currentTeams.indexOf(team.name) > -1 || createdTeams.indexOf(team.name) > -1) {
          createdTeams.push('Duplicate detected. ' + team.name + ' not created');
        } else {
          const teamToAdd = new Team({
            _id: mongoose.Types.ObjectId(),
            name: team.name,
            flag: team.flag
          });
          teamToAdd.save();
          createdTeams.push(team.name + ' created');
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

exports.team_get_team = (req, res, next) => {
  Team.findById(req.params.teamId)
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

exports.team_delete_team = (req, res, next) => {
  Team.remove({ _id: req.params.teamId })
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

exports.team_delete_all_teams = (req, res, next) => {
  Team.remove()
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