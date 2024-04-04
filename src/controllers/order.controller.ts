import { RequestHandler } from "express";
import db from "../util/dbConnect";
import { Cart, CartItems } from "../models/cart.model";
import { Order, OrderItems } from "../models/order.model";

export const createOrder: RequestHandler = async (req, res) => {
  const { paymentMethod } = req.body;
  try {
    const [cart] = await db.execute<Cart[]>(
      "SELECT * FROM cart WHERE userId = ?",
      [req.userId]
    );
    if (cart.length === 0)
      return res.status(404).json({ msg: "Cart not found" });
    const [cartItems] = await db.execute<CartItems[]>(
      "SELECT * FROM cart_items WHERE cartId = ?",
      [cart[0].cartId]
    );
    if (cartItems.length === 0)
      return res.status(404).json({ msg: "No cart items" });
    await db.execute(
      "INSERT INTO `order` (userId,cartId,status,shippingMethod,paymentMethod,totalPrice) VALUES(?,?,?,?,?,?)",
      [
        req.userId,
        cart[0].cartId,
        "success",
        "DHL eCommerce",
        paymentMethod,
        cart[0].totalPrice,
      ]
    );
    const [order] = await db.execute<Order[]>(
      "SELECT * FROM `order` WHERE userId = ? ORDER BY orderId DESC LIMIT 1",
      [req.userId]
    );
    for (const cartItem of cartItems) {
      await db.execute(
        "INSERT INTO order_items (orderId,productId,quantity,totalPrice,color,size) VALUES(?,?,?,?,?,?)",
        [
          order[0].orderId,
          cartItem.productId,
          cartItem.quantity,
          cartItem.totalPrice,
          cartItem.color,
          cartItem.size,
        ]
      );
    }
    await db.execute("DELETE FROM cart_items WHERE cartId = ?", [
      cart[0].cartId,
    ]);
    await db.execute(
      "UPDATE cart SET totalPrice = 0,totalCartItems = 0 WHERE cartId = ?",
      [cart[0].cartId]
    );
    const [orderDetail] = await db.execute(
      `SELECT oi.orderId, oi.productId, oi.quantity AS orderItemQuantity ,oi.totalPrice AS orderItemTotalPrice, oi.size, oi.color , p.name,p.imageUrl FROM order_items oi JOIN product p ON oi.productId = p.productId WHERE oi.orderId = ?`,
      [order[0].orderId]
    );
    res.status(200).json({
      msg: "Create order success",
      order: {
        details: orderDetail,
        orderId: order[0].orderId,
        totalPrice: order[0].totalPrice,
      },
    });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

export const getOrders: RequestHandler = async (req, res) => {
  try {
    const [orders] = await db.execute<Order[]>(
      "SELECT *, SUM(totalPrice) AS totalPrice FROM `order` WHERE userId = ? GROUP BY orderId",
      [req.userId]
    );

    const orderDetails = new Map();

    for (const order of orders) {
      const [orderItems] = await db.execute<OrderItems[]>(
        `SELECT oi.orderId, oi.productId, oi.quantity AS orderItemQuantity ,oi.totalPrice AS orderItemTotalPrice, oi.size, oi.color , p.name,p.imageUrl
            FROM order_items oi 
            JOIN product p ON oi.productId = p.productId 
            WHERE oi.orderId = ?`,
        [order.orderId]
      );

      orderDetails.set(order.orderId, {
        orderId: order.orderId,
        totalPrice: order.totalPrice,
        details: orderItems,
        createdAt: order.createdAt,
      });
    }

    const result = Array.from(orderDetails.values());

    res.status(200).json({ orders: result });
  } catch (error) {
    return res.status(500).json({ error });
  }
};
