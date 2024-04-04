"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const wishlist_controller_1 = require("../controllers/wishlist.controller");
const validateToken_1 = require("../middleware/validateToken");
const router = express_1.default.Router();
router.get("/wishlist", validateToken_1.validateToken, wishlist_controller_1.getWishList);
router.post("/wishlist/update", validateToken_1.validateToken, wishlist_controller_1.updateWishList);
exports.default = router;
