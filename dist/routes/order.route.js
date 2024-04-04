"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const order_controller_1 = require("../controllers/order.controller");
const validateToken_1 = require("../middleware/validateToken");
const router = express_1.default.Router();
router.post("/order", validateToken_1.validateToken, order_controller_1.createOrder);
router.get("/order", validateToken_1.validateToken, order_controller_1.getOrders);
exports.default = router;
