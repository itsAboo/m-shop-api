import express from "express";
import {
  getUser,
  signIn,
  signUp,
  updateUser,
} from "../controllers/user.controller";
import { validateToken, validateUser } from "../middleware/validateToken";

const router = express.Router();

router.post("/signup", signUp);

router.post("/signin", signIn);

router.get("/user", validateUser, getUser);

router.patch("/user", validateToken, updateUser);

export default router;
