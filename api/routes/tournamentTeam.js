const express = require("express");
const router = express.Router();
const AuthController = require('../middleware/check-auth');

const TournamentTeamController = require('../controllers/tournamentTeam');

// Handle incoming GET requests to /tournamentTeam
router.get("/", TournamentTeamController.get_all);

router.post("/", TournamentTeamController.create_team);

router.get("/:tournamentTeamId", TournamentTeamController.get_team);

router.delete("/:tournamentTeamId", TournamentTeamController.delete_team);

router.delete("/", TournamentTeamController.delete_all_teams);

module.exports = router;