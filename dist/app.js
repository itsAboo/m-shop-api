"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const user_route_1 = __importDefault(require("./routes/user.route"));
const product_route_1 = __importDefault(require("./routes/product.route"));
const wishlist_route_1 = __importDefault(require("./routes/wishlist.route"));
const cart_route_1 = __importDefault(require("./routes/cart.route"));
const order_route_1 = __importDefault(require("./routes/order.route"));
const app = (0, express_1.default)();
const origin = "https://m-shop1.vercel.app";
// "https://m-shop1.vercel.app"
app.use((0, morgan_1.default)("dev"));
app.use((0, cors_1.default)({ origin: origin, credentials: true }));
app.use(express_1.default.json());
app.use("/api", user_route_1.default);
app.use("/api", product_route_1.default);
app.use("/api", wishlist_route_1.default);
app.use("/api", cart_route_1.default);
app.use("/api", order_route_1.default);
app.listen(3000, () => {
    console.log("start server on port 3000");
});
