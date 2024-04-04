import { RowDataPacket } from "mysql2";

export interface Cart extends RowDataPacket {
  cartId?: number;
  userId?: number;
  totalPrice?: number;
  totalCartItems?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CartItems extends RowDataPacket {
  cartItemsId?: number;
  cartId?: number;
  productId?: number;
  quantity?: number;
  totalPrice?: number;
  size?: string;
  color?: string;
  status?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
