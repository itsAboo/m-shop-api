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
exports.deleteCartItem = exports.updateQuantity = exports.addCartItems = exports.getCartItems = exports.getCart = void 0;
const dbConnect_1 = __importDefault(require("../util/dbConnect"));
const getCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [cart] = yield dbConnect_1.default.execute("SELECT * FROM cart WHERE userId = ?", [req.userId]);
        if (cart.length === 0)
            return res.status(404).json({ msg: "Cart not found" });
        res.status(200).json({ cart: cart[0] });
    }
    catch (error) {
        return res.status(500).json({ error });
    }
});
exports.getCart = getCart;
const getCartItems = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [cart] = yield dbConnect_1.default.execute("SELECT cartId FROM cart WHERE userId = ?", [req.userId]);
        if (cart.length < 1)
            return res.status(404).json({ msg: "Cart not found" });
        const [cartItems] = yield dbConnect_1.default.execute(`SELECT ci.productId, ci.quantity AS cartItemsQuantity ,ci.totalPrice AS cartItemsTotalPrice, ci.size, ci.color , p.name,p.description,p.imageUrl
      FROM cart_items ci 
      JOIN product p ON ci.productId = p.productId 
      WHERE ci.cartId = ?`, [cart[0].cartId]);
        res.status(200).json({ cart: cartItems });
    }
    catch (error) {
        return res.status(500).json({ error });
    }
});
exports.getCartItems = getCartItems;
const addCartItems = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { productId, size, color } = req.body;
    if (!productId || !size || !color)
        return res.status(404).json({ msg: "Invalid Value" });
    let totalCartItems;
    let totalCartPrice;
    let totalCartItemsQuantity;
    let totalCartItemsPrice;
    try {
        const [cart] = yield dbConnect_1.default.execute("SELECT * FROM cart WHERE userId = ?", [req.userId]);
        if (cart.length < 1)
            return res.status(404).json({ msg: "Cart not found" });
        const [cartItems] = yield dbConnect_1.default.execute("SELECT * FROM cart_items WHERE cartId = ?", [cart[0].cartId]);
        const [product] = yield dbConnect_1.default.execute("SELECT * FROM product WHERE productId = ?", [productId]);
        const cartItem = cartItems.filter((c) => c.productId === productId && c.size === size && c.color === color);
        if (cartItem.length === 0) {
            totalCartItems = Number(cart[0].totalCartItems) + 1;
            totalCartPrice = Number(cart[0].totalPrice) + Number(product[0].price);
            // totalCartItemsQuantity = Number(cartItem[0].quantity) + 1;
            // totalCartItemsPrice =
            //   Number(cartItem[0].quantity) * Number(product[0].price);
            yield dbConnect_1.default.execute("INSERT INTO cart_items (cartId,productId,quantity,totalPrice,color,size) VALUES(?,?,?,?,?,?)", [cart[0].cartId, productId, 1, product[0].price, color, size]);
            yield dbConnect_1.default.execute("UPDATE cart SET totalCartItems = ?,totalPrice = ? WHERE cartId = ?", [totalCartItems, totalCartPrice, cart[0].cartId]);
            return res.status(200).json({ msg: "Add to cart success" });
        }
        else {
            totalCartItemsQuantity = Number(cartItem[0].quantity) + 1;
            totalCartItemsPrice = totalCartItemsQuantity * Number(product[0].price);
            totalCartItems = Number(cart[0].totalCartItems) + 1;
            totalCartPrice = Number(cart[0].totalPrice) + Number(product[0].price);
            yield dbConnect_1.default.execute("UPDATE cart_items SET quantity = ?,totalPrice = ? WHERE cartItemsId = ?", [totalCartItemsQuantity, totalCartItemsPrice, cartItem[0].cartItemsId]);
            yield dbConnect_1.default.execute("UPDATE cart SET totalPrice = ?,totalCartItems = ? WHERE cartId = ?", [totalCartPrice, totalCartItems, cart[0].cartId]);
            res.status(200).json({ msg: "Update cart success" });
        }
    }
    catch (error) {
        return res.status(500).json({ error });
    }
});
exports.addCartItems = addCartItems;
const updateQuantity = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { productId, increase, decrease, size, color } = req.body;
    if (!productId || !size || !color)
        return res.status(404).json({ msg: "Invalid Value" });
    let totalCartItems;
    let totalCartPrice;
    let totalCartItemsQuantity;
    let totalCartItemsPrice;
    try {
        const [cart] = yield dbConnect_1.default.execute("SELECT * FROM cart WHERE userId = ?", [req.userId]);
        if (cart.length < 1)
            return res.status(404).json({ msg: "Cart not found" });
        const [cartItems] = yield dbConnect_1.default.execute("SELECT * FROM cart_items WHERE cartId = ?", [cart[0].cartId]);
        const [product] = yield dbConnect_1.default.execute("SELECT * FROM product WHERE productId = ?", [productId]);
        const cartItem = cartItems.filter((c) => c.productId === productId && c.color === color && c.size === size);
        if (cartItem.length === 0)
            return res.status(404).json({ msg: "Cart item not found" });
        if (increase && !decrease) {
            totalCartItemsQuantity = Number(cartItem[0].quantity) + 1;
            totalCartItemsPrice = totalCartItemsQuantity * Number(product[0].price);
            totalCartPrice = Number(cart[0].totalPrice) + Number(product[0].price);
            totalCartItems = Number(cart[0].totalCartItems) + 1;
            yield dbConnect_1.default.execute("UPDATE cart_items SET quantity = ?,totalPrice = ? WHERE cartItemsId = ? AND productId = ? AND color = ? AND size = ?", [
                totalCartItemsQuantity,
                totalCartItemsPrice,
                cartItem[0].cartItemsId,
                productId,
                color,
                size,
            ]);
            yield dbConnect_1.default.execute("UPDATE cart SET totalPrice = ?,totalCartItems = ? WHERE cartId = ?", [totalCartPrice, totalCartItems, cart[0].cartId]);
            return res.status(200).json({ msg: "update cart success" });
        }
        else if (!increase && decrease) {
            if (cartItem[0].quantity === 1) {
                totalCartPrice =
                    Number(cart[0].totalPrice) -
                        Number(Number(cartItem[0].quantity) * Number(product[0].price));
                totalCartItems = Number(cart[0].totalCartItems) - 1;
                yield dbConnect_1.default.execute("DELETE FROM cart_items WHERE cartItemsId = ?", [
                    cartItem[0].cartItemsId,
                ]);
                yield dbConnect_1.default.execute("UPDATE cart SET totalPrice = ?,totalCartItems = ? WHERE cartId = ?", [totalCartPrice, totalCartItems, cart[0].cartId]);
                return res.status(200).json({ msg: "Delete cart items success" });
            }
            totalCartItemsQuantity = Number(cartItem[0].quantity) - 1;
            totalCartItemsPrice = totalCartItemsQuantity * Number(product[0].price);
            totalCartPrice = Number(cart[0].totalPrice) - Number(product[0].price);
            totalCartItems = Number(cart[0].totalCartItems) - 1;
            yield dbConnect_1.default.execute("UPDATE cart_items SET quantity = ?,totalPrice = ? WHERE cartId = ? AND cartItemsId = ?", [
                totalCartItemsQuantity,
                totalCartItemsPrice,
                cart[0].cartId,
                cartItem[0].cartItemsId,
            ]);
            yield dbConnect_1.default.execute("UPDATE cart SET totalPrice = ?,totalCartItems = ? WHERE cartId = ?", [totalCartPrice, totalCartItems, cart[0].cartId]);
            return res.status(200).json({ msg: "Update cart success" });
        }
        else {
            return res.status(404).json({ msg: "Invalid value" });
        }
    }
    catch (error) {
        return res.status(500).json({ error });
    }
});
exports.updateQuantity = updateQuantity;
const deleteCartItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { productId, color, size } = req.body;
    if (!productId || !color || !size)
        return res.status(404).json({ msg: "Invalid value" });
    try {
        const [cart] = yield dbConnect_1.default.execute("SELECT * FROM cart WHERE userId = ?", [req.userId]);
        if (cart.length === 0)
            return res.status(404).json({ msg: "Cart not found" });
        const [cartItems] = yield dbConnect_1.default.execute("SELECT * FROM cart_items WHERE cartId = ?", [cart[0].cartId]);
        const cartItem = cartItems.filter((c) => c.productId === productId && c.color === color && c.size === size);
        if (cartItem.length === 0)
            return res.status(404).json({ msg: "Cart item not found" });
        const totalCartPrice = Number(cart[0].totalPrice) - Number(cartItem[0].totalPrice);
        const totalCartItems = Number(cart[0].totalCartItems) - Number(cartItem[0].quantity);
        yield dbConnect_1.default.execute("UPDATE cart SET totalPrice = ?, totalCartItems = ? WHERE cartId = ? AND userId = ?", [totalCartPrice, totalCartItems, cart[0].cartId, req.userId]);
        yield dbConnect_1.default.execute("DELETE FROM cart_items WHERE cartItemsId = ?", [
            cartItem[0].cartItemsId,
        ]);
        res.status(200).json({ msg: "Delete cart items success" });
    }
    catch (error) {
        return res.status(500).json({ error });
    }
});
exports.deleteCartItem = deleteCartItem;
