import mysql2 from "mysql2";
import dotenv from "dotenv";
dotenv.config();

const config = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectionLimit: 10,
  waitForConnections: true,
  queueLimit: 0,
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
