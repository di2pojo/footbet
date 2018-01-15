const express = require("express");
const router = express.Router();
const AuthController = require('../middleware/check-auth');

const TeamController = require('../controllers/team');

// Handle incoming GET requests to /team
router.get("/", TeamController.get_all);

router.get("/ids", TeamController.get_all_ids);

router.post("/", TeamController.create_team);

router.get("/:teamId", TeamController.get_team);

router.delete("/:teamId", TeamController.delete_team);

router.delete("/", TeamController.delete_all_teams);

module.exports = router;