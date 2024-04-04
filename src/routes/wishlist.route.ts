import express from "express";
import {
  updateWishList,
  getWishList,
} from "../controllers/wishlist.controller";
import { validateToken } from "../middleware/validateToken";

const router = express.Router();

router.get("/wishlist", validateToken, getWishList);

router.post("/wishlist/update", validateToken, updateWishList);

export default router;
