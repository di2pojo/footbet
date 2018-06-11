require('../config/config'); 
const Tournament = require('../models').Tournament;
const TournamentTeam = require('../models').TournamentTeam;
const TournamentMatch = require('../models').TournamentMatch;

exports.tournament_get_all = (req, res, next) => {
  Tournament.findAll({ include: [{
    model: TournamentTeam,
    as: 'teams'
  }] }).then(function (tournament) {
    res.json(tournament);
});

};

exports.tournament_create = (req, res, next) => {
  Tournament.find({
    where: {
      name: req.body.name
    }
  })
  .then(tournament => {
    if (tournament) {
      return res.status(409).json({
        message: "Tournament exists"
      });
    } else {
      Tournament.create({
        name: req.body.name,
        type: req.body.type,
        teams: req.body.teams,
        matches: req.body.matches
      }, {
        include: [{
          model: TournamentTeam,
          as: 'teams'
        },
        {
          model: TournamentMatch,
          as: 'matches'
        }],
      })
      .then(result => {
        console.log(result);
        res.status(201).json({
          message: "Tournament created"
        });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
    }
  });
};

exports.tournament_team_create = (req, res, next) => {
  TournamentTeam.find({
    where: {
      name: req.body.name
    }
  })
  .then(tournamentTeam => {
    if (tournamentTeam) {
      return res.status(409).json({
        message: "TournamentTeam exists"
      });
    } else {
      TournamentTeam.create(req.body)
      .then(result => {
        console.log(result);
        res.status(201).json({
          message: "TournamentTeam created"
        });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
    }
  });
};

exports.tournament_match_create = (req, res, next) => {
  Tournament.find({
    where: {
      id: req.body.tournamentMatch
    }
  })
  .then(tournament => {
    if (!tournament) {
      return res.status(409).json({
        message: "Tournament doesnt exists"
      });
    } else {
      TournamentMatch.create(req.body)
      .then(result => {
        console.log(result);
        res.status(201).json({
          message: "Tournament match created"
        });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
    }
  });
};
