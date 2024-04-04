import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import User from "../models/user.model";

export const validateToken: RequestHandler = async (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).json({ msg: "Unauthorized" });
  }
  const token = req.headers.authorization.split(" ")[1];
  if (!token) {
    return res.status(404).json({ msg: "Unauthorized" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as User;
    req.userId = decoded.userId as number;
    next();
  } catch (error) {
    return res.status(401).json({ msg: "Token is invalid" });
  }
};

export const validateUser: RequestHandler = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!req.headers.authorization || !token) {
    return res.status(200).json({ user: null });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as User;
    req.userId = decoded.userId as number;
    next();
  } catch (error) {
    return res.status(200).json({ user: null });
  }
};
