const express = require("express");
const router = express.Router();

const {updateStock} = require("../controllers/product");
const {isSignedIn, isAuthenticated, isAdmin } = require("../controllers/auth");
const {getUserById, pushOrderInPurchaseList } = require("../controllers/user");

const {getOrderById,createOrder,getAllOrders,updateStatus,getOrders,getOrderStatus} = require("../controllers/order");

//params
router.param("userId", getUserById);
router.param("orderId", getOrderById);

router.post("/create/order/:userId",isSignedIn, isAuthenticated, pushOrderInPurchaseList,updateStock, createOrder);

router.get("/order/all/:userId", isSignedIn, isAuthenticated,isAdmin,getAllOrders);
router.get("/orders/:userId", isSignedIn, isAuthenticated,getOrders);

router.get("/order/status/:userId", isSignedIn, isAuthenticated,getOrderStatus);
router.put("/order/:orderId/:userId", isSignedIn, isAuthenticated,isAdmin,updateStatus);
module.exports = router;