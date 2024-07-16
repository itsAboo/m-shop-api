import mysql2 from "mysql2";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
dotenv.config();

const config = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectionLimit: 10,
  waitForConnections: true,
  queueLimit: 0,
  ssl: {
    ca: fs.readFileSync(path.join(__dirname, "../../ca.pem")),
  },
};

const db = mysql2.createPool(config);

export default db.promise();
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
