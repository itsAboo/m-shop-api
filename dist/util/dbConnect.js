"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mysql2_1 = __importDefault(require("mysql2"));
const dotenv_1 = __importDefault(require("dotenv"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
const config = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    connectionLimit: 10,
    waitForConnections: true,
    port: Number(process.env.DB_PORT),
    queueLimit: 0,
    ssl: {
        ca: fs_1.default.readFileSync(path_1.default.join(__dirname, "../../ca.pem")),
    },
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
