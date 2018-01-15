const express = require("express");
const router = express.Router();
const AuthController = require('../middleware/check-auth');

const OrdersController = require('../controllers/orders');

// Handle incoming GET requests to /orders
router.get("/", AuthController.checkAuth, OrdersController.orders_get_all);

router.post("/", AuthController.checkAuth, OrdersController.orders_create_order);

router.get("/:orderId", AuthController.checkAuth, OrdersController.orders_get_order);

router.delete("/:orderId", AuthController.checkAuth, OrdersController.orders_delete_order);

module.exports = router;
