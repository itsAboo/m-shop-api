import { RowDataPacket } from "mysql2";

export default interface Product extends RowDataPacket {
  productId?: number;
  name?: string;
  description?: string;
  imageUrl?: string;
  price?: number;
  colors?: string;
  size?: string;
  type?: string;
  category?: string;
  subCategory?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
