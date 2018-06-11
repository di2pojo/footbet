const express = require("express");
const router = express.Router();

const TournamentController = require('../controllers/tournament');
const AuthController = require('../middleware/check-auth');

router.get("/", TournamentController.tournament_get_all);

router.post("/create", TournamentController.tournament_create);

router.post("/createteam", TournamentController.tournament_team_create);

router.post("/creatematch", TournamentController.tournament_match_create);

module.exports = router;
