import { RequestHandler } from "express";
import db from "../util/dbConnect";
import User from "../models/user.model";
import { isAtLeastFourCha, isEmail, isPassword } from "../util/validate";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const signUp: RequestHandler = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  if (!isAtLeastFourCha(firstName) || !isAtLeastFourCha(lastName)) {
    return res.status(404).json({ msg: "Invalid value" });
  }
  if (!isEmail(email)) {
    return res.status(404).json({ msg: "Invalid email" });
  }
  if (!isPassword(password)) {
    return res.status(404).json({ msg: "Invalid password" });
  }
  try {
    const haveUser = await db.execute<User[]>(
      "SELECT * FROM user WHERE email = ?",
      [email]
    );
    if (haveUser[0].length > 0)
      return res.status(404).json({ msg: "Email already exists" });
    const hashPassword = await bcrypt.hash(password, 12);
    await db.execute(
      "INSERT INTO user (firstName,lastName,email,password) VALUES(?,?,?,?)",
      [firstName, lastName, email, hashPassword]
    );
    const user = await db.execute<User[]>(
      "SELECT * FROM user WHERE email = ?",
      [email]
    );
    await db.execute("INSERT INTO cart (userId) VALUES(?)", [
      user[0][0].userId,
    ]);
    const transformUser = { ...user[0][0], password: undefined };
    const token = jwt.sign(transformUser, process.env.JWT_SECRET as string, {
      expiresIn: "1h",
    });
    res
      .status(200)
      .json({ msg: "Register success", token, user: transformUser });
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error });
  }
};

export const signIn: RequestHandler = async (req, res) => {
  const { email, password } = req.body;
  if (!isEmail(email)) {
    return res.status(404).json({ msg: "Invalid email" });
  }
  if (!isPassword(password)) {
    return res.status(404).json({ msg: "Invalid password" });
  }
  try {
    const haveUser = await db.execute<User[]>(
      "SELECT * FROM user WHERE email = ?",
      [email]
    );
    if (haveUser[0].length < 1)
      return res.status(401).json({ msg: "Incorrect email or password" });
    const pwIsMatch = await bcrypt.compare(
      password,
      haveUser[0][0].password as string
    );
    if (!pwIsMatch)
      return res.status(401).json({ msg: "Incorrect email or password" });
    const transformUser = { ...haveUser[0][0], password: undefined };
    const token = jwt.sign(transformUser, process.env.JWT_SECRET as string, {
      expiresIn: "1h",
    });
    res.status(200).json({ msg: "Login success", token, user: transformUser });
  } catch (error) {
    console.log(error)
    res.status(500).json({ error });
  }
};

export const getUser: RequestHandler = async (req, res) => {
  try {
    const [rows] = await db.execute<User[]>(
      "SELECT * FROM user WHERE userId = ?",
      [req.userId]
    );
    if (rows.length < 1)
      return res.status(401).json({ msg: "Can't find this user" });
    const transformUser = { ...rows[0], password: undefined };
    res.status(200).json({ user: transformUser });
  } catch (error) {
    return res.status(200).json({ user: null });
  }
};

export const updateUser: RequestHandler = async (req, res) => {
  const { firstName, lastName, address, phoneNumber } = req.body;

  try {
    await db.execute(
      "UPDATE user SET firstName = ?,lastName = ?,address = ?,phoneNumber = ? WHERE userId = ?",
      [firstName, lastName, address, phoneNumber, req.userId]
    );
    res.status(200).json({ msg: "Update success" });
  } catch (error) {
    return res.status(500).json({ error });
  }
};
