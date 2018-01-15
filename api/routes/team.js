const express = require("express");
const router = express.Router();
const AuthController = require('../middleware/check-auth');

const TeamController = require('../controllers/team');

// Handle incoming GET requests to /team
router.get("/", TeamController.team_get_all);

router.post("/", TeamController.team_create_team);

router.get("/:teamId", TeamController.team_get_team);

router.delete("/:teamId", TeamController.team_delete_team);

router.delete("/", TeamController.team_delete_all_teams);

module.exports = router;
