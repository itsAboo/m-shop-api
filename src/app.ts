import express from "express";
import cors from "cors";
import morgan from "morgan";
import userRoute from "./routes/user.route";
import productRoute from "./routes/product.route";
import wishListRoute from "./routes/wishlist.route";
import cartRoute from "./routes/cart.route";
import orderRoute from "./routes/order.route";
import dotenv from "dotenv";
dotenv.config();

declare global {
  namespace Express {
    interface Request {
      userId: number;
    }
  }
}

const app = express();
const origin = process.env.ORIGIN;
app.use(morgan("dev"));
app.use(cors({ origin: origin, credentials: true }));
app.use(express.json());

app.use("/api", userRoute);
app.use("/api", productRoute);
app.use("/api", wishListRoute);
app.use("/api", cartRoute);
app.use("/api", orderRoute);

app.listen(3000, () => {
  console.log("start server on port 3000");
});
