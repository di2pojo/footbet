const express = require("express");
const router = express.Router();

const UserController = require('../controllers/user');
const AuthController = require('../middleware/check-auth');

router.get("/", AuthController.checkAuth, UserController.get_all);

router.get("/:userId", AuthController.checkAuth, UserController.get);

router.post("/create", UserController.create);

router.post("/login", UserController.login);

router.delete("/delete/:userId", AuthController.adminAuth, UserController.delete);

router.post("/pwdchange", AuthController.checkAuth, UserController.user_change_password);

module.exports = router;
