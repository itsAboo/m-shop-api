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
exports.getOrders = exports.createOrder = void 0;
const dbConnect_1 = __importDefault(require("../util/dbConnect"));
const createOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { paymentMethod } = req.body;
    try {
        const [cart] = yield dbConnect_1.default.execute("SELECT * FROM cart WHERE userId = ?", [req.userId]);
        if (cart.length === 0)
            return res.status(404).json({ msg: "Cart not found" });
        const [cartItems] = yield dbConnect_1.default.execute("SELECT * FROM cart_items WHERE cartId = ?", [cart[0].cartId]);
        if (cartItems.length === 0)
            return res.status(404).json({ msg: "No cart items" });
        yield dbConnect_1.default.execute("INSERT INTO `order` (userId,cartId,status,shippingMethod,paymentMethod,totalPrice) VALUES(?,?,?,?,?,?)", [
            req.userId,
            cart[0].cartId,
            "success",
            "DHL eCommerce",
            paymentMethod,
            cart[0].totalPrice,
        ]);
        const [order] = yield dbConnect_1.default.execute("SELECT * FROM `order` WHERE userId = ? ORDER BY orderId DESC LIMIT 1", [req.userId]);
        for (const cartItem of cartItems) {
            yield dbConnect_1.default.execute("INSERT INTO order_items (orderId,productId,quantity,totalPrice,color,size) VALUES(?,?,?,?,?,?)", [
                order[0].orderId,
                cartItem.productId,
                cartItem.quantity,
                cartItem.totalPrice,
                cartItem.color,
                cartItem.size,
            ]);
        }
        yield dbConnect_1.default.execute("DELETE FROM cart_items WHERE cartId = ?", [
            cart[0].cartId,
        ]);
        yield dbConnect_1.default.execute("UPDATE cart SET totalPrice = 0,totalCartItems = 0 WHERE cartId = ?", [cart[0].cartId]);
        const [orderDetail] = yield dbConnect_1.default.execute(`SELECT oi.orderId, oi.productId, oi.quantity AS orderItemQuantity ,oi.totalPrice AS orderItemTotalPrice, oi.size, oi.color , p.name,p.imageUrl FROM order_items oi JOIN product p ON oi.productId = p.productId WHERE oi.orderId = ?`, [order[0].orderId]);
        res.status(200).json({
            msg: "Create order success",
            order: {
                details: orderDetail,
                orderId: order[0].orderId,
                totalPrice: order[0].totalPrice,
            },
        });
    }
    catch (error) {
        return res.status(500).json({ error });
    }
});
exports.createOrder = createOrder;
const getOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [orders] = yield dbConnect_1.default.execute("SELECT *, SUM(totalPrice) AS totalPrice FROM `order` WHERE userId = ? GROUP BY orderId", [req.userId]);
        const orderDetails = new Map();
        for (const order of orders) {
            const [orderItems] = yield dbConnect_1.default.execute(`SELECT oi.orderId, oi.productId, oi.quantity AS orderItemQuantity ,oi.totalPrice AS orderItemTotalPrice, oi.size, oi.color , p.name,p.imageUrl
            FROM order_items oi 
            JOIN product p ON oi.productId = p.productId 
            WHERE oi.orderId = ?`, [order.orderId]);
            orderDetails.set(order.orderId, {
                orderId: order.orderId,
                totalPrice: order.totalPrice,
                details: orderItems,
                createdAt: order.createdAt,
            });
        }
        const result = Array.from(orderDetails.values());
        res.status(200).json({ orders: result });
    }
    catch (error) {
        return res.status(500).json({ error });
    }
});
exports.getOrders = getOrders;
