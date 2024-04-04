"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateWishList = exports.getWishList = void 0;
const dbConnect_1 = __importDefault(require("../util/dbConnect"));
const getWishList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [rows] = yield dbConnect_1.default.execute(`SELECT p.* FROM product p
      INNER JOIN wishlist w ON p.productId = w.productId
      WHERE w.userId = ?`, [req.userId]);
        if (rows.length < 1)
            return res.status(200).json({ wishlist: [] });
        res.status(200).json({ wishlist: rows });
    }
    catch (error) {
        return res.status(500).json({ error });
    }
});
exports.getWishList = getWishList;
const updateWishList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { productId } = req.body;
    if (!productId)
        return res.status(404).json({ msg: "Invalid value" });
    try {
        const [wishlist] = yield dbConnect_1.default.execute("SELECT * FROM wishlist WHERE userId = ? AND productId = ?", [req.userId, productId]);
        const filterWl = wishlist.filter((wl) => wl.productId === productId);
        if (filterWl.length > 0) {
            yield dbConnect_1.default.execute("DELETE FROM wishlist WHERE wishListId = ?", [
                filterWl[0].wishListId,
            ]);
            return res.status(200).json({ msg: "Delete success" });
        }
        yield dbConnect_1.default.execute("INSERT INTO wishlist (userId,productId) VALUES(?,?)", [
            req.userId,
            productId,
        ]);
        res.status(200).json({ msg: "Add wishlist success" });
    }
    catch (error) {
        return res.status(500).json({ error });
    }
});
exports.updateWishList = updateWishList;
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
