"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../controllers/user.controller");
const validateToken_1 = require("../middleware/validateToken");
const router = express_1.default.Router();
router.post("/signup", user_controller_1.signUp);
router.post("/signin", user_controller_1.signIn);
router.get("/user", validateToken_1.validateUser, user_controller_1.getUser);
router.patch("/user", validateToken_1.validateToken, user_controller_1.updateUser);
exports.default = router;
