const express = require("express");
const router = express.Router();

const UserController = require('../controllers/user');
const AuthController = require('../middleware/check-auth');

router.get("/", AuthController.checkAuth, UserController.user_get_all);

router.post("/create", UserController.create);

router.post("/login", UserController.login);

router.delete("/delete/:userId", AuthController.adminAuth, UserController.user_delete);

router.post("/pwdchange", AuthController.checkAuth, UserController.user_change_password);

module.exports = router;
