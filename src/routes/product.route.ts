import express from "express";
import {
  createProduct,
  getProduct,
  getProductByNewest,
  getProducts,
} from "../controllers/product.controller";

const router = express.Router();

router.post("/product/create", createProduct);

router.get("/product", getProducts);

router.get("/product/:id", getProduct);

router.get("/product/newest/:limit", getProductByNewest);

export default router;
