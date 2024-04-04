"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cart_controller_1 = require("../controllers/cart.controller");
const validateToken_1 = require("../middleware/validateToken");
const router = express_1.default.Router();
router.get("/cart", validateToken_1.validateToken, cart_controller_1.getCart);
router.get("/cart-items", validateToken_1.validateToken, cart_controller_1.getCartItems);
router.post("/cart", validateToken_1.validateToken, cart_controller_1.addCartItems);
router.patch("/cart", validateToken_1.validateToken, cart_controller_1.updateQuantity);
router.post("/cart/delete", validateToken_1.validateToken, cart_controller_1.deleteCartItem);
exports.default = router;
