import { RequestHandler } from "express";
import Product from "../models/product.model";
import db from "../util/dbConnect";
import { FieldPacket } from "mysql2";

interface IQueryProduct {
  sort?: "asc" | "desc" | "newest";
  category?: string;
  colors?: string;
  min?: number;
  max?: number;
  keyword?: string;
}

export const createProduct: RequestHandler = async (req, res) => {
  const {
    name,
    description,
    imageUrl,
    price,
    type,
    category,
    subCategory,
    colors,
  }: Product = req.body;
  let query = `INSERT INTO product (name,description,imageUrl,price,colors,type,category,subCategory)
      VALUES(?,?,?,?,?,?,?,?)`;
  let value = [
    name,
    description,
    imageUrl,
    price,
    colors,
    type,
    category,
    subCategory,
  ];
  if (!name || !price) return res.status(404).json({ msg: "Invalid value" });
  if (!colors) {
    query = `INSERT INTO product (name,description,imageUrl,price,type,category,subCategory)
      VALUES(?,?,?,?,?,?,?)`;
    value.splice(4, 1);
  }
  try {
    await db.execute(query, value);
    res.status(200).json({ msg: " Add product success" });
  } catch (error) {
    return res.status(500).json({ msg: "Bad request" });
  }
};

export const getProducts: RequestHandler = async (req, res) => {
  const reqQuery: IQueryProduct = req.query;
  try {
    const allowProperties = [
      "sort",
      "colors",
      "category",
      "min",
      "max",
      "keyword",
    ];
    const unexpectedProperties = Object.keys(reqQuery).filter(
      (prop) => !allowProperties.includes(prop)
    );
    if (unexpectedProperties.length > 0) {
      return res.status(404).json({ msg: "Not found" });
    }
    let result: [Product[], FieldPacket[]];
    let sql = "SELECT * FROM product";
    if (reqQuery.sort) {
      if (reqQuery.sort === "asc" || reqQuery.sort === "desc") {
        sql += ` ORDER BY price ${reqQuery.sort || "asc"}`;
      } else if (reqQuery.sort === "newest") {
        sql += ` ORDER BY createdAt DESC`;
      }
    }
    result = await db.execute<Product[]>(sql);
    if (reqQuery.keyword) {
      result[0] = result[0].filter(
        (val) =>
          val.name?.toLowerCase().includes(reqQuery.keyword!.toLowerCase()) ||
          val.category
            ?.toLowerCase()
            .includes(reqQuery.keyword!.toLowerCase()) ||
          val.type?.toLowerCase().includes(reqQuery.keyword!.toLowerCase())
      );
    }
    if (reqQuery.colors) {
      const colorArr = reqQuery.colors.split(",");
      result[0] = result[0].filter((val) =>
        colorArr.every((color) => val.colors?.includes(color))
      );
    }
    if (reqQuery.category) {
      const categoryArr = reqQuery.category.split(",");
      result[0] = result[0].filter((val) =>
        categoryArr.some((e) => val.category?.includes(e))
      );
    }
    if (reqQuery.min && reqQuery.max) {
      result[0] = result[0].filter((val) => {
        return (
          val.price! >= Number(reqQuery.min) &&
          val.price! <= Number(reqQuery.max)
        );
      });
    }
    return res.status(200).json({ products: result[0] });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

export const getProduct: RequestHandler = async (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(500).json({ msg: "Invalid value" });
  try {
    const result = await db.execute<Product[]>(
      "SELECT * FROM product WHERE productId = ?",
      [id]
    );
    if (result[0].length < 1)
      return res.status(404).json({ msg: "No product found" });
    res.status(200).json({ product: result[0][0] });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

export const getProductByNewest: RequestHandler = async (req, res) => {
  const { limit } = req.params;
  try {
    const result = await db.execute(
      "SELECT * FROM product ORDER BY createdAt DESC LIMIT ? ",
      [limit]
    );
    res.status(200).json({ products: result[0] });
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error });
  }
};
