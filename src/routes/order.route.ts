import express from "express";
import { createOrder, getOrders } from "../controllers/order.controller";
import { validateToken } from "../middleware/validateToken";

const router = express.Router();

router.post("/order", validateToken, createOrder);

router.get("/order", validateToken, getOrders);

export default router;
