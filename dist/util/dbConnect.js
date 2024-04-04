"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mysql2_1 = __importDefault(require("mysql2"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const config = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: "m_shop",
    connectionLimit: 10,
    waitForConnections: true,
    queueLimit: 0,
};
const db = mysql2_1.default.createPool(config);
exports.default = db.promise();
// export const startServer = async (cb: () => void) => {
//   try {
//     await conn.connect();
//     console.log("connect db success");
//     cb();
//   } catch (err) {
//     console.log(err);
//     return;
//   }
// };
