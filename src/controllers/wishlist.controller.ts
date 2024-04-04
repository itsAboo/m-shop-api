import { RequestHandler } from "express";
import db from "../util/dbConnect";
import { WishList } from "../models/wishlist.model";
import Product from "../models/product.model";

export const getWishList: RequestHandler = async (req, res) => {
  try {
    const [rows] = await db.execute<Product[]>(
      `SELECT p.* FROM product p
      INNER JOIN wishlist w ON p.productId = w.productId
      WHERE w.userId = ?`,
      [req.userId]
    );
    if (rows.length < 1) return res.status(200).json({ wishlist: [] });
    res.status(200).json({ wishlist: rows });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

export const updateWishList: RequestHandler = async (req, res) => {
  const { productId } = req.body;
  if (!productId) return res.status(404).json({ msg: "Invalid value" });
  try {
    const [wishlist] = await db.execute<WishList[]>(
      "SELECT * FROM wishlist WHERE userId = ? AND productId = ?",
      [req.userId, productId]
    );
    const filterWl = wishlist.filter((wl) => wl.productId === productId);
    if (filterWl.length > 0) {
      await db.execute("DELETE FROM wishlist WHERE wishListId = ?", [
        filterWl[0].wishListId,
      ]);
      return res.status(200).json({ msg: "Delete success" });
    }
    await db.execute("INSERT INTO wishlist (userId,productId) VALUES(?,?)", [
      req.userId,
      productId,
    ]);
    res.status(200).json({ msg: "Add wishlist success" });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

// export const deleteWishList: RequestHandler = async (req, res) => {
//   const { wishListId } = req.body;
//   try {
//     const [rows] = await db.execute<WishList[]>(
//       "SELECT * FROM wishlist WHERE userId = ?",
//       [req.userId]
//     );
//     const wlId = rows.filter((e: WishList) => e.userId == wishListId);
//     if (wlId.length < 1) return res.status(404).json({ msg: "No id found" });
//     await db.execute("DELETE FROM wishlist WHERE wishListId = ?", [
//       wlId[0].wishListId,
//     ]);
//     res.status(200).json({ msg: "Delete success" });
//   } catch (error) {
//     return res.status(500).json({ error });
//   }
// };
