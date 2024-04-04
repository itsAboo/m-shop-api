import { RowDataPacket } from "mysql2";

export default interface User extends RowDataPacket {
  userId?: number;
  email?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  address?: string;
  phoneNumber?: number;
  role?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
