const express = require("express");
const router = express.Router();
const AuthController = require('../middleware/check-auth');

const TournamentTemplateController = require('../controllers/tournamentTemplate');

// Handle incoming GET requests to /tournamentTemplate
router.get("/", TournamentTemplateController.get_all);

router.post("/", AuthController.checkAuth, TournamentTemplateController.create_tournamentTemplate);

router.get("/:tournamentTemplateId", TournamentTemplateController.get_tournamentTemplate);

router.delete("/:tournamentTemplateId", AuthController.adminAuth, TournamentTemplateController.delete_tournamentTemplate);

module.exports = router;