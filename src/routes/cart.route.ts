import express from "express";
import {
  addCartItems,
  deleteCartItem,
  getCart,
  getCartItems,
  updateQuantity,
} from "../controllers/cart.controller";
import { validateToken } from "../middleware/validateToken";

const router = express.Router();

router.get("/cart",validateToken, getCart);

router.get("/cart-items", validateToken, getCartItems);

router.post("/cart", validateToken, addCartItems);

router.patch("/cart", validateToken, updateQuantity);

router.post("/cart/delete", validateToken, deleteCartItem);

export default router;
