const express = require("express");
const router = express.Router();
const AuthController = require('../middleware/check-auth');

const TournamentController = require('../controllers/tournament');

// Handle incoming GET requests to /tournament
router.get("/", TournamentController.get_all);

router.post("/", TournamentController.create_tournament);

router.get("/:tournamentId", TournamentController.get_tournament);
router.get("/test/:tournamentId", TournamentController.test_get_tournament);

router.delete("/:tournamentId", TournamentController.delete_tournament);

module.exports = router;