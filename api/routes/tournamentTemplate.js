const express = require("express");
const router = express.Router();
const AuthController = require('../middleware/check-auth');

const TournamentTemplateController = require('../controllers/tournamentTemplate');

// Handle incoming GET requests to /tournamentTemplate
router.get("/", TournamentTemplateController.tournamentTemplate_get_all);

router.post("/", AuthController.checkAuth, TournamentTemplateController.tournamentTemplate_create_tournamentTemplate);

router.get("/:tournamentTemplateId", TournamentTemplateController.tournamentTemplate_get_tournamentTemplate);

router.delete("/:tournamentTemplateId", AuthController.adminAuth, TournamentTemplateController.tournamentTemplate_delete_tournamentTemplate);

module.exports = router;
