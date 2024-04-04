import { RequestHandler } from "express";
import db from "../util/dbConnect";
import { Cart, CartItems } from "../models/cart.model";
import Product from "../models/product.model";

export const getCart: RequestHandler = async (req, res) => {
  try {
    const [cart] = await db.execute<Cart[]>(
      "SELECT * FROM cart WHERE userId = ?",
      [req.userId]
    );
    if (cart.length === 0)
      return res.status(404).json({ msg: "Cart not found" });
    res.status(200).json({ cart: cart[0] });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

export const getCartItems: RequestHandler = async (req, res) => {
  try {
    const [cart] = await db.execute<Cart[]>(
      "SELECT cartId FROM cart WHERE userId = ?",
      [req.userId]
    );
    if (cart.length < 1) return res.status(404).json({ msg: "Cart not found" });
    const [cartItems] = await db.execute<CartItems[]>(
      `SELECT ci.productId, ci.quantity AS cartItemsQuantity ,ci.totalPrice AS cartItemsTotalPrice, ci.size, ci.color , p.name,p.description,p.imageUrl
      FROM cart_items ci 
      JOIN product p ON ci.productId = p.productId 
      WHERE ci.cartId = ?`,
      [cart[0].cartId]
    );
    res.status(200).json({ cart: cartItems });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

export const addCartItems: RequestHandler = async (req, res) => {
  const { productId, size, color } = req.body;
  if (!productId || !size || !color)
    return res.status(404).json({ msg: "Invalid Value" });
  let totalCartItems: number;
  let totalCartPrice: number;
  let totalCartItemsQuantity: number;
  let totalCartItemsPrice: number;
  try {
    const [cart] = await db.execute<Cart[]>(
      "SELECT * FROM cart WHERE userId = ?",
      [req.userId]
    );
    if (cart.length < 1) return res.status(404).json({ msg: "Cart not found" });
    const [cartItems] = await db.execute<CartItems[]>(
      "SELECT * FROM cart_items WHERE cartId = ?",
      [cart[0].cartId]
    );
    const [product] = await db.execute<Product[]>(
      "SELECT * FROM product WHERE productId = ?",
      [productId]
    );
    const cartItem = cartItems.filter(
      (c) => c.productId === productId && c.size === size && c.color === color
    );
    if (cartItem.length === 0) {
      totalCartItems = Number(cart[0].totalCartItems) + 1;
      totalCartPrice = Number(cart[0].totalPrice) + Number(product[0].price);
      // totalCartItemsQuantity = Number(cartItem[0].quantity) + 1;
      // totalCartItemsPrice =
      //   Number(cartItem[0].quantity) * Number(product[0].price);
      await db.execute(
        "INSERT INTO cart_items (cartId,productId,quantity,totalPrice,color,size) VALUES(?,?,?,?,?,?)",
        [cart[0].cartId, productId, 1, product[0].price, color, size]
      );
      await db.execute(
        "UPDATE cart SET totalCartItems = ?,totalPrice = ? WHERE cartId = ?",
        [totalCartItems, totalCartPrice, cart[0].cartId]
      );
      return res.status(200).json({ msg: "Add to cart success" });
    } else {
      totalCartItemsQuantity = Number(cartItem[0].quantity) + 1;
      totalCartItemsPrice = totalCartItemsQuantity * Number(product[0].price);
      totalCartItems = Number(cart[0].totalCartItems) + 1;
      totalCartPrice = Number(cart[0].totalPrice) + Number(product[0].price);
      await db.execute(
        "UPDATE cart_items SET quantity = ?,totalPrice = ? WHERE cartItemsId = ?",
        [totalCartItemsQuantity, totalCartItemsPrice, cartItem[0].cartItemsId]
      );
      await db.execute(
        "UPDATE cart SET totalPrice = ?,totalCartItems = ? WHERE cartId = ?",
        [totalCartPrice, totalCartItems, cart[0].cartId]
      );
      res.status(200).json({ msg: "Update cart success" });
    }
  } catch (error) {
    return res.status(500).json({ error });
  }
};

export const updateQuantity: RequestHandler = async (req, res) => {
  const { productId, increase, decrease, size, color } = req.body;
  if (!productId || !size || !color)
    return res.status(404).json({ msg: "Invalid Value" });

  let totalCartItems: number;
  let totalCartPrice: number;
  let totalCartItemsQuantity: number;
  let totalCartItemsPrice: number;

  try {
    const [cart] = await db.execute<Cart[]>(
      "SELECT * FROM cart WHERE userId = ?",
      [req.userId]
    );
    if (cart.length < 1) return res.status(404).json({ msg: "Cart not found" });
    const [cartItems] = await db.execute<CartItems[]>(
      "SELECT * FROM cart_items WHERE cartId = ?",
      [cart[0].cartId]
    );
    const [product] = await db.execute<Product[]>(
      "SELECT * FROM product WHERE productId = ?",
      [productId]
    );
    const cartItem = cartItems.filter(
      (c) => c.productId === productId && c.color === color && c.size === size
    );
    if (cartItem.length === 0)
      return res.status(404).json({ msg: "Cart item not found" });
    if (increase && !decrease) {
      totalCartItemsQuantity = Number(cartItem[0].quantity) + 1;
      totalCartItemsPrice = totalCartItemsQuantity * Number(product[0].price);
      totalCartPrice = Number(cart[0].totalPrice) + Number(product[0].price);
      totalCartItems = Number(cart[0].totalCartItems) + 1;
      await db.execute(
        "UPDATE cart_items SET quantity = ?,totalPrice = ? WHERE cartItemsId = ? AND productId = ? AND color = ? AND size = ?",
        [
          totalCartItemsQuantity,
          totalCartItemsPrice,
          cartItem[0].cartItemsId,
          productId,
          color,
          size,
        ]
      );
      await db.execute(
        "UPDATE cart SET totalPrice = ?,totalCartItems = ? WHERE cartId = ?",
        [totalCartPrice, totalCartItems, cart[0].cartId]
      );
      return res.status(200).json({ msg: "update cart success" });
    } else if (!increase && decrease) {
      if (cartItem[0].quantity === 1) {
        totalCartPrice =
          Number(cart[0].totalPrice) -
          Number(Number(cartItem[0].quantity) * Number(product[0].price));
        totalCartItems = Number(cart[0].totalCartItems) - 1;
        await db.execute("DELETE FROM cart_items WHERE cartItemsId = ?", [
          cartItem[0].cartItemsId,
        ]);
        await db.execute(
          "UPDATE cart SET totalPrice = ?,totalCartItems = ? WHERE cartId = ?",
          [totalCartPrice, totalCartItems, cart[0].cartId]
        );
        return res.status(200).json({ msg: "Delete cart items success" });
      }
      totalCartItemsQuantity = Number(cartItem[0].quantity) - 1;
      totalCartItemsPrice = totalCartItemsQuantity * Number(product[0].price);
      totalCartPrice = Number(cart[0].totalPrice) - Number(product[0].price);
      totalCartItems = Number(cart[0].totalCartItems) - 1;
      await db.execute(
        "UPDATE cart_items SET quantity = ?,totalPrice = ? WHERE cartId = ? AND cartItemsId = ?",
        [
          totalCartItemsQuantity,
          totalCartItemsPrice,
          cart[0].cartId,
          cartItem[0].cartItemsId,
        ]
      );
      await db.execute(
        "UPDATE cart SET totalPrice = ?,totalCartItems = ? WHERE cartId = ?",
        [totalCartPrice, totalCartItems, cart[0].cartId]
      );
      return res.status(200).json({ msg: "Update cart success" });
    } else {
      return res.status(404).json({ msg: "Invalid value" });
    }
  } catch (error) {
    return res.status(500).json({ error });
  }
};

export const deleteCartItem: RequestHandler = async (req, res) => {
  const { productId, color, size } = req.body;
  if (!productId || !color || !size)
    return res.status(404).json({ msg: "Invalid value" });
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
    const cartItem = cartItems.filter(
      (c) => c.productId === productId && c.color === color && c.size === size
    );
    if (cartItems.length === 0)
      return res.status(404).json({ msg: "Cart item not found" });
    await db.execute("DELETE FROM cart_items WHERE cartItemsId = ?", [
      cartItem[0].cartItemsId,
    ]);
    const totalCartPrice =
      Number(cart[0].totalPrice) - Number(cartItem[0].totalPrice);
    const totalCartItems =
      Number(cart[0].totalCartItems) - Number(cartItem[0].quantity);
    await db.execute(
      "UPDATE cart SET totalPrice = ?,totalCartItems = ? WHERE cartId = ?",
      [totalCartPrice, totalCartItems, cart[0].cartId]
    );
    res.status(200).json({ msg: "Delete cart items success" });
  } catch (error) {
    return res.status(500).json({ error });
  }
};
