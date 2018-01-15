const express = require("express");
const router = express.Router();
const AuthController = require('../middleware/check-auth');

const TournamentController = require('../controllers/tournament');

// Handle incoming GET requests to /tournament
router.get("/", TournamentController.tournament_get_all);

router.post("/", AuthController.checkAuth, TournamentController.tournament_create_tournament);

router.get("/:tournamentId", TournamentController.tournament_get_tournament);

router.delete("/:tournamentId", AuthController.adminAuth, TournamentController.tournament_delete_tournament);

module.exports = router;