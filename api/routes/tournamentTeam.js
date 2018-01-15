const express = require("express");
const router = express.Router();
const AuthController = require('../middleware/check-auth');

const TournamentTeamController = require('../controllers/tournamentTeam');

// Handle incoming GET requests to /tournamentTeam
router.get("/", TournamentTeamController.tournamentTeam_get_all);

router.post("/", TournamentTeamController.tournamentTeam_create_tournamentTeam);

router.get("/:tournamentTeamId", TournamentTeamController.tournamentTeam_get_tournamentTeam);

router.delete("/:tournamentTeamId", TournamentTeamController.tournamentTeam_delete_tournamentTeam);

router.delete("/", TournamentTeamController.tournamentTeam_delete_all_tournamentTeams);

module.exports = router;